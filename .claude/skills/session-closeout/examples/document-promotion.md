# Session Closeout: Document Promotion Walkthrough

This example shows how to handle document promotion during session closeout.

## Scenario

Session `session-20251116-151059-coherence-analysis` completed with:
- 27 markdown docs in `artifacts/docs/`
- Mix of user-facing guides and system analysis
- 4 template JSON files in `artifacts/code/`

## Closeout Flow

### 1. Initiate Closeout

```bash
/session-closeout
```

Output:
```
📄 Session Summary Preview:
# Session: Coherence Analysis & Mission-Critical Implementation
... (summary content) ...

✅ Approve closeout and update Captain's Log? (y/N): y
```

### 2. Document Promotion Prompt

After approval:
```
📄 Checking for user-facing documentation...
  Found 27 documents in session artifacts

    artifacts/docs/HIVE-MIND-REALITY-GUIDE.md (82KB)
    artifacts/docs/template-usage-guide.md (15KB)
    artifacts/docs/verification-1-session-existence.md (8KB)
    ... (25 more files) ...

  📚 Routing guide: .claude/skills/file-routing/README.md

  Promote any docs to docs/guides/? (y/N): y
```

### 3. Routing Decision

User applies 3-question test from file-routing skill:

**HIVE-MIND-REALITY-GUIDE.md**:
1. Audience: Future developers (user-facing ✓)
2. Purpose: Quick reference for hive features (reference ✓)
3. Scope: General guide, not session-specific (permanent ✓)
→ **PROMOTE** to `docs/guides/reference/hive-mind-reality-guide.md`

**template-usage-guide.md**:
1. Audience: Developers using templates (user-facing ✓)
2. Purpose: Step-by-step template usage (how-to ✓)
3. Scope: Reusable guide (permanent ✓)
→ **PROMOTE** to `docs/guides/how-to/template-usage-guide.md`

**verification-1-session-existence.md**:
1. Audience: System (this session only)
2. Purpose: Session-specific verification (ephemeral ✗)
3. Scope: Single session context (ephemeral ✗)
→ **KEEP** in session artifacts (historical record)

### 4. Manual Promotion

```bash
# Promote user-facing guides
cp sessions/session-20251116-151059-coherence-analysis/artifacts/docs/HIVE-MIND-REALITY-GUIDE.md \
   docs/guides/reference/hive-mind-reality-guide.md

cp sessions/session-20251116-151059-coherence-analysis/artifacts/docs/template-usage-guide.md \
   docs/guides/how-to/template-usage-guide.md

# Update README (if needed)
# Add entries to docs/guides/README.md navigation
```

### 5. Resume Closeout

```bash
/session-closeout
```

Now completes normally:
```
  ✓ Skipping document promotion (no unprocessed docs)

📦 Archiving session...
  ✅ Session exported to .swarm/backups/
  ✅ Captain's Log updated
  ✅ Session moved to sessions/.archive/

✅ Session closeout complete
```

## Key Decisions

**Promote When**:
- User-facing guide (not system analysis)
- Reusable across sessions
- Fits docs/guides/ categories

**Keep When**:
- Session-specific analysis
- System development work
- Temporary proposals

**Session Archive Preserves**:
- Complete historical record
- All 27 original docs
- Full session context

## See Also

- `.claude/skills/file-routing/README.md` - Complete routing decision tree
- `examples/basic-closeout.md` - Simple closeout without promotion
- `docs/guides/README.md` - Permanent docs structure
