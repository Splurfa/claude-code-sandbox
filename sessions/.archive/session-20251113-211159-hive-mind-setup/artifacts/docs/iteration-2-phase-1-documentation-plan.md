# Documentation Plan: Session Closeout System

**Created:** 2025-11-14
**Phase:** 1B - Planning
**Agent:** Documentation Planner

---

## 1. User-Facing Documentation

### 1.1 Quick Start Guide

**Target Audience:** Non-technical users, project managers, anyone running session closeouts

**Location:** `sessions/session-20251113-211159-hive-mind-setup/iteration-2/artifacts/phase-2/docs/quick-start-guide.md`

**Format:** Step-by-step markdown with screenshots/ASCII diagrams

**Key Sections:**
1. **Prerequisites** (1 minute)
   - Check you're in a git repository
   - Verify claude-flow is installed

2. **Running Session Closeout** (2 minutes)
   - Single command: `npx claude-flow@alpha hooks session-end --generate-summary true`
   - What to expect (output format)
   - Where to find results

3. **Reviewing Results** (2 minutes)
   - Session summary location
   - Backup archive location
   - Captain's log entry

4. **Common Workflows**
   - Quick closeout (just archive)
   - Full closeout (archive + captain's log)
   - Restore from backup

**Examples Needed:**
- Example session closeout command output
- Example session summary structure
- Example backup archive contents
- Example captain's log entry

**Plain English Explanations:**
- "Session closeout" = saving your work history for later
- "Backup archive" = a snapshot of everything that happened
- "Captain's log" = your journal of decisions and learnings
- "Memory.db" = the brain that remembers past sessions

---

### 1.2 Troubleshooting Guide

**Target Audience:** End users encountering errors

**Location:** `sessions/session-20251113-211159-hive-mind-setup/iteration-2/artifacts/phase-2/docs/troubleshooting.md`

**Format:** Problem → Solution pairs with diagnostic commands

**Key Sections:**

1. **Session Closeout Fails**
   - Symptom: "Error: Session not found"
   - Diagnosis: Check if session directory exists
   - Solution: Verify SESSION_ID environment variable

2. **Missing Memory Database**
   - Symptom: "Error: Cannot open .swarm/memory.db"
   - Diagnosis: Check if .swarm directory exists
   - Solution: Initialize with `npx claude-flow@alpha hooks pre-task`

3. **Captain's Log Not Created**
   - Symptom: No entry in sessions/captains-log/
   - Diagnosis: Check permissions on sessions/ directory
   - Solution: Run with proper permissions

4. **Backup Archive Empty**
   - Symptom: Backup file exists but contains no data
   - Diagnosis: Check if memory.db has data
   - Solution: Ensure hooks were run during session

**Examples Needed:**
- Error messages with full context
- Diagnostic command outputs
- Before/after states showing fixes

---

### 1.3 Concepts Explainer

**Target Audience:** New users trying to understand the system

**Location:** `sessions/session-20251113-211159-hive-mind-setup/iteration-2/artifacts/phase-2/docs/concepts.md`

**Format:** Concept → Explanation → Why It Matters

**Key Sections:**

1. **The Three Storage Systems**
   - Memory.db (structured data)
   - Captain's log (narrative)
   - Backup archives (snapshots)

2. **The Three Principles**
   - Time-neutral (on-demand, not scheduled)
   - Scale-agnostic (works at any size)
   - Stock-first (95% native tools)

3. **Session Lifecycle**
   - Session creation (automatic)
   - Work tracking (continuous)
   - Closeout (manual trigger)
   - Archive (persistent)

4. **When to Use What**
   - Use memory for querying past work
   - Use captain's log for "why" decisions
   - Use backups for restore points

**Plain English Explanations:**
- Avoid jargon like "HITL", "artifacts", "coordination mesh"
- Use analogies: "Memory.db is like a filing cabinet"
- Include "Why this matters" for each concept

---

## 2. Technical Documentation

### 2.1 Script Reference

**Target Audience:** Developers implementing/modifying the system

**Location:** `sessions/session-20251113-211159-hive-mind-setup/iteration-2/artifacts/phase-2/docs/script-reference.md`

**Format:** API-style reference with parameters and return values

**Key Sections:**

1. **Session End Hook**
   ```bash
   npx claude-flow@alpha hooks session-end [OPTIONS]
   ```
   - Parameters: `--generate-summary`, `--persist-state`, `--export-metrics`
   - Return values: Exit codes, output format
   - Side effects: Creates backup, updates memory.db
   - Error conditions: Missing session, permission errors

2. **Journal Hook**
   ```bash
   npx claude-flow@alpha hooks journal [OPTIONS]
   ```
   - Parameters: `--message`, `--category`, `--session-id`
   - File location: `sessions/captains-log/YYYY-MM-DD.md`
   - Append behavior: Create-or-append by date

3. **Session Restore Hook**
   ```bash
   npx claude-flow@alpha hooks session-restore --session-id [ID]
   ```
   - Parameters: `--session-id`, `--partial-restore`
   - Restoration process: Memory → Context → State

4. **Memory Query Commands**
   - How to query memory.db directly
   - SQL schema reference
   - Common queries

**Examples Needed:**
- Full command invocations with output
- Error handling examples
- Integration with other hooks

---

### 2.2 Hook Integration Details

**Target Audience:** Developers integrating session closeout into workflows

**Location:** `sessions/session-20251113-211159-hive-mind-setup/iteration-2/artifacts/phase-2/docs/hook-integration.md`

**Format:** Integration patterns with code examples

**Key Sections:**

1. **Pre-Task Setup**
   ```bash
   npx claude-flow@alpha hooks pre-task --description "Task description"
   # Initializes memory.db, creates session context
   ```

2. **During-Work Updates**
   ```bash
   npx claude-flow@alpha hooks post-edit --file "path/to/file"
   # Updates memory with file changes
   ```

3. **Post-Task Cleanup**
   ```bash
   npx claude-flow@alpha hooks post-task --task-id "task-id"
   npx claude-flow@alpha hooks session-end --generate-summary true
   ```

4. **Custom Hook Integration**
   - How to add custom hooks
   - Hook execution order
   - Hook return value handling

**Integration Patterns:**
- Sequential workflow (one hook after another)
- Parallel coordination (multiple agents)
- Error recovery (rollback on failure)

**Examples Needed:**
- Complete workflow examples
- Multi-agent coordination examples
- Error handling patterns

---

### 2.3 Memory Architecture

**Target Audience:** Developers working with memory.db

**Location:** `sessions/session-20251113-211159-hive-mind-setup/iteration-2/artifacts/phase-2/docs/memory-architecture.md`

**Format:** Technical deep-dive with schema diagrams

**Key Sections:**

1. **SQLite Schema**
   - Tables: sessions, tasks, edits, metrics
   - Indexes for performance
   - Foreign key relationships

2. **Memory Query API**
   - How hooks read/write memory
   - Namespace conventions
   - Key naming patterns

3. **Cross-Session Context**
   - How memory persists between sessions
   - Query patterns for "past sessions with similar work"
   - Performance considerations

4. **Backup Archive Format**
   - JSON structure
   - What's included in backups
   - Restoration process

**Examples Needed:**
- SQL queries for common operations
- JSON backup structure examples
- Query performance benchmarks

---

### 2.4 Testing Procedures

**Target Audience:** QA, developers writing tests

**Location:** `sessions/session-20251113-211159-hive-mind-setup/iteration-2/artifacts/phase-2/docs/testing-procedures.md`

**Format:** Test scenarios with expected outcomes

**Key Sections:**

1. **Unit Tests**
   - Test individual hooks in isolation
   - Mock memory.db operations
   - Verify file system operations

2. **Integration Tests**
   - Test complete closeout workflow
   - Verify memory → captain's log → backup
   - Test restore functionality

3. **Edge Cases**
   - Empty sessions
   - Corrupted memory.db
   - Permission errors
   - Concurrent session closeouts

4. **Test Data Setup**
   - How to create test sessions
   - How to populate memory.db
   - How to verify results

**Examples Needed:**
- Test scripts for each scenario
- Expected vs actual output comparisons
- Error condition tests

---

## 3. CLAUDE.md Updates

### 3.1 Section: WORKSPACE LEARNING INFRASTRUCTURE

**Current Issue:** Text is stock-compliant but could be clearer about the "5% wrapper" nature

**Current Text (lines 412-451):**
```markdown
## The Three Principles

1. **Time-neutral** - All operations are on-demand via CLI commands...
2. **Scale-agnostic** - The system works identically...
3. **Stock-first** - 95% stock claude-flow infrastructure...
```

**Proposed Update:**
```markdown
## The Three Principles

1. **Time-neutral** - All operations are on-demand via CLI commands. No scheduled tasks, no "daily" routines, no time-based triggers.
   - **What this means:** Run session closeout when you're ready, not on a schedule
   - **Stock command:** `npx claude-flow@alpha hooks session-end`

2. **Scale-agnostic** - The system works identically whether managing 10 items or 10,000. Graceful degradation, no hard limits.
   - **What this means:** Start with one session, scale to hundreds naturally
   - **Stock behavior:** claude-flow handles scale automatically

3. **Stock-first** - 95% stock claude-flow infrastructure, 5% thin wrappers for workflow. No custom frameworks, no reinvention.
   - **What this means:** We use `npx claude-flow@alpha hooks` commands directly
   - **The 5%:** Workflow guidance in this CLAUDE.md file
```

**Rationale:** Clarifies that the system IS the stock tools, not a wrapper around them

---

### 3.2 Section: Session Artifacts & Collaborative Closeout

**Current Issue:** Contains temporal language ("When User Says 'Done'") that violates time-neutral principle

**Current Text (lines 512-519):**
```markdown
### SESSION CLOSEOUT (When User Says "Done" or "Close Session")

**Closeout ritual** (always human-in-the-loop):
  1. Agents present the summary artifact plus an index of everything in `artifacts/`.
  2. You review/annotate and approve the summary; only approved text is copied into the Captain's Log and stored in memory.
  3. After approval, run the standard hooks (`post-task`, `session-end`) to archive `.swarm` state and freeze the session folder.
```

**Proposed Update:**
```markdown
### SESSION CLOSEOUT (On-Demand, Human-Triggered)

**Closeout Process:**

1. **Trigger closeout** (when ready to archive session):
   ```bash
   npx claude-flow@alpha hooks session-end --generate-summary true
   ```

2. **Review generated summary**:
   - Location: `sessions/$SESSION_ID/session-summary.md`
   - Review completeness and accuracy
   - Annotate with additional context if needed

3. **Approve for archival**:
   - Approved summary → Captain's log entry
   - Session state → `.swarm/backups/$SESSION_ID.json`
   - Memory preserved in `.swarm/memory.db`

**Stock Commands Used:**
- `npx claude-flow@alpha hooks session-end` - Creates backup, generates summary
- `npx claude-flow@alpha hooks journal` - Appends to captain's log (if approved)
- `npx claude-flow@alpha hooks post-task` - Finalizes task state

**Human-in-the-Loop:**
- Summary review is manual (not automatic)
- Approval step prevents premature archival
- You decide what goes in the captain's log
```

**Rationale:**
- Removes temporal language ("when done")
- Clarifies this is on-demand, not event-triggered
- Shows exact stock commands used
- Explains human decision points

---

### 3.3 Section: Session Closeout Flow

**Current Issue:** High-level description lacks concrete commands

**Current Text (lines 521-534):**
```markdown
## Session Closeout Flow

**High-level workflow** (on-demand, when ready to wrap up):

1. **Collect** - Gather session data
   ```bash
   npx claude-flow@alpha hooks session-end --generate-summary true
   ```

2. **Classify** - Organize findings (automatic categorization)

3. **HITL Confirm** - Review summary, approve archive

4. **Archive** - Store backup with timestamp
```

**Proposed Update:**
```markdown
## Session Closeout Flow

**Complete Workflow** (run when ready to archive):

**Step 1: Generate Summary**
```bash
npx claude-flow@alpha hooks session-end --generate-summary true
```
Output: `sessions/$SESSION_ID/session-summary.md`

**Step 2: Review Summary**
```bash
cat sessions/$SESSION_ID/session-summary.md
# Review: Are all key decisions documented?
# Review: Are all artifacts indexed?
# Review: Is context sufficient for future reference?
```

**Step 3: Approve & Archive**
If summary is accurate:
```bash
# Append to captain's log (manual command, not automatic)
npx claude-flow@alpha hooks journal \
  --message "$(cat sessions/$SESSION_ID/session-summary.md)" \
  --category "session-closeout" \
  --session-id "$SESSION_ID"
```

**Step 4: Verify Backup**
```bash
# Backup created automatically by session-end
ls -lh .swarm/backups/$SESSION_ID.json

# Verify backup contents
cat .swarm/backups/$SESSION_ID.json | jq '.summary, .metrics'
```

**What Gets Stored:**
- `.swarm/backups/` - Full session snapshot (memory + logs + metrics)
- `.swarm/memory.db` - Structured data (queryable)
- `sessions/captains-log/YYYY-MM-DD.md` - Human-readable narrative (approved summaries only)

**Recovery:**
```bash
# Restore session context from backup
npx claude-flow@alpha hooks session-restore --session-id "$SESSION_ID"
```
```

**Rationale:**
- Shows exact commands at each step
- Clarifies what's automatic vs manual
- Explains where data lives
- Adds recovery procedure

---

### 3.4 New Section: Hook Integration Examples

**Location:** After "Agent Coordination Protocol" section (after line 297)

**Proposed Addition:**
```markdown
## 📚 Session Closeout Integration

### Complete Session Lifecycle

**Session Start (Automatic):**
```bash
# Triggered automatically on first message in chat
SESSION_ID="session-$(date +%Y%m%d-%H%M%S)-<topic>"
mkdir -p "sessions/$SESSION_ID/artifacts/{code,tests,docs,scripts,notes}"
npx claude-flow@alpha hooks pre-task --description "Session initialization" --task-id "$SESSION_ID"
```

**During Work (Continuous):**
```bash
# After each significant file edit
npx claude-flow@alpha hooks post-edit --file "path/to/file" --update-memory true

# After completing sub-tasks
npx claude-flow@alpha hooks post-task --task-id "subtask-id"

# For important decisions (manual)
npx claude-flow@alpha hooks journal --message "Decision: Chose React over Vue for better ecosystem"
```

**Session End (On-Demand):**
```bash
# When ready to close out session
npx claude-flow@alpha hooks session-end --generate-summary true --export-metrics true

# Review generated summary
cat sessions/$SESSION_ID/session-summary.md

# If approved, append to captain's log
npx claude-flow@alpha hooks journal \
  --message "$(cat sessions/$SESSION_ID/session-summary.md)" \
  --category "session-closeout"
```

### Multi-Agent Coordination with Session Closeout

**Each agent in a swarm should:**

1. **Start with session context:**
   ```bash
   npx claude-flow@alpha hooks session-restore --session-id "$SESSION_ID"
   ```

2. **Update memory during work:**
   ```bash
   npx claude-flow@alpha hooks post-edit --file "$FILE" --memory-key "agent/role/step"
   ```

3. **Contribute to session summary:**
   ```bash
   npx claude-flow@alpha hooks notify --message "Agent completed: [what was done]"
   ```

4. **Final agent cleanup:**
   ```bash
   npx claude-flow@alpha hooks post-task --task-id "agent-task-id"
   ```

**Coordinator agent closes out session:**
```bash
# After all agents complete
npx claude-flow@alpha hooks session-end --generate-summary true
```
```

**Rationale:**
- Provides concrete integration examples
- Shows how agents use hooks together
- Clarifies session lifecycle with real commands
- Bridges conceptual to practical

---

## 4. Implementation Notes for Phase 2

### 4.1 Documentation Writers

**Writers needed:**
- Technical writer (user-facing docs)
- Developer docs specialist (API reference)
- CLAUDE.md editor (corrections and examples)

**Coordination:**
- Share common terminology glossary
- Use consistent command examples
- Cross-reference between docs

### 4.2 Content Standards

**Voice:**
- User-facing: Conversational, explain jargon
- Technical: Precise, assume developer knowledge
- CLAUDE.md: Directive, imperative tone

**Examples:**
- Every command must show full output
- Every concept must have a "why this matters"
- Every error must have a solution

**Formatting:**
- Code blocks with syntax highlighting
- Headers for scanning
- Bold for critical warnings
- Tables for comparisons

### 4.3 Testing Documentation

**Before release, verify:**
- [ ] Every command example runs successfully
- [ ] Every file path exists in example outputs
- [ ] Every troubleshooting step resolves the issue
- [ ] Every concept explanation is understandable by target audience

**Test with:**
- A new user (no prior knowledge)
- An experienced developer (technical accuracy)
- A project manager (workflow clarity)

### 4.4 Maintenance Plan

**Documentation should be:**
- **Version-controlled:** Track changes with git
- **Dated:** Include "Last updated" timestamps
- **Linked:** Cross-reference related docs
- **Tested:** Re-run examples on each claude-flow update

**Update triggers:**
- claude-flow version update
- New hook commands added
- User reports confusion
- Integration patterns change

---

## 5. Deliverables Summary

| Document | Location | Owner | Priority |
|----------|----------|-------|----------|
| Quick Start Guide | `phase-2/docs/quick-start-guide.md` | Technical Writer | HIGH |
| Troubleshooting Guide | `phase-2/docs/troubleshooting.md` | Technical Writer | HIGH |
| Concepts Explainer | `phase-2/docs/concepts.md` | Technical Writer | MEDIUM |
| Script Reference | `phase-2/docs/script-reference.md` | Developer Docs | HIGH |
| Hook Integration | `phase-2/docs/hook-integration.md` | Developer Docs | HIGH |
| Memory Architecture | `phase-2/docs/memory-architecture.md` | Developer Docs | MEDIUM |
| Testing Procedures | `phase-2/docs/testing-procedures.md` | QA Engineer | HIGH |
| CLAUDE.md Updates | `CLAUDE.md` (root) | CLAUDE.md Editor | CRITICAL |

**Estimated Effort:**
- User-facing docs: 8-10 hours
- Technical docs: 12-15 hours
- CLAUDE.md updates: 2-3 hours
- Testing & validation: 4-6 hours
- **Total: 26-34 hours**

---

## 6. Success Criteria

**User-facing docs successful if:**
- New user can complete session closeout in <5 minutes
- Common errors are resolved without external help
- Users understand "why" not just "how"

**Technical docs successful if:**
- Developers can integrate hooks without trial-and-error
- All commands are copy-paste ready
- Architecture is clear enough to extend

**CLAUDE.md updates successful if:**
- Removes all temporal language
- Clarifies stock-first approach
- Provides concrete examples for every workflow

---

**Next Steps:**
Phase 2 agents should use this plan to write documentation in parallel, coordinating through memory on terminology and examples.
