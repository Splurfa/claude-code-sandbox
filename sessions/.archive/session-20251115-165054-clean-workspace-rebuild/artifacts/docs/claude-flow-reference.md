# Claude-Flow Stock Features Reference

## Overview

Claude-Flow is an enterprise-grade AI agent orchestration platform with 90+ MCP tools, swarm intelligence, and neural pattern learning. This document covers the **stock features** provided by `npx claude-flow@alpha`.

**Version:** 2.7.35 (as of research)
**Installation:** `npm install -g claude-flow@alpha`
**MCP Server:** `claude mcp add claude-flow npx claude-flow@alpha mcp start`

---

## Core Infrastructure

### 1. Memory System (.swarm/memory.db)

**What:** SQLite database for agent coordination, cross-session context, and learned patterns.

**Stock Commands:**
```bash
# Store information
npx claude-flow@alpha hooks memory --action store \
  --key "project/decision" \
  --value "Using JWT authentication"

# Retrieve information
npx claude-flow@alpha hooks memory --action retrieve \
  --key "project/decision"

# Search memory
npx claude-flow@alpha hooks memory --action search \
  --pattern "authentication"

# List memory namespaces
npx claude-flow@alpha memory list --namespace project

# Export/Import memory
npx claude-flow@alpha memory export backup.json
npx claude-flow@alpha memory import backup.json
```

**Memory Structure:**
- **Namespaces:** Organize memory by domain (default, project, coordination, swarm)
- **Keys:** Hierarchical paths (`swarm/agent/status`, `project/auth-pattern`)
- **TTL:** Optional time-to-live for temporary data
- **Search:** Pattern matching with wildcards and regex

**Storage Location:** `.swarm/memory.db` (SQLite3, ACID compliant)

---

### 2. Session Backups (.swarm/backups/)

**What:** Timestamped JSON snapshots of completed sessions with full context.

**Stock Commands:**
```bash
# Create session backup
npx claude-flow@alpha hooks session-end \
  --export-metrics true \
  --generate-summary

# Restore session context
npx claude-flow@alpha hooks session-restore \
  --session-id "session-20251115-120000-feature"
```

**Backup Format:**
```json
{
  "session_id": "session-20251115-120000-api-dev",
  "closed_at": "2025-11-15T18:30:00Z",
  "summary": "Built REST API with authentication",
  "artifacts": {
    "code": ["server.js", "auth.js"],
    "tests": ["server.test.js"],
    "docs": ["API.md"]
  },
  "memory_snapshot": { /* memory state */ },
  "metrics": {
    "files_created": 12,
    "tests_written": 8,
    "duration_minutes": 45
  }
}
```

**Storage Location:** `.swarm/backups/session-YYYYMMDD-HHMMSS-<topic>.json`

---

### 3. Hooks System

**What:** Lifecycle event management for automated preparation, tracking, and cleanup.

**Available Hooks:**

#### Pre-Operation Hooks
```bash
# Pre-task: Prepare before task begins
npx claude-flow@alpha hooks pre-task \
  --description "Build REST API" \
  --task-id "api-123" \
  --agent-id "backend-dev" \
  --auto-spawn-agents

# Pre-edit: Validate before file modifications
npx claude-flow@alpha hooks pre-edit \
  --file "src/auth.js" \
  --operation edit

# Pre-bash: Check command safety
npx claude-flow@alpha hooks pre-bash \
  --command "rm -rf /tmp/cache"
```

#### Post-Operation Hooks
```bash
# Post-task: Analyze after task completion
npx claude-flow@alpha hooks post-task \
  --task-id "api-123" \
  --analyze-performance \
  --generate-insights

# Post-edit: Format and track after modifications
npx claude-flow@alpha hooks post-edit \
  --file "src/auth.js" \
  --memory-key "swarm/edits/auth"

# Post-bash: Log execution results
npx claude-flow@alpha hooks post-bash \
  --command "npm test" \
  --update-metrics
```

#### Session Hooks
```bash
# Session start: Initialize new session
npx claude-flow@alpha hooks session-start \
  --session-id "dev-session" \
  --load-context

# Session restore: Load previous session
npx claude-flow@alpha hooks session-restore \
  --session-id "dev-session" \
  --restore-memory

# Session end: Cleanup and persist
npx claude-flow@alpha hooks session-end \
  --session-id "dev-session" \
  --export-metrics \
  --generate-summary

# Notify: Custom notifications
npx claude-flow@alpha hooks notify \
  --message "Task completed" \
  --level info \
  --swarm-status
```

**Hook Features:**
- Auto-spawning agents based on task analysis
- Syntax validation before edits
- Auto-formatting after edits
- Performance metrics tracking
- Memory storage for decisions
- Session state persistence

---

## MCP Tools (90+ Available)

### Swarm Orchestration

```javascript
// Initialize swarm with topology
mcp__claude-flow__swarm_init {
  topology: "hierarchical" | "mesh" | "ring" | "star",
  maxAgents: 8,
  strategy: "auto" | "balanced" | "specialized"
}

// Spawn specialized agents
mcp__claude-flow__agent_spawn {
  type: "researcher" | "coder" | "tester" | "reviewer" | "analyst",
  capabilities: ["api", "database", "testing"],
  name: "backend-dev"
}

// Spawn multiple agents in parallel (10-20x faster)
mcp__claude-flow__agents_spawn_parallel {
  agents: [
    { type: "coder", name: "Backend Dev" },
    { type: "tester", name: "Test Engineer" },
    { type: "reviewer", name: "Code Reviewer" }
  ],
  maxConcurrency: 5,
  batchSize: 3
}

// Orchestrate tasks across swarm
mcp__claude-flow__task_orchestrate {
  task: "Build REST API with authentication",
  strategy: "parallel" | "sequential" | "adaptive",
  priority: "low" | "medium" | "high" | "critical",
  maxAgents: 5
}

// Monitor swarm status
mcp__claude-flow__swarm_status {
  swarmId: "swarm-123"
}

// List active agents
mcp__claude-flow__agent_list {
  filter: "all" | "active" | "idle" | "busy"
}

// Get agent metrics
mcp__claude-flow__agent_metrics {
  agentId: "backend-dev"
}

// Scale swarm
mcp__claude-flow__swarm_scale {
  swarmId: "swarm-123",
  targetSize: 10
}

// Destroy swarm
mcp__claude-flow__swarm_destroy {
  swarmId: "swarm-123"
}
```

### Memory Management

```javascript
// Store data in memory
mcp__claude-flow__memory_usage {
  action: "store",
  key: "swarm/agent/status",
  namespace: "coordination",
  value: JSON.stringify({ status: "active" }),
  ttl: 3600  // Optional: expire after 1 hour
}

// Retrieve from memory
mcp__claude-flow__memory_usage {
  action: "retrieve",
  key: "swarm/agent/status",
  namespace: "coordination"
}

// Search memory
mcp__claude-flow__memory_search {
  pattern: "swarm/agent/*",
  namespace: "coordination",
  limit: 10
}

// List memory keys
mcp__claude-flow__memory_usage {
  action: "list",
  namespace: "coordination"
}

// Delete from memory
mcp__claude-flow__memory_usage {
  action: "delete",
  key: "swarm/agent/status",
  namespace: "coordination"
}

// Persist memory across sessions
mcp__claude-flow__memory_persist {
  sessionId: "dev-session"
}

// Namespace management
mcp__claude-flow__memory_namespace {
  action: "create" | "delete" | "list",
  namespace: "custom-namespace"
}

// Backup memory
mcp__claude-flow__memory_backup {
  path: "memory-backup.json"
}

// Restore from backup
mcp__claude-flow__memory_restore {
  backupPath: "memory-backup.json"
}
```

### Neural Training & Patterns

```javascript
// Train neural patterns
mcp__claude-flow__neural_train {
  pattern_type: "coordination" | "optimization" | "prediction",
  training_data: "...",
  epochs: 50
}

// Get neural status
mcp__claude-flow__neural_status {
  modelId: "coordination-model"
}

// Analyze cognitive patterns
mcp__claude-flow__neural_patterns {
  action: "analyze" | "learn" | "predict",
  operation: "task-completion",
  outcome: "success"
}

// Run neural prediction
mcp__claude-flow__neural_predict {
  modelId: "coordination-model",
  input: "task description"
}

// Pattern recognition
mcp__claude-flow__pattern_recognize {
  data: [...],
  patterns: ["mvc", "factory", "singleton"]
}
```

### Task Management

```javascript
// Check task status
mcp__claude-flow__task_status {
  taskId: "task-123",
  detailed: true
}

// Get task results
mcp__claude-flow__task_results {
  taskId: "task-123",
  format: "summary" | "detailed" | "raw"
}
```

### Performance & Analytics

```javascript
// Run benchmarks
mcp__claude-flow__benchmark_run {
  type: "all" | "wasm" | "swarm" | "agent" | "task",
  iterations: 10
}

// Generate performance report
mcp__claude-flow__performance_report {
  format: "summary" | "detailed" | "json",
  timeframe: "24h" | "7d" | "30d"
}

// Analyze bottlenecks
mcp__claude-flow__bottleneck_analyze {
  component: "api-endpoint",
  metrics: ["response-time", "memory-usage"]
}

// Token usage tracking
mcp__claude-flow__token_usage {
  operation: "swarm-coordination",
  timeframe: "24h"
}

// Get metrics
mcp__claude-flow__metrics_collect {
  components: ["swarm", "agents", "memory"]
}
```

### GitHub Integration

```javascript
// Analyze repository
mcp__claude-flow__github_repo_analyze {
  repo: "owner/repo",
  analysis_type: "code_quality" | "performance" | "security"
}

// Manage pull requests
mcp__claude-flow__github_pr_manage {
  repo: "owner/repo",
  action: "review" | "merge" | "close",
  pr_number: 123
}

// Track issues
mcp__claude-flow__github_issue_track {
  repo: "owner/repo",
  action: "list" | "create" | "update" | "close"
}

// Code review
mcp__claude-flow__github_code_review {
  repo: "owner/repo",
  pr: 123
}
```

### Query Control

```javascript
// Control running queries in real-time
mcp__claude-flow__query_control {
  action: "pause" | "resume" | "terminate" | "change_model",
  queryId: "query-123",
  model: "claude-3-5-sonnet-20241022"  // Optional: for change_model
}

// List active queries
mcp__claude-flow__query_list {
  includeHistory: false
}
```

---

## SPARC Methodology

**What:** Systematic development methodology with 5 phases.

### Available Modes

```bash
# List all SPARC modes
npx claude-flow@alpha sparc modes

# Specification mode - Requirements analysis
npx claude-flow@alpha sparc spec "User authentication system"

# Architecture mode - System design
npx claude-flow@alpha sparc architect "Microservices architecture"

# TDD mode - Test-driven development
npx claude-flow@alpha sparc tdd "Payment processing module"

# Integration mode - Component connection
npx claude-flow@alpha sparc integration "Connect frontend to API"

# Refactor mode - Code improvement
npx claude-flow@alpha sparc refactor "Optimize database queries"
```

### SPARC Workflow

**1. Specification** - Requirements analysis and planning
**2. Pseudocode** - Algorithm design (no actual code)
**3. Architecture** - System design and component relationships
**4. Refinement** - TDD implementation with tests
**5. Completion** - Integration and finalization

---

## Agent Types (54 Total)

### Core Development
- `coder` - Implementation specialist
- `reviewer` - Code review and quality
- `tester` - Test creation and validation
- `planner` - Task planning and breakdown
- `researcher` - Information gathering and analysis

### Specialized Development
- `backend-dev` - Backend API development
- `mobile-dev` - Mobile app development
- `ml-developer` - Machine learning
- `cicd-engineer` - CI/CD pipelines
- `system-architect` - System architecture
- `code-analyzer` - Code analysis
- `api-docs` - API documentation

### Swarm Coordination
- `hierarchical-coordinator` - Tree-based coordination
- `mesh-coordinator` - Peer-to-peer coordination
- `adaptive-coordinator` - Dynamic coordination
- `collective-intelligence-coordinator` - Hive mind coordination
- `swarm-memory-manager` - Memory coordination

### Consensus & Distributed
- `byzantine-coordinator` - Byzantine fault tolerance
- `raft-manager` - Raft consensus
- `gossip-coordinator` - Gossip protocol
- `consensus-builder` - Consensus building
- `crdt-synchronizer` - CRDT synchronization
- `quorum-manager` - Quorum management
- `security-manager` - Security coordination

### Performance & Optimization
- `perf-analyzer` - Performance analysis
- `performance-benchmarker` - Benchmarking
- `task-orchestrator` - Task orchestration
- `memory-coordinator` - Memory optimization

### GitHub & Repository
- `github-modes` - GitHub operations
- `pr-manager` - Pull request management
- `code-review-swarm` - Collaborative code review
- `issue-tracker` - Issue tracking
- `release-manager` - Release management
- `workflow-automation` - GitHub Actions
- `project-board-sync` - Project board sync
- `repo-architect` - Repository architecture
- `multi-repo-swarm` - Multi-repo coordination

### Testing & Validation
- `tdd-london-swarm` - London-style TDD
- `production-validator` - Production validation

---

## Key Features

### 1. Parallel Execution
- **10-20x faster** agent spawning with `agents_spawn_parallel`
- Concurrent task orchestration
- Batch operations support

### 2. Neural Intelligence
- 27+ neural models for pattern learning
- Continuous improvement from successful patterns
- Predictive task routing
- Cognitive pattern analysis

### 3. Cross-Session Memory
- SQLite-backed persistent memory
- Namespace isolation
- TTL support for temporary data
- Pattern matching and search

### 4. Performance Tracking
- Real-time metrics collection
- Token usage analytics
- Bottleneck detection
- Performance reporting

### 5. GitHub Integration
- Repository analysis
- Automated code review
- Pull request management
- Issue tracking
- Workflow automation

---

## Configuration

### MCP Server Setup
```bash
# Add claude-flow MCP server
claude mcp add claude-flow npx claude-flow@alpha mcp start

# Add optional enhanced servers
claude mcp add ruv-swarm npx ruv-swarm mcp start
claude mcp add flow-nexus npx flow-nexus@latest mcp start
```

### Initialize Project
```bash
# Initialize claude-flow in project
npx claude-flow@alpha init

# Enable hooks
npx claude-flow@alpha init --hooks

# Enable monitoring
npx claude-flow@alpha init --monitoring
```

### Hooks Configuration (.claude/settings.json)
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "^(Write|Edit|MultiEdit)$",
        "hooks": [{
          "type": "command",
          "command": "npx claude-flow@alpha hooks pre-edit --file '${tool.params.file_path}'"
        }]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "^(Write|Edit|MultiEdit)$",
        "hooks": [{
          "type": "command",
          "command": "npx claude-flow@alpha hooks post-edit --file '${tool.params.file_path}' --auto-format --train-patterns"
        }]
      }
    ]
  }
}
```

---

## Best Practices

### 1. Memory Organization
- Use hierarchical keys: `swarm/agent/status`, `project/auth/decision`
- Namespace by domain: `coordination`, `project`, `session`
- Set TTL for temporary data
- Clean up old entries regularly

### 2. Hook Usage
- Enable auto-formatting in post-edit hooks
- Use pre-task hooks for agent auto-spawning
- Track metrics with post-task hooks
- Session-end hooks for backups

### 3. Agent Coordination
- Use appropriate topology (hierarchical for complex, mesh for peer-to-peer)
- Spawn agents in parallel for speed
- Share context via memory
- Monitor agent metrics

### 4. Performance Optimization
- Batch operations when possible
- Use neural patterns for learning
- Monitor bottlenecks
- Track token usage

---

## Troubleshooting

### Memory Issues
```bash
# Check memory size
ls -lh .swarm/memory.db

# Export and inspect
npx claude-flow@alpha memory export debug.json
cat debug.json | jq .

# Clear namespace
npx claude-flow@alpha memory clear --namespace temp
```

### Hook Failures
```bash
# Enable debug mode
export CLAUDE_FLOW_DEBUG=true

# Test specific hook
npx claude-flow@alpha hooks pre-task --description "test" --debug

# Validate configuration
npx claude-flow@alpha hooks validate-config
```

### Session Restore
```bash
# List available backups
ls -lt .swarm/backups/

# Restore specific session
npx claude-flow@alpha hooks session-restore --session-id "session-20251115-120000"
```

---

## Resources

**Official Documentation:**
- GitHub: https://github.com/ruvnet/claude-flow
- Issues: https://github.com/ruvnet/claude-flow/issues

**MCP Tools:**
- Claude Flow: 90+ orchestration tools
- Ruv-Swarm: Enhanced coordination (optional)
- Flow-Nexus: Cloud features (optional, requires registration)

**Version:** 2.7.35 (alpha)
**License:** MIT
**Maintained by:** ruv.io team
