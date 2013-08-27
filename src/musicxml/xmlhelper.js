goog.provide('ScoreLibrary.Score.XMLHelper');
goog.require('ScoreLibrary.Score');
goog.require('goog.asserts');

/**
 * @constructor
 */
ScoreLibrary.Score.XMLHelper = function() {
};

ScoreLibrary.Score.XMLHelper.toString = function() {

    return 'Score.XMLHelper';
};

ScoreLibrary.Score.XMLHelper.getInstance = function() {

    var instance = ScoreLibrary.Score.XMLHelper.instance;
    if (instance === undefined) {

        instance = new ScoreLibrary.Score.XMLHelper();

        ScoreLibrary.Score.XMLHelper.instance = instance;
    }

    return instance;
};

/**
 * @define {boolean} whether validate value reads from musicxml file.
 */
ScoreLibrary.Score.XMLHelper.DEBUG_VALIDATE_VALUE = true;

ScoreLibrary.Score.XMLHelper.prototype.getJustify = function(node, attributes) {

    attributes = attributes || {};

    attributes.justify =
        node.getStringWithDefault('justify', 'left');

    return attributes;
};

ScoreLibrary.Score.XMLHelper.prototype.getPosition = function(node, attributes) {

    attributes = attributes || {};

    attributes.default_x =
        node.getNumberWithDefault('default-x', 0);
    attributes.default_y =
        node.getNumberWithDefault('default-y', 0);
    attributes.relative_x =
        node.getNumberWithDefault('relative-x', 0);
    attributes.relative_y =
        node.getNumberWithDefault('relative-y', 0);

    return attributes;
};

/*
<!--
	The font entity gathers together attributes for
	determining the font within a directive or direction.
	They are based on the text styles for Cascading
	Style Sheets. The font-family is a comma-separated list
	of font names. These can be specific font styles such
	as Maestro or Opus, or one of several generic font styles:
	music, engraved, handwritten, text, serif, sans-serif,
	handwritten, cursive, fantasy, and monospace. The music,
	engraved, and handwritten values refer to music fonts;
	the rest refer to text fonts. The fantasy style refers to
	decorative text such as found in older German-style
	printing. The font-style can be normal or italic. The
	font-size can be one of the CSS sizes (xx-small, x-small,
	small, medium, large, x-large, xx-large) or a numeric
	point size. The font-weight can be normal or bold. The
	default is application-dependent, but is a text font vs.
	a music font.
-->
<!ENTITY % font
	"font-family  CDATA  #IMPLIED
	 font-style   CDATA  #IMPLIED
	 font-size    CDATA  #IMPLIED
	 font-weight  CDATA  #IMPLIED">
*/
ScoreLibrary.Score.XMLHelper.prototype.getFont = function(node, attributes) {

    attributes = attributes || {};

    attributes.font_family =
        node.getStringWithDefault('font-family', undefined);

    attributes.font_style =
        this.getAndValidateEnumValue(
            node, 'font-style', ['normal', 'italic'], 'normal');

    attributes.font_size =
        node.getStringWithDefault('font-size', 'medium');
    // TODO: validateEnumValue ['xx-small', 'x-small', 'small', 'medium', 'large', 'x-large', 'xx-large'];

    attributes.font_size =
        isNaN(parseFloat(attributes.font_size)) ?
        attributes.font_size : parseFloat(attributes.font_size);

    attributes.font_weight =
        this.getAndValidateEnumValue(
            node, 'font-weight', ['normal', 'bold'], 'normal');

    return attributes;
};

ScoreLibrary.Score.XMLHelper.prototype.getColor = function(node, attributes) {

    attributes = attributes || {};

    attributes.color =
        node.getStringWithDefault('color', '#000000');

    return attributes;
};

/*
<!--
	The print-style entity groups together the most popular
	combination of printing attributes: position, font, and
	color.
-->
*/
ScoreLibrary.Score.XMLHelper.prototype.getPrintStyle = function(node, attributes) {

    attributes = attributes || {};

    attributes.position = this.getPosition(node);
    attributes.font = this.getFont(node);

    this.getColor(node, attributes);

    return attributes;
};

ScoreLibrary.Score.XMLHelper.prototype.getHAlign = function(node, attributes) {

    attributes = attributes || {};

    attributes.halign =
        this.getAndValidateEnumValue(
            node, 'halign', ['left', 'center', 'right'], 'left');

    return attributes;
};

ScoreLibrary.Score.XMLHelper.prototype.getVAlign = function(node, attributes) {

    attributes = attributes || {};

    attributes.valign =
        this.getAndValidateEnumValue(
            node, 'valign', ['top', 'middle', 'bottom', 'baseline'], 'middle');

    return attributes;
};

ScoreLibrary.Score.XMLHelper.prototype.getVAlignImage = function(node, attributes) {

    attributes = attributes || {};

    attributes.valign_image =
        this.getAndValidateEnumValue(
            node, 'valign-image', ['top', 'middle', 'bottom'], 'middle');

    return attributes;
};

ScoreLibrary.Score.XMLHelper.prototype.getPrintStyleAlign = function(node, attributes) {

    attributes = attributes || {};

    this.getPrintStyle(node, attributes);
    this.getHAlign(node, attributes);
    this.getVAlign(node, attributes);

    return attributes;
};

ScoreLibrary.Score.XMLHelper.prototype.getTextDecoration = function(node, attributes) {

    // TODO:
    return attributes;
};


ScoreLibrary.Score.XMLHelper.prototype.getTextDecoration = function(node, attributes) {

    // TODO:
    return attributes;
};

ScoreLibrary.Score.XMLHelper.prototype.getTextRotation = function(node, attributes) {

    // TODO:
    return attributes;
};

ScoreLibrary.Score.XMLHelper.prototype.getLetterSpacing = function(node, attributes) {

    // TODO:
    return attributes;
};

ScoreLibrary.Score.XMLHelper.prototype.getLineHeight = function(node, attributes) {

    // TODO:
    return attributes;
};

ScoreLibrary.Score.XMLHelper.prototype.getTextDirection = function(node, attributes) {

    // TODO:
    return attributes;
};

/*
<!--
	The line-shape entity is used to distinguish between
	straight and curved lines. The line-type entity
	distinguishes between solid, dashed, dotted, and
	wavy lines.
-->
<!ENTITY % line-shape
	"line-shape (straight | curved) #IMPLIED">

<!ENTITY % line-type
	"line-type (solid | dashed | dotted | wavy) #IMPLIED">
*/
ScoreLibrary.Score.XMLHelper.prototype.getLineShapeValue = function(node, path, default_value) {

    return this.getAndValidateEnumValue(
        node, path, ['straight', 'curved'], default_value);
};

ScoreLibrary.Score.XMLHelper.prototype.getLineTypeValue = function(node, path, default_value) {

    return this.getAndValidateEnumValue(
        node, path, ['solid', 'dashed', 'dotted', 'wavy'], default_value);
};

/*
<!--
	The dashed-formatting entity represents the length of
	dashes and spaces in a dashed line. Both the dash-length
	and space-length attributes are represented in tenths.
	These attributes are ignored if the corresponding
	line-type attribute is not dashed.
-->
<!ENTITY % dashed-formatting
	"dash-length   %tenths;  #IMPLIED
	 space-length  %tenths;  #IMPLIED">
*/
ScoreLibrary.Score.XMLHelper.prototype.getDashedFormatting = function(node, attributes) {

    attributes = attributes || {};

    attributes.dash_length =
        node.getNumberWithDefault('dash-length', 5);

    attributes.space_length =
        node.getNumberWithDefault('space-length', 5);

    return attributes;
};
/*
<!--
	The enclosure-shape entity describes the shape and
	presence / absence of an enclosure around text. A bracket
	enclosure is similar to a rectangle with the bottom line
	missing, as is common in jazz notation.
-->
<!ENTITY % enclosure-shape
	"(rectangle | square | oval | circle |
	  bracket | triangle | diamond | none)">
*/
ScoreLibrary.Score.XMLHelper.prototype.getEnclosureShapeValue = function(node, path, default_value) {

    return this.getAndValidateEnumValue(
        node, path, [
            'rectangle', 'square', 'oval', 'circle',
            'bracket', 'triangle', 'diamond', 'none'
        ], default_value);
};
/*
<!--
	The enclosure entity is used to specify the
	formatting of an enclosure around text or symbols.
-->
<!ENTITY % enclosure
	"enclosure %enclosure-shape; #IMPLIED">
*/
ScoreLibrary.Score.XMLHelper.prototype.getTextEnclosure = function(node, attributes) {

    attributes = attributes || {};

    attributes.enclosure =
        this.getEnclosureShapeValue(
            node, 'enclosure', attributes.enclosure);

    return attributes;
};

ScoreLibrary.Score.XMLHelper.prototype.getTextFormating = function(node, attributes) {

    attributes = attributes || {};

    this.getJustify(node, attributes);
    this.getPrintStyleAlign(node, attributes);
    this.getTextDecoration(node, attributes);
    this.getLetterSpacing(node, attributes);
    this.getLineHeight(node, attributes);
    this.getTextDirection(node, attributes);
    this.getTextEnclosure(node, attributes);

    attributes.text =
        node.getStringWithDefault(undefined, '');

    return attributes;
};

/*
<!--
	The printout entity is based on MuseData print
	suggestions. They allow a way to specify not to print
	print an object (e.g. note or rest), its augmentation
	dots, or its lyrics. This is especially useful for notes
	that overlap in different voices, or for chord sheets
	that contain lyrics and chords but no melody. For wholly
	invisible notes, such as those providing sound-only data,
	the attribute for print-spacing may be set to no so that
	no space is left for this note. The print-spacing value
	is only used if no note, dot, or lyric is being printed.

	By default, all these attributes are set to yes. If
	print-object is set to no, print-dot and print-lyric are
	interpreted to also be set to no if they are not present.
-->
<!ENTITY % print-object
	"print-object  %yes-no;  #IMPLIED">

<!ENTITY % print-spacing
	"print-spacing %yes-no;  #IMPLIED">

<!ENTITY % printout
	"%print-object;
	 print-dot     %yes-no;  #IMPLIED
	 %print-spacing;
	 print-lyric   %yes-no;  #IMPLIED">
*/

ScoreLibrary.Score.XMLHelper.prototype.isPrintObject = function(node) {

    // default is "yes"
    return this.getYesNoValue(node, 'print-object', true);
};

ScoreLibrary.Score.XMLHelper.prototype.isPrintSpacing = function(node) {

    // default is "false"
    return this.getYesNoValue(node, 'print-spacing', false);
};

ScoreLibrary.Score.XMLHelper.prototype.getPrintOut = function(node, attributes) {

    attributes = attributes || {};

    attributes.print_object = this.isPrintObject(node);
    attributes.print_dot = this.getYesNoValue(node, 'print-dot', true);
    attributes.print_spacing = this.isPrintSpacing(node);
    attributes.print_lyric = this.getYesNoValue(node, 'print-lyric', true);

    return attributes;
};

ScoreLibrary.Score.XMLHelper.prototype.checkRequiredValue = function(node, path, return_value) {

    if (return_value === undefined) {

        if (ScoreLibrary.Score.XMLHelper.DEBUG_VALIDATE_VALUE) {

            goog.asserts.assert(
                false, 'ScoreLibrary.Score.XMLHelper.checkRequiredValue(): unexpect!');
        }
        else {

            ScoreLibrary.Logger.warning(
                'ScoreLibrary.Score.XMLHelper.checkRequiredValue(): unexpect!');
        }
    }

    return return_value;
};

ScoreLibrary.Score.XMLHelper.prototype.checkRangeOfValue = function(node, path, begin, end, return_value) {

    if (return_value && (return_value < begin && return_value > end)) {

        if (ScoreLibrary.Score.XMLHelper.DEBUG_VALIDATE_VALUE) {

            goog.asserts.assert(
                false, 'ScoreLibrary.Score.XMLHelper.checkRangeOfValue(): unexpect!');
        }
        else {

            ScoreLibrary.Logger.warning(
                'ScoreLibrary.Score.XMLHelper.checkRangeOfValue(): unexpect!');
        }
    }

    return return_value;
};

ScoreLibrary.Score.XMLHelper.prototype.getAndValidateEnumValue = function(node, path, possible_values, default_value) {

    var return_value = node.getStringWithDefault(path, default_value);

    return (return_value !== default_value ?
            this.validateEnumValue(
                node, path, possible_values, default_value, return_value) :
            default_value);
};

ScoreLibrary.Score.XMLHelper.prototype.validateEnumValue = function(node, path, possible_values, default_value, return_value) {

    if (possible_values.some(
            function(possible_value) {

                return (return_value === possible_value);
            })) {

        return return_value;
    }

    if (ScoreLibrary.Score.XMLHelper.DEBUG_VALIDATE_VALUE) {

        goog.asserts.assert(
            false, 'ScoreLibrary.Score.XMLHelper.validateEnumValue(): unexpected value!');
    }
    else {

        ScoreLibrary.Logger.warning(
            'ScoreLibrary.Score.XMLHelper.validateEnumValue(): unexpected value!');
    }

    return default_value;
};

/*
<!--
	The start-stop and start-stop-continue entities are used
	for musical elements that can either start or stop, such
	as slurs, tuplets, and wedges. The start-stop-continue
	entity is used when there is a need to refer to an
	intermediate point in the symbol, as for complex slurs
	or for specifying formatting of symbols across system
	breaks. The start-stop-single entity is used when the same
	element is used for multi-note and single-note notations,
	as for tremolos.

	The values of start, stop, and continue refer to how an
	element appears in musical score order, not in MusicXML
	document order. An element with a stop attribute may
	precede the corresponding element with a start attribute
	within a MusicXML document. This is particularly common
	in multi-staff music. For example, the stopping point for
	a slur may appear in staff 1 before the starting point for
	the slur appears in staff 2 later in the document.
-->
<!ENTITY % start-stop "(start | stop)">
<!ENTITY % start-stop-continue "(start | stop | continue)">
<!ENTITY % start-stop-single "(start | stop | single)">
*/
ScoreLibrary.Score.XMLHelper.prototype.getStartStopValue = function(node, path, default_value) {

    return this.getAndValidateEnumValue(
        node, path, ['start', 'stop'], default_value);
};

ScoreLibrary.Score.XMLHelper.prototype.getStartStopContinueValue = function(node, path, default_value) {

    return this.getAndValidateEnumValue(
        node, path, ['start', 'stop', 'continue'], default_value);
};

ScoreLibrary.Score.XMLHelper.prototype.getStartStopSingleValue = function(node, path, default_value) {

    return this.getAndValidateEnumValue(
        node, path, ['start', 'stop', 'single'], default_value);
};

/*
<!--
	The yes-no entity is used for boolean-like attributes.
-->
<!ENTITY % yes-no "(yes | no)">
*/
ScoreLibrary.Score.XMLHelper.prototype.getYesNoValue = function(node, path, default_value) {

    return ('yes' ===
            this.getAndValidateEnumValue(
                node, path, ['yes', 'no'], (default_value ? 'yes' : 'no')));
};
/*
<!--
	The symbol-size entity is used to indicate full vs.
	cue-sized vs. oversized symbols. The large value
	for oversized symbols was added in version 1.1.
-->
<!ENTITY % symbol-size "(full | cue | large)">
*/
ScoreLibrary.Score.XMLHelper.prototype.getSymbolSize = function(node, attributes, defaule_value) {

    attributes = attributes || {};

    attributes.size =
        this.getAndValidateEnumValue(
            node, 'size', ['full', 'cue', 'large'],
            (defaule_value ? defaule_value : 'full'));

    return attributes;
};

/*
<!--
	The above-below type is used to indicate whether one
	element appears above or below another element.
-->
<!ENTITY % above-below "(above | below)">
*/
ScoreLibrary.Score.XMLHelper.prototype.getAboveBelowValue = function(node, path, defaule_value) {

    return this.getAndValidateEnumValue(
            node, path, ['above', 'below'], defaule_value);
};

/*
<!--
	The up-down entity is used for arrow direction,
	indicating which way the tip is pointing.
-->
<!ENTITY % up-down "(up | down)">
*/
ScoreLibrary.Score.XMLHelper.prototype.getUpDownValue = function(node, path, defaule_value) {

    return this.getAndValidateEnumValue(
            node, path, ['up', 'down'], defaule_value);
};

/*
<!--
	The top-bottom entity is used to indicate the top or
	bottom part of a vertical shape like non-arpeggiate.
-->
<!ENTITY % top-bottom "(top | bottom)">
*/
ScoreLibrary.Score.XMLHelper.prototype.getTopBottomValue = function(node, path, defaule_value) {

    return this.getAndValidateEnumValue(
            node, path, ['top', 'bottom'], defaule_value);
};

/*
<!--
	The left-right entity is used to indicate whether one
	element appears to the left or the right of another
	element.
-->
<!ENTITY % left-right "(left | right)">
*/
ScoreLibrary.Score.XMLHelper.prototype.getLeftRightValue = function(node, path, defaule_value) {

    return this.getAndValidateEnumValue(
            node, path, ['left', 'right'], defaule_value);
};

/*
<!--
	The level-display entity allows specification of three
	common ways to indicate editorial indications: putting
	parentheses or square brackets around a symbol, or making
	the symbol a different size. If not specified, they are
	left to application defaults. It is used by the level and
	accidental elements.
-->
<!ENTITY % level-display
	"parentheses %yes-no;       #IMPLIED
	 bracket     %yes-no;       #IMPLIED
	 size        %symbol-size;  #IMPLIED">
*/
ScoreLibrary.Score.XMLHelper.prototype.getLevelDisplay = function(node, attributes) {

    attributes = attributes || {};

    attributes.parentheses = this.getYesNoValue(node, 'parentheses', false);

    attributes.bracket = (attributes.parentheses ?
                              false : this.getYesNoValue(node, 'bracket', false));

    if (!(attributes.parentheses || attributes.bracket)) {

        this.getSymbolSize(node, attributes);
    }

    return attributes;
};

/*
<!--
	The part-list identifies the different musical parts in
	this movement. Each part has an ID that is used later
	within the musical data. Since parts may be encoded
	separately and combined later, identification elements
	are present at both the score and score-part levels.
	There must be at least one score-part, combined as
	desired with part-group elements that indicate braces
	and brackets. Parts are ordered from top to bottom in
	a score based on the order in which they appear in the
	part-list.

	Each MusicXML part corresponds to a track in a Standard
	MIDI Format 1 file. The score-instrument elements are
	used when there are multiple instruments per track.
	The midi-device element is used to make a MIDI device
	or port assignment for the given track or specific MIDI
	instruments. Initial midi-instrument assignments may be
	made here as well.

	The part-name-display and part-abbreviation-display
	elements are defined in the common.mod file, as they can
	be used within both the score-part and print elements.
-->
<!ELEMENT part-list (part-group*, score-part,
	(part-group | score-part)*)>
<!ELEMENT score-part (identification?,
	part-name, part-name-display?,
	part-abbreviation?, part-abbreviation-display?,
	group*, score-instrument*,
	(midi-device?, midi-instrument?)*)>
<!ATTLIST score-part
    id ID #REQUIRED
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getPartListItem = function(node, attributes) {

    attributes = attributes || {};

    attributes.id =
        this.checkRequiredValue(
            node, 'id',
            node.getStringWithDefault('id', undefined));

    if (attributes.id) {

        attributes.identification =
            node.getStringWithDefault('identification', undefined);

        attributes.part_name =
            node.getStringWithDefault('part-name', '');

        attributes.part_name_display =
            node.getStringWithDefault('part-name-display', '');

	attributes.part_abbreviation =
            node.getStringWithDefault('part-abbreviation', '');

        attributes.part_abbreviation_display =
            node.getStringWithDefault('part-abbreviation-display', '');
    }

    return attributes;
};

/*
<!--
	The part-group element indicates groupings of parts in the
	score, usually indicated by braces and brackets. Braces
	that are used for multi-staff parts should be defined in
	the attributes element for that part. The part-group start
	element appears before the first score-part in the group.
	The part-group stop element appears after the last
	score-part in the group.

	The number attribute is used to distinguish overlapping
	and nested part-groups, not the sequence of groups. As
	with parts, groups can have a name and abbreviation.
	Formatting attributes for group-name and group-abbreviation
	are deprecated in Version 2.0 in favor of the new
	group-name-display and group-abbreviation-display elements.
	Formatting specified in the group-name-display and
	group-abbreviation-display elements overrides formatting
	specified in the group-name and group-abbreviation
	elements, respectively.

	The group-symbol element indicates how the symbol for
	a group is indicated in the score. Values include none,
	brace, line, bracket, and square; the default is none.
	The group-barline element indicates if the group should
	have common barlines. Values can be yes, no, or
	Mensurstrich. The group-time element indicates that the
	displayed time signatures should stretch across all parts
	and staves in the group. Values for the child elements
	are ignored at the stop of a group.

	A part-group element is not needed for a single multi-staff
	part. By default, multi-staff parts include a brace symbol
	and (if appropriate given the bar-style) common barlines.
	The symbol formatting for a multi-staff part can be more
	fully specified using the part-symbol element, defined in
	the attributes.mod file.
-->
<!ELEMENT part-group (group-name?, group-name-display?,
	group-abbreviation?, group-abbreviation-display?,
	group-symbol?, group-barline?, group-time?, %editorial;)>
<!ATTLIST part-group
    type %start-stop; #REQUIRED
    number CDATA "1"
>

<!ELEMENT group-name (#PCDATA)>
<!ATTLIST group-name
    %print-style;
    %justify;
>
<!ELEMENT group-name-display
	((display-text | accidental-text)*)>
<!ATTLIST group-name-display
    %print-object;
>
<!ELEMENT group-abbreviation (#PCDATA)>
<!ATTLIST group-abbreviation
    %print-style;
    %justify;
>
<!ELEMENT group-abbreviation-display
	((display-text | accidental-text)*)>
<!ATTLIST group-abbreviation-display
    %print-object;
>

<!ELEMENT group-symbol (#PCDATA)>
<!ATTLIST group-symbol
    %position;
    %color;
>

<!ELEMENT group-barline (#PCDATA)>
<!ATTLIST group-barline
    %color;
>
<!ELEMENT group-time EMPTY>
*/
ScoreLibrary.Score.XMLHelper.prototype.getPartGroup = function(node, attributes) {

    attributes = attributes || {};

    attributes.number = node.getNumberWithDefault('number', 1);

    attributes.type =
        this.checkRequiredValue(
            node, 'type',
            this.getStartStopValue(node, 'type', undefined));

    attributes.group_name =
        node.getStringWithDefault('group-name', '');
    attributes.group_name_display =
        node.getStringWithDefault('group-name-display', '');

    attributes.group_abbreviation =
        node.getStringWithDefault('group-abbreviation', '');
    attributes.group_abbreviation_display =
        node.getStringWithDefault('group-abbreviation-display', '');

    attributes.group_symbol =
        this.getAndValidateEnumValue(
            node, 'group-symbol',
            ['none', 'brace', 'line', 'bracket', 'square'], 'none');

    attributes.group_barline =
        this.getYesNoValue(node, 'group-barline', false);

    attributes.group_time = node.getBool('group-time');

    return attributes;
};

/*
<!--
	In either format, the part element has an id attribute that
	is an IDREF back to a score-part in the part-list. Measures
	have a required number attribute (going from partwise to
	timewise, measures are grouped via the number).
-->
<!ATTLIST part
    id IDREF #REQUIRED
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getScorePart = function(node, attributes) {

    attributes = attributes || {};

    attributes.id =
        this.checkRequiredValue(
            node, 'id',
            node.getStringWithDefault('id', undefined));

    return attributes;
};

/*
<!--
	The implicit attribute is set to "yes" for measures where
	the measure number should never appear, such as pickup
	measures and the last half of mid-measure repeats. The
	value is "no" if not specified.

	The non-controlling attribute is intended for use in
	multimetric music like the Don Giovanni minuet. If set
	to "yes", the left barline in this measure does not
	coincide with the left barline of measures in other
	parts. The value is "no" if not specified.

	In partwise files, the number attribute should be the same
	for measures in different parts that share the same left
	barline. While the number attribute is often numeric, it
	does not have to be. Non-numeric values are typically used
	together with the implicit or non-controlling attributes
	being set to "yes". For a pickup measure, the number
	attribute is typically set to "0" and the implicit attribute
	is typically set to "yes". Further details about measure
	numbering can be defined using the measure-numbering
	element defined in the direction.mod file

	Measure width is specified in tenths. These are the
	global tenths specified in the scaling element, not
	local tenths as modified by the staff-size element.
	The width covers the entire measure from barline
	or system start to barline or system end.
-->
<!ATTLIST measure
    number CDATA #REQUIRED
    implicit %yes-no; #IMPLIED
    non-controlling %yes-no; #IMPLIED
    width %tenths; #IMPLIED
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getScoreMeasure = function(node, attributes) {

    attributes = attributes || {};

    attributes.number =
        this.checkRequiredValue(
            node, 'number',
            node.getNumberWithDefault('number', undefined));

    attributes.implicit =
        this.getYesNoValue(node, 'implicit', false);

    attributes.non_controlling =
        this.getYesNoValue(node, 'non-controlling', false);

    attributes.width =
        node.getNumberWithDefault('width', undefined);

    return attributes;
};

ScoreLibrary.Score.XMLHelper.prototype.getStepValue = function(node, path, required) {

    required = required || false;

    var return_value = this.getAndValidateEnumValue(
        node, path, ['A', 'B', 'C', 'D', 'E', 'F', 'G'], undefined);

    return (required ? this.checkRequiredValue(
        node, path, return_value) : return_value);
};

ScoreLibrary.Score.XMLHelper.prototype.getOctaveValue = function(node, path, required) {

    required = required || false;

    var return_value = this.checkRangeOfValue(
        node, path, 0, 9,
        node.getNumberWithDefault(
            path, undefined));

    return (required ? this.checkRequiredValue(
        node, path, return_value) : return_value);
};


/*
<!--
	Pitch is represented as a combination of the step of the
	diatonic scale, the chromatic alteration, and the octave.
	The step element uses the English letters A through G.
	The alter element represents chromatic alteration in
	number of semitones (e.g., -1 for flat, 1 for sharp).
	Decimal values like 0.5 (quarter tone sharp) are
	used for microtones. The octave element is represented
	by the numbers 0 to 9, where 4 indicates the octave
	started by middle C.
-->
<!ELEMENT pitch (step, alter?, octave)>
<!ELEMENT step (#PCDATA)>
<!ELEMENT alter (#PCDATA)>
<!ELEMENT octave (#PCDATA)>
*/
ScoreLibrary.Score.XMLHelper.prototype.getPitch = function(node, attributes) {

    attributes = attributes || {};

    attributes.step = this.getStepValue(node, 'step');

    attributes.octave = this.getOctaveValue(node, 'octave');

    attributes.alter =
        node.getNumberWithDefault('alter', 0);

    return attributes;
};

/*
<!--
	The unpitched element indicates musical elements that are
	notated on the staff but lack definite pitch, such as
	unpitched percussion and speaking voice. Like notes, it
	uses step and octave elements to indicate placement on the
	staff, following the current clef. If percussion clef is
	used, the display-step and display-octave elements are
	interpreted as if in treble clef, with a G in octave 4 on
	line 2. If not present, the note is placed on the middle
	line of the staff, generally used for a one-line staff.
-->
<!ELEMENT unpitched ((display-step, display-octave)?)>
<!ELEMENT display-step (#PCDATA)>
<!ELEMENT display-octave (#PCDATA)>
*/
ScoreLibrary.Score.XMLHelper.prototype.getUnpitched = function(node, attributes) {

    attributes = attributes || {};

    attributes.display_step =
        this.getStepValue(node, 'display-step', false);

    attributes.display_octave =
        this.getOctaveValue(node, 'display-octave', false);

    return attributes;
};

/*
<!--
	The rest element indicates notated rests or silences. Rest
	elements are usually empty, but placement on the staff can
	be specified using display-step and display-octave
	elements. If the measure attribute is set to yes, it
	indicates this is a complete measure rest.
-->
<!ELEMENT rest ((display-step, display-octave)?)>
<!ATTLIST rest
    measure %yes-no; #IMPLIED
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getRest = function(node, attributes) {

    attributes = attributes || {};

    attributes.display_step =
        this.getStepValue(node, 'display-step', false);

    attributes.display_octave =
        this.getOctaveValue(node, 'display-octave', false);

    attributes.measure =
        this.getYesNoValue(node, 'measure', false);

    return attributes;
};

/*
<!--
	The time-only entity is used to indicate that a particular
	playback-related element only applies particular times through
	a repeated section. The value is a comma-separated list of
	positive integers arranged in ascending order, indicating which
	times through the repeated section that the element applies.
-->
<!ENTITY % time-only
	"time-only CDATA #IMPLIED">
*/
ScoreLibrary.Score.XMLHelper.prototype.getTimeOnly = function(node, attributes) {

    attributes = attributes || {};

    var time_only =
        node.getStringWithDefault('time-only', '');

    if (time_only) {

        attributes.time_only =
            time_only.split(',').map(
                function(str) {

                    return Number(str);
                });
    }

    return attributes;
};

/*
<!--
	Duration is a positive number specified in division units.
	This is the intended duration vs. notated duration (for
	instance, swing eighths vs. even eighths, or differences
	in dotted notes in Baroque-era music). Differences in
	duration specific to an interpretation or performance
	should use the note element's attack and release
	attributes.

	The tie element indicates that a tie begins or ends with
	this note. If the tie element applies only particular times
	through a repeat, the time-only attribute indicates which
	times to apply it. The tie element indicates sound; the tied
	element indicates notation.
-->
<!ELEMENT duration (#PCDATA)>
<!ELEMENT tie EMPTY>
<!ATTLIST tie
    type %start-stop; #REQUIRED
    %time-only;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getDuration = function(node, attributes) {

    attributes = attributes || {};

    attributes.duration =
        this.checkRequiredValue(
            node, 'duration',
            node.getNumberWithDefault('duration', undefined));

    return attributes;
};

ScoreLibrary.Score.XMLHelper.prototype.getTie = function(node, attributes) {

    attributes = attributes || {};

    attributes.type =
        this.checkRequiredValue(
            node, 'type',
            this.getStartStopValue(
                node, 'type', undefined));

    this.getTimeOnly(node, attributes);

    return attributes;
};

/*
<!--
	The common note elements between cue/grace notes and
	regular (full) notes: pitch, chord, and rest information,
	but not duration (cue and grace notes do not have
	duration encoded here). Unpitched elements are used for
	unpitched percussion, speaking voice, and other musical
	elements lacking determinate pitch.
-->
<!ATTLIST note
    %print-style;
    %printout;
    dynamics CDATA #IMPLIED
    end-dynamics CDATA #IMPLIED
    attack CDATA #IMPLIED
    release CDATA #IMPLIED
    %time-only;
    pizzicato %yes-no; #IMPLIED
>
<!ENTITY % full-note "(chord?, (pitch | unpitched | rest))">

<!--
	The chord element indicates that this note is an additional
	chord tone with the preceding note. The duration of this
	note can be no longer than the preceding note. In MuseData,
	a missing duration indicates the same length as the previous
	note, but the MusicXML format requires a duration for chord
	notes too.
-->
<!ELEMENT chord EMPTY>
*/
ScoreLibrary.Score.XMLHelper.prototype.getNoteCommon = function(node, attributes) {

    attributes = attributes || {};

    var type_node = node.getNode('type');
    if (type_node) {

        this.getNoteType(type_node, attributes);
    }

    // TODO: get dot's print-style & placement.
    attributes.dots =
        this.getDotsValue(node, 'dot');

    var accidental_node = node.getNode('accidental');
    if (accidental_node) {

        attributes.accidental =
            this.getAccidental(accidental_node);
    }

    var time_modification_node = node.getNode('time-modification');
    if (time_modification_node) {

        attributes.time_modification =
            this.getTimeModification(time_modification_node);
    }

    var stem_node = node.getNode('stem');
    if (stem_node) {

        this.getNoteStem(stem_node, attributes);
    }

    var notehead_node = node.getNode('notehead');
    if (notehead_node) {

        attributes.notehead =
            this.getNoteHead(notehead_node);
    }

    node.forEachNode(
        'beam',
        function(index, beam_node) {

            attributes.beams =
                attributes.beams || [];

            var beam = this.getBeam(beam_node);

            attributes.beams.push(beam);
        }, this);

    var notations_node = node.getNode('notations');
    if (notations_node) {

        this.getNotations(notations_node, attributes);
    }

    node.forEachNode(
        'lyric',
        function(index, lyric_node) {

            attributes.lyrics =
                attributes.lyrics || [];

            var lyric = this.getLyric(lyric_node);

            attributes.lyrics.push(lyric);
        }, this);

    this.getStaffNumber(node, attributes);
    this.getEditorialVoice(node, attributes);
    this.getPrintStyle(node, attributes);
    this.getPrintOut(node, attributes);

    attributes.is_chord = node.getBool('chord');

    var pitch_node = node.getNode('pitch');
    if (pitch_node) {

        this.getPitch(pitch_node, attributes);
    }

    var unpitched_node = node.getNode('unpitched');
    if (unpitched_node) {

        this.getUnpitched(unpitched_node, attributes);
    }

    var rest_node = node.getNode('rest');
    if (rest_node) {

        attributes.is_rest = true;

        this.getRest(rest_node, attributes);
    }

    return attributes;
};

/*
<!--
	Type indicates the graphic note type, Valid values (from
	shortest to longest) are 1024th, 512th, 256th, 128th,
	64th, 32nd, 16th, eighth, quarter, half, whole, breve,
	long, and maxima. The size attribute indicates full, cue,
	or large size, with full the default for regular notes and
	cue the default for cue and grace notes.
-->
<!ELEMENT type (#PCDATA)>
<!ATTLIST type
    size %symbol-size; #IMPLIED
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getNoteTypeValue = function(node, path, default_value) {

    return this.getAndValidateEnumValue(
        node, path,
        ['1024th', '512th', '256th', '128th',
	 '64th', '32nd', '16th', 'eighth', 'quarter',
         'half', 'whole', 'breve', 'long', 'maxima'],
        default_value);
};

ScoreLibrary.Score.XMLHelper.prototype.getNoteType = function(node, attributes) {

    attributes = attributes || {};

    attributes.type = this.getNoteTypeValue(node, undefined, undefined);
    attributes.size =
        this.getSymbolSize(node, attributes.is_full ? 'full' : 'cue');

    return attributes;
};

/*
<!--
	Stems can be down, up, none, or double. For down and up
	stems, the position attributes can be used to specify
	stem length. The relative values specify the end of the
	stem relative to the program default. Default values
	specify an absolute end stem position. Negative values of
	relative-y that would flip a stem instead of shortening
	it are ignored. A stem element associated with a rest
	refers to a stemlet.
-->
<!ELEMENT stem (#PCDATA)>
<!ATTLIST stem
    %position;
    %color;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getNoteStem = function(node, attributes) {

    attributes = attributes || {};

    attributes.stem =
        this.getAndValidateEnumValue(
            node, undefined,
            ['down', 'up', 'none', 'double'], undefined);

    // TODO: position & color.
    return attributes;
};

/*
<!--
	Staff assignment is only needed for music notated on
	multiple staves. Used by both notes and directions. Staff
	values are numbers, with 1 referring to the top-most staff
	in a part.
-->
<!ELEMENT staff (#PCDATA)>
*/
ScoreLibrary.Score.XMLHelper.prototype.getStaffNumber = function(node, attributes) {

    attributes = attributes || {};

    attributes.staff_number =
        node.getNumberWithDefault('staff', 1);

    return attributes;
};

/*
<!--
	The notehead element indicates shapes other than the open
	and closed ovals associated with note durations. The element
	value can be slash, triangle, diamond, square, cross, x,
	circle-x, inverted triangle, arrow down, arrow up, slashed,
	back slashed, normal, cluster, circle dot, left triangle,
	rectangle, or none. For shape note music, the element values
	do, re, mi, fa, fa up, so, la, and ti are also used,
	corresponding to Aikin's 7-shape system. The fa up shape is
	typically used with upstems; the fa shape is typically used
	with downstems or no stems.

	The arrow shapes differ from triangle and inverted triangle
	by being centered on the stem. Slashed and back slashed
	notes include both the normal notehead and a slash. The
	triangle shape has the tip of the triangle pointing up;
	the inverted triangle shape has the tip of the triangle
	pointing down. The left triangle shape is a right triangle
	with the hypotenuse facing up and to the left.

	For the enclosed shapes, the default is to be hollow for
	half notes and longer, and filled otherwise. The filled
	attribute can be set to change this if needed.

	If the parentheses attribute is set to yes, the notehead
	is parenthesized. It is no by default.

	The notehead-text element indicates text that is displayed
	inside a notehead, as is done in some educational music.
	It is not needed for the numbers used in tablature or jianpu
	notation. The presence of a TAB or jianpu clefs is sufficient
	to indicate that numbers are used. The display-text and
	accidental-text elements allow display of fully formatted
	text and accidentals.
-->
<!ELEMENT notehead (#PCDATA)>
<!ATTLIST notehead
    filled %yes-no; #IMPLIED
    parentheses %yes-no; #IMPLIED
    %font;
    %color;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getNoteHead = function(node, attributes) {

    attributes = attributes || {};

    attributes.notehead =
        this.getAndValidateEnumValue(
            node, undefined,
            ['slash', 'triangle', 'diamond', 'square', 'cross', 'x',
	     'circle-x', 'inverted triangle', 'arrow down', 'arrow up', 'slashed',
	     'back slashed', 'normal', 'cluster', 'circle dot', 'left triangle',
	     'rectangle', 'none',
             'do', 're', 'mi', 'fa', 'fa up', 'so', 'la', 'ti'], 'normal');

    attributes.filled = this.getYesNoValue(node, 'filled', true);
    attributes.parentheses = this.getYesNoValue(node, 'parentheses', false);

    this.getFont(node, attributes);
    this.getColor(node, attributes);

    return attributes;
};

/*
<!--
	These elements are used both in the time-modification and
	metronome-tuplet elements. The actual-notes element
	describes how many notes are played in the time usually
	occupied by the number of normal-notes. If the normal-notes
	type is different than the current note type (e.g., a
	quarter note within an eighth note triplet), then the
	normal-notes type (e.g. eighth) is specified in the
	normal-type and normal-dot elements. The content of the
	actual-notes and normal-notes elements ia a non-negative
	integer.
-->
<!ELEMENT actual-notes (#PCDATA)>
<!ELEMENT normal-notes (#PCDATA)>
<!ELEMENT normal-type (#PCDATA)>
<!ELEMENT normal-dot EMPTY>
*/

/*
<!--
	Time modification indicates tuplets, double-note tremolos,
	and other durational changes. A time-modification element
	shows how the cumulative, sounding effect of tuplets and
	double-note tremolos compare to the written note type
	represented by the type and dot elements. The child elements
	are defined in the common.mod file. Nested tuplets and other
	notations that use more detailed information need both the
	time-modification and tuplet elements to be represented
	accurately.
-->
<!ELEMENT time-modification
	(actual-notes, normal-notes, (normal-type, normal-dot*)?)>
*/
ScoreLibrary.Score.XMLHelper.prototype.getTimeModification = function(node, attributes) {

    attributes = attributes || {};

    attributes.actual_notes =
        this.checkRequiredValue(
            node, 'actual-notes',
            node.getNumberWithDefault('actual-notes', undefined));

    attributes.normal_notes =
        this.checkRequiredValue(
            node, 'normal-notes',
            node.getNumberWithDefault('normal-notes', undefined));

    var normal_type_node = node.getNode('normal-type');
    if (normal_type_node) {

        attributes.normal_type =
            this.getNoteTypeValue(normal_type_node, undefined);

        attributes.normal_dots =
            this.getDotsValue(node, 'normal-dot');
    }

    return attributes;
};

/*
<!--
	Notes are the most common type of MusicXML data. The
	MusicXML format keeps the MuseData distinction between
	elements used for sound information and elements used for
	notation information (e.g., tie is used for sound, tied for
	notation). Thus grace notes do not have a duration element.
	Cue notes have a duration element, as do forward elements,
	but no tie elements. Having these two types of information
	available can make interchange considerably easier, as
	some programs handle one type of information much more
	readily than the other.
-->
<!ELEMENT note
	(((grace, %full-note;, (tie, tie?)?) |
	  (cue, %full-note;, duration) |
	  (%full-note;, duration, (tie, tie?)?)),
	 instrument?, %editorial-voice;, type?, dot*,
	 accidental?, time-modification?, stem?, notehead?,
	 notehead-text?, staff?, beam*, notations*, lyric*, play?)>

<!--
	The position and printout entities for printing suggestions
	are defined in the common.mod file.

	The dynamics and end-dynamics attributes correspond to
	MIDI 1.0's Note On and Note Off velocities, respectively.
	They are expressed in terms of percentages of the default
	forte value (90 for MIDI 1.0). The attack and release
	attributes are used to alter the starting and stopping time
	of the note from when it would otherwise occur based on
	the flow of durations - information that is specific to a
	performance. They are expressed in terms of divisions,
	either positive or negative. A note that starts a tie should
	not have a release attribute, and a note that stops a tie
	should not have an attack attribute. If a note is played
	only particular times through a repeat, the time-only entity
	shows which times to play the note. The pizzicato attribute
	is used when just this note is sounded pizzicato, vs. the
	pizzicato element which changes overall playback between
	pizzicato and arco.
-->
*/
ScoreLibrary.Score.XMLHelper.prototype.getScoreNote = function(node, attributes) {

    attributes = attributes || {};

    var grace_node = node.getNode('grace');
    if (grace_node) {

        attributes.is_grace = true;

        this.getGrace(grace_node, attributes);
    }

    var cue_node = node.getNode('cue');
    if (cue_node) {

        attributes.is_cue = true;
    }

    if (!grace_node && !cue_node) {

        attributes.is_full = true;
    }

    // !NOTE: getNoteCommon must called after is_* determinated.
    this.getNoteCommon(node, attributes);

    if (attributes.is_full || attributes.is_cue) {

        this.getDuration(node, attributes);
    }

    if (attributes.is_full || attributes.is_grace) {

        node.forEachNode(
            'tie',
            function(index, tie_node) {

                attributes.ties =
                    attributes.ties || [];

                attributes.ties.push(
                    this.getTie(tie_node));
            }, this);
    }

    return attributes;
};

/*
<!--
	The cue and grace elements indicate the presence of cue and
	grace notes. The slash attribute for a grace note is yes for
	slashed eighth notes. The other grace note attributes come
	from MuseData sound suggestions. The steal-time-previous
	attribute indicates the percentage of time to steal from the
	previous note for the grace note. The steal-time-following
	attribute indicates the percentage of time to steal from the
	following note for the grace note, as for appoggiaturas. The
	make-time attribute indicates to make time, not steal time;
	the units are in real-time divisions for the grace note.
-->
<!ELEMENT cue EMPTY>
<!ELEMENT grace EMPTY>
<!ATTLIST grace
    steal-time-previous CDATA #IMPLIED
    steal-time-following CDATA #IMPLIED
    make-time CDATA #IMPLIED
    slash %yes-no; #IMPLIED
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getGrace = function(node, attributes) {

    attributes = attributes || {};

    attributes.steal_time_previous =
        node.getNumberWithDefault('steal-time-previous', 0);

    attributes.steal_time_following =
        node.getNumberWithDefault('steal-time-following', 0);

    attributes.make_time =
        node.getNumberWithDefault('make-time', 0);

    attributes.slash = this.getYesNoValue(node, 'slash', false);

    return attributes;
};

/*
<!--
	The staff-details element is used to indicate different
	types of staves. The staff-type element can be ossia,
	cue, editorial, regular, or alternate. An alternate staff
	indicates one that shares the same musical data as the
	prior staff, but displayed differently (e.g., treble and
	bass clef, standard notation and tab). The staff-lines
	element specifies the number of lines for a non 5-line
	staff. The staff-tuning and capo elements are used to
	specify tuning when using tablature notation. The optional
	number attribute specifies the staff number from top to
	bottom on the system, as with clef. The optional show-frets
	attribute indicates whether to show tablature frets as
	numbers (0, 1, 2) or letters (a, b, c). The default choice
	is numbers. The print-object attribute is used to indicate
	when a staff is not printed in a part, usually in large
	scores where empty parts are omitted. It is yes by default.
	If print-spacing is yes while print-object is no, the score
	is printed in cutaway format where vertical space is left
	for the empty part.
-->
<!ELEMENT staff-details (staff-type?, staff-lines?,
	staff-tuning*, capo?, staff-size?)>
<!ATTLIST staff-details
    number         CDATA                #IMPLIED
    show-frets     (numbers | letters)  #IMPLIED
    %print-object;
    %print-spacing;
>
<!ELEMENT staff-type (#PCDATA)>
<!ELEMENT staff-lines (#PCDATA)>

<!--
	The tuning-step, tuning-alter, and tuning-octave
	elements are defined in the common.mod file. Staff
	lines are numbered from bottom to top.
-->
<!ELEMENT staff-tuning
	(tuning-step, tuning-alter?, tuning-octave)>
<!ATTLIST staff-tuning
    line CDATA #REQUIRED
>

<!--
	The capo element indicates at which fret a capo should
	be placed on a fretted instrument. This changes the
	open tuning of the strings specified by staff-tuning
	by the specified number of half-steps.
-->
<!ELEMENT capo (#PCDATA)>

<!--
	The staff-size element indicates how large a staff
	space is on this staff, expressed as a percentage of
	the work's default scaling. Values less than 100 make
	the staff space smaller while values over 100 make the
	staff space larger. A staff-type of cue, ossia, or
	editorial implies a staff-size of less than 100, but
	the exact value is implementation-dependent unless
	specified here. Staff size affects staff height only,
	not the relationship of the staff to the left and
	right margins.
-->
<!ELEMENT staff-size (#PCDATA)>
*/
ScoreLibrary.Score.XMLHelper.prototype.getStaffTuning = function(node, attributes) {

    attributes = attributes || {};

    attributes.line =
        this.checkRequiredValue(
            node, 'line',
            node.getNumberWithDefault('line', undefined));

    attributes.step = this.getStepValue(node, 'tuning-step', true);
    attributes.octave = this.getOctaveValue(node, 'tuning-octave', true);
    attributes.alter = node.getNumberWithDefault('tuning-alter', 0);

    return attributes;
};

ScoreLibrary.Score.XMLHelper.prototype.getStaffDetails = function(node, attributes) {

    attributes = attributes || {};

    attributes.number = node.getNumberWithDefault('number', 1);

    attributes.show_frets =
        this.getAndValidateEnumValue(
            node, 'show-frets', ['number', 'letters'], 'number');

    attributes.print_object = this.isPrintObject(node);
    attributes.print_spacing = this.isPrintSpacing(node);
    attributes.staff_type =
        this.getAndValidateEnumValue(
            node, 'staff-type',
            ['ossia', 'cue', 'editorial', 'regular', 'alternate'],
            'regular');

    attributes.staff_lines = node.getNumberWithDefault('staff-lines', 5);
    if (attributes.staff_lines <= 0) {

        attributes.staff_lines = 5;
    }

    attributes.staff_size = node.getNumberWithDefault('staff-size', 100);
    attributes.capo = node.getNumberWithDefault('capo', 0);

    node.forEachNode(
        'staff-tuning',
        function(index, tuning_node) {

            var staff_tuning = this.getStaffTuning(tuning_node);

            attributes.staff_tunings = attributes.staff_tunings || [];
            attributes.staff_tunings[staff_tuning.line - 1] = staff_tuning;
        }, this);

    return attributes;
};

/*
<!--
	The part-symbol element indicates how a symbol for a
	multi-staff part is indicated in the score. Values include
	none, brace, line, bracket, and square; brace is the default.
	The top-staff and bottom-staff elements are used when the
	brace does not extend across the entire part. For example, in
	a 3-staff organ part, the top-staff will typically be 1 for
	the right hand, while the bottom-staff will typically be 2
	for the left hand. Staff 3 for the pedals is usually outside
	the brace. By default, the presence of a part-symbol element
	that does not extend across the entire part also indicates a
	corresponding change in the common barlines within a part.
 -->
<!ELEMENT part-symbol (#PCDATA)>
<!ATTLIST part-symbol
	top-staff CDATA #IMPLIED
	bottom-staff CDATA #IMPLIED
    %position;
    %color;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getPartSymbol = function(node, attributes) {

    attributes = attributes || {};

    attributes.symbol =
        this.getAndValidateEnumValue(
            node, undefined,
            ['none', 'brace', 'line', 'bracket', 'square'], 'brace');

    attributes.top_staff =
        node.getNumberWithDefault('top-staff', undefined);

    attributes.bottom_staff =
        node.getNumberWithDefault('bottom-staff', undefined);

    this.getPosition(node, attributes);
    this.getColor(node, attributes);

    return attributes;
};

/*
<!--
	The slash-type and slash-dot elements are optional children
	of the beat-repeat and slash elements. They have the same
	values as the type and dot elements, and define what the
	beat is for the display of repetition marks. If not present,
	the beat is based on the current time signature.
-->
<!ELEMENT slash-type (#PCDATA)>
<!ELEMENT slash-dot EMPTY>
*/
ScoreLibrary.Score.XMLHelper.prototype.getSlashType = function(node, attributes) {

    attributes = attributes || {};

    var slash_type_node = node.getNode('slash-type');
    if (slash_type_node) {

        attributes.slash_type =
            this.getStartStopValue(
                slash_type_node, undefined, undefined);
    }

    return attributes;
};

ScoreLibrary.Score.XMLHelper.prototype.getDotsValue = function(node, path) {

    var dots = 0;

    node.forEachNode(
        path,
        function() {

            dots += 1;
        });

    return dots;
};

/*
<!--
	The measure-repeat and beat-repeat element specify a
	notation style for repetitions. The actual music being
	repeated needs to be repeated within the MusicXML file.
	These elements specify the notation that indicates the
	repeat.
-->

<!--
	The measure-repeat element is used for both single and
	multiple measure repeats. The text of the element indicates
	the number of measures to be repeated in a single pattern.
	The slashes attribute specifies the number of slashes to
	use in the repeat sign. It is 1 if not specified. Both the
	start and the stop of the measure-repeat must be specified.
-->
<!ELEMENT measure-repeat (#PCDATA)>
<!ATTLIST measure-repeat
    type %start-stop; #REQUIRED
    slashes NMTOKEN #IMPLIED
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getMeasureRepeat = function(node, attributes) {

    attributes = attributes || {};
    attributes.type =
        this.checkRequiredValue(
            node, 'type',
            this.getStartStopValue(node, 'type', undefined));

    attributes.slashes =
        node.getNumberWithDefault('slashes', 1);

    attributes.measures =
        node.getNumberWithDefault(undefined, 2);

    return attributes;
};

/*
<!--
	The beat-repeat element is used to indicate that a single
	beat (but possibly many notes) is repeated. Both the start
	and stop of the beat being repeated should be specified.
	The slashes attribute specifies the number of slashes to
	use in the symbol. The use-dots attribute indicates whether
	or not to use dots as well (for instance, with mixed rhythm
	patterns). By default, the value for slashes is 1 and the
	value for use-dots is no.
-->
<!ELEMENT beat-repeat ((slash-type, slash-dot*)?)>
<!ATTLIST beat-repeat
    type %start-stop; #REQUIRED
    slashes NMTOKEN #IMPLIED
    use-dots %yes-no; #IMPLIED
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getBeatRepeat = function(node, attributes) {

    attributes = attributes || {};
    attributes.type =
        this.checkRequiredValue(
            node, 'type',
            this.getStartStopValue(node, 'type', undefined));

    attributes.slashes =
        node.getNumberWithDefault('slashes', 1);

    attributes.use_dots = this.getYesNoValue(node, 'use-dots', false);

    this.getSlashType(node, attributes);

    attributes.slash_dots =
        this.getDotsValue(node, 'slash-dot');

    return attributes;
};

/*
<!--
	The slash element is used to indicate that slash notation
	is to be used. If the slash is on every beat, use-stems is
	no (the default). To indicate rhythms but not pitches,
	use-stems is set to yes. The type attribute indicates
	whether this is the start or stop of a slash notation
	style. The use-dots attribute works as for the beat-repeat
	element, and only has effect if use-stems is no.
-->
<!ELEMENT slash ((slash-type, slash-dot*)?)>
<!ATTLIST slash
    type %start-stop; #REQUIRED
    use-dots %yes-no; #IMPLIED
    use-stems %yes-no; #IMPLIED
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getSlash = function(node, attributes) {

    attributes = attributes || {};
    attributes.type =
        this.checkRequiredValue(
            node, 'type',
            this.getStartStopValue(node, 'type', undefined));

    attributes.use_dots = this.getYesNoValue(node, 'use-dots', false);
    attributes.use_stems = this.getYesNoValue(node, 'use-stems', false);

    this.getSlashType(node, attributes);

    attributes.slash_dots =
        this.getDotsValue(node, 'slash-dot');

    return attributes;
};

/*
<!--
	The text of the multiple-rest element indicates the number
	of measures in the multiple rest. Multiple rests may use
	the 1-bar / 2-bar / 4-bar rest symbols, or a single shape.
	The use-symbols attribute indicates which to use; it is no
	if not specified.
-->
<!ELEMENT multiple-rest (#PCDATA)>
<!ATTLIST multiple-rest
    use-symbols %yes-no; #IMPLIED
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getMultipleRest = function(node, attributes) {

    attributes = attributes || {};

    attributes.use_symbols =
        this.getYesNoValue(node, 'use-symbols', false);

    attributes.measures =
        node.getNumberWithDefault(undefined, 2);

    return attributes;
};

/*
<!--
	A measure-style indicates a special way to print partial
	to multiple measures within a part. This includes multiple
	rests over several measures, repeats of beats, single, or
	multiple measures, and use of slash notation.

	The multiple-rest and measure-repeat symbols indicate the
	number of measures covered in the element content. The
	beat-repeat and slash elements can cover partial measures.
	All but the multiple-rest element use a type attribute to
	indicate starting and stopping the use of the style. The
	optional number attribute specifies the staff number from
	top to bottom on the system, as with clef.
-->
<!ELEMENT measure-style (multiple-rest |
	measure-repeat | beat-repeat | slash)>
<!ATTLIST measure-style
    number CDATA #IMPLIED
    %font;
    %color;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getMeasureStyle = function(node, attributes) {

    attributes = attributes || {};

    attributes.number = node.getNumberWithDefault('number', 1);

    this.getFont(node, attributes);
    this.getColor(node, attributes);

    var multiple_rest_node = node.getNode('multiple-rest');
    if (multiple_rest_node) {

        attributes.measure_style = 'multiple-rest';

        this.getMultipleRest(multiple_rest_node, attributes);
    }

    var measure_repeat_node = node.getNode('measure-repeat');
    if (measure_repeat_node) {

        attributes.measure_style = 'measure-repeat';

        this.getMeasureRepeat(measure_repeat_node, attributes);
    }

    var beat_repeat_node = node.getNode('beat-repeat');
    if (beat_repeat_node) {

        attributes.measure_style = 'beat-repeat';

        this.getBeatRepeat(beat_repeat_node, attributes);
    }

    var slash_node = node.getNode('slash');
    if (slash_node) {

        attributes.measure_style = 'slash';

        this.getSlash(slash_node, attributes);
    }

    return attributes;
};

/*
<!--
	The attributes element contains musical information that
	typically changes on measure boundaries. This includes
	key and time signatures, clefs, transpositions, and staving.
	When attributes are changed mid-measure, it affects the
	music in score order, not in MusicXML document order.
-->
<!ELEMENT attributes (%editorial;, divisions?, key*, time*,
	staves?, part-symbol?, instruments?, clef*, staff-details*,
	transpose*, directive*, measure-style*)>
<!--
	Musical notation duration is commonly represented as
	fractions. The divisions element indicates how many
	divisions per quarter note are used to indicate a note's
	duration. For example, if duration = 1 and divisions = 2,
	this is an eighth note duration. Duration and divisions
	are used directly for generating sound output, so they
	must be chosen to take tuplets into account. Using a
	divisions element lets us use just one number to
	represent a duration for each note in the score, while
	retaining the full power of a fractional representation.
	For maximum compatibility with Standard MIDI Files, the
	divisions value should not exceed 16383.
-->
<!ELEMENT divisions (#PCDATA)>

<!--
	Staves are used if there is more than one staff
	represented in the given part (e.g., 2 staves for
	typical piano parts). If absent, a value of 1 is assumed.
	Staves are ordered from top to bottom in a part in
	numerical order, with staff 1 above staff 2.
-->
<!ELEMENT staves (#PCDATA)>
*/
ScoreLibrary.Score.XMLHelper.prototype.getScoreAttributes = function(node, attributes) {

    attributes = attributes || {};

    attributes.divisions =
        this.checkRangeOfValue(
            node, 'divisions', 1, 16383,
            node.getNumberWithDefault('divisions', undefined));

    attributes['staves'] = node.getNumberWithDefault('staves', undefined);

    node.forEachNode(
        'measure-style',
        function(index, measure_style_node) {

            attributes.measure_styles =
                attributes.measure_styles || [];

            var measure_style = this.getMeasureStyle(measure_style_node);

            attributes.measure_styles.push(measure_style);
        }, this);

    return attributes;
};
/*
<!--
	Clefs are represented by the sign, line, and
	clef-octave-change elements. Sign values include G, F, C,
	percussion, TAB, jianpu, and none. Line numbers are
	counted from the bottom of the staff. Standard values are
	2 for the G sign (treble clef), 4 for the F sign (bass clef),
	3 for the C sign (alto clef) and 5 for TAB (on a 6-line
	staff). The clef-octave-change element is used for
	transposing clefs (e.g., a treble clef for tenors would
	have a clef-octave-change value of -1). The optional
	number attribute refers to staff numbers within the part,
	from top to bottom on the system. A value of 1 is
	assumed if not present.

	The jianpu sign indicates that the music that follows
	should be in jianpu numbered notation, just as the TAB
	sign indicates that the music that follows should be in
	tablature notation. Unlike TAB, a jianpu sign does not
	correspond to a visual clef notation.

	Sometimes clefs are added to the staff in non-standard
	line positions, either to indicate cue passages, or when
	there are multiple clefs present simultaneously on one
	staff. In this situation, the additional attribute is set to
	"yes" and the line value is ignored. The size attribute
	is used for clefs where the additional attribute is "yes".
	It is typically used to indicate cue clefs.

	Sometimes clefs at the start of a measure need to appear
	after the barline rather than before, as for cues or for
	use after a repeated section. The after-barline attribute
	is set to "yes" in this situation. The attribute is ignored
	for mid-measure clefs.

	Clefs appear at the start of each system unless the
	print-object attribute has been set to "no" or the
	additional attribute has been set to "yes".
-->
<!ELEMENT clef (sign, line?, clef-octave-change?)>
<!ATTLIST clef
    number CDATA #IMPLIED
    additional %yes-no; #IMPLIED
    size %symbol-size; #IMPLIED
    after-barline %yes-no; #IMPLIED
    %print-style;
    %print-object;
>
<!ELEMENT sign (#PCDATA)>
<!ELEMENT line (#PCDATA)>
<!ELEMENT clef-octave-change (#PCDATA)>
*/
ScoreLibrary.Score.XMLHelper.prototype.getClef = function(node, attributes) {

    attributes = attributes || {};

    attributes.number = node.getNumberWithDefault('number', 1);
    attributes.additional = this.getYesNoValue(node, 'additional');
    if (attributes.additional) {

        this.getSymbolSize(node, attributes);
    }

    attributes.after_barline = this.getYesNoValue(node, 'after-barline');

    attributes.print_object = this.isPrintObject(node);
    this.getPrintStyle(node, attributes);

    attributes.sign = this.getAndValidateEnumValue(
        node, 'sign', ['G', 'F', 'C', 'percussion', 'TAB', 'jianpu', 'none'], 'none');

    if (!attributes.additional) {

        var default_line_value = undefined;

        switch (attributes.sign) {
        case 'G': {
            default_line_value = 2;
        } break;
        case 'F': {
            default_line_value = 4;
        } break;
        case 'C': {
            default_line_value = 3;
        } break;
        case 'TAB': {
            default_line_value = 5;
        } break;
        default: {
        } break;
        }

        attributes.line = node.getNumberWithDefault('line', default_line_value);
    }

    attributes.clef_octave_change =
        node.getNumberWithDefault('clef-octave-change', 0);

    return attributes;
};

/*
<!--
	Actual notated accidentals. Valid values include: sharp,
	natural, flat, double-sharp, sharp-sharp, flat-flat,
	natural-sharp, natural-flat, quarter-flat, quarter-sharp,
	three-quarters-flat, three-quarters-sharp, sharp-down,
	sharp-up, natural-down, natural-up, flat-down, flat-up,
	triple-sharp, triple-flat, slash-quarter-sharp,
	slash-sharp, slash-flat, double-slash-flat, sharp-1,
	sharp-2, sharp-3, sharp-5, flat-1, flat-2, flat-3,
	flat-4, sori, and koron.

	The quarter- and three-quarters- accidentals are
	Tartini-style quarter-tone accidentals. The -down and -up
	accidentals are quarter-tone accidentals that include
	arrows pointing down or up. The slash- accidentals
	are used in Turkish classical music. The numbered
	sharp and flat accidentals are superscripted versions
	of the accidental signs, used in Turkish folk music.
	The sori and koron accidentals are microtonal sharp and
	flat accidentals used in Iranian and Persian music.

	Editorial and cautionary indications are indicated
	by attributes. Values for these attributes are "no" if not
	present. Specific graphic display such as parentheses,
	brackets, and size are controlled by the level-display
	entity defined in the common.mod file.
-->
<!ELEMENT accidental (#PCDATA)>
<!ATTLIST accidental
    cautionary %yes-no; #IMPLIED
    editorial %yes-no; #IMPLIED
    %level-display;
    %print-style;
>
*/
ScoreLibrary.Score.XMLHelper.AccidentalTypes =
    ['sharp', 'natural', 'flat', 'double-sharp', 'sharp-sharp', 'double-flat', 'flat-flat', 'natural-sharp', 'natural-flat', 'quarter-flat', 'quarter-sharp', 'three-quarters-flat', 'three-quarters-sharp', 'sharp-down', 'sharp-up', 'natural-down', 'natural-up', 'flat-down', 'flat-up', 'triple-sharp', 'triple-flat', 'slash-quarter-sharp', 'slash-sharp', 'slash-flat', 'double-slash-flat', 'sharp-1', 'sharp-2', 'sharp-3', 'sharp-5', 'flat-1', 'flat-2', 'flat-3', 'flat-4', 'sori', 'koron'];

ScoreLibrary.Score.XMLHelper.prototype.getAccidentalValue = function(node, path, default_value) {

    return this.getAndValidateEnumValue(
        node, path, ScoreLibrary.Score.XMLHelper.AccidentalTypes, default_value);
};

ScoreLibrary.Score.XMLHelper.prototype.getAccidental = function(node, attributes) {

    attributes = attributes || {};

    attributes.accidental = this.getAccidentalValue(node, undefined, undefined);

    attributes.cautionary = this.getYesNoValue(node, 'cautionary', false);
    attributes.editorial = this.getYesNoValue(node, 'editorial', false);

    this.getLevelDisplay(node, attributes);
    this.getPrintStyle(node, attributes);

    return attributes;
};

/*
<!--
	Traditional key signatures are represented by the number
	of flats and sharps, plus an optional mode for major/
	minor/mode distinctions. Negative numbers are used for
	flats and positive numbers for sharps, reflecting the
	key's placement within the circle of fifths (hence the
	element name). A cancel element indicates that the old
	key signature should be cancelled before the new one
	appears. This will always happen when changing to C major
	or A minor and need not be specified then. The cancel
	value matches the fifths value of the cancelled key
	signature (e.g., a cancel of -2 will provide an explicit
	cancellation for changing from B flat major to F major).
	The optional location attribute indicates where a key
	signature cancellation appears relative to a new key
	signature: to the left, to the right, or before the barline
	and to the left. It is left by default. For mid-measure key
	elements, a cancel location of before-barline should be
	treated like a cancel location of left.

	Non-traditional key signatures can be represented using
	the Humdrum/Scot concept of a list of altered tones.
	The key-step and key-alter elements are represented the
	same way as the step and alter elements are in the pitch
	element in the note.mod file. The optional key-accidental
	element is represented the same way as the accidental
	element in the note.mod file. It is used for disambiguating
	microtonal accidentals. The different element names
	indicate the different meaning of altering notes in a scale
	versus altering a sounding pitch.

	Valid mode values include major, minor, dorian, phrygian,
	lydian, mixolydian, aeolian, ionian, locrian, and none.

	The optional number attribute refers to staff numbers,
	from top to bottom on the system. If absent, the key
	signature applies to all staves in the part.

	The optional list of key-octave elements is used to specify
	in which octave each element of the key signature appears.
	The content specifies the octave value using the same
	values as the display-octave element. The number attribute
	is a positive integer that refers to the key signature
	element in left-to-right order. If the cancel attribute is
	set to yes, then this number refers to an element specified
	by the cancel element. It is no by default.

	Key signatures appear at the start of each system unless
	the print-object attribute has been set to "no".
-->
<!ELEMENT key (((cancel?, fifths, mode?) |
	((key-step, key-alter, key-accidental?)*)), key-octave*)>
<!ATTLIST key
    number CDATA #IMPLIED
    %print-style;
    %print-object;
>
<!ELEMENT cancel (#PCDATA)>
<!ATTLIST cancel
    location (left | right | before-barline) #IMPLIED
>
<!ELEMENT fifths (#PCDATA)>
<!ELEMENT mode (#PCDATA)>
<!ELEMENT key-step (#PCDATA)>
<!ELEMENT key-alter (#PCDATA)>
<!ELEMENT key-accidental (#PCDATA)>
<!ELEMENT key-octave (#PCDATA)>
<!ATTLIST key-octave
    number NMTOKEN #REQUIRED
    cancel %yes-no; #IMPLIED
>
*/

ScoreLibrary.Score.XMLHelper.prototype.getCancel = function(node, attributes) {

    attributes = attributes || {};

    attributes.cancel = node.getNumberWithDefault(undefined, undefined);
    if (attributes.cancel) {

        attributes.cancel_location =
            this.getAndValidateEnumValue(
                node, 'location', ['left', 'right', 'before-barline'], 'left');

    }

    return attributes;
};

ScoreLibrary.Score.XMLHelper.prototype.getKeyAccidentals = function(key_node) {

    var accidentals = undefined;

    var accidental_steps = undefined;
    var accidental_alters = undefined;
    var accidental_accidentals = undefined;
    var accidental_octaves = undefined;

    key_node.forEachNode(
        'key-octave',
        function(index, child_node) {

            accidental_octaves = accidental_octaves || {};

            var number =
                this.checkRequiredValue(
                    child_node, 'number',
                    child_node.getNumberWithDefault('number', undefined));

            if (number) {

                accidental_octaves[number] =
                    child_node.getNumberWithDefault(undefined, 4);
            }
        }, this);

    key_node.forEachNode(
        'key-step',
        function(index, child_node) {

            accidental_steps = accidental_steps || [];

            accidental_steps.push(child_node.getString(undefined));
        });

    key_node.forEachNode(
        'key-alter',
        function(index, child_node) {

            accidental_alters = accidental_alters || [];

            accidental_alters.push(child_node.getNumberWithDefault(undefined, 0));
        });

    key_node.forEachNode(
        'key-accidental',
        function(index, child_node) {

            accidental_accidentals = accidental_accidentals || [];

            accidental_accidentals.push(this.getAccidental(child_node));
        }, this);

    goog.asserts.assert(
        accidental_steps !== undefined &&
            accidental_alters !== undefined &&
            accidental_steps.length === accidental_alters.length,
        'ScoreLibrary.Score.XMLHelper.getKeyAccidentals(): unexpect!');

    var stepToOctave = function(step) {

        if (/(C|D|E|F)/.test(step)) {

            return 5;
        }

        return 4;
    };

    accidental_steps.forEach(

        function(step, index, steps) {

            accidentals = accidentals || [];

            var accidental = {};

            accidental.octave =
                (accidental_octaves ?
                 accidental_octaves[index + 1] : stepToOctave(step));

            accidental.step = step;
            accidental.alter = accidental_alters[index];

            if (accidental_accidentals && accidental_accidentals[index]) {

                accidental.accidental = accidental_accidentals[index];
            }

            accidentals.push(accidental);
        });

    return accidentals;
};

ScoreLibrary.Score.XMLHelper.prototype.getKey = function(node, attributes) {

    attributes = attributes || {};

    attributes.number = node.getNumberWithDefault('number', -1); // -1, for all staff.
    attributes.print_object = this.isPrintObject(node);
    this.getPrintStyle(node, attributes);

    var cancel_node = node.getNode('cancel');
    if (cancel_node) {

        this.getCancel(cancel_node, attributes);
    }

    if (node.getBool('fifths')) {

        attributes.fifths = node.getNumberWithDefault('fifths', 0);
        attributes.mode =
            this.getAndValidateEnumValue(
                node, 'mode', [
                    'major', 'minor', 'dorian', 'phrygian',
                    'lydian', 'mixolydian', 'aeolian',
                    'ionian', 'locrian', 'none'], 'major');
    }
    else {

        attributes.accidentals = this.getKeyAccidentals(node);
    }

  return attributes;
};

/*
<!--
	The time-symbol entity indicates how to display a time
	signature. The normal value is the usual fractional display,
	and is the implied symbol type if none is specified. Other
	options are the common and cut time symbols, as well as a
	single number with an implied denominator. The note symbol
	indicates that the beat-type should be represented with
	the corresponding downstem note rather than a number. The
	dotted-note symbol indicates that the beat-type should be
	represented with a dotted downstem note that corresponds to
	three times the beat-type value, and a numerator that is
	one third the beats value.
-->
<!ENTITY % time-symbol
	"symbol (common | cut | single-number |
			 note | dotted-note | normal) #IMPLIED">
*/
ScoreLibrary.Score.XMLHelper.prototype.getTimeSymbol = function(node, attributes) {

    attributes = attributes || {};

    attributes.symbol =
        this.getAndValidateEnumValue(
            node, 'symbol',
            ['common', 'cut', 'single-number', 'note', 'dotted-note', 'normal'],
            'normal');

    return attributes;
};

/*
<!--
	The time-separator entity indicates how to display the
	arrangement between the beats and beat-type values in a
	time signature. The default value is none. The horizontal,
	diagonal, and vertical values represent horizontal, diagonal
	lower-left to upper-right, and vertical lines respectively.
	For these values, the beats and beat-type values are arranged
	on either side of the separator line. The none value represents
	no separator with the beats and beat-type arranged vertically.
	The adjacent value represents no separator with the beats and
	beat-type arranged horizontally.
-->
<!ENTITY % time-separator
	"separator (none | horizontal | diagonal |
		vertical | adjacent) #IMPLIED">
*/
ScoreLibrary.Score.XMLHelper.prototype.getTimeSeparator = function(node, attributes) {

    attributes = attributes || {};

    attributes.separator =
        this.getAndValidateEnumValue(
            node, 'separator',
            ['none', 'horizontal', 'diagonal', 'vertical', 'adjacent'],
            'none');

    return attributes;
};

/*
<!--
	Time signatures are represented by two elements. The
	beats element indicates the number of beats, as found in
	the numerator of a time signature. The beat-type element
	indicates the beat unit, as found in the denominator of
	a time signature.

	Multiple pairs of beats and beat-type elements are used for
	composite time signatures with multiple denominators, such
	as 2/4 + 3/8. A composite such as 3+2/8 requires only one
	beats/beat-type pair.

	The interchangeable element is used to represent the second
	in a pair of interchangeable dual time signatures, such as
	the 6/8 in 3/4 (6/8). A separate symbol attribute value is
	available compared to the time element's symbol attribute,
	which applies to the first of the dual time signatures.
	The time-relation element indicates the symbol used to
	represent the interchangeable aspect of the time signature.
	Valid values are parentheses, bracket, equals, slash, space,
	and hyphen.

	A senza-misura element explicitly indicates that no time
	signature is present. The optional element content
	indicates the symbol to be used, if any, such as an X.
	The time element's symbol attribute is not used when a
	senza-misura element is present.

	The print-object attribute allows a time signature to be
	specified but not printed, as is the case for excerpts
	from the middle of a score. The value is "yes" if
	not present. The optional number attribute refers to staff
	numbers within the part, from top to bottom on the system.
	If absent, the time signature applies to all staves in the
	part.
-->
<!ELEMENT time
	(((beats, beat-type)+, interchangeable?) | senza-misura)>
<!ATTLIST time
    number CDATA #IMPLIED
    %time-symbol;
    %time-separator;
    %print-style-align;
    %print-object;
>
<!ELEMENT interchangeable (time-relation?, (beats, beat-type)+)>
<!ATTLIST interchangeable
    %time-symbol;
    %time-separator;
>
<!ELEMENT beats (#PCDATA)>
<!ELEMENT beat-type (#PCDATA)>
<!ELEMENT senza-misura (#PCDATA)>
<!ELEMENT time-relation (#PCDATA)>
*/
ScoreLibrary.Score.XMLHelper.prototype.getTimeBeatPairs = function(node, attributes) {

    attributes = attributes || {};

    var beats_list = undefined;

    node.forEachNode(
        'beats',
        function(index, child_node) {

            beats_list = beats_list || [];

            beats_list.push(child_node.getString());
        }, this);

    var beat_type_list = undefined;

    node.forEachNode(
        'beat-type',
        function(index, child_node) {

            beat_type_list = beat_type_list || [];

            beat_type_list.push(child_node.getString());
        }, this);

    goog.asserts.assert(beats_list &&
                        beat_type_list &&
                        beats_list.length === beat_type_list.length,
                        'ScoreLibrary.Score.XMLHelper.getTime(): unexpect');

    beats_list.forEach(
        function(child, index, children) {

            attributes.beat_pairs =
                attributes.beat_pairs || [];

            attributes.beat_pairs.push({

                beats: child,
                beat_type: beat_type_list[index]
            });
        });

    return attributes;
};

ScoreLibrary.Score.XMLHelper.prototype.getTimeInterchangeable = function(node, attributes) {

    attributes = attributes || {};

    attributes.time_relation =
        this.getAndValidateEnumValue(
            node, 'time-relation',
            ['parentheses', 'bracket', 'equals', 'slash', 'space', 'hyphen'],
            undefined);

    this.getTimeSymbol(node, attributes);
    this.getTimeSeparator(node, attributes);
    this.getTimeBeatPairs(node, attributes);

    return attributes;
};

ScoreLibrary.Score.XMLHelper.prototype.getTime = function(node, attributes) {

    attributes = attributes || {};

    attributes.number = node.getNumberWithDefault('number', -1);

    this.getTimeSymbol(node, attributes);
    this.getTimeSeparator(node, attributes);
    this.getPrintStyleAlign(node, attributes);

    attributes.print_object = this.isPrintObject(node);

    attributes.senza_misura = node.getBool('senza-misura');

    if (!attributes.senza_misura) {

        this.getTimeBeatPairs(node, attributes);

        var interchangeable_node = node.getNode('interchangeable');
        if (interchangeable_node) {

            attributes.interchangeable =
                this.getTimeInterchangeable(interchangeable_node);
        }
    }

    return attributes;
};

/*
<!--
	The tenths entity is a number representing tenths of
	interline space (positive or negative) for use in
	attributes. The layout-tenths entity is the same for
	use in elements. Both integer and decimal values are
	allowed, such as 5 for a half space and 2.5 for a
	quarter space. Interline space is measured from the
	middle of a staff line.
-->
<!ENTITY % tenths "CDATA">
<!ENTITY % layout-tenths "(#PCDATA)">
*/
ScoreLibrary.Score.XMLHelper.prototype.getTenthsValue = function(node, path, default_value) {

    return node.getNumberWithDefault(path, default_value);
};

/*
<!--
	Margins, page sizes, and distances are all measured in
	tenths to keep MusicXML data in a consistent coordinate
	system as much as possible. The translation to absolute
	units is done in the scaling element, which specifies
	how many millimeters are equal to how many tenths. For
	a staff height of 7 mm, millimeters would be set to 7
	while tenths is set to 40. The ability to set a formula
	rather than a single scaling factor helps avoid roundoff
	errors.
-->
<!ELEMENT scaling (millimeters, tenths)>
<!ELEMENT millimeters (#PCDATA)>
<!ELEMENT tenths %layout-tenths;>
*/
ScoreLibrary.Score.XMLHelper.prototype.getScaling = function(node, attributes) {

    attributes = attributes || {};

    attributes.millimeters =
        node.getNumberWithDefault('millimeters', 7);

    attributes.tenths = this.getTenthsValue(node, 'tenths', 40);

    return attributes;
};

/*
<!--
	Margin elements are included within many of the larger
	layout elements.
-->
<!ELEMENT page-margins (left-margin, right-margin,
	top-margin, bottom-margin)>
<!ATTLIST page-margins
    type (odd | even | both) #IMPLIED
>
<!ELEMENT left-margin %layout-tenths;>
<!ELEMENT right-margin %layout-tenths;>
<!ELEMENT top-margin %layout-tenths;>
<!ELEMENT bottom-margin %layout-tenths;>
*/
ScoreLibrary.Score.XMLHelper.prototype.getPageMargins = function(node, attributes) {

    attributes = attributes || {};

    attributes.type =
        this.getAndValidateEnumValue(
            node, 'type', ['odd', 'even', 'both'], 'both');

    attributes['left-margin'] =
        this.getTenthsValue(node, 'left-margin', 0);
    attributes['right-margin'] =
        this.getTenthsValue(node, 'right-margin', 0);
    attributes['top-margin'] =
        this.getTenthsValue(node, 'top-margin', 0);
    attributes['bottom-margin'] =
        this.getTenthsValue(node, 'bottom-margin', 0);

    return attributes;
};
/*
<!--
	Page layout can be defined both in score-wide defaults
	and in the print element. Page margins are specified either
	for both even and odd pages, or via separate odd and even
	page number values. The type is not needed when used as
	part of a print element. If omitted when used in the
	defaults element, "both" is the default.
-->
<!ELEMENT page-layout ((page-height, page-width)?,
	(page-margins, page-margins?)?)>
<!ELEMENT page-height %layout-tenths;>
<!ELEMENT page-width %layout-tenths;>
*/
ScoreLibrary.Score.XMLHelper.prototype.getPageLayout = function(node, attributes) {

    attributes = attributes || {};

    attributes.page_height =
        this.getTenthsValue(node, 'page-height', 800);

    attributes.page_width =
        this.getTenthsValue(node, 'page-width', 600);

    node.forEachNode(
        'page-margins',
        function(index, page_margin_node) {

            attributes.page_margins =
                attributes.page_margins || {};

            var page_margins =
                this.getPageMargins(page_margin_node);

            attributes.page_margins[
                page_margins.type] = page_margins;

        }, this);

    return attributes;
};

/*
<!--
	A system is a group of staves that are read and played
	simultaneously. System layout includes left and right
	margins, the vertical distance from the previous system,
	and the presence or absence of system dividers.

	Margins are relative to the page margins. Positive values
	indent and negative values reduce the margin size. The
	system distance is measured from the bottom line of the
	previous system to the top line of the current system.
	It is ignored for the first system on a page. The top
	system distance is measured from the page's top margin to
	the top line of the first system. It is ignored for all
	but the first system on a page.

	Sometimes the sum of measure widths in a system may not
	equal the system width specified by the layout elements due
	to roundoff or other errors. The behavior when reading
	MusicXML files in these cases is application-dependent.
	For instance, applications may find that the system layout
	data is more reliable than the sum of the measure widths,
	and adjust the measure widths accordingly.

	When used in the layout element, the system-layout element
	defines a default appearance for all systems in the score.
	When used in the print element, the system layout element
	affects the appearance of the current system only. All
	other systems use the default values provided in the
	defaults element. If any child elements are missing from
	the system-layout element in a print element, the values
	from the defaults element are used there as well.
-->
<!ELEMENT system-layout
	(system-margins?, system-distance?,
	 top-system-distance?, system-dividers?)>
<!ELEMENT system-margins (left-margin, right-margin)>
<!ELEMENT system-distance %layout-tenths;>
<!ELEMENT top-system-distance %layout-tenths;>
*/
ScoreLibrary.Score.XMLHelper.prototype.getSystemMargins = function(node, attributes) {

    attributes = attributes || {};

    attributes['left-margin'] =
        this.getTenthsValue(node, 'left-margin', 0);
    attributes['right-margin'] =
        this.getTenthsValue(node, 'right-margin', 0);

    return attributes;
};

/*
<!--
	The system-dividers element indicates the presence or
	absence of system dividers (also known as system separation
	marks) between systems displayed on the same page. Dividers
	on the left and right side of the page are controlled by
	the left-divider and right-divider elements respectively.
	The default vertical position is half the system-distance
	value from the top of the system that is below the divider.
	The default horizontal position is the left and right
	system margin, respectively.

	When used in the print element, the system-dividers element
	affects the dividers that would appear between the current
	system and the previous system.
-->
<!ELEMENT system-dividers (left-divider, right-divider)>
<!ELEMENT left-divider EMPTY>
<!ATTLIST left-divider
    %print-object;
    %print-style-align;
>
<!ELEMENT right-divider EMPTY>
<!ATTLIST right-divider
    %print-object;
    %print-style-align;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getSystemDividers = function(node, attributes) {

    //TODO:
    attributes = attributes || {};

    return attributes;
};

ScoreLibrary.Score.XMLHelper.prototype.getSystemLayout = function(node, attributes) {

    attributes = attributes || {};

    var system_margins_node = node.getNode('system-margins');
    if (system_margins_node) {

        attributes.system_margins = this.getSystemMargins(system_margins_node);
    }

    attributes.system_distance =
        this.getTenthsValue(node, 'system-distance', 0);

    attributes.top_system_distance =
        this.getTenthsValue(node, 'top-system-distance', 0);

    this.getSystemDividers(node, attributes);

    return attributes;
};

/*
<!--
	Collect score-wide defaults. This includes scaling
	and layout, defined in layout.mod, and default values
	for the music font, word font, lyric font, and
	lyric language. The number and name attributes in
	lyric-font and lyric-language elements are typically
	used when lyrics are provided in multiple languages.
	If the number and name attributes are omitted, the
	lyric-font and lyric-language values apply to all
	numbers and names.
-->
<!ELEMENT defaults (scaling?, page-layout?,
	system-layout?, staff-layout*, appearance?,
	music-font?, word-font?, lyric-font*, lyric-language*)>

<!ELEMENT music-font EMPTY>
<!ATTLIST music-font
    %font;
>
<!ELEMENT word-font EMPTY>
<!ATTLIST word-font
    %font;
>
<!ELEMENT lyric-font EMPTY>
<!ATTLIST lyric-font
    number NMTOKEN #IMPLIED
    name CDATA #IMPLIED
    %font;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getScoreDefaults = function(node, attributes) {

    attributes = attributes || {};

    var scaling_node = node.getNode('scaling');
    if (scaling_node) {

        attributes.scaling = this.getScaling(scaling_node);
    }

    var page_layout_node = node.getNode('page-layout');
    if (page_layout_node) {

        attributes.page_layout = this.getPageLayout(page_layout_node);
    }

    var system_layout_node = node.getNode('system-layout');
    if (system_layout_node) {

        attributes.system_layout = this.getSystemLayout(system_layout_node);
    }

    var music_font_node = node.getNode('music-font');
    if (music_font_node) {

        attributes.music_font =
            this.getFont(music_font_node);
    }

    var word_font_node = node.getNode('word-font');
    if (word_font_node) {

        attributes.word_font =
            this.getFont(word_font_node);
    }

    node.forEachNode(
        'lyric-font',
        function(index, lyric_font_node) {

            attributes.lyric_fonts =
                attributes.lyric_fonts || [];

            var lyric_font = {};

            lyric_font.number =
                lyric_font_node.getNumberWithDefault(
                    'number', undefined);
            lyric_font.name =
                lyric_font_node.getStringWithDefault(
                    'name', undefined);

            this.getFont(lyric_font_node, lyric_font);

            attributes.lyric_fonts.push(lyric_font);
        }, this);

    return attributes;
};

/*
<!--
	Credit elements refer to the title, composer, arranger,
	lyricist, copyright, dedication, and other text that usually
	appears on the first page of a score. The credit-words
	and credit-image elements are similar to the words and
	image elements for directions. However, since the
	credit is not part of a measure, the default-x and
	default-y attributes adjust the origin relative to the
	bottom left-hand corner of the first page. The
	enclosure for credit-words is none by default.

	By default, a series of credit-words elements within a
	single credit element follow one another in sequence
	visually. Non-positional formatting attributes are carried
	over from the previous element by default.

	The page attribute for the credit element, new in Version
	2.0, specifies the page number where the credit should
	appear. This is an integer value that starts with 1 for the
	first page. Its value is 1 by default. Since credits occur
	before the music, these page numbers do not refer to the
	page numbering specified by the print element's page-number
	attribute.

	The credit-type element, new in Version 3.0, indicates the
	purpose behind a credit. Multiple types of data may be
	combined in a single credit, so multiple elements may be
	used. Standard values include page number, title, subtitle,
	composer, arranger, lyricist, and rights.
-->
<!ELEMENT credit
	(credit-type*, link*, bookmark*,
	(credit-image |
	 (credit-words, (link*, bookmark*, credit-words)*)))>
<!ATTLIST credit
    page NMTOKEN #IMPLIED
>
<!ELEMENT credit-type (#PCDATA)>
<!ELEMENT credit-words (#PCDATA)>
<!ATTLIST credit-words
    %text-formatting;
>
<!ELEMENT credit-image EMPTY>
<!ATTLIST credit-image
    source CDATA #REQUIRED
    type CDATA #REQUIRED
    %position;
    %halign;
    %valign-image;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getScoreCredit = function(node, attributes) {

    attributes = attributes || {};

    node.forEachNode(
            'credit-image,credit-words',
            function(index, credit_info_node) {

                var credit_info = {};

                var credit_attrs_node =
                    credit_info_node.getPrevUntil('credit');

                if (credit_attrs_node) {

                    credit_attrs_node.forEachNode(
                        undefined,
                        function(index, credit_attr_node) {

                            if (credit_attr_node.is('credit-type')) {

                                credit_info.credit_types = credit_info.credit_types || '';

                                var credit_type =
                                    this.getAndValidateEnumValue(
                                        credit_attr_node, undefined, [
                                            'page number', 'title', 'subtitle',
	                                    'composer', 'arranger', 'lyricist', 'rights'
                                        ], '');

                                if (credit_type) {

                                    credit_info.credit_types += credit_type;
                                    credit_info.credit_types += '|';
                                }
                            }
                            else if (credit_attr_node.is('link')) {
                                // TODO: support link
                            }
                            else if (credit_attr_node.is('bookmark')) {
                                // TODO: support bookmark
                            }
                        }, this);
                }

                if (credit_info_node.is('credit-words')) {

                    credit_info.is_words = true;
                    this.getTextFormating(credit_info_node, credit_info);
                }
                else if (credit_info_node.is('credit-image')) {
                    // TODO: support image
                    credit_info.is_image = true;
                    return;
                }

                attributes.credits = attributes.credits || [];
                attributes.credits.push(credit_info);
            }, this);

    attributes.page = node.getNumberWithDefault('page', 1);

    return attributes;
};

/*
<!--
	If a barline is other than a normal single barline, it
	should be represented by a barline element that describes
	it. This includes information about repeats and multiple
	endings, as well as line style. Barline data is on the same
	level as the other musical data in a score - a child of a
	measure in a partwise score, or a part in a timewise score.
	This allows for barlines within measures, as in dotted
	barlines that subdivide measures in complex meters. The two
	fermata elements allow for fermatas on both sides of the
	barline (the lower one inverted).

	Barlines have a location attribute to make it easier to
	process barlines independently of the other musical data
	in a score. It is often easier to set up measures
	separately from entering notes. The location attribute
	must match where the barline element occurs within the
	rest of the musical data in the score. If location is left,
	it should be the first element in the measure, aside from
	the print, bookmark, and link elements. If location is
	right, it should be the last element, again with the
	possible exception of the print, bookmark, and link
	elements. If no location is specified, the right barline
	is the default. The segno, coda, and divisions attributes
	work the same way as in the sound element defined in the
	direction.mod file. They are used for playback when barline
	elements contain segno or coda child elements.
-->

<!-- Elements -->

<!ELEMENT barline (bar-style?, %editorial;, wavy-line?,
	segno?, coda?, (fermata, fermata?)?, ending?, repeat?)>
<!ATTLIST barline
    location (right | left | middle) "right"
    segno CDATA #IMPLIED
    coda CDATA #IMPLIED
    divisions CDATA #IMPLIED
>

<!--
	Bar-style contains style information. Choices are
	regular, dotted, dashed, heavy, light-light,
	light-heavy, heavy-light, heavy-heavy, tick (a
	short stroke through the top line), short (a partial
	barline between the 2nd and 4th lines), and none.
-->
<!ELEMENT bar-style (#PCDATA)>
<!ATTLIST bar-style
    %color;
>

<!--
	The editorial entity and the wavy-line, segno, and fermata
	elements are defined in the common.mod file. They can
	apply to both notes and barlines.
-->
*/
ScoreLibrary.Score.XMLHelper.prototype.getBarStyle = function(node, attributes) {

    attributes = attributes || {};

    attributes.bar_style =
        this.getAndValidateEnumValue(
            node, 'bar-style',
            ['regular', 'dotted', 'dashed', 'heavy', 'light-light', 'light-heavy',
             'heavy-light', 'heavy-heavy', 'tick', 'short', 'none'], 'regular');

    this.getColor(node, attributes);

    return attributes;
};

/*
<!--
	Repeat marks. The start of the repeat has a forward direction
	while the end of the repeat has a backward direction. Backward
	repeats that are not part of an ending can use the times
	attribute to indicate the number of times the repeated section
	is played. The winged attribute indicates whether the repeat
	has winged extensions that appear above and below the barline.
	The straight and curved values represent single wings, while
	the double-straight and double-curved values represent double
	wings. The none value indicates no wings and is the default.
-->
<!ELEMENT repeat EMPTY>
<!ATTLIST repeat
    direction (backward | forward) #REQUIRED
    times CDATA #IMPLIED
    winged (none | straight | curved |
		double-straight | double-curved) #IMPLIED
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getRepeat = function(node, attributes) {

    attributes = attributes || {};

    attributes.direction =
        this.checkRequiredValue(
            node, 'direction',
            this.getAndValidateEnumValue(
                node, 'direction',
                ['backward', 'forward'], undefined));

    // TODO: times.
    attributes.times =
        node.getNumberWithDefault('times', 0);

    attributes.winged =
        this.getAndValidateEnumValue(
            node, 'winged', [
                'none', 'straight', 'curved', 'double-straight', 'double-curved'
            ], 'none');

    return attributes;
};

/*
<!--
	Endings refers to multiple (e.g. first and second) endings.
	Typically, the start type is associated with the left
	barline of the first measure in an ending. The stop and
	discontinue types are associated with the right barline of
	the last measure in an ending. Stop is used when the ending
	mark concludes with a downward jog, as is typical for first
	endings. Discontinue is used when there is no downward jog,
	as is typical for second endings that do not conclude a
	piece. The length of the jog can be specified using the
	end-length attribute. The text-x and text-y attributes
	are offsets that specify where the baseline of the start
	of the ending text appears, relative to the start of the
	ending line.

	The number attribute reflects the numeric values of what
	is under the ending line. Single endings such as "1" or
	comma-separated multiple endings such as "1, 2" may be
	used. The ending element text is used when the text
	displayed in the ending is different than what appears in
	the number attribute. The print-object element is used to
	indicate when an ending is present but not printed, as is
	often the case for many parts in a full score.
-->
<!ELEMENT ending (#PCDATA)>
<!ATTLIST ending
    number CDATA #REQUIRED
    type (start | stop | discontinue) #REQUIRED
    %print-object;
    %print-style;
    end-length %tenths; #IMPLIED
    text-x %tenths; #IMPLIED
    text-y %tenths; #IMPLIED
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getEnding = function(node, attributes) {

    attributes = attributes || {};

    attributes.numbers =
        this.checkRequiredValue(
            node, 'number',
            node.getStringWithDefault('number', undefined));

    attributes.text =
        node.getStringWithDefault(undefined, '');

    attributes.type =
        this.checkRequiredValue(
            node, 'type',
            this.getAndValidateEnumValue(
                node, 'type', ['start', 'stop', 'discontinue'], undefined));

    attributes.print_object =
        this.isPrintObject(node);
    this.getPrintStyle(node, attributes);
    attributes.end_length =
        this.getTenthsValue(node, 'end-length', 10);
    attributes.text_x =
        this.getTenthsValue(node, 'text-x', 5);
    attributes.text_y =
        this.getTenthsValue(node, 'text-y', 5);

    return attributes;
};

ScoreLibrary.Score.XMLHelper.prototype.getBarline = function(node, attributes) {

    attributes = attributes || {};

    attributes.location =
        this.getAndValidateEnumValue(
            node, 'location', ['right', 'left', 'middle'], 'right');

    this.getBarStyle(node, attributes);

    var repeat_node = node.getNode('repeat');
    if (repeat_node) {

        attributes['repeat'] =
            this.getRepeat(repeat_node);
    }

    var ending_node = node.getNode('ending');
    if (ending_node) {

        attributes['ending'] =
            this.getEnding(ending_node);
    }

    var wavyline_node = node.getNode('wavy-line');
    if (wavyline_node) {

        attributes['wavy-line'] =
            this.getWavyLine(wavyline_node);
    }

    var segno_node = node.getNode('segno');
    if (segno_node) {

        attributes['segno'] =
            this.getSegno(segno_node);
    }

    var coda_node = node.getNode('coda');
    if (coda_node) {

        attributes['coda'] =
            this.getSegno(coda_node);
    }

    node.forEachNode(
        'fermata',
        function(index, fermata_node) {

            attributes['fermata'] =
                attributes['fermata'] || [];

            attributes['fermata'].push(this.getFermata(fermata_node));

        }, this);

    return attributes;
};

/*
<!--
	Beam types include begin, continue, end, forward hook, and
	backward hook. Up to eight concurrent beams are available to
	cover up to 1024th notes, using an enumerated type defined
	in the common.mod file. Each beam in a note is represented
	with a separate beam element, starting with the eighth note
	beam using a number attribute of 1.

	Note that the beam number does not distinguish sets of
	beams that overlap, as it does for slur and other elements.
	Beaming groups are distinguished by being in different
	voices and/or the presence or absence of grace and cue
	elements.

	Beams that have a begin value can also have a fan attribute to
	indicate accelerandos and ritardandos using fanned beams. The
	fan attribute may also be used with a continue value if the
	fanning direction changes on that note. The value is "none"
	if not specified.

	The repeater attribute has been deprecated in MusicXML 3.0.
	Formerly used for tremolos, it needs to be specified with a
	"yes" value for each beam using it.
-->
<!ELEMENT beam (#PCDATA)>
<!ATTLIST beam
    number %beam-level; "1"
    repeater %yes-no; #IMPLIED
    fan (accel | rit | none) #IMPLIED
    %color;
>
<!--
	The MusicXML format supports eight levels of beaming, up
	to 1024th notes. Unlike the number-level attribute, the
	beam-level attribute identifies concurrent beams in a beam
	group. It does not distinguish overlapping beams such as
	grace notes within regular notes, or beams used in different
	voices.
-->
<!ENTITY % beam-level "(1 | 2 | 3 | 4 | 5 | 6 | 7 | 8)">
*/
ScoreLibrary.Score.XMLHelper.prototype.getBeamLevelValue = function(node, path) {

    return this.checkRangeOfValue(
        node, path, 1, 8,
        node.getNumberWithDefault(path, 1));
};

ScoreLibrary.Score.XMLHelper.prototype.getBeam = function(node, attributes) {

    attributes = attributes || {};

    attributes.type =
        this.checkRequiredValue(
            node, 'type',
        this.getAndValidateEnumValue(
            node, undefined,
            ['begin', 'continue', 'end', 'forward hook', 'backward hook'],
            undefined));

    attributes.number = this.getBeamLevelValue(node, 'number');

    // !IGNORE: repeater %yes-no; #IMPLIED
    if (attributes.type === 'begin' ||
        attributes.type === 'continue') {

        attributes.fan =
            this.getAndValidateEnumValue(
                node, 'fan', ['accel', 'rit'], 'none');
    }

    this.getColor(node, attributes);

    return attributes;
};

/*
<!--
	Slurs, tuplets, and many other features can be
	concurrent and overlapping within a single musical
	part. The number-level attribute distinguishes up to
	six concurrent objects of the same type. A reading
	program should be prepared to handle cases where
	the number-levels stop in an arbitrary order.
	Different numbers are needed when the features
	overlap in MusicXML document order. When a number-level
	value is implied, the value is 1 by default.
-->
<!ENTITY % number-level "(1 | 2 | 3 | 4 | 5 | 6)">
*/
ScoreLibrary.Score.XMLHelper.prototype.getNumberLevelValue = function(node, path) {

    return this.checkRangeOfValue(
        node, path, 1, 6,
        node.getNumberWithDefault(path, 1));
};

/*
<!--
	The line-shape entity is used to distinguish between
	straight and curved lines. The line-type entity
	distinguishes between solid, dashed, dotted, and
	wavy lines.
-->
<!ENTITY % line-shape
	"line-shape (straight | curved) #IMPLIED">

<!ENTITY % line-type
	"line-type (solid | dashed | dotted | wavy) #IMPLIED">

<!--
	The dashed-formatting entity represents the length of
	dashes and spaces in a dashed line. Both the dash-length
	and space-length attributes are represented in tenths.
	These attributes are ignored if the corresponding
	line-type attribute is not dashed.
-->
*/

/*
<!--
	The placement attribute indicates whether something is
	above or below another element, such as a note or a
	notation.
-->
<!ENTITY % placement
	"placement %above-below; #IMPLIED">
*/
ScoreLibrary.Score.XMLHelper.prototype.getPlacement = function(node, attributes, default_value) {

    var attributes = attributes || {};

    attributes.placement =
        this.getAboveBelowValue(node, 'placement', default_value);

    return attributes;
};

/*
<!--
	The orientation attribute indicates whether slurs and
	ties are overhand (tips down) or underhand (tips up).
	This is distinct from the placement entity used by any
	notation type.
-->
<!ENTITY % orientation
	"orientation (over | under) #IMPLIED">
*/
ScoreLibrary.Score.XMLHelper.prototype.getOrientation = function(node, attributes) {

    var attributes = attributes || {};

    attributes.orientation =
        this.getAndValidateEnumValue(
            node, 'orientation',
            ['over', 'under'], undefined);

    return attributes;
};

/*
<!ENTITY % dashed-formatting
	"dash-length   %tenths;  #IMPLIED
	 space-length  %tenths;  #IMPLIED">

/*
<!--
	The tied element represents the notated tie. The tie element
	represents the tie sound.

	The number attribute is rarely needed to disambiguate ties,
	since note pitches will usually suffice. The attribute is
	implied rather than defaulting to 1 as with most elements.
	It is available for use in more complex tied notation
	situations.
-->
<!ELEMENT tied EMPTY>
<!ATTLIST tied
    type %start-stop-continue; #REQUIRED
    number %number-level; #IMPLIED
    %line-type;
    %dashed-formatting;
    %position;
    %placement;
    %orientation;
    %bezier;
    %color;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getTied = function(node, attributes) {

    var attributes = attributes || {};

    attributes.type =
        this.checkRequiredValue(
            node, 'type',
            this.getStartStopContinueValue(
                node, 'type', undefined));

    attributes.number =
        this.getNumberLevelValue(node, 'number');

    //!IGNORE: %line-type;
    //!IGNORE: %dashed-formatting;
    //!IGNORE: %position;
    this.getPlacement(node, attributes);
    this.getOrientation(node, attributes);
    //!IGNORE: %bezier;
    //!IGNORE: %color;

    return attributes;
};

/*
<!--
	Slur elements are empty. Most slurs are represented with
	two elements: one with a start type, and one with a stop
	type. Slurs can add more elements using a continue type.
	This is typically used to specify the formatting of cross-
	system slurs, or to specify the shape of very complex slurs.
-->
<!ELEMENT slur EMPTY>
<!ATTLIST slur
    type %start-stop-continue; #REQUIRED
    number %number-level; "1"
    %line-type;
    %dashed-formatting;
    %position;
    %placement;
    %orientation;
    %bezier;
    %color;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getSlur = function(node, attributes) {

    var attributes = attributes || {};

    attributes.type =
        this.checkRequiredValue(
            node, 'type',
            this.getStartStopContinueValue(
                node, 'type', undefined));

    attributes.number =
        this.getNumberLevelValue(node, 'number');

    //!IGNORE: %line-type;
    //!IGNORE: %dashed-formatting;
    //!IGNORE: %position;
    this.getPlacement(node, attributes);
    this.getOrientation(node, attributes);
    //!IGNORE: %bezier;
    //!IGNORE: %color;

    return attributes;
};

/*
<!--
	A tuplet element is present when a tuplet is to be displayed
	graphically, in addition to the sound data provided by the
	time-modification elements. The number attribute is used to
	distinguish nested tuplets. The bracket attribute is used
	to indicate the presence of a bracket. If unspecified, the
	results are implementation-dependent. The line-shape
	attribute is used to specify whether the bracket is straight
	or in the older curved or slurred style. It is straight by
	default.

	Whereas a time-modification element shows how the cumulative,
	sounding effect of tuplets and double-note tremolos compare to
	the written note type, the tuplet element describes how this
	is displayed. The tuplet element also provides more detailed
	representation information than the time-modification element,
	and is needed to represent nested tuplets and other complex
	tuplets accurately. The tuplet-actual and tuplet-normal
	elements provide optional full control over tuplet
	specifications. Each allows the number and note type
	(including dots) describing a single tuplet. If any of
	these elements are absent, their values are based on the
	time-modification element.

	The show-number attribute is used to display either the
	number of actual notes, the number of both actual and
	normal notes, or neither. It is actual by default. The
	show-type attribute is used to display either the actual
	type, both the actual and normal types, or neither. It is
	none by default.
-->
<!ELEMENT tuplet (tuplet-actual?, tuplet-normal?)>
<!ATTLIST tuplet
    type %start-stop; #REQUIRED
    number %number-level; #IMPLIED
    bracket %yes-no; #IMPLIED
    show-number (actual | both | none) #IMPLIED
    show-type (actual | both | none) #IMPLIED
    %line-shape;
    %position;
    %placement;
>
<!ELEMENT tuplet-actual (tuplet-number?,
	tuplet-type?, tuplet-dot*)>
<!ELEMENT tuplet-normal (tuplet-number?,
	tuplet-type?, tuplet-dot*)>
<!ELEMENT tuplet-number (#PCDATA)>
<!ATTLIST tuplet-number
    %font;
    %color;
>
<!ELEMENT tuplet-type (#PCDATA)>
<!ATTLIST tuplet-type
    %font;
    %color;
>
<!ELEMENT tuplet-dot EMPTY>
<!ATTLIST tuplet-dot
    %font;
    %color;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getTupletShowSwitcher = function(node, path, default_value) {

    return this.getAndValidateEnumValue(
        node, path,
        ['actual', 'both', 'none'], default_value);
};

ScoreLibrary.Score.XMLHelper.prototype.getTupletShow = function(node, attributes) {

    var attributes = attributes || {};

    attributes.tuplet_number =
        node.getNumberWithDefault('tuplet-number', attributes.tuplet_number);

    attributes.tuplet_type =
        this.getNoteTypeValue(node, 'tuplet-type', attributes.tuplet_type);

    var tuplet_dots = this.getDotsValue(node, 'tuplet-dot');

    attributes.tuplet_dots =
        tuplet_dots ?
        tuplet_dots : attributes.tuplet_dots;

    return attributes;
};

ScoreLibrary.Score.XMLHelper.prototype.getTuplet = function(node, attributes, note_attributes) {

    var attributes = attributes || {};

    attributes.type =
        this.checkRequiredValue(
            node, 'type',
            this.getStartStopValue(
                node, 'type', undefined));

    attributes.number =
        this.getNumberLevelValue(node, 'number');
    attributes.bracket =
        this.getYesNoValue(node, 'bracket', true);

    attributes.show_number =
        this.getTupletShowSwitcher(
            node, 'show-number', 'actual');

    attributes.show_type =
        this.getTupletShowSwitcher(
            node, 'show-type', 'none');

    //!IGNORE: %line-shape
    //!IGNORE: %position;
    this.getPlacement(node, attributes);

    var time_modification =
        (note_attributes ?
         note_attributes.time_modification : undefined);

    if (time_modification) {

        attributes.tuplet_actual = {

            tuplet_number: time_modification.actual_notes,
            tuplet_type: time_modification.normal_type,
            tuplet_dots: time_modification.normal_dots
        };
    }

    var tuplet_actual_node = node.getNode('tuplet-actual');
    if (tuplet_actual_node) {

        attributes.tuplet_actual =
            this.getTupletShow(tuplet_actual_node, attributes.tuplet_actual);
    }

    if (time_modification) {

        attributes.tuplet_normal = {

            tuplet_number: time_modification.normal_notes,
            tuplet_type: time_modification.normal_type,
            tuplet_dots: time_modification.normal_dots
        };
    }

    var tuplet_normal_node = node.getNode('tuplet-normal');
    if (tuplet_normal_node) {

        attributes.tuplet_normal =
            this.getTupletShow(tuplet_normal_node, attributes.tuplet_normal);
    }

    return attributes;
};

/*
<!--
	The tremolo ornament can be used to indicate either
	single-note or double-note tremolos. Single-note tremolos
	use the single type, while double-note tremolos use the
	start and stop types. The default is "single" for
	compatibility with Version 1.1. The text of the element
	indicates the number of tremolo marks and is an integer
	from 0 to 8. Note that the number of attached beams is
	not included in this value, but is represented separately
	using the beam element.

	When using double-note tremolos, the duration of each note
	in the tremolo should correspond to half of the notated type
	value. A time-modification element should also be added with
	an actual-notes value of 2 and a normal-notes value of 1. If
	used within a tuplet, this 2/1 ratio should be multiplied by
	the existing tuplet ratio.

	Using repeater beams for indicating tremolos is deprecated as
	of MusicXML 3.0.
-->
<!ELEMENT tremolo (#PCDATA)>
<!ATTLIST tremolo
    type %start-stop-single; "single"
    %print-style;
    %placement;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getTremolo = function(node, attributes) {

    var attributes = attributes || {};

    attributes.type =
        this.getStartStopSingleValue(node, 'type', 'single');
    attributes.number =
        node.getNumberWithDefault(undefined, 0);

    this.getPrintStyle(node, attributes);
    this.getPlacement(node, attributes);

    return attributes;
};

/*
<!ELEMENT trill-mark EMPTY>
<!ATTLIST trill-mark
    %print-style;
    %placement;
    %trill-sound;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getTrillMark = function(node, attributes) {

    var attributes = attributes || {};

    this.getPrintStyle(node, attributes);
    this.getPlacement(node, attributes, 'above');
    this.getTrillSound(node, attributes);

    return attributes;
};

/*
<!--
	The turn and delayed-turn elements are the normal turn
	shape which goes up then down. The inverted-turn and
	delayed-inverted-turn elements have the shape which goes
	down and then up. The delayed-turn and delayed-inverted-turn
	elements indicate turns that are delayed until the end of the
	current note. The vertical-turn element has the shape
	arranged vertically going from upper left to lower right.
	If the slash attribute is yes, then a vertical line is used
	to slash the turn; it is no by default.
-->
<!ELEMENT turn EMPTY>
<!ATTLIST turn
    %print-style;
    %placement;
    %trill-sound;
    slash %yes-no; #IMPLIED
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getTurn = function(node, attributes) {

    var attributes = attributes || {};

    this.getPrintStyle(node, attributes);
    this.getPlacement(node, attributes, 'above');
    this.getTrillSound(node, attributes);

    attributes.slash =
        this.getYesNoValue(node, 'slash', false);

    return attributes;
};

/*
<!ELEMENT delayed-turn EMPTY>
<!ATTLIST delayed-turn
    %print-style;
    %placement;
    %trill-sound;
    slash %yes-no; #IMPLIED
>
*/

ScoreLibrary.Score.XMLHelper.prototype.getDelayedTurn =
    ScoreLibrary.Score.XMLHelper.prototype.getTurn;
/*
<!ELEMENT inverted-turn EMPTY>
<!ATTLIST inverted-turn
    %print-style;
    %placement;
    %trill-sound;
    slash %yes-no; #IMPLIED
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getInvertedTurn =
    ScoreLibrary.Score.XMLHelper.prototype.getTurn;

/*
<!ELEMENT delayed-inverted-turn EMPTY>
<!ATTLIST delayed-inverted-turn
    %print-style;
    %placement;
    %trill-sound;
    slash %yes-no; #IMPLIED
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getDelayedInvertedTurn =
    ScoreLibrary.Score.XMLHelper.prototype.getTurn;

/*
<!ELEMENT vertical-turn EMPTY>
<!ATTLIST vertical-turn
    %print-style;
    %placement;
    %trill-sound;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getVerticalTurn = function(node, attributes) {

    var attributes = attributes || {};

    this.getPrintStyle(node, attributes);
    this.getPlacement(node, attributes, 'above');
    this.getTrillSound(node, attributes);

    return attributes;
};

/*
<!ELEMENT shake EMPTY>
<!ATTLIST shake
    %print-style;
    %placement;
    %trill-sound;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getShake =
    ScoreLibrary.Score.XMLHelper.prototype.getVerticalTurn;

/*
<!ELEMENT wavy-line EMPTY>
<!ATTLIST wavy-line
    type %start-stop-continue; #REQUIRED
    number %number-level; #IMPLIED
    %position;
    %placement;
    %color;
    %trill-sound;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getWavyLine = function(node, attributes) {

    var attributes = attributes || {};

    attributes.type =
        this.getStartStopContinueValue(node, 'type', 'start');
    attributes.number =
        this.getNumberLevelValue(node, 'number');
    this.getPosition(node, attributes);
    this.getPlacement(node, attributes, 'above');
    this.getColor(node, attributes);
    this.getTrillSound(node, attributes);

    return attributes;
};

/*
<!--
	The long attribute for the mordent and inverted-mordent
	elements is "no" by default. The mordent element represents
	the sign with the vertical line; the inverted-mordent
	element represents the sign without the vertical line.
	The approach and departure attributes are used for compound
	ornaments, indicating how the beginning and ending of the
	ornament look relative to the main part of the mordent.
-->
<!ELEMENT mordent EMPTY>
<!ATTLIST mordent
    long %yes-no; #IMPLIED
    approach %above-below; #IMPLIED
    departure %above-below; #IMPLIED
    %print-style;
    %placement;
    %trill-sound;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getMordent = function(node, attributes) {

    var attributes = attributes || {};

    attributes.long_mordent =
        this.getYesNoValue(node, 'long', false);

    if (attributes.long_mordent) {

        attributes.approach =
            this.getAboveBelowValue(node, 'approach', undefined);
        attributes.departure =
            this.getAboveBelowValue(node, 'departure', undefined);
    }

    this.getPrintStyle(node, attributes);
    this.getPlacement(node, attributes, 'above');
    this.getTrillSound(node, attributes);

    return attributes;
};

/*
<!ELEMENT inverted-mordent EMPTY>
<!ATTLIST inverted-mordent
    long %yes-no; #IMPLIED
    approach %above-below; #IMPLIED
    departure %above-below; #IMPLIED
    %print-style;
    %placement;
    %trill-sound;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getInvertedMordent =
    ScoreLibrary.Score.XMLHelper.prototype.getMordent;

/*
<!--
	The name for this ornament is based on the German,
	to avoid confusion with the more common slide element
	defined earlier.
-->
<!ELEMENT schleifer EMPTY>
<!ATTLIST schleifer
    %print-style;
    %placement;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getSchleifer = function(node, attributes) {

    var attributes = attributes || {};

    this.getPrintStyle(node, attributes);
    this.getPlacement(node, attributes, 'above');

    return attributes;
};

ScoreLibrary.Score.XMLHelper.prototype._getMixTypesChildren = function(node, attributes,
                                                             type_field, child_type_field,
                                                             types_getters, types_filter) {

    var attributes = attributes || {};

    node.forEachNode(
        types_filter,
        function(index, child_node) {

            var child_attributes = undefined;

            var type = child_node.getNodeName();

            var getter = types_getters[type];
            if (getter) {

                child_attributes = getter.call(
                    this, child_node, undefined, attributes);

                child_attributes[child_type_field] = type;
            }

            if (child_attributes) {

                attributes[type_field] =
                    attributes[type_field] || [];

                attributes[type_field].push(child_attributes);
            }
        }, this);

    return attributes;
};

/*
<!--
	Ornaments can be any of several types, followed optionally
	by accidentals. The accidental-mark element's content is
	represented the same as an accidental element, but with a
	different name to reflect the different musical meaning.
-->
<!ELEMENT ornaments
	(((trill-mark | turn | delayed-turn | inverted-turn |
	   delayed-inverted-turn | vertical-turn | shake |
	   wavy-line | mordent | inverted-mordent | schleifer |
	   tremolo | other-ornament), accidental-mark*)*)>
*/
ScoreLibrary.Score.XMLHelper.prototype.getOrnamentTypes = function() {

    var ornament_types = ScoreLibrary.Score.XMLHelper.OrnamentTypes;
    if (ornament_types === undefined) {

        ornament_types = {

            'tremolo': this.getTremolo,
            'trill-mark': this.getTrillMark,
            'turn': this.getTurn,
            'delayed-turn': this.getDelayedTurn,
            'inverted-turn': this.getInvertedTurn,
            'delayed-inverted-turn': this.getDelayedInvertedTurn,
            'vertical-turn': this.getVerticalTurn,
            'wavy-line': this.getWavyLine,
            'shake': this.getShake,
            'mordent': this.getMordent,
            'inverted-mordent': this.getInvertedMordent,
            'schleifer': this.getSchleifer,
            'accidental-mark': this.getAccidentalMark,
            'other-ornament': null
        };

        ScoreLibrary.Score.XMLHelper.OrnamentTypes = ornament_types;
    }

    return ornament_types;
};

ScoreLibrary.Score.XMLHelper.prototype.getOrnaments = function(node, attributes) {

    var attributes = attributes || {};

    var ornament_types = this.getOrnamentTypes();

    var ornament_types_filter =
        ScoreLibrary.Score.XMLHelper.OrnamentTypesFilter;

    if (ornament_types_filter === undefined) {

        ornament_types_filter = ScoreLibrary.keys(ornament_types).join(',');

        ScoreLibrary.Score.XMLHelper.OrnamentTypesFilter = ornament_types_filter;
    }

    return this._getMixTypesChildren(
        node, attributes,
        'ornaments', 'ornament',
        ornament_types,
        ornament_types_filter);
};

/*
<!--
	Fermata and wavy-line elements can be applied both to
	notes and to measures, so they are defined here. Wavy
	lines are one way to indicate trills; when used with a
	measure element, they should always have type="continue"
	set. The fermata text content represents the shape of the
	fermata sign and may be normal, angled, or square.
	An empty fermata element represents a normal fermata.
	The fermata type is upright if not specified.
-->
<!ELEMENT fermata  (#PCDATA)>
<!ATTLIST fermata
    type (upright | inverted) #IMPLIED
    %print-style;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getFermata = function(node, attributes) {

    var attributes = attributes || {};

    attributes.text =
        this.getAndValidateEnumValue(
            node, undefined, ['normal', 'angled', 'square'], 'normal');

    attributes.type =
        this.getAndValidateEnumValue(
            node, 'type', ['upright', 'inverted'], 'upright');

    this.getPrintStyle(node, attributes);

    return attributes;
};

/*
<!--
	The arpeggiate element indicates that this note is part of
	an arpeggiated chord. The number attribute can be used to
	distinguish between two simultaneous chords arpeggiated
	separately (different numbers) or together (same number).
	The up-down attribute is used if there is an arrow on the
	arpeggio sign. By default, arpeggios go from the lowest to
	highest note.
-->
<!ELEMENT arpeggiate EMPTY>
<!ATTLIST arpeggiate
    number %number-level; #IMPLIED
    direction %up-down; #IMPLIED
    %position;
    %placement;
    %color;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getArpeggiate = function(node, attributes) {

    var attributes = attributes || {};

    attributes.number =
        this.getNumberLevelValue(node, 'number');

    attributes.direction =
        this.getUpDownValue(node, 'direction', undefined);

    this.getPosition(node, attributes);
    this.getPlacement(node, attributes);
    this.getColor(node, attributes);

    return attributes;
};

/*
<!--
	The non-arpeggiate element indicates that this note is at
	the top or bottom of a bracket indicating to not arpeggiate
	these notes. Since this does not involve playback, it is
	only used on the top or bottom notes, not on each note
	as for the arpeggiate element.
-->
<!ELEMENT non-arpeggiate EMPTY>
<!ATTLIST non-arpeggiate
    type %top-bottom; #REQUIRED
    number %number-level; #IMPLIED
    %position;
    %placement;
    %color;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getNonArpeggiate = function(node, attributes) {

    var attributes = attributes || {};

    attributes.type =
        this.checkRequiredValue(
            node, 'type',
            this.getTopBottomValue(
                node, 'type', undefined));

    attributes.number =
        this.getNumberLevelValue(node, 'number');

    this.getPosition(node, attributes);
    this.getPlacement(node, attributes);
    this.getColor(node, attributes);

    return attributes;
};

/*
<!--
	An accidental-mark can be used as a separate notation or
	as part of an ornament. When used in an ornament, position
	and placement are relative to the ornament, not relative to
	the note.
-->
<!ELEMENT accidental-mark (#PCDATA)>
<!ATTLIST accidental-mark
    %print-style;
    %placement;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getAccidentalMark = function(node, attributes) {

    var attributes = attributes || {};

    attributes.accidental =
        this.getAccidentalValue(node, undefined, undefined);

    this.getPrintStyle(node, attributes);
    this.getPlacement(node, attributes);

    return attributes;
};

/*
<!--
	Articulations and accents are grouped together here.
-->
<!ELEMENT articulations
	((accent | strong-accent | staccato | tenuto |
	  detached-legato | staccatissimo | spiccato |
	  scoop | plop | doit | falloff | breath-mark |
	  caesura | stress | unstress | other-articulation)*)>
*/
ScoreLibrary.Score.XMLHelper.prototype.getArticulationTypes = function() {

    var articulation_types = ScoreLibrary.Score.XMLHelper.ArticulationTypes;
    if (articulation_types === undefined) {

        articulation_types = {

            'accent': this.getAccent,
            'strong-accent': this.getStrongAccent,
            'staccato': this.getStaccato,
            'tenuto': this.getTenuto,
            'detached-legato': this.getDetachedLegato,
            'staccatissimo': this.getStaccatissimo,
            'spiccato': this.getSpiccato,
            'scoop': this.getScoop,
            'plop': this.getPlop,
            'doit': this.getDoit,
            'falloff': this.getFalloff,
            'breath-mark': this.getBreathMark,
            'caesura': this.getCaesura,
            'stress': this.getStress,
            'unstress': this.getUnstress,
            'other-articulation': this.getOtherArticulation
        };

        ScoreLibrary.Score.XMLHelper.ArticulationTypes = articulation_types;
    }

    return articulation_types;
};

ScoreLibrary.Score.XMLHelper.prototype.getArticulations = function(node, attributes) {

    var attributes = attributes || {};

    var articulation_types = this.getArticulationTypes();

    var articulation_types_filter =
        ScoreLibrary.Score.XMLHelper.ArticulationTypesFilter;

    if (articulation_types_filter === undefined) {

        articulation_types_filter = ScoreLibrary.keys(articulation_types).join(',');

        ScoreLibrary.Score.XMLHelper.ArticulationTypesFilter = articulation_types_filter;
    }

    return this._getMixTypesChildren(
        node, attributes,
        'articulations', 'articulation',
        articulation_types,
        articulation_types_filter);
};

/*
<!ELEMENT accent EMPTY>
<!ATTLIST accent
    %print-style;
    %placement;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getAccent = function(node, attributes) {

    var attributes = attributes || {};

    this.getPrintStyle(node, attributes);
    this.getPlacement(node, attributes, 'above');

    return attributes;
};

/*
<!ELEMENT strong-accent EMPTY>
<!ATTLIST strong-accent
    %print-style;
    %placement;
    type %up-down; "up"
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getStrongAccent = function(node, attributes) {

    var attributes = attributes || {};

    attributes.type =
        this.getUpDownValue(node, 'type', 'up');

    this.getAccent(node, attributes);

    return attributes;
};

/*
<!--
	The staccato element is used for a dot articulation, as
	opposed to a stroke or a wedge.
-->
<!ELEMENT staccato EMPTY>
<!ATTLIST staccato
    %print-style;
    %placement;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getStaccato =
    ScoreLibrary.Score.XMLHelper.prototype.getAccent;

/*
<!ELEMENT tenuto EMPTY>
<!ATTLIST tenuto
    %print-style;
    %placement;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getTenuto =
    ScoreLibrary.Score.XMLHelper.prototype.getAccent;
/*
<!ELEMENT detached-legato EMPTY>
<!ATTLIST detached-legato
    %print-style;
    %placement;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getDetachedLegato =
    ScoreLibrary.Score.XMLHelper.prototype.getAccent;
/*
<!--
	The staccatissimo element is used for a wedge articulation,
	as opposed to a dot or a stroke.
-->
<!ELEMENT staccatissimo EMPTY>
<!ATTLIST staccatissimo
    %print-style;
    %placement;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getStaccatissimo =
    ScoreLibrary.Score.XMLHelper.prototype.getAccent;
/*
<!--
	The spiccato element is used for a stroke articulation, as
	opposed to a dot or a wedge.
-->
<!ELEMENT spiccato EMPTY>
<!ATTLIST spiccato
    %print-style;
    %placement;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getSpiccato =
    ScoreLibrary.Score.XMLHelper.prototype.getAccent;

/*
<!--
	The scoop, plop, doit, and falloff elements are
	indeterminate slides attached to a single note.
	Scoops and plops come before the main note, coming
	from below and above the pitch, respectively. Doits
	and falloffs come after the main note, going above
	and below the pitch, respectively.
-->
<!ELEMENT scoop EMPTY>
<!ATTLIST scoop
    %line-shape;
    %line-type;
    %dashed-formatting;
    %print-style;
    %placement;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getScoop = function(node, attributes) {

    var attributes = attributes || {};

    attributes.line_shape =
        this.getLineShapeValue(node, 'line-shape', 'curved');

    attributes.line_type =
        this.getLineTypeValue(node, 'line-shape', 'solid');

    if (attributes.line_type === 'dashed') {

        this.getDashedFormatting(node, attributes);
    }

    this.getPrintStyle(node, attributes);
    this.getPlacement(node, attributes);

    return attributes;
};

/*
<!ELEMENT plop EMPTY>
<!ATTLIST plop
    %line-shape;
    %line-type;
    %dashed-formatting;
    %print-style;
    %placement;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getPlop =
    ScoreLibrary.Score.XMLHelper.prototype.getScoop;

/*
<!ELEMENT doit EMPTY>
<!ATTLIST doit
    %line-shape;
    %line-type;
    %dashed-formatting;
    %print-style;
    %placement;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getDoit =
    ScoreLibrary.Score.XMLHelper.prototype.getScoop;
/*
<!ELEMENT falloff EMPTY>
<!ATTLIST falloff
    %line-shape;
    %line-type;
    %dashed-formatting;
    %print-style;
    %placement;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getFalloff =
    ScoreLibrary.Score.XMLHelper.prototype.getScoop;

/*
<!--
	The breath-mark element may have a text value to
	indicate the symbol used for the mark. Valid values are
	comma, tick, and an empty string.
-->
<!ELEMENT breath-mark (#PCDATA)>
<!ATTLIST breath-mark
    %print-style;
    %placement;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getBreathMark = function(node, attributes) {

    var attributes = attributes || {};

    attributes.text =
        node.getStringWithDefault(undefined, undefined);

    this.getPrintStyle(node, attributes);
    this.getPlacement(node, attributes, 'above');

    return attributes;
};

/*
<!ELEMENT caesura EMPTY>
<!ATTLIST caesura
    %print-style;
    %placement;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getCaesura =
    ScoreLibrary.Score.XMLHelper.prototype.getAccent;

/*
<!ELEMENT stress EMPTY>
<!ATTLIST stress
    %print-style;
    %placement;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getStress =
    ScoreLibrary.Score.XMLHelper.prototype.getAccent;

/*
<!ELEMENT unstress EMPTY>
<!ATTLIST unstress
    %print-style;
    %placement;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getUnstress =
    ScoreLibrary.Score.XMLHelper.prototype.getAccent;
/*
<!--
	The other-articulation element is used to define any
	articulations not yet in the MusicXML format. This allows
	extended representation, though without application
	interoperability.
-->
<!ELEMENT other-articulation (#PCDATA)>
<!ATTLIST other-articulation
    %print-style;
    %placement;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getOtherArticulation =
    ScoreLibrary.Score.XMLHelper.prototype.getAccent;

/*
<!--
	Notations are musical notations, not XML notations. Multiple
	notations are allowed in order to represent multiple editorial
	levels. The print-object attribute, added in Version 3.0,
	allows notations to represent details of performance technique,
	such as fingerings, without having them appear in the score.
-->
<!ELEMENT notations
	(%editorial;,
	 (tied | slur | tuplet | glissando | slide |
	  ornaments | technical | articulations | dynamics |
	  fermata | arpeggiate | non-arpeggiate |
	  accidental-mark | other-notation)*)>
<!ATTLIST notations
    %print-object;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getNotationTypes = function() {

    var notation_types = ScoreLibrary.Score.XMLHelper.NotationTypes;
    if (notation_types === undefined) {

        notation_types = {

            'tied': this.getTied,
            'slur': this.getSlur,
            'tuplet': this.getTuplet,
            'ornaments': this.getOrnaments,
            'fermata': this.getFermata,
            'accidental-mark': this.getAccidentalMark,
            'articulations': this.getArticulations,
            'technical': this.getTechnical,
            'dynamics': this.getDynamics,
            'arpeggiate': this.getArpeggiate,
            'non-arpeggiate': this.getNonArpeggiate,
            'glissando': this.getGlissando,
            'slide': this.getSlide,
            'other-notation': null
        };

        ScoreLibrary.Score.XMLHelper.NotationTypes = notation_types;
    }

    return notation_types;
};

ScoreLibrary.Score.XMLHelper.prototype.getNotations = function(node, attributes) {

    var attributes = attributes || {};

    var notation_types = this.getNotationTypes();

    var notation_types_filter =
        ScoreLibrary.Score.XMLHelper.NotationTypesFilter;

    if (notation_types_filter === undefined) {

        notation_types_filter = ScoreLibrary.keys(notation_types).join(',');

        ScoreLibrary.Score.XMLHelper.NotationTypesFilter = notation_types_filter;
    }

    return this._getMixTypesChildren(
        node, attributes,
        'notations', 'notation',
        notation_types,
        notation_types_filter);
};

/*
<!--
	Text underlays for lyrics, based on Humdrum with support
	for other formats. The lyric number indicates multiple
	lines, though a name can be used as well (as in Finale's
	verse/chorus/section specification). Word extensions are
	represented using the extend element. Hyphenation is
	indicated by the syllabic element, which can be single,
	begin, end, or middle. These represent single-syllable
	words, word-beginning syllables, word-ending syllables,
	and mid-word syllables. Multiple syllables on a single
	note are separated by elision elements. A hyphen in the
	text element should only be used for an actual hyphenated
	word. Two text elements that are not separated by an
	elision element are part of the same syllable, but may have
	different text formatting.

	Humming and laughing representations are taken from
	Humdrum. The end-line and end-paragraph elements come
	from RP-017 for Standard MIDI File Lyric meta-events;
	they help facilitate lyric display for Karaoke and
	similar applications. Language names for text elements
	come from ISO 639, with optional country subcodes from
	ISO 3166. Justification is center by default; placement is
	below by default. The print-object attribute can override
	a note's print-lyric attribute in cases where only some
	lyrics on a note are printed, as when lyrics for later verses
	are printed in a block of text rather than with each note.
-->
<!ELEMENT lyric
	((((syllabic?, text),
	   (elision?, syllabic?, text)*, extend?) |
	   extend | laughing | humming),
	  end-line?, end-paragraph?, %editorial;)>
<!ATTLIST lyric
    number NMTOKEN #IMPLIED
    name CDATA #IMPLIED
    %justify;
    %position;
    %placement;
    %color;
    %print-object;
>

<!ELEMENT text (#PCDATA)>
<!ATTLIST text
    %font;
    %color;
    %text-decoration;
    %text-rotation;
    %letter-spacing;
    xml:lang NMTOKEN #IMPLIED
    %text-direction;
>
<!ELEMENT syllabic (#PCDATA)>

<!--
	The elision element text specifies the symbol used to
	display the elision. Common values are a no-break space
	(Unicode 00A0), an underscore (Unicode 005F), or an undertie
	(Unicode 203F).
-->
<!ELEMENT elision (#PCDATA)>
<!ATTLIST elision
    %font;
    %color;
>

<!--
	The extend element represents lyric word extension /
	melisma lines as well as figured bass extensions. The
	optional type and position attributes are added in
	Version 3.0 to provide better formatting control.
-->
<!ELEMENT extend EMPTY>
<!ATTLIST extend
    type %start-stop-continue; #IMPLIED
    %print-style;
>

<!ELEMENT laughing EMPTY>
<!ELEMENT humming EMPTY>
<!ELEMENT end-line EMPTY>
<!ELEMENT end-paragraph EMPTY>
*/
ScoreLibrary.Score.XMLHelper.prototype.getLyric = function(node, attributes) {

    var attributes = attributes || {};

    attributes.number =
        this.getNumberLevelValue(node, 'number');

    attributes.name =
        node.getStringWithDefault('name', '');

    this.getJustify(node, attributes);
    this.getPosition(node, attributes);
    this.getPlacement(node, attributes);
    this.getColor(node, attributes);

    attributes.print_object =
        this.isPrintObject(node);

    attributes.end_line = node.getBool('end-line');
    attributes.end_paragraph = node.getBool('end-paragraph');

    this.getEditorial(node, attributes);

    if (node.getBool('laughing')) {

        attributes.laughing = true;
    }
    else if (node.getBool('humming')) {

        attributes.humming = true;
    }
    else {

        var text_node_count = 0;

        node.forEachNode(
            'elision, text',
            function(index, text_node) {

                text_node_count += 1;

                attributes.text =
                    attributes.text || '';

                if (text_node.is('elision')) {

                    attributes.text +=
                    this.getAndValidateEnumValue(
                        text_node, undefined,
                        [String.fromCharCode(0x00A0),
                         String.fromCharCode(0x005F),
                         String.fromCharCode(0x203F)], String.fromCharCode(0x00A0));
                }
                else {

                    attributes.text +=
                    text_node.getStringWithDefault(undefined, '');
                }
            }, this);

        var syllabic_node = node.getNode('syllabic');
        if (syllabic_node &&
            text_node_count === 1) {
            // !NOTE: ignore elision texts's syllabics.

            attributes.syllabic =
                this.getAndValidateEnumValue(
                    syllabic_node, undefined,
                    ['single', 'begin', 'end', 'middle'], 'single');
        }

        var extend_node = node.getNode('extend');
        if (extend_node) {

            attributes.extend =
                this.getStartStopContinueValue(
                    extend_node, 'type', true); // MusicXML v3.0 add type.
        }
    }

    return attributes;
};

/*
<!--
	The backup and forward elements are required to coordinate
	multiple voices in one part, including music on multiple
	staves. The forward element is generally used within voices
	and staves, while the backup element is generally used to
	move between voices and staves. Thus the backup element
	does not include voice or staff elements. Duration values
	should always be positive, and should not cross measure
	boundaries or mid-measure changes in the divisions value.
-->
<!ELEMENT backup (duration, %editorial;)>
<!ELEMENT forward
	(duration, %editorial-voice;, staff?)>
*/
ScoreLibrary.Score.XMLHelper.prototype.getMover = function(node, attributes) {

    var attributes = attributes || {};

    this.getDuration(node, attributes);

    attributes.is_backup = node.is('backup');

    if (attributes.is_backup) {

        this.getEditorial(node, attributes);
    }
    else {

        attributes.is_forward = node.is('forward');

        if (attributes.is_forward) {

            this.getEditorialVoice(node, attributes);
            this.getStaffNumber(node, attributes);
        }
    }

    return attributes;
};

/*
<!--
	Two entities for editorial information in notes. These
	entities, and their elements defined below, are used
	across all the different component DTD modules.
-->
<!ENTITY % editorial "(footnote?, level?)">
<!ENTITY % editorial-voice "(footnote?, level?, voice?)">

<!-- Elements -->

<!--
	Footnote and level are used to specify editorial
	information, while voice is used to distinguish between
	multiple voices (what MuseData calls tracks) in individual
	parts. These elements are used throughout the different
	MusicXML DTD modules. If the reference attribute for the
	level element is yes, this indicates editorial information
	that is for display only and should not affect playback.
	For instance, a modern edition of older music may set
	reference="yes" on the attributes containing the music's
	original clef, key, and time signature. It is no by default.
-->
<!ELEMENT footnote (#PCDATA)>
<!ATTLIST footnote
	%text-formatting;
>
<!ELEMENT level (#PCDATA)>
<!ATTLIST level
    reference %yes-no; #IMPLIED
    %level-display;
>
<!ELEMENT voice (#PCDATA)>
*/
ScoreLibrary.Score.XMLHelper.prototype.getEditorial = function(node, attributes) {

    var attributes = attributes || {};

    var footnote_node = node.getNode('footnote');
    if (footnote_node) {

        attributes.footnote =
            this.getTextFormating(footnote_node);
    }

    var level_node = node.getNode('level');
    if (level_node) {

        attributes.level = {};
        attributes.level.reference =
            this.getYesNoValue(level_node, 'reference', false);

        this.getLevelDisplay(level_node, attributes.level);
    }

    return attributes;
};

ScoreLibrary.Score.XMLHelper.prototype.getEditorialVoice = function(node, attributes) {

    var attributes = attributes || {};

    this.getEditorial(node, attributes);

    attributes.voice =
        node.getNumberWithDefault('voice', 1);

    return attributes;
};

ScoreLibrary.Score.XMLHelper.prototype._copyDirectionAttributes = function(attributes, direction_attributes) {

    if (attributes && direction_attributes) {

        attributes.placement = direction_attributes.placement;
        attributes.directive = direction_attributes.directive;
        attributes.staff_number = direction_attributes.staff_number;
        attributes.voice = direction_attributes.voice;
    }
};

/*
<!--
	Language is Italian ("it") by default. Enclosure is
	square by default. Left justification is assumed if
	not specified.
-->
<!ELEMENT rehearsal (#PCDATA)>
<!ATTLIST rehearsal
    %text-formatting;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getRehearsal = function(node, attributes, direction_attributes) {

    var attributes = attributes || {};

    this._copyDirectionAttributes(attributes, direction_attributes);

    attributes.placement = attributes.placement || 'above';

    attributes.enclosure = 'square';

    this.getTextFormating(node, attributes);

    return attributes;
};

/*
<!--
	Left justification is assumed if not specified.
	Language is Italian ("it") by default. Enclosure
	is none by default.
-->
<!ELEMENT words (#PCDATA)>
<!ATTLIST words
    %text-formatting;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getWords = function(node, attributes, direction_attributes) {

    var attributes = attributes || {};

    this._copyDirectionAttributes(attributes, direction_attributes);

    attributes.placement = attributes.placement || 'below';

    attributes.enclosure = 'none';

    this.getTextFormating(node, attributes);

    return attributes;
};

/*
<!--
	Segno and coda signs can be associated with a measure
	or a general musical direction. These are visual
	indicators only; a sound element is needed to guide
	playback applications reliably.
-->
<!ELEMENT segno EMPTY>
<!ATTLIST segno
    %print-style-align;
>

<!ELEMENT coda EMPTY>
<!ATTLIST coda
    %print-style-align;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getSegno = function(node, attributes, direction_attributes) {

    var attributes = attributes || {};

    this._copyDirectionAttributes(attributes, direction_attributes);

    attributes.placement = attributes.placement || 'above';

    this.getPrintStyleAlign(node, attributes);

    return attributes;
};

ScoreLibrary.Score.XMLHelper.prototype.getCoda = ScoreLibrary.Score.XMLHelper.prototype.getSegno;

/*
<!--
	Dynamics can be associated either with a note or a general
	musical direction. To avoid inconsistencies between and
	amongst the letter abbreviations for dynamics (what is sf
	vs. sfz, standing alone or with a trailing dynamic that is
	not always piano), we use the actual letters as the names
	of these dynamic elements. The other-dynamics element
	allows other dynamic marks that are not covered here, but
	many of those should perhaps be included in a more general
	musical direction element. Dynamics may also be combined as
	in <sf/><mp/>.

	These letter dynamic symbols are separated from crescendo,
	decrescendo, and wedge indications. Dynamic representation
	is inconsistent in scores. Many things are assumed by the
	composer and left out, such as returns to original dynamics.
	Systematic representations are quite complex: for example,
	Humdrum has at least 3 representation formats related to
	dynamics. The MusicXML format captures what is in the score,
	but does not try to be optimal for analysis or synthesis of
	dynamics.
-->
<!ELEMENT dynamics ((p | pp | ppp | pppp | ppppp | pppppp |
	f | ff | fff | ffff | fffff | ffffff | mp | mf | sf |
	sfp | sfpp | fp | rf | rfz | sfz | sffz | fz |
	other-dynamics)*)>
<!ATTLIST dynamics
    %print-style-align;
    %placement;
    %text-decoration;
    %enclosure;
>
<!ELEMENT p EMPTY>
<!ELEMENT pp EMPTY>
<!ELEMENT ppp EMPTY>
<!ELEMENT pppp EMPTY>
<!ELEMENT ppppp EMPTY>
<!ELEMENT pppppp EMPTY>
<!ELEMENT f EMPTY>
<!ELEMENT ff EMPTY>
<!ELEMENT fff EMPTY>
<!ELEMENT ffff EMPTY>
<!ELEMENT fffff EMPTY>
<!ELEMENT ffffff EMPTY>
<!ELEMENT mp EMPTY>
<!ELEMENT mf EMPTY>
<!ELEMENT sf EMPTY>
<!ELEMENT sfp EMPTY>
<!ELEMENT sfpp EMPTY>
<!ELEMENT fp EMPTY>
<!ELEMENT rf EMPTY>
<!ELEMENT rfz EMPTY>
<!ELEMENT sfz EMPTY>
<!ELEMENT sffz EMPTY>
<!ELEMENT fz EMPTY>
<!ELEMENT other-dynamics (#PCDATA)>
*/
ScoreLibrary.Score.XMLHelper.DynamicsTypes = [

    'p', 'pp', 'ppp', 'pppp', 'ppppp', 'pppppp',
    'f', 'ff', 'fff', 'ffff', 'fffff', 'ffffff',
    'mp', 'mf', 'sf', 'sfp', 'sfpp', 'fp', 'rf', 'rfz',
    'sfz', 'sffz', 'fz', 'other-dynamics'
];

ScoreLibrary.Score.XMLHelper.prototype.getDynamics = function(node, attributes, direction_attributes) {

    var attributes = attributes || {};

    this._copyDirectionAttributes(attributes, direction_attributes);

    this.getPrintStyleAlign(node, attributes);
    this.getPlacement(node, attributes);
    this.getTextDecoration(node, attributes);
    this.getTextEnclosure(node, attributes);

    ScoreLibrary.Score.XMLHelper.DynamicsTypesFilter =
        ScoreLibrary.Score.XMLHelper.DynamicsTypesFilter ||
        ScoreLibrary.Score.XMLHelper.DynamicsTypes.join(',');

    node.forEachNode(
        ScoreLibrary.Score.XMLHelper.DynamicsTypesFilter,
        function(index, child_node) {

            attributes.texts =
                attributes.texts || [];

            if (child_node.is('other-dynamics')) {

                attributes.texts.push(
                    child_node.getStringWithDefault(
                        undefined, ''));

                return;
            }

            ScoreLibrary.Score.XMLHelper.DynamicsTypes.some(
                function(type, index, types) {

                    if (child_node.is(type)) {

                        attributes.texts.push(type);

                        return true;
                    }

                    return false;
                });
        });

    return attributes;
};

/*
<!--
	Piano pedal marks. The line attribute is yes if pedal
	lines are used. The sign attribute is yes if Ped and *
	signs are used. For MusicXML 2.0 compatibility, the sign
	attribute is yes by default if the line attribute is no,
	and is no by default if the line attribute is yes. The
	change and continue types are used when the line attribute
	is yes. The change type indicates a pedal lift and retake
	indicated with an inverted V marking. The continue type
	allows more precise formatting across system breaks and for
	more complex pedaling lines. The alignment attributes are
	ignored if the line attribute is yes.
-->
<!ELEMENT pedal EMPTY>
<!ATTLIST pedal
    type (start | stop | continue | change) #REQUIRED
    line %yes-no; #IMPLIED
    sign %yes-no; #IMPLIED
    %print-style-align;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getPedal = function(node, attributes, direction_attributes) {

    var attributes = attributes || {};

    this._copyDirectionAttributes(attributes, direction_attributes);

    attributes.type =
        this.checkRequiredValue(
            node, 'type',
            this.getAndValidateEnumValue(
                node, 'type',
                ['start', 'stop', 'continue', 'change'],
                undefined));

    attributes.line =
        this.getYesNoValue(node, 'line', false);

    attributes.sign =
        this.getYesNoValue(node, 'sign', true);

    this.getPrintStyleAlign(node, attributes);

    return attributes;
};

/*
<!--
	Wedge spread is measured in tenths of staff line space.
	The type is crescendo for the start of a wedge that is
	closed at the left side, and diminuendo for the start
	of a wedge that is closed on the right side. Spread
	values at the start of a crescendo wedge or end of a
	diminuendo wedge are ignored. The niente attribute is yes
	if a circle appears at the point of the wedge, indicating
	a crescendo from nothing or diminuendo to nothing. It is
	no by default, and used only when the type is crescendo,
	or the type is stop for a wedge that began with a diminuendo
	type. The line-type is solid by default. The continue type
	is used for formatting wedges over a system break, or for
	other situations where a single wedge is divided into
	multiple segments.
-->
<!ELEMENT wedge EMPTY>
<!ATTLIST wedge
    type (crescendo | diminuendo | stop | continue) #REQUIRED
    number %number-level; #IMPLIED
    spread %tenths; #IMPLIED
    niente %yes-no; #IMPLIED
    %line-type;
    %dashed-formatting;
    %position;
    %color;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getWedge = function(node, attributes, direction_attributes) {

    var attributes = attributes || {};

    this._copyDirectionAttributes(attributes, direction_attributes);

    attributes.type =
        this.checkRequiredValue(
            node, 'type',
            this.getAndValidateEnumValue(
                node, 'type',
                ['crescendo', 'diminuendo', 'stop', 'continue'],
                undefined));

    attributes.number =
        this.getNumberLevelValue(node, 'number');

    attributes.spread =
        this.getTenthsValue(node, 'spread', 10);

    if (!attributes.spread) {

        attributes.spread = 10;
    }

    attributes.niente =
        this.getYesNoValue(node, 'niente', false);

    attributes.line_type =
        this.getLineTypeValue(node, 'line-type', 'solid');

    if (attributes.line_type === 'dashed') {

        this.getDashedFormatting(node, attributes);
    }

    this.getPosition(node, attributes);
    this.getColor(node, attributes);

    return attributes;
};

/*
<!--
	Dashes, used for instance with cresc. and dim. marks.
-->
<!ELEMENT dashes EMPTY>
<!ATTLIST dashes
    type %start-stop-continue; #REQUIRED
    number %number-level; #IMPLIED
    %dashed-formatting;
    %position;
    %color;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getDashes = function(node, attributes, direction_attributes) {

    var attributes = attributes || {};

    this._copyDirectionAttributes(attributes, direction_attributes);

    attributes.type =
        this.checkRequiredValue(
            node, 'type',
            this.getStartStopContinueValue(
                node, 'type', undefined));

    attributes.number =
        this.getNumberLevelValue(node, 'number');

    this.getDashedFormatting(node, attributes);
    this.getPosition(node, attributes);
    this.getColor(node, attributes);

    return attributes;
};

/*
<!--
	Brackets are combined with words in a variety of
	modern directions. The line-end attribute specifies
	if there is a jog up or down (or both), an arrow,
	or nothing at the start or end of the bracket. If
	the line-end is up or down, the length of the jog
	can be specified using the end-length attribute.
	The line-type is solid by default.
-->
<!ELEMENT bracket EMPTY>
<!ATTLIST bracket
    type %start-stop-continue; #REQUIRED
    number %number-level; #IMPLIED
    line-end (up | down | both | arrow | none) #REQUIRED
    end-length %tenths; #IMPLIED
    %line-type;
    %dashed-formatting;
    %position;
    %color;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getBracket = function(node, attributes, direction_attributes) {

    var attributes = attributes || {};

    this._copyDirectionAttributes(attributes, direction_attributes);

    attributes.type =
        this.checkRequiredValue(
            node, 'type',
            this.getStartStopContinueValue(
                node, 'type', undefined));

    attributes.number =
        this.getNumberLevelValue(node, 'number');

    attributes.line_end =
        this.checkRequiredValue(
            node, 'line-end',
            this.getAndValidateEnumValue(
                node, 'line-end',
                ['up', 'down', 'both', 'arrow', 'none'], undefined));

    attributes.end_length =
        this.getTenthsValue(
            node, 'end-length', 5);


    attributes.line_type =
        this.getLineTypeValue(node, 'line-type', 'solid');

    if (attributes.line_type === 'dashed') {

        this.getDashedFormatting(node, attributes);
    }

    this.getPosition(node, attributes);
    this.getColor(node, attributes);

    return attributes;
};

/*
<!--
	Octave shifts indicate where notes are shifted up or down
	from their true pitched values because of printing
	difficulty. Thus a treble clef line noted with 8va will
	be indicated with an octave-shift down from the pitch
	data indicated in the notes. A size of 8 indicates one
	octave; a size of 15 indicates two octaves.
-->
<!ELEMENT octave-shift EMPTY>
<!ATTLIST octave-shift
    type (up | down | stop | continue) #REQUIRED
    number %number-level; #IMPLIED
    size CDATA "8"
    %dashed-formatting;
    %print-style;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getOctaveShift = function(node, attributes, direction_attributes) {

    var attributes = attributes || {};

    this._copyDirectionAttributes(attributes, direction_attributes);

    attributes.type =
        this.checkRequiredValue(
            node, 'type',
            this.getAndValidateEnumValue(
                node, 'type', ['up', 'down', 'stop', 'continue'],
                undefined));

    attributes.number =
        this.getNumberLevelValue(node, 'number');

    attributes.size =
        node.getNumberWithDefault('size', 8);

    this.getDashedFormatting(node, attributes);
    this.getPrintStyle(node, attributes);

    return attributes;
};

/*
<!--
	Metronome marks and other metric relationships.

	The beat-unit values are the same as for a type element,
	and the beat-unit-dot works like the dot element. The
	per-minute element can be a number, or a text description
	including numbers. The parentheses attribute indicates
	whether or not to put the metronome mark in parentheses;
	its value is no if not specified. If a font is specified for
	the per-minute element, it overrides the font specified for
	the overall metronome element. This allows separate
	specification of a music font for beat-unit and a text
	font for the numeric value in cases where a single
	metronome font is not used.

	The metronome-note and metronome-relation elements
	allow for the specification of more complicated metric
	relationships, such as swing tempo marks where
	two eighths are equated to a quarter note / eighth note
	triplet. The metronome-type, metronome-beam, and
	metronome-dot elements work like the type, beam, and
	dot elements. The metronome-tuplet element uses the
	same element structure as the time-modification element
	along with some attributes from the tuplet element. The
	metronome-relation element describes the relationship
	symbol that goes between the two sets of metronome-note
	elements. The currently allowed value is equals, but this
	may expand in future versions. If the element is empty,
	the equals value is used. The metronome-relation and
	the following set of metronome-note elements are optional
	to allow display of an isolated Grundschlagnote.
-->
<!ELEMENT metronome
	((beat-unit, beat-unit-dot*,
	 (per-minute | (beat-unit, beat-unit-dot*))) |
	(metronome-note+, (metronome-relation, metronome-note+)?))>
<!ATTLIST metronome
    %print-style-align;
    %justify;
    parentheses %yes-no; #IMPLIED
>
<!ELEMENT beat-unit (#PCDATA)>
<!ELEMENT beat-unit-dot EMPTY>
<!ELEMENT per-minute (#PCDATA)>
<!ATTLIST per-minute
    %font;
>

<!ELEMENT metronome-note
	(metronome-type, metronome-dot*,
	 metronome-beam*, metronome-tuplet?)>
<!ELEMENT metronome-relation (#PCDATA)>
<!ELEMENT metronome-type (#PCDATA)>
<!ELEMENT metronome-dot EMPTY>
<!ELEMENT metronome-beam (#PCDATA)>
<!ATTLIST metronome-beam
    number %beam-level; "1"
>
<!ELEMENT metronome-tuplet
	(actual-notes, normal-notes,
	 (normal-type, normal-dot*)?)>
<!ATTLIST metronome-tuplet
    type %start-stop; #REQUIRED
    bracket %yes-no; #IMPLIED
    show-number (actual | both | none) #IMPLIED
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getMetronome = function(node, attributes, direction_attributes) {

    var attributes = attributes || {};

    this._copyDirectionAttributes(attributes, direction_attributes);

    node.forEachNode(
        'beat-unit',
        function(index, beat_unit_node) {

            attributes['beat_unit' + index] =
                this.getNoteTypeValue(
                    beat_unit_node, undefined, 'quarter');

            var beat_unit_dots_node =
                beat_unit_node.getNextUntil(
                    ':not(beat-unit-dot)');

            if (beat_unit_dots_node) {

                attributes['beat_unit' + index + '_dots'] =
                    this.getDotsValue(
                        beat_unit_dots_node,
                        undefined);
            }
        }, this);

    var per_minute_node = node.getNode('per-minute');
    if (per_minute_node) {

        attributes.per_minute =
            per_minute_node.getStringWithDefault(
                undefined, '');
    }

    attributes.parentheses =
        this.getYesNoValue(node, 'parentheses', false);

    this.getPrintStyleAlign(node, attributes);
    this.getJustify(node, attributes);

    return attributes;
};

/*
<!--
	The harp-pedals element is used to create harp pedal
	diagrams. The pedal-step and pedal-alter elements use
	the same values as the step and alter elements. For
	easiest reading, the pedal-tuning elements should follow
	standard harp pedal order, with pedal-step values of
	D, C, B, E, F, G, and A.
-->
<!ELEMENT harp-pedals (pedal-tuning)+>
<!ATTLIST harp-pedals
    %print-style-align;
>
<!ELEMENT pedal-tuning (pedal-step, pedal-alter)>
<!ELEMENT pedal-step (#PCDATA)>
<!ELEMENT pedal-alter (#PCDATA)>
*/
ScoreLibrary.Score.XMLHelper.prototype.getHarpPedals = function(node, attributes, direction_attributes) {

    var attributes = attributes || {};

    this._copyDirectionAttributes(attributes, direction_attributes);

    this.getPrintStyleAlign(node, attributes);

    attributes.pedal_tunings = {
        'D': 0, 'C': 0, 'B': 0, 'E': 0, 'F': 0, 'G': 0, 'A': 0
    };

    node.forEachNode(
        'pedal-tuning',
        function(index, pedal_tuning_node) {

            var pedal_step =
                this.checkRequiredValue(
                    pedal_tuning_node, 'pedal-step',
                    this.getAndValidateEnumValue(
                        pedal_tuning_node, 'pedal-step',
                        ['D', 'C', 'B', 'E', 'F', 'G', 'A'],
                        undefined));

            var pedal_alter =
                pedal_tuning_node.getNumberWithDefault(
                    'pedal-alter', 0);

            attributes.pedal_tunings[pedal_step] =
                pedal_alter;
        }, this);

    return attributes;
};

/*
<!--
	The accordion-registration element is use for accordion
	registration symbols. These are circular symbols divided
	horizontally into high, middle, and low sections that
	correspond to 4', 8', and 16' pipes. Each accordion-high,
	accordion-middle, and accordion-low element represents
	the presence of one or more dots in the registration
	diagram. The accordion-middle element may have text
	values of 1, 2, or 3, corresponding to have 1 to 3 dots
	in the middle section. An accordion-registration element
	needs to have at least one of the child elements present.
-->
<!ELEMENT accordion-registration
	(accordion-high?, accordion-middle?, accordion-low?)>
<!ATTLIST accordion-registration
    %print-style-align;
>
<!ELEMENT accordion-high EMPTY>
<!ELEMENT accordion-middle (#PCDATA)>
<!ELEMENT accordion-low EMPTY>
*/
ScoreLibrary.Score.XMLHelper.prototype.getAccordionRegistration = function(node, attributes) {

    var attributes = attributes || {};

    attributes.accordion_high =
        node.getBool('accordion-high');

    attributes.accordion_low =
        node.getBool('accordion-low');

    attributes.accordion_middle =
        this.checkRangeOfValue(
            node, 'accordion-middle', 0, 3,
            node.getNumberWithDefault(
                'accordion-middle', 0));

    this.getPrintStyleAlign(node, attributes);

    return attributes;
};

/*
<!--
	The directive entity changes the default-x position
	of a direction. It indicates that the left-hand side of the
	direction is aligned with the left-hand side of the time
	signature. If no time signature is present, it is aligned
	with the left-hand side of the first music notational
	element in the measure. If a default-x, justify, or halign
	attribute is present, it overrides the directive entity.
-->
<!ENTITY % directive
	"directive  %yes-no;  #IMPLIED">
*/
ScoreLibrary.Score.XMLHelper.prototype.getDirective = function(node, attributes) {

    var attributes = attributes || {};

    attributes.directive = this.getYesNoValue(node, 'directive', true);

    return attributes;
};

/*
<!--
	Textual direction types may have more than 1 component
	due to multiple fonts. The dynamics element may also be
	used in the notations element, and is defined in the
	common.mod file.
-->
<!ELEMENT direction-type (rehearsal+ | segno+ | words+ |
	coda+ | wedge | dynamics+ | dashes | bracket | pedal |
	metronome | octave-shift | harp-pedals | damp | damp-all |
	eyeglasses | string-mute | scordatura | image |
	principal-voice | accordion-registration | percussion+ |
	other-direction)>
*/
ScoreLibrary.Score.XMLHelper.prototype.getDirectionTypes = function() {

    var direction_types = ScoreLibrary.Score.XMLHelper.DirectionTypes;
    if (direction_types === undefined) {

        direction_types = {

            'rehearsal': this.getRehearsal,
            'segno': this.getSegno,
            'coda': this.getCoda,
            'words': this.getWords,
            'dynamics': this.getDynamics,
            'pedal': this.getPedal,
            'wedge': this.getWedge,
            'dashes': this.getDashes,
            'bracket': this.getBracket,
            'octave-shift': this.getOctaveShift,
            'harp-pedals': this.getHarpPedals,
            'accordion-registration': this.getAccordionRegistration,
            'metronome': this.getMetronome,
            'damp': null, // TODO
            'damp-all': null,
            'percussion': null,
            'eyeglasses': null,
            'string-mute': null,
            'scordatura': null,
            'image': null,
	    'principal-voice': null,
            'other-direction': null
        };

        ScoreLibrary.Score.XMLHelper.DirectionTypes = direction_types;
    }

    return direction_types;
};

ScoreLibrary.Score.XMLHelper.prototype.getDirectionType = function(node, attributes) {

    var attributes = attributes || {};

    var direction_types = this.getDirectionTypes();

    var direction_types_filter =
        ScoreLibrary.Score.XMLHelper.DirectionTypesFilter;

    if (direction_types_filter === undefined) {

        direction_types_filter = ScoreLibrary.keys(direction_types).join(',');

        ScoreLibrary.Score.XMLHelper.DirectionTypesFilter = direction_types_filter;
    }

    return this._getMixTypesChildren(
        node, attributes,
        'directions', 'direction',
        direction_types,
        direction_types_filter);
};

/*
<!--
	A direction is a musical indication that is not attached
	to a specific note. Two or more may be combined to
	indicate starts and stops of wedges, dashes, etc.

	By default, a series of direction-type elements and a
	series of child elements of a direction-type within a
	single direction element follow one another in sequence
	visually. For a series of direction-type children, non-
	positional formatting attributes are carried over from
	the previous element by default.
-->
<!ELEMENT direction (direction-type+, offset?,
	%editorial-voice;, staff?, sound?)>
<!ATTLIST direction
    %placement;
    %directive;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getDirection = function(node, attributes) {

    var attributes = attributes || {};

    var offset_node = node.getNode('offset');
    if (offset_node) {

        attributes.offset = this.getOffset(offset_node);
    }

    this.getEditorialVoice(node, attributes);
    this.getStaffNumber(node, attributes);
    // TODO: this.getSound(node, attributes);

    this.getPlacement(node, attributes);
    this.getDirective(node, attributes);

    node.forEachNode(
        'direction-type',
        function(index, child_node) {

            this.getDirectionType(child_node, attributes);
        }, this);

    return attributes;
};

/*
<!--
	An offset is represented in terms of divisions, and
	indicates where the direction will appear relative to
	the current musical location. This affects the visual
	appearance of the direction. If the sound attribute is
	"yes", then the offset affects playback too. If the sound
	attribute is "no", then any sound associated with the
	direction takes effect at the current location. The sound
	attribute is "no" by default for compatibility with earlier
	versions of the MusicXML format. If an element within a
	direction includes a default-x attribute, the offset value
	will be ignored when determining the appearance of that
	element.
-->
<!ELEMENT offset (#PCDATA)>
<!ATTLIST offset
    sound %yes-no; #IMPLIED
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getOffset = function(node, attributes) {

    var attributes = attributes || {};

    attributes.duration =
        node.getNumberWithDefault(undefined, 0);

    attributes.sound =
        this.getYesNoValue(node, 'sound', false);

    return attributes;
};
/*
<!--
	The sound element contains general playback parameters.
	They can stand alone within a part/measure, or be a
	component element within a direction.

	Tempo is expressed in quarter notes per minute. If 0,
	the sound-generating program should prompt the user at the
	time of compiling a sound (MIDI) file.

	Dynamics (or MIDI velocity) are expressed as a percentage
	of the default forte value (90 for MIDI 1.0).

	Dacapo indicates to go back to the beginning of the
	movement. When used it always has the value "yes".

	Segno and dalsegno are used for backwards jumps to a
	segno sign; coda and tocoda are used for forward jumps
	to a coda sign. If there are multiple jumps, the value
	of these parameters can be used to name and distinguish
	them. If segno or coda is used, the divisions attribute
	can also be used to indicate the number of divisions
	per quarter note. Otherwise sound and MIDI generating
	programs may have to recompute this.

	By default, a dalsegno or dacapo attribute indicates that
	the jump should occur the first time through, while a
	tocoda attribute indicates the jump should occur the second
	time through. The time that jumps occur can be changed by
	using the time-only attribute.

	Forward-repeat is used when a forward repeat sign is
	implied, and usually follows a bar line. When used it
	always has the value of "yes".

	The fine attribute follows the final note or rest in a
	movement with a da capo or dal segno direction. If numeric,
	the value represents the actual duration of the final note or
	rest, which can be ambiguous in written notation and
	different among parts and voices. The value may also be
	"yes" to indicate no change to the final duration.

	If the sound element applies only particular times through a
	repeat, the time-only attribute indicates which times to apply
	the sound element. The value is a comma-separated list of
	positive integers arranged in ascending order, indicating
	which times through the repeated section that the element
	applies.

	Pizzicato in a sound element effects all following notes.
	Yes indicates pizzicato, no indicates arco.

	The pan and elevation attributes are deprecated in
	Version 2.0. The pan and elevation elements in
	the midi-instrument element should be used instead.
	The meaning of the pan and elevation attributes is
	the same as for the pan and elevation elements. If
	both are present, the mid-instrument elements take
	priority.

	The damper-pedal, soft-pedal, and sostenuto-pedal
	attributes effect playback of the three common piano
	pedals and their MIDI controller equivalents. The yes
	value indicates the pedal is depressed; no indicates
	the pedal is released. A numeric value from 0 to 100
	may also be used for half pedaling. This value is the
	percentage that the pedal is depressed. A value of 0 is
	equivalent to no, and a value of 100 is equivalent to yes.

	MIDI devices, MIDI instruments, and playback techniques are
	changed using the midi-device, midi-instrument, and play
	elements defined in the common.mod file. When there are
	multiple instances of these elements, they should be grouped
	together by instrument using the id attribute values.

	The offset element is used to indicate that the sound takes
	place offset from the current score position. If the sound
	element is a child of a direction element, the sound offset
	element overrides the direction offset element if both
	elements are present. Note that the offset reflects the
	intended musical position for the change in sound. It
	should not be used to compensate for latency issues in
	particular hardware configurations.
-->
<!ELEMENT sound ((midi-device?, midi-instrument?, play?)*,
	offset?)>
<!ATTLIST sound
    tempo CDATA #IMPLIED
    dynamics CDATA #IMPLIED
    dacapo %yes-no; #IMPLIED
    segno CDATA #IMPLIED
    dalsegno CDATA #IMPLIED
    coda CDATA #IMPLIED
    tocoda CDATA #IMPLIED
    divisions CDATA #IMPLIED
    forward-repeat %yes-no; #IMPLIED
    fine CDATA #IMPLIED
    %time-only;
    pizzicato %yes-no; #IMPLIED
    pan CDATA #IMPLIED
    elevation CDATA #IMPLIED
    damper-pedal %yes-no-number; #IMPLIED
    soft-pedal %yes-no-number; #IMPLIED
    sostenuto-pedal %yes-no-number; #IMPLIED
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getSound = function(node, attributes) {

    var attributes = attributes || {};

    // TODO:
    return attributes;
};

/*
<!--
	The trill-sound entity includes attributes used to guide
	the sound of trills, mordents, turns, shakes, and wavy
	lines, based on MuseData sound suggestions. The default
	choices are:

		start-note = "upper"
		trill-step = "whole"
		two-note-turn = "none"
		accelerate = "no"
		beats = "4" (minimum of "2").

	Second-beat and last-beat are percentages for landing on
	the indicated beat, with defaults of 25 and 75 respectively.

	For mordent and inverted-mordent elements, the defaults
	are different:

		The default start-note is "main", not "upper".
		The default for beats is "3", not "4".
		The default for second-beat is "12", not "25".
		The default for last-beat is "24", not "75".
-->
<!ENTITY % trill-sound
	"start-note    (upper | main | below)  #IMPLIED
	 trill-step    (whole | half | unison) #IMPLIED
	 two-note-turn (whole | half | none)   #IMPLIED
	 accelerate    %yes-no; #IMPLIED
	 beats         CDATA    #IMPLIED
	 second-beat   CDATA    #IMPLIED
	 last-beat     CDATA    #IMPLIED">
*/
ScoreLibrary.Score.XMLHelper.prototype.getTrillSound = function(node, attributes) {

    var attributes = attributes || {};

    attributes.start_note =
        this.getAndValidateEnumValue(
            node, 'start-note', ['upper', 'main', 'below'], 'upper');
    attributes.trill_step =
        this.getAndValidateEnumValue(
            node, 'trill-step', ['whole', 'half', 'unison'], 'whole');
    attributes.two_note_turn =
        this.getAndValidateEnumValue(
            node, 'two-note-turn', ['whole', 'half', 'none'], 'none');

    attributes.accelerate =
        this.getYesNoValue(node, 'accelerate', false);

    attributes.beats =
        node.getNumberWithDefault('beats', 4);
    attributes.second_beat =
        node.getNumberWithDefault('second-beat', 25);
    attributes.last_beat =
        node.getNumberWithDefault('last-beat', 75);

    return attributes;
};

/*
<!--
	Technical indications give performance information for
	individual instruments.
-->
<!ELEMENT technical
	((up-bow | down-bow | harmonic | open-string |
	  thumb-position | fingering | pluck | double-tongue |
	  triple-tongue | stopped | snap-pizzicato | fret |
	  string | hammer-on | pull-off | bend | tap | heel |
	  toe | fingernails | hole | arrow | handbell |
	  other-technical)*)>
*/
ScoreLibrary.Score.XMLHelper.prototype.getTechnicalTypes = function() {

    var technical_types = ScoreLibrary.Score.XMLHelper.TechnicalTypes;

    if (technical_types === undefined) {

        technical_types = {

            'up-bow': this.getUpBow,
            'down-bow': this.getDownBow,
            'harmonic': this.getHarmonic,
            'open-string': this.getOpenString,
            'thumb-position': this.getThumbPosition,
            'pluck': this.getPluck,
            'double-tongue': this.getDoubleTongue,
            'triple-tongue': this.getTripleTongue,
            'stopped': this.getStopped,
            'snap-pizzicato': this.getSnapPizzicato,
            'fingering': this.getFingering,
            'fret': this.getFret,
            'string': this.getString,
            'tap': this.getTap,
            'heel': this.getHeel,
            'toe': this.getToe,
            'hammer-on': this.getHammerOn,
            'pull-off': this.getPullOff,
            'bend': this.getBend,
            'fingernails': this.getFingering,
            'hole': null,
            'arrow': null,
            'handbell': null,
            'other-technical': null
        };

        ScoreLibrary.Score.XMLHelper.TechnicalTypes = technical_types;
    }

    return technical_types;
};

ScoreLibrary.Score.XMLHelper.prototype.getTechnical = function(node, attributes) {

    var attributes = attributes || {};

    var technical_types = this.getTechnicalTypes();

    var technical_types_filter =
        ScoreLibrary.Score.XMLHelper.TechnicalTypesFilter;

    if (technical_types_filter === undefined) {

        technical_types_filter = ScoreLibrary.keys(technical_types).join(',');

        ScoreLibrary.Score.XMLHelper.TechnicalTypesFilter = technical_types_filter;
    }

    return this._getMixTypesChildren(
        node, attributes,
        'technical', 'technical',
        technical_types,
        technical_types_filter);
};

/*
<!--
	The up-bow element represents the symbol that is used both
	for up-bowing on bowed instruments, and up-stroke on plucked
	instruments.
-->
<!ELEMENT up-bow EMPTY>
<!ATTLIST up-bow
    %print-style;
    %placement;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getUpBow = function(node, attributes) {

    var attributes = attributes || {};

    this.getPrintStyle(node, attributes);
    this.getPlacement(node, attributes, 'above');

    return attributes;
};

/*
<!--
	The down-bow element represents the symbol that is used both
	for down-bowing on bowed instruments, and down-stroke on
	plucked instruments.
-->
<!ELEMENT down-bow EMPTY>
<!ATTLIST down-bow
    %print-style;
    %placement;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getDownBow =
    ScoreLibrary.Score.XMLHelper.prototype.getUpBow;

/*
<!--
	The harmonic element indicates natural and artificial
	harmonics. Natural harmonics usually notate the base
	pitch rather than the sounding pitch. Allowing the type
	of pitch to be specified, combined with controls for
	appearance/playback differences, allows both the notation
	and the sound to be represented. Artificial harmonics can
	add a notated touching-pitch; the pitch or fret at which
	the string is touched lightly to produce the harmonic.
	Artificial pinch harmonics will usually not notate a
	touching pitch. The attributes for the harmonic element
	refer to the use of the circular harmonic symbol, typically
	but not always used with natural harmonics.
-->
<!ELEMENT harmonic
	((natural | artificial)?,
	 (base-pitch | touching-pitch | sounding-pitch)?)>
<!ATTLIST harmonic
    %print-object;
    %print-style;
    %placement;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getHarmonic = function(node, attributes) {

    var attributes = attributes || {};

    if (node.getNode('natural')) {

        attributes.natural = true;
    }
    else if (node.getNode('artificial')) {

        attributes.artificial = true;
    }

    var base_pitch_node = node.getNode('base-pitch');
    if (base_pitch_node) {

        attributes.base_pitch =
            this.getPitch(base_pitch_node);
    }
    else {

        var touching_pitch_node = node.getNode('touching-pitch');
        if (touching_pitch_node) {

            attributes.touching_pitch =
                this.getPitch(touching_pitch_node);
        }
        else {
            var sounding_pitch_node = node.getNode('sounding-pitch');
            if (sounding_pitch_node) {

                attributes.sounding_pitch =
                    this.getPitch(sounding_pitch_node);
            }
        }
    }

    attributes.print_object =
        this.isPrintObject(node);

    this.getPrintStyle(node, attributes);
    this.getPlacement(node, attributes, 'above');

    return attributes;
};

/*
<!--
	The open-string element represents the zero-shaped
	open string symbol.
-->
<!ELEMENT open-string EMPTY>
<!ATTLIST open-string
    %print-style;
    %placement;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getOpenString =
    ScoreLibrary.Score.XMLHelper.prototype.getUpBow;

/*
<!--
	The thumb-position element represents the thumb position
	symbol. This is a circle with a line, where the line does
	not come within the circle. It is distinct from the snap
	pizzicato symbol, where the line comes inside the circle.
-->
<!ELEMENT thumb-position EMPTY>
<!ATTLIST thumb-position
    %print-style;
    %placement;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getThumbPosition =
    ScoreLibrary.Score.XMLHelper.prototype.getUpBow;

/*
<!--
	The pluck element is used to specify the plucking fingering
	on a fretted instrument, where the fingering element refers
	to the fretting fingering. Typical values are p, i, m, a for
	pulgar/thumb, indicio/index, medio/middle, and anular/ring
	fingers.
-->
<!ELEMENT pluck (#PCDATA)>
<!ATTLIST pluck
    %print-style;
    %placement;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getPluck = function(node, attributes) {

    var attributes = attributes || {};

    attributes.text =
        node.getStringWithDefault(undefined, '');

    this.getPrintStyle(node, attributes);
    this.getPlacement(node, attributes, 'above');

    return attributes;
};

/*
<!--
	The double-tongue element represents the double tongue symbol
	(two dots arranged horizontally).
-->
<!ELEMENT double-tongue EMPTY>
<!ATTLIST double-tongue
    %print-style;
    %placement;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getDoubleTongue =
    ScoreLibrary.Score.XMLHelper.prototype.getUpBow;

/*
<!--
	The triple-tongue element represents the triple tongue symbol
	(three dots arranged horizontally).
-->
<!ELEMENT triple-tongue EMPTY>
<!ATTLIST triple-tongue
    %print-style;
    %placement;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getTripleTongue =
    ScoreLibrary.Score.XMLHelper.prototype.getUpBow;

/*
<!--
	The stopped element represents the stopped symbol, which looks
	like a plus sign.
-->
<!ELEMENT stopped EMPTY>
<!ATTLIST stopped
    %print-style;
    %placement;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getStopped =
    ScoreLibrary.Score.XMLHelper.prototype.getUpBow;

/*
<!--
	The snap-pizzicato element represents the snap pizzicato
	symbol. This is a circle with a line, where the line comes
	inside the circle. It is distinct from the thumb-position
	symbol, where the line does not come inside the circle.
-->
<!ELEMENT snap-pizzicato EMPTY>
<!ATTLIST snap-pizzicato
    %print-style;
    %placement;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getSnapPizzicato =
    ScoreLibrary.Score.XMLHelper.prototype.getUpBow;

/*
<!--
	The fret, string, and fingering elements can be used either
	in a technical element for a note or in a frame element as
	part of a chord symbol.
-->

<!--
	Fingering is typically indicated 1,2,3,4,5. Multiple
	fingerings may be given, typically to substitute
	fingerings in the middle of a note. The substitution
	and alternate values are "no" if the attribute is
	not present. For guitar and other fretted instruments,
	the fingering element represents the fretting finger;
	the pluck element represents the plucking finger.
-->
<!ELEMENT fingering (#PCDATA)>
<!ATTLIST fingering
    substitution %yes-no; #IMPLIED
    alternate %yes-no; #IMPLIED
    %print-style;
    %placement;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getFingering = function(node, attributes) {

    var attributes = attributes || {};

    attributes.text =
        node.getStringWithDefault(undefined, '');

    attributes.substitution =
        this.getYesNoValue(node, 'substitution', false);
    attributes.alternate =
        this.getYesNoValue(node, 'alternate', false);

    this.getPrintStyle(node, attributes);
    this.getPlacement(node, attributes, 'above');

    return attributes;
};

/*
<!--
	Fret and string are used with tablature notation and chord
	symbols. Fret numbers start with 0 for an open string and
	1 for the first fret. String numbers start with 1 for the
	highest string. The string element can also be used in
	regular notation.
-->
<!ELEMENT fret (#PCDATA)>
<!ATTLIST fret
    %font;
    %color;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getFret = function(node, attributes) {

    var attributes = attributes || {};

    attributes.text =
        node.getStringWithDefault(undefined, '');

    this.getFont(node, attributes);
    this.getColor(node, attributes);

    return attributes;
};
/*
<!ELEMENT string (#PCDATA)>
<!ATTLIST string
    %print-style;
    %placement;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getString = function(node, attributes) {

    var attributes = attributes || {};

    attributes.text =
        node.getStringWithDefault(undefined, '');

    this.getPrintStyle(node, attributes);
    this.getPlacement(node, attributes, 'above');

    return attributes;
};

/*
<!--
	The tap element indicates a tap on the fretboard. The
	element content allows specification of the notation;
	+ and T are common choices. If empty, the display is
	application-specific.
-->
<!ELEMENT tap (#PCDATA)>
<!ATTLIST tap
    %print-style;
    %placement;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getTap = function(node, attributes) {

    var attributes = attributes || {};

    attributes.text =
        node.getStringWithDefault(undefined, 'T');

    this.getPrintStyle(node, attributes);
    this.getPlacement(node, attributes, 'above');

    return attributes;
};

/*
<!--
	The heel and toe element are used with organ pedals. The
	substitution value is "no" if the attribute is not present.
-->
<!ELEMENT heel EMPTY>
<!ATTLIST heel
    substitution %yes-no; #IMPLIED
    %print-style;
    %placement;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getHeel = function(node, attributes) {

    var attributes = attributes || {};

    attributes.substitution =
        this.getYesNoValue(node, 'substitution', false);

    this.getPrintStyle(node, attributes);
    this.getPlacement(node, attributes, 'above');

    return attributes;
};

/*
<!ELEMENT toe EMPTY>
<!ATTLIST toe
    substitution %yes-no; #IMPLIED
    %print-style;
    %placement;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getToe =
    ScoreLibrary.Score.XMLHelper.prototype.getHeel;

/*
<!--
	The hammer-on and pull-off elements are used in guitar
	and fretted instrument notation. Since a single slur
	can be marked over many notes, the hammer-on and pull-off
	elements are separate so the individual pair of notes can
	be specified. The element content can be used to specify
	how the hammer-on or pull-off should be notated. An empty
	element leaves this choice up to the application.
-->

<!ELEMENT hammer-on (#PCDATA)>
<!ATTLIST hammer-on
    type %start-stop; #REQUIRED
    number %number-level; "1"
    %print-style;
    %placement;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getHarmmerPull = function(node, attributes) {

    attributes.type =
        this.checkRequiredValue(
            node, 'type',
            this.getStartStopValue(
                node, 'type', undefined));

    attributes.number =
        this.getNumberLevelValue(
            node, 'number');

    this.getPrintStyle(node, attributes);
    this.getPlacement(node, attributes, 'above');

    return attributes;
};

ScoreLibrary.Score.XMLHelper.prototype.getHammerOn = function(node, attributes) {

    var attributes = attributes || {};

    attributes.text =
        node.getStringWithDefault(
            undefined, 'H');

    this.getHarmmerPull(node, attributes);

    return attributes;
};

/*
<!ELEMENT pull-off (#PCDATA)>
<!ATTLIST pull-off
    type %start-stop; #REQUIRED
    number %number-level; "1"
    %print-style;
    %placement;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getPullOff = function(node, attributes) {

    var attributes = attributes || {};

    attributes.text =
        node.getStringWithDefault(
            undefined, 'P');

    this.getHarmmerPull(node, attributes);

    return attributes;
};

/*
<!--
	The bend element is used in guitar and tablature. The
	bend-alter element indicates the number of steps in the
	bend, similar to the alter element. As with the alter
	element, numbers like 0.5 can be used to indicate
	microtones. Negative numbers indicate pre-bends or
	releases; the pre-bend and release elements are used
	to distinguish what is intended. A with-bar element
	indicates that the bend is to be done at the bridge
	with a whammy or vibrato bar. The content of the
	element indicates how this should be notated.
-->
<!ELEMENT bend
	(bend-alter, (pre-bend | release)?, with-bar?)>
<!ATTLIST bend
    %print-style;
    %bend-sound;
>
<!ELEMENT bend-alter (#PCDATA)>
<!ELEMENT pre-bend EMPTY>
<!ELEMENT release EMPTY>
<!ELEMENT with-bar (#PCDATA)>
<!ATTLIST with-bar
    %print-style;
    %placement;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getWithBar = function(node, attributes) {

    var attributes = attributes || {};

    attributes.text =
        node.getStringWithDefault(undefined, '');

    this.getPrintStyle(node, attributes);
    this.getPlacement(node, attributes);

    return attributes;
};

ScoreLibrary.Score.XMLHelper.prototype.getBend = function(node, attributes) {

    var attributes = attributes || {};

    // TODO: text
    attributes.bend_alter =
        node.getNumberWithDefault('bend-alter', 1);

    if (node.getNode('pre-bend')) {

        attributes.pre_bend = true;
    }
    else if (node.getNode('release')) {

        attributes.release = true;
    }
    // TODO: with-bar

    return attributes;
};

ScoreLibrary.Score.XMLHelper.prototype.getGlissando = function(node, attributes) {

    var attributes = attributes || {};

    attributes.type =
        this.checkRequiredValue(
            node, 'type',
            this.getStartStopValue(node, 'type'));

    attributes.text =
        node.getStringWithDefault(
            undefined, '');

    attributes.number =
        this.getNumberLevelValue(node, 'number');

    attributes.line_type =
        this.getLineTypeValue(node, 'line-type', 'wavy');

    if (attributes.line_type === 'dashed') {

        this.getDashedFormatting(node, attributes);
    }

    this.getPrintStyle(node, attributes);

    return attributes;
};

ScoreLibrary.Score.XMLHelper.prototype.getSlide = function(node, attributes) {

    var attributes = attributes || {};

    attributes.type =
        this.checkRequiredValue(
            node, 'type',
            this.getStartStopValue(node, 'type'));

    attributes.text =
        node.getStringWithDefault(
            undefined, '');

    attributes.number =
        this.getNumberLevelValue(node, 'number');

    attributes.line_type =
        this.getLineTypeValue(node, 'line-type', 'solid');

    if (attributes.line_type === 'dashed') {

        this.getDashedFormatting(node, attributes);
    }

    this.getPrintStyle(node, attributes);
    // this.getBendSound(node);

    return attributes;
};

/*
<!--
	A root is a pitch name like C, D, E, where a function
	is an indication like I, II, III. Root is generally
	used with pop chord symbols, function with classical
	functional harmony. It is an either/or choice to avoid
	data inconsistency. Function requires that the key be
	specified in the encoding.

	The root element has a root-step and optional root-alter
	similar to the step and alter elements in a pitch, but
	renamed to distinguish the different musical meanings.
	The root-step text element indicates how the root should
	appear in a score if not using the element contents.
	In some chord styles, this will include the root-alter
	information as well. In that case, the print-object
	attribute of the root-alter element can be set to no.
	The root-alter location attribute indicates whether
	the alteration should appear to the left or the right
	of the root-step; it is right by default.
-->
<!ELEMENT root (root-step, root-alter?)>
<!ELEMENT root-step (#PCDATA)>
<!ATTLIST root-step
    text CDATA #IMPLIED
    %print-style;
>
<!ELEMENT root-alter (#PCDATA)>
<!ATTLIST root-alter
    %print-object;
    %print-style;
    location %left-right; #IMPLIED
>
<!ELEMENT function (#PCDATA)>
<!ATTLIST function
    %print-style;
>
 */
ScoreLibrary.Score.XMLHelper.prototype.getRootStep = function(node, attributes) {

    var attributes = attributes || {};

    attributes.value = this.getStepValue(node, undefined);
    attributes.text = node.getStringWithDefault('text', '');

    this.getPrintStyle(node, attributes);

    return attributes;
};

ScoreLibrary.Score.XMLHelper.prototype.getRootAlter = function(node, attributes) {

    var attributes = attributes || {};

    attributes.value = node.getNumberWithDefault(undefined, 0);
    attributes.print_object = this.isPrintObject(node);

    this.getPrintStyle(node, attributes);
    attributes.location = this.getLeftRightValue(node, 'location', 'right');

    return attributes;
};

ScoreLibrary.Score.XMLHelper.prototype.getHarmonyRoot = function(node, attributes) {

    var attributes = attributes || {};

    var root_step_node = node.getNode('root-step');
    if (root_step_node) {

        attributes.step = this.getRootStep(root_step_node);
    }

    var root_alter_node = node.getNode('root-alter');
    if (root_alter_node) {

        attributes.alter = this.getRootAlter(root_alter_node);
    }

    return attributes;
};

/*
<!ELEMENT function (#PCDATA)>
<!ATTLIST function
    %print-style;
>
 */
ScoreLibrary.Score.XMLHelper.prototype.getHarmonyFunc = function(node, attributes) {

    var attributes = attributes || {};

    attributes.text = node.getStringWithDefault(undefined, '');

    this.getPrintStyle(node, attributes);

    return attributes;
};

/*
<!--
	Kind indicates the type of chord. Degree elements
	can then add, subtract, or alter from these
	starting points. Values include:

	Triads:
	    major (major third, perfect fifth)
	    minor (minor third, perfect fifth)
	    augmented (major third, augmented fifth)
	    diminished (minor third, diminished fifth)
	Sevenths:
	    dominant (major triad, minor seventh)
	    major-seventh (major triad, major seventh)
	    minor-seventh (minor triad, minor seventh)
	    diminished-seventh
	        (diminished triad, diminished seventh)
	    augmented-seventh
	        (augmented triad, minor seventh)
	    half-diminished
	        (diminished triad, minor seventh)
	    major-minor
	        (minor triad, major seventh)
	Sixths:
	    major-sixth (major triad, added sixth)
	    minor-sixth (minor triad, added sixth)
	Ninths:
	    dominant-ninth (dominant-seventh, major ninth)
	    major-ninth (major-seventh, major ninth)
	    minor-ninth (minor-seventh, major ninth)
	11ths (usually as the basis for alteration):
	    dominant-11th (dominant-ninth, perfect 11th)
	    major-11th (major-ninth, perfect 11th)
	    minor-11th (minor-ninth, perfect 11th)
	13ths (usually as the basis for alteration):
	    dominant-13th (dominant-11th, major 13th)
	    major-13th (major-11th, major 13th)
	    minor-13th (minor-11th, major 13th)
	Suspended:
	    suspended-second (major second, perfect fifth)
	    suspended-fourth (perfect fourth, perfect fifth)
	Functional sixths:
	    Neapolitan
	    Italian
	    French
	    German
	Other:
	    pedal (pedal-point bass)
	    power (perfect fifth)
	    Tristan

	The "other" kind is used when the harmony is entirely
	composed of add elements. The "none" kind is used to
	explicitly encode absence of chords or functional
	harmony.

	The attributes are used to indicate the formatting
	of the symbol. Since the kind element is the constant
	in all the harmony-chord entities that can make up
	a polychord, many formatting attributes are here.

	The use-symbols attribute is yes if the kind should be
	represented when possible with harmony symbols rather
	than letters and numbers. These symbols include:

	    major: a triangle, like Unicode 25B3
	    minor: -, like Unicode 002D
	    augmented: +, like Unicode 002B
	    diminished: °, like Unicode 00B0
	    half-diminished: ø, like Unicode 00F8

	For the major-minor kind, only the minor symbol is used when
	use-symbols is yes. The major symbol is set using the symbol
	attribute in the degree-value element. The corresponding
	degree-alter value will usually be 0 in this case.

	The text attribute describes how the kind should be spelled
	in a score. If use-symbols is yes, the value of the text
	attribute follows the symbol. The stack-degrees attribute
	is yes if the degree elements should be stacked above each
	other. The parentheses-degrees attribute is yes if all the
	degrees should be in parentheses. The bracket-degrees
	attribute is yes if all the degrees should be in a bracket.
	If not specified, these values are implementation-specific.
	The alignment attributes are for the entire harmony-chord
	entity of which this kind element is a part.
-->
<!ELEMENT kind (#PCDATA)>
<!ATTLIST kind
    use-symbols          %yes-no;   #IMPLIED
    text                 CDATA      #IMPLIED
    stack-degrees        %yes-no;   #IMPLIED
    parentheses-degrees  %yes-no;   #IMPLIED
    bracket-degrees      %yes-no;   #IMPLIED
    %print-style;
    %halign;
    %valign;
>
 */
ScoreLibrary.Score.XMLHelper.HarmonyKinds =
    ScoreLibrary.Score.XMLHelper.HarmonyKinds || [
//	Triads:
	'major', // (major third, perfect fifth)
	'minor', // (minor third, perfect fifth)
	'augmented', // (major third, augmented fifth)
	'diminished', // (minor third, diminished fifth)
//	Sevenths:
	'dominant', // (major triad, minor seventh)
	'major-seventh', // (major triad, major seventh)
	'minor-seventh', // (minor triad, minor seventh)
	'diminished-seventh', // (diminished triad, diminished seventh)
	'augmented-seventh', // (augmented triad, minor seventh)
	'half-diminished', // (diminished triad, minor seventh)
	'major-minor', // (minor triad, major seventh)
//	Sixths:
	'major-sixth', // (major triad, added sixth)
	'minor-sixth', // (minor triad, added sixth)
//	Ninths:
	'dominant-ninth', // (dominant-seventh, major ninth)
	'major-ninth', // (major-seventh, major ninth)
	'minor-ninth', // (minor-seventh, major ninth)
//	11ths (usually as the basis for alteration):
	'dominant-11th', // (dominant-ninth, perfect 11th)
	'major-11th', // (major-ninth, perfect 11th)
	'minor-11th', // (minor-ninth, perfect 11th)
//	13ths (usually as the basis for alteration):
	'dominant-13th', // (dominant-11th, major 13th)
	'major-13th', // (major-11th, major 13th)
	'minor-13th', // (minor-11th, major 13th)
//	Suspended:
	'suspended-second', // (major second, perfect fifth)
	'suspended-fourth', // (perfect fourth, perfect fifth)
//	Functional sixths:
	'Neapolitan',
	'Italian',
	'French',
	'German',
//	Other:
	'pedal', // (pedal-point bass)
	'power', // (perfect fifth)
	'Tristan',
        'other',
        'none'
    ];

ScoreLibrary.Score.XMLHelper.prototype.getHarmonyKind = function(node, attributes) {

    var attributes = attributes || {};

    attributes.kind =
        this.getAndValidateEnumValue(
            node, undefined, ScoreLibrary.Score.XMLHelper.HarmonyKinds, 'none');

    attributes.use_symbols =
        this.getYesNoValue(node, 'use-symbols', true);

    attributes.text = node.getStringWithDefault('text', '');

    attributes.stack_degrees =
        this.getYesNoValue(node, 'stack-degrees', false);
    attributes.parentheses_degrees =
        this.getYesNoValue(node, 'parentheses-degrees', false);
    attributes.bracket_degrees =
        this.getYesNoValue(node, 'bracket-degrees', false);

    this.getPrintStyle(node, attributes);
    this.getHAlign(node, attributes);
    this.getVAlign(node, attributes);

    return attributes;
};

/*
<!--
	Inversion is a number indicating which inversion is used:
	0 for root position, 1 for first inversion, etc.
-->
<!ELEMENT inversion (#PCDATA)>
<!ATTLIST inversion
    %print-style;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getHarmonyInversion = function(node, attributes) {

    var attributes = attributes || {};

    attributes.inversion =
        node.getNumberWithDefault(undefined, 0);
    this.getPrintStyle(node, attributes);

    return attributes;
};

/*
<!--
	Bass is used to indicate a bass note in popular music
	chord symbols, e.g. G/C. It is generally not used in
	functional harmony, as inversion is generally not used
	in pop chord symbols. As with root, it is divided into
	step and alter elements, similar to pitches. The attributes
	for bass-step and bass-alter work the same way as
	the corresponding attributes for root-step and root-alter.
-->
<!ELEMENT bass (bass-step, bass-alter?)>
<!ELEMENT bass-step (#PCDATA)>
<!ATTLIST bass-step
    text CDATA #IMPLIED
    %print-style;
>
<!ELEMENT bass-alter (#PCDATA)>
<!ATTLIST bass-alter
    %print-object;
    %print-style;
    location (left | right) #IMPLIED
>
 */
ScoreLibrary.Score.XMLHelper.prototype.getHarmonyBass = function(node, attributes) {

    var attributes = attributes || {};

    var root_step_node = node.getNode('bass-step');
    if (root_step_node) {

        attributes.step = this.getRootStep(root_step_node);
    }

    var root_alter_node = node.getNode('bass-alter');
    if (root_alter_node) {

        attributes.alter = this.getRootAlter(root_alter_node);
    }

    return attributes;
};

/*
<!--
	The degree element is used to add, alter, or subtract
	individual notes in the chord. The degree-value element
	is a number indicating the degree of the chord (1 for
	the root, 3 for third, etc). The degree-alter element
	is like the alter element in notes: 1 for sharp, -1 for
	flat, etc. The degree-type element can be add, alter, or
	subtract. If the degree-type is alter or subtract, the
	degree-alter is relative to the degree already in the
	chord based on its kind element. If the degree-type is
	add, the degree-alter is relative to a dominant chord
	(major and perfect intervals except for a minor
	seventh). The print-object attribute can be used to
	keep the degree from printing separately when it has
	already taken into account in the text attribute of
	the kind element. The plus-minus attribute is used to
	indicate if plus and minus symbols should be used
	instead of sharp and flat symbols to display the degree
	alteration; it is no by default.

	The degree-value and degree-type text attributes specify
	how the value and type of the degree should be displayed
	in a score. The degree-value symbol attribute indicates
	that a symbol should be used in specifying the degree.
	If the symbol attribute is present, the value of the text
	attribute follows the symbol.

	A harmony of kind "other" can be spelled explicitly by
	using a series of degree elements together with a root.
-->
<!ELEMENT degree (degree-value, degree-alter, degree-type)>
<!ATTLIST degree
    %print-object;
>
<!ELEMENT degree-value (#PCDATA)>
<!ATTLIST degree-value
    symbol (major | minor | augmented |
		diminished | half-diminished) #IMPLIED
    text CDATA #IMPLIED
    %print-style;
>
<!ELEMENT degree-alter (#PCDATA)>
<!ATTLIST degree-alter
    %print-style;
    plus-minus %yes-no; #IMPLIED
>
<!ELEMENT degree-type (#PCDATA)>
<!ATTLIST degree-type
    text CDATA #IMPLIED
    %print-style;
>
 */
ScoreLibrary.Score.XMLHelper.HarmonyDegreeSymbols =
    ScoreLibrary.Score.XMLHelper.HarmonyDegreeSymbols ||
    ['major', 'minor', 'augmented', 'diminished', 'half-diminished'];

ScoreLibrary.Score.XMLHelper.prototype.getHarmonyDegreeValue = function(node, attributes) {

    var attributes = attributes || {};

    attributes.value =
        this.checkRequiredValue(
            node, undefined,
            node.getNumberWithDefault(undefined, undefined));

    attributes.symbol =
        this.getAndValidateEnumValue(
            node, 'symbol', ScoreLibrary.Score.XMLHelper.HarmonyDegreeSymbols, undefined);

    attributes.text = node.getStringWithDefault('text', '');

    this.getPrintStyle(node, attributes);

    return attributes;
};

ScoreLibrary.Score.XMLHelper.prototype.getHarmonyDegreeAlter = function(node, attributes) {

    var attributes = attributes || {};

    attributes.value =
        node.getNumberWithDefault(undefined, 0);

    attributes.plus_minus = this.getYesNoValue(node, 'plus-minus');

    this.getPrintStyle(node, attributes);

    return attributes;
};

ScoreLibrary.Score.XMLHelper.prototype.getHarmonyDegreeType = function(node, attributes) {

    var attributes = attributes || {};

    attributes.value =
        this.checkRequiredValue(
            node, undefined,
            this.getAndValidateEnumValue(
                node, undefined, ['add', 'alter', 'subtract'], undefined));

    attributes.text = node.getStringWithDefault('text', '');

    this.getPrintStyle(node, attributes);

    return attributes;
};

ScoreLibrary.Score.XMLHelper.prototype.getHarmonyDegree = function(node, attributes) {

    var attributes = attributes || {};

    attributes.print_object = this.isPrintObject(node);

    var degree_value_node = node.getNode('degree-value');
    if (degree_value_node) {

        attributes.value = this.getHarmonyDegreeValue(degree_value_node);
    }

    var degree_alter_node = node.getNode('degree-alter');
    if (degree_alter_node) {

        attributes.alter = this.getHarmonyDegreeAlter(degree_alter_node);
    }

    var degree_type_node = node.getNode('degree-type');
    if (degree_type_node) {

        attributes.type = this.getHarmonyDegreeType(degree_type_node);
    }

    return attributes;
};

/*
<!ENTITY % harmony-chord "((root | function), kind,
	inversion?, bass?, degree*)">
*/
ScoreLibrary.Score.XMLHelper.prototype.getHarmonyChord = function(chord_node, attributes) {

    var attributes = attributes || {};

    if (chord_node.is('root')) {

        attributes.root = this.getHarmonyRoot(chord_node);
    }
    else {

        attributes.func = this.getHarmonyFunc(chord_node);
    }

    var next_nodes = chord_node.getNextUntil('root, function');

    var kind_node = next_nodes.getNode('kind', true);
    if (kind_node) {

        attributes.kind = this.getHarmonyKind(kind_node);
    }

    var inversion_node = next_nodes.getNode('inversion', true);
    if (inversion_node) {

        attributes.inversion = this.getHarmonyInversion(inversion_node);
    }

    var bass_node = next_nodes.getNode('bass', true);
    if (bass_node) {

        attributes.bass = this.getHarmonyBass(bass_node);
    }

    var degree_node = next_nodes.getNode('degree', true);
    if (degree_node) {

        degree_node.forEachNode(
            undefined,
            function(index, degree_node) {

                attributes.degrees =
                    attributes.degrees || [];

                attributes.degrees.push(this.getHarmonyDegree(degree_node));
            }, this);
    }

    return attributes;
};

/*
<!--
	The frame element represents a frame or fretboard diagram
	used together with a chord symbol. The representation is
	based on the NIFF guitar grid with additional information.
	The frame-strings and frame-frets elements give the
	overall size of the frame in vertical lines (strings) and
	horizontal spaces (frets).

	The frame element's unplayed attribute indicates what to
	display above a string that has no associated frame-note
	element. Typical values are x and the empty string. If the
	attribute is not present, the display of the unplayed
	string is application-defined.
-->
<!ELEMENT frame
	(frame-strings, frame-frets, first-fret?, frame-note+)>
<!ATTLIST frame
    %position;
    %color;
    %halign;
    %valign-image;
    height  %tenths;  #IMPLIED
    width   %tenths;  #IMPLIED
    unplayed NMTOKEN #IMPLIED
>
<!ELEMENT frame-strings (#PCDATA)>
<!ELEMENT frame-frets (#PCDATA)>

<!--
	The first-fret indicates which fret is shown in the top
	space of the frame; it is fret 1 if the element is not
	present. The optional text attribute indicates how this
	is represented in the fret diagram, while the location
	attribute indicates whether the text appears to the left
	or right of the frame.
-->
<!ELEMENT first-fret (#PCDATA)>
<!ATTLIST first-fret
    text CDATA #IMPLIED
    location %left-right; #IMPLIED
>

<!--
	The frame-note element represents each note included in
	the frame. The definitions for string, fret, and fingering
	are found in the common.mod file. An open string will
	have a fret value of 0, while a muted string will not be
	associated with a frame-note element.
-->
<!ELEMENT frame-note (string, fret, fingering?, barre?)>

<!--
	The barre element indicates placing a finger over
	multiple strings on a single fret. The type is "start"
	for the lowest pitched string (e.g., the string with
	the highest MusicXML number) and is "stop" for the
	highest pitched string.
-->
<!ELEMENT barre EMPTY>
<!ATTLIST barre
    type %start-stop; #REQUIRED
    %color;
>
*/
ScoreLibrary.Score.XMLHelper.prototype.getBarre = function(node, attributes) {

    var attributes = attributes || {};

    attributes.type =
        this.checkRequiredValue(
            node, 'type',
            this.getStartStopValue(node, 'type', undefined));

    this.getColor(node, attributes);

    return attributes;
};

ScoreLibrary.Score.XMLHelper.prototype.getHarmonyFrameNote = function(node, attributes) {

    var attributes = attributes || {};

    var string_node = node.getNode('string');
    if (string_node) {

        attributes.string = this.getString(string_node);
    }

    var fret_node = node.getNode('fret');
    if (fret_node) {

        attributes.fret = this.getFret(fret_node);
    }

    var fingering_node = node.getNode('fingering');
    if (fingering_node) {

        attributes.fingering = this.getFingering(fingering_node);
    }

    var barre_node = node.getNode('barre');
    if (barre_node) {

        attributes.barre = this.getBarre(barre_node);
    }

    return attributes;
};

ScoreLibrary.Score.XMLHelper.prototype.getHarmonyFrame = function(node, attributes) {

    var attributes = attributes || {};

    this.getPosition(node, attributes);
    this.getColor(node, attributes);
    this.getHAlign(node, attributes);
    this.getVAlignImage(node, attributes);

    attributes.height = node.getNumber('height', undefined);
    attributes.width = node.getNumber('width', undefined);
    attributes.unplayed = node.getStringWithDefault('unplayed', 'x');

    attributes.strings =
        this.checkRequiredValue(
            node, 'frame-strings',
            node.getNumber('frame-strings', undefined));

    attributes.frets =
        this.checkRequiredValue(
            node, 'frame-frets',
            node.getNumber('frame-frets', undefined));

    attributes.first_fret = 1;

    var first_fret_node = node.getNode('first-fret');
    if (first_fret_node) {

        attributes.first_fret =
            first_fret_node.getNumberWithDefault(undefined, 1);
        attributes.first_fret_text =
            first_fret_node.getStringWithDefault('text', '');
        attributes.first_fret_loc =
            this.getLeftRightValue(first_fret_node, 'location', 'right');
    }

    node.forEachNode(
        'frame-note',
        function(index, frame_note_node) {

            attributes.frame_notes =
                attributes.frame_notes || [];

            attributes.frame_notes.push(
                this.getHarmonyFrameNote(frame_note_node));
        }, this);

    return attributes;
};

/*
<!-- Harmony -->

<!--
	The harmony elements are based on Humdrum's **harm
	encoding, extended to support chord symbols in popular
	music as well as functional harmony analysis in classical
	music.

	If there are alternate harmonies possible, this can be
	specified using multiple harmony elements differentiated
	by type. Explicit harmonies have all note present in the
	music; implied have some notes missing but implied;
	alternate represents alternate analyses.

	The harmony object may be used for analysis or for
	chord symbols. The print-object attribute controls
	whether or not anything is printed due to the harmony
	element. The print-frame attribute controls printing
	of a frame or fretboard diagram. The print-style entity
	sets the default for the harmony, but individual elements
	can override this with their own print-style values.

	A harmony element can contain many stacked chords (e.g.
	V of II). A sequence of harmony-chord entities is used
	for this type of secondary function, where V of II would
	be represented by a harmony-chord with a V function
	followed by a harmony-chord with a II function.

<!ELEMENT harmony ((%harmony-chord;)+, frame?,
	offset?, %editorial;, staff?)>
<!ATTLIST harmony
    type (explicit | implied | alternate) #IMPLIED
    %print-object;
    print-frame  %yes-no; #IMPLIED
    %print-style;
    %placement;
>

-->*/
ScoreLibrary.Score.XMLHelper.prototype.getHarmony = function(node, attributes) {

    var attributes = attributes || {};

    attributes.type =
        this.getAndValidateEnumValue(
            node, 'type', ['explicit', 'implied', 'alternate'], 'explicit');

    attributes.print_object = this.isPrintObject(node);
    attributes.print_frame = this.getYesNoValue(node, 'print-frame', true);

    this.getPrintStyle(node, attributes);
    this.getPlacement(node, attributes, 'above');

    node.forEachNode(
        'root, function',
        function(index, chord_node) {

            attributes.chords = attributes.chords || [];

            attributes.chords.push(this.getHarmonyChord(chord_node));
        }, this);

    var frame_node = node.getNode('frame');
    if (frame_node) {

        attributes.frame = this.getHarmonyFrame(frame_node);
    }

    var offset_node = node.getNode('offset');
    if (offset_node) {

        attributes.offset = this.getOffset(offset_node);
    }

    this.getEditorial(node, attributes);
    this.getStaffNumber(node, attributes);

    return attributes;
};

ScoreLibrary.Score.XMLHelper.prototype.getRootFile =
    function(node, attributes) {

        var attributes = attributes || {};

        attributes.full_path =
            this.checkRequiredValue(
                node, 'full-path',
                node.getStringWithDefault('full-path', undefined));

        attributes.media_type =
            node.getStringWithDefault(
                'media-type', 'application/vnd.recordare.musicxml+xml');

        return attributes;
    };

ScoreLibrary.Score.XMLHelper.prototype.getMXLContainer =
    function(node, attributes) {

        var attributes = attributes || {};

        var rootfiles_node = node.getNode('rootfiles');
        if (rootfiles_node) {

            rootfiles_node.forEachNode(
                'rootfile', function(index, rootfile_node) {

                    attributes.root_files = attributes.root_files || [];
                    attributes.root_files.push(this.getRootFile(rootfile_node));
                }, this);
        }

        return attributes;
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
