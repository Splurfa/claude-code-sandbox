# Your First Session

Time to get hands-on! In this guide, you'll create your first session, spawn an agent, and close it properly.

## What You'll Do

1. Start a new session
2. Spawn a single agent to create a simple file
3. Review what was created
4. Close the session properly with HITL approval

**Time**: 20-30 minutes

## Prerequisites

- You've read "What is Claude-Flow?" ✅
- You've completed the "Workspace Tour" ✅
- Your workspace is open in Claude Code ✅

## Step 1: Start a Session

### The Command

In your conversation with Claude Code, type:

```
/session-start my-first-session
```

### What Happens

Claude Code will:
1. Create `sessions/session-YYYYMMDD-HHMMSS-my-first-session/`
2. Create the `artifacts/` subdirectories
3. Generate `metadata.json` to track the session
4. Confirm session is active

### Expected Output

```
✅ Session created: session-20251117-103245-my-first-session

Directory structure:
sessions/session-20251117-103245-my-first-session/
├── artifacts/
│   ├── code/
│   ├── tests/
│   ├── docs/
│   ├── scripts/
│   └── notes/
└── metadata.json

Session is now active. All work will be saved to this session.
```

## Step 2: Spawn Your First Agent

### The Task

Let's create a simple greeting program. Tell Claude Code:

```
Spawn a coder agent to create a simple greeting program that takes a name
and returns "Hello, [name]!". Save to this session's artifacts.
```

### What Happens Behind the Scenes

Claude Code will:
1. Use the Task tool to spawn a coder agent
2. The agent writes the code
3. Hooks automatically fire to track progress
4. File is saved to `sessions/session-YYYYMMDD-HHMMSS-my-first-session/artifacts/code/`

### Expected Agent Execution

The agent will:
- Create `greeting.js` (or similar)
- Implement the greeting function
- Add basic documentation
- Report completion

### Review the Output

Navigate to your session artifacts:

```bash
cd sessions/session-20251117-103245-my-first-session/artifacts/code/
ls
```

You should see:
```
greeting.js
```

Open the file and review what the agent created.

## Step 3: Spawn a Second Agent (Tester)

Now let's add tests. Tell Claude Code:

```
Spawn a tester agent to create tests for the greeting program.
Save to this session's test artifacts.
```

### What Happens

The tester agent will:
1. Read the code from memory or file system
2. Create comprehensive tests
3. Save to `artifacts/tests/`
4. Report test coverage

### Verify the Tests

```bash
cd sessions/session-20251117-103245-my-first-session/artifacts/tests/
ls
```

You should see:
```
greeting.test.js
```

## Step 4: Check Memory Coordination

Let's see what's in shared memory. Tell Claude Code:

```
Show me what's stored in memory for this session
```

### Expected Memory Entries

```javascript
// Session tracking
key: "session/my-first-session/status"
value: "active"

// Agent coordination
key: "swarm/coder/greeting-complete"
value: "true"

key: "swarm/tester/tests-created"
value: "true"

// API contracts (shared between agents)
key: "swarm/shared/greeting-api"
value: "function greet(name: string): string"
```

**What this shows**: Agents coordinated through memory. The tester knew what the coder built because they shared information.

## Step 5: Review Session Metadata

Check the session metadata file:

```bash
cat sessions/session-20251117-103245-my-first-session/metadata.json
```

### Expected Content

```json
{
  "session_id": "session-20251117-103245-my-first-session",
  "created_at": "2025-11-17T10:32:45.000Z",
  "topic": "my-first-session",
  "status": "active",
  "agents_spawned": [
    {
      "type": "coder",
      "task": "create greeting program",
      "status": "completed"
    },
    {
      "type": "tester",
      "task": "create tests",
      "status": "completed"
    }
  ],
  "artifacts": {
    "code": ["greeting.js"],
    "tests": ["greeting.test.js"]
  }
}
```

## Step 6: Close the Session (HITL Approval)

Now let's close the session properly. Tell Claude Code:

```
/session-closeout
```

### What Happens (HITL Workflow)

1. **Pre-Closeout Hook Fires**:
   - Generates session summary
   - Collects metrics
   - Identifies artifacts created

2. **Claude Presents Summary**:
   ```
   Session Summary: my-first-session

   Duration: 15 minutes
   Agents spawned: 2 (coder, tester)
   Artifacts created:
     - code/greeting.js
     - tests/greeting.test.js

   Memory entries: 5

   Recommendation: Archive to .swarm/backups/

   Approve closeout? (yes/no)
   ```

3. **You Approve**:
   ```
   yes
   ```

4. **Post-Closeout Hook Fires**:
   - Archives session to `.swarm/backups/session-20251117-103245-my-first-session.json`
   - Updates session status to "closed"
   - Cleans up temporary coordination memory
   - Preserves learned patterns in ReasoningBank

### Verify Backup Created

```bash
ls -lt .swarm/backups/ | head -3
```

You should see:
```
session-20251117-103245-my-first-session.json
```

## What You Just Learned

✅ **Session lifecycle**: Start → Work → Close with HITL approval
✅ **Agent spawning**: Using Task tool to create specialized agents
✅ **File routing**: Artifacts go to `sessions/*/artifacts/` subdirectories
✅ **Memory coordination**: Agents share information through memory.db
✅ **Hooks automation**: Pre/post hooks fire automatically
✅ **Backup system**: Sessions are archived on closeout

## Common Questions

**Q: What if I forget to close a session?**
A: The session stays active. You can close it later with `/session-closeout`. Open sessions don't break anything, but proper closeout ensures backups and learning.

**Q: Can I reopen a closed session?**
A: No, sessions are immutable once closed. Start a new session and reference the old one if needed.

**Q: What happens if an agent fails?**
A: The agent reports the error. You can retry or spawn a different agent. Sessions are isolated, so failures don't corrupt other work.

**Q: How do I see all my sessions?**
A: `ls -lt sessions/` shows all sessions chronologically.

## Try This Challenge

**Create a calculator session** (30 minutes):

1. Start session: `/session-start calculator`
2. Spawn coder to create add/subtract/multiply/divide functions
3. Spawn tester to create comprehensive tests
4. Spawn reviewer to check code quality
5. Review all artifacts
6. Close session with HITL approval

**Success criteria**:
- All three agents complete successfully
- All artifacts in correct directories
- Session closes with backup created

## Troubleshooting

**"Session directory not created"**
→ Check that you used `/session-start <topic>` exactly

**"Agent didn't save to correct location"**
→ Verify you specified "save to this session's artifacts" in your instruction

**"Memory is empty"**
→ Agents might not have stored anything. Try explicit memory operations in Phase 2: Essential Skills.

**"Closeout doesn't show summary"**
→ Check that hooks are enabled in `.claude/hooks/`

## Next Step

You've successfully completed your first session! Now let's dive into how memory works.

→ **Next**: [Basic Memory Usage](basic-memory-usage.md)

---

**Pro tip**: Keep your first session artifacts. You'll reference them as examples later.
