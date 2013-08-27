goog.provide('ScoreLibrary.Renderer.Curve');
goog.require('ScoreLibrary.Renderer.CustomGlyph');
goog.require('ScoreLibrary.Renderer.PaintContext');
goog.require('ScoreLibrary.Renderer.PaintHelper');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Renderer.CustomGlyph}
 */
ScoreLibrary.Renderer.Curve = function() {

    var supperclass = ScoreLibrary.Renderer.Curve.supperclass;

    supperclass.constructor.call(this, 'Curve');
};

ScoreLibrary.inherited(
    ScoreLibrary.Renderer.Curve,
    ScoreLibrary.Renderer.CustomGlyph);

ScoreLibrary.Renderer.Curve.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Renderer.Curve();

    var supperclass = ScoreLibrary.Renderer.Curve.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Renderer.Curve.prototype.draw = function(context) {

    var supperclass = ScoreLibrary.Renderer.Curve.supperclass;

    supperclass.draw.call(this, context);

    var curve = this.getModel();

    var x0 = 0;
    var y0 = 0;
    var x1 = x0 + this.getRequisite('width');
    var y1 = y0 + this.getRequisite('height');

    var cpx = x0 + curve.getCtrlFactor();
    var cpy = y1 - curve.getCtrlFactor();

    context.save();

    this.transform(context);

    context.setSourceRgb('#000000');
    context.setLineWidth(1);

    context.beginPath();

    var paint_helper = ScoreLibrary.Renderer.PAINT_HELPER;

    if (y0 === y1) {

        paint_helper.drawHorizontalLine(context, x0, x1, y0);
    }
    else if (x0 === x1) {

        paint_helper.drawVerticalLine(context, x0, y0, y1);
    }
    else {

        paint_helper.drawQuadraticCurve(
            context, x0, y0, x1, y1, cpx, cpy);
    }

    context.stroke();

    context.restore();
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
