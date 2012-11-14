goog.provide('ScoreLibrary.Renderer.Glyph');
goog.require('ScoreLibrary.Renderer.Paintable');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Renderer.Paintable}
 */
ScoreLibrary.Renderer.Glyph = function(glyph) {

    var supperclass = ScoreLibrary.Renderer.Glyph.supperclass;

    supperclass.constructor.call(this);

    this.glyph = glyph;
    this.glyph_name = glyph.name;
};

ScoreLibrary.inherited(
    ScoreLibrary.Renderer.Glyph,
    ScoreLibrary.Renderer.Paintable);

ScoreLibrary.Renderer.Glyph.prototype.toString = function() {

    return 'Renderer.Glyph';
};

ScoreLibrary.Renderer.Glyph.prototype.clone = function(clone) {

    clone = clone || new ScoreLibrary.Renderer.Glyph(this.glyph);

    var supperclass = ScoreLibrary.Renderer.Glyph.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Renderer.Glyph.prototype.getChar = function() {

    return this.glyph.character;
};

ScoreLibrary.Renderer.Glyph.prototype.getName = function() {

    return this.glyph.name;
};

ScoreLibrary.Renderer.Glyph.prototype.getHorizontalAdvance = function() {

    return this.glyph.ha;
};

ScoreLibrary.Renderer.Glyph.prototype.getHeightWidthRatio = function() {

    return this.glyph.width > 0 ?
        (this.glyph.height / this.glyph.width) : 1;
};

ScoreLibrary.Renderer.Glyph.prototype.getWidthHeightRatio = function() {

    return this.glyph.height > 0 ?
        (this.glyph.width / this.glyph.height) : 1;
};

ScoreLibrary.Renderer.Glyph.prototype.setOutlineBoundbox =
    function(outline_bbox) {

        this.obox_setted = true;

        this.obox_x_min = outline_bbox.x_min;
        this.obox_y_min = outline_bbox.y_min;
        this.obox_x_max = outline_bbox.x_max;
        this.obox_y_max = outline_bbox.y_max;
    };

ScoreLibrary.Renderer.Glyph.prototype.getOutlineBoundbox =
    function() {

        var obox = undefined;

        if (this.obox_setted) {

            obox = {

                x_min: this.obox_x_min,
                y_min: this.obox_y_min,
                x_max: this.obox_x_max,
                y_max: this.obox_y_max
            };
        }
        else {

            obox = {

                x_min: this.glyph.x_min,
                y_min: this.glyph.y_min,
                x_max: this.glyph.x_max,
                y_max: this.glyph.y_max
            };
        }

        return obox;
    };

ScoreLibrary.Renderer.Glyph.prototype.getOutline = function() {

    if (this.glyph.outline === undefined &&
        this.glyph.o !== undefined) {

        this.glyph.outline = this.glyph.o.split(' ');
    }

    return this.glyph.outline;
};

ScoreLibrary.Renderer.Glyph.prototype.drawOutline = function(context) {

    if (this.glyph.width <= 0) {

        return;
    }

    var outline = this.getOutline();

    if (outline === undefined) {

        return;
    }

    var length = outline.length;

    for (var i = 0; i < length; ) {

        var action = outline[i++];

        switch (action) {

        case 'm': {

            context.moveTo(outline[i++], outline[i++]);
        } break;

        case 'l': {

            context.lineTo(outline[i++], outline[i++]);
        } break;

        case 'q': {

            var cpx = outline[i++];
            var cpy = outline[i++];

            context.quadraticCurveTo(
                outline[i++], outline[i++],
                cpx, cpy);
        } break;

        case 'b': {

            var x = outline[i++];
            var y = outline[i++];

            context.bezierCurveTo(
                outline[i++], outline[i++],
                outline[i++], outline[i++],
                x, y);
        } break;

        }
    }
};

ScoreLibrary.Renderer.Glyph.prototype.draw = function(context) {

    var supperclass = ScoreLibrary.Renderer.Glyph.supperclass;

    supperclass.draw.call(this, context);

    context.save();

    this.transform(context);

    context.setLineWidth(1);

    context.setSourceRgb('#000000');

    context.beginPath();

    this.drawOutline(context);

    context.closePath();

    context.fill();

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
