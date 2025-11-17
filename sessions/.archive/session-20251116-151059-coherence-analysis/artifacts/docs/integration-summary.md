# Stock Claude-Flow Integration Summary

**TL;DR:** Stock hive-mind and custom sessions are COMPLEMENTARY, not competing.

---

## Quick Comparison

| Aspect | Stock Hive-Mind | Custom Sessions |
|--------|----------------|-----------------|
| **Purpose** | Agent coordination | Workspace organization |
| **Location** | `.hive-mind/sessions/` | `sessions/` |
| **Tracks** | Swarm state, consensus, agents | Files, artifacts, work outputs |
| **Scope** | Per swarm spawn | Per chat conversation |
| **Database** | `.hive-mind/hive.db` | `sessions/*/metadata.json` |
| **Shared Infra** | `.swarm/memory.db`, `.swarm/backups/` | ✅ Same |

---

## Integration Pattern (RECOMMENDED)

```
Chat Conversation
├── sessions/session-20251116-api-dev/        ← Custom workspace
│   └── artifacts/                            ← All files go here
│       ├── code/
│       ├── tests/
│       └── docs/
│
├── .hive-mind/sessions/swarm-123/           ← Stock coordination
│   ├── state.json                           ← Swarm metadata
│   └── checkpoints/                         ← State snapshots
│
└── .swarm/                                  ← Shared infrastructure
    ├── memory.db                            ← Both systems use
    └── backups/                             ← Both create backups
```

---

## Workflow Example

```bash
# 1. Chat starts (auto-creates workspace)
sessions/session-20251116-151500-api-dev/

# 2. For complex work, spawn hive-mind
npx claude-flow hive-mind spawn "Build REST API" --claude

# 3. Execute generated Task() commands
# → Agents save to sessions/session-*/artifacts/

# 4. Hive-mind tracks coordination
# → .hive-mind/sessions/swarm-*/state.json

# 5. Both systems share memory
# → .swarm/memory.db (different namespaces)

# 6. Session closeout
# → Stock creates .swarm/backups/session-*.json
# → Custom updates sessions/*/metadata.json
```

---

## Key Insights

1. **No Conflict:** Different directories, different purposes
2. **Shared Memory:** Both use `.swarm/memory.db` with different namespaces
3. **Complementary:** Stock coordinates agents, custom organizes outputs
4. **Stock-Agnostic:** Hive-mind doesn't specify file routing (compatible with custom)

---

## HITL Decision Points

1. **Approve Option 2 (Nested Integration)?**
   - YES → Proceed with documentation updates
   - NO → Discuss alternatives

2. **Session terminology clarification?**
   - "Workspace Session" vs "Swarm Session"

3. **Hive-mind recommendation threshold?**
   - Suggest when 3+ agents needed?

---

## Next Steps (If Approved)

1. Update CLAUDE.md with integration protocol
2. Clarify session concepts in docs
3. Test nested workflow end-to-end
4. Create integration examples

---

**Full Research:** See `stock-claude-flow-research.md`
