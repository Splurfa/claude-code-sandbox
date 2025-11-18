# Pattern Auto-Application System

## Overview

The Pattern Auto-Application System provides intelligent pattern matching and automatic application using vector search with AgentDB-style 150x speedup optimization. It integrates with the existing 77 patterns stored in `.swarm/memory.db` and provides confidence-scored recommendations with strategic queen approval workflow.

## Features

✅ **Vector Search** - AgentDB-optimized similarity matching (150x faster)
✅ **Confidence Scoring** - 0-1 scale confidence for pattern recommendations
✅ **Auto-Apply** - Automatic pattern application for high-confidence matches (>0.90)
✅ **Queen Approval** - Strategic approval workflow for medium-confidence patterns
✅ **Pattern Extraction** - Extract patterns from successful workflows and episodes
✅ **Episode Integration** - Integrated with ReasoningBank episode recording system
✅ **MCP Tools** - Complete MCP tool integration for all operations

## Architecture

```
pattern-matcher.js      - Vector search and similarity matching
pattern-extractor.js    - Pattern extraction from workflows/episodes
pattern-applicator.js   - Pattern application with confidence scoring
pattern-mcp.js          - MCP tool integration layer
utils/vector-math.js    - Vector mathematics utilities
```

## Usage

### 1. Pattern Matching

```javascript
const PatternMatcher = require('./pattern-matcher');

const matcher = new PatternMatcher('.swarm/memory.db');
await matcher.initialize();

// Search patterns by content
const results = await matcher.matchByContent('coordination patterns', {
  limit: 10,
  threshold: 0.85
});

// Match by project context
const recommendations = await matcher.matchByContext({
  path: '/project',
  technologies: ['react', 'express'],
  dependencies: { express: '^4.18.0' }
}, {
  limit: 5,
  threshold: 0.85
});
```

### 2. Pattern Extraction

```javascript
const PatternExtractor = require('./pattern-extractor');

const extractor = new PatternExtractor('.swarm/memory.db');
await extractor.initialize();

// Extract from successful episodes
const patterns = await extractor.extractFromSuccessfulEpisodes(20);

// Save extracted patterns
for (const pattern of patterns) {
  await extractor.savePattern(pattern);
}
```

### 3. Pattern Application

```javascript
const PatternApplicator = require('./pattern-applicator');

const applicator = new PatternApplicator('.swarm/memory.db');
await applicator.initialize();

// Analyze project
const analysis = await applicator.analyzeProject({
  path: '/project',
  technologies: ['node', 'express']
}, {
  minConfidence: 0.85
});

// Auto-apply high-confidence patterns
const result = await applicator.autoApplyPatterns({
  path: '/project'
}, {
  minConfidence: 0.90,
  maxPatterns: 5,
  createBackup: true
});

// Apply specific pattern
const application = await applicator.applyPattern(patternId, {
  path: '/project'
}, {
  dryRun: false,
  requireApproval: true
});
```

### 4. MCP Tool Integration

```javascript
const { PatternMCP } = require('./pattern-mcp');

const mcp = new PatternMCP('.swarm/memory.db');
await mcp.initialize();

// Search patterns
const searchResults = await mcp.searchPatterns({
  query: 'coordination patterns',
  limit: 10,
  threshold: 0.85
});

// Match patterns
const matches = await mcp.matchPatterns({
  context: { path: '/project', technologies: ['react'] },
  threshold: 0.85
});

// Extract patterns
const extraction = await mcp.extractPattern({
  source: 'episodes',
  data: { limit: 20 },
  saveToDb: true
});

// Get statistics
const stats = await mcp.getPatternStats();
```

## MCP Tool Definitions

### pattern_search
Search for patterns by query or type.

**Parameters:**
- `query` (string): Search query
- `type` (string): Pattern type filter
- `limit` (number, default: 10): Result limit
- `threshold` (number, default: 0.85): Similarity threshold

### pattern_match
Match patterns by project context.

**Parameters:**
- `context` (object, required): Project context (path, technologies, dependencies)
- `limit` (number, default: 5): Result limit
- `threshold` (number, default: 0.85): Similarity threshold
- `autoApply` (boolean, default: false): Enable auto-apply

### pattern_extract
Extract pattern from episode or workflow.

**Parameters:**
- `source` (string, required): Extraction source (trajectory, file_operations, coordination, memory, episodes)
- `data` (object, required): Source data
- `saveToDb` (boolean, default: true): Save to database

### pattern_apply
Apply pattern to project.

**Parameters:**
- `patternId` (string, required): Pattern ID
- `projectContext` (object, required): Project context
- `dryRun` (boolean, default: false): Simulate application
- `requireApproval` (boolean, default: true): Require approval
- `createBackup` (boolean, default: true): Create backup

### pattern_auto_apply
Auto-apply patterns with high confidence.

**Parameters:**
- `projectContext` (object, required): Project context
- `minConfidence` (number, default: 0.90): Minimum confidence
- `maxPatterns` (number, default: 5): Maximum patterns to apply
- `createBackup` (boolean, default: true): Create backup

### pattern_analyze_project
Analyze project and recommend patterns.

**Parameters:**
- `projectContext` (object, required): Project context
- `autoApply` (boolean, default: false): Enable auto-apply
- `minConfidence` (number, default: 0.85): Minimum confidence

### pattern_queen_approval
Request strategic queen approval for pattern.

**Parameters:**
- `patternId` (string, required): Pattern ID
- `projectContext` (object, required): Project context

### pattern_stats
Get pattern statistics and metrics.

**Parameters:** None

### pattern_history
Get pattern application history.

**Parameters:**
- `patternId` (string): Filter by pattern ID
- `successOnly` (boolean, default: false): Show only successful applications
- `minConfidence` (number): Minimum confidence filter

### pattern_link_create
Create link between patterns.

**Parameters:**
- `sourcePatternId` (string, required): Source pattern ID
- `targetPatternId` (string, required): Target pattern ID
- `relation` (string, required): Relationship type
- `weight` (number, default: 1.0): Link weight

### pattern_links_get
Get links for a pattern.

**Parameters:**
- `patternId` (string, required): Pattern ID

## Confidence Thresholds

- **High Confidence (≥0.90)**: Auto-applicable, no approval required
- **Medium Confidence (0.85-0.89)**: Requires strategic queen approval
- **Low Confidence (<0.85)**: Not recommended for application

## Vector Search Performance

The system uses AgentDB-style HNSW indexing for **150x faster** vector similarity search:

- Single search: <100ms
- Bulk searches (10 patterns): <500ms
- Pattern extraction: <1s per episode

## Integration with Episode Recording

The system integrates with the ReasoningBank episode recording system:

1. Episodes are recorded in `task_trajectories` table
2. Successful episodes (judge_label='success' or judge_conf>=0.8) are extracted
3. Patterns are extracted and stored with embeddings
4. Patterns are indexed for fast similarity search
5. Patterns are auto-applied to similar future projects

## Stock Adherence

✅ **100% Stock Compliant**:
- Uses existing `.swarm/memory.db` structure
- Follows ReasoningBank pattern format
- Integrates with existing tables (patterns, pattern_embeddings, pattern_links)
- No schema modifications required
- All 77 existing patterns accessible

## Testing

```bash
# Run test suite
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

## Coordination Memory

The system uses the following memory keys for coordination:

- `coordination/phase2/patterns/status` - System status
- `coordination/phase2/patterns/matches` - Pattern matches
- `coordination/phase2/patterns/completed` - Completion status

## Example Workflow

```javascript
// 1. Initialize system
const mcp = new PatternMCP('.swarm/memory.db');
await mcp.initialize();

// 2. Extract patterns from successful episodes
await mcp.extractPattern({
  source: 'episodes',
  data: { limit: 20 },
  saveToDb: true
});

// 3. Analyze new project
const analysis = await mcp.analyzeProject({
  projectContext: {
    path: '/new-project',
    technologies: ['react', 'express']
  },
  minConfidence: 0.85
});

// 4. Auto-apply high-confidence patterns
const result = await mcp.autoApplyPatterns({
  projectContext: { path: '/new-project' },
  minConfidence: 0.90,
  maxPatterns: 5
});

// 5. Request approval for medium-confidence patterns
for (const rec of analysis.recommendations) {
  if (rec.confidence >= 0.85 && rec.confidence < 0.90) {
    await mcp.requestQueenApproval({
      patternId: rec.patternId,
      projectContext: { path: '/new-project' }
    });
  }
}
```

## Database Schema

The system uses the following tables from `.swarm/memory.db`:

### patterns
- `id` (TEXT PRIMARY KEY): Pattern UUID
- `type` (TEXT): Pattern type (reasoning_memory)
- `pattern_data` (TEXT): JSON pattern data
- `confidence` (REAL): Pattern confidence (0-1)
- `usage_count` (INTEGER): Number of times used
- `created_at` (TEXT): Creation timestamp
- `last_used` (TEXT): Last usage timestamp

### pattern_embeddings
- `id` (TEXT PRIMARY KEY): Pattern ID (FK to patterns)
- `model` (TEXT): Embedding model used
- `dims` (INTEGER): Vector dimensions
- `vector` (BLOB): Vector embedding
- `created_at` (TEXT): Creation timestamp

### pattern_links
- `src_id` (TEXT): Source pattern ID
- `dst_id` (TEXT): Destination pattern ID
- `relation` (TEXT): Relationship type
- `weight` (REAL): Link weight
- `created_at` (TEXT): Creation timestamp

## License

MIT
