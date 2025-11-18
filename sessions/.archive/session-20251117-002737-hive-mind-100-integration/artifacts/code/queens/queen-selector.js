/**
 * Queen Auto-Selection Logic
 *
 * Intelligently selects the optimal queen type based on project characteristics
 */

const StrategicQueenEngine = require('./strategic-engine');
const TacticalQueenEngine = require('./tactical-engine');
const AdaptiveQueenEngine = require('./adaptive-engine');

class QueenSelector {
  constructor() {
    this.engines = {
      strategic: null,
      tactical: null,
      adaptive: null
    };

    this.selectionHistory = [];
    this.performanceData = new Map();
  }

  /**
   * Select optimal queen type based on project context
   */
  selectQueen(projectContext) {
    const analysis = this.analyzeProject(projectContext);
    const queenType = this.determineQueenType(analysis);

    this.selectionHistory.push({
      projectContext,
      analysis,
      selectedQueen: queenType,
      timestamp: Date.now()
    });

    return {
      queenType,
      engine: this.getEngine(queenType),
      rationale: this.explainSelection(queenType, analysis),
      analysis
    };
  }

  /**
   * Analyze project characteristics
   */
  analyzeProject(context) {
    return {
      // Project scale
      scale: this.assessScale(context),

      // Time sensitivity
      urgency: this.assessUrgency(context),

      // Complexity and unknowns
      complexity: this.assessComplexity(context),

      // Project type
      type: this.identifyProjectType(context),

      // Team size and composition
      teamSize: context.agentCount || context.teamSize || 5,

      // Quality requirements
      qualityRequirements: this.assessQualityRequirements(context),

      // Risk profile
      riskProfile: this.assessRiskProfile(context),

      // Innovation vs execution
      innovationLevel: this.assessInnovationLevel(context),

      // Stakeholder complexity
      stakeholderComplexity: this.assessStakeholderComplexity(context),

      // Technical debt
      technicalDebt: this.assessTechnicalDebt(context),

      // Predictability
      predictability: this.assessPredictability(context)
    };
  }

  /**
   * Determine optimal queen type based on analysis
   */
  determineQueenType(analysis) {
    // Calculate scores for each queen type
    const scores = {
      strategic: this.calculateStrategicScore(analysis),
      tactical: this.calculateTacticalScore(analysis),
      adaptive: this.calculateAdaptiveScore(analysis)
    };

    // Find highest scoring queen type
    const bestQueen = Object.entries(scores)
      .reduce((best, [type, score]) =>
        score > best.score ? { type, score } : best,
        { type: 'adaptive', score: scores.adaptive }
      );

    // If scores are close, prefer adaptive
    const secondBest = Object.entries(scores)
      .filter(([type]) => type !== bestQueen.type)
      .reduce((best, [type, score]) =>
        score > best.score ? { type, score } : best,
        { type: null, score: 0 }
      );

    if (bestQueen.score - secondBest.score < 0.15) {
      return 'adaptive'; // Uncertain situation - use adaptive
    }

    return bestQueen.type;
  }

  /**
   * Calculate strategic queen fitness score
   */
  calculateStrategicScore(analysis) {
    let score = 0;

    // Favors:
    // - High complexity projects
    if (analysis.complexity > 0.7) score += 0.25;

    // - Long-term projects
    if (analysis.urgency < 0.4) score += 0.2;

    // - High quality requirements
    if (analysis.qualityRequirements > 0.8) score += 0.2;

    // - Architectural/infrastructure projects
    if (['architecture', 'infrastructure', 'platform'].includes(analysis.type)) score += 0.25;

    // - High risk projects
    if (analysis.riskProfile > 0.7) score += 0.15;

    // - Low technical debt tolerance
    if (analysis.technicalDebt < 0.3) score += 0.1;

    // - Many stakeholders
    if (analysis.stakeholderComplexity > 0.7) score += 0.15;

    // - High innovation
    if (analysis.innovationLevel > 0.7) score += 0.1;

    return Math.min(score, 1.0);
  }

  /**
   * Calculate tactical queen fitness score
   */
  calculateTacticalScore(analysis) {
    let score = 0;

    // Favors:
    // - Low to medium complexity
    if (analysis.complexity < 0.6) score += 0.2;

    // - High urgency
    if (analysis.urgency > 0.7) score += 0.3;

    // - Execution-focused projects
    if (['feature', 'bugfix', 'optimization', 'integration'].includes(analysis.type)) score += 0.25;

    // - Smaller teams
    if (analysis.teamSize <= 5) score += 0.15;

    // - Moderate quality requirements
    if (analysis.qualityRequirements > 0.6 && analysis.qualityRequirements < 0.9) score += 0.15;

    // - Well-understood problems (high predictability)
    if (analysis.predictability > 0.7) score += 0.2;

    // - Moderate risk
    if (analysis.riskProfile > 0.3 && analysis.riskProfile < 0.7) score += 0.1;

    // - Low innovation (execution focus)
    if (analysis.innovationLevel < 0.5) score += 0.15;

    return Math.min(score, 1.0);
  }

  /**
   * Calculate adaptive queen fitness score
   */
  calculateAdaptiveScore(analysis) {
    let score = 0;

    // Favors:
    // - Uncertain/variable complexity
    if (analysis.complexity > 0.4 && analysis.complexity < 0.8) score += 0.2;

    // - Medium urgency (needs balance)
    if (analysis.urgency > 0.4 && analysis.urgency < 0.7) score += 0.2;

    // - Research/exploration projects
    if (['research', 'exploration', 'prototype', 'experiment'].includes(analysis.type)) score += 0.3;

    // - Variable team sizes
    if (analysis.teamSize > 5 && analysis.teamSize < 15) score += 0.15;

    // - High innovation projects
    if (analysis.innovationLevel > 0.6) score += 0.25;

    // - Low predictability (needs adaptation)
    if (analysis.predictability < 0.5) score += 0.3;

    // - Variable risk
    if (analysis.riskProfile > 0.4 && analysis.riskProfile < 0.8) score += 0.15;

    // - Mixed quality requirements
    if (analysis.qualityRequirements > 0.5 && analysis.qualityRequirements < 0.85) score += 0.1;

    // - Evolving requirements
    if (analysis.stakeholderComplexity > 0.5) score += 0.1;

    return Math.min(score, 1.0);
  }

  /**
   * Get or create queen engine
   */
  getEngine(queenType) {
    if (!this.engines[queenType]) {
      switch (queenType) {
        case 'strategic':
          this.engines[queenType] = new StrategicQueenEngine();
          break;
        case 'tactical':
          this.engines[queenType] = new TacticalQueenEngine();
          break;
        case 'adaptive':
          this.engines[queenType] = new AdaptiveQueenEngine();
          break;
        default:
          throw new Error(`Unknown queen type: ${queenType}`);
      }
    }
    return this.engines[queenType];
  }

  /**
   * Explain selection rationale
   */
  explainSelection(queenType, analysis) {
    const explanations = {
      strategic: this.explainStrategic(analysis),
      tactical: this.explainTactical(analysis),
      adaptive: this.explainAdaptive(analysis)
    };

    return explanations[queenType];
  }

  explainStrategic(analysis) {
    const reasons = [];

    if (analysis.complexity > 0.7) {
      reasons.push('High complexity requires thorough planning');
    }
    if (analysis.urgency < 0.4) {
      reasons.push('Time available for comprehensive analysis');
    }
    if (analysis.qualityRequirements > 0.8) {
      reasons.push('High quality standards require strategic oversight');
    }
    if (['architecture', 'infrastructure', 'platform'].includes(analysis.type)) {
      reasons.push('Architectural decisions benefit from strategic planning');
    }
    if (analysis.riskProfile > 0.7) {
      reasons.push('High-risk project requires careful risk management');
    }

    return {
      queenType: 'Strategic Queen',
      reasons,
      approach: 'Long-term planning with Byzantine consensus for fault tolerance',
      strengths: ['Quality oversight', 'Risk management', 'Architecture design']
    };
  }

  explainTactical(analysis) {
    const reasons = [];

    if (analysis.urgency > 0.7) {
      reasons.push('High urgency requires fast execution');
    }
    if (analysis.complexity < 0.6) {
      reasons.push('Well-understood problem allows rapid implementation');
    }
    if (['feature', 'bugfix', 'optimization'].includes(analysis.type)) {
      reasons.push('Execution-focused task suits tactical approach');
    }
    if (analysis.predictability > 0.7) {
      reasons.push('Predictable scope enables efficient execution');
    }

    return {
      queenType: 'Tactical Queen',
      reasons,
      approach: 'Fast execution with weighted consensus for speed',
      strengths: ['Rapid response', 'Optimization', 'Problem-solving']
    };
  }

  explainAdaptive(analysis) {
    const reasons = [];

    if (analysis.predictability < 0.5) {
      reasons.push('Low predictability requires adaptive approach');
    }
    if (analysis.innovationLevel > 0.6) {
      reasons.push('High innovation benefits from learning and adaptation');
    }
    if (['research', 'exploration', 'prototype'].includes(analysis.type)) {
      reasons.push('Exploratory work requires flexible approach');
    }
    if (analysis.complexity > 0.4 && analysis.complexity < 0.8) {
      reasons.push('Moderate complexity suits adaptive strategy');
    }

    return {
      queenType: 'Adaptive Queen',
      reasons,
      approach: 'Dynamic adaptation with context-aware consensus selection',
      strengths: ['Learning', 'Context-awareness', 'Flexibility']
    };
  }

  // Assessment helper methods
  assessScale(context) {
    const indicators = [
      context.agentCount || 5,
      context.codebaseSize || 'medium',
      context.teamSize || 5
    ];

    let scale = 0;
    if (indicators[0] > 10) scale += 0.4;
    else if (indicators[0] > 5) scale += 0.2;

    if (indicators[1] === 'large') scale += 0.3;
    else if (indicators[1] === 'medium') scale += 0.15;

    if (indicators[2] > 10) scale += 0.3;
    else if (indicators[2] > 5) scale += 0.15;

    return Math.min(scale, 1.0);
  }

  assessUrgency(context) {
    if (context.priority === 'critical' || context.deadline === 'immediate') return 0.95;
    if (context.priority === 'high' || context.deadline === 'urgent') return 0.75;
    if (context.priority === 'medium' || context.deadline === 'moderate') return 0.5;
    return 0.25;
  }

  assessComplexity(context) {
    let complexity = 0;

    complexity += Math.min((context.unknowns || 0) / 10, 0.3);
    complexity += Math.min((context.dependencies?.length || 0) / 20, 0.3);
    complexity += Math.min((context.integrations?.length || 0) / 10, 0.2);

    if (context.technicalChallenges === 'high') complexity += 0.2;
    else if (context.technicalChallenges === 'medium') complexity += 0.1;

    return Math.min(complexity, 1.0);
  }

  identifyProjectType(context) {
    return context.projectType || context.type || 'feature';
  }

  assessQualityRequirements(context) {
    const qualityMap = {
      'critical': 1.0,
      'high': 0.8,
      'medium': 0.6,
      'low': 0.4
    };
    return qualityMap[context.quality || 'medium'] || 0.6;
  }

  assessRiskProfile(context) {
    const riskMap = {
      'critical': 0.95,
      'high': 0.75,
      'medium': 0.5,
      'low': 0.25
    };
    return riskMap[context.risk || 'medium'] || 0.5;
  }

  assessInnovationLevel(context) {
    const innovationMap = {
      'groundbreaking': 0.95,
      'high': 0.75,
      'medium': 0.5,
      'low': 0.25,
      'none': 0.1
    };
    return innovationMap[context.innovation || 'medium'] || 0.5;
  }

  assessStakeholderComplexity(context) {
    const stakeholders = context.stakeholders?.length || 3;
    return Math.min(stakeholders / 10, 1.0);
  }

  assessTechnicalDebt(context) {
    const debtMap = {
      'critical': 0.95,
      'high': 0.75,
      'medium': 0.5,
      'low': 0.25,
      'none': 0.1
    };
    return debtMap[context.technicalDebt || 'low'] || 0.25;
  }

  assessPredictability(context) {
    if (context.wellUnderstood === true) return 0.9;
    if (context.novel === true) return 0.2;

    const predictabilityMap = {
      'very-high': 0.95,
      'high': 0.75,
      'medium': 0.5,
      'low': 0.25,
      'very-low': 0.1
    };
    return predictabilityMap[context.predictability || 'medium'] || 0.5;
  }

  /**
   * Get selection statistics
   */
  getStatistics() {
    const typeCount = { strategic: 0, tactical: 0, adaptive: 0 };

    for (const selection of this.selectionHistory) {
      typeCount[selection.selectedQueen]++;
    }

    return {
      totalSelections: this.selectionHistory.length,
      distribution: typeCount,
      recentSelections: this.selectionHistory.slice(-10).map(s => ({
        queenType: s.selectedQueen,
        projectType: s.analysis.type,
        timestamp: s.timestamp
      }))
    };
  }
}

module.exports = QueenSelector;
