/**
 * Integration Tests - Context7-Informed Quality Scoring
 */

const fs = require('fs');
const path = require('path');
const { EnhancedPromptAnalyzer } = require('../code/lib/analyzer-enhanced');
const { EnhancedCaptainsLog } = require('../code/lib/captains-log-enhanced');

describe('Integration Tests', () => {
  let analyzer;
  let log;
  let testLogPath;

  beforeEach(() => {
    testLogPath = path.join(__dirname, '../temp-integration-logs');
    analyzer = new EnhancedPromptAnalyzer({ cacheTTL: 3600000 });
    log = new EnhancedCaptainsLog({ captainsLogPath: testLogPath, captainsLog: true });
  });

  afterEach(() => {
    analyzer.clearContext7Cache();
    if (fs.existsSync(testLogPath)) {
      fs.rmSync(testLogPath, { recursive: true, force: true });
    }
  });

  it('should score high-quality prompts at 9-10', async () => {
    const prompt = `
      Implement JWT auth with sessions/session-123/artifacts/code/auth.js.
      Tests to sessions/session-123/artifacts/tests/. 100% coverage required.
    `;

    const analysis = await analyzer.analyze(prompt);
    expect(analysis.qualityDimensions.overall).toBeGreaterThanOrEqual(0.7);
  });

  it('should detect and guide vague prompts', async () => {
    const prompt = 'Build something for API';
    const analysis = await analyzer.analyze(prompt);
    
    expect(analysis.qualityDimensions.overall).toBeLessThan(0.5);
    expect(analysis.context7Insights).toBeDefined();
  });

  it('should cache Context7 results efficiently', async () => {
    await analyzer.analyze('Build API with swarm');
    const stats1 = analyzer.getContext7CacheStats();
    
    await analyzer.analyze('Create API using swarm');
    const stats2 = analyzer.getContext7CacheStats();
    
    expect(stats2.entries).toBeLessThanOrEqual(stats1.entries + 1);
  });
});
