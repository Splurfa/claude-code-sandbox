#!/usr/bin/env node

/**
 * Example Usage of Refactored Prompt Improver
 *
 * Demonstrates Context7 integration, quality dimensions,
 * and session statistics.
 */

const { RefactoredPromptImprover } = require('./prompt-improver-refactored');

async function demonstrateRefactoredPromptImprover() {
  console.log('=== Refactored Prompt Improver v2.0.0 Demo ===\n');

  // Initialize with Context7 enabled
  const improver = new RefactoredPromptImprover({
    interventionThreshold: 0.7,
    context7Enabled: true,
    cacheTTL: 3600000, // 1 hour
    captainsLogPath: 'sessions/captains-log',
    autoLearn: true
  });

  // Example 1: Vague prompt (triggers Context7)
  console.log('Example 1: Vague Prompt\n');
  console.log('Input: "Build an API"\n');

  const result1 = await improver.improvePrompt("Build an API", { dryRun: true });

  console.log('Quality Dimensions:');
  console.log(`  Structural Completeness: ${(result1.analysis.qualityDimensions.structuralCompleteness * 100).toFixed(1)}%`);
  console.log(`  Clarity & Actionability: ${(result1.analysis.qualityDimensions.clarityActionability * 100).toFixed(1)}%`);
  console.log(`  File Routing Compliance: ${(result1.analysis.qualityDimensions.fileRoutingCompliance * 100).toFixed(1)}%`);
  console.log(`  Coordination Strategy:   ${(result1.analysis.qualityDimensions.coordinationStrategy * 100).toFixed(1)}%`);
  console.log(`  Mode Best Practices:     ${(result1.analysis.qualityDimensions.modeBestPractices * 100).toFixed(1)}%`);
  console.log(`  Overall Quality:         ${(result1.analysis.qualityDimensions.overall * 100).toFixed(1)}%\n`);

  console.log('Intervention Analysis:');
  console.log(`  Level: ${result1.analysis.interventionAnalysis.interventionLevel}`);
  console.log(`  Should Intervene: ${result1.analysis.interventionAnalysis.shouldIntervene}`);
  console.log(`  Issues Found: ${result1.analysis.interventionAnalysis.allIssues.length}\n`);

  if (result1.analysis.context7Insights) {
    console.log('Context7 Consulted:');
    console.log(`  Principles: ${result1.analysis.context7Insights.principles.length}`);
    console.log(`  Patterns: ${result1.analysis.context7Insights.patterns.length}`);
    console.log(`  Recommendations: ${result1.analysis.context7Insights.recommendations.length}\n`);

    console.log('Sample Claude Code Principles:');
    result1.analysis.context7Insights.principles.slice(0, 3).forEach((p, i) => {
      console.log(`  ${i + 1}. ${p}`);
    });
    console.log('');
  }

  // Example 2: File routing violation (critical issue)
  console.log('\nExample 2: File Routing Violation\n');
  console.log('Input: "Create tests in tests/api.test.js"\n');

  const result2 = await improver.improvePrompt("Create tests in tests/api.test.js", { dryRun: true });

  console.log('Quality Dimensions:');
  console.log(`  File Routing Compliance: ${(result2.analysis.qualityDimensions.fileRoutingCompliance * 100).toFixed(1)}%`);
  console.log(`  Overall Quality:         ${(result2.analysis.qualityDimensions.overall * 100).toFixed(1)}%\n`);

  console.log('Critical Issues:');
  result2.analysis.interventionAnalysis.criticalIssues.forEach((issue, i) => {
    console.log(`  ${i + 1}. ${issue.type}: ${issue.message}`);
    console.log(`     Severity: ${issue.severity}, Intervention: ${issue.intervention}`);
  });
  console.log('');

  // Example 3: Multi-agent coordination (triggers Context7)
  console.log('\nExample 3: Multi-Agent Coordination\n');
  console.log('Input: "Build full-stack app with frontend, backend, and database"\n');

  const result3 = await improver.improvePrompt(
    "Build full-stack app with frontend, backend, and database",
    { dryRun: true }
  );

  console.log('Mode Detected:', result3.analysis.mode);
  console.log('Estimated Agent Count:', result3.analysis.agentCount);
  console.log('Complexity:', (result3.analysis.complexity * 100).toFixed(1) + '%\n');

  console.log('Quality Dimensions:');
  console.log(`  Coordination Strategy: ${(result3.analysis.qualityDimensions.coordinationStrategy * 100).toFixed(1)}%`);
  console.log(`  Overall Quality:       ${(result3.analysis.qualityDimensions.overall * 100).toFixed(1)}%\n`);

  if (result3.analysis.context7Insights) {
    console.log('Context7 Patterns for Multi-Agent:');
    result3.analysis.context7Insights.patterns.slice(0, 3).forEach((p, i) => {
      console.log(`  ${i + 1}. ${p}`);
    });
    console.log('');
  }

  // Example 4: Well-formed prompt (no intervention)
  console.log('\nExample 4: Well-Formed Prompt\n');
  console.log('Input: "Implement JWT authentication in src/auth.js with refresh tokens, comprehensive tests in sessions/current/artifacts/tests/, following TDD approach"\n');

  const result4 = await improver.improvePrompt(
    "Implement JWT authentication in src/auth.js with refresh tokens, comprehensive tests in sessions/current/artifacts/tests/, following TDD approach",
    { dryRun: true }
  );

  console.log('Quality Dimensions:');
  console.log(`  Structural Completeness: ${(result4.analysis.qualityDimensions.structuralCompleteness * 100).toFixed(1)}%`);
  console.log(`  Clarity & Actionability: ${(result4.analysis.qualityDimensions.clarityActionability * 100).toFixed(1)}%`);
  console.log(`  File Routing Compliance: ${(result4.analysis.qualityDimensions.fileRoutingCompliance * 100).toFixed(1)}%`);
  console.log(`  Overall Quality:         ${(result4.analysis.qualityDimensions.overall * 100).toFixed(1)}%\n`);

  console.log('Intervention Analysis:');
  console.log(`  Should Intervene: ${result4.analysis.interventionAnalysis.shouldIntervene}`);
  console.log(`  Reason: ${result4.reason || 'Quality meets threshold'}\n`);

  // Session statistics
  console.log('\n=== Session Statistics ===\n');

  const summary = await improver.endSession();

  console.log('Session Summary:');
  console.log(`  Duration: ${Math.floor(summary.sessionDuration / 60000)} minutes`);
  console.log(`  Total Prompts Analyzed: ${summary.totalAnalyzed}`);
  console.log(`  Prompts Improved: ${summary.totalImproved}`);
  console.log(`  Improvement Rate: ${(summary.totalImproved / summary.totalAnalyzed * 100).toFixed(1)}%\n`);

  console.log('Context7 Statistics:');
  console.log(`  Consultations: ${summary.context7Stats.consultations}`);
  console.log(`  Cache Entries: ${summary.context7Stats.cacheEntries}`);
  console.log(`  Cache Hits: ${summary.context7Stats.cacheHits}`);
  console.log(`  Cache Hit Rate: ${(summary.context7Stats.cacheHits / summary.context7Stats.consultations * 100).toFixed(1)}%`);
  console.log(`  Token Savings: ${summary.context7Stats.tokenSavings}\n`);

  console.log('Top Issues:');
  summary.topIssues.forEach((issue, i) => {
    console.log(`  ${i + 1}. ${issue.type}: ${issue.count} occurrences`);
  });

  console.log('\n=== Demo Complete ===');
  console.log('\nCheck sessions/captains-log/ for detailed logs including Context7 consultations.');
}

// Run demo
if (require.main === module) {
  demonstrateRefactoredPromptImprover().catch(error => {
    console.error('Demo error:', error);
    process.exit(1);
  });
}

module.exports = { demonstrateRefactoredPromptImprover };
