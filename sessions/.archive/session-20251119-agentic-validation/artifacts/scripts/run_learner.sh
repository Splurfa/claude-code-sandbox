#!/bin/bash
export ACTIVE_SESSION_ID="session-20251119-agentic-validation"
LOG_FILE="sessions/session-20251119-agentic-validation/artifacts/notes/learner_log.txt"

echo "--- Learner Persona Execution ---" > "$LOG_FILE"

echo "1. Starting Tutor..." >> "$LOG_FILE"
node .claude/skills/tutor-mode/bin/index.js start >> "$LOG_FILE" 2>&1
echo "" >> "$LOG_FILE"

echo "2. Assessing Knowledge..." >> "$LOG_FILE"
node .claude/skills/tutor-mode/bin/index.js assess >> "$LOG_FILE" 2>&1
echo "" >> "$LOG_FILE"

echo "3. Explaining Hive Mind..." >> "$LOG_FILE"
node .claude/skills/tutor-mode/bin/index.js explain "hive mind" >> "$LOG_FILE" 2>&1
echo "" >> "$LOG_FILE"

echo "4. Checking Progress..." >> "$LOG_FILE"
node .claude/skills/tutor-mode/bin/index.js progress >> "$LOG_FILE" 2>&1
echo "" >> "$LOG_FILE"

echo "Learner Persona Complete."

