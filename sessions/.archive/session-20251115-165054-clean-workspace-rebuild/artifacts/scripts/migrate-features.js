#!/usr/bin/env node
/**
 * Feature-to-Skill Migration Script
 * Converts custom features to Claude Code skills
 */

const fs = require('fs').promises;
const path = require('path');

// Configuration
const CONFIG = {
  sourceWorkspace: process.env.SOURCE_WORKSPACE || process.cwd(),
  targetWorkspace: process.env.TARGET_WORKSPACE || process.cwd(),
  skillsDir: '.claude/skills',
  dryRun: process.env.DRY_RUN === 'true',
  verbose: process.env.VERBOSE === 'true'
};

// Feature definitions to migrate
const FEATURE_MAP = {
  'session-management': {
    name: 'session-management',
    description: 'Automatic session directory creation and management',
    priority: 'high',
    type: 'automation',
    files: [
      '.claude/scripts/session-init.sh',
      'sessions/metadata.json'
    ]
  },
  'file-routing': {
    name: 'file-routing',
    description: 'Intelligent file organization and routing',
    priority: 'high',
    type: 'automation',
    files: [
      '.claude/skills/file-routing/'
    ]
  },
  'captains-log': {
    name: 'captains-log',
    description: 'Journaling and decision tracking',
    priority: 'medium',
    type: 'documentation',
    files: [
      'sessions/captains-log/'
    ]
  },
  'git-checkpoints': {
    name: 'git-checkpoints',
    description: 'Automated git commit checkpoints',
    priority: 'medium',
    type: 'automation',
    files: [
      '.claude/hooks/git-checkpoint.js'
    ]
  },
  'reasoningbank': {
    name: 'reasoningbank',
    description: 'Learning and pattern recognition',
    priority: 'low',
    type: 'enhancement',
    files: [
      '.claude/reasoningbank/'
    ]
  },
  'agentdb': {
    name: 'agentdb',
    description: 'Vector database integration',
    priority: 'low',
    type: 'enhancement',
    files: [
      '.agentdb/'
    ]
  }
};

// Logging utilities
const log = {
  info: (msg) => console.log(`[INFO] ${msg}`),
  warn: (msg) => console.warn(`[WARN] ${msg}`),
  error: (msg) => console.error(`[ERROR] ${msg}`),
  debug: (msg) => CONFIG.verbose && console.log(`[DEBUG] ${msg}`),
  success: (msg) => console.log(`[SUCCESS] ${msg}`)
};

/**
 * Check if path exists
 */
async function pathExists(filepath) {
  try {
    await fs.access(filepath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Create skill YAML structure
 */
function createSkillYAML(feature) {
  const { name, description, priority, type } = FEATURE_MAP[feature];

  return `---
name: ${name}
description: ${description}
version: 1.0.0
priority: ${priority}
type: ${type}
---

# ${name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}

${description}

## Usage

This skill was migrated from custom features. See implementation details below.

## Implementation

[Auto-generated from migration]

## Integration

This skill integrates with stock claude-flow hooks system.
`;
}

/**
 * Analyze feature usage
 */
async function analyzeFeatureUsage(feature) {
  log.debug(`Analyzing feature: ${feature}`);

  const analysis = {
    feature,
    exists: false,
    files: [],
    dependencies: [],
    complexity: 'low',
    canMigrate: true,
    reason: ''
  };

  const featureConfig = FEATURE_MAP[feature];
  if (!featureConfig) {
    analysis.canMigrate = false;
    analysis.reason = 'Unknown feature';
    return analysis;
  }

  // Check if files exist
  for (const file of featureConfig.files) {
    const filepath = path.join(CONFIG.sourceWorkspace, file);
    if (await pathExists(filepath)) {
      analysis.exists = true;
      analysis.files.push(file);
    }
  }

  // Determine complexity
  if (analysis.files.length > 5) {
    analysis.complexity = 'high';
  } else if (analysis.files.length > 2) {
    analysis.complexity = 'medium';
  }

  return analysis;
}

/**
 * Create skill directory structure
 */
async function createSkillStructure(feature, targetDir) {
  const skillDir = path.join(targetDir, CONFIG.skillsDir, feature);

  if (CONFIG.dryRun) {
    log.info(`[DRY RUN] Would create: ${skillDir}`);
    return skillDir;
  }

  await fs.mkdir(skillDir, { recursive: true });
  log.debug(`Created skill directory: ${skillDir}`);

  return skillDir;
}

/**
 * Migrate feature to skill
 */
async function migrateFeature(feature) {
  log.info(`Migrating feature: ${feature}`);

  // Analyze feature
  const analysis = await analyzeFeatureUsage(feature);

  if (!analysis.canMigrate) {
    log.warn(`Cannot migrate ${feature}: ${analysis.reason}`);
    return { success: false, feature, reason: analysis.reason };
  }

  if (!analysis.exists) {
    log.warn(`Feature ${feature} not found in source workspace`);
    return { success: false, feature, reason: 'Not found' };
  }

  // Create skill structure
  const skillDir = await createSkillStructure(feature, CONFIG.targetWorkspace);

  // Create skill.md
  const skillYAML = createSkillYAML(feature);
  const skillFile = path.join(skillDir, 'skill.md');

  if (CONFIG.dryRun) {
    log.info(`[DRY RUN] Would write: ${skillFile}`);
  } else {
    await fs.writeFile(skillFile, skillYAML);
    log.debug(`Created skill file: ${skillFile}`);
  }

  // Copy implementation files
  for (const file of analysis.files) {
    const sourcePath = path.join(CONFIG.sourceWorkspace, file);
    const targetPath = path.join(skillDir, path.basename(file));

    if (CONFIG.dryRun) {
      log.info(`[DRY RUN] Would copy: ${file} -> ${targetPath}`);
    } else {
      try {
        const stat = await fs.stat(sourcePath);
        if (stat.isDirectory()) {
          // Copy directory recursively
          await fs.cp(sourcePath, targetPath, { recursive: true });
        } else {
          // Copy file
          await fs.copyFile(sourcePath, targetPath);
        }
        log.debug(`Copied: ${file}`);
      } catch (error) {
        log.warn(`Failed to copy ${file}: ${error.message}`);
      }
    }
  }

  log.success(`Migrated ${feature} to skill`);
  return { success: true, feature, skillDir, files: analysis.files };
}

/**
 * Generate migration report
 */
function generateReport(results) {
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  const report = {
    timestamp: new Date().toISOString(),
    total: results.length,
    successful: successful.length,
    failed: failed.length,
    dryRun: CONFIG.dryRun,
    results: results.map(r => ({
      feature: r.feature,
      success: r.success,
      reason: r.reason || 'Success',
      files: r.files || []
    }))
  };

  return report;
}

/**
 * Print migration summary
 */
function printSummary(report) {
  console.log('\n========================================');
  console.log('  Feature Migration Summary');
  console.log('========================================\n');
  console.log(`Total Features: ${report.total}`);
  console.log(`Successful: ${report.successful}`);
  console.log(`Failed: ${report.failed}`);
  console.log(`Dry Run: ${report.dryRun ? 'Yes' : 'No'}`);
  console.log('\nResults:');

  report.results.forEach(r => {
    const status = r.success ? '✓' : '✗';
    console.log(`  ${status} ${r.feature}: ${r.reason}`);
    if (r.files.length > 0) {
      console.log(`    Files: ${r.files.length}`);
    }
  });

  console.log('\n========================================\n');
}

/**
 * Main migration function
 */
async function main() {
  log.info('Starting feature-to-skill migration...');
  log.info(`Source: ${CONFIG.sourceWorkspace}`);
  log.info(`Target: ${CONFIG.targetWorkspace}`);
  log.info(`Dry Run: ${CONFIG.dryRun}`);

  const features = Object.keys(FEATURE_MAP);
  const results = [];

  for (const feature of features) {
    try {
      const result = await migrateFeature(feature);
      results.push(result);
    } catch (error) {
      log.error(`Failed to migrate ${feature}: ${error.message}`);
      results.push({ success: false, feature, reason: error.message });
    }
  }

  // Generate and print report
  const report = generateReport(results);
  printSummary(report);

  // Save report
  const reportPath = path.join(
    CONFIG.targetWorkspace,
    'sessions/session-20251115-165054-clean-workspace-rebuild/artifacts/docs/migration-report.json'
  );

  if (!CONFIG.dryRun) {
    await fs.mkdir(path.dirname(reportPath), { recursive: true });
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    log.success(`Report saved: ${reportPath}`);
  }

  log.info('Migration complete!');
  process.exit(report.failed > 0 ? 1 : 0);
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    log.error(`Fatal error: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { migrateFeature, analyzeFeatureUsage, FEATURE_MAP };
