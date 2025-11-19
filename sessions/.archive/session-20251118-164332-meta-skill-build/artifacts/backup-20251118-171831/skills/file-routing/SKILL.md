---
name: file-routing
description: AI self-check reference for CLAUDE.md file routing compliance
version: 1.0.0
triggers:
  - "Check file routing for [path]"
  - "Where should I save [file]?"
  - "Validate file path"
stock_first: true
hitl_required: false
---

# File Routing Skill

Quick reference guide for AI agents to ensure CLAUDE.md compliance.

## What This Skill Does

Provides lookup table for correct session artifact paths. **Documentation only** - no executable code.

## The Golden Rule

**ALL new files go to:** `sessions/$SESSION_ID/artifacts/{code,tests,docs,scripts,notes}/`

**NEVER write to:** Root `tests/`, `docs/`, `scripts/`, `code/` directories

## Usage

**Invoke as skill:**
"Check file routing for tests/api.test.js"

**Response:**
```
⚠️  CLAUDE.md Suggestion (AI agents only)

Proposed: tests/api.test.js
Suggests: sessions/$SESSION_ID/artifacts/tests/api.test.js

Why: Keep workspace clean, enable session isolation
```

**AI agents:** Consult this skill before writing files
**Users:** No restrictions (always free to write anywhere)

## Stock Infrastructure

- Pure documentation reference (100% stock)
- No custom validation code
- Uses existing $SESSION_ID environment variable
- Aligns with CLAUDE.md rules

## Related Documentation

- [CLAUDE.md](../../../CLAUDE.md) - Full file organization rules
- [Session Management](../../../sessions/README.md) - Artifact structure
