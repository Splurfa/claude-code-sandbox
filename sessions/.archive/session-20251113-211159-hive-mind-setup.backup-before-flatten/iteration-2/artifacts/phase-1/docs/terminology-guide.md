# Plain English Terminology Guide

> For humans who don't speak developer. 🗣️

---

## Freezing the Folder

**What it means:** Making a folder read-only so nothing can be changed or added to it.

**Why we do it:** When you finish a work session, you "freeze" that session's folder to preserve it exactly as it was. Think of it like sealing an envelope - the contents are protected and can't be accidentally modified later.

**What actually happens:**
- The folder becomes a permanent snapshot of your work
- Files inside can still be read and copied
- But they can't be edited, deleted, or moved
- This prevents accidental changes to historical records

**Real-world analogy:** It's like putting photos in a photo album. The originals are sealed in plastic sleeves - you can look at them anytime, make copies if needed, but you can't accidentally spill coffee on them or write on them.

---

## Session Persistence

**What it means:** Keeping track of your work so you can pick up where you left off, even days or weeks later.

**Why it matters:** Imagine working on a puzzle. Session persistence is like having a puzzle mat that you can roll up and store - when you come back, all the pieces are exactly where you left them.

**What's actually saved:**
- What tasks you were working on
- Decisions you made and why
- What files you created or changed
- Problems you ran into and solved
- Context about what you were trying to accomplish

**Without it:** Every time you start working, you'd have to remember or rediscover everything from scratch. With it, you can jump right back in.

---

## Hook Integration

**What it means:** Automatic helpers that run before and after you do certain tasks, like having a personal assistant who sets up your workspace and cleans up afterward.

**Examples of what hooks do:**
- **Before you start:** Check what you were working on last time, load relevant notes
- **During work:** Save your progress automatically, organize files as you create them
- **After you finish:** Create a summary, backup your work, record what you learned

**Real-world analogy:** Like having a sous chef in the kitchen who:
- **Pre-hook:** Gets ingredients ready before you cook
- **During:** Cleans up as you go, keeps things organized
- **Post-hook:** Packages leftovers, writes down what worked well for next time

**Why "integration"?** Because these helpers are woven into your workflow automatically - you don't have to remember to run them, they just happen.

---

## Memory Namespace

**What it means:** Organized storage compartments for different types of information, like having labeled boxes in your attic.

**Why we need it:** Without organization, finding anything would be chaos. Namespaces keep related information together.

**Examples:**
- `hive/phase-1/` - Everything about Phase 1 work
- `swarm/coordination/` - How different agents work together
- `session/current/` - What's happening right now
- `projects/myapp/` - All information about a specific project

**Real-world analogy:** Think of it like organizing a filing cabinet:
- One drawer for taxes (namespace: `finances/taxes/`)
- One drawer for medical records (namespace: `health/medical/`)
- One drawer for recipes (namespace: `kitchen/recipes/`)

You can find things quickly because you know which drawer (namespace) to look in.

---

## Coordination Topology

**What it means:** The pattern of how multiple workers communicate and organize themselves to get work done together.

**Different patterns:**

### Hierarchical (Tree-like)
- One boss, several managers, many workers
- Information flows up and down the chain
- Good for: Clear authority, organized structure
- Example: Traditional company org chart

### Mesh (Everyone talks to everyone)
- No boss, all workers are peers
- Everyone can communicate directly with anyone
- Good for: Flexible collaboration, fast decisions
- Example: Group chat where everyone can respond

### Ring (Pass it along)
- Workers arranged in a circle
- Each worker talks to their neighbors
- Information travels around the ring
- Good for: Sequential processing, ordered tasks
- Example: Assembly line where each station adds something

### Star (Central hub)
- One central coordinator
- All workers report to/receive from the center
- Good for: Centralized control, consistency
- Example: Restaurant kitchen with one head chef coordinating everything

**Why it matters:** Different work requires different organization. Building a house needs hierarchy (architect → foreman → workers). Brainstorming ideas works better as a mesh (everyone contributes freely).

---

## Session Closeout

**What it means:** The end-of-day ritual where you wrap up your work session properly before stopping.

**Steps in plain English:**
1. **Collect** - Gather up everything you created (code, notes, decisions)
2. **Summarize** - Write a brief "what I did today" summary
3. **Review** - You check the summary and approve it
4. **Archive** - Save everything in a permanent backup
5. **Freeze** - Lock the folder so it can't be changed

**Why do this:** So when you come back (tomorrow, next week, next month), you can quickly understand what you did and why. It's like leaving a note for your future self.

**Real-world analogy:** Like closing a restaurant at end of day:
- Count the register (collect data)
- Note what sold well and what didn't (summarize)
- Manager reviews the day (approval)
- Deposit money in safe (archive)
- Lock the doors (freeze)

---

## Agent Spawning

**What it means:** Creating specialized workers (agents) to handle specific tasks.

**Plain English:** You need to build a house. Instead of doing everything yourself, you "spawn" (hire):
- A plumber agent to handle water
- An electrician agent for wiring
- A carpenter agent for framing
- A painter agent for finishing

Each "agent" is a specialized worker that knows how to do their specific job.

**In the system:**
- You tell the system what needs doing
- It creates the right type of agent for each task
- Agents work in parallel (all at the same time)
- They coordinate with each other automatically

**Why "spawning"?** Because these workers are created on-demand when needed, like spawning characters in a video game.

---

## Memory Store vs Captain's Log

**Two different ways to save information:**

### Memory Store (Structured Database)
- **What:** Like a filing cabinet with labeled folders
- **Format:** Organized data that computers can search easily
- **Use for:** Facts, metrics, technical details
- **Example:** "Task #47 took 23 minutes, used 3 agents, created 5 files"

### Captain's Log (Human-readable Journal)
- **What:** Like a diary or ship's log
- **Format:** Written in sentences, tells a story
- **Use for:** Decisions, reasoning, insights, context
- **Example:** "We chose approach B instead of A because the user mentioned they needed mobile support later. This will save refactoring time."

**Why both?**
- Computers read the Memory Store to coordinate work
- Humans read the Captain's Log to understand why decisions were made
- Together they give complete context

**Real-world analogy:**
- Memory Store = Spreadsheet of expenses (exact amounts, dates, categories)
- Captain's Log = Your diary about why you spent the money and what you learned

---

## Quick Reference Table

| Term | One-Sentence Definition | Why It Matters |
|------|------------------------|----------------|
| **Freezing** | Making a folder read-only | Protects historical work from accidental changes |
| **Session Persistence** | Saving your work state | Pick up where you left off later |
| **Hook Integration** | Automatic helpers | Reduces manual work, maintains consistency |
| **Memory Namespace** | Organized storage compartments | Find information quickly |
| **Coordination Topology** | How workers organize | Different work needs different organization |
| **Session Closeout** | End-of-session ritual | Leaves clear record for future you |
| **Agent Spawning** | Creating specialized workers | Parallel work on different tasks |
| **Memory Store** | Structured database | Machine-readable facts and metrics |
| **Captain's Log** | Human-readable journal | Context and reasoning for decisions |

---

## Common Questions

### "Do I have to understand how this works internally?"
No. You just need to know what it does and when to use it. Like driving a car - you don't need to understand the engine to use the gas pedal.

### "What if I forget to run a hook?"
The system has automatic hooks that run for you. It's designed so you can't easily forget the important stuff.

### "Can I change a frozen folder if I really need to?"
Yes, but you'd need to explicitly "unfreeze" it first. The protection is there to prevent accidents, not to make your life harder.

### "How much of this do I need to know?"
Just enough to understand what the system is doing and why. The technical details are handled automatically.

---

## Still Confused?

If any term still doesn't make sense, that's our fault, not yours. Good documentation should be crystal clear. Please ask for clarification and we'll update this guide.

**Remember:** There are no stupid questions, only unclear explanations.
