goog.provide('ScoreLibrary.Score.Rest');
goog.require('ScoreLibrary.Renderer.RestLine');
goog.require('ScoreLibrary.Score');
goog.require('ScoreLibrary.Score.Note');
goog.require('ScoreLibrary.Score.Pitch');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Score.Note}
 */
ScoreLibrary.Score.Rest = function(owner, note_node) {

    var supperclass = ScoreLibrary.Score.Rest.supperclass;

    supperclass.constructor.call(this, owner, note_node);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.Rest,
    ScoreLibrary.Score.Note);

ScoreLibrary.Score.Rest.prototype.toString = function() {

    return 'ScoreRest';
};

ScoreLibrary.Score.Rest.prototype.setNumberOfMultiRest =
    function(num_of_multi_rest) {

    this.num_of_multi_rest = num_of_multi_rest;
};

ScoreLibrary.Score.Rest.prototype.getNumberOfMultiRest = function() {

    return this.num_of_multi_rest;
};

ScoreLibrary.Score.Rest.prototype.isGreateThanHalf = function() {

    var supperclass = ScoreLibrary.Score.Rest.supperclass;

    return (this.getNumberOfMultiRest() > 1 ||
            supperclass.isGreateThanHalf.call(this));
};

ScoreLibrary.Score.Rest.prototype.defaultPadding = function() {

    var supperclass = ScoreLibrary.Score.Rest.supperclass;

    var padding = 0;

    switch (this.getNumberOfMultiRest()) {

    case 3: {

        padding =
            supperclass.defaultPadding.call(this, 'double-whole') +
            supperclass.defaultPadding.call(this, 'whole');
    } break;

    case 2: {

        padding =
            supperclass.defaultPadding.call(this, 'double-whole');
    } break;

    case 1: {

        padding =
            supperclass.defaultPadding.call(this, 'whole');
    } break;

    case 0:
    case undefined: {

        padding =
            supperclass.defaultPadding.call(this);
    } break;

    default: {
    } break;

    }

    return padding;
};

ScoreLibrary.Score.Rest.prototype.typeToRestGlyphParameters = function(type) {

    var staff = this.getStaff();

    var parameters = undefined;

    switch (type) {

    case 'double-whole': {

        parameters = {

            name: 'rests.M1',
            height: staff.getHeightOfSpace(),
            default_y:
            staff.getYOfLineInStaffCoord(3)
        };
    } break;

    case 'whole': {

        parameters = {

            name: 'rests.0',
            height: staff.getHeightOfSpace() * 0.5,
            default_y:
            staff.getYOfLineInStaffCoord(4)
        };
    } break;

    case 'half': {

        parameters = {

            name: 'rests.1',
            height: staff.getHeightOfSpace() * 0.5,
            default_y:
            staff.getYOfLineInStaffCoord(3)
        };
    } break;

    case 'quarter': {

        parameters = {

            name: 'rests.2',
            height: staff.getHeightOfSpace() * 3,
            default_y:
            staff.getYOfLineInStaffCoord(3)
        };
    } break;

    case 'eighth': {

        parameters = {

            name: 'rests.3',
            height: staff.getHeightOfSpace() * 2,
            default_y:
            staff.getYOfLineInStaffCoord(3)
        };
    } break;

    case '16th': {

        parameters = {

            name: 'rests.4',
            height: staff.getHeightOfSpace() * 3,
            default_y:
            staff.getYOfLineInStaffCoord(3)
        };
    } break;

    case '32nd': {

        parameters = {

            name: 'rests.5',
            height: staff.getHeightOfSpace() * 4,
            default_y:
            staff.getYOfLineInStaffCoord(3)
        };
    } break;

    case '64th': {

        parameters = {

            name: 'rests.6',
            height: staff.getHeightOfSpace() * 5,
            default_y:
            staff.getYOfLineInStaffCoord(3)
        };
    } break;

    case '128th': {

        parameters = {

            name: 'rests.7',
            height: staff.getHeightOfSpace() * 6,
            default_y:
            staff.getYOfLineInStaffCoord(3)
        };
    } break;

    default: {

        goog.asserts.assert(
            false,
            'Score.Rest.typeToRestGlyphParameters(): invalid arguments!');

    } break;
    }

    return parameters;
};

ScoreLibrary.Score.Rest.prototype.getType = function() {
    // !NOTE: To fix finale' export musicxml, rest no type BUG.

    var supperclass = ScoreLibrary.Score.Rest.supperclass;

    var type = supperclass.getType.call(this);

    if (!type) {
        switch (32 * this.getDuration() / this.getDivisions()) {

        case 1: {
            type = '128th';
        } break;
        case 2: {
            type = '64th';
        } break;
        case 4: {
            type = '32nd';
        } break;
        case 8: {
            type = '16th';
        } break;
        case 16: {
            type = 'eighth';
        } break;
        case 32: {
            type = 'quarter';
        } break;
        case 64: {
            type = 'half';
        } break;
        case 128: {
            type = 'whole';
        } break;
        case 256: {
            type = 'double-whole';
        } break;
        }
    }

    return type;
};

ScoreLibrary.Score.Rest.prototype.getYOnStaff = function() {

    if (this.getPitch()) {

        var supperclass = ScoreLibrary.Score.Rest.supperclass;

        return supperclass.getYOnStaff.call(this);
    }

    var type = this.getType();
    if (type) {

        var parameters =
            this.typeToRestGlyphParameters(type);

        return parameters.default_y;
    }

    return undefined;
};

ScoreLibrary.Score.Rest.prototype.getDuration = function() {

    var supperclass = ScoreLibrary.Score.Rest.supperclass;

    var duration = supperclass.getDuration.call(this);

    var n_multi_rest = this.getNumberOfMultiRest();
    if (n_multi_rest > 0) {

        duration += n_multi_rest * 4 * this.getDivisions();
    }

    return duration;
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
