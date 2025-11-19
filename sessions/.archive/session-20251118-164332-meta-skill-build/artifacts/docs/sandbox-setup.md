# Testing Sandbox Setup Guide

## Overview

This document describes the testing sandbox created for safe validation of the meta-skill coordinator and prompt-improver fixes without affecting the production workspace.

## Session Information

- **Session ID**: `session-20251118-164332-meta-skill-build`
- **Purpose**: Testing meta-skill coordinator, fixed prompt-improver, and skills integration
- **Created**: 2025-11-18 16:43:32

## Sandbox Structure

```
sessions/session-20251118-164332-meta-skill-build/
└── artifacts/
    ├── sandbox/
    │   └── .claude/          # Complete copy of production .claude/
    │       ├── agents/       # 246 files copied
    │       ├── prompts/
    │       ├── skills/
    │       ├── settings.json
    │       └── ...
    ├── docs/
    │   ├── sandbox-setup.md  # This file
    │   └── test-results.md   # Test execution results
    ├── tests/
    │   └── test-suite.md     # Test cases and procedures
    ├── scripts/
    │   └── run-tests.sh      # Test automation scripts
    └── notes/
        └── observations.md   # Testing notes and findings

```

## Setup Process

### 1. Session Creation

```bash
# Create session directory structure
mkdir -p sessions/session-20251118-164332-meta-skill-build/artifacts/{sandbox,docs,tests,scripts,notes}
```

### 2. Sandbox Environment Copy

```bash
# Copy entire .claude directory to sandbox
cp -R /Users/splurfa/common-thread-sandbox/.claude \
      /Users/splurfa/common-thread-sandbox/sessions/session-20251118-164332-meta-skill-build/artifacts/sandbox/.claude
```

**Result**: 246 files successfully copied

### 3. Sandbox Isolation

The sandbox provides:
- **Safe Testing**: Changes don't affect production `.claude/` directory
- **Rollback Capability**: Original configuration preserved
- **Comparison**: Easy diff between sandbox and production
- **Documentation**: All changes tracked in session artifacts

## Testing Approach

### Phase 1: Structural Validation
- Verify all files copied correctly
- Check directory permissions
- Validate file integrity

### Phase 2: Meta-Skill Coordinator Testing
- Test skill discovery and loading
- Validate progressive disclosure
- Test error handling
- Verify memory integration

### Phase 3: Prompt-Improver Testing
- Test version detection (v1 vs v2)
- Validate improvement logic
- Test API integration
- Verify output formatting

### Phase 4: Integration Testing
- Test meta-skill + prompt-improver coordination
- Validate skill chaining
- Test with existing skills
- End-to-end workflow validation

### Phase 5: Performance Testing
- Measure execution time
- Monitor resource usage
- Test concurrent operations
- Validate memory cleanup

## Sandbox Usage

### Running Tests Against Sandbox

```bash
# Set sandbox as active .claude directory (temporary)
export CLAUDE_CONFIG_DIR=/Users/splurfa/common-thread-sandbox/sessions/session-20251118-164332-meta-skill-build/artifacts/sandbox/.claude

# Run tests
npm test

# Reset to production
unset CLAUDE_CONFIG_DIR
```

### Comparing Sandbox to Production

```bash
# Diff sandbox vs production
diff -r .claude/ sessions/session-20251118-164332-meta-skill-build/artifacts/sandbox/.claude/
```

### Promoting Sandbox Changes

```bash
# After validation, promote changes to production
cp -R sessions/session-20251118-164332-meta-skill-build/artifacts/sandbox/.claude/* .claude/
```

## Safety Guidelines

1. **Never modify production .claude/ during testing**
2. **Always validate in sandbox first**
3. **Document all changes in session artifacts**
4. **Test rollback procedures before promoting**
5. **Keep detailed test logs for audit trail**

## Rollback Procedure

If testing reveals issues:

```bash
# Production .claude/ is untouched, simply discard sandbox
rm -rf sessions/session-20251118-164332-meta-skill-build/artifacts/sandbox/.claude

# Or restore from original if needed
cp -R .claude/ sessions/session-20251118-164332-meta-skill-build/artifacts/sandbox/.claude
```

## Next Steps

1. Create comprehensive test suite (test-suite.md)
2. Execute tests and document results (test-results.md)
3. Review findings with team
4. Make recommendations for production deployment

## Files Generated

- **sandbox-setup.md**: This setup guide
- **test-suite.md**: Detailed test cases
- **test-results.md**: Execution results and findings
- **run-tests.sh**: Automated test scripts
- **observations.md**: Testing notes and insights

## Success Criteria

- All 246 files copied successfully ✓
- Sandbox isolated from production ✓
- Test environment ready for validation ✓
- Documentation complete ✓

---

**Status**: Sandbox ready for testing
**Next**: Create test suite and begin validation
