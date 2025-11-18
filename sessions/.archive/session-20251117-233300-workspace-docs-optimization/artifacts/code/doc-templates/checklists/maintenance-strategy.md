# Documentation Maintenance Strategy

## Overview

This strategy ensures documentation stays accurate, useful, and maintainable over time.

---

## Maintenance Lifecycle

### 1. Creation (Day 0)

**Activities**:
- Write using appropriate template
- Test all examples
- Complete quality checklist
- Get technical review
- Publish to docs directory

**Deliverables**:
- Published documentation
- Initial metadata complete
- First verification date set

### 2. Active Maintenance (Ongoing)

**Triggers for updates**:
- Code changes affecting documented features
- User feedback reporting issues
- Scheduled review (see schedule below)
- Breaking changes in dependencies
- Security advisories

**Update process**:
1. Make necessary changes
2. Re-test all examples
3. Update "Last Updated" date
4. Update verification status
5. Notify stakeholders if major changes

### 3. Regular Review (Scheduled)

**Review frequency by doc type**:
- **Getting Started guides**: Every 3 months
- **How-To guides**: Every 6 months
- **Reference docs**: Every 3 months
- **Explanation docs**: Every 12 months
- **Troubleshooting guides**: Every 6 months

**Review activities**:
- [ ] Test all code examples
- [ ] Verify all links work
- [ ] Check version numbers current
- [ ] Update screenshots (if any)
- [ ] Verify prerequisites still accurate
- [ ] Review user feedback
- [ ] Check for better approaches

### 4. Archival (When Outdated)

**Archive when**:
- Feature deprecated
- Better documentation exists
- No longer maintained
- Replaced by new approach

**Archive process**:
1. Add deprecation notice at top
2. Link to replacement (if exists)
3. Move to `docs/archive/`
4. Update all links pointing to doc
5. Add to archived docs index

---

## Verification Process

### What to Verify

**Code Examples**:
```bash
# Run every code example
# Document actual output
# Update if different from documented

# Example verification script:
./verify-doc-examples.sh docs/getting-started/setup.md
```

**Links**:
```bash
# Check all internal links
markdown-link-check docs/**/*.md

# Check all external links
# Flag for manual review if >3 months old
```

**Version Compatibility**:
```bash
# Check documented versions
grep -r "version" docs/

# Compare with current package.json
# Flag outdated version numbers
```

### Verification Checklist

Run through [quality-checklist.md](./quality-checklist.md) focusing on:
- [ ] All code examples still work
- [ ] All links still valid
- [ ] Version numbers current
- [ ] No better way to accomplish task
- [ ] Troubleshooting still relevant

### Verification Notes

Document in doc's maintenance notes:
```markdown
## Maintenance Notes

**Last verified**: 2025-01-15 by Alice

**Verification results**:
- ✅ All examples tested and work
- ✅ All links valid
- ⚠️ Version updated from v1.2 to v1.5
- ⚠️ Added new troubleshooting case

**Changes made**:
- Updated installation command
- Added new error code ERR_005
- Fixed broken link to API reference

**Next review**: 2025-04-15
```

---

## Update Triggers

### Automatic Triggers

Set up automation to flag docs for review when:

**Code changes**:
```yaml
# .github/workflows/doc-review.yml
on:
  push:
    paths:
      - 'src/**'
      - 'package.json'

jobs:
  flag-docs:
    runs-on: ubuntu-latest
    steps:
      - name: Find affected docs
        run: |
          # Find docs mentioning changed files
          # Create issue for review
```

**Dependency updates**:
```bash
# When package.json changes
# Flag docs mentioning that package
```

**User feedback**:
- Issue labeled "documentation"
- PR touching docs
- Support ticket mentioning docs

### Manual Triggers

**Quarterly review**:
- Schedule calendar reminders
- Assign docs to team members
- Track completion in checklist

**Version releases**:
- Before major release: verify all docs
- Before minor release: verify affected docs
- After release: update version numbers

---

## Quality Maintenance

### Metrics to Track

**Freshness**:
- Days since last verification
- Days since last update
- Target: <90 days for critical docs

**Accuracy**:
- User feedback score
- Number of corrections needed
- Target: >90% first-try success

**Completeness**:
- Missing features documented
- Coverage percentage
- Target: >95% of features

**Usability**:
- Time to find information
- User satisfaction surveys
- Target: >4.5/5 stars

### Quality Dashboard

Track in spreadsheet or tool:

```
| Doc | Last Verified | Accuracy | User Score | Status |
|-----|---------------|----------|------------|--------|
| setup.md | 2025-01-15 | 95% | 4.8/5 | ✅ Current |
| api-ref.md | 2024-11-20 | 88% | 4.2/5 | ⚠️ Review |
| deploy.md | 2024-09-10 | 75% | 3.8/5 | ❌ Outdated |
```

---

## Deprecation Process

### 1. Identify for Deprecation

**Criteria**:
- Feature deprecated in code
- Better alternative exists
- No longer best practice
- Outdated approach

### 2. Mark as Deprecated

Add prominent notice at top:

```markdown
# [Old Feature Name]

> **⚠️ DEPRECATED**: This feature is deprecated as of v2.0.0
>
> **Use instead**: [New Feature](link-to-new-doc.md)
>
> **Migration guide**: [How to migrate](link-to-migration.md)
>
> **Support ends**: 2025-12-31
>
> This documentation is kept for reference only.

---
```

### 3. Update Navigation

- Remove from main navigation
- Add to deprecated section
- Update related docs to point to new approach

### 4. Archive

After support ends:
```bash
# Move to archive
mv docs/deprecated/old-feature.md docs/archive/

# Update archive index
echo "- [Old Feature](old-feature.md) - Deprecated v2.0.0" >> docs/archive/README.md
```

---

## Continuous Improvement

### Collect Feedback

**User feedback**:
- "Was this helpful?" widget on docs
- GitHub issues
- Support tickets
- User surveys

**Analytics**:
- Page views
- Time on page
- Search queries
- Exit pages

**Team feedback**:
- Documentation reviews
- Support team input
- Developer feedback

### Act on Feedback

**Monthly**:
- Review feedback
- Identify patterns
- Prioritize improvements

**Quarterly**:
- Update documentation strategy
- Refine templates
- Improve processes

**Annually**:
- Major documentation audit
- Restructure if needed
- Set new quality goals

---

## Roles & Responsibilities

### Documentation Maintainer

**Responsibilities**:
- Schedule reviews
- Track maintenance metrics
- Coordinate updates
- Approve changes

**Time commitment**: ~2 hours/week

### Technical Writers

**Responsibilities**:
- Create new docs
- Update existing docs
- Review for clarity
- Maintain style guide

**Time commitment**: Varies by project size

### Technical Reviewers

**Responsibilities**:
- Verify technical accuracy
- Test code examples
- Validate solutions
- Approve for publication

**Time commitment**: ~30 min per doc

### Users/Contributors

**Responsibilities**:
- Report issues
- Suggest improvements
- Submit corrections
- Provide feedback

---

## Tools & Automation

### Recommended Tools

**Link checking**:
```bash
npm install -g markdown-link-check
markdown-link-check docs/**/*.md
```

**Spell checking**:
```bash
npm install -g cspell
cspell "docs/**/*.md"
```

**Linting**:
```bash
npm install -g markdownlint-cli
markdownlint docs/
```

**Example testing**:
```bash
# Extract and test code blocks
npm install -g markdown-code-runner
markdown-code-runner docs/setup.md
```

### Automation Scripts

**Daily checks**:
```bash
#!/bin/bash
# check-docs-health.sh

# Check for broken links
markdown-link-check docs/**/*.md

# Find stale docs (>90 days)
find docs -name "*.md" -mtime +90

# Check for missing metadata
grep -L "Last Updated" docs/**/*.md
```

**Pre-commit hook**:
```bash
#!/bin/bash
# .git/hooks/pre-commit

# Only check staged .md files
STAGED_MD=$(git diff --cached --name-only --diff-filter=ACM | grep ".md$")

if [ -n "$STAGED_MD" ]; then
  markdownlint $STAGED_MD
  cspell $STAGED_MD
fi
```

---

## Maintenance Calendar

### Weekly
- [ ] Review user feedback
- [ ] Update docs for merged PRs
- [ ] Check automated reports

### Monthly
- [ ] Run link checker
- [ ] Review metrics dashboard
- [ ] Update version numbers
- [ ] Process feedback backlog

### Quarterly
- [ ] Complete scheduled reviews
- [ ] Verify all examples
- [ ] Update screenshots
- [ ] Audit for gaps

### Annually
- [ ] Major documentation audit
- [ ] Restructure if needed
- [ ] Update templates
- [ ] Review strategy

---

## Emergency Updates

### When Code Breaks Docs

**Immediate** (within 24 hours):
1. Add warning banner to affected docs
2. Create issue tracking update
3. Notify users via changelog

**Short-term** (within 1 week):
1. Update documentation
2. Test all examples
3. Deploy changes
4. Remove warning banner

### When Security Issues Found

**Immediate**:
1. Remove insecure examples
2. Add security warning
3. Link to secure alternative

**Follow-up**:
1. Audit all docs for similar issues
2. Update security guidelines
3. Train team on secure practices

---

## Success Metrics

### Health Score

Calculate monthly:

```
Health Score = (
  Freshness (30%) +
  Accuracy (30%) +
  Completeness (20%) +
  User Satisfaction (20%)
)

Target: >85%
```

### Individual Doc Health

- ✅ Healthy: >85% health score, verified <60 days
- ⚠️ Attention needed: 70-85% or verified 60-120 days
- ❌ Critical: <70% or verified >120 days

### Documentation Coverage

```
Coverage = (Documented Features / Total Features) * 100%

Target: >95%
```

---

## Resources

- [Quality Checklist](./quality-checklist.md)
- [Doc Templates](../templates/)
- [Style Guide](../style-guide.md)
- [Example Library](../examples/)
