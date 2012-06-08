goog.provide('ScoreLibrary.Score.Accordion');
goog.provide('ScoreLibrary.Score.Coda');
goog.provide('ScoreLibrary.Score.Direction');
goog.provide('ScoreLibrary.Score.Harmony');
goog.provide('ScoreLibrary.Score.HarmonyChord');
goog.provide('ScoreLibrary.Score.Metronome');
goog.provide('ScoreLibrary.Score.Pedal');
goog.provide('ScoreLibrary.Score.Rehearsal');
goog.provide('ScoreLibrary.Score.Segno');
goog.require('ScoreLibrary.Score');
goog.provide('ScoreLibrary.Score.Words');
goog.require('ScoreLibrary.Score.DataElement');
goog.require('ScoreLibrary.Score.GlyphAnchor');
goog.require('ScoreLibrary.Score.Note');
goog.require('ScoreLibrary.Score.TextAnchor');
goog.require('ScoreLibrary.Score.XMLHelper');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Score.DataElement}
 */
ScoreLibrary.Score.Direction = function(owner, direction_node) {

    var supperclass = ScoreLibrary.Score.Direction.supperclass;

    supperclass.constructor.call(this, owner, direction_node);

    if (direction_node) {

        var xml_helper = ScoreLibrary.Score.XMLHelper.getInstance();

        xml_helper.getDirection(this, this);
    }
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.Direction,
    ScoreLibrary.Score.DataElement);

ScoreLibrary.Score.Direction.prototype.toString = function() {

    return 'Score.Direction';
};

ScoreLibrary.Score.Direction.prototype.getDuration = function() {

    goog.asserts.assert(
        false,
        'ScoreLibrary.Score.Direction.getDuration(): unexpect!');
};

ScoreLibrary.Score.Direction.prototype.getVoiceNumber = function() {

    return this.voice;
};

ScoreLibrary.Score.Direction.prototype.getStaffNumber = function() {

    return this.staff_number;
};

ScoreLibrary.Score.Direction.prototype.isDirectionType = function(type) {

    var xml_helper = ScoreLibrary.Score.XMLHelper.getInstance();

    var direction_types = xml_helper.getDirectionTypes();

    return (direction_types[type] ? true : false);
};

ScoreLibrary.Score.Direction.prototype._filterTypeInObjectList =
    ScoreLibrary.Score.Note.prototype._filterTypeInObjectList;

ScoreLibrary.Score.Direction.prototype.getConnectors = function(type) {

    goog.asserts.assert(
        this.isDirectionType(type),
        'ScoreLibrary.Score.Direction.getConnectors(): invalid arguments!');

    var connectors = undefined;

    if (this[type] === undefined) {

        if (this['directions']) {

            var object_list =
                this._filterTypeInObjectList(
                    this['directions'], 'direction', type);

            this[type] = object_list;
        }

        if (this[type] === undefined) {

            this[type] = null;
        }
    }

    connectors = this[type];

    if (connectors) {

        connectors.sort(
            function(connector1, connector2) {

                return (connector1.number - connector2.number);
            });
    }

    return connectors;
};

ScoreLibrary.Score.Direction.prototype.getPlacementNote = function(forward) {

    return this.lookup(
        function(element) {

            return ScoreLibrary.Score.Note.prototype.isPrototypeOf(element);

        }, !forward, ScoreLibrary.Score.Element.LookUpStyle.SameParent);
};

/**
 * @constructor
 * @extends {ScoreLibrary.Score.Direction}
 */
ScoreLibrary.Score.Harmony = function(owner, harmony_node) {

    // !NOTE: call Score.DataElement constructor directly!
    var supperclass = ScoreLibrary.Score.DataElement.prototype;

    supperclass.constructor.call(this, owner, harmony_node);

    if (harmony_node) {

        var xml_helper = ScoreLibrary.Score.XMLHelper.getInstance();

        xml_helper.getHarmony(this, this);

        if (this.chords) {

            this['directions'] =
                this.chords.map(
                    function(direction) {

                        direction['direction'] = 'harmony-chord';
                        direction.placement = this.placement;
                        direction.staff_number = this.staff_number;

                        return direction;
                    }, this);
        }

        if (this.frame) {

            var direction = this.frame;

            direction['direction'] = 'harmony-frame';
            direction.placement = this.placement;
            direction.staff_number = this.staff_number;

            this['directions'] = this['directions'] || [];
            this['directions'].push(direction);
        }
    }
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.Harmony,
    ScoreLibrary.Score.Direction);

ScoreLibrary.Score.Harmony.prototype.toString = function() {

    return 'Score.Harmony';
};

ScoreLibrary.Score.Harmony.prototype.getVoiceNumber = function() {

    return 1;
};

ScoreLibrary.Score.Harmony.prototype.isDirectionType = function(type) {

    return (type === 'harmony-chord' || type === 'harmony-frame');
};

/**
 * @constructor
 * @extends {ScoreLibrary.Score.TextAnchor}
 */
ScoreLibrary.Score.Rehearsal = function(number, information) {

    var supperclass = ScoreLibrary.Score.Rehearsal.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.Rehearsal,
    ScoreLibrary.Score.TextAnchor);

ScoreLibrary.Score.Rehearsal.prototype.toString = function() {

    return 'Score.Rehearsal';
};

ScoreLibrary.Score.Rehearsal.prototype.toNodeString = function() {

    return 'rehearsal';
};

ScoreLibrary.Score.Rehearsal.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.Rehearsal(this.number, this.information);

    var supperclass = ScoreLibrary.Score.Rehearsal.supperclass;

    return supperclass.clone.call(this, clone);
};

/**
 * @constructor
 * @extends {ScoreLibrary.Score.TextAnchor}
 */
ScoreLibrary.Score.Words = function(number, information) {

    var supperclass = ScoreLibrary.Score.Words.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.Words,
    ScoreLibrary.Score.TextAnchor);

ScoreLibrary.Score.Words.prototype.toString = function() {

    return 'Score.Words';
};

ScoreLibrary.Score.Words.prototype.toNodeString = function() {

    return 'words';
};

ScoreLibrary.Score.Words.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.Words(this.number, this.information);

    var supperclass = ScoreLibrary.Score.Words.supperclass;

    return supperclass.clone.call(this, clone);
};

/**
 * @constructor
 * @extends {ScoreLibrary.Score.TextAnchor}
 */
ScoreLibrary.Score.Metronome = function(number, information) {

    var supperclass = ScoreLibrary.Score.Metronome.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.Metronome,
    ScoreLibrary.Score.TextAnchor);

ScoreLibrary.Score.Metronome.prototype.toString = function() {

    return 'Score.Metronome';
};

ScoreLibrary.Score.Metronome.prototype.toNodeString = function() {

    return 'metronome';
};

ScoreLibrary.Score.Metronome.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.Metronome(this.number, this.information);

    var supperclass = ScoreLibrary.Score.Metronome.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Score.Metronome.prototype.getText = function(context) {

    var text = '';

    var escape_index = -1;

    if (this.information.parentheses) {

        text += '(';
    }

    if (this.information.beat_unit0) {

        text += '%';
        text += ++escape_index;

        var escapes = this.getEscapes(true);

        var note_renderer =
            this.createNoteRendererForEscape(
                this.information.beat_unit0,
                this.information.beat_unit0_dots,
                context);

        note_renderer.sizeAllocateRecursively({

            width: note_renderer.getRequisite('width'),
            height: note_renderer.getRequisite('height')
        });

        escapes.push(note_renderer);
    }

    text += ' = ';

    if (this.information.per_minute) {

        text += this.information.per_minute;
    }
    else if (this.information.beat_unit1) {

        text += '%';
        text += ++escape_index;

        var escapes = this.getEscapes(true);

        var note_renderer =
            this.createNoteRendererForEscape(
                this.information.beat_unit1,
                this.information.beat_unit1_dots,
                context);

        note_renderer.sizeAllocateRecursively({

            width: note_renderer.getRequisite('width'),
            height: note_renderer.getRequisite('height')
        });

        escapes.push(note_renderer);
    }

    if (this.information.parentheses) {

        text += ')';
    }

    return text;
};

ScoreLibrary.Score.Metronome.prototype.getEscapes = function(create) {

    if (this.escapes === undefined && create) {

        this.escapes = [];
    }

    return this.escapes;
};

ScoreLibrary.Score.Metronome.prototype.getEnclosure = function() {

    return 'none';
};

ScoreLibrary.Score.Metronome.prototype.getDirection = function() {

    return 'upper';
};

ScoreLibrary.Score.Metronome.prototype.createNoteRendererForEscape =
    function(note_type, note_dots, context) {

        var xml =
            '<note><duration>1</duration>' +
            '<pitch><octave>4</octave><step>G</step></pitch>' +
            '<type>' + note_type + '</type></note>';

        var placement_note = this.getPlacementNote();

        var note =
            new ScoreLibrary.Score.Note(
                placement_note.getMeasure(),
                xml);

        note.dots = note_dots;

        note.prev = placement_note;

        note.staff = placement_note.staff;
        note.clef = placement_note.clef;
        note.time = placement_note.time;
        note.key = placement_note.key;

        var engraver = new ScoreLibrary.Engraver.Note(context);

        return engraver.createRenderer(note);
    };

/**
 * @constructor
 * @extends {ScoreLibrary.Score.TextAnchor}
 */
ScoreLibrary.Score.HarmonyChord = function(number, information) {

    var supperclass = ScoreLibrary.Score.HarmonyChord.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.HarmonyChord,
    ScoreLibrary.Score.TextAnchor);

ScoreLibrary.Score.HarmonyChord.prototype.toString = function() {

    return 'Score.HarmonyChord';
};

ScoreLibrary.Score.HarmonyChord.prototype.toNodeString = function() {

    return 'harmony-chord';
};

ScoreLibrary.Score.HarmonyChord.prototype.getEscapes =
    ScoreLibrary.Score.Metronome.prototype.getEscapes;

ScoreLibrary.Score.HarmonyChord.prototype.getText = function(context) {

    var custom_text_renderer = context.getCustomTextRenderer();

    var glyph_factory = custom_text_renderer.getGlyphFactory();

    var text = '';

    this.escape_index = -1;

    text += this.getRootText(glyph_factory);
    text += this.getKindText(glyph_factory);
    text += this.getDegreesText(glyph_factory);

    return text;
};

ScoreLibrary.Score.HarmonyChord.prototype.escapeAlterGlyph =
    function(text, alter, glyph_factory) {

        if (alter.location === 'left') {

            text = '%' + ++this.escape_index + text;
        }
        else {

            text = text + '%' + ++this.escape_index;
        }

        var xml =
            '<staff-details number="1"><staff-type>regular</staff-type>' +
            '<staff-lines>5</staff-lines></staff-details>';

        var accidental =
            new ScoreLibrary.Score.Accidental(
                undefined, new ScoreLibrary.Score.Staff(undefined, xml),
                alter.value, true);

        var alter_renderer =
            accidental.createRenderer(glyph_factory);

        alter_renderer.sizeAllocateRecursively({

            width: alter_renderer.getRequisite('width'),
            height: alter_renderer.getRequisite('height')
        });

        this.getEscapes(true).push(alter_renderer);

        return text;
    };

ScoreLibrary.Score.HarmonyChord.prototype.getRootText =
    function(glyph_factory) {

        var text = '';

        var root = this.information.root;
        if (root) {

            text += (root.step.text || root.step.value);

            if (root.alter &&
                root.alter.print_object &&
                root.alter.value) {

                text = this.escapeAlterGlyph(text, root.alter, glyph_factory);
            }
        }

        return text;
    };

ScoreLibrary.Score.HarmonyChord.KindGlyphChars = {

    major: 0x25B3,           // A triangle
    minor: 0x002D,           // -
    augmented: 0x002B,       // +
    diminished: 0x00B0,      // °
    half_diminished: 0x00F8  // ø
};

ScoreLibrary.Score.HarmonyChord.prototype.kindToGlyphChar = function(kind) {

    var glyph_char = undefined;

    var kindGlyphChars = ScoreLibrary.Score.HarmonyChord.KindGlyphChars;

    if (/major/.test(kind)) {

        glyph_char = kindGlyphChars.major;
    }

    if (/minor/.test(kind)) {

        glyph_char = kindGlyphChars.minor;
    }

    if (/augmented/.test(kind)) {

        glyph_char = kindGlyphChars.augmented;
    }

    if (/diminished/.test(kind)) {

        glyph_char = kindGlyphChars.diminished;

        if (/half/.test(kind)) {

            glyph_char = kindGlyphChars.half_diminished;
        }
    }

    return (glyph_char ? String.fromCharCode(glyph_char) : '');
};

ScoreLibrary.Score.HarmonyChord.prototype.kindToDegreeNumber = function(kind) {

    var degree_number = '';

    if (/dominant$|seventh$|^half|major-minor/.test(kind)) {

        degree_number = '7';
    }
    else if (/sixth$/.test(kind)) {

        degree_number = '6';
    }
    else if (/ninth$/.test(kind)) {

        degree_number = '9';
    }
    else if (/11th$/.test(kind)) {

        degree_number = '11';
    }
    else if (/13th$/.test(kind)) {

        degree_number = '13';
    }
    else if ('suspended-second' === kind) {

        degree_number = 'sus2';
    }
    else if ('suspended-fourth' === kind) {

        degree_number = 'sus4';
    }

    return degree_number;
};

ScoreLibrary.Score.HarmonyChord.prototype.getKindText =
    function(glyph_factory) {

        var text = '';

        var kind = this.information.kind;
        if (kind) {

            if (kind.use_symbols) {

                text += this.kindToGlyphChar(kind.kind);
                text += this.kindToDegreeNumber(kind.kind);
            }

            if (kind.text) {

                text += kind.text;
            }
        }

        return text;
    };

ScoreLibrary.Score.HarmonyChord.prototype.getDegreesText =
    function(glyph_factory) {

        var text = '';

        var degrees = this.information.degrees;
        if (degrees) {

            degrees.forEach(
                function(degree) {

                    text += '/';

                    if (degree.print_object) {

                        var type = degree.type;
                        if (type) {

                            text += (type.text ||
                                     (type.value === 'add' ? 'add' : ''));
                        }

                        var alter = degree.alter;
                        if (alter) {

                            if (alter.plus_minus) {

                                text += (alter.value > 0 ? '+' : '-');
                            }
                            else if (alter.value) {

                                text = this.escapeAlterGlyph(
                                    text, alter, glyph_factory);
                            }
                        }

                        var value = degree.value;
                        if (value) {

                            if (value.symbol) {

                                text += this.kindToGlyphChar(value.symbol);
                            }

                            text += (value.text || value.value);
                        }
                    }
                }, this);
        }

        return text;
    };

ScoreLibrary.Score.HarmonyChord.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.HarmonyChord(this.number, this.information);

    var supperclass = ScoreLibrary.Score.HarmonyChord.supperclass;

    return supperclass.clone.call(this, clone);
};

/**
 * @constructor
 * @extends {ScoreLibrary.Score.GlyphAnchor}
 */
ScoreLibrary.Score.Segno = function(number, information) {

    var supperclass = ScoreLibrary.Score.Segno.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.Segno,
    ScoreLibrary.Score.GlyphAnchor);

ScoreLibrary.Score.Segno.prototype.toString = function() {

    return 'Score.Segno';
};

ScoreLibrary.Score.Segno.prototype.toNodeString = function() {

    return 'segno';
};

ScoreLibrary.Score.Segno.prototype.getGlyphNames = function() {

    return ['scripts.segno'];
};

ScoreLibrary.Score.Segno.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.Segno(this.number, this.information);

    var supperclass = ScoreLibrary.Score.Segno.supperclass;

    return supperclass.clone.call(this, clone);
};

/**
 * @constructor
 * @extends {ScoreLibrary.Score.GlyphAnchor}
 */
ScoreLibrary.Score.Coda = function(number, information) {

    var supperclass = ScoreLibrary.Score.Coda.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.Coda,
    ScoreLibrary.Score.GlyphAnchor);

ScoreLibrary.Score.Coda.prototype.toString = function() {

    return 'Score.Coda';
};

ScoreLibrary.Score.Coda.prototype.toNodeString = function() {

    return 'coda';
};

ScoreLibrary.Score.Coda.prototype.getGlyphNames = function() {

    return ['scripts.coda'];
};

ScoreLibrary.Score.Coda.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.Coda(this.number, this.information);

    var supperclass = ScoreLibrary.Score.Coda.supperclass;

    return supperclass.clone.call(this, clone);
};

/**
 * @constructor
 * @extends {ScoreLibrary.Score.GlyphAnchor}
 */
ScoreLibrary.Score.Pedal = function(number, information) {

    var supperclass = ScoreLibrary.Score.Pedal.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.Pedal,
    ScoreLibrary.Score.GlyphAnchor);

ScoreLibrary.Score.Pedal.prototype.toString = function() {

    return 'Score.Pedal';
};

ScoreLibrary.Score.Pedal.prototype.toNodeString = function() {

    return 'pedal';
};

ScoreLibrary.Score.Pedal.prototype.getGlyphNames = function() {

    var glyph_name = undefined;

    switch (this.information.type) {

    case 'start': {
        glyph_name = ['pedal.Ped', 'pedal..'];
    } break;

    case 'stop': {
        glyph_name = ['pedal.*'];
    } break;

    case 'change': {
        glyph_name = ['pedal.*', 'pedal.Ped', 'pedal..'];
    } break;

    case 'continue':
    default: {
    } break;
    }

    return glyph_name;
};

ScoreLibrary.Score.Pedal.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.Pedal(this.number, this.information);

    var supperclass = ScoreLibrary.Score.Pedal.supperclass;

    return supperclass.clone.call(this, clone);
};

/**
 * @constructor
 * @extends {ScoreLibrary.Score.GlyphAnchor}
 */
ScoreLibrary.Score.Accordion = function(number, information) {

    var supperclass = ScoreLibrary.Score.Accordion.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.Accordion,
    ScoreLibrary.Score.GlyphAnchor);

ScoreLibrary.Score.Accordion.prototype.toString = function() {

    return 'Score.Accordion';
};

ScoreLibrary.Score.Accordion.prototype.toNodeString = function() {

    return 'accordion-registration';
};

ScoreLibrary.Score.Accordion.prototype.getGlyphNames = function() {

    return ['accordion.accDiscant'];
};

ScoreLibrary.Score.Accordion.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.Accordion(this.number, this.information);

    var supperclass = ScoreLibrary.Score.accordion.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Score.Accordion.prototype.getDirection = function() {

    return 'upper';
};

ScoreLibrary.Score.Accordion.prototype.createRenderer = function(context) {

    var fix_org_coord = 'glyph_anchor';

    var createAndFixAccordionDot = function(glyph_factory,
                                            accordion_renderer,
                                            y_position,
                                            dot_count) {

        var accordion_requisite_width =
            accordion_renderer.getRequisite('width');
        var accordion_requisite_height =
            accordion_renderer.getRequisite('height');

        var dot_glyph_name = 'accordion.accDot';

        var dot_requisition =
            this.getDefaultSize(dot_glyph_name);

        var dot_glyph =
            glyph_factory.createByName(
                dot_glyph_name,
                dot_requisition.width,
                dot_requisition.height);

        dot_requisition.width = dot_glyph.getRequisite('width');
        dot_requisition.height = dot_glyph.getRequisite('height');

        var dot_x = (accordion_requisite_width -
                     dot_requisition.width) * 0.5;

        var dot_y = (3 - y_position) * accordion_requisite_height / 3 +
            dot_requisition.height * 0.5;

        if (dot_count === 1) {

            dot_glyph.setOrg(fix_org_coord, 'x', dot_x);
            dot_glyph.setOrg(fix_org_coord, 'y', dot_y);

            accordion_renderer.pack(
                dot_glyph, false, false, 0, 0, fix_org_coord);
        }
        else if (dot_count === 2) {

            dot_glyph.setOrg(fix_org_coord, 'x', dot_x - dot_requisition.width);
            dot_glyph.setOrg(fix_org_coord, 'y', dot_y);

            accordion_renderer.pack(
                dot_glyph, false, false, 0, 0, fix_org_coord);

            var dot_clone = dot_glyph.clone();

            dot_clone.setOrg(fix_org_coord, 'x', dot_x + dot_requisition.width);
            dot_clone.setOrg(fix_org_coord, 'y', dot_y);

            accordion_renderer.pack(
                dot_clone, false, false, 0, 0, fix_org_coord);
        }
        else if (dot_count === 3) {

            dot_glyph.setOrg(fix_org_coord, 'x',
                             dot_x - dot_requisition.width * 2);
            dot_glyph.setOrg(fix_org_coord, 'y', dot_y);

            accordion_renderer.pack(
                dot_glyph, false, false, 0, 0, fix_org_coord);

            var dot_clone1 = dot_glyph.clone();

            dot_clone1.setOrg(fix_org_coord, 'x', dot_x);
            dot_clone1.setOrg(fix_org_coord, 'y', dot_y);

            accordion_renderer.pack(
                dot_clone1, false, false, 0, 0, fix_org_coord);

            var dot_clone2 = dot_glyph.clone();

            dot_clone2.setOrg(fix_org_coord, 'x',
                              dot_x + dot_requisition.width * 2);
            dot_clone2.setOrg(fix_org_coord, 'y', dot_y);

            accordion_renderer.pack(
                dot_clone2, false, false, 0, 0, fix_org_coord);
        }
    };

    var supperclass = ScoreLibrary.Score.Accordion.supperclass;

    var accordion_renderer =
        supperclass.createRenderer.call(
            this, context, true);

    if (accordion_renderer) {

        accordion_renderer.setOrg(fix_org_coord, 'x', 0);

        var custom_renderer = context.getCustomTextRenderer();

        var glyph_factory = custom_renderer.getGlyphFactory();

        var registration = this.information;

        if (registration.accordion_high) {

            createAndFixAccordionDot.call(
                this,
                glyph_factory,
                accordion_renderer, 1, 1);
        }

        if (registration.accordion_middle > 0) {

            createAndFixAccordionDot.call(
                this,
                glyph_factory,
                accordion_renderer, 2,
                registration.accordion_middle);
        }

        if (registration.accordion_low) {

            createAndFixAccordionDot.call(
                this,
                glyph_factory,
                accordion_renderer, 3, 1);
        }
    }

    return accordion_renderer;
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
