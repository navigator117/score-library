goog.provide('ScoreLibrary.Engraver.Liner');
goog.provide('ScoreLibrary.Engraver.SystemListLazyIter');
goog.require('ScoreLibrary.Engraver');
goog.require('ScoreLibrary.Engraver.LabelGroups');
goog.require('ScoreLibrary.Engraver.Measure');
goog.require('ScoreLibrary.Engraver.Part');
goog.require('ScoreLibrary.Engraver.System');
goog.require('ScoreLibrary.PageCounter');
goog.require('ScoreLibrary.Renderer.HBoxGlyph');
goog.require('ScoreLibrary.Score.ColumnIterator');
goog.require('ScoreLibrary.Score.ConnectorManager');

/**
 * @constructor
 */
ScoreLibrary.Engraver.Liner = function(context) {

    this.context = context;
};

/**
 * @constructor
 */
ScoreLibrary.Engraver.Liner.SystemListLazyIter =
    function(source, layout_manager, context) {

        this.source = source;

        this.layout_manager = layout_manager;

        this.context = context;

        this.reverse_parts = source.getParts().reverse();

        this.labelgroups_engraver =
            new ScoreLibrary.Engraver.LabelGroups(
                this.reverse_parts, source.getPartGroups());

        this.measure_engraver =
            new ScoreLibrary.Engraver.Measure(this.context);

        this.part_engraver =
            new ScoreLibrary.Engraver.Part(this.context);

        var custom_renderer = this.context.getCustomTextRenderer();

        this.system_engraver =
            new ScoreLibrary.Engraver.System(custom_renderer.getGlyphFactory());

        this.page_counter = new ScoreLibrary.PageCounter();

        this.column_iterator =
            new ScoreLibrary.Score.ColumnIterator(this.reverse_parts);

        this.current = 0;
    };

ScoreLibrary.Engraver.Liner.SystemListLazyIter.prototype.labelSystemRenderer =
    function(system_renderer) {

        var labeled_renderer = system_renderer;

        var labelgroups_renderer =
            this.labelgroups_engraver.getRenderer(
                system_renderer, this.context);

        if (labelgroups_renderer) {

            labeled_renderer =
                new ScoreLibrary.Renderer.HBoxGlyph('SystemWithLabels');

            var fix_org_coord = 'line';

            labeled_renderer.pack(
                labelgroups_renderer,
                false, false, 0, 0, fix_org_coord);

            system_renderer.setOrg(
                fix_org_coord, 'x',
                labeled_renderer.getRequisite('width'));

            system_renderer.setOrg(
                fix_org_coord, 'y', 0);

            labeled_renderer.pack(
                system_renderer,
                true, true, 0, 0, fix_org_coord);
        }

        return labeled_renderer;
    };

ScoreLibrary.Engraver.Liner.SystemListLazyIter.prototype.getSystemCount =
    function() {

        return (this.system_list ? this.system_list.length : 0);
    };

ScoreLibrary.Engraver.Liner.SystemListLazyIter.prototype.hasNext = function() {

    return (this.current < this.getSystemCount() ?
            true : this.column_iterator.hasNext());
};

ScoreLibrary.Engraver.Liner.SystemListLazyIter.prototype.next = function() {

    goog.asserts.assert(
        this.hasNext(),
        'ScoreLibrary.Engraver.Liner.SystemListLazyIter.next(): unexpect!');

    return (this.current < this.getSystemCount() ?
            this.system_list[this.current++] : this.lazyNext());
};

ScoreLibrary.Engraver.Liner.SystemListLazyIter.prototype.lazyNext = function() {

    var system_renderer = new ScoreLibrary.Renderer.System();

    this.accumulate_system_heights =
        this.accumulate_system_heights || 0;

    var accumulate_system_length = 0;

    var labelgroups_width =
        this.labelgroups_engraver.getRendererWidth(
            this.context,
            !this.column_iterator.hasPrev());

    var available_system_length =
        this.layout_manager.getMaxSystemLength(this.page_counter) -
        labelgroups_width;

    var first_measure_in_system = true;

    var measure_column_prev = undefined;

    var measure_column = undefined;

    var part_renderers = undefined;

    while (this.column_iterator.hasNext()) {

        measure_column_prev = measure_column;

        measure_column = this.column_iterator.next();

        this.connector_mgrs =
            this.connector_mgrs ||
            measure_column.map(
                function() {

                    return new ScoreLibrary.Score.ConnectorManager();
                }, this);

        var width_tester =
            this.system_engraver.engrave(
                this.reverse_parts,
                this.measure_engraver.engraveColumn(
                    measure_column,
                    first_measure_in_system,
                    undefined));

        var align_width = width_tester.getRequisite('width');

        accumulate_system_length +=
        align_width * ScoreLibrary.Engraver.Constants.density;

        if (accumulate_system_length > available_system_length) {

            this.column_iterator.prev();

            if (!this.column_iterator.hasPrev()) {

                var message = "score-div's width is not enough,";

                message += ' at least ';
                message += Math.ceil(accumulate_system_length +
                                     labelgroups_width + 50);
                message += ' please!';

                throw Error(message);
            }

            measure_column = measure_column_prev;

            break;
        }

        part_renderers =
            this.measure_engraver.engraveColumn(
                measure_column, first_measure_in_system,
                part_renderers, system_renderer);

        first_measure_in_system = false;

        measure_column.forEach(
            function(measure, index, measures) {

                var connector_mgr = this.connector_mgrs[index];

                connector_mgr.addMeasure(measure);
            }, this);
    }

    if (part_renderers) {

        part_renderers =
            this.measure_engraver.engraveColumnSystemEnds(
                measure_column,
                part_renderers,
                system_renderer);

        var is_last_system = !this.column_iterator.hasNext();

        part_renderers =
            this.part_engraver.engrave(
                this.connector_mgrs, part_renderers,
                is_last_system, available_system_length);

        this.connector_mgrs.forEach(
            function(connector_mgr) {

                connector_mgr.reset();
            });

        system_renderer =
            this.system_engraver.engrave(
                this.reverse_parts, part_renderers, system_renderer);

        var requisite_width =
            system_renderer.getRequisite('width');

        if (is_last_system) {

            system_renderer.setExplicit(
                'width',
                Math.min(available_system_length,
                         requisite_width *
                         ScoreLibrary.Engraver.Constants.sparsity));
        }
        else {

            system_renderer.setExplicit('width', available_system_length);
        }

        system_renderer = this.labelSystemRenderer(system_renderer);

        this.accumulate_system_heights +=
        system_renderer.getRequisite('height');

        if (this.accumulate_system_heights >
            this.layout_manager.getMaxSystemHeights(this.page_counter)) {

            this.page_counter.incPageNumber();
        }

        this.system_list = this.system_list || [];
        this.system_list.push(system_renderer);

        ++this.current;
    }
    else {

        system_renderer = undefined;
    }

    return system_renderer;
};

ScoreLibrary.Engraver.Liner.SystemListLazyIter.prototype.hasPrev = function() {

    return this.current > 0;
};

ScoreLibrary.Engraver.Liner.SystemListLazyIter.prototype.prev = function() {

    goog.asserts.assert(
        this.hasPrev(),
        'ScoreLibrary.Engraver.Liner.SystemListLazyIter.prev(): unexpect!');

    return this.system_list[--this.current];
};

ScoreLibrary.Engraver.Liner.prototype.engrave =
    function(source, layout_manager) {

        var system_iterator =
            new ScoreLibrary.Engraver.Liner.SystemListLazyIter(
                source, layout_manager, this.context);

        return system_iterator;
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
