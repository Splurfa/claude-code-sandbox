# Documentation Templates

Reusable templates for creating high-quality, maintainable documentation.

---

## Quick Start

1. **Choose template** based on doc type
2. **Copy template** to your docs directory
3. **Fill in sections** following inline guidance
4. **Complete checklist** before publishing
5. **Follow maintenance** strategy

---

## Available Templates

### Core Templates

**[standard-doc.md](./templates/standard-doc.md)**
- General-purpose documentation
- Good default for most docs
- Includes all standard sections
- Use when other templates don't fit

**[setup-guide.md](./templates/setup-guide.md)**
- Installation and configuration
- Step-by-step instructions
- Prerequisites and verification
- Use for "getting started" docs

**[workflow-guide.md](./templates/workflow-guide.md)**
- Multi-step processes
- Decision trees and variations
- Rollback procedures
- Use for "how-to" guides

**[reference-doc.md](./templates/reference-doc.md)**
- API documentation
- Command reference
- Configuration options
- Use for technical reference

**[troubleshooting-guide.md](./templates/troubleshooting-guide.md)**
- Problem diagnosis
- Solutions and fixes
- Error codes
- Use for support docs

---

## Template Selection Guide

### Ask these questions:

**1. What's the primary goal?**
- Learn how to install → `setup-guide.md`
- Learn how to do X → `workflow-guide.md`
- Look up API details → `reference-doc.md`
- Fix a problem → `troubleshooting-guide.md`
- Understand concepts → `standard-doc.md`

**2. Who's the audience?**
- Beginners → Use `setup-guide.md` or `workflow-guide.md`
- Experienced users → Use `reference-doc.md`
- Troubleshooters → Use `troubleshooting-guide.md`

**3. What's the format?**
- Sequential steps → `setup-guide.md` or `workflow-guide.md`
- Lookup table → `reference-doc.md`
- Problem/solution pairs → `troubleshooting-guide.md`

---

## Usage Instructions

### 1. Copy Template

```bash
# Copy template to your docs directory
cp templates/setup-guide.md ../../docs/getting-started/my-setup-guide.md
```

### 2. Fill Template

**Replace placeholders**:
- `[Document Title]` → Your actual title
- `[Section Name]` → Your section names
- All `[bracketed text]` with your content

**Follow inline guidance**:
- Comments starting with `<!--` are for template users
- Status/verification fields at top
- Metadata block at bottom

**Keep structure**:
- Don't remove required sections
- Optional sections can be removed if not applicable
- Add new sections if needed but maintain flow

### 3. Add Content

**Code examples**:
```bash
# Always include:
# 1. The command
command --flag value

# 2. Expected output
Expected output here

# 3. Verification
verification-command
```

**Explanations**:
- Start with "what" and "why"
- Then "how"
- Include context for decisions

**Examples**:
- Use realistic scenarios
- Show complete examples
- Include both success and error cases

### 4. Verify Quality

Complete [quality-checklist.md](./checklists/quality-checklist.md):
- Test all code examples
- Verify all links
- Check completeness
- Review clarity
- Get technical review

### 5. Add Metadata

At bottom of doc:

```yaml
doc_type: setup_guide  # Match template type
category: getting-started  # Where it lives
difficulty: beginner  # Who it's for
estimated_time: 15min  # How long to complete
tags: [setup, mcp, installation]  # Keywords
dependencies: [other-doc.md]  # Prerequisites
validation_status: verified  # Testing status
last_test_date: 2025-01-18  # When tested
```

---

## Quality Standards

### All Templates Include

**Required sections**:
- Overview with purpose/audience
- Quick start (where applicable)
- Detailed content
- Examples
- Troubleshooting
- Maintenance notes
- Metadata

**Quality features**:
- Testable examples
- Expected outputs
- Verification steps
- Error handling
- Cross-references
- Version tracking

### Template-Specific Features

**Setup guides**:
- Clean environment testing
- Prerequisites verification
- Configuration validation
- Next steps

**Workflow guides**:
- Complete workflows tested
- Variations documented
- Rollback procedures
- Decision trees

**Reference docs**:
- Complete API coverage
- Parameter specifications
- Error codes
- Compatibility matrix

**Troubleshooting**:
- Diagnostic procedures
- Root cause analysis
- Verified solutions
- Prevention tips

---

## Examples

See [examples/](./examples/) for complete docs using these templates:

- **[example-setup-guide.md](./examples/example-setup-guide.md)** - Claude Flow setup
- More examples coming...

---

## Checklists

### Before Publishing

Use [quality-checklist.md](./checklists/quality-checklist.md) to verify:
- Content accuracy
- Structure & format
- Examples & code
- User experience
- Maintenance setup

### After Publishing

Follow [maintenance-strategy.md](./checklists/maintenance-strategy.md) for:
- Regular reviews
- Update triggers
- Quality tracking
- Deprecation process

---

## Maintenance

### Keep Templates Current

**Monthly**:
- Review user feedback
- Update based on common issues
- Improve examples

**Quarterly**:
- Verify all templates still relevant
- Update for new best practices
- Add new templates if needed

**When code changes**:
- Update examples to match
- Verify all templates work
- Add new sections if needed

### Template Versioning

Templates are versioned with docs:
- **Major changes**: New required sections, structure changes
- **Minor changes**: New optional sections, improved examples
- **Patches**: Typos, clarifications, example fixes

Current version: **1.0.0** (2025-01-18)

---

## Contributing

### Suggesting Improvements

Found a way to improve templates?

1. **Document the issue**: What's unclear or missing?
2. **Propose solution**: How would you fix it?
3. **Show example**: Update a template as proof of concept
4. **Share feedback**: Submit PR or create issue

### Creating New Templates

Need a template for a new doc type?

1. **Check existing**: Can you adapt an existing template?
2. **Identify pattern**: Is this a common doc type?
3. **Follow structure**: Use existing templates as guide
4. **Add example**: Create example using your template
5. **Document usage**: When to use this template

**Minimum template requirements**:
- Overview section
- Inline guidance for writers
- Quality standards
- Metadata block
- Example doc

---

## Support

### Questions

- **How to use templates**: This README
- **Quality standards**: [quality-checklist.md](./checklists/quality-checklist.md)
- **Maintenance**: [maintenance-strategy.md](./checklists/maintenance-strategy.md)
- **Examples**: [examples/](./examples/)

### Issues

Template not working for your use case?
1. Check if you're using the right template
2. Review examples
3. Ask for help
4. Suggest improvements

---

## File Structure

```
doc-templates/
├── README.md (this file)
├── templates/
│   ├── standard-doc.md          # General purpose
│   ├── setup-guide.md           # Installation
│   ├── workflow-guide.md        # How-to
│   ├── reference-doc.md         # API/Config
│   └── troubleshooting-guide.md # Problem solving
├── checklists/
│   ├── quality-checklist.md     # Pre-publish
│   └── maintenance-strategy.md  # Post-publish
└── examples/
    └── example-setup-guide.md   # Real usage
```

---

## Quick Reference

| Need to... | Use template... | Check list... |
|------------|----------------|---------------|
| Document installation | setup-guide.md | quality-checklist.md |
| Document process | workflow-guide.md | quality-checklist.md |
| Document API | reference-doc.md | quality-checklist.md |
| Document fixes | troubleshooting-guide.md | quality-checklist.md |
| Keep docs current | Any | maintenance-strategy.md |

---

## Metadata

```yaml
doc_type: guide
category: reference
tags: [templates, documentation, quality, maintenance]
version: 1.0.0
last_updated: 2025-01-18
```
