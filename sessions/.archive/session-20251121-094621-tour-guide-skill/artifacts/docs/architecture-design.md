# Tour-Guide Skill Architecture

## Executive Summary

The tour-guide skill provides an adaptive, interactive orientation system for the common-thread workspace. It assesses user proficiency and delivers customized pathways that balance comprehension with technical depth.

## Design Principles

1. **Progressive Disclosure**: Information revealed at appropriate depth for proficiency level
2. **Show, Don't Do**: Guide users to capabilities without executing on their behalf
3. **Non-Invasive**: Pure navigation and explanation, no file modifications
4. **Self-Contained**: Minimal dependencies, leverages existing documentation
5. **Adaptive**: Adjusts complexity based on real-time user signals

## System Architecture

### High-Level Components

```
┌─────────────────────────────────────────────────────────┐
│                    Tour-Guide Skill                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐      ┌──────────────────────────┐   │
│  │   Intake     │─────▶│   Proficiency Router     │   │
│  │   Menu       │      │                           │   │
│  └──────────────┘      └──────────────────────────┘   │
│                                │                        │
│                                ▼                        │
│         ┌──────────────────────────────────────┐       │
│         │      Pathway Orchestrator            │       │
│         └──────────────────────────────────────┘       │
│                      │    │    │    │                   │
│         ┌────────────┼────┼────┼────┼─────────┐        │
│         ▼            ▼    ▼    ▼    ▼          │        │
│  ┌──────────┐  ┌────────┐ ┌────────┐ ┌──────────┐    │
│  │ Beginner │  │ Inter- │ │Advanced│ │  Expert  │    │
│  │ Pathway  │  │mediate │ │Pathway │ │ Pathway  │    │
│  │          │  │Pathway │ │        │ │          │    │
│  └──────────┘  └────────┘ └────────┘ └──────────┘    │
│         │            │          │           │          │
│         └────────────┼──────────┼───────────┘          │
│                      ▼          ▼                       │
│              ┌─────────────────────────┐               │
│              │  Navigation Controller  │               │
│              └─────────────────────────┘               │
│                      │                                  │
│                      ▼                                  │
│              ┌─────────────────────────┐               │
│              │  Skill Coordinator      │               │
│              └─────────────────────────┘               │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Component Responsibilities

#### 1. Intake Menu
- **Purpose**: Assess user proficiency and goals
- **Inputs**: User responses to proficiency questions
- **Outputs**: Proficiency level (Beginner/Intermediate/Advanced/Expert)
- **Interactions**: Feeds into Proficiency Router

#### 2. Proficiency Router
- **Purpose**: Direct users to appropriate pathway
- **Logic**:
  - Maps proficiency + comfort level to optimal pathway
  - Allows manual override
  - Tracks pathway switches
- **Outputs**: Selected pathway initialization

#### 3. Pathway Orchestrator
- **Purpose**: Manage active pathway lifecycle
- **Responsibilities**:
  - Load pathway content
  - Track progression state
  - Handle navigation commands
  - Coordinate with other skills
- **State Management**: Current section, visited nodes, user notes

#### 4. Pathway Implementations (4 variants)
- **Purpose**: Deliver proficiency-appropriate content
- **Content Structure**: Sections → Topics → Interactive elements
- **Progression**: Linear with skip/jump capabilities

#### 5. Navigation Controller
- **Purpose**: Handle user commands and flow control
- **Commands**: `/tour`, `/tour next`, `/tour back`, `/tour skip`, `/tour jump`
- **State**: Current position, history stack, bookmarks

#### 6. Skill Coordinator
- **Purpose**: Reference related skills without invoking
- **Responsibilities**:
  - Mention tutor-mode for deep learning
  - Reference meta-skill for skill discovery
  - Point to specialized skills (swarm-orchestration, reasoningbank-intelligence)
  - Maintain "show don't do" boundary

## Data Flow

### Initial Flow (First Invocation)

```
User: /tour
  ↓
Intake Menu Display
  ↓
User: Answers proficiency questions
  ↓
Proficiency Router → Pathway Selection
  ↓
Pathway Orchestrator → Initialize Pathway
  ↓
Display: First section of selected pathway
```

### Navigation Flow

```
User: /tour next
  ↓
Navigation Controller
  ↓
Pathway Orchestrator → Load next section
  ↓
Display: Next section content
```

### Skill Reference Flow

```
Pathway Content: "For hands-on practice, see tutor-mode..."
  ↓
User: How do I use tutor-mode?
  ↓
Skill Coordinator → Describe capability + invocation
  ↓
Display: "Invoke with /tutor-mode or Skill tool..."
  (No automatic invocation)
```

## Integration Points

### With Existing Documentation
- **docs/setup/quick-start.md**: Referenced in Beginner pathway
- **docs/reference/architecture.md**: Referenced in Advanced/Expert pathways
- **docs/operate/session-management.md**: Core content for all pathways
- **docs/coordinate/swarm-coordination.md**: Advanced pathway content

### With Other Skills
- **tutor-mode**: Referenced for interactive learning
- **meta-skill**: Referenced for skill discovery
- **swarm-orchestration**: Referenced for coordination patterns
- **reasoningbank-intelligence**: Referenced for adaptive learning

### With Claude Code Features
- **Read tool**: Used to load documentation sections
- **No Write/Edit**: Tour-guide never modifies files
- **No Bash**: No system commands (pure navigation)
- **No Task spawning**: References agent capabilities, doesn't invoke

## State Management

### Session State (In-Memory)
```javascript
{
  proficiencyLevel: "intermediate",
  currentPathway: "intermediate",
  currentSection: "session-management",
  visitedSections: ["overview", "file-routing", "session-management"],
  bookmarks: [],
  startTime: "2025-11-21T09:46:21Z",
  completedSections: ["overview", "file-routing"]
}
```

### Persistence Strategy
- **No file-based state**: Purely conversational
- **Resumption**: User can re-enter at any proficiency level
- **History**: Tracked in conversation context only

## Command Structure

### Primary Commands
- `/tour` - Start or resume tour
- `/tour next` - Next section
- `/tour back` - Previous section
- `/tour skip [section]` - Skip to specific section
- `/tour jump [level]` - Switch proficiency levels
- `/tour help` - Command reference

### Secondary Commands
- `/tour status` - Show current position
- `/tour bookmark [name]` - Save current position
- `/tour list` - List all available sections
- `/tour reset` - Restart from intake

## Quality Attributes

### Performance
- **Response Time**: < 2 seconds for navigation commands
- **Memory Footprint**: Minimal state (< 1KB in conversation context)

### Usability
- **Clarity**: Clear navigation cues at every step
- **Flexibility**: Easy to skip/jump between sections
- **Context**: Always show "where you are" indicator

### Maintainability
- **Content Updates**: Documentation changes auto-reflect in pathways
- **Extensibility**: Easy to add new proficiency levels or pathways
- **Decoupling**: Pathway content separated from navigation logic

### Reliability
- **No Side Effects**: Never modifies workspace files
- **Graceful Degradation**: Falls back to Intermediate pathway if assessment unclear
- **Error Handling**: Clear messages for invalid commands

## Security & Safety

### Boundaries
- **Read-Only**: Only reads existing documentation
- **No Execution**: Never runs commands or spawns agents
- **No External Calls**: Purely internal navigation
- **No User Data**: Doesn't collect or store personal information

### User Control
- **Explicit Invocation**: Only activates with `/tour` command
- **Exit Anytime**: User can stop tour at any point
- **Level Override**: User can manually select proficiency level

## Extension Points

### Future Enhancements
1. **Interactive Examples**: Embedded code snippets with "try this" prompts
2. **Progress Tracking**: Visual progress indicators per pathway
3. **Custom Pathways**: User-defined learning paths
4. **Multi-Language**: Support for non-English tours
5. **Accessibility**: Screen reader optimizations

### Plugin Architecture
```javascript
// Hypothetical extension point
tourGuide.registerPathway({
  name: "DevOps-Focused",
  proficiencyLevels: ["intermediate", "advanced"],
  sections: [...]
});
```

## Success Metrics

### User Experience
- **Time to First Value**: < 5 minutes to understand workspace basics
- **Completion Rate**: % of users completing their selected pathway
- **Pathway Switches**: Frequency of level changes (indicates good adaptation)

### Content Quality
- **Documentation Coverage**: % of docs referenced by pathways
- **Clarity Score**: User feedback on explanation quality
- **Navigation Efficiency**: Average sections to find specific information

## Design Rationale

### Why Proficiency-Based?
Users enter this workspace with vastly different backgrounds:
- **Beginners**: Need high-level orientation, simple language
- **Intermediates**: Want practical patterns, skip basics
- **Advanced**: Seek architecture depth, custom modifications
- **Experts**: Need stock vs. custom comparison, extension points

### Why "Show Don't Do"?
The tour-guide's role is orientation, not execution:
- Prevents accidental modifications
- Encourages active learning
- Maintains user agency
- Reduces complexity

### Why Slash Commands?
Natural language can be ambiguous for navigation:
- `/tour next` is unambiguous
- Works well with progressive disclosure
- Familiar to CLI users
- Easy to discover via `/tour help`

## Architecture Decision Records

### ADR-001: In-Memory State Only
**Decision**: No file-based state persistence
**Rationale**:
- Simplifies implementation
- Avoids workspace pollution
- Conversation context sufficient for session-length tours
- User can re-enter at any level

### ADR-002: Four Proficiency Levels
**Decision**: Beginner, Intermediate, Advanced, Expert
**Rationale**:
- Covers full spectrum of user expertise
- Each level has distinct content needs
- More granular than 3, less complex than 5
- Aligns with common skill taxonomies

### ADR-003: Documentation-First Content
**Decision**: Reference existing docs rather than duplicating
**Rationale**:
- Single source of truth
- Auto-updates with doc changes
- Reduces maintenance burden
- Encourages exploration

### ADR-004: Non-Invasive Design
**Decision**: Read-only, no modifications
**Rationale**:
- Safety boundary (no accidental changes)
- Clear role separation (guide vs. executor)
- Reduces testing complexity
- Builds user trust

## Implementation Considerations

### Technology Stack
- **Skill Framework**: Claude Code Skills YAML structure
- **Content Format**: Markdown with embedded navigation hints
- **State Management**: Conversation context variables
- **Documentation Access**: Read tool for file content

### Development Phases

**Phase 1: Core Navigation**
- Intake menu
- Basic pathway structure
- Navigation commands
- Proficiency router

**Phase 2: Content Population**
- All 4 pathway implementations
- Documentation references
- Interactive elements
- Section transitions

**Phase 3: Skill Coordination**
- Tutor-mode references
- Meta-skill integration
- Specialized skill pointers
- Context-aware suggestions

**Phase 4: Polish & Testing**
- User testing with all 4 proficiency levels
- Navigation flow optimization
- Content clarity review
- Error handling

### Testing Strategy
- **Unit**: Proficiency router logic
- **Integration**: Pathway transitions
- **User Acceptance**: Real users at each proficiency level
- **Boundary**: Ensure no file modifications possible

## Conclusion

This architecture delivers an adaptive, safe, and user-friendly orientation system. By assessing proficiency and delivering targeted pathways, it accelerates time-to-productivity while maintaining clarity and user control. The "show don't do" philosophy ensures users build understanding rather than just following steps, creating lasting competency with the workspace.
