# Hidden Folders Deep Dive: Behind the Scenes Coordination

**Session**: session-20251117-233107-workspace-docs-optimization
**Date**: 2025-11-17
**Purpose**: Understand how hidden folders enable system coordination

---

## Executive Summary

Your workspace has **9 hidden folders** totaling **130MB** of coordination data. These folders are the "nervous system" of your AI development environment - they enable agents to communicate, remember decisions, and coordinate work automatically.

**Key Folders by Size:**
1. `.swarm/` - 118MB (Coordination memory)
2. `.git/` - 6.8MB (Version control)
3. `.claude/` - 1.9MB (Environment config)
4. `.hive-mind/` - 1.0MB (Multi-agent coordination)
5. `node_modules/` - 30MB (Dependencies)

**What They Do**: These folders work together to create a coordinated development environment where AI agents can work in parallel, remember past decisions, and learn from experience.

---

## 1. `.swarm/` - The Coordination Brain (118MB)

### Purpose
`.swarm/` is the **primary coordination system** that enables Claude Flow agents to work together. Think of it as the "shared brain" where all agents store and retrieve information.

### Contents
```
.swarm/
├── memory.db (117MB)          # Main coordination database
├── memory.db-shm (32KB)       # Shared memory file
├── memory.db-wal (4.3MB)      # Write-ahead log
├── backups/ (31 files)        # Session snapshots
├── hooks/ (9 directories)     # Hook system data
└── metrics/ (2 files)         # Performance tracking
```

### Coordination Role: The Critical Hub

**What's Inside memory.db:**
- **68,219 memory entries** storing coordination data
- **Pattern recognition** (learned behaviors)
- **Task trajectories** (what worked/failed)
- **Agent communication logs**

**Top Namespaces (by entry count):**
1. `hooks:pre-bash` - 12,600 entries (command validation)
2. `performance-metrics` - 11,845 entries (speed tracking)
3. `hooks:post-bash` - 11,844 entries (result storage)
4. `command-results` - 11,843 entries (execution history)
5. `command-history` - 11,836 entries (what ran when)
6. `coordination` - 1,413 entries (agent-to-agent messages)
7. `file-history` - 1,345 entries (edit tracking)

**How It Works:**
```
Agent 1 writes → memory.db → Agent 2 reads
         ↓
    Hooks fire automatically
         ↓
    Memory updates in real-time
         ↓
    All agents see the same data
```

### User Impact: Why You Should Care

**Benefits:**
- Agents automatically coordinate without you managing it
- Past decisions are remembered across sessions
- Performance improves as system learns patterns
- Session state can be restored after crashes

**Size Concern:** 118MB is normal for active development. The database contains:
- Full command history (safety/debugging)
- Session states (200KB each, largest entries)
- Performance metrics for optimization

### Best Practices

**✅ Leave It Alone:**
- Don't manually edit `memory.db`
- Let hooks manage it automatically
- System self-maintains (prunes old entries)

**✅ Useful Commands:**
```bash
# View coordination stats
npx claude-flow@alpha memory:stats

# Search memory
npx claude-flow@alpha memory:search "pattern"

# Clean old entries (if needed)
npx claude-flow@alpha memory:prune --older-than 30d
```

**❌ Don't:**
- Delete while agents are running
- Edit database directly
- Move to different location

---

## 2. `.hive-mind/` - Multi-Agent Orchestration (1.0MB)

### Purpose
`.hive-mind/` manages **swarm coordination** - when multiple agents need to work together on complex tasks with a "queen" (coordinator) guiding "workers" (specialized agents).

### Contents
```
.hive-mind/
├── hive.db (938KB)            # Swarm coordination database
├── config.json (334B)         # System settings
├── config/
│   ├── queens.json            # Queen agent configs
│   └── workers.json           # Worker agent configs
├── sessions/ (13 files)       # Active swarm sessions
├── exports/
│   └── verification-dashboard.json
├── backups/
├── logs/
├── memory/
│   └── memory.db (16KB)       # Separate memory store
└── templates/
```

### Coordination Role: Hierarchical Organization

**Database Structure (hive.db):**
```sql
Tables:
- swarms (9 active)      # Coordination groups
- agents (45 total)      # Individual AI workers
- tasks (0 active)       # Work items
- messages               # Agent communication
- decisions              # Consensus tracking
- performance            # Metrics per agent
```

**How Swarms Work:**
1. **Queen Agent** receives complex task
2. **Queen delegates** to specialized workers
3. **Workers coordinate** via hive.db
4. **Consensus built** on decisions
5. **Results aggregated** by queen

**Real Data:**
- 9 swarms created (different topologies tested)
- 45 agents spawned (different specializations)
- Sessions auto-save every 30 seconds

### User Impact

**Why It Matters:**
- Handles tasks too complex for single agents
- Provides fault tolerance (if one agent fails, others continue)
- Enables democratic decision-making (agents vote on approaches)
- Tracks performance to optimize agent selection

**When It's Used:**
- Large refactorings
- Multi-file feature implementations
- Architecture decisions requiring multiple perspectives
- Parallel test generation

### Best Practices

**✅ Check Status:**
```bash
npx claude-flow@alpha hive-mind status
npx claude-flow@alpha hive-mind sessions
```

**✅ Clean Old Sessions:**
```bash
# Auto-cleanup after 7 days
npx claude-flow@alpha hive-mind prune
```

**❌ Don't:**
- Delete while swarm is active
- Manually edit session files
- Modify hive.db directly

---

## 3. `.claude/` - Environment Configuration (1.9MB)

### Purpose
`.claude/` is your **Claude Code configuration hub** - it defines how Claude behaves, what tools are available, and which hooks fire automatically.

### Contents
```
.claude/
├── settings.json (4.3KB)      # Main configuration
├── settings.local.json (5.7KB) # Local overrides
├── agents/ (24 files)         # 54 agent definitions
├── commands/ (19 files)       # Slash commands
├── skills/ (31 directories)   # 31 advanced skills
├── hooks/ (6 files)           # Hook system
├── integrations/ (6 files)    # External tool integrations
├── reasoningbank/ (11 files)  # Learning system
├── scripts/ (3 files)         # Automation scripts
├── checkpoints/               # State snapshots
└── statusline-command.sh      # Status bar script
```

### Coordination Role: The Control Center

**settings.json - What It Does:**

**1. Environment Variables:**
```json
"env": {
  "CLAUDE_FLOW_AUTO_COMMIT": "false",
  "CLAUDE_FLOW_HOOKS_ENABLED": "true",
  "CLAUDE_FLOW_TELEMETRY_ENABLED": "true",
  "CLAUDE_FLOW_REMOTE_EXECUTION": "true",
  "CLAUDE_FLOW_CHECKPOINTS_ENABLED": "true"
}
```
These control system behavior globally.

**2. Permissions:**
```json
"permissions": {
  "allow": [
    "Bash(npx claude-flow:*)",
    "Bash(git:*)",
    ...
  ],
  "deny": ["Bash(rm -rf /)"]
}
```
Safety guardrails to prevent dangerous operations.

**3. Hooks (The Magic):**
```json
"hooks": {
  "PreToolUse": [
    { "matcher": "Write|Edit|MultiEdit",
      "command": "npx claude-flow@alpha hooks pre-edit --file '{}'"
    }
  ],
  "PostToolUse": [
    { "matcher": "Write|Edit|MultiEdit",
      "command": "npx claude-flow@alpha hooks post-edit --file '{}'"
    }
  ]
}
```

**How Hooks Create Coordination:**
```
You: "Edit server.js"
         ↓
Claude Code: Preparing to edit...
         ↓
🪝 PRE-EDIT HOOK FIRES:
  - Validates file exists
  - Loads context from memory
  - Auto-assigns agents if needed
  - Prepares resources
         ↓
Claude: Makes actual edit
         ↓
🪝 POST-EDIT HOOK FIRES:
  - Formats code
  - Updates memory.db
  - Tracks metrics
  - Notifies other agents
         ↓
Done! (Coordination happened invisibly)
```

**Agents Directory:**
Contains 54 specialized agent definitions:
- `coder.md` - Code implementation
- `reviewer.md` - Code review
- `tester.md` - Test generation
- `sparc-coord.md` - SPARC methodology coordination
- `github-modes.md` - GitHub integration
- ...and 49 more

**Skills Directory:**
31 advanced skills available:
- `swarm-orchestration` - Multi-agent coordination
- `hooks-automation` - Hook management
- `reasoningbank-intelligence` - Adaptive learning
- `agentdb-vector-search` - Semantic search
- ...and 27 more

### User Impact

**Why It Matters:**
- **Hooks create automatic coordination** without manual intervention
- **Agent definitions** ensure consistent behavior
- **Skills** unlock advanced capabilities
- **Settings** let you customize everything

**Configuration Control:**
- `settings.json` - Shared (version controlled)
- `settings.local.json` - Your personal overrides (not committed)

### Best Practices

**✅ Customize Safely:**
```bash
# View current settings
cat .claude/settings.local.json

# Add personal overrides (don't edit settings.json)
echo '{"env": {"MY_VAR": "value"}}' > .claude/settings.local.json
```

**✅ Explore:**
- Read agent definitions in `.claude/agents/`
- Try skills: `/skill-name`
- Check available commands: `.claude/commands/`

**❌ Don't:**
- Delete `.claude/` (breaks everything)
- Edit `settings.json` without backup
- Disable hooks unless debugging

---

## 4. `.git/` - Version Control (6.8MB)

### Purpose
`.git/` is your **version control system** - it tracks every change to your code, enabling time travel, collaboration, and safety nets.

### Contents
```
.git/
├── objects/        # Compressed file versions
├── refs/           # Branch pointers
├── HEAD            # Current branch
├── config          # Repository settings
├── hooks/          # Git hooks (different from Claude hooks)
├── index           # Staging area
└── logs/           # Change history
```

### Coordination Role: Historical Memory

**What It Tracks:**
- Every file change (who, when, what)
- Branch history (parallel work streams)
- Commit messages (why changes were made)
- Author information (who did what)

**Recent Activity (from your repo):**
```
5992de2 Session closeout: inbox-cleanup
f766c1a Inbox cleanup session and workspace organization
7bbb460 Archive completed system hygiene check
b790a4a Consolidate session artifacts
e1a8286 Organize session management protocol
```

**How Agents Use It:**
- Auto-commit after major changes
- Create branches for experimental work
- Track which files were modified
- Enable rollback if something breaks

### User Impact

**Why It Matters:**
- **Safety**: Can undo any change
- **Collaboration**: Multiple people/agents can work together
- **History**: Understand how code evolved
- **Backup**: Remote copies on GitHub/GitLab

**Size**: 6.8MB is normal for an active project with history.

### Best Practices

**✅ Use Regularly:**
```bash
git status              # Check what changed
git log --oneline       # View history
git diff                # See changes
git checkout -b branch  # Create branch
```

**✅ Let Agents Commit:**
- Hooks can auto-commit (if enabled)
- Session closeout creates commits
- Clean history maintained

**❌ Don't:**
- Delete `.git/` (loses all history!)
- Force-push without backup
- Manually edit objects

---

## 5. `.agentdb/` - ReasoningBank Learning (408KB)

### Purpose
`.agentdb/` stores **adaptive learning data** using ReasoningBank - a system that helps AI agents learn from experience and improve over time.

### Contents
```
.agentdb/
├── reasoningbank.db (385KB)   # Learning database
├── reasoningbank.db-shm (32KB)
└── reasoningbank.db-wal (0B)
```

### Coordination Role: Pattern Learning

**What It Learns:**
- Which approaches succeeded/failed
- Optimal agent assignments for tasks
- Code patterns that work well
- Common error resolutions

**Database Structure:**
```sql
Tables:
- trajectories       # What was tried
- verdicts          # What worked
- memories          # Distilled lessons
- patterns          # Recognized structures
- embeddings        # Semantic search vectors
```

**Learning Loop:**
```
Task attempted → Trajectory recorded
       ↓
   Verdict judgment (success/fail)
       ↓
   Memory distillation (extract lesson)
       ↓
   Pattern recognition (generalize)
       ↓
   Future tasks use learned patterns
```

### User Impact

**Why It Matters:**
- System gets smarter over time
- Avoids repeating mistakes
- Suggests proven approaches
- Optimizes agent selection

**Size**: 408KB is small - learning data is compressed.

### Best Practices

**✅ Let It Learn:**
```bash
# View learning stats
npx claude-flow@alpha reasoningbank:stats

# Export learned patterns
npx claude-flow@alpha reasoningbank:export
```

**❌ Don't:**
- Delete (loses all learning)
- Manually edit database

---

## 6. `node_modules/` - Dependencies (30MB)

### Purpose
`node_modules/` contains **JavaScript libraries** that Claude Flow and related tools depend on to function.

### Contents
```
node_modules/
├── .bin/              # Executable commands
├── @npmcli/           # NPM utilities
├── better-sqlite3/    # Database driver
├── accepts/           # HTTP content negotiation
├── agentkeepalive/    # HTTP connection pooling
└── ...182 packages
```

### Coordination Role: Tooling Foundation

**What's Inside:**
- **better-sqlite3**: Powers `.swarm/memory.db` and `.hive-mind/hive.db`
- **claude-flow**: CLI tools for coordination
- **HTTP libraries**: Network communication
- **Utilities**: File handling, parsing, etc.

**How It Enables Coordination:**
```
Your command: npx claude-flow@alpha swarm:init
         ↓
    Loads from node_modules/claude-flow/
         ↓
    Uses better-sqlite3 → memory.db
         ↓
    Coordination happens
```

### User Impact

**Why It Matters:**
- Provides tools for coordination
- Updated via `npm install`
- Required for all features to work

**Size**: 30MB is normal for development dependencies.

### Best Practices

**✅ Keep Updated:**
```bash
npm install          # Install dependencies
npm update          # Update to latest versions
npm audit fix       # Security updates
```

**✅ Don't Commit:**
- Already in `.gitignore`
- Others install their own via `package.json`

**❌ Don't:**
- Delete (breaks everything)
- Manually edit packages
- Version control it

---

## 7. `.archive/` - Old Inbox Content (228KB)

### Purpose
`.archive/` stores **completed/outdated inbox items** that have been processed but kept for reference.

### Contents
```
.archive/
└── inbox/
    └── assistant/
        ├── documentation-synthesis.md
        ├── coherence-and-dependencies.md
        ├── 1-content-placement/
        ├── 2-quality-improvements/
        └── STATUS.md
```

### Coordination Role: Historical Context

**What's Archived:**
- Completed inbox tasks
- Old proposals
- Previous analysis
- Historical decisions

### User Impact

**Why It Matters:**
- Reference for "why we did X"
- Context for future similar work
- Audit trail

**Size**: 228KB is tiny - just text files.

### Best Practices

**✅ Review Occasionally:**
```bash
ls -la .archive/inbox/
```

**✅ Delete If Not Needed:**
- Safe to remove after 6+ months
- Not used by system

---

## 8. `.claude-flow/` - Stock Claude Flow Data (40KB)

### Purpose
`.claude-flow/` is the **stock Claude Flow** configuration directory (separate from `.swarm/` which is the active coordination layer).

### Contents
```
.claude-flow/
├── config.json
└── ...minimal files
```

### Coordination Role: Upstream Configuration

**What It Does:**
- Stores stock Claude Flow settings
- Used as fallback configuration
- Overridden by `.swarm/` settings

### User Impact

**Why It Matters:**
- Provides baseline configuration
- Enables stock behavior fallback

**Size**: 40KB - mostly empty, stock behavior.

### Best Practices

**✅ Leave Alone:**
- Managed automatically
- Not actively used in custom setup

---

## 9. `.inbox/` - Temporary Staging (428KB)

### Purpose
`.inbox/` is a **temporary staging area** for incoming content before it's processed and moved to proper locations.

### Contents
```
.inbox/
├── README.md          # Inbox protocol
└── [temporary files]
```

### Coordination Role: Input Queue

**What Goes Here:**
- External files to process
- Agent-generated content for review
- Temporary analysis

**Workflow:**
```
Content arrives → .inbox/
       ↓
   Review/process
       ↓
   Move to proper location (docs/, sessions/, etc.)
       ↓
   .inbox/ cleared
```

### User Impact

**Why It Matters:**
- Prevents clutter in main directories
- Clear processing workflow
- HITL (Human-In-The-Loop) approval point

### Best Practices

**✅ Process Regularly:**
```bash
# Check inbox
ls .inbox/

# After review, move files to proper locations
```

**❌ Don't:**
- Store permanent files here
- Let it accumulate indefinitely

---

## Hidden Folders at a Glance

| Folder | Size | Purpose | Touch It? |
|--------|------|---------|-----------|
| `.swarm/` | 118MB | Coordination memory | ❌ No |
| `.git/` | 6.8MB | Version control | ✅ Via git commands |
| `.claude/` | 1.9MB | Environment config | ✅ settings.local.json |
| `.hive-mind/` | 1.0MB | Multi-agent coordination | ❌ No |
| `.agentdb/` | 408KB | Learning system | ❌ No |
| `.inbox/` | 428KB | Temporary staging | ✅ Process & clear |
| `.archive/` | 228KB | Historical reference | ✅ Can delete old |
| `.claude-flow/` | 40KB | Stock config | ❌ No |
| `node_modules/` | 30MB | Dependencies | ❌ No (npm manages) |

**Total Hidden Data**: ~160MB (coordination overhead for multi-agent system)

---

## How Coordination Actually Works: A Real Example

Let's trace what happens when you ask Claude to "implement a login feature":

### Step 1: Hook Fires (Pre-Task)
```
.claude/settings.json → PreToolUse hook triggered
         ↓
npx claude-flow@alpha hooks pre-task
         ↓
Writes to .swarm/memory.db:
  - Task started
  - Timestamp
  - Context loaded
```

### Step 2: Agent Coordination
```
Claude reads .swarm/memory.db:
  - Previous login implementations?
  - Security best practices learned?
  - Available agents?
         ↓
.hive-mind/hive.db queried:
  - Spawn security agent
  - Spawn coder agent
  - Spawn tester agent
         ↓
Agents coordinate via .swarm/memory.db:
  - Security agent: "Use bcrypt"
  - Coder agent: "Got it, implementing"
  - Tester agent: "Writing tests"
```

### Step 3: Learning Happens
```
Task completes successfully
         ↓
.agentdb/reasoningbank.db updated:
  - Trajectory: What steps worked
  - Verdict: Success
  - Memory: "Login with bcrypt is proven approach"
         ↓
Next time someone asks for login:
  - System suggests bcrypt automatically
  - Agents coordinate faster
  - Better implementation
```

### Step 4: Git Tracking
```
.git/ captures changes:
  - git commit -m "Implement login feature"
  - Files: auth.js, login.test.js
  - History preserved
```

### Step 5: Session Backup
```
Session ends
         ↓
.swarm/backups/session-TIMESTAMP.json created:
  - All artifacts listed
  - Memory state captured
  - Can restore if needed
```

**Result**: Seamless coordination across multiple systems, all happening invisibly behind the scenes.

---

## Size Management: When to Clean Up

### Normal Sizes (No Action Needed)
- `.swarm/` - Up to 500MB is normal for active development
- `.git/` - Up to 50MB for typical projects
- `node_modules/` - 30-100MB depending on dependencies
- `.hive-mind/` - 1-5MB

### When to Clean

**`.swarm/memory.db` is too large (>1GB):**
```bash
# Prune old entries
npx claude-flow@alpha memory:prune --older-than 30d

# Or start fresh (WARNING: loses history)
rm .swarm/memory.db
# System will recreate on next run
```

**`.git/` is too large (>100MB):**
```bash
# Remove old branches
git branch -d old-branch-name

# Compress objects
git gc --aggressive
```

**`node_modules/` needs update:**
```bash
# Remove and reinstall
rm -rf node_modules/
npm install
```

**`.hive-mind/sessions/` has old sessions:**
```bash
# Auto-cleanup
npx claude-flow@alpha hive-mind prune

# Manual cleanup
find .hive-mind/sessions/ -mtime +7 -delete
```

---

## Troubleshooting: Hidden Folder Issues

### Problem: "Database locked" error

**Cause**: Multiple processes accessing `.swarm/memory.db`

**Fix:**
```bash
# Find processes using database
lsof .swarm/memory.db

# Kill if necessary
kill <PID>

# Or reboot (cleanest)
```

### Problem: Hooks not firing

**Cause**: `.claude/settings.json` configuration issue

**Fix:**
```bash
# Check hooks enabled
jq '.env.CLAUDE_FLOW_HOOKS_ENABLED' .claude/settings.json

# Should return "true"

# Re-enable if needed
# Edit .claude/settings.local.json
```

### Problem: Git history too large

**Cause**: Large files committed accidentally

**Fix:**
```bash
# Find large files
git rev-list --objects --all | \
  git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | \
  awk '/^blob/ {print substr($0,6)}' | \
  sort --numeric-sort --key=2 | \
  tail -10

# Remove from history (advanced - be careful!)
git filter-branch --tree-filter 'rm -f path/to/large/file' HEAD
```

### Problem: Memory.db corrupt

**Cause**: Crash during write

**Fix:**
```bash
# Restore from backup
cp .swarm/backups/session-LATEST.json .swarm/memory.db.backup

# Or rebuild (loses some data)
sqlite3 .swarm/memory.db "PRAGMA integrity_check"
sqlite3 .swarm/memory.db ".dump" | sqlite3 .swarm/memory-repaired.db
mv .swarm/memory-repaired.db .swarm/memory.db
```

---

## Advanced: Reading Coordination Data

### Query Memory Database

**See what agents remember:**
```bash
sqlite3 .swarm/memory.db "
  SELECT namespace, key, value
  FROM memory_entries
  WHERE namespace = 'coordination'
  LIMIT 5
"
```

**Find largest entries:**
```bash
sqlite3 .swarm/memory.db "
  SELECT key, namespace, LENGTH(value) as size
  FROM memory_entries
  ORDER BY LENGTH(value) DESC
  LIMIT 10
"
```

**Check hook execution history:**
```bash
sqlite3 .swarm/memory.db "
  SELECT key, value
  FROM memory_entries
  WHERE namespace LIKE 'hooks:%'
  ORDER BY created_at DESC
  LIMIT 20
"
```

### Query Hive Mind Database

**See active swarms:**
```bash
sqlite3 .hive-mind/hive.db "
  SELECT id, name, topology, status, max_agents
  FROM swarms
  WHERE status = 'active'
"
```

**Check agent performance:**
```bash
sqlite3 .hive-mind/hive.db "
  SELECT name, type, task_count, success_rate, performance_score
  FROM agents
  ORDER BY performance_score DESC
  LIMIT 10
"
```

**View recent messages:**
```bash
sqlite3 .hive-mind/hive.db "
  SELECT sender_id, receiver_id, message_type, content
  FROM messages
  ORDER BY created_at DESC
  LIMIT 20
"
```

### Query Learning Database

**See learned patterns:**
```bash
sqlite3 .agentdb/reasoningbank.db "
  SELECT type, confidence, usage_count
  FROM patterns
  ORDER BY usage_count DESC
  LIMIT 10
"
```

**Check task success rate:**
```bash
sqlite3 .agentdb/reasoningbank.db "
  SELECT
    COUNT(*) as total,
    SUM(CASE WHEN verdict = 'success' THEN 1 ELSE 0 END) as successes,
    ROUND(AVG(CASE WHEN verdict = 'success' THEN 1 ELSE 0 END) * 100, 2) as success_rate
  FROM trajectories
"
```

---

## Summary: The Coordination Ecosystem

### The Big Picture

Your hidden folders create a **coordinated ecosystem** where:

1. **`.claude/`** defines the rules (configuration)
2. **`.swarm/`** stores the shared memory (coordination database)
3. **`.hive-mind/`** manages multi-agent workflows (orchestration)
4. **`.agentdb/`** learns from experience (adaptive intelligence)
5. **`.git/`** tracks changes (version control)
6. **`node_modules/`** provides the tools (dependencies)

**Result**: AI agents that work together seamlessly, learn from mistakes, and improve over time - all automatically, behind the scenes.

### Key Takeaways

✅ **Leave most folders alone** - they're self-managing
✅ **Only customize `.claude/settings.local.json`** - safe personalization
✅ **Monitor sizes** - normal is 100-200MB total for hidden folders
✅ **Use provided tools** - `npx claude-flow@alpha` commands for safe interaction
✅ **Clean periodically** - prune old data every 30-60 days

### When to Investigate

🔍 **Check hidden folders if:**
- System behaves strangely
- Performance degrades
- Disk space is low
- Want to understand "why did it do that?"

🛠️ **Tools for Investigation:**
```bash
# Size overview
du -sh .[!.]* | sort -hr

# Memory stats
npx claude-flow@alpha memory:stats

# Hive mind status
npx claude-flow@alpha hive-mind:status

# Git history
git log --oneline --graph --all

# Database queries
sqlite3 .swarm/memory.db ".tables"
```

---

## Further Reading

- **Session Management**: `docs/explanation/session-management.md`
- **File Routing**: `docs/explanation/file-routing.md`
- **Workspace Architecture**: `docs/explanation/workspace-architecture.md`
- **Coordination Mechanics**: `docs/internals/system/coordination-mechanics.md`

---

**End of Hidden Folders Deep Dive**

*Generated by: Hidden Folders Specialist*
*Session: session-20251117-233107-workspace-docs-optimization*
*Evidence: 9 hidden folders analyzed, 68,219 memory entries, 31 session backups, 45 agents tracked*
