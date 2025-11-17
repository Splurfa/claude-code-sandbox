#!/usr/bin/env node
/**
 * Always-On Memory Coordination Hooks
 * Automatically fires during agent work without manual intervention
 *
 * Stock dependencies: claude-flow hooks, child_process
 */

const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

/**
 * Hook registry - maps operations to hook commands
 */
const HOOK_REGISTRY = {
  'file:write': 'post-edit',
  'file:edit': 'post-edit',
  'agent:spawn': 'pre-task',
  'agent:complete': 'post-task',
  'decision:made': 'memory:store',
  'pattern:learned': 'neural:train'
};

/**
 * Fire hook asynchronously (non-blocking)
 */
async function fireHook(hookType, params) {
  const hookCmd = HOOK_REGISTRY[hookType];
  if (!hookCmd) {
    return; // Unknown hook type, skip silently
  }

  try {
    const cmd = buildHookCommand(hookCmd, params);
    // Fire and forget - don't block on hook execution
    execAsync(cmd).catch(err => {
      // Log warning but don't fail the operation
      console.warn(`Hook warning (${hookType}):`, err.message);
    });
  } catch (error) {
    // Swallow errors - hooks should never break main workflow
  }
}

/**
 * Build claude-flow hook command
 */
function buildHookCommand(hookCmd, params) {
  const baseCmd = 'npx claude-flow@alpha hooks';

  switch (hookCmd) {
    case 'post-edit':
      return `${baseCmd} post-edit --file "${params.file}" --memory-key "swarm/${params.agent}/${params.step}"`;

    case 'pre-task':
      return `${baseCmd} pre-task --description "${params.description}" --task-id "${params.taskId}"`;

    case 'post-task':
      return `${baseCmd} post-task --task-id "${params.taskId}"`;

    case 'memory:store':
      return `${baseCmd} memory:store --key "${params.key}" --value "${params.value}"`;

    case 'neural:train':
      return `${baseCmd} neural:train --pattern "${params.pattern}" --outcome "${params.outcome}"`;

    default:
      return `${baseCmd} ${hookCmd}`;
  }
}

/**
 * Wrap function to auto-fire hooks
 */
function withHooks(fn, hookType) {
  return async function(...args) {
    const result = await fn(...args);

    // Extract hook params from result/args
    const params = extractHookParams(hookType, args, result);

    // Fire hook asynchronously
    fireHook(hookType, params);

    return result;
  };
}

/**
 * Extract parameters for hook from operation context
 */
function extractHookParams(hookType, args, result) {
  const sessionId = process.env.SESSION_ID || 'unknown';

  switch (hookType) {
    case 'file:write':
    case 'file:edit':
      return {
        file: args[0],
        agent: process.env.AGENT_ID || 'queen',
        step: 'file-operation'
      };

    case 'agent:spawn':
      return {
        description: args[0] || 'Agent task',
        taskId: `${sessionId}-${Date.now()}`
      };

    case 'agent:complete':
      return {
        taskId: args[0] || sessionId
      };

    case 'decision:made':
      return {
        key: `hive/decisions/${sessionId}/${Date.now()}`,
        value: JSON.stringify(args[0])
      };

    default:
      return {};
  }
}

/**
 * Auto-hook common operations
 */
function enableAutoHooks() {
  // Hook into fs operations (if used through our wrappers)
  const fs = require('fs');
  const originalWriteFile = fs.writeFileSync;

  fs.writeFileSync = function(...args) {
    const result = originalWriteFile.apply(this, args);
    fireHook('file:write', { file: args[0], agent: 'auto', step: 'write' });
    return result;
  };

  console.log('🔗 Always-on hooks enabled');
}

/**
 * Store decision in memory (with hook)
 */
async function storeDecision(key, value) {
  await fireHook('decision:made', {
    key: `hive/decisions/${process.env.SESSION_ID}/${key}`,
    value: typeof value === 'string' ? value : JSON.stringify(value)
  });
}

/**
 * Train pattern from outcome (with hook)
 */
async function trainPattern(pattern, outcome) {
  await fireHook('pattern:learned', { pattern, outcome });
}

// Export functions
module.exports = {
  fireHook,
  withHooks,
  enableAutoHooks,
  storeDecision,
  trainPattern,
  HOOK_REGISTRY
};

// CLI usage
if (require.main === module) {
  const [hookType, ...params] = process.argv.slice(2);
  if (hookType) {
    fireHook(hookType, { description: params.join(' ') });
  } else {
    enableAutoHooks();
  }
}
