# Auto-Cascading Hooks Pattern

## Overview

The **auto-cascading hooks pattern** enables automatic coordination, formatting, and learning from Claude Code operations without manual hook invocation. This pattern is 95%+ stock, using a thin wrapper around `npx claude-flow@alpha hooks`.

---

## Architecture

### Stock-First Principle (97% Stock)

```
┌─────────────────────────────────────────┐
│  Claude Code Operations                 │
│  (Write, Edit, Task, Bash, etc.)       │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  Auto-Hooks Wrapper (3% custom)         │
│  - Event detection                      │
│  - Parameter extraction                 │
│  - Non-blocking execution               │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  Stock Claude-Flow Hooks (97% stock)    │
│  npx claude-flow@alpha hooks <command>  │
│  - All hook logic                       │
│  - Memory operations                    │
│  - Coordination                         │
│  - Learning                             │
└─────────────────────────────────────────┘
```

**Key Insight:** The wrapper ONLY detects events and extracts parameters. ALL actual work happens in stock hooks.

---

## Implementation

### Auto-Hooks Wrapper (Thin Layer)

**File:** `.claude/hooks/auto-hooks.js`
**Size:** ~80 lines (thin wrapper compliance)
**Purpose:** Auto-fire stock hooks during operations

```javascript
#!/usr/bin/env node
/**
 * Auto-Fire Hook Wrapper (Stock-First)
 *
 * 95%+ stock: All execution via npx claude-flow@alpha hooks
 * 5% wrapper: Event detection and parameter extraction only
 */

const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

/**
 * Fire stock claude-flow hook (non-blocking)
 */
async function fireStockHook(hookName, args) {
  const cmd = `npx claude-flow@alpha hooks ${hookName} ${args}`;

  try {
    // Fire and forget - hooks should never block
    execAsync(cmd).catch(err => {
      console.warn(`⚠️  Hook warning (${hookName}):`, err.message);
    });
  } catch (error) {
    // Swallow errors - hooks enhance but never break workflow
  }
}

/**
 * Pre-Task Hook: Auto-fire before agent work
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
 * Enable automatic hook firing
 */
function enableAutoHooks() {
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

module.exports = {
  firePreTask,
  firePostEdit,
  enableAutoHooks
};
```

**Key Features:**
- **Non-blocking:** Hooks run async, never block operations
- **Error-tolerant:** Hook failures don't break workflow
- **Stock delegation:** All work delegated to stock CLI
- **Minimal footprint:** ~80 lines, just event detection

---

## Hook Cascade Flow

### Example: File Edit Operation

```
1. Claude Code Edit Tool
   └─> fs.writeFileSync('auth.js', content)

2. Auto-Hooks Wrapper (intercepts)
   ├─> Extract parameters: file='auth.js'
   ├─> Generate memory key: 'swarm/auto/edits/session-123/timestamp'
   └─> Fire stock hook (non-blocking)

3. Stock Hook Execution (npx claude-flow@alpha hooks post-edit)
   ├─> Auto-format file (prettier, eslint)
   ├─> Store in memory: file path, timestamp, changes
   ├─> Train neural patterns: edit patterns
   └─> Update coordination state

4. Memory Coordination
   ├─> Other agents notified of change
   ├─> Context updated for next operation
   └─> Learning patterns stored
```

**Total Time:** ~100ms (non-blocking, doesn't delay Claude)

---

## Claude Code Settings Integration

### .claude/settings.json Configuration

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "^(Write|Edit|MultiEdit)$",
        "hooks": [{
          "type": "command",
          "command": "npx claude-flow@alpha hooks pre-edit --file '${tool.params.file_path}' --auto-assign-agent --validate-syntax"
        }]
      },
      {
        "matcher": "^Task$",
        "hooks": [{
          "type": "command",
          "command": "npx claude-flow@alpha hooks pre-task --description '${tool.params.task}' --auto-spawn-agents --load-memory"
        }]
      },
      {
        "matcher": "^Bash$",
        "hooks": [{
          "type": "command",
          "command": "npx claude-flow@alpha hooks pre-bash --command '${tool.params.command}'"
        }]
      }
    ],

    "PostToolUse": [
      {
        "matcher": "^(Write|Edit|MultiEdit)$",
        "hooks": [{
          "type": "command",
          "command": "npx claude-flow@alpha hooks post-edit --file '${tool.params.file_path}' --memory-key 'swarm/edits/${tool.params.file_path}' --auto-format --train-patterns",
          "async": true
        }]
      },
      {
        "matcher": "^Task$",
        "hooks": [{
          "type": "command",
          "command": "npx claude-flow@alpha hooks post-task --task-id '${result.task_id}' --analyze-performance --store-decisions",
          "async": true
        }]
      }
    ],

    "SessionStart": [
      {
        "hooks": [{
          "type": "command",
          "command": "npx claude-flow@alpha hooks session-start --session-id '${session.id}' --load-context"
        }]
      }
    ],

    "SessionEnd": [
      {
        "hooks": [{
          "type": "command",
          "command": "npx claude-flow@alpha hooks session-end --session-id '${session.id}' --export-metrics --generate-summary"
        }]
      }
    ]
  }
}
```

**Benefits:**
- Claude Code natively handles hook execution
- No monkey-patching required
- Full parameter interpolation
- Async support for non-blocking hooks

---

## Cascade Patterns

### Pattern 1: Edit → Format → Memory → Learn

```
Edit File (Claude Code)
   ↓
Pre-Edit Hook
   ├─> Validate syntax
   ├─> Check conflicts
   └─> Assign agent
   ↓
File Write (actual operation)
   ↓
Post-Edit Hook
   ├─> Auto-format (prettier, eslint)
   ├─> Store in memory (file, changes, timestamp)
   ├─> Train patterns (learn from edit)
   └─> Notify other agents
   ↓
Memory Coordination
   ├─> Update shared context
   ├─> Trigger dependent hooks
   └─> Sync across agents
```

### Pattern 2: Task → Spawn → Execute → Analyze

```
Task Request (Claude Code Task tool)
   ↓
Pre-Task Hook
   ├─> Analyze task complexity
   ├─> Auto-spawn required agents
   ├─> Load relevant memory
   └─> Optimize topology
   ↓
Task Execution (agents work)
   ↓
Post-Task Hook
   ├─> Analyze performance
   ├─> Store decisions
   ├─> Export learnings
   └─> Generate report
   ↓
Neural Training
   ├─> Update coordination patterns
   ├─> Improve routing
   └─> Learn from success
```

### Pattern 3: Session → Work → Closeout → Archive

```
Session Start
   ↓
Session-Start Hook
   ├─> Initialize session directory
   ├─> Load previous context
   ├─> Setup coordination namespace
   └─> Initialize metrics
   ↓
Session Work (multiple operations)
   ├─> Each operation triggers hooks
   ├─> Memory accumulates
   └─> Patterns learned
   ↓
Session End
   ↓
Session-End Hook
   ├─> Generate summary
   ├─> Export metrics
   ├─> Create backup
   └─> Update Captain's Log
```

---

## Memory Coordination Protocol

### Three-Phase Memory Pattern

All hooks follow this standardized pattern:

#### Phase 1: STATUS
```javascript
// Hook starts - report status
mcp__claude-flow__memory_usage {
  action: "store",
  key: "swarm/hooks/pre-edit/status",
  namespace: "coordination",
  value: JSON.stringify({
    status: "running",
    hook: "pre-edit",
    file: "src/auth.js",
    timestamp: Date.now()
  })
}
```

#### Phase 2: PROGRESS
```javascript
// Hook processing - update progress
mcp__claude-flow__memory_usage {
  action: "store",
  key: "swarm/hooks/pre-edit/progress",
  namespace: "coordination",
  value: JSON.stringify({
    progress: 50,
    action: "validating syntax",
    file: "src/auth.js"
  })
}
```

#### Phase 3: COMPLETE
```javascript
// Hook complete - store results
mcp__claude-flow__memory_usage {
  action: "store",
  key: "swarm/hooks/pre-edit/complete",
  namespace: "coordination",
  value: JSON.stringify({
    status: "complete",
    result: "success",
    agent_assigned: "backend-dev",
    syntax_valid: true,
    backup_created: true
  })
}
```

### Memory Key Conventions

```
swarm/
  ├─ hooks/
  │  ├─ pre-task/
  │  │  ├─ status       # Current hook status
  │  │  ├─ progress     # Progress updates
  │  │  └─ complete     # Completion results
  │  ├─ post-edit/
  │  └─ session-end/
  │
  ├─ agents/
  │  ├─ researcher/
  │  │  ├─ status       # Agent status
  │  │  └─ findings     # Research results
  │  ├─ coder/
  │  └─ tester/
  │
  └─ shared/
     ├─ research-findings
     ├─ implementation
     └─ decisions
```

---

## Integration with Agent Workflow

### Agent Workflow with Auto-Hooks

```markdown
# Agent: Backend Developer

## 1. Pre-Task (auto-fires)
Hook checks memory, spawns dependencies, loads context

## 2. Work Begins
Edit file: src/auth.js
  ↓ (auto pre-edit hook)
  Syntax validated, agent assigned, backup created
  ↓ (file write)
  Changes applied
  ↓ (auto post-edit hook)
  File formatted, stored in memory, patterns trained

## 3. Notify Coordination
Post-edit hook stores:
- File path: src/auth.js
- Changes: +45 lines, -12 lines
- Timestamp: 2025-11-15T12:34:56Z
- Formatted: true
- Linted: true

## 4. Other Agents Read Memory
Tester agent queries memory:
  mcp__claude-flow__memory_search {
    pattern: "swarm/*/auth*",
    namespace: "coordination"
  }

  Finds: Backend dev completed auth.js
  Action: Generate tests for auth.js

## 5. Post-Task (auto-fires)
Hook analyzes performance, stores decisions, exports learnings
```

---

## Benefits

### 1. Zero Manual Overhead
- Hooks fire automatically during operations
- No need to remember to call hooks
- Coordination happens transparently

### 2. Consistent Coordination
- Every operation tracked
- Memory always updated
- Patterns continuously learned

### 3. Cross-Agent Context
- Shared memory for coordination
- Real-time updates
- No explicit message passing needed

### 4. Continuous Learning
- Neural patterns trained from every edit
- Coordination improves over time
- Decision patterns learned

### 5. Stock-First Architecture
- 97% stock claude-flow
- Easy to update (just `npm update`)
- Community improvements automatic
- Minimal custom maintenance

---

## Best Practices

### 1. Keep Hooks Non-Blocking
```javascript
// ✅ GOOD: Async, fire-and-forget
async function fireHook(name, args) {
  execAsync(cmd).catch(err => console.warn(err));
}

// ❌ BAD: Blocking, slows operations
function fireHook(name, args) {
  execSync(cmd);  // Blocks until complete!
}
```

### 2. Error Tolerance
```javascript
// ✅ GOOD: Swallow errors, log warnings
try {
  execAsync(cmd).catch(err => {
    console.warn(`Hook warning: ${err.message}`);
  });
} catch (error) {
  // Continue - hooks enhance but don't break workflow
}

// ❌ BAD: Throw errors, break workflow
execAsync(cmd);  // Uncaught errors break operations
```

### 3. Memory Organization
```javascript
// ✅ GOOD: Hierarchical, namespaced keys
const key = "swarm/hooks/post-edit/complete";
const namespace = "coordination";

// ❌ BAD: Flat, unorganized keys
const key = "post-edit-complete-123";
```

### 4. Use Settings.json for Native Integration
```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "^Edit$",
      "hooks": [{
        "type": "command",
        "command": "npx claude-flow@alpha hooks post-edit --file '${tool.params.file_path}'",
        "async": true  // Non-blocking!
      }]
    }]
  }
}
```

---

## Troubleshooting

### Hooks Not Firing

**Check 1: Settings.json syntax**
```bash
cat .claude/settings.json | jq .
# Should parse without errors
```

**Check 2: Claude Code version**
```bash
# Hooks require Claude Code 1.0.51+
# Verify in Claude Code settings
```

**Check 3: Enable debug mode**
```bash
export CLAUDE_FLOW_DEBUG=true
# Hooks will log execution
```

### Hook Performance Issues

**Check execution time:**
```bash
time npx claude-flow@alpha hooks post-edit --file "test.js"
# Should be < 100ms for non-blocking hooks
```

**Make hooks async:**
```json
{
  "hooks": [{
    "async": true  // Run in background
  }]
}
```

### Memory Not Updating

**Verify hook execution:**
```bash
# Check if hooks are actually running
npx claude-flow@alpha hooks post-edit --file "test.js" --debug

# Check memory contents
npx claude-flow@alpha memory list --namespace coordination
```

---

## Summary

**Auto-Cascading Hooks Pattern:**
- **97% Stock:** All hook logic in `npx claude-flow@alpha hooks`
- **3% Wrapper:** Thin event detection layer
- **Zero Overhead:** Automatic execution, no manual invocation
- **Continuous Learning:** Patterns trained from every operation
- **Cross-Agent Coordination:** Shared memory for context

**Result:** Seamless coordination, formatting, and learning from Claude Code operations with stock-first architecture.
