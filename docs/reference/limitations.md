# Current Limitations

**Status**: Updated 2025-11-18
**Purpose**: Honest documentation of what doesn't work yet, needs verification, or has known issues

This document reflects the current state of the workspace. Features marked **✅ Verified** have been tested. Features marked **⚠️ Needs Verification** are documented but haven't been independently validated. Features marked **❌ Not Working** have known issues.

---

## Performance Claims

### Claimed Metrics (⚠️ Needs Verification)

The following performance metrics appear in CLAUDE.md but **have not been independently verified in this workspace**:

- **84.8% SWE-Bench solve rate** - Source: claude-flow upstream documentation
- **32.3% token reduction** - Source: claude-flow upstream documentation
- **2.8-4.4x speed improvement** - Source: claude-flow upstream documentation
- **150x faster search** (AgentDB HNSW) - Source: AgentDB documentation

**Status**: These are **upstream claims from claude-flow and AgentDB projects**, not verified in this specific workspace implementation.

**What We Know Works**:
- ✅ Parallel agent execution via Claude Code's Task tool
- ✅ Session-based isolation (prevents cross-contamination)
- ✅ Memory persistence across sessions (via `.swarm/memory.db`)
- ✅ Hook cascades for coordination (98% stock adherence)

**Verification Needed**:
- [ ] Benchmark actual token usage in representative tasks
- [ ] Measure agent spawning performance (sequential vs parallel)
- [ ] Test AgentDB search speed with realistic datasets
- [ ] Compare solve rates on specific problem sets

**Workaround**: Focus on workflow efficiency (parallel execution, memory reuse) rather than specific performance numbers until verification is complete.

---

## Auto-Features

### Auto-Spawn Agents (⚠️ Experimental)

**Claim**: "Smart Auto-Spawning" mentioned in CLAUDE.md Advanced Features

**Reality**:
- ✅ **Manual agent spawning works perfectly** via Task tool
- ⚠️ **Auto-spawning feature status unclear** - no implementation found in workspace
- ❌ **No documented trigger mechanism** for automatic agent creation

**Current Best Practice**:
```javascript
// WORKS: Manual agent spawning in single message
Task("Research agent", "Analyze requirements...", "researcher")
Task("Coder agent", "Implement features...", "coder")
Task("Tester agent", "Create tests...", "tester")
```

**Not Yet Available**:
```javascript
// NOT VERIFIED: Auto-detection and spawning based on task complexity
// Would theoretically analyze task description and spawn appropriate agents
// No evidence of implementation in workspace
```

**Workaround**: Manually specify all agents you need. This gives you explicit control and is the verified working pattern.

---

### Auto-Topology Selection (⚠️ Experimental)

**Claim**: "Automatic Topology Selection" in CLAUDE.md Advanced Features

**Reality**:
- ✅ **Manual topology selection works** via `swarm_init({ topology: "mesh" })`
- ⚠️ **Auto-selection status unclear** - no implementation evidence
- 📚 **Available topologies documented**: mesh, hierarchical, ring, star

**Verified Pattern**:
```javascript
// WORKS: Explicit topology choice
mcp__claude-flow__swarm_init({ topology: "mesh", maxAgents: 6 })
```

**Status Unknown**:
```javascript
// NOT VERIFIED: System choosing topology based on task analysis
// Would theoretically select mesh for research, hierarchical for execution
// No evidence of auto-selection logic in workspace
```

**Workaround**: Choose topology based on task characteristics:
- **mesh** - Research, exploration (peer-to-peer coordination)
- **hierarchical** - Complex builds (coordinator delegates to specialists)
- **ring** - Sequential workflows (pass-the-baton pattern)
- **star** - Simple tasks (single coordinator, multiple workers)

---

### Self-Healing Workflows (⚠️ Experimental)

**Claim**: "Self-Healing Workflows" in CLAUDE.md Advanced Features

**Reality**:
- ✅ **Hooks fire on errors** (can log failures)
- ✅ **Manual error recovery works** (user intervention)
- ❌ **No automated retry mechanism found**
- ❌ **No automatic agent replacement on failure**

**What Actually Happens**:
1. Agent fails during execution
2. Hooks log the failure to `.swarm/memory.db`
3. **Manual intervention required** to restart or reassign task

**Not Yet Available**:
- Automatic task retry with exponential backoff
- Automatic agent replacement when one fails
- Automatic workflow reconfiguration on persistent failures

**Workaround**:
- Monitor agent execution via hooks and memory logs
- Manually spawn replacement agents if failures occur
- Use `task_status` MCP tool to check progress
- Implement retry logic in your own task orchestration

---

## Integration Features

### Hooks Auto-Fire (✅ Verified with Limitations)

**Status**: **Works for Write/Edit/MultiEdit tools only**

**What Works**:
```json
// Auto-fires before/after Write, Edit, MultiEdit
{
  "hooks": {
    "PreToolUse": [{ "matcher": "Write|Edit|MultiEdit", "hooks": [...] }],
    "PostToolUse": [{ "matcher": "Write|Edit|MultiEdit", "hooks": [...] }]
  }
}
```

**Limitations**:
- ❌ **Does not auto-fire for Bash commands** (manual hook calls required)
- ❌ **Does not auto-fire for Read operations** (read-only, no hooks needed)
- ❌ **Does not auto-fire for agent spawning** (agents must call hooks manually)

**Workaround for Agent Coordination**:
Agents must manually call hooks:
```bash
# Before work
npx claude-flow@alpha hooks pre-task --description "task" --task-id "id"

# During work
npx claude-flow@alpha hooks post-edit --file "path"

# After work
npx claude-flow@alpha hooks post-task --task-id "id"
```

---

### Deprecated: auto-hooks.js (❌ Removed)

**Previous Status**: Violated stock-first principle via filesystem monkey-patching

**Migration Complete**: All hooks now use Claude Code's native hook system (98% stock adherence)

**Old Pattern (DO NOT USE)**:
```javascript
// ❌ FORBIDDEN: Monkey-patches filesystem
const fs = require('fs');
fs.writeFileSync = function() { /* interception */ }
```

**New Pattern (REQUIRED)**:
```json
// ✅ Stock cascade via Claude Code hooks
{ "hooks": { "PostToolUse": [{ "command": "npx claude-flow@alpha hooks..." }] } }
```

**Impact**: No functional loss - all capabilities preserved via stock tooling

---

## Agent Capabilities

### Consensus Mechanisms (⚠️ Experimental)

**Available Agents**: `byzantine-coordinator`, `raft-manager`, `gossip-coordinator`, `consensus-builder`

**Reality**:
- ✅ **Agents are defined** in agent registry
- ⚠️ **Consensus protocols not independently tested**
- ❓ **Use cases unclear** (when to use Byzantine vs Raft vs Gossip)

**What We Know**:
- Agents can be spawned via Task tool
- Coordination happens through hooks and memory
- No documented examples of multi-agent consensus in action

**Verification Needed**:
- [ ] Test Byzantine fault tolerance with agent failures
- [ ] Verify Raft leader election in hierarchical topologies
- [ ] Validate gossip protocol for memory synchronization
- [ ] Document when to use each consensus mechanism

**Workaround**: For multi-agent coordination, rely on verified patterns:
- Memory-based coordination (store/retrieve decisions)
- Hook-based notification (notify other agents of progress)
- Manual coordination through user oversight

---

### Neural Training & Patterns (⚠️ Limited Testing)

**Available Features**:
- `neural_train` - Train patterns from successful workflows
- `neural_patterns` - Recognize cognitive patterns
- 27+ neural models (claimed)

**Reality**:
- ✅ **MCP tools exist** and can be called
- ⚠️ **Training effectiveness unverified**
- ❌ **No documented training workflows**
- ❓ **Pattern recognition accuracy unknown**

**What Works**:
```javascript
// Can call training
mcp__claude-flow__neural_train({
  pattern_type: "coordination",
  training_data: "data",
  epochs: 50
})
```

**Unknown/Unverified**:
- How much training data is needed for useful patterns
- How to validate pattern quality
- When patterns actually improve coordination
- Persistence of trained patterns across sessions

**Workaround**:
- Document successful workflows manually in Captain's Log
- Use memory to store proven coordination patterns
- Rely on explicit agent instructions rather than learned patterns

---

### GitHub Integration (⚠️ Partial Implementation)

**Available Agents**: `pr-manager`, `code-review-swarm`, `issue-tracker`, `release-manager`, `workflow-automation`

**Available MCP Tools**: `github_repo_analyze`, `github_pr_manage` (via flow-nexus)

**Limitations**:
- ⚠️ **Requires authentication** (flow-nexus registration)
- ⚠️ **Cloud dependency** (not fully local)
- ❌ **No documented examples** in workspace
- ❓ **Coverage of GitHub API unclear**

**Verified Alternative**:
```bash
# Stock gh CLI works perfectly for GitHub operations
gh pr create --title "Title" --body "Body"
gh pr review 123 --approve
gh issue create --title "Issue" --label "bug"
```

**Workaround**: Use `gh` CLI via Bash tool for GitHub operations until MCP integration is verified.

---

## Session Management

### Session Closeout (✅ Works with HITL Approval)

**Status**: Fully functional via `/session-closeout` command

**What Works**:
- ✅ Generates session summary
- ✅ Exports metrics to `.swarm/backups/`
- ✅ Requires human approval before archival
- ✅ Creates Captain's Log entry

**Known Limitation**:
- **Requires manual invocation** - sessions don't auto-close when chat ends
- **HITL approval required** - cannot archive without user confirmation

**Not Auto-Detected**:
```javascript
// ❌ Sessions don't auto-close on conversation end
// User must explicitly run /session-closeout
```

**Workaround**: End sessions explicitly:
```bash
# When ready to close session
/session-closeout
# Review summary, approve archival
```

---

### Session Scope Violations (⚠️ Common Error)

**Rule**: ONE SESSION = ONE CHAT THREAD

**Reality**: Easy to violate accidentally

**Common Violations**:
1. **Creating sub-sessions within a session** (incorrect nesting)
2. **Starting new session mid-chat** (should continue current session)
3. **Spawning agents that create their own sessions** (should use current session)

**Correct Pattern**:
```
Chat starts → Auto-create session-YYYYMMDD-HHMMSS-topic/
All work → sessions/$SESSION_ID/artifacts/
Chat ends → /session-closeout
```

**Incorrect Pattern**:
```
Chat starts → session-A created
Mid-chat → session-B created (WRONG - continue in session-A)
Agent spawned → creates session-C (WRONG - use session-A path)
```

**Workaround**: Always reference current `$SESSION_ID` in agent instructions:
```javascript
Task("Agent", "Work on task. Save to sessions/$SESSION_ID/artifacts/code/.", "type")
```

---

## File Routing

### Root Directory Protection (✅ Enforced)

**Rule**: NEVER save working files to root `docs/`, `tests/`, `scripts/`

**Reality**:
- ✅ **Rule is clear** in CLAUDE.md
- ⚠️ **Easy to violate accidentally** (old habits)
- ✅ **Session artifacts provide clear alternative**

**Protected Directories**:
```
❌ docs/          - Only edit existing docs, never create new
❌ tests/         - Reserved for project-level tests
❌ scripts/       - Reserved for project-level scripts
❌ / (root)       - No working files at all
```

**Correct Locations**:
```
✅ sessions/$SESSION_ID/artifacts/docs/    - Session documentation
✅ sessions/$SESSION_ID/artifacts/tests/   - Session tests
✅ sessions/$SESSION_ID/artifacts/code/    - Session source code
✅ sessions/$SESSION_ID/artifacts/scripts/ - Session scripts
```

**Why This Matters**:
- Prevents workspace pollution
- Enables clean session archival
- Maintains project/session separation

**Workaround**: Always use absolute paths to session artifacts in all file operations.

---

## Memory & Coordination

### Cross-Session Memory (✅ Works)

**Status**: Fully functional via `.swarm/memory.db`

**What Works**:
```javascript
// Store data
mcp__claude-flow_alpha__memory_usage({
  action: "store",
  key: "decision/architecture",
  value: "Use REST API",
  namespace: "default"
})

// Retrieve later (even in different session)
mcp__claude-flow_alpha__memory_usage({
  action: "retrieve",
  key: "decision/architecture",
  namespace: "default"
})
```

**Limitations**:
- ❌ **No automatic memory cleanup** (grows unbounded)
- ❌ **No TTL support** (data persists forever)
- ⚠️ **Namespace collision possible** (manual management required)
- ❌ **No built-in search** (must know exact key or use SQL)

**Workaround for Search**:
```bash
# Direct SQLite query for pattern search
sqlite3 .swarm/memory.db "SELECT key, value FROM memory_entries WHERE key LIKE 'decision/%'"
```

**Workaround for Cleanup**:
```bash
# Manual cleanup of old entries
sqlite3 .swarm/memory.db "DELETE FROM memory_entries WHERE created_at < date('now', '-90 days')"
```

---

### Captain's Log (✅ Works)

**Status**: Fully functional via `journal.sh` hook

**What Works**:
- ✅ Auto-creates daily log files in `sessions/captains-log/YYYY-MM-DD.md`
- ✅ Stores entries in memory.db for cross-session access
- ✅ Timestamped entries with categories

**Limitations**:
- ❌ **No built-in search UI** (must grep or use sqlite3)
- ❌ **No automatic summarization** (manual review required)
- ⚠️ **Grows unbounded** (no auto-archival)

**Workaround for Search**:
```bash
# Search recent entries
grep -r "authentication" sessions/captains-log/

# Search by date range
sqlite3 .swarm/memory.db "SELECT * FROM memory_entries WHERE namespace='journal' AND date(created_at) BETWEEN '2025-11-01' AND '2025-11-18'"
```

---

## Flow-Nexus MCP Features

### Cloud-Based Features (⚠️ Requires Registration)

**Available**: 70+ MCP tools for advanced orchestration

**Limitations**:
- ⚠️ **Requires user account** (not anonymous)
- ⚠️ **Cloud dependency** (not fully local)
- ⚠️ **Cost implications** (not all features free)
- ❌ **Not tested in this workspace**

**What Requires Flow-Nexus**:
- Sandbox execution (`sandbox_create`, `sandbox_execute`)
- Neural training at scale (`neural_train` with cloud GPUs)
- Real-time monitoring (`execution_stream_subscribe`)
- Cloud storage (`storage_upload`, `storage_list`)
- Queen Seraphina chat (`seraphina_chat`)

**What Works Locally** (Stock Claude-Flow):
- Agent spawning and coordination
- Memory management
- Basic neural patterns
- GitHub integration (via gh CLI)
- Session management
- Hook system

**Workaround**: Use stock claude-flow features for local development. Add flow-nexus only when cloud features are explicitly needed.

---

## Documentation Quality

### Known Documentation Issues

**Outdated Content**:
- ⚠️ Some guides reference deprecated `auto-hooks.js` (migration guide available)
- ⚠️ Performance claims not verified in workspace context
- ⚠️ Some tutorials created sequentially (marked CAUTIONARY)

**Missing Documentation**:
- ❌ No step-by-step guide for consensus mechanisms
- ❌ No neural training workflow examples
- ❌ No GitHub integration tutorials (MCP-based)
- ❌ No flow-nexus registration guide

**Documentation Cleanup in Progress**:
- 📋 Synthesis recommendation proposes 75% reduction (49→12 docs)
- 📋 Focus on verified features only
- 📋 Honest "reality/" folder for current state
- 📋 Evidence-based content standards

**Current Reliable Docs**:
- ✅ CLAUDE.md (569 lines, loaded on every agent spawn)
- ✅ inbox/README.md (cross-session communication)
- ✅ sessions/README.md (session management)
- ✅ .claude/hooks/README.md (hook system architecture)

---

## Roadmap & Future Work

### Planned Improvements

**Performance Verification** (Priority: High):
- [ ] Benchmark token usage in representative tasks
- [ ] Measure parallel vs sequential agent execution
- [ ] Test AgentDB search performance
- [ ] Document baseline metrics for comparison

**Feature Validation** (Priority: High):
- [ ] Test consensus mechanisms with real failures
- [ ] Validate neural training workflows
- [ ] Document GitHub integration patterns
- [ ] Create working examples for all agent types

**Documentation Rebuild** (Priority: High):
- [ ] Reduce docs from 49 to 12 (75% reduction)
- [ ] Verify all commands in docs execute successfully
- [ ] Add evidence levels to all claims
- [ ] Create "reality/" folder with honest assessments

**Auto-Features** (Priority: Medium):
- [ ] Implement or document auto-topology selection
- [ ] Implement or document auto-spawning mechanism
- [ ] Implement or document self-healing workflows
- [ ] Clarify which features are aspirational vs working

**Memory Improvements** (Priority: Medium):
- [ ] Add TTL support for memory entries
- [ ] Implement memory cleanup utilities
- [ ] Build search UI for Captain's Log
- [ ] Add memory visualization tools

### Known Issues

**Open Issues**:
1. **Memory grows unbounded** - No automatic cleanup
2. **Session scope violations common** - Easy to nest incorrectly
3. **Performance claims unverified** - Need independent testing
4. **Auto-features unclear** - Status unknown (experimental/working/aspirational)
5. **Consensus mechanisms untested** - Byzantine/Raft/Gossip need validation

**Workarounds Available**: Yes, documented in sections above

**Blocking Issues**: None - all core workflows functional with workarounds

---

## Getting Help

**For Issues with Verified Features**:
1. Check CLAUDE.md for correct usage patterns
2. Review hook system in `.claude/hooks/README.md`
3. Search Captain's Log for similar issues
4. Check `.swarm/memory.db` for coordination state

**For Experimental Features**:
1. Expect limited documentation
2. Test thoroughly before production use
3. Document findings in Captain's Log
4. Consider using verified alternatives

**For Performance Questions**:
1. Don't rely on upstream claims
2. Benchmark your specific use case
3. Focus on workflow efficiency over raw speed
4. Document actual measurements

**Reporting Issues**:
- Captain's Log: `sessions/captains-log/YYYY-MM-DD.md`
- Session artifacts: `sessions/$SESSION_ID/artifacts/notes/`
- Memory storage: `.swarm/memory.db` (persistent across sessions)

---

## Summary

**What Definitely Works** ✅:
- Parallel agent execution via Task tool
- Session-based file organization
- Memory persistence across sessions
- Hook cascades for coordination (98% stock)
- Manual topology selection
- Manual agent spawning
- Captain's Log journaling

**What Needs Verification** ⚠️:
- Performance claims (84.8% SWE-Bench, 32.3% tokens, 2.8-4.4x speed)
- Auto-topology selection
- Auto-spawning agents
- Self-healing workflows
- Consensus mechanisms (Byzantine, Raft, Gossip)
- Neural training effectiveness
- GitHub MCP integration

**What Doesn't Work Yet** ❌:
- Auto-hooks.js (deprecated, migrated to stock)
- Automatic memory cleanup
- Automatic session closeout
- Hook auto-fire for Bash commands
- Built-in memory search UI

**Overall Assessment**:
This workspace provides a **solid foundation for multi-agent coordination** with **verified core features**. Advanced features (auto-topology, consensus, neural training) are available but **require independent validation** before production use. All core workflows have **working alternatives** when experimental features are unclear.

**Recommendation**: Start with verified features, add experimental features incrementally with testing, and document your findings in Captain's Log for future reference.

---

**Last Updated**: 2025-11-18
**Verified By**: Limitations Writer Agent (session-20251118-011159-docs-rebuild)
**Next Review**: After performance benchmarking completion
