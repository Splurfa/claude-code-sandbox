# Test Suite - Clean Workspace Rebuild

## Quick Start

```bash
# Quick validation (<2 min)
./sessions/session-20251115-165054-clean-workspace-rebuild/artifacts/tests/smoke/run-smoke-tests.sh

# Full validation (<5 min)
./sessions/session-20251115-165054-clean-workspace-rebuild/artifacts/tests/validate-stock.sh
./sessions/session-20251115-165054-clean-workspace-rebuild/artifacts/tests/validate-features.sh

# Automated tests (if configured)
npm test
```

## Test Suite Overview

### 📋 Test Plan
See [test-plan.md](test-plan.md) for comprehensive test strategy and all test cases.

### 🔍 Validation Scripts

#### Stock Compliance Validation
**File**: `validate-stock.sh`

Verifies zero modifications to stock claude-flow files.

**Tests**:
- No modifications to node_modules/claude-flow/
- Stock hooks call through correctly
- Stock memory at .swarm/memory.db
- Stock backups at .swarm/backups/
- No monkey-patching detected
- Stock CLI commands functional

**Run**: `./validate-stock.sh`

---

#### Feature Validation
**File**: `validate-features.sh`

Verifies all custom features work correctly.

**Tests**:
- Skills isolation
- Hooks auto-cascade
- Memory operations
- Session management
- Workspace structure
- File routing
- Integration workflows

**Run**: `./validate-features.sh`

---

### ⚡ Smoke Tests

**Location**: `smoke/run-smoke-tests.sh`

Fast validation of critical functionality (<2 minutes).

**Tests**: 10 critical checks
- Stock hooks CLI
- Memory operations
- Session creation
- File routing
- Hook cascade setup
- Skills directory
- CLAUDE.md valid
- Dependencies installed
- Git repository
- Stock integrity

**Run**: `./smoke/run-smoke-tests.sh`

---

### 🧪 Unit Tests

**Location**: `unit/`

Test individual components in isolation.

**Test Files**:
- `hooks.test.js` - Hooks wrapper and auto-cascade (4 test suites, 15+ tests)
- `memory.test.js` - Memory storage and retrieval (7 test suites, 20+ tests)
- `session.test.js` - Session lifecycle and artifacts (6 test suites, 15+ tests)

**Run**: `npm test -- --testPathPattern=unit`

---

### 🔗 Integration Tests

**Location**: `integration/`

Test complete end-to-end workflows.

**Test Files**:
- `full-workflow.test.js` - Complete session lifecycle (9 test suites, 10+ tests)

**Run**: `npm test -- --testPathPattern=integration`

---

## Test Categories

| Category | Files | Tests | Duration | Purpose |
|----------|-------|-------|----------|---------|
| Smoke | 1 script | 10 | <2 min | Quick validation |
| Stock Compliance | 1 script | 10+ | <3 min | Verify zero stock modifications |
| Feature Validation | 1 script | 45+ | <3 min | Verify features work |
| Unit | 3 files | 50+ | <1 min | Component isolation |
| Integration | 1 file | 10+ | <5 min | End-to-end workflows |

**Total**: ~125+ test cases

---

## Test Reports

All test reports saved to:
```
sessions/session-20251115-165054-clean-workspace-rebuild/artifacts/tests/
├── stock-compliance-report.txt
├── feature-validation-report.txt
└── test-results/ (Jest output)
```

---

## Success Criteria

### Stock Compliance
- ✅ 100% stock compliance required
- ✅ Zero modifications to stock files
- ✅ All stock CLI commands functional

### Feature Functionality
- ✅ All custom features isolated in .claude/
- ✅ Hooks auto-cascade correctly
- ✅ Memory operations functional
- ✅ Session management working
- ✅ File routing correct

### Test Quality
- ✅ Pass rate >95%
- ✅ Coverage >80%
- ✅ Tests fast (<100ms unit tests)
- ✅ Tests isolated and repeatable

---

## Documentation

- [test-plan.md](test-plan.md) - Comprehensive test strategy and all test cases
- [../docs/testing-guide.md](../docs/testing-guide.md) - Complete testing guide with examples and troubleshooting

---

## Common Workflows

### Before Committing
```bash
./smoke/run-smoke-tests.sh && \
./validate-stock.sh && \
./validate-features.sh
```

### Before PR
```bash
./smoke/run-smoke-tests.sh && \
./validate-stock.sh && \
./validate-features.sh && \
npm test
```

### Debugging
```bash
# Run specific test with verbose output
npm test -- --testPathPattern=hooks --verbose

# Check reports
cat stock-compliance-report.txt
cat feature-validation-report.txt
```

---

## Test Development

### Adding New Tests

1. **Choose category**: unit/integration/smoke
2. **Write test**: Follow existing patterns
3. **Update test-plan.md**: Add test case ID and details
4. **Run test**: Verify it passes
5. **Run full suite**: Check for regressions

### Test Template

```javascript
describe('Feature Tests', () => {
  beforeAll(() => {
    // Setup
  });

  afterAll(() => {
    // Cleanup
  });

  test('feature works correctly', () => {
    // Arrange
    const input = setupTestData();

    // Act
    const result = performOperation(input);

    // Assert
    expect(result).toBe(expected);
  });
});
```

---

## Troubleshooting

### Permission Denied
```bash
chmod +x validate-stock.sh
chmod +x validate-features.sh
chmod +x smoke/run-smoke-tests.sh
```

### Tests Won't Run
```bash
# Install dependencies
npm install

# Check claude-flow installed
npx claude-flow@alpha --version
```

### Memory Tests Fail
```bash
# Check memory database exists
ls -la .swarm/memory.db

# Try manual operation
npx claude-flow@alpha hooks memory --action store --key test --value test
```

---

## Support

- **Full Documentation**: [testing-guide.md](../docs/testing-guide.md)
- **Test Plan**: [test-plan.md](test-plan.md)
- **Workspace Guide**: [WORKSPACE-GUIDE.md](../../../WORKSPACE-GUIDE.md)
- **Claude Configuration**: [CLAUDE.md](../../../CLAUDE.md)

---

**Last Updated**: 2025-11-15
**Version**: 1.0
**Test Coverage**: 125+ test cases
**Maintained By**: Test Engineer Agent
