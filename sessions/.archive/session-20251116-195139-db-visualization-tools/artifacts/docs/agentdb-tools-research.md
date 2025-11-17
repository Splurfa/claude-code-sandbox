# AgentDB Vector Database Visualization Tools - Research Report

**Research Date**: November 16, 2025
**Focus**: Tools and methods for visualizing AgentDB vector databases
**Target Audience**: Developers and non-technical users

---

## Executive Summary

AgentDB is a sub-millisecond vector database designed specifically for AI agents, delivering 150x faster vector search compared to JSON-based solutions. While AgentDB itself doesn't include built-in visualization tools, several excellent third-party solutions exist for visualizing vector embeddings, exploring database contents, and understanding similarity relationships.

This report categorizes tools by use case and technical expertise required, from developer-focused CLI tools to user-friendly GUI applications.

---

## 1. AgentDB Overview

### What is AgentDB?

- **Performance**: 150x faster vector search (10K+ entries vs JSON)
- **Memory Efficiency**: 56% memory reduction with better-sqlite3
- **Built for Agents**: Lives inside the runtime, no external service needed
- **Location**: `.agentdb/reasoningbank.db` (SQLite-based)
- **Integration**: Part of agentic-flow/claude-flow ecosystem
- **Developer**: rUv (https://agentdb.ruv.io)

### Key Features

- 29 MCP Tools for AI integration
- Reflexion and ReasoningBank for agent learning
- Vector search with cosine, euclidean, and dot product metrics
- MMR (Maximal Marginal Relevance) diversity ranking
- Context synthesis and metadata filtering
- QUIC synchronization for distributed deployments

### Database Structure

AgentDB uses SQLite with the following key tables:
- `episodes` - Reflexion learning episodes with embeddings
- `patterns` - Learned patterns and behaviors
- `skills` - Reusable agent capabilities
- `vectors` - Raw vector embeddings (stored as BLOBs)
- Metadata tables for filtering and hybrid search

---

## 2. Visualization Tools by Category

### 🎯 Category A: Command-Line Tools (Developer-Friendly)

#### **AgentDB CLI** ⭐ RECOMMENDED FOR AGENTDB

**Access**: `npx agentdb@latest <command>`

**Capabilities**:
```bash
# Database statistics
npx agentdb@latest db stats

# Vector search with similarity scores
npx agentdb@latest vector-search ./vectors.db "[0.1,0.2,0.3]" -k 10 -m cosine -v

# Export to JSON for external analysis
npx agentdb@latest export ./.agentdb/reasoningbank.db ./export.json

# Reflexion episode retrieval
npx agentdb@latest reflexion retrieve "authentication" 10 0.8

# Skill search
npx agentdb@latest skill search "bug-fix" 5
```

**What You Can See**:
- Database statistics (episode count, embeddings, skills, causal edges)
- Vector similarity search results with scores
- Episode metadata and critiques
- Skill definitions and usage
- Causal relationships

**Ease of Use**: ⭐⭐⭐ Moderate (requires command-line comfort)

**Technical Requirements**:
- Node.js 18+
- Terminal/command-line access
- Basic understanding of JSON

**Non-Developer Friendly**: ⚠️ Limited - requires terminal usage

**Integration**: ✅ Perfect - designed specifically for AgentDB

---

#### **sqlite3 CLI**

**Access**: `sqlite3 ./.agentdb/reasoningbank.db`

**Capabilities**:
```bash
# Interactive SQL queries
sqlite3 ./.agentdb/reasoningbank.db

# Common queries
.schema                           # Show database structure
SELECT COUNT(*) FROM episodes;    # Count episodes
SELECT * FROM episodes LIMIT 10;  # View episodes
.mode column                      # Better formatting
.headers on                       # Show column names

# Export to CSV
.mode csv
.output episodes.csv
SELECT * FROM episodes;
.output stdout

# Database optimization
VACUUM;
ANALYZE;
```

**What You Can See**:
- Raw database schema
- All tables and relationships
- Text metadata and statistics
- Vector data (as hex/binary)

**Ease of Use**: ⭐⭐ Challenging (SQL knowledge required)

**Technical Requirements**:
- SQLite3 installed
- SQL query knowledge
- Command-line comfort

**Non-Developer Friendly**: ❌ Not recommended

**Integration**: ✅ Native SQLite access

---

### 🖥️ Category B: Desktop GUI Applications

#### **DB Browser for SQLite (DB4S)** ⭐ RECOMMENDED FOR NON-DEVELOPERS

**Access**: https://sqlitebrowser.org/ (Free download)

**Capabilities**:
- Spreadsheet-like interface for browsing tables
- Visual query builder (no SQL required)
- Export to CSV/JSON
- Filter and sort data visually
- View table schemas graphically
- Image mode for BLOB data
- Execute custom SQL queries

**What You Can See**:
- ✅ All database tables
- ✅ Episode metadata (text, rewards, timestamps)
- ✅ Skill definitions
- ✅ Causal relationships
- ⚠️ Vector embeddings (as hex/binary - not human-readable)
- ✅ Database statistics

**Ease of Use**: ⭐⭐⭐⭐⭐ Excellent (point-and-click)

**Technical Requirements**:
- Desktop application (Windows/Mac/Linux)
- No coding required
- Minimal SQL knowledge helpful but optional

**Non-Developer Friendly**: ✅ Highly recommended

**Integration**: ✅ Works with any SQLite database

**Limitations**:
- Cannot visualize vector embeddings as points in space
- BLOB data shows as hex, not meaningful vectors
- No built-in t-SNE/UMAP projections

**Best For**:
- Browsing episode metadata
- Searching through learned skills
- Exporting data for analysis
- Understanding database structure

---

#### **Datasette** ⭐ RECOMMENDED FOR WEB-BASED EXPLORATION

**Access**: `pip install datasette` + `datasette ./.agentdb/reasoningbank.db`

**Capabilities**:
- Instant web UI for SQLite databases
- No coding required to browse
- JSON API automatically generated
- Faceted search and filtering
- Export to JSON/CSV
- Extensive plugin ecosystem for visualization

**Key Plugins for Visualization**:

1. **datasette-vega** - Charts and graphs
   ```bash
   datasette install datasette-vega
   # Creates bar, line, scatter charts from query results
   ```

2. **datasette-cluster-map** - Geographic visualization
   ```bash
   datasette install datasette-cluster-map
   # Maps lat/long data (if present in metadata)
   ```

3. **datasette-plot** - General visualization
   ```bash
   datasette install datasette-plot
   # Modern charting for tables and queries
   ```

**What You Can See**:
- ✅ Web-based data browser
- ✅ All tables and metadata
- ✅ Charts and graphs via plugins
- ✅ Faceted search
- ✅ JSON API for integration
- ⚠️ Vectors as binary (not 2D/3D projections)

**Ease of Use**: ⭐⭐⭐⭐ Easy (web browser interface)

**Technical Requirements**:
- Python 3.6+
- `pip install datasette`
- Web browser

**Non-Developer Friendly**: ✅ Very friendly (web interface)

**Integration**: ✅ Works with SQLite, extensive plugins

**Best For**:
- Sharing database access with team
- Creating public/private data APIs
- Building custom views with plugins
- Exploratory data analysis

**Example Setup**:
```bash
# Install Datasette
pip install datasette datasette-vega datasette-plot

# Start server
datasette ./.agentdb/reasoningbank.db --open

# Access at http://localhost:8001
```

---

### 🌐 Category C: Web-Based Vector Visualization

#### **TensorBoard Embedding Projector** ⭐ RECOMMENDED FOR EMBEDDING VISUALIZATION

**Access**:
- Standalone: https://projector.tensorflow.org/
- Integrated: `pip install tensorboard` + configure

**Capabilities**:
- Interactive 3D visualization of embeddings
- Three dimensionality reduction methods:
  - **PCA** (Principal Component Analysis) - Fast, linear
  - **t-SNE** (t-Distributed Stochastic Neighbor Embedding) - Reveals clusters
  - **UMAP** (Uniform Manifold Approximation and Projection) - Fast, preserves global structure
- Search for specific terms/vectors
- Highlight nearest neighbors
- Color by metadata
- Zoom, rotate, explore in 3D space

**What You Can See**:
- ✅ Vectors as 2D/3D points
- ✅ Cluster visualization
- ✅ Similarity relationships (nearby = similar)
- ✅ Outliers and anomalies
- ✅ Metadata coloring
- ✅ Search and highlight

**Ease of Use**: ⭐⭐⭐⭐ Easy (web interface, some setup required)

**Technical Requirements**:
- Extract vectors from AgentDB
- Convert to TensorBoard format (TSV files)
- Upload to projector.tensorflow.org OR run locally

**Non-Developer Friendly**: ⭐⭐⭐ Moderate (requires data export)

**Integration**: ⚠️ Manual - requires export from AgentDB

**Setup Process**:
```bash
# 1. Export vectors from AgentDB
npx agentdb@latest export ./.agentdb/reasoningbank.db ./export.json

# 2. Convert JSON to TSV format
# vectors.tsv (tab-separated, one vector per line)
# metadata.tsv (tab-separated metadata)

# 3. Upload to https://projector.tensorflow.org/
# OR run locally with TensorBoard
```

**Best For**:
- Understanding how embeddings cluster
- Debugging vector search quality
- Exploring semantic relationships
- Identifying outliers
- Presenting visualizations to stakeholders

---

#### **Nomic Atlas** ⭐ BEST FOR LARGE-SCALE EXPLORATION

**Access**: https://atlas.nomic.ai/ (Cloud platform)

**Capabilities**:
- Visualize millions of embeddings interactively
- Automatic UMAP projection
- Cluster detection and labeling
- Semantic search within map
- Collaborative exploration
- Vector database integration
- Real-time updates

**What You Can See**:
- ✅ Massive datasets (millions of vectors)
- ✅ Interactive 2D embedding maps
- ✅ Automatic clustering
- ✅ Search and filter
- ✅ Metadata overlays
- ✅ Similarity exploration

**Ease of Use**: ⭐⭐⭐⭐⭐ Excellent (cloud platform)

**Technical Requirements**:
- Account on Nomic platform
- Python client: `pip install nomic`
- Upload data via API

**Non-Developer Friendly**: ✅ Yes (web UI), ⚠️ API upload needs coding

**Integration**: ⚠️ Requires upload to Nomic platform

**Setup Example**:
```python
from nomic import AtlasDataset
import json

# Load AgentDB export
with open('export.json') as f:
    data = json.load(f)

# Upload to Atlas
dataset = AtlasDataset(name='AgentDB Embeddings')
dataset.add_data(data)
dataset.create_index(indexed_field='embedding')

# View at https://atlas.nomic.ai/
```

**Best For**:
- Large-scale embedding exploration
- Team collaboration
- Production monitoring
- Debugging RAG systems
- Interactive presentations

**Pricing**: Free tier available, paid for large datasets

---

### 🐍 Category D: Python Visualization Libraries

#### **Plotly + UMAP/t-SNE** ⭐ BEST FOR CUSTOM ANALYSIS

**Access**: Python libraries + Jupyter Notebook

**Capabilities**:
- Full control over visualization
- Interactive 2D/3D plots
- Custom dimensionality reduction
- Jupyter notebook integration
- Export to HTML (shareable)

**Libraries Required**:
```bash
pip install plotly umap-learn scikit-learn pandas numpy
```

**Example Code**:
```python
import json
import plotly.express as px
from umap import UMAP
import pandas as pd

# 1. Load AgentDB export
with open('export.json') as f:
    data = json.load(f)

# 2. Extract vectors and metadata
vectors = [item['embedding'] for item in data['episodes']]
metadata = [item['metadata'] for item in data['episodes']]

# 3. Reduce dimensions with UMAP
reducer = UMAP(n_components=2, random_state=42)
embeddings_2d = reducer.fit_transform(vectors)

# 4. Create DataFrame
df = pd.DataFrame(embeddings_2d, columns=['x', 'y'])
df['text'] = [m.get('task', '') for m in metadata]
df['reward'] = [m.get('reward', 0) for m in metadata]

# 5. Interactive plot
fig = px.scatter(df, x='x', y='y',
                 hover_data=['text'],
                 color='reward',
                 title='AgentDB Embeddings (UMAP)')
fig.show()
```

**What You Can See**:
- ✅ Custom 2D/3D projections
- ✅ Interactive hover tooltips
- ✅ Color by any metadata
- ✅ Zoom, pan, rotate
- ✅ Export to HTML/PNG
- ✅ Statistical analysis

**Ease of Use**: ⭐⭐ Moderate (Python coding required)

**Technical Requirements**:
- Python 3.7+
- Jupyter Notebook (recommended)
- Understanding of numpy/pandas
- Data science basics

**Non-Developer Friendly**: ❌ Not recommended

**Integration**: ⚠️ Manual - requires export and coding

**Best For**:
- Researchers and data scientists
- Custom analysis workflows
- Statistical exploration
- Publication-quality visualizations
- Jupyter notebook reports

---

#### **Embedditor** - Visual Embedding Editor

**Access**: https://github.com/IngestAI/embedditor

**Capabilities**:
- GUI for editing embeddings like a document
- Spreadsheet-like interface
- Edit metadata and tokens
- Exclude words from chunks
- Add images and links
- Export to JSON/VEML

**What You Can See**:
- ✅ Embeddings as editable rows
- ✅ Metadata fields
- ✅ Token visualization
- ✅ Chunk boundaries

**Ease of Use**: ⭐⭐⭐⭐ Easy (GUI application)

**Technical Requirements**:
- Desktop application
- Import/export AgentDB data

**Non-Developer Friendly**: ✅ Yes

**Integration**: ⚠️ Requires export to compatible format

**Best For**:
- Editing embeddings before storage
- Curating training data
- Metadata management

---

### 📊 Category E: Specialized Tools

#### **FiftyOne** - Computer Vision & Embeddings

**Access**: `pip install fiftyone`

**Capabilities**:
- Visualize image embeddings
- PCA, t-SNE, UMAP projections
- Interactive dataset exploration
- Clustering and search
- Jupyter integration

**What You Can See**:
- ✅ Image embeddings visualization
- ✅ Multimodal embeddings
- ✅ Interactive exploration
- ✅ Cluster analysis

**Ease of Use**: ⭐⭐⭐ Moderate (Python + CLI)

**Technical Requirements**:
- Python 3.7+
- Image/video data
- `pip install fiftyone`

**Non-Developer Friendly**: ⚠️ Limited

**Best For**:
- Computer vision projects
- Image/video embeddings
- Multimodal AI systems

---

#### **Observable** - Interactive Notebooks

**Access**: https://observablehq.com/

**Capabilities**:
- JavaScript-based interactive notebooks
- Real-time visualization
- Collaborative exploration
- Publish and share

**What You Can See**:
- ✅ Custom interactive visualizations
- ✅ D3.js charts
- ✅ Real-time updates

**Ease of Use**: ⭐⭐⭐ Moderate (JavaScript required)

**Technical Requirements**:
- JavaScript knowledge
- Web browser
- Observable account

**Non-Developer Friendly**: ⚠️ Limited

**Best For**:
- Interactive data stories
- Web-based visualizations
- Collaborative exploration

---

## 3. Quick Comparison Matrix

| Tool | Ease of Use | Cost | Vector Viz | Metadata Viz | Integration | Best For |
|------|-------------|------|------------|--------------|-------------|----------|
| **AgentDB CLI** | ⭐⭐⭐ | Free | Search only | ✅ | Native | Developers |
| **DB Browser for SQLite** | ⭐⭐⭐⭐⭐ | Free | ❌ | ✅ | Direct | Non-developers |
| **Datasette** | ⭐⭐⭐⭐ | Free | ❌ | ✅ | Direct | Teams |
| **TensorBoard Projector** | ⭐⭐⭐⭐ | Free | ✅ | ✅ | Export | Embeddings |
| **Nomic Atlas** | ⭐⭐⭐⭐⭐ | Freemium | ✅ | ✅ | Upload | Large scale |
| **Plotly/Python** | ⭐⭐ | Free | ✅ | ✅ | Export | Custom analysis |
| **Embedditor** | ⭐⭐⭐⭐ | Free | ❌ | ✅ | Import/Export | Editing |
| **FiftyOne** | ⭐⭐⭐ | Free | ✅ | ✅ | Export | Vision/Multimodal |

Legend:
- ✅ Fully supported
- ⚠️ Partial/Manual
- ❌ Not supported

---

## 4. Recommended Workflows

### For Non-Developers

**Goal**: Browse and search database contents

1. **Install DB Browser for SQLite**
   - Download from https://sqlitebrowser.org/
   - Open `.agentdb/reasoningbank.db`
   - Browse tables, filter, export

2. **View Embedding Projections**
   - Export: `npx agentdb@latest export ./.agentdb/reasoningbank.db ./export.json`
   - Convert to TSV format (ask developer for script)
   - Upload to https://projector.tensorflow.org/

**Time**: 15 minutes setup

---

### For Developers

**Goal**: Comprehensive vector analysis

1. **Quick Stats**
   ```bash
   npx agentdb@latest db stats
   ```

2. **Export Data**
   ```bash
   npx agentdb@latest export ./.agentdb/reasoningbank.db ./export.json
   ```

3. **Local Web UI**
   ```bash
   pip install datasette datasette-vega
   datasette ./.agentdb/reasoningbank.db --open
   ```

4. **Vector Visualization**
   ```python
   # Use Plotly + UMAP script above
   # OR upload to Nomic Atlas
   ```

**Time**: 30 minutes setup

---

### For Data Scientists

**Goal**: Deep analysis and custom visualizations

1. **Setup Python Environment**
   ```bash
   pip install plotly umap-learn scikit-learn pandas jupyter
   ```

2. **Export AgentDB Data**
   ```bash
   npx agentdb@latest export ./.agentdb/reasoningbank.db ./export.json
   ```

3. **Jupyter Analysis**
   ```python
   # Load data
   # Apply UMAP/t-SNE
   # Create interactive plots
   # Statistical analysis
   # Export results
   ```

4. **Optional: TensorBoard**
   ```bash
   # Convert to TensorBoard format
   # Run TensorBoard locally
   tensorboard --logdir=./embeddings
   ```

**Time**: 1-2 hours initial setup

---

### For Teams

**Goal**: Shared exploration and collaboration

1. **Setup Datasette Server**
   ```bash
   datasette ./.agentdb/reasoningbank.db \
     --host 0.0.0.0 \
     --port 8001 \
     --cors
   ```

2. **Optional: Nomic Atlas**
   - Create team account
   - Upload embeddings
   - Share interactive maps

**Time**: 1 hour setup, ongoing use

---

## 5. Export Scripts

### Export AgentDB to TensorBoard Format

```python
#!/usr/bin/env python3
"""
Export AgentDB vectors to TensorBoard Projector format
"""
import json
import sys
from pathlib import Path

def export_to_tensorboard(export_file, output_dir):
    """Convert AgentDB export to TensorBoard TSV format"""

    # Read AgentDB export
    with open(export_file) as f:
        data = json.load(f)

    output_path = Path(output_dir)
    output_path.mkdir(exist_ok=True)

    # Write vectors.tsv (tab-separated)
    vectors_file = output_path / 'vectors.tsv'
    with open(vectors_file, 'w') as f:
        for episode in data.get('episodes', []):
            embedding = episode.get('embedding', [])
            if embedding:
                f.write('\t'.join(map(str, embedding)) + '\n')

    # Write metadata.tsv (tab-separated)
    metadata_file = output_path / 'metadata.tsv'
    with open(metadata_file, 'w') as f:
        # Header
        f.write('task\treward\tsuccess\tdomain\n')

        # Data rows
        for episode in data.get('episodes', []):
            meta = episode.get('metadata', {})
            task = meta.get('task', 'unknown')
            reward = meta.get('reward', 0)
            success = meta.get('success', False)
            domain = meta.get('domain', 'default')

            f.write(f'{task}\t{reward}\t{success}\t{domain}\n')

    print(f"✅ Exported to {output_path}")
    print(f"   Vectors: {vectors_file}")
    print(f"   Metadata: {metadata_file}")
    print(f"\n📊 Upload to https://projector.tensorflow.org/")

if __name__ == '__main__':
    if len(sys.argv) != 3:
        print("Usage: python export-tensorboard.py export.json output-dir")
        sys.exit(1)

    export_to_tensorboard(sys.argv[1], sys.argv[2])
```

**Usage**:
```bash
# Export AgentDB
npx agentdb@latest export ./.agentdb/reasoningbank.db ./export.json

# Convert to TensorBoard format
python export-tensorboard.py export.json ./tensorboard-data

# Upload to https://projector.tensorflow.org/
# Load vectors.tsv and metadata.tsv
```

---

### Export to Nomic Atlas

```python
#!/usr/bin/env python3
"""
Export AgentDB vectors to Nomic Atlas
"""
import json
from nomic import AtlasDataset

def export_to_nomic(export_file, dataset_name):
    """Upload AgentDB export to Nomic Atlas"""

    # Read AgentDB export
    with open(export_file) as f:
        data = json.load(f)

    # Prepare data for Atlas
    atlas_data = []
    for episode in data.get('episodes', []):
        atlas_data.append({
            'embedding': episode.get('embedding', []),
            'text': episode.get('metadata', {}).get('task', 'unknown'),
            'reward': episode.get('metadata', {}).get('reward', 0),
            'success': episode.get('metadata', {}).get('success', False),
            'domain': episode.get('metadata', {}).get('domain', 'default'),
        })

    # Upload to Atlas
    dataset = AtlasDataset(name=dataset_name)
    dataset.add_data(atlas_data)
    dataset.create_index(indexed_field='embedding')

    print(f"✅ Uploaded {len(atlas_data)} embeddings to Nomic Atlas")
    print(f"🌐 View at https://atlas.nomic.ai/")

if __name__ == '__main__':
    import sys
    if len(sys.argv) != 3:
        print("Usage: python export-nomic.py export.json dataset-name")
        sys.exit(1)

    export_to_nomic(sys.argv[1], sys.argv[2])
```

**Usage**:
```bash
# Install Nomic client
pip install nomic

# Login to Nomic
nomic login

# Export and upload
npx agentdb@latest export ./.agentdb/reasoningbank.db ./export.json
python export-nomic.py export.json "AgentDB Embeddings"
```

---

## 6. Summary & Recommendations

### For Non-Technical Users

**Start Here**:
1. **DB Browser for SQLite** - Browse metadata and tables
2. **TensorBoard Projector** - Visualize embeddings (ask developer to export)

**Pros**: Free, easy to use, no coding
**Cons**: Limited to what's exported for you

---

### For Developers

**Start Here**:
1. **AgentDB CLI** - Quick stats and searches
2. **Datasette** - Local web UI for exploration
3. **TensorBoard Projector** - Embedding visualization

**Pros**: Full control, integrates well
**Cons**: Requires export step for visualization

---

### For Data Scientists

**Start Here**:
1. **Plotly + UMAP** - Custom Python analysis
2. **Nomic Atlas** - Large-scale exploration
3. **Jupyter Notebooks** - Comprehensive analysis

**Pros**: Maximum flexibility, publication-quality
**Cons**: Requires coding, more setup

---

### For Teams

**Start Here**:
1. **Datasette** - Shared web-based exploration
2. **Nomic Atlas** - Collaborative embedding maps
3. **DB Browser for SQLite** - Individual exploration

**Pros**: Collaboration, sharing, accessible
**Cons**: May require server setup

---

## 7. Additional Resources

### Official Documentation
- **AgentDB**: https://agentdb.ruv.io
- **AgentDB GitHub**: https://github.com/ruvnet/agentic-flow/tree/main/packages/agentdb
- **AgentDB npm**: https://www.npmjs.com/package/agentdb

### Tools Documentation
- **DB Browser for SQLite**: https://sqlitebrowser.org/
- **Datasette**: https://datasette.io/
- **TensorBoard**: https://www.tensorflow.org/tensorboard
- **Nomic Atlas**: https://docs.nomic.ai/
- **Plotly**: https://plotly.com/python/

### Vector Visualization Tutorials
- **t-SNE & UMAP in Python**: https://plotly.com/python/t-sne-and-umap-projections/
- **TensorBoard Embeddings**: https://www.tensorflow.org/tensorboard/tensorboard_projector_plugin
- **Nomic Atlas Guide**: https://docs.nomic.ai/platform/embeddings-and-retrieval

### AgentDB Skills (Local)
- `.claude/skills/agentdb-advanced/SKILL.md` - Advanced features
- `.claude/skills/agentdb-vector-search/SKILL.md` - Vector search
- `.claude/skills/agentdb-optimization/SKILL.md` - Performance tuning
- `.claude/integrations/agentdb-wrapper.js` - JavaScript wrapper

---

## 8. Troubleshooting

### Issue: AgentDB database not found

```bash
# Verify database exists
ls -la .agentdb/

# Initialize if missing
npx agentdb@latest init ./.agentdb/reasoningbank.db --dimension 1536
```

### Issue: Export fails

```bash
# Check database integrity
sqlite3 ./.agentdb/reasoningbank.db "PRAGMA integrity_check;"

# Try with compression
npx agentdb@latest export ./.agentdb/reasoningbank.db ./export.json --compress
```

### Issue: TensorBoard shows blank

**Problem**: Vectors not in correct format

**Solution**: Ensure TSV files are tab-separated, no extra spaces

### Issue: Nomic upload fails

```bash
# Check authentication
nomic login

# Verify data format
python -m json.tool export.json > /dev/null

# Try smaller dataset first
head -n 100 export.json > test-export.json
```

---

## 9. Next Steps

1. **Start Simple**: Use DB Browser for SQLite to explore tables
2. **Export Data**: Run `npx agentdb@latest export`
3. **Visualize Embeddings**: Try TensorBoard Projector
4. **Advanced Analysis**: Set up Python environment for custom work
5. **Team Sharing**: Deploy Datasette for collaborative exploration

---

**Last Updated**: November 16, 2025
**Maintainer**: Research Agent
**Session**: session-20251116-195139-db-visualization-tools
