# Zero-Risk Execution Pattern for Hive-Mind

**Document Type**: Task-Oriented Guide
**Audience**: Users executing hive-mind operations with safety controls
**Source**: Integrated from `inbox/assistant/2025-11-16-hive-mind-investigation/4-execution-planning/zero-risk-strategy.md`

---

## Overview

This guide defines a multi-phase execution strategy for using hive-mind with explicit checkpoints, rollback procedures, and HITL (Human-in-the-Loop) approval gates.

**Key Principle**: Every phase has explicit checkpoints, rollback procedures, and HITL approval gates. No autonomous changes to workspace.

---

## Pre-Flight Checks

### 1. Workspace State Verification

Run these checks before any hive initialization:

```bash
# 1. Git status check - ensure clean state
git status --short

# Expected: Only untracked files (inbox/, sessions/, docs/guides/)
# Any modifications to tracked files require explanation

# 2. Verify no uncommitted changes to critical files
git diff CLAUDE.md WORKSPACE-ARCHITECTURE.md WORKSPACE-GUIDE.md package.json

# Expected: No output (no changes)

# 3. Check for active sessions
ls -la sessions/ | grep -v ".archive"

# Expected: Current session only
```

### 2. Create Pre-Flight Git Checkpoint

Before ANY hive activity:

```bash
# Tag current state as pre-hive checkpoint
git tag pre-hive-$(date +%Y%m%d-%H%M%S) -m "Checkpoint before hive execution"

# Create checkpoint branch (for easy rollback)
git checkout -b checkpoint/pre-hive-execution

# Commit any staged work
git add -A
git commit -m "Pre-hive checkpoint: Save current state before analysis"

# Return to main
git checkout main
```

**Validation**: Checkpoint branch exists and contains current state.

### 3. Backup Current Session State

```bash
# Create session state backup
mkdir -p sessions/$SESSION_ID/backups/
cp -r sessions/$SESSION_ID/artifacts \
      sessions/$SESSION_ID/backups/pre-hive-$(date +%Y%m%d-%H%M%S)

# Verify backup
ls -la sessions/$SESSION_ID/backups/
```

### 4. Pre-Flight Checklist

- [ ] Git status clean (no unexpected modifications)
- [ ] Checkpoint branch created (`checkpoint/pre-hive-execution`)
- [ ] Git tag created (`pre-hive-YYYYMMDD-HHMMSS`)
- [ ] Session artifacts backed up to `backups/pre-hive-*/`
- [ ] No active uncommitted work in workspace
- [ ] User has reviewed and approved proceeding

**STOP**: Do not proceed until ALL boxes are checked and user approves.

---

## Phase 0: Initialization & Safety Verification (Read-Only)

**Duration**: 5-10 minutes
**Risk**: ZERO (no writes)
**Purpose**: Initialize hive and verify all safeguards are working

### Actions

1. **Initialize Hive**

```bash
# Option 1: Use hive-mind wizard (recommended)
npx claude-flow@alpha hive-mind:wizard

# Option 2: Manual initialization
npx claude-flow@alpha swarm init --topology mesh --max-agents 8

# Verify initialization
npx claude-flow@alpha swarm status
```

**Expected Output**: Swarm initialized, no agents spawned yet.

2. **Verify Hive Hooks Integration**

```bash
# Test that hooks are working
npx claude-flow@alpha hooks pre-task --description "Phase 0 verification" --task-id "phase-0-init"

# Check memory access
# Use MCP tool: mcp__claude-flow_alpha__memory_usage({ action: "list", namespace: "coordination" })

# Verify session tracking
npx claude-flow@alpha hooks session-restore --session-id "hive-execution-$(date +%Y%m%d)"
```

**Expected Output**: Hooks fire successfully, memory accessible, session tracking active.

3. **Read-Only System Scan**

```bash
# Verify session directories exist
ls -la sessions/$SESSION_ID/artifacts/

# Check git status (should be unchanged)
git status --short
```

**Expected Output**: All paths exist, git status unchanged from pre-flight.

### Circuit Breakers

**Automatic stop if ANY of these occur:**

- Git status shows unexpected modifications
- Hive initialization fails or times out
- Hooks fail to fire correctly
- Memory namespace is inaccessible

### Validation Checklist

- [ ] Hive initialized successfully
- [ ] Swarm status shows healthy coordination
- [ ] Hooks are firing correctly
- [ ] Memory access verified
- [ ] Git status unchanged (NO modifications)
- [ ] All circuit breakers passed

**HITL GATE 0**: User reviews Phase 0 validation. Do not proceed until approved.

---

## Phase 1: Analysis Phase (Read-Only, Reports to Session Artifacts)

**Duration**: 30-60 minutes
**Risk**: MINIMAL (writes only to session artifacts/docs/)
**Purpose**: Spawn adaptive queen + workers to analyze problems WITHOUT making changes

### Execution Strategy

#### 1. Spawn Adaptive Queen Coordinator

```bash
# Spawn queen with meta-cognitive capabilities
npx claude-flow@alpha agent spawn \
  --type coordinator \
  --name "Queen Seraphina" \
  --capabilities "adaptive-pivot,meta-cognition,complexity-detection,consensus-building"

# Verify queen spawned
npx claude-flow@alpha agent list
```

**Queen's Directive**:
- Analyze problem spaces
- Detect complexity levels
- Assign specialist workers
- NO implementation, only analysis
- Report findings to session artifacts

#### 2. Spawn Specialist Workers (Parallel)

**Using Claude Code's Task tool for concurrent execution:**

```javascript
[Single Message - Parallel Agent Spawning]:

Task("Documentation Analyst",
  "Analyze problem scope. Output analysis to sessions/$SESSION_ID/artifacts/docs/analysis.md",
  "researcher")

Task("Protocol Designer",
  "Design framework. Output design to sessions/$SESSION_ID/artifacts/docs/design.md",
  "system-architect")

Task("Risk Assessor",
  "Analyze risk levels. Output risk matrix to sessions/$SESSION_ID/artifacts/docs/risk-assessment.md",
  "analyst")
```

#### 3. Analysis Output Requirements

**Each worker MUST produce:**

1. **Problem Summary**: What is being analyzed
2. **Complexity Score**: 1-10 (1=trivial, 10=extremely complex)
3. **Risk Level**: Low/Medium/High
4. **Scope of Changes**: What files would be affected
5. **Dependencies**: What other systems are involved
6. **Solution Options**: At least 3 options with pros/cons
7. **Recommended Approach**: Which option and why
8. **Verification Strategy**: How to validate the solution works
9. **Rollback Plan**: How to undo if things go wrong

**Output Location**: All analysis reports go to:
```
sessions/$SESSION_ID/artifacts/docs/
├── analysis-problem-1.md
├── analysis-problem-2.md
├── risk-assessment-matrix.md
└── consolidated-findings.md (queen's summary)
```

### Circuit Breakers

**Automatic stop if ANY of these occur:**

- Any worker attempts to write outside `sessions/$SESSION_ID/artifacts/`
- Git status shows modifications to tracked files
- Any worker reports confidence < 70% on analysis
- Complexity score > 8 on any problem (requires additional consultation)
- Analysis reveals additional unknown problems

### Validation

```bash
# 1. Verify all analysis reports created
ls -la sessions/$SESSION_ID/artifacts/docs/analysis-*.md

# 2. Check git status (should only show untracked session files)
git status --short

# Expected: ?? sessions/$SESSION_ID/artifacts/docs/...

# 3. Verify no modifications to workspace files
git diff

# Expected: No output

# 4. Review queen's consolidated findings
cat sessions/$SESSION_ID/artifacts/docs/consolidated-findings.md
```

**Checklist**:
- [ ] All analysis reports created
- [ ] Queen's consolidated findings report created
- [ ] Git status shows ONLY new session artifact files
- [ ] No modifications to workspace files
- [ ] All complexity scores documented
- [ ] All risk levels assessed
- [ ] Solution options provided
- [ ] Rollback plans documented

**HITL GATE 1**: User reviews ALL analysis reports before proceeding.

**User must explicitly approve:**
- Complexity assessments are accurate
- Risk levels are acceptable
- Solution options are comprehensive
- Proceed to Phase 2 (Design)

---

## Phase 2: Solution Design Phase (Proposals Only, No Implementation)

**Duration**: 1-2 hours
**Risk**: LOW (writes only to session artifacts/docs/)
**Purpose**: Design detailed solutions based on approved analysis

### Prerequisites

- ✅ Phase 1 complete
- ✅ HITL Gate 1 passed (user approved analysis)
- ✅ User selected which problems to address

### Execution Strategy

#### Spawn Design Specialists (Only for Approved Problems)

```javascript
[Single Message - Design Phase Agents]:

Task("Solution Designer",
  "Design detailed solution based on user's chosen option.
   Input: sessions/$SESSION_ID/artifacts/docs/analysis.md
   Output: Implementation plan to sessions/$SESSION_ID/artifacts/docs/design.md
   Include: File-by-file changes, before/after examples, test plan, rollback procedure.
   NO implementation - design only.",
  "system-architect")

Task("Queen Seraphina - Design Review",
  "Review design plan for consistency, completeness, and risk.
   Output: Design review report to sessions/$SESSION_ID/artifacts/docs/design-review.md
   Include: Validation checklist, risk assessment, dependencies.",
  "coordinator")
```

#### Design Output Requirements

**Each designer MUST produce:**

1. **Implementation Specification**
   - Exact files to be modified (with line numbers if possible)
   - Exact files to be created (with full paths)
   - Before/after code examples
   - Configuration changes needed

2. **Testing Strategy**
   - How to verify the solution works
   - Test cases to run
   - Expected outcomes
   - Failure detection methods

3. **Rollback Procedure**
   - Step-by-step undo instructions
   - Git commands to revert
   - How to detect if rollback is needed
   - Validation that rollback succeeded

4. **Risk Mitigation**
   - What could go wrong
   - How to detect problems early
   - Circuit breakers for automatic stop
   - HITL checkpoints during implementation

**Output Location**:
```
sessions/$SESSION_ID/artifacts/docs/
├── design-problem-1.md (if approved)
├── design-review.md (queen's validation)
└── implementation-sequence.md (order of execution)
```

### Circuit Breakers

**Automatic stop if ANY of these occur:**

- Design reveals higher complexity than analysis indicated
- Design requires changes to files outside original scope
- Design introduces dependencies not mentioned in analysis
- Queen's review identifies conflicts between solutions
- Git status shows any modifications (should only be new files)

### Validation

```bash
# 1. Verify all design documents created
ls -la sessions/$SESSION_ID/artifacts/docs/design-*.md

# 2. Check git status
git status --short

# Expected: Only new session files, NO modifications

# 3. Review queen's design validation
cat sessions/$SESSION_ID/artifacts/docs/design-review.md

# 4. Check implementation sequence
cat sessions/$SESSION_ID/artifacts/docs/implementation-sequence.md
```

**Checklist**:
- [ ] Design documents created for each approved problem
- [ ] Queen's design review completed
- [ ] Implementation sequence defined
- [ ] No conflicts between solutions identified
- [ ] Rollback procedures documented
- [ ] Testing strategies defined
- [ ] Git status clean (only new session files)
- [ ] No scope creep beyond original analysis

**HITL GATE 2**: User reviews ALL design documents before proceeding.

**User must explicitly approve:**
- Implementation specifications are clear and complete
- Testing strategies are comprehensive
- Rollback procedures are well-defined
- Risk mitigation is adequate
- Implementation sequence makes sense
- Ready to proceed to Phase 3 (Implementation)

**User can also decide:**
- Approve all solutions
- Approve only some solutions (defer others)
- Request design revisions
- Stop here and implement manually
- Defer entire implementation to future session

---

## Rollback Procedures

### Level 1: Rollback Last Change (Incremental)

**Use when**: Single file change needs to be undone

```bash
# 1. Identify last commit
git log -1 --oneline

# 2. Verify it's the change to undo
git show HEAD

# 3. Revert the commit
git revert HEAD --no-edit

# 4. Verify rollback
git log -2 --oneline
git status
```

### Level 2: Rollback Entire Solution (Per-Problem)

**Use when**: All changes for a specific problem need to be undone

```bash
# 1. Identify commits for the problem
git log --oneline --grep "Problem X"

# 2. Create rollback branch
git checkout -b rollback/problem-x-$(date +%Y%m%d)

# 3. Revert all commits for that problem (in reverse order)
git revert <commit-hash-3> <commit-hash-2> <commit-hash-1> --no-edit

# 4. Verify workspace state
git status
git diff main

# 5. Merge rollback
git checkout main
git merge rollback/problem-x-$(date +%Y%m%d)
```

### Level 3: Rollback Entire Implementation (Full Reset)

**Use when**: Everything needs to be undone, return to pre-implementation state

```bash
# 1. Return to main branch
git checkout main

# 2. Delete implementation branch
git branch -D implementation/hive-execution-$(date +%Y%m%d)

# 3. Verify state matches pre-implementation checkpoint
git diff pre-implementation-$(date +%Y%m%d-%H%M%S)

# Expected: No differences

# 4. Restore session from backup
rm -rf sessions/$SESSION_ID/artifacts/
cp -r sessions/$SESSION_ID/backups/pre-hive-*/ \
      sessions/$SESSION_ID/artifacts/

# 5. Verify workspace clean
git status
```

### Rollback Validation

**After ANY rollback:**

```bash
# 1. Verify git status clean
git status

# 2. Verify tests pass
npm test  # If applicable

# 3. Check session artifacts intact
ls -laR sessions/$SESSION_ID/

# 4. Verify backups still exist
ls -la sessions/$SESSION_ID/backups/
```

---

## Checkpoint Strategy

### Git Checkpoints

**When to create:**

1. **Pre-flight** (before Phase 0)
   - Tag: `pre-hive-YYYYMMDD-HHMMSS`
   - Branch: `checkpoint/pre-hive-execution`

2. **Pre-implementation** (before Phase 3, if applicable)
   - Tag: `pre-implementation-YYYYMMDD-HHMMSS`
   - Branch: `implementation/hive-execution-YYYYMMDD`

3. **Post-implementation** (after all solutions)
   - Tag: `post-implementation-YYYYMMDD-HHMMSS`
   - Ready for merge to main

**How to create:**

```bash
# Create checkpoint
git tag <checkpoint-name> -m "<description>"
git checkout -b <checkpoint-branch>
git commit -am "<checkpoint description>"

# List checkpoints
git tag | grep -E "pre-hive|pre-implementation|post-implementation"

# Restore checkpoint
git checkout <checkpoint-tag>
# or
git checkout <checkpoint-branch>
```

---

## Emergency Procedures

### If Hive Becomes Unresponsive

```bash
# 1. Check hive status
npx claude-flow@alpha swarm status

# 2. If frozen, try graceful shutdown
npx claude-flow@alpha swarm destroy --graceful

# 3. If still unresponsive, force kill
npx claude-flow@alpha swarm destroy --force

# 4. Restore from last checkpoint
git checkout <last-good-checkpoint>
```

### If Git State Corrupted

```bash
# 1. Check git status
git status
git log --oneline -5

# 2. If detached HEAD, reattach
git checkout main

# 3. If merge conflict, abort
git merge --abort

# 4. If truly corrupted, restore from checkpoint
git checkout checkpoint/pre-hive-execution
git checkout -b main-recovery
# Manually verify state before force-updating main
```

---

## Success Criteria

### Phase 0 Success
- [ ] Hive initialized without errors
- [ ] All safety systems operational
- [ ] Git state verified clean
- [ ] Session tracking active

### Phase 1 Success
- [ ] All analysis reports created
- [ ] Complexity scores documented
- [ ] Risk levels assessed
- [ ] Solution options provided
- [ ] No workspace modifications
- [ ] User approved findings

### Phase 2 Success
- [ ] Design documents created for approved problems
- [ ] Implementation specifications clear
- [ ] Testing strategies defined
- [ ] Rollback procedures documented
- [ ] No scope creep
- [ ] User approved designs

### Overall Success
- [ ] Zero unexpected workspace modifications
- [ ] All HITL gates passed
- [ ] All checkpoints created
- [ ] Rollback procedures tested
- [ ] Session artifacts organized
- [ ] Workspace remains in healthy state

---

## Quick Reference Commands

### Pre-Flight
```bash
git status && git tag pre-hive-$(date +%Y%m%d-%H%M%S) && git checkout -b checkpoint/pre-hive-execution
```

### Phase 0
```bash
npx claude-flow@alpha swarm init --topology mesh && npx claude-flow@alpha swarm status
```

### Emergency Stop
```bash
npx claude-flow@alpha swarm destroy --force && git checkout checkpoint/pre-hive-execution
```

### Rollback
```bash
git revert HEAD --no-edit  # Last change
# OR
git checkout checkpoint/pre-hive-execution  # Full rollback
```

---

## Summary

**Remember**: When in doubt, STOP and ask. User pressure is NEVER justification for bypassing safety checks.

This zero-risk execution pattern ensures:
- ✅ No unexpected changes to workspace
- ✅ Clear approval gates at every phase
- ✅ Easy rollback at any point
- ✅ Full audit trail of decisions
- ✅ Session artifacts properly organized
