goog.provide('ScoreLibrary.Score.Accent');
goog.provide('ScoreLibrary.Score.BreathMark');
goog.provide('ScoreLibrary.Score.Caesura');
goog.provide('ScoreLibrary.Score.DetachedLegato');
goog.provide('ScoreLibrary.Score.Doit');
goog.provide('ScoreLibrary.Score.Falloff');
goog.provide('ScoreLibrary.Score.Plop');
goog.provide('ScoreLibrary.Score.Scoop');
goog.provide('ScoreLibrary.Score.Staccatissimo');
goog.provide('ScoreLibrary.Score.Staccato');
goog.provide('ScoreLibrary.Score.StrongAccent');
goog.provide('ScoreLibrary.Score.Tenuto');
goog.require('ScoreLibrary.Renderer.Curve');
goog.require('ScoreLibrary.Score');
goog.require('ScoreLibrary.Score.GlyphAnchor');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Score.GlyphAnchor}
 */
ScoreLibrary.Score.Accent = function(number, information) {

    var supperclass = ScoreLibrary.Score.Accent.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.Accent,
    ScoreLibrary.Score.GlyphAnchor);

ScoreLibrary.Score.Accent.prototype.toString = function() {

    return 'Score.Accent';
};

ScoreLibrary.Score.Accent.prototype.toNodeString = function() {

    return 'accent';
};

ScoreLibrary.Score.Accent.prototype.getGlyphNames = function() {

    return ['scripts.sforzato'];
};

ScoreLibrary.Score.Accent.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.Accent(this.number, this.information);

    var supperclass = ScoreLibrary.Score.Accent.supperclass;

    return supperclass.clone.call(this, clone);
};

/**
 * @constructor
 * @extends {ScoreLibrary.Score.GlyphAnchor}
 */
ScoreLibrary.Score.StrongAccent = function(number, information) {

    var supperclass = ScoreLibrary.Score.StrongAccent.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.StrongAccent,
    ScoreLibrary.Score.GlyphAnchor);

ScoreLibrary.Score.StrongAccent.prototype.toString = function() {

    return 'Score.StrongAccent';
};

ScoreLibrary.Score.StrongAccent.prototype.toNodeString = function() {

    return 'strong-accent';
};

ScoreLibrary.Score.StrongAccent.prototype.getGlyphNames = function() {

    return [(this.getDirection() === 'upper' ?
            'scripts.umarcato' :
             'scripts.dmarcato')];
};

ScoreLibrary.Score.StrongAccent.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.StrongAccent(this.number, this.information);

    var supperclass = ScoreLibrary.Score.StrongAccent.supperclass;

    return supperclass.clone.call(this, clone);
};

/**
 * @constructor
 * @extends {ScoreLibrary.Score.GlyphAnchor}
 */
ScoreLibrary.Score.Staccato = function(number, information) {

    var supperclass = ScoreLibrary.Score.Staccato.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.Staccato,
    ScoreLibrary.Score.GlyphAnchor);

ScoreLibrary.Score.Staccato.prototype.toString = function() {

    return 'Score.Staccato';
};

ScoreLibrary.Score.Staccato.prototype.toNodeString = function() {

    return 'staccato';
};

ScoreLibrary.Score.Staccato.prototype.getGlyphNames = function() {

    return ['scripts.staccato'];
};

ScoreLibrary.Score.Staccato.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.Staccato(this.number, this.information);

    var supperclass = ScoreLibrary.Score.Staccato.supperclass;

    return supperclass.clone.call(this, clone);
};

/**
 * @constructor
 * @extends {ScoreLibrary.Score.GlyphAnchor}
 */
ScoreLibrary.Score.Tenuto = function(number, information) {

    var supperclass = ScoreLibrary.Score.Tenuto.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.Tenuto,
    ScoreLibrary.Score.GlyphAnchor);

ScoreLibrary.Score.Tenuto.prototype.toString = function() {

    return 'Score.Tenuto';
};

ScoreLibrary.Score.Tenuto.prototype.toNodeString = function() {

    return 'tenuto';
};

ScoreLibrary.Score.Tenuto.prototype.getGlyphNames = function() {

    return ['scripts.tenuto'];
};

ScoreLibrary.Score.Tenuto.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.Tenuto(this.number, this.information);

    var supperclass = ScoreLibrary.Score.Tenuto.supperclass;

    return supperclass.clone.call(this, clone);
};

/**
 * @constructor
 * @extends {ScoreLibrary.Score.GlyphAnchor}
 */
ScoreLibrary.Score.DetachedLegato = function(number, information) {

    var supperclass = ScoreLibrary.Score.DetachedLegato.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.DetachedLegato,
    ScoreLibrary.Score.GlyphAnchor);

ScoreLibrary.Score.DetachedLegato.prototype.toString = function() {

    return 'Score.DetachedLegato';
};

ScoreLibrary.Score.DetachedLegato.prototype.toNodeString = function() {

    return 'detached-legato';
};

ScoreLibrary.Score.DetachedLegato.prototype.getGlyphNames = function() {

    return [(this.getDirection() === 'upper' ?
             'scripts.dportato' :
             'scripts.uportato')];
};

ScoreLibrary.Score.DetachedLegato.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.DetachedLegato(this.number, this.information);

    var supperclass = ScoreLibrary.Score.DetachedLegato.supperclass;

    return supperclass.clone.call(this, clone);
};

/**
 * @constructor
 * @extends {ScoreLibrary.Score.GlyphAnchor}
 */
ScoreLibrary.Score.Staccatissimo = function(number, information) {

    var supperclass = ScoreLibrary.Score.Staccatissimo.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.Staccatissimo,
    ScoreLibrary.Score.GlyphAnchor);

ScoreLibrary.Score.Staccatissimo.prototype.toString = function() {

    return 'Score.Staccatissimo';
};

ScoreLibrary.Score.Staccatissimo.prototype.toNodeString = function() {

    return 'staccatissimo';
};

ScoreLibrary.Score.Staccatissimo.prototype.getGlyphNames = function() {

    return [(this.getDirection() === 'upper' ?
             'scripts.ustaccatissimo' :
             'scripts.dstaccatissimo')];
};

ScoreLibrary.Score.Staccatissimo.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.Staccatissimo(this.number, this.information);

    var supperclass = ScoreLibrary.Score.Staccatissimo.supperclass;

    return supperclass.clone.call(this, clone);
};

/**
 * @constructor
 * @extends {ScoreLibrary.Score.GlyphAnchor}
 */
ScoreLibrary.Score.BreathMark = function(number, information) {

    var supperclass = ScoreLibrary.Score.BreathMark.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.BreathMark,
    ScoreLibrary.Score.GlyphAnchor);

ScoreLibrary.Score.BreathMark.prototype.toString = function() {

    return 'Score.BreathMark';
};

ScoreLibrary.Score.BreathMark.prototype.toNodeString = function() {

    return 'breath-mark';
};

ScoreLibrary.Score.BreathMark.prototype.getGlyphNames = function() {

    return ['comma'];
};

ScoreLibrary.Score.BreathMark.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.BreathMark(this.number, this.information);

    var supperclass = ScoreLibrary.Score.BreathMark.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Score.BreathMark.prototype.getDirection = function() {

    return 'upper';
};

/**
 * @constructor
 * @extends {ScoreLibrary.Score.GlyphAnchor}
 */
ScoreLibrary.Score.Caesura = function(number, information) {

    var supperclass = ScoreLibrary.Score.Caesura.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.Caesura,
    ScoreLibrary.Score.GlyphAnchor);

ScoreLibrary.Score.Caesura.prototype.toString = function() {

    return 'Score.Caesura';
};

ScoreLibrary.Score.Caesura.prototype.toNodeString = function() {

    return 'caesura';
};

ScoreLibrary.Score.Caesura.prototype.getGlyphNames = function() {

    return ['scripts.caesura.curved'];
};

ScoreLibrary.Score.Caesura.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.Caesura(this.number, this.information);

    var supperclass = ScoreLibrary.Score.Caesura.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Score.Caesura.prototype.getDirection = function() {

    return 'upper';
};

/**
 * @constructor
 * @extends {ScoreLibrary.Score.Anchor}
 */
ScoreLibrary.Score.Scoop = function(number, information) {

    var supperclass = ScoreLibrary.Score.Scoop.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.Scoop,
    ScoreLibrary.Score.Anchor);

ScoreLibrary.Score.Scoop.prototype.toString = function() {

    return 'Score.Scoop';
};

ScoreLibrary.Score.Scoop.prototype.toNodeString = function() {

    return 'scoop';
};

ScoreLibrary.Score.Scoop.prototype.getCtrlFactor = function() {

    return this.ctrl_factor || 5;
};

ScoreLibrary.Score.Scoop.prototype.setCtrlFactor = function(factor) {

    this.ctrl_factor = factor;
};

ScoreLibrary.Score.Scoop.prototype.getDefaultWidth = function() {

    return (this.default_width !== undefined ? this.default_width : 18);
};

ScoreLibrary.Score.Scoop.prototype.setDefaultWidth = function(width) {

    this.default_width = width;
};

ScoreLibrary.Score.Scoop.prototype.setDefaultHeight = function(height) {

    this.default_height = height;
};

ScoreLibrary.Score.Scoop.prototype.getDefaultHeight = function() {

    return (this.default_height !== undefined ? this.default_height : 18);
};

ScoreLibrary.Score.Scoop.prototype.getYMove = function() {

    return - this.getDefaultHeight();
};

ScoreLibrary.Score.Scoop.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.Scoop(this.number, this.information);

    var supperclass = ScoreLibrary.Score.Scoop.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Score.Scoop.prototype.isWallerBlock = function() {

    return false;
};

ScoreLibrary.Score.Scoop.prototype.createRenderer = function() {

    var curve_renderer = new ScoreLibrary.Renderer.Curve(this);

    curve_renderer.setExplicit('width', this.getDefaultWidth());
    curve_renderer.setExplicit('height', this.getDefaultHeight());

    this.setRenderer(curve_renderer);

    return curve_renderer;
};

ScoreLibrary.Score.Scoop.prototype.getYMove = function() {

    return - this.getDefaultHeight();
};

/**
 * @constructor
 * @extends {ScoreLibrary.Score.Scoop}
 */
ScoreLibrary.Score.Plop = function(number, information) {

    var supperclass = ScoreLibrary.Score.Plop.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.Plop,
    ScoreLibrary.Score.Scoop);

ScoreLibrary.Score.Plop.prototype.toString = function() {

    return 'Score.Plop';
};

ScoreLibrary.Score.Plop.prototype.toNodeString = function() {

    return 'plop';
};

ScoreLibrary.Score.Plop.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.Plop(this.number, this.information);

    var supperclass = ScoreLibrary.Score.Plop.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Score.Plop.prototype.createRenderer = function() {

    var supperclass = ScoreLibrary.Score.Plop.supperclass;

    var plop_renderer = supperclass.createRenderer.call(this);

    var transformer =
        new ScoreLibrary.Renderer.PaintableTranslator(
            new ScoreLibrary.Renderer.PaintableMirror(plop_renderer, false),
            0, this.getDefaultHeight());

    transformer.transform();

    return plop_renderer;
};

ScoreLibrary.Score.Plop.prototype.getYMove = function() {

    return 0;
};

/**
 * @constructor
 * @extends {ScoreLibrary.Score.Scoop}
 */
ScoreLibrary.Score.Doit = function(number, information) {

    var supperclass = ScoreLibrary.Score.Doit.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.Doit,
    ScoreLibrary.Score.Scoop);

ScoreLibrary.Score.Doit.prototype.toString = function() {

    return 'Score.Doit';
};

ScoreLibrary.Score.Doit.prototype.toNodeString = function() {

    return 'doit';
};

ScoreLibrary.Score.Doit.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.Doit(this.number, this.information);

    var supperclass = ScoreLibrary.Score.Doit.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Score.Doit.prototype.createRenderer = function() {

    var supperclass = ScoreLibrary.Score.Doit.supperclass;

    var doit_renderer = supperclass.createRenderer.call(this);

    var transformer =
        new ScoreLibrary.Renderer.PaintableTranslator(
            new ScoreLibrary.Renderer.PaintableMirror(
                new ScoreLibrary.Renderer.PaintableMirror(doit_renderer, false),
                true), this.getDefaultWidth(), this.getDefaultHeight());

    transformer.transform();

    return doit_renderer;
};

ScoreLibrary.Score.Doit.prototype.getYMove = function() {

    return 0;
};

/**
 * @constructor
 * @extends {ScoreLibrary.Score.Scoop}
 */
ScoreLibrary.Score.Falloff = function(number, information) {

    var supperclass = ScoreLibrary.Score.Falloff.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.Falloff,
    ScoreLibrary.Score.Scoop);

ScoreLibrary.Score.Falloff.prototype.toString = function() {

    return 'Score.Falloff';
};

ScoreLibrary.Score.Falloff.prototype.toNodeString = function() {

    return 'falloff';
};

ScoreLibrary.Score.Falloff.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.Falloff(this.number, this.information);

    var supperclass = ScoreLibrary.Score.Falloff.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Score.Falloff.prototype.createRenderer = function() {

    var supperclass = ScoreLibrary.Score.Falloff.supperclass;

    var falloff_renderer = supperclass.createRenderer.call(this);

    var transformer =
        new ScoreLibrary.Renderer.PaintableTranslator(
            new ScoreLibrary.Renderer.PaintableMirror(
                falloff_renderer, true),
            this.getDefaultWidth(), 0);

    transformer.transform();

    return falloff_renderer;
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
