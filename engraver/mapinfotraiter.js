goog.provide('ScoreLibrary.Engraver.MapInfoTraiter');
goog.require('ScoreLibrary.Engraver');
goog.require('ScoreLibrary.Score.Clef');
goog.require('ScoreLibrary.Score.Connector');
goog.require('ScoreLibrary.Score.Key');
goog.require('ScoreLibrary.Score.Note');
goog.require('ScoreLibrary.Score.Slur');
goog.require('ScoreLibrary.Score.Staff');
goog.require('ScoreLibrary.Score.Time');

/**
 * @constructor
 */
ScoreLibrary.Engraver.MapInfoTraiter = function() {
};

ScoreLibrary.Engraver.MapInfoTraiter.prototype.trait =
    function(packer, paintable, information) {

        var model = paintable.getModel();

        goog.asserts.assert(
            model,
            'ScoreLibrary.Engraver.MapInfoTraiter.trait(): invalid argument!');

        if (ScoreLibrary.Score.Note.prototype.isPrototypeOf(model) ||
            ScoreLibrary.Score.Clef.prototype.isPrototypeOf(model) ||
            ScoreLibrary.Score.Time.prototype.isPrototypeOf(model) ||
            ScoreLibrary.Score.Key.prototype.isPrototypeOf(model)) {

            return this.traitDatas(packer, paintable, information);
        }
        else if (ScoreLibrary.Score.Staff.prototype.isPrototypeOf(model)) {

            return this.traitStaff(packer, paintable, information);
        }
        else if (ScoreLibrary.Score.Connector.prototype.isPrototypeOf(model)) {

            return this.traitConnector(packer, paintable);
        }

        return undefined;
    };

ScoreLibrary.Engraver.MapInfoTraiter.prototype.convertBoundValue =
    function(is_upper_bound, value) {

        return (value === undefined ?
                undefined : (is_upper_bound ? value : -value));
    };

ScoreLibrary.Engraver.MapInfoTraiter.prototype.traitDatas =
    function(staff_stream, paintable, information) {

        var notes_lower_bound = paintable.pack_fix_max || 0;
        var notes_upper_bound =
            notes_lower_bound + paintable.getRequisite(staff_stream.max_dim);

        var staff_lower_bound = notes_lower_bound;
        var staff_upper_bound = notes_upper_bound;

        var staff = paintable.getModel().getStaff();
        if (staff) {

            staff_lower_bound =
                Math.min(staff_lower_bound,
                         staff.getYOfLineInStaffCoord(1));

            staff_upper_bound =
                Math.max(staff_upper_bound,
                         staff.getYOfLineInStaffCoord(
                             staff.getNumberOfLines()));
        }

        // !NOTE: convert first then save,
        // cause staff_stream only save max value.
        information['notes_lower_bound_' + staff_stream.stream_id] =
            this.convertBoundValue(false, notes_lower_bound);
        information['notes_upper_bound_' + staff_stream.stream_id] =
            this.convertBoundValue(true, notes_upper_bound);

        information['staff_lower_bound_' + staff_stream.stream_id] =
            this.convertBoundValue(false, staff_lower_bound);
        information['staff_upper_bound_' + staff_stream.stream_id] =
            this.convertBoundValue(true, staff_upper_bound);

        return information;
    };

ScoreLibrary.Engraver.MapInfoTraiter.prototype.traitStaff =
    function(staff_stream, paintable, information) {

        var staff_duration_prop = 'staff_duration_p';

        staff_duration_prop += paintable.part_index;

        information[staff_duration_prop] = paintable.duration;

        return information;
    };

ScoreLibrary.Engraver.MapInfoTraiter.prototype.setExtraSpace =
    function(extra_space) {

        this.extra_space = extra_space;
    };

ScoreLibrary.Engraver.MapInfoTraiter.prototype.combineBoundary =
    function(placement, direction, stream_id) {

        var boundary = '';

        boundary += placement;
        boundary += '_';
        boundary += direction;
        boundary += '_bound_';
        boundary += stream_id;

        return boundary;
    };

ScoreLibrary.Engraver.MapInfoTraiter.prototype.compareBoundaries =
    function(paintable, paintable_fix_max, staff_stream,
             is_notes_bound, is_upper_bound) {

        var connector = paintable.getModel();

        var requisite_sum = paintable.getRequisite(staff_stream.sum_dim);
        var requisite_max = paintable.getRequisite(staff_stream.max_dim);

        var all_informations = staff_stream.getAllInformations(true);

        var key_index =
            staff_stream.keyDurationToIndex(paintable.pack_duration);

        var end_index = all_informations.length - 1;

        if (paintable.pack_duration_n >= 0) {

            requisite_sum = 0;

            end_index =
                staff_stream.keyDurationToIndex(paintable.pack_duration_n);
        }

        // !NOTE: only use below for slur bound value calc.
        var mid_index = (key_index + end_index) * 0.5;

        if (end_index < key_index) {

            var temp = end_index;
            end_index = key_index;
            key_index = temp;

            temp = paintable.pack_duration;
            paintable.pack_duration_n = paintable.pack_duration;
            paintable.pack_duration = temp;
        }

        goog.asserts.assert(
            key_index >= 0 && end_index >= key_index &&
                requisite_sum >= 0 && requisite_max >= 0,
            'ScoreLibrary.Engraver.MapInfoTraiter.compareBoundaries(): ' +
                'unexpect!');

        var boundary_val = undefined;

        for (this.curr_index = key_index;
             (requisite_sum >= 0 || paintable.pack_duration_n >= 0) &&
             this.curr_index <= end_index; ++this.curr_index) {

            var information = all_informations[this.curr_index];

            boundary_val = this.convertBoundValue(
                is_upper_bound, information[paintable.boundary]);

            if (boundary_val !== undefined) {

                if (paintable_fix_max === undefined) {

                    paintable_fix_max = boundary_val;
                    paintable.boundary_value_s = boundary_val;
                }
                else {

                    if (ScoreLibrary.Score.Slur.prototype.isPrototypeOf(
                        connector) &&
                        (end_index - key_index) > 2 &&
                        (is_upper_bound ?
                         boundary_val > paintable_fix_max :
                         boundary_val < paintable_fix_max)) {

                        boundary_val -=
                            (is_upper_bound ? 1 : -1) * requisite_max *
                            (1 - Math.abs(this.curr_index - mid_index) /
                             (mid_index - key_index));
                    }

                    paintable_fix_max =
                        (is_upper_bound ?
                         Math.max(paintable_fix_max, boundary_val) :
                         Math.min(paintable_fix_max, boundary_val));
                }
            }

            var next_key_duration =
                (this.curr_index === all_informations.length - 1 ?
                 staff_stream.getMaxDuration() :
                 all_informations[this.curr_index + 1].key_duration);

            var current_sum =
                this.extra_space *
                (next_key_duration - information.key_duration) /
                staff_stream.getMaxDuration();

            current_sum += information[staff_stream.sum_dim];
            current_sum += information.padding_s;
            current_sum += information.padding_e;
            current_sum += staff_stream.pack_spacing;

            goog.asserts.assert(
                current_sum > 0,
                'ScoreLibrary.Engraver.MapInfoTraiter.traitConnector(): ' +
                    'unexpect current_sum!');

            if (paintable.pack_duration_n >= 0) {

                requisite_sum += current_sum;

                if (paintable.pack_duration_n === information.key_duration) {

                    paintable.setExplicit(staff_stream.sum_dim, requisite_sum);
                    paintable.boundary_value_e = boundary_val;
                }
            }
            else {

                requisite_sum -= current_sum;
            }
        }

        return paintable_fix_max;
    };

ScoreLibrary.Engraver.MapInfoTraiter.prototype.updateBoundaries =
    function(paintable, staff_stream,
             is_notes_bound, is_upper_bound, boundary_val) {

        var all_informations = staff_stream.getAllInformations(true);

        var key_index =
            staff_stream.keyDurationToIndex(paintable.pack_duration);

        for (; key_index < this.curr_index; ++key_index) {

            var information = all_informations[key_index];

            information[paintable.boundary] =
                this.convertBoundValue(is_upper_bound, boundary_val);

            if (paintable.staff_boundary) {

                var staff_boundary_val =
                    this.convertBoundValue(
                        is_upper_bound, information[paintable.staff_boundary]);

                staff_boundary_val =
                    (is_upper_bound ?
                     Math.max(staff_boundary_val, boundary_val) :
                     Math.min(staff_boundary_val, boundary_val));

                information[paintable.staff_boundary] =
                    this.convertBoundValue(is_upper_bound, staff_boundary_val);
            }
        }
    };

ScoreLibrary.Engraver.MapInfoTraiter.prototype.traitConnector =
    function(staff_stream, paintable, placement, direction) {

        var connector = paintable.getModel();

        placement = placement || connector.getPlacement();
        direction = direction || connector.getDirection();

        goog.asserts.assert(
            paintable.pack_duration >= 0 &&
                (placement === 'staff' || placement === 'notes') &&
                (direction === 'upper' || direction === 'lower') &&
                staff_stream.fix_org_coord,
            'ScoreLibrary.Engraver.MapInfoTraiter.traitConnector(): ' +
                'invalid argument!');

        var is_notes_bound = (placement === 'notes');
        var is_upper_bound = (direction === 'upper');

        paintable.boundary =
            this.combineBoundary(placement, direction, staff_stream.stream_id);

        if (is_notes_bound) {

            paintable.staff_boundary =
                this.combineBoundary(
                    'staff', direction, staff_stream.stream_id);
        }

        this.extra_space = this.extra_space || 0;

        var paintable_fix_max =
            paintable.getOrg(
                staff_stream.fix_org_coord, staff_stream.max_org);
        if (paintable_fix_max === undefined) {

            paintable_fix_max =
                this.compareBoundaries(
                    paintable, paintable_fix_max, staff_stream,
                    is_notes_bound, is_upper_bound);

            goog.asserts.assert(
                paintable_fix_max !== undefined,
                'ScoreLibrary.Engraver.MapInfoTraiter.traitConnector(): ' +
                    'unexpect paintable_fix_max!');

            paintable_fix_max =
                paintable_fix_max +
                (is_upper_bound ? 1 : -1) * connector.getYMove();

            var requisite_max = paintable.getRequisite(staff_stream.max_dim);

            var boundary_val =
                paintable_fix_max + (is_upper_bound ? 1 : -1) * requisite_max;

            if (requisite_max > 0 && connector.isWallerBlock()) {

                this.updateBoundaries(
                    paintable, staff_stream,
                    is_notes_bound, is_upper_bound,
                    boundary_val);
            }

            paintable_fix_max =
                (is_upper_bound ? paintable_fix_max : boundary_val);

            paintable.setOrg(
                staff_stream.fix_org_coord, staff_stream.max_org,
                paintable_fix_max);
        }

        paintable.pack_fix_max = paintable_fix_max;

        paintable.pack_wallit = true;

        return undefined;
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
