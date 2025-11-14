# Inbox Natural Language Interface Guide

## Overview

The inbox system provides a human-centric workspace for organizing unprocessed materials before they're promoted to their permanent locations. This guide defines how Claude Code should interpret natural language commands, when to suggest archival actions, and how to integrate inbox management seamlessly into the development workflow.

**Philosophy**: The inbox is a **triage zone**, not a dumping ground. Materials arrive here temporarily and should either be promoted to their permanent home or archived when no longer needed.

## Inbox Structure

```
inbox/
├── ideas/          # Project ideas, feature requests, brainstorms
├── projects/       # Project proposals awaiting approval
├── reference/      # Research materials, documentation, links
└── triage/         # Uncategorized items needing review
```

**Key Principle**: Files in inbox are **transient**. Every item should eventually move to a permanent location or be archived.

---

## Natural Language Triggers

### 1. Initiating Inbox Review

**User phrases that trigger inbox review**:
- "Let's review my inbox"
- "Check my inbox"
- "What's in my inbox?"
- "Show me what needs attention"
- "Let's triage the inbox"
- "Review inbox for archiving"
- "Can you look at my inbox?"

**Claude Code Response Pattern**:
```bash
# 1. List all inbox contents
find /Users/splurfa/common-thread-sandbox/inbox -type f ! -path "*/\.*"

# 2. Categorize by subdirectory
echo "📥 Inbox Review"
echo "==============="
echo ""
echo "Ideas (inbox/ideas/):"
ls inbox/ideas/ 2>/dev/null || echo "  (empty)"
echo ""
echo "Projects (inbox/projects/):"
ls inbox/projects/ 2>/dev/null || echo "  (empty)"
echo ""
echo "Reference (inbox/reference/):"
ls inbox/reference/ 2>/dev/null || echo "  (empty)"
echo ""
echo "Triage (inbox/triage/):"
ls inbox/triage/ 2>/dev/null || echo "  (empty)"

# 3. Present summary
echo ""
echo "Total items: X files across Y categories"
echo ""
echo "Ready to review items one by one?"
```

**Example Response**:
```
📥 Inbox Review
===============

Ideas (inbox/ideas/):
  (empty)

Projects (inbox/projects/):
  (empty)

Reference (inbox/reference/):
  derek-yellin-linkedin-profile-extract.md

Triage (inbox/triage/):
  (empty)

Total items: 1 file across 1 category

Ready to review items one by one? I can help you decide whether to:
- Keep in inbox (still needed for active work)
- Archive to a permanent location
- Delete if no longer relevant
```

---

## Processing Workflow

### Phase 1: Present Item for Review

When reviewing inbox items, Claude Code should:

1. **Read the file** to understand content
2. **Analyze content** to suggest destinations
3. **Present options** with reasoning

**Presentation Format**:
```markdown
## Reviewing: [filename]

**Location**: inbox/[subdirectory]/[filename]
**Size**: [file size]
**Last modified**: [timestamp]

**Content Summary**:
[2-3 sentence summary of what the file contains]

**Suggested Actions**:
1. 📂 **Keep in inbox** - Still relevant for active work
2. 📦 **Archive to:** [suggested destination] - [reasoning]
3. 🗑️  **Delete** - No longer needed

**Recommendation**: [Archive/Keep/Delete] because [reason]

What would you like to do with this file?
```

### Phase 2: Content Analysis & Destination Suggestions

**Decision Tree for Destination Suggestions**:

```
Is it documentation/research?
├─ Yes → Suggest: docs/reference/[topic]/
└─ No
   ├─ Is it a project proposal?
   │  ├─ Yes → Suggest: docs/projects/[project-name]/
   │  └─ No
   │     ├─ Is it code/implementation?
   │     │  ├─ Yes → Suggest: src/[domain]/
   │     │  └─ No
   │     │     ├─ Is it a session artifact?
   │     │     │  ├─ Yes → Suggest: sessions/[session-id]/artifacts/
   │     │     │  └─ No
   │     │     │     └─ Is it deprecated/historical?
   │     │     │        ├─ Yes → Suggest: .archive/[category]/
   │     │     │        └─ No → Ask user for guidance
```

**Content Pattern Matching**:

| Content Type | Keywords/Patterns | Suggested Destination |
|--------------|-------------------|----------------------|
| LinkedIn profile | "LinkedIn", "profile", "experience", "education" | `docs/reference/people/` |
| API documentation | "API", "endpoint", "schema", "routes" | `docs/reference/apis/` |
| Project proposal | "proposal", "requirements", "goals", "scope" | `docs/projects/[name]/` |
| Research notes | "research", "findings", "notes", "investigation" | `docs/reference/research/` |
| Meeting notes | "meeting", "discussion", "attendees", "action items" | `docs/reference/meetings/` |
| Code snippets | Code blocks, imports, functions | `src/[domain]/` or `docs/reference/snippets/` |
| Deprecated content | "old", "deprecated", "archived", "replaced" | `.archive/deprecated/` |

**Example Analysis**:

```markdown
## Reviewing: derek-yellin-linkedin-profile-extract.md

**Location**: inbox/reference/derek-yellin-linkedin-profile-extract.md
**Size**: 4.5 KB
**Last modified**: 2025-11-13 15:31

**Content Summary**:
LinkedIn profile extract for Derek Yellin containing professional experience,
education history, and technical skills. Appears to be reference material for
recruitment or collaboration purposes.

**Suggested Actions**:
1. 📂 **Keep in inbox** - Still needed for active recruitment work
2. 📦 **Archive to:** `docs/reference/people/derek-yellin.md` - Permanent reference storage
3. 🗑️  **Delete** - No longer needed (if recruitment complete)

**Recommendation**: Archive to `docs/reference/people/` because this is reference
material that may be valuable for future context about collaborators/team members.

What would you like to do with this file?
```

---

## Phase 3: HITL Confirmation

**CRITICAL**: Never archive, move, or delete inbox files without explicit user approval.

### Approval Pattern

```bash
# 1. User provides decision (one of: keep, archive, delete)

# If ARCHIVE chosen:
# 2. Confirm destination
echo "You chose: Archive to docs/reference/people/derek-yellin.md"
echo "This will:"
echo "  - Create docs/reference/people/ directory if needed"
echo "  - Move inbox/reference/derek-yellin-linkedin-profile-extract.md → docs/reference/people/derek-yellin.md"
echo "  - Log this decision to memory"
echo ""
echo "Proceed? (yes/no)"

# 3. Wait for explicit "yes" confirmation
```

**Approval Levels** (aligned with HITL workflow):

| Action | HITL Level | Reasoning |
|--------|-----------|-----------|
| **Read inbox** | 🟢 Auto (Level 1) | Read-only operation |
| **Suggest destinations** | 🟢 Auto (Level 1) | Analysis only, no changes |
| **Archive file** | 🟡 Ask First (Level 2) | Moves file, but reversible |
| **Delete file** | 🔴 Always HITL (Level 3) | Irreversible data loss |

### Rejection/Modification Handling

**If user rejects suggestion**:
```markdown
Got it! Let's find the right location.

Where would you like this file to go?
Options:
1. Different archive location (specify path)
2. Keep in inbox for now
3. Delete instead

Or describe where it should go and I'll help create the right structure.
```

**If user modifies destination**:
```bash
# User says: "Actually, move it to docs/people/ instead"

echo "Updated destination: docs/people/derek-yellin.md"
echo "Creating directory docs/people/ if needed..."
mkdir -p docs/people
echo "Moving file..."
mv inbox/reference/derek-yellin-linkedin-profile-extract.md docs/people/derek-yellin.md
echo "✅ Archived successfully"
```

---

## Phase 4: Execute Archive Hook

After user approval, execute the archive operation and log the decision.

### Archive Hook Pattern

```bash
#!/bin/bash
# Archive hook execution (conceptual - adapt to actual hooks)

SOURCE_FILE="$1"
DEST_FILE="$2"
REASON="$3"

# 1. Create destination directory if needed
mkdir -p "$(dirname "$DEST_FILE")"

# 2. Move file
mv "$SOURCE_FILE" "$DEST_FILE"

# 3. Log to memory
npx claude-flow@alpha memory store \
  --namespace "inbox-archive" \
  --key "archive-$(date -u +"%Y-%m-%d-%H:%M:%S")" \
  --value '{
    "timestamp": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'",
    "source": "'"$SOURCE_FILE"'",
    "destination": "'"$DEST_FILE"'",
    "reason": "'"$REASON"'",
    "archived_by": "user",
    "action": "archive"
  }'

# 4. Log to captain's log
npx claude-flow@alpha memory store \
  --namespace "captains-log" \
  --key "journal:$(date -u +"%Y-%m-%d-%H:%M:%S")" \
  --value '{
    "timestamp": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'",
    "type": "decision",
    "author": "user",
    "title": "Inbox item archived",
    "content": "Archived '"$SOURCE_FILE"' to '"$DEST_FILE"'. Reason: '"$REASON"'",
    "tags": ["inbox", "archive", "file-management"],
    "context": {
      "source_file": "'"$SOURCE_FILE"'",
      "dest_file": "'"$DEST_FILE"'"
    },
    "hitl_reviewed": true
  }'

echo "✅ Archived and logged successfully"
```

### Logging Pattern

**Store in inbox-archive namespace**:
```bash
npx claude-flow@alpha memory store \
  --namespace "inbox-archive" \
  --key "archive-2025-11-13-16:30:00" \
  --value '{
    "timestamp": "2025-11-13T16:30:00Z",
    "source": "inbox/reference/derek-yellin-linkedin-profile-extract.md",
    "destination": "docs/reference/people/derek-yellin.md",
    "reason": "Reference material for collaboration context",
    "archived_by": "user",
    "action": "archive",
    "session_id": "session-20251113"
  }'
```

**Store in captain's log**:
```bash
npx claude-flow@alpha memory store \
  --namespace "captains-log" \
  --key "journal:2025-11-13-16:30:00" \
  --value '{
    "timestamp": "2025-11-13T16:30:00Z",
    "type": "decision",
    "author": "user",
    "title": "Archived inbox item: derek-yellin profile",
    "content": "Moved LinkedIn profile extract from inbox to permanent reference storage at docs/reference/people/derek-yellin.md for future collaboration context.",
    "tags": ["inbox", "archive", "reference", "people"],
    "context": {
      "source_file": "inbox/reference/derek-yellin-linkedin-profile-extract.md",
      "dest_file": "docs/reference/people/derek-yellin.md"
    },
    "hitl_reviewed": true
  }'
```

---

## Integration with Session Workflow

### Automatic Inbox Check Points

**When to check inbox automatically** (proactive suggestions, never automatic execution):

| Session Phase | Trigger | Action |
|--------------|---------|--------|
| **Session Start** | After `pre-task` hook | "I noticed you have items in your inbox. Would you like to review them before starting?" |
| **Session End** | Before `post-task` hook | "Before we close out, there are items in your inbox. Should we triage them?" |
| **After File Work** | User finishes working with inbox file | "You've been working with [file] from inbox. Should we archive it now?" |
| **Manual Trigger** | User mentions inbox | Begin inbox review workflow |

### Session Start Integration

```bash
# In pre-task hook or session start

# 1. Check if inbox has items
INBOX_COUNT=$(find inbox/ -type f ! -path "*/\.*" | wc -l)

if [ "$INBOX_COUNT" -gt 0 ]; then
  echo "📥 Note: You have $INBOX_COUNT item(s) in your inbox."
  echo "Would you like to review them before starting today's work?"
  # Wait for HITL response
fi
```

**Example**:
```
🔄 Executing pre-task hook...
📋 Task: Implement user authentication system
🆔 Task ID: task-1763015548037-xyz
💾 Saved to .swarm/memory.db

📥 Note: You have 1 item(s) in your inbox.
Would you like to review them before starting today's work?
```

### Session End Integration

```bash
# In post-task hook or session end

# 1. Check for inbox items
INBOX_COUNT=$(find inbox/ -type f ! -path "*/\.*" | wc -l)

if [ "$INBOX_COUNT" -gt 0 ]; then
  echo "📥 Reminder: You have $INBOX_COUNT item(s) in your inbox."
  echo "Would you like to triage them before closing this session?"
  # Wait for HITL response
fi
```

### After File Work Integration

**Pattern**: Detect when user finishes working with an inbox file

```bash
# When user modifies or references a file from inbox/

# Example: User edits inbox/reference/derek-yellin-linkedin-profile-extract.md

echo "I noticed you've been working with derek-yellin-linkedin-profile-extract.md from your inbox."
echo "Are you done with this file? If so, I can help archive it to a permanent location."
echo ""
echo "Options:"
echo "1. Archive now (I'll suggest destinations)"
echo "2. Keep in inbox for continued work"
echo "3. Ignore for now"
```

---

## Batch Processing

### Processing Multiple Inbox Items

**User trigger**: "Let's process all inbox items" or "Triage everything in inbox"

```bash
# 1. Count total items
TOTAL=$(find inbox/ -type f ! -path "*/\.*" | wc -l)

echo "Found $TOTAL items to review."
echo ""
echo "I'll present each item one at a time with suggestions."
echo "You can approve, modify, or skip each one."
echo ""
echo "Ready to start? (yes/no)"

# 2. Wait for confirmation

# 3. Iterate through files
find inbox/ -type f ! -path "*/\.*" | while read -r file; do
  # Present item for review (Phase 1)
  # Analyze content (Phase 2)
  # Get HITL approval (Phase 3)
  # Execute if approved (Phase 4)
done

# 4. Summary
echo ""
echo "Inbox triage complete!"
echo "  Archived: X files"
echo "  Kept: Y files"
echo "  Deleted: Z files"
```

---

## Memory Storage & Pattern Learning

### Recording Archival Patterns

**Purpose**: Learn user preferences for destination suggestions over time.

```bash
# After successful archive, store pattern
npx claude-flow@alpha memory store \
  --namespace "inbox-patterns" \
  --key "pattern-linkedin-profiles" \
  --value '{
    "content_type": "linkedin_profile",
    "keywords": ["linkedin", "profile", "experience", "education"],
    "preferred_destination": "docs/reference/people/",
    "confidence": 0.95,
    "sample_count": 1
  }'
```

**Pattern Evolution**:
- First occurrence: `confidence: 0.5` (tentative suggestion)
- After user approval: `confidence: 0.95` (strong suggestion)
- After multiple approvals: `confidence: 0.99` (very confident)

### Query Patterns for Suggestions

```bash
# When analyzing new file, query existing patterns
npx claude-flow@alpha memory search \
  --namespace "inbox-patterns" \
  --pattern "pattern-*" | grep "[detected keywords]"

# Use patterns to improve suggestions
```

---

## Examples: Good vs. Bad Suggestions

### ✅ Good Suggestion

```markdown
## Reviewing: api-authentication-notes.md

**Location**: inbox/reference/api-authentication-notes.md
**Size**: 2.1 KB
**Last modified**: 2025-11-13 14:20

**Content Summary**:
Technical notes about JWT authentication flow, including token generation,
validation, and refresh logic. Contains code snippets and API endpoint designs.

**Suggested Actions**:
1. 📂 **Keep in inbox** - Still actively working on auth implementation
2. 📦 **Archive to:** `docs/reference/authentication/jwt-flow.md` - Permanent technical reference
3. 🗑️  **Delete** - No longer needed

**Recommendation**: Keep in inbox for now because this appears to be actively
referenced work for the current authentication implementation task. Consider
archiving after the auth feature is complete.

What would you like to do with this file?
```

**Why this is good**:
- ✅ Context-aware: Recognizes user is working on auth
- ✅ Specific destination: Not just "docs/", but "docs/reference/authentication/"
- ✅ Reasoning provided: Explains why "keep" is recommended
- ✅ Future-aware: Suggests archiving later

### ❌ Bad Suggestion

```markdown
## Reviewing: api-authentication-notes.md

**Suggested Actions**:
1. Archive to docs/
2. Keep in inbox
3. Delete

What do you want to do?
```

**Why this is bad**:
- ❌ No context: Doesn't explain what the file contains
- ❌ Vague destination: "docs/" is too generic
- ❌ No reasoning: Doesn't explain why any option makes sense
- ❌ No recommendation: Doesn't guide the user

---

## Decision Trees

### File Age Decision Tree

```
File last modified > 7 days ago?
├─ Yes
│  └─ User hasn't referenced it recently?
│     ├─ Yes → Suggest: Archive (likely stale)
│     └─ No → Ask user if still needed
└─ No
   └─ User actively working on related task?
      ├─ Yes → Suggest: Keep in inbox
      └─ No → Suggest: Archive (completed work)
```

### Content Type Decision Tree

```
Contains code?
├─ Yes
│  └─ Is it implementation code?
│     ├─ Yes → Suggest: src/[domain]/
│     └─ No → Is it snippets/examples?
│        ├─ Yes → Suggest: docs/reference/snippets/
│        └─ No → Ask user
└─ No
   └─ Is it documentation?
      ├─ Yes → Suggest: docs/[category]/
      └─ No → Is it a proposal?
         ├─ Yes → Suggest: docs/projects/[name]/
         └─ No → Ask user
```

---

## Error Handling

### Common Issues & Solutions

#### Issue: Destination Already Exists

```bash
# Before moving, check if destination exists
if [ -f "$DEST_FILE" ]; then
  echo "⚠️  Warning: $DEST_FILE already exists."
  echo ""
  echo "Options:"
  echo "1. Merge content (manual)"
  echo "2. Rename new file to [name]-v2.md"
  echo "3. Replace existing file"
  echo "4. Cancel and keep in inbox"
  echo ""
  echo "What would you like to do?"
  # Wait for HITL decision
fi
```

#### Issue: Invalid Destination Path

```bash
# Validate destination before proceeding
if [[ "$DEST_FILE" =~ \.\./  ]]; then
  echo "❌ Error: Invalid destination path (contains ../)"
  echo "Please provide a path within the project."
  # Request new destination
fi
```

#### Issue: Permission Error

```bash
# Handle permission errors gracefully
if ! mv "$SOURCE_FILE" "$DEST_FILE" 2>/tmp/archive-error.log; then
  echo "❌ Error: Could not move file."
  echo "Error details: $(cat /tmp/archive-error.log)"
  echo ""
  echo "File remains in inbox at: $SOURCE_FILE"
  echo "Please check permissions and try again."
fi
```

---

## Best Practices Summary

### For Claude Code

1. **Always read before suggesting**: Analyze file content to provide intelligent suggestions
2. **Context-aware recommendations**: Consider current task, file age, and content type
3. **Specific destinations**: Never suggest vague paths like "docs/" or "somewhere/"
4. **Explain reasoning**: Tell user WHY a destination makes sense
5. **HITL required**: Never archive/delete without explicit approval
6. **Log everything**: Store decisions in memory for pattern learning
7. **Graceful errors**: Handle edge cases without losing user data

### For Users

1. **Review regularly**: Don't let inbox accumulate
2. **Be decisive**: Archive or delete quickly to keep inbox clean
3. **Provide context**: Tell Claude Code if keeping files for specific reasons
4. **Update patterns**: If suggestions are wrong, correct them to improve learning
5. **Trust but verify**: Review suggestions before approving

---

## Integration with Captain's Log

### Logging Inbox Actions

**All inbox actions should be logged to captain's log**:

```bash
# After archive action
npx claude-flow@alpha memory store \
  --namespace "captains-log" \
  --key "journal:$(date -u +"%Y-%m-%d-%H:%M:%S")" \
  --value '{
    "timestamp": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'",
    "type": "decision",
    "author": "user",
    "title": "Inbox triage: archived [N] items",
    "content": "Processed inbox and archived [N] items to permanent locations. Kept [M] items for active work. Deleted [P] obsolete items.",
    "tags": ["inbox", "file-management", "organization"],
    "context": {
      "archived_files": ["file1.md", "file2.md"],
      "kept_files": ["file3.md"],
      "deleted_files": []
    },
    "hitl_reviewed": true
  }'
```

---

## Quick Reference

### Natural Language Commands

| User Says | Claude Code Action |
|-----------|-------------------|
| "Check my inbox" | List all inbox items by category |
| "Review inbox for archiving" | Start full triage workflow |
| "Archive this file to docs/" | Archive current file with HITL approval |
| "What's in inbox/reference?" | List only reference subdirectory |
| "I'm done with [file]" | Suggest archival for specific file |
| "Keep everything in inbox" | Skip archival, note in log |
| "Delete old inbox items" | Review files by age, suggest deletions |

### Memory Namespaces

| Namespace | Purpose | TTL |
|-----------|---------|-----|
| `inbox-archive` | Log of archived files | Indefinite |
| `inbox-patterns` | Learned archival patterns | Indefinite |
| `captains-log` | Human-readable decisions | Indefinite |

### File Organization Rules

| Content Type | Permanent Location |
|--------------|-------------------|
| Research/Reference | `docs/reference/[topic]/` |
| Project Proposals | `docs/projects/[name]/` |
| Meeting Notes | `docs/reference/meetings/` |
| Code Snippets | `docs/reference/snippets/` or `src/` |
| Deprecated | `.archive/deprecated/` |

---

**Remember**: The inbox is a **temporary workspace**, not permanent storage. Every item should have a clear path to promotion or deletion. Treat inbox review as a regular discipline, like session closeout.
