# File Routing Skill

AI self-check reference for CLAUDE.md compliance. **For AI agents only** - users are never restricted.

## Quick Lookup Table

| What You're Creating | Correct Location | Wrong Location |
|---------------------|------------------|----------------|
| Source code | `sessions/$SESSION_ID/artifacts/code/` | `code/`, `/src/`, root |
| Test files | `sessions/$SESSION_ID/artifacts/tests/` | `tests/`, `__tests__/`, root |
| **User-facing guides** | `docs/guides/` | `sessions/*/docs/`, `inbox/`, root |
| **System development docs** | `inbox/assistant/` | `docs/guides/`, `sessions/*/docs/` |
| **Proposals/analysis** | `sessions/$SESSION_ID/artifacts/docs/` | `docs/`, root |
| Build scripts | `sessions/$SESSION_ID/artifacts/scripts/` | `scripts/`, root |
| Notes, ideas | `sessions/$SESSION_ID/artifacts/notes/` | `notes/`, root |

## Content Type Decision Tree

Before creating documentation, ask:

### 1. Is this explaining a feature to users?
   - YES → `docs/guides/` (user-facing)
   - NO → Continue to question 2

### 2. Is this architectural/system development work?
   - YES → `inbox/assistant/` (system work)
   - NO → Continue to question 3

### 3. Is this proposal/analysis requiring HITL review?
   - YES → `sessions/$SESSION_ID/artifacts/docs/` (active work)
   - NO → Ask user for clarification

### Examples by Type

**User-Facing Guides (`docs/guides/`):**
- ✅ How to run integration tests
- ✅ Session management user guide
- ✅ Quick start tutorial
- ✅ Troubleshooting common errors
- ✅ API reference for end users

**System Development (`inbox/assistant/`):**
- ✅ File routing skill needs updating
- ✅ Session protocol contradictions
- ✅ Hook system architecture proposal
- ✅ AgentDB integration analysis
- ✅ Technical debt assessment

**Active Work (`sessions/$SESSION_ID/artifacts/docs/`):**
- ✅ Code quality analysis (this session)
- ✅ Feature implementation proposals
- ✅ Testing results and reports
- ✅ Research findings
- ✅ HITL review packages

## When to Use Root Directories

**Only edit existing files in their original locations:**
- ✅ Edit existing `package.json` (already exists at root)
- ✅ Edit existing `CLAUDE.md` (already exists at root)
- ✅ Edit existing `README.md` (after we've created it)

**Never create new files at root:**
- ❌ Create new `tests/foo.test.js` (should be in session artifacts)
- ❌ Create new `docs/API.md` (should be in session artifacts)

## Common Mistakes to Avoid

### ❌ Wrong: Creating test directory at root
```
tests/
  api.test.js    # CLAUDE.md violation
  auth.test.js   # CLAUDE.md violation
```

### ✅ Correct: Tests in session artifacts
```
sessions/session-20251114-153041-api-development/
  artifacts/
    tests/
      api.test.js
      auth.test.js
```

### ❌ Wrong: Multiple sessions per chat
```
sessions/
  session-20251114-120000-api/
  session-20251114-130000-database/  # Wrong - same chat!
```

### ✅ Correct: One session per chat
```
sessions/
  session-20251114-120000-api-development/
    artifacts/
      code/api.js
      code/database.js  # Sub-task in same session
      notes/api-decisions.md
      notes/db-schema.md
```

## Documentation Guardrails

### ⚠️ Critical Distinction: User vs System Content

**Rule:** `docs/guides/` is for END USERS, not system development

### ❌ Wrong: System work in docs/guides/
```
docs/guides/
  file-routing-skill-analysis.md     # System development, not user guide!
  session-protocol-refactoring.md    # Internal work, not user-facing!
  agentdb-integration-proposal.md    # Architecture work, not user guide!
```

### ✅ Correct: System work in inbox/assistant/
```
inbox/assistant/
  file-routing-skill-needs-update.md   # Architectural problem
  session-protocol-contradictions.md   # System integration issue
  agentdb-integration-architecture.md  # Working on the system
```

### ✅ Correct: User guides in docs/guides/
```
docs/guides/
  getting-started/
    quick-start.md                     # How users start using features
  how-to/
    run-integration-tests.md           # How users run tests
  concepts/
    session-management-explained.md    # What sessions are (user view)
  troubleshooting/
    common-errors.md                   # User troubleshooting
```

### Decision Questions for docs/guides/

Before creating content in `docs/guides/`, ask:

1. **Audience Test**: Is the primary audience an end user?
   - NO → Use `inbox/assistant/` or session artifacts

2. **Purpose Test**: Does this explain HOW to use a feature?
   - NO → Use `inbox/assistant/` or session artifacts

3. **Scope Test**: Is this about the feature, not the codebase?
   - NO → Use `inbox/assistant/` or session artifacts

**All three must be YES for `docs/guides/` placement.**

## Self-Check Questions (For AI Agents)

Before creating a file, ask:

1. **Is this an existing file I'm editing?**
   - YES → Use its current location
   - NO → Continue to question 2

2. **Is this documentation?**
   - NO → Continue to question 5
   - YES → Continue to question 3

3. **Is this a user-facing guide?** (How to use features, end-user docs)
   - YES → Use `docs/guides/{category}/`
   - NO → Continue to question 4

4. **Is this system/architectural work?** (Working on the system itself)
   - YES → Use `inbox/assistant/`
   - NO → Use `sessions/$SESSION_ID/artifacts/docs/`

5. **Is this session work (code, tests, scripts, notes)?**
   - YES → Use `sessions/$SESSION_ID/artifacts/{type}/`
   - NO → Ask user where it should go

6. **Am I certain of the session ID?**
   - YES → Proceed with session path
   - NO → Check `.current-session` file or environment variable

## Quick Reference Commands

**Get current session ID:**
```bash
cat .current-session
# or
echo $SESSION_ID
```

**Verify session directory exists:**
```bash
ls -la sessions/$SESSION_ID/artifacts/
```

**List recent sessions:**
```bash
ls -lt sessions/ | head -10
```

## Real-World Routing Examples

### Scenario 1: Integration Testing Documentation

**Question:** Where does "How to run integration tests" go?

**Analysis:**
- Audience: End users who want to test
- Purpose: Explains HOW to use testing features
- Scope: About the feature, not the codebase

**Answer:** `docs/guides/how-to/run-integration-tests.md` ✅

---

### Scenario 2: File Routing Skill Analysis

**Question:** Where does "File routing skill needs updating" go?

**Analysis:**
- Audience: System developers
- Purpose: Architectural problem identification
- Scope: Working on the system itself

**Answer:** `inbox/assistant/file-routing-skill-update-needed.md` ✅

---

### Scenario 3: Code Quality Analysis Report

**Question:** Where does code quality analysis for current session go?

**Analysis:**
- Audience: HITL review (user + system)
- Purpose: Analysis requiring review
- Scope: Active session work

**Answer:** `sessions/$SESSION_ID/artifacts/docs/code-quality-report.md` ✅

---

### Scenario 4: Session Management User Guide

**Question:** Where does "Understanding session lifecycle" go?

**Analysis:**
- Audience: End users
- Purpose: Explains what sessions are and how they work
- Scope: Feature explanation

**Answer:** `docs/guides/concepts/session-management.md` ✅

---

### Scenario 5: AgentDB Integration Architecture

**Question:** Where does AgentDB integration proposal go?

**Analysis:**
- Audience: System developers
- Purpose: Architectural integration work
- Scope: Working on the system

**Answer:** `inbox/assistant/agentdb-integration-architecture.md` ✅

## Why This Matters

**Workspace pollution:** Root-level files clutter the workspace and make it hard to find project vs. session files

**Session isolation:** Each chat gets its own workspace, making it easy to review/archive/delete without affecting the project

**Traceability:** Clear link between session work and git history (we can see which session created which code)

## User vs AI Operations

**For AI Agents (Claude):**
- ✅ Follow this guide before writing files
- ✅ Use session artifact paths
- ✅ Consult skill when uncertain

**For Users:**
- ✅ Write files anywhere (no restrictions)
- ✅ Override AI suggestions freely
- ✅ Full control always

## Related Documentation

- [CLAUDE.md](../../../CLAUDE.md) - Full file organization rules
- [Session Management](../../../sessions/README.md) - Complete session lifecycle
- [North Star Spec](../../session-20251114-153041-dream-hive-meta-coordination/artifacts/docs/north-star-spec.md) - Why we do this

---

**Remember:** When in doubt, use session artifacts. This is guidance for AI agents to self-check before writing files.
