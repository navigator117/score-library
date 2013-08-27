goog.provide('ScoreLibrary.Score.Part');
goog.require('ScoreLibrary.Score');
goog.require('ScoreLibrary.Score.Element');
goog.require('ScoreLibrary.Score.XMLHelper');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Score.Element}
 */
ScoreLibrary.Score.Part = function(owner, part_node) {

    var supperclass = ScoreLibrary.Score.Part.supperclass;

    supperclass.constructor.call(
        this, owner, part_node,
        ScoreLibrary.Score.Part.ChildTypes);

    var xml_helper = ScoreLibrary.Score.XMLHelper.getInstance();

    xml_helper.getScorePart(this, this);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.Part,
    ScoreLibrary.Score.Element);

/**
 * @const
 */
ScoreLibrary.Score.Part.ChildTypes = ['measure'];

ScoreLibrary.Score.Part.prototype.toString = function() {

    return 'ScorePart';
};

ScoreLibrary.Score.Part.prototype.enfoldMeasureAsMultiRestIf =
    function(plain_element, plain_iterator, parent_element, element_factory) {

        var num_of_multi_rest = plain_element.getNumberOfMultiRest();
        while (--num_of_multi_rest > 0) {

            plain_iterator.nextPlainElement();
        }

        return this.defaultEnfolder(plain_element);
    };

ScoreLibrary.Score.Part.prototype.getEnfolders = function() {

    var enfolders = ScoreLibrary.Score.Part.enfolders;
    if (enfolders === undefined) {

        enfolders = [
            this.enfoldMeasureAsMultiRestIf
        ];

        ScoreLibrary.Score.Part.enfolders = enfolders;
    }

    return enfolders;
};

ScoreLibrary.Score.Part.prototype.createRenderer = function(context) {

    return null;
};

ScoreLibrary.Score.Part.prototype.copyLabelsFromListItem = function(item) {

    this.part_name = item.part_name;
    this.part_name_display = item.part_name_display;
    this.part_abbreviation = item.part_abbreviation;
    this.part_abbreviation_display = item.part_abbreviation_display;
};

ScoreLibrary.Score.Part.prototype.getName = function() {

    return (this.part_name_display ?
            this.part_name_display : this.part_name);
};

ScoreLibrary.Score.Part.prototype.getAbbrev = function() {

    return (this.part_abbreviation_display ?
            this.part_abbreviation_display :
            (this.part_abbreviation ?
             this.part_abbreviation : this.getName()));
};

ScoreLibrary.Score.Part.prototype.getElementTunnel = function() {

    var tunnel = this.tunnel;
    if (tunnel === undefined) {

        tunnel = new ScoreLibrary.Score.ElementTunnel(this);

        this.tunnel = tunnel;
    }

    return tunnel;
};

ScoreLibrary.Score.Part.prototype.getTunnelStates = function() {
    // !NOTE: Score.Part's tunnel states is 1st measure's tunnel states.

    var tunnel = this.getElementTunnel();

    return tunnel.getFirstTunnelStates(this);
};

ScoreLibrary.Score.Part.prototype.getDivisions = function() {

    var tunnel_states = this.getTunnelStates();

    return tunnel_states.getDivisions();
};

ScoreLibrary.Score.Part.prototype.getPartSymbol = function() {

    var tunnel_states = this.getTunnelStates();

    return tunnel_states.getPartSymbol();
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
