# Evidence.dev Research Report - SQLite Visualization Analysis

**Research Date**: 2025-11-16
**Purpose**: Evaluate Evidence.dev as a SQLite visualization tool for non-developers

---

## Executive Summary

Evidence.dev is a **code-based BI framework** (SQL + Markdown) that offers beautiful, publication-quality dashboards. While technically capable with SQLite, it is **NOT recommended for non-developers** due to its requirement for SQL and markdown coding skills.

**Quick Verdict**: ❌ **Not suitable for non-developer use case**

---

## 1. SQLite Compatibility

### ✅ YES - Full SQLite Support

Evidence.dev supports SQLite as a first-class data source through the `@evidence-dev/sqlite` package.

**How it works:**
- Connects to local SQLite database files
- Extracts data via SQL queries into Parquet format
- Uses the universal Parquet format for unified querying across multiple data sources
- Supports SQLite's native SQL dialect

**Setup Process:**
1. Run `npm run dev` and navigate to `localhost:3000/settings`
2. Select SQLite as data source
3. Configure connection (point to `.db` file)
4. Add `.sql` files to `/sources/[source_name]/` folder
5. Run `npm run sources` to extract data
6. Query in Evidence using `[source].[query]` syntax

**Limitations:**
- SQLite data is extracted to Parquet (not direct queries)
- Large datasets (1M+ rows) may require memory configuration: `NODE_OPTIONS="--max-old-space-size=4096" npm run sources`
- Requires writing SQL queries manually - no visual query builder

---

## 2. Visual-First Score: 2/10

### ❌ CODE-FIRST, NOT VISUAL-FIRST

Evidence does **NOT** open to dashboards or charts by default. Instead:

**Default experience:**
- Opens to a **tutorial markdown file** in browser
- You see **markdown + SQL code** that generates visualizations
- Must write SQL queries in `.sql` files
- Must write markdown files with embedded chart components
- Must code dashboard layouts manually

**Example workflow:**
```markdown
<!-- pages/sales-dashboard.md -->
# Sales Dashboard

```sql sales_data
SELECT date, revenue, customers
FROM transactions
WHERE date >= '2024-01-01'
```

<LineChart
  data={sales_data}
  x=date
  y=revenue
/>
```

**What this means:**
- Non-developers see code, not charts
- No drag-and-drop interface
- No point-and-click dashboard builder
- Must understand markdown syntax
- Must understand component syntax

---

## 3. Auto-Insights Capability: 1/10

### ❌ NO AUTO-INSIGHTS - 100% MANUAL

Evidence requires **completely manual setup**:

**What you must manually create:**
- SQL queries for each data view
- Dashboard page layouts in markdown
- Chart component configuration
- Data relationships and joins
- Filters and parameters

**No automatic features:**
- No auto-generated insights
- No AI-suggested visualizations
- No automatic pattern detection
- No smart defaults based on data types
- No "explore data" mode

**Intelligence features:**
- Smart chart type selection (Evidence chooses appropriate chart based on data schema)
- AI-assisted coding tools in browser IDE (for developers)

**Bottom line:** You must know exactly what you want to visualize and code it yourself.

---

## 4. Installation Complexity: 6/10

### ⚠️ MODERATE - Requires Developer Setup

**Prerequisites:**
- Node.js ≥18.13, 20, or 22
- NPM 7 or above
- Git
- VSCode (recommended) or command-line comfort

**Installation Steps:**

### Method 1: VSCode Extension (Easiest)
```bash
# 1. Install "Evidence" extension from VSCode Marketplace
# 2. Open Command Palette (Cmd/Ctrl + Shift + P)
# 3. Run: "Evidence: New Evidence Project"
# 4. Click "Start Evidence" in bottom status bar
# 5. Browser opens automatically to localhost:3000
```

**Time estimate:** 5-10 minutes (first time)

### Method 2: Command Line
```bash
# Installation via CLI
npx degit evidence-dev/template my-project
cd my-project
npm install
npm run sources
npm run dev
```

**Time estimate:** 10-15 minutes (including troubleshooting)

**Complexity factors:**
- ✅ Good documentation
- ✅ VSCode extension simplifies setup
- ❌ Requires Node.js/NPM knowledge
- ❌ Windows users may experience slower first setup (2+ minutes)
- ❌ Debugging connection issues requires technical skills
- ❌ No GUI installer

**Comparison:**
- Easier than: Setting up a custom Python/Dash app
- Harder than: Installing Metabase (one-click JAR file)
- Similar to: Modern web development frameworks

---

## 5. Non-Developer Friendly: 2/10

### ❌ NOT NON-DEVELOPER FRIENDLY

**Required skills:**
- ✅ **SQL** - Mandatory, no visual query builder
- ✅ **Markdown** - Basic syntax required
- ✅ **Component syntax** - Must understand Evidence's component API
- ⚠️ **Git** - Recommended for version control
- ⚠️ **Command line** - For running development server
- ⚠️ **Node.js/NPM** - For installation and dependencies

**What non-developers will struggle with:**

1. **Writing SQL queries**
   ```sql
   -- Must write queries like this manually
   SELECT
     DATE_TRUNC('month', order_date) as month,
     COUNT(*) as orders,
     SUM(revenue) as total_revenue
   FROM orders
   GROUP BY 1
   ORDER BY 1 DESC
   ```

2. **Coding dashboard layouts**
   ```markdown
   # Dashboard

   <Grid cols=2>
     <BarChart data={query1} x=category y=value />
     <LineChart data={query2} x=date y=revenue />
   </Grid>
   ```

3. **Managing source files**
   - Understanding folder structure (`/sources/`, `/pages/`)
   - Running build commands
   - Troubleshooting build errors

**Official stance:**
> "To use Evidence you need to know SQL. A knowledge of basic markdown syntax is also helpful."

**Comparison to non-developer tools:**
- **Metabase**: Visual query builder, drag-and-drop
- **Superset**: Mixed (has SQL mode AND visual builder)
- **Evidence**: Code-only, no visual interface

**Who Evidence is built for:**
- Data analysts who write SQL daily
- Developers building embedded analytics
- Teams using "analytics as code" workflows
- Organizations with version-controlled BI assets

---

## 6. Graph/Network Visualization: 3/10

### ⚠️ LIMITED - No Native Graph Support

**Available relationship visualizations:**

✅ **Sankey Diagram** (flow/process visualization)
```markdown
<SankeyDiagram
  data={flow_data}
  sourceCol=source
  targetCol=target
  valueCol=amount
/>
```

❌ **No native network graphs** (force-directed, node-link diagrams)

**Standard chart types:**
- Line, Bar, Area, Scatter, Bubble
- Heatmap, Calendar heatmap
- Histogram, Box plot
- Funnel chart
- Maps (AreaMap, PointMap, BubbleMap)
- Sparklines

**Workaround for network graphs:**
Evidence uses **ECharts** as its charting library, and ECharts DOES support network/graph visualizations. You could theoretically create custom network graphs using:

```markdown
<ECharts config={customNetworkConfig} />
```

**However:**
- Requires deep ECharts knowledge
- No Evidence documentation for this use case
- Manual configuration of nodes, edges, layout algorithms
- Not a first-class feature

**Recommendation:**
- If you need network visualizations → Use Neo4j Browser, Gephi, or graph-specific tools
- Evidence is better for: Traditional BI charts, dashboards, reports

---

## 7. Free & Local: 10/10

### ✅ YES - Fully Free and Local

**License:** MIT (permissive open source)

**Cost breakdown:**
- Core framework: **FREE** ✅
- All chart components: **FREE** ✅
- SQLite connector: **FREE** ✅
- Local development: **FREE** ✅
- Self-hosting: **FREE** ✅ (deploy to Netlify, Vercel, etc.)

**Optional paid services:**
- Evidence Cloud: Free tier available, paid plans for production hosting
- But self-hosting is completely free

**Offline capability:**
- ✅ Runs 100% locally on `localhost:3000`
- ✅ No internet required after installation
- ✅ All data stays on your machine
- ✅ No telemetry or tracking (open source)

**GitHub Stats:**
- 5.3k stars
- 10k weekly downloads
- Active development
- MIT licensed

**Comparison:**
- **Metabase**: Free open source edition, optional paid cloud
- **Evidence**: Same model (free core + optional paid hosting)
- **Tableau/Power BI**: Expensive licenses required

---

## Installation Steps (Detailed)

### For Developers:

```bash
# Method 1: VSCode Extension (Recommended)
1. Install "Evidence" extension in VSCode
2. Cmd/Ctrl + Shift + P → "Evidence: New Evidence Project"
3. Name your project
4. Click "Start Evidence" in status bar
5. Browser opens to localhost:3000

# Method 2: CLI
npx degit evidence-dev/template my-evidence-project
cd my-evidence-project
npm install
npm run dev
```

### Connecting SQLite:

```bash
# 1. Start dev server
npm run dev

# 2. Navigate to localhost:3000/settings
# 3. Select "SQLite" as data source
# 4. Configure connection:
#    - Database Path: /path/to/your/database.db
#    - Source Name: my_sqlite_db

# 5. Create query file: sources/my_sqlite_db/customers.sql
# Content:
SELECT * FROM customers LIMIT 100

# 6. Run source extraction
npm run sources

# 7. Use in markdown pages:
# pages/customers.md
```

### First Dashboard:

```markdown
---
title: Customer Dashboard
---

# Customer Analysis

```sql customer_stats
SELECT
  strftime('%Y-%m', created_at) as month,
  COUNT(*) as new_customers,
  SUM(total_spent) as revenue
FROM customers
GROUP BY 1
ORDER BY 1
```

<LineChart
  data={customer_stats}
  x=month
  y=new_customers
  title="Monthly New Customers"
/>

<BarChart
  data={customer_stats}
  x=month
  y=revenue
  title="Monthly Revenue"
/>
```

**Time to first dashboard:** 20-30 minutes (for developers with SQL knowledge)

---

## Pros & Cons for Non-Developers

### ❌ CONS (Major Blockers)

1. **Requires SQL skills** - No visual query builder
2. **Requires coding** - Markdown + component syntax
3. **No auto-insights** - Must manually design everything
4. **No GUI** - Everything is text files and code
5. **Developer tools** - Command line, Node.js, Git required
6. **Learning curve** - Must learn Evidence's component API
7. **No network graphs** - Limited to standard BI charts + Sankey
8. **Text-based workflow** - Editing `.md` files, not clicking buttons

### ✅ PROS (Nice-to-Haves)

1. **Beautiful output** - Publication-quality visualizations
2. **Fast performance** - Sub-second load times
3. **Version control** - Works great with Git
4. **Free & local** - No cloud dependencies or costs
5. **Responsive** - Works on all devices
6. **Extensible** - Can customize with custom components
7. **Full SQLite support** - First-class data source
8. **Active community** - Good documentation and Slack support

---

## Setup Time Estimate

**For developers:**
- First install: 10-15 minutes
- First dashboard: 20-30 minutes
- Production-ready: 2-4 hours

**For non-developers:**
- Learning SQL: Weeks to months
- Learning markdown: Days
- Learning Evidence components: Days
- First dashboard: **Not realistic without SQL knowledge**

---

## Overall Recommendation

### ❌ NO - Not Suitable for This Use Case

**Reasoning:**

Evidence.dev is a **developer tool** designed for "Business Intelligence as Code" workflows. While it produces beautiful, fast dashboards and has excellent SQLite support, it fundamentally requires:

1. SQL writing skills (mandatory)
2. Coding/scripting comfort (markdown, component syntax)
3. Developer tooling (Node.js, command line, Git)

**This makes it inappropriate for non-developers** who need:
- Point-and-click exploration
- Auto-generated insights
- Visual query builders
- No-code dashboard creation

### Alternative Recommendations for Non-Developers:

**If you need:**
- **Visual exploration** → Metabase, Superset
- **Network graphs** → Neo4j Browser, Gephi
- **Auto-insights** → Tableau, Power BI (commercial)
- **Simple SQLite viewer** → DB Browser for SQLite
- **Quick charts** → Datasette

**Evidence is perfect for:**
- Data analysts who write SQL
- Developers embedding analytics
- "Analytics as code" teams
- Version-controlled BI workflows

---

## Screenshots / Demo Links

**Official demos:**
- Main demo: https://evidence-demo.netlify.app
- BlueSky example: https://bluesky.evidence.app
- Example gallery: https://evidence.dev/examples

**What you'll see:**
- Beautiful, clean dashboard layouts
- Interactive charts and tables
- Professional typography and styling
- Fast, responsive performance

**What you WON'T see:**
- Visual query builder
- Drag-and-drop interface
- Point-and-click exploration
- Auto-generated insights

**To see the code behind demos:**
- GitHub repo: https://github.com/evidence-dev/demo

---

## Evaluation Summary

| Criterion | Score | Verdict |
|-----------|-------|---------|
| **SQLite compatibility** | ✅ YES | Full support via @evidence-dev/sqlite |
| **Visual-first score** | 2/10 | Code-first, not visual-first |
| **Auto-insights** | 1/10 | 100% manual setup required |
| **Installation complexity** | 6/10 | Moderate - requires Node.js/NPM |
| **Non-developer friendly** | 2/10 | Requires SQL + coding skills |
| **Graph/network viz** | 3/10 | Only Sankey, no network graphs |
| **Free & local** | 10/10 | MIT license, fully offline capable |

**Overall: NOT RECOMMENDED for non-developer use case**

---

## Final Verdict

Evidence.dev is an **excellent tool** - just not for this use case. It's:

✅ **Great for:**
- Teams that write SQL daily
- Developers building embedded analytics
- Organizations using Git workflows
- Projects requiring version-controlled BI

❌ **Wrong for:**
- Non-technical users needing data exploration
- Users wanting auto-generated insights
- Teams needing visual query builders
- Use cases requiring network graph visualization

**For non-developer SQLite visualization, continue evaluating:**
- Metabase (visual query builder)
- Apache Superset (mixed approach)
- Datasette (simple exploration)
- DB Browser for SQLite (basic viewer)

---

**Research conducted by**: Claude Code Research Agent
**Session**: session-20251116-195139-db-visualization-tools
**Next steps**: Evaluate alternative tools from the shortlist
