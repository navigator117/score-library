goog.provide('ScoreLibrary.Renderer.Part');
goog.require('ScoreLibrary.Renderer');
goog.require('ScoreLibrary.Renderer.DurationBox');
goog.require('ScoreLibrary.Renderer.VBox');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Renderer.VBox}
 * @extends {ScoreLibrary.DurationMapper}
 */
ScoreLibrary.Renderer.Part = function() {

    var supperclass = ScoreLibrary.Renderer.Part.supperclass;

    supperclass.constructor.call(this);
};

ScoreLibrary.inherited(
    ScoreLibrary.Renderer.Part,
    ScoreLibrary.Renderer.VBox);

ScoreLibrary.delegate(ScoreLibrary.Renderer.Part,
                      ScoreLibrary.DurationMapper);

ScoreLibrary.Renderer.Part.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Renderer.Part();

    var supperclass = ScoreLibrary.Renderer.Part.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Renderer.Part.prototype.toString = function() {

    return 'Renderer.Part';
};

ScoreLibrary.Renderer.Part.prototype.getSpaceAboveStaves = function() {

    var tunnel_states = this.getModel().getTunnelStates();

    var staff = tunnel_states.getStaffByNumber(1);

    return (this.getOrg('staff', 'y') + this.getRequisite('height') -
            staff.getYOfLineInStaffCoord(staff.getNumberOfLines()));
};

ScoreLibrary.Renderer.Part.prototype.getSpaceBelowStaves = function() {

    var tunnel_states = this.getModel().getTunnelStates();

    var staff =
        tunnel_states.getStaffByNumber(tunnel_states.getNumberOfStaves());

    return staff.getYOfLineInStaffCoord(1) - this.getOrg('staff', 'y');
};

ScoreLibrary.Renderer.Part.prototype.getSpaceOfStaves = function() {

    var tunnel_states = this.getModel().getTunnelStates();

    var staff_hi = tunnel_states.getStaffByNumber(1);

    var staff_lo =
        tunnel_states.getStaffByNumber(tunnel_states.getNumberOfStaves());

    return (staff_hi.getYOfLineInStaffCoord(staff_hi.getNumberOfLines()) -
            staff_lo.getYOfLineInStaffCoord(1));
};

ScoreLibrary.Renderer.Part.prototype.extendBarlines = function(barline_height) {

    this.findChild(
        function(child, index, children) {

            child.findChild(
                function(childchild) {

                    if (ScoreLibrary.Renderer.Barline.prototype.isPrototypeOf(
                        childchild)) {

                        childchild.extendHeight(barline_height);
                    }
                }, this);

            return false;
        }, this);
};

ScoreLibrary.Renderer.Part.prototype.getMapper = function() {

    return this.getDelegate();
};

ScoreLibrary.Renderer.Part.prototype.setMapper = function(mapper) {

    this.setDelegate(mapper);
};

ScoreLibrary.Renderer.Part.prototype.findStaffStream =
    function(staff_number, create) {

        staff_number = staff_number || 1;

        create = create || false;

        var target_stream = undefined;

        this.findChild(
            function(child, index, children) {

                if (child.staff_number === staff_number) {

                    target_stream = child;

                    return true;
                }

                return false;
            }, this);

        if (!target_stream && create) {

            target_stream =
                new ScoreLibrary.Renderer.DurationBox();

            target_stream.staff_number = staff_number;

            target_stream.setMapper(this.getMapper());

            target_stream.part_index = this.part_index;

            var stream_id = '';

            stream_id += 'p';
            stream_id += this.part_index;
            stream_id += 's';
            stream_id += staff_number;

            target_stream.stream_id = stream_id;

            this.addChild(target_stream);
        }

        return target_stream;
    };

ScoreLibrary.Renderer.Part.prototype.stackUpStaffStreams = function() {

    var staff_streams = this.clearChildren();

    staff_streams.sort(
        function(staff_stream1, staff_stream2) {
            return (staff_stream1.staff_number - staff_stream2.staff_number);
        });

    staff_streams.forEach(
        function(staff_stream) {

            staff_stream.pack_filling_max = true;

            fix_org_coord = 'staff';

            this.pack(staff_stream, false, false, 0, 0, fix_org_coord);
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
