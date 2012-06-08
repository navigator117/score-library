goog.provide('ScoreLibrary.Renderer.PaintHelper');
goog.require('ScoreLibrary.Renderer');
goog.require('goog.asserts');

/**
 * @constructor
 */
ScoreLibrary.Renderer.PaintHelper = function() {
};

/**
 * @type {ScoreLibrary.Renderer.PaintHelper}
 * @const
 */
ScoreLibrary.Renderer.PAINT_HELPER =
    ScoreLibrary.Renderer.PAINT_HELPER ||
    new ScoreLibrary.Renderer.PaintHelper();

/**
 * @enum {number}
 */
ScoreLibrary.Renderer.PaintHelper.OpenSides = {

    Left: 1,
    Top: 2,
    Right: 4,
    Bottom: 8
};

ScoreLibrary.Renderer.PaintHelper.prototype.toString = function() {

    return 'Renderer.PaintHelper';
};

ScoreLibrary.Renderer.PaintHelper.prototype.drawLine =
    function(context, x0, y0, x1, y1) {

        context.moveTo(x0, y0);
        context.lineTo(x1, y1);
    };

ScoreLibrary.Renderer.PaintHelper.prototype.drawHorizontalLine =
    function(context, x0, x1, y) {
        this.drawLine(context, x0, y, x1, y);
    };

ScoreLibrary.Renderer.PaintHelper.prototype.drawVerticalLine =
    function(context, x, y0, y1) {

        this.drawLine(context, x, y0, x, y1);
    };

ScoreLibrary.Renderer.PaintHelper.prototype.drawParallelogramYByRadian =
    function(context, x0, x1, y0, y1, radian) {

        var slant = (x1 - x0) * Math.tan(radian);

        this.drawParallelogramYBySlant(context, x0, x1, y0, y1, slant);
    };

ScoreLibrary.Renderer.PaintHelper.prototype.drawParallelogramYBySlant =
    function(context, x0, x1, y0, y1, slant) {

        var y3 = y0 + slant;
        var y2 = y1 + slant;

        this.drawParallelogramY(context, x0, x1, y0, y1, y2, y3);
    };

ScoreLibrary.Renderer.PaintHelper.prototype.drawParallelogramY =
    function(context, x0, x1, y0, y1, y2, y3) {

        context.moveTo(x0, y0);
        context.lineTo(x0, y1);
        context.lineTo(x1, y2);
        context.lineTo(x1, y3);
    };

ScoreLibrary.Renderer.PaintHelper.prototype.drawBezierCurve =
    function(context, x0, y0, x1, y1, cp1x, cp1y, cp2x, cp2y) {

        context.moveTo(x0, y0);

        context.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x1, y1);
    };

ScoreLibrary.Renderer.PaintHelper.prototype.drawQuadraticCurve =
    function(context, x0, y0, x1, y1, cpx, cpy) {

        context.moveTo(x0, y0);
        context.quadraticCurveTo(cpx, cpy, x1, y1);
    };

ScoreLibrary.Renderer.PaintHelper.prototype.drawCurve =
    function(context, x0, y0, x1, y1, downward, bow) {

        var sign = (downward ? 1 : -1);

        var delta_x = x1 - x0;
        var delta_y = y1 - y0;

        var ratio = 0.25;

        var max_bow = delta_x * 0.4;

        if (bow > max_bow && delta_y < 2 * 10) {

            bow = max_bow;
        }

        bow *= sign;

        var slope = delta_y / delta_x;

        var cp1x = x0 + delta_x * ratio;
        var cp1y = y0 + (cp1x - x0) * slope + bow;

        var cp2x = x1 - delta_x * ratio;
        var cp2y = y0 + (cp2x - x0) * slope + bow;

        context.moveTo(x0, y0);
        context.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x1, y1);
    };

ScoreLibrary.Renderer.PaintHelper.prototype.drawBow =
    function(context, x0, y0, x1, y1, downward, bow) {

        var sign = (downward ? 1 : -1);

        var thickness = sign * 2;

        var delta_x = x1 - x0;
        var delta_y = y1 - y0;

        var ratio = 0.25;

        var max_bow = delta_x * 0.4;

        if (bow > max_bow && delta_y < 2 * 10) {

            bow = max_bow;
        }

        bow *= sign;

        var slope = delta_y / delta_x;

        var cp1x = x0 + delta_x * ratio;
        var cp1y = y0 + (cp1x - x0) * slope + bow;

        var cp2x = x1 - delta_x * ratio;
        var cp2y = y0 + (cp2x - x0) * slope + bow;

        context.moveTo(x0, y0);
        context.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x1, y1);

        cp1y += thickness;
        cp2y += thickness;

        context.bezierCurveTo(cp2x, cp2y, cp1x, cp1y, x0, y0);
    };

ScoreLibrary.Renderer.PaintHelper.prototype.drawCircle =
    function(context, x, y, radius) {

        context.arc(x, y, radius, 0, Math.PI * 2);
    };

ScoreLibrary.Renderer.PaintHelper.prototype.drawBracket =
    function(context, x, y, width, height, open_sides,
             line_type, dash_length, space_length) {

        var lineDrawer =
            (line_type === 'dashed' ?
             this.drawDashedLine : this.drawLine);

        var open_types =
            ScoreLibrary.Renderer.PaintHelper.OpenSides;

        if (!(open_sides & open_types.Left)) {

            lineDrawer.call(this, context,
                            x, y, x, y + height,
                            dash_length, space_length);
        }

        if (!(open_sides & open_types.Top)) {

            lineDrawer.call(this, context,
                            x, y + height, x + width, y + height,
                            dash_length, space_length);
        }

        if (!(open_sides & open_types.Right)) {

            lineDrawer.call(this, context,
                            x + width, y + height, x + width, y,
                            dash_length, space_length);
        }

        if (!(open_sides & open_types.Bottom)) {

            lineDrawer.call(this, context, x + width, y, x, y,
                            dash_length, space_length);
        }
    };

ScoreLibrary.Renderer.PaintHelper.prototype.drawWedge =
    function(context, x0, x1, y, spread, open_sides) {

        var open_types =
            ScoreLibrary.Renderer.PaintHelper.OpenSides;

        if (open_sides & open_types.Left) {

            context.moveTo(x0, y + spread);
            context.lineTo(x1, y + spread * 0.5);
            context.lineTo(x0, y);
        }
        else {

            context.moveTo(x1, y + spread);
            context.lineTo(x0, y + spread * 0.5);
            context.lineTo(x1, y);
        }
    };

ScoreLibrary.Renderer.PaintHelper.prototype.drawDashedLine =
    function(context, x0, y0, x1, y1, dash_length, space_length) {

        dash_length = dash_length || 5;
        space_length = space_length || 5;

        var delta_x = x1 - x0;
        var delta_y = y1 - y0;

        var line_length = Math.abs(Math.sqrt(
            Math.pow(delta_x, 2) + Math.pow(delta_y, 2)));

        var dash_not_space = true;

        var acc_line_length = 0;

        var org_x = x0;
        var org_y = y0;

        while (acc_line_length < line_length) {

            var remaining_length =
                line_length - acc_line_length;

            var step_length = (dash_not_space ?
                               dash_length : space_length);

            acc_line_length += (remaining_length < step_length ?
                                remaining_length : step_length);

            var acc_x = x0 + acc_line_length * delta_x / line_length;
            var acc_y = y0 + acc_line_length * delta_y / line_length;

            if (dash_not_space) {

                this.drawLine(
                    context, org_x, org_y, acc_x, acc_y);
            }

            org_x = acc_x;
            org_y = acc_y;

            dash_not_space = !dash_not_space;
        }
    };

ScoreLibrary.Renderer.PaintHelper.prototype.drawWavyLine =
    function(context, x0, y0, x1, y1) {

        var delta_x = x1 - x0;
        var delta_y = y1 - y0;

        goog.asserts.assert(
            delta_x !== 0,
            'Renderer.PaintHelper.drawWavyLine(): invalid arguments!');

        var swing = 5;

        var step_length = 3;

        var radian = Math.atan(delta_y / delta_x);

        context.transform(
            Math.cos(radian), Math.sin(radian),
                -Math.sin(radian), Math.cos(radian),
            x0 + step_length, y0);

        var horizontal_length =
            Math.abs(Math.sqrt(
                Math.pow(delta_x, 2) +
                    Math.pow(delta_y, 2))) - step_length;

        var org_x = 0;
        var org_y = 0;

        var swing_up = true;

        while (org_x < horizontal_length) {

            //      var remaining_length = horizontal_length - org_x;

            var step_x = step_length;
            //            (remaining_length < step_length ?
            //            remaining_length : step_length);

            var step_y =
                step_x * (swing / step_length);

            var acc_x = org_x + step_x;
            var acc_y = org_y + (swing_up ? 1 : -1) * step_y;

            this.drawLine(
                context, org_x, org_y, acc_x, acc_y);

            org_x = acc_x;
            org_y = acc_y;

            swing_up = !swing_up;
        }
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
