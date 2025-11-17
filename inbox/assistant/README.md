# Assistant Inbox

**Purpose**: Staging area for system research findings and integration point discovery. Serves as a handoff zone between session work and permanent documentation.

**Framework**: [Temporal Research Collections (TRC)](../../docs/guides/reference/temporal-research-collections.md)

---

## Organization System

This inbox uses **Temporal Research Collections (TRC)** - date-stamped topic collections with status-based handoff workflow.

**Structure**: `YYYY-MM-DD-topic-description/`
- Recent work sorts to bottom (easy to find)
- Clear temporal context (when was this researched?)
- Natural archival trigger (content >90 days old)
- Topic-based grouping (related research stays together)

**Status Workflow**: Each collection has a `STATUS.md` file marking handoff readiness:
- 🟡 **IN-PROGRESS** - Active investigation
- 🟢 **READY-FOR-HANDOFF** - Complete, awaiting integration
- ⚫ **ARCHIVED** - Integrated to permanent docs and moved to `.inbox/archive/assistant/`

---

## Collections by Status

### 🟢 Ready for Handoff

**[2025-11-16-system-hygiene-check](2025-11-16-system-hygiene-check/)**
- **What**: Quality proposals and execution planning for system improvements
- **Proposals ready**:
  - Content placement system (2 of 3 complete, 1 pending ~25 min)
  - Captain's Log improvements (timestamp fixes ~25 min)
- **Next action**: Execute pending proposals with HITL approval
- **Files**: 10 documents organized by investigation type

### ⚫ Archived

**[2025-11-16-hive-mind-investigation](.inbox/archive/assistant/2025-11-16-hive-mind-investigation/)** (Archived 2025-11-16)
- **What**: Comprehensive investigation of `.hive-mind` folder purpose, usage, and integration
- **Integration**: ✅ Complete - Content integrated to `docs/guides/`
- **Permanent locations**:
  - `docs/guides/concepts/hive-mind-system.md`
  - `docs/guides/how-to/choose-coordination-approach.md`
  - `docs/guides/reference/hive-mind-quick-reference.md`
  - `docs/guides/reference/hive-mind-capability-mapping.md`
  - `docs/guides/how-to/zero-risk-execution-pattern.md`
  - `docs/guides/advanced/adaptive-pivot-protocol.md`
- **Files**: 9 documents (archived for reference)

**[2025-11-16-research-findings](.inbox/archive/assistant/2025-11-16-research-findings/)** (Archived 2025-11-16)
- **What**: Integration testing session findings (session-20251115-210537)
- **Completed integrations**:
  - Claude-Flow compliance ✅ (stock behavior confirmed, docs updated)
  - Adaptive pivot protocol ✅ (integrated to hive-mind-investigation, then to docs/guides/advanced/)
  - Broken links issue 🔴 (immediate fix applied, systematic solution pending)
- **Files**: 13 documents (archived for reference)

---

## Quick Navigation

### By Investigation Type

**Quality Review** (Active):
- Content placement → `2025-11-16-system-hygiene-check/1-content-placement/`
- Captain's Log review → `2025-11-16-system-hygiene-check/2-quality-improvements/`

**Archived Collections** (Reference only):
- Architectural Analysis → See `.inbox/archive/assistant/2025-11-16-research-findings/claude-flow-investigation/`
- Hive-mind system design → See `.inbox/archive/assistant/2025-11-16-hive-mind-investigation/` OR `docs/guides/` (permanent)
- Protocol Design → See `docs/guides/advanced/adaptive-pivot-protocol.md` (permanent)
- Execution patterns → See `docs/guides/how-to/zero-risk-execution-pattern.md` (permanent)

### By Topic

**Quality & Documentation** (Active):
- `2025-11-16-system-hygiene-check/1-content-placement/` - File organization proposals
- `2025-11-16-system-hygiene-check/2-quality-improvements/` - Captain's Log fixes

**Coordination & Orchestration** (Archived → Permanent):
- `docs/guides/concepts/hive-mind-system.md` - Complete hive-mind system guide
- `docs/guides/how-to/choose-coordination-approach.md` - Decision framework
- `docs/guides/reference/hive-mind-quick-reference.md` - Quick lookups
- `docs/guides/reference/hive-mind-capability-mapping.md` - Problem-specific guidance

**Stock Compliance** (Archived):
- `.inbox/archive/assistant/2025-11-16-research-findings/claude-flow-investigation/` - Confirmed stock behavior

**Problem Definitions** (Archived):
- `.inbox/archive/assistant/2025-11-16-research-findings/broken-links-issue/` - Session link breakage (pending systematic solution)

---

## Lifecycle & Handoff

### Session Handoff Flow

1. **Session completes** → Research findings documented
2. **Analysis complete** → Create dated collection in inbox/assistant
3. **Add STATUS.md** → Mark handoff readiness (🟡 → 🟢)
4. **HITL review** → Approve integration targets
5. **Integrate** → Move to permanent docs (docs/guides/ or .claude/)
6. **Archive immediately** → Move collection to `.inbox/archive/assistant/` to eliminate redundancy

### Integration Targets

When content is 🟢 READY-FOR-HANDOFF, the STATUS.md file specifies where it goes:
- **docs/guides/concepts/** - Foundational understanding (what things are)
- **docs/guides/how-to/** - Task-based guides (how to do things)
- **docs/guides/reference/** - Quick lookups, specifications
- **.claude/integrations/** - Configuration and automation

### Archival Policy

**90-day rule**: Collections >90 days old move to `.inbox/archive/assistant/YYYY-MM-DD-topic-description/`
- Keeps inbox focused on recent work
- Preserves temporal audit trail
- Can be retrieved if needed

**Immediate archival**: After integration to permanent docs, archive collection immediately to eliminate redundancy

---

## What Belongs Here

**✅ Belongs in inbox/assistant**:
- System development research findings
- Integration point discoveries
- Architectural analysis and decisions
- Problem definitions requiring solutions
- Execution proposals and planning
- Quality improvement recommendations
- Reference materials pending permanent documentation

**❌ Does NOT belong here**:
- User-facing guides (goes to `docs/guides/`)
- Active session work (stays in `sessions/`)
- Permanent configurations (goes to `.claude/`)
- Project work (TBD - future structure)

---

## Collections

### Active Collections (1)

1. **2025-11-16-system-hygiene-check** (🟢 READY-FOR-HANDOFF)
   - 11 files, 2 proposal types
   - Content placement, quality improvements
   - Awaiting: Execution approval

### Archived Collections (2)

Archived collections preserve research findings while eliminating redundancy with permanent documentation.

1. **2025-11-16-hive-mind-investigation** (⚫ ARCHIVED 2025-11-16)
   - Integrated to `docs/guides/` (6 permanent guides created)
   - Archived location: `.inbox/archive/assistant/2025-11-16-hive-mind-investigation/`
   - 9 documents preserved for reference

2. **2025-11-16-research-findings** (⚫ ARCHIVED 2025-11-16)
   - Content integrated to CLAUDE.md, WORKSPACE-GUIDE.md, and hive-mind-investigation
   - Archived location: `.inbox/archive/assistant/2025-11-16-research-findings/`
   - 13 documents preserved for reference

---

## Framework Documentation

For complete understanding of the Temporal Research Collections framework:
- **Reference guide**: [docs/guides/reference/temporal-research-collections.md](../../docs/guides/reference/temporal-research-collections.md)
- **Framework research**: See staging-framework-research.md in hive-mind-investigation session
- **Design rationale**: See staging-area-structure-plan.md in hive-mind-investigation session

---

**Last updated**: 2025-11-16
**Active Collections**: 1 (ready for handoff)
**Archived Collections**: 2 (integrated to permanent docs)
**Framework**: Temporal Research Collections (TRC)
