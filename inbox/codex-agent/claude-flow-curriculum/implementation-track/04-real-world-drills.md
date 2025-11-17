# Implementation Track · 04 Real-World Drills

Goal: combine Claude Flow + Flow Nexus into realistic practice scenarios that mirror how the repo authors expect you to ship features with autonomous agents.

## Drill 1 · Feature Sprint
1. **Plan** – Use SPARC commands to outline a feature (Module 02).
2. **Execute** – Run `/hive-mind:wizard` to spawn queen + workers, then point one worker at a Flow Nexus sandbox for deployment tests.
3. **Validate** – Use `npx claude-flow hive-mind metrics` and Flow Nexus monitoring (README "Monitoring" table) to confirm throughput + credit usage.
4. **Closeout** – Follow the hooks checklist and log a Captain's Log decision linking to both session summary + Flow Nexus sandbox ID.

## Drill 2 · Incident Response
1. Trigger an "incident" by introducing a failing test or sandbox alarm.
2. Use scouts (`.claude/agents/hive-mind/scout-explorer.md`) to gather intel from both repositories.
3. Workers implement fixes; queen issues directives referencing Flow Nexus metrics.
4. Practice HITL Level 3 decision if sensitive (e.g., credential rotation). Document approvals in the Captain's Log.

## Drill 3 · Template Publication
1. Build a small automation (e.g., log analyzer) inside a Flow Nexus sandbox.
2. Document architecture + usage in a session summary.
3. Publish the idea as a "Template" backlog item referencing Flow Nexus README "Marketplace" section (even if you don't ship it yet).
4. Track credits spent to understand economic trade-offs (“Economic Reality” section).

## Drill 4 · KPI Review
1. Pull stats from `npx claude-flow hive-mind metrics` and Flow Nexus dashboards.
2. Present a short report: hooks executed, consensus mode used, credits consumed, templates created.
3. Identify one improvement for the next sprint (e.g., switch to weighted consensus, refine sandbox template).

## Success Metrics
- [ ] At least one drill completed end-to-end with session artifacts + Captain's Log references.
- [ ] Evidence of Claude Flow + Flow Nexus data flowing together (memory namespaces mention sandbox IDs, credit totals, etc.).
- [ ] Personal notes captured for future customization (ties back to Module 04 practice roadmap).
