# ADR-003: Session Management as Skill, Not Infrastructure

**Status**: Proposed
**Date**: 2025-11-15
**Deciders**: System Architect
**Related**: ADR-001 (Never Edit Stock Files), ADR-002 (Auto-Cascading Hooks)

---

## Context and Problem Statement

Current workspace enforces session management via CLAUDE.md rules:

```markdown
# Current CLAUDE.md (ENFORCED)
**CLAUDE CODE SHOULD CREATE SESSION ON FIRST MESSAGE:**
1. Generate session ID: `session-$(date +%Y%m%d-%H%M%S)-<topic>`
2. Create directory structure: mkdir -p "sessions/$SESSION_ID/artifacts"/{code,tests,docs,scripts,notes}
3. **ALL FILES GO TO:** sessions/$SESSION_ID/artifacts/ subdirectories
**NEVER** write to root tests/, docs/, scripts/ - only to session artifacts!
```

**Problems**:

1. **Enforced, Not Guided**: AI must follow rules, users have no choice
2. **Custom Infrastructure**: `sessions/` directory not part of stock claude-flow
3. **CLAUDE.md Bloat**: Session protocol embedded in stock file
4. **Rigid Structure**: Mandatory artifacts subdirectories
5. **Stock Deviation**: Stock uses `.swarm/backups/` for sessions

**Current Implementation**:
- Custom `sessions/` directory structure
- Enforcement via CLAUDE.md
- Custom session metadata and summaries
- Separate from stock session backups

**Stock claude-flow provides**:
```bash
# Session backup/restore via hooks
npx claude-flow@alpha hooks session-end --session-id "id" --export-metrics true
# Creates: .swarm/backups/session-id.json

npx claude-flow@alpha hooks session-restore --session-id "id"
# Restores from: .swarm/backups/session-id.json
```

**Question**: How do we provide session management features while respecting stock infrastructure and user freedom?

---

## Decision Drivers

### Technical Drivers

- **Stock Integration**: Use stock `.swarm/backups/` as canonical session storage
- **Composability**: Session skill should work with other skills
- **Flexibility**: Support different session workflows (not just one pattern)
- **Transparency**: Clear relationship between skill and stock features

### User Experience Drivers

- **Opt-In**: Users choose to use session management
- **Guidance Not Enforcement**: Recommend patterns, don't force them
- **Progressive**: Simple start, advanced options available
- **Freedom**: Users can organize files differently

### Compliance Drivers

- **Stock-First**: Skill coordinates stock features, doesn't replace them
- **No CLAUDE.md Enforcement**: Session rules not embedded in stock files
- **No Custom Infrastructure**: Use stock `.swarm/` directory
- **Clear Boundaries**: Session skill vs stock session features

---

## Considered Options

### Option 1: Continue Current Enforcement (Status Quo)

**Description**: Keep session protocol in CLAUDE.md with mandatory compliance.

**Pros**:
- ✅ Consistent session structure
- ✅ Works with current setup

**Cons**:
- ❌ Enforced (users have no choice)
- ❌ CLAUDE.md bloat (500+ lines)
- ❌ Custom infrastructure (sessions/ directory)
- ❌ Violates stock-first (CLAUDE.md enforcement)
- ❌ Rigid (one pattern only)

**Stock-First Score**: 70/100

### Option 2: Move to .swarm/ Only (Pure Stock)

**Description**: Remove custom sessions/ directory, use only stock `.swarm/backups/`.

**Pros**:
- ✅ 100% stock compliance
- ✅ No custom infrastructure
- ✅ Simple and clean

**Cons**:
- ❌ Loses artifact organization
- ❌ No recommended directory structure
- ❌ Users must invent own organization
- ❌ Loses current features (metadata, summaries)

**Stock-First Score**: 100/100 (but feature loss)

### Option 3: Session Management as Opt-In Skill (CHOSEN)

**Description**: Create session-management skill that coordinates stock features and recommends (not enforces) directory structure.

**Pattern**:
```bash
# Stock remains canonical
.swarm/backups/session-*.json  # Stock session backups

# Skill adds optional structure (guidance)
sessions/session-*/artifacts/   # Recommended by skill (not enforced)

# Skill coordinates via stock hooks
npx claude-flow@alpha hooks session-end --session-id "..." --export-metrics true
```

**Pros**:
- ✅ Stock `.swarm/backups/` remains canonical
- ✅ Skill provides value-add (organization, metadata)
- ✅ Opt-in (users choose to use skill)
- ✅ Guidance not enforcement
- ✅ Progressive (basic → advanced patterns)
- ✅ Composable with other skills

**Cons**:
- ⚠️ Users might not follow recommendations
- ⚠️ Need clear documentation of relationship

**Stock-First Score**: 98/100

---

## Decision Outcome

**Chosen Option**: **Option 3 - Session Management as Opt-In Skill**

### Rationale

1. **Stock Integration**: Uses stock `.swarm/backups/` as canonical storage
2. **Value-Add**: Skill provides organization and metadata without replacing stock
3. **User Freedom**: Users can opt-in or organize differently
4. **Composability**: Works with other skills (captain's log, git checkpoints)
5. **Stock-First**: Coordinates stock features, doesn't replace them

### Architecture

```
Stock Infrastructure (Canonical):
  .swarm/
  ├── memory.db              # Stock memory storage
  └── backups/               # Stock session backups
      └── session-*.json     # Created by stock hooks

Skill Enhancement (Optional):
  sessions/                  # Recommended by skill (not enforced)
  ├── session-*/
  │   ├── metadata.json      # Skill-specific metadata
  │   ├── session-summary.md # Skill-generated summary
  │   └── artifacts/         # Recommended structure
  │       ├── code/
  │       ├── tests/
  │       ├── docs/
  │       ├── scripts/
  │       └── notes/
  └── .archive/              # Skill archival (old sessions)

Coordination:
  .claude/skills/session-management/
  ├── skill.md               # Skill definition
  ├── scripts/
  │   ├── init-session.sh    # Creates structure + stock backup
  │   ├── closeout.sh        # Stock backup + skill archive
  │   └── restore.sh         # Stock restore + skill metadata
  ├── examples/
  │   ├── basic.md           # Simple session workflow
  │   ├── multi-session.md   # Managing multiple sessions
  │   └── custom-org.md      # Custom organization patterns
  └── docs/
      └── session-theory.md  # Why sessions matter
```

### Decision Rules

**Stock is Canonical**:
1. ✅ `.swarm/backups/session-*.json` is authoritative
2. ✅ All session data MUST be in stock backup
3. ✅ Skill restoration MUST work from stock backup alone
4. ✅ Skill metadata is supplementary (not required)

**Skill is Optional**:
1. ✅ Users can work without session skill
2. ✅ Stock backups work independently
3. ✅ Skill provides value-add (organization, metadata)
4. ✅ Skill recommendations are guidance (not enforcement)

**Relationship to CLAUDE.md**:
1. ✅ CLAUDE.md references skill (doesn't embed rules)
2. ✅ No enforcement rules in CLAUDE.md
3. ✅ Project-specific session needs documented separately
4. ✅ Skill handles session orchestration

---

## Implementation

### Skill Structure

```
.claude/skills/session-management/
├── skill.md
├── scripts/
│   ├── init-session.sh     # Initialize session (stock + skill)
│   ├── closeout.sh         # Close session (HITL + stock + skill)
│   ├── restore.sh          # Restore session (stock + skill)
│   ├── list.sh             # List sessions
│   └── archive.sh          # Archive old sessions
├── examples/
│   ├── basic.md            # Single session workflow
│   ├── multi-session.md    # Concurrent sessions
│   ├── custom-org.md       # Custom organization
│   └── error-recovery.md   # Handling session failures
├── docs/
│   ├── concepts.md         # Session theory
│   ├── stock-integration.md # How skill uses stock
│   └── troubleshooting.md
└── tests/
    ├── basic.test.sh
    └── integration.test.sh
```

### init-session.sh (Stock + Skill)

```bash
#!/bin/bash
# Initialize session using stock infrastructure + skill enhancements
# Stock Integration: hooks:session-end (create backup), hooks:memory (store metadata)

set -euo pipefail

SESSION_ID="${1:-session-$(date +%Y%m%d-%H%M%S)}"
TOPIC="${2:-general}"

echo "🎯 Initializing session: $SESSION_ID"

# 1. Create stock session backup (CANONICAL)
echo "📦 Creating stock session backup..."
npx claude-flow@alpha hooks session-end \
  --session-id "$SESSION_ID" \
  --export-metrics true

if [ ! -f ".swarm/backups/session-$SESSION_ID.json" ]; then
  echo "❌ ERROR: Stock session backup failed"
  exit 1
fi

echo "✅ Stock backup created: .swarm/backups/session-$SESSION_ID.json"

# 2. Store session metadata in stock memory (REQUIRED)
echo "💾 Storing session metadata in stock memory..."
npx claude-flow@alpha hooks memory \
  --action store \
  --key "session/$SESSION_ID/metadata" \
  --value "{\"id\": \"$SESSION_ID\", \"topic\": \"$TOPIC\", \"created\": \"$(date -Iseconds)\", \"status\": \"active\"}"

# 3. Create recommended directory structure (OPTIONAL - GUIDANCE)
echo "📁 Creating recommended artifact structure..."
mkdir -p "sessions/$SESSION_ID/artifacts"/{code,tests,docs,scripts,notes}

# 4. Create skill metadata (SUPPLEMENTARY)
cat > "sessions/$SESSION_ID/metadata.json" <<EOF
{
  "session_id": "$SESSION_ID",
  "topic": "$TOPIC",
  "created": "$(date -Iseconds)",
  "skill_version": "1.0.0",
  "stock_backup": ".swarm/backups/session-$SESSION_ID.json"
}
EOF

# 5. Log to stock journal
npx claude-flow@alpha hooks journal \
  --entry "Initialized session $SESSION_ID (topic: $TOPIC)" \
  --tags "session:$SESSION_ID,action:init,skill:session-management"

# 6. Export session ID for current shell
export SESSION_ID

echo ""
echo "✅ Session initialized successfully!"
echo ""
echo "📊 Session Details:"
echo "  ID: $SESSION_ID"
echo "  Topic: $TOPIC"
echo "  Stock Backup: .swarm/backups/session-$SESSION_ID.json"
echo "  Recommended Artifacts: sessions/$SESSION_ID/artifacts/"
echo ""
echo "💡 Tip: Export SESSION_ID for this session:"
echo "  export SESSION_ID='$SESSION_ID'"
echo ""
echo "📚 Learn more: .claude/skills/session-management/examples/basic.md"
```

### closeout.sh (HITL + Stock + Skill)

```bash
#!/bin/bash
# Close out session with HITL approval
# Stock Integration: hooks:session-end (backup), hooks:journal (log)
# HITL: Yes (approval required before archive)

set -euo pipefail

SESSION_ID="${1:-${SESSION_ID:-unknown}}"

if [ "$SESSION_ID" = "unknown" ]; then
  echo "❌ ERROR: No session ID provided"
  echo "Usage: closeout.sh <session-id>"
  exit 1
fi

echo "📋 Session Closeout: $SESSION_ID"
echo ""

# 1. Check stock backup exists
if [ ! -f ".swarm/backups/session-$SESSION_ID.json" ]; then
  echo "⚠️  WARNING: No stock backup found"
  echo "Creating backup now..."
  npx claude-flow@alpha hooks session-end --session-id "$SESSION_ID" --export-metrics true
fi

# 2. Display session summary from stock backup
echo "📊 Session Summary (from stock backup):"
if [ -f ".swarm/backups/session-$SESSION_ID.json" ]; then
  jq -r '.summary // "No summary available"' ".swarm/backups/session-$SESSION_ID.json"
else
  echo "No summary available"
fi
echo ""

# 3. Display session stats
if [ -d "sessions/$SESSION_ID/artifacts" ]; then
  echo "📁 Session Artifacts:"
  echo "  Code files: $(find sessions/$SESSION_ID/artifacts/code -type f 2>/dev/null | wc -l)"
  echo "  Test files: $(find sessions/$SESSION_ID/artifacts/tests -type f 2>/dev/null | wc -l)"
  echo "  Doc files: $(find sessions/$SESSION_ID/artifacts/docs -type f 2>/dev/null | wc -l)"
  echo ""
fi

# 4. HITL APPROVAL GATE
echo "⚠️  Close out and archive this session?"
echo ""
echo "This will:"
echo "  ✅ Create final stock backup"
echo "  ✅ Update session status to 'closed'"
echo "  ✅ Archive session directory to sessions/.archive/"
echo "  ✅ Log to captain's log"
echo ""
read -p "Type 'close' to confirm: " -r
echo

if [ "$REPLY" != "close" ]; then
  echo "❌ Closeout cancelled"
  exit 1
fi

# 5. Create final stock backup
echo "📦 Creating final stock backup..."
npx claude-flow@alpha hooks session-end \
  --session-id "$SESSION_ID" \
  --export-metrics true \
  --generate-summary true

# 6. Update session status in stock memory
npx claude-flow@alpha hooks memory \
  --action store \
  --key "session/$SESSION_ID/metadata" \
  --value "{\"id\": \"$SESSION_ID\", \"status\": \"closed\", \"closed\": \"$(date -Iseconds)\"}"

# 7. Archive session directory (skill-specific)
if [ -d "sessions/$SESSION_ID" ]; then
  mkdir -p sessions/.archive/
  ARCHIVE_NAME="$SESSION_ID-$(date +%Y%m%d-%H%M%S)"
  mv "sessions/$SESSION_ID" "sessions/.archive/$ARCHIVE_NAME"
  echo "📦 Session archived to sessions/.archive/$ARCHIVE_NAME"
fi

# 8. Log to stock journal
npx claude-flow@alpha hooks journal \
  --entry "Closed session $SESSION_ID with HITL approval" \
  --tags "session:$SESSION_ID,action:close,hitl:approved,skill:session-management"

echo ""
echo "✅ Session $SESSION_ID closed successfully!"
echo ""
echo "📁 Stock backup: .swarm/backups/session-$SESSION_ID.json"
echo "📦 Skill archive: sessions/.archive/$ARCHIVE_NAME"
```

### restore.sh (Stock + Skill)

```bash
#!/bin/bash
# Restore session from stock backup
# Stock Integration: hooks:session-restore, hooks:memory

set -euo pipefail

SESSION_ID="$1"

echo "🔄 Restoring session: $SESSION_ID"

# 1. Check stock backup exists
if [ ! -f ".swarm/backups/session-$SESSION_ID.json" ]; then
  echo "❌ ERROR: No stock backup found for $SESSION_ID"
  echo "Available sessions:"
  ls .swarm/backups/ | grep -E '^session-.*\.json$' | sed 's/\.json$//'
  exit 1
fi

# 2. Restore from stock backup (CANONICAL)
echo "📦 Restoring from stock backup..."
npx claude-flow@alpha hooks session-restore --session-id "$SESSION_ID"

# 3. Load session metadata from stock memory
echo "💾 Loading session metadata..."
METADATA=$(npx claude-flow@alpha hooks memory \
  --action retrieve \
  --key "session/$SESSION_ID/metadata")

if [ -n "$METADATA" ]; then
  echo "✅ Session metadata loaded"
  echo "$METADATA" | jq .
fi

# 4. Recreate artifact structure if missing (OPTIONAL)
if [ ! -d "sessions/$SESSION_ID/artifacts" ]; then
  echo "📁 Recreating recommended artifact structure..."
  mkdir -p "sessions/$SESSION_ID/artifacts"/{code,tests,docs,scripts,notes}
fi

# 5. Log restoration
npx claude-flow@alpha hooks journal \
  --entry "Restored session $SESSION_ID from stock backup" \
  --tags "session:$SESSION_ID,action:restore,skill:session-management"

# 6. Export session ID
export SESSION_ID

echo ""
echo "✅ Session $SESSION_ID restored successfully!"
echo ""
echo "💡 Export SESSION_ID for this session:"
echo "  export SESSION_ID='$SESSION_ID'"
```

---

## Stock Integration Points

### 1. Session Backups (Canonical Storage)

**Stock Provides**:
```bash
npx claude-flow@alpha hooks session-end --session-id "..." --export-metrics true
# Creates: .swarm/backups/session-*.json
# Format: { "session_id": "...", "created": "...", "metrics": {...}, "summary": "..." }
```

**Skill Extends**:
- Adds skill metadata to stock backup
- Creates supplementary session summary
- Organizes artifacts in recommended structure
- Archives old sessions for workspace cleanliness

**Relationship**: Stock backup is canonical, skill metadata is supplementary

### 2. Session Memory (Context Storage)

**Stock Provides**:
```bash
npx claude-flow@alpha hooks memory --action store --key "session/..." --value "..."
```

**Skill Uses**:
- `session/$SESSION_ID/metadata` - Session metadata
- `session/$SESSION_ID/context` - Session context for restore
- `session/$SESSION_ID/stats` - Session statistics

**Namespace**: Skill uses `session/` prefix in stock memory

### 3. Session Journal (Activity Log)

**Stock Provides**:
```bash
npx claude-flow@alpha hooks journal --entry "..." --tags "session:..."
```

**Skill Uses**:
- Log session init/close/restore
- Tag all session operations
- Enable session activity audit trail

**Tags**: Skill uses `session:$SESSION_ID` tag in stock journal

---

## CLAUDE.md Integration

### Before (Enforcement in CLAUDE.md)

```markdown
# CLAUDE.md (500+ lines)

## SESSION MANAGEMENT PROTOCOL

**CLAUDE CODE SHOULD CREATE SESSION ON FIRST MESSAGE:**
1. Generate session ID: `session-$(date +%Y%m%d-%H%M%S)-<topic>`
2. Create directory structure: mkdir -p "sessions/$SESSION_ID/artifacts"/{code,tests,docs,scripts,notes}
3. **ALL FILES GO TO:** sessions/$SESSION_ID/artifacts/ subdirectories

**NEVER** write to root tests/, docs/, scripts/ - only to session artifacts!
```

### After (Reference to Skill)

```markdown
# CLAUDE.md (150 lines)

## Project Overview

This project uses claude-flow for multi-agent coordination.

## Session Management

For session isolation and organization, we use the session-management skill:

```bash
# Initialize session
.claude/skills/session-management/scripts/init-session.sh "my-topic"

# Close session
.claude/skills/session-management/scripts/closeout.sh
```

**Learn more**: See `.claude/skills/session-management/skill.md`

**Note**: Session management is optional but recommended for workspace cleanliness and artifact organization.
```

**Key Changes**:
- ✅ Reference, not embedding
- ✅ Opt-in, not enforced
- ✅ Guidance, not rules
- ✅ CLAUDE.md stays minimal

---

## User Experience

### Beginner Workflow

```bash
# 1. User starts new chat in Claude Code
# Claude Code (optionally): "Would you like to initialize a session for this work?"

# 2. User: "Yes, initialize session for building authentication"
.claude/skills/session-management/scripts/init-session.sh "authentication"

# 3. Session created with recommended structure
# User saves files to sessions/session-20251115-auth/artifacts/code/

# 4. Work proceeds normally

# 5. User: "Close out this session"
.claude/skills/session-management/scripts/closeout.sh
# HITL prompt: "Type 'close' to confirm:"
# User: close
# ✅ Session archived, backup created
```

### Advanced Workflow

```bash
# User manages multiple concurrent sessions
SESSION_A=$(./init-session.sh "feature-auth")
SESSION_B=$(./init-session.sh "feature-perf")

# Switch between sessions
export SESSION_ID="$SESSION_A"
# ... work on auth ...

export SESSION_ID="$SESSION_B"
# ... work on perf ...

# List all sessions
.claude/skills/session-management/scripts/list.sh

# Close specific session
./closeout.sh "$SESSION_A"

# Restore old session
./restore.sh "session-20251110-oldwork"
```

### Custom Organization Workflow

```bash
# User chooses not to use recommended structure
# Still benefits from stock backups

# Initialize with stock only (skip skill structure)
npx claude-flow@alpha hooks session-end --session-id "custom-session" --export-metrics true

# Organize files in custom way
mkdir custom-structure/
# ... organize as desired ...

# Close with stock backup
npx claude-flow@alpha hooks session-end --session-id "custom-session" --export-metrics true --generate-summary true

# Stock backup works regardless of file organization
```

---

## Positive Consequences

### Stock-First Compliance

1. **Canonical Storage**: Stock `.swarm/backups/` remains authoritative
2. **No Enforcement**: CLAUDE.md doesn't mandate session usage
3. **Optional Enhancement**: Skill provides value-add without replacing stock
4. **Clear Boundaries**: Stock vs skill responsibilities obvious

### User Freedom

1. **Opt-In**: Users choose to use session skill or not
2. **Flexible**: Skill accommodates different organization patterns
3. **Progressive**: Simple start, advanced options available
4. **Transparent**: Clear what's stock vs skill

### Composability

1. **Other Skills**: Session skill works with captain's log, git checkpoints, etc.
2. **Stock Hooks**: All coordination via standard hooks
3. **Memory Namespacing**: No conflicts with other skills
4. **Cascading**: Session hooks integrate with pre/post-task cascades

---

## Negative Consequences

### Possible Confusion

1. **Two Session Concepts**: Stock backup vs skill directory
   - Mitigated: Clear documentation of relationship
   - Skill metadata references stock backup path

2. **Optional Usage**: Users might not know skill exists
   - Mitigated: CLAUDE.md references skill
   - Examples show skill usage

3. **Directory Organization**: Users might organize differently
   - This is a feature (freedom), not a bug
   - Skill works regardless of organization

---

## Validation

### Session Skill Tests

```bash
# Test init → close → restore cycle
#!/bin/bash

TEST_SESSION="test-$(date +%s)"

# Init
./init-session.sh "$TEST_SESSION" "test-topic"
[ -f ".swarm/backups/session-$TEST_SESSION.json" ] || exit 1

# Close
echo "close" | ./closeout.sh "$TEST_SESSION"
[ -d "sessions/.archive/$TEST_SESSION-"* ] || exit 1

# Restore
./restore.sh "$TEST_SESSION"
METADATA=$(npx claude-flow@alpha hooks memory --action retrieve --key "session/$TEST_SESSION/metadata")
[ -n "$METADATA" ] || exit 1

echo "✅ Session lifecycle test passed"
```

### Stock Integration Tests

```bash
# Verify skill uses stock CLI only
#!/bin/bash

# Check scripts don't contain custom implementations
if grep -r "sqlite3" .claude/skills/session-management/scripts/; then
  echo "❌ ERROR: Direct database access detected"
  exit 1
fi

if grep -r "require(" .claude/skills/session-management/scripts/; then
  echo "❌ ERROR: Custom runtime code detected"
  exit 1
fi

# Verify all hooks use stock CLI
if ! grep -r "npx claude-flow@alpha hooks" .claude/skills/session-management/scripts/ | grep -q .; then
  echo "❌ ERROR: No stock hooks detected"
  exit 1
fi

echo "✅ Stock integration test passed"
```

---

## References

- [ADR-001: Never Edit Stock Files](ADR-001-never-edit-stock-files.md)
- [ADR-002: Auto-Cascading Hooks](ADR-002-auto-cascading-hooks.md)
- [Features-as-Skills Specification](../features-as-skills-spec.md)
- [Stock vs Current Analysis](../../analysis/stock-vs-current.md)

---

**Decision**: Adopted
**Implementation**: Phase 1 (extract session protocol from CLAUDE.md to skill)
**Next Review**: After session skill migration complete
