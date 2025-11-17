#!/usr/bin/env node
/**
 * Session Closeout Tests
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { generateSessionSummary, archiveSession } = require('../code/session-closeout');

function runTests() {
  console.log('🧪 Testing Session Closeout System...\n');

  // Test 1: Generate summary for existing session
  console.log('Test 1: Generate session summary');
  const sessionId = 'session-20251113-211159-hive-mind-setup';
  const summary = generateSessionSummary(sessionId);
  assert(summary.includes(sessionId), 'Summary should include session ID');
  assert(summary.includes('## Artifacts Created'), 'Summary should list artifacts');
  console.log('✅ Session summary generated\n');

  // Test 2: Archive structure
  console.log('Test 2: Archive structure');
  const testSessionId = 'test-session-' + Date.now();
  const testSessionPath = path.join(process.cwd(), 'sessions', testSessionId);

  // Create test session
  fs.mkdirSync(path.join(testSessionPath, 'artifacts', 'code'), { recursive: true });
  fs.writeFileSync(path.join(testSessionPath, 'metadata.json'), JSON.stringify({
    session_id: testSessionId,
    created_at: new Date().toISOString(),
    status: 'active'
  }));

  // Archive it
  const backupPath = archiveSession(testSessionId, 'Test summary');
  assert(fs.existsSync(backupPath), 'Backup file should exist');

  // Verify backup content
  const backup = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));
  assert(backup.sessionId === testSessionId, 'Backup should have session ID');
  assert(backup.summary === 'Test summary', 'Backup should have summary');
  assert(backup.metadata, 'Backup should have metadata');
  assert(Array.isArray(backup.artifacts), 'Backup should have artifacts array');

  // Cleanup
  fs.unlinkSync(backupPath);
  fs.rmSync(testSessionPath, { recursive: true });

  console.log('✅ Archive structure verified\n');

  // Test 3: Summary includes all artifact categories
  console.log('Test 3: Artifact categorization');
  const testSessionId2 = 'test-session-' + Date.now();
  const testSessionPath2 = path.join(process.cwd(), 'sessions', testSessionId2);

  // Create test artifacts
  const categories = ['code', 'tests', 'docs', 'scripts', 'notes'];
  categories.forEach(cat => {
    const catPath = path.join(testSessionPath2, 'artifacts', cat);
    fs.mkdirSync(catPath, { recursive: true });
    fs.writeFileSync(path.join(catPath, `test.${cat}`), 'test content');
  });

  const summary2 = generateSessionSummary(testSessionId2);
  categories.forEach(cat => {
    assert(summary2.includes(`### ${cat}/`), `Summary should include ${cat} category`);
  });

  // Cleanup
  fs.rmSync(testSessionPath2, { recursive: true });

  console.log('✅ Artifact categorization verified\n');

  // Test 4: Backup location
  console.log('Test 4: Backup location');
  const backupDir = path.join(process.cwd(), '.swarm', 'backups');
  assert(fs.existsSync(backupDir), 'Backup directory should exist');
  console.log(`✅ Backup directory: ${backupDir}\n`);

  console.log('✅ All Session Closeout tests passed!');
}

// Run tests
if (require.main === module) {
  try {
    runTests();
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

module.exports = { runTests };
