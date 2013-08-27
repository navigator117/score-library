goog.provide('ScoreLibrary.Engraver.Pager');
goog.provide('ScoreLibrary.Engraver.Pager.PageListLazyIter');
goog.require('ScoreLibrary.Engraver');
goog.require('ScoreLibrary.Engraver.Credit');
goog.require('ScoreLibrary.Engraver.LayoutManager');
goog.require('ScoreLibrary.Engraver.Liner');
goog.require('ScoreLibrary.Engraver.PageNumber');
goog.require('ScoreLibrary.Renderer.Page');

/**
 * @constructor
 */
ScoreLibrary.Engraver.Pager = function(context) {

    this.context = context;
};

/**
 * @constructor
 */
ScoreLibrary.Engraver.Pager.PageListLazyIter =
    function(source, layout_manager, system_iterator, context) {

        this.source = source;

        this.context = context;

        this.page_counter = new ScoreLibrary.PageCounter();

        this.layout_manager = layout_manager;

        this.system_iterator = system_iterator;

        this.fix_org_coord = 'page';

        this.current = 0;
    };

ScoreLibrary.Engraver.Pager.PageListLazyIter.prototype.getPageCount =
    function() {

        return (this.page_list ? this.page_list.length : 0);
    };

ScoreLibrary.Engraver.Pager.PageListLazyIter.prototype.hasNext = function() {

    return (this.current < this.getPageCount() ?
            true : this.system_iterator.hasNext());
};

ScoreLibrary.Engraver.Pager.PageListLazyIter.prototype.next = function() {

    goog.asserts.assert(
        this.hasNext(),
        'ScoreLibrary.Engraver.Pager.PageListLazyIter.next(): unexpect!');

    return (this.current < this.getPageCount() ?
            this.page_list[this.current++] : this.lazyNext());
};

ScoreLibrary.Engraver.Pager.PageListLazyIter.prototype.lazyNext = function() {

    var page = new ScoreLibrary.Renderer.Page(this.page_counter);

    page.setExplicit('width', this.layout_manager.getPageWidth());
    page.setExplicit('height', this.layout_manager.getPageHeight());

    page.setOrg(this.fix_org_coord, 'x', 0);
    page.setOrg(this.fix_org_coord, 'y', 0);

    this.engraveTopMargin(page);
    this.engraveCreditInfos(page);

    this.layout_manager.setMaxSystemHeights(
        page.getExplicit('height') -
            page.getImplicit('height') -
            this.layout_manager.getSystemMargin(page, 'bottom'));

    var accumulate_system_heights = 0;

    var system_v_padding = 5;

    while (this.system_iterator.hasNext()) {

        var system_renderer = this.system_iterator.next();

        accumulate_system_heights += system_v_padding;

        accumulate_system_heights += system_renderer.getRequisite('height');

        if (accumulate_system_heights >
            this.layout_manager.getMaxSystemHeights()) {

            this.system_iterator.prev();

            if (!this.system_iterator.hasPrev()) {

                var message = "score-div's height is not enough,";

                message += ' at least ';
                message +=
                Math.ceil(accumulate_system_heights + 50);
                // !NOTE: temp fix toolbar height.

                message += ' please!';

                throw Error(message);
            }

            break;
        }

        system_renderer.setOrg(
            this.fix_org_coord, 'x',
            this.layout_manager.getSystemMargin(page, 'left'));

        page.pack(
            system_renderer, false, false,
            system_v_padding, 0, this.fix_org_coord, true);
    }

    this.engraveBottomMargin(page);

    this.page_counter.incPageNumber();

    this.page_list = this.page_list || [];
    this.page_list.push(page);

    ++this.current;

    return page;
};

ScoreLibrary.Engraver.Pager.PageListLazyIter.prototype.hasPrev = function() {

    return this.current > 0;
};

ScoreLibrary.Engraver.Pager.PageListLazyIter.prototype.prev = function() {

    goog.asserts.assert(
        this.hasPrev(),
        'ScoreLibrary.Engraver.Pager.PageListLazyIter.prev(): unexpect!');

    return this.page_list[--this.current];
};

ScoreLibrary.Engraver.Pager.PageListLazyIter.prototype.engraveTopMargin =
    function(page) {

        var marginbox = new ScoreLibrary.Renderer.CustomGlyph('TopMargin');

        marginbox.setExplicit(
            'height', this.layout_manager.getSystemMargin(page, 'top'));

        marginbox.pack_filling_max = true;

        marginbox.setOrg(this.fix_org_coord, 'x', 0);

        page.pack(marginbox, false, false, 0, 0, this.fix_org_coord, true);

        // page numbers.
        var page_number_engraver =
            new ScoreLibrary.Engraver.PageNumber(this.context);

        page_number_engraver.engrave(this.layout_manager, page, true);
    };

ScoreLibrary.Engraver.Pager.PageListLazyIter.prototype.engraveBottomMargin =
    function(page) {

        var marginbox = new ScoreLibrary.Renderer.CustomGlyph('BottomMargin');

        marginbox.setExplicit(
            'height',
            this.layout_manager.getSystemMargin(page, 'bottom'));

        marginbox.pack_filling_max = true;

        marginbox.setOrg(this.fix_org_coord, 'x', 0);

        page.pack(marginbox, false, false, 0, 0, this.fix_org_coord);

        // page numbers.
        var page_number_engraver =
            new ScoreLibrary.Engraver.PageNumber(this.context);

        page_number_engraver.engrave(this.layout_manager, page);
    };

ScoreLibrary.Engraver.Pager.PageListLazyIter.prototype.engraveCreditInfos =
    function(page) {

        // credit informations.
        var credit_engraver =
            new ScoreLibrary.Engraver.Credit(this.context);

        var credit_infos = this.source.getCreditInfos();
        if (credit_infos) {

            credit_infos.forEach(
                function(credit_info) {

                    credit_engraver.engrave(credit_info, page);
                }, this);
        }
    };

ScoreLibrary.Engraver.Pager.prototype.engrave =
    function(source, layout_manager) {

        if (!layout_manager) {

            layout_manager =
                new ScoreLibrary.Engraver.LayoutManager(this.context, source);
            // !NOTE: use width & height comes from score-div.
            // layout_manager.initialize();

            layout_manager.setPageWidth(this.context.getWidth());
            layout_manager.setPageHeight(this.context.getHeight());

            layout_manager.setSystemMargin('top', 20);
            layout_manager.setSystemMargin('left', 20);
            layout_manager.setSystemMargin('right', 20);
            layout_manager.setSystemMargin('bottom', 20);
        }

        var liner = new ScoreLibrary.Engraver.Liner(this.context);

        var system_iterator = liner.engrave(source, layout_manager);

        var page_iterator =
            new ScoreLibrary.Engraver.Pager.PageListLazyIter(
                source, layout_manager, system_iterator, this.context);

        return page_iterator;
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
