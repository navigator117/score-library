goog.provide('ScoreLibrary.Score.Time');
goog.require('ScoreLibrary.Renderer.HBoxGlyph');
goog.require('ScoreLibrary.Renderer.VBoxGlyph');
goog.require('ScoreLibrary.Score');
goog.require('ScoreLibrary.Score.AttributeElement');
goog.require('ScoreLibrary.Score.Clef');
goog.require('ScoreLibrary.Score.XMLHelper');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Score.AttributeElement}
 */
ScoreLibrary.Score.Time = function(owner, time_node) {

    var supperclass = ScoreLibrary.Score.Time.supperclass;

    supperclass.constructor.call(this, owner, time_node);

    var xml_helper = ScoreLibrary.Score.XMLHelper.getInstance();

    xml_helper.getTime(this, this);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.Time,
    ScoreLibrary.Score.AttributeElement);

ScoreLibrary.Score.Time.prototype.toString = function() {

    return 'Score.Time';
};

ScoreLibrary.Score.Time.prototype.clone = function() {

    clone = new ScoreLibrary.Score.Time(this.owner, this.node);

    var supperclass = ScoreLibrary.Score.Time.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Score.Time.prototype.createCommonDisplay =
    function(glyph_factory, beat_pair) {

        var signature = undefined;

        if (beat_pair.beats === '4' &&
            beat_pair.beat_type === '4') {

            signature =
                glyph_factory.createByName(
                    'timesig.C44',
                    undefined,
                    this.getStaff().getHeightOfSpace() * 2
                );
        }
        else if (beat_pair.beats === '2' &&
                 beat_pair.beat_type === '2') {

            signature =
                glyph_factory.createByName(
                    'timesig.C22',
                    undefined,
                    this.getStaff().getHeightOfSpace() * 3.4
                );
        }

        return signature;
    };

ScoreLibrary.Score.Time.prototype.createSingleDisplay =
    function(glyph_factory, name, centralize) {

        var centralizeSignature = function(signature) {

            var outline_bbox =
                signature.getOutlineBoundbox();

            var height = (outline_bbox.y_max - outline_bbox.y_min);

            outline_bbox.y_min -= height * 0.5;
            outline_bbox.y_max -= height * 0.5;

            signature.setOutlineBoundbox(outline_bbox);

            return signature;
        };

        var signature =
            (name.length > 1 ?
             new ScoreLibrary.Renderer.HBoxGlyph('TimeSignature.Compound') :
             undefined);

        for (var i = 0; i < name.length; ++i) {

            var character = name.charAt(i);

            var glyph =
                glyph_factory.createByChar(
                    character,
                    undefined,
                    character === '+' ?
                        this.getStaff().getHeightOfSpace() :
                        this.getStaff().getHeightOfSpace() * 2
                );

            goog.asserts.assert(
                glyph !== undefined,
                'ScoreLibrary.Score.Time.createSingleDisplay(): unexpect!');
            if (signature !== undefined) {

                var outline_bbox =
                    glyph.getOutlineBoundbox();

                var fix_org_coord = 'staff';

                glyph.setOrg(fix_org_coord, 'y', outline_bbox.y_min);

                signature.pack(glyph, false, false, 0, 0, fix_org_coord);
            }
            else {

                signature = glyph;
            }
        }

        if (centralize) {

            signature = centralizeSignature(signature);
        }

        return signature;
    };

ScoreLibrary.Score.Time.prototype.createFractionalDisplay =
    function(glyph_factory, beat_pair) {

        var fractional =
            new ScoreLibrary.Renderer.VBoxGlyph('TimeSignature.Fractional');

        var numerator = beat_pair.beats;

        var denominator = beat_pair.beat_type;

        [denominator, numerator].forEach(

            function(name, index, names) {

                var signature =
                    this.createSingleDisplay(glyph_factory, name);

                var outline_bbox =
                    signature.getOutlineBoundbox();

                var width = (outline_bbox.x_max - outline_bbox.x_min);

                var fix_org_coord = 'fractional';

                signature.setOrg(fix_org_coord, 'x', -width * 0.5);

                fractional.pack(signature, false, false, 0, 0, fix_org_coord);
            }, this);

        var outline_bbox =
            fractional.getOutlineBoundbox();

        outline_bbox.y_min -= this.getStaff().getHeightOfSpace() * 2;
        outline_bbox.y_max -= this.getStaff().getHeightOfSpace() * 2;

        fractional.setOutlineBoundbox(outline_bbox);

        return fractional;
    };

ScoreLibrary.Score.Time.prototype.createRenderer = function(glyph_factory) {

    var signature = undefined;

    do {

        var compound = undefined;

        if (this.senza_misura) {

            break;
        }

        compound =
            this.beat_pairs.length > 1 ?
            new ScoreLibrary.Renderer.HBoxGlyph('TimeSignature.Compound') :
            undefined;

        this.beat_pairs.forEach(

            function(beat_pair, index, beat_pairs) {

                signature = undefined;

                if (this.symbol === 'single-number' &&
                    beat_pairs.length === 1 &&
                    !(/\D+/.test(beat_pairs[0].beats)) &&
                    !(/\D+/.test(beat_pairs[0].beat_type))) {

                    signature =
                        this.createSingleDisplay(
                            glyph_factory, beat_pair.beats, true);
                }

                if (this.symbol === 'common' || this.symbol === 'cut') {

                    signature =
                        this.createCommonDisplay(glyph_factory, beat_pair);
                }

                if (signature === undefined) {

                    signature =
                        this.createFractionalDisplay(glyph_factory, beat_pair);
                }

                if (compound !== undefined) {

                    var outline_bbox =
                        signature.getOutlineBoundbox();

                    var fix_org_coord = 'compound';

                    signature.setOrg(fix_org_coord, 'y', outline_bbox.y_min);

                    compound.pack(signature, false, false, 0, 0, fix_org_coord);

                    if (index !== beat_pairs.length - 1) {

                        var plus =
                            glyph_factory.createByChar(
                                '+',
                                undefined,
                                this.getStaff().getHeightOfSpace()
                            );

                        // Plus Glyph's origin Y is bottom.
                        var outline_bbox_of_plus =
                            plus.getOutlineBoundbox();

                        plus.setOrg(fix_org_coord, 'y',
                                    -(outline_bbox_of_plus.y_max -
                                      outline_bbox_of_plus.y_min) * 0.5);

                        compound.pack(plus, false, false, 0, 0, fix_org_coord);
                    }
                }
            }, this);

        signature =
            (compound !== undefined ? compound : signature);

    } while (false);

    if (signature) {

        this.setRenderer(signature);
    }

    return signature;
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
