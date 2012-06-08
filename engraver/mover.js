goog.provide('ScoreLibrary.Engraver.Mover');
goog.require('ScoreLibrary.Engraver');
goog.require('ScoreLibrary.Renderer.Part');
goog.require('ScoreLibrary.Score.Mover');

/**
 * @constructor
 */
ScoreLibrary.Engraver.Mover = function(glyph_factory) {

    this.glyph_factory = glyph_factory;
};

ScoreLibrary.Engraver.Mover.prototype.engrave = function(mover, renderer) {

    renderer = renderer || new ScoreLibrary.Renderer.Part();

        if (mover.isBackup()) {

            renderer.backup(mover.getGcdDuration());
        }
        else {

            var mover_renderer =
                mover.createRenderer(this.glyph_factory);

            if (mover_renderer) {

                renderer.findStaffStream(mover.getStaffNumber(), true).pack(
                    mover_renderer,
                    true, false, 0, 1, 'staff');
            }
        }

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
