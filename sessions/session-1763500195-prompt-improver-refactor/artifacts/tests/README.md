# Context-Aware Analyzer Test Suite

Comprehensive tests validating Context7-informed quality scoring for the prompt improver system.

## Test Coverage

### 1. Context7 Integration (`context-aware.test.js`)
- ✅ Context7 fetch triggering
- ✅ Caching prevents redundant fetches
- ✅ Cached data persists within conversation
- ✅ Memory storage integration
- ✅ Data quality validation
- ✅ Performance characteristics
- ✅ Error handling

### 2. Quality Scoring Validation (`quality-scoring-validation.test.js`)
- ✅ Scores align with Claude Code best practices
- ✅ Evidence-based score alignment
- ✅ Intervention thresholds (< 0.5 triggers intervention)
- ✅ Mode-specific scoring (default, learning, production)
- ✅ Edge case handling
- ✅ Context7 integration impact

### 3. Caching Performance (`caching.test.js`)
- ✅ First fetch: <500ms acceptable latency
- ✅ Cached operations: <10ms target
- ✅ Token efficiency: <500 tokens overhead
- ✅ Cache invalidation (TTL-based)
- ✅ Concurrent access handling
- ✅ Memory pressure management

### 4. Integration Tests (`integration.test.js`)
- ✅ Full workflow: Analyzer → Context7 → Memory → Captain's Log
- ✅ Session-level caching
- ✅ Conversation persistence
- ✅ Performance under load
- ✅ Error recovery
- ✅ Multi-turn analysis

## Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test context-aware.test.js

# Watch mode
npm run test:watch

# Integration tests only
npm run test:integration

# Unit tests only
npm run test:unit
```

## Coverage Goals

- **Statements**: >90%
- **Branches**: >90%
- **Functions**: >90%
- **Lines**: >90%

## Test Structure

Each test file follows the same pattern:

```javascript
describe('Feature Category', () => {
  beforeEach(() => {
    // Setup mocks and state
  });

  describe('Specific Behavior', () => {
    it('should validate expected outcome', async () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

## Key Test Patterns

### Context7 Integration
```javascript
// Verify fetch + cache + memory flow
mockMemoryRetrieve.mockResolvedValue(null); // Cache miss
const result = await getClaudeCodeContext();
expect(mockContext7Fetch).toHaveBeenCalled();
expect(mockMemoryStore).toHaveBeenCalled();
```

### Quality Scoring
```javascript
// Validate evidence-based thresholds
const result = await analyzePromptQuality(prompt);
expect(result.score).toBeGreaterThan(0.8); // High quality
expect(result.shouldIntervene).toBe(false);
```

### Caching Performance
```javascript
// Measure latency
const start = performance.now();
await getClaudeCodeContext();
const duration = performance.now() - start;
expect(duration).toBeLessThan(10); // <10ms for cached
```

## Mocking Strategy

All external dependencies are mocked:
- `context7-client` - Context7 API
- `memory-client` - Memory storage
- `captains-log` - Logging system

Mocks are reset between tests to ensure isolation.

## Performance Benchmarks

| Operation | Target | Test Coverage |
|-----------|--------|---------------|
| First fetch | <500ms | ✅ context-aware.test.js |
| Cached read | <10ms | ✅ caching.test.js |
| Token overhead | <500 tokens | ✅ caching.test.js |
| Concurrent reads (50) | <100ms | ✅ caching.test.js |
| Full analysis | <100ms | ✅ integration.test.js |

## Edge Cases Covered

- Empty prompts
- Malformed Context7 responses
- Cache corruption
- Network timeouts
- Memory pressure
- Concurrent access
- Very long prompts (>10k chars)
- Mixed quality signals
- All dependencies failing

## Custom Matchers

```javascript
// Range checking
expect(score).toBeWithinRange(0.5, 0.8);

// Pattern matching
expect(text).toContainPattern('TodoWrite.*todos');

// Timestamp validation
expect(result).toHaveTimestamp();
```

## Debugging Tests

```bash
# Run single test with verbose output
npm test -- context-aware.test.js --verbose

# Debug specific test
node --inspect-brk node_modules/.bin/jest context-aware.test.js

# Show test names only
npm test -- --listTests
```

## CI/CD Integration

Tests are designed to run in CI environments:
- No external dependencies (all mocked)
- Deterministic (no random data)
- Fast (<10s total execution)
- Clear failure messages

## Evidence-Based Thresholds

Tests validate alignment with Claude Code best practices:

| Pattern | Good Score | Bad Score | Threshold |
|---------|-----------|-----------|-----------|
| TodoWrite (5+ todos) | >0.8 | <0.5 | 0.5 |
| Parallel agents | >0.8 | <0.6 | 0.5 |
| Batched files | >0.75 | <0.6 | 0.5 |
| Sequential ops | <0.6 | - | 0.5 |

## Next Steps

1. Run tests: `npm test`
2. Check coverage: `npm run test:coverage`
3. Fix any failures
4. Ensure >90% coverage
5. Validate performance benchmarks
6. Document any new edge cases

## Contributing

When adding new tests:
1. Follow existing structure
2. Add to appropriate test file
3. Include performance benchmarks if relevant
4. Update this README with coverage details
5. Ensure all mocks are properly reset
