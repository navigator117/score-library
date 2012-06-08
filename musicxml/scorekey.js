goog.provide('ScoreLibrary.Score.Key');
goog.require('ScoreLibrary.Renderer.HBoxGlyph');
goog.require('ScoreLibrary.Score');
goog.require('ScoreLibrary.Score.Accidental');
goog.require('ScoreLibrary.Score.AttributeElement');
goog.require('ScoreLibrary.Score.Clef');
goog.require('ScoreLibrary.Score.Pitch');
goog.require('ScoreLibrary.Score.XMLHelper');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Score.AttributeElement}
 */
ScoreLibrary.Score.Key = function(owner, key_node) {

    var supperclass = ScoreLibrary.Score.Key.supperclass;

    supperclass.constructor.call(this, owner, key_node);

    var xml_helper = ScoreLibrary.Score.XMLHelper.getInstance();

    xml_helper.getKey(this, this);
};

/**
 * @const
 */
ScoreLibrary.Score.Key.ModeTonics = {

    'major': 'C',
    'minor': 'A',
    'ionian': 'C',
    'dorian': 'D',
    'phrygian': 'E',
    'lydian': 'F',
    'mixolydian': 'G',
    'aeolian': 'A',
    'locrian': 'B'
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.Key,
    ScoreLibrary.Score.AttributeElement);

ScoreLibrary.Score.Key.prototype.toString = function() {

    return 'Score.Key';
};

ScoreLibrary.Score.Key.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.Key(this.owner, this.node);

    var supperclass = ScoreLibrary.Score.Key.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Score.Key.prototype.getTonic = function() {

    var tonic =
        new ScoreLibrary.Score.Pitch({

            octave: 4,
            step: ScoreLibrary.Score.Key.ModeTonics[this.mode],
            alter: 0
        });

    var fifth =
        ScoreLibrary.Score.Pitch.fifth.clone();

    if (this.fifths < 0) {

        fifth.step *= -1;
        fifth.normalize();
    }

    var abs_fifths = Math.abs(this.fifths);

    for (var i = 0; i < abs_fifths; ++i) {

        tonic = tonic.transpose(fifth);
    }

    return tonic;
};

/**
 * @const
 */
ScoreLibrary.Score.Key.Steps = {

    // Father Charles Goes Down And Ends Battle.
    '#': ['F', 'C', 'G', 'D', 'A', 'E', 'B'],
    // 'BEAD', 'GCF'
    'b': ['B', 'E', 'A', 'D', 'G', 'C', 'F']
};

/**
 * @const
 */
ScoreLibrary.Score.Key.Octaves = {

    treble: {
        '#': [5, 5, 5, 5, 4, 5, 4],  // + 2
        'b': [4, 5, 4, 5, 4, 5, 4]   // + 2
    },
    alto: {
        '#': [4, 4, 4, 4, 3, 4, 3],  // + 1
        'b': [3, 4, 3, 4, 3, 4, 3]   // + 1
    },
    tenor: {
        '#': [3, 4, 3, 4, 3, 4, 3],
        'b': [3, 4, 3, 4, 3, 4, 3]   // + 1
    },
    bass: {
        '#': [3, 3, 3, 3, 2, 3, 2],  // + 0
        'b': [2, 3, 2, 3, 2, 3, 2]   // + 0
    }
};

ScoreLibrary.Score.Key.prototype.getAccidentalsByFifths = function() {

    var clef = this.getClef();

    var octaves = undefined;
    var steps = undefined;

    switch (clef.sign) {

    default:
    case 'G': {

        octaves = ScoreLibrary.Score.Key.Octaves.treble;
    } break;

    case 'C': {

        if (clef.line === 3) {

            octaves = ScoreLibrary.Score.Key.Octaves.alto;
        }
        else if (clef.line === 4) {

            octaves = ScoreLibrary.Score.Key.Octaves.tenor;
        }
    } break;

    case 'F': {

        octaves = ScoreLibrary.Score.Key.Octaves.bass;
    } break;

    }

    if (this.fifths > 0) {

        octaves = octaves['#'];
        steps = ScoreLibrary.Score.Key.Steps['#'];
    }
    else if (this.fifths < 0) {

        octaves = octaves['b'];
        steps = ScoreLibrary.Score.Key.Steps['b'];
    }

    var accidentals = undefined;

    var abs_fifths = Math.abs(this.fifths);

    var pitches = (abs_fifths >= 7 ? 7 : abs_fifths);

    for (var i = 0; i < pitches; ++i) {

        var index =
           (i + (abs_fifths >= 7 ? abs_fifths % 7 : 0)) % 7;

        var alter_value =
            (this.fifths > 0 ? 1 : -1) *
            Math.floor((i + (abs_fifths >= 7 ? abs_fifths : 7)) / 7);

        accidentals = accidentals || [];

        accidentals.push({
            octave: octaves[index] + clef.clef_octave_change,
            step: steps[index],
            alter: alter_value
        });
    }

    return accidentals;
};

ScoreLibrary.Score.Key.prototype.getAccidentalPitches = function() {

    if (this.accidental_pitches === undefined) {

        if (!this.accidentals) {

            this.accidentals =
                this.getAccidentalsByFifths();
        }

        if (this.accidentals) {

            var octave_shift = 0; // this.tempFixOctaveShift();

            this.accidental_pitches =
                this.accidentals.map(

                    function(accidental, index, accidentals) {

                        accidental.octave += octave_shift;

                        var pitch =
                            new ScoreLibrary.Score.Pitch(accidental);

                        if (octave_shift !== 0) {

                            pitch.octave_shift = true;
                        }

                        return pitch;
                    });
        }
    }

    return this.accidental_pitches;
};

ScoreLibrary.Score.Key.prototype.createRenderer =
    function(glyph_factory) {

        var packAccidental =
            function(pitch, key_renderer, glyph_factory, padding_e) {

                padding_e = padding_e || 0;

                var fake_accidental =
                    new ScoreLibrary.Score.Accidental(
                        undefined, this.getStaff(), pitch.alter);

                var accidental_glyph =
                    fake_accidental.createRenderer(glyph_factory);

                if (accidental_glyph !== undefined) {

                    var outline_bbox =
                        accidental_glyph.getOutlineBoundbox();

                    var y = this.getClef().getYOfPitchOnStaff(pitch) +
                        outline_bbox.y_min;

                    var fix_org_coord = 'staff';

                    accidental_glyph.setOrg(fix_org_coord, 'y', y);

                    key_renderer.pack(
                        accidental_glyph, false, false,
                        0, padding_e, fix_org_coord);
                }
            };

        var key_renderer = undefined;

        var key_pitches = this.getAccidentalPitches();

        var old_pitches = this.old_pitches;

        if (old_pitches !== key_pitches &&
            (old_pitches || key_pitches)) {

            key_renderer =
                new ScoreLibrary.Renderer.HBoxGlyph('KeyAccidentals');

            this.setRenderer(key_renderer);
        }

        if (old_pitches) {

            old_pitches.forEach(

                function(pitch, index, pitches) {

                    pitch.alter = 0;

                    packAccidental.call(
                        this, pitch, key_renderer, glyph_factory,
                        (index === pitches.length - 1 ? 5 : 0));
                }, this);
        }

        if (key_pitches) {

            key_pitches.forEach(

                function(pitch) {

                    packAccidental.call(
                        this, pitch, key_renderer, glyph_factory);
                }, this);
        }

        return key_renderer;
    };
/**
 * @author XiongWenjie <navigator117@gmail.com>
 * @license This file is part of
 * score-library <http://www.musicxml-viewer.com>.
 * score-library is free software:
 * you can redistribute it and/or modify it under the terms of the
 * GNU General Public License as published by the Free Software Foundation,
 * either version 3 of the License, or (at your option) any later version.
 *
 * score-library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with score-library.
 * If not, see <http://www.gnu.org/licenses>.
 */
