goog.provide('ScoreLibrary.Renderer.PaintableMirror');
goog.provide('ScoreLibrary.Renderer.PaintableRotator');
goog.provide('ScoreLibrary.Renderer.PaintableScaler');
goog.provide('ScoreLibrary.Renderer.PaintableTransformer');
goog.provide('ScoreLibrary.Renderer.PaintableTranslator');
goog.require('ScoreLibrary.Renderer');
goog.require('ScoreLibrary.Renderer.Paintable');
goog.require('goog.asserts');

/**
 * @constructor
 */
ScoreLibrary.Renderer.PaintableTransformer = function(target, matrix) {

    this.target = target;

    if (matrix) {

        this.a = matrix.a;
        this.b = matrix.b;
        this.c = matrix.c;
        this.d = matrix.d;
        this.x = matrix.x;
        this.y = matrix.y;
    }
};

ScoreLibrary.Renderer.PaintableTransformer.prototype.toString = function() {

    return 'Renderer.PaintableTransformer';
};

ScoreLibrary.Renderer.PaintableTransformer.prototype.getMatrix = function() {

    return {

        a: this.a,
        b: this.b,
        c: this.c,
        d: this.d,
        x: this.x,
        y: this.y
    };
};

ScoreLibrary.Renderer.PaintableTransformer.prototype.getTarget = function() {

    return this.target;
};

ScoreLibrary.Renderer.PaintableTransformer.prototype.transform = function() {

    var target = this;

    var result =
        ScoreLibrary.extend(
            {}, ScoreLibrary.Renderer.Matrix.identity);

    do {

        if (ScoreLibrary.Renderer.Paintable.prototype.isPrototypeOf(target)) {

            target.mulMatrix(result);

            break;
        }

        result = ScoreLibrary.Renderer.Matrix.multiple(result, target);

        target = target.target;

    } while (true);

    return result;
};

/**
 * @constructor
 * @extends {ScoreLibrary.Renderer.PaintableTransformer}
 */
ScoreLibrary.Renderer.PaintableScaler = function(target, scale_x, scale_y) {

    this.scale_x = (scale_x !== undefined ? scale_x : 1);
    this.scale_y = (scale_y !== undefined ? scale_y : 1);

    var matrix = {

        a: this.scale_x,
        b: 0,
        c: 0,
        d: this.scale_y,
        x: 0,
        y: 0
    };

    var supperclass = ScoreLibrary.Renderer.PaintableScaler.supperclass;

    supperclass.constructor.call(this, target, matrix);
};

ScoreLibrary.inherited(
    ScoreLibrary.Renderer.PaintableScaler,
    ScoreLibrary.Renderer.PaintableTransformer);

ScoreLibrary.Renderer.PaintableScaler.prototype.toString = function() {

    return 'Renderer.PaintableScaler';
};

ScoreLibrary.Renderer.PaintableScaler.prototype.getScaleX = function() {

    return this.scale_x;
};

ScoreLibrary.Renderer.PaintableScaler.prototype.getScaleY = function() {

    return this.scale_y;
};

/**
 * @constructor
 * @extends {ScoreLibrary.Renderer.PaintableTransformer}
 */
ScoreLibrary.Renderer.PaintableRotator = function(target, radian) {

    this.radian = radian || 0;

    var cos_radian = Math.cos(this.radian);
    var sin_radian = Math.sin(this.radian);

    var matrix = {

        a: cos_radian, b: sin_radian,
        c: -sin_radian, d: cos_radian,
        x: 0, y: 0
    };

    var supperclass = ScoreLibrary.Renderer.PaintableRotator.supperclass;

    supperclass.constructor.call(this, target, matrix);
};

ScoreLibrary.inherited(
    ScoreLibrary.Renderer.PaintableRotator,
    ScoreLibrary.Renderer.PaintableTransformer);

ScoreLibrary.Renderer.PaintableRotator.prototype.toString = function() {

    return 'Renderer.PaintableRotator';
};

ScoreLibrary.Renderer.PaintableRotator.prototype.getRadian = function() {

    return this.radian;
};

/**
 * @constructor
 * @extends {ScoreLibrary.Renderer.PaintableTransformer}
 */
ScoreLibrary.Renderer.PaintableTranslator = function(target, move_x, move_y) {

    this.move_x = (move_x !== undefined ? move_x : 0);
    this.move_y = (move_y !== undefined ? move_y : 0);

    var matrix = {

        a: 1, b: 0,
        c: 0, d: 1,
        x: this.move_x, y: this.move_y
    };

    var supperclass = ScoreLibrary.Renderer.PaintableTranslator.supperclass;

    supperclass.constructor.call(this, target, matrix);
};

ScoreLibrary.inherited(
    ScoreLibrary.Renderer.PaintableTranslator,
    ScoreLibrary.Renderer.PaintableTransformer);

ScoreLibrary.Renderer.PaintableTranslator.prototype.toString = function() {

    return 'Renderer.PaintableTranslator';
};

ScoreLibrary.Renderer.PaintableTranslator.prototype.getMoveX = function() {

    return this.move_x;
};

ScoreLibrary.Renderer.PaintableTranslator.prototype.getMoveY = function() {

    return this.move_y;
};

/**
 * @constructor
 * @extends {ScoreLibrary.Renderer.PaintableTransformer}
 */
ScoreLibrary.Renderer.PaintableMirror = function(target, horizontal) {

    this.horizontal =
        (horizontal ? true : false);

    var matrix = {

        a: (this.horizontal ? -1 : 1), b: 0,
        c: 0, d: (this.horizontal ? 1 : -1),
        x: 0, y: 0
    };

    var supperclass = ScoreLibrary.Renderer.PaintableMirror.supperclass;

    supperclass.constructor.call(this, target, matrix);
};

ScoreLibrary.inherited(
    ScoreLibrary.Renderer.PaintableMirror,
    ScoreLibrary.Renderer.PaintableTransformer);

ScoreLibrary.Renderer.PaintableMirror.prototype.toString = function() {

    return 'Renderer.PaintableMirror';
};

ScoreLibrary.Renderer.PaintableMirror.prototype.isHorizontal = function() {

    return this.horizontal;
};

ScoreLibrary.Renderer.PaintableMirror.prototype.isVertical = function() {

    return !this.horizontal;
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
