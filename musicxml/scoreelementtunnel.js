goog.provide('ScoreLibrary.Score.ElementTunnel');
goog.provide('ScoreLibrary.Score.ElementTunnelStates');
goog.require('ScoreLibrary.Score');
goog.require('ScoreLibrary.Score.Attributes');
goog.require('ScoreLibrary.Score.Chord');
goog.require('ScoreLibrary.Score.KeyManager');
goog.require('ScoreLibrary.Score.Measure');
goog.require('ScoreLibrary.Score.Note');
goog.require('ScoreLibrary.Score.Rest');
goog.require('goog.asserts');

/**
 * @constructor
 */
ScoreLibrary.Score.ElementTunnelStates = function() {
};

ScoreLibrary.Score.ElementTunnelStates.prototype.toString = function() {

    return 'Score.ElementTunnelStates';
};

ScoreLibrary.Score.ElementTunnelStates.prototype.clone = function(clone) {

    clone = clone || new ScoreLibrary.Score.ElementTunnelStates();

    this.divisions && (clone.divisions = this.divisions);
    this['part_symbol'] && (clone['part_symbol'] = this['part_symbol']);

    this['staves'] && (clone['staves'] = this['staves'].slice(0));
    this['clefs'] && (clone['clefs'] = this['clefs'].slice(0));
    this['times'] && (clone['times'] = this['times'].slice(0));
    this['keys'] && (clone['keys'] = this['keys'].slice(0));

    return clone;
};

ScoreLibrary.Score.ElementTunnelStates.prototype.reset = function(attributes) {

    goog.asserts.assert(
        ScoreLibrary.Score.Attributes.prototype.isPrototypeOf(attributes),
        'ScoreLibrary.Score.ElementTunnelStates.reset(): invalid argument!');

    this.divisions = (attributes.divisions || this.divisions);
    this['part_symbol'] = (attributes['part_symbol'] || this['part_symbol']);

    this.forEachStaffInitStates(attributes);
};

ScoreLibrary.Score.ElementTunnelStates.prototype.initState =
    function(staff_number, attributes, state, functor) {

        this[state] = this[state] || [];

        var index = staff_number - 1;

        if (attributes && attributes[state] && attributes[state][index]) {

            this[state][index] = attributes[state][index];
        }
        else if (!this[state][index]) {

            this[state][index] = functor.call(this, staff_number);
        }
    };

ScoreLibrary.Score.ElementTunnelStates.prototype.forEachStaffInitStates =
    function(attributes) {

        var num_of_staves = (attributes ? attributes.getNumberOfStaves() : 1);

        for (var staff_number = 1;
             staff_number <= num_of_staves;
             ++staff_number) {

            this.initState(
                staff_number, attributes, 'staves',
                function(staff_number) {

                    var xml = '<staff-details number="' + staff_number +
                        '"><staff-type>regular</staff-type>' +
                        '<staff-lines>5</staff-lines></staff-details>';

                    return new ScoreLibrary.Score.Staff(this, xml);
                });

            this.initState(
                staff_number, attributes, 'clefs',
                function(staff_number) {

                    var xml = '<clef number="' + staff_number +
                        '"><sign>G</sign><line>2</line></clef>';

                    return new ScoreLibrary.Score.Clef(this, xml);
                });

            var clef = this.getClefByNumber(staff_number);
            if (clef && clef.sign !== 'TAB') {

                this.initState(
                    staff_number, attributes, 'times',
                    function(staff_number) {

                        var xml = '<time number="' + staff_number +
                            '" symbol="common"><beats>4</beats>' +
                            '<beat-type>4</beat-type></time>';

                        return new ScoreLibrary.Score.Time(this, xml);
                    });

                this.initState(
                    staff_number, attributes, 'keys',
                    function(staff_number) {

                        var xml = '<key number="' + staff_number +
                            '"><fifths>0</fifths></key>';

                        return new ScoreLibrary.Score.Key(this, xml);
                    });
            }
        }
    };

ScoreLibrary.Score.ElementTunnelStates.prototype.getPartSymbol =
    function() {

        var part_symbol = this['part_symbol'];

        if (part_symbol === undefined && this.history_index === 0) {

            var num_of_staves = this.getNumberOfStaves();
            if (num_of_staves > 1) {

                var xml = '<part-symbol top-staff="1" ' +
                    'bottom-staff="' + num_of_staves + '">brace</part-symbol>';

                part_symbol = new ScoreLibrary.Score.PartSymbol(this, xml);

                this['part_symbol'] = part_symbol;
            }
        }

        return part_symbol;
    };

ScoreLibrary.Score.ElementTunnelStates.prototype.getNumberOfStaves =
    ScoreLibrary.Score.Attributes.prototype.getNumberOfStaves;

ScoreLibrary.Score.ElementTunnelStates.prototype.getDivisions =
    ScoreLibrary.Score.Attributes.prototype.getDivisions;

ScoreLibrary.Score.ElementTunnelStates.prototype.getAttribute =
    ScoreLibrary.Score.Attributes.prototype.getAttribute;

ScoreLibrary.Score.ElementTunnelStates.prototype.getAllAttributes =
    ScoreLibrary.Score.Attributes.prototype.getAllAttributes;

ScoreLibrary.Score.ElementTunnelStates.prototype.getStaffByNumber =
    ScoreLibrary.Score.Attributes.prototype.getStaffByNumber;

ScoreLibrary.Score.ElementTunnelStates.prototype.getClefByNumber =
    ScoreLibrary.Score.Attributes.prototype.getClefByNumber;

ScoreLibrary.Score.ElementTunnelStates.prototype.getTimeByNumber =
    ScoreLibrary.Score.Attributes.prototype.getTimeByNumber;

ScoreLibrary.Score.ElementTunnelStates.prototype.getKeyByNumber =
    ScoreLibrary.Score.Attributes.prototype.getKeyByNumber;

ScoreLibrary.Score.ElementTunnelStates.prototype.getSpacingBetweenStaves =
    ScoreLibrary.Score.Attributes.prototype.getSpacingBetweenStaves;

/**
 * @constructor
 */
ScoreLibrary.Score.ElementTunnel = function(owner) {

    this.owner = owner;

    this.key_manager = new ScoreLibrary.Score.KeyManager();
};

ScoreLibrary.Score.ElementTunnel.prototype.toString = function() {

    return 'Score.ElementTunnel';
};

ScoreLibrary.Score.ElementTunnel.prototype.getKeyManager = function() {

    return this.key_manager;
};

ScoreLibrary.Score.ElementTunnel.prototype.resetKeyManager = function() {

    this.key_manager.reset();
};

ScoreLibrary.Score.ElementTunnel.prototype.updateKeyManager = function(states) {

    var key_manager = this.getKeyManager();

    var num_of_staves = states.getNumberOfStaves();

    for (var staff_number = 1; staff_number <= num_of_staves; ++staff_number) {

        var key = states.getKeyByNumber(staff_number);
        if (key) {

            var old_pitches = undefined;

            var key_pitches = key.getAccidentalPitches();
            if (key_pitches) {

                old_pitches =
                    key_manager.bindKey(key_pitches, staff_number);
            }

            if (old_pitches && key_pitches) {

                old_pitches =
                    old_pitches.filter(
                        function(old_pitch) {

                            return !key_pitches.some(
                                ScoreLibrary.Score.Pitch.prototype.equal,
                                old_pitch);
                        });

                key.old_pitches = old_pitches;
            }
        }
    }
};

ScoreLibrary.Score.ElementTunnel.prototype.registerNoteAccidental =
    function(note) {

        do {

            var pitch = note.getPitch();

            if (note.no_accidental || !pitch) {

                break;
            }

            if (!note.prev && note.getConnectors('tied')) {

                break;
            }

            if (this.key_manager &&
                (!pitch.octave_shift &&
                 this.key_manager.exist(pitch, note.getStaffNumber())) &&
                (!note.accidental || !note.accidental.cautionary)) {

                break;
            }

            if (note.accidental) {

                note.accidental_registered =
                    new ScoreLibrary.Score.Accidental(
                        note.accidental, note.getStaff(),
                        undefined, note.isGrace());
            }
            else if (pitch.alter) {

                note.accidental_registered =
                    new ScoreLibrary.Score.Accidental(
                        undefined, note.getStaff(),
                        pitch.alter, note.isGrace());
            }
            else if (this.key_manager &&
                     this.key_manager.needNatural(
                         pitch, note.getStaffNumber())) {

                note.accidental_registered =
                    new ScoreLibrary.Score.Accidental(
                        undefined, note.getStaff(), 0, note.isGrace());

                this.key_manager.naturalIt(pitch, note.getStaffNumber());
            }

            if (!pitch.octave_shift && this.key_manager) {

                this.key_manager.register(pitch, note.getStaffNumber());
            }
        } while (false);

        return note.accidental_registered;
    };

ScoreLibrary.Score.ElementTunnel.prototype.currentStates = function() {

    this.states_history = this.states_history || [];

    var states_history = this.states_history;

    if (states_history.length <= 0) {

        var states = new ScoreLibrary.Score.ElementTunnelStates();

        states.forEachStaffInitStates();

        states.history_index = states_history.length;

        states_history.push(states);
    }

    return states_history[states_history.length - 1];
};

ScoreLibrary.Score.ElementTunnel.prototype.changeStates = function(attributes) {

    this.states_history = this.states_history || [];

    var states_history = this.states_history;

    var states = undefined;

    if (states_history.length <= 0) {

        states = new ScoreLibrary.Score.ElementTunnelStates();

        attributes.forEachChildInitAttributes();
    }
    else {

        states = states_history[states_history.length - 1];

        attributes.forEachChildInitAttributes(states);

        states = states.clone();
    }

    states.reset(attributes);

    states.history_index = states_history.length;

    states_history.push(states);

    return states;
};

ScoreLibrary.Score.ElementTunnel.prototype.filter = function(element) {

    element.tunnel = this;

    if (ScoreLibrary.Score.Measure.prototype.isPrototypeOf(element)) {

        this.resetKeyManager();
    }
    else if (ScoreLibrary.Score.Attributes.prototype.isPrototypeOf(element)) {

        this.filterAttributes(element);
    }
    else {

        this.filterOtherElement(element);

        if (ScoreLibrary.Score.Note.prototype.isPrototypeOf(element) &&
            !ScoreLibrary.Score.Chord.prototype.isPrototypeOf(element) &&
            !ScoreLibrary.Score.Rest.prototype.isPrototypeOf(element)) {

            this.registerNoteAccidental(element);
        }
    }
};

ScoreLibrary.Score.ElementTunnel.prototype.filterAttributes =
    function(attributes) {
    // ScoreAttributes

        var states = this.changeStates(attributes);

        attributes.tunnel_states = states;

        states.getAllAttributes().forEach(
            function(element) {

                this.filterOtherElement(element);
            }, this);

        this.updateKeyManager(states);
    };

ScoreLibrary.Score.ElementTunnel.prototype.filterOtherElement =
    function(element) {

        var states = this.currentStates();

        element.tunnel_states = states;

        element.divisions = states.getDivisions();
        element.part_symbol = states.getPartSymbol();

        var staff_number = element.getStaffNumber();
        if (staff_number) {
            // ScoreNote, ScoreRest, ScoreChord, ScoreMover ...
            (!element.staff &&
             !ScoreLibrary.Score.Staff.prototype.isPrototypeOf(element) &&
             (element.staff = states.getStaffByNumber(staff_number)));

            (!element.clef &&
             !ScoreLibrary.Score.Clef.prototype.isPrototypeOf(element) &&
             (element.clef = states.getClefByNumber(staff_number)));

            (!element.time &&
             !ScoreLibrary.Score.Time.prototype.isPrototypeOf(element) &&
             (element.time = states.getTimeByNumber(staff_number)));

            (!element.key &&
             !ScoreLibrary.Score.Key.prototype.isPrototypeOf(element) &&
             (element.key = states.getKeyByNumber(staff_number)));
        }

        // ScoreMeasure, ScoreBarline
        // ScoreTime(staff_number is -1),
        // ScoreKey(staff_number is -1),
        // ScoreMover(staff_number is -1),
    };

ScoreLibrary.Score.ElementTunnel.prototype.getFirstTunnelStates =
    function(element) {

        var tunnel_states = element.first_tunnel_states;

        if (tunnel_states === undefined) {

            var iterator =
                ScoreLibrary.Score.ElementIterFactory.create(element);

            var child_element = iterator.next();

            tunnel_states = child_element.getTunnelStates();

            element.first_tunnel_states = tunnel_states;
        }

        return tunnel_states;
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
