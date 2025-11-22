# Agent Definitions Research - Definitive Findings

**Date**: 2025-11-22  
**Research Objective**: Understand the exact purpose and usage of `.claude/agents/` files populated during Claude Flow initialization  
**Status**: Research Complete - Definitive Answers Found

---

## Executive Summary

**CRITICAL FINDING**: There are TWO distinct concepts in `.claude/agents/`:

1. **Agent Patterns** (described in README.md) - Natural language trigger phrases for bash workflows
2. **Agent Definitions** (actual .md files) - Reference documentation/templates with YAML frontmatter and detailed prompts

**DEFINITIVE ANSWER**: Agent definition files are **reference documentation and templates**, NOT automatically loaded when using Task() tool. The agent-type parameter in Task() is a semantic hint, not a file reference.

---

## Critical Questions Answered

### Q1: What is the exact purpose of `.claude/agents/` files?

**Answer**: The `.claude/agents/` directory contains **two different types of files**:

1. **Agent Patterns** (described in README.md):
   - Natural language trigger phrases
   - Execute bash workflows via stock claude-flow commands
   - Example: "Close out this session" → runs hooks
   - These are workflow automation wrappers

2. **Agent Definition Files** (actual .md files like `core/coder.md`):
   - YAML frontmatter with metadata (name, type, capabilities, hooks)
   - Detailed markdown prompts/instructions
   - Reference documentation for agent behavior
   - Templates for understanding agent capabilities

**Key Distinction**: The README.md describes "Agent Patterns" (bash workflows), but the actual files are "Agent Definitions" (prompts/documentation).

### Q2: Are agent definition files automatically loaded when Task() uses agent-type?

**Answer**: **NO** - Agent definition files are NOT automatically loaded.

**Evidence**:
- Documentation states agent-type is a "semantic hint" (docs/build/spawning-agents.md)
- No code found that loads `.claude/agents/*.md` files
- Task() tool uses agent-type as a string identifier, not a file path
- Agent definitions are reference documentation, not runtime code

**How Task() Actually Works**:
```javascript
Task("Agent Name", "Instructions", "agent-type")
//                    ↑
//            This is just a string identifier
//            Claude Code understands semantically
//            NOT loaded from .claude/agents/ files
```

### Q3: Are they reference docs, runtime configs, templates, or something else?

**Answer**: **Reference Documentation + Templates**

**Structure Analysis**:
- **YAML Frontmatter**: Metadata (name, type, capabilities, hooks)
- **Markdown Content**: Detailed prompts and instructions
- **Hooks in Frontmatter**: Reference examples, not automatically executed
- **Purpose**: Documentation for understanding agent capabilities and behavior

**What They Are**:
- ✅ Reference documentation for agent types
- ✅ Templates showing expected agent behavior
- ✅ Examples of agent capabilities and coordination patterns
- ✅ Documentation for hooks and memory coordination

**What They Are NOT**:
- ❌ Runtime configuration files
- ❌ Automatically loaded prompts
- ❌ Executable code
- ❌ Required for Task() to work

### Q4: Are they for users, builders, or both?

**Answer**: **Primarily for BUILDERS** (people building with Claude Flow), but also useful for USERS (people using Claude Flow).

**For BUILDERS**:
- Understanding how to create custom agent types
- Learning agent capability patterns
- Seeing examples of hooks and coordination
- Template for creating new agent definitions

**For USERS**:
- Reference for available agent types
- Understanding what each agent type does
- Learning agent capabilities and use cases
- Documentation for coordination patterns

**Current State**: The files exist but are **underutilized** - they're not integrated into the workflow automatically.

### Q5: Should they be set up to be called automatically in workspace?

**Answer**: **NO** - They should NOT be automatically called, but they COULD be enhanced to provide value.

**Current Reality**:
- Agent definitions are reference documentation
- Task() tool works without loading these files
- Agent-type is semantic, not file-based

**Potential Enhancement** (if desired):
- Could create a system that loads agent definitions as context
- Could use them to auto-generate prompts
- Could integrate them into meta-skill routing
- **BUT**: This would be a custom extension, not stock Claude Flow behavior

**Recommendation**: Keep them as reference documentation. If you want them to be more useful:
1. Use them as documentation for available agent types
2. Reference them when creating custom agents
3. Consider enhancing meta-skill to use them for agent selection
4. Don't expect them to be automatically loaded

### Q6: How do they maximize value - what's the intended workflow?

**Answer**: **Current Intended Workflow** (based on evidence):

1. **Reference**: When spawning agents, check agent definitions to understand capabilities
2. **Documentation**: Use them to learn what each agent type does
3. **Templates**: Use them as templates when creating custom agents
4. **Coordination**: Reference hooks examples for coordination patterns

**Actual Current Usage**:
- Files exist but are not actively used
- Agent types are used semantically (string identifiers)
- No automatic integration with Task() tool
- Documentation value only

**Potential Enhanced Workflow** (custom extension):
1. Meta-skill could read agent definitions to match user intent
2. Agent definitions could be loaded as context when spawning
3. Hooks in definitions could be executed (but currently aren't)
4. Agent capabilities could be auto-discovered from definitions

---

## Detailed Analysis

### File Structure Analysis

**Example Agent Definition** (`core/coder.md`):
```yaml
---
name: coder
type: developer
color: "#FF6B35"
description: Implementation specialist for writing clean, efficient code
capabilities:
  - code_generation
  - refactoring
  - optimization
  - api_design
  - error_handling
priority: high
hooks:
  pre: |
    echo "💻 Coder agent implementing: $TASK"
    # Check for existing tests
    if grep -q "test\|spec" <<< "$TASK"; then
      echo "⚠️  Remember: Write tests first (TDD)"
    fi
  post: |
    echo "✨ Implementation complete"
    # Run basic validation
    if [ -f "package.json" ]; then
      npm run lint --if-present
    fi
---
# Code Implementation Agent

You are a senior software engineer specialized in writing clean, maintainable, and efficient code...
```

**Key Observations**:
- YAML frontmatter contains metadata and hooks
- Hooks reference `$TASK` variable (suggesting they might be executed)
- Markdown content contains detailed prompts
- No evidence these hooks are actually executed
- No code found that loads these files

### Agent Patterns vs Agent Definitions

**Agent Patterns** (README.md):
- Purpose: Natural language → bash workflows
- Example: "Close out this session" → runs hooks
- Structure: Trigger phrases + bash commands
- Usage: Workflow automation

**Agent Definitions** (actual .md files):
- Purpose: Reference documentation for agent types
- Example: `core/coder.md` → documents coder agent capabilities
- Structure: YAML frontmatter + markdown prompts
- Usage: Documentation and templates

**Mismatch**: README describes one thing, files are another thing.

### Integration with Hooks System

**Workspace Hooks** (`.claude/settings.json`):
- PreToolUse hooks fire before tool execution
- PostToolUse hooks fire after tool execution
- These are workspace-level hooks, not agent-definition hooks

**Agent Definition Hooks** (in YAML frontmatter):
- Pre hooks: Reference examples for agent initialization
- Post hooks: Reference examples for agent completion
- **Status**: NOT automatically executed
- **Purpose**: Documentation/examples only

**Conclusion**: Agent definition hooks are examples, not executable code.

### Task() Tool Behavior

**How Task() Actually Works**:
```javascript
Task("Agent Name", "Instructions", "agent-type")
```

**What Happens**:
1. Claude Code receives Task() call
2. Agent-type is used as semantic hint
3. Claude Code understands agent-type semantically (e.g., "coder" = coding specialist)
4. Agent executes with provided instructions
5. **NO FILE LOADING**: Agent definition files are NOT loaded

**Evidence**:
- Documentation says agent-type is "semantic hint"
- No code found that loads `.claude/agents/*.md` files
- Task() works without agent definition files existing
- Agent definitions are optional reference material

---

## Stock vs Custom Analysis

### Stock Claude Flow Behavior

**Stock Behavior** (from ruvnet/claude-flow):
- Agent types are semantic identifiers
- Task() tool uses agent-type as hint
- No automatic file loading from `.claude/agents/`
- Agent definitions are reference documentation

### Custom Extensions in This Workspace

**Custom Extensions**:
- 54+ agent definition files populated during initialization
- YAML frontmatter with hooks (not standard)
- Detailed markdown prompts (workspace-specific)
- **BUT**: Still not automatically loaded

**Stock-First Principle**:
- Agent definitions follow stock pattern (reference docs)
- No custom code to load them automatically
- Maintains 97.5% stock implementation

---

## Recommendations

### For Users (Using Claude Flow)

1. **Use Agent Definitions as Reference**:
   - Check `.claude/agents/core/` for available agent types
   - Read agent definitions to understand capabilities
   - Use agent-type strings from definitions in Task() calls

2. **Don't Expect Auto-Loading**:
   - Agent definitions are NOT automatically loaded
   - Task() works with just the agent-type string
   - Definitions are documentation, not runtime code

3. **Leverage Documentation Value**:
   - Use definitions to understand coordination patterns
   - Reference hooks examples for custom workflows
   - Learn agent capabilities from definitions

### For Builders (Building with Claude Flow)

1. **Use as Templates**:
   - Copy agent definition structure for custom agents
   - Use YAML frontmatter pattern for metadata
   - Follow markdown prompt structure

2. **Enhance Integration** (Optional):
   - Could create custom code to load definitions as context
   - Could integrate with meta-skill for agent selection
   - Could execute hooks from definitions (custom extension)

3. **Maintain Stock-First**:
   - Keep definitions as reference documentation
   - Don't break stock Task() behavior
   - Enhance, don't replace

### For Workspace Enhancement

1. **Documentation Updates**:
   - Update tutor-mode to explain agent definitions
   - Clarify distinction between patterns and definitions
   - Document that definitions are reference, not runtime

2. **Potential Enhancements**:
   - Meta-skill could use definitions for agent matching
   - Agent definitions could be loaded as context (optional)
   - Hooks could be executed from definitions (custom)

3. **Keep Current State**:
   - Definitions are useful as reference documentation
   - No need to auto-load them
   - Maintain stock-first principle

---

## Conclusion

**DEFINITIVE ANSWERS**:

1. **Purpose**: Reference documentation and templates for agent types
2. **Auto-Loading**: NO - Not automatically loaded by Task() tool
3. **Type**: Reference documentation, not runtime configs
4. **Audience**: Both users and builders, but primarily builders
5. **Auto-Calling**: NO - Should not be automatically called
6. **Maximize Value**: Use as reference documentation and templates

**Key Insight**: Agent definition files are valuable reference documentation, but they're not automatically integrated into the workflow. They exist to help users and builders understand agent capabilities, but Task() tool works independently using semantic agent-type strings.

**Recommendation**: Keep them as reference documentation. Enhance tutor-mode and tour-guide to explain their purpose. Consider optional enhancements (meta-skill integration) but maintain stock-first principle.

---

## References

- `.claude/agents/README.md` - Agent Patterns documentation
- `.claude/agents/core/coder.md` - Example agent definition
- `docs/build/spawning-agents.md` - Task() tool documentation
- `docs/build/custom-agents.md` - Custom agent creation guide
- `CLAUDE.md` - Workspace configuration

