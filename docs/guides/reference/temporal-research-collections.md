# Temporal Research Collections (TRC)

**Framework Type**: Staging area organization system
**Use Case**: Research findings catalog and handoff workflow
**Location**: `inbox/assistant/`

---

## Overview

**Temporal Research Collections (TRC)** is an organizational framework for staging areas that combines chronological organization with topic-based grouping and status-driven handoff workflows.

**Core Principle**: Organize research by *when work was done* and *what topic was investigated*, with clear status markers showing handoff readiness.

**Why this framework**: Designed for system development staging areas where research accumulates before being integrated into permanent documentation. Not a project management system—it's an investigation-centric catalog.

---

## Key Concepts

### 1. Temporal Organization

**Structure**: `YYYY-MM-DD-topic-description/`

**Why date-first?**
- Recent work automatically sorts to bottom (easy to find)
- Clear temporal context (when was this researched?)
- Natural archival trigger (content >90 days old)
- Preserves historical audit trail

**Example**:
```
inbox/assistant/
├── 2025-11-16-hive-mind-investigation/
├── 2025-11-16-system-hygiene-check/
└── 2025-11-16-research-findings/
```

### 2. Topic-Based Grouping

**Structure**: Each collection groups related research together

**Why topic-description?**
- Immediately shows what was investigated
- Groups related files together
- Self-documenting directory structure
- Flexible for any future content type

**Example collection**:
```
2025-11-16-hive-mind-investigation/
├── 1-foundation/           # What hive-mind is
├── 2-decision-framework/   # When/how to use it
└── 3-reference/            # Quick lookups
```

### 3. Status-Driven Handoff

**Mechanism**: Each collection has a `STATUS.md` file marking handoff readiness

**Two-status workflow**:
1. 🟡 **IN-PROGRESS** - Active investigation, not ready for handoff
2. 🟢 **READY-FOR-HANDOFF** - Research complete, awaiting integration decision

**After integration**: Collections move directly to `.inbox/archive/assistant/` (no intermediate "INTEGRATED" status)

**Rationale**: If content is truly integrated into permanent docs, it shouldn't remain in active inbox. Archive immediately to eliminate redundancy.

**STATUS.md template**:
```markdown
# Collection Status

**Status**: 🟢 READY-FOR-HANDOFF
**Created**: YYYY-MM-DD
**Last Updated**: YYYY-MM-DD
**Next Action**: [What needs to happen]

## Handoff Checklist
- [ ] Research findings documented
- [ ] Analysis complete
- [ ] Recommendations clear
- [ ] Integration target identified
- [ ] Ready for review

## Integration Target
Where this content should go:
- docs/guides/concepts/topic.md
- .claude/integrations/topic/
```

---

## How It Works in This Workspace

### Session → Inbox Workflow

1. **Session completes** → Research findings documented in `sessions/session-ID/artifacts/`
2. **Create collection** → New dated folder in `inbox/assistant/YYYY-MM-DD-topic/`
3. **Add STATUS.md** → Mark as 🟡 IN-PROGRESS initially
4. **Organize content** → Group by investigation type (foundation, analysis, reference, etc.)
5. **Complete research** → Update status to 🟢 READY-FOR-HANDOFF
6. **Define integration targets** → Specify where content goes in permanent docs
7. **HITL review** → User approves integration approach
8. **Integrate** → Move content to permanent locations
9. **Archive immediately** → Move collection to `.inbox/archive/assistant/` to eliminate redundancy

### Investigation Types

Collections can organize content by investigation type:

- **foundation/** - Foundational understanding (what things are)
- **decision-framework/** - Strategic guidance (when/how to use)
- **reference/** - Quick lookups, specifications
- **analysis/** - Deep-dive investigations
- **proposals/** - Actionable recommendations
- **execution-planning/** - Implementation strategies
- **quality-review/** - Code/documentation reviews

**Example**:
```
2025-11-16-system-hygiene-check/
├── 1-content-placement/      # Quality review type
├── 2-quality-improvements/   # Quality review type
└── 3-execution-planning/     # Execution planning type
```

---

## Navigation Patterns

### By Status (Primary)

Main `inbox/assistant/README.md` shows collections grouped by status:

```markdown
## Collections by Status

### 🟢 Ready for Handoff
- 2025-11-16-system-hygiene-check

### ⚫ Archived
- 2025-11-16-hive-mind-investigation (integrated to docs/guides/)
- 2025-11-16-research-findings (integrated to CLAUDE.md, WORKSPACE-GUIDE.md)

### 🟡 In Progress
- (none currently)
```

**Why status-first navigation?**
- Immediately see what needs action
- Clear handoff workflow visibility
- Focus on "ready" items reduces cognitive load

### By Investigation Type (Secondary)

README also provides topic-based index:

```markdown
### By Investigation Type

**Architectural Analysis**:
- Hive-mind system → 2025-11-16-hive-mind-investigation/

**Protocol Design**:
- Adaptive pivot → 2025-11-16-research-findings/

**Quality Review**:
- Content placement → 2025-11-16-system-hygiene-check/
```

### By Topic (Tertiary)

Cross-cutting concerns span multiple collections:

```markdown
### By Topic

**Coordination & Orchestration**:
- 2025-11-16-hive-mind-investigation/
- 2025-11-16-system-hygiene-check/3-execution-planning/
```

---

## Integration Targets

When content is 🟢 READY-FOR-HANDOFF, the `STATUS.md` file specifies **exactly where it goes**:

### docs/guides/concepts/
Foundational understanding (what things are)
- System overviews
- Architectural explanations
- Core concepts

**Example**: `hive-mind-investigation/1-foundation/system-overview.md` → `docs/guides/concepts/hive-mind-system.md`

### docs/guides/how-to/
Task-based guides (how to do things)
- Decision frameworks
- Step-by-step procedures
- Troubleshooting guides

**Example**: `hive-mind-investigation/2-decision-framework/when-to-use.md` → `docs/guides/how-to/choose-coordination-approach.md`

### docs/guides/reference/
Quick lookups and specifications
- Command references
- API documentation
- Configuration specs

**Example**: `hive-mind-investigation/3-reference/quick-reference.md` → `docs/guides/reference/hive-mind-quick-reference.md`

### .claude/integrations/
Automation and configuration
- Integration guides
- Configuration templates
- Setup procedures

**Example**: `hive-mind-investigation/2-decision-framework/recommendation.md` → `.claude/integrations/hive-mind/integration-guide.md`

---

## Archival Policy

### 90-Day Rule

**Trigger**: Collections >90 days old automatically qualify for archival
**Action**: Move to `.inbox/archive/assistant/YYYY-MM-DD-topic-description/`
**Benefit**: Keeps inbox focused on recent work while preserving audit trail

**Archive location**:
```
.inbox/archive/assistant/
└── 2025-11-16-research-findings/  # Moved after 2026-02-14
```

### Immediate Archival

**Trigger**: Content integrated to permanent documentation
**Action**: Archive immediately to `.inbox/archive/assistant/`
**Benefit**: Eliminates redundancy - only one canonical source (permanent docs)

**When to use**:
- Content fully integrated into permanent documentation
- No pending follow-up work
- Reference copy no longer needed in staging area

---

## Comparison to Other Frameworks

### vs. PARA Method

**PARA** (Projects, Areas, Resources, Archives):
- ❌ Action-oriented (what needs doing)
- ❌ Forces categorization before research complete
- ❌ Conflicts with future project work structures

**TRC**:
- ✅ Investigation-centric (what/when was researched)
- ✅ No premature categorization (research first, categorize later)
- ✅ Staging-appropriate (temporary holding)

### vs. Zettelkasten

**Zettelkasten** (Atomic notes with linking):
- ❌ High maintenance overhead (linking, IDs)
- ❌ Research-heavy (not execution-friendly)
- ❌ Requires dedicated tooling

**TRC**:
- ✅ Low overhead (just date-stamped folders)
- ✅ Mixed-use (research + proposals + execution)
- ✅ Works with standard filesystem

### vs. Stage-Gate Process

**Stage-Gate** (Linear progression):
- ❌ Forces linear flow (research isn't linear)
- ❌ Hard to handle parallel investigations
- ❌ Rigid structure

**TRC**:
- ✅ Flexible progression (collections independent)
- ✅ Supports parallel research
- ✅ Adaptable to exploratory work

---

## Best Practices

### Creating Collections

**DO**:
- ✅ Use clear, descriptive topic names
- ✅ Create STATUS.md immediately
- ✅ Organize by investigation type within collection
- ✅ Define integration targets early

**DON'T**:
- ❌ Use vague dates like "recent" or "latest"
- ❌ Skip STATUS.md (kills handoff workflow)
- ❌ Mix unrelated topics in one collection
- ❌ Wait until "complete" to document integration targets

### Managing Status Transitions

**🟡 → 🟢 (IN-PROGRESS → READY-FOR-HANDOFF)**:
- Complete handoff checklist in STATUS.md
- Define all integration targets
- Ensure cross-references work
- Get ready for HITL review

**🟢 → ⚫ (READY-FOR-HANDOFF → ARCHIVED)**:
- Integrate content to permanent locations (docs/guides/ or .claude/)
- Update all cross-references
- Verify integration complete
- Archive entire collection immediately to `.inbox/archive/assistant/`
- Update main README to show archived status with permanent locations

### Integration Workflow

1. **Identify permanent locations** (docs/guides/ or .claude/)
2. **Create new files** in permanent locations
3. **Move content** with appropriate synthesis
4. **Update cross-references** to point to permanent locations
5. **Test navigation** (ensure no broken links)
6. **Archive collection immediately** to `.inbox/archive/assistant/`
7. **Update inbox README** to show archived status and permanent locations

---

## Examples

### Example 1: Hive-Mind Investigation

**Collection**: `2025-11-16-hive-mind-investigation/`

**Structure**:
```
2025-11-16-hive-mind-investigation/
├── STATUS.md (🟢 READY-FOR-HANDOFF)
├── README.md (collection overview)
├── 1-foundation/
│   ├── system-overview.md (synthesized)
│   ├── purpose-research.md (detailed investigation)
│   └── usage-analysis.md (database forensics)
├── 2-decision-framework/
│   ├── when-to-use.md (synthesized decision tree)
│   └── recommendation.md (6-phase integration)
└── 3-reference/
    ├── quick-reference.md (fast lookup)
    └── capability-mapping.md (problem-specific)
```

**Integration targets** (from STATUS.md):
- `1-foundation/system-overview.md` → `docs/guides/concepts/hive-mind-system.md`
- `2-decision-framework/when-to-use.md` → `docs/guides/how-to/choose-coordination-approach.md`
- `3-reference/quick-reference.md` → `docs/guides/reference/hive-mind-quick-reference.md`
- `2-decision-framework/recommendation.md` → `.claude/integrations/hive-mind/integration-guide.md`

**Outcome**: 7 synthesized files, 2,668+ lines, 56% reduction via mesh topology

---

### Example 2: System Hygiene Check

**Collection**: `2025-11-16-system-hygiene-check/`

**Structure**:
```
2025-11-16-system-hygiene-check/
├── STATUS.md (🟢 READY-FOR-HANDOFF)
├── README.md
├── 1-content-placement/        # Quality review type
│   ├── content-categorization.md
│   ├── readme-updates.md
│   └── file-routing-skill.md
├── 2-quality-improvements/     # Quality review type
│   └── captains-log-review.md
└── 3-execution-planning/       # Execution planning type
    ├── zero-risk-strategy.md
    └── capability-mapping.md
```

**Integration approach**: Execute proposals, then integrate patterns to reference docs

---

## Framework Benefits

### For Research

- ✅ **Chronological audit trail** (when was this discovered?)
- ✅ **Topic-based grouping** (related research stays together)
- ✅ **Low overhead** (just create dated folders)
- ✅ **Self-documenting** (folder names explain content)

### For Handoff

- ✅ **Clear workflow** (4 status phases)
- ✅ **Explicit targets** (STATUS.md defines destinations)
- ✅ **HITL gates** (review before integration)
- ✅ **Rollback friendly** (can reverse integration if needed)

### For Organization

- ✅ **Multiple navigation paths** (status, type, topic)
- ✅ **Natural archival** (90-day rule)
- ✅ **Scalable** (supports unlimited collections)
- ✅ **Flexible** (accommodates unknown future content)

---

## When to Use TRC

**✅ Good fit for**:
- Staging areas and handoff zones
- Research findings catalogs
- System development investigations
- Integration point discovery
- Temporary holding before permanent docs

**❌ Not ideal for**:
- Active project work (use project management tools)
- Permanent documentation (use topic-based organization)
- Real-time collaboration (use version control workflows)
- Long-lived reference materials (use topic hierarchies)

---

## Related Documentation

- **Implementation**: [inbox/assistant/README.md](../../../inbox/assistant/README.md)
- **Framework research**: See `staging-framework-research.md` in hive-mind-investigation session
- **Design rationale**: See `staging-area-structure-plan.md` in hive-mind-investigation session
- **Example collections**: Browse `inbox/assistant/` for real-world examples

---

**Framework Version**: 1.0
**Last Updated**: 2025-11-16
**Status**: Active in workspace
