goog.provide('ScoreLibrary.Renderer.Slur');
goog.require('ScoreLibrary.Renderer.Connector');
goog.require('ScoreLibrary.Renderer.CustomGlyph');
goog.require('ScoreLibrary.Renderer.PaintContext');
goog.require('ScoreLibrary.Renderer.PaintHelper');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Renderer.CustomGlyph}
 * @extends {ScoreLibrary.Renderer.Connector}
 */
ScoreLibrary.Renderer.Slur = function(name) {

    var supperclass = ScoreLibrary.Renderer.Slur.supperclass;

    supperclass.constructor.call(this, name || 'Slur');
};

ScoreLibrary.inherited(
    ScoreLibrary.Renderer.Slur,
    ScoreLibrary.Renderer.CustomGlyph);

ScoreLibrary.aggregate(
    ScoreLibrary.Renderer.Slur,
    ScoreLibrary.Renderer.Connector);

/**
 * @enum {number}
 */
ScoreLibrary.Renderer.Slur.Constants = {

    BowHeight: 2.5 * 10
};

ScoreLibrary.Renderer.Slur.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Renderer.Slur();

    var supperclass = ScoreLibrary.Renderer.Slur.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Renderer.Slur.prototype.draw = function(context) {

    var supperclass = ScoreLibrary.Renderer.Slur.supperclass;

    supperclass.draw.call(this, context);

    var slur = this.getModel();

    var x0 = this.getX0OfSlur();
    var y0 = this.getY0OfSlur();

    var x1 = this.getX1OfSlur();
    var y1 = this.getY1OfSlur();

    context.save();

    context.setSourceRgb('#000000');

    var paint_helper = ScoreLibrary.Renderer.PAINT_HELPER;

    context.beginPath();

    paint_helper.drawBow(
        context, x0, y0, x1, y1, (slur.getDirection() === 'upper'),
        ScoreLibrary.Renderer.Slur.Constants.BowHeight);

    context.closePath();

    context.fill();

    context.restore();

    var textbox = this.getTextBox(context);
    if (textbox) {

        var y2 = y1 + 3.5 * 10;

        var allocate_width = textbox.getAllocate('width');
        var allocate_height = textbox.getAllocate('height');

        var x_move = x0 + ((x1 - x0) - allocate_width) * 0.5;

        var y_move = y1 + ((y2 - y1) - allocate_height) * 0.5;

        context.save();

        context.translate(x_move, y_move);

        textbox.draw(context);

        context.restore();
    }
};

ScoreLibrary.Renderer.Slur.prototype.getX0OfSlur = function() {

    var slur = this.getModel();

    if (slur.is_prev_unpaired) {

        return 0 + 35; // !NOTE: fix Clef & key signature width.
    }

    var note0 = slur.getNotes()[0];
    var note0_renderer = note0.getRenderer();
    var note0_head = note0_renderer.getNoteHead();

    var x0 =
        note0_renderer.pack_padding_s +
        note0_head.getOrg('parent', 'x');

    var is_place_on_stem = this.isPlaceOnStem(note0);

    var stem_direction = note0.getStemDirection();

    if (is_place_on_stem &&
        (stem_direction ===
         ScoreLibrary.Renderer.Note.StemDirection.Up)) {

        x0 += note0_head.getRequisite('width');
    }
    else if (is_place_on_stem &&
             (stem_direction ===
              ScoreLibrary.Renderer.Note.StemDirection.Down) &&
             (this.isBeamInvolved(note0) || !this.isInTwoOctave())) {

        x0 += 0;
    }
    else {

        x0 += note0_head.getRequisite('width') * 0.5;
    }

    return x0;
};

ScoreLibrary.Renderer.Slur.prototype.getX1OfSlur = function() {

    var slur = this.getModel();

    if (slur.is_curr_unpaired) {

        return this.getRequisite('width');
    }

    var notes = slur.getNotes();

    var note0 = notes[0];
    var note1 = notes[notes.length - 1];

    var note0_renderer = note0.getRenderer();
    var note1_renderer = note1.getRenderer();

    var note1_head = note1_renderer.getNoteHead();

    var x1 =
        (note1_renderer.getOrg('parent', 'x') -
         (slur.is_prev_unpaired ? 0 : note0_renderer.getOrg('parent', 'x'))) +
        note0_renderer.pack_padding_s +
        note1_head.getOrg('parent', 'x');

    var is_place_on_stem = this.isPlaceOnStem(note1);

    var stem_direction = note1.getStemDirection();

    if (is_place_on_stem &&
        (stem_direction ===
         ScoreLibrary.Renderer.Note.StemDirection.Down)) {

        x1 += 0;
    }
    else if (is_place_on_stem &&
             (stem_direction ===
              ScoreLibrary.Renderer.Note.StemDirection.Up) &&
             (this.isBeamInvolved(note1) || !this.isInTwoOctave())) {

        x1 += note1_head.getRequisite('width');
    }
    else {

        x1 += note1_head.getRequisite('width') * 0.5;
    }

    return x1;
};

ScoreLibrary.Renderer.Slur.prototype.getY0OfSlur = function() {

    var slur = this.getModel();

    var notes = slur.getNotes();

    return this.getYOfConnector(notes[0], notes[notes.length - 1], true);
};

ScoreLibrary.Renderer.Slur.prototype.getY1OfSlur = function() {

    var slur = this.getModel();

    var notes = slur.getNotes();

    return this.getYOfConnector(notes[notes.length - 1], notes[0], false);
};

ScoreLibrary.Renderer.Slur.prototype.getDeltaYOnStem = function(note) {

    var slur = this.getModel();

    var delta_y = 0;

    if (!this.isBeamInvolved(note) && this.isInTwoOctave()) {

        var stem_length = note.getStemLength();

        stem_length -=
            Math.abs(slur.getFarmostNoteToMe(note).getYOnStaff() -
                     slur.getClosestNoteToMe(note).getYOnStaff());

        delta_y = stem_length *
            (slur.getDirection() === 'upper' ? -1 : 1) *
            (slur.isGraceSlur() && !note.isMultiVoicesOneStaff() ? 0.8 : 0.5);
    }

    return delta_y;
};

ScoreLibrary.Renderer.Slur.prototype.isPlaceOnStem = function(note) {

    var slur = this.getModel();

    if (slur.getDirection() === 'upper' &&
        note.hasStem() &&
        note.getStemDirection() ===
        ScoreLibrary.Renderer.Note.StemDirection.Up) {

        return true;
    }

    if (slur.getDirection() === 'lower' &&
        note.hasStem() &&
        note.getStemDirection() ===
        ScoreLibrary.Renderer.Note.StemDirection.Down) {

        return true;
    }

    return false;
};

ScoreLibrary.Renderer.Slur.prototype.isBeamInvolved = function(note) {

    var slur = this.getModel();

    var note = slur.getClosestNoteToMe(note);

    return ((note.hasFlag() || note.getConnectors('beam')) ? true : false);
};

ScoreLibrary.Renderer.Slur.prototype.isInTwoOctave = function() {

    var slur = this.getModel();

    var notes = slur.getNotes();

    var note0 = slur.getClosestNoteToMe(notes[0]);
    var note1 = slur.getClosestNoteToMe(notes[notes.length - 1]);

    var staff = note0.getStaff();

    return (staff.getHeightOfSpace() * 6 >=
            Math.abs(note1.getYOnStaff() - note0.getYOnStaff()));
};

ScoreLibrary.Renderer.Slur.prototype.getTextBox = function(context) {

    var textbox = undefined;

    var slur = this.getModel();

    var text = slur.getText();
    if (text) {

        textbox =
            new ScoreLibrary.Renderer.TextBox('center');

        textbox.setText(
            text, 'italic bold 12px sans-serif', context);

        textbox.sizeAllocateRecursively({

                width: textbox.getRequisite('width'),
                height: textbox.getRequisite('height')
            });
    }

    return textbox;
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
