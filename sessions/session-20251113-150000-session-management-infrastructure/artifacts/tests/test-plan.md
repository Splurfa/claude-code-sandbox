# CLAUDE.md Validation Test Plan

## Overview

This test plan validates that all contradictions in CLAUDE.md have been resolved and the session protocol is consistently applied throughout the documentation.

---

## Test Categories

### Category 1: Path Validation Tests
**Purpose**: Ensure all file paths use session artifacts, not root directories

| Test ID | Test Name | Description | Pass Criteria |
|---------|-----------|-------------|---------------|
| T1.1 | No root /tests/ | Check for `/tests/` references not in artifacts | Zero matches |
| T1.2 | No root /docs/ | Check for `/docs/` references not in artifacts | Zero matches |
| T1.3 | No root /scripts/ | Check for `/scripts/` references not in artifacts | Zero matches |
| T1.4 | Write uses artifacts | All `Write "..."` use session artifacts paths | Zero violations |
| T1.5 | mkdir session-only | All `mkdir` commands create session directories | Zero violations |

### Category 2: Stock Feature Integrity Tests
**Purpose**: Verify stock claude-flow features unchanged

| Test ID | Test Name | Description | Pass Criteria |
|---------|-----------|-------------|---------------|
| T2.1 | Hooks intact | Verify `npx claude-flow@alpha hooks` commands | 5+ references |
| T2.2 | MCP tools intact | Verify `mcp__claude-flow__` tool references | 10+ references |
| T2.3 | Hook protocol unchanged | Check hook execution order documented | Present |

### Category 3: Documentation Consistency Tests
**Purpose**: Ensure consistent messaging throughout document

| Test ID | Test Name | Description | Pass Criteria |
|---------|-----------|-------------|---------------|
| T3.1 | Session protocol present | Check for session initialization section | Present |
| T3.2 | File routing rules | Check for FILE ROUTING RULES section | Present |
| T3.3 | No contradictions | File org section uses session artifacts | Consistent |

### Category 4: Example Code Tests
**Purpose**: Validate all code examples follow correct patterns

| Test ID | Test Name | Description | Pass Criteria |
|---------|-----------|-------------|---------------|
| T4.1 | Full-stack example | Lines 207-226 use session artifacts | All paths correct |
| T4.2 | Concurrent exec example | Lines 284-288 use session artifacts | All paths correct |
| T4.3 | Task examples | Task instructions mention session paths | Consistent |

---

## Test Execution

### Automated Tests

**Run validation script**:
```bash
./sessions/claudemd-update-20251113-164700/artifacts/tests/validate-claudemd.sh
```

**Expected Output**:
```
✅ PASS: No root /tests/ paths
✅ PASS: No root /docs/ paths
✅ PASS: No root /scripts/ paths
✅ PASS: All Write examples use session artifacts
✅ PASS: No mkdir for root directories
✅ PASS: Stock hooks commands present
✅ PASS: Stock MCP tools present
✅ PASS: Session protocol documented
✅ PASS: File organization section uses session artifacts
✅ PASS: Full-stack example uses session artifacts

========================================
TEST SUMMARY
========================================
Passed: 10
Failed: 0

✅ ALL TESTS PASSED - CLAUDE.md contradictions resolved!
```

### Manual Verification Tests

**M1: Read-through test**
- [ ] Read lines 1-100: No contradictions about file paths
- [ ] Read lines 100-200: Examples use session artifacts
- [ ] Read lines 200-300: Full-stack example correct
- [ ] Read lines 300-400: Session protocol clear
- [ ] Read lines 400-495: File routing rules consistent

**M2: Cross-reference test**
- [ ] Compare lines 3-12 with 54-60: Consistent
- [ ] Compare lines 54-60 with 448-456: Consistent
- [ ] Compare examples (207-226) with rules (448-456): Consistent

**M3: User comprehension test**
- [ ] Instructions are clear and unambiguous
- [ ] No conflicting directives
- [ ] Examples reinforce rules
- [ ] Session protocol is easy to follow

---

## Acceptance Criteria Validation

| Criteria | Test Reference | Status |
|----------|----------------|--------|
| All contradictions resolved | T1.x, T3.3, T4.x | Pending |
| Session protocol clear | T3.1, T3.2, M1 | Pending |
| Examples use correct paths | T4.1, T4.2, T4.3 | Pending |
| STOCK features untouched | T2.1, T2.2, T2.3 | Pending |
| No new contradictions | M2 | Pending |
| Documentation clear | M3 | Pending |

---

## Test Results Tracking

### Before Changes
```bash
# Run baseline test (expected to FAIL)
./sessions/claudemd-update-20251113-164700/artifacts/tests/validate-claudemd.sh
# Expected: Multiple failures due to contradictions
```

### After Changes
```bash
# Run validation test (expected to PASS)
./sessions/claudemd-update-20251113-164700/artifacts/tests/validate-claudemd.sh
# Expected: Zero failures, all tests pass
```

---

## Failure Handling

### If Tests Fail After Implementation:

1. **Review Failure Details**
   ```bash
   cat sessions/claudemd-update-20251113-164700/artifacts/tests/test-results.txt
   ```

2. **Identify Root Cause**
   - Which test failed?
   - What specific lines triggered failure?
   - Was change incomplete or incorrect?

3. **Iterate on Implementation**
   - Review specification
   - Adjust implementation
   - Re-run tests

4. **Rollback if Necessary**
   ```bash
   cp CLAUDE.md.backup CLAUDE.md
   ```

---

## Success Criteria

**Tests PASS when**:
- All 10 automated tests pass
- All 3 manual verification tests complete successfully
- All 6 acceptance criteria validated
- Test results file shows 0 failures
- Human review approves changes

---

## Next Steps After Test Design

1. **Get human approval** of test plan
2. **Run baseline tests** (expect failures)
3. **Proceed to Phase 3**: Implementation
4. **Re-run tests** after changes
5. **Prepare human review** with results
