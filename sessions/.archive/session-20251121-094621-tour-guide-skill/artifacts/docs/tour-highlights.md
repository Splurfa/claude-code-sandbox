# Tour Highlights - Recommended Stops for New Users

**Generated**: 2025-11-21
**Purpose**: Curated tour of the most important workspace areas
**Audience**: New users learning the workspace

---

## Welcome to the Workspace Tour!

This workspace is built on **Three Principles**:
1. **Time-neutral** - Work when ready, not on schedule
2. **Scale-agnostic** - Works identically with 10 items or 10,000
3. **Stock-first** - 95% battle-tested claude-flow infrastructure

Let me show you the **9 essential stops** every user should visit.

---

## Tour Stop 1: CLAUDE.md (The Constitution)

**Location**: `/Users/splurfa/common-thread-sandbox/CLAUDE.md`

**What It Is**: The main project configuration that governs all workspace behavior

**Why Visit**:
- Defines all system rules and protocols
- Explains "One Session = One Chat" rule
- Documents concurrent execution patterns
- Lists all 54 agent types
- Shows MCP tool integration
- Explains hooks automation

**Key Sections**:
```markdown
## 📋 SESSION MANAGEMENT PROTOCOL
- Session structure and lifecycle
- File routing rules (ALL new files → session artifacts)

## 🚨 CRITICAL: CONCURRENT EXECUTION & FILE MANAGEMENT
- "1 MESSAGE = ALL OPERATIONS" golden rule
- Task tool for agent spawning
- Batch operations patterns

## 🚀 Available Agents (54 Total)
- Core Development (5)
- Swarm Coordination (5)
- GitHub Integration (13)
- And many more...
```

**Tour Insight**: This is the "source of truth" - when in doubt, check CLAUDE.md first.

---

## Tour Stop 2: sessions/ (Where All Work Happens)

**Location**: `/Users/splurfa/common-thread-sandbox/sessions/`

**What It Is**: Isolated workspaces for all AI-generated content

**Why Visit**:
- Understand containment-promotion architecture
- See how sessions organize work
- Learn artifact directory structure
- View example sessions
- Check Captain's Log

**Structure**:
```
sessions/
├── README.md                           # Session management guide
├── captains-log/                       # Daily decision journal
│   ├── 2025-11-13.md
│   ├── 2025-11-14.md
│   └── learning-log.jsonl
├── session-YYYYMMDD-HHMMSS-<topic>/   # Individual sessions
│   └── artifacts/
│       ├── code/                       # ALL source code goes here
│       ├── tests/                      # ALL tests go here
│       ├── docs/                       # ALL documentation goes here
│       ├── scripts/                    # ALL scripts go here
│       └── notes/                      # ALL notes go here
└── .archive/                          # Closed sessions
```

**Tour Insight**: **NEVER write to root directories** - always use session artifacts.

**Key Concept**: ONE SESSION = ONE CHAT THREAD (not per task, not per agent)

---

## Tour Stop 3: .swarm/memory.db (The Brain)

**Location**: `/Users/splurfa/common-thread-sandbox/.swarm/memory.db`

**What It Is**: SQLite database for persistent cross-session memory (111MB)

**Why Visit**:
- Understand how agents remember things
- See memory coordination in action
- Learn about namespaces
- View storage statistics

**Statistics**:
- **68,219 memory entries** across 15 namespaces
- **111MB database size**
- **Cross-session persistence** (survives chat restarts)

**Namespaces**:
```
workspace-coordination   - Project-wide decisions
swarm/shared/*          - Agent coordination data
tutor-progress          - Learning tracking
session/*               - Session-specific state
reasoningbank/*         - Learning patterns
```

**How to Use**:
```javascript
// Store data
mcp__claude-flow_alpha__memory_usage({
  action: "store",
  key: "decision",
  value: JSON.stringify({ decision: "mesh topology", rationale: "..." }),
  namespace: "workspace-coordination"
})

// Retrieve data
mcp__claude-flow_alpha__memory_usage({
  action: "retrieve",
  key: "decision",
  namespace: "workspace-coordination"
})

// Search patterns
mcp__claude-flow_alpha__memory_search({
  pattern: "decision*",
  namespace: "workspace-coordination"
})
```

**Tour Insight**: Memory is how agents coordinate across sessions and remember decisions.

---

## Tour Stop 4: .claude/skills/ (32 Superpowers)

**Location**: `/Users/splurfa/common-thread-sandbox/.claude/skills/`

**What It Is**: 32 specialized skills that extend Claude Code's capabilities

**Why Visit**:
- Discover available skills
- Understand skill categories
- Learn skill invocation methods
- See progressive disclosure in action

**Skill Categories** (9 total):
1. **Core Workflow** (5) - session-closeout, meta-skill, file-routing, prompt-improver, hooks-automation
2. **Learning** (3) - tutor-mode, skill-builder, pair-programming
3. **Multi-Agent** (4) - swarm-orchestration, swarm-advanced, hive-mind-advanced, stream-chain
4. **Quality** (2) - verification-quality, github-code-review
5. **AgentDB** (5) - vector-search, memory-patterns, optimization, learning, advanced
6. **GitHub** (5) - workflow-automation, release-management, project-management, multi-repo, code-review
7. **Flow-Nexus** (3) - swarm, neural, platform
8. **Advanced** (3) - reasoningbank-intelligence, reasoningbank-agentdb, agentic-jujutsu
9. **Methodology** (2) - sparc-methodology, pair-programming

**Most Important Skills for New Users**:
1. **tutor-mode** - Adaptive learning guide (start here!)
2. **meta-skill** - Intelligent skill routing
3. **session-closeout** - Session lifecycle management
4. **file-routing** - File organization guide
5. **swarm-orchestration** - Multi-agent coordination

**How to Invoke**:
```
Natural Language: "help me optimize my prompts"
Meta-Skill: /meta menu
Direct: /tutor start
Function: Skill({ skill: "tutor-mode" })
```

**Tour Insight**: Start with `tutor-mode` for guided learning, use `meta-skill` to discover others.

---

## Tour Stop 5: .claude/agents/ (80+ Agent Types)

**Location**: `/Users/splurfa/common-thread-sandbox/.claude/agents/`

**What It Is**: 80+ agent definitions organized by category

**Why Visit**:
- See all available agent types
- Understand agent specializations
- Learn agent organization
- View agent templates

**Agent Categories**:
```
agents/
├── core/              # 5 core agents (researcher, coder, tester, planner, reviewer)
├── consensus/         # 7 consensus agents (Byzantine, Raft, Gossip, etc.)
├── swarm/             # 3 swarm coordinators
├── hive-mind/         # 5 hive-mind agents (queen, worker, scout)
├── github/            # 13 GitHub agents
├── flow-nexus/        # 9 Flow-Nexus agents
├── sparc/             # 4 SPARC agents
├── templates/         # 9 agent templates
├── optimization/      # 5 optimization agents
├── testing/           # 2 testing agents
└── ... (12 more categories)
```

**Most Common Agents**:
- **researcher** - Analyze requirements and patterns
- **coder** - Implement features
- **tester** - Write comprehensive tests
- **reviewer** - Review code quality
- **planner** - Break down complex tasks

**How to Spawn**:
```javascript
// Claude Code Task tool (REQUIRED for actual execution)
Task("Research agent", "Analyze requirements. Save to sessions/$SESSION_ID/artifacts/code/.", "researcher")
Task("Coder agent", "Implement features. Coordinate via hooks.", "coder")
Task("Tester agent", "Write tests. Check memory for API contracts.", "tester")

// MCP tools (OPTIONAL for coordination setup)
mcp__claude-flow__agent_spawn({ type: "researcher" })
```

**Tour Insight**: MCP coordinates, Claude Code Task tool executes.

---

## Tour Stop 6: docs/ (Learning Documentation)

**Location**: `/Users/splurfa/common-thread-sandbox/docs/`

**What It Is**: Structured documentation organized by workflow stage

**Why Visit**:
- Follow the learning path
- Understand system architecture
- Troubleshoot issues
- Reference capabilities

**Documentation Structure**:
```
docs/
├── README.md           # Documentation overview
├── setup/              # Getting started (4 docs)
│   ├── quick-start.md
│   ├── orientation.md
│   ├── what-is-claude-flow.md
│   └── cross-model-compatibility.md
├── operate/            # Daily workflows (9 docs)
│   ├── session-management.md
│   ├── first-session.md
│   ├── memory-basics.md
│   └── troubleshooting.md
├── build/              # Creation & extension (5 docs)
│   ├── spawning-agents.md
│   ├── create-skills.md
│   └── custom-agents.md
├── coordinate/         # Multi-agent orchestration (9 docs)
│   ├── swarm-topologies.md
│   ├── hive-mind.md
│   └── consensus-mechanisms.md
└── reference/          # Architecture & catalogs (4 docs)
    ├── architecture.md
    ├── agent-catalog.md
    └── what-actually-works.md
```

**Learning Path**:
1. **Setup** - Quick start, orientation, what is claude-flow?
2. **Operate** - Session management, first session, memory basics
3. **Build** - Spawning agents, create skills, custom agents
4. **Coordinate** - Swarm topologies, hive-mind, consensus
5. **Reference** - Architecture, agent catalog, limitations

**Tour Insight**: Follow the documentation lifecycle - Setup → Operate → Build → Coordinate → Reference.

---

## Tour Stop 7: .swarm/backups/ (Session History)

**Location**: `/Users/splurfa/common-thread-sandbox/.swarm/backups/`

**What It Is**: Point-in-time session snapshots with full context (49 backups, avg 2.1MB each)

**Why Visit**:
- See past session work
- Understand session closeout
- Learn backup structure
- Restore previous context

**Backup Format**:
```json
{
  "session_id": "session-20251114-120000-api-development",
  "closed_at": "2025-11-14T18:30:00Z",
  "summary": "Built REST API with JWT authentication...",
  "artifacts": {
    "code": ["server.js", "auth.js"],
    "tests": ["server.test.js"],
    "docs": ["API.md"]
  },
  "memory_snapshot": {...},
  "metrics": {
    "files_created": 12,
    "tests_written": 8,
    "lines_of_code": 456
  }
}
```

**How to Use**:
```bash
# List backups
ls -lt .swarm/backups/

# View backup
cat .swarm/backups/session-20251114-120000-api-development.json

# Restore context (via hooks)
npx claude-flow@alpha hooks session-restore --session-id "session-20251114-120000-api"
```

**Tour Insight**: Backups are your audit trail - use them to review past work and restore context.

---

## Tour Stop 8: .hive-mind/ (Queen Coordination)

**Location**: `/Users/splurfa/common-thread-sandbox/.hive-mind/`

**What It Is**: Hive-Mind coordination system with queen-based collective intelligence (3.5MB)

**Why Visit**:
- Understand queen-based coordination
- See consensus mechanisms
- Learn collective intelligence patterns
- View hive memory

**Structure**:
```
.hive-mind/
├── hive.db             # SQLite coordination database (364KB)
├── hive.db-wal         # Write-ahead log (3.2MB)
├── sessions/           # 25 coordination sessions
├── config/             # Hive configuration
├── backups/            # Hive state backups
├── logs/               # Coordination logs
└── memory/             # Hive memory storage
```

**Features**:
- **Queen selection** (strategic, tactical, adaptive)
- **Worker specialization** (task-specific agents)
- **Scout exploration** (discovery and research)
- **Memory manager** (collective memory)
- **Consensus building** (majority, weighted, Byzantine)

**Consensus Types**:
1. **Majority** - Simple voting (>50%)
2. **Weighted** - Vote by expertise
3. **Byzantine** - BFT consensus (2/3+ majority, tolerates faulty nodes)

**How to Use**:
```bash
# Launch hive-mind wizard
npx claude-flow@alpha hive-mind:wizard
```

**Tour Insight**: Hive-Mind is for complex multi-agent coordination requiring consensus and collective intelligence.

---

## Tour Stop 9: .claude/settings.json (Hook Configuration)

**Location**: `/Users/splurfa/common-thread-sandbox/.claude/settings.json`

**What It Is**: Native Claude Code hooks configuration (auto-fire coordination)

**Why Visit**:
- Understand hook system
- See auto-fire configuration
- Learn pre/post operation patterns
- View native integration

**Configuration Example**:
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
        "hooks": [{
          "type": "command",
          "command": "npx claude-flow@alpha hooks pre-edit --file '{}'"
        }]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
        "hooks": [{
          "type": "command",
          "command": "npx claude-flow@alpha hooks post-edit --file '{}'"
        }]
      }
    ]
  }
}
```

**Hook Types**:
- **PreToolUse** - Before operations (validates session, prepares resources)
- **PostToolUse** - After operations (updates memory, tracks metrics, creates backups)

**Stock Adherence**: 98% (uses stock claude-flow CLI + Claude Code native hooks)

**Tour Insight**: Hooks auto-fire coordination - you don't need to manually call them.

---

## Bonus Stop: sessions/captains-log/ (Decision Journal)

**Location**: `/Users/splurfa/common-thread-sandbox/sessions/captains-log/`

**What It Is**: Human-readable narrative of decisions, insights, and blockers

**Why Visit**:
- See decision rationale
- Learn from past mistakes
- Understand architecture choices
- Track project evolution

**Format**:
```markdown
# 2025-11-14

## Session: REST API Development
**Decision**: Chose JWT over session cookies for authentication
**Why**: Better for mobile clients and microservices architecture
**Trade-off**: More complex token refresh logic

## Blocker: Database Schema Migration
**Problem**: Prisma migration failing on existing data
**Solution**: Two-phase migration with data transformation script
**Lesson**: Always test migrations on production-like data volume
```

**Updates**: After session closeout (HITL approved summaries only)

**Tour Insight**: Captain's Log is your team's institutional memory - it explains WHY decisions were made.

---

## Quick Reference: Tour Stops by Use Case

### "I'm brand new - where do I start?"
1. **CLAUDE.md** - Read the constitution
2. **docs/setup/quick-start.md** - 15-minute quick start
3. **tutor-mode** skill - Guided learning
4. **docs/operate/first-session.md** - Your first session

### "I want to understand how it works"
1. **docs/reference/architecture.md** - System architecture
2. **.swarm/memory.db** - See the brain
3. **.claude/settings.json** - Hook configuration
4. **CLAUDE.md** - Rules and protocols

### "I need to do work"
1. **sessions/** - Create your workspace
2. **.claude/agents/** - Find the right agent
3. **.claude/skills/** - Use available skills
4. **.swarm/memory.db** - Coordinate via memory

### "I want to learn advanced patterns"
1. **tutor-mode** skill - Phases 3-4
2. **docs/coordinate/** - Multi-agent orchestration
3. **.hive-mind/** - Queen coordination
4. **docs/reference/what-actually-works.md** - Reality check

### "Something's broken - help!"
1. **docs/operate/troubleshooting.md** - Common issues
2. **sessions/captains-log/** - Past solutions
3. **.swarm/backups/** - Session history
4. **CLAUDE.md** - Verify you're following rules

---

## Tour Navigation Tips

### 1. Always Start with CLAUDE.md
It's the "source of truth" for all workspace behavior.

### 2. Follow the File Routing Rules
ALL new files → `sessions/<session-id>/artifacts/`
NEVER write to root directories.

### 3. Use Meta-Skill for Discovery
Don't memorize all 32 skills - let meta-skill route you.

### 4. Check Memory Before Acting
See what agents already know via memory search.

### 5. Learn from Captain's Log
Past decisions contain valuable context.

### 6. Respect Session Boundaries
ONE SESSION = ONE CHAT THREAD.

### 7. Trust the Hooks
Auto-fire coordination handles memory updates.

### 8. Start with Tutor Mode
Guided learning beats trial-and-error.

### 9. Read What Actually Works
Honest assessment of current capabilities.

### 10. Ask for Help
Use `/tutor help` or `docs/operate/troubleshooting.md`.

---

## Interactive Tour Commands

### Self-Guided Tour:
```bash
# Start learning path
/tutor start

# Explore skills
/meta menu

# Your first session
# (Follow docs/operate/first-session.md)

# View session structure
ls -la sessions/

# Check memory
sqlite3 .swarm/memory.db "SELECT * FROM agent_memory LIMIT 10"

# Read Captain's Log
cat sessions/captains-log/$(date +%Y-%m-%d).md
```

### Quick Commands:
```bash
# List all skills
/meta list

# Search for capability
/meta search <query>

# Get help on topic
/tutor explain <topic>

# Check system status
npx claude-flow@alpha hooks memory --action list
```

---

## Tour Statistics

**Total Stops**: 9 essential + 1 bonus
**Time to Complete**: 2-3 hours (comprehensive), 30 minutes (highlights)
**Prerequisites**: None - designed for complete beginners
**Next Steps**: Follow tutor-mode learning phases

---

## Post-Tour Actions

### Beginner Path (Next Steps):
1. Complete tutor-mode Phase 1 (Foundations)
2. Try your first session (docs/operate/first-session.md)
3. Spawn 3 agents in parallel
4. Practice memory coordination
5. Close your first session

### Intermediate Path (Build Something):
1. Build a 5-agent project (blog platform)
2. Implement memory handoffs
3. Practice swarm topologies
4. Use quality gates
5. Archive and review

### Advanced Path (Master Coordination):
1. Hive-mind with consensus
2. Byzantine Fault Tolerance
3. Adaptive topology switching
4. ReasoningBank self-learning
5. Build production system

---

## Related Documentation

- [Workspace Inventory](./workspace-inventory.md) - Complete directory catalog
- [Skills Catalog](./skills-catalog.md) - All 32 skills detailed
- [Features Catalog](./features-catalog.md) - System capabilities
- [System Architecture](../../../docs/reference/architecture.md) - How it works
- [Quick Start Guide](../../../docs/setup/quick-start.md) - 15-minute guide

---

## Tour Completion Checklist

After completing the tour, you should be able to:

- [ ] Locate and read CLAUDE.md
- [ ] Understand "ONE SESSION = ONE CHAT THREAD"
- [ ] Know where all new files go (session artifacts)
- [ ] Find and invoke skills via meta-skill
- [ ] Spawn agents using Task tool
- [ ] Use memory for coordination
- [ ] Read and understand Captain's Log
- [ ] Close a session with HITL approval
- [ ] Follow the learning path (Setup → Operate → Build → Coordinate)
- [ ] Troubleshoot common issues

**If you checked all boxes**: You're ready to start building!

**If not**: Revisit the tour stops you're unsure about, or ask for help via `/tutor help`.

---

**Welcome to the workspace! May your agents coordinate efficiently and your sessions close cleanly.** 🚀

*Generated: 2025-11-21*
*Tour Version: 1.0*
*Maintained by: tour-guide-skill*
