goog.provide('ScoreLibrary.Score.Staff');
goog.require('ScoreLibrary.Renderer.Staff');
goog.require('ScoreLibrary.Score');
goog.require('ScoreLibrary.Score.AttributeElement');
goog.require('ScoreLibrary.Score.XMLHelper');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Score.AttributeElement}
 */
ScoreLibrary.Score.Staff = function(owner, staff_details_node) {

    var supperclass = ScoreLibrary.Score.Staff.supperclass;

    supperclass.constructor.call(this, owner, staff_details_node);

    var xml_helper = ScoreLibrary.Score.XMLHelper.getInstance();

    xml_helper.getStaffDetails(this, this);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.Staff,
    ScoreLibrary.Score.AttributeElement);

/**
 * @enum {number}
 */
ScoreLibrary.Score.Staff.Constants = {

    tenths: 10,
    spaceBtwStaves: 50
};

ScoreLibrary.Score.Staff.prototype.toString = function() {

    return 'Score.Staff';
};

ScoreLibrary.Score.Staff.prototype.clone = function(clone) {

    clone = clone || new ScoreLibrary.Score.Staff(this.getOwner(), this.node);

    if (this.gcd_duration !== undefined) {

        clone.gcd_duration = this.gcd_duration;
    }

    var supperclass = ScoreLibrary.Score.Staff.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Score.Staff.prototype.setGcdDuration = function(gcd_duration) {

    this.gcd_duration = gcd_duration;
};

ScoreLibrary.Score.Staff.prototype.getGcdDuration = function() {

    return this.gcd_duration;
};

ScoreLibrary.Score.Staff.prototype.createRenderer = function() {

    var staff_renderer = new ScoreLibrary.Renderer.Staff(this);

    this.setRenderer(staff_renderer);

    return staff_renderer;
};

ScoreLibrary.Score.Staff.prototype.getLineWidth = function() {

    return this.line_width || 1;
};

ScoreLibrary.Score.Staff.prototype.getLineColor = function() {

    return this.line_color || '#000000';
};

ScoreLibrary.Score.Staff.prototype.getHeightOfSpace = function() {

    return ScoreLibrary.Score.Staff.Constants.tenths;
};

ScoreLibrary.Score.Staff.prototype.getNumberOfLines = function() {

    return this.staff_lines;
};

ScoreLibrary.Score.Staff.prototype.getNumberOfSpaces = function() {

    return this.staff_lines - 1;
};

ScoreLibrary.Score.Staff.prototype.isOnLine = function(y) {

    return ((Math.abs(y) % this.getHeightOfSpace() === 0) ? true : false);
};

/**
 * As of staff, step 0 Y is at line 1,
 * step 1 Y is at space 1,
 * step 2 Y is at line 2...
 */
ScoreLibrary.Score.Staff.prototype.getYOfStepInStaffCoord = function(step) {

    var height_of_space = this.getHeightOfSpace();

    var abs_step = Math.abs(step);

    var y = Math.floor(abs_step / 2) * height_of_space +
        (abs_step % 2) * (height_of_space / 2);

    return this.toYOfAboveStaffCoord(step >= 0 ? y : -y);
};

ScoreLibrary.Score.Staff.prototype.lineToSteps = function(line_number) {

   goog.asserts.assert(
       line_number >= 1 &&
           line_number <= this.getNumberOfLines(),
       'ScoreLibrary.Score.Staff.lineToSteps(): invalid arguments!');

    return (line_number - 1) * 2;
};

ScoreLibrary.Score.Staff.prototype.getCenterLineNumber = function() {

    return Math.ceil(this.getNumberOfLines() * 0.5);
};

ScoreLibrary.Score.Staff.prototype.getYOfLineInStaffCoord =
    function(line_number) {

    goog.asserts.assert(
        line_number >= 1 &&
            line_number <= this.getNumberOfLines(),
        'ScoreLibrary.Score.Staff.getYOfLineInStaffCoord():' +
            ' invalid arguments!');

    return this.getYOfStepInStaffCoord(this.lineToSteps(line_number));
};

ScoreLibrary.Score.Staff.prototype.getYOfLedgerLineAboveInStaffCoord =
    function(ledger_line_number) {

        goog.asserts.assert(
            ledger_line_number >= 1,
            'ScoreLibrary.Score.Staff.getYOfLedgerLineAboveInStaffCoord():' +
                ' invalid arguments!');

        return this.getYOfStepInStaffCoord(
            ((this.getNumberOfLines() + ledger_line_number - 1) * 2));
    };

ScoreLibrary.Score.Staff.prototype.getYOfLedgerLineBelowInStaffCoord =
    function(ledger_line_number) {

        goog.asserts.assert(
            ledger_line_number >= 1,
            'ScoreLibrary.Score.Staff.getYOfLedgerLineBelowInStaffCoord():' +
                ' invalid arguments!');

        return this.getYOfStepInStaffCoord(-ledger_line_number * 2);
    };

ScoreLibrary.Score.Staff.prototype.getYOfSpaceInStaffCoord =
    function(space_number) {

        goog.asserts.assert(
            space_number >= 1 &&
                space_number <= this.getNumberOfSpaces(),
            'ScoreLibrary.Score.Staff.getYOfSpaceInStaffCoord():' +
                ' invalid arguments!');

        return this.getYOfStepInStaffCoord((space_number - 1) * 2 + 1);
    };

ScoreLibrary.Score.Staff.prototype.getYOfLedgerSpaceAboveInStaffCoord =
    function(ledger_space_number) {

        goog.asserts.assert(
            ledger_space_number >= 1,
            'ScoreLibrary.Score.Staff.getYOfLedgerSpaceAboveInStaffCoord():' +
                'invalid arguments!');

        return this.getYOfStepInStaffCoord(
            (this.getNumberOfSpaces() + ledger_space_number - 1) * 2 + 1);
    };

ScoreLibrary.Score.Staff.prototype.getYOfLedgerSpaceBelowInStaffCoord =
    function(ledger_space_number) {

        goog.asserts.assert(
            ledger_space_number >= 1,
            'ScoreLibrary.Score.Staff.getYOfLedgerSpaceBelowInStaffCoord():' +
                ' invalid arguments!');

        return this.getYOfStepInStaffCoord(
                -((ledger_space_number - 1) * 2 + 1));
    };

ScoreLibrary.Score.Staff.prototype.getStaffByNumber = function(staff_number) {

    return (this.owner ? this.owner.getStaffByNumber(staff_number) : undefined);
};

ScoreLibrary.Score.Staff.prototype.getNumberOfStaves = function() {

    return (this.owner ? this.owner.getNumberOfStaves() : 1);
};

ScoreLibrary.Score.Staff.prototype.getAboveStaff = function() {

    var staff_number = this.getStaffNumber();

    staff_number -= 1;

    return (this.owner &&
            staff_number >= 1 &&
            staff_number <= this.owner.getNumberOfStaves() ?
            this.owner.getStaffByNumber(staff_number) : undefined);
};

ScoreLibrary.Score.Staff.prototype.getBelowStaff = function() {

    var staff_number = this.getStaffNumber();

    staff_number += 1;

    return (this.owner &&
            staff_number >= 1 &&
            staff_number <= this.owner.getNumberOfStaves() ?
            this.owner.getStaffByNumber(staff_number) : undefined);
};

ScoreLibrary.Score.Staff.prototype.getSpacingToAboveStaff = function() {

    return (this.owner ?
            this.owner.getSpacingBetweenStaves() : undefined);
};

ScoreLibrary.Score.Staff.prototype.getSpacingToBelowStaff = function() {

    return (this.owner ?
            this.owner.getSpacingBetweenStaves() : undefined);
};

ScoreLibrary.Score.Staff.prototype.toYOfAboveStaffCoord = function(y) {

    var staff_above = this.getAboveStaff();

    if (staff_above !== undefined) {

        y -= (this.getSpacingToAboveStaff() +
              this.getHeightOfSpace() * this.getNumberOfSpaces());

        y = staff_above.toYOfAboveStaffCoord(y);
    }

    return y;
};

ScoreLibrary.Score.Staff.prototype.getStaffTurnings = function() {

    return this.staff_tunings || [];
};

ScoreLibrary.Score.Staff.prototype.getStaffType = function() {

    return this.staff_type;
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
