# File Router Quick Reference

**Status:** ✅ ACTIVE
**Last Updated:** 2025-11-14 23:02:00 UTC

---

## Quick Commands

### Check System Status
```bash
# Detect existing violations
node .swarm/hooks/file-router-validation.js detect

# Validate a specific path
node .swarm/hooks/file-router-validation.js validate "path/to/file"

# Run full test suite
bash sessions/session-20251114-145225-dream-hive-production-readiness/artifacts/scripts/test-file-router-enforcement.sh
```

### Test Auto-Correction
```bash
# Test modification hook
echo '{"tool_input":{"file_path":"tests/app.test.js"}}' | \
  node .swarm/hooks/modify-file-router.js
```

---

## What Gets Blocked

| Pattern | Example | Auto-Corrected To |
|---------|---------|-------------------|
| `tests/` | `tests/app.test.js` | `sessions/<id>/artifacts/tests/app.test.js` |
| `docs/` | `docs/guide.md` | `sessions/<id>/artifacts/docs/guide.md` |
| `scripts/` | `scripts/build.sh` | `sessions/<id>/artifacts/scripts/build.sh` |
| `test-*` | `test-workflow/file.js` | `sessions/<id>/artifacts/tests/file.js` |

## What Gets Allowed

| Pattern | Example | Why |
|---------|---------|-----|
| `sessions/<id>/artifacts/` | `sessions/.../artifacts/code/app.js` | Session artifacts |
| `docs/projects/` | `docs/projects/myapp/README.md` | Permanent project docs |
| `docs/protocols/` | `docs/protocols/api.md` | System protocols |
| `package.json` | `package.json` | Project config |
| `inbox/` | `inbox/idea.md` | Inbox system |

---

## How It Works

1. **Write/Edit Attempted** → File operation starts
2. **Hooks Intercept** → `modify-file` hook called
3. **Validation** → Path checked against CLAUDE.md rules
4. **Auto-Correct** → If violation, path redirected to session artifacts
5. **Warning** → User notified via stderr
6. **Write** → File written to correct location

---

## File Locations

### Hooks
- `.swarm/hooks/file-router-validation.js` - Core validation
- `.swarm/hooks/modify-file-router.js` - Auto-correction
- `.swarm/hooks/pre-edit-file-router.sh` - Pre-edit wrapper

### Scripts
- `sessions/.../artifacts/scripts/activate-file-router.sh` - Activation
- `sessions/.../artifacts/scripts/test-file-router-enforcement.sh` - Tests

### Documentation
- `sessions/.../artifacts/docs/file-router-activation-report.md` - Full report
- `sessions/.../artifacts/docs/INTEGRATION-SUCCESS.md` - Success summary
- `sessions/.../artifacts/docs/FILE-ROUTER-QUICKREF.md` - This guide

---

## Troubleshooting

### "Hook not found" error
```bash
# Re-run activation
bash sessions/session-20251114-145225-dream-hive-production-readiness/artifacts/scripts/activate-file-router.sh
```

### Check if hooks are executable
```bash
ls -la .swarm/hooks/file-router-*.js
# Should show -rwxr-xr-x permissions
```

### Verify session ID detection
```bash
cat .current-session
# Should show current session ID
```

---

## Emergency Disable

```bash
# Remove modification hook (disables auto-correction)
rm .swarm/hooks/modify-file-router.js

# Remove pre-edit wrapper (disables validation)
rm .swarm/hooks/pre-edit-file-router.sh

# Core validation remains for manual checks
```

---

## Contact

**Integrated By:** File Router Integration Specialist
**Session:** session-20251114-145225-dream-hive-production-readiness
**Status:** Production Ready ✅
