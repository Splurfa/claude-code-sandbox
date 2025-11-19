---
name: "Prompt Improver"
description: "Enhance prompt quality using Context7 intelligence, security validation, and best practices. Features injection prevention, quality scoring, and automated refinement."
category: "Performance & Optimization"
version: "2.0.1"
tags: ["prompt", "optimization", "security", "quality", "context7"]
---

# Prompt Improver

## What This Skill Does
Analyzes and improves prompts to ensure high quality, security, and effectiveness. It uses a 5-dimensional scoring system (Clarity, Specificity, Context, Structure, Actionability) and integrates with Context7 for intelligent recommendations.

## Key Features
- **Security Validation**: Prevents prompt injection attacks and sanitizes input.
- **Quality Scoring**: Provides a detailed breakdown of prompt quality.
- **Context7 Integration**: Fetches relevant documentation and patterns.
- **Automated Refinement**: Suggests specific improvements for structure, clarity, and coordination.
- **File Routing Enforcement**: Ensures all file operations stay within session artifacts.

## Usage

### CLI Command
```bash
# Analyze a prompt
node .claude/skills/prompt-improver/prompt-improver-secure.js analyze "Build a react app"

# Improve a prompt (interactive)
node .claude/skills/prompt-improver/prompt-improver-secure.js improve "Build a react app"
```

### Programmatic Usage
```javascript
const { SecurePromptImprover } = require('./prompt-improver-secure');
const improver = new SecurePromptImprover();

const result = await improver.improvePrompt("Build a react app");
if (result.shouldImprove) {
  console.log(result.improvedPrompt);
}
```
