# Claude Code Fundamentals

**Research Date**: 2025-11-18
**Sources**: Official Anthropic documentation, production usage patterns, community best practices
**Evidence Level**: 5/5 - Verified from official docs and real-world usage

---

## Table of Contents

1. [Core Architecture](#core-architecture)
2. [How Claude Code Interprets Prompts](#how-claude-code-interprets-prompts)
3. [Subagent System](#subagent-system)
4. [Tool Usage Patterns](#tool-usage-patterns)
5. [Memory & Context Management](#memory--context-management)
6. [Design Philosophy](#design-philosophy)

---

## Core Architecture

### System Design

Claude Code operates as a **terminal-native agentic coding assistant** designed to integrate directly into existing developer workflows rather than requiring separate IDEs or chat interfaces.

**Key Design Principle**: "Meet you where you already work, with the tools you already love"

### Deployment Models

- **Local CLI**: macOS/Linux/Windows via npm, Homebrew, or native installers
- **Cloud Hosting**: AWS Bedrock, Google Vertex AI
- **IDE Integration**: VS Code extension (beta)
- **Enterprise**: API access with security/compliance controls

### Core Capabilities

1. **Code Generation**: Natural language → functional code with planning and validation
2. **Debugging**: Codebase analysis + error diagnosis → automated fixes
3. **Navigation**: Contextual project understanding + external source synthesis
4. **Automation**: Repetitive tasks (linting, merges, documentation)

---

## How Claude Code Interprets Prompts

### Terminal-First Philosophy

Claude Code processes prompts as **action-oriented instructions** rather than casual chat messages. The system expects:

**Direct Commands** (not suggestions):
```
✅ "Add a hello world function to the main file"
❌ "Could you maybe add a hello world function?"
```

**Specific Context** (not vague requests):
```
✅ "Fix the login bug where users see a blank screen after entering wrong credentials"
❌ "Fix the bug"
```

**Unix Composability**:
```bash
# Claude Code accepts piped input
tail -f app.log | claude -p "analyze anomalies"
```

### Prompt Processing Model

**Analysis Phase**:
1. Parse user intent from natural language
2. Identify relevant files and codebase areas
3. Gather necessary context (project structure, dependencies, patterns)

**Proposal Phase**:
1. Draft changes and show them to user
2. Request approval before modifying files
3. "Accept all" option available for bulk changes

**Execution Phase**:
1. Apply approved changes to filesystem
2. Run requested commands
3. Create git commits if requested

### Context Awareness

**Claude Code automatically reads**:
- `CLAUDE.md` files (project-specific instructions)
- `.claude/` folder configuration
- Recent git history
- Project dependencies (`package.json`, `requirements.txt`, etc.)
- File structure and imports

**Performance Note**: First invocation in a new project involves context gathering, which may add latency. Subsequent calls benefit from cached understanding.

---

## Subagent System

### What Are Subagents?

Subagents are **specialized AI assistants** that Claude Code delegates tasks to based on expertise matching. Each operates with its own isolated context window.

**Critical Limitation**: Subagents CANNOT spawn other subagents (prevents infinite nesting)

### Subagent Lifecycle

**Spawning**:
```javascript
// Via Claude Code's Task tool
Task("Backend Developer", "Build REST API. Save to sessions/$SESSION_ID/artifacts/code/.", "backend-dev")

// Automatic delegation based on task description
// Or explicit: "Use the code-reviewer subagent"
```

**Execution**:
- Each subagent maintains separate conversation transcript (`agent-{agentId}.jsonl`)
- Isolated context prevents pollution of main conversation
- Can resume previous conversations using unique ID

**Memory Management**:
- **Isolated**: Each agent has own working memory
- **Resumable**: Long-running tasks continue across invocations
- **Clean Slates**: Fresh context each time (unless explicitly resumed)

### Orchestrator-Worker Pattern

**In production systems**:
- **Orchestrator** (lead agent): Global planning, delegation, state management
- **Workers** (subagents): Specialized tasks, report results

**Best Practice**: "Give each subagent one job, let orchestrator coordinate"

### Delegation Mechanics

**Effective delegation includes**:
1. **Objective**: Clear task description
2. **Output format**: Expected deliverable structure
3. **Tools/sources**: What resources to use
4. **Boundaries**: Clear task scope

**Example**:
```
Task("Research Agent", `
  OBJECTIVE: Analyze REST API best practices
  OUTPUT: Markdown report saved to sessions/$SESSION_ID/artifacts/docs/research.md
  SOURCES: Check memory for prior decisions, search documentation
  SCOPE: Focus on authentication patterns only
`, "researcher")
```

### Coordination at Scale

**Scaling patterns**:
- Simple queries: 2-3 subagents
- Comprehensive projects: 20-30 agents in coordinated waves
- Dynamic spawning: New agents created as subtasks emerge

**Performance**: Multi-agent with Opus 4 lead + Sonnet 4 workers outperformed single Opus 4 by **90.2%** on research evaluations

---

## Tool Usage Patterns

### Claude Code's Tool Ecosystem

**File Operations** (Native):
- Read, Write, Edit, MultiEdit
- Glob (pattern matching), Grep (content search)
- Directory navigation

**System Operations** (Native):
- Bash command execution
- Git operations (status, commit, push, pull)
- Package management (npm, pip, etc.)
- Process management

**Extended Capabilities** (MCP Protocol):
- External data sources (Google Drive, Slack, Jira)
- Custom developer tooling
- Cloud services integration

### Tool Selection Logic

**Claude Code automatically chooses tools based on**:
1. Task type (code vs documentation vs system ops)
2. File patterns (glob for finding, grep for searching)
3. Complexity (simple edits vs full rewrites)
4. User permissions (tool allowlist)

### Permission Model

**Default Behavior**: Ask before executing potentially destructive operations

**Customization Options**:
```bash
# Via command prompt
/permissions

# Via .claude/settings.json
{
  "permissions": {
    "allowed_tools": ["Read", "Write", "Bash"],
    "allowed_domains": ["docs.example.com"]
  }
}

# Via CLI flags
claude --dangerously-skip-permissions  # For isolated containers only
```

---

## Memory & Context Management

### Context Window Strategy

**Main conversation**: Persistent across user interactions

**Subagent contexts**: Isolated, task-specific

**Context optimization**:
```bash
# Clear context between tasks
/clear

# Compact context for long sessions
/compact
```

**Best Practice**: "Reset or prune context during long sessions; prefer retrieval and summaries over dumping raw logs"

### Memory Persistence

**Session-level**:
- Conversation transcripts stored locally
- Git history as permanent record
- Session summaries on closeout

**Cross-session**:
- CLAUDE.md for project conventions
- .claude/ configuration
- Git commit messages
- External memory systems (via MCP)

### CLAUDE.md Pattern

**Purpose**: Project-specific context that Claude automatically incorporates into every prompt

**Should contain**:
- Common bash commands
- Core files and utility functions
- Code style guidelines
- Testing instructions
- Project-specific workflows

**Important**: Refine like any frequently-used prompt. Keep concise and iterate over time.

---

## Design Philosophy

### Unix Philosophy Principles

**Composability**:
```bash
# Pipe data directly
tail -f app.log | claude -p "analyze anomalies"

# Scriptable components
for file in *.js; do
  claude -p "add JSDoc to $file"
done
```

**Action-Oriented**:
- Direct file modifications (not just suggestions)
- Command execution
- Commit creation
- No additional approval layers (configurable)

### Terminal-First, Not GUI-First

**Why terminal**:
1. Developers already work in terminals
2. Scriptable and automatable
3. CI/CD integration ready
4. No context switching to separate chat window

**Available GUI**: VS Code extension for users who prefer graphical interface

### Iterative Refinement Model

**Claude Code expects iteration**:
```
First attempt: Good (~70%)
After 2-3 iterations: Much better (~95%)
```

**Prompting for improvement**:
- "think" - standard computation
- "think hard" - more thorough analysis
- "think harder" - even deeper reasoning
- "ultrathink" - maximum computation time

### Safety-First Defaults

**Conservative approach**:
- Permission prompts by default
- Preview changes before applying
- Git commits for tracking
- No bypass flags except in isolated environments

**Configurable for power users**:
- Tool allowlists
- Auto-accept patterns
- Headless mode for CI/CD

---

## Key Takeaways for Prompt Design

### What Claude Code Expects

1. **Direct action verbs**: "Add", "Fix", "Refactor" (not "Could you...")
2. **Specific context**: File names, error messages, exact symptoms
3. **Clear scope**: What to change, what not to change
4. **Output location**: Where files should be saved
5. **Acceptance of iteration**: Plan to refine over 2-3 rounds

### What Works Best

**Effective patterns**:
- Explore → Plan → Code → Commit workflow
- Test-driven development (write tests first)
- Visual references (screenshots, mockups, diagrams)
- Explicit "don't code yet, just plan" instructions
- Clear file organization (session artifacts pattern)

**Less effective patterns**:
- Vague instructions
- Missing context
- Jumping straight to coding without planning
- No visual references when UI is involved
- Asking for suggestions instead of changes

### How Claude Code Differs from Chat

**Not a chat assistant**:
- Expects commands, not conversation
- Takes actions, not just advice
- Works with files and systems, not just text
- Remembers project context, not just chat history

**Optimized for**:
- Development workflows
- Automation and scripting
- CI/CD integration
- Real project work

---

## Summary

**Claude Code is**:
- **Terminal-native**: Integrates into existing workflows
- **Action-oriented**: Makes changes, runs commands, creates commits
- **Context-aware**: Reads project structure, dependencies, conventions
- **Iterative**: Expects refinement over 2-3 rounds
- **Safe by default**: Asks permission, shows previews, tracks with git
- **Composable**: Unix-compatible, scriptable, automatable

**For best results**:
1. Be direct and specific in prompts
2. Provide context (files, errors, symptoms)
3. Use CLAUDE.md for project conventions
4. Iterate to refine results
5. Leverage subagents for complex tasks
6. Plan before coding
7. Use visual references when available

---

**Next**: [Prompting Best Practices](./prompting-best-practices.md) for specific techniques
