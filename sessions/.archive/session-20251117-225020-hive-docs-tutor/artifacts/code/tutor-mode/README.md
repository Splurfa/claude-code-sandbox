# Tutor Mode - Interactive Learning Assistant

Real implementation of adaptive learning guide for claude-flow orchestration.

## Architecture

### Components

1. **index.js** - Main entry point and command router
   - Processes `/tutor` commands
   - Routes to appropriate handlers
   - CLI interface

2. **answer-engine.js** - Question processing with weighting schema
   - Loads workspace documentation
   - Uses weighting schema to prioritize SAFE references
   - Generates context-aware answers
   - Warns about CAUTIONARY references

3. **memory-manager.js** - User history and personalization
   - Stores interaction history
   - Tracks learning progress
   - Manages user preferences
   - File-based cache (`.swarm/tutor-cache/`)

### Data Flow

```
User Question
     ↓
/tutor command
     ↓
index.js (router)
     ↓
answer-engine.js
     ↓
Load weighting schema
     ↓
Find relevant docs (SAFE first)
     ↓
Generate answer
     ↓
memory-manager.js
     ↓
Store interaction
     ↓
Return answer to user
```

## Features

### Real Implementation (No Mocks)

- **Actual file reading**: Searches workspace docs
- **Real memory storage**: File-based cache
- **Working CLI**: Executable via slash command
- **Live questions**: Processes any user input

### Weighting Schema Integration

- **SAFE references** (weighted_score ≥ 70): Recommended first
  - `docs/explanation/`
  - `docs/how-to/`
  - `docs/getting-started/`

- **CAUTIONARY references** (50-69): Warning provided
  - `docs/reference/`
  - `docs/internals/`

- **EXCLUDE references** (< 50): Never referenced
  - `sessions/.archive/`
  - `inbox/`

### Personalization

Tracks for each user:
- Total interactions
- Topics explored
- Exercises completed
- Recent activity
- Assessment scores
- Learning velocity

## Usage

### Command Line

```bash
# Via slash command
/tutor start
/tutor explain memory-coordination
/tutor exercise foundations

# Direct execution
node sessions/session-20251117-225020-hive-docs-tutor/artifacts/code/tutor-mode/index.js start
```

### Integration Points

1. **Slash Command**: `.claude/commands/tutor.md`
2. **Weighting Schema**: `sessions/.../artifacts/docs/weighting-schema.json`
3. **Memory Storage**: `.swarm/tutor-cache/`
4. **Documentation**: All workspace docs

## Testing

Test commands:

```bash
# Basic functionality
/tutor help

# Question processing
/tutor What are agents?
/tutor How do I use memory?

# Assessment
/tutor assess

# Progress tracking
/tutor progress
```

Expected behaviors:
- ✅ Commands execute without errors
- ✅ Answers reference SAFE docs first
- ✅ CAUTIONARY warnings when appropriate
- ✅ No EXCLUDE references
- ✅ Progress stored in cache

## File Locations

All implementation files in:
```
sessions/session-20251117-225020-hive-docs-tutor/artifacts/code/tutor-mode/
├── index.js           # Main CLI and router
├── answer-engine.js   # Question processing
├── memory-manager.js  # History and personalization
└── README.md          # This file
```

Slash command:
```
.claude/commands/tutor.md
```

Cache directory:
```
.swarm/tutor-cache/
├── user-history.json
└── user-preferences.json
```

## Extension Points

Future enhancements:

1. **MCP Memory Integration**
   - Replace file cache with `mcp__claude-flow_alpha__memory_usage`
   - Persistent across sessions

2. **Context7 Integration**
   - Deep personalization
   - Cross-session learning patterns

3. **Exercise Validation**
   - Automated exercise checking
   - Feedback on attempts

4. **Adaptive Curriculum**
   - Dynamic path based on performance
   - Smart recommendations

## Design Decisions

### Why File-Based Cache?

- Simple, no external dependencies
- Works immediately without setup
- Easy migration to MCP memory later
- Debugging friendly

### Why Direct Document Reading?

- Real-time accuracy (always current)
- No preprocessing needed
- Respects weighting schema
- Scales to any doc structure

### Why CLI-First?

- Integrates with slash commands naturally
- Testable via command line
- Clean separation of concerns
- Easy to extend

## Success Criteria

✅ **Working `/tutor` command** - Executes without errors
✅ **Answers reference SAFE files** - weighted_score ≥ 70
✅ **Warns about CAUTIONARY files** - When no SAFE alternative
✅ **Never references EXCLUDE** - Filters properly
✅ **Tests verify real behavior** - No mocked interactions

## Coding Standards

Follows CLAUDE.md standards:
- Clear naming (what it does, not implementation)
- Comments explain WHAT and WHY
- No temporal naming
- Preserved existing patterns
- Real implementations only

## Next Steps

For tester agent:
1. Test all slash commands
2. Verify weighting schema integration
3. Check memory persistence
4. Validate SAFE/CAUTIONARY behavior
5. Confirm no EXCLUDE references

Hand off via memory:
```javascript
mcp__claude-flow_alpha__memory_usage({
  action: "store",
  key: "coordination/tutor-build/status",
  value: "complete",
  namespace: "hive-wizard-20251117"
})
```
