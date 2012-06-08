goog.provide('ScoreLibrary.Score.Clef');
goog.require('ScoreLibrary.Score');
goog.require('ScoreLibrary.Score.AttributeElement');
goog.require('ScoreLibrary.Score.Pitch');
goog.require('ScoreLibrary.Score.Staff');
goog.require('ScoreLibrary.Score.XMLHelper');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Score.AttributeElement}
 */
ScoreLibrary.Score.Clef = function(owner, clef_node) {

    var supperclass = ScoreLibrary.Score.Clef.supperclass;

    supperclass.constructor.call(this, owner, clef_node);

    var xml_helper = ScoreLibrary.Score.XMLHelper.getInstance();

    xml_helper.getClef(this, this);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.Clef,
    ScoreLibrary.Score.AttributeElement);

ScoreLibrary.Score.Clef.prototype.toString = function() {

    return 'Score.Clef';
};

ScoreLibrary.Score.Clef.prototype.getName = function() {

    var name = undefined;

    switch (this.sign) {

    case 'G': {

        name = 'clefs.G';
    } break;

    case 'C': {

        name = 'clefs.C';
    } break;

    case 'F': {

        name = 'clefs.F';
    } break;

    case 'percussion': {

        name = 'clefs.percussion';
    } break;

    case 'TAB': {

        name = 'clefs.tab';
    } break;

    default: {

        name = 'none';
    } break;
    }

    return name;
};

ScoreLibrary.Score.Clef.prototype.getStepsOnStaff = function() {

    if (this.clef_steps === undefined) {

        var staff = this.getStaff();

        if (/(G|C|F)/.test(this.sign) &&
            this.line !== undefined) {

            var xml = '<staff-details number="' + staff.getStaffNumber() +
                '"><staff-type>regular</staff-type><staff-lines>5</staff-lines></staff-details>';

            var five_line_staff =
                new ScoreLibrary.Score.Staff(this.getOwner(), xml);

            this.clef_steps =
                five_line_staff.lineToSteps(this.line) -
                (five_line_staff.getNumberOfLines() -
                 staff.getNumberOfLines());
        }
        else {

            this.clef_steps =
                Math.ceil(staff.lineToSteps(
                    staff.getNumberOfLines()) * 0.5);
        }
    }

    return this.clef_steps;
};

ScoreLibrary.Score.Clef.prototype.getYOfPitchOnStaff = function(pitch) {

    // Unpitched like percussion
    var relative_steps = this.getStepsOnStaff();
    // !NOTE: pitch's step is different from staff's step,
    // pitch's step is count from octave 0, step 0.
    // staff's step is count from staff line 1.

    var clef_pitch = this.getPitch();
    if (clef_pitch) {
        // Pitched like G, C, F

        relative_steps +=
        pitch.getSteps() - clef_pitch.getSteps();
    }

    var staff = this.getStaff();

    return staff.getYOfStepInStaffCoord(relative_steps);
};

ScoreLibrary.Score.Clef.prototype.getYOfStringOnStaff = function(string) {

    // TAB only
    var staff = this.getStaff();

    relative_steps =
        staff.lineToSteps(staff.getNumberOfLines() - string + 1);

    return staff.getYOfStepInStaffCoord(relative_steps);
};

ScoreLibrary.Score.Clef.prototype.getYOnStaff = function() {

    var staff = this.getStaff();

    return staff.getYOfStepInStaffCoord(this.getStepsOnStaff());
};

ScoreLibrary.Score.Clef.prototype.getDefaultSize = function() {

    var requisition = { width: undefined, height: undefined };

    switch (this.sign) {

    case 'G': {

        requisition.height =
            this.getStaff().getHeightOfSpace() * 8;
    } break;

    case 'C': {

        requisition.height =
            this.getStaff().getHeightOfSpace() * 4;
    } break;

    case 'F': {

        requisition.height =
            this.getStaff().getHeightOfSpace() * 3;
    } break;

    case 'percussion': {

        requisition.height =
            this.getStaff().getHeightOfSpace() * 2;
    } break;

    case 'TAB': {

        requisition.height =
            this.getStaff().getHeightOfSpace() * 5;
    } break;

    default: {

        goog.asserts.assert(false,
             'ScoreLibrary.Score.Clef.prototype.getDefaultSize(): NOTREACH!');
    } break;
    }

    return requisition;
};

ScoreLibrary.Score.Clef.prototype.getPitch = function() {

    if (this.pitch === undefined) {

        if (/(G|C|F)/.test(this.sign)) {

            this.pitch =
                new ScoreLibrary.Score.Pitch({

                    octave: (this.sign === 'F' ? 3 : 4) +
                        this.clef_octave_change,
                    step: this.sign,
                    alter: 0
                });
        }
        else {

            this.pitch = null;
        }
    }

    return this.pitch;
};

ScoreLibrary.Score.Clef.prototype.createRenderer =
    function(glyph_factory, first_measure_in_system) {

        var clef_glyph = undefined;

        if (this.sign !== 'none' &&
            this.sign !== 'jianpu') {

            var default_size = this.getDefaultSize();
            if (!first_measure_in_system) {

                default_size.height *= 0.75;
            }

            clef_glyph =
                glyph_factory.createByName(
                    this.getName(),
                    default_size.width,
                    default_size.height);

            if (clef_glyph) {

                this.setRenderer(clef_glyph);
            }
        }

        return clef_glyph;
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
