/**
 * Context7 Integration Tests
 *
 * Tests for smart Context7 fetching, caching, and documentation retrieval.
 */

const { Context7Integration } = require('../code/lib/context-aware');

describe('Context7Integration', () => {
  let context7;

  beforeEach(() => {
    context7 = new Context7Integration({
      cacheTTL: 1000 // 1 second for testing
    });
  });

  afterEach(() => {
    context7.clearCache();
  });

  describe('Consultation Triggers', () => {
    it('should trigger for high complexity prompts', () => {
      const analysis = {
        complexity: 0.8,
        qualityScore: 0.7,
        mode: 'swarm',
        agentCount: 3,
        structure: { score: 0.6 },
        criticalIssues: []
      };

      const shouldConsult = context7.shouldConsultContext7(analysis);
      expect(shouldConsult).toBe(true);
    });

    it('should trigger for low quality prompts', () => {
      const analysis = {
        complexity: 0.3,
        qualityScore: 0.4,
        mode: 'direct',
        agentCount: 1,
        structure: { score: 0.5 },
        criticalIssues: []
      };

      const shouldConsult = context7.shouldConsultContext7(analysis);
      expect(shouldConsult).toBe(true);
    });

    it('should trigger for critical issues', () => {
      const analysis = {
        complexity: 0.3,
        qualityScore: 0.7,
        mode: 'direct',
        agentCount: 1,
        structure: { score: 0.7 },
        criticalIssues: [
          { type: 'file_routing', severity: 'critical' }
        ]
      };

      const shouldConsult = context7.shouldConsultContext7(analysis);
      expect(shouldConsult).toBe(true);
    });

    it('should NOT trigger for high-quality simple prompts', () => {
      const analysis = {
        complexity: 0.2,
        qualityScore: 0.9,
        mode: 'direct',
        agentCount: 1,
        structure: { score: 0.8 },
        criticalIssues: []
      };

      const shouldConsult = context7.shouldConsultContext7(analysis);
      expect(shouldConsult).toBe(false);
    });
  });

  describe('Caching', () => {
    it('should cache insights', async () => {
      const analysis = {
        mode: 'swarm',
        complexity: 0.7,
        agentCount: 3,
        context: {},
        qualityScore: 0.5,
        criticalIssues: [],
        structure: { score: 0.6 }
      };

      const insights1 = await context7.fetchContext7Insights(analysis);
      const insights2 = await context7.fetchContext7Insights(analysis);

      expect(insights1).toEqual(insights2);
    });

    it('should expire cache', async () => {
      const shortTTL = new Context7Integration({ cacheTTL: 50 });

      const analysis = {
        mode: 'swarm',
        complexity: 0.7,
        agentCount: 3,
        context: {},
        qualityScore: 0.5,
        criticalIssues: [],
        structure: { score: 0.6 }
      };

      await shortTTL.fetchContext7Insights(analysis);
      await new Promise(resolve => setTimeout(resolve, 100));
      await shortTTL.fetchContext7Insights(analysis);

      const stats = shortTTL.getCacheStats();
      expect(stats.entries).toBe(1);
    });
  });
});
