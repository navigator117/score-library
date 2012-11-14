goog.provide('ScoreLibrary.Score.Chord');
goog.require('ScoreLibrary.Score');
goog.require('ScoreLibrary.Score.Note');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Score.Note}
 */
ScoreLibrary.Score.Chord = function(owner, main_note_node) {

    var supperclass = ScoreLibrary.Score.Chord.supperclass;

    supperclass.constructor.call(this, owner, main_note_node);

    this.addNote(main_note_node);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.Chord,
    ScoreLibrary.Score.Note);

ScoreLibrary.Score.Chord.prototype.toString = function() {

    return 'ScoreChord';
};

ScoreLibrary.Score.Chord.prototype.setDeterminateNote =
    function(determinate_note) {

        this.determinate_note = determinate_note;
    };

ScoreLibrary.Score.Chord.prototype.getDeterminateNote = function() {

    return this.determinate_note;
};

ScoreLibrary.Score.Chord.prototype.addNote = function(note) {

    goog.asserts.assert(
        ScoreLibrary.Score.Note.prototype.isPrototypeOf(note),
        'ScoreLibrary.Score.Chord.addNote(): invalid arguments!');

    this.notes = this.notes || [];

    // !NOTE: Chord notes is link to chord for get score attributes.
    note.prev = this;

    this.notes.push(note);
};

ScoreLibrary.Score.Chord.prototype.getStemDirection = function() {

    return this.getDeterminateNote().getStemDirection();
};

ScoreLibrary.Score.Chord.prototype.getConnectors = function(type) {

    var all_connectors = undefined;

    this.notes.forEach(
        function(note, index, notes) {

            var connectors = note.getConnectors(type);
            if (connectors) {

                all_connectors = all_connectors || [];

                connectors.forEach(
                    function(connector) {

                        if (type === 'tied') {

                            // !NOTE: remember note here, for tied use.
                            connector.note = note;
                        }

                        all_connectors.push(connector);
                    });
            }
        });

    if (all_connectors === undefined) {

        all_connectors = null;
    }

    return all_connectors;
};

ScoreLibrary.Score.Chord.prototype.setStemDirection = function(stem_direction) {

    this.notes.forEach(

        function(note, index, notes) {

            var old_stem_direction = note.getStemDirection();

            note.setStemDirection(stem_direction);

//          if (stem_direction !== old_stem_direction) {

                note.setNoStem(
                    (index !==
                     (stem_direction ===
                      ScoreLibrary.Renderer.Note.StemDirection.Up ?
                      0 : notes.length - 1) ? true : false));
//          }
        });
};

ScoreLibrary.Score.Chord.prototype.setNoFlag = function(no) {

    this.notes.forEach(

            function(note) {

                note.setNoFlag(no);
            });
};

ScoreLibrary.Score.Chord.prototype.getStemLength = function(note) {

    return this.getDeterminateNote().getStemLength();
};

ScoreLibrary.Score.Chord.prototype.createRenderer = function(glyph_factory) {

    return null;
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
