# Testing Guide - Clean Workspace Rebuild

## Overview

This guide explains how to run and interpret the comprehensive test suite for the clean workspace rebuild. The test suite validates:

1. **Stock Compliance** - Zero modifications to stock claude-flow
2. **Feature Isolation** - Custom features properly isolated
3. **Hook Cascade** - Auto-firing hooks working correctly
4. **Memory/Session** - Workspace management functional
5. **Integration** - End-to-end workflows operational

---

## Quick Start

### Run All Tests (Recommended)

```bash
# Run complete validation suite
./sessions/session-20251115-165054-clean-workspace-rebuild/artifacts/tests/validate-stock.sh
./sessions/session-20251115-165054-clean-workspace-rebuild/artifacts/tests/validate-features.sh

# Run automated tests (if Jest configured)
npm test
```

### Quick Smoke Test (<2 minutes)

```bash
./sessions/session-20251115-165054-clean-workspace-rebuild/artifacts/tests/smoke/run-smoke-tests.sh
```

---

## Test Categories

### 1. Stock Compliance Tests

**Purpose**: Verify zero modifications to stock claude-flow files

**How to Run**:
```bash
./sessions/session-20251115-165054-clean-workspace-rebuild/artifacts/tests/validate-stock.sh
```

**What It Checks**:
- ✓ No modifications to `node_modules/claude-flow/`
- ✓ Stock hooks call through to `npx claude-flow@alpha hooks`
- ✓ Stock memory uses `.swarm/memory.db`
- ✓ Stock session backups at `.swarm/backups/`
- ✓ Package.json dependencies are stock versions
- ✓ No monkey-patching detected
- ✓ Stock CLI commands work unchanged

**Expected Output**:
```
========================================
Stock Compliance Validation Report
========================================

TC-SC-001: Stock Node Modules Integrity
✓ No modifications to node_modules/claude-flow/

TC-SC-002: Stock Hooks Integration
✓ Stock hooks CLI is functional
✓ Hooks wrapper calls stock CLI correctly

...

========================================
✓ STOCK COMPLIANCE: PASS (100%)
========================================
```

**If Tests Fail**:
1. Check which specific test failed
2. Review the modification that caused failure
3. Revert to stock implementation
4. Re-run validation

---

### 2. Feature Validation Tests

**Purpose**: Verify all custom features work correctly

**How to Run**:
```bash
./sessions/session-20251115-165054-clean-workspace-rebuild/artifacts/tests/validate-features.sh
```

**What It Checks**:
- ✓ Skills isolated in `.claude/skills/`
- ✓ Hooks auto-cascade correctly
- ✓ Memory store/retrieve works
- ✓ Session management functional
- ✓ Workspace structure correct
- ✓ File routing to artifacts
- ✓ Integration workflows operational

**Expected Output**:
```
========================================
Feature Functionality Validation Report
========================================

Skills Isolation Tests
✓ TC-SI-001: All skill files in .claude/skills/
✓ TC-SI-002: Skills don't modify global state

...

Total Tests: 45
Passed: 45
Failed: 0
Pass Rate: 100%

========================================
✓ FEATURE VALIDATION: PASS
========================================
```

---

### 3. Smoke Tests (Fast Validation)

**Purpose**: Quick validation that critical features work

**How to Run**:
```bash
./sessions/session-20251115-165054-clean-workspace-rebuild/artifacts/tests/smoke/run-smoke-tests.sh
```

**Duration**: <2 minutes

**Tests**:
1. Stock hooks executable
2. Memory operations
3. Session creation
4. File routing
5. Hook cascade setup
6. Skills directory
7. CLAUDE.md valid
8. Dependencies installed
9. Git repository
10. Stock integrity

**Use Case**: Run before commits or after changes for quick feedback

---

### 4. Unit Tests

**Purpose**: Test individual components in isolation

**How to Run**:
```bash
# Run all unit tests
npm test -- --testPathPattern=unit

# Run specific unit test
npm test -- sessions/session-20251115-165054-clean-workspace-rebuild/artifacts/tests/unit/hooks.test.js
```

**Test Files**:
- `hooks.test.js` - Hooks wrapper and auto-cascade
- `memory.test.js` - Memory storage and retrieval
- `session.test.js` - Session lifecycle and artifacts

**Example**:
```bash
npm test -- --testPathPattern=unit/hooks
```

---

### 5. Integration Tests

**Purpose**: Test complete end-to-end workflows

**How to Run**:
```bash
# Run all integration tests
npm test -- --testPathPattern=integration

# Run specific integration test
npm test -- sessions/session-20251115-165054-clean-workspace-rebuild/artifacts/tests/integration/full-workflow.test.js
```

**Test Files**:
- `full-workflow.test.js` - Complete session lifecycle workflows

**What It Tests**:
- Full session creation → work → closeout
- Hooks integration during workflows
- Multi-agent coordination via memory
- File routing across all artifact types
- Cross-session memory persistence
- Session backup creation
- Workspace structure integrity
- Error recovery

---

## Test Reports

### Understanding Test Output

**PASS Example**:
```
✓ TC-SC-001: No modifications to node_modules/claude-flow/ (12ms)
```
- ✓ = Test passed
- TC-SC-001 = Test case ID (see test-plan.md)
- Description explains what was tested
- (12ms) = Execution time

**FAIL Example**:
```
✗ TC-SC-003: Stock memory location incorrect (15ms)
  Expected: .swarm/memory.db
  Actual: .claude/memory.db
```
- ✗ = Test failed
- Shows expected vs actual values
- Indicates what needs fixing

**WARN Example**:
```
⚠ TC-SI-001: .claude/skills/ directory not found
```
- ⚠ = Warning (not implemented or optional)
- May not affect compliance
- Review if feature is required

---

## Test Reports Location

All test reports are saved to:
```
sessions/session-20251115-165054-clean-workspace-rebuild/artifacts/tests/
├── stock-compliance-report.txt
├── feature-validation-report.txt
└── test-results/ (if Jest configured)
```

**View Reports**:
```bash
# Stock compliance
cat sessions/session-20251115-165054-clean-workspace-rebuild/artifacts/tests/stock-compliance-report.txt

# Feature validation
cat sessions/session-20251115-165054-clean-workspace-rebuild/artifacts/tests/feature-validation-report.txt
```

---

## Common Test Scenarios

### Scenario 1: Before Committing Code

```bash
# Quick validation
./sessions/session-20251115-165054-clean-workspace-rebuild/artifacts/tests/smoke/run-smoke-tests.sh

# If smoke tests pass, run full validation
./sessions/session-20251115-165054-clean-workspace-rebuild/artifacts/tests/validate-stock.sh
./sessions/session-20251115-165054-clean-workspace-rebuild/artifacts/tests/validate-features.sh
```

### Scenario 2: After Implementing New Feature

```bash
# Run feature validation
./sessions/session-20251115-165054-clean-workspace-rebuild/artifacts/tests/validate-features.sh

# Run relevant unit tests
npm test -- --testPathPattern=unit

# Run integration tests
npm test -- --testPathPattern=integration
```

### Scenario 3: Debugging Failed Tests

```bash
# Run specific test with verbose output
npm test -- --testPathPattern=hooks --verbose

# Check test reports
cat sessions/session-20251115-165054-clean-workspace-rebuild/artifacts/tests/stock-compliance-report.txt
```

### Scenario 4: Pre-Production Validation

```bash
# Run complete test suite
./sessions/session-20251115-165054-clean-workspace-rebuild/artifacts/tests/smoke/run-smoke-tests.sh
./sessions/session-20251115-165054-clean-workspace-rebuild/artifacts/tests/validate-stock.sh
./sessions/session-20251115-165054-clean-workspace-rebuild/artifacts/tests/validate-features.sh
npm test

# Review all reports
ls -la sessions/session-20251115-165054-clean-workspace-rebuild/artifacts/tests/*-report.txt
```

---

## Troubleshooting

### Tests Won't Run

**Problem**: `Permission denied` when running scripts

**Solution**:
```bash
chmod +x sessions/session-20251115-165054-clean-workspace-rebuild/artifacts/tests/validate-stock.sh
chmod +x sessions/session-20251115-165054-clean-workspace-rebuild/artifacts/tests/validate-features.sh
chmod +x sessions/session-20251115-165054-clean-workspace-rebuild/artifacts/tests/smoke/run-smoke-tests.sh
```

---

### Stock Compliance Fails

**Problem**: Modifications detected in stock files

**Solution**:
1. Identify modified file from test output
2. Check if modification is in `.claude/` or stock files
3. If in stock files, revert changes
4. Move custom logic to `.claude/` directory
5. Re-run validation

---

### Memory Tests Fail

**Problem**: Memory operations not working

**Solution**:
```bash
# Check if claude-flow is installed
npx claude-flow@alpha --version

# Check if .swarm/ directory exists
ls -la .swarm/

# Try manual memory operation
npx claude-flow@alpha hooks memory --action store --key test --value test

# Check memory database
ls -la .swarm/memory.db
```

---

### Session Tests Fail

**Problem**: Session directory structure incorrect

**Solution**:
```bash
# Verify sessions directory exists
mkdir -p sessions

# Check session structure template
ls -la sessions/session-20251115-165054-clean-workspace-rebuild/

# Create test session manually
SESSION_ID="session-$(date +%Y%m%d-%H%M%S)-test"
mkdir -p "sessions/$SESSION_ID/artifacts"/{code,tests,docs,scripts,notes}
ls -la "sessions/$SESSION_ID/artifacts/"
```

---

### Integration Tests Timeout

**Problem**: Tests take too long or timeout

**Solution**:
```bash
# Increase Jest timeout
npm test -- --testTimeout=30000

# Run tests sequentially
npm test -- --runInBand

# Run specific test file
npm test -- full-workflow.test.js
```

---

## Test Development

### Adding New Tests

**1. Determine Category**:
- Unit test? → `tests/unit/`
- Integration test? → `tests/integration/`
- Smoke test? → `tests/smoke/`

**2. Write Test**:
```javascript
describe('New Feature Tests', () => {
  test('feature works as expected', () => {
    // Arrange
    const input = setupTestData();

    // Act
    const result = performOperation(input);

    // Assert
    expect(result).toBe(expected);
  });
});
```

**3. Add to Test Suite**:
- Update `test-plan.md` with new test case
- Add test case ID (TC-XX-YYY)
- Document purpose and expected results

**4. Run and Validate**:
```bash
npm test -- path/to/new/test.js
```

---

### Modifying Existing Tests

**Before Modifying**:
1. Understand why test exists
2. Check if it validates a requirement
3. Consider impact on compliance

**Steps**:
1. Update test logic
2. Run test to verify it passes
3. Update test-plan.md if needed
4. Run full suite to check for regressions

---

## Best Practices

### ✅ DO

- Run smoke tests before every commit
- Run full validation before PR
- Keep tests isolated and repeatable
- Document new test cases in test-plan.md
- Fix failing tests immediately
- Review test reports after each run

### ❌ DON'T

- Ignore test failures
- Skip tests to make builds pass
- Modify tests to pass without fixing root cause
- Delete tests because they're failing
- Run tests without checking results
- Commit code with failing tests

---

## Test Metrics

### Coverage Goals

- **Statements**: >80%
- **Branches**: >75%
- **Functions**: >80%
- **Lines**: >80%

### Performance Goals

- **Smoke Tests**: <2 minutes
- **Unit Tests**: <100ms each
- **Integration Tests**: <10 minutes total
- **Full Suite**: <15 minutes

### Quality Goals

- **Stock Compliance**: 100%
- **Feature Functionality**: 100%
- **Pass Rate**: >95%
- **Flakiness**: <1%

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Run smoke tests
        run: ./sessions/session-20251115-165054-clean-workspace-rebuild/artifacts/tests/smoke/run-smoke-tests.sh

      - name: Validate stock compliance
        run: ./sessions/session-20251115-165054-clean-workspace-rebuild/artifacts/tests/validate-stock.sh

      - name: Validate features
        run: ./sessions/session-20251115-165054-clean-workspace-rebuild/artifacts/tests/validate-features.sh

      - name: Run unit tests
        run: npm test -- --testPathPattern=unit

      - name: Run integration tests
        run: npm test -- --testPathPattern=integration
```

---

## Support

### Getting Help

**Test Failures**:
1. Check test reports in `sessions/.../artifacts/tests/`
2. Review test-plan.md for test case details
3. Check troubleshooting section above

**Questions**:
- Review CLAUDE.md for workspace rules
- Check WORKSPACE-GUIDE.md for feature documentation
- Review test-plan.md for comprehensive test strategy

---

## Quick Reference

### Common Commands

```bash
# Smoke tests (fast)
./sessions/session-20251115-165054-clean-workspace-rebuild/artifacts/tests/smoke/run-smoke-tests.sh

# Stock compliance
./sessions/session-20251115-165054-clean-workspace-rebuild/artifacts/tests/validate-stock.sh

# Feature validation
./sessions/session-20251115-165054-clean-workspace-rebuild/artifacts/tests/validate-features.sh

# Unit tests
npm test -- --testPathPattern=unit

# Integration tests
npm test -- --testPathPattern=integration

# All tests with coverage
npm test -- --coverage

# Specific test file
npm test -- path/to/test.js

# Watch mode
npm test -- --watch

# Verbose output
npm test -- --verbose
```

### Test Files Location

```
sessions/session-20251115-165054-clean-workspace-rebuild/artifacts/tests/
├── test-plan.md              # Comprehensive test strategy
├── validate-stock.sh         # Stock compliance validation
├── validate-features.sh      # Feature validation
├── smoke/
│   └── run-smoke-tests.sh   # Quick smoke tests
├── unit/
│   ├── hooks.test.js        # Hooks tests
│   ├── memory.test.js       # Memory tests
│   └── session.test.js      # Session tests
└── integration/
    └── full-workflow.test.js # Integration tests
```

---

## Appendix: Test Case Reference

See [test-plan.md](../tests/test-plan.md) for complete test case documentation including:

- TC-SC-XXX: Stock Compliance tests
- TC-SI-XXX: Skills Isolation tests
- TC-HC-XXX: Hooks Cascade tests
- TC-MM-XXX: Memory Management tests
- TC-SM-XXX: Session Management tests
- TC-WS-XXX: Workspace Structure tests
- TC-IT-XXX: Integration tests
- TC-ST-XXX: Smoke tests

---

**Last Updated**: 2025-11-15
**Version**: 1.0
**Maintained By**: Test Engineer Agent
