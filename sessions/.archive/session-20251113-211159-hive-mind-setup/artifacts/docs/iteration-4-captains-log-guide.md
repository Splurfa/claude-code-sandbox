# Captain's Log User Guide

## Overview

The Captain's Log system auto-journals decisions, insights, blockers, and corrections to daily log files in `sessions/captains-log/YYYY-MM-DD.md`. All entries are time-neutral (use timestamps, not "today") and link back to session artifacts.

## Categories

1. **Decisions** - Strategic choices made during work
2. **Insights** - Learning and discoveries
3. **Blockers** - Issues preventing progress
4. **Corrections** - Learning from mistakes

## Usage

### Via Code

```javascript
const { logDecision, logInsight, logBlocker, logCorrection } = require('./captains-log');

// Log decision
logDecision('Use PostgreSQL', 'Better scalability', {
  agent: 'backend-engineer',
  file: 'database.js'
});

// Log insight
logInsight('Phase 1 hooks work seamlessly', 'Always-on coordination');

// Log blocker
logBlocker('API rate limit', 'Slowing data collection');

// Log correction
logCorrection('Used sync operations', 'Switched to async', 'success');
```

### Via CLI

```bash
# Log decision
node captains-log.js decision "Use PostgreSQL" "Better scalability"

# Log insight
node captains-log.js insight "Phase 1 hooks work seamlessly"

# Log blocker
node captains-log.js blocker "API rate limit" "Slowing data collection"

# Search logs
node captains-log.js search "PostgreSQL"
```

## Log Format

Each entry includes:
- **Timestamp** (ISO 8601, time-neutral)
- **Category** (decisions/insights/blockers/corrections)
- **Session ID** (links to artifacts)
- **Agent** (who made the entry)
- **Content** (decision/insight/blocker/correction)
- **Artifacts path** (where files are stored)

## Integration with Phase 1

Captain's Log integrates with:
- **always-on-hooks.js** - Auto-captures decisions during work
- **learning-integration.js** - Logs corrections from learning system
- **session-auto-init.js** - Links to session artifacts

## Searching

```javascript
const { searchLog } = require('./captains-log');

// Search last 7 days
const results = searchLog('PostgreSQL', 7);
results.forEach(r => console.log(r.file, r.content));
```

## Best Practices

1. **Log decisions when made** - Don't wait until end of session
2. **Include rationale** - Explain why, not just what
3. **Link to artifacts** - Reference specific files created
4. **Use time-neutral language** - Timestamps instead of "today"
5. **Categorize correctly** - Helps with later search/analysis

## Time-Neutral Principle

❌ **Wrong**: "Today we decided to use PostgreSQL"
✅ **Right**: "2025-11-14T10:30:00Z - Decision: Use PostgreSQL"

❌ **Wrong**: "Yesterday's blocker was resolved"
✅ **Right**: "2025-11-13T15:00:00Z - Blocker resolved"

## Example Log Entry

```markdown
## 2025-11-14T10:30:45.123Z - decisions
**Session:** `session-20251113-211159-hive-mind-setup`
**Agent:** backend-engineer
**File:** `database.js`

**Decision:** Use PostgreSQL for primary database

**Rationale:** Better scalability and JSONB support for our use case. Team has experience with PostgreSQL.

**Artifacts:** `sessions/session-20251113-211159-hive-mind-setup/artifacts/code/`
---
```

## Workflow Integration

Captain's Log is automatically used during:
1. **Decision-making** (via consensus mechanisms)
2. **Learning** (via learning-integration.js)
3. **Session closeout** (summary includes log entries)
4. **Pattern recognition** (searchable history)

## Storage

- **Location**: `sessions/captains-log/YYYY-MM-DD.md`
- **Format**: Markdown
- **Retention**: Indefinite (part of project history)
- **Backup**: Included in session closeout archives
