# Architecture Design Summary

**Session**: session-20251117-233107-workspace-docs-optimization
**Role**: Structure Architect
**Status**: ✅ Design Complete

---

## TL;DR

The docs/ folder is **already well-structured** using Diátaxis. The optimization is about **completing it**, not restructuring it.

**Key Actions**:
1. ✅ Create getting-started/ (new users need an entry point)
2. ✅ Promote tutor-mode tutorials from session artifacts to docs/tutorials/
3. ✅ Expand reference/ with agents catalog, MCP tools, commands
4. ✅ Organize how-to/ with subdirectories (sessions, agents, memory)
5. ✅ Create projects/ with examples and templates
6. ✅ Archive old content (guides-legacy-readme.md)

**What NOT to Do**:
- ❌ Don't create root-level projects/ folder
- ❌ Don't restructure Diátaxis categories
- ❌ Don't delete content without archiving first
- ❌ Don't mix documentation purposes (tutorials ≠ how-to ≠ explanation ≠ reference)

---

## Current State: 35% Complete

**What's Working**:
- ✅ docs/README.md - Excellent Diátaxis framework implementation
- ✅ explanation/ - 4 well-written docs (workspace-architecture, session-management, file-routing, hive-mind)
- ✅ internals/ - 6 comprehensive technical docs
- ✅ Diátaxis structure in place (tutorials/, how-to/, explanation/, reference/, internals/)

**Critical Gaps**:
- ❌ getting-started/ - Empty (no onboarding for complete beginners)
- ❌ tutorials/ - 23 files exist in subdirs but not promoted to permanent docs
- ❌ reference/ - Missing agent catalog (54 agents), MCP tools, commands
- ❌ how-to/ - Only 4 guides, needs 5x expansion
- ❌ projects/ - Empty (no examples or templates)

---

## Optimized Structure

### Root Level (NO CHANGES)

```
common-thread-sandbox/
├── docs/              ← Documentation hub (optimized)
├── sessions/          ← Per-chat workspaces (unchanged)
├── inbox/             ← Cross-session communication (unchanged)
├── .claude/           ← Configuration (unchanged)
├── .swarm/            ← Infrastructure (unchanged)
└── [root files]       ← CLAUDE.md, README.md, etc. (unchanged)
```

**Decision**: NO root-level projects/ folder. Projects belong in docs/projects/ as reference material.

---

### docs/ Structure (OPTIMIZED)

```
docs/
├── getting-started/              🆕 NEW (5 files)
├── tutorials/                    🆕 EXPAND (promote from session artifacts)
│   ├── 00-start-here.md         🆕
│   ├── 01-foundations/          🆕 (from tutor-mode)
│   ├── 02-essential-skills/     🆕 (from tutor-mode)
│   ├── 03-intermediate/         🆕 (from tutor-mode)
│   └── 04-advanced/             🆕 (from tutor-mode)
├── how-to/                       🆕 ORGANIZE (add subdirectories)
│   ├── sessions/                🆕 (4 guides)
│   ├── agents/                  🆕 (4 guides)
│   ├── memory/                  🆕 (4 guides)
│   └── troubleshooting/         🆕 (4 guides)
├── explanation/                  ✅ EXPAND (add 4 more docs)
├── reference/                    🆕 COMPLETE (add subdirectories)
│   ├── commands/                🆕 (CLI reference)
│   ├── agents/                  🆕 (54 agent catalog)
│   └── mcp-tools/               🆕 (MCP tool reference)
├── internals/                    ✅ EXPAND (add 4 more docs)
├── projects/                     🆕 CREATE (examples + templates)
│   ├── examples/                🆕 (3 example projects)
│   └── templates/               🆕 (3 starter templates)
├── advanced/                     ✅ EXPAND (add 2+ more docs)
├── troubleshooting/              🆕 EXPAND (add subdirectories)
└── .archive/                     🧹 CLEANUP (review + archive)
```

---

## Migration Plan (6 Phases, 4-8 Hours)

### Phase 1: Structure Creation (30 min)
- Create new directories
- Create placeholder READMEs

### Phase 2: Content Promotion (1-2 hours)
- Promote tutor-mode learning materials to docs/tutorials/
- Update internal links
- Update tutor-mode SKILL.md references

### Phase 3: Content Creation (2-4 hours)
- Write getting-started/ (5 files)
- Write reference docs (agents, commands, MCP tools)
- Write how-to guides (sessions, agents, memory)
- Create example projects and templates

### Phase 4: Archive Cleanup (30 min)
- Move guides-legacy-readme.md to .archive/
- Review and cleanup docs/.archive/

### Phase 5: Navigation Updates (30 min)
- Update docs/README.md
- Update CLAUDE.md
- Update tutor-mode SKILL.md

### Phase 6: Verification (30 min)
- Check all links work
- Test learning path flow
- Verify reference completeness

---

## Key Design Decisions

### 1. NO Root projects/ Folder
**Why**: Keep root clean. Projects are documentation (templates/examples), not active development. Active work belongs in `sessions/<session-id>/artifacts/code/`.

### 2. Preserve Diátaxis Structure
**Why**: Already excellent and follows best practices. Users know this structure. Breaking it would cause confusion.

### 3. Integrate tutor-mode Learning Path
**Why**: Learning phases (01-foundations, 02-essential-skills, etc.) ARE tutorials. Currently in session artifacts (ephemeral). Should be permanent in docs/tutorials/.

### 4. Expand How-To with Subdirectories
**Why**: Will grow to 20+ guides. Flat structure hard to navigate. Subdirectories group related tasks (sessions, agents, memory, troubleshooting).

### 5. Complete Reference Documentation
**Why**: Users need quick lookups for 54 agent types, 70+ MCP tools, CLI commands. Currently missing critical references.

### 6. Archive Old Content, Don't Delete
**Why**: guides-legacy-readme.md has historical value. Safer to archive than delete (can recover if needed).

---

## Navigation Flows

### New User Path
```
docs/README.md
  → "I'm New Here"
    → getting-started/README.md
      → installation.md
      → quick-start-5-min.md
      → key-concepts.md
      → next-steps.md
    → tutorials/01-foundations/
      → [learning path: 01 → 02 → 03 → 04]
```

### Task-Oriented User Path
```
docs/README.md
  → "I Have a Specific Task"
    → how-to/README.md
      → Choose: sessions/ | agents/ | memory/ | troubleshooting/
        → Specific guide
```

### Quick Lookup Path
```
docs/README.md
  → "I Need Quick Facts"
    → reference/README.md
      → Choose: commands/ | agents/ | mcp-tools/ | [standalone]
        → Specific reference
```

---

## Coverage Analysis

### By Diátaxis Type

| Type | Current | Target | Completeness |
|------|---------|--------|--------------|
| Getting Started | 0 | 5 | 0% → 100% |
| Tutorials | 23 | 25+ | 92% → 100% |
| How-to | 4 | 20+ | 20% → 100% |
| Explanation | 4 | 8+ | 50% → 100% |
| Reference | 3 | 15+ | 20% → 100% |
| Internals | 6 | 10+ | 60% → 100% |
| Projects | 0 | 10+ | 0% → 100% |

**Overall**: 35% → 90%+

### Critical Gaps (Must Fill)

1. **getting-started/** - Completely empty
2. **tutorials/** root - Entry point missing
3. **reference/agents/** - No agent catalog
4. **reference/commands/** - No CLI reference
5. **reference/mcp-tools/** - No MCP tool reference
6. **projects/** - Empty

---

## Evidence of Quality

### Diátaxis Adherence
✅ Maintains separation of concerns (tutorials ≠ how-to ≠ explanation ≠ reference)
✅ Clear purpose for each folder
✅ No mixing of purposes
✅ Industry-standard framework

### User-Centric Design
✅ Multiple entry points for all personas
✅ Progressive disclosure (getting-started → tutorials → advanced)
✅ Cross-references between doc types
✅ Clear navigation flows

### Scalability
✅ Subdirectories for grouping (can grow to 100+ docs)
✅ Clear categorization rules
✅ Self-documenting structure (README.md in every directory)

### Maintainability
✅ Stock framework (no custom invention)
✅ Clear archive strategy
✅ Easy for contributors to understand where content goes

---

## Recommendations

### Immediate (Week 1)
1. Create directory structure
2. Promote tutor-mode materials
3. Write getting-started/ content
4. Write critical reference docs

### Short-term (Week 2-3)
5. Write how-to guides
6. Create example projects
7. Create starter templates
8. Expand troubleshooting

### Medium-term (Month 2)
9. Write missing explanations
10. Expand internals
11. Add advanced topics
12. Create tutorial exercises

### Long-term (Ongoing)
13. User-contributed examples
14. Community templates
15. Translated documentation

---

## Success Criteria

**User Feedback**:
- "I found what I needed in < 2 minutes"
- "The learning path was clear"
- "Examples helped me understand"

**Objective Metrics**:
- 90%+ docs have clear purpose
- 0 broken links
- 100% coverage of critical gaps
- 3+ example projects
- 3+ starter templates

---

## Conclusion

This is NOT a restructure - it's a **completion and cleanup** of an already well-designed Diátaxis system.

**Key Insight**: The docs/ folder structure is excellent. The optimization is filling the gaps, not changing the design.

**Next Step**: User approval → Implementation (6 phases, 4-8 hours)

---

**Full Details**: See [OPTIMIZED-ARCHITECTURE.md](./OPTIMIZED-ARCHITECTURE.md) (comprehensive 500+ line design document)

**Memory**: Stored at `workspace-optimization-20251117/architecture/optimized-design`

**Status**: ✅ Design Complete - Ready for Implementation
