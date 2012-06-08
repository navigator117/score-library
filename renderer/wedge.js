goog.provide('ScoreLibrary.Renderer.Wedge');
goog.require('ScoreLibrary.Renderer.CustomGlyph');
goog.require('ScoreLibrary.Renderer.PaintHelper');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Renderer.CustomGlyph}
 */
ScoreLibrary.Renderer.Wedge = function() {

    var supperclass = ScoreLibrary.Renderer.Wedge.supperclass;

    supperclass.constructor.call(this, 'Wedge');
};

ScoreLibrary.inherited(
    ScoreLibrary.Renderer.Wedge,
    ScoreLibrary.Renderer.CustomGlyph);

ScoreLibrary.Renderer.Wedge.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Renderer.Wedge();

    var supperclass = ScoreLibrary.Renderer.Wedge.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Renderer.Wedge.prototype.draw = function(context) {

    var supperclass = ScoreLibrary.Renderer.Wedge.supperclass;

    supperclass.draw.call(this, context);

    var wedge = this.getModel();

    context.save();

    context.setLineWidth(1);
    context.setSourceRgb('#000000');

    context.beginPath();

    var x0 = this.getX0OfWedge();
    var x1 = this.getX1OfWedge();

    var paint_helper = ScoreLibrary.Renderer.PAINT_HELPER;

    var open_sides =
        (wedge.getWedgeType() === 'crescendo' ?
         ScoreLibrary.Renderer.PaintHelper.OpenSides.Right :
         ScoreLibrary.Renderer.PaintHelper.OpenSides.Left);

    paint_helper.drawWedge(
        context, x0, x1, 0,
        wedge.getSpread(),
        open_sides);

    context.stroke();
    context.restore();
};

ScoreLibrary.Renderer.Wedge.prototype.getX0OfWedge = function() {

    var wedge = this.getModel();

    var note0 = wedge.getNotes()[0];
    var note0_renderer = note0.getRenderer();
    var note0_head = note0_renderer.getNoteHead();

    return (note0_renderer.pack_padding_s +
            note0_head.getOrg('parent', 'x'));
};

ScoreLibrary.Renderer.Wedge.prototype.getX1OfWedge = function() {

    var wedge = this.getModel();

    var notes = wedge.getNotes();

    var note0_renderer = notes[0].getRenderer();
    var note1_renderer = notes[notes.length - 1].getRenderer();

    var note1_head = note1_renderer.getNoteHead();

    return (note1_renderer.getOrg('parent', 'x') -
            note0_renderer.getOrg('parent', 'x') +
            note0_renderer.pack_padding_s +
            note1_head.getOrg('parent', 'x') +
            note1_head.getRequisite('width'));

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
