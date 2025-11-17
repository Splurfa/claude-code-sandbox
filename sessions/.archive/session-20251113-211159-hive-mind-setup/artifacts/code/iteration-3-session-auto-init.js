#!/usr/bin/env node
/**
 * Session Auto-Initialization System
 * Detects new chat threads and auto-creates session structure
 *
 * Stock dependencies: claude-flow hooks, fs, path
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Check if we're in a new chat (no active session)
 */
function isNewChat() {
  const sessionEnv = process.env.SESSION_ID;
  if (sessionEnv && fs.existsSync(`sessions/${sessionEnv}`)) {
    return false; // Active session exists
  }
  return true;
}

/**
 * Infer topic from user message (2-3 words, lowercase-hyphenated)
 */
function inferTopic(message) {
  const words = message
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 3)
    .slice(0, 3);
  return words.join('-') || 'general';
}

/**
 * Generate session ID: session-YYYYMMDD-HHMMSS-topic
 */
function generateSessionId(topic) {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  const time = now.toTimeString().slice(0, 8).replace(/:/g, '');
  return `session-${date}-${time}-${topic}`;
}

/**
 * Create session structure with artifacts directories
 */
function createSessionStructure(sessionId) {
  const sessionPath = path.join(process.cwd(), 'sessions', sessionId);
  const artifactsPath = path.join(sessionPath, 'artifacts');

  // Create directories
  const dirs = ['code', 'tests', 'docs', 'scripts', 'notes'];
  dirs.forEach(dir => {
    fs.mkdirSync(path.join(artifactsPath, dir), { recursive: true });
  });

  // Create metadata.json
  const metadata = {
    session_id: sessionId,
    created_at: new Date().toISOString(),
    status: 'active',
    artifacts_path: artifactsPath
  };
  fs.writeFileSync(
    path.join(sessionPath, 'metadata.json'),
    JSON.stringify(metadata, null, 2)
  );

  // Create session-summary.md
  const summary = `# Session: ${sessionId}
**Started:** ${new Date().toLocaleString()}
**Status:** Active

## Progress
- Session initialized automatically
- Artifacts structure created

## Artifacts Location
All work for this session goes to:
\`sessions/${sessionId}/artifacts/{code,tests,docs,scripts,notes}/\`
`;
  fs.writeFileSync(path.join(sessionPath, 'session-summary.md'), summary);

  return sessionPath;
}

/**
 * Initialize hooks for new session
 */
function initializeHooks(sessionId, firstTask) {
  try {
    execSync(
      `npx claude-flow@alpha hooks pre-task --description "${firstTask}" --task-id "${sessionId}"`,
      { stdio: 'inherit' }
    );
  } catch (error) {
    console.error('Hook initialization warning:', error.message);
  }
}

/**
 * Auto-initialize session if needed
 */
function autoInitialize(userMessage = 'Initial task') {
  if (!isNewChat()) {
    return process.env.SESSION_ID; // Return existing session
  }

  console.log('🆕 New chat detected - auto-initializing session...');

  const topic = inferTopic(userMessage);
  const sessionId = generateSessionId(topic);

  // Create structure
  const sessionPath = createSessionStructure(sessionId);

  // Set environment variable for this process and children
  process.env.SESSION_ID = sessionId;

  // Initialize hooks
  initializeHooks(sessionId, userMessage);

  console.log(`✅ Session initialized: ${sessionId}`);
  console.log(`📁 Artifacts: sessions/${sessionId}/artifacts/`);

  return sessionId;
}

// Export for use in other modules
module.exports = {
  autoInitialize,
  isNewChat,
  generateSessionId,
  createSessionStructure
};

// CLI usage
if (require.main === module) {
  const message = process.argv.slice(2).join(' ') || 'Initial task';
  autoInitialize(message);
}
