# Documentation Migration Plan
**Generated**: 2025-11-18
**Current Structure**: Diátaxis (tutorials, how-to, explanation, reference, internals)
**Target Structure**: Activity-Centric (organize, operate, understand, plan, explore)

---

## File Disposition Matrix

### ARCHIVE (Delete/Move to .swarm/backups/archived-docs/)
- `docs/guides-legacy-readme.md` - Superseded by docs/README.md
- `docs/tutorials/04-advanced/reasoning-bank.md` - Feature has 0 episodes (misleading)

### ORGANIZE (Setup & Configuration)
**Target**: `docs/organize/`
1. `docs/tutorials/01-foundations/first-session.md` → `docs/organize/first-session.md`
2. `docs/tutorials/01-foundations/workspace-tour.md` → `docs/organize/workspace-tour.md`
3. `docs/explanation/file-routing.md` → `docs/organize/file-routing.md`
4. `docs/explanation/session-management.md` → `docs/organize/session-management.md`
5. `docs/explanation/workspace-architecture.md` → `docs/organize/workspace-architecture.md`
6. `docs/reference/claude-flow-directory-management.md` → `docs/organize/directory-management.md`

### OPERATE (Day-to-Day Workflows)
**Target**: `docs/operate/`
1. `docs/tutorials/02-essential-skills/spawning-agents.md` → `docs/operate/spawning-agents.md`
2. `docs/tutorials/02-essential-skills/parallel-execution.md` → `docs/operate/parallel-execution.md`
3. `docs/tutorials/02-essential-skills/memory-coordination.md` → `docs/operate/memory-coordination.md`
4. `docs/tutorials/02-essential-skills/session-management.md` → `docs/operate/session-workflows.md`
5. `docs/how-to/operate-the-system.md` → `docs/operate/daily-workflows.md`
6. `docs/how-to/zero-risk-execution-pattern.md` → `docs/operate/zero-risk-execution.md`
7. `docs/how-to/integration-testing-guide.md` → `docs/operate/integration-testing.md`
8. `docs/reference/feature-verification-checklist.md` → `docs/operate/verification-checklist.md`

### UNDERSTAND (System Explanations)
**Target**: `docs/understand/`
1. `docs/tutorials/01-foundations/what-is-claude-flow.md` → `docs/understand/what-is-claude-flow.md`
2. `docs/tutorials/01-foundations/basic-memory-usage.md` → `docs/understand/memory-system.md`
3. `docs/explanation/hive-mind-system.md` → `docs/understand/hive-mind-system.md`
4. `docs/internals/README.md` → `docs/understand/system-internals.md`
5. `docs/internals/architecture-overview.md` → `docs/understand/architecture-overview.md`
6. `docs/internals/coordination-mechanics.md` → `docs/understand/coordination-mechanics.md`
7. `docs/internals/session-lifecycle.md` → `docs/understand/session-lifecycle.md`
8. `docs/internals/memory-architecture.md` → `docs/understand/memory-architecture.md`
9. `docs/internals/hooks-and-automation.md` → `docs/understand/hooks-automation.md`
10. `docs/internals/stock-vs-custom.md` → `docs/understand/stock-vs-custom.md`
11. `docs/internals/data-flow.md` → `docs/understand/data-flow.md`
12. `docs/internals/integration-points.md` → `docs/understand/integration-points.md`
13. `docs/internals/operational-architecture.md` → `docs/understand/operational-architecture.md`
14. `docs/reference/implementation-architecture.md` → `docs/understand/implementation-architecture.md`
15. `docs/troubleshooting/troubleshooting-guide.md` → `docs/understand/troubleshooting.md`

### PLAN (Strategic Guidance)
**Target**: `docs/plan/`
1. `docs/tutorials/03-intermediate/queen-selection.md` → `docs/plan/queen-selection.md`
2. `docs/tutorials/03-intermediate/swarm-topologies.md` → `docs/plan/swarm-topologies.md`
3. `docs/tutorials/03-intermediate/consensus-mechanisms.md` → `docs/plan/consensus-mechanisms.md`
4. `docs/tutorials/03-intermediate/custom-workflows.md` → `docs/plan/custom-workflows.md`
5. `docs/how-to/choose-coordination-approach.md` → `docs/plan/choose-coordination.md`
6. `docs/reference/hive-mind-reality-guide.md` → `docs/plan/hive-mind-reality.md`
7. `docs/reference/feature-reality-check.md` → `docs/plan/feature-reality-check.md`
8. `docs/reference/hive-mind-quick-reference.md` → `docs/plan/quick-reference.md`
9. `docs/reference/template-usage-guide.md` → `docs/plan/template-usage.md`

### EXPLORE (Research & Experimentation)
**Target**: `docs/explore/`
1. `docs/tutorials/04-advanced/adaptive-topology.md` → `docs/explore/adaptive-topology.md`
2. `docs/tutorials/04-advanced/byzantine-consensus.md` → `docs/explore/byzantine-consensus.md`
3. `docs/tutorials/04-advanced/hive-mind-coordination.md` → `docs/explore/hive-mind-advanced.md`
4. `docs/advanced/adaptive-pivot-protocol.md` → `docs/explore/adaptive-pivot-protocol.md`

### UPDATE IN PLACE (Special Files)
1. `docs/README.md` - Update to reflect Activity-Centric structure
2. `docs/explanation/README.md` - Add redirect note to understand/
3. `docs/tutorials/README.md` - Add redirect note
4. `docs/tutorials/00-start-here.md` - Update paths to Activity-Centric
5. `docs/tutorials/progress-tracker.md` - Update paths
6. `docs/tutorials/01-foundations/README.md` - Add redirect
7. `docs/tutorials/02-essential-skills/README.md` - Add redirect
8. `docs/tutorials/03-intermediate/README.md` - Add redirect
9. `docs/tutorials/04-advanced/README.md` - Add redirect

---

## Migration Summary

**Total Files**: 53
- **Archive**: 2 files
- **Organize**: 6 files
- **Operate**: 8 files
- **Understand**: 15 files
- **Plan**: 9 files
- **Explore**: 4 files
- **Update in place**: 9 files

**Actions Required**:
1. Create archive directory
2. Move 2 files to archive with git
3. Move 42 files to new locations with git (preserves history)
4. Update 9 files with redirects/new content
5. Create 5 category README.md files
6. Update cross-references (automated scan for broken links)
7. Update .claude/skills/tutor-mode/skill.md with new paths

---

## Implementation Commands

```bash
# Archive misleading docs
git mv docs/guides-legacy-readme.md .swarm/backups/archived-docs/
git mv docs/tutorials/04-advanced/reasoning-bank.md .swarm/backups/archived-docs/

# Move to organize/
git mv docs/tutorials/01-foundations/first-session.md docs/organize/first-session.md
git mv docs/tutorials/01-foundations/workspace-tour.md docs/organize/workspace-tour.md
git mv docs/explanation/file-routing.md docs/organize/file-routing.md
git mv docs/explanation/session-management.md docs/organize/session-management.md
git mv docs/explanation/workspace-architecture.md docs/organize/workspace-architecture.md
git mv docs/reference/claude-flow-directory-management.md docs/organize/directory-management.md

# Move to operate/
git mv docs/tutorials/02-essential-skills/spawning-agents.md docs/operate/spawning-agents.md
git mv docs/tutorials/02-essential-skills/parallel-execution.md docs/operate/parallel-execution.md
git mv docs/tutorials/02-essential-skills/memory-coordination.md docs/operate/memory-coordination.md
git mv docs/tutorials/02-essential-skills/session-management.md docs/operate/session-workflows.md
git mv docs/how-to/operate-the-system.md docs/operate/daily-workflows.md
git mv docs/how-to/zero-risk-execution-pattern.md docs/operate/zero-risk-execution.md
git mv docs/how-to/integration-testing-guide.md docs/operate/integration-testing.md
git mv docs/reference/feature-verification-checklist.md docs/operate/verification-checklist.md

# Move to understand/
git mv docs/tutorials/01-foundations/what-is-claude-flow.md docs/understand/what-is-claude-flow.md
git mv docs/tutorials/01-foundations/basic-memory-usage.md docs/understand/memory-system.md
git mv docs/explanation/hive-mind-system.md docs/understand/hive-mind-system.md
git mv docs/internals/README.md docs/understand/system-internals.md
git mv docs/internals/architecture-overview.md docs/understand/architecture-overview.md
git mv docs/internals/coordination-mechanics.md docs/understand/coordination-mechanics.md
git mv docs/internals/session-lifecycle.md docs/understand/session-lifecycle.md
git mv docs/internals/memory-architecture.md docs/understand/memory-architecture.md
git mv docs/internals/hooks-and-automation.md docs/understand/hooks-automation.md
git mv docs/internals/stock-vs-custom.md docs/understand/stock-vs-custom.md
git mv docs/internals/data-flow.md docs/understand/data-flow.md
git mv docs/internals/integration-points.md docs/understand/integration-points.md
git mv docs/internals/operational-architecture.md docs/understand/operational-architecture.md
git mv docs/reference/implementation-architecture.md docs/understand/implementation-architecture.md
git mv docs/troubleshooting/troubleshooting-guide.md docs/understand/troubleshooting.md

# Move to plan/
git mv docs/tutorials/03-intermediate/queen-selection.md docs/plan/queen-selection.md
git mv docs/tutorials/03-intermediate/swarm-topologies.md docs/plan/swarm-topologies.md
git mv docs/tutorials/03-intermediate/consensus-mechanisms.md docs/plan/consensus-mechanisms.md
git mv docs/tutorials/03-intermediate/custom-workflows.md docs/plan/custom-workflows.md
git mv docs/how-to/choose-coordination-approach.md docs/plan/choose-coordination.md
git mv docs/reference/hive-mind-reality-guide.md docs/plan/hive-mind-reality.md
git mv docs/reference/feature-reality-check.md docs/plan/feature-reality-check.md
git mv docs/reference/hive-mind-quick-reference.md docs/plan/quick-reference.md
git mv docs/reference/template-usage-guide.md docs/plan/template-usage.md

# Move to explore/
git mv docs/tutorials/04-advanced/adaptive-topology.md docs/explore/adaptive-topology.md
git mv docs/tutorials/04-advanced/byzantine-consensus.md docs/explore/byzantine-consensus.md
git mv docs/tutorials/04-advanced/hive-mind-coordination.md docs/explore/hive-mind-advanced.md
git mv docs/advanced/adaptive-pivot-protocol.md docs/explore/adaptive-pivot-protocol.md
```

---

## Cross-Reference Update Strategy

**Automated scan**:
```bash
# Find all markdown links to old paths
grep -r "\[.*\](.*docs/tutorials\|docs/how-to\|docs/reference\|docs/internals\|docs/advanced\|docs/troubleshooting" docs/ --include="*.md"

# Replace patterns:
# docs/tutorials/01-foundations/ → docs/organize/
# docs/tutorials/02-essential-skills/ → docs/operate/
# docs/tutorials/03-intermediate/ → docs/plan/
# docs/tutorials/04-advanced/ → docs/explore/
# docs/how-to/ → docs/operate/ or docs/plan/
# docs/reference/ → docs/plan/ or docs/understand/
# docs/internals/ → docs/understand/
# docs/explanation/ → docs/organize/ or docs/understand/
# docs/troubleshooting/ → docs/understand/
# docs/advanced/ → docs/explore/
```

**Manual verification**:
- Check tutor-mode skill.md references
- Check CLAUDE.md references
- Check inbox README files
- Check session artifacts that reference docs

---

## Success Criteria

- [x] All 53 files accounted for
- [ ] 2 files archived
- [ ] 42 files moved to Activity-Centric structure
- [ ] 9 files updated with redirects
- [ ] 5 category README.md files created
- [ ] Cross-references updated (0 broken links)
- [ ] Tutor-mode integration updated
- [ ] Git history preserved for all moves
- [ ] Navigation tested from docs/README.md
