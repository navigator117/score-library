/**
 * @fileoverview Edit cursor and selection model for the score editor.
 *
 * The cursor tracks the current editing position within the SDM:
 *   - partIndex: which part (0-based)
 *   - measureIndex: which measure (0-based)
 *   - elementIndex: position within the measure's elements array
 *   - voice: current voice (1-based, default 1)
 *
 * The cursor also maintains:
 *   - currentDuration: active note duration for input (e.g. 'quarter')
 *   - currentDots: number of dots
 *   - isRest: if true, input creates rests instead of pitched notes
 */

'use strict';

var EditorCursor;
if (typeof exports !== 'undefined') {
  EditorCursor = exports;
} else {
  if (typeof goog !== 'undefined') {
    goog.provide('ScoreLibrary.Editor.Cursor');
  }
  EditorCursor = (typeof ScoreLibrary !== 'undefined') ?
    (ScoreLibrary.Editor = ScoreLibrary.Editor || {},
     ScoreLibrary.Editor.Cursor = {}) : {};
}

/**
 * Duration name to divisions multiplier (assuming divisions=1 for quarter).
 * Actual duration = multiplier * divisions_per_quarter
 */
EditorCursor.DURATION_MAP = {
  'whole': 4,
  'half': 2,
  'quarter': 1,
  'eighth': 0.5,
  '16th': 0.25,
  '32nd': 0.125
};

/**
 * @constructor
 * @param {Object} sdm — Score Document Model reference
 */
EditorCursor.Cursor = function(sdm) {
  this.sdm = sdm;
  this.partIndex = 0;
  this.measureIndex = 0;
  this.elementIndex = 0;
  this.voice = 1;
  this.currentDuration = 'quarter';
  this.currentDots = 0;
  this.isRest = false;
  this.listeners = [];
};

/** @return {Object|null} Current measure or null */
EditorCursor.Cursor.prototype.currentMeasure = function() {
  if (!this.sdm || !this.sdm.parts ||
      this.partIndex >= this.sdm.parts.length) return null;
  var measures = this.sdm.parts[this.partIndex].measures;
  if (this.measureIndex >= measures.length) return null;
  return measures[this.measureIndex];
};

/** @return {Object|null} Current element or null */
EditorCursor.Cursor.prototype.currentElement = function() {
  var measure = this.currentMeasure();
  if (!measure) return null;
  if (this.elementIndex >= measure.elements.length) return null;
  return measure.elements[this.elementIndex];
};

/** @return {number} Total measures in current part */
EditorCursor.Cursor.prototype.measureCount = function() {
  if (!this.sdm || !this.sdm.parts ||
      this.partIndex >= this.sdm.parts.length) return 0;
  return this.sdm.parts[this.partIndex].measures.length;
};

/** @return {number} Total elements in current measure */
EditorCursor.Cursor.prototype.elementCount = function() {
  var measure = this.currentMeasure();
  return measure ? measure.elements.length : 0;
};

/**
 * Move to the next note/rest element (skip attributes, directions, etc.).
 * @return {boolean} true if moved
 */
EditorCursor.Cursor.prototype.moveRight = function() {
  var measure = this.currentMeasure();
  if (!measure) return false;

  // Try to advance within current measure
  var idx = this.elementIndex + 1;
  while (idx < measure.elements.length) {
    var el = measure.elements[idx];
    if (el.type === 'note' || el.type === 'rest') {
      this.elementIndex = idx;
      this._notify();
      return true;
    }
    idx++;
  }

  // Move to next measure
  if (this.measureIndex + 1 < this.measureCount()) {
    this.measureIndex++;
    this.elementIndex = 0;
    // Find first note/rest in new measure
    measure = this.currentMeasure();
    for (var i = 0; i < measure.elements.length; i++) {
      if (measure.elements[i].type === 'note' || measure.elements[i].type === 'rest') {
        this.elementIndex = i;
        break;
      }
    }
    this._notify();
    return true;
  }

  return false;
};

/**
 * Move to the previous note/rest element.
 * @return {boolean} true if moved
 */
EditorCursor.Cursor.prototype.moveLeft = function() {
  var measure = this.currentMeasure();
  if (!measure) return false;

  // Try to go back within current measure
  var idx = this.elementIndex - 1;
  while (idx >= 0) {
    var el = measure.elements[idx];
    if (el.type === 'note' || el.type === 'rest') {
      this.elementIndex = idx;
      this._notify();
      return true;
    }
    idx--;
  }

  // Move to previous measure
  if (this.measureIndex > 0) {
    this.measureIndex--;
    measure = this.currentMeasure();
    // Find last note/rest in previous measure
    for (var i = measure.elements.length - 1; i >= 0; i--) {
      if (measure.elements[i].type === 'note' || measure.elements[i].type === 'rest') {
        this.elementIndex = i;
        this._notify();
        return true;
      }
    }
    this.elementIndex = 0;
    this._notify();
    return true;
  }

  return false;
};

/**
 * Move cursor to a specific position.
 */
EditorCursor.Cursor.prototype.moveTo = function(partIndex, measureIndex, elementIndex) {
  this.partIndex = partIndex;
  this.measureIndex = measureIndex;
  this.elementIndex = elementIndex;
  this._notify();
};

/**
 * Set the active note duration.
 * @param {string} duration — 'whole', 'half', 'quarter', 'eighth', '16th', '32nd'
 */
EditorCursor.Cursor.prototype.setDuration = function(duration) {
  if (EditorCursor.DURATION_MAP[duration] !== undefined) {
    this.currentDuration = duration;
    this._notify();
  }
};

/**
 * Toggle dot on current duration.
 */
EditorCursor.Cursor.prototype.toggleDot = function() {
  this.currentDots = this.currentDots > 0 ? 0 : 1;
  this._notify();
};

/**
 * Toggle rest mode.
 */
EditorCursor.Cursor.prototype.toggleRest = function() {
  this.isRest = !this.isRest;
  this._notify();
};

/**
 * Create a note element from the current cursor state and a pitch.
 * @param {string} step — 'C', 'D', 'E', 'F', 'G', 'A', 'B'
 * @param {number} octave — octave number (e.g. 4)
 * @param {number=} alter — accidental: -1 flat, 0 natural, 1 sharp
 * @return {Object} SDM note element
 */
EditorCursor.Cursor.prototype.createNoteElement = function(step, octave, alter) {
  var divisions = this._getDivisions();
  var durationMultiplier = EditorCursor.DURATION_MAP[this.currentDuration] || 1;
  var duration = Math.round(durationMultiplier * divisions);

  // Apply dots
  if (this.currentDots > 0) {
    var dotAdd = duration;
    for (var d = 0; d < this.currentDots; d++) {
      dotAdd = Math.round(dotAdd / 2);
      duration += dotAdd;
    }
  }

  if (this.isRest) {
    var rest = {
      type: 'rest',
      duration: duration,
      voice: this.voice,
      noteType: this.currentDuration
    };
    if (this.currentDots > 0) rest.dots = this.currentDots;
    return rest;
  }

  var note = {
    type: 'note',
    pitch: {
      step: step,
      octave: octave,
      alter: alter || 0
    },
    duration: duration,
    voice: this.voice,
    noteType: this.currentDuration,
    stem: octave >= 5 ? 'down' : 'up'
  };
  if (this.currentDots > 0) note.dots = this.currentDots;
  return note;
};

/**
 * Get divisions per quarter note from current measure's attributes.
 * @return {number}
 * @private
 */
EditorCursor.Cursor.prototype._getDivisions = function() {
  // Search backward for divisions attribute
  var measures = this.sdm.parts[this.partIndex].measures;
  for (var m = this.measureIndex; m >= 0; m--) {
    var elements = measures[m].elements;
    for (var i = 0; i < elements.length; i++) {
      if (elements[i].type === 'attributes' && elements[i].divisions) {
        return elements[i].divisions;
      }
    }
  }
  return 1; // default: 1 division per quarter
};

/**
 * Move pitch up by a step (C→D→E→F→G→A→B→C).
 * @param {Object} element — SDM note element
 * @return {Object} new pitch object or null if not a note
 */
EditorCursor.Cursor.prototype.pitchUp = function(element) {
  if (!element || !element.pitch) return null;
  var steps = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  var idx = steps.indexOf(element.pitch.step);
  if (idx === -1) return null;
  var newIdx = (idx + 1) % 7;
  var newOctave = element.pitch.octave + (newIdx === 0 ? 1 : 0);
  return { step: steps[newIdx], octave: newOctave, alter: 0 };
};

/**
 * Move pitch down by a step.
 */
EditorCursor.Cursor.prototype.pitchDown = function(element) {
  if (!element || !element.pitch) return null;
  var steps = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  var idx = steps.indexOf(element.pitch.step);
  if (idx === -1) return null;
  var newIdx = (idx - 1 + 7) % 7;
  var newOctave = element.pitch.octave - (newIdx === 6 ? 1 : 0);
  return { step: steps[newIdx], octave: newOctave, alter: 0 };
};

/**
 * Register a change listener.
 */
EditorCursor.Cursor.prototype.onChange = function(fn) {
  this.listeners.push(fn);
};

EditorCursor.Cursor.prototype._notify = function() {
  for (var i = 0; i < this.listeners.length; i++) {
    this.listeners[i](this);
  }
};

/**
 * Serialize cursor position for debugging.
 */
EditorCursor.Cursor.prototype.toString = function() {
  return 'Cursor(p' + this.partIndex +
    ' m' + this.measureIndex +
    ' e' + this.elementIndex +
    ' v' + this.voice +
    ' ' + this.currentDuration +
    (this.currentDots ? '.' : '') +
    (this.isRest ? ' rest' : '') + ')';
};
