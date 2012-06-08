goog.provide('ScoreLibrary.Renderer.Slide');
goog.require('ScoreLibrary.Renderer.CustomGlyph');
goog.require('ScoreLibrary.Renderer.PaintContext');
goog.require('ScoreLibrary.Renderer.PaintHelper');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Renderer.CustomGlyph}
 */
ScoreLibrary.Renderer.Slide = function() {

    var supperclass = ScoreLibrary.Renderer.Slide.supperclass;

    supperclass.constructor.call(this, 'Slide');
};

ScoreLibrary.inherited(
    ScoreLibrary.Renderer.Slide,
    ScoreLibrary.Renderer.CustomGlyph);

ScoreLibrary.Renderer.Slide.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Renderer.Slide();

    var supperclass = ScoreLibrary.Renderer.Slide.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Renderer.Slide.prototype.draw = function(context) {

    var supperclass = ScoreLibrary.Renderer.Slide.supperclass;

    supperclass.draw.call(this, context);

    var slide = this.getModel();

    var x0 = this.getX0OfSlide();
    var y0 = this.getY0OfSlide();

    var x1 = this.getX1OfSlide();
    var y1 = this.getY1OfSlide();

    context.save();

    context.setLineWidth(1);
    context.setSourceRgb('#000000');

    var paint_helper = ScoreLibrary.Renderer.PAINT_HELPER;

    context.beginPath();

    switch (slide.getLineType()) {

    default:
    case 'solid': {

        paint_helper.drawLine(context, x0, y0, x1, y1);
    } break;

    case 'dashed': {

        paint_helper.drawDashedLine(context, x0, y0, x1, y1);
    } break;

    case 'dotted': {

        paint_helper.drawDashedLine(context, x0, y0, x1, y1, 1, 4);
    } break;

    case 'wavy': {

        paint_helper.drawWavyLine(context, x0, y0, x1, y1);
    } break;
    }

    context.stroke();

    context.restore();

    context.save();

    var textbox = this.getTextBox(context);
    if (textbox) {

        var requisite_width = textbox.getRequisite('width');

        var delta_x = x1 - x0;
        var delta_y = y1 - y0;

        var radian = Math.atan(delta_y / delta_x);

        var move_x = x0 + delta_x * 0.5 -
            (requisite_width * 0.5) * Math.cos(radian);

        var move_y = y0 + delta_y * 0.5 -
            (requisite_width * 0.5) * Math.sin(radian);

        context.transform(
            Math.cos(radian), Math.sin(radian),
           -Math.sin(radian), Math.cos(radian),
            move_x, move_y);

        textbox.draw(context);
    }

    context.restore();
};

ScoreLibrary.Renderer.Slide.prototype.getX0OfSlide = function() {

    var slide = this.getModel();

    var note0 = slide.getNotes()[0];
    var note0_renderer = note0.getRenderer();

    return note0_renderer.getRequisite('width');
};

ScoreLibrary.Renderer.Slide.prototype.getX1OfSlide = function() {

    var slide = this.getModel();

    var notes = slide.getNotes();

    var note0 = notes[0];
    var note1 = notes[notes.length - 1];

    var note0_renderer = note0.getRenderer();
    var note1_renderer = note1.getRenderer();

    var note1_head = note1_renderer.getNoteHead();

    return (note1_renderer.getOrg('parent', 'x') -
            note0_renderer.getOrg('parent', 'x'));
};

ScoreLibrary.Renderer.Slide.prototype.getY0OfSlide = function() {

    var slide = this.getModel();

    var note0 = slide.getNotes()[0];
    var note0_renderer = note0.getRenderer();
    var note0_head = note0_renderer.getNoteHead();

    return ((note0.getStemDirection() ===
            ScoreLibrary.Renderer.Note.StemDirection.Up ? 1 : -1) *
            note0_head.getRequisite('height') * 0.5);
};

ScoreLibrary.Renderer.Slide.prototype.getY1OfSlide = function() {

    var slide = this.getModel();

    var notes = slide.getNotes();

    var note1 = notes[0];
    var note2 = notes[notes.length - 1];

    return this.getY0OfSlide() + (note2.getYOnStaff() - note1.getYOnStaff());
};

ScoreLibrary.Renderer.Slide.prototype.getTextBox = function(context) {

    var textbox = undefined;

    var slide = this.getModel();

    var text = slide.getText();
    if (text) {

        textbox = new ScoreLibrary.Renderer.TextBox('center');

        textbox.setText(text, '10px sans-serif', context);

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
