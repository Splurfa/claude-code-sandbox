# Code Mode Research Archive

This directory contains the foundational analysis and architectural planning for integrating "Code Mode" (execution-based tool calling) into `claude-flow`.

## Contents

*   **[Executive Summary](./executive-summary.md)**: High-level overview and roadmap for the integration.
*   **[Phase 1: Code Mode Overview](./phase1-code-mode-overview.md)**: Analysis of the "Code Mode" paradigm (Anthropic/Cloudflare) and its benefits over traditional tool calling.
*   **[Phase 2: Claude-Flow Architecture](./phase2-claude-flow-architecture.md)**: Analysis of the existing `claude-flow` system and how it supports this integration.
*   **[Phase 3: Integration Analysis](./phase3-integration-analysis.md)**: detailed technical proposal for the "Schema-to-SDK" adapter pattern.
*   **[Phase 4: Verification](./phase4-verification.md)**: Source bibliography and confidence checks.

## Visualizations

*   [Paradigm Shift (Traditional vs Code Mode)](../diagrams/01-paradigm-shift.mermaid)
*   [System Architecture](../diagrams/02-system-architecture.mermaid)
*   [Integration Workflow](../diagrams/03-integration-path.mermaid)

## Key Finding
The research concludes that the best path forward is a **"Spec File" Workflow**:
1.  Agent writes a TypeScript plan.
2.  Agent calls a tool to execute that plan.
3.  The system runs the plan in a sandbox, proxying calls to existing MCP tools.

The implementation of this finding is located in `../artifacts/`.

