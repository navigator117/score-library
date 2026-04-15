# CBOR ↔ MusicXML Mapping Specification

**Version:** 1.0  
**Date:** 2026-04-15  
**Status:** Implemented

## Overview

This document defines the bidirectional mapping between MusicXML (XML) and the Score Document Model (SDM), and the encoding of SDM as CBOR (Concise Binary Object Representation, RFC 8949).

The pipeline:

```
MusicXML (.xml) ⟷ SDM (in-memory) ⟷ CBOR (.scorecbor)
```

## Design Principles

1. **Lossless round-trip:** XML → SDM → CBOR → SDM → XML produces semantically identical output
2. **Compact encoding:** CBOR uses short integer keys instead of verbose XML element names
3. **Streaming-friendly:** Top-level structure is a CBOR map, parts/measures are arrays
4. **Format-neutral SDM:** The SDM is a plain JavaScript object graph with no XML or CBOR dependencies

## Score Document Model (SDM) Schema

### Top Level

```javascript
{
  version: "1.0",              // SDM format version
  metadata: { ... },           // Title, composer, encoding info
  defaults: { ... },           // Page layout, scaling
  credits: [ ... ],            // Title/composer credits for page rendering
  partList: [ ... ],           // Part definitions (instruments)
  parts: [ ... ]               // Part data (measures and notes)
}
```

### metadata

```javascript
{
  workTitle: "string",
  creator: { type: "composer", text: "string" },
  rights: "string",
  encoding: {
    date: "YYYY-MM-DD",
    software: "string"
  }
}
```

### defaults

```javascript
{
  scaling: {
    millimeters: number,
    tenths: number
  },
  pageLayout: {
    pageHeight: number,
    pageWidth: number,
    margins: {
      left: number,
      right: number,
      top: number,
      bottom: number
    }
  }
}
```

### credits

```javascript
[
  {
    page: number,
    type: "title" | "composer" | "lyricist" | ...,
    words: {
      text: "string",
      defaultX: number,
      defaultY: number,
      fontSize: number,
      justify: "left" | "center" | "right",
      valign: "top" | "middle" | "bottom"
    }
  }
]
```

### partList

```javascript
[
  {
    id: "P1",
    name: "Classical Guitar",
    abbreviation: "Gtr.",
    instrument: {
      id: "P1-I1",
      name: "Classical Guitar"
    },
    midi: {
      channel: 1,
      program: 25
    }
  }
]
```

### parts → measures → elements

```javascript
[
  {
    id: "P1",
    measures: [
      {
        number: "1",
        attributes: {
          divisions: 4,
          key: { fifths: 1, mode: "minor" },
          time: { beats: 3, beatType: 4, symbol: null },
          clef: { sign: "G", line: 2 }
        },
        elements: [
          // Direction (dynamics, tempo, wedge, words)
          {
            type: "direction",
            placement: "below",
            directionType: "dynamics",
            dynamics: "p"
          },
          {
            type: "direction",
            placement: "above",
            directionType: "metronome",
            beatUnit: "quarter",
            perMinute: 72
          },
          {
            type: "direction",
            placement: "above",
            directionType: "words",
            text: "Andante",
            fontStyle: "italic",
            fontSize: 10
          },
          {
            type: "direction",
            placement: "below",
            directionType: "wedge",
            wedgeType: "crescendo"  // or "diminuendo", "stop"
          },
          // Note
          {
            type: "note",
            pitch: { step: "B", octave: 3, alter: 0 },
            duration: 8,
            voice: 1,
            noteType: "half",
            stem: "up",
            dots: 0,
            grace: null,
            notations: {
              slurs: [{ type: "start", number: 1, placement: "above" }],
              tied: [{ type: "start" }],
              articulations: ["accent", "staccato"],
              technical: {
                fingering: [{ text: "1", placement: "above" }]
              },
              fermata: { type: "upright" }
            },
            beams: [{ number: 1, type: "begin" }]
          },
          // Rest
          {
            type: "rest",
            duration: 4,
            voice: 1,
            noteType: "quarter",
            displayStep: "B",
            displayOctave: 4
          },
          // Backup (voice switch)
          {
            type: "backup",
            duration: 12
          },
          // Forward
          {
            type: "forward",
            duration: 4
          },
          // Barline
          {
            type: "barline",
            location: "right",
            barStyle: "light-heavy",
            repeat: { direction: "backward" },
            ending: { number: "1", type: "stop" }
          }
        ]
      }
    ]
  }
]
```

## CBOR Key Mapping

To minimize binary size, SDM property names are mapped to short integer keys in CBOR.

### Top-Level Keys

| SDM Key      | CBOR Key | Type   |
|-------------|----------|--------|
| version     | 0        | string |
| metadata    | 1        | map    |
| defaults    | 2        | map    |
| credits     | 3        | array  |
| partList    | 4        | array  |
| parts       | 5        | array  |

### Metadata Keys

| SDM Key      | CBOR Key | Type   |
|-------------|----------|--------|
| workTitle   | 0        | string |
| creator     | 1        | map    |
| rights      | 2        | string |
| encoding    | 3        | map    |

### Element Type Codes

| Element Type | Code |
|-------------|------|
| note        | 0    |
| rest        | 1    |
| backup      | 2    |
| forward     | 3    |
| direction   | 4    |
| barline     | 5    |
| attributes  | 6    |

### Note Property Keys

| SDM Key      | CBOR Key |
|-------------|----------|
| type        | 0        |
| pitch       | 1        |
| duration    | 2        |
| voice       | 3        |
| noteType    | 4        |
| stem        | 5        |
| dots        | 6        |
| grace       | 7        |
| notations   | 8        |
| beams       | 9        |

### Pitch Keys

| SDM Key | CBOR Key |
|---------|----------|
| step    | 0        |
| octave  | 1        |
| alter   | 2        |

### Step Encoding

Steps are encoded as integers 0-6:

| Step | Code |
|------|------|
| C    | 0    |
| D    | 1    |
| E    | 2    |
| F    | 3    |
| G    | 4    |
| A    | 5    |
| B    | 6    |

## File Format

A `.scorecbor` file contains:

1. **Magic bytes:** `0x53 0x43 0x4F 0x52` ("SCOR")
2. **Version byte:** `0x01`
3. **CBOR payload:** RFC 8949 encoded SDM

## Implementation Notes

- The SDM converter (`sdm-musicxml.js`) handles bidirectional conversion
- The CBOR codec uses a minimal built-in encoder/decoder (no external dependency)
- The CBOR codec supports: unsigned/negative integers, byte strings, text strings, arrays, maps, floats, null, true, false
- Round-trip tests validate: XML → SDM → CBOR → SDM → XML produces identical rendering
