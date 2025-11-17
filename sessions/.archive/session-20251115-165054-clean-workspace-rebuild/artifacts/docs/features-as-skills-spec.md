# Features-as-Skills Architecture Specification

**Version**: 1.0.0
**Date**: 2025-11-15
**Status**: Proposed
**Architect**: System Architecture Designer

---

## Table of Contents

1. [Overview](#overview)
2. [Core Principles](#core-principles)
3. [Skill Anatomy](#skill-anatomy)
4. [Skill Types](#skill-types)
5. [Implementation Patterns](#implementation-patterns)
6. [Stock Integration Points](#stock-integration-points)
7. [Progressive Disclosure](#progressive-disclosure)
8. [Quality Standards](#quality-standards)
9. [Migration from Current](#migration-from-current)

---

## Overview

### What Are Skills?

Skills are **self-contained feature packages** that coordinate stock claude-flow infrastructure without modifying it. Each skill provides:

- **Documentation**: Clear guidance on feature usage
- **Coordination Scripts**: Shell scripts calling stock CLI
- **Examples**: Progressive disclosure from beginner to advanced
- **Configuration**: YAML frontmatter for metadata

### What Skills Are NOT

- ❌ Custom runtime code that executes during operations
- ❌ Modifications to stock files (CLAUDE.md, agents, commands)
- ❌ File interception or monkey-patching
- ❌ Infrastructure (hooks, memory, agents are stock)

### Design Philosophy

```
Stock Claude-Flow = Infrastructure
Skills = Workflow Patterns + Documentation + Coordination
```

**Analogy**: If claude-flow is a programming language, skills are design patterns and libraries that use the language but don't modify its syntax.

---

## Core Principles

### 1. Never Edit Stock Files

**Rule**: Skills must never modify files created by `npx claude-flow@alpha init`.

**Stock Files (Read-Only):**
- `CLAUDE.md` (can reference skills, not embed them)
- `.claude/agents/*.md` (agent definitions)
- `.claude/commands/*.md` (slash commands)
- `.claude/settings.json` (can extend via settings.local.json)
- `.claude/helpers/*` (helper scripts)

**Skill Files (Editable):**
- `.claude/skills/*/skill.md` (skill definition)
- `.claude/skills/*/scripts/*` (coordination scripts)
- `.claude/skills/*/examples/*` (usage examples)
- `.claude/skills/*/docs/*` (detailed documentation)

**Enforcement**: Pre-commit hook validates no stock file modifications.

### 2. Stock CLI Only

**Rule**: All skill coordination must use stock claude-flow CLI commands.

**Allowed:**
```bash
# Stock hooks
npx claude-flow@alpha hooks pre-task --description "..." --task-id "..."
npx claude-flow@alpha hooks post-task --task-id "..." --status "completed"
npx claude-flow@alpha hooks memory --action store --key "..." --value "..."
npx claude-flow@alpha hooks session-end --export-metrics true

# Stock swarm commands
npx claude-flow@alpha swarm init --topology mesh
npx claude-flow@alpha agent spawn --type researcher
npx claude-flow@alpha task orchestrate --task "..." --strategy parallel

# Stock MCP tools (via Claude Code)
mcp__claude-flow__swarm_init { topology: "mesh" }
mcp__claude-flow__agent_spawn { type: "researcher" }
mcp__claude-flow__memory_usage { action: "store", key: "...", value: "..." }
```

**Not Allowed:**
```javascript
// ❌ Custom runtime code
const { exec } = require('child_process');
fs.writeFileSync = function(...args) { /* interception */ };

// ❌ Custom implementations
class CustomMemory { /* reimplementing stock */ }

// ❌ Direct database access
const db = sqlite3.open('.swarm/memory.db');
```

### 3. Coordination via Hooks

**Rule**: Skills coordinate features via stock hooks, not custom execution.

**Pattern**: Auto-Cascading Hooks
```bash
# Pre-task hook coordinates all necessary operations
npx claude-flow@alpha hooks pre-task \
  --description "$TASK" \
  --task-id "$ID" \
  --auto-spawn-agents

# Internally, this hook can cascade to:
# - session-restore (load session context)
# - memory retrieve (load relevant data)
# - journal entry (log task start)
# - skill-specific hooks (via settings.json)
```

**Skills extend cascades via settings.local.json:**
```json
{
  "hooks": {
    "pre-task": {
      "cascade": [
        "session-management:init-session",
        "captains-log:log-task-start",
        "reasoningbank:load-trajectories"
      ]
    }
  }
}
```

### 4. Documentation Over Enforcement

**Rule**: Skills provide guidance and best practices, not enforcement rules.

**Example** - File Routing Skill:

**Bad (Current):**
```markdown
# In CLAUDE.md (enforced by AI)
**NEVER save working files to root folder**
ALL files MUST go to sessions/$SESSION_ID/artifacts/
```

**Good (Skill):**
```markdown
# In .claude/skills/file-routing/skill.md (guidance)
## Recommended File Organization

For session isolation and workspace cleanliness, we recommend:
- New code: sessions/$SESSION_ID/artifacts/code/
- Tests: sessions/$SESSION_ID/artifacts/tests/
- Docs: sessions/$SESSION_ID/artifacts/docs/

Why this helps:
- Easy session archival
- Clear workspace boundaries
- Git commit cleanliness

Users are free to organize differently based on project needs.
```

### 5. Progressive Disclosure

**Rule**: Skills must provide beginner → intermediate → advanced paths.

**Directory Structure:**
```
.claude/skills/session-management/
├── skill.md              # Quick overview + basic usage
├── examples/
│   ├── basic.md         # Beginner: Single session workflow
│   ├── intermediate.md  # Multi-session coordination
│   └── advanced.md      # Custom session strategies
├── docs/
│   ├── concepts.md      # Deep dive into session theory
│   ├── api.md           # Script API reference
│   └── troubleshooting.md
└── scripts/
    ├── init-session.sh  # Called by beginners
    ├── closeout.sh      # Standard closeout
    └── advanced/        # Power user scripts
```

**Frontmatter indicates level:**
```yaml
---
name: session-management
version: 1.0.0
skill_level: beginner  # Auto-show in basic docs
progressive_levels:
  - beginner: examples/basic.md
  - intermediate: examples/intermediate.md
  - advanced: examples/advanced.md
---
```

---

## Skill Anatomy

### Required Files

Every skill MUST have:

**1. skill.md** - Skill definition
```yaml
---
name: skill-name
description: Brief description (1-2 sentences)
version: 1.0.0
author: Name or team
triggers:
  - "Natural language trigger 1"
  - "Natural language trigger 2"
stock_first: true
hitl_required: false  # true if requires human approval
skill_level: beginner  # beginner | intermediate | advanced
progressive_levels:
  - beginner: examples/basic.md
  - intermediate: examples/intermediate.md
  - advanced: examples/advanced.md
dependencies:
  stock:
    - hooks:pre-task
    - hooks:memory
  skills:
    - session-management  # If depends on another skill
stock_integration:
  - ".swarm/memory.db"  # Stock resources used
  - hooks:session-end
---

# Skill Name

Brief overview (2-3 sentences).

## What This Skill Does

Clear explanation of skill purpose.

## Quick Start

Minimal example for beginners.

## Stock Integration

Explain which stock features this coordinates.

## Progressive Learning

- Beginner: Link to examples/basic.md
- Intermediate: Link to examples/intermediate.md
- Advanced: Link to examples/advanced.md
```

**2. examples/** - Usage examples at each level

**3. scripts/** - Coordination scripts (stock CLI calls only)

### Optional Files

**docs/** - Deep dive documentation:
- `concepts.md` - Theoretical background
- `api.md` - Script API reference
- `troubleshooting.md` - Common issues
- `migration.md` - Migration from other patterns

**tests/** - Skill tests:
- `basic.test.sh` - Test basic functionality
- `integration.test.sh` - Test stock integration
- `validate.sh` - Validate skill health

---

## Skill Types

### Type 1: Workflow Pattern Skills

**Purpose**: Coordinate stock features into recommended workflows.

**Examples**:
- `session-management` - Session lifecycle best practices
- `tdd-workflow` - Test-driven development pattern
- `pr-review-workflow` - Pull request review coordination

**Structure**:
```
.claude/skills/session-management/
├── skill.md
├── scripts/
│   ├── init-session.sh      # Create session structure
│   ├── closeout-session.sh  # Close and archive
│   └── restore-session.sh   # Restore from backup
├── examples/
│   ├── basic.md            # Single session
│   ├── multi-session.md    # Managing multiple sessions
│   └── error-recovery.md   # Handling session failures
└── docs/
    └── session-theory.md   # Why sessions matter
```

**Implementation** (scripts/init-session.sh):
```bash
#!/bin/bash
# Initialize session using stock infrastructure
# All operations via stock CLI - no custom code

SESSION_ID="${1:-session-$(date +%Y%m%d-%H%M%S)}"

# 1. Use stock session-end hook to create initial snapshot
npx claude-flow@alpha hooks session-end \
  --session-id "$SESSION_ID" \
  --export-metrics true

# 2. Store session metadata in stock memory
npx claude-flow@alpha hooks memory \
  --action store \
  --key "session/$SESSION_ID/metadata" \
  --value "{\"created\": \"$(date -Iseconds)\", \"status\": \"active\"}"

# 3. Create recommended directory structure (guidance, not enforcement)
mkdir -p "sessions/$SESSION_ID/artifacts"/{code,tests,docs,scripts,notes}

# 4. Log to stock journal
npx claude-flow@alpha hooks journal \
  --entry "Initialized session $SESSION_ID" \
  --tags "session:$SESSION_ID,action:init"

echo "✅ Session $SESSION_ID initialized using stock infrastructure"
echo "📁 Recommended artifacts: sessions/$SESSION_ID/artifacts/"
echo "💾 Session backup: .swarm/backups/session-$SESSION_ID.json"
```

### Type 2: Documentation Skills

**Purpose**: Provide guidance and reference without execution.

**Examples**:
- `file-routing` - File organization guidance
- `naming-conventions` - Code naming best practices
- `git-workflow` - Git usage patterns

**Structure**:
```
.claude/skills/file-routing/
├── skill.md
├── examples/
│   ├── session-artifacts.md  # Recommended session structure
│   ├── monorepo.md           # Monorepo patterns
│   └── microservices.md      # Multi-service organization
└── docs/
    └── why-file-routing.md   # Philosophy and benefits
```

**No scripts/** - Pure documentation skill.

**Implementation** (skill.md):
```markdown
---
name: file-routing
description: File organization guidance for workspace cleanliness
version: 1.0.0
stock_first: true
hitl_required: false
skill_level: beginner
triggers:
  - "Where should I save [file]?"
  - "Check file routing"
  - "File organization guidance"
---

# File Routing Skill

Recommended file organization patterns for session isolation and workspace cleanliness.

## Quick Reference

**Recommended**:
- New code: `sessions/$SESSION_ID/artifacts/code/`
- Tests: `sessions/$SESSION_ID/artifacts/tests/`
- Docs: `sessions/$SESSION_ID/artifacts/docs/`
- Scripts: `sessions/$SESSION_ID/artifacts/scripts/`

**Why**:
- Session isolation (easy to archive)
- Clear workspace boundaries
- Clean git commits
- Stock `.swarm/backups/` remains authoritative

**Flexibility**: Users are free to organize differently. This is guidance, not enforcement.

## Progressive Learning

- Beginner: examples/session-artifacts.md
- Intermediate: examples/monorepo.md
- Advanced: examples/microservices.md
```

### Type 3: Integration Skills

**Purpose**: Integrate external tools via stock infrastructure.

**Examples**:
- `agentdb-integration` - AgentDB vector search via stock memory
- `reasoningbank-integration` - Learning pipeline via stock hooks
- `github-workflow` - GitHub integration via stock commands

**Structure**:
```
.claude/skills/reasoningbank-integration/
├── skill.md
├── scripts/
│   ├── collect-trajectory.sh   # Collect via stock hooks
│   ├── judge-verdict.sh        # Analyze via stock memory
│   └── distill-memory.sh       # Store in stock memory
├── examples/
│   ├── basic-learning.md      # Simple trajectory collection
│   └── advanced-patterns.md   # Multi-agent learning
└── docs/
    └── reasoningbank-theory.md
```

**Implementation** (scripts/collect-trajectory.sh):
```bash
#!/bin/bash
# Collect learning trajectory via stock hooks
# No custom runtime - pure stock CLI

TASK_ID="$1"
AGENT_ID="${2:-unknown}"
OUTCOME="${3:-unknown}"

# 1. Retrieve task data from stock memory
TASK_DATA=$(npx claude-flow@alpha hooks memory \
  --action retrieve \
  --key "task/$TASK_ID/execution")

# 2. Store trajectory in stock memory
npx claude-flow@alpha hooks memory \
  --action store \
  --key "reasoningbank/trajectories/$TASK_ID" \
  --value "{\"agent\": \"$AGENT_ID\", \"outcome\": \"$OUTCOME\", \"data\": $TASK_DATA}"

# 3. Log to stock journal
npx claude-flow@alpha hooks journal \
  --entry "Collected trajectory for task $TASK_ID (outcome: $OUTCOME)" \
  --tags "reasoningbank,trajectory,agent:$AGENT_ID"

echo "✅ Trajectory collected via stock infrastructure"
```

### Type 4: Automation Skills

**Purpose**: Automate workflows via stock hooks and scripts.

**Examples**:
- `hooks-cascade` - Auto-fire hooks via pre-task
- `git-checkpoints` - Automatic git commits via post-edit
- `test-on-save` - Run tests via post-edit hook

**Structure**:
```
.claude/skills/hooks-cascade/
├── skill.md
├── scripts/
│   ├── pre-task-cascade.sh   # Fired by stock pre-task hook
│   ├── post-task-cascade.sh  # Fired by stock post-task hook
│   └── configure.sh          # Setup cascade in settings.local.json
├── examples/
│   ├── basic-cascade.md
│   └── custom-cascade.md
└── docs/
    └── cascade-theory.md
```

**Implementation** (scripts/configure.sh):
```bash
#!/bin/bash
# Configure hooks cascade in settings.local.json
# Extends stock hooks without modifying them

SKILL_DIR="$(cd "$(dirname "$0")/.." && pwd)"

# Add cascade to settings.local.json
cat > .claude/settings.local.json <<EOF
{
  "hooks": {
    "pre-task": {
      "script": "$SKILL_DIR/scripts/pre-task-cascade.sh"
    },
    "post-task": {
      "script": "$SKILL_DIR/scripts/post-task-cascade.sh"
    }
  }
}
EOF

echo "✅ Hooks cascade configured"
echo "Stock hooks will call skill scripts automatically"
```

---

## Implementation Patterns

### Pattern 1: Stock CLI Wrapper

**Use When**: Simplifying common stock CLI sequences.

**Example**: Session closeout
```bash
#!/bin/bash
# Wrapper around stock session-end hook
# Adds user-friendly prompts and confirmation

SESSION_ID="${1:-$(cat .claude/session/current-session.json | jq -r '.id')}"

# Prompt for confirmation (HITL)
echo "Close out session $SESSION_ID?"
echo "This will:"
echo "  - Create backup at .swarm/backups/session-$SESSION_ID.json"
echo "  - Export metrics and summary"
echo "  - Archive session directory to sessions/.archive/"
read -p "Continue? (y/N) " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "❌ Closeout cancelled"
  exit 1
fi

# Use stock session-end hook
npx claude-flow@alpha hooks session-end \
  --session-id "$SESSION_ID" \
  --export-metrics true \
  --generate-summary true

# Archive session directory (skill-specific behavior)
if [ -d "sessions/$SESSION_ID" ]; then
  mkdir -p sessions/.archive/
  mv "sessions/$SESSION_ID" "sessions/.archive/$SESSION_ID-$(date +%Y%m%d-%H%M%S)"
  echo "📦 Session archived to sessions/.archive/"
fi

echo "✅ Session $SESSION_ID closed out successfully"
```

### Pattern 2: Stock Memory Coordination

**Use When**: Coordinating data across agents or sessions.

**Example**: Share context between agents
```bash
#!/bin/bash
# Share context via stock memory system
# No custom database - pure stock CLI

CONTEXT_KEY="$1"
CONTEXT_VALUE="$2"
AGENT_IDS="$3"  # Comma-separated

# Store in stock memory
npx claude-flow@alpha hooks memory \
  --action store \
  --key "context/$CONTEXT_KEY" \
  --value "$CONTEXT_VALUE" \
  --ttl 3600

# Notify agents via stock journal
IFS=',' read -ra AGENTS <<< "$AGENT_IDS"
for agent in "${AGENTS[@]}"; do
  npx claude-flow@alpha hooks journal \
    --entry "Context available: $CONTEXT_KEY" \
    --tags "context,agent:$agent"
done

echo "✅ Context shared via stock memory: $CONTEXT_KEY"
```

### Pattern 3: Progressive Disclosure Scripts

**Use When**: Supporting beginner → advanced workflows.

**Example**: Session management
```bash
#!/bin/bash
# Beginner-friendly session init
# Advanced users can call stock hooks directly

SKILL_LEVEL="${SKILL_LEVEL:-beginner}"

if [ "$SKILL_LEVEL" = "beginner" ]; then
  # Guided workflow with explanations
  echo "🎓 Beginner Mode: Initializing session with guidance"
  echo ""
  echo "Creating session structure..."
  SESSION_ID="session-$(date +%Y%m%d-%H%M%S)"

  npx claude-flow@alpha hooks session-end \
    --session-id "$SESSION_ID" \
    --export-metrics true

  echo "✅ Session created: $SESSION_ID"
  echo "📁 Save artifacts to: sessions/$SESSION_ID/artifacts/"
  echo ""
  echo "Next steps:"
  echo "  - Save code to sessions/$SESSION_ID/artifacts/code/"
  echo "  - Run tests in sessions/$SESSION_ID/artifacts/tests/"
  echo "  - Close session with: .claude/skills/session-management/scripts/closeout.sh"

elif [ "$SKILL_LEVEL" = "advanced" ]; then
  # Minimal output for advanced users
  SESSION_ID="${1:-session-$(date +%Y%m%d-%H%M%S)}"
  npx claude-flow@alpha hooks session-end --session-id "$SESSION_ID" --export-metrics true
  echo "$SESSION_ID"
fi
```

### Pattern 4: HITL Approval Gates

**Use When**: Skill requires human confirmation.

**Example**: Archive session with approval
```bash
#!/bin/bash
# HITL approval before destructive operation

SESSION_ID="$1"

# Show summary from stock backup
BACKUP=".swarm/backups/session-$SESSION_ID.json"
if [ -f "$BACKUP" ]; then
  echo "📊 Session Summary:"
  jq -r '.summary' "$BACKUP"
  echo ""
fi

# HITL approval gate
echo "⚠️  Archive session $SESSION_ID?"
echo "This will move sessions/$SESSION_ID to sessions/.archive/"
read -p "Type 'archive' to confirm: " -r
echo

if [ "$REPLY" != "archive" ]; then
  echo "❌ Archive cancelled"
  exit 1
fi

# Proceed with archive
mv "sessions/$SESSION_ID" "sessions/.archive/$SESSION_ID-$(date +%Y%m%d-%H%M%S)"

# Log via stock journal
npx claude-flow@alpha hooks journal \
  --entry "Archived session $SESSION_ID with user approval" \
  --tags "session:$SESSION_ID,action:archive,hitl:approved"

echo "✅ Session archived with HITL approval"
```

---

## Stock Integration Points

### 1. Hooks System Integration

**Stock Provides**:
```bash
npx claude-flow@alpha hooks [command] [args]
```

**Skills Extend Via**:
- `settings.local.json` - Add skill scripts to hook cascade
- Shell scripts - Call stock hooks in sequences
- Documentation - Guide hook usage patterns

**Example Integration**:
```json
// .claude/settings.local.json
{
  "hooks": {
    "pre-task": {
      "cascade": [
        ".claude/skills/session-management/scripts/session-restore.sh",
        ".claude/skills/captains-log/scripts/log-task-start.sh",
        ".claude/skills/reasoningbank-integration/scripts/load-context.sh"
      ]
    },
    "post-task": {
      "cascade": [
        ".claude/skills/session-management/scripts/session-backup.sh",
        ".claude/skills/git-checkpoints/scripts/auto-commit.sh",
        ".claude/skills/reasoningbank-integration/scripts/collect-trajectory.sh"
      ]
    }
  }
}
```

### 2. Memory System Integration

**Stock Provides**:
```bash
npx claude-flow@alpha hooks memory --action [store|retrieve|search] --key "..." --value "..."
```

**Skills Extend Via**:
- Namespaced keys (`session/`, `captains-log/`, `reasoningbank/`)
- TTL management for temporary data
- Search patterns for discovery

**Example Integration**:
```bash
# Skill stores data with namespacing
npx claude-flow@alpha hooks memory \
  --action store \
  --key "captains-log/$(date +%Y-%m-%d)/summary" \
  --value "Today's work summary..." \
  --ttl 2592000  # 30 days

# Skill searches across namespace
npx claude-flow@alpha hooks memory \
  --action search \
  --pattern "captains-log/*/summary"
```

### 3. Agent System Integration

**Stock Provides**:
- 64 agent definitions in `.claude/agents/`
- Agent spawning via Claude Code Task tool
- Agent coordination via swarm topology

**Skills Extend Via**:
- Documentation on agent usage patterns
- Scripts that spawn agents for workflows
- Best practices for agent coordination

**Example Integration**:
```bash
#!/bin/bash
# Skill script spawns agents using stock system
# No custom agent definitions - use stock agents only

TASK="Build REST API with authentication"

# Use stock agent spawning (via MCP or CLI)
npx claude-flow@alpha agent spawn --type backend-dev \
  --task "$TASK" \
  --output "sessions/$SESSION_ID/artifacts/code/"

npx claude-flow@alpha agent spawn --type tester \
  --task "Test $TASK" \
  --output "sessions/$SESSION_ID/artifacts/tests/"
```

### 4. Session Backup Integration

**Stock Provides**:
```bash
npx claude-flow@alpha hooks session-end --export-metrics true
# Creates: .swarm/backups/session-*.json
```

**Skills Extend Via**:
- Additional metadata in session directories
- Archive workflows for old sessions
- Restore workflows from backups

**Example Integration**:
```bash
#!/bin/bash
# Skill extends stock backup with metadata

SESSION_ID="$1"

# 1. Use stock session-end to create backup
npx claude-flow@alpha hooks session-end \
  --session-id "$SESSION_ID" \
  --export-metrics true

# 2. Add skill-specific metadata
BACKUP=".swarm/backups/session-$SESSION_ID.json"
if [ -f "$BACKUP" ]; then
  # Merge skill metadata with stock backup
  jq '. + {"skill_metadata": {"archived_at": "'$(date -Iseconds)'", "artifacts_path": "sessions/'$SESSION_ID'/artifacts"}}' \
    "$BACKUP" > "$BACKUP.tmp"
  mv "$BACKUP.tmp" "$BACKUP"
fi

echo "✅ Session backup extended with skill metadata"
```

---

## Progressive Disclosure

### Skill Level System

**Frontmatter Specification**:
```yaml
---
name: skill-name
skill_level: beginner  # Auto-show in basic docs
progressive_levels:
  - beginner: examples/basic.md
  - intermediate: examples/intermediate.md
  - advanced: examples/advanced.md
auto_show_for:
  - beginner  # Auto-include in beginner documentation
  - intermediate  # Also show for intermediate users
complexity_indicators:
  - concept_count: 3  # Number of concepts to learn
  - prerequisites: []  # Required skills
  - estimated_time: "10 minutes"
---
```

### Example Structure

**Beginner Example** (examples/basic.md):
```markdown
# Basic Session Management

**Goal**: Create and close a single session.

**Concepts**: 1 (session lifecycle)
**Time**: 5 minutes
**Prerequisites**: None

## Quick Start

1. Initialize session:
   ```bash
   .claude/skills/session-management/scripts/init-session.sh
   ```

2. Do your work, saving to `sessions/session-*/artifacts/`

3. Close session:
   ```bash
   .claude/skills/session-management/scripts/closeout.sh
   ```

That's it! Your session is backed up to `.swarm/backups/`.

## Next Steps

Ready for more? Try [intermediate.md](intermediate.md) for multi-session workflows.
```

**Intermediate Example** (examples/intermediate.md):
```markdown
# Multi-Session Coordination

**Goal**: Manage multiple concurrent sessions.

**Concepts**: 3 (sessions, namespacing, restoration)
**Time**: 15 minutes
**Prerequisites**: Basic session management

## Scenario

You're working on two features simultaneously:
- Feature A: New authentication system
- Feature B: Performance optimization

## Workflow

1. Create session A:
   ```bash
   SESSION_A=$(./scripts/init-session.sh session-20251115-auth)
   ```

2. Create session B:
   ```bash
   SESSION_B=$(./scripts/init-session.sh session-20251115-perf)
   ```

3. Switch between sessions:
   ```bash
   # Work on auth
   export SESSION_ID="$SESSION_A"
   # ... do work ...

   # Switch to perf
   export SESSION_ID="$SESSION_B"
   # ... do work ...
   ```

4. Close both sessions:
   ```bash
   ./scripts/closeout.sh "$SESSION_A"
   ./scripts/closeout.sh "$SESSION_B"
   ```

## Next Steps

Advanced users: See [advanced.md](advanced.md) for custom session strategies.
```

**Advanced Example** (examples/advanced.md):
```markdown
# Custom Session Strategies

**Goal**: Implement project-specific session workflows.

**Concepts**: 5 (hooks, cascades, memory namespacing, custom metadata, rollback)
**Time**: 30 minutes
**Prerequisites**: Intermediate session management, hooks system

## Scenario

You need custom session behavior:
- Auto-generate changelog from commits
- Track session dependencies
- Custom archival rules

## Implementation

1. Create custom session init hook:
   ```bash
   # .claude/skills/my-custom-sessions/scripts/pre-task.sh
   #!/bin/bash

   SESSION_ID="$1"
   PARENT_SESSION="$2"  # Optional dependency

   # Standard init via stock
   npx claude-flow@alpha hooks session-end --session-id "$SESSION_ID" --export-metrics true

   # Custom: Track parent session
   if [ -n "$PARENT_SESSION" ]; then
     npx claude-flow@alpha hooks memory \
       --action store \
       --key "session/$SESSION_ID/parent" \
       --value "$PARENT_SESSION"
   fi

   # Custom: Initialize changelog
   mkdir -p "sessions/$SESSION_ID/artifacts/docs"
   echo "# Changelog for $SESSION_ID" > "sessions/$SESSION_ID/artifacts/docs/CHANGELOG.md"
   ```

2. Configure auto-changelog via post-edit hook:
   ```bash
   # .claude/skills/my-custom-sessions/scripts/post-edit.sh
   #!/bin/bash

   FILE="$1"
   SESSION_ID="$2"

   # Stock post-edit
   npx claude-flow@alpha hooks post-edit --file "$FILE"

   # Custom: Update changelog if code file
   if [[ "$FILE" == *"/artifacts/code/"* ]]; then
     CHANGELOG="sessions/$SESSION_ID/artifacts/docs/CHANGELOG.md"
     echo "- Modified: $(basename $FILE) at $(date)" >> "$CHANGELOG"
   fi
   ```

3. Use custom session:
   ```bash
   # Init with parent dependency
   ./scripts/pre-task.sh "session-feature-refactor" "session-feature-original"

   # Work normally - changelog auto-updates
   # ...

   # Closeout with custom logic
   ./scripts/closeout.sh "session-feature-refactor"
   ```

## Going Further

This pattern can extend to:
- Cross-session dependency graphs
- Automated testing on session close
- Custom backup strategies
- Integration with external tools

The key: Always use stock infrastructure, extend via hooks and scripts.
```

---

## Quality Standards

### Code Quality

**Requirements**:
1. ✅ All scripts must be shellcheck-compliant
2. ✅ All stock CLI calls must have error handling
3. ✅ All destructive operations require HITL approval
4. ✅ All scripts must log via stock journal hook
5. ✅ All temporary data must use TTL in stock memory

**Example** (error handling):
```bash
#!/bin/bash
set -euo pipefail  # Exit on error, undefined vars, pipe failures

SESSION_ID="$1"

# Error handling for stock CLI calls
if ! npx claude-flow@alpha hooks session-end --session-id "$SESSION_ID" --export-metrics true; then
  echo "❌ Error: Stock session-end hook failed" >&2

  # Log error via stock journal
  npx claude-flow@alpha hooks journal \
    --entry "Session end failed for $SESSION_ID" \
    --tags "error,session:$SESSION_ID"

  exit 1
fi

echo "✅ Session ended successfully"
```

### Documentation Quality

**Requirements**:
1. ✅ Every skill must have progressive disclosure (beginner/intermediate/advanced)
2. ✅ Every script must have usage documentation
3. ✅ Every example must be runnable
4. ✅ Every skill must document stock integration points

**Example** (script header):
```bash
#!/bin/bash
# Script: init-session.sh
# Purpose: Initialize session using stock infrastructure
# Usage: ./init-session.sh [session-id] [--verbose]
# Stock Integration:
#   - hooks:session-end (create backup)
#   - hooks:memory (store metadata)
#   - hooks:journal (log initialization)
# HITL: No (automatic)
# Skill Level: Beginner
```

### Testing Quality

**Requirements**:
1. ✅ Every skill should have basic tests
2. ✅ Tests should validate stock integration (not reimplement)
3. ✅ Tests should run in isolated environment
4. ✅ Tests should clean up after themselves

**Example** (basic test):
```bash
#!/bin/bash
# Test: Basic session init and closeout

set -euo pipefail

TEST_SESSION="test-session-$(date +%s)"

# Setup
cleanup() {
  rm -rf "sessions/$TEST_SESSION"
  rm -f ".swarm/backups/session-$TEST_SESSION.json"
}
trap cleanup EXIT

# Test 1: Init session
echo "Test 1: Init session..."
if ! .claude/skills/session-management/scripts/init-session.sh "$TEST_SESSION"; then
  echo "❌ FAIL: Session init failed"
  exit 1
fi

# Validate stock backup created
if [ ! -f ".swarm/backups/session-$TEST_SESSION.json" ]; then
  echo "❌ FAIL: Stock backup not created"
  exit 1
fi

echo "✅ PASS: Session init successful"

# Test 2: Closeout session
echo "Test 2: Closeout session..."
if ! echo "y" | .claude/skills/session-management/scripts/closeout.sh "$TEST_SESSION"; then
  echo "❌ FAIL: Session closeout failed"
  exit 1
fi

# Validate session archived
if [ ! -d "sessions/.archive/$TEST_SESSION-"* ]; then
  echo "❌ FAIL: Session not archived"
  exit 1
fi

echo "✅ PASS: Session closeout successful"
echo ""
echo "🎉 All tests passed!"
```

---

## Migration from Current

### Current State Issues

1. **CLAUDE.md Bloat**: 500+ lines with custom features embedded
2. **Custom Code**: auto-hooks.js intercepts filesystem
3. **Enforcement**: File routing enforced vs guided
4. **Scattered Scripts**: Custom scripts in `.claude/scripts/`

### Migration Strategy

**Phase 1: Extract to Skills**

Convert each custom feature to a skill:

| Current Location | New Skill | Migration Script |
|------------------|-----------|------------------|
| CLAUDE.md (session protocol) | `.claude/skills/session-management/` | extract-session.sh |
| CLAUDE.md (file routing) | `.claude/skills/file-routing/` | extract-routing.sh |
| `.claude/hooks/auto-hooks.js` | `.claude/skills/hooks-cascade/` | convert-hooks.sh |
| `sessions/captains-log/` | `.claude/skills/captains-log/` | migrate-log.sh |
| `.claude/reasoningbank/` | `.claude/skills/reasoningbank-integration/` | wrap-reasoningbank.sh |
| `.claude/integrations/agentdb/` | `.claude/skills/agentdb-integration/` | wrap-agentdb.sh |

**Phase 2: Restore Stock**

1. Restore CLAUDE.md to stock format:
   ```bash
   # Backup current
   cp CLAUDE.md CLAUDE.md.backup

   # Generate stock CLAUDE.md
   npx claude-flow@alpha init --dry-run > CLAUDE.md.stock

   # Manual merge: Keep project-specific content, reference skills
   ```

2. Remove custom code:
   ```bash
   # Move to skills
   mv .claude/hooks/ .claude/skills/hooks-cascade/legacy/
   mv .claude/scripts/ .claude/skills/session-management/legacy/
   mv .claude/reasoningbank/ .claude/skills/reasoningbank-integration/legacy/
   ```

3. Update settings.local.json:
   ```json
   {
     "skills": {
       "enabled": [
         "session-management",
         "file-routing",
         "hooks-cascade",
         "captains-log",
         "reasoningbank-integration",
         "agentdb-integration"
       ]
     },
     "hooks": {
       "pre-task": {
         "cascade": [
           ".claude/skills/session-management/scripts/session-restore.sh",
           ".claude/skills/hooks-cascade/scripts/pre-task-cascade.sh"
         ]
       }
     }
   }
   ```

**Phase 3: Test & Validate**

1. Run skill tests:
   ```bash
   for skill in .claude/skills/*/tests/*.test.sh; do
     echo "Testing $skill..."
     bash "$skill"
   done
   ```

2. Verify stock integration:
   ```bash
   # Ensure all hooks work
   npx claude-flow@alpha hooks pre-task --description "Test" --task-id "test-1"

   # Ensure memory works
   npx claude-flow@alpha hooks memory --action store --key "test" --value "data"
   npx claude-flow@alpha hooks memory --action retrieve --key "test"

   # Ensure session-end works
   npx claude-flow@alpha hooks session-end --session-id "test" --export-metrics true
   ```

3. User acceptance testing:
   ```bash
   # Full workflow test
   .claude/skills/session-management/scripts/init-session.sh "test-migration"
   # ... do work ...
   .claude/skills/session-management/scripts/closeout.sh "test-migration"
   ```

---

## Summary

**Features-as-skills architecture** provides:

✅ **Stock-First Compliance**: 95+ score, never edit stock files
✅ **Composability**: Skills combine cleanly via hooks
✅ **Portability**: Skills work across projects
✅ **Maintainability**: Stock upgrades don't break skills
✅ **User Experience**: Progressive disclosure, opt-in features
✅ **Auditability**: All coordination via stock CLI (logged)

**Implementation checklist**:
- [ ] Skills use stock CLI only (no custom runtime)
- [ ] Skills coordinate via hooks (no interception)
- [ ] Skills provide guidance (no enforcement)
- [ ] Skills have progressive disclosure (beginner → advanced)
- [ ] Skills integrate with stock systems (memory, backups, journal)
- [ ] Skills include tests and validation
- [ ] Skills document stock integration points
- [ ] Skills support HITL where needed

**Next**: See migration-strategy.md for step-by-step rebuild plan.
