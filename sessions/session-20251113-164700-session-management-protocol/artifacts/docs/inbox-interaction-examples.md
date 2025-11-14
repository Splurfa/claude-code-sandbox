# Inbox Interaction Examples

## Real-World Interaction Scenarios

This document provides complete, realistic examples of inbox interactions showing both the natural language commands and the expected Claude Code responses.

---

## Example 1: Session Start Inbox Check

### User Says:
```
Let's review my inbox
```

### Claude Code Response:

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

Shall we start with the file in inbox/reference/?
```

### User Says:
```
Yes, let's review it
```

### Claude Code Response:

```markdown
## Reviewing: derek-yellin-linkedin-profile-extract.md

**Location**: inbox/reference/derek-yellin-linkedin-profile-extract.md
**Size**: 4.5 KB
**Last modified**: 2025-11-13 15:31
**Age**: 17 minutes

**Content Summary**:
LinkedIn profile extract containing professional experience, education history,
and contact information for Derek Yellin. Includes work history at various
tech companies, skills in software development and architecture, and educational
background.

**Content Type**: Professional profile/resume reference material

**Suggested Actions**:
1. 📂 **Keep in inbox** - Still needed for active recruitment or collaboration planning
2. 📦 **Archive to:** `docs/reference/people/derek-yellin.md` - Permanent reference storage for team/collaborator information
3. 🗑️  **Delete** - No longer needed if recruitment/collaboration complete

**Recommendation**: Archive to `docs/reference/people/derek-yellin.md`

**Reasoning**: This appears to be reference material about a potential collaborator
or team member. Storing it in `docs/reference/people/` makes it easily discoverable
for future context about project contributors, while keeping the inbox clean.

**Pattern Match**: Based on content containing "LinkedIn", "profile", "experience",
and "education", this matches the pattern for professional profiles.

What would you like to do with this file?
```

### User Says:
```
Archive it to docs/reference/people/
```

### Claude Code Response:

```bash
✓ Confirmed: Archive to docs/reference/people/derek-yellin.md

This will:
  1. Create directory docs/reference/people/ if it doesn't exist
  2. Move inbox/reference/derek-yellin-linkedin-profile-extract.md
     → docs/reference/people/derek-yellin.md
  3. Log this decision to memory for pattern learning

Proceed? (Reply "yes" to confirm)
```

### User Says:
```
yes
```

### Claude Code Executes:

```bash
# Creating destination directory...
mkdir -p docs/reference/people

# Moving file...
mv inbox/reference/derek-yellin-linkedin-profile-extract.md docs/reference/people/derek-yellin.md

# Logging to memory...
npx claude-flow@alpha memory store \
  --namespace "inbox-archive" \
  --key "archive-2025-11-13-15:48:00" \
  --value '{
    "timestamp": "2025-11-13T15:48:00Z",
    "source": "inbox/reference/derek-yellin-linkedin-profile-extract.md",
    "destination": "docs/reference/people/derek-yellin.md",
    "reason": "Reference material for team/collaborator information",
    "archived_by": "user",
    "action": "archive",
    "content_type": "professional_profile",
    "pattern_matched": "linkedin-profile"
  }'

# Logging to captain's log...
npx claude-flow@alpha memory store \
  --namespace "captains-log" \
  --key "journal:2025-11-13-15:48:00" \
  --value '{
    "timestamp": "2025-11-13T15:48:00Z",
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

# Updating pattern learning...
npx claude-flow@alpha memory store \
  --namespace "inbox-patterns" \
  --key "pattern-linkedin-profiles" \
  --value '{
    "content_type": "linkedin_profile",
    "keywords": ["linkedin", "profile", "experience", "education"],
    "preferred_destination": "docs/reference/people/",
    "confidence": 0.95,
    "sample_count": 1,
    "last_updated": "2025-11-13T15:48:00Z"
  }'

✅ Successfully archived derek-yellin-linkedin-profile-extract.md
   → docs/reference/people/derek-yellin.md

📥 Inbox is now empty!
```

---

## Example 2: User Rejects Suggestion

### User Says:
```
Check my inbox
```

### Claude Code Response:

```
📥 Inbox Review: 1 item found

## Reviewing: api-design-notes.md

**Location**: inbox/triage/api-design-notes.md
**Size**: 3.2 KB
**Last modified**: 2025-11-13 10:15

**Content Summary**:
Technical notes about REST API endpoint design for user authentication service.
Includes route definitions, request/response schemas, and security considerations.

**Suggested Actions**:
1. 📂 **Keep in inbox** - Still actively working on API implementation
2. 📦 **Archive to:** `docs/reference/apis/auth-service.md` - Permanent API documentation
3. 🗑️  **Delete** - No longer needed

**Recommendation**: Keep in inbox

**Reasoning**: This appears to be active work for an ongoing authentication
implementation. Consider archiving after the feature is complete.

What would you like to do?
```

### User Says:
```
Actually, archive it to docs/projects/auth-system/ instead. This is project documentation, not a reference.
```

### Claude Code Response:

```bash
✓ Got it! Updated destination: docs/projects/auth-system/api-design-notes.md

This will:
  1. Create directory docs/projects/auth-system/ if needed
  2. Move inbox/triage/api-design-notes.md
     → docs/projects/auth-system/api-design-notes.md
  3. Log this decision (destination: project docs, not reference)

Proceed? (Reply "yes" to confirm)
```

### User Says:
```
yes
```

### Claude Code Executes:

```bash
mkdir -p docs/projects/auth-system
mv inbox/triage/api-design-notes.md docs/projects/auth-system/api-design-notes.md

# Log with corrected pattern
npx claude-flow@alpha memory store \
  --namespace "inbox-archive" \
  --key "archive-2025-11-13-16:00:00" \
  --value '{
    "timestamp": "2025-11-13T16:00:00Z",
    "source": "inbox/triage/api-design-notes.md",
    "destination": "docs/projects/auth-system/api-design-notes.md",
    "reason": "Project documentation for auth system implementation",
    "archived_by": "user",
    "action": "archive",
    "content_type": "project_documentation",
    "user_correction": true,
    "original_suggestion": "docs/reference/apis/",
    "correction_reason": "User specified this is project docs, not reference"
  }'

# Update pattern learning with correction
npx claude-flow@alpha memory store \
  --namespace "inbox-patterns" \
  --key "pattern-api-design-notes" \
  --value '{
    "content_type": "api_design_notes",
    "keywords": ["api", "endpoint", "route", "schema"],
    "preferred_destination": "docs/projects/[project-name]/",
    "confidence": 0.7,
    "sample_count": 1,
    "notes": "User prefers project docs over reference when notes are project-specific",
    "last_updated": "2025-11-13T16:00:00Z"
  }'

✅ Archived to docs/projects/auth-system/api-design-notes.md

📝 Note: I've learned that API design notes should go in project docs when they're
    project-specific. I'll suggest that destination next time!
```

---

## Example 3: Batch Processing

### User Says:
```
Let's triage everything in my inbox
```

### Claude Code Response:

```
📥 Starting Inbox Batch Triage

Found 4 items to review:
  - inbox/ideas/new-feature-brainstorm.md
  - inbox/reference/postgresql-performance-tips.md
  - inbox/triage/meeting-notes-2025-11-10.md
  - inbox/triage/old-draft-readme.md

I'll present each item one at a time. You can:
  - Approve my suggestion
  - Modify the destination
  - Skip to keep in inbox
  - Delete the item

Ready to start? (yes/no)
```

### User Says:
```
yes
```

### Claude Code Response (Item 1):

```markdown
## [1/4] Reviewing: new-feature-brainstorm.md

**Location**: inbox/ideas/new-feature-brainstorm.md
**Size**: 1.8 KB
**Last modified**: 2025-11-08
**Age**: 5 days

**Content Summary**:
Brainstorming notes for a potential "real-time collaboration" feature. Includes
rough ideas, technical considerations, and questions to explore.

**Suggested Actions**:
1. Keep - Still brainstorming
2. Archive to: `docs/projects/realtime-collab/proposal.md`
3. Archive to: `docs/reference/ideas/realtime-collab.md`
4. Delete

**Recommendation**: Archive to `docs/projects/realtime-collab/proposal.md`
if this feature is moving forward, OR archive to `docs/reference/ideas/` if it's
just an idea for future consideration.

Your choice? (1/2/3/4 or custom path)
```

### User Says:
```
2 - archive to projects, we're starting this next sprint
```

### Claude Code Executes:

```bash
mkdir -p docs/projects/realtime-collab
mv inbox/ideas/new-feature-brainstorm.md docs/projects/realtime-collab/proposal.md

✅ [1/4] Archived to docs/projects/realtime-collab/proposal.md
```

### Claude Code Response (Item 2):

```markdown
## [2/4] Reviewing: postgresql-performance-tips.md

**Location**: inbox/reference/postgresql-performance-tips.md
**Size**: 5.4 KB
**Last modified**: 2025-11-13
**Age**: Today

**Content Summary**:
Collection of PostgreSQL query optimization techniques, indexing strategies,
and performance monitoring tips. General reference material.

**Suggested Actions**:
1. Keep - Still learning/applying these tips
2. Archive to: `docs/reference/databases/postgresql-performance.md`
3. Delete

**Recommendation**: Archive to `docs/reference/databases/postgresql-performance.md`

This is general reference material that will be useful long-term.

Your choice? (1/2/3 or custom path)
```

### User Says:
```
2
```

### Claude Code Executes:

```bash
mkdir -p docs/reference/databases
mv inbox/reference/postgresql-performance-tips.md docs/reference/databases/postgresql-performance.md

✅ [2/4] Archived to docs/reference/databases/postgresql-performance.md
```

### Claude Code Response (Item 3):

```markdown
## [3/4] Reviewing: meeting-notes-2025-11-10.md

**Location**: inbox/triage/meeting-notes-2025-11-10.md
**Size**: 2.1 KB
**Last modified**: 2025-11-10
**Age**: 3 days

**Content Summary**:
Meeting notes from sprint planning on Nov 10. Includes action items, decisions
about auth implementation, and task assignments.

**Suggested Actions**:
1. Keep - Action items still open
2. Archive to: `docs/reference/meetings/2025-11-10-sprint-planning.md`
3. Delete - Meeting complete, action items elsewhere

**Recommendation**: Archive to `docs/reference/meetings/` to maintain meeting history.

Your choice? (1/2/3 or custom path)
```

### User Says:
```
2
```

### Claude Code Executes:

```bash
mkdir -p docs/reference/meetings
mv inbox/triage/meeting-notes-2025-11-10.md docs/reference/meetings/2025-11-10-sprint-planning.md

✅ [3/4] Archived to docs/reference/meetings/2025-11-10-sprint-planning.md
```

### Claude Code Response (Item 4):

```markdown
## [4/4] Reviewing: old-draft-readme.md

**Location**: inbox/triage/old-draft-readme.md
**Size**: 0.8 KB
**Last modified**: 2025-10-15
**Age**: 29 days

**Content Summary**:
Rough draft of README.md that was replaced by the current project README.
Contains outdated information about project setup.

**Suggested Actions**:
1. Keep - Might be useful
2. Archive to: `.archive/deprecated/old-readme-draft.md`
3. Delete - Obsolete, current README is better

**Recommendation**: Delete or archive to `.archive/deprecated/`

This appears to be superseded by current documentation.

Your choice? (1/2/3 or custom path)
```

### User Says:
```
3 - delete it
```

### Claude Code Executes:

```bash
rm inbox/triage/old-draft-readme.md

# Log deletion
npx claude-flow@alpha memory store \
  --namespace "inbox-archive" \
  --key "delete-2025-11-13-16:10:00" \
  --value '{
    "timestamp": "2025-11-13T16:10:00Z",
    "source": "inbox/triage/old-draft-readme.md",
    "action": "delete",
    "reason": "Obsolete draft, superseded by current README",
    "deleted_by": "user"
  }'

✅ [4/4] Deleted old-draft-readme.md
```

### Claude Code Summary:

```
📥 Inbox Triage Complete!

Summary:
  ✅ Archived: 3 files
     → docs/projects/realtime-collab/proposal.md
     → docs/reference/databases/postgresql-performance.md
     → docs/reference/meetings/2025-11-10-sprint-planning.md

  🗑️  Deleted: 1 file
     → old-draft-readme.md

  📂 Kept: 0 files

Your inbox is now empty! All items have been processed and logged.
```

---

## Example 4: Session End Reminder

### User Says:
```
Let's close out this session
```

### Claude Code Response:

```
Preparing session closeout...

📥 Reminder: You have 2 item(s) in your inbox:
    - inbox/reference/react-hooks-cheatsheet.md
    - inbox/ideas/mobile-app-concept.md

Would you like to triage them before closing this session?

Options:
1. Yes, let's review them now
2. No, I'll handle them later
3. Quick archive: just suggest destinations and I'll approve in bulk
```

### User Says:
```
3 - quick archive
```

### Claude Code Response:

```
Quick Archive Suggestions:

1. inbox/reference/react-hooks-cheatsheet.md
   → Suggest: docs/reference/frontend/react-hooks.md
   Reason: Technical reference material

2. inbox/ideas/mobile-app-concept.md
   → Suggest: docs/reference/ideas/mobile-app.md
   Reason: Future idea, not active project yet

Approve all? (yes/no/modify)
```

### User Says:
```
yes
```

### Claude Code Executes:

```bash
# Archive both files
mkdir -p docs/reference/frontend docs/reference/ideas
mv inbox/reference/react-hooks-cheatsheet.md docs/reference/frontend/react-hooks.md
mv inbox/ideas/mobile-app-concept.md docs/reference/ideas/mobile-app.md

# Log both actions
# ... (memory store commands)

✅ Quick archived 2 items
📥 Inbox is now empty!

Continuing with session closeout...
```

---

## Example 5: Context-Aware Suggestion After File Work

### User Context:
User has been editing `inbox/reference/jwt-implementation-notes.md` during the session.

### User Says:
```
I'm done implementing the JWT service
```

### Claude Code Response:

```
Great! I noticed you've been working with jwt-implementation-notes.md from your inbox.

Since you've completed the JWT implementation, should we archive those notes now?

**File**: inbox/reference/jwt-implementation-notes.md
**Current status**: Contains implementation notes for JWT service
**Suggestion**: Archive to `docs/projects/auth-system/jwt-implementation.md`
**Reason**: Project documentation for the auth system you just completed

Archive now? (yes/no/different location)
```

### User Says:
```
yes
```

### Claude Code Executes:

```bash
mkdir -p docs/projects/auth-system
mv inbox/reference/jwt-implementation-notes.md docs/projects/auth-system/jwt-implementation.md

✅ Archived jwt-implementation-notes.md → docs/projects/auth-system/jwt-implementation.md

Your inbox is cleaner and project documentation is organized!
```

---

## Example 6: Error Handling - Destination Exists

### User Says:
```
Archive api-design.md to docs/projects/auth-system/
```

### Claude Code Response:

```
⚠️  Warning: docs/projects/auth-system/api-design.md already exists!

**Existing file**: docs/projects/auth-system/api-design.md (3.1 KB, modified 2025-11-12)
**New file**: inbox/triage/api-design.md (2.8 KB, modified 2025-11-13)

**Options**:
1. **Merge manually** - I'll show both files, you merge them
2. **Rename new file** - Save as api-design-v2.md or api-design-updated.md
3. **Replace existing** - Overwrite old file with new one (⚠️  old file will be lost)
4. **Cancel** - Keep new file in inbox for now

What would you like to do? (1/2/3/4)
```

### User Says:
```
2 - rename to api-design-updated.md
```

### Claude Code Executes:

```bash
mkdir -p docs/projects/auth-system
mv inbox/triage/api-design.md docs/projects/auth-system/api-design-updated.md

✅ Archived to docs/projects/auth-system/api-design-updated.md

Note: Original api-design.md remains unchanged.
```

---

## Key Patterns to Notice

### 1. Always Read & Analyze First
Every example shows Claude Code reading the file and providing a content summary before suggesting actions.

### 2. Context-Aware Recommendations
- Recent files get different treatment than old files
- Active project files are kept longer
- Related work is considered

### 3. HITL Confirmation Required
Every archive/delete action requires explicit user approval ("yes" to confirm).

### 4. Learning & Adaptation
When users correct suggestions, Claude Code logs the pattern and learns for next time.

### 5. Graceful Error Handling
When issues arise (file exists, permissions), Claude Code provides options rather than failing.

### 6. Memory Logging
All decisions are logged to both `inbox-archive` and `captains-log` namespaces for future reference.

---

**These examples demonstrate the complete workflow from natural language trigger through execution and logging.**
