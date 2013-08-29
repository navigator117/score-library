goog.provide('ScoreLibrary.Renderer.DurationBox');
goog.require('ScoreLibrary.Renderer.DurationContainer');
goog.require('ScoreLibrary.Renderer.DurationPackLayouter');
goog.require('ScoreLibrary.Renderer.DurationPacker');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Renderer.DurationContainer}
 * @extends {ScoreLibrary.Renderer.PackOrientation}
 * @extends {ScoreLibrary.Renderer.DurationPacker}
 * @extends {ScoreLibrary.Renderer.DurationPackLayouter}
 */
ScoreLibrary.Renderer.DurationBox = function(spacing) {

    var supperclass = ScoreLibrary.Renderer.DurationBox.supperclass;

    supperclass.constructor.call(this, spacing);

    this.setOrientation(ScoreLibrary.Renderer.PackOrientation.Horizontal);
    this.setSpacing(spacing);
};

ScoreLibrary.inherited(ScoreLibrary.Renderer.DurationBox,
                       ScoreLibrary.Renderer.DurationContainer);

ScoreLibrary.aggregate(ScoreLibrary.Renderer.DurationBox,
                       ScoreLibrary.Renderer.PackOrientation);

ScoreLibrary.aggregate(ScoreLibrary.Renderer.DurationBox,
                       ScoreLibrary.Renderer.DurationPacker);

ScoreLibrary.aggregate(ScoreLibrary.Renderer.DurationBox,
                       ScoreLibrary.Renderer.DurationPackLayouter);

ScoreLibrary.Renderer.DurationBox.prototype.toString = function() {

    return 'Renderer.DurationBox';
};

ScoreLibrary.Renderer.DurationBox.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Renderer.DurationBox(this.getSpacing());

    var supperclass = ScoreLibrary.Renderer.DurationBox.supperclass;

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
