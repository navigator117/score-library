goog.provide('ScoreLibrary.Engraver.Rest');
goog.require('ScoreLibrary.Engraver.Note');
goog.require('ScoreLibrary.Renderer.RestLine');
goog.require('ScoreLibrary.Score.Rest');

/**
 * @constructor
 * @extends {ScoreLibrary.Engraver.Note}
 */
ScoreLibrary.Engraver.Rest = function(context) {

    var supperclass = ScoreLibrary.Engraver.Rest.supperclass;

    supperclass.constructor.call(this, context);
};

ScoreLibrary.inherited(
    ScoreLibrary.Engraver.Rest,
    ScoreLibrary.Engraver.Note);

ScoreLibrary.Engraver.Rest.prototype.engraveNote =
    function(note, note_renderer) {

        note_renderer.setOrg('staff', 'x', 0);

        switch (note.getNumberOfMultiRest()) {

        case 3: {

            this.engraveNoteHead(note, note_renderer, 'double-whole');
            this.engraveNoteHead(note, note_renderer, 'whole');
            this.engraveRestNumber(note, note_renderer);
        } break;

        case 2: {

            this.engraveNoteHead(note, note_renderer, 'double-whole');
            this.engraveRestNumber(note, note_renderer);
        } break;

        case 1: {

            this.engraveNoteHead(note, note_renderer, 'whole');
        } break;

        case 0:
        case undefined: {

            this.engraveNoteHead(note, note_renderer);
            this.engraveNoteDots(note, note_renderer);

        } break;

        default: {

            this.engraveRestLine(note, note_renderer);
            this.engraveRestNumber(note, note_renderer);
        } break;

        }
    };

ScoreLibrary.Engraver.Rest.prototype.engraveNoteHead =
    function(note, note_renderer, type) {

        var type = type || note.getType();
        if (type) {

            var parameters =
                note.typeToRestGlyphParameters(type);

            var rest_glyph =
                this.glyph_factory.createByName(
                    parameters.name, parameters.width, parameters.height);

            y = note.getYOnStaff();

            if (y === undefined) {

                y = parameters.default_y;
            }

            var outline_bbox =
                rest_glyph.getOutlineBoundbox();

            y += outline_bbox.y_min;

            var fix_org_coord = 'staff';

            rest_glyph.setOrg(fix_org_coord, 'y', y);

            note_renderer.pack(rest_glyph, false, false, 2, 2, fix_org_coord);
        }
    };

ScoreLibrary.Engraver.Rest.prototype.engraveNoteDots =
    function(note, note_renderer) {

        var type = note.getType();
        if (type) {

            var parameters =
                note.typeToRestGlyphParameters(type);

            var supperclass = ScoreLibrary.Engraver.Rest.supperclass;

            supperclass.engraveNoteDots.call(
                this, note, note_renderer, parameters.default_y);
        }
    };

ScoreLibrary.Engraver.Rest.prototype.engraveRestLine =
    function(note, note_renderer) {

        var staff = note.getStaff();

        var rest_line =
            new ScoreLibrary.Renderer.RestLine(note, staff);

        var fix_org_coord = 'staff';

        var y_on_staff = staff.getYOfLineInStaffCoord(2);

        rest_line.setOrg(fix_org_coord, 'y', y_on_staff);

        note_renderer.pack(
            rest_line, false, false, 0, 0, fix_org_coord);
    };

ScoreLibrary.Engraver.Rest.prototype.engraveRestNumber =
    function(note, note_renderer) {

        var number = note.getNumberOfMultiRest();
        if (number > 0) {

            var number_string = number.toString();

            var number_renderer =
                (number_string.length > 1 ?
                 new ScoreLibrary.Renderer.HBoxGlyph('Renderer.RestNumber') :
                 undefined);

            var staff = note.getStaff();

            for (var i = 0; i < number_string.length; ++i) {

                var character = number_string.charAt(i);

                var glyph =
                    this.glyph_factory.createByChar(
                        character,
                        undefined,
                        staff.getHeightOfSpace() * 2
                    );

                goog.asserts.assert(
                    glyph,
                    'Score.Rest.getNumberRenderer(): unexpect!');

                if (number_renderer) {

                    number_renderer.pack(glyph, false, false, 0, 0);
                }
                else {

                    number_renderer = glyph;
                }
            }

            if (number_renderer) {

                var y_on_staff =
                    staff.getYOfLineInStaffCoord(staff.getNumberOfLines());

                var fix_org_coord = 'staff';

                var x = (note_renderer.getRequisite('width') -
                         number_renderer.getRequisite('width')) * 0.5;

                number_renderer.setOrg(fix_org_coord, 'x', x);
                number_renderer.setOrg(fix_org_coord, 'y', y_on_staff);

                note_renderer.pack(
                    number_renderer, false, false, 0, 0, fix_org_coord);
            }
        }
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
