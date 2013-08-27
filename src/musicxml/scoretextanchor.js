goog.provide('ScoreLibrary.Score.TextAnchor');
goog.require('ScoreLibrary.Renderer.TextAnchor');
goog.require('ScoreLibrary.Score');
goog.require('ScoreLibrary.Score.Anchor');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Score.Anchor}
 */
ScoreLibrary.Score.TextAnchor = function(number, information) {

    var supperclass = ScoreLibrary.Score.TextAnchor.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.TextAnchor,
    ScoreLibrary.Score.Anchor);

ScoreLibrary.Score.TextAnchor.prototype.toString = function() {

    return 'Score.TextAnchor';
};

ScoreLibrary.Score.TextAnchor.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.TextAnchor(this.number, this.information);

    var supperclass = ScoreLibrary.Score.TextAnchor.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Score.TextAnchor.prototype.getEnclosure = function() {

    return this.information.enclosure;
};

ScoreLibrary.Score.TextAnchor.prototype.getText = function(context) {

    return this.information.text;
};

ScoreLibrary.Score.TextAnchor.prototype.getFont = function(context) {

    return 'italic 16px sans-serif';
};

ScoreLibrary.Score.TextAnchor.prototype.getEscapes = function() {

    return undefined;
};

ScoreLibrary.Score.TextAnchor.prototype.createRenderer = function(context) {

    var renderer =
        new ScoreLibrary.Renderer.TextAnchor(this);

    renderer.getTextBox(context);

    this.setRenderer(renderer);

    return renderer;
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
