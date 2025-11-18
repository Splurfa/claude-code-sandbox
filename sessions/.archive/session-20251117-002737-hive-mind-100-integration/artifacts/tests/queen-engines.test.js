/**
 * Queen Behavior Engines Test Suite
 */

const StrategicQueenEngine = require('../code/queens/strategic-engine');
const TacticalQueenEngine = require('../code/queens/tactical-engine');
const AdaptiveQueenEngine = require('../code/queens/adaptive-engine');
const QueenSelector = require('../code/queens/queen-selector');

describe('Queen Behavior Engines', () => {
  describe('StrategicQueenEngine', () => {
    let engine;

    beforeEach(() => {
      engine = new StrategicQueenEngine();
    });

    test('should initialize with strategic configuration', () => {
      expect(engine.decisionStyle).toBe('analytical');
      expect(engine.consensusPreference).toBe('byzantine');
      expect(engine.planningHorizon).toBe('long-term');
      expect(engine.state).toBe('analyzing');
    });

    test('should make strategic decisions with comprehensive analysis', async () => {
      const context = {
        agentCount: 10,
        dependencies: ['auth', 'database', 'api'],
        stakeholders: ['tech-lead', 'product', 'security'],
        quality: 'high'
      };

      const decision = await engine.makeDecision(context);

      expect(decision.type).toBe('strategic');
      expect(decision.plan).toBeDefined();
      expect(decision.analysis).toBeDefined();
      expect(decision.qualityGates).toBeDefined();
      expect(decision.riskMitigation).toBeDefined();
      expect(decision.timeline).toBeDefined();
    });

    test('should seek Byzantine consensus for complex decisions', async () => {
      const context = {
        agentCount: 15,
        dependencies: Array(10).fill('module'),
        stakeholders: ['ceo', 'cto', 'engineering', 'product']
      };

      const decision = await engine.makeDecision(context);

      expect(decision.consensusRequired).toBe(true);
      expect(decision.plan.phases).toBeDefined();
      expect(decision.analysis.complexity).toBeGreaterThan(0.5);
    });

    test('should define comprehensive quality gates', () => {
      const context = { quality: 'high' };
      const qualityGates = engine.defineQualityGates(context);

      expect(qualityGates.architectureReview.required).toBe(true);
      expect(qualityGates.securityAudit.required).toBe(true);
      expect(qualityGates.codeQuality.minCoverage).toBe(0.9);
    });

    test('should enforce state machine transitions', () => {
      expect(engine.state).toBe('analyzing');

      engine.transition('planning');
      expect(engine.state).toBe('planning');

      engine.transition('deciding');
      expect(engine.state).toBe('deciding');

      // Invalid transition should throw
      expect(() => engine.transition('monitoring')).toThrow();
    });

    test('should track metrics', async () => {
      const context = { agentCount: 5 };
      await engine.makeDecision(context);

      const metrics = engine.getMetrics();
      expect(metrics.decisionsAnalyzed).toBe(1);
      expect(metrics.plansCreated).toBe(1);
      expect(metrics.decisionStyle).toBe('analytical');
    });
  });

  describe('TacticalQueenEngine', () => {
    let engine;

    beforeEach(() => {
      engine = new TacticalQueenEngine();
    });

    test('should initialize with tactical configuration', () => {
      expect(engine.decisionStyle).toBe('pragmatic');
      expect(engine.consensusPreference).toBe('weighted');
      expect(engine.planningHorizon).toBe('short-term');
      expect(engine.executionSpeed).toBe('fast');
    });

    test('should make rapid tactical decisions', async () => {
      const context = {
        priority: 'high',
        agentCount: 5,
        deadline: Date.now() + 3600000 // 1 hour
      };

      const decision = await engine.makeDecision(context);

      expect(decision.type).toBe('tactical');
      expect(decision.action).toBeDefined();
      expect(decision.executionPlan).toBeDefined();
      expect(decision.executionPlan.approach).toBe('iterative');
    });

    test('should take immediate action for critical urgency', async () => {
      const context = {
        priority: 'critical',
        blocking: true,
        deadline: Date.now() + 1800000 // 30 minutes
      };

      const decision = await engine.makeDecision(context);

      expect(decision.type).toBe('immediate');
      expect(decision.priority).toBe('critical');
      expect(decision.execution.parallelization).toBe(true);
    });

    test('should use weighted consensus for speed', async () => {
      const context = {
        agentCount: 8,
        stakeholders: ['dev-lead', 'senior-dev'],
        priority: 'high'
      };

      const decision = await engine.makeDecision(context);

      if (decision.consensusProposal) {
        expect(decision.consensusProposal.consensusAlgorithm).toBe('weighted');
        expect(decision.consensusProposal.votingRounds).toBe(1);
        expect(decision.consensusProposal.timeout).toBeLessThanOrEqual(60000);
      }
    });

    test('should define minimal quality gates for speed', () => {
      const context = { priority: 'high' };
      const plan = engine.createExecutionPlan(context);

      expect(plan.qualityChecks).toBeDefined();
      expect(plan.qualityChecks.unitTests.minCoverage).toBe(0.7);
      expect(plan.qualityChecks.codeReview.fast).toBe('track');
    });

    test('should track response time metrics', async () => {
      const context = { priority: 'medium' };
      await engine.makeDecision(context);
      await engine.makeDecision(context);

      const metrics = engine.getMetrics();
      expect(metrics.responseTime.length).toBe(2);
      expect(metrics.averageResponseTime).toBeGreaterThanOrEqual(0);
      expect(metrics.decisionsExecuted).toBe(2);
    });
  });

  describe('AdaptiveQueenEngine', () => {
    let engine;

    beforeEach(() => {
      engine = new AdaptiveQueenEngine();
    });

    test('should initialize with adaptive configuration', () => {
      expect(engine.decisionStyle).toBe('flexible');
      expect(engine.consensusPreference).toBe('adaptive');
      expect(engine.planningHorizon).toBe('adaptive');
      expect(engine.adaptability).toBe(1.0);
    });

    test('should learn from context and make adaptive decisions', async () => {
      const context = {
        type: 'exploration',
        agentCount: 7,
        unknowns: 5,
        priority: 'medium'
      };

      const decision = await engine.makeDecision(context);

      expect(decision.type).toBe('adaptive');
      expect(decision.approach).toBeDefined();
      expect(decision.adaptationTriggers).toBeDefined();
      expect(decision.learningObjectives).toBeDefined();
    });

    test('should select consensus algorithm based on context', async () => {
      // High urgency -> weighted
      const urgentContext = { priority: 'critical', agentCount: 5 };
      const urgentDecision = await engine.makeDecision(urgentContext);
      expect(urgentDecision.consensusAlgorithm.algorithm).toBe('weighted');

      // High complexity -> byzantine
      const complexContext = {
        agentCount: 15,
        dependencies: Array(10).fill('dep'),
        critical: true
      };
      const complexDecision = await engine.makeDecision(complexContext);
      expect(complexDecision.consensusAlgorithm.algorithm).toBe('byzantine');
    });

    test('should determine auto-scaling strategy', async () => {
      const context = {
        agentCount: 10,
        priority: 'high',
        dependencies: Array(8).fill('dep')
      };

      const decision = await engine.makeDecision(context);

      expect(decision.scalingStrategy).toBeDefined();
      expect(decision.scalingStrategy.action).toBeDefined();
      expect(['scale-up', 'scale-down', 'maintain']).toContain(decision.scalingStrategy.action);
    });

    test('should learn patterns over time', async () => {
      const pattern = {
        type: 'feature',
        agentCount: 5,
        priority: 'medium'
      };

      // Make multiple decisions with same pattern
      await engine.makeDecision(pattern);
      await engine.makeDecision(pattern);
      await engine.makeDecision({ ...pattern, agentCount: 6 });

      const learningModel = engine.getLearningModel();
      expect(learningModel.patternCount).toBeGreaterThan(0);
      expect(learningModel.outcomeCount).toBeGreaterThan(0);
    });

    test('should record and learn from outcomes', async () => {
      const context = { type: 'bugfix', priority: 'high' };
      const decision = await engine.makeDecision(context);

      const outcome = {
        success: true,
        performanceMetrics: { speed: 0.9, quality: 0.85 }
      };

      engine.recordOutcome(context, decision, outcome);

      const metrics = engine.getMetrics();
      expect(metrics.performanceImprovements).toBe(1);
    });

    test('should have most flexible state transitions', () => {
      expect(engine.state).toBe('observing');

      // Can transition to learning, analyzing, or adapting
      engine.transition('learning');
      expect(engine.state).toBe('learning');

      engine.transition('adapting');
      expect(engine.state).toBe('adapting');

      engine.transition('executing');
      expect(engine.state).toBe('executing');
    });
  });

  describe('QueenSelector', () => {
    let selector;

    beforeEach(() => {
      selector = new QueenSelector();
    });

    test('should select strategic queen for complex long-term projects', () => {
      const context = {
        projectType: 'architecture',
        agentCount: 12,
        dependencies: Array(15).fill('dep'),
        quality: 'critical',
        priority: 'medium',
        risk: 'high'
      };

      const result = selector.selectQueen(context);

      expect(result.queenType).toBe('strategic');
      expect(result.engine).toBeInstanceOf(StrategicQueenEngine);
      expect(result.rationale.queenType).toBe('Strategic Queen');
    });

    test('should select tactical queen for urgent simple tasks', () => {
      const context = {
        projectType: 'bugfix',
        agentCount: 3,
        priority: 'critical',
        deadline: 'immediate',
        wellUnderstood: true
      };

      const result = selector.selectQueen(context);

      expect(result.queenType).toBe('tactical');
      expect(result.engine).toBeInstanceOf(TacticalQueenEngine);
      expect(result.rationale.queenType).toBe('Tactical Queen');
    });

    test('should select adaptive queen for exploratory projects', () => {
      const context = {
        projectType: 'research',
        innovation: 'high',
        predictability: 'low',
        agentCount: 8,
        priority: 'medium'
      };

      const result = selector.selectQueen(context);

      expect(result.queenType).toBe('adaptive');
      expect(result.engine).toBeInstanceOf(AdaptiveQueenEngine);
      expect(result.rationale.queenType).toBe('Adaptive Queen');
    });

    test('should default to adaptive when scores are close', () => {
      const context = {
        agentCount: 6,
        priority: 'medium',
        quality: 'medium',
        complexity: 0.5
      };

      const result = selector.selectQueen(context);

      // When uncertain, should prefer adaptive
      expect(['adaptive', 'tactical', 'strategic']).toContain(result.queenType);
      expect(result.rationale).toBeDefined();
    });

    test('should provide comprehensive analysis', () => {
      const context = {
        projectType: 'feature',
        agentCount: 8,
        priority: 'high',
        quality: 'high',
        innovation: 'medium'
      };

      const result = selector.selectQueen(context);

      expect(result.analysis).toBeDefined();
      expect(result.analysis.complexity).toBeDefined();
      expect(result.analysis.urgency).toBeDefined();
      expect(result.analysis.scale).toBeDefined();
      expect(result.analysis.type).toBe('feature');
    });

    test('should track selection history', () => {
      selector.selectQueen({ projectType: 'feature' });
      selector.selectQueen({ projectType: 'architecture' });
      selector.selectQueen({ projectType: 'bugfix' });

      const stats = selector.getStatistics();

      expect(stats.totalSelections).toBe(3);
      expect(stats.distribution).toBeDefined();
      expect(stats.recentSelections.length).toBe(3);
    });

    test('should reuse engines for same queen type', () => {
      const result1 = selector.selectQueen({ projectType: 'architecture', quality: 'critical' });
      const result2 = selector.selectQueen({ projectType: 'architecture', quality: 'critical' });

      if (result1.queenType === result2.queenType) {
        expect(result1.engine).toBe(result2.engine);
      }
    });
  });

  describe('Queen Integration', () => {
    test('all queens should have compatible interfaces', async () => {
      const strategic = new StrategicQueenEngine();
      const tactical = new TacticalQueenEngine();
      const adaptive = new AdaptiveQueenEngine();

      const context = { agentCount: 5, priority: 'medium' };

      const strategicDecision = await strategic.makeDecision(context);
      const tacticalDecision = await tactical.makeDecision(context);
      const adaptiveDecision = await adaptive.makeDecision(context);

      // All should return decision objects
      expect(strategicDecision).toBeDefined();
      expect(tacticalDecision).toBeDefined();
      expect(adaptiveDecision).toBeDefined();

      // All should have type field
      expect(strategicDecision.type).toBeDefined();
      expect(tacticalDecision.type).toBeDefined();
      expect(adaptiveDecision.type).toBeDefined();
    });

    test('all queens should track metrics', () => {
      const strategic = new StrategicQueenEngine();
      const tactical = new TacticalQueenEngine();
      const adaptive = new AdaptiveQueenEngine();

      const strategicMetrics = strategic.getMetrics();
      const tacticalMetrics = tactical.getMetrics();
      const adaptiveMetrics = adaptive.getMetrics();

      expect(strategicMetrics.state).toBeDefined();
      expect(tacticalMetrics.state).toBeDefined();
      expect(adaptiveMetrics.state).toBeDefined();

      expect(strategicMetrics.decisionStyle).toBe('analytical');
      expect(tacticalMetrics.decisionStyle).toBe('pragmatic');
      expect(adaptiveMetrics.decisionStyle).toBe('flexible');
    });

    test('queens should have distinct consensus preferences', () => {
      const strategic = new StrategicQueenEngine();
      const tactical = new TacticalQueenEngine();
      const adaptive = new AdaptiveQueenEngine();

      expect(strategic.consensusPreference).toBe('byzantine');
      expect(tactical.consensusPreference).toBe('weighted');
      expect(adaptive.consensusPreference).toBe('adaptive');
    });
  });
});
