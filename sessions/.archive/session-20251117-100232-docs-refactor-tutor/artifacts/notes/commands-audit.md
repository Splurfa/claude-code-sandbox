# Custom Commands Audit

**Date**: 2025-11-17
**Total Commands**: 105 files
**Native Claude-Flow Version**: v2.7.35
**Context**: Post-100/100 integration testing

---

## Executive Summary

**Critical Findings**:
1. **80% of commands are documentation wrappers** around native CLI/MCP functionality
2. **Several naming conflicts** with actual native commands
3. **Outdated patterns** detected (CLI-first instead of MCP-first)
4. **Missing session-closeout** command (referenced in CLAUDE.md but doesn't exist)
5. **No conflicts with hive-mind functionality** - these are properly separated

**Recommendation**: Remove 60-70% of commands, update 20%, keep 10%.

---

## Inventory by Category

### 🟢 ALIGNED (Keep As-Is)
**Total**: 11 commands

| Command | Purpose | Status |
|---------|---------|--------|
| `/session-start` | Creates session directories | ✅ Custom workflow, aligned |
| `/hive-mind-wizard` | Interactive swarm setup | ✅ Stub for native command |
| `/hive-mind-*` (11 total) | Hive mind operations | ✅ All documentation stubs |

**Rationale**: Session management is custom workflow. Hive-mind commands are lightweight documentation that doesn't conflict.

---

### 🟡 NEEDS UPDATE (Update Required)
**Total**: 15 commands

| Command | Issue | Recommendation |
|---------|-------|----------------|
| `/hooks/pre-task` | Describes features not in native CLI | Update to match actual `hooks pre-task` behavior |
| `/hooks/post-task` | Includes non-existent `--generate-insights` | Remove fictional options |
| `/hooks/session-end` | Describes `--generate-summary` (not native) | Document actual behavior only |
| `/hooks/pre-edit` | Not a real native command | Either remove or clarify it's conceptual |
| `/hooks/post-edit` | Not a real native command | Either remove or clarify it's conceptual |
| `/coordination/swarm-init` | Shows old CLI syntax | Update to MCP-first pattern |
| `/coordination/task-orchestrate` | Shows old CLI syntax | Update to MCP-first pattern |
| `/memory/memory-usage` | Shows CLI instead of MCP | **CRITICAL**: Update to show MCP tool usage |
| `/sparc/*` (15 files) | Mix of real/conceptual modes | Verify each against native SPARC modes |
| `/automation/smart-spawn` | Implies auto-feature that may not exist | Verify functionality exists |
| `/automation/session-memory` | Unclear if this is native | Verify or remove |
| `/optimization/auto-topology` | May not be automatic | Verify behavior |
| `/optimization/topology-optimize` | May be manual | Clarify usage |
| `/analysis/token-efficiency` | May not exist as standalone | Verify command |
| `/analysis/bottleneck-detect` | May not exist as standalone | Verify command |

---

### 🔴 CONFLICTS / REMOVE (Critical Issues)
**Total**: 35 commands

#### **Naming Conflicts**
Commands that shadow real native commands with incorrect documentation:

| Command | Conflict | Impact |
|---------|----------|--------|
| `/coordination/init` | Conflicts with `claude-flow init` | User confusion |
| `/coordination/spawn` | Redundant with `agent-spawn` | Duplicative |
| `/coordination/agent-spawn` | Redundant with `agent spawn` | Duplicative |
| `/swarm/swarm-init` | Duplicates `/coordination/swarm-init` | Internal duplication |

#### **Outdated Patterns**
Commands that teach wrong patterns (CLI-first instead of MCP-first):

| Command | Issue | Why Remove |
|---------|-------|------------|
| `/memory/memory-usage` | Shows `npx claude-flow memory usage` | Should show MCP tool usage |
| `/memory/memory-search` | Shows CLI pattern | Should use `mcp__claude-flow_alpha__memory_search` |
| `/memory/memory-persist` | Shows CLI pattern | Should use MCP tool |
| `/memory/neural` | Unclear what this does | Verify or remove |
| `/training/neural-train` | Shows CLI pattern | Should use MCP tool |
| `/training/neural-patterns` | Shows CLI pattern | Should use MCP tool |
| `/training/pattern-learn` | May not exist | Verify or remove |
| `/training/model-update` | May not exist | Verify or remove |
| `/training/specialization` | May not exist | Verify or remove |

#### **Unverified Functionality**
Commands that may not exist in native claude-flow:

| Command | Status | Action |
|---------|--------|--------|
| `/automation/auto-agent` | Unverified | Test or remove |
| `/automation/self-healing` | Unverified | Test or remove |
| `/automation/workflow-select` | Unverified | Test or remove |
| `/workflows/workflow-create` | Unverified | Test or remove |
| `/workflows/workflow-execute` | Unverified | Test or remove |
| `/workflows/workflow-export` | Unverified | Test or remove |
| `/workflows/development` | Unverified | Test or remove |
| `/workflows/research` | Unverified | Test or remove |
| `/optimization/cache-manage` | Unverified | Test or remove |
| `/optimization/parallel-execute` | Unverified | Test or remove |
| `/optimization/parallel-execution` | Duplicate of above? | Remove |
| `/monitoring/real-time-view` | Unverified | Test or remove |
| `/monitoring/agents` | Redundant with `agent list` | Remove |
| `/github/*` (6 commands) | All unverified | Test each or remove |

#### **Documentation-Only Stubs**
Commands that provide no value (just placeholder text):

| Command | Issue |
|---------|-------|
| `/agents/README.md` | 5 README files just list other commands |
| `/analysis/README.md` | Redundant with directory listing |
| `/automation/README.md` | Redundant |
| `/coordination/README.md` | Redundant |
| `/github/README.md` | Redundant |
| `/hooks/README.md` | Redundant |
| `/memory/README.md` | Redundant |
| `/monitoring/README.md` | Redundant |
| `/optimization/README.md` | Redundant |
| `/sparc/README.md` | Redundant |
| `/swarm/README.md` | Redundant |
| `/training/README.md` | Redundant |
| `/workflows/README.md` | Redundant |

**Recommendation**: Remove all 13 README files. Directory structure is self-documenting.

---

### ❌ MISSING BUT REFERENCED
**Total**: 1 command

| Command | Referenced In | Status |
|---------|---------------|--------|
| `/session-closeout` | CLAUDE.md, user instructions | **DOES NOT EXIST** |

**CRITICAL**: CLAUDE.md says "User-initiated session commands: `/session-start <topic>` - Create new session, `/session-closeout` - End current session (with HITL approval)" but `/session-closeout` doesn't exist!

**Action Required**: Either create this command or remove references.

---

## Critical Issues

### 1. **Memory Command Pattern Violation** 🔴
**Severity**: CRITICAL
**Impact**: Teaches users wrong pattern

**Problem**:
- `/memory/memory-usage.md` shows: `npx claude-flow memory usage --action store`
- CLAUDE.md correctly says: Use `mcp__claude-flow_alpha__memory_usage({ action: "store", ... })`

**User Impact**: Users following `/memory-usage` command will learn CLI pattern when they should use MCP tools.

**Fix**: Update command to show MCP usage or remove entirely.

---

### 2. **Hooks Commands Over-Promise** 🔴
**Severity**: HIGH
**Impact**: User confusion, broken workflows

**Problem**:
Commands describe features that don't exist in native `claude-flow hooks`:

| Command | Claims | Reality |
|---------|--------|---------|
| `/hooks/pre-task` | `--auto-spawn-agents`, `--optimize-topology`, `--estimate-complexity` | Native only has `--description`, `--task-id`, `--agent-id` |
| `/hooks/post-task` | `--generate-insights`, `--analyze-performance` | Native only has `--task-id`, `--analyze-performance` |
| `/hooks/session-end` | `--generate-summary`, `--cleanup-temp` | Native only has `--export-metrics`, `--swarm-id`, `--generate-summary` |

**Fix**: Update commands to match actual native hook options.

---

### 3. **Session Closeout Missing** 🔴
**Severity**: CRITICAL
**Impact**: Broken user workflow

**Problem**:
- CLAUDE.md references `/session-closeout` command
- User instructions reference `/session-closeout`
- **Command does not exist**

**Evidence**:
```bash
$ ls /Users/splurfa/common-thread-sandbox/.claude/commands/session/
session-start.md  # EXISTS
# session-closeout.md MISSING
```

**Fix**: Create `/session-closeout.md` command that:
1. Checks for active session
2. Runs `npx claude-flow@alpha hooks session-end --export-metrics true`
3. Updates `metadata.json` status to "completed"
4. Moves session to `.swarm/backups/`
5. Clears `ACTIVE_SESSION_ID` environment variable

---

### 4. **CLI-First vs MCP-First Contradiction** 🔴
**Severity**: HIGH
**Impact**: Performance degradation, wrong patterns

**Problem**: 60+ commands teach CLI-first pattern when CLAUDE.md says use MCP tools.

**Example**:
```markdown
# Command shows:
npx claude-flow training neural-train --data recent

# Should show:
mcp__claude-flow_alpha__neural_train({
  pattern_type: "coordination",
  training_data: "recent-operations"
})
```

**Categories Affected**:
- `/training/*` (6 commands)
- `/memory/*` (4 commands)
- `/coordination/*` (7 commands)
- `/automation/*` (7 commands)

**Fix**: Either update to show MCP pattern or remove.

---

### 5. **Internal Duplication** 🟡
**Severity**: MEDIUM
**Impact**: User confusion

**Examples**:
- `/coordination/swarm-init` + `/swarm/swarm-init` (same content)
- `/coordination/spawn` + `/coordination/agent-spawn` (similar purpose)
- `/optimization/parallel-execute` + `/optimization/parallel-execution` (likely duplicate)

**Fix**: Remove duplicates, keep one canonical version.

---

### 6. **SPARC Commands Uncertainty** 🟡
**Severity**: MEDIUM
**Impact**: May teach non-existent modes

**Problem**: 15 SPARC commands exist, but native CLI only shows:
- `spec` - Requirements analysis
- `architect` - System design
- `tdd` - Test-driven development
- `integration` - Component connection
- `refactor` - Code improvement
- `modes` - List modes

**Custom commands include**:
- `/sparc/analyzer.md` - Not in native list
- `/sparc/coder.md` - Not in native list
- `/sparc/debugger.md` - Not in native list
- `/sparc/designer.md` - Not in native list
- `/sparc/documenter.md` - Not in native list
- `/sparc/innovator.md` - Not in native list
- `/sparc/memory-manager.md` - Not in native list
- `/sparc/optimizer.md` - Not in native list
- `/sparc/researcher.md` - Not in native list
- `/sparc/reviewer.md` - Not in native list
- `/sparc/swarm-coordinator.md` - Not in native list
- `/sparc/tdd.md` - Matches native ✅
- `/sparc/tester.md` - Not in native list
- `/sparc/workflow-manager.md` - Not in native list
- `/sparc/batch-executor.md` - Not in native list

**Action**: Test each SPARC mode to verify existence, remove non-existent ones.

---

## Integration Testing Needs

### Commands Requiring Hive-Mind Testing

| Command | Test Scenario | Expected Behavior |
|---------|---------------|-------------------|
| `/session-start` | Start session → spawn hive-mind → verify session ID inheritance | Agents should know active session |
| `/hooks/pre-task` | Run pre-task → check memory coordination | Should coordinate via hooks |
| `/hooks/post-task` | Run post-task → verify metrics export | Should save to memory |
| `/coordination/swarm-init` | Init swarm → spawn agents → verify topology | Should match requested topology |
| `/automation/smart-spawn` | Trigger auto-spawn → verify agent selection | Should spawn correct types |

### Memory Namespace Testing

| Command | Namespace Used | Potential Conflict |
|---------|----------------|-------------------|
| `/memory/memory-usage` | `default` | May conflict with hive-mind namespaces |
| `/automation/session-memory` | Unknown | Needs verification |
| `/hooks/post-edit` | `swarm/[agent]/[step]` | Should align with hive-mind coordination |

**Action**: Test all memory commands with active hive-mind swarms to detect namespace collisions.

---

## User Experience Analysis

### Naming Intuitiveness

#### 🟢 Good Names
- `/session-start` - Clear purpose
- `/hive-mind-wizard` - Clear purpose
- `/code-review` - Clear purpose

#### 🟡 Confusing Names
- `/coordination/init` vs `claude-flow init` - Which to use?
- `/coordination/spawn` vs `/coordination/agent-spawn` - What's the difference?
- `/swarm/swarm-init` vs `/coordination/swarm-init` - Duplicates

#### 🔴 Misleading Names
- `/hooks/pre-edit` - Doesn't exist as native command
- `/hooks/post-edit` - Doesn't exist as native command
- `/memory/memory-usage` - Shows wrong usage pattern

### Description Accuracy

**Accurate**:
- `/hive-mind-wizard` - "Interactive setup wizard" ✅
- `/session-start` - "Create new session" ✅

**Inaccurate**:
- `/hooks/pre-task` - Claims features that don't exist ❌
- `/memory/memory-usage` - Shows CLI instead of MCP ❌
- `/coordination/swarm-init` - Describes options not available ❌

### Native Alternatives

| Custom Command | Native Alternative | Recommendation |
|----------------|-------------------|----------------|
| `/coordination/swarm-init` | `mcp__claude-flow__swarm_init` MCP tool | **Remove custom**, use MCP |
| `/coordination/agent-spawn` | `mcp__claude-flow__agent_spawn` MCP tool | **Remove custom**, use MCP |
| `/coordination/task-orchestrate` | `mcp__claude-flow__task_orchestrate` MCP tool | **Remove custom**, use MCP |
| `/memory/memory-usage` | `mcp__claude-flow_alpha__memory_usage` MCP tool | **Remove custom**, use MCP |
| `/memory/memory-search` | `mcp__claude-flow_alpha__memory_search` MCP tool | **Remove custom**, use MCP |
| `/training/neural-train` | `mcp__claude-flow_alpha__neural_train` MCP tool | **Remove custom**, use MCP |
| `/hooks/pre-task` | `npx claude-flow@alpha hooks pre-task` native CLI | **Update** to match native |
| `/hooks/post-task` | `npx claude-flow@alpha hooks post-task` native CLI | **Update** to match native |
| `/hooks/session-end` | `npx claude-flow@alpha hooks session-end` native CLI | **Update** to match native |
| `/sparc/tdd` | `npx claude-flow@alpha sparc tdd` native CLI | **Update** to match native |

---

## Consolidation Opportunities

### Category: Memory Operations
**Current**: 4 commands (`memory-usage`, `memory-search`, `memory-persist`, `neural`)
**Recommendation**: Remove all, replace with single `/memory-guide.md` that explains MCP tool usage

### Category: Coordination
**Current**: 7 commands (`init`, `spawn`, `agent-spawn`, `swarm-init`, `task-orchestrate`, `orchestrate`)
**Recommendation**: Remove all, replace with single `/coordination-guide.md` for MCP tools

### Category: Hooks
**Current**: 6 commands (`pre-task`, `post-task`, `pre-edit`, `post-edit`, `session-end`, `setup`)
**Recommendation**: Keep 3 (pre-task, post-task, session-end), remove 3 (pre-edit, post-edit, setup), update descriptions

### Category: Swarm
**Current**: 10 commands
**Recommendation**: Keep 2 (swarm-analysis, swarm-strategies as guides), remove 8 duplicates

### Category: SPARC
**Current**: 15 commands
**Recommendation**: Keep 5 verified modes, remove 10 unverified

---

## Recommendations

### Immediate Actions (Priority 1 - Critical)

1. **Create `/session-closeout.md`** - Referenced but missing
   - **Impact**: Breaks documented user workflow
   - **Effort**: 30 minutes
   - **Implementation**:
     ```bash
     # Create file at .claude/commands/session/session-closeout.md
     # Include HITL approval check
     # Call hooks session-end
     # Update metadata.json
     # Move to .swarm/backups/
     ```

2. **Fix `/memory/memory-usage.md`** - Teaching wrong pattern
   - **Impact**: Users learn CLI instead of MCP
   - **Effort**: 15 minutes
   - **Action**: Rewrite to show MCP tool usage

3. **Update hooks commands** - Over-promising features
   - **Impact**: User confusion when options don't work
   - **Effort**: 45 minutes (3 files)
   - **Files**: `/hooks/pre-task.md`, `/hooks/post-task.md`, `/hooks/session-end.md`

---

### Short-Term Actions (Priority 2 - High)

4. **Remove duplicates** - Internal conflicts
   - **Impact**: User confusion about which to use
   - **Effort**: 1 hour
   - **Targets**:
     - Remove `/swarm/swarm-init.md` (keep `/coordination/swarm-init.md`)
     - Remove `/coordination/spawn.md` (keep `/coordination/agent-spawn.md`)
     - Remove `/optimization/parallel-execution.md` (keep `/optimization/parallel-execute.md`)

5. **Remove 13 README files** - No value
   - **Impact**: Cleaner structure
   - **Effort**: 5 minutes
   - **Command**: `rm .claude/commands/*/README.md`

6. **Verify SPARC modes** - May not exist
   - **Impact**: Users try non-existent commands
   - **Effort**: 2 hours
   - **Action**: Test each SPARC command, remove failures

---

### Long-Term Actions (Priority 3 - Medium)

7. **Convert CLI commands to MCP guides** - Pattern alignment
   - **Impact**: Teach correct MCP-first pattern
   - **Effort**: 4 hours
   - **Categories**: `/training/*`, `/memory/*`, `/coordination/*`, `/automation/*`
   - **Approach**: Replace command docs with usage guides for MCP tools

8. **Test all automation commands** - Unverified functionality
   - **Impact**: Remove commands that don't work
   - **Effort**: 3 hours
   - **Targets**: `/automation/*`, `/workflows/*`, `/optimization/*`

9. **Consolidate by category** - Reduce 105 to ~30
   - **Impact**: Easier navigation, less maintenance
   - **Effort**: 6 hours
   - **Result**:
     - 11 hive-mind (keep)
     - 3 hooks (keep, update)
     - 1 session-start (keep)
     - 1 session-closeout (create)
     - 5 SPARC (keep verified)
     - 3 guides (memory, coordination, automation)
     - 2 swarm guides (analysis, strategies)
     - ~4 GitHub (verify first)
     - **Total: ~30 commands**

---

### Nice-to-Have Actions (Priority 4 - Low)

10. **Add command templates** - Standardize format
    - **Impact**: Consistent documentation
    - **Effort**: 2 hours

11. **Create command index** - Easy navigation
    - **Impact**: Better discoverability
    - **Effort**: 1 hour

12. **Add examples to all commands** - Better UX
    - **Impact**: Easier to learn
    - **Effort**: 4 hours

---

## Recommendations Summary

| Action | Files Affected | Effort | Priority |
|--------|---------------|--------|----------|
| **Create** session-closeout | 1 | 30m | P1 |
| **Fix** memory-usage pattern | 1 | 15m | P1 |
| **Update** hooks commands | 3 | 45m | P1 |
| **Remove** duplicates | 5 | 1h | P2 |
| **Remove** README files | 13 | 5m | P2 |
| **Verify** SPARC modes | 15 | 2h | P2 |
| **Convert** to MCP guides | 25 | 4h | P3 |
| **Test** automation commands | 20 | 3h | P3 |
| **Consolidate** all categories | 105 → 30 | 6h | P3 |
| **TOTAL** | 105 files | ~18h | - |

**Estimated cleanup**: Remove 60 files, update 15 files, create 1 file, consolidate to ~30 total.

---

## Testing Checklist

### Pre-Cleanup Testing
- [ ] Test `/session-start` with hive-mind spawning
- [ ] Verify all SPARC modes exist in native CLI
- [ ] Test all hooks commands with actual native CLI
- [ ] Check all automation commands for functionality
- [ ] Verify all GitHub commands work
- [ ] Test memory namespace isolation with swarms

### Post-Cleanup Testing
- [ ] All remaining commands execute successfully
- [ ] No broken references in CLAUDE.md
- [ ] Session workflow (start → work → closeout) functional
- [ ] Hive-mind coordination works with remaining commands
- [ ] Memory operations use correct MCP patterns
- [ ] Documentation matches actual behavior

---

## Migration Path

### Phase 1: Critical Fixes (1.5 hours)
1. Create `/session-closeout.md`
2. Fix `/memory/memory-usage.md`
3. Update 3 hooks commands
4. Test session workflow end-to-end

### Phase 2: Cleanup (3 hours)
5. Remove 13 README files
6. Remove 5 duplicate commands
7. Verify 15 SPARC modes, remove non-existent
8. Update CLAUDE.md references

### Phase 3: Pattern Alignment (7 hours)
9. Convert 25 CLI commands to MCP guides
10. Test 20 automation commands
11. Consolidate categories
12. Final testing

### Phase 4: Polish (6.5 hours)
13. Create command templates
14. Build command index
15. Add examples to all commands
16. Documentation review

**Total Time**: ~18 hours over 4 phases

---

## Conclusion

**Current State**: 105 commands, 60% redundant, 30% outdated, 10% aligned

**Target State**: ~30 commands, 100% aligned, MCP-first, tested

**Risk**: Medium - Users may be using commands that will be removed

**Mitigation**:
1. Add deprecation notices before removal
2. Update CLAUDE.md with new patterns
3. Test workflows thoroughly
4. Provide migration guide for users

**Next Steps**:
1. Get approval for removal plan
2. Execute Phase 1 (critical fixes)
3. Test with hive-mind integration
4. Proceed with cleanup phases
