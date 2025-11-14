# Inbox Archive Quick Reference

## Basic Usage

```bash
node .swarm/hooks/inbox-archive.js <source> <destination> [notes] [tags]
```

## Common Patterns

### Simple Archive
```bash
node .swarm/hooks/inbox-archive.js ./inbox/file.md ./docs/file.md
```

### With Notes
```bash
node .swarm/hooks/inbox-archive.js ./inbox/file.md ./docs/file.md "Reviewed today"
```

### With Tags
```bash
node .swarm/hooks/inbox-archive.js ./inbox/file.md ./docs/file.md "Notes" "tag1,tag2,tag3"
```

## File Locations

- **Script**: `.swarm/hooks/inbox-archive.js`
- **Manifests**: `.inbox/archive/*.json`
- **Tests**: `tests/inbox-archive.test.js`
- **Docs**: `docs/guides/inbox-archival-workflow.md`

## What Gets Created

1. **JSON Manifest**: `.inbox/archive/TIMESTAMP-filename.json`
   - Timestamp, source, destination
   - Notes, tags, metadata

2. **Copied File**: At specified destination
   - Creates directories as needed
   - Overwrites if exists

3. **Captain's Log Entry**: Via `hooks notify`
   - Includes source → destination
   - Includes notes and tags

## Common Tags

```
# Status
status:review, status:approved, status:rejected

# Priority
priority:high, priority:medium, priority:low

# Type
type:feature, type:bug, type:docs, type:research

# Phase
phase:planning, phase:implementation, phase:testing
```

## Query Manifests

```bash
# All manifests
ls -lh .inbox/archive/

# Find by tag
jq 'select(.tags[] | contains("feature"))' .inbox/archive/*.json

# Recent archives
find .inbox/archive -name "*.json" -mtime -7 -exec cat {} \;

# Pretty print
jq . .inbox/archive/2025*.json
```

## Troubleshooting

```bash
# Make executable
chmod +x .swarm/hooks/inbox-archive.js

# Run tests
node tests/inbox-archive.test.js

# Test Captain's Log
npx claude-flow@alpha hooks notify --message "test"

# Validate JSON
cat .inbox/archive/latest.json | jq .
```

## Error Messages

| Error | Meaning | Solution |
|-------|---------|----------|
| `Missing required arguments` | Need source and destination | Provide both paths |
| `Source file not found` | Source doesn't exist | Check file path |
| `Failed to write manifest` | Permission issue | Check `.inbox/archive/` permissions |
| `Failed to copy file` | Copy error | Check destination permissions |

## Exit Codes

- `0`: Success
- `1`: Error (see error message)

## Integration

Logs to Captain's Log via:
```bash
npx claude-flow@alpha hooks notify --message "..." --level "info"
```

## Examples by Use Case

### Feature Development
```bash
node .swarm/hooks/inbox-archive.js \
  ./inbox/feature-spec.md \
  ./docs/projects/new-feature/spec.md \
  "Approved for Q2 2025" \
  "feature,approved,q2"
```

### Bug Tracking
```bash
node .swarm/hooks/inbox-archive.js \
  ./inbox/bug-123.md \
  ./sessions/2025-11-13/artifacts/bug-123-fixed.md \
  "Fixed in today's session" \
  "bug,fixed,session"
```

### Research
```bash
node .swarm/hooks/inbox-archive.js \
  ./inbox/research-notes.md \
  ./docs/reference/research-notes.md \
  "Performance optimization research" \
  "research,performance,reference"
```

### Code Review
```bash
node .swarm/hooks/inbox-archive.js \
  ./inbox/review-feedback.md \
  ./docs/projects/feature/review.md \
  "Addressed all review comments" \
  "review,completed,feedback"
```

## See Also

- **Full Guide**: `docs/guides/inbox-archival-workflow.md`
- **Test Suite**: `tests/inbox-archive.test.js`
- **CLAUDE.md**: Project configuration
