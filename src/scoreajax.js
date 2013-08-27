goog.provide('ScoreLibrary.MusicXMLLoader');
goog.require('ScoreLibrary');
goog.require('ScoreLibrary.Inflater');
goog.require('ScoreLibrary.MusicXMLMIMETypes');

/**
 * @constructor
 */
ScoreLibrary.MusicXMLLoader =
    function(file_or_ref, context, successCallback, errorCallback) {

        this.musicxml_ref =
            (typeof file_or_ref === 'object' ?
             file_or_ref.name : file_or_ref);

        this.want_compressed =
            (/.*\.mxl$/.test(this.musicxml_ref) ? true : false);

        this.context = context;
        this.successCallback = successCallback;
        this.errorCallback = errorCallback;
    };

ScoreLibrary.MusicXMLLoader.prototype.getMIMEType = function() {

    var mime_types = ScoreLibrary.MusicXMLMIMETypes;

    return (this.want_compressed ? mime_types.MIME_MXL : mime_types.MIME_XML);
};

ScoreLibrary.MusicXMLLoader.prototype.getDataType = function() {

    return (this.want_compressed ? 'mxl' : 'xml');
};

ScoreLibrary.MusicXMLLoader.prototype.callbackSuccess = function(result) {

    if (this.want_compressed) {

        new ScoreLibrary.Inflater(
            result,
            this.context,
            this.successCallback,
            this.errorCallback);
    }
    else {

        this.successCallback.call(this.context, result);
    }
};

/**
 * @constructor
 * @extends {ScoreLibrary.MusicXMLLoader}
 */
ScoreLibrary.FileMusicXML =
    function(musicxml_file, context, successCallback, errorCallback) {

        var supperclass = ScoreLibrary.FileMusicXML.supperclass;

        supperclass.constructor.call(
            this, musicxml_file, context, successCallback, errorCallback);

        this.musicxml_file = musicxml_file;

        this.load();
    };

ScoreLibrary.inherited(ScoreLibrary.FileMusicXML, ScoreLibrary.MusicXMLLoader);

ScoreLibrary.FileMusicXML.prototype.load = function() {

    var reader = new FileReader();

    var loader = this;

    reader.onload = function(event) {

        loader.callbackSuccess(event.target.result);
    };
    reader.onerror = loader.callbackError;

    reader.readAsBinaryString(this.musicxml_file);
};

ScoreLibrary.FileMusicXML.prototype.callbackError =
    function(errorThrown) {

        this.errorCallback.call(this.context, errorThrown);
    };

/**
 * @constructor
 * @extends {ScoreLibrary.MusicXMLLoader}
 */
ScoreLibrary.AjaxMusicXML =
    function(musicxml_ref, context, successCallback, errorCallback) {

        var supperclass = ScoreLibrary.AjaxMusicXML.supperclass;

        supperclass.constructor.call(
            this, musicxml_ref, context, successCallback, errorCallback);

        this.load();
    };

ScoreLibrary.inherited(ScoreLibrary.AjaxMusicXML, ScoreLibrary.MusicXMLLoader);

ScoreLibrary.AjaxMusicXML.prototype.load = function() {

    $.ajax({
        'url': this.musicxml_ref,
        'type': 'GET',
        'mimeType': this.getMIMEType(),
        'dataType': this.getDataType(),
        'context': this,
        'success': this.callbackSuccess,
        'error': this.callbackError
    });
};

ScoreLibrary.AjaxMusicXML.prototype.callbackError =
    function(jqXHR, textStatus, errorThrown) {

        this.errorCallback.call(this.context, errorThrown);
    };

(ScoreLibrary.AjaxMusicXML.initialize = function() {

    $.ajaxSetup({

        'contents': {

            'xml': /.*musicxml\+xml$/,
            'mxl': /.*musicxml$/
        },
        'converters': {

            'text mxl': true
        }
    });

    $.ajaxPrefilter(
        'mxl', function(options, originalOptions, jqXHR) {

            options['mimeType'] = 'text/plain; charset=x-user-defined';
        });
})();

ScoreLibrary.MusicXMLLoader.create =
    function(file_or_ref, context, successCallback, errorCallback) {

        return (typeof file_or_ref === 'object' ?
                new ScoreLibrary.FileMusicXML(
                    file_or_ref, context, successCallback, errorCallback) :
                new ScoreLibrary.AjaxMusicXML(
                    file_or_ref, context, successCallback, errorCallback));
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
