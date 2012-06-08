goog.provide('ScoreLibrary.Score.PartList');
goog.require('ScoreLibrary.Renderer.HBoxGlyph');
goog.require('ScoreLibrary.Renderer.TextBox');
goog.require('ScoreLibrary.Score');
goog.require('ScoreLibrary.Score.Element');
goog.require('ScoreLibrary.Score.PartGroup');
goog.require('ScoreLibrary.Score.XMLHelper');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Score.Element}
 */
ScoreLibrary.Score.PartList = function(owner, part_list_node) {

    var supperclass = ScoreLibrary.Score.PartList.supperclass;

    supperclass.constructor.call(
        this, owner, part_list_node, ScoreLibrary.Score.PartList.ChildTypes);
};

/**
 * @const
 */
ScoreLibrary.Score.PartList.ChildTypes = ['part-group', 'score-part'];

ScoreLibrary.inherited(
    ScoreLibrary.Score.PartList,
    ScoreLibrary.Score.Element);

/**
 * @constructor
 * @extends {ScoreLibrary.Score.Element}
 */
ScoreLibrary.Score.PartList.Item = function(owner, part_item_node) {

    var supperclass = ScoreLibrary.Score.PartList.Item.supperclass;

    supperclass.constructor.call(this, owner, part_item_node);

    var xml_helper = ScoreLibrary.Score.XMLHelper.getInstance();

    xml_helper.getPartListItem(this, this);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.PartList.Item,
    ScoreLibrary.Score.Element);

ScoreLibrary.Score.PartList.Item.prototype.toString = function() {

    return 'Score.PartListItem';
};

ScoreLibrary.Score.PartList.prototype.enfoldPartGroupIf =
    function(plain_element, plain_iterator, parent_element, element_factory) {

        if (ScoreLibrary.Score.PartGroup.prototype.isPrototypeOf(
            plain_element)) {

            if (plain_element.type === 'start') {

                var part_group_start = plain_element;

                plain_iterator = plain_iterator.clone();

                while (plain_iterator.hasNextPlainElement()) {

                    var next_plain_element = plain_iterator.nextPlainElement();

                    if (ScoreLibrary.Score.PartGroup.prototype.isPrototypeOf(
                        next_plain_element) &&
                        next_plain_element.type === 'stop' &&
                        next_plain_element.number === part_group_start.number &&
                        part_group_start.start_score_part &&
                        part_group_start.stop_score_part &&
                        (part_group_start.start_score_part !==
                         part_group_start.stop_score_part)) {

                        this.defaultEnfolder(part_group_start);

                        break;
                    }
                    else if (ScoreLibrary.Score.PartList.Item.prototype.
                             isPrototypeOf(next_plain_element)) {

                        if (!part_group_start.start_score_part) {

                            part_group_start.start_score_part =
                                next_plain_element;
                        }

                        part_group_start.stop_score_part = next_plain_element;
                    }
                }
            }

            return plain_element;
        }

        return undefined;
    };

ScoreLibrary.Score.PartList.prototype.getEnfolders = function() {

    var enfolders = ScoreLibrary.Score.PartList.enfolders;
    if (enfolders === undefined) {

        enfolders = [
            this.enfoldPartGroupIf
        ];

        ScoreLibrary.Score.PartList.enfolders = enfolders;
    }

    return enfolders;
};

ScoreLibrary.Score.PartList.prototype.toString = function() {

    return 'Score.PartList';
};

ScoreLibrary.Score.PartList.prototype.createRenderer = function() {

    return null;
};

ScoreLibrary.Score.PartList.prototype.getPartGroups = function() {

    var part_groups = [];

    var child_iterator = ScoreLibrary.Score.ElementIterFactory.create(this);

    while (child_iterator.hasNext()) {

        var child_element = child_iterator.next();

        if (ScoreLibrary.Score.PartGroup.prototype.isPrototypeOf(
            child_element)) {

            part_groups.push(child_element);
        }
    }

    return part_groups;
};

ScoreLibrary.Score.PartList.prototype.getListItems = function() {

    var score_parts = [];

    var child_iterator = ScoreLibrary.Score.ElementIterFactory.create(this);

    while (child_iterator.hasNext()) {

        var child_element = child_iterator.next();

        if (ScoreLibrary.Score.PartList.Item.prototype.isPrototypeOf(
            child_element)) {

            score_parts.push(child_element);
        }
    }

    return score_parts;
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
