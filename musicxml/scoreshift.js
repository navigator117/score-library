goog.provide('ScoreLibrary.Score.Shift');
goog.require('ScoreLibrary.Renderer.Shift');
goog.require('ScoreLibrary.Score');
goog.require('ScoreLibrary.Score.Connector');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Score.Connector}
 */
ScoreLibrary.Score.Shift = function(number, information) {

    var supperclass = ScoreLibrary.Score.Shift.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.Shift,
    ScoreLibrary.Score.Connector);

ScoreLibrary.Score.Shift.prototype.toString = function() {

    return 'Score.Shift';
};

ScoreLibrary.Score.Shift.prototype.toNodeString = function() {

    return 'octave-shift';
};

ScoreLibrary.Score.Shift.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.Shift(this.number, this.information);

    var supperclass = ScoreLibrary.Score.Shift.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Score.Shift.prototype.isValidType = function(type) {

    return (/(up|down|continue|stop)/.test(type));
};

ScoreLibrary.Score.Shift.prototype.isBeginType = function(type) {

    return (/(up|down)/.test(type));
};

ScoreLibrary.Score.Shift.prototype.isEndType = function(type) {

    return 'stop' === type;
};

ScoreLibrary.Score.Shift.prototype.getShiftSize = function() {

    return this.information.size;
};

ScoreLibrary.Score.Shift.prototype.getShiftType = function() {

    return this.information.type;
};

 ScoreLibrary.Score.Shift.prototype.getDirection = function() {

    return (this.getShiftType() === 'up' ? 'lower' : 'upper');
};

ScoreLibrary.Score.Shift.prototype.getEndLength = function() {

    return 5;
};

ScoreLibrary.Score.Shift.prototype.getText = function() {

    var shift_size = this.getShiftSize();

    return (shift_size ?
            (shift_size +
             (shift_size === 8 ?
              'v' : 'm') +
             (this.getDirection() === 'upper' ?
              'a' : 'b')) : undefined);
};

ScoreLibrary.Score.Shift.prototype.createRenderer = function(context) {

    var shift_renderer = new ScoreLibrary.Renderer.Shift(this);

    this.setRenderer(shift_renderer);

    shift_renderer.getTextBox(context);

    return shift_renderer;
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
