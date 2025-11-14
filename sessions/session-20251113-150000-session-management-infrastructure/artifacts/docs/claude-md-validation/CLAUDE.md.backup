# Claude Code Configuration - SPARC Development Environment

## 🚨 CRITICAL: AUTOMATIC SESSION MANAGEMENT

**ON FIRST MESSAGE IN NEW CHAT:**
1. Auto-generate session ID: `session-$(date +%Y%m%d-%H%M%S)-<topic>`
2. Auto-create: `sessions/$SESSION_ID/artifacts/{code,tests,docs,scripts,notes}`
3. Auto-initialize metadata and session-summary.md
4. **ALL FILES GO TO:** `sessions/$SESSION_ID/artifacts/` subdirectories

**NEVER** write to root `tests/`, `docs/`, `scripts/` - only to session artifacts!

See "Session Artifacts & Collaborative Closeout" section for full protocol.

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

**NEVER save to root folder. Use these directories:**
- `/src` - Source code files
- `/tests` - Test files
- `/docs` - Documentation and markdown files
- `/config` - Configuration files
- `/scripts` - Utility scripts
- `/examples` - Example code

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

## 🚀 Available Agents (54 Total)

### Core Development
`coder`, `reviewer`, `tester`, `planner`, `researcher`

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
  Task("Backend Developer", "Build REST API with Express. Use hooks for coordination.", "backend-dev")
  Task("Frontend Developer", "Create React UI. Coordinate with backend via memory.", "coder")
  Task("Database Architect", "Design PostgreSQL schema. Store schema in memory.", "code-analyzer")
  Task("Test Engineer", "Write Jest tests. Check memory for API contracts.", "tester")
  Task("DevOps Engineer", "Setup Docker and CI/CD. Document in memory.", "cicd-engineer")
  Task("Security Auditor", "Review authentication. Report findings via hooks.", "reviewer")
  
  // All todos batched together
  TodoWrite { todos: [...8-10 todos...] }
  
  // All file operations together
  Write "backend/server.js"
  Write "frontend/App.jsx"
  Write "database/schema.sql"
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
  
  // Parallel file operations
  Bash "mkdir -p app/{src,tests,docs,config}"
  Write "app/package.json"
  Write "app/src/server.js"
  Write "app/tests/server.test.js"
  Write "app/docs/API.md"
```

### ❌ WRONG (Multiple Messages):
```javascript
Message 1: mcp__claude-flow__swarm_init
Message 2: Task("agent 1")
Message 3: TodoWrite { todos: [single todo] }
Message 4: Write "file.js"
// This breaks parallel coordination!
```

## Performance Benefits

- **84.8% SWE-Bench solve rate**
- **32.3% token reduction**
- **2.8-4.4x speed improvement**
- **27+ neural models**

## Hooks Integration

### Pre-Operation
- Auto-assign agents by file type
- Validate commands for safety
- Prepare resources automatically
- Optimize topology by complexity
- Cache searches

### Post-Operation
- Auto-format code
- Train neural patterns
- Update memory
- Analyze performance
- Track token usage

### Session Management
- Generate summaries
- Persist state
- Track metrics
- Restore context
- Export workflows

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

# WORKSPACE LEARNING INFRASTRUCTURE

## The Three Principles

1. **Time-neutral** - All operations are on-demand via CLI commands. No scheduled tasks, no "daily" routines, no time-based triggers.
   - **Why:** Work when you're ready, not when a schedule dictates. Automation happens when you invoke it.

2. **Scale-agnostic** - The system works identically whether managing 10 items or 10,000. Graceful degradation, no hard limits.
   - **Why:** Start small, scale naturally. No architectural rewrites as your project grows.

3. **Stock-first** - 95% stock claude-flow infrastructure, 5% thin wrappers for workflow. No custom frameworks, no reinvention.
   - **Why:** Leverage battle-tested tools. Updates are automatic, maintenance is minimal.

## Workspace Structure

Three storage systems working together:

1. **`.swarm/memory.db`** (SQLite - Stock)
   - **What:** Structured storage for agent memory, patterns, and coordination state
   - **When:** Cross-session context, swarm coordination, pattern learning
   - **Stock:** `claude-flow hooks memory` commands

2. **`sessions/captains-log/YYYY-MM-DD.md`** (Markdown - Stock)
   - **What:** Human-readable journal of decisions, insights, and blockers
   - **When:** Capturing "why" decisions were made, learning from past sessions
   - **Stock:** `claude-flow hooks journal` command (create-or-append by date)

3. **`.swarm/backups/`** (Archives - Stock)
   - **What:** Session snapshots with full context (memory + logs + metrics)
   - **When:** Session closeout, restore points for debugging/review
   - **Stock:** `claude-flow hooks session-end` creates timestamped JSON

**Data Flow:**
```
Session Work → Memory (structured) + Log (narrative)
                ↓
Session End → Backup (snapshot: memory + log + metrics)
                ↓
Next Session → Restore from backup OR query memory/log
```

## Session Artifacts & Collaborative Closeout

### AUTOMATIC SESSION INITIALIZATION (First Message in Chat)

**When a new chat starts, Claude Code MUST automatically:**

1. **Generate Session ID**
   ```bash
   SESSION_ID="session-$(date +%Y%m%d-%H%M%S)-<inferred-topic>"
   # Infer topic from first user message (2-3 words, lowercase-hyphenated)
   ```

2. **Create Session Structure** (single bash call)
   ```bash
   mkdir -p "sessions/$SESSION_ID/artifacts"/{code,tests,docs,scripts,notes} && \
   cat > "sessions/$SESSION_ID/metadata.json" <<EOF
   {
     "session_id": "$SESSION_ID",
     "created_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
     "status": "active"
   }
   EOF
   ```

3. **Initialize Session Summary**
   ```bash
   cat > "sessions/$SESSION_ID/session-summary.md" <<EOF
   # Session: $SESSION_ID
   **Started:** $(date)
   **Status:** Active
   ## Progress
   - Session initialized
   EOF
   ```

4. **Run Pre-Task Hook**
   ```bash
   npx claude-flow@alpha hooks pre-task --description "<first task>" --task-id "$SESSION_ID"
   ```

### FILE ROUTING RULES (Every File Operation)

**ALL file write operations MUST go to session artifacts:**

| Operation | Destination | Example |
|-----------|-------------|---------|
| Write code | `sessions/$SESSION_ID/artifacts/code/` | `sessions/.../artifacts/code/server.js` |
| Write tests | `sessions/$SESSION_ID/artifacts/tests/` | `sessions/.../artifacts/tests/server.test.js` |
| Write docs | `sessions/$SESSION_ID/artifacts/docs/` | `sessions/.../artifacts/docs/API.md` |
| Write scripts | `sessions/$SESSION_ID/artifacts/scripts/` | `sessions/.../artifacts/scripts/build.sh` |
| Write notes | `sessions/$SESSION_ID/artifacts/notes/` | `sessions/.../artifacts/notes/ideas.md` |

**NEVER write to root directories:** `tests/`, `docs/`, `scripts/`, or any file directly in project root (unless explicitly modifying existing project files like `package.json`, `CLAUDE.md`, etc.)

### SESSION TRACKING (During Work)

- **Auto summary**: During work, Claude Code maintains `sessions/<session-id>/artifacts/session-summary.md`, mirroring the chat-level narrative so you can review the session in one file without asking for it.
- **AgentDB + Reasoning Bank**: Hooks feed these stores continuously; they infer project links from natural-language context, so you never have to tag sessions manually.

### SESSION CLOSEOUT (When User Says "Done" or "Close Session")

**Closeout ritual** (always human-in-the-loop):
  1. Agents present the summary artifact plus an index of everything in `artifacts/`.
  2. You review/annotate and approve the summary; only approved text is copied into the Captain's Log and stored in memory.
  3. After approval, run the standard hooks (`post-task`, `session-end`) to archive `.swarm` state and freeze the session folder.

**Project promotion**: Once closeout is complete, you can instruct agents (in natural language) to move or copy any artifact into `docs/projects/<name>/...`. Those actions are logged automatically so project history stays linked back to the originating session.

## Session Closeout Flow

**High-level workflow** (on-demand, when ready to wrap up):

1. **Collect** - Gather session data
   ```bash
   npx claude-flow@alpha hooks session-end --generate-summary true
   ```

2. **Classify** - Organize findings (automatic categorization)

3. **HITL Confirm** - Review summary, approve archive

4. **Archive** - Store backup with timestamp

---

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.
Never save working files, text/mds and tests to the root folder.
