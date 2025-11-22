# Beginner Pathway Tour Script

**Target Audience**: Complete beginners to AI agents and Claude Code
**Duration**: 30-35 minutes
**Prerequisites**: None (assumes zero prior knowledge)
**Tour Version**: 1.0.0

---

## Section 1: Welcome to Your Workspace Tour

**Duration**: ~5 minutes
**Goal**: Orient you to what this workspace is and what you'll learn

---

### Welcome! 👋

Hello and welcome to your workspace tour! If you're reading this, you've just opened a special development environment called "common-thread-sandbox." Don't worry if those words sound technical—by the end of this tour, you'll understand exactly what everything means.

**First, the most important thing: You don't need to know anything about programming or AI to start this tour.** We'll explain everything from the ground up using simple, everyday language.

### What Is This Workspace?

Think of this workspace like a **workshop for building things with AI assistants**. Just like a carpenter has a workshop with tools, workbenches, and organized storage, this workspace gives you:

- **A place to organize your projects** (we call these "sessions")
- **AI assistants who help you** (we call these "agents")
- **Tools to coordinate multiple helpers** (we call this "coordination")
- **A system to keep everything organized** (we call this "file routing")

If you were building a house, you'd have different specialists: an architect to design it, carpenters to build it, electricians for wiring, and inspectors to check quality. This workspace lets you work with AI specialists in exactly the same way.

### What Is Claude Code?

**Claude Code** is the AI assistant you're talking to right now. Think of Claude Code as your project manager who:

- Understands what you want to build
- Knows how to break big tasks into smaller steps
- Can coordinate other AI specialists to help
- Keeps track of all the work being done

When you ask Claude Code to do something, it can either do the work itself OR bring in specialized AI helpers (agents) who are experts at specific tasks.

### What Will You Learn in This Tour?

By the end of this 30-35 minute tour, you'll understand:

1. **Sessions** - How to create organized workspaces for different projects
2. **Agents** - How to ask AI specialists to help with your work
3. **Coordination** - How multiple AI helpers work together
4. **File Organization** - Where all your files get saved
5. **Getting Help** - Where to find more information when you need it

**Important**: This tour is **"show, don't do"** - we're going to *explain* how things work, but we won't actually start any projects or create any files. Think of this like a guided museum tour: we're looking at exhibits, not building our own museum.

### Why Does This Matter?

Traditional programming requires you to write every single line of code yourself. With this workspace, you can:

- **Describe what you want** in plain English
- **Let AI specialists do the technical work**
- **Focus on the creative parts** (what you want to build)
- **Learn as you go** (the AI can explain what it's doing)

This is like having a team of experts available 24/7 who never get tired and are always ready to help.

### What Makes This Workspace Special?

You might be wondering: "Can't I just talk to any AI assistant?" Yes, but this workspace adds something important: **organization and coordination**.

Without this workspace:
- Work gets scattered across conversations
- AI can't easily collaborate with other AI
- You lose context when you start a new chat
- Files end up all over the place

With this workspace:
- Every project has its own organized folder
- Multiple AI specialists can work together
- Work is automatically saved and organized
- You can pick up where you left off

### Tour Duration & Navigation

**Total time**: 30-35 minutes
**Format**: 5 sections (you're in Section 1 now)

**Navigation commands** (you'll learn these as we go):
- `/tour next` - Move to the next section
- `/tour back` - Go back to the previous section
- `/tour status` - See where you are in the tour
- `/tour help` - Get help with commands

Don't worry about memorizing these now—we'll remind you at the end of each section.

### What We'll Explore

Here's what's coming in the next sections:

**Section 2: Understanding Sessions** (~6 minutes)
- What is a session and why they matter
- How sessions keep your work organized
- Where files are saved

**Section 3: Your First Agent** (~7 minutes)
- What agents are and how they help
- How to ask an agent for help
- What happens when an agent works

**Section 4: Working with Multiple Agents** (~8 minutes)
- Why use multiple agents
- How agents share information
- Example of agents working together

**Section 5: Getting Help & Next Steps** (~4 minutes)
- Where to find documentation
- What to explore next
- How to continue learning

### Ready to Begin?

Take a moment to think about this question (no wrong answers!):

**"What would you like to build with AI assistance?"**

Maybe it's:
- A simple calculator program
- A website for your hobby
- A tool to organize your files
- Something creative you've imagined
- Just learning how it all works

You don't need to answer out loud—just thinking about it will help you understand how this workspace could help you.

---

### 🚀 Ready for Section 2?

When you're ready to learn about **sessions** (how to organize your projects), continue to the next section.

**Navigation**:
- `/tour next` - Continue to "Understanding Sessions"
- `/tour status` - See your progress
- `/tour help` - Command reference

---

## Section 2: Understanding Sessions

**Duration**: ~6 minutes
**Goal**: Understand how sessions organize your work

---

### What Is a Session? 🗂️

Let's start with a simple comparison you already understand:

**A session is like a project folder on your computer.**

Just like you might have folders called "Vacation Photos 2024" or "Tax Documents 2025," a session is a folder where all the work for ONE project lives.

Here's the key difference: In this workspace, sessions have special powers:
- They're **automatically created** when you start a project
- They have **organized subfolders** for different types of files
- They work with **AI agents** who know where to save things
- They can be **neatly archived** when you're done

### Why Do We Need Sessions?

Imagine you're working on three different projects:
1. Building a calculator app
2. Creating a todo list
3. Making a simple game

**Without sessions**: All the files would be mixed together in one big folder. You'd have:
```
calculator-code.js
todo-list-code.js
game-code.js
calculator-test.js
todo-list-test.js
game-test.js
documentation-1.md
documentation-2.md
documentation-3.md
```

Which documentation goes with which project? Which test file tests which code? It gets messy fast!

**With sessions**: Each project has its own organized space:
```
session-calculator-app/
  ├── code/           (calculator code lives here)
  ├── tests/          (calculator tests live here)
  └── docs/           (calculator docs live here)

session-todo-list/
  ├── code/           (todo list code lives here)
  ├── tests/          (todo list tests live here)
  └── docs/           (todo list docs live here)

session-game/
  ├── code/           (game code lives here)
  ├── tests/          (game tests live here)
  └── docs/           (game docs live here)
```

Everything related to one project stays together. Clean and organized!

### Session Lifecycle (The Life Story of a Session)

Every session goes through these stages:

**1. Birth** - You start a new session
- You say: "I want to start a project"
- A new session folder is created
- It gets a unique name with a timestamp

**2. Active Work** - You and your AI helpers do work
- You create files
- AI agents create files
- Everything goes into the right subfolders automatically

**3. Completion** - The project is finished
- You review what was accomplished
- The system creates a summary
- Everything is neatly packaged

**4. Archive** - The session is stored away
- The work is backed up
- The session folder can be cleaned up
- You can always look back at what was done

### How Sessions Get Their Names

Session names follow a simple pattern:

```
session-[DATE]-[TIME]-[TOPIC]
```

**Example**: `session-20251121-143000-calculator-app`

Let's break this down:
- `session-` - This is always the same (tells the system it's a session)
- `20251121` - The date (November 21, 2025)
- `143000` - The time (2:30 PM and 0 seconds)
- `calculator-app` - What you're working on (the topic)

**Why timestamps?** Because if you work on two calculator apps on different days, they'll have different names and won't conflict. It's like having "Vacation Photos - Summer 2024" and "Vacation Photos - Winter 2024" as separate folders.

### Inside a Session: The Artifacts Folder

Every session has a special folder called `artifacts/` where all the actual work goes. Inside artifacts, you have subfolders:

**code/** - Where all your program files live
- Example: `calculator.js`, `app.py`, `game.html`
- This is the "real work"—the programs you're building

**tests/** - Where test files live
- Example: `calculator.test.js`, `app_test.py`
- Tests check that your code works correctly

**docs/** - Where documentation lives
- Example: `how-it-works.md`, `user-guide.md`
- Explains what you built and how to use it

**scripts/** - Where automation scripts live
- Example: `deploy.sh`, `setup.py`
- Little programs that help you do repetitive tasks

**notes/** - Where working notes live
- Example: `ideas.md`, `todo.txt`
- Your scratch paper and planning notes

### A Simple Example

Let's walk through creating a calculator app (don't worry, we're not actually doing this—just explaining how it would work):

**Step 1: Starting the session**
```
You say: "I want to create a calculator app"
System creates: sessions/session-20251121-143000-calculator-app/
```

**Step 2: Working in the session**
```
An AI agent writes calculator code
It gets saved to: sessions/.../artifacts/code/calculator.js

Another agent writes tests
They get saved to: sessions/.../artifacts/tests/calculator.test.js

You write notes about what you want
They go to: sessions/.../artifacts/notes/requirements.md
```

**Step 3: Finishing the session**
```
You say: "I'm done with the calculator"
System creates: A summary of what was built
System archives: Everything to a backup location
Result: Clean workspace, but your work is safely stored
```

### The Golden Rule of Sessions

Here's the most important thing to remember:

**🌟 One session = one project or task 🌟**

Don't create a new session for every tiny thing. If you're building a calculator, the whole calculator project is one session—even if it takes multiple days.

Do create a new session when you start something completely different, like switching from "calculator app" to "todo list app."

### Where Session Files Live

When you look at the workspace folder structure, sessions live here:

```
common-thread-sandbox/              (the main workspace folder)
└── sessions/                       (all sessions go here)
    ├── session-20251121-143000-calculator-app/
    ├── session-20251121-150000-todo-list/
    └── session-20251121-160000-game/
```

The session folder is like a neighborhood, and each individual session is like a house in that neighborhood.

### What About Files NOT in Sessions?

Good question! Some files live at the "root" (main workspace level):

**Files that stay at the root:**
- `CLAUDE.md` - The main configuration file (the "rules" for the workspace)
- `package.json` - Technical configuration for programming tools
- `README.md` - Description of the workspace

**The rule**: If it's configuration or documentation ABOUT the workspace itself, it lives at the root. If it's work you're DOING, it lives in a session.

### Quick Understanding Check

Let's make sure this makes sense. Imagine you're working on these tasks:

1. **Building a recipe website**
   - Would this be one session? → **Yes!** (one project)
   - What would the code go? → `sessions/session-[timestamp]-recipe-site/artifacts/code/`

2. **Building three different websites**
   - Would these be one session? → **No!** (three different projects)
   - How many sessions? → **Three sessions** (one for each website)

3. **Taking notes about website ideas**
   - Would this be a session? → **Maybe!** (Depends if it's prep work for a specific project)
   - Where would notes go? → `sessions/session-[timestamp]-planning/artifacts/notes/`

### Why Sessions Are Powerful

Sessions give you three superpowers:

1. **Organization** - Everything related stays together
2. **Isolation** - Different projects don't interfere with each other
3. **Cleanup** - Easy to archive completed work

Without sessions, your workspace would be like a desk covered in papers from 20 different projects. With sessions, it's like having a filing cabinet where each drawer is one project.

---

### 🚀 Ready for Section 3?

You now understand what sessions are and why they keep work organized. Next, we'll learn about **agents**—the AI specialists who do the actual work inside your sessions.

**Navigation**:
- `/tour next` - Continue to "Your First Agent"
- `/tour back` - Return to "Welcome"
- `/tour status` - See your progress

---

## Section 3: Your First Agent

**Duration**: ~7 minutes
**Goal**: Understand what agents are and how to work with them

---

### What Is an Agent? 🤖

An **agent** is a specialized AI assistant that does a specific kind of work.

Think of agents like specialists at a hospital:
- A **cardiologist** specializes in hearts
- A **pediatrician** specializes in children
- A **surgeon** specializes in operations
- A **radiologist** specializes in X-rays

In this workspace, agents are similar:
- A **coder agent** specializes in writing programs
- A **tester agent** specializes in checking if code works
- A **reviewer agent** specializes in checking quality
- A **researcher agent** specializes in finding information

**Key point**: You don't need to BE a specialist yourself. You just need to know which specialist to ask for help!

### Why Use Agents Instead of One General AI?

You might wonder: "Why not just have one super-smart AI that does everything?"

Great question! Here's why specialists are better:

**Scenario: Building a calculator app**

With one general AI:
- It tries to do everything at once
- It might be good at coding but weak at testing
- You have to explain everything in detail
- It's doing too many jobs at the same time

With specialized agents:
- **Coder agent** focuses ONLY on writing good code
- **Tester agent** focuses ONLY on thorough testing
- **Reviewer agent** focuses ONLY on quality checks
- Each one is an expert at their job

It's like going to specialists instead of trying to find one doctor who does everything.

### Meet the Core Agents

Let's introduce you to the five most common agents you'll work with:

#### 1. Researcher Agent 🔍

**What it does**: Finds information and best practices

**Example task**: "What's the best way to build a login system?"

**What it delivers**:
- Research findings
- Best practices
- Recommendations
- Links to documentation

**Think of it as**: A librarian who knows where everything is

---

#### 2. Coder Agent 💻

**What it does**: Writes actual program code

**Example task**: "Create a function that adds two numbers"

**What it delivers**:
- Working code files
- Comments explaining the code
- Basic error handling

**Think of it as**: A programmer who writes the code

---

#### 3. Tester Agent 🧪

**What it does**: Creates tests to check if code works

**Example task**: "Write tests for the calculator function"

**What it delivers**:
- Test files
- Different test scenarios
- Instructions for running tests

**Think of it as**: A quality control inspector

---

#### 4. Reviewer Agent ✅

**What it does**: Reviews code for quality and security

**Example task**: "Check if this code is secure"

**What it delivers**:
- Review report
- List of issues found
- Suggestions for improvements

**Think of it as**: A code inspector checking building permits

---

#### 5. Planner Agent 📋

**What it does**: Breaks big tasks into smaller steps

**Example task**: "Plan how to build a blog website"

**What it delivers**:
- Step-by-step plan
- Timeline estimates
- Resource requirements

**Think of it as**: A project manager making a plan

---

### How to Ask an Agent for Help

Here's the simple process (remember, we're explaining, not doing):

**Step 1: You describe what you need**
```
"I need a Python script that sorts a list of numbers"
```

**Step 2: Behind the scenes, the right agent is chosen**
```
System thinks: "This is a coding task, so I'll use the coder agent"
```

**Step 3: The agent does the work**
```
Coder agent:
- Writes the Python code
- Adds helpful comments
- Tests it quickly
- Saves it to your session
```

**Step 4: The agent reports back**
```
"I've created sort_numbers.py in your session's code folder.
 It can sort numbers in ascending or descending order.
 Would you like me to add more features?"
```

### What Agents Know Automatically

When an agent starts working, it already knows:

- **Where to save files** (in your active session's artifacts folder)
- **What you're working on** (the session topic)
- **What other agents have done** (through shared memory)
- **The workspace rules** (from configuration files)

You don't need to explain all of this! Just describe WHAT you want, and the agent handles the HOW.

### A Real Example Walkthrough

Let's walk through a complete example. You want to create a simple temperature converter (Celsius to Fahrenheit).

**Your request**:
```
"Create a temperature converter that changes Celsius to Fahrenheit"
```

**What happens behind the scenes**:

1. **A coder agent is spawned**
   - The system recognizes this is a coding task
   - A specialized coder agent is activated

2. **The agent analyzes your request**
   - Understands you need: input (Celsius), output (Fahrenheit)
   - Knows the formula: F = (C × 9/5) + 32
   - Decides to create a simple function

3. **The agent writes the code**
   ```python
   def celsius_to_fahrenheit(celsius):
       """Convert Celsius to Fahrenheit"""
       fahrenheit = (celsius * 9/5) + 32
       return fahrenheit
   ```

4. **The agent saves it**
   - Saves to: `sessions/[your-session]/artifacts/code/temperature.py`
   - The file is now in your session

5. **The agent reports back**
   ```
   "I've created temperature.py with a celsius_to_fahrenheit function.
    You can use it like this: celsius_to_fahrenheit(25) returns 77.0
    Would you like me to add Fahrenheit to Celsius conversion too?"
   ```

### Important: Agents Save to Sessions Automatically

Here's a key point that makes this all work smoothly:

**You never tell agents WHERE to save files.**

Agents already know:
- Your active session folder
- The correct subfolder (code, tests, docs, etc.)
- The file naming conventions

You just focus on WHAT you want, and the agent handles WHERE it goes.

### What If Something Goes Wrong?

Don't worry! If an agent makes a mistake:

1. **You can ask for corrections**: "Can you fix the bug in line 5?"
2. **You can ask for explanations**: "Why did you do it this way?"
3. **You can ask for alternatives**: "Is there a simpler approach?"

Agents don't get offended or tired. They're happy to revise their work as many times as needed.

### Multiple Requests to the Same Agent

You can keep working with an agent across multiple requests:

**First request**: "Create a calculator function"
→ Agent creates basic calculator

**Second request**: "Add support for square roots"
→ Agent adds to the existing calculator

**Third request**: "Add error handling for division by zero"
→ Agent improves the calculator further

The agent remembers context within your conversation, so you don't have to re-explain everything each time.

### What Agents Can't Do

To set realistic expectations, here's what agents typically can't do:

- **Make decisions for you**: Agents implement YOUR ideas, not replace your judgment
- **Read your mind**: You need to describe what you want
- **Access external systems** (usually): Agents work within the workspace
- **Guarantee perfect code**: Like any programmer, they can make mistakes
- **Work 24/7 continuously**: Each agent handles one task, then completes

But within these boundaries, agents are incredibly helpful assistants!

### The "Show Don't Do" Reminder

Remember: In this tour, we're SHOWING you how agents work, not actually creating files or running agents. When you're ready to actually use agents, you'll start by:

1. Creating a session for your project
2. Describing what you want to build
3. Letting the appropriate agent(s) do the work

But for now, we're just learning the concepts.

### Quick Understanding Check

Let's verify understanding:

**Question 1**: Which agent would you ask to write code?
→ **Answer**: Coder agent

**Question 2**: Which agent would you ask to check code quality?
→ **Answer**: Reviewer agent

**Question 3**: Which agent would you ask to find the best way to do something?
→ **Answer**: Researcher agent

**Question 4**: Where does an agent save its work?
→ **Answer**: In your active session's artifacts folder (automatically)

If these make sense, you're ready to learn about multiple agents working together!

---

### 🚀 Ready for Section 4?

You now understand what individual agents are and how they help. Next, we'll learn about **using multiple agents together**—which is where the real power comes in!

**Navigation**:
- `/tour next` - Continue to "Working with Multiple Agents"
- `/tour back` - Return to "Understanding Sessions"
- `/tour status` - See your progress

---

## Section 4: Working with Multiple Agents

**Duration**: ~8 minutes
**Goal**: Understand how multiple agents collaborate

---

### Why Use Multiple Agents? 👥

You've learned about individual agents. Now let's talk about the magic that happens when agents work together.

Think about building a house:
- **One person** could build a house, but it would take forever
- **A team of specialists** (electrician, plumber, carpenter) working together gets it done much faster and better

The same is true with AI agents. Multiple specialized agents working together can:
- **Finish work faster** (they work in parallel)
- **Catch more mistakes** (different perspectives)
- **Produce better quality** (each expert at their job)
- **Handle complex projects** (divide and conquer)

### A Simple Example: Three Agents, One Goal

Let's say you want to add a login feature to a website. Here's how three agents might work together:

**Agent 1: Researcher** 🔍
- **Job**: Find the best way to implement secure login
- **Deliverables**: Research report on authentication methods
- **Time**: 5 minutes
- **Saves to**: `artifacts/docs/login-research.md`

**Agent 2: Coder** 💻
- **Job**: Write the actual login code
- **Reads**: The researcher's report
- **Deliverables**: Working login code
- **Time**: 10 minutes
- **Saves to**: `artifacts/code/login.js`

**Agent 3: Tester** 🧪
- **Job**: Test the login code thoroughly
- **Reads**: The login code
- **Deliverables**: Test suite with 10 different test cases
- **Time**: 8 minutes
- **Saves to**: `artifacts/tests/login.test.js`

**Total time**: ~23 minutes (with some overlap, maybe 15 minutes actual)
**Result**: Researched, implemented, and tested login system

If one person (or one general AI) tried to do all three jobs, it might take 30-40 minutes and miss important details.

### How Agents Share Information: The "Memory" Concept

You might be wondering: "How does the coder agent know what the researcher found? How does the tester agent know what code to test?"

Great question! Agents share information through a simple system called **memory**.

**Memory** = A shared notebook where agents write notes

Think of memory like a whiteboard in an office:
- Researcher agent writes: "Best login method: JWT tokens"
- Coder agent reads that note and implements JWT tokens
- Tester agent reads the code location and creates tests

### A Complete Example: Building a Search Feature

Let's walk through a realistic multi-agent workflow. You want to add search to a blog website.

**Your initial request**:
```
"Add a search feature to my blog so visitors can find articles"
```

Behind the scenes, here's what happens:

---

#### Phase 1: Research (Agent 1) 🔍

**Researcher agent starts working**:
```
Task: Research best practices for blog search
Time: 5 minutes
```

**What the researcher does**:
1. Analyzes your requirement
2. Researches search algorithms
3. Considers user experience
4. Documents findings

**Researcher saves to memory**:
```
Memory note: "search-approach"
Content: "Use full-text search with fuzzy matching.
          Search titles, content, and tags.
          Return results ranked by relevance."
```

**Researcher saves to files**:
```
File: artifacts/docs/search-research.md
Contains: Detailed analysis and recommendations
```

---

#### Phase 2: Implementation (Agent 2) 💻

**Coder agent starts working**:
```
Task: Implement the search feature
Reads: Memory note "search-approach"
Time: 12 minutes
```

**What the coder does**:
1. Reads researcher's recommendations from memory
2. Writes search function code
3. Implements fuzzy matching
4. Adds ranking logic
5. Documents the code

**Coder saves to memory**:
```
Memory note: "search-api"
Content: "Search function: searchBlog(query)
          Returns array of results sorted by relevance
          Located in artifacts/code/search.js"
```

**Coder saves to files**:
```
File: artifacts/code/search.js
Contains: Complete search implementation
```

---

#### Phase 3: Testing (Agent 3) 🧪

**Tester agent starts working**:
```
Task: Test the search feature
Reads: Memory notes "search-approach" and "search-api"
Time: 10 minutes
```

**What the tester does**:
1. Reads what search should do (from researcher)
2. Reads where the code is (from coder)
3. Creates multiple test cases
4. Tests edge cases (empty queries, special characters)
5. Documents test results

**Tester saves to memory**:
```
Memory note: "search-test-results"
Content: "All 15 test cases passed.
          Search handles edge cases correctly.
          Ready for deployment."
```

**Tester saves to files**:
```
File: artifacts/tests/search.test.js
Contains: Complete test suite with 15 test cases
```

---

#### Phase 4: Review (Agent 4) ✅

**Reviewer agent starts working**:
```
Task: Check code quality and security
Reads: All previous memory notes and code files
Time: 8 minutes
```

**What the reviewer does**:
1. Checks code follows best practices
2. Looks for security issues
3. Checks if tests are comprehensive
4. Makes improvement suggestions

**Reviewer saves to files**:
```
File: artifacts/docs/search-review.md
Contains: Quality report and recommendations
```

---

### Timeline Visualization

Here's how it actually flows:

```
Time →
0min  |  Researcher starts
5min  |  Researcher done → Coder starts
17min |  Coder done → Tester starts
27min |  Tester done → Reviewer starts
35min |  Reviewer done → ALL COMPLETE

Total: 35 minutes for a complete, tested, reviewed feature
```

If one agent did all four jobs sequentially, it might take 50-60 minutes and be lower quality.

### Key Benefits of Multi-Agent Workflows

Let's highlight what makes this powerful:

**1. Specialization**
- Each agent is an expert at ONE thing
- No agent tries to do everything
- Higher quality work overall

**2. Parallel Work** (when possible)
- Research and planning can happen simultaneously
- Tests can be written while code is being reviewed
- Saves significant time

**3. Built-in Quality Control**
- Researcher ensures approach is sound
- Coder implements it correctly
- Tester verifies it works
- Reviewer catches any issues
- Multiple perspectives = fewer bugs

**4. Automatic Documentation**
- Researcher documents approach
- Coder documents code
- Tester documents test cases
- Reviewer documents quality checks
- Complete project documentation automatically created

**5. Easy to Track Progress**
- You can see each agent's work
- Files are organized by type
- Memory notes show coordination
- Clear audit trail of what happened

### What About Agent Coordination?

You might wonder: "Do I have to tell each agent what the previous agent did?"

**No!** Agents coordinate automatically through:

1. **Shared Memory**: Agents write and read notes
2. **File Access**: Agents can read files other agents created
3. **Session Context**: All agents know the session topic
4. **Built-in Intelligence**: Agents know how to check for relevant information

You just describe the END GOAL ("add search feature"), and the agents figure out the coordination details.

### When to Use Multiple Agents

Use multiple agents when:
- ✅ The task has multiple distinct parts (research → code → test)
- ✅ Different expertise is needed (coding vs. testing vs. review)
- ✅ You want thorough quality control (multiple checkpoints)
- ✅ The project is moderately complex or larger

Use a single agent when:
- ✅ The task is simple and focused ("format this text")
- ✅ Only one type of work is needed
- ✅ Quick iterations are more important than thoroughness

### How Many Agents Is Too Many?

Good question! General guidelines:

- **Simple task**: 1 agent (quick fix, simple function)
- **Small feature**: 2-3 agents (code + test, or research + code)
- **Medium feature**: 3-4 agents (research + code + test + review)
- **Large project**: 4-6 agents (multiple specialists + coordinator)
- **Complex system**: 6+ agents with a coordinator agent managing them

**Rule of thumb**: If you can describe the task in one sentence, probably 1-2 agents. If it takes a paragraph, probably 3-5 agents.

### Watching Agents Work

When agents are working (in actual use, not this tour), you'll see:

```
🔍 Researcher agent: Analyzing search algorithms...
💻 Coder agent: Implementing search function...
🧪 Tester agent: Creating test cases...
✅ Reviewer agent: Checking code quality...

Progress:
[████████░░] 80% complete
```

You can see what's happening in real-time, which is helpful for:
- Understanding progress
- Learning how things work
- Catching issues early
- Knowing when to step in with guidance

### What If Agents Disagree?

Sometimes agents might have different opinions:

**Example**:
- Researcher recommends approach A
- Coder thinks approach B is simpler

**What happens**:
- The issue is documented in memory or files
- You're notified: "Two approaches suggested. Which do you prefer?"
- You make the decision
- Work continues with your choice

This is a GOOD thing—it means you're getting multiple perspectives!

### The Real Power: Compound Intelligence

Here's the secret sauce: **Multiple specialized agents working together are smarter than any single general-purpose AI.**

It's like having a team meeting where:
- The researcher brings data
- The architect brings design ideas
- The engineer brings practical constraints
- The tester brings quality concerns

The COMBINATION produces better results than any individual could.

### Practical Example: Your Own Project

Let's imagine you want to build a simple recipe storage app:

**Agents you might use**:
1. **Researcher**: Best way to store recipes (database choice)
2. **Coder**: Build the app code
3. **Tester**: Test recipe creation, editing, deletion
4. **Reviewer**: Check data security (recipes are private)
5. **Doc writer**: Create user manual

**Timeline**: ~2-3 hours of AI work (compressed to maybe 1 hour with parallel work)

**Result**: Complete, tested, documented recipe app

Compare this to:
- Learning to code: months
- Hiring developers: expensive
- One general AI: slower and lower quality

---

### 🚀 Ready for Section 5?

You now understand how multiple agents collaborate to build better things faster. In the final section, we'll cover **where to find help** and **what to explore next**!

**Navigation**:
- `/tour next` - Continue to "Getting Help & Next Steps"
- `/tour back` - Return to "Your First Agent"
- `/tour status` - See your progress (you're almost done!)

---

## Section 5: Getting Help & Next Steps

**Duration**: ~4 minutes
**Goal**: Know where to find help and what to explore next

---

### You Made It! 🎉

Congratulations! You've completed the beginner pathway tour. You now understand:

✅ **What this workspace is** - A place to build things with AI specialists
✅ **Sessions** - How to organize projects in separate folders
✅ **Agents** - AI specialists who do specific types of work
✅ **Multi-Agent Collaboration** - How specialists work together
✅ **File Organization** - Where everything gets saved

That's a LOT for someone who started knowing nothing about AI agents and Claude Code!

### Where to Find Help When You Need It

Let's make sure you know where to look when you have questions:

---

#### 📚 Documentation Locations

The workspace has organized documentation for different needs:

**Quick Start Guide** → `docs/setup/quick-start.md`
- Perfect for: "I want to start my first real project"
- Contains: Step-by-step getting started
- Time: 10-minute read

**Session Management Guide** → `docs/operate/session-management.md`
- Perfect for: "How do I manage sessions properly?"
- Contains: Complete session lifecycle details
- Time: 15-minute read

**Agent Spawning Guide** → `docs/build/spawning-agents.md`
- Perfect for: "How do I use agents effectively?"
- Contains: Agent patterns and examples
- Time: 20-minute read

**Troubleshooting Guide** → `docs/operate/troubleshooting.md`
- Perfect for: "Something isn't working right"
- Contains: Common issues and solutions
- Time: Reference as needed

**Architecture Overview** → `docs/reference/architecture.md`
- Perfect for: "How does this all work internally?"
- Contains: System design and components
- Time: 30-minute read (for when you're curious)

---

#### 🎓 Skills for Deeper Learning

This workspace has specialized "skills" that teach you more:

**tutor-mode** 👨‍🏫
- What it does: Interactive learning with hands-on exercises
- When to use: You want to practice what you learned
- How to access: Type `/tutor-mode` or use the Skill tool
- Example: `/tutor-mode "session management basics"`

**meta-skill** 🗺️
- What it does: Helps you discover all available skills
- When to use: Looking for specific capabilities
- How to access: Type `/meta-skill` or use the Skill tool
- Like: A catalog of all tools available

**swarm-orchestration** 🐝
- What it does: Advanced multi-agent coordination patterns
- When to use: Ready for complex workflows
- How to access: After you're comfortable with basics

**reasoningbank-intelligence** 🧠
- What it does: AI learning and adaptation
- When to use: Want AI that learns from experience
- How to access: Advanced feature

---

#### 💡 Key Commands to Remember

You don't need to memorize these now, but here's a quick reference:

**Session Management**:
- `/session-start <topic>` - Begin new session
- `/session-closeout` - End current session cleanly
- `/tour` - Return to this tour anytime

**Getting Help**:
- `/tour help` - Tour command reference
- `/tour status` - See where you are
- `/meta-skill` - Discover available skills

---

### Your Next Learning Paths

You have several options for what to do next. Choose what sounds most interesting:

---

#### 🎯 Path 1: Practice What You Learned

**Best for**: Hands-on learners who learn by doing

**Next step**: Use **tutor-mode** for interactive exercises
```
/tutor-mode "session management basics"
```

**What you'll do**:
- Create your first real session
- Ask an agent to help with a simple task
- Practice file organization
- Get immediate feedback

**Time commitment**: 30-60 minutes

---

#### 🗺️ Path 2: Explore More Capabilities

**Best for**: Curious learners who want to see what's possible

**Next step**: Use **meta-skill** to browse all skills
```
/meta-skill
```

**What you'll see**:
- All 32 available skills
- What each skill does
- How to use them
- Which ones match your interests

**Time commitment**: 15-30 minutes browsing

---

#### 📈 Path 3: Level Up Your Knowledge

**Best for**: People who want more depth

**Next step**: Jump to **Intermediate Tour Pathway**
```
/tour jump intermediate
```

**What you'll learn**:
- Workspace architecture in detail
- Complete session lifecycle
- Advanced agent patterns
- Memory coordination
- File routing rules

**Time commitment**: 30-45 minutes

---

#### 🚀 Path 4: Just Start Building

**Best for**: People who learn best by jumping in

**Next step**: Start your first real project
```
/session-start my-first-project
```

Then tell Claude Code what you want to build!

**What you'll experience**:
- Real agents doing real work
- Files being created and organized
- Learning as you go
- Asking questions when stuck

**Time commitment**: As long as you want!

---

### Common Questions Beginners Ask

Let's address a few questions you might have:

**Q: "Can I break anything?"**
**A**: No! Sessions keep everything isolated. In the worst case, you delete one session folder. The workspace itself is safe.

**Q: "What if I forget how to do something?"**
**A**: Come back to this tour (`/tour`), or check the documentation in `docs/`. Everything is documented.

**Q: "Do I need to know programming to use this?"**
**A**: No! You describe WHAT you want in plain English. Agents handle the HOW. However, you'll naturally pick up programming concepts as you work.

**Q: "How much does this cost?"**
**A**: This workspace itself is free. You're using Claude Code, which has its own pricing. The workspace just organizes how you use Claude.

**Q: "Can I work on multiple projects simultaneously?"**
**A**: Yes! Each project gets its own session. You can have many sessions at once (just not all active at the same time).

**Q: "What if an agent makes a mistake?"**
**A**: Just ask it to fix the mistake! Agents can revise their work. Also, having multiple agents (tester, reviewer) catches most mistakes automatically.

**Q: "Is this like coding, or something else?"**
**A**: It's like being a project manager who directs a team of AI programmers. You focus on WHAT to build, they focus on HOW to build it.

---

### Your Learning Journey

Here's the typical progression for most beginners:

**Week 1: Exploration**
- Complete this tour ✅ (You're here!)
- Try tutor-mode exercises
- Create 1-2 simple practice sessions
- Get comfortable with basic commands

**Week 2: Small Projects**
- Build a simple calculator or converter
- Use 2-3 agents together
- Learn file organization naturally
- Ask lots of questions

**Week 3: Growing Confidence**
- Tackle a small real project (something you actually want)
- Use 4-5 agents in coordination
- Understand session lifecycle
- Start seeing patterns

**Week 4: Competence**
- Build moderately complex projects
- Coordinate multiple agents effectively
- Rarely need to check documentation
- Help others who are starting

---

### Encouragement & Final Thoughts

Here's the truth about learning this workspace:

**You don't need to understand everything immediately.** This tour introduced a LOT of concepts. That's normal and expected.

**You'll learn by doing.** The concepts that seem abstract now will make perfect sense after you've used them once or twice.

**Everyone starts as a beginner.** Even people who seem like experts now were once where you are, reading this tour and wondering if they'd understand it all.

**It gets easier fast.** Within a week of occasional use, this will feel natural. Within a month, you'll wonder how you ever worked without it.

**You have support.** This workspace is designed to guide you. Documentation, helpful error messages, and skills like tutor-mode are all here to help you succeed.

---

### Completion Message

```
╔══════════════════════════════════════════════════════════╗
║       🎉 Beginner Pathway Complete! 🎉                   ║
╚══════════════════════════════════════════════════════════╝

You've learned:
✅ What this workspace is and why it exists
✅ How sessions organize your work
✅ How to work with AI agents
✅ How multiple agents collaborate
✅ Where to find help when you need it

You're ready to start building with AI assistance!

Recommended next steps:
1. Try /tutor-mode "session basics" for hands-on practice
2. Or jump right in: /session-start my-first-project
3. Or keep learning: /tour jump intermediate

Remember: Everyone was a beginner once. You've got this! 💪
```

---

### Final Navigation

**Where to go from here**:
- `/tutor-mode` - Hands-on practice
- `/meta-skill` - Explore capabilities
- `/tour jump intermediate` - More depth
- `/session-start <topic>` - Start building
- `/tour reset` - Restart this tour

**Questions?**
- Check `docs/operate/troubleshooting.md`
- Ask Claude Code directly (I'm here to help!)
- Revisit any tour section: `/tour skip [section]`

---

**Thank you for taking this tour!**

You're now oriented to the common-thread workspace. The next step is yours—whether that's more learning, practicing, or building something real.

Good luck, and remember: **The AI agents are here to help you succeed.** All you need to bring is your imagination and willingness to learn.

**Happy building! 🚀**

---

*End of Beginner Pathway Tour*
*Tour Version: 1.0.0*
*Created: 2025-11-21*
*Word Count: ~3,400 words*
