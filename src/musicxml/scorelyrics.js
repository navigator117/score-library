goog.provide('ScoreLibrary.Score.Lyric');
goog.provide('ScoreLibrary.Score.StaffLyrics');
goog.require('ScoreLibrary.Renderer.HBoxGlyph');
goog.require('ScoreLibrary.Score');
goog.require('ScoreLibrary.Score.TextAnchor');

/**
 * @constructor
 * @extends {ScoreLibrary.Score.TextAnchor}
 */
ScoreLibrary.Score.Lyric = function(number, information) {

    var supperclass = ScoreLibrary.Score.Lyric.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.Lyric,
    ScoreLibrary.Score.TextAnchor);

ScoreLibrary.Score.Lyric.prototype.toString = function() {

    return 'Score.Lyric';
};

ScoreLibrary.Score.Lyric.prototype.toNodeString = function() {

    return 'lyric';
};

ScoreLibrary.Score.Lyric.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.Lyric(this.number, this.information);

    var supperclass = ScoreLibrary.Score.Lyric.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Score.Lyric.prototype.getSyllabic = function() {

    return (this.information.syllabic || 'single');
};

ScoreLibrary.Score.Lyric.prototype.isExtend = function() {

    return (this.information.extend ? true : false);
};

/**
 * @constructor
 * @extends {ScoreLibrary.Score.Connector}
 */
ScoreLibrary.Score.StaffLyrics = function(number, information) {

    var supperclass = ScoreLibrary.Score.StaffLyrics.supperclass;

    supperclass.constructor.call(this, number, information);
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.StaffLyrics,
    ScoreLibrary.Score.Connector);

ScoreLibrary.Score.StaffLyrics.prototype.isValidType = function(type) {

    return (/(start|continue|stop)/.test(type));
};

ScoreLibrary.Score.StaffLyrics.prototype.isBeginType = function(type) {

    return 'start' === type;
};

ScoreLibrary.Score.StaffLyrics.prototype.isEndType = function(type) {

    return 'stop' === type;
};

ScoreLibrary.Score.StaffLyrics.prototype.toString = function() {

    return 'Score.StaffLyrics';
};

ScoreLibrary.Score.StaffLyrics.prototype.toNodeString = function() {

    return 'staff-lyrics';
};

ScoreLibrary.Score.StaffLyrics.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.StaffLyrics(this.number, this.information);

    var supperclass = ScoreLibrary.Score.StaffLyrics.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Score.StaffLyrics.prototype.getDirection = function() {

    return 'lower';
};

ScoreLibrary.Score.StaffLyrics.prototype.addLyric = function(lyric) {

    this.lyrics = this.lyrics || [];

    this.lyrics.push(lyric);

    this.max_lyric_number = this.max_lyric_number || 1;
    this.max_lyric_number = Math.max(this.max_lyric_number, lyric.getNumber());
};

ScoreLibrary.Score.StaffLyrics.prototype.getNotes = function() {

    if (this.lyrics) {

        var notes0 = this.lyrics[0].getNotes();
        var notes1 = this.lyrics[this.lyrics.length - 1].getNotes();

        return [notes0[0], notes1[notes1.length - 1]];
    }

    var supperclass = ScoreLibrary.Score.StaffLyrics.supperclass;

    return supperclass.getNotes.call(this);
};

ScoreLibrary.Score.StaffLyrics.prototype.setComposeArguments =
    function(staff_stream, extra_space) {

        this.staff_stream = staff_stream;
        this.extra_space = extra_space;
    };

ScoreLibrary.Score.StaffLyrics.prototype.createRenderer = function(context) {

    var lyrics_renderer = new ScoreLibrary.Renderer.HBoxGlyph('StaffLyrics');

    var notes = this.getNotes();

    if (notes && notes.length > 0) {

        var note0_renderer = notes[0].getRenderer();

        var fix_org_coord = 'staff_lyrics';

        var x0 = this.staff_stream.calcChildOffset(
            note0_renderer, this.extra_space);

        lyrics_renderer.setOrg(fix_org_coord, 'x', x0);
        lyrics_renderer.setOrg(fix_org_coord, 'y', 0);

        if (this.lyrics) {

            var prev_xs = undefined;

            this.lyrics.forEach(
                function(lyric, index, lyrics) {

                    var lyric_renderer = lyric.createRenderer(context);

                    var lyric_notes = lyric.getNotes();

                    if (!lyric_notes || lyric_notes.length <= 0) {

                        return;
                    }

                    var note1_renderer = lyric_notes[0].getRenderer();

                    var x = this.staff_stream.calcChildOffset(
                        note1_renderer, this.extra_space);

                    var y = (this.max_lyric_number -
                             lyric.getNumber()) *
                        lyric_renderer.getRequisite('height');

                    if (index > 0) {

                        var syllabic = lyric.getSyllabic();

                        var prev_lyric = lyrics[index - 1];

                        var prev_x = prev_xs[lyric.getNumber() - 1];

                        if (prev_x !== undefined &&
                            (syllabic === 'middle' || syllabic === 'end')) {

                            var textbox =
                                new ScoreLibrary.Renderer.TextBox('left');

                            textbox.setText('-', lyric.getFont(), context);

                            textbox.setOrg(
                                fix_org_coord, 'x',
                                prev_x + (x - prev_x -
                                          textbox.getRequisite('width')) * 0.5);

                            textbox.setOrg(fix_org_coord, 'y', y);

                            lyrics_renderer.pack(
                                textbox, false, false, 0, 0, fix_org_coord);
                        }
                    }

                    lyric_renderer.setOrg(fix_org_coord, 'x', x);
                    lyric_renderer.setOrg(fix_org_coord, 'y', y);

                    lyrics_renderer.pack(
                        lyric_renderer, false, false, 0, 0, fix_org_coord);

                    var prev_x = x + lyric_renderer.getRequisite('width');

                    prev_xs = prev_xs || [];
                    prev_xs[lyric.getNumber() - 1] = prev_x;

                    if (lyric.isExtend()) {

                        var textbox =
                            new ScoreLibrary.Renderer.TextBox('left');

                        textbox.setText(' __', lyric.getFont(), context);

                        textbox.setOrg(fix_org_coord, 'x', prev_x);
                        textbox.setOrg(fix_org_coord, 'y', y);

                        lyrics_renderer.pack(
                            textbox, false, false, 0, 0, fix_org_coord);
                    }
                }, this);
        }

    }

    this.setRenderer(lyrics_renderer);

    return lyrics_renderer;
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
