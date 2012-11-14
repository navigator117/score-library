goog.provide('ScoreLibrary.Renderer.CustomTextRenderer');
goog.require('ScoreLibrary.Renderer');
goog.require('ScoreLibrary.Renderer.GlyphFactory');
goog.require('goog.asserts');

/**
 * @constructor
 */
ScoreLibrary.Renderer.CustomTextRenderer = function(context) {

    this.context = context;
    this.style = ScoreLibrary.Renderer.CustomTextRenderer.Style.AllContext;
    this.font_size = 16;
};

ScoreLibrary.Renderer.CustomTextRenderer.Style = {

    AllContext: 0,
    AllCustom: 1,
    MixCustom: 2,
    MixEscape: 3,
    isValid: function(style) {

        return (style ===
                ScoreLibrary.Renderer.CustomTextRenderer.Style.AllContext ||
                style ===
                ScoreLibrary.Renderer.CustomTextRenderer.Style.AllCustom ||
                style ===
                ScoreLibrary.Renderer.CustomTextRenderer.Style.MixCustom ||
                style ===
                ScoreLibrary.Renderer.CustomTextRenderer.Style.MixEscape);
    }
};

ScoreLibrary.Renderer.CustomTextRenderer.prototype.setGlyphFactory =
    function(glyph_factory) {

        this.glyph_factory = glyph_factory;
    };

ScoreLibrary.Renderer.CustomTextRenderer.prototype.getGlyphFactory =
    function() {

        if (this.glyph_factory === undefined) {

            this.glyph_factory =
                new ScoreLibrary.Renderer.GlyphFactory();
        }

        return this.glyph_factory;
    };

ScoreLibrary.Renderer.CustomTextRenderer.prototype.setStyle = function(style) {

    goog.asserts.assert(
        ScoreLibrary.Renderer.CustomTextRenderer.Style.isValid(style),
    'ScoreLibrary.Renderer.CustomTextRenderer.setStyle(): invalid parameter!');

    this.style = style;
};

ScoreLibrary.Renderer.CustomTextRenderer.prototype.setFontSize =
    function(font_size) {

        this.font_size = font_size;
    };

ScoreLibrary.Renderer.CustomTextRenderer.prototype.fillText =
    function(text, x, y, max_width, escapes) {

        if (escapes !== undefined) {

            this.setStyle(
                ScoreLibrary.Renderer.CustomTextRenderer.Style.MixEscape);

            this.escapes = escapes;
        }

        if (this.style !==
            ScoreLibrary.Renderer.CustomTextRenderer.Style.AllContext) {

            this.context.save();

            this.context.translate(x, y);

            var normalCharHandler = this.fillNormalText;
            var specialCharDetector = this.isEscapeGlyph;
            var specialCharHandler = this.drawEscapeGlyph;

            if (this.style !==
                ScoreLibrary.Renderer.CustomTextRenderer.Style.MixEscape) {

                specialCharDetector = this.isCustomGlyph;
                specialCharHandler = this.drawCustomGlyph;
            }

            this.forEachChar(normalCharHandler,
                             specialCharDetector,
                             specialCharHandler,
                             text);

            this.context.restore();

            return true;
        }

        return false;
    };

ScoreLibrary.Renderer.CustomTextRenderer.prototype.strokeText =
    ScoreLibrary.Renderer.CustomTextRenderer.prototype.fillText;

ScoreLibrary.Renderer.CustomTextRenderer.prototype.measureText =
    function(text, escapes) {

        if (escapes !== undefined) {

            this.setStyle(
                ScoreLibrary.Renderer.CustomTextRenderer.Style.MixEscape);

            this.escapes = escapes;
        }

        if (this.style !==
            ScoreLibrary.Renderer.CustomTextRenderer.Style.AllContext) {

            this.measure_text_width = 0;

            var normalCharHandler = this.measureNormalText;
            var specialCharDetector = this.isEscapeGlyph;
            var specialCharHandler = this.measureEscapeGlyph;

            if (this.style !==
                ScoreLibrary.Renderer.CustomTextRenderer.Style.MixEscape) {

                specialCharDetector = this.isCustomGlyph;
                specialCharHandler = this.measureCustomGlyph;
            }

            this.forEachChar(normalCharHandler,
                             specialCharDetector,
                             specialCharHandler,
                             text);

            return this.measure_text_width;
        }

        return undefined;
    };

ScoreLibrary.Renderer.CustomTextRenderer.prototype.fillNormalText =
    function(text) {

        var style = this.style;

        this.setStyle(
            ScoreLibrary.Renderer.CustomTextRenderer.Style.AllContext);

        this.context.fillText(text, 0, 0);

        var width = this.context.measureText(text);

        this.context.translate(width, 0);

        this.style = style;
    };

ScoreLibrary.Renderer.CustomTextRenderer.prototype.measureNormalText =
    function(text) {

        var style = this.style;

        this.setStyle(
            ScoreLibrary.Renderer.CustomTextRenderer.Style.AllContext);

        var width = this.context.measureText(text);

        this.style = style;

        this.measure_text_width += width;
    };

ScoreLibrary.Renderer.CustomTextRenderer.prototype.forEachChar =
    function(normalCharHandler, specialCharDetector, specialCharHandler, text) {

        var normal_text = '';

        for (var i = 0; i < text.length; ++i) {

            var character = text.charAt(i);

            switch (this.style) {

            case ScoreLibrary.Renderer.CustomTextRenderer.Style.AllCustom: {

                specialCharHandler.call(this, character, i, text);
            } break;

            case ScoreLibrary.Renderer.CustomTextRenderer.Style.MixCustom:
            case ScoreLibrary.Renderer.CustomTextRenderer.Style.MixEscape: {

                if (!specialCharDetector.call(this, character, i, text)) {

                    normal_text += character;
                }
                else {

                    if (normal_text !== '') {

                        normalCharHandler.call(this, normal_text);

                        normal_text = '';
                    }

                    if (specialCharHandler.call(this, character, i, text)) {
                        // Skip %0 <-- number char
                        ++i;
                    }
                }

            } break;

            case ScoreLibrary.Renderer.CustomTextRenderer.Style.AllContext:
            default: {

                goog.asserts.assert(
                    false,
                    'Renderer.CustomTextRenderer.forEachChar(): unexpect!');
            } break;

            }
        }

        if (this.style ===
            ScoreLibrary.Renderer.CustomTextRenderer.Style.MixCustom ||
            this.style ===
            ScoreLibrary.Renderer.CustomTextRenderer.Style.MixEscape) {

            if (normal_text !== '') {

                normalCharHandler.call(this, normal_text);
            }
        }
    };

ScoreLibrary.Renderer.CustomTextRenderer.prototype.isCustomGlyph =
    function(character, i, text) {

        if (!(/\d/.test(character)) &&
            this.glyph_factory.getGlyphByChar(character) !== undefined) {

            return true;
        }

        return false;
    };

ScoreLibrary.Renderer.CustomTextRenderer.prototype.drawCustomGlyph =
    function(character, i, text) {

        var glyph =
            this.glyph_factory.createByChar(
                character,
                undefined,
                this.font_size);

        var requisite_width = glyph.getRequisite('width');
        var requisite_height = glyph.getRequisite('height');

        glyph.setAllocate('width', requisite_width);
        glyph.setAllocate('height', requisite_height);

        this.context.save();

        this.context.transform(1, 0, 0, -1, 0, 0);

        glyph.draw(this.context);

        this.context.restore();

        this.context.translate(requisite_width, 0);

        return false;
    };

ScoreLibrary.Renderer.CustomTextRenderer.prototype.isEscapeGlyph =
    function(character, i, text) {

        if (character === '%' &&
            ((i + 1) < text.length)) {

            var escape_idx = text.charAt(i + 1);

            if (escape_idx === '%' ||
                ((/\d/.test(escape_idx)) &&
                 this.escapes !== undefined &&
                 escape_idx < this.escapes.length)) {

                return true;
            }
        }

        return false;
    };

ScoreLibrary.Renderer.CustomTextRenderer.prototype.drawEscapeGlyph =
    function(character, i, text) {

        var escape_idx = text.charAt(i + 1);

        if (escape_idx !== '%') {

            var glyph = this.escapes[escape_idx];

            var requisite_width = glyph.getRequisite('width');
            var requisite_height = glyph.getRequisite('height');

            glyph.setAllocate('width', requisite_width);
            glyph.setAllocate('height', requisite_height);

            this.context.save();

            var baseline = this.context.getTextBaseline();

            var y_move = 0;

            switch (baseline) {

            case 'top': {
                y_move = this.font_size;
            } break;

            case 'middle': {
                y_move = this.font_size * 0.20; // !NOTE: temp fixed!
            } break;

            case 'bottom':
            default: break;
            }

            var scale = this.calcEscapeGlyphScale(glyph);

            this.context.transform(scale, 0, 0, -scale, 0, y_move);

            glyph.draw(this.context);

            this.context.restore();

            this.context.translate(requisite_width * scale, 0);
        }

        return true;
    };

ScoreLibrary.Renderer.CustomTextRenderer.prototype.measureCustomGlyph =
    function(character, i, text) {

        var glyph =
            this.glyph_factory.createByChar(
                character,
                undefined,
                this.font_size);

        this.measure_text_width += glyph.getRequisite('width');

        return false;
    };

ScoreLibrary.Renderer.CustomTextRenderer.prototype.calcEscapeGlyphScale =
    function(glyph) {

        var requisite_height = glyph.getRequisite('height');

        if (glyph.toString() === 'Note') {

            var note_head = glyph.getNoteHead();

            requisite_height = note_head.getRequisite('height');
        }

        return requisite_height * this.font_size / 250;
    };

ScoreLibrary.Renderer.CustomTextRenderer.prototype.measureEscapeGlyph =
    function(character, i, text) {

        var escape_idx = text.charAt(i + 1);

        if (escape_idx !== '%') {

            var glyph = this.escapes[escape_idx];

            var scale = this.calcEscapeGlyphScale(glyph);

            this.measure_text_width += glyph.getRequisite('width') * scale;
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
