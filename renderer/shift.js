goog.provide('ScoreLibrary.Renderer.Shift');
goog.require('ScoreLibrary.Renderer.CustomGlyph');
goog.require('ScoreLibrary.Renderer.PaintHelper');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Renderer.CustomGlyph}
 */
ScoreLibrary.Renderer.Shift = function() {

    var supperclass = ScoreLibrary.Renderer.Shift.supperclass;

    supperclass.constructor.call(this, 'Shift');
};

ScoreLibrary.inherited(
    ScoreLibrary.Renderer.Shift,
    ScoreLibrary.Renderer.CustomGlyph);

ScoreLibrary.Renderer.Shift.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Renderer.Shift();

    var supperclass = ScoreLibrary.Renderer.Shift.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Renderer.Shift.prototype.draw = function(context) {

    var supperclass = ScoreLibrary.Renderer.Shift.supperclass;

    supperclass.draw.call(this, context);

    var textbox = this.getTextBox(context);
    if (textbox) {

        var shift = this.getModel();

        context.save();

        var notes = shift.getNotes();
        if (notes[0] !== notes[1]) {

            context.setLineWidth(1);
            context.setSourceRgb('#000000');

            var x0 = this.getX0OfShift();
            var x1 = this.getX1OfShift();
            var y = (shift.getDirection() === 'upper' ?
                     0 : this.getRequisite('height') * 0.5);

            var paint_helper = ScoreLibrary.Renderer.PAINT_HELPER;

            var open_types = ScoreLibrary.Renderer.PaintHelper.OpenSides;
            var open_sides = open_types.Left;

            open_sides |= (shift.getDirection() === 'upper' ?
                           open_types.Bottom : open_types.Top);

            var requisite_width = textbox.getRequisite('width');

            context.beginPath();

            paint_helper.drawBracket(
                context, (x0 + requisite_width + 5), y,
                x1 - (x0 + requisite_width + 5), shift.getEndLength(),
                open_sides, 'dashed', 4, 4);

            context.stroke();
        }

        textbox.draw(context);

        context.restore();
    }
};

ScoreLibrary.Renderer.Shift.prototype.getX0OfShift = function() {

    return 0;
};

ScoreLibrary.Renderer.Shift.prototype.getX1OfShift = function() {

    var shift = this.getModel();

    var notes = shift.getNotes();

    var note0_renderer = notes[0].getRenderer();
    var note1_renderer = notes[notes.length - 1].getRenderer();

    var note0_x = note0_renderer.getOrg('parent', 'x');
    var note1_x = note1_renderer.getOrg('parent', 'x');

    var note1_width = note1_renderer.getRequisite('width');

    return this.getX0OfShift() + (note1_x - note0_x + note1_width);
};

ScoreLibrary.Renderer.Shift.prototype.getTextBox = function(context) {

    if (this.textbox === undefined) {

        var shift = this.getModel();

        var text = shift.getText();
        if (text !== undefined) {

            this.textbox = new ScoreLibrary.Renderer.TextBox('left');

            this.textbox.setText(text, 'italic 12px sans-serif', context);

            var requisite_width = this.textbox.getRequisite('width');
            var requisite_height = this.textbox.getRequisite('height');

            this.textbox.sizeAllocateRecursively({

                    width: requisite_width,
                    height: requisite_height
                });

            this.setExplicit('height', requisite_height);
        }
    }

    return this.textbox;
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
