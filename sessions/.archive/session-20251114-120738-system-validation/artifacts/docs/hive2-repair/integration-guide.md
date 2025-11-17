# File Router Integration Guide

## Quick Start

### 1. Add to Project
```bash
# Copy validation module to project utils
cp sessions/session-20251114-120738-system-validation/artifacts/code/file-router-validation.js \
   .swarm/utils/file-router-validation.js
```

### 2. CLI Usage
```bash
# Validate a single path
node .swarm/utils/file-router-validation.js validate "test-workflow/file.js" "$SESSION_ID"

# Detect all violations in current directory
node .swarm/utils/file-router-validation.js detect
```

### 3. Pre-Commit Hook
```bash
#!/bin/bash
# .git/hooks/pre-commit

# Detect root-level violations
if node .swarm/utils/file-router-validation.js detect 2>&1 | grep -q "violations found"; then
  echo "❌ Commit blocked: Root-level violations detected"
  echo "Run: node .swarm/utils/file-router-validation.js detect"
  exit 1
fi

echo "✓ File routing validated"
```

## Integration Patterns

### Pattern 1: Agent Pre-Write Hook
```javascript
// In agent code before file write
const { validateFilePath } = require('./.swarm/utils/file-router-validation');

function writeFile(path, content) {
  const sessionId = process.env.SESSION_ID || 'default';
  const validation = validateFilePath(path, sessionId);

  if (!validation.valid) {
    throw new Error(`${validation.error}\nUse: ${validation.suggestion}`);
  }

  // Proceed with write
  fs.writeFileSync(path, content);
}
```

### Pattern 2: Path Auto-Correction
```javascript
const { validateFilePath, getSessionPath } = require('./.swarm/utils/file-router-validation');

function smartWrite(fileName, content, sessionId) {
  // Try original path first
  let targetPath = fileName;
  let validation = validateFilePath(targetPath, sessionId);

  // If invalid, auto-correct to session path
  if (!validation.valid) {
    targetPath = getSessionPath(fileName, sessionId);
    console.log(`Auto-corrected: ${fileName} → ${targetPath}`);
  }

  fs.writeFileSync(targetPath, content);
}
```

### Pattern 3: Claude-Flow Hook Integration
```bash
#!/bin/bash
# .swarm/hooks/pre-edit.sh

FILE_PATH="$1"
SESSION_ID="${SESSION_ID:-$(cat .current-session 2>/dev/null)}"

# Validate file path
node .swarm/utils/file-router-validation.js validate "$FILE_PATH" "$SESSION_ID"
EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ]; then
  echo "🚫 File routing violation blocked"
  exit 1
fi

exit 0
```

## Environment Setup

### Session ID Management
```bash
# In session initialization
export SESSION_ID="session-$(date +%Y%m%d-%H%M%S)-<topic>"
echo "$SESSION_ID" > .current-session

# In hooks/scripts
SESSION_ID="${SESSION_ID:-$(cat .current-session 2>/dev/null)}"
```

### CLAUDE.md Integration
Add to project CLAUDE.md:

```markdown
## File Router Validation

**CRITICAL: All file operations must pass validation.**

Before writing ANY file, validate path:
\`\`\`bash
node .swarm/utils/file-router-validation.js validate "$FILE_PATH" "$SESSION_ID"
\`\`\`

**Rules:**
- ❌ BLOCK: test-*, tests/, docs/, scripts/ at root (new files)
- ✅ ALLOW: sessions/<session-id>/artifacts/
- ✅ ALLOW: docs/{protocols,guides,reference,projects}/ (permanent docs)
- ✅ ALLOW: package.json, CLAUDE.md, etc. (project files)
```

## API Reference

### validateFilePath(filePath, sessionId)
Validates a file path against CLAUDE.md rules.

**Parameters:**
- `filePath` (string): Path to validate
- `sessionId` (string): Current session ID

**Returns:**
```javascript
{
  valid: boolean,
  error?: string,        // Error message if invalid
  suggestion?: string    // Suggested correct path
}
```

**Examples:**
```javascript
// ❌ Invalid: Root test directory
validateFilePath('test-workflow/app.js', 'session-123')
// { valid: false, error: "...", suggestion: "sessions/session-123/artifacts/code/app.js" }

// ✅ Valid: Session artifacts
validateFilePath('sessions/session-123/artifacts/code/app.js', 'session-123')
// { valid: true }

// ✅ Valid: Permanent docs
validateFilePath('docs/protocols/captain-log.md', 'session-123')
// { valid: true }
```

### getSessionPath(fileName, sessionId)
Gets the correct session artifact path for a file based on its type.

**Parameters:**
- `fileName` (string): File name
- `sessionId` (string): Current session ID

**Returns:** (string) Full session artifact path

**Examples:**
```javascript
getSessionPath('app.test.js', 'session-123')
// → "sessions/session-123/artifacts/tests/app.test.js"

getSessionPath('README.md', 'session-123')
// → "sessions/session-123/artifacts/docs/README.md"

getSessionPath('build.sh', 'session-123')
// → "sessions/session-123/artifacts/scripts/build.sh"
```

### detectRootViolations()
Scans current directory for root-level violations.

**Returns:** (Promise) Array of violation objects
```javascript
[
  {
    path: "test-workflow",
    size: "12K",
    files: 3,
    type: "test prefix directories"
  }
]
```

## Testing

### Manual Test Suite
```bash
cd sessions/session-20251114-120738-system-validation/artifacts/tests/
node file-router-validation.test.js
```

### Automated CI Integration
```yaml
# .github/workflows/validate-files.yml
name: File Router Validation

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: node .swarm/utils/file-router-validation.js detect
```

## Troubleshooting

### Issue: "No such file or directory"
**Cause:** Validation module not found
**Solution:** Copy module to `.swarm/utils/` or update path

### Issue: False positive on permanent docs
**Cause:** Path doesn't match permanent docs pattern
**Solution:** Ensure path starts with `docs/{protocols,guides,reference,projects}/`

### Issue: Session ID not found
**Cause:** SESSION_ID environment variable not set
**Solution:** Set via `.current-session` file or environment variable

## Best Practices

1. **Initialize session ID early** - Set `SESSION_ID` at session start
2. **Validate before write** - Always check paths before file operations
3. **Use auto-correction** - Let `getSessionPath()` suggest correct paths
4. **Enable hooks** - Add pre-commit/pre-edit hooks for enforcement
5. **Test regularly** - Run `detect` command to catch violations
6. **Document exceptions** - If allowing new root files, update validation

## Performance Notes

- Validation is ~1ms per call (negligible overhead)
- Detection scans ~100 files/second
- No dependencies beyond Node.js built-ins
- Async detection for large directories

## Migration from Legacy Structure

If you have existing violations:

```bash
# 1. Detect violations
node .swarm/utils/file-router-validation.js detect > violations.txt

# 2. Review violations
cat violations.txt

# 3. Move to session artifacts (manual or scripted)
# Example: test-workflow/ → sessions/<session-id>/artifacts/code/

# 4. Verify cleanup
node .swarm/utils/file-router-validation.js detect
```

## Support

- Validation module: `sessions/session-20251114-120738-system-validation/artifacts/code/file-router-validation.js`
- Full report: `sessions/session-20251114-120738-system-validation/artifacts/docs/hive2-repair/file-router-cleanup-report.md`
- Test suite: `sessions/session-20251114-120738-system-validation/artifacts/tests/file-router-validation.test.js`
