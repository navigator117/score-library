/**
 * @fileoverview add minimum support of zip.js for score-div.
 * @see http://gildas-lormeau.github.com/zip.js/
 * @externs
 */

/**
 * @constructor
 */
function zip() {}

/**
 * @type {Object.<string, *>}
 */
zip.ResultReader;

/**
 * @type {string}
 */
zip.workerScriptsPath;

/**
 * @type {BlobBuilder}
 */
zip.BlobBuilder;

/**
 * @constructor
 */
zip.Reader = function() {};

/**
 * @constructor
 * @extends {zip.Reader}
 * @param {Blob} blob
 */
zip.BlobReader = function(blob) {};

/**
 * @constructor
 */
zip.Writer = function() {};

/**
 * @constructor
 * @extends {zip.Writer}
 */
zip.TextWriter = function() {};

/**
 * @constructor
 */
zip.Entry = function() {};

/**
 * @type {string}
 */
zip.Entry.prototype.filename;

/**
 * @type {boolean}
 */
zip.Entry.prototype.directory;

/**
 * @param {zip.Writer} writer
 * @param {function(!string)=} onend
 * @param {function(number, number)=} onprogress
 * @param {function(boolean)=} checkCrc32
 */
zip.Entry.prototype.getData =
    function(writer, onend, onprogress, checkCrc32) {};

/**
 * @param {function({Array.<zip.Entry>})} callback
 */
zip.ResultReader.getEntries = function(callback) {};

/**
 * @param {zip.Reader} reader
 * @param {function({!zip.ResultReader})} callback
 * @param {function({(Event|string)}):(boolean|undefined)} onerror
 */
zip.createReader = function(reader, callback, onerror) {};
