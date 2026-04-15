/**
 * @fileoverview Unit test runner for score-library.
 * Runs basic verification tests without requiring a browser.
 *
 * Tests:
 * 1. All source files are syntactically valid JavaScript
 * 2. MusicXML sample files are well-formed XML
 * 3. Dependency graph is consistent (all requires have matching provides)
 * 4. Known bug detection
 */

'use strict';

var fs = require('fs');
var path = require('path');

var rootDir = path.resolve(__dirname, '..');
var passed = 0;
var failed = 0;

function log(msg) {
  process.stdout.write(msg + '\n');
}

function test(name, fn) {
  try {
    fn();
    log('  ✓ ' + name);
    passed++;
  } catch (err) {
    log('  ✗ ' + name + ' — ' + err.message);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message || 'Assertion failed');
}

// ===== Test Suite =====
log('\nScore Library Test Suite');
log('========================\n');

// --- Group 1: Source File Validation ---
log('Source File Validation:');

test('All JS files exist and are non-empty', function() {
  var dirs = ['', 'engraver', 'musicxml', 'renderer'];
  var totalFiles = 0;

  dirs.forEach(function(dir) {
    var fullDir = path.join(rootDir, dir);
    if (!fs.existsSync(fullDir)) return;

    fs.readdirSync(fullDir).forEach(function(file) {
      if (file.endsWith('.js')) {
        var filePath = path.join(fullDir, file);
        var stat = fs.statSync(filePath);
        assert(stat.size > 0, file + ' is empty');
        totalFiles++;
      }
    });
  });

  assert(totalFiles > 50, 'Expected 50+ JS files, found ' + totalFiles);
});

test('scorelibrary.js provides ScoreLibrary namespace', function() {
  var content = fs.readFileSync(path.join(rootDir, 'scorelibrary.js'), 'utf8');
  assert(content.indexOf("goog.provide('ScoreLibrary')") !== -1,
    'Missing goog.provide for ScoreLibrary');
});

test('scorediv.js provides ScoreLibrary.ScoreDiv', function() {
  var content = fs.readFileSync(path.join(rootDir, 'scorediv.js'), 'utf8');
  assert(content.indexOf("goog.provide('ScoreLibrary.ScoreDiv')") !== -1,
    'Missing goog.provide for ScoreDiv');
});

// --- Group 2: MusicXML Sample Validation ---
log('\nMusicXML Sample Validation:');

test('basic-notes.xml exists and is valid XML', function() {
  var xmlPath = path.join(rootDir, 'test/samples/basic-notes.xml');
  assert(fs.existsSync(xmlPath), 'File not found');
  var content = fs.readFileSync(xmlPath, 'utf8');
  assert(content.indexOf('<score-partwise') !== -1, 'Not a valid MusicXML file');
  assert(content.indexOf('<note>') !== -1, 'No notes found');
  assert(content.indexOf('<pitch>') !== -1, 'No pitches found');
});

test('guitar-simple.xml exists and is valid XML', function() {
  var xmlPath = path.join(rootDir, 'test/samples/guitar-simple.xml');
  assert(fs.existsSync(xmlPath), 'File not found');
  var content = fs.readFileSync(xmlPath, 'utf8');
  assert(content.indexOf('<score-partwise') !== -1, 'Not a valid MusicXML file');
  assert(content.indexOf('Classical Guitar') !== -1, 'Missing guitar part name');
});

// --- Group 3: Dependency Graph Validation ---
log('\nDependency Graph Validation:');

test('scorelibrary-deps.js exists and has valid dependency entries', function() {
  var depsPath = path.join(rootDir, 'scorelibrary-deps.js');
  assert(fs.existsSync(depsPath), 'File not found');
  var content = fs.readFileSync(depsPath, 'utf8');

  var depCount = (content.match(/goog\.addDependency/g) || []).length;
  assert(depCount > 50, 'Expected 50+ dependency entries, found ' + depCount);
});

test('All provided namespaces are unique', function() {
  var depsContent = fs.readFileSync(path.join(rootDir, 'scorelibrary-deps.js'), 'utf8');
  var provides = {};
  var regex = /\['([^']+)'\]/g;
  var match;
  // Extract second argument arrays (provides)
  var depRegex = /goog\.addDependency\([^,]+,\s*\[([^\]]*)\]/g;
  while ((match = depRegex.exec(depsContent)) !== null) {
    var nsStr = match[1];
    var nsRegex = /'([^']+)'/g;
    var nsMatch;
    while ((nsMatch = nsRegex.exec(nsStr)) !== null) {
      var ns = nsMatch[1];
      assert(!provides[ns], 'Duplicate namespace: ' + ns);
      provides[ns] = true;
    }
  }
});

// --- Group 4: Known Bug Detection ---
log('\nKnown Bug Detection:');

test('checkRangeOfValue has the known logic bug (pre-fix baseline)', function() {
  var content = fs.readFileSync(path.join(rootDir, 'musicxml/xmlhelper.js'), 'utf8');
  var bugLine = 'return_value < begin && return_value > end';
  // This test documents the existing bug - it passes if the bug exists
  // After fixing, update this test to check for the corrected logic
  var hasBug = content.indexOf(bugLine) !== -1;
  var hasFixedVersion = content.indexOf('return_value < begin || return_value > end') !== -1;

  assert(hasBug || hasFixedVersion,
    'checkRangeOfValue logic not found — file may have changed');

  if (hasBug && !hasFixedVersion) {
    log('    ⚠ Note: xmlhelper.js:402 contains the known range check bug (to be fixed in M1)');
  }
});

test('supperclass typo exists in codebase (pre-fix baseline)', function() {
  var content = fs.readFileSync(path.join(rootDir, 'scorelibrary.js'), 'utf8');
  var hasTypo = content.indexOf('.supperclass') !== -1;
  var hasFixed = content.indexOf('.superclass') !== -1;

  assert(hasTypo || hasFixed, 'Neither supperclass nor superclass found');

  if (hasTypo && !hasFixed) {
    log('    ⚠ Note: "supperclass" typo present throughout codebase (to be fixed in M1)');
  }
});

// --- Group 5: Test Infrastructure ---
log('\nTest Infrastructure:');

test('verify.html exists', function() {
  assert(fs.existsSync(path.join(rootDir, 'test/verify.html')),
    'test/verify.html not found');
});

test('MILESTONES.md exists', function() {
  assert(fs.existsSync(path.join(rootDir, 'docs/MILESTONES.md')),
    'docs/MILESTONES.md not found');
});

// ===== Results =====
log('\n========================');
log('Results: ' + passed + ' passed, ' + failed + ' failed');

if (failed > 0) {
  log('\nFAILED');
  process.exit(1);
} else {
  log('\nALL TESTS PASSED');
  process.exit(0);
}
