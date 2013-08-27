goog.provide('ScoreLibrary.Score.Tuplet');
goog.require('ScoreLibrary.Renderer.Note');
goog.require('ScoreLibrary.Renderer.Tuplet');
goog.require('ScoreLibrary.Score');
goog.require('ScoreLibrary.Score.Connector');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Score.Connector}
 */
ScoreLibrary.Score.Tuplet = function(number, information) {

    var supperclass = ScoreLibrary.Score.Tuplet.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.Tuplet,
    ScoreLibrary.Score.Connector);

ScoreLibrary.Score.Tuplet.prototype.toString = function() {

    return 'Score.Tuplet';
};

ScoreLibrary.Score.Tuplet.prototype.toNodeString = function() {

    return 'tuplet';
};

ScoreLibrary.Score.Tuplet.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.Tuplet(this.number, this.information);

    var supperclass = ScoreLibrary.Score.Tuplet.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Score.Tuplet.prototype.isValidType = function(type) {

    return (/(start|stop)/.test(type));
};

ScoreLibrary.Score.Tuplet.prototype.isBeginType = function(type) {

    return 'start' === type;
};

ScoreLibrary.Score.Tuplet.prototype.isEndType = function(type) {

    return 'stop' === type;
};

ScoreLibrary.Score.Tuplet.prototype.getDirection = function() {

    var notes = this.getNotes();

    var note1 = notes[0];
    var note2 = notes[notes.length - 1];

    if (note1.getStemDirection() === note2.getStemDirection()) {

        return (note1.getStemDirection() ===
                ScoreLibrary.Renderer.Note.StemDirection.Up ?
                'upper' : 'lower');
    }
    else {

        return 'upper';
    }
};

ScoreLibrary.Score.Tuplet.prototype.createRenderer = function() {

    var tuplet_renderer = new ScoreLibrary.Renderer.Tuplet(this);

    tuplet_renderer.setExplicit('height', 14);

    this.setRenderer(tuplet_renderer);

    return tuplet_renderer;
};

ScoreLibrary.Score.Tuplet.prototype.getClosestNoteToMe = function(note) {

    if (ScoreLibrary.Score.Chord.prototype.isPrototypeOf(note)) {

        var chord = note;

        // chord' notes is sorted ascend by y on stave, last one is upmost,
        // closest to tuplet.
        var index = (this.getDirection() === 'upper' ?
                     chord.notes.length - 1 : 0);

        return chord.notes[index];
    }
    else {

        return note;
    }
};

ScoreLibrary.Score.Tuplet.prototype.getFarmostNoteToMe = function(note) {

    if (ScoreLibrary.Score.Chord.prototype.isPrototypeOf(note)) {

        var chord = note;

        // chord' notes is sorted ascend by y on stave, first one is downmost,
        // farmost to tuplet.
        var index = (this.getDirection() === 'upper' ?
                     0 : chord.notes.length - 1);

        return chord.notes[index];
    }
    else {

        return note;
    }
};

/**
 * @constructor
 */
ScoreLibrary.Score.Tuplet.PlacementPolicy = function(tuplet) {

    this.tuplet = tuplet;
};

ScoreLibrary.Score.Tuplet.PlacementPolicy.prototype.gatherNoteInformation =
    function(note, index, notes) {

        if (index === 0) {

            this.placement_note = note;
        }
    };

ScoreLibrary.Score.Tuplet.PlacementPolicy.prototype.applyToNote =
    function(note, index, notes) {
        if (index === 0) {

            this.tuplet.setPlacementNote(this.placement_note);

            var beams =
                this.tuplet.getFarmostNoteToMe(
                    this.placement_note).getBeamStartHere();

            if (beams &&
                beams.length > 0 &&
                beams.some(function(beam) {

                    var notes1 = beam.getNotes();
                    var notes2 = this.tuplet.getNotes();

                    return (this.tuplet.getFarmostNoteToMe(notes1[0]) ===
                            this.tuplet.getFarmostNoteToMe(notes2[0]) &&
                            this.tuplet.getFarmostNoteToMe(
                                notes1[notes1.length - 1]) ===
                            this.tuplet.getFarmostNoteToMe(
                                notes2[notes2.length - 1]));
                }, this)) {

                this.tuplet.setShowBracket(false);
            }

            var single_tremolo =
                this.tuplet.getFarmostNoteToMe(
                    this.placement_note).getSingleTremolo();

            if (single_tremolo &&
                single_tremolo.type === 'single' &&
                single_tremolo.number > 0) {

                this.tuplet.setShowBracket(false);
            }
        }
    };

ScoreLibrary.Score.Tuplet.prototype.getPolices = function() {

    return [new ScoreLibrary.Score.Tuplet.PlacementPolicy(this)];
};

ScoreLibrary.Score.Tuplet.prototype.getActualNotes = function() {

    return this.information.tuplet_actual.tuplet_number;
};

ScoreLibrary.Score.Tuplet.prototype.getActualType = function() {

    return this.information.tuplet_actual.tuplet_type;
};

ScoreLibrary.Score.Tuplet.prototype.getActualDots = function() {

    return this.information.tuplet_actual.tuplet_dots;
};

ScoreLibrary.Score.Tuplet.prototype.getNormalNotes = function() {

    return this.information.tuplet_normal.tuplet_number;
};

ScoreLibrary.Score.Tuplet.prototype.getNormalType = function() {

    return this.information.tuplet_normal.tuplet_type;
};

ScoreLibrary.Score.Tuplet.prototype.getNormalDots = function() {

    return this.information.tuplet_normal.tuplet_dots;
};

ScoreLibrary.Score.Tuplet.prototype.getShowNumber = function() {

    return this.information.show_number;
};

ScoreLibrary.Score.Tuplet.prototype.getShowType = function() {

    return this.information.show_type;
};

ScoreLibrary.Score.Tuplet.prototype.setShowBracket = function(show) {

    this.information.bracket = (show ? true : false);
};

ScoreLibrary.Score.Tuplet.prototype.getShowBracket = function() {

    return this.information.bracket;
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
