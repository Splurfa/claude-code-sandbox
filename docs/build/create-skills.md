# Creating New Skills

**Version**: 1.0
**Tool**: `skill-wizard.js`

---

## Overview

The **Skill Wizard** is an interactive CLI tool that helps you create high-quality, secure, and optimized skills for the workspace. It combines:
1.  **Meta-Skill**: To check for existing skills (avoiding duplicates).
2.  **Prompt-Improver**: To refine your skill definition using Context7 intelligence.

## Usage

### 1. Run the Wizard

Open your terminal and run:

```bash
node skill-wizard.js create <skill-name>
```

*Example:*
```bash
node skill-wizard.js create react-component-generator
```

### 2. Follow the Interactive Steps

The wizard will guide you through:

1.  **Conflict Check**: It searches `.claude/skills` to ensure you aren't rebuilding the wheel.
2.  **Definition**: You provide a description, category, and draft content.
3.  **Refinement**: The AI (Prompt-Improver) analyzes your draft and suggests improvements for clarity, security, and structure.
4.  **Saving**: You choose to save to Production (`.claude/skills/`) or Drafts (`drafts/`).

### 3. The `SKILL.md` Format

Skills are stored as Markdown files with YAML frontmatter.

```markdown
---
name: "React Component Generator"
description: "Creates accessible, typed React components."
category: "Development"
version: "1.0.0"
tags: ["react", "frontend", "typescript"]
---

# React Component Generator

## Usage
...
```

## Best Practices

- **Atomic**: One skill should do one thing well.
- **Secure**: Always validate inputs.
- **Documented**: Include usage examples in the markdown body.
- **Categorized**: Use standard categories (Development, Analysis, Coordination).

## Advanced: Programmatic Usage

You can also use the underlying classes in your own scripts:

```javascript
const { SecurePromptImprover } = require('./.claude/skills/prompt-improver/prompt-improver-secure');
const improver = new SecurePromptImprover();

const result = await improver.improvePrompt(myDraftSkill);
```

