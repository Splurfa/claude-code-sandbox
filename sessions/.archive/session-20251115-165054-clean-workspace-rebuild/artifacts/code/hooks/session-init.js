#!/usr/bin/env node
/**
 * Session Initialization Hook
 * Auto-creates session directory on first message
 */

const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

// Configuration
const CONFIG = {
  sessionsDir: process.env.SESSIONS_DIR || 'sessions',
  claudeFlowVersion: process.env.CLAUDE_FLOW_VERSION || 'alpha'
};

/**
 * Generate session ID
 */
function generateSessionId(topic = 'development') {
  const timestamp = new Date().toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d+Z$/, '')
    .replace('T', '-')
    .slice(0, 15);

  const slug = topic
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 30);

  return `session-${timestamp}-${slug}`;
}

/**
 * Create session directory structure
 */
async function createSessionDirectory(sessionId) {
  const sessionDir = path.join(CONFIG.sessionsDir, sessionId);

  // Create directory structure
  const dirs = [
    sessionDir,
    path.join(sessionDir, 'artifacts'),
    path.join(sessionDir, 'artifacts/code'),
    path.join(sessionDir, 'artifacts/tests'),
    path.join(sessionDir, 'artifacts/docs'),
    path.join(sessionDir, 'artifacts/scripts'),
    path.join(sessionDir, 'artifacts/notes')
  ];

  for (const dir of dirs) {
    await fs.mkdir(dir, { recursive: true });
  }

  return sessionDir;
}

/**
 * Create session metadata
 */
async function createMetadata(sessionDir, sessionId, topic) {
  const metadata = {
    id: sessionId,
    created: new Date().toISOString(),
    topic: topic,
    status: 'active',
    artifacts: {
      code: [],
      tests: [],
      docs: [],
      scripts: [],
      notes: []
    }
  };

  const metadataPath = path.join(sessionDir, 'metadata.json');
  await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));

  return metadataPath;
}

/**
 * Create session summary
 */
async function createSummary(sessionDir, topic) {
  const summary = `# Session Summary: ${topic}

## Overview

Auto-generated session directory.

## Directory Structure

- \`artifacts/code/\` - Source code
- \`artifacts/tests/\` - Test files
- \`artifacts/docs/\` - Documentation
- \`artifacts/scripts/\` - Utility scripts
- \`artifacts/notes/\` - Session notes

## Session Lifecycle

1. **Created**: ${new Date().toISOString()}
2. **Status**: Active
3. **Artifacts**: See artifacts/ directory

## Work Log

[Add entries as work progresses]

## Completion

[To be filled at session end]
`;

  const summaryPath = path.join(sessionDir, 'session-summary.md');
  await fs.writeFile(summaryPath, summary);

  return summaryPath;
}

/**
 * Register session with stock hooks
 */
async function registerSession(sessionId) {
  try {
    // Use stock pre-task hook
    await execAsync(
      `npx claude-flow@${CONFIG.claudeFlowVersion} hooks pre-task ` +
      `--description "Session: ${sessionId}" ` +
      `--task-id "${sessionId}"`
    );

    console.log(`[SESSION-INIT] Registered with stock hooks: ${sessionId}`);
  } catch (error) {
    console.warn(`[SESSION-INIT] Hook registration failed: ${error.message}`);
  }
}

/**
 * Main initialization function
 */
async function initializeSession(topic = 'development') {
  try {
    console.log('[SESSION-INIT] Starting session initialization...');

    // Generate session ID
    const sessionId = generateSessionId(topic);
    console.log(`[SESSION-INIT] Session ID: ${sessionId}`);

    // Create directory structure
    const sessionDir = await createSessionDirectory(sessionId);
    console.log(`[SESSION-INIT] Created directory: ${sessionDir}`);

    // Create metadata
    await createMetadata(sessionDir, sessionId, topic);
    console.log('[SESSION-INIT] Created metadata.json');

    // Create summary
    await createSummary(sessionDir, topic);
    console.log('[SESSION-INIT] Created session-summary.md');

    // Register with stock hooks
    await registerSession(sessionId);

    console.log('[SESSION-INIT] Session initialized successfully!');
    console.log(`[SESSION-INIT] Directory: ${sessionDir}`);

    // Output session ID for consumption
    return {
      sessionId,
      sessionDir,
      created: new Date().toISOString(),
      status: 'active'
    };
  } catch (error) {
    console.error(`[SESSION-INIT] Initialization failed: ${error.message}`);
    throw error;
  }
}

// CLI interface
if (require.main === module) {
  const topic = process.argv[2] || 'development';

  initializeSession(topic)
    .then(result => {
      console.log('\n' + JSON.stringify(result, null, 2));
      process.exit(0);
    })
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = {
  initializeSession,
  generateSessionId,
  createSessionDirectory
};
