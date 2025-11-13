# HITL (Human-in-the-Loop) Workflow

## Overview

Human-in-the-Loop (HITL) is a Byzantine fault-tolerant approval mechanism that ensures critical decisions receive human oversight before execution. This workflow defines when, how, and why agents must request approval.

**Philosophy**: Trust is earned, not assumed. Autonomous agents operate within approved boundaries, escalating when approaching limits.

## The Three Enforcement Levels

### 🟢 Level 1: Auto (No HITL Required)

**Definition**: Routine operations with low risk and high reversibility.

**Examples**:
- Code formatting (Prettier, ESLint)
- Running tests
- Reading files
- Querying memory
- Generating documentation
- Basic file edits (typo fixes, comment updates)
- Installing development dependencies

**Stock commands**:
```bash
# These run automatically without approval
npx prettier --write src/
npm test
npx claude-flow@alpha memory search --namespace "captains-log" --pattern "*"
```

**When to use**: Operations that can be easily undone or have no lasting impact.

### 🟡 Level 2: Ask First (HITL Checkpoint)

**Definition**: Significant operations requiring informed consent before execution.

**Examples**:
- Database migrations
- Production deployments
- Architecture changes
- Adding new dependencies
- Deleting files or directories
- Changing API contracts
- Modifying authentication logic

**Approval pattern**:
```bash
# 1. Agent proposes action
echo "Proposed action: Run database migration (add user_roles table)"
echo "Impact: Adds new table, no data loss risk"
echo "Reversibility: Can rollback with down migration"

# 2. Request HITL approval
npx claude-flow@alpha memory store \
  --namespace "captains-log" \
  --key "journal:$(date -u +"%Y-%m-%d-%H:%M:%S")" \
  --value '{
    "timestamp": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'",
    "type": "question",
    "author": "database-agent",
    "title": "Approval needed: Database migration",
    "content": "Ready to apply migration: add user_roles table. Impact: New table for role-based access control. Rollback available. Proceed?",
    "tags": ["hitl-required", "database", "migration"],
    "context": {
      "task_id": "task-1763015548037-2cal1ylpy",
      "related_files": ["migrations/20251113_add_user_roles.sql"]
    },
    "hitl_reviewed": false
  }'

# 3. Wait for HITL approval (user reviews and responds)

# 4. Execute after approval
npx knex migrate:latest

# 5. Log outcome
npx claude-flow@alpha memory store \
  --namespace "captains-log" \
  --key "journal:$(date -u +"%Y-%m-%d-%H:%M:%S")" \
  --value '{
    "timestamp": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'",
    "type": "milestone",
    "author": "database-agent",
    "title": "Database migration complete",
    "content": "Successfully applied migration: user_roles table created. Zero downtime, rollback tested.",
    "tags": ["database", "migration", "complete"],
    "hitl_reviewed": true
  }'
```

**When to use**: Operations with moderate risk or significant impact.

### 🔴 Level 3: Never Auto (Always HITL)

**Definition**: High-risk operations that should NEVER be automated without explicit approval.

**Examples**:
- Handling credentials (API keys, passwords, tokens)
- Deleting production data
- Financial transactions
- User data access
- Security configuration changes
- Third-party API calls (with cost implications)
- Destructive git operations (force push, hard reset)

**Mandatory approval pattern**:
```bash
# 1. Agent detects high-risk operation
echo "⚠️  HIGH-RISK OPERATION DETECTED"
echo "Action: Configure production Stripe API key"
echo "Risk: Exposes payment credentials"

# 2. Create blocker entry (agent stops immediately)
npx claude-flow@alpha memory store \
  --namespace "captains-log" \
  --key "journal:$(date -u +"%Y-%m-%d-%H:%M:%S")" \
  --value '{
    "timestamp": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'",
    "type": "blocker",
    "author": "coder-agent",
    "title": "BLOCKED: Production API key required",
    "content": "Cannot proceed with Stripe integration without explicit approval to handle production credentials. Options: (1) User provides key via secure method, (2) Use test key for development, (3) Skip payment integration.",
    "tags": ["blocker", "credentials", "hitl-required", "security"],
    "context": {
      "task_id": "task-1763015548037-2cal1ylpy",
      "related_files": ["src/services/payment.service.ts"]
    },
    "hitl_reviewed": false
  }'

# 3. Halt execution (no further action until HITL approval)

# 4. User provides approval + credentials via secure channel

# 5. Agent configures with HITL oversight
export STRIPE_SECRET_KEY="sk_live_[REDACTED]"

# 6. Log completion (with redacted details)
npx claude-flow@alpha memory store \
  --namespace "captains-log" \
  --key "journal:$(date -u +"%Y-%m-%d-%H:%M:%S")" \
  --value '{
    "timestamp": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'",
    "type": "milestone",
    "author": "user",
    "title": "Payment integration configured",
    "content": "Production Stripe credentials configured securely. Environment variables set, integration tests passing.",
    "tags": ["payment", "credentials", "security"],
    "hitl_reviewed": true
  }'
```

**When to use**: Operations involving credentials, production data, financial impact, or irreversible changes.

## Byzantine Enforcement Philosophy

### The Byzantine Generals Problem

In distributed systems, some agents may fail or provide incorrect information. HITL workflow treats all agents as potentially Byzantine (unreliable) and requires verification checkpoints.

**Key principles**:

1. **Verify before trust**: Even well-intentioned agents can make mistakes
2. **Defense in depth**: Multiple checkpoints prevent cascading failures
3. **Explicit over implicit**: Always ask rather than assume permission
4. **Audit trail**: Every HITL decision logged for review

### Trust Boundaries

```
┌──────────────────────────────────────┐
│  Trusted: Human Decisions            │  ← HITL Approval Required
├──────────────────────────────────────┤
│  Semi-Trusted: Agent Proposals       │  ← Agents suggest, HITL decides
├──────────────────────────────────────┤
│  Untrusted: Automatic Execution      │  ← Only for low-risk operations
└──────────────────────────────────────┘
```

## Approval Checkpoint Examples

### Example 1: Architecture Decision

**Scenario**: Agent proposes switching from REST to GraphQL.

```bash
# Agent logs proposal
npx claude-flow@alpha memory store \
  --namespace "captains-log" \
  --key "journal:2025-11-13-09:00:00" \
  --value '{
    "timestamp": "2025-11-13T09:00:00Z",
    "type": "question",
    "author": "architect-agent",
    "title": "Architecture proposal: GraphQL migration",
    "content": "Current REST API has N+1 query issues and overfetching. GraphQL would solve this with single queries and precise data fetching. Tradeoffs: (1) Learning curve for team, (2) Migration effort (~40 hours), (3) Better long-term scalability. Recommendation: Proceed with gradual migration. Approve?",
    "tags": ["architecture", "graphql", "hitl-required"],
    "context": {
      "task_id": "task-arch-001",
      "related_files": ["docs/architecture-proposal.md"]
    },
    "hitl_reviewed": false
  }'

# HITL reviews proposal
# - Reads architecture-proposal.md
# - Evaluates team capacity
# - Considers timeline

# HITL decision: Approved with conditions
npx claude-flow@alpha memory store \
  --namespace "captains-log" \
  --key "journal:2025-11-13-09:30:00" \
  --value '{
    "timestamp": "2025-11-13T09:30:00Z",
    "type": "decision",
    "author": "user",
    "title": "GraphQL migration approved (gradual approach)",
    "content": "Approved GraphQL migration with conditions: (1) Start with new endpoints only, (2) Maintain REST for 6 months, (3) Document migration guide, (4) Train team on GraphQL. Begin implementation next sprint.",
    "tags": ["architecture", "graphql", "approved"],
    "context": {
      "related_entries": ["journal:2025-11-13-09:00:00"]
    },
    "hitl_reviewed": true
  }'
```

### Example 2: Blocker Resolution

**Scenario**: Agent encounters missing dependency.

```bash
# Agent logs blocker
npx claude-flow@alpha memory store \
  --namespace "captains-log" \
  --key "journal:2025-11-13-10:15:00" \
  --value '{
    "timestamp": "2025-11-13T10:15:00Z",
    "type": "blocker",
    "author": "coder-agent",
    "title": "Missing dependency: redis",
    "content": "Session management requires Redis for distributed caching. Options: (1) Install Redis locally, (2) Use cloud Redis (AWS ElastiCache), (3) Alternative session storage (PostgreSQL). Recommendation: Cloud Redis for production-ready setup. Approve?",
    "tags": ["blocker", "infrastructure", "redis", "hitl-required"],
    "context": {
      "task_id": "task-session-001",
      "related_files": ["src/services/session.service.ts"]
    },
    "hitl_reviewed": false
  }'

# HITL makes decision
npx claude-flow@alpha memory store \
  --namespace "captains-log" \
  --key "journal:2025-11-13-10:20:00" \
  --value '{
    "timestamp": "2025-11-13T10:20:00Z",
    "type": "decision",
    "author": "user",
    "title": "Redis setup approved",
    "content": "Approved cloud Redis setup via AWS ElastiCache. Budget: $50/month. Agent authorized to configure connection, store credentials in environment variables (not in code).",
    "tags": ["infrastructure", "redis", "approved"],
    "context": {
      "related_entries": ["journal:2025-11-13-10:15:00"]
    },
    "hitl_reviewed": true
  }'

# Agent proceeds with setup
# ... (configure Redis, test connection)

# Agent logs completion
npx claude-flow@alpha memory store \
  --namespace "captains-log" \
  --key "journal:2025-11-13-10:45:00" \
  --value '{
    "timestamp": "2025-11-13T10:45:00Z",
    "type": "milestone",
    "author": "coder-agent",
    "title": "Redis integration complete",
    "content": "AWS ElastiCache Redis configured and tested. Connection pooling enabled, TTL configured for sessions (24 hours). Performance tests passing.",
    "tags": ["infrastructure", "redis", "complete"],
    "context": {
      "related_entries": ["journal:2025-11-13-10:20:00"]
    },
    "hitl_reviewed": true
  }'
```

### Example 3: Credentials Handling

**Scenario**: Agent needs to configure OAuth provider.

```bash
# Agent detects credential requirement (NEVER AUTO)
npx claude-flow@alpha memory store \
  --namespace "captains-log" \
  --key "journal:2025-11-13-11:00:00" \
  --value '{
    "timestamp": "2025-11-13T11:00:00Z",
    "type": "blocker",
    "author": "security-agent",
    "title": "BLOCKED: OAuth credentials required",
    "content": "Google OAuth integration requires client ID and client secret. SECURITY NOTICE: Agent will NOT handle credentials directly. User must provide via: (1) Environment variables, (2) Secure vault (e.g., AWS Secrets Manager), (3) .env.local file (gitignored). Do NOT paste credentials in chat/logs.",
    "tags": ["blocker", "credentials", "oauth", "security", "hitl-required"],
    "context": {
      "task_id": "task-oauth-001",
      "related_files": ["src/auth/oauth.service.ts", "docs/oauth-setup.md"]
    },
    "hitl_reviewed": false
  }'

# Agent stops and waits

# HITL provides credentials securely (outside agent context)
# User creates .env.local:
# GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
# GOOGLE_CLIENT_SECRET=xxx

# HITL confirms setup
npx claude-flow@alpha memory store \
  --namespace "captains-log" \
  --key "journal:2025-11-13-11:15:00" \
  --value '{
    "timestamp": "2025-11-13T11:15:00Z",
    "type": "milestone",
    "author": "user",
    "title": "OAuth credentials configured",
    "content": "Google OAuth credentials configured in .env.local (gitignored). Agent may now proceed with integration testing. Credentials NEVER logged or stored in memory.",
    "tags": ["oauth", "credentials", "security"],
    "context": {
      "related_entries": ["journal:2025-11-13-11:00:00"]
    },
    "hitl_reviewed": true
  }'
```

## Best Practices

### For Agents

1. **Err on the side of caution**: When in doubt, ask HITL
2. **Provide context**: Explain why approval is needed
3. **Offer options**: Present multiple solutions with tradeoffs
4. **Never fake approval**: Don't proceed without explicit HITL confirmation
5. **Log all HITL interactions**: Use captain's log for audit trail

### For Humans (HITL)

1. **Review promptly**: Blockers stall entire workflow
2. **Provide clear decisions**: "Yes", "No", or "Yes, but..." with conditions
3. **Document rationale**: Explain why decisions were made
4. **Update approval rules**: If agents repeatedly ask for same thing, update Level 1/2 boundaries
5. **Trust, but verify**: Review agent proposals thoroughly

## Troubleshooting

### Issue: Agent Proceeds Without Approval

**Resolution**:
1. Immediately halt operation
2. Review captain's log for unauthorized actions
3. Rollback changes if possible
4. Update agent constraints to prevent recurrence

### Issue: Too Many HITL Requests

**Resolution**:
1. Review approval patterns in captain's log
2. Reclassify frequent approvals to Level 1 (Auto) if low-risk
3. Create pre-approved policies for common scenarios
4. Document updated boundaries

### Issue: Missed HITL Checkpoint

**Resolution**:
1. Audit session backup for unapproved actions
2. Review impact of action
3. Retroactively approve or rollback
4. Add checkpoint to prevent future misses

---

**Remember**: HITL checkpoints exist to protect you and your project. Agents should default to asking rather than assuming permission. Better to wait 5 minutes for approval than spend 5 hours fixing mistakes.
