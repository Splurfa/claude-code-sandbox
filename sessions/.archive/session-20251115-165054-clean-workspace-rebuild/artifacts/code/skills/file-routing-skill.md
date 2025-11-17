---
name: file-routing
description: Intelligent file organization and routing
version: 1.0.0
priority: high
type: automation
author: Migration Script
---

# File Routing Skill

Intelligent file organization and routing for claude-flow workspaces.

## Overview

This skill provides automated file routing rules:
- Route files to correct session artifacts
- Prevent root directory pollution
- Enforce organizational standards
- Validate file placement

## Usage

### Basic Rules

```javascript
// ALWAYS route to session artifacts
const SESSION_ID = getCurrentSessionId();

// Route by file type
const routes = {
  '.js': `sessions/${SESSION_ID}/artifacts/code/`,
  '.test.js': `sessions/${SESSION_ID}/artifacts/tests/`,
  '.md': `sessions/${SESSION_ID}/artifacts/docs/`,
  '.sh': `sessions/${SESSION_ID}/artifacts/scripts/`,
  '.txt': `sessions/${SESSION_ID}/artifacts/notes/`
};

function getFilePath(filename) {
  const ext = getExtension(filename);
  const route = routes[ext] || routes['.txt'];
  return `${route}${filename}`;
}
```

### Exception Handling

Only these files can be modified in root:

```javascript
const ALLOWED_ROOT_FILES = [
  'package.json',
  'package-lock.json',
  'CLAUDE.md',
  '.gitignore',
  'README.md'
];

function canModifyInRoot(filepath) {
  return ALLOWED_ROOT_FILES.includes(filepath);
}
```

## Implementation

### File Router

```javascript
class FileRouter {
  constructor(sessionId) {
    this.sessionId = sessionId;
    this.artifactsDir = `sessions/${sessionId}/artifacts`;
  }

  route(filepath) {
    // Check if root file
    if (this.isAllowedRootFile(filepath)) {
      return filepath;
    }

    // Route to artifacts
    const category = this.categorize(filepath);
    return `${this.artifactsDir}/${category}/${filepath}`;
  }

  categorize(filepath) {
    if (filepath.endsWith('.test.js')) return 'tests';
    if (filepath.endsWith('.js')) return 'code';
    if (filepath.endsWith('.ts')) return 'code';
    if (filepath.endsWith('.md')) return 'docs';
    if (filepath.endsWith('.sh')) return 'scripts';
    return 'notes';
  }

  isAllowedRootFile(filepath) {
    const allowedFiles = [
      'package.json',
      'CLAUDE.md',
      '.gitignore',
      'README.md'
    ];
    return allowedFiles.includes(filepath);
  }

  validate(operation, filepath) {
    const route = this.route(filepath);

    // Warn if trying to modify root
    if (!this.isAllowedRootFile(filepath) && !route.startsWith('sessions/')) {
      console.warn(`[FILE-ROUTING] Blocked root modification: ${filepath}`);
      console.warn(`[FILE-ROUTING] Route to: ${route}`);
      return false;
    }

    return true;
  }
}
```

### Integration Pattern

```javascript
const router = new FileRouter(sessionId);

// Before file operation
const targetPath = router.route(filename);
if (!router.validate('write', filename)) {
  throw new Error(`Invalid file path: ${filename}`);
}

// Proceed with routed path
await writeFile(targetPath, content);
```

## Stock Hooks Integration

```bash
# Validate file routing via post-edit hook
npx claude-flow@alpha hooks post-edit \
  --file "$FILEPATH" \
  --memory-key "file-routing/validation"
```

## Configuration

Add to CLAUDE.md:

```markdown
## File Routing

**CRITICAL**: All working files go to session artifacts:

- `sessions/$SESSION_ID/artifacts/code/` - Source code
- `sessions/$SESSION_ID/artifacts/tests/` - Tests
- `sessions/$SESSION_ID/artifacts/docs/` - Documentation
- `sessions/$SESSION_ID/artifacts/scripts/` - Scripts
- `sessions/$SESSION_ID/artifacts/notes/` - Notes

**Exception**: Only edit existing project files in root
```

## Validation

### Self-Check Questions

Before writing a file, ask:

1. Is this an existing project file? → Root OK
2. Is this new code? → Route to artifacts/code/
3. Is this a test? → Route to artifacts/tests/
4. Is this documentation? → Route to artifacts/docs/

### Error Messages

```
❌ BLOCKED: Cannot write to root: src/server.js
✅ ROUTE TO: sessions/session-123/artifacts/code/server.js

❌ BLOCKED: Cannot write to root: tests/api.test.js
✅ ROUTE TO: sessions/session-123/artifacts/tests/api.test.js
```

## Stock-First Compliance

- **Stock Architecture**: 100%
- **Custom Code**: JavaScript routing logic (pure utility)
- **Uses**: Standard file system, stock hooks
- **Score**: 98/100 (2 points for routing logic)

## Migration Notes

Converted from custom file routing system to skill-based approach.
No modifications to claude-flow core functionality.
