/**
 * Skill Coordinator - References Other Skills ("Show Don't Do")
 *
 * Provides functions to reference and describe other workspace skills
 * without invoking them automatically. Maintains "show don't do" boundary.
 */

const SKILL_REFERENCES = {
  'tutor-mode': {
    name: 'tutor-mode',
    purpose: 'Interactive, hands-on learning with exercises',
    whenToMention: [
      'After explaining a concept: "Want hands-on practice?"',
      'When user asks "how do I get better at X?"',
      'In "Next Steps" sections'
    ],
    invocation: [
      '/tutor-mode "[topic]"',
      'Skill tool with skill: "tutor-mode"'
    ],
    example: '/tutor-mode "session management basics"',
    provides: [
      'Interactive exercises',
      'Immediate feedback',
      'Guided practice',
      'Progressive difficulty'
    ],
    distinction: {
      tourGuide: 'Explains and orients',
      skill: 'Teaches through practice'
    },
    pathways: ['beginner', 'intermediate', 'advanced']
  },

  'meta-skill': {
    name: 'meta-skill',
    purpose: 'Discover and navigate all available skills',
    whenToMention: [
      'User asks "what other skills exist?"',
      'When user needs capability outside tour scope',
      'In "Advanced Topics" sections'
    ],
    invocation: [
      '/meta-skill',
      'Skill tool with skill: "meta-skill"'
    ],
    provides: [
      'Browse skill catalog',
      'Filter by category or capability',
      'See skill details and examples',
      'Find the right skill for your need'
    ],
    distinction: {
      tourGuide: 'Workspace orientation',
      skill: 'Skill discovery and routing'
    },
    pathways: ['beginner', 'intermediate', 'advanced', 'expert']
  },

  'swarm-orchestration': {
    name: 'swarm-orchestration',
    purpose: 'Complex multi-agent coordination patterns',
    whenToMention: [
      'Advanced/Expert pathways',
      'When discussing coordination topologies',
      'User asks about complex agent workflows'
    ],
    invocation: [
      '/swarm-orchestration',
      'Skill tool with skill: "swarm-orchestration"'
    ],
    covers: [
      'Topology selection (mesh, hierarchical, ring, star)',
      'Consensus mechanisms',
      'Fault tolerance patterns',
      'Performance optimization'
    ],
    bestFor: 'Production-grade multi-agent systems',
    distinction: {
      tourGuide: 'Basic agent spawning',
      skill: 'Production coordination patterns'
    },
    pathways: ['intermediate', 'advanced', 'expert']
  },

  'reasoningbank-intelligence': {
    name: 'reasoningbank-intelligence',
    purpose: 'Adaptive learning and pattern recognition',
    whenToMention: [
      'Expert pathway',
      'When discussing memory and learning',
      'User asks about agent improvement over time'
    ],
    invocation: [
      '/reasoningbank-intelligence',
      'Skill tool with skill: "reasoningbank-intelligence"'
    ],
    features: [
      'Pattern recognition from past tasks',
      'Strategy optimization',
      'Experience replay',
      'Verdict judgment on outcomes'
    ],
    bestFor: 'Long-running projects where agents learn patterns',
    distinction: {
      tourGuide: 'Static coordination knowledge',
      skill: 'Dynamic learning and adaptation'
    },
    pathways: ['advanced', 'expert']
  },

  'session-closeout': {
    name: 'session-closeout',
    purpose: 'Structured session ending with HITL approval',
    whenToMention: [
      'All pathways, when explaining session lifecycle',
      'Explicitly in session management sections'
    ],
    invocation: [
      '/session-closeout'
    ],
    process: [
      'Generates summary',
      'Collects metrics',
      'Requests your approval (HITL)',
      'Archives to .swarm/backups/'
    ],
    note: 'Always close sessions when done - keeps workspace clean',
    distinction: {
      tourGuide: 'Explains session lifecycle',
      skill: 'Actually closes sessions'
    },
    pathways: ['beginner', 'intermediate', 'advanced', 'expert']
  },

  'pair-programming': {
    name: 'pair-programming',
    purpose: 'Real-time collaborative development',
    whenToMention: [
      'User asks about live coding collaboration',
      'Advanced pathway, development workflow section'
    ],
    invocation: [
      '/pair-programming'
    ],
    supports: 'Driver/Navigator/Switch modes, TDD, debugging',
    bestFor: 'Active development sessions',
    pathways: ['advanced', 'expert']
  },

  'verification-quality': {
    name: 'verification-quality',
    purpose: 'Code quality verification with rollback',
    whenToMention: [
      'Expert pathway',
      'When discussing quality gates',
      'User asks about ensuring code quality'
    ],
    invocation: [
      '/verification-quality'
    ],
    features: '0.95 accuracy threshold, automatic rollback',
    bestFor: 'Production code quality gates',
    pathways: ['expert']
  },

  'github-workflow-automation': {
    name: 'github-workflow-automation',
    purpose: 'GitHub CI/CD and repository management',
    whenToMention: [
      'Advanced/Expert pathways',
      'DevOps topics',
      'User asks about GitHub integration'
    ],
    invocation: [
      '/github-workflow-automation'
    ],
    covers: 'CI/CD pipelines, PR automation, release management',
    bestFor: 'Repository automation and DevOps workflows',
    pathways: ['advanced', 'expert']
  },

  'hive-mind-advanced': {
    name: 'hive-mind-advanced',
    purpose: 'Queen-led multi-agent coordination with consensus',
    whenToMention: [
      'Expert pathway',
      'When discussing large-scale coordination (5+ agents)',
      'User asks about centralized swarm management'
    ],
    invocation: [
      '/hive-mind-advanced',
      'Skill tool with skill: "hive-mind-advanced"'
    ],
    features: [
      'Queen agent orchestration',
      'Consensus mechanisms',
      'Persistent memory across sessions',
      'Hierarchical task delegation'
    ],
    bestFor: 'Large-scale swarms with centralized coordination',
    distinction: {
      tourGuide: 'Basic coordination concepts',
      skill: 'Production queen-led coordination with memory'
    },
    pathways: ['advanced', 'expert']
  },

  'github-code-review': {
    name: 'github-code-review',
    purpose: 'Comprehensive GitHub code review with AI swarms',
    whenToMention: [
      'Advanced/Expert pathways',
      'When discussing code quality',
      'User asks about automated code review'
    ],
    invocation: [
      '/github-code-review',
      'Skill tool with skill: "github-code-review"'
    ],
    features: [
      'Multi-agent code review swarms',
      'Security and performance analysis',
      'Automated PR feedback',
      'Code quality scoring'
    ],
    bestFor: 'Automated code review workflows',
    distinction: {
      tourGuide: 'Overview of code review concepts',
      skill: 'Production-grade automated review'
    },
    pathways: ['advanced', 'expert']
  },

  'sparc-methodology': {
    name: 'sparc-methodology',
    purpose: 'SPARC TDD development methodology with multi-agent orchestration',
    whenToMention: [
      'Intermediate/Advanced pathways',
      'When discussing TDD workflows',
      'User asks about structured development'
    ],
    invocation: [
      '/sparc-methodology',
      'Skill tool with skill: "sparc-methodology"'
    ],
    features: [
      'Specification → Pseudocode → Architecture → Refinement → Completion',
      'Multi-agent coordination for each phase',
      'Test-driven development automation',
      'Structured project delivery'
    ],
    bestFor: 'Systematic TDD project development',
    distinction: {
      tourGuide: 'Explains TDD concepts',
      skill: 'Orchestrates full SPARC workflow'
    },
    pathways: ['intermediate', 'advanced', 'expert']
  }
};

/**
 * Generate skill reference text ("show don't do" format)
 */
function generateSkillReference(skillName, context = 'inline') {
  const skill = SKILL_REFERENCES[skillName];
  if (!skill) return null;

  const formats = {
    inline: `For ${skill.purpose.toLowerCase()}, see ${skill.name}:

Invoke: ${skill.invocation.join('\n   or: ')}

${skill.example ? `Example: ${skill.example}` : ''}

Note: I won't invoke it for you - you control when to dive deeper.`,

    sectionFooter: `────────────────────────────────────────────────────────────
Related Skill: ${skill.name}

Purpose: ${skill.purpose}
Invoke: ${skill.invocation[0]}

${skill.distinction ? `Distinction:
• Tour-guide: ${skill.distinction.tourGuide}
• ${skill.name}: ${skill.distinction.skill}` : ''}
────────────────────────────────────────────────────────────`,

    detailed: `**${skill.name}**: ${skill.purpose}

Invoke: ${skill.invocation.join('\n   or: ')}

${skill.provides ? `Provides:\n${skill.provides.map(p => `• ${p}`).join('\n')}` : ''}
${skill.features ? `Features:\n${skill.features.map(f => `• ${f}`).join('\n')}` : ''}
${skill.covers ? `Covers:\n${skill.covers.map(c => `• ${c}`).join('\n')}` : ''}

${skill.bestFor ? `Best for: ${skill.bestFor}` : ''}

${skill.distinction ? `Distinction from tour-guide:
• Tour-guide: ${skill.distinction.tourGuide}
• ${skill.name}: ${skill.distinction.skill}` : ''}`
  };

  return formats[context] || formats.inline;
}

/**
 * Generate multiple skill references
 */
function generateMultipleReferences(skillNames, format = 'list') {
  const skills = skillNames
    .map(name => SKILL_REFERENCES[name])
    .filter(Boolean);

  if (format === 'list') {
    return `Related Skills for Deeper Learning:

${skills.map(s => `• **${s.name}**: ${s.purpose}
  → ${s.invocation[0]}`).join('\n\n')}`;
  }

  if (format === 'decision') {
    return `What would you like to do next?

${skills.map((s, i) => {
  const letter = String.fromCharCode(65 + i); // A, B, C...
  return `${letter}) Use ${s.name} → ${s.invocation[0]}`;
}).join('\n')}

[Enter ${skills.map((_, i) => String.fromCharCode(65 + i)).join(', ')}]`;
  }

  return null;
}

/**
 * Get skills relevant to pathway
 */
function getSkillsForPathway(pathwayId) {
  return Object.values(SKILL_REFERENCES)
    .filter(skill => skill.pathways.includes(pathwayId))
    .map(skill => skill.name);
}

/**
 * Check if skill should be mentioned in context
 */
function shouldMentionSkill(skillName, context) {
  const skill = SKILL_REFERENCES[skillName];
  if (!skill) return false;

  const normalized = context.toLowerCase();
  return skill.whenToMention.some(condition =>
    normalized.includes(condition.toLowerCase())
  );
}

/**
 * Generate troubleshooting redirect to skill
 */
function generateRedirect(skillName, userQuestion) {
  const skill = SKILL_REFERENCES[skillName];
  if (!skill) return null;

  return `That's a great question about ${userQuestion}. The tour provides an
overview, but for detailed guidance, I recommend:

**${skill.name}**: ${skill.purpose}
Invoke: ${skill.invocation[0]}

Would you like to:
A) Continue tour and use ${skill.name} later
B) Hear more about what ${skill.name} offers
C) Exit tour to use ${skill.name} now

[Enter A, B, or C]`;
}

/**
 * Enforce "show don't do" boundary
 */
function handleInvocationRequest(skillName) {
  const skill = SKILL_REFERENCES[skillName];
  if (!skill) return null;

  return `I can show you how to start ${skill.name}, but I won't invoke it
automatically (that's the "show don't do" boundary).

To start ${skill.name}:
  ${skill.invocation[0]}

${skill.example ? `Example:\n  ${skill.example}` : ''}

Ready to continue the tour, or would you like to invoke
${skill.name} yourself now?`;
}

/**
 * Get skill description
 */
function getSkillDescription(skillName) {
  return SKILL_REFERENCES[skillName] || null;
}

/**
 * List all referenceable skills
 */
function getAllSkills() {
  return Object.keys(SKILL_REFERENCES);
}

/**
 * Get formatted reference text for a skill with context
 * @param {string} skillName - The skill to reference
 * @param {string} context - Context for formatting (inline|sectionFooter|detailed)
 * @returns {string|null} Formatted reference text
 */
function getReferenceText(skillName, context = 'inline') {
  const skill = SKILL_REFERENCES[skillName];
  if (!skill) return null;

  // Special formatting for 8 key skills with enhanced context
  const enhancedSkills = [
    'tutor-mode', 'meta-skill', 'swarm-orchestration',
    'hive-mind-advanced', 'github-code-review', 'verification-quality',
    'pair-programming', 'sparc-methodology'
  ];

  if (enhancedSkills.includes(skillName)) {
    if (context === 'inline') {
      return `For ${skill.purpose.toLowerCase()}, see **${skill.name}**:

Invoke: ${skill.invocation[0]}${skill.invocation.length > 1 ? `\n   or: ${skill.invocation[1]}` : ''}

${skill.example ? `Example: ${skill.example}\n` : ''}${getKeyFeatures(skill)}

**Note**: I won't invoke it for you - you control when to dive deeper.`;
    }

    if (context === 'detailed') {
      return `**${skill.name}**: ${skill.purpose}

Invoke: ${skill.invocation.join('\n   or: ')}

${getKeyFeatures(skill)}

${skill.bestFor ? `**Best for**: ${skill.bestFor}\n` : ''}${skill.distinction ? `**Distinction from tour-guide**:
• Tour-guide: ${skill.distinction.tourGuide}
• ${skill.name}: ${skill.distinction.skill}\n` : ''}**"Show Don't Do" Principle**: The tour-guide describes how to use this skill but never invokes it automatically. You decide when to engage.`;
    }
  }

  // Fallback to original formatting
  return generateSkillReference(skillName, context);
}

/**
 * Helper: Extract key features from skill object
 * @private
 */
function getKeyFeatures(skill) {
  if (skill.provides) {
    return skill.provides.map(p => `• ${p}`).join('\n');
  }
  if (skill.features) {
    const features = Array.isArray(skill.features) ? skill.features : [skill.features];
    return features.map(f => `• ${f}`).join('\n');
  }
  if (skill.covers) {
    const covers = Array.isArray(skill.covers) ? skill.covers : [skill.covers];
    return covers.map(c => `• ${c}`).join('\n');
  }
  return '';
}

/**
 * Get comparison text between two skills
 * @param {string} skill1 - First skill name
 * @param {string} skill2 - Second skill name
 * @returns {string|null} Comparison text
 */
function getComparisonText(skill1, skill2) {
  const s1 = SKILL_REFERENCES[skill1];
  const s2 = SKILL_REFERENCES[skill2];

  if (!s1 || !s2) return null;

  // Special comparisons for key skill pairs
  const keyComparisons = {
    'tour-guide-vs-tutor-mode': `**tour-guide** shows, **tutor-mode** teaches

| Aspect | tour-guide | tutor-mode |
|--------|-----------|-----------|
| Goal | Orient & navigate | Teach & practice |
| Method | Explanation & examples | Interactive exercises |
| Depth | Survey level | Hands-on mastery |
| Output | Knowledge | Skill |

**When to use**:
• tour-guide: Getting started, exploring workspace
• tutor-mode: After tour, for deliberate practice`,

    'tour-guide-vs-meta-skill': `**tour-guide** orients you to the workspace, **meta-skill** helps you discover capabilities

| Aspect | tour-guide | meta-skill |
|--------|-----------|-----------|
| Goal | Workspace orientation | Skill discovery |
| Scope | Workspace features & workflows | Skill catalog & routing |
| Method | Guided tour | Interactive menu |
| Best for | New users | Finding specific capabilities |

**When to use**:
• tour-guide: First time in workspace
• meta-skill: Looking for specific capability`,

    'swarm-orchestration-vs-hive-mind-advanced': `**swarm-orchestration** teaches patterns, **hive-mind-advanced** provides queen-led coordination

| Aspect | swarm-orchestration | hive-mind-advanced |
|--------|-----------|-----------|
| Style | Peer coordination | Centralized queen |
| Topology | Mesh, ring, star | Hierarchical with queen |
| Best for | Distributed systems | Large-scale coordination |
| Memory | Per-agent | Persistent across sessions |

**When to use**:
• swarm-orchestration: 2-5 agents, distributed
• hive-mind-advanced: 5+ agents, need central orchestrator`
  };

  // Check for special comparison
  const compKey1 = `${skill1}-vs-${skill2}`;
  const compKey2 = `${skill2}-vs-${skill1}`;

  if (keyComparisons[compKey1]) return keyComparisons[compKey1];
  if (keyComparisons[compKey2]) return keyComparisons[compKey2];

  // Build generic comparison
  const comparison = [`**Comparing ${s1.name} vs. ${s2.name}**:\n`];

  comparison.push(`**Purpose:**`);
  comparison.push(`• ${s1.name}: ${s1.purpose}`);
  comparison.push(`• ${s2.name}: ${s2.purpose}\n`);

  // Add distinctions if available
  if (s1.distinction && s2.distinction) {
    comparison.push(`**Approach:**`);
    comparison.push(`• ${s1.name}: ${s1.distinction.skill}`);
    comparison.push(`• ${s2.name}: ${s2.distinction.skill}\n`);
  }

  // Add best use cases
  if (s1.bestFor && s2.bestFor) {
    comparison.push(`**Best For:**`);
    comparison.push(`• ${s1.name}: ${s1.bestFor}`);
    comparison.push(`• ${s2.name}: ${s2.bestFor}\n`);
  }

  // Add invocation methods
  comparison.push(`**Invoke:**`);
  comparison.push(`• ${s1.name}: ${s1.invocation[0]}`);
  comparison.push(`• ${s2.name}: ${s2.invocation[0]}`);

  return comparison.join('\n');
}

/**
 * Get invocation example for a skill (show, don't do)
 * @param {string} skillName - The skill to show invocation for
 * @returns {string|null} Invocation example text
 */
function getInvocationExample(skillName) {
  const skill = SKILL_REFERENCES[skillName];
  if (!skill) return null;

  const example = [`**How to invoke ${skill.name}**:\n`];

  // Primary invocation method
  example.push(`**Primary method**: ${skill.invocation[0]}`);

  // Alternative method if available
  if (skill.invocation.length > 1) {
    example.push(`**Alternative**: ${skill.invocation[1]}`);
  }

  // Concrete example if available
  if (skill.example) {
    example.push(`\n**Example**:`);
    example.push(`  ${skill.example}`);
  }

  // What it provides
  const features = getKeyFeatures(skill);
  if (features) {
    example.push(`\n**What you get**:`);
    example.push(features);
  }

  // Best use case
  if (skill.bestFor) {
    example.push(`\n**Best for**: ${skill.bestFor}`);
  }

  // Boundary reminder with emphasis
  example.push(`\n**"Show Don't Do" Boundary**:`);
  example.push(`The tour-guide won't invoke this for you - you control when to engage.`);
  example.push(`This ensures you maintain agency over your learning journey.`);

  return example.join('\n');
}

/**
 * Get progressive skill suggestions based on user level
 * @param {string} proficiencyLevel - beginner|intermediate|advanced|expert
 * @param {string} currentTopic - Current topic being discussed
 * @returns {Array<string>} Ordered array of relevant skill names
 */
function getProgressiveSkillSuggestions(proficiencyLevel, currentTopic = '') {
  const allSkills = Object.values(SKILL_REFERENCES)
    .filter(skill => skill.pathways.includes(proficiencyLevel));

  // Sort by relevance to current topic
  const topicLower = currentTopic.toLowerCase();
  const scored = allSkills.map(skill => {
    let score = 0;

    // Check if skill purpose matches topic
    if (skill.purpose.toLowerCase().includes(topicLower)) score += 3;

    // Check if any whenToMention conditions match
    if (skill.whenToMention.some(w => topicLower.includes(w.toLowerCase()))) score += 2;

    // Prioritize essential skills for beginners
    if (proficiencyLevel === 'beginner') {
      if (['tutor-mode', 'meta-skill', 'session-closeout'].includes(skill.name)) {
        score += 5;
      }
    }

    return { skill, score };
  });

  // Sort by score descending, return skill names
  return scored
    .sort((a, b) => b.score - a.score)
    .map(item => item.skill.name);
}

/**
 * Generate context-appropriate skill menu
 * @param {string} proficiencyLevel - User's proficiency level
 * @param {string} context - Current context (learning|building|troubleshooting)
 * @returns {string} Formatted skill menu
 */
function generateContextMenu(proficiencyLevel, context = 'learning') {
  const suggestions = getProgressiveSkillSuggestions(proficiencyLevel, context);
  const topSkills = suggestions.slice(0, 5); // Top 5 relevant skills

  const menu = [`Related Skills for ${context}:\n`];

  topSkills.forEach((skillName, index) => {
    const skill = SKILL_REFERENCES[skillName];
    const letter = String.fromCharCode(65 + index); // A, B, C...
    menu.push(`${letter}) ${skill.name}: ${skill.purpose}`);
    menu.push(`   → ${skill.invocation[0]}\n`);
  });

  menu.push(`Choose [${topSkills.map((_, i) => String.fromCharCode(65 + i)).join(', ')}] or continue tour`);

  return menu.join('\n');
}

/**
 * Check if skill is appropriate for user's current level
 * @param {string} skillName - Skill to check
 * @param {string} proficiencyLevel - User's level
 * @returns {boolean} Whether skill is appropriate
 */
function isSkillAppropriate(skillName, proficiencyLevel) {
  const skill = SKILL_REFERENCES[skillName];
  if (!skill) return false;

  return skill.pathways.includes(proficiencyLevel);
}

/**
 * Get "next level" skills for user progression
 * @param {string} currentLevel - Current proficiency level
 * @returns {Array<string>} Skills available at next level
 */
function getNextLevelSkills(currentLevel) {
  const progression = {
    'beginner': 'intermediate',
    'intermediate': 'advanced',
    'advanced': 'expert',
    'expert': 'expert' // No next level
  };

  const nextLevel = progression[currentLevel];
  if (!nextLevel || nextLevel === currentLevel) return [];

  // Find skills available at next level but not current
  const currentSkills = new Set(
    Object.values(SKILL_REFERENCES)
      .filter(s => s.pathways.includes(currentLevel))
      .map(s => s.name)
  );

  return Object.values(SKILL_REFERENCES)
    .filter(s => s.pathways.includes(nextLevel) && !currentSkills.has(s.name))
    .map(s => s.name);
}

/**
 * Specialized reference methods for 8 key skills
 */

/**
 * Get tutor-mode reference with learning context
 * @param {string} topic - Topic for practice
 * @returns {string} Formatted tutor-mode reference
 */
function getTutorModeReference(topic = 'this topic') {
  return `Want hands-on practice with ${topic}?

**tutor-mode** offers interactive exercises with immediate feedback:

Invoke: /tutor-mode "${topic}"
   or: Skill tool with skill: "tutor-mode"

What you get:
• Interactive exercises tailored to your level
• Immediate feedback on your work
• Guided practice sessions
• Progressive difficulty

**Note**: I'm showing you how to invoke tutor-mode, but I won't do it automatically.
You decide when you're ready for hands-on practice.`;
}

/**
 * Get meta-skill reference for capability discovery
 * @returns {string} Formatted meta-skill reference
 */
function getMetaSkillReference() {
  return `Curious what other capabilities exist?

**meta-skill** helps you discover and explore all 49 available skills:

Invoke: /meta-skill
   or: Skill tool with skill: "meta-skill"

What you get:
• Browse full skill catalog
• Filter by category or capability
• See detailed skill descriptions
• Find the right skill for your need

**Note**: I'm showing you how to explore skills, not automatically switching to meta-skill.
You maintain control of your learning path.`;
}

/**
 * Get swarm-orchestration reference for multi-agent coordination
 * @returns {string} Formatted swarm-orchestration reference
 */
function getSwarmOrchestrationReference() {
  return `Ready for production-grade multi-agent coordination?

**swarm-orchestration** covers advanced coordination patterns:

Invoke: /swarm-orchestration
   or: Skill tool with skill: "swarm-orchestration"

What you get:
• Topology selection (mesh, hierarchical, ring, star)
• Consensus mechanisms for distributed decisions
• Fault tolerance and recovery patterns
• Performance optimization techniques

**Best for**: Systems with 2-5 agents requiring distributed coordination

**Note**: I'm describing swarm-orchestration, not invoking it. You choose when to dive into
production patterns.`;
}

/**
 * Get hive-mind-advanced reference for queen-led coordination
 * @returns {string} Formatted hive-mind-advanced reference
 */
function getHiveMindReference() {
  return `Need centralized coordination for large swarms?

**hive-mind-advanced** provides queen-led multi-agent coordination:

Invoke: /hive-mind-advanced
   or: Skill tool with skill: "hive-mind-advanced"

What you get:
• Queen agent orchestration (centralized control)
• Consensus mechanisms across agents
• Persistent memory across sessions
• Hierarchical task delegation

**Best for**: Large-scale swarms (5+ agents) requiring central orchestration

**Note**: I'm showing you how queen-led coordination works, not invoking the hive mind.
You decide when you need that level of orchestration.`;
}

/**
 * Get github-code-review reference for automated review
 * @returns {string} Formatted github-code-review reference
 */
function getGithubCodeReviewReference() {
  return `Want automated, multi-agent code review?

**github-code-review** coordinates AI swarms for comprehensive PR review:

Invoke: /github-code-review
   or: Skill tool with skill: "github-code-review"

What you get:
• Multi-agent code review swarms
• Security and performance analysis
• Automated PR feedback
• Code quality scoring

**Best for**: Automated code review workflows integrated with GitHub

**Note**: I'm describing the github-code-review capability, not starting a review.
You invoke it when you have code ready for review.`;
}

/**
 * Get verification-quality reference for quality gates
 * @returns {string} Formatted verification-quality reference
 */
function getVerificationQualityReference() {
  return `Need automated quality verification with rollback?

**verification-quality** provides truth scoring and automatic quality gates:

Invoke: /verification-quality
   or: Skill tool with skill: "verification-quality"

What you get:
• 0.95 accuracy threshold for agent outputs
• Automatic rollback on quality failures
• Comprehensive code quality verification
• Truth scoring system

**Best for**: Production code quality gates and ensuring high reliability

**Note**: I'm showing you how quality verification works, not activating it.
You decide when quality gates should be enforced.`;
}

/**
 * Get pair-programming reference for collaborative coding
 * @returns {string} Formatted pair-programming reference
 */
function getPairProgrammingReference() {
  return `Want real-time collaborative development?

**pair-programming** enables AI-assisted coding with multiple modes:

Invoke: /pair-programming
   or: Skill tool with skill: "pair-programming"

What you get:
• Driver/Navigator/Switch modes
• Real-time verification and feedback
• TDD support (test-driven development)
• Debugging assistance

**Best for**: Active development sessions with live collaboration

**Note**: I'm describing pair-programming, not starting a session.
You invoke it when you're ready for collaborative coding.`;
}

/**
 * Get sparc-methodology reference for TDD workflows
 * @returns {string} Formatted sparc-methodology reference
 */
function getSparcMethodologyReference() {
  return `Need systematic TDD project development?

**sparc-methodology** orchestrates multi-agent SPARC workflows:

Invoke: /sparc-methodology
   or: Skill tool with skill: "sparc-methodology"

What you get:
• Specification → Pseudocode → Architecture → Refinement → Completion
• Multi-agent coordination for each phase
• Test-driven development automation
• Structured project delivery

**Best for**: Systematic TDD development with clear phases and deliverables

**Note**: I'm showing you how SPARC methodology works, not starting a workflow.
You invoke it when you're ready for structured development.`;
}

/**
 * Get skill reference by name using specialized methods
 * @param {string} skillName - Name of skill
 * @param {string} topic - Optional topic context
 * @returns {string|null} Specialized reference or null
 */
function getSpecializedReference(skillName, topic = null) {
  const specializedRefs = {
    'tutor-mode': () => getTutorModeReference(topic || 'this topic'),
    'meta-skill': () => getMetaSkillReference(),
    'swarm-orchestration': () => getSwarmOrchestrationReference(),
    'hive-mind-advanced': () => getHiveMindReference(),
    'github-code-review': () => getGithubCodeReviewReference(),
    'verification-quality': () => getVerificationQualityReference(),
    'pair-programming': () => getPairProgrammingReference(),
    'sparc-methodology': () => getSparcMethodologyReference()
  };

  const refFunc = specializedRefs[skillName];
  return refFunc ? refFunc() : null;
}

module.exports = {
  SKILL_REFERENCES,
  generateSkillReference,
  generateMultipleReferences,
  getSkillsForPathway,
  shouldMentionSkill,
  generateRedirect,
  handleInvocationRequest,
  getSkillDescription,
  getAllSkills,
  // Enhanced methods
  getReferenceText,
  getComparisonText,
  getInvocationExample,
  getProgressiveSkillSuggestions,
  generateContextMenu,
  isSkillAppropriate,
  getNextLevelSkills,
  // Specialized reference methods for 8 key skills
  getTutorModeReference,
  getMetaSkillReference,
  getSwarmOrchestrationReference,
  getHiveMindReference,
  getGithubCodeReviewReference,
  getVerificationQualityReference,
  getPairProgrammingReference,
  getSparcMethodologyReference,
  getSpecializedReference
};
