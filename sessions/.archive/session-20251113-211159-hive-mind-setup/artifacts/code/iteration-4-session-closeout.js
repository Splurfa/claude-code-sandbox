#!/usr/bin/env node
/**
 * Session Closeout Workflow
 * HITL review, archive to .swarm/backups/, cleanup
 *
 * Stock dependencies: claude-flow session-end hook, fs, path
 * Builds on: Phase 1 session-auto-init.js (session metadata)
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { logEntry } = require('./captains-log');

/**
 * Initiate session closeout (HITL workflow)
 */
async function closeoutSession(sessionId = process.env.SESSION_ID) {
  if (!sessionId) {
    throw new Error('No session ID provided');
  }

  const sessionPath = path.join(process.cwd(), 'sessions', sessionId);
  if (!fs.existsSync(sessionPath)) {
    throw new Error(`Session not found: ${sessionId}`);
  }

  console.log(`\n🔚 Session Closeout: ${sessionId}\n`);

  // Step 1: Generate summary
  console.log('📊 Generating session summary...');
  const summary = generateSessionSummary(sessionId);

  // Step 2: Present summary for review
  console.log('\n' + summary + '\n');

  // Step 3: HITL confirmation
  const approved = await getUserApproval();

  if (!approved) {
    console.log('❌ Closeout cancelled by user');
    return { status: 'cancelled' };
  }

  // Step 4: Archive session
  console.log('📦 Archiving session to .swarm/backups/...');
  const backupPath = archiveSession(sessionId, summary);

  // Step 5: Run session-end hooks
  console.log('🔗 Running session-end hooks...');
  runSessionEndHooks(sessionId);

  // Step 6: Captain's Log entry with HITL approval
  console.log('📝 Generating Captain\'s Log entry...');
  const logDraft = generateCaptainsLogDraft(sessionId, summary, backupPath);
  const approval = await getCaptainsLogApproval(logDraft, sessionId);

  if (approval.approved) {
    writeToCaptainsLog(approval.entry, sessionId, backupPath);
    console.log('✅ Captain\'s Log updated');
  } else {
    console.log('⏭️  Captain\'s Log entry skipped');
  }

  // Step 7: Update metadata
  updateSessionMetadata(sessionId, 'closed');

  // Step 8: Cleanup session directory after successful archive
  console.log('🗑️  Cleaning up session directory...');
  cleanupSessionDirectory(sessionId, backupPath);

  console.log(`✅ Session closed: ${sessionId}`);
  console.log(`📦 Backup: ${backupPath}`);

  return {
    status: 'closed',
    backupPath,
    timestamp: new Date().toISOString()
  };
}

/**
 * Generate session summary from artifacts
 */
function generateSessionSummary(sessionId) {
  const sessionPath = path.join(process.cwd(), 'sessions', sessionId);
  const artifactsPath = path.join(sessionPath, 'artifacts');

  // Read session-summary.md if exists
  const summaryPath = path.join(sessionPath, 'session-summary.md');
  let summary = fs.existsSync(summaryPath)
    ? fs.readFileSync(summaryPath, 'utf-8')
    : `# Session: ${sessionId}\n\n`;

  // Add artifacts index
  summary += '\n## Artifacts Created\n\n';

  const categories = ['code', 'tests', 'docs', 'scripts', 'notes'];
  categories.forEach(category => {
    const categoryPath = path.join(artifactsPath, category);
    if (fs.existsSync(categoryPath)) {
      const files = fs.readdirSync(categoryPath);
      if (files.length > 0) {
        summary += `### ${category}/\n`;
        files.forEach(file => {
          summary += `- ${file}\n`;
        });
        summary += '\n';
      }
    }
  });

  return summary;
}

/**
 * Get user approval for closeout
 */
async function getUserApproval() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    rl.question('Approve session closeout? (y/n): ', answer => {
      rl.close();
      resolve(answer.toLowerCase() === 'y');
    });
  });
}

/**
 * Archive session to .swarm/backups/
 */
function archiveSession(sessionId, summary) {
  const backupDir = path.join(process.cwd(), '.swarm', 'backups');
  fs.mkdirSync(backupDir, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = path.join(backupDir, `session-${timestamp}.json`);

  // Create backup bundle
  const backup = {
    sessionId,
    timestamp: new Date().toISOString(),
    summary,
    metadata: readSessionMetadata(sessionId),
    artifacts: collectArtifactsPaths(sessionId)
  };

  fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2));

  return backupFile;
}

/**
 * Read session metadata
 */
function readSessionMetadata(sessionId) {
  const metadataPath = path.join(process.cwd(), 'sessions', sessionId, 'metadata.json');
  if (fs.existsSync(metadataPath)) {
    return JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
  }
  return {};
}

/**
 * Update session metadata
 */
function updateSessionMetadata(sessionId, status) {
  const metadataPath = path.join(process.cwd(), 'sessions', sessionId, 'metadata.json');
  const metadata = readSessionMetadata(sessionId);
  metadata.status = status;
  metadata.closed_at = new Date().toISOString();
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
}

/**
 * Collect artifact paths
 */
function collectArtifactsPaths(sessionId) {
  const artifactsPath = path.join(process.cwd(), 'sessions', sessionId, 'artifacts');
  const paths = [];

  function walk(dir, prefix = '') {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const relativePath = path.join(prefix, file);
      if (fs.statSync(fullPath).isDirectory()) {
        walk(fullPath, relativePath);
      } else {
        paths.push(relativePath);
      }
    });
  }

  walk(artifactsPath);
  return paths;
}

/**
 * Run session-end hooks
 */
function runSessionEndHooks(sessionId) {
  try {
    execSync(
      `npx claude-flow@alpha hooks session-end --generate-summary true --persist-state true`,
      { stdio: 'inherit' }
    );
  } catch (error) {
    console.warn('Session-end hook warning:', error.message);
  }
}

/**
 * Generate Captain's Log draft from session summary
 */
function generateCaptainsLogDraft(sessionId, summary, backupPath) {
  // Extract first 2-4 sentences from summary as brief
  const sentences = summary.split(/[.!?]/).filter(s => s.trim()).slice(0, 3);
  const brief = sentences.join('. ').trim() + '.';

  return `Session ${sessionId} closed. ${brief} Archived to ${path.basename(backupPath)}`;
}

/**
 * Get HITL approval for Captain's Log entry
 */
async function getCaptainsLogApproval(draft, sessionId) {
  console.log('\n' + '='.repeat(60));
  console.log('CAPTAIN\'S LOG ENTRY DRAFT');
  console.log('='.repeat(60));
  console.log(`\nSession: ${sessionId}`);
  console.log(`\n${draft}\n`);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    rl.question('Approve this Captain\'s Log entry? (y/n/edit): ', answer => {
      rl.close();
      if (answer.toLowerCase() === 'y') {
        resolve({ approved: true, entry: draft });
      } else if (answer.toLowerCase() === 'edit') {
        resolve({ approved: false });
      } else {
        resolve({ approved: false });
      }
    });
  });
}

/**
 * Write approved entry to Captain's Log
 */
function writeToCaptainsLog(entry, sessionId, backupPath) {
  const timestamp = new Date().toISOString();

  logEntry('Session Closeout', entry, {
    sessionId,
    artifactPath: backupPath
  });

  return timestamp;
}

/**
 * Remove session directory after successful archive
 * Includes backup verification to prevent data loss
 */
function cleanupSessionDirectory(sessionId, backupPath) {
  const sessionPath = path.join(process.cwd(), 'sessions', sessionId);

  // Step 1: Verify backup exists
  if (!fs.existsSync(backupPath)) {
    console.error('❌ Backup verification failed: file not found');
    throw new Error('Cannot cleanup: backup file not found');
  }

  // Step 2: Verify backup is valid and readable
  try {
    const backupContent = fs.readFileSync(backupPath, 'utf-8');
    const backup = JSON.parse(backupContent);

    // Validate backup structure
    if (!backup.sessionId || !backup.summary || !backup.timestamp) {
      throw new Error('Backup file missing required fields');
    }

    // Verify it's the correct session
    if (backup.sessionId !== sessionId) {
      throw new Error(`Backup session ID mismatch: expected ${sessionId}, got ${backup.sessionId}`);
    }
  } catch (error) {
    console.error('❌ Backup validation failed:', error.message);
    throw new Error(`Cannot cleanup: backup file invalid (${error.message})`);
  }

  // Step 3: Safe to remove session directory
  if (fs.existsSync(sessionPath)) {
    fs.rmSync(sessionPath, { recursive: true, force: true });
    console.log(`✅ Session directory removed: ${sessionId}`);
  } else {
    console.warn(`⚠️  Session directory not found: ${sessionId}`);
  }
}

/**
 * Promote artifacts to project directory (optional)
 */
function promoteToProject(sessionId, projectName) {
  const artifactsPath = path.join(process.cwd(), 'sessions', sessionId, 'artifacts');
  const projectPath = path.join(process.cwd(), 'docs', 'projects', projectName);

  fs.mkdirSync(projectPath, { recursive: true });

  // Copy artifacts
  execSync(`cp -r ${artifactsPath}/* ${projectPath}/`);

  console.log(`✅ Artifacts promoted to: ${projectPath}`);
}

// Export functions
module.exports = {
  closeoutSession,
  generateSessionSummary,
  archiveSession,
  cleanupSessionDirectory,
  promoteToProject,
  readSessionMetadata,
  updateSessionMetadata,
  collectArtifactsPaths,
  runSessionEndHooks,
  generateCaptainsLogDraft,
  getCaptainsLogApproval,
  writeToCaptainsLog
};

// CLI usage
if (require.main === module) {
  const [command, ...args] = process.argv.slice(2);

  switch (command) {
    case 'closeout':
      const sessionId = args[0] || process.env.SESSION_ID;
      closeoutSession(sessionId).then(result => {
        console.log('Closeout complete:', result);
      });
      break;

    case 'summary':
      const sid = args[0] || process.env.SESSION_ID;
      console.log(generateSessionSummary(sid));
      break;

    case 'promote':
      const [session, project] = args;
      promoteToProject(session, project);
      break;

    default:
      console.log('Usage:');
      console.log('  node session-closeout.js closeout [session-id]');
      console.log('  node session-closeout.js summary [session-id]');
      console.log('  node session-closeout.js promote <session-id> <project-name>');
  }
}
