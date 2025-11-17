#!/usr/bin/env node
/**
 * Learning System Integration (ReasoningBank)
 * Captures corrections and applies learned patterns
 *
 * Stock dependencies: claude-flow neural hooks
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Capture correction and store in learning system
 */
async function captureCorrection(originalAction, correction, outcome) {
  const learningEntry = {
    timestamp: new Date().toISOString(),
    session: process.env.SESSION_ID,
    original: originalAction,
    correction: correction,
    outcome: outcome,
    verdict: outcome === 'success' ? 'correct' : 'incorrect'
  };

  // Store in memory via hooks
  try {
    execSync(
      `npx claude-flow@alpha hooks memory:store --key "hive/learning/${Date.now()}" --value '${JSON.stringify(learningEntry)}'`,
      { stdio: 'pipe' }
    );
  } catch (error) {
    console.warn('Learning capture warning:', error.message);
  }

  // Train neural pattern if correction was successful
  if (outcome === 'success') {
    trainPattern(originalAction, correction);
  }

  return learningEntry;
}

/**
 * Train pattern from correction
 */
function trainPattern(originalPattern, correctedPattern) {
  try {
    execSync(
      `npx claude-flow@alpha hooks neural:train --pattern "${originalPattern}" --outcome "${correctedPattern}"`,
      { stdio: 'pipe' }
    );
  } catch (error) {
    console.warn('Pattern training warning:', error.message);
  }
}

/**
 * Retrieve learned patterns for context
 */
function getLearnedPatterns(category = 'all') {
  try {
    const result = execSync(
      `npx claude-flow@alpha hooks memory:retrieve --pattern "hive/learning/*"`,
      { encoding: 'utf-8' }
    );

    const patterns = JSON.parse(result || '[]');

    if (category === 'all') {
      return patterns;
    }

    return patterns.filter(p => p.category === category);
  } catch (error) {
    return []; // No patterns yet
  }
}

/**
 * Apply learned pattern to new situation
 */
async function applyPattern(situation, context = {}) {
  const patterns = getLearnedPatterns();

  // Find matching pattern based on similarity
  const matchingPattern = patterns.find(p => {
    return isSimilarSituation(situation, p.original);
  });

  if (matchingPattern) {
    console.log('🧠 Applying learned pattern:', matchingPattern.correction);
    return matchingPattern.correction;
  }

  return null; // No matching pattern found
}

/**
 * Check if situations are similar (simple keyword matching)
 */
function isSimilarSituation(situation1, situation2) {
  const keywords1 = extractKeywords(situation1);
  const keywords2 = extractKeywords(situation2);

  const overlap = keywords1.filter(k => keywords2.includes(k));
  return overlap.length / Math.min(keywords1.length, keywords2.length) > 0.5;
}

/**
 * Extract keywords from situation description
 */
function extractKeywords(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 3)
    .slice(0, 10);
}

/**
 * Generate learning report
 */
function generateLearningReport() {
  const patterns = getLearnedPatterns();

  const report = {
    total_patterns: patterns.length,
    successful_corrections: patterns.filter(p => p.verdict === 'correct').length,
    categories: {},
    recent_learnings: patterns.slice(-5)
  };

  // Categorize patterns
  patterns.forEach(p => {
    const category = p.category || 'general';
    report.categories[category] = (report.categories[category] || 0) + 1;
  });

  return report;
}

/**
 * Periodic learning system maintenance
 */
function maintainLearningSystem() {
  try {
    // Compress old patterns
    execSync(
      'npx claude-flow@alpha hooks memory:compress --namespace "hive/learning"',
      { stdio: 'pipe' }
    );

    // Generate report
    const report = generateLearningReport();

    console.log('🧠 Learning System Status:');
    console.log(`  Total patterns: ${report.total_patterns}`);
    console.log(`  Successful corrections: ${report.successful_corrections}`);
    console.log(`  Categories: ${Object.keys(report.categories).join(', ')}`);

    return report;
  } catch (error) {
    console.warn('Learning maintenance warning:', error.message);
    return null;
  }
}

// Export functions
module.exports = {
  captureCorrection,
  trainPattern,
  getLearnedPatterns,
  applyPattern,
  generateLearningReport,
  maintainLearningSystem
};

// CLI usage
if (require.main === module) {
  const [command, ...args] = process.argv.slice(2);

  switch (command) {
    case 'capture':
      const [original, correction, outcome] = args;
      captureCorrection(original, correction, outcome).then(entry => {
        console.log('✅ Correction captured:', entry);
      });
      break;

    case 'patterns':
      const patterns = getLearnedPatterns();
      console.log(`Found ${patterns.length} learned patterns`);
      patterns.slice(-5).forEach(p => {
        console.log(`  ${p.timestamp}: ${p.original} → ${p.correction}`);
      });
      break;

    case 'report':
      const report = generateLearningReport();
      console.log(JSON.stringify(report, null, 2));
      break;

    case 'maintain':
      maintainLearningSystem();
      break;

    default:
      console.log('Usage:');
      console.log('  node learning-integration.js capture "<original>" "<correction>" "<outcome>"');
      console.log('  node learning-integration.js patterns');
      console.log('  node learning-integration.js report');
      console.log('  node learning-integration.js maintain');
  }
}
