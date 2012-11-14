goog.provide('ScoreLibrary.Engraver.Chord');
goog.require('ScoreLibrary.Engraver.Note');
goog.require('ScoreLibrary.Renderer.Chord');
goog.require('ScoreLibrary.Renderer.HBoxGlyph');
goog.require('ScoreLibrary.Renderer.VBoxGlyph');
goog.require('ScoreLibrary.Score.Arpeggiate');
goog.require('ScoreLibrary.Score.Chord');
goog.require('ScoreLibrary.Score.ConnectorMgrInterface');
goog.require('ScoreLibrary.Score.NonArpeggiate');

/**
 * @constructor
 * @extends {ScoreLibrary.Engraver.Note}
 */
ScoreLibrary.Engraver.Chord = function(context) {

    var supperclass = ScoreLibrary.Engraver.Chord.supperclass;

    supperclass.constructor.call(this, context);
};

ScoreLibrary.inherited(
    ScoreLibrary.Engraver.Chord,
    ScoreLibrary.Engraver.Note);

/**
 * @constructor
 * @extends {ScoreLibrary.Score.ConnectorMgrInterface}
 */
ScoreLibrary.Engraver.Chord.ArpeggiatePolicy = function(glyph_factory, staff) {

    this.glyph_factory = glyph_factory;
    this.staff = staff;
};

ScoreLibrary.aggregate(ScoreLibrary.Engraver.Chord.ArpeggiatePolicy,
                       ScoreLibrary.Score.ConnectorMgrInterface);

ScoreLibrary.Engraver.Chord.ArpeggiatePolicy.prototype.gatherNoteInformation =
    function(note, index, notes) {

        ScoreLibrary.Engraver.Chord.ArpeggiatePolicy.ConnectorTypes =
            ScoreLibrary.Engraver.Chord.ArpeggiatePolicy.ConnectorTypes || [

                ScoreLibrary.Score.Arpeggiate,
                ScoreLibrary.Score.NonArpeggiate
            ];

        this.filterConnectorTypes(
            ScoreLibrary.Engraver.Chord.ArpeggiatePolicy.ConnectorTypes, note);
    };

ScoreLibrary.Engraver.Chord.ArpeggiatePolicy.prototype.applyToNote =
    function(note, index, notes) {
    };

ScoreLibrary.Engraver.Chord.ArpeggiatePolicy.prototype.hasConnector =
    function(ConnectorType, number) {

        for (var i = 0; i < this.getNumberOfConnectors(); ++i) {

            var connector = this.getConnectorByIndex(i);
            if (connector &&
                connector.toString() === ConnectorType.prototype.toString() &&
                connector.getNumber() === number) {

                return true;
            }
        }

        return false;
    };

ScoreLibrary.Engraver.Chord.ArpeggiatePolicy.prototype.getRenderers =
    function(glyph_factory) {

        if (this.renderers === undefined &&
            this.getNumberOfConnectors() > 0) {

            for (var i = 0; i < this.getNumberOfConnectors(); ++i) {

                var connector = this.getConnectorByIndex(i);
                if (connector) {

                    var connector_renderer =
                        connector.createRenderer(glyph_factory);
                    if (connector_renderer) {

                        this.renderers = this.renderers || [];
                        this.renderers.push(connector_renderer);
                    }
                }
            }
        }

        return this.renderers;
    };

/**
 * @constructor
 */
ScoreLibrary.Engraver.Chord.AccidentalPolicy =
    function(glyph_factory, staff, chord_engraver) {

        this.glyph_factory = glyph_factory;
        this.staff = staff;
        this.chord_engraver = chord_engraver;
    };

ScoreLibrary.Engraver.Chord.AccidentalPolicy.prototype.getAlignAccidental =
    function(note, index, notes) {

        var pitch = note.getPitch();

        var align_note = undefined;

        var note_is_in_2nd = false;

        if (index < notes.length - 1) {

            var next_note = notes[index + 1];

            var next_pitch = next_note.getPitch();

            if (next_pitch.getSteps() - pitch.getSteps() === 1) {

                note_is_in_2nd = true;
            }
        }

        if (this.align_index === undefined) {

            this.align_index = notes.length;
        }

        var align_accidental = undefined, align_pitch = undefined;

        while (--this.align_index > index) {

            align_note = notes[this.align_index];

            align_pitch = align_note.getPitch();

            align_accidental = align_note.accidental_registered;

            var num_of_accidentas_gt_3 =
                (this.align_index - index >= 2);

            var relative_steps_gt_6th =
                (align_pitch.getSteps() - pitch.getSteps() >= 6);

            if (align_accidental &&
                (num_of_accidentas_gt_3 || relative_steps_gt_6th)) {

                if (relative_steps_gt_6th && note_is_in_2nd) {

                    ++this.align_index;

                    align_note = undefined;
                }

                break;
            }
            else {

                align_note = undefined;
            }
        }

        return align_note;
    };

ScoreLibrary.Engraver.Chord.AccidentalPolicy.prototype.isIndexAligned =
    function(index) {

        if (this.align_indices !== undefined) {

            if (this.align_indices.some(

                function(align_index) {

                    return align_index === index;

                })) {

                return true;
            }
        }

        return false;
    };

ScoreLibrary.Engraver.Chord.AccidentalPolicy.prototype.alignTwoAccidentals =
    function(note, align_note) {

        var align_box =
            new ScoreLibrary.Renderer.VBoxGlyph('AlignAccidentalBox');

        var accidental = note.accidental_registered;

        var accidental_glyph =
            accidental.createRenderer(this.glyph_factory);

        var fix_org_coord = 'alignbox';

        if (accidental_glyph) {

            var outline_bbox =
                accidental_glyph.getOutlineBoundbox();

            var y = note.getYOnStaff() + outline_bbox.y_min;

            accidental_glyph.setOrg(fix_org_coord, 'x', 0);
            accidental_glyph.setOrg(fix_org_coord, 'y', y);

            align_box.pack(accidental_glyph, false, false, 0, 0, fix_org_coord);
        }

        var align_accidental = align_note.accidental_registered;

        var align_accidental_glyph =
            align_accidental.createRenderer(this.glyph_factory);

        if (align_accidental_glyph) {

            var outline_bbox =
                align_accidental_glyph.getOutlineBoundbox();

            var y = align_note.getYOnStaff() + outline_bbox.y_min;

            var pitch = note.getPitch();

            var align_pitch = align_note.getPitch();

            var x = 0;

            if (align_pitch.getSteps() - pitch.getSteps() < 6) {

                x += accidental_glyph.getRequisite('width');
            }

            align_accidental_glyph.setOrg(fix_org_coord, 'x', x);
            align_accidental_glyph.setOrg(fix_org_coord, 'y', y);

            align_box.pack(
                align_accidental_glyph, false, false, 0, 0, fix_org_coord);
        }

        this.align_boxs = this.align_boxs || [];

        this.align_boxs.push(align_box);

        this.align_indices = this.align_indices || [];

        this.align_indices.push(this.align_index);
    };

ScoreLibrary.Engraver.Chord.AccidentalPolicy.prototype.packAccidental =
    function(note) {

        var accidental = note.accidental_registered;

        var accidental_glyph =
            accidental.createRenderer(this.glyph_factory);

        if (accidental_glyph) {

            var outline_bbox =
                accidental_glyph.getOutlineBoundbox();

            var y = note.getYOnStaff() + outline_bbox.y_min;

            var fix_org_coord = 'accidentals';

            accidental_glyph.setOrg(fix_org_coord, 'y', y);

            this.accidentals_renderer.pack(
                accidental_glyph, false, false, 2, 2, fix_org_coord);
        }
    };

ScoreLibrary.Engraver.Chord.AccidentalPolicy.prototype.packAlignedAccidentals =
    function() {

        this.align_boxs.reverse();

        this.align_boxs.forEach(
            function(align_box, index, align_boxs) {

                var old_fix_coord = 'alignbox';
                var fix_org_coord = 'accidentals';

                align_box.setOrg(
                    fix_org_coord, 'y',
                    align_box.getOrg(old_fix_coord, 'y'));

                this.accidentals_renderer.pack(
                    align_box, false, false, 2, 2, fix_org_coord);

            }, this);

        delete this.align_boxs;
        delete this.align_indices;
        delete this.align_index;
    };

ScoreLibrary.Engraver.Chord.AccidentalPolicy.prototype.gatherNoteInformation =
    function(note, index, notes) {

        if (!this.isIndexAligned(index)) {

            var accidental = note.accidental_registered;

            if (accidental) {

                this.accidentals_renderer =
                    this.accidentals_renderer ||
                    new ScoreLibrary.Renderer.HBoxGlyph('AccidentalGroup');

                var align_note =
                    this.getAlignAccidental(note, index, notes);

                if (align_note) {

                    this.alignTwoAccidentals(note, align_note);
                }
                else {

                    this.packAccidental(note);
                }
            }
        }

        if (notes.length - 1 === index &&
            this.align_boxs !== undefined) {

            this.packAlignedAccidentals();
        }
    };

ScoreLibrary.Engraver.Chord.AccidentalPolicy.prototype.applyToNote =
    function(note, index, notes) {

        note.setNoAccidental(true);
    };

ScoreLibrary.Engraver.Chord.AccidentalPolicy.prototype.getRenderer =
    function() {

        return this.accidentals_renderer;
    };

/**
 * @constructor
 */
ScoreLibrary.Engraver.Chord.StemPolicy = function() {

    this.max_distance_above = 0;
    this.max_distance_below = 0;

    this.note_farther_above = undefined;
    this.note_farther_below = undefined;

    this.num_of_above = 0;
    this.num_of_below = 0;
};

/**
 * Stem Direction of Chord Notes:
 * 1, Find the farther note above & below from staff middle line.
 * 2, If above & below farther notes have same distance,
 *    the more notes side's farther note is the determinate one.
 * 3, Otherwise, The preference is down.
 */
ScoreLibrary.Engraver.Chord.StemPolicy.prototype.gatherNoteInformation =
    function(note, index, notes) {

        goog.asserts.assert(
            notes.length > 1,
            'ScoreLibrary.Engraver.Chord.StemPolicy.gatherNoteInformation(): ' +
                'invalid arguments!');

        var staff_of_note = note.getStaff();

        var y_of_middle_line =
            staff_of_note.getYOfLineInStaffCoord(
                staff_of_note.getCenterLineNumber());

        var distance =
            note.getYOnStaff() - y_of_middle_line;

        if (distance > 0) {

            ++this.num_of_above;

            distance = Math.abs(distance);

            if (this.max_distance_above < distance) {

                this.max_distance_above = distance;

                this.note_farther_above = note;
            }
        }

        if (distance < 0) {

            ++ this.num_of_below;

            distance = Math.abs(distance);

            if (this.max_distance_below < distance) {

                this.max_distance_below = distance;

                this.note_farther_below = note;
            }
        }
    };

ScoreLibrary.Engraver.Chord.StemPolicy.prototype.applyToNote =
    function(note, index, notes) {

        var determinate_note =
            this.getDeterminateNote(notes);

        var stem_direction =
            (determinate_note ?
             determinate_note.getStemDirection() :
             ScoreLibrary.Renderer.Note.StemDirection.Down);

        note.setStemDirection(stem_direction);

        if (this.determinate_stem_length === undefined &&
            determinate_note &&
            determinate_note.hasStem()) {

            var other_end_note =
                (determinate_note === notes[0] ?
                 notes[notes.length - 1] : notes[0]);

            this.determinate_stem_length =
                determinate_note.getStemLength() +
                Math.abs(determinate_note.getYOnStaff() -
                         other_end_note.getYOnStaff());

            determinate_note.setStemLength(this.determinate_stem_length);
        }

        if (note !== determinate_note) {

            note.setNoFlag(true);
            note.setNoStem(true);
        }
    };

ScoreLibrary.Engraver.Chord.StemPolicy.prototype.getDeterminateNote =
    function(notes) {

        if (this.determinate_note === undefined) {

            var stem_direction = undefined;

            if (notes && notes[0].isGrace()) {

                stem_direction =
                    notes[0].getStemDirection();

                this.determinate_note =
                    stem_direction ===
                    ScoreLibrary.Renderer.Note.StemDirection.Up ?
                    notes[0] : notes[notes.length - 1];
            }
            else {

                var determinate_note =
                    (this.max_distance_above === this.max_distance_below ?
                     (this.num_of_above >= this.num_of_below ?
                      this.note_farther_above : this.note_farther_below) :
                     (this.max_distance_above >= this.max_distance_below ?
                      this.note_farther_above : this.note_farther_below));

                // !NOTE: fix stem_directions set by xml conflict with rules
                stem_direction = determinate_note.getStemDirection();

                if (stem_direction ===
                    ScoreLibrary.Renderer.Note.StemDirection.Down &&
                    determinate_note === notes[0]) {

                    determinate_note = notes[notes.length - 1];
                }

                if (stem_direction ===
                    ScoreLibrary.Renderer.Note.StemDirection.Up &&
                    determinate_note === notes[notes.length - 1]) {

                    determinate_note = notes[0];
                }

                determinate_note.setStemDirection(stem_direction);

                this.determinate_note = determinate_note;
            }
        }

        return this.determinate_note;
    };

/**
 * @constructor
 */
ScoreLibrary.Engraver.Chord.PackPolicy = function(context, glyph_factory) {

    this.context = context;
    this.glyph_factory = glyph_factory;
};

ScoreLibrary.Engraver.Chord.PackPolicy.prototype.gatherNoteInformation =
    function(note, index, notes) {

    };

ScoreLibrary.Engraver.Chord.PackPolicy.prototype.isIn2nd =
    function(note, index, notes) {

        var prev_note = undefined, next_note = undefined;

        if (index > 0) {

            var prev_note = notes[index - 1];
        }

        if (index < notes.length - 1) {

            var next_note = notes[index + 1];
        }

        var pitch = note.getPitch();

        var found =
            [prev_note, next_note].some(
                function(sibling, index, siblings) {

                    if (sibling === undefined) {

                        return false;
                    }

                    var sibling_pitch = sibling.getPitch();

                    if (1 ===
                        Math.abs(pitch.getSteps() - sibling_pitch.getSteps())) {

                        return true;
                    }

                    return false;
                });

        return found;
    };
ScoreLibrary.Engraver.Chord.PackPolicy.prototype.getXAdjustFactor =
    function(note, index, notes) {

        var factor = 0;

        var pitch = note.getPitch();

        var stem_direction = note.getStemDirection();

        var determinate_note =
            notes[notes.length - 1];

        var determinate_pitch = determinate_note.getPitch();

        var odd_rel_steps =
            ((determinate_pitch.getSteps() - pitch.getSteps()) % 2 !== 0);

        if (odd_rel_steps &&
            stem_direction ===
            ScoreLibrary.Renderer.Note.StemDirection.Down) {

            factor = -1;
        }
        else if (!odd_rel_steps &&
                 stem_direction ===
                 ScoreLibrary.Renderer.Note.StemDirection.Up) {

            factor = 1;
        }

        return factor;
    };

ScoreLibrary.Engraver.Chord.PackPolicy.prototype.applyToNote =
    function(note, index, notes) {

        var chord_renderer = this.getRenderer();

        var note_engraver =
            new ScoreLibrary.Engraver.Note(this.context);

        var note_renderer =
            note_engraver.createRenderer(note, true);

        var x = 0;

        if (this.isIn2nd(note, index, notes)) {

            var head_glyph = note_renderer.getNoteHead();

            var requisite_width =
                head_glyph.getRequisite('width');

            x = this.getXAdjustFactor(note, index, notes) * requisite_width;

            chord_renderer.x_adjusted = true;
        }

        var fix_org_coord = 'staff';

        note_renderer.setOrg(fix_org_coord, 'x', x);

        chord_renderer.pack(
            note_renderer, false, false, 0, 0, fix_org_coord);
    };

ScoreLibrary.Engraver.Chord.PackPolicy.prototype.getRenderer = function() {

    if (this.chord_renderer === undefined) {

        this.chord_renderer =
            new ScoreLibrary.Renderer.VBoxGlyph('ChordNote');
    }

    return this.chord_renderer;
};

ScoreLibrary.Engraver.Chord.prototype.gatherNotesInformation =
    function(chord, polices) {

        chord.notes.forEach(

            function(note, index, notes) {

                polices.forEach(

                    function(policy) {

                        policy.gatherNoteInformation(
                            note, index, notes);
                    });
            }, this);
    };

ScoreLibrary.Engraver.Chord.prototype.applyPolicesToNotes =
    function(chord, polices) {

        chord.notes.forEach(

            function(note, index, notes) {

                polices.forEach(

                    function(policy) {

                        policy.applyToNote(
                            note, index, notes);
                    });
            }, this);
    };

ScoreLibrary.Engraver.Chord.compareStepsOfNotes = function(note1, note2) {

    if (!ScoreLibrary.Score.Note.prototype.isPrototypeOf(note1) ||
        !ScoreLibrary.Score.Note.prototype.isPrototypeOf(note2)) {

        goog.asserts.assert(
            false,
            'ScoreLibrary.Engraver.Chord.compareYOfNotes(): ' +
                'invalid arguments!');

        return 0;
    }

    var staff_number1 = note1.getStaffNumber();
    var staff_number2 = note2.getStaffNumber();

    if (staff_number1 === staff_number2) {

        var note1_steps = note1.getPitch().getSteps();
        var note2_steps = note2.getPitch().getSteps();

        return (note1_steps - note2_steps);
    }
    else {

        return staff_number2 - staff_number1;
    }
};

ScoreLibrary.Engraver.Chord.prototype.createRenderer = function(chord) {

    goog.asserts.assert(
        chord.notes !== undefined &&
            chord.notes.length > 0,
        'ScoreLibrary.Engraver.Chord.createRenderer(): invalid arguments!');

    var clef = chord.getClef();
    var staff = chord.getStaff();

    var chord_renderer = undefined;

    if (clef.sign !== 'TAB' &&
        chord.notes !== undefined &&
        chord.notes.length > 1) {

        chord.notes.sort(
            ScoreLibrary.Engraver.Chord.compareStepsOfNotes);

        var stem_policy =
            new ScoreLibrary.Engraver.Chord.StemPolicy(staff);

        var arpeggiate_policy =
            new ScoreLibrary.Engraver.Chord.ArpeggiatePolicy(
                this.glyph_factory, staff);

        var accidental_policy =
            new ScoreLibrary.Engraver.Chord.AccidentalPolicy(
                this.glyph_factory, staff, this);

        var pack_policy =
            new ScoreLibrary.Engraver.Chord.PackPolicy(
                this.context, this.glyph_factory);


        var polices = [
            stem_policy,
            arpeggiate_policy,
            accidental_policy,
            pack_policy
        ];

        this.gatherNotesInformation(chord, polices);

        this.applyPolicesToNotes(chord, polices);

        chord.setDeterminateNote(
            stem_policy.getDeterminateNote());

        var compound_renderer =
            new ScoreLibrary.Renderer.Chord;

        var accidentals_coord = 'accidentals';

        var compound_coord = 'compound';

        var fix_org_coord = 'staff';

        var arpeggiate_renderers =
            arpeggiate_policy.getRenderers(this.glyph_factory);

        if (arpeggiate_renderers) {

            arpeggiate_renderers.forEach(
                function(arpeggiate_renderer) {

                    arpeggiate_renderer.setOrg(
                        compound_coord, 'y',
                        arpeggiate_renderer.getOrg(fix_org_coord, 'y'));

                    compound_renderer.pack(
                        arpeggiate_renderer,
                        false, false, 0, 2, compound_coord);
                }, this);
        }

        var accidentals_renderer =
            accidental_policy.getRenderer();

        if (accidentals_renderer) {

            accidentals_renderer.setOrg(
                compound_coord, 'y',
                accidentals_renderer.getOrg(accidentals_coord, 'y'));

            compound_renderer.pack(
                accidentals_renderer,
                false, false, 0, 0, compound_coord);
        }

        chord_renderer = pack_policy.getRenderer();

        if (compound_renderer) {

            chord_renderer.setOrg(
                compound_coord, 'y',
                chord_renderer.getOrg(fix_org_coord, 'y'));

            compound_renderer.pack(
                chord_renderer, false, false, 0, 0, compound_coord);

            compound_renderer.setOrg(
                fix_org_coord, 'y',
                compound_renderer.getOrg(compound_coord, 'y'));

            chord_renderer = compound_renderer;
        }
    }
    else if (clef.sign === 'TAB' &&
             chord.notes !== undefined &&
             chord.notes.length > 1) {

        chord_renderer =
            new ScoreLibrary.Renderer.VBoxGlyph('ChordFret');

        chord.notes.forEach(
            function(note) {

                var note_engraver =
                    new ScoreLibrary.Engraver.Note(this.context);

                var note_renderer =
                    note_engraver.createRenderer(note, true);

                var fix_org_coord = 'staff';

                note_renderer.setOrg(fix_org_coord, 'x', 0);

                chord_renderer.pack(
                    note_renderer, false, false, 0, 0, fix_org_coord);
            }, this);
    }
    else {

        goog.asserts.assert(false,
                            'ScoreLibrary.Engraver.Chord.create(): NOT REACH!');
    }

    chord.setRenderer(chord_renderer);

    return chord_renderer;
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
