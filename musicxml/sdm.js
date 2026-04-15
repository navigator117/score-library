/**
 * @fileoverview Score Document Model (SDM) — format-neutral intermediate
 * representation of a musical score. Converts bidirectionally between
 * MusicXML DOM and plain JavaScript objects.
 *
 * Pipeline: MusicXML DOM ⟷ SDM ⟷ CBOR binary
 *
 * This module is usable from both browser (via Closure) and Node.js (for tests).
 */

'use strict';

// Support both Closure and CommonJS environments
var SDM;
if (typeof exports !== 'undefined') {
  SDM = exports;
} else {
  if (typeof goog !== 'undefined') {
    goog.provide('ScoreLibrary.SDM');
  }
  SDM = (typeof ScoreLibrary !== 'undefined') ?
    (ScoreLibrary.SDM = {}) : {};
}

/**
 * Current SDM format version.
 * @const {string}
 */
SDM.VERSION = '1.0';

// ===== MusicXML → SDM =====

/**
 * Convert a MusicXML DOM document to an SDM object.
 * @param {Document} xmlDoc - Parsed MusicXML DOM document
 * @return {Object} SDM object
 */
SDM.fromMusicXML = function(xmlDoc) {
  var root = xmlDoc.documentElement || xmlDoc;

  // Accept both score-partwise root and any wrapper
  var scoreEl = root;
  if (root.tagName !== 'score-partwise') {
    scoreEl = root.getElementsByTagName('score-partwise')[0];
  }
  if (!scoreEl) {
    throw new Error('SDM.fromMusicXML: no <score-partwise> element found');
  }

  var sdm = {
    version: SDM.VERSION,
    metadata: SDM._parseMetadata(scoreEl),
    defaults: SDM._parseDefaults(scoreEl),
    credits: SDM._parseCredits(scoreEl),
    partList: SDM._parsePartList(scoreEl),
    parts: SDM._parseParts(scoreEl)
  };

  return sdm;
};

// ----- Metadata -----

SDM._parseMetadata = function(scoreEl) {
  var meta = {};

  var workEl = SDM._child(scoreEl, 'work');
  if (workEl) {
    meta.workTitle = SDM._childText(workEl, 'work-title') || '';
  }

  var idEl = SDM._child(scoreEl, 'identification');
  if (idEl) {
    var creatorEl = SDM._child(idEl, 'creator');
    if (creatorEl) {
      meta.creator = {
        type: creatorEl.getAttribute('type') || 'composer',
        text: SDM._text(creatorEl) || ''
      };
    }
    meta.rights = SDM._childText(idEl, 'rights') || undefined;
    if (!meta.rights) delete meta.rights;

    var encEl = SDM._child(idEl, 'encoding');
    if (encEl) {
      meta.encoding = {
        date: SDM._childText(encEl, 'encoding-date') || '',
        software: SDM._childText(encEl, 'software') || ''
      };
    }
  }

  return meta;
};

// ----- Defaults -----

SDM._parseDefaults = function(scoreEl) {
  var defEl = SDM._child(scoreEl, 'defaults');
  if (!defEl) return null;

  var defaults = {};

  var scalingEl = SDM._child(defEl, 'scaling');
  if (scalingEl) {
    defaults.scaling = {
      millimeters: SDM._childFloat(scalingEl, 'millimeters'),
      tenths: SDM._childFloat(scalingEl, 'tenths')
    };
  }

  var pageEl = SDM._child(defEl, 'page-layout');
  if (pageEl) {
    var marginsEl = SDM._child(pageEl, 'page-margins');
    defaults.pageLayout = {
      pageHeight: SDM._childFloat(pageEl, 'page-height'),
      pageWidth: SDM._childFloat(pageEl, 'page-width'),
      margins: marginsEl ? {
        left: SDM._childFloat(marginsEl, 'left-margin'),
        right: SDM._childFloat(marginsEl, 'right-margin'),
        top: SDM._childFloat(marginsEl, 'top-margin'),
        bottom: SDM._childFloat(marginsEl, 'bottom-margin')
      } : null
    };
  }

  return defaults;
};

// ----- Credits -----

SDM._parseCredits = function(scoreEl) {
  var creditEls = scoreEl.getElementsByTagName('credit');
  if (!creditEls || creditEls.length === 0) return [];

  var credits = [];
  for (var i = 0; i < creditEls.length; i++) {
    var el = creditEls[i];
    // Only process direct children of scoreEl
    if (el.parentNode !== scoreEl) continue;

    var credit = {
      page: parseInt(el.getAttribute('page') || '1', 10)
    };

    var typeEl = SDM._child(el, 'credit-type');
    if (typeEl) {
      credit.type = SDM._text(typeEl);
    }

    var wordsEl = SDM._child(el, 'credit-words');
    if (wordsEl) {
      credit.words = {
        text: SDM._text(wordsEl) || ''
      };
      SDM._setIf(credit.words, 'defaultX', parseFloat(wordsEl.getAttribute('default-x')) || 0);
      SDM._setIf(credit.words, 'defaultY', parseFloat(wordsEl.getAttribute('default-y')) || 0);
      SDM._setIf(credit.words, 'fontSize', parseFloat(wordsEl.getAttribute('font-size')) || 0);
      SDM._setIf(credit.words, 'justify', wordsEl.getAttribute('justify'));
      SDM._setIf(credit.words, 'valign', wordsEl.getAttribute('valign'));
    }

    credits.push(credit);
  }
  return credits;
};

// ----- Part List -----

SDM._parsePartList = function(scoreEl) {
  var plEl = SDM._child(scoreEl, 'part-list');
  if (!plEl) return [];

  var parts = [];
  var spEls = plEl.getElementsByTagName('score-part');
  for (var i = 0; i < spEls.length; i++) {
    var sp = spEls[i];
    var part = {
      id: sp.getAttribute('id'),
      name: SDM._childText(sp, 'part-name') || ''
    };
    SDM._setIf(part, 'abbreviation', SDM._childText(sp, 'part-abbreviation'));

    var instrEl = SDM._child(sp, 'score-instrument');
    if (instrEl) {
      part.instrument = {
        id: instrEl.getAttribute('id'),
        name: SDM._childText(instrEl, 'instrument-name') || ''
      };
    }

    var midiEl = SDM._child(sp, 'midi-instrument');
    if (midiEl) {
      part.midi = {
        channel: SDM._childInt(midiEl, 'midi-channel'),
        program: SDM._childInt(midiEl, 'midi-program')
      };
    }

    parts.push(part);
  }
  return parts;
};

// ----- Parts (Measures + Elements) -----

SDM._parseParts = function(scoreEl) {
  var partEls = scoreEl.getElementsByTagName('part');
  var parts = [];

  for (var i = 0; i < partEls.length; i++) {
    var partEl = partEls[i];
    // Only process direct children of scoreEl
    if (partEl.parentNode !== scoreEl) continue;

    var part = {
      id: partEl.getAttribute('id'),
      measures: []
    };

    var measureEls = partEl.getElementsByTagName('measure');
    for (var j = 0; j < measureEls.length; j++) {
      var mEl = measureEls[j];
      if (mEl.parentNode !== partEl) continue;
      part.measures.push(SDM._parseMeasure(mEl));
    }

    parts.push(part);
  }
  return parts;
};

SDM._parseMeasure = function(mEl) {
  var measure = {
    number: mEl.getAttribute('number') || '',
    elements: []
  };

  // Iterate through direct children in document order
  var children = mEl.childNodes;
  for (var i = 0; i < children.length; i++) {
    var child = children[i];
    if (child.nodeType !== 1) continue; // Element nodes only

    var tag = child.tagName;
    var elem = null;

    switch (tag) {
      case 'attributes':
        elem = SDM._parseAttributes(child);
        break;
      case 'note':
        elem = SDM._parseNote(child);
        break;
      case 'backup':
        elem = { type: 'backup', duration: SDM._childInt(child, 'duration') };
        break;
      case 'forward':
        elem = { type: 'forward', duration: SDM._childInt(child, 'duration') };
        break;
      case 'direction':
        elem = SDM._parseDirection(child);
        break;
      case 'barline':
        elem = SDM._parseBarline(child);
        break;
      default:
        // Skip unknown elements
        break;
    }

    if (elem) {
      measure.elements.push(elem);
    }
  }

  return measure;
};

SDM._parseAttributes = function(attrEl) {
  var elem = { type: 'attributes' };

  var div = SDM._childInt(attrEl, 'divisions');
  if (div) elem.divisions = div;

  var keyEl = SDM._child(attrEl, 'key');
  if (keyEl) {
    elem.key = {
      fifths: SDM._childInt(keyEl, 'fifths')
    };
    SDM._setIf(elem.key, 'mode', SDM._childText(keyEl, 'mode'));
  }

  var timeEl = SDM._child(attrEl, 'time');
  if (timeEl) {
    elem.time = {
      beats: SDM._childInt(timeEl, 'beats'),
      beatType: SDM._childInt(timeEl, 'beat-type')
    };
    var timeSymbol = timeEl.getAttribute('symbol');
    if (timeSymbol) elem.time.symbol = timeSymbol;
  }

  var clefEl = SDM._child(attrEl, 'clef');
  if (clefEl) {
    elem.clef = {
      sign: SDM._childText(clefEl, 'sign'),
      line: SDM._childInt(clefEl, 'line')
    };
  }

  return elem;
};

SDM._parseNote = function(noteEl) {
  var elem = { type: 'note' };

  // Grace note
  var graceEl = SDM._child(noteEl, 'grace');
  if (graceEl) {
    elem.grace = {
      slash: graceEl.getAttribute('slash') === 'yes'
    };
  }

  // Rest
  var restEl = SDM._child(noteEl, 'rest');
  if (restEl) {
    elem.type = 'rest';
    var displayStep = SDM._childText(restEl, 'display-step');
    var displayOctave = SDM._childText(restEl, 'display-octave');
    if (displayStep) elem.displayStep = displayStep;
    if (displayOctave) elem.displayOctave = parseInt(displayOctave, 10);
  }

  // Pitch
  var pitchEl = SDM._child(noteEl, 'pitch');
  if (pitchEl) {
    elem.pitch = {
      step: SDM._childText(pitchEl, 'step'),
      octave: SDM._childInt(pitchEl, 'octave'),
      alter: SDM._childFloat(pitchEl, 'alter') || 0
    };
  }

  // Duration (not present for grace notes)
  var dur = SDM._childInt(noteEl, 'duration');
  if (dur) elem.duration = dur;

  elem.voice = SDM._childInt(noteEl, 'voice') || 1;
  elem.noteType = SDM._childText(noteEl, 'type') || undefined;
  if (!elem.noteType) delete elem.noteType;

  // Stem
  var stemText = SDM._childText(noteEl, 'stem');
  if (stemText) elem.stem = stemText;

  // Dots
  var dotEls = noteEl.getElementsByTagName('dot');
  var dotCount = 0;
  for (var d = 0; d < dotEls.length; d++) {
    if (dotEls[d].parentNode === noteEl) dotCount++;
  }
  if (dotCount > 0) elem.dots = dotCount;

  // Beams
  var beamEls = noteEl.getElementsByTagName('beam');
  if (beamEls.length > 0) {
    elem.beams = [];
    for (var b = 0; b < beamEls.length; b++) {
      if (beamEls[b].parentNode !== noteEl) continue;
      elem.beams.push({
        number: parseInt(beamEls[b].getAttribute('number') || '1', 10),
        type: SDM._text(beamEls[b])
      });
    }
  }

  // Notations
  var notationsEl = SDM._child(noteEl, 'notations');
  if (notationsEl) {
    elem.notations = SDM._parseNotations(notationsEl);
  }

  return elem;
};

SDM._parseNotations = function(notEl) {
  var notations = {};

  // Slurs
  var slurEls = notEl.getElementsByTagName('slur');
  if (slurEls.length > 0) {
    notations.slurs = [];
    for (var i = 0; i < slurEls.length; i++) {
      notations.slurs.push({
        type: slurEls[i].getAttribute('type'),
        number: parseInt(slurEls[i].getAttribute('number') || '1', 10)
      });
      SDM._setIf(notations.slurs[notations.slurs.length - 1], 'placement',
        slurEls[i].getAttribute('placement'));
    }
  }

  // Tied
  var tiedEls = notEl.getElementsByTagName('tied');
  if (tiedEls.length > 0) {
    notations.tied = [];
    for (var i = 0; i < tiedEls.length; i++) {
      notations.tied.push({
        type: tiedEls[i].getAttribute('type')
      });
    }
  }

  // Fermata
  var fermataEl = SDM._child(notEl, 'fermata');
  if (fermataEl) {
    notations.fermata = {
      type: fermataEl.getAttribute('type') || 'upright'
    };
  }

  // Articulations
  var artEl = SDM._child(notEl, 'articulations');
  if (artEl) {
    notations.articulations = [];
    var artChildren = artEl.childNodes;
    for (var i = 0; i < artChildren.length; i++) {
      if (artChildren[i].nodeType === 1) {
        notations.articulations.push(artChildren[i].tagName);
      }
    }
  }

  // Technical (fingering, etc.)
  var techEl = SDM._child(notEl, 'technical');
  if (techEl) {
    notations.technical = {};
    var fingeringEls = techEl.getElementsByTagName('fingering');
    if (fingeringEls.length > 0) {
      notations.technical.fingering = [];
      for (var i = 0; i < fingeringEls.length; i++) {
        notations.technical.fingering.push({
          text: SDM._text(fingeringEls[i]),
          placement: fingeringEls[i].getAttribute('placement') || 'above'
        });
      }
    }
  }

  return notations;
};

SDM._parseDirection = function(dirEl) {
  var elem = {
    type: 'direction'
  };
  SDM._setIf(elem, 'placement', dirEl.getAttribute('placement'));

  var dtEl = SDM._child(dirEl, 'direction-type');
  if (!dtEl) return elem;

  // Dynamics
  var dynEl = SDM._child(dtEl, 'dynamics');
  if (dynEl) {
    elem.directionType = 'dynamics';
    // The first child element name IS the dynamic marking
    var dynChildren = dynEl.childNodes;
    for (var i = 0; i < dynChildren.length; i++) {
      if (dynChildren[i].nodeType === 1) {
        elem.dynamics = dynChildren[i].tagName;
        break;
      }
    }
    return elem;
  }

  // Metronome
  var metEl = SDM._child(dtEl, 'metronome');
  if (metEl) {
    elem.directionType = 'metronome';
    elem.beatUnit = SDM._childText(metEl, 'beat-unit');
    elem.perMinute = SDM._childInt(metEl, 'per-minute');
    return elem;
  }

  // Wedge
  var wedgeEl = SDM._child(dtEl, 'wedge');
  if (wedgeEl) {
    elem.directionType = 'wedge';
    elem.wedgeType = wedgeEl.getAttribute('type');
    return elem;
  }

  // Words
  var wordsEl = SDM._child(dtEl, 'words');
  if (wordsEl) {
    elem.directionType = 'words';
    elem.text = SDM._text(wordsEl) || '';
    SDM._setIf(elem, 'fontStyle', wordsEl.getAttribute('font-style'));
    SDM._setIf(elem, 'fontSize', parseFloat(wordsEl.getAttribute('font-size')) || 0);
    return elem;
  }

  return elem;
};

SDM._parseBarline = function(barEl) {
  var elem = {
    type: 'barline',
    location: barEl.getAttribute('location') || 'right'
  };

  elem.barStyle = SDM._childText(barEl, 'bar-style') || undefined;
  if (!elem.barStyle) delete elem.barStyle;

  var repeatEl = SDM._child(barEl, 'repeat');
  if (repeatEl) {
    elem.repeat = {
      direction: repeatEl.getAttribute('direction')
    };
  }

  var endingEl = SDM._child(barEl, 'ending');
  if (endingEl) {
    elem.ending = {
      number: endingEl.getAttribute('number'),
      type: endingEl.getAttribute('type')
    };
  }

  return elem;
};

// ===== SDM → MusicXML =====

/**
 * Convert an SDM object to a MusicXML string.
 * @param {Object} sdm - SDM object
 * @return {string} MusicXML XML string
 */
SDM.toMusicXML = function(sdm) {
  var lines = [];
  lines.push('<?xml version="1.0" encoding="UTF-8"?>');
  lines.push('<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 4.0 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">');
  lines.push('<score-partwise version="4.0">');

  // Metadata
  var meta = sdm.metadata || {};
  if (meta.workTitle) {
    lines.push('  <work>');
    lines.push('    <work-title>' + SDM._esc(meta.workTitle) + '</work-title>');
    lines.push('  </work>');
  }

  if (meta.creator || meta.rights || meta.encoding) {
    lines.push('  <identification>');
    if (meta.creator) {
      lines.push('    <creator type="' + SDM._esc(meta.creator.type || 'composer') + '">' +
        SDM._esc(meta.creator.text) + '</creator>');
    }
    if (meta.rights) {
      lines.push('    <rights>' + SDM._esc(meta.rights) + '</rights>');
    }
    if (meta.encoding) {
      lines.push('    <encoding>');
      if (meta.encoding.date) {
        lines.push('      <encoding-date>' + SDM._esc(meta.encoding.date) + '</encoding-date>');
      }
      if (meta.encoding.software) {
        lines.push('      <software>' + SDM._esc(meta.encoding.software) + '</software>');
      }
      lines.push('    </encoding>');
    }
    lines.push('  </identification>');
  }

  // Defaults
  var def = sdm.defaults;
  if (def) {
    lines.push('  <defaults>');
    if (def.scaling) {
      lines.push('    <scaling>');
      lines.push('      <millimeters>' + def.scaling.millimeters + '</millimeters>');
      lines.push('      <tenths>' + def.scaling.tenths + '</tenths>');
      lines.push('    </scaling>');
    }
    if (def.pageLayout) {
      lines.push('    <page-layout>');
      lines.push('      <page-height>' + def.pageLayout.pageHeight + '</page-height>');
      lines.push('      <page-width>' + def.pageLayout.pageWidth + '</page-width>');
      if (def.pageLayout.margins) {
        lines.push('      <page-margins type="both">');
        lines.push('        <left-margin>' + def.pageLayout.margins.left + '</left-margin>');
        lines.push('        <right-margin>' + def.pageLayout.margins.right + '</right-margin>');
        lines.push('        <top-margin>' + def.pageLayout.margins.top + '</top-margin>');
        lines.push('        <bottom-margin>' + def.pageLayout.margins.bottom + '</bottom-margin>');
        lines.push('      </page-margins>');
      }
      lines.push('    </page-layout>');
    }
    lines.push('  </defaults>');
  }

  // Credits
  if (sdm.credits) {
    sdm.credits.forEach(function(credit) {
      var pageAttr = credit.page ? ' page="' + credit.page + '"' : '';
      lines.push('  <credit' + pageAttr + '>');
      if (credit.type) {
        lines.push('    <credit-type>' + SDM._esc(credit.type) + '</credit-type>');
      }
      if (credit.words) {
        var w = credit.words;
        var attrs = '';
        if (w.defaultX !== undefined) attrs += ' default-x="' + w.defaultX + '"';
        if (w.defaultY !== undefined) attrs += ' default-y="' + w.defaultY + '"';
        if (w.fontSize !== undefined) attrs += ' font-size="' + w.fontSize + '"';
        if (w.justify) attrs += ' justify="' + w.justify + '"';
        if (w.valign) attrs += ' valign="' + w.valign + '"';
        lines.push('    <credit-words' + attrs + '>' + SDM._esc(w.text) + '</credit-words>');
      }
      lines.push('  </credit>');
    });
  }

  // Part List
  if (sdm.partList) {
    lines.push('  <part-list>');
    sdm.partList.forEach(function(p) {
      lines.push('    <score-part id="' + SDM._esc(p.id) + '">');
      lines.push('      <part-name>' + SDM._esc(p.name) + '</part-name>');
      if (p.abbreviation) {
        lines.push('      <part-abbreviation>' + SDM._esc(p.abbreviation) + '</part-abbreviation>');
      }
      if (p.instrument) {
        lines.push('      <score-instrument id="' + SDM._esc(p.instrument.id) + '">');
        lines.push('        <instrument-name>' + SDM._esc(p.instrument.name) + '</instrument-name>');
        lines.push('      </score-instrument>');
      }
      if (p.midi) {
        var midiId = p.instrument ? p.instrument.id : (p.id + '-I1');
        lines.push('      <midi-instrument id="' + SDM._esc(midiId) + '">');
        lines.push('        <midi-channel>' + p.midi.channel + '</midi-channel>');
        lines.push('        <midi-program>' + p.midi.program + '</midi-program>');
        lines.push('      </midi-instrument>');
      }
      lines.push('    </score-part>');
    });
    lines.push('  </part-list>');
  }

  // Parts
  if (sdm.parts) {
    sdm.parts.forEach(function(part) {
      lines.push('  <part id="' + SDM._esc(part.id) + '">');
      part.measures.forEach(function(measure) {
        lines.push('    <measure number="' + SDM._esc(measure.number) + '">');
        measure.elements.forEach(function(elem) {
          SDM._elemToXML(elem, lines, '      ');
        });
        lines.push('    </measure>');
      });
      lines.push('  </part>');
    });
  }

  lines.push('</score-partwise>');
  return lines.join('\n');
};

SDM._elemToXML = function(elem, lines, indent) {
  switch (elem.type) {
    case 'attributes':
      lines.push(indent + '<attributes>');
      if (elem.divisions) {
        lines.push(indent + '  <divisions>' + elem.divisions + '</divisions>');
      }
      if (elem.key) {
        lines.push(indent + '  <key>');
        lines.push(indent + '    <fifths>' + elem.key.fifths + '</fifths>');
        if (elem.key.mode) {
          lines.push(indent + '    <mode>' + SDM._esc(elem.key.mode) + '</mode>');
        }
        lines.push(indent + '  </key>');
      }
      if (elem.time) {
        var timeAttrs = elem.time.symbol ? ' symbol="' + elem.time.symbol + '"' : '';
        lines.push(indent + '  <time' + timeAttrs + '>');
        lines.push(indent + '    <beats>' + elem.time.beats + '</beats>');
        lines.push(indent + '    <beat-type>' + elem.time.beatType + '</beat-type>');
        lines.push(indent + '  </time>');
      }
      if (elem.clef) {
        lines.push(indent + '  <clef>');
        lines.push(indent + '    <sign>' + SDM._esc(elem.clef.sign) + '</sign>');
        lines.push(indent + '    <line>' + elem.clef.line + '</line>');
        lines.push(indent + '  </clef>');
      }
      lines.push(indent + '</attributes>');
      break;

    case 'note':
    case 'rest':
      lines.push(indent + '<note>');
      if (elem.grace) {
        var slashAttr = elem.grace.slash ? ' slash="yes"' : '';
        lines.push(indent + '  <grace' + slashAttr + '/>');
      }
      if (elem.type === 'rest') {
        if (elem.displayStep) {
          lines.push(indent + '  <rest>');
          lines.push(indent + '    <display-step>' + elem.displayStep + '</display-step>');
          lines.push(indent + '    <display-octave>' + elem.displayOctave + '</display-octave>');
          lines.push(indent + '  </rest>');
        } else {
          lines.push(indent + '  <rest/>');
        }
      }
      if (elem.pitch) {
        lines.push(indent + '  <pitch>');
        lines.push(indent + '    <step>' + elem.pitch.step + '</step>');
        if (elem.pitch.alter && elem.pitch.alter !== 0) {
          lines.push(indent + '    <alter>' + elem.pitch.alter + '</alter>');
        }
        lines.push(indent + '    <octave>' + elem.pitch.octave + '</octave>');
        lines.push(indent + '  </pitch>');
      }
      if (elem.duration) {
        lines.push(indent + '  <duration>' + elem.duration + '</duration>');
      }
      if (elem.voice) {
        lines.push(indent + '  <voice>' + elem.voice + '</voice>');
      }
      if (elem.noteType) {
        lines.push(indent + '  <type>' + SDM._esc(elem.noteType) + '</type>');
      }
      if (elem.dots) {
        for (var d = 0; d < elem.dots; d++) {
          lines.push(indent + '  <dot/>');
        }
      }
      if (elem.stem) {
        lines.push(indent + '  <stem>' + SDM._esc(elem.stem) + '</stem>');
      }
      if (elem.beams) {
        elem.beams.forEach(function(beam) {
          lines.push(indent + '  <beam number="' + beam.number + '">' + beam.type + '</beam>');
        });
      }
      if (elem.notations) {
        SDM._notationsToXML(elem.notations, lines, indent + '  ');
      }
      lines.push(indent + '</note>');
      break;

    case 'backup':
      lines.push(indent + '<backup>');
      lines.push(indent + '  <duration>' + elem.duration + '</duration>');
      lines.push(indent + '</backup>');
      break;

    case 'forward':
      lines.push(indent + '<forward>');
      lines.push(indent + '  <duration>' + elem.duration + '</duration>');
      lines.push(indent + '</forward>');
      break;

    case 'direction':
      var dirAttr = elem.placement ? ' placement="' + elem.placement + '"' : '';
      lines.push(indent + '<direction' + dirAttr + '>');
      lines.push(indent + '  <direction-type>');

      if (elem.directionType === 'dynamics') {
        lines.push(indent + '    <dynamics>');
        lines.push(indent + '      <' + SDM._esc(elem.dynamics) + '/>');
        lines.push(indent + '    </dynamics>');
      } else if (elem.directionType === 'metronome') {
        lines.push(indent + '    <metronome>');
        lines.push(indent + '      <beat-unit>' + SDM._esc(elem.beatUnit) + '</beat-unit>');
        lines.push(indent + '      <per-minute>' + elem.perMinute + '</per-minute>');
        lines.push(indent + '    </metronome>');
      } else if (elem.directionType === 'wedge') {
        lines.push(indent + '    <wedge type="' + SDM._esc(elem.wedgeType) + '"/>');
      } else if (elem.directionType === 'words') {
        var wAttrs = '';
        if (elem.fontStyle) wAttrs += ' font-style="' + elem.fontStyle + '"';
        if (elem.fontSize) wAttrs += ' font-size="' + elem.fontSize + '"';
        lines.push(indent + '    <words' + wAttrs + '>' + SDM._esc(elem.text) + '</words>');
      }

      lines.push(indent + '  </direction-type>');

      // Sound element for tempo
      if (elem.directionType === 'metronome' && elem.perMinute) {
        lines.push(indent + '  <sound tempo="' + elem.perMinute + '"/>');
      }

      lines.push(indent + '</direction>');
      break;

    case 'barline':
      var locAttr = elem.location ? ' location="' + elem.location + '"' : '';
      lines.push(indent + '<barline' + locAttr + '>');
      if (elem.barStyle) {
        lines.push(indent + '  <bar-style>' + SDM._esc(elem.barStyle) + '</bar-style>');
      }
      if (elem.ending) {
        lines.push(indent + '  <ending number="' + SDM._esc(elem.ending.number) +
          '" type="' + SDM._esc(elem.ending.type) + '"/>');
      }
      if (elem.repeat) {
        lines.push(indent + '  <repeat direction="' + SDM._esc(elem.repeat.direction) + '"/>');
      }
      lines.push(indent + '</barline>');
      break;
  }
};

SDM._notationsToXML = function(notations, lines, indent) {
  lines.push(indent + '<notations>');

  if (notations.slurs) {
    notations.slurs.forEach(function(slur) {
      var attrs = ' type="' + slur.type + '" number="' + slur.number + '"';
      if (slur.placement) attrs += ' placement="' + slur.placement + '"';
      lines.push(indent + '  <slur' + attrs + '/>');
    });
  }

  if (notations.tied) {
    notations.tied.forEach(function(tied) {
      lines.push(indent + '  <tied type="' + tied.type + '"/>');
    });
  }

  if (notations.fermata) {
    lines.push(indent + '  <fermata type="' + notations.fermata.type + '"/>');
  }

  if (notations.articulations && notations.articulations.length > 0) {
    lines.push(indent + '  <articulations>');
    notations.articulations.forEach(function(art) {
      lines.push(indent + '    <' + SDM._esc(art) + '/>');
    });
    lines.push(indent + '  </articulations>');
  }

  if (notations.technical) {
    lines.push(indent + '  <technical>');
    if (notations.technical.fingering) {
      notations.technical.fingering.forEach(function(f) {
        var fAttrs = f.placement ? ' placement="' + f.placement + '"' : '';
        lines.push(indent + '    <fingering' + fAttrs + '>' + SDM._esc(f.text) + '</fingering>');
      });
    }
    lines.push(indent + '  </technical>');
  }

  lines.push(indent + '</notations>');
};

// ===== XML DOM Helper Utilities =====

SDM._child = function(parent, tagName) {
  var children = parent.childNodes;
  for (var i = 0; i < children.length; i++) {
    if (children[i].nodeType === 1 && children[i].tagName === tagName) {
      return children[i];
    }
  }
  return null;
};

SDM._text = function(el) {
  if (!el) return '';
  return el.textContent || '';
};

SDM._childText = function(parent, tagName) {
  var el = SDM._child(parent, tagName);
  return el ? SDM._text(el) : '';
};

SDM._childInt = function(parent, tagName) {
  var text = SDM._childText(parent, tagName);
  return text ? parseInt(text, 10) : 0;
};

SDM._childFloat = function(parent, tagName) {
  var text = SDM._childText(parent, tagName);
  return text ? parseFloat(text) : 0;
};

SDM._esc = function(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};

/**
 * Set a property on obj only if val is truthy/non-zero.
 * Prevents undefined keys from appearing in SDM objects.
 * @param {Object} obj
 * @param {string} key
 * @param {*} val
 */
SDM._setIf = function(obj, key, val) {
  if (val !== undefined && val !== null && val !== '' && val !== 0) {
    obj[key] = val;
  }
};
