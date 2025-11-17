# Session Closeout - Simple Deployment Guide

## What This Is

Three bash scripts that orchestrate stock `claude-flow` commands for session closeout. No architecture, no frameworks—just wrappers.

**Total code:** 105 lines of bash calling `npx claude-flow@alpha hooks` commands.

---

## Installation (5 minutes)

### Step 1: Copy the 3 Scripts

**Script 1: `scripts/session-closeout.sh`** (45 lines)

```bash
#!/bin/bash
# Orchestrates: COLLECT → CLASSIFY → HITL → ARCHIVE
set -e

SESSION_ID="${1:-}"
TASK_ID="${2:-}"

if [ -z "$SESSION_ID" ]; then
  echo "Usage: ./scripts/session-closeout.sh <session-id> <task-id>"
  exit 1
fi

SESSION_DIR="sessions/$SESSION_ID/artifacts"
SUMMARY_FILE="$SESSION_DIR/session-summary.md"

# COLLECT
echo "🔄 Collecting session artifacts..."
npx claude-flow@alpha memory search --namespace "captains-log" --pattern "journal:$(date -u +"%Y-%m-%d")-*" > /tmp/session-log-entries.json
ARTIFACT_COUNT=$(find "$SESSION_DIR" -type f | wc -l)
echo "  Found $ARTIFACT_COUNT artifacts"

# CLASSIFY
echo "🏷️  Classifying session..."
TOPICS=$(cat "$SUMMARY_FILE" | grep -oE '\b(auth|api|database|test|docs|security|performance)\b' | sort -u | tr '\n' ',' | sed 's/,$//')
npx claude-flow@alpha memory store --namespace "session-closeout" --key "classify-$SESSION_ID" --value "{\"session_id\": \"$SESSION_ID\", \"topics\": \"$TOPICS\"}"

# HITL
echo "👤 HUMAN REVIEW:"
cat "$SUMMARY_FILE"
read -p "Approve for archival? [y/N] " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "❌ Cancelled. Edit $SUMMARY_FILE and re-run."
  exit 1
fi

# ARCHIVE
echo "📦 Archiving..."
[ -n "$TASK_ID" ] && npx claude-flow@alpha hooks post-task --task-id "$TASK_ID"
npx claude-flow@alpha hooks session-end --generate-summary true --export-metrics true
npx claude-flow@alpha memory store --namespace "session-closeout" --key "hitl-$SESSION_ID" --value "{\"approved\": true, \"approved_at\": \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\"}"

echo "✅ Done!"
```

**Script 2: `scripts/captain-log-append.sh`** (25 lines)

```bash
#!/bin/bash
# Appends approved summary to captain's log
set -e

SESSION_ID="${1:-}"
if [ -z "$SESSION_ID" ]; then
  echo "Usage: ./scripts/captain-log-append.sh <session-id>"
  exit 1
fi

SUMMARY_FILE="sessions/$SESSION_ID/artifacts/session-summary.md"
[ ! -f "$SUMMARY_FILE" ] && echo "❌ $SUMMARY_FILE not found" && exit 1

SUMMARY_CONTENT=$(cat "$SUMMARY_FILE")
TIMESTAMP=$(date -u +"%Y-%m-%d-%H:%M:%S")
KEY="journal:$TIMESTAMP"

npx claude-flow@alpha memory store \
  --namespace "captains-log" \
  --key "$KEY" \
  --value "{\"timestamp\": \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\", \"type\": \"milestone\", \"title\": \"Session closeout: $SESSION_ID\", \"content\": $(echo "$SUMMARY_CONTENT" | jq -Rs .), \"session_id\": \"$SESSION_ID\", \"hitl_reviewed\": true}"

echo "✅ Captain's log entry: $KEY"
```

**Script 3: `scripts/session-backup.sh`** (35 lines)

```bash
#!/bin/bash
# Creates file-based backup, optionally deletes session folder
set -e

SESSION_ID="${1:-}"
DELETE_SESSION="${2:-no}"

if [ -z "$SESSION_ID" ]; then
  echo "Usage: ./scripts/session-backup.sh <session-id> [yes|no]"
  exit 1
fi

BACKUP_DIR=".swarm/backups"
mkdir -p "$BACKUP_DIR"

TIMESTAMP=$(date -u +"%Y%m%d-%H%M%S")
BACKUP_FILE="$BACKUP_DIR/session-$SESSION_ID-$TIMESTAMP.json"

echo "📦 Creating backup..."
npx claude-flow@alpha memory search --namespace "*" --pattern "*" > "$BACKUP_FILE"

BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
echo "✅ Backup: $BACKUP_FILE ($BACKUP_SIZE)"

if [ "$DELETE_SESSION" = "yes" ]; then
  SESSION_DIR="sessions/$SESSION_ID"
  if [ -d "$SESSION_DIR" ]; then
    rm -rf "$SESSION_DIR"
    echo "✅ Deleted: $SESSION_DIR"
  fi
fi

echo "📊 Summary: Session $SESSION_ID backed up ($BACKUP_SIZE), folder: $([ "$DELETE_SESSION" = "yes" ] && echo "DELETED" || echo "PRESERVED")"
```

### Step 2: Make Executable

```bash
chmod +x scripts/session-closeout.sh scripts/captain-log-append.sh scripts/session-backup.sh
```

---

## Testing (5 minutes)

```bash
# Create test session
SESSION_ID="session-$(date +%Y%m%d-%H%M%S)-test"
mkdir -p "sessions/$SESSION_ID/artifacts"
cat > "sessions/$SESSION_ID/artifacts/session-summary.md" << 'EOF'
# Test Session
- Installed session closeout scripts
- Verified workflow
- Testing complete
EOF

# Run closeout
./scripts/session-closeout.sh "$SESSION_ID" "task-test"

# Append to captain's log
./scripts/captain-log-append.sh "$SESSION_ID"

# Backup (keep session folder)
./scripts/session-backup.sh "$SESSION_ID" no

# Verify
ls -lh .swarm/backups/session-$SESSION_ID-*.json
npx claude-flow@alpha memory retrieve --namespace "session-closeout" --key "classify-$SESSION_ID"
```

---

## Usage

When you want to close a session:

```bash
./scripts/session-closeout.sh <session-id> <task-id>
./scripts/captain-log-append.sh <session-id>
./scripts/session-backup.sh <session-id> no  # or "yes" to delete session folder
```

---

## What Changed From v1

**Removed:**
- Architecture proposals
- Decision matrices
- Multi-phase deployment plans
- Complex coordination protocols
- Extensibility frameworks
- Hook integration strategies

**Kept:**
- Copy-paste scripts
- Simple usage examples
- Quick test procedure
- Verification commands

**Result:** Same functionality, 90% less documentation.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| "Session not found" | Check `SESSION_ID` variable is correct |
| "jq command not found" | `brew install jq` (macOS) or `apt-get install jq` (Linux) |
| "Permission denied" | Run `chmod +x scripts/*.sh` |
| Backup is huge | Archive old backups: `gzip .swarm/backups/session-2025-*.json` |

---

**That's it. Three scripts, five minutes to install, fifty seconds to use.**
