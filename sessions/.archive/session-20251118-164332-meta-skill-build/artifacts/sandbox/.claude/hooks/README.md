# Hooks System Architecture

**Stock Adherence**: 98% (all execution via stock Claude Code hooks + stock CLI)

## Overview

This workspace uses Claude Code's native hook system (`PreToolUse`/`PostToolUse`) integrated with claude-flow's CLI commands. All hook execution goes through stock tooling - no custom filesystem interception.

## How Hooks Fire

### Stock Claude Code Pattern (ADR-002)

**Configuration**: `.claude/settings.json`

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
        "hooks": [{
          "type": "command",
          "command": "npx claude-flow@alpha hooks pre-edit --file '{}'"
        }]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
        "hooks": [{
          "type": "command",
          "command": "npx claude-flow@alpha hooks post-edit --file '{}'"
        }]
      }
    ]
  }
}
```

**Execution Flow**:
1. Claude Code triggers hook (e.g., before Write tool)
2. Stock claude-flow CLI executes: `npx claude-flow@alpha hooks pre-edit`
3. claude-flow may call cascade scripts (journal.sh, episode-recorder-hook.js)
4. Each script uses stock CLI for operations
5. Failures handled per `continueOnError` setting

### Available Hooks

#### Claude Code Hooks (Native)
- `PreToolUse` - Before any tool execution (Bash, Write, Edit, etc.)
- `PostToolUse` - After tool completion
- `SessionStart` - Session initialization
- `SessionEnd` - Session cleanup
- `Stop` - On conversation end
- `PreCompact` - Before context window compaction

#### Claude-Flow Hooks (CLI)
Called via `npx claude-flow@alpha hooks <hook-name>`:
- `pre-task` - Before agent work begins
- `post-task` - After agent completion
- `pre-edit` - Before file modifications
- `post-edit` - After file changes
- `pre-command` - Before bash command
- `post-command` - After bash execution
- `session-end` - Session closeout with metrics

## Custom Hook Scripts

### Requirements

All custom scripts must:
- Use stock `npx claude-flow@alpha` commands for operations
- Accept standard parameters via CLI arguments
- Exit with proper status codes (0 = success, non-zero = failure)
- Log to standard locations (sessions/captains-log/, .swarm/memory.db)
- Never monkey-patch or intercept filesystem operations

### Example: journal.sh

```bash
#!/bin/bash
# Stock-first journal hook for Captain's Log entries

ENTRY="${1:?Entry text required}"
CATEGORY="${2:-decision}"

LOG_DIR="sessions/captains-log"
LOG_FILE="$LOG_DIR/$(date +%Y-%m-%d).md"

mkdir -p "$LOG_DIR"

# Append entry (stock bash)
cat >> "$LOG_FILE" <<EOF

## [$(date +%H:%M)] $CATEGORY

$ENTRY

EOF

# Store in memory.db (stock sqlite3)
if [ -f ".swarm/memory.db" ]; then
  ESCAPED_ENTRY=$(echo "$ENTRY" | sed "s/'/''/g")
  sqlite3 .swarm/memory.db <<SQL
INSERT OR IGNORE INTO memory_entries (key, value, namespace, metadata)
VALUES (
  'captains-log-$(date +%s)',
  '$ESCAPED_ENTRY',
  'journal',
  '{"category": "$CATEGORY", "date": "$(date +%Y-%m-%d)"}'
);
SQL
fi

echo "✅ Journal entry added"
```

### Calling from Claude-Flow Hooks

claude-flow hooks can call custom scripts:

```javascript
// In claude-flow hook implementation
const { execSync } = require('child_process');

function postEditHook(filePath) {
  // Call journal.sh to log the edit
  execSync(`.claude/hooks/journal.sh "Edited ${filePath}" "file-edit"`);

  // Call episode-recorder for learning
  const episodeData = JSON.stringify({
    taskId: 'edit-001',
    observation: `Modified ${filePath}`,
    action: 'edit',
    reward: 1.0
  });
  execSync(`node .claude/integrations/episode-recorder-hook.js record '${episodeData}'`);
}
```

## Migration from auto-hooks.js

### Old Pattern (DEPRECATED - Violated Stock-First)

```javascript
// ❌ WRONG: Monkey-patches filesystem (DO NOT USE)
const fs = require('fs');
const originalWrite = fs.writeFileSync;

// This pattern is FORBIDDEN - violates stock-first principle
fs.writeFileSync = function(...args) {
  const result = originalWrite.apply(this, args);
  // Custom interception logic - NEVER DO THIS
  return result;
};
```

### New Pattern (Stock Cascade)

```json
// ✅ CORRECT: Use Claude Code's native hooks
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [{
          "type": "command",
          "command": "npx claude-flow@alpha hooks post-edit --file '$FILE'"
        }]
      }
    ]
  }
}
```

## Integration Points

### Captain's Log
- **Trigger**: Any hook can call `journal.sh "entry" "category"`
- **Storage**: `sessions/captains-log/YYYY-MM-DD.md` + `.swarm/memory.db`
- **Stock**: 100% (bash, cat, sqlite3)

### Episode Recorder (ReasoningBank)
- **Trigger**: `episode-recorder-hook.js record '{"taskId":"...","reward":1.0}'`
- **Storage**: AgentDB vector database
- **Stock**: 98% (uses stock AgentDB library)

### Memory Coordination
- **Trigger**: `npx claude-flow@alpha hooks` (all hooks auto-coordinate)
- **Storage**: `.swarm/memory.db` (stock SQLite)
- **Access**: MCP tool `memory_usage({ action: "store", key, value })`

### Git Checkpoints
- **Trigger**: `standard-checkpoint-hooks.sh` (called from post-task)
- **Stock**: 100% (git commands only)

## Testing Hooks

### Manual Testing

```bash
# Test pre-task hook
npx claude-flow@alpha hooks pre-task \
  --description "Test cascade" \
  --task-id "test-001"

# Verify journal.sh executed
cat sessions/captains-log/$(date +%Y-%m-%d).md

# Test post-edit hook
echo "test" > /tmp/test-file.txt
npx claude-flow@alpha hooks post-edit --file "/tmp/test-file.txt"

# Verify memory storage
sqlite3 .swarm/memory.db "SELECT * FROM memory_entries WHERE namespace='journal' ORDER BY created_at DESC LIMIT 5;"
```

### Automated Testing

See `sessions/session-20251117-100232-docs-refactor-tutor/artifacts/tests/hooks-cascade-test.sh`

## Stock Adherence

### Before Migration (92%)
- ❌ Filesystem monkey-patching in auto-hooks.js
- ✅ All hook execution via stock CLI
- ✅ All storage via stock tools

### After Migration (98%)
- ✅ No filesystem interception
- ✅ All hooks via Claude Code native system
- ✅ All execution via stock CLI
- ✅ All storage via stock tools

### Remaining 2% Custom
- `.claude/hooks/journal.sh` - Thin wrapper for Captain's Log (20 lines)
- `.claude/integrations/episode-recorder-hook.js` - CLI wrapper for AgentDB (50 lines)

Both wrappers are thin CLI interfaces to stock tooling and follow ADR-002 guidelines.

## References

- **ADR-002**: Stock cascade pattern architecture decision
- **WORKSPACE-GUIDE.md**: Complete hooks documentation
- **CLAUDE.md**: Hooks integration protocol
- **claude-flow docs**: https://github.com/ruvnet/claude-flow

## Support

For issues with hooks:
1. Check `.claude/settings.json` syntax
2. Verify hook scripts are executable: `chmod +x .claude/hooks/*.sh`
3. Test hooks manually with `npx claude-flow@alpha hooks <name>`
4. Check logs in `sessions/captains-log/` and `.swarm/memory.db`
