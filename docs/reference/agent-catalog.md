# Agent Catalog

**Version**: 1.0
**Total Agents**: 54
**Source**: `.claude/agents/`

---

## Core Agents
*The fundamental team for everyday tasks.*

- **Coder** (`core/coder.md`): General purpose software developer.
- **Planner** (`core/planner.md`): Strategic planning and task breakdown.
- **Researcher** (`core/researcher.md`): Deep dive analysis and information gathering.
- **Reviewer** (`core/reviewer.md`): Code quality and security assurance.
- **Tester** (`core/tester.md`): Test suite generation and validation.

## Analysis Agents
*Specialists in understanding code and systems.*

- **Code Analyzer** (`analysis/code-analyzer.md`): Static analysis and pattern recognition.
- **Code Quality** (`analysis/code-review/analyze-code-quality.md`): Metrics and linting.

## Consensus Agents
*For distributed decision making.*

- **Byzantine Coordinator** (`consensus/byzantine-coordinator.md`): Fault-tolerant consensus.
- **CRDT Synchronizer** (`consensus/crdt-synchronizer.md`): Conflict-free data replication.
- **Gossip Coordinator** (`consensus/gossip-coordinator.md`): Information propagation.
- **Quorum Manager** (`consensus/quorum-manager.md`): Voting and majority consensus.
- **Raft Manager** (`consensus/raft-manager.md`): Leader election and log replication.
- **Security Manager** (`consensus/security-manager.md`): Threat detection and auth.

## Hive Mind Agents
*Collective intelligence and swarm coordination.*

- **Queen Coordinator** (`hive-mind/queen-coordinator.md`): Central orchestration.
- **Collective Intelligence** (`hive-mind/collective-intelligence-coordinator.md`): Aggregating swarm outputs.
- **Scout Explorer** (`hive-mind/scout-explorer.md`): Finding new paths/solutions.
- **Swarm Memory Manager** (`hive-mind/swarm-memory-manager.md`): Shared context management.
- **Worker Specialist** (`hive-mind/worker-specialist.md`): Task execution.

## GitHub Agents
*Repository management and CI/CD.*

- **Repo Architect** (`github/repo-architect.md`): Repository structure design.
- **PR Manager** (`github/pr-manager.md`): Pull request handling.
- **Issue Tracker** (`github/issue-tracker.md`): Issue triage and management.
- **Release Manager** (`github/release-manager.md`): Versioning and releases.
- **Workflow Automation** (`github/workflow-automation.md`): GitHub Actions.

## SPARC Agents
*Systematic Test-Driven Development.*

- **Specification** (`sparc/specification.md`): Requirements gathering.
- **Pseudocode** (`sparc/pseudocode.md`): Algorithm design.
- **Architecture** (`sparc/architecture.md`): System design.
- **Refinement** (`sparc/refinement.md`): TDD implementation.

## Specialized Agents
*Domain-specific experts.*

- **Mobile Dev** (`specialized/mobile/spec-mobile-react-native.md`): React Native expertise.
- **Backend Dev** (`development/backend/dev-backend-api.md`): API and server logic.
- **ML Engineer** (`data/ml/data-ml-model.md`): Machine learning models.
- **API Docs** (`documentation/api-docs/docs-api-openapi.md`): OpenAPI/Swagger specs.

## Flow Nexus Agents
*Cloud and platform integration.*

- **Swarm** (`flow-nexus/swarm.md`): Cloud swarm management.
- **Neural Network** (`flow-nexus/neural-network.md`): AI model integration.
- **Sandbox** (`flow-nexus/sandbox.md`): Isolated execution environments.

---

## How to Spawn
Use the `Task` tool (Claude Code) or `spawn_agent` (Generic):

```javascript
Task("My Agent", "Instructions...", "agent-type-filename")
```

*Example:*
```javascript
Task("Security Check", "Audit auth flow", "security-manager")
```

