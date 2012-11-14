goog.provide('ScoreLibrary.Renderer.Beam');
goog.provide('ScoreLibrary.Renderer.TremoloBeam');
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
ScoreLibrary.Renderer.Beam = function(name) {

    var supperclass = ScoreLibrary.Renderer.Beam.supperclass;

    supperclass.constructor.call(this, name || 'Beam');
};

ScoreLibrary.inherited(
    ScoreLibrary.Renderer.Beam,
    ScoreLibrary.Renderer.CustomGlyph);

ScoreLibrary.aggregate(
    ScoreLibrary.Renderer.Beam,
    ScoreLibrary.Renderer.Connector);

ScoreLibrary.Renderer.Beam.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Renderer.Beam();

    var supperclass = ScoreLibrary.Renderer.Beam.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Renderer.Beam.prototype.draw = function(context) {

    var supperclass = ScoreLibrary.Renderer.Beam.supperclass;

    supperclass.draw.call(this, context);

    var beam = this.getModel();

    context.save();

    context.setSourceRgb('#000000');

    var x0 = this.getX0OfBeam();
    var x1 = this.getX1OfBeam();

    var y0 = this.getY0OfBeam();
    var y1 = this.getY1OfBeam();

    var helper =
        ScoreLibrary.Renderer.PAINT_HELPER;

    var placement = beam.getPlacementNote();

    context.beginPath();

    if (beam.isForward() || beam.isBackward()) {

        var radian = beam.getFarmostNoteToMe(placement).getBeamRadian();

        helper.drawParallelogramYByRadian(context, x0, x1, y0, y1, radian);
    }
    else {

        var y_move =
            beam.getHeightOfBeam() *
            (beam.getDirection() === 'upper' ? -1 : 1);

        helper.drawParallelogramY(
            context, x0, x1, y0, y0 + y_move, y1 + y_move, y1);
    }

    context.closePath();

    context.fill();

    context.restore();
};

ScoreLibrary.Renderer.Beam.prototype.getX0OfBeam = function() {

    var beam = this.getModel();

    var note0 = beam.getNotes()[0];
    var note0_renderer = note0.getRenderer();
    var note0_head = note0_renderer.getNoteHead();

    var note0_stem_x =
        (note0_head.x_adjusted ?
         note0_head.getRequisite('width') * 0.5 :
         (beam.getDirection() === 'upper' ?
          note0_head.getRequisite('width') : 0));

    var x0 =
        note0_renderer.pack_padding_s +
        note0_head.getOrg('parent', 'x') +
        note0_stem_x;

    return x0;
};

ScoreLibrary.Renderer.Beam.prototype.getX1OfBeam = function() {

    var beam = this.getModel();

    var x1 = undefined;

    if (beam.isBackward()) {

        x1 = this.getX0OfBeam() - beam.getHookLength();
    }
    else if (beam.isForward()) {

        x1 = this.getX0OfBeam() + beam.getHookLength();
    }
    else {

        var notes = beam.getNotes();

        var note0 = notes[0];
        var note1 = notes[notes.length - 1];

        var note0_renderer = note0.getRenderer();
        var note1_renderer = note1.getRenderer();

        var note1_head = note1_renderer.getNoteHead();

        var note1_stem_x =
            (note1_head.x_adjusted ?
             note1_head.getRequisite('width') * 0.5 :
             (beam.getDirection() === 'upper' ?
              note1_head.getRequisite('width') : 0));

        x1 =
            (note1_renderer.getOrg('parent', 'x') -
             note0_renderer.getOrg('parent', 'x')) +
            note0_renderer.pack_padding_s +
            note1_head.getOrg('parent', 'x') +
            note1_stem_x;
    }

    return x1;
};

ScoreLibrary.Renderer.Beam.prototype.getY0OfBeam = function() {

    var beam = this.getModel();

    if (beam.isForward() || beam.isBackward()) {

        return 0 +
            (beam.getDirection() === 'lower' ? 1 : -1) *
            (beam.getNumber() - 1) *
            (beam.getHeightOfBeam() + beam.getSpaceBtwBeam());
    }
    else {

        var notes = beam.getNotes();

        return this.getYOfConnector(notes[0], notes[notes.length - 1]);
    }
};

ScoreLibrary.Renderer.Beam.prototype.getY1OfBeam = function() {

    var beam = this.getModel();

    if (beam.isForward() || beam.isBackward()) {

        return this.getY0OfBeam() +
            (beam.getDirection() === 'lower' ? 1 : -1) *
            beam.getHeightOfBeam();
    }
    else {

        var notes = beam.getNotes();

        return this.getYOfConnector(notes[notes.length - 1], notes[0]);
    }
};

ScoreLibrary.Renderer.Beam.prototype.isPlaceOnStem = function() {

    return true;
};

ScoreLibrary.Renderer.Beam.prototype.getDeltaYOnStem = function() {

    var beam = this.getModel();

    var delta_y =
        (beam.getDirection() === 'lower' ? 1 : -1) *
        (beam.getNumber() - 1) *
        (beam.getHeightOfBeam() + beam.getSpaceBtwBeam());

    return delta_y;
};

/**
 * @constructor
 * @extends {ScoreLibrary.Renderer.Beam}
 */
ScoreLibrary.Renderer.TremoloBeam = function() {

    var supperclass = ScoreLibrary.Renderer.TremoloBeam.supperclass;

    supperclass.constructor.call(this, 'TremoloBeam');
};

ScoreLibrary.inherited(
    ScoreLibrary.Renderer.TremoloBeam,
    ScoreLibrary.Renderer.Beam);

ScoreLibrary.Renderer.TremoloBeam.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Renderer.TremoloBeam();

    var supperclass = ScoreLibrary.Renderer.TremoloBeam.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Renderer.TremoloBeam.prototype.draw = function(context) {

    var supperclass = ScoreLibrary.Renderer.TremoloBeam.supperclass;

    var beam = this.getModel();

    var tremolo_number = beam.getNumber();

    // !NOTE: beam number is not count in tremolo's number.
    for (var number = 1; number <= tremolo_number + 1; ++number) {

        beam.setNumber(number);

        supperclass.draw.call(this, context);
    }

    beam.setNumber(tremolo_number);
};

ScoreLibrary.Renderer.TremoloBeam.prototype.getMarginX = function() {

    return 5;
};

ScoreLibrary.Renderer.TremoloBeam.prototype.getX0OfBeam = function() {

    var supperclass = ScoreLibrary.Renderer.TremoloBeam.supperclass;

    return (supperclass.getX0OfBeam.call(this) + this.getMarginX());
};

ScoreLibrary.Renderer.TremoloBeam.prototype.getX1OfBeam = function() {

    var supperclass = ScoreLibrary.Renderer.TremoloBeam.supperclass;

    return (supperclass.getX1OfBeam.call(this) - this.getMarginX());
};

ScoreLibrary.Renderer.TremoloBeam.prototype.getY0OfBeam = function() {

    var supperclass = ScoreLibrary.Renderer.TremoloBeam.supperclass;

    var beam = this.getModel();

    var placement = beam.getPlacementNote();

    var radian = beam.getFarmostNoteToMe(placement).getBeamRadian();

    return (supperclass.getY0OfBeam.call(this) +
            this.getMarginX() * Math.tan(radian));
};

ScoreLibrary.Renderer.TremoloBeam.prototype.getY1OfBeam = function() {

    var supperclass = ScoreLibrary.Renderer.TremoloBeam.supperclass;

    var beam = this.getModel();

    var placement = beam.getPlacementNote();

    var radian = beam.getFarmostNoteToMe(placement).getBeamRadian();

    return (supperclass.getY1OfBeam.call(this) -
            this.getMarginX() * Math.tan(radian));
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
