#!/usr/bin/env node
/**
 * Workspace File Scoring Algorithm
 * Scores 360 workspace files on 4 dimensions:
 * 1. Informative Value (0-100)
 * 2. Prescriptive Risk (0-100)
 * 3. Confidence Score (0-100)
 * 4. Relevance Score (0-100)
 */

const fs = require('fs');
const path = require('path');

// Load inventory
const inventoryPath = process.argv[2] || './workspace-inventory.json';
const inventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'));

// Scoring rules based on file characteristics
const SCORING_RULES = {
  // Confidence scores
  confidence: {
    'CLAUDE.md': 100,  // User-created, authoritative
    'stock-claude-flow': 95,  // Vendor-provided
    'custom-extension': 55,  // Unverified (cap)
    'generated-docs': 65,  // Auto-generated
    'user-session': 70,  // User session data
    'backup': 85,  // Immutable historical data
  },

  // Informative value factors
  informative: {
    documentation: 85,
    configuration: 90,
    agent_definition: 75,
    command: 70,
    skill: 75,
    session: 60,
    backup: 50,
    guide: 80,
  },

  // Prescriptive risk factors (high = dangerous to edit)
  prescriptive_risk: {
    'root_config': 95,  // CLAUDE.md, package.json
    'stock_implementation': 90,  // Stock claude-flow files
    'agent_definition': 70,
    'command': 65,
    'skill': 65,
    'session_artifact': 30,  // Safe to edit
    'guide': 40,
    'backup': 100,  // NEVER edit
  },

  // Relevance factors
  relevance: {
    'core_config': 100,
    'agent_core': 95,
    'agent_specialized': 85,
    'command_frequent': 90,
    'command_rare': 60,
    'skill_active': 85,
    'skill_experimental': 50,
    'session_current': 80,
    'session_archived': 40,
    'guide': 75,
  }
};

// Categorize file based on path patterns
function categorizeFile(file) {
  const p = file.path;
  const categories = [];

  // Root configs
  if (p === 'CLAUDE.md' || p === '.claude/CLAUDE.md') {
    categories.push('root_config', 'core_config', 'user-created');
  }
  if (p === 'WORKSPACE-ARCHITECTURE.md' || p === 'WORKSPACE-GUIDE.md') {
    categories.push('root_config', 'core_config', 'custom-extension');
  }
  if (p === 'package.json' || p === '.gitignore' || p === 'tsconfig.json') {
    categories.push('root_config', 'core_config', 'stock-claude-flow');
  }

  // Agents
  if (p.startsWith('.claude/agents/')) {
    categories.push('agent_definition');
    if (p.includes('/core/')) categories.push('agent_core');
    else categories.push('agent_specialized');

    // Stock vs custom detection
    if (p.includes('flow-nexus') || p.includes('custom-')) {
      categories.push('custom-extension');
    } else {
      categories.push('stock-claude-flow');
    }
  }

  // Commands
  if (p.startsWith('.claude/commands/')) {
    categories.push('command');
    // Frequent vs rare
    const frequentCommands = ['session-start', 'session-closeout', 'hive-mind', 'sparc'];
    if (frequentCommands.some(cmd => p.includes(cmd))) {
      categories.push('command_frequent');
    } else {
      categories.push('command_rare');
    }
    categories.push('stock-claude-flow');
  }

  // Skills
  if (p.startsWith('.claude/skills/')) {
    categories.push('skill');
    const activeSkills = ['agentdb', 'reasoningbank', 'swarm', 'github'];
    if (activeSkills.some(skill => p.includes(skill))) {
      categories.push('skill_active');
    } else {
      categories.push('skill_experimental');
    }
    categories.push('stock-claude-flow');
  }

  // Sessions
  if (p.startsWith('sessions/')) {
    categories.push('session');
    const isArchived = p.includes('session-2025111') && !p.includes('20251117');
    if (isArchived) {
      categories.push('session_archived');
    } else {
      categories.push('session_current');
    }
    categories.push('user-session');
  }

  // Backups (READ-ONLY)
  if (p.startsWith('.swarm/backups/')) {
    categories.push('backup', 'read-only-immutable');
  }

  // Guides
  if (p.startsWith('docs/guides/')) {
    categories.push('guide', 'custom-extension');
  }

  // READ-ONLY zones
  if (p.startsWith('codex-agent/') || p.startsWith('cursor-agent/')) {
    categories.push('read-only-zone');
  }

  return categories;
}

// Calculate confidence score
function calculateConfidence(file, categories) {
  if (file.path === 'CLAUDE.md' || file.path === '.claude/CLAUDE.md') {
    return 100;  // User-created, authoritative
  }

  if (categories.includes('read-only-immutable')) return 85;
  if (categories.includes('stock-claude-flow')) return 95;
  if (categories.includes('custom-extension')) return 55;
  if (categories.includes('user-session')) return 70;
  if (categories.includes('user-created')) return 100;

  return 65;  // Default
}

// Calculate informative value
function calculateInformative(file, categories) {
  let score = 50;  // Base score

  // Size factor (larger = more information, but cap diminishing returns)
  const sizeKB = file.size_bytes / 1024;
  const sizeFactor = Math.min(20, Math.log10(sizeKB + 1) * 10);
  score += sizeFactor;

  // Category bonuses
  if (categories.includes('root_config')) score += 35;
  else if (categories.includes('agent_definition')) score += 20;
  else if (categories.includes('command')) score += 15;
  else if (categories.includes('skill')) score += 20;
  else if (categories.includes('guide')) score += 25;
  else if (categories.includes('session')) score += 5;

  // Documentation boost
  if (file.category === 'documentation' || file.path.endsWith('.md')) {
    score += 10;
  }

  return Math.min(100, Math.round(score));
}

// Calculate prescriptive risk (high = dangerous to edit)
function calculatePrescriptiveRisk(file, categories) {
  let risk = 30;  // Base risk

  // Immutable files
  if (categories.includes('read-only-immutable')) return 100;
  if (categories.includes('read-only-zone')) return 100;

  // Root configs are high risk
  if (categories.includes('root_config')) risk += 60;

  // Stock implementations
  if (categories.includes('stock-claude-flow')) risk += 50;

  // Agent definitions - moderate risk
  if (categories.includes('agent_definition')) risk += 35;

  // Commands and skills - moderate risk
  if (categories.includes('command') || categories.includes('skill')) {
    risk += 30;
  }

  // Custom extensions - lower risk (designed to be edited)
  if (categories.includes('custom-extension')) risk -= 20;

  // Session artifacts - very low risk
  if (categories.includes('session')) risk -= 15;

  return Math.min(100, Math.max(0, Math.round(risk)));
}

// Calculate relevance score
function calculateRelevance(file, categories) {
  let score = 50;  // Base score

  // Core configs are most relevant
  if (categories.includes('core_config')) score += 45;

  // Agent relevance
  if (categories.includes('agent_core')) score += 40;
  else if (categories.includes('agent_specialized')) score += 30;

  // Command relevance
  if (categories.includes('command_frequent')) score += 35;
  else if (categories.includes('command_rare')) score += 5;

  // Skill relevance
  if (categories.includes('skill_active')) score += 30;
  else if (categories.includes('skill_experimental')) score -= 5;

  // Session relevance
  if (categories.includes('session_current')) score += 25;
  else if (categories.includes('session_archived')) score -= 15;

  // Guides
  if (categories.includes('guide')) score += 20;

  // Archived/backup content
  if (categories.includes('backup')) score -= 20;

  return Math.min(100, Math.max(0, Math.round(score)));
}

// Score a single file
function scoreFile(file) {
  const categories = categorizeFile(file);

  const confidence = calculateConfidence(file, categories);
  const informative = calculateInformative(file, categories);
  const prescriptive_risk = calculatePrescriptiveRisk(file, categories);
  const relevance = calculateRelevance(file, categories);

  // Calculate weighted overall score
  const weighted_score = Math.round(
    (informative * 0.3) +
    (relevance * 0.3) +
    (confidence * 0.2) +
    ((100 - prescriptive_risk) * 0.2)  // Lower risk = higher score
  );

  // Classification
  let classification = 'standard';
  if (categories.includes('read-only-immutable') || categories.includes('read-only-zone')) {
    classification = 'read-only';
  } else if (categories.includes('root_config')) {
    classification = 'critical';
  } else if (categories.includes('core_config')) {
    classification = 'important';
  } else if (prescriptive_risk > 80) {
    classification = 'high-risk';
  } else if (weighted_score > 80) {
    classification = 'valuable';
  } else if (weighted_score < 40) {
    classification = 'low-priority';
  }

  return {
    path: file.path,
    full_path: file.full_path,
    category: file.category,
    size_bytes: file.size_bytes,
    scores: {
      informative_value: informative,
      prescriptive_risk: prescriptive_risk,
      confidence_score: confidence,
      relevance_score: relevance,
      weighted_overall: weighted_score,
    },
    categories: categories,
    classification: classification,
    flags: categories.filter(c => c.startsWith('read-only')),
  };
}

// Process all files
console.error(`Processing ${inventory.total_files} files...`);
const scored_files = inventory.inventory.map(scoreFile);

// Calculate summary statistics
const stats = {
  total_files: scored_files.length,
  classifications: {},
  average_scores: {
    informative_value: 0,
    prescriptive_risk: 0,
    confidence_score: 0,
    relevance_score: 0,
    weighted_overall: 0,
  },
  read_only_count: 0,
  high_risk_count: 0,
  critical_count: 0,
};

scored_files.forEach(file => {
  // Count classifications
  stats.classifications[file.classification] =
    (stats.classifications[file.classification] || 0) + 1;

  // Sum scores for averaging
  Object.keys(stats.average_scores).forEach(key => {
    stats.average_scores[key] += file.scores[key.replace('_', '_')];
  });

  // Count special categories
  if (file.classification === 'read-only') stats.read_only_count++;
  if (file.classification === 'high-risk') stats.high_risk_count++;
  if (file.classification === 'critical') stats.critical_count++;
});

// Calculate averages
Object.keys(stats.average_scores).forEach(key => {
  stats.average_scores[key] = Math.round(
    stats.average_scores[key] / scored_files.length
  );
});

// Sort by weighted score (descending)
const sorted_files = [...scored_files].sort(
  (a, b) => b.scores.weighted_overall - a.scores.weighted_overall
);

// Output results
const output = {
  generated: new Date().toISOString(),
  summary: stats,
  files: sorted_files,
  top_10_most_valuable: sorted_files.slice(0, 10).map(f => ({
    path: f.path,
    score: f.scores.weighted_overall,
    classification: f.classification,
  })),
  top_10_highest_risk: scored_files
    .sort((a, b) => b.scores.prescriptive_risk - a.scores.prescriptive_risk)
    .slice(0, 10)
    .map(f => ({
      path: f.path,
      risk: f.scores.prescriptive_risk,
      classification: f.classification,
    })),
  read_only_files: scored_files
    .filter(f => f.classification === 'read-only')
    .map(f => f.path),
};

console.log(JSON.stringify(output, null, 2));
console.error('✓ Scoring complete');
