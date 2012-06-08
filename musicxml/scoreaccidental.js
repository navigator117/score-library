goog.provide('ScoreLibrary.Score.Accidental');
goog.require('ScoreLibrary.Renderer.HBoxGlyph');
goog.require('ScoreLibrary.Score');
goog.require('goog.asserts');

/**
 * @constructor
 */
ScoreLibrary.Score.Accidental = function(accidental, staff, alter, is_grace) {

    if (accidental) {

        this.accidental = accidental.accidental;
        this.editorial = accidental.editorial;
        this.cautionary = accidental.cautionary;
    }
    else {

        this.accidental = this.alterToAccidental(alter);
    }

    this.staff = staff;

    this.is_grace = (is_grace ? true : false);
};

ScoreLibrary.Score.Accidental.prototype.alterToAccidental = function(alter) {

    var accidental = undefined;

    switch (alter) {

    case 2: {
        accidental = 'double-sharp';
    } break;
    case 1.5: {
        accidental = 'three-quarters-sharp';
    } break;
    case 1: {
        accidental = 'sharp';
    } break;
    case 0.5: {
        accidental = 'quarter-sharp';
    } break;
    case 0: {
        accidental = 'natural';
    } break;
    case -0.5: {
        accidental = 'quarter-flat';
    } break;
    case -1: {
        accidental = 'flat';
    } break;
    case -1.5: {
        accidental = 'three-quarters-flat';
    } break;
    case -2: {
        accidental = 'double-flat';
    } break;
    default:
        goog.asserts.assert(
            false,
            'ScoreLibrary.Score.Accidental.alterToAccidental(): unexpect');
    }

    return accidental;
};

ScoreLibrary.Score.Accidental.prototype.createRenderer =
    function(glyph_factory) {

        var renderer = undefined;

        var glyph_name = undefined;

        var glyph = undefined;

        var fix_org_coord = 'accidental';

        // (
        if (this.cautionary || this.editorial) {

            renderer = new ScoreLibrary.Renderer.HBoxGlyph('Accidental', 1);

            renderer.setOrg(fix_org_coord, 'y', 0);

            glyph_name =
                this.accidentalToGlyphName('leftparen');

            var glyph_height = this.staff.getHeightOfSpace() * 1.5;

            if (this.is_grace) {

                glyph_height *= 0.65;
            }

            glyph =
                glyph_factory.createByName(glyph_name, undefined, glyph_height);

            if (glyph !== undefined) {

                var outline_bbox =
                    glyph.getOutlineBoundbox();

                glyph.setOrg(fix_org_coord, 'y', outline_bbox.y_min);

                renderer.pack(glyph, false, false, 0, 0, fix_org_coord);
            }
        }

        // #
        if (this.accidental !== undefined) {

            glyph_name =
                this.accidentalToGlyphName(this.accidental);

            var glyph_height =
                (glyph_name === 'accidentals.doublesharp' ?
                 this.staff.getHeightOfSpace() :
                 this.staff.getHeightOfSpace() * 2);

            if (this.is_grace) {

                glyph_height *= 0.75;
            }

            glyph =
                glyph_factory.createByName(glyph_name, undefined, glyph_height);

            if (glyph !== undefined) {

                if (renderer !== undefined) {

                    var outline_bbox =
                        glyph.getOutlineBoundbox();

                    glyph.setOrg(fix_org_coord, 'y', outline_bbox.y_min);

                    renderer.pack(glyph, false, false, 0, 0, fix_org_coord);
                }
                else {

                    renderer = glyph;
                }
            }
        }

        // )
        if (this.cautionary || this.editorial) {

            glyph_name =
                this.accidentalToGlyphName('rightparen');

            var glyph_height = this.staff.getHeightOfSpace() * 1.5;

            if (this.is_grace) {

                glyph_height *= 0.65;
            }

            glyph =
                glyph_factory.createByName(glyph_name, undefined, glyph_height);

            if (glyph !== undefined) {

                var outline_bbox =
                    glyph.getOutlineBoundbox();

                glyph.setOrg(fix_org_coord, 'y', outline_bbox.y_min);

                renderer.pack(glyph, false, false, 0, 0, fix_org_coord);
            }
        }

        return renderer;
    };

/**
 * @const
 */
ScoreLibrary.Score.Accidental.MapAccidentalName = {

    'sharp': 'accidentals.sharp',
    'sharp-sharp': 'accidentals.doublesharp',
    'double-sharp': 'accidentals.doublesharp',
    'flat': 'accidentals.flat',
    'flat-flat': 'accidentals.flatflat',
    'double-flat': 'accidentals.flatflat',
    'natural': 'accidentals.natural',
    'natural-sharp': 'accidentals.natural',
    'natural-flat': 'accidentals.natural',
    'quarter-flat': 'accidentals.mirroredflat',
    'quarter-sharp': 'accidentals.sharp.slashslash.stem',
    'three-quarters-flat': 'accidentals.mirroredflat.flat',
    'three-quarters-sharp': 'accidentals.sharp.slashslash.stemstemstem',
    'sharp-down': 'accidentals.sharp.arrowdown',
    'sharp-up': 'accidentals.sharp.arrowup',
    'natural-down': 'accidentals.natural.arrowdown',
    'natural-up': 'accidentals.natural.arrowup',
    'flat-down': 'accidentals.flat.arrowdown',
    'flat-up': 'accidentals.flat.arrowup',
    'triple-sharp': '',
    'triple-flat': '',
    'slash-quarter-sharp': 'accidentals.sharp.slashslashslash.stem',
    'slash-sharp': 'accidentals.sharp.slashslashslash.stemstem',
    'slash-flat': 'accidentals.flat.slash',
    'double-slash-flat': 'accidentals.flat.slashslash',
    'sharp-1': 'accidentals.1',
    'sharp-2': 'accidentals.2',
    'sharp-3': 'accidentals.3',
    'sharp-5': 'accidentals.4',
    'flat-1': 'accidentals.M1',
    'flat-2': 'accidentals.M2',
    'flat-3': 'accidentals.M3',
    'flat-4': 'accidentals.M4',
    'leftparen': 'accidentals.leftparen',
    'rightparen': 'accidentals.rightparen',
    'sori': 'sori',
    'koron': 'koron'
};

ScoreLibrary.Score.Accidental.prototype.accidentalToGlyphName =
    function(accidental) {

        return ScoreLibrary.Score.Accidental.MapAccidentalName[accidental];
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
