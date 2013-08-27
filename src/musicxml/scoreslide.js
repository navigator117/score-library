goog.provide('ScoreLibrary.Score.Glissando');
goog.provide('ScoreLibrary.Score.Slide');
goog.require('ScoreLibrary.Renderer.Slide');
goog.require('ScoreLibrary.Score');
goog.require('ScoreLibrary.Score.Anchor');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Score.Anchor}
 */
ScoreLibrary.Score.Slide = function(number, information) {

    var supperclass = ScoreLibrary.Score.Slide.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.Slide,
    ScoreLibrary.Score.Anchor);

ScoreLibrary.Score.Slide.prototype.toString = function() {

    return 'Score.Slide';
};

ScoreLibrary.Score.Slide.prototype.toNodeString = function() {

    return 'slide';
};

ScoreLibrary.Score.Slide.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.Slide(this.number, this.information);

    var supperclass = ScoreLibrary.Score.Slide.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Score.Slide.prototype.isValidType = function(type) {

    return (/(start|stop)/.test(type));
};

ScoreLibrary.Score.Slide.prototype.isBeginType = function(type) {

    return 'start' === type;
};

ScoreLibrary.Score.Slide.prototype.isEndType = function(type) {

    return 'stop' === type;
};

ScoreLibrary.Score.Slide.prototype.getLineType = function() {

    return this.information.line_type;
};

ScoreLibrary.Score.Slide.prototype.getText = function() {

    return this.information.text;
};

ScoreLibrary.Score.Slide.prototype.isWallerBlock = function() {

    return false;
};

ScoreLibrary.Score.Slide.prototype.getDirection = function() {

    var notes = this.getNotes();

    return (notes[0].getStemDirection() ===
            ScoreLibrary.Renderer.Note.StemDirection.Up ?
            'lower' : 'upper');
};

ScoreLibrary.Score.Slide.prototype.createRenderer = function() {

    var slide_renderer = new ScoreLibrary.Renderer.Slide();

    this.setRenderer(slide_renderer);

    return slide_renderer;
};

/**
 * @constructor
 * @extends {ScoreLibrary.Score.Slide}
 */
ScoreLibrary.Score.Glissando = function(number, information) {

    var supperclass = ScoreLibrary.Score.Glissando.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.Glissando,
    ScoreLibrary.Score.Slide);

ScoreLibrary.Score.Glissando.prototype.toString = function() {

    return 'Score.Glissando';
};

ScoreLibrary.Score.Glissando.prototype.toNodeString = function() {

    return 'glissando';
};

ScoreLibrary.Score.Glissando.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.Glissando(this.number, this.information);

    var supperclass = ScoreLibrary.Score.Glissando.supperclass;

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
