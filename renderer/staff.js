goog.provide('ScoreLibrary.Renderer.Staff');
goog.require('ScoreLibrary.Renderer.CustomGlyph');
goog.require('ScoreLibrary.Renderer.PaintHelper');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Renderer.CustomGlyph}
 */
ScoreLibrary.Renderer.Staff = function(staff) {

    var supperclass = ScoreLibrary.Renderer.Staff.supperclass;

    supperclass.constructor.call(this, 'Staff');

    this.staff = staff;
};

ScoreLibrary.inherited(
    ScoreLibrary.Renderer.Staff,
    ScoreLibrary.Renderer.CustomGlyph);

ScoreLibrary.Renderer.Staff.prototype.getImplicit = function(dimension) {

    return (dimension === 'width' ? 0 :
            this.staff.getHeightOfSpace() *
            this.staff.getNumberOfSpaces() +
            this.staff.getLineWidth());
};

ScoreLibrary.Renderer.Staff.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Renderer.Staff(this.staff);

    var supperclass = ScoreLibrary.Renderer.Staff.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Renderer.Staff.prototype.draw = function(context) {

    var supperclass = ScoreLibrary.Renderer.Staff.supperclass;

    supperclass.draw.call(this, context);

    context.save();

    var allocate_width = this.getAllocate('width');

    context.setSourceRgb(this.staff.getLineColor());
    context.setLineWidth(this.staff.getLineWidth());

    var x0 = 0;
    var x1 = allocate_width;

    var y = 0;

    var paint_helper = ScoreLibrary.Renderer.PAINT_HELPER;

    var num_of_lines = this.staff.getNumberOfLines();

    for (var line_number = 1;
         line_number <= num_of_lines;
         ++line_number) {

        context.beginPath();

        paint_helper.drawLine(context, x0, y, x1, y);

        context.stroke();

        y += this.staff.getHeightOfSpace();
    }

    context.restore();
};

ScoreLibrary.Renderer.Staff.prototype.getYOnStaff = function() {

    return -this.staff.getYOfLineInStaffCoord(
        this.staff.getCenterLineNumber());
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
