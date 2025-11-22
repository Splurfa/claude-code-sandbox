# ISSUE-004: Documentation Link Breakage After Restructures

**Status**: In Progress
**Type**: Process
**Priority**: Medium
**Root Cause**: System (no automated link validation)
**Created**: 2025-11-21
**Updated**: 2025-11-21
**Resolved**: N/A

## Problem Statement

Documentation restructures frequently break internal links. After the lifecycle-based documentation reorganization, 62 out of 96 links (64.5%) were broken, requiring manual detection and fixing.

## Evidence

**Captain's Log**:
- `sessions/captains-log/2025-11-18.md`:
  > "Documentation link breakage: 62/96 broken (64.5% failure rate)"
  > "Top offenders: orientation.md (19 broken), troubleshooting.md (16 broken)"

**Session Work**:
- `session-20251118-231539-outstanding-fixes/`: 30-minute quick fix improved 36% → 70% success rate
- Still 28 broken links remaining

**Root Cause**:
- Documentation restructure moved files (learning-path → lifecycle organization)
- Cross-references not updated automatically
- No validation in CI/CD to catch breaks

## Root Cause Analysis

**Why Links Break**:

1. **File Moves**: Restructure moves `docs/setup/getting-started.md` → `docs/setup/quick-start.md`
2. **No Update Pass**: References to old path not updated
3. **No Validation**: Pre-commit doesn't check link validity
4. **Manual Detection**: Only found after deployment

**Pattern**:
- Happens EVERY documentation restructure
- Same files break repeatedly (orientation.md, troubleshooting.md)
- Quick fixes applied but problem recurs

## Proposed Solution

### Short-term (Current Breakage)
- [x] Quick fix applied: 62 → 28 broken (71% success rate)
- [ ] Complete fix: Remaining 28 links
- [ ] Document working links in validation report

### Long-term (Prevention)
- [ ] **Add link validation to pre-commit**:
  ```bash
  npx claude-flow@alpha hooks pre-commit --validate-links
  # Or use existing script:
  python3 sessions/issues/validate-links.py docs/
  ```
- [ ] **Reject commits with broken links** (or warn prominently)
- [ ] **Automated link updater** for restructures:
  ```bash
  # When moving file:
  git mv docs/old/path.md docs/new/path.md
  # Then auto-update all references:
  find docs/ -name "*.md" -exec sed -i 's|docs/old/path.md|docs/new/path.md|g' {} \;
  ```
- [ ] **CI validation**: Run link checker on every PR

### Validation Script
Already exists: `validate_links.py` in session artifacts
- Move to: `sessions/issues/validate-links.py` (reusable)
- Add to git hooks
- Run on pre-commit

## Related Issues

- Pattern similar to ISSUE-002 (doc-code sync) - verification gaps

## Resolution Notes

**Status**: In Progress - 71% links working, need to:
1. Fix remaining 28 broken links
2. Add validation to pre-commit
3. Test on next restructure

**Progress**:
- 2025-11-18: Quick fix (36% → 71%)
- 2025-11-21: Issue formalized, validation script identified

**Next Steps**:
1. Run full validation pass
2. Fix all remaining broken links
3. Add to pre-commit hooks
4. Mark resolved once validation automated
