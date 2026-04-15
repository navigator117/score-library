# Score Library — Project Milestones

## Overview

Each milestone delivers a verifiable test page at `test/verify.html` that demonstrates rendering quality. The verification page shows:
- Reference images (expected output)
- Actual rendered output (canvas)
- Pixel-diff comparison with pass/fail status
- Milestone completion checklist

---

## Milestone 0: Development Infrastructure ✅ (Current)

**Goal:** Establish CI/CD, test harness, and verification page.

**Deliverables:**
- [x] GitHub Actions CI workflow
- [x] Test verification HTML page (`test/verify.html`)
- [x] Visual regression testing framework
- [x] Sample MusicXML test files
- [x] Milestone documentation

**Verification:** `test/verify.html` loads and shows the test framework with at least one sample score rendered.

---

## Milestone 1: Bug Fixes & Rendering Accuracy ✅ (Current)

**Goal:** Fix known bugs and ensure pixel-accurate rendering of basic notation.

**Deliverables:**
- [x] Fix `checkRangeOfValue()` logic bug in `xmlhelper.js:402` (`&&` → `||`)
- [x] Fix variable shadowing in `scorediv.js:164,183`
- [x] Fix `showCurrPage()` semantic issue (using `hasNext()` for `hasCurrent()`)
- [x] Add `hasCurrent()` method to `PageListLazyIter`
- [x] Create `basic-clefs.xml` — Treble, bass, alto, tenor clefs
- [x] Create `basic-keys.xml` — Key signatures from 4♭ to 4♯
- [x] Create `basic-time.xml` — 4/4, 3/4, 6/8, common, cut time
- [x] Create `basic-barlines.xml` — Regular, double, repeat, final barlines
- [x] Update unit tests: 17 tests all passing
- [x] Update `test/verify.html` with 8 M1 tests (3 unit + 5 visual)
- [ ] Verify beam grouping accuracy (visual inspection via verify.html)
- [ ] Verify stem direction accuracy (visual inspection via verify.html)

**Test Scores:**
- `test/samples/basic-notes.xml` — All note durations
- `test/samples/basic-clefs.xml` — All clef types
- `test/samples/basic-keys.xml` — Major/minor key signatures
- `test/samples/basic-time.xml` — Time signatures

**Verification:** All test scores render with <2% pixel deviation from reference images.

---

## Milestone 2: Classical Guitar Score ✅ (Current)

**Goal:** Render a complete classical guitar piece with professional quality.

**Deliverables:**
- [x] Multi-voice rendering (melody + bass in single staff)
- [x] Fingering notation (0-4 for left hand)
- [x] Slurs and ties across measures
- [x] Dynamic markings (pp, p, mf, f, ff)
- [x] Crescendo/diminuendo wedges
- [x] Tempo markings (metronome)
- [x] Repeat signs and endings (1st/2nd)
- [x] Grace notes (slashed)
- [x] Articulations (accent, strong-accent, staccato, tenuto, staccatissimo, detached-legato)
- [x] Fermata
- [x] Page layout with proper margins and spacing
- [x] Title, composer, and copyright credits
- [x] Create `guitar-simple.xml` — Multi-voice E minor melody with fingering, slurs, dynamics
- [x] Create `guitar-classical.xml` — Full 8-measure classical guitar piece
- [x] Create `basic-dynamics.xml` — Dynamic markings from pp to ff with wedges
- [x] Create `basic-articulations.xml` — All standard articulation types
- [x] Update unit tests: all tests passing
- [x] Update `test/verify.html` with 4 M2 visual tests

**Note:** All M2 features (multi-voice, fingering, dynamics, articulations, slurs, ties, grace notes,
repeats, endings, fermata, wedges, credits, tempo) were already implemented in the existing
score-library codebase. M2 focused on creating comprehensive test files that exercise these
features and verifying they render correctly via the visual regression framework.

**Test Scores:**
- `test/samples/guitar-simple.xml` — Multi-voice melody with fingering, slurs, dynamics
- `test/samples/guitar-classical.xml` — Full classical guitar piece with all M2 features
- `test/samples/basic-dynamics.xml` — Dynamic markings and wedges
- `test/samples/basic-articulations.xml` — Articulation types

**Verification:** Classical guitar piece renders with all notation elements visible.

---

## Milestone 3: CBOR Format & Data Model ✅ (Current)

**Goal:** Define and implement CBOR ↔ MusicXML bidirectional mapping.

**Deliverables:**
- [x] CBOR ↔ MusicXML mapping specification document (`docs/cbor-musicxml-mapping-spec.md`)
- [x] Score Document Model (SDM) — format-neutral intermediate representation (`musicxml/sdm.js`)
- [x] MusicXML → SDM converter (`SDM.fromMusicXML()`)
- [x] SDM → MusicXML converter/export (`SDM.toMusicXML()`)
- [x] SDM → CBOR encoder (`ScoreCBOR.encode()`)
- [x] CBOR → SDM decoder (`ScoreCBOR.decode()`)
- [x] `.scorecbor` file format with magic bytes (`ScoreCBOR.encodeFile()/decodeFile()`)
- [x] Minimal built-in CBOR codec — no external dependencies
- [x] Round-trip validation: XML → SDM → CBOR → SDM → XML for all 9 test files
- [x] 25 CBOR tests all passing

**Implementation:**
- SDM is a plain JavaScript object graph (no XML/CBOR dependencies)
- CBOR codec supports: unsigned/negative int, strings, arrays, maps, float64, null, bool
- `.scorecbor` file format: magic bytes `SCOR\x01` + CBOR payload
- Compression: guitar-classical.xml 15.7KB → 5.5KB CBOR (35% ratio)

**Test Files:**
- `test/cbor-tests.js` — 25 tests covering codec, file format, SDM conversion, full round-trip
- `docs/cbor-musicxml-mapping-spec.md` — Complete mapping specification

**Verification:** All 9 sample files survive XML→SDM→CBOR→SDM deep-equal round-trip.

---

## Milestone 4: Basic Score Editor ✅ (Current)

**Goal:** Implement basic editing capabilities for simple scores.

**Deliverables:**
- [x] Command system with undo/redo (`editor/commands.js`)
  - InsertNoteCommand, DeleteNoteCommand, ModifyNoteCommand
  - InsertMeasureCommand, DeleteMeasureCommand
  - ChangeSignatureCommand (key/time/clef)
  - CommandHistory with undo/redo stacks (max 100), onChange listeners
- [x] Edit cursor with navigation (`editor/cursor.js`)
  - Position tracking (part, measure, element, voice)
  - Duration state (whole..32nd), dot toggle, rest toggle
  - Move right/left (skips non-note elements, crosses measure boundaries)
  - Create note/rest elements from current state
  - Pitch up/down by diatonic step with octave wrapping
- [x] Keyboard input handler (`editor/inputhandler.js`)
  - A-G: Enter note at pitch in current octave
  - 1-6: Set duration (whole, half, quarter, eighth, 16th, 32nd)
  - `.`: Toggle dot, `R`: Toggle rest mode
  - Arrow keys: Move cursor (Left/Right), Pitch up/down (Up/Down)
  - Shift+Up/Down: Octave up/down
  - Delete/Backspace: Delete note at cursor
  - `+`/`-`: Add/remove measure
  - Ctrl+Z: Undo, Ctrl+Y: Redo
- [x] Score templates (`editor/templates.js`)
  - Classical Guitar: G-clef, configurable measures/key/time/divisions
  - Lead Sheet: Melody instrument variant
  - Templates produce complete SDM with metadata, layout, credits, final barline
- [x] Save to CBOR / Export to MusicXML via existing SDM pipeline
- [x] New score from template (classical guitar, lead sheet)
- [x] 27 editor tests all passing (`test/editor-tests.js`)
- [x] Updated verify.html with 6 M4 tests
- [x] Edited scores survive CBOR and MusicXML round-trips

**Implementation Notes:**
- Editor modules use CommonJS for Node.js tests and Closure for browser
- All commands are fully reversible (undo restores exact state)
- Cursor maintains editing state independently of rendering
- InputHandler binds to DOM element but logic is testable without DOM
- Templates produce SDM objects directly (no XML intermediate)

**Test Files:**
- `test/editor-tests.js` — 27 tests across 8 groups
- `editor/commands.js` — Command system (6 command types + history)
- `editor/cursor.js` — Cursor with navigation and note creation
- `editor/inputhandler.js` — Keyboard binding and event dispatch
- `editor/templates.js` — Score templates

**Verification:** Create a template, insert notes via commands, undo/redo, save to CBOR, reload — all data preserved.

---

## Milestone 5: Performance & Polish

**Goal:** Optimize for complex scores and professional output quality.

**Deliverables:**
- [ ] Incremental rendering (dirty region tracking)
- [ ] Dual-canvas architecture (interaction layer + score layer)
- [ ] Web Worker rendering for heavy scores
- [ ] Print-quality PDF export
- [ ] Performance benchmark: 60fps editing on 4-page guitar score
- [ ] Google Closure Compiler ADVANCED_OPTIMIZATIONS build
- [ ] Compressed output size < 200KB (excluding fonts)

**Verification:** Load a multi-page score, edit notes, and verify smooth 60fps interaction. Export PDF and compare with reference.

---

## Future Milestones (Post-MVP)

### Milestone 6: Multi-Instrument Support
- Piano (grand staff), violin, cello
- Part extraction
- Transposition

### Milestone 7: Advanced Editor
- Copy/paste
- Drag and drop
- Lyrics editing
- Chord symbol input

### Milestone 8: Orchestral Scores
- Conductor score layout
- 20+ simultaneous parts
- Performance optimization for large scores

### Milestone 9: Collaboration Readiness
- Git-friendly CBOR storage format
- Operation log serialization
- Diff/merge tooling for `.scorecbor` files
