# Script Design Specifications

## Overview

This document specifies the architecture for three wrapper scripts that implement the session closeout workflow. Each script is designed to be minimal (5% custom logic), relying heavily on stock `claude-flow` hooks (95%).

**Design Principles:**
- Time-neutral: All scripts execute on-demand via explicit invocation
- Scale-agnostic: Handle sessions from 10 files to 10,000+ without modification
- Stock-first: Leverage existing hooks, minimal custom logic

---

## Script 1: session-closeout.sh

### Purpose
Orchestrates the complete session closeout workflow: COLLECT → CLASSIFY → HITL → ARCHIVE. This is the main entry point for session termination.

### Inputs
- `--session-id` (required): Session identifier (e.g., `session-20251113-211159-hive-mind-setup`)
- `--auto-approve` (optional): Skip HITL confirmation (dangerous, not recommended)
- `--keep-session` (optional): Retain session folder after backup (default: delete)

### Processing Steps

1. **Validate Session**
   - Check `sessions/$SESSION_ID/metadata.json` exists
   - Verify session status is "active"

2. **COLLECT Phase**
   - Execute: `npx claude-flow@alpha hooks session-end --generate-summary true --session-id "$SESSION_ID"`
   - This generates summary in `.swarm/summaries/session-{timestamp}.json`

3. **CLASSIFY Phase**
   - Read generated summary JSON
   - Extract key sections: decisions, blockers, achievements, artifacts
   - Format as markdown for human review

4. **HITL Phase**
   - Display formatted summary to user
   - Prompt: "Approve this summary for archival? (y/n/edit)"
   - If "edit": Open in $EDITOR, re-prompt
   - If "n": Abort closeout
   - If "y": Proceed to archive

5. **ARCHIVE Phase**
   - Call `captain-log-append.sh` with approved summary
   - Call `session-backup.sh` with session ID and keep-session flag
   - Update `sessions/$SESSION_ID/metadata.json` status to "closed"

### Outputs
- **Primary**: Triggers child scripts (`captain-log-append.sh`, `session-backup.sh`)
- **Status**: Updates `metadata.json` with closeout timestamp and status
- **Logs**: Writes closeout log to `sessions/$SESSION_ID/closeout.log`

### Stock Commands Used
```bash
# Collect phase
npx claude-flow@alpha hooks session-end --generate-summary true --session-id "$SESSION_ID"

# Post-task tracking
npx claude-flow@alpha hooks post-task --task-id "closeout-$SESSION_ID"

# Memory storage for audit trail
npx claude-flow@alpha hooks memory:store \
  --key "session/$SESSION_ID/closeout" \
  --value "{timestamp, approved_by, summary_hash}"
```

### Error Handling
- **Missing session**: Exit with error code 1, message: "Session not found: $SESSION_ID"
- **Session already closed**: Exit with error code 2, message: "Session already closed: $SESSION_ID"
- **Hook failures**: Retry once with 2-second delay, then fail gracefully with partial completion message
- **User abort (HITL)**: Exit code 0, update metadata status to "review-pending"
- **Child script failure**: Log error, prompt user: "Continue despite failure? (y/n)"

### Integration Points
- **Spawns**: `captain-log-append.sh`, `session-backup.sh`
- **Reads**: `sessions/$SESSION_ID/metadata.json`, `.swarm/summaries/session-*.json`
- **Writes**: `sessions/$SESSION_ID/closeout.log`, `sessions/$SESSION_ID/metadata.json`
- **Hooks**: `session-end`, `post-task`, `memory:store`

### Size Estimate
45 lines (excluding comments)

---

## Script 2: captain-log-append.sh

### Purpose
Appends approved session summary text to the Captain's Log (human-readable journal). Handles date-based file organization and deduplication.

### Inputs
- `--session-id` (required): Session identifier for metadata linkage
- `--summary-text` (required): Approved summary text (stdin or file path)
- `--date` (optional): Override date (default: today, format: YYYY-MM-DD)

### Processing Steps

1. **Prepare Date File**
   - Create directory: `sessions/captains-log/`
   - Determine target file: `sessions/captains-log/$DATE.md`
   - If file doesn't exist, create with header:
     ```markdown
     # Captain's Log - $DATE

     *Daily journal of decisions, insights, and blockers*

     ---
     ```

2. **Format Entry**
   - Generate entry header:
     ```markdown
     ## Session: $SESSION_ID
     **Closed:** $(date +%H:%M:%S)

     $SUMMARY_TEXT

     ---
     ```

3. **Append to Log**
   - Append formatted entry to `sessions/captains-log/$DATE.md`
   - Check for duplicate session IDs (warn but don't block)

4. **Store in Memory**
   - Execute: `npx claude-flow@alpha hooks memory:store --key "journal/$DATE/sessions" --value "$SESSION_ID"`
   - This enables cross-session queries via memory

### Outputs
- **Primary**: Appends to `sessions/captains-log/YYYY-MM-DD.md`
- **Memory**: Stores session linkage in `.swarm/memory.db`
- **Status**: Returns exit code 0 on success

### Stock Commands Used
```bash
# Store journal entry metadata
npx claude-flow@alpha hooks memory:store \
  --key "journal/$DATE/sessions" \
  --value "$SESSION_ID"

# Optional: Store entry hash for deduplication
npx claude-flow@alpha hooks memory:store \
  --key "journal/$DATE/$SESSION_ID/hash" \
  --value "$(echo "$SUMMARY_TEXT" | sha256sum | cut -d' ' -f1)"
```

### Error Handling
- **Invalid date format**: Exit code 1, message: "Date must be YYYY-MM-DD format"
- **Empty summary**: Exit code 2, message: "Summary text cannot be empty"
- **File write failure**: Retry once, then exit code 3 with: "Failed to write to Captain's Log"
- **Duplicate session warning**: Print warning, continue execution (not a failure)
- **Memory store failure**: Log warning but don't fail (journal append is primary operation)

### Integration Points
- **Called by**: `session-closeout.sh`
- **Reads**: None (pure input processing)
- **Writes**: `sessions/captains-log/YYYY-MM-DD.md`
- **Hooks**: `memory:store`

### Size Estimate
28 lines (excluding comments)

---

## Script 3: session-backup.sh

### Purpose
Creates a comprehensive backup snapshot of session state, including memory exports, session artifacts, and metrics. Optionally archives and deletes the session folder.

### Inputs
- `--session-id` (required): Session identifier
- `--delete-session` (optional): Delete session folder after backup (default: false)
- `--export-format` (optional): json|tar.gz (default: json)

### Processing Steps

1. **Validate Session**
   - Check `sessions/$SESSION_ID/` exists
   - Verify backup directory: `.swarm/backups/`

2. **Export Memory State**
   - Query memory for all keys matching: `session/$SESSION_ID/*`, `hive/*`, `swarm/*`
   - Execute: `npx claude-flow@alpha hooks memory:export --filter "session/$SESSION_ID" --format json`
   - Save to temporary file: `/tmp/memory-export-$SESSION_ID.json`

3. **Collect Metrics**
   - Read `.swarm/memory.db` for performance metrics (if available)
   - Gather file counts, sizes, timestamps from session artifacts

4. **Create Backup Package**
   - Generate timestamp: `BACKUP_TS=$(date -u +%Y%m%d-%H%M%S)`
   - **JSON format**:
     ```json
     {
       "backup_timestamp": "2025-11-14T08:00:00Z",
       "session_id": "$SESSION_ID",
       "memory_export": { /* exported memory */ },
       "metadata": { /* from metadata.json */ },
       "metrics": {
         "total_files": 42,
         "total_size_bytes": 156789,
         "duration_seconds": 3600
       },
       "artifacts": {
         "code": ["file1.js", "file2.js"],
         "tests": ["test1.spec.js"],
         "docs": ["README.md"]
       }
     }
     ```
   - Write to: `.swarm/backups/session-$SESSION_ID-$BACKUP_TS.json`

   - **tar.gz format** (optional):
     - Create tarball including: session folder + memory export
     - Compress to: `.swarm/backups/session-$SESSION_ID-$BACKUP_TS.tar.gz`

5. **Optional: Delete Session**
   - If `--delete-session` flag set:
     - Verify backup file exists and is non-empty
     - Remove `sessions/$SESSION_ID/` recursively
     - Log deletion to `.swarm/backups/deletion-log.txt`

6. **Cleanup**
   - Remove temporary memory export file
   - Store backup metadata in memory for restore capability

### Outputs
- **Primary**: `.swarm/backups/session-$SESSION_ID-$BACKUP_TS.json` (or `.tar.gz`)
- **Logs**: Appends to `.swarm/backups/backup-log.txt`
- **Memory**: Stores backup metadata for restore operations

### Stock Commands Used
```bash
# Export memory state
npx claude-flow@alpha hooks memory:export \
  --filter "session/$SESSION_ID" \
  --format json \
  --output "/tmp/memory-export-$SESSION_ID.json"

# Store backup metadata
npx claude-flow@alpha hooks memory:store \
  --key "backups/$SESSION_ID/latest" \
  --value "$BACKUP_FILE_PATH"

# Optional: Session metrics
npx claude-flow@alpha hooks session-metrics \
  --session-id "$SESSION_ID" \
  --format json
```

### Error Handling
- **Session not found**: Exit code 1, message: "Session does not exist: $SESSION_ID"
- **Memory export failure**: Warn but continue (backup session files anyway)
- **Backup write failure**: Exit code 3, message: "Failed to create backup file"
- **Delete-session validation**: If backup file < 1KB or doesn't exist, refuse deletion (exit code 4)
- **Insufficient disk space**: Check before creating backup, exit code 5 if < 100MB free
- **Partial failure**: If memory export fails but file backup succeeds, return exit code 10 (warning state)

### Integration Points
- **Called by**: `session-closeout.sh`
- **Reads**: `sessions/$SESSION_ID/*`, `.swarm/memory.db`
- **Writes**: `.swarm/backups/session-*.json`, `.swarm/backups/backup-log.txt`
- **Hooks**: `memory:export`, `memory:store`, `session-metrics`

### Size Estimate
38 lines (excluding comments)

---

## Integration Flow

### Complete Workflow Sequence

```
User: "Close session"
  ↓
session-closeout.sh --session-id "session-20251113-211159"
  ↓
  1. COLLECT: hooks session-end → generates summary JSON
  ↓
  2. CLASSIFY: Parse JSON, format markdown
  ↓
  3. HITL: Display summary, await user approval
     - User reviews/edits/approves
  ↓
  4. ARCHIVE:
     ├─→ captain-log-append.sh --session-id ... --summary-text "..."
     │   └─→ Appends to sessions/captains-log/2025-11-14.md
     │   └─→ Stores in memory: journal/2025-11-14/sessions
     │
     └─→ session-backup.sh --session-id ... --delete-session
         └─→ Exports memory → .swarm/backups/session-...-20251114-080000.json
         └─→ Archives session folder
         └─→ Deletes sessions/session-20251113-211159/ (if flag set)
  ↓
  5. FINALIZE:
     └─→ Updates metadata.json status: "closed"
     └─→ Runs: hooks post-task --task-id "closeout-session-20251113-211159"
     └─→ Stores audit: memory:store session/$SESSION_ID/closeout
```

### Data Flow Diagram

```
Session Artifacts → session-closeout.sh → Summary JSON (.swarm/summaries/)
                                       ↓
                           HITL Approval (human review)
                                       ↓
                     ┌─────────────────┴─────────────────┐
                     ↓                                   ↓
         captain-log-append.sh                 session-backup.sh
                     ↓                                   ↓
    sessions/captains-log/YYYY-MM-DD.md     .swarm/backups/session-*.json
                     ↓                                   ↓
           .swarm/memory.db                    .swarm/memory.db
         (journal linkage)                   (backup metadata)
```

### Script Dependencies

- **session-closeout.sh** depends on:
  - `captain-log-append.sh` (spawns)
  - `session-backup.sh` (spawns)
  - Stock hooks: `session-end`, `post-task`, `memory:store`

- **captain-log-append.sh** is standalone:
  - Stock hooks: `memory:store`

- **session-backup.sh** is standalone:
  - Stock hooks: `memory:export`, `memory:store`, `session-metrics`

### Parallel Execution Opportunities

None. Scripts must execute sequentially:
1. `session-closeout.sh` orchestrates
2. After HITL approval → spawn `captain-log-append.sh` AND `session-backup.sh` in parallel
3. Both complete → finalize closeout

---

## Testing Requirements

### Unit Testing

**session-closeout.sh:**
- [ ] Test with valid session ID (happy path)
- [ ] Test with missing session (error handling)
- [ ] Test with already-closed session (idempotency)
- [ ] Test HITL approval flow (y/n/edit)
- [ ] Test with `--auto-approve` flag
- [ ] Test with `--keep-session` flag
- [ ] Test child script failure handling
- [ ] Test hook failure retry logic

**captain-log-append.sh:**
- [ ] Test appending to existing log file
- [ ] Test creating new log file with header
- [ ] Test with custom date override
- [ ] Test duplicate session warning (non-blocking)
- [ ] Test with empty summary (should fail)
- [ ] Test with invalid date format (should fail)
- [ ] Test memory store failure (should warn, not fail)
- [ ] Test with very large summary text (10KB+)

**session-backup.sh:**
- [ ] Test backup creation (JSON format)
- [ ] Test backup creation (tar.gz format)
- [ ] Test with `--delete-session` flag
- [ ] Test memory export integration
- [ ] Test session metrics collection
- [ ] Test disk space validation
- [ ] Test backup file integrity (non-empty, valid JSON)
- [ ] Test deletion refusal if backup fails
- [ ] Test partial failure scenarios (memory export fails)

### Integration Testing

- [ ] **Full closeout workflow**: Run `session-closeout.sh` on test session, verify all files created correctly
- [ ] **Captain's Log persistence**: Verify log entries survive multiple sessions
- [ ] **Backup restore capability**: Create backup, delete session, restore from backup (manual test)
- [ ] **Memory linkage**: Verify Captain's Log entries queryable via memory hooks
- [ ] **Concurrent sessions**: Run closeout on two sessions simultaneously (race condition test)
- [ ] **Large session**: Test with session containing 1000+ files (scale test)

### Validation Criteria

**Success Criteria:**
- Exit code 0 for happy path execution
- All expected files created with correct permissions (644 for files, 755 for dirs)
- Memory database updated with correct keys
- Backup JSON is valid and parseable
- Captain's Log markdown is valid and readable
- No data loss during closeout process

**Performance Criteria:**
- Session closeout completes in < 10 seconds for typical sessions (< 100 files)
- Memory export completes in < 5 seconds
- Backup file size is reasonable (< 2x session artifact size)

### Test Fixtures

Create test sessions in `tests/fixtures/`:
- `minimal-session/` - 5 files, 1 code artifact
- `typical-session/` - 50 files, mixed artifacts (code, tests, docs)
- `large-session/` - 500 files, deeply nested structure
- `empty-session/` - Metadata only, no artifacts
- `corrupted-session/` - Missing metadata.json (error case)

### Mocking Strategy

**Mock stock hooks during unit tests:**
- Create `mock-hooks.sh` that logs calls instead of executing
- Set `CLAUDE_FLOW_HOOKS_PATH=tests/mocks/mock-hooks.sh`
- Validate expected hook invocations via log parsing

**Real integration for integration tests:**
- Use actual `claude-flow` hooks
- Create isolated `.swarm-test/` directory
- Clean up after each test run

---

## Design Review Checklist

- [ ] All scripts follow 5% custom / 95% stock principle
- [ ] Time-neutral: No scheduled tasks or timers
- [ ] Scale-agnostic: Handle 10 to 10,000+ files identically
- [ ] Error handling covers all failure modes
- [ ] Stock commands correctly invoked with proper flags
- [ ] Integration points clearly documented
- [ ] HITL confirmation required (no silent data loss)
- [ ] Testing requirements comprehensive
- [ ] Size estimates realistic (40-50 lines per script)
- [ ] Security: No secrets stored in backups
- [ ] Idempotency: Can re-run closeout safely (with warnings)

---

## Next Steps

1. **Phase 1C - Testing Strategy**: Test Engineer designs test suite based on these specs
2. **Phase 2A - Implementation**: Scripts implemented per specifications
3. **Phase 2B - Integration Testing**: Full workflow validation
4. **Phase 3 - Production Validation**: Real session closeout test

---

**Document Metadata:**
- **Version**: 1.0
- **Author**: Script Designer (Phase 1B Hive)
- **Session**: session-20251113-211159-hive-mind-setup
- **Created**: 2025-11-14
- **Review Status**: Awaiting peer review (Tester, UX Designer)
