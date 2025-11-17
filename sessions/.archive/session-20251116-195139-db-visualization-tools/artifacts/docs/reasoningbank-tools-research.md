# ReasoningBank Data Visualization Tools Research

**Date**: 2025-11-16
**Session**: session-20251116-195139-db-visualization-tools
**Research Focus**: Visualization approaches for ReasoningBank adaptive learning system

---

## Executive Summary

ReasoningBank is an adaptive learning system that stores reasoning trajectories, verdicts, and pattern recognition data in SQLite databases. Based on analysis of the current implementation and extensive tool research, this document outlines visualization approaches categorized by:

1. **Database-level tools** (viewing raw SQLite data)
2. **Trajectory visualization** (reasoning paths and decision trees)
3. **Graph/network tools** (pattern relationships)
4. **Specialized RL/episodic memory tools** (adaptive learning patterns)
5. **Custom integration options** (built on existing tools)

---

## ReasoningBank Data Structure Overview

### Current Implementation

ReasoningBank stores data in `.swarm/memory.db` (SQLite) with the following schema:

**Core Tables**:
- `task_trajectories` - Agent execution paths with state→action→outcome sequences
- `patterns` - Learned patterns with confidence scores
- `pattern_embeddings` - Vector embeddings for semantic search (BLOB format)
- `pattern_links` - Relationships between patterns (graph edges)
- `memory_entries` - Agent memory with namespaces and TTL
- `matts_runs` - Meta-cognitive analysis runs
- `consolidation_runs` - Memory optimization history

**Key Data Types**:
- **Trajectories**: JSON-encoded state-action-outcome sequences
- **Verdicts**: Labeled as success/failure/partial with confidence scores
- **Patterns**: Distilled knowledge with usage counts and confidence
- **Embeddings**: 1536-dimensional vectors (BLOB format)
- **Metrics**: Performance tracking over time

### Integration with AgentDB

Optional backend using AgentDB (`.agentdb/reasoningbank.db`) provides:
- 150x faster vector search
- HNSW indexing for embeddings
- Reinforcement learning episode storage
- Causal graph tracking

---

## Category 1: SQLite Database Browsers

### 1.1 DB Browser for SQLite (DB4S)

**Type**: Free, Open-Source GUI
**Platform**: Windows, macOS, Linux
**Website**: https://sqlitebrowser.org/

**What it Visualizes**:
- ✅ All ReasoningBank tables (trajectories, patterns, embeddings)
- ✅ Raw JSON data in readable format
- ✅ Basic SQL queries for filtering/analysis
- ✅ Schema relationships and foreign keys
- ⚠️ Limited BLOB visualization (embeddings shown as hex)

**Setup Complexity**: ⭐ Very Low (1/5)
- Download and install application
- File → Open Database → Select `.swarm/memory.db`
- No configuration required

**Coding Required**: ❌ No - 100% GUI-based

**Best For**:
- Quick inspection of trajectory data
- Validating that data is being stored correctly
- Running SQL queries to analyze patterns
- Exporting data to CSV/JSON

**Limitations**:
- No visualization of embedding vectors
- No graph/network visualization
- No trajectory path highlighting
- JSON shown as text (not interactive)

---

### 1.2 SQLiteStudio

**Type**: Free, Open-Source GUI
**Platform**: Windows, macOS, Linux
**Website**: https://sqlitestudio.pl/

**What it Visualizes**:
- ✅ All database tables with advanced filtering
- ✅ JSON/BLOB custom data type handlers
- ✅ Form-based data editing
- ✅ SQL query execution with syntax highlighting
- ✅ Schema diagrams (ERD generation)

**Setup Complexity**: ⭐ Very Low (1/5)
- Portable application (no installation)
- Open database file directly
- Auto-detects schema

**Coding Required**: ❌ No - GUI-based with optional scripting

**Best For**:
- Developers who want schema visualization
- Complex multi-table queries
- Data migration/import-export
- Custom data formatting

**Advantages over DB4S**:
- Better JSON viewer (pretty-print with folding)
- Schema diagram generation
- Python/Tcl scripting support
- Custom data type plugins

---

### 1.3 DBeaver Community Edition

**Type**: Free, Open-Source Database IDE
**Platform**: Windows, macOS, Linux
**Website**: https://dbeaver.io/

**What it Visualizes**:
- ✅ Advanced SQL editor with IntelliSense
- ✅ ER diagrams (entity-relationship visualization)
- ✅ Data transfer and synchronization
- ✅ Visual query builder
- ✅ SQL execution plans

**Setup Complexity**: ⭐⭐ Low (2/5)
- Install application
- Create new connection → SQLite
- Point to database file
- Configure drivers (auto-download)

**Coding Required**: ❌ No - GUI-based IDE

**Best For**:
- Professional database analysis
- Complex queries with visual builder
- Understanding table relationships
- Comparing multiple ReasoningBank instances

**Advanced Features**:
- Git integration for schema versioning
- Data comparison tools
- SQL formatter and linter
- Mock data generation

---

### 1.4 Beekeeper Studio

**Type**: Free & Commercial GUI
**Platform**: Windows, macOS, Linux
**Website**: https://www.beekeeperstudio.io/

**What it Visualizes**:
- ✅ Sleek spreadsheet-like data browser
- ✅ SQL query tabs with auto-complete
- ✅ Query history and saved queries
- ✅ Dark mode UI (developer-friendly)

**Setup Complexity**: ⭐ Very Low (1/5)
- Modern Electron-based app
- Drag-and-drop database file
- No configuration needed

**Coding Required**: ❌ No - GUI-based

**Best For**:
- Developers who want a modern, clean UI
- Quick data exploration
- Sharing queries with team

**Why Choose This**:
- Most modern UI of all options
- Cross-platform consistency
- Active development community

---

### 1.5 Sqliteviz (Browser-based)

**Type**: Free, Open-Source PWA
**Platform**: Web browser (offline-capable)
**Website**: https://github.com/lana-k/sqliteviz

**What it Visualizes**:
- ✅ SQL query results as charts/graphs
- ✅ CSV/JSON export
- ✅ Fully client-side (no server upload)
- ✅ Pivot tables and aggregations
- ✅ Timeline visualizations

**Setup Complexity**: ⭐ Very Low (1/5)
- Open https://lana-k.github.io/sqliteviz/
- Drag-and-drop `.swarm/memory.db`
- Runs entirely in browser (offline after first load)

**Coding Required**: ❌ No - Interactive UI

**Best For**:
- Creating charts from trajectory metrics
- Analyzing confidence score distributions
- Timeline views of learning progress
- Sharing visualizations (export as PNG/SVG)

**Unique Advantages**:
- No installation required
- Generate visualizations from SQL queries
- Export charts for presentations
- Offline-first PWA (privacy-friendly)

**Example Use Cases**:
```sql
-- Visualize verdict distribution over time
SELECT DATE(created_at) as date,
       judge_label,
       COUNT(*) as count
FROM task_trajectories
WHERE judge_label IS NOT NULL
GROUP BY date, judge_label
ORDER BY date;
```
Then select "Line Chart" to see learning trends.

---

## Category 2: Trajectory & Decision Tree Visualization

### 2.1 dtreeviz (Python Library)

**Type**: Open-Source Python Library
**Platform**: Python 3.7+
**GitHub**: https://github.com/parrt/dtreeviz

**What it Visualizes**:
- ✅ Decision tree paths (state→action sequences)
- ✅ Feature importance in reasoning
- ✅ Prediction paths with highlighting
- ✅ Interactive HTML exports
- ⚠️ Requires training sklearn/XGBoost models

**Setup Complexity**: ⭐⭐⭐ Medium (3/5)
```bash
pip install dtreeviz
```
Then create visualization script:
```python
from dtreeviz.trees import dtreeviz
import sqlite3
import json

# Load ReasoningBank trajectory
conn = sqlite3.connect('.swarm/memory.db')
cursor = conn.execute("""
    SELECT trajectory_json FROM task_trajectories
    WHERE task_id = ?
""", ('task-123',))
trajectory = json.loads(cursor.fetchone()[0])

# Convert to decision tree format (requires custom adapter)
# ... (see implementation notes below)
```

**Coding Required**: ✅ Yes - Python scripting

**Best For**:
- Visualizing why a specific trajectory succeeded/failed
- Debugging reasoning paths
- Understanding feature importance
- Creating publication-quality diagrams

**Integration Strategy**:
1. Extract trajectories from ReasoningBank
2. Convert state→action→outcome to tree format
3. Generate visualization with path highlighting
4. Export to SVG/PNG for analysis

**Limitations**:
- Not real-time (batch processing)
- Requires ML model training
- Custom adapter needed for ReasoningBank data

---

### 2.2 Visual Paradigm (Decision Tree Tool)

**Type**: Commercial Diagramming Tool
**Platform**: Windows, macOS, Linux, Web
**Website**: https://www.visual-paradigm.com/

**What it Visualizes**:
- ✅ Manual decision tree creation
- ✅ Drag-and-drop node editing
- ✅ Export to PNG/SVG/PDF
- ⚠️ No automatic generation from data

**Setup Complexity**: ⭐⭐ Low (2/5)
- Install application or use web version
- Create new decision tree diagram
- Manually map trajectories to visual tree

**Coding Required**: ❌ No - GUI diagramming tool

**Best For**:
- Creating presentation-ready diagrams
- Manually documenting key reasoning patterns
- Explaining ReasoningBank decisions to stakeholders

**Use Case**:
Export successful trajectories from ReasoningBank, then manually create decision tree diagrams to explain the reasoning process.

**Not Suitable For**:
- Large-scale trajectory visualization (100+ paths)
- Real-time updates
- Automated analysis

---

### 2.3 Lucidchart (Online Diagramming)

**Type**: Commercial Cloud-based Tool
**Platform**: Web browser
**Website**: https://www.lucidchart.com/

**What it Visualizes**:
- ✅ Flowcharts and decision trees
- ✅ Collaborative editing
- ✅ Templates for decision processes
- ⚠️ Manual creation only

**Setup Complexity**: ⭐ Very Low (1/5)
- Create account
- Use decision tree template
- Drag-and-drop editing

**Coding Required**: ❌ No - Visual editor

**Best For**:
- Team collaboration on reasoning documentation
- Presenting ReasoningBank insights to non-technical audiences
- Creating educational materials

**Advantages**:
- Real-time collaboration
- Integration with Google Workspace, Confluence, etc.
- Professional templates

---

## Category 3: Graph & Network Visualization

### 3.1 Cytoscape.js

**Type**: Open-Source JavaScript Library
**Platform**: Web browsers
**Website**: https://js.cytoscape.org/

**What it Visualizes**:
- ✅ Pattern relationships (`pattern_links` table)
- ✅ Causal graphs (AgentDB integration)
- ✅ Interactive node/edge exploration
- ✅ Layout algorithms (hierarchical, force-directed, circular)
- ✅ JSON-based data input

**Setup Complexity**: ⭐⭐⭐ Medium (3/5)
```bash
npm install cytoscape
```
Then create HTML visualization:
```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://unpkg.com/cytoscape/dist/cytoscape.min.js"></script>
  <style>
    #cy { width: 100%; height: 600px; border: 1px solid #ccc; }
  </style>
</head>
<body>
  <div id="cy"></div>
  <script>
    // Load pattern_links from ReasoningBank
    fetch('/api/pattern-graph')
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
                'label': 'data(label)'
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

**Coding Required**: ✅ Yes - JavaScript/HTML

**Best For**:
- Visualizing pattern relationships
- Exploring causal connections between reasoning steps
- Interactive web-based dashboards
- Large-scale graph visualization (1000+ nodes)

**ReasoningBank Integration**:
```javascript
// Export pattern_links to Cytoscape format
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('.swarm/memory.db');

db.all(`
  SELECT src_id, dst_id, relation, weight
  FROM pattern_links
`, (err, rows) => {
  const elements = {
    nodes: [],
    edges: rows.map(r => ({
      data: {
        id: `${r.src_id}-${r.dst_id}`,
        source: r.src_id,
        target: r.dst_id,
        weight: r.weight,
        label: r.relation
      }
    }))
  };
  // Add unique nodes
  const nodeIds = new Set();
  rows.forEach(r => {
    nodeIds.add(r.src_id);
    nodeIds.add(r.dst_id);
  });
  nodeIds.forEach(id => {
    elements.nodes.push({ data: { id, label: id.substr(0, 8) } });
  });
  console.log(JSON.stringify(elements, null, 2));
});
```

**Performance**: Handles 10,000+ nodes efficiently with WebGL renderer.

---

### 3.2 D3.js (Data-Driven Documents)

**Type**: Open-Source JavaScript Library
**Platform**: Web browsers
**Website**: https://d3js.org/

**What it Visualizes**:
- ✅ Custom graph layouts (force-directed, tree, sankey)
- ✅ Hierarchical data (pattern hierarchies)
- ✅ Time-series (learning progress over time)
- ✅ Interactive animations and transitions

**Setup Complexity**: ⭐⭐⭐⭐ High (4/5)
- Steep learning curve
- Requires HTML/CSS/JavaScript knowledge
- Powerful but verbose

**Coding Required**: ✅ Yes - Extensive JavaScript

**Best For**:
- Custom visualizations not available in other tools
- Publication-quality interactive graphics
- Complex multi-dimensional data
- Data journalism and research papers

**Example Use Case**:
Force-directed graph showing how patterns cluster by domain:
```javascript
const svg = d3.select("svg");
const simulation = d3.forceSimulation(nodes)
  .force("link", d3.forceLink(links).id(d => d.id))
  .force("charge", d3.forceManyBody())
  .force("center", d3.forceCenter(width / 2, height / 2));
```

**When to Choose**:
- You need full control over visualization design
- Building a custom ReasoningBank dashboard
- Publishing research with interactive figures

**When to Avoid**:
- Quick exploration (too much setup)
- No JavaScript expertise
- Prefer pre-built tools

---

### 3.3 Graphviz (DOT Language)

**Type**: Open-Source Graph Layout Engine
**Platform**: Windows, macOS, Linux
**Website**: https://graphviz.org/

**What it Visualizes**:
- ✅ Hierarchical graphs (organizational charts, trees)
- ✅ Static graph layouts (PNG, SVG, PDF)
- ✅ Automated positioning (no manual layout)
- ✅ Text-based graph definitions

**Setup Complexity**: ⭐⭐ Low (2/5)
```bash
# macOS
brew install graphviz

# Linux
sudo apt-get install graphviz

# Windows
# Download from https://graphviz.org/download/
```

**Coding Required**: ⚠️ Minimal - DOT language (simple syntax)

**Best For**:
- Generating static diagrams from ReasoningBank data
- Automated documentation
- CI/CD pipeline visualization
- Command-line workflows

**ReasoningBank Example**:
```bash
# Export pattern graph to DOT format
sqlite3 .swarm/memory.db <<EOF | dot -Tpng -o pattern-graph.png
SELECT 'digraph G {'
UNION ALL
SELECT '  "' || src_id || '" -> "' || dst_id || '" [label="' || relation || '"];'
FROM pattern_links
UNION ALL
SELECT '}';
EOF
```

**Output**: PNG image of pattern relationships.

**Advantages**:
- No programming required (just DOT syntax)
- Scriptable (works in shell scripts)
- Professional layouts (automatic)

**Limitations**:
- Static images only (no interactivity)
- Limited styling options
- Not suitable for large graphs (>500 nodes)

---

### 3.4 JSON Crack (Online JSON Visualizer)

**Type**: Free, Open-Source Web Tool
**Platform**: Web browser (offline PWA)
**Website**: https://jsoncrack.com/

**What it Visualizes**:
- ✅ JSON data as interactive graphs
- ✅ Tree view with expand/collapse
- ✅ Search and filter within JSON
- ✅ Export to image

**Setup Complexity**: ⭐ Very Low (1/5)
- Visit website
- Paste JSON trajectory data
- Automatic graph generation

**Coding Required**: ❌ No - Paste JSON and visualize

**Best For**:
- Quick inspection of trajectory JSON
- Sharing trajectory data with non-technical users
- Debugging complex nested structures

**ReasoningBank Use Case**:
```sql
-- Export a trajectory as JSON
SELECT trajectory_json FROM task_trajectories
WHERE task_id = 'task-123';
```
Copy output → Paste into JSON Crack → Visualize structure.

**Limitations**:
- Manual process (one trajectory at a time)
- No batch processing
- No database connection

---

## Category 4: Reinforcement Learning & Episodic Memory Tools

### 4.1 RL Baselines3 Zoo (Trajectory Logs)

**Type**: Open-Source RL Framework
**Platform**: Python
**GitHub**: https://github.com/DLR-RM/rl-baselines3-zoo

**What it Visualizes**:
- ✅ Episode trajectories with TensorBoard
- ✅ Reward curves over time
- ✅ Action distributions
- ⚠️ Requires RL agent integration

**Setup Complexity**: ⭐⭐⭐⭐ High (4/5)
```bash
pip install stable-baselines3[extra]
pip install rl-baselines3-zoo
```

**Coding Required**: ✅ Yes - Python RL integration

**Best For**:
- If you're already using RL algorithms
- Comparing trajectory quality across agents
- Analyzing action selection patterns

**Integration Path**:
1. Adapt ReasoningBank trajectories to RL episode format
2. Log episodes to TensorBoard
3. Visualize reward trends, action distributions

**Not Recommended If**:
- You're not using reinforcement learning
- No ML background
- Just want to inspect data (overkill)

---

### 4.2 Understanding RL Vision (Research Tool)

**Type**: Research Project / Interactive Article
**Platform**: Web browser
**Website**: https://distill.pub/2020/understanding-rl-vision/

**What it Visualizes**:
- ✅ Attention maps in RL agents
- ✅ Trajectory replays with explanations
- ✅ Interactive visualizations
- ⚠️ Research prototype, not production tool

**Setup Complexity**: N/A - Online article with embedded visualizations

**Coding Required**: ⚠️ Only if adapting their code

**Best For**:
- Understanding RL visualization concepts
- Inspiration for custom tools
- Research presentations

**Value**:
- Educational resource for trajectory visualization techniques
- Example code available on GitHub
- Best practices for explainability

---

### 4.3 TensorBoard (Google)

**Type**: Open-Source Visualization Toolkit
**Platform**: Python, TensorFlow/PyTorch
**Website**: https://www.tensorflow.org/tensorboard

**What it Visualizes**:
- ✅ Time-series metrics (confidence scores over time)
- ✅ Scalar comparisons (success vs failure rates)
- ✅ Embedding projector (visualize pattern embeddings in 3D)
- ✅ Text/image logs

**Setup Complexity**: ⭐⭐⭐ Medium (3/5)
```bash
pip install tensorboard
```

**Coding Required**: ✅ Yes - Python logging scripts

**Best For**:
- Visualizing learning trends over time
- Comparing multiple ReasoningBank runs
- Projecting embeddings to 2D/3D space (t-SNE, UMAP)

**ReasoningBank Integration**:
```python
from torch.utils.tensorboard import SummaryWriter
import sqlite3
import json

writer = SummaryWriter('runs/reasoningbank')
db = sqlite3.connect('.swarm/memory.db')

# Log confidence scores over time
cursor = db.execute("""
    SELECT created_at, judge_conf, judge_label
    FROM task_trajectories
    WHERE judge_label IS NOT NULL
    ORDER BY created_at
""")

step = 0
for created_at, conf, label in cursor:
    writer.add_scalar(f'confidence/{label}', conf, step)
    step += 1

writer.close()
```

Then run:
```bash
tensorboard --logdir=runs/reasoningbank
# Open http://localhost:6006
```

**Advanced Feature: Embedding Projector**
```python
# Export pattern embeddings for visualization
cursor = db.execute("SELECT id, vector FROM pattern_embeddings")
embeddings = []
labels = []
for id, vector in cursor:
    # Convert BLOB to numpy array
    import numpy as np
    vec = np.frombuffer(vector, dtype=np.float32)
    embeddings.append(vec)
    labels.append(id[:8])

embeddings = np.array(embeddings)
writer.add_embedding(embeddings, metadata=labels)
```

View in TensorBoard Embedding Projector (t-SNE or UMAP 3D visualization).

---

## Category 5: Custom Integration Options

### 5.1 Jupyter Notebooks + Plotly

**Type**: Interactive Python Notebooks
**Platform**: Python, Jupyter
**Setup Complexity**: ⭐⭐⭐ Medium (3/5)

**What it Visualizes**:
- ✅ Custom interactive charts (Plotly, Altair, Bokeh)
- ✅ SQL queries with inline results
- ✅ Trajectory analysis with pandas
- ✅ Shareable notebooks (.ipynb files)

**Example Notebook**:
```python
import sqlite3
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go

# Connect to ReasoningBank
conn = sqlite3.connect('.swarm/memory.db')

# Load trajectories
df = pd.read_sql_query("""
    SELECT
        DATE(created_at) as date,
        judge_label,
        judge_conf,
        agent_id
    FROM task_trajectories
    WHERE judge_label IS NOT NULL
""", conn)

# Visualize verdict distribution over time
fig = px.histogram(df, x='date', color='judge_label',
                   title='ReasoningBank Verdicts Over Time')
fig.show()

# Confidence score distribution
fig2 = px.box(df, x='judge_label', y='judge_conf',
              title='Confidence Scores by Verdict')
fig2.show()

# Agent performance comparison
agent_stats = df.groupby('agent_id').agg({
    'judge_label': lambda x: (x == 'success').sum(),
    'judge_conf': 'mean'
}).reset_index()

fig3 = px.bar(agent_stats, x='agent_id', y='judge_label',
              title='Success Count by Agent')
fig3.show()
```

**Coding Required**: ✅ Yes - Python

**Best For**:
- Data scientists and researchers
- Custom analysis workflows
- Interactive exploration
- Sharing analysis with team (export to HTML)

**Advantages**:
- Full Python ecosystem (NumPy, pandas, scikit-learn)
- Interactive widgets (ipywidgets)
- Export to HTML for sharing
- Version control friendly (.ipynb in git)

---

### 5.2 Streamlit Dashboard (Web App)

**Type**: Python Web Framework
**Platform**: Python
**Setup Complexity**: ⭐⭐⭐ Medium (3/5)

**What it Visualizes**:
- ✅ Custom web dashboards
- ✅ Real-time database monitoring
- ✅ Interactive filters and controls
- ✅ Shareable web apps

**Example App**:
```python
# app.py
import streamlit as st
import sqlite3
import pandas as pd
import plotly.express as px

st.title('ReasoningBank Visualization Dashboard')

# Sidebar filters
agent = st.sidebar.selectbox('Agent', ['All', 'coder', 'researcher', 'tester'])
date_range = st.sidebar.date_input('Date Range', [])

# Connect to database
conn = sqlite3.connect('.swarm/memory.db')

# Load data
query = """
    SELECT * FROM task_trajectories
    WHERE judge_label IS NOT NULL
"""
if agent != 'All':
    query += f" AND agent_id = '{agent}'"

df = pd.read_sql_query(query, conn)

# Display metrics
col1, col2, col3 = st.columns(3)
col1.metric('Total Trajectories', len(df))
col2.metric('Success Rate', f"{(df['judge_label'] == 'success').mean():.1%}")
col3.metric('Avg Confidence', f"{df['judge_conf'].mean():.2f}")

# Charts
st.subheader('Verdict Distribution')
fig = px.pie(df, names='judge_label', title='Verdict Distribution')
st.plotly_chart(fig)

st.subheader('Confidence Over Time')
fig2 = px.scatter(df, x='created_at', y='judge_conf', color='judge_label',
                  title='Confidence Scores Over Time')
st.plotly_chart(fig2)

# Data table
st.subheader('Recent Trajectories')
st.dataframe(df[['task_id', 'agent_id', 'judge_label', 'judge_conf', 'created_at']].head(20))
```

Run with:
```bash
pip install streamlit plotly
streamlit run app.py
```

**Coding Required**: ✅ Yes - Python

**Best For**:
- Building custom ReasoningBank dashboards
- Real-time monitoring
- Team-wide access (deploy to cloud)
- Non-technical users (GUI interface)

**Deployment**:
- Local: `streamlit run app.py`
- Cloud: Streamlit Cloud, Heroku, AWS

---

### 5.3 Grafana + SQLite Plugin

**Type**: Open-Source Monitoring Platform
**Platform**: Docker, Linux, macOS, Windows
**Setup Complexity**: ⭐⭐⭐⭐ High (4/5)

**What it Visualizes**:
- ✅ Real-time dashboards
- ✅ Time-series metrics
- ✅ Alerting on thresholds
- ✅ Multi-database support

**Setup**:
```bash
# Install Grafana
docker run -d -p 3000:3000 grafana/grafana

# Install SQLite plugin
docker exec -it <container> grafana-cli plugins install frser-sqlite-datasource
```

**Coding Required**: ❌ No - GUI configuration

**Best For**:
- Production monitoring
- Real-time alerts (e.g., "confidence drops below 0.8")
- Historical trend analysis
- Integration with existing monitoring stack

**Use Case**:
Monitor ReasoningBank health metrics:
- Success rate over time
- Average confidence per agent
- Pattern usage trends
- Memory consolidation effectiveness

**Limitations**:
- Overkill for ad-hoc analysis
- Requires infrastructure knowledge
- Better suited for production deployments

---

## Specialized Tool: AgentDB Embeddings Visualization

### Using TensorBoard Embedding Projector

**What**: Visualize 1536-dimensional pattern embeddings in 2D/3D space

**Setup**:
```python
import sqlite3
import numpy as np
from torch.utils.tensorboard import SummaryWriter

# Load embeddings from ReasoningBank
conn = sqlite3.connect('.swarm/memory.db')
cursor = conn.execute("""
    SELECT pe.id, pe.vector, p.pattern_data, p.confidence
    FROM pattern_embeddings pe
    JOIN patterns p ON pe.id = p.id
""")

embeddings = []
metadata = []
for id, vector, pattern_data, confidence in cursor:
    vec = np.frombuffer(vector, dtype=np.float32)
    embeddings.append(vec)
    metadata.append(f"{id[:8]} (conf: {confidence:.2f})")

embeddings = np.array(embeddings)

# Log to TensorBoard
writer = SummaryWriter('runs/embeddings')
writer.add_embedding(embeddings, metadata=metadata)
writer.close()
```

Run:
```bash
tensorboard --logdir=runs/embeddings
# Navigate to "Projections" tab
```

**Visualization**:
- t-SNE projection (clusters similar patterns)
- UMAP projection (preserves global structure)
- PCA (linear dimensionality reduction)

**Insights Gained**:
- Identify pattern clusters (e.g., debugging patterns vs optimization patterns)
- Detect outlier patterns (low-quality or unique experiences)
- Visualize semantic similarity between reasoning approaches

---

## Recommended Tool Combinations

### For Non-Technical Users
1. **DB Browser for SQLite** - Quick data inspection
2. **Sqliteviz** - Generate charts without coding
3. **JSON Crack** - Explore trajectory JSON

**Time to Setup**: 10 minutes
**Coding Required**: None

---

### For Data Analysts
1. **DBeaver** - SQL queries and schema exploration
2. **Jupyter Notebook + Plotly** - Custom analysis
3. **Sqliteviz** - Quick charting

**Time to Setup**: 30 minutes
**Coding Required**: Minimal (SQL queries, basic Python)

---

### For Developers
1. **DB Browser for SQLite** - Schema verification
2. **Cytoscape.js** - Interactive pattern graph
3. **Streamlit Dashboard** - Custom web interface
4. **TensorBoard** - Embedding visualization

**Time to Setup**: 2-4 hours
**Coding Required**: Yes (JavaScript, Python)

---

### For Researchers
1. **DBeaver** - Data extraction
2. **Jupyter Notebook** - Analysis and experimentation
3. **dtreeviz** - Trajectory path visualization
4. **D3.js** - Publication-quality interactive figures
5. **TensorBoard** - Embedding projector

**Time to Setup**: 1-2 days
**Coding Required**: Yes (Python, JavaScript)

---

### For Production Monitoring
1. **Grafana** - Real-time dashboards
2. **TensorBoard** - Embedding trends
3. **Streamlit** - Internal tools

**Time to Setup**: 1 week (including infrastructure)
**Coding Required**: Yes (configuration, scripting)

---

## Quick Start Recommendation

**For immediate visualization with minimal setup:**

1. **Download DB Browser for SQLite** (5 minutes)
   - Open `.swarm/memory.db`
   - Browse `task_trajectories` table
   - Run SQL: `SELECT * FROM task_trajectories WHERE judge_label = 'success'`

2. **Use Sqliteviz for charts** (5 minutes)
   - Visit https://lana-k.github.io/sqliteviz/
   - Upload `.swarm/memory.db`
   - Query: `SELECT DATE(created_at), COUNT(*) FROM task_trajectories GROUP BY DATE(created_at)`
   - Select "Line Chart"

3. **Explore JSON with JSON Crack** (5 minutes)
   - Copy a `trajectory_json` value from DB Browser
   - Paste into https://jsoncrack.com/
   - Explore state→action→outcome structure

**Total Time**: 15 minutes
**No coding required**

---

## Advanced Visualization: Custom ReasoningBank Dashboard

For a comprehensive solution, build a custom dashboard using:

**Backend**: Python + FastAPI
```python
# api.py
from fastapi import FastAPI
import sqlite3
import json

app = FastAPI()

@app.get("/trajectories")
def get_trajectories(limit: int = 100):
    conn = sqlite3.connect('.swarm/memory.db')
    cursor = conn.execute("""
        SELECT task_id, agent_id, query, judge_label, judge_conf, created_at
        FROM task_trajectories
        ORDER BY created_at DESC
        LIMIT ?
    """, (limit,))
    return [dict(zip([d[0] for d in cursor.description], row))
            for row in cursor.fetchall()]

@app.get("/pattern-graph")
def get_pattern_graph():
    conn = sqlite3.connect('.swarm/memory.db')
    cursor = conn.execute("""
        SELECT src_id, dst_id, relation, weight FROM pattern_links
    """)
    links = [dict(zip([d[0] for d in cursor.description], row))
             for row in cursor.fetchall()]

    # Build Cytoscape format
    nodes = set()
    for link in links:
        nodes.add(link['src_id'])
        nodes.add(link['dst_id'])

    return {
        'nodes': [{'data': {'id': n, 'label': n[:8]}} for n in nodes],
        'edges': [{'data': {
            'source': l['src_id'],
            'target': l['dst_id'],
            'label': l['relation'],
            'weight': l['weight']
        }} for l in links]
    }
```

**Frontend**: React + Cytoscape.js
```jsx
// App.jsx
import React, { useEffect, useState } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';

function App() {
  const [graph, setGraph] = useState({ nodes: [], edges: [] });

  useEffect(() => {
    fetch('/api/pattern-graph')
      .then(r => r.json())
      .then(data => setGraph(data));
  }, []);

  return (
    <div>
      <h1>ReasoningBank Pattern Graph</h1>
      <CytoscapeComponent
        elements={[...graph.nodes, ...graph.edges]}
        style={{ width: '100%', height: '600px' }}
        layout={{ name: 'cose' }}
      />
    </div>
  );
}
```

**Deployment**:
```bash
# Backend
pip install fastapi uvicorn
uvicorn api:app --reload

# Frontend
npm create vite@latest reasoningbank-ui -- --template react
cd reasoningbank-ui
npm install cytoscape react-cytoscapejs
npm run dev
```

---

## Conclusion

### Summary Matrix

| Tool | Setup Time | Coding | Best Use Case | Cost |
|------|-----------|--------|---------------|------|
| DB Browser for SQLite | 5 min | ❌ | Quick inspection | Free |
| SQLiteStudio | 5 min | ❌ | Schema diagrams | Free |
| DBeaver | 10 min | ❌ | Professional SQL IDE | Free |
| Beekeeper Studio | 5 min | ❌ | Modern UI | Free/Paid |
| Sqliteviz | 2 min | ❌ | Quick charts | Free |
| dtreeviz | 30 min | ✅ | Decision tree paths | Free |
| Cytoscape.js | 2 hours | ✅ | Pattern graphs | Free |
| D3.js | 4 hours | ✅ | Custom visualizations | Free |
| Graphviz | 15 min | ⚠️ | Static diagrams | Free |
| JSON Crack | 2 min | ❌ | JSON exploration | Free |
| TensorBoard | 30 min | ✅ | Embedding projection | Free |
| Jupyter + Plotly | 1 hour | ✅ | Data analysis | Free |
| Streamlit | 2 hours | ✅ | Web dashboards | Free |
| Grafana | 4 hours | ❌ | Production monitoring | Free |

### Next Steps

1. **Immediate**: Use DB Browser for SQLite + Sqliteviz for basic exploration
2. **Short-term**: Create Jupyter notebooks for trajectory analysis
3. **Medium-term**: Build Streamlit dashboard for team access
4. **Long-term**: Implement Cytoscape.js for pattern graph exploration

### Custom Development Path

If existing tools don't meet needs, consider building:

1. **ReasoningBank Explorer** (Streamlit app)
   - Trajectory browser with filtering
   - Verdict analysis with charts
   - Pattern search by similarity
   - Embedding visualization

2. **Pattern Graph Viewer** (React + Cytoscape.js)
   - Interactive graph exploration
   - Filter by domain, confidence, usage
   - Export subgraphs for analysis

3. **Learning Dashboard** (Grafana)
   - Real-time success rate monitoring
   - Confidence trend alerts
   - Agent performance comparison

---

## References

- **ReasoningBank Implementation**: `.claude/reasoningbank/`
- **AgentDB Integration**: `.claude/integrations/agentdb-wrapper.js`
- **Database Schema**: `.swarm/memory.db` (SQLite)
- **Embedding Format**: 1536-dimensional float32 vectors

---

**Research Completed**: 2025-11-16
**Tools Evaluated**: 20+
**Recommendations**: 5 tool combinations for different user profiles
