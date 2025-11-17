Create a new session with organized artifact structure.

## What to do:

1. **Check for active sessions** (Duplicate Prevention):
   ```bash
   ACTIVE=$(grep -l '"status": "active"' sessions/*/metadata.json 2>/dev/null)
   if [ -n "$ACTIVE" ]; then
     echo "⚠️  Active session exists: $(basename $(dirname $ACTIVE))"
     echo "Creating a new session may fragment work. Recommended: close current session first."
     read -p "Create new session anyway? (y/N): " -r
     [[ ! $REPLY =~ ^[Yy]$ ]] && echo "Session creation cancelled." && exit 1
   fi
   ```

2. Generate session ID: `session-$(date +%Y%m%d-%H%M%S)-<topic>`
3. Create directory structure:
   ```bash
   mkdir -p "sessions/$SESSION_ID/artifacts"/{code,tests,docs,scripts,notes}
   ```

3. Create metadata.json:
   ```json
   {
     "session_id": "$SESSION_ID",
     "created_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
     "status": "active",
     "topic": "<topic>",
     "description": "<user's description>"
   }
   ```

4. **Set active session environment variable** (Session Inheritance):
   ```bash
   export ACTIVE_SESSION_ID="$SESSION_ID"
   echo "✅ Session environment variable set: ACTIVE_SESSION_ID=$SESSION_ID"
   ```

5. Create session-summary.md:
   ```markdown
   # Session: <topic>

   **Created**: $(date)
   **Status**: Active

   ## Objectives
   <to be filled during session>

   ## Work Completed
   <to be filled during session>
   ```

6. Confirm to user:
   ```
   ✅ Session created: sessions/$SESSION_ID/
   📁 Artifacts: sessions/$SESSION_ID/artifacts/{code,tests,docs,scripts,notes}/
   ```

## Stock integration:
- Use `npx claude-flow@alpha hooks pre-task` to register session start
- Session ID becomes active for all subsequent work
