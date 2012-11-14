goog.provide('ScoreLibrary.Renderer.HBoxGlyph');
goog.provide('ScoreLibrary.Renderer.VBoxGlyph');
goog.require('ScoreLibrary.Renderer');
goog.require('ScoreLibrary.Renderer.GlyphAdapter');
goog.require('ScoreLibrary.Renderer.HBox');
goog.require('ScoreLibrary.Renderer.VBox');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Renderer.VBox}
 * @extends {ScoreLibrary.Renderer.GlyphAdapter}
 */
ScoreLibrary.Renderer.VBoxGlyph = function(glyph_name, spacing) {

    var supperclass = ScoreLibrary.Renderer.VBoxGlyph.supperclass;

    supperclass.constructor.call(this, spacing);

    this.setName(glyph_name || 'VBoxGlyph');
};

ScoreLibrary.inherited(
    ScoreLibrary.Renderer.VBoxGlyph,
    ScoreLibrary.Renderer.VBox);

ScoreLibrary.aggregate(ScoreLibrary.Renderer.VBoxGlyph,
                       ScoreLibrary.Renderer.GlyphAdapter);

ScoreLibrary.Renderer.VBoxGlyph.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Renderer.VBoxGlyph(this.getName(), this.getSpacing());

    var supperclass = ScoreLibrary.Renderer.VBoxGlyph.supperclass;

    return supperclass.clone.call(this, clone);
};

/**
 * @constructor
 * @extends {ScoreLibrary.Renderer.HBox}
 * @extends {ScoreLibrary.Renderer.GlyphAdapter}
 */
ScoreLibrary.Renderer.HBoxGlyph = function(glyph_name, spacing) {

    var supperclass = ScoreLibrary.Renderer.HBoxGlyph.supperclass;

    supperclass.constructor.call(this, spacing);

    this.setName(glyph_name || 'HBoxGlyph');
};

ScoreLibrary.inherited(
    ScoreLibrary.Renderer.HBoxGlyph,
    ScoreLibrary.Renderer.HBox);

ScoreLibrary.aggregate(ScoreLibrary.Renderer.HBoxGlyph,
                       ScoreLibrary.Renderer.GlyphAdapter);

ScoreLibrary.Renderer.HBoxGlyph.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Renderer.HBoxGlyph(this.getName(), this.getSpacing());

    var supperclass = ScoreLibrary.Renderer.HBoxGlyph.supperclass;

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
