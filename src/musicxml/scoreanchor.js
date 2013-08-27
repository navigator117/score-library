goog.provide('ScoreLibrary.Score.Anchor');
goog.require('ScoreLibrary.Score');
goog.require('ScoreLibrary.Score.Connector');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Score.Connector}
 */
ScoreLibrary.Score.Anchor = function(number, information) {

    var supperclass = ScoreLibrary.Score.Anchor.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.Anchor,
    ScoreLibrary.Score.Connector);

ScoreLibrary.Score.Anchor.prototype.toString = function() {

    return 'Score.Anchor';
};

ScoreLibrary.Score.Anchor.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.Anchor(this.number, this.information);

    var supperclass = ScoreLibrary.Score.Anchor.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Score.Anchor.prototype.isBeginType = function(type) {

    return true;
};

ScoreLibrary.Score.Anchor.prototype.isEndType = function(type) {

    return true;
};

ScoreLibrary.Score.Anchor.prototype.isValidType = function(type) {

    return true;
};

/**
 * @constructor
 */
ScoreLibrary.Score.Anchor.PlacementPolicy = function(anchor) {

    this.anchor = anchor;
};

ScoreLibrary.Score.Anchor.PlacementPolicy.prototype.gatherNoteInformation =
    function(note, index, notes) {
};

ScoreLibrary.Score.Anchor.PlacementPolicy.prototype.applyToNote =
    function(note, index, notes) {

    if (index === 0) {

        this.anchor.setPlacementNote(note);
    }
};

ScoreLibrary.Score.Anchor.prototype.getPolices = function() {

    return [
        new ScoreLibrary.Score.Anchor.PlacementPolicy(this)
    ];
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
