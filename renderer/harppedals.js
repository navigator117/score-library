goog.provide('ScoreLibrary.Renderer.HarpPedals');
goog.require('ScoreLibrary.Renderer.CustomGlyph');
goog.require('ScoreLibrary.Renderer.PaintHelper');
goog.require('ScoreLibrary.Renderer.TextBox');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Renderer.CustomGlyph}
 */
ScoreLibrary.Renderer.HarpPedals = function() {

    var supperclass = ScoreLibrary.Renderer.HarpPedals.supperclass;

    supperclass.constructor.call(this, 'HarpPedals');

    this.setExplicit('width', 80);
    this.setExplicit('height', 25);
};

ScoreLibrary.inherited(
    ScoreLibrary.Renderer.HarpPedals,
    ScoreLibrary.Renderer.CustomGlyph);

ScoreLibrary.Renderer.HarpPedals.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Renderer.HarpPedals();

    var supperclass = ScoreLibrary.Renderer.HarpPedals.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Renderer.HarpPedals.prototype.draw = function(context) {

    var supperclass = ScoreLibrary.Renderer.HarpPedals.supperclass;

    supperclass.draw.call(this, context);

    this.drawCoordinate(context);
    this.drawTunings(context);
};

ScoreLibrary.Renderer.HarpPedals.prototype.drawCoordinate = function(context) {

    context.save();

    context.setLineWidth(1);
    context.setSourceRgb('#000000');

    var requisite_width = this.getRequisite('width');
    var requisite_height = this.getRequisite('height');

    var paint_helper = ScoreLibrary.Renderer.PAINT_HELPER;

    context.beginPath();

    paint_helper.drawLine(
        context, 0, requisite_height * 0.5,
        0 + requisite_width, requisite_height * 0.5);

    context.stroke();

    context.beginPath();

    paint_helper.drawLine(
        context, requisite_width * 0.43, 0,
        requisite_width * 0.43, 0 + requisite_height);

    context.stroke();

    context.restore();
};

ScoreLibrary.Renderer.HarpPedals.prototype.drawTunings = function(context) {

    var harppedals = this.getModel();

    context.save();

    context.setLineWidth(3);
    context.setSourceRgb('#000000');

    var requisite_width = this.getRequisite('width');
    var requisite_height = this.getRequisite('height');

    var paint_helper = ScoreLibrary.Renderer.PAINT_HELPER;

    var tunings = harppedals.getPedalTunings();

    var step_width = requisite_width / 8;
    var step_height = requisite_height / 3;

    ['D', 'C', 'B', 'E', 'F', 'G', 'A'].forEach(
        function(step, index, steps) {

            var alter = tunings[step];

            var x = step_width * 0.5 + index * step_width;

            x += (index >= 3 ? step_width : 0);

            var y0 = step_height;

            if (alter < 0) {

                y0 += step_height;
            }
            else if (alter > 0) {

                y0 += -step_height;
            }

            var y1 = y0 + step_height;

            context.beginPath();

            paint_helper.drawLine(
                context, x, y0, x, y1);

            context.stroke();
        });

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
