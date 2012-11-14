goog.provide('ScoreLibrary.Renderer.Tuplet');
goog.require('ScoreLibrary.Engraver.Note');
goog.require('ScoreLibrary.Renderer.Connector');
goog.require('ScoreLibrary.Renderer.CustomGlyph');
goog.require('ScoreLibrary.Renderer.PaintContext');
goog.require('ScoreLibrary.Renderer.TextBox');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Renderer.CustomGlyph}
 * @extends {ScoreLibrary.Renderer.Connector}
 */
ScoreLibrary.Renderer.Tuplet = function() {

    var supperclass = ScoreLibrary.Renderer.Tuplet.supperclass;

    supperclass.constructor.call(this, 'Tuplet');
};

ScoreLibrary.inherited(
    ScoreLibrary.Renderer.Tuplet,
    ScoreLibrary.Renderer.CustomGlyph);

ScoreLibrary.aggregate(
    ScoreLibrary.Renderer.Tuplet,
    ScoreLibrary.Renderer.Connector);

ScoreLibrary.Renderer.Tuplet.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Renderer.Tuplet();

    var supperclass = ScoreLibrary.Renderer.Tuplet.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Renderer.Tuplet.prototype.draw = function(context) {

    var supperclass = ScoreLibrary.Renderer.Tuplet.supperclass;

    supperclass.draw.call(this, context);

    var tuplet = this.getModel();

    var x0 = this.getX0OfTuplet();
    var x1 = this.getX1OfTuplet();

    var delta_y = this.getDeltaYOfTuplet();

    var y0 = this.getY0OfTuplet();
    var y1 = y0 + delta_y;
    var y3 = this.getY3OfTuplet();
    var y2 = y3 + delta_y;

    if (tuplet.getShowBracket()) {

        context.save();

        context.setLineWidth(1);
        context.setSourceRgb('#000000');

        context.beginPath();

        context.moveTo(x0, y0);
        context.lineTo(x0, y1);
        context.lineTo(x1, y2);
        context.lineTo(x1, y3);

        context.stroke();

        context.restore();
    }

    if (tuplet.getNumber() === 1) {

        var textbox = this.getTextBox(context);
        if (textbox) {

            var parent_x = textbox.getOrg('parent', 'x') || 0;
            var parent_y = textbox.getOrg('parent', 'y') || 0;

            var allocate_width = textbox.getAllocate('width');
            var allocate_height = textbox.getAllocate('height');

            var x_move = x0 + ((x1 - x0) - allocate_width) * 0.5;

            var y_move = y1 + ((y2 - y1) - allocate_height) * 0.5;

            context.save();

            context.translate(x_move, y_move);

            var padding = 3;

            context.clearRect(parent_x - padding,
                              parent_y,
                              allocate_width + padding * 2,
                              allocate_height);

            textbox.draw(context);

            context.restore();
        }
    }
};

ScoreLibrary.Renderer.Tuplet.prototype.createNoteRendererForEscape =
    function(measure, note_type, note_dots, context) {

        var tuplet = this.getModel();

        var xml = '<note><duration>1</duration>' +
            '<pitch><octave>4</octave><step>G</step></pitch><type>' +
            note_type + '</type></note>';

        var note = new ScoreLibrary.Score.Note(measure, xml);

        note.dots = note_dots;

        var tuplet_note = tuplet.getNotes()[0];

        note.prev = tuplet_note;

        note.staff = tuplet_note.staff;
        note.clef = tuplet_note.clef;
        note.time = tuplet_note.time;
        note.key = tuplet_note.key;

        var engraver =
            new ScoreLibrary.Engraver.Note(context);

        return engraver.createRenderer(note);
    };

ScoreLibrary.Renderer.Tuplet.prototype.getTextBox = function(context) {

    var tuplet = this.getModel();

    var textbox = undefined;

    var show_number = tuplet.getShowNumber();

    var show_type = tuplet.getShowType();

    if (show_number !== 'none') {

        textbox = new ScoreLibrary.Renderer.TextBox('center');

        var text = '';
        var escapes = undefined;

        if ('actual' === show_number || 'both' === show_number) {

            text += tuplet.getActualNotes();

            if ('actual' === show_type || 'both' === show_type) {

                var notes = tuplet.getNotes();

                var actual_note = notes[0];

                var actual_type =
                    tuplet.getActualType();

                actual_type =
                    (actual_type !== undefined ?
                     actual_type :
                     tuplet.getFarmostNoteToMe(actual_note).getType());

                var actual_dots =
                    tuplet.getActualDots();

                actual_dots =
                    (actual_dots !== undefined ?
                     actual_dots :
                     tuplet.getFarmostNoteToMe(actual_note).getNumberOfDot());

                var note_renderer =
                    this.createNoteRendererForEscape(
                        tuplet.getFarmostNoteToMe(actual_note).getMeasure(),
                        actual_type,
                        actual_dots,
                        context);

                note_renderer.sizeAllocateRecursively({

                    width: note_renderer.getRequisite('width'),
                    height: note_renderer.getRequisite('height')
                });

                escapes = escapes || [];
                escapes.push(note_renderer);

                text += '%0';
            }
        }

        if ('both' === show_number) {

            text += ':';
            text += tuplet.getNormalNotes();

            if ('both' === show_type) {

                var notes = tuplet.getNotes();

                var normal_note = notes[0];

                var normal_type =
                    tuplet.getNormalType();

                normal_type =
                    (normal_type !== undefined ?
                     normal_type :
                     tuplet.getFarmostNoteToMe(normal_note).getType());

                var normal_dots =
                    tuplet.getNormalDots();

                normal_dots =
                    (normal_dots !== undefined ?
                     normal_dots :
                     tuplet.getFarmostNoteToMe(normal_note).getNumberOfDot());

                var note_renderer =
                    this.createNoteRendererForEscape(
                        tuplet.getFarmostNoteToMe(normal_note).getMeasure(),
                        normal_type,
                        normal_dots,
                        context);

                note_renderer.sizeAllocateRecursively({

                    width: note_renderer.getRequisite('width'),
                    height: note_renderer.getRequisite('height')
                });

                escapes = escapes || [];
                escapes.push(note_renderer);

                text += '%1';
            }
        }

        context.getCustomTextRenderer().setFontSize(14);

        textbox.setText(
            text, 'italic bold 12px sans-serif', context, escapes);

        textbox.sizeAllocateRecursively({

            width: textbox.getRequisite('width'),
            height: textbox.getRequisite('height')
        });
    }

    return textbox;
};

ScoreLibrary.Renderer.Tuplet.prototype.getX0OfTuplet = function() {

    var tuplet = this.getModel();

    var note0 = tuplet.getNotes()[0];
    var note0_renderer = note0.getRenderer();
    var note0_head = note0_renderer.getNoteHead();

    var x0 =
        note0_renderer.pack_padding_s +
        note0_head.getOrg('parent', 'x');

    if (!tuplet.getShowBracket()) {

        if (note0.getStemDirection() ===
            ScoreLibrary.Renderer.Note.StemDirection.Up) {

            x0 += note0_head.getRequisite('width');
        }
    }

    return x0;
};

ScoreLibrary.Renderer.Tuplet.prototype.getX1OfTuplet = function() {

    var tuplet = this.getModel();

    var notes = tuplet.getNotes();

    var note0 = notes[0];
    var note1 = notes[notes.length - 1];

    var note0_renderer = note0.getRenderer();
    var note1_renderer = note1.getRenderer();

    var note1_head = note1_renderer.getNoteHead();

    var x1 =
        (note1_renderer.getOrg('parent', 'x') -
         note0_renderer.getOrg('parent', 'x')) +
        note0_renderer.pack_padding_s +
        note1_head.getOrg('parent', 'x') +
        note1_head.getRequisite('width');

    if (!tuplet.getShowBracket()) {

        if (note1.getStemDirection() ===
            ScoreLibrary.Renderer.Note.StemDirection.Down) {

            x1 -= note1_head.getRequisite('width');
        }
    }

    return x1;
};

ScoreLibrary.Renderer.Tuplet.prototype.isPlaceOnStem = function() {

    return false;
};

ScoreLibrary.Renderer.Tuplet.prototype.getY0OfTuplet = function() {

    var tuplet = this.getModel();

    var notes = tuplet.getNotes();

    return this.getYOfConnector(notes[0], notes[notes.length - 1]);
};

ScoreLibrary.Renderer.Tuplet.prototype.getDeltaYOfTuplet = function() {

    var tuplet = this.getModel();

    return (tuplet.getDirection() === 'upper' ? 0.5 : -0.5) *
        this.getRequisite('height');
};

ScoreLibrary.Renderer.Tuplet.prototype.getY3OfTuplet = function() {

    var tuplet = this.getModel();

    var notes = tuplet.getNotes();

    return this.getYOfConnector(notes[notes.length - 1], notes[0]);
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
