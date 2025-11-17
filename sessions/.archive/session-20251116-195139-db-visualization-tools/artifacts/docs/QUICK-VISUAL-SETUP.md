# Quick Visual Database Viewer Setup

**For**: Visual exploration of agentDB and ReasoningBank memory  
**Alternative to**: DB Browser for SQLite (more visual, user-friendly)

---

## ⚡ Quick Start (2 minutes)

### Option 1: Automated Setup (Easiest)

```bash
# Run the setup script
./sessions/session-20251116-195139-db-visualization-tools/artifacts/scripts/setup-visual-db-viewer.sh
```

This will:
- Install Datasette and visualization plugins
- Start a local web server
- Open your browser automatically
- Show all your databases in a beautiful web interface

### Option 2: Manual Setup

```bash
# Install
pip3 install --user datasette datasette-vega datasette-plot

# Run (from workspace root)
datasette .swarm/memory.db .agentdb/reasoningbank.db --open
```

---

## 🎨 What You Get

- **Modern web interface** (like a dashboard)
- **Graph visualization** of table relationships
- **Interactive charts** (bar, line, scatter, pie)
- **Visual search and filtering**
- **Timeline views** of your data
- **Export to CSV/JSON**

---

## 🌐 Access

Once running, open in browser:
- **URL**: http://127.0.0.1:8001
- Opens automatically when you use `--open` flag

---

## 📊 Example Visualizations

### View Pattern Relationships
1. Click on `.swarm/memory.db`
2. Click on `pattern_links` table
3. See relationships visualized

### Create Charts
1. Go to "Execute SQL" tab
2. Run query:
   ```sql
   SELECT namespace, COUNT(*) as count 
   FROM memory_entries 
   GROUP BY namespace 
   ORDER BY count DESC
   ```
3. Click "Visualize" → Select chart type

### Timeline View
1. Query with dates:
   ```sql
   SELECT DATE(created_at) as date, COUNT(*) as entries
   FROM memory_entries
   GROUP BY date
   ORDER BY date
   ```
2. Visualize as line chart

---

## 🆚 Comparison: Datasette vs DB Browser

| Feature | DB Browser | Datasette |
|---------|-----------|-----------|
| **Interface** | Desktop app | Web browser |
| **Visual Appeal** | Dated | Modern |
| **Graph View** | ❌ No | ✅ Yes |
| **Charts** | Basic | Interactive |
| **Ease of Use** | Good | Excellent |
| **Installation** | App install | Terminal command |

---

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Use different port
datasette .swarm/memory.db --port 8002 --open
```

### Python Not Found
```bash
# Install Python 3
brew install python3
```

### Permission Denied
```bash
# Use --user flag (already in script)
pip3 install --user datasette
```

---

## 📚 More Options

See [VISUAL-GRAPH-ALTERNATIVES.md](VISUAL-GRAPH-ALTERNATIVES.md) for:
- Sqliteviz (no installation, browser-based)
- Custom graph viewer (Obsidian-like)
- Other alternatives

---

## 💡 Tips

1. **Bookmark** http://127.0.0.1:8001 for quick access
2. **Use faceted search** to filter data visually
3. **Export queries** as CSV for Excel/Numbers
4. **Create saved queries** for common explorations

---

**Ready to explore your AI memory visually!** 🚀

