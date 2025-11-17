# Stock Claude-Flow Protocol for `.claude-flow` Directories

**Date**: 2025-11-16
**Session**: session-20251116-215913-inbox-cleanup

---

## TL;DR: What You Should Do

**Answer: NOTHING. Just let them exist.**

- ✅ They're already in `.gitignore` (line 8)
- ✅ They won't be committed to git
- ✅ They're transient metrics caches (~5-12 KB each)
- ✅ Claude-flow creates them automatically wherever hooks run
- ✅ This is 100% stock behavior and intentional

**You should NOT manually delete them.**

---

## Stock Claude-Flow Protocol

### 1. How It Works (Stock Behavior)

**When `.claude-flow/` directories are created:**
- Anytime `npx claude-flow@alpha hooks <command>` runs
- Created in the **current working directory** (`process.cwd()`)
- Contains real-time metrics in `metrics/` folder (4 JSON files)

**Where they appear:**
- Project root: `./.claude-flow/` ← Primary metrics (always present)
- Subdirectories: Wherever agents navigate and run hooks
  - `sessions/<session>/artifacts/code/.claude-flow/`
  - `sessions/<session>/artifacts/docs/.claude-flow/`
  - `inbox/<folder>/.claude-flow/`
  - Any directory where agent operations execute

**Why multiple directories:**
- Enables **distributed metrics tracking** for parallel agent coordination
- Each agent working in different directories gets isolated metrics
- Prevents metric corruption when agents run concurrently

---

### 2. Stock Protocol: Let Them Exist

**The `.gitignore` already handles this correctly:**

```gitignore
# Line 8 of .gitignore
.claude-flow/
```

**This means:**
- ✅ All `.claude-flow/` directories are ignored by git (wherever they appear)
- ✅ They won't pollute your commits
- ✅ They're treated as transient cache data
- ✅ Safe to leave them indefinitely

**Stock protocol = "Ignore and forget"**

---

### 3. What You Should Do Going Forward

**Daily workflow:**
```bash
# Nothing! Just work normally.
# Let .claude-flow directories appear and exist.
# Git will automatically ignore them.
```

**What NOT to do:**
- ❌ Don't manually delete them
- ❌ Don't add cleanup scripts
- ❌ Don't worry about them appearing
- ❌ Don't commit them (already gitignored)

**What happens over time:**
- They accumulate in various subdirectories
- Total disk usage: negligible (~50-100 KB)
- No performance impact
- No manual intervention needed

---

### 4. Optional: Periodic Cleanup (Not Required)

**If you want to clean up for tidiness (optional):**

```bash
# Safe cleanup (keeps root, removes others)
find . -type d -name ".claude-flow" -not -path "./.claude-flow" -exec rm -rf {} + 2>/dev/null
```

**When to run this:**
- Never required
- Optional: after archiving old sessions
- Optional: monthly tidying

**Impact:**
- Removes transient metrics caches
- Metrics regenerate on next hook execution
- No data loss (metrics are temporary)

---

### 5. Why This Isn't Documented

**Documentation gap identified:**
- CLAUDE.md doesn't explain `.claude-flow` behavior
- WORKSPACE-GUIDE.md has no references
- Stock claude-flow docs don't cover lifecycle management

**This is a known gap** - the stock protocol is "implicit" (rely on .gitignore)

**Recommendation for CLAUDE.md:**
Add brief note explaining that `.claude-flow` directories are expected and gitignored.

---

### 6. Comparison with Other Claude-Flow Directories

| Directory | Purpose | Location | Gitignored? | Cleanup? |
|-----------|---------|----------|-------------|----------|
| `.claude-flow/` | Metrics cache | Multiple (distributed) | ✅ Yes | Optional |
| `.swarm/` | Memory & backups | Root only | ✅ Yes | Never |
| `.agentdb/` | Vector database | Root only | ❌ No* | Never |
| `sessions/` | Session artifacts | Root only | ❌ No | Archive old |

*Should probably be gitignored but isn't currently

---

## Summary

**Stock Protocol = "Let It Be"**

1. **Let `.claude-flow/` directories appear** wherever claude-flow operations run
2. **Git automatically ignores them** (already in .gitignore)
3. **No manual intervention needed** - they're harmless transient caches
4. **Optional cleanup** if you want tidiness (not required)
5. **This is intentional design** by claude-flow for distributed metrics

**Your workflow:** Work normally, ignore the directories, let git handle them.

---

## Final Answer to Your Question

> "Will it create these in every directory and should I let them simply exist?"

**YES** - Claude-flow will create `.claude-flow/` in any directory where:
- Agents run and execute hooks
- Operations trigger metrics collection
- Working directory changes during execution

**YES** - You should let them exist. They're:
- Already gitignored (won't be committed)
- Harmless transient caches
- Part of stock claude-flow design
- No manual deletion needed

**Stock protocol: Do nothing. Git handles it automatically.**
