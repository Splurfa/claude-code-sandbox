# Session Lifecycle Guide

## Overview

This guide documents the complete lifecycle of a claude-flow development session, from initialization through closeout. Following these patterns ensures consistent state management, proper coordination, and reliable context persistence across sessions.

**Key Principle**: Every session follows a 4-phase lifecycle: **Start → Work → Closeout → Archive**

## Session Artifact Workspace

- Each new session automatically creates `sessions/<session-id>/artifacts/`. Agents write **everything** here so outputs never scatter.
- Agents are encouraged (but not forced) to add helpful subfolders such as `notes/`, `drafts/`, `handoffs/`, or `research/` inside the artifacts directory to keep collaborative work tidy.
- Claude Code continuously maintains `session-summary.md` inside the artifacts folder, mirroring the conversational summary as the session progresses.
- The artifacts folder stays writable only while the session is active. Once closeout is approved, the directory becomes read-only and serves as the canonical record for that session.

## Session Start Workflow

### Phase 1: Pre-Task Hook Initialization

Every session begins with the pre-task hook to establish context and coordination.

```bash
npx claude-flow@alpha hooks pre-task \
  --description "Brief description of what you're working on"
```

**What this does**:
- Generates unique task ID for tracking
- Initializes memory database if needed
- Logs task start timestamp
- Creates coordination entry in memory
- Prepares neural patterns for learning

**Example**:
```bash
npx claude-flow@alpha hooks pre-task \
  --description "Build REST API for user authentication with JWT tokens"

# Output:
# 🔄 Executing pre-task hook...
# 📋 Task: Build REST API for user authentication with JWT tokens
# 🆔 Task ID: task-1763015548037-2cal1ylpy
# 💾 Saved to .swarm/memory.db
```

**Save the Task ID** - you'll need it for post-task hooks and session tracking.

### Phase 1.5: Prepare Session Artifacts Folder

```bash
mkdir -p "sessions/<session-id>/artifacts"
```

- Claude Code expects this folder to exist before agents begin writing.
- Agents can create any subfolders they need inside `artifacts/`, but **all** files for the session must live somewhere under this directory until closeout completes.

### Phase 2: Load Previous Context

Restore context from previous sessions before starting new work.

```bash
# Option 1: Restore full session state
npx claude-flow@alpha hooks session-restore \
  --session-id "swarm-20251113-auth-work"

# Option 2: Query recent captain's log entries
npx claude-flow@alpha memory search \
  --namespace "captains-log" \
  --pattern "journal:2025-11-13-*"

# Option 3: Check last session's task results
npx claude-flow@alpha memory search \
  --namespace "hooks:post-task" \
  --pattern "*" | tail -n 3
```

**What to look for**:
- Recent decisions affecting current work
- Open blockers or questions
- Related task IDs or file references
- Architecture decisions

### Phase 3: Coordination Setup (For Multi-Agent Work)

If working with multiple agents, initialize coordination topology.

```bash
# Initialize swarm for coordinated work
npx claude-flow@alpha swarm init \
  --topology mesh \
  --max-agents 4

# Store coordination metadata
npx claude-flow@alpha memory store \
  --namespace "session-state" \
  --key "current-swarm-id" \
  --value "swarm-20251113-auth"
```

### Phase 4: Review Open Items

Check for unfinished business from previous sessions.

```bash
# Find unreviewed captain's log entries
npx claude-flow@alpha memory search \
  --namespace "captains-log" \
  --pattern "*" | grep "\"hitl_reviewed\": false"

# Check for blockers
npx claude-flow@alpha memory search \
  --namespace "captains-log" \
  --pattern "*" | grep "\"type\": \"blocker\""
```

## During Session: Active Work Patterns

### Managed Session Summary

- Claude Code maintains `sessions/<session-id>/artifacts/session-summary.md` in parallel with the chat conversation.
- Agents append concise updates after meaningful milestones so the file always reflects the best available narrative.
- Treat the summary as a living document: annotate decisions, reference artifact paths, and note pending HITL questions so closeout review is effortless.

### When to Use Hooks

#### Post-Edit Hook (After File Modifications)
Trigger after creating or modifying files:

```bash
npx claude-flow@alpha hooks post-edit \
  --file "src/auth/jwt.service.ts" \
  --memory-key "swarm/coder/auth-service"
```

**What this does**:
- Auto-formats code if configured
- Updates memory with file state
- Trains neural patterns on edit patterns
- Tracks file changes for coordination

#### Notify Hook (For Agent Coordination)
Use when agents need to share status or findings:

```bash
npx claude-flow@alpha hooks notify \
  --message "Authentication service implementation complete. JWT validation tested and working."
```

**When to notify**:
- Completing a major subtask
- Discovering issues affecting other agents
- Finishing a coordinated piece of work

### Memory Storage Patterns

#### Store Task Progress
```bash
npx claude-flow@alpha memory store \
  --namespace "task-progress" \
  --key "task-1763015548037-2cal1ylpy-status" \
  --value '{
    "task_id": "task-1763015548037-2cal1ylpy",
    "status": "in_progress",
    "completed_steps": ["database_schema", "jwt_service", "auth_routes"],
    "pending_steps": ["integration_tests", "documentation"],
    "blockers": []
  }'
```

#### Store Architecture Decisions
```bash
npx claude-flow@alpha memory store \
  --namespace "architecture" \
  --key "decision-jwt-strategy-20251113" \
  --value '{
    "decision": "Use JWT with refresh tokens",
    "rationale": "Stateless authentication, scalable, industry standard",
    "alternatives_considered": ["Session-based auth", "OAuth only"],
    "date": "2025-11-13",
    "task_id": "task-1763015548037-2cal1ylpy"
  }'
```

#### Store Test Results
```bash
npx claude-flow@alpha memory store \
  --namespace "test-results" \
  --key "test-run-20251113-140000" \
  --value '{
    "timestamp": "2025-11-13T14:00:00Z",
    "coverage": "94%",
    "tests_passed": 87,
    "tests_failed": 0,
    "files_tested": ["auth.service.test.ts", "jwt.service.test.ts"]
  }'
```

### Captain's Log Integration

Log significant events during active work (see captain-log-protocol.md for details):

```bash
# Log a decision
npx claude-flow@alpha memory store \
  --namespace "captains-log" \
  --key "journal:2025-11-13-14:30:00" \
  --value '{"type": "decision", "title": "...", ...}'

# Log an insight
npx claude-flow@alpha memory store \
  --namespace "captains-log" \
  --key "journal:2025-11-13-15:00:00" \
  --value '{"type": "insight", "title": "...", ...}'

# Log a blocker requiring HITL
npx claude-flow@alpha memory store \
  --namespace "captains-log" \
  --key "journal:2025-11-13-15:30:00" \
  --value '{"type": "blocker", "title": "...", "hitl_reviewed": false, ...}'
```

- At closeout, the final `session-summary.md` (stored in `sessions/<session-id>/artifacts/`) becomes the source text for the Captain's Log entry after you approve it.

## Session Closeout: The 4-Step Process

Session closeout ensures all work is properly documented, reviewed, and archived before ending the session.

### Step 1: COLLECT - Gather Session Artifacts

Collect all relevant artifacts from the session for review.

```bash
# 1. Get task metadata from pre-task hook
npx claude-flow@alpha memory retrieve \
  --namespace "hooks:pre-task" \
  --key "task-1763015548037-2cal1ylpy"

# 2. List all files modified during session
npx claude-flow@alpha memory search \
  --namespace "hooks:post-edit" \
  --pattern "task-1763015548037-*"

# 3. Retrieve captain's log entries from session
npx claude-flow@alpha memory search \
  --namespace "captains-log" \
  --pattern "journal:2025-11-13-*"

# 4. Get test results
npx claude-flow@alpha memory search \
  --namespace "test-results" \
  --pattern "test-run-20251113-*"

# 5. Collect performance metrics if available
npx claude-flow@alpha memory search \
  --namespace "performance" \
  --pattern "*"
```

- Confirm `sessions/<session-id>/artifacts/session-summary.md` is up to date before proceeding.

**Create collection summary**:
```bash
npx claude-flow@alpha memory store \
  --namespace "session-closeout" \
  --key "collect-task-1763015548037-summary" \
  --value '{
    "task_id": "task-1763015548037-2cal1ylpy",
    "files_modified": ["src/auth/jwt.service.ts", "src/routes/auth.routes.ts"],
    "tests_run": "87 passed, 0 failed",
    "coverage": "94%",
    "log_entries": 5,
    "decisions": 2,
    "insights": 1,
    "blockers": 0
  }'
```

### Step 2: CLASSIFY - Categorize and Tag Artifacts

Classify session work for future discoverability.

```bash
npx claude-flow@alpha memory store \
  --namespace "session-closeout" \
  --key "classify-task-1763015548037" \
  --value '{
    "task_id": "task-1763015548037-2cal1ylpy",
    "categories": ["authentication", "security", "backend"],
    "work_type": "feature_development",
    "complexity": "medium",
    "quality_score": 9.4,
    "completion_status": "complete",
    "follow_up_required": false,
    "related_tasks": [],
    "tags": ["jwt", "auth", "rest-api", "security"]
  }'
```

**Classification dimensions**:
- **Categories**: Domain areas (auth, database, api, etc.)
- **Work type**: feature_development, bug_fix, refactoring, documentation
- **Complexity**: low, medium, high
- **Quality score**: 0-10 based on tests, coverage, review
- **Completion status**: complete, partial, blocked, deferred
- **Follow-up required**: true/false

### Step 3: HITL - Human-in-the-Loop Review

Present session work for human approval before archiving.

#### 3.1: Prepare Review Summary

```bash
# Generate human-readable summary
# Review the auto-generated session summary
cat sessions/<session-id>/artifacts/session-summary.md

# Optionally capture additional notes if needed
cat << EOF > /tmp/session-review-addendum.md
- Outstanding questions:
- Pending approvals:
EOF
```

#### 3.2: HITL Checkpoint Questions

Present these checkpoints for user approval:

1. **Quality Check**: Are tests comprehensive and passing?
2. **Security Check**: Any security concerns with implemented auth?
3. **Architecture Check**: Does this align with system design?
4. **Documentation Check**: Is documentation complete and accurate?
5. **Blockers**: Are there unresolved blockers?

#### 3.3: Store HITL Approval

```bash
# After user approval
# Update session-summary.md with final approved wording if adjustments were requested.

npx claude-flow@alpha memory store \
  --namespace "session-closeout" \
  --key "hitl-task-1763015548037" \
  --value '{
    "task_id": "task-1763015548037-2cal1ylpy",
    "reviewed_by": "user",
    "approved": true,
    "approval_timestamp": "2025-11-13T16:00:00Z",
    "comments": "Excellent work. Security looks solid. Approved for merge.",
    "concerns": [],
    "action_items": []
  }'

# If rejected or changes needed
npx claude-flow@alpha memory store \
  --namespace "session-closeout" \
  --key "hitl-task-1763015548037" \
  --value '{
    "task_id": "task-1763015548037-2cal1ylpy",
    "reviewed_by": "user",
    "approved": false,
    "approval_timestamp": "2025-11-13T16:00:00Z",
    "comments": "Need additional validation for token expiry edge cases",
    "concerns": ["Edge case handling for expired tokens"],
    "action_items": ["Add tests for token expiry scenarios", "Document refresh token flow"]
  }'
```

- The approved summary is then copied into the Captain's Log (referencing `sessions/<session-id>/artifacts/session-summary.md`), ensuring the narrative matches what was reviewed.

### Step 4: ARCHIVE - Execute Post-Task Hook and Archive

Complete the session with post-task hook and archive all artifacts.

```bash
# Execute post-task hook (uses task ID from pre-task)
npx claude-flow@alpha hooks post-task \
  --task-id "task-1763015548037-2cal1ylpy"
```

**What post-task does**:
- Records task completion timestamp
- Trains neural patterns on session outcomes
- Calculates performance metrics
- Stores final task status
- Archives to long-term memory

#### Create Session Archive

```bash
# Archive complete session state
npx claude-flow@alpha memory store \
  --namespace "session-archive" \
  --key "session-20251113-auth-complete" \
  --value '{
    "session_id": "session-20251113-auth",
    "task_id": "task-1763015548037-2cal1ylpy",
    "start_time": "2025-11-13T10:00:00Z",
    "end_time": "2025-11-13T16:00:00Z",
    "duration_hours": 6,
    "artifacts": {
      "files_created": 3,
      "files_modified": 1,
      "tests_added": 15,
      "coverage": "94%",
      "log_entries": 5
    },
    "hitl_approved": true,
    "archived_at": "2025-11-13T16:05:00Z"
  }'
```

#### Session End Hook

```bash
# Optional: Export session metrics and summary
npx claude-flow@alpha hooks session-end \
  --export-metrics true
```

> After closeout, treat `sessions/<session-id>/artifacts/` as read-only. Any follow-up work should occur in a new session or within project folders, with explicit instructions to agents about where outputs belong.

## Session Restore: Resuming Work

When resuming work from a previous session:

### Find Previous Session

```bash
# Option 1: Search by date
npx claude-flow@alpha memory search \
  --namespace "session-archive" \
  --pattern "session-2025-11-*"

# Option 2: Search by task ID
npx claude-flow@alpha memory retrieve \
  --namespace "session-archive" \
  --key "session-20251113-auth-complete"
```

### Restore Session Context

```bash
# Load archived session
npx claude-flow@alpha hooks session-restore \
  --session-id "session-20251113-auth-complete"

# Review previous decisions
npx claude-flow@alpha memory search \
  --namespace "captains-log" \
  --pattern "journal:2025-11-13-*"

# Check follow-up action items
npx claude-flow@alpha memory retrieve \
  --namespace "session-closeout" \
  --key "hitl-task-1763015548037"
```

### Continue Work

```bash
# Start new task referencing previous work
npx claude-flow@alpha hooks pre-task \
  --description "Continue auth work: Add OAuth integration (follows task-1763015548037)"

# Link tasks in memory
npx claude-flow@alpha memory store \
  --namespace "task-relationships" \
  --key "task-new-oauth-predecessor" \
  --value '{"predecessor": "task-1763015548037-2cal1ylpy", "relationship": "continuation"}'
```

## Troubleshooting

### Issue: Lost Task ID
**Symptom**: Can't find task ID from pre-task hook
**Solution**: Search pre-task memory namespace
```bash
npx claude-flow@alpha memory search \
  --namespace "hooks:pre-task" \
  --pattern "*" | grep "2025-11-13"
```

### Issue: Incomplete Session Closeout
**Symptom**: Previous session not properly closed
**Solution**: Retrospectively close session
```bash
# Find unclosed sessions
npx claude-flow@alpha memory search --namespace "hooks:pre-task" --pattern "*"
npx claude-flow@alpha memory search --namespace "hooks:post-task" --pattern "*"
# Identify missing post-task entries

# Close manually
npx claude-flow@alpha hooks post-task --task-id "missing-task-id"
```

### Issue: Context Not Restored
**Symptom**: Session restore doesn't load expected data
**Solution**: Verify session ID and namespace
```bash
# List all session archives
npx claude-flow@alpha memory search --namespace "session-archive" --pattern "*"

# Manually retrieve specific artifacts
npx claude-flow@alpha memory retrieve --namespace "captains-log" --key "journal:date-time"
```

### Issue: HITL Review Pending
**Symptom**: Multiple sessions have unreviewed entries
**Solution**: Batch review process
```bash
# Find all unreviewed entries
npx claude-flow@alpha memory search --namespace "captains-log" --pattern "*" | \
  grep "\"hitl_reviewed\": false"

# Create batch review summary
# Present to user for bulk approval
```

---

**Best Practice**: Treat session lifecycle as a discipline. Consistent start/closeout patterns create reliable context chains that compound in value over time. Future sessions become faster and smarter by learning from properly documented past sessions.
