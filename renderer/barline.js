goog.provide('ScoreLibrary.Renderer.Barline');
goog.require('ScoreLibrary.Renderer.CustomGlyph');
goog.require('ScoreLibrary.Renderer.PaintContext');
goog.require('ScoreLibrary.Renderer.PaintHelper');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Renderer.CustomGlyph}
 */
ScoreLibrary.Renderer.Barline = function() {

    var supperclass = ScoreLibrary.Renderer.Barline.supperclass;

    supperclass.constructor.call(this, 'Barline');
};

ScoreLibrary.inherited(
    ScoreLibrary.Renderer.Barline,
    ScoreLibrary.Renderer.CustomGlyph);

ScoreLibrary.Renderer.Barline.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Renderer.Barline();

    var supperclass = ScoreLibrary.Renderer.Barline.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Renderer.Barline.prototype.getImplicit = function(dimension) {

    return (dimension === 'width' ?
            this.getBarlineWidth() : this.getBarlineHeight());
};

ScoreLibrary.Renderer.Barline.prototype.getStaff = function() {

    var barline = this.getModel();

    return barline.getTunnelStates().getStaffByNumber(this.staff_number);
};

ScoreLibrary.Renderer.Barline.prototype.extendHeight = function(extend_height) {

    this.extend_height =
        (this.extend_height !== undefined ?
         Math.max(this.extend_height, extend_height) : extend_height);
};

ScoreLibrary.Renderer.Barline.prototype.setLightWeight =
    function(light_weight) {

        this.light_weight = light_weight;
    };

ScoreLibrary.Renderer.Barline.prototype.getLightWeight = function() {

    return (this.light_weight !== undefined ?
            this.light_weight : this.getStaff().getLineWidth());
};

ScoreLibrary.Renderer.Barline.prototype.getHeavyWeight = function() {

    return this.getLightWeight() * 4;
};

ScoreLibrary.Renderer.Barline.prototype.getSpaceWeight = function() {

    return this.getLightWeight() * 2;
};

ScoreLibrary.Renderer.Barline.prototype.getBarlineWidth = function() {

    var barline_width = 0;

    var barline = this.getModel();

    if (barline.repeat) {

        barline_width += this.getHeavyWeight();
    }

    switch (barline.bar_style) {

    case 'light-light': {

        barline_width +=
        this.getLightWeight() * 2 +
            this.getSpaceWeight();
    } break;

    case 'light-heavy':
    case 'heavy-light': {

        barline_width +=
        this.getLightWeight() +
            this.getSpaceWeight() +
            this.getHeavyWeight();
    } break;

    case 'heavy-heavy': {

        barline_width +=
        this.getHeavyWeight() * 2 +
            this.getSpaceWeight();
    } break;

    case 'regular':
    case 'dotted':
    case 'dashed':
    case 'tick':
    case 'short':
    case 'none':
    default: {

        barline_width += this.getLightWeight();
    } break;
    }

    return barline_width;
};

ScoreLibrary.Renderer.Barline.prototype.setBarlineHeight =
    function(barline_height) {

        this.barline_height = barline_height;
    };

ScoreLibrary.Renderer.Barline.prototype.getBarlineHeight = function() {

    return (this.barline_height !== undefined ? this.barline_height :
            this.getStaff().getNumberOfSpaces() *
            this.getStaff().getHeightOfSpace());
};

ScoreLibrary.Renderer.Barline.prototype.getLocation = function() {

    var barline = this.getModel();

    return (barline && barline.location ? barline.location : 'right');
};

ScoreLibrary.Renderer.Barline.prototype.drawDottedLine = function(context, x) {

    // staff line 1.
    var y0 = 0;

    // staff line 1 + staff height.
    var y1 = this.getBarlineHeight();

    var radius = 2;

    for (var y = y0; y < y1; y += 10) {

        this.drawDot(context, x + radius, y + 5, radius);
    }
};

ScoreLibrary.Renderer.Barline.prototype.drawDashedLine = function(context, x) {

    // staff line 1.
    var y0 = 0;

    // staff line 1 + staff height.
    var y1 = this.getBarlineHeight();

    line_width = this.getLightWeight();

    x += line_width * 0.5;

    for (var i = 0, y = y0; y < y1; ++i, y += 2 * 2) {

        this.drawLine(context, x, line_width,
                      y, y += ((i === 0 || i === 4) ? 5 - 2 : (5 - 2) * 2));
    }
};

ScoreLibrary.Renderer.Barline.prototype.drawLine =
    function(context, x, line_width, y0, y1) {

        // staff line 1.
        var y0 = y0 || 0;

        // staff line 1 + staff height.
        var y1 = y1 ||
            (y0 + (this.extend_height !== undefined ?
                   this.extend_height : this.getBarlineHeight()));

        context.beginPath();

        // context.setSourceRgb('#209424');
        context.setLineWidth(line_width);

        context.moveTo(x, y0);
        context.lineTo(x, y1);

        context.stroke();
    };

ScoreLibrary.Renderer.Barline.prototype.drawDot =
    function(context, x, y, radius) {

        var paint_helper = ScoreLibrary.Renderer.PAINT_HELPER;

        context.beginPath();

        paint_helper.drawCircle(context, x, y, radius);

        context.closePath();

        context.fill();
    };

ScoreLibrary.Renderer.Barline.prototype.drawRepeatDots = function(context) {

    var x = this.getSpaceWeight() * 2;

    var radius = this.getSpaceWeight();

    var staff = this.getStaff();

    var y = (staff.getYOfLineInStaffCoord(staff.getCenterLineNumber()) -
             staff.getYOfLineInStaffCoord(1));

    y -= 2 * radius;

    this.drawDot(context, x, y, radius);

    y += 4 * radius;

    this.drawDot(context, x, y, radius);
};

ScoreLibrary.Renderer.Barline.prototype.draw = function(context) {

    var supperclass = ScoreLibrary.Renderer.Barline.supperclass;

    supperclass.draw.call(this, context);

    if (this.not_show) {

        return;
    }

    context.save();

    var barline = this.getModel();

    if (barline.repeat &&
        barline.repeat.direction === 'backward') {

        this.drawRepeatDots(context);

        context.translate(this.getSpaceWeight() * 4, 0);
    }

    var x = 0;

    var line_width = undefined;

    switch (barline.bar_style) {

    case 'light-light': {

        line_width = this.getLightWeight();

        x += line_width * 0.5; // light-left

        this.drawLine(context, x, line_width);

        x += line_width * 0.5;      // light-right
        x += this.getSpaceWeight(); // space
        x += line_width * 0.5;      // light-left

        this.drawLine(context, x, line_width);

    } break;

    case 'light-heavy': {

        line_width = this.getLightWeight();

        x += line_width * 0.5; // light-left

        this.drawLine(context, x, line_width);

        x += line_width * 0.5; // light-right

        x += this.getSpaceWeight();  // space

        line_width = this.getHeavyWeight(); // heavy

        x += line_width * 0.5; // heavy-left

        this.drawLine(context, x, line_width);

    } break;

    case 'heavy-light': {

        line_width = this.getHeavyWeight();

        x += line_width * 0.5; // heavy-left

        this.drawLine(context, x, line_width);

        x += line_width * 0.5; // heavy-right

        x += this.getSpaceWeight();

        line_width = this.getLightWeight();

        x += line_width * 0.5; // light-left

        this.drawLine(context, x, line_width);

    } break;

    case 'heavy-heavy': {

        line_width = this.getHeavyWeight();

        x += line_width * 0.5; // heavy-left

        this.drawLine(context, x, line_width);

        x += line_width * 0.5; // heavy-right

        x += this.getSpaceWeight();    // space

        x += line_width * 0.5; // heavy-left

        this.drawLine(context, x, line_width);

    } break;

    case 'heavy': {

        line_width = this.getHeavyWeight();

        x += line_width * 0.5;

        this.drawLine(context, x, line_width);

    } break;

    case 'dotted': {
        this.drawDottedLine(context, x);
    } break;

    case 'dashed': {
        this.drawDashedLine(context, x);
    } break;

    case 'tick': {

        line_width = this.getLightWeight();

        x += line_width * 0.5;

        this.drawLine(context, x, line_width, 35, 45);
    } break;

    case 'short': {

        line_width = this.getLightWeight();

        x += line_width * 0.5;

        this.drawLine(context, x, line_width, 10, 30);
    } break;

    case 'regular': {

        line_width = this.getLightWeight();

        x += line_width * 0.5;

        this.drawLine(context, x, line_width);
    } break;

    case 'none':
    default: {
    } break;

    }

    if (barline.repeat &&
        barline.repeat.direction === 'forward') {

        context.translate(x + line_width, 0);

        this.drawRepeatDots(context);
    }

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
