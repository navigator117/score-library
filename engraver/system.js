goog.provide('ScoreLibrary.Engraver.System');
goog.require('ScoreLibrary.Engraver');
goog.require('ScoreLibrary.Engraver.Part');
goog.require('ScoreLibrary.Renderer.System');
goog.require('ScoreLibrary.Score.ColumnIterator');

/**
 * @constructor
 */
ScoreLibrary.Engraver.System = function(glyph_factory) {

    this.glyph_factory = glyph_factory;
};

ScoreLibrary.Engraver.System.prototype.engrave =
    function(parts, part_renderers, system_renderer) {

        part_renderers.forEach(

            function(part_renderer, index) {

                part_renderer.stackUpStaffStreams();

                system_renderer =
                    system_renderer || new ScoreLibrary.Renderer.System();

                system_renderer.stackUpPartRenderer(
                    parts[index].id, part_renderer);
            }, this);

        return system_renderer;
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
