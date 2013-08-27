goog.provide('ScoreLibrary.Score.Connector');
goog.provide('ScoreLibrary.Score.ConnectorMgrInterface');
goog.require('ScoreLibrary.Score');
goog.require('goog.asserts');

/**
 * @constructor
 */
ScoreLibrary.Score.Connector = function(number, information) {

    this.number = number;
    this.information = information;
};

ScoreLibrary.Score.Connector.prototype.toString = function() {

    return 'Score.Connector';
};

ScoreLibrary.Score.Connector.prototype.toNodeString = function() {

    var message = 'ScoreLibrary.Score.Connector.toNodeString(): overload me!';

    goog.asserts.assert(false, message);

    throw Error(message);
};

ScoreLibrary.Score.Connector.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.Connector(this.number, this.information);

    if (this.notes) {

        clone.notes = this.notes.slice(0);
    }

    return clone;
};

ScoreLibrary.Score.Connector.prototype.getNumber = function() {

    return this.number;
};

ScoreLibrary.Score.Connector.prototype.setNumber = function(number) {

    this.number = number;
};

ScoreLibrary.Score.Connector.prototype.getNotes = function() {

    return this.notes;
};

ScoreLibrary.Score.Connector.prototype.isValidType = function(type) {

    return (/(begin|continue|end)/.test(type));
};

ScoreLibrary.Score.Connector.prototype.isBeginType = function(type) {

    return 'begin' === type;
};

ScoreLibrary.Score.Connector.prototype.isEndType = function(type) {

    return 'end' === type;
};

ScoreLibrary.Score.Connector.prototype.addNote =
    function(number, type, note, information) {

        goog.asserts.assert(
            number === this.number &&
                this.isValidType(type),
            'ScoreLibrary.Score.Connector.addNote(): invalid arguments!');

        if (!this.canAddNote(number, type, note)) {

            return false;
        }

        this.notes = this.notes || [];

        this.notes.push(note);

        this.onAddNote(number, type, note, information);

        return true;
    };

ScoreLibrary.Score.Connector.prototype.canAddNote =
    function(number, type, note) {

        if (number !== this.number || this.isEnded()) {

            return false;
        }

        return true;
    };

ScoreLibrary.Score.Connector.prototype.onAddNote =
    function(number, type, note) {

        if (this.isEndType(type)) {

            this.ended = true;
        }
    };

ScoreLibrary.Score.Connector.prototype.setPlacementNote = function(note) {

    this.placement_note = note;
};

ScoreLibrary.Score.Connector.prototype.getPlacementNote = function() {

    return this.placement_note;
};

ScoreLibrary.Score.Connector.prototype.isEnded = function() {

    return this.ended;
};

ScoreLibrary.Score.Connector.prototype.getPolices = function() {

    return undefined;
};

ScoreLibrary.Score.Connector.prototype.prepareEngrave =
    function(staff_stream, extra_space) {

        var polices = this.getPolices(staff_stream, extra_space);
        if (polices) {

            this.gatherNotesInformation(polices);

            this.applyPolicesToNotes(polices);
        }
    };

ScoreLibrary.Score.Connector.prototype.gatherNotesInformation =
    function(polices) {

        this.notes.forEach(

            function(note, index, notes) {

                polices.forEach(

                    function(policy) {

                        policy.gatherNoteInformation(
                            note, index, notes);
                    });
            }, this);
    };

ScoreLibrary.Score.Connector.prototype.applyPolicesToNotes = function(polices) {

    this.notes.forEach(

        function(note, index, notes) {

            polices.forEach(

                function(policy) {

                    policy.applyToNote(
                        note, index, notes);
                });
        }, this);
};

ScoreLibrary.Score.Connector.prototype.getPlacement = function() {

    var placement = undefined;

    switch (this.toNodeString()) {

    case 'harmony-frame':
    case 'harmony-chord':
    case 'staff-lyrics':
    case 'lyric':
    case 'rehearsal':
    case 'words':
    case 'metronome':
    case 'wedge':
    case 'tuplet':
    case 'toe':
    case 'tap':
    case 'heel':
    case 'snap-pizzicato':
    case 'stopped':
    case 'triple-tongue':
    case 'double-tongue':
    case 'string':
    case 'fret':
    case 'fingering':
    case 'pluck':
    case 'thumb-position':
    case 'open-string':
    case 'harmonic':
    case 'down-bow':
    case 'up-bow':
    case 'dynamics':
    case 'schleifer':
    case 'inverted-mordent':
    case 'mordent':
    case 'shake':
    case 'wavy-line':
    case 'vertical-turn':
    case 'delayed-inverted-turn':
    case 'inverted-turn':
    case 'delayed-turn':
    case 'turn':
    case 'trill-mark':
    case 'dashes':
    case 'bracket':
    case 'ending':
    case 'accidental-mark':
    case 'fermata':
    case 'accordion-registration':
    case 'pedal':
    case 'segno':
    case 'coda':
    case 'caesura':
    case 'breath-mark':
    case 'accent':
    case 'octave-shift':
    case 'harp-pedals': {

        placement = 'staff';
    } break;

    case 'glissando':
    case 'slide':
    case 'tremolo':
    case 'beam':
    case 'bend':
    case 'falloff':
    case 'doit':
    case 'plop':
    case 'scoop':
    case 'staccatissimo':
    case 'detached-legato':
    case 'tenuto':
    case 'staccato':
    case 'strong-accent':
    case 'slur':
    case 'hammer-on':
    case 'pull-off':
    case 'tied': {

        placement = 'notes';
    } break;

    default: {

        goog.asserts.assert(
            false, 'ScoreLibrary.Score.Connector.getPlacement(): unexpect!');
    } break;
    }

    return placement;
};

ScoreLibrary.Score.Connector.prototype.getDirection = function() {

    return (this.information ?
            (this.information.placement === 'above' ?
             'upper' : 'lower') : 'upper');
};

ScoreLibrary.Score.Connector.prototype.isWallerBlock = function() {

    return true;
};

ScoreLibrary.Score.Connector.prototype.getYMove = function() {

    var y_move = 5;

    switch (this.toNodeString()) {

    case 'caesura': {

        y_move = -10;
    } break;

    case 'slide':
    case 'glissando':
    case 'beam':
    case 'tremolo':
    case 'tied': {

        y_move = 0;
    } break;

    default: {
        /*      goog.asserts.assert(
                false, 'ScoreLibrary.Score.Connector.getYMove(): unexpect!'); */
    } break;
    }

    return y_move;
};

ScoreLibrary.Score.Connector.prototype.getXMove =
    function(staff_stream, extra_space) {

        var x_move = 0;

        switch (this.toNodeString()) {

        case 'harmony-frame':
        case 'harmony-chord':
            //  case 'lyric':
        case 'tap':
        case 'heel':
        case 'toe':
        case 'stopped':
        case 'snap-pizzicato':
        case 'double-tongue':
        case 'triple-tongue':
        case 'fingering':
        case 'pluck':
        case 'string':
        case 'open-string':
        case 'thumb-position':
        case 'harmonic':
        case 'up-bow':
        case 'down-bow':
        case 'shake':
        case 'mordent':
        case 'inverted-mordent':
        case 'schleifer':
        case 'turn':
        case 'delayed-turn':
        case 'inverted-turn':
        case 'delayed-inverted-turn':
        case 'vertical-turn':
        case 'trill-mark':
        case 'dynamics':
        case 'fermata':
        case 'accidental-mark':
        case 'accent':
        case 'strong-accent':
        case 'staccato':
        case 'tenuto':
        case 'detached-legato':
        case 'staccatissimo': {

            var note = this.getNotes()[0];
            var note_renderer = note.getRenderer();
            var note_accidental = undefined;
            var note_head = undefined;

            if (ScoreLibrary.Score.Note.prototype.isPrototypeOf(note)) {

                note_accidental = note_renderer.getAccidental();
                note_head = note_renderer.getNoteHead();
            }

            var note_padding_s = 0;

            if (note_renderer.pack_expand_padding) {

                var duration =
                    staff_stream.keyDurationToDuration(
                        note_renderer.pack_duration);

                var child_extra_space =
                    extra_space * duration / staff_stream.getMaxDuration();

                note_padding_s +=
                note_renderer.pack_padding_s + child_extra_space *
                    note_renderer.pack_padding_s /
                    (note_renderer.pack_padding_s +
                     note_renderer.pack_padding_e);
            }

            var note_accidental_width = 0;
            if (note_accidental) {

                note_accidental_width = note_accidental.getRequisite('width');
            }

            var note_head_width = 0;
            if (note_head) {

                note_head_width += note_head.pack_padding_s;
                note_head_width += note_head.getRequisite('width') * 0.5;
            }

            var connector_requisite_width =
                this.getRenderer().getRequisite('width');

            x_move = (note_padding_s +
                      note_accidental_width +
                      note_head_width) -
                connector_requisite_width * 0.5;
        } break;


        case 'pedal':
        case 'accordion-registration': {

            var connector_requisite_width =
                this.getRenderer().getRequisite('width');

            x_move = -connector_requisite_width * 0.5;
        } break;

        case 'caesura':
        case 'breath-mark': {

            var note_renderer =
                this.getNotes()[0].getRenderer();

            x_move += (note_renderer.pack_padding_s +
                       note_renderer.getRequisite('width') +
                       note_renderer.pack_padding_e);

        } break;

        case 'rehearsal':
        case 'segno':
        case 'coda': {

            var connector_requisite_width =
                this.getRenderer().getRequisite('width');

            x_move = -connector_requisite_width;
        } break;

        case 'bend': {

            x_move += 10;
        } break;

        default: {

            /* goog.asserts.assert(
               false, 'ScoreLibrary.Score.Connector.getXMove(): unexpect!'); */
        } break;
        }

        return x_move;
    };

ScoreLibrary.Score.Connector.prototype.getClosestNoteToMe = function(note) {

    var message =
        'ScoreLibrary.Score.Connector.getClosestNoteToMe(): overload me!';

    goog.asserts.assert(false, message);

    throw Error(message);
};

ScoreLibrary.Score.Connector.prototype.getFarmostNoteToMe = function(note) {

    var message =
        'ScoreLibrary.Score.Connector.getFarmostNoteToMe(): overload me!';

    goog.asserts.assert(false, message);

    throw Error(message);
};

ScoreLibrary.Score.Connector.prototype.setRenderer = function(renderer) {

    renderer.setModel(this);

    this.renderer = renderer;
};

ScoreLibrary.Score.Connector.prototype.getRenderer = function() {

    return this.renderer;
};

ScoreLibrary.Score.Connector.prototype.createRenderer = function(context) {

    var message = 'ScoreLibrary.Score.Connector.createRenderer(): overload me!';

    goog.asserts.assert(false, message);

    throw Error(message);
};

/**
 * @constructor
 */
ScoreLibrary.Score.ConnectorMgrInterface = function() {
};

ScoreLibrary.Score.ConnectorMgrInterface.prototype.filterConnectorTypes =
    function(ConnectorTypes, element) {

        ConnectorTypes.forEach(

            function(ConnectorType, index, ConnectorTypes) {

                var connector_infos =
                    element.getConnectors(
                        ConnectorType.prototype.toNodeString());

                if (connector_infos) {

                    this.addConnectors(element, ConnectorType, connector_infos);
                }

            }, this);
    };

ScoreLibrary.Score.ConnectorMgrInterface.prototype.hasConnector =
    function(ConnectorType, number) {

        return true;
    };

ScoreLibrary.Score.ConnectorMgrInterface.prototype.reset = function() {

    if (this.connectors) {

        var not_end_connectors = undefined;

        this.connectors.forEach(
            function(connector) {

                if (!connector.isEnded() &&
                    (/slur|tied/.test(connector.toNodeString()))) {
                    // !NOTE: Slur & Tied may wrapping from staff to staff.

                    not_end_connectors = not_end_connectors || [];

                    connector = connector.clone();
                    connector.is_prev_unpaired = true;

                    not_end_connectors.push(connector);
                }
            });

        this.connectors = not_end_connectors;
    }
};

ScoreLibrary.Score.ConnectorMgrInterface.prototype.getConnectors =
    function(type, not) {

        if (type) {

            return this.connectors ?
                this.connectors.filter(
                    function(connector) {

                        if (RegExp.prototype.isPrototypeOf(type)) {

                            return (not ?
                                    !type.test(connector.toNodeString()) :
                                    type.test(connector.toNodeString()));
                        }
                        else {

                            return (not ?
                                    type !== connector.toNodeString() :
                                    type === connector.toNodeString());
                        }
                    }) : [];
        }
        else {

            return this.connectors || [];
        }
    };

ScoreLibrary.Score.ConnectorMgrInterface.prototype.addConnectors =
    function(note, ConnectorType, connector_infos) {

        var getPlacementNote = function(ConnectorType, connector_info, note) {

            if (ScoreLibrary.Score.Direction.prototype.isPrototypeOf(note)) {

                note = note.getPlacementNote(
                    ((/(wedge|dashes|bracket)/.test(
                        ConnectorType.prototype.toNodeString())) ?
                     true : ConnectorType.prototype.isBeginType(
                         connector_info.type)));
            }

            return note;
        };

        var connector = undefined;

        connector_infos.forEach(

            function(connector_info) {

                if (!ConnectorType.prototype.isValidType(connector_info.type)) {

                    return;
                }

                this.connectors = this.connectors || [];

                if (ConnectorType.prototype.isBeginType(connector_info.type) ||
                    !this.hasConnector(ConnectorType, connector_info.number)) {

                    connector = new ConnectorType(
                        connector_info.number, connector_info);

                    this.connectors.push(connector);
                }
                else {

                    for (var i = this.connectors.length - 1; i >= 0; --i) {

                        connector = this.connectors[i];

                        var notes = connector.getNotes();

                        note =
                            getPlacementNote(
                                ConnectorType, connector_info, note);

                        if (!connector.isEnded() &&
                            notes.length > 0 &&
                            (ScoreLibrary.Score.Barline.prototype.isPrototypeOf(
                                note) ||
                             ScoreLibrary.Score.Barline.prototype.isPrototypeOf(
                                 notes[0]) ||
                             (note.getVoiceNumber() ===
                              notes[0].getVoiceNumber())) &&
                            (connector.getNumber() ===
                             connector_info.number) &&
                            ConnectorType.prototype.toString() ===
                            connector.toString()) {

                            break;
                        }
                        else {

                            connector = undefined;
                        }
                    }
                }

                if (connector) {

                    note =
                        getPlacementNote(
                            ConnectorType, connector_info, note);

                    connector.addNote(connector_info.number,
                                      connector_info.type,
                                      note,
                                      connector_info);
                }
                else {

                    goog.asserts.assert(
                        false,
                        'Score.ConnectorMgrInterface.AddConnector(): ' +
                            'invalid arguments!');
                }
            }, this);
    };

ScoreLibrary.Score.ConnectorMgrInterface.prototype.getNumberOfConnectors =
    function() {

        return this.connectors ? this.connectors.length : 0;
    };

ScoreLibrary.Score.ConnectorMgrInterface.prototype.getConnectorByIndex =
    function(index) {

        goog.asserts.assert(
            this.connectors && index >= 0 && index < this.connectors.length,
            'ScoreLibrary.Score.ConnectorMgrInterface.getConnectorByIndex(): ' +
                'invalid arguments!');

        return this.connectors[index];
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
