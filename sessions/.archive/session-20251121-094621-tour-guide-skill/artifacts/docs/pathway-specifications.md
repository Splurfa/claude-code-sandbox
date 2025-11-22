# Tour Pathway Specifications

## Overview

This document specifies the content, structure, and navigation flow for all four proficiency-based tour pathways. Each pathway is optimized for its target audience while maintaining consistent navigation patterns.

---

## Beginner Pathway

### Target Audience
- First-time Claude Code users
- New to multi-agent AI systems
- Need orientation and foundational concepts

### Learning Objectives
By completing this pathway, users will:
1. Understand what the workspace is and why it exists
2. Know the basic concepts: sessions, agents, coordination
3. Execute a simple end-to-end workflow
4. Know where to find help and documentation

### Pathway Structure

#### Section 1: Welcome & Overview (5 min)
**Goal**: Orient to the workspace at highest level

**Content**:
- **What is this workspace?**
  - Development environment for multi-agent AI workflows
  - Built on Claude Code + Claude Flow
  - Organized for systematic, collaborative AI work

- **Key metaphor**: "Think of it like a workshop for AI agents"
  - You're the project lead
  - Agents are specialized team members
  - Sessions are project folders
  - Coordination helps them work together

- **What you'll learn in this tour**:
  1. How to create and manage work sessions
  2. How to spawn AI agents that help you
  3. Where your files go (file routing)
  4. Basic coordination between agents

**Interactive Element**:
```
Quick Check: In your own words, what is this workspace for?
(No wrong answers - this helps me calibrate the rest of the tour)
```

**Navigation**:
- `/tour next` - Move to Session Basics
- `/tour jump intermediate` - "This is too basic"

---

#### Section 2: Session Basics (7 min)
**Goal**: Understand sessions and why they matter

**Content**:
- **What is a session?**
  - A session = one project or task
  - Has unique ID: `session-20251121-094621-tour-guide-skill`
  - Contains all work for that project in `artifacts/` subfolders

- **Why sessions?**
  - Keeps work organized
  - Prevents clutter in main workspace
  - Easy to archive completed work
  - Multiple agents can work in same session without conflicts

- **Session lifecycle (simplified)**:
  1. Start session: `/session-start my-project`
  2. Work happens (you + agents create files)
  3. End session: `/session-closeout`
  4. Work archived to `.swarm/backups/`

- **File routing rule**:
  - ✅ Save to: `sessions/$SESSION_ID/artifacts/code/my-file.js`
  - ❌ Don't save to: `code/my-file.js` (root folder)

**Analogy**: "Sessions are like project folders in Google Drive - they keep related work together"

**Example**:
```
Let's say you're building a calculator app:

1. You run: /session-start calculator-app
2. Creates: sessions/session-20251121-100000-calculator-app/
3. Your code goes to: sessions/.../artifacts/code/
4. Tests go to: sessions/.../artifacts/tests/
5. Done? Run: /session-closeout
```

**Interactive Element**:
```
Try It Yourself (Conceptually):
If you were starting a session for a todo list app, what would
the session directory be named?

Hint: session-[timestamp]-[topic]
```

**Navigation**:
- `/tour next` - Move to Your First Agent
- `/tour back` - Return to Welcome
- `/tour skip agents` - Jump ahead to agents

---

#### Section 3: Your First Agent (8 min)
**Goal**: Understand what agents are and how to use them

**Content**:
- **What is an agent?**
  - An agent = a specialized AI helper
  - Examples: coder, tester, reviewer, researcher
  - Each agent has a role and capabilities

- **How do agents work?**
  - You describe what you need
  - Agent does the work
  - Results appear in your session

- **Simple example**:
```
You: "Create a Python script that sorts a list"

Behind the scenes:
1. A coder agent spawns
2. Writes the script to sessions/.../artifacts/code/
3. Returns results to you
```

- **Key point**: Agents save files to session artifacts automatically

- **Available agent types** (just a few for now):
  - `coder` - Writes code
  - `tester` - Creates tests
  - `reviewer` - Reviews code quality
  - `researcher` - Gathers information

**Analogy**: "Agents are like hiring specialists - you describe the job, they deliver the work"

**Example Interaction**:
```
You: "I need a function that validates email addresses"

[Agent spawns, writes code, saves to session]

Agent: "Created validate_email.py in sessions/.../artifacts/code/
         Includes regex validation and test cases."
```

**Interactive Element**:
```
Understanding Check:
Which agent would you spawn if you needed to:
1. Write a new feature? → [Answer: coder]
2. Check code quality? → [Answer: reviewer]
3. Find best practices? → [Answer: researcher]
```

**Navigation**:
- `/tour next` - Move to Multiple Agents
- `/tour back` - Return to sessions
- `/tour bookmark first-agent` - Save this spot

---

#### Section 4: Multiple Agents Working Together (7 min)
**Goal**: Understand basic coordination

**Content**:
- **Multiple agents at once**
  - You can spawn several agents for complex tasks
  - Example: coder + tester work together on a feature

- **How coordination works (simplified)**:
  - Agents share information through "memory"
  - Memory = shared notes agents can read/write
  - Example: Coder writes code, tester reads it to create tests

- **Simple workflow example**:
```
Task: Build a login feature

1. Researcher agent finds best practices
2. Coder agent implements login logic
3. Tester agent creates test cases
4. Reviewer agent checks security

All work happens in the same session, coordinated automatically.
```

- **Key point**: You don't micromanage - agents coordinate themselves

**Analogy**: "Like a relay race - each runner knows to pass the baton"

**Visual**:
```
You → Describe task
      ↓
┌─────────┐    ┌─────────┐    ┌─────────┐
│ Coder   │ →  │ Tester  │ →  │Reviewer │
└─────────┘    └─────────┘    └─────────┘
     ↓              ↓              ↓
  Code.js      Tests.js       Report.md
```

**Interactive Element**:
```
Scenario: You need to add a search feature to an app.
Which agents would you spawn, and in what order?

Think about it, then see suggested answer below.

Suggested:
1. Researcher - Find search algorithms
2. Coder - Implement search
3. Tester - Create test cases
4. Reviewer - Check performance
```

**Navigation**:
- `/tour next` - Move to Finding Help
- `/tour back` - Return to single agents
- `/tour status` - See your progress

---

#### Section 5: Finding Help & Next Steps (5 min)
**Goal**: Know where to go for more information

**Content**:
- **Documentation locations**:
  - Quick Start: `docs/setup/quick-start.md`
  - Session Management: `docs/operate/session-management.md`
  - Agent Spawning: `docs/build/spawning-agents.md`
  - Troubleshooting: `docs/operate/troubleshooting.md`

- **Related skills for deeper learning**:
  - **tutor-mode**: Interactive learning with exercises
    - Invoke: `/tutor-mode` or Skill tool
    - When: Want hands-on practice

  - **meta-skill**: Discover all available skills
    - Invoke: `/meta-skill` or Skill tool
    - When: Looking for specific capabilities

- **Key commands to remember**:
  - `/session-start <topic>` - Begin new session
  - `/session-closeout` - End session
  - `/tour` - Return to this tour

- **Common issues**:
  - Files in wrong location? Review file routing rules
  - Agent not working? Check session is active
  - Need more help? See troubleshooting guide

**Next Learning Paths**:
```
Ready to level up? You have several options:

1. Practice Path
   → Use tutor-mode for hands-on exercises
   → /tutor-mode "session management basics"

2. Discovery Path
   → Explore all available skills with meta-skill
   → /meta-skill

3. Deep Dive Path
   → Jump to Intermediate tour pathway
   → /tour jump intermediate

4. Just Start Building
   → You know enough to begin!
   → /session-start my-first-project
```

**Congratulations Message**:
```
╔══════════════════════════════════════════════════════════╗
║     Beginner Pathway Complete! 🎉                        ║
╚══════════════════════════════════════════════════════════╝

You've learned:
✓ What this workspace is
✓ How sessions organize work
✓ How to spawn and coordinate agents
✓ Where to find help

You're ready to start building with AI agents!
```

**Navigation**:
- `/tour jump intermediate` - Level up
- `/tour reset` - Start over
- Exit tour and start working

---

## Intermediate Pathway

### Target Audience
- Regular Claude Code users
- Some multi-agent exposure
- Want practical patterns and workflows

### Learning Objectives
By completing this pathway, users will:
1. Understand workspace architecture at practical level
2. Master session management workflow
3. Spawn and coordinate agents effectively
4. Use memory for agent coordination
5. Apply file routing rules consistently

### Pathway Structure

#### Section 1: Workspace Architecture (7 min)
**Goal**: Understand the system design

**Content**:
- **Core components**:
  - Claude Code: Your primary interface
  - Claude Flow: Agent coordination layer
  - MCP Servers: Integration points (optional)
  - Session system: Project organization
  - Hooks: Automation points

- **Architecture diagram** (simplified):
```
┌─────────────────────────────────────────────────┐
│              Claude Code (You)                   │
├─────────────────────────────────────────────────┤
│          Claude Flow Alpha (MCP)                 │
│  ┌──────────────┐      ┌──────────────────┐    │
│  │   Swarm      │      │    Memory        │    │
│  │ Coordination │      │   Management     │    │
│  └──────────────┘      └──────────────────┘    │
├─────────────────────────────────────────────────┤
│            Session Management                    │
│   sessions/session-ID/artifacts/{code,tests}    │
├─────────────────────────────────────────────────┤
│              Hooks Layer (Auto-fire)            │
│   Pre-task → Work → Post-task → Session End     │
└─────────────────────────────────────────────────┘
```

- **Key architectural decisions**:
  - Session-based isolation prevents conflicts
  - Hooks auto-fire for coordination
  - Memory enables agent communication
  - File routing maintains organization

- **Stock vs. Custom** (overview):
  - 82/100 stock adherence score
  - Core: 100% stock Claude Flow
  - Extensions: Session management, file routing
  - See Advanced pathway for full analysis

**Navigation**:
- `/tour next` - Session Management Deep Dive
- `/tour jump advanced` - More architectural depth

---

#### Section 2: Session Management Deep Dive (10 min)
**Goal**: Master the complete session lifecycle

**Content**:
- **Session lifecycle states**:
  1. **Pre-Session**: Workspace idle
  2. **Active Session**: Work in progress
  3. **Closing**: Cleanup and summary
  4. **Archived**: Backed up to `.swarm/backups/`

- **Session creation workflow**:
```bash
# Create session
/session-start project-name

# Behind the scenes:
# 1. Generate timestamp: 20251121-094621
# 2. Create directory: sessions/session-20251121-094621-project-name/
# 3. Create artifacts structure:
#    - code/
#    - tests/
#    - docs/
#    - scripts/
#    - notes/
# 4. Set as active session
```

- **During session work**:
  - All files go to `sessions/$SESSION_ID/artifacts/`
  - Agents automatically route files correctly
  - Hooks fire on file operations
  - Memory tracks decisions and state

- **Session closeout protocol**:
```bash
/session-closeout

# Process:
# 1. Generate summary (what was accomplished)
# 2. Collect metrics (files created, agents used)
# 3. Request HITL approval
# 4. Archive to .swarm/backups/session-[ID].json
# 5. Clean up session directory (optional)
```

- **HITL (Human-in-the-Loop) approval**:
  - You review the summary
  - Approve or request changes
  - Ensures you're in control

- **Best practices**:
  - One session = one logical project/task
  - Don't nest sessions
  - Close sessions when done (keeps workspace clean)
  - Review session summaries before archiving

**Practical Example**:
```
Project: Build REST API

1. /session-start rest-api
2. Spawn agents (coder, tester, reviewer)
3. Work happens in sessions/session-*/artifacts/
4. Review results
5. /session-closeout
6. Approve summary
7. Archive created at .swarm/backups/
```

**Common Mistakes**:
- ❌ Saving files to root directories
- ❌ Forgetting to closeout sessions
- ❌ Creating nested sessions
- ❌ Manually managing session directories

**Navigation**:
- `/tour next` - Agent Spawning Patterns
- `/tour back` - Architecture overview

---

#### Section 3: Agent Spawning Patterns (12 min)
**Goal**: Learn effective agent spawning strategies

**Content**:
- **Core principle**: Use Claude Code's Task tool for execution

- **Single agent pattern**:
```javascript
Task(
  "Code Reviewer",
  "Review security of authentication module. Report findings to sessions/.../artifacts/docs/security-review.md",
  "reviewer"
)
```

- **Parallel agent pattern**:
```javascript
// Single message, multiple agents
[Parallel Execution]:
  Task("Backend Dev", "Build Express API. Save to sessions/.../artifacts/code/", "coder")
  Task("Frontend Dev", "Build React UI. Save to sessions/.../artifacts/code/", "coder")
  Task("Test Engineer", "Write tests. Save to sessions/.../artifacts/tests/", "tester")
```

- **Sequential agent pattern** (via dependencies):
```javascript
// Agent 1: Research
Task("Researcher", "Find best database for this use case. Save findings to memory with key 'db-decision'", "researcher")

// Wait for completion, then:
// Agent 2: Implementation (references memory)
Task("Coder", "Implement database using decision from memory key 'db-decision'. Save to sessions/.../artifacts/code/", "coder")
```

- **Coordination mechanisms**:
  1. **Memory**: Shared key-value store
     ```javascript
     mcp__claude-flow_alpha__memory_usage({
       action: "store",
       key: "api-schema",
       value: JSON.stringify(schema),
       namespace: "rest-api-project"
     })
     ```

  2. **Hooks**: Automatic coordination points
     - Pre-task: Setup
     - Post-edit: Track changes
     - Post-task: Finalize
     - Session-end: Summary

  3. **File artifacts**: Agents read each other's outputs
     - Coder writes code
     - Tester reads code to create tests
     - Reviewer reads both

- **Agent type selection**:
  - `coder`: Implementation work
  - `tester`: Test creation
  - `reviewer`: Code review, security
  - `researcher`: Information gathering
  - `code-analyzer`: Static analysis
  - `cicd-engineer`: DevOps setup
  - See agent catalog for full list

- **Practical patterns**:

**Pattern 1: Feature Development**
```
1. Researcher: Requirements analysis
2. Coder: Implementation
3. Tester: Test suite
4. Reviewer: Quality check
```

**Pattern 2: Refactoring**
```
1. Code-analyzer: Identify issues
2. Coder: Apply refactoring
3. Tester: Verify behavior unchanged
```

**Pattern 3: Bug Fix**
```
1. Researcher: Root cause analysis
2. Coder: Implement fix
3. Tester: Regression tests
```

**Navigation**:
- `/tour next` - Memory Coordination
- `/tour back` - Session management

---

#### Section 4: Memory Coordination (10 min)
**Goal**: Use memory for agent coordination

**Content**:
- **What is memory?**
  - Shared key-value store (SQLite database)
  - Persists across agent executions
  - Enables stateful workflows
  - Location: `.swarm/memory.db`

- **Memory operations** (via MCP tools):

**Store Data**:
```javascript
mcp__claude-flow_alpha__memory_usage({
  action: "store",
  key: "design-decisions",
  value: "Using PostgreSQL for primary database",
  namespace: "project-alpha"
})
```

**Retrieve Data**:
```javascript
mcp__claude-flow_alpha__memory_usage({
  action: "retrieve",
  key: "design-decisions",
  namespace: "project-alpha"
})
```

**Search Pattern**:
```javascript
mcp__claude-flow_alpha__memory_usage({
  action: "search",
  pattern: "design%",
  namespace: "project-alpha"
})
```

**List All Keys**:
```javascript
mcp__claude-flow_alpha__memory_usage({
  action: "list",
  namespace: "project-alpha"
})
```

- **Coordination pattern**:
```
Agent A (Researcher):
  1. Analyzes requirements
  2. Stores findings: memory["requirements"] = "..."

Agent B (Coder):
  1. Retrieves requirements from memory
  2. Implements based on retrieved data
  3. Stores implementation notes: memory["implementation"] = "..."

Agent C (Tester):
  1. Retrieves implementation notes
  2. Creates targeted tests
  3. Stores test results: memory["test-results"] = "..."
```

- **Namespace strategy**:
  - Use session ID as namespace for isolation
  - Example: `namespace: "session-20251121-094621-project"`
  - Prevents cross-session pollution

- **Best practices**:
  - Use descriptive keys: `"api-authentication-method"` not `"auth"`
  - Store structured data as JSON strings
  - Clean up memory after session (via hooks)
  - Document memory keys for team awareness

- **Practical example**:
```
Building a search feature:

1. Store search requirements:
   memory["search-requirements"] = {
     "types": ["full-text", "fuzzy"],
     "fields": ["title", "content", "tags"],
     "performance": "< 100ms"
   }

2. Coder retrieves requirements:
   requirements = memory["search-requirements"]

3. Coder implements, stores API contract:
   memory["search-api"] = {
     "endpoint": "/api/search",
     "method": "POST",
     "params": {...}
   }

4. Tester retrieves API contract:
   api = memory["search-api"]

5. Tester creates tests based on contract
```

**Navigation**:
- `/tour next` - File Routing Rules
- `/tour back` - Agent spawning

---

#### Section 5: File Routing Rules (8 min)
**Goal**: Understand where files should go

**Content**:
- **Golden rule**: ALL working files go to session artifacts

- **Session artifact structure**:
```
sessions/session-[ID]/artifacts/
  ├── code/        ← Source code files
  ├── tests/       ← Test files
  ├── docs/        ← Documentation
  ├── scripts/     ← Automation scripts
  └── notes/       ← Working notes, scratchpad
```

- **Routing decision tree**:
```
Q: Is this a project file (package.json, CLAUDE.md)?
   Yes → Edit in original location
   No  → Is this work for current session?
         Yes → Save to sessions/$SESSION_ID/artifacts/[type]/
         No  → Wrong! Should be in a session.
```

- **Examples**:

✅ **Correct routing**:
```
New feature code:
→ sessions/session-123-feature/artifacts/code/feature.js

Feature tests:
→ sessions/session-123-feature/artifacts/tests/feature.test.js

Implementation notes:
→ sessions/session-123-feature/artifacts/docs/implementation.md

Build script:
→ sessions/session-123-feature/artifacts/scripts/build.sh
```

❌ **Incorrect routing**:
```
New code → code/feature.js (root directory)
Tests → tests/feature.test.js (root directory)
Docs → docs/notes.md (root directory)
```

- **Exceptions** (edit in place):
  - `package.json` - Project dependencies
  - `CLAUDE.md` - Workspace configuration
  - `.claude/settings.json` - Claude Code settings
  - Existing codebase files being modified

- **Why routing matters**:
  - Organization: Related work stays together
  - Cleanup: Easy to archive completed sessions
  - Isolation: Multiple sessions don't conflict
  - Collaboration: Clear boundaries for agents

- **Agent responsibility**:
  - Agents automatically route files correctly
  - You verify the routing in file paths
  - If agent saves to wrong location, correct it

**Navigation**:
- `/tour next` - Next Steps
- `/tour back` - Memory coordination

---

#### Section 6: Next Steps & Advanced Topics (5 min)
**Goal**: Point to deeper resources

**Content**:
- **You've mastered**:
  ✓ Workspace architecture
  ✓ Session lifecycle
  ✓ Agent spawning patterns
  ✓ Memory coordination
  ✓ File routing

- **Ready for more?**

**Deeper Learning**:
- **tutor-mode**: Hands-on exercises
  - `/tutor-mode "multi-agent coordination"`
  - Interactive practice with feedback

- **Advanced pathway**: Architecture depth
  - `/tour jump advanced`
  - Stock vs. custom analysis
  - Extension points

**Specialized Skills**:
- `swarm-orchestration` - Complex coordination patterns
- `reasoningbank-intelligence` - Adaptive learning
- `github-workflow-automation` - CI/CD integration
- See `/meta-skill` for full catalog

**Documentation**:
- [Swarm Coordination Guide](docs/coordinate/swarm-coordination.md)
- [Memory Coordination Tutorial](docs/operate/memory-coordination-tutorial.md)
- [Advanced Agent Patterns](docs/build/spawning-agents.md)

**Completion Message**:
```
╔══════════════════════════════════════════════════════════╗
║     Intermediate Pathway Complete! 🚀                    ║
╚══════════════════════════════════════════════════════════╝

You're now proficient with:
✓ Session-based workflows
✓ Multi-agent coordination
✓ Memory-based state management
✓ Proper file organization

Next steps:
→ Jump to Advanced for architecture deep-dive
→ Use tutor-mode for hands-on practice
→ Start building complex multi-agent workflows
```

**Navigation**:
- `/tour jump advanced` - Continue learning
- `/tour reset` - Restart tour
- Exit and build

---

## Advanced Pathway

### Target Audience
- Experienced Claude Code users
- Multi-agent coordination experience
- Want architectural understanding and customization knowledge

### Learning Objectives
By completing this pathway, users will:
1. Understand deep architecture and design decisions
2. Navigate stock vs. custom modifications
3. Identify extension points for customization
4. Apply advanced coordination patterns
5. Optimize performance and workflows

### Pathway Structure

#### Section 1: Architecture Deep Dive (12 min)
**Goal**: Understand system design philosophy

**Content**:
- **Design principles**:
  1. **Stock-First**: Prefer stock Claude Flow (82/100 adherence)
  2. **Session Isolation**: Prevent cross-project conflicts
  3. **Hook-Driven Automation**: Reduce manual coordination
  4. **Memory-Based State**: Enable stateful workflows
  5. **Progressive Disclosure**: Information at appropriate depth

- **Component architecture**:

```
┌───────────────────────────────────────────────────────────┐
│                   User Interface Layer                     │
│                      (Claude Code)                         │
├───────────────────────────────────────────────────────────┤
│                  MCP Integration Layer                     │
│  ┌─────────────────┐  ┌──────────────────────────────┐   │
│  │  Claude Flow    │  │  Optional MCPs               │   │
│  │  Alpha (Core)   │  │  (ruv-swarm, flow-nexus)     │   │
│  └─────────────────┘  └──────────────────────────────┘   │
├───────────────────────────────────────────────────────────┤
│              Coordination & State Layer                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │    Swarm     │  │    Memory    │  │   Hooks      │   │
│  │ Coordination │  │  Management  │  │  Automation  │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
├───────────────────────────────────────────────────────────┤
│              Session Management Layer                      │
│  ┌────────────────────────────────────────────────────┐   │
│  │  Session Lifecycle Management (Custom Extension)   │   │
│  │  - Creation, Active Work, Closeout, Archival       │   │
│  └────────────────────────────────────────────────────┘   │
├───────────────────────────────────────────────────────────┤
│                  File System Layer                         │
│  ┌────────────────────────────────────────────────────┐   │
│  │  sessions/session-ID/artifacts/{code,tests,docs}   │   │
│  │  .swarm/{memory.db, backups/, coordination.json}   │   │
│  └────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────┘
```

- **Data flow analysis**:

**Scenario**: Build REST API feature
```
1. User: /session-start rest-api
   ↓ [Session Management Layer]
   → Create directory structure
   → Initialize session state

2. User: Spawn coder agent
   ↓ [Coordination Layer]
   → Fire pre-task hook
   → Agent receives task + session context

3. Agent: Writes code
   ↓ [File System Layer]
   → Save to sessions/.../artifacts/code/
   → Fire post-edit hook
   → Update memory with API schema

4. User: Spawn tester agent
   ↓ [Coordination Layer]
   → Tester retrieves API schema from memory
   → Creates tests based on schema
   ↓ [File System Layer]
   → Save to sessions/.../artifacts/tests/

5. User: /session-closeout
   ↓ [Session Management Layer]
   → Generate summary
   → Archive to .swarm/backups/
   → Fire session-end hook
```

- **State management strategy**:
  - **Transient state**: In conversation context (current section, navigation history)
  - **Session state**: In session directory (active work files)
  - **Persistent state**: In memory.db (cross-session knowledge)
  - **Archived state**: In .swarm/backups/ (completed sessions)

- **Key architectural decisions** (ADRs):
  - **ADR-001**: Session-based isolation over global workspace
  - **ADR-002**: Hook automation via Claude Code native system
  - **ADR-003**: Memory in SQLite for performance + portability
  - **ADR-004**: File routing by session over user discretion

See full ADR documentation in `docs/reference/architecture.md`

**Navigation**:
- `/tour next` - Stock vs. Custom Analysis
- `/tour skip extensions` - Jump to extension points

---

#### Section 2: Stock vs. Custom Analysis (15 min)
**Goal**: Understand modifications and adherence

**Content**:
- **Stock adherence score**: 82/100
  - Core architecture: 100% stock
  - Implementation patterns: 97.5% stock
  - Extensions: Additive, not modifying

- **Component-by-component analysis**:

**100% Stock (No modifications)**:
- Claude Flow core coordination
- MCP protocol implementation
- Swarm topology algorithms
- Memory storage mechanism
- Neural training capabilities
- GitHub integration tools

**Custom Extensions (Additive)**:
1. **Session Management System**
   - Why custom: Stock Claude Flow lacks project isolation
   - Implementation: Directory structure + lifecycle commands
   - Stock adherence: Uses stock hooks + memory
   - Trade-off: Added complexity vs. organized workflows

2. **File Routing Protocol**
   - Why custom: Prevents workspace clutter
   - Implementation: Convention + documentation
   - Stock adherence: Doesn't modify Claude Code behavior
   - Trade-off: Learning curve vs. long-term organization

3. **HITL Session Closeout**
   - Why custom: User control over archival
   - Implementation: Approval step before cleanup
   - Stock adherence: Uses stock session-end hook
   - Trade-off: Extra step vs. prevents accidental loss

4. **Hooks Integration via Claude Code Native System**
   - Why custom: Auto-fire coordination without manual invocation
   - Implementation: `.claude/settings.json` hook configuration
   - Stock adherence: 98% (uses native Claude Code feature)
   - Trade-off: None (better than manual hook calls)

**What we explicitly avoid**:
- ❌ Forking Claude Flow codebase
- ❌ Modifying core coordination algorithms
- ❌ Replacing MCP protocol
- ❌ Custom agent execution runtimes
- ❌ Filesystem monkey-patching (deprecated .claude/hooks/auto-hooks.js)

**Stock-first decision framework**:
```
Question: Should we add a custom feature?

1. Is there a stock Claude Flow way? → Use it
2. Can we achieve it with configuration? → Configure
3. Can we build it as additive extension? → Extend
4. Would it require forking core? → Don't do it

Example: Session management
- No stock equivalent → OK to add
- Uses stock primitives (hooks, memory) → Good
- Doesn't modify core coordination → Great
- Fully documented + optional → Excellent
```

**Upgrade path**:
- When Claude Flow adds native features, we deprecate custom
- Example: If stock adds session isolation, we migrate
- Goal: Approach 100% stock adherence over time

**Why stock-first matters**:
- **Compatibility**: Updates don't break our setup
- **Community**: Patterns transferable to other users
- **Maintenance**: Less custom code to maintain
- **Trust**: Standard implementation reduces surprises

**Navigation**:
- `/tour next` - Extension Points
- `/tour back` - Architecture

---

#### Section 3: Extension Points (12 min)
**Goal**: Identify customization opportunities

**Content**:
- **Safe extension points** (won't conflict with stock):

**1. Custom Skills** (`.claude/skills/`)
- Create domain-specific workflows
- Use stock skill framework
- Example: `tour-guide.yaml` (this skill!)

**2. Slash Commands** (`.claude/commands/`)
- Add workflow shortcuts
- Invoke existing capabilities
- Example: `/session-start`, `/session-closeout`

**3. Memory Namespaces**
- Organize memory by domain
- Use stock memory API
- Example: `namespace: "project-alpha-api"`

**4. Hook Handlers** (via Claude Code native system)
- React to file operations
- Configure in `.claude/settings.json`
- Example: Auto-format on post-edit

**5. Agent Templates** (session artifacts)
- Pre-configured agent specifications
- Reusable coordination patterns
- Example: "Full-stack feature" template

**6. Workflow Pipelines** (session scripts)
- Orchestrate multi-step processes
- Use stock task orchestration
- Example: "Deploy to production" pipeline

**Unsafe extension points** (avoid these):
- ❌ Modifying Claude Flow source code
- ❌ Replacing MCP protocol
- ❌ Filesystem interception (deprecated auto-hooks.js)
- ❌ Agent execution runtime modifications

**Extension example: Custom skill**

Create `.claude/skills/my-workflow.yaml`:
```yaml
---
name: My Workflow
description: Custom domain-specific workflow
---

# My Workflow Skill

## Purpose
Automate [specific domain] tasks using stock coordination.

## Usage
/my-workflow [task-description]

## Implementation
This skill uses:
- Stock agent spawning (Task tool)
- Stock memory coordination
- Stock hooks for automation
- Custom orchestration logic

## Example
/my-workflow "build authentication system"

[Spawns agents using stock patterns...]
```

**Extension example: Memory namespace strategy**

```javascript
// Domain isolation
mcp__claude-flow_alpha__memory_usage({
  action: "store",
  key: "api-version",
  value: "v2.0",
  namespace: "rest-api-project"  // Isolate by project
})

// Feature isolation
mcp__claude-flow_alpha__memory_usage({
  action: "store",
  key: "auth-method",
  value: "JWT",
  namespace: "authentication-feature"  // Isolate by feature
})

// Agent isolation
mcp__claude-flow_alpha__memory_usage({
  action: "store",
  key: "test-results",
  value: "95% coverage",
  namespace: "tester-agent-12345"  // Isolate by agent
})
```

**Extension example: Workflow pipeline**

Save to `sessions/.../artifacts/scripts/deploy-pipeline.sh`:
```bash
#!/bin/bash
# Full deployment pipeline using stock tools

# 1. Run tests
npx claude-flow@alpha hooks pre-task --description "Running tests"
npm test
npx claude-flow@alpha hooks post-task --task-id "tests"

# 2. Build
npx claude-flow@alpha hooks pre-task --description "Building"
npm run build
npx claude-flow@alpha hooks post-task --task-id "build"

# 3. Deploy
npx claude-flow@alpha hooks pre-task --description "Deploying"
npm run deploy
npx claude-flow@alpha hooks post-task --task-id "deploy"

# 4. Verify
npx claude-flow@alpha hooks pre-task --description "Health check"
curl https://api.example.com/health
npx claude-flow@alpha hooks post-task --task-id "verify"
```

**Navigation**:
- `/tour next` - Advanced Coordination Patterns
- `/tour back` - Stock vs. custom

---

#### Section 4: Advanced Coordination Patterns (15 min)
**Goal**: Master complex multi-agent workflows

**Content**:
- **Coordination topologies**:

**Mesh Topology** (peer-to-peer):
```
┌─────────┐ ↔ ┌─────────┐
│Agent A  │ ↔ │Agent B  │
└─────────┘ ↔ └─────────┘
     ↕             ↕
┌─────────┐ ↔ ┌─────────┐
│Agent C  │ ↔ │Agent D  │
└─────────┘   └─────────┘

Use case: Collaborative design, no clear hierarchy
```

**Hierarchical Topology** (leader-worker):
```
      ┌─────────────┐
      │ Coordinator │
      └─────────────┘
       /     |     \
      /      |      \
┌─────┐  ┌─────┐  ┌─────┐
│ A   │  │  B  │  │  C  │
└─────┘  └─────┘  └─────┘

Use case: Complex projects with task delegation
```

**Star Topology** (hub-and-spoke):
```
  ┌─────┐      ┌─────┐
  │  A  │      │  B  │
  └─────┘      └─────┘
      \         /
       \       /
      ┌─────────┐
      │   Hub   │
      └─────────┘
       /       \
      /         \
  ┌─────┐      ┌─────┐
  │  C  │      │  D  │
  └─────┘      └─────┘

Use case: Centralized review/approval workflows
```

**Ring Topology** (sequential):
```
┌─────┐ → ┌─────┐ → ┌─────┐ → ┌─────┐
│  A  │   │  B  │   │  C  │   │  D  │
└─────┘   └─────┘   └─────┘   └─────┘
   ↑                              ↓
   └──────────────────────────────┘

Use case: Pipeline processing, each stage builds on previous
```

**Pattern 1: Fork-Join Parallelism**
```javascript
// Parallel research phase
[Parallel]:
  Task("Research A", "Analyze database options", "researcher")
  Task("Research B", "Analyze caching strategies", "researcher")
  Task("Research C", "Analyze API design patterns", "researcher")

// Wait for completion, then join results
Task("Architect", "Synthesize research findings from memory. Create unified architecture proposal.", "system-architect")
```

**Pattern 2: Pipeline with Validation Gates**
```javascript
// Stage 1: Implementation
Task("Coder", "Implement feature. Store API contract in memory.", "coder")

// Gate 1: Code review (blocks progression)
Task("Reviewer", "Review code quality. Must pass before tests. Store review result in memory.", "reviewer")

// Check review result, only proceed if passed
// Stage 2: Testing
Task("Tester", "Create comprehensive tests based on API contract from memory.", "tester")

// Gate 2: Test results (blocks deployment)
Task("QA", "Verify test coverage > 80%. Store QA approval in memory.", "tester")
```

**Pattern 3: Hierarchical Decomposition**
```javascript
// Top-level coordinator
Task("Project Coordinator", `
Decompose "build e-commerce platform" into work packages.
Store breakdown in memory.
Create sub-tasks for specialist agents.
`, "coordinator")

// Wait for decomposition, then spawn specialists
[Based on coordinator output]:
  Task("Frontend Team", "UI components from work package 1", "coder")
  Task("Backend Team", "API from work package 2", "coder")
  Task("Database Team", "Schema from work package 3", "code-analyzer")
  Task("DevOps Team", "Infrastructure from work package 4", "cicd-engineer")
```

**Pattern 4: Iterative Refinement**
```javascript
// Round 1: Initial implementation
Task("Coder V1", "Initial implementation", "coder")
Task("Reviewer V1", "Identify improvement areas. Score quality.", "reviewer")

// Round 2: Refine (if score < threshold)
Task("Coder V2", "Refactor based on review feedback", "coder")
Task("Reviewer V2", "Re-review. Score quality.", "reviewer")

// Round 3: Polish (if needed)
[Conditional on score]:
  Task("Coder V3", "Final polish", "coder")
```

**Pattern 5: Consensus Building**
```javascript
// Multiple agents provide recommendations
[Parallel]:
  Task("Architect A", "Propose microservices architecture", "system-architect")
  Task("Architect B", "Propose monolith architecture", "system-architect")
  Task("Architect C", "Propose serverless architecture", "system-architect")

// Consensus agent evaluates
Task("Consensus Builder", `
Review all proposals from memory.
Evaluate trade-offs.
Build consensus recommendation.
Store final decision.
`, "coordinator")
```

**Memory coordination patterns**:

**Pattern: Shared state**
```javascript
// Agent A stores state
memory["shared-counter"] = 0

// Agents B, C, D read and increment
current = memory["shared-counter"]
memory["shared-counter"] = current + 1
```

**Pattern: Event passing**
```javascript
// Producer
memory["event-queue"] = JSON.stringify([
  {type: "task-complete", agent: "A", data: {...}}
])

// Consumer
events = JSON.parse(memory["event-queue"])
processEvents(events)
```

**Pattern: Distributed lock**
```javascript
// Attempt to acquire lock
if (!memory["lock-resource-x"]) {
  memory["lock-resource-x"] = agentId
  // Do work
  delete memory["lock-resource-x"]  // Release
}
```

**Navigation**:
- `/tour next` - Performance Optimization
- `/tour back` - Extension points

---

#### Section 5: Performance Optimization (10 min)
**Goal**: Optimize workflow efficiency

**Content**:
- **Performance metrics to track**:
  - Agent spawn time
  - Task completion time
  - Memory operation latency
  - File I/O overhead
  - Token consumption

- **Optimization strategies**:

**1. Parallel execution**
```javascript
// ❌ Slow: Sequential
Task("Agent A", "Task A", "coder")
// Wait...
Task("Agent B", "Task B", "coder")
// Wait...
Task("Agent C", "Task C", "coder")

// ✅ Fast: Parallel (2.8-4.4x speedup)
[Single Message]:
  Task("Agent A", "Task A", "coder")
  Task("Agent B", "Task B", "coder")
  Task("Agent C", "Task C", "coder")
```

**2. Memory caching**
```javascript
// Store expensive computation results
memory["fibonacci-1000"] = computeFibonacci(1000)

// Reuse across agents
result = memory["fibonacci-1000"]  // Instant
```

**3. Batch operations**
```javascript
// ❌ Slow: Individual operations
memory["key1"] = "value1"
memory["key2"] = "value2"
memory["key3"] = "value3"

// ✅ Fast: Batch store (hypothetical API)
memory.batchStore([
  {key: "key1", value: "value1"},
  {key: "key2", value: "value2"},
  {key: "key3", value: "value3"}
])
```

**4. Smart agent selection**
```javascript
// ❌ Overuse: General agent for specialized task
Task("Coder", "Review security vulnerabilities", "coder")

// ✅ Optimal: Specialized agent
Task("Security", "Review security vulnerabilities", "reviewer")
```

**5. Lazy evaluation**
```javascript
// Don't spawn agents until results actually needed
Task("Research", "Only run if user confirms they want detailed analysis", "researcher")
```

**Benchmarking tools**:
```javascript
// Use performance report
mcp__claude-flow_alpha__performance_report({
  format: "detailed",
  timeframe: "24h"
})

// Analyze bottlenecks
mcp__claude-flow_alpha__bottleneck_analyze({
  component: "agent-coordination"
})
```

**Token optimization**:
- Keep agent instructions concise
- Reuse memory instead of re-sending context
- Use file references instead of inlining content

**Navigation**:
- `/tour next` - Expert Resources
- `/tour back` - Coordination patterns

---

#### Section 6: Expert Resources & Next Steps (5 min)
**Goal**: Point to deepest resources

**Content**:
- **You've mastered**:
  ✓ Deep architecture understanding
  ✓ Stock vs. custom trade-offs
  ✓ Extension point identification
  ✓ Advanced coordination patterns
  ✓ Performance optimization

- **Expert-level resources**:
  - [Architecture Internals](docs/reference/architecture.md)
  - [Stock-First Compliance](docs/reference/stock-adherence.md)
  - [Advanced Swarm Patterns](docs/coordinate/swarm-coordination.md)
  - [Performance Tuning Guide](docs/operate/performance-optimization.md)

- **Next level: Expert pathway**
  - `/tour jump expert` - Full technical depth
  - Implementation internals
  - Contribution guidelines

**Completion Message**:
```
╔══════════════════════════════════════════════════════════╗
║       Advanced Pathway Complete! 🎯                      ║
╚══════════════════════════════════════════════════════════╝

You now understand:
✓ System architecture and design philosophy
✓ Stock vs. custom trade-offs
✓ Safe extension points
✓ Complex coordination patterns
✓ Performance optimization strategies

You're ready to:
→ Build production-grade multi-agent systems
→ Extend the workspace with custom capabilities
→ Optimize workflows for performance
→ Contribute improvements back to the community
```

**Navigation**:
- `/tour jump expert` - Final depth
- `/tour reset` - Start over
- Exit and build

---

## Expert Pathway

### Target Audience
- System architects
- Framework developers
- Contributors to the codebase

### Learning Objectives
By completing this pathway, users will:
1. Understand complete implementation internals
2. Navigate the full stock vs. custom comparison
3. Identify contribution opportunities
4. Extend the framework safely
5. Debug complex coordination issues

### Pathway Structure

#### Section 1: Implementation Internals (15 min)
**Content**:
- Hook system implementation details
- Memory storage schema and indexing
- Session lifecycle state machine
- MCP protocol integration points
- File routing enforcement mechanisms

#### Section 2: Stock vs. Custom Deep Comparison (18 min)
**Content**:
- Line-by-line adherence analysis
- Every architectural decision record
- Migration path to increased stock adherence
- Deprecation strategy for custom components
- Version compatibility matrix

#### Section 3: Contribution Guidelines (12 min)
**Content**:
- Development setup
- Testing requirements
- Documentation standards
- PR process
- Community coordination

#### Section 4: Advanced Debugging (15 min)
**Content**:
- Hook execution tracing
- Memory consistency debugging
- Agent coordination failure analysis
- Performance profiling
- Error recovery strategies

#### Section 5: Future Roadmap & Research Areas (10 min)
**Content**:
- Planned features
- Research opportunities
- Open problems
- Community wishlist
- Contribution priorities

**Navigation**: Similar to other pathways

---

## Cross-Pathway Features

### Common Navigation Commands
All pathways support:
- `/tour next` - Next section
- `/tour back` - Previous section
- `/tour skip [section]` - Jump to section
- `/tour jump [level]` - Switch pathways
- `/tour status` - Current position
- `/tour help` - Command reference
- `/tour reset` - Restart intake

### Progress Indicators
```
════════════════════════════════════════════════════════════
  Intermediate Pathway: Section 3 of 6 - Agent Spawning
════════════════════════════════════════════════════════════
```

### Breadcrumb Navigation
```
Tour → Intermediate → Session Management → Closeout Protocol
                                              ↑ You are here
```

### Section Bookmarking
```
User: /tour bookmark memory-patterns
System: Bookmarked "Memory Coordination" section.
        Return with: /tour jump memory-patterns
```

## Adaptive Content Delivery

### Dynamic Depth Adjustment
If user asks advanced questions in Beginner pathway:
```
System: I notice you're asking about [advanced topic].
        This suggests the Intermediate pathway might be
        a better fit. Would you like to switch?

        /tour jump intermediate
```

### Concept Reinforcement
If user seems confused:
```
System: Let me explain that differently...
        [Alternative explanation with simpler language]

        Or would you like to see a concrete example?
```

### Knowledge Check Integration
Periodic understanding verification:
```
Quick Check: In your own words, what is a session?
(This helps me calibrate the remaining content)
```

## Conclusion

These pathway specifications provide comprehensive, proficiency-adapted content that guides users from complete novice to expert contributor. Each pathway maintains consistent structure while delivering depth appropriate to user experience level, ensuring efficient learning and high user satisfaction.
