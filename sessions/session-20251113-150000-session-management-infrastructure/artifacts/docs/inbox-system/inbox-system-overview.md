# Inbox System Overview

## What is the Inbox?

The inbox is a **temporary triage zone** for unprocessed materials in your workspace. It's designed to capture incoming information quickly without forcing immediate organizational decisions, while ensuring nothing gets lost or forgotten.

**Core Principle**: The inbox is NOT permanent storage. Every item should eventually be promoted to its permanent location or archived.

---

## Documentation Structure

This inbox system consists of four complementary documents:

### 1. **This Overview** (`inbox-system-overview.md`)
- High-level philosophy and structure
- When and why to use the inbox
- How it integrates with the overall workflow

### 2. **Natural Language Guide** (`inbox-natural-language-guide.md`)
- Complete reference for Claude Code behavior
- Natural language triggers and responses
- Decision trees and processing workflows
- HITL integration and logging patterns

### 3. **Quick Reference Card** (`inbox-quick-reference.md`)
- Fast lookup for common commands
- Cheat sheet format
- Essential patterns and rules

### 4. **Interaction Examples** (`inbox-interaction-examples.md`)
- Real-world conversation examples
- Complete workflows from trigger to completion
- Error handling scenarios
- Best practices in action

---

## Physical Structure

```
inbox/
├── ideas/          # Project ideas, feature brainstorms
├── projects/       # Project proposals awaiting approval
├── reference/      # Research, documentation, external materials
└── triage/         # Uncategorized items needing classification
```

### When to Use Each Subdirectory

| Directory | Use When | Example |
|-----------|----------|---------|
| `ideas/` | Capturing early-stage thoughts about features or projects | `new-feature-brainstorm.md` |
| `projects/` | Storing project proposals before they're approved and moved to `docs/projects/` | `mobile-app-proposal.md` |
| `reference/` | Collecting research, documentation, or materials you know you'll reference | `react-best-practices.md` |
| `triage/` | Dropping anything that needs classification later | `meeting-notes.md`, `untitled-notes.md` |

**Rule of thumb**: If you're not sure where it goes, put it in `triage/`. You'll classify it during inbox review.

---

## Integration with Workspace Learning Infrastructure

The inbox system integrates seamlessly with the three-storage system:

### 1. Memory (`.swarm/memory.db`)
**Stores**:
- Archive decisions and patterns
- Learned destination preferences
- Archival history

**Namespaces**:
- `inbox-archive` - Log of all archived/deleted items
- `inbox-patterns` - Learned patterns for destination suggestions

### 2. Captain's Log (`sessions/captains-log/`)
**Stores**:
- Human-readable record of inbox decisions
- Rationale for archival choices
- Context about why items were kept/deleted

**Format**:
```json
{
  "type": "decision",
  "title": "Archived inbox item: [filename]",
  "content": "Moved [file] from inbox to [destination]. Reason: [explanation]",
  "tags": ["inbox", "archive", "file-management"]
}
```

### 3. Session Backups (`.swarm/backups/`)
**Stores**:
- Inbox state at session end
- Files that were in inbox during session
- Archival decisions made during session

---

## Workflow Integration Points

### Session Start
```
Pre-Task Hook → Inbox Check → Offer to Review
                      ↓
              User decides: Review now or later
```

**Natural language**: "I noticed items in your inbox. Review before starting work?"

### During Work
```
User works with inbox file → Finishes task → Offer to Archive
                                     ↓
                             User decides: Archive or keep
```

**Natural language**: "You've been working with [file]. Done with it? Archive now?"

### Session End
```
Post-Task Hook → Inbox Check → Offer to Triage
                      ↓
              User decides: Triage or defer
```

**Natural language**: "Items still in inbox. Triage before closing session?"

---

## Decision Philosophy

### The "Inbox Zero" Mindset

The inbox system follows the **Inbox Zero** philosophy: the inbox should be empty (or nearly empty) at the end of each session. This doesn't mean processing everything immediately—it means being intentional about what stays.

**Acceptable inbox states**:
- ✅ **Empty**: Ideal state, everything processed
- ✅ **1-3 items**: Active work materials, will be archived soon
- ⚠️  **4-10 items**: Time to schedule a triage session
- ❌ **10+ items**: Inbox is becoming a dumping ground, needs immediate triage

### The "Promote, Don't Hoard" Principle

**Good inbox habits**:
- ✅ Capture quickly, organize deliberately
- ✅ Review regularly (at least weekly)
- ✅ Promote valuable materials to permanent locations
- ✅ Delete obsolete items promptly
- ✅ Use inbox as a **staging area**, not **storage**

**Bad inbox habits**:
- ❌ Treating inbox as permanent storage
- ❌ Letting items accumulate indefinitely
- ❌ Skipping triage sessions
- ❌ Keeping "just in case" items without clear value

---

## File Lifecycle

```
1. CAPTURE
   New material → inbox/[subdirectory]/[file]
   ↓
2. TRIAGE (during inbox review)
   Read → Analyze → Suggest destination
   ↓
3. DECIDE (HITL)
   User chooses: Keep / Archive / Delete
   ↓
4. EXECUTE
   Move to permanent location OR Delete
   ↓
5. LOG
   Record decision in memory + captain's log
   ↓
6. LEARN
   Update patterns for future suggestions
```

---

## Permanent Destinations

### Common Archive Locations

| Content Type | Permanent Location | Reasoning |
|--------------|-------------------|-----------|
| Project documentation | `docs/projects/[name]/` | Project-specific materials |
| Technical reference | `docs/reference/[topic]/` | General reference for future use |
| People profiles | `docs/reference/people/` | Team/collaborator information |
| Meeting notes | `docs/reference/meetings/` | Historical record of discussions |
| Research findings | `docs/reference/research/` | Investigation results |
| API documentation | `docs/reference/apis/` | API contracts and schemas |
| Code snippets | `docs/reference/snippets/` | Reusable code examples |
| Session artifacts | `sessions/[session-id]/artifacts/` | Session-specific outputs |
| Deprecated content | `.archive/deprecated/` | Historical materials no longer relevant |

### Creating New Destinations

When existing destinations don't fit, create new ones following these rules:

1. **Be specific**: `docs/reference/deployment/` not `docs/reference/misc/`
2. **Use hierarchy**: `docs/reference/databases/postgresql/` not `docs/reference/postgresql-stuff/`
3. **Think future**: "Will I remember to look here in 6 months?"
4. **Document it**: Add new destinations to this guide

---

## Natural Language Triggers

### Review Commands
- "Let's review my inbox"
- "Check my inbox"
- "What's in my inbox?"
- "Show me inbox items"
- "Triage everything"

### Archive Commands
- "Archive [file] to [destination]"
- "I'm done with [file]"
- "Move [file] to docs/"

### Batch Commands
- "Process all inbox items"
- "Triage everything in inbox"
- "Clean up my inbox"

See `inbox-quick-reference.md` for complete list.

---

## HITL Requirements

| Action | HITL Level | Required? |
|--------|-----------|-----------|
| **Read inbox** | 🟢 Auto (Level 1) | No - read-only operation |
| **List contents** | 🟢 Auto (Level 1) | No - informational only |
| **Suggest destination** | 🟢 Auto (Level 1) | No - analysis, not execution |
| **Archive file** | 🟡 Ask First (Level 2) | **Yes** - moves file, reversible |
| **Delete file** | 🔴 Always HITL (Level 3) | **Yes** - irreversible data loss |

See `docs/protocols/hitl-workflow.md` for complete HITL documentation.

---

## Memory & Learning

### Pattern Learning

The inbox system learns from your decisions to improve future suggestions:

**First time**: Tentative suggestion
```
Confidence: 0.5
Suggestion: "This might belong in docs/reference/..."
```

**After approval**: Confident suggestion
```
Confidence: 0.95
Suggestion: "Based on past decisions, archive to docs/reference/..."
```

**After multiple approvals**: Very confident
```
Confidence: 0.99
Suggestion: "You typically archive files like this to docs/reference/..."
```

### Pattern Storage

```bash
# Stored in memory after each archive action
{
  "content_type": "linkedin_profile",
  "keywords": ["linkedin", "profile", "experience"],
  "preferred_destination": "docs/reference/people/",
  "confidence": 0.95,
  "sample_count": 3,
  "last_updated": "2025-11-13T16:00:00Z"
}
```

**Benefit**: Over time, suggestions become more accurate and require less manual correction.

---

## Best Practices

### For Effective Inbox Management

1. **Capture freely**: Don't overthink where things go initially—just capture them
2. **Review regularly**: Weekly reviews prevent accumulation
3. **Decide quickly**: Don't deliberate for minutes—make a decision and move on
4. **Trust suggestions**: Claude Code learns your preferences over time
5. **Correct when wrong**: When suggestions are off, correct them to improve learning
6. **Keep it empty**: Aim for inbox zero at end of each week

### For Claude Code Integration

1. **Read before suggesting**: Always analyze content first
2. **Context matters**: Consider what user is working on
3. **Be specific**: Never suggest vague destinations like "docs/"
4. **Explain reasoning**: Tell user WHY a destination makes sense
5. **HITL always**: Never auto-archive without approval
6. **Log everything**: Record decisions for learning
7. **Handle errors gracefully**: File exists? Offer options, don't fail

---

## Common Patterns

### ✅ Good Inbox Flow

```
1. Capture: Save LinkedIn profile to inbox/reference/
2. Review: "Let's review inbox" (next session)
3. Analyze: "This is a professional profile..."
4. Suggest: "Archive to docs/reference/people/"
5. Approve: User confirms
6. Execute: Move file
7. Log: Record decision
8. Learn: Update patterns
```

### ❌ Bad Inbox Flow

```
1. Capture: Save file to inbox/
2. Forget: Never review
3. Accumulate: More files added
4. Overwhelm: Too many items to process
5. Ignore: Inbox becomes dumping ground
```

---

## Troubleshooting

### Issue: Inbox keeps filling up

**Solution**: Schedule regular review sessions
```bash
# Add to weekly routine
"Every Friday: Review and triage inbox"
```

### Issue: Can't decide where to archive

**Solution**: Ask for help
```
"I'm not sure where this belongs. Can you suggest some options?"
```

Claude Code will analyze content and provide multiple destination options.

### Issue: Suggestions are wrong

**Solution**: Correct them and patterns will improve
```
User: "Actually, archive to [different location]"
Claude Code: "Got it! I'll remember that for next time."
```

### Issue: Accidentally deleted something

**Solution**: Check session backups
```bash
# Session backups contain inbox state
ls .swarm/backups/session-*.json
```

---

## Integration with Other Systems

### Session Lifecycle
- Inbox checks integrate at session start/end
- See `docs/guides/session-lifecycle-guide.md`

### HITL Workflow
- Archive actions require HITL approval
- See `docs/protocols/hitl-workflow.md`

### Captain's Log
- All inbox decisions logged to captain's log
- See `docs/protocols/captain-log-protocol.md`

### Memory Management
- Patterns stored in memory namespaces
- See `docs/reference/memory-namespace-conventions.md`

---

## Quick Start

### For Users

1. **Drop files in inbox**: Save to `inbox/[subdirectory]/[file]`
2. **Review periodically**: Say "Let's review my inbox"
3. **Approve suggestions**: Reply "yes" or correct destination
4. **Keep it clean**: Aim for empty inbox

### For Claude Code

1. **Detect triggers**: "inbox", "review", "triage", etc.
2. **Read & analyze**: Always understand content first
3. **Suggest destinations**: Use patterns and decision trees
4. **Get HITL approval**: Never auto-execute
5. **Execute & log**: Move files, record decisions
6. **Learn patterns**: Update memory for future

---

## Summary

The inbox system is a **lightweight, human-centric triage system** that:
- Captures information quickly without forcing immediate decisions
- Provides intelligent suggestions based on content and learned patterns
- Requires HITL approval for all file movements
- Integrates seamlessly with session lifecycle and memory systems
- Learns from user decisions to improve over time

**Philosophy**: Capture → Review → Decide → Archive → Learn

---

## Next Steps

- **Read**: `inbox-natural-language-guide.md` for complete technical reference
- **Reference**: `inbox-quick-reference.md` for fast lookups
- **Learn**: `inbox-interaction-examples.md` for real-world scenarios
- **Practice**: Start using inbox and let the system learn your preferences

---

**Remember**: The inbox is a tool to reduce cognitive load during capture while ensuring nothing is lost. Review regularly, decide quickly, and trust the system to learn from your choices.
