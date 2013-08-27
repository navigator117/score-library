goog.provide('ScoreLibrary.Renderer.Chord');
goog.provide('ScoreLibrary.Renderer.Note');
goog.require('ScoreLibrary.Renderer');
goog.require('ScoreLibrary.Renderer.Glyph');
goog.require('ScoreLibrary.Renderer.HBoxGlyph');
goog.require('ScoreLibrary.Renderer.PaintContext');
goog.require('ScoreLibrary.Renderer.PaintHelper');
goog.require('ScoreLibrary.Renderer.Staff');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Renderer.HBoxGlyph}
 */
ScoreLibrary.Renderer.Note = function() {

    var supperclass = ScoreLibrary.Renderer.Note.supperclass;

    supperclass.constructor.call(this, 'Renderer.Note');
};

ScoreLibrary.inherited(
    ScoreLibrary.Renderer.Note,
    ScoreLibrary.Renderer.HBoxGlyph);

ScoreLibrary.Renderer.Note.prototype.clone = function(clone) {

    clone = clone || new ScoreLibrary.Renderer.Note(this.note);

    var supperclass = ScoreLibrary.Renderer.Note.supperclass;
    // TODO: note specified clone.
    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Renderer.Note.prototype.draw = function(context) {

    var supperclass = ScoreLibrary.Renderer.Note.supperclass;

    supperclass.draw.call(this, context);

    var note = this.getModel();
    var clef = note.getClef();

    if (clef.sign !== 'TAB') {

        context.save();

        this.fromStreamCoordToNoteCoord(context);

        this.drawLedgerLines(context);

        this.drawStem(context);

        this.drawSingleTremolo(context);

        this.drawFlag(context);

        context.restore();
    }
};

ScoreLibrary.Renderer.Note.getNoteChild = function(note, regexp) {

    var note_child = undefined;

    note.findChild(
        function(child, index, children) {

            if (regexp.test(child.getName())) {

                note_child = child;

                return true;
            }

            return false;
        });

    return note_child;
};

ScoreLibrary.Renderer.Note.prototype.getNoteHead = function() {

    var getNoteChild =
        ScoreLibrary.Renderer.Note.getNoteChild;

    return getNoteChild(this, /(^noteheads|^rests|^ChordNote|^fret)/);
};

ScoreLibrary.Renderer.Note.prototype.getAccidental = function() {

    var getNoteChild =
        ScoreLibrary.Renderer.Note.getNoteChild;

    return getNoteChild(this, /(^Accidental|^accidentals)/);
};

ScoreLibrary.Renderer.Note.StemDirection = {

    Down: 1,
    Up: -1
};

ScoreLibrary.Renderer.Note.prototype.hasSingleTremolo = function() {

    var note = this.getModel();

    var single_tremolo =
        note.getSingleTremolo();

    if (single_tremolo !== null &&
        single_tremolo.type === 'single' &&
        single_tremolo.number > 0) {

        return true;
    }

    return false;
};

ScoreLibrary.Renderer.Note.prototype.getX0OfTremolo =
    function(stem_direction, note_head_width) {

        var x0 = note_head_width * 0.5;

        if (stem_direction === ScoreLibrary.Renderer.Note.StemDirection.Down) {

            x0 *= -1;
        }

        return x0;
    };

ScoreLibrary.Renderer.Note.prototype.getX1OfTremolo =
    function(stem_direction, note_head_width) {

        var x0 = note_head_width * 0.5;

        if (stem_direction === ScoreLibrary.Renderer.Note.StemDirection.Up) {

            x0 += note_head_width;
        }

        return x0;
    };

ScoreLibrary.Renderer.Note.prototype.getY0OfTremolo =
    function(stem_direction, stem_length, tremolo_index) {

        var note = this.getModel();

        var staff = note.getStaff();

        var y0 = stem_length -
            0.8 * staff.getHeightOfSpace() -
            tremolo_index * 0.6 * staff.getHeightOfSpace();

        if (stem_direction === ScoreLibrary.Renderer.Note.StemDirection.Down) {

            y0 *= -1;
        }

        return y0;
    };

ScoreLibrary.Renderer.Note.prototype.getY1OfTremolo = function(y0) {

    var note = this.getModel();

    var staff = note.getStaff();

    return y0 - 0.4 * staff.getHeightOfSpace();
};

ScoreLibrary.Renderer.Note.prototype.drawStem = function(context) {

    var note = this.getModel();

    if (note.hasStem()) {

        var note_type = note.getType();

        var note_head = this.getNoteHead();

        var note_head_width = note_head.getAllocate('width');

        var outline_bbox =
            note_head.getOutlineBoundbox();

        var stem_direction =
            note.getStemDirection();

        var staff = note.getStaff();

        var line_width = staff.getLineWidth() * 0.5;

        context.setLineWidth(line_width);

        var x = note.getXOfStem(stem_direction, line_width, note_head_width);

        var y0 = note.getY0OfStem(
            note_type, stem_direction, line_width, outline_bbox);

        var y1 = note.getY1OfStem(
            note_type, stem_direction, line_width, outline_bbox);

        var paint_helper = ScoreLibrary.Renderer.PAINT_HELPER;

        context.beginPath();

        paint_helper.drawVerticalLine(context, x, y0, y1);

        context.stroke();

        if (note_type === 'long' || note_type === 'breve') {

            var note_type = 'breve';

            stem_direction =
                (stem_direction ===
                 ScoreLibrary.Renderer.Note.StemDirection.Down ?
                 ScoreLibrary.Renderer.Note.StemDirection.Up :
                 ScoreLibrary.Renderer.Note.StemDirection.Down);

            x = note.getXOfStem(stem_direction, line_width, note_head_width);

            y0 = note.getY0OfStem(
                note_type, stem_direction, line_width, outline_bbox);

            y1 = note.getY1OfStem(
                note_type, stem_direction, line_width, outline_bbox);

            context.beginPath();

            paint_helper.drawVerticalLine(context, x, y0, y1);

            context.stroke();
        }
    }
};

ScoreLibrary.Renderer.Note.prototype.drawSingleTremolo = function(context) {

    var note = this.getModel();

    var single_tremolo =
        note.getSingleTremolo();

    if (single_tremolo !== null &&
        single_tremolo.type === 'single' &&
        single_tremolo.number > 0) {

        var note_head = this.getNoteHead();

        var note_head_width = note_head.getAllocate('width');

        var stem_direction = note.getStemDirection();

        var paint_helper = ScoreLibrary.Renderer.PAINT_HELPER;

        var x0 = this.getX0OfTremolo(stem_direction, note_head_width);
        var x1 = this.getX1OfTremolo(stem_direction, note_head_width);

        var single_tremolo = note.getSingleTremolo();

        for (var i = 0; i < single_tremolo.number; ++i) {

            y0 = this.getY0OfTremolo(stem_direction, note.getStemLength(), i);
            y1 = this.getY1OfTremolo(y0);

            radian = Math.PI * 30 / 360;

            context.beginPath();

            paint_helper.drawParallelogramYByRadian(
                context, x0, x1, y0, y1, radian);

            context.closePath();

            context.fill();
        }
    }
};

ScoreLibrary.Renderer.Note.prototype.setSlash = function(slash) {

    goog.asserts.assert(
        slash === undefined ||
            ScoreLibrary.Renderer.Glyph.prototype.isPrototypeOf(slash),
        'ScoreLibrary.Renderer.Note.prototype.setSlash(): invalid argument');

    this.slash = slash;
};

ScoreLibrary.Renderer.Note.prototype.setFlag = function(flag) {

    goog.asserts.assert(
        flag === undefined ||
            ScoreLibrary.Renderer.Glyph.prototype.isPrototypeOf(flag),
        'ScoreLibrary.Renderer.Note.prototype.setFlag(): invalid argument');

    this.flag = flag;
};

ScoreLibrary.Renderer.Note.prototype.fromNoteCoordToFlagCoord =
    function(context) {

        var note = this.getModel();

        var note_head = this.getNoteHead();

        var note_head_obox =
            note_head.getOutlineBoundbox();

        var staff = note.getStaff();

        var line_width = staff.getLineWidth();

        var outline_bbox = this.flag.getOutlineBoundbox();

        var stem_direction = note.getStemDirection();

        if (stem_direction === ScoreLibrary.Renderer.Note.StemDirection.Down) {

            context.transform(1, 0, 0, -1,
                              (-note_head_obox.x_min),
                              -note.getStemLength() +
                              (-outline_bbox.y_min));
        }
        else {

            context.translate(
                note_head_obox.x_max + outline_bbox.x_min,
                note.getStemLength() + outline_bbox.y_min);
        }
    };

ScoreLibrary.Renderer.Note.prototype.drawFlag = function(context) {

    var note = this.getModel();

    if (note.hasFlag() && this.flag) {

        context.save();

        this.fromNoteCoordToFlagCoord(context);

        this.flag.draw(context);

        if (this.slash) {

            context.translate(-3.5, note.getStemLength() * 0.2);

            this.slash.draw(context);
        }

        context.restore();
    }
};

ScoreLibrary.Renderer.Note.prototype.fromStreamCoordToNoteCoord =
    function(context) {

        var note_head = this.getNoteHead();

        var note_head_x = note_head.getOrg('parent', 'x') || 0;
        var note_head_y = note_head.getOrg('parent', 'y') || 0;

        var outline_bbox = note_head.getOutlineBoundbox();

        context.translate(note_head_x + (-outline_bbox.x_min),
                          note_head_y + (-outline_bbox.y_min));
    };

ScoreLibrary.Renderer.Note.prototype.drawLedgerLines = function(context) {

    var note = this.getModel();

    if (note.hasLedgerLines()) {

        context.save();

        context.translate(0, -note.getYOnStaff());

        var staff = note.getStaff();

        var note_head = this.getNoteHead();

        var note_head_width = note_head.getAllocate('width');

        var stem_direction =
            note.getStemDirection();

        var line_width = staff.getLineWidth();

        context.setLineWidth(line_width);

        var x0 = -line_width;

        var x1 = note_head_width + line_width;

        var ledger_line_count = note.getLedgerLineCount();

        goog.asserts.assert(
            ledger_line_count > 0,
            'ScoreLibrary.Renderer.Note.drawLedgerLines(): unexpect!');

        var paint_helper = ScoreLibrary.Renderer.PAINT_HELPER;

        for (var n = 1; n <= ledger_line_count; ++n) {

            var y_of_ledger_line =
                (note.getLedgerLineDirection() < 0 ?
                 staff.getYOfLedgerLineBelowInStaffCoord(n) :
                 staff.getYOfLedgerLineAboveInStaffCoord(n));

            context.beginPath();

            paint_helper.drawHorizontalLine(context, x0, x1, y_of_ledger_line);

            context.stroke();
        }

        context.restore();
    }
};

/**
 * @constructor
 * @extends {ScoreLibrary.Renderer.HBoxGlyph}
 */
ScoreLibrary.Renderer.Chord = function() {

    var supperclass = ScoreLibrary.Renderer.Chord.supperclass;

    supperclass.constructor.call(this, 'ChordCompound');
};

ScoreLibrary.inherited(
    ScoreLibrary.Renderer.Chord,
    ScoreLibrary.Renderer.HBoxGlyph);

ScoreLibrary.Renderer.Chord.prototype.clone =
    function(clone) {

        clone = clone || new ScoreLibrary.Renderer.Chord();

        var supperclass = ScoreLibrary.Renderer.Chord.supperclass;
        // TODO: chord specified clone.
        return supperclass.clone.call(this, clone);
    };

ScoreLibrary.Renderer.Chord.prototype.getNoteHead =
    ScoreLibrary.Renderer.Note.prototype.getNoteHead;

ScoreLibrary.Renderer.Chord.prototype.getAccidental =
    ScoreLibrary.Renderer.Note.prototype.getAccidental;
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
