Interactive learning assistant for claude-flow orchestration.

## What to do:

Execute the tutor-mode interactive learning system:

```bash
node sessions/session-20251117-225020-hive-docs-tutor/artifacts/code/tutor-mode/index.js "$@"
```

## Available Commands:

```bash
/tutor start              # Begin guided learning journey
/tutor assess             # Check your current knowledge level
/tutor next               # Get recommended next lesson
/tutor explain <topic>    # Deep dive on any topic
/tutor exercise <level>   # Practice challenge (foundations/essential/intermediate/advanced)
/tutor review             # Strengthen weak areas
/tutor path               # Show full learning roadmap
/tutor progress           # View your learning progress
/tutor help <topic>       # Get help on specific topics
```

## Examples:

```bash
# Start learning journey
/tutor start

# Ask a question directly
/tutor How do I spawn agents in parallel?

# Explain a specific topic
/tutor explain memory-coordination

# Get an exercise
/tutor exercise foundations

# Check progress
/tutor progress
```

## Features:

- **Context-Aware**: Reads workspace documentation and weighting schema
- **Personalized**: Tracks your learning history for customized paths
- **Interactive**: Real Q&A functionality, no mocks
- **Safe References**: Guides toward appropriate documentation based on your level
- **Progress Tracking**: Remembers what you've learned

## Integration:

- Uses workspace weighting schema to guide answers
- Stores user history in `.swarm/tutor-cache/`
- Integrates with memory coordination system
- Real-time question answering from docs
