# Known Issues - To Fix in Clean Rebuild

**Session**: session-20251115-165054-clean-workspace-rebuild
**Created**: 2025-11-15
**Status**: Documented for migration team

---

## 🐛 Critical Bugs to Address

### 1. Session-Closeout Duration Calculation Bug

**Severity**: High
**Component**: `.claude/skills/session-closeout/`
**Reported**: 2025-11-15

**Problem**:
- Session duration calculated using collective hooks' timestamps
- Should use actual session start/end times from metadata
- Example: Reported 70 hours when session was much shorter

**Root Cause**:
- Likely using hook execution times instead of session lifecycle times
- May be summing hook durations instead of calculating session span

**Fix Required**:
```javascript
// ❌ WRONG: Using hooks timestamps
const duration = hooks.reduce((total, hook) => total + hook.duration, 0);

// ✅ CORRECT: Using session metadata
const sessionStart = metadata.created_at;
const sessionEnd = metadata.closed_at || new Date();
const duration = sessionEnd - sessionStart;
```

**Priority**: Fix in Phase 1 (Foundation)
**Test**: Add unit test validating duration calculation

---

### 2. Plan Mode Session Initialization Missing

**Severity**: Medium
**Component**: Session startup protocols
**Reported**: 2025-11-15

**Problem**:
- Starting chat in plan mode doesn't auto-initialize session
- Starting chat outside plan mode DOES auto-initialize session
- Inconsistent behavior between modes

**Root Cause**:
- Session startup protocols location unknown in current iteration
- May be hooked to non-plan mode entry points only
- Missing plan mode lifecycle hook

**Fix Required**:
1. Locate session startup protocols (likely in hooks or skills)
2. Ensure plan mode triggers same session initialization
3. Add consistent session detection across all modes

**Example Expected Behavior**:
```bash
# Both should create session-YYYYMMDD-HHMMSS-<topic>/
- New chat in plan mode → Auto-create session ✅
- New chat outside plan mode → Auto-create session ✅
```

**Priority**: Fix in Phase 2 (Skills)
**Test**: Add integration test for plan mode session initialization

---

### 3. Bash Substitution Not Executing in Session Creation

**Severity**: Low (Symptom of broader issue)
**Component**: Session creation scripts
**Reported**: 2025-11-15

**Problem**:
- Literal directory created: `sessions/session-$(date +%Y%m%d-%H%M%S)-clean-workspace-rebuild`
- Bash substitution `$(date ...)` not executing
- Likely from agent attempting session closeout

**Root Cause**:
- Bash command wrapped in single quotes instead of being executed
- Shell substitution disabled in execution context

**Fix Required**:
```bash
# ❌ WRONG: String literal with command
SESSION_DIR="sessions/session-$(date +%Y%m%d-%H%M%S)-clean-workspace-rebuild"

# ✅ CORRECT: Execute first, then use result
SESSION_ID="session-$(date +%Y%m%d-%H%M%S)-clean-workspace-rebuild"
mkdir -p "sessions/$SESSION_ID"
```

**Priority**: Fix in Phase 1 (cleanup malformed directory)
**Cleanup**: Remove malformed directory before migration

---

## 📋 Impact on Clean Rebuild

### Bugs to Fix During Migration

| Bug | Phase | Component | Action |
|-----|-------|-----------|--------|
| Duration calculation | 1 | session-closeout skill | Rewrite calculation logic |
| Plan mode init | 2 | Session startup | Add plan mode hook |
| Bash substitution | 1 | Cleanup | Remove malformed dir, fix scripts |

### Testing Requirements

**Add Test Coverage**:
1. ✅ Session duration calculation accuracy
2. ✅ Plan mode session initialization
3. ✅ Bash script execution validation

**Test Files to Create**:
- `tests/unit/session-duration.test.js`
- `tests/integration/plan-mode-session.test.js`
- `tests/unit/session-creation.test.js`

---

## 🎯 Clean Rebuild Benefits

These issues demonstrate why the clean rebuild is needed:

✅ **First Principles**: Session lifecycle properly designed from stock foundation
✅ **Clear Location**: Session startup protocols in documented `.claude/skills/`
✅ **Tested**: Comprehensive test suite catches these bugs early
✅ **Stock-First**: Use stock claude-flow session management patterns

---

## 📁 Files to Review

Current implementation (to understand bugs):
- `.claude/skills/session-closeout/SKILL.md`
- Session startup hook locations (TBD - unknown in current iteration)
- Any session creation scripts in `.claude/hooks/`

Clean rebuild implementation:
- `sessions/session-20251115-165054-clean-workspace-rebuild/artifacts/code/skills/session-management-skill.md`
- Migration scripts with proper bash execution

---

## 🔗 Related Documents

- [Migration Strategy](./migration-strategy.md) - Phases for fixing bugs
- [Test Plan](../tests/test-plan.md) - Test coverage for these issues
- [Architecture Design](./architecture-design.md) - Proper session lifecycle design

---

**Status**: Documented and ready for migration team to address
