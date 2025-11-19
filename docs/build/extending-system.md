# Extending the System

**Audience**: Developers building custom integrations, workflows, and extensions
**Prerequisites**: Understanding of CLAUDE.md, session management, and file routing

---

## Overview

This guide covers the four primary extension points for the claude-flow+ workspace:

1. **MCP Server Integration** - Add custom coordination tools
2. **Hook Creation** - Automate operations and learning
3. **Skill Development** - Create reusable workflows
4. **Slash Command Creation** - Build custom user commands

Each extension point follows the **stock-first principle**: leverage existing claude-flow tooling, minimize custom code, and maintain 95%+ stock adherence.

---

## 1. MCP Server Integration

### What Are MCP Servers?

MCP (Model Context Protocol) servers provide coordination capabilities to Claude Code through tool invocation. The workspace uses three MCP servers:

- **claude-flow** (required) - Core swarm coordination
- **ruv-swarm** (optional) - Enhanced WASM coordination
- **flow-nexus** (optional) - Cloud execution and sandboxes

### Adding a New MCP Server

#### Step 1: Install the MCP Server

```bash
# Add MCP server to Claude Code
claude mcp add my-custom-mcp npx my-mcp-package mcp start

# Verify installation
claude mcp list
```

#### Step 2: Configure in Settings

Edit `.claude/settings.json`:

```json
{
  "enabledMcpjsonServers": [
    "claude-flow",
    "ruv-swarm",
    "my-custom-mcp"
  ]
}
```

#### Step 3: Create Integration Pattern

Document how to use the MCP tools in `CLAUDE.md`:

```markdown
## My Custom MCP Integration

### Available Tools
- `mcp__my-custom-mcp__tool_name` - Description of what it does

### Usage Pattern
```javascript
// Coordination setup (MCP)
mcp__my-custom-mcp__init_workflow({ topology: "mesh" })

// Execution (Claude Code Task tool)
Task("Worker agent", "Do work. Use MCP tools for coordination.", "coder")
```
```

#### Stock-First Compliance

**Required**:
- MCP server must be published to npm
- Tools must follow MCP spec: https://spec.modelcontextprotocol.io/
- Integration documented in CLAUDE.md

**Prohibited**:
- Custom filesystem interception
- Monkey-patching Claude Code tools
- Bypassing stock coordination patterns

### MCP Tool Design Patterns

#### Pattern 1: Coordination-Only Tools

```javascript
// ✅ CORRECT: MCP tools coordinate, don't execute
mcp__custom__swarm_init({ topology: "hierarchical" })
mcp__custom__agent_spawn({ type: "researcher" })

// ❌ WRONG: MCP tools should not directly execute work
mcp__custom__write_file({ path: "file.js", content: "..." })  // Use Claude Code Write tool instead
```

#### Pattern 2: State Management

```javascript
// MCP tools can manage coordination state
mcp__custom__memory_store({
  key: "workflow/step1/result",
  value: JSON.stringify({ status: "complete" }),
  namespace: "coordination"
})

// Agents read state via MCP
mcp__custom__memory_retrieve({
  key: "workflow/step1/result",
  namespace: "coordination"
})
```

#### Pattern 3: Cross-Agent Communication

```javascript
// Agent 1 publishes result
mcp__custom__publish({
  channel: "swarm/results",
  message: { taskId: "task-1", result: "success" }
})

// Agent 2 subscribes to updates
mcp__custom__subscribe({
  channel: "swarm/results",
  callback: "handleTaskComplete"
})
```

### Testing MCP Integration

```bash
# Test MCP tools manually
npx my-mcp-package test-tool --param value

# Verify MCP server responds
claude mcp call my-custom-mcp tool_name '{"param": "value"}'

# Integration test
cat > test-mcp-integration.md << 'EOF'
Test MCP integration by spawning coordinated agents:

1. Initialize: mcp__my-custom-mcp__init
2. Spawn agents: Task("agent", "work", "type")
3. Verify coordination via memory
EOF
```

---

## 2. Hook Creation

### Hook System Architecture

The workspace uses **Claude Code's native hook system** integrated with **claude-flow CLI commands**. All hooks execute through stock tooling with zero filesystem interception.

### Available Hook Types

#### Pre-Operation Hooks
Execute BEFORE operations to validate and prepare:

- `PreToolUse` - Before any tool execution (Write, Edit, Bash, etc.)
- `PreCompact` - Before context window compaction

#### Post-Operation Hooks
Execute AFTER operations to process and learn:

- `PostToolUse` - After tool completion
- `Stop` - On conversation end

#### Session Hooks
Manage session lifecycle:

- `SessionStart` - Initialize session
- `SessionEnd` - Cleanup and persist state

### Creating a Custom Hook

#### Step 1: Define Hook Logic

Create `.claude/hooks/custom-validation.sh`:

```bash
#!/bin/bash
# Custom validation hook for TypeScript files

FILE="${1:?File path required}"
OPERATION="${2:-edit}"

# Only validate TypeScript files
if [[ ! "$FILE" =~ \.tsx?$ ]]; then
  echo '{"continue": true, "reason": "Not a TypeScript file"}'
  exit 0
fi

# Run TypeScript compiler check
if ! npx tsc --noEmit "$FILE" 2>&1; then
  echo '{"continue": false, "reason": "TypeScript compilation errors detected"}'
  exit 1
fi

# Store validation result in memory (stock sqlite3)
if [ -f ".swarm/memory.db" ]; then
  sqlite3 .swarm/memory.db <<SQL
INSERT OR REPLACE INTO memory_entries (key, value, namespace, metadata)
VALUES (
  'hooks/validation/${FILE//\//-}',
  '{"status": "valid", "timestamp": $(date +%s)}',
  'hooks',
  '{"type": "typescript-validation", "file": "$FILE"}'
);
SQL
fi

echo '{"continue": true, "reason": "TypeScript validation passed", "metadata": {"validated": true}}'
exit 0
```

```bash
# Make executable
chmod +x .claude/hooks/custom-validation.sh
```

#### Step 2: Register Hook in Settings

Edit `.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
        "hooks": [
          {
            "type": "command",
            "command": "cat | jq -r '.tool_input.file_path // empty' | tr '\\n' '\\0' | xargs -0 -I {} .claude/hooks/custom-validation.sh '{}' 'pre-edit'",
            "timeout": 5000,
            "continueOnError": false
          }
        ]
      }
    ]
  }
}
```

#### Step 3: Test Hook

```bash
# Create test file with error
cat > test.ts << 'EOF'
const x: number = "string";  // Type error
EOF

# Trigger hook via Claude Code Edit tool
# Hook should block the edit with validation error

# Create valid file
cat > test.ts << 'EOF'
const x: number = 42;
EOF

# Hook should allow the edit
```

### Hook Response Format

Hooks must return JSON with specific structure:

```json
{
  "continue": true|false,
  "reason": "Human-readable explanation",
  "warnings": ["Optional warning 1", "Optional warning 2"],
  "metadata": {
    "custom": "data",
    "for": "tracking"
  }
}
```

**Response Behaviors**:
- `"continue": true` - Allow operation to proceed
- `"continue": false` - Block operation
- `warnings` - Show warnings but continue
- `metadata` - Stored in coordination memory

### Cascade Pattern: Calling Other Scripts

Hooks can call additional scripts in sequence:

```bash
#!/bin/bash
# Main hook that cascades to specialized scripts

FILE="$1"

# Step 1: Validate syntax
.claude/hooks/syntax-validator.sh "$FILE" || exit 1

# Step 2: Check formatting
.claude/hooks/format-checker.sh "$FILE" || exit 1

# Step 3: Store in Captain's Log (stock journal.sh)
.claude/hooks/journal.sh "Validated and formatted $FILE" "file-edit"

# Step 4: Record episode for learning (stock AgentDB)
EPISODE_JSON=$(cat <<EOF
{
  "taskId": "edit-$(basename $FILE)",
  "observation": "File edited: $FILE",
  "action": "edit",
  "reward": 1.0
}
EOF
)

node .claude/integrations/episode-recorder-hook.js record "$EPISODE_JSON"

echo '{"continue": true, "reason": "All validations passed"}'
```

### Integrating with Claude-Flow Hooks

Call stock claude-flow hooks from your custom hooks:

```bash
#!/bin/bash
# Custom hook that uses stock claude-flow hooks

FILE="$1"

# Use stock pre-edit hook for agent assignment
npx claude-flow@alpha hooks pre-edit --file "$FILE" --auto-assign-agents

# Custom validation
if ! validate_custom_rules "$FILE"; then
  exit 1
fi

# Use stock post-edit hook for formatting
npx claude-flow@alpha hooks post-edit --file "$FILE" --auto-format --train-patterns

echo '{"continue": true}'
```

### Memory Coordination in Hooks

Store hook results in coordination memory:

```bash
#!/bin/bash

# Store hook execution (stock MCP memory tool via CLI)
npx claude-flow@alpha memory store \
  --key "hooks/execution/$(date +%s)" \
  --value "{\"hook\": \"custom-validation\", \"file\": \"$FILE\", \"status\": \"success\"}" \
  --namespace "hooks"

# Retrieve previous validations
npx claude-flow@alpha memory search \
  --pattern "hooks/execution/*" \
  --namespace "hooks" \
  --limit 10
```

### Stock Adherence Requirements

**✅ Required**:
- Use stock `npx claude-flow@alpha hooks` commands
- Store data via stock SQLite or MCP memory tools
- Use standard bash/node for scripting
- Exit with proper status codes (0 = success, non-zero = failure)

**❌ Prohibited**:
- Filesystem monkey-patching (no `fs.writeFileSync` overrides)
- Custom tool interception
- Non-standard hook execution
- Bypassing Claude Code native hooks

### Hook Development Checklist

- [ ] Hook script is executable (`chmod +x`)
- [ ] Returns valid JSON response
- [ ] Handles errors gracefully
- [ ] Stores results in stock memory (.swarm/memory.db or MCP)
- [ ] Documented in `.claude/hooks/README.md`
- [ ] Tested manually with sample files
- [ ] Timeout configured appropriately
- [ ] Uses stock claude-flow CLI for coordination
- [ ] No filesystem interception
- [ ] Stock adherence: 95%+

---

## 3. Skill Development

### What Are Skills?

Skills are reusable workflow instructions that Claude can autonomously discover and execute. They use progressive disclosure: metadata → basic instructions → detailed reference.

### Skill Structure

```
~/.claude/skills/my-skill/           # Personal skill location
  ├── SKILL.md                       # REQUIRED: Main skill file
  ├── README.md                      # Optional: Human documentation
  ├── scripts/                       # Optional: Executable scripts
  │   ├── setup.sh
  │   └── execute.sh
  ├── resources/                     # Optional: Templates and examples
  │   ├── templates/
  │   └── examples/
  └── docs/                          # Optional: Deep reference
      ├── ADVANCED.md
      └── TROUBLESHOOTING.md
```

**Important**: Skills MUST be at top level (`~/.claude/skills/[skill-name]/`), NOT in nested subdirectories!

### Creating a Skill: Step-by-Step

#### Step 1: Create Skill Directory

```bash
# Personal skill (available in all projects)
mkdir -p ~/.claude/skills/api-generator

# Project skill (team-shared, version controlled)
mkdir -p .claude/skills/api-generator
```

#### Step 2: Write SKILL.md with YAML Frontmatter

```markdown
---
name: "API Generator"
description: "Generate REST API endpoints with Express, TypeScript, validation, and tests. Use when building new APIs, adding endpoints, or scaffolding backend services."
---

# API Generator

## What This Skill Does

Creates production-ready REST API endpoints with:
- Express.js routing
- TypeScript type definitions
- Joi validation schemas
- Jest unit tests
- OpenAPI documentation

## Prerequisites

- Node.js 18+
- Express.js 4+
- TypeScript 5+

## Quick Start

```bash
# Generate basic API endpoint
./scripts/generate.sh users --methods GET,POST

# Creates:
# - src/routes/users.ts
# - src/validators/users.ts
# - src/tests/users.test.ts
# - docs/openapi/users.yaml
```

## Step-by-Step Guide

### 1. Run Generator

```bash
./scripts/generate.sh <resource> --methods <GET,POST,PUT,DELETE>
```

Options:
- `--methods` - HTTP methods to generate (default: GET,POST)
- `--auth` - Add authentication middleware (default: false)
- `--db` - Include database integration (default: false)

### 2. Customize Generated Files

Edit files in `src/routes/` to add business logic.

### 3. Run Tests

```bash
npm test src/tests/<resource>.test.ts
```

## Advanced Features

See [Performance Tuning](../coordinate/performance-tuning.md) for advanced configuration including:
- Custom templates
- Database integration
- WebSocket endpoints
- GraphQL schema generation

## Troubleshooting

**Issue**: Generated tests fail
**Solution**: Ensure test database is configured in `.env.test`

**Issue**: TypeScript compilation errors
**Solution**: Run `npm run build` to check types

## Resources

- Templates: `resources/templates/`
- Examples: `resources/examples/`
- OpenAPI schemas: `resources/schemas/`
```

#### Step 3: Add Executable Scripts

Create `scripts/generate.sh`:

```bash
#!/bin/bash
# API endpoint generator script

RESOURCE="${1:?Resource name required}"
METHODS="${2:-GET,POST}"

TEMPLATE_DIR="$(dirname $0)/../resources/templates"
OUTPUT_DIR="src"

echo "🚀 Generating API endpoint for: $RESOURCE"

# Generate route file
cat "$TEMPLATE_DIR/route.template.ts" | \
  sed "s/{{RESOURCE}}/$RESOURCE/g" | \
  sed "s/{{METHODS}}/$METHODS/g" > "$OUTPUT_DIR/routes/${RESOURCE}.ts"

echo "✅ Created $OUTPUT_DIR/routes/${RESOURCE}.ts"

# Generate validator
cat "$TEMPLATE_DIR/validator.template.ts" | \
  sed "s/{{RESOURCE}}/$RESOURCE/g" > "$OUTPUT_DIR/validators/${RESOURCE}.ts"

echo "✅ Created $OUTPUT_DIR/validators/${RESOURCE}.ts"

# Generate tests
cat "$TEMPLATE_DIR/test.template.ts" | \
  sed "s/{{RESOURCE}}/$RESOURCE/g" > "$OUTPUT_DIR/tests/${RESOURCE}.test.ts"

echo "✅ Created $OUTPUT_DIR/tests/${RESOURCE}.test.ts"

echo "✨ API endpoint generation complete!"
```

```bash
chmod +x scripts/generate.sh
```

#### Step 4: Add Templates

Create `resources/templates/route.template.ts`:

```typescript
import { Router } from 'express';
import { validate } from '../validators/{{RESOURCE}}';

const router = Router();

// GET /{{RESOURCE}}
router.get('/', async (req, res) => {
  try {
    // TODO: Implement GET logic
    res.json({ message: 'GET {{RESOURCE}}' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /{{RESOURCE}}
router.post('/', validate, async (req, res) => {
  try {
    // TODO: Implement POST logic
    res.status(201).json({ message: 'Created {{RESOURCE}}' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

#### Step 5: Test the Skill

```bash
# Restart Claude Code to detect new skill
# Or reload Claude.ai

# Skill should appear in skill list
# Description triggers on "build API" or "generate endpoint"

# Test script execution
cd ~/.claude/skills/api-generator
./scripts/generate.sh products --methods GET,POST,PUT,DELETE
```

### Progressive Disclosure Best Practices

**Level 1: Metadata (Always Loaded)**
Keep `name` + `description` under 200 chars total.

```yaml
---
name: "Short Name"  # Max 64 chars
description: "What it does. When to use it."  # Max 1024 chars
---
```

**Level 2: SKILL.md Body (Loaded When Active)**
Keep main instructions under 5KB. Use clear sections:

```markdown
## What This Skill Does (2-3 sentences)
## Prerequisites (bullet list)
## Quick Start (single example)
## Step-by-Step Guide (detailed instructions)
```

**Level 3: Referenced Files (Loaded On-Demand)**
Move detailed content to separate files:

```markdown
## Advanced Topics
See [Performance Tuning](../coordinate/performance-tuning.md) for advanced configuration
See [Architecture Guide](../reference/architecture.md) for system internals
```

### Skill Integration with Workspace

Skills can leverage workspace features:

```markdown
## Integration with Claude-Flow

This skill works with swarm coordination:

```bash
# Initialize swarm for API development
npx claude-flow@alpha swarm init --topology mesh

# Spawn agents
Task("Backend Dev", "Generate API with skill. Save to sessions/$SESSION_ID/artifacts/code/.", "backend-dev")
Task("Tester", "Write tests for generated API.", "tester")

# Use skill within agent
# Agent reads skill and executes ./scripts/generate.sh
```
```

### Skill Development Checklist

- [ ] YAML frontmatter with `name` and `description`
- [ ] `name` under 64 characters
- [ ] `description` includes "what" and "when" (under 1024 chars)
- [ ] Directory is top-level in `~/.claude/skills/[skill-name]/`
- [ ] SKILL.md has 4-level structure (Overview → Quick Start → Details → Reference)
- [ ] Scripts are executable and documented
- [ ] Templates use clear placeholder syntax
- [ ] Examples are concrete and runnable
- [ ] Advanced content in separate docs/ files
- [ ] No filesystem interception
- [ ] Stock adherence: 95%+

---

## 4. Slash Command Creation

### What Are Slash Commands?

Slash commands are custom user-invoked commands that expand into prompts for Claude. They're defined in `.claude/commands/` and can accept arguments.

### Command Structure

```
.claude/commands/
├── my-command.md              # Simple command
└── my-category/               # Grouped commands
    ├── sub-command-1.md
    └── sub-command-2.md
```

### Creating a Slash Command

#### Step 1: Create Command File

Create `.claude/commands/api-review.md`:

```markdown
Review the API endpoint code for security, performance, and best practices.

## Steps:

1. **Security Analysis**
   - Check for SQL injection vulnerabilities
   - Verify input validation
   - Review authentication/authorization
   - Check for exposed secrets

2. **Performance Review**
   - Identify N+1 query patterns
   - Check for missing database indexes
   - Review caching opportunities
   - Analyze response payload size

3. **Best Practices**
   - Verify error handling
   - Check logging coverage
   - Review API versioning
   - Validate OpenAPI documentation

4. **Code Quality**
   - TypeScript type safety
   - Test coverage (minimum 80%)
   - Code complexity metrics
   - Consistent naming conventions

## Deliverables:

Generate a markdown report in `sessions/$SESSION_ID/artifacts/docs/api-review-report.md` with:
- Security findings (critical/medium/low)
- Performance recommendations
- Best practice violations
- Code quality metrics
- Action items prioritized by impact

## Tools to Use:

- Read: Review endpoint code files
- Bash: Run `npm run lint` and `npm run test`
- Grep: Search for common anti-patterns
- Write: Generate review report
```

#### Step 2: Test Command

```bash
# In Claude Code or Claude.ai
/api-review

# Claude reads the command file and follows instructions
# Generates security and performance analysis
```

### Commands with Arguments

Create `.claude/commands/generate-migration.md`:

```markdown
Generate a database migration for the specified change.

**Arguments**: `<migration-type> <description>`

**Migration Types**:
- `create-table` - Create new database table
- `add-column` - Add column to existing table
- `remove-column` - Remove column from table
- `create-index` - Create database index

## Steps:

1. Parse migration type and description from arguments
2. Generate migration file at `sessions/$SESSION_ID/artifacts/code/migrations/`
3. Include:
   - `up()` function for applying migration
   - `down()` function for rollback
   - TypeScript types for schema
   - Timestamp-based filename

## Example:

```typescript
// migrations/20241118120000-add-email-to-users.ts

export async function up(db: Database) {
  await db.schema.alterTable('users', (table) => {
    table.string('email').unique().notNullable();
  });
}

export async function down(db: Database) {
  await db.schema.alterTable('users', (table) => {
    table.dropColumn('email');
  });
}
```

## Usage Examples:

```bash
/generate-migration create-table products "Product catalog table"
/generate-migration add-column users "Add email field"
/generate-migration create-index products "Index on category and price"
```
```

### Grouped Commands

Create `.claude/commands/workflow/`:

```bash
mkdir -p .claude/commands/workflow
```

Create `.claude/commands/workflow/start-feature.md`:

```markdown
Start a new feature development workflow.

**Arguments**: `<feature-name>`

## Steps:

1. Create feature branch: `git checkout -b feature/<feature-name>`
2. Create session: `sessions/session-$(date +%Y%m%d-%H%M%S)-<feature-name>/`
3. Initialize swarm with feature-specific topology
4. Create planning document at `sessions/$SESSION_ID/artifacts/docs/feature-plan.md`
5. Spawn coordinated agents:
   - Researcher: Analyze requirements
   - Architect: Design system changes
   - Coder: Implement feature
   - Tester: Create test suite

## Usage:

```bash
/workflow:start-feature user-authentication
```
```

### Command Integration Patterns

#### Pattern 1: Commands That Spawn Agents

```markdown
Start TDD workflow for the specified feature.

## Steps:

1. Initialize test-driven development swarm:
```bash
npx claude-flow@alpha swarm init --topology hierarchical
```

2. Spawn TDD agents in parallel:
   - Task("Test Writer", "Write failing tests first. Save to sessions/$SESSION_ID/artifacts/tests/.", "tester")
   - Task("Code Writer", "Implement minimal code to pass tests. Save to sessions/$SESSION_ID/artifacts/code/.", "coder")
   - Task("Refactorer", "Refactor for quality while keeping tests green.", "reviewer")

3. Monitor via hooks:
```bash
npx claude-flow@alpha hooks session-end --export-metrics
```
```

#### Pattern 2: Commands That Use Skills

```markdown
Generate full-stack feature with coordination.

## Steps:

1. Use API Generator skill for backend
2. Use Component Builder skill for frontend
3. Use Test Suite skill for end-to-end tests
4. Coordinate via memory:
   - Backend stores API contract in memory
   - Frontend reads contract for implementation
   - Tests verify integration

## Skills Used:
- `/skills/api-generator`
- `/skills/component-builder`
- `/skills/test-suite`
```

#### Pattern 3: Commands That Call Other Commands

```markdown
Complete feature development workflow.

## Steps:

1. Start feature: `/workflow:start-feature <name>`
2. Generate backend: `/api-review`
3. Generate frontend: `/component-review`
4. Run tests: `/test-suite:run`
5. Create PR: `/github:create-pr`
6. Close session: `/session-closeout`

This command orchestrates multiple sub-commands for end-to-end feature delivery.
```

### Command Best Practices

**1. Clear Instructions**: Commands should be unambiguous step-by-step procedures.

**2. File Routing**: Always specify session artifacts paths:
```markdown
Save output to `sessions/$SESSION_ID/artifacts/docs/report.md`
```

**3. Tool Usage**: Explicitly list Claude Code tools to use:
```markdown
## Tools:
- Read: Review existing code
- Grep: Search for patterns
- Write: Generate new files
- Bash: Run tests
```

**4. Deliverables**: Specify exactly what should be produced:
```markdown
## Deliverables:
- TypeScript interfaces in `sessions/$SESSION_ID/artifacts/code/types/`
- Unit tests in `sessions/$SESSION_ID/artifacts/tests/`
- Documentation in `sessions/$SESSION_ID/artifacts/docs/API.md`
```

**5. Stock Integration**: Use stock coordination patterns:
```markdown
## Coordination:

Use hooks for automatic formatting:
```bash
npx claude-flow@alpha hooks post-edit --file <file> --auto-format
```

Store decisions in memory:
```bash
npx claude-flow@alpha memory store --key "workflow/<step>" --value <result>
```
```

### Slash Command Checklist

- [ ] Command file in `.claude/commands/` or `.claude/commands/<category>/`
- [ ] Clear step-by-step instructions
- [ ] File paths use session artifacts (`sessions/$SESSION_ID/artifacts/`)
- [ ] Arguments documented if applicable
- [ ] Tools to use explicitly listed
- [ ] Deliverables clearly specified
- [ ] Examples provided for complex commands
- [ ] Integration with hooks/skills documented
- [ ] Stock coordination patterns used
- [ ] No custom tool invocation (use stock Claude Code tools)

---

## Integration Patterns

### Pattern 1: MCP + Hooks + Skills

**Scenario**: Automated API development workflow

```markdown
1. **MCP Setup**: Initialize coordination topology
   mcp__claude-flow__swarm_init { topology: "mesh" }

2. **Hook Integration**: Auto-format and validate on edit
   .claude/hooks/api-validator.sh runs on PostToolUse

3. **Skill Execution**: Use API Generator skill
   Task("Backend Dev", "Use API Generator skill. Save to sessions/$SESSION_ID/artifacts/code/.", "backend-dev")

4. **Memory Coordination**: Share API contract via MCP memory
   mcp__claude-flow__memory_usage { action: "store", key: "api/contract", value: {...} }
```

### Pattern 2: Slash Commands → Skills → Hooks

**Scenario**: Feature development command that orchestrates everything

```markdown
# Command: /feature:develop user-profiles

1. **Command expands to**:
   - Initialize session
   - Call `/skills/api-generator` for backend
   - Call `/skills/component-builder` for frontend

2. **Skills execute scripts**:
   - `./scripts/generate-api.sh`
   - `./scripts/generate-component.sh`

3. **Hooks fire automatically**:
   - Pre-edit: Validate TypeScript
   - Post-edit: Auto-format code
   - Post-task: Record episode for learning
```

### Pattern 3: Custom Workflow Orchestration

**Scenario**: End-to-end testing pipeline

```markdown
1. **Slash Command**: `/test:e2e start`

2. **MCP Coordination**:
   - Initialize test swarm
   - Spawn test agents (unit, integration, e2e)

3. **Claude Code Execution**:
   - Task("Unit Tester", "Run unit tests", "tester")
   - Task("Integration Tester", "Run integration tests", "tester")
   - Task("E2E Tester", "Run end-to-end tests", "tester")

4. **Hook Processing**:
   - Post-task: Collect test results
   - Store metrics in memory
   - Generate test report

5. **Skill Integration**:
   - Use Test Reporter skill to format results
   - Use Quality Gate skill to verify thresholds
```

---

## Stock Adherence Guidelines

### The 95% Rule

All extensions must maintain **95% stock adherence**:

**✅ Stock (Allowed)**:
- Standard bash/node/python scripts
- SQLite database operations
- Stock claude-flow CLI commands
- Claude Code native tools (Read, Write, Edit, Bash, etc.)
- Standard npm packages
- Git commands

**❌ Custom (Minimize)**:
- Filesystem monkey-patching
- Custom tool interception
- Non-standard hook execution
- Proprietary coordination protocols

### Measuring Stock Adherence

```bash
# Calculate stock adherence for an extension

# Count total lines of code
TOTAL_LINES=$(find .claude/skills/my-skill -name "*.sh" -o -name "*.js" | xargs wc -l | tail -1 | awk '{print $1}')

# Count lines using stock tools
STOCK_LINES=$(grep -r "npx claude-flow" .claude/skills/my-skill | wc -l)
STOCK_LINES=$((STOCK_LINES + $(grep -r "sqlite3" .claude/skills/my-skill | wc -l)))
STOCK_LINES=$((STOCK_LINES + $(grep -r "git\|npm\|node" .claude/skills/my-skill | wc -l)))

# Calculate percentage
STOCK_PERCENTAGE=$(echo "scale=2; $STOCK_LINES / $TOTAL_LINES * 100" | bc)

echo "Stock Adherence: $STOCK_PERCENTAGE%"

# Must be >= 95%
```

### Stock-First Development Checklist

Before publishing any extension:

- [ ] Uses stock claude-flow CLI for coordination
- [ ] Uses stock Claude Code tools for execution
- [ ] Uses stock SQLite/MCP for memory
- [ ] No filesystem monkey-patching
- [ ] No custom tool interception
- [ ] Documented in workspace guides
- [ ] Tested with stock tooling only
- [ ] Stock adherence calculated: ≥95%
- [ ] Integration patterns documented
- [ ] Migration path from any deprecated patterns

---

## Testing Extensions

### Testing MCP Integrations

```bash
# 1. Test MCP server responds
claude mcp call my-custom-mcp tool_name '{"param": "value"}'

# 2. Test coordination setup
cat > test-mcp.md << 'EOF'
Initialize swarm with custom MCP:

1. mcp__my-custom-mcp__init({ topology: "mesh" })
2. mcp__my-custom-mcp__spawn({ type: "worker" })
3. Verify agents appear in: mcp__claude-flow__agent_list()
EOF

# 3. Test with real agents
# Trigger test-mcp.md in Claude Code
# Verify coordination works
```

### Testing Hooks

```bash
# 1. Test hook script directly
.claude/hooks/custom-validation.sh "test.ts" "pre-edit"

# 2. Verify JSON response
RESPONSE=$(.claude/hooks/custom-validation.sh "test.ts")
echo "$RESPONSE" | jq -e '.continue == true'

# 3. Test via Claude Code
# Trigger Write/Edit tool
# Verify hook fires and validates

# 4. Check memory storage
sqlite3 .swarm/memory.db "SELECT * FROM memory_entries WHERE namespace='hooks' ORDER BY created_at DESC LIMIT 5;"
```

### Testing Skills

```bash
# 1. Verify skill detected
# Restart Claude Code
# Check skill appears in list

# 2. Test skill scripts
cd ~/.claude/skills/my-skill
./scripts/execute.sh --test

# 3. Trigger skill via prompt
cat > test-skill.md << 'EOF'
Use the My Skill to generate a widget.

Expected output:
- File in sessions/$SESSION_ID/artifacts/code/widget.ts
- Tests in sessions/$SESSION_ID/artifacts/tests/widget.test.ts
EOF

# 4. Verify outputs created
ls sessions/*/artifacts/code/widget.ts
ls sessions/*/artifacts/tests/widget.test.ts
```

### Testing Slash Commands

```bash
# 1. Create test command
cat > .claude/commands/test-cmd.md << 'EOF'
Test command that prints diagnostic info.

Steps:
1. Print current directory
2. List session artifacts
3. Show git status
4. Report success
EOF

# 2. Invoke command in Claude Code
/test-cmd

# 3. Verify Claude follows steps
# Check outputs match expected behavior
```

---

## Examples Repository

Complete working examples are available in:

```
sessions/session-20251117-*/artifacts/
├── code/
│   ├── episodes/episode-recorder.js          # ReasoningBank integration
│   └── custom-mcp-example/                    # Custom MCP server
├── tests/
│   ├── hooks-cascade-test.sh                  # Hook testing
│   └── skill-integration-test.sh              # Skill testing
└── docs/
    ├── mcp-integration-guide.md               # MCP patterns
    └── custom-workflow-example.md             # Complete workflow
```

### Example 1: Complete Custom Workflow

See `sessions/session-20251117-100232-docs-refactor-tutor/artifacts/docs/workflow-example.md`

### Example 2: Custom MCP Server

See `sessions/session-20251117-002737-hive-mind-100-integration/artifacts/code/mcp-server-example/`

### Example 3: Advanced Hook Cascade

See `.claude/hooks/README.md` - Section "Cascade Pattern"

---

## Troubleshooting

### MCP Server Not Detected

**Symptoms**: `mcp__custom__tool` not available

**Solutions**:
1. Verify MCP server added: `claude mcp list`
2. Check `.claude/settings.json` includes server in `enabledMcpjsonServers`
3. Restart Claude Code
4. Test MCP directly: `claude mcp call server-name tool-name '{}'`

### Hook Not Firing

**Symptoms**: Hook script not executing on tool use

**Solutions**:
1. Verify `.claude/settings.json` syntax with `jq . .claude/settings.json`
2. Check hook matcher pattern matches tool name exactly
3. Ensure hook script is executable: `chmod +x .claude/hooks/*.sh`
4. Test hook manually: `.claude/hooks/script.sh "file.txt"`
5. Enable debug: Add `"debug": true` to hooks config

### Skill Not Appearing

**Symptoms**: Skill not in Claude's skill list

**Solutions**:
1. Verify skill is at top level: `ls ~/.claude/skills/my-skill/SKILL.md`
2. Check YAML frontmatter syntax (no tabs, proper quotes)
3. Restart Claude Code or reload Claude.ai
4. Verify `name` and `description` are under character limits
5. Test YAML parsing: `npx js-yaml .claude/skills/my-skill/SKILL.md`

### Slash Command Not Working

**Symptoms**: `/command` not recognized

**Solutions**:
1. Verify file exists: `ls .claude/commands/command.md`
2. Check file has `.md` extension
3. Restart Claude Code
4. Test command expansion manually by reading file

### Stock Adherence Below 95%

**Symptoms**: Too much custom code

**Solutions**:
1. Replace custom logic with stock claude-flow CLI calls
2. Use stock MCP tools instead of custom coordination
3. Leverage Claude Code native tools (Read, Write, Edit)
4. Remove filesystem monkey-patching
5. Document why custom code is required (should be <5%)

---

## Best Practices Summary

### MCP Integration
- Coordination-only, no direct execution
- Follow MCP spec: https://spec.modelcontextprotocol.io/
- Document in CLAUDE.md
- Test with stock tooling

### Hook Creation
- Return valid JSON responses
- Use stock claude-flow hooks
- Store in SQLite/MCP memory
- No filesystem interception
- Keep execution under 100ms

### Skill Development
- YAML frontmatter required
- Progressive disclosure (metadata → instructions → reference)
- Top-level directory structure
- Executable scripts documented
- Stock tools only

### Slash Commands
- Clear step-by-step instructions
- Session artifacts file routing
- Explicit tool usage
- Documented deliverables
- Stock coordination patterns

### Stock Adherence
- Measure adherence: ≥95%
- Use stock CLI commands
- Leverage native Claude Code tools
- No monkey-patching
- Document exceptions

---

## Resources

**Official Documentation**:
- Claude Code: https://docs.claude.com/claude-code
- Claude Skills: https://docs.claude.com/agents-and-tools/agent-skills
- MCP Spec: https://spec.modelcontextprotocol.io/

**Workspace Documentation**:
- CLAUDE.md - Integration patterns
- .claude/hooks/README.md - Hook system architecture
- .claude/skills/skill-builder/SKILL.md - Skill creation guide
- docs/explanation/ - Core concepts explained

**Example Code**:
- sessions/session-*/artifacts/ - Working examples
- .claude/skills/ - Production skills
- .claude/commands/ - Slash command catalog

**Community**:
- GitHub Issues: Report bugs and feature requests
- Discussions: Share patterns and workflows

---

**Last Updated**: 2025-11-18
**Stock Adherence**: 98% (hooks system migrated to native cascade)
**Maintained By**: agentic-flow workspace team
