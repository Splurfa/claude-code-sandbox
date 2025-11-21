# FINDING-008: File Routing Compliance Requires Manual Vigilance

**Status**: Open
**Type**: Improvement
**Priority**: High
**Root Cause**: System (no automated enforcement)
**Created**: 2025-11-21
**Updated**: 2025-11-21
**Resolved**: N/A

## Problem Statement

The file routing protocol (all working files to `sessions/$SESSION_ID/artifacts/`) is well-documented but relies on manual compliance. Without automated enforcement, files still sometimes get saved to root directories (`tests/`, `docs/`, `scripts/`), violating the protocol.

## Evidence

**Documentation**:
- `CLAUDE.md`: "NEVER save working files, text/mds and tests to the root folder"
- `docs/setup/quick-start.md`: Detailed file routing rules

**Captain's Log**:
- `sessions/captains-log/2025-11-18.md`:
  > "File routing relies on protocol awareness vs enforcement - manual vigilance still required"

**Violations Found** (during cleanup):
- Files in root `tests/` from older sessions
- Documentation in root `docs/` that should be session artifacts
- Scripts in root `scripts/` not part of core system

## Root Cause Analysis

**Why Violations Occur**:

1. **No Pre-Commit Validation**: Nothing stops committing files to wrong locations
2. **Cognitive Load**: Must remember protocol for every file operation
3. **Path Completion**: Terminal autocomplete suggests root paths
4. **Agent Errors**: Agents sometimes default to conventional paths (tests/, docs/)
5. **Legacy Patterns**: Old habits from standard project structures

**Why Protocol Exists**:
- Session isolation (all session work stays together)
- Clean root (only permanent core files)
- Easy archival (archive session → archive all its work)
- Rollback safety (remove session → remove all its files)

## Proposed Solution

### Short-term (Detection)
- [ ] Add validation script: `sessions/issues/validate-file-routing.sh`
  ```bash
  # Check for session artifacts in root
  if [ -n "$(find tests/ docs/ scripts/ -type f 2>/dev/null)" ]; then
    echo "⚠️ Files found in root tests/, docs/, scripts/"
    echo "Should these be in sessions/*/artifacts/?"
  fi
  ```
- [ ] Run weekly as part of workspace audit
- [ ] Document violations in captain's log

### Long-term (Enforcement)

**Pre-Commit Hook**:
```bash
# .git/hooks/pre-commit or .claude/settings.json hook

# Whitelist: Files allowed in root
ALLOWED_ROOT="package.json|package-lock.json|tsconfig.json|CLAUDE.md|README.md|.gitignore|LICENSE"

# Check staged files
for file in $(git diff --cached --name-only); do
  if [[ "$file" =~ ^(tests|docs|scripts)/ ]] && [[ ! "$file" =~ ^sessions/ ]]; then
    if [[ ! "$(basename "$file")" =~ ^($ALLOWED_ROOT)$ ]]; then
      echo "❌ File routing violation: $file"
      echo "💡 Did you mean: sessions/\$SESSION_ID/artifacts/$(dirname "$file")/$(basename "$file")?"
      exit 1
    fi
  fi
done
```

**Auto-Suggestion**:
When user tries to write to wrong path:
```
❌ Cannot write to: /root/tests/my-test.js
💡 Suggestion: sessions/session-20251121-143045-current/artifacts/tests/my-test.js
```

**Path Validation in Tools**:
- Modify Write tool behavior: Warn if path outside sessions/
- Suggest correct path automatically
- Allow override with explicit confirmation

### Whitelist Management
```markdown
# sessions/issues/file-routing-whitelist.txt

# Root files allowed (core project files only):
package.json
package-lock.json
tsconfig.json
CLAUDE.md
README.md
.gitignore
.nvmrc
LICENSE

# Root directories allowed:
.claude/
.git/
.swarm/
node_modules/
sessions/
```

## Related Findings

- Similar pattern to FINDING-003 (session naming enforcement)
- Part of FINDING-006 (integration-automation gap)

## Resolution Notes

**Status**: Open - Need to implement pre-commit validation

**Phased Rollout**:
1. **Phase 1**: Detection only (warn, don't block)
2. **Phase 2**: Soft enforcement (warn with override option)
3. **Phase 3**: Hard enforcement (block violations)

**Next Steps**:
1. Create validation script
2. Test on current workspace (find existing violations)
3. Add to pre-commit hooks (warn mode)
4. Monitor for false positives (legitimate root files)
5. Refine whitelist
6. Enable enforcement mode
7. Mark resolved when automation proven reliable
