# Your Datasette Dashboard - Quick Start Guide

**For**: Derek (non-developer, visual exploration)
**Setup**: Complete! ✅
**Access**: http://localhost:8001

---

## 🎉 It's Running!

Datasette is now running with your databases. Your browser should have opened automatically to:
**http://localhost:8001**

If not, just click that link or paste it in your browser.

---

## 🎯 What You'll See

### Homepage
When you open Datasette, you see:

**3 Databases Listed:**
1. **memory** - Your main memory (45,563+ entries)
2. **reasoningbank** - Learning data (33 tables)
3. **hive** - Agent coordination

**Click any database** → See all its tables

---

## ⚡ Pre-Made Insights (Just Click!)

I've created **13 one-click insights** for you. No SQL required!

### Memory Insights

**📊 Memory Distribution by Namespace**
- Shows bar chart of which categories have most memories
- **Click to see**: agent-assignments, hooks, coordination, etc.

**⚡ Recent Activity (Last 24 Hours)**
- What's happened in the last day
- **See**: New memories, agent actions, hook executions

**📈 Memory Growth Over Time**
- Timeline chart of memory accumulation
- **Visualize**: Growth trends, busy periods

**🤖 Agent Activity Summary**
- All agent-related memories
- **Explore**: Agent assignments, coordination

**🔗 Hook Execution Patterns**
- Which hooks fire most often
- **Discover**: pre-task, post-edit, etc.

### Pattern Insights

**✅ Pattern Success Rates**
- Which patterns work best (% success)
- **Ranked by**: Success rate and usage

**🏆 Most Used Patterns**
- Patterns used most frequently
- **See**: What your system relies on

### Task Insights

**📊 Task Success vs Failure**
- Pie chart of task outcomes
- **Visual breakdown**: Success, failure, partial

**🎯 Recent Task Activity**
- Latest task executions
- **Timeline**: What agents have been doing

### Learning Insights

**🧠 Learning Progress**
- Episodes over time (timeline)
- **See**: Learning velocity

**⭐ Top Acquired Skills**
- Skills ranked by score
- **Discover**: What your AI has mastered

**🔍 Causal Relationships Discovered**
- Cause-effect patterns
- **Explore**: What leads to what

---

## 🖱️ How to Use (Point & Click)

### Step 1: Pick an Insight

On the homepage, scroll down to **"Queries"** section.

**Click any query name**, like:
- "📊 Memory Distribution by Namespace"

### Step 2: See Results Visually

Results appear as a **table** by default.

**To visualize**:
1. Look for **"Visualize"** button/link near results
2. Click it
3. Choose chart type: **Bar**, **Line**, **Pie**, **Scatter**

### Step 3: Explore Deeper

**Click any row** → See full details

**Filter results**:
- Use checkboxes on the left (facets)
- Click column headers to sort
- Search box at top

### Step 4: Export (Optional)

**Want data in Excel?**
1. Click **"CSV"** link near results
2. Opens in Excel/Numbers

---

## 📊 Exploring Tables Directly

### Option 1: Browse a Table

1. Click database name (e.g., "memory")
2. Click table name (e.g., "memory_entries")
3. See spreadsheet view
4. Use filters on left sidebar

### Option 2: Faceted Search (Visual Filtering)

**On any table page:**

**Left sidebar shows facets:**
- Checkboxes for categories
- Click to filter visually
- See counts update in real-time

**Example**: On `memory_entries` table:
1. Facet by "namespace"
2. Click "agents" ☑️
3. See only agent-related memories

---

## 🎨 Visualizing Data

### Create Charts from Any Query

**Method 1: Use Pre-Made Insights**
- Just click and visualize (easiest!)

**Method 2: Run Custom Query** (Still no coding!)
1. Click database name
2. Click "Run SQL query" tab (top)
3. **Paste one of these** (copy-paste, don't write!):

**Memory by namespace (bar chart):**
```sql
SELECT namespace, COUNT(*) as count
FROM memory_entries
GROUP BY namespace
ORDER BY count DESC
LIMIT 20
```

**Memory over time (timeline):**
```sql
SELECT DATE(created_at) as date, COUNT(*) as entries
FROM memory_entries
GROUP BY DATE(created_at)
ORDER BY date DESC
LIMIT 30
```

**Pattern success rates (ranked list):**
```sql
SELECT pattern_type, success_count, failure_count
FROM patterns
ORDER BY success_count DESC
LIMIT 15
```

4. Click **"Run SQL"** button
5. Click **"Visualize"** → Choose chart type

---

## 🔍 Finding Specific Things

### Search Memories

**On `memory_entries` table:**

1. Use **filter boxes** under column headers
2. Example: Under "key" column, type: `agent`
3. See all memories with "agent" in the key

### Timeline Exploration

1. Run "Memory Growth Over Time" query
2. Visualize as **line chart**
3. See when memory activity spiked
4. Click points → See what happened that day

### Pattern Relationships

1. Go to `pattern_links` table
2. See which patterns connect
3. Filter by pattern ID
4. Explore relationships

---

## 💾 Saving Favorites

### Bookmark Queries

**Browser bookmark** these URLs:

- **Homepage**: http://localhost:8001
- **Memory Distribution**: http://localhost:8001/memory?query=memory_by_namespace
- **Recent Activity**: http://localhost:8001/memory?query=recent_activity
- **Pattern Success**: http://localhost:8001/memory?query=pattern_success_rates

### Export Regular Reports

1. Run your favorite query
2. Click "CSV" link
3. Save to Desktop
4. Open in Excel/Numbers
5. Repeat weekly/monthly

---

## 🛠️ Common Tasks

### "Show me what's new today"

1. Click **"⚡ Recent Activity (Last 24 Hours)"**
2. See everything that happened
3. Filter by namespace if needed

### "Which patterns work best?"

1. Click **"✅ Pattern Success Rates"**
2. See ranked list with percentages
3. Click top patterns → Explore details

### "What are my agents doing?"

1. Click **"🤖 Agent Activity Summary"**
2. See breakdown by category
3. Click counts → Drill into details

### "How is learning progressing?"

1. Click **"🧠 Learning Progress"**
2. See timeline of episodes
3. Visualize as line chart
4. Spot trends

### "Export all memories to Excel"

1. Go to `memory_entries` table
2. Click "CSV" (exports visible rows)
3. For all rows: Remove any filters first
4. Open CSV in Excel/Numbers

---

## 🎯 Tips for Visual Exploration

### Use Facets (Left Sidebar)
- **Don't search** → Use checkboxes!
- Click multiple facets → Combine filters
- See counts update → Understand data distribution

### Sort by Clicking Columns
- Click column header → Sort ascending
- Click again → Sort descending
- See patterns emerge

### Follow the Breadcrumbs
- Top of page shows: Database > Table > Filters
- Click any breadcrumb → Go back
- Never get lost

### Visualize Everything
- Any table → Can become a chart
- Any query → Can visualize
- Try different chart types → Find what works

---

## 🚀 Advanced (But Still Easy)

### Combine Filters

**Example**: "Show me agent memories from last week"

1. Go to `memory_entries` table
2. **Facet**: Click "agent-assignments" under namespace
3. **Filter date**: Use filter box under `created_at`
4. Type: `>= 2025-11-09` (7 days ago)
5. See results!

### Create Saved Views

**Favorite a query:**
1. Run query
2. Copy URL from browser
3. Save as browser bookmark
4. Name it clearly
5. One-click access forever

### Export for Presentations

1. Run insightful query
2. Visualize as chart
3. **Screenshot** the chart (Cmd+Shift+4 on Mac)
4. Paste in presentation
5. Done!

---

## ⚙️ Starting/Stopping Datasette

### To Stop Datasette

**In terminal** (where it's running):
- Press `Ctrl+C`

Or:
```bash
# Find and kill process
pkill -f datasette
```

### To Start Again

```bash
# From workspace root
./sessions/session-20251116-195139-db-visualization-tools/artifacts/scripts/start-datasette.sh
```

Or manually:
```bash
cd /Users/splurfa/common-thread-sandbox
datasette .swarm/memory.db .agentdb/reasoningbank.db .hive-mind/hive.db \
  --metadata sessions/session-20251116-195139-db-visualization-tools/artifacts/code/metadata.yml \
  --port 8001 --open
```

### Auto-Start on Login (Optional)

Create LaunchAgent if you want it always running:
```bash
# I can set this up if you want - just ask!
```

---

## 🆘 Troubleshooting

### "Port already in use"

**Someone else using port 8001:**
```bash
# Use different port
datasette .swarm/memory.db --port 8002 --open
```

### "Can't open browser automatically"

**Manually open**:
- Visit: http://localhost:8001

### "Database is locked"

**Close claude-flow CLI** if running:
```bash
# Stop any claude-flow commands
# Then restart Datasette
```

### "I see no data"

**Check database path**:
```bash
ls -la .swarm/memory.db
ls -la .agentdb/reasoningbank.db
```

If files exist, reload page in browser.

---

## 📚 What's Configured For You

### 13 Pre-Made Insights
All one-click, no SQL needed:
1. Memory Distribution
2. Recent Activity
3. Memory Growth
4. Agent Activity
5. Hook Patterns
6. Pattern Success Rates
7. Most Used Patterns
8. Task Outcomes
9. Recent Tasks
10. Learning Progress
11. Top Skills
12. Causal Relationships
13. And more!

### Auto-Visualization
- All queries can visualize
- Click "Visualize" → Choose chart
- Bar, line, pie, scatter supported

### Faceted Search
- Visual filtering (checkboxes)
- No query writing needed
- See counts in real-time

### Export Options
- CSV for Excel
- JSON for developers
- Copy-paste results

---

## 🎉 You're All Set!

**Your Dashboard**: http://localhost:8001

**Quick Wins**:
1. Click "📊 Memory Distribution" → See bar chart
2. Click "⚡ Recent Activity" → See latest
3. Click "✅ Pattern Success" → See what works
4. Explore any table → Visual filtering
5. Export anything → CSV for Excel

**No SQL. No coding. Just visual exploration!** 🚀

---

## 💡 Remember

- **Click, don't code** - Everything is visual
- **Use pre-made insights** - They surface what's interesting
- **Facets are your friend** - Checkboxes > Search boxes
- **Visualize everything** - Charts reveal patterns
- **Bookmark favorites** - One-click access

**Enjoy exploring your AI's memory!** 🧠✨
