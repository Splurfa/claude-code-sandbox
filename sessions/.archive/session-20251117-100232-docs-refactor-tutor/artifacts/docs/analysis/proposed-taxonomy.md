# Proposed Documentation Taxonomy

**Analyst Agent**: Hive Mind (swarm-1763448573926-gujkd4xti)
**Session**: session-20251117-100232-docs-refactor-tutor
**Date**: 2025-11-18

---

## Executive Summary

Current taxonomy is **strong** (9/10) using Diátaxis framework. Proposed improvements focus on **structural consistency** (fix path inconsistencies), **content completeness** (fill 23 gaps), and **enhanced navigation** (add cross-references). No major reorganization needed.

**Key Changes**:
- ✅ Keep Diátaxis structure
- ✅ Fix path inconsistencies
- ✅ Remove empty directories
- ✅ Add missing documentation
- ✅ Strengthen navigation

---

## 1. Current Taxonomy (Baseline)

### Structure Overview

```
docs/
├── README.md                          [Main Navigation]
├── explanation/                       [Understanding]
│   ├── README.md
│   ├── workspace-architecture.md
│   ├── session-management.md
│   ├── file-routing.md
│   └── hive-mind-system.md
├── how-to/                            [Task-Oriented]
│   ├── integration-testing-guide.md
│   ├── zero-risk-execution-pattern.md
│   ├── choose-coordination-approach.md
│   └── operate-the-system.md
├── tutorials/                         [Learning]
│   ├── README.md
│   ├── 00-start-here.md
│   ├── progress-tracker.md
│   ├── 01-foundations/
│   ├── 02-essential-skills/
│   ├── 03-intermediate/
│   └── 04-advanced/
├── reference/                         [Quick Lookups]
│   ├── hive-mind-reality-guide.md
│   ├── implementation-architecture.md
│   ├── feature-reality-check.md
│   ├── feature-verification-checklist.md
│   ├── hive-mind-quick-reference.md
│   ├── template-usage-guide.md
│   └── claude-flow-directory-management.md
├── internals/                         [Technical Deep-Dive]
│   ├── README.md
│   ├── architecture-overview.md
│   ├── coordination-mechanics.md
│   ├── data-flow.md
│   ├── hooks-and-automation.md
│   ├── integration-points.md
│   ├── memory-architecture.md
│   ├── operational-architecture.md
│   ├── session-lifecycle.md
│   └── stock-vs-custom.md
├── troubleshooting/                   [Problem Solving]
│   └── troubleshooting-guide.md
├── advanced/                          [Advanced Patterns]
│   └── adaptive-pivot-protocol.md
├── getting-started/                   [EMPTY - Remove]
└── projects/                          [EMPTY - Remove]
```

**Strengths**:
- Clear Diátaxis separation ✅
- Logical categorization ✅
- Comprehensive README navigation ✅
- Good depth (53 files, 23,535 lines) ✅

**Issues**:
- Path inconsistencies (docs/guides/ mentioned but doesn't exist)
- Empty directories (2)
- Tutorial status unclear
- Missing cross-references

---

## 2. Proposed Taxonomy (Improved)

### Option A: Minimal Changes (RECOMMENDED)

**Rationale**: Current structure is sound, fix issues without major reorganization

```
docs/
├── README.md                          [✅ Update path references]
├── explanation/                       [✅ Add 3 docs]
│   ├── README.md
│   ├── workspace-architecture.md
│   ├── session-management.md
│   ├── file-routing.md
│   ├── hive-mind-system.md
│   ├── memory-architecture.md         [NEW]
│   ├── hooks-system.md                [NEW]
│   └── coordination-patterns.md       [NEW]
├── how-to/                            [✅ Add 6 critical docs]
│   ├── integration-testing-guide.md
│   ├── zero-risk-execution-pattern.md
│   ├── choose-coordination-approach.md
│   ├── operate-the-system.md
│   ├── session-closeout.md            [NEW - P0]
│   ├── memory-operations.md           [NEW - P0]
│   ├── manual-session-management.md   [NEW - P1]
│   ├── create-custom-agents.md        [NEW - P1]
│   ├── debug-coordination.md          [NEW - P1]
│   └── optimize-performance.md        [NEW - P1]
├── tutorials/                         [✅ Audit + update README]
│   ├── README.md                      [FIX: Update status]
│   ├── 00-start-here.md
│   ├── progress-tracker.md
│   ├── 01-foundations/                [AUDIT: 5 files]
│   ├── 02-essential-skills/           [AUDIT: 5 files]
│   ├── 03-intermediate/               [AUDIT: 5 files]
│   └── 04-advanced/                   [AUDIT: 4 files]
├── reference/                         [✅ Add 4 quick refs]
│   ├── hive-mind-reality-guide.md
│   ├── implementation-architecture.md
│   ├── feature-reality-check.md
│   ├── feature-verification-checklist.md
│   ├── hive-mind-quick-reference.md
│   ├── template-usage-guide.md
│   ├── claude-flow-directory-management.md
│   ├── mcp-tools-quick-reference.md   [NEW - P1]
│   ├── agent-types-catalog.md         [NEW - P1]
│   ├── memory-schema.md               [NEW - P1]
│   └── hooks-api.md                   [NEW - P1]
├── internals/                         [✅ Complete - no changes]
│   └── [10 files - excellent]
├── troubleshooting/                   [✅ Keep as-is]
│   └── troubleshooting-guide.md
└── advanced/                          [✅ Keep for future]
    └── adaptive-pivot-protocol.md
```

**Changes**:
- Remove: `getting-started/`, `projects/`, `guides-legacy-readme.md`
- Add: 16 new documentation files
- Update: Path references, tutorial README, cross-references
- No structural reorganization

---

### Option B: Restructure with Guides Directory (NOT RECOMMENDED)

**Rationale**: Matches some README references but requires moving files

```
docs/
├── README.md
├── guides/
│   ├── explanation/          [MOVE from docs/explanation/]
│   ├── how-to/               [MOVE from docs/how-to/]
│   ├── reference/            [MOVE from docs/reference/]
│   ├── troubleshooting/      [MOVE from docs/troubleshooting/]
│   └── advanced/             [MOVE from docs/advanced/]
├── tutorials/                [KEEP]
└── internals/                [KEEP]
```

**Problems**:
- Requires moving 31 files
- Updates needed in 50+ cross-references
- Breaks existing links
- Adds complexity without benefit
- Inconsistent with Diátaxis (explanation/how-to/reference are peers)

**Decision**: ❌ Rejected - Too much churn for minimal benefit

---

## 3. Detailed Taxonomy by Category

### A. Explanation (Understanding-Oriented)

**Purpose**: Help users understand concepts and design decisions

**Current** (5 files):
```
explanation/
├── README.md
├── workspace-architecture.md    [Excellent - 600 lines]
├── session-management.md        [Excellent - 550 lines]
├── file-routing.md              [Excellent - 500 lines]
└── hive-mind-system.md          [Good - 400 lines]
```

**Proposed** (8 files):
```
explanation/
├── README.md                    [Update navigation]
├── workspace-architecture.md
├── session-management.md
├── file-routing.md
├── hive-mind-system.md
├── memory-architecture.md       [NEW - Why memory exists, design]
├── hooks-system.md              [NEW - Why hooks, lifecycle]
└── coordination-patterns.md     [NEW - Why coordination matters]
```

**Quality Target**: Each doc 400-600 lines, clear "why/how" focus

---

### B. How-To (Task-Oriented)

**Purpose**: Provide recipes for specific tasks

**Current** (4 files):
```
how-to/
├── integration-testing-guide.md      [800 lines - Excellent]
├── zero-risk-execution-pattern.md    [641 lines - Good]
├── choose-coordination-approach.md   [490 lines - Good]
└── operate-the-system.md             [400 lines - Good]
```

**Proposed** (10 files):
```
how-to/
├── integration-testing-guide.md
├── zero-risk-execution-pattern.md
├── choose-coordination-approach.md
├── operate-the-system.md
├── session-closeout.md               [NEW P0 - End sessions]
├── memory-operations.md              [NEW P0 - Use memory]
├── manual-session-management.md      [NEW P1 - Manual control]
├── create-custom-agents.md           [NEW P1 - Build agents]
├── debug-coordination.md             [NEW P1 - Troubleshoot]
└── optimize-performance.md           [NEW P1 - Speed up]
```

**Quality Target**: Each doc 300-500 lines, step-by-step recipes

---

### C. Tutorials (Learning-Oriented)

**Purpose**: Teach skills through practice

**Current** (15 files in 4 levels):
```
tutorials/
├── README.md                    [NEEDS UPDATE]
├── 00-start-here.md
├── progress-tracker.md
├── 01-foundations/              [5 files - AUDIT NEEDED]
│   ├── what-is-claude-flow.md
│   ├── workspace-tour.md
│   ├── first-session.md
│   ├── basic-memory-usage.md
│   └── README.md
├── 02-essential-skills/         [5 files - AUDIT NEEDED]
│   ├── spawning-agents.md
│   ├── parallel-execution.md
│   ├── memory-coordination.md   [500 lines]
│   ├── session-management.md    [550 lines]
│   └── README.md
├── 03-intermediate/             [5 files - AUDIT NEEDED]
│   ├── swarm-topologies.md
│   ├── consensus-mechanisms.md
│   ├── custom-workflows.md      [566 lines]
│   ├── queen-selection.md
│   └── README.md
└── 04-advanced/                 [4 files - AUDIT NEEDED]
    ├── hive-mind-coordination.md
    ├── adaptive-topology.md
    ├── byzantine-consensus.md
    ├── reasoning-bank.md        [482 lines]
    └── README.md
```

**Proposed Action**:
1. **Audit all 15 files** - Verify completeness
2. **Update README.md** - Reflect actual status
3. **Add "Related Documentation"** - Link to how-tos, explanations
4. **Verify file routing examples** - Ensure session artifacts usage

**Quality Target**: Progressive difficulty, working examples, verification steps

---

### D. Reference (Information-Oriented)

**Purpose**: Quick lookups and fact-checking

**Current** (7 files):
```
reference/
├── hive-mind-reality-guide.md        [1,297 lines - TOO LONG]
├── implementation-architecture.md    [719 lines - Good]
├── feature-reality-check.md          [679 lines - Good]
├── feature-verification-checklist.md [200 lines - Excellent]
├── hive-mind-quick-reference.md      [400 lines - Good]
├── template-usage-guide.md           [300 lines - Good]
└── claude-flow-directory-management.md [250 lines - Good]
```

**Proposed** (11 files):
```
reference/
├── hive-mind-reality-guide.md        [CONSIDER SPLITTING]
├── implementation-architecture.md
├── feature-reality-check.md
├── feature-verification-checklist.md
├── hive-mind-quick-reference.md
├── template-usage-guide.md
├── claude-flow-directory-management.md
├── mcp-tools-quick-reference.md      [NEW P1 - Tool catalog]
├── agent-types-catalog.md            [NEW P1 - Agent types]
├── memory-schema.md                  [NEW P1 - DB structure]
└── hooks-api.md                      [NEW P1 - Hook commands]
```

**Quality Target**: Scannable, factual, 200-500 lines each

---

### E. Internals (Technical Deep-Dive)

**Purpose**: System mechanics for developers/debuggers

**Current** (10 files): ✅ **COMPLETE - NO CHANGES**

```
internals/
├── README.md                         [98 lines - Excellent]
├── architecture-overview.md          [400 lines - Good]
├── coordination-mechanics.md         [706 lines - Excellent]
├── data-flow.md                      [537 lines - Good]
├── hooks-and-automation.md           [785 lines - Excellent]
├── integration-points.md             [776 lines - Excellent]
├── memory-architecture.md            [725 lines - Excellent]
├── operational-architecture.md       [772 lines - Excellent]
├── session-lifecycle.md              [814 lines - Excellent]
└── stock-vs-custom.md                [617 lines - Excellent]
```

**Assessment**: Comprehensive, well-written, no gaps identified

---

### F. Troubleshooting (Problem-Solving)

**Current** (1 file):
```
troubleshooting/
└── troubleshooting-guide.md          [701 lines - Good]
```

**Proposed**: Keep as-is, may add specialized troubleshooting guides later

---

### G. Advanced (Advanced Patterns)

**Current** (1 file):
```
advanced/
└── adaptive-pivot-protocol.md        [532 lines - Good]
```

**Proposed**: Keep directory for future advanced patterns

---

## 4. Navigation Improvements

### Main README.md Updates

**Current Issues**:
- Path inconsistencies (`docs/guides/` references)
- Missing quick navigation to new docs
- Could strengthen role-based entry points

**Proposed Updates**:

#### Fix Path References
```markdown
# BEFORE (Incorrect)
- [How-to Guides](guides/how-to/)
- [Reference](guides/reference/)

# AFTER (Correct)
- [How-to Guides](how-to/)
- [Reference](reference/)
```

#### Add New Documentation Links
```markdown
### 🔧 I Have a Specific Task

Common tasks:
- [Session Closeout](how-to/session-closeout.md) [NEW]
- [Memory Operations](how-to/memory-operations.md) [NEW]
- [Integration Testing](how-to/integration-testing-guide.md)
...

### 📖 I Need Quick Facts

Quick lookups:
- [MCP Tools Reference](reference/mcp-tools-quick-reference.md) [NEW]
- [Agent Types Catalog](reference/agent-types-catalog.md) [NEW]
- [Hooks API](reference/hooks-api.md) [NEW]
...
```

---

### Category README.md Updates

**Add to Each Category**:

1. **What's New** section listing recent additions
2. **Navigation matrix** showing coverage
3. **Quick links** to most-used docs
4. **Related categories** with clear connections

**Example** (explanation/README.md):
```markdown
## What's New

- [Memory Architecture Explained](memory-architecture.md) - Understanding memory design
- [Hooks System Explained](hooks-system.md) - How hooks work
- [Coordination Patterns Explained](coordination-patterns.md) - Agent collaboration

## Quick Navigation

| Topic | This Doc | How-To | Reference |
|-------|----------|--------|-----------|
| Memory | [Architecture](memory-architecture.md) | [Operations](../how-to/memory-operations.md) | [Schema](../reference/memory-schema.md) |
...
```

---

## 5. Cross-Reference Template

**Add to Every Documentation File**:

```markdown
---

## Related Documentation

**Prerequisites**: (What to read first)
- [Foundation Topic](../tutorials/01-foundations/topic.md)

**Related Tasks**: (How to do it)
- [How to: Specific Task](../how-to/specific-task.md)

**Understanding**: (Why it works this way)
- [Concept Explained](../explanation/concept.md)

**Quick Lookup**: (Fast reference)
- [Quick Reference](../reference/quick-reference.md)

**Deep Dive**: (Technical details)
- [System Internals](../internals/system-internals.md)

---
```

**Apply To**: All 53 existing files + 16 new files = 69 files

---

## 6. File Naming Conventions

### Current Conventions (Good)

**Explanations**: `topic-explained.md` or `topic-name.md`
**How-Tos**: `action-task.md` or descriptive name
**Tutorials**: `topic-name.md` with progressive numbering
**Reference**: `topic-quick-reference.md` or `topic-guide.md`

### Proposed Conventions (Standardized)

**Explanations**: `{topic}-explained.md` (but can use short names)
- ✅ `session-management.md` (OK)
- ✅ `memory-architecture.md` (OK)

**How-Tos**: `{action}-{object}.md` or `{verb}-{noun}.md`
- ✅ `session-closeout.md`
- ✅ `create-custom-agents.md`
- ✅ `optimize-performance.md`

**Reference**: `{topic}-{reference|catalog|api}.md`
- ✅ `mcp-tools-quick-reference.md`
- ✅ `agent-types-catalog.md`
- ✅ `hooks-api.md`

---

## 7. CLAUDE.md Taxonomy Changes

### Current Structure (570 lines)

**Sections**:
1. Quick reference (lines 1-10)
2. Session protocol (lines 11-38) - DUPLICATE
3. File management (lines 42-88) - DUPLICATE
4. Subagent protocol (lines 90-113) - GOOD
5. Project overview (lines 115-152) - GOOD
6. Agent catalog (lines 176-203) - MOVE TO DOCS
7. MCP tools (lines 239-271) - MOVE TO DOCS
8. Examples (lines 273-373) - GOOD
9. Features (lines 382-462) - GOOD
10. Custom features (lines 485-546) - GOOD
11. Integration docs (lines 560-568) - GOOD

### Proposed Structure (~300 lines)

**Keep**:
- Quick reference (commands, essential rules)
- Navigation hub (links to docs)
- Examples (code snippets)
- Integration section

**Move to docs/**:
- Session protocol details → `explanation/session-management.md`
- File routing details → `explanation/file-routing.md`
- Agent catalog → `reference/agent-types-catalog.md`
- MCP tools list → `reference/mcp-tools-quick-reference.md`

**Result**: CLAUDE.md becomes true quick-start, docs/ has complete details

---

## 8. Implementation Phases

### Phase 1: Structural Fixes (Day 1 - 2 hours)

1. **Fix path inconsistencies**
   - Update `docs/README.md` (~10 references)
   - Update `CLAUDE.md` (~3 references)
   - Verify all links work

2. **Remove empty directories**
   ```bash
   rmdir docs/getting-started
   rmdir docs/projects
   ```

3. **Archive legacy files**
   ```bash
   mkdir -p .archive/docs
   mv docs/guides-legacy-readme.md .archive/docs/
   ```

### Phase 2: Critical Content (Days 2-3 - 8 hours)

4. **Audit tutorials** (3-4 hours)
5. **Create session-closeout.md** (2 hours)
6. **Create memory-operations.md** (2 hours)

### Phase 3: High Priority Content (Days 4-7 - 24 hours)

7. **Create explanations** (3 docs × 2 hours = 6 hours)
8. **Create references** (4 docs × 2 hours = 8 hours)
9. **Create how-tos** (4 docs × 2 hours = 8 hours)
10. **Add cross-references** (3 hours)

### Phase 4: CLAUDE.md Refactor (Day 8 - 3 hours)

11. **Move content to docs/** (1.5 hours)
12. **Update CLAUDE.md** (1 hour)
13. **Verify navigation** (0.5 hours)

---

## 9. Quality Metrics

### Target Metrics

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Total files | 53 | 69 | +16 needed |
| Total lines | 23,535 | ~30,000 | +6,500 |
| Explanations | 5 | 8 | +3 |
| How-tos | 4 | 10 | +6 |
| References | 7 | 11 | +4 |
| Cross-refs | ~10 | 69 | +59 |
| Broken links | ~10 | 0 | Fix all |
| Empty dirs | 2 | 0 | Remove |

---

## 10. Success Criteria

### Documentation Completeness

- [ ] All 23 identified gaps filled
- [ ] Tutorial content verified (15 files audited)
- [ ] Every doc has "Related Documentation" section
- [ ] No broken links
- [ ] No empty directories
- [ ] No legacy files in main structure

### Navigation Quality

- [ ] 3-click maximum to any document
- [ ] Clear role-based entry points
- [ ] Topic-based navigation works
- [ ] Diátaxis categories clear

### Content Quality

- [ ] Each doc has single clear purpose
- [ ] Diátaxis principles followed
- [ ] Examples use proper file routing
- [ ] Cross-references accurate

---

## Memory Keys Stored

```javascript
hive/analyst/proposed_improvements = {
  approach: "minimal_changes",
  structural_changes: {
    remove: ["getting-started/", "projects/", "guides-legacy-readme.md"],
    add: 16,
    move: 0,
    update: ["README.md", "CLAUDE.md", "tutorial READMEs"]
  },
  content_additions: {
    explanations: 3,
    how_tos: 6,
    references: 4,
    cross_references: 59
  },
  implementation_phases: 4,
  estimated_total_effort: "40 hours",
  quality_score_target: 9.5
}
```

---

**Next Document**: integration-points.md
