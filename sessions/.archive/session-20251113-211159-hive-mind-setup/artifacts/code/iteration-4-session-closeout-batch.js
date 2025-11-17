#!/usr/bin/env node
/**
 * Batch Session Closeout
 * Wraps session-closeout.js for multiple sessions
 *
 * Stock dependencies: session-closeout.js, fs, path
 */

const {
  generateSessionSummary,
  archiveSession,
  cleanupSessionDirectory,
  readSessionMetadata,
  updateSessionMetadata,
  runSessionEndHooks,
  generateCaptainsLogDraft,
  getCaptainsLogApproval,
  writeToCaptainsLog
} = require('./session-closeout');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

/**
 * Close out multiple sessions with consolidated HITL review
 */
async function closeoutMultiple(sessionIds, options = {}) {
  if (!Array.isArray(sessionIds) || sessionIds.length === 0) {
    throw new Error('Session IDs array required');
  }

  console.log(`\n🔚 Batch Session Closeout: ${sessionIds.length} sessions\n`);

  // Step 1: Validate all session IDs
  const validSessions = [];
  const invalidSessions = [];

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

  // Step 2: Generate summaries in parallel
  console.log('📊 Generating summaries...');
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

  // Step 3: Create consolidated review
  const consolidated = {
    totalSessions: validSessions.length,
    timestamp: new Date().toISOString(),
    sessions: summaries.map(result =>
      result.status === 'fulfilled' ? result.value : result.reason
    )
  };

  // Step 4: Present for approval
  console.log('\n' + '='.repeat(60));
  console.log('BATCH CLOSEOUT REVIEW');
  console.log('='.repeat(60) + '\n');

  consolidated.sessions.forEach((session, index) => {
    if (session.status === 'success') {
      console.log(`\n[${index + 1}] ${session.sessionId}`);
      console.log('-'.repeat(60));
      console.log(session.summary.substring(0, 300) + '...');
    } else {
      console.log(`\n[${index + 1}] ${session.sessionId} - FAILED`);
      console.log(`Error: ${session.error}`);
    }
  });

  console.log('\n' + '='.repeat(60) + '\n');

  return consolidated;
}

/**
 * Execute batch archive after user approval
 */
async function executeBatchArchive(consolidated) {
  if (!consolidated || !consolidated.sessions) {
    throw new Error('Invalid consolidated data');
  }

  console.log('📦 Archiving sessions to .swarm/backups/...');

  const results = [];

  for (const session of consolidated.sessions) {
    if (session.status !== 'success') {
      results.push({
        sessionId: session.sessionId,
        status: 'skipped',
        reason: 'Failed during summary generation'
      });
      continue;
    }

    try {
      // Archive session
      const backupPath = archiveSession(session.sessionId, session.summary);

      // Run session-end hooks
      runSessionEndHooks(session.sessionId);

      // Update metadata
      updateSessionMetadata(session.sessionId, 'closed');

      // Cleanup session directory after successful archive
      cleanupSessionDirectory(session.sessionId, backupPath);

      results.push({
        sessionId: session.sessionId,
        status: 'archived',
        backupPath
      });

      console.log(`✅ ${session.sessionId} → ${path.basename(backupPath)}`);
    } catch (error) {
      results.push({
        sessionId: session.sessionId,
        status: 'error',
        error: error.message
      });
      console.error(`❌ ${session.sessionId}: ${error.message}`);
    }
  }

  // Captain's Log entries for all successful archives
  console.log('\n📝 Generating Captain\'s Log entries...\n');

  for (const session of consolidated.sessions) {
    if (session.status !== 'success') continue;

    const result = results.find(r => r.sessionId === session.sessionId);
    if (!result || result.status !== 'archived') continue;

    // Generate draft
    const draft = generateCaptainsLogDraft(
      session.sessionId,
      session.summary,
      result.backupPath
    );

    // Get HITL approval
    const approval = await getCaptainsLogApproval(draft, session.sessionId);

    if (approval.approved) {
      writeToCaptainsLog(approval.entry, session.sessionId, result.backupPath);
      console.log(`✅ Captain's Log: ${session.sessionId}`);
    } else {
      console.log(`⏭️  Skipped: ${session.sessionId}`);
    }
  }

  console.log(`\n✅ Batch closeout complete: ${results.filter(r => r.status === 'archived').length}/${consolidated.totalSessions} archived`);

  return results;
}

/**
 * Get user approval for batch closeout
 */
async function getUserApproval() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    rl.question('Approve batch closeout? (y/n): ', answer => {
      rl.close();
      resolve(answer.toLowerCase() === 'y');
    });
  });
}

/**
 * Full batch closeout workflow with HITL
 */
async function batchCloseoutWorkflow(sessionIds, options = {}) {
  const consolidated = await closeoutMultiple(sessionIds, options);

  const approved = await getUserApproval();

  if (!approved) {
    console.log('❌ Batch closeout cancelled by user');
    return { status: 'cancelled' };
  }

  const results = await executeBatchArchive(consolidated);

  return {
    status: 'completed',
    results,
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  closeoutMultiple,
  executeBatchArchive,
  batchCloseoutWorkflow
};

// CLI usage
if (require.main === module) {
  const sessionIds = process.argv.slice(2);

  if (sessionIds.length === 0) {
    console.error('Usage: node session-closeout-batch.js <session-id-1> <session-id-2> ...');
    process.exit(1);
  }

  batchCloseoutWorkflow(sessionIds).then(result => {
    console.log('\nBatch closeout result:', result.status);
    process.exit(result.status === 'completed' ? 0 : 1);
  }).catch(error => {
    console.error('Error:', error.message);
    process.exit(1);
  });
}
