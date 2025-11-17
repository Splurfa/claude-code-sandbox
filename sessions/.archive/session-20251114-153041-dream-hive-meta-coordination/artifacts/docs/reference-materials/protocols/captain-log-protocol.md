# Captain's Log Protocol

## Overview

The Captain's Log is a human-readable journal system for documenting decisions, insights, blockers, and context during development workflows. It uses stock claude-flow memory commands to create searchable, timestamped entries that persist across sessions.

**Purpose**: Capture the "why" behind decisions, track blockers, document insights, and maintain project context.

**Implementation**: 100% stock claude-flow memory commands - no custom code required.

## Entry Format Convention

### Key Pattern
```
journal:YYYY-MM-DD-HH:MM:SS
```

- **Prefix**: Always `journal:` for easy filtering
- **Timestamp**: ISO-8601 format (e.g., `2025-11-13-06:30:45`)
- **Sorting**: Chronological ordering via timestamp

### Namespace
```
captains-log
```

All journal entries use the `captains-log` namespace for isolation and easy querying.

### Entry Structure
```json
{
  "timestamp": "2025-11-13T06:30:45Z",
  "type": "decision|insight|blocker|milestone|question",
  "author": "user|ai-agent-name",
  "title": "Brief description",
  "content": "Detailed narrative",
  "tags": ["tag1", "tag2"],
  "context": {
    "task_id": "optional-task-reference",
    "related_files": ["file1.js", "file2.ts"],
    "related_entries": ["journal:2025-11-12-14:20:00"]
  },
  "hitl_reviewed": true|false
}
```

## Session Summary Source

- Each session maintains `sessions/<session-id>/artifacts/session-summary.md`.
- After you approve that summary during closeout, copy its content (or the relevant sections) into the Captain's Log entry for that session's wrap-up.
- Reference the artifact path in the log entry so future readers can open the full file if needed:
  ```json
  "context": {
    "related_files": [
      "sessions/session-2025-11-13-1/artifacts/session-summary.md"
    ]
  }
  ```

## Usage

### Creating Entries

#### Basic Entry Creation
```bash
npx claude-flow@alpha memory store \
  --namespace "captains-log" \
  --key "journal:2025-11-13-06:30:45" \
  --value '{
    "timestamp": "2025-11-13T06:30:45Z",
    "type": "decision",
    "author": "user",
    "title": "Chose PostgreSQL over MongoDB",
    "content": "Decided to use PostgreSQL for structured data with ACID guarantees. MongoDB considered but rejected due to complex join requirements and need for strong consistency.",
    "tags": ["database", "architecture"],
    "context": {
      "task_id": "task-1763015548037-2cal1ylpy",
      "related_files": ["src/database/config.ts"]
    },
    "hitl_reviewed": true
  }'
```

### Entry Types and Examples

#### 1. Decision Entry
**When to use**: Document significant technical or architectural decisions.

```bash
npx claude-flow@alpha memory store \
  --namespace "captains-log" \
  --key "journal:2025-11-13-08:15:30" \
  --value '{
    "timestamp": "2025-11-13T08:15:30Z",
    "type": "decision",
    "author": "architect-agent",
    "title": "API versioning strategy",
    "content": "Implemented URL-based versioning (/v1/, /v2/) rather than header-based. Reasoning: Better cache-ability, clearer to developers, simpler routing. Considered header versioning but adds complexity for clients.",
    "tags": ["api", "versioning", "architecture"],
    "context": {
      "task_id": "task-arch-001",
      "related_files": ["src/routes/index.ts"]
    },
    "hitl_reviewed": false
  }'
```

#### 2. Insight Entry
**When to use**: Capture learnings, patterns discovered, or optimization opportunities.

```bash
npx claude-flow@alpha memory store \
  --namespace "captains-log" \
  --key "journal:2025-11-13-09:45:12" \
  --value '{
    "timestamp": "2025-11-13T09:45:12Z",
    "type": "insight",
    "author": "perf-analyzer",
    "title": "N+1 query pattern discovered in user endpoints",
    "content": "Found 15 N+1 query instances in user-related endpoints causing 200ms+ latency. Pattern: Loading user, then iterating to fetch related data. Solution: Use JOIN queries with eager loading. Estimated 80% latency reduction.",
    "tags": ["performance", "database", "optimization"],
    "context": {
      "related_files": ["src/services/user.service.ts", "src/repositories/user.repository.ts"]
    },
    "hitl_reviewed": false
  }'
```

#### 3. Blocker Entry
**When to use**: Document impediments requiring resolution or escalation.

```bash
npx claude-flow@alpha memory store \
  --namespace "captains-log" \
  --key "journal:2025-11-13-10:20:00" \
  --value '{
    "timestamp": "2025-11-13T10:20:00Z",
    "type": "blocker",
    "author": "coder-agent",
    "title": "Missing API credentials for third-party service",
    "content": "Cannot complete Stripe payment integration without production API keys. Development keys present but insufficient for testing webhook signatures. HITL approval required to proceed with key rotation.",
    "tags": ["blocker", "credentials", "stripe", "hitl-required"],
    "context": {
      "task_id": "task-payment-001",
      "related_files": ["src/services/payment.service.ts"]
    },
    "hitl_reviewed": true
  }'
```

#### 4. Milestone Entry
**When to use**: Mark significant project achievements or phase completions.

```bash
npx claude-flow@alpha memory store \
  --namespace "captains-log" \
  --key "journal:2025-11-13-11:00:00" \
  --value '{
    "timestamp": "2025-11-13T11:00:00Z",
    "type": "milestone",
    "author": "coordinator-agent",
    "title": "Authentication system complete",
    "content": "Completed full authentication system with JWT tokens, refresh tokens, password reset flow, and 2FA. All tests passing (94% coverage). Security audit complete with zero critical issues. Ready for staging deployment.",
    "tags": ["milestone", "authentication", "security"],
    "context": {
      "task_id": "task-auth-final",
      "related_files": ["src/auth/*"],
      "related_entries": ["journal:2025-11-10-09:00:00"]
    },
    "hitl_reviewed": true
  }'
```

#### 5. Question Entry
**When to use**: Document open questions requiring HITL input or team discussion.

```bash
npx claude-flow@alpha memory store \
  --namespace "captains-log" \
  --key "journal:2025-11-13-12:30:00" \
  --value '{
    "timestamp": "2025-11-13T12:30:00Z",
    "type": "question",
    "author": "ai-agent",
    "title": "Data retention policy unclear",
    "content": "How long should we retain deleted user data? Options: (1) Immediate hard delete, (2) 30-day soft delete, (3) 90-day retention for compliance. Need HITL decision based on legal/compliance requirements.",
    "tags": ["question", "compliance", "data-retention", "hitl-required"],
    "context": {
      "related_entries": ["journal:2025-11-12-15:00:00"]
    },
    "hitl_reviewed": false
  }'
```

## Querying Entries

### Search All Entries
```bash
npx claude-flow@alpha memory search \
  --namespace "captains-log" \
  --pattern "journal:*"
```

### Date Range Queries

#### Today's Entries
```bash
npx claude-flow@alpha memory search \
  --namespace "captains-log" \
  --pattern "journal:2025-11-13-*"
```

#### Specific Date Range
```bash
# Entries from November 10-13
npx claude-flow@alpha memory search \
  --namespace "captains-log" \
  --pattern "journal:2025-11-1[0-3]-*"
```

### Filter by Entry Type
```bash
# Search entry content for specific types
npx claude-flow@alpha memory search \
  --namespace "captains-log" \
  --pattern "*" | grep "\"type\": \"blocker\""
```

### Find Entries by Tag
```bash
# Search for entries with specific tags
npx claude-flow@alpha memory search \
  --namespace "captains-log" \
  --pattern "*" | grep "\"tags\".*\"architecture\""
```

### HITL Review Status
```bash
# Find entries requiring HITL review
npx claude-flow@alpha memory search \
  --namespace "captains-log" \
  --pattern "*" | grep "\"hitl_reviewed\": false"
```

## HITL Approval Workflow

### When to Get HITL Approval

**ALWAYS require HITL approval for**:
- Blocker entries involving credentials or sensitive data
- Questions requiring business/legal decisions
- Decisions involving significant cost implications
- Milestone entries before production deployment

**OPTIONAL HITL approval for**:
- Routine decision entries (technical choices)
- Insight entries (informational)
- AI-generated entries (may review in batch)

### Approval Process

1. **Create entry with `hitl_reviewed: false`**
2. **Present to user for review**
3. **Update entry with approval status**

```bash
# Step 1: Create entry requiring approval
npx claude-flow@alpha memory store \
  --namespace "captains-log" \
  --key "journal:2025-11-13-13:00:00" \
  --value '{"type": "decision", "hitl_reviewed": false, ...}'

# Step 2: User reviews and approves

# Step 3: Update with approval
npx claude-flow@alpha memory store \
  --namespace "captains-log" \
  --key "journal:2025-11-13-13:00:00" \
  --value '{"type": "decision", "hitl_reviewed": true, ...}'
```

### Sensitive Information Handling

**NEVER log**:
- API keys, tokens, credentials
- Passwords or password hashes
- Personally identifiable information (PII)
- Customer data
- Financial details

**REDACT before logging**:
```bash
# BAD: Exposes credential
"content": "Updated Stripe key to sk_live_abc123xyz..."

# GOOD: Redacted
"content": "Updated Stripe key to sk_live_[REDACTED]"
```

## Best Practices

### 1. Timestamp Precision
Use consistent timestamp format for reliable sorting:
```bash
# Generate timestamp in correct format
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
KEY="journal:$(date -u +"%Y-%m-%d-%H:%M:%S")"
```

### 2. User vs AI Distinction
Always specify author to track decision provenance:
- `"author": "user"` - Human decisions
- `"author": "architect-agent"` - AI agent decisions
- `"author": "coordinator-agent"` - Swarm orchestration

### 3. Cross-Referencing
Link related entries for context:
```json
{
  "context": {
    "related_entries": [
      "journal:2025-11-12-14:20:00",
      "journal:2025-11-13-08:15:30"
    ]
  }
}
```

### 4. Tagging Conventions
Use consistent tags for easy filtering:
- **Domain**: `architecture`, `database`, `api`, `security`, `performance`
- **Status**: `hitl-required`, `blocker`, `resolved`
- **Type**: Use entry type field, not tags

### 5. Entry Granularity
- **Too fine-grained**: Every variable name choice
- **Too coarse**: "Built entire API"
- **Just right**: Significant decisions, insights, milestones

### 6. Narrative Quality
Write entries for future humans (including yourself):
- **WHY** decisions were made (rationale)
- **WHAT** alternatives were considered
- **HOW** decisions impact the system
- **WHEN** decisions should be revisited

### 7. Session Integration
Reference task IDs from hooks:
```bash
# Pre-task hook creates task ID
npx claude-flow@alpha hooks pre-task --description "Build API"
# Output: 🆔 Task ID: task-1763015548037-2cal1ylpy

# Reference in captain's log
"context": {
  "task_id": "task-1763015548037-2cal1ylpy"
}
```

### 8. Batch Review Process
End-of-session review of unreviewed entries:
```bash
# Find all unreviewed entries from today
npx claude-flow@alpha memory search \
  --namespace "captains-log" \
  --pattern "journal:$(date -u +"%Y-%m-%d")-*" | \
  grep "\"hitl_reviewed\": false"
```

## Integration with Session Lifecycle

### Session Start
Review previous session entries for context:
```bash
npx claude-flow@alpha memory search \
  --namespace "captains-log" \
  --pattern "journal:*" | tail -n 10
```

### During Session
Log decisions and insights as they occur (real-time journaling).

### Session Closeout
Ensure all critical entries have HITL review before archiving.

During closeout:
1. Review `session-summary.md` in the session's artifacts folder.
2. Approve or edit the summary text.
3. Store the final summary as a Captain's Log entry (type `milestone` or `decision`) referencing the summary file path.

## Troubleshooting

### Issue: Duplicate Keys
**Symptom**: Overwrites previous entry with same timestamp
**Solution**: Add milliseconds or unique suffix
```bash
KEY="journal:2025-11-13-14:30:00-001"
```

### Issue: Can't Find Recent Entries
**Symptom**: Search returns nothing
**Solution**: Verify namespace and key pattern
```bash
# List all namespaces
npx claude-flow@alpha memory list-namespaces

# Check exact keys
npx claude-flow@alpha memory search --namespace "captains-log" --pattern "*"
```

### Issue: Entry Too Large
**Symptom**: Memory storage fails
**Solution**: Split large entries or reference external files
```json
{
  "content": "See detailed analysis in docs/analysis-2025-11-13.md",
  "context": {
    "external_file": "docs/analysis-2025-11-13.md"
  }
}
```

## Example Session Flow

```bash
# 1. Session start - review previous context
npx claude-flow@alpha hooks pre-task --description "Add payment integration"
npx claude-flow@alpha memory search --namespace "captains-log" --pattern "journal:*" | tail -5

# 2. During work - log decision
npx claude-flow@alpha memory store \
  --namespace "captains-log" \
  --key "journal:2025-11-13-14:00:00" \
  --value '{"type": "decision", "title": "Using Stripe over PayPal", ...}'

# 3. Hit blocker - log and request HITL
npx claude-flow@alpha memory store \
  --namespace "captains-log" \
  --key "journal:2025-11-13-14:30:00" \
  --value '{"type": "blocker", "title": "Need production Stripe keys", "hitl_reviewed": false, ...}'

# 4. User provides keys - log resolution
npx claude-flow@alpha memory store \
  --namespace "captains-log" \
  --key "journal:2025-11-13-14:45:00" \
  --value '{"type": "milestone", "title": "Stripe integration complete", "hitl_reviewed": true, ...}'

# 5. Session end - archive
npx claude-flow@alpha hooks post-task --task-id "task-payment-001"
```

---

**Remember**: The Captain's Log is your project's memory. Write for clarity, context, and future understanding. When in doubt, log the "why" behind decisions - future you will thank present you.
