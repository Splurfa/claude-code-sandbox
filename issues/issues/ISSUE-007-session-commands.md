# ISSUE-007: Missing Session Management Commands

**Status**: Open
**Type**: Bug/Education
**Priority**: High
**Root Cause**: System (commands documented but not implemented)
**Created**: 2025-11-21
**Updated**: 2025-11-21
**Resolved**: N/A

## Problem Statement

Session management commands `/session-start` and `/session-closeout` are documented in CLAUDE.md as user-facing commands, but they are not implemented, discoverable, or functional. Users must manually create session directories and run closeout workflows.

## Evidence

**Documentation Claims**:
- `CLAUDE.md` Section "SESSION MANAGEMENT PROTOCOL":
  > "User-initiated session commands:"
  > "- `/session-start <topic>` - Create new session"
  > "- `/session-closeout` - End current session (with HITL approval)"

**Reality**:
- Running `/session-start test` → "Command not found" or no response
- Session creation is manual: `mkdir sessions/session-$(date +%Y%m%d-%H%M%S)-topic`
- `/session-closeout` exists as slash command but not always discoverable

**Impact**:
- Users confused: "Why doesn't the documented command work?"
- Manual workflow increases friction
- Inconsistent session naming (ISSUE-003)

## Root Cause Analysis

**Why Commands Missing**:

1. **Documentation-First Development**: Docs written before implementation
2. **Slash Command vs CLI**: Unclear if `/session-start` should be:
   - Claude Code slash command (`.claude/commands/session-start.md`)
   - CLI command (`npx claude-flow session start`)
   - Bash alias
3. **No Implementation Tracking**: No checklist linking docs to code
4. **Low Priority**: Manual workflow "good enough" so automation delayed

**Why This Matters**:
- Erodes trust in documentation
- Creates friction in daily workflow
- Leads to protocol violations (ISSUE-003)
- Makes onboarding harder for new users

## Proposed Solution

### Short-term (Documentation Fix)
- [ ] Update CLAUDE.md to reflect reality:
  ```markdown
  **Session Management (Manual)**:
  1. Create session: `mkdir sessions/session-$(date +%Y%m%d-%H%M%S)-<topic>`
  2. Create artifacts: `mkdir -p sessions/$SESSION_ID/artifacts/{code,tests,docs,scripts,notes}`
  3. Close session: Run `/session-closeout` slash command

  🚧 **Planned**: `/session-start` command for automated creation
  ```

### Long-term (Implementation)

**Option A: Slash Command** (Recommended)
```bash
# Create: .claude/commands/session-start.md
Create a new session directory with proper naming and structure.

Usage: /session-start <topic>

This will:
1. Generate session ID: session-$(date +%Y%m%d-%H%M%S)-<topic>
2. Create directory: sessions/$SESSION_ID/
3. Create artifacts: artifacts/{code,tests,docs,scripts,notes}/
4. Create README.md with session metadata
5. Store session ID in memory for current context
```

**Option B: CLI Command**
```bash
npx claude-flow@alpha session start <topic>
# Creates: sessions/session-YYYYMMDD-HHMMSS-<topic>/
```

**Option C: Bash Alias**
```bash
alias session-start='mkdir -p sessions/session-$(date +%Y%m%d-%H%M%S)-$1/artifacts/{code,tests,docs,scripts,notes}'
session-start my-feature
```

### Implementation Plan
- [ ] Decide: Slash command vs CLI vs alias
- [ ] Implement chosen approach
- [ ] Test: Create 5 sessions using new command
- [ ] Validate: Proper naming, structure, no manual steps
- [ ] Document in multiple places (CLAUDE.md, README, docs/)
- [ ] Add to statusline or make highly discoverable

## Related Issues

- Directly causes ISSUE-003 (session naming violations)
- Part of ISSUE-006 (integration-documentation gap)

## Resolution Notes

**Status**: Open - Need to decide implementation approach and execute

**Decision Required**: Which option (A, B, or C)?
- **Slash Command**: Most discoverable, native to Claude Code
- **CLI**: Most powerful, can include validation and templates
- **Bash Alias**: Simplest, but least discoverable

**Next Steps**:
1. User chooses implementation approach
2. Implement command
3. Test extensively
4. Update all documentation
5. Mark resolved when command functional and documented
