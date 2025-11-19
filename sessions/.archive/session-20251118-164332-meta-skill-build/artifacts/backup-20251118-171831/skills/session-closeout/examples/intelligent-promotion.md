# Session Closeout: Intelligent Document Promotion

This example demonstrates the new intelligent categorization system.

## Scenario

Session `session-20251116-151059-coherence-analysis` with 30 markdown docs.

## Closeout Flow

### 1. Initiate Closeout
```bash
/session-closeout
```

### 2. Intelligent Analysis

After HITL approval, automatic categorization runs:

```
📄 Analyzing session documentation...

📊 Document Promotion Analysis (30 files scanned)

✅ TIER 1: Definitely Promote (3 files)
→ docs/guides/reference/hive-mind-reality-guide.md
  Source: HIVE-MIND-REALITY-GUIDE.md (37K)
  Why: User-facing guide (1297 lines), comprehensive reference

→ docs/guides/how-to/template-usage-guide.md
  Source: template-usage-guide.md (14K)
  Why: User-facing guide (425 lines), comprehensive reference

→ docs/guides/reference/stock-claude-flow-research.md
  Source: stock-claude-flow-research.md (21K)
  Why: User-facing guide (612 lines), comprehensive reference

💡 TIER 2: Recommend Promote (2 files)
→ docs/guides/concepts/adaptive-pivot-stock-first.md
  Source: adaptive-pivot-stock-first.md (4.0K)
  Why: Educational content, may have permanent value

→ docs/guides/reference/feature-reality-check.md
  Source: feature-reality-check.md (19K)
  Why: Educational content, may have permanent value

⏸️ TIER 3: Keep in Session (25 files)
  → verification-1-session-existence.md (4.2K) - Session-specific analysis
  → verification-2-file-location.md (11K) - Session-specific analysis
  → coherence-analysis-report.md (13K) - Research findings from this session
  → meta-issue-session-spawning.md (4.0K) - Research findings from this session
  ... (21 more)

Review promotion plan?
  (y) Accept and promote Tier 1+2
  (n) Skip all promotion
  (1) Promote only Tier 1
Choice [y/n/1]:
```

### 3. User Decision

**Option y**: Promote both Tier 1 + 2 (5 files total)
**Option 1**: Promote only Tier 1 (3 files, safest choice)
**Option n**: Skip all promotion

Example choosing option 1:
```
Choice [y/n/1]: 1

📦 Promoting documents...
  ✓ HIVE-MIND-REALITY-GUIDE.md → docs/guides/reference/hive-mind-reality-guide.md
  ✓ template-usage-guide.md → docs/guides/how-to/template-usage-guide.md
  ✓ stock-claude-flow-research.md → docs/guides/reference/stock-claude-flow-research.md
  ✅ Promotion complete

🔄 Clearing session environment...
🗄️  Moving to archive...
✅ Session closeout complete
```

### 4. Results

**Promoted**:
- 3 comprehensive guides moved to permanent docs/
- Available in `docs/guides/{category}/` structure
- Integrated into workspace documentation

**Preserved**:
- All 30 originals in `sessions/.archive/session-20251116-151059-coherence-analysis/artifacts/docs/`
- Complete session historical record
- No data loss

## Categorization Logic

**Tier 1 Signals** (Definitely Promote):
- Title contains: "Guide", "Tutorial", "How to", "Reference"
- Has structure: Overview, Prerequisites, Examples
- Length: 200+ lines (comprehensive)
- User-facing language

**Tier 3 Signals** (Keep in Session):
- Title contains: "Analysis", "Report", "Summary", "Verification"
- Contains session IDs
- Session-specific findings
- Temporary/internal work

**Tier 2**: Borderline cases requiring review

## See Also

- [Basic Closeout](basic-closeout.md) - Simple closeout without promotion
- [File Routing](../../../.claude/skills/file-routing/README.md) - Content routing rules
- [Docs Structure](../../../../docs/guides/README.md) - Workspace docs organization
