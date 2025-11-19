#!/usr/bin/env node

/**
 * Diagnostic Test - Why is NL matching at 60%?
 * Investigate semantic matching failures
 */

const MetaSkillCoordinator = require('../code/meta-skill/lib/coordinator');
const SkillRegistry = require('../code/meta-skill/lib/skill-registry');
const SemanticMatcher = require('../code/meta-skill/lib/semantic-matcher');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');

const MOCK_SKILLS = [
  {
    id: 'prompt-improver',
    name: 'Prompt Improver',
    description: 'Optimize and enhance AI prompts for better results',
    category: 'Performance & Optimization'
  },
  {
    id: 'tutor-mode',
    name: 'Tutor Mode',
    description: 'Adaptive learning guide with workspace documentation awareness',
    category: 'Learning & Development'
  },
  {
    id: 'github-code-review',
    name: 'GitHub Code Review',
    description: 'Comprehensive GitHub code review with AI-powered swarm coordination',
    category: 'GitHub Integration'
  },
  {
    id: 'swarm-orchestration',
    name: 'Swarm Orchestration',
    description: 'Multi-agent workflows and coordination for complex tasks',
    category: 'Multi-Agent Coordination'
  },
  {
    id: 'agentdb-optimization',
    name: 'AgentDB Optimization',
    description: 'Optimize AgentDB performance with quantization and HNSW indexing',
    category: 'Database & Memory'
  }
];

async function diagnose() {
  // Setup
  const testDir = path.join(os.tmpdir(), `meta-diagnostic-${Date.now()}`);
  await fs.mkdir(testDir, { recursive: true });

  for (const skill of MOCK_SKILLS) {
    const skillDir = path.join(testDir, skill.id);
    await fs.mkdir(skillDir, { recursive: true });
    await fs.writeFile(
      path.join(skillDir, 'SKILL.md'),
      `---
name: ${skill.name}
description: ${skill.description}
category: ${skill.category}
version: 1.0.0
---

# ${skill.name}

Test skill.`
    );
  }

  const coordinator = new MetaSkillCoordinator();
  coordinator.registry = new SkillRegistry();
  await coordinator.registry.scanDirectory(testDir);
  coordinator.matcher = new SemanticMatcher(coordinator.registry);
  coordinator.initialized = true;

  console.log('🔍 DIAGNOSTIC: Semantic Matching Analysis\n');
  console.log('═'.repeat(70));

  const testQueries = [
    { query: 'help me optimize my prompts', expected: 'prompt-improver' },
    { query: 'I want to learn about claude flow', expected: 'tutor-mode' },
    { query: 'review my code on github', expected: 'github-code-review' },
    { query: 'coordinate multiple agents', expected: 'swarm-orchestration' },
    { query: 'improve database performance', expected: 'agentdb-optimization' }
  ];

  for (const { query, expected } of testQueries) {
    console.log(`\n📝 Query: "${query}"`);
    console.log(`   Expected: ${expected}`);

    // Extract keywords
    const keywords = coordinator.matcher.extractKeywords(query);
    console.log(`   Keywords: [${keywords.join(', ')}]`);

    // Get matches
    const matches = coordinator.matcher.match(query, 0.0);

    console.log(`   Matches found: ${matches.length}`);
    matches.slice(0, 3).forEach((match, i) => {
      console.log(`     ${i + 1}. ${match.skill.id} (${(match.score * 100).toFixed(1)}%)`);
      console.log(`        Matched keywords: [${match.matchedKeywords.join(', ')}]`);
    });

    const topMatch = matches[0];
    if (topMatch && topMatch.skill.id === expected) {
      console.log(`   ✅ CORRECT: Top match is ${expected}`);
    } else {
      console.log(`   ❌ INCORRECT: Expected ${expected}, got ${topMatch ? topMatch.skill.id : 'none'}`);

      // Debug why expected skill didn't match
      const expectedSkill = coordinator.registry.get(expected);
      console.log(`   🔍 Debug: Why didn't ${expected} match?`);
      console.log(`      Skill tags: [${expectedSkill.tags.join(', ')}]`);
      console.log(`      Query keywords: [${keywords.join(', ')}]`);

      // Find overlap
      const overlap = keywords.filter(k => expectedSkill.tags.includes(k));
      console.log(`      Keyword overlap: [${overlap.join(', ')}] (${overlap.length} matches)`);
    }
  }

  console.log('\n═'.repeat(70));

  // Cleanup
  await fs.rm(testDir, { recursive: true, force: true });
}

diagnose().catch(console.error);
