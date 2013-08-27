goog.provide('ScoreLibrary.Renderer.Connector');
goog.require('goog.asserts');

/**
 * @constructor
 */
ScoreLibrary.Renderer.Connector = function() {
};

ScoreLibrary.Renderer.Connector.prototype.getYOfConnector =
    function(this_note, that_note, is_start) {

    var connector = this.getModel();

    var notes = connector.getNotes();

    var direction = connector.getDirection();

    var staff = notes[0].getStaff();

    var boundary_y_s = this.boundary_value_s;
    var boundary_y_e = this.boundary_value_e;

    var boundary_y_staff = (direction === 'upper' ?
                            staff.getYOfLineInStaffCoord(
                                staff.getNumberOfLines()) :
                            staff.getYOfLineInStaffCoord(1));

    if (connector.is_prev_unpaired) {

        boundary_y_s = boundary_y_staff;
    }
    else if (connector.is_curr_unpaired) {

        boundary_y_e = boundary_y_staff;
    }

    var this_y = undefined;
    var that_y = undefined;

    if (notes.length > 1) {

        this_y = (this_note === notes[0] ? boundary_y_s : boundary_y_e);
        that_y = (that_note === notes[0] ? boundary_y_s : boundary_y_e);
    }
    else if (notes.length === 1 && is_start) {

        this_y = boundary_y_s;
        that_y = boundary_y_e;
    }
    else if (notes.length === 1 && !is_start) {

        this_y = boundary_y_e;
        that_y = boundary_y_s;
    }

    if (direction === 'lower') {

        this_y = (this_y <= that_y ? 0 : this_y - that_y);

        this_y += this.getRequisite('height');
    }
    else {

        this_y = (this_y >= that_y ? 0 : this_y - that_y);
    }

    if (this.isPlaceOnStem(this_note)) {

        this_y += this.getDeltaYOnStem(this_note);
    }

    if (connector.is_curr_unpaired && !is_start) {

        this_y += (direction === 'upper' ? 10 : -5);
    }

    return this_y;
};

ScoreLibrary.Renderer.Connector.prototype.isPlaceOnStem = function(note) {

    goog.asserts.assert(
        false,
        'ScoreLibrary.Renderer.Connector.isPlaceOnStem(): overload me');
};

ScoreLibrary.Renderer.Connector.prototype.getDeltaYOnStem = function(note) {

    goog.asserts.assert(
        false,
        'ScoreLibrary.Renderer.Connector.getDeltaYOnStem(): overload me');
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
