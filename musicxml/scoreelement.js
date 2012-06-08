goog.provide('ScoreLibrary.Score.AttributeElement');
goog.provide('ScoreLibrary.Score.DataElement');
goog.provide('ScoreLibrary.Score.Element');
goog.provide('ScoreLibrary.Score.Unknown');
goog.require('ScoreLibrary.Renderer.Paintable');
goog.require('ScoreLibrary.Score.Node');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Score.Node}
 */
ScoreLibrary.Score.Element = function(owner, element_node, child_types) {

    var supperclass = ScoreLibrary.Score.Element.supperclass;

    supperclass.constructor.call(this, element_node);

    this.owner = owner;
    this.child_types = child_types;
};

/**
 * @enum {number}
 */
ScoreLibrary.Score.Element.Constants = {

    divisionsScale: 1000,
    dummyDuration: 1
};

ScoreLibrary.Score.Element.calcGcdDuration =
    function(duration, divisions, gcd_divisions) {
        // !NOTE: due to javascript's awful binary floating-point.
        goog.asserts.assert(
            divisions > 0 &&
                gcd_divisions > 0 &&
                gcd_divisions >= divisions &&
                gcd_divisions % divisions === 0,
            'ScoreLibrary.Score.Element.calcGcdDuration(): unexpect!');

        return (ScoreLibrary.Score.Element.Constants.divisionsScale *
                duration * gcd_divisions / divisions);
    };

ScoreLibrary.inherited(
    ScoreLibrary.Score.Element,
    ScoreLibrary.Score.Node);

ScoreLibrary.Score.Element.prototype.getChildTypes = function() {

    return this.child_types;
};

ScoreLibrary.Score.Element.prototype.getEnfolders = function() {

    return undefined;
};

ScoreLibrary.Score.Element.prototype.toString = function() {

    return 'Score.Element';
};

ScoreLibrary.Score.Element.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.Element(this.owner, this.node, this.child_types);

    this.attributes && (clone.attributes = this.attributes);

    this.divisions && (clone.divisions = this.divisions);
    this.part_symbol && (clone.part_symbol = this.part_symbol);

    this.tunnel && (clone.tunnel = this.tunnel);
    this.tunnel_states && (clone.tunnel_states = this.tunnel_states);

    this.staff && (clone.staff = this.staff);
    this.clef && (clone.clef = this.clef);
    this.time && (clone.time = this.time);
    this.key && (clone.key = this.key);

    var supperclass = ScoreLibrary.Score.Element.supperclass;

    return supperclass.clone.call(this, clone);
};

/**
 * @enum {number}
 */
ScoreLibrary.Score.Element.LookUpStyle = {

    SameLevel: 1,
    SameParent: 2
};

ScoreLibrary.Score.Element.prototype.followLink = function(backward, style) {

    var link = (backward ? this.prev : this.next);

    if (!link &&
        style === ScoreLibrary.Score.Element.LookUpStyle.SameLevel &&
        this.owner) {

        var owner_link =
            (backward ? this.owner.prev : this.owner.next);

        if (owner_link) {

            var child_elements = owner_link.child_elements;

            link = (child_elements &&
                    child_elements.length > 0 ?
                    (backward ?
                     child_elements[child_elements.length - 1] :
                     child_elements[0]) : link);
        }
    }

    return link;
};

ScoreLibrary.Score.Element.prototype.lookup =
    function(predicate, backward, style) {

        var style = style ||
            ScoreLibrary.Score.Element.LookUpStyle.SameParent;

        var element = this;

        while (element) {

            if (predicate.call(this, element)) {

                break;
            }

            element = element.followLink(backward, style);
        }

        return element;
    };

ScoreLibrary.Score.Element.prototype.getDuration = function() {

    goog.asserts.assert(
        false, 'ScoreLibrary.Score.Element.getDuration(): unimplement!');
};

ScoreLibrary.Score.Element.prototype.getGcdDuration = function() {

    goog.asserts.assert(
        false, 'ScoreLibrary.Score.Element.getGcdDuration(): unimplement!');
};

ScoreLibrary.Score.Element.prototype.getDivisions = function() {

    return (this.divisions ||
            goog.asserts.assert(
                false, 'ScoreLibrary.Score.Element.getDivisions(): unexpect!'));
};

ScoreLibrary.Score.Element.prototype.getPartSymbol = function() {

    return this.part_symbol;
};

ScoreLibrary.Score.Element.prototype.getStaffNumber = function() {

    return this.number;
};

ScoreLibrary.Score.Element.prototype.getElementTunnel = function() {

    return (this.tunnel ||
            goog.asserts.assert(
                false,
                'ScoreLibrary.Score.Element.getElementTunnel(): unexpect!'));
};

ScoreLibrary.Score.Element.prototype.getTunnelStates = function() {

    return (this.tunnel_states ||
            goog.asserts.assert(
                false,
                'ScoreLibrary.Score.Element.getTunnelStates(): unexpect!'));
};

ScoreLibrary.Score.Element.prototype.getStaff = function() {

    return (this.staff ||
            goog.asserts.assert(
                false, 'ScoreLibrary.Score.Element.getStaff(): unexpect!'));
};

ScoreLibrary.Score.Element.prototype.getClef = function() {

    return (this.clef ||
            goog.asserts.assert(
                false, 'ScoreLibrary.Score.Element.getClef(): unexpect!'));
};

ScoreLibrary.Score.Element.prototype.getTime = function() {

    return (this.time ||
            goog.asserts.assert(
                false, 'ScoreLibrary.Score.Element.getTime(): unexpect!'));
};

ScoreLibrary.Score.Element.prototype.getKey = function() {

    return (this.key ||
            goog.asserts.assert(
                false, 'ScoreLibrary.Score.Element.getKey(): unexpect!'));
};

ScoreLibrary.Score.Element.prototype.createRenderer = function(glyph_factory) {

    var renderer = new ScoreLibrary.Renderer.Paintable();

    this.setRenderer(renderer);

    return renderer;
};

ScoreLibrary.Score.Element.prototype.setRenderer = function(renderer) {

    renderer.setModel(this);

    this.renderer = renderer;
};

ScoreLibrary.Score.Element.prototype.getRenderer = function() {

    return this.renderer;
};

ScoreLibrary.Score.Element.prototype.getOwner = function() {

    return this.owner;
};

/**
 * @constructor
 * @extends {ScoreLibrary.Score.Element}
 */
ScoreLibrary.Score.Unknown = function(owner, element_node) {

    var supperclass = ScoreLibrary.Score.Unknown.supperclass;

    supperclass.constructor.call(this, owner, element_node);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.Unknown,
    ScoreLibrary.Score.Element);

ScoreLibrary.Score.Unknown.prototype.toString = function() {

    return 'ScoreUnknown';
};

ScoreLibrary.Score.Unknown.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.Unknown(this.owner, this.node);

    var supperclass = ScoreLibrary.Score.Unknown.supperclass;

    return supperclass.clone.call(this, clone);
};

/**
 * @constructor
 * @extends {ScoreLibrary.Score.Element}
 */
ScoreLibrary.Score.AttributeElement = function(owner, element_node) {

    var supperclass = ScoreLibrary.Score.AttributeElement.supperclass;

    supperclass.constructor.call(this, owner, element_node);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.AttributeElement,
    ScoreLibrary.Score.Element);

ScoreLibrary.Score.AttributeElement.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.AttributeElement(this.owner, this.node);

    var supperclass = ScoreLibrary.Score.AttributeElement.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Score.AttributeElement.prototype.toString = function() {

    return 'Score.AttributeElement';
};

ScoreLibrary.Score.AttributeElement.prototype.getDuration = function() {

    return ScoreLibrary.Score.Element.Constants.dummyDuration;
};

ScoreLibrary.Score.AttributeElement.prototype.getGcdDuration = function() {

    return this.getDuration();
};

ScoreLibrary.Score.AttributeElement.prototype.fitAllStaves = function() {

    return this.number === -1;
};

ScoreLibrary.Score.AttributeElement.prototype.setStaffNumber =
    function(staff_number) {

        this.number = staff_number;
    };

/**
 * @constructor
 * @extends {ScoreLibrary.Score.Element}
 */
ScoreLibrary.Score.DataElement = function(owner, element_node, child_types) {

    var supperclass = ScoreLibrary.Score.DataElement.supperclass;

    supperclass.constructor.call(this, owner, element_node, child_types);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.DataElement,
    ScoreLibrary.Score.Element);

ScoreLibrary.Score.DataElement.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.DataElement(this.owner, this.node);

    var supperclass = ScoreLibrary.Score.DataElement.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Score.DataElement.prototype.toString = function() {

    return 'Score.DataElement';
};

ScoreLibrary.Score.DataElement.prototype.getDuration = function() {

    return this.duration;
};

ScoreLibrary.Score.DataElement.prototype.getGcdDuration = function() {

    return ScoreLibrary.Score.Element.calcGcdDuration(
        this.getDuration(), this.getDivisions(),
        this.getOwner().getGcdDivisions());
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
