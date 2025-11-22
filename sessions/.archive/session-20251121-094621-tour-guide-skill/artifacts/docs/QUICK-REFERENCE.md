# Tour-Guide Quick Reference Card

**One-Page Guide to Navigating the Claude-Flow+ Workspace**

---

## 🚀 Getting Started

```bash
# Invoke the tour
Skill { skill: "tour-guide" }

# Or mention tour-guide in conversation
"I'd like to take the workspace tour"
```

**What You'll Get:**
1. Proficiency assessment menu (4 levels)
2. Personalized tour pathway
3. Interactive navigation through 10+ sections
4. Hands-on examples and checkpoints

**Estimated Time:** 30-70 minutes (varies by level)

---

## 📋 Top 10 Navigation Commands

| Command | Purpose | Example |
|---------|---------|---------|
| `/tour` | Start or resume tour | `/tour` |
| `/tour next` | Go to next section | `/tour next` |
| `/tour back` | Return to previous section | `/tour back` |
| `/tour skip [section]` | Jump to specific section | `/tour skip memory` |
| `/tour jump [level]` | Switch proficiency level | `/tour jump advanced` |
| `/tour status` | Show current progress | `/tour status` |
| `/tour list` | View all sections | `/tour list` |
| `/tour bookmark [name]` | Save your position | `/tour bookmark memory-done` |
| `/tour reset` | Restart from beginning | `/tour reset` |
| `/tour help` | Get detailed help | `/tour help` |

---

## 🎯 Proficiency Levels

| Level | Experience | Duration | Focus Areas |
|-------|-----------|----------|-------------|
| **Beginner** | New to AI orchestration | ~30 min | Basics, file routing, simple agents |
| **Intermediate** | Some Claude/AI experience | ~50 min | Sessions, memory, coordination |
| **Advanced** | Multi-agent workflows | ~70 min | Swarms, hooks, neural features |
| **Expert** | System architecture | ~70 min | Advanced patterns, optimization |

**Switching Levels:** Use `/tour jump [level]` anytime to change pathway.

---

## 🔧 Common Tasks & Solutions

| Task | Solution |
|------|----------|
| "How do I save my progress?" | `/tour bookmark [name]` - Bookmarks auto-save position |
| "How do I switch levels?" | `/tour jump [level]` - Changes difficulty pathway |
| "Where am I in the tour?" | `/tour status` - Shows section, progress, time |
| "How do I restart?" | `/tour reset` - Clears progress and starts over |
| "Can I skip ahead?" | `/tour skip [section]` - Jumps to any section |
| "What sections are available?" | `/tour list` - Shows all 10+ sections |
| "How do I pause?" | Just stop - progress auto-saves via `/tour status` |
| "How do I resume later?" | `/tour` - Picks up where you left off |

---

## 📚 Tour Sections Overview

### Core Sections (All Levels)
1. **Introduction** - Workspace overview and architecture
2. **File Routing** - Where files go and why
3. **Session Management** - Creating and managing sessions
4. **Agent Basics** - Spawning and coordinating agents
5. **Memory System** - Cross-agent communication

### Intermediate+ Sections
6. **Swarm Coordination** - Multi-agent patterns
7. **Hooks System** - Automation and workflows
8. **MCP Tools** - Advanced coordination tools

### Advanced+ Sections
9. **Neural Features** - AI training and patterns
10. **Production Workflows** - Real-world patterns
11. **Performance Optimization** - Scaling and efficiency

---

## 💡 Pro Tips

1. **Use Status Frequently:** `/tour status` shows exactly where you are and what's next
2. **Bookmark Key Moments:** `/tour bookmark` before trying examples - easy to return if something breaks
3. **Jump Freely:** Don't feel locked in - `/tour jump` to change levels anytime
4. **Try Examples:** Each section has hands-on exercises - actual learning happens there
5. **Check Prerequisites:** `/tour list` shows what you need for each section

---

## 🔗 Related Skills

| Skill | When to Use | How to Access |
|-------|-------------|---------------|
| **tutor-mode** | Practice concepts with guidance | `Skill { skill: "tutor-mode" }` |
| **meta-skill** | Discover all available skills | `Skill { skill: "meta-skill" }` |
| **swarm-orchestration** | Deploy multi-agent workflows | `Skill { skill: "swarm-orchestration" }` |
| **hive-mind-advanced** | Complex queen-led coordination | `Skill { skill: "hive-mind-advanced" }` |

---

## 🎓 Learning Path

```
tour-guide (orientation)
  → tutor-mode (practice)
    → swarm-orchestration (simple multi-agent)
      → hive-mind-advanced (complex coordination)
```

---

## ⚡ Quick Decision Tree

**"I'm new to Claude-Flow+"**
→ Start with `/tour` at **Beginner** level

**"I've used Claude but not multi-agent"**
→ Start at **Intermediate** level

**"I've built swarms before"**
→ Jump to **Advanced** level

**"I'm architecting a system"**
→ Start at **Expert** level

**"I'm stuck on a specific concept"**
→ Use `/tour skip [section]` to jump directly

**"I need hands-on practice"**
→ Complete tour, then use **tutor-mode** skill

---

## 📞 Getting Help

- **During Tour:** `/tour help` - Context-specific guidance
- **General Questions:** Ask in conversation after invoking tour-guide
- **Stuck?** `/tour status` to see where you are, `/tour back` to review
- **Want to restart?** `/tour reset` clears everything

---

## ✅ Success Checklist

- [ ] Completed intake menu and selected level
- [ ] Navigated through at least 5 sections
- [ ] Tried `/tour status` to check progress
- [ ] Used `/tour bookmark` to save position
- [ ] Completed at least one hands-on example
- [ ] Know where to find documentation (`docs/`)
- [ ] Ready to spawn your first agent

**After Tour:** You're ready for production work! Check `/tour status` for completion time and consider exploring related skills.

---

*Tour-Guide Skill v1.0 | Part of Claude-Flow+ Extended Workspace*
