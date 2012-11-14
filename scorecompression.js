goog.provide('ScoreLibrary.Inflater');
goog.provide('ScoreLibrary.MusicXMLMIMETypes');
goog.require('ScoreLibrary');
goog.require('ScoreLibrary.Score.Node');
goog.require('ScoreLibrary.Score.XMLHelper');

/**
 * @enum {string}
 */
ScoreLibrary.MusicXMLMIMETypes = {

    MIME_MXL: 'application/vnd.recordare.musicxml',
    MIME_XML: 'application/vnd.recordare.musicxml+xml'
};

/**
 * @constructor
 */
ScoreLibrary.Inflater =
    function(text, context, successCallback, errorCallback) {

        this.context = context;
        this.successCallback = successCallback;
        this.errorCallback = errorCallback;

        var inflater = this;

        if (!zip.workerScriptsPath) {

            throw Error('ScoreLibrary.Inflater(): ' +
                        'set zip.workerScriptsPath first!');
        }

        zip.createReader(
            new zip.BlobReader(this.binaryStringToBlob(text)),
            function(reader) {

                inflater.callbackContents(reader);
            },
            function(error) {

                inflater.errorCallback.call(
                    inflater.context, error);
            }
        );
    };

ScoreLibrary.Inflater.prototype.binaryStringToBlob = function(text) {

    var length = text.length;

    var bytes = new Uint8Array(length);

    for (var i = 0; i < length; ++i) {

        bytes[i] = (text.charCodeAt(i) & 0xff);
    }

    var blob_builder = new zip.BlobBuilder();

    blob_builder.append(bytes.buffer);

    var mime_types = ScoreLibrary.MusicXMLMIMETypes;

    return blob_builder.getBlob(mime_types.MIME_MXL);
};

ScoreLibrary.Inflater.prototype.callbackContents = function(reader) {

    var inflater = this;

    reader.getEntries(
        function(entries) {

            var container_entry = undefined;

            if (entries.some(
                function(entry) {

                    if (entry.filename ===
                        'META-INF/container.xml') {

                        container_entry = entry;

                        return true;
                    }

                    return false;
                })) {

                container_entry.getData(
                    new zip.TextWriter(),
                    function(text) {

                        inflater.callbackContainer(reader, entries, text);
                    });
            }
        });
};

ScoreLibrary.Inflater.prototype.callbackContainer =
    function(reader, entries, text) {

        var inflater = this;

        var xml_helper =
            new ScoreLibrary.Score.XMLHelper.getInstance();

        var root_files =
            xml_helper.getMXLContainer(
                new ScoreLibrary.Score.Node(text)).root_files;

        if (root_files &&
            root_files.length > 0 &&
            (root_files[0].media_type ===
             ScoreLibrary.MusicXMLMIMETypes.MIME_XML ||
             root_files[0].media_type === '') &&
            root_files[0].full_path) {

            var musicxml_path = root_files[0].full_path;

            var musicxml_entry = undefined;

            if (entries.some(
                function(entry) {

                    if (entry.filename === musicxml_path) {

                        musicxml_entry = entry;

                        return true;
                    }

                    return false;
                })) {

                musicxml_entry.getData(
                    new zip.TextWriter(),
                    function(text) {

                        inflater.successCallback.call(
                            inflater.context, $.parseXML(text));
                    });

                return;
            }
        }

        this.errorCallback.call(
            this.context,
            'ScoreLibrary.Inflater.callbackContainer(): invalid contents!');
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
