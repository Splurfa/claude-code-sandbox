# Batch Session Closeout Guide

## Overview

The `batch-closeout.sh` script provides a safe and efficient way to archive multiple completed sessions at once. It includes comprehensive safety features, validation checks, and detailed reporting.

## Quick Start

```bash
# Preview what would happen (recommended first step)
bash sessions/batch-closeout.sh --dry-run --all

# Close out specific sessions
bash sessions/batch-closeout.sh session-20251121-120000-issue-tracking-restructure

# Close out all active sessions with confirmation
bash sessions/batch-closeout.sh --all

# Close out all sessions without confirmation (use with caution)
bash sessions/batch-closeout.sh --all --force
```

## Features

### Safety Features

1. **Dry-Run Mode**: Preview all operations without making changes
2. **Automatic Backups**: Creates timestamped backups before archiving
3. **Validation Checks**: Verifies session structure and archive integrity
4. **Confirmation Prompts**: Asks for user approval before making changes
5. **Detailed Logging**: Comprehensive logs for audit trails
6. **Error Handling**: Graceful failure handling with rollback capability

### Automation Features

1. **Auto-Summary Generation**: Creates `FINAL-SUMMARY.md` if missing
2. **Batch Processing**: Handle multiple sessions in one operation
3. **Backup Cleanup**: Removes old backup directories (>7 days)
4. **Reconciliation Reports**: Detailed markdown reports of all operations
5. **Clean State Verification**: Confirms workspace is clean after closeout

## Command-Line Options

### Main Options

| Option | Description | Example |
|--------|-------------|---------|
| `--dry-run` | Show what would be done without making changes | `--dry-run` |
| `--all` | Process all active sessions | `--all` |
| `--force` | Skip confirmation prompts (use with caution) | `--force` |
| `--no-backup` | Skip creating backup before archive (faster) | `--no-backup` |
| `--verbose` | Show detailed logging output | `--verbose` |
| `--help`, `-h` | Show help message and exit | `--help` |

### Session Arguments

You can specify one or more session IDs as arguments:

```bash
# Single session
bash sessions/batch-closeout.sh session-20251121-120000-issue-tracking-restructure

# Multiple sessions
bash sessions/batch-closeout.sh session-1 session-2 session-3

# Mix with options
bash sessions/batch-closeout.sh --verbose session-1 session-2
```

## Workflow

### 1. Dry-Run First (Recommended)

Always start with a dry-run to preview what will happen:

```bash
bash sessions/batch-closeout.sh --dry-run --all
```

This will show you:
- Which sessions will be processed
- Whether FINAL-SUMMARY.md needs to be generated
- Where backups will be created
- What the final state will look like

### 2. Review Output

Check the dry-run output for:
- Any warning or error messages
- Sessions that will be skipped
- Sessions missing FINAL-SUMMARY.md
- Total number of sessions to process

### 3. Execute Closeout

If the dry-run looks good, run the actual closeout:

```bash
# With confirmation prompt
bash sessions/batch-closeout.sh --all

# Or skip confirmation (be careful!)
bash sessions/batch-closeout.sh --all --force
```

### 4. Review Report

After completion, review the generated report:

```bash
# Report location is shown in the summary
cat sessions/batch-closeout-report-YYYYMMDD-HHMMSS.md
```

The report includes:
- Summary statistics
- List of successful closeouts
- List of failed closeouts
- List of skipped sessions
- Archive status
- Clean state verification

## Session Processing

### For Each Session, the Script Will:

1. **Validate** - Verify session structure is valid
2. **Check Archive** - Skip if already archived
3. **Generate Summary** - Create FINAL-SUMMARY.md if missing
4. **Backup** - Copy session to timestamped backup directory
5. **Archive** - Move session to `.archive/` directory
6. **Validate Archive** - Verify archive integrity
7. **Update Metadata** - Add archive timestamp to metadata.json

### FINAL-SUMMARY.md Generation

If a session is missing `FINAL-SUMMARY.md`, the script automatically generates one with:

- Session ID and timestamps
- Artifact counts by category (code, tests, docs, scripts, notes)
- Complete file listing
- Closeout details and metadata

Example generated summary:

```markdown
# Session Closeout Summary

**Session ID:** session-20251121-120000-issue-tracking-restructure
**Created:** 2025-11-21 12:00:00
**Closed:** 2025-11-21 16:59:34
**Topic:** issue-tracking-restructure

## Artifacts Summary

| Category | Count | Location |
|----------|-------|----------|
| Code | 5 | artifacts/code/ |
| Tests | 3 | artifacts/tests/ |
| Documentation | 2 | artifacts/docs/ |
| Scripts | 1 | artifacts/scripts/ |
| Notes | 4 | artifacts/notes/ |
| **Total** | **15** | |

## Files Created
[... detailed file listing ...]
```

## Backup Management

### Backup Creation

By default, the script creates a timestamped backup before archiving:

```
sessions/backup-before-batch-closeout-20251121-165934/
  session-20251121-120000-issue-tracking-restructure/
  session-20251121-121218-workspace-org-analysis/
```

### Skip Backup (Faster)

If you're confident and want faster processing:

```bash
bash sessions/batch-closeout.sh --all --no-backup
```

**Warning**: Only use `--no-backup` if you have other backups or are certain you won't need to restore.

### Automatic Cleanup

The script automatically removes backup directories older than 7 days to prevent accumulation.

## Output and Logging

### Log Files

Each run creates a timestamped log file:

```
sessions/batch-closeout-YYYYMMDD-HHMMSS.log
```

The log contains:
- Timestamped entries for all operations
- Detailed error messages
- Validation results
- Archive confirmations

### Report Files

Each run generates a markdown report:

```
sessions/batch-closeout-report-YYYYMMDD-HHMMSS.md
```

The report includes:
- Summary statistics
- Successful closeouts list
- Failed closeouts list with reasons
- Skipped sessions list
- Archive status
- Active sessions remaining
- Clean state verification

### Console Output

The script provides color-coded console output:

- 🔵 Blue (INFO): Informational messages
- 🟢 Green (SUCCESS): Successful operations
- 🟡 Yellow (WARNING): Warnings and skipped items
- 🔴 Red (ERROR): Errors and failures

## Error Handling

### Common Issues and Solutions

#### 1. Invalid Session Structure

**Error**: "Invalid session: session-xyz (skipping)"

**Cause**: Session doesn't have required `artifacts/` directory

**Solution**: Manually verify session structure or exclude from batch closeout

#### 2. Already Archived

**Warning**: "session-xyz already archived (skipping)"

**Cause**: Session already exists in `.archive/`

**Solution**: No action needed, session is already closed out

#### 3. Backup Failed

**Error**: "Failed to backup session-xyz, aborting closeout"

**Cause**: Insufficient disk space or permissions issue

**Solution**:
- Check available disk space
- Verify write permissions on `sessions/` directory
- Use `--no-backup` as last resort (not recommended)

#### 4. Archive Failed

**Error**: "Failed to archive session-xyz"

**Cause**: Permissions issue or `.archive/` directory locked

**Solution**:
- Check write permissions on `sessions/.archive/`
- Ensure no processes are accessing the session directory
- Manually investigate the specific session

### Rollback from Backup

If something goes wrong, you can restore from backup:

```bash
# Find the backup directory
ls -la sessions/backup-before-batch-closeout-*/

# Restore specific session
cp -R sessions/backup-before-batch-closeout-20251121-165934/session-xyz sessions/

# Remove from archive if it was archived
rm -rf sessions/.archive/session-xyz
```

## Examples

### Example 1: Close Out All Sessions (Safe)

```bash
# Step 1: Dry-run to preview
bash sessions/batch-closeout.sh --dry-run --all

# Step 2: Review dry-run output
# Check for any warnings or errors

# Step 3: Execute with confirmation
bash sessions/batch-closeout.sh --all

# Step 4: Confirm when prompted
# Sessions to close out:
#   - session-20251121-120000-issue-tracking-restructure
#   - session-20251121-121218-workspace-org-analysis
# Continue with closeout? (y/N): y

# Step 5: Review report
cat sessions/batch-closeout-report-*.md
```

### Example 2: Close Out Specific Sessions

```bash
# Close out two specific sessions
bash sessions/batch-closeout.sh \
  session-20251121-120000-issue-tracking-restructure \
  session-20251121-121218-workspace-org-analysis

# With verbose output
bash sessions/batch-closeout.sh --verbose \
  session-20251121-120000-issue-tracking-restructure
```

### Example 3: Fast Batch Closeout (No Confirmation, No Backup)

```bash
# WARNING: Use only if you're certain and have other backups
bash sessions/batch-closeout.sh --all --force --no-backup
```

### Example 4: Verbose Dry-Run for Debugging

```bash
# See detailed information about what will happen
bash sessions/batch-closeout.sh --dry-run --all --verbose
```

## Integration with Session Management

### Workflow Integration

The batch closeout script integrates with the standard session management workflow:

```bash
# 1. Manual session closeout (individual)
npx claude-flow@alpha hooks session-end --session-id "session-xyz"

# 2. Batch closeout (multiple sessions)
bash sessions/batch-closeout.sh --all

# 3. Both create FINAL-SUMMARY.md and move to .archive/
```

### Captain's Log

After batch closeout, you may want to update the Captain's Log:

```bash
# Review archived sessions
ls -la sessions/.archive/session-2025*/

# Extract key learnings for Captain's Log
# (This is a manual process - review FINAL-SUMMARY.md files)
```

## Best Practices

### 1. Always Dry-Run First

```bash
# GOOD: Preview before executing
bash sessions/batch-closeout.sh --dry-run --all
bash sessions/batch-closeout.sh --all

# BAD: Running without preview
bash sessions/batch-closeout.sh --all --force
```

### 2. Review Reports

After each batch closeout:

1. Read the reconciliation report
2. Verify the summary statistics match expectations
3. Check that no sessions failed
4. Confirm clean state verification passed

### 3. Backup Strategy

```bash
# Default: Automatic backup (recommended)
bash sessions/batch-closeout.sh --all

# No backup: Only if you have external backups
bash sessions/batch-closeout.sh --all --no-backup
```

### 4. Incremental Processing

For large numbers of sessions, process incrementally:

```bash
# Process sessions in batches
bash sessions/batch-closeout.sh session-1 session-2 session-3
# Review results
bash sessions/batch-closeout.sh session-4 session-5 session-6
# Review results
# etc.
```

### 5. Verification

After batch closeout:

```bash
# Verify active sessions
find sessions -maxdepth 1 -type d -name "session-*"

# Verify archived sessions
ls -la sessions/.archive/

# Check for any orphaned files
find sessions -maxdepth 1 -type f
```

## Performance Considerations

### Processing Speed

The script processes sessions sequentially. Approximate timing:

- **With backup**: ~2-5 seconds per session
- **Without backup** (`--no-backup`): ~0.5-1 second per session

For 10 sessions:
- With backup: ~20-50 seconds
- Without backup: ~5-10 seconds

### Disk Space

Backup directories temporarily double disk usage:

```
sessions/session-xyz/           # 100 MB
sessions/backup-*/session-xyz/  # 100 MB (temporary)
sessions/.archive/session-xyz/  # 100 MB (final)
```

Total temporary space needed: 2x session size

After backup cleanup (7 days): Returns to 1x session size in archive

## Troubleshooting

### Script Won't Run

```bash
# Ensure script is executable
chmod +x sessions/batch-closeout.sh

# Run with bash explicitly
bash sessions/batch-closeout.sh --help
```

### Permission Denied

```bash
# Check file permissions
ls -la sessions/batch-closeout.sh

# Check directory permissions
ls -la sessions/

# Fix permissions if needed
chmod +x sessions/batch-closeout.sh
chmod u+w sessions/
```

### No Sessions Found

```bash
# Verify sessions exist
find sessions -maxdepth 1 -type d -name "session-*"

# Check if already archived
ls -la sessions/.archive/
```

### Backup Directory Exists

If backup directory creation fails due to existing directory:

```bash
# Remove old backup manually
rm -rf sessions/backup-before-batch-closeout-YYYYMMDD-HHMMSS/

# Or use a unique timestamp by waiting a second before retry
```

## Appendix

### Session Validation Criteria

A valid session must have:

1. Directory name matching pattern `session-*`
2. `artifacts/` subdirectory
3. Optionally: `metadata.json`
4. Optionally: `FINAL-SUMMARY.md` (will be generated if missing)

### Archive Structure

```
sessions/.archive/
  session-20251121-120000-issue-tracking-restructure/
    artifacts/
      code/
      tests/
      docs/
      scripts/
      notes/
    metadata.json
    FINAL-SUMMARY.md
    .claude-flow/
```

### Exit Codes

- **0**: Success (all sessions processed successfully)
- **1**: Failure (one or more sessions failed to close out)

### Related Documentation

- [Session Management Guide](README.md)
- [Captain's Log Documentation](captains-log/README.md)
- [Infrastructure Storage](.swarm/README.md)

---

**Last Updated**: 2025-11-21
**Script Version**: 1.0.0
**Compatibility**: bash 4.0+, macOS/Linux
