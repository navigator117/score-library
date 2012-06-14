goog.provide('ScoreLibrary.Renderer.PaintContext');
goog.require('ScoreLibrary.Renderer');
goog.require('ScoreLibrary.Renderer.CustomTextRenderer');
goog.require('goog.asserts');

/**
 * @constructor
 */
ScoreLibrary.Renderer.PaintContext = function(canvas_node) {

    this.canvas_node = canvas_node;
};

ScoreLibrary.Renderer.PaintContext.prototype.getCanvas = function() {

    return this.canvas_node[0];
};

ScoreLibrary.Renderer.PaintContext.prototype.getWidth = function() {

    return this.canvas_node.prop('width');
};

ScoreLibrary.Renderer.PaintContext.prototype.getHeight = function() {

    return this.canvas_node.prop('height');
};

ScoreLibrary.Renderer.PaintContext.prototype.resize = function(width, height) {

    this.canvas_node.prop({

        'width': width,
        'height': height
    });
};

ScoreLibrary.Renderer.PaintContext.prototype.save = function() {

    goog.asserts.assert(
        false,
        'ScoreLibrary.Renderer.PaintContext.save(): Unimplemented!');
};

ScoreLibrary.Renderer.PaintContext.prototype.restore = function() {

    goog.asserts.assert(
        false,
        'ScoreLibrary.Renderer.PaintContext.restore(): Unimplemented!');
};

ScoreLibrary.Renderer.PaintContext.prototype.transform =
    function(a, b, c, d, e, f) {

        goog.asserts.assert(
            false,
            'ScoreLibrary.Renderer.PaintContext.restore(): Unimplemented!');
    };

ScoreLibrary.Renderer.PaintContext.prototype.beginPath = function() {

    goog.asserts.assert(
        false,
        'ScoreLibrary.Renderer.PaintContext.beginPath(): Unimplemented!');
};

ScoreLibrary.Renderer.PaintContext.prototype.closePath = function() {

    goog.asserts.assert(
        false,
        'ScoreLibrary.Renderer.PaintContext.closePath(): Unimplemented!');
};

ScoreLibrary.Renderer.PaintContext.prototype.moveTo = function(x, y) {

    goog.asserts.assert(
        false,
        'ScoreLibrary.Renderer.PaintContext.moveTo(): Unimplemented!');
};

ScoreLibrary.Renderer.PaintContext.prototype.lineTo = function(x, y) {

    goog.asserts.assert(
        false,
        'ScoreLibrary.Renderer.PaintContext.lineTo(): Unimplemented!');
};

ScoreLibrary.Renderer.PaintContext.prototype.clearRect =
    function(x, y, width, height) {

        goog.asserts.assert(
            false,
            'ScoreLibrary.Renderer.PaintContext.clearRect(): Unimplemented!');
    };

ScoreLibrary.Renderer.PaintContext.prototype.rect =
    function(x, y, width, height) {

        goog.asserts.assert(
            false,
            'ScoreLibrary.Renderer.PaintContext.rect(): Unimplemented!');
    };

ScoreLibrary.Renderer.PaintContext.prototype.setLineWidth =
    function(line_width) {

        goog.asserts.assert(
            false,
            'Renderer.PaintContext.setLineWidth(): Unimplemented!');
    };

ScoreLibrary.Renderer.PaintContext.prototype.getLineWidth =
    function() {

        goog.asserts.assert(
            false,
            'Renderer.PaintContext.getLineWidth(): Unimplemented!');
    };

ScoreLibrary.Renderer.PaintContext.prototype.setSourceRgb = function(color) {

    goog.asserts.assert(
        false,
        'ScoreLibrary.Renderer.PaintContext.setSourceRgb(): Unimplemented!');
};

ScoreLibrary.Renderer.PaintContext.debugPainting = false;

ScoreLibrary.Renderer.PaintContext.prototype.stroke = function() {

    goog.asserts.assert(
        false,
        'ScoreLibrary.Renderer.PaintContext.stroke(): Unimplemented!');
};

ScoreLibrary.Renderer.PaintContext.prototype.fill = function() {

    goog.asserts.assert(
        false,
        'ScoreLibrary.Renderer.PaintContext.fill(): Unimplemented!');
};

ScoreLibrary.Renderer.PaintContext.prototype.setFont = function(font) {

    goog.asserts.assert(
        false,
        'ScoreLibrary.Renderer.PaintContext.setFont(): Unimplemented!');
};

ScoreLibrary.Renderer.PaintContext.prototype.getCustomTextRenderer =
    function() {

        if (this.custom_text_renderer === undefined) {

            this.custom_text_renderer =
                new ScoreLibrary.Renderer.CustomTextRenderer(this);
        }

        return this.custom_text_renderer;
    };

ScoreLibrary.Renderer.PaintContext.prototype.setStrokeStyle = function(style) {

    goog.asserts.assert(
        false,
        'ScoreLibrary.Renderer.PaintContext.setStrokeStyle(): Unimplemented!');
};

ScoreLibrary.Renderer.PaintContext.prototype.setFillStyle = function(style) {

    goog.asserts.assert(
        false,
        'ScoreLibrary.Renderer.PaintContext.setFillStyle(): Unimplemented!');
};

ScoreLibrary.Renderer.PaintContext.prototype.measureText =
    function(text, escapes) {

        var width = undefined;

        try {

            width =
                this.getCustomTextRenderer().measureText(text, escapes);
        }
        catch (e) {

            ScoreLibrary.Logger.shout(
                'ERROR: caught exception ' +
                    ScoreLibrary.Logger.deepExpose(e) +
                    'in ScoreLibrary.Renderer.PaintContext.measureText()!'
            );
        }

        return width;
    };

ScoreLibrary.Renderer.PaintContext.prototype.strokeText =
    function(text, x, y, max_width, escapes) {

    var customed = false;

    try {

        customed =
            this.getCustomTextRenderer().strokeText(
                text, x, y, max_width, escapes);
    }
    catch (e) {

        ScoreLibrary.Logger.shout(
            'ERROR: caught exception ' +
                ScoreLibrary.Logger.deepExpose(e) +
                'in ScoreLibrary.Renderer.PaintContext.strokeText()!'
        );
    }

    return customed;
};

ScoreLibrary.Renderer.PaintContext.prototype.fillText =
    function(text, x, y, max_width, escapes) {

    var customed = false;

    try {

        customed =
            this.getCustomTextRenderer().fillText(
                text, x, y, max_width, escapes);
    }
    catch (e) {

        ScoreLibrary.Logger.shout(
            'ERROR: caught exception ' +
                ScoreLibrary.Logger.deepExpose(e) +
                'in ScoreLibrary.Renderer.PaintContext.fillText()!'
        );
    }

    return customed;
};

ScoreLibrary.Renderer.PaintContext.prototype.setTextBaseline = function(style) {

    goog.asserts.assert(
        false,
        'ScoreLibrary.Renderer.PaintContext.setTextBaseline(): Unimplemented!');
};

ScoreLibrary.Renderer.PaintContext.prototype.getTextBaseline = function() {

    goog.asserts.assert(
        false,
        'ScoreLibrary.Renderer.PaintContext.getTextBaseline(): Unimplemented!');
};

ScoreLibrary.Renderer.PaintContext.prototype.quadraticCurveTo =
    function(cpx, cpy, x, y) {

    goog.asserts.assert(
        false,
        'Renderer.PaintContext.quadraticCurveTo(): Unimplemented!');
};

ScoreLibrary.Renderer.PaintContext.prototype.bezierCurveTo =
    function(cp1x, cp1y, cp2x, cp2y, x, y) {

    goog.asserts.assert(
        false,
        'ScoreLibrary.Renderer.PaintContext.bezierCurveTo(): Unimplemented!');
};

ScoreLibrary.Renderer.PaintContext.prototype.arc =
    function(x, y, radius, angle1, angle2, anticlockwise) {

    goog.asserts.assert(
        false,
        'ScoreLibrary.Renderer.PaintContext.arc(): Unimplemented!');
};

ScoreLibrary.Renderer.PaintContext.prototype.drawImage =
    function(image, var_args) {

        goog.asserts.assert(
            false,
            'ScoreLibrary.Renderer.PaintContext.drawImage(): Unimplemented!');
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
