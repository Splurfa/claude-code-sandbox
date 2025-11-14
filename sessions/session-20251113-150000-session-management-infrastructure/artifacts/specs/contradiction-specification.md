# CLAUDE.md Contradiction Specification

## Mission
Fix contradictions in CLAUDE.md regarding file routing and session management protocols.

## Acceptance Criteria
1. ✅ All contradictions resolved with consistent messaging
2. ✅ Session protocol clearly defined and followed throughout
3. ✅ File routing examples use correct `sessions/$SESSION_ID/artifacts/` paths
4. ✅ STOCK claude-flow features remain untouched
5. ✅ No new contradictions introduced
6. ✅ Documentation is clear and unambiguous

---

## Contradiction Analysis

### Contradiction #1: File Organization - Root vs Session Artifacts

**Location**: Lines 54-60 vs Lines 3-12 and 448-456

**Problem**:
- Lines 54-60 say: "Use these directories: `/src`, `/tests`, `/docs`, `/config`, `/scripts`, `/examples`"
- Lines 3-12 say: "**NEVER** write to root `tests/`, `docs/`, `scripts/` - only to session artifacts!"
- Lines 448-456 mandate: "ALL file write operations MUST go to session artifacts"

**Impact**: Critical - Users receive contradictory instructions about where to save files

**Resolution**:
```markdown
REMOVE lines 54-60:
```
**NEVER save to root folder. Use these directories:**
- `/src` - Source code files
- `/tests` - Test files
- `/docs` - Documentation and markdown files
- `/config` - Configuration files
- `/scripts` - Utility scripts
- `/examples` - Example code
```

REPLACE WITH:
```
**File Organization**: ALL working files MUST go to session artifacts directories:
- `sessions/$SESSION_ID/artifacts/code/` - Source code files
- `sessions/$SESSION_ID/artifacts/tests/` - Test files
- `sessions/$SESSION_ID/artifacts/docs/` - Documentation and markdown files
- `sessions/$SESSION_ID/artifacts/scripts/` - Utility scripts
- `sessions/$SESSION_ID/artifacts/notes/` - Notes and working files

**Exception**: Only edit existing project files (like `package.json`, `CLAUDE.md`, etc.) in their original locations.

See "Session Artifacts & Collaborative Closeout" section for complete protocol.
```

---

### Contradiction #2: Example Code - Root Directories vs Session Artifacts

**Location**: Lines 223-226 vs Lines 448-456

**Problem**:
- Lines 223-226 show: `Write "backend/server.js"`, `Write "frontend/App.jsx"`, `Write "database/schema.sql"`
- Lines 448-456 mandate: ALL writes go to `sessions/.../artifacts/`

**Impact**: High - Example code demonstrates incorrect pattern

**Resolution**:
```markdown
CHANGE lines 223-226 FROM:
```
  Write "backend/server.js"
  Write "frontend/App.jsx"
  Write "database/schema.sql"
```

TO:
```
  Write "sessions/$SESSION_ID/artifacts/code/server.js"
  Write "sessions/$SESSION_ID/artifacts/code/App.jsx"
  Write "sessions/$SESSION_ID/artifacts/code/schema.sql"
```

---

### Contradiction #3: Full-Stack Example - Multiple Violations

**Location**: Lines 207-226 (Full example block)

**Problem**:
- Line 212: `Write "backend/server.js"` - wrong path
- Line 213: `Write "frontend/App.jsx"` - wrong path
- Line 214: `Write "database/schema.sql"` - wrong path
- Lines 284-288: `mkdir -p app/{src,tests,docs,config}` - creating root directories

**Impact**: Critical - Core example demonstrates anti-pattern

**Resolution**:
```markdown
CHANGE lines 207-226 FROM:
```javascript
// Single message with all agent spawning via Claude Code's Task tool
[Parallel Agent Execution]:
  Task("Backend Developer", "Build REST API with Express. Use hooks for coordination.", "backend-dev")
  Task("Frontend Developer", "Create React UI. Coordinate with backend via memory.", "coder")
  Task("Database Architect", "Design PostgreSQL schema. Store schema in memory.", "code-analyzer")
  Task("Test Engineer", "Write Jest tests. Check memory for API contracts.", "tester")
  Task("DevOps Engineer", "Setup Docker and CI/CD. Document in memory.", "cicd-engineer")
  Task("Security Auditor", "Review authentication. Report findings via hooks.", "reviewer")

  // All todos batched together
  TodoWrite { todos: [...8-10 todos...] }

  // All file operations together
  Write "backend/server.js"
  Write "frontend/App.jsx"
  Write "database/schema.sql"
```

TO:
```javascript
// Single message with all agent spawning via Claude Code's Task tool
[Parallel Agent Execution]:
  Task("Backend Developer", "Build REST API with Express. Save to sessions/$SESSION_ID/artifacts/code/. Use hooks for coordination.", "backend-dev")
  Task("Frontend Developer", "Create React UI. Save to sessions/$SESSION_ID/artifacts/code/. Coordinate with backend via memory.", "coder")
  Task("Database Architect", "Design PostgreSQL schema. Save to sessions/$SESSION_ID/artifacts/code/. Store schema in memory.", "code-analyzer")
  Task("Test Engineer", "Write Jest tests to sessions/$SESSION_ID/artifacts/tests/. Check memory for API contracts.", "tester")
  Task("DevOps Engineer", "Setup Docker and CI/CD. Save configs to sessions/$SESSION_ID/artifacts/scripts/. Document in memory.", "cicd-engineer")
  Task("Security Auditor", "Review authentication. Report findings to sessions/$SESSION_ID/artifacts/docs/. Report via hooks.", "reviewer")

  // All todos batched together
  TodoWrite { todos: [...8-10 todos...] }

  // All file operations together
  Write "sessions/$SESSION_ID/artifacts/code/server.js"
  Write "sessions/$SESSION_ID/artifacts/code/App.jsx"
  Write "sessions/$SESSION_ID/artifacts/code/schema.sql"
```

---

### Contradiction #4: Concurrent Execution Example - Wrong Paths

**Location**: Lines 252-288 (CORRECT WORKFLOW example)

**Problem**:
- Line 284: `mkdir -p app/{src,tests,docs,config}` - creates root directories
- Lines 285-288: Write to `app/package.json`, `app/src/server.js`, etc. - wrong paths

**Impact**: Critical - "CORRECT" example shows incorrect pattern

**Resolution**:
```markdown
CHANGE lines 283-288 FROM:
```javascript
  // Parallel file operations
  Bash "mkdir -p app/{src,tests,docs,config}"
  Write "app/package.json"
  Write "app/src/server.js"
  Write "app/tests/server.test.js"
  Write "app/docs/API.md"
```

TO:
```javascript
  // Parallel file operations in session artifacts
  Bash "mkdir -p sessions/$SESSION_ID/artifacts/{code,tests,docs,scripts}"
  Write "sessions/$SESSION_ID/artifacts/code/package.json"
  Write "sessions/$SESSION_ID/artifacts/code/server.js"
  Write "sessions/$SESSION_ID/artifacts/tests/server.test.js"
  Write "sessions/$SESSION_ID/artifacts/docs/API.md"
```

---

## Change Summary

| Change # | Lines | Type | Description |
|----------|-------|------|-------------|
| 1 | 54-60 | Replace | Fix root directory instructions → session artifacts |
| 2 | 223-226 | Update | Fix example file paths → session artifacts paths |
| 3 | 207-226 | Update | Fix full-stack example → session artifacts throughout |
| 4 | 284-288 | Update | Fix concurrent execution example → session artifacts |

---

## Testing Strategy

### Test 1: Grep for Contradictions
```bash
# Should find NO instances after fix
grep -n "\/tests\/" CLAUDE.md | grep -v "artifacts/tests"
grep -n "\/docs\/" CLAUDE.md | grep -v "artifacts/docs"
grep -n "\/scripts\/" CLAUDE.md | grep -v "artifacts/scripts"
```

### Test 2: Validate Session Protocol Consistency
```bash
# All Write examples should use sessions/$SESSION_ID/artifacts/ pattern
grep -n "Write \"" CLAUDE.md | grep -v "sessions/\$SESSION_ID/artifacts"
```

### Test 3: Check STOCK Features Intact
```bash
# Verify stock claude-flow commands unchanged
grep -n "npx claude-flow@alpha hooks" CLAUDE.md
grep -n "mcp__claude-flow__" CLAUDE.md
```

### Test 4: Verify No New Root Directory Examples
```bash
# Should return empty or only existing project file modifications
grep -n "mkdir -p" CLAUDE.md | grep -v "sessions"
```

---

## Validation Checklist

- [ ] All 4 contradictions resolved
- [ ] All code examples use `sessions/$SESSION_ID/artifacts/` paths
- [ ] Section 52-60 updated with correct guidance
- [ ] Lines 207-226 example corrected
- [ ] Lines 284-288 example corrected
- [ ] No instances of `Write "root-folder/..."` remain
- [ ] STOCK features unchanged (hooks, MCP tools)
- [ ] Session protocol is consistent throughout
- [ ] No new contradictions introduced
- [ ] Documentation flows logically

---

## Risk Assessment

**Low Risk Changes**:
- Updating example code paths
- Clarifying file organization rules

**Medium Risk Changes**:
- Rewriting section 52-60 (high visibility section)

**Mitigation**:
- Create backup of original CLAUDE.md
- Test changes with grep validation
- Human review before applying

---

## Rollback Plan

If changes introduce issues:
1. Restore from backup: `cp CLAUDE.md.backup CLAUDE.md`
2. Review failed validation tests
3. Iterate on specification
4. Re-apply with fixes

---

## Next Phase: Test Design

After human approval of this specification, proceed to:
1. Design automated validation tests
2. Create test scripts
3. Define pass/fail criteria
4. Prepare test execution plan
