#!/usr/bin/env node
/**
 * Captain's Log Integration System
 * Auto-journals decisions, insights, blockers to sessions/captains-log/YYYY-MM-DD.md
 *
 * Stock dependencies: claude-flow hooks, fs, path
 * Builds on: Phase 1 always-on-hooks.js, session-auto-init.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Entry categories for Captain's Log
 */
const CATEGORIES = {
  DECISION: 'decisions',
  INSIGHT: 'insights',
  BLOCKER: 'blockers',
  CORRECTION: 'corrections'
};

/**
 * Get today's log file path (time-neutral naming)
 */
function getLogPath() {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const logDir = path.join(process.cwd(), 'sessions', 'captains-log');
  fs.mkdirSync(logDir, { recursive: true });
  return path.join(logDir, `${today}.md`);
}

/**
 * Append entry to Captain's Log
 */
function logEntry(category, content, metadata = {}) {
  const logPath = getLogPath();
  const timestamp = new Date().toISOString();
  const sessionId = process.env.SESSION_ID || 'no-session';

  // Format entry
  const entry = `
## ${timestamp} - ${category}
**Session:** \`${sessionId}\`
${metadata.agent ? `**Agent:** ${metadata.agent}` : ''}
${metadata.file ? `**File:** \`${metadata.file}\`` : ''}

${content}

${metadata.artifactPath ? `**Artifacts:** \`${metadata.artifactPath}\`` : ''}
---
`;

  // Append to log file
  fs.appendFileSync(logPath, entry);

  return { logPath, timestamp };
}

/**
 * Log decision made during session
 */
function logDecision(decision, rationale, metadata = {}) {
  return logEntry(CATEGORIES.DECISION, `**Decision:** ${decision}\n\n**Rationale:** ${rationale}`, metadata);
}

/**
 * Log insight learned
 */
function logInsight(insight, context = '', metadata = {}) {
  const content = context ? `${insight}\n\n**Context:** ${context}` : insight;
  return logEntry(CATEGORIES.INSIGHT, content, metadata);
}

/**
 * Log blocker encountered
 */
function logBlocker(blocker, impact, metadata = {}) {
  return logEntry(CATEGORIES.BLOCKER, `**Issue:** ${blocker}\n\n**Impact:** ${impact}`, metadata);
}

/**
 * Log correction from learning system
 */
function logCorrection(original, corrected, outcome, metadata = {}) {
  const content = `**Original:** ${original}\n\n**Corrected:** ${corrected}\n\n**Outcome:** ${outcome}`;
  return logEntry(CATEGORIES.CORRECTION, content, metadata);
}

/**
 * Search Captain's Log by pattern
 */
function searchLog(pattern, daysBack = 7) {
  const logDir = path.join(process.cwd(), 'sessions', 'captains-log');
  if (!fs.existsSync(logDir)) return [];

  const results = [];
  const files = fs.readdirSync(logDir)
    .filter(f => f.endsWith('.md'))
    .sort()
    .reverse()
    .slice(0, daysBack);

  files.forEach(file => {
    const content = fs.readFileSync(path.join(logDir, file), 'utf-8');
    if (content.includes(pattern)) {
      results.push({ file, content });
    }
  });

  return results;
}

// Export functions
module.exports = {
  logEntry,
  logDecision,
  logInsight,
  logBlocker,
  logCorrection,
  searchLog,
  CATEGORIES
};

// CLI usage
if (require.main === module) {
  const [command, ...args] = process.argv.slice(2);

  switch (command) {
    case 'decision':
      const [decision, rationale] = args;
      logDecision(decision, rationale);
      console.log('✅ Decision logged to Captain\'s Log');
      break;

    case 'insight':
      logInsight(args.join(' '));
      console.log('✅ Insight logged to Captain\'s Log');
      break;

    case 'blocker':
      const [blocker, impact] = args;
      logBlocker(blocker, impact);
      console.log('✅ Blocker logged to Captain\'s Log');
      break;

    case 'search':
      const results = searchLog(args.join(' '));
      console.log(`Found ${results.length} matches:`);
      results.forEach(r => console.log(`  ${r.file}`));
      break;

    default:
      console.log('Usage:');
      console.log('  node captains-log.js decision "<decision>" "<rationale>"');
      console.log('  node captains-log.js insight "<insight>"');
      console.log('  node captains-log.js blocker "<blocker>" "<impact>"');
      console.log('  node captains-log.js search "<pattern>"');
  }
}
