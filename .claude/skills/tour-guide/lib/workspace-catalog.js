/**
 * Workspace Catalog - Complete Folder and Feature Inventory
 *
 * Provides structured access to workspace organization and capabilities
 * for tour-guide to reference during tours.
 */

const WORKSPACE_STRUCTURE = {
  '.claude': {
    description: 'Claude Code configuration and extensions',
    importance: 'critical',
    tourStops: ['beginner', 'intermediate', 'advanced'],
    contents: {
      'agents/': '80+ agent definitions organized by category',
      'skills/': '32 skills (main capabilities)',
      'commands/': '40+ slash commands',
      'hooks/': 'Hook system (auto-fire coordination)',
      'settings.json': 'Main settings (native hooks config)'
    }
  },

  '.swarm': {
    description: 'Core infrastructure (memory, backups, coordination)',
    importance: 'critical',
    tourStops: ['intermediate', 'advanced', 'expert'],
    contents: {
      'memory.db': 'SQLite database (111MB, 68,219 entries)',
      'backups/': '49 session snapshots',
      'captains-log.md': 'Human-readable decision journal',
      'metrics/': 'Performance metrics'
    }
  },

  'sessions': {
    description: 'Session workspaces (isolated project folders)',
    importance: 'critical',
    tourStops: ['beginner', 'intermediate', 'advanced'],
    contents: {
      'session-YYYYMMDD-HHMMSS-topic/': 'Individual session directories',
      'artifacts/': 'Contains: code/, tests/, docs/, scripts/, notes/',
      'captains-log/': 'Daily decision journal',
      '.archive/': 'Closed sessions'
    }
  },

  'docs': {
    description: 'Documentation organized by workflow stage',
    importance: 'high',
    tourStops: ['beginner', 'intermediate', 'advanced'],
    contents: {
      'setup/': 'Getting started (4 docs)',
      'operate/': 'Daily workflows (9 docs)',
      'build/': 'Creation & extension (5 docs)',
      'coordinate/': 'Multi-agent orchestration (9 docs)',
      'reference/': 'Architecture & catalogs (4 docs)'
    }
  },

  '.hive-mind': {
    description: 'Hive-Mind coordination system',
    importance: 'medium',
    tourStops: ['advanced', 'expert'],
    contents: {
      'hive.db': 'SQLite coordination database (364KB)',
      'sessions/': '25 coordination sessions',
      'config/': 'Hive configuration'
    }
  },

  'inbox': {
    description: 'External agent integration staging',
    importance: 'low',
    tourStops: [],
    contents: {
      'gemini-agent/': 'Google Gemini contributions',
      'cursor-agent/': 'Cursor editor contributions',
      'user/': 'User-provided materials'
    }
  }
};

const CORE_FEATURES = {
  'parallel-execution': {
    name: 'Parallel Agent Execution',
    description: 'Spawn multiple agents concurrently in a single message',
    benefit: '10-20x faster than sequential spawning',
    pathways: ['beginner', 'intermediate', 'advanced']
  },

  'memory-coordination': {
    name: 'Memory Coordination System',
    description: 'Persistent cross-session memory for agent coordination',
    stats: '68,219 entries, 15 active namespaces',
    pathways: ['intermediate', 'advanced', 'expert']
  },

  'session-management': {
    name: 'Session Management (Containment-Promotion)',
    description: 'Isolated workspaces for all AI-generated content',
    lifecycle: ['Auto-initialize', 'Work phase', 'Closeout', 'Promotion'],
    pathways: ['beginner', 'intermediate', 'advanced']
  },

  'hooks-system': {
    name: 'Hooks System (Auto-Fire Coordination)',
    description: 'Automatic pre/post operation coordination via Claude Code native hooks',
    configuration: '.claude/settings.json',
    pathways: ['intermediate', 'advanced', 'expert']
  },

  'swarm-topologies': {
    name: 'Swarm Topologies (4 Types)',
    description: 'Multiple coordination patterns for different use cases',
    types: ['Mesh (peer-to-peer)', 'Hierarchical (tree)', 'Star (centralized)', 'Ring (circular)'],
    pathways: ['intermediate', 'advanced', 'expert']
  },

  'neural-training': {
    name: 'Neural Network Training (27+ Models)',
    description: 'Train and deploy neural networks with WASM acceleration',
    features: ['27+ models', 'WASM SIMD acceleration', 'Distributed training'],
    pathways: ['advanced', 'expert']
  }
};

const SKILLS_CATALOG = {
  'core-workflow': {
    category: 'Core Workflow',
    skills: [
      { name: 'session-closeout', description: 'Natural language session closeout with HITL approval' },
      { name: 'meta-skill', description: 'Intelligent skill routing via natural language and menus' },
      { name: 'file-routing', description: 'AI self-check for CLAUDE.md file routing compliance' },
      { name: 'prompt-improver', description: 'Enhance prompt quality with security validation' },
      { name: 'hooks-automation', description: 'Automated coordination and learning from operations' }
    ]
  },

  'learning': {
    category: 'Learning & Education',
    skills: [
      { name: 'tutor-mode', description: 'Adaptive learning guide with workspace awareness' },
      { name: 'skill-builder', description: 'Create new Claude Code Skills with proper structure' },
      { name: 'pair-programming', description: 'AI-assisted pair programming with verification' }
    ]
  },

  'multi-agent': {
    category: 'Multi-Agent Coordination',
    skills: [
      { name: 'swarm-orchestration', description: 'Orchestrate multi-agent swarms for parallel execution' },
      { name: 'swarm-advanced', description: 'Advanced swarm patterns for complex workflows' },
      { name: 'hive-mind-advanced', description: 'Queen-led collective intelligence with consensus' },
      { name: 'stream-chain', description: 'Stream-JSON chaining for multi-agent pipelines' }
    ]
  }
};

const AGENT_CATALOG = {
  core: ['researcher', 'coder', 'tester', 'planner', 'reviewer'],
  swarm: ['hierarchical-coordinator', 'mesh-coordinator', 'adaptive-coordinator'],
  consensus: ['byzantine-coordinator', 'raft-manager', 'gossip-coordinator'],
  hivemind: ['queen', 'worker', 'scout', 'memory-manager'],
  github: ['pr-manager', 'code-review-swarm', 'issue-tracker', 'release-manager'],
  sparc: ['specification', 'pseudocode', 'architecture', 'refinement'],
  specialized: ['backend-dev', 'mobile-dev', 'ml-developer', 'cicd-engineer', 'system-architect']
};

/**
 * Get workspace structure information
 */
function getStructure(folderPath = null) {
  if (folderPath) {
    return WORKSPACE_STRUCTURE[folderPath] || null;
  }
  return WORKSPACE_STRUCTURE;
}

/**
 * Get features by pathway
 */
function getFeaturesByPathway(pathwayId) {
  return Object.entries(CORE_FEATURES)
    .filter(([_, feature]) => feature.pathways.includes(pathwayId))
    .map(([id, feature]) => ({ id, ...feature }));
}

/**
 * Get all features
 */
function getAllFeatures() {
  return CORE_FEATURES;
}

/**
 * Get skills by category
 */
function getSkillsByCategory(category = null) {
  if (category) {
    return SKILLS_CATALOG[category] || null;
  }
  return SKILLS_CATALOG;
}

/**
 * Get agents by category
 */
function getAgentsByCategory(category = null) {
  if (category) {
    return AGENT_CATALOG[category] || null;
  }
  return AGENT_CATALOG;
}

/**
 * Get tour stops for specific location
 */
function getTourStops(location) {
  const structure = WORKSPACE_STRUCTURE[location];
  return structure ? structure.tourStops : [];
}

/**
 * Search workspace catalog
 */
function search(query) {
  const normalized = query.toLowerCase().trim();
  const results = {
    folders: [],
    features: [],
    skills: [],
    agents: []
  };

  // Search folders
  Object.entries(WORKSPACE_STRUCTURE).forEach(([path, data]) => {
    if (path.toLowerCase().includes(normalized) ||
        data.description.toLowerCase().includes(normalized)) {
      results.folders.push({ path, ...data });
    }
  });

  // Search features
  Object.entries(CORE_FEATURES).forEach(([id, feature]) => {
    if (id.toLowerCase().includes(normalized) ||
        feature.name.toLowerCase().includes(normalized) ||
        feature.description.toLowerCase().includes(normalized)) {
      results.features.push({ id, ...feature });
    }
  });

  // Search skills
  Object.values(SKILLS_CATALOG).forEach(category => {
    category.skills.forEach(skill => {
      if (skill.name.toLowerCase().includes(normalized) ||
          skill.description.toLowerCase().includes(normalized)) {
        results.skills.push(skill);
      }
    });
  });

  // Search agents
  Object.entries(AGENT_CATALOG).forEach(([category, agents]) => {
    agents.forEach(agent => {
      if (agent.toLowerCase().includes(normalized)) {
        results.agents.push({ name: agent, category });
      }
    });
  });

  return results;
}

module.exports = {
  WORKSPACE_STRUCTURE,
  CORE_FEATURES,
  SKILLS_CATALOG,
  AGENT_CATALOG,
  getStructure,
  getFeaturesByPathway,
  getAllFeatures,
  getSkillsByCategory,
  getAgentsByCategory,
  getTourStops,
  search
};
