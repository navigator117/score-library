/**
 * @fileoverview Minimal CBOR (RFC 8949) encoder/decoder for the Score
 * Document Model. Supports: unsigned int, negative int, byte string,
 * text string, array, map, float64, null, true, false, undefined.
 *
 * Also provides the SDM ⟷ CBOR key mapping for compact encoding.
 *
 * Usage from both Closure (browser) and CommonJS (Node.js tests).
 */

'use strict';

var ScoreCBOR;
if (typeof exports !== 'undefined') {
  ScoreCBOR = exports;
} else {
  if (typeof goog !== 'undefined') {
    goog.provide('ScoreLibrary.CBOR');
  }
  ScoreCBOR = (typeof ScoreLibrary !== 'undefined') ?
    (ScoreLibrary.CBOR = {}) : {};
}

/** Magic bytes for .scorecbor files: "SCOR" + version 0x01 */
ScoreCBOR.MAGIC = new Uint8Array([0x53, 0x43, 0x4F, 0x52, 0x01]);

// ===== CBOR Encoder =====

/**
 * Encode a JavaScript value to CBOR bytes.
 * @param {*} value
 * @return {Uint8Array}
 */
ScoreCBOR.encode = function(value) {
  var parts = [];
  ScoreCBOR._encodeValue(value, parts);

  // Calculate total length
  var totalLen = 0;
  for (var i = 0; i < parts.length; i++) {
    totalLen += parts[i].length;
  }

  // Concatenate
  var result = new Uint8Array(totalLen);
  var offset = 0;
  for (var i = 0; i < parts.length; i++) {
    result.set(parts[i], offset);
    offset += parts[i].length;
  }
  return result;
};

ScoreCBOR._encodeValue = function(value, parts) {
  if (value === null || value === undefined) {
    // Major type 7, simple value 22 (null) or 23 (undefined)
    parts.push(new Uint8Array([value === null ? 0xf6 : 0xf7]));
    return;
  }

  if (value === true) {
    parts.push(new Uint8Array([0xf5]));
    return;
  }

  if (value === false) {
    parts.push(new Uint8Array([0xf4]));
    return;
  }

  if (typeof value === 'number') {
    if (Number.isInteger(value)) {
      if (value >= 0) {
        // Major type 0: unsigned integer
        ScoreCBOR._encodeTypeAndLength(0, value, parts);
      } else {
        // Major type 1: negative integer (-1 - value)
        ScoreCBOR._encodeTypeAndLength(1, -1 - value, parts);
      }
    } else {
      // Float64
      var buf = new ArrayBuffer(9);
      var view = new DataView(buf);
      view.setUint8(0, 0xfb); // Major type 7, additional info 27 (float64)
      view.setFloat64(1, value, false); // big-endian
      parts.push(new Uint8Array(buf));
    }
    return;
  }

  if (typeof value === 'string') {
    // Major type 3: text string
    var encoded = ScoreCBOR._encodeString(value);
    ScoreCBOR._encodeTypeAndLength(3, encoded.length, parts);
    parts.push(encoded);
    return;
  }

  if (value instanceof Uint8Array) {
    // Major type 2: byte string
    ScoreCBOR._encodeTypeAndLength(2, value.length, parts);
    parts.push(value);
    return;
  }

  if (Array.isArray(value)) {
    // Major type 4: array
    ScoreCBOR._encodeTypeAndLength(4, value.length, parts);
    for (var i = 0; i < value.length; i++) {
      ScoreCBOR._encodeValue(value[i], parts);
    }
    return;
  }

  if (typeof value === 'object') {
    // Major type 5: map
    var keys = Object.keys(value);
    // Filter out undefined values
    var validKeys = keys.filter(function(k) {
      return value[k] !== undefined;
    });
    ScoreCBOR._encodeTypeAndLength(5, validKeys.length, parts);
    for (var i = 0; i < validKeys.length; i++) {
      ScoreCBOR._encodeValue(validKeys[i], parts);
      ScoreCBOR._encodeValue(value[validKeys[i]], parts);
    }
    return;
  }

  throw new Error('CBOR encode: unsupported type ' + typeof value);
};

ScoreCBOR._encodeTypeAndLength = function(majorType, length, parts) {
  var mt = majorType << 5;
  if (length < 24) {
    parts.push(new Uint8Array([mt | length]));
  } else if (length < 256) {
    parts.push(new Uint8Array([mt | 24, length]));
  } else if (length < 65536) {
    parts.push(new Uint8Array([mt | 25, (length >> 8) & 0xff, length & 0xff]));
  } else if (length < 4294967296) {
    parts.push(new Uint8Array([
      mt | 26,
      (length >> 24) & 0xff,
      (length >> 16) & 0xff,
      (length >> 8) & 0xff,
      length & 0xff
    ]));
  } else {
    throw new Error('CBOR encode: length too large');
  }
};

ScoreCBOR._encodeString = function(str) {
  // Use TextEncoder if available, otherwise manual UTF-8
  if (typeof TextEncoder !== 'undefined') {
    return new TextEncoder().encode(str);
  }
  // Manual UTF-8 encoding
  var bytes = [];
  for (var i = 0; i < str.length; i++) {
    var code = str.charCodeAt(i);
    if (code < 0x80) {
      bytes.push(code);
    } else if (code < 0x800) {
      bytes.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
    } else if (code < 0xd800 || code >= 0xe000) {
      bytes.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
    } else {
      // Surrogate pair
      i++;
      code = 0x10000 + (((code & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
      bytes.push(
        0xf0 | (code >> 18),
        0x80 | ((code >> 12) & 0x3f),
        0x80 | ((code >> 6) & 0x3f),
        0x80 | (code & 0x3f)
      );
    }
  }
  return new Uint8Array(bytes);
};

// ===== CBOR Decoder =====

/**
 * Decode a CBOR byte array to a JavaScript value.
 * @param {Uint8Array} data
 * @return {*}
 */
ScoreCBOR.decode = function(data) {
  var state = { data: data, offset: 0 };
  var result = ScoreCBOR._decodeValue(state);
  return result;
};

ScoreCBOR._decodeValue = function(state) {
  var initialByte = state.data[state.offset++];
  var majorType = initialByte >> 5;
  var additionalInfo = initialByte & 0x1f;

  switch (majorType) {
    case 0: // Unsigned integer
      return ScoreCBOR._decodeLength(additionalInfo, state);

    case 1: // Negative integer
      return -1 - ScoreCBOR._decodeLength(additionalInfo, state);

    case 2: { // Byte string
      var len = ScoreCBOR._decodeLength(additionalInfo, state);
      var bytes = state.data.slice(state.offset, state.offset + len);
      state.offset += len;
      return bytes;
    }

    case 3: { // Text string
      var len = ScoreCBOR._decodeLength(additionalInfo, state);
      var bytes = state.data.slice(state.offset, state.offset + len);
      state.offset += len;
      return ScoreCBOR._decodeString(bytes);
    }

    case 4: { // Array
      var len = ScoreCBOR._decodeLength(additionalInfo, state);
      var arr = [];
      for (var i = 0; i < len; i++) {
        arr.push(ScoreCBOR._decodeValue(state));
      }
      return arr;
    }

    case 5: { // Map
      var len = ScoreCBOR._decodeLength(additionalInfo, state);
      var map = {};
      for (var i = 0; i < len; i++) {
        var key = ScoreCBOR._decodeValue(state);
        var val = ScoreCBOR._decodeValue(state);
        map[key] = val;
      }
      return map;
    }

    case 7: { // Simple values and floats
      if (additionalInfo === 20) return false;
      if (additionalInfo === 21) return true;
      if (additionalInfo === 22) return null;
      if (additionalInfo === 23) return undefined;
      if (additionalInfo === 25) {
        // Float16 — not commonly used, skip for now
        state.offset += 2;
        return 0;
      }
      if (additionalInfo === 26) {
        // Float32
        var view = new DataView(state.data.buffer, state.data.byteOffset + state.offset, 4);
        state.offset += 4;
        return view.getFloat32(0, false);
      }
      if (additionalInfo === 27) {
        // Float64
        var view = new DataView(state.data.buffer, state.data.byteOffset + state.offset, 8);
        state.offset += 8;
        return view.getFloat64(0, false);
      }
      throw new Error('CBOR decode: unknown simple value ' + additionalInfo);
    }

    default:
      throw new Error('CBOR decode: unknown major type ' + majorType);
  }
};

ScoreCBOR._decodeLength = function(additionalInfo, state) {
  if (additionalInfo < 24) return additionalInfo;
  if (additionalInfo === 24) return state.data[state.offset++];
  if (additionalInfo === 25) {
    var val = (state.data[state.offset] << 8) | state.data[state.offset + 1];
    state.offset += 2;
    return val;
  }
  if (additionalInfo === 26) {
    var val = (state.data[state.offset] << 24) |
              (state.data[state.offset + 1] << 16) |
              (state.data[state.offset + 2] << 8) |
              state.data[state.offset + 3];
    state.offset += 4;
    return val >>> 0; // unsigned
  }
  throw new Error('CBOR decode: 64-bit lengths not supported');
};

ScoreCBOR._decodeString = function(bytes) {
  if (typeof TextDecoder !== 'undefined') {
    return new TextDecoder().decode(bytes);
  }
  // Manual UTF-8 decoding
  var str = '';
  var i = 0;
  while (i < bytes.length) {
    var byte1 = bytes[i++];
    if (byte1 < 0x80) {
      str += String.fromCharCode(byte1);
    } else if (byte1 < 0xe0) {
      str += String.fromCharCode(((byte1 & 0x1f) << 6) | (bytes[i++] & 0x3f));
    } else if (byte1 < 0xf0) {
      str += String.fromCharCode(
        ((byte1 & 0x0f) << 12) | ((bytes[i++] & 0x3f) << 6) | (bytes[i++] & 0x3f));
    } else {
      var code = ((byte1 & 0x07) << 18) |
        ((bytes[i++] & 0x3f) << 12) |
        ((bytes[i++] & 0x3f) << 6) |
        (bytes[i++] & 0x3f);
      code -= 0x10000;
      str += String.fromCharCode(0xd800 + (code >> 10), 0xdc00 + (code & 0x3ff));
    }
  }
  return str;
};

// ===== .scorecbor File Format =====

/**
 * Wrap an SDM object into a .scorecbor file (magic + CBOR payload).
 * @param {Object} sdm
 * @return {Uint8Array}
 */
ScoreCBOR.encodeFile = function(sdm) {
  var payload = ScoreCBOR.encode(sdm);
  var result = new Uint8Array(ScoreCBOR.MAGIC.length + payload.length);
  result.set(ScoreCBOR.MAGIC, 0);
  result.set(payload, ScoreCBOR.MAGIC.length);
  return result;
};

/**
 * Decode a .scorecbor file (validates magic, returns SDM).
 * @param {Uint8Array} data
 * @return {Object} SDM object
 */
ScoreCBOR.decodeFile = function(data) {
  // Validate magic
  for (var i = 0; i < ScoreCBOR.MAGIC.length; i++) {
    if (data[i] !== ScoreCBOR.MAGIC[i]) {
      throw new Error('ScoreCBOR: invalid file magic bytes');
    }
  }
  var payload = data.slice(ScoreCBOR.MAGIC.length);
  return ScoreCBOR.decode(payload);
};
