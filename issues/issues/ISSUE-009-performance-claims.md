# ISSUE-009: Performance Claims Unverified

**Status**: Open
**Type**: Improvement
**Priority**: Low
**Root Cause**: User (no local benchmarking run)
**Created**: 2025-11-21
**Updated**: 2025-11-21
**Resolved**: N/A

## Problem Statement

CLAUDE.md documents performance claims from upstream claude-flow (84.8% SWE-Bench solve rate, 32.3% token reduction, 2.8-4.4x speed improvement) but these are not verified locally for this workspace. It's unclear if these benefits apply to this specific configuration and usage patterns.

## Evidence

**Documentation Claims**:
- `CLAUDE.md`: "84.8% SWE-Bench solve rate"
- `CLAUDE.md`: "32.3% token reduction"
- `CLAUDE.md`: "2.8-4.4x speed improvement"

**Workspace Audit**:
- Captain's log note: "All performance claims unverified (no local benchmarks)"

**Reality**:
- Claims are from upstream claude-flow repository
- Not tested in this specific workspace configuration
- Custom extensions may affect performance differently
- No baseline measurements to compare against

## Root Cause Analysis

**Why Claims Unverified**:

1. **Upstream Documentation**: Claims copied from official docs without local validation
2. **No Benchmarking Habit**: No routine performance testing
3. **Good Enough**: System works well subjectively, no need to measure
4. **Benchmark Effort**: Running formal benchmarks requires setup and time

**Why This Matters (or Doesn't)**:
- **Low Priority**: System works well, exact numbers not critical
- **Transparency**: Should distinguish "upstream claims" from "verified locally"
- **Custom Config**: This workspace has extensions (sessions/, issues/, etc.) that may affect performance
- **Honest Documentation**: Avoid misleading users about capabilities

## Proposed Solution

### Short-term (Documentation Honesty)
- [x] Mark claims as upstream:
  ```markdown
  ## Performance Benefits (Upstream Claims)

  According to claude-flow documentation:
  - 84.8% SWE-Bench solve rate ⭐ (upstream)
  - 32.3% token reduction ⭐ (upstream)
  - 2.8-4.4x speed improvement ⭐ (upstream)
  - 27+ neural models ⭐ (upstream)

  ⭐ = Upstream claim, not verified in this workspace
  ```

### Long-term (Local Verification) - Optional
- [ ] **If desired**: Run local benchmarks
  ```bash
  npx claude-flow@alpha benchmark run --suite all
  ```
- [ ] **If desired**: Track performance over time
  - Session completion time
  - Token usage per session
  - Agent spawn time
  - Memory query latency
- [ ] **If desired**: Compare stock vs extended config
  - Baseline: Stock claude-flow workspace
  - Extended: This workspace with sessions/, issues/, etc.
  - Measure: Impact of custom features

### Benchmark Plan (If Pursued)
```markdown
1. **Baseline Measurement** (Stock claude-flow)
   - Task: "Implement REST API with auth"
   - Measure: Time, tokens, quality

2. **Extended Measurement** (This workspace)
   - Same task, same prompt
   - Measure: Time, tokens, quality
   - Compare: Overhead of custom features

3. **Document Results**
   - If better: Document improvements
   - If worse: Document trade-offs
   - If same: Document "no impact"
```

## Related Issues

- Related to ISSUE-006 (documentation-reality gaps)

## Resolution Notes

**Status**: Open - Documentation updated to show upstream claims, local verification optional

**Decision**:
- **Minimum**: Mark as upstream claims (DONE in proposal)
- **Optional**: Run local benchmarks if user wants verification
- **Priority**: Low (system works well, exact numbers not critical)

**Next Steps**:
1. Update CLAUDE.md with upstream disclaimer
2. User decides: Run benchmarks or leave as-is?
3. If benchmarks desired: Run and document
4. Mark resolved once documentation accurate
