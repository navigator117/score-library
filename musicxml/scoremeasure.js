goog.provide('ScoreLibrary.Score.Measure');
goog.require('ScoreLibrary.Renderer.Barline');
goog.require('ScoreLibrary.Renderer.DurationBox');
goog.require('ScoreLibrary.Renderer.Measure');
goog.require('ScoreLibrary.Score');
goog.require('ScoreLibrary.Score.Chord');
goog.require('ScoreLibrary.Score.Clef');
goog.require('ScoreLibrary.Score.Element');
goog.require('ScoreLibrary.Score.Key');
goog.require('ScoreLibrary.Score.Mover');
goog.require('ScoreLibrary.Score.Note');
goog.require('ScoreLibrary.Score.Part');
goog.require('ScoreLibrary.Score.PartGroup');
goog.require('ScoreLibrary.Score.Rest');
goog.require('ScoreLibrary.Score.Staff');
goog.require('ScoreLibrary.Score.Time');
goog.require('ScoreLibrary.Score.XMLHelper');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Score.Element}
 */
ScoreLibrary.Score.Measure = function(owner, measure_node) {

    var supperclass = ScoreLibrary.Score.Measure.supperclass;

    supperclass.constructor.call(
        this, owner, measure_node,
        ScoreLibrary.Score.Measure.ChildTypes);

    var xml_helper = ScoreLibrary.Score.XMLHelper.getInstance();

    xml_helper.getScoreMeasure(this, this);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.Measure,
    ScoreLibrary.Score.Element);

/**
 * @const
 */
ScoreLibrary.Score.Measure.ChildTypes = [
    'attributes', 'note', 'direction', 'harmony', 'backup', 'forward', 'barline'
];

ScoreLibrary.Score.Measure.prototype.enfoldNoteAsRestIf =
    function(plain_element, plain_iterator, parent_element, element_factory) {

        var enfoldMultiMeasureRest = function(folded_element) {

            var multiple_rest = undefined;

            var attributes =
                folded_element.lookup(
                    function(element) {

                        return (ScoreLibrary.Score.Attributes.prototype.
                                isPrototypeOf(element));
                    }, true, ScoreLibrary.Score.Element.LookUpStyle.SameParent);

            if (attributes &&
                attributes.measure_styles &&
                attributes.measure_styles.some(
                    function(style) {

                        if (style.measure_style === 'multiple-rest') {

                            multiple_rest = style;

                            return true;
                        }

                        return false;
                    }) &&
                multiple_rest) {

                folded_element.setNumberOfMultiRest(multiple_rest.measures);
            }
        };

        if (ScoreLibrary.Score.Note.prototype.isPrototypeOf(plain_element) &&
            plain_element.isRest()) {

            var folded_element =
                element_factory.create(
                    parent_element,
                    undefined,
                    plain_element, 'rest');

            folded_element = this.defaultEnfolder(folded_element);

            enfoldMultiMeasureRest(folded_element);

            return folded_element;
        }

        return undefined;
    };

ScoreLibrary.Score.Measure.prototype.enfoldNoteAsChordIf =
    function(plain_element, plain_iterator, parent_element,
             element_factory, element_tunnel) {

        if (ScoreLibrary.Score.Note.prototype.isPrototypeOf(plain_element)) {

            var folded_element = undefined;

            while (plain_iterator.hasNextPlainElement()) {

                var next_element = plain_iterator.nextPlainElement();

                if (ScoreLibrary.Score.Note.prototype.isPrototypeOf(
                    next_element) &&
                    next_element.isInChord()) {

                    if (folded_element === undefined) {

                        folded_element =
                            element_factory.create(
                                parent_element,
                                undefined,
                                plain_element,
                                'chord');

                        element_tunnel.filter(plain_element);
                        this.defaultEnfolder(folded_element);
                    }

                    folded_element.addNote(next_element);

                    element_tunnel.filter(next_element);
                }
                else {

                    plain_iterator.prevPlainElement();

                    break;
                }
            }

            return folded_element;
        }

        return undefined;
    };

ScoreLibrary.Score.Measure.prototype.getEnfolders = function() {

    ScoreLibrary.Score.Measure.enfolders =
        ScoreLibrary.Score.Measure.enfolders || [
            this.enfoldNoteAsRestIf,
            this.enfoldNoteAsChordIf
        ];

    return ScoreLibrary.Score.Measure.enfolders;
};

ScoreLibrary.Score.Measure.prototype.toString = function() {

    return 'ScoreMeasure';
};

ScoreLibrary.Score.Measure.prototype.createRenderer =
    function(glyph_factory, first_measure_in_system) {

        return null;
    };

ScoreLibrary.Score.Measure.prototype.getGcdDivisions = function() {

    if (this.gcd_divisions === undefined) {

        // Greatest Common Divisors.
        var gcd = function(m, n) {

            var t, i = n, j = m;

            while (m % n !== 0) {

                t = n;
                n = m % n;
                m = t;
            }

            return i * j / n;
        }

        var src_divisions = [];

        var child_iterator = ScoreLibrary.Score.ElementIterFactory.create(this);

        var first_child = true;

        while (child_iterator.hasNext()) {

            var child_element = child_iterator.next();

            if (first_child &&
                !ScoreLibrary.Score.Attributes.prototype.isPrototypeOf(
                    child_element)) {

                src_divisions.push(
                    child_element.getDivisions());
            }

            first_child = false;

            if (ScoreLibrary.Score.Attributes.prototype.isPrototypeOf(
                child_element) &&
                child_element.getDivisions()) {

                src_divisions.push(
                    child_element.getDivisions());
            }
        }

        if (src_divisions.length === 0) {

            src_divisions.push(this.getDivisions());
        }

        this.gcd_divisions = src_divisions.reduce(gcd);
    }

    return this.gcd_divisions;
};

ScoreLibrary.Score.Measure.prototype.getNumberOfMultiRest = function() {

    if (this.multiple_rest === undefined) {

        var child_iterator =
            ScoreLibrary.Score.ElementIterFactory.create(this);

        while (child_iterator.hasNext()) {

            var child_element = child_iterator.next();

            if (ScoreLibrary.Score.Attributes.prototype.isPrototypeOf(
                child_element) &&
                child_element.measure_styles &&
                child_element.measure_styles.some(
                    function(style) {

                        if (style.measure_style === 'multiple-rest') {

                            this.multiple_rest = style;

                            return true;
                        }

                        return false;
                    }, this)) {

                break;
            }
        }
    }

    return (this.multiple_rest ?
            this.multiple_rest.measures : 0);
};

ScoreLibrary.Score.Measure.prototype.getMaxVoice = function(staff_number) {

    staff_number = staff_number || 1;

    if (this.max_voices === undefined) {

        this.max_voices = [];

        var iterator = ScoreLibrary.Score.ElementIterFactory.create(this);

        while (iterator.hasNext()) {

            var element = iterator.next();

            if (element && element.getStaffNumber && element.getVoiceNumber) {

                this.max_voices[element.getStaffNumber()] =
                    Math.max((this.max_voices[element.getStaffNumber()] || 1),
                             element.getVoiceNumber());
            }
        }
    }

    return this.max_voices[staff_number];
};

ScoreLibrary.Score.Measure.prototype.getElementTunnel = function() {

    var tunnel = this.tunnel;

    if (tunnel === undefined) {

        tunnel = this.owner.getElementTunnel();

        this.tunnel = tunnel;
    }

    return tunnel;
};

ScoreLibrary.Score.Measure.prototype.getStaffNumber = function() {

    return undefined;
};

ScoreLibrary.Score.Measure.prototype.getTunnelStates = function() {
    // !NOTE: Score.Measure's tunnel states is 1st attributes's tunnel states.

    var tunnel = this.getElementTunnel();

    return tunnel.getFirstTunnelStates(this);
};

ScoreLibrary.Score.Measure.prototype.getDivisions = function() {

    var tunnel_states = this.getTunnelStates();

    return tunnel_states.getDivisions();
};

ScoreLibrary.Score.Measure.prototype.getPartSymbol = function() {

    var tunnel_states = this.getTunnelStates();

    return tunnel_states.getPartSymbol();
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
