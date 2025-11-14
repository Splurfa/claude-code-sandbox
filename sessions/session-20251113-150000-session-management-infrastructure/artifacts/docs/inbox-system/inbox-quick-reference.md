# Inbox Quick Reference Card

## Natural Language Commands

| User Says | Claude Code Response |
|-----------|---------------------|
| "Let's review my inbox" | List all items by category, ask to proceed with triage |
| "Check my inbox" | Show inbox contents summary |
| "What's in my inbox?" | Display categorized list of all files |
| "Archive [file]" | Suggest destination, get HITL approval, execute |
| "I'm done with [file]" | Suggest archival options for specific file |
| "Triage everything" | Start batch processing workflow |
| "Delete old items" | Review by age, suggest deletions (HITL required) |

## Inbox Structure

```
inbox/
├── ideas/          # Project ideas, brainstorms
├── projects/       # Project proposals awaiting approval
├── reference/      # Research, documentation, links
└── triage/         # Uncategorized items needing review
```

## Archive Decision Tree (Quick)

```
1. Is it documentation/research?
   → docs/reference/[topic]/

2. Is it a project proposal?
   → docs/projects/[name]/

3. Is it code/implementation?
   → src/[domain]/

4. Is it a session artifact?
   → sessions/[session-id]/artifacts/

5. Is it deprecated?
   → .archive/[category]/

6. Unsure?
   → Ask user for guidance
```

## Content → Destination Mapping

| Content Type | Destination |
|--------------|-------------|
| LinkedIn profiles, resumes | `docs/reference/people/` |
| API documentation | `docs/reference/apis/` |
| Research notes | `docs/reference/research/` |
| Meeting notes | `docs/reference/meetings/` |
| Project proposals | `docs/projects/[name]/` |
| Code snippets | `docs/reference/snippets/` |
| Deprecated files | `.archive/deprecated/` |

## HITL Requirements

| Action | Level | Required? |
|--------|-------|-----------|
| Read inbox | 🟢 Auto | No |
| Suggest destination | 🟢 Auto | No |
| Archive file | 🟡 Ask First | **Yes** |
| Delete file | 🔴 Always HITL | **Yes** |

## Workflow Steps

1. **PRESENT**: Show file content & summary
2. **ANALYZE**: Suggest destinations with reasoning
3. **HITL**: Get explicit user approval
4. **EXECUTE**: Archive and log the decision

## Memory Logging

```bash
# Archive action
npx claude-flow@alpha memory store \
  --namespace "inbox-archive" \
  --key "archive-$(date +%Y-%m-%d-%H:%M:%S)" \
  --value '{...}'

# Captain's log
npx claude-flow@alpha memory store \
  --namespace "captains-log" \
  --key "journal:$(date +%Y-%m-%d-%H:%M:%S)" \
  --value '{...}'
```

## Session Integration Checkpoints

| When | Action |
|------|--------|
| **Session Start** | "I noticed items in inbox. Review now?" |
| **Session End** | "Items still in inbox. Triage before closing?" |
| **After File Work** | "Done with [file]? Archive now?" |
| **Manual Trigger** | User mentions inbox explicitly |

## Common Patterns

### ✅ Good Suggestion
- Specific destination: `docs/reference/people/john-doe.md`
- Context-aware: "Still working on this, suggest keeping"
- Reasoning included: "Because it's reference material"
- Clear recommendation: "Archive to X"

### ❌ Bad Suggestion
- Vague destination: `docs/`
- No context: Just lists options
- No reasoning: Doesn't explain why
- No recommendation: Leaves user guessing

## Error Handling

| Error | Solution |
|-------|----------|
| Destination exists | Ask: merge/rename/replace/cancel |
| Invalid path | Validate, request new destination |
| Permission error | Report gracefully, keep in inbox |

## Best Practices

1. **Read first**: Always analyze content before suggesting
2. **Be specific**: Never suggest vague paths
3. **Explain why**: Provide reasoning for suggestions
4. **HITL required**: Never auto-archive/delete
5. **Log everything**: Store patterns for learning
6. **Handle errors**: Graceful failure, no data loss

## Quick Commands

```bash
# List inbox
find inbox/ -type f ! -path "*/\.*"

# Count items
find inbox/ -type f ! -path "*/\.*" | wc -l

# Archive pattern
mkdir -p "$(dirname "$DEST")" && mv "$SRC" "$DEST"

# Log decision
npx claude-flow@alpha memory store \
  --namespace "inbox-archive" \
  --key "archive-$(date +%Y-%m-%d-%H:%M:%S)" \
  --value '{"source": "...", "destination": "..."}'
```

---

**Remember**: Inbox is temporary. Every item needs a path forward (archive, promote, or delete).
