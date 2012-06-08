goog.provide('ScoreLibrary.Score.AccidentalMark');
goog.provide('ScoreLibrary.Score.Fermata');
goog.require('ScoreLibrary.Score');
goog.require('ScoreLibrary.Score.Accidental');
goog.require('ScoreLibrary.Score.GlyphAnchor');

/**
 * @constructor
 * @extends {ScoreLibrary.Score.GlyphAnchor}
 */
ScoreLibrary.Score.Fermata = function(number, information) {

    var supperclass = ScoreLibrary.Score.Fermata.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.Fermata,
    ScoreLibrary.Score.GlyphAnchor);

ScoreLibrary.Score.Fermata.prototype.toString = function() {

    return 'Score.Fermata';
};

ScoreLibrary.Score.Fermata.prototype.toNodeString = function() {

    return 'fermata';
};

ScoreLibrary.Score.Fermata.prototype.getGlyphNames = function() {

    var glyph_name = 'scripts.';

    switch (this.getType()) {
    default:
    case 'upright': {
        glyph_name += 'u';
    } break;
    case 'inverted': {
        glyph_name += 'd';
    } break;
    }

    switch (this.getText()) {
    default:
    case 'normal': {
    } break;
    case 'angled': {
        glyph_name += 'short';
    } break;
    case 'square': {
        glyph_name += 'long';
    } break;
    }

    glyph_name += 'fermata';

    return [glyph_name];
};

ScoreLibrary.Score.Fermata.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.Fermata(this.number, this.information);

    var supperclass = ScoreLibrary.Score.Fermata.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Score.Fermata.prototype.getText = function() {

    return this.information.text;
};

ScoreLibrary.Score.Fermata.prototype.getType = function() {

    return this.information.type;
};

ScoreLibrary.Score.Fermata.prototype.getDirection = function() {

    return (this.getType() === 'upright' ? 'upper' : 'lower');
};

/**
 * @constructor
 * @extends {ScoreLibrary.Score.GlyphAnchor}
 */
ScoreLibrary.Score.AccidentalMark = function(number, information) {

    var supperclass = ScoreLibrary.Score.AccidentalMark.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.AccidentalMark,
    ScoreLibrary.Score.GlyphAnchor);

ScoreLibrary.Score.AccidentalMark.prototype.toString = function() {

    return 'Score.AccidentalMark';
};

ScoreLibrary.Score.AccidentalMark.prototype.toNodeString = function() {

    return 'accidental-mark';
};

ScoreLibrary.Score.AccidentalMark.prototype.getGlyphNames = function() {

    var accidentalToGlyphName =
        ScoreLibrary.Score.Accidental.prototype.accidentalToGlyphName;

    return [accidentalToGlyphName.call(this, this.getAccidental())];
};

ScoreLibrary.Score.AccidentalMark.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.AccidentalMark(this.number, this.information);

    var supperclass = ScoreLibrary.Score.AccidentalMark.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Score.AccidentalMark.prototype.getAccidental = function() {

    return this.information.accidental;
};

ScoreLibrary.Score.AccidentalMark.prototype.getDefaultSize =
    function(glyph_name) {

        var requisition = { width: undefined, height: undefined };

        if (glyph_name === 'accidentals.doublesharp') {

            requisition.height = 10;
        }
        else {

            requisition.height = 20;
        }

        return requisition;
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
