goog.provide('ScoreLibrary.Engraver.PageNumber');
goog.require('ScoreLibrary.Engraver');

/**
 * @constructor
 */
ScoreLibrary.Engraver.PageNumber = function(context) {

    this.context = context;
};

ScoreLibrary.Engraver.PageNumber.prototype.engrave =
    function(layout_manager, page, reverse_pack) {

    var halign = (page.getPageType() === 'even' ? 'left' : 'right');

    var textbox = new ScoreLibrary.Renderer.TextBox(halign);

    textbox.setText(
        page.getPageNumber(), 'bold 12px sans-serif', this.context);

    var requisite_width = textbox.getRequisite('width');

    var padding = 5;

    var x = (page.getPageType() === 'even' ?
             (layout_manager.getSystemMargin(page, 'left') -
              requisite_width - padding) :
             (layout_manager.getPageWidth() -
              layout_manager.getSystemMargin(page, 'right') +
              padding));

    var fix_org_coord = 'page';

    textbox.setOrg(fix_org_coord, 'x', x);

    reverse_pack = (reverse_pack ? true : false);

    page.pack(
        textbox, false, false, 0, 0, fix_org_coord, reverse_pack);

    return page;
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
