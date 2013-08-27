goog.provide('ScoreLibrary.Score.Source');
goog.require('ScoreLibrary.Score');
goog.require('ScoreLibrary.Score.Element');
goog.require('ScoreLibrary.Score.Part');
goog.require('ScoreLibrary.Score.PartList');
goog.require('ScoreLibrary.Score.XMLHelper');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Score.Element}
 */
ScoreLibrary.Score.Source = function(xml_node) {

    var supperclass = ScoreLibrary.Score.Source.supperclass;

    supperclass.constructor.call(
        this, null, xml_node,
        ScoreLibrary.Score.Source.ChildTypes);

    if (this.node) {

        this.node =
            this.node.is('score-partwise') ?
            this.node : this.node.find('score-partwise');
    }
};

/**
 * @const
 */
ScoreLibrary.Score.Source.ChildTypes = ['part-list', 'part'];

ScoreLibrary.inherited(
    ScoreLibrary.Score.Source,
    ScoreLibrary.Score.Element);

ScoreLibrary.Score.Source.prototype.toString = function() {

    return 'Score.Source';
};

ScoreLibrary.Score.Source.prototype.getParts = function() {

    var part_list = undefined;

    var all_parts = [];

    var child_iterator = ScoreLibrary.Score.ElementIterFactory.create(this);

    while (child_iterator.hasNext()) {

        var child_element = child_iterator.next();

        if (ScoreLibrary.Score.PartList.prototype.isPrototypeOf(
            child_element)) {

            part_list = child_element;
        }
        else {

            all_parts.push(child_element);
        }
    }

    if (part_list && all_parts.length >= 1) {

        var listed_parts = [];

        var list_items = part_list.getListItems();

        all_parts.forEach(

            function(part) {

                if (list_items.some(
                    function(item) {

                        if (part.id === item.id) {

                            part.copyLabelsFromListItem(item);

                            return true;
                        }

                        return false;
                    })) {

                    listed_parts.push(part);
                }
            });

        return listed_parts;
    }


    goog.asserts.assert(
        false, 'ScoreLibrary.Score.Source.getParts(): unexpect!');

    return undefined;
};

ScoreLibrary.Score.Source.prototype.getPartGroups = function() {

    var child_iterator = ScoreLibrary.Score.ElementIterFactory.create(this);

    while (child_iterator.hasNext()) {

        var child_element = child_iterator.next();

        if (ScoreLibrary.Score.PartList.prototype.isPrototypeOf(
            child_element)) {

            return child_element.getPartGroups();
        }
    }

    return [];
};

/**
 * @constructor
 */
ScoreLibrary.Score.Source.LayoutInformation = function() {

    this.scaling = {

            millimeters: 7,
            tenths: 40
        };

    this.page_layout = {

        page_height: undefined,
        page_width: undefined
    };

    this.page_layout.page_margins = {};
    this.page_layout.page_margins['both'] = {

        'left-margin': 0,
        'right-margin': 0,
        'top-margin': 0,
        'bottom-margin': 0
    };

    this.system_layout = {

        system_margins: {

            'left-margin': 0,
            'right-margin': 0
        },
        system_distance: 0,
        top_system_distance: 0
    };
};

ScoreLibrary.Score.Source.LayoutInformation.prototype.getScaling = function() {

    return this.scaling;
};

ScoreLibrary.Score.Source.LayoutInformation.prototype.fromTenthsToMillimeters =
    function(tenths) {

        var scaling = this.getScaling();

        return (tenths * scaling.millimeters / scaling.tenths);
    };

/**
 * @constructor
 */
ScoreLibrary.Score.Source.PageLayout = function(layout) {

    this.layout = layout;
};

ScoreLibrary.Score.Source.PageLayout.prototype.getPageHeight = function() {

    return this.layout.page_height;
};

ScoreLibrary.Score.Source.PageLayout.prototype.setPageHeight =
    function(height) {

        this.layout.page_height = height;
    };

ScoreLibrary.Score.Source.PageLayout.prototype.getPageWidth = function() {

    return this.layout.page_width;
};

ScoreLibrary.Score.Source.PageLayout.prototype.setPageWidth = function(width) {

    this.layout.page_width = width;
};

ScoreLibrary.Score.Source.PageLayout.prototype.getMargins = function(type) {

    goog.asserts.assert(
            /(odd|even)/.test(type),
        'ScoreLibrary.Score.Source.PageLayout.getMargins():' +
            ' invalid arguments!');

    if (this.layout &&
        this.layout.page_margins) {

        return (this.layout.page_margins[type] ||
                this.layout.page_margins['both']);
    }
};

ScoreLibrary.Score.Source.LayoutInformation.prototype.getPageLayout =
    function() {

        return new ScoreLibrary.Score.Source.PageLayout(this.page_layout);
    };

/**
 * @constructor
 */
ScoreLibrary.Score.Source.SystemLayout = function(layout) {

    this.layout = layout;
};

ScoreLibrary.Score.Source.SystemLayout.prototype.getMargins = function() {

    return this.layout.system_margins;
};

ScoreLibrary.Score.Source.SystemLayout.prototype.getDistances = function() {

    return { top: this.layout.top_system_distance,
             other: this.layout.system_distance };
};

ScoreLibrary.Score.Source.LayoutInformation.prototype.getSystemLayout =
    function() {

        return new ScoreLibrary.Score.Source.SystemLayout(this.system_layout);
    };

ScoreLibrary.Score.Source.LayoutInformation.prototype.getFont =
    function(type, number, name) {

        goog.asserts.assert(
            (/(music|word|lyric)/.test(type),
             'ScoreLibrary.Score.Source.LayoutInformation.getFont():' +
             ' invalid arguments!'));

        if (type !== 'lyric') {

            return (type === 'music' ? this.music_font : this.word_font);
        }
        else {

            var lyric_font = undefined;

            if (this.lyric_fonts) {

                this.lyric_fonts.some(

                    function(font) {

                        if ((number !== undefined && number === font.number) ||
                            (name !== undefined && name === font.name)) {

                            lyric_font = font;

                            return true;
                        }

                        return false;
                    });
            }

            if (!lyric_font) {

                if (this.lyric_fonts &&
                    this.lyric_fonts.length > 0) {

                    lyric_font = this.lyric_fonts[0];
                }
                else {

                    lyric_font = {

                        font_family: 'Times New Roman',
                        font_size: 'medium'
                    };
                }

                lyric_font.number = number;
                lyric_font.name = name;
            }

            return lyric_font;
        }
    };

ScoreLibrary.Score.Source.prototype.getLayoutInformation = function() {

    if (this.layout_information === undefined) {

        var layout_information =
            new ScoreLibrary.Score.Source.LayoutInformation();

        var score_defaults_node = this.getNode('defaults');
        if (score_defaults_node) {

            var xml_helper = ScoreLibrary.Score.XMLHelper.getInstance();

            xml_helper.getScoreDefaults(
                score_defaults_node, layout_information);
        }

        this.layout_information = layout_information;
    }

    return this.layout_information;
};

/**
 * @constructor
 */
ScoreLibrary.Score.Source.CreditInfo = function() {
};

ScoreLibrary.Score.Source.CreditInfo.prototype.getImages = function() {

    var credit_images =
        this.credits.filter(
            function(credit_info) {

                return credit_info.is_image;
            }, this);

    return (credit_images && credit_images.length > 0 ?
            credit_images : null);
};

ScoreLibrary.Score.Source.CreditInfo.prototype.getWordsList = function() {

    var credit_words_list =
            this.credits.filter(
                function(credit_info) {

                    return credit_info.is_words;
                }, this);

    return (credit_words_list && credit_words_list.length > 0 ?
            credit_words_list : null);
};

ScoreLibrary.Score.Source.CreditInfo.prototype.getPageNumber = function() {

    return this.page;
};

ScoreLibrary.Score.Source.prototype.getCreditInfos = function() {

    if (this.credit_infos === undefined) {

        this.forEachNode(
            'credit',
            function(index, credit_node) {

                var credit_info =
                    new ScoreLibrary.Score.Source.CreditInfo();

                var xml_helper = ScoreLibrary.Score.XMLHelper.getInstance();

                xml_helper.getScoreCredit(credit_node, credit_info);


                this.credit_infos = this.credit_infos || [];

                this.credit_infos.push(credit_info);
            }, this);

        if (this.credit_info === undefined) {

            this.credit_info = null;
        }
    }

    return this.credit_infos;
};

ScoreLibrary.Score.Source.prototype.createRenderer = function(glyph_factory) {

    return null;
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
