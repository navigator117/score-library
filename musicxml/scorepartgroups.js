goog.provide('ScoreLibrary.Score.PartGroup');
goog.require('ScoreLibrary.Renderer.Barline');
goog.require('ScoreLibrary.Renderer.HBoxGlyph');
goog.require('ScoreLibrary.Renderer.VBoxGlyph');
goog.require('ScoreLibrary.Score');
goog.require('ScoreLibrary.Score.Element');
goog.require('ScoreLibrary.Score.XMLHelper');
goog.require('goog.asserts');

/**
 * @constructor
 * @extends {ScoreLibrary.Score.Element}
 */
ScoreLibrary.Score.PartGroup = function(owner, part_group_node) {

    var supperclass = ScoreLibrary.Score.PartGroup.supperclass;

    supperclass.constructor.call(
        this, owner, part_group_node);

    if (part_group_node && this.is('part-group')) {

        var xml_helper = ScoreLibrary.Score.XMLHelper.getInstance();

        xml_helper.getPartGroup(this, this);
    }

    this.bar_style = 'regular';
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.PartGroup,
    ScoreLibrary.Score.Element);

ScoreLibrary.Score.PartGroup.prototype.toString = function() {

    return 'Score.PartGroup';
};

ScoreLibrary.Score.PartGroup.prototype.createGroupLine =
    function(glyph_factory, height) {

        var renderer = new ScoreLibrary.Renderer.VBoxGlyph('GroupLine');

        var fix_org_coord = 'groupline';


        var tip_down =
            glyph_factory.createByName(
                'scripts.tenuto',
                10,
                undefined);

        tip_down.setOrg(fix_org_coord, 'x', 0);

        renderer.pack(
            tip_down, false, false, 0, 0, fix_org_coord);



        var barline =
            new ScoreLibrary.Renderer.Barline();

        barline.setModel({
            bar_style: 'regular'
        });

        barline.setLightWeight(2);
        barline.setBarlineHeight(height ? height : 5 * 10);

        barline.setOrg(fix_org_coord, 'x', 0);

        renderer.pack(
            barline, false, false, 0, 0, fix_org_coord);

        var tip_up =
            glyph_factory.createByName(
                'scripts.tenuto',
                10,
                undefined);

        tip_up.setOrg(fix_org_coord, 'x', 0);

        renderer.pack(
            tip_up, false, false, 0, 0, fix_org_coord);

        return renderer;
    };

/**
 * @constructor
 * @extends {ScoreLibrary.Renderer.Barline}
 */
ScoreLibrary.Renderer.GroupBracket = function(tip_up, tip_down, height) {

    var supperclass = ScoreLibrary.Renderer.GroupBracket.supperclass;

    supperclass.constructor.call(this);

    this.tip_up = tip_up;
    this.tip_down = tip_down;

    this.setLightWeight(4);
    this.setBarlineHeight(height);
};

ScoreLibrary.inherited(
    ScoreLibrary.Renderer.GroupBracket,
    ScoreLibrary.Renderer.Barline);

ScoreLibrary.Renderer.GroupBracket.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Renderer.GroupBracket(
            this.tip_up.clone(),
            this.tip_down.clone(),
            this.getBarlineHeight());

    var supperclass = ScoreLibrary.Renderer.GroupBracket.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Renderer.GroupBracket.prototype.draw = function(context) {

    var supperclass = ScoreLibrary.Renderer.GroupBracket.supperclass;

    supperclass.draw.call(this, context);

    var requisite_height = this.tip_down.getRequisite('height');

    context.translate(0, -requisite_height);

    this.tip_down.draw(context);

    context.translate(0, requisite_height + this.getBarlineHeight());

    this.tip_up.draw(context);
};


ScoreLibrary.Score.PartGroup.prototype.createGroupBracket =
    function(glyph_factory, height) {

        var createTipGlyph = function(glyph_name, tip_height) {

            var tip_glyph =
                glyph_factory.createByName(
                    glyph_name,
                    undefined,
                    tip_height);

            tip_glyph.sizeAllocateRecursively({

                width: tip_glyph.getRequisite('width'),
                height: tip_glyph.getRequisite('height')
            });

            return tip_glyph;
        };

        var bracket =
            new ScoreLibrary.Renderer.GroupBracket(
                createTipGlyph('brackettips.up', 10),
                createTipGlyph('brackettips.down', 10),
                height);

        return bracket;
    };

ScoreLibrary.Score.PartGroup.prototype.createRenderer =
    function(glyph_factory, height) {

        var renderer = undefined;

        if (this.group_symbol === 'line') {

            renderer = this.createGroupLine(glyph_factory, height);
        }
        else if (this.group_symbol === 'bracket') {

            renderer = this.createGroupBracket(glyph_factory, height);
        }
        else if (this.group_symbol === 'brace') {

            renderer =
                glyph_factory.createByName(
                    'brace445',
                    undefined, height);
        }

        if (renderer) {

            this.setRenderer(renderer);
        }
        else {

            renderer = null;
        }

        return renderer;
    };

ScoreLibrary.Score.PartGroup.prototype.getName = function() {

    return (this.group_name_display ?
            this.group_name_display : this.group_name);
};

ScoreLibrary.Score.PartGroup.prototype.getAbbrev = function() {

    return (this.group_abbreviation_display ?
            this.group_abbreviation_display :
            (this.group_abbreviation ?
             this.group_abbreviation : this.getName()));
};

ScoreLibrary.Score.PartGroup.prototype.getStartScorePart = function() {

    return this.start_score_part;
};

ScoreLibrary.Score.PartGroup.prototype.getStopScorePart = function() {

    return this.stop_score_part;
};

ScoreLibrary.Score.PartGroup.prototype.getStaffNumber = function() {

    return undefined;
};

ScoreLibrary.Score.PartGroup.prototype.getTopStaffNumber = function() {

    return this.top_staff;
};

ScoreLibrary.Score.PartGroup.prototype.getBottomStaffNumber = function() {

    return this.bottom_staff;
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
