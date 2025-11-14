# TSCP Implementation Checklist

**Version:** 1.0.0
**Status:** Ready for execution
**Estimated Time:** 4-6 hours

---

## Phase 1: Infrastructure (Scripts & Wrappers)

### 1.1 Create TSCP Scripts Directory
```bash
mkdir -p scripts/tscp
```

**Deliverables:**
- [ ] Directory created: `scripts/tscp/`

---

### 1.2 Implement `tscp-plan-generate` Script

**File:** `scripts/tscp/plan-generate.sh`

```bash
#!/usr/bin/env bash
# Generates execution plan for TSCP Phase 1

SESSION_ID=${1:-$(date +%Y%m%d-%H%M%S)}
TASK_DESCRIPTION=${2:-"Unnamed task"}

# Create session directory
SESSION_DIR="sessions/$SESSION_ID-tscp-session"
mkdir -p "$SESSION_DIR/artifacts"

# Run pre-task hook (stock claude-flow)
npx claude-flow@alpha hooks pre-task --description "$TASK_DESCRIPTION"

# Generate plan document template
cat > "$SESSION_DIR/artifacts/execution-plan.md" << 'EOF'
# Execution Plan: [Task Name]

## Mission Statement
[What we're building/solving]

## Success Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## Agent Roster
1. Agent Name - Role and responsibilities

## Execution Strategy
- Phase 1: [Phase name] ([Sequential/Parallel])
  └─ [Steps]

## Work Breakdown
[See TodoWrite for detailed tasks]

## Artifact Inventory
Expected outputs:
- path/to/file.ext (description)

## Risk Assessment
⚠️ Risk: [Description]
   → Mitigation: [Strategy]

## Estimated Timeline
- Phase 1: ~X minutes
- Total: ~Y minutes
EOF

echo "$SESSION_DIR/artifacts/execution-plan.md"
```

**Deliverables:**
- [ ] Script created: `scripts/tscp/plan-generate.sh`
- [ ] Script is executable: `chmod +x scripts/tscp/plan-generate.sh`
- [ ] Template generates correctly
- [ ] Integrates with stock claude-flow hooks

---

### 1.3 Implement `tscp-notify-artifact` Script

**File:** `scripts/tscp/notify-artifact.sh`

```bash
#!/usr/bin/env bash
# Wraps post-edit hook with TSCP notification formatting

FILE_PATH=$1
AGENT_NAME=${2:-"Unknown Agent"}
PHASE=${3:-"Execution"}
MEMORY_KEY=${4:-"swarm/generic"}

# Run stock post-edit hook
npx claude-flow@alpha hooks post-edit \
  --file "$FILE_PATH" \
  --memory-key "$MEMORY_KEY"

# Format notification for user
echo ""
echo "📄 Document Created/Modified"
echo "   Path: $FILE_PATH"
echo "   Agent: $AGENT_NAME"
echo "   Phase: $PHASE"
echo "   Status: Ready for review"
echo ""
```

**Deliverables:**
- [ ] Script created: `scripts/tscp/notify-artifact.sh`
- [ ] Script is executable
- [ ] Notification format matches spec
- [ ] Wraps stock hook correctly

---

### 1.4 Implement `tscp-progress-update` Script

**File:** `scripts/tscp/progress-update.sh`

```bash
#!/usr/bin/env bash
# Updates progress and runs post-task hook

TASK_ID=$1
STATUS=${2:-"complete"}
PROGRESS_NOTE=${3:-""}

# Run stock post-task hook
npx claude-flow@alpha hooks post-task \
  --task-id "$TASK_ID" \
  --status "$STATUS"

# Store progress note in memory if provided
if [ -n "$PROGRESS_NOTE" ]; then
  npx claude-flow@alpha hooks memory \
    --key "progress/$TASK_ID" \
    --value "$PROGRESS_NOTE"
fi

echo "✅ Task $TASK_ID marked as $STATUS"
```

**Deliverables:**
- [ ] Script created: `scripts/tscp/progress-update.sh`
- [ ] Script is executable
- [ ] Integrates with stock hooks
- [ ] Stores progress notes in memory

---

### 1.5 Implement `tscp-closeout` Script

**File:** `scripts/tscp/closeout.sh`

```bash
#!/usr/bin/env bash
# TSCP Phase 3 closeout with HITL review

SESSION_ID=$1
SUMMARY_FILE="sessions/$SESSION_ID/artifacts/session-summary.md"

# Check summary exists
if [ ! -f "$SUMMARY_FILE" ]; then
  echo "❌ Error: Session summary not found at $SUMMARY_FILE"
  exit 1
fi

# Present summary for review
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "SESSION SUMMARY READY FOR REVIEW"
echo "═══════════════════════════════════════════════════════════"
echo ""
cat "$SUMMARY_FILE"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "Review complete. Ready to archive? [yes/no]"

# In practice, Claude Code handles the approval prompt
# This script would be called after user approves

# Run stock session-end hook
npx claude-flow@alpha hooks post-task --task-id "swarm-$SESSION_ID"
npx claude-flow@alpha hooks session-end --export-metrics true

echo ""
echo "✅ Session archived successfully"
echo "Archive location: .swarm/backups/$SESSION_ID/"
echo ""
```

**Deliverables:**
- [ ] Script created: `scripts/tscp/closeout.sh`
- [ ] Script is executable
- [ ] Displays summary correctly
- [ ] Runs stock hooks after approval

---

### 1.6 Add Scripts to package.json

**File:** `package.json`

```json
{
  "scripts": {
    "tscp:plan": "bash scripts/tscp/plan-generate.sh",
    "tscp:notify": "bash scripts/tscp/notify-artifact.sh",
    "tscp:progress": "bash scripts/tscp/progress-update.sh",
    "tscp:closeout": "bash scripts/tscp/closeout.sh"
  }
}
```

**Deliverables:**
- [ ] Scripts added to package.json
- [ ] Scripts callable via `npm run tscp:*`

---

## Phase 2: CLAUDE.md Updates

### 2.1 Add TSCP Section

**File:** `CLAUDE.md`

**Action:** Insert new section after "Agent Coordination Protocol"

**Content:** Use `claude-md-updates.md` (UPDATE 1)

**Deliverables:**
- [ ] New section added to CLAUDE.md (~150 lines)
- [ ] Section includes all 3 TSCP phases
- [ ] Examples are clear and actionable
- [ ] Formatting is consistent with rest of CLAUDE.md

---

### 2.2 Update Agent Execution Flow Section

**File:** `CLAUDE.md`

**Action:** Replace "The Correct Pattern:" subsection

**Content:** Use `claude-md-updates.md` (UPDATE 2)

**Deliverables:**
- [ ] Section updated with TSCP flow
- [ ] 6-step pattern documented
- [ ] Phase numbers reference TSCP

---

### 2.3 Replace Full-Stack Development Example

**File:** `CLAUDE.md`

**Action:** Replace entire "Example Full-Stack Development:" example

**Content:** Use `claude-md-updates.md` (UPDATE 3)

**Deliverables:**
- [ ] Old example replaced
- [ ] New TSCP-compliant example shows all 3 phases
- [ ] Includes plan generation, approval, notifications, closeout
- [ ] TodoWrite examples are comprehensive (10+ todos)

---

### 2.4 Add TSCP Notes to Golden Rule

**File:** `CLAUDE.md`

**Action:** Add exception note after golden rule

**Content:** Use `claude-md-updates.md` (UPDATE 4)

**Deliverables:**
- [ ] Exception note added
- [ ] Explains blocking approval step

---

### 2.5 Update TodoWrite Usage Section

**File:** `CLAUDE.md`

**Action:** Add TSCP bullet to "When to Use TodoWrite"

**Content:** Use `claude-md-updates.md` (UPDATE 5)

**Deliverables:**
- [ ] Bullet added
- [ ] Explains planning phase requirements

---

## Phase 3: Agent Prompt Templates

### 3.1 Create Base TSCP Agent Prompt Fragment

**File:** `prompts/fragments/tscp-requirements.md`

```markdown
## Transparent Swarm Protocol (TSCP) Requirements

You are part of a transparent swarm. You MUST follow TSCP:

### Before Starting Work
1. Read execution plan: `sessions/<SESSION_ID>/artifacts/execution-plan.md`
2. Understand your role and success criteria
3. Identify which todos you're responsible for

### During Work
1. Create ALL artifacts in: `sessions/<SESSION_ID>/artifacts/<category>/`
2. After creating/modifying files, notify:
   ```bash
   npm run tscp:notify "<file-path>" "<your-agent-name>" "<current-phase>"
   ```
3. Update progress regularly:
   ```bash
   npm run tscp:progress "<task-id>" "in_progress" "<progress-note>"
   ```

### After Completing Tasks
1. Mark todos complete:
   ```bash
   npm run tscp:progress "<task-id>" "complete"
   ```
2. Update session summary with your work
3. Coordinate via memory for handoffs

### Documentation Requirements
- Write clear, reviewable artifacts
- Explain decisions in docs/comments
- Link related work in memory
- Make artifacts self-contained (assume user reads without context)
```

**Deliverables:**
- [ ] Fragment created: `prompts/fragments/tscp-requirements.md`
- [ ] Fragment is modular (can be included in any agent prompt)

---

### 3.2 Update Agent Prompt Templates

**Action:** Prepend TSCP fragment to all 54 agent definitions

**Affected Files:**
- All agent prompt files in agent system
- Or: Update agent spawning logic to auto-include TSCP fragment

**Deliverables:**
- [ ] All 54 agents include TSCP requirements
- [ ] OR: Spawning logic auto-injects TSCP fragment
- [ ] Test with 3-5 sample agents

---

## Phase 4: Testing & Validation

### 4.1 Test Plan Generation

**Test:** Generate plan for simple task

```bash
npm run tscp:plan "test-session" "Build a simple calculator"
```

**Validation:**
- [ ] Session directory created
- [ ] `execution-plan.md` exists with correct template
- [ ] Pre-task hook ran successfully

---

### 4.2 Test Notification System

**Test:** Create test file and trigger notification

```bash
mkdir -p sessions/test-session/artifacts/test
echo "test content" > sessions/test-session/artifacts/test/sample.md
npm run tscp:notify "sessions/test-session/artifacts/test/sample.md" "Test Agent" "Testing Phase"
```

**Validation:**
- [ ] Notification displays correctly
- [ ] Post-edit hook runs
- [ ] File tracked in memory

---

### 4.3 Test Progress Updates

**Test:** Update task progress

```bash
npm run tscp:progress "test-task-1" "in_progress" "Halfway complete"
npm run tscp:progress "test-task-1" "complete"
```

**Validation:**
- [ ] Post-task hook runs
- [ ] Progress notes stored in memory
- [ ] Status updates correctly

---

### 4.4 Test Closeout Workflow

**Test:** Create sample summary and run closeout

```bash
mkdir -p sessions/test-session/artifacts
cat > sessions/test-session/artifacts/session-summary.md << EOF
# Test Session Summary
- Task 1: Complete
- Task 2: Complete
EOF

npm run tscp:closeout "test-session"
```

**Validation:**
- [ ] Summary displays correctly
- [ ] Waits for approval (in manual test)
- [ ] Session-end hook runs
- [ ] Backup created in `.swarm/backups/`

---

### 4.5 Integration Test: End-to-End TSCP Workflow

**Test:** Run complete TSCP workflow with real task

**Task:** "Create a simple Express REST API with one endpoint"

**Steps:**
1. Generate plan with TodoWrite (3-5 todos)
2. Get approval (manual)
3. Spawn 2 agents (backend-dev, tester) with TSCP instructions
4. Agents create artifacts with notifications
5. Generate summary
6. Get approval and closeout

**Validation:**
- [ ] Plan generated and approved
- [ ] Agents used TSCP scripts
- [ ] Notifications appeared in real-time
- [ ] Todos updated progressively
- [ ] Summary accurate and complete
- [ ] Archive created successfully

---

### 4.6 Test Opt-Out Mechanism

**Test:** Verify user can skip planning approval

```
User: "Build an API --skip-tscp-approval"
```

**Validation:**
- [ ] Planning phase skipped
- [ ] Execution proceeds immediately
- [ ] Notifications still work (Phase 2)
- [ ] Closeout still works (Phase 3)

---

### 4.7 Test Multi-Agent Swarm (8+ agents)

**Test:** Run large swarm with TSCP

**Task:** "Migrate monolith to microservices" (scaled-down version)

**Validation:**
- [ ] Plan handles 8+ agents correctly
- [ ] TodoWrite has 15+ todos
- [ ] Notifications don't overwhelm (verbosity scaling)
- [ ] Phase completion summaries group artifacts
- [ ] Closeout handles large artifact inventory

---

## Phase 5: Documentation

### 5.1 Create User Guide

**File:** `docs/guides/transparent-swarm-protocol-user-guide.md`

**Sections:**
1. What is TSCP?
2. How to use TSCP (step-by-step)
3. What to expect at each phase
4. How to review plans effectively
5. How to monitor progress
6. How to review summaries
7. FAQ

**Deliverables:**
- [ ] User guide created
- [ ] Includes screenshots/examples
- [ ] Clear next steps for users

---

### 5.2 Create Troubleshooting Guide

**File:** `docs/guides/tscp-troubleshooting.md`

**Scenarios:**
1. What if planning approval stalls?
2. What if agents don't send notifications?
3. What if todos don't update?
4. What if closeout fails?
5. How to recover from failed sessions?

**Deliverables:**
- [ ] Troubleshooting guide created
- [ ] Covers common failure modes
- [ ] Includes recovery procedures

---

### 5.3 Document Configuration Options

**File:** `docs/reference/tscp-configuration.md`

**Content:**
- Verbosity levels (`--tscp-verbosity`)
- Opt-out mechanism (`--skip-tscp-approval`)
- Custom notification formatting
- Progress tracking granularity

**Deliverables:**
- [ ] Configuration guide created
- [ ] All options documented
- [ ] Examples provided

---

### 5.4 Create Video Walkthrough (Optional)

**Content:**
- Screen recording of TSCP in action
- Shows all 3 phases
- Demonstrates user interaction points

**Deliverables:**
- [ ] Video recorded (~5 minutes)
- [ ] Uploaded to documentation
- [ ] Linked from user guide

---

## Phase 6: Integration & Deployment

### 6.1 Merge CLAUDE.md Changes

**Action:** Commit CLAUDE.md updates

```bash
git add CLAUDE.md
git commit -m "Add Transparent Swarm Protocol (TSCP) to coordination system

- Add TSCP 3-phase protocol (Planning, Execution, Closeout)
- Update agent execution flow with blocking approval
- Replace examples with TSCP-compliant versions
- Document notification system and progress tracking
- Add HITL review requirements"
```

**Deliverables:**
- [ ] Changes committed to git
- [ ] Commit message follows project conventions

---

### 6.2 Deploy TSCP Scripts

**Action:** Ensure scripts are in project root

```bash
# Scripts already in scripts/tscp/ from Phase 1
# Verify npm scripts work
npm run tscp:plan -- "test" "Test task"
```

**Deliverables:**
- [ ] Scripts deployed and functional
- [ ] All npm scripts work correctly

---

### 6.3 Update Project README (if applicable)

**File:** `README.md`

**Action:** Add section linking to TSCP documentation

```markdown
## Transparent Swarm Protocol (TSCP)

This project uses TSCP for visible, controllable multi-agent coordination.

Key features:
- Review execution plans before work begins
- Real-time notifications as agents work
- Progressive progress tracking
- Human-in-the-loop closeout review

See [TSCP User Guide](docs/guides/transparent-swarm-protocol-user-guide.md) for details.
```

**Deliverables:**
- [ ] README updated (if README exists)
- [ ] Links point to correct documentation

---

### 6.4 Announcement & Communication

**Action:** Notify team/users of TSCP availability

**Channels:**
- Project changelog
- Team communication (Slack/Discord/etc.)
- Documentation update notification

**Deliverables:**
- [ ] Announcement drafted
- [ ] Announcement distributed
- [ ] Feedback channel established

---

## Phase 7: Monitoring & Iteration

### 7.1 Collect User Feedback

**Timeline:** First 2 weeks after deployment

**Feedback Points:**
- Is planning approval helpful or annoying?
- Are notifications too frequent/infrequent?
- Is closeout HITL valuable?
- Are there confusing aspects?

**Deliverables:**
- [ ] Feedback mechanism established
- [ ] Feedback collected and categorized

---

### 7.2 Analyze Usage Metrics

**Metrics to Track:**
- % of swarms using TSCP (should be 100%)
- % of plans requiring revision before approval
- Average notification count per session
- Closeout approval rate

**Deliverables:**
- [ ] Metrics collected
- [ ] Analysis performed
- [ ] Insights documented

---

### 7.3 Refine Based on Feedback

**Action:** Implement improvements based on feedback

**Common Refinements:**
- Adjust notification verbosity defaults
- Improve plan template clarity
- Add more examples to documentation
- Fix edge cases in scripts

**Deliverables:**
- [ ] Refinements implemented
- [ ] Documentation updated
- [ ] Users notified of improvements

---

## Success Criteria

### Mandatory (Must Pass)
- [ ] All Phase 1-6 deliverables complete
- [ ] Integration test passes end-to-end
- [ ] CLAUDE.md includes all TSCP documentation
- [ ] At least one real project uses TSCP successfully

### Recommended (Should Pass)
- [ ] User guide complete and clear
- [ ] Troubleshooting guide covers 5+ scenarios
- [ ] Multi-agent test (8+ agents) passes
- [ ] Feedback mechanism established

### Stretch Goals (Nice to Have)
- [ ] Video walkthrough created
- [ ] 90%+ user satisfaction in feedback
- [ ] Zero critical bugs reported in first week
- [ ] TSCP adopted by 3+ projects

---

## Risk Mitigation

### Risk: Scripts fail in different environments
**Mitigation:** Test on macOS, Linux, Windows (WSL)

### Risk: Users find approval step annoying
**Mitigation:** Opt-out mechanism (`--skip-tscp-approval`)

### Risk: Notification fatigue in large swarms
**Mitigation:** Verbosity scaling by swarm size

### Risk: Poor adoption despite availability
**Mitigation:** Make TSCP default, not opt-in

---

## Timeline Estimate

| Phase | Tasks | Est. Time |
|-------|-------|-----------|
| Phase 1: Infrastructure | 6 tasks | 2 hours |
| Phase 2: CLAUDE.md Updates | 5 tasks | 1 hour |
| Phase 3: Agent Prompts | 2 tasks | 1 hour |
| Phase 4: Testing | 7 tests | 2 hours |
| Phase 5: Documentation | 4 docs | 2 hours |
| Phase 6: Deployment | 4 tasks | 1 hour |
| Phase 7: Monitoring | 3 tasks | Ongoing |
| **Total** | **31 tasks** | **9 hours initial + ongoing** |

**Realistic Timeline:** 2-3 days with testing and refinement

---

## Next Steps After Completion

1. **Celebrate** - TSCP is a significant UX improvement
2. **Dogfood** - Use TSCP for next 5-10 projects
3. **Gather Data** - Track usage and satisfaction
4. **Iterate** - Refine based on real-world usage
5. **Share** - Write blog post or case study
6. **Contribute** - Consider contributing back to claude-flow upstream

---

## Appendix: Quick Reference Commands

```bash
# Generate execution plan
npm run tscp:plan "<session-id>" "<task-description>"

# Notify on artifact creation
npm run tscp:notify "<file-path>" "<agent-name>" "<phase>"

# Update progress
npm run tscp:progress "<task-id>" "in_progress" "<note>"
npm run tscp:progress "<task-id>" "complete"

# Run closeout
npm run tscp:closeout "<session-id>"

# Opt-out of planning approval
User: "Build X --skip-tscp-approval"

# Check TSCP status mid-execution
User: "What's the current status?"
```

---

**Checklist Status:** Ready for execution
**Recommended Start:** Phase 1 (Infrastructure) → Test → Phase 2 (Docs)
**Critical Path:** Phase 1 + Phase 2 + Phase 4.5 (Integration Test)
