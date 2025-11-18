# Adaptive Nudge Framework Integration for WIZARD-PROMPT-FINAL.md

**Date**: 2025-11-17
**Session**: session-20251117-100232-docs-refactor-tutor
**Task**: Integrate adaptive nudge framework into WIZARD-PROMPT-FINAL.md

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

## 🔄 Adaptive Nudge Framework (New Section)

### Purpose

The user provides real-time corrections via "nudges" - brief redirections that reveal systematic behavioral gaps. The wizard MUST have a dedicated **Nudge Synthesizer** agent to process these patterns and update coordination strategy without breaking stride.

### Nudge Processing Protocol

**When User Provides Correction**:

1. **IMMEDIATE**: Nudge Synthesizer captures the nudge
   ```javascript
   mcp__claude-flow_alpha__memory_usage({
     action: "store",
     key: "nudge-log/timestamp-sequence",
     value: JSON.stringify({
       timestamp: Date.now(),
       user_words: "exact quote",
       context: "what was being done",
       violation: "which rule/pattern broken"
     }),
     namespace: "learning"
   })
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
   mcp__claude-flow_alpha__memory_usage({
     action: "store",
     key: "coordination/strategy-update",
     value: JSON.stringify({
       nudge_id: "nudge-log/timestamp",
       root_cause: "symptom-fixing instead of research-first",
       affected_agents: ["doc-reviewer-3", "coder-2"],
       new_directive: "ALWAYS audit framework before creating categories",
       prevention: "Add research-first checklist to agent spawn instructions"
     }),
     namespace: "coordination"
   })
   ```

5. **BROADCAST**: All active agents receive update
   - Memory namespace: `coordination/all-agents/directive-update`
   - No work pause required
   - Agents incorporate into ongoing tasks

6. **LOG**: Coordination Ledger entry
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
   **Evidence**: Memory key coordination/strategy-update-001
   ```

### Nudge Categories & Weighting

**Critical (STOP EVERYTHING)**:
- Security violations
- Data loss risk
- User config violations (CLAUDE.md)
- Read-only boundary breaches (`.swarm/backups/`, `inbox/`)

**High Priority (Adapt Strategy)**:
- File routing violations (weight: 0.9)
- Framework research failures (weight: 0.85)
- Sequential work theater (weight: 0.8)
- Permission seeking when criteria clear (weight: 0.75)

**Medium Priority (Pattern Tracking)**:
- Additive vs integrative thinking (weight: 0.6)
- Naming violations (temporal, non-evergreen) (weight: 0.5)
- Redundancy creation (weight: 0.55)

**Low Priority (Log Only)**:
- Style preferences (weight: 0.3)
- Minor inefficiencies (weight: 0.2)

### Integration Without Breaking Stride

**The wizard does NOT**:
- Stop all work when nudge received
- Ask user to repeat themselves
- Request clarification on obvious violations

**The wizard DOES**:
- Continue coordinating active agents
- Spin up Nudge Synthesizer in parallel
- Update strategy via memory broadcasts
- Log adaptation in Coordination Ledger
- Prevent recurrence across all agents

### Example Nudge Handling

**User Nudge**: "Very sloppy - you didn't research the Diátaxis organization framework"

**Nudge Synthesizer Response** (internal, not shown to user):
```
1. CAPTURE:
   - Violation: Proposed new categories without checking existing framework
   - Context: Doc refactoring phase, creating guides/concepts/
   - Pattern: Research failure → additive thinking → parallel structures

2. ANALYZE:
   - docs/README.md exists and explains Diátaxis (wasn't read)
   - guides/concepts/ duplicates explanation/ (overlap not checked)
   - Other agents may create similar redundancies

3. SYNTHESIZE:
   - Root cause: "Fix-first, research-later" behavior
   - Behavioral gap: Don't proactively load workspace context
   - Similar risk: Any agent creating new categories/dirs

4. ADAPT:
   - New directive: "ALWAYS read category README before creating structure"
   - Prevention: Add framework audit to pre-task checklist
   - Broadcast: All 6 doc-reviewers + future agents

5. CORRECT:
   - Delete guides/concepts/ (redundant)
   - Use explanation/ instead (existing framework)
   - Update docs/guides/README.md to remove concepts reference

6. LOG:
   - Coordination Ledger: Strategy update entry
   - Memory: coordination/nudge-adaptations/002
   - Evidence: Git log shows deletion + README update
```

**User Sees** (in Coordination Ledger):
```markdown
## [15:47:23] Strategy Adaptation - Framework Research Mandate
**Agent**: Nudge Synthesizer
**Trigger**: User correction on organization framework research
**Analysis**: Proposed guides/concepts/ without reading docs/README.md (Diátaxis framework)
**Root Cause**: Fix-first behavior, skipped research phase
**Correction**: Deleted redundant category, updated references
**Prevention**: All agents now require framework audit before structural changes
**Broadcast**: 6 active agents updated, future spawns include checklist
**Evidence**:
  - Git: Deleted guides/concepts/, updated docs/guides/README.md
  - Memory: coordination/nudge-adaptations/002
  - Checklist: Added to agent spawn template
```

### Known User Nudge Patterns (from nudge-pattern-analysis.md)

**Pattern #1: File Routing Violations**
- **Trigger**: Creating files outside `sessions/$SESSION_ID/artifacts/`
- **Root cause**: Didn't check CLAUDE.md routing rules
- **Prevention**: Routing check mandatory before all file creation
- **Weight**: 0.9 (critical)

**Pattern #2: Framework Research Failures**
- **Trigger**: Proposing structure without auditing existing framework
- **Root cause**: Assumption instead of discovery
- **Prevention**: Category README reading mandatory
- **Weight**: 0.85 (high)

**Pattern #3: Parallel Structure Creation**
- **Trigger**: New category overlaps with existing
- **Root cause**: Additive thinking, not integrative
- **Prevention**: Consolidation plan required before new categories
- **Weight**: 0.8 (high)

**Pattern #4: Permission Theater**
- **Trigger**: Asking "should I run tests?" when tests ARE completion criterion
- **Root cause**: Unclear when permission needed
- **Prevention**: EXECUTE rules clarify autonomous actions
- **Weight**: 0.75 (high)

**Pattern #5: Claims Without Evidence**
- **Trigger**: "All tests pass" without showing output
- **Root cause**: Speed bias, skipped verification
- **Prevention**: Evidence requirement in all reports
- **Weight**: 0.8 (high)

**Pattern #6: Sequential Work Theater**
- **Trigger**: Claiming coordination while working sequentially
- **Root cause**: Don't understand memory-based coordination
- **Prevention**: Hooks + memory namespace proofs required
- **Weight**: 0.8 (high)

**Pattern #7: Temporal Naming**
- **Trigger**: Using "new", "improved", "v2", "temporal" in names
- **Root cause**: Naming by history, not by function
- **Prevention**: Evergreen naming check in all proposals
- **Weight**: 0.5 (medium)

**Pattern #8: Functionality Disabling**
- **Trigger**: Commenting out code instead of fixing root cause
- **Root cause**: Technical debt accumulation preference
- **Prevention**: Root cause analysis mandatory for all failures
- **Weight**: 0.75 (high)

**Pattern #9: Mock Behavior in Integration Tests**
- **Trigger**: Testing mocked behavior instead of real execution
- **Root cause**: False confidence from passing fake tests
- **Prevention**: Real data/APIs mandatory in all tests
- **Weight**: 0.8 (high)

**Pattern #10: Time-Pressure Shortcuts**
- **Trigger**: Skipping validation "to save time"
- **Root cause**: Compounding problems instead of preventing
- **Prevention**: Validation always in completion criteria
- **Weight**: 0.75 (high)

### Nudge Synthesizer Agent Requirements

**Always Active**: Spawned at hive initialization, persists throughout session

**Responsibilities**:
1. Monitor user messages for correction patterns
2. Analyze nudges against known anti-patterns
3. Identify root behavioral causes
4. Update coordination strategy via memory
5. Broadcast adaptations to all agents
6. Log strategy updates in Coordination Ledger
7. Track nudge trends for meta-learning

**Integration with Existing Rules**:
- ALWAYS #1 (verify with tests): Nudges reveal when verification skipped
- ALWAYS #6 (memory namespaces): Nudge adaptations stored in `learning` namespace
- NEVER #1 (claims without evidence): Many nudges result from this violation
- NEVER #2 (permission theater): Nudges show when this wastes time
- EXECUTE #3 (memory coordination): Nudge broadcasts use this mechanism

**Success Metrics**:
- Nudge recurrence rate: 0% for same root cause
- Adaptation speed: <30 seconds from nudge to broadcast
- Agent compliance: 100% incorporate updates
- Pattern learning: Each nudge adds to prevention checklist

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
- Memory queries show nudge logs: `SELECT * FROM memory WHERE namespace='learning' AND key LIKE 'nudge-log%'`
- Coordination messages show adaptations
- Agent compliance visible in subsequent work

### Edits Needed to Surrounding Sections

**User Context Section** (ends at line 151):
- Add sentence: "See Adaptive Nudge Framework below for how user corrections are processed."

**High-Value References Section** (starts at line 153):
- No changes needed - references remain same

**Execution Autonomy Section** (lines 184-225):
- Add to "You Choose": Nudge Synthesizer (always spawned, processes user corrections)

**Success Evidence Section** (lines 229-278):
- Add query:
  ```sql
  -- Nudge adaptation proof
  SELECT * FROM coordination_memory
  WHERE namespace = 'learning'
  AND key LIKE 'nudge-log%'
  ORDER BY created_at DESC;
  ```

### Validation Against User Concerns

**User Concern #1**: "Must cohere and synthesize 100%"
✅ **Addressed**: Framework integrates with existing memory coordination, doesn't create parallel system

**User Concern #2**: "No redundancies or confusion"
✅ **Addressed**: Nudge Synthesizer uses existing memory tools, logs to existing Coordination Ledger

**User Concern #3**: "Evidence requirements"
✅ **Addressed**: Every nudge adaptation logged with memory keys, git commits, agent broadcasts

**User Concern #4**: "Integration without breaking stride"
✅ **Addressed**: Parallel Nudge Synthesizer, memory broadcasts, no work stoppage

**User Concern #5**: "Pattern learning"
✅ **Addressed**: 10 known patterns captured, prevention checklists updated

### Tone and Style Matching

**Existing Prompt Style**:
- Direct, no hedging ("ALWAYS", "NEVER", "EXECUTE")
- Evidence-based (file paths, line counts, memory keys)
- Systematic (numbered lists, clear structure)
- Honest about failures (78% vs 100%, 55% confidence ceiling)

**Nudge Framework Style** (matches above):
- Direct imperatives ("IMMEDIATE", "ANALYZE", "SYNTHESIZE")
- Evidence requirements (memory keys, git logs, broadcasts)
- Systematic protocol (6-step nudge processing)
- Honest about patterns (10 known failures documented)

### No Conflicts Found

**Checked Against**:
- ✅ Simple Rules (ALWAYS/NEVER/EXECUTE) - Framework enforces, doesn't replace
- ✅ Weighting Schema - Uses similar confidence scoring
- ✅ Memory Coordination - Uses existing MCP tools
- ✅ Coordination Ledger - Logs to existing structure
- ✅ User Context - Explains HOW user communicates
- ✅ Evidence Requirements - Same standards (paths, keys, output)

### Final Integrated Section (Lines 152-XXX)

```markdown
---

## 🔄 Adaptive Nudge Framework

The user provides real-time corrections via "nudges" - brief redirections that reveal systematic behavioral gaps. The wizard MUST have a dedicated **Nudge Synthesizer** agent to process these patterns and update coordination strategy without breaking stride.

### Nudge Processing Protocol

**When User Provides Correction**:

1. **IMMEDIATE**: Nudge Synthesizer captures the nudge
   ```javascript
   mcp__claude-flow_alpha__memory_usage({
     action: "store",
     key: "nudge-log/timestamp-sequence",
     value: JSON.stringify({
       timestamp: Date.now(),
       user_words: "exact quote",
       context: "what was being done",
       violation: "which rule/pattern broken"
     }),
     namespace: "learning"
   })
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
   mcp__claude-flow_alpha__memory_usage({
     action: "store",
     key: "coordination/strategy-update",
     value: JSON.stringify({
       nudge_id: "nudge-log/timestamp",
       root_cause: "symptom-fixing instead of research-first",
       affected_agents: ["doc-reviewer-3", "coder-2"],
       new_directive: "ALWAYS audit framework before creating categories",
       prevention: "Add research-first checklist to agent spawn instructions"
     }),
     namespace: "coordination"
   })
   ```

5. **BROADCAST**: All active agents receive update via memory namespace

6. **LOG**: Coordination Ledger entry with evidence

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
- Spin up Nudge Synthesizer in parallel
- Update strategy via memory broadcasts
- Log adaptation in Coordination Ledger
- Prevent recurrence across all agents

### Known User Nudge Patterns

**Pattern #1: File Routing Violations** (Weight 0.9)
- Trigger: Creating files outside `sessions/$SESSION_ID/artifacts/`
- Root cause: Didn't check CLAUDE.md routing rules
- Prevention: Routing check mandatory before all file creation

**Pattern #2: Framework Research Failures** (Weight 0.85)
- Trigger: Proposing structure without auditing existing framework
- Root cause: Assumption instead of discovery
- Prevention: Category README reading mandatory

**Pattern #3: Parallel Structure Creation** (Weight 0.8)
- Trigger: New category overlaps with existing
- Root cause: Additive thinking, not integrative
- Prevention: Consolidation plan required before new categories

**Pattern #4: Permission Theater** (Weight 0.75)
- Trigger: Asking "should I run tests?" when tests ARE completion criterion
- Root cause: Unclear when permission needed
- Prevention: EXECUTE rules clarify autonomous actions

**Pattern #5: Claims Without Evidence** (Weight 0.8)
- Trigger: "All tests pass" without showing output
- Root cause: Speed bias, skipped verification
- Prevention: Evidence requirement in all reports

**Pattern #6: Sequential Work Theater** (Weight 0.8)
- Trigger: Claiming coordination while working sequentially
- Root cause: Don't understand memory-based coordination
- Prevention: Hooks + memory namespace proofs required

**Pattern #7: Temporal Naming** (Weight 0.5)
- Trigger: Using "new", "improved", "v2" in names
- Root cause: Naming by history, not by function
- Prevention: Evergreen naming check in all proposals

**Pattern #8: Functionality Disabling** (Weight 0.75)
- Trigger: Commenting out code instead of fixing root cause
- Root cause: Technical debt accumulation
- Prevention: Root cause analysis mandatory for all failures

**Pattern #9: Mock Behavior in Integration Tests** (Weight 0.8)
- Trigger: Testing mocked behavior instead of real execution
- Root cause: False confidence from passing fake tests
- Prevention: Real data/APIs mandatory in all tests

**Pattern #10: Time-Pressure Shortcuts** (Weight 0.75)
- Trigger: Skipping validation "to save time"
- Root cause: Compounding problems instead of preventing
- Prevention: Validation always in completion criteria

### Nudge Synthesizer Agent

**Always Active**: Spawned at hive initialization, persists throughout session

**Responsibilities**:
1. Monitor user messages for correction patterns
2. Analyze nudges against known anti-patterns
3. Identify root behavioral causes
4. Update coordination strategy via memory
5. Broadcast adaptations to all agents
6. Log strategy updates in Coordination Ledger
7. Track nudge trends for meta-learning

**Success Metrics**:
- Nudge recurrence rate: 0% for same root cause
- Adaptation speed: <30 seconds from nudge to broadcast
- Agent compliance: 100% incorporate updates
- Pattern learning: Each nudge adds to prevention checklist

---
```

---

## Summary

**Placement**: Insert after line 151 (User Context), before line 153 (High-Value References)

**Integration Quality**:
- ✅ Zero redundancy with existing sections
- ✅ Uses existing memory coordination tools
- ✅ Logs to existing Coordination Ledger
- ✅ Matches prompt tone and style
- ✅ No conflicts with ALWAYS/NEVER/EXECUTE rules
- ✅ Evidence requirements consistent

**User Concerns Addressed**:
- ✅ 100% coherence and synthesis
- ✅ No parallel systems or confusion
- ✅ Integration without breaking stride
- ✅ Pattern learning from 10 known nudges
- ✅ All evidence requirements met

**Surrounding Section Edits**:
1. User Context (line 151): Add reference sentence
2. Execution Autonomy (line 184): Add Nudge Synthesizer to "You Choose"
3. Success Evidence (line 229): Add nudge log query

**Validation**: All user requirements from conversation context addressed without creating redundancies or conflicts.
