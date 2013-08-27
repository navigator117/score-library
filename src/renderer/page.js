goog.provide('ScoreLibrary.PageCounter');
goog.provide('ScoreLibrary.Renderer.Page');
goog.require('ScoreLibrary');
goog.require('ScoreLibrary.Renderer.VBoxGlyph');
goog.require('goog.asserts');

/**
 * @constructor
 */
ScoreLibrary.PageCounter = function() {
};

ScoreLibrary.PageCounter.prototype.incPageNumber = function() {

    this.number = this.number || 1;

    this.number += 1;
};

ScoreLibrary.PageCounter.prototype.getPageNumber = function() {

    this.number = this.number || 1;

    return this.number;
};

ScoreLibrary.PageCounter.prototype.getPageType = function() {

    return (this.getPageNumber() % 2 === 0 ? 'even' : 'odd');
};

/**
 * @constructor
 * @extends {ScoreLibrary.Renderer.VBoxGlyph}
 * @extends {ScoreLibrary.PageCounter}
 */
ScoreLibrary.Renderer.Page = function(page_counter) {

    var supperclass = ScoreLibrary.Renderer.Page.supperclass;

    supperclass.constructor.call(this, 'Page');

    this.number = page_counter.getPageNumber();
};

ScoreLibrary.inherited(
    ScoreLibrary.Renderer.Page,
    ScoreLibrary.Renderer.VBoxGlyph);

ScoreLibrary.aggregate(ScoreLibrary.Renderer.Page,
                       ScoreLibrary.PageCounter);

ScoreLibrary.Renderer.Page.prototype.draw = function(context) {

    context.save();

    var requisite_height = this.getRequisite('height');

    context.transform(1, 0, 0, -1, 0, requisite_height);

    var supperclass = ScoreLibrary.Renderer.Page.supperclass;

    supperclass.draw.call(this, context);

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
