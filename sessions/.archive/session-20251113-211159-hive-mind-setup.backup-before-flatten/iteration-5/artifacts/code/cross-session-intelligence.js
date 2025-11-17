/**
 * Cross-Session Intelligence - Phase 3
 *
 * Enables intelligence and learning across multiple sessions:
 * - Query patterns from all sessions
 * - Aggregate learnings from corrections
 * - Identify recurring patterns
 * - Surface relevant past decisions
 * - "Similar to session-XYZ" recommendations
 */

const { AutomaticRouter } = require('./automatic-routing');
const { PatternRecognitionSystem } = require('./pattern-recognition');
const path = require('path');
const fs = require('fs').promises;

class CrossSessionIntelligence {
  constructor(options = {}) {
    this.router = options.router || new AutomaticRouter();
    this.patternSystem = options.patternSystem || new PatternRecognitionSystem({ router: this.router });
    this.sessionsPath = options.sessionsPath || path.join(process.cwd(), 'sessions');
    this.similarityThreshold = options.similarityThreshold || 0.75;
  }

  /**
   * Find similar sessions based on context
   */
  async findSimilarSessions(currentContext, contextEmbedding, options = {}) {
    const topK = options.topK || 5;
    const excludeCurrentSession = options.excludeCurrentSession !== false;

    const sessionResults = await this.router.search({
      embedding: contextEmbedding,
      vectorSearch: true
    }, {
      topK: topK * 2,
      filters: {
        type: 'session-summary'
      }
    });

    const similarSessions = sessionResults.results
      .filter(result => {
        if (excludeCurrentSession && result.id.includes(process.env.SESSION_ID || '')) {
          return false;
        }
        return result.similarity >= this.similarityThreshold;
      })
      .slice(0, topK)
      .map(result => ({
        sessionId: result.id,
        similarity: result.similarity,
        metadata: result.metadata,
        relevance: this._calculateRelevance(result)
      }));

    return {
      currentContext,
      similarSessions,
      timestamp: Date.now()
    };
  }

  /**
   * Query patterns across all sessions
   */
  async queryPatternsAcrossSessions(query, queryEmbedding, options = {}) {
    const timeRange = options.timeRange;
    const category = options.category;

    const patternMatches = await this.patternSystem.findPatterns(
      query,
      queryEmbedding,
      { topK: 10, category }
    );

    const patternsWithSessions = await Promise.all(
      patternMatches.matches.map(async (match) => {
        const sessionsUsingPattern = await this._findSessionsUsingPattern(
          match.pattern.id,
          timeRange
        );

        return {
          ...match,
          sessionsUsed: sessionsUsingPattern.length,
          sessions: sessionsUsingPattern.slice(0, 5)
        };
      })
    );

    return {
      query,
      patterns: patternsWithSessions,
      totalSessionsAnalyzed: await this._countTotalSessions(),
      timestamp: Date.now()
    };
  }

  /**
   * Aggregate learnings from corrections across sessions
   */
  async aggregateLearnings(options = {}) {
    const timeRange = options.timeRange || 86400000 * 30;
    const category = options.category;

    const learningEvents = await this.router.search({
      pattern: 'pattern-learning-*'
    }, {
      filters: {
        timestamp: { $gte: Date.now() - timeRange },
        ...(category && { 'metadata.category': category })
      }
    });

    const aggregated = {};
    for (const event of learningEvents) {
      const pattern = event.metadata?.suggestedPattern || 'unknown';

      if (!aggregated[pattern]) {
        aggregated[pattern] = {
          pattern,
          totalCorrections: 0,
          avgFeedback: 0,
          corrections: []
        };
      }

      aggregated[pattern].totalCorrections++;
      aggregated[pattern].corrections.push({
        correctPattern: event.metadata?.correctPattern,
        feedback: event.value?.feedback || 0,
        timestamp: event.metadata?.timestamp
      });
    }

    for (const pattern of Object.values(aggregated)) {
      pattern.avgFeedback =
        pattern.corrections.reduce((sum, c) => sum + c.feedback, 0) /
        pattern.totalCorrections;
    }

    return {
      patterns: Object.values(aggregated),
      totalEvents: learningEvents.length,
      timeRange,
      timestamp: Date.now()
    };
  }

  /**
   * Identify recurring patterns across sessions
   */
  async identifyRecurringPatterns(options = {}) {
    const minOccurrences = options.minOccurrences || 3;
    const timeRange = options.timeRange || 86400000 * 30;

    const matches = await this.router.search({
      pattern: 'pattern-match-*'
    }, {
      filters: {
        timestamp: { $gte: Date.now() - timeRange }
      }
    });

    const patternCounts = {};
    const patternSessions = {};

    for (const match of matches) {
      const patterns = match.value?.matches || [];
      const sessionId = this._extractSessionId(match.id);

      for (const pattern of patterns) {
        const patternId = pattern.pattern?.id || 'unknown';

        patternCounts[patternId] = (patternCounts[patternId] || 0) + 1;

        if (!patternSessions[patternId]) {
          patternSessions[patternId] = new Set();
        }
        patternSessions[patternId].add(sessionId);
      }
    }

    const recurring = Object.entries(patternCounts)
      .filter(([_, count]) => count >= minOccurrences)
      .map(([patternId, count]) => ({
        patternId,
        occurrences: count,
        uniqueSessions: patternSessions[patternId].size,
        sessions: Array.from(patternSessions[patternId])
      }))
      .sort((a, b) => b.occurrences - a.occurrences);

    return {
      recurringPatterns: recurring,
      minOccurrences,
      timeRange,
      timestamp: Date.now()
    };
  }

  /**
   * Get recommendations based on similar past sessions
   */
  async getRecommendations(currentContext, contextEmbedding, options = {}) {
    const similar = await this.findSimilarSessions(
      currentContext,
      contextEmbedding,
      options
    );

    const recommendations = await Promise.all(
      similar.similarSessions.map(async (session) => {
        const decisions = await this._extractSessionDecisions(session.sessionId);
        const outcomes = await this._extractSessionOutcomes(session.sessionId);

        return {
          sessionId: session.sessionId,
          similarity: session.similarity,
          relevance: session.relevance,
          keyDecisions: decisions.slice(0, 3),
          outcomes: outcomes.slice(0, 3),
          recommendation: this._generateRecommendation(decisions, outcomes)
        };
      })
    );

    return {
      currentContext,
      recommendations: recommendations.filter(r => r.recommendation),
      timestamp: Date.now()
    };
  }

  _calculateRelevance(result) {
    const recencyFactor = this._calculateRecency(result.metadata?.timestamp);
    const successFactor = result.metadata?.success ? 1.0 : 0.8;

    return result.similarity * 0.6 + recencyFactor * 0.2 + successFactor * 0.2;
  }

  _calculateRecency(timestamp) {
    if (!timestamp) return 0.5;

    const ageMs = Date.now() - timestamp;
    const ageDays = ageMs / (86400000);

    return Math.exp(-ageDays / 30);
  }

  async _findSessionsUsingPattern(patternId, timeRange) {
    const matches = await this.router.search({
      pattern: 'pattern-match-*'
    }, {
      filters: {
        ...(timeRange && { timestamp: { $gte: Date.now() - timeRange } })
      }
    });

    const sessions = new Set();
    for (const match of matches) {
      const patterns = match.value?.matches || [];
      if (patterns.some(p => p.pattern?.id === patternId)) {
        sessions.add(this._extractSessionId(match.id));
      }
    }

    return Array.from(sessions);
  }

  async _countTotalSessions() {
    try {
      const dirs = await fs.readdir(this.sessionsPath);
      return dirs.filter(d => d.startsWith('session-')).length;
    } catch (error) {
      return 0;
    }
  }

  _extractSessionId(key) {
    const match = key.match(/session-\d{8}-\d{6}-[a-z-]+/);
    return match ? match[0] : 'unknown';
  }

  async _extractSessionDecisions(sessionId) {
    const decisions = await this.router.search({
      pattern: `${sessionId}*decision*`
    });

    return decisions.map(d => ({
      decision: d.value?.decision || d.value,
      timestamp: d.metadata?.timestamp,
      confidence: d.metadata?.confidence
    }));
  }

  async _extractSessionOutcomes(sessionId) {
    const outcomes = await this.router.search({
      pattern: `${sessionId}*outcome*`
    });

    return outcomes.map(o => ({
      outcome: o.value?.outcome || o.value,
      success: o.metadata?.success,
      timestamp: o.metadata?.timestamp
    }));
  }

  _generateRecommendation(decisions, outcomes) {
    if (decisions.length === 0 || outcomes.length === 0) {
      return null;
    }

    const successfulOutcomes = outcomes.filter(o => o.success);
    const successRate = successfulOutcomes.length / outcomes.length;

    if (successRate >= 0.7) {
      return {
        type: 'follow-pattern',
        message: `Similar approach succeeded ${(successRate * 100).toFixed(0)}% of the time`,
        confidence: successRate
      };
    } else {
      return {
        type: 'avoid-pattern',
        message: `Similar approach had low success rate (${(successRate * 100).toFixed(0)}%)`,
        confidence: 1 - successRate
      };
    }
  }
}

module.exports = { CrossSessionIntelligence };
