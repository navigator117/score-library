goog.provide('ScoreLibrary.Engraver');
goog.provide('ScoreLibrary.Engraver.RendererList');
goog.require('ScoreLibrary');

ScoreLibrary.Engraver = ScoreLibrary.Engraver || {};

/**
 * @enum {number}
 */
ScoreLibrary.Engraver.Constants = {

    density: 1.6,
    sparsity: 1.7
};

/**
 * @constructor
 */
ScoreLibrary.Engraver.RendererList = function() {
};

ScoreLibrary.Engraver.RendererList.prototype.add = function(renderer) {

    this.renderers = this.renderers || [];

    this.renderers.push(renderer);
};

ScoreLibrary.Engraver.RendererList.prototype.getCount = function() {

    return (this.renderers ? this.renderers.length : 0);
};

/**
 * @constructor
 */
ScoreLibrary.Engraver.RendererList.Iterator = function(list) {

    this.list = list;
    this.current = 0;
};

ScoreLibrary.Engraver.RendererList.Iterator.prototype.hasNext = function() {

    return this.current < this.list.getCount();
};

ScoreLibrary.Engraver.RendererList.Iterator.prototype.next = function() {

    return this.list.renderers[this.current++];
};

ScoreLibrary.Engraver.RendererList.Iterator.prototype.hasPrev = function() {

    return this.current > 0;
};

ScoreLibrary.Engraver.RendererList.Iterator.prototype.prev = function() {

    return this.list.renderers[--this.current];
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
