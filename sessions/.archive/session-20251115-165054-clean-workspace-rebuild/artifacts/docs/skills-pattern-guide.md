# Claude Code Skills Architecture Pattern

## Overview

Claude Code Skills provide a **progressive disclosure** system that scales to 100+ skills without context penalty. This guide documents the patterns, architecture, and best practices based on claude-flow research.

---

## Core Architecture

### Progressive Disclosure (3-Level System)

#### Level 1: Metadata (Always Loaded)
```yaml
---
name: "Skill Name"                    # Max 64 chars
description: "What it does and when   # Max 1024 chars
to use it. Include trigger keywords." # MUST have "what" + "when"
---
```

**Loaded:** At startup, always in context
**Size:** ~200 chars per skill
**Purpose:** Enable autonomous skill matching
**Impact:** 100 skills = ~6KB context (minimal!)

#### Level 2: SKILL.md Body (On-Demand)
```markdown
# Skill Name

## What This Skill Does
[Main instructions - loaded only when skill is active]

## Quick Start
[Basic procedures for 80% use cases]

## Step-by-Step Guide
[Detailed instructions]
```

**Loaded:** When skill is triggered/matched
**Size:** 1-10KB typically
**Purpose:** Main instructions and procedures
**Impact:** Only active skills loaded

#### Level 3+: Referenced Files (Lazy Loading)
```markdown
# In SKILL.md
See [Advanced Configuration](docs/ADVANCED.md)
Use template: `resources/templates/template.js`
```

**Loaded:** As Claude navigates to specific files
**Size:** Variable (KB to MB)
**Purpose:** Deep reference, examples, schemas
**Impact:** Loaded only when Claude accesses files

---

## Skill Structure

### Minimal Skill (Required)
```
~/.claude/skills/my-skill/       # MUST be at top level!
└── SKILL.md                     # REQUIRED
```

**Critical:** Skills MUST be directly under `~/.claude/skills/[skill-name]/`
NO nested subdirectories or namespaces!

### Full-Featured Skill (Recommended)
```
~/.claude/skills/my-skill/
├── SKILL.md                     # REQUIRED: Main skill file
├── README.md                    # Optional: Human-readable docs
├── scripts/                     # Optional: Executable scripts
│   ├── setup.sh
│   ├── generate.js
│   └── validate.py
├── resources/                   # Optional: Supporting files
│   ├── templates/
│   │   ├── component.tsx
│   │   └── config.json
│   ├── examples/
│   │   └── sample-usage/
│   └── schemas/
│       └── config.schema.json
└── docs/                        # Optional: Additional docs
    ├── ADVANCED.md
    ├── TROUBLESHOOTING.md
    └── API_REFERENCE.md
```

---

## YAML Frontmatter Specification

### Required Fields

```yaml
---
name: "Skill Name"
description: "Complete description with what and when"
---
```

### Field Requirements

**`name`:**
- **Type:** String
- **Max Length:** 64 characters
- **Format:** Human-friendly display name (Title Case)
- **Examples:**
  - ✅ "API Documentation Generator"
  - ✅ "React Component Builder"
  - ❌ "skill-1" (not descriptive)
  - ❌ "This is a very long name..." (>64 chars)

**`description`:**
- **Type:** String
- **Max Length:** 1024 characters
- **Must Include:**
  1. **What** the skill does (functionality)
  2. **When** Claude should invoke it (triggers)
- **Front-load keywords** for better matching
- **Examples:**
  - ✅ "Generate OpenAPI 3.0 docs from Express routes. Use when creating API docs, documenting endpoints."
  - ✅ "Create React components with TypeScript and tests. Use when scaffolding components."
  - ❌ "A comprehensive API tool" (no "when" clause)
  - ❌ "Documentation helper" (too vague)

### YAML Formatting

```yaml
# ✅ CORRECT: Simple string
---
name: "API Builder"
description: "Creates REST APIs with Express and TypeScript."
---

# ✅ CORRECT: Multi-line description
---
name: "Full-Stack Generator"
description: "Generates full-stack apps with React and Node.js.
Use when starting new projects or scaffolding applications."
---

# ✅ CORRECT: Special characters quoted
---
name: "JSON:API Builder"
description: "Creates JSON:API compliant endpoints: pagination, filtering."
---

# ❌ WRONG: Missing quotes with special chars
---
name: API:Builder  # YAML parse error!
---

# ❌ WRONG: Extra fields (ignored but discouraged)
---
name: "My Skill"
description: "My description"
version: "1.0.0"       # NOT part of spec
author: "Me"           # NOT part of spec
---
```

**Note:** Only `name` and `description` are used by Claude. Additional fields are ignored.

---

## Content Structure Pattern

### Recommended 4-Level Structure

```markdown
---
name: "Your Skill Name"
description: "What it does and when to use it"
---

# Your Skill Name

## Level 1: Overview (Always Read First)
Brief 2-3 sentence description.

## Prerequisites
- Requirement 1
- Requirement 2

## What This Skill Does
1. Primary function
2. Secondary function
3. Key benefit

---

## Level 2: Quick Start (For Fast Onboarding)

### Basic Usage
```bash
# Simplest use case (80% of users)
command --option value
```

### Common Scenarios
1. **Scenario 1**: How to...
2. **Scenario 2**: How to...

---

## Level 3: Detailed Instructions (For Deep Work)

### Step-by-Step Guide

#### Step 1: Initial Setup
```bash
# Commands
```
Expected output:
```
Success message
```

#### Step 2: Configuration
- Configuration option 1
- Configuration option 2

### Advanced Options
[Complex scenarios]

---

## Level 4: Reference (Rarely Needed)

### Troubleshooting
[Common issues and solutions]

### Complete API Reference
See [API_REFERENCE.md](docs/API_REFERENCE.md)

### Examples
See [examples/](resources/examples/)
```

---

## Writing Effective Descriptions

### Front-Load Keywords
```yaml
# ✅ GOOD: Keywords first
description: "Generate TypeScript interfaces from JSON schema.
Use when converting schemas, creating types, building API clients."

# ❌ BAD: Keywords buried
description: "This skill helps developers who need to work with
JSON schemas by providing a way to generate TypeScript interfaces."
```

### Include Trigger Conditions
```yaml
# ✅ GOOD: Clear "when" clause
description: "Debug React performance with Chrome DevTools.
Use when components re-render unnecessarily, investigating slow
updates, or optimizing bundle size."

# ❌ BAD: No trigger conditions
description: "Helps with React performance debugging."
```

### Be Specific
```yaml
# ✅ GOOD: Specific technologies
description: "Create Express.js REST endpoints with Joi validation,
Swagger docs, and Jest tests. Use when building APIs."

# ❌ BAD: Too generic
description: "Build API endpoints with validation and testing."
```

---

## Skills Locations

### Personal Skills (User-Global)
```
~/.claude/skills/
└── [your-skills]/
```
- **Path:** `~/.claude/skills/` or `$HOME/.claude/skills/`
- **Scope:** Available in all projects for this user
- **Version Control:** NOT committed to git (outside repo)
- **Use Case:** Personal productivity tools, custom workflows

### Project Skills (Team-Shared)
```
<project-root>/.claude/skills/
└── [team-skills]/
```
- **Path:** `.claude/skills/` in project root
- **Scope:** Available only in this project
- **Version Control:** SHOULD be committed to git
- **Use Case:** Team workflows, project-specific tools

---

## Skill Templates

### Template 1: Basic Skill (Minimal)

```markdown
---
name: "My Basic Skill"
description: "One sentence what. One sentence when to use."
---

# My Basic Skill

## What This Skill Does
[2-3 sentences describing functionality]

## Quick Start
```bash
# Single command to get started
```

## Step-by-Step Guide

### Step 1: Setup
[Instructions]

### Step 2: Usage
[Instructions]

### Step 3: Verify
[Instructions]

## Troubleshooting
- **Issue**: Problem description
  - **Solution**: Fix description
```

### Template 2: Intermediate Skill (With Scripts)

```markdown
---
name: "My Intermediate Skill"
description: "Detailed what with key features. When to use with
specific triggers: scaffolding, generating, building."
---

# My Intermediate Skill

## Prerequisites
- Requirement 1
- Requirement 2

## What This Skill Does
1. Primary function
2. Secondary function
3. Integration capability

## Quick Start
```bash
./scripts/setup.sh
./scripts/generate.sh my-project
```

## Configuration
Edit `config.json`:
```json
{
  "option1": "value1",
  "option2": "value2"
}
```

## Available Scripts
- `scripts/setup.sh` - Initial setup
- `scripts/generate.sh` - Code generation
- `scripts/validate.sh` - Validation

## Resources
- Templates: `resources/templates/`
- Examples: `resources/examples/`

## Troubleshooting
[Common issues and solutions]
```

---

## Integration with Claude-Flow

### Skill + Hooks Pattern

Skills can leverage claude-flow hooks for automation:

```markdown
---
name: "Automated Testing Skill"
description: "Run tests automatically after code changes.
Use when implementing TDD workflows."
---

# Automated Testing Skill

## Quick Start

### Enable Auto-Testing
```bash
# Configure post-edit hook
npx claude-flow@alpha hooks post-edit --file "*.test.js" --run-tests
```

### Manual Test Execution
```bash
# Pre-task: Check existing tests
npx claude-flow@alpha hooks pre-task --description "Run tests"

# Post-task: Report results
npx claude-flow@alpha hooks post-task --task-id "tests" --analyze-performance
```
```

### Skill + Memory Pattern

Skills can use memory for coordination:

```markdown
---
name: "Multi-Agent Coordination Skill"
description: "Coordinate multiple agents with shared context.
Use when orchestrating complex multi-agent workflows."
---

# Multi-Agent Coordination Skill

## Agent Coordination

### Store Shared Context
```bash
npx claude-flow@alpha hooks memory --action store \
  --key "skill/coordination/context" \
  --value "Project requirements and architecture decisions"
```

### Retrieve Context in Agents
```bash
npx claude-flow@alpha hooks memory --action retrieve \
  --key "skill/coordination/context"
```
```

---

## Validation Checklist

Before publishing a skill:

**YAML Frontmatter:**
- [ ] Starts with `---`
- [ ] Contains `name` field (max 64 chars)
- [ ] Contains `description` field (max 1024 chars)
- [ ] Description includes "what" and "when"
- [ ] Ends with `---`
- [ ] No YAML syntax errors

**File Structure:**
- [ ] SKILL.md exists
- [ ] Directory is DIRECTLY in `~/.claude/skills/[skill-name]/`
- [ ] Uses clear, descriptive directory name
- [ ] **NO nested subdirectories**

**Content Quality:**
- [ ] Level 1 (Overview) is brief and clear
- [ ] Level 2 (Quick Start) shows common use case
- [ ] Level 3 (Details) provides step-by-step guide
- [ ] Level 4 (Reference) links to advanced content
- [ ] Examples are concrete and runnable

**Progressive Disclosure:**
- [ ] Core instructions in SKILL.md (~2-5KB)
- [ ] Advanced content in separate docs/
- [ ] Large resources in resources/ directory
- [ ] Clear navigation between levels

**Testing:**
- [ ] Skill appears in Claude's skill list
- [ ] Description triggers on relevant queries
- [ ] Instructions are actionable
- [ ] Scripts execute successfully (if included)

---

## Best Practices

### 1. Keep SKILL.md Lean
- Target 2-5KB for main file
- Move lengthy content to separate files
- Link to resources and examples
- Claude loads only what's needed

### 2. Use Clear Navigation
```markdown
## Advanced Configuration
For complex scenarios, see [ADVANCED.md](docs/ADVANCED.md).

## API Reference
Complete API docs: [API_REFERENCE.md](docs/API_REFERENCE.md)

## Templates
Use templates in `resources/templates/`:
- `component.tsx` - React component
- `test.spec.ts` - Test template
```

### 3. Front-Load Important Info
- Most important instructions at top
- Quick start before detailed guides
- Common scenarios before edge cases
- Troubleshooting near the end

### 4. Make Skills Discoverable
- Use specific, searchable keywords in description
- Include technology names (React, Express, TypeScript)
- Mention use cases (scaffolding, testing, deploying)
- Add trigger phrases (when creating, when building)

---

## Common Patterns

### Pattern 1: Code Generation Skill
```markdown
---
name: "Code Generator"
description: "Generate boilerplate code from templates.
Use when scaffolding projects, creating components."
---

Structure:
1. Templates in `resources/templates/`
2. Generation script in `scripts/generate.sh`
3. Examples in `resources/examples/`
4. Clear usage instructions
```

### Pattern 2: Automation Skill
```markdown
---
name: "Workflow Automator"
description: "Automate repetitive development tasks.
Use when setting up CI/CD, deployment pipelines."
---

Structure:
1. Automation scripts in `scripts/`
2. Configuration templates
3. Integration with hooks
4. Monitoring and logging
```

### Pattern 3: Analysis Skill
```markdown
---
name: "Code Analyzer"
description: "Analyze code quality and patterns.
Use when reviewing code, finding issues."
---

Structure:
1. Analysis scripts
2. Report templates
3. Integration with linters/tools
4. Clear output format
```

---

## Resources

**Official Documentation:**
- [Anthropic Agent Skills](https://docs.claude.com/en/docs/agents-and-tools/agent-skills)
- [GitHub Skills Repository](https://github.com/anthropics/skills)
- [Claude Code Documentation](https://docs.claude.com/en/docs/claude-code)

**Community:**
- [Skills Marketplace](https://github.com/anthropics/skills)
- [Anthropic Discord](https://discord.gg/anthropic)

**This Workspace:**
- Total Skills: 34 (27 managed + 7 custom)
- Skills Location: `.claude/skills/`
- Examples: See existing skills for patterns

---

## Summary

**Key Principles:**
1. **Progressive Disclosure** - Load only what's needed
2. **Clear Structure** - 4-level organization
3. **Front-Load Keywords** - Make skills discoverable
4. **Keep Lean** - Main file 2-5KB, reference external docs
5. **No Nesting** - Skills at top level only

**Result:** Scale to 100+ skills with minimal context overhead and fast autonomous matching.
