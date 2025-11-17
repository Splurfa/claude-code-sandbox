# Stock Claude-Flow Research: Hive Mind & Session Management

**Research Date:** 2025-11-16
**Session:** session-20251116-151059-coherence-analysis
**Purpose:** Understand stock claude-flow capabilities before building custom integrations

---

## Executive Summary

**Key Finding:** Stock claude-flow has TWO distinct session systems that serve different purposes:

1. **Hive-Mind Sessions** (`.hive-mind/sessions/`) - MCP-managed swarm coordination
2. **Memory Sessions** (`.swarm/memory.db` namespace) - Cross-session memory tracking
3. **Custom Sessions** (`sessions/`) - Custom workspace management (not stock)

**Critical Discovery:** These systems are COMPLEMENTARY, not competing. The conflict is perceived, not actual.

---

## Stock Features Discovery

### 1. Hive-Mind Session Management

**Location:** `.hive-mind/sessions/`

**Database:** `.hive-mind/hive.db` (SQLite)

**Commands:**
```bash
# List all hive-mind sessions
npx claude-flow hive-mind sessions

# Initialize hive mind
npx claude-flow hive-mind init

# Spawn swarm
npx claude-flow hive-mind spawn "Objective" --claude

# Resume session
npx claude-flow hive-mind resume <session-id>

# Stop session
npx claude-flow hive-mind stop <session-id>
```

**What It Does:**
- Tracks swarm coordination state (queen + workers)
- Manages agent assignments and task distribution
- Stores consensus decisions
- Tracks progress metrics (agents, tasks, completion %)
- Creates checkpoints of swarm state

**What It Stores:**
```javascript
// Example from live system
{
  "session_id": "session-1763167459433-uur8ylsaj",
  "swarm_id": "hive-1763167459417",
  "status": "active",
  "objective": "Implement stock-first session management...",
  "progress": "0%",
  "agents": 5,
  "tasks": "0/0",
  "created": "2025-11-15T00:44:19",
  "last_updated": "2025-11-15T00:44:49"
}
```

**Key Insight:** This is MCP-level coordination metadata, NOT workspace file management.

---

### 2. Collective Memory System

**Location:** `.swarm/memory.db` (SQLite)

**Tables:**
- `memory_entries` - Key-value storage with namespaces
- `patterns` - Learned patterns from ReasoningBank
- `pattern_embeddings` - Vector embeddings for pattern matching
- `task_trajectories` - Agent trajectory history
- `metrics_log` - Performance metrics

**Namespaces Found:**
```
agent-assignments      # Who's working on what
agents                 # Agent metadata
command-history        # CLI command tracking
coordination           # Swarm coordination state
default                # General purpose
file-history           # Edit tracking
hooks:*                # Hook execution logs
journal                # Captain's log entries
performance-metrics    # Performance data
sessions               # Session metadata (not workspace files!)
swarms                 # Swarm definitions
system                 # System state
```

**Session Namespace Structure:**
```json
{
  "key": "session:session-1763004305143-2305s8tmh",
  "value": {
    "sessionId": "session-1763004305143-2305s8tmh",
    "endedAt": "2025-11-13T03:25:05.143Z",
    "totalTasks": 3,
    "totalEdits": 3,
    "totalCommands": 71,
    "metrics": {
      "sessionDuration": 577890,
      "sessionDurationHuman": "10 minutes",
      "commandSuccessRate": 100
    }
  }
}
```

**Key Insight:** Memory sessions track METRICS, not file artifacts.

---

### 3. Session Backups

**Location:** `.swarm/backups/session-*.json`

**Structure:**
```json
{
  "sessionId": "session-2025-11-14T19-30-00-hive-mind-setup",
  "timestamp": "2025-11-14T19:30:00Z",
  "status": "completed",
  "summary": "...",
  "artifacts": {
    "code": ["file1.js", "file2.js"],
    "tests": ["test1.js"],
    "docs": ["README.md"]
  },
  "validations": [...],
  "criticalFixes": [...],
  "productionReadiness": {...}
}
```

**When Created:**
- Auto-created during `npx claude-flow@alpha hooks session-end`
- Manual via `--export-metrics true`

**Key Insight:** Backups store session SUMMARIES and file lists, not the files themselves.

---

### 4. Stock Hive-Mind Integration Patterns

**From `.claude/skills/hive-mind-advanced/SKILL.md`:**

#### Integration with Claude Code

**Recommended Pattern:**
```bash
# Generate Claude Code spawn commands
npx claude-flow hive-mind spawn "Build REST API" --claude
```

**Output:**
```javascript
Task("Queen Coordinator", "Orchestrate REST API development...", "coordinator")
Task("Backend Developer", "Implement Express routes...", "backend-dev")
Task("Database Architect", "Design PostgreSQL schema...", "code-analyzer")
Task("Test Engineer", "Create Jest test suite...", "tester")
```

**Key Finding:** Hive-mind generates Task() commands for Claude Code to execute.

#### Integration with SPARC

```bash
# Use hive mind for SPARC workflow
npx claude-flow sparc tdd "User authentication" --hive-mind
```

Spawns: Specification → Architecture → Coder → Tester → Reviewer agents

#### File Organization

**From SKILL.md (lines 222-262):**
- No explicit file routing instructions
- Mentions "deliverables" but doesn't specify location
- Focus is on agent coordination, not file management

**Implication:** Stock hive-mind is AGNOSTIC about file locations.

---

### 5. Hooks Integration

**Available Hooks:**

```bash
# Pre-task (setup)
npx claude-flow@alpha hooks pre-task --description "task" --task-id "id"

# Post-task (cleanup, memory updates)
npx claude-flow@alpha hooks post-task --task-id "id" --status "completed"

# Post-edit (file tracking)
npx claude-flow@alpha hooks post-edit --file "path" --memory-key "key"

# Session end (closeout, backups)
npx claude-flow@alpha hooks session-end --export-metrics true

# Session restore (context restoration)
npx claude-flow@alpha hooks session-restore --session-id "id"

# Memory operations (via MCP, NOT hooks)
mcp__claude-flow_alpha__memory_usage({
  action: "store|retrieve|list|search",
  key: "key",
  value: "data",
  namespace: "default"
})
```

**Hook Purposes (from SKILL.md):**
- **Pre-task:** Auto-assign agents, validate complexity, cache patterns
- **Post-task:** Format deliverables, train patterns, update memory
- **Session:** Generate summaries, persist checkpoints, track metrics

**Key Insight:** Hooks manage COORDINATION and MEMORY, not file routing.

---

## Stock vs Custom Comparison

| Feature | Stock Claude-Flow | Custom Implementation | Conflict? |
|---------|-------------------|----------------------|-----------|
| **Session Directory** | `.hive-mind/sessions/` (coordination state) | `sessions/` (workspace artifacts) | ❌ NO - Different purposes |
| **Session Command** | `npx claude-flow hive-mind sessions` (list swarms) | `/session-start` (create workspace) | ❌ NO - Different operations |
| **Memory Location** | `.swarm/memory.db` (all namespaces) | Same `.swarm/memory.db` | ✅ SHARED - Good! |
| **Artifacts Location** | Not specified by stock | `sessions/*/artifacts/` | ✅ COMPATIBLE |
| **Session Tracking** | `.hive-mind/hive.db` (swarm state) | `sessions/*/metadata.json` (workspace state) | ❌ NO - Different data |
| **Backups** | `.swarm/backups/session-*.json` (summaries) | Same location | ✅ SHARED - Good! |
| **Scope** | Swarm coordination lifecycle | Chat conversation lifecycle | ⚠️ DIFFERENT but compatible |

---

## Stock Integration Patterns: What's Recommended

### From Documentation Analysis

**1. Claude Code Integration (SKILL.md lines 222-238)**

Stock recommends:
- Use `--claude` flag to generate Task() commands
- Hive-mind coordinates, Claude Code executes
- No file routing specified

**2. SPARC Integration (SKILL.md lines 240-252)**

Stock recommends:
- `--hive-mind` flag with SPARC commands
- Auto-spawns methodology-specific agents
- No file organization specified

**3. Memory Coordination (SKILL.md lines 347-367)**

Stock uses hooks for:
- Collective memory updates
- Pattern training
- Performance tracking

**4. Session Management (SKILL.md lines 104-128)**

Stock hive-mind sessions:
- Auto-checkpoint creation
- Progress tracking (completion %)
- Parent-child process management
- Export/import capabilities

**Critical Absence:** Stock documentation does NOT specify where artifacts should live.

---

## Analysis: Where They Align

### 1. Shared Infrastructure

**Both use `.swarm/memory.db`:**
- Stock namespaces: `coordination`, `swarms`, `agents`, `sessions` (metrics)
- Custom can use: Same namespaces + custom ones
- **Alignment:** 100% - Same database, different namespaces

**Both use `.swarm/backups/`:**
- Stock creates session summaries
- Custom can add artifact listings
- **Alignment:** 100% - Same location, compatible format

### 2. Complementary Scopes

**Stock hive-mind tracks:**
- Swarm coordination (queen + workers)
- Agent assignments
- Consensus decisions
- Task distribution

**Custom sessions track:**
- Workspace organization
- File artifacts
- Work outputs
- Conversation context

**Alignment:** 95% - Different concerns, both needed

### 3. Hook System

**Both use stock hooks:**
- `pre-task`, `post-task`, `post-edit`, `session-end`
- Stock fires them for coordination
- Custom can fire them for workspace events

**Alignment:** 100% - Same hook system, different triggers

---

## Analysis: Where They Conflict

### 1. Session ID Generation

**Stock:** `session-<timestamp>-<random>`
**Custom:** `session-YYYYMMDD-HHMMSS-<topic>`

**Conflict Level:** LOW
**Resolution:** Custom pattern is more human-readable, doesn't break stock

### 2. Session Scope Definition

**Stock:** One session per swarm spawn (can have many per chat)
**Custom:** One session per chat conversation

**Conflict Level:** MEDIUM
**Impact:** Potential confusion about "active session"
**Resolution:** Clarify that:
- Hive-mind session = swarm coordination instance
- Workspace session = conversation workspace

### 3. Directory Structure

**Stock:** Uses `.hive-mind/sessions/` for swarm state
**Custom:** Uses `sessions/` for artifacts

**Conflict Level:** NONE
**Reason:** Different directories, different purposes

---

## Analysis: Where They Complement

### 1. Hive-Mind + Workspace Sessions

**Workflow:**
```
1. User starts chat → Custom creates sessions/session-*/
2. User runs hive-mind wizard → Stock creates .hive-mind/sessions/swarm-*/
3. Hive-mind generates Task() commands
4. Agents execute, save to sessions/session-*/artifacts/
5. Hive-mind tracks coordination in .hive-mind/
6. Session closeout:
   - Stock: session-end hook → .swarm/backups/
   - Custom: metadata.json updated
```

**Complementarity:** Stock coordinates agents, custom organizes outputs.

### 2. Memory Integration

**Stock namespaces for coordination:**
- `coordination` - Swarm state
- `agents` - Agent assignments
- `swarms` - Swarm definitions

**Custom namespaces for artifacts:**
- `sessions` - Workspace metadata
- `file-history` - Edit tracking
- `journal` - Captain's log

**Complementarity:** Same memory system, different data domains.

### 3. Hooks as Integration Points

**Stock hooks trigger:**
- Swarm initialization
- Agent spawning
- Task completion
- Consensus building

**Custom hooks trigger:**
- Workspace creation
- File routing
- Artifact tracking
- Session closeout

**Complementarity:** Same hook system, different lifecycle events.

---

## Recommended Integration Patterns

### Option 1: Parallel Systems (CURRENT STATE)

**Use when:**
- Working without hive-mind coordination
- Simple single-agent tasks
- Small projects

**Pattern:**
```
sessions/session-YYYYMMDD-HHMMSS-<topic>/   ← Custom workspace
  artifacts/code/
  artifacts/tests/
  metadata.json

.swarm/memory.db                            ← Shared memory
.swarm/backups/                             ← Shared backups
```

**Pros:** Simple, no coordination overhead
**Cons:** No swarm coordination benefits

---

### Option 2: Nested Integration (RECOMMENDED)

**Use when:**
- Complex tasks requiring multiple agents
- Hive-mind coordination needed
- Full workspace organization desired

**Pattern:**
```
# Chat starts
sessions/session-YYYYMMDD-HHMMSS-api-development/
  artifacts/code/          ← All Task() agents save here
  artifacts/tests/
  artifacts/docs/
  metadata.json

# Hive-mind spawns swarm
.hive-mind/sessions/
  swarm-<timestamp>-<id>/  ← Coordination state only
    state.json
    checkpoints/

# Shared infrastructure
.swarm/
  memory.db                ← Both use same memory
  backups/                 ← Both create backups
```

**Workflow:**
```bash
# 1. Chat starts (auto)
# → Custom creates sessions/session-*/

# 2. Spawn hive-mind
npx claude-flow hive-mind spawn "Build API" --claude

# 3. Execute generated Task() commands
# → Agents save to sessions/session-*/artifacts/

# 4. Hive-mind tracks coordination
# → .hive-mind/sessions/swarm-*/state.json updated

# 5. Session closeout
# → Custom: metadata.json updated
# → Stock: .swarm/backups/session-*.json created
```

**Pros:**
- Stock coordination + custom organization
- Clear separation of concerns
- Both systems work together
- Shared memory enables coordination

**Cons:**
- Two session concepts (explain in docs)
- Slightly more complex

---

### Option 3: Stock-First (ALTERNATIVE)

**Use when:**
- Primarily hive-mind driven work
- Less emphasis on workspace organization
- Maximize stock alignment

**Pattern:**
```
.hive-mind/sessions/
  swarm-<id>/
    artifacts/code/      ← Move workspace here
    artifacts/tests/
    artifacts/docs/
    state.json

.swarm/
  memory.db
  backups/
```

**Pros:**
- Everything under stock structure
- Maximum stock alignment
- Simpler mental model

**Cons:**
- Loses custom session-per-chat pattern
- Less human-readable organization
- Harder to navigate old work

---

## Recommended Approach: Option 2 (Nested Integration)

### Rationale

1. **Stock hive-mind is coordination-focused, not file-focused**
   - No opinionated file routing in documentation
   - Designed for agent orchestration, not workspace management
   - Compatible with any file organization

2. **Custom sessions provide workspace value**
   - Human-readable session names
   - Clear artifact organization
   - One session per chat (intuitive)
   - Easy to review past work

3. **Shared infrastructure works perfectly**
   - Both use `.swarm/memory.db`
   - Both use `.swarm/backups/`
   - Hooks work for both
   - No schema conflicts

4. **Different concerns, both valid**
   - Hive-mind: Agent coordination state
   - Custom: Workspace artifact organization
   - These are complementary, not competing

### Integration Protocol

**Session Lifecycle:**
```
1. Chat starts
   → Custom auto-creates sessions/session-YYYYMMDD-HHMMSS-<topic>/

2. Work begins (optional hive-mind)
   IF complex task:
     → npx claude-flow hive-mind spawn "objective" --claude
     → Creates .hive-mind/sessions/swarm-*/
     → Generates Task() commands
   ELSE:
     → Direct agent work

3. Agents execute
   → ALL artifacts save to sessions/session-*/artifacts/
   → Coordination state updates .hive-mind/sessions/swarm-*/
   → Memory updates in .swarm/memory.db

4. Session closeout
   → npx claude-flow@alpha hooks session-end
   → Creates .swarm/backups/session-*.json
   → Updates sessions/session-*/metadata.json
   → Hive-mind swarm can continue or stop independently
```

**Memory Namespace Convention:**
```
coordination/        ← Stock hive-mind coordination
swarms/              ← Stock swarm definitions
agents/              ← Stock agent assignments
sessions/            ← Custom workspace metadata
file-history/        ← Custom edit tracking
journal/             ← Captain's log (stock + custom)
```

**Documentation Updates Needed:**
1. Clarify two session concepts (coordination vs workspace)
2. Recommend hive-mind for complex tasks
3. Show integration workflow
4. Update CLAUDE.md with integration pattern

---

## Questions for HITL

### 1. Integration Pattern Approval

**Q:** Do you approve Option 2 (Nested Integration) as the recommended pattern?

**Why it matters:** Sets the foundation for all future coordination work.

**Alternatives:**
- Option 1: Keep systems separate (simpler but less powerful)
- Option 3: Move everything to stock structure (loses custom benefits)

### 2. Session Naming Clarification

**Q:** Should we rename to avoid confusion?

**Proposed terminology:**
- "Workspace Session" = Custom `sessions/` (conversation scope)
- "Swarm Session" = Stock `.hive-mind/sessions/` (coordination scope)

**Current:** Both called "sessions" but mean different things.

### 3. Documentation Priority

**Q:** Which docs need updating first?

**Options:**
- CLAUDE.md - Core integration protocol
- WORKSPACE-GUIDE.md - Detailed patterns
- sessions/README.md - User-facing guide
- .swarm/README.md - Infrastructure explanation

### 4. Hive-Mind Default Recommendation

**Q:** When should we recommend hive-mind?

**Proposed threshold:**
- 3+ agents needed → Recommend hive-mind
- 2 agents → Optional
- 1 agent → Don't use hive-mind

**Trade-off:** Coordination overhead vs coordination benefits.

---

## Next Steps (Based on HITL Approval)

### Phase 1: Documentation Alignment
- [ ] Update CLAUDE.md with integration protocol
- [ ] Clarify session terminology in all docs
- [ ] Add hive-mind integration examples
- [ ] Update README files for both systems

### Phase 2: Code Integration
- [ ] Ensure hooks fire correctly for both systems
- [ ] Test memory namespace separation
- [ ] Validate backup format compatibility
- [ ] Test nested workflow end-to-end

### Phase 3: Testing
- [ ] Create integration test session
- [ ] Spawn hive-mind within custom session
- [ ] Verify artifacts land in correct locations
- [ ] Validate memory coordination
- [ ] Test session closeout with both systems

### Phase 4: Refinement
- [ ] Add helper commands for integration
- [ ] Create workflow templates
- [ ] Update agent instructions
- [ ] Document common patterns

---

## Appendix: Technical Details

### Stock Hive-Mind Database Schema

**`.hive-mind/hive.db` tables:**
- `sessions` - Swarm session metadata
- `agents` - Agent definitions
- `tasks` - Task assignments
- `consensus` - Voting records
- `checkpoints` - State snapshots

**`.swarm/memory.db` tables:**
- `memory_entries` - Key-value store
- `patterns` - ReasoningBank patterns
- `pattern_embeddings` - Vector search
- `pattern_links` - Pattern relationships
- `task_trajectories` - Agent history
- `metrics_log` - Performance data

### Custom Session Structure

**Workspace organization:**
```
sessions/session-YYYYMMDD-HHMMSS-<topic>/
├── artifacts/
│   ├── code/          # Source files
│   ├── tests/         # Test files
│   ├── docs/          # Documentation
│   ├── scripts/       # Utility scripts
│   └── notes/         # Working notes
├── metadata.json      # Session state
└── session-summary.md # Auto-generated summary
```

**metadata.json schema:**
```json
{
  "session_id": "session-YYYYMMDD-HHMMSS-<topic>",
  "created_at": "ISO-8601",
  "status": "active|completed|archived",
  "topic": "Extracted from first message",
  "artifacts_created": 0,
  "last_updated": "ISO-8601"
}
```

### Integration Points

**1. Memory Coordination:**
```javascript
// Hive-mind stores coordination state
mcp__claude-flow_alpha__memory_usage({
  action: "store",
  namespace: "coordination",
  key: "swarm/swarm-123/state",
  value: JSON.stringify({agents: 5, tasks: 12})
})

// Custom stores workspace metadata
mcp__claude-flow_alpha__memory_usage({
  action: "store",
  namespace: "sessions",
  key: "session-20251116-150000-api/metadata",
  value: JSON.stringify({files: 8, status: "active"})
})
```

**2. Hook Coordination:**
```bash
# Hive-mind triggers pre-task for agent spawn
npx claude-flow@alpha hooks pre-task \
  --description "Spawn backend developer" \
  --task-id "swarm-123-agent-backend"

# Custom triggers post-edit for file tracking
npx claude-flow@alpha hooks post-edit \
  --file "sessions/session-*/artifacts/code/server.js" \
  --memory-key "sessions/session-*/edits/server.js"
```

**3. Backup Format:**
```json
{
  "sessionId": "session-20251116-150000-api",
  "timestamp": "2025-11-16T15:00:00Z",
  "summary": "Built REST API with authentication",

  // Custom additions
  "workspace": {
    "artifacts": ["code/server.js", "tests/server.test.js"],
    "topic": "api-development"
  },

  // Stock additions
  "swarms": {
    "swarm-123": {
      "agents": 5,
      "tasks_completed": 12,
      "consensus_decisions": 3
    }
  }
}
```

---

## Conclusion

**Stock claude-flow and custom sessions are NOT in conflict.**

**They serve complementary purposes:**
- Stock hive-mind: Agent coordination and consensus
- Custom sessions: Workspace organization and artifact management

**Integration is straightforward:**
- Share `.swarm/memory.db` for coordination
- Share `.swarm/backups/` for archival
- Use hooks for both systems
- Keep artifacts in `sessions/*/artifacts/`
- Keep swarm state in `.hive-mind/sessions/`

**Recommendation:** Adopt Option 2 (Nested Integration) for best of both worlds.

**Next:** Await HITL approval to proceed with documentation updates and testing.
