#!/usr/bin/env node
/**
 * Agent Prompt Templates with Embedded Hooks
 * Every agent spawn includes coordination instructions
 *
 * Stock dependencies: claude-flow agent types
 */

const { storeDecision } = require('./always-on-hooks');

/**
 * Agent template registry
 */
const AGENT_TEMPLATES = {
  'researcher': {
    role: 'Research Agent',
    capabilities: ['analysis', 'documentation', 'patterns'],
    hookInstructions: `
BEFORE starting research:
  node sessions/$SESSION_ID/iteration-3/artifacts/code/always-on-hooks.js agent:spawn "Research: {topic}"

DURING research:
  - Store findings: node sessions/$SESSION_ID/iteration-3/artifacts/code/always-on-hooks.js decision:made
  - Save to: sessions/$SESSION_ID/artifacts/docs/

AFTER completing research:
  node sessions/$SESSION_ID/iteration-3/artifacts/code/always-on-hooks.js agent:complete
`
  },

  'coder': {
    role: 'Implementation Agent',
    capabilities: ['coding', 'testing', 'debugging'],
    hookInstructions: `
BEFORE coding:
  node sessions/$SESSION_ID/iteration-3/artifacts/code/always-on-hooks.js agent:spawn "Code: {feature}"

DURING coding:
  - ALL code goes to: sessions/$SESSION_ID/artifacts/code/
  - Auto-hooks fire on file writes
  - Store decisions: node sessions/$SESSION_ID/iteration-3/artifacts/code/always-on-hooks.js decision:made

AFTER completing code:
  node sessions/$SESSION_ID/iteration-3/artifacts/code/always-on-hooks.js agent:complete
`
  },

  'tester': {
    role: 'Test Engineer',
    capabilities: ['testing', 'validation', 'quality-assurance'],
    hookInstructions: `
BEFORE testing:
  node sessions/$SESSION_ID/iteration-3/artifacts/code/always-on-hooks.js agent:spawn "Test: {component}"

DURING testing:
  - ALL tests go to: sessions/$SESSION_ID/artifacts/tests/
  - Store results: node sessions/$SESSION_ID/iteration-3/artifacts/code/always-on-hooks.js decision:made
  - Train patterns: node sessions/$SESSION_ID/iteration-3/artifacts/code/always-on-hooks.js pattern:learned

AFTER completing tests:
  node sessions/$SESSION_ID/iteration-3/artifacts/code/always-on-hooks.js agent:complete
`
  },

  'reviewer': {
    role: 'Code Reviewer',
    capabilities: ['review', 'quality-check', 'security'],
    hookInstructions: `
BEFORE review:
  node sessions/$SESSION_ID/iteration-3/artifacts/code/always-on-hooks.js agent:spawn "Review: {component}"

DURING review:
  - Store findings: node sessions/$SESSION_ID/iteration-3/artifacts/code/always-on-hooks.js decision:made
  - Report to: sessions/$SESSION_ID/artifacts/docs/
  - Train from corrections: node sessions/$SESSION_ID/iteration-3/artifacts/code/always-on-hooks.js pattern:learned

AFTER completing review:
  node sessions/$SESSION_ID/iteration-3/artifacts/code/always-on-hooks.js agent:complete
`
  },

  'coordinator': {
    role: 'Queen Coordinator',
    capabilities: ['orchestration', 'resource-allocation', 'governance'],
    hookInstructions: `
BEFORE coordinating:
  node sessions/$SESSION_ID/iteration-3/artifacts/code/always-on-hooks.js agent:spawn "Coordinate: {mission}"

DURING coordination:
  - Issue directives: node sessions/$SESSION_ID/iteration-3/artifacts/code/always-on-hooks.js decision:made
  - Monitor progress: Check sessions/$SESSION_ID/session-summary.md
  - Allocate resources: Store in hive/resource-allocation

AFTER completing coordination:
  node sessions/$SESSION_ID/iteration-3/artifacts/code/always-on-hooks.js agent:complete
`
  }
};

/**
 * Generate agent prompt with embedded hooks
 */
function generateAgentPrompt(agentType, task, sessionId) {
  const template = AGENT_TEMPLATES[agentType] || AGENT_TEMPLATES['coder'];

  const prompt = `
You are a ${template.role} with capabilities: ${template.capabilities.join(', ')}.

TASK: ${task}

SESSION: ${sessionId}
ARTIFACTS: sessions/${sessionId}/artifacts/

COORDINATION PROTOCOL (AUTOMATIC):
${template.hookInstructions}

CRITICAL RULES:
1. ALL files go to session artifacts (see ARTIFACTS path above)
2. Hooks fire automatically during work
3. Never write to root directories
4. Store decisions in memory via hooks
5. Train patterns from outcomes

Begin your work following the protocol above.
`.trim();

  return prompt;
}

/**
 * Spawn agent with embedded hook instructions
 */
async function spawnAgent(agentType, task, agentId) {
  const sessionId = process.env.SESSION_ID;
  if (!sessionId) {
    throw new Error('No active session - run session-auto-init.js first');
  }

  // Generate prompt with hooks
  const prompt = generateAgentPrompt(agentType, task, sessionId);

  // Store agent spawn decision
  await storeDecision(`agent-spawn-${agentId}`, {
    agentType,
    task,
    sessionId,
    timestamp: new Date().toISOString()
  });

  // Return prompt for Task tool
  return {
    agentId,
    agentType,
    prompt,
    sessionId
  };
}

/**
 * List available agent templates
 */
function listAgentTemplates() {
  console.log('📋 Available Agent Templates:\n');
  Object.entries(AGENT_TEMPLATES).forEach(([type, template]) => {
    console.log(`  ${type}: ${template.role}`);
    console.log(`    Capabilities: ${template.capabilities.join(', ')}\n`);
  });
}

// Export functions
module.exports = {
  generateAgentPrompt,
  spawnAgent,
  listAgentTemplates,
  AGENT_TEMPLATES
};

// CLI usage
if (require.main === module) {
  const [command, agentType, task] = process.argv.slice(2);

  if (command === 'list') {
    listAgentTemplates();
  } else if (command === 'generate' && agentType && task) {
    const sessionId = process.env.SESSION_ID || 'test-session';
    console.log(generateAgentPrompt(agentType, task, sessionId));
  } else {
    console.log('Usage:');
    console.log('  node agent-templates.js list');
    console.log('  node agent-templates.js generate <type> "<task>"');
  }
}
