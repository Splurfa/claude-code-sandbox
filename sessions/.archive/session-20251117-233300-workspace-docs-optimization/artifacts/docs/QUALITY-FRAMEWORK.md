# Documentation Quality Framework

**Version**: 1.0.0
**Last Updated**: 2025-11-18
**Status**: Active

## Executive Summary

This framework ensures all documentation is accurate, testable, and maintainable through systematic verification, automated testing, and evidence-based standards.

**Core Principle**: Every documented feature, command, or example must be verifiable through automated testing or explicit evidence.

---

## 1. Truth Testing Methodology

### 1.1 Command Verification

**Standard**: All CLI commands must be executable and produce documented results.

```bash
# Test Process:
# 1. Extract all commands from documentation
# 2. Execute in clean environment
# 3. Verify exit codes and output
# 4. Document results

# Example verification:
npx claude-flow@alpha --version  # Must return version number
npx claude-flow@alpha hooks pre-task --help  # Must show help text
```

**Verification Levels**:
- **Level 1 (Critical)**: Command executes without error
- **Level 2 (Important)**: Output matches documented format
- **Level 3 (Comprehensive)**: Side effects match documentation (files created, state changed)

### 1.2 Example Testing

**Standard**: All code examples must be syntactically valid and executable.

```javascript
// Documentation example extraction pattern:
// ```javascript
// const example = "code";
// ```

// Verification steps:
// 1. Extract code blocks by language
// 2. Create temporary test file
// 3. Run through appropriate interpreter/compiler
// 4. Verify no syntax errors
// 5. Check expected output if provided
```

**Test Categories**:
- **Syntax Tests**: Code parses without errors
- **Type Tests**: TypeScript examples pass type checking
- **Execution Tests**: Runnable examples produce expected results
- **Integration Tests**: Multi-step examples work end-to-end

### 1.3 Feature Validation

**Standard**: Documented features must exist in codebase or be explicitly marked as planned.

```bash
# Feature verification process:
# 1. Parse documentation for feature claims
# 2. Search codebase for implementation
# 3. Check git history for removal
# 4. Verify in package dependencies

# Example checks:
grep -r "swarm_init" node_modules/claude-flow/  # MCP tool exists?
npm view claude-flow@alpha version  # Package version correct?
```

**Evidence Requirements**:
- **Implemented Features**: Link to code file and line number
- **CLI Commands**: Show --help output or source code reference
- **MCP Tools**: Reference in package or source code
- **Configuration Options**: Show in config schema or documentation

### 1.4 Aspirational Content Detection

**Standard**: Distinguish between current capabilities and planned features.

**Detection Patterns**:
```markdown
# Red flags in documentation:
- "Will support..." (future tense)
- "Coming soon"
- "Planned features"
- "Roadmap includes"
- Features without version numbers
- Examples that don't run

# Required markers for aspirational content:
> **Status**: Planned for v2.1.0
> **Status**: Experimental (requires flag)
> **Status**: Coming Soon - ETA: Q1 2025
```

**Enforcement**:
- All future features MUST have status markers
- All current features MUST have verification evidence
- Mixed content MUST clearly separate current from planned

---

## 2. Automated Verification System

### 2.1 Command Testing Script

**File**: `scripts/verify-docs-commands.sh`

```bash
#!/usr/bin/env bash
# Documentation Command Verification
# Tests all commands in documentation

set -euo pipefail

DOCS_DIR="${1:-docs}"
REPORT_FILE="docs-verification-report.txt"
FAILED_COMMANDS=()

echo "Documentation Command Verification Report" > "$REPORT_FILE"
echo "Date: $(date)" >> "$REPORT_FILE"
echo "===========================================" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# Extract commands from markdown code blocks
extract_commands() {
  local file="$1"
  grep -A 100 '```bash' "$file" | grep -v '```' | grep -E '^(npx|npm|git|claude)' || true
}

# Test a single command
test_command() {
  local cmd="$1"
  local file="$2"

  echo "Testing: $cmd (from $file)" | tee -a "$REPORT_FILE"

  if eval "$cmd" &>/dev/null; then
    echo "  ✅ PASS" | tee -a "$REPORT_FILE"
    return 0
  else
    echo "  ❌ FAIL" | tee -a "$REPORT_FILE"
    FAILED_COMMANDS+=("$cmd (from $file)")
    return 1
  fi
}

# Find all markdown files
find "$DOCS_DIR" -name "*.md" -type f | while read -r doc_file; do
  echo "" >> "$REPORT_FILE"
  echo "File: $doc_file" >> "$REPORT_FILE"
  echo "---" >> "$REPORT_FILE"

  # Extract and test each command
  extract_commands "$doc_file" | while read -r cmd; do
    test_command "$cmd" "$doc_file" || true
  done
done

# Summary
echo "" >> "$REPORT_FILE"
echo "===========================================" >> "$REPORT_FILE"
echo "Summary" >> "$REPORT_FILE"
echo "===========================================" >> "$REPORT_FILE"

if [ ${#FAILED_COMMANDS[@]} -eq 0 ]; then
  echo "✅ All commands passed verification" | tee -a "$REPORT_FILE"
  exit 0
else
  echo "❌ Failed commands:" | tee -a "$REPORT_FILE"
  printf '%s\n' "${FAILED_COMMANDS[@]}" | tee -a "$REPORT_FILE"
  exit 1
fi
```

### 2.2 Example Code Testing

**File**: `scripts/verify-docs-examples.js`

```javascript
#!/usr/bin/env node
// Documentation Example Verification
// Tests all code examples in documentation

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DOCS_DIR = process.argv[2] || 'docs';
const REPORT_FILE = 'docs-examples-report.txt';

const results = {
  total: 0,
  passed: 0,
  failed: 0,
  errors: []
};

// Extract code blocks from markdown
function extractCodeBlocks(content, language) {
  const regex = new RegExp(`\`\`\`${language}\\n([\\s\\S]*?)\`\`\``, 'g');
  const blocks = [];
  let match;

  while ((match = regex.exec(content)) !== null) {
    blocks.push(match[1]);
  }

  return blocks;
}

// Test JavaScript/TypeScript code
function testJSCode(code, file) {
  results.total++;

  try {
    // Write to temp file
    const tempFile = `/tmp/doc-test-${Date.now()}.js`;
    fs.writeFileSync(tempFile, code);

    // Try to parse (syntax check)
    require('vm').createScript(code);

    console.log(`✅ PASS: ${file} - JS example`);
    results.passed++;
    return true;
  } catch (error) {
    console.log(`❌ FAIL: ${file} - ${error.message}`);
    results.failed++;
    results.errors.push({ file, error: error.message, code });
    return false;
  }
}

// Test bash commands
function testBashCode(code, file) {
  results.total++;

  // Skip examples with placeholders
  if (code.includes('$SESSION_ID') || code.includes('<') || code.includes('...')) {
    console.log(`⏭️  SKIP: ${file} - Contains placeholders`);
    return true;
  }

  try {
    execSync(code, { timeout: 5000, stdio: 'ignore' });
    console.log(`✅ PASS: ${file} - Bash example`);
    results.passed++;
    return true;
  } catch (error) {
    console.log(`❌ FAIL: ${file} - ${error.message}`);
    results.failed++;
    results.errors.push({ file, error: error.message, code });
    return false;
  }
}

// Process all markdown files
function processMarkdownFiles(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);

    if (file.isDirectory()) {
      processMarkdownFiles(fullPath);
    } else if (file.name.endsWith('.md')) {
      const content = fs.readFileSync(fullPath, 'utf-8');

      // Test JavaScript examples
      const jsBlocks = extractCodeBlocks(content, 'javascript');
      jsBlocks.forEach(code => testJSCode(code, fullPath));

      // Test TypeScript examples
      const tsBlocks = extractCodeBlocks(content, 'typescript');
      tsBlocks.forEach(code => testJSCode(code, fullPath));

      // Test Bash examples (carefully)
      const bashBlocks = extractCodeBlocks(content, 'bash');
      bashBlocks.forEach(code => testBashCode(code, fullPath));
    }
  }
}

// Generate report
function generateReport() {
  const report = `
Documentation Examples Verification Report
Date: ${new Date().toISOString()}
===========================================

Total Examples: ${results.total}
Passed: ${results.passed}
Failed: ${results.failed}
Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%

${results.errors.length > 0 ? `
Failed Examples:
${results.errors.map((e, i) => `
${i + 1}. File: ${e.file}
   Error: ${e.error}
   Code:
${e.code.split('\n').map(l => '   ' + l).join('\n')}
`).join('\n')}
` : '✅ All examples passed!'}
`;

  fs.writeFileSync(REPORT_FILE, report);
  console.log(`\nReport written to ${REPORT_FILE}`);

  return results.failed === 0 ? 0 : 1;
}

// Main execution
console.log('Starting documentation example verification...\n');
processMarkdownFiles(DOCS_DIR);
process.exit(generateReport());
```

### 2.3 Link Validation

**File**: `scripts/verify-docs-links.sh`

```bash
#!/usr/bin/env bash
# Documentation Link Verification
# Validates all internal and external links

set -euo pipefail

DOCS_DIR="${1:-docs}"
REPORT_FILE="docs-links-report.txt"

echo "Link Verification Report" > "$REPORT_FILE"
echo "Date: $(date)" >> "$REPORT_FILE"
echo "========================" >> "$REPORT_FILE"

# Extract markdown links
find "$DOCS_DIR" -name "*.md" -type f -exec grep -H -o '\[.*\](.*)' {} \; | while IFS=: read -r file link; do
  # Extract URL from [text](url)
  url=$(echo "$link" | sed -E 's/.*\((.*)\)/\1/')

  if [[ "$url" =~ ^http ]]; then
    # External link - check with curl
    if curl -s -f -o /dev/null "$url"; then
      echo "✅ $file: $url" | tee -a "$REPORT_FILE"
    else
      echo "❌ $file: $url (BROKEN)" | tee -a "$REPORT_FILE"
    fi
  else
    # Internal link - check file exists
    target_file=$(dirname "$file")/"$url"
    if [ -f "$target_file" ]; then
      echo "✅ $file: $url" | tee -a "$REPORT_FILE"
    else
      echo "❌ $file: $url (NOT FOUND)" | tee -a "$REPORT_FILE"
    fi
  fi
done
```

### 2.4 Consistency Checking

**File**: `scripts/verify-docs-consistency.js`

```javascript
#!/usr/bin/env node
// Documentation Consistency Verification
// Checks for version mismatches, broken references, etc.

const fs = require('fs');
const path = require('path');

const issues = [];

// Check version consistency across docs
function checkVersionConsistency(docsDir) {
  const versions = new Map();

  function scanFile(file) {
    const content = fs.readFileSync(file, 'utf-8');
    const versionMatches = content.match(/\bv?\d+\.\d+\.\d+(-[a-z0-9.]+)?\b/gi);

    if (versionMatches) {
      versionMatches.forEach(v => {
        if (!versions.has(v)) versions.set(v, []);
        versions.get(v).push(file);
      });
    }
  }

  function walk(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    files.forEach(f => {
      const fullPath = path.join(dir, f.name);
      if (f.isDirectory()) walk(fullPath);
      else if (f.name.endsWith('.md')) scanFile(fullPath);
    });
  }

  walk(docsDir);

  // Report if multiple versions mentioned
  if (versions.size > 3) {
    issues.push({
      type: 'version_inconsistency',
      message: `Found ${versions.size} different version numbers across docs`,
      details: Array.from(versions.keys())
    });
  }
}

// Check for broken file references
function checkFileReferences(docsDir) {
  function scanFile(file) {
    const content = fs.readFileSync(file, 'utf-8');
    const fileRefs = content.match(/`[^`]*\.(js|ts|json|md|sh)`/g);

    if (fileRefs) {
      fileRefs.forEach(ref => {
        const filename = ref.slice(1, -1); // Remove backticks

        // Check if file exists in project
        const searchPaths = [
          path.join(process.cwd(), filename),
          path.join(process.cwd(), 'src', filename),
          path.join(process.cwd(), 'scripts', filename)
        ];

        const exists = searchPaths.some(p => {
          try {
            return fs.existsSync(p);
          } catch {
            return false;
          }
        });

        if (!exists && !filename.includes('$') && !filename.includes('<')) {
          issues.push({
            type: 'missing_file_reference',
            message: `File referenced but not found: ${filename}`,
            location: file
          });
        }
      });
    }
  }

  function walk(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    files.forEach(f => {
      const fullPath = path.join(dir, f.name);
      if (f.isDirectory()) walk(fullPath);
      else if (f.name.endsWith('.md')) scanFile(fullPath);
    });
  }

  walk(docsDir);
}

// Main execution
const DOCS_DIR = process.argv[2] || 'docs';

console.log('Checking version consistency...');
checkVersionConsistency(DOCS_DIR);

console.log('Checking file references...');
checkFileReferences(DOCS_DIR);

// Generate report
const report = `
Documentation Consistency Report
Date: ${new Date().toISOString()}
=================================

Issues Found: ${issues.length}

${issues.map((issue, i) => `
${i + 1}. ${issue.type.toUpperCase()}
   ${issue.message}
   ${issue.location ? `Location: ${issue.location}` : ''}
   ${issue.details ? `Details: ${JSON.stringify(issue.details, null, 2)}` : ''}
`).join('\n')}

${issues.length === 0 ? '✅ No consistency issues found!' : ''}
`;

fs.writeFileSync('docs-consistency-report.txt', report);
console.log(report);

process.exit(issues.length === 0 ? 0 : 1);
```

---

## 3. Review Checklists

### 3.1 Pre-Publish Checklist

**Use for**: All documentation changes before merge/publish

```markdown
## Documentation Pre-Publish Checklist

### Accuracy
- [ ] All commands tested and working
- [ ] All code examples execute without errors
- [ ] All features mentioned exist in codebase
- [ ] All version numbers consistent
- [ ] All file paths valid

### Completeness
- [ ] All prerequisites listed
- [ ] All parameters documented
- [ ] All error cases covered
- [ ] All examples include expected output
- [ ] All related docs cross-referenced

### Currency
- [ ] Deprecated features marked
- [ ] New features since last version noted
- [ ] Breaking changes highlighted
- [ ] Version compatibility matrix updated

### Evidence
- [ ] Sources cited for external claims
- [ ] Test results included for benchmarks
- [ ] Screenshots for UI features
- [ ] Git commits linked for new features

### Clarity
- [ ] Technical terms defined
- [ ] Examples progress from simple to complex
- [ ] Assumptions stated explicitly
- [ ] Success criteria clear

### Accessibility
- [ ] Code blocks have language tags
- [ ] Links have descriptive text
- [ ] Images have alt text
- [ ] Tables have headers

### Status Markers
- [ ] Experimental features marked
- [ ] Planned features marked with ETA
- [ ] Deprecated features marked with replacement
- [ ] Alpha/Beta features marked with stability notes
```

### 3.2 Regular Audit Checklist

**Use for**: Quarterly documentation review

```markdown
## Quarterly Documentation Audit

### Q[X] 20[YY] Audit

#### Scope
- [ ] All reference documentation reviewed
- [ ] All tutorials tested end-to-end
- [ ] All guides validated
- [ ] All API docs checked against code

#### Automated Tests
- [ ] Run verify-docs-commands.sh - PASS
- [ ] Run verify-docs-examples.js - PASS
- [ ] Run verify-docs-links.sh - PASS
- [ ] Run verify-docs-consistency.js - PASS

#### Manual Review
- [ ] Check for outdated screenshots
- [ ] Verify external links still valid
- [ ] Test all "getting started" flows
- [ ] Validate all troubleshooting steps

#### Updates Needed
- [ ] List deprecated features to document
- [ ] List new features to document
- [ ] List changed APIs to update
- [ ] List broken examples to fix

#### Action Items
- [ ] Create issues for documentation gaps
- [ ] Assign owners for major rewrites
- [ ] Schedule updates for next sprint
- [ ] Update documentation roadmap
```

### 3.3 Update Trigger Checklist

**Use for**: Determining when docs need updates

```markdown
## Documentation Update Triggers

### Automatic Updates Required
- [ ] **Major Version Release**: Full review of all docs
- [ ] **Minor Version Release**: Review changed features
- [ ] **Patch Release**: Review fixed bugs mentioned in docs
- [ ] **Deprecation**: Mark deprecated features, add migration guide
- [ ] **Breaking Change**: Update all affected examples
- [ ] **New Feature**: Add documentation before release

### Review Recommended
- [ ] User reports documentation issue
- [ ] Support receives same question 3+ times
- [ ] Automated tests fail
- [ ] Dependency version changes
- [ ] Platform/OS support changes

### Prioritization
- **Critical (Fix immediately)**:
  - Commands that don't work
  - Security-related inaccuracies
  - Breaking change not documented

- **High (Fix within 1 week)**:
  - Examples that fail
  - Missing prerequisites
  - Broken internal links

- **Medium (Fix within 1 month)**:
  - Unclear explanations
  - Missing examples
  - Inconsistent terminology

- **Low (Fix when convenient)**:
  - Typos
  - Style inconsistencies
  - Minor clarifications
```

---

## 4. Evidence Standards

### 4.1 Proof Requirements

**Standard**: Documentation claims require verifiable evidence.

#### Evidence Levels

**Level 1: Executable Proof** (Strongest)
```markdown
**Claim**: "The `swarm_init` command creates a mesh topology"

**Evidence**:
- Command: `npx claude-flow@alpha swarm init --topology mesh`
- Exit code: 0
- Output contains: "Mesh topology initialized"
- Verification: `ls .swarm/topology.json` exists
- Test script: `scripts/test-swarm-init.sh`
```

**Level 2: Code Reference** (Strong)
```markdown
**Claim**: "Supports 54 agent types"

**Evidence**:
- File: `src/agents/types.ts`
- Lines: 15-68
- Count: `grep -c "type:" src/agents/types.ts` → 54
- Last verified: 2025-11-18
- Git commit: abc123f
```

**Level 3: Package Manifest** (Moderate)
```markdown
**Claim**: "Version 2.0.0 includes neural training"

**Evidence**:
- Package: `claude-flow@2.0.0`
- Feature: Listed in `package.json` dependencies
- Exports: Check `node_modules/claude-flow/dist/index.d.ts`
- Documentation: Listed in upstream CHANGELOG.md
```

**Level 4: Developer Statement** (Weak - Requires Verification)
```markdown
**Claim**: "Performance improved by 2.8x"

**Evidence**:
- Source: Upstream README.md
- Benchmark: [Link to benchmark results]
- Reproducible: `npm run benchmark`
- Last verified: 2025-11-18
- Status: ⚠️ Requires independent verification
```

**Level 5: Planned Feature** (No Evidence Yet)
```markdown
**Claim**: "Will support GPU acceleration in v3.0"

**Status**: 🔮 Planned Feature
**Evidence**: Upstream roadmap (link)
**ETA**: Q2 2025
**Tracking**: Issue #456
**Verification**: Cannot verify until release
```

### 4.2 Documentation Templates

#### Command Documentation Template

```markdown
## command-name

**Status**: ✅ Verified | ⚠️ Experimental | 🔮 Planned | ❌ Deprecated

### Description
[What the command does]

### Syntax
\`\`\`bash
npx claude-flow@alpha command-name [options]
\`\`\`

### Options
| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| --flag | string | No | "default" | What it does |

### Examples

**Basic Usage**:
\`\`\`bash
npx claude-flow@alpha command-name --flag value
\`\`\`

**Expected Output**:
\`\`\`
Success: Command completed
Created: output.json
\`\`\`

### Verification Evidence
- **Test Script**: `scripts/test-command-name.sh`
- **Last Tested**: 2025-11-18
- **Version**: 2.0.0
- **Exit Code**: 0
- **Source Code**: `src/commands/command-name.ts:45-120`

### Related
- [Other Command](./other-command.md)
- [Concept Guide](../guides/concepts.md)
```

#### Feature Documentation Template

```markdown
## Feature Name

**Status**: ✅ Stable | ⚠️ Beta | 🧪 Alpha | 🔮 Planned

**Since**: v2.0.0
**Stability**: Stable

### Overview
[What the feature does and why it exists]

### Requirements
- Node.js >= 18.0.0
- claude-flow >= 2.0.0
- [Other dependencies]

### Usage

#### Basic Example
\`\`\`typescript
import { featureName } from 'claude-flow';

const result = featureName({
  option: 'value'
});
\`\`\`

**Output**:
\`\`\`json
{
  "status": "success",
  "data": {}
}
\`\`\`

### Implementation Evidence
- **Source**: `src/features/feature-name.ts`
- **Tests**: `tests/features/feature-name.test.ts`
- **Coverage**: 94%
- **Exported**: Listed in `dist/index.d.ts`
- **Documented**: Upstream docs (link)

### Limitations
- [Known limitation 1]
- [Known limitation 2]

### Troubleshooting
See [Troubleshooting Guide](../troubleshooting.md#feature-name)
```

### 4.3 Evidence Documentation Process

**Step-by-step** for documenting any feature:

1. **Identify the Claim**
   - "Feature X does Y"
   - Write it explicitly

2. **Choose Evidence Type**
   - Can I run a command? → Executable Proof
   - Can I point to code? → Code Reference
   - Is it in package? → Package Manifest
   - From upstream docs? → Developer Statement
   - Not released yet? → Planned Feature

3. **Collect Evidence**
   - Run the test/command
   - Save output to file
   - Take screenshot if visual
   - Note version numbers
   - Record timestamp

4. **Document Evidence**
   - Add evidence section to doc
   - Link to test scripts
   - Include reproduction steps
   - Note verification date

5. **Mark Status**
   - ✅ Verified (Level 1-2 evidence)
   - ⚠️ Experimental (Level 3 evidence)
   - 🔮 Planned (Level 5 evidence)
   - 🧪 Alpha/Beta (Limited testing)

### 4.4 Evidence Maintenance

**Schedule**:
- **Weekly**: Re-run automated verification scripts
- **Monthly**: Spot-check high-priority features
- **Quarterly**: Full evidence audit
- **On Release**: Verify all changed features

**Evidence Expiry**:
- Executable Proof: 30 days
- Code Reference: 60 days (unless git shows changes)
- Package Manifest: On version change
- Developer Statement: 90 days
- Planned Feature: Verify on milestone date

**Stale Evidence Handling**:
```markdown
> **⚠️ Verification Needed**
> Last verified: 2025-09-01 (90 days ago)
> Evidence may be outdated
> [Re-verification issue: #789]
```

---

## 5. Enforcement & Automation

### 5.1 CI/CD Integration

**GitHub Actions Workflow**: `.github/workflows/docs-quality.yml`

```yaml
name: Documentation Quality Check

on:
  pull_request:
    paths:
      - 'docs/**'
      - '*.md'
  push:
    branches: [main]
    paths:
      - 'docs/**'

jobs:
  verify-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Verify commands
        run: bash scripts/verify-docs-commands.sh

      - name: Verify examples
        run: node scripts/verify-docs-examples.js

      - name: Verify links
        run: bash scripts/verify-docs-links.sh

      - name: Check consistency
        run: node scripts/verify-docs-consistency.js

      - name: Upload reports
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: verification-reports
          path: |
            docs-*-report.txt

      - name: Fail on errors
        run: |
          if grep -q "❌ FAIL" docs-*-report.txt; then
            echo "Documentation verification failed"
            exit 1
          fi
```

### 5.2 Pre-Commit Hook

**File**: `.git/hooks/pre-commit`

```bash
#!/usr/bin/env bash
# Documentation quality pre-commit hook

# Check if any documentation files changed
if git diff --cached --name-only | grep -qE '\.(md)$'; then
  echo "Verifying documentation changes..."

  # Run quick verification on changed files only
  changed_docs=$(git diff --cached --name-only --diff-filter=ACM | grep '\.md$')

  if [ -n "$changed_docs" ]; then
    # Quick syntax check
    echo "$changed_docs" | while read -r file; do
      if ! ./scripts/verify-docs-examples.js "$file"; then
        echo "❌ Documentation verification failed for $file"
        exit 1
      fi
    done
  fi

  echo "✅ Documentation verification passed"
fi
```

### 5.3 Quality Metrics Dashboard

**Track** these metrics over time:

```markdown
## Documentation Quality Metrics

**Period**: 2025-Q4

| Metric | Target | Current | Trend |
|--------|--------|---------|-------|
| Command Success Rate | 100% | 98% | ↑ |
| Example Pass Rate | 95% | 93% | → |
| Link Validity | 100% | 97% | ↓ |
| Evidence Coverage | 90% | 85% | ↑ |
| Staleness (avg days) | <30 | 22 | ↑ |
| User-Reported Issues | <5/month | 3 | ↑ |

**Action Items**:
- Fix 2 broken external links
- Update 4 examples with syntax errors
- Re-verify 12 stale evidence items
```

---

## 6. Quick Reference

### Command Cheat Sheet

```bash
# Run all verification
npm run verify:docs

# Individual checks
bash scripts/verify-docs-commands.sh
node scripts/verify-docs-examples.js
bash scripts/verify-docs-links.sh
node scripts/verify-docs-consistency.js

# Generate reports
npm run docs:reports

# Update evidence timestamps
npm run docs:update-evidence
```

### Status Emoji Guide

| Emoji | Meaning | Use Case |
|-------|---------|----------|
| ✅ | Verified | Feature tested and working |
| ⚠️ | Experimental | Limited testing or beta |
| 🧪 | Alpha | Early testing phase |
| 🔮 | Planned | Future feature, not yet implemented |
| ❌ | Deprecated | No longer supported |
| 🚧 | In Progress | Actively being developed |
| 📝 | Draft | Documentation incomplete |

### Evidence Quick Check

```markdown
Before publishing documentation, ask:

1. ✅ Can I run this command right now?
2. ✅ Can I point to the source code?
3. ✅ Does the example execute?
4. ✅ Is the version number current?
5. ✅ Are all links working?
6. ✅ Is there a test that validates this?

If answer is NO to any: Add evidence or mark as planned/experimental.
```

---

## 7. Implementation Plan

### Phase 1: Foundation (Week 1)
- [ ] Create all verification scripts
- [ ] Set up CI/CD workflow
- [ ] Document evidence standards
- [ ] Train team on framework

### Phase 2: Baseline (Week 2)
- [ ] Run full verification on existing docs
- [ ] Document all failures
- [ ] Create remediation plan
- [ ] Set up metrics dashboard

### Phase 3: Remediation (Weeks 3-4)
- [ ] Fix high-priority issues
- [ ] Add missing evidence
- [ ] Update stale documentation
- [ ] Verify all commands work

### Phase 4: Automation (Week 5)
- [ ] Set up pre-commit hooks
- [ ] Configure automated runs
- [ ] Create alerting for failures
- [ ] Document processes

### Phase 5: Maintenance (Ongoing)
- [ ] Weekly automated verification
- [ ] Monthly manual review
- [ ] Quarterly full audit
- [ ] Continuous improvement

---

## Conclusion

This framework ensures documentation accuracy through:

1. **Systematic Testing**: Automated verification of all claims
2. **Evidence Standards**: Clear requirements for proof
3. **Regular Audits**: Scheduled reviews prevent staleness
4. **Clear Status Markers**: Readers know what's real vs planned
5. **Enforcement**: CI/CD integration prevents bad docs from merging

**Success Metrics**:
- 100% command success rate
- 95% example pass rate
- <5% stale evidence
- <3 user-reported accuracy issues per month

**Maintenance**: This framework itself should be reviewed quarterly and updated based on effectiveness metrics.
