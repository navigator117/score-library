goog.provide('ScoreLibrary.Renderer.Dashes');
goog.require('ScoreLibrary.Renderer.CustomGlyph');
goog.require('ScoreLibrary.Renderer.PaintHelper');
goog.require('ScoreLibrary.Renderer.Wedge');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Renderer.CustomGlyph}
 */
ScoreLibrary.Renderer.Dashes = function() {

    var supperclass = ScoreLibrary.Renderer.Dashes.supperclass;

    supperclass.constructor.call(this, 'Dashes');
};

ScoreLibrary.inherited(
    ScoreLibrary.Renderer.Dashes,
    ScoreLibrary.Renderer.CustomGlyph);

ScoreLibrary.Renderer.Dashes.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Renderer.Dashes();

    var supperclass = ScoreLibrary.Renderer.Dashes.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Renderer.Dashes.prototype.draw = function(context) {

    var supperclass = ScoreLibrary.Renderer.Dashes.supperclass;

    supperclass.draw.call(this, context);

    var dashes = this.getModel();

    context.save();
    context.setLineWidth(1);
    context.setSourceRgb('#000000');

    var x0 = this.getX0OfDashes();
    var x1 = this.getX1OfDashes();

    context.beginPath();

    var paint_helper = ScoreLibrary.Renderer.PAINT_HELPER;

    paint_helper.drawDashedLine(
        context, x0, 0, x1, 0,
        dashes.getDashLength(),
        dashes.getSpaceLength());

    context.stroke();
    context.restore();
};

ScoreLibrary.Renderer.Dashes.prototype.getX0OfDashes =
    ScoreLibrary.Renderer.Wedge.prototype.getX0OfWedge;

ScoreLibrary.Renderer.Dashes.prototype.getX1OfDashes =
    ScoreLibrary.Renderer.Wedge.prototype.getX1OfWedge;
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
