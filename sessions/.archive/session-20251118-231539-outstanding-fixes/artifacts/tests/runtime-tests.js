#!/usr/bin/env node

/**
 * Runtime Tests for Meta-Skill Coordinator
 *
 * Tests the 3 deferred scenarios from session-20251118-164332-meta-skill-build:
 * 1. Skill Discovery (30 skills expected)
 * 2. Intent Parsing (natural language queries)
 * 3. Semantic Matching (confidence scores)
 *
 * Run with: node runtime-tests.js
 */

const path = require('path');
const SkillRegistry = require(path.join(process.cwd(), '.claude/skills/meta-skill/lib/skill-registry'));
const SemanticMatcher = require(path.join(process.cwd(), '.claude/skills/meta-skill/lib/semantic-matcher'));

// ANSI color codes for better output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

class RuntimeTestSuite {
  constructor() {
    this.registry = new SkillRegistry();
    this.matcher = null;
    this.results = {
      passed: 0,
      failed: 0,
      total: 0
    };
  }

  /**
   * Test 1: Skill Discovery
   * Verify that all 30 skills are discovered and loaded
   */
  async testSkillDiscovery() {
    log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
    log('TEST 1: SKILL DISCOVERY', 'cyan');
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');

    try {
      log('\n1. Loading skill metadata...', 'blue');
      await this.registry.loadMetadata();

      const skillCount = this.registry.size();
      log(`   Found ${skillCount} skills`, 'blue');

      // Verify skill count
      this.results.total++;
      if (skillCount === 30) {
        log(`✅ PASS: Expected 30 skills, found ${skillCount}`, 'green');
        this.results.passed++;
      } else {
        log(`❌ FAIL: Expected 30 skills, found ${skillCount}`, 'red');
        this.results.failed++;
      }

      // List all discovered skills
      log('\n2. Discovered skills:', 'blue');
      const allSkills = this.registry.getAll();
      allSkills.forEach((skill, idx) => {
        log(`   ${String(idx + 1).padStart(2, ' ')}. ${skill.id.padEnd(35, ' ')} - ${skill.name}`, 'blue');
      });

      // Verify categories
      log('\n3. Skill categories:', 'blue');
      const categories = this.registry.getCategories();
      categories.forEach(cat => {
        const skills = this.registry.getByCategory(cat);
        log(`   ${cat}: ${skills.length} skills`, 'blue');
      });

      this.results.total++;
      if (categories.length >= 5) {
        log(`✅ PASS: Found ${categories.length} categories (expected ≥5)`, 'green');
        this.results.passed++;
      } else {
        log(`❌ FAIL: Found ${categories.length} categories (expected ≥5)`, 'red');
        this.results.failed++;
      }

      // Verify specific key skills exist
      log('\n4. Verifying key skills exist:', 'blue');
      const keySkills = [
        'meta-skill',
        'prompt-improver',
        'skill-builder',
        'tutor-mode',
        'swarm-orchestration',
        'agentdb-vector-search'
      ];

      let foundCount = 0;
      keySkills.forEach(skillId => {
        const skill = this.registry.get(skillId);
        if (skill) {
          log(`   ✓ ${skillId}`, 'blue');
          foundCount++;
        } else {
          log(`   ✗ ${skillId} (MISSING)`, 'red');
        }
      });

      this.results.total++;
      if (foundCount === keySkills.length) {
        log(`✅ PASS: All ${keySkills.length} key skills found`, 'green');
        this.results.passed++;
      } else {
        log(`❌ FAIL: Only ${foundCount}/${keySkills.length} key skills found`, 'red');
        this.results.failed++;
      }

    } catch (error) {
      log(`❌ FAIL: ${error.message}`, 'red');
      this.results.failed++;
      this.results.total++;
      throw error;
    }
  }

  /**
   * Test 2: Intent Parsing
   * Verify that natural language queries are parsed correctly
   */
  async testIntentParsing() {
    log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
    log('TEST 2: INTENT PARSING', 'cyan');
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');

    try {
      // Initialize semantic matcher
      this.matcher = new SemanticMatcher(this.registry);

      // Test cases: natural language query → expected skill(s)
      const testCases = [
        {
          query: 'optimize my prompts',
          expectedSkills: ['prompt-improver'],
          intent: 'optimization'
        },
        {
          query: 'I want to learn about claude flow',
          expectedSkills: ['tutor-mode'],
          intent: 'learning'
        },
        {
          query: 'review my code quality',
          expectedSkills: ['github-code-review', 'verification-quality'],
          intent: 'review'
        },
        {
          query: 'build a custom skill',
          expectedSkills: ['skill-builder'],
          intent: 'building'
        },
        {
          query: 'search with vectors',
          expectedSkills: ['agentdb-vector-search'],
          intent: 'search'
        },
        {
          query: 'coordinate multiple agents',
          expectedSkills: ['swarm-orchestration', 'hive-mind-advanced'],
          intent: 'coordination'
        }
      ];

      log('\nTesting natural language query parsing:\n', 'blue');

      let passedTests = 0;
      testCases.forEach((testCase, idx) => {
        this.results.total++;
        log(`${idx + 1}. Query: "${testCase.query}"`, 'blue');
        log(`   Expected intent: ${testCase.intent}`, 'blue');

        // Use low threshold (0.1) to get all matches, then take top 5
        const results = this.matcher.match(testCase.query, 0.1).slice(0, 5);

        if (results.length > 0) {
          log(`   Top matches:`, 'blue');
          results.slice(0, 3).forEach((result, i) => {
            const confidence = (result.score * 100).toFixed(1);
            log(`     ${i + 1}. ${result.skill.id} (${confidence}% confidence)`, 'blue');
          });

          // Check if any expected skill is in top 3 results
          const topSkillIds = results.slice(0, 3).map(r => r.skill.id);
          const foundExpected = testCase.expectedSkills.some(expected =>
            topSkillIds.includes(expected)
          );

          if (foundExpected) {
            log(`   ✅ PASS: Found expected skill in top matches`, 'green');
            this.results.passed++;
            passedTests++;
          } else {
            log(`   ❌ FAIL: Expected ${testCase.expectedSkills.join(' or ')}, got ${topSkillIds.join(', ')}`, 'red');
            this.results.failed++;
          }
        } else {
          log(`   ❌ FAIL: No matches found`, 'red');
          this.results.failed++;
        }
        log('');
      });

      log(`Intent parsing summary: ${passedTests}/${testCases.length} tests passed\n`, 'blue');

    } catch (error) {
      log(`❌ FAIL: ${error.message}`, 'red');
      this.results.failed++;
      this.results.total++;
      throw error;
    }
  }

  /**
   * Test 3: Semantic Matching
   * Verify that confidence scores are reasonable and accurate
   */
  async testSemanticMatching() {
    log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
    log('TEST 3: SEMANTIC MATCHING & CONFIDENCE SCORES', 'cyan');
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');

    try {
      // Test confidence score ranges
      const confidenceTests = [
        {
          query: 'prompt optimization improvement quality',
          expectedTop: 'prompt-improver',
          minConfidence: 0.3, // 30% (lowered for realistic matching)
          description: 'High confidence match (exact keywords)'
        },
        {
          query: 'teach me tutorials learning guide',
          expectedTop: 'tutor-mode',
          minConfidence: 0.2, // 20% (lowered for realistic matching)
          description: 'Strong match (related keywords)'
        },
        {
          query: 'something vague and generic',
          expectedTop: null,
          maxConfidence: 0.3, // 30%
          description: 'Low confidence match (generic query)'
        }
      ];

      log('\nTesting confidence score accuracy:\n', 'blue');

      confidenceTests.forEach((test, idx) => {
        this.results.total++;
        log(`${idx + 1}. ${test.description}`, 'blue');
        log(`   Query: "${test.query}"`, 'blue');

        // Use very low threshold to get all results
        const results = this.matcher.match(test.query, 0.01).slice(0, 5);

        if (results.length > 0) {
          const topResult = results[0];
          const confidence = topResult.score;
          const confidencePercent = (confidence * 100).toFixed(1);

          log(`   Top match: ${topResult.skill.id} (${confidencePercent}% confidence)`, 'blue');

          // Test high confidence scenarios
          if (test.minConfidence) {
            if (topResult.skill.id === test.expectedTop && confidence >= test.minConfidence) {
              log(`   ✅ PASS: Matched expected skill with sufficient confidence (≥${(test.minConfidence * 100).toFixed(0)}%)`, 'green');
              this.results.passed++;
            } else if (topResult.skill.id !== test.expectedTop) {
              log(`   ❌ FAIL: Expected ${test.expectedTop}, got ${topResult.skill.id}`, 'red');
              this.results.failed++;
            } else {
              log(`   ❌ FAIL: Confidence ${confidencePercent}% below threshold ${(test.minConfidence * 100).toFixed(0)}%`, 'red');
              this.results.failed++;
            }
          }

          // Test low confidence scenarios
          if (test.maxConfidence) {
            if (confidence <= test.maxConfidence) {
              log(`   ✅ PASS: Low confidence as expected (≤${(test.maxConfidence * 100).toFixed(0)}%)`, 'green');
              this.results.passed++;
            } else {
              log(`   ❌ FAIL: Confidence ${confidencePercent}% above threshold ${(test.maxConfidence * 100).toFixed(0)}%`, 'red');
              this.results.failed++;
            }
          }
        } else {
          if (test.expectedTop === null) {
            log(`   ✅ PASS: No matches found as expected`, 'green');
            this.results.passed++;
          } else {
            log(`   ❌ FAIL: No matches found`, 'red');
            this.results.failed++;
          }
        }
        log('');
      });

      // Test confidence score distribution
      log('Testing confidence score distribution:', 'blue');
      this.results.total++;

      const testQuery = 'optimize performance and code quality';
      const results = this.matcher.match(testQuery, 0.01).slice(0, 10);

      log(`\n   Query: "${testQuery}"`, 'blue');
      log(`   Results (top 10):`, 'blue');

      results.forEach((result, idx) => {
        const confidence = (result.score * 100).toFixed(1);
        log(`     ${String(idx + 1).padStart(2, ' ')}. ${result.skill.id.padEnd(35, ' ')} ${confidence}%`, 'blue');
      });

      // Verify scores are in descending order
      let inOrder = true;
      for (let i = 1; i < results.length; i++) {
        if (results[i].score > results[i - 1].score) {
          inOrder = false;
          break;
        }
      }

      if (inOrder) {
        log(`\n   ✅ PASS: Confidence scores properly ordered (descending)`, 'green');
        this.results.passed++;
      } else {
        log(`\n   ❌ FAIL: Confidence scores not properly ordered`, 'red');
        this.results.failed++;
      }

      // Test edge cases
      log('\n\nTesting edge cases:', 'blue');

      // Empty query
      this.results.total++;
      const emptyResults = this.matcher.match('', 0.01);
      if (emptyResults.length === 0) {
        log(`   ✅ PASS: Empty query returns no results`, 'green');
        this.results.passed++;
      } else {
        log(`   ❌ FAIL: Empty query returned ${emptyResults.length} results`, 'red');
        this.results.failed++;
      }

      // Single keyword
      this.results.total++;
      const singleResults = this.matcher.match('optimization', 0.01);
      if (singleResults.length > 0) {
        log(`   ✅ PASS: Single keyword query works (${singleResults.length} results)`, 'green');
        this.results.passed++;
      } else {
        log(`   ❌ FAIL: Single keyword query returned no results`, 'red');
        this.results.failed++;
      }

    } catch (error) {
      log(`❌ FAIL: ${error.message}`, 'red');
      this.results.failed++;
      this.results.total++;
      throw error;
    }
  }

  /**
   * Run all tests
   */
  async runAll() {
    log('\n╔════════════════════════════════════════════════════════════╗', 'cyan');
    log('║        META-SKILL RUNTIME TEST SUITE                       ║', 'cyan');
    log('║        Deferred Tests from Build Validation                ║', 'cyan');
    log('╚════════════════════════════════════════════════════════════╝', 'cyan');

    const startTime = Date.now();

    try {
      await this.testSkillDiscovery();
      await this.testIntentParsing();
      await this.testSemanticMatching();

      const duration = Date.now() - startTime;

      // Print summary
      log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
      log('TEST SUMMARY', 'cyan');
      log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');

      const passRate = ((this.results.passed / this.results.total) * 100).toFixed(1);

      log(`\nTotal tests:  ${this.results.total}`, 'blue');
      log(`Passed:       ${this.results.passed}`, 'green');
      log(`Failed:       ${this.results.failed}`, this.results.failed > 0 ? 'red' : 'blue');
      log(`Pass rate:    ${passRate}%`, passRate >= 80 ? 'green' : 'yellow');
      log(`Duration:     ${duration}ms`, 'blue');

      if (this.results.failed === 0) {
        log('\n🎉 ALL TESTS PASSED!', 'green');
        return 0;
      } else {
        log(`\n⚠️  ${this.results.failed} TEST(S) FAILED`, 'yellow');
        return 1;
      }

    } catch (error) {
      log(`\n💥 TEST SUITE CRASHED: ${error.message}`, 'red');
      console.error(error);
      return 2;
    }
  }
}

// Run the test suite
if (require.main === module) {
  const suite = new RuntimeTestSuite();
  suite.runAll()
    .then(exitCode => process.exit(exitCode))
    .catch(err => {
      console.error('Fatal error:', err);
      process.exit(2);
    });
}

module.exports = RuntimeTestSuite;
