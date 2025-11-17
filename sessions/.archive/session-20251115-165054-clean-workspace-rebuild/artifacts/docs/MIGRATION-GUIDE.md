# Clean Workspace Migration Guide

Complete guide for migrating custom workspace to stock claude-flow architecture.

## Overview

This migration transforms a customized claude-flow workspace into a clean, stock-compliant environment while preserving functionality through Claude Code skills.

## Migration Phases

### Phase 1: Analysis (Completed by researcher & code-analyzer)

- ✅ Inventory custom features
- ✅ Map dependencies
- ✅ Identify stock equivalents
- ✅ Calculate stock-first score

### Phase 2: Architecture Design (Completed by system-architect)

- ✅ Design clean workspace structure
- ✅ Plan feature-to-skill conversion
- ✅ Define migration strategy
- ✅ Create rollback plan

### Phase 3: Implementation (Current)

Scripts created:
- ✅ `init-sandbox.sh` - Clean workspace initialization
- ✅ `migrate-features.js` - Feature-to-skill conversion
- ✅ `setup-hooks.sh` - Auto-cascading hooks setup
- ✅ `validate-migration.sh` - Validation checks
- ✅ `rollback.sh` - Rollback capability

### Phase 4: Validation

Run validation suite to ensure compliance.

### Phase 5: Deployment

Deploy to production environment.

## Quick Start

### 1. Create Clean Sandbox

```bash
# Initialize clean workspace
./sessions/session-20251115-165054-clean-workspace-rebuild/artifacts/scripts/init-sandbox.sh \
  claude-flow-clean \
  ~/workspaces/claude-flow-clean

cd ~/workspaces/claude-flow-clean
```

### 2. Migrate Features to Skills

```bash
# Set source and target
export SOURCE_WORKSPACE=~/common-thread-sandbox
export TARGET_WORKSPACE=~/workspaces/claude-flow-clean

# Run migration (dry run first)
export DRY_RUN=true
node ~/common-thread-sandbox/sessions/session-20251115-165054-clean-workspace-rebuild/artifacts/scripts/migrate-features.js

# Run actual migration
export DRY_RUN=false
node ~/common-thread-sandbox/sessions/session-20251115-165054-clean-workspace-rebuild/artifacts/scripts/migrate-features.js
```

### 3. Setup Hooks

```bash
cd ~/workspaces/claude-flow-clean

# Manual hooks (recommended)
./~/common-thread-sandbox/sessions/session-20251115-165054-clean-workspace-rebuild/artifacts/scripts/setup-hooks.sh

# Or auto-fire hooks
HOOKS_MODE=auto ./~/common-thread-sandbox/sessions/session-20251115-165054-clean-workspace-rebuild/artifacts/scripts/setup-hooks.sh
```

### 4. Validate Migration

```bash
# Run validation
./~/common-thread-sandbox/sessions/session-20251115-165054-clean-workspace-rebuild/artifacts/scripts/validate-migration.sh \
  ~/workspaces/claude-flow-clean

# Check report
cat ~/workspaces/claude-flow-clean/validation-report.json
```

### 5. Deploy or Rollback

```bash
# If validation passes
git add .
git commit -m "Clean workspace migration complete"

# If validation fails
./~/common-thread-sandbox/sessions/session-20251115-165054-clean-workspace-rebuild/artifacts/scripts/rollback.sh
```

## Feature Migration Map

### Session Management → Skill

**Before**: Custom `.claude/scripts/session-init.sh`
**After**: `.claude/skills/session-management/skill.md`

**Integration**:
```bash
# Manual
node .claude/hooks/session-init.js "feature-name"

# Via CLAUDE.md instruction
"Auto-create session on first message"
```

### File Routing → Skill

**Before**: Custom routing logic in hooks
**After**: `.claude/skills/file-routing/skill.md`

**Integration**:
```javascript
const { FileRouter } = require('.claude/hooks/file-router.js');
const router = new FileRouter(sessionId);
const targetPath = router.route(filename);
```

### Git Checkpoints → Skill

**Before**: Custom git automation
**After**: `.claude/skills/git-checkpoint/skill.md`

**Integration**:
```bash
# Via post-task hook
npx claude-flow@alpha hooks post-task \
  --task-id "checkpoint-1" \
  --status "completed"
```

### Captain's Log → Archive

**Status**: Optional, archived
**Recommendation**: Use standard session notes in `artifacts/notes/`

### ReasoningBank → Archive

**Status**: Optional, not migrated
**Recommendation**: Stock claude-flow memory sufficient

### AgentDB → Archive

**Status**: Optional, not migrated
**Recommendation**: Stock coordination sufficient

## Stock-First Compliance

### Target Scores

- **Architecture**: 100% stock
- **Implementation**: 97% stock (3% for utility scripts)
- **Overall**: 98/100

### Deductions

- Session management skill: -0 (pure stock)
- File routing skill: -2 (routing logic)
- Git checkpoint skill: -0 (uses native git)
- Auto-hooks wrapper: -0 (optional, stock-first)

## Validation Checklist

Before deploying, ensure:

- [ ] Directory structure matches stock
- [ ] CLAUDE.md is stock-compliant
- [ ] No custom features in root
- [ ] Hooks use stock commands
- [ ] Skills are properly documented
- [ ] Validation report shows 0 failures
- [ ] Stock-first score ≥ 95/100

## Rollback Procedure

If migration fails:

```bash
# 1. Stop migration
Ctrl+C

# 2. Run rollback
./sessions/session-20251115-165054-clean-workspace-rebuild/artifacts/scripts/rollback.sh

# 3. Verify restoration
git status
npm test

# 4. Review rollback report
cat rollback-report.json
```

## Troubleshooting

### Migration Script Fails

```bash
# Check logs
cat migration-report.json

# Run with verbose
export VERBOSE=true
node scripts/migrate-features.js
```

### Validation Fails

```bash
# Non-strict mode
export STRICT_MODE=false
./scripts/validate-migration.sh

# Check specific failures
jq '.results[] | select(.status == "fail")' validation-report.json
```

### Hooks Not Working

```bash
# Test hooks
npm run hooks:test

# Check configuration
cat .claude/hooks/hooks.config.json

# Verify claude-flow
npx claude-flow@alpha hooks --help
```

## Best Practices

### 1. Start Fresh

Don't migrate in-place. Create new clean workspace.

### 2. Dry Run First

Always run migrations with `DRY_RUN=true` first.

### 3. Validate Frequently

Run validation after each migration step.

### 4. Backup Everything

Automatic backups created in `.migration-backup/`

### 5. Document Decisions

Record why features were migrated or archived.

## Support

For issues:

1. Check validation report
2. Review migration logs
3. Consult stock claude-flow docs
4. Use rollback if needed

## Next Steps

After successful migration:

1. Test all workflows
2. Update team documentation
3. Train on stock architecture
4. Archive old workspace
5. Celebrate clean architecture! 🎉
