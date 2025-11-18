/**
 * Tactical Queen Behavior Engine
 *
 * Fast execution, pragmatic decision-making, weighted consensus preference
 * Focus: Rapid response, optimization, immediate problem-solving
 */

class TacticalQueenEngine {
  constructor(config = {}) {
    this.config = config;
    this.state = 'ready';
    this.planningHorizon = 'short-term'; // 1-7 days
    this.decisionStyle = 'pragmatic';
    this.consensusPreference = 'weighted'; // Fast consensus with expertise weighting
    this.riskTolerance = 'medium';
    this.executionSpeed = 'fast';

    // State machine - faster transitions than strategic
    this.states = {
      ready: { next: ['assessing', 'executing'], timeout: 10000 }, // 10s
      assessing: { next: ['deciding', 'ready', 'executing', 'assessing'], timeout: 30000 }, // 30s
      deciding: { next: ['executing', 'delegating', 'deciding', 'assessing'], timeout: 20000 }, // 20s
      executing: { next: ['monitoring', 'ready', 'executing'], timeout: null },
      delegating: { next: ['monitoring', 'executing'], timeout: null },
      monitoring: { next: ['adjusting', 'ready', 'escalating'], timeout: null },
      adjusting: { next: ['executing', 'delegating'], timeout: 15000 }, // 15s
      escalating: { next: ['deciding', 'ready'], timeout: 60000 } // 1min
    };

    this.metrics = {
      decisionsExecuted: 0,
      tasksCompleted: 0,
      consensusReached: 0,
      problemsSolved: 0,
      optimizationsApplied: 0,
      responseTime: []
    };
  }

  /**
   * Make a tactical decision with speed and pragmatism
   */
  async makeDecision(context) {
    const startTime = Date.now();
    if (this.state !== 'assessing') {
      this.transition('assessing');
    }

    const assessment = await this.quickAssessment(context);

    if (assessment.urgency === 'critical') {
      this.transition('executing');
      return await this.immediateAction(context, assessment);
    }

    if (assessment.complexity > 0.6) {
      this.transition('deciding');
      const consensus = await this.seekWeightedConsensus(context, assessment);
      return consensus;
    }

    this.transition('deciding');
    const decision = {
      type: 'tactical',
      action: this.determineAction(context, assessment),
      assessment,
      consensusRequired: assessment.stakeholders > 1,
      executionPlan: this.createExecutionPlan(context),
      contingency: this.prepareContingency(context),
      monitoring: this.defineMonitoring(context),
      successCriteria: this.defineQuickWins(context),
      timestamp: Date.now()
    };

    this.metrics.decisionsExecuted++;
    const responseTime = Date.now() - startTime;
    this.metrics.responseTime.push(responseTime);

    return decision;
  }

  /**
   * Quick assessment for rapid decision-making
   */
  async quickAssessment(context) {
    const assessment = {
      urgency: this.assessUrgency(context),
      complexity: this.assessComplexity(context),
      resources: this.checkResourceAvailability(context),
      stakeholders: this.identifyKeyStakeholders(context),
      constraints: this.identifyImmediateConstraints(context),
      opportunities: this.spotQuickWins(context),
      risks: this.identifyImmediateRisks(context),
      estimatedDuration: this.estimateExecutionTime(context)
    };

    return assessment;
  }

  /**
   * Immediate action for critical situations
   */
  async immediateAction(context, assessment) {
    if (this.state !== 'executing') {
      this.transition('executing');
    }

    const action = {
      type: 'immediate',
      priority: 'critical',
      execution: {
        method: 'direct',
        agents: this.assignBestAgents(context),
        parallelization: true,
        checkpoints: this.defineQuickCheckpoints(context),
        rollback: this.prepareRollback(context)
      },
      monitoring: {
        frequency: 'real-time',
        alerts: 'immediate',
        escalation: 'automatic'
      },
      timestamp: Date.now()
    };

    this.metrics.problemsSolved++;

    return action;
  }

  /**
   * Seek weighted consensus for quick decision-making
   */
  async seekWeightedConsensus(context, assessment) {
    const proposal = {
      type: 'tactical-consensus',
      context,
      assessment,
      consensusAlgorithm: 'weighted',
      expertiseWeighting: true,
      weights: this.calculateAgentWeights(context),
      threshold: 0.6, // Lower threshold for speed
      timeout: 60000, // 1 minute max
      votingRounds: 1 // Single round for speed
    };

    this.metrics.consensusReached++;

    return {
      consensusProposal: proposal,
      requiresValidation: false, // Trust expertise weighting
      fallbackStrategy: 'executive-decision'
    };
  }

  /**
   * Create fast execution plan
   */
  createExecutionPlan(context) {
    return {
      approach: 'iterative',
      iterations: [
        { step: 'quick-prototype', duration: '2-4 hours' },
        { step: 'validate', duration: '1 hour' },
        { step: 'refine', duration: '2-3 hours' },
        { step: 'deploy', duration: '1 hour' }
      ],
      parallelization: this.identifyParallelTasks(context),
      optimization: this.identifyOptimizations(context),
      qualityChecks: this.defineMinimalQualityGates(context)
    };
  }

  /**
   * Define minimal but sufficient quality gates
   */
  defineMinimalQualityGates(context) {
    return {
      unitTests: { required: true, minCoverage: 0.7 },
      integrationTests: { required: true, critical: 'paths-only' },
      codeReview: { required: true, fast: 'track' },
      performanceCheck: { required: true, basic: true },
      securityScan: { required: true, automated: true }
    };
  }

  /**
   * Identify and execute quick optimizations
   */
  identifyOptimizations(context) {
    this.metrics.optimizationsApplied++;

    return [
      { type: 'parallel-execution', impact: 'high', effort: 'low' },
      { type: 'caching', impact: 'medium', effort: 'low' },
      { type: 'lazy-loading', impact: 'medium', effort: 'low' }
    ];
  }

  /**
   * State machine transition
   */
  transition(newState) {
    if (!this.states[newState]) {
      throw new Error(`Invalid state: ${newState}`);
    }

    const currentStateConfig = this.states[this.state];
    if (currentStateConfig && currentStateConfig.next && !currentStateConfig.next.includes(newState)) {
      throw new Error(`Invalid transition from ${this.state} to ${newState}`);
    }

    this.state = newState;
    return this.state;
  }

  // Helper methods for tactical operations
  assessUrgency(context) {
    const urgencyIndicators = [
      context.priority === 'critical',
      context.deadline && (context.deadline - Date.now() < 3600000), // < 1 hour
      context.blocking === true
    ];

    const urgentCount = urgencyIndicators.filter(Boolean).length;
    if (urgentCount >= 2) return 'critical';
    if (urgentCount === 1) return 'high';
    return 'medium';
  }

  assessComplexity(context) {
    const factors = [
      context.agentCount || 0,
      context.dependencies?.length || 0,
      context.unknowns || 0
    ];
    return Math.min(factors.reduce((a, b) => a + b, 0) / 10, 1);
  }

  checkResourceAvailability(context) {
    return {
      agents: 'available',
      compute: 'sufficient',
      memory: 'adequate'
    };
  }

  identifyKeyStakeholders(context) {
    return context.stakeholders?.slice(0, 3) || [];
  }

  identifyImmediateConstraints(context) {
    return ['time', 'resources'].filter(c => context.constraints?.includes(c));
  }

  spotQuickWins(context) {
    return [
      { opportunity: 'quick-refactor', effort: 'low', impact: 'medium' },
      { opportunity: 'performance-tweak', effort: 'low', impact: 'high' }
    ];
  }

  identifyImmediateRisks(context) {
    return [
      { type: 'deadline', severity: 'high', mitigation: 'parallel-execution' }
    ];
  }

  estimateExecutionTime(context) {
    return '4-8 hours';
  }

  determineAction(context, assessment) {
    return {
      type: 'execute',
      method: assessment.urgency === 'critical' ? 'immediate' : 'planned',
      parallelization: true
    };
  }

  assignBestAgents(context) {
    return {
      primary: 'worker-specialist',
      support: ['worker-specialist', 'worker-specialist'],
      expertise: 'high'
    };
  }

  defineQuickCheckpoints(context) {
    return [
      { checkpoint: 'prototype-complete', time: '2h' },
      { checkpoint: 'validation-passed', time: '3h' },
      { checkpoint: 'deployed', time: '6h' }
    ];
  }

  prepareRollback(context) {
    return {
      enabled: true,
      automatic: true,
      triggers: ['critical-error', 'performance-degradation']
    };
  }

  prepareContingency(context) {
    return {
      plan: 'fallback-to-previous-version',
      triggers: ['failure', 'timeout'],
      notification: 'immediate'
    };
  }

  defineMonitoring(context) {
    return {
      metrics: ['performance', 'errors', 'completion'],
      frequency: 'real-time',
      alerts: 'enabled'
    };
  }

  defineQuickWins(context) {
    return {
      minimumViable: true,
      critical: 'functionality-only',
      optimization: 'deferred'
    };
  }

  calculateAgentWeights(context) {
    return {
      'expert-agents': 2.0,
      'experienced-agents': 1.5,
      'standard-agents': 1.0
    };
  }

  identifyParallelTasks(context) {
    return [
      { task: 'implementation', parallel: true },
      { task: 'testing', parallel: true }
    ];
  }

  getMetrics() {
    let avgResponseTime = 0;
    if (this.metrics.responseTime.length > 0) {
      const sum = this.metrics.responseTime.reduce((a, b) => a + b, 0);
      avgResponseTime = sum / this.metrics.responseTime.length;
    }

    return {
      ...this.metrics,
      averageResponseTime: avgResponseTime,
      state: this.state,
      decisionStyle: this.decisionStyle,
      consensusPreference: this.consensusPreference
    };
  }
}

module.exports = TacticalQueenEngine;
