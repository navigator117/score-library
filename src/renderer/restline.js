goog.provide('ScoreLibrary.Renderer.RestLine');
goog.require('ScoreLibrary.Renderer.CustomGlyph');
goog.require('ScoreLibrary.Renderer.PaintContext');
goog.require('ScoreLibrary.Renderer.PaintHelper');
goog.require('ScoreLibrary.Renderer.Staff');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Renderer.CustomGlyph}
 */
ScoreLibrary.Renderer.RestLine = function(rest, staff) {

    var supperclass = ScoreLibrary.Renderer.RestLine.supperclass;

    supperclass.constructor.call(this, 'rests.line');

    this.rest = rest;
    this.staff = staff;
};

ScoreLibrary.inherited(
    ScoreLibrary.Renderer.RestLine,
    ScoreLibrary.Renderer.CustomGlyph);

ScoreLibrary.Renderer.RestLine.prototype.draw = function(context) {

    var supperclass = ScoreLibrary.Renderer.RestLine.supperclass;

    supperclass.draw.call(this, context);

    this.drawRestLine(context);
};

ScoreLibrary.Renderer.RestLine.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Renderer.RestLine();

    var supperclass = ScoreLibrary.Renderer.RestLine.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Renderer.RestLine.prototype.getImplicit = function(dimension) {

    return (dimension === 'width' ?
            this.staff.getHeightOfSpace() * 10 :
            this.staff.getHeightOfSpace() * 2);
};

ScoreLibrary.Renderer.RestLine.prototype.drawRestLine = function(context) {

    context.save();

    var parent_x = this.getOrg('parent', 'x');
    var parent_y = this.getOrg('parent', 'y');

    var allocate_width = this.getAllocate('width');
    var allocate_height = this.getAllocate('height');

    context.translate(parent_x, parent_y);

    var paint_helper = ScoreLibrary.Renderer.PAINT_HELPER;

    var line_width = this.staff.getLineWidth() * 8;

    var x0 = 0, x1 = allocate_width;

    var y0 = 0, y1 = allocate_height;

    y0 = y1 = allocate_height * 0.5;

    context.setLineWidth(line_width);

    context.beginPath();

    paint_helper.drawLine(context, x0, y0, x1, y1);

    context.stroke();

    line_width = this.staff.getLineWidth() * 0.5;

    x0 = x1 = 0;

    y0 = 0, y1 = allocate_height;

    context.setLineWidth(line_width);

    context.beginPath();

    paint_helper.drawLine(context, x0, y0, x1, y1);

    context.stroke();

    x0 = x1 = allocate_width;

    context.setLineWidth(line_width);

    context.beginPath();

    paint_helper.drawLine(context, x0, y0, x1, y1);

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
