/**
 * Tests for PromptAnalyzer
 *
 * Covers mode detection, quality scoring, and edge cases
 */

const { PromptAnalyzer } = require('../../../../../.claude/skills/prompt-improver/lib/analyzer');
const assert = require('assert');

describe('PromptAnalyzer', () => {
  let analyzer;

  beforeEach(() => {
    analyzer = new PromptAnalyzer();
  });

  describe('Mode Detection', () => {
    it('should detect hive mode from "hive" keyword', () => {
      const prompt = 'Use hive mind to coordinate agents';
      const mode = analyzer.detectMode(prompt);
      assert.strictEqual(mode, 'hive');
    });

    it('should detect hive mode from "queen" keyword', () => {
      const prompt = 'Spawn a queen agent to lead the team';
      const mode = analyzer.detectMode(prompt);
      assert.strictEqual(mode, 'hive');
    });

    it('should detect hive mode from "consensus" keyword', () => {
      const prompt = 'Use consensus mechanism for decision making';
      const mode = analyzer.detectMode(prompt);
      assert.strictEqual(mode, 'hive');
    });

    it('should detect hive mode from "byzantine" keyword', () => {
      const prompt = 'Implement byzantine fault tolerance';
      const mode = analyzer.detectMode(prompt);
      assert.strictEqual(mode, 'hive');
    });

    it('should detect swarm mode from "swarm" keyword', () => {
      const prompt = 'Create a swarm of agents';
      const mode = analyzer.detectMode(prompt);
      assert.strictEqual(mode, 'swarm');
    });

    it('should detect swarm mode from "spawn" keyword', () => {
      const prompt = 'Spawn multiple agents to handle this';
      const mode = analyzer.detectMode(prompt);
      assert.strictEqual(mode, 'swarm');
    });

    it('should detect swarm mode from "topology" keyword', () => {
      const prompt = 'Use mesh topology for coordination';
      const mode = analyzer.detectMode(prompt);
      assert.strictEqual(mode, 'swarm');
    });

    it('should detect swarm mode from "hierarchical" keyword', () => {
      const prompt = 'Set up hierarchical agent structure';
      const mode = analyzer.detectMode(prompt);
      assert.strictEqual(mode, 'swarm');
    });

    it('should detect wizard mode from "wizard" keyword', () => {
      const prompt = 'Use the wizard to guide me through this';
      const mode = analyzer.detectMode(prompt);
      assert.strictEqual(mode, 'wizard');
    });

    it('should detect wizard mode from "guided" keyword', () => {
      const prompt = 'Need guided assistance for this task';
      const mode = analyzer.detectMode(prompt);
      assert.strictEqual(mode, 'wizard');
    });

    it('should detect wizard mode from "step-by-step" keyword', () => {
      const prompt = 'Walk me through this step-by-step';
      const mode = analyzer.detectMode(prompt);
      assert.strictEqual(mode, 'wizard');
    });

    it('should detect wizard mode from "interactive" keyword', () => {
      const prompt = 'I want interactive help with this';
      const mode = analyzer.detectMode(prompt);
      assert.strictEqual(mode, 'wizard');
    });

    it('should default to direct mode for simple requests', () => {
      const prompt = 'Create a REST API';
      const mode = analyzer.detectMode(prompt);
      assert.strictEqual(mode, 'direct');
    });

    it('should detect swarm for multi-agent indicators', () => {
      const prompt = 'Build frontend and backend components';
      const mode = analyzer.detectMode(prompt);
      assert.strictEqual(mode, 'swarm');
    });

    it('should handle mixed mode signals (hive takes precedence)', () => {
      const prompt = 'Use hive mind with swarm topology';
      const mode = analyzer.detectMode(prompt);
      assert.strictEqual(mode, 'hive');
    });

    it('should handle case insensitivity', () => {
      const prompt = 'SWARM of AGENTS should handle this';
      const mode = analyzer.detectMode(prompt);
      assert.strictEqual(mode, 'swarm');
    });

    it('should handle ambiguous prompts with coordination keywords', () => {
      const prompt = 'Multiple teams need to coordinate and work together';
      const mode = analyzer.detectMode(prompt);
      assert.strictEqual(mode, 'swarm');
    });
  });

  describe('Structure Analysis', () => {
    it('should score well-structured prompts highly', () => {
      const prompt = 'Build a REST API with authentication. Must support JWT tokens. Deliver OpenAPI spec. Use Express.js framework. First create routes, then add middleware, finally add tests.';
      const structure = analyzer._analyzeStructure(prompt);
      assert.ok(structure.score >= 0.8, `Expected score >= 0.8, got ${structure.score}`);
      assert.strictEqual(structure.elements.hasGoal, true);
      assert.strictEqual(structure.elements.hasConstraints, true);
      assert.strictEqual(structure.elements.hasDeliverables, true);
      assert.strictEqual(structure.elements.hasSteps, true);
    });

    it('should score vague prompts poorly', () => {
      const prompt = 'Make it work';
      const structure = analyzer._analyzeStructure(prompt);
      assert.ok(structure.score <= 0.4, `Expected score <= 0.4, got ${structure.score}`);
    });

    it('should identify missing structural elements', () => {
      const prompt = 'Create an API';
      const structure = analyzer._analyzeStructure(prompt);
      assert.ok(structure.missing.length > 0);
      assert.ok(structure.missing.includes('Constraints') ||
                structure.missing.includes('Deliverables') ||
                structure.missing.includes('Steps'));
    });

    it('should handle prompts with goals but no steps', () => {
      const prompt = 'Build a secure authentication system';
      const structure = analyzer._analyzeStructure(prompt);
      assert.strictEqual(structure.elements.hasGoal, true);
      assert.strictEqual(structure.elements.hasSteps, false);
    });
  });

  describe('Clarity Analysis', () => {
    it('should score clear prompts highly', () => {
      const prompt = 'Implement JWT authentication middleware in Express.js';
      const clarity = analyzer._analyzeClarity(prompt);
      assert.ok(clarity.score >= 0.9, `Expected clarity score >= 0.9, got ${clarity.score}`);
      assert.strictEqual(clarity.ambiguousTerms.length, 0);
    });

    it('should detect ambiguous terms "it"', () => {
      const prompt = 'Fix it and make it work properly';
      const clarity = analyzer._analyzeClarity(prompt);
      assert.ok(clarity.ambiguousTerms.includes('it'));
      assert.ok(clarity.score < 0.9);
    });

    it('should detect ambiguous terms "thing"', () => {
      const prompt = 'Build that thing we discussed';
      const clarity = analyzer._analyzeClarity(prompt);
      assert.ok(clarity.ambiguousTerms.includes('that') || clarity.ambiguousTerms.includes('thing'));
    });

    it('should detect multiple ambiguous terms', () => {
      const prompt = 'Fix that thing and make it work with stuff from etc';
      const clarity = analyzer._analyzeClarity(prompt);
      assert.ok(clarity.ambiguousTerms.length >= 3);
      assert.ok(clarity.score < 0.6);
    });

    it('should provide clarity recommendations', () => {
      const prompt = 'Do something with that';
      const clarity = analyzer._analyzeClarity(prompt);
      assert.ok(clarity.recommendation.includes('Clarify'));
    });

    it('should handle prompts with no ambiguous terms', () => {
      const prompt = 'Create REST API endpoints for user management using Express.js';
      const clarity = analyzer._analyzeClarity(prompt);
      assert.strictEqual(clarity.ambiguousTerms.length, 0);
      assert.strictEqual(clarity.clarityIssues, 0);
    });
  });

  describe('Specificity Analysis', () => {
    it('should score specific prompts highly', () => {
      const prompt = 'Implement JWT authentication with RS256 algorithm, 15-minute token expiry, and refresh token rotation';
      const specificity = analyzer._analyzeSpecificity(prompt);
      assert.ok(specificity.score >= 0.5, `Expected specificity score >= 0.5, got ${specificity.score}`);
      assert.ok(specificity.specificCount > 0);
    });

    it('should detect vague indicators', () => {
      const prompt = 'Create some basic features with general functionality';
      const specificity = analyzer._analyzeSpecificity(prompt);
      assert.ok(specificity.vagueCount > 0);
      assert.ok(specificity.score < 0.6);
    });

    it('should detect version numbers as specific indicators', () => {
      const prompt = 'Use Node.js v20.0 and Express v5.0';
      const specificity = analyzer._analyzeSpecificity(prompt);
      assert.ok(specificity.specificCount >= 2);
    });

    it('should detect numbers as specific indicators', () => {
      const prompt = 'Create 5 endpoints with 90% test coverage';
      const specificity = analyzer._analyzeSpecificity(prompt);
      assert.ok(specificity.specificCount >= 2);
    });

    it('should provide specificity recommendations', () => {
      const prompt = 'Build some simple API with basic features';
      const specificity = analyzer._analyzeSpecificity(prompt);
      assert.ok(specificity.recommendation.includes('specific'));
    });
  });

  describe('Quality Scoring', () => {
    it('should calculate high quality score for well-formed prompts', async () => {
      const prompt = 'Build REST API with Express.js. Must support authentication. Deliver OpenAPI spec and tests. First create models, then routes, finally middleware.';
      const analysis = await analyzer.analyze(prompt);
      assert.ok(analysis.qualityScore >= 0.7, `Expected quality >= 0.7, got ${analysis.qualityScore}`);
    });

    it('should calculate low quality score for vague prompts', async () => {
      const prompt = 'Make it work';
      const analysis = await analyzer.analyze(prompt);
      assert.ok(analysis.qualityScore < 0.4, `Expected quality < 0.4, got ${analysis.qualityScore}`);
    });

    it('should calculate medium quality score for partially formed prompts', async () => {
      const prompt = 'Build an API with authentication';
      const analysis = await analyzer.analyze(prompt);
      assert.ok(analysis.qualityScore >= 0.3 && analysis.qualityScore <= 0.7);
    });
  });

  describe('Intervention Threshold', () => {
    it('should pass through high quality prompts (>= 0.7)', async () => {
      const prompt = 'Implement JWT authentication middleware in src/auth.js using jsonwebtoken v9.0. Must validate tokens, handle expiry, and support refresh tokens. Include Jest tests with 90% coverage. Save to sessions/current/artifacts/code/';
      const analysis = await analyzer.analyze(prompt);
      assert.ok(analysis.qualityScore >= 0.7);
      assert.ok(analysis.improvementPotential < 0.3);
    });

    it('should suggest improvements for medium quality prompts (0.4-0.7)', async () => {
      const prompt = 'Build an authentication API with some security features';
      const analysis = await analyzer.analyze(prompt);
      assert.ok(analysis.qualityScore >= 0.4 && analysis.qualityScore < 0.7);
      assert.ok(analysis.improvementPotential > 0);
    });

    it('should require intervention for low quality prompts (< 0.4)', async () => {
      const prompt = 'Fix that thing';
      const analysis = await analyzer.analyze(prompt);
      assert.ok(analysis.qualityScore < 0.4);
      assert.ok(analysis.improvementPotential > 0.6);
      assert.ok(analysis.criticalIssues.length > 0);
    });
  });

  describe('Critical Issues Detection', () => {
    it('should identify structural issues', async () => {
      const prompt = 'Do something';
      const analysis = await analyzer.analyze(prompt);
      const structuralIssues = analysis.criticalIssues.filter(i => i.type === 'structure');
      assert.ok(structuralIssues.length > 0);
    });

    it('should identify clarity issues', async () => {
      const prompt = 'Fix it and make that thing work with stuff and etc';
      const analysis = await analyzer.analyze(prompt);
      const clarityIssues = analysis.criticalIssues.filter(i => i.type === 'clarity');
      assert.ok(clarityIssues.length > 0);
    });

    it('should identify specificity issues', () => {
      const metrics = {
        structure: { score: 0.7 },
        clarity: { clarityIssues: 2 },
        specificity: { score: 0.2 }
      };
      const issues = analyzer._identifyCriticalIssues(metrics);
      const specificityIssues = issues.filter(i => i.type === 'specificity');
      assert.ok(specificityIssues.length > 0);
    });

    it('should not flag high-quality prompts', async () => {
      const prompt = 'Implement comprehensive JWT authentication system in src/auth/middleware.js using jsonwebtoken library. Requirements: RS256 signing, 15-minute access tokens, 7-day refresh tokens, token rotation, and blacklist support. Must include Jest tests with 95% coverage. Save all files to sessions/current/artifacts/code/';
      const analysis = await analyzer.analyze(prompt);
      assert.strictEqual(analysis.criticalIssues.length, 0);
    });
  });

  describe('Complexity Estimation', () => {
    it('should estimate low complexity for simple tasks', () => {
      const prompt = 'Create a hello world API';
      const complexity = analyzer._estimateComplexity(prompt);
      assert.ok(complexity < 0.3);
    });

    it('should estimate high complexity for technical tasks', () => {
      const prompt = 'Build a microservices architecture with API gateway, service mesh, distributed tracing, authentication, authorization, database sharding, caching, message queue, and deployment automation with monitoring and logging';
      const complexity = analyzer._estimateComplexity(prompt);
      assert.ok(complexity > 0.5);
    });

    it('should consider length in complexity', () => {
      const shortPrompt = 'Create API';
      const longPrompt = 'Create a comprehensive REST API with full CRUD operations, authentication, authorization, input validation, error handling, logging, monitoring, testing, documentation, and deployment configuration for production use';

      const shortComplexity = analyzer._estimateComplexity(shortPrompt);
      const longComplexity = analyzer._estimateComplexity(longPrompt);

      assert.ok(longComplexity > shortComplexity);
    });

    it('should consider multi-step indicators', () => {
      const prompt = 'First design the schema, then implement the API, after that add tests, before deploying run benchmarks, finally document the system';
      const complexity = analyzer._estimateComplexity(prompt);
      assert.ok(complexity > 0.3);
    });
  });

  describe('Agent Count Estimation', () => {
    it('should estimate 1 agent for direct mode', () => {
      const prompt = 'Create a simple function';
      const mode = 'direct';
      const count = analyzer._estimateAgentCount(prompt, mode);
      assert.strictEqual(count, 1);
    });

    it('should estimate multiple agents for multi-domain tasks', () => {
      const prompt = 'Build frontend, backend, database, and testing infrastructure';
      const mode = 'swarm';
      const count = analyzer._estimateAgentCount(prompt, mode);
      assert.ok(count >= 4);
    });

    it('should increase count for parallel work', () => {
      const prompt = 'Build frontend and backend concurrently';
      const mode = 'swarm';
      const count = analyzer._estimateAgentCount(prompt, mode);
      assert.ok(count >= 2);
    });

    it('should cap agent count at 10', () => {
      const prompt = 'Build frontend, backend, database, testing, deployment, security, documentation, analysis, monitoring, and logging systems';
      const mode = 'swarm';
      const count = analyzer._estimateAgentCount(prompt, mode);
      assert.ok(count <= 10);
    });
  });

  describe('Coordination Analysis', () => {
    it('should detect topology needs', () => {
      const prompt = 'Use mesh topology for agent coordination';
      const coordination = analyzer._analyzeCoordination(prompt);
      assert.strictEqual(coordination.topology, true);
    });

    it('should detect strategy needs', () => {
      const prompt = 'Execute tasks in parallel with adaptive strategy';
      const coordination = analyzer._analyzeCoordination(prompt);
      assert.strictEqual(coordination.strategy, true);
    });

    it('should detect memory coordination needs', () => {
      const prompt = 'Agents should share context via memory';
      const coordination = analyzer._analyzeCoordination(prompt);
      assert.strictEqual(coordination.memory, true);
    });

    it('should detect consensus needs', () => {
      const prompt = 'Use consensus voting for decisions';
      const coordination = analyzer._analyzeCoordination(prompt);
      assert.strictEqual(coordination.consensus, true);
    });

    it('should provide coordination recommendations', () => {
      const prompt = 'Build a distributed system';
      const coordination = analyzer._analyzeCoordination(prompt);
      assert.ok(coordination.recommendation.length > 0);
    });
  });

  describe('Context Extraction', () => {
    it('should extract file mentions', () => {
      const prompt = 'Update auth.js and config.json files';
      const context = analyzer._extractContext(prompt);
      assert.ok(context.files.includes('auth.js'));
      assert.ok(context.files.includes('config.json'));
    });

    it('should extract directory mentions', () => {
      const prompt = 'Save to src/components/ and tests/unit/';
      const context = analyzer._extractContext(prompt);
      assert.ok(context.directories.length > 0);
    });

    it('should extract technology mentions', () => {
      const prompt = 'Build with React, Node.js, and PostgreSQL';
      const context = analyzer._extractContext(prompt);
      assert.ok(context.technologies.includes('react'));
      assert.ok(context.technologies.includes('node'));
      assert.ok(context.technologies.includes('postgresql'));
    });

    it('should handle prompts with no context', () => {
      const prompt = 'Do something';
      const context = analyzer._extractContext(prompt);
      assert.ok(!context.files || context.files.length === 0);
      assert.ok(!context.directories || context.directories.length === 0);
      assert.ok(context.technologies.length === 0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty prompts', async () => {
      const prompt = '';
      const analysis = await analyzer.analyze(prompt);
      assert.ok(analysis.qualityScore < 0.3);
    });

    it('should handle very long prompts', async () => {
      const prompt = 'Create '.repeat(1000) + 'a REST API';
      const analysis = await analyzer.analyze(prompt);
      assert.ok(analysis !== null);
    });

    it('should handle special characters', async () => {
      const prompt = 'Build @#$%^ &*() API with !@# features';
      const analysis = await analyzer.analyze(prompt);
      assert.ok(analysis !== null);
    });

    it('should handle unicode characters', async () => {
      const prompt = 'Build 🚀 API with 💯 features';
      const analysis = await analyzer.analyze(prompt);
      assert.ok(analysis !== null);
    });

    it('should handle newlines and formatting', async () => {
      const prompt = `
        Build REST API
        - Authentication
        - Authorization
        - CRUD operations
      `;
      const analysis = await analyzer.analyze(prompt);
      assert.ok(analysis.qualityScore > 0);
    });
  });

  describe('Comprehensive Analysis', () => {
    it('should return all expected fields', async () => {
      const prompt = 'Build a REST API';
      const analysis = await analyzer.analyze(prompt);

      assert.ok(analysis.mode);
      assert.ok(analysis.structure);
      assert.ok(analysis.clarity);
      assert.ok(analysis.specificity);
      assert.ok(typeof analysis.complexity === 'number');
      assert.ok(typeof analysis.agentCount === 'number');
      assert.ok(analysis.coordination);
      assert.ok(analysis.context);
      assert.ok(typeof analysis.qualityScore === 'number');
      assert.ok(typeof analysis.improvementPotential === 'number');
      assert.ok(Array.isArray(analysis.criticalIssues));
      assert.ok(typeof analysis.timestamp === 'number');
    });

    it('should handle complex real-world prompt', async () => {
      const prompt = `
        Build a full-stack authentication system using:
        - Frontend: React with TypeScript
        - Backend: Node.js/Express with JWT
        - Database: PostgreSQL with Prisma ORM

        Requirements:
        1. User registration with email verification
        2. Login with remember me functionality
        3. Password reset flow
        4. OAuth integration (Google, GitHub)
        5. Role-based access control

        Deliverables:
        - Frontend components in src/components/auth/
        - Backend API in src/api/auth/
        - Database migrations in prisma/migrations/
        - Jest tests with 90% coverage
        - API documentation

        Save all files to sessions/current/artifacts/
      `;

      const analysis = await analyzer.analyze(prompt);
      assert.ok(analysis.qualityScore >= 0.7);
      assert.ok(analysis.structure.score > 0.7);
      assert.ok(analysis.context.technologies.length > 0);
    });
  });
});

// Helper function to run tests
async function runTests() {
  console.log('Running PromptAnalyzer Tests...\n');

  const tests = describe.tests;
  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      await test.fn();
      passed++;
      console.log(`✓ ${test.name}`);
    } catch (error) {
      failed++;
      console.log(`✗ ${test.name}`);
      console.log(`  ${error.message}`);
    }
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  return failed === 0;
}

// Simple test framework
const describe = (name, fn) => {
  const suite = { name, tests: [] };
  const it = (testName, testFn) => {
    suite.tests.push({ name: testName, fn: testFn });
  };

  const beforeEach = (fn) => {
    suite.beforeEach = fn;
  };

  fn.call({ it, beforeEach });
  describe.tests = suite.tests;
  return suite;
};

if (require.main === module) {
  runTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { describe };
