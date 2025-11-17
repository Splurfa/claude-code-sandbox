# Session Management

## Overview

Every chat conversation = one session. Sessions auto-initialize on your first message and provide isolated workspaces for all artifacts.

**Why sessions?** Keep work organized, enable context switching, make collaboration traceable, and allow safe experimentation without polluting the main workspace.

## Session Lifecycle

### 1. Auto-Initialization (First Message)

When you start a new chat, the system automatically:

```bash
# Generates session ID from timestamp + topic
SESSION_ID="session-20251114-120738-api-development"

# Creates directory structure
sessions/session-20251114-120738-api-development/
  artifacts/
    code/        # All source code files
    tests/       # All test files
    docs/        # Documentation and markdown
    scripts/     # Utility scripts
    notes/       # Working notes and ideas
  metadata.json  # Session metadata
  session-summary.md  # Auto-updated progress tracking
```

**Topic inference:** The system reads your first message to create a meaningful session name. "Build a REST API" → `session-YYYYMMDD-HHMMSS-rest-api`

### 2. During Work (File Routing)

**ABSOLUTE RULE:** All new files go to `sessions/<session-id>/artifacts/` subdirectories.

| What You're Creating | Where It Goes | Example |
|---------------------|---------------|---------|
| Source code | `artifacts/code/` | `artifacts/code/server.js` |
| Test files | `artifacts/tests/` | `artifacts/tests/server.test.js` |
| Documentation | `artifacts/docs/` | `artifacts/docs/API.md` |
| Build scripts | `artifacts/scripts/` | `artifacts/scripts/deploy.sh` |
| Notes, ideas | `artifacts/notes/` | `artifacts/notes/architecture.md` |

**Exception:** Only existing project files (like `package.json`, `CLAUDE.md`) get edited in their original locations.

**Why this matters:**
- ✅ Clear separation between sessions
- ✅ Easy to review all session outputs in one place
- ✅ Safe to delete old sessions without breaking the project
- ✅ Natural handoff points when sharing work

### 3. Session Closeout (Human-In-The-Loop)

When you're ready to wrap up (say "done" or "close session"):

**Step 1: Collect** - System generates summary
```bash
npx claude-flow@alpha hooks session-end --generate-summary true
```

**Step 2: Review** - You receive:
- Auto-generated summary of all work done
- Index of all files created in `artifacts/`
- Proposed categorization of findings

**Step 3: Approve** - After your review/annotations:
- Approved summary copies to Captain's Log
- Session state archives to `.swarm/backups/`
- Session marked as closed

**Step 4: Promote (Optional)** - Move artifacts to project structure:
```bash
# Example: Promote API docs to project docs
mv sessions/<session-id>/artifacts/docs/API.md docs/projects/rest-api/
```

All promotions are logged automatically, maintaining traceability back to the originating session.

## Session Scope: One Chat = One Session

**✅ CORRECT:**
```
New chat: "Build authentication system"
→ sessions/session-20251114-120000-authentication/
  → artifacts/code/auth.js
  → artifacts/tests/auth.test.js
  → artifacts/docs/auth-flow.md
  → artifacts/notes/security-decisions.md  (sub-task notes)
  → artifacts/notes/database-schema.md     (sub-task notes)
```

**❌ WRONG:**
```
New chat: "Build authentication system"
→ sessions/session-20251114-120000-authentication/
→ sessions/session-20251114-121500-database-design/  ← WRONG! Same chat
→ sessions/session-20251114-130000-jwt-tokens/       ← WRONG! Same chat
```

**Sub-tasks use subdirectories within artifacts/**, not new sessions.

## Examples

### Example 1: Feature Development

```
Chat starts: "Add user registration endpoint"

Auto-created:
sessions/session-20251114-143000-user-registration/
  artifacts/
    code/
      routes/register.js
      models/User.js
      validators/userSchema.js
    tests/
      register.test.js
      User.test.js
    docs/
      registration-api.md
    notes/
      validation-rules.md
      password-hashing-decisions.md
  metadata.json
  session-summary.md

Work continues in this session for entire chat.
When done: Review summary → Approve → Archive → Promote code to main project
```

### Example 2: Bug Investigation

```
Chat starts: "Debug authentication timeout issue"

Auto-created:
sessions/session-20251114-155000-auth-timeout-debug/
  artifacts/
    notes/
      reproduction-steps.md
      timeout-analysis.md
    scripts/
      test-timeout.sh
      log-analyzer.py
    docs/
      root-cause-analysis.md
      fix-proposal.md
  metadata.json
  session-summary.md

Closeout captures the investigation trail and solution.
Archive preserves debugging knowledge for future reference.
```

## Captain's Log Integration

After session closeout, approved summaries flow to:
```
sessions/captains-log/YYYY-MM-DD.md
```

This creates a time-indexed narrative of decisions, blockers, and learnings across all sessions.

**Why separate from session summaries?**
- Captain's Log is curated (only approved insights)
- Session summaries are comprehensive (all work details)
- Log is for learning, summaries are for traceability

## Session Continuity

**Starting work in a new chat:**
- System checks for `$SESSION_ID` in environment
- If none exists, auto-initializes new session
- Previous session context available via memory queries

**Restoring previous session:**
```bash
npx claude-flow@alpha hooks session-restore --session-id "session-20251114-120000-api"
```

## Related Documentation

- [Infrastructure Storage](../.swarm/README.md) - Where session state is persisted
- [CLAUDE.md](../CLAUDE.md) - Full configuration and agent protocols
- [Project README](../README.md) - Workspace overview and principles

## Stock Infrastructure

All session management uses stock claude-flow hooks:
- `pre-task` - Session initialization
- `post-edit` - File tracking and memory updates
- `post-task` - Progress tracking
- `session-end` - Closeout and archival
- `session-restore` - Context restoration

No custom framework, no reinvention. When claude-flow improves, your sessions improve automatically.
