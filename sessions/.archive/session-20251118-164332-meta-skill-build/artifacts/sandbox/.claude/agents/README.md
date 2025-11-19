# Natural Language Agent Patterns

## Why This Exists

**Problem:** Workflow automation requires learning CLI syntax, remembering command flags, and chaining multiple tools. Friction kills adoption.

**Solution:** Natural language commands that map to validated bash workflows. Say "Close out this session" and the right sequence of hooks executes automatically.

## What Are Agent Patterns?

Agent patterns are **trigger phrases** that execute stock claude-flow commands. They're thin wrappers around battle-tested CLI tools, not custom frameworks.

**Example:**
```
You say: "Close out this session"
System runs:
  1. npx claude-flow@alpha hooks post-task --task-id "$SESSION_ID"
  2. npx claude-flow@alpha hooks session-end --generate-summary true
  3. Archives to .swarm/backups/session-$TIMESTAMP.json
```

## How Agent.md Files Work

Each `.claude/agents/*.md` file defines:

1. **Trigger phrase** (what you say)
2. **Bash commands** (what executes)
3. **Validation** (safety checks)
4. **Documentation** (why this pattern exists)

### File Structure

```markdown
# Agent Name

## Trigger Phrases
- "primary phrase to match"
- "alternative phrasing"
- "another way to say it"

## Commands Executed
```bash
# Step 1: Pre-flight checks
npx claude-flow@alpha hooks validate-session

# Step 2: Main workflow
npx claude-flow@alpha hooks session-end --generate-summary true

# Step 3: Cleanup
echo "Session closed successfully"
```

## Validation Rules
- Check: Session exists
- Check: No uncommitted changes
- Check: Summary file present

## Examples
[User says "Close this session"]
→ Runs commands above
→ Output: "Session archived to .swarm/backups/"
```

## Available Commands

### Session Management

**Trigger:** "Close out this session" / "End session" / "Session closeout"
**File:** `.claude/agents/session-closeout.md`
**What it does:**
1. Collects session data (hooks post-task)
2. Generates summary (hooks session-end)
3. Archives to .swarm/backups/
4. Updates Captain's Log

**Example:**
```
You: "Close out this session"
System:
  ✓ Collected session data
  ✓ Generated summary (12 decisions, 5 files changed)
  ✓ Archived to .swarm/backups/session-20251114-174024.json
  ✓ Updated Captain's Log: 3 entries added
```

---

### Captain's Log Entry

**Trigger:** "Log this decision" / "Add to Captain's Log" / "Journal entry"
**File:** `.claude/agents/captains-log.md`
**What it does:**
1. Prompts for entry content (if not provided)
2. Timestamps entry
3. Appends to today's log file
4. Stores in memory.db

**Example:**
```
You: "Log this decision: Chose PostgreSQL over MongoDB for user auth"
System:
  ✓ Added to sessions/captains-log/2025-01-14.md
  ✓ Timestamp: [14:23]
  ✓ Stored in memory.db
```

---

### File Routing Check

**Trigger:** "Where should I save this?" / "Check file routing" / "Validate paths"
**File:** `.claude/agents/file-routing.md`
**What it does:**
1. Checks current session ID
2. Validates file type (code/test/doc/script)
3. Returns correct artifacts path
4. Warns if attempting to write to root

**Example:**
```
You: "Where should I save this API test?"
System:
  ✓ Current session: session-20251114-174024-readme-documentation
  ✓ File type: test
  ✓ Destination: sessions/session-20251114-174024-readme-documentation/artifacts/tests/
  ⚠️  Do NOT save to root /tests/ directory
```

---

### Session Restore

**Trigger:** "Restore session context" / "Load previous session" / "Resume session"
**File:** `.claude/agents/session-restore.md`
**What it does:**
1. Lists recent sessions from .swarm/backups/
2. Prompts for selection (or uses most recent)
3. Restores memory.db state
4. Loads Captain's Log entries
5. Rebuilds context for continuation

**Example:**
```
You: "Restore session context from yesterday"
System:
  Available sessions:
  1. session-20251113-150000-api-development (3 hours, 47 files)
  2. session-20251113-120000-database-migration (1 hour, 12 files)

  Restoring session-20251113-150000-api-development...
  ✓ Loaded 23 memory entries
  ✓ Loaded 5 Captain's Log decisions
  ✓ Context rebuilt: Ready to continue
```

## How to Create New Agent Patterns

### 1. Identify the Workflow

What repetitive workflow would benefit from natural language triggering?

**Good candidates:**
- Multi-step processes (session closeout, deployments)
- Safety-critical operations (database migrations, rollbacks)
- Context-heavy workflows (session restore, decision logging)

**Poor candidates:**
- One-off commands (just run them directly)
- Highly variable operations (too many parameters)

### 2. Write the Agent File

Create `.claude/agents/your-pattern.md`:

```markdown
# Your Pattern Name

## Trigger Phrases
- "primary trigger phrase"
- "alternative phrasing"

## Commands Executed
```bash
#!/bin/bash
# Use stock claude-flow hooks (95% of the time)
npx claude-flow@alpha hooks your-hook --options

# Only add custom logic if absolutely necessary (5%)
if [ condition ]; then
  echo "Custom logic here"
fi
```

## Validation Rules
- Check: Prerequisites exist
- Check: No destructive conflicts
- Check: User confirmation for risky ops

## Examples
[User says "trigger phrase"]
→ Expected output
→ Success criteria

## Stock-First Checklist
- [ ] Uses npx claude-flow@alpha hooks (not custom code)
- [ ] Thin wrapper (<20 lines bash)
- [ ] Documented trigger phrases
- [ ] Clear validation rules
```

### 3. Test the Pattern

```bash
# Test manually first
source .claude/agents/your-pattern.md
# Verify commands execute correctly

# Test via Claude Code
# Say the trigger phrase and verify behavior
```

### 4. Document in This README

Add entry to "Available Commands" section above.

## Stock-First Principle

**95% stock claude-flow infrastructure:**

✅ Use `npx claude-flow@alpha hooks <command>` (stock CLI)
✅ Use bash scripting for glue logic (universal)
✅ Use standard tools (grep, sed, jq, etc.)

❌ **Don't** create custom Node.js scripts
❌ **Don't** reinvent existing hooks
❌ **Don't** build framework abstractions

**Why:** Stock tools get automatic updates, community support, and battle-testing. Custom code becomes technical debt.

## Pattern Library Structure

```
.claude/agents/
├── README.md (this file)
├── session-closeout.md       # End session workflow
├── captains-log.md            # Decision journal entry
├── file-routing.md            # Path validation
├── session-restore.md         # Context restoration
└── [your-custom-pattern.md]   # Your additions
```

## Integration with Hooks System

Agent patterns **trigger** hooks; they don't replace them.

```
Natural Language ("Close out this session")
        ↓
Agent Pattern (session-closeout.md)
        ↓
Stock Hooks (npx claude-flow@alpha hooks session-end)
        ↓
Memory/Log/Backup Storage
```

**Hooks** = Reusable building blocks
**Patterns** = Workflow orchestration via natural language

## Validation & Safety

Every agent pattern MUST include validation:

```bash
# Pre-flight checks (before destructive operations)
if [ ! -f "sessions/$SESSION_ID/metadata.json" ]; then
  echo "ERROR: No active session found"
  exit 1
fi

# Confirmation prompts (for risky operations)
read -p "This will archive the session. Continue? (y/N) " confirm
if [ "$confirm" != "y" ]; then
  echo "Cancelled"
  exit 0
fi

# Rollback capability (where possible)
trap 'echo "Error occurred. Rolling back..."; cleanup' ERR
```

## Common Pitfalls

❌ **Don't** create patterns for simple one-liners
```bash
# Bad: "list sessions" → ls sessions/
# Just run ls directly!
```

✅ **Do** create patterns for multi-step workflows
```bash
# Good: "close session" → collect + archive + log + cleanup
```

❌ **Don't** hardcode paths or assumptions
```bash
# Bad: cd /Users/yourname/project
# Good: cd "$PROJECT_ROOT" or use relative paths
```

✅ **Do** use environment variables and detection
```bash
# Good: SESSION_ID="${SESSION_ID:-$(detect_active_session)}"
```

❌ **Don't** reinvent existing hooks
```bash
# Bad: Custom JSON parsing to extract session data
# Good: npx claude-flow@alpha hooks session-end (does this already)
```

## Quick Reference

| Task | Command Pattern |
|------|-----------------|
| Close session | "Close out this session" |
| Log decision | "Log this decision: [your text]" |
| Check file paths | "Where should I save this?" |
| Restore context | "Restore session context" |
| Create new pattern | Copy template from this README |

## Success Criteria

A good agent pattern:

✅ **Reduces friction** (eliminates multi-step manual workflows)
✅ **Validates safety** (prevents accidental data loss)
✅ **Uses stock tools** (95% claude-flow hooks)
✅ **Documents clearly** (trigger phrases + examples)
✅ **Fails gracefully** (clear error messages, rollback capability)

## Advanced: Conditional Workflows

Agent patterns can branch based on context:

```bash
# Example: Smart session closeout
if grep -q "BLOCKER" "sessions/$SESSION_ID/session-summary.md"; then
  # Session had blockers - prompt for resolution before archiving
  echo "⚠️  Unresolved blockers detected"
  npx claude-flow@alpha hooks journal --entry "Session ended with blockers" --category "blocker"
else
  # Clean session - archive normally
  npx claude-flow@alpha hooks session-end --generate-summary true
fi
```

## Support & Debugging

**Pattern not triggering?**
1. Check trigger phrase spelling (case-insensitive, but exact match)
2. Verify .claude/agents/pattern-name.md exists
3. Test commands manually in bash
4. Check Claude Code logs for parsing errors

**Commands failing?**
1. Run with `set -x` for debug output
2. Verify claude-flow@alpha is installed (`npx claude-flow@alpha --version`)
3. Check prerequisites (session exists, files present, etc.)
4. Test each command individually

**Need help?**
- Read this README fully (answers 90% of questions)
- Search Captain's Log for similar patterns (`grep -r "pattern-name" sessions/captains-log/`)
- Review existing .claude/agents/*.md files for examples

---

**Remember:** Agent patterns are **workflow automation**, not AI magic. They map natural language to validated bash commands using stock claude-flow infrastructure. Keep them simple, safe, and stock-first.
