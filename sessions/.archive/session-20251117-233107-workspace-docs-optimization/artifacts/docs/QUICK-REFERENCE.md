# Validation Test Suite - Quick Reference

**Session**: `session-20251117-233107-workspace-docs-optimization`
**Purpose**: Quick guide for using the validation system

## Running Tests

### Basic Usage

```bash
# Run full validation suite
bash sessions/session-20251117-233107-workspace-docs-optimization/artifacts/tests/run-validation.sh

# Run tests directly (without reports)
node sessions/session-20251117-233107-workspace-docs-optimization/artifacts/tests/structure-validation.test.js
```

### Expected Output

**When tests pass**:
```
✅ Tests passed!
Total Tests:  26
Passed:       26
Failed:       0
Pass Rate:    100%
Status:       ✅ PASSED
```

**When tests fail**:
```
❌ Tests failed!
Total Tests:  26
Passed:       17
Failed:       9
Pass Rate:    65.4%
Status:       ❌ FAILED
```

## Current Status (Baseline)

| Category | Pass Rate | Status |
|----------|-----------|--------|
| Structure Validation | 66.7% | ⚠️ Needs fixes |
| Content Validation | 33.3% | ❌ Critical issues |
| Learning Path Validation | 100% | ✅ Perfect |
| Integration Validation | 66.7% | ⚠️ Needs fixes |
| **OVERALL** | **65.4%** | **❌ FAILED** |

## Critical Issues to Fix

### 1. Missing Directory (Blocks 3 tests)
```bash
mkdir -p docs/internals/system
```

### 2. Missing README (Blocks navigation)
```bash
# Create docs/how-to/README.md
# Document purpose and list all how-to guides
```

### 3. Broken Links (Blocks 46 tests)
Use test output to identify broken links:
- Main README: Update all `guides/*` to `how-to/*`, `explanation/*`, etc.
- CLAUDE.md: Fix `internals/system/*` references
- Explanation docs: Update cross-references

### 4. Code Block Labels (Quality issue)
Add language specifiers:
```markdown
# Before
```
code here
```

# After
```bash
code here
```
```

## Test Categories Explained

### Structure Validation
**Purpose**: Ensure Diátaxis framework compliance
**Tests**: Directory existence, README placement, file organization
**Critical**: Yes - blocks navigation

### Content Validation
**Purpose**: Ensure documentation quality
**Tests**: Link validity, titles, code blocks, consistency
**Critical**: Yes - blocks user experience

### Learning Path Validation
**Purpose**: Ensure new user onboarding
**Tests**: Tutorial progression, objectives, cross-references
**Critical**: Yes - blocks learning

### Integration Validation
**Purpose**: Ensure system functionality
**Tests**: CLAUDE.md integration, skill references, coordination
**Critical**: Yes - blocks features

## Files Created

### Test Suite
- **Location**: `sessions/.../artifacts/tests/structure-validation.test.js`
- **Lines**: 600+
- **Tests**: 26
- **Usage**: `node structure-validation.test.js`

### Test Runner
- **Location**: `sessions/.../artifacts/tests/run-validation.sh`
- **Features**: Colored output, reports, memory integration
- **Usage**: `bash run-validation.sh`

### Reports
- **Markdown**: `artifacts/docs/VALIDATION-REPORT-*.md`
- **JSON**: `artifacts/docs/validation-results-*.json`
- **Summary**: `artifacts/docs/VALIDATION-SUMMARY.md`
- **This file**: `artifacts/docs/QUICK-REFERENCE.md`

## Workflow

### Phase 1: Run Baseline (✅ Done)
```bash
bash run-validation.sh
# Results: 65.4% pass rate, 9 failures identified
```

### Phase 2: Fix Issues (⏳ Pending)
1. Create missing directories
2. Add missing READMEs
3. Fix broken links
4. Add code block labels
5. Update references

### Phase 3: Re-run Validation (⏳ Pending)
```bash
bash run-validation.sh
# Target: 100% pass rate
```

### Phase 4: Compare Metrics (⏳ Pending)
- Baseline vs. Fixed comparison
- Document improvements
- Store in memory

### Phase 5: Post-Migration (⏳ Pending)
- Run validation again after migration
- Ensure no regressions
- Maintain 100% pass rate

## Memory Locations

**Namespace**: `workspace-optimization-20251117/validation`

**Keys**:
- `validation-results`: JSON metrics
- `test-status`: Pass/fail tracking
- `baseline-metrics`: Initial measurements

**Retrieval**:
```bash
# Using MCP tool (from agent)
mcp__claude-flow_alpha__memory_usage({
  action: "retrieve",
  key: "validation-results",
  namespace: "workspace-optimization-20251117"
})
```

## Exit Codes

- **0**: All tests passed ✅
- **1**: Tests failed ❌

Use for automation:
```bash
if bash run-validation.sh; then
  echo "Ready to proceed"
else
  echo "Fix issues first"
  exit 1
fi
```

## Troubleshooting

### Tests won't run
```bash
# Check Node.js version
node --version  # Need v20+

# Check file permissions
chmod +x run-validation.sh
```

### Reports not generated
```bash
# Check artifacts directory
mkdir -p sessions/session-*/artifacts/docs
```

### Memory not storing
```bash
# Verify claude-flow installed
npx claude-flow@alpha --version

# Check .swarm directory
ls -la .swarm/memory.db
```

## Quick Tips

**Run specific test category**:
```bash
# Edit structure-validation.test.js
# Comment out describe() blocks you don't need
node structure-validation.test.js
```

**View detailed failures**:
```bash
# Check the baseline output file
cat /tmp/validation-baseline-*.txt
```

**Generate fresh report**:
```bash
# Just run the test runner again
bash run-validation.sh
# New report with timestamp generated
```

## Success Criteria

### Before Migration
- [ ] All 26 tests pass
- [ ] 100% pass rate
- [ ] 0 broken links
- [ ] All critical files exist
- [ ] Navigation fully functional

### After Migration
- [ ] Maintain 100% pass rate
- [ ] No new broken links
- [ ] No regressions
- [ ] Quality improved

## Contact

**Agent**: Quality Validator
**Session**: session-20251117-233107-workspace-docs-optimization
**Namespace**: workspace-optimization-20251117/validation

---

**Remember**: Don't proceed with migration until all tests pass!
