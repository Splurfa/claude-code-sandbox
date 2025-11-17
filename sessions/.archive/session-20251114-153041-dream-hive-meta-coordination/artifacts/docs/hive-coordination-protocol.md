# Hive Coordination Protocol
**Version:** 1.0
**Last Updated:** 2025-11-14
**Status:** Active Protocol

## Overview

This protocol defines how the Queen Hive coordinates three specialized sub-hives using Byzantine consensus, stock claude-flow infrastructure, and natural language communication. All coordination uses existing tools—no custom frameworks.

---

## Architecture

### Topology Structure

```
Queen Hive (Strategic Coordinator)
├── Star topology
├── Byzantine consensus (2/3 + Queen weighted vote)
└── Coordinates 3 Sub-Hives:
    ├── Sub-Hive 1: Documentation Architects (Ring, 3 workers)
    ├── Sub-Hive 2: Agent Pattern Designers (Mesh, 2 workers)
    └── Sub-Hive 3: Validation & Testing (Hierarchical, 2 workers)
```

### Communication Stack (100% Stock)

| Layer | Technology | Purpose |
|-------|------------|---------|
| State Store | `.swarm/memory.db` (SQLite) | Cross-hive shared state |
| Coordination | `claude-flow hooks` | Pre/post task coordination |
| Logging | `sessions/captains-log/` | Decision narrative |
| Artifacts | `sessions/$SESSION_ID/artifacts/` | Deliverables |
| Messaging | Memory keys + hooks notifications | Worker-to-Queen updates |

---

## Communication Channels

### Memory Key Schema

All sub-hives use structured memory keys for status reporting:

```javascript
// Sub-Hive Status Keys (written by workers, read by Queen)
"hive1/status"          // Documentation Architects overall status
"hive1/worker-1/status" // Individual worker status
"hive1/worker-2/status"
"hive1/worker-3/status"
"hive1/deliverables"    // List of completed artifacts
"hive1/blockers"        // Current blockers requiring escalation

"hive2/status"          // Agent Pattern Designers overall status
"hive2/worker-1/status"
"hive2/worker-2/status"
"hive2/deliverables"
"hive2/blockers"

"hive3/status"          // Validation & Testing overall status
"hive3/worker-1/status"
"hive3/worker-2/status"
"hive3/deliverables"
"hive3/blockers"

// Queen Coordination Keys (written by Queen, read by all)
"queen/directives"      // Strategic instructions
"queen/checkpoints"     // HITL checkpoint requirements
"queen/consensus"       // Byzantine vote results
"queen/escalations"     // Issues requiring user decision
```

### Status Value Format

Each status key contains JSON:

```json
{
  "hive_id": "hive1",
  "worker_id": "worker-1",
  "current_task": "Design architecture diagrams",
  "progress": 0.65,
  "state": "in_progress",
  "last_update": "2025-11-14T15:30:00Z",
  "artifacts_created": [
    "sessions/session-xyz/artifacts/docs/architecture-diagram.md"
  ],
  "blockers": [],
  "consensus_vote": null
}
```

### Hook-Based Coordination Flow

**Workers execute hooks at key lifecycle points:**

```bash
# 1. Before starting work
npx claude-flow@alpha hooks pre-task \
  --description "Worker-1: Design system architecture" \
  --task-id "hive1-worker-1-task-001"

# 2. After creating/editing files
npx claude-flow@alpha hooks post-edit \
  --file "sessions/$SESSION_ID/artifacts/docs/architecture.md" \
  --memory-key "hive1/worker-1/artifacts"

# 3. Notify Queen of progress
npx claude-flow@alpha hooks notify \
  --message "Worker-1 completed architecture diagram (65% overall progress)"

# 4. After completing task
npx claude-flow@alpha hooks post-task \
  --task-id "hive1-worker-1-task-001"
```

**Queen monitors via memory queries:**

```bash
# Check all hive statuses
npx claude-flow@alpha hooks memory get --key "hive1/status"
npx claude-flow@alpha hooks memory get --key "hive2/status"
npx claude-flow@alpha hooks memory get --key "hive3/status"

# Detect blockers across all hives
npx claude-flow@alpha hooks memory search --pattern "hive*/blockers"

# Retrieve all deliverables for checkpoint
npx claude-flow@alpha hooks memory search --pattern "hive*/deliverables"
```

---

## Byzantine Consensus Rules

### Consensus Mechanism

**Voting Weight:**
- Each worker vote = 1 weight
- Queen vote = 3x weight (strategic override capability)
- Total workers across all sub-hives = 7
- Consensus threshold = 2/3 majority

**Decision Types:**

| Decision Type | Consensus Required | Escalation Path |
|--------------|-------------------|-----------------|
| Deliverable completion | 2/3 of sub-hive workers | None if met |
| Cross-hive integration | 2/3 of all workers | Queen vote if tied |
| Strategic direction | Queen vote only | HITL if blocked |
| Quality standards | 100% of Hive 3 (Validation) | HITL if failed |

### Consensus Protocol Implementation

**1. Proposal Phase** (Natural Language)

Worker proposes deliverable completion:

```bash
# Worker stores proposal in memory
npx claude-flow@alpha hooks memory set \
  --key "hive1/proposals/arch-diagram-complete" \
  --value '{
    "proposer": "worker-1",
    "deliverable": "architecture-diagram.md",
    "timestamp": "2025-11-14T15:30:00Z",
    "artifact_path": "sessions/$SESSION_ID/artifacts/docs/architecture-diagram.md",
    "votes": {}
  }'

# Worker notifies hive members
npx claude-flow@alpha hooks notify \
  --message "Proposal: Architecture diagram ready for consensus vote (hive1/proposals/arch-diagram-complete)"
```

**2. Voting Phase** (Memory + Hooks)

Each worker reviews and votes:

```bash
# Worker-2 reviews artifact and votes
npx claude-flow@alpha hooks memory set \
  --key "hive1/proposals/arch-diagram-complete/votes/worker-2" \
  --value '{
    "voter": "worker-2",
    "vote": "approve",
    "timestamp": "2025-11-14T15:35:00Z",
    "comments": "Diagrams are clear and comprehensive"
  }'

# Worker-3 votes
npx claude-flow@alpha hooks memory set \
  --key "hive1/proposals/arch-diagram-complete/votes/worker-3" \
  --value '{
    "voter": "worker-3",
    "vote": "approve",
    "timestamp": "2025-11-14T15:36:00Z",
    "comments": "Approved with minor suggestions"
  }'
```

**3. Consensus Calculation** (Queen monitors)

Queen tallies votes via memory search:

```bash
# Retrieve all votes for proposal
npx claude-flow@alpha hooks memory search \
  --pattern "hive1/proposals/arch-diagram-complete/votes/*"

# Queen records consensus result
npx claude-flow@alpha hooks memory set \
  --key "queen/consensus/arch-diagram-complete" \
  --value '{
    "proposal_id": "arch-diagram-complete",
    "total_voters": 3,
    "approve": 3,
    "reject": 0,
    "abstain": 0,
    "consensus_reached": true,
    "queen_override": false,
    "timestamp": "2025-11-14T15:37:00Z"
  }'
```

**4. Disagreement Escalation**

If consensus fails (< 2/3 approval):

```bash
# Queen escalates to HITL checkpoint
npx claude-flow@alpha hooks memory set \
  --key "queen/escalations/arch-diagram-dispute" \
  --value '{
    "proposal_id": "arch-diagram-complete",
    "hive_id": "hive1",
    "vote_breakdown": {"approve": 1, "reject": 2},
    "reason": "Workers disagree on diagram completeness",
    "escalation_type": "HITL_CHECKPOINT",
    "requires_user_decision": true,
    "timestamp": "2025-11-14T15:40:00Z"
  }'

# Queen notifies all hives
npx claude-flow@alpha hooks notify \
  --message "⚠️  Escalation: arch-diagram-dispute requires HITL checkpoint (see queen/escalations)"
```

### Queen Weighted Vote (Strategic Override)

**When to use:** Queen can override consensus if strategic alignment is at risk.

```bash
# Example: 2 workers approve, 1 rejects, but Queen deems it critical
npx claude-flow@alpha hooks memory set \
  --key "queen/consensus/strategic-override-001" \
  --value '{
    "proposal_id": "architecture-diagram-complete",
    "worker_votes": {"approve": 2, "reject": 1},
    "queen_vote": "approve",
    "queen_weight": 3,
    "final_result": "approved_by_queen_override",
    "rationale": "Diagram aligns with project roadmap; minor issues can be refined later",
    "timestamp": "2025-11-14T16:00:00Z"
  }'
```

**Transparency:** All overrides are logged in Captain's Log for human review.

---

## Reporting Structure

### Sub-Hive Deliverable Reports

Each sub-hive creates a final summary report in their artifacts directory:

**Hive 1 (Documentation Architects):**
```
sessions/$SESSION_ID/artifacts/docs/hive1-deliverables-report.md
```

**Contents:**
- List of all artifacts created
- Consensus votes on each deliverable
- Open blockers (if any)
- Lessons learned

**Hive 2 (Agent Pattern Designers):**
```
sessions/$SESSION_ID/artifacts/docs/hive2-deliverables-report.md
```

**Hive 3 (Validation & Testing):**
```
sessions/$SESSION_ID/artifacts/docs/hive3-deliverables-report.md
```

### Queen Aggregation Report

Queen creates a consolidated report for HITL checkpoints:

```
sessions/$SESSION_ID/artifacts/docs/queen-consolidated-report.md
```

**Contents:**
1. **Executive Summary** - Overall progress, consensus status
2. **Sub-Hive Summaries** - Aggregated reports from Hive 1, 2, 3
3. **Consensus History** - All Byzantine votes and results
4. **Escalations** - Issues requiring user decision
5. **Certification Status** - Ready for HITL approval (yes/no)

### HITL Checkpoint Flow

**Checkpoint Trigger Conditions:**
- All sub-hives report 100% deliverable completion
- All Byzantine consensus votes resolved (no pending disputes)
- Validation hive (Hive 3) certifies quality standards met
- Queen certifies strategic alignment

**Checkpoint Execution:**

```bash
# 1. Queen generates consolidated report
# (Manual process: Queen agent reads all hive reports + memory state)

# 2. Queen stores checkpoint readiness
npx claude-flow@alpha hooks memory set \
  --key "queen/checkpoints/checkpoint-001" \
  --value '{
    "checkpoint_id": "checkpoint-001",
    "ready": true,
    "all_hives_complete": true,
    "consensus_resolved": true,
    "validation_passed": true,
    "report_path": "sessions/$SESSION_ID/artifacts/docs/queen-consolidated-report.md",
    "timestamp": "2025-11-14T17:00:00Z"
  }'

# 3. Queen notifies user via hooks
npx claude-flow@alpha hooks notify \
  --message "🎯 HITL Checkpoint Ready: All deliverables complete. Review queen-consolidated-report.md"

# 4. After user approval, Queen archives session
npx claude-flow@alpha hooks session-end \
  --generate-summary true \
  --export-metrics true
```

---

## Stock-First Implementation Guidelines

### What We Use (100% Stock)

✅ **Memory coordination:** `npx claude-flow@alpha hooks memory {get|set|search}`
✅ **Task lifecycle:** `hooks {pre-task|post-task|post-edit|notify}`
✅ **State persistence:** `.swarm/memory.db` (SQLite)
✅ **Logging:** `sessions/captains-log/YYYY-MM-DD.md`
✅ **Artifacts:** `sessions/$SESSION_ID/artifacts/{docs|code|tests|scripts|notes}`
✅ **Backups:** `npx claude-flow@alpha hooks session-end` (creates `.swarm/backups/`)

### What We DON'T Use (No Custom Frameworks)

❌ Custom consensus libraries
❌ Custom message queues
❌ Custom state machines
❌ Custom coordination frameworks
❌ Time-based schedulers or cron jobs

**Why stock-first?**
- Updates are automatic (via `npx claude-flow@alpha` upgrades)
- Maintenance is minimal (no custom code to debug)
- Battle-tested reliability (thousands of users)
- Scale-agnostic (works for 10 or 10,000 items)

---

## Cross-Hive Communication Patterns

### Pattern 1: Status Broadcast (One-to-Many)

**Use case:** Queen announces new directive to all sub-hives

```bash
# Queen writes directive
npx claude-flow@alpha hooks memory set \
  --key "queen/directives/directive-001" \
  --value '{
    "directive": "Prioritize validation testing for API endpoints",
    "target_hives": ["hive1", "hive2", "hive3"],
    "priority": "high",
    "timestamp": "2025-11-14T18:00:00Z"
  }'

# Queen notifies all hives
npx claude-flow@alpha hooks notify \
  --message "📢 New directive: directive-001 (see queen/directives)"
```

Workers query memory on next task:

```bash
# Worker checks for new directives
npx claude-flow@alpha hooks memory search --pattern "queen/directives/*"
```

### Pattern 2: Worker-to-Queen Update (Many-to-One)

**Use case:** Workers report progress to Queen

```bash
# Worker updates individual status
npx claude-flow@alpha hooks memory set \
  --key "hive1/worker-1/status" \
  --value '{"state": "in_progress", "progress": 0.75, ...}'

# Worker notifies Queen
npx claude-flow@alpha hooks notify \
  --message "Hive1-Worker1: 75% complete on architecture diagrams"
```

Queen queries aggregated status:

```bash
# Queen checks all worker statuses
npx claude-flow@alpha hooks memory search --pattern "hive*/worker-*/status"
```

### Pattern 3: Cross-Hive Collaboration (Peer-to-Peer)

**Use case:** Hive 2 (Agent Patterns) needs input from Hive 1 (Documentation)

```bash
# Hive 2 worker requests documentation
npx claude-flow@alpha hooks memory set \
  --key "hive2/requests/doc-pattern-001" \
  --value '{
    "requester": "hive2-worker-1",
    "target_hive": "hive1",
    "request": "Need agent interaction diagrams for pattern library",
    "priority": "medium",
    "timestamp": "2025-11-14T19:00:00Z"
  }'

# Hive 2 notifies Hive 1
npx claude-flow@alpha hooks notify \
  --message "Hive2 → Hive1: Request for agent interaction diagrams (hive2/requests/doc-pattern-001)"
```

Hive 1 worker responds:

```bash
# Hive 1 worker fulfills request
npx claude-flow@alpha hooks memory set \
  --key "hive2/requests/doc-pattern-001/response" \
  --value '{
    "responder": "hive1-worker-2",
    "artifact_path": "sessions/$SESSION_ID/artifacts/docs/agent-interaction-diagrams.md",
    "status": "fulfilled",
    "timestamp": "2025-11-14T19:30:00Z"
  }'

# Hive 1 notifies Hive 2
npx claude-flow@alpha hooks notify \
  --message "Hive1 → Hive2: Agent diagrams ready (see hive2/requests/doc-pattern-001/response)"
```

---

## Failure Detection & Recovery

### Stalled Agent Detection (Lesson from Hive 4 Failure)

**Problem:** Agent gets stuck in infinite loop or resource exhaustion.

**Solution:** Queen monitors worker heartbeats via memory timestamps.

```bash
# Queen checks for stale worker statuses
npx claude-flow@alpha hooks memory search --pattern "hive*/worker-*/status" | \
  jq '.[] | select(.last_update < (now - 300))' # Stale if > 5 min old
```

**Recovery Actions:**
1. Queen marks worker as `stalled` in memory
2. Queen notifies user via HITL escalation
3. User decides: restart worker, reassign task, or debug

### Consensus Deadlock Resolution

**Problem:** Workers can't reach 2/3 consensus (e.g., 1 approve, 1 reject, 1 abstain).

**Solution:** Queen escalates to HITL checkpoint.

```bash
# Queen detects deadlock
npx claude-flow@alpha hooks memory set \
  --key "queen/escalations/consensus-deadlock-001" \
  --value '{
    "proposal_id": "integration-test-strategy",
    "vote_breakdown": {"approve": 1, "reject": 1, "abstain": 1},
    "reason": "No clear majority; requires user decision",
    "escalation_type": "HITL_CHECKPOINT",
    "timestamp": "2025-11-14T20:00:00Z"
  }'

# Queen notifies user
npx claude-flow@alpha hooks notify \
  --message "⚠️  Consensus deadlock: integration-test-strategy needs HITL decision"
```

---

## Quality Gates & Validation

### Validation Hive (Hive 3) Certification

**All deliverables must pass Hive 3 validation before final approval:**

```bash
# Hive 3 worker tests artifact
npx claude-flow@alpha hooks memory set \
  --key "hive3/validations/architecture-diagram" \
  --value '{
    "artifact": "sessions/$SESSION_ID/artifacts/docs/architecture-diagram.md",
    "validator": "hive3-worker-1",
    "tests_passed": true,
    "quality_score": 0.92,
    "issues": [],
    "certified": true,
    "timestamp": "2025-11-14T21:00:00Z"
  }'

# Hive 3 notifies Queen
npx claude-flow@alpha hooks notify \
  --message "✅ Validation certified: architecture-diagram (score: 0.92)"
```

**Certification Requirements:**
- All tests pass (if applicable)
- Quality score ≥ 0.85
- No critical issues
- Hive 3 consensus (both workers approve)

---

## Example Workflow: End-to-End Coordination

### Scenario: Queen assigns architecture documentation task

**Step 1: Queen creates directive**

```bash
npx claude-flow@alpha hooks memory set \
  --key "queen/directives/architecture-doc-001" \
  --value '{
    "task": "Create C4 model architecture diagrams",
    "assigned_hive": "hive1",
    "priority": "high",
    "deadline": "2025-11-15T12:00:00Z"
  }'

npx claude-flow@alpha hooks notify \
  --message "📢 Directive: architecture-doc-001 assigned to Hive1"
```

**Step 2: Hive 1 workers coordinate (Ring topology)**

```bash
# Worker-1 starts task
npx claude-flow@alpha hooks pre-task \
  --description "Worker-1: Design C4 context diagram" \
  --task-id "hive1-worker-1-c4-context"

# Worker-1 updates status
npx claude-flow@alpha hooks memory set \
  --key "hive1/worker-1/status" \
  --value '{"current_task": "C4 context diagram", "progress": 0.3, "state": "in_progress"}'

# Worker-2 and Worker-3 do similar for container and component diagrams
```

**Step 3: Workers create artifacts**

```bash
# Worker-1 creates diagram
# (Writes to sessions/$SESSION_ID/artifacts/docs/c4-context-diagram.md)

npx claude-flow@alpha hooks post-edit \
  --file "sessions/$SESSION_ID/artifacts/docs/c4-context-diagram.md" \
  --memory-key "hive1/worker-1/artifacts"

npx claude-flow@alpha hooks notify \
  --message "Worker-1: C4 context diagram complete"
```

**Step 4: Hive 1 proposes consensus**

```bash
# Worker-1 proposes completion
npx claude-flow@alpha hooks memory set \
  --key "hive1/proposals/c4-diagrams-complete" \
  --value '{
    "proposer": "worker-1",
    "deliverable": "C4 architecture diagrams (context, container, component)",
    "artifacts": ["c4-context-diagram.md", "c4-container-diagram.md", "c4-component-diagram.md"],
    "votes": {}
  }'

npx claude-flow@alpha hooks notify \
  --message "Proposal: C4 diagrams ready for consensus (hive1/proposals/c4-diagrams-complete)"
```

**Step 5: Workers vote**

```bash
# Worker-2 votes
npx claude-flow@alpha hooks memory set \
  --key "hive1/proposals/c4-diagrams-complete/votes/worker-2" \
  --value '{"vote": "approve", "comments": "Diagrams are comprehensive"}'

# Worker-3 votes
npx claude-flow@alpha hooks memory set \
  --key "hive1/proposals/c4-diagrams-complete/votes/worker-3" \
  --value '{"vote": "approve", "comments": "Approved"}'
```

**Step 6: Queen certifies consensus**

```bash
# Queen tallies votes (2/3 approve)
npx claude-flow@alpha hooks memory set \
  --key "queen/consensus/c4-diagrams-complete" \
  --value '{
    "proposal_id": "c4-diagrams-complete",
    "consensus_reached": true,
    "approve": 3,
    "reject": 0
  }'
```

**Step 7: Validation (Hive 3) certifies quality**

```bash
# Hive 3 worker tests diagrams
npx claude-flow@alpha hooks memory set \
  --key "hive3/validations/c4-diagrams" \
  --value '{
    "artifact": "C4 diagrams",
    "certified": true,
    "quality_score": 0.90
  }'

npx claude-flow@alpha hooks notify \
  --message "✅ Validation certified: C4 diagrams (score: 0.90)"
```

**Step 8: Queen marks deliverable complete**

```bash
npx claude-flow@alpha hooks memory set \
  --key "queen/deliverables/architecture-doc-001" \
  --value '{
    "directive_id": "architecture-doc-001",
    "status": "complete",
    "consensus_reached": true,
    "validation_certified": true,
    "timestamp": "2025-11-14T22:00:00Z"
  }'

# Update Hive 1 deliverables list
npx claude-flow@alpha hooks memory set \
  --key "hive1/deliverables" \
  --value '["c4-context-diagram.md", "c4-container-diagram.md", "c4-component-diagram.md"]'
```

**Step 9: HITL checkpoint (when all tasks complete)**

```bash
# Queen generates consolidated report
# (Manual: Queen reads all memory keys and creates report)

# Queen marks checkpoint ready
npx claude-flow@alpha hooks memory set \
  --key "queen/checkpoints/checkpoint-001" \
  --value '{
    "ready": true,
    "all_hives_complete": true,
    "report_path": "sessions/$SESSION_ID/artifacts/docs/queen-consolidated-report.md"
  }'

npx claude-flow@alpha hooks notify \
  --message "🎯 HITL Checkpoint Ready: Review consolidated report for approval"
```

---

## Summary

This protocol achieves:

✅ **Stock-first coordination** - 100% claude-flow infrastructure, zero custom code
✅ **Byzantine consensus** - 2/3 majority + Queen weighted override
✅ **HITL checkpoints** - Human-in-the-loop approval before proceeding
✅ **Failure detection** - Stalled agent monitoring via memory timestamps
✅ **Quality gates** - Validation hive certification required
✅ **Transparency** - All decisions logged in memory + Captain's Log

**Next Steps:**
1. Implement in practice with real sub-hive tasks
2. Monitor for edge cases (deadlocks, stalls, quality failures)
3. Refine consensus thresholds based on project needs
4. Document lessons learned in Captain's Log

---

**Related Documents:**
- `queen-oversight-protocol.md` - Queen monitoring and certification procedures
- `hive-failure-recovery.md` - Detailed failure scenarios and recovery strategies
- `sessions/captains-log/` - Historical decisions and lessons learned
