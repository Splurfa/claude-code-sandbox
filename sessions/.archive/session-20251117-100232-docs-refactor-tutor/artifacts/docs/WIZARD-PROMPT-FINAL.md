# Hive-Mind Wizard Prompt: Documentation Refactor & Tutor-Mode Implementation

**Mission**: Complete documentation refactoring and BUILD tutor-mode feature for 100% production readiness.

---

## 🎯 Simple Rules Framework

### ALWAYS (7 Rules - Evidence-Based Success Patterns)

1. **ALWAYS verify claims with real tests** - Dream Hive revealed 78% actual vs 100% claimed. Run tests, check files, verify behavior.
2. **ALWAYS use multiple validators for critical decisions** - 6 agents with Byzantine consensus reached 95% confidence vs 75% single-agent.
3. **ALWAYS document with evidence** - File paths, line counts, test output. Never "it works" without proof.
4. **ALWAYS route working files to `sessions/$SESSION_ID/artifacts/{code,tests,docs,scripts,notes}/`** - 100% compliance eliminated root violations.
5. **ALWAYS preserve READ-ONLY boundaries** - Never edit `.swarm/backups/`, `inbox/codex-agent/`, `inbox/cursor-agent/`.
6. **ALWAYS use memory namespaces** - Cross-agent communication via `mcp__claude-flow_alpha__memory_usage` with namespaces.
7. **ALWAYS fire hooks for lifecycle events** - `pre-task`, `post-task`, `session-end` create audit trail (31 backups prove this works).

### NEVER (7 Rules - Known Anti-Patterns)

1. **NEVER claim completion without execution evidence** - Led to 78% vs 100% gap requiring 1-hour remediation.
2. **NEVER ask permission for tasks with defined criteria** - "Should I run tests?" when completion IS "tests passing" wastes time.
3. **NEVER disable functionality instead of fixing root cause** - Technical debt accumulation reduces quality.
4. **NEVER create files in root for working content** - Enforcement dropped violations from 100% to 0%.
5. **NEVER modify external agent research** - 29 READ-ONLY files in `inbox/` corrupts reference material.
6. **NEVER mock real behavior in integration tests** - False confidence, doesn't validate actual behavior.
7. **NEVER skip validation due to time pressure** - Compounds problems, increases total time to quality.

### EXECUTE (4 Rules - Autonomous Decision-Making)

1. **EXECUTE verification before claiming completion**
   ```bash
   1. Implement feature/fix
   2. Run: npm test (or equivalent)
   3. Check: All pass + no errors
   4. Then: Mark complete with evidence
   ```

2. **EXECUTE evidence collection during work**
   ```bash
   Report: "Created X at /path with Y lines, tests: Z passed/failed"
   ```

3. **EXECUTE memory coordination for agent handoffs**
   ```javascript
   mcp__claude-flow_alpha__memory_usage({
     action: "store",
     key: "agent-handoff/task-123/results",
     value: JSON.stringify({files, status, next}),
     namespace: "coordination"
   })
   ```

4. **EXECUTE root cause analysis on failures**
   ```bash
   1. Reproduce → 2. Inspect → 3. Trace → 4. Fix → 5. Verify
   ```

---

## 📊 Weighting Schema for Decision-Making

**Location**: `sessions/session-20251117-100232-docs-refactor-tutor/workspace-audit/weighting-schema.json`

### How to Use Scores

- **SAFE (≥70)**: Reference directly, 85-100% confidence
- **CAUTIONARY (40-69)**: Reference with verification warnings, 40-84% confidence
- **EXCLUDE (<40)**: Do not reference in wizard context, 0-39% confidence

### Confidence Ceiling for Sequential Work

**Maximum confidence: 55%** for any file created sequentially without agent coordination/testing.

**Rationale**: Systematic uncertainty exists when work lacks multi-agent validation and real-world verification.

### Classification Thresholds

```
weighted_score = (prescriptiveness × 0.35) + (temporal_stability × 0.25) +
                 (user_authority × 0.30) + (contextual_scope × 0.10)
```

**Special Handling**:
- User config (CLAUDE.md, .mcp.json): 100% confidence
- Session artifacts: EXCLUDE (session-specific, not cross-session)
- Sequential work protocols: 55% cap (prescriptive steps conflict with parallel execution)
- Read-only zones: 60% cap (informational only)

---

## 🎯 Mission Definition

**Scope**: ~100 files from sequential work need review/redo + NEW tutor-mode feature BUILD

### What Needs Doing

1. **Documentation Refactoring** (~53 docs files)
   - 30 CAUTIONARY files: Add verification warnings or rewrite with evidence
   - 1 EXCLUDE file: Archive `docs/tutorials/04-advanced/reasoning-bank.md` (0 episodes, misleads users)
   - Focus on Advanced tutorials (Phase 4): Highest aspiration vs reality gap

2. **Session Artifacts Review** (~122 files)
   - 30 CAUTIONARY references: Extract useful patterns, discard temporal claims
   - 92 EXCLUDE: Session-specific, ignore unless scoped to that session

3. **Tutor-Mode Feature BUILD** (NEW - not just verify)
   - **Requirement**: Interactive learning assistant for new users
   - **NOT** verification: This is net-new feature development
   - **Success criteria**: Working tutor with real interaction, not mocked behavior
   - See high-value references below for context on what system does

4. **Integration Verification**
   - Run real tests (not mocked)
   - Verify with evidence (file paths, test output)
   - 100% pass rate or documented failures with fixes

### Out of Scope

- Rewriting working code without permission
- Changing core business logic
- Root file creation (session artifacts ONLY)

---

## 👤 User Context (from user-intent-extraction.md)

### User Profile

- **Role**: Non-developer, oversight role
- **Authority**: Maximum power, zero constraints
- **Expectations**: Autonomous execution, verifiable evidence
- **Theater tolerance**: ZERO

### What User Values

1. **Evidence over claims**: Show file paths, test output, metrics
2. **Honest reporting**: 78% reality > 100% theater
3. **Root cause fixes**: Never disable functionality to "solve" problems
4. **Systematic work**: Tedious is fine if it's correct
5. **No permission theater**: If completion criterion clear, just execute

### What Frustrates User

- Being asked "should I run tests?" when tests ARE the completion criterion
- Agents claiming "complete" without running verification
- Sequential work masquerading as coordinated work (55% confidence ceiling exists for a reason)
- Mocking real behavior in tests
- Time-pressure shortcuts that create more work

---

## 🔄 Adaptive Nudge Framework

### Purpose

User provides real-time corrections ("nudges") that reveal systematic behavioral gaps. The wizard MUST spawn a dedicated **Nudge Synthesizer** agent to process these patterns and update coordination strategy without breaking stride.

### Nudge Synthesizer Spawn (At Hive Init)

```javascript
// REAL Task tool pattern from hive-mind-advanced skill
Task("Nudge Synthesizer",
  "Monitor user messages for correction patterns. " +
  "Analyze nudges against known anti-patterns. " +
  "Identify root behavioral causes. " +
  "Update coordination strategy via swarm.memory.store(). " +
  "Broadcast adaptations to all agents. " +
  "Create checkpoints via hooks post-task. " +
  "Track nudge trends for meta-learning. " +
  "PERSIST throughout entire session.",
  "analyst"
)
```

### 7-Step Nudge Processing Protocol

When user provides correction:

**1. CAPTURE** (immediate):
```javascript
// REAL swarm.memory.store pattern from swarm-orchestration skill
await swarm.memory.store('nudge-log/timestamp-sequence', {
  type: 'knowledge',
  user_words: "exact quote",
  context: "what was being done",
  violation: "which rule/pattern broken",
  timestamp: Date.now()
});
```

**2. ANALYZE**: Pattern match against 10 known anti-patterns:
- File routing violations (weight 0.9)
- Framework research failures (0.85)
- Sequential work theater (0.8)
- Claims without evidence (0.8)
- Permission theater (0.75)
- Functionality disabling (0.75)
- Additive vs integrative thinking (0.6)
- Temporal naming (0.5)
- Mock behavior in tests (0.8)
- Time-pressure shortcuts (0.75)

**3. SYNTHESIZE**: Root cause identification
- Don't fix symptom (immediate error)
- Find behavioral gap (why this keeps happening)
- Check: Have other agents made same mistake?

**4. ADAPT**: Update coordination strategy
```javascript
// REAL collective memory pattern from hive-mind-advanced skill
await swarm.memory.store('coordination/strategy-update', {
  type: 'knowledge',
  nudge_id: "nudge-log/timestamp",
  root_cause: "symptom-fixing instead of research-first",
  affected_agents: ["doc-reviewer-3", "coder-2"],
  new_directive: "ALWAYS audit framework before creating categories",
  prevention: "Add research-first checklist to agent spawn instructions"
});
```

**5. BROADCAST**: All active agents receive update
```javascript
// REAL swarm coordination pattern from swarm-orchestration skill
await swarm.memory.store('coordination/all-agents/directive-update', {
  type: 'task',
  directive: "ALWAYS audit framework before creating categories",
  affected_patterns: ["file-creation", "category-design"],
  enforcement: "mandatory"
});
```

**6. CHECKPOINT**: Session state update
```bash
# REAL hooks from swarm-orchestration skill lines 146-157
npx claude-flow@alpha hooks post-task \
  --task-id "nudge-synthesis-001" \
  --status "completed" \
  --metadata '{"nudge_processed": true, "adaptations": 1}'
```

**7. LOG**: Coordination Ledger entry with STATUS tracking
```markdown
## [HH:MM:SS] User Nudge Processed
**Agent**: Nudge Synthesizer
**Nudge**: "[exact user quote]"
**Root Cause**: File routing protocol not checked before creating files
**Pattern**: Symptom-fixing vs root-cause analysis
**Correction**: Removed root files, fixed references instead
**Prevention**: Added routing check to all agent spawn instructions
**Broadcast**: All 6 doc-reviewers updated with routing checklist
**Memory**: coordination/strategy-update-001 (knowledge type)
**Checkpoint**: hooks post-task nudge-synthesis-001
```

### Integration Without Breaking Stride

**The wizard does NOT**:
- Stop all work when nudge received
- Ask user to repeat themselves
- Request clarification on obvious violations

**The wizard DOES**:
- Continue coordinating active agents
- Process nudge in parallel via Nudge Synthesizer
- Update strategy via swarm.memory.store()
- Create checkpoints via hooks
- Log adaptation in Coordination Ledger
- Prevent recurrence across all agents

### Nudge Weighting

**Critical (STOP EVERYTHING)** - Weight 1.0:
- Security violations
- Data loss risk
- User config violations (CLAUDE.md)
- Read-only boundary breaches

**High Priority (Adapt Strategy)** - Weight 0.75-0.9:
- File routing violations (0.9)
- Framework research failures (0.85)
- Sequential work theater (0.8)
- Claims without evidence (0.8)

**Medium Priority (Pattern Tracking)** - Weight 0.5-0.6:
- Additive vs integrative thinking (0.6)
- Redundancy creation (0.55)

---

## 📚 High-Value References (Weighted Score > 60)

### SAFE References (Use Directly)

1. **CLAUDE.md** (Score: 100) - User configuration, supreme authority
2. **docs/how-to/integration-testing-guide.md** (100) - Verified testing patterns, 100% pass rate
3. **docs/reference/feature-verification-checklist.md** (100) - Actionable verification steps
4. **docs/reference/hive-mind-reality-guide.md** (95) - Honest about limitations, 65/100 readiness
5. **docs/reference/feature-reality-check.md** (95) - Corrects aspirational claims
6. **docs/explanation/workspace-architecture.md** (94) - Stock vs custom breakdown
7. **docs/explanation/session-management.md** (91) - Core system behavior
8. **docs/internals/stock-vs-custom.md** (88) - Architecture decisions
9. **docs/explanation/file-routing.md** (84) - Verified routing rules
10. **docs/tutorials/02-essential-skills/session-management.md** (84) - Tested patterns

### CAUTIONARY References (Use with Verification)

11. **artifacts/docs/frustration-analysis.md** (Score: 54.74) - User priority insights
12. **artifacts/docs/documentation-audit.md** (47.11) - Doc quality findings
13. **artifacts/notes/constraint-conflict-architecture.md** (45.43) - Constraint analysis
14. **artifacts/docs/system/architecture-overview.md** (44.53) - Architecture details
15. **artifacts/notes/breach-analysis.md** (43.35) - What went wrong and why

### Truth-Tellers (Prioritize These)

- **hive-mind-reality-guide.md**: 65% readiness acknowledged
- **feature-reality-check.md**: Aspiration vs reality documented
- **workspace-architecture.md**: Stock-first score 82/100 honest assessment

---

## ⚡ Execution Autonomy

### You Choose

- **Topology**: Mesh, hierarchical, ring, star - pick what makes sense for task distribution
- **Queen**: Strategic planner, adaptive coordinator, collective intelligence - match to mission complexity
- **Consensus**: Byzantine, Raft, gossip - match to decision criticality

### Guidance (NOT Rules)

**For documentation refactoring**:
- Mesh topology: Parallel doc review by multiple agents
- Collective intelligence queen: Synthesize findings
- Byzantine consensus: High-stakes decisions (what to archive vs fix)

**For tutor-mode BUILD**:
- Hierarchical topology: Backend, frontend, testing specialists
- Strategic planner queen: Coordinate multi-domain work
- Raft consensus: Feature design decisions

**These are suggestions. You know best based on actual task breakdown.**

---

## 🚀 Adaptive Mode Invocation

**From Claude Flow Skills Library**: Two distinct "adaptive" features can be combined for maximum flexibility.

### Adaptive Queen (Hive Mind)

**Purpose**: Dynamic strategy adjustment based on **performance metrics**

**When to Use**:
- Optimization tasks ("optimize", "improve", "performance", "efficiency")
- Tasks where requirements evolve during execution
- Real-time strategy adjustment needed
- Learning from execution patterns

**CLI Command** (from hive-mind-advanced SKILL.md lines 83-86):
```bash
npx claude-flow hive-mind spawn "Optimize API response times" \
  --queen-type adaptive \
  --consensus byzantine \
  --max-workers 12 \
  --claude
```

**How It Works**:
1. Tracks task completion metrics (success rate, duration)
2. Analyzes worker performance by type
3. Adjusts task assignment strategies in real-time
4. Re-prioritizes based on bottlenecks
5. Scales workers up/down based on queue depth
6. Stores learnings in collective memory

**Example**:
- Task: "Optimize database query performance"
- Queen profiles current bottlenecks
- Spawns specialized optimizer agents
- Strategies adjust based on profiling results
- Learnings stored: `swarm.memory.store('optimization-strategy', {...})`

### Adaptive Topology (Swarm Orchestration)

**Purpose**: Auto-switch mesh/hierarchical based on **task complexity**

**When to Use**:
- Task complexity unknown upfront ("production", "scalable", "complex")
- Workload characteristics change during execution
- Need automatic topology optimization
- Building systems with varying requirements

**Programmatic Pattern** (from swarm-orchestration SKILL.md lines 57-64):
```typescript
// Via hooks integration or agent code
await swarm.init({
  topology: 'adaptive',
  optimization: 'task-complexity'
});

// Auto-orchestration
await swarm.autoOrchestrate({
  goal: 'Build production-ready API',
  constraints: {
    maxTime: 3600,
    maxAgents: 8,
    quality: 'high'
  }
});
```

**How It Works**:
- Simple tasks → mesh (peer-to-peer, fast consensus)
- Complex tasks → hierarchical (queen coordinates specialists)
- Evolving tasks → switches topology mid-execution
- Analyzes task goal and constraints
- Calculates optimal topology dynamically

### Combined Approach (Maximum Flexibility)

**When objective includes BOTH optimization + complexity keywords**:

```bash
# Adaptive Queen + Adaptive Topology
npx claude-flow hive-mind spawn "Build production-ready system with performance optimizations" \
  --queen-type adaptive \
  --consensus byzantine \
  --max-workers 12 \
  --claude

# Wizard then uses adaptive topology in coordination:
# await swarm.init({ topology: 'adaptive', optimization: 'task-complexity' });
```

**Expected Behavior**:
1. Queen analyzes requirements (adaptive queen)
2. Spawns specialized agents based on complexity
3. Topology switches mesh→hierarchical as work deepens (adaptive topology)
4. Strategies adjust based on performance metrics (adaptive queen)
5. Learnings stored in collective memory for future work

### Comparison Tables

**Adaptive Queen vs Strategic/Tactical** (hive-mind-advanced SKILL.md lines 370-386):

| Feature | Strategic | Tactical | Adaptive |
|---------|-----------|----------|----------|
| **Purpose** | Research, planning | Implementation | **Optimization, dynamic tasks** |
| **Strategy** | Fixed, analytical | Fixed, action-oriented | **Adjusts based on metrics** |
| **Best For** | "Research ML frameworks" | "Build authentication" | **"Optimize performance"** |
| **Learning** | Knowledge accumulation | Execution patterns | **Performance patterns** |

**Adaptive Topology vs Fixed** (swarm-orchestration SKILL.md lines 36-64):

| Feature | Mesh | Hierarchical | Adaptive |
|---------|------|--------------|----------|
| **Structure** | Peer-to-peer | Queen-worker | **Auto-switching** |
| **Decision** | Distributed | Centralized | **Context-dependent** |
| **Best For** | Equal-skill tasks | Specialized tasks | **Unknown complexity** |
| **Overhead** | Low | Medium | **Variable (optimizes)** |

### Fallback Options

If adaptive mode is too complex:

**Simple optimization** (no adaptive features):
```bash
npx claude-flow hive-mind spawn "Optimize API" --queen-type tactical
```

**Manual topology** (you control coordination):
```bash
npx claude-flow@alpha hooks swarm-init --topology mesh --max-agents 5
```

**Basic orchestration** (sequential, no dynamic adjustment):
```bash
npx claude-flow@alpha hooks task-orchestrate --task "Optimize API" --mode sequential
```

### Memory Integration

Both adaptive modes use collective memory (hive-mind-advanced SKILL.md lines 154-189):

**Adaptive Queen stores learnings**:
```javascript
await swarm.memory.store('optimization-strategy', {
  type: 'knowledge',
  approach: 'index-based caching',
  impact: { latency: '-40%', cpu: '-25%' },
  confidence: 0.95
});
```

**Adaptive Topology uses memory for decisions**:
```javascript
const topologyStats = await swarm.memory.search('topology-*', {
  type: 'metric',
  minConfidence: 0.8
});
```

---

### Report Results With Evidence

```
COMPLETED:
- Reviewed 53 docs files (paths: ...)
- Archived reasoning-bank.md (reason: 0 episodes, misleads users)
- Added warnings to 30 CAUTIONARY files (list: ...)
- Built tutor-mode: /sessions/$SESSION_ID/artifacts/code/tutor-mode/
- Tests: 47/47 passed (output: ...)
- Memory coordination: 23 handoffs logged
- Captain's Log: 15 entries (query: SELECT * FROM journal WHERE session_id = '...')
```

### No Manual Steps

If you can't automate it, you can't complete it. Don't ask user to "manually run command X". Either:
1. Run it yourself via hooks/agents
2. Build automation that runs it
3. Report technical blocker preventing automation

---

## ✅ Success Evidence (How User Verifies)

### SQLite Queries (User Can Run)

```sql
-- Memory coordination proof
SELECT * FROM coordination_memory WHERE namespace = 'hive-wizard-20251117';

-- Captain's Log entries
SELECT timestamp, category, summary FROM journal
WHERE session_id LIKE 'session-20251117%'
ORDER BY timestamp;

-- Agent activity
SELECT agent_id, task_count, completion_rate FROM agent_metrics
WHERE session_id = 'wizard-docs-refactor';
```

### File Evidence

```bash
# Tutor mode exists and has tests
ls -la sessions/session-*/artifacts/code/tutor-mode/
ls -la sessions/session-*/artifacts/tests/tutor-mode.test.js

# Documentation changes tracked
git log --oneline --since="2025-11-17" docs/

# Session artifacts organized
find sessions/session-20251117-*/ -type f | wc -l
```

### Test Results

```bash
# Not "all tests pass" claim
# Actual test output with file paths and assertions
npm test 2>&1 | tee test-results.log
```

### Memory Coordination Proof

```javascript
// Agent handoffs visible in memory
mcp__claude-flow_alpha__memory_usage({
  action: "list",
  namespace: "coordination"
})
// Should show: task-1-research → task-2-design → task-3-build → task-4-test
```

---

## 📋 Real-Time Coordination Ledger

**Location**: `sessions/session-20251117-100232-docs-refactor-tutor/COORDINATION-LEDGER.md`

### Purpose
Human-readable progress tracking showing agent coordination, tasks completing, and reasoning in real-time. User can monitor work without querying SQLite.

### Update Requirements
- **Frequency**: After each major task/phase completion
- **Format**: Chronological entries with timestamp, agent, task, reasoning
- **Visibility**: User can `cat` or `tail -f` anytime for current status
- **Evidence**: Links to memory entries, file outputs, test results

### Ledger Structure

```markdown
# Coordination Ledger
Session: session-20251117-100232-docs-refactor-tutor
Started: 2025-11-17 15:30:00
Topology: Mesh + Hierarchical hybrid
Queen: Adaptive Coordinator
Consensus: Byzantine (2/3 majority)

---

## [15:30:15] Hive Initialization
**Agent**: Adaptive Queen
**Task**: Read weighting schema and plan coordination
**Reasoning**: User requires evidence-based decisions - loading 535 file scores from workspace-audit/weighting-schema.json to guide file reference decisions
**Evidence**:
  - Schema loaded: weighting-schema.json
  - 18 SAFE references identified (weighted score ≥70)
  - 30 CAUTIONARY files flagged (40-69)
  - 1 EXCLUDE file: docs/tutorials/04-advanced/reasoning-bank.md
**Next**: Spawn specialized agents for parallel doc review
**Memory**: coordination/queen/initialization-complete

---

## [15:31:42] Documentation Review Phase Started
**Agents Spawned**: 6 parallel reviewers (Doc-Reviewer-1 through Doc-Reviewer-6)
**Task**: Parallel review of 53 docs files using weighting schema
**Reasoning**: Mesh topology chosen for parallel review, each agent handles ~9 docs. Using Byzantine consensus for archive decisions (reasoning-bank.md).
**Coordination**: Memory namespace 'hive-wizard-20251117/doc-review'
**Evidence**:
  - 6 agents active in memory
  - Memory entries: coordination/agent-doc-reviewer-{1-6}/status = "reviewing"
  - Files distributed: integration-testing-guide.md → Reviewer-1, session-management.md → Reviewer-2, etc.
**Next**: Each agent reports findings, Queen synthesizes

---

## [15:35:20] CAUTIONARY Files Flagged
**Agent**: Doc-Reviewer-3
**Task**: Reviewed tutorials/04-advanced/ (7 files)
**Reasoning**: Found aspiration vs reality gaps in advanced tutorials per weighting schema confidence scores
**Findings**:
  - reasoning-bank.md: EXCLUDE (weighted score 23.5, 0 episodes, misleading)
  - adaptive-topology.md: CAUTIONARY (weighted score 52.3, unverified auto-adaptation claims)
  - consensus-protocols.md: CAUTIONARY (weighted score 48.1, sequential work, needs multi-agent validation)
**Action**: Flagged for Queen review, preparing archive recommendation for reasoning-bank.md
**Evidence**:
  - Files analyzed: 7
  - Memory: coordination/doc-reviewer-3/findings
  - Git diff staged: docs/tutorials/04-advanced/adaptive-topology.md (added verification warning)
**Next**: Queen decides archive vs fix for CAUTIONARY files

---

## [15:42:10] Tutor-Mode BUILD Started
**Agents Spawned**: 3 specialists (Backend-Dev, Test-Engineer, Doc-Writer)
**Task**: Build tutor-mode feature from scratch (NOT verification - actual development)
**Reasoning**: User requires BUILD with real interaction. Creating new feature per requirements in wizard prompt lines 340-374.
**Architecture**:
  - Backend: sessions/.../artifacts/code/tutor-mode/index.js (slash command handler)
  - Tests: sessions/.../artifacts/tests/tutor-mode.test.js (Q&A behavior verification)
  - Docs: sessions/.../artifacts/docs/tutor-mode-guide.md (usage instructions)
**Coordination**: Hierarchical topology, Backend-Dev leads, Test-Engineer validates, Doc-Writer documents
**Evidence**:
  - Memory handoffs: coordination/tutor-mode-build/backend-spec → test-requirements
  - File creation started: mkdir sessions/.../artifacts/code/tutor-mode/
  - Git tracking: New files staged
**Next**: Backend completes slash command, hands off to Test-Engineer

---

## [15:55:33] Integration Tests Running
**Agent**: Test-Engineer
**Task**: Verify tutor-mode Q&A behavior with real tests (no mocks)
**Reasoning**: NEVER mock real behavior per ALWAYS rule #1. Testing actual slash command execution.
**Test Coverage**:
  - Slash command registration: `/tutor` exists and responds
  - Context awareness: Reads weighting schema for answers
  - Real interaction: Asks "What is session management?" → Returns reference to session-management.md
  - Memory integration: Stores user history for personalization
**Evidence**:
  - Test file: sessions/.../artifacts/tests/tutor-mode.test.js (47 tests written)
  - Running: npm test tutor-mode.test.js
  - Output: 47/47 passed (see test-results.log)
  - No mocks used (verified in test code review)
**Next**: Doc-Writer creates usage guide

---

## [16:08:15] Documentation Refactoring Complete
**Agents**: All 6 reviewers + Queen synthesis
**Task**: 53 docs reviewed, 30 CAUTIONARY files updated, 1 EXCLUDE archived
**Reasoning**: Byzantine consensus reached 2/3 agreement on all decisions. CAUTIONARY files got verification warnings, EXCLUDE file archived to .swarm/backups/.
**Completed**:
  - 30 files updated with warnings: "⚠️ CAUTIONARY: Created sequentially, verify claims independently"
  - 1 file archived: docs/tutorials/04-advanced/reasoning-bank.md → .swarm/backups/archived-docs/
  - All cross-references verified (used grep to check broken links)
  - docs/README.md updated with Diátaxis navigation
**Evidence**:
  - Git log: 31 commits (30 warning additions + 1 archive)
  - File paths: docs/tutorials/04-advanced/*.md, docs/how-to/*.md, docs/explanation/*.md
  - Test output: All docs render correctly, no broken links
  - Memory: coordination/doc-review/synthesis-complete
**Next**: Session closeout preparation

---

## [16:20:45] Session Closeout - Evidence Package
**Agent**: Adaptive Queen
**Task**: Compile all evidence for user verification
**Reasoning**: User judges success by SQLite queries, test results, file evidence per lines 399-405
**Evidence Package**:
  1. SQLite coordination proof: 142 coordination messages in namespace 'hive-wizard-20251117'
  2. Captain's Log: 23 entries (query: SELECT * FROM journal WHERE session_id LIKE 'session-20251117%')
  3. File count: 89 files created/modified in sessions/.../artifacts/
  4. Test results: 47/47 tutor-mode tests passed, 0 failures
  5. Git log: 31 commits for documentation, 15 commits for tutor-mode
  6. Memory handoffs: 18 agent coordination handoffs logged
**User Verification Commands**:
  ```bash
  # See coordination proof
  sqlite3 .swarm/memory.db "SELECT key, substr(value,1,80) FROM memory_entries WHERE namespace='coordination' AND key LIKE '%hive-wizard%' ORDER BY created_at DESC LIMIT 20;"

  # See tutor-mode working
  ls -la sessions/session-20251117-*/artifacts/code/tutor-mode/
  cat sessions/session-20251117-*/artifacts/tests/tutor-mode.test.js | grep "test("

  # See doc changes
  git log --oneline --since="2025-11-17" docs/ | head -20
  ```
**Status**: READY FOR HITL APPROVAL
```

### How Wizard Uses This

**At Session Start**:
1. Create COORDINATION-LEDGER.md with header (session ID, topology, queen type, consensus)
2. Log initialization entry with weighting schema loading evidence

**During Work**:
1. Append entry after EACH major task/phase completion
2. Include: timestamp, agent, task description, reasoning, evidence, next step
3. Link to memory entries, file paths, test outputs
4. Update continuously (not batch at end)

**User Monitoring**:
```bash
# Watch ledger update in real-time
tail -f sessions/session-20251117-100232-docs-refactor-tutor/COORDINATION-LEDGER.md

# See latest 10 entries
tail -30 sessions/session-20251117-100232-docs-refactor-tutor/COORDINATION-LEDGER.md

# Full ledger review
cat sessions/session-20251117-100232-docs-refactor-tutor/COORDINATION-LEDGER.md
```

### What Gets Logged

**Every Entry Includes**:
- **Timestamp**: [HH:MM:SS] for chronological ordering
- **Agent**: Which agent or queen is reporting
- **Task**: What was being done (1-2 sentences)
- **Reasoning**: WHY this action was taken (decision justification)
- **Evidence**: File paths, memory keys, test outputs, git commits
- **Next**: What happens next (coordination handoff)

**Entry Types**:
- **Initialization**: Hive startup, config loading, agent spawning
- **Phase Transitions**: New topology, consensus changes, agent reassignments
- **Task Completion**: Work finished with evidence
- **Findings**: Issues discovered, decisions made, recommendations
- **Coordination**: Agent handoffs, memory updates, consensus reached
- **Verification**: Test results, integration checks, quality validation
- **User Questions**: User inquiries with answers, status tracking (OPEN/RESOLVED)
- **User Nudges**: User corrections, pattern synthesis, strategy adaptations
- **Closeout**: Final evidence package, user verification commands

### User Question Handling

**CRITICAL**: User may ask questions during execution. **NEVER respond only in chat** - questions and answers MUST be logged in COORDINATION-LEDGER.md.

**Why**: Chat messages can be missed (scrolling viewport, user looking away). Ledger is persistent and tail-able.

**Question Entry Format**:
```markdown
## [HH:MM:SS] User Question - [Brief Topic]
**User**: "[Exact question text]"
**Context**: What was happening when question asked
**Status**: OPEN | IN-PROGRESS | RESOLVED
**Answer**: [Brief answer if resolved, or "Investigating..." if in-progress]
**Evidence**: [Links to relevant work, memory entries, or "See below for investigation"]
**Next**: [What happens next, or "Awaiting user confirmation"]
```

**Example Ledger Entry**:
```markdown
## [15:48:15] User Question - Why Byzantine Consensus?
**User**: "Why did you choose Byzantine consensus over majority?"
**Context**: Documentation review phase, 6 agents active, making archive decision
**Status**: RESOLVED
**Answer**: Byzantine (2/3 majority) chosen for archive decisions because:
  - Higher confidence threshold for irreversible actions (archiving files)
  - Protects against single-agent errors
  - User priority: Quality over speed (from user-intent-extraction.md)
**Evidence**:
  - Weighting schema: EXCLUDE files require high-confidence decisions
  - Memory: coordination/consensus-decision-001
  - Reference: hive-mind-advanced skill line 150 (Byzantine = 2/3 required)
**Next**: Continuing with doc review, will use majority for non-destructive decisions
```

**Handling Protocol**:

1. **User asks question** → IMMEDIATELY create ledger entry with STATUS: OPEN
2. **Investigation begins** → Update STATUS: IN-PROGRESS, add "Investigating..." note
3. **Answer found** → Update STATUS: RESOLVED, add complete answer with evidence
4. **User follow-up** → Create new entry referencing previous question

**Integration with Chat**:
- Brief acknowledgment in chat: "Captured - see COORDINATION-LEDGER.md [HH:MM:SS]"
- Full answer goes in ledger (persistent, can't be scrolled away)
- User monitors via: `tail -f sessions/.../COORDINATION-LEDGER.md`

**Question vs Nudge**:
- **Question**: User asks "Why X?" → Answer with reasoning, continue work
- **Nudge**: User says "X is wrong" → Pattern analysis, strategy adaptation, broadcast to all agents

---

## 🚀 Launch Command

```bash
# When user is ready
npx claude-flow@alpha hive-mind:wizard
```

**You will**:
1. Read this prompt
2. Read weighting schema for guidance
3. **Query learned patterns first** (`swarm.memory.search('adaptive-success/*')`)
4. **Analyze objective for adaptive mode keywords** (optimization, performance, production, scalable)
5. **Choose coordination strategy**:
   - Use learned pattern if similarity ≥ 0.7 ("Based on similar scenario X")
   - Otherwise use keyword analysis (optimization → adaptive queen, complexity → adaptive topology)
   - Fallback to strategic/tactical if simpler mode appropriate
6. **Spawn Nudge Synthesizer at hive initialization** (Task tool, analyst type)
7. Spawn task agents with ALWAYS/NEVER/EXECUTE rules
8. Coordinate via memory (namespace: "hive-wizard-20251117")
9. Build tutor-mode feature (not verify - BUILD)
10. Review ~100 docs/artifacts with evidence-based scoring
11. **Process user nudges in parallel without breaking stride**
12. Report completion with SQLite-queryable proof
13. **At closeout: Store adaptive success pattern** (if success ≥ 90%, quality verified)

**You will NOT**:
- Ask permission for verification (it's in completion criteria)
- Claim completion without test evidence
- Mock behavior in integration tests
- Create root files (session artifacts only)
- Sequential-work theater (hooks prove coordination)
- Skip Nudge Synthesizer spawn (required for user correction handling)
- Ignore adaptive mode when optimization/complexity keywords present

---

## 📋 Weighting Schema Integration

**Decision Framework**:

1. **Query weighting schema** before referencing any file:
   ```json
   {
     "file": "docs/tutorials/04-advanced/reasoning-bank.md",
     "weighted_score": 50,
     "classification": "EXCLUDE",
     "confidence": 40,
     "reasoning": "0 episodes, misleads users about active feature"
   }
   ```

2. **Apply confidence ceilings**:
   - User config: 100%
   - Verified features (integration-testing-guide): 100%
   - Sequential work: 55% max
   - Session artifacts: 25% (cross-session queries only)

3. **Cross-reference for contradictions**:
   - If 3+ sources agree: +5% confidence boost (max 95%)
   - If sources contradict: reduce all to min(confidence, 50%)
   - Flag contradiction, ask user for clarification

4. **Adapt prescriptive content to parallel execution**:
   - Tutorial says: "1. Do A, 2. Then B, 3. Then C"
   - Wizard does: `[Single message]: Task(A), Task(B), Task(C)` in parallel
   - Sequential 55% → Parallel 85% confidence

---

## 🎓 Tutor-Mode Feature Specification

**NOT**: Verification task
**IS**: New feature BUILD

### Requirements

1. **Interactive Learning Assistant**
   - Responds to user questions about workspace
   - Provides context-aware guidance
   - References verified documentation (weighting schema guides sources)

2. **Integration Points**
   - Slash command: `/tutor <question>`
   - Agent spawn: Can spawn tutor agent for extended sessions
   - Memory access: Reads user history for personalized responses

3. **Success Criteria**
   - Working `/tutor` command
   - Real interaction (not mocked)
   - Tests verify Q&A behavior
   - Documentation explains usage

4. **Reference Architecture**
   - See `docs/explanation/` for what system does
   - See `integration-testing-guide.md` for testing patterns
   - See `CLAUDE.md` for coding standards

### What "BUILD" Means

- Write actual code (not verify existing code)
- Create tests (not run existing tests)
- Generate documentation (not review existing docs)
- Prove it works with real execution

---

## 📚 Pattern Storage for Future Recommendations

**Purpose**: Learn from successful adaptive executions to improve future wizard recommendations.

### After Successful Completion

When hive execution completes successfully with adaptive mode, store the pattern:

```javascript
// At session closeout, if adaptive mode was used
await swarm.memory.store(`adaptive-success/${objective_hash}`, {
  type: 'knowledge',  // Permanent storage

  // Objective analysis
  objective_keywords: ['optimize', 'performance', 'production', 'docs'],
  objective_summary: "Documentation refactoring with 53 files",
  task_complexity: 'high',  // low, medium, high

  // Coordination choices
  topology_used: 'mesh',
  queen_type: 'adaptive',
  consensus_algorithm: 'byzantine',
  max_workers: 6,

  // Execution metrics
  success_metrics: {
    completion_rate: 1.0,  // 100%
    quality_score: 0.95,   // From verification
    execution_time_minutes: 127,
    agent_count: 6,
    coordination_handoffs: 23
  },

  // What worked well
  success_factors: [
    'Mesh topology enabled parallel doc review',
    'Byzantine consensus prevented premature archiving',
    'Adaptive queen adjusted strategy after 3 files',
    'Nudge Synthesizer prevented 2 recurring violations'
  ],

  // Evidence
  memory_namespace: 'hive-wizard-20251117',
  coordination_ledger: 'sessions/.../COORDINATION-LEDGER.md',
  test_results: '47/47 passed',
  timestamp: Date.now()
});
```

### Before Next Execution

Query similar past scenarios to inform recommendations:

```javascript
// 1. Extract keywords from new objective
const newObjective = "Optimize API endpoints for production deployment";
const keywords = ['optimize', 'production', 'api'];

// 2. Search for similar successful patterns
const similarPatterns = await swarm.memory.search('adaptive-success/*', {
  keywords_match: keywords,
  min_success_rate: 0.9
});

// 3. Use patterns to augment recommendations
if (similarPatterns.length > 0) {
  const topPattern = similarPatterns[0];  // Highest similarity

  // Recommend based on learned success
  console.log(`
  📊 Similar Scenario Found:
  - Previous: "${topPattern.objective_summary}"
  - Success Rate: ${topPattern.success_metrics.completion_rate * 100}%
  - Quality: ${topPattern.success_metrics.quality_score}

  Recommended Configuration (based on past success):
  - Topology: ${topPattern.topology_used}
  - Queen: ${topPattern.queen_type}
  - Consensus: ${topPattern.consensus_algorithm}
  - Workers: ${topPattern.max_workers}

  What worked well:
  ${topPattern.success_factors.join('\n  ')}
  `);
}
```

### Integration with Static Rules

**Hybrid approach** - combine learned patterns with static rules:

1. **Check for learned patterns first** (similarity threshold ≥ 0.7)
2. **If pattern found**: Use as primary recommendation
3. **If no pattern found**: Fall back to static keyword rules
4. **Always explain**: "Based on similar scenario" vs "Based on keyword analysis"

### Pattern Similarity Scoring

```javascript
function calculateSimilarity(newObjective, storedPattern) {
  const newKeywords = extractKeywords(newObjective);
  const storedKeywords = storedPattern.objective_keywords;

  // Keyword overlap
  const overlap = newKeywords.filter(k => storedKeywords.includes(k));
  const keywordSimilarity = overlap.length / newKeywords.length;

  // Complexity match (exact: 1.0, adjacent: 0.5, different: 0.0)
  const complexityScore = {
    'exact': 1.0,
    'adjacent': 0.5,
    'different': 0.0
  };
  const newComplexity = estimateComplexity(newObjective);
  const complexityMatch =
    storedPattern.task_complexity === newComplexity ? complexityScore.exact :
    Math.abs(complexityLevels[newComplexity] - complexityLevels[storedPattern.task_complexity]) === 1
      ? complexityScore.adjacent
      : complexityScore.different;

  // Weighted combination
  return (keywordSimilarity * 0.7) + (complexityMatch * 0.3);
}
```

### Memory Namespace Organization

```
adaptive-success/
  {objective-hash-1}/        # "doc-refactoring-53-files"
  {objective-hash-2}/        # "api-optimization-12-endpoints"
  {objective-hash-3}/        # "frontend-build-3-components"
  ...

Pattern stored with:
- type: 'knowledge' (permanent)
- No TTL (learnings persist indefinitely)
- Indexed by objective keywords for fast search
```

### Example Ledger Entry

When storing pattern at closeout:

```markdown
## [16:25:30] Pattern Storage - Adaptive Success Logged
**Agent**: Adaptive Queen
**Action**: Store execution pattern for future recommendations
**Pattern ID**: adaptive-success/doc-refactoring-53-files
**Objective**: Documentation refactoring (53 files, 30 CAUTIONARY, 1 EXCLUDE)
**Configuration**: Mesh topology, adaptive queen, Byzantine consensus, 6 workers
**Success Metrics**:
  - Completion: 100%
  - Quality: 95%
  - Execution: 127 minutes
  - Handoffs: 23
**Success Factors**:
  - Mesh enabled parallel review (6 agents, ~9 files each)
  - Byzantine prevented premature archiving (2/3 majority required)
  - Adaptive queen adjusted after 3 files (recognized pattern)
  - Nudge Synthesizer prevented 2 recurring violations
**Memory**: adaptive-success/doc-refactoring-53-files (knowledge type)
**Future Use**: Will inform recommendations for similar doc refactoring scenarios
```

### Constraints and Warnings

**DO store patterns when**:
- Adaptive mode was used (queen or topology)
- Success rate ≥ 90%
- Quality verification passed
- Execution completed (not partial)

**DO NOT store patterns when**:
- Success rate < 90%
- Quality issues detected
- User requested rollback
- Execution was sequential (no true coordination)

**Pattern decay**:
- Patterns stored permanently (type: 'knowledge')
- But prioritize recent patterns (last 30 days) over older ones
- Consider adding success_count field: patterns used successfully multiple times get higher weight

### Stock Claude Flow Compliance

This pattern storage uses:
- ✅ Stock `swarm.memory.store()` API (from swarm-orchestration skill)
- ✅ Stock memory types: `knowledge` (permanent)
- ✅ Stock memory search: `swarm.memory.search()`
- ❌ No cloud templates (Flow Nexus)
- ❌ No ReasoningBank trajectory tracking (advanced feature)
- ✅ Simple, incremental learning without external dependencies

---

## 🔧 Final Notes

### Stock-First Compliance

This workspace is **82/100 stock-first** (68% architecture / 97.5% implementation). Respect stock claude-flow patterns:
- Hooks execute via `npx claude-flow@alpha hooks`
- Memory via MCP tools
- Session structure via `sessions/$SESSION_ID/artifacts/`

### Confidence Calibration

**55% ceiling for sequential work is NOT punishment** - it's honest uncertainty quantification. When you BUILD tutor-mode with multi-agent coordination and real tests, you'll earn 85-100% confidence through verification.

### Evidence Requirements

Every agent report MUST include:
- File paths (absolute)
- Line counts
- Test output (not "tests passed" - actual output)
- Memory keys used
- Timestamp and agent ID

### User Will Judge Success By

1. Can query SQLite and see coordination proof
2. Can run tests and see 100% pass
3. Can use tutor-mode feature interactively
4. Can verify documentation improvements with git log
5. ZERO claims without evidence

---

**You have maximum autonomy. Execute with evidence. Report with proof. Build, don't theater.**
