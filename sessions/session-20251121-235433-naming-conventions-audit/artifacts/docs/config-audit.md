# Configuration and Package Naming Consistency Audit

**Session**: session-20251121-235433-naming-conventions-audit
**Date**: 2025-11-21
**Audit Scope**: All configuration and package files for naming inconsistencies

---

## Executive Summary

**Critical Finding**: The workspace has a **fundamental naming mismatch**:
- **Local directory name**: `claude-code-sandbox`
- **Git remote repository**: `common-thread` (git@github.com:Splurfa/common-thread.git)
- **README.md title**: "Common Thread Sandbox"

This creates confusion and potential issues with:
- Repository cloning and setup
- Documentation accuracy
- User onboarding
- File path references in code

**Total Issues Found**: 12 files with naming inconsistencies

---

## Category 1: Critical - Git Configuration Mismatch

### File: `.git/config`

**Location**: `/Users/splurfa/claude-code-sandbox/.git/config`

**Current Value**:
```ini
[remote "origin"]
	url = git@github.com:Splurfa/common-thread.git
	fetch = +refs/heads/*:refs/remotes/origin/*
```

**Issue**: Git remote points to `common-thread` but local directory is `claude-code-sandbox`

**Proposed Update**:
Option 1: Rename repository to match local directory
```ini
[remote "origin"]
	url = git@github.com:Splurfa/claude-code-sandbox.git
```

Option 2: Rename local directory to match repository
```bash
# Rename directory: claude-code-sandbox → common-thread
```

**Impact Assessment**:
- **Severity**: HIGH
- **User Impact**: Confusion during clone, setup instructions become inaccurate
- **Breaking Changes**: Repository URL change requires all users to update remotes
- **Recommendation**: Use Option 1 (rename GitHub repo) if possible, OR clearly document the mismatch

---

## Category 2: Documentation Consistency

### File 1: `README.md`

**Location**: `/Users/splurfa/claude-code-sandbox/README.md`

**Current Value** (line 1):
```markdown
# Common Thread Sandbox
```

**Issue**: Title uses "Common Thread" while directory is "claude-code-sandbox"

**Proposed Update**:
```markdown
# Claude Code Sandbox

A workspace built on **Three Principles** for AI-human collaboration:
```

**Alternative**:
```markdown
# Common Thread - Claude Code Sandbox

A workspace built on **Three Principles** for AI-human collaboration:
```

**Impact Assessment**:
- **Severity**: MEDIUM
- **User Impact**: First impression of project, branding confusion
- **Breaking Changes**: None (documentation only)
- **Recommendation**: Align with chosen repository name

---

### File 2: `.claude/skills/tour-guide/README.md`

**Location**: `/Users/splurfa/claude-code-sandbox/.claude/skills/tour-guide/README.md`

**Current Value**:
```markdown
Tour-guide provides a personalized, interactive walkthrough of the common-thread workspace.
```

**Proposed Update**:
```markdown
Tour-guide provides a personalized, interactive walkthrough of the claude-code-sandbox workspace.
```

**Impact Assessment**:
- **Severity**: LOW
- **User Impact**: Tutorial accuracy
- **Breaking Changes**: None

---

### File 3: `.claude/skills/tour-guide/docs/tour-scripts/beginner-tour.md`

**Location**: `/Users/splurfa/claude-code-sandbox/.claude/skills/tour-guide/docs/tour-scripts/beginner-tour.md`

**Current Value** (multiple references):
```markdown
Hello and welcome to your workspace tour! If you're reading this, you've just opened a special development environment called "claude-code-sandbox."

...

claude-code-sandbox/              (the main workspace folder)
```

**Issue**: Inconsistent with "Common Thread" branding from README

**Proposed Update**:
Keep as-is if directory name is authoritative, OR update to match repository name

**Impact Assessment**:
- **Severity**: LOW
- **User Impact**: Tutorial consistency
- **Breaking Changes**: None

---

### File 4: `.claude/skills/tour-guide/docs/tour-scripts/expert-tour.md`

**Location**: `/Users/splurfa/claude-code-sandbox/.claude/skills/tour-guide/docs/tour-scripts/expert-tour.md`

**Current Value**:
```markdown
git clone https://github.com/yourusername/claude-code-sandbox.git
cd claude-code-sandbox
```

**Issue**: Uses placeholder username and incorrect repository name

**Proposed Update**:
```markdown
git clone git@github.com:Splurfa/common-thread.git
cd common-thread
```

OR (if repository renamed):
```markdown
git clone git@github.com:Splurfa/claude-code-sandbox.git
cd claude-code-sandbox
```

**Impact Assessment**:
- **Severity**: HIGH
- **User Impact**: Expert onboarding broken
- **Breaking Changes**: None (fixes existing issue)
- **Recommendation**: Use actual repository URL

---

### File 5: `docs/setup/quick-start.md`

**Location**: `/Users/splurfa/claude-code-sandbox/docs/setup/quick-start.md`

**Current Value**:
```markdown
- Working directory: `/Users/[username]/claude-code-sandbox/`
```

**Issue**: Path assumes directory name is `claude-code-sandbox` but git repo is `common-thread`

**Proposed Update** (if repository renamed):
```markdown
- Working directory: `/Users/[username]/claude-code-sandbox/`
```

OR (if directory renamed):
```markdown
- Working directory: `/Users/[username]/common-thread/`
```

**Impact Assessment**:
- **Severity**: MEDIUM
- **User Impact**: Setup instructions accuracy
- **Breaking Changes**: None

---

### File 6: `docs/operate/workspace-tour.md`

**Location**: `/Users/splurfa/claude-code-sandbox/docs/operate/workspace-tour.md`

**Current Value**:
```markdown
claude-code-sandbox/           ← You are here
...
claude-code-sandbox/
...
  "name": "claude-code-sandbox",
```

**Issue**: Inconsistent with git repository name

**Proposed Update**: Align with final decision on naming

**Impact Assessment**:
- **Severity**: LOW
- **User Impact**: Documentation accuracy
- **Breaking Changes**: None

---

## Category 3: Package Configuration

### File 1: `package.json`

**Location**: `/Users/splurfa/claude-code-sandbox/package.json`

**Current Value**:
```json
{
  "name": "claude-code-sandbox",
  "dependencies": {
    "better-sqlite3": "^12.4.1",
    "express": "^5.1.0",
    "ws": "^8.18.3"
  }
}
```

**Issues**:
1. Missing critical metadata (description, version, repository, author, license)
2. Name doesn't match git repository
3. No repository field pointing to GitHub

**Proposed Update**:
```json
{
  "name": "common-thread",
  "version": "1.0.0",
  "description": "A structured workspace for AI-human collaboration built on claude-flow orchestration",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/Splurfa/common-thread.git"
  },
  "bugs": {
    "url": "https://github.com/Splurfa/common-thread/issues"
  },
  "homepage": "https://github.com/Splurfa/common-thread#readme",
  "author": "Splurfa",
  "license": "MIT",
  "keywords": [
    "claude-flow",
    "ai-orchestration",
    "development-workspace",
    "session-management"
  ],
  "engines": {
    "node": ">=18.0.0"
  },
  "dependencies": {
    "better-sqlite3": "^12.4.1",
    "express": "^5.1.0",
    "ws": "^8.18.3"
  },
  "devDependencies": {
    "sqlite3": "^5.1.7",
    "uuid": "^13.0.0"
  }
}
```

**Impact Assessment**:
- **Severity**: HIGH
- **User Impact**: NPM publishing, package identification, GitHub integration
- **Breaking Changes**: Package name change affects npm publish
- **Recommendation**: Add all missing metadata, align name with repository

---

### File 2: `package-lock.json`

**Location**: `/Users/splurfa/claude-code-sandbox/package-lock.json`

**Current Value** (line 2):
```json
{
  "name": "claude-code-sandbox",
  "lockfileVersion": 3,
  ...
}
```

**Issue**: Name doesn't match git repository

**Proposed Update**:
After updating package.json, regenerate package-lock.json:
```bash
rm package-lock.json
npm install
```

**Impact Assessment**:
- **Severity**: MEDIUM
- **User Impact**: NPM dependency resolution
- **Breaking Changes**: Regeneration recommended
- **Recommendation**: Auto-regenerate after package.json update

---

### File 3: `.claude/skills/tutor-mode/bin/package.json`

**Location**: `/Users/splurfa/claude-code-sandbox/.claude/skills/tutor-mode/bin/package.json`

**Current Value**:
```json
{
  "name": "tutor-mode",
  "version": "1.0.0",
  "description": "Interactive learning assistant for claude-flow orchestration",
  "author": "Claude Flow Team",
  "license": "MIT"
}
```

**Issue**: No repository field, generic author

**Proposed Update**:
```json
{
  "name": "tutor-mode",
  "version": "1.0.0",
  "description": "Interactive learning assistant for claude-flow orchestration",
  "main": "index.js",
  "bin": {
    "tutor-mode": "./index.js"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/Splurfa/common-thread.git",
    "directory": ".claude/skills/tutor-mode"
  },
  "author": "Splurfa",
  "license": "MIT",
  "keywords": [
    "claude-flow",
    "tutor",
    "learning",
    "assistant"
  ],
  "engines": {
    "node": ">=18.0.0"
  },
  "dependencies": {}
}
```

**Impact Assessment**:
- **Severity**: LOW
- **User Impact**: Skill discoverability
- **Breaking Changes**: None
- **Recommendation**: Add repository field for attribution

---

### File 4: `.claude/skills/tour-guide/tour-guide.yaml`

**Location**: `/Users/splurfa/claude-code-sandbox/.claude/skills/tour-guide/tour-guide.yaml`

**Current Value**:
```yaml
author: claude-code-sandbox
```

**Issue**: Inconsistent author attribution (should be user or org name, not workspace name)

**Proposed Update**:
```yaml
author: Splurfa
workspace: common-thread
```

OR:
```yaml
author: Splurfa
workspace: claude-code-sandbox
```

**Impact Assessment**:
- **Severity**: LOW
- **User Impact**: Attribution clarity
- **Breaking Changes**: None
- **Recommendation**: Use GitHub username/org as author

---

## Category 4: Hardcoded Paths

### File: `.swarm/hooks/inbox-archive.js`

**Location**: `/Users/splurfa/claude-code-sandbox/.swarm/hooks/inbox-archive.js`

**Current Value** (line 1):
```javascript
const workspaceRoot = '/Users/splurfa/common-thread-sandbox';
```

**Issue**: Hardcoded path points to non-existent directory `common-thread-sandbox`

**Proposed Update**:
```javascript
const workspaceRoot = process.env.WORKSPACE_ROOT || '/Users/splurfa/claude-code-sandbox';
```

OR (if directory renamed):
```javascript
const workspaceRoot = process.env.WORKSPACE_ROOT || '/Users/splurfa/common-thread';
```

**Impact Assessment**:
- **Severity**: HIGH
- **User Impact**: Inbox archival broken
- **Breaking Changes**: None (fixes existing bug)
- **Recommendation**: Use environment variable or dynamic path resolution

---

## Category 5: External Agent Workspaces (Informational)

### Files in `inbox/user/common-thread-website/`

**Location**: `/Users/splurfa/claude-code-sandbox/inbox/user/common-thread-website/`

**Current Values**:
- `package.json`: `"name": "common-thread"`
- `App.tsx`: `hello@common-thread.io`
- `components/Visuals.tsx`: `https://common-thread.io`

**Issue**: External project, appears to be separate website/branding

**Proposed Update**: No changes needed - this is external user content

**Impact Assessment**:
- **Severity**: NONE
- **User Impact**: None (external content in inbox/)
- **Recommendation**: Leave as-is per external agent protocol

---

## Recommended Resolution Strategy

### Decision Required: Choose One Naming Convention

**Option A: Repository → claude-code-sandbox** (Recommended)
1. Rename GitHub repository: `common-thread` → `claude-code-sandbox`
2. Update git remote URL
3. Update package.json name
4. Update README.md title
5. Minimal documentation changes

**Option B: Directory → common-thread**
1. Rename local directory: `claude-code-sandbox` → `common-thread`
2. Update all absolute paths
3. Update documentation references
4. More invasive changes

**Option C: Dual Branding** (Not Recommended)
1. Keep git repo as `common-thread`
2. Keep directory as `claude-code-sandbox`
3. Update README to explain: "Common Thread (claude-code-sandbox)"
4. Document the mismatch clearly
5. High maintenance overhead

### Recommended: Option A

**Rationale**:
- Least invasive (repository rename is GitHub-side)
- Directory name already matches most documentation
- Package.json already uses `claude-code-sandbox`
- Skills already reference `claude-code-sandbox`
- Users clone into expected directory name

---

## Impact Summary

### Files Requiring Updates (Option A - Rename Repo)

| File | Change Type | Severity | Breaking |
|------|-------------|----------|----------|
| `.git/config` | Git remote URL | HIGH | Yes* |
| `README.md` | Title update | MEDIUM | No |
| `package.json` | Add metadata, update repo URL | HIGH | No |
| `package-lock.json` | Regenerate | MEDIUM | No |
| `.swarm/hooks/inbox-archive.js` | Fix hardcoded path | HIGH | No |
| `.claude/skills/tour-guide/README.md` | Update workspace name | LOW | No |
| `.claude/skills/tour-guide/docs/tour-scripts/expert-tour.md` | Fix clone URL | HIGH | No |
| `.claude/skills/tour-guide/tour-guide.yaml` | Update author | LOW | No |
| `.claude/skills/tutor-mode/bin/package.json` | Add repo field | LOW | No |

\* Breaking for existing clones (requires `git remote set-url origin <new-url>`)

### Estimated Time to Implement

- **Repository Rename**: 5 minutes (GitHub UI)
- **File Updates**: 15 minutes
- **Testing**: 10 minutes
- **Documentation**: 10 minutes
- **Total**: ~40 minutes

---

## Testing Checklist

After implementing changes:

- [ ] Git remote URL resolves correctly
- [ ] `git pull` works from new URL
- [ ] Clone instructions in expert-tour.md work
- [ ] Inbox archival script resolves correct path
- [ ] package.json metadata displays on npm/GitHub
- [ ] Skills reference correct workspace name
- [ ] Documentation links work
- [ ] No broken absolute paths

---

## Additional Findings (Non-Naming Issues)

### Missing Configuration Files

1. **No `.gitignore`** - Should exclude:
   - `node_modules/`
   - `.swarm/memory.db`
   - `.DS_Store`
   - `*.log`

2. **No LICENSE file** - package.json declares "MIT" but no LICENSE file exists

3. **No CONTRIBUTING.md** - Good practice for open source

4. **No .github/workflows/** - No CI/CD automation

### Incomplete package.json Metadata

Missing fields:
- `version` (defaults to 1.0.0)
- `description`
- `repository`
- `bugs`
- `homepage`
- `keywords`
- `engines`

---

## Appendix A: Full File Search Results

### Files with "common-thread" references:
```
/Users/splurfa/claude-code-sandbox/inbox/user/common-thread-website/App.tsx
/Users/splurfa/claude-code-sandbox/inbox/user/common-thread-website/components/Visuals.tsx
/Users/splurfa/claude-code-sandbox/inbox/user/common-thread-website/package.json
/Users/splurfa/claude-code-sandbox/.claude/skills/tour-guide/README.md
/Users/splurfa/claude-code-sandbox/.swarm/hooks/inbox-archive.js
/Users/splurfa/claude-code-sandbox/README.md (title)
```

### Files with "claude-code-sandbox" references:
```
/Users/splurfa/claude-code-sandbox/package.json
/Users/splurfa/claude-code-sandbox/package-lock.json
/Users/splurfa/claude-code-sandbox/.claude/skills/tour-guide/docs/tour-scripts/beginner-tour.md
/Users/splurfa/claude-code-sandbox/.claude/skills/tour-guide/docs/tour-scripts/expert-tour.md
/Users/splurfa/claude-code-sandbox/docs/setup/quick-start.md
/Users/splurfa/claude-code-sandbox/docs/operate/workspace-tour.md
```

---

## Appendix B: Proposed New package.json (Full)

```json
{
  "name": "claude-code-sandbox",
  "version": "1.0.0",
  "description": "A structured workspace for AI-human collaboration built on claude-flow orchestration. Features automatic session management, agent coordination, and comprehensive learning resources.",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/Splurfa/claude-code-sandbox.git"
  },
  "bugs": {
    "url": "https://github.com/Splurfa/claude-code-sandbox/issues"
  },
  "homepage": "https://github.com/Splurfa/claude-code-sandbox#readme",
  "author": "Splurfa",
  "license": "MIT",
  "keywords": [
    "claude-flow",
    "ai-orchestration",
    "development-workspace",
    "session-management",
    "agent-coordination",
    "sparc-methodology"
  ],
  "engines": {
    "node": ">=18.0.0"
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "lint": "echo \"Linting not configured\"",
    "build": "echo \"Build not configured\""
  },
  "dependencies": {
    "better-sqlite3": "^12.4.1",
    "express": "^5.1.0",
    "ws": "^8.18.3"
  },
  "devDependencies": {
    "sqlite3": "^5.1.7",
    "uuid": "^13.0.0"
  }
}
```

---

## Conclusion

The workspace has a **critical naming inconsistency** between:
- Local directory: `claude-code-sandbox`
- Git repository: `common-thread`

**Recommendation**: Rename GitHub repository to `claude-code-sandbox` and update all references (Option A).

This audit identified **12 files** requiring updates across 4 categories:
1. Git configuration (1 file) - CRITICAL
2. Documentation (6 files) - MEDIUM
3. Package configuration (4 files) - HIGH
4. Hardcoded paths (1 file) - CRITICAL

**Total effort**: ~40 minutes to resolve all issues.

**Next Steps**:
1. Get user approval on naming convention (Option A recommended)
2. Implement changes in priority order (Critical → High → Medium → Low)
3. Test all updated configurations
4. Update session documentation with chosen convention
