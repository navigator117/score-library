/**
 * @fileoverview Score templates for creating new scores from scratch.
 *
 * Templates produce SDM objects pre-populated with:
 *   - Metadata (title, composer placeholder)
 *   - Defaults (page layout, scaling)
 *   - Part list with instrument
 *   - Empty measures with initial attributes (clef, key, time, divisions)
 */

'use strict';

var EditorTemplates;
if (typeof exports !== 'undefined') {
  EditorTemplates = exports;
} else {
  if (typeof goog !== 'undefined') {
    goog.provide('ScoreLibrary.Editor.Templates');
  }
  EditorTemplates = (typeof ScoreLibrary !== 'undefined') ?
    (ScoreLibrary.Editor = ScoreLibrary.Editor || {},
     ScoreLibrary.Editor.Templates = {}) : {};
}

/**
 * Create an SDM for a blank classical guitar score.
 * @param {Object=} options
 *   - title: string (default 'Untitled')
 *   - composer: string (default '')
 *   - measures: number (default 8)
 *   - key: {fifths, mode} (default {fifths:0})
 *   - time: {beats, beatType} (default {beats:4, beatType:4})
 *   - divisions: number (default 2)
 * @return {Object} SDM document
 */
EditorTemplates.classicalGuitar = function(options) {
  var opts = options || {};
  var title = opts.title || 'Untitled';
  var composer = opts.composer || '';
  var numMeasures = opts.measures || 8;
  var key = opts.key || { fifths: 0 };
  var time = opts.time || { beats: 4, beatType: 4 };
  var divisions = opts.divisions || 2;

  var measures = [];
  for (var i = 0; i < numMeasures; i++) {
    var elements = [];

    // First measure gets full attributes
    if (i === 0) {
      var attrs = {
        type: 'attributes',
        divisions: divisions,
        key: JSON.parse(JSON.stringify(key)),
        time: JSON.parse(JSON.stringify(time)),
        clef: { sign: 'G', line: 2 }
      };
      elements.push(attrs);
    }

    // Fill with a whole rest by default
    var restDuration = divisions * time.beats * (4 / time.beatType);
    elements.push({
      type: 'rest',
      duration: Math.round(restDuration),
      voice: 1,
      noteType: 'whole'
    });

    // Final barline on last measure
    if (i === numMeasures - 1) {
      elements.push({
        type: 'barline',
        location: 'right',
        barStyle: 'light-heavy'
      });
    }

    measures.push({
      number: String(i + 1),
      elements: elements
    });
  }

  return {
    version: '1.0',
    metadata: {
      workTitle: title,
      creator: { type: 'composer', text: composer },
      encoding: {
        date: new Date().toISOString().slice(0, 10),
        software: 'score-library editor'
      }
    },
    defaults: {
      scaling: { millimeters: 7.2319, tenths: 40 },
      pageLayout: {
        pageHeight: 1545,
        pageWidth: 1194,
        margins: { left: 70, right: 70, top: 88, bottom: 88 }
      }
    },
    credits: [
      {
        page: 1,
        type: 'title',
        words: {
          text: title,
          defaultX: 597,
          defaultY: 1457,
          fontSize: 24,
          justify: 'center',
          valign: 'top'
        }
      }
    ],
    partList: [
      {
        id: 'P1',
        name: 'Classical Guitar',
        instrument: { id: 'P1-I1', name: 'Classical Guitar' },
        midi: { channel: 1, program: 25 }
      }
    ],
    parts: [
      {
        id: 'P1',
        measures: measures
      }
    ]
  };
};

/**
 * Create an SDM for a blank treble clef lead sheet (melody only).
 * @param {Object=} options — same as classicalGuitar
 * @return {Object} SDM document
 */
EditorTemplates.leadSheet = function(options) {
  var opts = options || {};
  opts.title = opts.title || 'Lead Sheet';
  var sdm = EditorTemplates.classicalGuitar(opts);
  sdm.partList[0].name = 'Melody';
  sdm.partList[0].instrument.name = 'Melody';
  sdm.partList[0].midi.program = 1; // Acoustic Grand Piano
  return sdm;
};

/**
 * List all available template names.
 * @return {Array<string>}
 */
EditorTemplates.list = function() {
  return ['classicalGuitar', 'leadSheet'];
};
