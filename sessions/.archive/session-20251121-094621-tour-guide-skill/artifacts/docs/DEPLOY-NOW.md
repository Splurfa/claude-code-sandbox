# Deploy Tour-Guide Skill - Quick Reference

## Status: ✅ READY

## One-Line Deploy

```bash
cp -R sessions/session-20251121-094621-tour-guide-skill/artifacts/code/tour-guide .claude/skills/ && echo "✅ Deployed. Test with: /tour"
```

## Verify (5 seconds)

```bash
# Should show 5 files
ls .claude/skills/tour-guide/lib/ | wc -l

# Should show 4 files
ls .claude/skills/tour-guide/docs/tour-scripts/ | wc -l

# Start Claude Code and type: /tour
```

## Expected Result

User types `/tour` → Intake menu displays with 3 questions

## Rollback If Needed

```bash
rm -rf .claude/skills/tour-guide/
```

---

**Full Details**: See DEPLOYMENT-CHECKLIST.md
**Summary**: See DEPLOYMENT-SUMMARY.md
