# Annotated Bibliography – Code-Mode MCP Integration

| ID | Source | Type | Key Insights / Usage |
| --- | --- | --- | --- |
| S1 | Anthropic. “Code execution with MCP: building more efficient AI agents.” Nov 2024. <https://www.anthropic.com/engineering/code-execution-with-mcp> | Engineering blog | Describes code-mode execution loop, progressive disclosure, file-system tool discovery, stateful skills, privacy tokenization, and performance motivations (token savings, control-flow efficiency). Used for Phase 1 architecture summary and integration requirements. |
| S2 | Cloudflare. “Code Mode: the better way to use MCP.” Sept 26, 2025. <https://blog.cloudflare.com/code-mode/> | Engineering blog | Details TS API generation, Worker Loader API, sandbox isolation, async execution benefits, and performance comparisons. Informs sandbox requirements and integration paths. |
| S3 | `README.md` (Claude-Flow v2.7.0). Repository root. | Project overview doc | Provides feature inventory (skills, AgentDB integration, swarm performance metrics) and commands referenced in Phase 2 + integration analysis. |
| S4 | `docs/architecture/ARCHITECTURE.md`. | Architecture reference | Supplies system diagrams, component definitions, memory tiers, swarm topologies, consensus mechanisms, security layers, and observability patterns for Phase 2 & 3. |
| S5 | `docs/phase-1-2-implementation-summary.md`. | Implementation report | Explains progressive disclosure refactor (`src/mcp/tools/**`, loader, `tools/search`), token reduction metrics, and usage instructions. Critical for matching code-mode file-system expectations. |
| S6 | `docs/mcp-2025-implementation-summary.md`. | Implementation report | Covers MCP 2025-11 compliance (version negotiation, async jobs, registry, schema validation, feature flags). Used to map async/job semantics to code-mode sandbox requirements. |

> Additional supporting files (e.g., CLI snippets inside README, component code stubs inside architecture doc) were referenced indirectly through these documents.

