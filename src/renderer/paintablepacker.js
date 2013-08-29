goog.provide('ScoreLibrary.Renderer.PackOrientation');
goog.provide('ScoreLibrary.Renderer.PaintablePacker');
goog.require('ScoreLibrary.Renderer');
goog.require('goog.asserts');

/**
 * @constructor
 */
ScoreLibrary.Renderer.PackOrientation = function() {
};

/**
 * @const {number}
 */
ScoreLibrary.Renderer.PackOrientation.Horizontal = 1;
/**
 * @const {number}
 */
ScoreLibrary.Renderer.PackOrientation.Vertical = 2;

ScoreLibrary.Renderer.PackOrientation.prototype.setOrientation =
    function(orientation) {

        this.orientation = orientation ||
            ScoreLibrary.Renderer.PackOrientation.Horizontal;

        if (this.isHorizontal()) {

            this.sum_dim = 'width';
            this.max_dim = 'height';
            this.sum_org = 'x';
            this.max_org = 'y';
        }
        else {

            this.sum_dim = 'height';
            this.max_dim = 'width';
            this.sum_org = 'y';
            this.max_org = 'x';
        }
    };

ScoreLibrary.Renderer.PackOrientation.prototype.getOrientation = function() {

    return this.orientation;
};

ScoreLibrary.Renderer.PackOrientation.prototype.isHorizontal = function() {

    return (this.orientation ===
            ScoreLibrary.Renderer.PackOrientation.Horizontal);
};

ScoreLibrary.Renderer.PackOrientation.prototype.isVertical = function() {

    return !this.isHorizontal();
};

/**
 * @constructor
 */
ScoreLibrary.Renderer.PaintablePacker = function() {
};

ScoreLibrary.Renderer.PaintablePacker.prototype.setSpacing = function(spacing) {

    this.pack_spacing = spacing || 0;
};

ScoreLibrary.Renderer.PaintablePacker.prototype.getSpacing = function() {

    return this.pack_spacing;
};

ScoreLibrary.Renderer.PaintablePacker.prototype.pack =
    function(paintable, expand, fill,
             padding_s, padding_e, fix_org_coord, reverse) {

        goog.asserts.assert(
            !(!expand && fill) &&
                (fix_org_coord === this.fix_org_coord ||
                 fix_org_coord && !this.fix_org_coord),
            'ScoreLibrary.Renderer.PaintablePacker.pack(): invalid arguments!');

        var index = this.addChild(paintable);
        if (index !== undefined) {

            this.recordPackStyles(paintable,
                                  expand, fill, padding_s, padding_e,
                                  fix_org_coord, reverse);

            this.updateImplicitSum(paintable, index);
            this.updateImplicitMax(paintable, index);
        }

        return index;
    };

ScoreLibrary.Renderer.PaintablePacker.prototype.recordPackStyles =
    function(paintable, expand, fill,
             padding_s, padding_e, fix_org_coord, reverse) {

        if (!reverse) {

            this.pack_children_forward = true;
        }
        else {

            this.pack_children_reverse = true;
        }

        if (fix_org_coord) {

            if (!this.fix_org_coord) {

                this.fix_org_coord = fix_org_coord;
            }

            var paintable_fix_sum =
                this.getPaintableFixOrg(paintable, this.sum_org);

            if (paintable_fix_sum !== undefined) {

                paintable.pack_fix_sum = paintable_fix_sum;
            }

            var paintable_fix_max =
                this.getPaintableFixOrg(paintable, this.max_org);

            if (paintable_fix_max !== undefined) {

                paintable.pack_fix_max = paintable_fix_max;
            }
        }

        if (reverse) {

            paintable.pack_reverse = true;
        }
        else {

            paintable.pack_forward = true;
        }

        if (expand && fill) {

            paintable.pack_expand_filling = true;
        }
        else if (expand && !fill) {

            paintable.pack_expand_padding = true;
        }

        paintable.pack_padding_s = padding_s || 0;
        paintable.pack_padding_e = padding_e || 0;
    };

ScoreLibrary.Renderer.PaintablePacker.prototype.getPaintableFixOrg =
    function(paintable, fix_org) {

        return (this.fix_org_coord ?
                paintable.getOrg(this.fix_org_coord, fix_org) :
                undefined);
    };

ScoreLibrary.Renderer.PaintablePacker.prototype.calcFixDim =
    function(paintable, fix_org, fix_dim) {

        var implicit_max =
            this.getImplicit(fix_dim);

        var paintable_max =
            paintable.getRequisite(fix_dim);

        var paintable_fix_org =
            paintable.getOrg(
                this.fix_org_coord, fix_org);

        var paintable_fix_max =
            paintable_fix_org + paintable_max;

        var container_fix_org =
            this.getOrg(
                this.fix_org_coord, fix_org);

        var container_fix_max =
            (container_fix_org !== undefined ?
             container_fix_org + implicit_max :
             undefined);

        container_fix_max =
            (container_fix_max !== undefined ?
             Math.max(container_fix_max, paintable_fix_max) :
             paintable_fix_max);

        container_fix_org =
            (container_fix_org !== undefined ?
             Math.min(container_fix_org, paintable_fix_org) :
             paintable_fix_org);

        this.setOrg(
            this.fix_org_coord, fix_org, container_fix_org);

        implicit_max =
            Math.max(implicit_max, container_fix_max - container_fix_org);

        return implicit_max;
    };

ScoreLibrary.Renderer.PaintablePacker.prototype.updateImplicitSum =
    function(paintable, index) {

        var implicit_sum = undefined;

        if (paintable.pack_fix_sum !== undefined) {

            implicit_sum =
                this.calcFixDim(paintable, this.sum_org, this.sum_dim);
        }
        else {

            implicit_sum =
                this.getImplicit(this.sum_dim);

            implicit_sum += paintable.pack_padding_s;
            implicit_sum += paintable.pack_padding_e;

            if (index > 0) {

                implicit_sum += this.pack_spacing;
            }

            implicit_sum += paintable.getRequisite(this.sum_dim);
        }

        this.setImplicit(this.sum_dim, implicit_sum);
    };

ScoreLibrary.Renderer.PaintablePacker.prototype.updateImplicitMax =
    function(paintable, index) {

        var implicit_max = undefined;

        if (paintable.pack_fix_max !== undefined) {

            implicit_max =
                this.calcFixDim(paintable, this.max_org, this.max_dim);
        }
        else {

            implicit_max =
                this.getImplicit(this.max_dim);

            implicit_max =
                Math.max(implicit_max,
                         paintable.getRequisite(this.max_dim));
        }

        this.setImplicit(this.max_dim, implicit_max);
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
