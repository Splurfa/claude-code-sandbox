# Database Visualization Guide for YOUR Workspace

**Created**: 2025-11-16
**Workspace**: `/Users/splurfa/common-thread-sandbox`

## 🎯 Your Actual Database Files

You have **6 databases** in your workspace:

| Database | Size | Tables | Purpose |
|----------|------|--------|---------|
| `.swarm/memory.db` | **75 MB** | 8 tables | Main memory storage (LARGEST) |
| `.agentdb/reasoningbank.db` | 376 KB | 33 tables | ReasoningBank learning data |
| `.hive-mind/hive.db` | 224 KB | ? | Hive coordination |
| `.hive-mind/memory.db` | 16 KB | 1 table | Hive memory |
| `.inbox/archive.db` | 0 B | ? | Empty archive |
| `sessions/.archive/.../agentdb.db` | ? | ? | Archived session data |

## 🏆 BEST Solution for You: **DB Browser for SQLite**

### Why This Tool?
✅ **100% FREE** - No paid tiers, no limitations
✅ **LOCAL ONLY** - No cloud, no accounts, no internet needed
✅ **ZERO CODING** - Spreadsheet-like interface
✅ **macOS NATIVE** - Works perfectly on your Mac
✅ **MULTI-FILE** - Open all 6 databases at once in tabs

### Installation (2 minutes)

**Option 1: Homebrew** (Recommended)
```bash
brew install --cask db-browser-for-sqlite
```

**Option 2: Direct Download**
1. Visit: https://sqlitebrowser.org/dl/
2. Download: `DB.Browser.for.SQLite-arm64.dmg` (for Apple Silicon)
3. Drag to Applications folder
4. Open "DB Browser for SQLite"

### Quick Start with YOUR Databases

**Step 1**: Open DB Browser for SQLite

**Step 2**: File → Open Database → Navigate to:
```
/Users/splurfa/common-thread-sandbox/.swarm/memory.db
```

**Step 3**: You'll see these tables:
- `memory_entries` - Your main memory data (likely the biggest)
- `patterns` - Learned patterns
- `pattern_embeddings` - Vector embeddings
- `pattern_links` - Pattern relationships
- `task_trajectories` - Agent task history
- `metrics_log` - Performance metrics
- `consolidation_runs` - Memory consolidation events
- `matts_runs` - Custom tracking

**Step 4**: Click "Browse Data" tab → Select table → View as spreadsheet

**Step 5**: Open more databases in new tabs:
- File → Open Database → Select `.agentdb/reasoningbank.db`
- File → Open Database → Select `.hive-mind/hive.db`

## 📊 What You Can Do (No Coding Required)

### 1️⃣ **Browse Data Like Excel**
- Click "Browse Data" tab
- Select table from dropdown
- Scroll, sort, filter data
- Click cells to see full content

### 2️⃣ **Search Memory**
- Click "Execute SQL" tab
- Paste this pre-made query:
```sql
SELECT * FROM memory_entries
WHERE value LIKE '%search term%'
LIMIT 100;
```
- Replace `search term` with what you're looking for
- Click Run button (▶️)

### 3️⃣ **View Table Structure**
- Click "Database Structure" tab
- Expand table to see columns
- Right-click table → "Modify Table" to see schema visually

### 4️⃣ **Export Data**
- Right-click table → "Export" → Choose format:
  - CSV (open in Excel/Numbers)
  - JSON (for programmers)
  - SQL (backup)

### 5️⃣ **View Statistics**
- Click "Execute SQL" tab
- Run: `SELECT COUNT(*) FROM memory_entries;`
- See how many entries you have

## 🔍 Pre-Made Queries for YOUR Databases

### Memory Database Queries

**Count total memories**:
```sql
SELECT COUNT(*) as total_memories FROM memory_entries;
```

**Recent memories**:
```sql
SELECT * FROM memory_entries
ORDER BY created_at DESC
LIMIT 20;
```

**Search memories by namespace**:
```sql
SELECT namespace, key, value, created_at
FROM memory_entries
WHERE namespace LIKE '%backend%'
ORDER BY created_at DESC;
```

**Pattern analysis**:
```sql
SELECT * FROM patterns
ORDER BY success_count DESC
LIMIT 10;
```

### ReasoningBank Queries

**Recent learning episodes**:
```sql
SELECT * FROM episodes
ORDER BY timestamp DESC
LIMIT 20;
```

**Top skills**:
```sql
SELECT * FROM top_skills
ORDER BY skill_score DESC;
```

**Memory consolidation stats**:
```sql
SELECT COUNT(*) as total_consolidations,
       SUM(memories_consolidated) as total_memories
FROM consolidation_runs;
```

**Causal relationships**:
```sql
SELECT * FROM causal_chains
LIMIT 100;
```

## 🎨 Alternative: VSCode/Cursor Extension

If you prefer staying in your IDE:

**Extension**: SQLite Viewer
**Install**: `Cmd+Shift+P` → "Extensions: Install Extensions" → Search "SQLite Viewer"

**Usage**:
1. In file explorer, click any `.db` file
2. Choose "Open With..." → "SQLite Viewer"
3. Browse tables in IDE sidebar

**Pros**: No app switching
**Cons**: Less features than DB Browser

## ⚡ Quick Command-Line Alternative

Already installed on your Mac:

```bash
# Open database in terminal
sqlite3 .swarm/memory.db

# List tables
.tables

# View first 10 rows
SELECT * FROM memory_entries LIMIT 10;

# Exit
.quit
```

## 🚫 What Official claude-flow Recommends

**Answer**: Nothing specific!

The claude-flow authors provide CLI commands but don't officially recommend GUI tools:

```bash
# These are built-in
npx claude-flow@alpha memory status
npx claude-flow@alpha memory list
npx claude-flow@alpha memory query "search"
```

**However**, these CLI commands are for developers. For non-developers like you, **DB Browser for SQLite is the industry standard**.

## 📦 Vector Embedding Visualization (Advanced)

Your ReasoningBank has vector embeddings in these tables:
- `pattern_embeddings`
- `exp_node_embeddings`
- `episode_embeddings`
- `note_embeddings`
- `skill_embeddings`

**For 2D/3D visualization**:

The embeddings are stored as BLOB (binary) data. To visualize:

1. Export embeddings to JSON using DB Browser
2. Use free online tool: **TensorFlow Embedding Projector**
   - URL: https://projector.tensorflow.org/
   - Upload your exported data
   - See clusters and relationships in 3D

**Local Alternative** (requires Python):
```bash
# Install
pip install umap-learn plotly pandas

# Create simple visualization script
python visualize_embeddings.py
```

(I can create this script for you if needed - saves to HTML you can open in browser)

## 🎯 Recommended Workflow for Non-Developers

1. **Daily browsing**: Use DB Browser for SQLite
2. **Quick checks**: Use VSCode SQLite Viewer extension
3. **Sharing data**: Export to CSV, open in Excel/Numbers
4. **Vector visualization**: Export → TensorFlow Projector (web)

## 💡 Tips for Success

**Organization**:
- Create a bookmark folder with paths to all 6 databases
- Open DB Browser with all databases in tabs
- Pin favorite queries in "SQL Log History"

**Safety**:
- DB Browser is READ-ONLY by default (safe!)
- To enable editing: Preferences → Data Browser → Uncheck "Read-only mode"
- **Leave it read-only** unless you know what you're doing

**Performance**:
- Your `.swarm/memory.db` is 75 MB - may be slow to load all rows
- Always use `LIMIT 100` in queries
- Use filters to narrow results

## 🆘 Troubleshooting

**"Database is locked"**:
- Close claude-flow CLI if running
- Close other DB Browser windows
- Restart DB Browser

**"Cannot open database"**:
- Check file permissions: `ls -la .swarm/memory.db`
- Try copying database to Desktop first

**"Table is empty"**:
- Some databases might be newly created
- Check other tables
- Run `SELECT COUNT(*)` to verify

## 📚 Next Steps

1. **Install DB Browser for SQLite** (5 minutes)
2. **Open `.swarm/memory.db`** (your biggest database)
3. **Browse `memory_entries` table** (most interesting data)
4. **Try pre-made queries** (copy/paste from this guide)
5. **Export interesting data to CSV** (analyze in Numbers/Excel)

## 🔗 Resources

- **DB Browser**: https://sqlitebrowser.org/
- **SQL Tutorial**: https://www.sqlitetutorial.net/
- **Your databases**: All in `/Users/splurfa/common-thread-sandbox/`

---

**Questions?** Just ask! I can help you write custom queries or create visualization scripts.
