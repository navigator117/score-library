goog.provide('ScoreLibrary.Renderer.LabelGroups');
goog.require('ScoreLibrary.Renderer');
goog.require('ScoreLibrary.Renderer.HBoxGlyph');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Renderer.HBoxGlyph}
 */
ScoreLibrary.Renderer.LabelGroups = function() {

    var supperclass = ScoreLibrary.Renderer.LabelGroups.supperclass;

    supperclass.constructor.call(this, 'LabelGroups');
};

ScoreLibrary.inherited(
    ScoreLibrary.Renderer.LabelGroups,
    ScoreLibrary.Renderer.HBoxGlyph);

ScoreLibrary.Renderer.LabelGroups.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Renderer.LabelGroups();

    var supperclass = ScoreLibrary.Renderer.LabelGroups.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Renderer.LabelGroups.prototype.attachPartLabel =
    function(part, label_renderer, system_renderer, context) {

        var part_renderer =
            system_renderer.getPartRendererById(part.id);

        var requisite_height =
            label_renderer.getRequisite('height');

        var y =
            system_renderer.getPartRendererBoundary(
                part_renderer,
                ScoreLibrary.Renderer.System.BoundaryType.StaffCenter) -
            requisite_height * 0.5;

        var fix_org_coord = 'line';

        label_renderer.setOrg(fix_org_coord, 'x', 0);
        label_renderer.setOrg(fix_org_coord, 'y', y);

        this.pack(label_renderer, false, false, 0, 0, fix_org_coord);
    };

ScoreLibrary.Renderer.LabelGroups.prototype.attachPartGroupLabel =
    function(part_group, label_renderer, system_renderer, context) {

        var stop_renderer =
            system_renderer.getPartRendererById(
                part_group.getStopScorePart().id);

        var y0 =
            system_renderer.getPartRendererBoundary(
                stop_renderer,
                ScoreLibrary.Renderer.System.BoundaryType.StaffLower);

        var start_renderer =
            system_renderer.getPartRendererById(
                part_group.getStartScorePart().id);

        var y1 =
            system_renderer.getPartRendererBoundary(
                start_renderer,
                ScoreLibrary.Renderer.System.BoundaryType.StaffUpper);

        var fix_org_coord = 'line';

        label_renderer.setOrg(fix_org_coord, 'x', 0);
        label_renderer.setOrg(fix_org_coord, 'y', (y1 + y0) * 0.5);

        this.pack(label_renderer, false, false, 0, 0, fix_org_coord);
    };

ScoreLibrary.Renderer.LabelGroups.prototype.attachPartGroupConnector =
    function(part_group, connector_x, system_renderer, context) {

        if (part_group.group_symbol !== 'none') {

            var custom_renderer =
                context.getCustomTextRenderer();

            var glyph_factory = custom_renderer.getGlyphFactory();

            var stop_renderer =
                system_renderer.getPartRendererById(
                    part_group.getStopScorePart().id);

            var y0 =
                system_renderer.getPartRendererBoundary(
                    stop_renderer,
                    ScoreLibrary.Renderer.System.BoundaryType.StaffLower);

            var start_renderer =
                system_renderer.getPartRendererById(
                    part_group.getStartScorePart().id);

            var y1 =
                system_renderer.getPartRendererBoundary(
                    start_renderer,
                    ScoreLibrary.Renderer.System.BoundaryType.StaffUpper);

            var connector_height = Math.abs(y1 - y0);

            var group_renderer =
                part_group.createRenderer(glyph_factory, connector_height);

            stop_renderer.extendBarlines(connector_height);

            var fix_org_coord = 'line';

            group_renderer.setOrg(fix_org_coord, 'x', connector_x);
            group_renderer.setOrg(fix_org_coord, 'y', y0);

            this.pack(group_renderer, false, false, 0, 0, fix_org_coord);
        }
    };

ScoreLibrary.Renderer.LabelGroups.prototype.attachGrandStaffConnector =
    function(part, connector_x, system_renderer, context) {

        var part_renderer =
            system_renderer.getPartRendererById(part.id);

        var tunnel_states = part_renderer.getModel().getTunnelStates();

        var part_symbol = tunnel_states.getPartSymbol();

        if (tunnel_states && part_symbol) {

            var top_staff =
                tunnel_states.getStaffByNumber(
                    part_symbol.getTopStaffNumber());

            var bottom_staff =
                tunnel_states.getStaffByNumber(
                    part_symbol.getBottomStaffNumber());

            if (top_staff !== undefined &&
                bottom_staff !== undefined &&
                top_staff !== bottom_staff) {

                var y1 = top_staff.getYOfLineInStaffCoord(
                    top_staff.getNumberOfLines());

                var y0 = bottom_staff.getYOfLineInStaffCoord(1);

                var custom_renderer = context.getCustomTextRenderer();

                var glyph_factory = custom_renderer.getGlyphFactory();

                var symbol_renderer =
                    part_symbol.createRenderer(
                        glyph_factory, Math.abs(y1 - y0));

                if (symbol_renderer !== undefined) {

                    var lowest_staff =
                        tunnel_states.getStaffByNumber(
                            tunnel_states.getNumberOfStaves());

                    var y_lo = lowest_staff.getYOfLineInStaffCoord(1);

                    var y =
                        system_renderer.getPartRendererBoundary(
                            part_renderer,
                            ScoreLibrary.Renderer.System.BoundaryType.
                                StaffLower);

                    var fix_org_coord = 'line';

                    symbol_renderer.setOrg(
                        fix_org_coord, 'x',
                        (connector_x > 0 ?
                         connector_x - symbol_renderer.getRequisite('width') :
                         connector_x));

                    symbol_renderer.setOrg(
                        fix_org_coord, 'y',
                        y + (y0 - y_lo));

                    this.pack(
                        symbol_renderer, false, false, 0, 0, fix_org_coord);
                }
            }
        }
    };

ScoreLibrary.Renderer.LabelGroups.prototype.attachSystemLine =
    function(parts, line_x, system_renderer, context) {

        var stop_part = parts[0];

        var stop_renderer =
            system_renderer.getPartRendererById(stop_part.id);

        var y0 =
            system_renderer.getPartRendererBoundary(
                stop_renderer,
                ScoreLibrary.Renderer.System.BoundaryType.StaffLower);

        var start_part = parts[parts.length - 1];

        var start_renderer =
            system_renderer.getPartRendererById(start_part.id);

        var y1 =
            system_renderer.getPartRendererBoundary(
                start_renderer,
                ScoreLibrary.Renderer.System.BoundaryType.StaffUpper);

        var system_line =
            new ScoreLibrary.Renderer.Barline();

        system_line.setModel({
            bar_style: 'regular'
        });

        system_line.setLightWeight(1);
        system_line.setBarlineHeight(Math.abs(y1 - y0));

        var fix_org_coord = 'line';

        system_line.setOrg(fix_org_coord, 'x', line_x + 5);
        system_line.setOrg(fix_org_coord, 'y', y0);

        this.pack(system_line, false, false, 0, 0, fix_org_coord);
    };

ScoreLibrary.Renderer.LabelGroups.prototype.justifyRight = function() {

    if (this.getChildCount() > 0) {

        var max_label_width = 0;

        this.findChild(

            function(child, index, children) {

                max_label_width = Math.max(
                    max_label_width, child.getRequisite('width'));

                return false;
            }, this);

        this.findChild(

            function(child, index, children) {

                child.setExplicit('width', max_label_width);

                return false;
            }, this);
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
