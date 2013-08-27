goog.provide('ScoreLibrary.Renderer.GlyphFactory');
goog.require('ScoreLibrary.Renderer');
goog.require('ScoreLibrary.Renderer.Glyph');
goog.require('ScoreLibrary.Renderer.PaintableScaler');
goog.require('ScoreLibrary.Renderer.PaintableTranslator');
goog.require('goog.asserts');

/**
 * @constructor
 */
ScoreLibrary.Renderer.GlyphFactory = function() {
};

ScoreLibrary.Renderer.GlyphFactory.prototype.addFont = function(font) {

    this.fonts = this.fonts || [];

    if (!this.fonts.some(

        function(added_font, index, added_fonts) {

            if (font.familyName === added_font.familyName) {

                return true;
            }

            return false;

        })) {

        this.fonts.push(font);

        return true;
    }

    return false;
};

ScoreLibrary.Renderer.GlyphFactory.prototype.clearFonts = function() {

    this.fonts = undefined;
    this.glyphs = undefined;
};

ScoreLibrary.Renderer.GlyphFactory.prototype.getGlyphByName =
    function(glyph_name) {

        goog.asserts.assert(
            this.fonts !== undefined,
            'ScoreLibrary.Renderer.GlyphFactory.getGlyphByName():' +
                ' no font is added!');

        if (this.glyphs === undefined) {

            this.glyphs = {};

            this.fonts.forEach(

                function(font, index, fonts) {

                    for (var glyph_char in font.glyphs) {

                        var glyph = font.glyphs[glyph_char];

                        var name = glyph.name;

                        goog.asserts.assert(
                            this.glyphs[name] === undefined,
                            'Renderer.GlyphFactory.getGlyphByName():' +
                                ' name overlapped!');

                        glyph.character = glyph_char;

                        this.glyphs[name] = glyph;
                    }

                }, this);
        }

        return this.glyphs[glyph_name];
    };

ScoreLibrary.Renderer.GlyphFactory.prototype.getGlyphByChar =
    function(glyph_char) {

        goog.asserts.assert(
            this.fonts !== undefined,
            'ScoreLibrary.Renderer.GlyphFactory.getGlyphByChar():' +
                ' no font is added!');

        var glyph = undefined;

        this.fonts.some(

            function(font) {

                if ((glyph = font.glyphs[glyph_char]) !== undefined) {

                    return true;
                }

                return false;
            });

        return glyph;
    };

ScoreLibrary.Renderer.GlyphFactory.prototype.createByName =
    function(glyph_name, width, height) {

        var glyph = this.getGlyphByName(glyph_name);

        var glyph_renderer =
            (glyph !== undefined ?
             new ScoreLibrary.Renderer.Glyph(glyph) : undefined);

        if (!glyph) {

            goog.asserts.assert(false,
                'ScoreLibrary.Renderer.GlyphFactory.createByName()' +
                    ' failed by ' + glyph_name + ' !');
        }

        return this.initGlyphRequisition(glyph, glyph_renderer, width, height);
    };

ScoreLibrary.Renderer.GlyphFactory.prototype.createByChar =
    function(glyph_char, width, height) {

        var glyph = this.getGlyphByChar(glyph_char);

        var glyph_renderer =
            (glyph !== undefined ?
             new ScoreLibrary.Renderer.Glyph(glyph) : undefined);

        if (!glyph) {

            goog.asserts.assert(false,
                'ScoreLibrary.Renderer.GlyphFactory.createByChar()' +
                    ' failed by ' + glyph_char.charCodeAt(0) + ' !');
        }

        return this.initGlyphRequisition(glyph, glyph_renderer, width, height);
    };

ScoreLibrary.Renderer.GlyphFactory.prototype.initGlyphRequisition =
    function(glyph, glyph_renderer, width, height) {

        if (glyph_renderer !== undefined) {

            if (width !== undefined) {

                height = width * glyph_renderer.getHeightWidthRatio();

            } else if (height !== undefined) {

                width = height * glyph_renderer.getWidthHeightRatio();
            }

            glyph_renderer.setExplicit('width', width);
            glyph_renderer.setExplicit('height', height);

            if (glyph.width) {

                var scale = width / glyph.width;

                var transformer =
                    new ScoreLibrary.Renderer.PaintableScaler(
                        glyph_renderer, scale, scale);

                var obox = glyph_renderer.getOutlineBoundbox();

                obox.x_min = obox.x_min * scale;
                obox.y_min = obox.y_min * scale;
                obox.x_max = obox.x_max * scale;
                obox.y_max = obox.y_max * scale;

                glyph_renderer.setOutlineBoundbox(obox);

                if (obox.x_min !== 0 || obox.y_min !== 0) {

                    transformer =
                        new ScoreLibrary.Renderer.PaintableTranslator(
                            transformer, -obox.x_min, -obox.y_min);
                }

                transformer.transform();
            }
        }

        return glyph_renderer;
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
