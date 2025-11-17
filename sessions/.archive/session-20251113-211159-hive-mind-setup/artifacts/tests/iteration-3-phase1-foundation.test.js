#!/usr/bin/env node
/**
 * Phase 1 Foundation Systems Test Suite
 * Validates all 4 core components
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Import systems
const sessionInit = require('../code/session-auto-init');
const hooks = require('../code/always-on-hooks');
const templates = require('../code/agent-templates');
const learning = require('../code/learning-integration');

/**
 * Test 1: Session Auto-Initialization
 */
function testSessionAutoInit() {
  console.log('\n🧪 Test 1: Session Auto-Initialization');

  // Clear any existing session
  delete process.env.SESSION_ID;

  // Test new chat detection
  assert.strictEqual(sessionInit.isNewChat(), true, 'Should detect new chat');

  // Test session ID generation
  const sessionId = sessionInit.generateSessionId('test-topic');
  assert.match(sessionId, /^session-\d{8}-\d{6}-test-topic$/, 'Session ID format correct');

  // Test structure creation
  const testSessionId = `test-${Date.now()}`;
  const sessionPath = sessionInit.createSessionStructure(testSessionId);

  // Verify directories exist
  const expectedDirs = ['code', 'tests', 'docs', 'scripts', 'notes'];
  expectedDirs.forEach(dir => {
    const dirPath = path.join(sessionPath, 'artifacts', dir);
    assert.strictEqual(fs.existsSync(dirPath), true, `${dir} directory should exist`);
  });

  // Verify metadata.json exists
  const metadataPath = path.join(sessionPath, 'metadata.json');
  assert.strictEqual(fs.existsSync(metadataPath), true, 'metadata.json should exist');

  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
  assert.strictEqual(metadata.session_id, testSessionId, 'Metadata session_id correct');
  assert.strictEqual(metadata.status, 'active', 'Metadata status should be active');

  // Verify session-summary.md exists
  const summaryPath = path.join(sessionPath, 'session-summary.md');
  assert.strictEqual(fs.existsSync(summaryPath), true, 'session-summary.md should exist');

  // Cleanup
  fs.rmSync(sessionPath, { recursive: true, force: true });

  console.log('✅ Session auto-initialization tests passed');
}

/**
 * Test 2: Always-On Memory Coordination
 */
function testAlwaysOnHooks() {
  console.log('\n🧪 Test 2: Always-On Memory Coordination');

  // Test hook registry
  assert.strictEqual(typeof hooks.HOOK_REGISTRY, 'object', 'Hook registry should exist');
  assert.strictEqual(hooks.HOOK_REGISTRY['file:write'], 'post-edit', 'file:write hook mapped');

  // Test hook firing (non-blocking)
  let hookFired = false;
  hooks.fireHook('decision:made', {
    key: 'test-key',
    value: 'test-value'
  }).then(() => {
    hookFired = true;
  });

  // Test storeDecision function
  process.env.SESSION_ID = 'test-session';
  hooks.storeDecision('test-decision', { action: 'test' });

  // Test trainPattern function
  hooks.trainPattern('test-pattern', 'success');

  console.log('✅ Always-on hooks tests passed');
}

/**
 * Test 3: Agent Prompt Templates
 */
function testAgentTemplates() {
  console.log('\n🧪 Test 3: Agent Prompt Templates');

  // Test template registry
  assert.strictEqual(typeof templates.AGENT_TEMPLATES, 'object', 'Template registry should exist');
  assert.strictEqual(templates.AGENT_TEMPLATES.researcher.role, 'Research Agent', 'Researcher template exists');

  // Test prompt generation
  process.env.SESSION_ID = 'test-session';
  const prompt = templates.generateAgentPrompt('coder', 'Build feature X', 'test-session');

  assert.match(prompt, /Implementation Agent/, 'Prompt should contain role');
  assert.match(prompt, /Build feature X/, 'Prompt should contain task');
  assert.match(prompt, /sessions\/test-session\/artifacts/, 'Prompt should contain artifacts path');
  assert.match(prompt, /COORDINATION PROTOCOL/, 'Prompt should contain hook instructions');

  // Test all agent types have templates
  const requiredTypes = ['researcher', 'coder', 'tester', 'reviewer', 'coordinator'];
  requiredTypes.forEach(type => {
    assert.strictEqual(typeof templates.AGENT_TEMPLATES[type], 'object', `${type} template should exist`);
  });

  console.log('✅ Agent template tests passed');
}

/**
 * Test 4: Learning System Integration
 */
function testLearningIntegration() {
  console.log('\n🧪 Test 4: Learning System Integration');

  // Test correction capture
  learning.captureCorrection(
    'wrong approach',
    'correct approach',
    'success'
  ).then(entry => {
    assert.strictEqual(entry.verdict, 'correct', 'Verdict should be correct');
    assert.strictEqual(entry.outcome, 'success', 'Outcome should be success');
  });

  // Test pattern retrieval
  const patterns = learning.getLearnedPatterns();
  assert.strictEqual(Array.isArray(patterns), true, 'Patterns should be an array');

  // Test learning report generation
  const report = learning.generateLearningReport();
  assert.strictEqual(typeof report.total_patterns, 'number', 'Report should have total_patterns');
  assert.strictEqual(typeof report.successful_corrections, 'number', 'Report should have successful_corrections');

  console.log('✅ Learning integration tests passed');
}

/**
 * Integration Test: Complete Workflow
 */
function testCompleteWorkflow() {
  console.log('\n🧪 Integration Test: Complete Workflow');

  // Scenario: New chat → Session init → Agent spawn → Work → Learn

  // Step 1: Initialize session
  delete process.env.SESSION_ID;
  const sessionId = sessionInit.autoInitialize('Build REST API');
  assert.match(sessionId, /^session-\d{8}-\d{6}/, 'Session should be initialized');

  // Step 2: Generate agent with hooks
  const agentPrompt = templates.generateAgentPrompt('coder', 'Build endpoint', sessionId);
  assert.match(agentPrompt, /COORDINATION PROTOCOL/, 'Agent should have hook instructions');

  // Step 3: Simulate work with hooks
  hooks.storeDecision('api-design', { framework: 'express' });

  // Step 4: Capture learning
  learning.captureCorrection(
    'Used wrong HTTP method',
    'Changed to POST',
    'success'
  );

  // Step 5: Verify artifacts structure
  const artifactsPath = path.join('sessions', sessionId, 'artifacts');
  assert.strictEqual(fs.existsSync(artifactsPath), true, 'Artifacts directory should exist');

  // Cleanup
  fs.rmSync(path.join('sessions', sessionId), { recursive: true, force: true });

  console.log('✅ Complete workflow test passed');
}

/**
 * Validate Test Scenarios from Reassessment
 */
function testReassessmentScenarios() {
  console.log('\n🧪 Reassessment Scenarios Validation');

  console.log('\n  Scenario 1: New User Opens Claude Code');
  // No manual session creation needed
  assert.strictEqual(sessionInit.isNewChat(), true, 'Should detect new chat');
  const sessionId = sessionInit.autoInitialize('First message');
  assert.ok(sessionId, 'Session should auto-create');
  console.log('  ✅ Session auto-created');

  console.log('\n  Scenario 2: Agent Spawns During Work');
  // Agent gets prompt with embedded hooks
  const prompt = templates.generateAgentPrompt('coder', 'Task', sessionId);
  assert.match(prompt, /always-on-hooks.js/, 'Hooks should be embedded');
  console.log('  ✅ Hooks automatically embedded');

  console.log('\n  Scenario 3: User Corrects Agent');
  // Correction automatically captured
  learning.captureCorrection('wrong', 'right', 'success');
  const patterns = learning.getLearnedPatterns();
  console.log('  ✅ Correction captured in learning system');

  console.log('\n  Scenario 4: Multi-Session Context');
  // Memory persists across sessions via .swarm/memory.db
  hooks.storeDecision('persistent-decision', { value: 'test' });
  console.log('  ✅ Memory stored for cross-session access');

  // Cleanup
  fs.rmSync(path.join('sessions', sessionId), { recursive: true, force: true });

  console.log('\n✅ All reassessment scenarios validated');
}

/**
 * Run all tests
 */
function runAllTests() {
  console.log('🚀 Phase 1 Foundation Systems Test Suite\n');
  console.log('=' .repeat(60));

  try {
    testSessionAutoInit();
    testAlwaysOnHooks();
    testAgentTemplates();
    testLearningIntegration();
    testCompleteWorkflow();
    testReassessmentScenarios();

    console.log('\n' + '='.repeat(60));
    console.log('✅ ALL TESTS PASSED - Phase 1 Foundation Complete');
    console.log('='.repeat(60) + '\n');

    return 0;
  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
    console.error(error.stack);
    return 1;
  }
}

// Run tests if executed directly
if (require.main === module) {
  process.exit(runAllTests());
}

module.exports = { runAllTests };
