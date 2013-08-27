goog.provide('ScoreLibrary.Score.Beam');
goog.provide('ScoreLibrary.Score.TremoloBeam');
goog.require('ScoreLibrary.Renderer.Beam');
goog.require('ScoreLibrary.Renderer.Note');
goog.require('ScoreLibrary.Renderer.TremoloBeam');
goog.require('ScoreLibrary.Score');
goog.require('ScoreLibrary.Score.Chord');
goog.require('ScoreLibrary.Score.Connector');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Score.Connector}
 */
ScoreLibrary.Score.Beam = function(number) {

    var supperclass = ScoreLibrary.Score.Beam.supperclass;

    supperclass.constructor.call(this, number);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.Beam,
    ScoreLibrary.Score.Connector);

ScoreLibrary.Score.Beam.prototype.toString = function() {

    return 'Score.Beam';
};

ScoreLibrary.Score.Beam.prototype.toNodeString = function() {

    return 'beam';
};

ScoreLibrary.Score.Beam.prototype.clone = function(clone) {

    clone = clone || new ScoreLibrary.Score.Beam(this.number);

    var supperclass = ScoreLibrary.Score.Beam.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Score.Beam.prototype.isBeginType = function(type) {

    var supperclass = ScoreLibrary.Score.Beam.supperclass;

    return (supperclass.isBeginType.call(this, type) ||
            (/(forward\shook|backward\shook)/.test(type)));
};

ScoreLibrary.Score.Beam.prototype.isValidType = function(type) {

    var supperclass = ScoreLibrary.Score.Beam.supperclass;

    return (supperclass.isValidType.call(this, type) ||
            (/(forward\shook|backward\shook)/.test(type)));
};

ScoreLibrary.Score.Beam.prototype.canAddNote = function(number, type, note) {

    var supperclass = ScoreLibrary.Score.Beam.supperclass;

    if (!supperclass.canAddNote.call(this, number, type, note) ||
        (this.notes && this.notes.length > 1 &&
         (/(forward\shook|backward\shook)/.test(type)))) {

        return false;
    }

    return true;
};

ScoreLibrary.Score.Beam.prototype.onAddNote = function(number, type, note) {

    var supperclass = ScoreLibrary.Score.Beam.supperclass;

    supperclass.onAddNote.call(this, number, type, note);

    if (type === 'forward hook') {

        this.is_forward = true;
    }
    else if (type === 'backward hook') {

        this.is_backward = true;
    }

    if (/(forward\shook|backward\shook)/.test(type)) {

        this.ended = true;
    }
};

ScoreLibrary.Score.Beam.prototype.isForward = function() {

    return this.is_forward;
};

ScoreLibrary.Score.Beam.prototype.isBackward = function() {

    return this.is_backward;
};

ScoreLibrary.Score.Beam.prototype.getDirection = function() {

    var notes = this.getNotes();

    return (this.notes &&
            this.notes[0].getStemDirection() ===
            ScoreLibrary.Renderer.Note.StemDirection.Down ?
            'lower' : 'upper');
};

ScoreLibrary.Score.Beam.prototype.createRenderer = function() {

    var beam_renderer = new ScoreLibrary.Renderer.Beam(this);

    this.setRenderer(beam_renderer);

    return beam_renderer;
};

ScoreLibrary.Score.Beam.prototype.getSpaceBtwBeam = function() {

    var notes = this.getNotes();

    var staff =
        this.getClosestNoteToMe(notes[0]).getStaff();

    var value = staff.getHeightOfSpace() * 0.2;

    if (this.getClosestNoteToMe(notes[0]).isGrace()) {

        value *= 0.65;
    }

    return value;
};

ScoreLibrary.Score.Beam.prototype.getHeightOfBeam = function() {

    var notes = this.getNotes();

    var staff =
        this.getClosestNoteToMe(notes[0]).getStaff();

    var value = staff.getHeightOfSpace() * 0.5;

    if (this.getClosestNoteToMe(notes[0]).isGrace()) {

        value *= 0.65;
    }

    return value;
};

ScoreLibrary.Score.Beam.prototype.getHookLength = function() {

    var notes = this.getNotes();

    var staff =
        this.getClosestNoteToMe(notes[0]).getStaff();

    var value = staff.getHeightOfSpace();

    if (this.getClosestNoteToMe(notes[0]).isGrace()) {

        value *= 0.65;
    }

    return value;
};

ScoreLibrary.Score.Beam.prototype.setSlant = function(slant) {

    this.slant = slant;
};

ScoreLibrary.Score.Beam.prototype.getSlant = function() {

    return this.slant;
};

/**
 * @constructor
 */
ScoreLibrary.Score.Beam.StemDirectionPolicy = function(beam) {

    this.beam = beam;

    this.num_of_above = 0;
    this.num_of_below = 0;

    this.max_distance_above = 0;
    this.max_distance_below = 0;

    this.note_farther_above = undefined;
    this.note_farther_below = undefined;
};

ScoreLibrary.Score.Beam.StemDirectionPolicy.prototype.gatherNoteInformation =
    function(note, index, notes) {

        if (!ScoreLibrary.Score.Chord.prototype.isPrototypeOf(note)) {

            var staff_of_note = note.getStaff();

            var y_of_middle_line =
                staff_of_note.getYOfLineInStaffCoord(
                    staff_of_note.getCenterLineNumber());

            var distance = note.getYOnStaff() - y_of_middle_line;

            if (distance > 0) {

                ++this.num_of_above;

                distance = Math.abs(distance);

                if (this.max_distance_above < distance) {

                    this.max_distance_above = distance;

                    this.note_farther_above = note;
                }
            }

            if (distance < 0) {

                ++this.num_of_below;

                distance = Math.abs(distance);

                if (this.max_distance_below < distance) {

                    this.max_distance_below = distance;

                    this.note_farther_below = note;
                }
            }
        }
        else {

            note.notes.forEach(this.gatherNoteInformation, this);
        }
    };

ScoreLibrary.Score.Beam.StemDirectionPolicy.prototype.applyToNote =
    function(note, index, notes) {

        var determinate_note =
            this.getDeterminateNote();

        var stem_direction =
            determinate_note.getStemDirection();

        note.setStemDirection(stem_direction);

        this.beam.close_far_knew = true;
    };

ScoreLibrary.Score.Beam.StemDirectionPolicy.prototype.getDeterminateNote =
    function() {

        if (this.determinate_note === undefined) {
            /**
             * Stem Direction of Beamed Notes:
             * 1, The farther note above or below from staff middle line is
             * the determinate one.
             * 2, The more notes side's stem direction is the determinate one.
             * 3, If above & below farther notes have same distance,
             * the preference is down.
             */
            this.determinate_note =
                (this.max_distance_above === this.max_distance_below ?
                 (this.num_of_above >= this.num_of_below ?
                  this.note_farther_above : this.note_farther_below) :
                 (this.max_distance_above >= this.max_distance_below ?
                  this.note_farther_above : this.note_farther_below));

            if (this.beam.isForward() ||
                this.beam.isBackward() ||
                this.determinate_note === undefined) {

                var notes = this.beam.getNotes();

                this.determinate_note = notes[0];
            }
        }

        return this.determinate_note;
    };

/**
 * @constructor
 */
ScoreLibrary.Score.Beam.StemLengthPolicy =
    function(beam, stem_direction_policy, slant_policy, placement_policy,
             staff_stream, extra_space) {

        this.beam = beam;
        this.inc_stem_length = 0;
        this.stem_direction_policy = stem_direction_policy;
        this.slant_policy = slant_policy;
        this.placement_policy = placement_policy;
        this.staff_stream = staff_stream;
        this.extra_space = extra_space;
    };

ScoreLibrary.Score.Beam.StemLengthPolicy.prototype.gatherNoteInformation =
    function(note, index, notes) {

        if (this.beam.getNumber() !== 1) {

            return;
        }

        var staff = this.beam.getClosestNoteToMe(note).getStaff();

        var beams = note.getConnectors('beam');

        if (beams && beams.length > 2) {

            /*
             * If more than 2 beams place on beam's note,
             * let beam stem increase to adapt it.
             */
            this.inc_stem_length =
                Math.max(this.inc_stem_length,
                         (beams.length - 2) *
                         (this.beam.getHeightOfBeam() +
                          this.beam.getSpaceBtwBeam()));
        }
    };

ScoreLibrary.Score.Beam.StemLengthPolicy.prototype.getPolicyStemLength =
    function(notes) {

        if (this.policy_stem_length === undefined) {

            var note =
                this.placement_policy.getPlacementNote();

            var stem_length = note.getStemLength();

            stem_length -=
                Math.abs(this.beam.getFarmostNoteToMe(note).getYOnStaff() -
                         this.beam.getClosestNoteToMe(note).getYOnStaff());

            stem_length += this.inc_stem_length;

            var note_0 = notes[0];
            var note_n = notes[notes.length - 1];

            if (this.beam.getClosestNoteToMe(note_0).hasLedgerLines() &&
                this.beam.getClosestNoteToMe(note_n).hasLedgerLines()) {

                var staff_of_note =
                    this.beam.getClosestNoteToMe(note_0).getStaff();

                var y_of_middle_line =
                    staff_of_note.getYOfLineInStaffCoord(
                        Math.ceil(staff_of_note.getNumberOfLines() * 0.5));

                var distance_0 =
                    Math.abs(this.beam.getClosestNoteToMe(
                        note_0).getYOnStaff() -
                             y_of_middle_line);

                if (distance_0 >= staff_of_note.getHeightOfSpace() * 3.5) {

                    var slant = this.slant_policy.getSlant();

                    stem_length += (slant > 0 ?
                                    this.beam.getHeightOfBeam() :
                                    -this.beam.getHeightOfBeam());
                }
            }

            this.policy_stem_length = stem_length;
        }

        return this.policy_stem_length;
    };

ScoreLibrary.Score.Beam.StemLengthPolicy.prototype.getNoteX =
    function(index, notes) {

        var prop = 'note';

        prop += index;
        prop += '_x';

        if (this[prop] === undefined) {

            this[prop] =
                this.staff_stream.calcChildOffset(
                    notes[index].getRenderer(), this.extra_space);
        }

        return this[prop];
    };

ScoreLibrary.Score.Beam.StemLengthPolicy.prototype.getNoteY =
    function(index, notes) {

        var prop = 'note';

        prop += index;
        prop += '_y';

        if (this[prop] === undefined) {

            this[prop] =
                this.beam.getClosestNoteToMe(notes[index]).getYOnStaff();
        }

        return this[prop];
    };

ScoreLibrary.Score.Beam.StemLengthPolicy.prototype.getNoteSlant =
    function(index, notes) {

        var prop = 'note';

        prop += index;
        prop += '_slant';

        if (this[prop] === undefined) {

            var slant = undefined;

            if (index === 0) {

                slant = 0;
            }
            else if (index === notes.length - 1) {

                slant = this.slant_policy.getSlant();

                var determinate_note =
                    this.stem_direction_policy.getDeterminateNote();

                if (determinate_note.getStemDirection() ===
                    ScoreLibrary.Renderer.Note.StemDirection.Down) {

                    slant *= -1;
                }
            }
            else {

                slant = this.getNoteSlant(notes.length - 1, notes) *
                    ((this.getNoteX(index, notes) - this.getNoteX(0, notes)) /
                     (this.getNoteX(notes.length - 1, notes) -
                      this.getNoteX(0, notes)));
            }

            this[prop] = slant;
        }

        return this[prop];
    };

ScoreLibrary.Score.Beam.StemLengthPolicy.prototype.getNoteStemLength =
    function(index, notes) {

        var prop = 'note';

        prop += index;
        prop += '_stem_length';

        if (this[prop] === undefined) {

            var stem_length = this.getPolicyStemLength(notes);

            var note = notes[index];

            var placement_index = this.placement_policy.getPlacementIndex();

            if (index !== placement_index) {

                stem_length -=
                    this.getNoteSlant(placement_index, notes);

                stem_length +=
                Math.abs(this.getNoteY(placement_index, notes) -
                         this.getNoteY(index, notes));

                stem_length +=
                this.getNoteSlant(index, notes);
            }

            stem_length +=
            Math.abs(this.beam.getFarmostNoteToMe(note).getYOnStaff() -
                     this.beam.getClosestNoteToMe(note).getYOnStaff());

            this[prop] = stem_length;
        }

        return this[prop];
    };

ScoreLibrary.Score.Beam.StemLengthPolicy.prototype.getBeamRadian =
    function(notes) {

        if (this.beam_radian === undefined) {

            this.beam_radian =
                Math.atan(this.getNoteSlant(notes.length - 1, notes) /
                          (this.getNoteX(notes.length - 1, notes) -
                           this.getNoteX(0, notes)));
        }

        return this.beam_radian;
    };

ScoreLibrary.Score.Beam.StemLengthPolicy.prototype.applyToNote =
    function(note, index, notes) {

        if (this.beam.getNumber() !== 1) {

            return;
        }

        note.setNoFlag(true);

        var determinate_note =
            this.beam.getFarmostNoteToMe(note);

        var beam_radian = this.getBeamRadian(notes);

        beam_radian =
            (determinate_note.getStemDirection() ===
             ScoreLibrary.Renderer.Note.StemDirection.Up ?
             beam_radian : - beam_radian);

        determinate_note.setBeamRadian(beam_radian);

        determinate_note.setStemLength(
            this.getNoteStemLength(index, notes));

        if (ScoreLibrary.Score.Chord.prototype.isPrototypeOf(note)) {

            note.setDeterminateNote(determinate_note);
        }

        var engraveStemPlaceHolder =
            ScoreLibrary.Engraver.Note.prototype.engraveStemPlaceHolder;

        engraveStemPlaceHolder.call(
            this, note, note.getRenderer(), this.staff_stream, true);
    };

/**
 * @constructor
 */
ScoreLibrary.Score.Beam.PlacementPolicy =
    function(beam, stem_direction_policy) {

        this.beam = beam;

        this.y_of_upper_note = -Infinity;
        this.y_of_lower_note = Infinity;

        this.upper_note = undefined;
        this.lower_note = undefined;

        this.stem_direction_policy = stem_direction_policy;
    };

ScoreLibrary.Score.Beam.PlacementPolicy.prototype.gatherNoteInformation =
    function(note, index, notes) {

        var y = this.beam.getClosestNoteToMe(note).getYOnStaff();

        if (y > this.y_of_upper_note) {

            this.y_of_upper_note = y;
            this.upper_note = note;
            this.upper_index = index;
        }

        if (y < this.y_of_lower_note) {

            this.y_of_lower_note = y;
            this.lower_note = note;
            this.lower_index = index;
        }
    };

ScoreLibrary.Score.Beam.PlacementPolicy.prototype.getPlacementNote =
    function() {

        var determinate_note =
            this.stem_direction_policy.getDeterminateNote();

        var stem_direction =
            determinate_note.getStemDirection();

        /* If Beam Notes's Direction is Up, the uppest note is placement note,
         * Otherwise, the lowest note is placment note.
         */
        if (stem_direction ===
            ScoreLibrary.Renderer.Note.StemDirection.Up) {

            return this.upper_note;
        }
        else {

            return this.lower_note;
        }
    };

ScoreLibrary.Score.Beam.PlacementPolicy.prototype.getPlacementIndex =
    function() {

        return (this.getPlacementNote() === this.upper_note ?
                this.upper_index : this.lower_index);
    };

ScoreLibrary.Score.Beam.PlacementPolicy.prototype.applyToNote =
    function(note, index, notes) {

        if (index === 0) {

            this.beam.setPlacementNote(this.getPlacementNote());

            note.addBeamStartHere(this.beam);
        }
    };

/**
 * @constructor
 */
ScoreLibrary.Score.Beam.SlantPolicy = function(beam) {

    this.beam = beam;
    this.sign = undefined;
    this.slant = undefined;
};

ScoreLibrary.Score.Beam.SlantPolicy.prototype.gatherNoteInformation =
    function(note, index, notes) {

        if (this.beam.getNumber() !== 1) {

            return;
        }

        if (index < Math.floor(notes.length * 0.5)) {

            var staff = this.beam.getClosestNoteToMe(note).getStaff();

            var outter_note1 = note;
            var outter_note2 = notes[notes.length - (index + 1)];

            var y_of_outter_note1 =
                this.beam.getClosestNoteToMe(outter_note1).getYOnStaff();

            var y_of_outter_note2 =
                this.beam.getClosestNoteToMe(outter_note2).getYOnStaff();

            var slant =
                (y_of_outter_note2 - y_of_outter_note1) /
                staff.getHeightOfSpace();

            var sign = (slant !== 0 ? (slant > 0 ? 1 : -1) : 0);

            /*
             * If Outter Notes's sign is diff from Inner Notes'sign,
             * let beam no slant(sign === 0, sign * slant === 0).
             */
            this.sign =
                (this.sign === undefined ?
                 sign : (this.sign !== sign ? 0 : this.sign));

            if (index === 0) {
                /*
                 * Beam's slant is determinated by Outest two Notes's slant.
                 */
                slant = Math.abs(slant);

                if (this.beam.getClosestNoteToMe(
                    outter_note1).hasLedgerLines() &&
                    this.beam.getClosestNoteToMe(
                        outter_note2).hasLedgerLines()) {

                    if (slant !== 0) {

                        slant = 0.5;
                    }
                }

                switch (slant) {

                case 0:
                case 0.5:   // 2nd
                case 1:     // 3rd
                case 1.5: { // 4th
                } break;

                case 2:     // 5th
                case 2.5:   // 6th
                case 3: { // 7th
                    slant = 1.5;
                } break;
                case 3.5: // octave
                default: {
                    slant = 2;
                } break;
                }

                this.slant = slant * staff.getHeightOfSpace();
            }
        }
    };

ScoreLibrary.Score.Beam.SlantPolicy.prototype.applyToNote =
    function(note, index, notes) {

        if (this.beam.getNumber() !== 1) {

            return;
        }

        this.beam.setSlant(this.getSlant());
    };

ScoreLibrary.Score.Beam.SlantPolicy.prototype.getSlant = function() {

    return this.sign * this.slant;
};

ScoreLibrary.Score.Beam.prototype.prepareEngrave =
    function(staff_stream, extra_space) {

        var stem_direction_policy =
            new ScoreLibrary.Score.Beam.StemDirectionPolicy(this);

        var polices = [stem_direction_policy];

        this.gatherNotesInformation(polices);
        this.applyPolicesToNotes(polices);

        var slant_policy = undefined;
        var placement_policy = undefined;

        polices = [

            (slant_policy =
             new ScoreLibrary.Score.Beam.SlantPolicy(this)),
            (placement_policy =
             new ScoreLibrary.Score.Beam.PlacementPolicy(
                 this, stem_direction_policy)),
            new ScoreLibrary.Score.Beam.StemLengthPolicy(
                this, stem_direction_policy, slant_policy, placement_policy,
                staff_stream, extra_space)
        ];

        this.gatherNotesInformation(polices);
        this.applyPolicesToNotes(polices);
    };

ScoreLibrary.Score.Beam.prototype.getClosestNoteToMe = function(note) {

    goog.asserts.assert(
        this.close_far_knew,
        'ScoreLibrary.Score.Beam.getClosestNoteToMe(): unexpect!');

    if (ScoreLibrary.Score.Chord.prototype.isPrototypeOf(note)) {

        var chord = note;

        // chord' notes is sorted ascend by y on staff,
        // last one is upmost, closest to beam.
        var index = (this.getDirection() === 'upper' ?
                     chord.notes.length - 1 : 0);

        return chord.notes[index];
    }
    else {

        return note;
    }
};

ScoreLibrary.Score.Beam.prototype.getFarmostNoteToMe = function(note) {

    goog.asserts.assert(
        this.close_far_knew,
        'ScoreLibrary.Score.Beam.getFarmostNoteToMe(): unexpect!');

    if (ScoreLibrary.Score.Chord.prototype.isPrototypeOf(note)) {

        var chord = note;

        // chord' notes is sorted ascend by y on staff,
        // first one is downmost, farmost to beam.
        var index = (this.getDirection() === 'upper' ?
                     0 : chord.notes.length - 1);

        return chord.notes[index];
    }
    else {

        return note;
    }
};

/**
 * @constructor
 * @extends {ScoreLibrary.Score.Beam}
 */
ScoreLibrary.Score.TremoloBeam = function(number) {

    var supperclass = ScoreLibrary.Score.TremoloBeam.supperclass;

    supperclass.constructor.call(this, number);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.TremoloBeam,
    ScoreLibrary.Score.Beam);

ScoreLibrary.Score.TremoloBeam.prototype.toString = function() {

    return 'Score.TremoloBeam';
};

ScoreLibrary.Score.TremoloBeam.prototype.toNodeString = function() {

    return 'tremolo';
};

ScoreLibrary.Score.TremoloBeam.prototype.getTremoloNumber = function() {

    return this.getNumber() - 1;
};

ScoreLibrary.Score.TremoloBeam.prototype.clone = function(clone) {

    clone = clone || new ScoreLibrary.Score.TremoloBeam(this.number);

    var supperclass = ScoreLibrary.Score.TremoloBeam.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Score.TremoloBeam.prototype.isValidType = function(type) {

    return (/(start|stop)/.test(type));
};

ScoreLibrary.Score.TremoloBeam.prototype.isBeginType = function(type) {

    return 'start' === type;
};

ScoreLibrary.Score.TremoloBeam.prototype.isEndType = function(type) {

    return 'stop' === type;
};

ScoreLibrary.Score.TremoloBeam.prototype.createRenderer = function() {

    var beam_renderer = new ScoreLibrary.Renderer.TremoloBeam(this);

    this.setRenderer(beam_renderer);

    return beam_renderer;
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
