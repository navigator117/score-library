goog.provide('ScoreLibrary.Renderer.TextBox');
goog.require('ScoreLibrary.Renderer');
goog.require('ScoreLibrary.Renderer.CustomGlyph');
goog.require('ScoreLibrary.Renderer.PaintContext');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Renderer.CustomGlyph}
 */
ScoreLibrary.Renderer.TextBox = function(h_align, v_align, border) {

    var supperclass = ScoreLibrary.Renderer.TextBox.supperclass;

    supperclass.constructor.call(this, 'TextBox');

    this.h_align = h_align || 'left';
    this.v_align = v_align || 'middle';


    this.border = border || 0;

    goog.asserts.assert(
        this.isValidHAlign(this.h_align) &&
            this.isValidVAlign(this.v_align) &&
            this.border >= 0,
        'ScoreLibrary.Renderer.TextBox(): invalid arguments!');
};

ScoreLibrary.inherited(ScoreLibrary.Renderer.TextBox,
                       ScoreLibrary.Renderer.CustomGlyph);

ScoreLibrary.Renderer.TextBox.prototype.isValidHAlign = function(h_align) {

    return (/left|center|right/).test(h_align);
};

ScoreLibrary.Renderer.TextBox.prototype.isValidVAlign = function(v_align) {

    return (/top|middle|bottom|baseline/).test(v_align);
};

ScoreLibrary.Renderer.TextBox.prototype.draw = function(context) {

    var supperclass = ScoreLibrary.Renderer.TextBox.supperclass;

    supperclass.draw.call(this, context);

    context.save();

    this.fromStreamCoordToWindowCoord(context);

    context.setTextBaseline(this.getTextBaseLine());

    context.setFont(this.font);

    context.fillText(
        this.text, this.getTextX(), this.getTextY(), undefined, this.escapes);

    context.restore();
};

ScoreLibrary.Renderer.TextBox.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Renderer.TextBox(
            this.h_align, this.v_align, this.border);

    var supperclass = ScoreLibrary.Renderer.TextBox.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Renderer.TextBox.prototype.getImplicit = function(dimension) {

    var metric_dimension = 'metric_' + dimension;

    if (!this[metric_dimension]) {

        var supperclass = ScoreLibrary.Renderer.TextBox.supperclass;

        return supperclass.getImplicit.call(this, dimension);
    }

    return this[metric_dimension] + this.border * 2;
};

ScoreLibrary.Renderer.TextBox.prototype.fromStreamCoordToWindowCoord =
    function(context) {

        var height = this.getAllocate('height');

        context.transform(1, 0, 0, -1, 0, 0 + height);
    };

ScoreLibrary.Renderer.TextBox.prototype.getOutlineBoundbox = function() {

    if (this.outline_bbox) {

        return this.outline_bbox;
    }
    else {

        var requisite_width = this.getRequisite('width');
        var requisite_height = this.getRequisite('height');

        var outline_bbox = {

            x_min: 0,
            y_min: -requisite_height * 0.5,
            x_max: requisite_width,
            y_max: requisite_height * 0.5
        };

        return outline_bbox;
    }
};

ScoreLibrary.Renderer.TextBox.prototype.setText =
    function(text, font, context, escapes) {

        this.text = text;
        this.font = font || 'normal 16px sans-serif';

        if (escapes !== undefined) {

            this.escapes = escapes;
        }

        goog.asserts.assert(
            this.text !== undefined &&
                this.text !== null &&
                this.font !== undefined &&
                this.font !== null,
            ScoreLibrary.Renderer.PaintContext.prototype.isPrototypeOf(context),
            'ScoreLibrary.Renderer.TextBox.setText(): invalid arguments!');

        context.save();

        context.setFont(this.font);

        this['metric_width'] =
            context.measureText(this.text, this.escapes);

        this['metric_height'] =
            context.measureText('W');

        context.restore();
    };

ScoreLibrary.Renderer.TextBox.prototype.getTextBaseLine = function() {

    return this.v_align;
};

ScoreLibrary.Renderer.TextBox.prototype.getTextX = function() {

    var x = undefined;

    if (this.h_align === 'right') {

        var allocate_width = this.getAllocate('width');

        x = allocate_width - this['metric_width'] - this.border;
    }
    else if (this.h_align === 'center') {

        var allocate_width = this.getAllocate('width');

        x = (allocate_width - this['metric_width']) * 0.5;
    }
    else {

        x = this.border;
    }

    return x;
};

ScoreLibrary.Renderer.TextBox.prototype.getTextY = function() {

    var y = undefined;

    if (this.v_align === 'top') {

        y = this.border;
    }
    else if (this.v_align === 'middle' || this.v_align === 'baseline') {
        // !TODO: fix baseline text y.

        var allocate_height = this.getAllocate('height');

        y = allocate_height * 0.5;
    }
    else {

        var allocate_height = this.getAllocate('height');

        y = allocate_height - this.border;
    }

    return y;
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
