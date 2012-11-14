goog.provide('ScoreLibrary.Score.ConnectorManager');
goog.require('ScoreLibrary.Score');
goog.require('ScoreLibrary.Score.Accent');
goog.require('ScoreLibrary.Score.AccidentalMark');
goog.require('ScoreLibrary.Score.Accordion');
goog.require('ScoreLibrary.Score.Barline');
goog.require('ScoreLibrary.Score.Beam');
goog.require('ScoreLibrary.Score.BendList');
goog.require('ScoreLibrary.Score.Bracket');
goog.require('ScoreLibrary.Score.BreathMark');
goog.require('ScoreLibrary.Score.Caesura');
goog.require('ScoreLibrary.Score.Chord');
goog.require('ScoreLibrary.Score.Coda');
goog.require('ScoreLibrary.Score.ConnectorMgrInterface');
goog.require('ScoreLibrary.Score.Dashes');
goog.require('ScoreLibrary.Score.DelayedInvertedTurn');
goog.require('ScoreLibrary.Score.DelayedTurn');
goog.require('ScoreLibrary.Score.DetachedLegato');
goog.require('ScoreLibrary.Score.Direction');
goog.require('ScoreLibrary.Score.DoubleTongue');
goog.require('ScoreLibrary.Score.DownBow');
goog.require('ScoreLibrary.Score.Dynamics');
goog.require('ScoreLibrary.Score.ElementIterator');
goog.require('ScoreLibrary.Score.Ending');
goog.require('ScoreLibrary.Score.Fermata');
goog.require('ScoreLibrary.Score.Fingering');
goog.require('ScoreLibrary.Score.Fret');
goog.require('ScoreLibrary.Score.Glissando');
goog.require('ScoreLibrary.Score.HammerOn');
goog.require('ScoreLibrary.Score.Harmonic');
goog.require('ScoreLibrary.Score.Harmony');
goog.require('ScoreLibrary.Score.HarmonyChord');
goog.require('ScoreLibrary.Score.HarmonyFrame');
goog.require('ScoreLibrary.Score.HarpPedals');
goog.require('ScoreLibrary.Score.Heel');
goog.require('ScoreLibrary.Score.InvertedMordent');
goog.require('ScoreLibrary.Score.InvertedTurn');
goog.require('ScoreLibrary.Score.Lyric');
goog.require('ScoreLibrary.Score.Metronome');
goog.require('ScoreLibrary.Score.Mordent');
goog.require('ScoreLibrary.Score.Note');
goog.require('ScoreLibrary.Score.OpenString');
goog.require('ScoreLibrary.Score.Pedal');
goog.require('ScoreLibrary.Score.Pluck');
goog.require('ScoreLibrary.Score.PullOff');
goog.require('ScoreLibrary.Score.Rehearsal');
goog.require('ScoreLibrary.Score.Schleifer');
goog.require('ScoreLibrary.Score.Segno');
goog.require('ScoreLibrary.Score.Shift');
goog.require('ScoreLibrary.Score.Slide');
goog.require('ScoreLibrary.Score.Slur');
goog.require('ScoreLibrary.Score.SnapPizzicato');
goog.require('ScoreLibrary.Score.Staccatissimo');
goog.require('ScoreLibrary.Score.Staccato');
goog.require('ScoreLibrary.Score.Stopped');
goog.require('ScoreLibrary.Score.String');
goog.require('ScoreLibrary.Score.StrongAccent');
goog.require('ScoreLibrary.Score.Tap');
goog.require('ScoreLibrary.Score.Tenuto');
goog.require('ScoreLibrary.Score.ThumbPosition');
goog.require('ScoreLibrary.Score.Tied');
goog.require('ScoreLibrary.Score.Toe');
goog.require('ScoreLibrary.Score.TremoloBeam');
goog.require('ScoreLibrary.Score.TrillMark');
goog.require('ScoreLibrary.Score.TripleTongue');
goog.require('ScoreLibrary.Score.Tuplet');
goog.require('ScoreLibrary.Score.Turn');
goog.require('ScoreLibrary.Score.UpBow');
goog.require('ScoreLibrary.Score.VerticalTurn');
goog.require('ScoreLibrary.Score.WavyLine');
goog.require('ScoreLibrary.Score.Wedge');
goog.require('ScoreLibrary.Score.Words');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Score.ConnectorMgrInterface}
 */
ScoreLibrary.Score.ConnectorManager = function() {
};

ScoreLibrary.aggregate(ScoreLibrary.Score.ConnectorManager,
                       ScoreLibrary.Score.ConnectorMgrInterface);

ScoreLibrary.Score.ConnectorManager.prototype.addMeasure = function(measure) {

    var child_iterator = ScoreLibrary.Score.ElementIterFactory.create(measure);

    while (child_iterator.hasNext()) {

        child_element = child_iterator.next();

        if (ScoreLibrary.Score.Note.prototype.isPrototypeOf(child_element)) {

            this.addNote(child_element);
        }

        if (ScoreLibrary.Score.Harmony.prototype.isPrototypeOf(child_element)) {

            this.addHarmony(child_element);
        }
        else if (ScoreLibrary.Score.Direction.prototype.isPrototypeOf(
            child_element)) {

            this.addDirection(child_element);
        }

        if (ScoreLibrary.Score.Barline.prototype.isPrototypeOf(child_element)) {

            this.addBarline(child_element);
        }
    }
};

ScoreLibrary.Score.ConnectorManager.prototype.addNote = function(note) {

    ScoreLibrary.Score.ConnectorManager.NotationTypes =
        ScoreLibrary.Score.ConnectorManager.NotationTypes || [

            ScoreLibrary.Score.AccidentalMark,
            ScoreLibrary.Score.Accent,
            ScoreLibrary.Score.StrongAccent,
            ScoreLibrary.Score.Staccato,
            ScoreLibrary.Score.DetachedLegato,
            ScoreLibrary.Score.Staccatissimo,
            ScoreLibrary.Score.Tenuto,
            ScoreLibrary.Score.BreathMark,
            ScoreLibrary.Score.TrillMark,
            ScoreLibrary.Score.Turn,
            ScoreLibrary.Score.DelayedTurn,
            ScoreLibrary.Score.InvertedTurn,
            ScoreLibrary.Score.DelayedInvertedTurn,
            ScoreLibrary.Score.VerticalTurn,
            ScoreLibrary.Score.WavyLine,
            ScoreLibrary.Score.Shake,
            ScoreLibrary.Score.Mordent,
            ScoreLibrary.Score.InvertedMordent,
            ScoreLibrary.Score.Schleifer,
            ScoreLibrary.Score.UpBow,
            ScoreLibrary.Score.DownBow,
            ScoreLibrary.Score.Harmonic,
            ScoreLibrary.Score.OpenString,
            ScoreLibrary.Score.ThumbPosition,
            ScoreLibrary.Score.Pluck,
            ScoreLibrary.Score.DoubleTongue,
            ScoreLibrary.Score.TripleTongue,
            ScoreLibrary.Score.Stopped,
            ScoreLibrary.Score.SnapPizzicato,
            ScoreLibrary.Score.Fingering,
            ScoreLibrary.Score.Fret,
//          ScoreLibrary.Score.String,
            ScoreLibrary.Score.Tap,
            ScoreLibrary.Score.Heel,
            ScoreLibrary.Score.Toe,
            ScoreLibrary.Score.Caesura,
            ScoreLibrary.Score.HammerOn,
            ScoreLibrary.Score.PullOff,
            ScoreLibrary.Score.BendList,
            ScoreLibrary.Score.Fermata,
            /* !NOTE: Beam must be processed first */
            ScoreLibrary.Score.Beam,
            ScoreLibrary.Score.TremoloBeam,
            /* for tuplet numerals must place on beam. */
            ScoreLibrary.Score.Tuplet,
            ScoreLibrary.Score.Slur,
            ScoreLibrary.Score.Tied,
            ScoreLibrary.Score.Dynamics,
            ScoreLibrary.Score.Slide,
            ScoreLibrary.Score.Glissando,
            ScoreLibrary.Score.Lyric
        ];

    this.filterConnectorTypes(
        ScoreLibrary.Score.ConnectorManager.NotationTypes, note);
};

ScoreLibrary.Score.ConnectorManager.prototype.addDirection =
    function(direction) {

        ScoreLibrary.Score.ConnectorManager.DirectionTypes =
            ScoreLibrary.Score.ConnectorManager.DirectionTypes || [
                ScoreLibrary.Score.Rehearsal,
                ScoreLibrary.Score.Segno,
                ScoreLibrary.Score.Coda,
                ScoreLibrary.Score.Dynamics,
                ScoreLibrary.Score.Pedal,
                ScoreLibrary.Score.Wedge,
                ScoreLibrary.Score.Shift,
                ScoreLibrary.Score.Dashes,
                ScoreLibrary.Score.Bracket,
                ScoreLibrary.Score.Words,
                ScoreLibrary.Score.HarpPedals,
                ScoreLibrary.Score.Accordion,
                ScoreLibrary.Score.Metronome
            ];

        this.filterConnectorTypes(
            ScoreLibrary.Score.ConnectorManager.DirectionTypes, direction);
    };

ScoreLibrary.Score.ConnectorManager.prototype.addHarmony = function(direction) {

    ScoreLibrary.Score.ConnectorManager.HarmonyTypes =
        ScoreLibrary.Score.ConnectorManager.HarmonyTypes || [

            ScoreLibrary.Score.HarmonyFrame,
            ScoreLibrary.Score.HarmonyChord

        ];

    this.filterConnectorTypes(
        ScoreLibrary.Score.ConnectorManager.HarmonyTypes, direction);
};

ScoreLibrary.Score.ConnectorManager.prototype.addBarline = function(barline) {

    ScoreLibrary.Score.ConnectorManager.BarlineConnectorTypes =
        ScoreLibrary.Score.ConnectorManager.BarlineConnectorTypes || [

            ScoreLibrary.Score.Segno,
            ScoreLibrary.Score.Coda,
            ScoreLibrary.Score.Fermata,
            ScoreLibrary.Score.Ending,
            ScoreLibrary.Score.WavyLine
        ];

    this.filterConnectorTypes(
        ScoreLibrary.Score.ConnectorManager.BarlineConnectorTypes, barline);
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
