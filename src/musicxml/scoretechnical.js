goog.provide('ScoreLibrary.Score.BendList');
goog.provide('ScoreLibrary.Score.DoubleTongue');
goog.provide('ScoreLibrary.Score.DownBow');
goog.provide('ScoreLibrary.Score.Fingering');
goog.provide('ScoreLibrary.Score.Fret');
goog.provide('ScoreLibrary.Score.HammerOn');
goog.provide('ScoreLibrary.Score.Harmonic');
goog.provide('ScoreLibrary.Score.Heel');
goog.provide('ScoreLibrary.Score.OpenString');
goog.provide('ScoreLibrary.Score.Pluck');
goog.provide('ScoreLibrary.Score.PullOff');
goog.provide('ScoreLibrary.Score.SnapPizzicato');
goog.provide('ScoreLibrary.Score.Stopped');
goog.provide('ScoreLibrary.Score.String');
goog.provide('ScoreLibrary.Score.Tap');
goog.provide('ScoreLibrary.Score.ThumbPosition');
goog.provide('ScoreLibrary.Score.Toe');
goog.provide('ScoreLibrary.Score.TripleTongue');
goog.provide('ScoreLibrary.Score.UpBow');
goog.require('ScoreLibrary.Score');
goog.require('ScoreLibrary.Score.Doit');
goog.require('ScoreLibrary.Score.Falloff');
goog.require('ScoreLibrary.Score.GlyphAnchor');
goog.require('ScoreLibrary.Score.Slur');
goog.require('ScoreLibrary.Score.TextAnchor');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Score.GlyphAnchor}
 */
ScoreLibrary.Score.UpBow = function(number, information) {

    var supperclass = ScoreLibrary.Score.UpBow.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.UpBow,
    ScoreLibrary.Score.GlyphAnchor);

ScoreLibrary.Score.UpBow.prototype.toString = function() {

    return 'Score.UpBow';
};

ScoreLibrary.Score.UpBow.prototype.toNodeString = function() {

    return 'up-bow';
};

ScoreLibrary.Score.UpBow.prototype.getGlyphNames = function() {

    return ['scripts.upbow'];
};

ScoreLibrary.Score.UpBow.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.UpBow(this.number, this.information);

    var supperclass = ScoreLibrary.Score.UpBow.supperclass;

    return supperclass.clone.call(this, clone);
};

/**
 * @constructor
 * @extends {ScoreLibrary.Score.GlyphAnchor}
 */
ScoreLibrary.Score.DownBow = function(number, information) {

    var supperclass = ScoreLibrary.Score.DownBow.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.DownBow,
    ScoreLibrary.Score.GlyphAnchor);

ScoreLibrary.Score.DownBow.prototype.toString = function() {

    return 'Score.DownBow';
};

ScoreLibrary.Score.DownBow.prototype.toNodeString = function() {

    return 'down-bow';
};

ScoreLibrary.Score.DownBow.prototype.getGlyphNames = function() {

    return ['scripts.downbow'];
};

ScoreLibrary.Score.DownBow.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.DownBow(this.number, this.information);

    var supperclass = ScoreLibrary.Score.DownBow.supperclass;

    return supperclass.clone.call(this, clone);
};

/**
 * @constructor
 * @extends {ScoreLibrary.Score.GlyphAnchor}
 */
ScoreLibrary.Score.Harmonic = function(number, information) {

    var supperclass = ScoreLibrary.Score.Harmonic.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.Harmonic,
    ScoreLibrary.Score.GlyphAnchor);

ScoreLibrary.Score.Harmonic.prototype.toString = function() {

    return 'Score.Harmonic';
};

ScoreLibrary.Score.Harmonic.prototype.toNodeString = function() {

    return 'harmonic';
};

ScoreLibrary.Score.Harmonic.prototype.getGlyphNames = function() {

    return ['scripts.flageolet'];
};

ScoreLibrary.Score.Harmonic.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.Harmonic(this.number, this.information);

    var supperclass = ScoreLibrary.Score.Harmonic.supperclass;

    return supperclass.clone.call(this, clone);
};

/**
 * @constructor
 * @extends {ScoreLibrary.Score.GlyphAnchor}
 */
ScoreLibrary.Score.OpenString = function(number, information) {

    var supperclass = ScoreLibrary.Score.OpenString.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.OpenString,
    ScoreLibrary.Score.GlyphAnchor);

ScoreLibrary.Score.OpenString.prototype.toString = function() {

    return 'Score.OpenString';
};

ScoreLibrary.Score.OpenString.prototype.toNodeString = function() {

    return 'open-string';
};

ScoreLibrary.Score.OpenString.prototype.getGlyphNames = function() {

    return ['scripts.open'];
};

ScoreLibrary.Score.OpenString.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.OpenString(this.number, this.information);

    var supperclass = ScoreLibrary.Score.OpenString.supperclass;

    return supperclass.clone.call(this, clone);
};

/**
 * @constructor
 * @extends {ScoreLibrary.Score.GlyphAnchor}
 */
ScoreLibrary.Score.ThumbPosition = function(number, information) {

    var supperclass = ScoreLibrary.Score.ThumbPosition.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.ThumbPosition,
    ScoreLibrary.Score.GlyphAnchor);

ScoreLibrary.Score.ThumbPosition.prototype.toString = function() {

    return 'Score.ThumbPosition';
};

ScoreLibrary.Score.ThumbPosition.prototype.toNodeString = function() {

    return 'thumb-position';
};

ScoreLibrary.Score.ThumbPosition.prototype.getGlyphNames = function() {

    return ['scripts.thumb'];
};

ScoreLibrary.Score.ThumbPosition.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.ThumbPosition(this.number, this.information);

    var supperclass = ScoreLibrary.Score.ThumbPosition.supperclass;

    return supperclass.clone.call(this, clone);
};

/**
 * @constructor
 * @extends {ScoreLibrary.Score.TextAnchor}
 */
ScoreLibrary.Score.Pluck = function(number, information) {

    var supperclass = ScoreLibrary.Score.Pluck.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.Pluck,
    ScoreLibrary.Score.TextAnchor);

ScoreLibrary.Score.Pluck.prototype.toString = function() {

    return 'Score.Pluck';
};

ScoreLibrary.Score.Pluck.prototype.toNodeString = function() {

    return 'pluck';
};

ScoreLibrary.Score.Pluck.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.Pluck(this.number, this.information);

    var supperclass = ScoreLibrary.Score.Pluck.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Score.Pluck.prototype.getFont = function(context) {

    return 'italic 12px sans-serif';
};

/**
 * @constructor
 * @extends {ScoreLibrary.Score.TextAnchor}
 */
ScoreLibrary.Score.Fingering = function(number, information) {

    var supperclass = ScoreLibrary.Score.Fingering.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.Fingering,
    ScoreLibrary.Score.TextAnchor);

ScoreLibrary.Score.Fingering.prototype.toString = function() {

    return 'Score.Fingering';
};

ScoreLibrary.Score.Fingering.prototype.toNodeString = function() {

    return 'fingering';
};

ScoreLibrary.Score.Fingering.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.Fingering(this.number, this.information);

    var supperclass = ScoreLibrary.Score.Fingering.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Score.Fingering.prototype.getFont =
    ScoreLibrary.Score.Pluck.prototype.getFont;

ScoreLibrary.Score.Fingering.prototype.getSubstitution = function() {

    return this.information.substitution;
};

ScoreLibrary.Score.Fingering.prototype.getAlternate = function() {

    return this.information.alternate;
};

/**
 * @constructor
 * @extends {ScoreLibrary.Score.TextAnchor}
 */
ScoreLibrary.Score.Fret = function(number, information) {

    var supperclass = ScoreLibrary.Score.Fret.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.Fret,
    ScoreLibrary.Score.TextAnchor);

ScoreLibrary.Score.Fret.prototype.toString = function() {

    return 'Score.Fret';
};

ScoreLibrary.Score.Fret.prototype.toNodeString = function() {

    return 'fret';
};

ScoreLibrary.Score.Fret.prototype.getDirection = function() {

    return 'upper';
};

ScoreLibrary.Score.Fret.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.Fret(this.number, this.information);

    var supperclass = ScoreLibrary.Score.Fret.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Score.Fret.prototype.getFont = function(context) {

    return 'bold 12px sans-serif';
};

ScoreLibrary.Score.Fret.prototype.getRealNote = function() {

    return this.information.real_note;
};

ScoreLibrary.Score.Fret.prototype.createRenderer = function(context) {

    var renderer =
        new ScoreLibrary.Renderer.Fret(this);

    renderer.getTextBox(context);

    this.setRenderer(renderer);

    return renderer;
};

/**
 * @constructor
 * @extends {ScoreLibrary.Score.String}
 */
ScoreLibrary.Score.String = function(number, information) {

    var supperclass = ScoreLibrary.Score.String.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.String,
    ScoreLibrary.Score.TextAnchor);

ScoreLibrary.Score.String.prototype.toString = function() {

    return 'Score.String';
};

ScoreLibrary.Score.String.prototype.toNodeString = function() {

    return 'string';
};

ScoreLibrary.Score.String.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.String(this.number, this.information);

    var supperclass = ScoreLibrary.Score.String.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Score.String.prototype.getFont =
    ScoreLibrary.Score.Pluck.prototype.getFont;

/**
 * @constructor
 * @extends {ScoreLibrary.Score.GlyphAnchor}
 */
ScoreLibrary.Score.DoubleTongue = function(number, information) {

    var supperclass = ScoreLibrary.Score.DoubleTongue.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.DoubleTongue,
    ScoreLibrary.Score.GlyphAnchor);

ScoreLibrary.Score.DoubleTongue.prototype.toString = function() {

    return 'Score.DoubleTongue';
};

ScoreLibrary.Score.DoubleTongue.prototype.toNodeString = function() {

    return 'double-tongue';
};

ScoreLibrary.Score.DoubleTongue.prototype.getGlyphNames = function() {

    return ['dots.dot', 'dots.dot'];
};

ScoreLibrary.Score.DoubleTongue.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.DoubleTongue(this.number, this.information);

    var supperclass = ScoreLibrary.Score.DoubleTongue.supperclass;

    return supperclass.clone.call(this, clone);
};

/**
 * @constructor
 * @extends {ScoreLibrary.Score.GlyphAnchor}
 */
ScoreLibrary.Score.TripleTongue = function(number, information) {

    var supperclass = ScoreLibrary.Score.TripleTongue.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.TripleTongue,
    ScoreLibrary.Score.GlyphAnchor);

ScoreLibrary.Score.TripleTongue.prototype.toString = function() {

    return 'Score.TripleTongue';
};

ScoreLibrary.Score.TripleTongue.prototype.toNodeString = function() {

    return 'triple-tongue';
};

ScoreLibrary.Score.TripleTongue.prototype.getGlyphNames = function() {

    return ['dots.dot', 'dots.dot', 'dots.dot'];
};

ScoreLibrary.Score.TripleTongue.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.TripleTongue(this.number, this.information);

    var supperclass = ScoreLibrary.Score.TripleTongue.supperclass;

    return supperclass.clone.call(this, clone);
};

/**
 * @constructor
 * @extends {ScoreLibrary.Score.GlyphAnchor}
 */
ScoreLibrary.Score.Stopped = function(number, information) {

    var supperclass = ScoreLibrary.Score.Stopped.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.Stopped,
    ScoreLibrary.Score.GlyphAnchor);

ScoreLibrary.Score.Stopped.prototype.toString = function() {

    return 'Score.Stopped';
};

ScoreLibrary.Score.Stopped.prototype.toNodeString = function() {

    return 'stopped';
};

ScoreLibrary.Score.Stopped.prototype.getGlyphNames = function() {

    return ['scripts.stopped'];
};

ScoreLibrary.Score.Stopped.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.Stopped(this.number, this.information);

    var supperclass = ScoreLibrary.Score.Stopped.supperclass;

    return supperclass.clone.call(this, clone);
};

/**
 * @constructor
 * @extends {ScoreLibrary.Score.GlyphAnchor}
 */
ScoreLibrary.Score.SnapPizzicato = function(number, information) {

    var supperclass = ScoreLibrary.Score.SnapPizzicato.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.SnapPizzicato,
    ScoreLibrary.Score.GlyphAnchor);

ScoreLibrary.Score.SnapPizzicato.prototype.toString = function() {

    return 'Score.SnapPizzicato';
};

ScoreLibrary.Score.SnapPizzicato.prototype.toNodeString = function() {

    return 'snap-pizzicato';
};

ScoreLibrary.Score.SnapPizzicato.prototype.getGlyphNames = function() {

    return ['scripts.snappizzicato'];
};

ScoreLibrary.Score.SnapPizzicato.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.SnapPizzicato(this.number, this.information);

    var supperclass = ScoreLibrary.Score.SnapPizzicato.supperclass;

    return supperclass.clone.call(this, clone);
};

/**
 * @constructor
 * @extends {ScoreLibrary.Score.TextAnchor}
 */
ScoreLibrary.Score.Tap = function(number, information) {

    var supperclass = ScoreLibrary.Score.Tap.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.Tap,
    ScoreLibrary.Score.TextAnchor);

ScoreLibrary.Score.Tap.prototype.toString = function() {

    return 'Score.Tap';
};

ScoreLibrary.Score.Tap.prototype.getDirection = function() {

    return 'upper';
};

ScoreLibrary.Score.Tap.prototype.toNodeString = function() {

    return 'tap';
};

ScoreLibrary.Score.Tap.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.Tap(this.number, this.information);

    var supperclass = ScoreLibrary.Score.Tap.supperclass;

    return supperclass.clone.call(this, clone);
};

/**
 * @constructor
 * @extends {ScoreLibrary.Score.GlyphAnchor}
 */
ScoreLibrary.Score.Heel = function(number, information) {

    var supperclass = ScoreLibrary.Score.Heel.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.Heel,
    ScoreLibrary.Score.GlyphAnchor);

ScoreLibrary.Score.Heel.prototype.toString = function() {

    return 'Score.Heel';
};

ScoreLibrary.Score.Heel.prototype.toNodeString = function() {

    return 'heel';
};

ScoreLibrary.Score.Heel.prototype.getDirection = function() {

    return 'upper';
};

ScoreLibrary.Score.Heel.prototype.getGlyphNames = function() {

    var glyph_name = 'scripts.';

    glyph_name += (this.getDirection() === 'upper' ? 'u' : 'd');
    glyph_name += 'pedalheel';

    return [glyph_name];
};

ScoreLibrary.Score.Heel.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.Heel(this.number, this.information);

    var supperclass = ScoreLibrary.Score.Heel.supperclass;

    return supperclass.clone.call(this, clone);
};

/**
 * @constructor
 * @extends {ScoreLibrary.Score.GlyphAnchor}
 */
ScoreLibrary.Score.Toe = function(number, information) {

    var supperclass = ScoreLibrary.Score.Toe.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.Toe,
    ScoreLibrary.Score.GlyphAnchor);

ScoreLibrary.Score.Toe.prototype.toString = function() {

    return 'Score.Toe';
};

ScoreLibrary.Score.Toe.prototype.toNodeString = function() {

    return 'toe';
};

ScoreLibrary.Score.Toe.prototype.getDirection = function() {

    return 'upper';
};

ScoreLibrary.Score.Toe.prototype.getGlyphNames = function() {

    var glyph_name = 'scripts.';

    glyph_name += (this.getDirection() === 'upper' ? 'u' : 'd');
    glyph_name += 'pedaltoe';

    return [glyph_name];
};

ScoreLibrary.Score.Toe.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.Toe(this.number, this.information);

    var supperclass = ScoreLibrary.Score.Toe.supperclass;

    return supperclass.clone.call(this, clone);
};

/**
 * @constructor
 * @extends {ScoreLibrary.Score.Slur}
 */
ScoreLibrary.Score.HammerOn = function(number, information) {

    var supperclass = ScoreLibrary.Score.HammerOn.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.HammerOn,
    ScoreLibrary.Score.Slur);

ScoreLibrary.Score.HammerOn.prototype.toString = function() {

    return 'Score.HammerOn';
};

ScoreLibrary.Score.HammerOn.prototype.toNodeString = function() {

    return 'hammer-on';
};

ScoreLibrary.Score.HammerOn.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.HammerOn(this.number, this.information);

    var supperclass = ScoreLibrary.Score.HammerOn.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Score.HammerOn.prototype.getText = function() {

    return this.information.text;
};

ScoreLibrary.Score.HammerOn.prototype.getRealNote =
    ScoreLibrary.Score.Fret.prototype.getRealNote;

/**
 * @constructor
 * @extends {ScoreLibrary.Score.HammerOn}
 */
ScoreLibrary.Score.PullOff = function(number, information) {

    var supperclass = ScoreLibrary.Score.PullOff.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.PullOff,
    ScoreLibrary.Score.HammerOn);

ScoreLibrary.Score.PullOff.prototype.toString = function() {

    return 'Score.PullOff';
};

ScoreLibrary.Score.PullOff.prototype.toNodeString = function() {

    return 'pull-off';
};

ScoreLibrary.Score.PullOff.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.PullOff(this.number, this.information);

    var supperclass = ScoreLibrary.Score.PullOff.supperclass;

    return supperclass.clone.call(this, clone);
};

/**
 * @constructor
 * @extends {ScoreLibrary.Score.Anchor}
 */
ScoreLibrary.Score.BendList = function(number, information) {

    var supperclass = ScoreLibrary.Score.BendList.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.BendList,
    ScoreLibrary.Score.Anchor);

ScoreLibrary.Score.BendList.prototype.toString = function() {

    return 'Score.Bend';
};

ScoreLibrary.Score.BendList.prototype.toNodeString = function() {

    return 'bend';
};

ScoreLibrary.Score.BendList.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.BendList(this.number, this.information);

    var supperclass = ScoreLibrary.Score.BendList.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Score.BendList.prototype.getBends = function() {

    return this.information.bend_list;
};

ScoreLibrary.Score.BendList.prototype.getYMove = function() {

    var fix_org_coord = 'bendlist';

    return this.renderer.getOrg(fix_org_coord, 'y');
};

ScoreLibrary.Score.BendList.prototype.createRenderer = function(context) {

    var glyph_factory =
        context.getCustomTextRenderer().getGlyphFactory();

    var bends_renderer = undefined;

    var bends = this.getBends();
    if (bends && bends.length > 0) {

        bends_renderer =
            new ScoreLibrary.Renderer.HBoxGlyph('BendList');

        var fix_org_coord = 'bendlist';

        bends_renderer.setOrg(fix_org_coord, 'x', 0);
        bends_renderer.setOrg(fix_org_coord, 'y', 0);

        var movement = {

            x: 0,
            y: 0
        };

        bends.forEach(

            function(bend, index, bends) {

                var curve_glyph =
                    this.packCurve(bend, movement, bends_renderer);

                if (bend.bend_alter && curve_glyph) {

                    var arrow_glyph =
                        this.packArrow(
                            bend, movement, bends_renderer, glyph_factory);

                    if (arrow_glyph) {

                        this.packTexts(
                            bend, movement, arrow_glyph,
                            bends_renderer, context);
                    }
                }
            }, this);
    }

    this.setRenderer(bends_renderer);

    return bends_renderer;
};

ScoreLibrary.Score.BendList.prototype.packCurve =
    function(bend, movement, bends_renderer) {

        var upward = !bend.release;

        var curve = (upward ?
                     new ScoreLibrary.Score.Doit() :
                     new ScoreLibrary.Score.Falloff());

        if (bend.pre_bend) {

            curve.setDefaultWidth(0);
        }
        else if (!bend.bend_alter) {

            curve.setDefaultHeight(0);
        }

        var curve_glyph = curve.createRenderer();
        if (curve_glyph) {

            var fix_org_coord = 'bendlist';

            var y = movement.y + curve.getYMove();

            curve_glyph.setOrg(fix_org_coord, 'x', movement.x);
            curve_glyph.setOrg(fix_org_coord, 'y', y);

            bends_renderer.pack(curve_glyph, false, false, 0, 0, fix_org_coord);

            movement.y += (upward ? 1 : -1) * curve.getDefaultHeight();
            movement.x += curve.getDefaultWidth();
        }

        return curve_glyph;
    };

ScoreLibrary.Score.BendList.prototype.packArrow =
    function(bend, movement, bends_renderer, glyph_factory) {

        var upward = !bend.release;

        var requisite_height = 8;

        var arrow_glyph =
            glyph_factory.createByName(
                (upward ? 'arrowheads.close.11' : 'arrowheads.close.1M1'),
                undefined,
                requisite_height);

        if (arrow_glyph) {

            var requisite_width =
                arrow_glyph.getRequisite('width');

            var fix_org_coord = 'bendlist';

            arrow_glyph.setOrg(
                fix_org_coord, 'x', movement.x - requisite_width * 0.5);

            arrow_glyph.setOrg(
                fix_org_coord, 'y',
                (upward ? movement.y : movement.y - requisite_height));

            bends_renderer.pack(
                arrow_glyph, false, false, 0, 0, fix_org_coord);
        }

        return arrow_glyph;
    };

ScoreLibrary.Score.BendList.prototype.getBendAlterTexts = function(alter) {

    var texts = {

        inter: undefined,
        micro: undefined
    };

    var inter_alter = Math.floor(alter);
    if (inter_alter) {

        texts.inter =
            inter_alter.toString();
    }

    var micro_alter = alter - inter_alter;
    if (micro_alter) {

        texts.micro = '1/2';
    }

    if (inter_alter === 1 && !micro_alter) {

        texts.inter = 'full';
    }

    return texts;
};

ScoreLibrary.Score.BendList.prototype.packTexts =
    function(bend, movement, arrow_glyph, bends_renderer, context) {

        var upward = !bend.release;

        var texts = this.getBendAlterTexts(bend.bend_alter);

        var requisite_height_arrow = arrow_glyph.getRequisite('height');

        var fix_org_coord = 'bendlist';

        var textbox_inter = undefined;
        var requisite_width_inter = undefined;
        var requisite_height_inter = undefined;

        if (texts.inter) {

            textbox_inter =
                new ScoreLibrary.Renderer.TextBox('center');

            textbox_inter.setText(
                texts.inter, '12px sans-serif', context);

            requisite_width_inter = textbox_inter.getRequisite('width');
            requisite_height_inter = textbox_inter.getRequisite('height');
        }

        var textbox_micro = undefined;
        var requisite_width_micro = undefined;
        var requisite_height_micro = undefined;

        if (texts.micro) {

            textbox_micro =
                new ScoreLibrary.Renderer.TextBox('center');

            textbox_micro.setText(
                texts.micro, 'normal 8px sans-serif', context);

            requisite_width_micro = textbox_micro.getRequisite('width');
            requisite_height_micro = textbox_micro.getRequisite('height');
        }

        var y = movement.y;

        if (upward) {

            y += requisite_height_arrow;
        }
        else {

            y -= requisite_height_arrow;
        }

        var x = movement.x;

        if (requisite_width_inter !== undefined &&
            requisite_height_inter !== undefined) {

            x -= requisite_width_inter * 0.5;

            if (!upward) {

                y -= requisite_height_inter;
            }
        }

        if (requisite_width_micro !== undefined &&
            requisite_height_micro !== undefined) {

            x -= requisite_width_micro * 0.5;

            if (!upward) {

                y -= requisite_height_micro;
            }
        }

        if (textbox_inter) {

            textbox_inter.setOrg(fix_org_coord, 'x', x);
            textbox_inter.setOrg(fix_org_coord, 'y', y);

            bends_renderer.pack(
                textbox_inter, false, false, 0, 0, fix_org_coord);
        }

        if (requisite_width_inter !== undefined) {

            x += requisite_width_inter;
        }

        if (textbox_micro) {

            y += 2;

            textbox_micro.setOrg(fix_org_coord, 'x', x);
            textbox_micro.setOrg(fix_org_coord, 'y', y);

            bends_renderer.pack(
                textbox_micro, false, false, 0, 0, fix_org_coord);
        }
    };

ScoreLibrary.Score.BendList.prototype.getRealNote =
    ScoreLibrary.Score.Fret.prototype.getRealNote;
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
