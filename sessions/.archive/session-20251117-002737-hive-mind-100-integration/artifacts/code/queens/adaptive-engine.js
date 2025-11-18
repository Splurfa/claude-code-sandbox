/**
 * Adaptive Queen Behavior Engine
 *
 * Dynamic complexity monitoring, auto-scaling, performance optimization
 * Focus: Learning, adaptation, context-awareness
 */

class AdaptiveQueenEngine {
  constructor(config = {}) {
    this.config = config;
    this.state = 'observing';
    this.planningHorizon = 'adaptive'; // Adjusts based on context
    this.decisionStyle = 'flexible';
    this.consensusPreference = 'adaptive'; // Changes based on situation
    this.riskTolerance = 'adaptive';
    this.adaptability = 1.0;

    // Learning state
    this.learningModel = {
      patterns: new Map(),
      outcomes: [],
      contextHistory: [],
      performanceMetrics: [],
      adaptations: []
    };

    // State machine - most flexible transitions
    this.states = {
      observing: { next: ['learning', 'analyzing', 'adapting'], timeout: null },
      learning: { next: ['analyzing', 'adapting', 'observing'], timeout: null },
      analyzing: { next: ['deciding', 'adapting', 'learning'], timeout: null },
      deciding: { next: ['executing', 'adapting', 'delegating'], timeout: null },
      executing: { next: ['monitoring', 'adapting'], timeout: null },
      delegating: { next: ['monitoring', 'adapting'], timeout: null },
      monitoring: { next: ['learning', 'adapting', 'escalating'], timeout: null },
      adapting: { next: ['observing', 'executing', 'deciding'], timeout: null },
      escalating: { next: ['deciding', 'adapting'], timeout: null }
    };

    this.metrics = {
      adaptations: 0,
      patternsLearned: 0,
      contextsHandled: 0,
      performanceImprovements: 0,
      scalingActions: 0,
      consensusAlgorithmsUsed: new Map()
    };
  }

  /**
   * Make an adaptive decision based on learned patterns
   */
  async makeDecision(context) {
    if (this.state !== 'observing') {
      this.transition('observing');
    }

    // Learn from context
    await this.observeContext(context);

    this.transition('analyzing');
    const analysis = await this.analyzeWithLearning(context);

    // Determine optimal approach based on learned patterns
    const approach = this.selectApproach(context, analysis);

    this.transition('adapting');
    const adaptedStrategy = await this.adaptStrategy(context, analysis, approach);

    this.transition('deciding');
    const decision = {
      type: 'adaptive',
      approach: approach.name,
      strategy: adaptedStrategy,
      analysis,
      consensusAlgorithm: this.selectConsensusAlgorithm(context, analysis),
      scalingStrategy: this.determineScaling(context, analysis),
      monitoringStrategy: this.designMonitoring(context),
      adaptationTriggers: this.defineAdaptationTriggers(context),
      learningObjectives: this.defineLearningObjectives(context),
      timestamp: Date.now()
    };

    this.metrics.contextsHandled++;

    // Store for future learning
    this.learningModel.contextHistory.push({
      context,
      decision,
      timestamp: Date.now()
    });

    this.learningModel.outcomes.push({
      context,
      decision,
      outcome: null, // Will be set via recordOutcome
      timestamp: Date.now()
    });

    return decision;
  }

  /**
   * Observe and learn from context
   */
  async observeContext(context) {
    this.transition('learning');

    // Extract patterns
    const pattern = this.extractPattern(context);

    // Check if we've seen this before
    const similarPatterns = this.findSimilarPatterns(pattern);

    if (similarPatterns.length > 0) {
      // Learn from past experiences
      this.updatePatternKnowledge(pattern, similarPatterns);
    } else {
      // New pattern - explore
      this.learningModel.patterns.set(this.generatePatternId(pattern), {
        pattern,
        occurrences: 1,
        outcomes: [],
        successRate: 0,
        bestApproach: null
      });
      this.metrics.patternsLearned++;
    }
  }

  /**
   * Analyze with learned patterns and historical data
   */
  async analyzeWithLearning(context) {
    const pattern = this.extractPattern(context);
    const historicalData = this.getHistoricalData(pattern);

    const analysis = {
      complexity: this.assessComplexity(context),
      urgency: this.assessUrgency(context),
      scale: this.assessScale(context),
      historicalSuccess: historicalData.successRate || 0.5,
      recommendedApproach: historicalData.bestApproach || 'balanced',
      performancePrediction: this.predictPerformance(context, historicalData),
      adaptationNeeded: this.assessAdaptationNeed(context),
      scalingRequired: this.assessScalingNeed(context)
    };

    return analysis;
  }

  /**
   * Select optimal approach based on context and learning
   */
  selectApproach(context, analysis) {
    // Dynamic approach selection based on multiple factors
    if (analysis.urgency > 0.7 && analysis.complexity < 0.5) {
      return { name: 'tactical', rationale: 'high urgency, low complexity' };
    }

    if (analysis.complexity > 0.7 && analysis.urgency < 0.5) {
      return { name: 'strategic', rationale: 'high complexity, time available' };
    }

    if (analysis.historicalSuccess > 0.8 && analysis.recommendedApproach) {
      return {
        name: analysis.recommendedApproach,
        rationale: 'learned from past success'
      };
    }

    // Balanced hybrid approach
    return {
      name: 'hybrid',
      rationale: 'balanced complexity and urgency',
      strategic: analysis.complexity * 0.5,
      tactical: analysis.urgency * 0.5
    };
  }

  /**
   * Adapt strategy based on real-time feedback
   */
  async adaptStrategy(context, analysis, approach) {
    const baseStrategy = this.getBaseStrategy(approach.name);

    // Apply learned optimizations
    const optimizations = this.getLearnedOptimizations(context);

    // Adjust for current context
    const adaptedStrategy = {
      ...baseStrategy,
      optimizations,
      adjustments: this.calculateAdjustments(context, analysis),
      contingencies: this.prepareAdaptiveContingencies(context),
      feedbackLoops: this.designFeedbackLoops(context)
    };

    this.metrics.adaptations++;
    this.learningModel.adaptations.push({
      context: this.extractPattern(context),
      approach: approach.name,
      adaptations: adaptedStrategy.adjustments,
      timestamp: Date.now()
    });

    return adaptedStrategy;
  }

  /**
   * Select consensus algorithm based on context
   */
  selectConsensusAlgorithm(context, analysis) {
    let algorithm;

    if (analysis.urgency > 0.7) {
      algorithm = 'weighted'; // Fast consensus
    } else if (analysis.complexity > 0.7 || context.critical) {
      algorithm = 'byzantine'; // Fault-tolerant consensus
    } else if (analysis.scale > 0.7) {
      algorithm = 'raft'; // Scalable consensus
    } else {
      algorithm = 'simple-majority'; // Default
    }

    // Track usage for learning
    const currentCount = this.metrics.consensusAlgorithmsUsed.get(algorithm) || 0;
    this.metrics.consensusAlgorithmsUsed.set(algorithm, currentCount + 1);

    return {
      algorithm,
      rationale: this.explainConsensusChoice(algorithm, analysis),
      parameters: this.tuneConsensusParameters(algorithm, context)
    };
  }

  /**
   * Determine auto-scaling strategy
   */
  determineScaling(context, analysis) {
    const currentLoad = this.assessCurrentLoad(context);
    const predictedLoad = this.predictLoad(context, analysis);

    if (predictedLoad > currentLoad * 1.5) {
      this.metrics.scalingActions++;
      return {
        action: 'scale-up',
        targetAgents: Math.ceil(currentLoad * 2),
        trigger: 'predicted-load-increase',
        preemptive: true
      };
    }

    if (predictedLoad < currentLoad * 0.5) {
      this.metrics.scalingActions++;
      return {
        action: 'scale-down',
        targetAgents: Math.ceil(currentLoad * 0.7),
        trigger: 'predicted-load-decrease',
        gradual: true
      };
    }

    return {
      action: 'maintain',
      targetAgents: currentLoad,
      trigger: 'stable-load'
    };
  }

  /**
   * Design adaptive monitoring strategy
   */
  designMonitoring(context) {
    return {
      metrics: this.selectKeyMetrics(context),
      frequency: this.determineMonitoringFrequency(context),
      adaptiveTriggers: [
        { metric: 'performance', threshold: 'dynamic', action: 'optimize' },
        { metric: 'complexity', threshold: 'dynamic', action: 'adapt-approach' },
        { metric: 'load', threshold: 'dynamic', action: 'scale' }
      ],
      learningEnabled: true
    };
  }

  /**
   * Define triggers for adaptation
   */
  defineAdaptationTriggers(context) {
    return {
      performanceDegradation: { threshold: 0.2, action: 'optimize' },
      complexityIncrease: { threshold: 0.3, action: 'switch-to-strategic' },
      urgencyIncrease: { threshold: 0.7, action: 'switch-to-tactical' },
      newPattern: { threshold: 'detected', action: 'learn-and-adapt' },
      feedbackReceived: { threshold: 'negative', action: 'reassess' }
    };
  }

  /**
   * Define learning objectives
   */
  defineLearningObjectives(context) {
    return {
      patterns: 'identify-and-catalog',
      optimization: 'continuous-improvement',
      prediction: 'improve-accuracy',
      adaptation: 'faster-response'
    };
  }

  /**
   * Record outcome for learning
   */
  recordOutcome(context, decision, outcome) {
    const pattern = this.extractPattern(context);
    const patternId = this.generatePatternId(pattern);

    const patternData = this.learningModel.patterns.get(patternId);
    if (patternData) {
      patternData.outcomes.push({
        decision,
        outcome,
        timestamp: Date.now()
      });

      // Update success rate
      const successes = patternData.outcomes.filter(o => o.outcome.success).length;
      patternData.successRate = successes / patternData.outcomes.length;

      // Update best approach
      this.updateBestApproach(patternData);

      if (outcome.success) {
        this.metrics.performanceImprovements++;
      }
    }

    this.learningModel.outcomes.push({
      context,
      decision,
      outcome,
      timestamp: Date.now()
    });
  }

  /**
   * State machine transition (most permissive)
   */
  transition(newState) {
    if (!this.states[newState]) {
      throw new Error(`Invalid state: ${newState}`);
    }

    this.state = newState;
    return this.state;
  }

  // Helper methods
  extractPattern(context) {
    return {
      complexity: this.assessComplexity(context),
      urgency: this.assessUrgency(context),
      scale: this.assessScale(context),
      type: context.type || 'general'
    };
  }

  generatePatternId(pattern) {
    return `${pattern.type}-${Math.floor(pattern.complexity * 10)}-${Math.floor(pattern.urgency * 10)}`;
  }

  findSimilarPatterns(pattern) {
    const similar = [];
    const patternId = this.generatePatternId(pattern);

    for (const [id, data] of this.learningModel.patterns.entries()) {
      if (id === patternId || this.calculateSimilarity(pattern, data.pattern) > 0.8) {
        similar.push(data);
      }
    }

    return similar;
  }

  calculateSimilarity(p1, p2) {
    const complexityDiff = Math.abs(p1.complexity - p2.complexity);
    const urgencyDiff = Math.abs(p1.urgency - p2.urgency);
    const scaleDiff = Math.abs(p1.scale - p2.scale);

    return 1 - ((complexityDiff + urgencyDiff + scaleDiff) / 3);
  }

  updatePatternKnowledge(pattern, similarPatterns) {
    const patternId = this.generatePatternId(pattern);
    const existing = this.learningModel.patterns.get(patternId);

    if (existing) {
      existing.occurrences++;

      // Learn from similar patterns
      const avgSuccessRate = similarPatterns.reduce((sum, p) => sum + p.successRate, 0) / similarPatterns.length;
      existing.successRate = (existing.successRate + avgSuccessRate) / 2;
    }
  }

  getHistoricalData(pattern) {
    const patternId = this.generatePatternId(pattern);
    return this.learningModel.patterns.get(patternId) || {
      successRate: 0.5,
      bestApproach: null
    };
  }

  assessComplexity(context) {
    return Math.min((context.agentCount || 3) / 10 + (context.dependencies?.length || 0) / 10, 1);
  }

  assessUrgency(context) {
    if (context.priority === 'critical') return 0.9;
    if (context.priority === 'high') return 0.7;
    if (context.priority === 'medium') return 0.5;
    return 0.3;
  }

  assessScale(context) {
    return Math.min((context.agentCount || 3) / 20, 1);
  }

  predictPerformance(context, historicalData) {
    return {
      expectedSuccessRate: historicalData.successRate || 0.5,
      confidence: historicalData.outcomes?.length > 5 ? 'high' : 'medium'
    };
  }

  assessAdaptationNeed(context) {
    const recentOutcomes = this.learningModel.outcomes.slice(-5);
    if (recentOutcomes.length < 3) return 'unknown';

    const successRate = recentOutcomes.filter(o => o.outcome?.success).length / recentOutcomes.length;
    return successRate < 0.7 ? 'high' : 'low';
  }

  assessScalingNeed(context) {
    return this.assessScale(context) > 0.6;
  }

  getBaseStrategy(approachName) {
    const strategies = {
      strategic: { focus: 'planning', speed: 'slow', quality: 'high' },
      tactical: { focus: 'execution', speed: 'fast', quality: 'sufficient' },
      hybrid: { focus: 'balanced', speed: 'medium', quality: 'high' }
    };
    return strategies[approachName] || strategies.hybrid;
  }

  getLearnedOptimizations(context) {
    return this.learningModel.adaptations
      .filter(a => this.calculateSimilarity(a.context, this.extractPattern(context)) > 0.7)
      .map(a => a.adaptations)
      .flat();
  }

  calculateAdjustments(context, analysis) {
    return {
      speedAdjustment: analysis.urgency > 0.7 ? 'increase' : 'maintain',
      qualityAdjustment: analysis.complexity > 0.7 ? 'increase' : 'maintain',
      resourceAdjustment: analysis.scale > 0.7 ? 'increase' : 'maintain'
    };
  }

  prepareAdaptiveContingencies(context) {
    return {
      performanceFallback: 'switch-to-tactical',
      complexityFallback: 'switch-to-strategic',
      resourceFallback: 'auto-scale'
    };
  }

  designFeedbackLoops(context) {
    return {
      performance: { frequency: '1min', action: 'optimize' },
      quality: { frequency: '5min', action: 'adjust' },
      user: { frequency: 'on-demand', action: 'adapt' }
    };
  }

  explainConsensusChoice(algorithm, analysis) {
    const explanations = {
      weighted: 'Fast consensus needed for urgent decisions',
      byzantine: 'Fault tolerance required for critical decisions',
      raft: 'Scalable consensus for large swarms',
      'simple-majority': 'Standard consensus for routine decisions'
    };
    return explanations[algorithm];
  }

  tuneConsensusParameters(algorithm, context) {
    const params = {
      weighted: { threshold: 0.6, timeout: 60000 },
      byzantine: { faultTolerance: 0.33, timeout: 300000 },
      raft: { heartbeat: 1000, electionTimeout: 5000 },
      'simple-majority': { threshold: 0.5, timeout: 120000 }
    };
    return params[algorithm];
  }

  assessCurrentLoad(context) {
    return context.agentCount || 3;
  }

  predictLoad(context, analysis) {
    return (context.agentCount || 3) * (1 + analysis.complexity * 0.5);
  }

  selectKeyMetrics(context) {
    return ['performance', 'quality', 'efficiency', 'satisfaction'];
  }

  determineMonitoringFrequency(context) {
    if (this.assessUrgency(context) > 0.7) return 'real-time';
    if (this.assessComplexity(context) > 0.7) return '1min';
    return '5min';
  }

  updateBestApproach(patternData) {
    const approachScores = {};

    for (const outcome of patternData.outcomes) {
      const approach = outcome.decision.approach;
      if (!approachScores[approach]) {
        approachScores[approach] = { successes: 0, total: 0 };
      }
      approachScores[approach].total++;
      if (outcome.outcome.success) {
        approachScores[approach].successes++;
      }
    }

    let bestApproach = null;
    let bestScore = 0;

    for (const [approach, scores] of Object.entries(approachScores)) {
      const score = scores.successes / scores.total;
      if (score > bestScore) {
        bestScore = score;
        bestApproach = approach;
      }
    }

    patternData.bestApproach = bestApproach;
  }

  getMetrics() {
    return {
      ...this.metrics,
      consensusAlgorithmsUsed: Object.fromEntries(this.metrics.consensusAlgorithmsUsed),
      patternsTracked: this.learningModel.patterns.size,
      historicalOutcomes: this.learningModel.outcomes.length,
      state: this.state,
      decisionStyle: this.decisionStyle,
      adaptability: this.adaptability
    };
  }

  getLearningModel() {
    return {
      patternCount: this.learningModel.patterns.size,
      outcomeCount: this.learningModel.outcomes.length,
      adaptationCount: this.learningModel.adaptations.length,
      patterns: Array.from(this.learningModel.patterns.values()).map(p => ({
        pattern: p.pattern,
        occurrences: p.occurrences,
        successRate: p.successRate,
        bestApproach: p.bestApproach
      }))
    };
  }
}

module.exports = AdaptiveQueenEngine;
