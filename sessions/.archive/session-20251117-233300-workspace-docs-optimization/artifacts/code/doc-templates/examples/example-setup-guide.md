# Setup Guide: Claude Flow Integration

> **Status**: Published
> **Last Updated**: 2025-01-18
> **Verified**: ✅ Examples tested

## Overview

**What you'll set up**: Claude Flow MCP integration for multi-agent orchestration

**Time required**: ~10 minutes

**Prerequisites**:
- [ ] Node.js v18+ installed ([Install Node.js](https://nodejs.org))
- [ ] Claude Desktop app installed
- [ ] Git installed
- [ ] Basic terminal knowledge

**What you'll get**: Ability to spawn and coordinate multiple AI agents for complex tasks

---

## Quick Setup (TL;DR)

For experienced users:

```bash
# Add MCP server
claude mcp add claude-flow npx claude-flow@alpha mcp start

# Verify installation
claude mcp list
# Expected: claude-flow listed with status "running"
```

**Done!** Skip to [Usage Examples](#usage-examples)

---

## Detailed Setup

### Step 1: Installation

**What this does**: Adds Claude Flow as an MCP server to Claude Desktop

```bash
# Add the MCP server
claude mcp add claude-flow npx claude-flow@alpha mcp start
```

**Expected output**:
```
✅ Added MCP server: claude-flow
Starting server...
✅ Server started successfully
```

**Troubleshooting**:
- If you see `command not found: claude` → Claude Desktop not in PATH, use full path or reinstall
- If installation hangs → Check network connection, try again

### Step 2: Verification

**What this does**: Confirms the server is running and accessible

**Check server status**:
```bash
claude mcp list
```

**Expected output**:
```
MCP Servers:
  claude-flow (running)
    Command: npx claude-flow@alpha mcp start
```

**Test server connection**:
```bash
# Restart Claude Desktop
# Open new conversation
# Type: "Use MCP tool to list available agents"
```

**Expected result**: Claude should respond with list of agent types

**If verification fails**:
1. Check server logs: `claude mcp logs claude-flow`
2. Restart MCP: `claude mcp restart claude-flow`
3. Reinstall if needed: `claude mcp remove claude-flow && claude mcp add claude-flow npx claude-flow@alpha mcp start`

### Step 3: Configuration (Optional)

**What this does**: Customizes agent behavior and limits

**Create config file** (optional):
```bash
# Create .claude-flow.json in project root
cat > .claude-flow.json << 'EOF'
{
  "maxAgents": 8,
  "defaultTopology": "mesh",
  "memory": {
    "enabled": true,
    "path": ".swarm/memory.db"
  }
}
EOF
```

**Configuration options**:
- `maxAgents`: [Optional] Maximum concurrent agents (default: 5)
- `defaultTopology`: [Optional] Default swarm pattern (mesh|hierarchical|ring|star)
- `memory.enabled`: [Optional] Enable persistent memory (default: true)
- `memory.path`: [Optional] Memory database location

---

## Usage Examples

### Example 1: Basic Swarm

```bash
# In Claude conversation:
"Initialize a mesh swarm with 3 agents to research, code, and test a feature"
```

**Expected behavior**:
- Claude spawns 3 agents
- Each agent works concurrently
- Results coordinated automatically

### Example 2: Advanced Workflow

```bash
# In Claude conversation:
"Create a hierarchical swarm with:
- 1 coordinator agent
- 2 coder agents
- 1 reviewer agent
Build and review a REST API"
```

**Expected behavior**:
- Coordinator assigns tasks
- Coders work in parallel
- Reviewer checks output
- Results consolidated

---

## Configuration Reference

### Required Settings

None - works with defaults

### Optional Settings

**maxAgents**:
- **Type**: number
- **Default**: 5
- **Purpose**: Limit concurrent agents to prevent resource exhaustion
- **Example**: `8`
- **Validation**: 1-20

**defaultTopology**:
- **Type**: string
- **Default**: "mesh"
- **Purpose**: Default coordination pattern
- **Valid values**: mesh, hierarchical, ring, star
- **Example**: `"hierarchical"`

**memory.enabled**:
- **Type**: boolean
- **Default**: true
- **Purpose**: Enable cross-session memory
- **Example**: `true`

**memory.path**:
- **Type**: string
- **Default**: ".swarm/memory.db"
- **Purpose**: Where to store agent memory
- **Example**: `".swarm/custom-memory.db"`

---

## Troubleshooting

### Installation Issues

**Issue**: `npm ERR! 404 Not Found`

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Try installation again
claude mcp add claude-flow npx claude-flow@alpha mcp start
```

### Configuration Issues

**Issue**: Config file ignored

**Solution**:
1. Verify file name: `.claude-flow.json` (with leading dot)
2. Verify JSON syntax: `cat .claude-flow.json | jq .`
3. Restart Claude Desktop

### Runtime Issues

**Issue**: Agents not spawning

**Solution**:
```bash
# Check server logs
claude mcp logs claude-flow

# Restart server
claude mcp restart claude-flow

# Verify in conversation
"Check swarm status"
```

---

## Next Steps

After setup is complete:

1. **Try basic swarm**: [Multi-Agent Basics](../how-to/multi-agent-basics.md)
2. **Learn coordination**: [Swarm Coordination](../how-to/swarm-coordination.md)
3. **Explore features**: [Feature Reference](../reference/claude-flow-features.md)

---

## Maintenance Notes

**Last verified**: 2025-01-18 by Alice

**Verification steps**:
1. Fresh install in test environment
2. Ran all installation steps
3. Verified all commands work
4. Tested troubleshooting solutions

**Version tested**: claude-flow@2.0.0

**Known issues**: None

---

## Metadata

```yaml
doc_type: setup_guide
category: getting-started
difficulty: beginner
estimated_time: 10min
tags: [setup, installation, mcp, claude-flow]
dependencies: []
validation_status: verified
last_test_date: 2025-01-18
test_environment: "Node v18.x, Claude Desktop v1.2.0"
```
