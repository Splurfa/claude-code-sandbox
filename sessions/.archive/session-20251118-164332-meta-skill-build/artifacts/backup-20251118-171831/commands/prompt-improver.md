# Prompt Improver

Evaluate and improve prompts before use elsewhere in Claude Code.

## Usage

Use this command to refine prompts before submitting them to Claude Code or spawning agents.

```bash
/prompt-improver
```

When invoked, this skill will:
1. Analyze the prompt you're about to submit
2. Query your historical prompting patterns from memory
3. Detect the current Claude Flow mode (hive, swarm, wizard, direct)
4. Evaluate whether improvement is needed (intervention threshold)
5. If needed, suggest improvements with confirmation
6. Learn from your accept/reject decisions

## Workflow

**Step 1:** Type your prompt as you normally would

**Step 2:** Instead of submitting, invoke `/prompt-improver`

**Step 3:** The skill will analyze and either:
- **Pass through** (if prompt quality ≥ 0.7): "No changes recommended"
- **Suggest improvements** (if quality < 0.7): Interactive confirmation dialog

**Step 4:** Accept or reject suggestions. The skill learns your preferences.

## What It Checks

- **Clarity**: Is the intent clear?
- **Scope**: Are boundaries well-defined?
- **Context**: Does it include necessary information?
- **Mode Alignment**: Does structure match current Flow mode?
- **Baseline Fit**: Does it match your effective patterns?

## Mode Adaptation

The skill automatically adapts suggestions based on detected mode:

- **Hive Mind**: Comprehensive context, multi-agent coordination
- **Swarm**: Parallel execution, topology considerations
- **Wizard**: Interactive guidance expectations
- **Direct Command**: Lean, targeted instructions

## Learning System

The skill maintains a learning log (separate from main memory):
- Tracks which suggestions you accept vs reject
- Learns your evolving prompting style
- Adapts intervention threshold based on patterns
- Stores successful patterns per mode

## Integration

- **Memory**: Retrieves baseline patterns via MCP
- **Captain's Log**: Records improvement statistics
- **Session Context**: Infers session from workspace state

## Token Efficiency

Designed for high-frequency use:
- Minimal analysis footprint
- Smart truncation for large prompts
- Cached baseline patterns
- No-op path for well-formed prompts

## Examples

### Simple Improvement
**Before:** "Build an API"
**After:** "Build a REST API with Express.js, including authentication endpoints, user CRUD operations, and PostgreSQL integration. Follow existing workspace patterns in sessions/session-*/artifacts/code/."

### Pass Through
**Well-formed:** "Spawn adaptive hive to analyze codebase structure, identify refactoring opportunities, and generate comprehensive documentation. Save to sessions/session-20251118-*/artifacts/docs/."
**Result:** "No changes recommended ✓"

### Mode Mismatch Detection
**Prompt:** "Fix the bug" (in hive-mind mode)
**Suggestion:** "Consider adding context: Which bug? Which component? Should I spawn multiple agents to diagnose?"

## Related Skills

- `/tutor` - Learn Claude Flow concepts
- `/session-closeout` - End session with HITL approval
- Swarm Orchestration - Multi-agent coordination

## Invocation

Invoke this skill by running the `/prompt-improver` slash command, which activates the skill's prompt evaluation and improvement pipeline.
