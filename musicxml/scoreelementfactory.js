goog.provide('ScoreLibrary.Score.ElementFactory');
goog.require('ScoreLibrary.Score.Attributes');
goog.require('ScoreLibrary.Score.Barline');
goog.require('ScoreLibrary.Score.Chord');
goog.require('ScoreLibrary.Score.Clef');
goog.require('ScoreLibrary.Score.Direction');
goog.require('ScoreLibrary.Score.Element');
goog.require('ScoreLibrary.Score.Key');
goog.require('ScoreLibrary.Score.Measure');
goog.require('ScoreLibrary.Score.Mover');
goog.require('ScoreLibrary.Score.Note');
goog.require('ScoreLibrary.Score.Part');
goog.require('ScoreLibrary.Score.PartGroup');
goog.require('ScoreLibrary.Score.PartList');
goog.require('ScoreLibrary.Score.PartSymbol');
goog.require('ScoreLibrary.Score.Rest');
goog.require('ScoreLibrary.Score.Source');
goog.require('ScoreLibrary.Score.Staff');
goog.require('ScoreLibrary.Score.Time');
goog.require('ScoreLibrary.Score.Unknown');
goog.require('goog.asserts');

/**
 * @constructor
 */
ScoreLibrary.Score.ElementFactory = function() {
};

ScoreLibrary.Score.ElementFactory.prototype.toString = function() {

    return 'ScoreElementFactory';
};

ScoreLibrary.Score.ElementFactory.prototype.create =
    function(owner, index, node, type) {

    node = ScoreLibrary.Score.Node.prototype.isPrototypeOf(node) ?
        node : new ScoreLibrary.Score.Node(node);

    var element = undefined;

    switch (type) {

    case 'rest': {

        element = new ScoreLibrary.Score.Rest(owner, node);
    } break;

    case 'chord': {

        element = new ScoreLibrary.Score.Chord(owner, node);
    } break;

    case 'barline': {

        element = new ScoreLibrary.Score.Barline(owner, node);
    } break;

    case undefined:
    default: {

        if (node.is('score-partwise')) {

            element = new ScoreLibrary.Score.Source(node);
        }
        else if (node.is('part-list')) {

            element = new ScoreLibrary.Score.PartList(owner, node);
        }
        else if (node.is('score-part')) {

            element = new ScoreLibrary.Score.PartList.Item(owner, node);
        }
        else if (node.is('part-group')) {

            element = new ScoreLibrary.Score.PartGroup(owner, node);
        }
        else if (node.is('part-symbol')) {

            element = new ScoreLibrary.Score.PartSymbol(owner, node);
        }
        else if (node.is('part')) {

            element = new ScoreLibrary.Score.Part(owner, node);
        }
        else if (node.is('measure')) {

            element = new ScoreLibrary.Score.Measure(owner, node);
        }
        else if (node.is('note')) {

            element = new ScoreLibrary.Score.Note(owner, node);
        }
        else if (node.is('direction')) {

            element = new ScoreLibrary.Score.Direction(owner, node);
        }
        else if (node.is('harmony')) {

            element = new ScoreLibrary.Score.Harmony(owner, node);
        }
        else if (node.is('backup') || node.is('forward')) {

            element = new ScoreLibrary.Score.Mover(owner, node);
        }
        else if (node.is('staff-details')) {

            element = new ScoreLibrary.Score.Staff(owner, node);
        }
        else if (node.is('clef')) {

            element = new ScoreLibrary.Score.Clef(owner, node);
        }
        else if (node.is('key')) {

            element = new ScoreLibrary.Score.Key(owner, node);
        }
        else if (node.is('time')) {

            element = new ScoreLibrary.Score.Time(owner, node);
        }
        else if (node.is('attributes')) {

            element = new ScoreLibrary.Score.Attributes(owner, node);
        }
        else if (node.is('barline')) {

            element = new ScoreLibrary.Score.Barline(owner, node);
        }
        else {

            element = new ScoreLibrary.Score.Unknown(owner, node);
        }
    } break;
    }

    return element;
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
