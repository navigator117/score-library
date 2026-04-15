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

## Milestone 1: Bug Fixes & Rendering Accuracy

**Goal:** Fix known bugs and ensure pixel-accurate rendering of basic notation.

**Deliverables:**
- [ ] Fix `checkRangeOfValue()` logic bug in `xmlhelper.js:402` (impossible condition `< begin && > end`)
- [ ] Fix variable shadowing in `scorediv.js:164,183`
- [ ] Fix `showCurrPage()` semantic issue (using `hasNext()` for `hasCurrent()`)
- [ ] Add `hasCurrent()` method to `PageListLazyIter`
- [ ] Verify basic note rendering: whole, half, quarter, eighth, sixteenth
- [ ] Verify clef rendering: treble, bass, alto
- [ ] Verify key signature rendering: all major/minor keys
- [ ] Verify time signature rendering: 4/4, 3/4, 6/8, cut time, common time
- [ ] Verify barline rendering: single, double, final, repeat
- [ ] Verify beam grouping accuracy
- [ ] Verify stem direction accuracy

**Test Scores:**
- `test/samples/basic-notes.xml` — All note durations
- `test/samples/basic-clefs.xml` — All clef types
- `test/samples/basic-keys.xml` — Major/minor key signatures
- `test/samples/basic-time.xml` — Time signatures

**Verification:** All test scores render with <2% pixel deviation from reference images.

---

## Milestone 2: Classical Guitar Score

**Goal:** Render a complete classical guitar piece with professional quality.

**Deliverables:**
- [ ] Multi-voice rendering (melody + bass in single staff)
- [ ] Fingering notation (p, i, m, a for right hand; 1-4 for left hand)
- [ ] String numbers
- [ ] Position markers
- [ ] Slurs and ties across measures
- [ ] Dynamic markings (p, mf, f, etc.)
- [ ] Tempo markings
- [ ] Repeat signs and endings (1st/2nd)
- [ ] Grace notes
- [ ] Articulations (staccato, accent, tenuto)
- [ ] Page layout with proper margins and spacing
- [ ] Title, composer, and copyright credits

**Test Scores:**
- `test/samples/guitar-simple.xml` — Simple melody with chords
- `test/samples/guitar-classical.xml` — Full classical guitar piece (e.g., Lágrima by Tárrega)

**Verification:** Classical guitar piece renders with professional print quality. All notation elements visible and correctly positioned.

---

## Milestone 3: CBOR Format & Data Model

**Goal:** Define and implement CBOR ↔ MusicXML bidirectional mapping.

**Deliverables:**
- [ ] CBOR ↔ MusicXML mapping specification document (`docs/cbor-musicxml-mapping-spec.md`)
- [ ] Score Document Model (SDM) — format-neutral intermediate representation
- [ ] MusicXML → SDM converter
- [ ] SDM → MusicXML converter (export)
- [ ] SDM → CBOR encoder
- [ ] CBOR → SDM decoder
- [ ] `.scorecbor` file loading in `scoreajax.js`
- [ ] Round-trip validation: XML → SDM → CBOR → SDM → XML produces semantically identical output

**Verification:** Test page shows side-by-side rendering from MusicXML and from CBOR of the same score, with pixel-identical output.

---

## Milestone 4: Basic Score Editor

**Goal:** Implement basic editing capabilities for simple scores.

**Deliverables:**
- [ ] Command system with undo/redo
- [ ] Note input via keyboard (pitch letters + duration numbers)
- [ ] Note input via mouse click on staff
- [ ] Delete notes and rests
- [ ] Change pitch (arrow keys)
- [ ] Change duration
- [ ] Add/remove measures
- [ ] Change key/time/clef signatures
- [ ] Edit cursor with visual feedback
- [ ] Selection highlighting
- [ ] Save to CBOR / Export to MusicXML
- [ ] New score from template (classical guitar)

**Verification:** Create a simple 8-bar melody from scratch using the editor, save as CBOR, reload, and verify rendering matches.

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
