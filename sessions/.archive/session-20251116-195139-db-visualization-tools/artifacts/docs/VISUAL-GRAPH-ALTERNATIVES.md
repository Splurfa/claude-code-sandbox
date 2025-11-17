# Visual Graph-Based Database Visualization Alternatives

**Created**: 2025-11-16  
**Purpose**: User-friendly visual alternatives to DB Browser for SQLite  
**Focus**: Graph/network visualization similar to Obsidian's graph view  
**Target**: Non-developers, visual exploration of agentDB and ReasoningBank memory

---

## 🎯 Your Requirements

✅ More visual than DB Browser (like Obsidian's graph view)  
✅ Works in Cursor IDE or local browser  
✅ User-friendly for non-coders  
✅ Installable via terminal command  
✅ Visual interface for exploring memories/learnings

---

## 🏆 Top Recommendations

### 1. **Datasette + Graph Plugins** ⭐ BEST FOR VISUAL EXPLORATION

**Why This?**
- Runs as local web server (accessible in browser)
- Beautiful, modern web interface
- Can visualize relationships as graphs
- Zero coding required to use
- Works with your existing SQLite databases

**What You Get:**
- Interactive web interface (like a modern dashboard)
- Graph visualization of table relationships
- Chart generation from queries
- Search and filter capabilities
- Export to CSV/JSON

**Installation** (2 minutes):
```bash
# Install Datasette
pip install datasette

# Install graph visualization plugins
pip install datasette-vega datasette-cluster-map datasette-plot

# Optional: Enhanced graph features
pip install datasette-graphql datasette-jellyfish
```

**Usage**:
```bash
# Start local web server
datasette .swarm/memory.db .agentdb/reasoningbank.db --open

# Opens automatically in your browser at http://127.0.0.1:8001
```

**Visual Features**:
- ✅ Table relationships shown as graph
- ✅ Interactive charts (bar, line, scatter, pie)
- ✅ Faceted search (filter by multiple columns)
- ✅ Timeline views
- ✅ Network graphs of pattern relationships

**Best For**: Visual exploration without coding, modern web interface

**Screenshots**: Visit https://datasette.io/ for examples

---

### 2. **Sqliteviz** ⭐ BEST FOR QUICK CHARTS (NO INSTALL)

**Why This?**
- Runs entirely in browser (no installation!)
- Drag-and-drop database file
- Generates charts from SQL queries
- Offline-capable PWA
- Zero configuration

**What You Get**:
- Chart generation (bar, line, scatter, pie)
- Timeline visualizations
- Pivot tables
- Export charts as PNG/SVG

**Usage** (30 seconds):
1. Visit: https://lana-k.github.io/sqliteviz/
2. Drag your `.swarm/memory.db` file onto the page
3. Write SQL query (or use examples)
4. Select chart type
5. Visualize!

**Example Queries for Your Data**:
```sql
-- Pattern relationships over time
SELECT DATE(created_at) as date, COUNT(*) as patterns
FROM patterns
GROUP BY date
ORDER BY date;

-- Memory entries by namespace
SELECT namespace, COUNT(*) as count
FROM memory_entries
GROUP BY namespace
ORDER BY count DESC;

-- Success rate over time
SELECT DATE(created_at) as date, 
       judge_label,
       COUNT(*) as count
FROM task_trajectories
WHERE judge_label IS NOT NULL
GROUP BY date, judge_label;
```

**Best For**: Quick visualizations, no installation needed, privacy-friendly (runs locally in browser)

**Limitations**: 
- No graph/network view (charts only)
- Manual query writing required

---

### 3. **Custom Graph Viewer** (Using Datasette + Cytoscape.js)

**Why This?**
- True graph visualization (like Obsidian)
- Shows pattern relationships as nodes/edges
- Interactive exploration
- Customizable layouts

**Setup** (15 minutes):
```bash
# Install Datasette
pip install datasette datasette-json-html

# Create custom visualization script
# (See implementation below)
```

**Implementation**:
Create a simple HTML file that reads from your database and visualizes relationships:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Memory Graph Visualization</title>
    <script src="https://unpkg.com/cytoscape/dist/cytoscape.min.js"></script>
    <style>
        #cy { width: 100%; height: 600px; border: 1px solid #ccc; }
        body { font-family: sans-serif; margin: 20px; }
    </style>
</head>
<body>
    <h1>AgentDB & ReasoningBank Memory Graph</h1>
    <div id="cy"></div>
    
    <script>
        // Load pattern relationships from database
        fetch('/api/pattern-graph.json')
            .then(r => r.json())
            .then(data => {
                var cy = cytoscape({
                    container: document.getElementById('cy'),
                    elements: data,
                    style: [
                        {
                            selector: 'node',
                            style: {
                                'background-color': '#666',
                                'label': 'data(label)',
                                'width': 'data(size)',
                                'height': 'data(size)'
                            }
                        },
                        {
                            selector: 'edge',
                            style: {
                                'width': 'data(weight)',
                                'line-color': '#ccc',
                                'curve-style': 'bezier'
                            }
                        }
                    ],
                    layout: { name: 'cose' }
                });
            });
    </script>
</body>
</html>
```

**Best For**: True graph visualization, custom exploration

**Note**: Requires some setup, but provides Obsidian-like graph view

---

### 4. **Adminer** (Lightweight Web Interface)

**Why This?**
- Single PHP file (super lightweight)
- Web-based interface
- Works with SQLite
- No complex setup

**Installation**:
```bash
# Download Adminer
curl -o adminer.php https://www.adminer.org/latest.php

# Start PHP server
php -S localhost:8000 adminer.php
```

**Usage**:
1. Open http://localhost:8000 in browser
2. Select "SQLite"
3. Browse to your database file
4. Explore tables visually

**Best For**: Quick web-based browsing, minimal setup

**Limitations**: Basic interface, no graph visualization

---

## 📊 Comparison Matrix

| Tool | Graph View | Ease of Use | Install Time | Visual Appeal | Best For |
|------|-----------|-------------|--------------|---------------|----------|
| **Datasette + Plugins** | ✅ Yes | ⭐⭐⭐⭐⭐ | 2 min | ⭐⭐⭐⭐⭐ | Visual exploration |
| **Sqliteviz** | ❌ Charts only | ⭐⭐⭐⭐⭐ | 0 min | ⭐⭐⭐⭐ | Quick charts |
| **Custom Graph Viewer** | ✅ Yes | ⭐⭐⭐ | 15 min | ⭐⭐⭐⭐⭐ | True graph view |
| **Adminer** | ❌ No | ⭐⭐⭐⭐ | 1 min | ⭐⭐⭐ | Basic web browsing |

---

## 🚀 Quick Start Recommendation

### For Immediate Visual Exploration:

**Option A: Datasette (Recommended)**
```bash
pip install datasette datasette-vega datasette-plot
datasette .swarm/memory.db .agentdb/reasoningbank.db --open
```
- Opens in browser automatically
- Modern, beautiful interface
- Can create charts and graphs
- No coding required

**Option B: Sqliteviz (No Install)**
1. Visit https://lana-k.github.io/sqliteviz/
2. Drag `.swarm/memory.db` onto page
3. Start visualizing!

---

## 🎨 Visual Features Comparison

### Datasette
- ✅ Table relationship graphs
- ✅ Interactive charts (bar, line, scatter)
- ✅ Faceted search with visual filters
- ✅ Timeline views
- ✅ Network visualization plugins available

### Sqliteviz
- ✅ Chart generation (bar, line, scatter, pie)
- ✅ Timeline visualizations
- ✅ Pivot tables
- ❌ No graph/network view

### Custom Graph Viewer
- ✅ True graph visualization (nodes/edges)
- ✅ Interactive exploration
- ✅ Force-directed layouts
- ✅ Pattern relationship visualization
- ⚠️ Requires setup

---

## 💡 Specific Use Cases

### Visualizing Pattern Relationships
**Best Tool**: Datasette + Custom Graph Viewer

Your `.swarm/memory.db` has a `pattern_links` table that stores relationships between patterns. This can be visualized as a graph:

```python
# Export pattern links for visualization
import sqlite3
import json

conn = sqlite3.connect('.swarm/memory.db')
cursor = conn.execute("SELECT src_id, dst_id, relation, weight FROM pattern_links")

links = []
for row in cursor:
    links.append({
        'source': row[0],
        'target': row[1],
        'relation': row[2],
        'weight': row[3]
    })

# Use with Cytoscape.js or similar
```

### Exploring Memory Entries Visually
**Best Tool**: Datasette

Datasette's faceted search lets you:
- Filter by namespace visually
- See counts for each filter
- Explore relationships between entries
- Create charts of memory usage over time

### Timeline Visualization
**Best Tool**: Sqliteviz or Datasette

Both can create timeline charts showing:
- Memory growth over time
- Pattern learning progression
- Task success rates over time

---

## 🔧 Advanced: Custom Graph Setup

If you want a true Obsidian-like graph view, here's a complete setup:

### Step 1: Install Dependencies
```bash
pip install datasette datasette-json-html
npm install -g http-server  # Optional, for serving static files
```

### Step 2: Create Graph Visualization Script
```python
#!/usr/bin/env python3
"""
Export pattern relationships for graph visualization
"""
import sqlite3
import json
from pathlib import Path

def export_pattern_graph(db_path, output_file):
    conn = sqlite3.connect(db_path)
    cursor = conn.execute("""
        SELECT src_id, dst_id, relation, weight 
        FROM pattern_links
    """)
    
    nodes = set()
    edges = []
    
    for src, dst, relation, weight in cursor:
        nodes.add(src)
        nodes.add(dst)
        edges.append({
            'source': src,
            'target': dst,
            'relation': relation,
            'weight': weight or 1
        })
    
    # Get pattern metadata
    pattern_cursor = conn.execute("""
        SELECT id, pattern_data, confidence 
        FROM patterns 
        WHERE id IN ({})
    """.format(','.join('?' * len(nodes))), list(nodes))
    
    pattern_meta = {row[0]: {'data': row[1], 'confidence': row[2]} 
                    for row in pattern_cursor}
    
    graph_data = {
        'nodes': [{'id': n, 'label': n[:20], 'data': pattern_meta.get(n, {})} 
                  for n in nodes],
        'edges': edges
    }
    
    with open(output_file, 'w') as f:
        json.dump(graph_data, f, indent=2)
    
    print(f"✅ Exported graph to {output_file}")
    print(f"   Nodes: {len(nodes)}, Edges: {len(edges)}")

if __name__ == '__main__':
    export_pattern_graph('.swarm/memory.db', 'pattern-graph.json')
```

### Step 3: Create HTML Viewer
```html
<!DOCTYPE html>
<html>
<head>
    <title>Memory Graph - Obsidian Style</title>
    <script src="https://unpkg.com/cytoscape/dist/cytoscape.min.js"></script>
    <script src="https://unpkg.com/cytoscape-cose-bilkent/cytoscape-cose-bilkent.js"></script>
    <style>
        body { margin: 0; font-family: -apple-system, sans-serif; }
        #cy { width: 100vw; height: 100vh; }
        .controls { position: absolute; top: 10px; left: 10px; background: white; padding: 10px; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="controls">
        <button onclick="layout('cose')">Force-Directed</button>
        <button onclick="layout('circle')">Circle</button>
        <button onclick="layout('grid')">Grid</button>
    </div>
    <div id="cy"></div>
    
    <script>
        fetch('pattern-graph.json')
            .then(r => r.json())
            .then(data => {
                const elements = [
                    ...data.nodes.map(n => ({
                        data: { id: n.id, label: n.label, ...n.data }
                    })),
                    ...data.edges.map(e => ({
                        data: {
                            id: `${e.source}-${e.target}`,
                            source: e.source,
                            target: e.target,
                            label: e.relation,
                            weight: e.weight
                        }
                    }))
                ];
                
                const cy = cytoscape({
                    container: document.getElementById('cy'),
                    elements: elements,
                    style: [
                        {
                            selector: 'node',
                            style: {
                                'background-color': '#666',
                                'label': 'data(label)',
                                'width': 30,
                                'height': 30,
                                'font-size': '12px'
                            }
                        },
                        {
                            selector: 'edge',
                            style: {
                                'width': 2,
                                'line-color': '#ccc',
                                'curve-style': 'bezier',
                                'label': 'data(label)'
                            }
                        }
                    ],
                    layout: { name: 'cose' }
                });
                
                window.layout = (name) => {
                    cy.layout({ name }).run();
                };
            });
    </script>
</body>
</html>
```

### Step 4: Run
```bash
# Export graph data
python export_pattern_graph.py

# Serve HTML file
python -m http.server 8000

# Open http://localhost:8000/graph.html in browser
```

---

## 📝 Summary & Final Recommendation

### For Your Use Case (Visual, Non-Coder Friendly):

**🥇 Best Choice: Datasette**
- Modern web interface
- Graph visualization capabilities
- Easy installation
- No coding required to use
- Works with your existing databases

**Installation**:
```bash
pip install datasette datasette-vega datasette-plot
datasette .swarm/memory.db .agentdb/reasoningbank.db --open
```

**🥈 Quick Alternative: Sqliteviz**
- No installation needed
- Browser-based
- Quick charts
- Privacy-friendly

**🥉 Advanced: Custom Graph Viewer**
- True Obsidian-like graph view
- Requires setup
- Most visual option

---

## 🔗 Resources

- **Datasette**: https://datasette.io/
- **Sqliteviz**: https://lana-k.github.io/sqliteviz/
- **Cytoscape.js**: https://js.cytoscape.org/
- **Adminer**: https://www.adminer.org/

---

**Next Steps**:
1. Try Datasette first (easiest, most visual)
2. If you need true graph view, set up custom viewer
3. Use Sqliteviz for quick charts

**Questions?** Ask for help setting up any of these tools!

