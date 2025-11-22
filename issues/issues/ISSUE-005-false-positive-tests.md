# ISSUE-005: False Positive Test Reports

**Status**: Open
**Type**: Bug
**Priority**: Medium
**Root Cause**: System (stale test artifacts not timestamped)
**Created**: 2025-11-21
**Updated**: 2025-11-21
**Resolved**: N/A

## Problem Statement

Test reports sometimes flag issues that don't actually exist in production, leading to wasted investigation time. Root cause: stale test artifacts without timestamps, making it unclear if the report reflects current system state.

## Evidence

**Captain's Log**:
- `sessions/captains-log/2025-11-18.md`:
  > "Prompt-improver 'missing 6 modules' false alarm - all modules present. Test report dated 2024, deployment was 2025."

**Lesson Learned**:
- Always verify production state, not just test reports
- Test artifacts can be stale without clear indicators

**Investigation Time Wasted**:
- ~30 minutes debugging "missing modules"
- Verification showed all 6 modules deployed correctly
- Issue was test report age, not actual deployment

## Root Cause Analysis

**Why False Positives Occur**:

1. **No Timestamps**: Test reports don't include "Report Generated: YYYY-MM-DD HH:MM"
2. **Stale Artifacts**: Old test results linger in directories
3. **No Freshness Check**: No warning when report >7 days old
4. **Trust Reports**: Assumption that test output is current

**Why This Matters**:
- Wastes developer time on non-issues
- Erodes trust in test suite
- Can lead to incorrect fixes (fixing non-problems)
- Makes debugging harder (signal vs noise)

## Proposed Solution

### Short-term (Documentation)
- [ ] Add to CLAUDE.md rule: "Always verify production code state before trusting test reports"
- [ ] During debugging: Check file timestamps first
- [ ] Add note to test reports: "This report may be stale - verify production first"

### Long-term (Automation)
- [ ] **Add timestamps to all test outputs**:
  ```bash
  echo "=== Test Report Generated: $(date -u +"%Y-%m-%d %H:%M:%S UTC") ===" >> test-results.txt
  npm test >> test-results.txt
  ```
- [ ] **Freshness validation**:
  ```bash
  # Before trusting test report:
  if [ $(($(date +%s) - $(stat -f %m test-results.txt))) -gt 604800 ]; then
    echo "⚠️ WARNING: Test report >7 days old, re-run tests"
  fi
  ```
- [ ] **Auto-cleanup**: Remove test artifacts >30 days old
- [ ] **Git-ignore test results**: Only commit test configurations, not outputs

### Test Report Template
```markdown
# Test Report

**Generated**: 2025-11-21 14:30:22 UTC
**Git Commit**: abc123def
**Node Version**: v20.10.0
**Environment**: development

## Results
[test output]

---
⚠️ This report is valid for ~7 days. If viewing later, re-run tests to verify.
```

## Related Issues

- Pattern similar to ISSUE-002 (verification gaps)

## Resolution Notes

**Status**: Open - Need to implement timestamping and freshness checks

**Immediate Action**:
- Document lesson learned: "Verify production first"
- Add timestamps to future test runs

**Next Steps**:
1. Add timestamp utility function
2. Update all test scripts to include timestamps
3. Add freshness warnings
4. Test across 3-5 test runs
5. Mark resolved once automated
