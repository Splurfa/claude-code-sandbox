# Meta-Skill Coordinator

Intelligent skill routing via natural language understanding and command-style menus.

## Overview

The Meta-Skill Coordinator acts as a "front door" to all available skills, eliminating MCP context bloat through lazy loading and semantic matching. Instead of loading all skills into context, it:

1. Maintains a lightweight metadata index (~6KB for 100 skills)
2. Matches user queries to relevant skills using TF-IDF semantic matching
3. Lazy-loads only the selected skill's full content
4. Provides both natural language and menu-driven interfaces

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                 Meta-Skill Coordinator                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Menu UI    │  │   Semantic   │  │    Skill     │ │
│  │   Generator  │→→│   Matcher    │→→│   Invoker    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│         ↓                  ↓                  ↓        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Skill      │  │   Intent     │  │   Context    │ │
│  │   Registry   │  │   Parser     │  │   Manager    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Components

### Skill Registry (`lib/skill-registry.js`)
- Scans `.claude/skills/` directories
- Extracts YAML frontmatter from `SKILL.md` files
- Builds lightweight metadata index
- Categorizes skills automatically
- Provides search and filtering

### Semantic Matcher (`lib/semantic-matcher.js`)
- TF-IDF based keyword matching
- Levenshtein distance for fuzzy matching
- Confidence scoring (0-1 scale)
- Intent parsing from natural language
- Position-weighted scoring (keywords early in description = higher score)

### Coordinator (`lib/coordinator.js`)
- Main entry point for routing
- Command handling (`/meta menu`, `/meta search`, etc.)
- Natural language processing
- Skill invocation with lazy loading
- Error handling and suggestions

## Usage

### In Claude Code

Simply invoke the skill and describe what you want:

```
"help me optimize my prompts"
→ Routes to: prompt-improver (95% confidence)

"I want to learn about claude flow"
→ Routes to: tutor-mode (92% confidence)

"show me available skills"
→ Displays organized category menu
```

### Commands

```bash
/meta menu                    # Browse all skills by category
/meta menu learning           # Show only learning category
/meta search optimization     # Search for skills
/meta invoke prompt-improver  # Load specific skill
/meta list                    # List all skills
/meta list --categories       # List with categories
/meta help                    # Show help
```

## Installation

1. Copy the entire `meta-skill/` directory to `.claude/skills/`:

```bash
cp -r meta-skill ~/.claude/skills/
```

2. Verify installation:

```bash
node ~/.claude/skills/meta-skill/test-coordinator.js
```

## Testing

Run the basic test suite:

```bash
cd ~/.claude/skills/meta-skill
node test-coordinator.js
```

Expected output:
```
🧪 Testing Meta-Skill Coordinator

Test 1: Initialize coordinator...
✅ Loaded X skills

Test 2: Show category menu...
📚 Available Skills (X total)
...
✅ Menu generated

Test 3: Natural language query...
🎯 Found: [skill name] (95% confidence)
✅ Natural language routing works

🎉 All tests passed!
```

## Performance

**Context Usage:**
- Baseline (no skills active): ~8KB
- With active skill: ~13KB
- Savings vs loading all skills: 97-98% reduction

**Matching Performance:**
- Index build: <100ms for 100 skills
- Query matching: <10ms per query
- Memory: ~500KB for index

## File Structure

```
meta-skill/
├── SKILL.md                # Main skill definition (v2 format)
├── lib/
│   ├── coordinator.js      # Main entry point (~200 lines)
│   ├── skill-registry.js   # Metadata index (~200 lines)
│   └── semantic-matcher.js # TF-IDF matching (~150 lines)
├── test-coordinator.js     # Basic tests
└── README.md              # This file
```

**Total Implementation:** ~550 lines + 200 line SKILL.md = 750 lines

## Design Principles

1. **Simplicity Over Complexity** - No over-engineering
2. **Lazy Loading** - Load skill content only when needed
3. **Progressive Disclosure** - Menu → Natural Language → Skill Invocation
4. **Extensibility** - Add new skills without code changes
5. **Zero Context Penalty** - Minimal baseline context usage

## Extension Points

### Adding New Skills
Zero code changes required:
1. Create `.claude/skills/new-skill/SKILL.md` with YAML frontmatter
2. Coordinator auto-discovers on next run
3. Metadata extracted automatically
4. Keywords indexed for matching

### Custom Categories
Edit category patterns in `skill-registry.js`:

```javascript
const patterns = {
  'Your Category': /\b(keyword1|keyword2)\b/i,
  // ...
};
```

### Custom Workflows
Future enhancement for multi-skill coordination.

## Troubleshooting

**No skills found:**
- Verify skills exist in `~/.claude/skills/` or `./.claude/skills/`
- Check SKILL.md files have YAML frontmatter
- Run test to see loaded skills count

**Poor matching:**
- Use more specific keywords in queries
- Try `/meta search` for explicit keyword search
- Use `/meta menu` to browse categories

**Skill won't load:**
- Verify SKILL.md file exists at reported path
- Check file permissions
- Look for syntax errors in YAML frontmatter

## License

MIT - Part of Claude Flow ecosystem
