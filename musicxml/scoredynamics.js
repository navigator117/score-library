goog.provide('ScoreLibrary.Score.Dynamics');
goog.require('ScoreLibrary.Renderer.HBoxGlyph');
goog.require('ScoreLibrary.Score');
goog.require('ScoreLibrary.Score.Anchor');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Score.Anchor}
 */
ScoreLibrary.Score.Dynamics = function(number, information) {

    var supperclass = ScoreLibrary.Score.Dynamics.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.Dynamics,
    ScoreLibrary.Score.Anchor);

ScoreLibrary.Score.Dynamics.prototype.toString = function() {

    return 'Score.Dynamics';
};

ScoreLibrary.Score.Dynamics.prototype.toNodeString = function() {

    return 'dynamics';
};

ScoreLibrary.Score.Dynamics.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.Dynamics(this.number, this.information);

    var supperclass = ScoreLibrary.Score.Dynamics.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Score.Dynamics.prototype.getTexts = function() {

    return this.information.texts;
};

ScoreLibrary.Score.Dynamics.prototype._getCharRequisition =
    function(character) {

        var requisition = { width: undefined, height: undefined };

        switch (character) {

        case 'r':
        case 'z':
        case 's':
        case 'm': {
            requisition.height = 8;
        } break;

        case 'p': {

            requisition.height = 13;
        } break;

        case 'f': {

            requisition.height = 18;
        } break;

        case '-': {

            requisition.width = 10;
        } break;

        default: {

            requisition.width = 15;
        } break;
        }

        return requisition;
    };
ScoreLibrary.Score.Dynamics.prototype.createRenderer = function(context) {
    //
    // TODO: use custom_renderer.setStyle(
    // ScoreLibrary.Renderer.CustomTextRenderer.Style.MixCustom);
    // to complete this.
    //
    var custom_renderer = context.getCustomTextRenderer();

    var glyph_factory = custom_renderer.getGlyphFactory();

    var dynamics_glyph = undefined;

    var dynamics_texts = this.getTexts();
    if (dynamics_texts) {

        dynamics_texts.forEach(
            function(dynamics_text, index, dynamics_texts) {

                for (var i = 0; i < dynamics_text.length; ++i) {

                    var character = dynamics_text.charAt(i);

                    var requisition =
                        this._getCharRequisition(character);

                    var glyph =
                        glyph_factory.createByName(
                            character,
                            requisition.width,
                            requisition.height);

                    if (glyph) {

                        // !NOTE: temp fix dynamic display.
                        glyph.explicit_width *= 0.6;

                        dynamics_glyph = dynamics_glyph ||
                            new ScoreLibrary.Renderer.HBoxGlyph('Dynamics');

                        var obox = glyph.getOutlineBoundbox();

                        var fix_org_coord = 'dynamics';

                        glyph.setOrg(fix_org_coord, 'y', obox.y_min);

                        var padding =
                            ('p' === character ?
                             1 : ('z' === character ? 2 : 0));

                        dynamics_glyph.pack(
                            glyph, false, false,
                            padding, padding, fix_org_coord);
                    }
                }
            }, this);
    }

    this.setRenderer(dynamics_glyph);

    return dynamics_glyph;
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
