goog.provide('ScoreLibrary.Engraver.Note');
goog.require('ScoreLibrary.Engraver');
goog.require('ScoreLibrary.Engraver.MapInfoTraiter');
goog.require('ScoreLibrary.Renderer.CustomGlyph');
goog.require('ScoreLibrary.Renderer.Part');
goog.require('ScoreLibrary.Score.BendList');
goog.require('ScoreLibrary.Score.Doit');
goog.require('ScoreLibrary.Score.Falloff');
goog.require('ScoreLibrary.Score.HarmonyChord');
goog.require('ScoreLibrary.Score.Note');
goog.require('ScoreLibrary.Score.Plop');
goog.require('ScoreLibrary.Score.Scoop');

/**
 * @constructor
 */
ScoreLibrary.Engraver.Note = function(context) {

    this.context = context;

    if (context) {

        this.glyph_factory =
            context.getCustomTextRenderer().getGlyphFactory();
    }
};

ScoreLibrary.Engraver.Note.prototype.engrave = function(note, renderer) {

    renderer = renderer || new ScoreLibrary.Renderer.Part();

    var note_renderer =
        this.createRenderer(note);

    var clef = note.getClef();

    var fix_org_coord = 'staff';

    var y = note_renderer.getOrg(fix_org_coord, 'y');

    var padding_s = Math.max(note_renderer.padding_s || 0,
                             (note.isGreateThanHalf() ? 1 : 0));
    var padding_e =
        Math.max(note_renderer.padding_e || 0, (note.isGrace() ? 5 : 1));

    note_renderer.mapInfoHook =
        new ScoreLibrary.Engraver.MapInfoTraiter();

    var staff_stream =
        renderer.findStaffStream(note.getStaffNumber(), true);

    staff_stream.pack(
        note_renderer,
        true, false, padding_s, padding_e, fix_org_coord);

    var beams = note.getConnectors('beam');

    if (!beams && clef.sign !== 'TAB') {

        this.engraveStemPlaceHolder(note, note_renderer, staff_stream);
    }

    return renderer;
};

ScoreLibrary.Engraver.Note.prototype.createRenderer = function(note, is_chord) {

    var clef = note.getClef();

    var note_renderer = undefined;

    note_renderer = new ScoreLibrary.Renderer.Note();

    if (clef.sign === 'TAB') {

        note_renderer.setExplicit('width', 10);
        note_renderer.setExplicit('height', 10);

        this.engraveFret(note, note_renderer, is_chord);
    }
    else {

        this.engraveNote(note, note_renderer, is_chord);
    }

    var max_texts_width = 0;

    var lyrics = note.getConnectors('lyric');
    if (lyrics) {

        lyrics.forEach(
            function(lyric) {

                max_texts_width =
                    Math.max(max_texts_width,
                             this.context.measureText(lyric.text));
            }, this);
    }

    if (ScoreLibrary.Score.Harmony.prototype.isPrototypeOf(note.prev)) {

        var harmony_chords = note.prev.getConnectors('harmony-chord');
        if (harmony_chords) {

            harmony_chords.forEach(
                function(harmony_chord) {

                    harmony_chord =
                        new ScoreLibrary.Score.HarmonyChord(0, harmony_chord);

                    max_texts_width =
                        Math.max(max_texts_width,
                                 this.context.measureText(
                                     harmony_chord.getText(this.context)));
                }, this);
        }
    }

    note_renderer.padding_s = (note.isGreateThanHalf() ?
                               max_texts_width * 0.5 : 0);
    note_renderer.padding_e = (note.isGreateThanHalf() ?
                               max_texts_width * 0.5 : max_texts_width);

    note.setRenderer(note_renderer);

    return note_renderer;
};

ScoreLibrary.Engraver.Note.prototype.engraveFret =
    function(note, note_renderer, is_chord) {

        var staff = note.getStaff();

        var fret_renderer = undefined;

        var fret_infos = note.getTechnicals('fret');
        if (fret_infos) {

            var fret = new ScoreLibrary.Score.Fret(
                fret_infos[0].number, fret_infos[0]);

            fret_renderer = fret.createRenderer(this.context);

            var width = fret_renderer.getRequisite('width');
            var height = fret_renderer.getRequisite('height');

            fret_renderer.setOutlineBoundbox({

                x_min: -width * 0.5,
                y_min: -height * 0.5,
                x_max: width * 0.5,
                y_max: height * 0.5
            });

            var outline_bbox =
                fret_renderer.getOutlineBoundbox();

            var y = note.getYOnStaff() + outline_bbox.y_min;

            var fix_org_coord = 'staff';

            fret_renderer.setOrg(fix_org_coord, 'y', y);

            var padding = 5;

            note_renderer.pack(
                fret_renderer, false, false, padding, padding, fix_org_coord);
        }
    };

ScoreLibrary.Engraver.Note.prototype.engraveNote =
    function(note, note_renderer, is_chord) {

    note.rawStemLength();

    if (!is_chord) {

        this.engraveNoteBends(note, note_renderer, true);
        this.engraveNoteAlter(note, note_renderer);
    }

    this.engraveNoteHead(note, note_renderer, is_chord);
    this.engraveNoteFlag(note, note_renderer);
    this.engraveNoteDots(note, note_renderer);
    this.engraveNoteBends(note, note_renderer, false);
};

ScoreLibrary.Engraver.Note.prototype.engraveNoteAlter =
    function(note, note_renderer) {

    var accidental = note.accidental_registered;
    if (accidental) {

        var accidental_glyph =
            accidental.createRenderer(this.glyph_factory);

        if (accidental_glyph) {

            var outline_bbox =
                accidental_glyph.getOutlineBoundbox();

            var y = note.getYOnStaff() + outline_bbox.y_min;

            var fix_org_coord = 'staff';

            accidental_glyph.setOrg(fix_org_coord, 'y', y);

            note_renderer.pack(
                accidental_glyph, false, false, 0, 0, fix_org_coord);
        }
    }
};

ScoreLibrary.Engraver.Note.prototype.engraveStemPlaceHolder =
    function(note, note_renderer, staff_stream, is_beam_note) {

    var determinate_note =
        (ScoreLibrary.Score.Chord.prototype.isPrototypeOf(note) ?
         note.getDeterminateNote() : note);

    if (is_beam_note || (!is_beam_note && determinate_note.hasStem())) {

        var stem_direction =
            determinate_note.getStemDirection();

        var determinate_note_head =
            determinate_note.getRenderer().getNoteHead();

        var note_head_height =
            determinate_note_head.getRequisite('height');

        var stem_length = determinate_note.getStemLength();

        stem_length += note_head_height * 0.5;

        var stem_place_holder =
            new ScoreLibrary.Renderer.CustomGlyph('StemPlaceHolder');

        stem_place_holder.setExplicit('width', 0);

        stem_place_holder.setExplicit('height', stem_length);

        var fix_org_coord = 'staff';

        var stem_y = determinate_note_head.getOrg(fix_org_coord, 'y');

        if (stem_direction ===
            ScoreLibrary.Renderer.Note.StemDirection.Down) {

            stem_y -= stem_length;
            stem_y += note_head_height;
        }

        stem_place_holder.setOrg(fix_org_coord, 'y', stem_y);

        stem_place_holder.pack_duration = note_renderer.pack_duration;

        stem_place_holder.setModel(determinate_note);

        stem_place_holder.mapInfoHook =
            new ScoreLibrary.Engraver.MapInfoTraiter();

        staff_stream.pack(
            stem_place_holder, false, false, 0, 0, fix_org_coord);

        note.stem_place_holder = stem_place_holder;
    }
};

ScoreLibrary.Engraver.Note.prototype.engraveNoteHead =
    function(note, note_renderer, is_chord) {

    var staff = note.getStaff();

    var head = note.getHead();

    var head_glyph = head.createRenderer(this.glyph_factory);

    if (head_glyph === undefined) {

        goog.asserts.assert(
            false,
            'Engraver.Note.packNoteHead(): head_glyph is undefined!');
    }

    var outline_bbox =
        head_glyph.getOutlineBoundbox();

    var y = note.getYOnStaff() + outline_bbox.y_min;

    var fix_org_coord = 'staff';

    head_glyph.setOrg(fix_org_coord, 'y', y);

    var padding = is_chord ? 0 : 2;

    note_renderer.pack(
        head_glyph, false, false, padding, padding, fix_org_coord);
};

ScoreLibrary.Engraver.Note.prototype.engraveNoteFlag =
    function(note, note_renderer) {

    if (note.hasFlag()) {

        var staff = note.getStaff();

        var glyph_name =
            note.typeToFlagGlyphName(note.getType());

        if (glyph_name !== undefined) {

            var flag_width = staff.getHeightOfSpace();

            if (note.isGrace()) {

                flag_width *= 0.65;
            }

            var flag_glyph =
                this.glyph_factory.createByName(
                    glyph_name, flag_width, undefined);

            flag_glyph.sizeAllocateRecursively({

                width: flag_glyph.getRequisite('width'),
                height: flag_glyph.getRequisite('height')
            });

            note_renderer.setFlag(flag_glyph);

            if (note.isGrace() && note.isGraceSlashed()) {

                var glyph_name =
                    (note.getStemDirection() ===
                     ScoreLibrary.Renderer.Note.
                     StemDirection.Up ?
                     'flags.ugrace' : 'flags.dgrace');

                var slash_glyph =
                    this.glyph_factory.createByName(
                        glyph_name, staff.getHeightOfSpace() * 1.2, undefined);

                slash_glyph.sizeAllocateRecursively({

                    width: slash_glyph.getRequisite('width'),
                    height: slash_glyph.getRequisite('height')
                });

                note_renderer.setSlash(slash_glyph);
            }
        }
    }
};

ScoreLibrary.Engraver.Note.prototype.engraveNoteDots =
    function(note, note_renderer, default_y) {

    var staff = note.getStaff();

    var y = default_y;

    var dot_number = note.getNumberOfDot();

    for (var i = 0; i < dot_number; ++i) {

        var glyph =
            this.glyph_factory.createByName(
                'dots.dot', undefined,
                staff.getHeightOfSpace() * 0.4);

        if (note.getPitch()) {

            y = note.getYOnStaff();
        }

        if (staff.isOnLine(y)) {

            y += staff.getHeightOfSpace() * 0.5;
        }

        var outline_bbox =
            glyph.getOutlineBoundbox();

        y += outline_bbox.y_min;

        var fix_org_coord = 'staff';

        glyph.setOrg(fix_org_coord, 'y', y);

        note_renderer.pack(glyph, false, false, 2, 2, fix_org_coord);
    }
};

/**
 * @constructor
 * @extends {ScoreLibrary.Score.ConnectorMgrInterface}
 */
ScoreLibrary.Engraver.BendManager = function(bend_types, note) {

    this.filterConnectorTypes(bend_types, note);
};

ScoreLibrary.aggregate(
    ScoreLibrary.Engraver.BendManager,
    ScoreLibrary.Score.ConnectorMgrInterface);

ScoreLibrary.Engraver.Note.prototype.engraveNoteBends =
    function(note, note_renderer, prefix) {

    ScoreLibrary.Engraver.Note.PrefixBendTypes =
        ScoreLibrary.Engraver.Note.PrefixBendTypes || [

            ScoreLibrary.Score.Scoop,
            ScoreLibrary.Score.Plop
        ];

    ScoreLibrary.Engraver.Note.PostfixBendTypes =
        ScoreLibrary.Engraver.Note.PostfixBendTypes || [

            ScoreLibrary.Score.Doit,
            ScoreLibrary.Score.Falloff,
            ScoreLibrary.Score.BendList
        ];

    var bend_types = (prefix ?
                      ScoreLibrary.Engraver.Note.PrefixBendTypes :
                      ScoreLibrary.Engraver.Note.PostfixBendTypes);

    var bend_manager = new ScoreLibrary.Engraver.BendManager(bend_types, note);

    bend_manager.getConnectors().forEach(function(bend) {

        var bend_renderer =
            bend.createRenderer(this.context);

        if (bend_renderer) {

            var fix_org_coord = 'staff';

            var y = note.getYOnStaff();

            y += bend.getYMove();

            bend_renderer.setOrg(fix_org_coord, 'y', y);

            note_renderer.pack(
                bend_renderer, false, false, 0, 0, fix_org_coord);
        }
    }, this);
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
