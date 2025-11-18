#!/usr/bin/env node

/**
 * Queen Behavior Engines Demo
 *
 * Demonstrates auto-selection and decision-making for different project types
 */

const QueenSelector = require('./queen-selector');

const selector = new QueenSelector();

// Test scenarios
const scenarios = [
  {
    name: 'Enterprise Architecture Project',
    context: {
      projectType: 'architecture',
      agentCount: 15,
      quality: 'critical',
      priority: 'medium',
      risk: 'high',
      innovation: 'medium',
      dependencies: Array(20).fill('module'),
      stakeholders: ['cto', 'tech-leads', 'architects', 'security']
    }
  },
  {
    name: 'Critical Bug Fix',
    context: {
      projectType: 'bugfix',
      agentCount: 3,
      priority: 'critical',
      deadline: 'immediate',
      wellUnderstood: true,
      quality: 'medium',
      risk: 'medium'
    }
  },
  {
    name: 'Research Prototype',
    context: {
      projectType: 'research',
      innovation: 'high',
      predictability: 'low',
      agentCount: 7,
      priority: 'medium',
      quality: 'medium',
      unknowns: 8
    }
  },
  {
    name: 'Feature Development',
    context: {
      projectType: 'feature',
      agentCount: 6,
      priority: 'high',
      quality: 'high',
      deadline: 'urgent',
      wellUnderstood: false,
      innovation: 'medium'
    }
  },
  {
    name: 'Infrastructure Migration',
    context: {
      projectType: 'infrastructure',
      agentCount: 10,
      quality: 'critical',
      priority: 'medium',
      risk: 'high',
      technicalDebt: 'high',
      dependencies: Array(30).fill('system')
    }
  }
];

console.log('🔮 Queen Behavior Engines Demo\n');
console.log('='.repeat(80));

for (const scenario of scenarios) {
  console.log(`\n📋 Scenario: ${scenario.name}`);
  console.log('-'.repeat(80));

  const result = selector.selectQueen(scenario.context);

  console.log(`\n👑 Selected Queen: ${result.queenType.toUpperCase()}`);
  console.log(`\n📊 Analysis:`);
  console.log(`   Complexity: ${(result.analysis.complexity * 100).toFixed(0)}%`);
  console.log(`   Urgency: ${(result.analysis.urgency * 100).toFixed(0)}%`);
  console.log(`   Scale: ${(result.analysis.scale * 100).toFixed(0)}%`);
  console.log(`   Risk: ${result.analysis.riskProfile}`);
  console.log(`   Quality: ${result.analysis.qualityRequirements}`);
  console.log(`   Innovation: ${result.analysis.innovationLevel}`);
  console.log(`   Predictability: ${(result.analysis.predictability * 100).toFixed(0)}%`);

  console.log(`\n💡 Rationale: ${result.rationale.queenType}`);
  console.log(`   Approach: ${result.rationale.approach}`);
  console.log(`\n   Reasons:`);
  result.rationale.reasons.forEach(reason => {
    console.log(`   • ${reason}`);
  });

  console.log(`\n   Strengths:`);
  result.rationale.strengths.forEach(strength => {
    console.log(`   • ${strength}`);
  });

  console.log('\n' + '-'.repeat(80));
}

console.log('\n📈 Selection Statistics:\n');
const stats = selector.getStatistics();
console.log(`Total Selections: ${stats.totalSelections}`);
console.log(`\nDistribution:`);
console.log(`   Strategic: ${stats.distribution.strategic || 0}`);
console.log(`   Tactical: ${stats.distribution.tactical || 0}`);
console.log(`   Adaptive: ${stats.distribution.adaptive || 0}`);

console.log('\n' + '='.repeat(80));
console.log('✅ Demo Complete\n');
