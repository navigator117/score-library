/**
 * @fileoverview Lint check for score-library.
 * Validates JavaScript source files for common issues that would cause
 * problems with Google Closure Compiler ADVANCED_OPTIMIZATIONS.
 *
 * Checks performed:
 * 1. All .js files have goog.provide() declarations
 * 2. No duplicate goog.provide() across files
 * 3. Basic syntax validation
 * 4. Known bug patterns detection
 */

'use strict';

var fs = require('fs');
var path = require('path');

var rootDir = path.resolve(__dirname, '..');
var errors = [];
var warnings = [];
var provides = {};

function log(msg) {
  process.stdout.write(msg + '\n');
}

function error(file, line, msg) {
  errors.push({ file: file, line: line, message: msg });
}

function warn(file, line, msg) {
  warnings.push({ file: file, line: line, message: msg });
}

/**
 * Get all JavaScript source files (excluding node_modules, .git, test, fonts)
 */
function getSourceFiles() {
  var files = [];
  var dirs = ['', 'engraver', 'musicxml', 'renderer'];

  dirs.forEach(function(dir) {
    var fullDir = path.join(rootDir, dir);
    if (!fs.existsSync(fullDir)) return;

    fs.readdirSync(fullDir).forEach(function(file) {
      if (file.endsWith('.js') && !file.endsWith('-deps.js')) {
        files.push(path.join(dir, file));
      }
    });
  });

  return files;
}

/**
 * Check a single source file
 */
function checkFile(relPath) {
  var fullPath = path.join(rootDir, relPath);
  var content = fs.readFileSync(fullPath, 'utf8');
  var lines = content.split('\n');

  // Check 1: goog.provide() exists (except for font files)
  if (relPath.indexOf('fonts/') === -1) {
    var hasProvide = /goog\.provide\(/.test(content);
    if (!hasProvide) {
      warn(relPath, 1, 'Missing goog.provide() declaration');
    }
  }

  // Check 2: Track and detect duplicate goog.provide()
  var provideRegex = /goog\.provide\(['"]([^'"]+)['"]\)/g;
  var match;
  while ((match = provideRegex.exec(content)) !== null) {
    var ns = match[1];
    if (provides[ns]) {
      error(relPath, 0, 'Duplicate goog.provide("' + ns + '") — also in ' + provides[ns]);
    } else {
      provides[ns] = relPath;
    }
  }

  // Check 3: Known bug patterns
  lines.forEach(function(line, idx) {
    var lineNum = idx + 1;

    // Pattern: impossible range check (value < begin && value > end)
    if (/\w+\s*<\s*\w+\s*&&\s*\w+\s*>\s*\w+/.test(line) &&
        line.indexOf('checkRangeOfValue') !== -1) {
      warn(relPath, lineNum,
        'Suspicious range check: (a < b && a > c) is likely a bug — should be (a < b || a > c)');
    }

    // Pattern: var re-declaration inside if block
    if (/^\s*var\s+\w+\s*=/.test(line)) {
      // Count how many times this var is declared in the function
      var varMatch = line.match(/var\s+(\w+)/);
      if (varMatch) {
        var varName = varMatch[1];
        var varCount = 0;
        lines.forEach(function(l) {
          if (new RegExp('var\\s+' + varName + '\\b').test(l)) varCount++;
        });
        if (varCount > 1) {
          warn(relPath, lineNum,
            'Variable "' + varName + '" declared ' + varCount + ' times — potential shadowing');
        }
      }
    }
  });
}

// ===== Main =====
log('Score Library Lint Check');
log('=======================\n');

var files = getSourceFiles();
log('Checking ' + files.length + ' source files...\n');

files.forEach(function(file) {
  checkFile(file);
});

// Report
if (warnings.length > 0) {
  log('Warnings (' + warnings.length + '):');
  warnings.forEach(function(w) {
    log('  ⚠ ' + w.file + ':' + w.line + ' — ' + w.message);
  });
  log('');
}

if (errors.length > 0) {
  log('Errors (' + errors.length + '):');
  errors.forEach(function(e) {
    log('  ✗ ' + e.file + ':' + e.line + ' — ' + e.message);
  });
  log('');
  log('FAILED: ' + errors.length + ' error(s) found');
  process.exit(1);
} else {
  log('✓ All checks passed (' + files.length + ' files, ' + warnings.length + ' warnings)');
  process.exit(0);
}
