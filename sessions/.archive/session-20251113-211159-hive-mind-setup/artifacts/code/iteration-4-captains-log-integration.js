#!/usr/bin/env node
/**
 * Captain's Log Integration Module
 * Provides functions for writing session closeout entries to Captain's Log
 *
 * Time-neutral, non-destructive append-only logging
 * Stock dependencies: fs, path
 */

const fs = require('fs');
const path = require('path');

/**
 * Get path to today's Captain's Log file
 * Creates directory if needed
 */
function getCaptainsLogPath() {
  const logsDir = path.join(process.cwd(), 'sessions', 'captains-log');
  fs.mkdirSync(logsDir, { recursive: true });

  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  return path.join(logsDir, `${today}.md`);
}

/**
 * Format a log entry with proper markdown structure
 */
function formatLogEntry(timestamp, summary, sessionId, archivePath) {
  const isoTimestamp = timestamp.toISOString();

  // Truncate summary if too long (keep it readable)
  let truncatedSummary = summary;
  if (summary.length > 1000) {
    truncatedSummary = summary.substring(0, 1000) + '...';
  }

  return `
## ${isoTimestamp}
**Session Closeout**

**Session:** \`${sessionId}\`
**Archive:** \`${archivePath}\`

${truncatedSummary}

---
`;
}

/**
 * Generate Captain's Log draft for HITL review
 */
function generateCaptainsLogDraft(sessionId, summary, archivePath) {
  const timestamp = new Date();

  const draft = `
====================================================================
CAPTAIN'S LOG ENTRY DRAFT
====================================================================

Timestamp: ${timestamp.toISOString()}
Session: ${sessionId}
Archived to: ${archivePath}

Summary:
--------
${summary.length > 1000 ? summary.substring(0, 1000) + '...' : summary}

====================================================================
This entry will be written to: sessions/captains-log/${timestamp.toISOString().slice(0, 10)}.md
====================================================================
`;

  return draft;
}

/**
 * Write entry to Captain's Log (append-only)
 * Only called after HITL approval
 */
function writeToCaptainsLog(summary, sessionId, archivePath) {
  const logPath = getCaptainsLogPath();
  const timestamp = new Date();

  const entry = formatLogEntry(timestamp, summary, sessionId, archivePath);

  // Append to log file (create if not exists)
  fs.appendFileSync(logPath, entry, 'utf-8');

  console.log(`📝 Captain's Log updated: ${logPath}`);

  return logPath;
}

/**
 * Read today's Captain's Log
 */
function readCaptainsLog() {
  const logPath = getCaptainsLogPath();

  if (!fs.existsSync(logPath)) {
    return null;
  }

  return fs.readFileSync(logPath, 'utf-8');
}

/**
 * Batch write multiple entries to Captain's Log
 * Used during batch closeout
 */
function writeBatchToCaptainsLog(entries) {
  const logPath = getCaptainsLogPath();

  const formattedEntries = entries.map(entry => {
    const timestamp = new Date();
    return formatLogEntry(
      timestamp,
      entry.summary,
      entry.sessionId,
      entry.archivePath
    );
  });

  // Append all entries at once
  const batchContent = formattedEntries.join('');
  fs.appendFileSync(logPath, batchContent, 'utf-8');

  console.log(`📝 Captain's Log updated with ${entries.length} entries: ${logPath}`);

  return {
    logPath,
    entriesWritten: entries.length,
    timestamp: new Date().toISOString()
  };
}

/**
 * Generate batch draft for HITL review
 */
function generateBatchDraft(entries) {
  const timestamp = new Date();
  const logDate = timestamp.toISOString().slice(0, 10);

  let draft = `
====================================================================
CAPTAIN'S LOG BATCH ENTRY DRAFT
====================================================================

Date: ${timestamp.toISOString()}
Sessions: ${entries.length}
Target log: sessions/captains-log/${logDate}.md

`;

  entries.forEach((entry, index) => {
    draft += `
[${index + 1}] ${entry.sessionId}
${'-'.repeat(60)}
Archive: ${entry.archivePath}

${entry.summary.substring(0, 200)}${entry.summary.length > 200 ? '...' : ''}

`;
  });

  draft += `
====================================================================
All ${entries.length} entries will be appended to the Captain's Log
====================================================================
`;

  return draft;
}

module.exports = {
  getCaptainsLogPath,
  formatLogEntry,
  generateCaptainsLogDraft,
  writeToCaptainsLog,
  readCaptainsLog,
  writeBatchToCaptainsLog,
  generateBatchDraft
};

// CLI usage
if (require.main === module) {
  const [command, ...args] = process.argv.slice(2);

  switch (command) {
    case 'write':
      const [sessionId, summary, archivePath] = args;
      if (!sessionId || !summary || !archivePath) {
        console.error('Usage: node captains-log-integration.js write <session-id> <summary> <archive-path>');
        process.exit(1);
      }
      writeToCaptainsLog(summary, sessionId, archivePath);
      break;

    case 'read':
      const log = readCaptainsLog();
      if (log) {
        console.log(log);
      } else {
        console.log('No log for today');
      }
      break;

    case 'path':
      console.log(getCaptainsLogPath());
      break;

    default:
      console.log('Usage:');
      console.log('  node captains-log-integration.js write <session-id> <summary> <archive-path>');
      console.log('  node captains-log-integration.js read');
      console.log('  node captains-log-integration.js path');
  }
}
