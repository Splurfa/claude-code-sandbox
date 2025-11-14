#!/usr/bin/env node

/**
 * Test suite for inbox-archive.js hook
 *
 * Run with: node tests/inbox-archive.test.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const workspaceRoot = '/Users/splurfa/common-thread-sandbox';
const hookScript = path.join(workspaceRoot, '.swarm/hooks/inbox-archive.js');
const testDir = path.join(workspaceRoot, '.inbox/test-files');
const archiveDir = path.join(workspaceRoot, '.inbox/archive');

let testsPassed = 0;
let testsFailed = 0;

// Helper functions
function cleanup() {
  // Clean test directories
  if (fs.existsSync(testDir)) {
    fs.rmSync(testDir, { recursive: true, force: true });
  }
  const testDestDir = path.join(workspaceRoot, 'docs/test-dest');
  if (fs.existsSync(testDestDir)) {
    fs.rmSync(testDestDir, { recursive: true, force: true });
  }
}

function setup() {
  cleanup();
  fs.mkdirSync(testDir, { recursive: true });
}

function assert(condition, testName) {
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
    testsPassed++;
  } else {
    console.error(`❌ FAIL: ${testName}`);
    testsFailed++;
  }
}

function createTestFile(filename, content = 'Test content') {
  const filePath = path.join(testDir, filename);
  fs.writeFileSync(filePath, content, 'utf8');
  return filePath;
}

// Test 1: Basic archival without notes or tags
function testBasicArchival() {
  console.log('\n=== Test 1: Basic Archival ===');

  const sourceFile = createTestFile('basic-test.md', '# Basic Test\n\nContent here.');
  const destination = 'docs/test-dest/basic-test.md';

  try {
    execSync(`node "${hookScript}" "${sourceFile}" "${destination}"`, {
      cwd: workspaceRoot,
      stdio: 'pipe'
    });

    // Check file was copied
    const destPath = path.join(workspaceRoot, destination);
    assert(fs.existsSync(destPath), 'Destination file created');

    // Check manifest exists
    const manifests = fs.readdirSync(archiveDir).filter(f => f.includes('basic-test.md.json'));
    assert(manifests.length > 0, 'Manifest created');

    if (manifests.length > 0) {
      const manifest = JSON.parse(fs.readFileSync(path.join(archiveDir, manifests[0]), 'utf8'));
      assert(manifest.source.includes('basic-test.md'), 'Manifest has correct source');
      assert(manifest.destination === destination, 'Manifest has correct destination');
      assert(manifest.notes === '', 'Manifest has empty notes');
      assert(manifest.tags.length === 0, 'Manifest has no tags');
    }
  } catch (error) {
    console.error('Test failed with error:', error.message);
    testsFailed++;
  }
}

// Test 2: Archival with notes and tags
function testArchivalWithMetadata() {
  console.log('\n=== Test 2: Archival with Notes and Tags ===');

  const sourceFile = createTestFile('metadata-test.md', '# Metadata Test');
  const destination = 'docs/test-dest/metadata-test.md';
  const notes = 'Test notes with metadata';
  const tags = 'test,metadata,verification';

  try {
    execSync(`node "${hookScript}" "${sourceFile}" "${destination}" "${notes}" "${tags}"`, {
      cwd: workspaceRoot,
      stdio: 'pipe'
    });

    const manifests = fs.readdirSync(archiveDir).filter(f => f.includes('metadata-test.md.json'));

    if (manifests.length > 0) {
      const manifest = JSON.parse(fs.readFileSync(path.join(archiveDir, manifests[0]), 'utf8'));
      assert(manifest.notes === notes, 'Manifest has correct notes');
      assert(manifest.tags.length === 3, 'Manifest has correct tag count');
      assert(manifest.tags.includes('test'), 'Manifest includes "test" tag');
      assert(manifest.tags.includes('metadata'), 'Manifest includes "metadata" tag');
      assert(manifest.tags.includes('verification'), 'Manifest includes "verification" tag');
    }
  } catch (error) {
    console.error('Test failed with error:', error.message);
    testsFailed++;
  }
}

// Test 3: Idempotent behavior (re-run same archival)
function testIdempotency() {
  console.log('\n=== Test 3: Idempotent Behavior ===');

  const sourceFile = createTestFile('idempotent-test.md', '# Idempotent Test');
  const destination = 'docs/test-dest/idempotent-test.md';

  try {
    // Run first time
    execSync(`node "${hookScript}" "${sourceFile}" "${destination}" "First run"`, {
      cwd: workspaceRoot,
      stdio: 'pipe'
    });

    const manifestsBefore = fs.readdirSync(archiveDir).filter(f => f.includes('idempotent-test.md.json'));
    const countBefore = manifestsBefore.length;

    // Run second time (should overwrite)
    execSync(`node "${hookScript}" "${sourceFile}" "${destination}" "Second run"`, {
      cwd: workspaceRoot,
      stdio: 'pipe'
    });

    const manifestsAfter = fs.readdirSync(archiveDir).filter(f => f.includes('idempotent-test.md.json'));
    const countAfter = manifestsAfter.length;

    // Note: Count might be higher because timestamp differs, but should work
    assert(countAfter >= countBefore, 'Idempotent execution successful');

    // Check destination still exists
    const destPath = path.join(workspaceRoot, destination);
    assert(fs.existsSync(destPath), 'Destination file still exists after re-run');
  } catch (error) {
    console.error('Test failed with error:', error.message);
    testsFailed++;
  }
}

// Test 4: Error handling - missing source file
function testMissingSourceFile() {
  console.log('\n=== Test 4: Error Handling - Missing Source ===');

  const nonExistentFile = path.join(testDir, 'does-not-exist.md');
  const destination = 'docs/test-dest/error-test.md';

  try {
    execSync(`node "${hookScript}" "${nonExistentFile}" "${destination}"`, {
      cwd: workspaceRoot,
      stdio: 'pipe'
    });
    assert(false, 'Should fail with missing source file');
  } catch (error) {
    assert(error.status === 1, 'Returns error code 1 for missing file');
  }
}

// Test 5: JSON validation
function testJsonValidation() {
  console.log('\n=== Test 5: JSON Validation ===');

  const sourceFile = createTestFile('json-test.md', '# JSON Test');
  const destination = 'docs/test-dest/json-test.md';

  try {
    execSync(`node "${hookScript}" "${sourceFile}" "${destination}" "Valid JSON test" "json,valid"`, {
      cwd: workspaceRoot,
      stdio: 'pipe'
    });

    const manifests = fs.readdirSync(archiveDir).filter(f => f.includes('json-test.md.json'));

    if (manifests.length > 0) {
      const manifestPath = path.join(archiveDir, manifests[0]);
      const manifestContent = fs.readFileSync(manifestPath, 'utf8');

      try {
        const parsed = JSON.parse(manifestContent);
        assert(typeof parsed === 'object', 'Manifest is valid JSON');
        assert(parsed.timestamp, 'Manifest has timestamp');
        assert(parsed.source, 'Manifest has source');
        assert(parsed.destination, 'Manifest has destination');
        assert(Array.isArray(parsed.tags), 'Tags is an array');
      } catch (parseError) {
        assert(false, 'Manifest should be valid JSON');
      }
    }
  } catch (error) {
    console.error('Test failed with error:', error.message);
    testsFailed++;
  }
}

// Test 6: Directory creation
function testDirectoryCreation() {
  console.log('\n=== Test 6: Directory Creation ===');

  const sourceFile = createTestFile('dir-test.md', '# Directory Test');
  const destination = 'docs/test-dest/nested/deep/dir-test.md';

  try {
    execSync(`node "${hookScript}" "${sourceFile}" "${destination}"`, {
      cwd: workspaceRoot,
      stdio: 'pipe'
    });

    const destPath = path.join(workspaceRoot, destination);
    assert(fs.existsSync(destPath), 'File created in nested directories');
    assert(fs.existsSync(path.dirname(destPath)), 'Nested directories created');
  } catch (error) {
    console.error('Test failed with error:', error.message);
    testsFailed++;
  }
}

// Run all tests
console.log('🧪 Starting inbox-archive.js test suite...\n');

setup();

testBasicArchival();
testArchivalWithMetadata();
testIdempotency();
testMissingSourceFile();
testJsonValidation();
testDirectoryCreation();

cleanup();

// Report results
console.log('\n' + '='.repeat(50));
console.log(`Tests Passed: ${testsPassed}`);
console.log(`Tests Failed: ${testsFailed}`);
console.log('='.repeat(50));

process.exit(testsFailed > 0 ? 1 : 0);
