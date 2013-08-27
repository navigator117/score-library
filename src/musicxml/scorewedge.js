goog.provide('ScoreLibrary.Score.Wedge');
goog.require('ScoreLibrary.Renderer.Wedge');
goog.require('ScoreLibrary.Score');
goog.require('ScoreLibrary.Score.Connector');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Score.Connector}
 */
ScoreLibrary.Score.Wedge = function(number, information) {

    var supperclass = ScoreLibrary.Score.Wedge.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.Wedge,
    ScoreLibrary.Score.Connector);

ScoreLibrary.Score.Wedge.prototype.toString = function() {

    return 'Score.Wedge';
};

ScoreLibrary.Score.Wedge.prototype.toNodeString = function() {

    return 'wedge';
};

ScoreLibrary.Score.Wedge.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.Wedge(this.number, this.information);

    var supperclass = ScoreLibrary.Score.Wedge.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Score.Wedge.prototype.isValidType = function(type) {

    return (/(crescendo|diminuendo|continue|stop)/.test(type));
};

ScoreLibrary.Score.Wedge.prototype.isBeginType = function(type) {

    return (/crescendo|diminuendo/.test(type));
};

ScoreLibrary.Score.Wedge.prototype.isEndType = function(type) {

    return 'stop' === type;
};

ScoreLibrary.Score.Wedge.prototype.getWedgeType = function() {

    return this.information.type;
};

ScoreLibrary.Score.Wedge.prototype.getSpread = function() {

    return this.information.spread || 10;
};

ScoreLibrary.Score.Wedge.prototype.createRenderer = function(context) {

    var wedge_renderer = new ScoreLibrary.Renderer.Wedge();

    wedge_renderer.setExplicit('height', this.getSpread());

    this.setRenderer(wedge_renderer);

    return wedge_renderer;
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
