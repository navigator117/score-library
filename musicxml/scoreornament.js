goog.provide('ScoreLibrary.Score.DelayedInvertedTurn');
goog.provide('ScoreLibrary.Score.DelayedTurn');
goog.provide('ScoreLibrary.Score.InvertedMordent');
goog.provide('ScoreLibrary.Score.InvertedTurn');
goog.provide('ScoreLibrary.Score.Mordent');
goog.provide('ScoreLibrary.Score.Schleifer');
goog.provide('ScoreLibrary.Score.Shake');
goog.provide('ScoreLibrary.Score.TrillMark');
goog.provide('ScoreLibrary.Score.Turn');
goog.provide('ScoreLibrary.Score.VerticalTurn');
goog.provide('ScoreLibrary.Score.WavyLine');
goog.require('ScoreLibrary.Renderer.PaintableMirror');
goog.require('ScoreLibrary.Renderer.PaintableRotator');
goog.require('ScoreLibrary.Score');
goog.require('ScoreLibrary.Score.GlyphAnchor');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Score.GlyphAnchor}
 */
ScoreLibrary.Score.TrillMark = function(number, information) {

    var supperclass = ScoreLibrary.Score.TrillMark.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.TrillMark,
    ScoreLibrary.Score.GlyphAnchor);

ScoreLibrary.Score.TrillMark.prototype.toString = function() {

    return 'Score.TrillMark';
};

ScoreLibrary.Score.TrillMark.prototype.toNodeString = function() {

    return 'trill-mark';
};

ScoreLibrary.Score.TrillMark.prototype.getGlyphNames = function() {

    return ['scripts.trill'];
};

ScoreLibrary.Score.TrillMark.prototype.getDirection = function() {

    return 'upper';
};

ScoreLibrary.Score.TrillMark.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.TrillMark(this.number, this.information);

    var supperclass = ScoreLibrary.Score.TrillMark.supperclass;

    return supperclass.clone.call(this, clone);
};

/**
 * @constructor
 * @extends {ScoreLibrary.Score.GlyphAnchor}
 */
ScoreLibrary.Score.Turn = function(number, information) {

    var supperclass = ScoreLibrary.Score.Turn.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.Turn,
    ScoreLibrary.Score.GlyphAnchor);

ScoreLibrary.Score.Turn.prototype.toString = function() {

    return 'Score.Turn';
};

ScoreLibrary.Score.Turn.prototype.toNodeString = function() {

    return 'turn';
};

ScoreLibrary.Score.Turn.prototype.getGlyphNames = function() {

    return [(this.hasSlash() ? 'scripts.reverseturn' : 'scripts.turn')];
};

ScoreLibrary.Score.Turn.prototype.hasSlash = function() {

    return this.information.slash;
};

ScoreLibrary.Score.Turn.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.Turn(this.number, this.information);

    var supperclass = ScoreLibrary.Score.Turn.supperclass;

    return supperclass.clone.call(this, clone);
};

/**
 * @constructor
 * @extends {ScoreLibrary.Score.Turn}
 */
ScoreLibrary.Score.DelayedTurn = function(number, information) {

    var supperclass = ScoreLibrary.Score.DelayedTurn.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.DelayedTurn,
    ScoreLibrary.Score.Turn);

ScoreLibrary.Score.DelayedTurn.prototype.toString = function() {

    return 'Score.DelayedTurn';
};

ScoreLibrary.Score.DelayedTurn.prototype.toNodeString = function() {

    return 'delayed-turn';
};

ScoreLibrary.Score.DelayedTurn.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.DelayedTurn(this.number, this.information);

    var supperclass = ScoreLibrary.Score.DelayedTurn.supperclass;

    return supperclass.clone.call(this, clone);
};

/**
 * @constructor
 * @extends {ScoreLibrary.Score.Turn}
 */
ScoreLibrary.Score.InvertedTurn = function(number, information) {

    var supperclass = ScoreLibrary.Score.InvertedTurn.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.InvertedTurn,
    ScoreLibrary.Score.Turn);

ScoreLibrary.Score.InvertedTurn.prototype.toString = function() {

    return 'Score.InvertedTurn';
};

ScoreLibrary.Score.InvertedTurn.prototype.toNodeString = function() {

    return 'inverted-turn';
};

ScoreLibrary.Score.InvertedTurn.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.InvertedTurn(this.number, this.information);

    var supperclass = ScoreLibrary.Score.InvertedTurn.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Score.InvertedTurn.prototype.createRenderer = function(context) {

    var supperclass = ScoreLibrary.Score.InvertedTurn.supperclass;

    var turn_renderer =
        supperclass.createRenderer.call(this, context);

    if (turn_renderer) {

        var transformer =
            new ScoreLibrary.Renderer.PaintableMirror(
                turn_renderer, true);

        transformer.transform();
    }

    return turn_renderer;
};

/**
 * @constructor
 * @extends {ScoreLibrary.Score.InvertedTurn}
 */
ScoreLibrary.Score.DelayedInvertedTurn = function(number, information) {

    var supperclass = ScoreLibrary.Score.DelayedInvertedTurn.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.DelayedInvertedTurn,
    ScoreLibrary.Score.InvertedTurn);

ScoreLibrary.Score.DelayedInvertedTurn.prototype.toString = function() {

    return 'Score.DelayedInvertedTurn';
};

ScoreLibrary.Score.DelayedInvertedTurn.prototype.toNodeString = function() {

    return 'delayed-inverted-turn';
};

ScoreLibrary.Score.DelayedInvertedTurn.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.DelayedInvertedTurn(
            this.number, this.information);

    var supperclass = ScoreLibrary.Score.DelayedInvertedTurn.supperclass;

    return supperclass.clone.call(this, clone);
};

/**
 * @constructor
 * @extends {ScoreLibrary.Score.Turn}
 */
ScoreLibrary.Score.VerticalTurn = function(number, information) {

    var supperclass = ScoreLibrary.Score.VerticalTurn.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.VerticalTurn,
    ScoreLibrary.Score.Turn);

ScoreLibrary.Score.VerticalTurn.prototype.toString = function() {

    return 'Score.VerticalTurn';
};

ScoreLibrary.Score.VerticalTurn.prototype.toNodeString = function() {

    return 'vertical-turn';
};

ScoreLibrary.Score.VerticalTurn.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.VerticalTurn(this.number, this.information);

    var supperclass = ScoreLibrary.Score.VerticalTurn.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Score.VerticalTurn.prototype.createRenderer = function(context) {

    var supperclass = ScoreLibrary.Score.VerticalTurn.supperclass;

    var turn_renderer =
        supperclass.createRenderer.call(this, context);

    if (turn_renderer) {

        var transformer =
            new ScoreLibrary.Renderer.PaintableRotator(
                turn_renderer,
                Math.PI * 0.5);

        transformer.transform();
    }

    return turn_renderer;
};

/**
 * @constructor
 * @extends {ScoreLibrary.Score.GlyphAnchor}
 */
ScoreLibrary.Score.WavyLine = function(number, information) {

    var supperclass = ScoreLibrary.Score.WavyLine.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.WavyLine,
    ScoreLibrary.Score.GlyphAnchor);

ScoreLibrary.Score.WavyLine.prototype.toString = function() {

    return 'Score.WavyLine';
};

ScoreLibrary.Score.WavyLine.prototype.toNodeString = function() {

    return 'wavy-line';
};

ScoreLibrary.Score.WavyLine.prototype.isValidType = function(type) {

    return (/(start|continue|stop)/.test(type));
};

ScoreLibrary.Score.WavyLine.prototype.isBeginType = function(type) {

    return 'start' === type;
};

ScoreLibrary.Score.WavyLine.prototype.isEndType = function(type) {

    return 'stop' === type;
};

ScoreLibrary.Score.WavyLine.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.WavyLine(this.number, this.information);

    var supperclass = ScoreLibrary.Score.WavyLine.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Score.WavyLine.prototype.getType = function() {

    return this.information.type;
};

ScoreLibrary.Score.WavyLine.prototype.getDirection = function() {

    return 'upper';
};

ScoreLibrary.Score.WavyLine.prototype.getGlyphNames = function() {

    return ['scripts.trill', 'scripts.trill_element'];
};

ScoreLibrary.Score.WavyLine.prototype.prepareEngrave =
    function(staff_stream, extra_space) {

    var notes = this.getNotes();

    var note0_renderer = notes[0].getRenderer();
    var note1_renderer = notes[notes.length - 1].getRenderer();

    var note0_x =
        staff_stream.calcChildOffset(
            note0_renderer, extra_space);

    var note1_x =
        staff_stream.calcChildOffset(
            note1_renderer, extra_space);

    this.wavyline_length = note1_x - note0_x;

    var supperclass = ScoreLibrary.Score.WavyLine.supperclass;

    return supperclass.prepareEngrave.call(
        this, staff_stream, extra_space);
};

ScoreLibrary.Score.WavyLine.prototype.createRenderer = function(context) {

    var supperclass = ScoreLibrary.Score.WavyLine.supperclass;

    var wavyline_renderer =
        supperclass.createRenderer.call(this, context, true);

    if (wavyline_renderer) {

        var requisite_width =
            wavyline_renderer.getRequisite('width');

        var trill_element =
            wavyline_renderer.getChild(
                wavyline_renderer.getChildCount() - 1);

        var trill_element_width =
            trill_element.getRequisite('width');

        var more_trill_element =
            ((this.wavyline_length - requisite_width) /
             trill_element_width);

        for (var i = 0; i <= more_trill_element; ++i) {

            var glyph = trill_element.clone();

            var obox = glyph.getOutlineBoundbox();

            var fix_org_coord = 'glyph_anchor';

            glyph.setOrg(fix_org_coord, 'y', obox.y_min);

            wavyline_renderer.pack(
                glyph, false, false, 0, 0, fix_org_coord);
        }
    }

    return wavyline_renderer;
};

/**
 * @constructor
 * @extends {ScoreLibrary.Score.GlyphAnchor}
 */
ScoreLibrary.Score.Shake = function(number, information) {

    var supperclass = ScoreLibrary.Score.Shake.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.Shake,
    ScoreLibrary.Score.GlyphAnchor);

ScoreLibrary.Score.Shake.prototype.toString = function() {

    return 'Score.Shake';
};

ScoreLibrary.Score.Shake.prototype.toNodeString = function() {

    return 'shake';
};

ScoreLibrary.Score.Shake.prototype.getGlyphNames = function() {

    return ['scripts.prallprall'];
};

ScoreLibrary.Score.Shake.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.Shake(this.number, this.information);

    var supperclass = ScoreLibrary.Score.Shake.supperclass;

    return supperclass.clone.call(this, clone);
};

/**
 * @constructor
 * @extends {ScoreLibrary.Score.GlyphAnchor}
 */
ScoreLibrary.Score.Mordent = function(number, information) {

    var supperclass = ScoreLibrary.Score.Mordent.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.Mordent,
    ScoreLibrary.Score.GlyphAnchor);

ScoreLibrary.Score.Mordent.prototype.toString = function() {

    return 'Score.Mordent';
};

ScoreLibrary.Score.Mordent.prototype.toNodeString = function() {

    return 'mordent';
};

ScoreLibrary.Score.Mordent.prototype.getGlyphNames = function() {

    var glyph_name = 'scripts.';

    if (this.isLongMordent()) {

        switch (this.getApproach()) {

        case 'above': {

            glyph_name += 'down';
        } break;

        case 'below': {

            glyph_name += 'up';
        } break;

        default: {

            glyph_name += 'prall';
        } break;
        }
    }

    glyph_name += 'mordent';

    return [glyph_name];
};

ScoreLibrary.Score.Mordent.prototype.isLongMordent = function() {

    return this.information.long_mordent;
};

ScoreLibrary.Score.Mordent.prototype.getApproach = function() {

    return this.information.approach;
};

ScoreLibrary.Score.Mordent.prototype.getDeparture = function() {

    return this.information.departure;
};

ScoreLibrary.Score.Mordent.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.Mordent(this.number, this.information);

    var supperclass = ScoreLibrary.Score.Mordent.supperclass;

    return supperclass.clone.call(this, clone);
};

/**
 * @constructor
 * @extends {ScoreLibrary.Score.Mordent}
 */
ScoreLibrary.Score.InvertedMordent = function(number, information) {

    var supperclass = ScoreLibrary.Score.InvertedMordent.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.InvertedMordent,
    ScoreLibrary.Score.Mordent);

ScoreLibrary.Score.InvertedMordent.prototype.toString = function() {

    return 'Score.InvertedMordent';
};

ScoreLibrary.Score.InvertedMordent.prototype.toNodeString = function() {

    return 'inverted-mordent';
};

ScoreLibrary.Score.InvertedMordent.prototype.getGlyphNames = function() {

    var glyph_name = 'scripts.';

    if (this.isLongMordent()) {

        if (this.getApproach() === 'above') {

            glyph_name += 'down';
        }
        else if (this.getApproach() === 'below') {

            glyph_name += 'up';
        }
    }

    glyph_name += 'prall';

    if (this.isLongMordent() &&
        !this.getApproach() &&
        this.getDeparture()) {

        if (this.getDeparture() === 'above') {

            glyph_name += 'up';
        }

        if (this.getDeparture() === 'below') {

            glyph_name += 'down';
        }
    }

    if (this.isLongMordent() &&
        !this.getApproach() &&
        !this.getDeparture()) {

        glyph_name += 'prall';
    }

    return [glyph_name];
};

ScoreLibrary.Score.InvertedMordent.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.InvertedMordent(this.number, this.information);

    var supperclass = ScoreLibrary.Score.InvertedMordent.supperclass;

    return supperclass.clone.call(this, clone);
};

/**
 * @constructor
 * @extends {ScoreLibrary.Score.GlyphAnchor}
 */
ScoreLibrary.Score.Schleifer = function(number, information) {

    var supperclass = ScoreLibrary.Score.Schleifer.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.Schleifer,
    ScoreLibrary.Score.GlyphAnchor);

ScoreLibrary.Score.Schleifer.prototype.toString = function() {

    return 'Score.Schleifer';
};

ScoreLibrary.Score.Schleifer.prototype.toNodeString = function() {

    return 'schleifer';
};

ScoreLibrary.Score.Schleifer.prototype.getGlyphNames = function() {

    // !FIXME: schleifer is not exist!
    return ['scripts.upprall'];
};

ScoreLibrary.Score.Schleifer.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.Schleifer(this.number, this.information);

    var supperclass = ScoreLibrary.Score.Schleifer.supperclass;

    return supperclass.clone.call(this, clone);
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
