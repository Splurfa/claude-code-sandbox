# Batch Session Closeout

## Quick Reference

Archive multiple completed sessions at once with automatic summary generation, backups, and validation.

### Basic Usage

```bash
# Preview (recommended first step)
bash sessions/batch-closeout.sh --dry-run --all

# Close out all sessions
bash sessions/batch-closeout.sh --all

# Close specific sessions
bash sessions/batch-closeout.sh session-20251121-120000-issue-tracking-restructure

# Fast mode (no backup, no confirmation)
bash sessions/batch-closeout.sh --all --force --no-backup
```

### Available Options

```
--dry-run              Preview without making changes
--all                  Process all active sessions
--force                Skip confirmation prompts
--no-backup            Skip backup creation (faster)
--verbose              Show detailed logging
--help                 Display help message
```

## Features

✅ **Safe by Default**
- Dry-run mode to preview operations
- Automatic timestamped backups
- Confirmation prompts before changes
- Comprehensive validation checks

✅ **Automated**
- Auto-generates FINAL-SUMMARY.md if missing
- Batch processes multiple sessions
- Cleans up old backups (>7 days)
- Creates detailed reconciliation reports

✅ **Robust**
- Graceful error handling
- Session validation
- Archive integrity checks
- Detailed logging and reporting

## What It Does

For each session, the script:

1. **Validates** session structure
2. **Generates** FINAL-SUMMARY.md if missing
3. **Backs up** session to timestamped directory
4. **Archives** session to `.archive/`
5. **Validates** archive integrity
6. **Reports** results with detailed metrics

## Output Files

Every run creates:

- **Log file**: `batch-closeout-YYYYMMDD-HHMMSS.log`
- **Report file**: `batch-closeout-report-YYYYMMDD-HHMMSS.md`
- **Backup directory**: `backup-before-batch-closeout-YYYYMMDD-HHMMSS/` (optional)

## Examples

### Safe Workflow

```bash
# 1. Preview what will happen
bash sessions/batch-closeout.sh --dry-run --all

# 2. Review output for any issues

# 3. Execute with confirmation
bash sessions/batch-closeout.sh --all

# 4. Confirm at prompt
# Sessions to close out:
#   - session-20251121-120000-issue-tracking-restructure
#   - session-20251121-121218-workspace-org-analysis
# Continue with closeout? (y/N): y

# 5. Review generated report
cat sessions/batch-closeout-report-*.md
```

### Specific Sessions

```bash
# Close two specific sessions with verbose output
bash sessions/batch-closeout.sh --verbose \
  session-20251121-120000-issue-tracking-restructure \
  session-20251121-121218-workspace-org-analysis
```

### Fast Mode (Use with Caution)

```bash
# No backups, no confirmation - only if you're certain!
bash sessions/batch-closeout.sh --all --force --no-backup
```

## Safety Features

### Dry-Run Mode

Always available with `--dry-run`:

```bash
bash sessions/batch-closeout.sh --dry-run --all
```

Shows exactly what will happen without making any changes.

### Automatic Backups

Before archiving, creates timestamped backup:

```
sessions/backup-before-batch-closeout-20251121-165934/
  session-20251121-120000-issue-tracking-restructure/
  session-20251121-121218-workspace-org-analysis/
```

Skip with `--no-backup` if you have other backups.

### Validation Checks

- Verifies session has `artifacts/` directory
- Checks if session is already archived
- Validates archive integrity after move
- Confirms clean state at completion

### Confirmation Prompts

By default, asks for confirmation before proceeding. Skip with `--force`.

## Error Handling

### Common Scenarios

**Already Archived**: Session skipped with warning
**Invalid Structure**: Session skipped with warning
**Missing Summary**: Automatically generated
**Backup Failed**: Closeout aborted, session preserved
**Archive Failed**: Closeout aborted, backup available

### Rollback

If something goes wrong, restore from backup:

```bash
# Find backup
ls -la sessions/backup-before-batch-closeout-*/

# Restore session
cp -R sessions/backup-before-batch-closeout-*/session-xyz sessions/

# Remove from archive if needed
rm -rf sessions/.archive/session-xyz
```

## Performance

### Processing Speed

- **With backup**: ~2-5 seconds per session
- **Without backup**: ~0.5-1 second per session

### Disk Space

Temporary disk usage: 2x session size (during backup)
Final disk usage: 1x session size (in archive)

Backups auto-cleanup after 7 days.

## Troubleshooting

### Script Won't Execute

```bash
chmod +x sessions/batch-closeout.sh
bash sessions/batch-closeout.sh --help
```

### No Sessions Found

```bash
# Check for active sessions
find sessions -maxdepth 1 -type d -name "session-*"

# Check archive
ls -la sessions/.archive/
```

### Permission Issues

```bash
# Fix script permissions
chmod +x sessions/batch-closeout.sh

# Fix directory permissions
chmod u+w sessions/
```

## Documentation

For complete documentation, see:

- **[Batch Closeout Guide](BATCH-CLOSEOUT-GUIDE.md)** - Comprehensive documentation
- **[Session Management](README.md)** - Session lifecycle and management
- **[Quick Start](../docs/setup/quick-start.md)** - Getting started with sessions

## Integration

Works seamlessly with:

- Manual session closeout: `npx claude-flow@alpha hooks session-end`
- Session management: `sessions/` directory structure
- Captain's Log: Archived summaries available for review
- Claude Code hooks: Compatible with session management protocol

## Exit Codes

- **0**: Success - all sessions processed
- **1**: Failure - one or more sessions failed

## Requirements

- bash 4.0+
- macOS or Linux
- Standard Unix utilities (cp, mv, find, jq)

---

**Script Location**: `sessions/batch-closeout.sh`
**Documentation**: `sessions/BATCH-CLOSEOUT-GUIDE.md`
**Version**: 1.0.0
**Last Updated**: 2025-11-21
