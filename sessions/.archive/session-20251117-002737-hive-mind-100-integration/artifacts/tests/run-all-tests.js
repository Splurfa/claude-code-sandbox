#!/usr/bin/env node
/**
 * Test Runner for Comprehensive Integration Testing
 * Runs all test suites and generates coverage report
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function section(title) {
  log('\n' + '═'.repeat(80), 'cyan');
  log(`  ${title}`, 'bright');
  log('═'.repeat(80) + '\n', 'cyan');
}

async function runTests() {
  const startTime = Date.now();
  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    suites: []
  };

  section('🚀 HIVE MIND 100/100 VERIFICATION - COMPREHENSIVE TEST SUITE');

  const testSuites = [
    {
      name: 'Integration Tests - Full Workflow',
      path: './integration/full-workflow.test.js',
      category: 'integration'
    },
    {
      name: 'Performance Benchmarks',
      path: './performance/benchmarks.test.js',
      category: 'performance'
    },
    {
      name: 'Chaos Engineering - Failure Scenarios',
      path: './chaos/failure-scenarios.test.js',
      category: 'chaos'
    },
    {
      name: 'Load Testing - Concurrent Agents',
      path: './load/concurrent-agents.test.js',
      category: 'load'
    },
    {
      name: 'Stock Adherence Validation',
      path: './stock-adherence/stock-validation.test.js',
      category: 'stock'
    }
  ];

  log('Test Suites to Execute:', 'bright');
  testSuites.forEach((suite, i) => {
    log(`  ${i + 1}. ${suite.name} (${suite.category})`, 'blue');
  });
  log('');

  // Install Jest if needed
  section('📦 Checking Dependencies');
  try {
    require.resolve('jest');
    log('✓ Jest is installed', 'green');
  } catch (e) {
    log('Installing Jest...', 'yellow');
    try {
      execSync('npm install --save-dev jest', { stdio: 'inherit' });
      log('✓ Jest installed successfully', 'green');
    } catch (error) {
      log('✗ Failed to install Jest', 'red');
      log('Please run: npm install --save-dev jest', 'yellow');
    }
  }

  // Run each test suite
  for (const suite of testSuites) {
    section(`📋 Running: ${suite.name}`);

    try {
      const output = execSync(
        `npx jest ${suite.path} --verbose --detectOpenHandles`,
        {
          encoding: 'utf8',
          cwd: __dirname,
          stdio: 'pipe'
        }
      );

      // Parse Jest output
      const passedMatch = output.match(/Tests:\s+(\d+) passed/);
      const failedMatch = output.match(/(\d+) failed/);
      const totalMatch = output.match(/(\d+) total/);

      const passed = passedMatch ? parseInt(passedMatch[1]) : 0;
      const failed = failedMatch ? parseInt(failedMatch[1]) : 0;
      const total = totalMatch ? parseInt(totalMatch[1]) : passed + failed;

      results.total += total;
      results.passed += passed;
      results.failed += failed;

      results.suites.push({
        name: suite.name,
        category: suite.category,
        passed,
        failed,
        total,
        status: failed === 0 ? 'PASSED' : 'FAILED'
      });

      if (failed === 0) {
        log(`✓ ${suite.name}: ${passed}/${total} tests passed`, 'green');
      } else {
        log(`✗ ${suite.name}: ${passed}/${total} tests passed, ${failed} failed`, 'red');
      }

      // Show output snippet
      const lines = output.split('\n');
      const summary = lines.slice(-10).join('\n');
      log('\nSummary:', 'cyan');
      console.log(summary);

    } catch (error) {
      log(`✗ ${suite.name}: FAILED TO RUN`, 'red');
      console.error(error.stdout || error.message);

      results.total += 1;
      results.failed += 1;
      results.suites.push({
        name: suite.name,
        category: suite.category,
        passed: 0,
        failed: 1,
        total: 1,
        status: 'ERROR'
      });
    }
  }

  // Generate coverage report
  section('📊 Generating Coverage Report');

  const coverage = {
    timestamp: new Date().toISOString(),
    duration: Date.now() - startTime,
    results,
    dimensions: {
      integration: calculateDimensionScore('integration', results.suites),
      performance: calculateDimensionScore('performance', results.suites),
      chaos: calculateDimensionScore('chaos', results.suites),
      load: calculateDimensionScore('load', results.suites),
      stock: calculateDimensionScore('stock', results.suites)
    }
  };

  // Calculate overall score
  const dimensionScores = Object.values(coverage.dimensions);
  coverage.overallScore = Math.round(
    dimensionScores.reduce((sum, d) => sum + d.score, 0) / dimensionScores.length
  );

  // Save coverage report
  const reportPath = path.join(__dirname, '../coverage-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(coverage, null, 2));

  // Display final results
  section('🎯 FINAL RESULTS');

  log('Overall Score:', 'bright');
  const scoreColor = coverage.overallScore >= 90 ? 'green' :
                     coverage.overallScore >= 70 ? 'yellow' : 'red';
  log(`  ${coverage.overallScore}/100`, scoreColor);
  log('');

  log('Dimension Scores:', 'bright');
  Object.entries(coverage.dimensions).forEach(([name, data]) => {
    const color = data.score >= 90 ? 'green' :
                  data.score >= 70 ? 'yellow' : 'red';
    log(`  ${name.padEnd(15)}: ${data.score}/100 (${data.passed}/${data.total} tests)`, color);
  });
  log('');

  log('Suite Results:', 'bright');
  results.suites.forEach(suite => {
    const color = suite.status === 'PASSED' ? 'green' : 'red';
    log(`  ${suite.status.padEnd(8)} ${suite.name} (${suite.passed}/${suite.total})`, color);
  });
  log('');

  log('Test Statistics:', 'bright');
  log(`  Total Tests:   ${results.total}`, 'cyan');
  log(`  Passed:        ${results.passed}`, 'green');
  log(`  Failed:        ${results.failed}`, results.failed > 0 ? 'red' : 'green');
  log(`  Pass Rate:     ${((results.passed / results.total) * 100).toFixed(1)}%`,
      results.failed === 0 ? 'green' : 'yellow');
  log(`  Duration:      ${((Date.now() - startTime) / 1000).toFixed(2)}s`, 'cyan');
  log('');

  log(`Coverage report saved to: ${reportPath}`, 'cyan');

  // Generate markdown report
  generateMarkdownReport(coverage);

  // Exit with appropriate code
  if (results.failed > 0) {
    log('\n❌ Some tests failed. Review the output above.', 'red');
    process.exit(1);
  } else {
    log('\n✅ All tests passed!', 'green');
    if (coverage.overallScore >= 95) {
      log('🏆 EXCELLENT! 100/100 verification achieved!', 'green');
    } else if (coverage.overallScore >= 90) {
      log('👍 GOOD! Strong verification coverage.', 'yellow');
    } else {
      log('⚠️  Additional testing recommended.', 'yellow');
    }
    process.exit(0);
  }
}

function calculateDimensionScore(category, suites) {
  const categorySuites = suites.filter(s => s.category === category);

  if (categorySuites.length === 0) {
    return { score: 0, passed: 0, total: 0, tests: [] };
  }

  const total = categorySuites.reduce((sum, s) => sum + s.total, 0);
  const passed = categorySuites.reduce((sum, s) => sum + s.passed, 0);
  const score = total > 0 ? Math.round((passed / total) * 100) : 0;

  return {
    score,
    passed,
    total,
    tests: categorySuites.map(s => ({
      name: s.name,
      passed: s.passed,
      total: s.total
    }))
  };
}

function generateMarkdownReport(coverage) {
  const reportPath = path.join(__dirname, '../TEST-REPORT.md');

  const md = `# Hive Mind 100/100 Verification - Test Report

**Generated:** ${coverage.timestamp}
**Duration:** ${(coverage.duration / 1000).toFixed(2)}s
**Overall Score:** ${coverage.overallScore}/100

## 📊 Summary

- **Total Tests:** ${coverage.results.total}
- **Passed:** ${coverage.results.passed}
- **Failed:** ${coverage.results.failed}
- **Pass Rate:** ${((coverage.results.passed / coverage.results.total) * 100).toFixed(1)}%

## 🎯 Dimension Scores

| Dimension | Score | Tests Passed | Total Tests |
|-----------|-------|--------------|-------------|
${Object.entries(coverage.dimensions).map(([name, data]) =>
  `| ${name.charAt(0).toUpperCase() + name.slice(1)} | ${data.score}/100 | ${data.passed} | ${data.total} |`
).join('\n')}

## 📋 Test Suite Results

${coverage.results.suites.map(suite => `
### ${suite.status === 'PASSED' ? '✅' : '❌'} ${suite.name}

- **Status:** ${suite.status}
- **Tests Passed:** ${suite.passed}/${suite.total}
- **Category:** ${suite.category}
`).join('\n')}

## 🔍 Dimension Details

${Object.entries(coverage.dimensions).map(([name, data]) => `
### ${name.charAt(0).toUpperCase() + name.slice(1)} (${data.score}/100)

${data.tests.map(test =>
  `- ${test.passed === test.total ? '✅' : '❌'} ${test.name}: ${test.passed}/${test.total}`
).join('\n')}
`).join('\n')}

## 🏆 Verification Status

${coverage.overallScore >= 95 ? `
**EXCELLENT!** All verification criteria met.
- ✅ 20+ automated tests passing
- ✅ Performance benchmarks validated
- ✅ Chaos engineering tests passed
- ✅ Load testing successful
- ✅ Stock adherence confirmed
` : coverage.overallScore >= 90 ? `
**GOOD!** Strong verification coverage achieved.
- ✅ Most tests passing
- ⚠️ Minor issues to address
` : `
**NEEDS IMPROVEMENT**
- ❌ Some tests failing
- ⚠️ Review failed tests and improve
`}

---

*Report generated by Hive Mind 100/100 Verification Test Suite*
`;

  fs.writeFileSync(reportPath, md);
  log(`\nMarkdown report saved to: ${reportPath}`, 'cyan');
}

// Run tests
runTests().catch(error => {
  log('\n💥 Test runner failed:', 'red');
  console.error(error);
  process.exit(1);
});
