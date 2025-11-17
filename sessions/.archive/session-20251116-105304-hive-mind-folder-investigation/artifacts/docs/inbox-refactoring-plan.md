# Inbox/Assistant Refactoring Plan

**Created**: 2025-11-16
**Purpose**: Eliminate ambiguity in inbox organization and status workflow
**Status**: AWAITING HITL APPROVAL

---

## Executive Summary

**Problem**: Current inbox/assistant structure has:
1. Ambiguous "INTEGRATED" status (if integrated, why still in inbox?)
2. Split content across multiple collections (hive-mind content in 3 places)
3. Unclear permanent destinations (where does "INTEGRATED" content go?)
4. Complex status levels that don't reflect actual workflow

**Solution**:
- Eliminate "INTEGRATED" status entirely
- Consolidate split content into single canonical collections
- Clear 2-status workflow: IN-PROGRESS → READY-FOR-HANDOFF
- Explicit integration mapping to docs/guides/ framework
- Move integrated content out of inbox to permanent homes

---

## 🎯 Design Principles

### 1. Inbox is Temporary, Docs are Permanent

**Rule**: If content is "INTEGRATED", it belongs in docs/, not inbox/

```
inbox/assistant/     ← Work IN PROGRESS
docs/guides/         ← INTEGRATED work's permanent home
.inbox/archive/      ← Completed inbox work after integration
```

### 2. One Collection = One Topic

**Rule**: No split content across multiple dated folders

**Before** (WRONG):
```
inbox/assistant/
├── 2025-11-16-hive-mind-investigation/  ← Part 1
├── 2025-11-16-research-findings/        ← Part 2 (also has hive-mind content)
└── 2025-11-16-system-hygiene-check/     ← Part 3 (more hive-mind refs)
```

**After** (CORRECT):
```
inbox/assistant/
└── 2025-11-16-hive-mind-investigation/  ← ALL hive-mind content here
```

### 3. Two-Status Workflow Only

**Rule**: Only two statuses in inbox

- 🟡 **IN-PROGRESS** - Active research/work happening now
- 🟢 **READY-FOR-HANDOFF** - Complete, awaiting integration

**Eliminated**:
- ❌ 🔵 INTEGRATED - If integrated, it's in docs/, not inbox/

### 4. Clear Permanent Destinations

**Rule**: Every collection must have explicit mapping to docs/guides/

See docs/guides/ framework:
```
docs/guides/
├── getting-started/    ← Tutorials for beginners
├── how-to/            ← Step-by-step task guides
├── concepts/          ← Explanations & architecture
├── reference/         ← Quick references & checklists
├── troubleshooting/   ← Problem solving & debugging
└── advanced/          ← Advanced topics & optimization
```

---

## 📊 Current State Analysis

### Collection Inventory

| Collection | Size | Status | Files | Issues |
|------------|------|--------|-------|--------|
| hive-mind-investigation | 196K | READY | 7 files | ✅ Well-organized |
| system-hygiene-check | 224K | READY | 12 files | ⚠️ Split references |
| research-findings | 124K | INTEGRATED | 11 files | ❌ Still in inbox! |

### Status Problems

**research-findings** (124K):
- Status: 🔵 INTEGRATED
- **Problem**: If integrated, why still in inbox?
- **Reality**: Content was applied but docs still here
- **Should be**: In `.inbox/archive/` after integration

### Content Split Problems

**Hive-Mind Content Split Across 3 Collections**:

1. **hive-mind-investigation/** (Primary)
   - System overview
   - When to use
   - Integration guide
   - Quick reference
   - Capability mapping

2. **research-findings/** (Secondary)
   - Adaptive pivot protocol references
   - Broken links issue (different topic!)
   - Claude-flow investigation

3. **system-hygiene-check/** (Tertiary)
   - Hive-mind capability mapping (DUPLICATE!)
   - Zero-risk strategy (uses hive-mind concepts)

**Result**: Reader must check 3 folders to understand hive-mind

---

## 🏗️ Proposed Structure

### After Refactoring

```
inbox/assistant/
├── README.md                           ← Updated usage guidelines
├── 2025-11-16-hive-mind-investigation/ ← CONSOLIDATED collection
│   ├── STATUS.md                       ← 🟢 READY-FOR-HANDOFF
│   ├── README.md                       ← Master index
│   ├── 1-foundation/
│   │   ├── system-overview.md         ← What hive-mind is
│   │   ├── purpose-research.md        ← Detailed forensics
│   │   └── usage-analysis.md          ← Database analysis
│   ├── 2-decision-framework/
│   │   ├── when-to-use.md             ← Decision tree
│   │   ├── recommendation.md          ← Integration guide
│   │   └── adaptive-pivot.md          ← MOVED from research-findings
│   ├── 3-reference/
│   │   ├── quick-reference.md         ← Fast lookup
│   │   └── capability-mapping.md      ← Queen types, workers, consensus
│   └── 4-execution-planning/          ← MOVED from system-hygiene-check
│       ├── zero-risk-strategy.md      ← Complex work safety framework
│       └── hive-coordination-examples.md
│
└── 2025-11-16-system-hygiene-check/    ← REDUCED to actionable proposals
    ├── STATUS.md                       ← 🟡 IN-PROGRESS (awaiting execution)
    ├── README.md
    ├── 1-content-placement/
    │   └── file-routing-skill-proposal.md
    └── 2-quality-improvements/
        └── captains-log-review.md
```

### Removed Collections

```
.inbox/archive/assistant/
└── 2025-11-16-research-findings/       ← ARCHIVED (integration complete)
    ├── STATUS.md                       ← Changed to ARCHIVED
    ├── claude-flow-investigation/      ← Session work complete
    ├── adaptive-pivot-protocol/        ← MOVED to hive-mind collection
    └── broken-links-issue/             ← Different topic, document separately
```

---

## 🔄 Simplified Status Workflow

### Two-Status System

```
[Create Collection]
       ↓
🟡 IN-PROGRESS
       ↓
  [Research/Work]
       ↓
🟢 READY-FOR-HANDOFF
       ↓
  [Integration to docs/]
       ↓
📦 ARCHIVED (in .inbox/archive/)
```

### Status Definitions

#### 🟡 IN-PROGRESS
**Meaning**: Active work happening now
**Location**: `inbox/assistant/<collection>/`
**Checklist**:
- [ ] Research ongoing
- [ ] Findings being documented
- [ ] Analysis incomplete
- [ ] Integration path not defined

**Example**: system-hygiene-check (proposals not executed yet)

#### 🟢 READY-FOR-HANDOFF
**Meaning**: Complete, awaiting integration to permanent docs
**Location**: `inbox/assistant/<collection>/`
**Checklist**:
- [x] Research complete
- [x] Findings documented
- [x] Analysis complete
- [x] Integration path defined
- [ ] Content moved to docs/
- [ ] Collection archived

**Example**: hive-mind-investigation (ready to integrate)

#### 📦 ARCHIVED
**Meaning**: Integration complete, historical reference only
**Location**: `.inbox/archive/assistant/<collection>/`
**Checklist**:
- [x] Content integrated to permanent docs
- [x] Collection moved to archive
- [x] Links updated (if applicable)
- [x] No longer referenced in active work

**Example**: research-findings (should be here, not in active inbox)

---

## 🗺️ Integration Mapping to docs/guides/

### Hive-Mind Investigation → Permanent Docs

| Source File | Destination | Category | Reason |
|-------------|-------------|----------|--------|
| `1-foundation/system-overview.md` | `docs/guides/concepts/hive-mind-system.md` | Concepts | Explains what hive-mind is |
| `2-decision-framework/when-to-use.md` | `docs/guides/how-to/choose-coordination-approach.md` | How-To | Task-oriented guide |
| `2-decision-framework/recommendation.md` | `.claude/integrations/hive-mind/integration-guide.md` | Internal | Implementation details |
| `2-decision-framework/adaptive-pivot.md` | `docs/guides/advanced/adaptive-pivot-protocol.md` | Advanced | Advanced topic |
| `3-reference/quick-reference.md` | `docs/guides/reference/hive-mind-quick-reference.md` | Reference | Quick lookup |
| `3-reference/capability-mapping.md` | Stays in inbox | N/A | Problem-specific analysis |
| `4-execution-planning/zero-risk-strategy.md` | `docs/guides/advanced/complex-work-execution.md` | Advanced | Safety framework |
| `1-foundation/purpose-research.md` | Archive only | N/A | Detailed forensics |
| `1-foundation/usage-analysis.md` | Archive only | N/A | Database analysis |

### System-Hygiene-Check → Permanent Docs

| Source File | Destination | Category | Reason |
|-------------|-------------|----------|--------|
| `1-content-placement/file-routing-skill-proposal.md` | `.claude/skills/file-routing/README.md` | Internal | Update existing skill |
| `2-quality-improvements/captains-log-review.md` | Hook scripts | Internal | Fix implementation |

**Note**: Proposals execute to existing files, then archive. No new docs needed.

### Research-Findings → Already Integrated

| Topic | Destination | Status |
|-------|-------------|--------|
| Claude-flow investigation | CLAUDE.md, WORKSPACE-GUIDE.md | ✅ Complete |
| Adaptive pivot | Move to hive-mind collection | 🔄 Consolidate |
| Broken links | Document separately | 🔴 New collection needed |

---

## 📋 Consolidation Steps

### Step 1: Consolidate Hive-Mind Content

**Objective**: Move all hive-mind content into single collection

**Actions**:
1. Create `inbox/assistant/2025-11-16-hive-mind-investigation/2-decision-framework/adaptive-pivot.md`
2. Move content from `research-findings/adaptive-pivot-protocol/`
3. Create `inbox/assistant/2025-11-16-hive-mind-investigation/4-execution-planning/`
4. Move `system-hygiene-check/3-execution-planning/` content
5. Update cross-references
6. Update master README

**Files Affected**:
- `inbox/assistant/2025-11-16-hive-mind-investigation/README.md` (update index)
- `inbox/assistant/2025-11-16-hive-mind-investigation/STATUS.md` (update manifest)
- Create new subdirectories

**Validation**:
```bash
# Check all hive-mind refs point to single collection
grep -r "hive-mind" inbox/assistant/*/README.md
```

### Step 2: Reduce System-Hygiene-Check

**Objective**: Remove reference materials, keep actionable proposals only

**Actions**:
1. Move `3-execution-planning/` → hive-mind collection (done in Step 1)
2. Keep `1-content-placement/` (actionable)
3. Keep `2-quality-improvements/` (actionable)
4. Update STATUS.md to IN-PROGRESS
5. Remove integrated content references

**Files Affected**:
- `inbox/assistant/2025-11-16-system-hygiene-check/README.md` (simplify)
- `inbox/assistant/2025-11-16-system-hygiene-check/STATUS.md` (update)
- Delete `inbox/assistant/2025-11-16-system-hygiene-check/3-execution-planning/`

**Validation**:
```bash
# Should only have 2 subdirectories
ls inbox/assistant/2025-11-16-system-hygiene-check/
```

### Step 3: Archive Research-Findings

**Objective**: Move integrated collection to archive

**Actions**:
1. Verify all integration targets completed
2. Extract broken-links content to new collection
3. Move adaptive-pivot to hive-mind (done in Step 1)
4. Update STATUS.md to ARCHIVED
5. Move entire collection to `.inbox/archive/assistant/`

**Files Affected**:
- Create `.inbox/archive/assistant/` directory
- Move `inbox/assistant/2025-11-16-research-findings/` → archive
- Create `inbox/assistant/2025-11-16-broken-links-investigation/` (new)

**Validation**:
```bash
# Should not exist in active inbox
test ! -d inbox/assistant/2025-11-16-research-findings && echo "Archived successfully"
```

### Step 4: Extract Broken-Links Topic

**Objective**: Create separate collection for unrelated issue

**Actions**:
1. Create `inbox/assistant/2025-11-16-broken-links-investigation/`
2. Copy content from `research-findings/broken-links-issue/`
3. Create STATUS.md (IN-PROGRESS)
4. Create README.md
5. Document problem and proposed solutions

**Files Created**:
- `inbox/assistant/2025-11-16-broken-links-investigation/STATUS.md`
- `inbox/assistant/2025-11-16-broken-links-investigation/README.md`
- `inbox/assistant/2025-11-16-broken-links-investigation/problem-definition.md`
- `inbox/assistant/2025-11-16-broken-links-investigation/immediate-fix.md`
- `inbox/assistant/2025-11-16-broken-links-investigation/systematic-solution.md`

**Validation**:
```bash
# New collection exists
test -d inbox/assistant/2025-11-16-broken-links-investigation && echo "Collection created"
```

### Step 5: Update Inbox README

**Objective**: Document new 2-status workflow

**Actions**:
1. Add status workflow section
2. Document integration mapping
3. Add consolidation guidelines
4. Update examples

**Files Affected**:
- `inbox/assistant/README.md`

**Validation**:
```bash
# README contains status workflow
grep -q "IN-PROGRESS" inbox/assistant/README.md && echo "Workflow documented"
```

---

## 🎯 Integration Execution Plan

### Phase 1: Foundation Concepts (Low Risk)

**Goal**: Integrate conceptual explanations to docs/guides/concepts/

**Actions**:
1. Create `docs/guides/concepts/hive-mind-system.md`
2. Copy from `hive-mind-investigation/1-foundation/system-overview.md`
3. Edit for user-facing clarity
4. Add to docs/guides/README.md index

**Time**: 15 minutes
**Risk**: 🟢 Low
**Validation**: Read new doc, verify clarity

### Phase 2: Decision Framework (Low Risk)

**Goal**: Integrate how-to guides

**Actions**:
1. Create `docs/guides/how-to/choose-coordination-approach.md`
2. Copy from `hive-mind-investigation/2-decision-framework/when-to-use.md`
3. Edit for task-oriented clarity
4. Add decision tree diagram
5. Update docs/guides/README.md index

**Time**: 20 minutes
**Risk**: 🟢 Low
**Validation**: Follow decision tree for test scenario

### Phase 3: Quick Reference (Low Risk)

**Goal**: Integrate reference materials

**Actions**:
1. Create `docs/guides/reference/hive-mind-quick-reference.md`
2. Copy from `hive-mind-investigation/3-reference/quick-reference.md`
3. Format for quick lookup
4. Update docs/guides/README.md index

**Time**: 10 minutes
**Risk**: 🟢 Low
**Validation**: Use for quick lookup test

### Phase 4: Advanced Topics (Medium Risk)

**Goal**: Integrate advanced execution guides

**Actions**:
1. Create `docs/guides/advanced/adaptive-pivot-protocol.md`
2. Synthesize from adaptive-pivot content
3. Create `docs/guides/advanced/complex-work-execution.md`
4. Copy from zero-risk-strategy.md
5. Update docs/guides/README.md index

**Time**: 30 minutes
**Risk**: 🟡 Medium
**Validation**: Review for completeness

### Phase 5: Internal Integration (Low Risk)

**Goal**: Update internal .claude/ documentation

**Actions**:
1. Create `.claude/integrations/hive-mind/`
2. Create `.claude/integrations/hive-mind/integration-guide.md`
3. Copy from recommendation.md
4. Update .claude/ README if exists

**Time**: 10 minutes
**Risk**: 🟢 Low
**Validation**: Verify internal docs accessible

### Phase 6: Archive Inbox Collections (No Risk)

**Goal**: Move integrated content to archive

**Actions**:
1. Create `.inbox/archive/assistant/` if not exists
2. Move `2025-11-16-hive-mind-investigation/` to archive
3. Update STATUS.md to ARCHIVED
4. Add archive timestamp

**Time**: 5 minutes
**Risk**: 🟢 None
**Validation**: Collections in archive, not active inbox

---

## 📐 Before/After Comparison

### BEFORE (Current State)

```
inbox/assistant/
├── README.md
├── 2025-11-16-hive-mind-investigation/     (READY-FOR-HANDOFF)
│   ├── 1-foundation/                       ← Hive-mind content
│   ├── 2-decision-framework/               ← Hive-mind content
│   └── 3-reference/                        ← Hive-mind content
├── 2025-11-16-research-findings/           (🔵 INTEGRATED ❌)
│   ├── adaptive-pivot-protocol/            ← Hive-mind content! (split)
│   ├── broken-links-issue/                 ← Different topic!
│   └── claude-flow-investigation/          ← Already applied
└── 2025-11-16-system-hygiene-check/        (READY-FOR-HANDOFF)
    ├── 1-content-placement/                ← Actionable
    ├── 2-quality-improvements/             ← Actionable
    └── 3-execution-planning/               ← Hive-mind content! (split)
        ├── zero-risk-strategy.md           ← Reference material
        └── hive-mind-capability-mapping.md ← Duplicate of investigation content
```

**Problems**:
- ❌ Hive-mind content split across 3 collections
- ❌ "INTEGRATED" collection still in active inbox
- ❌ Unrelated topics mixed (broken-links in research-findings)
- ❌ Reference materials in wrong collection
- ❌ Duplicate content (capability-mapping in 2 places)

### AFTER (Refactored)

```
inbox/assistant/
├── README.md                               ← Updated with 2-status workflow
├── 2025-11-16-hive-mind-investigation/     (🟢 READY-FOR-HANDOFF)
│   ├── 1-foundation/
│   │   ├── system-overview.md             → docs/guides/concepts/
│   │   ├── purpose-research.md            → archive only
│   │   └── usage-analysis.md              → archive only
│   ├── 2-decision-framework/
│   │   ├── when-to-use.md                 → docs/guides/how-to/
│   │   ├── recommendation.md              → .claude/integrations/
│   │   └── adaptive-pivot.md              ← MOVED from research-findings
│   ├── 3-reference/
│   │   ├── quick-reference.md             → docs/guides/reference/
│   │   └── capability-mapping.md          ← Stays (problem-specific)
│   └── 4-execution-planning/              ← MOVED from system-hygiene
│       ├── zero-risk-strategy.md          → docs/guides/advanced/
│       └── hive-coordination-examples.md
├── 2025-11-16-system-hygiene-check/        (🟡 IN-PROGRESS)
│   ├── 1-content-placement/
│   │   └── file-routing-skill-proposal.md ← Execute to .claude/skills/
│   └── 2-quality-improvements/
│       └── captains-log-review.md         ← Execute to hook scripts
└── 2025-11-16-broken-links-investigation/  (🟡 IN-PROGRESS) ← NEW
    ├── problem-definition.md
    ├── immediate-fix.md
    └── systematic-solution.md

.inbox/archive/assistant/
└── 2025-11-16-research-findings/           (📦 ARCHIVED)
    ├── STATUS.md                           ← Updated to ARCHIVED
    ├── claude-flow-investigation/
    └── README.md
```

**Improvements**:
- ✅ All hive-mind content in ONE collection
- ✅ "INTEGRATED" collection moved to archive
- ✅ Unrelated topics separated (broken-links own collection)
- ✅ Reference materials consolidated
- ✅ No duplicate content
- ✅ Clear status workflow (IN-PROGRESS or READY-FOR-HANDOFF only)
- ✅ Explicit integration mapping to docs/guides/

---

## 🔍 Validation Checklist

### After Consolidation

- [ ] All hive-mind content in single collection
- [ ] No duplicate files across collections
- [ ] Each collection has single clear topic
- [ ] STATUS.md uses only 2 statuses (IN-PROGRESS or READY-FOR-HANDOFF)
- [ ] INTEGRATED collections moved to archive
- [ ] Broken-links has own collection
- [ ] Cross-references updated

### After Integration

- [ ] docs/guides/concepts/ has hive-mind-system.md
- [ ] docs/guides/how-to/ has choose-coordination-approach.md
- [ ] docs/guides/reference/ has hive-mind-quick-reference.md
- [ ] docs/guides/advanced/ has adaptive-pivot-protocol.md
- [ ] docs/guides/advanced/ has complex-work-execution.md
- [ ] .claude/integrations/hive-mind/ has integration-guide.md
- [ ] docs/guides/README.md index updated
- [ ] All links valid (no broken references)

### After Archival

- [ ] .inbox/archive/assistant/ directory exists
- [ ] Hive-mind collection moved to archive
- [ ] Research-findings collection in archive
- [ ] Active inbox only has IN-PROGRESS and READY-FOR-HANDOFF collections
- [ ] Archive collections have STATUS.md with ARCHIVED status

---

## ⚠️ Risks & Mitigation

### Risk 1: Breaking Cross-References

**Risk**: Moving content breaks links in other docs
**Severity**: Medium 🟡
**Mitigation**:
1. Search all docs for references before moving
2. Update references during consolidation
3. Validate all links after integration
4. Keep redirects in moved locations temporarily

**Validation**:
```bash
# Find all references to moved content
grep -r "research-findings" inbox/assistant/
grep -r "adaptive-pivot" inbox/assistant/
grep -r "zero-risk" inbox/assistant/
```

### Risk 2: Lost Content During Move

**Risk**: Content deleted instead of moved
**Severity**: High 🔴
**Mitigation**:
1. Git commit before starting
2. Copy first, delete later
3. Verify copy complete before deletion
4. Keep original until validation passes

**Validation**:
```bash
# Verify content exists in new location
diff old-location/file.md new-location/file.md
```

### Risk 3: Unclear Integration Mapping

**Risk**: User confused about where content went
**Severity**: Low 🟢
**Mitigation**:
1. Document all moves in this plan
2. Add "Moved to" notices in original locations
3. Update README with mapping table
4. Create integration completion report

**Validation**:
- Check this plan has complete mapping table
- Verify READMEs updated with "Moved to" links

---

## 📊 Success Metrics

### Organizational Metrics

**Before**:
- Collections: 3
- Hive-mind files: Split across 3 collections
- Statuses: 3 (IN-PROGRESS, READY, INTEGRATED)
- INTEGRATED collections in active inbox: 1 (wrong!)
- Duplicate files: 2+ (capability-mapping)

**After**:
- Collections: 3 (hive-mind, system-hygiene, broken-links)
- Hive-mind files: Consolidated in 1 collection
- Statuses: 2 (IN-PROGRESS, READY-FOR-HANDOFF)
- INTEGRATED collections in active inbox: 0 (correct!)
- Duplicate files: 0

### Documentation Metrics

**Before**:
- docs/guides/concepts/: 0 hive-mind docs
- docs/guides/how-to/: 0 coordination guides
- docs/guides/reference/: 1 generic doc
- docs/guides/advanced/: 0 docs

**After**:
- docs/guides/concepts/: 1 hive-mind doc
- docs/guides/how-to/: 1 coordination guide
- docs/guides/reference/: 2 docs
- docs/guides/advanced/: 2 execution guides

### User Experience Metrics

**Questions**:
1. "Where is hive-mind documentation?"
   - Before: Check 3 collections
   - After: docs/guides/concepts/hive-mind-system.md

2. "How do I choose coordination approach?"
   - Before: Unclear, scattered across collections
   - After: docs/guides/how-to/choose-coordination-approach.md

3. "What's the status of X collection?"
   - Before: 3 possible statuses, unclear meaning
   - After: 2 statuses with clear workflow

---

## 🚀 Execution Timeline

### Total Time: 2-3 hours

**Phase 1: Consolidation** (45 minutes)
- Step 1: Consolidate hive-mind (20 min)
- Step 2: Reduce system-hygiene (10 min)
- Step 3: Archive research-findings (10 min)
- Step 4: Extract broken-links (5 min)

**Phase 2: Integration** (60-90 minutes)
- Integrate concepts (15 min)
- Integrate how-to (20 min)
- Integrate reference (10 min)
- Integrate advanced (30 min)
- Integrate internal (10 min)

**Phase 3: Archival** (15 minutes)
- Archive integrated collections (10 min)
- Update README (5 min)

**Phase 4: Validation** (30 minutes)
- Check cross-references (10 min)
- Validate integration (10 min)
- Test user workflows (10 min)

---

## 📝 Next Steps

### For User (HITL Approval)

**Review this plan and approve/reject**:

1. **Consolidation approach** - Agree with single collection per topic?
2. **Status workflow** - Accept 2-status system (no INTEGRATED in active inbox)?
3. **Integration mapping** - Destinations in docs/guides/ correct?
4. **Execution timeline** - 2-3 hours acceptable?

**Questions to answer**:
- Should broken-links be separate collection or folded into another?
- Keep capability-mapping.md in inbox or integrate to docs?
- Archive research-findings immediately or wait?

### For Agent (After Approval)

**Execute in order**:
1. Git commit current state (safety checkpoint)
2. Run consolidation steps 1-5
3. Validate consolidation checklist
4. Run integration phases 1-6
5. Validate integration checklist
6. Create completion report
7. Update docs/guides/README.md

---

## 📚 Appendix: Command Reference

### Search Commands

```bash
# Find all hive-mind references
grep -r "hive-mind" inbox/assistant/

# Find all status files
find inbox/assistant -name "STATUS.md" -exec cat {} \;

# Count files per collection
find inbox/assistant -type f | awk -F/ '{print $3}' | sort | uniq -c
```

### Validation Commands

```bash
# Verify no INTEGRATED in active inbox
! grep -r "INTEGRATED" inbox/assistant/*/STATUS.md && echo "✅ No INTEGRATED status"

# Verify all collections have status
find inbox/assistant -maxdepth 1 -type d -not -name assistant -exec test -f {}/STATUS.md \; && echo "✅ All have STATUS.md"

# Check docs/guides structure
find docs/guides -type f -name "*.md" | sort
```

### Integration Commands

```bash
# Create new docs/guides directories
mkdir -p docs/guides/{concepts,how-to,reference,advanced}
mkdir -p .claude/integrations/hive-mind

# Archive collections
mkdir -p .inbox/archive/assistant
mv inbox/assistant/2025-11-16-research-findings .inbox/archive/assistant/
```

---

## 🎯 Key Takeaways

### Organizational Philosophy

**Inbox is temporary, docs are permanent**:
- If it's INTEGRATED, it belongs in docs/, not inbox/
- Active inbox only has work IN-PROGRESS or READY-FOR-HANDOFF
- Completed work goes to archive

**One collection = one topic**:
- No split content across multiple collections
- Consolidate related work into single canonical collection
- Separate unrelated topics into their own collections

**Simple status workflow**:
- Only 2 statuses in active inbox (IN-PROGRESS, READY-FOR-HANDOFF)
- INTEGRATED means moved to permanent docs and archived
- Clear progression: create → work → integrate → archive

### Integration Philosophy

**Respect the docs/guides/ framework**:
- getting-started/ - Tutorials for beginners
- how-to/ - Task-oriented guides
- concepts/ - Explanations and theory
- reference/ - Quick lookups
- troubleshooting/ - Problem solving
- advanced/ - Advanced topics

**Map inbox content to correct category**:
- System overview → concepts/
- Decision trees → how-to/
- Quick references → reference/
- Execution frameworks → advanced/

---

**END OF REFACTORING PLAN**

**Status**: AWAITING HITL APPROVAL
**Next Action**: User reviews and approves execution
**Estimated Execution Time**: 2-3 hours after approval
