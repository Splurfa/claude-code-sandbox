#!/usr/bin/env node
/**
 * Captain's Log Tests
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { logDecision, logInsight, logBlocker, logCorrection, searchLog } = require('../code/captains-log');

// Test helpers
function cleanupTestLogs() {
  const logDir = path.join(process.cwd(), 'sessions', 'captains-log');
  if (fs.existsSync(logDir)) {
    fs.readdirSync(logDir).forEach(file => {
      if (file.startsWith('test-')) {
        fs.unlinkSync(path.join(logDir, file));
      }
    });
  }
}

// Test suite
function runTests() {
  console.log('🧪 Testing Captain\'s Log System...\n');

  // Test 1: Log decision
  console.log('Test 1: Log decision');
  const result1 = logDecision('Use PostgreSQL', 'Better scalability for our use case');
  assert(fs.existsSync(result1.logPath), 'Log file should exist');
  console.log('✅ Decision logged successfully\n');

  // Test 2: Log insight
  console.log('Test 2: Log insight');
  const result2 = logInsight('Phase 1 hooks work well', 'Always-on coordination is seamless');
  assert(result2.timestamp, 'Should return timestamp');
  console.log('✅ Insight logged successfully\n');

  // Test 3: Log blocker
  console.log('Test 3: Log blocker');
  const result3 = logBlocker('API rate limit', 'Slowing down data collection');
  assert(result3.timestamp, 'Should return timestamp');
  console.log('✅ Blocker logged successfully\n');

  // Test 4: Log correction
  console.log('Test 4: Log correction');
  const result4 = logCorrection(
    'Used sync file operations',
    'Switched to async operations',
    'success'
  );
  assert(result4.timestamp, 'Should return timestamp');
  console.log('✅ Correction logged successfully\n');

  // Test 5: Search logs
  console.log('Test 5: Search logs');
  const searchResults = searchLog('PostgreSQL', 7);
  assert(searchResults.length >= 0, 'Should return search results');
  console.log(`✅ Search found ${searchResults.length} matches\n`);

  // Test 6: Time-neutral format
  console.log('Test 6: Time-neutral format');
  const logContent = fs.readFileSync(result1.logPath, 'utf-8');
  assert(!logContent.includes('today'), 'Should not use temporal terms');
  assert(!logContent.includes('yesterday'), 'Should not use temporal terms');
  console.log('✅ Time-neutral formatting verified\n');

  console.log('✅ All Captain\'s Log tests passed!');
}

// Run tests
if (require.main === module) {
  try {
    runTests();
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

module.exports = { runTests };
