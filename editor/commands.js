/**
 * @fileoverview Command system with undo/redo for score editing.
 *
 * Each command encapsulates a single, reversible edit operation on the SDM.
 * Commands are managed by a CommandHistory that maintains undo/redo stacks.
 *
 * Usage (browser via Closure):
 *   goog.require('ScoreLibrary.Editor.Commands');
 *   var history = new ScoreLibrary.Editor.CommandHistory();
 *   history.execute(new ScoreLibrary.Editor.InsertNoteCommand(sdm, ...));
 *   history.undo();
 *   history.redo();
 *
 * Usage (Node.js tests):
 *   var Commands = require('./commands.js');
 *   var history = new Commands.CommandHistory();
 */

'use strict';

var EditorCommands;
if (typeof exports !== 'undefined') {
  EditorCommands = exports;
} else {
  if (typeof goog !== 'undefined') {
    goog.provide('ScoreLibrary.Editor.Commands');
  }
  EditorCommands = (typeof ScoreLibrary !== 'undefined') ?
    (ScoreLibrary.Editor = ScoreLibrary.Editor || {},
     ScoreLibrary.Editor.Commands = {}) : {};
}

// ===== CommandHistory =====

/**
 * Manages undo/redo stacks and command execution.
 * @constructor
 */
EditorCommands.CommandHistory = function() {
  this.undoStack = [];
  this.redoStack = [];
  this.maxSize = 100;
  this.listeners = [];
};

/**
 * Execute a command and push onto undo stack.
 * Clears redo stack (new branch of edits).
 * @param {Object} command — must have execute() and undo() methods
 */
EditorCommands.CommandHistory.prototype.execute = function(command) {
  command.execute();
  this.undoStack.push(command);
  this.redoStack = [];
  if (this.undoStack.length > this.maxSize) {
    this.undoStack.shift();
  }
  this._notify();
};

/** @return {boolean} */
EditorCommands.CommandHistory.prototype.canUndo = function() {
  return this.undoStack.length > 0;
};

/** @return {boolean} */
EditorCommands.CommandHistory.prototype.canRedo = function() {
  return this.redoStack.length > 0;
};

/** Undo last command. */
EditorCommands.CommandHistory.prototype.undo = function() {
  if (!this.canUndo()) return;
  var cmd = this.undoStack.pop();
  cmd.undo();
  this.redoStack.push(cmd);
  this._notify();
};

/** Redo last undone command. */
EditorCommands.CommandHistory.prototype.redo = function() {
  if (!this.canRedo()) return;
  var cmd = this.redoStack.pop();
  cmd.execute();
  this.undoStack.push(cmd);
  this._notify();
};

/** Clear all history. */
EditorCommands.CommandHistory.prototype.clear = function() {
  this.undoStack = [];
  this.redoStack = [];
  this._notify();
};

/**
 * Register a listener called after every execute/undo/redo/clear.
 * @param {function} fn
 */
EditorCommands.CommandHistory.prototype.onChange = function(fn) {
  this.listeners.push(fn);
};

EditorCommands.CommandHistory.prototype._notify = function() {
  for (var i = 0; i < this.listeners.length; i++) {
    this.listeners[i](this);
  }
};

// ===== Insert Note Command =====

/**
 * Insert a note element into a measure at a given position.
 * @param {Object} sdm — SDM document
 * @param {number} partIndex — part array index
 * @param {number} measureIndex — measure array index
 * @param {number} elementIndex — insertion position in elements array
 * @param {Object} noteData — note element (type:'note', pitch:{...}, etc.)
 * @constructor
 */
EditorCommands.InsertNoteCommand = function(sdm, partIndex, measureIndex, elementIndex, noteData) {
  this.sdm = sdm;
  this.partIndex = partIndex;
  this.measureIndex = measureIndex;
  this.elementIndex = elementIndex;
  this.noteData = noteData;
};

EditorCommands.InsertNoteCommand.prototype.execute = function() {
  var elements = this.sdm.parts[this.partIndex].measures[this.measureIndex].elements;
  elements.splice(this.elementIndex, 0, this.noteData);
};

EditorCommands.InsertNoteCommand.prototype.undo = function() {
  var elements = this.sdm.parts[this.partIndex].measures[this.measureIndex].elements;
  elements.splice(this.elementIndex, 1);
};

EditorCommands.InsertNoteCommand.prototype.toString = function() {
  var p = this.noteData.pitch;
  return 'InsertNote(' + (p ? p.step + p.octave : 'rest') + ')';
};

// ===== Delete Note Command =====

/**
 * Delete a note/rest element from a measure.
 * @constructor
 */
EditorCommands.DeleteNoteCommand = function(sdm, partIndex, measureIndex, elementIndex) {
  this.sdm = sdm;
  this.partIndex = partIndex;
  this.measureIndex = measureIndex;
  this.elementIndex = elementIndex;
  this.deletedNote = null;
};

EditorCommands.DeleteNoteCommand.prototype.execute = function() {
  var elements = this.sdm.parts[this.partIndex].measures[this.measureIndex].elements;
  this.deletedNote = elements[this.elementIndex];
  elements.splice(this.elementIndex, 1);
};

EditorCommands.DeleteNoteCommand.prototype.undo = function() {
  var elements = this.sdm.parts[this.partIndex].measures[this.measureIndex].elements;
  elements.splice(this.elementIndex, 0, this.deletedNote);
};

EditorCommands.DeleteNoteCommand.prototype.toString = function() {
  return 'DeleteNote(' + this.elementIndex + ')';
};

// ===== Modify Note Command =====

/**
 * Modify properties of an existing note (pitch, duration, etc.).
 * @param {Object} sdm
 * @param {number} partIndex
 * @param {number} measureIndex
 * @param {number} elementIndex
 * @param {Object} newProps — properties to set (e.g. {pitch:{step:'D',octave:4}})
 * @constructor
 */
EditorCommands.ModifyNoteCommand = function(sdm, partIndex, measureIndex, elementIndex, newProps) {
  this.sdm = sdm;
  this.partIndex = partIndex;
  this.measureIndex = measureIndex;
  this.elementIndex = elementIndex;
  this.newProps = newProps;
  this.oldProps = null;
};

EditorCommands.ModifyNoteCommand.prototype.execute = function() {
  var element = this.sdm.parts[this.partIndex].measures[this.measureIndex].elements[this.elementIndex];
  this.oldProps = {};
  for (var key in this.newProps) {
    if (this.newProps.hasOwnProperty(key)) {
      this.oldProps[key] = JSON.parse(JSON.stringify(
        element[key] !== undefined ? element[key] : null
      ));
      if (this.newProps[key] === null) {
        delete element[key];
      } else {
        element[key] = JSON.parse(JSON.stringify(this.newProps[key]));
      }
    }
  }
};

EditorCommands.ModifyNoteCommand.prototype.undo = function() {
  var element = this.sdm.parts[this.partIndex].measures[this.measureIndex].elements[this.elementIndex];
  for (var key in this.oldProps) {
    if (this.oldProps.hasOwnProperty(key)) {
      if (this.oldProps[key] === null) {
        delete element[key];
      } else {
        element[key] = JSON.parse(JSON.stringify(this.oldProps[key]));
      }
    }
  }
};

EditorCommands.ModifyNoteCommand.prototype.toString = function() {
  return 'ModifyNote(' + Object.keys(this.newProps).join(',') + ')';
};

// ===== Insert Measure Command =====

/**
 * Insert a new empty measure at a given position in a part.
 * @constructor
 */
EditorCommands.InsertMeasureCommand = function(sdm, partIndex, measureIndex, measureData) {
  this.sdm = sdm;
  this.partIndex = partIndex;
  this.measureIndex = measureIndex;
  this.measureData = measureData || {
    number: String(measureIndex + 1),
    elements: []
  };
};

EditorCommands.InsertMeasureCommand.prototype.execute = function() {
  var measures = this.sdm.parts[this.partIndex].measures;
  measures.splice(this.measureIndex, 0, this.measureData);
  // Renumber subsequent measures
  for (var i = this.measureIndex + 1; i < measures.length; i++) {
    measures[i].number = String(i + 1);
  }
};

EditorCommands.InsertMeasureCommand.prototype.undo = function() {
  var measures = this.sdm.parts[this.partIndex].measures;
  measures.splice(this.measureIndex, 1);
  // Renumber subsequent measures
  for (var i = this.measureIndex; i < measures.length; i++) {
    measures[i].number = String(i + 1);
  }
};

EditorCommands.InsertMeasureCommand.prototype.toString = function() {
  return 'InsertMeasure(' + this.measureIndex + ')';
};

// ===== Delete Measure Command =====

/**
 * Delete a measure from a part.
 * @constructor
 */
EditorCommands.DeleteMeasureCommand = function(sdm, partIndex, measureIndex) {
  this.sdm = sdm;
  this.partIndex = partIndex;
  this.measureIndex = measureIndex;
  this.deletedMeasure = null;
};

EditorCommands.DeleteMeasureCommand.prototype.execute = function() {
  var measures = this.sdm.parts[this.partIndex].measures;
  this.deletedMeasure = measures[this.measureIndex];
  measures.splice(this.measureIndex, 1);
  for (var i = this.measureIndex; i < measures.length; i++) {
    measures[i].number = String(i + 1);
  }
};

EditorCommands.DeleteMeasureCommand.prototype.undo = function() {
  var measures = this.sdm.parts[this.partIndex].measures;
  measures.splice(this.measureIndex, 0, this.deletedMeasure);
  for (var i = this.measureIndex; i < measures.length; i++) {
    measures[i].number = String(i + 1);
  }
};

EditorCommands.DeleteMeasureCommand.prototype.toString = function() {
  return 'DeleteMeasure(' + this.measureIndex + ')';
};

// ===== Change Signature Command =====

/**
 * Change key, time, or clef signature in a measure's attributes element.
 * @param {Object} sdm
 * @param {number} partIndex
 * @param {number} measureIndex
 * @param {Object} newSignature — e.g. {key:{fifths:2,mode:'major'}} or {time:{beats:3,beatType:4}}
 * @constructor
 */
EditorCommands.ChangeSignatureCommand = function(sdm, partIndex, measureIndex, newSignature) {
  this.sdm = sdm;
  this.partIndex = partIndex;
  this.measureIndex = measureIndex;
  this.newSignature = newSignature;
  this.oldSignature = null;
  this.attrIndex = -1;
};

EditorCommands.ChangeSignatureCommand.prototype.execute = function() {
  var elements = this.sdm.parts[this.partIndex].measures[this.measureIndex].elements;

  // Find or create attributes element
  this.attrIndex = -1;
  for (var i = 0; i < elements.length; i++) {
    if (elements[i].type === 'attributes') {
      this.attrIndex = i;
      break;
    }
  }

  if (this.attrIndex === -1) {
    // Insert attributes at beginning
    this.attrIndex = 0;
    elements.splice(0, 0, { type: 'attributes' });
    this.wasCreated = true;
  } else {
    this.wasCreated = false;
  }

  var attrs = elements[this.attrIndex];
  this.oldSignature = {};

  for (var key in this.newSignature) {
    if (this.newSignature.hasOwnProperty(key)) {
      this.oldSignature[key] = attrs[key] ? JSON.parse(JSON.stringify(attrs[key])) : null;
      attrs[key] = JSON.parse(JSON.stringify(this.newSignature[key]));
    }
  }
};

EditorCommands.ChangeSignatureCommand.prototype.undo = function() {
  var elements = this.sdm.parts[this.partIndex].measures[this.measureIndex].elements;

  if (this.wasCreated) {
    elements.splice(this.attrIndex, 1);
  } else {
    var attrs = elements[this.attrIndex];
    for (var key in this.oldSignature) {
      if (this.oldSignature.hasOwnProperty(key)) {
        if (this.oldSignature[key] === null) {
          delete attrs[key];
        } else {
          attrs[key] = JSON.parse(JSON.stringify(this.oldSignature[key]));
        }
      }
    }
  }
};

EditorCommands.ChangeSignatureCommand.prototype.toString = function() {
  return 'ChangeSignature(' + Object.keys(this.newSignature).join(',') + ')';
};
