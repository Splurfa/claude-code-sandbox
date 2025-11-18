# Documentation Quality Checklist

Use this checklist before publishing or updating any documentation.

---

## Content Quality

### Accuracy
- [ ] All code examples have been tested and work
- [ ] All commands produce the documented output
- [ ] Version numbers are current
- [ ] All links work (no 404s)
- [ ] All file paths are correct
- [ ] All screenshots are current (if applicable)

### Completeness
- [ ] All required sections are present (per template)
- [ ] Prerequisites are clearly stated
- [ ] All parameters/options are documented
- [ ] Examples cover common use cases
- [ ] Edge cases are addressed
- [ ] Error cases are documented
- [ ] Related docs are linked

### Clarity
- [ ] Purpose is clear in first paragraph
- [ ] Target audience is identified
- [ ] Technical terms are defined
- [ ] Steps are in logical order
- [ ] Each step has expected output
- [ ] Examples are realistic
- [ ] Troubleshooting covers common issues

---

## Structure & Format

### Organization
- [ ] Follows appropriate template
- [ ] Headings are properly nested (H1 → H2 → H3)
- [ ] Information flows logically
- [ ] Quick reference at top (if applicable)
- [ ] Detailed content follows
- [ ] Troubleshooting at end

### Formatting
- [ ] Code blocks have language tags
- [ ] Commands are in bash code blocks
- [ ] Output is clearly marked
- [ ] Lists are properly formatted
- [ ] Tables are used where appropriate
- [ ] Emphasis (bold/italic) is consistent
- [ ] No orphaned headings

### Navigation
- [ ] Table of contents for long docs (>1000 words)
- [ ] Section links work
- [ ] "See also" links are relevant
- [ ] Breadcrumbs for navigation (if applicable)
- [ ] Return-to-top links for long docs

---

## Examples & Code

### Code Quality
- [ ] Examples are complete (not fragments)
- [ ] Examples can be copy-pasted
- [ ] Commands include expected output
- [ ] Error examples show both error and fix
- [ ] Code follows project style guide
- [ ] Comments explain non-obvious code

### Testability
- [ ] All examples tested in clean environment
- [ ] Commands tested with documented versions
- [ ] Examples work with stated prerequisites
- [ ] Error cases verified to fail as documented
- [ ] Success criteria are verifiable

### Safety
- [ ] Destructive commands are clearly marked
- [ ] Rollback procedures provided
- [ ] Dangerous operations have warnings
- [ ] Examples use safe test data
- [ ] No hardcoded secrets or credentials

---

## User Experience

### Accessibility
- [ ] Can be read without running examples
- [ ] Key points emphasized appropriately
- [ ] Visual hierarchy is clear
- [ ] Alt text for images (if applicable)
- [ ] Printable format works

### Scannability
- [ ] Key information highlighted
- [ ] Quick reference available
- [ ] Code blocks stand out
- [ ] Warnings are visible
- [ ] Headings describe content

### Findability
- [ ] Title is descriptive and searchable
- [ ] Keywords are in first paragraph
- [ ] Metadata tags are accurate
- [ ] Appears in appropriate category
- [ ] Linked from related docs

---

## Maintenance

### Metadata
- [ ] Status is current (Draft/Review/Published)
- [ ] Last updated date is accurate
- [ ] Verification status is correct
- [ ] Author/maintainer is identified
- [ ] Version covered is specified

### Sustainability
- [ ] Maintenance notes are complete
- [ ] Verification steps are documented
- [ ] Known issues are tracked
- [ ] Future updates are planned
- [ ] Deprecation plan (if applicable)

### Versioning
- [ ] Version-specific info is tagged
- [ ] Breaking changes are highlighted
- [ ] Migration guides linked (if needed)
- [ ] Compatibility matrix included (if relevant)

---

## Technical Review

### Accuracy Review (Required)
- [ ] Technical expert reviewed content
- [ ] Code reviewed by developer
- [ ] Commands verified by QA
- [ ] Examples tested by user

### Peer Review
- [ ] Another writer reviewed clarity
- [ ] User tested instructions
- [ ] Feedback incorporated
- [ ] Reviewers approved

---

## Pre-Publication Checklist

### Final Checks
- [ ] Spell check completed
- [ ] Grammar check completed
- [ ] Markdown linting passed
- [ ] All checklist items completed
- [ ] Ready for publication

### Post-Publication
- [ ] Link from appropriate index pages
- [ ] Add to relevant navigation
- [ ] Announce in changelog (if major update)
- [ ] Monitor for user feedback
- [ ] Schedule review date

---

## Quality Metrics

Track these metrics for continuous improvement:

### User Metrics
- **Completeness**: Can user achieve goal without other resources?
- **Accuracy**: Do examples work first try?
- **Clarity**: Can target audience understand without help?
- **Usability**: Can user find needed information quickly?

### Maintenance Metrics
- **Freshness**: Days since last verification
- **Stability**: Frequency of updates needed
- **Coverage**: Percentage of features documented
- **Feedback**: User satisfaction score

### Quality Targets
- ✅ Excellent: >90% on all metrics
- ⚠️ Good: >75% on all metrics
- ❌ Needs improvement: <75% on any metric

---

## Template-Specific Checklists

### Setup Guide
- [ ] Installation tested in clean environment
- [ ] All configuration options documented
- [ ] Verification steps work
- [ ] Troubleshooting covers install issues
- [ ] Next steps linked

### Workflow Guide
- [ ] Complete workflow tested end-to-end
- [ ] All variations documented
- [ ] Rollback procedure verified
- [ ] Workflow diagram included
- [ ] Time estimates accurate

### Reference Doc
- [ ] All APIs/commands documented
- [ ] All parameters specified
- [ ] Examples for each entry
- [ ] Error codes comprehensive
- [ ] Version compatibility noted

### Troubleshooting Guide
- [ ] All solutions tested
- [ ] Diagnostic commands verified
- [ ] Error messages are exact
- [ ] Solutions actually fix issues
- [ ] Prevention tips included

---

## Approval

**Reviewed by**: [Name]
**Date**: YYYY-MM-DD
**Status**: ✅ Approved | ⚠️ Approved with notes | ❌ Needs revision

**Notes**:
- Note 1
- Note 2

**Action items**:
- [ ] Action 1
- [ ] Action 2
