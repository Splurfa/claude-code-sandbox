#!/usr/bin/env node
/**
 * Session Lifecycle Integration Tests
 * Automated test suite for session-closeout.js
 *
 * Run: node session-lifecycle.test.js
 * Or: npm test sessions/session-20251113-211159-hive-mind-setup/iteration-6/artifacts/tests/session-lifecycle.test.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Test results collector
const results = {
  passed: 0,
  failed: 0,
  skipped: 0,
  tests: []
};

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

/**
 * Test assertion helper
 */
function assert(condition, message) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

/**
 * Test runner
 */
async function test(name, fn) {
  process.stdout.write(`${colors.blue}[TEST]${colors.reset} ${name} ... `);

  try {
    await fn();
    console.log(`${colors.green}✅ PASS${colors.reset}`);
    results.passed++;
    results.tests.push({ name, status: 'PASS' });
  } catch (error) {
    console.log(`${colors.red}❌ FAIL${colors.reset}`);
    console.log(`       ${colors.red}${error.message}${colors.reset}`);
    results.failed++;
    results.tests.push({ name, status: 'FAIL', error: error.message });
  }
}

/**
 * Skip test
 */
function skip(name, reason) {
  console.log(`${colors.yellow}[SKIP]${colors.reset} ${name} - ${reason}`);
  results.skipped++;
  results.tests.push({ name, status: 'SKIP', reason });
}

/**
 * Test suite setup
 */
function setup() {
  console.log('\n' + '='.repeat(60));
  console.log('Session Lifecycle Integration Test Suite');
  console.log('='.repeat(60) + '\n');
}

/**
 * Test suite teardown
 */
function teardown() {
  console.log('\n' + '='.repeat(60));
  console.log('Test Results Summary');
  console.log('='.repeat(60));
  console.log(`${colors.green}Passed:${colors.reset}  ${results.passed}`);
  console.log(`${colors.red}Failed:${colors.reset}  ${results.failed}`);
  console.log(`${colors.yellow}Skipped:${colors.reset} ${results.skipped}`);
  console.log(`Total:   ${results.passed + results.failed + results.skipped}`);
  console.log('='.repeat(60) + '\n');

  // Exit with error code if any tests failed
  process.exit(results.failed > 0 ? 1 : 0);
}

/**
 * Create temporary test session
 */
function createTestSession() {
  const sessionId = `test-session-${Date.now()}`;
  const sessionPath = path.join(process.cwd(), 'sessions', sessionId);

  // Create session structure
  fs.mkdirSync(path.join(sessionPath, 'artifacts', 'code'), { recursive: true });
  fs.mkdirSync(path.join(sessionPath, 'artifacts', 'tests'), { recursive: true });
  fs.mkdirSync(path.join(sessionPath, 'artifacts', 'docs'), { recursive: true });
  fs.mkdirSync(path.join(sessionPath, 'artifacts', 'scripts'), { recursive: true });
  fs.mkdirSync(path.join(sessionPath, 'artifacts', 'notes'), { recursive: true });

  // Create metadata.json
  const metadata = {
    session_id: sessionId,
    created_at: new Date().toISOString(),
    status: 'active'
  };
  fs.writeFileSync(
    path.join(sessionPath, 'metadata.json'),
    JSON.stringify(metadata, null, 2)
  );

  // Create session-summary.md
  const summary = `# Session: ${sessionId}\n\n**Status:** Active\n\n## Progress\n- Test session created\n`;
  fs.writeFileSync(path.join(sessionPath, 'session-summary.md'), summary);

  // Create some test artifacts
  fs.writeFileSync(path.join(sessionPath, 'artifacts', 'code', 'test.js'), '// Test file\n');
  fs.writeFileSync(path.join(sessionPath, 'artifacts', 'tests', 'test.test.js'), '// Test file\n');
  fs.writeFileSync(path.join(sessionPath, 'artifacts', 'docs', 'README.md'), '# Test\n');

  return { sessionId, sessionPath };
}

/**
 * Clean up test session
 */
function cleanupTestSession(sessionPath) {
  if (fs.existsSync(sessionPath)) {
    fs.rmSync(sessionPath, { recursive: true, force: true });
  }
}

/**
 * TEST SUITE
 */

// Test 1: Session structure validation
test('Session structure follows specification', async () => {
  const { sessionId, sessionPath } = createTestSession();

  try {
    // Verify session directory exists
    assert(fs.existsSync(sessionPath), 'Session directory should exist');

    // Verify metadata.json
    const metadataPath = path.join(sessionPath, 'metadata.json');
    assert(fs.existsSync(metadataPath), 'metadata.json should exist');

    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
    assert(metadata.session_id === sessionId, 'metadata.session_id should match');
    assert(metadata.status === 'active', 'metadata.status should be active');
    assert(metadata.created_at, 'metadata.created_at should exist');

    // Verify artifacts subdirectories
    const artifactsPath = path.join(sessionPath, 'artifacts');
    assert(fs.existsSync(artifactsPath), 'artifacts/ directory should exist');

    const categories = ['code', 'tests', 'docs', 'scripts', 'notes'];
    categories.forEach(category => {
      const categoryPath = path.join(artifactsPath, category);
      assert(fs.existsSync(categoryPath), `artifacts/${category}/ should exist`);
    });

    // Verify session-summary.md
    const summaryPath = path.join(sessionPath, 'session-summary.md');
    assert(fs.existsSync(summaryPath), 'session-summary.md should exist');

  } finally {
    cleanupTestSession(sessionPath);
  }
});

// Test 2: File routing to artifacts
test('Files route to correct artifact subdirectories', async () => {
  const { sessionId, sessionPath } = createTestSession();

  try {
    // Verify test artifacts exist in correct locations
    const codeFile = path.join(sessionPath, 'artifacts', 'code', 'test.js');
    const testFile = path.join(sessionPath, 'artifacts', 'tests', 'test.test.js');
    const docFile = path.join(sessionPath, 'artifacts', 'docs', 'README.md');

    assert(fs.existsSync(codeFile), 'Code file should exist in artifacts/code/');
    assert(fs.existsSync(testFile), 'Test file should exist in artifacts/tests/');
    assert(fs.existsSync(docFile), 'Doc file should exist in artifacts/docs/');

    // Verify no files in root directories
    const rootTestsDir = path.join(process.cwd(), 'tests');
    const rootDocsDir = path.join(process.cwd(), 'docs');

    // These may exist from project structure, but should not contain session files
    if (fs.existsSync(rootTestsDir)) {
      const files = fs.readdirSync(rootTestsDir);
      const sessionFiles = files.filter(f => f.includes(sessionId));
      assert(sessionFiles.length === 0, 'Root tests/ should not contain session files');
    }

  } finally {
    cleanupTestSession(sessionPath);
  }
});

// Test 3: Session summary generation
test('Session summary generation includes all artifacts', async () => {
  const { sessionId, sessionPath } = createTestSession();

  try {
    // Import closeout functions
    const closeoutPath = path.join(
      process.cwd(),
      'sessions/session-20251113-211159-hive-mind-setup/iteration-4/artifacts/code/session-closeout.js'
    );

    if (!fs.existsSync(closeoutPath)) {
      throw new Error('session-closeout.js not found');
    }

    const { generateSessionSummary } = require(closeoutPath);
    const summary = generateSessionSummary(sessionId);

    // Verify summary content
    assert(summary.includes(sessionId), 'Summary should include session ID');
    assert(summary.includes('## Artifacts Created'), 'Summary should include artifacts section');
    assert(summary.includes('### code/'), 'Summary should list code artifacts');
    assert(summary.includes('test.js'), 'Summary should list specific files');

  } finally {
    cleanupTestSession(sessionPath);
  }
});

// Test 4: Backup archive creation
test('Archive creation includes all session data', async () => {
  const { sessionId, sessionPath } = createTestSession();

  try {
    const closeoutPath = path.join(
      process.cwd(),
      'sessions/session-20251113-211159-hive-mind-setup/iteration-4/artifacts/code/session-closeout.js'
    );

    const { archiveSession, generateSessionSummary } = require(closeoutPath);
    const summary = generateSessionSummary(sessionId);
    const backupPath = archiveSession(sessionId, summary);

    // Verify backup file exists
    assert(fs.existsSync(backupPath), 'Backup file should exist');

    // Parse and verify backup content
    const backup = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));

    assert(backup.sessionId === sessionId, 'Backup should include session ID');
    assert(backup.timestamp, 'Backup should include timestamp');
    assert(backup.summary, 'Backup should include summary');
    assert(backup.metadata, 'Backup should include metadata');
    assert(Array.isArray(backup.artifacts), 'Backup should include artifacts array');
    assert(backup.artifacts.length > 0, 'Backup should list artifact files');

    // Verify backup is in correct location
    const backupDir = path.join(process.cwd(), '.swarm', 'backups');
    assert(backupPath.startsWith(backupDir), 'Backup should be in .swarm/backups/');

    // Cleanup backup
    fs.unlinkSync(backupPath);

  } finally {
    cleanupTestSession(sessionPath);
  }
});

// Test 5: Metadata update
test('Metadata updates to closed status', async () => {
  const { sessionId, sessionPath } = createTestSession();

  try {
    const closeoutPath = path.join(
      process.cwd(),
      'sessions/session-20251113-211159-hive-mind-setup/iteration-4/artifacts/code/session-closeout.js'
    );

    const { updateSessionMetadata, readSessionMetadata } = require(closeoutPath);

    // Verify initial status
    const initialMetadata = readSessionMetadata(sessionId);
    assert(initialMetadata.status === 'active', 'Initial status should be active');

    // Update to closed
    updateSessionMetadata(sessionId, 'closed');

    // Verify updated status
    const updatedMetadata = readSessionMetadata(sessionId);
    assert(updatedMetadata.status === 'closed', 'Updated status should be closed');
    assert(updatedMetadata.closed_at, 'Metadata should include closed_at timestamp');

  } finally {
    cleanupTestSession(sessionPath);
  }
});

// Test 6: CRITICAL - Directory cleanup (EXPECTED TO FAIL)
test('CRITICAL: Directory removed after successful closeout', async () => {
  const { sessionId, sessionPath } = createTestSession();
  let backupPath;

  try {
    const closeoutPath = path.join(
      process.cwd(),
      'sessions/session-20251113-211159-hive-mind-setup/iteration-4/artifacts/code/session-closeout.js'
    );

    const {
      archiveSession,
      generateSessionSummary,
      updateSessionMetadata,
      removeSessionDirectory
    } = require(closeoutPath);

    // Perform closeout steps
    const summary = generateSessionSummary(sessionId);
    backupPath = archiveSession(sessionId, summary);
    updateSessionMetadata(sessionId, 'closed');

    // Verify backup exists before cleanup
    assert(fs.existsSync(backupPath), 'Backup must exist before cleanup');

    // THIS WILL FAIL - removeSessionDirectory is not defined
    if (typeof removeSessionDirectory !== 'function') {
      throw new Error('removeSessionDirectory function not implemented');
    }

    // Call cleanup function
    removeSessionDirectory(sessionId);

    // Verify directory is removed
    assert(!fs.existsSync(sessionPath), 'Session directory should be removed after closeout');

    // Verify backup still exists
    assert(fs.existsSync(backupPath), 'Backup should remain after cleanup');

  } catch (error) {
    // Cleanup session if test failed
    if (fs.existsSync(sessionPath)) {
      cleanupTestSession(sessionPath);
    }

    // Cleanup backup if created
    if (backupPath && fs.existsSync(backupPath)) {
      fs.unlinkSync(backupPath);
    }

    throw error;
  }
});

// Test 7: Batch closeout validation
test('Batch closeout handles multiple sessions', async () => {
  const sessions = [];
  const backups = [];

  try {
    // Create 3 test sessions
    for (let i = 0; i < 3; i++) {
      sessions.push(createTestSession());
    }

    const closeoutPath = path.join(
      process.cwd(),
      'sessions/session-20251113-211159-hive-mind-setup/iteration-4/artifacts/code/session-closeout.js'
    );

    const { archiveSession, generateSessionSummary } = require(closeoutPath);

    // Archive all sessions
    for (const { sessionId } of sessions) {
      const summary = generateSessionSummary(sessionId);
      const backupPath = archiveSession(sessionId, summary);
      backups.push(backupPath);

      // Verify backup exists
      assert(fs.existsSync(backupPath), `Backup should exist for ${sessionId}`);
    }

    // Verify all backups created
    assert(backups.length === 3, 'Should create 3 backups');

  } finally {
    // Cleanup all test sessions
    sessions.forEach(({ sessionPath }) => cleanupTestSession(sessionPath));

    // Cleanup all backups
    backups.forEach(backupPath => {
      if (fs.existsSync(backupPath)) {
        fs.unlinkSync(backupPath);
      }
    });
  }
});

// Test 8: Hook integration check
test('Session hooks are callable', async () => {
  try {
    // Test pre-task hook
    execSync('npx claude-flow@alpha hooks pre-task --description "test" --task-id "test-123" --help', {
      stdio: 'pipe'
    });

    // Test post-task hook
    execSync('npx claude-flow@alpha hooks post-task --task-id "test-123" --help', {
      stdio: 'pipe'
    });

    // Test session-end hook
    execSync('npx claude-flow@alpha hooks session-end --help', {
      stdio: 'pipe'
    });

    // If we got here, all hooks are callable
    assert(true, 'All hooks should be callable');

  } catch (error) {
    throw new Error(`Hook not callable: ${error.message}`);
  }
});

/**
 * Run all tests
 */
async function runTests() {
  setup();

  // Run tests sequentially
  await test('Session structure follows specification', async () => {
    const { sessionId, sessionPath } = createTestSession();
    try {
      assert(fs.existsSync(sessionPath), 'Session directory should exist');
      const metadataPath = path.join(sessionPath, 'metadata.json');
      assert(fs.existsSync(metadataPath), 'metadata.json should exist');
    } finally {
      cleanupTestSession(sessionPath);
    }
  });

  await test('Files route to correct artifact subdirectories', async () => {
    const { sessionId, sessionPath } = createTestSession();
    try {
      const codeFile = path.join(sessionPath, 'artifacts', 'code', 'test.js');
      assert(fs.existsSync(codeFile), 'Code file should exist in artifacts/code/');
    } finally {
      cleanupTestSession(sessionPath);
    }
  });

  await test('Session summary generation includes all artifacts', async () => {
    const { sessionId, sessionPath } = createTestSession();
    try {
      const closeoutPath = path.join(
        process.cwd(),
        'sessions/session-20251113-211159-hive-mind-setup/iteration-4/artifacts/code/session-closeout.js'
      );

      if (!fs.existsSync(closeoutPath)) {
        throw new Error('session-closeout.js not found - run this test from project root');
      }

      const { generateSessionSummary } = require(closeoutPath);
      const summary = generateSessionSummary(sessionId);
      assert(summary.includes(sessionId), 'Summary should include session ID');
    } finally {
      cleanupTestSession(sessionPath);
    }
  });

  await test('Archive creation includes all session data', async () => {
    const { sessionId, sessionPath } = createTestSession();
    let backupPath;
    try {
      const closeoutPath = path.join(
        process.cwd(),
        'sessions/session-20251113-211159-hive-mind-setup/iteration-4/artifacts/code/session-closeout.js'
      );

      const { archiveSession, generateSessionSummary } = require(closeoutPath);
      const summary = generateSessionSummary(sessionId);
      backupPath = archiveSession(sessionId, summary);

      assert(fs.existsSync(backupPath), 'Backup file should exist');

      const backup = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));
      assert(backup.sessionId === sessionId, 'Backup should include session ID');
      assert(Array.isArray(backup.artifacts), 'Backup should include artifacts array');
    } finally {
      cleanupTestSession(sessionPath);
      if (backupPath && fs.existsSync(backupPath)) {
        fs.unlinkSync(backupPath);
      }
    }
  });

  await test('Metadata updates to closed status', async () => {
    const { sessionId, sessionPath } = createTestSession();
    try {
      const closeoutPath = path.join(
        process.cwd(),
        'sessions/session-20251113-211159-hive-mind-setup/iteration-4/artifacts/code/session-closeout.js'
      );

      const { updateSessionMetadata, readSessionMetadata } = require(closeoutPath);
      updateSessionMetadata(sessionId, 'closed');

      const metadata = readSessionMetadata(sessionId);
      assert(metadata.status === 'closed', 'Status should be closed');
      assert(metadata.closed_at, 'Should include closed_at timestamp');
    } finally {
      cleanupTestSession(sessionPath);
    }
  });

  await test('CRITICAL: Directory removed after successful closeout', async () => {
    const { sessionId, sessionPath } = createTestSession();
    let backupPath;

    try {
      const closeoutPath = path.join(
        process.cwd(),
        'sessions/session-20251113-211159-hive-mind-setup/iteration-4/artifacts/code/session-closeout.js'
      );

      const closeoutModule = require(closeoutPath);
      const {
        archiveSession,
        generateSessionSummary,
        updateSessionMetadata,
        removeSessionDirectory
      } = closeoutModule;

      // Perform closeout steps
      const summary = generateSessionSummary(sessionId);
      backupPath = archiveSession(sessionId, summary);
      updateSessionMetadata(sessionId, 'closed');

      // Verify backup exists
      assert(fs.existsSync(backupPath), 'Backup must exist before cleanup');

      // Check if removeSessionDirectory exists
      if (typeof removeSessionDirectory !== 'function') {
        throw new Error('EXPECTED FAILURE: removeSessionDirectory function not implemented');
      }

      // If it exists, test it
      removeSessionDirectory(sessionId);
      assert(!fs.existsSync(sessionPath), 'Session directory should be removed');
      assert(fs.existsSync(backupPath), 'Backup should remain');

    } finally {
      // Cleanup
      if (fs.existsSync(sessionPath)) {
        cleanupTestSession(sessionPath);
      }
      if (backupPath && fs.existsSync(backupPath)) {
        fs.unlinkSync(backupPath);
      }
    }
  });

  await test('Batch closeout handles multiple sessions', async () => {
    const sessions = [];
    const backups = [];

    try {
      for (let i = 0; i < 3; i++) {
        sessions.push(createTestSession());
      }

      const closeoutPath = path.join(
        process.cwd(),
        'sessions/session-20251113-211159-hive-mind-setup/iteration-4/artifacts/code/session-closeout.js'
      );

      const { archiveSession, generateSessionSummary } = require(closeoutPath);

      for (const { sessionId } of sessions) {
        const summary = generateSessionSummary(sessionId);
        const backupPath = archiveSession(sessionId, summary);
        backups.push(backupPath);
        assert(fs.existsSync(backupPath), `Backup should exist for ${sessionId}`);
      }

      assert(backups.length === 3, 'Should create 3 backups');

    } finally {
      sessions.forEach(({ sessionPath }) => cleanupTestSession(sessionPath));
      backups.forEach(backupPath => {
        if (fs.existsSync(backupPath)) {
          fs.unlinkSync(backupPath);
        }
      });
    }
  });

  await test('Session hooks are callable', async () => {
    try {
      execSync('npx claude-flow@alpha hooks pre-task --help', { stdio: 'pipe' });
      execSync('npx claude-flow@alpha hooks post-task --help', { stdio: 'pipe' });
      execSync('npx claude-flow@alpha hooks session-end --help', { stdio: 'pipe' });
      assert(true, 'All hooks should be callable');
    } catch (error) {
      throw new Error(`Hook not callable: ${error.message}`);
    }
  });

  teardown();
}

// Run the test suite
runTests().catch(error => {
  console.error(`${colors.red}[ERROR]${colors.reset}`, error.message);
  process.exit(1);
});
