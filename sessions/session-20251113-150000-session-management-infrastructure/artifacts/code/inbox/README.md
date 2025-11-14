# Inbox Processing Workflow

## Purpose

The inbox is a staging area for unprocessed content before it's organized into the project structure. This prevents clutter in the root directory and provides a clear workflow for handling new information.

## Directory Structure

```
inbox/
├── reference/     # Background materials, research, external docs
├── projects/      # New project proposals and planning materials
├── ideas/         # Quick captures, brainstorms, unformed thoughts
└── triage/        # Items that need classification

.inbox/
└── archive/       # Processed items moved here automatically
```

## Processing Workflow

### 1. Capture
Place new content in the appropriate inbox subdirectory:
- **reference/**: Articles, documentation, profiles, research materials
- **projects/**: Project proposals, requirements, planning documents
- **ideas/**: Quick notes, brainstorms, potential features
- **triage/**: Unsure where it belongs? Start here.

### 2. Review
Periodically review inbox contents:
```bash
# List all inbox items
find inbox -type f -name "*.md"

# Review specific category
ls -lh inbox/reference/
```

### 3. Process
For each item, decide:
- **Promote to project**: Move to `docs/projects/<name>/`
- **Add to documentation**: Integrate into existing docs
- **Archive**: Move to `.inbox/archive/` when no longer needed
- **Delete**: If truly not valuable

### 4. Archive
Processed items go to `.inbox/archive/` (gitignored):
```bash
mv inbox/reference/processed-item.md .inbox/archive/
```

## Examples

### Example 1: LinkedIn Profile (Reference)
```
inbox/reference/derek-yellin-linkedin-profile-extract.md
  ↓ (review and extract relevant info)
docs/projects/thread-automation/team-reference.md
  ↓ (original archived)
.inbox/archive/derek-yellin-linkedin-profile-extract.md
```

### Example 2: New Project Idea
```
inbox/ideas/ai-content-scheduler.md
  ↓ (validate and plan)
inbox/projects/content-scheduler-spec.md
  ↓ (approved for development)
docs/projects/content-scheduler/
  ↓ (original archived)
.inbox/archive/
```

## Guidelines

1. **Keep inbox lean**: Process regularly, don't let it accumulate
2. **One item, one file**: Each distinct piece of content gets its own file
3. **Descriptive names**: Use clear, searchable filenames
4. **Date prefix optional**: For time-sensitive items: `2025-11-13-market-research.md`
5. **Quick triage**: If unsure, put in `triage/` and decide later
6. **Archive, don't delete**: Keep history in `.inbox/archive/` (gitignored)

## Integration with Session Workflow

When agents create artifacts during sessions:
1. Agents write to `sessions/<session-id>/artifacts/`
2. During closeout, review which artifacts are valuable
3. Move selected artifacts to `inbox/` for processing
4. Use standard inbox workflow to integrate into project structure

This keeps session work isolated while providing a clear path to permanent documentation.

## Commands

```bash
# Create new inbox item
touch inbox/reference/new-article.md

# List all pending items
find inbox -type f

# Archive processed item
mv inbox/reference/old-item.md .inbox/archive/

# Clean up empty directories
find inbox -type d -empty -delete

# Review archive
ls -lh .inbox/archive/
```

## Notes

- `.inbox/archive/` is gitignored to keep repo clean
- `inbox/` subdirectories are tracked in git as staging areas
- This workflow integrates with session closeout and project promotion
- Focus on moving items forward, not perfect classification
