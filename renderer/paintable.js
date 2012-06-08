goog.provide('ScoreLibrary.Renderer.Coordinate');
goog.provide('ScoreLibrary.Renderer.Paintable');
goog.provide('ScoreLibrary.Renderer.Requisition');
goog.require('ScoreLibrary.Renderer');
goog.require('ScoreLibrary.Renderer.PaintHelper');
goog.require('ScoreLibrary.Renderer.PaintableLayouter');
goog.require('goog.asserts');

/**
 * @constructor
 */
ScoreLibrary.Renderer.Requisition = function() {
};

ScoreLibrary.Renderer.Requisition.prototype.validateDim = function(dimension) {

    if (!(/(width|height)/.test(dimension))) {

        goog.asserts.assert(
            false,
            'Renderer.Requisition.validateDim(): invalid argument!');
    }
};

ScoreLibrary.Renderer.Requisition.prototype.validateVal = function(value) {

    if (!(value >= 0)) {

        throw RangeError(
            'Renderer.Requisition.validateVal(): invalid argument!');
    }
};

ScoreLibrary.Renderer.Requisition.prototype.getImplicit = function(dimension) {

    this.validateDim(dimension);

    var key = 'implicit_' + dimension;

    return this[key] || 0;
};

ScoreLibrary.Renderer.Requisition.prototype.setImplicit =
    function(dimension, value) {

        this.validateDim(dimension);
        this.validateVal(value);

        var key = 'implicit_' + dimension;

        this[key] = value;
    };

ScoreLibrary.Renderer.Requisition.prototype.getExplicit = function(dimension) {

    this.validateDim(dimension);

    var key = 'explicit_' + dimension;

    return this[key];
};

ScoreLibrary.Renderer.Requisition.prototype.setExplicit =
    function(dimension, value) {
        this.validateDim(dimension);
        this.validateVal(value);

        var key = 'explicit_' + dimension;

        this[key] = value;
    };

ScoreLibrary.Renderer.Requisition.prototype.getRequisite = function(dimension) {

    this.validateDim(dimension);

    var explicit_value = this.getExplicit(dimension);
    var implicit_value = this.getImplicit(dimension);

    return (explicit_value ?
            Math.max(explicit_value, implicit_value) :
            implicit_value);
};

ScoreLibrary.Renderer.Requisition.prototype.getAllocate = function(dimension) {

    var key = 'allocate_' + dimension;

    var value = this[key];

    this.validateVal(value);

    return value;
};

ScoreLibrary.Renderer.Requisition.prototype.setAllocate =
    function(dimension, value) {

        if (!(value >= this.getRequisite(dimension))) {

            throw RangeError(
                'Renderer.Requisition.setAllocate(): invalid argument!');
        }

        var key = 'allocate_' + dimension;

        this[key] = value;
    };

/**
 * @constructor
 */
ScoreLibrary.Renderer.Coordinate = function() {
};

ScoreLibrary.Renderer.Coordinate.prototype.validateOrg = function(origin) {

    if (!(/(x|y)/.test(origin))) {

        goog.asserts.assert(
            false,
            'Renderer.Requisition.validateOrg(): invalid argument!');
    }
};

ScoreLibrary.Renderer.Coordinate.prototype.getOrg =
    function(coordinate, origin) {

        this.validateOrg(origin);

        var key = coordinate;

        key += '_';
        key += origin;

        return this[key];
    };

ScoreLibrary.Renderer.Coordinate.prototype.setOrg =
    function(coordinate, origin, value) {

        this.validateOrg(origin);

        var key = coordinate;

        key += '_';
        key += origin;

        this[key] = value;
    };

ScoreLibrary.Renderer.Coordinate.prototype.getX = function(coordinate) {

    return this.getOrg(coordinate, 'x');
};

ScoreLibrary.Renderer.Coordinate.prototype.setX = function(coordinate, x) {

    this.setOrg(coordinate, 'x', x);
};

ScoreLibrary.Renderer.Coordinate.prototype.getY = function(coordinate) {

    return this.getOrg(coordinate, 'y');
};

ScoreLibrary.Renderer.Coordinate.prototype.setY = function(coordinate, y) {

    this.setOrg(coordinate, 'y', y);
};

/**
 * @constructor
 */
ScoreLibrary.Renderer.Matrix = function() {
};

ScoreLibrary.Renderer.Matrix.identity = {

    a: 1, b: 0,
    c: 0, d: 1,
    x: 0, y: 0
};

ScoreLibrary.Renderer.Matrix.multiple = function(matrix1, matrix2) {

    var result = { };

    /** Matrix Mul
     *        a c x
     *        b d y
     *        0 0 1
     *
     * a c x  a c x
     * b d y  b d y
     * 0 0 1  0 0 1
     */
    result.a = matrix1.a * matrix2.a + matrix1.c * matrix2.b;
    result.b = matrix1.b * matrix2.a + matrix1.d * matrix2.b;
    result.c = matrix1.a * matrix2.c + matrix1.c * matrix2.d;
    result.d = matrix1.b * matrix2.c + matrix1.d * matrix2.d;
    result.x = matrix1.a * matrix2.x + matrix1.c * matrix2.y + 1 * matrix1.x;
    result.y = matrix1.b * matrix2.x + matrix1.d * matrix2.y + 1 * matrix1.y;

    return result;
};

ScoreLibrary.Renderer.Matrix.prototype.mulMatrix = function(matrix) {

    if (this.matrixed) {

        var multiple =
            ScoreLibrary.Renderer.Matrix.multiple;

        matrix = multiple(this.getMatrix(), matrix);
    }

    this.setMatrix(matrix);
};

ScoreLibrary.Renderer.Matrix.prototype.setMatrix = function(matrix) {

    this.matrixed = true;

    this.matrix_a = matrix.a;
    this.matrix_b = matrix.b;
    this.matrix_c = matrix.c;
    this.matrix_d = matrix.d;
    this.matrix_x = matrix.x;
    this.matrix_y = matrix.y;
};

ScoreLibrary.Renderer.Matrix.prototype.getMatrix = function() {

    return (this.matrixed ? {

        a: this.matrix_a,
        b: this.matrix_b,
        c: this.matrix_c,
        d: this.matrix_d,
        x: this.matrix_x,
        y: this.matrix_y
    } : undefined);
};

ScoreLibrary.Renderer.Matrix.prototype.transform = function(context)  {

    context.transform(
        this.matrix_a,
        this.matrix_b,
        this.matrix_c,
        this.matrix_d,
        this.matrix_x,
        this.matrix_y);
};

/**
 * @constructor
 * @extends {ScoreLibrary.Renderer.Requisition}
 * @extends {ScoreLibrary.Renderer.Coordinate}
 * @extends {ScoreLibrary.Renderer.Matrix}
 * @extends {ScoreLibrary.Renderer.PaintableLayouter}
 */
ScoreLibrary.Renderer.Paintable = function() {

    this.id = ++ScoreLibrary.Renderer.Paintable.UniqueIdentity;

    this.debug = false;
};

ScoreLibrary.aggregate(ScoreLibrary.Renderer.Paintable,
                       ScoreLibrary.Renderer.Requisition);

ScoreLibrary.aggregate(ScoreLibrary.Renderer.Paintable,
                       ScoreLibrary.Renderer.Coordinate);

ScoreLibrary.aggregate(ScoreLibrary.Renderer.Paintable,
                       ScoreLibrary.Renderer.Matrix);

ScoreLibrary.aggregate(ScoreLibrary.Renderer.Paintable,
                       ScoreLibrary.Renderer.PaintableLayouter);

ScoreLibrary.Renderer.Paintable.UniqueIdentity =
    ScoreLibrary.Renderer.Paintable.UniqueIdentity || 0;

ScoreLibrary.Renderer.Paintable.prototype.toString = function() {

    return 'Renderer.Paintable';
};

ScoreLibrary.Renderer.Paintable.prototype.clone = function(clone) {

    clone = clone || new ScoreLibrary.Renderer.Paintable();

    ScoreLibrary.copyAttributes(clone, this);

    return clone;
};

ScoreLibrary.Renderer.Paintable.debugId =
    ScoreLibrary.Renderer.Paintable.debugId || undefined;

ScoreLibrary.Renderer.Paintable.prototype.isDebugMyself = function() {

    var debugId = ScoreLibrary.Renderer.Paintable.debugId;

    return (debugId === undefined ||
            debugId === this.id ||
            this.debug);
};

ScoreLibrary.Renderer.Paintable.debugDraw =
    ScoreLibrary.Renderer.Paintable.debugDraw || false;

ScoreLibrary.Renderer.Paintable.prototype.isDebugDraw = function() {

    return ScoreLibrary.Renderer.Paintable.debugDraw;
};

ScoreLibrary.Renderer.Paintable.prototype.draw = function(context) {

    if (this.isDebugDraw() && this.isDebugMyself()) {

        this.drawBoundBox(context);
    }
};

ScoreLibrary.Renderer.Paintable.prototype.drawBoundBox = function(context) {

    context.save();

    var line_width = 1;

    context.setLineWidth(line_width);
    context.setSourceRgb('#209424');

    context.beginPath();

    var paint_helper =
        ScoreLibrary.Renderer.PAINT_HELPER;

    var width = this.getAllocate('width');
    var height = this.getAllocate('height');

    if (width === 0) {

        paint_helper.drawLine(
            context,
            line_width * 0.5,
            line_width * 0.5,
            line_width * 0.5,
            height - line_width * 0.5);
    }
    else if (height === 0) {

        paint_helper.drawLine(
            context,
            line_width * 0.5,
            line_width * 0.5,
            width - line_width * 0.5,
            line_width * 0.5);
    }
    else {

        context.rect(line_width * 0.5,
                     line_width * 0.5,
                     width - line_width,
                     height - line_width);
    }

    context.stroke();

    context.restore();
};

ScoreLibrary.Renderer.Paintable.debugDump =
    ScoreLibrary.Renderer.Paintable.debugDump || false;

ScoreLibrary.Renderer.Paintable.prototype.isDebugDump = function() {

    return ScoreLibrary.Renderer.Paintable.debugDump;
};

ScoreLibrary.Renderer.Paintable.indentText = function(indent, text) {

    indent = indent || 0;

    text = text || '';

    for (var i = 0; i < indent; ++i) {

        text += ' ';
    }

    return text;
};

ScoreLibrary.Renderer.Paintable.dumpRecursively =
    function(object, indent, logger, dumpRaw) {

        if (!dumpRaw && !object.isDebugMyself) {

            return;
        }

        var dumpRecursively = arguments.callee;

        var indentText =
            ScoreLibrary.Renderer.Paintable.indentText;

        var debugDumpProperties =
            ScoreLibrary.Renderer.Paintable.debugDumpProperties;

        indent = indent || 0;
        logger = logger || ScoreLibrary.Logger;

        if (dumpRaw &&
            (typeof object === 'string' ||
             typeof object === 'number' ||
             typeof object === 'boolean' ||
             typeof object === 'undefined' ||
             object === null)) {

            var text = indentText(indent);
            text += object;
            logger.info(text);

            return;
        }

        if (dumpRaw || object.isDebugMyself()) {

            var text = indentText(indent);

            text += dumpRaw ? '(raw)' : object.toString();
            text += ' {';
            logger.info(text);
        }

        var indent_step = 5;

        indent += indent_step;

        for (var prop in object) {

            var property = object[prop];

            if (typeof property === 'function') {

                continue;
            }

            var child_indent = indent + indent_step;

            if (typeof property === 'object' &&
                property !== null && property.constructor === Array) {

                if (dumpRaw || object.isDebugMyself()) {

                    text = indentText(indent);
                    text += prop;
                    text += ' -> ';
                    text += 'count: ';
                    text += property.length;
                    text += ' [ ';
                    logger.info(text);
                }

                property.forEach(

                    function(child, index, children) {

                        if (dumpRaw || object.isDebugMyself()) {

                            text = indentText(child_indent);
                            text += 'index: ';
                            text += index;
                            logger.info(text);
                        }

                        if (!dumpRaw) {

                            var child_debug = child.debug;

                            child.debug =
                                dumpRaw || object.isDebugMyself();
                        }

                        if (!dumpRaw && child.dump) {

                            child.dump(child_indent, logger);
                        }
                        else {

                            dumpRecursively(
                                child, child_indent, logger, dumpRaw);
                        }

                        if (!dumpRaw) {

                            child.debug = child_debug;
                        }

                    });

                if (dumpRaw || object.isDebugMyself()) {

                    text = indentText(indent);
                    text += ' ];';
                    logger.info(text);
                }
            }
            else if (typeof property === 'object' &&
                     property !== null && !property.getDelegate) {

                if (dumpRaw || object.isDebugMyself()) {

                    text = indentText(indent);
                    text += prop;
                    text += ' -> ';
                    logger.info(text);
                }

                if (!dumpRaw) {

                    var property_debug = property.debug;

                    property.debug = object.isDebugMyself();
                }

                if (!dumpRaw && property.dump) {

                    property.dump(child_indent, logger);
                }
                else {

                    dumpRecursively(property, child_indent, logger, dumpRaw);
                }

                if (!dumpRaw) {

                    property.debug = property_debug;
                }
            }
            else if (!debugDumpProperties ||
                     (debugDumpProperties && debugDumpProperties[prop])) {

                if (dumpRaw || object.isDebugMyself()) {

                    text = indentText(indent);
                    text += prop;
                    text += ' -> ';
                    text += property;
                    logger.info(text);
                }
            }
        }

        indent -= indent_step;

        if (dumpRaw || object.isDebugMyself()) {

            text = indentText(indent);
            text += '};';
            logger.info(text);
        }
    };

ScoreLibrary.Renderer.Paintable.prototype.dump = function(indent, logger) {

    if (this.isDebugDump()) {

        var dumpRecursively =
            ScoreLibrary.Renderer.Paintable.dumpRecursively;

        dumpRecursively(this, indent, logger);
    }
};

ScoreLibrary.Renderer.Paintable.prototype.fromWindowCoordToStreamCoord =
    function(context, stream_height) {

        this.stream_height = stream_height;

        context.transform(1, 0, 0, -1, 0, stream_height);
    };

ScoreLibrary.Renderer.Paintable.prototype.setModel = function(model) {

    this.model = model;
};

ScoreLibrary.Renderer.Paintable.prototype.getModel = function() {

    return this.model;
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
