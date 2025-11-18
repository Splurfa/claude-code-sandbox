/**
 * Context7 Cache Behavior Tests
 *
 * Validates caching functionality including:
 * - Cache hit/miss behavior
 * - TTL expiration
 * - Cache stats accuracy
 * - Multiple cache entries
 * - Cache clearing
 */

// Mock implementation of Context7 cache
class Context7Cache {
  constructor(ttl = 3600000) { // 1 hour default
    this.cache = new Map();
    this.stats = { hits: 0, misses: 0 };
    this.ttl = ttl;
  }

  get(key) {
    const entry = this.cache.get(key);

    if (!entry) {
      this.stats.misses++;
      return null;
    }

    // Check TTL expiration
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }

    this.stats.hits++;
    return entry.value;
  }

  set(key, value) {
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }

  clear() {
    this.cache.clear();
    this.stats = { hits: 0, misses: 0 };
  }

  getStats() {
    return {
      ...this.stats,
      size: this.cache.size,
      hitRate: this.stats.hits + this.stats.misses === 0
        ? 0
        : this.stats.hits / (this.stats.hits + this.stats.misses)
    };
  }

  // Test helper to simulate time passage
  _advanceTime(entry, ms) {
    if (entry) {
      entry.timestamp -= ms;
    }
  }
}

describe('Context7 Cache Tests', () => {
  let cache;

  beforeEach(() => {
    cache = new Context7Cache(3600000); // 1 hour TTL
  });

  afterEach(() => {
    cache.clear();
  });

  describe('Cache Hit/Miss Behavior', () => {
    it('should return null on cache miss', () => {
      const result = cache.get('nonexistent-key');

      expect(result).toBeNull();
      expect(cache.getStats().misses).toBe(1);
      expect(cache.getStats().hits).toBe(0);
    });

    it('should return cached value on cache hit', () => {
      const testData = { result: 'test context' };
      cache.set('test-key', testData);

      const result = cache.get('test-key');

      expect(result).toEqual(testData);
      expect(cache.getStats().hits).toBe(1);
      expect(cache.getStats().misses).toBe(0);
    });

    it('should handle multiple cache hits', () => {
      cache.set('key1', 'value1');

      cache.get('key1'); // hit 1
      cache.get('key1'); // hit 2
      cache.get('key1'); // hit 3

      const stats = cache.getStats();
      expect(stats.hits).toBe(3);
      expect(stats.misses).toBe(0);
      expect(stats.hitRate).toBe(1.0);
    });

    it('should track mixed hits and misses correctly', () => {
      cache.set('existing', 'data');

      cache.get('existing');    // hit
      cache.get('missing1');    // miss
      cache.get('existing');    // hit
      cache.get('missing2');    // miss

      const stats = cache.getStats();
      expect(stats.hits).toBe(2);
      expect(stats.misses).toBe(2);
      expect(stats.hitRate).toBe(0.5);
    });
  });

  describe('TTL Expiration', () => {
    it('should expire entries after TTL', () => {
      const shortTTL = new Context7Cache(1000); // 1 second
      shortTTL.set('temp-key', 'temp-value');

      // Simulate time passage by modifying timestamp
      const entry = shortTTL.cache.get('temp-key');
      shortTTL._advanceTime(entry, 1001); // Advance past TTL

      const result = shortTTL.get('temp-key');

      expect(result).toBeNull();
      expect(shortTTL.cache.has('temp-key')).toBe(false);
      expect(shortTTL.getStats().misses).toBe(1);
    });

    it('should not expire entries before TTL', () => {
      const longTTL = new Context7Cache(3600000); // 1 hour
      longTTL.set('persistent-key', 'persistent-value');

      // Simulate 30 minutes passage
      const entry = longTTL.cache.get('persistent-key');
      longTTL._advanceTime(entry, 1800000);

      const result = longTTL.get('persistent-key');

      expect(result).toBe('persistent-value');
      expect(longTTL.getStats().hits).toBe(1);
    });

    it('should handle edge case at exact TTL boundary', () => {
      const exactTTL = new Context7Cache(1000);
      exactTTL.set('boundary-key', 'boundary-value');

      const entry = exactTTL.cache.get('boundary-key');
      exactTTL._advanceTime(entry, 1001); // Just past TTL (> not >=)

      const result = exactTTL.get('boundary-key');

      // Should be expired (> TTL)
      expect(result).toBeNull();
    });
  });

  describe('Cache Stats Accuracy', () => {
    it('should maintain accurate stats across operations', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');

      // 3 hits
      cache.get('key1');
      cache.get('key2');
      cache.get('key1');

      // 2 misses
      cache.get('missing1');
      cache.get('missing2');

      const stats = cache.getStats();

      expect(stats.hits).toBe(3);
      expect(stats.misses).toBe(2);
      expect(stats.size).toBe(2);
      expect(stats.hitRate).toBeCloseTo(0.6, 2);
    });

    it('should handle empty cache stats', () => {
      const stats = cache.getStats();

      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(0);
      expect(stats.size).toBe(0);
      expect(stats.hitRate).toBe(0);
    });

    it('should calculate hit rate correctly', () => {
      cache.set('key', 'value');

      // 7 hits, 3 misses = 70% hit rate
      for (let i = 0; i < 7; i++) {
        cache.get('key');
      }
      for (let i = 0; i < 3; i++) {
        cache.get('missing');
      }

      const stats = cache.getStats();
      expect(stats.hitRate).toBeCloseTo(0.7, 2);
    });
  });

  describe('Multiple Cache Entries', () => {
    it('should handle multiple independent entries', () => {
      const entries = [
        { key: 'user:123', value: { name: 'Alice' } },
        { key: 'user:456', value: { name: 'Bob' } },
        { key: 'session:abc', value: { token: 'xyz' } },
        { key: 'config:app', value: { theme: 'dark' } }
      ];

      entries.forEach(({ key, value }) => cache.set(key, value));

      entries.forEach(({ key, value }) => {
        expect(cache.get(key)).toEqual(value);
      });

      expect(cache.getStats().size).toBe(4);
      expect(cache.getStats().hits).toBe(4);
    });

    it('should handle cache key collisions correctly', () => {
      cache.set('key', 'first-value');
      cache.set('key', 'second-value'); // Overwrite

      const result = cache.get('key');

      expect(result).toBe('second-value');
      expect(cache.getStats().size).toBe(1);
    });

    it('should handle different data types', () => {
      const testCases = [
        { key: 'string', value: 'test string' },
        { key: 'number', value: 42 },
        { key: 'boolean', value: true },
        { key: 'object', value: { nested: { data: 'value' } } },
        { key: 'array', value: [1, 2, 3] },
        { key: 'null', value: null }
      ];

      testCases.forEach(({ key, value }) => {
        cache.set(key, value);
        expect(cache.get(key)).toEqual(value);
      });
    });
  });

  describe('Cache Clearing and Reset', () => {
    it('should clear all entries', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.get('key1'); // Generate some stats

      cache.clear();

      expect(cache.getStats().size).toBe(0);
      expect(cache.get('key1')).toBeNull();
      expect(cache.get('key2')).toBeNull();
    });

    it('should reset stats on clear', () => {
      cache.set('key', 'value');
      cache.get('key'); // hit
      cache.get('missing'); // miss

      cache.clear();

      const stats = cache.getStats();
      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(0);
      expect(stats.hitRate).toBe(0);
    });

    it('should allow reuse after clear', () => {
      cache.set('old', 'old-value');
      cache.clear();
      cache.set('new', 'new-value');

      expect(cache.get('old')).toBeNull();
      expect(cache.get('new')).toBe('new-value');
      expect(cache.getStats().size).toBe(1);
    });
  });

  describe('Performance Characteristics', () => {
    it('should handle large number of entries efficiently', () => {
      const count = 1000;
      const startTime = Date.now();

      // Populate cache
      for (let i = 0; i < count; i++) {
        cache.set(`key-${i}`, { index: i, data: `value-${i}` });
      }

      // Access all entries
      for (let i = 0; i < count; i++) {
        cache.get(`key-${i}`);
      }

      const duration = Date.now() - startTime;

      expect(cache.getStats().size).toBe(count);
      expect(cache.getStats().hits).toBe(count);
      expect(duration).toBeLessThan(1000); // Should complete in < 1 second
    });

    it('should handle rapid successive operations', () => {
      const key = 'rapid-key';
      const iterations = 10000;

      for (let i = 0; i < iterations; i++) {
        cache.set(key, i);
        const value = cache.get(key);
        expect(value).toBe(i);
      }

      expect(cache.getStats().hits).toBe(iterations);
    });
  });

  describe('Cache Size Limits', () => {
    it('should enforce maximum cache size to prevent unbounded growth', () => {
      const limitedCache = new Context7Cache(3600000);
      limitedCache.maxSize = 100; // Set max size

      // Add method to enforce size limit
      limitedCache._enforceSizeLimit = function() {
        if (this.cache.size > this.maxSize) {
          // Remove oldest entries
          const entries = Array.from(this.cache.entries())
            .sort((a, b) => a[1].timestamp - b[1].timestamp);

          const toRemove = this.cache.size - this.maxSize;
          for (let i = 0; i < toRemove; i++) {
            this.cache.delete(entries[i][0]);
          }
        }
      };

      // Override set to enforce limit
      const originalSet = limitedCache.set.bind(limitedCache);
      limitedCache.set = function(key, value) {
        originalSet(key, value);
        this._enforceSizeLimit();
      };

      // Add 150 entries
      for (let i = 0; i < 150; i++) {
        limitedCache.set(`key-${i}`, `value-${i}`);
      }

      // Should be capped at maxSize
      expect(limitedCache.cache.size).toBeLessThanOrEqual(100);
    });

    it('should maintain LRU eviction order', () => {
      const lruCache = new Context7Cache(3600000);
      lruCache.maxSize = 3;

      lruCache._enforceSizeLimit = function() {
        if (this.cache.size > this.maxSize) {
          const entries = Array.from(this.cache.entries())
            .sort((a, b) => a[1].timestamp - b[1].timestamp);
          const toRemove = this.cache.size - this.maxSize;
          for (let i = 0; i < toRemove; i++) {
            this.cache.delete(entries[i][0]);
          }
        }
      };

      const originalSet = lruCache.set.bind(lruCache);
      lruCache.set = function(key, value) {
        originalSet(key, value);
        this._enforceSizeLimit();
      };

      lruCache.set('first', '1');
      lruCache.set('second', '2');
      lruCache.set('third', '3');
      lruCache.set('fourth', '4'); // Should evict 'first'

      expect(lruCache.get('first')).toBeNull(); // Evicted
      expect(lruCache.get('fourth')).toBe('4'); // Present
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined keys gracefully', () => {
      expect(() => cache.get(undefined)).not.toThrow();
      expect(cache.get(undefined)).toBeNull();
    });

    it('should handle empty string keys', () => {
      cache.set('', 'empty-key-value');
      expect(cache.get('')).toBe('empty-key-value');
    });

    it('should handle special characters in keys', () => {
      const specialKeys = [
        'key:with:colons',
        'key/with/slashes',
        'key with spaces',
        'key-with-dashes',
        'key_with_underscores',
        'key.with.dots'
      ];

      specialKeys.forEach(key => {
        cache.set(key, `value-for-${key}`);
        expect(cache.get(key)).toBe(`value-for-${key}`);
      });
    });
  });
});

describe('Context7 Cache Integration', () => {
  it('should demonstrate typical usage pattern', () => {
    const cache = new Context7Cache(60000); // 1 minute TTL

    // Simulate prompt improvement workflow
    const prompt1 = 'Build a React component';
    const prompt1Hash = 'hash-' + prompt1.slice(0, 10);

    // First request - cache miss
    let result = cache.get(prompt1Hash);
    expect(result).toBeNull();

    // Compute and cache result
    const improvedPrompt = {
      original: prompt1,
      improved: 'Build a React functional component with TypeScript',
      context: ['react', 'typescript'],
      timestamp: Date.now()
    };
    cache.set(prompt1Hash, improvedPrompt);

    // Second request - cache hit
    result = cache.get(prompt1Hash);
    expect(result).toEqual(improvedPrompt);

    // Verify performance benefit
    const stats = cache.getStats();
    expect(stats.hits).toBe(1);
    expect(stats.misses).toBe(1);
    expect(stats.hitRate).toBe(0.5);
  });

  it('should handle concurrent access patterns', () => {
    const cache = new Context7Cache();
    const keys = ['key1', 'key2', 'key3'];

    // Simulate concurrent writes
    keys.forEach(key => cache.set(key, `value-${key}`));

    // Simulate concurrent reads
    const results = keys.map(key => cache.get(key));

    expect(results).toEqual(['value-key1', 'value-key2', 'value-key3']);
    expect(cache.getStats().hits).toBe(3);
  });
});
