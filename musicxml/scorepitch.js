goog.provide('ScoreLibrary.Score.Pitch');
goog.require('ScoreLibrary.Score');
goog.require('goog.asserts');

/**
 * @constructor
 */
ScoreLibrary.Score.Pitch = function(pitch) {

    goog.asserts.assert(
        pitch !== undefined &&
            pitch.octave !== undefined &&
            /(A|B|C|D|E|F|G)/.test(pitch.step),
        'ScoreLibrary.Score.Pitch(): invalid argument!');

    this.octave = pitch.octave;
    this.step = this.fromStepChar(pitch.step);
    this.alter = (pitch.alter !== undefined ? pitch.alter : 0);
};

ScoreLibrary.Score.Pitch.prototype.fromStepChar = function(step) {

    return ((step.charCodeAt(0) - 'A'.charCodeAt(0)) + 7 - 2) % 7;
};

ScoreLibrary.Score.Pitch.prototype.equal = function(other) {

    return (this.octave === other.octave &&
            this.step === other.step &&
            this.alter === other.alter);
};

ScoreLibrary.Score.Pitch.prototype.equalStep = function(other) {

    return (this.step === other.step);
};

ScoreLibrary.Score.Pitch.prototype.equalSteps = function(other) {

    return (this.getSteps() === other.getSteps());
};

ScoreLibrary.Score.Pitch.prototype.equalStepAlter = function(other) {

    return (this.step === other.step &&
            this.alter === other.alter);
};

ScoreLibrary.Score.Pitch.prototype.clone = function(clone) {

    clone = clone || new ScoreLibrary.Score.Pitch({

        octave: this.octave,
        step: this.getStepChar(),
        alter: this.alter
    });

    return clone;
};

ScoreLibrary.Score.Pitch.prototype.getStepChar = function() {

    return String.fromCharCode(
        (this.step + 2) % 7 + 'A'.charCodeAt(0));
};

ScoreLibrary.Score.Pitch.prototype.getSteps = function() {

    return this.octave * 7 + this.step;
};

ScoreLibrary.Score.Pitch.prototype.getSemiTones = function() {

    return this.octave * 12 +
        [0, 2, 4, 5, 7, 9, 11][this.step] +
        this.alter;
};

ScoreLibrary.Score.Pitch.prototype.normalize = function() {

    while (this.step < 0) {

        this.step += 7;
        this.octave -= 1;
    }

    this.octave += Math.floor(this.step / 7);
    this.step = this.step % 7;
};

ScoreLibrary.Score.Pitch.prototype.transpose = function(interval) {

    goog.asserts.assert(
        ScoreLibrary.Score.Pitch.prototype.isPrototypeOf(interval),
        'ScoreLibrary.Score.Pitch.transpose(): invalid argument!');

    var clone = this.clone();

    clone.alter += interval.alter;
    clone.step += interval.step;
    clone.octave += interval.octave;

    clone.normalize();

    clone.alter =
        this.getSemiTones() +
        interval.getSemiTones() -
        clone.getSemiTones();

    return clone;
};

/**
 * @const
 */
ScoreLibrary.Score.Pitch.fifth =
    new ScoreLibrary.Score.Pitch({ octave: 0, step: 'G', alter: 0 });
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
