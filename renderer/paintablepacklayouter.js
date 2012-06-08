goog.provide('ScoreLibrary.Renderer.PaintablePackLayouter');
goog.require('ScoreLibrary.Renderer.PaintableLayouter');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Renderer.PaintableLayouter}
 */
ScoreLibrary.Renderer.PaintablePackLayouter = function() {
};

ScoreLibrary.aggregate(
    ScoreLibrary.Renderer.PaintablePackLayouter,
    ScoreLibrary.Renderer.PaintableLayouter);

ScoreLibrary.Renderer.PaintablePackLayouter.prototype.setDirect =
    function(forward) {

        this.layout_reverse = !forward;
    };

ScoreLibrary.Renderer.PaintablePackLayouter.prototype.isForward = function() {

    return !this.isReverse();
};

ScoreLibrary.Renderer.PaintablePackLayouter.prototype.isReverse = function() {

    return this.layout_reverse;
};

ScoreLibrary.Renderer.PaintablePackLayouter.prototype.calcExtraSpace =
    function(allocation) {

        return (allocation[this.sum_dim] - this.getImplicit(this.sum_dim));
    };

ScoreLibrary.Renderer.PaintablePackLayouter.prototype.calcExpandChildCount =
    function() {

        var child_expand_count = 0;

        this.findChild(

            function(child, index, children) {

                if (this.filterChild(child)) {

                    return false;
                }

                // !NOTE: fix sum dimension paintable's expand algorithm is
                // different, and, NOT count here.
                if (!child.pack_fix_sum &&
                    (child.pack_expand_filling ||
                     child.pack_expand_padding)) {

                    ++child_expand_count;
                }

                return false;
            }, this);

        return child_expand_count;
    };

ScoreLibrary.Renderer.PaintablePackLayouter.prototype.calcChildExtraSpace =
    function(child, extra_space, child_expand_count) {

        return extra_space / child_expand_count;
    };

ScoreLibrary.Renderer.PaintablePackLayouter.prototype.expandChildFilling =
    function(allocation, child, child_origins,
             child_allocation, extra_space, child_extra_space) {

        child_allocation[this.sum_dim] += child_extra_space;

        if (child.pack_fix_sum !== undefined) {

            // !NOTE: Add for special case.
            child_allocation[this.sum_dim] =
                this.getFixOrg(this.sum_org) +
                allocation[this.sum_dim] -
                child.pack_fix_sum;
        }
    };

ScoreLibrary.Renderer.PaintablePackLayouter.prototype.expandChildPadding =
    function(allocation, child, child_origins,
             child_allocation, extra_space, child_extra_space) {

        child.pack_padding_s_old =
            child.pack_padding_s;

        child.pack_padding_e_old =
            child.pack_padding_e;

        // !NOTE: may cause binary-float bug.
        var extra_padding_s = child_extra_space * 0.5;
        var extra_padding_e = child_extra_space * 0.5;

        if (child.pack_padding_s !==
            child.pack_padding_e) {

            extra_padding_s =
                child_extra_space * child.pack_padding_s /
                (child.pack_padding_s + child.pack_padding_e);

            extra_padding_e =
                child_extra_space * child.pack_padding_e /
                (child.pack_padding_s + child.pack_padding_e);
        }

        child.pack_padding_s += extra_padding_s;
        child.pack_padding_e += extra_padding_e;
    };

ScoreLibrary.Renderer.PaintablePackLayouter.prototype.getFixOrg =
    function(fix_org) {

        return (this.fix_org_coord ?
                this.getOrg(this.fix_org_coord, fix_org) :
                undefined);
    };

ScoreLibrary.Renderer.PaintablePackLayouter.prototype.initChildOrigins =
    function(child_origins, allocation) {

        child_origins[this.sum_org] =
            (this.isReverse() ? allocation[this.sum_dim] : 0);
        child_origins[this.max_org] = 0;
    };

ScoreLibrary.Renderer.PaintablePackLayouter.prototype.initChildAllocation =
    function(child, child_allocation) {

        child_allocation[this.sum_dim] = child.getRequisite(this.sum_dim);
        child_allocation[this.max_dim] = child.getRequisite(this.max_dim);
    };

/*
  ScoreLibrary.Renderer.PaintablePackLayouter.prototype.initChildPadding =
  function(child) {
  };
*/

ScoreLibrary.Renderer.PaintablePackLayouter.prototype.packStartChildSumOrg =
    function(allocation, child, child_origins, child_allocation) {

        if (this.isForward()) {

            child_origins[this.sum_org] += child.pack_padding_s;
        }
        else {

            child_origins[this.sum_org] -= child_allocation[this.sum_dim];
            child_origins[this.sum_org] -= child.pack_padding_s;
        }

        if (child.pack_fix_sum !== undefined) {

            child_origins[this.sum_org] =
                child.pack_fix_sum - this.getFixOrg(this.sum_org);
        }
    };

ScoreLibrary.Renderer.PaintablePackLayouter.prototype.packEndChildSumOrg =
    function(allocation, child, child_origins, child_allocation) {

        if (this.isForward()) {

            child_origins[this.sum_org] += child_allocation[this.sum_dim];

            child_origins[this.sum_org] += child.pack_padding_e;
            child_origins[this.sum_org] += this.pack_spacing;
        }
        else {

            child_origins[this.sum_org] -= child.pack_padding_e;
            child_origins[this.sum_org] -= this.pack_spacing;
        }
    };

ScoreLibrary.Renderer.PaintablePackLayouter.prototype.packStartChildMaxOrg =
    function(allocation, child, child_origins, child_allocation) {

        if (child.pack_fix_max !== undefined) {

            child_origins[this.max_org] =
                child.pack_fix_max - this.getFixOrg(this.max_org);
        }

        if (child.pack_filling_max) {

            child_allocation[this.max_dim] =
                allocation[this.max_dim] - child_origins[this.max_org];
        }
    };

ScoreLibrary.Renderer.PaintablePackLayouter.prototype.packEndChildMaxOrg =
    function(allocation, child, child_origins, child_allocation) {

        /* NOTHING */
    };

ScoreLibrary.Renderer.PaintablePackLayouter.prototype.filterChild =
    function(paintable) {

        return (this.isReverse() ?
                !paintable.pack_reverse :
                !paintable.pack_forward);
    };

ScoreLibrary.Renderer.PaintablePackLayouter.prototype.sizeAllocateRecursively =
    function(allocation) {

        if (!this.sizeAllocate(allocation)) {

            return false;
        }

        if (!this.sizeAllocateChildren(allocation)) {

            return false;
        }

        return true;
    };

ScoreLibrary.Renderer.PaintablePackLayouter.prototype.sizeAllocateChildren =
    function(allocation) {

        if (this.getChildCount() > 0) {

            var extra_space =
                this.calcExtraSpace(allocation);

            if (this.pack_children_forward) {

                this.setDirect(true);

                if (!this.layoutChildren(allocation, extra_space)) {

                    return false;
                }
            }

            if (this.pack_children_reverse) {

                this.setDirect(false);

                if (!this.layoutChildren(allocation, extra_space)) {

                    return false;
                }
            }
        }

        return true;
    };

ScoreLibrary.Renderer.PaintablePackLayouter.prototype.layoutChildren =
    function(allocation, extra_space) {

        var child_expand_count =
            this.calcExpandChildCount();

        var child_origins = {};
        var child_allocation = {};

        this.initChildOrigins(child_origins, allocation);

        if (this.findChild(

            function(child, index, children) {

                if (this.filterChild(child)) {

                    return false;
                }

                this.initChildAllocation(child, child_allocation);
                //          this.initChildPadding(child);

                if (child.pack_expand_filling) {

                    this.expandChildFilling(
                        allocation,
                        child, child_origins, child_allocation,
                        extra_space, this.calcChildExtraSpace(
                            child, extra_space, child_expand_count));
                }

                if (child.pack_expand_padding) {

                    this.expandChildPadding(
                        allocation,
                        child, child_origins, child_allocation,
                        extra_space, this.calcChildExtraSpace(
                            child, extra_space, child_expand_count));
                }

                this.packStartChildSumOrg(
                    allocation,
                    child, child_origins, child_allocation,
                    extra_space, child_expand_count);

                this.packStartChildMaxOrg(
                    allocation,
                    child, child_origins, child_allocation,
                    extra_space, child_expand_count);

                child.setOrg(
                    'parent', this.sum_org, child_origins[this.sum_org]);
                child.setOrg(
                    'parent', this.max_org, child_origins[this.max_org]);

                if (!child.sizeAllocateRecursively(child_allocation)) {

                    return true;
                }

                this.packEndChildSumOrg(allocation,
                                        child, child_origins, child_allocation,
                                        extra_space, child_expand_count);

                this.packEndChildMaxOrg(allocation,
                                        child, child_origins, child_allocation,
                                        extra_space, child_expand_count);

                return false;
            }, this)) {

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
