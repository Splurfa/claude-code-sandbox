#!/bin/bash
# Validation script for skill-wizard.js

echo "--- WIZARD VALIDATION START ---"
echo "Creating 'wizard-test-skill'..."

# Inputs:
# 1. Description
# 2. Category
# 3. Content
# 4. Save Option (2 = Local Draft)

node skill-wizard.js create wizard-test-skill <<EOF
A skill to test the wizard
Testing
This is a test content.
2
EOF

if [ -f "drafts/wizard-test-skill/SKILL.md" ]; then
  echo "✅ SUCCESS: Skill created at drafts/wizard-test-skill/SKILL.md"
  cat drafts/wizard-test-skill/SKILL.md
else
  echo "❌ FAILURE: Skill file not found"
  exit 1
fi

echo "--- WIZARD VALIDATION END ---"
