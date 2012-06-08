goog.provide('ScoreLibrary.Renderer.Box');
goog.provide('ScoreLibrary.Renderer.HBox');
goog.provide('ScoreLibrary.Renderer.VBox');
goog.require('ScoreLibrary.Renderer.PackOrientation');
goog.require('ScoreLibrary.Renderer.PaintableContainer');
goog.require('ScoreLibrary.Renderer.PaintablePackLayouter');
goog.require('ScoreLibrary.Renderer.PaintablePacker');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Renderer.PaintableContainer}
 * @extends {ScoreLibrary.Renderer.PackOrientation}
 * @extends {ScoreLibrary.Renderer.PaintablePacker}
 * @extends {ScoreLibrary.Renderer.PaintableLayouter}
 */
ScoreLibrary.Renderer.Box = function(orientation, spacing) {

    var supperclass = ScoreLibrary.Renderer.Box.supperclass;

    supperclass.constructor.call(this);

    this.setOrientation(orientation);
    this.setSpacing(spacing);
};

ScoreLibrary.inherited(ScoreLibrary.Renderer.Box,
                       ScoreLibrary.Renderer.PaintableContainer);
ScoreLibrary.aggregate(ScoreLibrary.Renderer.Box,
                       ScoreLibrary.Renderer.PackOrientation);
ScoreLibrary.aggregate(ScoreLibrary.Renderer.Box,
                       ScoreLibrary.Renderer.PaintablePacker);
ScoreLibrary.aggregate(ScoreLibrary.Renderer.Box,
                       ScoreLibrary.Renderer.PaintablePackLayouter);

ScoreLibrary.Renderer.Box.prototype.toString = function() {

    return 'Renderer.Box';
};

ScoreLibrary.Renderer.Box.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Renderer.Box(this.getOrientation(), this.getSpacing());

    var supperclass = ScoreLibrary.Renderer.Box.supperclass;

    return supperclass.clone.call(this, clone);
};

/**
 * @constructor
 * @extends {ScoreLibrary.Renderer.Box}
 */
ScoreLibrary.Renderer.HBox = function(spacing) {

    var supperclass = ScoreLibrary.Renderer.HBox.supperclass;

    supperclass.constructor.call(
        this, ScoreLibrary.Renderer.PackOrientation.Horizontal, spacing);
};

ScoreLibrary.inherited(
    ScoreLibrary.Renderer.HBox,
    ScoreLibrary.Renderer.Box);

ScoreLibrary.Renderer.HBox.prototype.toString = function() {

    return 'Renderer.HBox';
};

ScoreLibrary.Renderer.HBox.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Renderer.HBox(this.getSpacing());

    var supperclass = ScoreLibrary.Renderer.HBox.supperclass;

    return supperclass.clone.call(this, clone);
};

/**
 * @constructor
 * @extends {ScoreLibrary.Renderer.Box}
 */
ScoreLibrary.Renderer.VBox = function(spacing) {

    var supperclass = ScoreLibrary.Renderer.VBox.supperclass;

    supperclass.constructor.call(
        this, ScoreLibrary.Renderer.PackOrientation.Vertical, spacing);
};

ScoreLibrary.inherited(
    ScoreLibrary.Renderer.VBox,
    ScoreLibrary.Renderer.Box);

ScoreLibrary.Renderer.VBox.prototype.toString = function() {

    return 'Renderer.VBox';
};

ScoreLibrary.Renderer.VBox.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Renderer.VBox(this.getSpacing());

    var supperclass = ScoreLibrary.Renderer.VBox.supperclass;

    return supperclass.clone.call(this, clone);
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
