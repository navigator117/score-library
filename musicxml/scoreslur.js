goog.provide('ScoreLibrary.Score.Slur');
goog.require('ScoreLibrary.Renderer.Note');
goog.require('ScoreLibrary.Renderer.Slur');
goog.require('ScoreLibrary.Score');
goog.require('ScoreLibrary.Score.Connector');
goog.require('goog.asserts');

/**
 * @constructor
 * @export
 * @extends {ScoreLibrary.Score.Connector}
 */
ScoreLibrary.Score.Slur = function(number, information) {

    var supperclass = ScoreLibrary.Score.Slur.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.Slur,
    ScoreLibrary.Score.Connector);

ScoreLibrary.Score.Slur.prototype.toString = function() {

    return 'Score.Slur';
};

ScoreLibrary.Score.Slur.prototype.toNodeString = function() {

    return 'slur';
};

ScoreLibrary.Score.Slur.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.Slur(this.number, this.information);

    var supperclass = ScoreLibrary.Score.Slur.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Score.Slur.prototype.isValidType = function(type) {

    return (/(start|stop)/.test(type));
};

ScoreLibrary.Score.Slur.prototype.isBeginType = function(type) {

    return 'start' === type;
};

ScoreLibrary.Score.Slur.prototype.isEndType = function(type) {

    return 'stop' === type;
};

ScoreLibrary.Score.Slur.prototype.setBeamInvolved = function() {

    this.is_beam_involved = true;
};

ScoreLibrary.Score.Slur.prototype.isBeamInvolved = function() {

    return this.is_beam_involved;
};

ScoreLibrary.Score.Slur.prototype.getText = function() {

    return '';
};

ScoreLibrary.Score.Slur.prototype.getDirection = function() {

    var stem_direction =
        ScoreLibrary.Renderer.Note.StemDirection.Down;

    var notes = this.getNotes();
    if (notes) {

        var note1 = notes[0];
        var note2 = notes[notes.length - 1];

        if (note1.isMultiVoicesOneStaff()) {

            stem_direction =
                (note1.getStemDirection() ===
                 ScoreLibrary.Renderer.Note.StemDirection.Up ?
                 ScoreLibrary.Renderer.Note.StemDirection.Down :
                 ScoreLibrary.Renderer.Note.StemDirection.Up);
        }
        else if (note1.isGrace() || note2.isGrace()) {

            stem_direction =
                ScoreLibrary.Renderer.Note.StemDirection.Up;
        }
        else if (note1.getStemDirection() === note2.getStemDirection()) {

            stem_direction = note1.getStemDirection();
        }
    }

    return (stem_direction ===
            ScoreLibrary.Renderer.Note.StemDirection.Up ?
            'lower' : 'upper');
};

ScoreLibrary.Score.Slur.prototype.isWallerBlock = function() {

    return false;
};

ScoreLibrary.Score.Slur.prototype.getClosestNoteToMe = function(note) {

    if (ScoreLibrary.Score.Chord.prototype.isPrototypeOf(note)) {

        var chord = note;

        // chord' notes is sorted ascend by y on stave, first one is downmost,
        // closest to slur.
        var index =
            (this.getDirection() === 'lower' ? 0 : chord.notes.length - 1);

        return chord.notes[index];
    }
    else {

        return note;
    }
};

ScoreLibrary.Score.Slur.prototype.getFarmostNoteToMe = function(note) {

    if (ScoreLibrary.Score.Chord.prototype.isPrototypeOf(note)) {

        var chord = note;

        // chord' notes is sorted ascend by y on stave, last one is upmost,
        // farmost to slur.
        var index =
            (this.getDirection() === 'lower' ? chord.notes.length - 1 : 0);

        return chord.notes[index];
    }
    else {

        return note;
    }
};

ScoreLibrary.Score.Slur.prototype.createRenderer = function(context, width) {

    var renderer = new ScoreLibrary.Renderer.Slur();

    var height =
        ScoreLibrary.Renderer.Slur.Constants.BowHeight;

    renderer.setExplicit('height', (this.isGraceSlur() ? 0 : height * 0.7));

    this.setRenderer(renderer);

    return renderer;
};

ScoreLibrary.Score.Slur.prototype.getYMove = function() {

    return (this.isGraceSlur() ? 0 : 5);
};

ScoreLibrary.Score.Slur.prototype.isGraceSlur = function() {

    var notes = this.getNotes();

    return notes && (notes[0].isGrace() || notes[notes.length - 1].isGrace());
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
