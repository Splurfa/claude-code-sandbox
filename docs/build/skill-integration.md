# Skill Integration Guide

**Purpose**: Understand how skills integrate with each other, enabling powerful composition patterns for large-scale coordination.

---

## Overview

This workspace includes 31 custom skills that integrate seamlessly through natural language discovery, sequential execution, and workflow composition. Skills don't work in isolation—they compose into powerful workflows.

---

## Core Integration Mechanisms

### 1. Meta-Skill Routing (Custom Extension)

**What It Does**: Intelligent skill discovery via semantic matching with 95% confidence. This is a **custom skill** added to this workspace.

**How It Works**:
```bash
# Natural language skill discovery
/meta-skill "help me optimize my prompts"

# Meta-skill analyzes your request:
→ Extracts keywords: ["optimize", "prompts"]
→ Scores skills: prompt-improver (95%), verification-quality (38%)
→ Auto-invokes prompt-improver (>80% confidence)
```

**Confidence Thresholds**:
- **>80%**: Auto-invoke (high confidence single match)
- **30-80%**: Present options menu (multiple candidates)
- **<30%**: Show category menu (no clear match)

**Multi-Skill Workflow Suggestion**:
```bash
User: "I want to build a review system"

Meta-Skill:
🎯 This requires multiple skills:
1. swarm-orchestration - Set up multi-agent coordination
2. github-code-review - Configure automated review
3. verification-quality - Add quality scoring gates

Recommended workflow:
  Step 1: swarm-orchestration
  Step 2: github-code-review
  Step 3: verification-quality
```

**Integration Points**:
- Routes to all 31 custom skills
- Suggests skill combinations
- Works with stream-chain for sequential execution
- Integrates with custom commands
- Uses memory for pattern matching

---

### 2. Stream-Chain Sequential Execution (Custom Extension)

**What It Does**: Execute skills in sequence with automatic data flow between them. This is a **custom skill** added to this workspace.

**How It Works**:
```bash
# Execute skills in sequence with data flow
/stream-chain prompt-improver → verification-quality → github-code-review

# Each skill receives output from previous skill
# Data flows automatically between skills
```

**Example Workflow**:
```bash
# Step 1: Improve prompts
/stream-chain prompt-improver "optimize this code review prompt"
→ Output: Improved prompt with security validation

# Step 2: Verify quality
/stream-chain verification-quality --input="improved-prompt"
→ Output: Quality score and recommendations

# Step 3: Review code
/stream-chain github-code-review --prompt="improved-prompt" --quality-threshold=80
→ Output: Code review with quality gates
```

**Integration Points**:
- Works with meta-skill for discovery
- Integrates with custom commands
- Coordinates via memory for data flow
- Supports conditional branching

---

### 3. Custom Command Composition (Stock Claude Flow)

**What It Does**: Combine multiple skills into reusable workflows. This is a **native feature** of the Stock Claude Flow engine.

**How It Works**:
```bash
# Custom command: full-stack-feature
/full-stack-feature user-authentication --topology=mesh --phases=all

# This custom command executes:
1. SPARC Specification Phase
   - researcher skill: Gather requirements
   - planner skill: Create user stories
   
2. SPARC Architecture Phase
   - system-architect skill: Design system
   - db-architect skill: Design database
   
3. Swarm Orchestration Setup
   - swarm-orchestration skill: Initialize mesh topology
   - Spawn backend, frontend, database agents
   
4. SPARC Refinement Phase (Parallel)
   - coder skill: Implement backend
   - coder skill: Implement frontend
   - tester skill: Write tests
   
5. Quality Gates
   - github-code-review skill: Review code
   - verification-quality skill: Score quality, rollback if needed
   
6. SPARC Completion Phase
   - documenter skill: Generate documentation
   - workflow-manager skill: Prepare deployment
```

**Creating Custom Commands**:
```bash
# Example: Code review workflow
/custom-command code-review-workflow
  Step 1: swarm-orchestration --topology=star
  Step 2: github-code-review --strict
  Step 3: verification-quality --threshold=80
  Step 4: prompt-improver --suggest-improvements
```

**Integration Points**:
- Uses meta-skill for skill discovery
- Integrates with SPARC methodology
- Works with all orchestration topologies
- Leverages stream-chain for sequential execution
- Coordinates via memory system

---

## Integration Examples

### Example 1: Skill + Topology Integration

```bash
# Skills can request specific topologies
/swarm-orchestration --topology=hierarchical --max-agents=8
→ Skills coordinate agents using hierarchical topology
```

### Example 2: Skill + Memory Integration

```bash
# Skills store patterns in memory
/prompt-improver "optimize this code"
→ Stores successful patterns in memory
→ Future prompts use learned patterns
```

### Example 3: Skill + SPARC Integration

```bash
# SPARC methodology uses skills for each phase
/sparc-methodology full-feature
→ Specification phase: Uses researcher, planner skills
→ Architecture phase: Uses system-architect, db-architect skills
→ Refinement phase: Uses coder, tester skills
→ Completion phase: Uses documenter, workflow-manager skills
```

### Example 4: Skill + ReasoningBank Integration

```bash
# Skills learn from successful workflows
/reasoningbank-intelligence record-experience
→ Stores successful skill combinations
→ Recommends optimal skill sequences
→ Learns from user feedback
```

---

## Skill Categories & Integration Patterns

### Core Workflow Skills
- `session-closeout` - Natural language session closeout with HITL approval
- `meta-skill` - Intelligent skill routing via natural language and menus
- `file-routing` - AI self-check for CLAUDE.md file routing compliance
- `prompt-improver` - Enhance prompt quality with security validation
- `hooks-automation` - Automated coordination and learning from operations

**Integration**: These skills work together to automate common workflows and ensure compliance.

### Learning & Education Skills
- `tour-guide` - Interactive workspace orientation
- `tutor-mode` - Adaptive learning guide with workspace awareness
- `skill-builder` - Create new Claude Code Skills with proper structure
- `pair-programming` - AI-assisted pair programming with verification

**Integration**: Learning skills coordinate to provide progressive learning paths.

### Multi-Agent Coordination Skills
- `swarm-orchestration` - Orchestrate multi-agent swarms for parallel execution
- `swarm-advanced` - Advanced swarm patterns for complex workflows
- `hive-mind-advanced` - Queen-led collective intelligence with consensus
- `stream-chain` - Stream-JSON chaining for multi-agent pipelines

**Integration**: Coordination skills integrate with topologies and SPARC methodology.

### SPARC Methodology Skills
- `sparc-methodology` - 5-phase systematic development
- `sparc-coord` - SPARC coordination patterns
- `sparc-coder` - SPARC coding patterns

**Integration**: SPARC skills integrate with topologies, skills, and custom commands.

### Quality & Review Skills
- `verification-quality` - Quality scoring gates
- `github-code-review` - Automated code review
- `code-analyzer` - Code analysis and insights

**Integration**: Quality skills integrate with SPARC methodology and custom commands.

---

## Best Practices

### 1. Use Meta-Skill for Discovery
Always start with meta-skill to discover relevant skills:
```bash
/meta-skill "I want to build a review system"
```

### 2. Compose Skills Sequentially
Use stream-chain for sequential execution:
```bash
/stream-chain skill1 → skill2 → skill3
```

### 3. Create Custom Commands
Save frequently used skill combinations as custom commands:
```bash
/custom-command my-workflow
  Step 1: skill1
  Step 2: skill2
  Step 3: skill3
```

### 4. Integrate with SPARC
Use SPARC methodology to structure skill workflows:
```bash
/sparc-methodology full-feature --skills="skill1,skill2,skill3"
```

### 5. Leverage Memory
Skills coordinate via memory:
```bash
# Skill 1 stores data
/skill1 --store-in-memory="namespace/key"

# Skill 2 retrieves data
/skill2 --read-from-memory="namespace/key"
```

---

## Advanced Patterns

### Pattern 1: Skill Composition with Conditional Branching

```bash
/custom-command conditional-workflow
  Step 1: verification-quality --threshold=80
  Step 2: IF quality >= 80 THEN github-code-review ELSE prompt-improver
  Step 3: Continue with next steps
```

### Pattern 2: Skill Composition with Parallel Execution

```bash
/custom-command parallel-workflow
  Step 1: [Parallel] skill1, skill2, skill3
  Step 2: [Sequential] skill4 → skill5
```

### Pattern 3: Skill Composition with Memory Coordination

```bash
/custom-command memory-coordinated-workflow
  Step 1: skill1 --store="namespace/key1"
  Step 2: skill2 --read="namespace/key1" --store="namespace/key2"
  Step 3: skill3 --read="namespace/key2"
```

---

## Troubleshooting

### Issue: Skills Not Integrating

**Solution**: Ensure skills are using memory for coordination:
```bash
# Check memory namespace
/memory list --namespace="skill-coordination"

# Verify skill output
/skill1 --verbose --store-in-memory="namespace/key"
```

### Issue: Stream-Chain Not Working

**Solution**: Verify data flow between skills:
```bash
# Check intermediate outputs
/stream-chain skill1 → skill2 --debug

# Verify memory coordination
/memory get --namespace="stream-chain" --key="intermediate-output"
```

### Issue: Custom Command Failing

**Solution**: Test individual skills first:
```bash
# Test each skill individually
/skill1 --test
/skill2 --test
/skill3 --test

# Then test as custom command
/custom-command my-workflow --test
```

---

## Related Documentation

- [SPARC Methodology](../coordinate/sparc-methodology.md) - Systematic development framework
- [Meta-Skill Documentation](../../.claude/skills/meta-skill/README.md) - Skill discovery and routing
- [Custom Commands Guide](./custom-commands.md) - Creating reusable workflows
- [Top 10 Features Analysis](../../inbox/cursor-agent/claude-flow-setup/top-10-features-analysis.md) - Feature integration examples

