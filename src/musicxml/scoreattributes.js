goog.provide('ScoreLibrary.Score.Attributes');
goog.provide('ScoreLibrary.Score.PartSymbol');
goog.require('ScoreLibrary.Score');
goog.require('ScoreLibrary.Score.Clef');
goog.require('ScoreLibrary.Score.DataElement');
goog.require('ScoreLibrary.Score.PartGroup');
goog.require('ScoreLibrary.Score.Staff');
goog.require('ScoreLibrary.Score.XMLHelper');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Score.DataElement}
 */
ScoreLibrary.Score.Attributes = function(owner, attributes_node) {

    var supperclass = ScoreLibrary.Score.Attributes.supperclass;

    supperclass.constructor.call(
        this, owner, attributes_node,
        ScoreLibrary.Score.Attributes.ChildTypes);

    var xml_helper = ScoreLibrary.Score.XMLHelper.getInstance();

    xml_helper.getScoreAttributes(this, this);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.Attributes,
    ScoreLibrary.Score.DataElement);

/**
 * @const
 */
ScoreLibrary.Score.Attributes.ChildTypes = [

    'part-symbol', 'staff-details', 'clef', 'key', 'time'
];

ScoreLibrary.Score.Attributes.prototype.toString = function() {

    return 'Score.Attributes';
};

ScoreLibrary.Score.Attributes.prototype.createRenderer =
    function(glyph_factory) {

        return null;
    };

ScoreLibrary.Score.Attributes.prototype.getDuration = function() {

    return 0;
};

ScoreLibrary.Score.Attributes.prototype.getGcdDuration = function() {

    return this.getDuration();
};

ScoreLibrary.Score.Attributes.prototype.getDivisions = function() {

    return this.divisions;
};

/**
 * @constructor
 * @extends {ScoreLibrary.Score.PartGroup}
 */
ScoreLibrary.Score.PartSymbol = function(owner, part_symbol_node) {

    var supperclass = ScoreLibrary.Score.PartSymbol.supperclass;

    supperclass.constructor.call(
        this, owner, part_symbol_node);

    if (part_symbol_node && this.is('part-symbol')) {

        var xml_helper = ScoreLibrary.Score.XMLHelper.getInstance();

        xml_helper.getPartSymbol(this, this);
    }

    this.group_symbol = this.symbol;
    this.top_staff = this.top_staff || 1;
    this.bottom_staff = this.bottom_staff ||
        owner.getTunnelStates().getNumberOfStaves();
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.PartSymbol,
    ScoreLibrary.Score.PartGroup);

ScoreLibrary.Score.PartSymbol.prototype.toString = function() {

    return 'Score.PartSymbol';
};

ScoreLibrary.Score.Attributes.prototype.getPartSymbol = function() {

    return this['part_symbol'];
};

ScoreLibrary.Score.Attributes.prototype.initAttribute =
    function(child_element) {

        var prop = undefined;

        if (ScoreLibrary.Score.PartSymbol.prototype.isPrototypeOf(
            child_element)) {

            prop = 'part_symbol';
        }
        if (ScoreLibrary.Score.Staff.prototype.isPrototypeOf(child_element)) {

            prop = 'staves';
        }
        if (ScoreLibrary.Score.Clef.prototype.isPrototypeOf(child_element)) {

            prop = 'clefs';
        }
        if (ScoreLibrary.Score.Time.prototype.isPrototypeOf(child_element)) {

            prop = 'times';
        }
        if (ScoreLibrary.Score.Key.prototype.isPrototypeOf(child_element)) {

            prop = 'keys';
        }

        if (prop && prop === 'part_symbol') {

            this[prop] = child_element;
        }
        else if (prop &&
                 child_element.fitAllStaves()) {

            for (var staff_number = 1;
                 staff_number <= this.getNumberOfStaves();
                 ++staff_number) {

                var cloned_element = child_element.clone();

                cloned_element.number = staff_number;

                this[prop] = this[prop] || [];
                this[prop].push(cloned_element);
            }
        }
        else if (prop &&
                 (child_element.number >= 1 &&
                  child_element.number <= this.getNumberOfStaves())) {

            this[prop] = this[prop] || [];
            this[prop][child_element.number - 1] = child_element;
        }
    };

ScoreLibrary.Score.Attributes.prototype.forEachChildInitAttributes =
    function(states) {

        var num_of_staves =
            (this['staves'] ?
             (typeof this['staves'] === 'number' ?
              this['staves'] : this.getNumberOfStaves()) :
             (states ? states.getNumberOfStaves() : 1));

        // !NOTE: array of size staves.
        this['staves'] = new Array(num_of_staves);

        var child_iterator = ScoreLibrary.Score.ElementIterFactory.create(this);

        while (child_iterator.hasNext()) {

            var child_element = child_iterator.next();

            this.initAttribute(child_element);
        }
    };

ScoreLibrary.Score.Attributes.prototype.getNumberOfStaves = function() {

    return this['staves'].length;
};

ScoreLibrary.Score.Attributes.prototype.getAttribute =
    function(prop, staff_number) {

        goog.asserts.assert(
                /(staves|clefs|times|keys)/.test(prop),
            'ScoreLibrary.Score.Attributes.getAttribute(): invalid argument!');

        var attrs = this[prop];

        return (attrs ? attrs[staff_number - 1] : undefined);
    };

ScoreLibrary.Score.Attributes.prototype.getAllAttributes = function() {

    return ['staves', 'clefs', 'times', 'keys'].map(
        function(prop) {

            return this[prop];
        }, this).reduce(
            function(attributes1, attributes2) {

                return attributes1.concat(attributes2);
            }, []).filter(function(attribute) {

                return (attribute !== undefined);
            });
};

ScoreLibrary.Score.Attributes.prototype.getStaffByNumber =
    function(staff_number) {

        return this.getAttribute('staves', staff_number);
    };

ScoreLibrary.Score.Attributes.prototype.getClefByNumber =
    function(staff_number) {

        return this.getAttribute('clefs', staff_number);
    };

ScoreLibrary.Score.Attributes.prototype.getTimeByNumber =
    function(staff_number) {

        return this.getAttribute('times', staff_number);
    };

ScoreLibrary.Score.Attributes.prototype.getKeyByNumber =
    function(staff_number) {

        return this.getAttribute('keys', staff_number);
    };

ScoreLibrary.Score.Attributes.prototype.getSpacingBetweenStaves =
    function(staff_number) {

        return ScoreLibrary.Score.Staff.Constants.spaceBtwStaves;
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
