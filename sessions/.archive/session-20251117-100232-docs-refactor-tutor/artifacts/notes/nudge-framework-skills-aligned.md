# Adaptive Nudge Framework - Skills Library Aligned

**Date**: 2025-11-17
**Session**: session-20251117-100232-docs-refactor-tutor
**Task**: Revise nudge framework using REAL Claude Flow patterns from skills library
**Reality Check**: Based on actual hive-mind-advanced and swarm-orchestration skills

---

## 📍 Placement Recommendation

**Insert After**: Line 151 (end of "User Context" section)
**Insert Before**: Line 153 (start of "High-Value References" section)

**Rationale**:
- User Context establishes who the user is and what they value
- Nudge Framework shows HOW the user communicates corrections
- High-Value References provides tools for addressing nudges
- This creates natural flow: WHO → HOW THEY COMMUNICATE → WHAT TO USE

---

## 🔄 Adaptive Nudge Framework

### Purpose

The user provides real-time corrections via "nudges" - brief redirections that reveal systematic behavioral gaps. The wizard MUST have a dedicated **Nudge Synthesizer** agent to process these patterns and update coordination strategy without breaking stride.

### Nudge Processing Protocol

**When User Provides Correction**:

1. **IMMEDIATE**: Nudge Synthesizer captures the nudge
   ```javascript
   // REAL Claude Flow memory pattern (from swarm-orchestration skill)
   await swarm.memory.store('nudge-log/timestamp-sequence', {
     timestamp: Date.now(),
     user_words: "exact quote",
     context: "what was being done",
     violation: "which rule/pattern broken",
     namespace: "learning"
   });
   ```

2. **ANALYZE**: Pattern matching against known anti-patterns
   - File routing violations?
   - Framework research failures?
   - Additive vs integrative thinking?
   - Sequential work theater?
   - Permission seeking when criteria clear?

3. **SYNTHESIZE**: Root cause identification
   - Don't fix symptom (immediate error)
   - Find behavioral gap (why this keeps happening)
   - Check: Have other agents made same mistake?

4. **ADAPT**: Update coordination strategy
   ```javascript
   // REAL collective memory pattern (from hive-mind-advanced skill)
   await swarm.memory.store('coordination/strategy-update', {
     nudge_id: "nudge-log/timestamp",
     root_cause: "symptom-fixing instead of research-first",
     affected_agents: ["doc-reviewer-3", "coder-2"],
     new_directive: "ALWAYS audit framework before creating categories",
     prevention: "Add research-first checklist to agent spawn instructions",
     memory_type: "knowledge", // hive-mind memory type
     namespace: "coordination"
   });
   ```

5. **BROADCAST**: All active agents receive update
   ```javascript
   // REAL swarm coordination pattern (from swarm-orchestration skill)
   await swarm.memory.store('coordination/all-agents/directive-update', {
     directive: "ALWAYS audit framework before creating categories",
     affected_patterns: ["file-creation", "category-design"],
     enforcement: "mandatory",
     namespace: "coordination"
   });
   ```

6. **CHECKPOINT**: Session state update
   ```bash
   # REAL hooks integration (from swarm-orchestration skill lines 146-157)
   npx claude-flow@alpha hooks post-task \
     --task-id "nudge-synthesis-001" \
     --status "completed" \
     --metadata '{"nudge_processed": true, "adaptations": 1}'
   ```

7. **LOG**: Coordination Ledger entry
   ```markdown
   ## [HH:MM:SS] User Nudge Processed
   **Agent**: Nudge Synthesizer
   **Nudge**: "You're putting files at root - violation of all things Holy"
   **Root Cause**: File routing protocol not checked before creating files
   **Pattern**: Symptom-fixing (create file) vs root-cause (check routing rules)
   **Affected Work**: 2 files created at root (WORKSPACE-GUIDE.md, WORKSPACE-ARCHITECTURE.md)
   **Correction**: Removed root files, fixed references instead
   **Prevention**: Added routing check to all agent spawn instructions
   **Broadcast**: All 6 doc-reviewers updated with routing checklist
   **Memory**: coordination/strategy-update-001 (knowledge type)
   **Checkpoint**: hooks post-task nudge-synthesis-001
   ```

### Nudge Categories & Weighting

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
- Permission theater (0.75)

**Medium Priority (Pattern Tracking)** - Weight 0.5-0.6:
- Additive vs integrative thinking (0.6)
- Redundancy creation (0.55)
- Temporal naming (0.5)

### Integration Without Breaking Stride

**The wizard does NOT**:
- Stop all work when nudge received
- Ask user to repeat themselves
- Request clarification on obvious violations

**The wizard DOES**:
- Continue coordinating active agents
- Spin up Nudge Synthesizer in parallel via Task tool
- Update strategy via swarm.memory.store()
- Create session checkpoint via hooks
- Log adaptation in Coordination Ledger
- Prevent recurrence across all agents

### Nudge Synthesizer Agent Spawn Pattern

**Using REAL Task Tool** (from hive-mind-advanced skill):

```javascript
// Spawn Nudge Synthesizer at hive initialization
[Hive Initialization]:
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

**NOT using MCP spawn** (that's coordination setup, not execution):

```javascript
// ❌ WRONG - MCP is for topology, not actual agent work
mcp__claude-flow_alpha__agent_spawn({ type: "analyst", name: "Nudge Synthesizer" })
// This only defines the agent TYPE, doesn't spawn working agent
```

### Known User Nudge Patterns

**Pattern #1: File Routing Violations** (Weight 0.9)
- Trigger: Creating files outside `sessions/$SESSION_ID/artifacts/`
- Root cause: Didn't check CLAUDE.md routing rules
- Prevention: Routing check mandatory before all file creation
- Memory: `coordination/patterns/file-routing-violation`

**Pattern #2: Framework Research Failures** (Weight 0.85)
- Trigger: Proposing structure without auditing existing framework
- Root cause: Assumption instead of discovery
- Prevention: Category README reading mandatory
- Memory: `coordination/patterns/framework-research-failure`

**Pattern #3: Parallel Structure Creation** (Weight 0.8)
- Trigger: New category overlaps with existing
- Root cause: Additive thinking, not integrative
- Prevention: Consolidation plan required before new categories
- Memory: `coordination/patterns/parallel-structure`

**Pattern #4: Permission Theater** (Weight 0.75)
- Trigger: Asking "should I run tests?" when tests ARE completion criterion
- Root cause: Unclear when permission needed
- Prevention: EXECUTE rules clarify autonomous actions
- Memory: `coordination/patterns/permission-theater`

**Pattern #5: Claims Without Evidence** (Weight 0.8)
- Trigger: "All tests pass" without showing output
- Root cause: Speed bias, skipped verification
- Prevention: Evidence requirement in all reports
- Memory: `coordination/patterns/claims-without-evidence`

**Pattern #6: Sequential Work Theater** (Weight 0.8)
- Trigger: Claiming coordination while working sequentially
- Root cause: Don't understand memory-based coordination
- Prevention: Hooks + memory namespace proofs required
- Memory: `coordination/patterns/sequential-theater`

**Pattern #7: Temporal Naming** (Weight 0.5)
- Trigger: Using "new", "improved", "v2" in names
- Root cause: Naming by history, not by function
- Prevention: Evergreen naming check in all proposals
- Memory: `coordination/patterns/temporal-naming`

**Pattern #8: Functionality Disabling** (Weight 0.75)
- Trigger: Commenting out code instead of fixing root cause
- Root cause: Technical debt accumulation
- Prevention: Root cause analysis mandatory for all failures
- Memory: `coordination/patterns/functionality-disabling`

**Pattern #9: Mock Behavior in Integration Tests** (Weight 0.8)
- Trigger: Testing mocked behavior instead of real execution
- Root cause: False confidence from passing fake tests
- Prevention: Real data/APIs mandatory in all tests
- Memory: `coordination/patterns/mock-integration-tests`

**Pattern #10: Time-Pressure Shortcuts** (Weight 0.75)
- Trigger: Skipping validation "to save time"
- Root cause: Compounding problems instead of preventing
- Prevention: Validation always in completion criteria
- Memory: `coordination/patterns/time-pressure-shortcuts`

### REAL Memory Coordination (from Skills Library)

**Memory Types** (from hive-mind-advanced skill lines 164-172):
```javascript
// Knowledge memory - learned patterns
await swarm.memory.store('coordination/patterns/file-routing', {
  type: 'knowledge',
  pattern: 'file-routing-violation',
  prevention: 'routing check mandatory'
});

// Context memory - current state
await swarm.memory.store('coordination/current-state', {
  type: 'context',
  active_nudge: 'nudge-001',
  affected_agents: ['doc-reviewer-3']
});

// Task memory - work assignments
await swarm.memory.store('coordination/tasks/nudge-synthesis', {
  type: 'task',
  agent: 'nudge-synthesizer',
  status: 'in-progress'
});

// Result memory - outcomes
await swarm.memory.store('coordination/results/nudge-001', {
  type: 'result',
  adaptations_applied: 1,
  agents_updated: 6
});
```

**Memory Retrieval**:
```javascript
// Retrieve shared context (from swarm-orchestration skill line 116)
const patterns = await swarm.memory.retrieve('coordination/patterns/file-routing');

// Search patterns
const all_nudges = await swarm.memory.search('coordination/patterns/*');
```

### REAL Session Management (from Skills Library)

**Checkpoints** (from hive-mind-advanced skill lines 431-446):
```bash
# Create checkpoint after nudge processed
npx claude-flow@alpha hooks session-checkpoint \
  --checkpoint-id "nudge-001-processed" \
  --state '{"nudges_processed": 1, "adaptations": 1}'

# Session restore if needed
npx claude-flow@alpha hooks session-restore \
  --session-id "swarm-hive-001" \
  --checkpoint "nudge-001-processed"
```

**Session End Export**:
```bash
# Export metrics at session end (from swarm-orchestration skill line 157)
npx claude-flow@alpha hooks session-end \
  --export-metrics true \
  --summary "Processed 5 nudges, 5 adaptations applied"
```

### Nudge Synthesizer Responsibilities

**Always Active**: Spawned via Task tool at hive initialization, persists throughout session

**Responsibilities**:
1. Monitor user messages for correction patterns
2. Analyze nudges against known anti-patterns (using memory retrieval)
3. Identify root behavioral causes
4. Update coordination strategy via `swarm.memory.store()`
5. Broadcast adaptations to all agents (via coordination namespace)
6. Create checkpoints via `hooks session-checkpoint`
7. Track nudge trends for meta-learning (using memory search)

**Integration with Existing Rules**:
- ALWAYS #1 (verify with tests): Nudges reveal when verification skipped
- ALWAYS #6 (memory namespaces): Nudge adaptations stored in `learning` namespace
- NEVER #1 (claims without evidence): Many nudges result from this violation
- NEVER #2 (permission theater): Nudges show when this wastes time
- EXECUTE #3 (memory coordination): Nudge broadcasts use `swarm.memory.store()`

**Success Metrics**:
- Nudge recurrence rate: 0% for same root cause
- Adaptation speed: <30 seconds from nudge to broadcast
- Agent compliance: 100% incorporate updates
- Pattern learning: Each nudge adds to prevention checklist
- Memory persistence: All patterns stored in coordination namespace

### Example Nudge Handling (REAL Patterns)

**User Nudge**: "Very sloppy - you didn't research the Diátaxis organization framework"

**Nudge Synthesizer Response** (using REAL tools):

```javascript
// 1. CAPTURE (swarm.memory.store pattern)
await swarm.memory.store('nudge-log/20251117-154723', {
  type: 'knowledge',
  user_words: "Very sloppy - you didn't research the Diátaxis organization framework",
  context: "Doc refactoring phase, creating guides/concepts/",
  violation: "framework-research-failure",
  timestamp: Date.now()
});

// 2. ANALYZE (memory retrieval pattern)
const similar_patterns = await swarm.memory.search('nudge-log/*framework*');
// Found 3 similar nudges about research failures

// 3. SYNTHESIZE (root cause)
const root_cause = {
  symptom: "Created guides/concepts/ without checking existing structure",
  behavioral_gap: "Fix-first, research-later behavior",
  pattern: "framework-research-failure",
  recurrence: 3 // This is the 3rd time
};

// 4. ADAPT (strategy update)
await swarm.memory.store('coordination/strategy-update-002', {
  type: 'knowledge',
  nudge_id: "nudge-log/20251117-154723",
  root_cause: "Fix-first behavior, skipped research phase",
  affected_agents: ["doc-reviewer-1", "doc-reviewer-2", "doc-reviewer-3"],
  new_directive: "ALWAYS read category README before creating structure",
  prevention: "Add framework audit to pre-task checklist",
  enforcement: "mandatory"
});

// 5. BROADCAST (coordination update)
await swarm.memory.store('coordination/all-agents/directive-update', {
  type: 'task',
  directive: "ALWAYS read category README before creating structure",
  checklist_item: "Framework audit pre-task",
  enforcement: "mandatory",
  affected_patterns: ["category-creation", "structure-design"]
});

// 6. CHECKPOINT (session state)
npx claude-flow@alpha hooks session-checkpoint \
  --checkpoint-id "nudge-002-framework-research" \
  --state '{"nudges_processed": 2, "research_failures": 1}'

// 7. CORRECT (actual work)
// Delete guides/concepts/ (redundant)
// Use explanation/ instead (existing framework)
// Update docs/guides/README.md to remove concepts reference

// 8. LOG (Coordination Ledger)
/**
 * ## [15:47:23] Strategy Adaptation - Framework Research Mandate
 * **Agent**: Nudge Synthesizer
 * **Trigger**: User correction on organization framework research
 * **Analysis**: Proposed guides/concepts/ without reading docs/README.md (Diátaxis)
 * **Root Cause**: Fix-first behavior, skipped research phase
 * **Correction**: Deleted redundant category, updated references
 * **Prevention**: All agents now require framework audit before structural changes
 * **Broadcast**: 6 active agents updated via coordination namespace
 * **Memory Keys**:
 *   - nudge-log/20251117-154723 (knowledge)
 *   - coordination/strategy-update-002 (knowledge)
 *   - coordination/all-agents/directive-update (task)
 * **Checkpoint**: nudge-002-framework-research
 * **Evidence**:
 *   - Git: Deleted guides/concepts/, updated docs/guides/README.md
 *   - Memory: coordination/strategy-update-002
 *   - Hooks: session-checkpoint nudge-002-framework-research
 */
```

---

## Integration Notes

### What This Section Connects To

**Links to Simple Rules** (lines 7-58):
- Nudges reveal violations of ALWAYS/NEVER rules
- EXECUTE #3 (memory coordination) is how nudge adaptations broadcast
- Framework enforces rules, nudges show when rules ignored

**Links to Weighting Schema** (lines 61-89):
- Nudge categories use similar confidence weighting
- High-weight nudges (0.8+) trigger immediate strategy updates
- Low-weight nudges (0.3-0.5) tracked for pattern analysis

**Links to User Context** (lines 126-151):
- "Theater tolerance: ZERO" explains why nudges happen
- "Evidence over claims" is what nudges enforce
- "Root cause fixes" is what Nudge Synthesizer ensures

**Links to Coordination Ledger** (lines 281-452):
- Every nudge adaptation logged as Coordination Ledger entry
- Nudge Synthesizer updates ledger in real-time
- User can monitor adaptations via `tail -f COORDINATION-LEDGER.md`

**Links to Success Evidence** (lines 229-278):
- Memory queries show nudge logs: `swarm.memory.search('nudge-log/*')`
- Coordination messages show adaptations
- Session checkpoints prove adaptations applied

### Key Differences from Original Framework

**BEFORE** (made-up patterns):
```javascript
// ❌ Fictional memory pattern
mcp__claude-flow_alpha__memory_usage({
  action: "store",
  key: "nudge-log/timestamp",
  value: JSON.stringify({...}),
  namespace: "learning"
})
```

**AFTER** (REAL swarm-orchestration pattern):
```javascript
// ✅ Actual memory pattern from skills library
await swarm.memory.store('nudge-log/timestamp', {
  type: 'knowledge', // hive-mind memory type
  ...data
});
```

**BEFORE** (no agent spawn details):
```
Nudge Synthesizer agent (vague description)
```

**AFTER** (REAL Task tool pattern):
```javascript
// ✅ Actual Task tool spawn from hive-mind-advanced skill
Task("Nudge Synthesizer",
  "Monitor user messages... [full instructions]",
  "analyst"
)
```

**BEFORE** (no session management):
```
Log to memory
```

**AFTER** (REAL session checkpoints):
```bash
# ✅ Actual hooks from hive-mind-advanced skill lines 431-446
npx claude-flow@alpha hooks session-checkpoint \
  --checkpoint-id "nudge-001" \
  --state '{...}'
```

### Validation Against Skills Library

**✅ swarm-orchestration skill** (lines 106-117):
- Memory coordination: `swarm.memory.store()` and `retrieve()` ✅
- Shared state across swarm ✅
- Adaptive execution patterns ✅

**✅ hive-mind-advanced skill** (lines 154-189):
- Collective memory for coordination ✅
- Memory types: knowledge, context, task, result ✅
- Session management with checkpoints ✅
- Queen coordination patterns ✅

**✅ Integration** (swarm-orchestration lines 146-157):
- Hooks integration: `pre-task`, `post-task`, `session-restore` ✅
- Session checkpoints ✅
- Coordination lifecycle ✅

### Tone and Style Matching

**Existing Prompt Style**:
- Direct, no hedging ("ALWAYS", "NEVER", "EXECUTE")
- Evidence-based (file paths, line counts, memory keys)
- Systematic (numbered lists, clear structure)
- Honest about failures (78% vs 100%, 55% confidence ceiling)

**Nudge Framework Style** (matches above):
- Direct imperatives ("IMMEDIATE", "ANALYZE", "SYNTHESIZE")
- Evidence requirements (memory keys, checkpoints, broadcasts)
- Systematic protocol (7-step nudge processing with REAL tools)
- Honest about patterns (10 known failures documented)
- References REAL skills library patterns with line numbers

---

## Summary

**Placement**: Insert after line 151 (User Context), before line 153 (High-Value References)

**Integration Quality**:
- ✅ Zero redundancy with existing sections
- ✅ Uses REAL swarm.memory.store() patterns from skills
- ✅ Uses REAL Task tool spawn patterns from hive-mind-advanced
- ✅ Uses REAL session checkpoints from hive-mind-advanced
- ✅ Uses REAL hooks integration from swarm-orchestration
- ✅ References actual skill line numbers for validation
- ✅ Matches prompt tone and style
- ✅ No conflicts with ALWAYS/NEVER/EXECUTE rules

**Skills Library Alignment**:
- ✅ Memory coordination: swarm-orchestration lines 106-117
- ✅ Memory types: hive-mind-advanced lines 164-172
- ✅ Session checkpoints: hive-mind-advanced lines 431-446
- ✅ Hooks integration: swarm-orchestration lines 146-157
- ✅ Task tool spawn: hive-mind-advanced lines 8-16
- ✅ Adaptive execution: swarm-orchestration lines 93-104

**User Concerns Addressed**:
- ✅ 100% coherence with actual Claude Flow patterns
- ✅ No made-up tools or fictional patterns
- ✅ Integration without breaking stride
- ✅ Pattern learning from 10 known nudges
- ✅ All evidence requirements met with REAL tools

**Validation**: Every code example references actual skills library patterns with line numbers for verification.
