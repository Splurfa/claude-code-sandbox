# Memory Namespace Conventions

## Overview

Stock claude-flow memory system uses namespaces to organize data. This document defines standard namespace conventions, naming patterns, and TTL guidelines for consistent memory usage across agents and sessions.

**Key principle**: Namespaces create logical boundaries for memory isolation and querying.

## Standard Namespaces

### 1. `captains-log`

**Purpose**: Human-readable journal of decisions, insights, and blockers.

**Key pattern**: `journal:YYYY-MM-DD-HH:MM:SS`

**TTL**: Indefinite (manual cleanup)

**Usage**:
```bash
# Store decision entry
npx claude-flow@alpha memory store \
  --namespace "captains-log" \
  --key "journal:2025-11-13-09:00:00" \
  --value '{"type": "decision", "title": "...", "content": "..."}'

# Query all journal entries
npx claude-flow@alpha memory search \
  --namespace "captains-log" \
  --pattern "journal:*"

# Query today's entries
npx claude-flow@alpha memory search \
  --namespace "captains-log" \
  --pattern "journal:$(date -u +"%Y-%m-%d")-*"
```

**Entry types**: `decision`, `insight`, `blocker`, `milestone`, `question`

### 2. `hooks:*` (Hook-specific namespaces)

**Purpose**: Store hook execution state and metadata.

**Sub-namespaces**:
- `hooks:pre-task` - Pre-task hook data
- `hooks:post-task` - Post-task hook data
- `hooks:post-edit` - File edit metadata
- `hooks:session` - Session state

**Key patterns**:
- `task-{timestamp}-{random}` - Task IDs
- `session-{timestamp}` - Session IDs
- `file:{path}` - File metadata

**TTL**: 7 days (auto-cleanup after session ends)

**Usage**:
```bash
# Store task metadata (automatic via hooks)
npx claude-flow@alpha hooks pre-task --description "Build API"
# Creates: hooks:pre-task/task-1763015548037-2cal1ylpy

# Store file edit metadata (automatic via hooks)
npx claude-flow@alpha hooks post-edit --file "src/app.ts"
# Creates: hooks:post-edit/file:src/app.ts

# Query hook history
npx claude-flow@alpha memory search \
  --namespace "hooks:pre-task" \
  --pattern "task-*"
```

### 3. `session-state`

**Purpose**: Store session-specific state that persists across agent executions.

**Key patterns**:
- `current-task` - Active task ID
- `agent-{name}-status` - Agent status
- `workflow-stage` - Current workflow stage

**TTL**: Session duration (cleared at session-end)

**Usage**:
```bash
# Store current task
npx claude-flow@alpha memory store \
  --namespace "session-state" \
  --key "current-task" \
  --value "task-1763015548037-2cal1ylpy" \
  --ttl 86400

# Store agent status
npx claude-flow@alpha memory store \
  --namespace "session-state" \
  --key "agent-coder-status" \
  --value '{"status": "working", "file": "src/auth.ts", "progress": 0.65}'

# Query session state
npx claude-flow@alpha memory search \
  --namespace "session-state" \
  --pattern "*"
```

### 4. `architecture`

**Purpose**: Store architectural decisions, patterns, and system design.

**Key patterns**:
- `decision-{topic}` - Architecture decisions
- `pattern-{name}` - Design patterns in use
- `api-contract-{service}` - API contracts

**TTL**: Indefinite (manual updates)

**Usage**:
```bash
# Store architecture decision
npx claude-flow@alpha memory store \
  --namespace "architecture" \
  --key "decision-database-choice" \
  --value '{
    "decision": "PostgreSQL",
    "rationale": "ACID compliance, JSON support, mature ecosystem",
    "alternatives": ["MongoDB", "MySQL"],
    "date": "2025-11-13"
  }'

# Store API contract
npx claude-flow@alpha memory store \
  --namespace "architecture" \
  --key "api-contract-auth-service" \
  --value '{
    "service": "auth",
    "endpoints": [
      {"method": "POST", "path": "/login", "body": {"email": "string", "password": "string"}},
      {"method": "POST", "path": "/refresh", "body": {"refreshToken": "string"}}
    ]
  }'

# Query architecture decisions
npx claude-flow@alpha memory search \
  --namespace "architecture" \
  --pattern "decision-*"
```

### 5. `swarm/*` (Agent coordination namespaces)

**Purpose**: Coordinate agent activity, share state, and communicate between agents.

**Sub-namespaces**:
- `swarm/progress` - Agent progress updates
- `swarm/deliverables` - Completed work artifacts
- `swarm/coordination` - Inter-agent communication
- `swarm/validation` - Self-validation results

**Key patterns**:
- `{agent-name}/status` - Agent status
- `{agent-name}/deliverables` - Agent outputs
- `shared/{topic}` - Shared data

**TTL**: Session duration (24 hours default)

**Usage**:
```bash
# Agent reports progress
npx claude-flow@alpha memory store \
  --namespace "swarm/progress" \
  --key "worker-1/status" \
  --value "COMPLETE - Infrastructure files created" \
  --ttl 86400

# Agent shares deliverable
npx claude-flow@alpha memory store \
  --namespace "swarm/deliverables" \
  --key "worker-2/test-results" \
  --value '{"tests_created": 15, "coverage": "94%", "all_passing": true}'

# Agent queries peer status
npx claude-flow@alpha memory retrieve \
  --namespace "swarm/progress" \
  --key "worker-1/status"

# Coordinator checks all agent status
npx claude-flow@alpha memory search \
  --namespace "swarm/progress" \
  --pattern "*/status"
```

## Naming Patterns

### Key Naming Best Practices

1. **Descriptive**: Keys should be self-documenting
2. **Hierarchical**: Use `/` for logical grouping
3. **Consistent**: Stick to established patterns
4. **Timestamped**: Include timestamps for time-series data
5. **Avoid conflicts**: Use unique suffixes if needed

### Examples

#### ✅ Good Key Names
```
journal:2025-11-13-09:00:00
architecture/decision-database-choice
swarm/worker-1/status
hooks:pre-task/task-1763015548037-2cal1ylpy
session-state/current-task
```

#### ❌ Bad Key Names
```
j1  # Too cryptic
mykey  # Not descriptive
temp  # Ambiguous
test123  # No context
data  # Too generic
```

## TTL (Time-To-Live) Guidelines

### Indefinite (No TTL)

**When to use**: Data that should persist across all sessions.

**Examples**:
- Captain's log entries
- Architecture decisions
- Project documentation
- Configuration

```bash
npx claude-flow@alpha memory store \
  --namespace "captains-log" \
  --key "journal:2025-11-13-09:00:00" \
  --value '{...}'
  # No --ttl flag = indefinite
```

### Session Duration (24 hours)

**When to use**: Session-specific data that's not needed after session ends.

**Examples**:
- Agent status
- Coordination state
- Temporary results

```bash
npx claude-flow@alpha memory store \
  --namespace "swarm/progress" \
  --key "worker-1/status" \
  --value "WORKING" \
  --ttl 86400  # 24 hours
```

### Short-lived (1 hour)

**When to use**: Very temporary data for immediate coordination.

**Examples**:
- Cache results
- Ephemeral messages
- Lock states

```bash
npx claude-flow@alpha memory store \
  --namespace "swarm/coordination" \
  --key "lock-file-edit" \
  --value "worker-2" \
  --ttl 3600  # 1 hour
```

## Query Best Practices

### 1. Use Specific Namespaces

```bash
# ✅ Good: Specific namespace
npx claude-flow@alpha memory search \
  --namespace "captains-log" \
  --pattern "journal:2025-11-13-*"

# ❌ Avoid: Wildcard namespace (slow)
npx claude-flow@alpha memory search \
  --namespace "*" \
  --pattern "*"
```

### 2. Use Specific Patterns

```bash
# ✅ Good: Specific pattern
npx claude-flow@alpha memory search \
  --namespace "swarm/progress" \
  --pattern "worker-*/status"

# ❌ Avoid: Too broad
npx claude-flow@alpha memory search \
  --namespace "swarm/progress" \
  --pattern "*"
```

### 3. Filter Results

```bash
# Search and filter by entry type
npx claude-flow@alpha memory search \
  --namespace "captains-log" \
  --pattern "journal:*" | grep "\"type\": \"blocker\""

# Search and filter by date range
npx claude-flow@alpha memory search \
  --namespace "captains-log" \
  --pattern "journal:2025-11-1[0-3]-*"
```

### 4. Retrieve vs Search

```bash
# ✅ Use retrieve for exact keys (fast)
npx claude-flow@alpha memory retrieve \
  --namespace "session-state" \
  --key "current-task"

# ❌ Don't use search for exact keys
npx claude-flow@alpha memory search \
  --namespace "session-state" \
  --pattern "current-task"
```

## Custom Namespaces

**When to create custom namespaces**:
- Domain-specific data (e.g., `payment-transactions`)
- Specialized workflows (e.g., `deployment-state`)
- External integrations (e.g., `github-sync`)

**Guidelines**:
1. Use descriptive names
2. Document purpose
3. Define key patterns
4. Set appropriate TTL defaults
5. Add to this guide

**Example**:
```bash
# Custom namespace for ML model training
npx claude-flow@alpha memory store \
  --namespace "ml-training" \
  --key "model-v1.2.3/metrics" \
  --value '{"accuracy": 0.94, "loss": 0.12, "epoch": 50}' \
  --ttl 2592000  # 30 days
```

## Namespace Cleanup

### Manual Cleanup

```bash
# Delete specific namespace
npx claude-flow@alpha memory delete \
  --namespace "swarm/progress" \
  --key "*"

# Delete old journal entries (compress instead of delete)
gzip sessions/captains-log/2025-10-*.md
```

### Automatic Cleanup (TTL)

```bash
# Entries with TTL expire automatically
# No manual cleanup needed

# Check remaining TTL (if supported)
npx claude-flow@alpha memory retrieve \
  --namespace "session-state" \
  --key "current-task" \
  --show-metadata
```

## Troubleshooting

### Issue: Can't Find Memory Entry

**Solutions**:
```bash
# 1. List all namespaces
npx claude-flow@alpha memory list-namespaces

# 2. Search all patterns in namespace
npx claude-flow@alpha memory search \
  --namespace "swarm/progress" \
  --pattern "*"

# 3. Check spelling and format
# Pattern: journal:2025-11-13-09:00:00
#          └─────┘ └──────────────────┘
#          prefix   timestamp (exact format)
```

### Issue: Memory Overuse

**Solutions**:
```bash
# 1. Check memory size
du -sh .swarm/memory.db

# 2. Delete old coordination data
npx claude-flow@alpha memory delete \
  --namespace "swarm/coordination" \
  --key "*"

# 3. Set shorter TTLs for temporary data
npx claude-flow@alpha memory store \
  --namespace "swarm/temp" \
  --key "data" \
  --value "{...}" \
  --ttl 3600  # 1 hour instead of 24
```

---

**Remember**: Consistent namespace conventions make memory queryable, maintainable, and scalable. When in doubt, use existing namespaces rather than creating new ones.
