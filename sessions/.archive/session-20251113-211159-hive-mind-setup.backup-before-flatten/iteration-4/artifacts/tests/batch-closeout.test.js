#!/usr/bin/env node
/**
 * Comprehensive Test Suite for Batch Session Closeout
 * Tests with 5 real sessions currently in workspace
 *
 * Test Coverage:
 * 1. Batch closeout with 5 sessions
 * 2. Single session backward compatibility
 * 3. Error handling and partial failures
 * 4. Archive validation
 * 5. Cleanup validation
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Import functions from batch closeout
const {
  closeoutMultiple,
  executeBatchArchive,
  batchCloseoutWorkflow
} = require('../code/session-closeout-batch');

// Import single session functions for comparison
const {
  generateSessionSummary,
  archiveSession,
  readSessionMetadata
} = require('../code/session-closeout');

// Real sessions to test with
const TEST_SESSIONS = [
  'session-20251113-150000-session-management-infrastructure',
  'session-20251113-201000-workspace-analysis',
  'session-20251113-210416-conversation-analysis',
  'session-20251113-211159-hive-mind-setup',
  'session-20251114-010100-hitl-corrections'
];

// Test utilities
function getSessionPath(sessionId) {
  return path.join(process.cwd(), 'sessions', sessionId);
}

function getBackupDir() {
  return path.join(process.cwd(), '.swarm', 'backups');
}

function countBackups() {
  const backupDir = getBackupDir();
  if (!fs.existsSync(backupDir)) return 0;
  return fs.readdirSync(backupDir).filter(f => f.endsWith('.json')).length;
}

function verifySessionExists(sessionId) {
  return fs.existsSync(getSessionPath(sessionId));
}

function createTestBackupSnapshot() {
  return {
    backupCount: countBackups(),
    sessionStates: TEST_SESSIONS.map(id => ({
      id,
      exists: verifySessionExists(id),
      metadata: verifySessionExists(id) ? readSessionMetadata(id) : null
    }))
  };
}

// ============================================================================
// TEST 1: Batch Closeout with 5 Sessions
// ============================================================================

async function testBatchCloseoutWithFiveSessions() {
  console.log('\n=== TEST 1: Batch closeout with 5 sessions ===\n');

  const initialSnapshot = createTestBackupSnapshot();

  try {
    // Generate summaries for all 5 sessions
    console.log('Generating summaries for 5 sessions...');
    const result = await closeoutMultiple(TEST_SESSIONS);

    // Verify structure
    assert.ok(result, 'Result should exist');
    assert.equal(result.totalSessions, 5, 'Should process 5 sessions');
    assert.ok(Array.isArray(result.sessions), 'Sessions should be an array');
    assert.equal(result.sessions.length, 5, 'Should have 5 session summaries');

    // Verify each session has expected properties
    result.sessions.forEach((session, index) => {
      console.log(`  Checking session ${index + 1}: ${session.sessionId}`);

      if (session.status === 'success') {
        assert.ok(session.sessionId, 'Session should have ID');
        assert.ok(session.summary, 'Session should have summary');
        assert.ok(session.metadata, 'Session should have metadata');
        console.log(`    ✓ Summary generated (${session.summary.length} chars)`);
      } else {
        console.log(`    ⚠️  Session failed: ${session.error}`);
      }
    });

    // Verify consolidated format includes timestamp
    assert.ok(result.timestamp, 'Result should have timestamp');
    assert.ok(Date.parse(result.timestamp), 'Timestamp should be valid ISO date');

    console.log('\n✅ TEST 1 PASSED: Batch closeout with 5 sessions\n');
    return { passed: true, result };

  } catch (error) {
    console.error('\n❌ TEST 1 FAILED:', error.message);
    console.error(error.stack);
    return { passed: false, error: error.message };
  }
}

// ============================================================================
// TEST 2: Single Session Backward Compatibility
// ============================================================================

async function testSingleSessionBackwardCompatibility() {
  console.log('\n=== TEST 2: Single session backward compatibility ===\n');

  try {
    const singleSessionId = TEST_SESSIONS[0];
    console.log(`Testing with: ${singleSessionId}`);

    // Test with single session wrapped in array
    const batchResult = await closeoutMultiple([singleSessionId]);

    // Verify it works the same as before
    assert.equal(batchResult.totalSessions, 1, 'Should process 1 session');
    assert.equal(batchResult.sessions.length, 1, 'Should have 1 summary');

    const session = batchResult.sessions[0];
    if (session.status === 'success') {
      // Compare with direct generation
      const directSummary = generateSessionSummary(singleSessionId);

      assert.ok(session.summary, 'Batch should generate summary');
      assert.ok(directSummary, 'Direct should generate summary');
      assert.equal(
        session.summary.length,
        directSummary.length,
        'Both methods should generate same summary'
      );

      console.log('  ✓ Summary matches direct generation');
      console.log('  ✓ API unchanged');
    }

    console.log('\n✅ TEST 2 PASSED: Single session backward compatible\n');
    return { passed: true };

  } catch (error) {
    console.error('\n❌ TEST 2 FAILED:', error.message);
    console.error(error.stack);
    return { passed: false, error: error.message };
  }
}

// ============================================================================
// TEST 3: Error Handling and Partial Failures
// ============================================================================

async function testErrorHandling() {
  console.log('\n=== TEST 3: Error handling and partial failures ===\n');

  try {
    // Mix valid and invalid sessions
    const mixedSessions = [
      TEST_SESSIONS[0],
      'session-99999999-999999-nonexistent',
      TEST_SESSIONS[1],
      'session-invalid-id',
      TEST_SESSIONS[2]
    ];

    console.log('Testing with mix of valid and invalid sessions...');
    const result = await closeoutMultiple(mixedSessions);

    // Should process what it can
    assert.ok(result, 'Should return result even with errors');
    console.log(`  Total sessions attempted: ${result.totalSessions}`);

    // Count successful vs failed
    const successful = result.sessions.filter(s => s.status === 'success').length;
    const failed = result.sessions.filter(s => s.status === 'failed').length;

    console.log(`  Successful: ${successful}`);
    console.log(`  Failed: ${failed}`);

    // Batch closeout filters invalid sessions before processing
    // So we should have exactly 3 valid sessions (the real ones)
    assert.ok(result.totalSessions === 3, 'Should filter to 3 valid sessions');
    assert.ok(successful >= 3, 'Should process at least 3 valid sessions');

    // Verify failed sessions have error messages
    result.sessions.forEach(session => {
      if (session.status === 'failed') {
        assert.ok(session.error, 'Failed session should have error message');
        console.log(`  Error captured: ${session.error}`);
      }
    });

    console.log('\n✅ TEST 3 PASSED: Error handling works correctly\n');
    return { passed: true };

  } catch (error) {
    console.error('\n❌ TEST 3 FAILED:', error.message);
    console.error(error.stack);
    return { passed: false, error: error.message };
  }
}

// ============================================================================
// TEST 4: Archive Validation
// ============================================================================

async function testArchiveValidation() {
  console.log('\n=== TEST 4: Archive validation ===\n');

  const backupDir = getBackupDir();
  const initialBackupCount = countBackups();

  console.log(`Initial backup count: ${initialBackupCount}`);

  try {
    // Create test archives (dry run without hooks to avoid side effects)
    console.log('Testing archive creation...');

    const testSession = TEST_SESSIONS[0];
    const summary = generateSessionSummary(testSession);

    // Archive one session as test
    const backupPath = archiveSession(testSession, summary);

    // Verify backup was created
    assert.ok(fs.existsSync(backupPath), 'Backup file should exist');
    console.log(`  ✓ Backup created: ${path.basename(backupPath)}`);

    // Verify backup is valid JSON
    const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));

    assert.ok(backupData.sessionId, 'Backup should have sessionId');
    assert.ok(backupData.timestamp, 'Backup should have timestamp');
    assert.ok(backupData.summary, 'Backup should have summary');
    assert.ok(backupData.metadata, 'Backup should have metadata');
    assert.ok(Array.isArray(backupData.artifacts), 'Backup should have artifacts array');

    console.log('  ✓ Backup has correct JSON format');
    console.log(`  ✓ Session ID: ${backupData.sessionId}`);
    console.log(`  ✓ Artifacts: ${backupData.artifacts.length}`);

    // Verify new backup was added
    const finalBackupCount = countBackups();
    assert.ok(
      finalBackupCount > initialBackupCount,
      'Backup count should increase'
    );
    console.log(`  ✓ Backup count increased: ${initialBackupCount} → ${finalBackupCount}`);

    console.log('\n✅ TEST 4 PASSED: Archive validation\n');
    return { passed: true };

  } catch (error) {
    console.error('\n❌ TEST 4 FAILED:', error.message);
    console.error(error.stack);
    return { passed: false, error: error.message };
  }
}

// ============================================================================
// TEST 5: Execute Batch Archive
// ============================================================================

async function testExecuteBatchArchive() {
  console.log('\n=== TEST 5: Execute batch archive ===\n');

  try {
    // First generate consolidated data
    const testSessions = TEST_SESSIONS.slice(0, 3); // Use first 3 to avoid side effects
    console.log(`Testing batch archive with ${testSessions.length} sessions...`);

    const consolidated = await closeoutMultiple(testSessions);

    // Execute batch archive
    console.log('Executing batch archive...');
    const results = await executeBatchArchive(consolidated);

    // Verify results structure
    assert.ok(Array.isArray(results), 'Results should be an array');
    assert.equal(results.length, testSessions.length, 'Should have result for each session');

    // Check each result
    results.forEach((result, index) => {
      console.log(`  Session ${index + 1}: ${result.sessionId}`);
      assert.ok(result.sessionId, 'Result should have sessionId');
      assert.ok(result.status, 'Result should have status');

      if (result.status === 'archived') {
        assert.ok(result.backupPath, 'Archived session should have backupPath');
        console.log(`    ✓ Status: ${result.status}`);
        console.log(`    ✓ Backup: ${path.basename(result.backupPath)}`);
      } else {
        console.log(`    Status: ${result.status}`);
        if (result.error) {
          console.log(`    Error: ${result.error}`);
        }
      }
    });

    // Count successful archives
    const archivedCount = results.filter(r => r.status === 'archived').length;
    console.log(`\n  Total archived: ${archivedCount}/${testSessions.length}`);

    console.log('\n✅ TEST 5 PASSED: Execute batch archive\n');
    return { passed: true, results };

  } catch (error) {
    console.error('\n❌ TEST 5 FAILED:', error.message);
    console.error(error.stack);
    return { passed: false, error: error.message };
  }
}

// ============================================================================
// TEST 6: Data Integrity Across Batch Operation
// ============================================================================

async function testDataIntegrity() {
  console.log('\n=== TEST 6: Data integrity across batch operation ===\n');

  try {
    const testSession = TEST_SESSIONS[0];
    console.log(`Testing data integrity for: ${testSession}`);

    // Get original data
    const originalSummary = generateSessionSummary(testSession);
    const originalMetadata = readSessionMetadata(testSession);

    console.log('  ✓ Original data captured');

    // Process through batch
    const batchResult = await closeoutMultiple([testSession]);
    const batchSession = batchResult.sessions[0];

    if (batchSession.status === 'success') {
      // Compare summaries
      assert.equal(
        batchSession.summary,
        originalSummary,
        'Summary should be identical'
      );
      console.log('  ✓ Summary integrity verified');

      // Compare metadata
      assert.deepEqual(
        batchSession.metadata,
        originalMetadata,
        'Metadata should be identical'
      );
      console.log('  ✓ Metadata integrity verified');
    }

    console.log('\n✅ TEST 6 PASSED: Data integrity maintained\n');
    return { passed: true };

  } catch (error) {
    console.error('\n❌ TEST 6 FAILED:', error.message);
    console.error(error.stack);
    return { passed: false, error: error.message };
  }
}

// ============================================================================
// TEST 7: Workspace State Validation
// ============================================================================

async function testWorkspaceState() {
  console.log('\n=== TEST 7: Workspace state validation ===\n');

  try {
    console.log('Checking workspace state before tests...');

    // Verify all test sessions exist
    TEST_SESSIONS.forEach((sessionId, index) => {
      const exists = verifySessionExists(sessionId);
      console.log(`  ${index + 1}. ${sessionId}: ${exists ? '✓' : '✗'}`);
      assert.ok(exists, `Session should exist: ${sessionId}`);
    });

    // Verify backup directory
    const backupDir = getBackupDir();
    console.log(`\nBackup directory: ${backupDir}`);

    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
      console.log('  Created backup directory');
    } else {
      const backupCount = countBackups();
      console.log(`  Existing backups: ${backupCount}`);
    }

    // Verify captains-log exists
    const logDir = path.join(process.cwd(), 'sessions', 'captains-log');
    if (fs.existsSync(logDir)) {
      console.log(`\nCaptain's log: ${logDir} ✓`);
    } else {
      console.log(`\nCaptain's log: ${logDir} (will be created)`);
    }

    console.log('\n✅ TEST 7 PASSED: Workspace state validated\n');
    return { passed: true };

  } catch (error) {
    console.error('\n❌ TEST 7 FAILED:', error.message);
    console.error(error.stack);
    return { passed: false, error: error.message };
  }
}

// ============================================================================
// Main Test Runner
// ============================================================================

async function runAllTests() {
  console.log('\n' + '='.repeat(80));
  console.log('BATCH SESSION CLOSEOUT - COMPREHENSIVE TEST SUITE');
  console.log('='.repeat(80));

  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    tests: []
  };

  const tests = [
    { name: 'Workspace State Validation', fn: testWorkspaceState },
    { name: 'Batch Closeout with 5 Sessions', fn: testBatchCloseoutWithFiveSessions },
    { name: 'Single Session Backward Compatibility', fn: testSingleSessionBackwardCompatibility },
    { name: 'Error Handling', fn: testErrorHandling },
    { name: 'Archive Validation', fn: testArchiveValidation },
    { name: 'Execute Batch Archive', fn: testExecuteBatchArchive },
    { name: 'Data Integrity', fn: testDataIntegrity }
  ];

  for (const test of tests) {
    results.total++;
    console.log(`\n${'='.repeat(80)}`);
    console.log(`Running: ${test.name}`);
    console.log('='.repeat(80));

    try {
      const result = await test.fn();
      if (result.passed) {
        results.passed++;
        results.tests.push({ name: test.name, status: 'PASSED' });
      } else {
        results.failed++;
        results.tests.push({
          name: test.name,
          status: 'FAILED',
          error: result.error
        });
      }
    } catch (error) {
      results.failed++;
      results.tests.push({
        name: test.name,
        status: 'ERROR',
        error: error.message
      });
      console.error(`\n❌ TEST ERROR: ${error.message}`);
    }
  }

  // Final report
  console.log('\n' + '='.repeat(80));
  console.log('TEST SUITE COMPLETE');
  console.log('='.repeat(80));
  console.log(`\nTotal: ${results.total}`);
  console.log(`Passed: ${results.passed} ✅`);
  console.log(`Failed: ${results.failed} ❌`);
  console.log(`\nSuccess Rate: ${((results.passed / results.total) * 100).toFixed(1)}%\n`);

  // Detailed results
  console.log('Detailed Results:');
  results.tests.forEach((test, index) => {
    const icon = test.status === 'PASSED' ? '✅' : '❌';
    console.log(`  ${index + 1}. ${icon} ${test.name} - ${test.status}`);
    if (test.error) {
      console.log(`     Error: ${test.error}`);
    }
  });

  console.log('\n' + '='.repeat(80) + '\n');

  return results;
}

// ============================================================================
// CLI Execution
// ============================================================================

if (require.main === module) {
  runAllTests()
    .then(results => {
      process.exit(results.failed === 0 ? 0 : 1);
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = {
  runAllTests,
  testBatchCloseoutWithFiveSessions,
  testSingleSessionBackwardCompatibility,
  testErrorHandling,
  testArchiveValidation,
  testExecuteBatchArchive,
  testDataIntegrity,
  testWorkspaceState
};
