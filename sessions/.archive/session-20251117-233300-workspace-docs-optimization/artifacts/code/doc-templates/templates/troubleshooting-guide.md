# Troubleshooting: [System/Feature Name]

> **Status**: [Draft|Review|Published|Archived]
> **Last Updated**: YYYY-MM-DD
> **Verified**: [✅ Examples tested|⚠️ Needs verification|❌ Unverified]

## Overview

**What this covers**: Types of issues addressed

**Quick diagnostic**: Run this first

```bash
# Health check command
diagnostic-command --check-all

# Expected healthy output:
✅ Component 1: OK
✅ Component 2: OK
✅ Component 3: OK
```

**If all checks pass**: Issue may not be covered here, see [Getting Help](#getting-help)

---

## Quick Fixes

Try these common solutions first:

### 1. Clear cache and restart
```bash
npm cache clean --force
rm -rf node_modules
npm install
```

### 2. Update dependencies
```bash
npm update
npm audit fix
```

### 3. Verify configuration
```bash
npx tool-name verify-config
```

**If quick fixes don't work**: Continue to detailed troubleshooting below

---

## Diagnostic Decision Tree

```
Issue Type?
├── Installation problems → [Installation Issues](#installation-issues)
├── Configuration errors → [Configuration Issues](#configuration-issues)
├── Runtime failures → [Runtime Issues](#runtime-issues)
├── Performance problems → [Performance Issues](#performance-issues)
└── Unexpected behavior → [Behavior Issues](#behavior-issues)
```

---

## Installation Issues

### Issue: Package installation fails

**Symptoms**:
```
npm ERR! code EACCES
npm ERR! syscall access
npm ERR! path /usr/local/lib/node_modules
```

**Diagnosis**:
```bash
# Check npm permissions
npm config get prefix
ls -la $(npm config get prefix)
```

**Cause**: Permission issues with npm global directory

**Solution**:

#### Option 1: Fix npm permissions (recommended)
```bash
# Create directory for global packages
mkdir ~/.npm-global

# Configure npm to use new directory
npm config set prefix '~/.npm-global'

# Add to PATH in ~/.profile or ~/.zshrc
export PATH=~/.npm-global/bin:$PATH

# Reload shell config
source ~/.profile
```

#### Option 2: Use npx (no installation)
```bash
npx package-name [command]
```

**Verification**:
```bash
npm install -g package-name
# Should complete without errors
```

**Prevention**: Always use npx for occasional commands, reserve global installs for frequently used tools

---

### Issue: Module not found after installation

**Symptoms**:
```
Error: Cannot find module 'package-name'
```

**Diagnosis**:
```bash
# Check if package is installed
npm list package-name

# Check node_modules
ls node_modules | grep package-name

# Check package.json
cat package.json | grep package-name
```

**Possible causes**:
1. Package installed in wrong location
2. Wrong version of Node.js
3. Corrupted node_modules

**Solution**:
```bash
# Remove and reinstall
rm -rf node_modules package-lock.json
npm install

# If still failing, check Node version
node --version
# Should be v16+ (check project requirements)

# Install with specific version if needed
npm install package-name@1.2.3
```

**Verification**:
```bash
node -e "require('package-name')"
# Should complete without errors
```

---

## Configuration Issues

### Issue: Invalid configuration file

**Symptoms**:
```
Error: Configuration file is invalid
SyntaxError: Unexpected token } in JSON at position 42
```

**Diagnosis**:
```bash
# Validate JSON
cat .config-file.json | jq .
# OR
npx jsonlint .config-file.json
```

**Common causes**:
1. Invalid JSON syntax (trailing comma, missing quote)
2. Wrong field names
3. Invalid values for required fields

**Solution**:

1. **Fix JSON syntax**:
```bash
# Use a validator to find exact issue
npx jsonlint .config-file.json
```

2. **Check against schema**:
```bash
# Validate against schema (if available)
npx ajv validate -s schema.json -d .config-file.json
```

3. **Reset to defaults**:
```bash
# Backup current config
mv .config-file.json .config-file.json.backup

# Generate new config
npx tool-name init
```

**Verification**:
```bash
npx tool-name validate-config
# Should show: ✅ Configuration valid
```

---

### Issue: Configuration ignored or not loaded

**Symptoms**:
- Tool uses default settings despite config file
- No error messages about config

**Diagnosis**:
```bash
# Check config file location
npx tool-name show-config-path

# Check config file is being read
npx tool-name show-config
```

**Possible causes**:
1. Config file in wrong location
2. Wrong file name
3. ENV vars overriding config

**Solution**:
```bash
# Check expected config locations
npx tool-name config-locations

# Move config to correct location
mv .config-file.json $(npx tool-name config-locations | head -1)

# Check for ENV var overrides
env | grep TOOL_NAME_
```

**Verification**:
```bash
npx tool-name show-config
# Should show your custom settings
```

---

## Runtime Issues

### Issue: Command fails with [specific error]

**Symptoms**:
```
Error: [Error message]
at [stack trace]
```

**Diagnosis**:
```bash
# Run with debug logging
DEBUG=* npx tool-name command

# Check system resources
df -h  # Disk space
free -m  # Memory (Linux)
top  # CPU usage
```

**Possible causes**:
1. Insufficient resources
2. File permission issues
3. Missing dependencies

**Solution**:

1. **Check resources**:
```bash
# Free up disk space if needed
npm cache clean --force
rm -rf /tmp/*

# Check memory usage
# Kill memory-intensive processes if needed
```

2. **Fix permissions**:
```bash
# Fix file permissions
chmod +x script.sh
chmod -R 755 directory/
```

3. **Verify dependencies**:
```bash
# Check all dependencies are installed
npm list --depth=0

# Reinstall if needed
npm install
```

**Verification**:
```bash
npx tool-name command
# Should complete successfully
```

---

## Performance Issues

### Issue: Operation is extremely slow

**Symptoms**:
- Command takes >5 minutes (should be seconds)
- High CPU usage
- System becomes unresponsive

**Diagnosis**:
```bash
# Profile the operation
time npx tool-name command

# Check what's consuming resources
top  # Or Activity Monitor on macOS

# Check for large files
du -sh *
find . -type f -size +100M
```

**Possible causes**:
1. Processing too many files
2. Large file sizes
3. Inefficient configuration

**Solution**:

1. **Optimize file selection**:
```bash
# Use more specific patterns
npx tool-name command --include="src/**/*.js"

# Exclude large directories
npx tool-name command --exclude="node_modules/**"
```

2. **Use caching**:
```bash
# Enable caching if available
npx tool-name command --cache
```

3. **Process in batches**:
```bash
# Split into smaller operations
npx tool-name command --batch-size=10
```

**Verification**:
```bash
time npx tool-name command
# Should complete in reasonable time (<30s)
```

---

## Behavior Issues

### Issue: Unexpected output or results

**Symptoms**:
- Output doesn't match expectations
- Files modified incorrectly
- Features don't work as documented

**Diagnosis**:
```bash
# Check version
npx tool-name --version

# Check for updates
npm outdated

# Review recent changes
git log --oneline -10
```

**Possible causes**:
1. Wrong version of tool
2. Breaking changes in update
3. Misunderstanding of feature

**Solution**:

1. **Verify version**:
```bash
# Check documented version
cat docs/requirements.md

# Install specific version if needed
npm install tool-name@1.2.3
```

2. **Check changelog**:
```bash
# Review breaking changes
npx tool-name changelog

# Or check GitHub releases
```

3. **Verify expected behavior**:
```bash
# Run with explicit options
npx tool-name command --option=expected-value

# Compare with documentation example
```

**Verification**:
```bash
# Run documented example
# Should produce documented output
```

---

## Error Code Reference

### ERR_001: [Error Name]

**Message**: "Error message text"

**Cause**: What causes this

**Solution**: How to fix

**Example**: Command that triggers and fix

### ERR_002: [Error Name]

**Message**: "Error message text"

**Cause**: What causes this

**Solution**: How to fix

---

## Prevention Checklist

Avoid common issues by following these practices:

- [ ] Keep dependencies up to date: `npm update`
- [ ] Use specific versions in package.json
- [ ] Validate configuration after changes
- [ ] Test in clean environment before deployment
- [ ] Monitor resource usage
- [ ] Keep documentation current with code
- [ ] Run health checks regularly

---

## Getting Help

If this guide doesn't solve your issue:

### 1. Gather diagnostic information
```bash
# Create diagnostic report
npx tool-name diagnostic > diagnostic-report.txt
```

### 2. Search existing issues
- GitHub issues: [link]
- Stack Overflow: [link]
- Community forum: [link]

### 3. File a bug report

**Include**:
- Exact error message
- Steps to reproduce
- System information (`node --version`, `npm --version`)
- Diagnostic report
- Expected vs actual behavior

**Template**:
```markdown
**Environment**
- Node version: vX.Y.Z
- npm version: vX.Y.Z
- OS: macOS/Linux/Windows
- Tool version: vX.Y.Z

**Steps to reproduce**
1. Step 1
2. Step 2
3. Step 3

**Expected behavior**
What should happen

**Actual behavior**
What actually happens

**Error message**
```
Error text here
```

**Diagnostic report**
Attach diagnostic-report.txt
```

---

## Maintenance Notes

**Last verified**: YYYY-MM-DD by [name]

**Verification steps**:
1. Reproduce each issue
2. Verify each solution works
3. Test diagnostic commands
4. Validate error codes

**Known issues**: None | [List unresolved issues]

**Planned improvements**: [Future additions]

---

## Metadata

```yaml
doc_type: troubleshooting_guide
category: troubleshooting
difficulty: intermediate
estimated_time: varies
tags: [troubleshooting, debugging, errors, issues]
dependencies: []
validation_status: verified
last_test_date: YYYY-MM-DD
issues_covered: 15
success_rate: 95%
```
