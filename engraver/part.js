goog.provide('ScoreLibrary.Engraver.Part');
goog.require('ScoreLibrary.Engraver');
goog.require('ScoreLibrary.Engraver.MapInfoTraiter');
goog.require('ScoreLibrary.Renderer.Part');

/**
 * @constructor
 */
ScoreLibrary.Engraver.Part = function(context) {

    this.context = context;
};

ScoreLibrary.Engraver.Part.prototype.engrave =
    function(connector_mgrs, renderers,
             is_last_system, available_system_length) {

    if (!connector_mgrs) {

        return renderers;
    }

    connector_mgrs.forEach(
        function(connector_mgr, index) {

            var part_renderer = renderers[index] ||
                new ScoreLibrary.Renderer.Part();

            var requisite_width = 0;

            part_renderer.findChild(
                function(child) {

                    requisite_width =
                        Math.max(requisite_width,
                                 child.getRequisite('width'));
                    return false;
                }, this);

            var extra_space =
                ((is_last_system ?
                  Math.min(available_system_length,
                           requisite_width *
                           ScoreLibrary.Engraver.Constants.sparsity) :
                  (available_system_length ?
                   available_system_length :
                   requisite_width *
                   ScoreLibrary.Engraver.Constants.sparsity)) -
                 requisite_width);

            var beams = connector_mgr.getConnectors('beam');
            if (beams) {

                this.engraveConnectors(
                    beams, part_renderer, extra_space);
            }

            var other_connectors =
                connector_mgr.getConnectors(/beam|lyric/, true);
            if (other_connectors) {

                this.engraveConnectors(
                    other_connectors, part_renderer, extra_space);
            }

            var lyrics = connector_mgr.getConnectors('lyric');
            if (lyrics) {

                lyrics = this.composeLyrics(lyrics, part_renderer, extra_space);

                this.engraveConnectors(lyrics, part_renderer, extra_space);
            }
        }, this);

    return renderers;
};

ScoreLibrary.Engraver.Part.prototype.fixFretOutlineBBox =
    function(connector_renderer) {

    var width = connector_renderer.getRequisite('width');
    var height = connector_renderer.getRequisite('height');

    connector_renderer.setOutlineBoundbox({

        x_min: -width * 0.5,
        y_min: -height * 0.5,
        x_max: width * 0.5,
        y_max: height * 0.5
    });
};

ScoreLibrary.Engraver.Part.prototype.fixYOnAlternateTAB =
    function(connector, connector_renderer, clef) {

    var string_info = connector.getRealNote().getTechnicals('string');

    var string_number =
        (string_info && string_info[0].text ? Number(string_info[0].text) : 1);

    var outline_bbox =
        connector_renderer.getOutlineBoundbox();

    var y = clef.getYOfStringOnStaff(string_number) + outline_bbox.y_min;

    connector_renderer.setOrg('staff', 'y', y);
};

ScoreLibrary.Engraver.Part.prototype.packConnectorRenderer =
    function(connector, connector_renderer, staff_stream, extra_space) {

    connector_renderer.mapInfoHook =
        new ScoreLibrary.Engraver.MapInfoTraiter();

    connector_renderer.mapInfoHook.setExtraSpace(extra_space);

    staff_stream.pack(
        connector_renderer,
        false, false,
        connector.getXMove(staff_stream, extra_space), 0, 'staff');
};

ScoreLibrary.Engraver.Part.prototype.engraveConnectors =
    function(connectors, part_renderer, extra_space) {

    connectors.forEach(
        function(connector) {

            var is_fret =
                ScoreLibrary.Score.Fret.prototype.isPrototypeOf(connector);
            var is_bend =
                ScoreLibrary.Score.BendList.prototype.isPrototypeOf(connector);
            var is_hammeron =
                ScoreLibrary.Score.HammerOn.prototype.isPrototypeOf(connector);
            var is_slur =
                ScoreLibrary.Score.Slur.prototype.isPrototypeOf(connector);
            var is_tied =
                ScoreLibrary.Score.Tied.prototype.isPrototypeOf(connector);

            var notes = connector.getNotes();

            var staff_number = notes[0].getStaffNumber();

            if (is_fret || is_bend) {

                var clef = notes[0].getClef();
                if (clef.sign === 'TAB') {
                    // !NOTE: already handled in note engraver.
                    return;
                }

                staff_number += 1;

                clef = notes[0].getTunnelStates().getClefByNumber(staff_number);
                if (!clef || clef.sign !== 'TAB') {
                    // !NOTE: Not an alternate TAB, ignored.
                    return;
                }
            }

            var staff_stream =
                part_renderer.findStaffStream(staff_number, false);

            connector.prepareEngrave(
                staff_stream, extra_space);

            var connector_renderer =
                connector.createRenderer(this.context);

            var is_curr_unpaired =
                ((is_slur || is_tied) &&
                 notes.length === 1 &&
                 !connector.isEnded() ? true : false);

            var is_prev_unpaired =
                ((is_slur || is_tied) &&
                 connector.is_prev_unpaired ? true : false);

            connector_renderer.pack_duration =
                (is_prev_unpaired ? 0 : notes[0].getRenderer().pack_duration);

            if (!ScoreLibrary.Score.Anchor.prototype.isPrototypeOf(connector)) {

                if (is_curr_unpaired) {

                    connector.is_curr_unpaired = true;

                    var all_informations =
                        staff_stream.getAllInformations(true);

                    connector_renderer.pack_duration_n =
                        all_informations[
                            all_informations.length - 1].key_duration;
                }
                else {
                    connector_renderer.pack_duration_n =
                        notes[notes.length - 1].getRenderer().pack_duration;
                }
            }

            if (is_fret) {

                this.fixFretOutlineBBox(connector_renderer);
            }

            if (is_fret || is_bend) {

                this.fixYOnAlternateTAB(connector, connector_renderer, clef);
            }

            this.packConnectorRenderer(
                connector, connector_renderer, staff_stream, extra_space);
        }, this);
};

ScoreLibrary.Engraver.Part.prototype.composeLyrics =
    function(lyrics, part_renderer, extra_space) {

    var staff_lyrics = [];

    lyrics.forEach(
        function(lyric) {

            var notes = lyric.getNotes();

            var staff_number = notes[0].getStaffNumber();

            staff_lyrics[staff_number - 1] =
                staff_lyrics[staff_number - 1] || [];

            staff_lyrics[staff_number - 1].push(lyric);
        }, this);

    return staff_lyrics.map(
        function(lyrics, index) {

            var staff_number = index + 1;

            composed = undefined;

            lyrics.forEach(
                function(lyric) {


                    composed = composed ||
                        new ScoreLibrary.Score.StaffLyrics(staff_number);

                    composed.addLyric(lyric);
                });

            if (composed) {

                composed.setComposeArguments(
                    part_renderer.findStaffStream(staff_number, false),
                    extra_space);
            }

            return composed;
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
