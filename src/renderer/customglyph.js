goog.provide('ScoreLibrary.Renderer.CustomGlyph');
goog.require('ScoreLibrary.Renderer.GlyphAdapter');
goog.require('ScoreLibrary.Renderer.Paintable');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Renderer.Paintable}
 * @extends {ScoreLibrary.Renderer.GlyphAdapter}
 */
ScoreLibrary.Renderer.CustomGlyph = function(glyph_name) {

    var supperclass = ScoreLibrary.Renderer.CustomGlyph.supperclass;

    supperclass.constructor.call(this);

    this.setName(glyph_name || 'CustomGlyph');
};

ScoreLibrary.inherited(ScoreLibrary.Renderer.CustomGlyph,
                       ScoreLibrary.Renderer.Paintable);

ScoreLibrary.aggregate(ScoreLibrary.Renderer.CustomGlyph,
                       ScoreLibrary.Renderer.GlyphAdapter);

ScoreLibrary.Renderer.CustomGlyph.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Renderer.CustomGlyph(this.getName());

    var supperclass = ScoreLibrary.Renderer.CustomGlyph.supperclass;

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
