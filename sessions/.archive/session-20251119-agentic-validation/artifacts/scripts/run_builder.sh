#!/bin/bash
LOG_FILE="sessions/session-20251119-agentic-validation/artifacts/notes/builder_log.txt"
echo "--- Builder Persona Execution ---" > "$LOG_FILE"

echo "1. Searching for Skill Builder..." >> "$LOG_FILE"
node sessions/session-20251119-agentic-validation/artifacts/scripts/builder_meta_search.js >> "$LOG_FILE" 2>&1
echo "" >> "$LOG_FILE"

echo "2. Creating Draft Skill..." >> "$LOG_FILE"
mkdir -p sessions/session-20251119-agentic-validation/artifacts/skills/test-skill
echo "# My Test Skill
This is a draft skill that needs improvement.
It does some stuff." > sessions/session-20251119-agentic-validation/artifacts/skills/test-skill/SKILL.md
echo "Draft created." >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

echo "3. Improving Draft..." >> "$LOG_FILE"
DRAFT_CONTENT=$(cat sessions/session-20251119-agentic-validation/artifacts/skills/test-skill/SKILL.md)
# Use node to handle the content safely
node -e "
  const { SecurePromptImprover } = require('./.claude/skills/prompt-improver/prompt-improver-secure.js');
  const improver = new SecurePromptImprover();
  const prompt = \`$DRAFT_CONTENT\`;
  improver.improvePrompt(prompt).then(res => console.log(JSON.stringify(res, null, 2)));
" >> "$LOG_FILE" 2>&1
echo "" >> "$LOG_FILE"

echo "Builder Persona Complete."

