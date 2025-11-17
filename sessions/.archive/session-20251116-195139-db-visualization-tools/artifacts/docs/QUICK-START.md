# 5-Minute Quick Start: View Your Databases Now

## Your Workspace Snapshot

**You have 45,563 memory entries** across 19 different namespaces in `.swarm/memory.db`! 🎉

## Install DB Browser (2 minutes)

```bash
brew install --cask db-browser-for-sqlite
```

Or download: https://sqlitebrowser.org/dl/

## Open Your Main Database (1 minute)

1. Launch "DB Browser for SQLite"
2. File → Open Database
3. Navigate to: `/Users/splurfa/common-thread-sandbox/.swarm/memory.db`

## See Your Data (2 minutes)

**Step 1**: Click "Browse Data" tab at top

**Step 2**: Select `memory_entries` from dropdown

**Step 3**: You'll see 45,563 rows across these namespaces:
- `agent-assignments`
- `agents`
- `command-history`
- `command-results`
- `coordination`
- `default`
- `file-history`
- `hive1`
- `hooks:notify`
- `hooks:post-bash`
- `hooks:post-edit`
- `hooks:post-task`
- `hooks:pre-bash`
- `hooks:pre-edit`
- `hooks:pre-task`
- `journal`
- `neural-training`
- `performance`
- `performance-metrics`
- `root-files-analysis`

## Try Your First Query

Click "Execute SQL" tab, paste this, click Run:

```sql
SELECT namespace, COUNT(*) as count
FROM memory_entries
GROUP BY namespace
ORDER BY count DESC;
```

This shows how many memories you have in each namespace!

## Open More Databases

File → New Tab → Open:
- `.agentdb/reasoningbank.db` (33 tables of learning data)
- `.hive-mind/hive.db` (coordination data)

## That's It!

You're now browsing your databases visually. No coding required.

**Full guide**: See [WORKSPACE-SPECIFIC-GUIDE.md](WORKSPACE-SPECIFIC-GUIDE.md)
