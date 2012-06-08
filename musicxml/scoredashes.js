goog.provide('ScoreLibrary.Score.Dashes');
goog.require('ScoreLibrary.Renderer.Dashes');
goog.require('ScoreLibrary.Score');
goog.require('ScoreLibrary.Score.Connector');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Score.Connector}
 */
ScoreLibrary.Score.Dashes = function(number, information) {

    var supperclass = ScoreLibrary.Score.Dashes.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.Dashes,
    ScoreLibrary.Score.Connector);

ScoreLibrary.Score.Dashes.prototype.toString = function() {

    return 'Score.Dashes';
};

ScoreLibrary.Score.Dashes.prototype.toNodeString = function() {

    return 'dashes';
};

ScoreLibrary.Score.Dashes.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.Dashes(this.number, this.information);

    var supperclass = ScoreLibrary.Score.Dashes.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Score.Dashes.prototype.isValidType = function(type) {

    return (/(start|continue|stop)/.test(type));
};

ScoreLibrary.Score.Dashes.prototype.isBeginType = function(type) {

    return 'start' === type;
};

ScoreLibrary.Score.Dashes.prototype.isEndType = function(type) {

    return 'stop' === type;
};

ScoreLibrary.Score.Dashes.prototype.getDirection = function() {

    return 'upper';
};

ScoreLibrary.Score.Dashes.prototype.getDashLength = function() {

    return this.information.dash_length;
};

ScoreLibrary.Score.Dashes.prototype.getSpaceLength = function() {

    return this.information.space_length;
};

ScoreLibrary.Score.Dashes.prototype.createRenderer = function() {

    var dashes_renderer = new ScoreLibrary.Renderer.Dashes(this);

    dashes_renderer.setExplicit('height', 10);

    this.setRenderer(dashes_renderer);

    return dashes_renderer;
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
