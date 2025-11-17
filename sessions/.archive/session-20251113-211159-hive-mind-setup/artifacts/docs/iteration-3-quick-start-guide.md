# Phase 1 Foundation Systems - Quick Start Guide

## For Users: Zero Setup Required

**When you open a new Claude Code chat:**
1. Just start talking - session auto-creates
2. Agents coordinate automatically
3. Memory persists across sessions
4. Learning happens in the background

That's it. Everything else is automatic.

## For Queen Coordinators: Spawning Agents

```javascript
// 1. Session is already initialized (automatic)
const sessionId = process.env.SESSION_ID;

// 2. Generate agent prompts with embedded hooks
const { generateAgentPrompt } = require('./agent-templates');

// 3. Spawn agents using Claude Code's Task tool
Task("Backend Developer",
     generateAgentPrompt('coder', 'Build REST API', sessionId),
     "backend-dev");

Task("Test Engineer",
     generateAgentPrompt('tester', 'Write tests', sessionId),
     "tester");

Task("Code Reviewer",
     generateAgentPrompt('reviewer', 'Review code', sessionId),
     "reviewer");

// 4. Store coordination decisions
const { storeDecision } = require('./always-on-hooks');
await storeDecision('resource-allocation', {
  backend: '2GB memory',
  tester: '1GB memory'
});
```

## For Worker Agents: Following the Protocol

**Your prompt already includes hook instructions. Just follow them:**

### Before Work
```bash
node sessions/$SESSION_ID/iteration-3/artifacts/code/always-on-hooks.js agent:spawn "Your task description"
```

### During Work
```javascript
// Save files to session artifacts
const targetPath = `sessions/${process.env.SESSION_ID}/artifacts/code/myfile.js`;

// Hooks fire automatically on file writes

// Store important decisions manually if needed
const { storeDecision } = require('./always-on-hooks');
await storeDecision('architecture-choice', { database: 'postgres' });
```

### After Work
```bash
node sessions/$SESSION_ID/iteration-3/artifacts/code/always-on-hooks.js agent:complete
```

## For Learning System: Capturing Corrections

**When user corrects your work:**
```javascript
const { captureCorrection } = require('./learning-integration');

await captureCorrection(
  'What you did wrong',
  'What the user corrected it to',
  'success'
);
```

**Check for learned patterns before starting:**
```javascript
const { applyPattern } = require('./learning-integration');

const suggestion = await applyPattern('Current situation description');
if (suggestion) {
  console.log('Learned pattern suggests:', suggestion);
}
```

## File Routing Rules

**CRITICAL:** All work goes to session artifacts:

| Content | Destination |
|---------|-------------|
| Code | `sessions/$SESSION_ID/artifacts/code/` |
| Tests | `sessions/$SESSION_ID/artifacts/tests/` |
| Docs | `sessions/$SESSION_ID/artifacts/docs/` |
| Scripts | `sessions/$SESSION_ID/artifacts/scripts/` |
| Notes | `sessions/$SESSION_ID/artifacts/notes/` |

**NEVER** write to root directories unless explicitly modifying existing project files.

## Common Patterns

### Pattern 1: Parallel Agent Spawning
```javascript
// Spawn multiple agents in ONE message
[Single Message]:
  Task("Researcher", generateAgentPrompt('researcher', 'Analyze', sid), "r1")
  Task("Coder", generateAgentPrompt('coder', 'Build', sid), "c1")
  Task("Tester", generateAgentPrompt('tester', 'Test', sid), "t1")
```

### Pattern 2: Decision Tracking
```javascript
// Store decisions for cross-agent coordination
await storeDecision('api-design', {
  endpoints: ['/users', '/posts'],
  auth: 'JWT',
  database: 'postgres'
});

// Later, retrieve decisions
const decisions = await getDecisions('api-design');
```

### Pattern 3: Learning from Corrections
```javascript
// User says: "Don't use var, use const"
await captureCorrection(
  'Used var for variables',
  'Use const for constants, let for variables',
  'success'
);

// Next time, before coding:
const pattern = await applyPattern('Declaring variables');
// Returns: 'Use const for constants, let for variables'
```

### Pattern 4: Session Summary Updates
```javascript
// During work, update session summary
const summaryPath = `sessions/${process.env.SESSION_ID}/session-summary.md`;
const summary = fs.readFileSync(summaryPath, 'utf-8');

const updated = summary + '\n- Implemented feature X\n- Tests passing\n';
fs.writeFileSync(summaryPath, updated);
```

## Troubleshooting

### "No active session"
```javascript
// Run session auto-init manually
const { autoInitialize } = require('./session-auto-init');
const sessionId = autoInitialize('Your task description');
```

### "Hooks not firing"
```javascript
// Check if always-on-hooks is loaded
const hooks = require('./always-on-hooks');
hooks.enableAutoHooks(); // Force enable
```

### "Can't find learned patterns"
```javascript
// Query memory directly
const { getLearnedPatterns } = require('./learning-integration');
const patterns = getLearnedPatterns('all');
console.log('Available patterns:', patterns.length);
```

### "Wrong file location"
```bash
# Check session ID
echo $SESSION_ID

# Should output: session-YYYYMMDD-HHMMSS-topic
# If empty, session not initialized
```

## Testing Your Setup

```bash
# Run comprehensive test suite
node sessions/session-20251113-211159-hive-mind-setup/iteration-3/artifacts/tests/phase1-foundation.test.js

# Should see:
# ✅ ALL TESTS PASSED - Phase 1 Foundation Complete
```

## CLI Tools

### Session Management
```bash
# Initialize session
node session-auto-init.js "Your first message"

# Check session status
cat sessions/$SESSION_ID/metadata.json
```

### Agent Templates
```bash
# List available templates
node agent-templates.js list

# Generate agent prompt
node agent-templates.js generate coder "Build API"
```

### Learning System
```bash
# View learned patterns
node learning-integration.js patterns

# Generate learning report
node learning-integration.js report

# Maintenance
node learning-integration.js maintain
```

### Hooks
```bash
# Fire hook manually
node always-on-hooks.js decision:made "My decision"

# Enable auto-hooks
node always-on-hooks.js
```

## Memory Store Locations

- **Session metadata:** `sessions/$SESSION_ID/metadata.json`
- **Session summary:** `sessions/$SESSION_ID/session-summary.md`
- **Persistent memory:** `.swarm/memory.db` (SQLite)
- **Learning patterns:** Stored in memory.db under `hive/learning/*`
- **Agent decisions:** Stored in memory.db under `hive/decisions/*`

## Performance Tips

1. **Batch operations** - Fire multiple hooks in parallel when possible
2. **Async hooks** - All hooks are non-blocking, don't await them
3. **Memory queries** - Use indexed keys for faster lookups
4. **Pattern matching** - Keep pattern descriptions concise for better matches
5. **Session cleanup** - Archive old sessions periodically

## Support

**Documentation:**
- Implementation: `phase1-implementation.md`
- Test suite: `phase1-foundation.test.js`
- This guide: `quick-start-guide.md`

**Code Locations:**
- All Phase 1 code: `sessions/session-20251113-211159-hive-mind-setup/iteration-3/artifacts/code/`
- Tests: `sessions/session-20251113-211159-hive-mind-setup/iteration-3/artifacts/tests/`
- Docs: `sessions/session-20251113-211159-hive-mind-setup/iteration-3/artifacts/docs/`

**Stock Dependencies:**
- Claude Flow: `npx claude-flow@alpha`
- Hooks: `npx claude-flow@alpha hooks`
- Memory: `.swarm/memory.db`

---

Remember: The system is designed to be **automatic**. If you're doing manual work, something's wrong. Check the integration guide for proper usage patterns.
