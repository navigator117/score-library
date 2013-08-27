goog.provide('ScoreLibrary.Engraver.Attributes');
goog.require('ScoreLibrary.Engraver');
goog.require('ScoreLibrary.Engraver.MapInfoTraiter');
goog.require('ScoreLibrary.Renderer.Part');
goog.require('ScoreLibrary.Score.Attributes');

/**
 * @constructor
 */
ScoreLibrary.Engraver.Attributes = function(context) {

    this.context = context;
    this.glyph_factory =
        context.getCustomTextRenderer().getGlyphFactory();
};

ScoreLibrary.Engraver.Attributes.prototype.engrave =
    function(attributes, renderer) {

        renderer = renderer || new ScoreLibrary.Renderer.Part();

        if (attributes.prev) {
            // !NOTE: clef of first attributes in measure will NOT show.
            this.engraveClefOfStaves(attributes, renderer);
        }

        this.engraveKeyOfStaves(attributes, renderer);
        this.engraveTimeOfStaves(attributes, renderer);

        return renderer;
    };

ScoreLibrary.Engraver.Attributes.prototype.engraveClefOfStaves =
    function(attributes, renderer, first_measure_in_system) {

        return this.forEachStaffEngraveAttribute(
            attributes, this.findClef, this.engraveClef, renderer,
            first_measure_in_system);
    };

ScoreLibrary.Engraver.Attributes.prototype.engraveKeyOfStaves =
    function(attributes, renderer, first_measure_in_system) {

        return this.forEachStaffEngraveAttribute(
            attributes, this.findKey, this.engraveKey, renderer,
            first_measure_in_system);
    };

ScoreLibrary.Engraver.Attributes.prototype.engraveTimeOfStaves =
    function(attributes, renderer, first_measure_in_system) {

        return this.forEachStaffEngraveAttribute(
            attributes, this.findTime, this.engraveTime, renderer,
            first_measure_in_system);
    };

ScoreLibrary.Engraver.Attributes.prototype.engraveStaffOfStaves =
    function(attributes, renderer, accumulated_duration) {

        return this.forEachStaffEngraveAttribute(
            attributes, this.findStaff, this.engraveStaff, renderer,
            accumulated_duration);
    };

ScoreLibrary.Engraver.Attributes.prototype.forEachStaffEngraveAttribute =
    function(attributes, find_handler, engrave_handler, renderer,
             additional_parameter) {

        var delta_duration = 0;

        var num_of_staves = attributes.getTunnelStates().getNumberOfStaves();

        for (var staff_number = 1;
             staff_number <= num_of_staves;
             ++staff_number) {

            var attribute = find_handler.call(
                this, attributes, staff_number, additional_parameter);

            renderer.save();

            if (attribute) {

                duration = engrave_handler.call(
                    this, attribute,
                    renderer.findStaffStream(staff_number, true),
                    additional_parameter);
            }

            delta_duration = renderer.restore();
        }

        if (delta_duration === 0) {
            // !NOTE: Add as Place Holder.
            delta_duration =
                ScoreLibrary.Score.Element.Constants.dummyDuration;
        }

        renderer.accumulate(delta_duration);

        return delta_duration;
    };

ScoreLibrary.Engraver.Attributes.prototype.findClef =
    function(attributes, staff_number, first_measure_in_system) {

        var clef = first_measure_in_system ?
            attributes.getTunnelStates().getClefByNumber(staff_number) :
            attributes.getClefByNumber(staff_number);

        return clef;
    };

ScoreLibrary.Engraver.Attributes.prototype.engraveClef =
    function(clef, renderer, first_measure_in_system) {

        if (clef) {

            var clef_renderer =
                clef.createRenderer(
                    this.glyph_factory, first_measure_in_system);

            if (clef_renderer) {

                var outline_bbox =
                    clef_renderer.getOutlineBoundbox();

                var y = clef.getYOnStaff() + outline_bbox.y_min;

                var fix_org_coord = 'staff';

                clef_renderer.setOrg(fix_org_coord, 'y', y);

                clef_renderer.mapInfoHook =
                    new ScoreLibrary.Engraver.MapInfoTraiter();

                var padding_s = 5;
                var padding_e = 10;

                renderer.pack(
                    clef_renderer,
                    true, false, padding_s, padding_e,
                    fix_org_coord);

                if (clef.clef_octave_change) {

                    var textbox = new ScoreLibrary.Renderer.TextBox();

                    var text = '';

                    text += Math.abs(clef.clef_octave_change * 8);

                    textbox.setText(text, '10px sans-serif', this.context);

                    var staff = clef.getStaff();

                    if (clef.clef_octave_change > 0) {

                        y += (outline_bbox.y_max - outline_bbox.y_min);

                        y = Math.max(y,
                                     staff.getYOfLineInStaffCoord(
                                         staff.getNumberOfLines()));

                        y += 2;
                    }
                    else {

                        y = Math.min(y, staff.getYOfLineInStaffCoord(1));

                        y -= textbox.getRequisite('height');

                        y -= 2;
                    }

                    textbox.setOrg(fix_org_coord, 'y', y);

                    textbox.pack_duration = clef_renderer.pack_duration;

                    padding_s += (outline_bbox.x_max -
                                  outline_bbox.x_min -
                                  textbox.getRequisite('width')) * 0.5;

                    renderer.pack(
                        textbox, false, false, padding_s, 0, fix_org_coord);
                }

                return clef.getGcdDuration();
            }
        }

        return 0;
    };

ScoreLibrary.Engraver.Attributes.prototype.findKey =
    function(attributes, staff_number, first_measure_in_system) {

        var tunnel_states = attributes.getTunnelStates();

        var staff = tunnel_states.getStaffByNumber(staff_number);
        var clef = tunnel_states.getClefByNumber(staff_number);

        var key = undefined;

        if (!(staff.getStaffType() === 'alternate' && clef.sign === 'TAB')) {

            key = first_measure_in_system ?
                attributes.getTunnelStates().getKeyByNumber(staff_number) :
                attributes.getKeyByNumber(staff_number);
        }

        return key;
    };

ScoreLibrary.Engraver.Attributes.prototype.engraveKey =
    function(key, renderer, first_measure_in_system) {

        if (key) {

            var key_renderer =
                key.createRenderer(this.glyph_factory);

            if (key_renderer) {

                var fix_org_coord = 'staff';

                key_renderer.mapInfoHook =
                    new ScoreLibrary.Engraver.MapInfoTraiter();

                renderer.pack(key_renderer, true, false, 0, 10, fix_org_coord);

                return key.getGcdDuration();
            }
        }

        return 0;
    };

ScoreLibrary.Engraver.Attributes.prototype.findTime =
    function(attributes, staff_number, first_measure_in_system) {

        var tunnel_states = attributes.getTunnelStates();

        var staff = tunnel_states.getStaffByNumber(staff_number);
        var clef = tunnel_states.getClefByNumber(staff_number);

        var time = undefined;

        if (!(staff.getStaffType() === 'alternate' && clef.sign === 'TAB')) {

            time = first_measure_in_system ?
                attributes.getTunnelStates().getTimeByNumber(staff_number) :
                attributes.getTimeByNumber(staff_number);
        }

        return time;
    };

ScoreLibrary.Engraver.Attributes.prototype.engraveTime =
    function(time, renderer, first_measure_in_system) {

        if (time) {

            var time_renderer =
                time.createRenderer(this.glyph_factory);

            if (time_renderer) {

                var outline_bbox =
                    time_renderer.getOutlineBoundbox();

                staff = time.getStaff();

                var y = staff.getYOfLineInStaffCoord(
                    staff.getCenterLineNumber()) +
                    outline_bbox.y_min;

                var fix_org_coord = 'staff';

                time_renderer.setOrg(fix_org_coord, 'y', y);

                time_renderer.mapInfoHook =
                    new ScoreLibrary.Engraver.MapInfoTraiter();

                renderer.pack(time_renderer, true, false, 0, 10, fix_org_coord);

                return time.getGcdDuration();
            }
        }

        return 0;
    };

ScoreLibrary.Engraver.Attributes.prototype.findStaff =
    function(attributes, staff_number) {

        var staff =
            attributes.getTunnelStates().getStaffByNumber(staff_number);

        return staff;
    };

ScoreLibrary.Engraver.Attributes.prototype.engraveStaff =
    function(staff, renderer, accumulated_duration) {

        if (staff) {

            // !NOTE: we need each staff for each engraved renderer,
            // for gcd duration must be measure-wise.
            staff = staff.clone();

            var staff_renderer =
                staff.createRenderer(this.glyph_factory);

            if (staff_renderer) {

                staff.setGcdDuration(accumulated_duration);

                var y = staff.toYOfAboveStaffCoord(0);

                // y -= staff.getHeightOfSpace() * 0.5 *
                // (5 - staff.getNumberOfLines());

                var fix_org_coord = 'staff';

                staff_renderer.setOrg(fix_org_coord, 'y', y);

                staff_renderer.fill_duration = true;

                staff_renderer.part_index = renderer.part_index;

                staff_renderer.mapInfoHook =
                    new ScoreLibrary.Engraver.MapInfoTraiter();

                renderer.pack(staff_renderer, true, true, 0, 0, fix_org_coord);

                return accumulated_duration;
            }
        }

        return 0;
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
