goog.provide('ScoreLibrary.Score.Mover');
goog.require('ScoreLibrary.Score');
goog.require('ScoreLibrary.Score.DataElement');
goog.require('ScoreLibrary.Score.XMLHelper');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Score.DataElement}
 */
ScoreLibrary.Score.Mover = function(owner, note_node) {

    var supperclass = ScoreLibrary.Score.Mover.supperclass;

    supperclass.constructor.call(this, owner, note_node);

    var xml_helper = ScoreLibrary.Score.XMLHelper.getInstance();

    xml_helper.getMover(this, this);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.Mover,
    ScoreLibrary.Score.DataElement);

ScoreLibrary.Score.Mover.prototype.toString = function() {

    return 'Score.Mover';
};

ScoreLibrary.Score.Mover.prototype.isBackup = function() {

    return this.is_backup;
};

ScoreLibrary.Score.Mover.prototype.isForward = function() {

    return this.is_forward;
};

ScoreLibrary.Score.Mover.prototype.getStaffNumber = function() {

    if (this.isForward()) {

        return this.staff_number || 1;
    }
    else {

        return undefined;
    }
};

ScoreLibrary.Score.Mover.prototype.createRenderer = function(glyph_factory) {

    var renderer =
        new ScoreLibrary.Renderer.HBoxGlyph('Mover');

    renderer.setExplicit('width', 10);
    renderer.setExplicit('height', 10);

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
