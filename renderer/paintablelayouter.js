goog.provide('ScoreLibrary.Renderer.PaintableLayouter');
goog.require('ScoreLibrary.Renderer');
goog.require('goog.asserts');

/**
 * @constructor
 */
ScoreLibrary.Renderer.PaintableLayouter = function() {
};

ScoreLibrary.Renderer.PaintableLayouter.prototype.sizeAllocate =
    function(allocation) {

        if (this.pack_allocated) {

            goog.asserts.assert(
                false,
                'Renderer.PaintableLayouter.sizeAllocate(): unexpect!');
        }

        for (var dimension in allocation) {

            if (allocation[dimension] <
                this.getRequisite(dimension)) {

                return false;
            }
        }

        for (var dimension in allocation) {

            this.setAllocate(
                dimension, allocation[dimension]);
        }

        this.pack_allocated = true;

        return true;
    };

ScoreLibrary.Renderer.PaintableLayouter.prototype.sizeAllocateRecursively =
    function(allocation) {

        if (!this.sizeAllocate(allocation)) {

            return false;
        }

        return true;
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
