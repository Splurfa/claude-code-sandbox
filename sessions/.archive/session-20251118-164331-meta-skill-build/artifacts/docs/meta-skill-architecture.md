# Meta-Skill Coordinator Architecture

**Version**: 1.0.0
**Created**: 2025-11-18
**Status**: Design Specification

## Executive Summary

A lightweight meta-skill coordinator (~200 lines) that provides intelligent skill routing via natural language understanding and command-style menu interfaces. Acts as a "front door" for all skills, eliminating MCP context bloat through lazy loading and semantic matching.

## Design Philosophy

1. **Simplicity Over Complexity**: No over-engineering, just practical routing
2. **Lazy Loading**: Only load skill details when matched/selected
3. **Progressive Disclosure**: Menu → Natural Language → Skill Invocation
4. **Extensibility**: Add new skills without code changes
5. **Zero Context Penalty**: ~6KB base context for 100+ skills

## System Architecture

### Component Overview

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

### Core Components

#### 1. Skill Registry (Metadata Store)
**Purpose**: Lightweight index of all available skills
**Storage**: In-memory map from skill frontmatter
**Size**: ~100 bytes per skill (name + description + tags)

```typescript
interface SkillMetadata {
  name: string;           // Max 64 chars
  description: string;    // Max 1024 chars
  path: string;           // File path to SKILL.md
  tags: string[];         // Auto-extracted keywords
  category?: string;      // Optional categorization
}

class SkillRegistry {
  private skills: Map<string, SkillMetadata>;

  // Load all skill metadata at startup (~6KB for 100 skills)
  async loadMetadata(): Promise<void>;

  // Search skills by keywords
  search(query: string): SkillMetadata[];

  // Get skills by category
  getByCategory(category: string): SkillMetadata[];
}
```

#### 2. Menu UI Generator
**Purpose**: Present skills as command-style options
**Output**: Interactive menus with categorization

```typescript
interface MenuOptions {
  grouped?: boolean;      // Group by category
  showDescriptions?: boolean;
  maxItems?: number;      // Pagination
}

class MenuGenerator {
  // Generate top-level category menu
  generateMainMenu(registry: SkillRegistry): string;

  // Generate skill selection menu for category
  generateCategoryMenu(category: string, skills: SkillMetadata[]): string;

  // Generate help/usage information
  generateHelp(): string;
}
```

**Example Output**:
```
📚 Available Skills (30 total)

🎓 Learning & Development
  1. tutor-mode          - Adaptive learning guide
  2. skill-builder       - Create custom skills
  3. pair-programming    - AI-assisted coding

🔧 Code Quality & Review
  4. github-code-review  - Automated code review
  5. verification-quality - Truth scoring & rollback
  6. prompt-improver     - Optimize AI prompts

🤖 Multi-Agent Coordination
  7. swarm-orchestration - Multi-agent workflows
  8. hive-mind-advanced  - Queen-based coordination
  9. sparc-methodology   - Systematic TDD

📦 Database & Memory
  10. agentdb-vector-search  - Semantic search
  11. agentdb-optimization   - Performance tuning
  12. reasoningbank-intelligence - Adaptive learning

Type a number (1-12) or describe what you want to do:
```

#### 3. Semantic Matcher
**Purpose**: Match natural language queries to skills
**Approach**: Keyword extraction + TF-IDF scoring

```typescript
interface MatchResult {
  skill: SkillMetadata;
  score: number;         // 0.0 - 1.0 confidence
  matchedKeywords: string[];
}

class SemanticMatcher {
  private stopWords: Set<string>;
  private skillIndex: Map<string, Set<string>>; // keyword → skill IDs

  // Build keyword index from skill descriptions
  buildIndex(skills: SkillMetadata[]): void;

  // Match user query to skills
  match(query: string, threshold = 0.3): MatchResult[];

  // Extract keywords from text
  private extractKeywords(text: string): string[];

  // Calculate TF-IDF score
  private calculateScore(query: string[], skillKeywords: Set<string>): number;
}
```

**Matching Strategy**:
1. Extract keywords from user query (remove stop words)
2. Score each skill based on keyword overlap
3. Weight by position (description start = higher weight)
4. Return top 3-5 matches with confidence scores

**Example Matches**:
```typescript
User: "help me optimize my prompts"
Extracted: ["help", "optimize", "prompts"]
Matches:
  - prompt-improver (score: 0.95, keywords: ["optimize", "prompts"])
  - tutor-mode (score: 0.45, keywords: ["help"])
  - verification-quality (score: 0.38, keywords: ["optimize"])

User: "I want to learn about claude flow"
Extracted: ["learn", "claude", "flow"]
Matches:
  - tutor-mode (score: 0.92, keywords: ["learn", "claude", "flow"])
  - skill-builder (score: 0.35, keywords: ["claude"])
```

#### 4. Intent Parser
**Purpose**: Understand user goals from natural language
**Output**: Structured intent with parameters

```typescript
interface Intent {
  action: 'learn' | 'build' | 'review' | 'optimize' | 'coordinate' | 'help';
  domain?: string;      // e.g., "code", "prompts", "agents"
  context?: string[];   // Additional context
}

class IntentParser {
  // Parse user query into structured intent
  parse(query: string): Intent;

  // Intent patterns (simple regex-based)
  private readonly patterns = {
    learn: /\b(learn|teach|explain|understand|guide)\b/i,
    build: /\b(build|create|generate|make|scaffold)\b/i,
    review: /\b(review|check|analyze|audit|inspect)\b/i,
    optimize: /\b(optimize|improve|enhance|speed up|fix)\b/i,
    coordinate: /\b(coordinate|orchestrate|swarm|agents|multi-agent)\b/i,
    help: /\b(help|how|what|when|why|where)\b/i
  };
}
```

#### 5. Skill Invoker
**Purpose**: Load and execute matched skill
**Behavior**: Lazy load skill content only when invoked

```typescript
interface InvocationContext {
  skill: SkillMetadata;
  userQuery: string;
  parameters?: Record<string, any>;
}

class SkillInvoker {
  // Invoke skill (loads full SKILL.md into context)
  async invoke(context: InvocationContext): Promise<void>;

  // Load skill content (only when needed)
  private async loadSkillContent(path: string): Promise<string>;

  // Prepare context for skill execution
  private prepareContext(context: InvocationContext): string;
}
```

**Invocation Flow**:
1. User selects skill (via menu or semantic match)
2. Load full SKILL.md content into Claude's context
3. Prepend user's original query as task context
4. Execute skill instructions
5. Unload skill content when complete

#### 6. Context Manager
**Purpose**: Manage context window efficiently
**Strategy**: Load/unload skills to prevent bloat

```typescript
class ContextManager {
  private activeSkills: Set<string>;
  private maxActiveSkills = 1; // Only 1 skill active at a time

  // Load skill into context
  async loadSkill(skillId: string): Promise<void>;

  // Unload skill from context
  async unloadSkill(skillId: string): Promise<void>;

  // Switch from one skill to another
  async switchSkill(fromId: string, toId: string): Promise<void>;

  // Get current context size estimate
  getContextSize(): number;
}
```

## User Interaction Flows

### Flow 1: Menu-Driven Selection

```
User: "Show me available skills"

Meta-Skill:
📚 Available Skills (30 total)

🎓 Learning & Development
  1. tutor-mode
  2. skill-builder

[... more categories ...]

User: "2"

Meta-Skill:
✅ Loading skill-builder...
[Full skill-builder SKILL.md loaded into context]

Now using Skill Builder. How can I help you create a custom skill?

User: "Create a skill for database migrations"

Skill Builder:
[Executes according to SKILL.md instructions]
```

### Flow 2: Natural Language Routing

```
User: "help me optimize my prompts"

Meta-Skill:
🎯 I found 3 matching skills:

1. ⭐ prompt-improver (95% match)
   "Optimize AI prompts with HITL approval"

2. verification-quality (38% match)
   "Quality scoring and verification"

3. tutor-mode (25% match)
   "Learning and guidance"

Select a skill (1-3) or describe differently:

User: "1"

Meta-Skill:
✅ Loading prompt-improver...
[Full prompt-improver skill loaded]

Your request: "help me optimize my prompts"

[Prompt Improver skill executes]
```

### Flow 3: Direct Invocation (Expert Mode)

```
User: "/meta invoke prompt-improver"

Meta-Skill:
✅ Loading prompt-improver...
[Skill loaded and ready]

User: "Improve this prompt: [paste prompt]"

[Prompt Improver skill executes]
```

### Flow 4: Multi-Skill Coordination

```
User: "I want to build a review system for my code"

Meta-Skill:
🎯 This requires multiple skills:

1. github-code-review - Automated review coordination
2. verification-quality - Quality scoring
3. swarm-orchestration - Multi-agent setup

Recommended workflow:
  Step 1: Use swarm-orchestration to set up agents
  Step 2: Use github-code-review for review logic
  Step 3: Use verification-quality for quality gates

Start with Step 1? (yes/no)

User: "yes"

Meta-Skill:
✅ Loading swarm-orchestration...
[Loads first skill in workflow]
```

## Implementation Details

### File Structure

```
.claude/skills/meta-coordinator/
├── SKILL.md                      # Main meta-skill (200 lines)
├── lib/
│   ├── registry.ts              # Skill metadata index
│   ├── matcher.ts               # Semantic matching
│   ├── menu.ts                  # Menu generation
│   ├── invoker.ts               # Skill invocation
│   └── parser.ts                # Intent parsing
├── data/
│   └── skill-index.json         # Cached skill metadata
└── README.md                    # Documentation
```

### SKILL.md Structure (200 lines)

```markdown
---
name: "Meta-Skill Coordinator"
description: "Intelligent skill routing via natural language and menus. Use when you need help finding the right skill, want to explore available skills, or need multi-skill coordination."
---

# Meta-Skill Coordinator

## What This Skill Does
[30 lines: Overview, capabilities, when to use]

## Quick Start
[40 lines: Menu usage, natural language examples, direct invocation]

## Available Commands
[30 lines: /meta menu, /meta search <query>, /meta invoke <skill>]

## How Skill Matching Works
[25 lines: Semantic matching explanation, confidence scores]

## Multi-Skill Workflows
[25 lines: Coordinating multiple skills for complex tasks]

## Skill Categories
[30 lines: Category list with descriptions]

## Troubleshooting
[15 lines: Common issues, no match found, wrong skill loaded]

## Technical Details
[5 lines: Link to implementation docs]
```

### Core Logic (Pseudocode)

```typescript
// Main entry point
async function handleUserQuery(query: string) {
  // 1. Check for direct commands
  if (query.startsWith('/meta')) {
    return handleCommand(query);
  }

  // 2. Parse intent
  const intent = intentParser.parse(query);

  // 3. Semantic matching
  const matches = semanticMatcher.match(query);

  // 4. Present options
  if (matches.length === 0) {
    return showMenu('No exact match. Browse categories:');
  }

  if (matches.length === 1 && matches[0].score > 0.8) {
    // High confidence - auto-invoke
    return invokeSkill(matches[0].skill, query);
  }

  // Multiple matches - let user choose
  return presentMatches(matches, query);
}

// Command handlers
function handleCommand(cmd: string) {
  const [command, ...args] = cmd.split(' ');

  switch (command) {
    case '/meta menu':
      return showCategoryMenu();

    case '/meta search':
      return searchSkills(args.join(' '));

    case '/meta invoke':
      return invokeSkillByName(args[0]);

    case '/meta list':
      return listAllSkills();

    case '/meta help':
      return showHelp();
  }
}

// Skill invocation
async function invokeSkill(skill: SkillMetadata, userQuery: string) {
  // Unload any active skills
  await contextManager.clearActive();

  // Load skill content
  const content = await fs.readFile(skill.path, 'utf-8');

  // Inject into context with user query
  return `
✅ Loaded: ${skill.name}

Your request: "${userQuery}"

${content}
`;
}
```

### Semantic Matching Algorithm

```typescript
function calculateMatchScore(query: string, skill: SkillMetadata): number {
  const queryKeywords = extractKeywords(query);
  const skillKeywords = extractKeywords(skill.description);

  // TF-IDF scoring
  let score = 0;
  let matches = [];

  for (const qWord of queryKeywords) {
    for (const sWord of skillKeywords) {
      const similarity = levenshteinRatio(qWord, sWord);
      if (similarity > 0.8) {
        matches.push(qWord);
        score += similarity;
      }
    }
  }

  // Normalize by query length
  score = score / queryKeywords.length;

  // Boost if keywords appear early in description
  const descWords = skill.description.toLowerCase().split(/\s+/);
  for (const match of matches) {
    const position = descWords.indexOf(match);
    if (position >= 0 && position < 10) {
      score *= (1 + (10 - position) / 20); // Up to 50% boost
    }
  }

  return Math.min(score, 1.0);
}

// Simple Levenshtein distance ratio
function levenshteinRatio(s1: string, s2: string): number {
  const distance = levenshteinDistance(s1, s2);
  const maxLen = Math.max(s1.length, s2.length);
  return 1 - (distance / maxLen);
}
```

### Skill Registry Builder

```typescript
async function buildSkillRegistry(): Promise<SkillRegistry> {
  const registry = new SkillRegistry();

  // Scan skill directories
  const skillDirs = [
    path.join(os.homedir(), '.claude/skills'),
    path.join(process.cwd(), '.claude/skills')
  ];

  for (const dir of skillDirs) {
    const skills = await fs.readdir(dir);

    for (const skillName of skills) {
      const skillPath = path.join(dir, skillName, 'SKILL.md');

      if (await fs.exists(skillPath)) {
        const content = await fs.readFile(skillPath, 'utf-8');
        const metadata = extractMetadata(content);

        registry.add({
          name: metadata.name,
          description: metadata.description,
          path: skillPath,
          tags: extractKeywords(metadata.description),
          category: inferCategory(metadata)
        });
      }
    }
  }

  return registry;
}

// Extract YAML frontmatter
function extractMetadata(content: string): { name: string, description: string } {
  const match = content.match(/^---\n([\s\S]+?)\n---/);
  if (!match) throw new Error('Invalid SKILL.md: missing frontmatter');

  const yaml = match[1];
  const name = yaml.match(/name:\s*"?([^"\n]+)"?/)?.[1];
  const description = yaml.match(/description:\s*"?([^"\n]+)"?/)?.[1];

  return { name, description };
}
```

## Advanced Features

### 1. Category Auto-Inference

```typescript
const categoryPatterns = {
  'Learning & Development': /\b(learn|teach|tutorial|guide|training)\b/i,
  'Code Quality & Review': /\b(review|quality|lint|test|verify)\b/i,
  'Multi-Agent Coordination': /\b(swarm|agents|coordinate|orchestrate)\b/i,
  'Database & Memory': /\b(database|memory|storage|persist|agentdb)\b/i,
  'GitHub Integration': /\b(github|git|repository|pr|issue)\b/i,
  'Performance & Optimization': /\b(optimize|performance|speed|benchmark)\b/i,
  'Neural & AI': /\b(neural|ai|model|training|inference)\b/i
};

function inferCategory(metadata: SkillMetadata): string {
  const text = metadata.name + ' ' + metadata.description;

  for (const [category, pattern] of Object.entries(categoryPatterns)) {
    if (pattern.test(text)) {
      return category;
    }
  }

  return 'Miscellaneous';
}
```

### 2. Smart Suggestions

```typescript
interface Suggestion {
  skill: SkillMetadata;
  reason: string;
  confidence: number;
}

function generateSuggestions(query: string): Suggestion[] {
  // Based on intent and past usage patterns
  const intent = intentParser.parse(query);
  const suggestions: Suggestion[] = [];

  // Intent-based suggestions
  if (intent.action === 'learn') {
    suggestions.push({
      skill: registry.get('tutor-mode'),
      reason: 'Interactive learning with progress tracking',
      confidence: 0.9
    });
  }

  if (intent.action === 'review' && intent.domain === 'code') {
    suggestions.push({
      skill: registry.get('github-code-review'),
      reason: 'Automated code review with swarm coordination',
      confidence: 0.85
    });
  }

  return suggestions.sort((a, b) => b.confidence - a.confidence);
}
```

### 3. Workflow Chaining

```typescript
interface WorkflowStep {
  skill: string;
  description: string;
  optional?: boolean;
  after?: string[]; // Dependencies
}

const workflows = {
  'build-review-system': [
    { skill: 'swarm-orchestration', description: 'Set up multi-agent coordination' },
    { skill: 'github-code-review', description: 'Configure review automation', after: ['swarm-orchestration'] },
    { skill: 'verification-quality', description: 'Add quality gates', after: ['github-code-review'] }
  ],

  'learn-claude-flow': [
    { skill: 'tutor-mode', description: 'Start with fundamentals' },
    { skill: 'swarm-orchestration', description: 'Practice multi-agent patterns', after: ['tutor-mode'] },
    { skill: 'hive-mind-advanced', description: 'Master advanced coordination', after: ['swarm-orchestration'] }
  ]
};

function detectWorkflow(query: string): WorkflowStep[] | null {
  // Pattern matching for common workflows
  if (/build.*review.*system/i.test(query)) {
    return workflows['build-review-system'];
  }

  if (/learn.*claude.*flow/i.test(query)) {
    return workflows['learn-claude-flow'];
  }

  return null;
}
```

### 4. Usage Analytics (In-Memory)

```typescript
interface UsageStats {
  skillId: string;
  invocations: number;
  lastUsed: Date;
  avgConfidence: number;
}

class UsageAnalytics {
  private stats = new Map<string, UsageStats>();

  recordInvocation(skillId: string, confidence: number) {
    const current = this.stats.get(skillId) || {
      skillId,
      invocations: 0,
      lastUsed: new Date(),
      avgConfidence: 0
    };

    current.invocations++;
    current.lastUsed = new Date();
    current.avgConfidence = (current.avgConfidence + confidence) / 2;

    this.stats.set(skillId, current);
  }

  getPopularSkills(limit = 5): string[] {
    return Array.from(this.stats.values())
      .sort((a, b) => b.invocations - a.invocations)
      .slice(0, limit)
      .map(s => s.skillId);
  }
}
```

## Performance Characteristics

### Context Usage

```
Baseline (no skills active):
  Meta-Skill SKILL.md: ~2KB
  Skill Registry (100 skills): ~6KB
  Total: ~8KB

Active Skill:
  Meta-Skill: ~8KB
  Active Skill Content: ~5KB (average)
  Total: ~13KB

Context Savings vs Loading All Skills:
  All Skills (100 x 5KB): 500KB
  Meta-Skill Approach: 8-13KB
  Savings: 97-98% reduction
```

### Matching Performance

```
Skill Index Build:
  - Time: <100ms for 100 skills
  - Memory: ~500KB

Query Matching:
  - Time: <10ms for 100 skills
  - Algorithm: O(n*m) where n=skills, m=keywords
  - Optimization: Early termination, keyword pre-filtering

Menu Generation:
  - Time: <5ms
  - Caching: Category groups cached
```

## Error Handling

### No Match Found

```
User: "build a quantum computer"

Meta-Skill:
🤔 No matching skills found for "build a quantum computer"

Did you mean:
  - "build a review system" → github-code-review
  - "build a custom skill" → skill-builder

Or browse all skills:
[Shows category menu]
```

### Ambiguous Intent

```
User: "optimize"

Meta-Skill:
🎯 "Optimize" can refer to multiple domains:

1. Optimize prompts → prompt-improver
2. Optimize code → verification-quality
3. Optimize agents → performance-analysis
4. Optimize database → agentdb-optimization

Which one? (1-4)
```

### Skill Load Failure

```
Error: Cannot read skill file

Meta-Skill:
❌ Failed to load skill "prompt-improver"
Reason: File not found at .claude/skills/prompt-improver/SKILL.md

Suggestions:
  - Check if skill is installed
  - Run: ls .claude/skills/
  - Try alternative: verification-quality
```

## Extension Points

### Adding New Skills

**Zero Code Changes Required**:
1. Drop new SKILL.md in `.claude/skills/new-skill/`
2. Meta-coordinator auto-discovers on next run
3. Metadata extracted from frontmatter
4. Keywords auto-indexed for matching

### Custom Matching Strategies

```typescript
interface MatchStrategy {
  name: string;
  match(query: string, skills: SkillMetadata[]): MatchResult[];
}

class FuzzyMatcher implements MatchStrategy {
  match(query: string, skills: SkillMetadata[]): MatchResult[] {
    // Custom fuzzy matching logic
  }
}

// Register custom strategy
matcherRegistry.register(new FuzzyMatcher());
```

### Custom Workflows

```typescript
// Add to workflows.json
{
  "my-custom-workflow": [
    { "skill": "skill-1", "description": "Step 1" },
    { "skill": "skill-2", "description": "Step 2", "after": ["skill-1"] }
  ]
}
```

## Testing Strategy

### Unit Tests

```typescript
describe('SemanticMatcher', () => {
  it('matches exact keywords', () => {
    const result = matcher.match('optimize prompts');
    expect(result[0].skill.name).toBe('prompt-improver');
    expect(result[0].score).toBeGreaterThan(0.9);
  });

  it('handles fuzzy matching', () => {
    const result = matcher.match('optmize prmpts'); // typos
    expect(result[0].skill.name).toBe('prompt-improver');
    expect(result[0].score).toBeGreaterThan(0.7);
  });

  it('returns no match for gibberish', () => {
    const result = matcher.match('xyzabc123');
    expect(result).toHaveLength(0);
  });
});
```

### Integration Tests

```typescript
describe('End-to-End Skill Invocation', () => {
  it('invokes skill from natural language', async () => {
    const response = await coordinator.handle('help me learn claude flow');

    expect(response).toContain('tutor-mode');
    expect(response).toContain('SKILL.md'); // Skill content loaded
  });

  it('handles menu-driven selection', async () => {
    const menu = await coordinator.handle('show skills');
    const selection = await coordinator.handle('1');

    expect(selection).toContain('Loading');
  });
});
```

## Migration Path

### Phase 1: MVP (Week 1)
- ✅ Skill registry builder
- ✅ Basic menu UI
- ✅ Simple keyword matching
- ✅ Direct skill invocation

### Phase 2: Enhanced Matching (Week 2)
- ✅ Semantic matching with TF-IDF
- ✅ Intent parsing
- ✅ Confidence scoring
- ✅ Fuzzy matching

### Phase 3: Workflows (Week 3)
- ✅ Multi-skill coordination
- ✅ Workflow templates
- ✅ Step-by-step guidance

### Phase 4: Polish (Week 4)
- ✅ Usage analytics
- ✅ Smart suggestions
- ✅ Error handling improvements

## Success Metrics

**Goal**: 90% of users find the right skill in <30 seconds

**Metrics**:
- **Match Accuracy**: >80% first match is correct skill
- **Invocation Time**: <5 seconds from query to skill load
- **Context Efficiency**: <15KB total context usage
- **User Satisfaction**: "Easier than searching CLAUDE.md"

**Measurement**:
- Log match confidence scores
- Track invocation success rate
- Monitor context usage
- Collect user feedback (implicit: re-queries after mismatch)

## Future Enhancements

### Natural Language Improvements
- LLM-based semantic matching (optional, if available)
- Multi-language support
- Context-aware suggestions

### Advanced Workflows
- Conditional branching (if-then-else)
- Parallel skill execution
- State management across skills

### Integration
- CLI tool: `claude-meta search "optimize prompts"`
- VS Code extension integration
- API for programmatic access

### Intelligence
- Learn from usage patterns
- Personalized skill recommendations
- Auto-workflow generation

## Conclusion

The meta-skill coordinator provides a **simple, elegant solution** to skill discovery and routing:

✅ **Lightweight**: ~200 lines of core logic
✅ **Efficient**: 97% context reduction vs loading all skills
✅ **Extensible**: Zero-code addition of new skills
✅ **User-Friendly**: Menu + natural language interfaces
✅ **Practical**: Solves real MCP context bloat problem

**No over-engineering** - just a practical front door that makes 100+ skills feel like 1.

---

**Next Steps**:
1. Implement core registry and matcher (~100 lines)
2. Build menu UI generator (~50 lines)
3. Create SKILL.md for meta-coordinator (~200 lines)
4. Test with existing 30+ skills
5. Iterate based on real usage

Total Implementation: **~350 lines + 200 line SKILL.md**

**Design Review Questions**:
1. Is 200 lines realistic for SKILL.md? (Yes - tutor-mode is 1300 lines, we aim for minimal)
2. Should we support multiple active skills? (No - simplicity first, one at a time)
3. LLM-based matching worth the complexity? (No - keyword matching sufficient for v1)
4. Need persistence for analytics? (No - in-memory fine, ephemeral is simpler)

**Review Complete**: Ready for implementation
