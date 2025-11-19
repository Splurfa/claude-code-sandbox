#!/usr/bin/env node

/**
 * Routing Test Suite - 5 Core Tests for Meta-Skill Coordinator
 * Tests: Menu Selection, NL Matching, Direct Invocation, Context Management, Intent Parsing
 */

const MetaSkillCoordinator = require('../code/meta-skill/lib/coordinator');
const SkillRegistry = require('../code/meta-skill/lib/skill-registry');
const SemanticMatcher = require('../code/meta-skill/lib/semantic-matcher');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');

// Test fixtures
const MOCK_SKILLS = [
  {
    id: 'prompt-improver',
    name: 'Prompt Improver',
    description: 'Optimize and enhance AI prompts for better results',
    category: 'Performance & Optimization',
    content: `---
name: Prompt Improver
description: Optimize and enhance AI prompts for better results
category: Performance & Optimization
version: 2.0.0
---

# Prompt Improver Skill

This skill helps optimize prompts.`
  },
  {
    id: 'tutor-mode',
    name: 'Tutor Mode',
    description: 'Adaptive learning guide with workspace documentation awareness',
    category: 'Learning & Development',
    content: `---
name: Tutor Mode
description: Adaptive learning guide with workspace documentation awareness
category: Learning & Development
version: 1.0.0
---

# Tutor Mode

This skill provides interactive tutorials.`
  },
  {
    id: 'github-code-review',
    name: 'GitHub Code Review',
    description: 'Comprehensive GitHub code review with AI-powered swarm coordination',
    category: 'GitHub Integration',
    content: `---
name: GitHub Code Review
description: Comprehensive GitHub code review with AI-powered swarm coordination
category: GitHub Integration
version: 1.0.0
---

# GitHub Code Review

This skill reviews GitHub code.`
  },
  {
    id: 'swarm-orchestration',
    name: 'Swarm Orchestration',
    description: 'Multi-agent workflows and coordination for complex tasks',
    category: 'Multi-Agent Coordination',
    content: `---
name: Swarm Orchestration
description: Multi-agent workflows and coordination for complex tasks
category: Multi-Agent Coordination
version: 1.0.0
---

# Swarm Orchestration

This skill coordinates multiple agents.`
  },
  {
    id: 'agentdb-optimization',
    name: 'AgentDB Optimization',
    description: 'Optimize AgentDB performance with quantization and HNSW indexing',
    category: 'Database & Memory',
    content: `---
name: AgentDB Optimization
description: Optimize AgentDB performance with quantization and HNSW indexing
category: Database & Memory
version: 1.0.0
---

# AgentDB Optimization

This skill optimizes database performance.`
  }
];

class RoutingTestRunner {
  constructor() {
    this.results = [];
    this.testDir = null;
    this.metrics = {
      matchingSpeed: [],
      contextSize: 0,
      accuracy: 0
    };
  }

  async setup() {
    // Create temporary skill directory
    this.testDir = path.join(os.tmpdir(), `meta-routing-test-${Date.now()}`);
    await fs.mkdir(this.testDir, { recursive: true });

    // Create mock skills
    for (const skill of MOCK_SKILLS) {
      const skillDir = path.join(this.testDir, skill.id);
      await fs.mkdir(skillDir, { recursive: true });
      await fs.writeFile(
        path.join(skillDir, 'SKILL.md'),
        skill.content
      );
    }

    console.log('🔧 Setup: Created test environment with 5 mock skills\n');
  }

  async cleanup() {
    if (this.testDir) {
      await fs.rm(this.testDir, { recursive: true, force: true });
    }
  }

  logResult(testNumber, testName, status, details) {
    const result = {
      test: `Test ${testNumber}: ${testName}`,
      status,
      details
    };
    this.results.push(result);

    const icon = status === 'PASS' ? '✅' : '❌';
    console.log(`${icon} Test ${testNumber}: ${testName} - ${status}`);
    if (details.metrics) {
      Object.entries(details.metrics).forEach(([key, value]) => {
        console.log(`   📊 ${key}: ${value}`);
      });
    }
    if (details.output) {
      console.log(`   💬 Output: ${details.output.substring(0, 100)}...`);
    }
    console.log('');
  }

  async test1_MenuSelection() {
    console.log('📋 Test 1: Menu Selection Test\n');

    const coordinator = new MetaSkillCoordinator();
    coordinator.registry = new SkillRegistry();
    await coordinator.registry.scanDirectory(this.testDir);
    coordinator.matcher = new SemanticMatcher(coordinator.registry);
    coordinator.initialized = true;

    const menu = coordinator.showMenu();

    const checks = {
      hasTitle: menu.includes('Available Skills'),
      hasSkills: menu.includes('prompt-improver') && menu.includes('tutor-mode'),
      hasCategories: menu.includes('Learning & Development'),
      hasInstructions: menu.includes('Type a number')
    };

    const allPassed = Object.values(checks).every(v => v);

    this.logResult(1, 'Menu Selection', allPassed ? 'PASS' : 'FAIL', {
      metrics: {
        'Skills Listed': coordinator.registry.size(),
        'Categories': coordinator.registry.getCategories().length,
        'Title Present': checks.hasTitle,
        'Instructions Clear': checks.hasInstructions
      },
      output: menu
    });

    return allPassed;
  }

  async test2_NaturalLanguageMatching() {
    console.log('📋 Test 2: Natural Language Matching Test\n');

    const coordinator = new MetaSkillCoordinator();
    coordinator.registry = new SkillRegistry();
    await coordinator.registry.scanDirectory(this.testDir);
    coordinator.matcher = new SemanticMatcher(coordinator.registry);
    coordinator.initialized = true;

    const testQueries = [
      { query: 'help me optimize my prompts', expected: 'prompt-improver' },
      { query: 'I want to learn about claude flow', expected: 'tutor-mode' },
      { query: 'review my code on github', expected: 'github-code-review' },
      { query: 'coordinate multiple agents', expected: 'swarm-orchestration' },
      { query: 'improve database performance', expected: 'agentdb-optimization' }
    ];

    let correctMatches = 0;
    const matchTimes = [];

    for (const { query, expected } of testQueries) {
      const start = performance.now();
      const matches = coordinator.matcher.match(query);
      const duration = performance.now() - start;

      matchTimes.push(duration);

      if (matches.length > 0 && matches[0].skill.id === expected) {
        correctMatches++;
      }
    }

    const accuracy = (correctMatches / testQueries.length) * 100;
    const avgMatchTime = matchTimes.reduce((a, b) => a + b, 0) / matchTimes.length;
    const maxMatchTime = Math.max(...matchTimes);

    this.metrics.matchingSpeed = matchTimes;
    this.metrics.accuracy = accuracy;

    const passed = accuracy >= 80 && avgMatchTime < 10;

    this.logResult(2, 'Natural Language Matching', passed ? 'PASS' : 'FAIL', {
      metrics: {
        'Accuracy': `${accuracy.toFixed(1)}%`,
        'Avg Match Time': `${avgMatchTime.toFixed(2)}ms`,
        'Max Match Time': `${maxMatchTime.toFixed(2)}ms`,
        'Correct Matches': `${correctMatches}/${testQueries.length}`
      }
    });

    return passed;
  }

  async test3_DirectInvocation() {
    console.log('📋 Test 3: Direct Invocation Test\n');

    const coordinator = new MetaSkillCoordinator();
    coordinator.registry = new SkillRegistry();
    await coordinator.registry.scanDirectory(this.testDir);
    coordinator.matcher = new SemanticMatcher(coordinator.registry);
    coordinator.initialized = true;

    const testCases = [
      { command: '/meta invoke prompt-improver', expectSuccess: true },
      { command: '/meta invoke nonexistent-skill', expectSuccess: false },
      { command: '/meta menu', expectSuccess: true },
      { command: '/meta search optimization', expectSuccess: true }
    ];

    let passedCases = 0;

    for (const { command, expectSuccess } of testCases) {
      try {
        const result = await coordinator.handle(command);
        const actualSuccess = !result.includes('not found') && !result.includes('Failed');

        if (actualSuccess === expectSuccess) {
          passedCases++;
        }
      } catch (err) {
        if (!expectSuccess) {
          passedCases++;
        }
      }
    }

    const passed = passedCases === testCases.length;

    this.logResult(3, 'Direct Invocation', passed ? 'PASS' : 'FAIL', {
      metrics: {
        'Test Cases Passed': `${passedCases}/${testCases.length}`,
        'Success Rate': `${(passedCases / testCases.length * 100).toFixed(1)}%`
      }
    });

    return passed;
  }

  async test4_ContextManagement() {
    console.log('📋 Test 4: Context Management Test\n');

    const coordinator = new MetaSkillCoordinator();
    coordinator.registry = new SkillRegistry();
    await coordinator.registry.scanDirectory(this.testDir);
    coordinator.matcher = new SemanticMatcher(coordinator.registry);
    coordinator.initialized = true;

    // Measure baseline context
    const baselineSize = JSON.stringify({
      registry: coordinator.registry.size(),
      categories: coordinator.registry.getCategories()
    }).length;

    // Load a skill
    const skill = coordinator.registry.get('prompt-improver');
    const skillContent = await coordinator.loadSkill(skill);
    const skillSize = skillContent.length;

    // Total context estimation
    const totalContext = baselineSize + skillSize;
    const contextKB = (totalContext / 1024).toFixed(2);

    this.metrics.contextSize = totalContext;

    const passed = totalContext < 15 * 1024; // <15KB

    this.logResult(4, 'Context Management', passed ? 'PASS' : 'FAIL', {
      metrics: {
        'Baseline Size': `${(baselineSize / 1024).toFixed(2)}KB`,
        'Skill Size': `${(skillSize / 1024).toFixed(2)}KB`,
        'Total Context': `${contextKB}KB`,
        'Threshold': '15KB',
        'Under Limit': passed
      }
    });

    return passed;
  }

  async test5_IntentParsing() {
    console.log('📋 Test 5: Intent Parsing Test\n');

    const coordinator = new MetaSkillCoordinator();
    coordinator.registry = new SkillRegistry();
    await coordinator.registry.scanDirectory(this.testDir);
    coordinator.matcher = new SemanticMatcher(coordinator.registry);
    coordinator.initialized = true;

    const intentTests = [
      { query: 'help me learn about swarms', expected: 'learn' },
      { query: 'build a review system', expected: 'build' },
      { query: 'optimize my database queries', expected: 'optimize' },
      { query: 'review this code', expected: 'review' },
      { query: 'coordinate multiple agents', expected: 'coordinate' }
    ];

    let correctIntents = 0;

    for (const { query, expected } of intentTests) {
      const intent = coordinator.matcher.parseIntent(query);
      if (intent === expected) {
        correctIntents++;
      }
    }

    const accuracy = (correctIntents / intentTests.length) * 100;
    const passed = accuracy >= 80;

    this.logResult(5, 'Intent Parsing', passed ? 'PASS' : 'FAIL', {
      metrics: {
        'Accuracy': `${accuracy.toFixed(1)}%`,
        'Correct Intents': `${correctIntents}/${intentTests.length}`,
        'Test Queries': intentTests.length
      }
    });

    return passed;
  }

  generateReport() {
    console.log('\n' + '═'.repeat(70));
    console.log('📊 ROUTING TEST SUITE SUMMARY');
    console.log('═'.repeat(70));
    console.log('');

    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;

    this.results.forEach(result => {
      const icon = result.status === 'PASS' ? '✅' : '❌';
      console.log(`${icon} ${result.test}: ${result.status}`);
    });

    console.log('');
    console.log('─'.repeat(70));
    console.log(`Tests Passed: ${passed}/5`);
    console.log(`Tests Failed: ${failed}/5`);
    console.log('');

    console.log('🎯 SUCCESS CRITERIA:');
    console.log(`  ✓ All 5 tests pass: ${passed === 5 ? 'YES ✅' : 'NO ❌'}`);
    console.log(`  ✓ Semantic matching >80% accuracy: ${this.metrics.accuracy >= 80 ? `YES (${this.metrics.accuracy.toFixed(1)}%) ✅` : `NO (${this.metrics.accuracy.toFixed(1)}%) ❌`}`);
    console.log(`  ✓ Context size <15KB: ${this.metrics.contextSize < 15 * 1024 ? `YES (${(this.metrics.contextSize / 1024).toFixed(2)}KB) ✅` : `NO (${(this.metrics.contextSize / 1024).toFixed(2)}KB) ❌`}`);

    const avgMatchSpeed = this.metrics.matchingSpeed.length > 0
      ? this.metrics.matchingSpeed.reduce((a, b) => a + b, 0) / this.metrics.matchingSpeed.length
      : 0;
    console.log(`  ✓ Matching speed <10ms: ${avgMatchSpeed < 10 ? `YES (${avgMatchSpeed.toFixed(2)}ms) ✅` : `NO (${avgMatchSpeed.toFixed(2)}ms) ❌`}`);

    console.log('');
    console.log('═'.repeat(70));
    console.log(`Overall Result: ${passed === 5 ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
    console.log('═'.repeat(70));
    console.log('');

    return passed === 5;
  }
}

async function runRoutingTests() {
  const runner = new RoutingTestRunner();

  try {
    await runner.setup();

    await runner.test1_MenuSelection();
    await runner.test2_NaturalLanguageMatching();
    await runner.test3_DirectInvocation();
    await runner.test4_ContextManagement();
    await runner.test5_IntentParsing();

    return runner.generateReport();
  } finally {
    await runner.cleanup();
  }
}

// Run tests
runRoutingTests()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    console.error('💥 Routing test suite failed:', err);
    process.exit(1);
  });
