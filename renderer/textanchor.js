goog.provide('ScoreLibrary.Renderer.Fret');
goog.provide('ScoreLibrary.Renderer.TextAnchor');
goog.require('ScoreLibrary.Renderer.CustomGlyph');
goog.require('ScoreLibrary.Renderer.PaintHelper');
goog.require('ScoreLibrary.Renderer.TextBox');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Renderer.CustomGlyph}
 */
ScoreLibrary.Renderer.TextAnchor = function(textanchor) {

    var supperclass = ScoreLibrary.Renderer.TextAnchor.supperclass;

    supperclass.constructor.call(this, 'TextAnchor');

    this.textanchor = textanchor;
};

ScoreLibrary.inherited(
    ScoreLibrary.Renderer.TextAnchor,
    ScoreLibrary.Renderer.CustomGlyph);

ScoreLibrary.Renderer.TextAnchor.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Renderer.TextAnchor(this.textanchor);

    var supperclass = ScoreLibrary.Renderer.TextAnchor.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Renderer.TextAnchor.prototype.getEnclosureHeight =
    function(textbox) {

    var requisite_width = textbox.getRequisite('width');
    var requisite_height = textbox.getRequisite('height');

    var enclosure = this.textanchor.getEnclosure();

    return (/(square|circle|oval)/.test(enclosure) ?
            Math.max(requisite_width, requisite_height) :
            requisite_height);
};

ScoreLibrary.Renderer.TextAnchor.prototype.fromDirectionCoordToTextBoxCoord =
    function(textbox, context) {

    var requisite_height = textbox.getRequisite('height');

    var y_move = (this.getEnclosureHeight(textbox) - requisite_height) * 0.5;

    context.translate(0, y_move);
};

ScoreLibrary.Renderer.TextAnchor.prototype.draw = function(context) {

    var supperclass = ScoreLibrary.Renderer.TextAnchor.supperclass;

    supperclass.draw.call(this, context);

    var textbox = this.getTextBox(context);
    if (textbox) {

        context.save();

        this.fromDirectionCoordToTextBoxCoord(textbox, context);

        textbox.draw(context);

        this.drawEnclosure(context, textbox);

        context.restore();
    }
};

ScoreLibrary.Renderer.TextAnchor.prototype.getTextBox = function(context) {

    if (this.textbox === undefined) {

        var text = this.textanchor.getText(context);
        if (text) {

            this.textbox = new ScoreLibrary.Renderer.TextBox('left');
            context.getCustomTextRenderer().setFontSize(14);
            this.textbox.setText(
                text, this.textanchor.getFont(), context,
                this.textanchor.getEscapes());

            var requisite_width = this.textbox.getRequisite('width');
            var requisite_height = this.textbox.getRequisite('height');

            this.textbox.sizeAllocateRecursively({

                    width: requisite_width,
                    height: requisite_height
                });

            requisite_height =
                this.getEnclosureHeight(this.textbox);

            this.setExplicit('width', requisite_width);
            this.setExplicit('height', requisite_height);
        }
    }

    return this.textbox;
};

ScoreLibrary.Renderer.TextAnchor.prototype.drawEnclosure =
    function(context, textbox) {

    var enclosure = this.textanchor.getEnclosure();
    if (enclosure && enclosure !== 'none') {

        context.save();
        context.setLineWidth(1);
        context.setSourceRgb('#000000');

        context.beginPath();

        var requisite_width = this.textbox.getRequisite('width');
        var requisite_height = this.textbox.getRequisite('height');

        switch (enclosure) {

        case 'oval':
        case 'circle': {

            var paint_helper = ScoreLibrary.Renderer.PAINT_HELPER;

            var length_of_side =
                Math.max(requisite_width, requisite_height);

            paint_helper.drawCircle(
                context,
                requisite_width * 0.5,
                requisite_height * 0.5,
                length_of_side * 0.5);
        } break;

        case 'rectangle': {

            context.rect(0, 0, requisite_width, requisite_height);
        } break;

        default:
        case 'square': {

            var length_of_side =
                Math.max(requisite_width, requisite_height);

            var y = 0 - (length_of_side - requisite_height) * 0.5;

            context.rect(0, y, length_of_side, length_of_side);
        } break;

        case 'bracket': {

            var paint_helper = ScoreLibrary.Renderer.PAINT_HELPER;

            paint_helper.drawBracket(
                context,
                0, 0, requisite_width, requisite_height,
                ScoreLibrary.Renderer.PaintHelper.OpenSides.Bottom);
        } break;

/*      case 'triangle':
        case 'diamond': {
        } break; */
        }

        context.stroke();
        context.restore();
    }
};

/**
 * @constructor
 * @extends {ScoreLibrary.Renderer.TextAnchor}
 */
ScoreLibrary.Renderer.Fret = function(textanchor) {

    var supperclass = ScoreLibrary.Renderer.Fret.supperclass;

    supperclass.constructor.call(this, 'TextAnchor');

    this.textanchor = textanchor;
};

ScoreLibrary.inherited(
    ScoreLibrary.Renderer.Fret,
    ScoreLibrary.Renderer.TextAnchor);

ScoreLibrary.Renderer.Fret.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Renderer.Fret(this.textanchor);

    var supperclass = ScoreLibrary.Renderer.Fret.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Renderer.Fret.prototype.draw = function(context) {

    var supperclass = ScoreLibrary.Renderer.Fret.supperclass;

    supperclass.draw.call(this, context);

    var fret = this.getModel();
    var notes = fret.getNotes();

    var tieds = undefined;
    if (notes && (tieds = notes[0].getConnectors('tied')) &&
        tieds[0].type === 'stop') {

        context.save();
        context.setFont(fret.getFont());

        var text = '(';
        var x = 0 - context.measureText(text);
        var y = 0 + this.getRequisite('height') - 1;

        context.fillText(text, x, y);

        text = ')';
        x = 0 + this.getRequisite('width');

        context.fillText(text, x, y);
        context.restore();
    }
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
