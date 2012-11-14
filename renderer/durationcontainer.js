goog.provide('ScoreLibrary.Renderer.DurationContainer');
goog.require('ScoreLibrary.DurationMapper');
goog.require('ScoreLibrary.Renderer.PaintableContainer');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Renderer.PaintableContainer}
 * @extends {ScoreLibrary.DurationMapper}
 */
ScoreLibrary.Renderer.DurationContainer = function() {

    var supperclass = ScoreLibrary.Renderer.DurationContainer.supperclass;

    supperclass.constructor.call(this);
};

ScoreLibrary.inherited(ScoreLibrary.Renderer.DurationContainer,
                       ScoreLibrary.Renderer.PaintableContainer);

ScoreLibrary.delegate(ScoreLibrary.Renderer.DurationContainer,
                      ScoreLibrary.DurationMapper);

ScoreLibrary.Renderer.DurationContainer.prototype.toString = function() {

    return 'Renderer.DurationContainer';
};

ScoreLibrary.Renderer.DurationContainer.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Renderer.DurationContainer();

    var supperclass = ScoreLibrary.Renderer.DurationContainer.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Renderer.DurationContainer.prototype.getMapper = function() {

    return this.getDelegate();
};

ScoreLibrary.Renderer.DurationContainer.prototype.setMapper = function(mapper) {

    this.setDelegate(mapper);
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
