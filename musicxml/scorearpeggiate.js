goog.provide('ScoreLibrary.Score.Arpeggiate');
goog.provide('ScoreLibrary.Score.NonArpeggiate');
goog.require('ScoreLibrary.Renderer.Bracket');
goog.require('ScoreLibrary.Renderer.VBoxGlyph');
goog.require('ScoreLibrary.Score');
goog.require('ScoreLibrary.Score.GlyphAnchor');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Score.Anchor}
 */
ScoreLibrary.Score.Arpeggiate = function(number, information) {

    var supperclass = ScoreLibrary.Score.Arpeggiate.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.Arpeggiate,
    ScoreLibrary.Score.Anchor);

ScoreLibrary.Score.Arpeggiate.prototype.toString = function() {

    return 'Score.Arpeggiate';
};

ScoreLibrary.Score.Arpeggiate.prototype.toNodeString = function() {

    return 'arpeggiate';
};

ScoreLibrary.Score.Arpeggiate.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.Arpeggiate(this.number, this.information);

    var supperclass = ScoreLibrary.Score.Arpeggiate.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Score.Arpeggiate.prototype.isValidType = function(type) {

    return (type === undefined);
};

ScoreLibrary.Score.Arpeggiate.prototype.isBeginType = function(type) {

    return false;
};

ScoreLibrary.Score.Arpeggiate.prototype.isEndType = function(type) {

    return false;
};

ScoreLibrary.Score.Arpeggiate.prototype.getDirection = function() {

    return this.information.direction;
};

ScoreLibrary.Score.Arpeggiate.prototype.getGlyphName =
    function(index, number_of_arpeggio) {

        var glyph_name = 'scripts.arpeggio';

        if (index === 0 && this.getDirection() === 'down') {

            glyph_name = 'scripts.arpeggio.arrow.M1';
        }

        if ((index === number_of_arpeggio - 1) &&
            this.getDirection() === 'up') {

            glyph_name = 'scripts.arpeggio.arrow.1';
        }

        return glyph_name;
    };

ScoreLibrary.Score.Arpeggiate.prototype.createRenderer =
    function(glyph_factory) {

        var arpeggiate_renderer = undefined;

        var arpeggio_height = 10;

        var notes = this.getNotes();

        var y0 = notes[0].getYOnStaff();
        var y1 = notes[notes.length - 1].getYOnStaff();

        var number_of_arpeggio =
            Math.ceil((y1 - y0) / arpeggio_height);

        for (var i = 0; i < number_of_arpeggio; ++i) {

            var arpeggio_element =
                glyph_factory.createByName(
                    this.getGlyphName(i, number_of_arpeggio),
                    undefined,
                    arpeggio_height);

            if (arpeggio_element) {

                arpeggiate_renderer =
                    arpeggiate_renderer ||
                    new ScoreLibrary.Renderer.VBoxGlyph('Arpeggiate');

                arpeggiate_renderer.pack(
                    arpeggio_element, false, false, 0, 0);
            }
        }

        if (arpeggiate_renderer) {

            var fix_org_coord = 'staff';

            arpeggiate_renderer.setOrg(fix_org_coord, 'y', y0);
        }

        return arpeggiate_renderer;
    };

/**
 * @constructor
 * @extends {ScoreLibrary.Score.Anchor}
 */
ScoreLibrary.Score.NonArpeggiate = function(number, information) {

    var supperclass = ScoreLibrary.Score.NonArpeggiate.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.NonArpeggiate,
    ScoreLibrary.Score.Anchor);

ScoreLibrary.Score.NonArpeggiate.prototype.toString = function() {

    return 'Score.NonArpeggiate';
};

ScoreLibrary.Score.NonArpeggiate.prototype.toNodeString = function() {

    return 'non-arpeggiate';
};

ScoreLibrary.Score.NonArpeggiate.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.NonArpeggiate(this.number, this.information);

    var supperclass = ScoreLibrary.Score.NonArpeggiate.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Score.NonArpeggiate.prototype.isValidType = function(type) {

    return (/(top|bottom)/.test(type));
};

ScoreLibrary.Score.NonArpeggiate.prototype.isBeginType = function(type) {

    return false;
};

ScoreLibrary.Score.NonArpeggiate.prototype.isEndType = function(type) {

    return false;
};

ScoreLibrary.Score.NonArpeggiate.prototype.getEndLength = function() {

    return 5;
};

ScoreLibrary.Score.NonArpeggiate.prototype.createRenderer = function() {

    var bracket_renderer =
        new ScoreLibrary.Renderer.Bracket(
            ScoreLibrary.Renderer.PaintHelper.OpenSides.Right);

    var notes = this.getNotes();

    var y0 = notes[0].getYOnStaff();
    var y1 = notes[notes.length - 1].getYOnStaff();

    requisite_height = (y1 - y0);

    requisite_width = this.getEndLength();

    bracket_renderer.setExplicit('width', requisite_width);
    bracket_renderer.setExplicit('height', requisite_height);

    var fix_org_coord = 'staff';

    bracket_renderer.setOrg(fix_org_coord, 'y', y0 - 5);

    this.setRenderer(bracket_renderer);

    return bracket_renderer;
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
