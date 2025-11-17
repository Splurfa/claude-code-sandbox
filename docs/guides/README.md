# Claude Flow Documentation

**Last Updated**: 2025-11-16
**Source**: session-20251115-210537-claude-flow-integration-testing
**Test Status**: ✅ 100% pass rate

---

## What Belongs in docs/guides/

**Audience**: End users and developers USING the system

This directory contains:
- ✅ **User-facing guides** explaining how features work
- ✅ **Feature explanations** for understanding concepts
- ✅ **How-to documentation** for accomplishing tasks
- ✅ **Reference materials** (checklists, quick lookups)
- ✅ **Troubleshooting guides** for fixing issues

**NOT for:**
- ❌ Architectural analysis or system design investigations
- ❌ Integration research or technical deep-dives
- ❌ "Working on the system" development documentation

**For system development work**, use: `inbox/assistant/` (organized by topic/date)

**For session-specific docs**, use: `sessions/$SESSION_ID/artifacts/docs/`

---

## 📁 Documentation Structure

This documentation follows the [Divio documentation system](https://documentation.divio.com/) for clarity and ease of navigation:

```
docs/guides/
├── getting-started/    ← Tutorials for beginners
├── how-to/            ← Step-by-step task guides
├── reference/         ← Quick references & checklists
├── troubleshooting/   ← Problem solving & debugging
├── concepts/          ← Explanations & architecture
└── advanced/          ← Advanced topics & optimization
```

---

## 🚀 Getting Started

### New to Claude Flow?

**Start here:**
1. Read [CLAUDE.md](../../CLAUDE.md) - Main workspace configuration
2. Check [how-to/integration-testing-guide.md](how-to/integration-testing-guide.md) - Test your setup
3. Use [reference/feature-verification-checklist.md](reference/feature-verification-checklist.md) - Verify all features work

### Quick Health Check

```bash
# Verify MCP servers
claude mcp list

# Test hooks
npx claude-flow@alpha hooks pre-task --description "Test" --task-id "test"

# Check memory
# Use: mcp__claude-flow_alpha__memory_usage({ action: "list", namespace: "default" })
```

---

## 📚 Available Guides

### Concepts (Understanding-Oriented)

Explanations and architecture for understanding the system:

#### [Hive-Mind System Overview](concepts/hive-mind-system.md)
**200+ lines** | Complete explanation of Claude Flow's advanced multi-agent orchestration

**Covers:**
- Queen-led hierarchy (3 queen types)
- Worker specializations (5 core types)
- Consensus mechanisms (majority, weighted, Byzantine)
- Collective memory architecture
- Performance characteristics

**Use when:**
- Learning about advanced coordination features
- Understanding when to use hive-mind
- Choosing appropriate queen types
- Understanding consensus mechanisms

---

### How-To Guides (Task-Oriented)

Step-by-step instructions for specific tasks:

#### [Integration Testing Guide](how-to/integration-testing-guide.md)
**800+ lines** | Complete procedures for testing all claude-flow integrations

**Covers:**
- MCP server connection testing
- Hook system verification (all 7 types)
- Memory operations (store/retrieve/list/search)
- Agent spawning validation
- Session management verification
- Concurrent execution testing

**Use when:**
- Setting up new workspace
- Verifying integrations after updates
- Onboarding new team members
- Debugging integration issues

#### [Choose Coordination Approach](how-to/choose-coordination-approach.md)
**400+ lines** | Decision framework for when to use hive-mind vs simpler coordination

**Covers:**
- Decision tree (when YES, when NO, when MAYBE)
- Problem-to-queen-type mapping
- Complexity assessment scoring
- Quick decision checklist
- 30-second assessment guide

**Use when:**
- Deciding whether to use hive-mind
- Choosing appropriate queen type
- Selecting consensus mechanism
- Assessing task complexity

#### [Zero-Risk Execution Pattern](how-to/zero-risk-execution-pattern.md)
**300+ lines** | Safe execution strategy with checkpoints and rollback procedures

**Covers:**
- Pre-flight checks and workspace verification
- Phase-by-phase execution (0: Init, 1: Analysis, 2: Design)
- HITL approval gates
- Circuit breakers and safeguards
- Rollback procedures (4 levels)
- Emergency procedures

**Use when:**
- Executing hive-mind operations safely
- Need explicit checkpoints
- Want rollback capability
- Ensuring zero unexpected changes

---

### Reference Guides (Information-Oriented)

Quick lookups and checklists:

#### [Hive-Mind Quick Reference](reference/hive-mind-quick-reference.md)
**100+ lines** | Fast command and concept lookups for hive-mind system

**Covers:**
- Core commands and invocation
- Queen type quick reference
- Consensus algorithm reference
- Configuration examples
- Performance characteristics
- Quick decision tree

**Use when:**
- Need quick command syntax
- Looking up queen capabilities
- Checking consensus thresholds
- Fast reference during execution

#### [Hive-Mind Capability Mapping](reference/hive-mind-capability-mapping.md)
**500+ lines** | Problem-to-solution mapping for hive-mind coordination

**Covers:**
- Problem categories (architectural, adaptive, multi-agent, research)
- Worker specialization matching
- Complexity assessment formulas
- Integration patterns
- Risk mitigation strategies

**Use when:**
- Mapping specific problems to hive-mind solutions
- Understanding worker specializations
- Calculating complexity scores
- Planning risk mitigation

#### [Feature Verification Checklist](reference/feature-verification-checklist.md)
**500+ lines** | Comprehensive checklist for all claude-flow features

**Includes:**
- MCP server connection checks
- Hook system tests with expected outputs
- Memory operation verification
- Agent spawning tests
- Session management checks
- Concurrent execution patterns
- Automated test script references

**Use when:**
- Quick health check needed
- After configuration changes
- Before starting important work
- Diagnosing integration problems

---

### Troubleshooting Guides (Problem-Oriented)

Solutions to common problems:

#### [Troubleshooting Guide](troubleshooting/troubleshooting-guide.md)
**600+ lines** | Diagnose and fix common claude-flow issues

**Covers:**
- MCP server connection problems
- Hook system failures
- Memory operation errors
- Agent spawning issues
- Session management errors
- Performance problems
- Emergency fixes & recovery
- Common error messages reference

**Use when:**
- Something isn't working
- Error messages appear
- Performance degradation
- Integration failures detected

---

## 🎯 Common Tasks

### Daily Health Check
```bash
# 1. MCP servers running
claude mcp list

# 2. Hooks functioning
npx claude-flow@alpha hooks pre-task --description "Test" --task-id "test"

# 3. Memory working
# Use MCP tool: mcp__claude-flow_alpha__memory_usage
```

See: [reference/feature-verification-checklist.md](reference/feature-verification-checklist.md)

### Testing After Setup
1. Read [how-to/integration-testing-guide.md](how-to/integration-testing-guide.md)
2. Run automated test scripts
3. Verify all components pass

### Fixing Problems
1. Check [troubleshooting/troubleshooting-guide.md](troubleshooting/troubleshooting-guide.md)
2. Search for your error message
3. Follow solution steps
4. Run verification checklist

---

## 💡 Key Insights

### Critical Finding ⚠️

**Memory operations use MCP tools, NOT hooks:**

```javascript
// ✅ CORRECT
mcp__claude-flow_alpha__memory_usage({
  action: "store|retrieve|list|search",
  key: "my/key",
  value: "my value",
  namespace: "namespace"
})

// ❌ WRONG (command doesn't exist)
npx claude-flow@alpha hooks memory --action store
```

See: [troubleshooting/troubleshooting-guide.md](troubleshooting/troubleshooting-guide.md#memory-operation-failures)

---

## 📊 Verification Status

**Last Tested**: 2025-11-16
**Pass Rate**: 100% (all components operational)

| Component | Status | Performance |
|-----------|--------|-------------|
| MCP Servers | ✅ | 3 servers connected |
| Hook System | ✅ | 7 types, <3.83s max |
| Memory Ops | ✅ | <150ms average |
| Agent Spawning | ✅ | 2-3s per agent |
| Sessions | ✅ | Proper isolation |
| Concurrency | ✅ | 2.8-4.4× speedup |

See: [reference/feature-verification-checklist.md](reference/feature-verification-checklist.md) for detailed checks

---

## 🔗 Quick Links

**Core Documentation:**
- [CLAUDE.md](../../CLAUDE.md) - Workspace configuration
- [WORKSPACE-GUIDE.md](../../WORKSPACE-GUIDE.md) - Session management
- [WORKSPACE-ARCHITECTURE.md](../../WORKSPACE-ARCHITECTURE.md) - Architecture overview

**Integration Guides:**
- [How to test integrations](how-to/integration-testing-guide.md)
- [Verification checklist](reference/feature-verification-checklist.md)
- [Fix problems](troubleshooting/troubleshooting-guide.md)

**Test Artifacts:**
> **Note**: Session artifacts are archived after closeout. Find them in the `.archive/` directory.
- Session: `sessions/.archive/session-20251115-210537-claude-flow-integration-testing/`
- Test scripts: `sessions/.archive/session-20251115-210537-claude-flow-integration-testing/artifacts/scripts/`
- Findings: `sessions/.archive/session-20251115-210537-claude-flow-integration-testing/artifacts/notes/session-findings.md`

---

## 📂 Guide Categories Explained

### 🌱 getting-started/
**Tutorials** - Learning-oriented guides for beginners
- Step-by-step tutorials
- First-time setup guides
- Quick start guides

*Currently empty - add your onboarding tutorials here*

### 🔧 how-to/
**Task-oriented** - Practical step-by-step guides
- How to test integrations
- How to set up features
- How to perform specific tasks

**Current guides:**
- [integration-testing-guide.md](how-to/integration-testing-guide.md)

### 📋 reference/
**Information-oriented** - Quick lookups and checklists
- API references
- Checklists
- Configuration options
- Command references

**Current guides:**
- [feature-verification-checklist.md](reference/feature-verification-checklist.md)

### 🔍 troubleshooting/
**Problem-oriented** - Solutions to common issues
- Error message lookup
- Debugging guides
- FAQ
- Emergency fixes

**Current guides:**
- [troubleshooting-guide.md](troubleshooting/troubleshooting-guide.md)

### 💭 concepts/
**Understanding-oriented** - Explanations and theory
- Architecture explanations
- Design decisions
- Conceptual overviews
- Background information

**Current guides:**
- [hive-mind-system.md](concepts/hive-mind-system.md) - Multi-agent orchestration framework overview

### 🚀 advanced/
**Specialized topics** - Advanced usage and optimization
- Performance tuning
- Advanced patterns
- Scaling strategies
- Custom integrations

**Current guides:**
- [adaptive-pivot-protocol.md](advanced/adaptive-pivot-protocol.md) - Mid-task complexity detection and pivoting

---

## 🛠️ Automated Tests

**Test Scripts:**
```bash
# Located in test session artifacts
sessions/session-20251115-210537-claude-flow-integration-testing/artifacts/scripts/
├── test-mcp-connections.sh
└── test-hooks.sh
```

**Run tests:**
```bash
bash sessions/session-20251115-210537-claude-flow-integration-testing/artifacts/scripts/test-hooks.sh
```

---

## 🆘 Getting Help

### For Issues Not Covered Here:

1. **Check detailed findings:**
   - `sessions/session-20251115-210537-claude-flow-integration-testing/artifacts/notes/session-findings.md`

2. **Enable debug mode:**
   ```bash
   export CLAUDE_FLOW_DEBUG=true
   npx claude-flow@alpha hooks [command]
   ```

3. **Create diagnostic package:**
   ```bash
   mkdir debug-info
   claude mcp list > debug-info/mcp-status.txt
   ls -laR .swarm > debug-info/swarm-structure.txt
   ls -laR sessions > debug-info/sessions-structure.txt
   ```

### Quick Health Check

- [ ] `claude mcp list` shows all servers
- [ ] Hooks execute without errors
- [ ] Memory operations work via MCP tool
- [ ] `.swarm/memory.db` exists (56MB+)
- [ ] 36,000+ memory entries tracked

If all checked: ✅ System healthy

---

## 📅 Maintenance

- **Last Updated**: 2025-11-16
- **Test Coverage**: 100%
- **Documentation Version**: 1.1.0
- **Status**: Production Ready

**Recent Additions** (2025-11-16):
- Hive-Mind system documentation (6 new guides)
- Adaptive pivot protocol pattern
- Coordination decision framework
- Zero-risk execution pattern

**Update schedule:**
- After claude-flow package updates
- When new features added
- When patterns change
- Quarterly review recommended
