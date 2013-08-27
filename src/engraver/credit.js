goog.provide('ScoreLibrary.Engraver.Credit');
goog.require('ScoreLibrary.Engraver');

/**
 * @constructor
 */
ScoreLibrary.Engraver.Credit = function(context) {

    this.context = context;
};

ScoreLibrary.Engraver.Credit.prototype.getJustifyX =
    function(words, textbox, page) {

    var x = 0;

    if (words.justify === 'left') {

        x = 0;
    }
    else if (words.justify === 'center') {

        x = (page.getRequisite('width') - textbox.getRequisite('width')) * 0.5;
    }
    else if (words.justify === 'right') {

        x = page.getRequisite('width') - textbox.getRequisite('width');
    }

    return x;
};

ScoreLibrary.Engraver.Credit.prototype.engrave = function(credit_info, page) {

    if (credit_info.getPageNumber() === 1 &&
        page.getPageNumber() === 1) {
        // !NOTE: current only support 1st page credit informations.

        var words_list = credit_info.getWordsList();
        if (words_list) {

            words_list.forEach(
                function(words) {

                    var textbox =
                        new ScoreLibrary.Renderer.TextBox(
                            words.halign, words.valign);

                    var font = [
                        words.font.font_weight,
                        words.font.font_size + 'px',
                        'sans-serif'
                    ].join(' ');

                    textbox.setText(words.text, font, this.context);

                    var fix_org_coord = 'page';

                    textbox.setOrg(
                        fix_org_coord, 'x',
                        this.getJustifyX(words, textbox, page));

                    page.pack(
                        textbox, false, false, 10, 10, fix_org_coord, true);
                }, this);
        }
    }

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
