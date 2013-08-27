goog.provide('ScoreLibrary.Score.KeyManager');
goog.require('ScoreLibrary.Score');

/**
 * @constructor
 */
ScoreLibrary.Score.KeyManager = function() {
};

ScoreLibrary.Score.KeyManager.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.KeyManager();

    return ScoreLibrary.copyAttributes(clone, this);
};

ScoreLibrary.Score.KeyManager.prototype.reset = function() {

    var keys = ScoreLibrary.keys(this, /^\d+/);

    keys.forEach(function(key) {

        delete this[key];
    }, this);
};

ScoreLibrary.Score.KeyManager.prototype.bindKey = function(key_pitches, staff) {

    staff = staff || 1;

    var prop = 'key_pitches_' + staff;

    var old_pitches = this[prop];

    this[prop] = key_pitches;

    return old_pitches;
};

ScoreLibrary.Score.KeyManager.prototype.keyDescriptIt = function(pitch, staff) {

    staff = staff || 1;

    var prop = 'key_pitches_' + staff;

    if (!this[prop] ||
        !this[prop].some(
            ScoreLibrary.Score.Pitch.prototype.equalStepAlter, pitch)) {

        return false;
    }

    return true;
};

ScoreLibrary.Score.KeyManager.prototype.keyNaturalIt = function(pitch, staff) {

    staff = staff || 1;

    var prop = 'key_pitches_' + staff;

    if (this[prop] &&
        this[prop].some(
            ScoreLibrary.Score.Pitch.prototype.equalStep, pitch)) {

        return true;
    }

    return false;
};

ScoreLibrary.Score.KeyManager.prototype.register = function(pitch, staff) {

    staff = staff || 1;

    if (!pitch.alter) {
        /* IGNORE */
        return true;
    }

    if (this.keyDescriptIt(pitch, staff)) {

        return false;
    }

    var prop = '';

    prop += pitch.getSteps();
    prop += staff;

    var alter = this[prop];

    if (alter === pitch.alter) {

        return false;
    }

    this[prop] = pitch.alter;

    return true;
};

ScoreLibrary.Score.KeyManager.prototype.exist = function(pitch, staff) {

    staff = staff || 1;

    if (!pitch.alter) {

        return false;
    }

    if (this.keyDescriptIt(pitch, staff)) {

        return true;
    }

    var prop = '';

    prop += pitch.getSteps();
    prop += staff;

    var alter = this[prop];

    return (alter === pitch.alter);
};

ScoreLibrary.Score.KeyManager.prototype.naturalIt = function(pitch, staff) {

    staff = staff || 1;

    var prop = '';

    prop += pitch.getSteps();
    prop += staff;

    this[prop] = 0;
};

ScoreLibrary.Score.KeyManager.prototype.needNatural = function(pitch, staff) {

    staff = staff || 1;

    if (pitch.alter) {

        return false;
    }

    var prop = '';

    prop += pitch.getSteps();
    prop += staff;

    var alter = this[prop];
    if (alter === 0) {

        return false;
    }
    else if (alter) {

        return true;
    }

    if (this.keyNaturalIt(pitch, staff)) {

        return true;
    }

    return false;
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
