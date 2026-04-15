/**
 * @fileoverview Dirty region tracker for incremental rendering.
 *
 * Tracks which parts of the score need re-rendering after edits.
 * Instead of re-rendering the entire page, only invalidated regions
 * (measures, systems) are re-drawn.
 *
 * Usage:
 *   var tracker = new DirtyTracker();
 *   tracker.invalidateMeasure(partIndex, measureIndex);
 *   tracker.invalidateSystem(systemIndex);
 *   tracker.invalidatePage(pageIndex);
 *   var dirty = tracker.getDirtyRegions();
 *   // ... render only dirty regions ...
 *   tracker.clear();
 */

'use strict';

var DirtyTracker;
if (typeof exports !== 'undefined') {
  DirtyTracker = exports;
} else {
  if (typeof goog !== 'undefined') {
    goog.provide('ScoreLibrary.Renderer.DirtyTracker');
  }
  DirtyTracker = (typeof ScoreLibrary !== 'undefined') ?
    (ScoreLibrary.Renderer = ScoreLibrary.Renderer || {},
     ScoreLibrary.Renderer.DirtyTracker = {}) : {};
}

/**
 * Granularity levels for dirty tracking.
 * @enum {number}
 */
DirtyTracker.Level = {
  NONE: 0,
  MEASURE: 1,
  SYSTEM: 2,
  PAGE: 3,
  ALL: 4
};

/**
 * @constructor
 */
DirtyTracker.Tracker = function() {
  this.dirtyLevel = DirtyTracker.Level.NONE;
  this.dirtyMeasures = {};  // key: 'partIdx:measureIdx'
  this.dirtySystems = {};   // key: systemIndex
  this.dirtyPages = {};     // key: pageIndex
  this.listeners = [];
};

/**
 * Mark a specific measure as dirty.
 * @param {number} partIndex
 * @param {number} measureIndex
 */
DirtyTracker.Tracker.prototype.invalidateMeasure = function(partIndex, measureIndex) {
  var key = partIndex + ':' + measureIndex;
  this.dirtyMeasures[key] = { partIndex: partIndex, measureIndex: measureIndex };
  if (this.dirtyLevel < DirtyTracker.Level.MEASURE) {
    this.dirtyLevel = DirtyTracker.Level.MEASURE;
  }
  this._notify();
};

/**
 * Mark an entire system as dirty.
 * @param {number} systemIndex
 */
DirtyTracker.Tracker.prototype.invalidateSystem = function(systemIndex) {
  this.dirtySystems[systemIndex] = true;
  if (this.dirtyLevel < DirtyTracker.Level.SYSTEM) {
    this.dirtyLevel = DirtyTracker.Level.SYSTEM;
  }
  this._notify();
};

/**
 * Mark an entire page as dirty (needs full re-render).
 * @param {number} pageIndex
 */
DirtyTracker.Tracker.prototype.invalidatePage = function(pageIndex) {
  this.dirtyPages[pageIndex] = true;
  if (this.dirtyLevel < DirtyTracker.Level.PAGE) {
    this.dirtyLevel = DirtyTracker.Level.PAGE;
  }
  this._notify();
};

/**
 * Mark everything as dirty (full re-engrave).
 */
DirtyTracker.Tracker.prototype.invalidateAll = function() {
  this.dirtyLevel = DirtyTracker.Level.ALL;
  this._notify();
};

/**
 * Check if anything is dirty.
 * @return {boolean}
 */
DirtyTracker.Tracker.prototype.isDirty = function() {
  return this.dirtyLevel > DirtyTracker.Level.NONE;
};

/**
 * Get the current dirty level.
 * @return {number} DirtyTracker.Level value
 */
DirtyTracker.Tracker.prototype.getLevel = function() {
  return this.dirtyLevel;
};

/**
 * Get all dirty regions.
 * @return {Object} { level, measures: [...], systems: [...], pages: [...] }
 */
DirtyTracker.Tracker.prototype.getDirtyRegions = function() {
  return {
    level: this.dirtyLevel,
    measures: Object.keys(this.dirtyMeasures).map(function(k) {
      return this.dirtyMeasures[k];
    }.bind(this)),
    systems: Object.keys(this.dirtySystems).map(Number),
    pages: Object.keys(this.dirtyPages).map(Number)
  };
};

/**
 * Clear all dirty state.
 */
DirtyTracker.Tracker.prototype.clear = function() {
  this.dirtyLevel = DirtyTracker.Level.NONE;
  this.dirtyMeasures = {};
  this.dirtySystems = {};
  this.dirtyPages = {};
};

/**
 * Register a listener called when dirty state changes.
 * @param {function} fn
 */
DirtyTracker.Tracker.prototype.onChange = function(fn) {
  this.listeners.push(fn);
};

DirtyTracker.Tracker.prototype._notify = function() {
  for (var i = 0; i < this.listeners.length; i++) {
    this.listeners[i](this);
  }
};
