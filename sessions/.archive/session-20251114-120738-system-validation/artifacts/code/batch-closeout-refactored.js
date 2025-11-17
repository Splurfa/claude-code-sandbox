#!/usr/bin/env node
/**
 * Refactored Batch Session Closeout
 *
 * FIXES: HITL approval stuck in background (Hive 3 investigation finding)
 *
 * PROBLEM: Original flow had nested approvals inside background execution:
 *   1. Approve batch (interactive)
 *   2. Start background archive
 *   3. Approve each Captain's Log entry (interactive) ← STUCK! No TTY in background
 *
 * SOLUTION: Move ALL approvals before background execution:
 *   1. Generate summaries (fast, synchronous)
 *   2. Show preview of ALL sessions
 *   3. Get HITL approval for batch + Captain's Log entries (interactive, upfront)
 *   4. Execute archive (can run in background now - no more prompts)
 *
 * Dependencies: session-closeout.js (stock), fs, path, readline
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ==============================================================================
// STOCK FUNCTIONS (from session-closeout.js)
// ==============================================================================
// Note: In production, these would be imported from session-closeout.js
// For this demonstration, they're included inline to show the complete flow

/**
 * Read session metadata
 */
function readSessionMetadata(sessionId) {
  const metadataPath = path.join(process.cwd(), 'sessions', sessionId, 'metadata.json');
  if (fs.existsSync(metadataPath)) {
    return JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
  }
  return { session_id: sessionId, status: 'unknown' };
}

/**
 * Update session metadata
 */
function updateSessionMetadata(sessionId, status) {
  const metadataPath = path.join(process.cwd(), 'sessions', sessionId, 'metadata.json');
  const metadata = readSessionMetadata(sessionId);
  metadata.status = status;
  metadata.updated_at = new Date().toISOString();
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
}

/**
 * Generate session summary
 */
function generateSessionSummary(sessionId) {
  const summaryPath = path.join(process.cwd(), 'sessions', sessionId, 'session-summary.md');
  if (fs.existsSync(summaryPath)) {
    return fs.readFileSync(summaryPath, 'utf-8');
  }
  return `# ${sessionId}\n\nNo summary available.`;
}

/**
 * Archive session to .swarm/backups/
 */
function archiveSession(sessionId, summary) {
  const backupDir = path.join(process.cwd(), '.swarm', 'backups');
  fs.mkdirSync(backupDir, { recursive: true });

  const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
  const backupPath = path.join(backupDir, `${sessionId}-${timestamp}.json`);

  const metadata = readSessionMetadata(sessionId);
  const archive = {
    session_id: sessionId,
    archived_at: new Date().toISOString(),
    summary,
    metadata
  };

  fs.writeFileSync(backupPath, JSON.stringify(archive, null, 2));
  return backupPath;
}

/**
 * Run session-end hooks
 */
function runSessionEndHooks(sessionId) {
  // In production, this would call claude-flow hooks
  // For demo, we just log
  console.log(`  🪝 Running hooks for ${sessionId}...`);
}

/**
 * Cleanup session directory
 */
function cleanupSessionDirectory(sessionId, backupPath) {
  // In production, this might remove the session directory
  // For demo, we just log
  console.log(`  🧹 Cleanup ${sessionId} (archived to ${path.basename(backupPath)})`);
}

/**
 * Generate Captain's Log draft
 */
function generateCaptainsLogDraft(sessionId, summary, backupPath) {
  const date = new Date().toISOString().split('T')[0];
  const shortSummary = summary.split('\n').slice(0, 5).join('\n');

  return `## ${sessionId}
**Date:** ${date}
**Archive:** ${path.basename(backupPath)}

${shortSummary}

**Tags:** #session-closeout #automated`;
}

/**
 * Write to Captain's Log
 */
function writeToCaptainsLog(entry, sessionId, backupPath) {
  const logDir = path.join(process.cwd(), 'sessions', 'captains-log');
  fs.mkdirSync(logDir, { recursive: true });

  const date = new Date().toISOString().split('T')[0];
  const logPath = path.join(logDir, `${date}.md`);

  const header = fs.existsSync(logPath)
    ? ''
    : `# Captain's Log - ${date}\n\n`;

  fs.appendFileSync(logPath, `${header}${entry}\n\n---\n\n`);
  console.log(`  📝 Captain's Log: ${logPath}`);
}

/**
 * Get user approval with a prompt
 * @param {string} question - Question to ask
 * @returns {Promise<boolean>} - User's approval
 */
async function promptUser(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer.toLowerCase() === 'y');
    });
  });
}

/**
 * Get user input for editing text
 * @param {string} prompt - Prompt message
 * @param {string} defaultValue - Default text
 * @returns {Promise<string>} - User's input
 */
async function promptForEdit(prompt, defaultValue) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    console.log(prompt);
    console.log('\nDefault text:');
    console.log('-'.repeat(60));
    console.log(defaultValue);
    console.log('-'.repeat(60));

    rl.question('\nEdit? (y/n/skip): ', answer => {
      const choice = answer.toLowerCase();

      if (choice === 'skip') {
        rl.close();
        resolve(null); // Skip this entry
      } else if (choice === 'n') {
        rl.close();
        resolve(defaultValue); // Use default
      } else {
        // For 'y', we'd need a more sophisticated editor
        // For now, just accept default (can enhance later with temp file editing)
        console.log('Note: Inline editing not implemented. Using default text.');
        rl.close();
        resolve(defaultValue);
      }
    });
  });
}

/**
 * Batch closeout with FIXED HITL flow
 *
 * Key Change: ALL approvals happen BEFORE background execution
 *
 * @param {string[]} sessionIds - Array of session IDs to close out
 * @param {object} options - Options
 * @returns {Promise<object>} - Results
 */
async function batchCloseout(sessionIds, options = {}) {
  if (!Array.isArray(sessionIds) || sessionIds.length === 0) {
    throw new Error('Session IDs array required');
  }

  console.log(`\n🔚 Batch Session Closeout (REFACTORED): ${sessionIds.length} sessions\n`);

  // ===================================================================
  // PHASE 1: GENERATE SUMMARIES (Fast, synchronous, no interaction)
  // ===================================================================

  console.log('📊 Phase 1: Generating summaries...');
  const validSessions = [];
  const invalidSessions = [];

  // Validate sessions first
  sessionIds.forEach(sessionId => {
    const sessionPath = path.join(process.cwd(), 'sessions', sessionId);
    if (fs.existsSync(sessionPath)) {
      validSessions.push(sessionId);
    } else {
      invalidSessions.push(sessionId);
    }
  });

  if (invalidSessions.length > 0) {
    console.warn(`⚠️  Invalid sessions (skipped): ${invalidSessions.join(', ')}`);
  }

  if (validSessions.length === 0) {
    throw new Error('No valid sessions to close out');
  }

  // Generate summaries in parallel
  const summaries = await Promise.allSettled(
    validSessions.map(async sessionId => {
      try {
        const summary = generateSessionSummary(sessionId);
        const metadata = readSessionMetadata(sessionId);
        return {
          sessionId,
          summary,
          metadata,
          status: 'success'
        };
      } catch (error) {
        return {
          sessionId,
          error: error.message,
          status: 'failed'
        };
      }
    })
  );

  const successfulSessions = summaries
    .filter(result => result.status === 'fulfilled' && result.value.status === 'success')
    .map(result => result.value);

  // ===================================================================
  // PHASE 2: SHOW PREVIEW (No interaction yet, just display)
  // ===================================================================

  console.log('\n📋 Phase 2: Preview');
  console.log('='.repeat(70));
  console.log('BATCH CLOSEOUT PREVIEW');
  console.log('='.repeat(70) + '\n');

  successfulSessions.forEach((session, index) => {
    console.log(`\n[${index + 1}] ${session.sessionId}`);
    console.log('-'.repeat(70));
    console.log(session.summary.substring(0, 300) + '...');
  });

  console.log('\n' + '='.repeat(70) + '\n');

  // ===================================================================
  // PHASE 3: GET HITL APPROVAL (All interactive work happens HERE)
  // ===================================================================

  console.log('✋ Phase 3: Human-in-the-loop approval');

  // 3A: Approve batch closeout
  const batchApproved = await promptUser(
    `\nApprove batch closeout for ${successfulSessions.length} sessions? (y/n): `
  );

  if (!batchApproved) {
    console.log('❌ Batch closeout cancelled by user');
    return { status: 'cancelled', reason: 'User declined batch approval' };
  }

  // 3B: Generate Captain's Log drafts for ALL sessions
  console.log('\n📝 Generating Captain\'s Log drafts...');
  const captainsLogEntries = [];

  for (const session of successfulSessions) {
    // We don't have backupPath yet, but we can generate draft
    const draft = generateCaptainsLogDraft(
      session.sessionId,
      session.summary,
      `(will be created at .swarm/backups/${session.sessionId}-*.json)`
    );

    captainsLogEntries.push({
      sessionId: session.sessionId,
      draft
    });
  }

  // 3C: Review and approve Captain's Log entries (ALL at once)
  console.log('\n📝 Captain\'s Log Approval');
  console.log('='.repeat(70));

  const approvedEntries = [];

  for (const entry of captainsLogEntries) {
    console.log(`\n[Captain's Log] ${entry.sessionId}`);
    console.log('-'.repeat(70));

    const editedEntry = await promptForEdit(
      'Preview Captain\'s Log entry:',
      entry.draft
    );

    if (editedEntry !== null) {
      approvedEntries.push({
        sessionId: entry.sessionId,
        entry: editedEntry
      });
      console.log(`✅ Approved for Captain's Log`);
    } else {
      console.log(`⏭️  Skipped`);
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log(`✅ Approved: ${approvedEntries.length}/${successfulSessions.length} sessions\n`);

  // ===================================================================
  // PHASE 4: EXECUTE ARCHIVE (No more prompts - can run in background)
  // ===================================================================

  console.log('📦 Phase 4: Executing archive (non-interactive)...');

  const results = [];

  for (const session of successfulSessions) {
    try {
      // Archive session
      const backupPath = archiveSession(session.sessionId, session.summary);

      // Run session-end hooks
      runSessionEndHooks(session.sessionId);

      // Update metadata
      updateSessionMetadata(session.sessionId, 'closed');

      // Cleanup session directory after successful archive
      cleanupSessionDirectory(session.sessionId, backupPath);

      // Write to Captain's Log (if approved)
      const approvedEntry = approvedEntries.find(e => e.sessionId === session.sessionId);
      if (approvedEntry) {
        writeToCaptainsLog(approvedEntry.entry, session.sessionId, backupPath);
        console.log(`✅ ${session.sessionId} → ${path.basename(backupPath)} + Captain's Log`);
      } else {
        console.log(`✅ ${session.sessionId} → ${path.basename(backupPath)} (no log entry)`);
      }

      results.push({
        sessionId: session.sessionId,
        status: 'archived',
        backupPath,
        captainsLog: !!approvedEntry
      });

    } catch (error) {
      results.push({
        sessionId: session.sessionId,
        status: 'error',
        error: error.message
      });
      console.error(`❌ ${session.sessionId}: ${error.message}`);
    }
  }

  const archivedCount = results.filter(r => r.status === 'archived').length;
  console.log(`\n✅ Batch closeout complete: ${archivedCount}/${successfulSessions.length} archived`);

  return {
    status: 'completed',
    totalSessions: sessionIds.length,
    validSessions: validSessions.length,
    successfulSummaries: successfulSessions.length,
    archived: archivedCount,
    captainsLogEntries: approvedEntries.length,
    results,
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  batchCloseout,
  promptUser,
  promptForEdit
};

// CLI usage
if (require.main === module) {
  const sessionIds = process.argv.slice(2);

  if (sessionIds.length === 0) {
    console.error('Usage: node batch-closeout-refactored.js <session-id-1> <session-id-2> ...');
    console.error('\nExample:');
    console.error('  node batch-closeout-refactored.js session-20251113-150000 session-20251114-120738');
    process.exit(1);
  }

  batchCloseout(sessionIds).then(result => {
    console.log('\n' + '='.repeat(70));
    console.log('BATCH CLOSEOUT RESULT');
    console.log('='.repeat(70));
    console.log(`Status: ${result.status}`);
    console.log(`Archived: ${result.archived}/${result.totalSessions}`);
    console.log(`Captain's Log Entries: ${result.captainsLogEntries}`);
    console.log('='.repeat(70) + '\n');

    process.exit(result.status === 'completed' ? 0 : 1);
  }).catch(error => {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  });
}
