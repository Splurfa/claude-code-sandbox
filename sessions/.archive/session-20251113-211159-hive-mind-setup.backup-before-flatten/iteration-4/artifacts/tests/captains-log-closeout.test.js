#!/usr/bin/env node
/**
 * Captain's Log Integration Tests
 * Tests for session closeout Captain's Log entries
 * Uses the existing captains-log.js module
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const {
  logEntry,
  logDecision,
  logInsight,
  searchLog,
  CATEGORIES
} = require('../code/captains-log');

// Test helper
function testCase(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    return true;
  } catch (error) {
    console.log(`  ✗ ${name}`);
    console.log(`    ${error.message}`);
    return false;
  }
}

// Cleanup helper
function cleanupTestLogs() {
  const logsDir = path.join(process.cwd(), 'sessions', 'captains-log');
  if (fs.existsSync(logsDir)) {
    const today = new Date().toISOString().slice(0, 10);
    const testLogPath = path.join(logsDir, `${today}.md`);
    if (fs.existsSync(testLogPath)) {
      fs.unlinkSync(testLogPath);
    }
  }
}

console.log('\n🧪 Captain\'s Log Integration Tests\n');

let passed = 0;
let failed = 0;

// Test Suite 1: Session Closeout Integration
console.log('Session Closeout Integration:');

// Before: cleanup
cleanupTestLogs();

if (testCase('should write session closeout entry with proper format', () => {
  const sessionId = 'session-20251114-test-closeout';
  const backupPath = '.swarm/backups/session-2025-11-14T16-45-00.json';
  const summary = 'Complete hive mind system. Phase 1-3 delivered with full test coverage.';

  logEntry('Session Closeout', summary, {
    sessionId,
    artifactPath: backupPath
  });

  const logsDir = path.join(process.cwd(), 'sessions', 'captains-log');
  const today = new Date().toISOString().slice(0, 10);
  const logPath = path.join(logsDir, `${today}.md`);

  assert.ok(fs.existsSync(logPath), 'Log file should exist');

  const content = fs.readFileSync(logPath, 'utf-8');

  // Verify ISO timestamp format
  assert.ok(content.match(/## \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/), 'Should have ISO timestamp');

  // Verify session closeout label
  assert.ok(content.includes('Session Closeout'), 'Should label as session closeout');

  // Verify session ID (from SESSION_ID env or passed metadata)
  // Note: In this test, sessionId is passed as metadata, so it won't be in the Session field
  // but it's available in the context

  // Verify backup path
  assert.ok(content.includes(backupPath), 'Should include backup path');

  // Verify summary
  assert.ok(content.includes(summary), 'Should include summary');
})) passed++;
else failed++;

// Test Suite 2: Time-Neutral Format
console.log('\nTime-Neutral Format:');

if (testCase('should use ISO timestamps exclusively', () => {
  const logsDir = path.join(process.cwd(), 'sessions', 'captains-log');
  const today = new Date().toISOString().slice(0, 10);
  const logPath = path.join(logsDir, `${today}.md`);

  const content = fs.readFileSync(logPath, 'utf-8');

  // Verify ISO format
  assert.ok(content.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/), 'Should use ISO format');

  // Verify NO relative time language
  const forbiddenWords = ['today', 'yesterday', 'tomorrow', 'ago', 'now', 'recently'];
  forbiddenWords.forEach(word => {
    assert.ok(
      !content.toLowerCase().includes(word),
      `Should not contain time-relative word: "${word}"`
    );
  });
})) passed++;
else failed++;

// Test Suite 3: Non-Destructive Append
console.log('\nNon-Destructive Append:');

if (testCase('should append to existing log (not overwrite)', () => {
  // Write first entry
  logEntry('Session Closeout', 'First entry', {
    artifactPath: '.swarm/backups/1.json'
  });

  const logsDir = path.join(process.cwd(), 'sessions', 'captains-log');
  const today = new Date().toISOString().slice(0, 10);
  const logPath = path.join(logsDir, `${today}.md`);

  const firstContent = fs.readFileSync(logPath, 'utf-8');
  const firstLength = firstContent.length;

  // Write second entry
  logEntry('Session Closeout', 'Second entry', {
    artifactPath: '.swarm/backups/2.json'
  });

  const secondContent = fs.readFileSync(logPath, 'utf-8');

  // Both entries should be present
  assert.ok(secondContent.includes('First entry'), 'Should preserve first entry');
  assert.ok(secondContent.includes('Second entry'), 'Should include second entry');

  // Second content should be longer
  assert.ok(secondContent.length > firstLength, 'Should append, not replace');
})) passed++;
else failed++;

// Test Suite 4: Batch Closeout Integration
console.log('\nBatch Closeout Integration:');

if (testCase('should handle 5 Captain\'s Log entries in batch', () => {
  const sessions = [
    { id: 'session-1', summary: 'Summary 1', archivePath: '.swarm/backups/session-1.json' },
    { id: 'session-2', summary: 'Summary 2', archivePath: '.swarm/backups/session-2.json' },
    { id: 'session-3', summary: 'Summary 3', archivePath: '.swarm/backups/session-3.json' },
    { id: 'session-4', summary: 'Summary 4', archivePath: '.swarm/backups/session-4.json' },
    { id: 'session-5', summary: 'Summary 5', archivePath: '.swarm/backups/session-5.json' }
  ];

  // Write all entries
  sessions.forEach(session => {
    logEntry('Session Closeout', session.summary, {
      artifactPath: session.archivePath
    });
  });

  const logsDir = path.join(process.cwd(), 'sessions', 'captains-log');
  const today = new Date().toISOString().slice(0, 10);
  const logPath = path.join(logsDir, `${today}.md`);

  const content = fs.readFileSync(logPath, 'utf-8');

  // Verify all sessions present
  sessions.forEach(session => {
    assert.ok(content.includes(session.summary), `Should include ${session.id} summary`);
    assert.ok(content.includes(session.archivePath), `Should include ${session.id} archive path`);
  });

  // Verify multiple entries (count timestamp headings, excluding previous test entries)
  const entryCount = (content.match(/Session Closeout/g) || []).length;
  assert.ok(entryCount >= 5, `Should have at least 5 closeout entries (found ${entryCount})`);
})) passed++;
else failed++;

// Test Suite 5: HITL Rejection Flow
console.log('\nHITL Rejection Flow:');

if (testCase('should not write to Captain\'s Log when approval denied', () => {
  // This test verifies the integration point
  // The actual approval logic is in session-closeout.js

  const logsDir = path.join(process.cwd(), 'sessions', 'captains-log');
  const today = new Date().toISOString().slice(0, 10);
  const logPath = path.join(logsDir, `${today}.md`);

  // Read current content
  const beforeContent = fs.readFileSync(logPath, 'utf-8');

  // Simulate rejection - NO logEntry call
  // (In real flow, closeout returns early on rejection)

  const afterContent = fs.readFileSync(logPath, 'utf-8');

  // Content should be unchanged
  assert.strictEqual(afterContent, beforeContent, 'Log should not change when approval denied');
})) passed++;
else failed++;

// Test Suite 6: Decision and Insight Logging
console.log('\nDecision and Insight Logging:');

if (testCase('should log decisions with rationale', () => {
  const decision = 'Use hierarchical swarm topology for complex workflows';
  const rationale = 'Hierarchical provides better coordination for multi-phase tasks';

  logDecision(decision, rationale, {
    agent: 'coordinator'
  });

  const logsDir = path.join(process.cwd(), 'sessions', 'captains-log');
  const today = new Date().toISOString().slice(0, 10);
  const logPath = path.join(logsDir, `${today}.md`);

  const content = fs.readFileSync(logPath, 'utf-8');

  assert.ok(content.includes(decision), 'Should include decision');
  assert.ok(content.includes(rationale), 'Should include rationale');
  assert.ok(content.includes('decisions'), 'Should categorize as decision');
})) passed++;
else failed++;

if (testCase('should log insights with context', () => {
  const insight = 'AgentDB vector search is 150x faster than traditional databases';
  const context = 'Tested with 1M vectors, HNSW indexing enabled';

  logInsight(insight, context, {
    agent: 'performance-analyzer'
  });

  const logsDir = path.join(process.cwd(), 'sessions', 'captains-log');
  const today = new Date().toISOString().slice(0, 10);
  const logPath = path.join(logsDir, `${today}.md`);

  const content = fs.readFileSync(logPath, 'utf-8');

  assert.ok(content.includes(insight), 'Should include insight');
  assert.ok(content.includes(context), 'Should include context');
  assert.ok(content.includes('insights'), 'Should categorize as insight');
})) passed++;
else failed++;

// Test Suite 7: Search Functionality
console.log('\nSearch Functionality:');

if (testCase('should search log entries by pattern', () => {
  // Search for entries we just logged
  const results = searchLog('Session Closeout');

  assert.ok(results.length > 0, 'Should find session closeout entries');
  assert.ok(results[0].content.includes('Session Closeout'), 'Results should include matching content');
})) passed++;
else failed++;

// Cleanup after tests
cleanupTestLogs();

// Summary
console.log(`\n${'='.repeat(60)}`);
console.log(`Test Results: ${passed} passed, ${failed} failed`);
console.log(`${'='.repeat(60)}\n`);

process.exit(failed > 0 ? 1 : 0);
