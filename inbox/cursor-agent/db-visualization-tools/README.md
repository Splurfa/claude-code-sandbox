# Visual Database Visualization Tools

**Created**: 2025-11-16  
**Purpose**: User-friendly visual alternatives to DB Browser for SQLite  
**Focus**: Graph/network visualization similar to Obsidian's graph view

---

## 📦 What's Included

This folder contains documentation and tools for visually exploring your agentDB and ReasoningBank memory databases.

### 🎯 Quick Start

**For immediate visual exploration**: [QUICK-VISUAL-SETUP.md](QUICK-VISUAL-SETUP.md)
- 2-minute setup guide
- Modern web interface
- Graph visualization
- Interactive charts

**For complete alternatives guide**: [VISUAL-GRAPH-ALTERNATIVES.md](VISUAL-GRAPH-ALTERNATIVES.md)
- Detailed comparison of visual tools
- Custom graph viewer setup
- Multiple options explained

**For automated setup**: [setup-visual-db-viewer.sh](setup-visual-db-viewer.sh)
- One-command installation
- Runs Datasette with all your databases
- Opens browser automatically

---

## 🏆 Top Recommendation: Datasette

**Why Datasette?**
- ✅ Modern web interface (like Obsidian)
- ✅ Graph visualization of relationships
- ✅ Interactive charts and timelines
- ✅ User-friendly for non-developers
- ✅ Install via terminal: `pip install datasette`

**Quick Install**:
```bash
pip3 install --user datasette datasette-vega datasette-plot
datasette .swarm/memory.db .agentdb/reasoningbank.db --open
```

---

## 📚 Files

1. **QUICK-VISUAL-SETUP.md** - Quick start guide (read this first!)
2. **VISUAL-GRAPH-ALTERNATIVES.md** - Complete alternatives guide
3. **setup-visual-db-viewer.sh** - Automated setup script
4. **README.md** - This file

---

## 🚀 Next Steps

1. Read [QUICK-VISUAL-SETUP.md](QUICK-VISUAL-SETUP.md)
2. Run the setup script or install manually
3. Explore your databases visually!

---

**Ready to explore your AI memory visually!** 🎨

