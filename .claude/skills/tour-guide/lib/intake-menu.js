/**
 * Intake Menu - Proficiency Assessment Logic
 *
 * Assesses user proficiency through 3-question assessment and routes
 * to appropriate pathway (Beginner/Intermediate/Advanced/Expert).
 * Shows feature explorer before assessment (defaults to Advanced overview).
 */

const featureExplorer = require('./feature-explorer');

const PROFICIENCY_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
  EXPERT: 'expert'
};

const QUESTIONS = {
  Q1_AI_EXPERIENCE: {
    text: `Question 1 of 3: AI Agent Experience
────────────────────────────────────

How familiar are you with multi-agent AI systems?

A) New to me - what's a multi-agent system?
B) I've heard of them but haven't used one
C) I've used Claude Code or similar AI assistants
D) I've built or coordinated multi-agent workflows

[Enter A, B, C, or D]`,
    options: ['A', 'B', 'C', 'D']
  },

  Q2_CLAUDE_CODE: {
    text: `Question 2 of 3: Claude Code Familiarity
────────────────────────────────────────

Have you used Claude Code before?

A) First time using Claude Code
B) I've used Claude Code for simple tasks
C) Regular Claude Code user, new to this workspace
D) Experienced with Claude Code + multi-agent patterns

[Enter A, B, C, or D]`,
    options: ['A', 'B', 'C', 'D']
  },

  Q3_GOALS: {
    text: `Question 3 of 3: Your Goals Here
─────────────────────────────────

What brings you to this workspace?

A) Learn the basics and start building
B) Understand the architecture and patterns
C) Evaluate stock vs. custom modifications
D) Extend the system with custom capabilities

[Enter A, B, C, or D]`,
    options: ['A', 'B', 'C', 'D']
  }
};

const ROUTING_MATRIX = {
  // Q1 + Q2 → Proficiency (without Q3)
  'AA': PROFICIENCY_LEVELS.BEGINNER,
  'AB': PROFICIENCY_LEVELS.BEGINNER,
  'BA': PROFICIENCY_LEVELS.BEGINNER,
  'BB': PROFICIENCY_LEVELS.INTERMEDIATE,
  'CB': PROFICIENCY_LEVELS.INTERMEDIATE,
  'CC': PROFICIENCY_LEVELS.INTERMEDIATE,

  // Q1 + Q2 + Q3 → Proficiency (for advanced users)
  'CDA': PROFICIENCY_LEVELS.INTERMEDIATE,
  'DCB': PROFICIENCY_LEVELS.ADVANCED,
  'DDB': PROFICIENCY_LEVELS.ADVANCED,
  'DDC': PROFICIENCY_LEVELS.EXPERT,
  'DDD': PROFICIENCY_LEVELS.EXPERT
};

/**
 * Generate initial greeting with feature explorer
 */
function generateGreeting() {
  return `╔══════════════════════════════════════════════════════════╗
║           Welcome to Common-Thread Workspace             ║
╚══════════════════════════════════════════════════════════╝

Before we assess your experience level, let's explore the impressive
capabilities of this workspace. This overview highlights features that
demonstrate large-scale high-quality work coordination.

${featureExplorer.generateMainOverview()}

──────────────────────────────────────────────────────────
After exploring features, we'll assess your proficiency level
to tailor the tour to your needs.`;
}

/**
 * Show feature explorer interface
 */
function showFeatureExplorer() {
  return {
    overview: featureExplorer.generateMainOverview(),
    getFeatureDetail: (featureId) => featureExplorer.generateFeatureDetail(featureId),
    getSkillsCatalog: () => featureExplorer.generateCustomSkillsCatalog(),
    getStockVsCustom: () => featureExplorer.generateStockVsCustomBreakdown(),
    parseInput: (input) => featureExplorer.parseUserInput(input),
    help: featureExplorer.generateHelp()
  };
}

/**
 * Generate manual selection menu
 */
function generateManualMenu() {
  return `──────────────────────────────────────────────────────
Or skip the questionnaire and choose your level:

1. Beginner - "I'm new to AI agents and Claude Code"
2. Intermediate - "I know Claude Code, new to this workspace"
3. Advanced - "I want architectural depth and patterns"
4. Expert - "Show me the full technical details"

[Enter 1, 2, 3, or 4]
──────────────────────────────────────────────────────`;
}

/**
 * Determine if Q3 is needed based on Q1 and Q2
 */
function needsQuestion3(q1, q2) {
  // Q3 only for advanced signals (Q1:D or Q2:D)
  return (q1 === 'D' || q2 === 'D');
}

/**
 * Route to proficiency level based on responses
 */
function routeToProficiency(q1, q2, q3 = null) {
  // Build routing key
  let key = q1 + q2;
  if (q3) {
    key += q3;
  }

  // Lookup in matrix
  let proficiency = ROUTING_MATRIX[key];

  // Default to Intermediate if ambiguous
  if (!proficiency) {
    proficiency = PROFICIENCY_LEVELS.INTERMEDIATE;
  }

  return proficiency;
}

/**
 * Generate proficiency confirmation message
 */
function generateConfirmation(proficiency, responses) {
  const descriptions = {
    beginner: 'Beginner pathway - We\'ll start with the basics and build from there.',
    intermediate: 'Intermediate pathway - Practical patterns and workflows.',
    advanced: 'Advanced pathway - Architectural depth and customization.',
    expert: 'Expert pathway - Full technical details and contribution guide.'
  };

  return `Based on your responses, I'm routing you to:

${descriptions[proficiency]}

You can switch levels anytime with: /tour jump [level]

Ready to begin? (Y/n)`;
}

/**
 * Validate user response
 */
function validateResponse(response, validOptions) {
  const normalized = response.trim().toUpperCase();

  if (validOptions.includes(normalized)) {
    return { valid: true, value: normalized };
  }

  return {
    valid: false,
    error: `Please enter ${validOptions.join(', ')}, or type 'skip' to see the manual selection menu.`
  };
}

/**
 * Parse manual selection
 */
function parseManualSelection(input) {
  const map = {
    '1': PROFICIENCY_LEVELS.BEGINNER,
    '2': PROFICIENCY_LEVELS.INTERMEDIATE,
    '3': PROFICIENCY_LEVELS.ADVANCED,
    '4': PROFICIENCY_LEVELS.EXPERT
  };

  const normalized = input.trim();
  return map[normalized] || null;
}

/**
 * Full intake flow orchestration
 */
function conductIntake() {
  return {
    greeting: generateGreeting(),
    featureExplorer: showFeatureExplorer(),
    manualMenu: generateManualMenu(),
    questions: QUESTIONS,
    needsQuestion3,
    routeToProficiency,
    validateResponse,
    parseManualSelection,
    generateConfirmation
  };
}

module.exports = {
  PROFICIENCY_LEVELS,
  QUESTIONS,
  ROUTING_MATRIX,
  generateGreeting,
  generateManualMenu,
  showFeatureExplorer,
  needsQuestion3,
  routeToProficiency,
  generateConfirmation,
  validateResponse,
  parseManualSelection,
  conductIntake
};
