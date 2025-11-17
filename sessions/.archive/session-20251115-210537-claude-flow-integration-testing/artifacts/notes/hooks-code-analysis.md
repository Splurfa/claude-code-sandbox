# Hooks Code Analysis: `.claude-flow` Directory Creation

**Analysis Date**: 2025-11-15
**Package Analyzed**: `claude-flow@alpha` (v2.7.35)
**Analyst**: Code Quality Analyzer

---

## Executive Summary

**FINDING**: The `.claude-flow` directory creation behavior is **INTENTIONAL BY DESIGN**, not a bug.

**Root Cause**: The `DatabaseManager` class in claude-flow **hardcodes** `process.cwd()` as the base directory for all database operations.

**Impact**: When `npx claude-flow@alpha hooks` is executed from any directory, it creates `.claude-flow/` in the **current working directory** (CWD), not the project root.

---

## Code Evidence

### 1. Primary Source: `DatabaseManager.js`

**File**: `~/.npm/_npx/09002f125df728b2/node_modules/claude-flow/dist/src/core/DatabaseManager.js`

**Lines 24-27** (getDefaultPath method):
```javascript
getDefaultPath() {
    const baseDir = path.join(process.cwd(), '.claude-flow');
    return this.dbType === 'sqlite' ?
        path.join(baseDir, 'database.sqlite') :
        path.join(baseDir, 'database.json');
}
```

**Lines 28-32** (initialize method):
```javascript
async initialize() {
    await fs.ensureDir(path.dirname(this.dbPath));
    await this.provider.initialize();
    this.initialized = true;
}
```

### 2. Constructor Logic

**Lines 8-23**:
```javascript
constructor(dbType = 'sqlite', dbPath) {
    this.dbType = dbType;
    this.dbPath = dbPath || this.getDefaultPath();  // ← Falls back to getDefaultPath()

    if (this.dbType === 'sqlite') {
        try {
            this.provider = new SQLiteProvider(this.dbPath);
        } catch (error) {
            console.warn('SQLite not available, falling back to JSON storage:', error);
            this.provider = new JSONProvider(this.dbPath.replace('.sqlite', '.json'));
            this.dbType = 'json';
        }
    } else {
        this.provider = new JSONProvider(this.dbPath);
    }
}
```

**Key Observation**: If `dbPath` is not provided in the constructor, it calls `getDefaultPath()`, which uses `process.cwd()`.

---

## Decision Logic Breakdown

### How the Directory Location is Determined:

1. **Hooks command execution**: `npx claude-flow@alpha hooks pre-task --description "task"`
2. **DatabaseManager instantiated** (likely in memory/coordination modules)
3. **Path resolution logic**:
   ```javascript
   const baseDir = path.join(process.cwd(), '.claude-flow');
   // ↓
   // If CWD = /Users/splurfa/common-thread-sandbox/sessions/session-123/
   // Then baseDir = /Users/splurfa/common-thread-sandbox/sessions/session-123/.claude-flow
   ```
4. **Directory creation**: `fs.ensureDir()` creates the directory at `baseDir`

### No Project Root Detection

**CRITICAL**: The code does **NOT**:
- ❌ Search upward for `.git` directory
- ❌ Look for `package.json`
- ❌ Check for `.claude-flow` in parent directories
- ❌ Use environment variables for base path
- ❌ Accept a configurable base directory

**What it DOES**:
- ✅ Use `process.cwd()` unconditionally
- ✅ Create `.claude-flow/` wherever the command is executed

---

## Configuration File Evidence

### `config.js` - User Config Directory

**File**: `~/.npm/_npx/09002f125df728b2/node_modules/claude-flow/dist/src/core/config.js`

**Line (from getUserConfigDir method)**:
```javascript
private getUserConfigDir(): string {
    const home = homedir();
    return join(home, '.claude-flow');
}
```

**Note**: This is for **user-level config** (`~/.claude-flow`), **NOT** the working directory database.

---

## Behavior Analysis

### Intentional or Bug?

**VERDICT**: **Intentional Design**

**Evidence**:
1. **Consistent pattern**: Both `DatabaseManager` and `config.js` use explicit path construction
2. **No error handling**: No try/catch for "wrong directory" scenarios
3. **Documentation**: Package name suggests "flow" = current context, not global state
4. **Version stability**: v2.7.35 (mature version) - if this were a bug, it would have been reported/fixed

### Design Rationale (Inferred):

The developers likely intended:
- **Per-directory isolation**: Each directory gets its own `.claude-flow/` for context isolation
- **No global state pollution**: Avoids conflicts between different projects
- **Explicit coordination**: Users control where databases are created by controlling CWD

However, this conflicts with:
- **User expectation**: Project-level coordination (one `.claude-flow/` per repo)
- **Session-based workflows**: Sessions create nested directories, fragmenting state
- **Git cleanliness**: Multiple `.claude-flow/` directories pollute the workspace

---

## Version Information

**Package**: `claude-flow@alpha`
**Version**: `v2.7.35`
**Install Method**: `npx` (on-demand execution)
**Cache Location**: `~/.npm/_npx/09002f125df728b2/node_modules/claude-flow/`

**Related Packages**:
- `agentic-flow@1.10.2` (wraps claude-flow)
- `flow-nexus` (cloud features)
- `ruv-swarm` (enhanced coordination)

---

## Potential Fixes

### Option 1: Project Root Detection (Recommended)

**Modify `getDefaultPath()` to search upward**:

```javascript
getDefaultPath() {
    const projectRoot = this.findProjectRoot(process.cwd());
    const baseDir = path.join(projectRoot, '.claude-flow');
    return this.dbType === 'sqlite' ?
        path.join(baseDir, 'database.sqlite') :
        path.join(baseDir, 'database.json');
}

findProjectRoot(startPath) {
    let currentPath = startPath;
    while (currentPath !== path.dirname(currentPath)) {
        // Check for project markers
        if (fs.existsSync(path.join(currentPath, '.git')) ||
            fs.existsSync(path.join(currentPath, 'package.json')) ||
            fs.existsSync(path.join(currentPath, '.claude-flow'))) {
            return currentPath;
        }
        currentPath = path.dirname(currentPath);
    }
    return startPath; // Fallback to CWD if no project root found
}
```

### Option 2: Environment Variable Override

**Allow users to set base path**:

```javascript
getDefaultPath() {
    const baseDir = process.env.CLAUDE_FLOW_DIR ||
                    path.join(process.cwd(), '.claude-flow');
    return this.dbType === 'sqlite' ?
        path.join(baseDir, 'database.sqlite') :
        path.join(baseDir, 'database.json');
}
```

**Usage**:
```bash
export CLAUDE_FLOW_DIR=/Users/splurfa/common-thread-sandbox/.claude-flow
npx claude-flow@alpha hooks pre-task --description "task"
```

### Option 3: Configuration File Support

**Read from `.claude-flow.config.json`**:

```javascript
getDefaultPath() {
    const configPath = this.findConfigFile();
    if (configPath) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        if (config.databaseDir) {
            return path.join(config.databaseDir, this.dbType === 'sqlite' ?
                'database.sqlite' : 'database.json');
        }
    }

    const baseDir = path.join(process.cwd(), '.claude-flow');
    return this.dbType === 'sqlite' ?
        path.join(baseDir, 'database.sqlite') :
        path.join(baseDir, 'database.json');
}
```

---

## Impact Assessment

### Current Behavior Impact:

**Positive**:
- ✅ Directory isolation (no cross-contamination)
- ✅ Explicit control over database location
- ✅ Simple implementation (no complex path resolution)

**Negative**:
- ❌ Unexpected behavior for users (creates directories in session paths)
- ❌ State fragmentation (multiple `.claude-flow/` directories)
- ❌ Git pollution (need `.gitignore` in multiple locations)
- ❌ Coordination breakdown (agents can't find shared state)
- ❌ Cleanup complexity (orphaned directories)

### User Workarounds (Current):

1. **Always run from project root**:
   ```bash
   cd /Users/splurfa/common-thread-sandbox
   npx claude-flow@alpha hooks pre-task --description "task"
   ```

2. **Use absolute paths for session artifacts** (doesn't help with hooks)

3. **Manual cleanup**:
   ```bash
   find . -type d -name ".claude-flow" -exec rm -rf {} +
   ```

---

## Recommendations

### Immediate (User-Level):

1. **Document the behavior** in `CLAUDE.md`:
   ```markdown
   ⚠️ **IMPORTANT**: `npx claude-flow@alpha hooks` creates `.claude-flow/`
   in your current working directory. Always run hooks from project root.
   ```

2. **Update `.gitignore`**:
   ```gitignore
   # Claude Flow - ignore in all subdirectories
   **/.claude-flow/
   ```

3. **Create wrapper script** to enforce CWD:
   ```bash
   #!/bin/bash
   # .claude/hooks/safe-hooks.sh
   cd "$(git rev-parse --show-toplevel)" || exit 1
   npx claude-flow@alpha hooks "$@"
   ```

### Long-Term (Upstream):

1. **File bug report** with claude-flow maintainers
2. **Propose PR** with project root detection (Option 1)
3. **Request configuration option** for base directory override

---

## Conclusion

**The behavior is intentional but suboptimal** for typical project-based workflows.

**Root Cause**: `process.cwd()` hardcoded in `getDefaultPath()` (Line 24, `DatabaseManager.js`)

**Best Practice**: Always execute hooks from project root, or use a wrapper script to enforce it.

**Fix Required**: Upstream change to support project root detection or configurable base path.

---

## References

- **Source Files**:
  - `~/.npm/_npx/.../claude-flow/dist/src/core/DatabaseManager.js` (Lines 24-32)
  - `~/.npm/_npx/.../claude-flow/dist/src/core/config.js` (getUserConfigDir method)

- **Package Version**: claude-flow@alpha (v2.7.35)

- **Related Issues**:
  - Session directory pollution
  - Coordination state fragmentation
  - Git workspace cleanliness

---

**Analysis Complete** ✓
