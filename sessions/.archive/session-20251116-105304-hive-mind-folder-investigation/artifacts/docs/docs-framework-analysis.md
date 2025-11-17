# docs/guides/ Framework Analysis & Integration Mapping

**Session**: session-20251116-105304-hive-mind-folder-investigation
**Date**: 2025-11-16
**Purpose**: Analyze docs/guides/ organizational framework and map inbox/assistant content to proper permanent locations

---

## Executive Summary

**docs/guides/ Framework**: [Divio Documentation System](https://documentation.divio.com/)

**Structure**:
```
docs/guides/
├── getting-started/    ← Tutorials for beginners (EMPTY)
├── how-to/            ← Step-by-step task guides (1 guide)
├── reference/         ← Quick references & checklists (2 guides)
├── troubleshooting/   ← Problem solving & debugging (1 guide)
├── concepts/          ← Explanations & architecture (EMPTY)
└── advanced/          ← Advanced topics & optimization (EMPTY)
```

**Current Content**: 5 files total
- 1 index (README.md)
- 1 how-to guide (integration-testing-guide.md)
- 2 reference guides (feature-verification-checklist.md, temporal-research-collections.md)
- 1 troubleshooting guide (troubleshooting-guide.md)

**inbox/assistant Content Awaiting Integration**: 3 collections
- 2025-11-16-hive-mind-investigation (7 files, READY-FOR-HANDOFF)
- 2025-11-16-system-hygiene-check (13 files, READY-FOR-HANDOFF)
- 2025-11-16-research-findings (13 files, INTEGRATED)

---

## Part 1: docs/guides/ Organizational Framework

### Framework: Divio Documentation System

**Four quadrants**:
1. **Tutorials** (learning-oriented) → `getting-started/`
2. **How-to Guides** (task-oriented) → `how-to/`
3. **Reference** (information-oriented) → `reference/`
4. **Explanation** (understanding-oriented) → `concepts/`

**Additional workspace categories**:
5. **Troubleshooting** (problem-oriented) → `troubleshooting/`
6. **Advanced Topics** (specialized) → `advanced/`

### Current Category Population

#### 🟢 Populated Categories

**how-to/** (1 file):
- `integration-testing-guide.md` (454 lines) - Step-by-step testing procedures
- **Audience**: Users setting up workspace or verifying functionality
- **Pattern**: "Here's how to test X. Run this command. Expect this output."

**reference/** (2 files):
- `feature-verification-checklist.md` (441 lines) - Quick health checks
- `temporal-research-collections.md` (447 lines) - TRC framework specification
- **Audience**: Users needing quick lookups and specifications
- **Pattern**: "Here's a checklist. Here's the spec. Use for quick reference."

**troubleshooting/** (1 file):
- `troubleshooting-guide.md` (702 lines) - Error diagnosis and solutions
- **Audience**: Users experiencing problems
- **Pattern**: "Seeing error X? Try solution Y. If that fails, try Z."

#### 🟡 Empty Categories (Opportunities)

**getting-started/** (0 files):
- **Intended for**: Beginner tutorials, onboarding guides, quick starts
- **Example topics**: "Your First Claude Flow Swarm", "Setting Up MCP Servers"
- **Gap**: No beginner-friendly entry points currently

**concepts/** (0 files):
- **Intended for**: Foundational understanding, architecture explanations
- **Example topics**: "Understanding Hive-Mind Coordination", "Session Management Architecture"
- **Gap**: No conceptual documentation explaining "what things are" and "why they work this way"

**advanced/** (0 files):
- **Intended for**: Performance tuning, scaling, custom integrations
- **Example topics**: "Optimizing Agent Performance", "Custom Queen Types"
- **Gap**: No advanced usage patterns documented

### Content Categorization Criteria

**From docs/guides/README.md**:

> "**What Belongs in docs/guides/**
>
> Audience: End users and developers USING the system
>
> This directory contains:
> - ✅ User-facing guides explaining how features work
> - ✅ Feature explanations for understanding concepts
> - ✅ How-to documentation for accomplishing tasks
> - ✅ Reference materials (checklists, quick lookups)
> - ✅ Troubleshooting guides for fixing issues
>
> **NOT for:**
> - ❌ Architectural analysis or system design investigations
> - ❌ Integration research or technical deep-dives
> - ❌ 'Working on the system' development documentation"

**From inbox/assistant/README.md**:

> "**✅ Belongs in inbox/assistant**:
> - System development research findings
> - Integration point discoveries
> - Architectural analysis and decisions
> - Problem definitions requiring solutions
> - Execution proposals and planning
> - Quality improvement recommendations
> - Reference materials pending permanent documentation
>
> **❌ Does NOT belong here**:
> - User-facing guides (goes to docs/guides/)
> - Active session work (stays in sessions/)
> - Permanent configurations (goes to .claude/)
> - Project work (TBD - future structure)"

---

## Part 2: inbox/assistant Content Mapping

### Collection 1: 2025-11-16-hive-mind-investigation (READY-FOR-HANDOFF)

**Status**: 🟢 READY-FOR-HANDOFF
**Files**: 7 synthesized documents
**Total Lines**: 2,668+
**Purpose**: Comprehensive hive-mind system investigation (what, why, when, how)

#### Content Structure

```
2025-11-16-hive-mind-investigation/
├── 1-foundation/
│   ├── system-overview.md (synthesized)
│   ├── purpose-research.md (727 lines)
│   └── usage-analysis.md (584 lines)
├── 2-decision-framework/
│   ├── when-to-use.md (synthesized decision tree)
│   └── recommendation.md (1,023 lines)
└── 3-reference/
    ├── quick-reference.md (250 lines)
    └── capability-mapping.md (1,353 lines)
```

#### Integration Mapping

| Source File | Content Type | Target Location | Rationale |
|-------------|--------------|-----------------|-----------|
| `1-foundation/system-overview.md` | Conceptual explanation | `docs/guides/concepts/hive-mind-system.md` | Explains WHAT hive-mind is, queens, workers, consensus |
| `1-foundation/purpose-research.md` | Technical deep-dive | **DO NOT INTEGRATE** (stays in inbox/archive) | Research artifact, too detailed for user docs |
| `1-foundation/usage-analysis.md` | Database forensics | **DO NOT INTEGRATE** (stays in inbox/archive) | Investigation artifact, not user-facing |
| `2-decision-framework/when-to-use.md` | Decision tree guide | `docs/guides/how-to/choose-coordination-approach.md` | HOW to decide when to use hive-mind |
| `2-decision-framework/recommendation.md` | Implementation guide | `.claude/integrations/hive-mind/integration-guide.md` | Technical integration instructions |
| `3-reference/quick-reference.md` | Command reference | `docs/guides/reference/hive-mind-quick-reference.md` | Fast lookup for commands |
| `3-reference/capability-mapping.md` | Problem-specific mapping | `docs/guides/reference/hive-mind-capability-mapping.md` | Maps problems to hive-mind features |

**Integration Summary**:
- **4 files** → Permanent documentation (2 concepts, 1 how-to, 2 reference)
- **3 files** → Archive only (research artifacts)

**New Files Created**:
1. `docs/guides/concepts/hive-mind-system.md` (NEW)
2. `docs/guides/how-to/choose-coordination-approach.md` (NEW)
3. `docs/guides/reference/hive-mind-quick-reference.md` (NEW)
4. `docs/guides/reference/hive-mind-capability-mapping.md` (NEW)
5. `.claude/integrations/hive-mind/integration-guide.md` (NEW)

**Category Impact**:
- **concepts/** → Gains foundational hive-mind explanation (fills gap)
- **how-to/** → Gains coordination decision guide (adds strategic guide)
- **reference/** → Gains 2 quick lookups (commands + problem mapping)

---

### Collection 2: 2025-11-16-system-hygiene-check (READY-FOR-HANDOFF)

**Status**: 🟢 READY-FOR-HANDOFF
**Files**: 13 documents across 3 problem spaces
**Purpose**: Quality proposals and execution planning

#### Content Structure

```
2025-11-16-system-hygiene-check/
├── 1-content-placement/
│   ├── content-categorization-analysis.md (COMPLETED)
│   ├── readme-updates-proposal.md (COMPLETED)
│   └── file-routing-skill-proposal.md (PENDING)
├── 2-quality-improvements/
│   └── captains-log-review.md (PENDING)
└── 3-execution-planning/
    ├── zero-risk-execution-strategy.md (reference)
    └── hive-mind-capability-mapping.md (reference)
```

#### Integration Mapping

| Source File | Content Type | Target Location | Rationale |
|-------------|--------------|-----------------|-----------|
| `1-content-placement/*` | Execution proposals | **DO NOT INTEGRATE** (execute first, then archive) | Active proposals, not reference docs |
| `2-quality-improvements/captains-log-review.md` | Quality improvement | **DO NOT INTEGRATE** (execute first, then archive) | Active proposal, not user-facing |
| `3-execution-planning/zero-risk-execution-strategy.md` | Execution pattern | `docs/guides/how-to/zero-risk-execution-pattern.md` | Reusable execution pattern for complex work |
| `3-execution-planning/hive-mind-capability-mapping.md` | Moved to collection 1 | See hive-mind-investigation mapping above | Already integrated |

**Integration Summary**:
- **1 file** → Permanent documentation (zero-risk pattern)
- **4 files** → Execute proposals, then archive
- **1 file** → Already moved to hive-mind collection

**New Files Created**:
1. `docs/guides/how-to/zero-risk-execution-pattern.md` (NEW)

**Category Impact**:
- **how-to/** → Gains execution pattern guide (systematic approach template)

---

### Collection 3: 2025-11-16-research-findings (INTEGRATED)

**Status**: 🔵 INTEGRATED
**Files**: 13 documents
**Purpose**: Integration testing session findings

#### Content Structure

```
2025-11-16-research-findings/
├── claude-flow-investigation/ (stock compliance research)
├── adaptive-pivot-protocol/ (protocol design)
└── broken-links-issue/ (problem definition)
```

#### Integration Status

**Already Integrated**:
- Integration testing guides → `docs/guides/how-to/integration-testing-guide.md` ✅
- Feature verification checklist → `docs/guides/reference/feature-verification-checklist.md` ✅
- Troubleshooting guide → `docs/guides/troubleshooting/troubleshooting-guide.md` ✅

**Remaining Content**:
- Claude-Flow investigation → **Archive only** (stock compliance confirmed, no user docs needed)
- Adaptive pivot protocol → **Future work** (protocol design deferred to future hive-mind)
- Broken links issue → **Executed & archived** (immediate fix applied)

**No Additional Integration Needed** - Collection ready for archival

---

## Part 3: Integration Recommendations

### Immediate Actions (High Value)

#### 1. Integrate Hive-Mind Investigation (60 min)

**Priority**: HIGH
**Rationale**: Fills critical gaps in concepts/ and how-to/ categories

**Steps**:
1. Create `docs/guides/concepts/hive-mind-system.md`
   - Source: `inbox/.../1-foundation/system-overview.md`
   - Synthesis: User-facing version (remove database forensics)
   - Focus: What hive-mind is, why it exists, core concepts

2. Create `docs/guides/how-to/choose-coordination-approach.md`
   - Source: `inbox/.../2-decision-framework/when-to-use.md`
   - Synthesis: Decision tree with examples
   - Focus: When to use hive-mind vs simpler coordination

3. Create `docs/guides/reference/hive-mind-quick-reference.md`
   - Source: `inbox/.../3-reference/quick-reference.md`
   - Keep as-is: Command reference for fast lookup

4. Create `docs/guides/reference/hive-mind-capability-mapping.md`
   - Source: `inbox/.../3-reference/capability-mapping.md`
   - Synthesis: Problem → solution mapping guide

5. Create `.claude/integrations/hive-mind/integration-guide.md`
   - Source: `inbox/.../2-decision-framework/recommendation.md`
   - Focus: Technical implementation details

6. Update `docs/guides/README.md`
   - Add hive-mind guides to index
   - Update concepts/ and how-to/ sections

**Outcome**:
- **concepts/** no longer empty (1 foundational guide)
- **how-to/** gains strategic decision guide
- **reference/** gains 2 hive-mind quick lookups
- Users can now discover and understand hive-mind coordination

#### 2. Integrate Zero-Risk Pattern (15 min)

**Priority**: MEDIUM
**Rationale**: Reusable execution pattern for complex work

**Steps**:
1. Create `docs/guides/how-to/zero-risk-execution-pattern.md`
   - Source: `inbox/.../3-execution-planning/zero-risk-execution-strategy.md`
   - Synthesis: Generalize from specific proposal to reusable pattern
   - Focus: 5-phase execution with HITL gates, rollback procedures

2. Update `docs/guides/README.md`
   - Add to how-to/ section

**Outcome**:
- Users have template for executing complex changes safely
- Pattern can be referenced by future proposals

### Future Opportunities (Lower Priority)

#### 3. Create Getting-Started Tutorial (Future)

**Gap**: No beginner onboarding content
**Opportunity**: Create "Your First Claude Flow Swarm" tutorial

**Potential content**:
- Setting up MCP servers
- Running first agent spawn
- Understanding coordination basics
- Testing integration health

**Source**: Could extract from integration-testing-guide.md and simplify

#### 4. Create Advanced Topics (Future)

**Gap**: No advanced usage patterns documented
**Opportunity**: Extract patterns from successful work

**Potential content**:
- Custom queen types
- Performance optimization strategies
- Scaling to 12+ agents
- Custom consensus mechanisms

**Source**: Would come from future session findings

---

## Part 4: Content Categorization Decision Tree

### For Future Content Placement

Use this decision tree when determining where new content should go:

```
Is content about USING the system?
├─ YES → docs/guides/
│  │
│  ├─ Is it explaining WHAT something is?
│  │  └─ YES → docs/guides/concepts/
│  │
│  ├─ Is it showing HOW to do a task?
│  │  └─ YES → docs/guides/how-to/
│  │
│  ├─ Is it a quick lookup or spec?
│  │  └─ YES → docs/guides/reference/
│  │
│  ├─ Is it fixing a problem?
│  │  └─ YES → docs/guides/troubleshooting/
│  │
│  ├─ Is it for beginners learning?
│  │  └─ YES → docs/guides/getting-started/
│  │
│  └─ Is it advanced/specialized?
│     └─ YES → docs/guides/advanced/
│
└─ NO → Is it DEVELOPING the system?
   └─ YES → inbox/assistant/YYYY-MM-DD-topic/
      │
      ├─ Research findings
      ├─ Architectural analysis
      ├─ Integration point discovery
      ├─ Problem definitions
      ├─ Execution proposals
      └─ Quality improvement recommendations
```

### Content Type Examples

**docs/guides/concepts/** (Understanding-Oriented):
- "What is the Hive-Mind System?"
- "Understanding Session Management"
- "Agent Coordination Architecture"
- Pattern: Explains the "why" and "what" without step-by-step instructions

**docs/guides/how-to/** (Task-Oriented):
- "How to Choose a Coordination Approach"
- "How to Test Integration Health"
- "How to Execute Complex Changes Safely"
- Pattern: Step-by-step procedures to accomplish specific tasks

**docs/guides/reference/** (Information-Oriented):
- "Hive-Mind Command Reference"
- "Feature Verification Checklist"
- "Temporal Research Collections Specification"
- Pattern: Quick lookups, tables, checklists, specifications

**docs/guides/troubleshooting/** (Problem-Oriented):
- "Common MCP Server Issues"
- "Hook System Failures"
- "Memory Operation Errors"
- Pattern: Error message → diagnosis → solution

**inbox/assistant/** (Research & Development):
- "Hive-Mind Investigation (2025-11-16)"
- "System Hygiene Check Proposals"
- "Integration Testing Findings"
- Pattern: Research artifacts, proposals, analysis requiring HITL review

---

## Part 5: Existing Content Quality Assessment

### Current docs/guides/ Files

**All 5 files are correctly placed**:

1. ✅ `docs/guides/README.md` - Navigation index (correct location)
2. ✅ `docs/guides/how-to/integration-testing-guide.md` - Task guide (correct category)
3. ✅ `docs/guides/reference/feature-verification-checklist.md` - Quick reference (correct category)
4. ✅ `docs/guides/reference/temporal-research-collections.md` - Framework spec (correct category)
5. ✅ `docs/guides/troubleshooting/troubleshooting-guide.md` - Problem solving (correct category)

**No misplaced content found** - Categorization analysis from system-hygiene-check already executed and confirmed proper placement.

---

## Part 6: Integration Execution Plan

### Phase 1: Hive-Mind Integration (60 min)

**Pre-work**:
- [ ] Create session for integration work: `/session-start hive-mind-docs-integration`
- [ ] Read all 4 source files from inbox
- [ ] Prepare synthesis approach for each target

**Execution**:
1. [ ] Create `docs/guides/concepts/hive-mind-system.md` (15 min)
2. [ ] Create `docs/guides/how-to/choose-coordination-approach.md` (15 min)
3. [ ] Create `docs/guides/reference/hive-mind-quick-reference.md` (10 min)
4. [ ] Create `docs/guides/reference/hive-mind-capability-mapping.md` (10 min)
5. [ ] Create `.claude/integrations/hive-mind/integration-guide.md` (10 min)

**Post-work**:
- [ ] Update `docs/guides/README.md` with new files (5 min)
- [ ] Test all internal links work
- [ ] Mark hive-mind-investigation collection as INTEGRATED
- [ ] Session closeout with verification

### Phase 2: Zero-Risk Pattern Integration (15 min)

**Pre-work**:
- [ ] Use existing session or create new one

**Execution**:
1. [ ] Create `docs/guides/how-to/zero-risk-execution-pattern.md` (10 min)
2. [ ] Update `docs/guides/README.md` (2 min)

**Post-work**:
- [ ] Test links
- [ ] Mark proposal as integrated

### Phase 3: Archive Collections (10 min)

**After integration complete**:
1. [ ] Move `2025-11-16-hive-mind-investigation/` → `.inbox/archive/assistant/`
2. [ ] Move `2025-11-16-system-hygiene-check/` → `.inbox/archive/assistant/` (after proposals executed)
3. [ ] Move `2025-11-16-research-findings/` → `.inbox/archive/assistant/` (already integrated)
4. [ ] Update `inbox/assistant/README.md` to reflect archival

**Result**: inbox/assistant/ clear, content in permanent locations

---

## Part 7: Success Criteria

### Integration Complete When:

**Documentation Structure**:
- [ ] concepts/ no longer empty (has hive-mind-system.md)
- [ ] how-to/ has 3 guides (integration-testing, coordination-choice, zero-risk-pattern)
- [ ] reference/ has 4 guides (checklist, TRC spec, hive-mind-quick-ref, capability-mapping)
- [ ] troubleshooting/ has 1 guide (existing)
- [ ] README.md indexes all new content

**Content Quality**:
- [ ] All guides follow Divio framework patterns
- [ ] No research artifacts in user-facing docs
- [ ] All internal links work
- [ ] Cross-references updated

**Handoff Workflow**:
- [ ] All READY-FOR-HANDOFF collections marked INTEGRATED
- [ ] Research artifacts archived to .inbox/archive/assistant/
- [ ] inbox/assistant/ only contains active work

**Verification**:
- [ ] User can navigate from README to all guides
- [ ] Hive-mind content discoverable and understandable
- [ ] Zero-risk pattern usable for future work
- [ ] No broken links in docs/

---

## Part 8: Risks & Mitigations

### Risk 1: Content Too Technical

**Risk**: Synthesized content may still be too detailed for user docs
**Mitigation**: Remove database forensics, implementation details; focus on "what" and "how"
**Test**: Can a new user understand without reading source code?

### Risk 2: Broken Cross-References

**Risk**: Moving content may break existing links
**Mitigation**: Search for all references before moving; update systematically
**Test**: `grep -r "hive-mind-investigation" docs/ .claude/ inbox/`

### Risk 3: Premature Integration

**Risk**: Proposals in system-hygiene-check need execution before archival
**Mitigation**: Only integrate reference materials (zero-risk-pattern); keep proposals in inbox until executed
**Test**: Verify proposals marked PENDING still in inbox

### Risk 4: Loss of Research Context

**Risk**: Archiving removes valuable context
**Mitigation**: Archive preserves full structure; can retrieve if needed
**Test**: Verify .inbox/archive/ contains complete collections

---

## Summary

**Current State**:
- docs/guides/ has solid structure (Divio framework) with 5 files
- inbox/assistant/ has 3 collections with 33 files ready for handoff
- 3 of 6 docs/guides/ categories are empty

**Recommended Integration**:
- **4 new concept/how-to/reference files** from hive-mind investigation
- **1 new how-to file** from system-hygiene-check
- **Total: 5 new user-facing guides**

**Impact**:
- Fills concepts/ gap (hive-mind fundamentals)
- Strengthens how-to/ (coordination decisions, execution patterns)
- Expands reference/ (hive-mind quick lookups)
- Makes hive-mind discoverable and understandable to users

**Next Action**:
Execute Phase 1 integration (60 min) to move hive-mind content from staging to permanent docs.

---

**Analysis Date**: 2025-11-16
**Analyst**: Code Quality Analyzer
**Status**: Ready for execution approval
