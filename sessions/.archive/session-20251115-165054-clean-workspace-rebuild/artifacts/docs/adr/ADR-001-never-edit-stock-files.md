# ADR-001: Never Edit Stock Files

**Status**: Proposed
**Date**: 2025-11-15
**Deciders**: System Architect
**Technical Story**: Clean workspace rebuild, stock-first compliance

---

## Context and Problem Statement

Current workspace has **82/100 stock-first score** with significant customizations that modify stock claude-flow files. This creates:

1. **Upgrade Friction**: Stock claude-flow upgrades may break custom features
2. **Maintenance Burden**: Custom changes scattered across stock files
3. **Portability Issues**: Custom features tied to specific file edits
4. **Clarity Loss**: Unclear boundaries between stock and custom

**Key Violations**:
- CLAUDE.md expanded from ~100 lines (stock) to 500+ lines (custom features embedded)
- Custom hooks wrapper (`.claude/hooks/auto-hooks.js`) intercepts filesystem operations
- Custom implementations in `.claude/reasoningbank/`, `.claude/integrations/`
- File routing enforced via CLAUDE.md rather than guided

**Question**: How do we preserve custom features while maintaining stock-first compliance?

---

## Decision Drivers

### Technical Drivers

- **Maintainability**: Stock upgrades should work seamlessly
- **Clarity**: Clear separation between stock and custom
- **Testability**: Easy to test custom features independently
- **Auditability**: All custom behavior visible and documented

### User Experience Drivers

- **Opt-in**: Users choose which features to enable
- **Progressive**: Beginner-friendly with advanced options
- **Transparent**: Clear understanding of what's custom vs stock
- **Portable**: Features work across different projects

### Compliance Drivers

- **Stock-First Score**: Achieve 95+ score
- **Architectural Compliance**: Follow claude-flow architecture principles
- **Implementation Compliance**: Use stock CLI/APIs only
- **Documentation Compliance**: Features documented, not enforced

---

## Considered Options

### Option 1: Continue Current Approach (Status Quo)

**Description**: Maintain current architecture with custom code and stock file modifications.

**Pros**:
- ✅ No migration needed
- ✅ Features work as-is
- ✅ Familiar to current users

**Cons**:
- ❌ Stock upgrades may break features
- ❌ Poor stock-first score (82/100)
- ❌ Scattered customizations
- ❌ Hard to maintain long-term
- ❌ Features not portable

**Stock-First Score**: 82/100

### Option 2: Features as Git Branches

**Description**: Keep stock in main branch, custom features in separate branches.

**Pros**:
- ✅ Stock remains pristine
- ✅ Clear separation

**Cons**:
- ❌ Merge conflicts on every stock update
- ❌ Can't combine features easily
- ❌ Poor user experience (branch switching)
- ❌ Doesn't scale to multiple features

**Stock-First Score**: 90/100 (architecture), but 60/100 (usability)

### Option 3: Features as NPM Packages

**Description**: Package custom features as installable NPM modules.

**Pros**:
- ✅ Version management via npm
- ✅ Clear dependencies
- ✅ Portable across projects

**Cons**:
- ❌ Heavy infrastructure (package.json, node_modules)
- ❌ Requires publication or private registry
- ❌ Doesn't align with claude-flow's skill system
- ❌ Overkill for documentation-heavy features

**Stock-First Score**: 93/100, but overengineered

### Option 4: Features as Skills (CHOSEN)

**Description**: Implement all custom features as skills in `.claude/skills/` directory.

**Pros**:
- ✅ **Zero stock file modifications** (pristine stock)
- ✅ **Composable** (skills combine via hooks)
- ✅ **Portable** (copy skills directory between projects)
- ✅ **Opt-in** (users enable skills individually)
- ✅ **Progressive** (beginner → advanced examples)
- ✅ **Stock CLI only** (no custom runtime)
- ✅ **Aligns with claude-flow architecture** (skills are native)
- ✅ **95+ stock-first score achievable**

**Cons**:
- ⚠️ Migration effort required
- ⚠️ Learning curve for skill structure
- ⚠️ Requires excellent documentation

**Stock-First Score**: 97/100 (target)

---

## Decision Outcome

**Chosen Option**: **Option 4 - Features as Skills**

### Rationale

1. **Architectural Alignment**: Skills are a native claude-flow concept, not a workaround
2. **Stock-First Compliance**: Achieves 95+ score by never editing stock files
3. **User Experience**: Opt-in features with progressive disclosure
4. **Maintainability**: Stock upgrades work seamlessly, skills unaffected
5. **Portability**: Skills directory portable across projects
6. **Composability**: Skills combine via standard hooks system

### Decision Rules

**MUST Rules**:
1. ✅ **MUST NOT modify any stock files**
   - Stock files: CLAUDE.md, .claude/agents/\*, .claude/commands/\*, .claude/settings.json
   - Extension allowed: .claude/settings.local.json (stock mechanism)

2. ✅ **MUST use stock CLI only**
   - All hooks: `npx claude-flow@alpha hooks [cmd]`
   - All memory: `npx claude-flow@alpha hooks memory --action [action]`
   - All agents: Stock agent definitions, spawned via Claude Code Task tool
   - No custom JavaScript/TypeScript runtime

3. ✅ **MUST coordinate via hooks**
   - Pre-task hook cascades to skill scripts
   - Post-task hook cascades to skill scripts
   - No filesystem interception
   - No monkey-patching

4. ✅ **MUST provide progressive disclosure**
   - Beginner, intermediate, advanced examples
   - skill_level in frontmatter
   - Clear prerequisites and time estimates

**SHOULD Rules**:
1. ✅ **SHOULD use shell scripts for automation**
   - Transparent execution (visible in process list)
   - Easy to audit and test
   - No runtime dependencies

2. ✅ **SHOULD integrate with stock memory**
   - Use namespaced keys (e.g., `session/`, `captains-log/`)
   - Use TTL for temporary data
   - Use stock search/retrieve APIs

3. ✅ **SHOULD require HITL for destructive operations**
   - Session archival: Require confirmation
   - File deletion: Require confirmation
   - Data export: Show preview first

4. ✅ **SHOULD document stock integration points**
   - Which stock hooks used
   - Which stock memory keys accessed
   - Which stock agents coordinated

**MAY Rules**:
1. ✅ **MAY extend settings.local.json**
   - Add skill-specific configuration
   - Add hook cascades
   - Add custom metadata
   - Never modify settings.json (stock)

2. ✅ **MAY create recommended directory structures**
   - Guidance for users (e.g., `sessions/` layout)
   - Not enforced by code
   - Documented as best practices

3. ✅ **MAY provide external integrations**
   - AgentDB, ReasoningBank, etc.
   - Must use stock hooks for coordination
   - Must not modify stock infrastructure

---

## Implementation Guidelines

### Stock File Protection

**Enforcement Mechanism**:
```bash
# Pre-commit hook validates no stock file modifications
#!/bin/bash
# File: .git/hooks/pre-commit

STOCK_FILES=(
  "CLAUDE.md"
  ".claude/agents/**/*.md"
  ".claude/commands/**/*.md"
  ".claude/settings.json"
  ".claude/helpers/**/*"
  ".claude/statusline-command.sh"
)

for pattern in "${STOCK_FILES[@]}"; do
  if git diff --cached --name-only | grep -E "$pattern"; then
    echo "❌ ERROR: Stock file modification detected: $pattern"
    echo "Custom features must be implemented as skills in .claude/skills/"
    echo "See docs/features-as-skills-spec.md for details"
    exit 1
  fi
done

echo "✅ No stock file modifications detected"
```

**Exception**: settings.local.json is allowed (stock extension mechanism)

### Skill Structure Enforcement

**Directory Structure**:
```
.claude/skills/<skill-name>/
├── skill.md              # REQUIRED: Skill definition with frontmatter
├── scripts/              # OPTIONAL: Coordination scripts (stock CLI only)
├── examples/             # REQUIRED: Progressive disclosure examples
│   ├── basic.md         # REQUIRED: Beginner example
│   ├── intermediate.md  # OPTIONAL: Intermediate example
│   └── advanced.md      # OPTIONAL: Advanced example
├── docs/                 # OPTIONAL: Deep dive documentation
└── tests/                # RECOMMENDED: Skill validation tests
```

**Validation**:
```bash
# Validate skill structure
#!/bin/bash
SKILL_DIR="$1"

# Check required files
if [ ! -f "$SKILL_DIR/skill.md" ]; then
  echo "❌ ERROR: Missing skill.md"
  exit 1
fi

if [ ! -f "$SKILL_DIR/examples/basic.md" ]; then
  echo "❌ ERROR: Missing examples/basic.md"
  exit 1
fi

# Validate frontmatter
if ! grep -q "^---$" "$SKILL_DIR/skill.md"; then
  echo "❌ ERROR: skill.md missing YAML frontmatter"
  exit 1
fi

# Check for custom runtime code (not allowed)
if find "$SKILL_DIR/scripts" -name "*.js" -o -name "*.ts" 2>/dev/null | grep -q .; then
  echo "❌ ERROR: JavaScript/TypeScript not allowed in skill scripts"
  echo "Use shell scripts calling stock CLI only"
  exit 1
fi

echo "✅ Skill structure valid"
```

### Stock CLI Usage

**Allowed Patterns**:
```bash
# ✅ CORRECT: Stock CLI calls
npx claude-flow@alpha hooks pre-task --description "..." --task-id "..."
npx claude-flow@alpha hooks memory --action store --key "..." --value "..."
npx claude-flow@alpha agent spawn --type researcher --task "..."

# ✅ CORRECT: MCP tools via Claude Code
mcp__claude-flow__swarm_init { topology: "mesh" }
mcp__claude-flow__task_orchestrate { task: "..." }
```

**Forbidden Patterns**:
```javascript
// ❌ WRONG: Custom runtime code
const fs = require('fs');
fs.writeFileSync = function(...args) { /* interception */ };

// ❌ WRONG: Direct database access
const db = sqlite3.open('.swarm/memory.db');

// ❌ WRONG: Reimplementing stock features
class CustomMemory {
  store(key, value) { /* custom implementation */ }
}
```

---

## Positive Consequences

### Technical Benefits

1. **Seamless Stock Upgrades**
   - Stock claude-flow updates don't break custom features
   - Clear separation enables independent evolution
   - Skills can be updated independently

2. **Clear Boundaries**
   - Stock vs custom always obvious
   - Easier debugging (isolate stock vs skill issues)
   - Easier testing (test stock and skills separately)

3. **Composability**
   - Skills combine via standard hooks
   - No feature conflicts (namespaced memory, cascaded hooks)
   - Users mix and match features

### User Experience Benefits

1. **Opt-In Features**
   - Users choose which features to enable
   - Progressive adoption (start simple, add complexity)
   - No forced workflows

2. **Progressive Disclosure**
   - Beginner examples for quick start
   - Advanced examples for power users
   - Clear learning path

3. **Portability**
   - Copy `.claude/skills/` to new project
   - Works with any stock claude-flow workspace
   - Share skills with team/community

### Maintenance Benefits

1. **Reduced Complexity**
   - No scattered customizations
   - All custom code in `.claude/skills/`
   - Clear ownership boundaries

2. **Easier Onboarding**
   - New team members understand stock vs custom
   - Skills documented individually
   - Progressive learning path

3. **Long-Term Sustainability**
   - Stock upgrades free
   - Skills maintained independently
   - No technical debt accumulation

---

## Negative Consequences

### Migration Effort

1. **Extraction Work**
   - Extract features from CLAUDE.md to skills
   - Convert custom code to stock CLI calls
   - Write progressive disclosure examples
   - Estimated effort: 20-30 hours

2. **Learning Curve**
   - Users need to understand skill structure
   - Developers need to learn stock CLI
   - Mitigated by excellent documentation

3. **Documentation Burden**
   - Skills require thorough documentation
   - Progressive disclosure examples needed
   - Testing and validation required

### Potential Limitations

1. **Stock CLI Coverage**
   - Risk: Stock CLI may not expose all needed functionality
   - Mitigation: Document gaps, contribute to claude-flow
   - Fallback: Skills can wrap external tools via hooks

2. **Performance Overhead**
   - Risk: Shell scripts slower than native code
   - Mitigation: Most operations are async (hooks)
   - Reality: Negligible impact for coordination tasks

3. **Skill Discovery**
   - Risk: Users may not know skills exist
   - Mitigation: CLAUDE.md references skills
   - Mitigation: Skill catalog in documentation

---

## Validation and Compliance

### Stock-First Score Calculation

**Current Score: 82/100**
- Architecture: 68% (custom directories, enforcement)
- Implementation: 97.5% (mostly stock CLI)

**Target Score: 97/100**
- Architecture: 95% (only .claude/skills/ custom)
- Implementation: 100% (pure stock CLI)

### Compliance Checklist

**Phase 1: Extraction**
- [ ] All custom features identified
- [ ] Skills created for each feature
- [ ] Progressive disclosure examples written
- [ ] Stock CLI calls validated
- [ ] CLAUDE.md reduced to stock format

**Phase 2: Validation**
- [ ] No stock files modified
- [ ] All scripts use stock CLI only
- [ ] No custom runtime code
- [ ] Skills composable via hooks
- [ ] Progressive disclosure complete

**Phase 3: Testing**
- [ ] Fresh `npx claude-flow@alpha init` works
- [ ] Skills copy to fresh workspace
- [ ] All features functional
- [ ] Stock upgrades don't break skills
- [ ] User acceptance testing passed

### Rollback Strategy

**If migration fails**:
1. Restore CLAUDE.md.backup
2. Restore .claude/ from git
3. Disable skills in settings.local.json
4. Continue with current architecture

**Risk**: Low (skills are additive, don't modify stock)

---

## Related Decisions

- **ADR-002**: Auto-Cascading Hooks Pattern (how skills coordinate)
- **ADR-003**: Session Management as Skill (session handling strategy)
- **ADR-004**: Skills Use Stock CLI Only (implementation rules)

---

## References

- [Features-as-Skills Specification](../features-as-skills-spec.md)
- [Stock vs Current Analysis](../../analysis/stock-vs-current.md)
- [Migration Strategy](../migration-strategy.md)
- [Claude Flow Documentation](https://github.com/ruvnet/claude-flow)

---

## Appendix: Stock File Inventory

### Files Created by `npx claude-flow@alpha init`

**Root Level**:
- `CLAUDE.md` - AI-readable project configuration
- `.mcp.json` - MCP server configuration

**.claude/ Directory**:
- `settings.json` - Stock configuration
- `settings.local.json` - Local overrides (user-editable)
- `statusline-command.sh` - Status line script
- `.gitignore` - Git ignore rules

**.claude/commands/** (43 files):
- `analysis/` - 3 analysis commands
- `automation/` - 3 automation commands
- `coordination/` - 3 coordination commands
- `github/` - 5 GitHub commands
- `hooks/` - 5 hook commands
- `memory/` - 3 memory commands
- `monitoring/` - 3 monitoring commands
- `optimization/` - 3 optimization commands
- `training/` - 3 training commands
- `workflows/` - 3 workflow commands
- `swarm/` - 9 swarm commands
- `hive-mind/` - 11 hive mind commands

**.claude/agents/** (64 files):
- `core/` - 5 core agents (coder, reviewer, tester, planner, researcher)
- `swarm/` - 3 swarm coordinators
- `consensus/` - 7 consensus agents
- `github/` - 9 GitHub agents
- `sparc/` - 6 SPARC agents
- `specialized/` - 8 specialized agents
- `testing/` - 2 testing agents
- Plus 24 additional agents

**.claude/helpers/** (6 files):
- Helper scripts for setup and utilities

**ALL ABOVE FILES ARE READ-ONLY FOR SKILLS**

**Skills May Create/Edit**:
- `.claude/skills/*/` - Skill directories
- `.claude/settings.local.json` - Skill configuration
- User data directories (sessions/, inbox/, etc.)

---

**Decision**: Adopted
**Next Review**: After Phase 1 migration (extract features to skills)
