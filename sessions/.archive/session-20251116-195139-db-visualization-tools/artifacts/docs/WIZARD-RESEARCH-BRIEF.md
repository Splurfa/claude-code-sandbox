# Research Brief for Hive-Mind Wizard

## 🎯 Objective

Find existing, production-ready tools/plugins/repos that provide visual database exploration for SQLite databases with these specific requirements.

## 📋 Requirements

### Must Have
- ✅ **Visual by default** - Opens to graphs/charts, not tables
- ✅ **Auto-insight generation** - Shows interesting patterns automatically
- ✅ **Free & local** - No cloud, no subscriptions
- ✅ **Works with SQLite** - Our databases are .db files
- ✅ **Non-developer friendly** - Point-and-click, no SQL required
- ✅ **Graph/network visualization** - Like Obsidian's graph view for relationships

### Nice to Have
- ⭐ **Dashboard interface** - Not database tool aesthetic
- ⭐ **Pre-built for analytics** - Not general-purpose database browser
- ⭐ **Pattern detection** - Automatically finds trends
- ⭐ **Timeline views** - Temporal data visualization
- ⭐ **Interactive exploration** - Click to drill down

### Deal Breakers
- ❌ Requires writing SQL queries
- ❌ Cloud/SaaS only solutions
- ❌ Paid software
- ❌ Opens to raw table views
- ❌ Complex setup requiring coding

## 💾 Our Data

### Databases to Visualize
1. `.swarm/memory.db` - 75 MB, 45,563 entries, 8 tables
2. `.agentdb/reasoningbank.db` - 376 KB, 33 tables
3. `.hive-mind/hive.db` - 224 KB
4. `.hive-mind/memory.db` - 16 KB

### Key Data Patterns to Visualize
- Memory entries by namespace (19 categories)
- Pattern learning over time
- Agent coordination patterns
- Task success/failure rates
- Causal relationships in ReasoningBank
- Hook execution patterns

## 🔍 Search Areas

### GitHub Repositories
- SQLite visualization tools
- Database dashboard generators
- Analytics platforms for local data
- Graph visualization for databases
- AI/ML model inspection tools (they often have good viz)

### Existing Solutions to Research
- **Redash** (open source analytics)
- **Metabase** (open source BI)
- **Apache Superset** (data visualization)
- **Evidence.dev** (SQL + markdown dashboards)
- **Grafana** (with SQLite plugin)
- **Jupyter + SQLite extensions**
- **Observable** (notebooks with viz)
- **Streamlit** (if there's SQLite dashboard templates)

### Plugin Ecosystems
- Datasette plugins (we have it, find better plugins)
- Jupyter Lab extensions
- VS Code extensions with visualization
- Chrome extensions for SQLite

### Specialized Tools
- Graph database viewers (might work with SQLite)
- Knowledge graph visualizers
- Network analysis tools
- Time series visualization tools

## 📊 What We've Tried

### DB Browser for SQLite ❌
- Too database-y
- Manual query writing
- Not visual enough

### Datasette ⚠️
- Installed but requires clicking "visualize"
- Opens to tables, not insights
- Too much navigation required
- Feels like database tool, not dashboard

## 🎯 Success Criteria

The right solution:
1. **Opens to visuals** - Not tables, not query editors
2. **Auto-generates insights** - "Here's what's interesting"
3. **Graph view available** - Pattern/relationship networks
4. **Zero setup** - Install → point at .db files → see insights
5. **Dashboard aesthetic** - Modern, clean, not database-y

## 📝 Research Tasks for Wizard

### Research Agents Should:

1. **Search GitHub** for:
   - "SQLite dashboard"
   - "SQLite analytics"
   - "SQLite visualization"
   - "database insights"
   - "automatic insights sqlite"
   - "graph database visualizer"

2. **Check Existing Platforms**:
   - Metabase SQLite support
   - Redash SQLite capabilities
   - Superset SQLite integration
   - Evidence.dev local mode
   - Grafana SQLite datasource

3. **Find Specialized Tools**:
   - AI model visualization tools
   - Knowledge graph explorers
   - Network analysis platforms
   - Time series dashboards

4. **Evaluate**:
   - Installation complexity
   - Visual-first approach
   - Auto-insight capabilities
   - User reviews from non-developers
   - Active maintenance

### Deliverables

For each viable option, provide:
- **Name** and GitHub/website link
- **Installation** complexity (1-10, 1=easiest)
- **Visual-first** score (1-10, 10=dashboard, 1=tables)
- **Auto-insights** capability (yes/no/partial)
- **Screenshots** or demo links
- **Pros/cons** for non-developer use
- **Setup time** estimate

### Final Recommendation

Rank top 3 options with:
- Why it fits requirements
- Installation steps
- Expected user experience
- Screenshots if available

## 🚀 Context for Wizard

**User Profile:**
- Non-developer
- Visual/spatial thinker
- Wants insights surfaced automatically
- Frustrated by database tools
- Needs "dashboard that thinks" not "database viewer"

**Current State:**
- Has 6 SQLite databases ready
- 45,563+ memory entries to explore
- Pattern relationships to visualize
- Learning data to analyze

**End Goal:**
- Open tool → See visual insights immediately
- Click around → Explore deeper visually
- No SQL, no queries, no database knowledge needed
- Obsidian-like graph views for relationships

## 💡 Bonus Points

If you find:
- Tools specifically for AI/ML data visualization
- ReasoningBank-specific visualizers
- Vector database visualization tools
- AgentDB visualization utilities
- Claude/LLM memory visualization tools

These might be perfect since our data is from AI agent systems!

---

**Ready for wizard initialization.**
