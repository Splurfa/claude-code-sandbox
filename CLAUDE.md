# Claude Code Configuration - SPARC Development Environment

> **⚠️ Important:** This is a **claude-flow+ (custom extended) workspace**, not stock claude-flow.
> - **Architecture**: See [Workspace Architecture Explained](docs/reference/architecture.md)
> - **Session Management**: See [Session Management Explained](docs/operate/session-management.md)
> - **File Routing**: See [Quick Start Guide](docs/setup/quick-start.md)
> - **Stock-First Score**: 92/100 (Architecture is Stock Claude Flow / Customizations are additive skills & protocols)

---

## 📋 SESSION MANAGEMENT PROTOCOL

**User-initiated session commands:**
- `/session-start <topic>` - Create new session
- `/session-closeout` - End current session (with HITL approval)

**Session structure:**
1. Session ID: `session-$(date +%Y%m%d-%H%M%S)-<topic>`
2. Directory: `sessions/$SESSION_ID/artifacts/{code,tests,docs,scripts,notes}/`
3. **ALL FILES GO TO:** `sessions/$SESSION_ID/artifacts/` subdirectories

**NEVER** write to root `tests/`, `docs/`, `scripts/` - only to session artifacts!

**For full session protocol**, see [Session Management Explained](docs/operate/session-management.md)

### 📋 SESSION SCOPE & LIFECYCLE

**ONE SESSION = ONE CHAT THREAD** (not per task, not per agent)

**Key Rules:**
- New chat → Auto-create `sessions/session-YYYYMMDD-HHMMSS-<topic>/`
- ALL work → `sessions/$SESSION_ID/artifacts/{code,tests,docs,scripts,notes}/`
- Chat ends → Session closeout → Archive to `.swarm/backups/`

**Agent Integration:**
When spawning agents, include session path: `Task("Agent", "Task. Save to sessions/$SESSION_ID/artifacts/code/.", "type")`

**Full lifecycle documentation**: See [Session Management Explained](docs/operate/session-management.md)

### 📊 FINDINGS TRACKING SYSTEM

**Architecture**: JSON Database + Generated Views (matches Pattern Database pattern)

**Centralized Database**: `sessions/findings/.database/findings.json` (4.3 KB, 10 findings)
- **Source of Truth**: JSON for programmatic access via jq
- **Generated Views**:
  - `findings-log.md` - Chronological timeline (newest first)
  - `README.md` - Auto-generated statistics dashboard
- **Preserved**: Individual FINDING-*.md files for rich content and git history

**Key Features**:
- ✅ 100% automatic statistics (zero manual updates)
- ✅ Scales to 1000+ findings
- ✅ Programmatic queries via jq
- ✅ Auto-created by pattern database (threshold: 3 occurrences)
- ✅ Git-friendly (individual files preserved)

**Commands**:
```bash
# Create new finding (auto-stores in JSON)
bash sessions/findings/bin/findings create "Finding title" high bug system

# Generate views from JSON database
bash sessions/findings/bin/findings generate-log      # → findings-log.md
bash sessions/findings/bin/findings generate-stats    # → README.md

# Update finding status
bash sessions/findings/bin/findings update-status FINDING-001 "In Progress"

# Query findings
bash sessions/findings/bin/findings list-json open
bash sessions/findings/bin/findings get FINDING-001
```

**Automatic Detection (Stop Hook)**:
```bash
# Configured in .claude/settings.json "Stop" hook
# Runs automatically on chat end:
/bin/bash .claude/hooks/session-end-with-issues.sh

# This wrapper:
# 1. Runs stock session-end hook (preserves behavior)
# 2. Detects current session ID (3 fallback strategies)
# 3. Runs finding detection with pattern tracking
# 4. Auto-creates findings via pattern database (threshold: 3)
# 5. Updates JSON database automatically
# 6. Stores results: .swarm/backups/last-issue-detection.json
# 7. Always exits 0 (non-blocking)
```

**Manual Closeout (HITL)**:
```bash
# Run slash command for HITL approval workflow:
/session-closeout

# Displays:
# - Pattern analysis summary
# - Findings created (if any)
# - Session summary
# - HITL approval request
```

**Pattern Database Integration**: `sessions/findings/.database/patterns.json`
- File-backed JSON storage (not MCP memory)
- Tracks: session-naming, file-routing, incomplete-tasks, doc-code-sync, etc.
- Auto-creates findings when threshold (3) is reached
- New findings automatically stored in `findings.json`
- Commands: `bash sessions/findings/bin/pattern-db [store|get|increment|list|stats]`

**Detection Criteria**:
- Recurring corrections (>2 occurrences)
- Protocol violations (session naming, file routing)
- Documentation-code sync gaps
- Test failures or false positives
- Incomplete outputs
- User corrections in session summary

**Finding Categories**:
- **System**: Fix in automation, tooling, configuration (70%)
- **User**: Adjust workflow, habits, understanding (30%)
- **Hybrid**: Both system and user changes needed (20%)

**Current Statistics** (auto-generated from JSON):
- **Total**: 10 findings
- **Open**: 9 (90%)
- **In Progress**: 1 (10%) - FINDING-004
- **Resolved**: 0 (0%)
- **By Priority**: 1 critical, 4 high, 3 medium, 2 low

**Testing**: Run comprehensive test suite
```bash
bash sessions/findings/tests/integration/test-integration.sh
# Tests: pattern tracking, threshold triggering, JSON database, view generation
```

**For full details**: See [sessions/findings/docs/README.md](sessions/findings/docs/README.md) (auto-generated)

---

## 🚨 CRITICAL: CONCURRENT EXECUTION & FILE MANAGEMENT

**ABSOLUTE RULES**:
1. ALL operations MUST be concurrent/parallel in a single message
2. **NEVER save working files, text/mds and tests to the root folder**
3. ALWAYS organize files in appropriate subdirectories (session artifacts)
4. **USE CLAUDE CODE'S TASK TOOL** for spawning agents concurrently, not just MCP

### ⚡ GOLDEN RULE: "1 MESSAGE = ALL RELATED OPERATIONS"

**MANDATORY PATTERNS:**
- **TodoWrite**: ALWAYS batch ALL todos in ONE call (5-10+ todos minimum)
- **Task tool (Claude Code)**: ALWAYS spawn ALL agents in ONE message with full instructions
- **File operations**: ALWAYS batch ALL reads/writes/edits in ONE message
- **Bash commands**: ALWAYS batch ALL terminal operations in ONE message
- **Memory operations**: ALWAYS batch ALL memory store/retrieve in ONE message

### 🎯 CRITICAL: Claude Code Task Tool for Agent Execution

**Claude Code's Task tool is the PRIMARY way to spawn agents:**
```javascript
// ✅ CORRECT: Use Claude Code's Task tool for parallel agent execution
[Single Message]:
  Task("Research agent", "Analyze requirements and patterns...", "researcher")
  Task("Coder agent", "Implement core features...", "coder")
  Task("Tester agent", "Create comprehensive tests...", "tester")
  Task("Reviewer agent", "Review code quality...", "reviewer")
  Task("Architect agent", "Design system architecture...", "system-architect")
```

**MCP tools are ONLY for coordination setup:**
- `mcp__claude-flow__swarm_init` - Initialize coordination topology
- `mcp__claude-flow__agent_spawn` - Define agent types for coordination
- `mcp__claude-flow__task_orchestrate` - Orchestrate high-level workflows

### 📁 File Organization Rules

**File Organization**: ALL working files MUST go to session artifacts:
- `sessions/$SESSION_ID/artifacts/code/` - Source code
- `sessions/$SESSION_ID/artifacts/tests/` - Tests
- `sessions/$SESSION_ID/artifacts/docs/` - Documentation
- `sessions/$SESSION_ID/artifacts/scripts/` - Scripts
- `sessions/$SESSION_ID/artifacts/notes/` - Notes

**Exception**: Only edit existing project files (`package.json`, `CLAUDE.md`, etc.) in their original locations.

**Full file routing rules**: See [Quick Start Guide](docs/setup/quick-start.md)

## 🤖 Subagent Usage Protocol

**SIMPLE RULE: 99% of substantive work uses subagents.**

**When to use subagents:**
- Multi-step research (3+ sources)
- Multiple deliverables (code + docs + tests)
- Complex analysis (strategic planning, architecture design)
- Cross-domain work (frontend + backend + database)
- Any project work

**When NOT to use subagents:**
- Trivial queries ("What color is a brown cat?")
- Simple clarifications
- Quick lookups

**For complex coordination:**
Nudge user: "This is a complex request. I recommend running `/hive-mind:wizard` to coordinate multiple agents with proper topology."

**Why this matters:**
- Hooks fire automatically during agent work
- Memory accumulates across sessions
- Coordination happens properly
- Learning system engages

## Project Overview

This project uses SPARC (Specification, Pseudocode, Architecture, Refinement, Completion) methodology with Claude-Flow orchestration for systematic Test-Driven Development.

## SPARC Commands

### Core Commands
- `npx claude-flow sparc modes` - List available modes
- `npx claude-flow sparc run <mode> "<task>"` - Execute specific mode
- `npx claude-flow sparc tdd "<feature>"` - Run complete TDD workflow
- `npx claude-flow sparc info <mode>` - Get mode details

### Batchtools Commands
- `npx claude-flow sparc batch <modes> "<task>"` - Parallel execution
- `npx claude-flow sparc pipeline "<task>"` - Full pipeline processing
- `npx claude-flow sparc concurrent <mode> "<tasks-file>"` - Multi-task processing

### Build Commands
- `npm run build` - Build project
- `npm run test` - Run tests
- `npm run lint` - Linting
- `npm run typecheck` - Type checking

## SPARC Workflow Phases

1. **Specification** - Requirements analysis (`sparc run spec-pseudocode`)
2. **Pseudocode** - Algorithm design (`sparc run spec-pseudocode`)
3. **Architecture** - System design (`sparc run architect`)
4. **Refinement** - TDD implementation (`sparc tdd`)
5. **Completion** - Integration (`sparc run integration`)

## Code Style & Best Practices

- **Modular Design**: Files under 500 lines
- **Environment Safety**: Never hardcode secrets
- **Test-First**: Write tests before implementation
- **Clean Architecture**: Separate concerns
- **Documentation**: Keep updated

## 🤝 Subagent Coordination

For substantive multi-agent work, use the hive mind wizard:

```bash
npx claude-flow@alpha hive-mind:wizard
```

**When to use:**
- Complex features requiring multiple specialists (backend + frontend + testing)
- Architecture decisions needing multiple perspectives
- Large refactors involving coordination

**When NOT to use:**
- Single-agent tasks (just do it yourself)
- Simple fixes or changes
- Quick analysis or reading code

The wizard handles agent spawning, coordination, and result consolidation automatically.

---

## 🚀 Available Agents (49 Total)

### Core Development
`coder`, `reviewer`, `tester`, `planner`, `researcher`

### Understanding Agent Definitions

**What Are Agent Definition Files?**

Agent definition files in `.claude/agents/` are **reference documentation** for agent types. They are NOT automatically loaded when you use the Task() tool, but they provide valuable information about agent capabilities and behavior.

**Key Concepts**:

1. **Agent Definitions vs Agent Types**:
   - **Agent definitions**: Reference documentation files (`.claude/agents/core/coder.md`)
   - **Agent types**: String identifiers used in Task() tool (`"coder"`, `"researcher"`)
   - Task() uses agent-type as semantic hint, NOT file reference

2. **What Agent Definitions Contain**:
   - YAML frontmatter: Metadata (name, type, capabilities, hooks)
   - Markdown content: Detailed prompts and instructions
   - Hooks examples: Reference examples (not automatically executed)
   - Capability descriptions: What the agent can do

3. **How to Use Agent Definitions**:
   - **Reference**: Check definitions to understand agent capabilities
   - **Documentation**: Learn what each agent type does
   - **Templates**: Use as templates when creating custom agents
   - **Coordination**: Reference hooks examples for coordination patterns

**Important**: Agent definitions are **reference documentation**, not runtime code. The Task() tool works independently and uses agent-type as a semantic hint to understand the role, not to load instructions from the definition file.

**Example Usage**:
```javascript
// Check agent definition for capabilities
Read: .claude/agents/core/coder.md

// Learn what coder agent does:
// - Code implementation
// - API design
// - Refactoring
// - Optimization
// - Error handling

// Use in Task() with semantic understanding
Task("Backend Developer", "Implement REST API. Save to sessions/$SESSION_ID/artifacts/code/.", "coder")
//                    ↑
//            Agent-type is semantic hint
//            NOT loaded from coder.md file
```

**Common Misconceptions**:

❌ **Wrong**: "Agent definitions are automatically loaded when I use Task()"
✅ **Correct**: "Agent definitions are reference documentation. Task() uses agent-type as semantic hint."

❌ **Wrong**: "I need to load agent definitions manually"
✅ **Correct**: "Agent definitions are optional reference material. Task() works without them."

❌ **Wrong**: "Agent definition hooks are automatically executed"
✅ **Correct**: "Agent definition hooks are examples. Workspace hooks in .claude/settings.json are executed."

**Best Practices**:

1. **Use as Reference**: Check agent definitions to understand capabilities
2. **Don't Expect Auto-Loading**: Task() works independently
3. **Learn Patterns**: Study hooks examples for coordination ideas
4. **Create Custom**: Use definitions as templates for custom agents
5. **Stay Stock-First**: Keep definitions as reference, don't modify core behavior

For more details, see the tutor-mode skill's "Understanding Agent Definitions" section.

## 🎓 Available Skills

### Learning & Discovery
- `tour-guide` - Interactive workspace tour tailored to proficiency level (beginner/intermediate/advanced/expert)
- `tutor-mode` - Hands-on interactive learning with exercises and practice
- `meta-skill` - Skill discovery and routing via natural language

### Advanced Features
(See `.claude/skills/` for complete skill catalog)

### Swarm Coordination
`hierarchical-coordinator`, `mesh-coordinator`, `adaptive-coordinator`, `collective-intelligence-coordinator`, `swarm-memory-manager`

### Consensus & Distributed
`byzantine-coordinator`, `raft-manager`, `gossip-coordinator`, `consensus-builder`, `crdt-synchronizer`, `quorum-manager`, `security-manager`

### Performance & Optimization
`perf-analyzer`, `performance-benchmarker`, `task-orchestrator`, `memory-coordinator`, `smart-agent`

### GitHub & Repository
`github-modes`, `pr-manager`, `code-review-swarm`, `issue-tracker`, `release-manager`, `workflow-automation`, `project-board-sync`, `repo-architect`, `multi-repo-swarm`

### SPARC Methodology
`sparc-coord`, `sparc-coder`, `specification`, `pseudocode`, `architecture`, `refinement`

### Specialized Development
`backend-dev`, `mobile-dev`, `ml-developer`, `cicd-engineer`, `api-docs`, `system-architect`, `code-analyzer`, `base-template-generator`

### Testing & Validation
`tdd-london-swarm`, `production-validator`

### Migration & Planning
`migration-planner`, `swarm-init`

## 🎯 Claude Code vs MCP Tools

### Claude Code Handles ALL EXECUTION:
- **Task tool**: Spawn and run agents concurrently for actual work
- File operations (Read, Write, Edit, MultiEdit, Glob, Grep)
- Code generation and programming
- Bash commands and system operations
- Implementation work
- Project navigation and analysis
- TodoWrite and task management
- Git operations
- Package management
- Testing and debugging

### MCP Tools ONLY COORDINATE:
- Swarm initialization (topology setup)
- Agent type definitions (coordination patterns)
- Task orchestration (high-level planning)
- Memory management
- Neural features
- Performance tracking
- GitHub integration

**KEY**: MCP coordinates the strategy, Claude Code's Task tool executes with real agents.

## 🚀 Quick Setup

```bash
# Add MCP servers (Claude Flow required, others optional)
claude mcp add claude-flow npx claude-flow@alpha mcp start
claude mcp add ruv-swarm npx ruv-swarm mcp start  # Optional: Enhanced coordination
claude mcp add flow-nexus npx flow-nexus@latest mcp start  # Optional: Cloud features
```

## MCP Tool Categories

### Coordination
`swarm_init`, `agent_spawn`, `task_orchestrate`

### Monitoring
`swarm_status`, `agent_list`, `agent_metrics`, `task_status`, `task_results`

### Memory & Neural
`memory_usage`, `neural_status`, `neural_train`, `neural_patterns`

### GitHub Integration
`github_swarm`, `repo_analyze`, `pr_enhance`, `issue_triage`, `code_review`

### System
`benchmark_run`, `features_detect`, `swarm_monitor`

### Flow-Nexus MCP Tools (Optional Advanced Features)
Flow-Nexus extends MCP capabilities with 70+ cloud-based orchestration tools:

**Key MCP Tool Categories:**
- **Swarm & Agents**: `swarm_init`, `swarm_scale`, `agent_spawn`, `task_orchestrate`
- **Sandboxes**: `sandbox_create`, `sandbox_execute`, `sandbox_upload` (cloud execution)
- **Templates**: `template_list`, `template_deploy` (pre-built project templates)
- **Neural AI**: `neural_train`, `neural_patterns`, `seraphina_chat` (AI assistant)
- **GitHub**: `github_repo_analyze`, `github_pr_manage` (repository management)
- **Real-time**: `execution_stream_subscribe`, `realtime_subscribe` (live monitoring)
- **Storage**: `storage_upload`, `storage_list` (cloud file management)

**Authentication Required:**
- Register: `mcp__flow-nexus__user_register` or `npx flow-nexus@latest register`
- Login: `mcp__flow-nexus__user_login` or `npx flow-nexus@latest login`
- Access 70+ specialized MCP tools for advanced orchestration

## 🚀 Agent Execution Flow with Claude Code

### The Correct Pattern:

1. **Optional**: Use MCP tools to set up coordination topology
2. **REQUIRED**: Use Claude Code's Task tool to spawn agents that do actual work
3. **REQUIRED**: Each agent runs hooks for coordination
4. **REQUIRED**: Batch all operations in single messages

### Example Full-Stack Development:

```javascript
// Single message with all agent spawning via Claude Code's Task tool
[Parallel Agent Execution]:
  Task("Backend Developer", "Build REST API with Express. Save to sessions/$SESSION_ID/artifacts/code/. Use hooks for coordination.", "backend-dev")
  Task("Frontend Developer", "Create React UI. Save to sessions/$SESSION_ID/artifacts/code/. Coordinate with backend via memory.", "coder")
  Task("Database Architect", "Design PostgreSQL schema. Save to sessions/$SESSION_ID/artifacts/code/. Store schema in memory.", "code-analyzer")
  Task("Test Engineer", "Write Jest tests to sessions/$SESSION_ID/artifacts/tests/. Check memory for API contracts.", "tester")
  Task("DevOps Engineer", "Setup Docker and CI/CD. Save configs to sessions/$SESSION_ID/artifacts/scripts/. Document in memory.", "cicd-engineer")
  Task("Security Auditor", "Review authentication. Report findings to sessions/$SESSION_ID/artifacts/docs/. Report via hooks.", "reviewer")

  // All todos batched together
  TodoWrite { todos: [...8-10 todos...] }

  // All file operations together
  Write "sessions/$SESSION_ID/artifacts/code/server.js"
  Write "sessions/$SESSION_ID/artifacts/code/App.jsx"
  Write "sessions/$SESSION_ID/artifacts/code/schema.sql"
```

## 📋 Agent Coordination Protocol

### Every Agent Spawned via Task Tool MUST:

**1️⃣ BEFORE Work:**
```bash
npx claude-flow@alpha hooks pre-task --description "[task]"
npx claude-flow@alpha hooks session-restore --session-id "swarm-[id]"
```

**2️⃣ DURING Work:**
```bash
npx claude-flow@alpha hooks post-edit --file "[file]" --memory-key "swarm/[agent]/[step]"
npx claude-flow@alpha hooks notify --message "[what was done]"
```

**3️⃣ AFTER Work:**
```bash
npx claude-flow@alpha hooks post-task --task-id "[task]"
npx claude-flow@alpha hooks session-end --export-metrics true
```

## 🎯 Concurrent Execution Examples

### ✅ CORRECT WORKFLOW: MCP Coordinates, Claude Code Executes

```javascript
// Step 1: MCP tools set up coordination (optional, for complex tasks)
[Single Message - Coordination Setup]:
  mcp__claude-flow__swarm_init { topology: "mesh", maxAgents: 6 }
  mcp__claude-flow__agent_spawn { type: "researcher" }
  mcp__claude-flow__agent_spawn { type: "coder" }
  mcp__claude-flow__agent_spawn { type: "tester" }

// Step 2: Claude Code Task tool spawns ACTUAL agents that do the work
[Single Message - Parallel Agent Execution]:
  // Claude Code's Task tool spawns real agents concurrently
  Task("Research agent", "Analyze API requirements and best practices. Check memory for prior decisions.", "researcher")
  Task("Coder agent", "Implement REST endpoints with authentication. Coordinate via hooks.", "coder")
  Task("Database agent", "Design and implement database schema. Store decisions in memory.", "code-analyzer")
  Task("Tester agent", "Create comprehensive test suite with 90% coverage.", "tester")
  Task("Reviewer agent", "Review code quality and security. Document findings.", "reviewer")
  
  // Batch ALL todos in ONE call
  TodoWrite { todos: [
    {id: "1", content: "Research API patterns", status: "in_progress", priority: "high"},
    {id: "2", content: "Design database schema", status: "in_progress", priority: "high"},
    {id: "3", content: "Implement authentication", status: "pending", priority: "high"},
    {id: "4", content: "Build REST endpoints", status: "pending", priority: "high"},
    {id: "5", content: "Write unit tests", status: "pending", priority: "medium"},
    {id: "6", content: "Integration tests", status: "pending", priority: "medium"},
    {id: "7", content: "API documentation", status: "pending", priority: "low"},
    {id: "8", content: "Performance optimization", status: "pending", priority: "low"}
  ]}
  
  // Parallel file operations in session artifacts
  Bash "mkdir -p sessions/$SESSION_ID/artifacts/{code,tests,docs,scripts}"
  Write "sessions/$SESSION_ID/artifacts/code/package.json"
  Write "sessions/$SESSION_ID/artifacts/code/server.js"
  Write "sessions/$SESSION_ID/artifacts/tests/server.test.js"
  Write "sessions/$SESSION_ID/artifacts/docs/API.md"
```

### ❌ WRONG (Multiple Messages):
```javascript
Message 1: mcp__claude-flow__swarm_init
Message 2: Task("agent 1")
Message 3: TodoWrite { todos: [single todo] }
Message 4: Write "sessions/$SESSION_ID/artifacts/code/file.js"
// This breaks parallel coordination!
```

## Performance Benefits

- **84.8% SWE-Bench solve rate**
- **32.3% token reduction**
- **2.8-4.4x speed improvement**
- **27+ neural models**

## Hooks Integration

### Available Hooks (Stock Claude-Flow)

**Manual invocation via CLI:**
```bash
# Pre-task hook
npx claude-flow@alpha hooks pre-task --description "Build API" --task-id "task-1"

# Post-task hook
npx claude-flow@alpha hooks post-task --task-id "task-1" --status "completed"

# Memory operations (via MCP tool, NOT hooks)
# Use: mcp__claude-flow_alpha__memory_usage({ action: "store", key: "decision", value: "data", namespace: "default" })
# Use: mcp__claude-flow_alpha__memory_usage({ action: "retrieve", key: "decision", namespace: "default" })

# Session closeout
npx claude-flow@alpha hooks session-end --export-metrics true
```

**Auto-Fire via Claude Code Native Hooks**

Hooks auto-fire through Claude Code's native hook system configured in `.claude/settings.json`:

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

**Stock Adherence:** 98% - All hooks via Claude Code native system + stock CLI

**Note:** `.claude/hooks/auto-hooks.js` is deprecated (violated stock-first via filesystem monkey-patching). See `.claude/hooks/README.md` for migration guide.

### What Hooks Do

**Pre-Operation:**
- Validate session exists
- Prepare resources
- Track task start

**Post-Operation:**
- Update memory
- Track metrics
- Create backups

**Session Management:**
- Generate summaries
- Export metrics
- Create session snapshots

## Advanced Features (v2.0.0)

- 🚀 Automatic Topology Selection
- ⚡ Parallel Execution (2.8-4.4x speed)
- 🧠 Neural Training
- 📊 Bottleneck Analysis
- 🤖 Smart Auto-Spawning
- 🛡️ Self-Healing Workflows
- 💾 Cross-Session Memory
- 🔗 GitHub Integration

## Integration Tips

1. Start with basic swarm init
2. Scale agents gradually
3. Use memory for context
4. Monitor progress regularly
5. Train patterns from success
6. Enable hooks automation
7. Use GitHub tools first

## Support

- Documentation: https://github.com/ruvnet/claude-flow
- Issues: https://github.com/ruvnet/claude-flow/issues
- Flow-Nexus Platform: https://flow-nexus.ruv.io (registration required for cloud features)

---

Remember: **Claude Flow coordinates, Claude Code creates!**

---

# Custom Features Reference

## Workspace Architecture

See [Workspace Architecture Explained](docs/reference/architecture.md) for complete overview, compliance analysis, and stock vs custom comparison.

## Core Concepts

This workspace includes custom extensions. For detailed documentation:

- **Session Management**: [Session Management Explained](docs/operate/session-management.md)
- **File Routing**: [Quick Start Guide](docs/setup/quick-start.md)
- **System Architecture**: [Architecture Overview](docs/reference/architecture.md)
- **Memory & Coordination**: [Memory Coordination Guide](docs/operate/memory-coordination-tutorial.md)
- **Swarm Coordination**: [Swarm Coordination Guide](docs/coordinate/swarm-coordination.md)

## Stock Claude-Flow Features

**Memory Storage** (`.swarm/memory.db`):

⚠️ **Important**: Memory operations use MCP tools, NOT hooks commands.

```javascript
// Store data
mcp__claude-flow_alpha__memory_usage({
  action: "store",
  key: "key",
  value: "data",
  namespace: "default"
})

// Retrieve data
mcp__claude-flow_alpha__memory_usage({
  action: "retrieve",
  key: "key",
  namespace: "default"
})

// List entries
mcp__claude-flow_alpha__memory_usage({
  action: "list",
  namespace: "default"
})

// Search with pattern
mcp__claude-flow_alpha__memory_usage({
  action: "search",
  pattern: "pattern%",
  namespace: "default"
})
```

**Hooks System**:
```bash
npx claude-flow@alpha hooks pre-task --description "task" --task-id "id"
npx claude-flow@alpha hooks post-task --task-id "id" --status "completed"
npx claude-flow@alpha hooks session-end --export-metrics true
```

**Session Backups**: Auto-created at `.swarm/backups/session-*.json` via session-end hook

---

## 📥 External Agent Integration

The `inbox/` directory contains workspaces for external agents contributing to the project:

- **`inbox/gemini-agent/`** - Google Gemini model contributions and validations
- **`inbox/codex-agent/`** - OpenAI Codex contributions
- **`inbox/cursor-agent/`** - Cursor editor agent contributions
- **`inbox/assistant/`** - General assistant contributions
- **`inbox/user/`** - User-provided materials and external imports

**Protocol for Claude Code:**
- Claude Code should **NOT** modify files in `inbox/` directories unless explicitly directed by the user
- Each external agent workspace should have a README.md marking it as external
- Integration of external work happens only when user explicitly requests synthesis
- This ensures clean separation between different AI systems and prevents conflicts

---

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.
Never save working files, text/mds and tests to the root folder.

---

## 📚 Documentation & Learning

**Essential Documentation:**

- **[Quick Start Guide](docs/setup/quick-start.md)** - Get started with sessions and file routing
- **[Session Management](docs/operate/session-management.md)** - Complete session lifecycle guide
- **[Agent Spawning](docs/build/spawning-agents.md)** - How to spawn and coordinate agents
- **[Memory Coordination](docs/operate/memory-coordination-tutorial.md)** - Using memory for agent coordination
- **[Troubleshooting Guide](docs/operate/troubleshooting.md)** - Common issues and solutions

**Learning Path:**

See the [Documentation Overview](docs/README.md) for the complete learning journey organized by workflow stage:
- **Setup** - Getting started, orientation, installation
- **Operate** - Daily workflows, session management, memory usage
- **Build** - Creating agents, custom skills, extending the system
- **Coordinate** - Multi-agent orchestration, swarm patterns, consensus
- **Reference** - Architecture, agent catalog, API reference

