goog.provide('ScoreLibrary.Score.NoteHead');
goog.require('ScoreLibrary.Score');
goog.require('goog.asserts');

/**
 * @constructor
 */
ScoreLibrary.Score.NoteHead = function(note) {

    this.note = note;
};

ScoreLibrary.Score.NoteHead.prototype.toString = function(note) {

    return 'ScoreNoteHead';
};

ScoreLibrary.Score.NoteHead.prototype.clone = function(clone) {

    clone = clone || new ScoreLibrary.Score.NoteHead(this.note);

    return clone;
};

ScoreLibrary.Score.NoteHead.prototype.createRenderer = function(glyph_factory) {

    var requisition = this.getDefaultSize();

    var glyph =
        glyph_factory.createByName(
            this.getName(), requisition.width, requisition.height);

    return glyph;
};

ScoreLibrary.Score.NoteHead.prototype.getStaff = function() {

    return this.note.getStaff();
};

ScoreLibrary.Score.NoteHead.prototype.getType = function() {

    return (this.note.notehead ? this.note.notehead.notehead : 'normal');
};

ScoreLibrary.Score.NoteHead.prototype.isParenthesized = function() {

    return (this.note.notehead ? this.note.notehead.parentheses : false);
};

ScoreLibrary.Score.NoteHead.prototype.isUp = function() {

    return (this.note.getStemDirection() ===
            ScoreLibrary.Renderer.Note.StemDirection.Up);
};

ScoreLibrary.Score.NoteHead.prototype.getDefaultSize = function() {

    var staff = this.getStaff();

    var requisition = {};

    switch (this.getType()) {

    case 'slash': {

        requisition.height = staff.getHeightOfSpace() * 1.8;
    } break;

    default: {

        requisition.height = staff.getHeightOfSpace();
    } break;
    }

    if (this.note.isGrace()) {

        requisition.height *= 0.65;
    }

    return requisition;
};

ScoreLibrary.Score.NoteHead.prototype.getName = function() {

    var glyph_name = 'noteheads.';

    var head_type = this.getType();

    var note_type = this.note.getType();

    if ('circle-x' === head_type) {

        glyph_name += 's2xcircle';
    }
    else if (/(breve|long|maxima|whole)/.test(note_type)) {

        glyph_name += 's0';
    }
    else {

        head_type !== 'triangle' ?
            glyph_name += 's' :
            glyph_name += (this.isUp() ? 'u' : 'd');

        if ('square' === head_type) {

            glyph_name += '2';
        }
        else {

            if ('half' === note_type) {

                glyph_name += '1';
            }
            else {

                glyph_name += '2';
            }
        }
    }

    if (head_type === 'slash' ||
        head_type === 'triangle' ||
        head_type === 'diamond' ||
        head_type === 'cross') {

        glyph_name += head_type;
    }

    if ('x' === head_type) {

        glyph_name += 'cross';
    }

    if ('square' === head_type) {

        glyph_name += 'harmonic';
    }

    return glyph_name;
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
