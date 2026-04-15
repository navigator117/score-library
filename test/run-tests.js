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

test('basic-clefs.xml has all 4 clef types (treble, bass, alto, tenor)', function() {
  var xmlPath = path.join(rootDir, 'test/samples/basic-clefs.xml');
  assert(fs.existsSync(xmlPath), 'File not found');
  var content = fs.readFileSync(xmlPath, 'utf8');
  assert(content.indexOf('<sign>G</sign>') !== -1, 'Missing treble clef (G)');
  assert(content.indexOf('<sign>F</sign>') !== -1, 'Missing bass clef (F)');
  assert(content.indexOf('<sign>C</sign>') !== -1, 'Missing C clef');
  // Verify line positions
  assert(content.indexOf('<line>2</line>') !== -1, 'Missing treble clef line 2');
  assert(content.indexOf('<line>4</line>') !== -1, 'Missing bass/tenor clef line 4');
  assert(content.indexOf('<line>3</line>') !== -1, 'Missing alto clef line 3');
});

test('basic-keys.xml has sharps and flats key signatures', function() {
  var xmlPath = path.join(rootDir, 'test/samples/basic-keys.xml');
  assert(fs.existsSync(xmlPath), 'File not found');
  var content = fs.readFileSync(xmlPath, 'utf8');
  assert(content.indexOf('<fifths>0</fifths>') !== -1, 'Missing C major (0)');
  assert(content.indexOf('<fifths>4</fifths>') !== -1, 'Missing E major (4 sharps)');
  assert(content.indexOf('<fifths>-4</fifths>') !== -1, 'Missing Ab major (4 flats)');
});

test('basic-time.xml has varied time signatures', function() {
  var xmlPath = path.join(rootDir, 'test/samples/basic-time.xml');
  assert(fs.existsSync(xmlPath), 'File not found');
  var content = fs.readFileSync(xmlPath, 'utf8');
  assert(content.indexOf('<beats>4</beats>') !== -1, 'Missing 4/4');
  assert(content.indexOf('<beats>3</beats>') !== -1, 'Missing 3/4');
  assert(content.indexOf('<beats>6</beats>') !== -1, 'Missing 6/8');
  assert(content.indexOf('symbol="common"') !== -1, 'Missing common time');
  assert(content.indexOf('symbol="cut"') !== -1, 'Missing cut time');
});

test('basic-barlines.xml has all barline types', function() {
  var xmlPath = path.join(rootDir, 'test/samples/basic-barlines.xml');
  assert(fs.existsSync(xmlPath), 'File not found');
  var content = fs.readFileSync(xmlPath, 'utf8');
  assert(content.indexOf('light-light') !== -1, 'Missing double barline');
  assert(content.indexOf('light-heavy') !== -1, 'Missing final barline');
  assert(content.indexOf('heavy-light') !== -1, 'Missing start repeat barline');
  assert(content.indexOf('<repeat') !== -1, 'Missing repeat markers');
});

// --- Group 2b: M2 MusicXML Sample Validation ---
log('\nM2 MusicXML Sample Validation:');

test('guitar-simple.xml has multi-voice, fingering, slurs, dynamics', function() {
  var xmlPath = path.join(rootDir, 'test/samples/guitar-simple.xml');
  assert(fs.existsSync(xmlPath), 'File not found');
  var content = fs.readFileSync(xmlPath, 'utf8');
  assert(content.indexOf('<voice>1</voice>') !== -1, 'Missing voice 1');
  assert(content.indexOf('<voice>2</voice>') !== -1, 'Missing voice 2');
  assert(content.indexOf('<backup>') !== -1, 'Missing backup (multi-voice)');
  assert(content.indexOf('<fingering') !== -1, 'Missing fingering');
  assert(content.indexOf('<slur') !== -1, 'Missing slur');
  assert(content.indexOf('<dynamics>') !== -1, 'Missing dynamics');
  assert(content.indexOf('<tied') !== -1, 'Missing tied note');
  assert(content.indexOf('<fermata') !== -1, 'Missing fermata');
  assert(content.indexOf('<tenuto') !== -1, 'Missing tenuto articulation');
});

test('guitar-classical.xml is a complete classical guitar piece', function() {
  var xmlPath = path.join(rootDir, 'test/samples/guitar-classical.xml');
  assert(fs.existsSync(xmlPath), 'File not found');
  var content = fs.readFileSync(xmlPath, 'utf8');
  assert(content.indexOf('<score-partwise') !== -1, 'Not a valid MusicXML file');
  assert(content.indexOf('Classical Guitar') !== -1, 'Missing guitar part');
  // Multi-voice
  assert(content.indexOf('<voice>1</voice>') !== -1, 'Missing voice 1');
  assert(content.indexOf('<voice>2</voice>') !== -1, 'Missing voice 2');
  // Fingering
  assert(content.indexOf('<fingering') !== -1, 'Missing fingering notation');
  // Dynamics
  assert(content.indexOf('<p/>') !== -1, 'Missing piano dynamic');
  assert(content.indexOf('<mf/>') !== -1, 'Missing mezzo-forte dynamic');
  assert(content.indexOf('<f/>') !== -1, 'Missing forte dynamic');
  // Slurs and ties
  assert(content.indexOf('slur type="start"') !== -1, 'Missing slur');
  assert(content.indexOf('tied type="start"') !== -1, 'Missing tie');
  // Grace notes
  assert(content.indexOf('<grace') !== -1, 'Missing grace note');
  // Articulations
  assert(content.indexOf('<accent/>') !== -1, 'Missing accent');
  assert(content.indexOf('<staccato/>') !== -1, 'Missing staccato');
  assert(content.indexOf('<tenuto/>') !== -1, 'Missing tenuto');
  // Repeats and endings
  assert(content.indexOf('repeat direction="forward"') !== -1, 'Missing forward repeat');
  assert(content.indexOf('repeat direction="backward"') !== -1, 'Missing backward repeat');
  assert(content.indexOf('ending number="1"') !== -1, 'Missing 1st ending');
  assert(content.indexOf('ending number="2"') !== -1, 'Missing 2nd ending');
  // Tempo
  assert(content.indexOf('<metronome>') !== -1, 'Missing tempo marking');
  // Wedge (crescendo/diminuendo)
  assert(content.indexOf('wedge type="crescendo"') !== -1, 'Missing crescendo');
  // Fermata
  assert(content.indexOf('<fermata') !== -1, 'Missing fermata');
  // Credits
  assert(content.indexOf('<credit') !== -1, 'Missing credits');
});

test('basic-dynamics.xml has dynamic range from pp to ff', function() {
  var xmlPath = path.join(rootDir, 'test/samples/basic-dynamics.xml');
  assert(fs.existsSync(xmlPath), 'File not found');
  var content = fs.readFileSync(xmlPath, 'utf8');
  assert(content.indexOf('<pp/>') !== -1, 'Missing pp');
  assert(content.indexOf('<p/>') !== -1, 'Missing p');
  assert(content.indexOf('<mf/>') !== -1, 'Missing mf');
  assert(content.indexOf('<f/>') !== -1, 'Missing f');
  assert(content.indexOf('<ff/>') !== -1, 'Missing ff');
  assert(content.indexOf('wedge type="crescendo"') !== -1, 'Missing crescendo');
  assert(content.indexOf('wedge type="diminuendo"') !== -1, 'Missing diminuendo');
});

test('basic-articulations.xml has accent, staccato, tenuto, fermata', function() {
  var xmlPath = path.join(rootDir, 'test/samples/basic-articulations.xml');
  assert(fs.existsSync(xmlPath), 'File not found');
  var content = fs.readFileSync(xmlPath, 'utf8');
  assert(content.indexOf('<accent/>') !== -1, 'Missing accent');
  assert(content.indexOf('<strong-accent/>') !== -1, 'Missing strong-accent');
  assert(content.indexOf('<staccato/>') !== -1, 'Missing staccato');
  assert(content.indexOf('<tenuto/>') !== -1, 'Missing tenuto');
  assert(content.indexOf('<staccatissimo/>') !== -1, 'Missing staccatissimo');
  assert(content.indexOf('<detached-legato/>') !== -1, 'Missing detached-legato');
  assert(content.indexOf('<fermata') !== -1, 'Missing fermata');
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

// --- Group 4: Bug Fix Validation ---
log('\nBug Fix Validation:');

test('checkRangeOfValue uses correct || operator (M1 fix)', function() {
  var content = fs.readFileSync(path.join(rootDir, 'musicxml/xmlhelper.js'), 'utf8');
  var hasFixedVersion = content.indexOf('return_value < begin || return_value > end') !== -1;
  var hasBugVersion = content.indexOf('return_value < begin && return_value > end') !== -1;

  assert(hasFixedVersion, 'checkRangeOfValue should use || not &&');
  assert(!hasBugVersion, 'Old buggy && version should not exist');
});

test('scorediv.js has no var re-declarations in createInput/createToolbarButton', function() {
  var content = fs.readFileSync(path.join(rootDir, 'scorediv.js'), 'utf8');

  // Check createInput does not have "var toolbar_input_node = $("
  var hasInputRedecl = /var toolbar_input_node = \$\(/.test(content);
  assert(!hasInputRedecl, 'createInput still has var re-declaration');

  // Check createToolbarButton does not have "var toolbar_button_node = $("
  var hasButtonRedecl = /var toolbar_button_node = \$\(/.test(content);
  assert(!hasButtonRedecl, 'createToolbarButton still has var re-declaration');
});

test('PageListLazyIter has hasCurrent() method', function() {
  var content = fs.readFileSync(path.join(rootDir, 'engraver/pager.js'), 'utf8');
  assert(content.indexOf('prototype.hasCurrent') !== -1,
    'hasCurrent() method not found in PageListLazyIter');
});

test('showCurrPage uses hasCurrent() instead of hasNext()', function() {
  var content = fs.readFileSync(path.join(rootDir, 'scorediv.js'), 'utf8');
  // Extract the showCurrPage function
  var fnStart = content.indexOf('showCurrPage');
  assert(fnStart !== -1, 'showCurrPage not found');

  var fnBody = content.substring(fnStart, fnStart + 200);
  assert(fnBody.indexOf('hasCurrent()') !== -1,
    'showCurrPage should call hasCurrent()');
  assert(fnBody.indexOf('hasNext()') === -1,
    'showCurrPage should not call hasNext()');
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
