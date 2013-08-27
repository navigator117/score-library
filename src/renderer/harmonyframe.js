goog.provide('ScoreLibrary.Renderer.HarmonyFrame');
goog.require('ScoreLibrary.Renderer.CustomGlyph');
goog.require('ScoreLibrary.Renderer.PaintHelper');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Renderer.CustomGlyph}
 */
ScoreLibrary.Renderer.HarmonyFrame = function() {

    var supperclass = ScoreLibrary.Renderer.HarmonyFrame.supperclass;

    supperclass.constructor.call(this, 'HarmonyFrame');

    this.setExplicit('width', 80);
    this.setExplicit('height', 25);
};

ScoreLibrary.inherited(
    ScoreLibrary.Renderer.HarmonyFrame,
    ScoreLibrary.Renderer.CustomGlyph);

/**
 * @enum {number}
 */
ScoreLibrary.Renderer.HarmonyFrame.Constants = {

    marginTop: 15,
    marginLeft: 15,
    marginRight: 5,
    marginBottom: 5,
    stringSpacing: 10,
    fretSpacing: 15
};

ScoreLibrary.Renderer.HarmonyFrame.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Renderer.HarmonyFrame();

    var supperclass = ScoreLibrary.Renderer.HarmonyFrame.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Renderer.HarmonyFrame.prototype.getRequisite =
    function(dimension) {

        var frame = this.getModel();

        var constants = ScoreLibrary.Renderer.HarmonyFrame.Constants;

        if (dimension === 'width') {

            return (constants.marginLeft +
                    constants.marginRight +
                    constants.stringSpacing * (frame.getNumberOfString() - 1));
        }
        else {

            return (constants.marginTop +
                    constants.marginBottom +
                    constants.fretSpacing * frame.getNumberOfFret());
        }
    };

ScoreLibrary.Renderer.HarmonyFrame.prototype.draw = function(context) {

    var supperclass = ScoreLibrary.Renderer.HarmonyFrame.supperclass;

    supperclass.draw.call(this, context);

    context.save();

    context.transform(1, 0, 0, -1, 0, this.getRequisite('height'));

    this.drawFretBoard(context);
    this.drawFrameNotes(context);

    context.restore();
};

ScoreLibrary.Renderer.HarmonyFrame.prototype.drawFretBoard = function(context) {

    var frame = this.getModel();

    context.setLineWidth(0.5);
    context.setSourceRgb('#000000');

    var paint_helper = ScoreLibrary.Renderer.PAINT_HELPER;

    var constants = ScoreLibrary.Renderer.HarmonyFrame.Constants;

    var y0 = constants.marginTop;
    var y1 = constants.marginTop +
        frame.getNumberOfFret() * constants.fretSpacing;

    var width = this.getRequisite('width');

    for (var string_number = 1;
         string_number <= frame.getNumberOfString();
         ++string_number) {

        var x = (width - constants.marginRight) -
            (string_number - 1) * constants.stringSpacing;

        context.beginPath();

        paint_helper.drawVerticalLine(context, x, y0, y1);

        context.closePath();

        context.stroke();
    }

    var x0 = constants.marginLeft;
    var x1 = constants.marginLeft +
        (frame.getNumberOfString() - 1) * constants.stringSpacing;

    for (var fret_number = 0;
         fret_number <= frame.getNumberOfFret();
         ++fret_number) {

        var y = constants.marginTop + fret_number * constants.fretSpacing;

        if (fret_number > 0) {

            var text = (fret_number + frame.getFirstFret() - 1).toString();

            context.setTextBaseline('bottom');

            var x = constants.marginLeft -
                constants.stringSpacing * 0.5 -
                context.measureText(text);

            context.fillText(text, x, y);
        }

        context.beginPath();

        paint_helper.drawHorizontalLine(context, x0, x1, y);

        context.closePath();

        if (fret_number === 0 &&
            frame.getFirstFret() === 1) {

            context.setLineWidth(3);
        }
        else {

            context.setLineWidth(1);
        }

        context.stroke();
    }
};

ScoreLibrary.Renderer.HarmonyFrame.prototype.drawFrameNote =
    function(x, y, fret_number, frame_note, paint_helper, context) {

        if (fret_number === 0) {

            // circle 'o'
            context.setLineWidth(1);
            context.beginPath();
            paint_helper.drawCircle(context, x, y, 2);
            context.closePath();
            context.stroke();
        }
        else if (frame_note.fingering) {

            // fill '(#)'
            context.setLineWidth(0.5);
            context.beginPath();
            paint_helper.drawCircle(context, x, y, 5);
            context.closePath();
            context.fill();

            var fingering = frame_note.fingering;
            if (fingering.text) {

                context.save();
                context.setFont('bold 8px sans-serif');
                context.setSourceRgb('#FFFFFF');
                context.setTextBaseline('middle');

                x = x - context.measureText(fingering.text) * 0.5;

                context.fillText(fingering.text, x, y + 1);
                context.restore();
            }
        }
        else {

            // fill 'o'
            context.setLineWidth(0.5);
            context.beginPath();
            paint_helper.drawCircle(context, x, y, 3);
            context.closePath();
            context.fill();
        }
    };

ScoreLibrary.Renderer.HarmonyFrame.prototype.drawFrameMutes =
    function(masks, frame, width, constants, paint_helper, context) {

        var fret_number = 0;

        for (var string_number = 1;
             string_number <= frame.getNumberOfString();
             ++string_number) {

            if (!masks[string_number - 1]) {

                var x = (width - constants.marginRight) -
                    (string_number - 1) * constants.stringSpacing;
                var y = constants.marginTop +
                    (fret_number - 0.5) * constants.fretSpacing;
                var radius = 2;

                // cross 'x'
                context.setLineWidth(1);
                context.beginPath();
                paint_helper.drawLine(
                    context, x - radius, y - radius, x + radius, y + radius);
                context.closePath();
                context.stroke();
                context.beginPath();
                paint_helper.drawLine(
                    context, x - radius, y + radius, x + radius, y - radius);
                context.closePath();
                context.stroke();
            }
        }
    };

ScoreLibrary.Renderer.HarmonyFrame.prototype.drawFrameBarres =
    function(barres, width, constants, paint_helper, context) {

        if (barres) {

            barres.forEach(
                function(barre, fret_number, barres) {

                    if (barre.start && barre.stop) {

                        var x0 = (width - constants.marginRight) -
                            (barre.start - 1) * constants.stringSpacing;
                        var x1 = (width - constants.marginRight) -
                            (barre.stop - 1) * constants.stringSpacing;

                        var y = constants.marginTop +
                            (fret_number - 1) * constants.fretSpacing;

                        context.beginPath();
                        paint_helper.drawBow(context, x0, y, x1, y, false, 5);
                        context.closePath();
                        context.fill();
                    }
                });
        }
    };

ScoreLibrary.Renderer.HarmonyFrame.prototype.drawFrameNotes =
    function(context) {

        var frame = this.getModel();

        var masks = [];

        var frame_notes = frame.getFrameNotes();
        if (frame_notes) {

            var paint_helper = ScoreLibrary.Renderer.PAINT_HELPER;

            var constants = ScoreLibrary.Renderer.HarmonyFrame.Constants;

            var width = this.getRequisite('width');

            var barres = undefined;

            frame_notes.forEach(
                function(frame_note) {

                    var string_number = Number(frame_note.string.text);

                    masks[string_number - 1] = true;

                    var fret_number = Number(frame_note.fret.text);

                    fret_number = (fret_number === 0 ?
                                   fret_number :
                                   fret_number - frame.getFirstFret() + 1);

                    var x = (width - constants.marginRight) -
                        (string_number - 1) * constants.stringSpacing;
                    var y = constants.marginTop +
                        (fret_number - 0.5) * constants.fretSpacing;

                    var barre = frame_note.barre;
                    if (barre) {

                        barres = barres || [];
                        barres[fret_number] = barres[fret_number] || {};
                        barres[fret_number][barre.type] = string_number;
                    }

                    this.drawFrameNote(
                        x, y, fret_number, frame_note, paint_helper, context);

                }, this);
        }

        this.drawFrameMutes(
            masks, frame, width, constants, paint_helper, context);
        this.drawFrameBarres(barres, width, constants, paint_helper, context);
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
