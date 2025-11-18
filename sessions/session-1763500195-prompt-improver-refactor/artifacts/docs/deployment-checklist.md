# Deployment Checklist: Prompt Improver Refactor

**Target**: Production deployment of refactored prompt-improver skill
**Status**: ⚠️ **BLOCKED** - Critical issues must be resolved
**Created**: 2025-11-18

---

## Pre-Deployment Requirements

### ❌ Blockers (Must Complete)

#### 1. Implement Missing Modules (3 modules)

**Files to Create**:

```bash
sessions/session-1763500195-prompt-improver-refactor/artifacts/code/lib/memory-manager.js
sessions/session-1763500195-prompt-improver-refactor/artifacts/code/lib/confirmation.js
sessions/session-1763500195-prompt-improver-refactor/artifacts/code/lib/learning-log.js
```

**MemoryManager Requirements**:
- [ ] Interface with claude-flow MCP memory
- [ ] `async getBaselinePatterns(mode)` method
- [ ] `async storePattern(pattern)` method
- [ ] `async retrievePattern(key)` method
- [ ] Namespace handling (prompt-improver/*)
- [ ] Export: `module.exports = { MemoryManager };`

**ConfirmationHandler Requirements**:
- [ ] `async confirm(prompt, analysis, suggestions)` method
- [ ] Return format: `{ approved: boolean, userSelections: {}, reason: string }`
- [ ] Multi-option selection support
- [ ] Interactive vs. silent approval logic
- [ ] Export: `module.exports = { ConfirmationHandler };`

**LearningLog Requirements**:
- [ ] `async record(entry)` method
- [ ] `async recordRejection(entry)` method
- [ ] Persist to memory or file system
- [ ] Aggregate statistics tracking
- [ ] Export: `module.exports = { LearningLog };`

**Estimated Time**: 3.5 hours

---

#### 2. Create Context7 Utilities (2 utilities)

**Files to Create**:

```bash
sessions/session-1763500195-prompt-improver-refactor/artifacts/code/utils/context7-client.js
sessions/session-1763500195-prompt-improver-refactor/artifacts/code/utils/memory-client.js
```

**context7-client.js Requirements**:
- [ ] `async fetchContext7(section, options)` function
- [ ] Read from docs/ directory structure
- [ ] Cache integration
- [ ] Timeout handling (default 500ms)
- [ ] Fallback on errors
- [ ] Export: `module.exports = { fetchContext7 };`

**memory-client.js Requirements**:
- [ ] `async storeMemory(key, value, namespace, ttl)` function
- [ ] `async retrieveMemory(key, namespace)` function
- [ ] MCP tool integration via `mcp__claude-flow_alpha__memory_usage`
- [ ] Error handling for missing MCP
- [ ] Export: `module.exports = { storeMemory, retrieveMemory };`

**Estimated Time**: 2 hours

---

#### 3. Fix Test Suite (all test files)

**Files to Modify**:

```bash
sessions/session-1763500195-prompt-improver-refactor/artifacts/tests/caching.test.js
sessions/session-1763500195-prompt-improver-refactor/artifacts/tests/context-aware.test.js
sessions/session-1763500195-prompt-improver-refactor/artifacts/tests/quality-scoring-validation.test.js
```

**Required Changes**:
- [ ] Remove `jest` from `@jest/globals` imports
- [ ] Use global `jest` object only
- [ ] Update: `const { describe, it, expect, beforeEach } = require('@jest/globals');`
- [ ] Verify jest.setup.js compatibility
- [ ] Run and confirm: `npm test` passes

**Estimated Time**: 30 minutes

---

#### 4. Fix Memory Leak

**File to Modify**: `prompt-improver-refactored.js`

**Changes Required**:

```javascript
// BEFORE (unbounded growth):
this.sessionStats = {
  issues: []  // Grows indefinitely
};

// AFTER (bounded):
this.sessionStats = {
  issues: [],
  maxIssues: 100  // Limit to 100 most recent
};

// In improvePrompt():
if (this.sessionStats.issues.length >= this.sessionStats.maxIssues) {
  this.sessionStats.issues.shift();  // Remove oldest
}
this.sessionStats.issues.push(...analysis.interventionAnalysis.allIssues);
```

**Checklist**:
- [ ] Add `maxIssues` config parameter
- [ ] Implement circular buffer logic
- [ ] Update `endSession()` to aggregate before clearing
- [ ] Test with 200+ prompts

**Estimated Time**: 30 minutes

---

#### 5. Create Integration Tests

**File to Create**:

```bash
sessions/session-1763500195-prompt-improver-refactor/artifacts/tests/integration.test.js
```

**Test Cases Required**:
- [ ] Complete workflow: analyze → suggest → confirm → improve
- [ ] Context7 cache hit scenario
- [ ] Context7 cache miss scenario
- [ ] Captain's log persistence verification
- [ ] All three interaction modes
- [ ] Error handling and fallback behavior
- [ ] Memory leak prevention (session with 200 prompts)

**Estimated Time**: 2 hours

---

### ✅ Pre-Deployment Validation

#### 6. Run Full Test Suite

```bash
cd sessions/session-1763500195-prompt-improver-refactor/artifacts/tests
npm test -- --coverage --verbose
```

**Pass Criteria**:
- [ ] All tests passing (0 failures)
- [ ] Coverage ≥ 90%
- [ ] No timeout errors
- [ ] No memory leaks detected

**Documentation**:
- [ ] Update `docs/PERFORMANCE.md` with test results
- [ ] Screenshot coverage report
- [ ] Document any known limitations

---

#### 7. Performance Baseline

**File to Create**:

```bash
sessions/session-1763500195-prompt-improver-refactor/artifacts/scripts/benchmark.js
```

**Benchmarks Required**:
- [ ] First Context7 fetch latency (target: <500ms)
- [ ] Cached Context7 latency (target: <10ms)
- [ ] End-to-end analysis time (target: <1s)
- [ ] Memory usage over 100 prompts (target: <50MB)
- [ ] Token usage comparison (old vs. new)

**Documentation**:
- [ ] Record baseline metrics in `docs/PERFORMANCE.md`
- [ ] Compare with projected performance
- [ ] Document any deviations

---

#### 8. Security Scan

```bash
cd sessions/session-1763500195-prompt-improver-refactor/artifacts/code
npm audit
# Review any HIGH or CRITICAL vulnerabilities
```

**Checklist**:
- [ ] No HIGH or CRITICAL vulnerabilities
- [ ] Document any MODERATE issues
- [ ] Plan remediation for any findings
- [ ] Verify no hardcoded secrets

---

## Deployment Steps

### Phase 1: Backup Current Implementation

```bash
# Create backup directory
mkdir -p .swarm/backups/prompt-improver-v1.0.0-$(date +%Y%m%d)

# Back up current skill
cp -r .claude/skills/prompt-improver/ \
      .swarm/backups/prompt-improver-v1.0.0-$(date +%Y%m%d)/

# Verify backup
ls -la .swarm/backups/prompt-improver-v1.0.0-$(date +%Y%m%d)/
```

**Checklist**:
- [ ] Backup created successfully
- [ ] All files present in backup
- [ ] Backup location documented
- [ ] Git commit of current state: `git commit -am "Backup before refactor deployment"`

---

### Phase 2: Deploy Refactored Code

```bash
# Remove old implementation
rm -rf .claude/skills/prompt-improver/*

# Copy refactored implementation
cp -r sessions/session-1763500195-prompt-improver-refactor/artifacts/code/* \
      .claude/skills/prompt-improver/

# Copy updated SKILL.md
cp sessions/session-1763500195-prompt-improver-refactor/artifacts/docs/SKILL.md \
   .claude/skills/prompt-improver/SKILL.md

# Verify deployment
ls -la .claude/skills/prompt-improver/
```

**Checklist**:
- [ ] Old implementation removed
- [ ] New implementation in place
- [ ] SKILL.md updated
- [ ] All modules present (6 total)
- [ ] Utilities present (2 total)

---

### Phase 3: Smoke Testing

**Run Example Script**:

```bash
cd .claude/skills/prompt-improver
node example-usage.js
```

**Expected Output**:
```json
{
  "shouldImprove": true,
  "originalPrompt": "...",
  "improvedPrompt": "...",
  "improvements": [...],
  "qualityImprovement": {
    "initial": 0.45,
    "estimated": 0.85
  }
}
```

**Checklist**:
- [ ] Script runs without errors
- [ ] Context7 fetch succeeds
- [ ] Improvements generated
- [ ] Captain's log entry created
- [ ] No console errors or warnings

---

### Phase 4: Initial Session Test

**Create test session**:

```bash
# Activate skill
/prompt-improver

# Test vague prompt
"Fix the auth bug"

# Expected: Collaborative mode intervention with suggestions

# Test clear prompt
"Implement JWT authentication in src/auth.js with refresh tokens, saving to sessions/current/artifacts/code/"

# Expected: Silent approval (minimal intervention)
```

**Checklist**:
- [ ] Skill activates correctly
- [ ] Mode detection works
- [ ] Suggestions are relevant
- [ ] Context7 insights appear
- [ ] Captain's log entries persist
- [ ] No crashes or errors

---

### Phase 5: Monitor Production Metrics

**First 24 Hours**:

```bash
# Check captain's log
cat sessions/captains-log/$(date +%Y-%m-%d).md | grep "prompt-improver"

# Check memory usage
mcp__claude-flow_alpha__memory_usage({
  action: "list",
  namespace: "prompt-improver"
})
```

**Metrics to Track**:
- [ ] Error rate < 5%
- [ ] Average analysis time < 1s
- [ ] Context7 cache hit rate > 50%
- [ ] Memory usage stable over time
- [ ] User satisfaction (qualitative)

---

## Rollback Plan

### Triggers for Rollback

Immediately rollback if:
- ❌ Error rate > 10% in first hour
- ❌ Any data loss in captain's log
- ❌ Analysis time > 5s consistently
- ❌ Memory leak detected (>100MB growth)
- ❌ Critical bug affecting core functionality

### Rollback Steps

```bash
# 1. Stop using skill
# (User manually stops invoking /prompt-improver)

# 2. Restore from backup
rm -rf .claude/skills/prompt-improver/*
cp -r .swarm/backups/prompt-improver-v1.0.0-$(date +%Y%m%d)/* \
      .claude/skills/prompt-improver/

# 3. Verify restoration
ls -la .claude/skills/prompt-improver/
node .claude/skills/prompt-improver/example-usage.js  # Old version

# 4. Document failure
echo "## Rollback: $(date)" >> sessions/captains-log/$(date +%Y-%m-%d).md
echo "Reason: [describe issue]" >> sessions/captains-log/$(date +%Y-%m-%d).md

# 5. Create hotfix branch
git checkout -b hotfix/prompt-improver-$(date +%Y%m%d)
git add .
git commit -m "Rollback prompt-improver to v1.0.0 due to [issue]"
```

**Checklist**:
- [ ] Skill functionality restored
- [ ] No data loss confirmed
- [ ] Failure mode documented
- [ ] Hotfix plan created
- [ ] Root cause identified

---

## Post-Deployment

### Week 1: Close Monitoring

**Daily Checks**:
- [ ] Review captain's log for errors
- [ ] Check Context7 cache performance
- [ ] Monitor memory usage trends
- [ ] Collect user feedback
- [ ] Track intervention accuracy

**Weekly Summary**:
- [ ] Total prompts analyzed: ____
- [ ] Total improvements made: ____
- [ ] Context7 consultations: ____
- [ ] Cache hit rate: _____%
- [ ] Average token savings: ____ tokens/query
- [ ] Error rate: _____%
- [ ] User satisfaction: ____/10

---

### Month 1: Optimization

**Performance Tuning**:
- [ ] Adjust intervention threshold based on data
- [ ] Optimize Context7 cache TTL
- [ ] Tune mode detection sensitivity
- [ ] Refine quality scoring weights

**Feature Enhancements**:
- [ ] Add user-reported edge cases
- [ ] Expand template library
- [ ] Improve error messages
- [ ] Enhance learning algorithm

---

## Approval Signatures

### Technical Lead
- **Name**: ________________
- **Date**: ________________
- **Approval**: [ ] YES  [ ] NO (reason: ________________)

### QA Lead
- **Name**: ________________
- **Date**: ________________
- **Test Coverage**: _____%
- **Approval**: [ ] YES  [ ] NO (reason: ________________)

### DevOps Lead
- **Name**: ________________
- **Date**: ________________
- **Deployment Plan Review**: [ ] APPROVED  [ ] NEEDS REVISION
- **Approval**: [ ] YES  [ ] NO (reason: ________________)

---

## Timeline

| Phase | Duration | Dependencies | Status |
|-------|----------|--------------|--------|
| **Pre-Deployment** | | | |
| Implement missing modules | 3.5 hrs | None | ❌ TODO |
| Create Context7 utilities | 2 hrs | None | ❌ TODO |
| Fix test suite | 0.5 hrs | None | ❌ TODO |
| Fix memory leak | 0.5 hrs | None | ❌ TODO |
| Create integration tests | 2 hrs | Modules complete | ❌ TODO |
| Run full test suite | 0.5 hrs | Tests fixed | ❌ TODO |
| Performance baseline | 1 hr | Tests passing | ❌ TODO |
| Security scan | 0.5 hrs | None | ❌ TODO |
| **Deployment** | | | |
| Backup current implementation | 0.25 hrs | None | ❌ TODO |
| Deploy refactored code | 0.25 hrs | Pre-deployment done | ❌ TODO |
| Smoke testing | 0.5 hrs | Deployment complete | ❌ TODO |
| Initial session test | 1 hr | Smoke tests pass | ❌ TODO |
| Monitor production metrics | 24 hrs | Session test complete | ❌ TODO |
| **Total Estimated Time** | **12.5 hrs** | | |

---

## Notes

**Current Blockers**: 5 critical issues
**Estimated Time to Production Ready**: 7 hours (implementation) + 3 hours (testing) + 2.5 hours (deployment) = **12.5 hours total**

**Risk Level**: HIGH (50% incomplete, zero test validation)

**Recommendation**: Complete all pre-deployment requirements before attempting deployment. Do not skip steps.

---

**Checklist Created**: 2025-11-18
**Last Updated**: 2025-11-18
**Session**: session-1763500195-prompt-improver-refactor
