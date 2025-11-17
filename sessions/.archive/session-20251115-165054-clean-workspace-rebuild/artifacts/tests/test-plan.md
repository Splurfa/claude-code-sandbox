# Comprehensive Test Plan - Clean Workspace Validation

## Executive Summary

This test plan validates the clean workspace rebuild against the following criteria:
- **Stock Compliance**: 95%+ stock architecture, zero stock file modifications
- **Feature Isolation**: All custom features properly isolated in `.claude/`
- **Hook Cascade**: Auto-firing hooks working correctly
- **Memory/Session**: Workspace management functional
- **Integration**: End-to-end workflows operational

## Test Strategy

### Test Pyramid

```
         /\
        /E2E\      <- Smoke tests (5-10 tests, <2min)
       /------\
      /Integr. \   <- Integration tests (20-30 tests, <10min)
     /----------\
    /   Unit     \ <- Unit tests (50+ tests, <1min)
   /--------------\
```

## Test Categories

### 1. Stock Compliance Tests (CRITICAL)

**Objective**: Verify zero modifications to stock claude-flow files

**Test Cases**:
- TC-SC-001: Verify no modifications to `node_modules/claude-flow/` files
- TC-SC-002: Validate stock hooks call through to `npx claude-flow@alpha hooks`
- TC-SC-003: Confirm stock memory uses `.swarm/memory.db`
- TC-SC-004: Verify stock session backups at `.swarm/backups/`
- TC-SC-005: Validate package.json dependencies are stock versions
- TC-SC-006: Confirm no monkey-patching of stock modules
- TC-SC-007: Verify stock CLI commands work unchanged

**Validation Method**: File hash comparison, runtime inspection

**Success Criteria**: 100% stock compliance, zero modifications detected

---

### 2. Skills Isolation Tests

**Objective**: Verify skills are properly isolated and don't interfere with stock

**Test Cases**:
- TC-SI-001: Skill files only in `.claude/skills/`
- TC-SI-002: Skills don't modify global state
- TC-SI-003: Skills can be disabled without breaking stock
- TC-SI-004: Skill activation is explicit (not automatic)
- TC-SI-005: Skills use documented extension points only
- TC-SI-006: Skills don't override stock functions
- TC-SI-007: Multiple skills can coexist without conflicts

**Validation Method**: Directory inspection, runtime monitoring

**Success Criteria**: Complete isolation, no stock interference

---

### 3. Hooks Auto-Cascade Tests

**Objective**: Verify hooks auto-fire correctly during operations

**Test Cases**:
- TC-HC-001: Pre-task hook fires before agent spawning
- TC-HC-002: Post-edit hook fires after file writes
- TC-HC-003: Post-task hook fires after task completion
- TC-HC-004: Session-restore hook fires on agent initialization
- TC-HC-005: Session-end hook fires on completion
- TC-HC-006: Memory hooks fire on store/retrieve operations
- TC-HC-007: Hooks cascade to nested operations
- TC-HC-008: Hook failures don't break operations
- TC-HC-009: Hooks can be disabled per operation
- TC-HC-010: Hook execution is logged correctly

**Validation Method**: Hook execution logs, side-effect verification

**Success Criteria**: 100% hook coverage, correct cascading

---

### 4. Memory Management Tests

**Objective**: Verify memory storage and retrieval works correctly

**Test Cases**:
- TC-MM-001: Store key-value pairs successfully
- TC-MM-002: Retrieve stored values correctly
- TC-MM-003: Search patterns work as expected
- TC-MM-004: Namespace isolation works
- TC-MM-005: TTL expiration functions correctly
- TC-MM-006: Memory persists across sessions
- TC-MM-007: Concurrent access is thread-safe
- TC-MM-008: Memory backup/restore works
- TC-MM-009: Memory size limits respected
- TC-MM-010: Invalid operations fail gracefully

**Validation Method**: Direct API testing, persistence verification

**Success Criteria**: All operations work, data integrity maintained

---

### 5. Session Management Tests

**Objective**: Verify session lifecycle and artifact management

**Test Cases**:
- TC-SM-001: Auto-create session on first message
- TC-SM-002: Generate correct session ID format
- TC-SM-003: Create proper directory structure
- TC-SM-004: Initialize metadata.json correctly
- TC-SM-005: Create session-summary.md
- TC-SM-006: Route files to session artifacts
- TC-SM-007: Session closeout creates backup
- TC-SM-008: Archive to `.swarm/backups/`
- TC-SM-009: Session restore from backup works
- TC-SM-010: Multiple concurrent sessions supported

**Validation Method**: Filesystem inspection, lifecycle simulation

**Success Criteria**: Complete lifecycle functional, proper isolation

---

### 6. Workspace Structure Tests

**Objective**: Verify workspace organization follows specification

**Test Cases**:
- TC-WS-001: Root directory has correct structure
- TC-WS-002: `.claude/` contains all custom features
- TC-WS-003: `sessions/` used for all work artifacts
- TC-WS-004: `.swarm/` contains stock backups/memory
- TC-WS-005: No working files in project root
- TC-WS-006: Skills properly organized in `.claude/skills/`
- TC-WS-007: Hooks in `.claude/hooks/`
- TC-WS-008: Integrations in `.claude/integrations/`
- TC-WS-009: Session templates in `.claude/session/`
- TC-WS-010: Documentation in correct locations

**Validation Method**: Directory structure validation

**Success Criteria**: 100% compliance with structure spec

---

### 7. Integration Tests

**Objective**: Verify end-to-end workflows function correctly

**Test Cases**:
- TC-IT-001: Spawn agent → hooks fire → work completes → session closeout
- TC-IT-002: Multi-agent coordination via memory
- TC-IT-003: File routing to session artifacts
- TC-IT-004: Cross-session memory persistence
- TC-IT-005: Git checkpoint creation and restoration
- TC-IT-006: Captain's Log journaling workflow
- TC-IT-007: ReasoningBank learning pipeline
- TC-IT-008: AgentDB vector storage/retrieval
- TC-IT-009: Skill activation and execution
- TC-IT-010: Full SPARC workflow with agents

**Validation Method**: End-to-end workflow execution

**Success Criteria**: All workflows complete successfully

---

### 8. Smoke Tests (Quick Validation)

**Objective**: Fast validation that critical features work

**Test Cases**:
- TC-ST-001: Stock hooks executable (`npx claude-flow@alpha hooks --help`)
- TC-ST-002: Memory store/retrieve works
- TC-ST-003: Session directory creation
- TC-ST-004: File routing to artifacts
- TC-ST-005: Basic hook cascade
- TC-ST-006: Skills directory exists and is valid
- TC-ST-007: CLAUDE.md loads correctly
- TC-ST-008: Package dependencies installed
- TC-ST-009: Git repository functional
- TC-ST-010: No stock file modifications

**Validation Method**: Quick execution checks

**Success Criteria**: All smoke tests pass in <2 minutes

---

## Test Environments

### Local Development
- **Purpose**: Developer testing during implementation
- **Scope**: Unit + Integration tests
- **Execution**: Manual, on-demand
- **Requirements**: Node.js 18+, claude-flow@alpha installed

### CI/CD Pipeline
- **Purpose**: Automated validation on commits
- **Scope**: All tests (Unit + Integration + Smoke)
- **Execution**: Automatic on git push
- **Requirements**: GitHub Actions, test environment

### Pre-Production
- **Purpose**: Final validation before merge
- **Scope**: Full test suite + manual validation
- **Execution**: Manual approval gate
- **Requirements**: Clean workspace, real claude-flow

---

## Test Data Management

### Mock Data
- Sample session metadata
- Test memory entries
- Mock hook execution logs
- Sample skill configurations

### Test Fixtures
- Pre-created session directories
- Known-good file structures
- Reference hook outputs
- Sample agent coordination flows

### Test Isolation
- Each test creates own session
- Tests clean up after execution
- No shared state between tests
- Deterministic test ordering

---

## Test Execution Strategy

### Phase 1: Unit Tests (Fast)
```bash
npm test -- --testPathPattern=unit
# Expected: <1 minute, 50+ tests
```

### Phase 2: Integration Tests (Medium)
```bash
npm test -- --testPathPattern=integration
# Expected: <10 minutes, 20-30 tests
```

### Phase 3: Smoke Tests (Quick)
```bash
./sessions/session-20251115-165054-clean-workspace-rebuild/artifacts/tests/smoke/run-smoke-tests.sh
# Expected: <2 minutes, 10 tests
```

### Phase 4: Compliance Validation (Critical)
```bash
./sessions/session-20251115-165054-clean-workspace-rebuild/artifacts/tests/validate-stock.sh
./sessions/session-20251115-165054-clean-workspace-rebuild/artifacts/tests/validate-features.sh
# Expected: <5 minutes, full compliance report
```

---

## Success Metrics

### Code Coverage
- **Statements**: >80%
- **Branches**: >75%
- **Functions**: >80%
- **Lines**: >80%

### Test Quality
- **Fast**: Unit tests <100ms each
- **Isolated**: No test dependencies
- **Repeatable**: Same results every run
- **Clear**: Pass/fail obvious
- **Documented**: Every test has purpose

### Compliance Metrics
- **Stock Compliance**: 100% (zero modifications)
- **File Isolation**: 100% (all custom in `.claude/`)
- **Hook Coverage**: 100% (all hooks fire)
- **Feature Functionality**: 100% (all features work)

---

## Test Maintenance

### Adding New Tests
1. Determine appropriate category (Unit/Integration/Smoke)
2. Write test following existing patterns
3. Ensure test is isolated and repeatable
4. Add to test suite
5. Update this test plan

### Modifying Existing Tests
1. Understand why change is needed
2. Update test logic
3. Verify test still validates requirement
4. Update documentation if needed

### Test Failures
1. **Never ignore failures** - all failures are critical
2. Determine root cause (bug vs test issue)
3. Fix root cause, not symptom
4. Re-run full suite to verify fix
5. Document lesson learned

---

## Risk Assessment

### High Risk Areas
- **Stock Modifications**: Highest risk, would break compliance
- **Hook Failures**: Could break automation
- **Memory Corruption**: Could lose session data
- **File Routing Errors**: Could pollute workspace

### Mitigation Strategies
- Automated compliance checking on every commit
- Hook execution verification in smoke tests
- Memory integrity checks in integration tests
- File routing validation in unit tests

---

## Test Reporting

### Test Results Format
```
Test Suite: Stock Compliance
  ✓ TC-SC-001: No modifications to node_modules/claude-flow/ (12ms)
  ✓ TC-SC-002: Stock hooks call through correctly (8ms)
  ✗ TC-SC-003: Stock memory location incorrect (15ms)
    Expected: .swarm/memory.db
    Actual: .claude/memory.db

Total: 3 tests, 2 passed, 1 failed
Coverage: 66.7%
Duration: 35ms
```

### Failure Reporting
- **Immediate**: Test failures reported in console
- **Detailed**: Failure logs with stack traces
- **Actionable**: Clear description of what's wrong
- **Tracked**: Failed tests logged to session artifacts

---

## Continuous Improvement

### Test Metrics Tracking
- Test execution time trends
- Failure rate over time
- Coverage percentage trends
- New test additions rate

### Quality Gates
- **Commit**: Smoke tests must pass
- **PR**: Full suite must pass + compliance 100%
- **Merge**: Manual validation + approval
- **Release**: All tests + production smoke tests

---

## Appendix A: Test Case Template

```markdown
### TC-XX-YYY: Test Case Title

**Category**: Unit/Integration/Smoke
**Priority**: Critical/High/Medium/Low
**Estimated Time**: <Xms/s/min>

**Objective**: What this test validates

**Preconditions**:
- Required setup
- Dependencies

**Test Steps**:
1. Step one
2. Step two
3. Step three

**Expected Results**:
- What should happen

**Actual Results**:
- What did happen (filled during execution)

**Pass/Fail Criteria**:
- Specific conditions for pass

**Notes**:
- Additional information
```

---

## Appendix B: Test Automation Commands

```bash
# Run all tests
npm test

# Run specific category
npm test -- --testPathPattern=unit
npm test -- --testPathPattern=integration

# Run smoke tests
./sessions/session-20251115-165054-clean-workspace-rebuild/artifacts/tests/smoke/run-smoke-tests.sh

# Run compliance validation
./sessions/session-20251115-165054-clean-workspace-rebuild/artifacts/tests/validate-stock.sh
./sessions/session-20251115-165054-clean-workspace-rebuild/artifacts/tests/validate-features.sh

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch

# Run specific test file
npm test -- path/to/test.js
```

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-15 | Test Engineer Agent | Initial comprehensive test plan |
