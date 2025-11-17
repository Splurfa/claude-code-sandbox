# Stock Claude-Flow Baseline Analysis

**Analysis Date:** 2025-11-15
**Stock Version:** claude-flow v2.7.35
**Source:** Official GitHub repository and CLI help output

---

## What is Stock Claude-Flow?

Stock claude-flow is the official, unmodified implementation from the `ruvnet/claude-flow` GitHub repository. It provides multi-agent coordination, memory management, and hooks automation through a standard CLI interface.

---

## Stock Initialization Process

### Official Init Command

```bash
npx claude-flow@alpha hive init [options]
```

**Options:**
- `--topology <type>` - Swarm topology (hierarchical, mesh, ring, star)
- `--consensus <type>` - Decision mechanism (quorum, unanimous, weighted, leader)
- `--max-agents <n>` - Maximum agents (default: 8)
- `--quality-threshold <n>` - Min quality 0-1 (default: 0.8)
- `--sparc` - Use SPARC methodology
- `--monitor` - Real-time monitoring
- `--background` - Run in background

### Created Directories

After running `npx claude-flow@alpha hive init`, stock creates:

```
project/
├── .claude-flow/          # Framework configuration
│   ├── config.json       # Swarm configuration
│   ├── topology.json     # Topology definition
│   └── agents/           # Agent definitions
├── .hive-mind/           # Hive coordination
│   ├── queen/            # Queen agent state
│   ├── workers/          # Worker agent states
│   ├── consensus/        # Consensus logs
│   └── memory/           # Shared memory
├── .swarm/               # Memory storage
│   ├── memory.db         # SQLite database
│   └── backups/          # Session snapshots
└── .claude-plugin/       # Plugin system (optional)
    └── plugins/          # Installed plugins
```

**Note:** The exact structure depends on topology and options selected.

---

## Stock Memory System

### Database Schema

**Location:** `.swarm/memory.db`

**Stock Tables:**

1. **`memory_entries`** - Key-value storage
   ```sql
   CREATE TABLE memory_entries (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     key TEXT UNIQUE NOT NULL,
     value TEXT,
     created_at TEXT DEFAULT CURRENT_TIMESTAMP,
     updated_at TEXT DEFAULT CURRENT_TIMESTAMP
   );
   ```

2. **`patterns`** - Learned patterns
   ```sql
   CREATE TABLE patterns (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     pattern_hash TEXT UNIQUE NOT NULL,
     pattern_data TEXT,
     success_count INTEGER DEFAULT 0,
     usage_count INTEGER DEFAULT 0,
     created_at TEXT DEFAULT CURRENT_TIMESTAMP
   );
   ```

3. **`pattern_embeddings`** - Hash-based embeddings
   ```sql
   CREATE TABLE pattern_embeddings (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     pattern_id INTEGER,
     embedding_vector TEXT,  -- JSON array of 1024 floats
     created_at TEXT DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (pattern_id) REFERENCES patterns(id)
   );
   ```

4. **`pattern_links`** - Pattern relationships
   ```sql
   CREATE TABLE pattern_links (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     source_pattern_id INTEGER,
     target_pattern_id INTEGER,
     link_type TEXT,
     strength REAL DEFAULT 1.0,
     created_at TEXT DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (source_pattern_id) REFERENCES patterns(id),
     FOREIGN KEY (target_pattern_id) REFERENCES patterns(id)
   );
   ```

5. **`task_trajectories`** - ReasoningBank support (table schema provided, no scripts)
   ```sql
   CREATE TABLE task_trajectories (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     task_id TEXT NOT NULL,
     agent_id TEXT,
     query TEXT,
     trajectory_json TEXT,  -- JSON array of {state, action, outcome}
     started_at TEXT,
     ended_at TEXT,
     judge_label TEXT,      -- 'good' or 'bad'
     judge_conf REAL,       -- Confidence 0-1
     judge_reasons TEXT,    -- JSON array of reasons
     created_at TEXT DEFAULT CURRENT_TIMESTAMP
   );
   ```

**Stock Does NOT Provide:**
- Implementation scripts for ReasoningBank (trajectory collection, verdict judgment, distillation)
- Custom metrics or tracking tables
- AgentDB integration

---

## Stock Hooks System

### Available Hooks

Stock claude-flow provides these hooks via CLI:

```bash
npx claude-flow@alpha hooks <command> [options]
```

**Pre-Operation Hooks:**
- `pre-task --description "task" --task-id "id" [--agent-id "id"]`
- `pre-edit --file "path" [--auto-assign-agents] [--load-context]`
- `pre-bash --command "cmd" [--validate-safety] [--prepare-resources]`

**Post-Operation Hooks:**
- `post-task --task-id "id" [--status "status"]`
- `post-edit --file "path" [--format] [--update-memory]`
- `post-bash --command "cmd" [--track-metrics] [--store-results]`

**Session Hooks:**
- `session-start --session-id "id" [--restore-context]`
- `session-end [--generate-summary] [--persist-state] [--export-metrics]`

**Utility Hooks:**
- `notify --message "text" [--priority "level"]`
- `journal --entry "text" [--category "cat"]` (concept only, no implementation)
- `memory --action <store|retrieve|search|list> --key "key" [--value "data"]`

### Hook Behavior

**Manual Invocation Only:**
- Stock hooks must be called explicitly via CLI
- No automatic triggering on file operations
- No wrapper system included

**Output:**
- Hooks return JSON on success
- Exit code 0 for success, non-zero for errors
- Structured logging to `.swarm/hooks.log` (if enabled)

**Memory Integration:**
- Hooks automatically update `.swarm/memory.db`
- Pattern learning happens transparently
- Cross-session context preserved

---

## Stock Skills System

### Skills Structure

**Global Skills:** `~/.claude/skills/`
**Project Skills:** `<project>/.claude/skills/`

**Required Format:**
```markdown
---
name: skill-name
description: Brief description
version: 1.0.0
category: category
tags: [tag1, tag2]
---

# Skill Name

[Progressive disclosure content]
```

**Rules:**
- ✅ YAML frontmatter required
- ✅ Flat structure (no nested directories)
- ✅ Progressive disclosure (load on scroll/request)
- ✅ Single SKILL.md file per skill

### Stock Skills

**Documented Skills (may vary by version):**
- Basic agent coordination
- SPARC methodology modes
- GitHub integration patterns

**No Comprehensive List:** Stock does not document all included skills exhaustively.

---

## Stock MCP Servers

### Official MCP Servers

Stock claude-flow integrates with three official MCP servers:

1. **`claude-flow`** - Core orchestration
   ```bash
   claude mcp add claude-flow npx claude-flow@alpha mcp start
   ```
   - Swarm initialization
   - Agent spawning
   - Task orchestration
   - Memory management

2. **`ruv-swarm`** - Enhanced coordination
   ```bash
   claude mcp add ruv-swarm npx ruv-swarm mcp start
   ```
   - DAA (Decentralized Autonomous Agents)
   - Neural coordination
   - Advanced consensus
   - Performance benchmarking

3. **`flow-nexus`** - Cloud platform (optional)
   ```bash
   claude mcp add flow-nexus npx flow-nexus@latest mcp start
   ```
   - Cloud sandboxes
   - Neural training
   - Template marketplace
   - Authentication/payments

**Integration:**
- MCP servers expose tools to Claude
- Tools coordinate with local `.swarm/` state
- Hybrid local/cloud execution

---

## Stock Workflows

### Basic Swarm Workflow

```bash
# 1. Initialize hive mind
npx claude-flow@alpha hive init --topology mesh

# 2. Execute task with swarm
npx claude-flow@alpha hive "Build REST API with authentication"

# 3. Monitor progress (optional)
npx claude-flow@alpha hive status

# 4. Close session
npx claude-flow@alpha hooks session-end --export-metrics true
```

### SPARC Workflow

```bash
# Run full SPARC pipeline
npx claude-flow@alpha sparc tdd "User authentication feature"

# Or individual phases
npx claude-flow@alpha sparc run spec-pseudocode "Feature spec"
npx claude-flow@alpha sparc run architect "System design"
npx claude-flow@alpha sparc run refinement "TDD implementation"
```

### Memory Workflow

```bash
# Store decision
npx claude-flow@alpha hooks memory --action store \
  --key "project/auth-pattern" \
  --value "JWT with refresh tokens"

# Retrieve later
npx claude-flow@alpha hooks memory --action retrieve \
  --key "project/auth-pattern"

# Search memory
npx claude-flow@alpha hooks memory --action search \
  --pattern "authentication"
```

---

## Stock File Organization

### No Enforced Structure

Stock claude-flow does NOT enforce file organization:
- Files created wherever specified
- No artifact routing
- No session subdirectories
- Manual organization required

**Example:**
```bash
# User controls all paths
Write "src/server.js"
Write "tests/server.test.js"
Write "docs/API.md"
```

### State Storage Only

Stock uses `.swarm/` for state only:
- Memory database
- Session backups (JSON snapshots)
- Pattern library
- No source code or artifact storage

---

## Stock vs. No Stock Features

### What Stock PROVIDES

✅ Memory database with pattern learning
✅ Hooks system (manual invocation)
✅ Session backups (JSON snapshots)
✅ Multi-agent coordination
✅ SPARC methodology
✅ MCP integration
✅ Skills system (structure + interface)
✅ GitHub integration tools
✅ Neural training capabilities

### What Stock DOES NOT Provide

❌ Auto-fire hooks wrapper
❌ Session artifact organization
❌ File routing system
❌ Captain's Log implementation (journal hook concept only)
❌ ReasoningBank scripts (table schema only)
❌ AgentDB integration scripts
❌ Git checkpoint automation
❌ Session auto-initialization
❌ Custom agent patterns (users create their own)
❌ Comprehensive skill library (varies by version)

---

## Stock Configuration

### Environment Variables

Stock respects these env vars:

```bash
CLAUDE_FLOW_AUTO_COMMIT=false      # Auto-commit changes
CLAUDE_FLOW_AUTO_PUSH=false        # Auto-push commits
CLAUDE_FLOW_HOOKS_ENABLED=true     # Enable hooks system
CLAUDE_FLOW_TELEMETRY_ENABLED=true # Usage telemetry
CLAUDE_FLOW_REMOTE_EXECUTION=false # Remote execution
```

### Configuration Files

**`.claude-flow/config.json`** (created by hive init):
```json
{
  "topology": "mesh",
  "maxAgents": 8,
  "consensus": "quorum",
  "qualityThreshold": 0.8,
  "enableSparc": false,
  "enableMonitor": false
}
```

**No `settings.json`:** Stock does not use `.claude/settings.json` format.

---

## Stock Performance Benchmarks

**Official Metrics (from documentation):**
- **84.8% SWE-Bench solve rate** - Industry-leading code generation accuracy
- **32.3% token reduction** - Efficient context management
- **2.8-4.4x speed improvement** - Parallel execution vs sequential
- **27+ neural models** - WASM-accelerated ML inference

**Scale:**
- Handles 10K+ memory entries efficiently
- SQLite indexed queries <10ms
- WASM SIMD acceleration for embeddings
- Supports 100+ concurrent agents (cloud mode)

---

## Stock Update Process

### Updating Stock CLI

```bash
# Check current version
npx claude-flow@alpha --version

# Update to latest
npm update -g claude-flow@alpha

# Or force reinstall
npm install -g claude-flow@alpha --force
```

### Backward Compatibility

**Guaranteed Compatible:**
- ✅ Memory database schema (migrations handled automatically)
- ✅ Hooks interface (versioned, backward compatible)
- ✅ Session backup format (JSON, stable structure)

**May Change:**
- ⚠️ MCP tool signatures (follow semantic versioning)
- ⚠️ Skills YAML format (rare, documented in changelog)
- ⚠️ CLI command syntax (rare, with deprecation warnings)

---

## Stock Plugin System

### Plugin Architecture

**Location:** `.claude-plugin/plugins/`

**Installation:**
```bash
npx claude-flow@alpha plugin install <plugin-name>
npx claude-flow@alpha plugin list
npx claude-flow@alpha plugin remove <plugin-name>
```

**Plugin Structure:**
```
.claude-plugin/
└── plugins/
    └── my-plugin/
        ├── plugin.json      # Metadata
        ├── hooks/           # Hook implementations
        ├── skills/          # Plugin skills
        └── assets/          # Static assets
```

**Note:** Plugin system is documented but ecosystem is nascent (few public plugins).

---

## Stock GitHub Integration

### Available GitHub Tools (via MCP)

```bash
# Repository analysis
npx claude-flow@alpha github repo-analyze --repo "owner/repo"

# PR management
npx claude-flow@alpha github pr-manage --repo "owner/repo" --action review

# Issue triage
npx claude-flow@alpha github issue-track --repo "owner/repo" --action triage

# Release coordination
npx claude-flow@alpha github release-coord --repo "owner/repo" --version "1.0.0"
```

**Requires:**
- GitHub CLI (`gh`) installed
- Authenticated with `gh auth login`
- Repository access permissions

---

## Stock SPARC Modes

### Available Modes (17 total)

**Development:**
- `dev` - General development
- `api` - API development
- `ui` - UI development
- `test` - Testing
- `refactor` - Refactoring

**Analysis:**
- `spec-pseudocode` - Specification and pseudocode
- `architect` - Architecture design
- `refinement` - TDD refinement
- `integration` - Integration

**Specialized:**
- `mobile` - Mobile development
- `ml` - Machine learning
- `security` - Security
- `performance` - Performance optimization
- `documentation` - Documentation

**Operations:**
- `cicd` - CI/CD pipelines
- `deployment` - Deployment
- `monitoring` - Monitoring

**Usage:**
```bash
npx claude-flow@alpha sparc run <mode> "<task>"
```

---

## Stock Neural Features

### Neural Training

```bash
# Train neural patterns
npx claude-flow@alpha neural-train \
  --pattern-type coordination \
  --training-data "data.json"

# Check status
npx claude-flow@alpha neural-status

# Analyze patterns
npx claude-flow@alpha neural-patterns --action analyze
```

**Models:**
- 27+ pre-trained models
- WASM SIMD acceleration
- Hash-based embeddings (1024 dims)
- Pattern recognition and prediction

---

## Differences from common-thread-sandbox

| Feature | Stock Claude-Flow | common-thread-sandbox |
|---------|------------------|----------------------|
| **Init Process** | `hive init` command | Manual setup |
| **Directories** | `.claude-flow/`, `.hive-mind/` | `.claude/`, `sessions/` |
| **Hooks** | Manual CLI only | Manual + auto-fire wrapper |
| **Session Structure** | `.swarm/` state only | `sessions/*/artifacts/` organization |
| **File Routing** | None | AI-enforced artifact routing |
| **ReasoningBank** | Table schema only | Full pipeline (3 scripts) |
| **AgentDB** | Not mentioned | Integrated with bridge |
| **Captain's Log** | Concept (journal hook) | Full implementation |
| **Git Integration** | None | Auto-checkpoint system |
| **Custom Tables** | 5 stock tables | 5 stock + 4 custom |
| **Skills** | Unknown count | 28 skills |
| **Agents** | User-defined | 77 pre-defined patterns |
| **Auto-Init** | Via `hive init` | Via `auto-init.sh` script |
| **Stock %** | 100% | 68% architecture / 97.5% execution |

---

## Stock Documentation

### Official Resources

- **GitHub:** https://github.com/ruvnet/claude-flow
- **Wiki:** https://github.com/ruvnet/claude-flow/wiki (may exist)
- **NPM:** https://www.npmjs.com/package/claude-flow
- **Issues:** https://github.com/ruvnet/claude-flow/issues
- **Releases:** https://github.com/ruvnet/claude-flow/releases

### Community Resources

- **Discord:** (check GitHub README for link)
- **Examples:** In repository under `examples/`
- **Tutorials:** Community-contributed (may vary)

---

## Stock Limitations

### Known Constraints

1. **Manual Hooks** - No auto-fire system included
2. **No Session Organization** - State only, no artifact structure
3. **Incomplete ReasoningBank** - Schema provided, no implementation scripts
4. **Learning Curve** - Complex system with many modes and options
5. **Documentation Gaps** - Not all features comprehensively documented
6. **Nascent Plugin Ecosystem** - Few public plugins available

### What Stock Expects Users to Build

Stock provides **infrastructure**, users build:
- Custom agent patterns
- Skills for specific workflows
- Session organization (if desired)
- ReasoningBank scripts (if using trajectory learning)
- Auto-hooks wrapper (if desired)
- Project-specific configurations

---

## Summary

Stock claude-flow is a **comprehensive infrastructure** for multi-agent coordination, providing:
- ✅ Solid memory and pattern learning foundation
- ✅ Flexible hooks system
- ✅ Multi-topology swarm coordination
- ✅ SPARC methodology
- ✅ MCP integration
- ✅ Neural training capabilities

It is **NOT** a batteries-included framework:
- Users configure topologies
- Users create agent patterns
- Users organize projects
- Users implement advanced features (ReasoningBank, auto-hooks, etc.)

**Design Philosophy:** Provide primitives, let users compose workflows.

**common-thread-sandbox Philosophy:** Extend with opinionated defaults while maintaining 97.5% stock-first execution.

---

**Baseline Analysis Complete**
**Stock Version Analyzed:** claude-flow v2.7.35
**Methodology:** CLI help output + GitHub documentation + community knowledge
