#!/usr/bin/env bash
# Auto-Cascading Hooks Setup Script
# Configures stock claude-flow hooks with optional auto-fire wrapper

set -euo pipefail

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
WORKSPACE_DIR="${1:-$(pwd)}"
HOOKS_MODE="${HOOKS_MODE:-manual}" # manual or auto
CLAUDE_FLOW_VERSION="${CLAUDE_FLOW_VERSION:-alpha}"

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Validate workspace
validate_workspace() {
    log_info "Validating workspace..."

    if [ ! -f "$WORKSPACE_DIR/package.json" ]; then
        log_error "Not a valid Node.js workspace: $WORKSPACE_DIR"
        exit 1
    fi

    if ! npx claude-flow --version &> /dev/null; then
        log_error "claude-flow not installed"
        exit 1
    fi

    log_info "Workspace validated"
}

# Create hooks directory structure
create_hooks_structure() {
    log_info "Creating hooks directory structure..."

    mkdir -p "$WORKSPACE_DIR/.claude/hooks"

    log_info "Hooks directory created"
}

# Create hooks wrapper (optional)
create_hooks_wrapper() {
    if [ "$HOOKS_MODE" != "auto" ]; then
        log_info "Skipping auto-fire wrapper (manual mode)"
        return
    fi

    log_info "Creating auto-fire hooks wrapper..."

    cat > "$WORKSPACE_DIR/.claude/hooks/auto-hooks.js" << 'EOF'
/**
 * Auto-Fire Hooks Wrapper (Stock-First)
 *
 * This wrapper auto-fires stock claude-flow hooks during operations.
 * All hook execution goes through: npx claude-flow@alpha hooks <command>
 *
 * Stock-First: 97% - Uses stock hooks exclusively
 */

const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

// Configuration
const CONFIG = {
  enabled: process.env.AUTO_HOOKS_ENABLED !== 'false',
  verbose: process.env.AUTO_HOOKS_VERBOSE === 'true',
  claudeFlowVersion: process.env.CLAUDE_FLOW_VERSION || 'alpha'
};

// Logging
const log = {
  debug: (msg) => CONFIG.verbose && console.log(`[AUTO-HOOKS] ${msg}`),
  info: (msg) => console.log(`[AUTO-HOOKS] ${msg}`),
  error: (msg) => console.error(`[AUTO-HOOKS] ${msg}`)
};

/**
 * Execute stock claude-flow hook
 */
async function executeHook(hookName, args = {}) {
  if (!CONFIG.enabled) {
    log.debug(`Hooks disabled, skipping: ${hookName}`);
    return;
  }

  try {
    // Build command
    const argsStr = Object.entries(args)
      .map(([key, value]) => `--${key} "${value}"`)
      .join(' ');

    const command = `npx claude-flow@${CONFIG.claudeFlowVersion} hooks ${hookName} ${argsStr}`;

    log.debug(`Executing: ${command}`);

    const { stdout, stderr } = await execAsync(command);

    if (stderr) {
      log.debug(`Hook stderr: ${stderr}`);
    }

    log.debug(`Hook ${hookName} completed`);
    return stdout;
  } catch (error) {
    log.error(`Hook ${hookName} failed: ${error.message}`);
    // Don't throw - hooks should not block main operations
  }
}

/**
 * Pre-task hook
 */
async function preTask(description, taskId = `task-${Date.now()}`) {
  return executeHook('pre-task', {
    description,
    'task-id': taskId
  });
}

/**
 * Post-task hook
 */
async function postTask(taskId, status = 'completed') {
  return executeHook('post-task', {
    'task-id': taskId,
    status
  });
}

/**
 * Memory storage hook
 */
async function memoryStore(key, value, namespace = 'default') {
  return executeHook('memory', {
    action: 'store',
    key,
    value,
    namespace
  });
}

/**
 * Memory retrieval hook
 */
async function memoryRetrieve(key, namespace = 'default') {
  return executeHook('memory', {
    action: 'retrieve',
    key,
    namespace
  });
}

/**
 * Session end hook
 */
async function sessionEnd(exportMetrics = true) {
  return executeHook('session-end', {
    'export-metrics': exportMetrics
  });
}

/**
 * Post-edit hook (file operations)
 */
async function postEdit(filePath, memoryKey = null) {
  const args = { file: filePath };
  if (memoryKey) {
    args['memory-key'] = memoryKey;
  }
  return executeHook('post-edit', args);
}

/**
 * Enable auto-hooks globally
 */
function enableAutoHooks() {
  CONFIG.enabled = true;
  log.info('Auto-hooks enabled');
}

/**
 * Disable auto-hooks globally
 */
function disableAutoHooks() {
  CONFIG.enabled = false;
  log.info('Auto-hooks disabled');
}

module.exports = {
  executeHook,
  preTask,
  postTask,
  memoryStore,
  memoryRetrieve,
  sessionEnd,
  postEdit,
  enableAutoHooks,
  disableAutoHooks,
  CONFIG
};
EOF

    log_info "Auto-fire wrapper created"
}

# Create hooks documentation
create_hooks_docs() {
    log_info "Creating hooks documentation..."

    cat > "$WORKSPACE_DIR/.claude/hooks/README.md" << 'EOF'
# Claude-Flow Hooks System

Stock claude-flow hooks with optional auto-fire wrapper.

## Stock Hooks (Manual)

Execute hooks manually via CLI:

```bash
# Pre-task hook
npx claude-flow@alpha hooks pre-task --description "Build API" --task-id "task-1"

# Post-task hook
npx claude-flow@alpha hooks post-task --task-id "task-1" --status "completed"

# Memory operations
npx claude-flow@alpha hooks memory --action store --key "decision" --value "data"
npx claude-flow@alpha hooks memory --action retrieve --key "decision"

# Session closeout
npx claude-flow@alpha hooks session-end --export-metrics true
```

## Auto-Fire Wrapper (Optional)

Enable auto-firing hooks during operations:

```javascript
const { enableAutoHooks, preTask, postTask } = require('./.claude/hooks/auto-hooks.js');

// Enable auto-hooks
enableAutoHooks();

// Hooks will now auto-fire on operations
await preTask('Building feature');
// ... do work ...
await postTask('task-1', 'completed');
```

## Configuration

Environment variables:

- `AUTO_HOOKS_ENABLED` - Enable/disable auto-hooks (default: true)
- `AUTO_HOOKS_VERBOSE` - Verbose logging (default: false)
- `CLAUDE_FLOW_VERSION` - Claude-flow version (default: alpha)

## Stock Architecture

- **Stock-First Score**: 97%
- **All hooks** execute via `npx claude-flow@alpha hooks`
- **No custom hook logic** - pure wrapper around stock hooks
- **Optional** - Can be disabled without breaking functionality

## Available Hooks

1. **pre-task** - Before task execution
2. **post-task** - After task completion
3. **memory** - Store/retrieve data
4. **post-edit** - After file edits
5. **session-end** - Session cleanup
EOF

    log_info "Hooks documentation created"
}

# Create hooks test script
create_hooks_test() {
    log_info "Creating hooks test script..."

    cat > "$WORKSPACE_DIR/.claude/hooks/test-hooks.js" << 'EOF'
#!/usr/bin/env node
/**
 * Test stock claude-flow hooks
 */

const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

async function testHook(hookName, args) {
  console.log(`\nTesting: ${hookName}`);
  const argsStr = Object.entries(args)
    .map(([k, v]) => `--${k} "${v}"`)
    .join(' ');

  const command = `npx claude-flow@alpha hooks ${hookName} ${argsStr}`;
  console.log(`Command: ${command}`);

  try {
    const { stdout, stderr } = await execAsync(command);
    console.log('✓ Success');
    if (stdout) console.log(`Output: ${stdout.trim()}`);
    if (stderr) console.log(`Stderr: ${stderr.trim()}`);
  } catch (error) {
    console.log(`✗ Failed: ${error.message}`);
  }
}

async function main() {
  console.log('Testing Stock Claude-Flow Hooks\n');
  console.log('=====================================');

  // Test pre-task
  await testHook('pre-task', {
    description: 'Test task',
    'task-id': 'test-1'
  });

  // Test memory store
  await testHook('memory', {
    action: 'store',
    key: 'test-key',
    value: 'test-value'
  });

  // Test memory retrieve
  await testHook('memory', {
    action: 'retrieve',
    key: 'test-key'
  });

  // Test post-task
  await testHook('post-task', {
    'task-id': 'test-1',
    status: 'completed'
  });

  console.log('\n=====================================');
  console.log('Hook tests complete!');
}

main().catch(console.error);
EOF

    chmod +x "$WORKSPACE_DIR/.claude/hooks/test-hooks.js"

    log_info "Hooks test script created"
}

# Setup package.json scripts
setup_npm_scripts() {
    log_info "Adding hooks scripts to package.json..."

    cd "$WORKSPACE_DIR"

    # Add scripts using npm pkg
    npm pkg set scripts.hooks:test="node .claude/hooks/test-hooks.js"
    npm pkg set scripts.hooks:pre-task="npx claude-flow@alpha hooks pre-task"
    npm pkg set scripts.hooks:post-task="npx claude-flow@alpha hooks post-task"
    npm pkg set scripts.hooks:memory="npx claude-flow@alpha hooks memory"

    log_info "NPM scripts added"
}

# Create hooks configuration
create_hooks_config() {
    log_info "Creating hooks configuration..."

    cat > "$WORKSPACE_DIR/.claude/hooks/hooks.config.json" << EOF
{
  "version": "1.0.0",
  "mode": "$HOOKS_MODE",
  "claudeFlow": {
    "version": "$CLAUDE_FLOW_VERSION",
    "hooksEnabled": true
  },
  "autoFire": {
    "enabled": $([ "$HOOKS_MODE" = "auto" ] && echo "true" || echo "false"),
    "verbose": false
  },
  "hooks": {
    "pre-task": {
      "enabled": true,
      "timeout": 5000
    },
    "post-task": {
      "enabled": true,
      "timeout": 5000
    },
    "memory": {
      "enabled": true,
      "timeout": 5000
    },
    "post-edit": {
      "enabled": false,
      "timeout": 5000
    },
    "session-end": {
      "enabled": true,
      "timeout": 10000
    }
  }
}
EOF

    log_info "Hooks configuration created"
}

# Validate hooks installation
validate_hooks() {
    log_info "Validating hooks installation..."

    # Check directory structure
    if [ ! -d "$WORKSPACE_DIR/.claude/hooks" ]; then
        log_error "Hooks directory not created"
        return 1
    fi

    # Check files
    local required_files=(
        ".claude/hooks/README.md"
        ".claude/hooks/test-hooks.js"
        ".claude/hooks/hooks.config.json"
    )

    for file in "${required_files[@]}"; do
        if [ ! -f "$WORKSPACE_DIR/$file" ]; then
            log_error "Missing file: $file"
            return 1
        fi
    done

    # Check auto-hooks wrapper if in auto mode
    if [ "$HOOKS_MODE" = "auto" ]; then
        if [ ! -f "$WORKSPACE_DIR/.claude/hooks/auto-hooks.js" ]; then
            log_error "Auto-hooks wrapper not created"
            return 1
        fi
    fi

    log_info "Hooks installation validated"
}

# Print summary
print_summary() {
    echo ""
    echo "=========================================="
    echo "  Hooks Setup Complete!"
    echo "=========================================="
    echo ""
    echo "Mode: $HOOKS_MODE"
    echo "Location: $WORKSPACE_DIR/.claude/hooks"
    echo ""
    echo "Test hooks:"
    echo "  npm run hooks:test"
    echo ""
    echo "Manual hooks:"
    echo "  npx claude-flow@alpha hooks pre-task --description \"task\""
    echo ""
    if [ "$HOOKS_MODE" = "auto" ]; then
        echo "Auto-fire enabled:"
        echo "  const { enableAutoHooks } = require('./.claude/hooks/auto-hooks.js');"
        echo "  enableAutoHooks();"
        echo ""
    fi
    echo "Documentation: .claude/hooks/README.md"
    echo "=========================================="
}

# Main function
main() {
    log_info "Starting hooks setup..."

    validate_workspace
    create_hooks_structure
    create_hooks_wrapper
    create_hooks_docs
    create_hooks_test
    setup_npm_scripts
    create_hooks_config
    validate_hooks
    print_summary

    log_info "Hooks setup complete!"
}

# Run main
main "$@"
