goog.provide('ScoreLibrary.Engraver.LabelGroups');
goog.require('ScoreLibrary.Engraver');
goog.require('ScoreLibrary.Renderer.LabelGroups');

/**
 * @constructor
 */
ScoreLibrary.Engraver.LabelGroups = function(parts, groups) {

    this.parts = parts;
    this.groups = groups;
};

ScoreLibrary.Engraver.LabelGroups.prototype.getRendererWidth =
    function(context, first_system_in_page) {

        this.createPartLabels(context, first_system_in_page);

        this.createPartGroupLabels(context, first_system_in_page);

        var max_label_width = 0;

        var maxLabelWidth = function(labels, width) {

            if (labels) {

                return labels.map(

                    function(label_renderer) {

                        if (label_renderer) {

                            return label_renderer.getRequisite('width');
                        }

                        return 0;
                    }).reduce(

                        function(a, b) {

                            return Math.max(a, b);
                        }, width);
            }

            return width;
        };

        max_label_width =
            maxLabelWidth(this.part_labels, max_label_width);

        max_label_width =
            maxLabelWidth(this.group_labels, max_label_width);

        max_label_width += this.calcGroupRendererX(this.getMaxGroupNumber());

        return max_label_width;
    };

ScoreLibrary.Engraver.LabelGroups.prototype.getRenderer =
    function(system_renderer, context) {

        if (this.label_group_renderer === undefined ||
            this.save_system_renderer !== system_renderer) {

            this.label_group_renderer = undefined;
            this.save_system_renderer = system_renderer;

            if (this.parts) {

                this.label_group_renderer =
                    new ScoreLibrary.Renderer.LabelGroups();
            }

            this.layoutPartLabels(system_renderer, context);

            this.layoutPartGroupLabels(system_renderer, context);

            if (this.label_group_renderer) {

                this.label_group_renderer.justifyRight();
            }

            this.attachPartGroupConnectors(
                system_renderer,
                context);

            this.attachGrandStaffConnectors(
                system_renderer,
                context);

            this.attachPartSystemLine(
                system_renderer,
                context);
        }

        return this.label_group_renderer;
    };

ScoreLibrary.Engraver.LabelGroups.prototype.createPartLabels =
    function(context, first_system_in_page) {

        if (this.parts && this.parts.length > 1) {

            this.part_labels =
                this.parts.map(

                    function(part, index, parts) {

                        var part_name =
                            (first_system_in_page ?
                             part.getName() : part.getAbbrev());

                        if (part_name) {

                            var label_renderer =
                                new ScoreLibrary.Renderer.TextBox(
                                    'right', 'middle', 5);

                            label_renderer.setText(
                                part_name, 'Serif 12 Bold', context);

                            return label_renderer;
                        }

                        return undefined;
                    }, this);
        }
    };

ScoreLibrary.Engraver.LabelGroups.prototype.layoutPartLabels =
    function(system_renderer, context) {

        if (this.part_labels) {

            this.part_labels.forEach(

                function(label_renderer, index) {

                    if (label_renderer) {

                        this.label_group_renderer.attachPartLabel(
                            this.parts[index],
                            label_renderer, system_renderer, context);
                    }
                }, this);
        }
    };

ScoreLibrary.Engraver.LabelGroups.prototype.createPartGroupLabels =
    function(context, first_system_in_page) {

        if (this.groups) {

            this.group_labels =
                this.groups.map(

                    function(part_group, index) {

                        var group_name =
                            (first_system_in_page ?
                             part_group.group_name : part_group.getAbbrev());

                        if (group_name) {

                            var label_renderer =
                                new ScoreLibrary.Renderer.TextBox(
                                    'left', 'middle', 5);

                            label_renderer.setText(
                                group_name, 'Serif 12 Bold', context);

                            return label_renderer;
                        }

                        return undefined;
                    });
        }
    };

ScoreLibrary.Engraver.LabelGroups.prototype.layoutPartGroupLabels =
    function(system_renderer, context) {

        if (this.group_labels) {

            this.group_labels.forEach(

                function(label_renderer, index) {

                    if (label_renderer) {

                        this.label_group_renderer.attachPartGroupLabel(
                            this.groups[index],
                            label_renderer, system_renderer, context);
                    }
                }, this);
        }
    };

ScoreLibrary.Engraver.LabelGroups.prototype.getMaxGroupNumber = function() {

    if (this.groups) {

        return this.groups.map(

            function(group) {

                return group.number;

            }, this).reduce(
                function(n1, n2) {

                    return Math.max(n1, n2);
                }, 1);
    }

    return 1;
};

ScoreLibrary.Engraver.LabelGroups.prototype.calcGroupRendererX =
    function(group_number) {

        var group_spacing = 10;

        return (this.getMaxGroupNumber() - group_number) * group_spacing;
    };

ScoreLibrary.Engraver.LabelGroups.prototype.attachPartGroupConnectors =
    function(system_renderer, context) {

        if (this.groups) {

            var requisite_width =
                this.label_group_renderer.getRequisite('width');

            this.groups.forEach(

                function(part_group) {

                    var x = requisite_width +
                        this.calcGroupRendererX(part_group.number);

                    this.label_group_renderer.attachPartGroupConnector(
                        part_group, x, system_renderer, context);
                }, this);
        }
    };

ScoreLibrary.Engraver.LabelGroups.prototype.attachGrandStaffConnectors =
    function(system_renderer, context) {

        if (this.parts) {

            var requisite_width =
                this.label_group_renderer.getRequisite('width');

            this.parts.forEach(
                function(part) {

                    var x = requisite_width +
                        this.calcGroupRendererX(this.getMaxGroupNumber());

                    this.label_group_renderer.attachGrandStaffConnector(
                        part, x, system_renderer, context);
                }, this);
        }
    };

ScoreLibrary.Engraver.LabelGroups.prototype.attachPartSystemLine =
    function(system_renderer, context) {

        if (this.parts) {

            var multi_parts =
                (this.parts.length > 1 ? true : false);

            var grand_staff = false;

            if (!multi_parts) {

                var part_renderer =
                    system_renderer.getPartRendererById(this.parts[0].id);

                var tunnel_states = part_renderer.getModel().getTunnelStates();

                grand_staff =
                    (tunnel_states.getNumberOfStaves() > 1 ? true : false);
            }

            if (multi_parts || grand_staff) {

                var requisite_width =
                    this.label_group_renderer.getRequisite('width');

                this.label_group_renderer.attachSystemLine(
                    this.parts, requisite_width, system_renderer, context);
            }
        }
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
