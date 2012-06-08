goog.provide('ScoreLibrary.Renderer.Measure');
goog.require('ScoreLibrary.Renderer');
goog.require('ScoreLibrary.Renderer.DurationBox');
goog.require('ScoreLibrary.Renderer.VBox');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Renderer.VBox}
 * @extends {ScoreLibrary.DurationMapper}
 */
ScoreLibrary.Renderer.Measure = function() {

    var supperclass = ScoreLibrary.Renderer.Measure.supperclass;

    supperclass.constructor.call(this);
};

ScoreLibrary.inherited(
    ScoreLibrary.Renderer.Measure,
    ScoreLibrary.Renderer.VBox);

ScoreLibrary.delegate(ScoreLibrary.Renderer.Measure,
                      ScoreLibrary.DurationMapper);

ScoreLibrary.Renderer.Measure.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Renderer.Measure();

    var supperclass = ScoreLibrary.Renderer.Measure.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Renderer.Measure.prototype.toString = function() {

    return 'Renderer.Measure';
};

ScoreLibrary.Renderer.Measure.prototype.extendBarline =
    function(barline_height) {

    this.findChild(
        function(child) {

            if (ScoreLibrary.Renderer.Barline.prototype.isPrototypeOf(child)) {

                child.extendHeight(barline_height);
            }
        }, this);
};

ScoreLibrary.Renderer.Measure.prototype.getMapper = function() {

    return this.getDelegate();
};

ScoreLibrary.Renderer.Measure.prototype.setMapper = function(mapper) {

    this.setDelegate(mapper);
};

ScoreLibrary.Renderer.Measure.prototype.findArea =
    function(staff_number, create) {

    staff_number = staff_number || 1;

    create = create || false;

    var target_area = undefined;

    this.findChild(
        function(child, index, children) {

            if (child.staff_number === staff_number) {

                target_area = child;

                return true;
            }

            return false;
        }, this);

    if (!target_area && create) {

        target_area =
            new ScoreLibrary.Renderer.DurationBox();

        target_area.staff_number = staff_number;

        target_area.setMapper(this.getMapper());

        this.addChild(target_area);
    }

    return target_area;
};

ScoreLibrary.Renderer.Measure.prototype.stackUpAreas = function() {

    var areas = this.clearChildren();

    areas.sort(
        function(area1, area2) {
            return (area1.staff_number - area2.staff_number);
        });

    areas.forEach(
        function(area) {

            area.pack_filling_max = true;

            this.pack(area, false, false, 0, 0);
        }, this);
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
