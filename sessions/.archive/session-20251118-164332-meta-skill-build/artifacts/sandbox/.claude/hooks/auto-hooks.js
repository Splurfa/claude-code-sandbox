#!/usr/bin/env node
/**
 * DEPRECATED: Auto-Fire Hook Wrapper
 *
 * ⚠️ THIS FILE VIOLATES STOCK-FIRST PRINCIPLE ⚠️
 *
 * Reason: Monkey-patches fs.writeFileSync (lines 88-98)
 * Migration: Use .claude/settings.json PreToolUse/PostToolUse hooks instead
 * See: ADR-002 for stock cascade pattern
 * Status: Deprecated 2025-11-17
 *
 * DO NOT USE THIS FILE - Use stock hooks configured in .claude/settings.json
 */

console.warn('⚠️  DEPRECATED: auto-hooks.js violates stock-first principle');
console.warn('📋 Use .claude/settings.json PreToolUse/PostToolUse hooks instead');
console.warn('📖 See ADR-002 and WORKSPACE-GUIDE.md for migration guide');

// Deprecated implementation below - DO NOT ENABLE

const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

/**
 * Fire stock claude-flow hook (non-blocking)
 * This is the ONLY hook execution function - everything goes through stock CLI
 */
async function fireStockHook(hookName, args) {
  const cmd = `npx claude-flow@alpha hooks ${hookName} ${args}`;

  try {
    // Fire and forget - hooks should never block operations
    execAsync(cmd).catch(err => {
      console.warn(`⚠️  Hook warning (${hookName}):`, err.message);
    });
  } catch (error) {
    // Swallow errors - hooks enhance but never break workflow
  }
}

/**
 * Pre-Task Hook: Auto-fire before agent work begins
 */
function firePreTask(description, taskId, agentId) {
  const args = [
    `--description "${description}"`,
    `--task-id "${taskId}"`,
    agentId ? `--agent-id "${agentId}"` : '',
    '--auto-spawn-agents'
  ].filter(Boolean).join(' ');

  fireStockHook('pre-task', args);
}

/**
 * Post-Task Hook: Auto-fire after agent work completes
 */
function firePostTask(taskId, withAnalysis = true) {
  const args = [
    `--task-id "${taskId}"`,
    withAnalysis ? '--analyze-performance --generate-insights' : ''
  ].filter(Boolean).join(' ');

  fireStockHook('post-task', args);
}

/**
 * Post-Edit Hook: Auto-fire after file writes
 */
function firePostEdit(filePath, memoryKey) {
  const args = [
    `--file "${filePath}"`,
    memoryKey ? `--memory-key "${memoryKey}"` : ''
  ].filter(Boolean).join(' ');

  fireStockHook('post-edit', args);
}

/**
 * Session-End Hook: Auto-fire on session closeout
 */
function fireSessionEnd(swarmId, exportMetrics = true) {
  const args = [
    swarmId ? `--swarm-id "${swarmId}"` : '',
    exportMetrics ? '--export-metrics --generate-summary' : ''
  ].filter(Boolean).join(' ');

  fireStockHook('session-end', args);
}

/**
 * Enable automatic hook firing (sets up listeners)
 */
function enableAutoHooks() {
  // Hook into fs operations for auto post-edit
  const fs = require('fs');
  const originalWriteFile = fs.writeFileSync;

  fs.writeFileSync = function(...args) {
    const result = originalWriteFile.apply(this, args);
    const filePath = args[0];
    const sessionId = process.env.SESSION_ID || 'unknown';
    const memoryKey = `swarm/auto/edits/${sessionId}/${Date.now()}`;
    firePostEdit(filePath, memoryKey);
    return result;
  };

  console.log('🔗 Auto-hooks enabled (stock-first mode)');
  return true;
}

// Export API
module.exports = {
  firePreTask,
  firePostTask,
  firePostEdit,
  fireSessionEnd,
  enableAutoHooks
};

// CLI usage
if (require.main === module) {
  const command = process.argv[2];

  if (command === '--enable') {
    enableAutoHooks();
  } else {
    console.log('Usage: node auto-hooks.js --enable');
  }
}
