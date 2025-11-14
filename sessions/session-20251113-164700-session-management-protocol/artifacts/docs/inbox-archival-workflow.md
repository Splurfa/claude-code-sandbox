# Inbox Archival Workflow

## Overview

Simple, hook-based archival system for managing files from the inbox with structured metadata tracking and Captain's Log integration.

## Philosophy

- **Time-neutral**: Archive on-demand when you're ready
- **Scale-agnostic**: Works for 10 files or 10,000 files
- **Stock-first**: 95% claude-flow infrastructure, 5% thin wrapper

## Quick Start

```bash
# Basic archival
node .swarm/hooks/inbox-archive.js <source> <destination>

# With notes and tags
node .swarm/hooks/inbox-archive.js <source> <destination> "Notes here" "tag1,tag2"
```

## Examples

### Archive a feature idea to project docs
```bash
node .swarm/hooks/inbox-archive.js \
  ./inbox/feature-idea.md \
  ./docs/projects/new-feature/idea.md \
  "Reviewed and approved for Q2" \
  "feature,approved,q2"
```

### Archive bug report to session artifacts
```bash
node .swarm/hooks/inbox-archive.js \
  ./inbox/bug-report.txt \
  ./sessions/2024-01-15/artifacts/bug-report.txt \
  "Fixed in today's session" \
  "bug,fixed,session"
```

### Archive research notes
```bash
node .swarm/hooks/inbox-archive.js \
  ./inbox/api-research.md \
  ./docs/reference/api-research.md \
  "Research on REST vs GraphQL" \
  "research,api,reference"
```

## What It Does

1. **Validates** source file exists
2. **Creates** JSON manifest in `.inbox/archive/`
3. **Copies** file to destination (creates directories as needed)
4. **Logs** to Captain's Log via claude-flow hooks
5. **Returns** manifest path for programmatic use

## Manifest Structure

```json
{
  "timestamp": "2025-11-13T23:46:59.229Z",
  "source": ".inbox/test-file.md",
  "destination": "docs/test-archive.md",
  "filename": "test-file.md",
  "notes": "Testing archival script",
  "tags": ["test", "verification"],
  "archived_by": "inbox-archive-hook",
  "manifest_path": ".inbox/archive/2025-11-13T23-46-59-229Z-test-file.md.json"
}
```

## Idempotent Design

Safe to run multiple times:
- Overwrites manifest if re-run with same source
- Overwrites destination file if exists
- Creates directories as needed
- Never fails if paths already exist

## Error Handling

Clear error messages for common issues:
- Missing required arguments
- Source file not found
- Permission errors on file operations
- Captain's Log integration failures (non-fatal)

## Integration Points

### Captain's Log
Automatically logs archival events:
```
📦 Archived: .inbox/feature.md → docs/projects/feature.md | Notes: Approved | Tags: feature, approved
```

### Query Manifests
All manifests are JSON, ready for future querying:
```bash
# Find all archived features
jq 'select(.tags[] | contains("feature"))' .inbox/archive/*.json

# Find archives from last 7 days
find .inbox/archive -name "*.json" -mtime -7 -exec cat {} \;
```

## Workflow Patterns

### Daily Inbox Review
```bash
# Review inbox files
ls -lh .inbox/

# Archive each file with notes
for file in .inbox/*.md; do
  node .swarm/hooks/inbox-archive.js "$file" "docs/$(basename $file)" "Reviewed today"
done
```

### Session Closeout
```bash
# Archive session artifacts to project
node .swarm/hooks/inbox-archive.js \
  ./sessions/active-session/artifacts/implementation.js \
  ./src/features/implementation.js \
  "Completed in session" \
  "implementation,session"
```

### Bulk Tagging
```bash
# Archive multiple files with same tag
for file in .inbox/features-*.md; do
  node .swarm/hooks/inbox-archive.js \
    "$file" \
    "./docs/projects/$(basename $file)" \
    "Feature batch review" \
    "feature,batch,q2"
done
```

## File Organization

```
workspace/
├── .inbox/
│   ├── archive/                  # JSON manifests
│   │   ├── 2025-11-13T*.json    # Timestamped
│   │   └── 2025-11-14T*.json
│   └── incoming-files.md         # Files to process
├── .swarm/
│   └── hooks/
│       └── inbox-archive.js      # This script
├── docs/
│   └── projects/                 # Archived destinations
└── sessions/
    └── */artifacts/              # Session archives
```

## Troubleshooting

### Script not executable
```bash
chmod +x .swarm/hooks/inbox-archive.js
```

### Captain's Log not logging
- Verify claude-flow is installed: `npx claude-flow@alpha --version`
- Check `.swarm/memory.db` exists and is writable
- Try manually: `npx claude-flow@alpha hooks notify --message "test"`

### JSON validation
```bash
# Validate a manifest
cat .inbox/archive/latest.json | jq .

# Pretty print all manifests
jq . .inbox/archive/*.json
```

## Extending the System

### Custom Tags
Add any tags that fit your workflow:
- `priority:high`, `priority:medium`, `priority:low`
- `type:feature`, `type:bug`, `type:docs`
- `status:review`, `status:approved`, `status:rejected`

### Automation
Integrate with your workflow:
```bash
# Pre-commit hook to archive staged files from inbox
git diff --cached --name-only --diff-filter=D | \
  grep '^\.inbox/' | \
  while read file; do
    node .swarm/hooks/inbox-archive.js "$file" "docs/$(basename $file)"
  done
```

## Best Practices

1. **Be descriptive in notes**: Future you will appreciate context
2. **Use consistent tags**: Easier to query later
3. **Archive regularly**: Don't let inbox grow unbounded
4. **Review manifests**: Periodically check `.inbox/archive/` for insights
5. **Keep destinations organized**: Use meaningful directory structures

## See Also

- **CLAUDE.md**: Project configuration and workflow principles
- **Captain's Log**: `sessions/captains-log/` for narrative context
- **Session Artifacts**: `sessions/*/artifacts/` for session outputs
