#!/usr/bin/env node
/**
 * Performance Test Suite for Meta-Skill Coordinator
 * Tests: Context Size, Matching Speed, Load Time
 */

const fs = require('fs');
const path = require('path');
const { performance } = require('perf_hooks');

// Import meta-skill components
const MetaSkillCoordinator = require(path.join(process.cwd(), '.claude/skills/meta-skill/lib/coordinator'));
const SkillRegistry = require(path.join(process.cwd(), '.claude/skills/meta-skill/lib/skill-registry'));
const SemanticMatcher = require(path.join(process.cwd(), '.claude/skills/meta-skill/lib/semantic-matcher'));

class PerformanceTestSuite {
  constructor() {
    this.results = {
      contextSize: {},
      matchingSpeed: {},
      loadTime: {},
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Test 5.1: Context Size Measurement
   * Target: <15KB with active skill
   */
  async testContextSize() {
    console.log('\n🧪 Test 5.1: Context Size Measurement');
    console.log('Target: Baseline ≤10KB, With skill ≤15KB\n');

    const coordinator = new MetaSkillCoordinator();

    // Measure baseline (registry + meta-skill SKILL.md)
    const metaSkillPath = path.join(process.cwd(), '.claude/skills/meta-skill/SKILL.md');
    const metaSkillContent = fs.readFileSync(metaSkillPath, 'utf-8');
    const metaSkillSize = Buffer.byteLength(metaSkillContent, 'utf-8');

    console.log(`📏 Meta-skill SKILL.md: ${(metaSkillSize / 1024).toFixed(2)} KB`);

    // Initialize and measure registry size
    await coordinator.initialize();
    const registrySize = this.estimateRegistrySize(coordinator.registry);

    const baselineSize = metaSkillSize + registrySize;
    console.log(`📏 Skill Registry (${coordinator.registry.size()} skills): ${(registrySize / 1024).toFixed(2)} KB`);
    console.log(`📏 Baseline Total: ${(baselineSize / 1024).toFixed(2)} KB`);

    // Test with active skill loaded
    const promptImproverPath = path.join(process.cwd(), '.claude/skills/prompt-improver/SKILL.md');
    let activeSkillSize = 0;

    try {
      const activeSkillContent = fs.readFileSync(promptImproverPath, 'utf-8');
      activeSkillSize = Buffer.byteLength(activeSkillContent, 'utf-8');
      console.log(`📏 Active Skill (prompt-improver): ${(activeSkillSize / 1024).toFixed(2)} KB`);
    } catch (err) {
      console.log(`⚠️  Could not measure active skill: ${err.message}`);
    }

    const totalWithSkill = baselineSize + activeSkillSize;
    console.log(`📏 Total with Active Skill: ${(totalWithSkill / 1024).toFixed(2)} KB\n`);

    // Calculate naive approach (all skills loaded)
    const allSkills = coordinator.registry.getAll();
    const naiveSize = allSkills.reduce((sum, skill) => {
      try {
        const content = fs.readFileSync(skill.path, 'utf-8');
        return sum + Buffer.byteLength(content, 'utf-8');
      } catch {
        return sum;
      }
    }, 0);

    const reduction = ((naiveSize - totalWithSkill) / naiveSize * 100).toFixed(1);
    console.log(`📊 Naive approach (all ${allSkills.length} skills): ${(naiveSize / 1024).toFixed(2)} KB`);
    console.log(`✅ Context reduction: ${reduction}%\n`);

    // Evaluation
    const baselinePass = baselineSize / 1024 <= 10;
    const withSkillPass = totalWithSkill / 1024 <= 15;
    const reductionPass = parseFloat(reduction) >= 90;

    console.log('📋 Results:');
    console.log(`  ${baselinePass ? '✅' : '❌'} Baseline ≤ 10KB: ${(baselineSize / 1024).toFixed(2)} KB`);
    console.log(`  ${withSkillPass ? '✅' : '❌'} With skill ≤ 15KB: ${(totalWithSkill / 1024).toFixed(2)} KB`);
    console.log(`  ${reductionPass ? '✅' : '❌'} Reduction ≥ 90%: ${reduction}%`);

    this.results.contextSize = {
      baseline: baselineSize,
      withActiveSkill: totalWithSkill,
      naiveApproach: naiveSize,
      reduction: parseFloat(reduction),
      passed: baselinePass && withSkillPass && reductionPass
    };

    return baselinePass && withSkillPass && reductionPass;
  }

  /**
   * Test 5.2: Matching Speed
   * Target: <10ms for 100 skills
   */
  async testMatchingSpeed() {
    console.log('\n🧪 Test 5.2: Matching Speed');
    console.log('Target: <10ms for query matching\n');

    const coordinator = new MetaSkillCoordinator();
    await coordinator.initialize();

    const testQueries = [
      'optimize my prompts',
      'learn about claude flow',
      'review code quality',
      'coordinate multiple agents',
      'improve database performance',
      'help me build a REST API',
      'analyze bottlenecks in my system',
      'create automated tests'
    ];

    const timings = [];

    console.log('Running matching tests...');
    for (const query of testQueries) {
      const start = performance.now();
      const matches = coordinator.matcher.match(query);
      const duration = performance.now() - start;

      timings.push(duration);
      console.log(`  "${query}": ${duration.toFixed(2)}ms (${matches.length} matches)`);
    }

    const avgTime = timings.reduce((a, b) => a + b, 0) / timings.length;
    const maxTime = Math.max(...timings);
    const minTime = Math.min(...timings);

    console.log(`\n📊 Statistics:`);
    console.log(`  Average: ${avgTime.toFixed(2)}ms`);
    console.log(`  Min: ${minTime.toFixed(2)}ms`);
    console.log(`  Max: ${maxTime.toFixed(2)}ms`);

    const passed = avgTime < 10 && maxTime < 20;
    console.log(`\n📋 Result: ${passed ? '✅' : '❌'} ${passed ? 'PASSED' : 'FAILED'}`);
    console.log(`  ${avgTime < 10 ? '✅' : '❌'} Average < 10ms: ${avgTime.toFixed(2)}ms`);
    console.log(`  ${maxTime < 20 ? '✅' : '❌'} Max < 20ms: ${maxTime.toFixed(2)}ms`);

    this.results.matchingSpeed = {
      average: avgTime,
      min: minTime,
      max: maxTime,
      queries: testQueries.length,
      passed
    };

    return passed;
  }

  /**
   * Test 5.3: Skill Load Time
   * Target: <1000ms (1 second)
   */
  async testLoadTime() {
    console.log('\n🧪 Test 5.3: Skill Load Time');
    console.log('Target: <1000ms for skill loading\n');

    const coordinator = new MetaSkillCoordinator();
    await coordinator.initialize();

    const skillsToTest = ['prompt-improver', 'tutor-mode', 'meta-skill'];
    const timings = [];

    console.log('Testing skill load times...');
    for (const skillId of skillsToTest) {
      const skill = coordinator.registry.get(skillId);

      if (!skill) {
        console.log(`  ⚠️  Skill "${skillId}" not found, skipping`);
        continue;
      }

      const start = performance.now();
      try {
        await coordinator.loadSkill(skill);
        const duration = performance.now() - start;
        timings.push(duration);
        console.log(`  ${skillId}: ${duration.toFixed(2)}ms`);
      } catch (err) {
        console.log(`  ❌ Failed to load ${skillId}: ${err.message}`);
      }
    }

    if (timings.length === 0) {
      console.log('\n⚠️  No skills could be loaded for testing');
      this.results.loadTime = { passed: false, reason: 'No skills available' };
      return false;
    }

    const avgTime = timings.reduce((a, b) => a + b, 0) / timings.length;
    const maxTime = Math.max(...timings);

    console.log(`\n📊 Statistics:`);
    console.log(`  Average: ${avgTime.toFixed(2)}ms`);
    console.log(`  Max: ${maxTime.toFixed(2)}ms`);

    const passed = avgTime < 1000 && maxTime < 2000;
    console.log(`\n📋 Result: ${passed ? '✅' : '❌'} ${passed ? 'PASSED' : 'FAILED'}`);
    console.log(`  ${avgTime < 1000 ? '✅' : '❌'} Average < 1000ms: ${avgTime.toFixed(2)}ms`);
    console.log(`  ${maxTime < 2000 ? '✅' : '❌'} Max < 2000ms: ${maxTime.toFixed(2)}ms`);

    this.results.loadTime = {
      average: avgTime,
      max: maxTime,
      skillsTested: timings.length,
      passed
    };

    return passed;
  }

  /**
   * Estimate registry memory footprint
   */
  estimateRegistrySize(registry) {
    const allSkills = registry.getAll();
    let totalSize = 0;

    for (const skill of allSkills) {
      // Estimate metadata size (not full content)
      const metadata = JSON.stringify({
        id: skill.id,
        name: skill.name,
        description: skill.description,
        category: skill.category,
        tags: skill.tags,
        path: skill.path
      });
      totalSize += Buffer.byteLength(metadata, 'utf-8');
    }

    return totalSize;
  }

  /**
   * Run all performance tests
   */
  async runAll() {
    console.log('═══════════════════════════════════════════════════════');
    console.log('🚀 Meta-Skill Performance Test Suite');
    console.log('═══════════════════════════════════════════════════════');

    const results = [];

    try {
      results.push(await this.testContextSize());
      results.push(await this.testMatchingSpeed());
      results.push(await this.testLoadTime());
    } catch (err) {
      console.error('\n❌ Test suite failed:', err.message);
      console.error(err.stack);
      return false;
    }

    console.log('\n═══════════════════════════════════════════════════════');
    console.log('📊 Overall Performance Results');
    console.log('═══════════════════════════════════════════════════════');

    const passed = results.filter(r => r).length;
    const total = results.length;

    console.log(`Tests Passed: ${passed}/${total}`);
    console.log(`Success Rate: ${(passed / total * 100).toFixed(1)}%\n`);

    this.results.summary = {
      passed,
      total,
      successRate: passed / total * 100,
      allPassed: passed === total
    };

    return this.results;
  }

  /**
   * Save results to file
   */
  saveResults(outputPath) {
    const report = this.generateReport();
    fs.writeFileSync(outputPath, report, 'utf-8');
    console.log(`\n📄 Results saved to: ${outputPath}`);
  }

  /**
   * Generate markdown report
   */
  generateReport() {
    const { contextSize, matchingSpeed, loadTime, summary } = this.results;

    return `# Performance Test Results

**Date**: ${this.results.timestamp}
**Test Suite**: Meta-Skill Coordinator Performance
**Status**: ${summary.allPassed ? '✅ ALL PASSED' : '⚠️ SOME FAILED'}

---

## Test 5.1: Context Size Measurement

**Target**: Baseline ≤10KB, With skill ≤15KB, Reduction ≥90%

**Results**:
- Baseline: ${(contextSize.baseline / 1024).toFixed(2)} KB ${contextSize.baseline / 1024 <= 10 ? '✅' : '❌'}
- With Active Skill: ${(contextSize.withActiveSkill / 1024).toFixed(2)} KB ${contextSize.withActiveSkill / 1024 <= 15 ? '✅' : '❌'}
- Naive Approach: ${(contextSize.naiveApproach / 1024).toFixed(2)} KB
- Context Reduction: ${contextSize.reduction.toFixed(1)}% ${contextSize.reduction >= 90 ? '✅' : '❌'}

**Status**: ${contextSize.passed ? '✅ PASSED' : '❌ FAILED'}

---

## Test 5.2: Matching Speed

**Target**: <10ms average, <20ms max

**Results**:
- Average Time: ${matchingSpeed.average.toFixed(2)}ms ${matchingSpeed.average < 10 ? '✅' : '❌'}
- Min Time: ${matchingSpeed.min.toFixed(2)}ms
- Max Time: ${matchingSpeed.max.toFixed(2)}ms ${matchingSpeed.max < 20 ? '✅' : '❌'}
- Queries Tested: ${matchingSpeed.queries}

**Status**: ${matchingSpeed.passed ? '✅ PASSED' : '❌ FAILED'}

---

## Test 5.3: Skill Load Time

**Target**: <1000ms average, <2000ms max

**Results**:
- Average Time: ${loadTime.average.toFixed(2)}ms ${loadTime.average < 1000 ? '✅' : '❌'}
- Max Time: ${loadTime.max.toFixed(2)}ms ${loadTime.max < 2000 ? '✅' : '❌'}
- Skills Tested: ${loadTime.skillsTested}

**Status**: ${loadTime.passed ? '✅ PASSED' : '❌ FAILED'}

---

## Summary

**Overall**: ${summary.passed}/${summary.total} tests passed (${summary.successRate.toFixed(1)}%)

${summary.allPassed
  ? '✅ All performance targets met! Meta-skill is production-ready.'
  : '⚠️ Some performance targets not met. Review failed tests above.'}

---

## Performance Characteristics

- **Context Efficiency**: ${contextSize.reduction.toFixed(1)}% reduction vs naive approach
- **Matching Latency**: ${matchingSpeed.average.toFixed(2)}ms average
- **Load Latency**: ${loadTime.average.toFixed(2)}ms average
- **Memory Footprint**: ~${((contextSize.baseline + contextSize.withActiveSkill) / 2 / 1024).toFixed(2)} KB typical

**Conclusion**: Meta-skill provides lazy loading with minimal context overhead.
`;
  }
}

// Run if called directly
if (require.main === module) {
  const suite = new PerformanceTestSuite();
  suite.runAll().then(results => {
    const outputPath = path.join(
      process.cwd(),
      'sessions/session-20251118-164332-meta-skill-build/artifacts/docs/performance-test-results.md'
    );
    suite.saveResults(outputPath);
    process.exit(results.summary.allPassed ? 0 : 1);
  });
}

module.exports = PerformanceTestSuite;
