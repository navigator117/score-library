goog.provide('ScoreLibrary.Renderer.PaintContext.Canvas');
goog.require('ScoreLibrary.Logger');
goog.require('ScoreLibrary.Renderer.PaintContext');
goog.require('goog.asserts');

/**
 * @constructor
 */
ScoreLibrary.Renderer.PaintContext.Canvas = function(canvas_node) {

    var supperclass =
        ScoreLibrary.Renderer.PaintContext.Canvas.supperclass;

    supperclass.constructor.call(this, canvas_node);

    this.context = this.canvas_node[0].getContext('2d');
};

ScoreLibrary.inherited(
    ScoreLibrary.Renderer.PaintContext.Canvas,
    ScoreLibrary.Renderer.PaintContext);

ScoreLibrary.Renderer.PaintContext.Canvas.prototype.save = function() {

    try {

        this.context.save();
    }
    catch (e) {

        ScoreLibrary.Logger.shout(
            'ERROR: caught exception ' +
                ScoreLibrary.Logger.deepExpose(e) +
                'in ScoreLibrary.Renderer.PaintContext.Canvas.save()!'
        );
    }
};

ScoreLibrary.Renderer.PaintContext.Canvas.prototype.restore = function() {

    try {

        this.context.restore();
    }
    catch (e) {

        ScoreLibrary.Logger.shout(
            'ERROR: caught exception ' +
                ScoreLibrary.Logger.deepExpose(e) +
                'in ScoreLibrary.Renderer.PaintContext.Canvas.restore()!'
        );
    }
};

ScoreLibrary.Renderer.PaintContext.Canvas.prototype.clear = function() {

    try {

        this.context.clearRect(
            0, 0, this.getWidth(), this.getHeight());

        this.context.beginPath();
    }
    catch (e) {

        ScoreLibrary.Logger.shout(
            'ERROR: caught exception ' +
                ScoreLibrary.Logger.deepExpose(e) +
                'in ScoreLibrary.Renderer.PaintContext.Canvas.clear()!'
        );
    }
};

ScoreLibrary.Renderer.PaintContext.Canvas.prototype.transform =
    function(a, b, c, d, e, f) {

        try {

            this.context.transform(a, b, c, d, e, f);
        }
        catch (e) {

            ScoreLibrary.Logger.shout(
                'ERROR: caught exception ' +
                    ScoreLibrary.Logger.deepExpose(e) +
                    'in ScoreLibrary.Renderer.PaintContext.Canvas.transform()!'
            );
        }
    };

ScoreLibrary.Renderer.PaintContext.Canvas.prototype.scale = function(x, y) {

    try {

        this.context.scale(x, y);
    }
    catch (e) {

        ScoreLibrary.Logger.shout(
            'ERROR: caught exception ' +
                ScoreLibrary.Logger.deepExpose(e) +
                'in ScoreLibrary.Renderer.PaintContext.Canvas.scale()!'
        );
    }
};

ScoreLibrary.Renderer.PaintContext.Canvas.prototype.translate = function(x, y) {

    try {

        this.context.translate(x, y);
    }
    catch (e) {

        ScoreLibrary.Logger.shout(
            'ERROR: caught exception ' +
                ScoreLibrary.Logger.deepExpose(e) +
                'in ScoreLibrary.Renderer.PaintContext.Canvas.translate()!'
        );
    }
};

ScoreLibrary.Renderer.PaintContext.Canvas.prototype.setLineWidth =
    function(line_width) {

    try {

        this.context.lineWidth = line_width;
    }
    catch (e) {

        ScoreLibrary.Logger.shout(
            'ERROR: caught exception ' +
                ScoreLibrary.Logger.deepExpose(e) +
                'in ScoreLibrary.Renderer.PaintContext.Canvas.setLineWidth()!'
        );
    }
};

ScoreLibrary.Renderer.PaintContext.Canvas.prototype.getLineWidth = function() {

    var line_width = undefined;

    try {

        line_width = this.context.lineWidth;
    }
    catch (e) {

        ScoreLibrary.Logger.shout(
            'ERROR: caught exception ' +
                ScoreLibrary.Logger.deepExpose(e) +
                'in ScoreLibrary.Renderer.PaintContext.Canvas.getLineWidth()!'
        );
    }

    return line_width;
};

ScoreLibrary.Renderer.PaintContext.Canvas.prototype.beginPath = function() {

    try {

        this.context.beginPath();
    }
    catch (e) {

        ScoreLibrary.Logger.shout(
            'ERROR: caught exception ' +
                ScoreLibrary.Logger.deepExpose(e) +
                'in ScoreLibrary.Renderer.PaintContext.Canvas.beginPath()!'
        );
    }
};

ScoreLibrary.Renderer.PaintContext.Canvas.prototype.closePath = function() {

    try {

        this.context.closePath();
    }
    catch (e) {

        ScoreLibrary.Logger.shout(
            'ERROR: caught exception ' +
                ScoreLibrary.Logger.deepExpose(e) +
                'in ScoreLibrary.Renderer.PaintContext.Canvas.closePath()!'
        );
    }
};

ScoreLibrary.Renderer.PaintContext.Canvas.prototype.moveTo = function(x, y) {

    try {

        this.context.moveTo(x, y);
    }
    catch (e) {

        ScoreLibrary.Logger.shout(
            'ERROR: caught exception ' +
                ScoreLibrary.Logger.deepExpose(e) +
                'in ScoreLibrary.Renderer.PaintContext.Canvas.moveTo()!'
        );
    }
};

ScoreLibrary.Renderer.PaintContext.Canvas.prototype.lineTo = function(x, y) {

    try {

        this.context.lineTo(x, y);
    }
    catch (e) {

        ScoreLibrary.Logger.shout(
            'ERROR: caught exception ' +
                ScoreLibrary.Logger.deepExpose(e) +
                'in ScoreLibrary.Renderer.PaintContext.Canvas.lineTo()!'
        );
    }
};

ScoreLibrary.Renderer.PaintContext.prototype.clearRect =
    function(x, y, width, height) {

    try {

        this.context.clearRect(x, y, width, height);
    }
    catch (e) {

        ScoreLibrary.Logger.shout(
            'ERROR: caught exception ' +
                ScoreLibrary.Logger.deepExpose(e) +
                'in ScoreLibrary.Renderer.PaintContext.Canvas.clearRect()!'
        );
    }
};

ScoreLibrary.Renderer.PaintContext.Canvas.prototype.rect =
    function(x, y, width, height) {

    try {

        this.context.rect(x, y, width, height);
    }
    catch (e) {

        ScoreLibrary.Logger.shout(
            'ERROR: caught exception ' +
                ScoreLibrary.Logger.deepExpose(e) +
                'in ScoreLibrary.Renderer.PaintContext.Canvas.rect()!'
        );
    }
};

ScoreLibrary.Renderer.PaintContext.Canvas.prototype.setSourceRgb =
    function(color) {

    try {

        this.context.strokeStyle = color;
        this.context.fillStyle = color;
    }
    catch (e) {

        ScoreLibrary.Logger.shout(
            'ERROR: caught exception ' +
                ScoreLibrary.Logger.deepExpose(e) +
                'in ScoreLibrary.Renderer.PaintContext.Canvas.setSourceRgb()!'
        );
    }
};

ScoreLibrary.Renderer.PaintContext.Canvas.prototype.stroke = function() {


    try {

        var debugPainting = ScoreLibrary.Renderer.PaintContext.debugPainting;
        if (debugPainting) {

            var answer = confirm('Click OK to step on, Cancel to run!');
            if (!answer) {

                ScoreLibrary.Renderer.PaintContext.debugPainting = false;
            }
        }

        this.context.stroke();
    }
    catch (e) {

        ScoreLibrary.Logger.shout(
            'ERROR: caught exception ' +
                ScoreLibrary.Logger.deepExpose(e) +
                'in ScoreLibrary.Renderer.PaintContext.Canvas.stroke()!'
        );
    }
};

ScoreLibrary.Renderer.PaintContext.Canvas.prototype.fill = function() {

    try {

        var debugPainting = ScoreLibrary.Renderer.PaintContext.debugPainting;
        if (debugPainting) {

            var answer = confirm('Click OK to step on, Cancel to run!');
            if (!answer) {

                ScoreLibrary.Renderer.PaintContext.debugPainting = false;
            }
        }

        this.context.fill();
    }
    catch (e) {

        ScoreLibrary.Logger.shout(
            'ERROR: caught exception ' +
                ScoreLibrary.Logger.deepExpose(e) +
                'in ScoreLibrary.Renderer.PaintContext.Canvas.fill()!'
        );
    }
};

ScoreLibrary.Renderer.PaintContext.Canvas.prototype.setFont = function(font) {

    try {

        this.context.font = font;
    }
    catch (e) {

        ScoreLibrary.Logger.shout(
            'ERROR: caught exception ' +
                ScoreLibrary.Logger.deepExpose(e) +
                'in ScoreLibrary.Renderer.PaintContext.Canvas.setFont()!'
        );
    }
};

ScoreLibrary.Renderer.PaintContext.Canvas.prototype.setStrokeStyle =
    function(style) {

    try {

        this.context.strokeStyle = style;
    }
    catch (e) {

        ScoreLibrary.Logger.shout(
            'ERROR: caught exception ' +
                ScoreLibrary.Logger.deepExpose(e) +
                'in ScoreLibrary.Renderer.PaintContext.Canvas.setStrokeStyle()!'
        );
    }
};

ScoreLibrary.Renderer.PaintContext.Canvas.prototype.setFillStyle =
    function(style) {

    try {

        this.context.fillStyle = style;
    }
    catch (e) {

        ScoreLibrary.Logger.shout(
            'ERROR: caught exception ' +
                ScoreLibrary.Logger.deepExpose(e) +
                'in ScoreLibrary.Renderer.PaintContext.Canvas.setFillStyle()!'
        );
    }
};

ScoreLibrary.Renderer.PaintContext.Canvas.prototype.measureText =
    function(text, escapes) {

    var text_width = undefined;

    try {

        var supperclass =
            ScoreLibrary.Renderer.PaintContext.Canvas.supperclass;

        text_width =
            supperclass.measureText.call(this, text, escapes);

        if (text_width === undefined) {

            var metrics = this.context.measureText(text);

            text_width = metrics.width;
        }
    }
    catch (e) {

        ScoreLibrary.Logger.shout(
            'ERROR: caught exception ' +
                ScoreLibrary.Logger.deepExpose(e) +
                'in ScoreLibrary.Renderer.PaintContext.Canvas.measureText()!'
        );
    }

    return text_width;
};

ScoreLibrary.Renderer.PaintContext.Canvas.prototype.strokeText =
    function(text, x, y, max_width, escapes) {

    try {

        var supperclass =
            ScoreLibrary.Renderer.PaintContext.Canvas.supperclass;

        if (!supperclass.strokeText.call(
            this, text, x, y, max_width, escapes)) {

            this.context.strokeText(text, x, y);
        }
    }
    catch (e) {

        ScoreLibrary.Logger.shout(
            'ERROR: caught exception ' +
                ScoreLibrary.Logger.deepExpose(e) +
                'in ScoreLibrary.Renderer.PaintContext.Canvas.strokeText()!'
        );
    }
};

ScoreLibrary.Renderer.PaintContext.Canvas.prototype.fillText =
    function(text, x, y, max_width, escapes) {

    try {

        var supperclass =
            ScoreLibrary.Renderer.PaintContext.Canvas.supperclass;

        if (!supperclass.fillText.call(
            this, text, x, y, max_width, escapes)) {

            this.context.fillText(text, x, y);
        }
    }
    catch (e) {

        ScoreLibrary.Logger.shout(
            'ERROR: caught exception ' +
                ScoreLibrary.Logger.deepExpose(e) +
                'in ScoreLibrary.Renderer.PaintContext.Canvas.fillText()!'
        );
    }
};

ScoreLibrary.Renderer.PaintContext.Canvas.prototype.getTextBaseline =
    function() {

    return this.context.textBaseline;
};

ScoreLibrary.Renderer.PaintContext.Canvas.prototype.setTextBaseline =
    function(style) {

    try {

        this.context.textBaseline = style;
    }
    catch (e) {

        ScoreLibrary.Logger.shout(
            'ERROR: caught exception ' +
                ScoreLibrary.Logger.deepExpose(e) +
                'in Renderer.PaintContext.Canvas.setTextBaseline()!'
        );
    }
};

ScoreLibrary.Renderer.PaintContext.Canvas.prototype.quadraticCurveTo =
    function(cpx, cpy, x, y) {

    try {

        this.context.quadraticCurveTo(cpx, cpy, x, y);
    }
    catch (e) {

        ScoreLibrary.Logger.shout(
            'ERROR: caught exception ' +
                ScoreLibrary.Logger.deepExpose(e) +
                'in Renderer.PaintContext.Canvas.quadraticCurveTo()!'
        );
    }
};

ScoreLibrary.Renderer.PaintContext.Canvas.prototype.bezierCurveTo =
    function(cp1x, cp1y, cp2x, cp2y, x, y) {

        try {

            this.context.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
        }
        catch (e) {

            ScoreLibrary.Logger.shout(
                'ERROR: caught exception ' +
                    ScoreLibrary.Logger.deepExpose(e) +
                    'in Renderer.PaintContext.Canvas.bezierCurveTo()!'
            );
        }
    };

ScoreLibrary.Renderer.PaintContext.Canvas.prototype.arc =
    function(x, y, radius, angle1, angle2, anticlockwise) {

    try {

        this.context.arc(x, y, radius, angle1, angle2, anticlockwise);
    }
    catch (e) {

        ScoreLibrary.Logger.shout(
            'ERROR: caught exception ' +
                ScoreLibrary.Logger.deepExpose(e) +
                'in ScoreLibrary.Renderer.PaintContext.Canvas.arc()!'
        );
    }
};

ScoreLibrary.Renderer.PaintContext.Canvas.prototype.drawImage =
    function(image, var_args) {

        if (ScoreLibrary.Renderer.PaintContext.prototype.isPrototypeOf(image)) {

            image = image.getCanvas();
        }

        try {

            this.context.drawImage.apply(this.context, arguments);
        }
        catch (e) {

            ScoreLibrary.Logger.shout(
                'ERROR: caught exception ' +
                    ScoreLibrary.Logger.deepExpose(e) +
                    'in ScoreLibrary.Renderer.PaintContext.Canvas.drawImage()!'
            );
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
