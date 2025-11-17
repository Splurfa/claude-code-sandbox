# AgentDB Visualization - Quick Reference

## 🚀 Quick Start (5 Minutes)

### For Non-Developers
```bash
# 1. Download DB Browser for SQLite
# https://sqlitebrowser.org/

# 2. Open your database
File → Open Database → Select .agentdb/reasoningbank.db

# 3. Browse tables in "Browse Data" tab
```

### For Developers
```bash
# View stats
npx agentdb@latest db stats

# Search vectors
npx agentdb@latest vector-search ./.agentdb/reasoningbank.db "[0.1,0.2,0.3]" -k 10

# Export data
npx agentdb@latest export ./.agentdb/reasoningbank.db ./export.json

# Start web UI
pip install datasette && datasette ./.agentdb/reasoningbank.db --open
```

---

## 📊 Top 3 Recommended Tools

### 1. **DB Browser for SQLite** (Easiest)
- ✅ Free, no coding
- ✅ Browse all tables
- ✅ Export to CSV/JSON
- ❌ No vector visualization
- **Best for**: Non-developers exploring metadata

### 2. **TensorBoard Projector** (Best Embedding Viz)
- ✅ Beautiful 3D visualizations
- ✅ Interactive clustering
- ✅ Standalone web version
- ⚠️ Requires export + conversion
- **Best for**: Understanding embeddings

### 3. **Datasette** (Best Web UI)
- ✅ Instant web interface
- ✅ JSON API
- ✅ Plugin ecosystem
- ⚠️ No built-in vector viz
- **Best for**: Teams and sharing

---

## 🎯 Choose Your Tool

### I want to...

**Browse database tables** → DB Browser for SQLite

**Visualize embeddings in 2D/3D** → TensorBoard Projector or Nomic Atlas

**Share with my team** → Datasette

**Do custom analysis** → Python + Plotly + UMAP

**Quick CLI stats** → AgentDB CLI

**Edit embeddings** → Embedditor

---

## 🔧 Essential Commands

### AgentDB CLI
```bash
# Stats
npx agentdb@latest db stats

# Vector search
npx agentdb@latest vector-search <db> <vector> -k 10

# Export
npx agentdb@latest export <db> output.json

# Reflexion search
npx agentdb@latest reflexion retrieve "query" 10 0.8

# Skill search
npx agentdb@latest skill search "query" 5
```

### SQLite CLI
```bash
# Open database
sqlite3 ./.agentdb/reasoningbank.db

# Show tables
.tables

# Count episodes
SELECT COUNT(*) FROM episodes;

# View recent
SELECT * FROM episodes ORDER BY created_at DESC LIMIT 10;
```

### Datasette
```bash
# Install
pip install datasette datasette-vega

# Run
datasette ./.agentdb/reasoningbank.db --open
```

---

## 📁 What You Can See

| Tool | Metadata | Vectors | Charts | 3D Viz | Ease |
|------|----------|---------|--------|--------|------|
| DB Browser | ✅ | ❌ | ❌ | ❌ | ⭐⭐⭐⭐⭐ |
| Datasette | ✅ | ❌ | ✅* | ❌ | ⭐⭐⭐⭐ |
| TensorBoard | ✅ | ✅ | ❌ | ✅ | ⭐⭐⭐⭐ |
| Nomic Atlas | ✅ | ✅ | ❌ | ✅ | ⭐⭐⭐⭐⭐ |
| Plotly/Python | ✅ | ✅ | ✅ | ✅ | ⭐⭐ |

*With plugins

---

## 🐍 Python Quick Start

```python
import json
import plotly.express as px
from umap import UMAP
import pandas as pd

# Load export
with open('export.json') as f:
    data = json.load(f)

# Extract vectors
vectors = [ep['embedding'] for ep in data['episodes']]
metadata = [ep['metadata'] for ep in data['episodes']]

# Reduce to 2D
reducer = UMAP(n_components=2)
embeddings_2d = reducer.fit_transform(vectors)

# Plot
df = pd.DataFrame(embeddings_2d, columns=['x', 'y'])
df['task'] = [m.get('task', '') for m in metadata]
df['reward'] = [m.get('reward', 0) for m in metadata]

fig = px.scatter(df, x='x', y='y', color='reward', hover_data=['task'])
fig.show()
```

---

## 🌐 Links

- **Full Report**: `agentdb-tools-research.md`
- **AgentDB Docs**: https://agentdb.ruv.io
- **DB Browser**: https://sqlitebrowser.org/
- **Datasette**: https://datasette.io/
- **TensorBoard**: https://projector.tensorflow.org/
- **Nomic Atlas**: https://atlas.nomic.ai/

---

**Last Updated**: November 16, 2025
