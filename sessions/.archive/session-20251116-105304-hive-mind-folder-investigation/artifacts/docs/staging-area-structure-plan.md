# Staging Area Structure Plan - inbox/assistant

**System Architecture Designer**: System Design Analysis
**Date**: 2025-11-16
**Purpose**: Design organizational framework for inbox/assistant as staging/handoff area
**Framework**: Temporal Research Collections (TRC)

---

## Executive Summary

**Recommended Framework**: **Temporal Research Collections (TRC)**

**Core Principle**: Organize research by *when work was done* and *what topic was investigated*, with clear status markers for handoff readiness.

**Why this works for staging**:
- ✅ Already in use (low migration cost)
- ✅ Chronological organization (recent work is easy to find)
- ✅ Topic-based grouping (related research stays together)
- ✅ Clear handoff workflow (status markers show what's ready)
- ✅ Flexible for unknown future content
- ✅ Doesn't conflict with future project work structures
- ✅ Supports session-based research workflow

**Key Difference from PARA**: TRC is *investigation-centric* (when/what was researched), not *action-oriented* (what needs to be done). Perfect for a staging area where research accumulates before being integrated into permanent documentation.

---

## Framework: Temporal Research Collections (TRC)

### 1. Organization Pattern

**Primary Structure**: Date-stamped topic collections

```
inbox/assistant/
├── YYYY-MM-DD-topic-description/          # Research collection
│   ├── STATUS.md                          # Handoff readiness marker
│   ├── investigation-type/                # Nested by investigation type
│   │   ├── research-findings.md
│   │   ├── analysis.md
│   │   └── recommendations.md
│   └── README.md                          # Collection overview
├── closeout-investigation/                # Persistent collection (no date)
│   └── session-YYYYMMDD-HHMMSS.md
└── README.md                              # Staging area guide
```

**Why date-first?**
- Recent work automatically sorts to bottom (easy to find)
- Clear temporal context (when was this researched?)
- Natural archival trigger (content >90 days old)
- No need to remember arbitrary category names

**Why topic-description?**
- Immediately shows what was investigated
- Groups related files together
- Self-documenting directory structure
- Flexible for any future content type

### 2. Handoff Workflow System

**Status Markers** (via STATUS.md in each collection):

```markdown
# Collection Status

**Status**: 🟡 IN-PROGRESS | 🟢 READY-FOR-HANDOFF | 🔵 INTEGRATED | ⚫ ARCHIVED

**Created**: 2025-11-16
**Last Updated**: 2025-11-16
**Next Action**: [Description of what needs to happen]

---

## Handoff Checklist

- [ ] Research findings documented
- [ ] Analysis complete
- [ ] Recommendations clear
- [ ] User-facing docs identified (where content should go)
- [ ] Integration path defined
- [ ] Ready for review

## Integration Target

**Where this goes**:
- `docs/guides/concepts/` - [specific files]
- `docs/guides/how-to/` - [specific files]
- `.claude/integrations/` - [specific configs]

## Notes

[Any context needed for handoff]
```

**Status Flow**:
1. 🟡 **IN-PROGRESS** - Active investigation, not ready for handoff
2. 🟢 **READY-FOR-HANDOFF** - Research complete, awaiting integration decision
3. 🔵 **INTEGRATED** - Content moved to permanent location, research archived as reference
4. ⚫ **ARCHIVED** - Content >90 days old, moved to `.inbox/archive/assistant/`

### 3. Investigation Types (Nested Organization)

Within each dated collection, organize by investigation type:

**Investigation Categories**:
- `integration-research/` - Evaluating integration approaches, feasibility studies
- `architectural-analysis/` - System design, architectural decisions
- `root-cause-investigation/` - Problem analysis, forensics
- `protocol-design/` - Process design, workflow protocols
- `capability-mapping/` - Feature analysis, capability assessments
- `quality-review/` - Code quality, documentation review
- `execution-planning/` - Implementation strategies, execution plans

**Example**:
```
2025-11-16-system-hygiene-check/
├── STATUS.md                              # 🟢 READY-FOR-HANDOFF
├── 1-content-placement/                   # Quality review type
│   ├── readme-updates-proposal.md
│   ├── content-categorization-analysis.md
│   └── file-routing-skill-proposal.md
├── 2-quality-improvements/                # Quality review type
│   ├── captains-log-review.md
│   └── README.md
├── 3-execution-planning/                  # Execution planning type
│   ├── zero-risk-execution-strategy.md
│   └── hive-mind-capability-mapping.md
├── documentation-synthesis.md             # Top-level synthesis
└── coherence-and-dependencies.md          # Top-level analysis
```

---

## Proposed Structure for 31 Existing Files

### Complete Folder Mapping

**Current State**:
- 24 markdown files (as counted)
- 2 dated collections (research-findings, system-hygiene-check)
- 1 README.md

**Proposed Organization** (minimal reorganization):

```
inbox/assistant/
│
├── README.md                              # ✏️ UPDATED (navigation guide)
│
├── 2025-11-16-research-findings/          # ✅ KEEP AS-IS
│   ├── STATUS.md                          # ➕ ADD (🔵 INTEGRATED)
│   ├── INDEX.md                           # ✅ KEEP
│   ├── EXECUTIVE-SUMMARY.md               # ✅ KEEP
│   ├── claude-flow-investigation/         # ✅ KEEP (architectural-analysis type)
│   │   ├── MANIFEST.md
│   │   ├── stock-spec-research.md
│   │   ├── directory-pattern-analysis.md
│   │   ├── hooks-code-analysis.md
│   │   └── final-recommendation.md
│   ├── adaptive-pivot-protocol/           # ✅ KEEP (protocol-design type)
│   │   ├── README.md
│   │   └── adaptive-pivot-protocol-discussion.md
│   ├── broken-links-issue/                # ✅ KEEP (root-cause-investigation type)
│   │   └── PROBLEM.md
│   └── hive-mind-integration/             # ✅ KEEP (capability-mapping type)
│       └── hive-mind-capability-mapping.md
│
├── 2025-11-16-system-hygiene-check/       # ✅ KEEP AS-IS
│   ├── STATUS.md                          # ➕ ADD (🟢 READY-FOR-HANDOFF)
│   ├── README.md                          # ✅ KEEP
│   ├── documentation-synthesis.md         # ✅ KEEP
│   ├── coherence-and-dependencies.md      # ✅ KEEP
│   ├── 1-content-placement/               # ✅ KEEP (quality-review type)
│   │   ├── README.md
│   │   ├── readme-updates-proposal.md
│   │   ├── content-categorization-analysis.md
│   │   └── file-routing-skill-proposal.md
│   ├── 2-quality-improvements/            # ✅ KEEP (quality-review type)
│   │   ├── README.md
│   │   └── captains-log-review.md
│   └── 3-execution-planning/              # ✅ KEEP (execution-planning type)
│       ├── README.md
│       ├── zero-risk-execution-strategy.md
│       └── hive-mind-capability-mapping.md
│
└── closeout-investigation/                # ➕ CREATE (persistent collection)
    ├── README.md                          # ➕ ADD (explains purpose)
    └── session-20251115-210537.md         # 📝 Future session forensics
```

**File Count**:
- Existing: 24 markdown files
- New: 4 STATUS.md files + 1 closeout README = 5 new files
- Total: 29 files organized in 2 dated collections + 1 persistent collection

**Changes Required**:
1. ➕ Add `STATUS.md` to each dated collection (2 files)
2. ➕ Create `closeout-investigation/README.md` (1 file)
3. ✏️ Update main `inbox/assistant/README.md` (existing file)
4. ✅ Keep everything else exactly where it is

---

## Navigation Strategy

### 1. Main README.md (Entry Point)

**Purpose**: Guide users to recent work and handoff-ready content

**Key Sections**:
```markdown
# Assistant Workspace - System Development Staging Area

## 🎯 Quick Navigation

### Ready for Handoff 🟢
[Collections marked READY-FOR-HANDOFF, sorted by date]

### In Progress 🟡
[Collections marked IN-PROGRESS, sorted by date]

### Recently Integrated 🔵
[Last 5 integrated collections]

## 📋 All Collections
[All dated collections, sorted newest first]

## 🔍 Finding Content

- **By date**: Collections sorted newest → oldest
- **By topic**: See collection name (YYYY-MM-DD-topic-description)
- **By status**: Check STATUS.md in each collection
- **By type**: See nested folders within collections

## 📖 Understanding This Workspace

[Explanation of TRC framework, handoff workflow, status meanings]
```

### 2. Collection README.md (Collection Overview)

**Purpose**: Explain what's in this collection and how it's organized

**Template**:
```markdown
# [Collection Name] - [Topic Description]

**Date**: YYYY-MM-DD
**Investigation Type**: [Type(s)]
**Status**: [See STATUS.md]

---

## What's in This Collection

[Brief overview of research findings]

## Organization

- `folder-name/` - [What's inside]
- `file-name.md` - [What this covers]

## Key Findings

[3-5 bullet points of main discoveries]

## Next Steps

[See STATUS.md for handoff checklist and integration targets]
```

### 3. STATUS.md (Handoff Readiness)

**Purpose**: Clear marker of what's ready for handoff and where it should go

[Template shown in Handoff Workflow System section above]

---

## Handoff Workflow Details

### Phase 1: Investigation (🟡 IN-PROGRESS)

**Actions**:
1. Create dated collection: `YYYY-MM-DD-topic-description/`
2. Add `STATUS.md` with 🟡 IN-PROGRESS marker
3. Create investigation-type folders as needed
4. Write research findings, analysis, recommendations
5. Update STATUS.md "Last Updated" date as work progresses

**Example**:
```bash
# Start new investigation
mkdir -p inbox/assistant/2025-11-16-new-feature-research
cd inbox/assistant/2025-11-16-new-feature-research

# Add status marker
cat > STATUS.md << 'EOF'
# Collection Status

**Status**: 🟡 IN-PROGRESS
**Created**: 2025-11-16
**Last Updated**: 2025-11-16
**Next Action**: Complete feasibility analysis

---

## Handoff Checklist

- [x] Research findings documented
- [ ] Analysis complete
- [ ] Recommendations clear
- [ ] User-facing docs identified
- [ ] Integration path defined
- [ ] Ready for review
EOF

# Create investigation folders
mkdir -p integration-research
touch integration-research/{feasibility.md,options.md,recommendation.md}
```

### Phase 2: Handoff Ready (🟢 READY-FOR-HANDOFF)

**Actions**:
1. Complete handoff checklist in STATUS.md
2. Define integration targets (where content goes)
3. Update status to 🟢 READY-FOR-HANDOFF
4. Add to main README.md "Ready for Handoff" section
5. Wait for HITL review/approval

**Triggers Handoff**:
- All research complete
- Recommendations documented
- Integration path clear
- User-facing docs identified
- Collection self-contained

**Example STATUS.md update**:
```markdown
# Collection Status

**Status**: 🟢 READY-FOR-HANDOFF
**Created**: 2025-11-16
**Last Updated**: 2025-11-16
**Next Action**: HITL review for integration approval

---

## Handoff Checklist

- [x] Research findings documented
- [x] Analysis complete
- [x] Recommendations clear
- [x] User-facing docs identified
- [x] Integration path defined
- [x] Ready for review

## Integration Target

**Where this goes**:
- `docs/guides/how-to/using-new-feature.md` - User guide for feature
- `.claude/integrations/new-feature-config.json` - Configuration
- Research stays in inbox/assistant/ as reference

## Notes

Integration will require updating CLAUDE.md to reference new feature.
No conflicts with existing structure identified.
```

### Phase 3: Integration (🔵 INTEGRATED)

**Actions**:
1. Create user-facing docs in target locations
2. Update integration configs as needed
3. Update STATUS.md to 🔵 INTEGRATED
4. Add integration date and permanent locations
5. Research stays in inbox/assistant/ as reference
6. Collection moves to "Recently Integrated" in main README

**Note**: Research doesn't get deleted - it stays as reference for future work

**Example STATUS.md update**:
```markdown
# Collection Status

**Status**: 🔵 INTEGRATED
**Created**: 2025-11-16
**Last Updated**: 2025-11-17
**Integrated**: 2025-11-17
**Next Action**: None (archived as reference)

---

## Integration Completed

**Permanent Locations**:
- `docs/guides/how-to/using-new-feature.md` - Created 2025-11-17
- `.claude/integrations/new-feature-config.json` - Created 2025-11-17

**References**:
- CLAUDE.md updated with new feature reference
- README.md in docs/guides/ updated with new how-to link

## Research Archive

This collection remains in inbox/assistant/ as reference material for:
- Future enhancements to the feature
- Understanding design decisions
- Troubleshooting integration issues
```

### Phase 4: Archival (⚫ ARCHIVED)

**Triggered by**: Content >90 days old AND no active references

**Actions**:
1. Move collection to `.inbox/archive/assistant/YYYY-MM-DD-topic/`
2. Update main README.md to remove from active listings
3. Archival preserves full structure (STATUS.md, nested folders, etc.)

**Exception**: Skip archival if:
- Collection is frequently referenced
- Research is foundational knowledge
- User explicitly marks as "keep active"

**Example**:
```bash
# Archive old collection (>90 days)
mv inbox/assistant/2025-08-15-old-research .inbox/archive/assistant/
```

---

## Before/After Comparison

### Current State (Problems)

**What's Wrong**:
1. ❌ No clear "ready for handoff" markers
2. ❌ Hard to know what needs action vs what's archived
3. ❌ No defined integration workflow
4. ❌ Unclear where research should ultimately go
5. ❌ Mix of completed/in-progress work with no distinction

**What's Right**:
1. ✅ Date-stamped topic collections work well
2. ✅ Nested organization by investigation type is clear
3. ✅ README.md files provide context
4. ✅ INDEX.md and EXECUTIVE-SUMMARY.md show synthesis
5. ✅ Chronological sorting is natural and useful

### Proposed State (Solutions)

**What's Fixed**:
1. ✅ STATUS.md in each collection shows handoff readiness
2. ✅ Clear 4-phase workflow (in-progress → ready → integrated → archived)
3. ✅ Integration targets defined in STATUS.md
4. ✅ Main README.md shows "ready for handoff" vs "in progress"
5. ✅ Handoff checklist ensures research is complete

**What's Preserved**:
1. ✅ Date-stamped topic collections (already working)
2. ✅ Nested investigation-type folders (already clear)
3. ✅ README.md context files (already useful)
4. ✅ INDEX.md and EXECUTIVE-SUMMARY.md synthesis (already good)
5. ✅ Chronological sorting (already natural)

**What's Added**:
1. ➕ STATUS.md handoff markers (4 new files)
2. ➕ Handoff workflow documentation
3. ➕ Integration target definitions
4. ➕ Navigation guide in main README.md
5. ➕ Persistent collections (closeout-investigation/)

---

## Migration Steps

### Step 1: Add STATUS.md to Existing Collections

**For 2025-11-16-research-findings/**:

```bash
cd inbox/assistant/2025-11-16-research-findings

cat > STATUS.md << 'EOF'
# Collection Status

**Status**: 🔵 INTEGRATED
**Created**: 2025-11-16
**Last Updated**: 2025-11-16
**Integrated**: 2025-11-16
**Next Action**: None (archived as reference)

---

## Integration Completed

**Permanent Locations**:
- Session closeout complete
- Findings integrated into session-summary.md
- Research available as reference in inbox/assistant/

**Research Archive**:
This collection documents claude-flow `.claude-flow` directory behavior investigation.
Key findings: `.claude-flow/metrics/` creation is 100% stock behavior.

## Collection Contents

- `claude-flow-investigation/` - Stock behavior research (architectural-analysis)
- `adaptive-pivot-protocol/` - Protocol design discussion (protocol-design)
- `broken-links-issue/` - Session link problem (root-cause-investigation)
- `hive-mind-integration/` - Capability mapping (capability-mapping)
EOF
```

**For 2025-11-16-system-hygiene-check/**:

```bash
cd inbox/assistant/2025-11-16-system-hygiene-check

cat > STATUS.md << 'EOF'
# Collection Status

**Status**: 🟢 READY-FOR-HANDOFF
**Created**: 2025-11-16
**Last Updated**: 2025-11-16
**Next Action**: HITL review for execution approval

---

## Handoff Checklist

- [x] Research findings documented
- [x] Analysis complete
- [x] Recommendations clear
- [x] User-facing docs identified (docs/guides/ updates)
- [x] Integration path defined
- [x] Ready for review

## Integration Target

**Where this goes**:

**Content Placement Updates**:
- `docs/guides/README.md` - Update with clearer content placement rules
- `.claude/skills/file-routing/skill.md` - Update with placement logic
- No changes to inbox/assistant/README.md (already correct)

**Quality Improvements**:
- `sessions/captains-log/` - Fix timestamp formats (YYYY-MM-DD HH:MM:SS)
- Add missing session entries to Captain's Log

**Execution Planning**:
- Reference material only (no integration needed)
- `3-execution-planning/` stays as reference for future complex work

## Notes

Execution requires HITL approval (zero-risk strategy).
See README.md in this collection for estimated timelines (80 min parallel / 210 min sequential).
EOF
```

### Step 2: Create Persistent Collections

**closeout-investigation/**:

```bash
mkdir -p inbox/assistant/closeout-investigation

cat > inbox/assistant/closeout-investigation/README.md << 'EOF'
# Session Closeout Investigation Archive

**Purpose**: Persistent collection for session forensic reports and closeout analysis

**Status**: Persistent (no archival)

---

## What's in This Collection

This folder contains session closeout reports and forensic analysis from completed sessions. These reports document:

- Session summaries and outcomes
- Lessons learned
- Integration decisions
- Cross-session coordination issues
- Process improvements identified

## Organization

Files are organized by session ID:
- `session-YYYYMMDD-HHMMSS.md` - Individual closeout reports

## Why This Persists

Unlike dated research collections, closeout reports are kept indefinitely because:
- They document system evolution over time
- They provide forensic context for understanding past decisions
- They help identify recurring patterns across sessions
- They serve as reference for future session improvements

## Usage

When closing out a session, add a closeout report here if:
- Session revealed system-level insights
- Cross-session coordination issues were discovered
- Process improvements were identified
- Architectural decisions were made

**Note**: Routine session closeouts don't need reports here. Only sessions with system-level findings or cross-session insights should be documented.
EOF
```

### Step 3: Update Main README.md

**Update Navigation Sections**:

```markdown
# Assistant Workspace - System Development Staging Area

**Purpose**: Staging and handoff area for architectural research, system integration work, and cross-session findings.

**Framework**: Temporal Research Collections (TRC)

---

## 🎯 Quick Navigation

### Ready for Handoff 🟢

**Collections awaiting HITL review for integration:**

- **[2025-11-16-system-hygiene-check](2025-11-16-system-hygiene-check/)** - Documentation quality improvements and content placement updates (3 proposals)
  - See STATUS.md for integration targets and execution plan

### Recently Integrated 🔵

**Collections integrated into permanent documentation:**

- **[2025-11-16-research-findings](2025-11-16-research-findings/)** - Claude-flow investigation, adaptive pivot protocol, broken links issue
  - Integrated: 2025-11-16
  - Permanent locations: Session closeout complete

---

## 📋 All Collections

**Active Collections** (sorted newest → oldest):

- **2025-11-16-system-hygiene-check/** 🟢 READY-FOR-HANDOFF
  - Quality improvements, content placement, execution planning
  - See STATUS.md for handoff checklist

- **2025-11-16-research-findings/** 🔵 INTEGRATED
  - Claude-flow behavior, adaptive pivot protocol, broken links, hive-mind mapping
  - Archived as reference

**Persistent Collections**:

- **closeout-investigation/** - Session forensics (permanent)
  - No archival (indefinite retention)

---

## 🔍 Finding Content

**By Status**:
- 🟡 IN-PROGRESS - Active investigation, not ready for handoff
- 🟢 READY-FOR-HANDOFF - Research complete, awaiting integration approval
- 🔵 INTEGRATED - Content moved to permanent location, research archived
- ⚫ ARCHIVED - Content >90 days old, moved to `.inbox/archive/assistant/`

**By Date**: Collections sorted newest → oldest (YYYY-MM-DD prefix)

**By Topic**: See collection name (e.g., `YYYY-MM-DD-topic-description`)

**By Investigation Type**: Check nested folders within collections:
- `integration-research/` - Integration feasibility, evaluation
- `architectural-analysis/` - System design, decisions
- `root-cause-investigation/` - Problem analysis, forensics
- `protocol-design/` - Process design, workflows
- `capability-mapping/` - Feature analysis, assessments
- `quality-review/` - Code/docs quality review
- `execution-planning/` - Implementation strategies

---

## 📖 Understanding This Workspace

### What Belongs Here

**System Development & Architectural Work**:
- ✅ Architectural analysis and system design
- ✅ Integration research and feasibility studies
- ✅ Root cause analysis of system issues
- ✅ Technical deep-dives and research
- ✅ Session closeout reports (closeout-investigation/)
- ✅ Cross-session findings

**NOT for:**
- ❌ User-facing guides (use `docs/guides/`)
- ❌ Feature explanations (use `docs/guides/concepts/`)
- ❌ How-to documentation (use `docs/guides/how-to/`)
- ❌ Session artifacts (use `sessions/$SESSION_ID/artifacts/`)

### Handoff Workflow

**Phase 1: Investigation** (🟡 IN-PROGRESS)
1. Create dated collection: `YYYY-MM-DD-topic-description/`
2. Add STATUS.md with 🟡 marker
3. Create investigation-type folders
4. Write research findings

**Phase 2: Handoff Ready** (🟢 READY-FOR-HANDOFF)
1. Complete handoff checklist
2. Define integration targets
3. Update STATUS.md to 🟢
4. Wait for HITL review

**Phase 3: Integration** (🔵 INTEGRATED)
1. Create user-facing docs in targets
2. Update STATUS.md to 🔵
3. Research stays as reference

**Phase 4: Archival** (⚫ ARCHIVED)
1. After >90 days + no active references
2. Move to `.inbox/archive/assistant/`

### Lifecycle & Archival

**Archive Trigger**: Content >90 days old AND no active references

**Exceptions** (never archive):
- Persistent collections (closeout-investigation/)
- Frequently referenced research
- Foundational knowledge
- User-marked "keep active"

---

## 📚 Quick Reference

| Content Type | Location | Example |
|--------------|----------|---------|
| Architectural research | `YYYY-MM-DD-topic/` | Integration options analysis |
| System design analysis | `YYYY-MM-DD-topic/` | Performance investigation |
| Implementation research | `YYYY-MM-DD-topic/` | Feasibility study |
| Session closeout | `closeout-investigation/` | Forensic reports |
| User guide | `docs/guides/how-to/` | NOT here |
| Feature explanation | `docs/guides/concepts/` | NOT here |

---

## 🔧 Usage Patterns

### Starting New Investigation

```bash
# Create dated collection
mkdir -p inbox/assistant/$(date +%Y-%m-%d)-topic-name
cd inbox/assistant/$(date +%Y-%m-%d)-topic-name

# Add STATUS.md
cat > STATUS.md << 'EOF'
# Collection Status

**Status**: 🟡 IN-PROGRESS
**Created**: $(date +%Y-%m-%d)
**Last Updated**: $(date +%Y-%m-%d)
**Next Action**: [Description]

---

## Handoff Checklist

- [ ] Research findings documented
- [ ] Analysis complete
- [ ] Recommendations clear
- [ ] User-facing docs identified
- [ ] Integration path defined
- [ ] Ready for review
EOF

# Create investigation folders
mkdir -p integration-research
touch integration-research/{findings.md,recommendations.md}
```

### Marking Ready for Handoff

```bash
# Update STATUS.md
# Change status to 🟢 READY-FOR-HANDOFF
# Complete handoff checklist
# Define integration targets
```

### Integration Complete

```bash
# Update STATUS.md
# Change status to 🔵 INTEGRATED
# Document permanent locations
# Add integration date
```

---

**Last Updated**: 2025-11-16
**Framework**: Temporal Research Collections (TRC)
**Status**: Active staging area
```

### Step 4: Validation

**Checklist**:
- [ ] STATUS.md added to 2025-11-16-research-findings/
- [ ] STATUS.md added to 2025-11-16-system-hygiene-check/
- [ ] closeout-investigation/README.md created
- [ ] Main README.md updated with navigation and workflow
- [ ] All 31 files accounted for (24 existing + 7 new = 31 total)
- [ ] No files moved (minimal reorganization)
- [ ] Handoff workflow documented
- [ ] Integration targets defined

---

## Rationale for Framework Choice

### Why NOT PARA?

**PARA (Projects, Areas, Resources, Archives)** is designed for action-oriented work:
- **Projects**: Active work with deadlines and goals
- **Areas**: Ongoing responsibilities
- **Resources**: Reference material organized by topic
- **Archives**: Inactive content

**Problem for staging**: PARA assumes you know what action needs to be taken. In a staging area, content accumulates during investigation before we know the final action. PARA forces premature categorization.

**Example mismatch**:
- Where does "research findings from a completed session" go?
  - Not a Project (no deadline, not active work)
  - Not an Area (not an ongoing responsibility)
  - Not a Resource (not general reference, specific to one investigation)
  - Not Archives (just completed, still needs handoff)

### Why Temporal Research Collections (TRC)?

**TRC is investigation-centric**, not action-oriented:
- **When** was this researched? (date prefix)
- **What** was investigated? (topic description)
- **What status** is it in? (STATUS.md marker)

**Perfect for staging**:
1. ✅ Doesn't require knowing final action upfront
2. ✅ Natural chronological organization (recent work easy to find)
3. ✅ Clear handoff states (in-progress → ready → integrated)
4. ✅ Flexible for unknown future content types
5. ✅ Supports session-based research workflow
6. ✅ Already in use (low migration cost)

**Key Advantage**: Content can accumulate during investigation without needing to decide "is this a project or a resource?" upfront. The handoff workflow (STATUS.md) handles that decision later.

### Framework Comparison

| Framework | Organization | Best For | Fit for Staging |
|-----------|--------------|----------|-----------------|
| **PARA** | Action-oriented (projects/areas) | Active work management | ❌ Poor - Forces premature categorization |
| **GTD** | Context-based (@home, @work) | Personal productivity | ❌ Poor - Wrong abstraction level |
| **Zettelkasten** | Atomic notes with links | Knowledge management | ❌ Poor - Too granular, no handoff concept |
| **Johnny.Decimal** | Hierarchical numbers | Filing system | ❌ Poor - Requires upfront taxonomy |
| **TRC** | Temporal + topic + status | Research staging/handoff | ✅ **Excellent** - Investigation-centric, flexible, clear handoff |

---

## Architecture Decision Record

**Decision**: Use Temporal Research Collections (TRC) framework for inbox/assistant/ staging area

**Context**: Need organizational structure for research staging area that:
- Supports session-based investigation workflow
- Provides clear handoff from research → integration
- Accommodates unknown future content types
- Minimizes reorganization of existing content
- Doesn't conflict with future project structures

**Considered Alternatives**:
1. PARA - Rejected (too action-oriented for staging)
2. GTD - Rejected (wrong abstraction level)
3. Zettelkasten - Rejected (too granular)
4. Johnny.Decimal - Rejected (requires upfront taxonomy)

**Decision**: TRC with date-stamped topic collections + STATUS.md handoff markers

**Consequences**:
- ✅ Easy to find recent work (chronological sort)
- ✅ Clear handoff workflow (4 status phases)
- ✅ Minimal migration (add STATUS.md files)
- ✅ Flexible for future content
- ✅ Supports session-based research
- ⚠️ Requires discipline to update STATUS.md
- ⚠️ Periodic archival needed (>90 days)

**Status**: Awaiting HITL approval

---

## Next Steps

**After HITL Approval**:

1. **Execute Migration** (5 minutes):
   - Add STATUS.md to 2 dated collections
   - Create closeout-investigation/README.md
   - Update main README.md

2. **Validate Structure** (2 minutes):
   - Verify all 31 files accounted for
   - Check handoff workflow clarity
   - Test navigation from main README

3. **Document in CLAUDE.md** (3 minutes):
   - Reference TRC framework
   - Link to staging area README
   - Update file routing guidance

**Total Effort**: ~10 minutes

---

**Created**: 2025-11-16
**Designer**: System Architecture Designer (Claude Code)
**Status**: Awaiting HITL approval
**Estimated Migration Time**: 10 minutes
