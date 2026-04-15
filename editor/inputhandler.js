/**
 * @fileoverview Keyboard and mouse input handler for the score editor.
 *
 * Binds to a canvas element and translates user events into editor commands.
 *
 * Keyboard shortcuts:
 *   A-G         — Enter note at that pitch (in current octave)
 *   1-6         — Set duration (1=whole, 2=half, 3=quarter, 4=eighth, 5=16th, 6=32nd)
 *   .           — Toggle dot
 *   R           — Toggle rest mode
 *   Up/Down     — Pitch up/down (when note selected)
 *   Left/Right  — Move cursor
 *   Delete/Backspace — Delete note at cursor
 *   Ctrl+Z      — Undo
 *   Ctrl+Y / Ctrl+Shift+Z — Redo
 *   +           — Add measure after current
 *   -           — Delete current measure
 *   Shift+Up/Down — Octave up/down
 *
 * Mouse:
 *   Click on staff — Move cursor (not implemented in this phase; placeholder)
 */

'use strict';

var EditorInput;
if (typeof exports !== 'undefined') {
  EditorInput = exports;
} else {
  if (typeof goog !== 'undefined') {
    goog.provide('ScoreLibrary.Editor.InputHandler');
  }
  EditorInput = (typeof ScoreLibrary !== 'undefined') ?
    (ScoreLibrary.Editor = ScoreLibrary.Editor || {},
     ScoreLibrary.Editor.InputHandler = {}) : {};
}

// Require commands and cursor modules
var EditorCommands_ref, EditorCursor_ref;
if (typeof require !== 'undefined') {
  EditorCommands_ref = require('./commands.js');
  EditorCursor_ref = require('./cursor.js');
} else {
  EditorCommands_ref = (typeof ScoreLibrary !== 'undefined') ?
    ScoreLibrary.Editor.Commands : {};
  EditorCursor_ref = (typeof ScoreLibrary !== 'undefined') ?
    ScoreLibrary.Editor.Cursor : {};
}

/**
 * Duration key mappings: keyboard digit → duration name.
 */
var DURATION_KEYS = {
  '1': 'whole',
  '2': 'half',
  '3': 'quarter',
  '4': 'eighth',
  '5': '16th',
  '6': '32nd'
};

/**
 * Pitch letter keys → default octave 4.
 */
var PITCH_KEYS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

/**
 * @constructor
 * @param {Object} cursor — EditorCursor.Cursor instance
 * @param {Object} history — EditorCommands.CommandHistory instance
 * @param {Object} sdm — SDM document
 * @param {function} onScoreChanged — callback when score is modified (for re-render)
 */
EditorInput.InputHandler = function(cursor, history, sdm, onScoreChanged) {
  this.cursor = cursor;
  this.history = history;
  this.sdm = sdm;
  this.onScoreChanged = onScoreChanged || function() {};
  this.currentOctave = 4;
  this.enabled = false;
  this._boundKeyDown = null;
};

/**
 * Bind keyboard events to the given DOM element.
 * @param {Element} element — usually the canvas or a wrapping div
 */
EditorInput.InputHandler.prototype.bind = function(element) {
  this.element = element;
  // Make element focusable
  if (!element.getAttribute('tabindex')) {
    element.setAttribute('tabindex', '0');
  }
  this._boundKeyDown = this._onKeyDown.bind(this);
  element.addEventListener('keydown', this._boundKeyDown);
  this.enabled = true;
};

/**
 * Unbind all event listeners.
 */
EditorInput.InputHandler.prototype.unbind = function() {
  if (this.element && this._boundKeyDown) {
    this.element.removeEventListener('keydown', this._boundKeyDown);
  }
  this.enabled = false;
};

/**
 * Handle keydown event.
 * @param {KeyboardEvent} e
 * @private
 */
EditorInput.InputHandler.prototype._onKeyDown = function(e) {
  if (!this.enabled) return;

  var key = e.key;
  var ctrl = e.ctrlKey || e.metaKey;
  var shift = e.shiftKey;

  // Undo/Redo
  if (ctrl && key === 'z' && !shift) {
    e.preventDefault();
    this.history.undo();
    this.onScoreChanged();
    return;
  }
  if (ctrl && (key === 'y' || (key === 'z' && shift) || key === 'Z')) {
    e.preventDefault();
    this.history.redo();
    this.onScoreChanged();
    return;
  }

  // Duration keys (1-6)
  if (DURATION_KEYS[key]) {
    e.preventDefault();
    this.cursor.setDuration(DURATION_KEYS[key]);
    return;
  }

  // Dot toggle
  if (key === '.') {
    e.preventDefault();
    this.cursor.toggleDot();
    return;
  }

  // Rest toggle
  if (key === 'r' || key === 'R') {
    e.preventDefault();
    this.cursor.toggleRest();
    return;
  }

  // Pitch input (A-G)
  var upperKey = key.toUpperCase();
  if (PITCH_KEYS.indexOf(upperKey) !== -1 && !ctrl) {
    e.preventDefault();
    this._insertNote(upperKey);
    return;
  }

  // Arrow keys: cursor movement and pitch adjustment
  if (key === 'ArrowRight') {
    e.preventDefault();
    this.cursor.moveRight();
    return;
  }
  if (key === 'ArrowLeft') {
    e.preventDefault();
    this.cursor.moveLeft();
    return;
  }
  if (key === 'ArrowUp') {
    e.preventDefault();
    if (shift) {
      this._octaveUp();
    } else {
      this._pitchUp();
    }
    return;
  }
  if (key === 'ArrowDown') {
    e.preventDefault();
    if (shift) {
      this._octaveDown();
    } else {
      this._pitchDown();
    }
    return;
  }

  // Delete
  if (key === 'Delete' || key === 'Backspace') {
    e.preventDefault();
    this._deleteNote();
    return;
  }

  // Add/remove measure
  if (key === '+' || key === '=') {
    e.preventDefault();
    this._addMeasure();
    return;
  }
  if (key === '-' && !ctrl) {
    e.preventDefault();
    this._removeMeasure();
    return;
  }
};

/**
 * Insert a note at the cursor position.
 * @param {string} step — 'C'..'B'
 * @private
 */
EditorInput.InputHandler.prototype._insertNote = function(step) {
  var noteData = this.cursor.createNoteElement(step, this.currentOctave, 0);
  var cmd = new EditorCommands_ref.InsertNoteCommand(
    this.sdm,
    this.cursor.partIndex,
    this.cursor.measureIndex,
    this.cursor.elementIndex,
    noteData
  );
  this.history.execute(cmd);
  // Advance cursor past the inserted note
  this.cursor.elementIndex++;
  this.onScoreChanged();
};

/**
 * Delete the note at cursor.
 * @private
 */
EditorInput.InputHandler.prototype._deleteNote = function() {
  var element = this.cursor.currentElement();
  if (!element || (element.type !== 'note' && element.type !== 'rest')) return;

  var cmd = new EditorCommands_ref.DeleteNoteCommand(
    this.sdm,
    this.cursor.partIndex,
    this.cursor.measureIndex,
    this.cursor.elementIndex
  );
  this.history.execute(cmd);
  // Adjust cursor if at end
  if (this.cursor.elementIndex >= this.cursor.elementCount()) {
    this.cursor.elementIndex = Math.max(0, this.cursor.elementCount() - 1);
  }
  this.onScoreChanged();
};

/**
 * Move the selected note's pitch up by a step.
 * @private
 */
EditorInput.InputHandler.prototype._pitchUp = function() {
  var element = this.cursor.currentElement();
  if (!element || !element.pitch) return;

  var newPitch = this.cursor.pitchUp(element);
  if (!newPitch) return;

  var cmd = new EditorCommands_ref.ModifyNoteCommand(
    this.sdm,
    this.cursor.partIndex,
    this.cursor.measureIndex,
    this.cursor.elementIndex,
    { pitch: newPitch }
  );
  this.history.execute(cmd);
  this.onScoreChanged();
};

/**
 * Move the selected note's pitch down by a step.
 * @private
 */
EditorInput.InputHandler.prototype._pitchDown = function() {
  var element = this.cursor.currentElement();
  if (!element || !element.pitch) return;

  var newPitch = this.cursor.pitchDown(element);
  if (!newPitch) return;

  var cmd = new EditorCommands_ref.ModifyNoteCommand(
    this.sdm,
    this.cursor.partIndex,
    this.cursor.measureIndex,
    this.cursor.elementIndex,
    { pitch: newPitch }
  );
  this.history.execute(cmd);
  this.onScoreChanged();
};

/**
 * Octave up (Shift+Up).
 * @private
 */
EditorInput.InputHandler.prototype._octaveUp = function() {
  var element = this.cursor.currentElement();
  if (element && element.pitch) {
    var newPitch = {
      step: element.pitch.step,
      octave: element.pitch.octave + 1,
      alter: element.pitch.alter || 0
    };
    var cmd = new EditorCommands_ref.ModifyNoteCommand(
      this.sdm, this.cursor.partIndex, this.cursor.measureIndex,
      this.cursor.elementIndex, { pitch: newPitch }
    );
    this.history.execute(cmd);
    this.onScoreChanged();
  } else {
    this.currentOctave = Math.min(8, this.currentOctave + 1);
  }
};

/**
 * Octave down (Shift+Down).
 * @private
 */
EditorInput.InputHandler.prototype._octaveDown = function() {
  var element = this.cursor.currentElement();
  if (element && element.pitch) {
    var newPitch = {
      step: element.pitch.step,
      octave: element.pitch.octave - 1,
      alter: element.pitch.alter || 0
    };
    var cmd = new EditorCommands_ref.ModifyNoteCommand(
      this.sdm, this.cursor.partIndex, this.cursor.measureIndex,
      this.cursor.elementIndex, { pitch: newPitch }
    );
    this.history.execute(cmd);
    this.onScoreChanged();
  } else {
    this.currentOctave = Math.max(1, this.currentOctave - 1);
  }
};

/**
 * Add a measure after the current one.
 * @private
 */
EditorInput.InputHandler.prototype._addMeasure = function() {
  var insertAt = this.cursor.measureIndex + 1;
  var cmd = new EditorCommands_ref.InsertMeasureCommand(
    this.sdm, this.cursor.partIndex, insertAt
  );
  this.history.execute(cmd);
  this.onScoreChanged();
};

/**
 * Remove the current measure (if more than 1 remains).
 * @private
 */
EditorInput.InputHandler.prototype._removeMeasure = function() {
  if (this.cursor.measureCount() <= 1) return;

  var cmd = new EditorCommands_ref.DeleteMeasureCommand(
    this.sdm, this.cursor.partIndex, this.cursor.measureIndex
  );
  this.history.execute(cmd);
  if (this.cursor.measureIndex >= this.cursor.measureCount()) {
    this.cursor.measureIndex = Math.max(0, this.cursor.measureCount() - 1);
  }
  this.cursor.elementIndex = 0;
  this.onScoreChanged();
};
