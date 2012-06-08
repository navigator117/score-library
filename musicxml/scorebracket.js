goog.provide('ScoreLibrary.Score.Bracket');
goog.provide('ScoreLibrary.Score.Ending');
goog.require('ScoreLibrary.Renderer.Bracket');
goog.require('ScoreLibrary.Score');
goog.require('ScoreLibrary.Score.Connector');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Score.Connector}
 */
ScoreLibrary.Score.Bracket = function(number, information) {

    var supperclass = ScoreLibrary.Score.Bracket.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.Bracket,
    ScoreLibrary.Score.Connector);

ScoreLibrary.Score.Bracket.prototype.toString = function() {

    return 'Score.Bracket';
};

ScoreLibrary.Score.Bracket.prototype.toNodeString = function() {

    return 'bracket';
};

ScoreLibrary.Score.Bracket.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.Bracket(this.number, this.information);

    var supperclass = ScoreLibrary.Score.Bracket.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Score.Bracket.prototype.isValidType = function(type) {

    return (/(start|continue|stop)/.test(type));
};

ScoreLibrary.Score.Bracket.prototype.isBeginType = function(type) {

    return 'start' === type;
};

ScoreLibrary.Score.Bracket.prototype.isEndType = function(type) {

    return 'stop' === type;
};

ScoreLibrary.Score.Bracket.prototype.getDirection = function() {

    return 'upper';
};

ScoreLibrary.Score.Bracket.prototype.getLineEnd = function() {

    return this.information.line_end;
};

ScoreLibrary.Score.Bracket.prototype.getEndLength = function() {

    return /*this.information.end_length ||*/ 10;
};

ScoreLibrary.Score.Bracket.prototype.getLineType = function() {

    return this.information.line_type;
};

ScoreLibrary.Score.Bracket.prototype.createRenderer =
    function(context, open_sides) {

        var bracket_renderer = new ScoreLibrary.Renderer.Bracket(open_sides);

        bracket_renderer.setExplicit('height', this.getEndLength());

        this.setRenderer(bracket_renderer);

        return bracket_renderer;
    };

/**
 * @constructor
 * @extends {ScoreLibrary.Score.Bracket}
 */
ScoreLibrary.Score.Ending = function(number, information) {

    var supperclass = ScoreLibrary.Score.Ending.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.Ending,
    ScoreLibrary.Score.Bracket);

ScoreLibrary.Score.Ending.prototype.toString = function() {

    return 'Score.Ending';
};

ScoreLibrary.Score.Ending.prototype.toNodeString = function() {

    return 'ending';
};

ScoreLibrary.Score.Ending.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.Ending(this.number, this.information);

    var supperclass = ScoreLibrary.Score.Ending.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Score.Ending.prototype.isValidType = function(type) {

    return (/(start|discontinue|stop)/.test(type));
};

ScoreLibrary.Score.Ending.prototype.isBeginType = function(type) {

    return 'start' === type;
};

ScoreLibrary.Score.Ending.prototype.isEndType = function(type) {

    return ('stop' === type || 'discontinue' === type);
};

ScoreLibrary.Score.Ending.prototype.onAddNote = function(number, type, note) {

    if (type === 'discontinue') {

        this.is_discontinue = true;
    }

    var supperclass = ScoreLibrary.Score.Ending.supperclass;

    return supperclass.onAddNote.call(this, number, type, note);
};

ScoreLibrary.Score.Ending.prototype.createRenderer = function(context) {

    var open_sides =
        ScoreLibrary.Renderer.PaintHelper.OpenSides.Bottom;

    if (this.is_discontinue) {

        open_sides |= ScoreLibrary.Renderer.PaintHelper.OpenSides.Right;
    }

    var supperclass = ScoreLibrary.Score.Ending.supperclass;

    return supperclass.createRenderer.call(this, context, open_sides);
};

ScoreLibrary.Score.Ending.prototype.getNumbers = function() {

    return (this.information ? this.information.numbers : '');
};

ScoreLibrary.Score.Ending.prototype.getText = function() {

    return (this.information ? this.information.text : '');
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
