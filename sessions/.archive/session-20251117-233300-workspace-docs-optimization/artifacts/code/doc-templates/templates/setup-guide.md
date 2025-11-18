# Setup Guide: [Feature/Tool Name]

> **Status**: [Draft|Review|Published|Archived]
> **Last Updated**: YYYY-MM-DD
> **Verified**: [✅ Examples tested|⚠️ Needs verification|❌ Unverified]

## Overview

**What you'll set up**: Brief description

**Time required**: ~X minutes

**Prerequisites**:
- [ ] Prerequisite 1 (link to setup if complex)
- [ ] Prerequisite 2
- [ ] Prerequisite 3

**What you'll get**: Capabilities after setup

---

## Quick Setup (TL;DR)

For experienced users who want the fastest path:

```bash
# Copy-paste ready commands
npm install package-name
npx package-name init
# Configure...
```

**Verification**:
```bash
npx package-name --version
# Expected: v1.2.3
```

**Done!** Skip to [Usage Examples](#usage-examples)

---

## Detailed Setup

### Step 1: Installation

**What this does**: Explanation of what's being installed

```bash
# Installation command with explanation
npm install package-name --save-dev
```

**Expected output**:
```
added 1 package in 2s
```

**Troubleshooting**:
- If you see `EACCES` error → Run with sudo or fix npm permissions
- If installation hangs → Check network connection

### Step 2: Configuration

**What this does**: Explanation of configuration

**Create configuration file**:
```bash
# Generate config
npx package-name init
```

**Edit configuration**:
```json
// .config-file.json
{
  "setting1": "value",
  "setting2": "value"
}
```

**Configuration options**:
- `setting1`: [Required] Description and valid values
- `setting2`: [Optional] Description and defaults

### Step 3: Verification

**Test the setup**:
```bash
# Verification command
npx package-name test-setup
```

**Expected result**:
```
✅ Configuration valid
✅ Dependencies installed
✅ Setup complete
```

**If verification fails**: See [Troubleshooting](#troubleshooting)

---

## Usage Examples

### Example 1: Basic Usage

```bash
# Basic command
npx package-name run

# Expected output:
Running package-name...
✅ Success!
```

### Example 2: Advanced Usage

```bash
# Advanced command with options
npx package-name run --option value

# Expected output:
Running with option=value...
✅ Success!
```

---

## Configuration Reference

### Required Settings

**setting1**:
- **Type**: string|number|boolean
- **Purpose**: What this controls
- **Example**: `"value"`
- **Validation**: Valid values or constraints

### Optional Settings

**setting2**:
- **Type**: string|number|boolean
- **Default**: default-value
- **Purpose**: What this controls
- **Example**: `"value"`

---

## Troubleshooting

### Installation Issues

**Issue**: Package not found

**Solution**:
```bash
# Clear npm cache
npm cache clean --force
npm install package-name
```

### Configuration Issues

**Issue**: Invalid configuration

**Solution**:
1. Validate JSON syntax
2. Check required fields
3. Verify value types

### Runtime Issues

**Issue**: Command not found

**Solution**:
```bash
# Verify installation
npm list package-name

# Reinstall if needed
npm install package-name
```

---

## Next Steps

After setup is complete:

1. **Learn the basics**: [Link to tutorial]
2. **Try common workflows**: [Link to how-to guides]
3. **Explore advanced features**: [Link to reference]

---

## Maintenance Notes

**Last verified**: YYYY-MM-DD by [name]

**Verification steps**:
1. Clean environment test
2. Run all installation steps
3. Verify all commands work
4. Test troubleshooting solutions

**Version tested**: v1.2.3

**Known issues**: None | [List issues with workarounds]

---

## Metadata

```yaml
doc_type: setup_guide
category: getting-started
difficulty: beginner
estimated_time: 15min
tags: [setup, installation, configuration]
dependencies: []
validation_status: verified
last_test_date: YYYY-MM-DD
test_environment: "Node v18.x, npm v9.x"
```
