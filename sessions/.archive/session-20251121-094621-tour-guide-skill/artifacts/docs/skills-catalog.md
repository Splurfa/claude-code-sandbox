# Skills Catalog - All 32 Claude Code Skills

**Generated**: 2025-11-21
**Purpose**: Complete catalog of all skills with descriptions and use cases
**Location**: `.claude/skills/`

---

## Overview

This workspace includes **32 specialized skills** that extend Claude Code's capabilities for multi-agent coordination, learning, quality assurance, and platform integration.

### Skills by Category:

1. **Core Workflow** (5 skills) - Essential operations
2. **Learning & Education** (3 skills) - Guided learning
3. **Multi-Agent Coordination** (4 skills) - Swarm orchestration
4. **Quality & Verification** (2 skills) - Code quality assurance
5. **Database & Memory** (5 skills) - AgentDB features
6. **GitHub Integration** (5 skills) - Repository automation
7. **Platform Integration** (3 skills) - Flow-Nexus features
8. **Advanced Coordination** (3 skills) - ReasoningBank & learning
9. **Development Methodology** (2 skills) - SPARC & pair programming

---

## 1. Core Workflow Skills (5)

### session-closeout
**Description**: Natural language session closeout with HITL approval and Captain's Log integration

**Use When**:
- Finishing a chat session
- Need to archive work
- Want Captain's Log entry
- Moving session to `.archive/`

**Key Features**:
- Auto-generates session summary
- HITL approval required
- Archives to `.swarm/backups/`
- Updates Captain's Log
- Optional document promotion

**Triggers**: "Close out this session", "End session", "Done with this session"

**Location**: `.claude/skills/session-closeout/`

**Examples**: `examples/basic-closeout.md`, `examples/batch-closeout.md`

---

### meta-skill
**Description**: Intelligent skill routing via natural language and menus

**Use When**:
- Unsure which skill to use
- Want to explore available skills
- Need multi-skill coordination
- Looking for specific capability

**Key Features**:
- Natural language skill matching (95% confidence)
- Category-based browsing
- Direct skill invocation
- Multi-skill workflow suggestions
- Semantic search with confidence scores

**Triggers**: "help me optimize", "I want to learn", "show me available skills"

**Location**: `.claude/skills/meta-skill/`

**Commands**:
```
/meta menu              # Browse by category
/meta search <query>    # Search skills
/meta invoke <skill>    # Direct invocation
/meta list              # All skills
```

---

### file-routing
**Description**: AI self-check reference for CLAUDE.md file routing compliance

**Use When**:
- Need to verify file placement
- Creating new files
- Moving artifacts
- Unsure about routing rules

**Key Features**:
- 3-question decision tree
- Session artifacts routing
- Document promotion guide
- Compliance checking

**Location**: `.claude/skills/file-routing/`

**Core Rule**: ALL new files → `sessions/<session-id>/artifacts/`

---

### prompt-improver
**Description**: Enhance prompt quality using Context7 intelligence and security validation

**Use When**:
- Writing prompts for agents
- Need prompt optimization
- Concerned about injection attacks
- Want quality scoring

**Key Features**:
- Context7 intelligence integration
- Security validation (injection prevention)
- Quality scoring (0-100)
- Automated refinement
- Best practices enforcement

**Location**: `.claude/skills/prompt-improver/`

---

### hooks-automation
**Description**: Automated coordination, formatting, and learning from Claude Code operations

**Use When**:
- Setting up workspace automation
- Configuring hook system
- Need pre/post operation triggers
- Want memory coordination

**Key Features**:
- Pre/post task hooks
- Session management automation
- Git integration
- Memory coordination
- Neural pattern training

**Location**: `.claude/skills/hooks-automation/`

**Hook Types**: PreToolUse, PostToolUse (via `.claude/settings.json`)

---

## 2. Learning & Education Skills (3)

### tutor-mode
**Description**: Adaptive learning guide with full workspace documentation awareness

**Use When**:
- New to claude-flow
- Learning multi-agent patterns
- Need structured learning path
- Want hands-on exercises

**Key Features**:
- 4 learning phases (Foundations → Advanced)
- Context-aware exercises
- Progress tracking (stored in memory)
- Quality-scored references (SAFE ≥70)
- Personalized learning paths

**Location**: `.claude/skills/tutor-mode/`

**Commands**:
```
/tutor start            # Begin learning
/tutor assess           # Test knowledge
/tutor next             # Next lesson
/tutor explain <topic>  # Concept explanation
/tutor progress         # View progress
```

**Learning Phases**:
1. **Foundations** (1-2 weeks) - Basics, first session, memory
2. **Essential Skills** (2-3 weeks) - Parallel execution, coordination
3. **Intermediate** (3-4 weeks) - Swarm topologies, consensus
4. **Advanced** (3-6 months) - Hive-mind, BFT, self-learning

---

### skill-builder
**Description**: Create new Claude Code Skills with proper YAML frontmatter and structure

**Use When**:
- Building custom skills
- Need skill templates
- Want proper skill structure
- Understanding skill specification

**Key Features**:
- YAML frontmatter generation
- Progressive disclosure structure
- Directory organization
- Example generation
- Claude Skills spec compliance

**Location**: `.claude/skills/skill-builder/`

---

### pair-programming
**Description**: AI-assisted pair programming with multiple modes and verification

**Use When**:
- Collaborative coding
- Learning new patterns
- Need real-time review
- TDD workflows
- Debugging sessions

**Key Features**:
- 3 modes (driver/navigator/switch)
- Real-time verification
- Quality monitoring (truth-score)
- Comprehensive testing support
- Automatic role switching
- Security scanning

**Location**: `.claude/skills/pair-programming/`

---

## 3. Multi-Agent Coordination Skills (4)

### swarm-orchestration
**Description**: Orchestrate multi-agent swarms with claude-flow for parallel task execution

**Use When**:
- Coordinating 5+ agents
- Building distributed systems
- Need parallel task execution
- Complex workflows

**Key Features**:
- 4 topologies (mesh, hierarchical, ring, star)
- Dynamic topology selection
- Intelligent coordination
- Task distribution
- Agent lifecycle management

**Location**: `.claude/skills/swarm-orchestration/`

**Topologies**:
- **Mesh**: Peer-to-peer (best for collaboration)
- **Hierarchical**: Tree structure (best for delegation)
- **Ring**: Circular (best for sequential processing)
- **Star**: Centralized (best for single coordinator)

---

### swarm-advanced
**Description**: Advanced swarm orchestration patterns for research, development, testing

**Use When**:
- Complex distributed workflows
- Research coordination
- Advanced testing scenarios
- Performance optimization

**Key Features**:
- Research swarms
- Development swarms
- Testing swarms
- Custom coordination patterns
- Advanced topology switching

**Location**: `.claude/skills/swarm-advanced/`

---

### hive-mind-advanced
**Description**: Advanced Hive Mind collective intelligence with queen-led coordination

**Use When**:
- Need queen-based coordination
- Collective decision making
- Consensus mechanisms required
- Persistent memory coordination

**Key Features**:
- Queen selection (strategic/tactical/adaptive)
- Worker specialization
- Scout exploration
- Memory manager
- Consensus building
- Persistent hive memory (`.hive-mind/hive.db`)

**Location**: `.claude/skills/hive-mind-advanced/`

**Consensus Types**: Majority, weighted, Byzantine (BFT)

---

### stream-chain
**Description**: Stream-JSON chaining for multi-agent pipelines and data transformation

**Use When**:
- Sequential agent workflows
- Data transformation pipelines
- Multi-stage processing
- Event-driven coordination

**Key Features**:
- JSON streaming
- Pipeline chaining
- Data transformation
- Sequential workflows
- Event handling

**Location**: `.claude/skills/stream-chain/`

---

## 4. Quality & Verification Skills (2)

### verification-quality
**Description**: Comprehensive truth scoring and automatic rollback with 0.95 accuracy threshold

**Use When**:
- Need quality gates
- Want automatic rollback
- High-quality output required
- Agent output verification

**Key Features**:
- Truth scoring (0-100 scale)
- 0.95 accuracy threshold
- Automatic rollback on failure
- Quality metrics tracking
- Code quality verification
- Codebase reliability checks

**Location**: `.claude/skills/verification-quality/`

**Threshold**: ≥95% accuracy required to pass

---

### github-code-review
**Description**: Comprehensive GitHub code review with AI-powered swarm coordination

**Use When**:
- Reviewing pull requests
- Need automated code review
- Want swarm-based analysis
- Quality enforcement

**Key Features**:
- Multi-agent review swarm
- Code quality analysis
- Security scanning
- Performance checks
- Best practices enforcement
- Automated comments

**Location**: `.claude/skills/github-code-review/`

---

## 5. Database & Memory Skills (5 AgentDB Skills)

### agentdb-vector-search
**Description**: Implement semantic vector search for intelligent document retrieval

**Use When**:
- Building RAG systems
- Semantic search engines
- Similarity matching
- Context-aware querying

**Key Features**:
- Vector embeddings
- Similarity search
- Semantic retrieval
- HNSW indexing (150x faster)
- Intelligent knowledge bases

**Location**: `.claude/skills/agentdb-vector-search/`

---

### agentdb-optimization
**Description**: Optimize AgentDB performance with quantization and HNSW indexing

**Use When**:
- Slow search performance
- High memory usage
- Need to scale vectors
- Performance optimization

**Key Features**:
- Quantization (4-32x memory reduction)
- HNSW indexing (150x faster search)
- Caching strategies
- Batch operations
- Scales to millions of vectors

**Location**: `.claude/skills/agentdb-optimization/`

---

### agentdb-memory-patterns
**Description**: Implement persistent memory patterns for AI agents

**Use When**:
- Building stateful agents
- Need session memory
- Long-term storage required
- Chat systems

**Key Features**:
- Session memory patterns
- Long-term storage
- Pattern learning
- Context management
- Stateful agent design

**Location**: `.claude/skills/agentdb-memory-patterns/`

---

### agentdb-learning
**Description**: Create and train AI learning plugins with 9 reinforcement learning algorithms

**Use When**:
- Building self-learning agents
- Implementing RL algorithms
- Optimizing agent behavior
- Experience-based learning

**Key Features**:
- Decision Transformer
- Q-Learning
- SARSA
- Actor-Critic
- 5 more RL algorithms

**Location**: `.claude/skills/agentdb-learning/`

---

### agentdb-advanced
**Description**: Master advanced AgentDB features (QUIC sync, multi-DB, hybrid search)

**Use When**:
- Distributed AI systems
- Multi-agent coordination
- Advanced vector search
- Complex integrations

**Key Features**:
- QUIC synchronization
- Multi-database management
- Custom distance metrics
- Hybrid search (vector + keyword)
- Distributed systems integration

**Location**: `.claude/skills/agentdb-advanced/`

---

## 6. GitHub Integration Skills (5)

### github-workflow-automation
**Description**: Advanced GitHub Actions automation with AI swarm coordination

**Use When**:
- Setting up CI/CD
- Automating workflows
- Need intelligent pipelines
- Repository management

**Key Features**:
- AI swarm coordination for CI/CD
- Intelligent pipeline design
- Workflow automation
- Repository management
- Action orchestration

**Location**: `.claude/skills/github-workflow-automation/`

---

### github-release-management
**Description**: Comprehensive GitHub release orchestration with AI swarm coordination

**Use When**:
- Managing releases
- Need versioning automation
- Testing before deployment
- Rollback management

**Key Features**:
- Automated versioning
- Testing orchestration
- Deployment automation
- Rollback management
- Release coordination

**Location**: `.claude/skills/github-release-management/`

---

### github-project-management
**Description**: Comprehensive GitHub project management with swarm-coordinated tracking

**Use When**:
- Managing GitHub projects
- Issue tracking automation
- Project board management
- Sprint planning

**Key Features**:
- Swarm-coordinated issue tracking
- Project board automation
- Sprint planning
- Milestone tracking
- Team coordination

**Location**: `.claude/skills/github-project-management/`

---

### github-multi-repo
**Description**: Multi-repository coordination, synchronization, and architecture management

**Use When**:
- Managing multiple repos
- Need cross-repo coordination
- Monorepo architectures
- Multi-project sync

**Key Features**:
- Multi-repo coordination
- Synchronization
- Architecture management
- Cross-repo patterns
- AI swarm orchestration

**Location**: `.claude/skills/github-multi-repo/`

---

### github-code-review
**(Already listed in Quality & Verification)**

---

## 7. Platform Integration Skills (3 Flow-Nexus)

### flow-nexus-swarm
**Description**: Cloud-based AI swarm deployment and event-driven workflow automation

**Use When**:
- Need cloud execution
- Remote sandboxes required
- Event-driven workflows
- Flow Nexus platform

**Key Features**:
- Cloud-based swarm deployment
- E2B sandbox integration
- Event-driven automation
- Flow Nexus platform access
- Remote coordination

**Location**: `.claude/skills/flow-nexus-swarm/`

**Requires**: Flow-Nexus registration

---

### flow-nexus-neural
**Description**: Train and deploy neural networks in distributed E2B sandboxes

**Use When**:
- Training neural networks
- Need distributed training
- Cloud-based ML
- Neural network deployment

**Key Features**:
- Distributed neural training
- E2B sandbox deployment
- Cloud-based execution
- Model deployment
- Neural network coordination

**Location**: `.claude/skills/flow-nexus-neural/`

---

### flow-nexus-platform
**Description**: Comprehensive Flow Nexus platform management (auth, sandboxes, payments)

**Use When**:
- Managing Flow Nexus account
- Setting up authentication
- Deploying applications
- Payment integration

**Key Features**:
- Authentication management
- Sandbox orchestration
- App deployment
- Payment integration
- Challenge system

**Location**: `.claude/skills/flow-nexus-platform/`

---

## 8. Advanced Coordination Skills (3)

### reasoningbank-intelligence
**Description**: Implement adaptive learning with ReasoningBank for pattern recognition

**Use When**:
- Building self-learning agents
- Pattern recognition required
- Strategy optimization
- Continuous improvement

**Key Features**:
- Adaptive learning
- Pattern recognition
- Strategy optimization
- Meta-cognitive systems
- Continuous improvement

**Location**: `.claude/skills/reasoningbank-intelligence/`

---

### reasoningbank-agentdb
**Description**: Implement ReasoningBank adaptive learning with AgentDB's 150x faster database

**Use When**:
- Building self-learning agents
- Trajectory tracking
- Verdict judgment
- Memory distillation

**Key Features**:
- Trajectory tracking
- Verdict judgment
- Memory distillation
- Pattern recognition
- Experience replay systems
- 150x faster vector search (AgentDB)

**Location**: `.claude/skills/reasoningbank-agentdb/`

---

### agentic-jujutsu
**Description**: Quantum-resistant, self-learning version control for AI agents

**Use When**:
- Need agent version control
- Self-learning systems
- Multi-agent coordination
- ReasoningBank intelligence

**Key Features**:
- Quantum-resistant VCS
- Self-learning version control
- ReasoningBank integration
- Multi-agent coordination
- Intelligent git operations

**Location**: `.claude/skills/agentic-jujutsu/`

---

## 9. Development Methodology Skills (2)

### sparc-methodology
**Description**: SPARC (Specification, Pseudocode, Architecture, Refinement, Completion) development

**Use When**:
- Systematic TDD required
- Complex feature development
- Need structured approach
- Multi-agent orchestration

**Key Features**:
- 5-phase methodology
- Multi-agent orchestration
- Systematic TDD
- Comprehensive development
- Quality enforcement

**Location**: `.claude/skills/sparc-methodology/`

**Phases**:
1. Specification - Requirements analysis
2. Pseudocode - Algorithm design
3. Architecture - System design
4. Refinement - TDD implementation
5. Completion - Integration

---

### pair-programming
**(Already listed in Learning & Education)**

---

## Skill Invocation Methods

### 1. Natural Language (Recommended)
Just describe what you want to do:
```
"help me optimize my prompts" → Routes to prompt-improver
"I want to learn about claude flow" → Routes to tutor-mode
"need to review code quality" → Routes to github-code-review
```

### 2. Meta-Skill Routing
Use meta-skill for exploration:
```
/meta menu              # Browse all skills
/meta search <query>    # Search skills
/meta invoke <skill>    # Direct invocation
```

### 3. Direct Invocation (Expert Mode)
If you know the skill name:
```
/session-closeout
/tutor start
/meta invoke prompt-improver
```

### 4. Skill Tool (Function Call)
```javascript
Skill({ skill: "session-closeout" })
Skill({ skill: "tutor-mode" })
Skill({ skill: "swarm-orchestration" })
```

---

## Skill Development

### Creating Custom Skills

Use the `skill-builder` skill:
```
/meta invoke skill-builder
```

**Requirements**:
- YAML frontmatter with metadata
- Progressive disclosure structure
- Examples directory
- README.md documentation
- Proper directory organization

**Location**: Place in `.claude/skills/<skill-name>/SKILL.md`

---

## Skill Statistics

- **Total Skills**: 32
- **Core Workflow**: 5 skills
- **Learning**: 3 skills
- **Multi-Agent**: 4 skills
- **Quality**: 2 skills
- **AgentDB**: 5 skills
- **GitHub**: 5 skills
- **Flow-Nexus**: 3 skills
- **Advanced**: 3 skills
- **Methodology**: 2 skills

---

## Related Documentation

- [Workspace Inventory](./workspace-inventory.md) - Complete directory catalog
- [Features Catalog](./features-catalog.md) - System capabilities
- [Tour Highlights](./tour-highlights.md) - Recommended tour stops
- [CLAUDE.md](../../../CLAUDE.md) - Main configuration

---

**Next Steps**: Use this catalog to understand available capabilities and choose the right skill for your task. Start with `meta-skill` for intelligent routing.
