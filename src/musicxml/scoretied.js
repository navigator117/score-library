goog.provide('ScoreLibrary.Score.Tied');
goog.require('ScoreLibrary.Renderer.Note');
goog.require('ScoreLibrary.Renderer.Tied');
goog.require('ScoreLibrary.Score');
goog.require('ScoreLibrary.Score.Chord');
goog.require('ScoreLibrary.Score.Connector');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Score.Connector}
 */
ScoreLibrary.Score.Tied = function(number) {

    var supperclass = ScoreLibrary.Score.Tied.supperclass;

    supperclass.constructor.call(this, number);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.Tied,
    ScoreLibrary.Score.Connector);

ScoreLibrary.Score.Tied.prototype.toString = function() {

    return 'Score.Tied';
};

ScoreLibrary.Score.Tied.prototype.toNodeString = function() {

    return 'tied';
};

ScoreLibrary.Score.Tied.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.Tied(this.number, this.information);

    var supperclass = ScoreLibrary.Score.Tied.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Score.Tied.prototype.isValidType = function(type) {

    return (/(start|stop)/.test(type));
};

ScoreLibrary.Score.Tied.prototype.isBeginType = function(type) {

    return 'start' === type;
};

ScoreLibrary.Score.Tied.prototype.isEndType = function(type) {

    return 'stop' === type;
};

ScoreLibrary.Score.Tied.prototype.onAddNote =
    function(number, type, note, information) {

        var supperclass = ScoreLibrary.Score.Tied.supperclass;

        supperclass.onAddNote.call(
            this, number, type, note, information);

        if (ScoreLibrary.Score.Chord.prototype.isPrototypeOf(note)) {

            if (this.isBeginType(type)) {

                this.note_in_chord_s = information.note;
            }

            if (this.isEndType(type)) {

                this.note_in_chord_e = information.note;
            }
        }
    };

ScoreLibrary.Score.Tied.prototype.createRenderer = function() {

    var tied_renderer = new ScoreLibrary.Renderer.Tied(this);

    this.setRenderer(tied_renderer);

    return tied_renderer;
};

ScoreLibrary.Score.Tied.prototype.getDirection = function() {

    if (this.direction === undefined) {

        var stem_direction =
            ScoreLibrary.Renderer.Note.StemDirection.Down;

        var chord = undefined;
        var note_in_chord = undefined;

        var notes = this.getNotes();
        if (notes) {

            var note1 = notes[0];
            var note2 = notes[notes.length - 1];

            if (note1.getStemDirection() === note2.getStemDirection()) {

                stem_direction = note1.getStemDirection();
            }

            if (this.isChordNote(note1)) {

                chord = note1;
                note_in_chord = this.noteInChord(note1);
            }
            else if (this.isChordNote(note2)) {

                chord = note2;
                note_in_chord = this.noteInChord(note2);
            }
        }

        if (!chord) {

            this.direction =
                (stem_direction ===
                 ScoreLibrary.Renderer.Note.StemDirection.Up ?
                 'lower' : 'upper');
        }
        else {

            var staff = note_in_chord.getStaff();

            this.direction =
                (note_in_chord.getYOnStaff() >=
                 staff.getYOfLineInStaffCoord(
                     staff.getCenterLineNumber())) ?
                'upper' : 'lower';
        }
    }

    return this.direction;
};

ScoreLibrary.Score.Tied.prototype.isChordNote = function(note) {

    return ScoreLibrary.Score.Chord.prototype.isPrototypeOf(note);
};

ScoreLibrary.Score.Tied.prototype.noteInChord = function(note) {

    if (this.isChordNote(note)) {

        var notes = this.getNotes();

        return (note === notes[0] ?
                this.note_in_chord_s : this.note_in_chord_e);
    }

    return note;
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
