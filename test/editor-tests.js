/**
 * @fileoverview Editor tests for M4: Basic Score Editor.
 *
 * Tests cover:
 *   - Command system (undo/redo)
 *   - Cursor navigation and note creation
 *   - Templates (new score creation)
 *   - SDM manipulation (insert/delete/modify notes, measures, signatures)
 *   - Round-trip validation (edit → CBOR → decode → verify)
 */

'use strict';

var path = require('path');
var fs = require('fs');

var Commands = require('../editor/commands.js');
var Cursor = require('../editor/cursor.js');
var Input = require('../editor/inputhandler.js');
var Templates = require('../editor/templates.js');
var SDM = require('../musicxml/sdm.js');
var ScoreCBOR = require('../musicxml/scorecbor.js');

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

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'Assertion failed');
}

log('\nEditor Test Suite (M4)');
log('==========================\n');

// ===== Group 1: Command History =====
log('Command History:');

test('Empty history: canUndo/canRedo are false', function() {
  var h = new Commands.CommandHistory();
  assert(!h.canUndo(), 'should not canUndo');
  assert(!h.canRedo(), 'should not canRedo');
});

test('Execute pushes onto undo stack', function() {
  var h = new Commands.CommandHistory();
  var sdm = Templates.classicalGuitar({ measures: 2 });
  var note = { type: 'note', pitch: { step: 'C', octave: 4, alter: 0 }, duration: 2, voice: 1, noteType: 'quarter', stem: 'up' };
  var cmd = new Commands.InsertNoteCommand(sdm, 0, 0, 1, note);
  h.execute(cmd);
  assert(h.canUndo(), 'should canUndo');
  assert(!h.canRedo(), 'should not canRedo');
});

test('Undo reverses insert', function() {
  var sdm = Templates.classicalGuitar({ measures: 2 });
  var h = new Commands.CommandHistory();
  var origLen = sdm.parts[0].measures[0].elements.length;
  var note = { type: 'note', pitch: { step: 'E', octave: 4, alter: 0 }, duration: 2, voice: 1, noteType: 'quarter', stem: 'up' };
  h.execute(new Commands.InsertNoteCommand(sdm, 0, 0, 1, note));
  assert(sdm.parts[0].measures[0].elements.length === origLen + 1, 'note inserted');
  h.undo();
  assert(sdm.parts[0].measures[0].elements.length === origLen, 'note removed');
});

test('Redo re-applies insert', function() {
  var sdm = Templates.classicalGuitar({ measures: 2 });
  var h = new Commands.CommandHistory();
  var origLen = sdm.parts[0].measures[0].elements.length;
  var note = { type: 'note', pitch: { step: 'D', octave: 4, alter: 0 }, duration: 2, voice: 1, noteType: 'quarter', stem: 'up' };
  h.execute(new Commands.InsertNoteCommand(sdm, 0, 0, 1, note));
  h.undo();
  h.redo();
  assert(sdm.parts[0].measures[0].elements.length === origLen + 1, 'note re-inserted');
});

test('New execute clears redo stack', function() {
  var sdm = Templates.classicalGuitar({ measures: 2 });
  var h = new Commands.CommandHistory();
  var n1 = { type: 'note', pitch: { step: 'C', octave: 4, alter: 0 }, duration: 2, voice: 1, noteType: 'quarter', stem: 'up' };
  var n2 = { type: 'note', pitch: { step: 'D', octave: 4, alter: 0 }, duration: 2, voice: 1, noteType: 'quarter', stem: 'up' };
  h.execute(new Commands.InsertNoteCommand(sdm, 0, 0, 1, n1));
  h.undo();
  assert(h.canRedo(), 'has redo');
  h.execute(new Commands.InsertNoteCommand(sdm, 0, 0, 1, n2));
  assert(!h.canRedo(), 'redo cleared');
});

test('History onChange listener fires', function() {
  var h = new Commands.CommandHistory();
  var sdm = Templates.classicalGuitar({ measures: 1 });
  var count = 0;
  h.onChange(function() { count++; });
  var note = { type: 'rest', duration: 2, voice: 1, noteType: 'quarter' };
  h.execute(new Commands.InsertNoteCommand(sdm, 0, 0, 0, note));
  assert(count === 1, 'listener called once');
  h.undo();
  assert(count === 2, 'listener called on undo');
});

// ===== Group 2: Delete and Modify Commands =====
log('\nDelete & Modify Commands:');

test('DeleteNoteCommand removes and restores note', function() {
  var sdm = Templates.classicalGuitar({ measures: 1 });
  var note = { type: 'note', pitch: { step: 'A', octave: 4, alter: 0 }, duration: 2, voice: 1, noteType: 'quarter', stem: 'up' };
  sdm.parts[0].measures[0].elements.push(note);
  var lenBefore = sdm.parts[0].measures[0].elements.length;
  var idx = lenBefore - 1;

  var h = new Commands.CommandHistory();
  h.execute(new Commands.DeleteNoteCommand(sdm, 0, 0, idx));
  assert(sdm.parts[0].measures[0].elements.length === lenBefore - 1, 'deleted');
  h.undo();
  assert(sdm.parts[0].measures[0].elements.length === lenBefore, 'restored');
  var restored = sdm.parts[0].measures[0].elements[idx];
  assert(restored.pitch.step === 'A', 'pitch preserved');
});

test('ModifyNoteCommand changes pitch and reverts', function() {
  var sdm = Templates.classicalGuitar({ measures: 1 });
  var note = { type: 'note', pitch: { step: 'C', octave: 4, alter: 0 }, duration: 2, voice: 1, noteType: 'quarter', stem: 'up' };
  sdm.parts[0].measures[0].elements.push(note);
  var idx = sdm.parts[0].measures[0].elements.length - 1;

  var h = new Commands.CommandHistory();
  h.execute(new Commands.ModifyNoteCommand(sdm, 0, 0, idx, { pitch: { step: 'G', octave: 5, alter: 0 } }));
  assert(sdm.parts[0].measures[0].elements[idx].pitch.step === 'G', 'pitch changed');
  assert(sdm.parts[0].measures[0].elements[idx].pitch.octave === 5, 'octave changed');
  h.undo();
  assert(sdm.parts[0].measures[0].elements[idx].pitch.step === 'C', 'pitch reverted');
  assert(sdm.parts[0].measures[0].elements[idx].pitch.octave === 4, 'octave reverted');
});

// ===== Group 3: Measure Commands =====
log('\nMeasure Commands:');

test('InsertMeasureCommand adds measure with renumbering', function() {
  var sdm = Templates.classicalGuitar({ measures: 3 });
  var h = new Commands.CommandHistory();
  assert(sdm.parts[0].measures.length === 3, 'starts with 3');
  h.execute(new Commands.InsertMeasureCommand(sdm, 0, 1));
  assert(sdm.parts[0].measures.length === 4, 'now 4');
  assert(sdm.parts[0].measures[1].number === '2', 'inserted is #2');
  assert(sdm.parts[0].measures[2].number === '3', 'old #2 is now #3');
  assert(sdm.parts[0].measures[3].number === '4', 'old #3 is now #4');
  h.undo();
  assert(sdm.parts[0].measures.length === 3, 'back to 3');
  assert(sdm.parts[0].measures[1].number === '2', 'renumbered back');
});

test('DeleteMeasureCommand removes with renumbering', function() {
  var sdm = Templates.classicalGuitar({ measures: 4 });
  var h = new Commands.CommandHistory();
  h.execute(new Commands.DeleteMeasureCommand(sdm, 0, 1));
  assert(sdm.parts[0].measures.length === 3, '3 after delete');
  assert(sdm.parts[0].measures[1].number === '2', 'renumbered');
  h.undo();
  assert(sdm.parts[0].measures.length === 4, 'restored');
});

// ===== Group 4: Signature Commands =====
log('\nSignature Commands:');

test('ChangeSignatureCommand modifies time signature', function() {
  var sdm = Templates.classicalGuitar({ measures: 1 });
  var h = new Commands.CommandHistory();
  h.execute(new Commands.ChangeSignatureCommand(sdm, 0, 0, {
    time: { beats: 3, beatType: 4 }
  }));
  var attrs = sdm.parts[0].measures[0].elements[0];
  assert(attrs.time.beats === 3, 'beats changed');
  assert(attrs.time.beatType === 4, 'beatType changed');
  h.undo();
  attrs = sdm.parts[0].measures[0].elements[0];
  assert(attrs.time.beats === 4, 'beats reverted');
});

test('ChangeSignatureCommand creates attributes if missing', function() {
  var sdm = Templates.classicalGuitar({ measures: 2 });
  var h = new Commands.CommandHistory();
  // Measure 2 has no attributes
  var m1Elements = sdm.parts[0].measures[1].elements;
  var hasAttrs = m1Elements.some(function(e) { return e.type === 'attributes'; });
  assert(!hasAttrs, 'no attrs initially in measure 2');

  h.execute(new Commands.ChangeSignatureCommand(sdm, 0, 1, {
    key: { fifths: 2, mode: 'major' }
  }));
  hasAttrs = m1Elements.some(function(e) { return e.type === 'attributes'; });
  assert(hasAttrs, 'attrs created');
  assert(m1Elements[0].key.fifths === 2, 'key set');

  h.undo();
  hasAttrs = m1Elements.some(function(e) { return e.type === 'attributes'; });
  assert(!hasAttrs, 'attrs removed on undo');
});

// ===== Group 5: Cursor =====
log('\nCursor:');

test('Cursor initializes at position 0,0,0', function() {
  var sdm = Templates.classicalGuitar({ measures: 4 });
  var c = new Cursor.Cursor(sdm);
  assert(c.partIndex === 0, 'part 0');
  assert(c.measureIndex === 0, 'measure 0');
  assert(c.elementIndex === 0, 'element 0');
});

test('Cursor moveRight advances to next note/rest', function() {
  var sdm = Templates.classicalGuitar({ measures: 4 });
  var c = new Cursor.Cursor(sdm);
  // First element is attributes, second is rest
  c.elementIndex = 0;
  var moved = c.moveRight();
  assert(moved, 'moved right');
  var el = c.currentElement();
  assert(el && el.type === 'rest', 'landed on rest');
});

test('Cursor moveRight crosses measure boundary', function() {
  var sdm = Templates.classicalGuitar({ measures: 2 });
  var c = new Cursor.Cursor(sdm);
  // Move to last element of first measure, then right
  c.elementIndex = sdm.parts[0].measures[0].elements.length - 1;
  var moved = c.moveRight();
  assert(moved, 'crossed boundary');
  assert(c.measureIndex === 1, 'now in measure 1');
});

test('Cursor moveLeft goes backward', function() {
  var sdm = Templates.classicalGuitar({ measures: 2 });
  var c = new Cursor.Cursor(sdm);
  c.measureIndex = 1;
  c.elementIndex = 0;
  var moved = c.moveLeft();
  assert(moved, 'moved left');
  assert(c.measureIndex === 0, 'back to measure 0');
});

test('Cursor createNoteElement produces correct SDM', function() {
  var sdm = Templates.classicalGuitar({ measures: 1, divisions: 4 });
  var c = new Cursor.Cursor(sdm);
  c.setDuration('quarter');
  var note = c.createNoteElement('E', 4, 0);
  assert(note.type === 'note', 'is note');
  assert(note.pitch.step === 'E', 'step E');
  assert(note.pitch.octave === 4, 'octave 4');
  assert(note.duration === 4, 'duration = divisions * 1');
  assert(note.noteType === 'quarter', 'noteType quarter');
});

test('Cursor createNoteElement with dots', function() {
  var sdm = Templates.classicalGuitar({ measures: 1, divisions: 4 });
  var c = new Cursor.Cursor(sdm);
  c.setDuration('half');
  c.toggleDot();
  var note = c.createNoteElement('C', 5, 0);
  assert(note.duration === 12, 'dotted half = 8 + 4 = 12');
  assert(note.dots === 1, 'has dot');
});

test('Cursor createNoteElement in rest mode', function() {
  var sdm = Templates.classicalGuitar({ measures: 1 });
  var c = new Cursor.Cursor(sdm);
  c.toggleRest();
  var rest = c.createNoteElement('C', 4, 0);
  assert(rest.type === 'rest', 'is rest');
  assert(!rest.pitch, 'no pitch');
});

test('Cursor pitchUp/pitchDown work correctly', function() {
  var sdm = Templates.classicalGuitar({ measures: 1 });
  var c = new Cursor.Cursor(sdm);
  var note = { pitch: { step: 'E', octave: 4, alter: 0 } };
  var up = c.pitchUp(note);
  assert(up.step === 'F', 'E→F');
  assert(up.octave === 4, 'same octave');

  note.pitch.step = 'B';
  up = c.pitchUp(note);
  assert(up.step === 'C', 'B→C');
  assert(up.octave === 5, 'octave up');

  note.pitch.step = 'C'; note.pitch.octave = 5;
  var down = c.pitchDown(note);
  assert(down.step === 'B', 'C→B');
  assert(down.octave === 4, 'octave down');
});

// ===== Group 6: Templates =====
log('\nTemplates:');

test('classicalGuitar template creates valid SDM', function() {
  var sdm = Templates.classicalGuitar({ title: 'Test', composer: 'Tester', measures: 4 });
  assert(sdm.version === '1.0', 'version');
  assert(sdm.metadata.workTitle === 'Test', 'title');
  assert(sdm.metadata.creator.text === 'Tester', 'composer');
  assert(sdm.partList.length === 1, '1 part');
  assert(sdm.partList[0].name === 'Classical Guitar', 'instrument');
  assert(sdm.parts[0].measures.length === 4, '4 measures');

  // First measure has attributes
  var m0 = sdm.parts[0].measures[0];
  var attrs = m0.elements.find(function(e) { return e.type === 'attributes'; });
  assert(attrs, 'has attributes');
  assert(attrs.divisions === 2, 'divisions');
  assert(attrs.clef.sign === 'G', 'treble clef');
  assert(attrs.time.beats === 4, '4/4 time');

  // Last measure has final barline
  var mLast = sdm.parts[0].measures[3];
  var barline = mLast.elements.find(function(e) { return e.type === 'barline'; });
  assert(barline, 'has barline');
  assert(barline.barStyle === 'light-heavy', 'final barline');
});

test('leadSheet template creates valid SDM', function() {
  var sdm = Templates.leadSheet({ title: 'My Song' });
  assert(sdm.partList[0].name === 'Melody', 'melody part');
  assert(sdm.metadata.workTitle === 'My Song', 'title');
});

test('Template list returns expected names', function() {
  var names = Templates.list();
  assert(names.indexOf('classicalGuitar') >= 0, 'has classicalGuitar');
  assert(names.indexOf('leadSheet') >= 0, 'has leadSheet');
});

// ===== Group 7: Template SDM → CBOR Round-Trip =====
log('\nEditor SDM → CBOR Round-Trip:');

test('New template survives CBOR round-trip', function() {
  var sdm = Templates.classicalGuitar({ title: 'RT Test', measures: 4 });
  var cbor = ScoreCBOR.encode(sdm);
  var decoded = ScoreCBOR.decode(cbor);
  assert(decoded.metadata.workTitle === 'RT Test', 'title preserved');
  assert(decoded.parts[0].measures.length === 4, 'measures preserved');
});

test('Edited template survives CBOR round-trip', function() {
  var sdm = Templates.classicalGuitar({ measures: 2, divisions: 2 });
  var h = new Commands.CommandHistory();

  // Insert some notes
  var note1 = { type: 'note', pitch: { step: 'C', octave: 4, alter: 0 }, duration: 2, voice: 1, noteType: 'quarter', stem: 'up' };
  var note2 = { type: 'note', pitch: { step: 'E', octave: 4, alter: 0 }, duration: 2, voice: 1, noteType: 'quarter', stem: 'up' };
  h.execute(new Commands.InsertNoteCommand(sdm, 0, 0, 1, note1));
  h.execute(new Commands.InsertNoteCommand(sdm, 0, 0, 2, note2));

  // CBOR round-trip
  var cbor = ScoreCBOR.encodeFile(sdm);
  var decoded = ScoreCBOR.decodeFile(cbor);

  assert(decoded.parts[0].measures[0].elements.length === sdm.parts[0].measures[0].elements.length, 'element count');
  var decodedNote = decoded.parts[0].measures[0].elements[1];
  assert(decodedNote.pitch.step === 'C', 'note1 step');
  var decodedNote2 = decoded.parts[0].measures[0].elements[2];
  assert(decodedNote2.pitch.step === 'E', 'note2 step');
});

test('Edited template → MusicXML → SDM round-trip', function() {
  var DOMParser;
  try {
    DOMParser = require('@xmldom/xmldom').DOMParser;
  } catch (e) {
    log('    (skipped — @xmldom/xmldom not available)');
    return;
  }

  var sdm = Templates.classicalGuitar({ title: 'XML RT', measures: 2, divisions: 2 });
  var h = new Commands.CommandHistory();
  var note = { type: 'note', pitch: { step: 'G', octave: 4, alter: 0 }, duration: 4, voice: 1, noteType: 'half', stem: 'up' };
  h.execute(new Commands.InsertNoteCommand(sdm, 0, 0, 1, note));

  // SDM → MusicXML → SDM
  var xml = SDM.toMusicXML(sdm);
  var doc = new DOMParser().parseFromString(xml, 'text/xml');
  var sdm2 = SDM.fromMusicXML(doc);

  assert(sdm2.metadata.workTitle === 'XML RT', 'title');
  assert(sdm2.parts[0].measures[0].elements.length === sdm.parts[0].measures[0].elements.length, 'elements');
  var n = sdm2.parts[0].measures[0].elements[1];
  assert(n.pitch.step === 'G', 'note pitch');
});

// ===== Group 8: Multi-Step Undo/Redo =====
log('\nMulti-Step Undo/Redo:');

test('Multiple undos and redos work correctly', function() {
  var sdm = Templates.classicalGuitar({ measures: 1 });
  var h = new Commands.CommandHistory();
  var origLen = sdm.parts[0].measures[0].elements.length;

  var notes = ['C', 'D', 'E', 'F', 'G'];
  for (var i = 0; i < notes.length; i++) {
    var n = { type: 'note', pitch: { step: notes[i], octave: 4, alter: 0 }, duration: 2, voice: 1, noteType: 'quarter', stem: 'up' };
    h.execute(new Commands.InsertNoteCommand(sdm, 0, 0, origLen + i, n));
  }
  assert(sdm.parts[0].measures[0].elements.length === origLen + 5, '5 notes added');

  // Undo 3 times
  h.undo(); h.undo(); h.undo();
  assert(sdm.parts[0].measures[0].elements.length === origLen + 2, '3 undone');

  // Redo 2 times
  h.redo(); h.redo();
  assert(sdm.parts[0].measures[0].elements.length === origLen + 4, '2 redone');

  // Undo all
  while (h.canUndo()) h.undo();
  assert(sdm.parts[0].measures[0].elements.length === origLen, 'all undone');
});

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
