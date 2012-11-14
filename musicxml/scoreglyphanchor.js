goog.provide('ScoreLibrary.Score.GlyphAnchor');
goog.require('ScoreLibrary.Score');
goog.require('ScoreLibrary.Score.Anchor');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Score.Anchor}
 */
ScoreLibrary.Score.GlyphAnchor = function(number, information) {

    var supperclass = ScoreLibrary.Score.GlyphAnchor.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.GlyphAnchor,
    ScoreLibrary.Score.Anchor);

ScoreLibrary.Score.GlyphAnchor.prototype.toString = function() {

    return 'Score.GlyphAnchor';
};

ScoreLibrary.Score.GlyphAnchor.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.GlyphAnchor(this.number, this.information);

    var supperclass = ScoreLibrary.Score.GlyphAnchor.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Score.GlyphAnchor.prototype.getGlyphNames = function() {

    return [];
};

ScoreLibrary.Score.GlyphAnchor.prototype.getDefaultSize = function(glyph_name) {

    var requisition = { width: undefined, height: undefined };

    switch (glyph_name) {

    case 'scripts.segno': {

        requisition.height = 30;
    } break;

    case 'scripts.trill_element':
    case 'scripts.tenuto':
    case 'scripts.dportato':
    case 'scripts.uportato':
    case 'scripts.sforzato': {

        requisition.width = 10;
    } break;

    case 'scripts.prall':
    case 'scripts.mordent':
    case 'scripts.trill':
    case 'scripts.turn':
    case 'scripts.reverseturn': {

        requisition.width = 15;
    } break;

    case 'scripts.snappizzicato':
    case 'scripts.stopped':
    case 'scripts.open':
    case 'scripts.thumb':
    case 'scripts.flageolet': {

        requisition.width = 8;
    } break;

    case 'scripts.upbow':
    case 'scripts.downbow':
    case 'comma':
    case 'scripts.ustaccatissimo':
    case 'scripts.dstaccatissimo':
    case 'scripts.umarcato':
    case 'scripts.dmarcato': {

        requisition.height = 10;
    } break;

    case 'scripts.ufermata':
    case 'scripts.dfermata':
    case 'scripts.ushortfermata':
    case 'scripts.dshortfermata':
    case 'scripts.ulongfermata':
    case 'scripts.dlongfermata':
    case 'scripts.coda': {

        requisition.width = 20;
    } break;

    case 'scripts.caesura.curved': {

        requisition.height = 20;
    } break;

    case 'scripts.upedalheel':
    case 'scripts.dpedalheel':
    case 'scripts.upedaltoe':
    case 'scripts.dpedaltoe':
    case 'pedal.Ped':
    case 'pedal.*': {

        requisition.height = 15;
    } break;

    case 'dots.dot':
    case 'scripts.staccato':
    case 'accordion.accDot': {
        requisition.height = 4;
    } break;

    case 'pedal..': {

        requisition.height = 3;
    } break;

    case 'scripts.prallmordent':
    case 'scripts.prallprall':
    case 'scripts.prallup':
    case 'scripts.pralldown':
    case 'scripts.upmordent':
    case 'scripts.downmordent':
    case 'scripts.upprall':
    case 'scripts.downprall':
    case 'accordion.accDiscant': {

        requisition.width = 25;
    } break;

    }

    return requisition;
};

ScoreLibrary.Score.GlyphAnchor.prototype.createRenderer =
    function(context, composite) {

        var anchor_renderer = undefined;

        var custom_renderer = context.getCustomTextRenderer();

        var glyph_factory = custom_renderer.getGlyphFactory();

        var glyph_names = this.getGlyphNames();

        if (glyph_names && glyph_names.length > 0) {

            anchor_renderer =
                ((glyph_names.length > 1 || composite) ?
                 new ScoreLibrary.Renderer.HBoxGlyph('GlyphAnchor') :
                 undefined);

            glyph_names.forEach(

                function(glyph_name, index, glyph_names) {

                    var requisition =
                        this.getDefaultSize(glyph_name);

                    var glyph =
                        glyph_factory.createByName(
                            glyph_name,
                            requisition.width,
                            requisition.height);

                    if (!anchor_renderer) {

                        anchor_renderer = glyph;
                    }
                    else {

                        var obox = glyph.getOutlineBoundbox();

                        var fix_org_coord = 'glyph_anchor';

                        glyph.setOrg(fix_org_coord, 'y', obox.y_min);

                        anchor_renderer.pack(
                            glyph, false, false, 1, 1, fix_org_coord);
                    }
                }, this);
        }
        else {

            goog.asserts.assert(
                false,
                'ScoreLibrary.Score.GlyphAnchor.createRenderer(): unexpect!');
        }

        this.setRenderer(anchor_renderer);

        return anchor_renderer;
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
