#!/usr/bin/env node
/**
 * Episode Recording System Tests
 *
 * Validates:
 * - Episode recording to AgentDB
 * - Trajectory tracking accuracy
 * - Verdict judgment scoring
 * - Hook integration
 * - Memory coordination
 *
 * Stock-First: Uses stock testing patterns, no custom frameworks
 */

const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

// Test utilities
class TestRunner {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
  }

  test(name, fn) {
    this.tests.push({ name, fn });
  }

  async run() {
    console.log('🧪 Running Episode Recording System Tests\n');

    for (const test of this.tests) {
      try {
        await test.fn();
        this.passed++;
        console.log(`✅ ${test.name}`);
      } catch (error) {
        this.failed++;
        console.log(`❌ ${test.name}`);
        console.log(`   Error: ${error.message}`);
      }
    }

    console.log(`\n📊 Results: ${this.passed} passed, ${this.failed} failed (${this.tests.length} total)`);
    return this.failed === 0;
  }
}

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
};

// Test setup
const projectRoot = path.join(__dirname, '../../../..');
const sessionRoot = path.join(__dirname, '../..');
const codeDir = path.join(sessionRoot, 'artifacts/code/episodes');

// Import modules
const EpisodeRecorder = require(path.join(codeDir, 'episode-recorder.js'));
const TrajectoryTracker = require(path.join(codeDir, 'trajectory-tracker.js'));
const VerdictJudge = require(path.join(codeDir, 'verdict-judge.js'));

// Test runner
const runner = new TestRunner();

// Test 1: Episode Recorder Initialization
runner.test('Episode Recorder - Initialization', async () => {
  const recorder = new EpisodeRecorder({
    projectRoot: projectRoot,
    sessionId: 'test-session-init',
    agentType: 'test-agent'
  });

  assert(recorder.agentdb, 'AgentDB wrapper should be initialized');
  assert(recorder.trajectoryTracker, 'Trajectory tracker should be initialized');
  assert(recorder.verdictJudge, 'Verdict judge should be initialized');
  assert(recorder.currentSession === 'test-session-init', 'Session ID should match');
});

// Test 2: Episode Recording
runner.test('Episode Recorder - Record Episode', async () => {
  const recorder = new EpisodeRecorder({
    projectRoot: projectRoot,
    sessionId: 'test-session-record',
    agentType: 'test-agent'
  });

  const episode = {
    observation: 'Task: Implement user authentication',
    thought: 'Need JWT tokens and bcrypt for password hashing',
    action: 'Created auth.js with secure authentication',
    reward: 0.85,
    metadata: {
      files_created: ['auth.js', 'auth.test.js'],
      test_coverage: 0.92
    }
  };

  const result = await recorder.recordEpisode(episode);
  assert(result.success, 'Episode recording should succeed');
  assert(result.episode, 'Result should include enriched episode');
  assert(result.episode.metadata.session_id === 'test-session-record', 'Session metadata should be added');

  await recorder.close();
});

// Test 3: Trajectory Tracking - Add Steps
runner.test('Trajectory Tracker - Add Steps', async () => {
  const tracker = new TrajectoryTracker({
    projectRoot: projectRoot,
    trajectoryId: 'test-trajectory-steps'
  });

  const step1 = await tracker.addStep({
    state: 'Initial task state',
    action: 'Analyzed requirements',
    reward: 0.7,
    nextState: 'Requirements analyzed'
  });

  assert(step1.success, 'Step 1 should be added successfully');
  assert(step1.step_number === 0, 'First step should be number 0');

  const step2 = await tracker.addStep({
    state: 'Requirements analyzed',
    action: 'Implemented solution',
    reward: 0.9,
    nextState: 'Solution implemented'
  });

  assert(step2.success, 'Step 2 should be added successfully');
  assert(step2.step_number === 1, 'Second step should be number 1');

  const current = await tracker.getCurrentTrajectory();
  assert(current.steps.length === 2, 'Should have 2 steps');
  assert(current.current_reward === 1.6, 'Total reward should be 1.6');
});

// Test 4: Trajectory Tracking - Complete Trajectory
runner.test('Trajectory Tracker - Complete Trajectory', async () => {
  const tracker = new TrajectoryTracker({
    projectRoot: projectRoot,
    trajectoryId: 'test-trajectory-complete'
  });

  await tracker.addStep({
    state: 'Start',
    action: 'Action 1',
    reward: 0.8
  });

  await tracker.addStep({
    state: 'Step 1',
    action: 'Action 2',
    reward: 0.9
  });

  const result = await tracker.completeTrajectory({
    sessionId: 'test-session',
    agentType: 'coder'
  });

  assert(result.success, 'Trajectory completion should succeed');
  assert(Math.abs(result.total_reward - 1.7) < 0.01, `Total reward should be ~1.7, got ${result.total_reward}`);
  assert(result.step_count === 2, 'Should have 2 steps');
});

// Test 5: Verdict Judge - Success Case
runner.test('Verdict Judge - Success Case', async () => {
  const judge = new VerdictJudge({
    projectRoot: projectRoot
  });

  const outcome = {
    task: 'Implement authentication',
    status: 'completed',
    trajectory: {
      steps: [{ reward: 0.8 }, { reward: 0.9 }],
      current_reward: 1.7
    },
    context: {
      test_coverage: 0.95,
      lint_passed: true,
      documented: true,
      no_hardcoded_secrets: true
    }
  };

  const verdict = await judge.judge(outcome);
  assert(verdict.score > 0.7, 'Success case should score above 0.7');
  assert(verdict.verdict === 'success', 'Verdict should be success');
  assert(verdict.scores.completion > 0.8, 'Completion score should be high');
  assert(verdict.scores.quality > 0.7, 'Quality score should be high');
});

// Test 6: Verdict Judge - Failure Case
runner.test('Verdict Judge - Failure Case', async () => {
  const judge = new VerdictJudge({
    projectRoot: projectRoot
  });

  const outcome = {
    task: 'Fix critical bug',
    status: 'failed',
    context: {
      errors: ['TypeError: undefined'],
      lint_errors: true,
      security_issues: true
    }
  };

  const verdict = await judge.judge(outcome);
  assert(verdict.score < 0.5, 'Failure case should score below 0.5');
  assert(verdict.verdict === 'failure' || verdict.verdict === 'critical_failure', 'Verdict should indicate failure');
  assert(verdict.learnings.length > 0, 'Should have learning signals');
});

// Test 7: Verdict Judge - Partial Success
runner.test('Verdict Judge - Partial Success', async () => {
  const judge = new VerdictJudge({
    projectRoot: projectRoot
  });

  const outcome = {
    task: 'Implement feature',
    status: 'partial',
    context: {
      test_coverage: 0.6,
      lint_passed: true
    }
  };

  const verdict = await judge.judge(outcome);
  assert(verdict.score >= 0.5 && verdict.score < 0.7, 'Partial case should score between 0.5 and 0.7');
  assert(verdict.verdict === 'partial', 'Verdict should be partial');
});

// Test 8: Episode from Task Data
runner.test('Episode Recorder - Record from Task', async () => {
  const recorder = new EpisodeRecorder({
    projectRoot: projectRoot,
    sessionId: 'test-session-task',
    agentType: 'test-agent'
  });

  // Create a trajectory first
  await recorder.trajectoryTracker.addStep({
    state: 'Task assigned',
    action: 'Analyzed requirements',
    reward: 0.7
  });

  await recorder.trajectoryTracker.addStep({
    state: 'Requirements analyzed',
    action: 'Implemented feature',
    reward: 0.9
  });

  const taskData = {
    taskId: 'task-123',
    description: 'Build REST API',
    status: 'completed',
    context: {
      test_coverage: 0.88,
      lint_passed: true
    }
  };

  const result = await recorder.recordFromTask(taskData);
  assert(result.success, 'Recording from task should succeed');
  assert(result.episode.reward > 0, 'Episode should have calculated reward');
  assert(result.episode.metadata.task_id === 'task-123', 'Task ID should be in metadata');

  await recorder.close();
});

// Test 9: Trajectory Pattern Analysis
runner.test('Trajectory Tracker - Pattern Analysis', async () => {
  const tracker = new TrajectoryTracker({
    projectRoot: projectRoot,
    trajectoryId: 'test-pattern-1'
  });

  // Create a successful pattern
  await tracker.addStep({
    state: 'Start: Create authentication',
    action: 'Created auth.js file',
    reward: 0.8,
    nextState: 'Success: File created'
  });

  await tracker.addStep({
    state: 'Success: File created',
    action: 'Added JWT support',
    reward: 0.9,
    nextState: 'Success: Feature complete'
  });

  await tracker.completeTrajectory({
    sessionId: 'test-session',
    agentType: 'coder'
  });

  const patterns = await tracker.analyzePatterns({
    minReward: 0.7,
    limit: 10,
    topN: 5
  });

  // Pattern analysis may return empty if no sufficient data
  assert(Array.isArray(patterns), 'Pattern analysis should return array');
});

// Test 10: Learning Insights
runner.test('Episode Recorder - Learning Insights', async () => {
  const recorder = new EpisodeRecorder({
    projectRoot: projectRoot,
    sessionId: 'test-session-insights',
    agentType: 'test-agent'
  });

  const insights = await recorder.getLearningInsights({
    minReward: 0.7
  });

  assert(insights.success_patterns, 'Should have success patterns');
  assert(insights.failure_patterns, 'Should have failure patterns');
  assert(insights.insights, 'Should have insights array');

  await recorder.close();
});

// Test 11: Statistics
runner.test('Episode System - Statistics', async () => {
  const recorder = new EpisodeRecorder({
    projectRoot: projectRoot,
    sessionId: 'test-session-stats',
    agentType: 'test-agent'
  });

  const stats = await recorder.getStats();
  assert(stats.agentdb, 'Should have AgentDB stats');
  assert(stats.trajectory, 'Should have trajectory stats');
  assert(stats.session, 'Should have session info');
  assert(stats.session.id === 'test-session-stats', 'Session ID should match');

  await recorder.close();
});

// Test 12: Hook Integration (if AgentDB available)
runner.test('Hook Integration - Post-Task Episode', async () => {
  const hookPath = path.join(projectRoot, '.swarm/hooks/post-task-episode.sh');
  const agentdbPath = path.join(projectRoot, '.agentdb/reasoningbank.db');

  if (!fs.existsSync(agentdbPath)) {
    console.log('   ⚠️ AgentDB not initialized, skipping hook test');
    return;
  }

  assert(fs.existsSync(hookPath), 'Hook script should exist');

  const stats = fs.statSync(hookPath);
  assert(stats.mode & 0o111, 'Hook script should be executable');
});

// Run all tests
(async () => {
  const success = await runner.run();
  process.exit(success ? 0 : 1);
})();
