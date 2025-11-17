# Implementation Track · 01 Setup Essentials

Goal: get a Claude Code + Claude Flow stack running with the exact prerequisites assumed by the repo authors, plus Flow Nexus MCP connections.

## Learning Objectives
1. Understand required accounts and CLI tooling.
2. Install/configure Claude Code & Claude Flow for agentic operation (not just chat).
3. Connect Flow Nexus services so you can use their extra agents/templates.

## Prerequisites
- Claude.ai or Claude Console account + Claude Code access (`code.claude.com/docs/en/overview` → "Get started in 30 seconds").
- macOS or Linux terminal with Homebrew/NPM (same doc lists supported environments).
- Git + Node 18+ (repo standard).

## Step 1 · Install Claude Code CLI
```bash
# macOS via Homebrew (from Claude Code overview)
brew install anthropic-ai/tap/claude

# or NPM fallback
npm install -g @anthropic-ai/claude-code
```
Confirm with `claude --version`. Claude Code can now "take action"—edit files, run commands, create commits (see "What Claude Code does for you" section of the official doc).

## Step 2 · Initialize Claude Flow
```bash
npm install
npx claude-flow@alpha init --force
```
This seeds `.claude/`, `.swarm/`, and hook scripts exactly as described in `CLAUDE.md`.

## Step 3 · Add MCP Servers
Based on `CLAUDE.md` and Flow Nexus README:
```bash
claude mcp add claude-flow npx claude-flow@alpha mcp start
claude mcp add flow-nexus npx flow-nexus@latest mcp start
claude mcp add ruv-swarm npx ruv-swarm@latest mcp start
```
These commands let Claude Code talk to orchestration (claude-flow), Flow Nexus services, and the ruv swarm utilities.

## Step 4 · Flow Nexus Account & Auth
Flow Nexus README quick start:
```bash
npx flow-nexus@latest auth register -e you@example.com -p strong-password
npx flow-nexus@latest auth login -e you@example.com -p strong-password
# or via MCP
mcp__flow-nexus__user_register {...}
mcp__flow-nexus__user_login {...}
```
You receive 256 rUv credits when registering.

## Step 5 · First Cloud Swarm (Flow Nexus)
```bash
mcp__flow-nexus__swarm_init({ topology: "mesh", maxAgents: 5 })
mcp__flow-nexus__sandbox_create({ template: "node", name: "api-dev" })
```
Result: a ready sandbox to pair with Claude Flow hives.

## Exit Criteria
- [ ] Claude CLI installed and authenticated.
- [ ] `npx claude-flow@alpha init` completed without errors.
- [ ] All three MCP servers added.
- [ ] Flow Nexus account registered/logged-in and sandbox created.
