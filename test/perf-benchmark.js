/**
 * @fileoverview Performance benchmarks for score-library.
 *
 * Measures operation latencies for:
 *   - SDM creation from template
 *   - Note insertion (100 notes)
 *   - CBOR encode / decode
 *   - MusicXML export / re-parse
 *   - Undo/redo (100 operations)
 *   - Measure insert/delete
 *
 * Reports timing results and pass/fail against targets.
 */

'use strict';

var fs = require('fs');
var path = require('path');

var Commands = require('../editor/commands.js');
var Cursor = require('../editor/cursor.js');
var Templates = require('../editor/templates.js');
var SDM = require('../musicxml/sdm.js');
var ScoreCBOR = require('../musicxml/scorecbor.js');

var DOMParser;
try {
  DOMParser = require('@xmldom/xmldom').DOMParser;
} catch (e) {
  DOMParser = null;
}

var passed = 0;
var failed = 0;

function log(msg) {
  process.stdout.write(msg + '\n');
}

function benchmark(name, fn, target_ms) {
  var start = process.hrtime.bigint();
  var result = fn();
  var end = process.hrtime.bigint();
  var elapsed_ns = Number(end - start);
  var elapsed_ms = elapsed_ns / 1e6;

  var passStr = target_ms ? (elapsed_ms <= target_ms ? '✓' : '✗') : '·';
  var targetStr = target_ms ? ' (target: <' + target_ms + 'ms)' : '';

  log('  ' + passStr + ' ' + name + ': ' + elapsed_ms.toFixed(2) + 'ms' + targetStr);

  if (target_ms && elapsed_ms <= target_ms) {
    passed++;
  } else if (target_ms) {
    failed++;
  }

  return { elapsed_ms: elapsed_ms, result: result };
}

log('\nPerformance Benchmark Suite');
log('============================\n');

// ===== Group 1: SDM Operations =====
log('SDM Operations:');

benchmark('Create 8-measure template', function() {
  return Templates.classicalGuitar({ measures: 8, divisions: 4 });
}, 5);

benchmark('Create 32-measure template', function() {
  return Templates.classicalGuitar({ measures: 32, divisions: 4 });
}, 10);

var sdm32 = Templates.classicalGuitar({ measures: 32, divisions: 4 });

benchmark('Insert 100 notes via commands', function() {
  var h = new Commands.CommandHistory();
  for (var i = 0; i < 100; i++) {
    var mIdx = i % 32;
    var note = {
      type: 'note',
      pitch: { step: 'CDEFGAB'[i % 7], octave: 4, alter: 0 },
      duration: 4,
      voice: 1,
      noteType: 'quarter',
      stem: 'up'
    };
    h.execute(new Commands.InsertNoteCommand(sdm32, 0, mIdx, 1, note));
  }
  return h;
}, 20);

benchmark('Undo 100 operations', function() {
  var sdmUndo = Templates.classicalGuitar({ measures: 8, divisions: 4 });
  var h = new Commands.CommandHistory();
  for (var i = 0; i < 100; i++) {
    var note = {
      type: 'note',
      pitch: { step: 'C', octave: 4, alter: 0 },
      duration: 4,
      voice: 1,
      noteType: 'quarter',
      stem: 'up'
    };
    h.execute(new Commands.InsertNoteCommand(sdmUndo, 0, 0, 1, note));
  }
  for (var j = 0; j < 100; j++) {
    h.undo();
  }
}, 20);

benchmark('Redo 100 operations', function() {
  var sdmRedo = Templates.classicalGuitar({ measures: 8, divisions: 4 });
  var h = new Commands.CommandHistory();
  for (var i = 0; i < 100; i++) {
    var note = {
      type: 'note',
      pitch: { step: 'C', octave: 4, alter: 0 },
      duration: 4,
      voice: 1,
      noteType: 'quarter',
      stem: 'up'
    };
    h.execute(new Commands.InsertNoteCommand(sdmRedo, 0, 0, 1, note));
  }
  for (var j = 0; j < 100; j++) h.undo();
  for (var k = 0; k < 100; k++) h.redo();
}, 20);

// ===== Group 2: CBOR Codec =====
log('\nCBOR Codec:');

// Populate sdm32 with notes for realistic benchmark
var sdmCbor = Templates.classicalGuitar({ measures: 32, divisions: 4 });
for (var i = 0; i < 128; i++) {
  var mIdx = i % 32;
  sdmCbor.parts[0].measures[mIdx].elements.push({
    type: 'note',
    pitch: { step: 'CDEFGAB'[i % 7], octave: 3 + (i % 3), alter: 0 },
    duration: 4,
    voice: 1,
    noteType: 'quarter',
    stem: i % 2 === 0 ? 'up' : 'down'
  });
}

var encodedCbor;
benchmark('CBOR encode (32-measure, 128 notes)', function() {
  encodedCbor = ScoreCBOR.encodeFile(sdmCbor);
  return encodedCbor;
}, 10);

log('    Encoded size: ' + encodedCbor.length + ' bytes');

benchmark('CBOR decode (32-measure, 128 notes)', function() {
  return ScoreCBOR.decodeFile(encodedCbor);
}, 10);

benchmark('CBOR encode + decode round-trip', function() {
  var encoded = ScoreCBOR.encodeFile(sdmCbor);
  return ScoreCBOR.decodeFile(encoded);
}, 20);

// ===== Group 3: MusicXML Round-Trip =====
log('\nMusicXML Round-Trip:');

var xmlStr;
benchmark('SDM → MusicXML export (32-measure)', function() {
  xmlStr = SDM.toMusicXML(sdmCbor);
  return xmlStr;
}, 10);

log('    XML size: ' + xmlStr.length + ' bytes');

if (DOMParser) {
  benchmark('MusicXML → SDM import (32-measure)', function() {
    var doc = new DOMParser().parseFromString(xmlStr, 'text/xml');
    return SDM.fromMusicXML(doc);
  }, 30);

  benchmark('Full XML round-trip (export → parse → import)', function() {
    var xml = SDM.toMusicXML(sdmCbor);
    var doc = new DOMParser().parseFromString(xml, 'text/xml');
    return SDM.fromMusicXML(doc);
  }, 30);
} else {
  log('  · MusicXML import (skipped — @xmldom/xmldom not available)');
}

// ===== Group 4: Real-World Score =====
log('\nReal-World Score (guitar-classical.xml):');

var rootDir = path.resolve(__dirname, '..');
var guitarXml = fs.readFileSync(path.join(rootDir, 'test/samples/guitar-classical.xml'), 'utf8');

if (DOMParser) {
  var guitarSdm;
  benchmark('Parse guitar-classical.xml → SDM', function() {
    var doc = new DOMParser().parseFromString(guitarXml, 'text/xml');
    guitarSdm = SDM.fromMusicXML(doc);
    return guitarSdm;
  }, 10);

  benchmark('guitar-classical SDM → CBOR', function() {
    return ScoreCBOR.encodeFile(guitarSdm);
  }, 5);

  benchmark('guitar-classical SDM → MusicXML', function() {
    return SDM.toMusicXML(guitarSdm);
  }, 5);

  benchmark('guitar-classical full round-trip (XML → SDM → CBOR → SDM → XML)', function() {
    var doc = new DOMParser().parseFromString(guitarXml, 'text/xml');
    var sdm1 = SDM.fromMusicXML(doc);
    var cbor = ScoreCBOR.encodeFile(sdm1);
    var sdm2 = ScoreCBOR.decodeFile(cbor);
    return SDM.toMusicXML(sdm2);
  }, 20);
}

// ===== Group 5: Cursor Navigation =====
log('\nCursor Navigation:');

benchmark('1000 moveRight operations', function() {
  var sdmNav = Templates.classicalGuitar({ measures: 100, divisions: 4 });
  // Add notes to navigate through
  for (var m = 0; m < 100; m++) {
    for (var n = 0; n < 4; n++) {
      sdmNav.parts[0].measures[m].elements.push({
        type: 'note',
        pitch: { step: 'C', octave: 4, alter: 0 },
        duration: 4, voice: 1, noteType: 'quarter', stem: 'up'
      });
    }
  }
  var c = new Cursor.Cursor(sdmNav);
  for (var i = 0; i < 1000; i++) {
    c.moveRight();
  }
  return c;
}, 50);

// ===== Group 6: Size Analysis =====
log('\nSize Analysis:');

var sampleFiles = [
  'basic-notes.xml', 'basic-clefs.xml', 'basic-keys.xml', 'basic-time.xml',
  'basic-barlines.xml', 'basic-dynamics.xml', 'basic-articulations.xml',
  'guitar-simple.xml', 'guitar-classical.xml'
];

var totalXml = 0;
var totalCbor = 0;

if (DOMParser) {
  sampleFiles.forEach(function(filename) {
    var xml = fs.readFileSync(path.join(rootDir, 'test/samples', filename), 'utf8');
    var doc = new DOMParser().parseFromString(xml, 'text/xml');
    var sdm = SDM.fromMusicXML(doc);
    var cbor = ScoreCBOR.encodeFile(sdm);
    totalXml += xml.length;
    totalCbor += cbor.length;
    log('  · ' + filename + ': ' + xml.length + 'B XML → ' + cbor.length + 'B CBOR (' +
      (cbor.length / xml.length * 100).toFixed(1) + '%)');
  });
  log('  Total: ' + totalXml + 'B XML → ' + totalCbor + 'B CBOR (' +
    (totalCbor / totalXml * 100).toFixed(1) + '%)');
}

// ===== Group 7: Editor Source Size =====
log('\nEditor Source Size:');

var editorFiles = ['editor/commands.js', 'editor/cursor.js', 'editor/inputhandler.js', 'editor/templates.js'];
var sdmFiles = ['musicxml/sdm.js', 'musicxml/scorecbor.js'];
var rendererFiles = ['renderer/dirtytracker.js', 'renderer/dualcanvas.js'];

function fileSize(f) {
  try {
    return fs.statSync(path.join(rootDir, f)).size;
  } catch (e) {
    return 0;
  }
}

var editorTotal = 0;
editorFiles.forEach(function(f) {
  var sz = fileSize(f);
  editorTotal += sz;
  log('  · ' + f + ': ' + (sz / 1024).toFixed(1) + ' KB');
});
log('  Editor total: ' + (editorTotal / 1024).toFixed(1) + ' KB');

var sdmTotal = 0;
sdmFiles.forEach(function(f) {
  var sz = fileSize(f);
  sdmTotal += sz;
  log('  · ' + f + ': ' + (sz / 1024).toFixed(1) + ' KB');
});
log('  SDM+CBOR total: ' + (sdmTotal / 1024).toFixed(1) + ' KB');

var rendTotal = 0;
rendererFiles.forEach(function(f) {
  var sz = fileSize(f);
  rendTotal += sz;
  log('  · ' + f + ': ' + (sz / 1024).toFixed(1) + ' KB');
});
log('  Renderer additions total: ' + (rendTotal / 1024).toFixed(1) + ' KB');

log('  New code total: ' + ((editorTotal + sdmTotal + rendTotal) / 1024).toFixed(1) + ' KB');

// ===== Results =====
log('\n============================');
log('Results: ' + passed + ' passed, ' + failed + ' failed');

if (failed > 0) {
  log('\nSOME BENCHMARKS EXCEEDED TARGETS');
  process.exit(1);
} else {
  log('\nALL BENCHMARKS WITHIN TARGETS');
  process.exit(0);
}
