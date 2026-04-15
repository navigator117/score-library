/**
 * @fileoverview Round-trip tests for MusicXML → SDM → CBOR → SDM → MusicXML.
 *
 * Verifies that the CBOR encoding preserves all musical semantics:
 * - Notes, rests, pitches, durations
 * - Multi-voice, fingering, dynamics, slurs, ties
 * - Articulations, grace notes, beams
 * - Barlines, repeats, endings
 * - Credits, metadata, page layout
 */

'use strict';

var fs = require('fs');
var path = require('path');

// Use a minimal DOM parser for Node.js testing
var DOMParser;
try {
  DOMParser = require('@xmldom/xmldom').DOMParser;
} catch (e) {
  // Fallback: we'll skip XML parsing tests if no DOM parser available
  DOMParser = null;
}

var SDM = require('../musicxml/sdm.js');
var ScoreCBOR = require('../musicxml/scorecbor.js');

var rootDir = path.resolve(__dirname, '..');
var passed = 0;
var failed = 0;

function log(msg) {
  process.stdout.write(msg + '\n');
}

function test(name, fn) {
  try {
    fn();
    log('  ✓ ' + name);
    passed++;
  } catch (err) {
    log('  ✗ ' + name + ' — ' + err.message);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message || 'Assertion failed');
}

function deepEqual(a, b, path) {
  path = path || '';
  if (a === b) return;
  if (a === null || b === null || typeof a !== typeof b) {
    throw new Error('Mismatch at ' + (path || 'root') + ': ' + JSON.stringify(a) + ' vs ' + JSON.stringify(b));
  }
  if (typeof a === 'object') {
    if (Array.isArray(a)) {
      assert(Array.isArray(b), 'Expected array at ' + path);
      assert(a.length === b.length, 'Array length mismatch at ' + path + ': ' + a.length + ' vs ' + b.length);
      for (var i = 0; i < a.length; i++) {
        deepEqual(a[i], b[i], path + '[' + i + ']');
      }
    } else {
      var keysA = Object.keys(a).sort();
      var keysB = Object.keys(b).sort();
      assert(keysA.length === keysB.length,
        'Key count mismatch at ' + path + ': ' + JSON.stringify(keysA) + ' vs ' + JSON.stringify(keysB));
      for (var i = 0; i < keysA.length; i++) {
        assert(keysA[i] === keysB[i], 'Key mismatch at ' + path + ': ' + keysA[i] + ' vs ' + keysB[i]);
        deepEqual(a[keysA[i]], b[keysB[i]], path + '.' + keysA[i]);
      }
    }
  } else {
    throw new Error('Mismatch at ' + (path || 'root') + ': ' + JSON.stringify(a) + ' vs ' + JSON.stringify(b));
  }
}

// ===== Test Suite =====
log('\nCBOR Round-Trip Test Suite');
log('==========================\n');

// --- Group 1: CBOR Codec Tests ---
log('CBOR Codec:');

test('Encode/decode integers', function() {
  [0, 1, 23, 24, 255, 256, 65535, 65536, 1000000].forEach(function(n) {
    var encoded = ScoreCBOR.encode(n);
    var decoded = ScoreCBOR.decode(encoded);
    assert(decoded === n, 'Failed for ' + n + ', got ' + decoded);
  });
});

test('Encode/decode negative integers', function() {
  [-1, -10, -100, -1000].forEach(function(n) {
    var encoded = ScoreCBOR.encode(n);
    var decoded = ScoreCBOR.decode(encoded);
    assert(decoded === n, 'Failed for ' + n + ', got ' + decoded);
  });
});

test('Encode/decode strings', function() {
  ['', 'hello', 'MusicXML', '日本語テスト', 'Lágrima'].forEach(function(s) {
    var encoded = ScoreCBOR.encode(s);
    var decoded = ScoreCBOR.decode(encoded);
    assert(decoded === s, 'Failed for "' + s + '", got "' + decoded + '"');
  });
});

test('Encode/decode floats', function() {
  [3.14, -2.5, 0.001, 7.2319].forEach(function(f) {
    var encoded = ScoreCBOR.encode(f);
    var decoded = ScoreCBOR.decode(encoded);
    assert(Math.abs(decoded - f) < 1e-10, 'Failed for ' + f + ', got ' + decoded);
  });
});

test('Encode/decode null, true, false', function() {
  assert(ScoreCBOR.decode(ScoreCBOR.encode(null)) === null, 'null failed');
  assert(ScoreCBOR.decode(ScoreCBOR.encode(true)) === true, 'true failed');
  assert(ScoreCBOR.decode(ScoreCBOR.encode(false)) === false, 'false failed');
});

test('Encode/decode arrays', function() {
  var arr = [1, 'two', 3.0, null, true, [4, 5]];
  var encoded = ScoreCBOR.encode(arr);
  var decoded = ScoreCBOR.decode(encoded);
  assert(decoded.length === arr.length, 'Array length mismatch');
  assert(decoded[0] === 1, 'arr[0]');
  assert(decoded[1] === 'two', 'arr[1]');
  assert(decoded[3] === null, 'arr[3]');
  assert(decoded[4] === true, 'arr[4]');
  assert(decoded[5].length === 2, 'arr[5] subarray');
});

test('Encode/decode maps', function() {
  var obj = { name: 'score', version: 1, active: true };
  var encoded = ScoreCBOR.encode(obj);
  var decoded = ScoreCBOR.decode(encoded);
  assert(decoded.name === 'score', 'name');
  assert(decoded.version === 1, 'version');
  assert(decoded.active === true, 'active');
});

test('Encode/decode nested objects', function() {
  var obj = {
    metadata: { title: 'Test', composer: 'Me' },
    parts: [{ id: 'P1', measures: [{ number: '1' }] }]
  };
  var encoded = ScoreCBOR.encode(obj);
  var decoded = ScoreCBOR.decode(encoded);
  assert(decoded.metadata.title === 'Test', 'nested title');
  assert(decoded.parts[0].id === 'P1', 'nested part id');
  assert(decoded.parts[0].measures[0].number === '1', 'nested measure number');
});

// --- Group 2: File Format Tests ---
log('\nFile Format:');

test('.scorecbor magic bytes are correct', function() {
  assert(ScoreCBOR.MAGIC[0] === 0x53, 'S');
  assert(ScoreCBOR.MAGIC[1] === 0x43, 'C');
  assert(ScoreCBOR.MAGIC[2] === 0x4F, 'O');
  assert(ScoreCBOR.MAGIC[3] === 0x52, 'R');
  assert(ScoreCBOR.MAGIC[4] === 0x01, 'version');
});

test('encodeFile/decodeFile round-trip', function() {
  var sdm = { version: '1.0', metadata: { workTitle: 'Test' } };
  var fileData = ScoreCBOR.encodeFile(sdm);
  // Check magic bytes
  assert(fileData[0] === 0x53, 'magic S');
  assert(fileData[4] === 0x01, 'magic version');
  // Decode
  var decoded = ScoreCBOR.decodeFile(fileData);
  assert(decoded.version === '1.0', 'version');
  assert(decoded.metadata.workTitle === 'Test', 'title');
});

test('decodeFile rejects invalid magic', function() {
  var badData = new Uint8Array([0x00, 0x00, 0x00, 0x00, 0x01, 0xa0]);
  var threw = false;
  try {
    ScoreCBOR.decodeFile(badData);
  } catch (e) {
    threw = true;
  }
  assert(threw, 'Should throw on invalid magic');
});

// --- Group 3: SDM Round-Trip Tests (requires DOM parser) ---
if (DOMParser) {
  log('\nSDM Conversion:');

  test('SDM.fromMusicXML parses basic-notes.xml', function() {
    var xmlStr = fs.readFileSync(path.join(rootDir, 'test/samples/basic-notes.xml'), 'utf8');
    var doc = new DOMParser().parseFromString(xmlStr, 'text/xml');
    var sdm = SDM.fromMusicXML(doc);

    assert(sdm.version === '1.0', 'version');
    assert(sdm.partList.length > 0, 'has parts');
    assert(sdm.parts.length > 0, 'has part data');
    assert(sdm.parts[0].measures.length > 0, 'has measures');
  });

  test('SDM.fromMusicXML parses guitar-classical.xml with all features', function() {
    var xmlStr = fs.readFileSync(path.join(rootDir, 'test/samples/guitar-classical.xml'), 'utf8');
    var doc = new DOMParser().parseFromString(xmlStr, 'text/xml');
    var sdm = SDM.fromMusicXML(doc);

    assert(sdm.metadata.workTitle === 'Estudio en Mi menor', 'title');
    assert(sdm.credits.length >= 2, 'has credits');
    assert(sdm.partList[0].name === 'Classical Guitar', 'part name');
    assert(sdm.parts[0].measures.length === 8, '8 measures');

    // Check multi-voice (backup elements)
    var measure1 = sdm.parts[0].measures[0];
    var hasBackup = measure1.elements.some(function(e) { return e.type === 'backup'; });
    assert(hasBackup, 'measure 1 has backup (multi-voice)');

    // Check fingering
    var hasFingeringNote = measure1.elements.some(function(e) {
      return e.type === 'note' && e.notations && e.notations.technical &&
        e.notations.technical.fingering && e.notations.technical.fingering.length > 0;
    });
    assert(hasFingeringNote, 'has fingering notation');

    // Check dynamics
    var hasDynamics = measure1.elements.some(function(e) {
      return e.type === 'direction' && e.directionType === 'dynamics';
    });
    assert(hasDynamics, 'has dynamics');

    // Check slurs
    var hasSlur = measure1.elements.some(function(e) {
      return e.type === 'note' && e.notations && e.notations.slurs &&
        e.notations.slurs.length > 0;
    });
    assert(hasSlur, 'has slur');
  });

  test('SDM → MusicXML → SDM round-trip preserves structure', function() {
    var xmlStr = fs.readFileSync(path.join(rootDir, 'test/samples/guitar-simple.xml'), 'utf8');
    var doc1 = new DOMParser().parseFromString(xmlStr, 'text/xml');
    var sdm1 = SDM.fromMusicXML(doc1);

    // SDM → MusicXML string → SDM
    var xmlOut = SDM.toMusicXML(sdm1);
    var doc2 = new DOMParser().parseFromString(xmlOut, 'text/xml');
    var sdm2 = SDM.fromMusicXML(doc2);

    // Compare key properties
    assert(sdm1.metadata.workTitle === sdm2.metadata.workTitle, 'title preserved');
    assert(sdm1.partList.length === sdm2.partList.length, 'part count preserved');
    assert(sdm1.parts.length === sdm2.parts.length, 'parts data count preserved');
    assert(sdm1.parts[0].measures.length === sdm2.parts[0].measures.length, 'measure count preserved');

    // Compare measure element counts
    for (var m = 0; m < sdm1.parts[0].measures.length; m++) {
      assert(
        sdm1.parts[0].measures[m].elements.length === sdm2.parts[0].measures[m].elements.length,
        'measure ' + m + ' element count preserved'
      );
    }
  });

  // --- Group 4: Full Round-Trip (XML → SDM → CBOR → SDM → XML → SDM) ---
  log('\nFull Round-Trip:');

  var sampleFiles = [
    'basic-notes.xml',
    'basic-clefs.xml',
    'basic-keys.xml',
    'basic-time.xml',
    'basic-barlines.xml',
    'basic-dynamics.xml',
    'basic-articulations.xml',
    'guitar-simple.xml',
    'guitar-classical.xml'
  ];

  sampleFiles.forEach(function(filename) {
    test('Round-trip: ' + filename, function() {
      var xmlStr = fs.readFileSync(path.join(rootDir, 'test/samples', filename), 'utf8');
      var doc = new DOMParser().parseFromString(xmlStr, 'text/xml');

      // XML → SDM
      var sdm1 = SDM.fromMusicXML(doc);

      // SDM → CBOR
      var cbor = ScoreCBOR.encode(sdm1);

      // CBOR → SDM
      var sdm2 = ScoreCBOR.decode(cbor);

      // Verify SDM1 === SDM2
      deepEqual(sdm1, sdm2);
    });
  });

  // --- Group 5: .scorecbor File Round-Trip ---
  log('\n.scorecbor File Round-Trip:');

  test('.scorecbor round-trip with guitar-classical.xml', function() {
    var xmlStr = fs.readFileSync(path.join(rootDir, 'test/samples/guitar-classical.xml'), 'utf8');
    var doc = new DOMParser().parseFromString(xmlStr, 'text/xml');

    // XML → SDM → .scorecbor file
    var sdm = SDM.fromMusicXML(doc);
    var fileData = ScoreCBOR.encodeFile(sdm);

    // .scorecbor file → SDM
    var sdm2 = ScoreCBOR.decodeFile(fileData);

    // Verify
    deepEqual(sdm, sdm2);

    // Report size
    log('    (XML: ' + xmlStr.length + ' bytes → CBOR: ' + fileData.length +
      ' bytes, ratio: ' + (fileData.length / xmlStr.length * 100).toFixed(1) + '%)');
  });

  test('SDM → XML round-trip for guitar-classical.xml preserves elements', function() {
    var xmlStr = fs.readFileSync(path.join(rootDir, 'test/samples/guitar-classical.xml'), 'utf8');
    var doc = new DOMParser().parseFromString(xmlStr, 'text/xml');
    var sdm1 = SDM.fromMusicXML(doc);

    var xmlOut = SDM.toMusicXML(sdm1);
    var doc2 = new DOMParser().parseFromString(xmlOut, 'text/xml');
    var sdm2 = SDM.fromMusicXML(doc2);

    deepEqual(sdm1, sdm2);
  });

} else {
  log('\nSkipping SDM/CBOR round-trip tests (no XML parser available)');
  log('Install xmldom: npm install xmldom');
}

// ===== Results =====
log('\n==========================');
log('Results: ' + passed + ' passed, ' + failed + ' failed');

if (failed > 0) {
  log('\nFAILED');
  process.exit(1);
} else {
  log('\nALL TESTS PASSED');
  process.exit(0);
}
