# closeout.sh Script Changes

## Summary
Added document promotion prompt to session closeout workflow.

## Changes Made

### Insertion Point
- **After line 95**: After metadata status update, before session environment cleanup
- **Lines added**: 97-127 (31 lines)

### Functionality Added

**Document Promotion Check Block:**

1. **Discovery**: Scans `sessions/$SESSION_ID/artifacts/docs` for markdown files
2. **Display**: Lists found documents with file sizes
3. **User Prompt**: "Promote any docs to docs/guides/? (y/N)"
4. **Guidance**: Shows routing guide reference and promotion checklist
5. **Pause Option**: Allows user to exit closeout for manual promotion

### Behavior

**If documents exist:**
- Displays count and file list
- References `.claude/skills/file-routing/README.md` for routing rules
- Shows 3-question test checklist
- On "y" response: Exits with status 0 for manual promotion
- On "N" response: Continues to archive

**If no documents exist:**
- Silent pass-through (no user interruption)

### Preserves Existing Functionality

✓ All original lines preserved
✓ No existing functionality modified
✓ Additive change only
✓ Script flow maintained for "N" or no-docs paths

### Testing

```bash
bash -n .claude/skills/session-closeout/scripts/closeout.sh
# Passes syntax validation
```

## Backup

Original script backed up to:
`sessions/session-20251116-151059-coherence-analysis/artifacts/code/backups/closeout.sh.backup`

## Date
2025-11-16
