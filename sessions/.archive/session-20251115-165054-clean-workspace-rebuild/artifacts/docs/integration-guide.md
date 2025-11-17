# Claude-Flow Integration Patterns

## Overview

This guide documents integration patterns between Claude Code, claude-flow MCP tools, hooks, skills, and agent coordination based on research findings.

---

## Integration Architecture

```
┌─────────────────────────────────────────────────────┐
│  Claude Code (Execution Layer)                      │
│  - Task tool (spawn agents)                         │
│  - File operations (Read, Write, Edit)              │
│  - Bash commands                                     │
│  - TodoWrite (task tracking)                        │
└──────────────┬──────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────┐
│  Claude Code Settings (.claude/settings.json)       │
│  - Hook configurations                              │
│  - Tool matchers                                     │
│  - Pre/Post operation hooks                         │
└──────────────┬──────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────┐
│  Claude-Flow Hooks (npx claude-flow@alpha hooks)    │
│  - pre-task, post-task                              │
│  - pre-edit, post-edit                              │
│  - session-start, session-end                       │
│  - memory operations                                 │
└──────────────┬──────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────┐
│  MCP Tools (claude-flow MCP server)                 │
│  - mcp__claude-flow__swarm_init                     │
│  - mcp__claude-flow__agent_spawn                    │
│  - mcp__claude-flow__memory_usage                   │
│  - mcp__claude-flow__neural_train                   │
└──────────────┬──────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────┐
│  Infrastructure                                      │
│  - .swarm/memory.db (SQLite coordination)           │
│  - .swarm/backups/ (session snapshots)              │
│  - sessions/ (active work)                          │
│  - .claude/skills/ (skill library)                  │
└─────────────────────────────────────────────────────┘
```

---

## Integration Pattern 1: Task Execution Flow

### Complete Flow (Stock-First)

```bash
# 1. User initiates task via Claude Code
User: "Build a REST API with authentication"

# 2. Pre-task hook fires (optional, via settings.json)
npx claude-flow@alpha hooks pre-task \
  --description "Build REST API with authentication" \
  --auto-spawn-agents \
  --load-memory

# 3. Hook coordinates setup (stock)
Hook execution:
  ├─> Analyze task complexity
  ├─> Query memory for context
  ├─> Auto-spawn agents via MCP
  └─> Store task context in memory

# 4. Claude Code spawns agents (required execution)
Task("Backend Dev", "Implement API. Save to sessions/$SESSION_ID/artifacts/code/", "backend-dev")
Task("Tester", "Create tests. Save to sessions/$SESSION_ID/artifacts/tests/", "tester")

# 5. Agents work with hook coordination
Backend Dev:
  ├─> pre-edit hook validates syntax
  ├─> Writes src/api.js
  ├─> post-edit hook formats & stores in memory
  └─> Notifies via memory

Tester:
  ├─> Reads backend context from memory
  ├─> Creates tests based on API implementation
  └─> Stores test results in memory

# 6. Post-task hook analyzes (optional, via settings.json)
npx claude-flow@alpha hooks post-task \
  --task-id "api-build" \
  --analyze-performance \
  --store-decisions

# 7. Results accessible via memory
Other agents can query:
  mcp__claude-flow__memory_search {
    pattern: "swarm/*/api*",
    namespace: "coordination"
  }
```

---

## Integration Pattern 2: Memory Coordination

### Cross-Agent Communication via Memory

```javascript
// Agent 1: Store findings
mcp__claude-flow__memory_usage {
  action: "store",
  key: "swarm/researcher/auth-patterns",
  namespace: "coordination",
  value: JSON.stringify({
    patterns: ["JWT", "OAuth2", "Session"],
    recommendation: "JWT for stateless API",
    dependencies: ["jsonwebtoken", "bcrypt"],
    timestamp: Date.now()
  })
}

// Agent 2: Read findings
mcp__claude-flow__memory_usage {
  action: "retrieve",
  key: "swarm/researcher/auth-patterns",
  namespace: "coordination"
}

// Agent 2: Implement based on findings
// ... implementation ...

// Agent 2: Share implementation
mcp__claude-flow__memory_usage {
  action: "store",
  key: "swarm/coder/auth-implementation",
  namespace: "coordination",
  value: JSON.stringify({
    files: ["src/auth.js", "src/middleware/jwt.js"],
    endpoints: ["/auth/login", "/auth/logout"],
    tests: "src/auth.test.js",
    timestamp: Date.now()
  })
}

// Agent 3: Query for testing
mcp__claude-flow__memory_search {
  pattern: "swarm/*/auth*",
  namespace: "coordination",
  limit: 10
}
```

**Memory Key Convention:**
```
swarm/
  ├─ <agent-type>/
  │  ├─ <feature-name>           # Agent-specific context
  │  └─ status                   # Agent status
  │
  └─ shared/
     ├─ <feature-name>           # Shared decisions
     └─ dependencies             # Project dependencies
```

---

## Integration Pattern 3: Hooks + Settings.json

### Native Claude Code Integration

**File:** `.claude/settings.json`

```json
{
  "hooks": {
    "enabled": true,
    "timeout": 5000,

    "PreToolUse": [
      {
        "matcher": "^(Write|Edit|MultiEdit)$",
        "hooks": [
          {
            "type": "command",
            "command": "npx claude-flow@alpha hooks pre-edit --file '${tool.params.file_path}' --auto-assign-agent --validate-syntax",
            "timeout": 3000,
            "continueOnError": true
          }
        ]
      },
      {
        "matcher": "^Task$",
        "hooks": [
          {
            "type": "command",
            "command": "npx claude-flow@alpha hooks pre-task --description '${tool.params.task}' --auto-spawn-agents --load-memory",
            "async": true
          }
        ]
      }
    ],

    "PostToolUse": [
      {
        "matcher": "^(Write|Edit|MultiEdit)$",
        "hooks": [
          {
            "type": "command",
            "command": "npx claude-flow@alpha hooks post-edit --file '${tool.params.file_path}' --memory-key 'swarm/edits/${tool.params.file_path}' --auto-format --train-patterns",
            "async": true
          }
        ]
      },
      {
        "matcher": "^Task$",
        "hooks": [
          {
            "type": "command",
            "command": "npx claude-flow@alpha hooks post-task --task-id '${result.task_id}' --analyze-performance --store-decisions",
            "async": true
          }
        ]
      }
    ],

    "SessionEnd": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "npx claude-flow@alpha hooks session-end --session-id '${session.id}' --export-metrics --generate-summary"
          }
        ]
      }
    ]
  }
}
```

**Parameter Interpolation:**
- `${tool.params.file_path}` - File path from tool call
- `${tool.params.task}` - Task description
- `${tool.params.command}` - Bash command
- `${result.task_id}` - Task ID from result
- `${session.id}` - Session identifier

---

## Integration Pattern 4: Skills + Hooks

### Skill-Triggered Hook Automation

**Example Skill:** `.claude/skills/auto-test/SKILL.md`

```markdown
---
name: "Auto-Test Skill"
description: "Automatically run tests after code changes.
Use when implementing TDD workflows or continuous testing."
---

# Auto-Test Skill

## What This Skill Does
Configures automatic test execution using claude-flow hooks.

## Quick Start

### Enable Auto-Testing
```bash
# Add to .claude/settings.json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "^Write$",
      "hooks": [{
        "type": "command",
        "command": "test -f '${tool.params.file_path%.js}.test.js' && npm test '${tool.params.file_path%.js}.test.js'",
        "async": true,
        "continueOnError": true
      }]
    }]
  }
}
```

### Manual Test Trigger
```bash
npx claude-flow@alpha hooks post-edit \
  --file "src/auth.js" \
  --memory-key "tests/auth"
```
```

---

## Integration Pattern 5: MCP Tools + Agent Coordination

### Swarm Initialization with MCP

```javascript
// 1. Initialize swarm topology (optional setup)
mcp__claude-flow__swarm_init {
  topology: "mesh",
  maxAgents: 6,
  strategy: "balanced"
}

// 2. Define agent types (optional coordination)
mcp__claude-flow__agent_spawn { type: "researcher" }
mcp__claude-flow__agent_spawn { type: "coder" }
mcp__claude-flow__agent_spawn { type: "tester" }

// 3. Claude Code spawns ACTUAL agents (required execution)
Task("Researcher", "Analyze requirements. Store in memory with key 'swarm/research/findings'", "researcher")
Task("Coder", "Implement based on research. Check memory for requirements.", "coder")
Task("Tester", "Test implementation. Read from memory.", "tester")

// 4. Agents coordinate via memory
// Researcher stores findings
mcp__claude-flow__memory_usage {
  action: "store",
  key: "swarm/research/findings",
  namespace: "coordination",
  value: "..."
}

// Coder retrieves findings
mcp__claude-flow__memory_usage {
  action: "retrieve",
  key: "swarm/research/findings",
  namespace: "coordination"
}

// 5. Monitor via MCP
mcp__claude-flow__swarm_status {}
mcp__claude-flow__agent_metrics { agentId: "coder" }
```

**Key Pattern:** MCP coordinates strategy, Claude Code executes work.

---

## Integration Pattern 6: Session Management

### Complete Session Lifecycle

```bash
# 1. Session Start (optional hook)
npx claude-flow@alpha hooks session-start \
  --session-id "session-20251115-120000-api-dev" \
  --load-context

# 2. Work Phase (hooks fire automatically)
# - pre-edit/post-edit for file operations
# - pre-task/post-task for agent work
# - Memory accumulates throughout

# 3. Session Closeout (required manual or via skill)
npx claude-flow@alpha hooks session-end \
  --session-id "session-20251115-120000-api-dev" \
  --export-metrics \
  --generate-summary

# 4. Backup Created
# .swarm/backups/session-20251115-120000-api-dev.json

# 5. Context Available for Next Session
npx claude-flow@alpha hooks session-restore \
  --session-id "session-20251115-120000-api-dev" \
  --restore-memory
```

---

## Integration Pattern 7: Neural Learning

### Continuous Pattern Training

```javascript
// 1. Edit file (Claude Code)
Edit("src/auth.js", ...)

// 2. Post-edit hook fires (automatic)
npx claude-flow@alpha hooks post-edit \
  --file "src/auth.js" \
  --train-patterns

// 3. Hook trains neural patterns (stock)
mcp__claude-flow__neural_train {
  pattern_type: "coordination",
  training_data: JSON.stringify({
    operation: "edit",
    file_type: "javascript",
    patterns_used: ["async/await", "error-handling"],
    outcome: "success",
    metrics: { lines_added: 45, complexity: 8 }
  })
}

// 4. Patterns improve over time
// Next similar task uses learned patterns
mcp__claude-flow__neural_predict {
  modelId: "coordination-model",
  input: "implement authentication"
}
// Returns: Suggested patterns, agent assignment, complexity estimate
```

---

## Best Practices

### 1. Let Claude Code Handle Execution
```javascript
// ✅ GOOD: Claude Code Task tool spawns real agents
Task("Backend Dev", "Implement API", "backend-dev")
Task("Tester", "Create tests", "tester")

// ❌ BAD: Only using MCP tools (coordination only, no execution)
mcp__claude-flow__agent_spawn { type: "backend-dev" }
mcp__claude-flow__agent_spawn { type: "tester" }
```

### 2. Use Hooks for Automation
```json
// ✅ GOOD: Hooks in settings.json (automatic)
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "^Edit$",
      "hooks": [{ "command": "npx claude-flow@alpha hooks post-edit ..." }]
    }]
  }
}

// ❌ BAD: Manual hook invocation (error-prone)
// User has to remember to call hooks manually
```

### 3. Coordinate via Memory
```javascript
// ✅ GOOD: Hierarchical memory keys
mcp__claude-flow__memory_usage {
  action: "store",
  key: "swarm/researcher/auth-findings",
  namespace: "coordination",
  value: "..."
}

// ❌ BAD: Flat, unorganized keys
mcp__claude-flow__memory_usage {
  action: "store",
  key: "findings-123",
  value: "..."
}
```

### 4. Keep Hooks Non-Blocking
```json
{
  "hooks": [{
    "async": true,  // ✅ GOOD: Non-blocking
    "continueOnError": true  // ✅ GOOD: Error-tolerant
  }]
}
```

---

## Common Integration Scenarios

### Scenario 1: Full-Stack Development

```bash
# Initialize session
npx claude-flow@alpha hooks session-start --session-id "fullstack-app"

# Spawn agents via Claude Code
Task("Backend", "Build REST API. Store endpoints in memory.", "backend-dev")
Task("Frontend", "Build React UI. Read API from memory.", "coder")
Task("Database", "Design schema. Store in memory.", "code-analyzer")
Task("Tester", "Create E2E tests. Read all context from memory.", "tester")

# Agents coordinate via memory automatically
# - Backend stores API spec
# - Frontend reads API spec
# - Database stores schema
# - Tester reads all context

# Session closeout
npx claude-flow@alpha hooks session-end \
  --session-id "fullstack-app" \
  --export-metrics
```

### Scenario 2: Code Review Workflow

```bash
# Initialize review
mcp__claude-flow__swarm_init { topology: "mesh" }

# Spawn reviewers via Claude Code
Task("Security", "Review for vulnerabilities. Store findings.", "security-manager")
Task("Performance", "Analyze performance. Store bottlenecks.", "perf-analyzer")
Task("Quality", "Check code quality. Store issues.", "reviewer")

# Agents share findings via memory
# Coordinator aggregates from memory
Task("Coordinator", "Aggregate all findings from memory.", "reviewer")

# Generate report
mcp__claude-flow__performance_report {
  format: "detailed",
  timeframe: "24h"
}
```

### Scenario 3: Migration Project

```bash
# Plan migration
Task("Planner", "Analyze codebase and plan migration. Store plan.", "planner")

# Execute in phases
Task("Phase1", "Migrate core modules. Read plan from memory.", "coder")
Task("Phase2", "Migrate utilities. Read plan from memory.", "coder")
Task("Phase3", "Migrate tests. Read all context from memory.", "tester")

# Validate each phase
Task("Validator", "Validate migration. Read all phases from memory.", "production-validator")

# Track progress via memory
mcp__claude-flow__memory_search {
  pattern: "swarm/*/migration*",
  namespace: "coordination"
}
```

---

## Troubleshooting Integrations

### Issue: Hooks Not Firing

**Check settings.json:**
```bash
cat .claude/settings.json | jq .hooks
```

**Verify hook command:**
```bash
npx claude-flow@alpha hooks post-edit --file "test.js" --debug
```

### Issue: Memory Not Syncing

**List memory keys:**
```bash
npx claude-flow@alpha memory list --namespace coordination
```

**Search memory:**
```bash
npx claude-flow@alpha hooks memory --action search --pattern "swarm/*"
```

### Issue: Agents Not Coordinating

**Check agent status:**
```bash
mcp__claude-flow__agent_list { filter: "all" }
mcp__claude-flow__agent_metrics { agentId: "agent-name" }
```

**Verify memory access:**
```javascript
// Each agent should store status
mcp__claude-flow__memory_usage {
  action: "store",
  key: "swarm/agent-name/status",
  namespace: "coordination",
  value: JSON.stringify({ status: "active", task: "..." })
}
```

---

## Summary

**Key Integration Points:**
1. **Claude Code** - Execution layer (Task tool, file ops)
2. **Settings.json** - Native hook integration
3. **Claude-Flow Hooks** - Lifecycle automation
4. **MCP Tools** - Coordination and monitoring
5. **Memory** - Cross-agent communication
6. **Skills** - Reusable workflow automation

**Integration Flow:**
```
Claude Code → Settings.json → Hooks → MCP Tools → Memory
     ↓                                              ↑
     └──────────────── Agents Coordinate ──────────┘
```

**Result:** Seamless coordination between execution, automation, and agent communication with stock-first architecture.
