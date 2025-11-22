# ISSUE-002: Documentation-Code Synchronization Confusion

**Status**: Open
**Type**: Process
**Priority**: High
**Root Cause**: Hybrid (User workflow + System tracking)
**Created**: 2025-11-21
**Updated**: 2025-11-21
**Resolved**: N/A

## Problem Statement

Sessions performing **investigation or planning** are sometimes documented as "deployment complete" in summaries, leading to confusion about what code actually exists in production. This creates false confidence and wastes time when trying to use "deployed" features.

## Evidence

**Captain's Log**:
- `sessions/captains-log/2025-11-18.md`:
  > "Meta-skill bug fixes session (20251116) claimed 'deployed' but Issue #1 was NOT in production code. Session was investigation/planning, not deployment."

**Session Summaries**:
- Multiple sessions marked "Status: Deployed" when only planning/design occurred
- No git commits or file changes to verify deployment claim

**Pattern**:
- Investigation sessions end with recommendations
- Recommendations documented as "completed work"
- No verification step: "Was code actually changed?"

## Root Cause Analysis

**Contributing Factors**:

1. **Session Goal Ambiguity**: Investigation vs deployment sessions not clearly distinguished
2. **Summary Template**: No verification checklist for "deployed" claim
3. **Git Integration Gap**: Not checking `git status` or `git diff` before claiming deployment
4. **Eager Completion**: Desire to mark work "done" even when it's "planned"

**Why This Matters**:
- Creates technical debt in documentation
- Wastes time debugging "missing features"
- Erodes trust in session summaries
- Makes it hard to know actual system state

## Proposed Solution

### Short-term (Process Improvements)
- [ ] Add session type to naming: `session-YYYYMMDD-HHMMSS-INVESTIGATION-topic` vs `session-YYYYMMDD-HHMMSS-DEPLOYMENT-topic`
- [ ] Create deployment verification checklist:
  - [ ] `git diff` shows file changes
  - [ ] Code files exist at documented paths
  - [ ] Tests pass for new functionality
  - [ ] Feature demonstrable (not just planned)
- [ ] Add to session closeout: "Was code deployed? YES/NO"

### Long-term (Automation)
- [ ] Pre-closeout hook: Check if any files were modified via Write/Edit tools
- [ ] If no files modified → Warn: "No code changes detected, mark as investigation?"
- [ ] Require evidence for "deployed" claim: file paths + line numbers
- [ ] Auto-generate deployment checklist in summary

## Related Issues

- Related to ISSUE-007 (Missing session management commands - could enforce session types)

## Resolution Notes

**Status**: Open - Need to implement verification checklist and session type distinction

**Next Steps**:
1. Add session type guidance to CLAUDE.md
2. Create pre-closeout verification script
3. Test on next 3 sessions (1 investigation, 1 deployment, 1 hybrid)
4. Refine based on results
