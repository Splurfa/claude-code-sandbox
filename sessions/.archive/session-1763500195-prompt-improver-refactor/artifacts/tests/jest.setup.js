/**
 * Jest Setup
 *
 * Global test configuration and utilities.
 */

// Increase timeout for integration tests
jest.setTimeout(10000);

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  // Suppress logs during tests
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  // Keep warnings and errors visible
  warn: console.warn,
  error: console.error,
};

// Custom matchers
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },

  toContainPattern(received, pattern) {
    const regex = new RegExp(pattern);
    const pass = regex.test(received);
    if (pass) {
      return {
        message: () => `expected "${received}" not to contain pattern ${pattern}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected "${received}" to contain pattern ${pattern}`,
        pass: false,
      };
    }
  },

  toHaveTimestamp(received) {
    const pass = received && typeof received.timestamp === 'number' &&
                 received.timestamp > 0 &&
                 received.timestamp <= Date.now();
    if (pass) {
      return {
        message: () => `expected ${JSON.stringify(received)} not to have valid timestamp`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${JSON.stringify(received)} to have valid timestamp`,
        pass: false,
      };
    }
  }
});

// Global cleanup
afterEach(() => {
  jest.clearAllMocks();
});
