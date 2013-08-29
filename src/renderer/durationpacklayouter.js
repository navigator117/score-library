goog.provide('ScoreLibrary.Renderer.DurationPackLayouter');
goog.require('ScoreLibrary.Renderer.PaintablePackLayouter');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Renderer.PaintablePackLayouter}
 */
ScoreLibrary.Renderer.DurationPackLayouter = function() {
};

ScoreLibrary.inherited(ScoreLibrary.Renderer.DurationPackLayouter,
                       ScoreLibrary.Renderer.PaintablePackLayouter);

ScoreLibrary.Renderer.DurationPackLayouter.prototype.filterChild =
    function(child) {

        var supperclass =
            ScoreLibrary.Renderer.DurationPackLayouter.supperclass;

        return (child.pack_duration === undefined ||
                supperclass.filterChild.call(this, child));
    };

ScoreLibrary.Renderer.DurationPackLayouter.prototype.expandChildFilling =
    function(allocation, child, child_origins, child_allocation,
             extra_space, child_extra_space) {

        if (child.pack_duration !== undefined && child.fill_duration) {

            child_allocation[this.sum_dim] =
                this.calcChildOffset(child, extra_space, true) -
                this.calcChildOffset(child, extra_space);

            return;
        }

        if (child.pack_duration !== undefined) {

            var information =
                this.getInformation(child.pack_duration, true);

            child_allocation[this.sum_dim] = information[this.sum_dim];
        }

        var supperclass =
            ScoreLibrary.Renderer.DurationPackLayouter.supperclass;

        supperclass.expandChildFilling.call(
            this, allocation,
            child, child_origins, child_allocation,
            extra_space, child_extra_space);

    };

ScoreLibrary.Renderer.DurationPackLayouter.prototype.calcChildExtraSpace =
    function(child, extra_space, child_expand_count) {

        if (child.pack_duration !== undefined) {

            var duration =
                this.keyDurationToDuration(child.pack_duration);

            return (extra_space * duration / this.getMaxDuration());
        }
        else {

            var supperclass =
                ScoreLibrary.Renderer.DurationPackLayouter.supperclass;

            return supperclass.calcChildExtraSpace.call(
                this, child, extra_space, child_expand_count);
        }
    };

ScoreLibrary.Renderer.DurationPackLayouter.prototype.packStartChildSumOrg =
    function(allocation, child, child_origins, child_allocation,
             extra_space, child_expand_count) {

        if (child.pack_duration !== undefined) {

            child_origins[this.sum_org] =
                this.calcChildOffset(child, extra_space);
        }
        else {

            var supperclass =
                ScoreLibrary.Renderer.DurationPackLayouter.supperclass;

            supperclass.packStartChildSumOrg.call(
                this, allocation, child, child_origins, child_allocation);
        }
    };

ScoreLibrary.Renderer.DurationPackLayouter.prototype.calcChildOffset =
    function(child, extra_space, end_offset) {

        var offset_duration = child.pack_duration;

        if (end_offset) {

            offset_duration += child.duration;
        }

        var offset = extra_space * offset_duration / this.getMaxDuration();

        var all_informations =
            this.getAllInformations(true);

        var offset_index =
            this.keyDurationToIndex(offset_duration);

        if (offset_index < 0) {

            offset_index = all_informations.length;
        }

        if (offset_index >= 1) {

            all_informations.some(

                function(information, index) {

                    if (index < offset_index) {

                        offset += information[this.sum_dim];

                        offset += information.padding_s;
                        offset += information.padding_e;

                        return false;
                    }

                    return true;
                }, this);
        }

        if (offset_index > 0) {

            offset += offset_index * this.pack_spacing;
        }

        offset += child.pack_padding_s;

        return offset;
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
