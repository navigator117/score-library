goog.provide('ScoreLibrary.Engraver.Barline');
goog.require('ScoreLibrary.Engraver');
goog.require('ScoreLibrary.Engraver.MapInfoTraiter');
goog.require('ScoreLibrary.Renderer.Part');
goog.require('ScoreLibrary.Score.Barline');

/**
 * @constructor
 */
ScoreLibrary.Engraver.Barline = function(glyph_factory) {

    this.glyph_factory = glyph_factory;
};

ScoreLibrary.Engraver.Barline.prototype.engrave =
    function(barline, renderer, measure_last, not_show) {

        renderer = renderer || new ScoreLibrary.Renderer.Part();

        var tunnel_states = barline.getTunnelStates();

        if (tunnel_states) {

            var barline_renderer =
                barline.createRenderer(this.glyph_factory);

            if (barline_renderer) {

                barline_renderer.staff_number = barline.number;

                var bottom_staff =
                    tunnel_states.getStaffByNumber(barline.number);

                var y0 = bottom_staff.getYOfLineInStaffCoord(1);

                var part_symbol = barline.getPartSymbol();

                if (bottom_staff.getStaffType() !== 'alternate' &&
                    part_symbol &&
                    barline.number ===
                    part_symbol.getBottomStaffNumber()) {

                    var top_staff =
                        tunnel_states.getStaffByNumber(
                            part_symbol.getTopStaffNumber());

                    var y1 = top_staff.getYOfLineInStaffCoord(
                        top_staff.getNumberOfLines());

                    barline_renderer.setBarlineHeight(Math.abs(y1 - y0));
                }

                var fix_org_coord = 'staff';

                barline_renderer.setOrg(fix_org_coord, 'y', y0);

/*              barline_renderer.mapInfoHook =
                new ScoreLibrary.Engraver.MapInfoTraiter(); */

                var padding_s = (measure_last ? 5 : 0);
                var padding_e = (measure_last ? 0 : 5);

                barline_renderer.not_show = (not_show ? true : false);

                renderer.findStaffStream(barline.number, true).pack(
                    barline_renderer, true, false,
                    padding_s, padding_e, fix_org_coord);
            }
        }

        return renderer;
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
