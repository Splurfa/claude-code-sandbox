# Update Recommendations - Tutor-Mode & Tour-Guide

**Date**: 2025-11-22  
**Purpose**: Actionable recommendations for updating tutor-mode and tour-guide based on research findings  
**Status**: Ready for Implementation

---

## Executive Summary

Based on research into agent definitions and top 10 features analysis, this document provides specific recommendations for:

1. **Tutor-Mode Updates**: Add agent definitions knowledge (basic + advanced)
2. **Tour-Guide Updates**: Revise feature explorer with impressive capabilities
3. **Documentation Gaps**: Identify missing information
4. **Implementation Priorities**: Order of implementation

---

## 1. Tutor-Mode Updates

### Current State

**What Tutor-Mode Knows**:
- How to spawn agents (using Task tool with agent-type)
- Basic agent coordination patterns
- Memory usage for coordination
- Session management basics

**What Tutor-Mode Doesn't Know**:
- What `.claude/agents/` files are for
- How agent definitions relate to agent types
- Whether agent definitions are automatically loaded
- How to use agent definitions as reference documentation
- Difference between agent patterns and agent definitions

### Recommended Updates

#### Update 1: Add Agent Definitions Section

**Location**: `.claude/skills/tutor-mode/skill.md` - Phase 2: Essential Skills

**New Section**: "Understanding Agent Definitions"

**Content**:
```markdown
## Understanding Agent Definitions

### What Are Agent Definitions?

Agent definition files in `.claude/agents/` are **reference documentation** for agent types. They are NOT automatically loaded when you use Task() tool, but they provide valuable information about agent capabilities and behavior.

### Key Concepts

1. **Agent Definitions vs Agent Types**:
   - Agent definitions: Reference documentation files (`.claude/agents/core/coder.md`)
   - Agent types: String identifiers used in Task() tool (`"coder"`, `"researcher"`)
   - Task() uses agent-type as semantic hint, NOT file reference

2. **What Agent Definitions Contain**:
   - YAML frontmatter: Metadata (name, type, capabilities, hooks)
   - Markdown content: Detailed prompts and instructions
   - Hooks examples: Reference examples (not automatically executed)
   - Capability descriptions: What the agent can do

3. **How to Use Agent Definitions**:
   - **Reference**: Check definitions to understand agent capabilities
   - **Documentation**: Learn what each agent type does
   - **Templates**: Use as templates when creating custom agents
   - **Coordination**: Reference hooks examples for coordination patterns

### Practical Usage

**Example: Understanding Coder Agent**
```javascript
// Check agent definition for capabilities
Read: .claude/agents/core/coder.md

// Learn what coder agent does:
// - Code implementation
// - API design
// - Refactoring
// - Optimization
// - Error handling

// Use in Task() with semantic understanding
Task("Backend Developer", "Implement REST API. Save to sessions/$SESSION_ID/artifacts/code/.", "coder")
//                    ↑
//            Agent-type is semantic hint
//            NOT loaded from coder.md file
```

**Example: Creating Custom Agent**
```javascript
// Use agent definition as template
1. Copy structure from .claude/agents/core/coder.md
2. Modify YAML frontmatter for your agent
3. Update markdown content with your prompts
4. Use new agent-type in Task() calls
```

### Common Misconceptions

❌ **Wrong**: "Agent definitions are automatically loaded when I use Task()"
✅ **Correct**: "Agent definitions are reference documentation. Task() uses agent-type as semantic hint."

❌ **Wrong**: "I need to load agent definitions manually"
✅ **Correct**: "Agent definitions are optional reference material. Task() works without them."

❌ **Wrong**: "Agent definition hooks are automatically executed"
✅ **Correct**: "Agent definition hooks are examples. Workspace hooks in .claude/settings.json are executed."

### Advanced: Agent Definition Hooks

Agent definitions contain hooks in YAML frontmatter, but these are **reference examples**, not automatically executed code.

**Workspace Hooks** (actually executed):
- Configured in `.claude/settings.json`
- Fire automatically via Claude Code native hooks
- PreToolUse: Before file operations
- PostToolUse: After file operations

**Agent Definition Hooks** (reference examples):
- Shown in YAML frontmatter
- Demonstrate coordination patterns
- NOT automatically executed
- Use as reference for custom hooks

### Best Practices

1. **Use as Reference**: Check agent definitions to understand capabilities
2. **Don't Expect Auto-Loading**: Task() works independently
3. **Learn Patterns**: Study hooks examples for coordination ideas
4. **Create Custom**: Use definitions as templates for custom agents
5. **Stay Stock-First**: Keep definitions as reference, don't modify core behavior
```

#### Update 2: Add to Phase 2 Learning Path

**Location**: `.claude/skills/tutor-mode/skill.md` - Phase 2: Essential Skills

**Add to Learning Path**:
- After "Spawning Agents" section
- Before "Memory Coordination" section
- Title: "Understanding Agent Definitions"

#### Update 3: Add Exercise

**Location**: `.claude/skills/tutor-mode/skill.md` - Exercises Section

**New Exercise**:
```markdown
### Exercise: Explore Agent Definitions

**Objective**: Understand what agent definitions are and how to use them

**Steps**:
1. List all agent definitions: `ls -R .claude/agents/`
2. Read a core agent definition: `read .claude/agents/core/coder.md`
3. Identify YAML frontmatter sections
4. Note capabilities listed
5. Spawn agent using agent-type from definition
6. Verify agent-type is semantic hint (not file reference)

**Questions to Answer**:
- What information do agent definitions contain?
- How do agent definitions relate to Task() tool?
- Are agent definitions automatically loaded?
- How can you use agent definitions as reference?

**Expected Outcome**: Clear understanding that agent definitions are reference documentation, not runtime code.
```

---

## 2. Tour-Guide Updates

### Current State

**What Tour-Guide Shows**:
- Generic features (parallel execution, memory, sessions)
- Basic functionality descriptions
- Performance metrics
- Stock vs custom breakdown

**What Tour-Guide Doesn't Show**:
- SPARC methodology integration
- Orchestration topology integration
- Skill composition capabilities
- Custom command power
- Prompting flexibility spectrum

### Recommended Updates

#### Update 1: Revise Feature Explorer Top 10

**Location**: `.claude/skills/tour-guide/lib/feature-explorer.js` (to be created)

**New Top 10 List**:
```javascript
const TOP_10_FEATURES = {
  1: {
    id: 1,
    name: "SPARC Methodology",
    category: "custom",
    icon: "🎯",
    summary: "Systematic development with orchestration integration",
    details: "5-phase methodology (Specification → Pseudocode → Architecture → Refinement → Completion) with 17 specialized modes, quality gates, and topology integration. Enables structured workflows from requirements to deployment.",
    performance: "2.8-4.4x speed improvement, 85% success rate",
    integration: "Works with all 4 topologies, integrates with skills and custom commands"
  },
  2: {
    id: 2,
    name: "Orchestration Topology Integration",
    category: "stock",
    icon: "🌐",
    summary: "4 coordination patterns integrated with workflows",
    details: "Mesh (peer-to-peer), Hierarchical (tree), Star (centralized), Ring (circular) topologies that integrate directly with SPARC methodology, skills, and custom workflows. Optimal coordination for different use cases.",
    performance: "Optimal agent coordination, scalable to 10+ agents",
    integration: "SPARC uses topologies, skills request topologies, custom commands combine topologies"
  },
  3: {
    id: 3,
    name: "Skill Integration & Composition",
    category: "custom",
    icon: "🔗",
    summary: "31 skills that integrate seamlessly",
    details: "Meta-skill routing (95% confidence), stream-chain sequential execution, skill composition into custom workflows. Skills work together through natural language discovery and data flow.",
    performance: "Lazy loading reduces context bloat, 95% skill matching accuracy",
    integration: "Meta-skill coordinates, stream-chain sequences, custom commands combine"
  },
  4: {
    id: 4,
    name: "Custom Commands",
    category: "custom",
    icon: "⚙️",
    summary: "Combine any skills into powerful workflows",
    details: "Create custom commands that combine multiple skills, pass data between skills, branch conditionally, and save reusable workflow templates. Enables powerful multi-phase workflows.",
    performance: "Reusable workflows, parameterized execution",
    integration: "Uses meta-skill, stream-chain, SPARC, topologies, memory"
  },
  5: {
    id: 5,
    name: "Prompting Flexibility",
    category: "custom",
    icon: "💬",
    summary: "Open vs structured prompting spectrum",
    details: "Seamless transition between natural language (exploration) and structured commands (execution). Prompt-improver auto-suggests enhancements. Adapts to Flow modes (hive, swarm, wizard, direct).",
    performance: "Reduced friction, adaptive learning",
    integration: "Works with meta-skill, custom commands, memory patterns"
  },
  6: {
    id: 6,
    name: "Parallel Agent Execution",
    category: "stock",
    icon: "⚡",
    summary: "10-20x faster concurrent spawning",
    details: "Spawn multiple agents concurrently in single message. Golden rule: '1 MESSAGE = ALL RELATED OPERATIONS'. Foundation for all coordination features.",
    performance: "2.8-4.4x speed, 32.3% token reduction, 85% success rate",
    integration: "Foundation for SPARC, topologies, skills, custom commands"
  },
  7: {
    id: 7,
    name: "Memory Coordination",
    category: "stock",
    icon: "🧠",
    summary: "68K+ entries, cross-session persistence",
    details: "Persistent SQLite database enabling seamless agent coordination and knowledge sharing. Semantic search, namespace organization, cross-session persistence.",
    performance: "68,219 entries, 15 namespaces, 118MB database",
    integration: "SPARC uses for phase transitions, topologies coordinate via memory, skills store patterns"
  },
  8: {
    id: 8,
    name: "Session Management",
    category: "custom",
    icon: "📁",
    summary: "Containment-promotion architecture",
    details: "Isolated workspaces for AI-generated content with HITL approval for promotion. File routing enforcement, lifecycle management, curated promotion.",
    performance: "Clean workspace organization, scalable to high-volume generation",
    integration: "All agents use sessions, SPARC organizes by session, skills generate in sessions"
  },
  9: {
    id: 9,
    name: "Meta-Skill Routing",
    category: "custom",
    icon: "🎯",
    summary: "95% confidence natural language matching",
    details: "Intelligent skill discovery via semantic matching. Lazy loading reduces context bloat. Menu interface for exploration. Suggests multi-skill workflows.",
    performance: "95% matching accuracy, lazy loading efficiency",
    integration: "Routes to all 31 skills, suggests combinations, works with stream-chain"
  },
  10: {
    id: 10,
    name: "ReasoningBank Learning",
    category: "custom",
    icon: "🧬",
    summary: "Adaptive learning from experience",
    details: "Stores successful patterns and automatically applies optimized strategies. Pattern recognition, strategy optimization, continuous learning, meta-learning.",
    performance: "Self-improving over time, pattern-based optimization",
    integration: "Learns from SPARC workflows, optimizes topologies, improves skill composition"
  }
};
```

#### Update 2: Update Feature Catalog

**Location**: `.claude/skills/tour-guide/docs/feature-catalog.md`

**Changes**:
- Replace generic features with revised top 10
- Add integration examples for each feature
- Emphasize composition and coordination
- Show large-scale coordination examples

#### Update 3: Update Tour Scripts

**Location**: `.claude/skills/tour-guide/docs/tour-scripts/`

**Changes Needed**:
- **Beginner Tour**: Simplify but mention SPARC and skill integration
- **Intermediate Tour**: Emphasize skill composition and custom commands
- **Advanced Tour**: Deep dive into SPARC + topology integration
- **Expert Tour**: Advanced coordination patterns and ReasoningBank

---

## 3. Documentation Gaps Identified

### Gap 1: Agent Definitions Purpose

**Issue**: No clear documentation explaining what `.claude/agents/` files are for

**Impact**: Users confused about whether to use them, how to use them, if they're automatically loaded

**Recommendation**: 
- Add section to CLAUDE.md explaining agent definitions
- Update tutor-mode with agent definitions knowledge
- Add to tour-guide advanced pathway

### Gap 2: Agent Patterns vs Agent Definitions

**Issue**: README.md describes "Agent Patterns" but files are "Agent Definitions" - confusion

**Impact**: Users don't understand the distinction

**Recommendation**:
- Clarify in README.md that it describes patterns, but files are definitions
- Update documentation to explain both concepts
- Add to tutor-mode learning path

### Gap 3: Top 10 Features Focus

**Issue**: Current top 10 are too generic, don't show impressive coordination capabilities

**Impact**: Users don't see the real value of the system

**Recommendation**:
- Revise feature explorer with impressive capabilities
- Emphasize integration and composition
- Show large-scale coordination examples

### Gap 4: Skill Integration Documentation

**Issue**: Limited documentation on how skills integrate with each other

**Impact**: Users don't understand composability

**Recommendation**:
- Add skill integration examples to tour-guide
- Document skill composition patterns
- Show custom command examples

### Gap 5: Prompting Flexibility Spectrum

**Issue**: No documentation on open vs structured prompting flexibility

**Impact**: Users don't understand the power of flexible interaction

**Recommendation**:
- Add prompting flexibility section to tour-guide
- Document prompt-improver integration
- Show hybrid prompting examples

---

## 4. Implementation Priorities

### Priority 1: High Impact, Low Effort

1. **Update Tour-Guide Feature Explorer** (2-3 hours)
   - Revise top 10 list in feature-explorer.js
   - Update feature-catalog.md
   - Impact: Immediate visibility of impressive capabilities

2. **Add Agent Definitions to Tutor-Mode** (1-2 hours)
   - Add "Understanding Agent Definitions" section
   - Add exercise
   - Impact: Clarifies confusion about agent definitions

### Priority 2: High Impact, Medium Effort

3. **Update Tour Scripts** (3-4 hours)
   - Revise all pathway scripts (beginner, intermediate, advanced, expert)
   - Emphasize integration and composition
   - Impact: Better user understanding of capabilities

4. **Document Skill Integration** (2-3 hours)
   - Add skill composition examples
   - Document custom command patterns
   - Impact: Users understand composability

### Priority 3: Medium Impact, Low Effort

5. **Clarify Agent Patterns vs Definitions** (1 hour)
   - Update README.md
   - Add distinction to CLAUDE.md
   - Impact: Reduces confusion

6. **Document Prompting Flexibility** (1-2 hours)
   - Add section to tour-guide
   - Show examples
   - Impact: Users understand interaction flexibility

### Priority 4: Long-Term Enhancements

7. **Enhance Meta-Skill Integration** (Future)
   - Consider loading agent definitions as context (optional)
   - Integrate with meta-skill routing
   - Impact: Better agent selection

8. **ReasoningBank Integration** (Future)
   - Learn from agent definition usage patterns
   - Optimize agent selection
   - Impact: Self-improving system

---

## Implementation Checklist

### Tutor-Mode Updates

- [ ] Add "Understanding Agent Definitions" section to Phase 2
- [ ] Add agent definitions exercise
- [ ] Update learning path to include agent definitions
- [ ] Add common misconceptions section
- [ ] Document agent definition hooks vs workspace hooks

### Tour-Guide Updates

- [ ] Create feature-explorer.js with revised top 10
- [ ] Update feature-catalog.md with new features
- [ ] Revise beginner tour script
- [ ] Revise intermediate tour script
- [ ] Revise advanced tour script
- [ ] Revise expert tour script
- [ ] Add skill integration examples
- [ ] Add custom command examples
- [ ] Add prompting flexibility section

### Documentation Updates

- [ ] Update CLAUDE.md with agent definitions explanation
- [ ] Clarify agent patterns vs definitions in README.md
- [ ] Add skill integration documentation
- [ ] Document prompting flexibility spectrum
- [ ] Add large-scale coordination examples

---

## Success Metrics

### Tutor-Mode Success

- Users understand agent definitions are reference documentation
- Users know agent definitions are NOT automatically loaded
- Users can use agent definitions as reference and templates
- Clear distinction between agent patterns and definitions

### Tour-Guide Success

- Top 10 features emphasize impressive coordination capabilities
- Users see integration and composition value
- Large-scale coordination examples are clear
- Skill integration is well-documented

### Documentation Success

- No confusion about agent definitions purpose
- Clear distinction between patterns and definitions
- Skill integration is well-explained
- Prompting flexibility is documented

---

## References

- Agent Definitions Research: `agent-definitions-research.md`
- Top 10 Features Analysis: `top-10-features-analysis.md`
- Tutor-Mode Skill: `.claude/skills/tutor-mode/skill.md`
- Tour-Guide Skill: `.claude/skills/tour-guide/tour-guide.yaml`
- Feature Catalog: `.claude/skills/tour-guide/docs/feature-catalog.md`

