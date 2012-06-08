goog.provide('ScoreLibrary.Renderer.GlyphAdapter');

/**
 * @constructor
 */
ScoreLibrary.Renderer.GlyphAdapter = function() {
};

ScoreLibrary.Renderer.GlyphAdapter.prototype.setName = function(glyph_name) {

    this.glyph_name = glyph_name;
};

ScoreLibrary.Renderer.GlyphAdapter.prototype.toString = function() {

    return this.glyph_name;
};

ScoreLibrary.Renderer.GlyphAdapter.prototype.getChar = function() {

    return undefined;
};

ScoreLibrary.Renderer.GlyphAdapter.prototype.getName = function() {

    return this.glyph_name;
};

ScoreLibrary.Renderer.GlyphAdapter.prototype.getHorizontalAdvance = function() {

    var obox = this.getOutlineBoundbox();

    return (obox.x_max - obox.x_min);
};

ScoreLibrary.Renderer.GlyphAdapter.prototype.getHeightWidthRatio = function() {

    var requisite_width = this.getRequisite('width');
    var requisite_height = this.getRequisite('height');

    return (requisite_width !== 0 ?
            (requisite_height / requisite_width) : 1);
};

ScoreLibrary.Renderer.GlyphAdapter.prototype.getWidthHeightRatio = function() {

    var requisite_width = this.getRequisite('width');
    var requisite_height = this.getRequisite('height');

    return (requisite_height !== 0 ?
            (requisite_width / requisite_height) : 1);
};

ScoreLibrary.Renderer.GlyphAdapter.prototype.getOutline = function() {

    return [];
};

ScoreLibrary.Renderer.GlyphAdapter.prototype.getOutlineBoundbox = function() {

    var obox = undefined;

    if (this.obox_setted) {

        obox = {

            x_min: this.obox_x_min,
            y_min: this.obox_y_min,
            x_max: this.obox_x_max,
            y_max: this.obox_y_max
        };
    }
    else {

        obox = {};

        obox.x_min = this.getOrg(this.fix_org_coord || 'parent', 'x') || 0;
        obox.y_min = this.getOrg(this.fix_org_coord || 'parent', 'y') || 0;
        obox.x_max = obox.x_min + this.getRequisite('width');
        obox.y_max = obox.y_min + this.getRequisite('height');
    }

    return obox;
};

ScoreLibrary.Renderer.GlyphAdapter.prototype.setOutlineBoundbox =
    function(outline_bbox) {

        this.obox_setted = true;

        this.obox_x_min = outline_bbox.x_min;
        this.obox_y_min = outline_bbox.y_min;
        this.obox_x_max = outline_bbox.x_max;
        this.obox_y_max = outline_bbox.y_max;
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
