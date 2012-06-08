goog.provide('ScoreLibrary.Score.HarmonyFrame');
goog.require('ScoreLibrary.Renderer.HarmonyFrame');
goog.require('ScoreLibrary.Score');
goog.require('ScoreLibrary.Score.Anchor');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Score.Anchor}
 */
ScoreLibrary.Score.HarmonyFrame = function(number, information) {

    var supperclass = ScoreLibrary.Score.HarmonyFrame.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.HarmonyFrame,
    ScoreLibrary.Score.Anchor);

ScoreLibrary.Score.HarmonyFrame.prototype.toString = function() {

    return 'Score.HarmonyFrame';
};

ScoreLibrary.Score.HarmonyFrame.prototype.toNodeString = function() {

    return 'harmony-frame';
};

ScoreLibrary.Score.HarmonyFrame.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.HarmonyFrame(this.number, this.information);

    var supperclass = ScoreLibrary.Score.HarmonyFrame.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Score.HarmonyFrame.prototype.createRenderer = function(clone) {

    var harmonyframe_renderer = new ScoreLibrary.Renderer.HarmonyFrame();

    this.setRenderer(harmonyframe_renderer);

    return harmonyframe_renderer;
};

ScoreLibrary.Score.HarmonyFrame.prototype.getNumberOfString = function() {

    return this.information.strings;
};

ScoreLibrary.Score.HarmonyFrame.prototype.getNumberOfFret = function() {

    return this.information.frets;
};

ScoreLibrary.Score.HarmonyFrame.prototype.getFirstFret = function() {

    return this.information.first_fret;
};

ScoreLibrary.Score.HarmonyFrame.prototype.getFrameNotes = function() {

    return this.information.frame_notes;
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
