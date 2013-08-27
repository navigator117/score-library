goog.provide('ScoreLibrary.Renderer.Bracket');
goog.require('ScoreLibrary.Renderer.CustomGlyph');
goog.require('ScoreLibrary.Renderer.PaintHelper');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Renderer.CustomGlyph}
 */
ScoreLibrary.Renderer.Bracket = function(open_sides) {

    var supperclass = ScoreLibrary.Renderer.Bracket.supperclass;

    supperclass.constructor.call(this, 'Bracket');

    this.open_sides = open_sides ||
        ScoreLibrary.Renderer.PaintHelper.OpenSides.Bottom;
};

ScoreLibrary.inherited(
    ScoreLibrary.Renderer.Bracket,
    ScoreLibrary.Renderer.CustomGlyph);

ScoreLibrary.Renderer.Bracket.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Renderer.Bracket();

    var supperclass = ScoreLibrary.Renderer.Bracket.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Renderer.Bracket.prototype.draw = function(context) {

    var supperclass = ScoreLibrary.Renderer.Bracket.supperclass;

    supperclass.draw.call(this, context);

    var bracket = this.getModel();

    context.save();
    context.setLineWidth(1);
    context.setSourceRgb('#000000');

    context.beginPath();

    var paint_helper = ScoreLibrary.Renderer.PAINT_HELPER;

    paint_helper.drawBracket(
        context, 0, this.getY0OfBracket(), this.getWidth(), this.getHeight(),
        this.getOpenSides());

    context.stroke();

    context.restore();

    var textbox = this.getTextBox(context);
    if (textbox) {

        context.save();

        context.translate(
            5, -(textbox.getRequisite('height') - this.getHeight() + 2));

        textbox.draw(context);

        context.restore();
    }
};

ScoreLibrary.Renderer.Bracket.prototype.getOpenSides = function() {

    return this.open_sides;
};

ScoreLibrary.Renderer.Bracket.prototype.getY0OfBracket = function() {

    if (this.getOpenSides() &
        (ScoreLibrary.Renderer.PaintHelper.OpenSides.Bottom |
         ScoreLibrary.Renderer.PaintHelper.OpenSides.Top)) {

        return 0;
    }
    else if (this.getOpenSides() &
             (ScoreLibrary.Renderer.PaintHelper.OpenSides.Left |
              ScoreLibrary.Renderer.PaintHelper.OpenSides.Right)) {

        var bracket = this.getModel();

        var notes = bracket.getNotes();

        var y0 = 0;

/*      if (notes[0].getStemDirection() ===
            ScoreLibrary.Renderer.Note.StemDirection.Down) {

            y0 = this.getHeight();
        } */

        return y0;
    }
};

ScoreLibrary.Renderer.Bracket.prototype.getWidth = function() {

    var bracket = this.getModel();

    if (this.getOpenSides() &
        (ScoreLibrary.Renderer.PaintHelper.OpenSides.Bottom |
         ScoreLibrary.Renderer.PaintHelper.OpenSides.Top)) {

        var notes = bracket.getNotes();

        var note0_renderer = notes[0].getRenderer();
        var note1_renderer = notes[notes.length - 1].getRenderer();

        var note0_x = note0_renderer.getOrg('parent', 'x');
        var note1_x = note1_renderer.getOrg('parent', 'x');

        var note1_width = note1_renderer.getRequisite('width');

        if (ScoreLibrary.Score.Ending.prototype.isPrototypeOf(bracket)) {

            note1_width -= 2;
        }

        // !NOTE: temp fix system start barline's note0_x === undefined
        return (note0_x === undefined ?
                (this.getExplicit('width') - 2) :
                (note1_x - note0_x + note1_width));
    }
    else if (this.getOpenSides() &
             (ScoreLibrary.Renderer.PaintHelper.OpenSides.Left |
              ScoreLibrary.Renderer.PaintHelper.OpenSides.Right)) {

        return bracket.getEndLength();
    }
};

ScoreLibrary.Renderer.Bracket.prototype.getHeight = function() {

    var bracket = this.getModel();

    if (this.getOpenSides() &
        (ScoreLibrary.Renderer.PaintHelper.OpenSides.Bottom |
         ScoreLibrary.Renderer.PaintHelper.OpenSides.Top)) {

        return bracket.getEndLength();
    }
    else if (this.getOpenSides() &
             (ScoreLibrary.Renderer.PaintHelper.OpenSides.Left |
              ScoreLibrary.Renderer.PaintHelper.OpenSides.Right)) {

        var notes = bracket.getNotes();

        var y0 = notes[0].getYOnStaff();
        var y1 = notes[notes.length - 1].getYOnStaff();

        return (y1 - y0) + 10;
    }
};

ScoreLibrary.Renderer.Bracket.prototype.getTextBox = function(context) {

    var textbox = undefined;

    var bracket = this.getModel();

    if (bracket.toNodeString() === 'ending') {

        var text = '';

        if (text = bracket.getNumbers()) {

            text = text.split(/,\s+/).join('., ');
            text += '.';
        }
        else {

            text = bracket.getText();
        }

        if (text) {

            textbox = new ScoreLibrary.Renderer.TextBox('center');

            context.getCustomTextRenderer().setFontSize(14);

            textbox.setText(text, 'bold 11px sans-serif', context);

            textbox.sizeAllocateRecursively({

                width: textbox.getRequisite('width'),
                height: textbox.getRequisite('height')
            });
        }
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
