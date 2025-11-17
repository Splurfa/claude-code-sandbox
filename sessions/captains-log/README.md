# Captain's Log - Decision Journal System

## Why This Exists

**Problem:** Development decisions fade from memory. Why did we choose approach A over B? What did we learn from that failed experiment? Without a record, we repeat mistakes and lose institutional knowledge.

**Solution:** A time-stamped decision journal that captures the "why" behind every significant choice, creating a searchable memory that persists across sessions and team members.

## What Is the Captain's Log?

The Captain's Log is a **stock claude-flow journal system** that maintains a human-readable record of:

- **Decisions:** Why we chose X over Y (with context and tradeoffs)
- **Insights:** Patterns discovered, lessons learned
- **Blockers:** What prevented progress and how we resolved it
- **Context:** The "why" that git commits can't capture

This is **not** a changelog or task tracker. This is your project's memory and reasoning trail.

## Structure

```
sessions/captains-log/
├── README.md (this file)
├── 2025-01-14.md          # Today's entries
├── 2025-01-13.md          # Yesterday's entries
└── 2025-01-10.md          # Older entries
```

**One file per date** (YYYY-MM-DD.md), with timestamped entries throughout the day.

### Entry Format

Each entry follows this pattern:

```markdown
## [HH:MM] Brief Title

**Context:** What was happening when this decision was made?

**Decision:** What did we choose to do?

**Reasoning:** Why this approach over alternatives?

**Tradeoffs:** What did we give up? What risks did we accept?

**Outcome:** (Added later) How did it turn out?
```

## How Entries Are Created

### Automatic (During Session Closeout)

When you close a session, the closeout workflow **automatically extracts decisions** from the session summary and appends them to today's Captain's Log:

```bash
npx claude-flow@alpha hooks session-end --generate-summary true
# → Extracts decisions from session
# → Appends to sessions/captains-log/$(date +%Y-%m-%d).md
# → Timestamps each entry
```

**You don't manually write entries.** The system captures them from your work.

### Manual (Ad-Hoc Insight)

If you have an insight mid-session that needs recording:

```bash
npx claude-flow@alpha hooks journal --entry "Your insight here" --category "decision"
# → Appends to today's log file
# → Auto-timestamps
# → Creates file if it doesn't exist
```

## How to Query Past Decisions

### Search by Keyword

```bash
# Find all authentication-related decisions
grep -r "authentication" sessions/captains-log/

# Find decisions about database schema
grep -r "database\|schema" sessions/captains-log/
```

### Search by Date Range

```bash
# Decisions from January 2025
ls sessions/captains-log/2025-01-*.md

# Read last 7 days
tail -n 100 sessions/captains-log/2025-01-{10..17}.md
```

### Ask Claude Code

```
"What decisions did we make about authentication last week?"
"Show me the reasoning behind using PostgreSQL"
"What blockers did we hit during the API refactor?"
```

Claude Code will search the logs and synthesize answers.

## Example Entries

### Decision Entry

```markdown
## [14:23] Chose PostgreSQL Over MongoDB

**Context:** Building user authentication system. Need to store user profiles, sessions, and audit logs.

**Decision:** PostgreSQL with row-level security instead of MongoDB.

**Reasoning:**
- ACID compliance critical for auth/audit data
- Team expertise in SQL > NoSQL
- RLS provides security at database layer
- jsonb columns give us schema flexibility where needed

**Tradeoffs:**
- Gave up: Document model flexibility
- Accepted: More complex migrations for schema changes
- Risk: Scaling reads (mitigate with read replicas)

**Outcome:** [2025-01-15] Clean implementation. RLS saved us from security bugs.
```

### Insight Entry

```markdown
## [09:15] Pattern: Agent Coordination Through Memory

**Discovery:** Agents coordinating via shared memory (hooks + memory.db) avoid race conditions better than direct message passing.

**Why It Matters:** Scales to N agents without complex synchronization logic.

**Application:** All multi-agent workflows should use memory-first coordination.

**Reference:** Session session-20251114-091200-api-refactor
```

### Blocker Entry

```markdown
## [16:45] Blocker: Pre-commit Hooks Failing on CI

**Problem:** Hooks pass locally, fail in GitHub Actions. Tests timeout after 2min.

**Root Cause:** CI environment missing node_modules cache. Fresh install on every run.

**Resolution:** Added `actions/cache@v3` to workflow. Build time: 8min → 45sec.

**Learning:** Always check CI environment differences. "Works on my machine" is a red flag.
```

## Stock-First Principle

This system uses **95% stock claude-flow infrastructure:**

- `npx claude-flow@alpha hooks journal` (stock command)
- SQLite memory.db (stock storage)
- Markdown files (universal format)

**No custom frameworks. No reinvention.** Just thin wrappers around battle-tested tools.

## Integration with Other Systems

```
Captain's Log (narrative memory)
        ↓
.swarm/memory.db (structured memory)
        ↓
.swarm/backups/ (session snapshots)
```

- **Log = Human-readable narrative** ("why we did it")
- **Memory.db = Agent-queryable facts** ("what we learned")
- **Backups = Full session context** (restore point for debugging)

## Success Criteria

A good Captain's Log entry answers:

✅ **Why** did we make this choice?
✅ **What** alternatives did we consider?
✅ **What** tradeoffs did we accept?
✅ **Can future-me** understand this decision 6 months from now?

## Common Pitfalls

❌ **Don't** write "Implemented feature X" (that's a git commit)
❌ **Don't** list tasks (that's a todo list)
❌ **Don't** write novel-length entries (500 words max)

✅ **Do** capture the "why" behind decisions
✅ **Do** record tradeoffs and risks
✅ **Do** update outcomes when you learn more

## Quick Reference

| Task | Command |
|------|---------|
| Manual entry | `npx claude-flow@alpha hooks journal --entry "..." --category "decision"` |
| Search logs | `grep -r "keyword" sessions/captains-log/` |
| View today's log | `cat sessions/captains-log/$(date +%Y-%m-%d).md` |
| Session closeout | `npx claude-flow@alpha hooks session-end --generate-summary true` |

---

**Remember:** The best decision journal is the one you actually maintain. Keep entries concise, focus on "why," and let automation do the heavy lifting.
