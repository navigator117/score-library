goog.provide('ScoreLibrary.Renderer.DurationPacker');
goog.require('ScoreLibrary.Renderer.PaintablePacker');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Renderer.PaintablePacker}
 */
ScoreLibrary.Renderer.DurationPacker = function() {
};

ScoreLibrary.inherited(ScoreLibrary.Renderer.DurationPacker,
                       ScoreLibrary.Renderer.PaintablePacker);

ScoreLibrary.Renderer.DurationPacker.prototype.pack =
    function(paintable, expand, fill,
             padding_s, padding_e, fix_org_coord, reverse) {

    if (paintable.pack_duration === undefined &&
        paintable.duration === undefined) {

        var paintable_model = paintable.getModel();
        if (paintable_model) {

            paintable.duration =
                paintable_model.getGcdDuration();
        }
    }

    goog.asserts.assert(
        !reverse,
        'ScoreLibrary.Renderer.DurationPacker.pack(): invalid argument!');

    var supperclass =
        ScoreLibrary.Renderer.DurationPacker.supperclass;

    return supperclass.pack.call(
        this, paintable,
        expand, fill, padding_s, padding_e,
        fix_org_coord, reverse);
};

ScoreLibrary.Renderer.DurationPacker.prototype.recordPackStyles =
    function(paintable, expand, fill,
             padding_s, padding_e, fix_org_coord, reverse) {

    var supperclass = ScoreLibrary.Renderer.DurationPacker.supperclass;

    supperclass.recordPackStyles.apply(this, arguments);

    var keyConflictResolver = function(old_information, new_infomation) {

        ScoreLibrary.extend(old_information, new_infomation, Math.max);
    };

    var information = {};

    information[this.sum_dim] =
        paintable.getRequisite(this.sum_dim);

    information.padding_s = paintable.pack_padding_s;
    information.padding_e = paintable.pack_padding_e;

    if (paintable.mapInfoHook) {

        information =
            paintable.mapInfoHook.trait(
                this, paintable, information);

        delete paintable.mapInfoHook;
    }

    if (information) {

        if (paintable.pack_duration === undefined) {

            paintable.pack_duration =
                this.mapInformation(
                    paintable.duration,
                    information, true,
                    keyConflictResolver);
        }
        else {

            this.setInformation(
                paintable.pack_duration,
                    information, true,
                    keyConflictResolver);
        }
    }
};

ScoreLibrary.Renderer.DurationPacker.prototype.updateImplicitSum =
    function(paintable, index) {

    if (paintable.pack_wallit) {

        return;
    }

    if (paintable.duration >= 0) {

        var accumulate_sum = 0;

        var all_informations =
            this.getAllInformations(true);

        all_informations.forEach(

            function(information, index) {

                accumulate_sum += information[this.sum_dim];

                accumulate_sum += information.padding_s;
                accumulate_sum += information.padding_e;

                if (index > 0) {

                    accumulate_sum += this.pack_spacing;
                }
            }, this);

        var implicit_sum =
            this.getImplicit(this.sum_dim);

        implicit_sum = Math.max(implicit_sum, accumulate_sum);

        this.setImplicit(this.sum_dim, implicit_sum);
    }
    else {

        var supperclass = ScoreLibrary.Renderer.DurationPacker.supperclass;

        supperclass.updateImplicitSum.call(
            this, paintable, index);
    }
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
