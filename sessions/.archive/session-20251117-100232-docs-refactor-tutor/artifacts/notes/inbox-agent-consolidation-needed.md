# Inbox Agent Consolidation - User Decision Needed

**Date**: 2025-11-17
**Issue**: Duplicate inbox agent directories with overlapping but different content

## Current State

```
inbox/
├── codex-agent/
│   ├── claude-flow-curriculum/     (UNIQUE to codex)
│   ├── code-mode-research/
│   └── db-visualization-tools/
└── cursor-agent/
    ├── code-mode-research/         (has extra README.md)
    └── db-visualization-tools/
```

## Analysis

**Not simple duplicates** - overlapping content with variations:
- `code-mode-research/` exists in both but cursor version has additional README.md
- `db-visualization-tools/` appears in both
- `claude-flow-curriculum/` only in codex-agent

**Pattern Identified**: This is the SAME pattern from docs nudges - created parallel structure without checking existing.

## Consolidation Options

### Option A: Merge to Single Agent Directory
```
inbox/agent/
├── claude-flow-curriculum/
├── code-mode-research/
└── db-visualization-tools/
```

### Option B: Organize by Topic (Not Agent)
```
inbox/
├── research/
│   └── code-mode/
├── curriculum/
│   └── claude-flow/
└── tools/
    └── db-visualization/
```

### Option C: Move to Proper Locations
- Curriculum → `docs/tutorials/`
- Research → `docs/.archive/research/` (temporal)
- Tools → `.claude/helpers/` or `scripts/`

## Recommendation

**Option C** - These don't belong in inbox/:
- Curriculum is permanent learning content → `docs/tutorials/`
- Code-mode research is temporal analysis → archive
- DB tools are utilities → `scripts/` or `.claude/helpers/`

**Inbox should be temporary holding**, not permanent storage.

## Action Required

User decision on:
1. Which option to pursue?
2. What should inbox/ be used for going forward?
3. Consolidate now or defer?

## Files Cleaned

✅ Deleted `.inbox/archive.db` (0 bytes, abandoned)
✅ Deleted `docs/guides/concepts/` (empty placeholder)
⏳ Awaiting decision on inbox agent consolidation
