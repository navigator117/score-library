goog.provide('ScoreLibrary.Engraver.Measure');
goog.require('ScoreLibrary.Engraver');
goog.require('ScoreLibrary.Engraver.Attributes');
goog.require('ScoreLibrary.Engraver.Barline');
goog.require('ScoreLibrary.Engraver.Chord');
goog.require('ScoreLibrary.Engraver.Mover');
goog.require('ScoreLibrary.Engraver.Note');
goog.require('ScoreLibrary.Engraver.Rest');
goog.require('ScoreLibrary.Renderer.Part');
goog.require('ScoreLibrary.Score.Measure');

/**
 * @constructor
 */
ScoreLibrary.Engraver.Measure = function(context) {

    this.context = context;

    this.glyph_factory =
        context.getCustomTextRenderer().getGlyphFactory();
};

ScoreLibrary.Engraver.Measure.prototype.engrave =
    function(measure, first_measure_in_system, part_renderer,
             duration_mapper, part_index, num_of_part) {

        if (!part_renderer) {

            part_renderer = new ScoreLibrary.Renderer.Part();

            if (duration_mapper) {

                part_renderer.setMapper(duration_mapper);
            }

            part_renderer.part_index = part_index;
        }

        if (first_measure_in_system) {

            part_renderer.setModel(measure);
        }

        if (measure.prev &&
            first_measure_in_system &&
            part_index === num_of_part - 1) {

            this.engraveMeasureNumber(measure, part_renderer);
        }

        var child_iterator =
            ScoreLibrary.Score.ElementIterFactory.create(measure);

        while (child_iterator.hasNext()) {

            child_element = child_iterator.next();

            this.engraveChildElement(
                part_renderer, child_element,
                first_measure_in_system, child_iterator);
        }

        this.engraveStavesToChildElement(part_renderer, child_element);

        return part_renderer;
    };

ScoreLibrary.Engraver.Measure.prototype.engraveMeasureNumber =
    function(measure, part_renderer) {

        var textbox = new ScoreLibrary.Renderer.TextBox();

        textbox.setText(
            measure.folded_index + 1, '10px sans-serif', this.context);

        var fix_org_coord = 'staff';

        var tunnel_states = measure.getTunnelStates();
        if (tunnel_states) {

            var staff = tunnel_states.getStaffByNumber(1);

            textbox.setOrg(
                fix_org_coord, 'y',
                staff.getYOfLineInStaffCoord(staff.getNumberOfLines()) + 5);

            textbox.duration = 0;

            part_renderer.findStaffStream(1, true).pack(
                textbox, false, false, 0, 0, fix_org_coord);
        }
    };

ScoreLibrary.Engraver.Measure.prototype.engraveSystemEnd =
    function(measure, part_renderer) {

        var isNextSystemHasTimesKeys = function(next_measure) {

            if (next_measure) {

                var child_iterator =
                    ScoreLibrary.Score.ElementIterFactory.create(next_measure);

                var next_attributes = undefined;

                if (child_iterator.hasNext()) {

                    next_attributes = child_iterator.next();

                    if (!(ScoreLibrary.Score.Attributes.prototype.isPrototypeOf(
                        next_attributes) &&
                          (next_attributes.keys ||
                           next_attributes.times))) {

                        next_attributes = undefined;
                    }
                }
            }

            return next_attributes;
        };

        var engraveTimesKeysOfNextSystem =
            function(next_attributes, part_renderer) {

                var gcd_duration = 0;

                var engraver =
                    new ScoreLibrary.Engraver.Attributes(this.context);

                gcd_duration +=
                engraver.engraveKeyOfStaves(next_attributes, part_renderer);

                gcd_duration +=
                engraver.engraveTimeOfStaves(next_attributes, part_renderer);

                return gcd_duration;
            };

        var updateDurationsOfSystemEndStaves =
            function(part_renderer, gcd_duration) {

                part_renderer.findChild(
                    function(staff_stream, index) {

                        var staff_renderer_index =
                            staff_stream.getChildCount() - 1;

                        do {

                            var staff_renderer =
                                staff_stream.getChild(staff_renderer_index);

                            if (ScoreLibrary.Renderer.Staff.prototype.
                                isPrototypeOf(staff_renderer)) {

                                var staff = staff_renderer.getModel();

                                staff.setGcdDuration(
                                    gcd_duration + staff.getGcdDuration());

                                staff_renderer.duration =
                                    staff.getGcdDuration();

                                break;
                            }
                        } while (--staff_renderer_index >= 0);

                        return false;
                    }, this);
            };

        var gcd_duration = 0;

        var next_attributes =
            isNextSystemHasTimesKeys(measure.next, part_renderer);

        var iterator =
            ScoreLibrary.Score.ElementIterFactory.create(measure, true);

        var barline_element = iterator.prev();

        if (!ScoreLibrary.Score.Barline.prototype.isPrototypeOf(
            barline_element)) {

            var prev_element = barline_element;

            barline_element =
                new ScoreLibrary.Score.Barline(measure, '<barline/>');

            barline_element.tunnel_states = prev_element.tunnel_states;
            barline_element.part_symbol = prev_element.part_symbol;

            barline_element.prev = prev_element;
        }

        // System Last Barline
        gcd_duration +=
        this.engraveBarline(
            barline_element, part_renderer, (next_attributes ? false : true));

        if (next_attributes) {

            gcd_duration += engraveTimesKeysOfNextSystem.call(
                this, next_attributes, part_renderer);
        }

        updateDurationsOfSystemEndStaves(part_renderer, gcd_duration);

        return gcd_duration;
    };

ScoreLibrary.Engraver.Measure.prototype.engraveColumn =
    function(measure_column, first_measure_in_system,
             part_renderers, duration_mapper) {

        part_renderers = part_renderers || [];

        var duration_mapper =
            duration_mapper || new ScoreLibrary.DurationMapper();

        var delta_duration = 0;

        measure_column.forEach(
            function(measure, index, measures) {

                duration_mapper.save();

                part_renderers[index] =
                    this.engrave(
                        measure, first_measure_in_system,
                        (part_renderers ? part_renderers[index] : undefined),
                         duration_mapper, index, measures.length);

                delta_duration = duration_mapper.restore();
            }, this);

        duration_mapper.accumulate(delta_duration);

        return part_renderers;
    };

ScoreLibrary.Engraver.Measure.prototype.engraveColumnSystemEnds =
    function(measure_column, part_renderers, duration_mapper) {

        var duration_mapper =
            duration_mapper || new ScoreLibrary.DurationMapper();

        var delta_duration = 0;

        measure_column.forEach(
            function(measure, index, measures) {

                duration_mapper.save();

                this.engraveSystemEnd(
                    measure, part_renderers[index]);

                delta_duration = duration_mapper.restore();
            }, this);

        duration_mapper.accumulate(delta_duration);

        return part_renderers;
    };

ScoreLibrary.Engraver.Measure.prototype.engraveAttributesOf1stMeasure =
    function(renderer, child_element) {

        var engraver = new ScoreLibrary.Engraver.Attributes(this.context);

        engraver.engraveClefOfStaves(child_element, renderer, true);
        engraver.engraveKeyOfStaves(child_element, renderer, true);

        if (!child_element.getOwner().prev) {

            engraver.engraveTimeOfStaves(child_element, renderer, true);
        }
    };

ScoreLibrary.Engraver.Measure.prototype.engraveClefsOfNextMeasure =
    function(renderer, child_element) {

        var next_measure =
            child_element.getOwner().next;

        if (next_measure) {

            var iterator =
                ScoreLibrary.Score.ElementIterFactory.create(next_measure);

            var attributes = undefined;

            if (iterator.hasNext() &&
                ScoreLibrary.Score.Attributes.prototype.isPrototypeOf(
                    (attributes = iterator.next()))) {

                var engraver =
                    new ScoreLibrary.Engraver.Attributes(this.context);

                engraver.engraveClefOfStaves(attributes, renderer);
            }
        }
    };

ScoreLibrary.Engraver.Measure.prototype.engraveBarline =
    function(barline_element, renderer, measure_last, not_show) {

        barline_element.number = 1;

        var delta_duration = 0;

        var engraver = new ScoreLibrary.Engraver.Barline(this.glyph_factory);

        var tunnel_states = barline_element.getTunnelStates();
        if (tunnel_states) {

            var num_of_staves = tunnel_states.getNumberOfStaves();

            for (var staff_number = 1;
                 staff_number <= num_of_staves;
                 ++staff_number) {

                barline_element.number = staff_number;

                renderer.save();

                engraver.engrave(
                    barline_element, renderer, measure_last, not_show);

                delta_duration = renderer.restore();
            }

            renderer.accumulate(delta_duration);
        }

        // !NOTE: temp fix grand staff ending
        barline_element.number = 1;

        return delta_duration;
    };

ScoreLibrary.Engraver.Measure.prototype.engraveStavesToChildElement =
    function(renderer, child_element) {

        if (child_element) {

            var accumulated_duration = renderer.getAccDuration();

            var all_informations =
                renderer.getAllInformations(true);

            for (var key_index = all_informations.length - 1;
                 key_index >= 0; --key_index) {

                var information = all_informations[key_index];

                var staff_duration_prop = 'staff_duration_p';

                staff_duration_prop += renderer.part_index;

                var staff_duration = information[staff_duration_prop];
                if (staff_duration >= 0) {

                    accumulated_duration -= staff_duration;
                    accumulated_duration -= information.key_duration;

                    break;
                }
            }

            if (accumulated_duration > 0) {

                renderer.save();

                renderer.backup(accumulated_duration);

                var engraver =
                    new ScoreLibrary.Engraver.Attributes(this.context);

                engraver.engraveStaffOfStaves(
                    child_element,
                    renderer, accumulated_duration);

                renderer.restore();
            }
        }
    };

ScoreLibrary.Engraver.Measure.prototype.engraveChildElement =
    function(renderer, child_element, first_measure_in_system, child_iterator) {

        if (!child_element.prev && !first_measure_in_system) {

            var prev_measure = child_element.getOwner().prev;

            var iterator =
                ScoreLibrary.Score.ElementIterFactory.create(
                    prev_measure, true);

            var barline_element = iterator.prev();

            if (!ScoreLibrary.Score.Barline.prototype.isPrototypeOf(
                barline_element)) {

                var prev_element = barline_element;

                barline_element =
                    new ScoreLibrary.Score.Barline(prev_measure, '<barline/>');

                barline_element.tunnel_states = prev_element.tunnel_states;
                barline_element.part_symbol = prev_element.part_symbol;

                barline_element.prev = prev_element;
            }

            // Prev Measure's Last Barline
            this.engraveBarline(barline_element, renderer, true);

            barline_element = child_element;

            var not_show = false;

            if (!ScoreLibrary.Score.Barline.prototype.isPrototypeOf(
                barline_element)) {

                var prev_element = barline_element;

                barline_element =
                    new ScoreLibrary.Score.Barline(
                        child_element.getOwner(), '<barline/>');

                barline_element.tunnel_states = prev_element.tunnel_states;
                barline_element.part_symbol = prev_element.part_symbol;

                barline_element.prev = prev_element;

                not_show = true;
            }

            // Curr Measure's Start Barline
            this.engraveBarline(barline_element, renderer, false, not_show);
        }

        if (!child_element.prev && first_measure_in_system) {

            this.engraveAttributesOf1stMeasure(
                renderer, child_element);
        }
        else if (ScoreLibrary.Score.Attributes.prototype.isPrototypeOf(
            child_element)) {

            this.engraveStavesToChildElement(renderer, child_element);

            var engraver =
                new ScoreLibrary.Engraver.Attributes(this.context);

            engraver.engrave(child_element, renderer);
        }

        if (ScoreLibrary.Score.Chord.prototype.isPrototypeOf(child_element)) {

            var engraver =
                new ScoreLibrary.Engraver.Chord(this.context);

            engraver.engrave(child_element, renderer);
        }
        else if (ScoreLibrary.Score.Rest.prototype.isPrototypeOf(
            child_element)) {

            var engraver = new ScoreLibrary.Engraver.Rest(this.context);

            engraver.engrave(child_element, renderer);
        }
        else if (ScoreLibrary.Score.Note.prototype.isPrototypeOf(
            child_element)) {

            var engraver =
                new ScoreLibrary.Engraver.Note(this.context);

            engraver.engrave(child_element, renderer);
        }

        if (ScoreLibrary.Score.Mover.prototype.isPrototypeOf(child_element)) {

            var engraver = new ScoreLibrary.Engraver.Mover(this.glyph_factory);

            engraver.engrave(child_element, renderer);
        }

        if (child_element.prev && child_element.next &&
            ScoreLibrary.Score.Barline.prototype.isPrototypeOf(child_element)) {

            // Curr Measure's Middle Barline
            this.engraveBarline(child_element, renderer, false);
        }

        if (!child_element.next) {

            this.engraveClefsOfNextMeasure(renderer, child_element);
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
