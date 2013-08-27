goog.provide('ScoreLibrary.Score.Barline');
goog.require('ScoreLibrary.Renderer.Barline');
goog.require('ScoreLibrary.Score');
goog.require('ScoreLibrary.Score.Attributes');
goog.require('ScoreLibrary.Score.DataElement');
goog.require('ScoreLibrary.Score.XMLHelper');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Score.DataElement}
 */
ScoreLibrary.Score.Barline = function(owner, barline_node) {

    var supperclass = ScoreLibrary.Score.Barline.supperclass;

    supperclass.constructor.call(this, owner, barline_node);

    var xml_helper = ScoreLibrary.Score.XMLHelper.getInstance();

    xml_helper.getBarline(this, this);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.Barline,
    ScoreLibrary.Score.DataElement);

ScoreLibrary.Score.Barline.prototype.toString = function() {

    return 'ScoreBarline';
};

ScoreLibrary.Score.Barline.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.Barline(this.owner, this.node);

    var supperclass = ScoreLibrary.Score.Barline.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Score.Barline.prototype.createRenderer = function(glyph_factory) {

    var barline_glyph = new ScoreLibrary.Renderer.Barline();

    this.setRenderer(barline_glyph);

    return barline_glyph;
};

ScoreLibrary.Score.Barline.prototype.getDuration = function() {

    return ScoreLibrary.Score.Element.Constants.dummyDuration;
};

ScoreLibrary.Score.Barline.prototype.getGcdDuration = function() {

    return this.getDuration();
};

ScoreLibrary.Score.Barline.prototype.getLocation = function() {

    return this.location;
};

ScoreLibrary.Score.Barline.prototype.getBarStyle = function() {

    return this.bar_style;
};

ScoreLibrary.Score.Barline.prototype.getConnectors = function(type) {

    goog.asserts.assert(
        (/wavy-line|segno|coda|fermata|ending|repeat/.test(type)),
        'ScoreLibrary.Score.Barline.getConnectors(): invalid arguments!');

    var connectors = undefined;

    if (this[type]) {

        connectors =
            (type === 'fermata' ? this[type] : [this[type]]);
    }

    if (connectors) {

        connectors.sort(
            function(connector1, connector2) {

                return (connector1.number - connector2.number);
            });
    }

    return connectors;
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
