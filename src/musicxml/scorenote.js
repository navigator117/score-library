goog.provide('ScoreLibrary.Score.Note');
goog.require('ScoreLibrary.Renderer.CustomGlyph');
goog.require('ScoreLibrary.Renderer.Note');
goog.require('ScoreLibrary.Score');
goog.require('ScoreLibrary.Score.Accidental');
goog.require('ScoreLibrary.Score.Attributes');
goog.require('ScoreLibrary.Score.DataElement');
goog.require('ScoreLibrary.Score.NoteHead');
goog.require('ScoreLibrary.Score.Pitch');
goog.require('ScoreLibrary.Score.XMLHelper');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Score.DataElement}
 */
ScoreLibrary.Score.Note = function(owner, note_node) {

    var supperclass = ScoreLibrary.Score.Note.supperclass;

    supperclass.constructor.call(this, owner, note_node);

    if (note_node) {

        var xml_helper = ScoreLibrary.Score.XMLHelper.getInstance();

        xml_helper.getScoreNote(this, this);
    }
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.Note,
    ScoreLibrary.Score.DataElement);

ScoreLibrary.Score.Note.prototype.toString = function() {

    return 'Score.Note';
};

ScoreLibrary.Score.Note.prototype.createRenderer = function(glyph_factory) {

    return null;
};

ScoreLibrary.Score.Note.prototype.typeToFlagGlyphName =
    function(type) {

        var glyph_name = undefined;

        switch (type) {

        case '1024th':
        case '512th':
        case '256th':
        case '128th': {
            glyph_name =
                'flags.u7';
        } break;
        case '64th': {
            glyph_name =
                'flags.u6';
        } break;
        case '32nd': {
            glyph_name =
                'flags.u5';
        } break;
        case '16th': {
            glyph_name =
                'flags.u4';
        } break;
        case 'eighth': {
            glyph_name =
                'flags.u3';
        } break;
        case 'quarter':
        case 'half':
        case 'whole':
        case 'breve':
        case 'long':
        case 'maxima':
        default:
        }

        return glyph_name;
    };

ScoreLibrary.Score.Note.prototype.isGreateThanHalf = function() {

    return (this.getType() && /whole/.test(this.getType()));
};

ScoreLibrary.Score.Note.prototype.isRest = function() {

    return this.is_rest;
};

ScoreLibrary.Score.Note.prototype.isGrace = function() {

    return this.is_grace;
};

ScoreLibrary.Score.Note.prototype.isGraceSlashed = function() {

    return this.is_grace && this.slash;
};

ScoreLibrary.Score.Note.prototype.isInChord = function() {

    return this.is_chord;
};

ScoreLibrary.Score.Note.prototype.getVoiceNumber = function() {

    return this.voice;
};

ScoreLibrary.Score.Note.prototype.getStaffNumber = function() {

    return this.staff_number;
};

ScoreLibrary.Score.Note.prototype.getHead = function() {

    return new ScoreLibrary.Score.NoteHead(this);
};

ScoreLibrary.Score.Note.prototype.getType = function() {

    return this.type;
};

ScoreLibrary.Score.Note.prototype.tempFixOctaveShift = function() {

    var octave_shift = 0;

    // !NOTE: temp fix octave-shift display.
    var direction = undefined;

    this.lookup(
        function(element) {

            if (!ScoreLibrary.Score.Harmony.prototype.isPrototypeOf(element) &&
                ScoreLibrary.Score.Direction.prototype.isPrototypeOf(element)) {

                var shifts = element.getConnectors(
                    ScoreLibrary.Score.Shift.prototype.toNodeString());

                if (shifts && shifts.length > 0) {

                    direction = element;

                    if (shifts[0].type === 'stop') {

                        direction = undefined;
                    }

                    return true;
                }
            }

            return false;

        }, true, ScoreLibrary.Score.Element.LookUpStyle.SameParent);

    if (direction) {

        var shifts = direction.getConnectors(
            ScoreLibrary.Score.Shift.prototype.toNodeString());

        octave_shift =
            (shifts[0].size === 8 ? 1 :
             (shifts[0].size === 15 ? 2 : 0));

        octave_shift *=
            (shifts[0].type === 'up' ?
             1 : -1);
    }

    return octave_shift;
};

ScoreLibrary.Score.Note.prototype.getPitch = function() {

    if (this.note_pitch === undefined) {

        var show_octave =
            this.display_octave || this.octave;
        var show_step =
            this.display_step || this.step;

        var show_alter = this.alter || 0;

        if (show_octave) {

            var octave_shift =
                this.tempFixOctaveShift();

            show_octave += octave_shift;

            this.note_pitch =
                new ScoreLibrary.Score.Pitch({

                    octave: show_octave,
                    step: show_step,
                    alter: show_alter
                });

            if (octave_shift !== 0) {

                this.note_pitch.octave_shift = true;
            }
        }
        else {

            this.note_pitch = null;
        }
    }

    return this.note_pitch;
};

ScoreLibrary.Score.Note.prototype.getNumberOfDot = function() {

    return this.dots;
};

ScoreLibrary.Score.Note.prototype.getDuration = function() {

    return (this.duration ?
            this.duration :
            (this.isGrace() ?
             ScoreLibrary.Score.Element.Constants.dummyDuration :
             undefined));
};

ScoreLibrary.Score.Note.prototype.getGcdDuration = function() {

    var supperclass = ScoreLibrary.Score.Note.supperclass;

    return (this.isGrace() ? this.getDuration() :
            supperclass.getGcdDuration.call(this));
};

ScoreLibrary.Score.Note.prototype.defaultPadding = function(type) {

    var type = type || this.getType();

    var padding = 0;

    switch (type) {

    default:
    case '1024th':
    case '512th':
    case '256th':
    case '128th':
    case '64th': {
    } break;

    case '32nd':
    case '16th': {
        padding = 8.0;
    } break;
    case 'eighth':
    case 'quarter':
    case 'half':
    case 'whole':
    case 'breve':
    case 'long':
    case 'maxima': {
        padding = 16.0;
    } break;
    case 'double-whole': {
        padding = 32.0;
    } break;

    }

    if (this.isGrace()) {

        padding = 0;
    }

    return padding;
};

ScoreLibrary.Score.Note.prototype.getYOnStaff = function() {

    if (this.y_on_staff === undefined) {

        var clef = this.getClef();

        if (clef.sign === 'TAB') {

            var string_info = this.getTechnicals('string');

            var string_number =
                (string_info && string_info[0].text ?
                 Number(string_info[0].text) : 1);

            this.y_on_staff =
                clef.getYOfStringOnStaff(string_number);
        }
        else {
            this.y_on_staff =
                clef.getYOfPitchOnStaff(this.getPitch());
        }
    }

    return this.y_on_staff;
};

ScoreLibrary.Score.Note.prototype.setStemDirection = function(stem_direction) {

    goog.asserts.assert(
        stem_direction === ScoreLibrary.Renderer.Note.StemDirection.Down ||
            stem_direction === ScoreLibrary.Renderer.Note.StemDirection.Up);

    this.stem_direction = stem_direction;
};

ScoreLibrary.Score.Note.prototype.getStemDirSetting = function() {

    if (this.setting_direction === undefined) {

        switch (this.stem) {

        case 'up': {

            this.setting_direction =
                ScoreLibrary.Renderer.Note.StemDirection.Up;
        } break;
        case 'down': {

            this.setting_direction =
                ScoreLibrary.Renderer.Note.StemDirection.Down;
        } break;

        case 'none':
        case 'double':
            /* !NOTE: We do not support it,
             *  for two note in diff-voices can handle this.
             */
        default: {

            this.setting_direction = this.getStemDirDefault();
        } break;

        }
    }

    return this.setting_direction;
};

ScoreLibrary.Score.Note.calcDefaultStemDir = function(note) {

    if (note.isGrace()) {

        return ScoreLibrary.Renderer.Note.StemDirection.Up;
    }
    else {

        var staff = note.getStaff();

        return (note.getYOnStaff() -
                staff.getYOfLineInStaffCoord(
                    staff.getCenterLineNumber()) >= 0 ?
                ScoreLibrary.Renderer.Note.StemDirection.Down :
                ScoreLibrary.Renderer.Note.StemDirection.Up);
    }
};

ScoreLibrary.Score.Note.prototype.isMultiVoicesOneStaff = function() {

    var measure = this.getMeasure();
    if (measure &&
        (this.getStaffNumber() <= 1 ?
         (measure.getMaxVoice(this.getStaffNumber()) > 1) :
         (measure.getMaxVoice(this.getStaffNumber()) -
          measure.getMaxVoice(this.getStaffNumber() - 1) > 1))) {

        return true;
    }

    return false;
};

ScoreLibrary.Score.Note.prototype.is1stVoiceOfStaff = function() {

    var measure = this.getMeasure();

    return (this.getVoiceNumber() ===
            (this.getStaffNumber() <= 1 ? 1 :
             (measure.getMaxVoice(this.getStaffNumber() - 1) + 1)));
};

ScoreLibrary.Score.Note.prototype.getStemDirDefault = function() {

    if (this.default_direction === undefined) {

        if (this.isMultiVoicesOneStaff()) {

            this.default_direction =
                (this.is1stVoiceOfStaff() ?
                 ScoreLibrary.Renderer.Note.StemDirection.Up :
                 ScoreLibrary.Renderer.Note.StemDirection.Down);
        }
        else {

            this.default_direction =
                ScoreLibrary.Score.Note.calcDefaultStemDir(this);
        }
    }

    return this.default_direction;
};

ScoreLibrary.Score.Note.prototype.getStemDirection = function() {

    if (this.stem_direction !== undefined) {

        return this.stem_direction;
    }

    return this.getStemDirSetting();
};

ScoreLibrary.Score.Note.prototype.hasFlag = function() {

    beams = this.getConnectors('beam');

    return (!beams &&
            this.typeToFlagGlyphName(this.getType()) &&
            !this.no_flag);
};

ScoreLibrary.Score.Note.prototype.setNoFlag = function(no) {

    goog.asserts.assert(
        no !== undefined,
        'ScoreLibrary.Score.Note.setNoFlag(): invalid argument!');

    this.no_flag = (no ? true : false);
};

ScoreLibrary.Score.Note.prototype.hasStem = function() {

    if (this.no_stem || this.isRest()) {

        return false;
    }

    var result = true;

    var type = this.getType();

    switch (type) {

    case 'breve': {

        result = true;
    } break;

    case 'long': {

        result = true;
    } break;

    case 'maxima':
    case 'whole': {

        result = false;
    } break;

    case '1024th':
    case '512th':
    case '256th':
    case '128th':
    case '64th':
    case '32nd':
    case '16th':
    case 'eighth':
    case 'quarter':
    case 'half':
    default: {

        result = true;
    } break;
    }

    return result;
};

ScoreLibrary.Score.Note.prototype.setNoStem = function(no) {

    goog.asserts.assert(
        no !== undefined,
        'ScoreLibrary.Score.Note.setNoStem(): invalid argument!');

    this.no_stem = (no ? true : false);
};

ScoreLibrary.Score.Note.prototype.rawStemLength = function() {

    if (this.raw_stem_length !== undefined) {

        this.stem_length = this.raw_stem_length;
    }
};

ScoreLibrary.Score.Note.prototype.setStemLength = function(stem_length) {

    if (this.raw_stem_length === undefined) {

        this.raw_stem_length = this.stem_length;
    }

    this.stem_length = stem_length;
};

ScoreLibrary.Score.Note.prototype.getStemLength = function() {

    if (this.stem_length !== undefined) {

        return this.stem_length;
    }

    var staff = this.getStaff();

    var stem_length = 3.5 * staff.getHeightOfSpace();

    // distance to middle line
    var distance =
        Math.abs(this.getYOnStaff() -
                 staff.getYOfLineInStaffCoord(
                     staff.getCenterLineNumber()));

    if (this.isMultiVoicesOneStaff() &&
        (this.getStemDirection() !==
         ScoreLibrary.Score.Note.calcDefaultStemDir(this))) {
        // 'wrong' direction for multi-voices on one staff,
        // shortest is 2.5 spaces.
        stem_length -= (Math.min(distance, 3 * staff.getHeightOfSpace()) / 3);
    }
    else if (!this.isGrace()) {

        stem_length = Math.max(distance, stem_length);
    }

    if (this.hasFlag()) {

        switch (this.getType()) {
        case '1024th':
        case '512th':
        case '256th':
        case '128th': {

            stem_length += staff.getHeightOfSpace() * 2.5;
        } break;

        case '64th': {

            stem_length += staff.getHeightOfSpace() * 1.5;
        } break;

        case '32nd': {

            stem_length += staff.getHeightOfSpace() * 1.0;
        } break;

        default: {
        } break;

        }

        stem_length = Math.max(stem_length, staff.getHeightOfSpace() * 3.5);
    }

    if (this.isGrace()) {

        stem_length *= 0.65;
    }

    return stem_length;
};

ScoreLibrary.Score.Note.prototype.setNoAccidental = function(no) {

    goog.asserts.assert(
        no !== undefined,
        'ScoreLibrary.Score.Note.setNoAccidental(): invalid argument!');

    this.no_accidental = (no ? true : false);
};

ScoreLibrary.Score.Note.prototype.isNotationType = function(type) {

    var xml_helper = ScoreLibrary.Score.XMLHelper.getInstance();

    var notation_types = xml_helper.getNotationTypes();

    return (notation_types[type] ? true : false);
};

ScoreLibrary.Score.Note.prototype.isOrnamentType = function(type) {

    var xml_helper = ScoreLibrary.Score.XMLHelper.getInstance();

    var ornament_types = xml_helper.getOrnamentTypes();

    return (ornament_types[type] ? true : false);
};

ScoreLibrary.Score.Note.prototype.isArticulationType = function(type) {

    var xml_helper = ScoreLibrary.Score.XMLHelper.getInstance();

    var articulation_types = xml_helper.getArticulationTypes();

    return (articulation_types[type] ? true : false);
};

ScoreLibrary.Score.Note.prototype.isTechnicalType = function(type) {

    var xml_helper = ScoreLibrary.Score.XMLHelper.getInstance();

    var technical_types = xml_helper.getTechnicalTypes();

    return (technical_types[type] ? true : false);
};

ScoreLibrary.Score.Note.prototype._filterTypeInObjectList =
    function(object_list, field, target_type) {

        var results =
            object_list.filter(
                function(object) {

                    return object[field] === target_type;
                }, this);

        return (results.length > 0 ? results : undefined);
    };

ScoreLibrary.Score.Note.prototype.getNotations = function(type) {

    goog.asserts.assert(
        this.isNotationType(type),
        'ScoreLibrary.Score.Note.prototype.getNotations(): invalid arguments!');

    if (this[type] === undefined) {

        if (this.notations) {

            var object_list =
                this._filterTypeInObjectList(this.notations, 'notation', type);

            if ((type === 'ornaments' ||
                 type === 'articulations' ||
                 type === 'technical') &&
                object_list &&
                object_list.length > 0) {

                object_list =
                    object_list.reduce(
                        function(notation1, notation2) {

                            var notation = {};

                            notation.type = type;

                            notation[type] =
                                notation1[type].concat(
                                    notation2[type]);

                            return notation;
                        })[type];
            }

            this[type] = object_list;
        }

        if (this[type] === undefined) {

            this[type] = null;
        }
    }

    return this[type];
};

ScoreLibrary.Score.Note.prototype.getNotationsSubType =
    function(type, field, sub_type, predicate) {

        var notations = undefined;

        var sub_type_key = sub_type;

        if (field === 'ornament' &&
            sub_type === 'accidental-mark') {

            sub_type_key = field + '-' + sub_type;
        }

        if (this[sub_type_key] === undefined) {

            var notations = this.getNotations(type);
            if (notations && notations.length > 0) {

                var object_list =
                    this._filterTypeInObjectList(
                        notations, field, sub_type);

                this[sub_type_key] = object_list;
            }

            if (this[sub_type_key] === undefined) {

                this[sub_type_key] = null;
            }
        }

        notations = this[sub_type_key];

        if (notations && predicate) {

            notations =
                notations.filter(predicate);
        }

        return notations;
    };

ScoreLibrary.Score.Note.prototype.getOrnaments =
    function(ornament_type, predicate) {

        goog.asserts.assert(
            this.isOrnamentType(ornament_type),
            'ScoreLibrary.Score.Note.getOrnaments(): invalid arguments!');

        return this.getNotationsSubType(
            'ornaments', 'ornament', ornament_type, predicate);
    };

ScoreLibrary.Score.Note.prototype.getArticulations =
    function(articulation_type, predicate) {

        goog.asserts.assert(
            this.isArticulationType(articulation_type),
            'ScoreLibrary.Score.Note.getArticulations(): invalid arguments!');

        return this.getNotationsSubType(
            'articulations', 'articulation', articulation_type, predicate);
    };

ScoreLibrary.Score.Note.prototype.getTechnicals =
    function(technical_type, predicate) {

        goog.asserts.assert(
            this.isTechnicalType(technical_type),
            'ScoreLibrary.Score.Note.getTechnicals(): invalid arguments!');

        return this.getNotationsSubType(
            'technical', 'technical', technical_type, predicate);
    };


ScoreLibrary.Score.Note.prototype.getConnectors = function(type) {

    var connectors = undefined;

    if (type === 'beam') {

        connectors = (this.beams ? this.beams : null);
    }
    else if (type === 'lyric') {

        connectors = (this.lyrics ? this.lyrics : null);
    }
    else if (type === 'accidental-mark') {

        var connectors1 = this.getNotations(type);
        if (connectors1 && connectors1.length > 0) {

            connectors = connectors1;
        }

        var connectors2 = this.getOrnaments(type);
        if (connectors2 && connectors2.length > 0) {

            if (!connectors) {

                connectors = connectors2;
            }
            else {

                connectors1.concat(connectors2);
            }
        }

        if (!connectors) {

            connectors = null;
        }
    }
    else if (this.isArticulationType(type)) {

        connectors = this.getArticulations(type);
    }
    else if (this.isTechnicalType(type)) {

        connectors = this.getTechnicals(type);

        if (type === 'bend' && connectors) {
            // !NOTE: for draw bends after note together by BendList.

            connectors = [{

                technical: 'bend',
                bend_list: connectors
            }];
        }

        if ((/fret|bend|hammer-on|pull-off/.test(type)) && connectors) {

            connectors.forEach(
                function(connector) {

                    connector.real_note = this;
                }, this);
        }
    }
    else if (this.isOrnamentType(type)) {
        // notations > ornaments > type

        connectors =
            (type === 'tremolo' ?
             this.getOrnaments(
                 type, function(ornament) {

                     return ornament.type !== 'single';
                 }) :
             this.getOrnaments(type));
    }
    else if (this.isNotationType(type)) {
        // notations > type

        connectors = this.getNotations(type);
    }

    if (connectors) {

        connectors.sort(
            function(connector1, connector2) {

                return (connector1.number - connector2.number);
            });
    }

    return connectors;
};

ScoreLibrary.Score.Note.prototype.getSingleTremolo = function() {

    if (this.single_tremolo === undefined) {

        var single_tremolos = undefined;

        var tremolos = this.getOrnaments('tremolo');
        if (tremolos) {

            single_tremolos =
                this._filterTypeInObjectList(
                    tremolos, 'type', 'single');
        }

        if (single_tremolos && single_tremolos.length > 0) {

            this.single_tremolo = single_tremolos[0];
        }
        else {

            this.single_tremolo = null;
        }
    }

    return this.single_tremolo;
};

ScoreLibrary.Score.Note.prototype.getLedgerLineDirection = function() {

    var staff = this.getStaff();

    var y = this.getYOnStaff();

    if (y <= staff.getYOfLedgerLineBelowInStaffCoord(1)) {

        return -1;
    }

    if (y >= staff.getYOfLedgerLineAboveInStaffCoord(1)) {

        return 1;
    }

    return 0;
};

ScoreLibrary.Score.Note.prototype.hasLedgerLines = function() {

    if (this.isRest()) {

        return false;
    }

    var pitch = this.getPitch();
    if (!pitch) {

        return false;
    }

    return (this.getLedgerLineDirection() !== 0 ? true : false);
};

ScoreLibrary.Score.Note.prototype.getLedgerLineCount = function() {

    var staff = this.getStaff();

    var direction = this.getStemDirection();

    var y_of_ledger_line =
        (this.getLedgerLineDirection() < 0 ?
         staff.getYOfLineInStaffCoord(1) :
         staff.getYOfLineInStaffCoord(staff.getNumberOfLines()));

    var distance = Math.abs(this.getYOnStaff() - y_of_ledger_line);

    return Math.floor(distance / staff.getHeightOfSpace());
};

ScoreLibrary.Score.Note.prototype.addBeamStartHere = function(beam) {

    this.beams_here = this.beams_here || [];

    this.beams_here.push(beam);
};

ScoreLibrary.Score.Note.prototype.getBeamStartHere = function() {

    return this.beams_here;
};

ScoreLibrary.Score.Note.prototype.setBeamRadian = function(radian) {

    this.radian = radian;
};

ScoreLibrary.Score.Note.prototype.getBeamRadian = function() {

    return this.radian;
};

ScoreLibrary.Score.Note.prototype.getMeasure = function() {

    return this.getOwner();
};


ScoreLibrary.Score.Note.prototype.getY0OfStem =
    function(note_type, stem_direction, line_width, outline_bbox) {

        var y0 = 0;

        if (note_type === 'long' || note_type === 'breve') {

            if (stem_direction ===
                ScoreLibrary.Renderer.Note.StemDirection.Down) {

                y0 = outline_bbox.y_max + line_width * 2;
            }
            else {

                y0 = outline_bbox.y_min - line_width * 2;
            }
        }

        return y0;
    };

ScoreLibrary.Score.Note.prototype.getY1OfStem =
    function(note_type, stem_direction, line_width, outline_bbox) {

        var y1 = 0;

        if (stem_direction === ScoreLibrary.Renderer.Note.StemDirection.Down) {

            y1 = -this.getStemLength();

            if (note_type === 'breve') {

                y1 = outline_bbox.y_min - line_width * 2;
            }
        }
        else {

            y1 = this.getStemLength();

            if (note_type === 'breve') {

                y1 = outline_bbox.y_max + line_width * 2;
            }
        }

        return y1;
    };

ScoreLibrary.Score.Note.prototype.getXOfStem =
    function(stem_direction, line_width, note_head_width) {

        var x = 0;

        if (stem_direction === ScoreLibrary.Renderer.Note.StemDirection.Down) {

            x = line_width * 0.5;
        }
        else {

            x = note_head_width - line_width * 0.5;
        }

        return x;
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
