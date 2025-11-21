# FINDING-003: Session Naming Protocol Violations

**Status**: Open
**Type**: Bug/Education
**Priority**: High
**Root Cause**: User (manual session creation bypassing protocol)
**Created**: 2025-11-21
**Updated**: 2025-11-21
**Resolved**: N/A

## Problem Statement

Session directories are sometimes created with improper naming that violates the established protocol: `session-YYYYMMDD-HHMMSS-topic`. This breaks session tracking, archival workflows, and makes it harder to find sessions chronologically.

## Evidence

**Found Violations**:
- `sessions/current/` - Should be `session-20251XXX-XXXXXX-topic`
- `sessions/.hive-mind/` - Hidden directory, doesn't follow naming convention

**Protocol Documented In**:
- `CLAUDE.md` Section "SESSION MANAGEMENT PROTOCOL"
- `docs/operate/session-management.md`

**Impact**:
- Breaks automated session listing (sorted by timestamp)
- Confuses archival scripts (can't parse date from dirname)
- Hidden directories (`.hive-mind`) skipped by some tools

## Root Cause Analysis

**Why Violations Occur**:

1. **Manual Creation**: User creates directories manually without using `/session-start` command
2. **Command Not Implemented**: `/session-start` documented but not functional/discoverable
3. **Agent Creation**: Agents sometimes create workspace dirs without following protocol
4. **Convenience**: `sessions/current/` feels simpler than full timestamp

**Why Protocol Exists**:
- Chronological sorting via filename
- Session ID uniqueness guaranteed
- Timestamp = session creation time (valuable metadata)
- Automated tools depend on format

## Proposed Solution

### Short-term (Education + Enforcement)
- [ ] Add to CLAUDE.md (bold/caps): "NEVER manually create session directories"
- [ ] Document current workaround: Create then rename
- [ ] Add examples of correct naming in docs
- [ ] During workspace cleanup: Rename non-compliant sessions

### Long-term (Automation)
- [ ] Implement `/session-start <topic>` command:
  ```bash
  npx claude-flow@alpha session start <topic>
  # Creates: sessions/session-$(date +%Y%m%d-%H%M%S)-<topic>/
  ```
- [ ] Add pre-commit hook: Reject commits with improperly named session dirs
- [ ] Whitelist: Only allow `sessions/session-*` or `sessions/.archive/` or `sessions/captains-log/` or `sessions/issues/`
- [ ] Auto-suggest fix: "Did you mean: sessions/session-20251121-143022-current?"

### Validation Script
```bash
# sessions/issues/validate-session-naming.sh
for dir in sessions/*/; do
  if [[ ! "$dir" =~ ^sessions/(session-[0-9]{8}-[0-9]{6}-[a-z0-9-]+|\.archive|captains-log|issues)/$ ]]; then
    echo "⚠️ Invalid session name: $dir"
  fi
done
```

## Related Findings

- Related to FINDING-007 (Missing `/session-start` command)
- Related to FINDING-008 (File routing compliance - similar enforcement needed)

## Resolution Notes

**Status**: Open - Need to implement `/session-start` command and validation

**Cleanup Required**:
- Rename `sessions/current/` to proper format
- Rename `sessions/.hive-mind/` or archive it

**Next Steps**:
1. Implement session-start command
2. Add validation to pre-commit
3. Document in multiple locations
4. Clean up existing violations
