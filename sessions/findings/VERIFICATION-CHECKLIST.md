# Post-Fix Verification Checklist

Use this checklist after applying the fixes from VALIDATION-REPORT.md to ensure the migration is 100% complete.

## Pre-Fix Status
- [ ] Read VALIDATION-REPORT.md
- [ ] Understand the 3 critical issues
- [ ] Back up current state: `cp -r sessions/findings sessions/findings-backup-$(date +%Y%m%d-%H%M%S)`

## Critical Fixes Applied

### 1. Database Path Fix
```bash
cd /Users/splurfa/claude-code-sandbox
jq '.["FINDING-009"].file = "records/FINDING-009-file-routing-compliance-violations.md"' \
  sessions/findings/.database/findings.json > temp.json && \
  mv temp.json sessions/findings/.database/findings.json
```

- [ ] Command executed successfully
- [ ] Verify: `jq '.["FINDING-009"].file' sessions/findings/.database/findings.json`
- [ ] Expected output: `"records/FINDING-009-file-routing-compliance-violations.md"`

### 2. .claude/ Path References Update
```bash
# Update all sessions/issues/ → sessions/findings/
find .claude -type f \( -name "*.sh" -o -name "*.md" \) \
  -exec sed -i '' 's|sessions/issues/|sessions/findings/|g' {} +

# Update ISSUE-* → FINDING-*
find .claude -type f \( -name "*.sh" -o -name "*.md" \) \
  -exec sed -i '' 's|ISSUE-\*|FINDING-*|g' {} +
```

- [ ] Commands executed successfully
- [ ] Verify: `grep -r "sessions/issues/" .claude/ | wc -l`
- [ ] Expected output: `0`
- [ ] Verify files updated:
  - [ ] `.claude/hooks/session-end-with-issues.sh`
  - [ ] `.claude/commands/session/session-closeout.md`
  - [ ] `.claude/skills/session-closeout/scripts/closeout.sh`

### 3. Remove Orphaned Directory
```bash
rm -rf sessions/issues/issues/
```

- [ ] Command executed successfully
- [ ] Verify: `ls sessions/issues/issues/ 2>&1`
- [ ] Expected output: `No such file or directory`

## Functional Testing

### Database Operations
```bash
cd /Users/splurfa/claude-code-sandbox

# Test findings list
bash sessions/findings/bin/findings list
```
- [ ] All 10 findings displayed
- [ ] No "FINDING-000" entries (should be FINDING-008)
- [ ] Status colors working

```bash
# Test specific finding retrieval
bash sessions/findings/bin/findings get FINDING-009
```
- [ ] Returns FINDING-009 details
- [ ] No "Database not found" error
- [ ] File path shows correctly

```bash
# Test pattern database
bash sessions/findings/bin/pattern-db list
```
- [ ] Shows 2 patterns
- [ ] File Routing Violations (3 occurrences, threshold reached)
- [ ] Session Naming Protocol Violations (1 occurrence)

```bash
# Test detection
bash sessions/findings/bin/detect-findings session-test
```
- [ ] Runs without errors
- [ ] Detects patterns correctly

### Path Validation
```bash
# Verify all finding files exist
jq -r '.[] | .file' sessions/findings/.database/findings.json | \
  while read file; do
    if [ -f "sessions/findings/$file" ]; then
      echo "✓ $file"
    else
      echo "✗ MISSING: $file"
    fi
  done
```
- [ ] All 10 files show ✓
- [ ] No missing files

### Cross-Reference Integrity
```bash
# Test related_findings references
jq -r '.[] | select(.related_findings) | .related_findings[]' \
  sessions/findings/.database/findings.json | sort -u | \
  while read id; do
    if jq -e ".\"$id\"" sessions/findings/.database/findings.json > /dev/null 2>&1; then
      echo "✓ $id exists"
    else
      echo "✗ $id INVALID"
    fi
  done
```
- [ ] All references valid
- [ ] No invalid references

## Configuration Validation

### Session Closeout Integration
```bash
# Check hook references
grep -n "findings" .claude/hooks/session-end-with-issues.sh
```
- [ ] References `sessions/findings/` (not issues/)
- [ ] Commands use correct paths

```bash
# Check closeout skill
grep -n "findings" .claude/skills/session-closeout/scripts/closeout.sh
```
- [ ] References `sessions/findings/.database/patterns.json`
- [ ] Log mentions "Findings Registry"

```bash
# Check session-closeout command
grep -n "findings" .claude/commands/session/session-closeout.md
```
- [ ] Mentions `sessions/findings/bin/detect-findings`
- [ ] References findings database
- [ ] Uses FINDING-* naming

### Documentation Consistency
```bash
# Check CLAUDE.md
grep -A5 "findings" CLAUDE.md | head -20
```
- [ ] References `sessions/findings/.database/findings.json`
- [ ] Example commands use correct paths
- [ ] No stale sessions/issues/ references

## Git Status Verification

```bash
git status --short
```
- [ ] Expected modified files:
  - `.claude/hooks/session-end-with-issues.sh`
  - `.claude/commands/session/session-closeout.md`
  - `.claude/skills/session-closeout/scripts/closeout.sh`
  - `sessions/findings/.database/findings.json`

```bash
git diff sessions/findings/.database/findings.json
```
- [ ] Shows FINDING-009 file path change
- [ ] Only one line changed

## Edge Case Testing

### Script Working Directory
```bash
# Test from repository root
bash sessions/findings/bin/findings list
```
- [ ] Works correctly

```bash
# Test from subdirectory
cd sessions/findings
bash bin/findings list
cd ../..
```
- [ ] ⚠️ May show "Database not found" (known issue, not critical)

### Pattern Database Threshold
```bash
# Check threshold logic
jq '.[] | select(.threshold_reached == true)' sessions/findings/.database/patterns.json
```
- [ ] Shows "file-routing-violation"
- [ ] Correctly marked with finding_created: "FINDING-009"

## Final Checks

### System Integrity
- [ ] No orphaned directories in sessions/
- [ ] All scripts executable (`ls -l sessions/findings/bin/`)
- [ ] JSON databases valid (`jq '.' <file> > /dev/null`)
- [ ] Documentation accurate

### Backup Cleanup Decision
```bash
ls -lh sessions/issues-backup-20251121-121704/
```
- [ ] Backup exists (172 KB)
- [ ] Decision made:
  - [ ] Keep in git: `git add sessions/issues-backup-20251121-121704/`
  - [ ] Delete: `rm -rf sessions/issues-backup-20251121-121704/`

## Production Readiness

### Final Verification Commands
```bash
# All critical systems operational
bash sessions/findings/bin/findings list | wc -l  # Should be > 10
bash sessions/findings/bin/pattern-db list       # Should show 2 patterns
bash sessions/findings/bin/findings get FINDING-001  # Should work
bash sessions/findings/bin/findings get FINDING-009  # Should work
grep -r "sessions/issues/" .claude/ | wc -l      # Should be 0
```

- [ ] All verification commands pass
- [ ] No errors in output
- [ ] System fully operational

## Sign-Off

- [ ] All critical fixes applied
- [ ] All functional tests passing
- [ ] All configuration updated
- [ ] Documentation consistent
- [ ] Git staging clean
- [ ] **SYSTEM IS PRODUCTION READY** ✅

**Validated By**: _________________
**Date**: _________________
**Migration Quality Score**: ___/100

---

## If Issues Found

Record any issues discovered during verification:

**Issue 1**:
- Description:
- Severity:
- Fix applied:
- Re-verified: [ ]

**Issue 2**:
- Description:
- Severity:
- Fix applied:
- Re-verified: [ ]

---

## Next Steps After Production Sign-Off

1. Commit changes: `git commit -m "fix: Complete migration from issues/ to findings/"`
2. Test session closeout: Run `/session-closeout` on a test session
3. Monitor for issues in production use
4. Update team on new findings/ system
5. Archive or delete backup directory based on decision

---

**Checklist Version**: 1.0
**Related Documents**:
- VALIDATION-REPORT.md (detailed findings)
- PATH-UPDATE-REPORT.md (migration actions)
- docs/README.md (user documentation)
