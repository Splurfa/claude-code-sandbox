# Workspace Configuration Scoring Analysis

**Generated**: 2025-11-18T00:45:45.903Z
**Total Files Analyzed**: 360
**Session**: session-20251117-100232-docs-refactor-tutor

---

## Executive Summary

Comprehensive analysis of 360 workspace configuration files scored across 4 critical dimensions:

1. **Informative Value** (0-100): How much useful information the file contains
2. **Prescriptive Risk** (0-100): How dangerous it is to edit (higher = more dangerous)
3. **Confidence Score** (0-100): How confident we are in the file's accuracy
4. **Relevance Score** (0-100): How relevant the file is to current work

### Key Findings

- **53.3%** (192 files) classified as **high-risk** - should not be edited without careful review
- **37.5%** (135 files) classified as **standard** - normal editing with caution
- **8.6%** (31 files) classified as **read-only** - IMMUTABLE, never edit
- **0.6%** (2 files) classified as **critical** - CLAUDE.md and package.json

### Average Scores Across All Files

| Dimension | Average Score | Interpretation |
|-----------|--------------|----------------|
| Informative Value | 75/100 | Good documentation coverage |
| Prescriptive Risk | 74/100 | HIGH - Most files are risky to edit |
| Confidence Score | 83/100 | High confidence in file accuracy |
| Relevance Score | 60/100 | Moderate relevance (some outdated content) |
| **Weighted Overall** | **62/100** | **Moderate overall quality** |

---

## Classification Breakdown

### 🔴 CRITICAL (2 files) - 0.6%

Files that are absolutely essential and authoritative:

1. **CLAUDE.md** [Score: 81/100]
   - Confidence: 100 (user-created, authoritative)
   - Risk: 90 (high risk to edit)
   - Informative: 100
   - Relevance: 95

2. **package.json** [Score: 73/100]
   - Confidence: 95 (stock claude-flow)
   - Risk: 90 (high risk to edit)
   - Core configuration file

### 🟠 HIGH-RISK (192 files) - 53.3%

Files that should NOT be edited without explicit permission and understanding:

**Categories:**
- **77 Agent Definitions** (.claude/agents/)
- **81 Commands** (.claude/commands/)
- **34 Other high-risk configs**

**Key Characteristics:**
- Stock claude-flow implementations (95% confidence)
- Prescriptive risk: 90-100
- Editing could break swarm coordination

**Top 10 Highest Risk:**
1. All `.claude/agents/` files (Risk: 100)
2. All `.claude/commands/` files (Risk: 95)
3. Stock implementation files (Risk: 90-95)

### 🟡 STANDARD (135 files) - 37.5%

Files that can be edited with normal caution:

**Categories:**
- Documentation files (53 in docs/)
- Session artifacts (workspace guides)
- Custom extensions (flow-nexus agents)
- Inbox content

**Average Risk Level:** 40-60 (moderate)

### 🔵 READ-ONLY (31 files) - 8.6%

Files that are IMMUTABLE and should NEVER be edited:

**All in `.swarm/backups/`:**
- Session backup snapshots
- Historical data
- Archive files

**Risk Level:** 100 (attempting to edit = data corruption)

---

## Directory Analysis

| Directory | Files | Avg Score | High-Risk | Read-Only |
|-----------|-------|-----------|-----------|-----------|
| `.claude/` | 228 | 65/100 | 192 | 0 |
| `docs/` | 53 | 63/100 | 0 | 0 |
| `.swarm/` | 41 | 46/100 | 0 | 31 |
| `inbox/` | 31 | 62/100 | 0 | 0 |
| `sessions/` | 2 | 73/100 | 0 | 0 |
| *root files* | 5 | 67/100 | 0 | 0 |

### Key Insights:

1. **`.claude/` directory is 84% high-risk** (192 of 228 files)
   - Contains stock claude-flow implementations
   - Agent definitions, commands, and skills
   - Should be treated as vendor-provided code

2. **`docs/` is entirely standard** (0 high-risk files)
   - Safe to edit documentation
   - Average informative value: 75/100
   - Good place for custom documentation

3. **`.swarm/backups/` is 76% read-only** (31 of 41 files)
   - Archive data that must not be modified
   - Historical session snapshots

---

## Top 10 Most Valuable Files

Files ranked by weighted overall score (value to the project):

| Rank | Score | Path | Classification |
|------|-------|------|----------------|
| 1 | 81 | `CLAUDE.md` | critical |
| 2 | 76 | `sessions/README.md` | standard |
| 3 | 73 | `.claude/agents/core/coder.md` | high-risk |
| 4 | 73 | `.claude/agents/core/reviewer.md` | high-risk |
| 5 | 73 | `.claude/agents/core/tester.md` | high-risk |
| 6 | 73 | `package.json` | critical |
| 7 | 72 | `.claude/agents/consensus/quorum-manager.md` | high-risk |
| 8 | 72 | `.claude/agents/core/planner.md` | high-risk |
| 9 | 72 | `.claude/agents/core/researcher.md` | high-risk |
| 10 | 72 | `.claude/agents/flow-nexus/app-store.md` | standard |

**Analysis:**
- Core agents (coder, reviewer, tester, planner, researcher) are most valuable
- CLAUDE.md is the single most valuable file (user-created authority)
- Flow-nexus agents appear in top 10 despite lower confidence (55)

---

## Commands Analysis

**Total Commands**: 81
**Location**: `.claude/commands/`
**Average Informative Value**: 78/100
**Average Relevance**: 65/100
**Classification**: ALL high-risk

### Top 10 Commands by Relevance:

| Rank | Relevance | Command |
|------|-----------|---------|
| 1 | 85 | `hive-mind-spawn` |
| 2 | 85 | `hive-mind` |
| 3 | 85 | `session-start` |
| 4 | 85 | `analyzer` |
| 5 | 85 | `architect` |
| 6 | 85 | `batch-executor` |
| 7 | 85 | `coder` |
| 8 | 85 | `debugger` |
| 9 | 85 | `designer` |
| 10 | 85 | `documenter` |

**Key Commands for Daily Use:**
- `session-start` / `session-closeout` - Session management
- `hive-mind` / `hive-mind-spawn` - Multi-agent coordination
- `coder` / `reviewer` / `tester` - Core development workflow

---

## Skills Analysis

**Total Skills**: 43
**Location**: `.claude/skills/`
**Average Informative Value**: 89/100 (highest category)
**Average Relevance**: 57/100
**Classification**: ALL high-risk

### Notable Skills:

**High Relevance (≥80):**
- AgentDB integration skills
- ReasoningBank learning skills
- Swarm orchestration skills
- GitHub workflow skills

**Lower Relevance (50-65):**
- Experimental features
- Flow-nexus neural network skills
- Advanced distributed consensus

**Recommendation**: Focus documentation efforts on high-relevance skills that are actively used.

---

## Agents Analysis

**Total Agents**: 77
**Core Agents**: 5
**Specialized Agents**: 72

### Top 10 Agents by Overall Score:

| Rank | Score | Agent | Type |
|------|-------|-------|------|
| 1 | 73 | `coder` | core |
| 2 | 73 | `reviewer` | core |
| 3 | 73 | `tester` | core |
| 4 | 72 | `quorum-manager` | specialized |
| 5 | 72 | `planner` | core |
| 6 | 72 | `researcher` | core |
| 7 | 72 | `app-store` | flow-nexus |
| 8 | 72 | `authentication` | flow-nexus |
| 9 | 72 | `challenges` | flow-nexus |
| 10 | 72 | `neural-network` | flow-nexus |

### Agent Categories:

**Core Development (5 agents):**
- `coder`, `reviewer`, `tester`, `planner`, `researcher`
- All scored 72-73/100
- High confidence (95)
- Stock claude-flow implementations

**GitHub Integration (13 agents):**
- PR management, code review, issue tracking, release coordination
- Average score: 68/100
- Specialized for repository workflows

**Consensus & Distributed (7 agents):**
- Byzantine, Raft, Gossip, Quorum, CRDT
- Average score: 69/100
- Advanced coordination mechanisms

**Flow-Nexus Extensions (9 agents):**
- App store, authentication, challenges, neural, payments, sandbox, swarm, workflow
- Average score: 72/100
- Confidence: 55 (custom, unverified)

**Hive-Mind (5 agents):**
- Collective intelligence, queen coordinator, scout, memory manager, worker
- Average score: 70/100
- Advanced multi-agent coordination

---

## Custom Extensions Identified

**Total Custom Extensions**: 9 files
**Confidence Score**: ≤55 (capped as unverified)

All custom extensions are in `.claude/agents/flow-nexus/`:

1. `app-store.md` [Confidence: 55]
2. `authentication.md` [Confidence: 55]
3. `challenges.md` [Confidence: 55]
4. `neural-network.md` [Confidence: 55]
5. `payments.md` [Confidence: 55]
6. `sandbox.md` [Confidence: 55]
7. `swarm.md` [Confidence: 55]
8. `user-tools.md` [Confidence: 55]
9. `workflow.md` [Confidence: 55]

**Recommendation**: These files are custom additions to the workspace and should be reviewed for accuracy. They are cloud-based Flow-Nexus features that may require authentication and setup.

---

## Read-Only Files (NEVER EDIT)

**Total**: 31 files (all in `.swarm/backups/`)

### Categories:

**Session Backups** (31 files):
- `session-2025-11-14T*.json`
- Immutable historical snapshots
- Created by `hooks session-end`

**Risk Level**: 100 - Editing these files will corrupt historical data.

**Recommendation**: These files are append-only archives. Never modify. Only read for historical analysis.

---

## Special Handling Rules

### CLAUDE.md (Confidence: 100)

- **User-created, authoritative**
- Single source of truth for project rules
- Changes require careful consideration
- Score: 81/100 (highest overall)

### Stock Claude-Flow Files (Confidence: 95)

- Vendor-provided implementations
- Should be treated as library code
- Editing may break compatibility
- Examples: All `.claude/agents/core/`, most commands

### Custom Extensions (Confidence: 55)

- Unverified additions
- May contain inaccuracies
- Require validation before use
- Examples: `.claude/agents/flow-nexus/*`

### READ-ONLY Zones

**NEVER EDIT:**
- `codex-agent/` - External integration
- `cursor-agent/` - External integration
- `.swarm/backups/` - Historical archives

**Flag**: Any attempt to edit these should be rejected immediately.

---

## Recommendations for Documentation Refactor

### Priority 1: Focus on High-Value, Low-Risk Files

**Edit These:**
- `docs/` directory (53 files, all standard classification)
- `sessions/README.md` (Score: 76, standard)
- Custom guides in `docs/guides/`

**Benefit:**
- No risk of breaking core functionality
- High informative value (avg 75/100)
- Safe to improve and expand

### Priority 2: Create Clarity Guides

**Target Areas:**
1. **Commands** - Which 10 commands are used 90% of the time?
2. **Skills** - Which skills are experimental vs. production-ready?
3. **Agents** - What's the difference between 77 agent types?

**Approach:**
- Don't edit the 192 high-risk files
- Create separate guide documents in `docs/`
- Reference the high-risk files, don't duplicate them

### Priority 3: Flag Custom Extensions

**Action Items:**
1. Document which files are custom (9 flow-nexus agents)
2. Mark confidence levels clearly
3. Create validation checklist
4. Test before recommending to users

### Priority 4: Archive Analysis

**Opportunity:**
- 31 session backups contain historical data
- Can mine for patterns and insights
- Create analytics reports from backups
- Never modify the backup files themselves

---

## Weighted Scoring Methodology

### Score Calculation

```javascript
weighted_score =
  (informative_value × 0.30) +
  (relevance_score × 0.30) +
  (confidence_score × 0.20) +
  ((100 - prescriptive_risk) × 0.20)
```

### Rationale:

- **Informative Value (30%)**: How much you learn from the file
- **Relevance (30%)**: How applicable it is to current work
- **Confidence (20%)**: How much you can trust the information
- **Safety (20%)**: How safe it is to reference/use (inverse of risk)

### Classification Thresholds:

- **critical**: Root configs (CLAUDE.md, package.json)
- **high-risk**: prescriptive_risk > 80
- **read-only**: Explicit zones (backups, external integrations)
- **valuable**: weighted_score > 80 and not high-risk
- **low-priority**: weighted_score < 40
- **standard**: Everything else

---

## Next Steps

1. **Review** this analysis with the user
2. **Validate** custom extensions (9 flow-nexus files)
3. **Create** clarity guides for high-use commands and skills
4. **Organize** documentation in `docs/` by user journey
5. **Test** recommendations against actual workflow

---

## Appendix: Full Data

**Location**: `workspace-scores.json`
**Size**: 202KB
**Format**: JSON
**Fields per file**:
- `path`, `full_path`, `category`, `size_bytes`
- `scores`: 5 dimensions
- `categories`: Array of classification tags
- `classification`: Overall classification
- `flags`: Special handling flags

**Usage:**
```bash
# Query specific files
jq '.files[] | select(.path == "CLAUDE.md")' workspace-scores.json

# Find all high-risk files
jq '.files[] | select(.classification == "high-risk") | .path' workspace-scores.json

# Get average score by category
jq '[.files[] | select(.category == "agent-definition")] |
    add | .scores.weighted_overall / length' workspace-scores.json
```

---

**END OF ANALYSIS**
