goog.provide('ScoreLibrary.Score.HarpPedals');
goog.require('ScoreLibrary.Renderer.HarpPedals');
goog.require('ScoreLibrary.Score');
goog.require('ScoreLibrary.Score.Anchor');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Score.Anchor}
 */
ScoreLibrary.Score.HarpPedals = function(number, information) {

    var supperclass = ScoreLibrary.Score.HarpPedals.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.HarpPedals,
    ScoreLibrary.Score.Anchor);

ScoreLibrary.Score.HarpPedals.prototype.toString = function() {

    return 'Score.HarpPedals';
};

ScoreLibrary.Score.HarpPedals.prototype.toNodeString = function() {

    return 'harp-pedals';
};

ScoreLibrary.Score.HarpPedals.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.HarpPedals(this.number, this.information);

    var supperclass = ScoreLibrary.Score.HarpPedals.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Score.HarpPedals.prototype.getPedalTunings = function() {

    return this.information.pedal_tunings;
};

ScoreLibrary.Score.HarpPedals.prototype.createRenderer = function() {

    var harppedals_renderer = new ScoreLibrary.Renderer.HarpPedals();

    this.setRenderer(harppedals_renderer);

    return harppedals_renderer;
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
