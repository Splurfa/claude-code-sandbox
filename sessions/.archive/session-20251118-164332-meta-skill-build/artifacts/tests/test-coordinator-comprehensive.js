#!/usr/bin/env node

/**
 * Comprehensive Test Suite for Meta-Skill Coordinator
 * Tests all functionality with mock skills
 */

const MetaSkillCoordinator = require('/Users/splurfa/common-thread-sandbox/.claude/skills/meta-skill/lib/coordinator');
const SkillRegistry = require('/Users/splurfa/common-thread-sandbox/.claude/skills/meta-skill/lib/skill-registry');
const SemanticMatcher = require('/Users/splurfa/common-thread-sandbox/.claude/skills/meta-skill/lib/semantic-matcher');
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

class TestRunner {
  constructor() {
    this.passed = 0;
    this.failed = 0;
    this.testDir = null;
  }

  async setup() {
    // Create temporary skill directory
    this.testDir = path.join(os.tmpdir(), `meta-skill-test-${Date.now()}`);
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

    console.log(`📁 Created test directory: ${this.testDir}\n`);
  }

  async cleanup() {
    // Remove test directory
    if (this.testDir) {
      await fs.rm(this.testDir, { recursive: true, force: true });
    }
  }

  assert(condition, message) {
    if (condition) {
      console.log(`  ✅ ${message}`);
      this.passed++;
    } else {
      console.log(`  ❌ ${message}`);
      this.failed++;
      throw new Error(`Assertion failed: ${message}`);
    }
  }

  assertEqual(actual, expected, message) {
    this.assert(actual === expected, `${message} (expected: ${expected}, got: ${actual})`);
  }

  assertGreaterThan(actual, min, message) {
    this.assert(actual > min, `${message} (expected > ${min}, got: ${actual})`);
  }

  assertContains(haystack, needle, message) {
    this.assert(haystack.includes(needle), `${message} (expected to contain: ${needle})`);
  }

  async runTest(name, fn) {
    console.log(`\n📋 Test: ${name}`);
    try {
      await fn();
      console.log(`  ✨ Test passed`);
    } catch (err) {
      console.log(`  💥 Test failed: ${err.message}`);
      this.failed++;
    }
  }

  summary() {
    console.log('\n' + '='.repeat(60));
    console.log(`📊 Test Summary: ${this.passed} passed, ${this.failed} failed`);
    console.log('='.repeat(60) + '\n');
    return this.failed === 0;
  }
}

async function runTests() {
  const runner = new TestRunner();

  try {
    await runner.setup();

    // Test 1: Skill Registry - Load Metadata
    await runner.runTest('Skill Registry - Load Metadata', async () => {
      const registry = new SkillRegistry();

      // Scan test directory
      await registry.scanDirectory(runner.testDir);

      runner.assertEqual(registry.size(), 4, 'Should load 4 skills');

      const skill = registry.get('prompt-improver');
      runner.assert(skill !== undefined, 'Should find prompt-improver');
      runner.assertEqual(skill.name, 'Prompt Improver', 'Should extract name');
      runner.assertEqual(skill.category, 'Performance & Optimization', 'Should extract category');
      runner.assertGreaterThan(skill.tags.length, 0, 'Should extract tags');
    });

    // Test 2: Skill Registry - Category Grouping
    await runner.runTest('Skill Registry - Category Grouping', async () => {
      const registry = new SkillRegistry();
      await registry.scanDirectory(runner.testDir);

      const categories = registry.getCategories();
      runner.assertGreaterThan(categories.length, 0, 'Should have categories');

      const perfSkills = registry.getByCategory('Performance & Optimization');
      runner.assertEqual(perfSkills.length, 1, 'Should have 1 optimization skill');
      runner.assertEqual(perfSkills[0].id, 'prompt-improver', 'Should be prompt-improver');
    });

    // Test 3: Skill Registry - Keyword Extraction
    await runner.runTest('Skill Registry - Keyword Extraction', async () => {
      const registry = new SkillRegistry();
      await registry.scanDirectory(runner.testDir);

      const skill = registry.get('github-code-review');
      runner.assert(skill.tags.includes('github'), 'Should extract "github" keyword');
      runner.assert(skill.tags.includes('code'), 'Should extract "code" keyword');
      runner.assert(skill.tags.includes('review'), 'Should extract "review" keyword');
      runner.assert(!skill.tags.includes('the'), 'Should filter stop words');
    });

    // Test 4: Semantic Matcher - Exact Match
    await runner.runTest('Semantic Matcher - Exact Match', async () => {
      const registry = new SkillRegistry();
      await registry.scanDirectory(runner.testDir);
      const matcher = new SemanticMatcher(registry);

      const matches = matcher.match('prompt optimization');
      runner.assertGreaterThan(matches.length, 0, 'Should find matches');
      runner.assertEqual(matches[0].skill.id, 'prompt-improver', 'Should match prompt-improver');
      runner.assertGreaterThan(matches[0].score, 0.4, 'Should have high confidence');
    });

    // Test 5: Semantic Matcher - Fuzzy Match
    await runner.runTest('Semantic Matcher - Fuzzy Match', async () => {
      const registry = new SkillRegistry();
      await registry.scanDirectory(runner.testDir);
      const matcher = new SemanticMatcher(registry);

      const matches = matcher.match('optimize promts'); // Typo: "promts"
      runner.assertGreaterThan(matches.length, 0, 'Should find matches with typo');

      // Should still match prompt-improver despite typo
      const hasPromptImprover = matches.some(m => m.skill.id === 'prompt-improver');
      runner.assert(hasPromptImprover, 'Should fuzzy match despite typo');
    });

    // Test 6: Semantic Matcher - Intent Parsing
    await runner.runTest('Semantic Matcher - Intent Parsing', async () => {
      const registry = new SkillRegistry();
      await registry.scanDirectory(runner.testDir);
      const matcher = new SemanticMatcher(registry);

      runner.assertEqual(matcher.parseIntent('help me learn'), 'learn', 'Should detect learn intent');
      runner.assertEqual(matcher.parseIntent('optimize my code'), 'optimize', 'Should detect optimize intent');
      runner.assertEqual(matcher.parseIntent('review this PR'), 'review', 'Should detect review intent');
    });

    // Test 7: Coordinator - Menu Generation
    await runner.runTest('Coordinator - Menu Generation', async () => {
      const coordinator = new MetaSkillCoordinator();
      coordinator.registry = new SkillRegistry();
      await coordinator.registry.scanDirectory(runner.testDir);
      coordinator.matcher = new SemanticMatcher(coordinator.registry);
      coordinator.initialized = true;

      const menu = coordinator.showMenu();
      runner.assertContains(menu, 'Available Skills', 'Should show title');
      runner.assertContains(menu, 'prompt-improver', 'Should list prompt-improver');
      runner.assertContains(menu, 'tutor-mode', 'Should list tutor-mode');
      runner.assertContains(menu, 'Performance & Optimization', 'Should show category');
    });

    // Test 8: Coordinator - Natural Language Routing
    await runner.runTest('Coordinator - Natural Language Routing', async () => {
      const coordinator = new MetaSkillCoordinator();
      coordinator.registry = new SkillRegistry();
      await coordinator.registry.scanDirectory(runner.testDir);
      coordinator.matcher = new SemanticMatcher(coordinator.registry);
      coordinator.initialized = true;

      const result = await coordinator.handle('help me optimize my prompts');
      runner.assertContains(result, 'prompt-improver', 'Should route to prompt-improver');
    });

    // Test 9: Coordinator - Search Command
    await runner.runTest('Coordinator - Search Command', async () => {
      const coordinator = new MetaSkillCoordinator();
      coordinator.registry = new SkillRegistry();
      await coordinator.registry.scanDirectory(runner.testDir);
      coordinator.matcher = new SemanticMatcher(coordinator.registry);
      coordinator.initialized = true;

      const result = coordinator.searchSkills('github');
      runner.assertContains(result, 'github-code-review', 'Should find github skill');
      runner.assertContains(result, 'match', 'Should show match percentage');
    });

    // Test 10: Coordinator - Skill Invocation
    await runner.runTest('Coordinator - Skill Invocation', async () => {
      const coordinator = new MetaSkillCoordinator();
      coordinator.registry = new SkillRegistry();
      await coordinator.registry.scanDirectory(runner.testDir);
      coordinator.matcher = new SemanticMatcher(coordinator.registry);
      coordinator.initialized = true;

      const result = await coordinator.invokeSkill('tutor-mode');
      runner.assertContains(result, 'Loaded: Tutor Mode', 'Should load skill');
      runner.assertContains(result, 'Tutor Mode', 'Should contain skill content');
    });

    // Test 11: Coordinator - Invalid Skill with Suggestions
    await runner.runTest('Coordinator - Invalid Skill with Suggestions', async () => {
      const coordinator = new MetaSkillCoordinator();
      coordinator.registry = new SkillRegistry();
      await coordinator.registry.scanDirectory(runner.testDir);
      coordinator.matcher = new SemanticMatcher(coordinator.registry);
      coordinator.initialized = true;

      const result = await coordinator.invokeSkill('prompt-optimizer'); // Similar to prompt-improver
      runner.assertContains(result, 'not found', 'Should indicate not found');
      runner.assertContains(result, 'Did you mean', 'Should provide suggestions');
      runner.assertContains(result, 'prompt-improver', 'Should suggest similar skill');
    });

    // Test 12: Coordinator - No Match Handling
    await runner.runTest('Coordinator - No Match Handling', async () => {
      const coordinator = new MetaSkillCoordinator();
      coordinator.registry = new SkillRegistry();
      await coordinator.registry.scanDirectory(runner.testDir);
      coordinator.matcher = new SemanticMatcher(coordinator.registry);
      coordinator.initialized = true;

      const result = coordinator.handleNoMatch('completely random query xyz');
      runner.assertContains(result, 'No matching skills', 'Should indicate no match');
      runner.assertContains(result, '/meta menu', 'Should suggest browsing');
    });

    // Test 13: Error Handling - Missing Skill File
    await runner.runTest('Error Handling - Missing Skill File', async () => {
      const coordinator = new MetaSkillCoordinator();
      coordinator.registry = new SkillRegistry();
      await coordinator.registry.scanDirectory(runner.testDir);
      coordinator.matcher = new SemanticMatcher(coordinator.registry);
      coordinator.initialized = true;

      // Manually break the path
      const skill = coordinator.registry.get('prompt-improver');
      skill.path = '/nonexistent/path/SKILL.md';

      const result = await coordinator.loadSkill(skill);
      runner.assertContains(result, 'Failed to load', 'Should handle missing file');
    });

    // Test 14: Levenshtein Distance Calculation
    await runner.runTest('Levenshtein Distance Calculation', async () => {
      const registry = new SkillRegistry();
      await registry.scanDirectory(runner.testDir);
      const matcher = new SemanticMatcher(registry);

      runner.assertEqual(matcher.levenshteinDistance('abc', 'abc'), 0, 'Same strings = 0 distance');
      runner.assertEqual(matcher.levenshteinDistance('abc', 'abd'), 1, 'One substitution = 1');
      runner.assertEqual(matcher.levenshteinDistance('abc', 'abcd'), 1, 'One insertion = 1');

      const ratio = matcher.levenshteinRatio('optimize', 'optimise');
      runner.assertGreaterThan(ratio, 0.8, 'Similar words should have high ratio');
    });

    // Test 15: Category Inference
    await runner.runTest('Category Inference', async () => {
      const registry = new SkillRegistry();

      runner.assertEqual(
        registry.inferCategory('Learning Guide', 'Tutorial for beginners'),
        'Learning & Development',
        'Should infer learning category'
      );

      runner.assertEqual(
        registry.inferCategory('Code Review Tool', 'Review code quality'),
        'Code Quality & Review',
        'Should infer review category'
      );

      runner.assertEqual(
        registry.inferCategory('Swarm Coordinator', 'Multi-agent orchestration'),
        'Multi-Agent Coordination',
        'Should infer coordination category'
      );
    });

  } finally {
    await runner.cleanup();
  }

  return runner.summary();
}

// Run tests
runTests()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    console.error('💥 Test suite failed:', err);
    process.exit(1);
  });
