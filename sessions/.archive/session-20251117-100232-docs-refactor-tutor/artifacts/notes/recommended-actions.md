# Recommended Actions - Documentation Consolidation

**Date**: 2025-11-17
**Priority Order**: High → Medium → Low
**Estimated Effort**: 4 hours total

---

## CRITICAL ACTIONS (Do First)

### Action 1: Create Full Backup

**Priority**: ⚠️ CRITICAL - Do this BEFORE anything else

```bash
# Create archive directory
mkdir -p .archive/docs-migration-20251117/

# Full state backup
cp -r docs/ .archive/docs-migration-20251117/docs-before-consolidation/

# Create temporal artifacts directory
mkdir -p .archive/docs-migration-20251117/temporal-artifacts/

# Git checkpoint
git add -A
git commit -m "Pre-migration backup: Complete docs/ state before consolidation"
```

**Verification**:
```bash
# Verify backup exists
ls -la .archive/docs-migration-20251117/docs-before-consolidation/

# Should show 67 markdown files
find .archive/docs-migration-20251117/docs-before-consolidation/ -name "*.md" | wc -l
```

**Do NOT proceed** until backup verified.

---

## HIGH PRIORITY ACTIONS

### Action 2: Archive Temporal Artifacts

**Priority**: 🔴 HIGH
**Effort**: 15 minutes
**Impact**: Immediate cleanup of 12 polluting files

**Execute**:
```bash
cd docs/guides/reference/

# Archive research/investigation docs (7 files)
mv temporal-research-collections.md ../../../.archive/docs-migration-20251117/temporal-artifacts/
mv session-management-research.md ../../../.archive/docs-migration-20251117/temporal-artifacts/
mv session-protocol-gap-analysis.md ../../../.archive/docs-migration-20251117/temporal-artifacts/
mv meta-research-mission.md ../../../.archive/docs-migration-20251117/temporal-artifacts/
mv adaptive-queen-proposal.md ../../../.archive/docs-migration-20251117/temporal-artifacts/
mv categorization-test-results.md ../../../.archive/docs-migration-20251117/temporal-artifacts/
mv feature-reality-check.md ../../../.archive/docs-migration-20251117/temporal-artifacts/

# Archive change logs (5 files)
mv closeout-sh-changes.md ../../../.archive/docs-migration-20251117/temporal-artifacts/
mv file-routing-changes.md ../../../.archive/docs-migration-20251117/temporal-artifacts/
mv session-mgmt-changes.md ../../../.archive/docs-migration-20251117/temporal-artifacts/
mv session-fix-patch.md ../../../.archive/docs-migration-20251117/temporal-artifacts/
mv skill-md-changes.md ../../../.archive/docs-migration-20251117/temporal-artifacts/

cd ../../..
```

**Verification**:
```bash
# Should show 12 files
ls .archive/docs-migration-20251117/temporal-artifacts/ | wc -l

# Should show 7 files left (down from 19)
ls docs/guides/reference/*.md | wc -l
```

**Commit**:
```bash
git add -A
git commit -m "Archive temporal artifacts from docs/guides/reference/"
```

---

### Action 3: Relocate Misplaced Files

**Priority**: 🔴 HIGH
**Effort**: 10 minutes
**Impact**: Proper categorization

**Execute**:
```bash
# Move technical docs to internals (2 files)
mv docs/guides/reference/claude-flow-directory-management.md docs/internals/system/directory-management.md
mv docs/guides/reference/implementation-architecture.md docs/internals/system/implementation-details.md

# Move how-to guide (1 file)
mv docs/guides/reference/template-usage-guide.md docs/guides/how-to/use-templates.md

# Merge concepts into explanation (1 file)
mv docs/guides/concepts/hive-mind-system.md docs/explanation/

# Promote advanced to explanation (1 file)
mv docs/guides/advanced/adaptive-pivot-protocol.md docs/explanation/
```

**Verification**:
```bash
# guides/reference/ should have 4 files left
ls docs/guides/reference/*.md | wc -l

# internals/system/ should have 10 files (was 8)
ls docs/internals/system/*.md | wc -l

# how-to/ should have 4 files (was 3)
ls docs/guides/how-to/*.md | wc -l

# explanation/ should have 6 files (was 4)
ls docs/explanation/*.md | wc -l
```

**Commit**:
```bash
git add -A
git commit -m "Relocate misplaced docs to correct categories"
```

---

### Action 4: Flatten Directory Structure

**Priority**: 🔴 HIGH
**Effort**: 15 minutes
**Impact**: Diátaxis compliance

**Execute**:
```bash
# Create top-level categories
mkdir -p docs/how-to
mkdir -p docs/reference
mkdir -p docs/troubleshooting

# Move from guides/ to top-level
mv docs/guides/how-to/* docs/how-to/
mv docs/guides/reference/* docs/reference/
mv docs/guides/troubleshooting/* docs/troubleshooting/

# Remove empty guides/ structure
rmdir docs/guides/how-to
rmdir docs/guides/reference
rmdir docs/guides/concepts
rmdir docs/guides/advanced
rmdir docs/guides/troubleshooting
rmdir docs/guides/getting-started  # Already empty
rmdir docs/guides
```

**Verification**:
```bash
# guides/ directory should not exist
ls docs/guides 2>&1 | grep "No such file"

# Top-level categories should exist
ls docs/ | grep -E "^(tutorials|how-to|explanation|reference|troubleshooting|internals)$"

# Should show 6 directories
ls -d docs/*/ | wc -l
```

**Commit**:
```bash
git add -A
git commit -m "Flatten structure: Remove guides/ wrapper, promote categories to top-level"
```

---

## MEDIUM PRIORITY ACTIONS

### Action 5: Update Cross-References (Automated)

**Priority**: 🟡 MEDIUM
**Effort**: 30 minutes
**Impact**: Fix 200+ links

**Execute**:
```bash
# Update guides/how-to/ → how-to/
find docs -name "*.md" -exec sed -i '' 's|guides/how-to/|how-to/|g' {} \;
find docs -name "*.md" -exec sed -i '' 's|\.\./guides/how-to/|../how-to/|g' {} \;

# Update guides/reference/ → reference/
find docs -name "*.md" -exec sed -i '' 's|guides/reference/|reference/|g' {} \;
find docs -name "*.md" -exec sed -i '' 's|\.\./guides/reference/|../reference/|g' {} \;

# Update guides/concepts/ → explanation/
find docs -name "*.md" -exec sed -i '' 's|guides/concepts/|explanation/|g' {} \;
find docs -name "*.md" -exec sed -i '' 's|\.\./guides/concepts/|../explanation/|g' {} \;

# Update guides/advanced/ → explanation/
find docs -name "*.md" -exec sed -i '' 's|guides/advanced/|explanation/|g' {} \;

# Update guides/troubleshooting/ → troubleshooting/
find docs -name "*.md" -exec sed -i '' 's|guides/troubleshooting/|troubleshooting/|g' {} \;
find docs -name "*.md" -exec sed -i '' 's|\.\./guides/troubleshooting/|../troubleshooting/|g' {} \;
```

**Verification**:
```bash
# Should find zero occurrences of "guides/reference/"
grep -r "guides/reference/" docs/ && echo "LINKS STILL BROKEN" || echo "All links updated"

# Should find zero occurrences of "guides/how-to/"
grep -r "guides/how-to/" docs/ && echo "LINKS STILL BROKEN" || echo "All links updated"
```

**Commit**:
```bash
git add -A
git commit -m "Update cross-references after directory restructuring"
```

---

### Action 6: Update README Files

**Priority**: 🟡 MEDIUM
**Effort**: 45 minutes
**Impact**: Navigation coherence

**Files to Update** (6 total):

#### 6.1: Update docs/README.md

**Changes needed**:
- Update paths from `guides/how-to/` → `how-to/`
- Update paths from `guides/reference/` → `reference/`
- Update paths from `guides/troubleshooting/` → `troubleshooting/`
- Update file count (67 → 52)

**Key sections**:
- Line 120: `├── how-to/` (was guides/how-to/)
- Line 139: `├── reference/` (was guides/reference/)
- Line 163: `└── internals/` (keep)

#### 6.2: Update docs/tutorials/README.md

**Changes needed**:
- Remove "no tutorials created yet" claim (line 50)
- Add proper tutorial inventory
- Update cross-references to other categories

#### 6.3: Update docs/explanation/README.md

**Changes needed**:
- Add new files: hive-mind-system.md, adaptive-pivot-protocol.md
- Update navigation table
- Update cross-references

#### 6.4: Update docs/internals/README.md

**Changes needed**:
- Add: directory-management.md
- Add: implementation-details.md
- Update file count

#### 6.5: Create docs/how-to/README.md

**New file** - Create navigation index:
```markdown
# How-to Guides

Task-oriented guides for accomplishing specific goals.

## Available Guides

- [Choose Coordination Approach](choose-coordination-approach.md)
- [Integration Testing Guide](integration-testing-guide.md)
- [Zero-Risk Execution Pattern](zero-risk-execution-pattern.md)
- [Use Templates](use-templates.md)
```

#### 6.6: Create docs/reference/README.md

**New file** - Create navigation index:
```markdown
# Reference

Quick lookups and fact-based information.

## Available References

- [Feature Verification Checklist](feature-verification-checklist.md)
- [Hive-Mind Quick Reference](hive-mind-quick-reference.md)
- [Hive-Mind Capability Mapping](hive-mind-capability-mapping.md)
```

#### 6.7: Create docs/troubleshooting/README.md

**New file** - Create navigation index:
```markdown
# Troubleshooting

Solutions to common problems and debugging guides.

## Available Guides

- [Troubleshooting Guide](troubleshooting-guide.md) - Comprehensive problem-solving reference
```

#### 6.8: Delete docs/guides/README.md

**No longer needed** after structure flattening.

```bash
rm docs/guides/README.md
```

**Commit**:
```bash
git add -A
git commit -m "Update README files with new structure and navigation"
```

---

### Action 7: Add Redirect Notes

**Priority**: 🟡 MEDIUM
**Effort**: 15 minutes
**Impact**: User transition support

**Create**: `docs/MIGRATION-NOTICE.md`

```markdown
# Documentation Migration Notice

**Date**: 2025-11-17

## Structure Changed

Documentation has been reorganized to follow Diátaxis framework strictly.

### What Changed

**Before**:
```
docs/guides/
├── how-to/
├── reference/
├── concepts/
└── troubleshooting/
```

**After**:
```
docs/
├── how-to/           (was guides/how-to/)
├── reference/        (was guides/reference/)
├── explanation/      (merged guides/concepts/ + guides/advanced/)
└── troubleshooting/  (was guides/troubleshooting/)
```

### Quick Migration Guide

| Old Path | New Path |
|----------|----------|
| `docs/guides/how-to/X.md` | `docs/how-to/X.md` |
| `docs/guides/reference/X.md` | `docs/reference/X.md` |
| `docs/guides/concepts/X.md` | `docs/explanation/X.md` |
| `docs/guides/troubleshooting/X.md` | `docs/troubleshooting/X.md` |

### Archived Files

12 temporal research artifacts archived to:
`.archive/docs-migration-20251117/temporal-artifacts/`

These were research notes, change logs, and proposals - not permanent documentation.
```

**Update CLAUDE.md** with new paths (search/replace):
```bash
# In CLAUDE.md
sed -i '' 's|docs/guides/how-to/|docs/how-to/|g' CLAUDE.md
sed -i '' 's|docs/guides/reference/|docs/reference/|g' CLAUDE.md
```

**Commit**:
```bash
git add -A
git commit -m "Add migration notice and update CLAUDE.md paths"
```

---

## LOW PRIORITY ACTIONS

### Action 8: Split Large Reference File

**Priority**: 🔵 LOW (future work)
**Effort**: 1-2 hours
**Impact**: Better reference usability

**Target**: `docs/reference/hive-mind-reality-guide.md` (37K)

**Problem**: Too large for quick reference, contains both explanation and reference material

**Recommendation**:
1. Split conceptual content → `docs/explanation/hive-mind-detailed.md`
2. Keep quick-reference parts → `docs/reference/hive-mind-quick-reference.md` (enhance existing)

**Not urgent** - can be done in future refactoring.

---

### Action 9: Install Link Checker

**Priority**: 🔵 LOW
**Effort**: 10 minutes
**Impact**: Prevent future link rot

```bash
npm install -g markdown-link-check

# Create check script
cat > scripts/check-docs-links.sh << 'EOF'
#!/bin/bash
find docs -name "*.md" -exec markdown-link-check {} \;
EOF

chmod +x scripts/check-docs-links.sh

# Run
./scripts/check-docs-links.sh
```

**Add to CI** (if applicable):
```yaml
# .github/workflows/docs-check.yml
name: Check Documentation Links
on: [push, pull_request]
jobs:
  link-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install -g markdown-link-check
      - run: find docs -name "*.md" -exec markdown-link-check {} \;
```

---

### Action 10: Document File Routing for Docs

**Priority**: 🔵 LOW
**Effort**: 30 minutes
**Impact**: Future contributor clarity

**Create**: `docs/CONTRIBUTING.md`

```markdown
# Contributing to Documentation

## Where Does New Documentation Go?

Use the **Diátaxis framework** to determine placement:

### Ask Yourself: What's the Purpose?

**Learning by doing?** → `docs/tutorials/`
- Step-by-step lessons
- Hands-on exercises
- Complete examples

**Solving a specific problem?** → `docs/how-to/`
- Task-oriented recipes
- "How do I...?" guides
- Assume reader knows basics

**Understanding concepts?** → `docs/explanation/`
- Theory and background
- "Why does it work this way?"
- Design decisions

**Looking up facts?** → `docs/reference/`
- Quick lookups
- Checklists
- Command references
- API documentation

**Technical implementation?** → `docs/internals/`
- System architecture
- Deep technical details
- For developers/debuggers

## File Naming

- Use kebab-case: `my-new-guide.md`
- Be descriptive: `session-management.md` not `sessions.md`
- Match purpose: `how-to-debug-agents.md` not `debugging.md`

## Cross-References

Always use relative paths:
```markdown
See: [Session Management](../explanation/session-management.md)
```

## Don't Mix Purposes!

❌ Don't put explanations in how-to guides
❌ Don't put step-by-step in reference
❌ Don't put tutorials in explanation
✅ Link between categories instead
```

---

## VERIFICATION CHECKLIST

### After All Actions Complete

Run this checklist to verify success:

```bash
# 1. File count reduced
find docs -name "*.md" | wc -l
# Expected: ~52 (was 67)

# 2. No guides/ directory
ls docs/guides 2>&1 | grep "No such file"
# Expected: "No such file or directory"

# 3. Top-level categories exist
ls docs/ | grep -E "^(tutorials|how-to|explanation|reference|troubleshooting|internals)$" | wc -l
# Expected: 6

# 4. Archive exists
ls .archive/docs-migration-20251117/temporal-artifacts/ | wc -l
# Expected: 12

# 5. No broken guides/ links
grep -r "guides/reference/" docs/ && echo "FAILED" || echo "PASSED"
grep -r "guides/how-to/" docs/ && echo "FAILED" || echo "PASSED"
grep -r "guides/concepts/" docs/ && echo "FAILED" || echo "PASSED"

# 6. Git clean
git status --short | wc -l
# Expected: 0 (all committed)
```

### Success Criteria

- ✅ All temporal artifacts archived (12 files)
- ✅ Diátaxis categories at top-level (not under guides/)
- ✅ All cross-references functional
- ✅ README files updated
- ✅ CLAUDE.md updated with new paths
- ✅ Migration notice created
- ✅ Git commits at each phase

---

## ROLLBACK PROCEDURE

**If something goes wrong**:

```bash
# 1. Stop immediately
# Don't make more changes

# 2. Restore from backup
rm -rf docs/
cp -r .archive/docs-migration-20251117/docs-before-consolidation/ docs/

# 3. Verify restoration
find docs -name "*.md" | wc -l
# Should be 67 (original count)

# 4. Reset git
git reset --hard HEAD~N  # N = number of commits since backup
```

**Prevention**: Git commit after each action!

---

## TIMELINE ESTIMATE

**Total Time**: ~4 hours

| Action | Time | Dependencies |
|--------|------|--------------|
| 1. Backup | 5 min | None |
| 2. Archive temporal | 15 min | Action 1 |
| 3. Relocate files | 10 min | Action 2 |
| 4. Flatten structure | 15 min | Action 3 |
| 5. Update cross-refs | 30 min | Action 4 |
| 6. Update READMEs | 45 min | Action 5 |
| 7. Add redirects | 15 min | Action 6 |
| 8-10. Low priority | 2+ hrs | Optional |

**Recommended approach**: Do actions 1-7 in one session (2 hours), defer 8-10 for future.

---

## FINAL RECOMMENDATION

**Execute in this order**:

1. ⚠️ **CRITICAL**: Create backup (Action 1)
2. 🔴 **HIGH**: Archive temporal artifacts (Action 2)
3. 🔴 **HIGH**: Relocate misplaced files (Action 3)
4. 🔴 **HIGH**: Flatten structure (Action 4)
5. 🟡 **MEDIUM**: Update cross-references (Action 5)
6. 🟡 **MEDIUM**: Update READMEs (Action 6)
7. 🟡 **MEDIUM**: Add redirect notes (Action 7)
8. 🔵 **LOW**: Future improvements (Actions 8-10)

**Git commits**: After EACH action for safe rollback points.

**Verification**: Run checklist after actions 1-7 complete.

---

**End of Recommendations**
