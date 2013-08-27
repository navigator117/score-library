goog.provide('ScoreLibrary.Renderer.Container');
goog.provide('ScoreLibrary.Renderer.PaintableContainer');
goog.require('ScoreLibrary.Renderer.Paintable');
goog.require('goog.asserts');

/**
 * @constructor
 */
ScoreLibrary.Renderer.Container = function() {
};

ScoreLibrary.Renderer.Container.prototype.getChildCount = function() {

    return (this.children ? this.children.length : 0);
};

ScoreLibrary.Renderer.Container.prototype.addChild = function(child) {

    this.children = this.children || [];

    var index = this.children.length;

    this.children.push(child);

    return index;
};

ScoreLibrary.Renderer.Container.prototype.getChild = function(index) {

    return (this.children &&
            index >= 0 &&
            index < this.children.length ?
            this.children[index] : undefined);
};

ScoreLibrary.Renderer.Container.prototype.delChild = function(index) {

    return (this.children &&
            index >= 0 &&
            index < this.children.length ?
            this.children.splice(index, 1)[0] : undefined);
};

ScoreLibrary.Renderer.Container.prototype.findChild =
    function(predicate, context) {

        return (this.children ?
                this.children.some(
                    function(child, index, children) {

                        return predicate.call(
                            this, child, index, children);

                    }, context) : false);
    };

ScoreLibrary.Renderer.Container.prototype.clearChildren = function() {

     var children = this.children;

    delete this.children;

    return children;
};

ScoreLibrary.Renderer.Container.prototype.cloneChildren = function(clone) {

    this.findChild(
        function(child, index, children) {

            clone.children = clone.children || [];

            clone.children.push(child.clone());

            return false;
        }, this);

    return clone;
};

/**
 * @constructor
 * @extends {ScoreLibrary.Renderer.Paintable}
 * @extends {ScoreLibrary.Renderer.Container}
 */
ScoreLibrary.Renderer.PaintableContainer = function() {

    var supperclass =
        ScoreLibrary.Renderer.PaintableContainer.supperclass;

    return supperclass.constructor.call(this);
};

ScoreLibrary.inherited(ScoreLibrary.Renderer.PaintableContainer,
                       ScoreLibrary.Renderer.Paintable);

ScoreLibrary.aggregate(ScoreLibrary.Renderer.PaintableContainer,
                       ScoreLibrary.Renderer.Container);

ScoreLibrary.Renderer.PaintableContainer.prototype.toString = function() {

    return 'Renderer.PaintableContainer';
};

ScoreLibrary.Renderer.PaintableContainer.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Renderer.PaintableContainer();

    var supperclass =
        ScoreLibrary.Renderer.PaintableContainer.supperclass;

    return this.cloneChildren(
        supperclass.clone.call(this, clone));
};

ScoreLibrary.Renderer.PaintableContainer.prototype.draw = function(context) {

    var supperclass =
        ScoreLibrary.Renderer.PaintableContainer.supperclass;

    supperclass.draw.call(this, context);

    this.drawChildren(context);
};

ScoreLibrary.Renderer.PaintableContainer.prototype.drawChildren =
    function(context) {

        this.findChild(
            function(child, index, children) {

                context.save();

                var x = child.getX('parent');
                var y = child.getY('parent');

                if (x !== undefined &&
                    y !== undefined) {

                    context.translate(x, y);
                }

                var debug = child.debug;

                child.debug =
                    this.isDebugMyself();

                child.draw(context);

                child.debug = debug;

                context.restore();

                return false;
            }, this);
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
