#!/usr/bin/env node
/**
 * Tests for Session State Manager
 */

const fs = require('fs');
const path = require('path');
const SessionStateManager = require('../code/session-state-manager');

// Test utilities
let testCounter = 0;
let passedTests = 0;
let failedTests = 0;

function test(description, fn) {
  testCounter++;
  try {
    fn();
    passedTests++;
    console.log(`✅ Test ${testCounter}: ${description}`);
  } catch (error) {
    failedTests++;
    console.error(`❌ Test ${testCounter}: ${description}`);
    console.error(`   Error: ${error.message}`);
  }
}

function assertEquals(actual, expected, message = '') {
  if (actual !== expected) {
    throw new Error(
      `${message}\nExpected: ${expected}\nActual: ${actual}`
    );
  }
}

function assertThrows(fn, expectedMessage = null) {
  try {
    fn();
    throw new Error('Expected function to throw, but it did not');
  } catch (error) {
    if (expectedMessage && !error.message.includes(expectedMessage)) {
      throw new Error(
        `Expected error message to include "${expectedMessage}", ` +
        `but got: "${error.message}"`
      );
    }
  }
}

// Test setup
const TEST_WORKSPACE = path.join(__dirname, 'test-workspace');
const TEST_SESSION_ID = 'test-session-state';

function setupTestSession(initialState = 'active') {
  const sessionDir = path.join(TEST_WORKSPACE, 'sessions', TEST_SESSION_ID);
  const metadataPath = path.join(sessionDir, 'metadata.json');

  // Clean up previous test
  if (fs.existsSync(TEST_WORKSPACE)) {
    fs.rmSync(TEST_WORKSPACE, { recursive: true });
  }

  // Create test session
  fs.mkdirSync(sessionDir, { recursive: true });
  fs.writeFileSync(
    metadataPath,
    JSON.stringify({
      session_id: TEST_SESSION_ID,
      created_at: new Date().toISOString(),
      status: initialState
    }, null, 2)
  );

  return new SessionStateManager(TEST_SESSION_ID, TEST_WORKSPACE);
}

function cleanup() {
  if (fs.existsSync(TEST_WORKSPACE)) {
    fs.rmSync(TEST_WORKSPACE, { recursive: true });
  }
}

// Run tests
console.log('🧪 Session State Manager Tests');
console.log('================================\n');

// Test 1: Read initial state
test('Read initial active state', () => {
  const manager = setupTestSession('active');
  assertEquals(manager.getState(), 'active');
  assertEquals(manager.isActive(), true);
  assertEquals(manager.isPaused(), false);
  assertEquals(manager.isClosed(), false);
  cleanup();
});

// Test 2: Transition active → paused
test('Transition from active to paused', () => {
  const manager = setupTestSession('active');
  const result = manager.pause('test pause');

  assertEquals(result.from, 'active');
  assertEquals(result.to, 'paused');
  assertEquals(result.reason, 'test pause');
  assertEquals(manager.getState(), 'paused');
  assertEquals(manager.isPaused(), true);

  cleanup();
});

// Test 3: Transition paused → active
test('Transition from paused to active', () => {
  const manager = setupTestSession('paused');
  const result = manager.resume('test resume');

  assertEquals(result.from, 'paused');
  assertEquals(result.to, 'active');
  assertEquals(result.reason, 'test resume');
  assertEquals(manager.getState(), 'active');
  assertEquals(manager.isActive(), true);

  cleanup();
});

// Test 4: Transition active → closed
test('Transition from active to closed', () => {
  const manager = setupTestSession('active');
  const result = manager.close('test close');

  assertEquals(result.from, 'active');
  assertEquals(result.to, 'closed');
  assertEquals(result.reason, 'test close');
  assertEquals(manager.getState(), 'closed');
  assertEquals(manager.isClosed(), true);

  cleanup();
});

// Test 5: Transition paused → closed
test('Transition from paused to closed', () => {
  const manager = setupTestSession('paused');
  const result = manager.close('test close');

  assertEquals(result.from, 'paused');
  assertEquals(result.to, 'closed');
  assertEquals(manager.getState(), 'closed');

  cleanup();
});

// Test 6: Invalid transition (closed → active)
test('Reject invalid transition from closed to active', () => {
  const manager = setupTestSession('closed');

  assertThrows(
    () => manager.resume(),
    'Invalid transition'
  );

  cleanup();
});

// Test 7: Invalid transition (closed → paused)
test('Reject invalid transition from closed to paused', () => {
  const manager = setupTestSession('closed');

  assertThrows(
    () => manager.pause(),
    'Invalid transition'
  );

  cleanup();
});

// Test 8: Metadata persistence
test('Metadata changes persist to disk', () => {
  const manager1 = setupTestSession('active');
  manager1.pause('persistence test');

  // Create new manager instance (simulates process restart)
  const manager2 = new SessionStateManager(TEST_SESSION_ID, TEST_WORKSPACE);
  assertEquals(manager2.getState(), 'paused');

  const metadata = manager2.readMetadata();
  assertEquals(metadata.pause_reason, 'persistence test');

  cleanup();
});

// Test 9: Timestamp tracking
test('State transitions include timestamps', () => {
  const manager = setupTestSession('active');
  const beforePause = new Date();

  const result = manager.pause();

  const afterPause = new Date();
  const transitionTime = new Date(result.timestamp);

  assertEquals(
    transitionTime >= beforePause && transitionTime <= afterPause,
    true,
    'Timestamp should be within test execution window'
  );

  cleanup();
});

// Test 10: Metadata cleanup on state change
test('Remove old state metadata on transition', () => {
  const manager = setupTestSession('paused');

  // Add paused_at timestamp
  const metadata = manager.readMetadata();
  metadata.paused_at = new Date().toISOString();
  manager.writeMetadata(metadata);

  // Resume should remove paused_at
  manager.resume();
  const updatedMetadata = manager.readMetadata();

  assertEquals(updatedMetadata.paused_at, undefined);
  assertEquals(updatedMetadata.last_resumed_at !== undefined, true);

  cleanup();
});

// Summary
console.log('\n📊 Test Summary');
console.log('================');
console.log(`Total:  ${testCounter}`);
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${failedTests}`);

if (failedTests > 0) {
  console.log('\n❌ Some tests failed');
  process.exit(1);
} else {
  console.log('\n✅ All tests passed');
  process.exit(0);
}
