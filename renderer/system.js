goog.provide('ScoreLibrary.Renderer.System');
goog.require('ScoreLibrary.DurationMapper');
goog.require('ScoreLibrary.Renderer');
goog.require('ScoreLibrary.Renderer.VBox');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Renderer.VBox}
 * @extends {ScoreLibrary.DurationMapper}
 */
ScoreLibrary.Renderer.System = function() {

    var supperclass = ScoreLibrary.Renderer.System.supperclass;

    supperclass.constructor.call(this);
};

ScoreLibrary.inherited(
    ScoreLibrary.Renderer.System,
    ScoreLibrary.Renderer.VBox);

ScoreLibrary.delegate(ScoreLibrary.Renderer.System,
                      ScoreLibrary.DurationMapper);

ScoreLibrary.Renderer.System.prototype.toString = function() {

    return 'Renderer.System';
};

ScoreLibrary.Renderer.System.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Renderer.System();

    var supperclass = ScoreLibrary.Renderer.System.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Renderer.System.prototype.stackUpPartRenderer =
    function(part_id, part_renderer) {
        this.part_renderers = this.part_renderers || {};

        if (this.part_renderers[part_id] === undefined) {

            this.part_renderers[part_id] = part_renderer;

            part_renderer.pack_filling_max = true;

            this.pack(part_renderer, false, false, 0, 0);

            return true;
        }

        return false;
    };

ScoreLibrary.Renderer.System.prototype.getPartRendererById = function(part_id) {

    return this.part_renderers[part_id];
};

ScoreLibrary.Renderer.System.BoundaryType = {

    Upper: 0,
    StaffUpper: 1,
    StaffCenter: 2,
    StaffLower: 3,
    Lower: 4,
    isValid: function(type) {

        return (type === ScoreLibrary.Renderer.System.BoundaryType.Upper ||
                type === ScoreLibrary.Renderer.System.BoundaryType.StaffUpper ||
                type ===
                ScoreLibrary.Renderer.System.BoundaryType.StaffCenter ||
                type === ScoreLibrary.Renderer.System.BoundaryType.StaffLower ||
                type === ScoreLibrary.Renderer.System.BoundaryType.Lower);
    }
};

ScoreLibrary.Renderer.System.prototype.getPartRendererBoundary =
    function(part_renderer, type) {

        goog.asserts.assert(
            ScoreLibrary.Renderer.System.BoundaryType.isValid(type),
            'ScoreLibrary.Renderer.System.getPartRendererBoundary(): ' +
                'invalid arguments!');

        var y = 0;

        this.findChild(

            function(child, index, children) {

                if (type === ScoreLibrary.Renderer.System.BoundaryType.Upper ||
                    type ===
                    ScoreLibrary.Renderer.System.BoundaryType.StaffUpper ||
                    type ===
                    ScoreLibrary.Renderer.System.BoundaryType.StaffCenter) {

                    y += child.getRequisite('height');
                }

                if (child === part_renderer) {

                    if (type ===
                        ScoreLibrary.Renderer.System.BoundaryType.StaffUpper) {

                        y -= part_renderer.getSpaceAboveStaves();
                    }
                    else if (type ===
                             ScoreLibrary.Renderer.System.BoundaryType.
                             StaffLower) {

                        y += part_renderer.getSpaceBelowStaves();
                    }
                    else if (type ===
                             ScoreLibrary.Renderer.System.BoundaryType.
                             StaffCenter) {

                        y -= (part_renderer.getSpaceAboveStaves() +
                              part_renderer.getSpaceOfStaves() * 0.5);
                    }

                    return true;
                }

                if (type === ScoreLibrary.Renderer.System.BoundaryType.Lower ||
                    type === ScoreLibrary.Renderer.System.BoundaryType.
                    StaffLower) {

                    y += child.getRequisite('height');
                }

                return false;

            }, this);

        return y;
    };

ScoreLibrary.Renderer.System.prototype.dump = function(indent, logger) {

    var supperclass = ScoreLibrary.Renderer.System.supperclass;

    supperclass.dump.call(this, indent, logger);

    if (this.isDebugDump()) {

        this.dumpMapper(indent, logger);
    }
};

ScoreLibrary.Renderer.System.prototype.dumpMapper = function(indent, logger) {

    indent = indent || 0;
    logger = logger || ScoreLibrary.Logger;

    var dumpRecursively =
        ScoreLibrary.Renderer.Paintable.dumpRecursively;

    var indentText =
        ScoreLibrary.Renderer.Paintable.indentText;

    var mapper = {
    };

    mapper.cur_duration = this.getCurDuration();
    mapper.max_duration = this.getMaxDuration();
    mapper.acc_duration = this.getAccDuration();

    mapper.acc_stack = this.acc_stack;

    mapper.key_durations = {};

    var key_durations = this.getKeyDurations();

    key_durations.forEach(
        function(key_duration) {
            mapper.key_durations[key_duration] =
                this.getInformation(key_duration, true);
        }, this);

    dumpRecursively(mapper, indent, logger, true);
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
