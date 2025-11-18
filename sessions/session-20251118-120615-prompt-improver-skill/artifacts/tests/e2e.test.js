/**
 * End-to-End Tests for Prompt Improver
 *
 * Tests complete workflows from analysis to acceptance
 */

const { PromptAnalyzer } = require('../../../../../.claude/skills/prompt-improver/lib/analyzer');
const { MemoryManager } = require('../../../../../.claude/skills/prompt-improver/lib/memory-manager');
const { LearningLog } = require('../../../../../.claude/skills/prompt-improver/lib/learning-log');
const { CaptainsLog } = require('../../../../../.claude/skills/prompt-improver/lib/captains-log');
const { ConfirmationHandler } = require('../../../../../.claude/skills/prompt-improver/lib/confirmation');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

describe('End-to-End Workflows', () => {
  let analyzer;
  let memory;
  let learningLog;
  let captainsLog;
  let confirmation;
  let testDir;

  beforeEach(() => {
    testDir = path.join(process.cwd(), '.prompt-improver-e2e-test');

    analyzer = new PromptAnalyzer();
    memory = new MemoryManager({
      useMcp: false,
      memoryNamespace: 'test-e2e'
    });
    learningLog = new LearningLog({
      learningLogPath: path.join(testDir, 'learning')
    });
    captainsLog = new CaptainsLog({
      captainsLogPath: path.join(testDir, 'captains-log')
    });
    confirmation = new ConfirmationHandler({
      autoApprove: true // For automated testing
    });
  });

  afterEach(() => {
    // Clean up test directories
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }

    const memoryDir = path.join(process.cwd(), '.prompt-improver-memory');
    if (fs.existsSync(memoryDir)) {
      fs.rmSync(memoryDir, { recursive: true, force: true });
    }
  });

  describe('High Quality Prompt - Pass Through', () => {
    it('should pass through without intervention', async () => {
      const prompt = `
        Implement JWT authentication system with following specs:
        - Algorithm: RS256
        - Access token: 15 min expiry
        - Refresh token: 7 day expiry with rotation
        - Token blacklist for logout
        - Rate limiting: 5 failed attempts per hour

        Tech stack:
        - Backend: Express.js v5.0
        - Library: jsonwebtoken v9.0
        - Storage: Redis for blacklist

        Deliverables:
        - Middleware in src/middleware/auth.js
        - Routes in src/routes/auth.js
        - Tests in tests/auth.test.js with 95% coverage
        - API documentation

        Save to sessions/current/artifacts/code/
      `;

      // Analyze
      const analysis = await analyzer.analyze(prompt);

      // High quality should pass threshold
      assert.ok(analysis.qualityScore >= 0.7,
        `Expected quality >= 0.7, got ${analysis.qualityScore}`);

      // Low improvement potential
      assert.ok(analysis.improvementPotential < 0.3,
        `Expected potential < 0.3, got ${analysis.improvementPotential}`);

      // No critical issues
      assert.strictEqual(analysis.criticalIssues.length, 0);

      // Should proceed without suggestions
      console.log('✓ High quality prompt passed through');
    });
  });

  describe('Medium Quality Prompt - Suggest Improvements', () => {
    it('should analyze, suggest, and apply improvements', async () => {
      const originalPrompt = 'Build an authentication API with security';

      // 1. Analyze prompt
      const analysis = await analyzer.analyze(originalPrompt);

      assert.ok(analysis.qualityScore >= 0.4 && analysis.qualityScore < 0.7,
        `Expected medium quality, got ${analysis.qualityScore}`);

      // 2. Generate suggestions based on analysis
      const suggestions = {
        structure: [],
        clarity: [],
        specificity: [],
        coordination: []
      };

      if (analysis.structure.score < 0.7) {
        suggestions.structure.push({
          type: 'add-tech-stack',
          priority: 'high',
          description: 'Specify technology stack (framework, libraries)'
        });
      }

      if (analysis.specificity.score < 0.6) {
        suggestions.specificity.push({
          type: 'add-auth-details',
          priority: 'high',
          description: 'Specify authentication mechanism (JWT, OAuth, session)'
        });
      }

      // 3. Get user confirmation (auto-approved in test)
      const confirmResult = await confirmation.confirm(
        originalPrompt,
        analysis,
        suggestions
      );

      assert.strictEqual(confirmResult.approved, true);
      assert.ok(confirmResult.userSelections);

      // 4. Apply improvements (simulated)
      const improvedPrompt = `
        Build REST API with JWT authentication:
        - Framework: Express.js
        - Auth mechanism: JWT with RS256
        - Token expiry: 15 minutes
        - Include refresh tokens

        Deliverables:
        - API endpoints in src/routes/
        - Auth middleware in src/middleware/
        - Tests with 90% coverage

        Save to sessions/current/artifacts/code/
      `;

      // 5. Record improvement in learning log
      await learningLog.record({
        originalPrompt,
        improvedPrompt,
        suggestions,
        userSelections: confirmResult.userSelections,
        qualityBefore: analysis.qualityScore,
        qualityAfter: 0.85 // Simulated improved quality
      });

      // 6. Store pattern in memory
      await memory.storePattern(analysis.mode, {
        prompt: originalPrompt,
        improvements: [
          'Added tech stack specification',
          'Added JWT authentication details',
          'Specified deliverables'
        ],
        context: {
          framework: 'Express.js',
          auth: 'JWT',
          testing: '90% coverage'
        }
      });

      // 7. Log to captain's log
      await captainsLog.logImprovement({
        mode: analysis.mode,
        prompt: originalPrompt,
        improvements: [
          {
            type: 'structure',
            action: 'Added tech stack',
            details: ['Express.js']
          },
          {
            type: 'specificity',
            action: 'Added JWT details',
            details: ['RS256', '15min expiry']
          }
        ],
        timestamp: Date.now()
      });

      // Verify learning log
      const stats = await learningLog.getStats();
      assert.strictEqual(stats.totalImprovements, 1);

      // Verify memory
      const patterns = await memory.getRecentPatterns(analysis.mode, 1);
      assert.ok(patterns.length > 0);

      // Verify captain's log
      const logFile = captainsLog._getTodaysLogFile();
      assert.ok(fs.existsSync(logFile));

      console.log('✓ Medium quality prompt improved successfully');
    });
  });

  describe('Low Quality Prompt - Intervention Required', () => {
    it('should require intervention for vague prompts', async () => {
      const prompt = 'Fix that thing';

      // Analyze
      const analysis = await analyzer.analyze(prompt);

      // Should fail quality threshold
      assert.ok(analysis.qualityScore < 0.4,
        `Expected quality < 0.4, got ${analysis.qualityScore}`);

      // Should have high improvement potential
      assert.ok(analysis.improvementPotential > 0.6,
        `Expected potential > 0.6, got ${analysis.improvementPotential}`);

      // Should have critical issues
      assert.ok(analysis.criticalIssues.length > 0);

      // Record rejection (user refuses to clarify)
      await learningLog.recordRejection({
        prompt,
        suggestions: ['Add specificity', 'Clarify "that thing"'],
        reason: 'User refused to clarify',
        timestamp: Date.now()
      });

      // Store rejection in memory
      await memory.storeRejection(analysis.mode, {
        prompt,
        issues: analysis.criticalIssues,
        timestamp: Date.now()
      });

      // Verify rejection was logged
      const rejectionPatterns = await learningLog.getRejectionPatterns(1);
      assert.ok(rejectionPatterns.length > 0);

      console.log('✓ Low quality prompt flagged for intervention');
    });
  });

  describe('Mode Adaptation', () => {
    it('should adapt suggestions based on detected mode', async () => {
      const prompts = {
        hive: 'Use hive mind to build distributed system',
        swarm: 'Spawn agents to build full-stack app',
        wizard: 'Guide me through building an API step-by-step',
        direct: 'Create a REST endpoint'
      };

      for (const [expectedMode, prompt] of Object.entries(prompts)) {
        const analysis = await analyzer.analyze(prompt);

        assert.strictEqual(analysis.mode, expectedMode,
          `Expected ${expectedMode} mode for: ${prompt}`);

        // Get mode-specific baseline
        const baseline = await memory.getBaselinePatterns(expectedMode);
        assert.ok(baseline.commonContext);
        assert.ok(baseline.bestPractices.length > 0);

        console.log(`✓ ${expectedMode} mode detected and adapted`);
      }
    });

    it('should provide mode-appropriate suggestions', async () => {
      // Hive mode prompt
      const hivePrompt = 'Use consensus mechanism to coordinate agents';
      const hiveAnalysis = await analyzer.analyze(hivePrompt);

      assert.strictEqual(hiveAnalysis.mode, 'hive');
      assert.ok(hiveAnalysis.coordination.consensus);

      // Swarm mode prompt
      const swarmPrompt = 'Spawn multiple specialized agents';
      const swarmAnalysis = await analyzer.analyze(swarmPrompt);

      assert.strictEqual(swarmAnalysis.mode, 'swarm');

      // Get mode-specific patterns
      const hivePatterns = await memory.getBaselinePatterns('hive');
      const swarmPatterns = await memory.getBaselinePatterns('swarm');

      // Hive should emphasize consensus
      assert.ok(hivePatterns.commonContext.consensus);

      // Swarm should emphasize topology
      assert.ok(swarmPatterns.commonContext.topology);

      console.log('✓ Mode-appropriate suggestions provided');
    });
  });

  describe('Learning from Patterns', () => {
    it('should learn from repeated patterns', async () => {
      // Simulate multiple similar prompts being improved
      const patterns = [
        {
          prompt: 'Build API 1',
          improvements: ['Add JWT auth', 'Specify Express.js']
        },
        {
          prompt: 'Build API 2',
          improvements: ['Add JWT auth', 'Specify framework']
        },
        {
          prompt: 'Build API 3',
          improvements: ['Add JWT auth', 'Add testing']
        }
      ];

      for (const pattern of patterns) {
        await memory.storePattern('direct', {
          prompt: pattern.prompt,
          improvements: pattern.improvements
        });

        await learningLog.record({
          originalPrompt: pattern.prompt,
          improvedPrompt: pattern.prompt + ' (improved)',
          suggestions: {
            structure: pattern.improvements.map(i => ({ type: i }))
          }
        });
      }

      // Get learned patterns
      const baseline = await memory.getBaselinePatterns('direct');

      // 'Add JWT auth' should be in best practices (appears 3 times)
      assert.ok(baseline.bestPractices.includes('Add JWT auth'));

      // Check learning stats
      const stats = await learningLog.getStats();
      assert.ok(stats.topImprovementTypes.length > 0);

      console.log('✓ Learned from repeated patterns');
    });

    it('should avoid rejected patterns', async () => {
      // Record multiple rejections
      const rejections = [
        { prompt: 'Test 1', reason: 'Too technical' },
        { prompt: 'Test 2', reason: 'Too technical' },
        { prompt: 'Test 3', reason: 'Over-engineered' }
      ];

      for (const rejection of rejections) {
        await learningLog.recordRejection({
          prompt: rejection.prompt,
          suggestions: ['Complex suggestion'],
          reason: rejection.reason
        });
      }

      // Get stats
      const stats = await learningLog.getStats();

      // 'Too technical' should be top rejection reason
      assert.ok(stats.topRejectionReasons.length > 0);
      assert.strictEqual(stats.topRejectionReasons[0].reason, 'Too technical');
      assert.strictEqual(stats.topRejectionReasons[0].count, 2);

      console.log('✓ Tracking rejected patterns to avoid');
    });
  });

  describe('Complete Workflow with All Components', () => {
    it('should integrate all components in realistic scenario', async () => {
      const originalPrompt = 'Create user management system';

      // 1. Analyze
      const analysis = await analyzer.analyze(originalPrompt);
      console.log(`  Quality score: ${(analysis.qualityScore * 100).toFixed(1)}%`);

      // 2. Get baseline patterns for mode
      const baseline = await memory.getBaselinePatterns(analysis.mode);
      console.log(`  Using ${analysis.mode} mode patterns`);

      // 3. Generate suggestions
      const suggestions = {
        structure: [
          {
            type: 'add-crud-operations',
            priority: 'high',
            description: 'Specify CRUD operations needed'
          }
        ],
        specificity: [
          {
            type: 'add-tech-stack',
            priority: 'high',
            description: 'Specify backend framework and database'
          }
        ]
      };

      // 4. Get confirmation (auto-approved)
      const confirmResult = await confirmation.confirm(
        originalPrompt,
        analysis,
        suggestions
      );

      // 5. Apply improvements
      const improvedPrompt = `
        Create user management system with CRUD operations:
        - Backend: Express.js with TypeScript
        - Database: PostgreSQL with Prisma ORM
        - Features: Create, Read, Update, Delete, Search users
        - Authentication: JWT-based
        - Validation: Joi schemas

        Deliverables:
        - API routes in src/routes/users.js
        - Controllers in src/controllers/users.js
        - Models in src/models/user.js
        - Tests with 90% coverage in tests/users.test.js

        Save to sessions/current/artifacts/
      `;

      // 6. Record improvement
      await learningLog.record({
        originalPrompt,
        improvedPrompt,
        suggestions,
        userSelections: confirmResult.userSelections,
        qualityBefore: analysis.qualityScore,
        qualityAfter: 0.88
      });

      // 7. Store pattern
      await memory.storePattern(analysis.mode, {
        prompt: originalPrompt,
        improvements: [
          'Added CRUD specification',
          'Added tech stack',
          'Added deliverables'
        ],
        context: {
          framework: 'Express.js',
          database: 'PostgreSQL',
          orm: 'Prisma'
        }
      });

      // 8. Log to captain's log
      await captainsLog.logImprovement({
        mode: analysis.mode,
        prompt: originalPrompt,
        improvements: [
          {
            type: 'structure',
            action: 'Added CRUD operations',
            details: ['Create', 'Read', 'Update', 'Delete']
          },
          {
            type: 'specificity',
            action: 'Added tech stack',
            details: ['Express.js', 'PostgreSQL', 'Prisma']
          }
        ],
        timestamp: Date.now()
      });

      // Verify all components worked
      const stats = await learningLog.getStats();
      assert.strictEqual(stats.totalImprovements, 1);

      const patterns = await memory.getRecentPatterns(analysis.mode, 1);
      assert.ok(patterns.length > 0);

      const logFile = captainsLog._getTodaysLogFile();
      assert.ok(fs.existsSync(logFile));

      console.log('✓ Complete workflow executed successfully');
    });
  });

  describe('Performance and Token Efficiency', () => {
    it('should complete analysis quickly', async () => {
      const prompt = 'Build a comprehensive REST API with authentication';

      const start = Date.now();
      const analysis = await analyzer.analyze(prompt);
      const duration = Date.now() - start;

      // Should complete in under 100ms
      assert.ok(duration < 100, `Analysis took ${duration}ms`);

      console.log(`✓ Analysis completed in ${duration}ms`);
    });

    it('should minimize memory operations', async () => {
      let operationCount = 0;

      // Intercept memory operations
      const originalStore = memory._store.bind(memory);
      memory._store = async (...args) => {
        operationCount++;
        return originalStore(...args);
      };

      // Store a pattern
      await memory.storePattern('direct', {
        prompt: 'test',
        improvements: ['improvement']
      });

      // Should batch operations efficiently
      assert.ok(operationCount <= 3, `Too many operations: ${operationCount}`);

      console.log(`✓ Memory operations: ${operationCount}`);
    });

    it('should handle no-op path efficiently', async () => {
      const prompt = `
        Implement comprehensive authentication system with:
        - JWT tokens (RS256, 15min access, 7day refresh)
        - Rate limiting (5 attempts/hour)
        - Token blacklist in Redis
        - Password hashing with bcrypt (10 rounds)
        - Email verification workflow
        - 2FA support with TOTP

        Tech stack: Express.js v5, jsonwebtoken v9, Redis v4

        Deliverables to sessions/current/artifacts/:
        - src/middleware/auth.js (middleware)
        - src/routes/auth.js (endpoints)
        - tests/auth.test.js (95% coverage)
        - docs/AUTH.md (documentation)
      `;

      const start = Date.now();
      const analysis = await analyzer.analyze(prompt);
      const duration = Date.now() - start;

      // High quality - should pass through
      assert.ok(analysis.qualityScore >= 0.7);

      // Should be fast (no suggestions needed)
      assert.ok(duration < 100);

      console.log(`✓ No-op path: ${duration}ms, quality: ${(analysis.qualityScore * 100).toFixed(1)}%`);
    });
  });
});

// Run if executed directly
if (require.main === module) {
  console.log('End-to-end tests defined. Use Jest or similar test runner to execute.');
  process.exit(0);
}

module.exports = { describe };
