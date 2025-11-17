# Project Documentation

This folder contains user project documentation and materials.

## What Belongs in docs/

**Content Type**: USER-FACING DOCUMENTATION

This directory is for:
- ✅ **User guides** explaining how to use features
- ✅ **Concept explanations** for understanding the system
- ✅ **How-to guides** for accomplishing tasks
- ✅ **Reference documentation** (checklists, quick references)
- ✅ **Troubleshooting guides** for fixing common problems

**NOT for:**
- ❌ Architectural analysis and system design work
- ❌ Integration investigations and technical deep-dives
- ❌ "Working on the system" documentation
- ❌ Session-specific artifacts (use `sessions/$SESSION_ID/artifacts/docs/`)

**For system development work**, see: `inbox/assistant/` (architectural problems, integration analysis)

---

## Structure

### `guides/`
Comprehensive user-facing documentation following the Divio system:
- `getting-started/` - Tutorials for beginners
- `how-to/` - Step-by-step task guides
- `reference/` - Quick references and checklists
- `troubleshooting/` - Problem-solving guides
- `concepts/` - Explanations and architecture
- `advanced/` - Advanced topics and optimization

See: [guides/README.md](guides/README.md) for complete guide catalog

### `projects/`
User projects will be organized here. Each project gets its own subfolder when work begins.

**Current status:** Empty (setup phase - waiting for first project)

---

## Usage

- **User manages:** Project folders, documentation structure, content organization
- **System creates:** Session artifacts go to `sessions/$SESSION_ID/artifacts/docs/` (not here)

This folder reflects the current state of your projects. Session-specific documentation stays in session artifacts.

---

## Content Placement Quick Reference

| Content Type | Location | Example |
|--------------|----------|---------|
| User guide | `docs/guides/how-to/` | "How to test integrations" |
| Feature explanation | `docs/guides/concepts/` | "Understanding sessions" |
| Troubleshooting | `docs/guides/troubleshooting/` | "Fixing MCP errors" |
| Architectural analysis | `inbox/assistant/` | "ReasoningBank integration research" |
| System integration work | `inbox/assistant/` | "Claude-flow hook system investigation" |
| Session artifacts | `sessions/$SESSION_ID/artifacts/docs/` | Session-specific documentation |

**Rule of thumb:** If it's explaining features TO the user, it goes in `docs/guides/`. If it's analyzing the system FOR development, it goes in `inbox/assistant/`.
