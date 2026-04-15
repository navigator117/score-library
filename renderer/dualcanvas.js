/**
 * @fileoverview Dual-canvas architecture for editor interaction.
 *
 * Two-layer canvas system:
 *   1. Score canvas (bottom) — renders the static score
 *   2. Interaction canvas (top) — renders cursor, selection, hover highlights
 *
 * The interaction layer is transparent and overlaid on top of the score layer.
 * Only the interaction layer is redrawn on cursor moves, keeping score rendering
 * fast even for complex scores.
 *
 * Usage:
 *   var dual = new DualCanvas(containerElement, width, height);
 *   dual.scoreContext  — 2D context for score rendering
 *   dual.interContext  — 2D context for cursor/selection overlay
 *   dual.clearInteraction();
 *   dual.drawCursor(x, y, height);
 *   dual.drawSelection(x, y, width, height);
 */

'use strict';

var DualCanvas;
if (typeof exports !== 'undefined') {
  DualCanvas = exports;
} else {
  if (typeof goog !== 'undefined') {
    goog.provide('ScoreLibrary.Renderer.DualCanvas');
  }
  DualCanvas = (typeof ScoreLibrary !== 'undefined') ?
    (ScoreLibrary.Renderer = ScoreLibrary.Renderer || {},
     ScoreLibrary.Renderer.DualCanvas = {}) : {};
}

/**
 * @constructor
 * @param {Element} container — parent DOM element
 * @param {number} width
 * @param {number} height
 */
DualCanvas.DualCanvasView = function(container, width, height) {
  this.container = container;
  this.width = width;
  this.height = height;

  // Create score canvas (bottom layer)
  this.scoreCanvas = DualCanvas._createCanvas(width, height, 1);
  this.scoreContext = this.scoreCanvas.getContext('2d');

  // Create interaction canvas (top layer, transparent)
  this.interCanvas = DualCanvas._createCanvas(width, height, 2);
  this.interContext = this.interCanvas.getContext('2d');

  // Append to container
  if (container && container.appendChild) {
    container.style.position = 'relative';
    container.appendChild(this.scoreCanvas);
    container.appendChild(this.interCanvas);
  }
};

/**
 * Create a positioned canvas element.
 * @param {number} width
 * @param {number} height
 * @param {number} zIndex
 * @return {HTMLCanvasElement}
 * @private
 */
DualCanvas._createCanvas = function(width, height, zIndex) {
  // Handle non-DOM environments (Node.js testing)
  if (typeof document === 'undefined') {
    return {
      width: width,
      height: height,
      style: {},
      getContext: function() {
        return DualCanvas._mockContext();
      }
    };
  }

  var canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.style.position = 'absolute';
  canvas.style.left = '0';
  canvas.style.top = '0';
  canvas.style.zIndex = String(zIndex);
  if (zIndex > 1) {
    canvas.style.pointerEvents = 'auto'; // Top layer receives events
  }
  return canvas;
};

/**
 * Create a mock 2D context for testing.
 * @return {Object}
 * @private
 */
DualCanvas._mockContext = function() {
  return {
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    globalAlpha: 1,
    fillRect: function() {},
    clearRect: function() {},
    strokeRect: function() {},
    beginPath: function() {},
    moveTo: function() {},
    lineTo: function() {},
    stroke: function() {},
    fill: function() {},
    save: function() {},
    restore: function() {},
    setLineDash: function() {},
    _calls: []
  };
};

/**
 * Clear the interaction layer.
 */
DualCanvas.DualCanvasView.prototype.clearInteraction = function() {
  this.interContext.clearRect(0, 0, this.width, this.height);
};

/**
 * Draw an edit cursor (vertical line) on the interaction layer.
 * @param {number} x — horizontal position
 * @param {number} y — top of cursor
 * @param {number} height — cursor height
 * @param {string=} color — default '#2196F3' (blue)
 */
DualCanvas.DualCanvasView.prototype.drawCursor = function(x, y, height, color) {
  var ctx = this.interContext;
  ctx.save();
  ctx.strokeStyle = color || '#2196F3';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + height);
  ctx.stroke();
  ctx.restore();
};

/**
 * Draw a selection highlight on the interaction layer.
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 * @param {string=} color — default 'rgba(33,150,243,0.2)' (translucent blue)
 */
DualCanvas.DualCanvasView.prototype.drawSelection = function(x, y, width, height, color) {
  var ctx = this.interContext;
  ctx.save();
  ctx.fillStyle = color || 'rgba(33,150,243,0.2)';
  ctx.fillRect(x, y, width, height);

  ctx.strokeStyle = '#2196F3';
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 3]);
  ctx.strokeRect(x, y, width, height);
  ctx.restore();
};

/**
 * Draw a hover highlight on the interaction layer.
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 */
DualCanvas.DualCanvasView.prototype.drawHover = function(x, y, width, height) {
  var ctx = this.interContext;
  ctx.save();
  ctx.fillStyle = 'rgba(255,152,0,0.15)';
  ctx.fillRect(x, y, width, height);
  ctx.restore();
};

/**
 * Resize both canvases.
 * @param {number} width
 * @param {number} height
 */
DualCanvas.DualCanvasView.prototype.resize = function(width, height) {
  this.width = width;
  this.height = height;
  this.scoreCanvas.width = width;
  this.scoreCanvas.height = height;
  this.interCanvas.width = width;
  this.interCanvas.height = height;
};

/**
 * Get the interaction canvas element (for event binding).
 * @return {HTMLCanvasElement}
 */
DualCanvas.DualCanvasView.prototype.getEventTarget = function() {
  return this.interCanvas;
};
