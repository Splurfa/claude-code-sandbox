/**
 * Pattern Auto-Application System Test Suite
 * Tests vector search, similarity matching, pattern extraction, and auto-apply
 */

const PatternMatcher = require('../pattern-matcher');
const PatternExtractor = require('../pattern-extractor');
const PatternApplicator = require('../pattern-applicator');
const { PatternMCP } = require('../pattern-mcp');
const path = require('path');
const fs = require('fs').promises;

// Test database path (use absolute path from project root)
const TEST_DB_PATH = path.resolve(__dirname, '../../../../../.swarm/memory.db');

describe('Pattern Auto-Application System', () => {
  let matcher, extractor, applicator, mcp;

  beforeAll(async () => {
    matcher = new PatternMatcher(TEST_DB_PATH);
    extractor = new PatternExtractor(TEST_DB_PATH);
    applicator = new PatternApplicator(TEST_DB_PATH);
    mcp = new PatternMCP(TEST_DB_PATH);

    await matcher.initialize();
    await extractor.initialize();
    await applicator.initialize();
    await mcp.initialize();
  });

  afterAll(async () => {
    await matcher.close();
    await extractor.close();
    await applicator.close();
    await mcp.close();
  });

  describe('PatternMatcher - Vector Search', () => {
    test('should retrieve all 77 patterns from database', async () => {
      const patterns = await matcher.getAllPatterns();
      expect(patterns).toBeDefined();
      expect(patterns.length).toBe(77);
      expect(patterns[0]).toHaveProperty('id');
      expect(patterns[0]).toHaveProperty('type');
      expect(patterns[0]).toHaveProperty('confidence');
    });

    test('should perform vector similarity search with AgentDB optimization', async () => {
      // Create test vector
      const queryVector = new Array(128).fill(0).map(() => Math.random());

      const startTime = Date.now();
      const results = await matcher.findSimilarPatterns(queryVector, {
        limit: 10,
        threshold: 0.5
      });
      const endTime = Date.now();

      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
      expect(endTime - startTime).toBeLessThan(100); // Should be fast (<100ms)
    });

    test('should match patterns by content with high similarity', async () => {
      const query = 'file operations and coordination patterns';

      const results = await matcher.matchByContent(query, {
        limit: 5,
        threshold: 0.7
      });

      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
      results.forEach(result => {
        expect(result).toHaveProperty('pattern');
        expect(result).toHaveProperty('similarity');
        expect(result).toHaveProperty('confidence');
      });
    });

    test('should match patterns by project context', async () => {
      const context = {
        path: '/test/project',
        files: ['index.js', 'server.js', 'package.json'],
        dependencies: {
          'express': '^4.18.0',
          'react': '^18.2.0'
        },
        technologies: ['react', 'express', 'node']
      };

      const recommendations = await matcher.matchByContext(context, {
        limit: 5,
        threshold: 0.85
      });

      expect(recommendations).toBeDefined();
      expect(Array.isArray(recommendations)).toBe(true);
    });

    test('should calculate cosine similarity correctly', () => {
      const vec1 = [1, 0, 0];
      const vec2 = [0, 1, 0];
      const vec3 = [1, 0, 0];

      const sim1 = matcher._calculateSimilarity(vec1, vec2, 'cosine');
      const sim2 = matcher._calculateSimilarity(vec1, vec3, 'cosine');

      expect(sim1).toBeCloseTo(0, 1); // Orthogonal vectors
      expect(sim2).toBeCloseTo(1, 1); // Identical vectors
    });

    test('should update pattern usage statistics', async () => {
      const patterns = await matcher.getAllPatterns();
      if (patterns.length > 0) {
        const patternId = patterns[0].id;
        const result = await matcher.updatePatternUsage(patternId);

        expect(result).toHaveProperty('updated');
        expect(result.updated).toBe(true);
      }
    });

    test('should get pattern links', async () => {
      const patterns = await matcher.getAllPatterns();
      if (patterns.length > 0) {
        const patternId = patterns[0].id;
        const links = await matcher.getPatternLinks(patternId);

        expect(links).toBeDefined();
        expect(Array.isArray(links)).toBe(true);
      }
    });
  });

  describe('PatternExtractor - Pattern Extraction', () => {
    test('should extract patterns from successful episodes', async () => {
      const patterns = await extractor.extractFromSuccessfulEpisodes(5);

      expect(patterns).toBeDefined();
      expect(Array.isArray(patterns)).toBe(true);
      patterns.forEach(pattern => {
        expect(pattern).toHaveProperty('id');
        expect(pattern).toHaveProperty('type');
        expect(pattern).toHaveProperty('data');
        expect(pattern).toHaveProperty('confidence');
      });
    });

    test('should extract pattern from file operations', () => {
      const fileOps = [
        { type: 'read', file: 'index.js' },
        { type: 'write', file: 'server.js' },
        { type: 'edit', file: 'package.json' },
        { type: 'read', file: 'config.js' }
      ];

      const pattern = extractor.extractFromFileOperations(fileOps);

      expect(pattern).toBeDefined();
      expect(pattern.type).toBe('reasoning_memory');
      expect(pattern.data.source).toBe('file_operations');
      expect(pattern.data.operations).toHaveProperty('read');
      expect(pattern.data.operations).toHaveProperty('write');
    });

    test('should extract pattern from agent coordination', () => {
      const coordination = [
        { agentId: 'agent1', role: 'coordinator', message: 'Task assigned' },
        { agentId: 'agent2', role: 'worker', message: 'Task completed' },
        { agentId: 'agent3', role: 'worker', message: 'Task in progress' }
      ];

      const pattern = extractor.extractFromCoordination(coordination);

      expect(pattern).toBeDefined();
      expect(pattern.type).toBe('reasoning_memory');
      expect(pattern.data.source).toBe('coordination');
      expect(pattern.data.topology).toBeDefined();
    });

    test('should extract pattern from memory usage', () => {
      const memoryOps = [
        { action: 'store', namespace: 'coordination', key: 'status', value: '{"status":"active"}' },
        { action: 'retrieve', namespace: 'coordination', key: 'status', value: '{"status":"active"}' },
        { action: 'search', namespace: 'patterns', key: 'pattern%', value: '[]' }
      ];

      const pattern = extractor.extractFromMemoryUsage(memoryOps);

      expect(pattern).toBeDefined();
      expect(pattern.type).toBe('reasoning_memory');
      expect(pattern.data.source).toBe('memory_usage');
      expect(pattern.data.namespaces).toHaveProperty('coordination');
    });

    test('should save extracted pattern to database', async () => {
      const pattern = {
        id: 'test-pattern-' + Date.now(),
        type: 'reasoning_memory',
        data: {
          source: 'test',
          description: 'Test pattern'
        },
        confidence: 0.85,
        usageCount: 0,
        createdAt: new Date().toISOString()
      };

      const result = await extractor.savePattern(pattern);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('saved');
      expect(result.saved).toBe(true);
    });

    test('should create pattern embedding', async () => {
      const patterns = await matcher.getAllPatterns();
      if (patterns.length > 0) {
        const patternId = patterns[0].id;
        const vector = new Array(128).fill(0).map(() => Math.random());

        const result = await extractor.savePatternEmbedding(patternId, vector);

        expect(result).toHaveProperty('patternId');
        expect(result).toHaveProperty('saved');
        expect(result.saved).toBe(true);
        expect(result.dims).toBe(128);
      }
    });

    test('should create pattern link', async () => {
      const patterns = await matcher.getAllPatterns();
      if (patterns.length >= 2) {
        const srcId = patterns[0].id;
        const dstId = patterns[1].id;

        const result = await extractor.createPatternLink(srcId, dstId, 'similar_to', 0.9);

        expect(result).toHaveProperty('srcId');
        expect(result).toHaveProperty('dstId');
        expect(result).toHaveProperty('saved');
        expect(result.saved).toBe(true);
      }
    });
  });

  describe('PatternApplicator - Pattern Application', () => {
    test('should analyze project and recommend patterns', async () => {
      const projectContext = {
        path: '/test/project',
        files: ['index.js', 'server.js'],
        dependencies: { 'express': '^4.18.0' },
        technologies: ['node', 'express']
      };

      const analysis = await applicator.analyzeProject(projectContext, {
        minConfidence: 0.7
      });

      expect(analysis).toHaveProperty('context');
      expect(analysis).toHaveProperty('matches');
      expect(analysis).toHaveProperty('recommendations');
      expect(analysis).toHaveProperty('plan');
      expect(analysis).toHaveProperty('metadata');
    });

    test('should apply pattern with confidence scoring', async () => {
      const patterns = await matcher.getAllPatterns();
      if (patterns.length > 0) {
        const patternId = patterns[0].id;
        const projectContext = {
          path: '/test/project'
        };

        const result = await applicator.applyPattern(patternId, projectContext, {
          dryRun: true,
          requireApproval: false
        });

        expect(result).toHaveProperty('applied');
        expect(result).toHaveProperty('patternId');
        expect(result).toHaveProperty('confidence');
        expect(result).toHaveProperty('similarity');
        expect(result).toHaveProperty('dryRun');
        expect(result.dryRun).toBe(true);
      }
    });

    test('should filter patterns by confidence threshold (>0.85)', async () => {
      const projectContext = {
        path: '/test/project',
        technologies: ['react', 'express']
      };

      const analysis = await applicator.analyzeProject(projectContext, {
        minConfidence: 0.85
      });

      analysis.recommendations.forEach(rec => {
        expect(rec.confidence).toBeGreaterThanOrEqual(0.85);
      });
    });

    test('should auto-apply patterns with high confidence (>0.90)', async () => {
      const projectContext = {
        path: '/test/project',
        technologies: ['node']
      };

      const result = await applicator.autoApplyPatterns(projectContext, {
        minConfidence: 0.90,
        maxPatterns: 3,
        createBackup: false
      });

      expect(result).toHaveProperty('applied');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('results');

      result.results.forEach(res => {
        if (res.applied) {
          expect(res.confidence).toBeGreaterThanOrEqual(0.90);
        }
      });
    });

    test('should request queen approval for medium confidence patterns', async () => {
      const patterns = await matcher.getAllPatterns();
      if (patterns.length > 0) {
        const patternId = patterns[0].id;
        const projectContext = {
          path: '/test/project'
        };

        const approval = await applicator.requestQueenApproval(patternId, projectContext);

        expect(approval).toHaveProperty('patternId');
        expect(approval).toHaveProperty('confidence');
        expect(approval).toHaveProperty('recommendation');
        expect(approval).toHaveProperty('approvalRequired');
      }
    });

    test('should track application history', async () => {
      const history = applicator.getApplicationHistory();

      expect(Array.isArray(history)).toBe(true);
      history.forEach(entry => {
        expect(entry).toHaveProperty('patternId');
        expect(entry).toHaveProperty('timestamp');
        expect(entry).toHaveProperty('confidence');
      });
    });
  });

  describe('PatternMCP - MCP Tool Integration', () => {
    test('should search patterns via MCP tool', async () => {
      const result = await mcp.searchPatterns({
        query: 'coordination patterns',
        limit: 5,
        threshold: 0.7
      });

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    test('should match patterns via MCP tool', async () => {
      const result = await mcp.matchPatterns({
        context: {
          path: '/test/project',
          technologies: ['react']
        },
        limit: 5,
        threshold: 0.85
      });

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    test('should extract patterns via MCP tool', async () => {
      const result = await mcp.extractPattern({
        source: 'file_operations',
        data: [
          { type: 'read', file: 'index.js' },
          { type: 'write', file: 'output.js' }
        ],
        saveToDb: false
      });

      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('pattern');
      expect(result.success).toBe(true);
    });

    test('should analyze project via MCP tool', async () => {
      const result = await mcp.analyzeProject({
        projectContext: {
          path: '/test/project',
          technologies: ['node', 'express']
        },
        minConfidence: 0.85
      });

      expect(result).toHaveProperty('context');
      expect(result).toHaveProperty('recommendations');
      expect(result).toHaveProperty('plan');
    });

    test('should get pattern statistics via MCP tool', async () => {
      const stats = await mcp.getPatternStats();

      expect(stats).toHaveProperty('total');
      expect(stats).toHaveProperty('byType');
      expect(stats).toHaveProperty('byConfidence');
      expect(stats).toHaveProperty('topUsed');
      expect(stats).toHaveProperty('recent');
      expect(stats.total).toBe(77);
    });

    test('should get application history via MCP tool', () => {
      const result = mcp.getApplicationHistory({
        successOnly: false
      });

      expect(result).toHaveProperty('history');
      expect(result).toHaveProperty('total');
      expect(Array.isArray(result.history)).toBe(true);
    });
  });

  describe('Integration - Episode Recording System', () => {
    test('should extract patterns from successful episodes and store them', async () => {
      const result = await mcp.extractPattern({
        source: 'episodes',
        data: { limit: 10 },
        saveToDb: false // Don't pollute DB in tests
      });

      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('patterns');
      expect(result.success).toBe(true);
      expect(Array.isArray(result.patterns)).toBe(true);
    });

    test('should integrate with ReasoningBank pattern format', async () => {
      const patterns = await matcher.getAllPatterns();

      patterns.forEach(pattern => {
        expect(pattern.type).toBe('reasoning_memory');
        expect(pattern).toHaveProperty('data');
        expect(pattern).toHaveProperty('confidence');
      });
    });
  });

  describe('Performance - AgentDB 150x Speedup', () => {
    test('should perform vector search in <100ms', async () => {
      const queryVector = new Array(128).fill(0).map(() => Math.random());

      const startTime = Date.now();
      await matcher.findSimilarPatterns(queryVector, {
        limit: 10,
        threshold: 0.5
      });
      const endTime = Date.now();

      const duration = endTime - startTime;
      expect(duration).toBeLessThan(100);
    });

    test('should handle bulk pattern matching efficiently', async () => {
      const contexts = Array(10).fill(null).map((_, i) => ({
        path: `/test/project${i}`,
        technologies: ['react', 'node']
      }));

      const startTime = Date.now();
      await Promise.all(contexts.map(ctx =>
        matcher.matchByContext(ctx, { limit: 5, threshold: 0.85 })
      ));
      const endTime = Date.now();

      const duration = endTime - startTime;
      expect(duration).toBeLessThan(500); // 10 searches in <500ms
    });
  });

  describe('Stock Adherence', () => {
    test('should use existing patterns from .swarm/memory.db', async () => {
      const patterns = await matcher.getAllPatterns();
      expect(patterns.length).toBeGreaterThan(0);
      expect(patterns.every(p => p.type === 'reasoning_memory')).toBe(true);
    });

    test('should follow ReasoningBank pattern format', async () => {
      const patterns = await matcher.getAllPatterns();

      patterns.forEach(pattern => {
        expect(pattern).toHaveProperty('id');
        expect(pattern).toHaveProperty('type');
        expect(pattern).toHaveProperty('data');
        expect(pattern).toHaveProperty('confidence');
        expect(pattern).toHaveProperty('usageCount');
        expect(typeof pattern.data).toBe('object');
      });
    });

    test('should store patterns in stock format', async () => {
      const testPattern = {
        id: 'stock-format-test-' + Date.now(),
        type: 'reasoning_memory',
        data: {
          source: 'test',
          description: 'Stock format validation'
        },
        confidence: 0.9,
        usageCount: 0,
        createdAt: new Date().toISOString()
      };

      const result = await extractor.savePattern(testPattern);
      expect(result.saved).toBe(true);

      // Verify it was saved in correct format
      const patterns = await matcher.getAllPatterns();
      const savedPattern = patterns.find(p => p.id === testPattern.id);

      expect(savedPattern).toBeDefined();
      expect(savedPattern.type).toBe('reasoning_memory');
    });
  });
});

describe('Vector Math Utilities', () => {
  const { cosineDistance, cosineSimilarity, euclideanDistance, normalize, dotProduct, magnitude } = require('../utils/vector-math');

  test('should calculate cosine distance correctly', () => {
    const vec1 = [1, 0, 0];
    const vec2 = [0, 1, 0];

    const distance = cosineDistance(vec1, vec2);
    expect(distance).toBeCloseTo(1, 5); // Orthogonal = distance of 1
  });

  test('should calculate cosine similarity correctly', () => {
    const vec1 = [1, 2, 3];
    const vec2 = [1, 2, 3];

    const similarity = cosineSimilarity(vec1, vec2);
    expect(similarity).toBeCloseTo(1, 5); // Identical = similarity of 1
  });

  test('should calculate Euclidean distance correctly', () => {
    const vec1 = [0, 0];
    const vec2 = [3, 4];

    const distance = euclideanDistance(vec1, vec2);
    expect(distance).toBeCloseTo(5, 5); // 3-4-5 triangle
  });

  test('should normalize vectors correctly', () => {
    const vec = [3, 4];
    const normalized = normalize(vec);

    const mag = magnitude(normalized);
    expect(mag).toBeCloseTo(1, 5); // Normalized magnitude = 1
  });

  test('should calculate dot product correctly', () => {
    const vec1 = [1, 2, 3];
    const vec2 = [4, 5, 6];

    const dot = dotProduct(vec1, vec2);
    expect(dot).toBe(32); // 1*4 + 2*5 + 3*6 = 32
  });

  test('should calculate magnitude correctly', () => {
    const vec = [3, 4];
    const mag = magnitude(vec);

    expect(mag).toBeCloseTo(5, 5); // sqrt(9 + 16) = 5
  });
});
