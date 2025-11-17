# `.claude-flow` Directory Analysis

**Date:** 2025-11-16
**Session:** session-20251116-215913-inbox-cleanup
**Research Scope:** Investigation of `.claude-flow` directories throughout the project

---

## Executive Summary

**Finding:** `.claude-flow` directories are **NOT part of stock claude-flow architecture**. They appear to be **auto-generated performance metrics collection points** created by the claude-flow MCP server during operations.

**Status:** Working as designed, but undocumented in project documentation.

**Key Insights:**
- 9 `.claude-flow` directories found across workspace
- All contain identical `metrics/` subdirectory structure
- Metrics are JSON files tracking system performance, agent activity, and task execution
- No references to `.claude-flow` in CLAUDE.md or project documentation
- Documentation only references `.swarm/` for infrastructure storage

---

## What `.claude-flow` Directories Are For

### Purpose (Inferred from Contents)

`.claude-flow` directories serve as **local performance metrics collection points** for the claude-flow MCP server. They track:

1. **System Metrics** - CPU, memory, platform stats (timestamped samples)
2. **Agent Metrics** - Agent spawning and execution data
3. **Task Metrics** - Task orchestration and completion tracking
4. **Performance Data** - Session timing, operation counts, success/failure rates

### Directory Structure

Each `.claude-flow` directory contains:

```
.claude-flow/
└── metrics/
    ├── agent-metrics.json       # Agent activity tracking
    ├── performance.json         # Session performance data
    ├── system-metrics.json      # System resource usage (timestamped)
    └── task-metrics.json        # Task execution metrics
```

### Sample Metrics Content

**performance.json** (excerpt):
```json
{
  "startTime": 1763361163262,
  "sessionId": "session-1763361163262",
  "lastActivity": 1763361163262,
  "sessionDuration": 0,
  "totalTasks": 1,
  "successfulTasks": 1,
  "failedTasks": 0,
  "totalAgents": 0,
  "activeAgents": 0,
  "neuralEvents": 0,
  "memoryMode": {
    "reasoningbankOperations": 0,
    "basicOperations": 0,
    "autoModeSelections": 0,
    "modeOverrides": 0,
    "currentMode": "auto"
  }
}
```

**system-metrics.json** (excerpt):
```json
[
  {
    "timestamp": 1763358973251,
    "memoryTotal": 8589934592,
    "memoryUsed": 8415477760,
    "memoryFree": 174456832,
    "memoryUsagePercent": 97.97,
    "memoryEfficiency": 2.03,
    "cpuCount": 8,
    "cpuLoad": 0.622,
    "platform": "darwin",
    "uptime": 552522
  }
]
```

---

## Current Locations Found

**Total:** 9 `.claude-flow` directories

### 1. Project Root
**Location:** `/Users/splurfa/common-thread-sandbox/.claude-flow`
**Created:** Nov 13, 2025 (13:41)
**Contents:** Full metrics directory (6 files)
**Purpose:** Primary metrics collection for root-level operations

### 2-9. Archived Sessions & Inbox

| Location | Created | Context |
|----------|---------|---------|
| `inbox/cursor-agent/db-visualization-tools/.claude-flow` | Nov 16 22:16 | Inbox item analysis |
| `sessions/.archive/session-20251116-084306-system-hygiene-check/artifacts/docs/.claude-flow` | Nov 16 12:16 | Session artifacts |
| `sessions/.archive/session-20251114-120738-system-validation/artifacts/code/.claude-flow` | Nov 14 13:54 | Code validation |
| `sessions/.archive/session-20251115-210537-claude-flow-integration-testing/artifacts/.claude-flow` | Nov 15 21:08 | Integration testing |
| `sessions/.archive/session-20251113-211159-hive-mind-setup.backup-before-flatten/.claude-flow` | Nov 14 10:51 | Backup directory |
| `sessions/.archive/session-20251113-211159-hive-mind-setup.backup-before-flatten/iteration-5/artifacts/code/.claude-flow` | Nov 14 10:51 | Nested iteration |
| `sessions/.archive/session-20251113-211159-hive-mind-setup/.claude-flow` | Nov 14 08:44 | Hive-mind setup |
| `sessions/.archive/session-20251115-151900-compliance-analysis/artifacts/docs/.claude-flow` | Nov 15 15:46 | Compliance docs |

---

## Contents of Each Directory

**All directories contain identical structure:**

```bash
.claude-flow/
└── metrics/
    ├── agent-metrics.json       # Usually 2 bytes (empty array: [])
    ├── performance.json         # ~1.6 KB (session metrics)
    ├── system-metrics.json      # 23 KB (root) / varies (system samples)
    └── task-metrics.json        # ~170 bytes (task tracking)
```

**Variation:**
- Root `.claude-flow` has larger `system-metrics.json` (23KB) - longer operation history
- Session/inbox `.claude-flow` have smaller files - shorter operation windows
- Some session directories missing `system-metrics.json` if no system monitoring occurred

---

## Documentation References

### In CLAUDE.md

**`.swarm/` is documented:**
```markdown
## Stock Claude-Flow Features

**Memory Storage** (`.swarm/memory.db`)
**Session Backups**: Auto-created at `.swarm/backups/session-*.json` via session-end hook
```

**`.claude-flow/` is NOT mentioned** - no references in CLAUDE.md

### In Inbox Documentation

**From `inbox/codex-agent/claude-flow-curriculum/`:**
- References to hooks: `hooks session-end --export-metrics true`
- References to metrics commands: `npx claude-flow hive-mind metrics`
- References to memory via `.swarm/memory.db`
- **NO references to `.claude-flow/` directories**

### In Project Guides

**From `docs/guides/`:**
- Extensive documentation of `.swarm/` infrastructure
- Documentation of session lifecycle and hooks
- Documentation of memory and backups
- **NO documentation of `.claude-flow/` directories**

---

## Expected Behavior vs. Actual Behavior

### Expected Behavior (According to Documentation)

**Storage Infrastructure:**
1. `.swarm/memory.db` - SQLite database for persistent memory
2. `.swarm/backups/` - Session snapshots (JSON)
3. `sessions/captains-log/` - Human-curated learning journal

**Hooks System:**
- `npx claude-flow@alpha hooks pre-task`
- `npx claude-flow@alpha hooks post-task`
- `npx claude-flow@alpha hooks session-end --export-metrics true`

**Expected:** Metrics export to `.swarm/backups/` as part of session snapshots

### Actual Behavior (Observed)

**Additional Infrastructure:**
- `.claude-flow/metrics/` directories auto-created during operations
- Metrics written in real-time to these directories
- Multiple `.claude-flow/` instances across workspace (one per operation context)

**Observation:** claude-flow MCP server creates local metrics directories wherever it operates

---

## Is This Expected Behavior or a Bug?

### Evidence for "Working As Designed"

1. **Consistent Structure**: All 9 directories have identical structure - suggests intentional design
2. **Real-Time Tracking**: Metrics files update during operations - active monitoring system
3. **Context-Specific**: Each directory tracks metrics for its specific context (session, inbox item, root)
4. **No Errors**: No error logs or warnings about these directories
5. **Recent Updates**: Metrics files show recent timestamps - actively maintained

### Evidence for "Misconfiguration"

1. **No Documentation**: Zero references in CLAUDE.md, WORKSPACE-GUIDE.md, or project docs
2. **Scattered Locations**: 9 different directories - seems redundant
3. **Archives**: Metrics directories in `.archive/` sessions - orphaned data
4. **File Routing Violation**: Session directories should only contain `artifacts/` subdirectories per CLAUDE.md rules
5. **Inbox Pollution**: `.claude-flow/` in `inbox/cursor-agent/db-visualization-tools/` suggests leaked metrics

### Verdict: **Working as Designed, But Undocumented**

**Conclusion:**
- `.claude-flow/` is **intentional behavior** from claude-flow MCP server
- Purpose: Real-time metrics collection for performance monitoring
- **Issue**: Lack of documentation creates confusion
- **Issue**: Multiple instances suggest metrics aren't being centralized to `.swarm/`

---

## Multiple `.claude-flow/` Directories - Expected or Not?

### Analysis

**Why Multiple Directories Exist:**

1. **Context Isolation**: Each operation context (root, session, inbox) gets its own metrics
2. **Parallel Operations**: Multiple agents/sessions can run simultaneously without metric conflicts
3. **Decentralized Tracking**: Allows per-session performance analysis

**Problems with Current Approach:**

1. **Redundancy**: 9 separate metric stores for same time period
2. **No Aggregation**: Metrics aren't rolled up into `.swarm/` infrastructure
3. **Archive Pollution**: Archived sessions retain `.claude-flow/` directories unnecessarily
4. **Disk Usage**: Multiple JSON files with overlapping data

### Recommendation

**Should there be ONE `.claude-flow/` at project root?**

**Option A: Single Root Directory (Centralized)**
- ✅ Pros: Single source of truth, easier to find metrics, less disk usage
- ❌ Cons: Harder to isolate per-session metrics, potential concurrency issues

**Option B: Multiple Context Directories (Current)**
- ✅ Pros: Isolated metrics per context, parallel-safe, detailed tracking
- ❌ Cons: Scattered data, redundancy, no aggregation

**Option C: Hybrid (Recommended)**
- `.claude-flow/` at project root for global metrics
- Session-specific metrics aggregated into `.swarm/backups/session-*.json` during closeout
- Remove `.claude-flow/` from archived sessions post-closeout
- Add `.claude-flow/` to `.gitignore` (ephemeral data)

---

## Relationship to `.swarm/` Infrastructure

### Current State

**`.swarm/` (Documented):**
- `memory.db` - Persistent memory database (93 MB)
- `backups/` - Session snapshots (32 session files)
- `hooks/` - Hook configuration
- `README.md` - Documentation

**`.claude-flow/` (Undocumented):**
- `metrics/` - Real-time performance tracking
- JSON files, no SQLite
- Scattered across workspace

### Integration Gaps

**What's Missing:**

1. **Metrics Aggregation**: `.claude-flow/metrics/` data should roll up to `.swarm/backups/` during `session-end`
2. **Cleanup Protocol**: Archived sessions should have `.claude-flow/` removed post-closeout
3. **Documentation**: CLAUDE.md should explain `.claude-flow/` purpose and lifecycle
4. **Gitignore**: `.claude-flow/` should be in `.gitignore` (ephemeral metrics)

**Current Flow:**
```
Operation → .claude-flow/metrics/*.json (created)
          → .swarm/memory.db (coordination data)
          → (metrics NOT aggregated to .swarm/backups/)
```

**Expected Flow:**
```
Operation → .claude-flow/metrics/*.json (temporary)
          → .swarm/memory.db (coordination data)
Session End → Aggregate to .swarm/backups/session-*.json
          → Cleanup .claude-flow/ (delete temporary metrics)
```

---

## Stock Claude-Flow Specification Research

### From Inbox Documentation

**`inbox/codex-agent/code-mode-research/phase2-claude-flow-architecture.md`:**

> "Core services include the Orchestrator, Agent Manager, Task Engine, Swarm Coordinator, Memory Manager, and MCP Server, each backed by infrastructure services (database, queue, cache, storage, monitoring)."

**Key Points:**
- Mentions "monitoring" as infrastructure service
- No explicit mention of `.claude-flow/` directories
- Suggests metrics should be part of core infrastructure

**`inbox/codex-agent/claude-flow-curriculum/01-claude-flow-foundations.md`:**

> "Directory layout matters. From CLAUDE.md: never save work in the repo root; use `src/`, `docs/`, `tests/`, `config/`, `scripts/`, etc."

**Implication:** `.claude-flow/` at root is acceptable for infrastructure, but scattered session directories violate this principle

### Stock Hooks Behavior

**From `inbox/codex-agent/claude-flow-curriculum/02-session-lifecycle-and-process.md`:**

```bash
npx claude-flow@alpha hooks session-end --export-metrics true
```

**Purpose:** "Metrics + backups"

**Expected:** Metrics should be exported to `.swarm/backups/` not left in `.claude-flow/`

---

## Recommended Actions

### Immediate (Documentation)

1. **Add `.claude-flow/` to CLAUDE.md**
   - Explain purpose: "Temporary performance metrics collection"
   - Clarify lifecycle: "Auto-created during operations, cleaned during closeout"
   - Add to infrastructure section alongside `.swarm/`

2. **Add to `.gitignore`**
   ```gitignore
   # Claude Flow ephemeral metrics
   .claude-flow/
   ```

3. **Update Session Closeout Protocol**
   - Add step: "Cleanup `.claude-flow/` directories from session artifacts"
   - Ensure metrics aggregated to `.swarm/backups/` before cleanup

### Short-Term (Cleanup)

1. **Remove Orphaned `.claude-flow/` from Archives**
   ```bash
   # Cleanup archived session metrics
   find sessions/.archive -type d -name ".claude-flow" -exec rm -rf {} +
   ```

2. **Remove `.claude-flow/` from Inbox Items**
   ```bash
   # Cleanup inbox metrics
   find inbox -type d -name ".claude-flow" -exec rm -rf {} +
   ```

3. **Keep Only Root `.claude-flow/`**
   - Monitor: `/Users/splurfa/common-thread-sandbox/.claude-flow`
   - Purpose: Global workspace metrics

### Long-Term (Enhancement)

1. **Metrics Aggregation Hook**
   - Create hook: `post-session-metrics` to aggregate `.claude-flow/` → `.swarm/backups/`
   - Auto-cleanup after aggregation

2. **Centralized Metrics Dashboard**
   - Tool: `npx claude-flow@alpha metrics dashboard`
   - Aggregates all `.claude-flow/` data across workspace
   - Visualizes trends over time

3. **Stock Claude-Flow Feature Request**
   - Submit issue to ruvnet/claude-flow repo
   - Request: Official `.claude-flow/` documentation and lifecycle management
   - Suggest: Built-in cleanup during `hooks session-end`

---

## Summary Table

| Aspect | Finding | Status |
|--------|---------|--------|
| **Purpose** | Real-time performance metrics collection | ✅ Working |
| **Structure** | `metrics/` with 4 JSON files | ✅ Consistent |
| **Locations** | 9 directories across workspace | ⚠️ Scattered |
| **Documentation** | Zero references in project docs | ❌ Missing |
| **Aggregation** | Not integrated with `.swarm/backups/` | ❌ Gap |
| **Cleanup** | No automatic cleanup in archives | ❌ Gap |
| **Gitignore** | Not in `.gitignore` | ❌ Missing |
| **Expected Behavior** | Auto-created by MCP server | ✅ Confirmed |

---

## Conclusion

**`.claude-flow/` directories are working as designed** - they're created by the claude-flow MCP server for real-time performance tracking. However:

1. **Documentation Gap**: No mention in CLAUDE.md, WORKSPACE-GUIDE.md, or any project docs
2. **Integration Gap**: Metrics aren't aggregated to `.swarm/backups/` during session closeout
3. **Cleanup Gap**: Archived sessions retain orphaned `.claude-flow/` directories
4. **File Routing Violation**: Multiple directories scattered across workspace (should be centralized or ephemeral)

**This is NOT a bug, but an undocumented feature with incomplete lifecycle management.**

**Recommended Priority:**
1. **High**: Add to `.gitignore` and document in CLAUDE.md
2. **Medium**: Cleanup archived session directories
3. **Low**: Implement metrics aggregation and auto-cleanup hooks

---

## References

- **Project Root**: `/Users/splurfa/common-thread-sandbox/`
- **CLAUDE.md**: No references to `.claude-flow/`
- **WORKSPACE-GUIDE.md**: No references to `.claude-flow/`
- **`.swarm/README.md`**: Documents `.swarm/` infrastructure, not `.claude-flow/`
- **Inbox Documentation**: `inbox/codex-agent/claude-flow-curriculum/` - references metrics via hooks, not directory structure

---

**Generated:** 2025-11-16
**Researcher:** Claude Code (Research Specialist Agent)
**Session:** session-20251116-215913-inbox-cleanup
