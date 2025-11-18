#!/usr/bin/env node

/**
 * CLI Interface for Prompt Improver
 *
 * Provides command-line access to all prompt improver features.
 */

const { PromptImprover } = require('./prompt-improver');
const { LearningLog } = require('./lib/learning-log');

const commands = {
  /**
   * Analyze a prompt without improving
   */
  async analyze(args) {
    const prompt = args[0];
    if (!prompt) {
      console.error('Error: Prompt required');
      console.log('Usage: prompt-improver analyze "<prompt>"');
      process.exit(1);
    }

    const improver = new PromptImprover();
    const result = await improver.improvePrompt(prompt, { dryRun: true });

    console.log(JSON.stringify(result, null, 2));
  },

  /**
   * Improve a prompt with confirmation
   */
  async improve(args) {
    const prompt = args[0];
    if (!prompt) {
      console.error('Error: Prompt required');
      console.log('Usage: prompt-improver improve "<prompt>"');
      process.exit(1);
    }

    const improver = new PromptImprover();
    const result = await improver.improvePrompt(prompt);

    if (result.shouldImprove && result.improvedPrompt) {
      console.log('\n=== Improved Prompt ===');
      console.log(result.improvedPrompt);
      console.log('\n=== Applied Improvements ===');
      for (const improvement of result.improvements) {
        console.log(`- ${improvement.type}: ${improvement.action}`);
      }
    } else {
      console.log('\n=== No Improvements Needed ===');
      console.log(`Reason: ${result.reason}`);
    }
  },

  /**
   * Detect mode from prompt
   */
  async detectMode(args) {
    const prompt = args[0];
    if (!prompt) {
      console.error('Error: Prompt required');
      console.log('Usage: prompt-improver detect-mode "<prompt>"');
      process.exit(1);
    }

    const improver = new PromptImprover();
    const mode = improver.detectMode(prompt);

    console.log(JSON.stringify({ mode }, null, 2));
  },

  /**
   * Show learning statistics
   */
  async stats(args) {
    const learningLog = new LearningLog();
    const stats = await learningLog.getStats();

    if (!stats) {
      console.log('No statistics available yet.');
      return;
    }

    console.log('\n=== Prompt Improver Statistics ===\n');
    console.log(`Total Improvements: ${stats.totalImprovements}`);
    console.log(`Total Rejections: ${stats.totalRejections}`);
    console.log(`Acceptance Rate: ${(stats.acceptanceRate * 100).toFixed(1)}%`);
    console.log(`Avg Improvements/Prompt: ${stats.avgImprovementsPerPrompt.toFixed(2)}`);

    if (stats.topImprovementTypes.length > 0) {
      console.log('\nTop Improvement Types:');
      for (const { type, count } of stats.topImprovementTypes) {
        console.log(`  ${type}: ${count}`);
      }
    }

    if (stats.topRejectionReasons.length > 0) {
      console.log('\nTop Rejection Reasons:');
      for (const { reason, count } of stats.topRejectionReasons) {
        console.log(`  ${reason}: ${count}`);
      }
    }

    if (stats.recentTrend) {
      console.log(`\nRecent Trend (${stats.recentTrend.days} days):`);
      console.log(`  Trend: ${stats.recentTrend.trend}`);
      console.log(`  Rate: ${(stats.recentTrend.rate * 100).toFixed(1)}%`);
      console.log(`  Improvements: ${stats.recentTrend.improvements}`);
      console.log(`  Rejections: ${stats.recentTrend.rejections}`);
    }

    console.log('');
  },

  /**
   * Show successful patterns for a category
   */
  async patterns(args) {
    const category = args[0] || 'structure';
    const limit = parseInt(args[1]) || 5;

    const learningLog = new LearningLog();
    const patterns = await learningLog.getSuccessfulPatterns(category, limit);

    if (patterns.length === 0) {
      console.log(`No patterns found for category: ${category}`);
      return;
    }

    console.log(`\n=== Successful Patterns: ${category} ===\n`);
    for (let i = 0; i < patterns.length; i++) {
      const pattern = patterns[i];
      console.log(`${i + 1}. Original: ${pattern.originalPrompt.substring(0, 80)}...`);
      console.log(`   Improved: ${pattern.improvedPrompt.substring(0, 80)}...`);
      console.log(`   Suggestions: ${pattern.suggestions.map(s => s.type).join(', ')}`);
      console.log('');
    }
  },

  /**
   * Show help
   */
  async help() {
    console.log(`
Prompt Improver CLI

Usage:
  prompt-improver <command> [args]

Commands:
  analyze "<prompt>"              Analyze prompt without improving
  improve "<prompt>"              Analyze and improve with confirmation
  detect-mode "<prompt>"          Detect execution mode (hive/swarm/wizard/direct)
  stats                           Show learning statistics
  patterns <category> [limit]     Show successful patterns for category
                                  Categories: structure, clarity, specificity, context, coordination
  help                            Show this help message

Examples:
  prompt-improver analyze "Build an API"
  prompt-improver improve "Create authentication with tests"
  prompt-improver detect-mode "Spawn swarm to analyze codebase"
  prompt-improver stats
  prompt-improver patterns structure 10
    `);
  }
};

// Main CLI handler
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === 'help' || command === '--help' || command === '-h') {
    await commands.help();
    process.exit(0);
  }

  if (!commands[command]) {
    console.error(`Unknown command: ${command}`);
    console.log('Run "prompt-improver help" for usage information.');
    process.exit(1);
  }

  try {
    await commands[command](args.slice(1));
  } catch (error) {
    console.error('Error:', error.message);
    if (process.env.DEBUG) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { commands };
