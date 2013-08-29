goog.provide('ScoreLibrary.Engraver.LayoutManager');
goog.require('ScoreLibrary.Engraver');
goog.require('goog.asserts');

/**
 * @constructor
 */
ScoreLibrary.Engraver.LayoutManager = function(context, source) {

    this.context = context;
    this.source = source;
};

ScoreLibrary.Engraver.LayoutManager.prototype.initialize = function() {

    var page_width = this.getPageWidth();
    var page_height = this.getPageHeight();

    var context_width = this.context.getWidth();
    var context_height = this.context.getHeight();

    if (context_width !== page_width || context_height !== page_height) {

        this.context.resize(page_width, page_height);
    }
};

ScoreLibrary.Engraver.LayoutManager.prototype.getPageLayout = function() {

    var layout_information = this.source.getLayoutInformation();

    return layout_information.getPageLayout();
};

ScoreLibrary.Engraver.LayoutManager.prototype.getSystemLayout = function() {

    var layout_information = this.source.getLayoutInformation();

    return layout_information.getSystemLayout();
};

ScoreLibrary.Engraver.LayoutManager.prototype.setPageWidth =
    function(page_width) {

    this.page_width = page_width;
};

ScoreLibrary.Engraver.LayoutManager.prototype.getPageWidth = function() {

    return (this.page_width ?
            this.page_width :
            this.getPageLayout().getPageWidth());
};

ScoreLibrary.Engraver.LayoutManager.prototype.setPageHeight =
    function(page_height) {

    this.page_height = page_height;
};

ScoreLibrary.Engraver.LayoutManager.prototype.getPageHeight = function() {

    return (this.page_height ?
            this.page_height :
            this.getPageLayout().getPageHeight());
};

ScoreLibrary.Engraver.LayoutManager.prototype.setSystemMargin =
    function(margin_type, margin_value) {

    goog.asserts.assert(
        (/left|right|top|bottom/.test(margin_type)),
        'ScoreLibrary.Engraver.LayoutManager.setSystemMargin(): ' +
            'invalid arguments!');

    margin_type += '-margin';

    this[margin_type] = margin_value;
};

ScoreLibrary.Engraver.LayoutManager.prototype.getSystemMargin =
    function(page, margin_type) {

    goog.asserts.assert(
        (/left|right|top|bottom/.test(margin_type)),
        'ScoreLibrary.Engraver.LayoutManager.getSystemMargin(): ' +
            'invalid arguments!');

    margin_type += '-margin';

    var margin_value = this[margin_type];

    if (margin_value !== undefined) {

        return margin_value;
    }
    else {

        var page_layout = this.getPageLayout();

        var page_margins = page_layout.getMargins(page.getPageType());

        var system_layout = this.getSystemLayout();

        var system_margins = system_layout.getMargins();

        if (margin_type === 'top-margin') {

            var system_distances = system_layout.getDistances();

            return (page_margins[margin_type] +
                    (page.getPageNumber() === 1 ? system_distances.top : 0));
        }
        else if (margin_type === 'bottom-margin') {

            return page_margins[margin_type];
        }
        else {

            return (page_margins[margin_type] + system_margins[margin_type]);
        }
    }
};

ScoreLibrary.Engraver.LayoutManager.prototype.getMaxSystemLength =
    function(page) {

    var page_layout = this.getPageLayout();

    var page_margins = page_layout.getMargins(page.getPageType());

    var system_layout = this.getSystemLayout();

    var system_margins = system_layout.getMargins();

    return (this.getPageWidth() -
            this.getSystemMargin(page, 'left') -
            this.getSystemMargin(page, 'right'));
};

ScoreLibrary.Engraver.LayoutManager.prototype.setMaxSystemHeights =
    function(max_system_heights) {

    this.max_system_heights = max_system_heights;
};

ScoreLibrary.Engraver.LayoutManager.prototype.getMaxSystemHeights =
    function(page) {

    if (!this.max_system_heights) {

        var page_layout = this.getPageLayout();

        var page_margins = page_layout.getMargins(page.getPageType());

        var system_layout = this.getSystemLayout();

        var system_distances = system_layout.getDistances();

        var max_system_heights =
            this.getPageHeight() -
            (page_margins['top-margin'] +
             page_margins['bottom-margin']);

        if (page.getPageNumber() === 1) {

            max_system_heights -= system_distances.top;
        }

        return max_system_heights;
    }
    else {

        return this.max_system_heights;
    }
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
