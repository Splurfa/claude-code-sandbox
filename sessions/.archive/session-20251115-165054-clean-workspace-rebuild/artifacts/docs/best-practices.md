# Claude-Flow Best Practices

## Overview

This document compiles best practices for using claude-flow based on research, architecture analysis, and established patterns from the ecosystem.

---

## Core Principles

### 1. Stock-First Architecture

**Principle:** Maximize use of stock claude-flow features, minimize custom code.

```bash
# ✅ GOOD: Use stock hooks
npx claude-flow@alpha hooks post-edit --file "auth.js" --auto-format

# ❌ BAD: Custom formatting script
./custom-scripts/format-file.sh auth.js
```

**Benefits:**
- Easy upgrades (`npm update claude-flow@alpha`)
- Community improvements automatic
- Battle-tested reliability
- Minimal maintenance burden

**Target:** 95%+ stock features, <5% custom wrappers

---

### 2. Progressive Disclosure

**Principle:** Load only what's needed, when it's needed.

**Skills Architecture:**
```yaml
# Level 1: Always loaded (metadata only)
---
name: "API Builder"
description: "Creates REST APIs. Use when building APIs."
---

# Level 2: On-demand (when skill active)
## What This Skill Does
[Main instructions]

# Level 3+: Lazy loaded (specific files)
See [Advanced](docs/ADVANCED.md)
```

**Memory Organization:**
```javascript
// Hierarchical keys for scoped loading
"swarm/researcher/findings"       // Specific to researcher
"swarm/shared/decisions"          // Shared across agents
"project/architecture/patterns"   // Project-wide
```

**Result:** 100+ skills with <10KB context overhead

---

### 3. Non-Blocking Operations

**Principle:** Hooks and coordination should never delay execution.

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "^Edit$",
      "hooks": [{
        "command": "npx claude-flow@alpha hooks post-edit ...",
        "async": true,              // ✅ Non-blocking
        "continueOnError": true     // ✅ Error-tolerant
      }]
    }]
  }
}
```

```javascript
// ✅ GOOD: Fire and forget
async function fireHook(cmd) {
  execAsync(cmd).catch(err => console.warn(err));
}

// ❌ BAD: Blocking execution
function fireHook(cmd) {
  execSync(cmd);  // Blocks until complete!
}
```

**Target:** Hook execution <100ms, async for heavy operations

---

## Memory Management

### 1. Hierarchical Organization

```
swarm/
  ├─ agents/
  │  ├─ researcher/
  │  │  ├─ status           # Agent state
  │  │  ├─ findings         # Research results
  │  │  └─ context          # Working context
  │  ├─ coder/
  │  └─ tester/
  │
  ├─ shared/
  │  ├─ decisions           # Cross-agent decisions
  │  ├─ dependencies        # Project dependencies
  │  └─ architecture        # System design
  │
  └─ hooks/
     ├─ pre-task/
     ├─ post-edit/
     └─ session-end/

project/
  ├─ architecture/
  ├─ decisions/
  └─ patterns/
```

### 2. TTL for Temporary Data

```bash
# Temporary status (expires in 1 hour)
npx claude-flow@alpha memory store \
  "swarm/agent/status" \
  "active" \
  --ttl 3600

# Permanent decision (no TTL)
npx claude-flow@alpha memory store \
  "project/decisions/auth-pattern" \
  "JWT with refresh tokens"
```

### 3. Namespace Isolation

```javascript
// Coordination namespace (agent-to-agent)
mcp__claude-flow__memory_usage {
  action: "store",
  key: "swarm/researcher/findings",
  namespace: "coordination",
  value: "..."
}

// Project namespace (persistent decisions)
mcp__claude-flow__memory_usage {
  action: "store",
  key: "architecture/patterns",
  namespace: "project",
  value: "..."
}

// Session namespace (temporary work)
mcp__claude-flow__memory_usage {
  action: "store",
  key: "current-task",
  namespace: "session",
  value: "...",
  ttl: 86400  // 24 hours
}
```

### 4. Regular Cleanup

```bash
# List all namespaces
npx claude-flow@alpha memory list

# Clear temporary namespace
npx claude-flow@alpha memory clear --namespace session

# Export before cleanup
npx claude-flow@alpha memory export backup.json

# Backup database
cp .swarm/memory.db .swarm/memory.db.backup
```

---

## Hook Configuration

### 1. Configure in settings.json (Not Wrapper)

```json
// ✅ GOOD: Native Claude Code integration
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "^Edit$",
      "hooks": [{
        "type": "command",
        "command": "npx claude-flow@alpha hooks post-edit --file '${tool.params.file_path}'"
      }]
    }]
  }
}

// ❌ BAD: Monkey-patching fs module
const fs = require('fs');
fs.writeFileSync = function(...args) { /* custom logic */ };
```

**Why:**
- Native parameter interpolation
- Better error handling
- No runtime patching
- Supported by Claude Code

### 2. Use Async for Heavy Operations

```json
{
  "hooks": [{
    "command": "npx claude-flow@alpha hooks post-task --analyze-performance",
    "async": true,        // ✅ Run in background
    "timeout": 10000      // 10 second timeout
  }]
}
```

### 3. Error Tolerance

```json
{
  "hooks": [{
    "command": "npx claude-flow@alpha hooks post-edit --file '${tool.params.file_path}'",
    "continueOnError": true  // ✅ Don't break on hook failure
  }]
}
```

---

## Agent Coordination

### 1. Claude Code for Execution, MCP for Coordination

```javascript
// 1. Optional: MCP tools for coordination setup
mcp__claude-flow__swarm_init {
  topology: "mesh",
  maxAgents: 6
}

// 2. Required: Claude Code Task tool for actual execution
Task("Backend Dev", "Implement API. Save to sessions/$SESSION_ID/artifacts/code/", "backend-dev")
Task("Tester", "Create tests. Save to sessions/$SESSION_ID/artifacts/tests/", "tester")

// 3. Agents coordinate via memory
mcp__claude-flow__memory_usage {
  action: "store",
  key: "swarm/backend/api-spec",
  namespace: "coordination",
  value: "..."
}
```

**Key Pattern:**
- MCP = Strategy and monitoring
- Claude Code Task = Actual execution
- Memory = Communication between agents

### 2. Share Context via Memory

```javascript
// Agent 1: Store findings
mcp__claude-flow__memory_usage {
  action: "store",
  key: "swarm/researcher/auth-analysis",
  namespace: "coordination",
  value: JSON.stringify({
    recommendation: "JWT",
    patterns: ["Bearer token", "Refresh token"],
    libraries: ["jsonwebtoken", "bcrypt"]
  })
}

// Agent 2: Read findings
const findings = await mcp__claude-flow__memory_usage {
  action: "retrieve",
  key: "swarm/researcher/auth-analysis",
  namespace: "coordination"
}

// Agent 2: Implement based on findings
// (Implementation uses findings.recommendation, findings.libraries)
```

### 3. Status Reporting

```javascript
// Report status during work
mcp__claude-flow__memory_usage {
  action: "store",
  key: "swarm/coder/status",
  namespace: "coordination",
  value: JSON.stringify({
    status: "implementing",
    feature: "authentication",
    progress: 60,
    files: ["src/auth.js", "src/middleware/jwt.js"],
    timestamp: Date.now()
  }),
  ttl: 3600  // Expire in 1 hour
}

// Other agents can monitor
const status = await mcp__claude-flow__memory_search {
  pattern: "swarm/*/status",
  namespace: "coordination"
}
```

---

## Session Management

### 1. One Session Per Chat Thread

```bash
# Session ID format: session-YYYYMMDD-HHMMSS-<topic>
SESSION_ID="session-20251115-120000-api-development"

# All work goes to session directory
sessions/$SESSION_ID/
├── artifacts/
│   ├── code/
│   ├── tests/
│   ├── docs/
│   └── scripts/
└── metadata.json
```

### 2. Session Lifecycle

```bash
# 1. Session Start (optional, via hook)
npx claude-flow@alpha hooks session-start \
  --session-id "$SESSION_ID" \
  --load-context

# 2. Work Phase (hooks fire automatically)
# ... agent work ...

# 3. Session Closeout (via skill or manual)
npx claude-flow@alpha hooks session-end \
  --session-id "$SESSION_ID" \
  --export-metrics \
  --generate-summary

# 4. Archive (move to .archive)
mv "sessions/$SESSION_ID" "sessions/.archive/"
```

### 3. Context Restoration

```bash
# Restore previous session context
npx claude-flow@alpha hooks session-restore \
  --session-id "session-20251115-120000-api-development" \
  --restore-memory

# Or read from backup
cat .swarm/backups/session-20251115-120000-api-development.json | jq .
```

---

## Skills Development

### 1. Follow Progressive Disclosure

```markdown
# ✅ GOOD: Layered structure
---
name: "Skill Name"
description: "What and when in <1024 chars"
---

# Quick Start (Level 2)
## What This Skill Does

# Detailed Guide (Level 3)
## Step-by-Step Instructions

# Reference (Level 4)
See [Advanced](docs/ADVANCED.md)
```

### 2. Front-Load Keywords

```yaml
# ✅ GOOD: Keywords first
description: "Generate TypeScript from JSON schema.
Use when converting schemas, creating types, building API clients."

# ❌ BAD: Keywords buried
description: "This skill helps developers who work with JSON
schemas by providing a comprehensive way to generate TypeScript."
```

### 3. Keep SKILL.md Lean

```markdown
# Target: 2-5KB for SKILL.md

## What This Skill Does
[Brief overview]

## Quick Start
[80% use case]

## Advanced
For complex scenarios, see [ADVANCED.md](docs/ADVANCED.md)

## Examples
See [examples/](resources/examples/)
```

---

## Performance Optimization

### 1. Batch Operations

```javascript
// ✅ GOOD: Spawn agents in parallel
mcp__claude-flow__agents_spawn_parallel {
  agents: [
    { type: "researcher", name: "Researcher" },
    { type: "coder", name: "Coder" },
    { type: "tester", name: "Tester" }
  ],
  maxConcurrency: 5
}

// ❌ BAD: Sequential spawning
await mcp__claude-flow__agent_spawn { type: "researcher" }
await mcp__claude-flow__agent_spawn { type: "coder" }
await mcp__claude-flow__agent_spawn { type: "tester" }
```

**Result:** 10-20x faster agent spawning

### 2. Cache Frequently Accessed Data

```bash
# Cache search results
npx claude-flow@alpha hooks post-search \
  --query "authentication" \
  --cache-results

# Cache analysis
npx claude-flow@alpha hooks post-task \
  --task-id "analysis" \
  --store-decisions
```

### 3. Monitor Performance

```javascript
// Track metrics
mcp__claude-flow__benchmark_run {
  type: "swarm",
  iterations: 10
}

// Identify bottlenecks
mcp__claude-flow__bottleneck_analyze {
  component: "coordination",
  metrics: ["response-time", "memory-usage"]
}

// Generate reports
mcp__claude-flow__performance_report {
  format: "detailed",
  timeframe: "24h"
}
```

---

## Error Handling

### 1. Graceful Degradation

```javascript
// ✅ GOOD: Fallback on hook failure
try {
  await fireHook('post-edit', '--file auth.js');
} catch (error) {
  console.warn('Hook failed, continuing:', error.message);
  // Continue with operation
}

// ❌ BAD: Abort on hook failure
await fireHook('post-edit', '--file auth.js');
// Throws error, breaks workflow
```

### 2. Log Don't Throw

```javascript
// ✅ GOOD: Log and continue
if (hookFailed) {
  console.warn('⚠️  Hook warning:', error.message);
  // Continue operation
}

// ❌ BAD: Throw and break
if (hookFailed) {
  throw new Error('Hook failed!');
}
```

### 3. Validation Before Operations

```bash
# Pre-edit hook validates
npx claude-flow@alpha hooks pre-edit \
  --file "auth.js" \
  --validate-syntax \
  --check-conflicts

# Returns { continue: false } if validation fails
# Operation blocked before breaking anything
```

---

## Security Best Practices

### 1. Never Store Secrets in Memory

```javascript
// ❌ BAD: Storing API key
mcp__claude-flow__memory_usage {
  action: "store",
  key: "config/api-key",
  value: "sk-secret-key-123"
}

// ✅ GOOD: Reference to env var
mcp__claude-flow__memory_usage {
  action: "store",
  key: "config/api-key-source",
  value: "process.env.API_KEY"
}
```

### 2. Validate User Input

```bash
# Pre-bash hook validates dangerous commands
npx claude-flow@alpha hooks pre-bash \
  --command "rm -rf /" \
  --validate-safety

# Returns { continue: false, reason: "Dangerous command" }
```

### 3. Protect Sensitive Files

```json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "^Edit$",
      "hooks": [{
        "command": "if [[ '${tool.params.file_path}' == *.env ]]; then exit 1; fi"
      }]
    }]
  }
}
```

---

## Testing Practices

### 1. Test Hooks in Isolation

```bash
# Test single hook
npx claude-flow@alpha hooks pre-edit \
  --file "test.js" \
  --debug

# Validate configuration
cat .claude/settings.json | jq .hooks
```

### 2. Dry Run for Major Operations

```bash
# Preview session closeout
npx claude-flow@alpha hooks session-end \
  --session-id "test-session" \
  --dry-run

# Preview memory export
npx claude-flow@alpha memory export preview.json --dry-run
```

### 3. Monitor Hook Performance

```bash
# Enable debug mode
export CLAUDE_FLOW_DEBUG=true

# Time hook execution
time npx claude-flow@alpha hooks post-edit --file "test.js"

# Check logs
cat .claude-flow/logs/hooks-$(date +%Y-%m-%d).log
```

---

## Documentation Practices

### 1. Document Decisions in Memory

```javascript
mcp__claude-flow__memory_usage {
  action: "store",
  key: "project/decisions/2025-11-15-auth-pattern",
  namespace: "project",
  value: JSON.stringify({
    decision: "Use JWT with refresh tokens",
    rationale: "Stateless, scalable, mobile-friendly",
    alternatives: ["Session cookies", "OAuth2"],
    trade-offs: "More complex token refresh logic",
    date: "2025-11-15"
  })
}
```

### 2. Update Captain's Log

```bash
# Via hook
npx claude-flow@alpha hooks notify \
  --message "Decision: JWT authentication chosen for scalability" \
  --level "info"

# Manual entry
npx claude-flow@alpha hooks journal \
  --entry "Today implemented JWT auth. Trade-off: complex refresh logic but better for mobile."
```

### 3. Generate Session Summaries

```bash
npx claude-flow@alpha hooks session-end \
  --session-id "$SESSION_ID" \
  --generate-summary \
  --export-metrics

# Creates comprehensive summary in backup
cat .swarm/backups/session-$SESSION_ID.json | jq .summary
```

---

## Troubleshooting Guide

### Issue: Hooks Not Firing

**Solution:**
```bash
# 1. Check settings.json syntax
cat .claude/settings.json | jq .

# 2. Verify Claude Code version (requires 1.0.51+)

# 3. Enable debug mode
export CLAUDE_FLOW_DEBUG=true

# 4. Test hook manually
npx claude-flow@alpha hooks post-edit --file "test.js" --debug
```

### Issue: Memory Not Syncing

**Solution:**
```bash
# 1. List memory contents
npx claude-flow@alpha memory list --namespace coordination

# 2. Search for specific keys
npx claude-flow@alpha memory export debug.json
cat debug.json | jq 'keys'

# 3. Check database
sqlite3 .swarm/memory.db "SELECT * FROM agent_memory LIMIT 10;"
```

### Issue: Poor Performance

**Solution:**
```bash
# 1. Profile hook execution
time npx claude-flow@alpha hooks post-task --task-id "test"

# 2. Check for blocking operations
# Ensure async: true in settings.json

# 3. Reduce hook complexity
# Move heavy operations to background jobs

# 4. Monitor metrics
npx claude-flow@alpha benchmark run --type swarm
```

---

## Summary Checklist

**Stock-First:**
- [ ] Using 95%+ stock claude-flow features
- [ ] Minimal custom wrappers (<5%)
- [ ] Regular updates (`npm update claude-flow@alpha`)

**Memory:**
- [ ] Hierarchical keys (`swarm/agent/feature`)
- [ ] Namespaced by domain (coordination, project, session)
- [ ] TTL for temporary data
- [ ] Regular cleanup and backups

**Hooks:**
- [ ] Configured in .claude/settings.json
- [ ] Async for heavy operations
- [ ] Error-tolerant (continueOnError: true)
- [ ] Non-blocking (<100ms)

**Agents:**
- [ ] Claude Code Task tool for execution
- [ ] MCP tools for coordination
- [ ] Memory for communication
- [ ] Status reporting

**Sessions:**
- [ ] One session per chat thread
- [ ] All work in sessions/$SESSION_ID/artifacts/
- [ ] Session closeout before archive
- [ ] Backups in .swarm/backups/

**Skills:**
- [ ] Progressive disclosure (3-level)
- [ ] Front-loaded keywords
- [ ] SKILL.md ~2-5KB
- [ ] Top-level directory only

**Performance:**
- [ ] Batch operations
- [ ] Parallel agent spawning
- [ ] Cached results
- [ ] Monitored metrics

**Result:** Production-ready claude-flow workspace with best practices applied.
