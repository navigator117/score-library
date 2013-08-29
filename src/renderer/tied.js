goog.provide('ScoreLibrary.Renderer.Tied');
goog.require('ScoreLibrary.Renderer.CustomGlyph');
goog.require('ScoreLibrary.Renderer.PaintContext');
goog.require('ScoreLibrary.Renderer.PaintHelper');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Renderer.CustomGlyph}
 */
ScoreLibrary.Renderer.Tied = function() {

    var supperclass = ScoreLibrary.Renderer.Tied.supperclass;

    supperclass.constructor.call(this, 'Tied');
};

/**
 * @enum {number}
 */
ScoreLibrary.Renderer.Tied.Constants = {

    BowHeight: 0.5 * 10
};

ScoreLibrary.inherited(
    ScoreLibrary.Renderer.Tied,
    ScoreLibrary.Renderer.CustomGlyph);

ScoreLibrary.Renderer.Tied.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Renderer.Tied();

    var supperclass = ScoreLibrary.Renderer.Tied.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Renderer.Tied.prototype.draw = function(context) {

    var supperclass = ScoreLibrary.Renderer.Tied.supperclass;

    supperclass.draw.call(this, context);

    var tied = this.getModel();

    var x0 = this.getX0OfTied();
    var x1 = this.getX1OfTied();

    var y = this.getYOfTied();

    context.save();

    context.setSourceRgb('#000000');

    var paint_helper = ScoreLibrary.Renderer.PAINT_HELPER;

    context.beginPath();

    paint_helper.drawBow(
        context, x0, y, x1, y, (tied.getDirection() === 'upper'),
        ScoreLibrary.Renderer.Tied.Constants.BowHeight);

    context.closePath();

    context.fill();

    context.restore();
};

ScoreLibrary.Renderer.Tied.prototype.getX0OfTied = function() {

    var tied = this.getModel();

    if (tied.is_prev_unpaired) {

        return 0 + 35; // !NOTE: fix Clef & key signature width.
    }

    var note0 = tied.getNotes()[0];

    var note0_renderer = note0.getRenderer();

    var x0 = note0_renderer.pack_padding_s;

    if (!tied.isChordNote(note0)) {

        x0 += note0_renderer.getRequisite('width');
    }
    else {

        var note0_head = note0_renderer.getNoteHead();

        x0 += note0_head.getOrg('parent', 'x');

        note0 = tied.noteInChord(note0);
        note0_renderer = note0.getRenderer();

        x0 += (note0_renderer.getOrg('parent', 'x') +
               note0_renderer.getRequisite('width'));
    }

    return x0;
};

ScoreLibrary.Renderer.Tied.prototype.getX1OfTied = function() {

    var tied = this.getModel();

    if (tied.is_curr_unpaired) {

        return this.getRequisite('width');
    }

    var notes = tied.getNotes();

    var note0 = notes[0];
    var note1 = notes[notes.length - 1];

    var note0_renderer = notes[0].getRenderer();
    var note1_renderer = notes[notes.length - 1].getRenderer();

    var x1 = (note1_renderer.getOrg('parent', 'x') -
              (tied.is_prev_unpaired ?
               0 : note0_renderer.getOrg('parent', 'x'))) +
              note0_renderer.pack_padding_s;

    if (tied.isChordNote(note1)) {

        var note1_head = note1_renderer.getNoteHead();

        x1 += note1_head.getOrg('parent', 'x');

        note1 = tied.noteInChord(note1);
        note1_renderer = note1.getRenderer();

        x1 += note1_renderer.getOrg('parent', 'x');
    }

    return x1;
};

ScoreLibrary.Renderer.Tied.prototype.getYOfTied = function() {

    var tied = this.getModel();

    var direction = tied.getDirection();

    var notes = tied.getNotes();

    var y = 0;

    var note0 = tied.noteInChord(notes[0]);
    var note1 = tied.noteInChord(notes[notes.length - 1]);

    var staff = note0.getStaff();

    var boundary_y_s = this.boundary_value_s || this.boundary_value_e;
    var boundary_y_e = this.boundary_value_e || this.boundary_value_s;

    if (staff.isOnLine(note0.getYOnStaff())) {

        y += (direction === 'upper' ? -2 : 2);
    }

    if (direction === 'upper' &&
        boundary_y_s !== boundary_y_e) {

        y -= Math.abs(boundary_y_s - boundary_y_e);
    }

    y -= (Math.min(boundary_y_s, boundary_y_e) - note0.getYOnStaff());

    y += (direction === 'upper' ? 5 : -5);

    return y;
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
