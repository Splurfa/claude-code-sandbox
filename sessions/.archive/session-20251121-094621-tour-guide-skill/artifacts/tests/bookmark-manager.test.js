/**
 * Tests for Bookmark Manager
 *
 * Validates all bookmark operations including:
 * - Save bookmark with name
 * - Restore bookmark
 * - List bookmarks
 * - Delete bookmark
 * - Max 10 bookmarks enforcement
 * - Error handling
 * - Edge cases
 */

const { BookmarkManager, createBookmarkManager, MAX_BOOKMARKS } = require('../code/tour-guide/lib/bookmark-manager');

describe('BookmarkManager', () => {
  let state;
  let manager;

  beforeEach(() => {
    // Fresh state for each test
    state = { bookmarks: [] };
    manager = new BookmarkManager(state);
  });

  describe('Constructor', () => {
    test('should create manager with empty bookmarks', () => {
      expect(manager.bookmarks).toEqual([]);
      expect(manager.getCount()).toBe(0);
    });

    test('should initialize bookmarks array if not present', () => {
      const emptyState = {};
      const mgr = new BookmarkManager(emptyState);
      expect(Array.isArray(emptyState.bookmarks)).toBe(true);
      expect(emptyState.bookmarks.length).toBe(0);
    });

    test('should throw error if state is invalid', () => {
      expect(() => new BookmarkManager(null)).toThrow('BookmarkManager requires a state object');
      expect(() => new BookmarkManager(undefined)).toThrow('BookmarkManager requires a state object');
      expect(() => new BookmarkManager('invalid')).toThrow('BookmarkManager requires a state object');
    });

    test('should use existing bookmarks array if present', () => {
      const existingState = {
        bookmarks: [
          { name: 'test', pathway: 'beginner', section: 1, timestamp: '2025-01-01T00:00:00Z', description: 'Test' }
        ]
      };
      const mgr = new BookmarkManager(existingState);
      expect(mgr.getCount()).toBe(1);
    });
  });

  describe('saveBookmark', () => {
    test('should save bookmark with valid inputs', () => {
      const result = manager.saveBookmark('my-bookmark', 'beginner', 1, 'Welcome & Overview');

      expect(result.success).toBe(true);
      expect(result.message).toContain('my-bookmark');
      expect(result.message).toContain('Beginner');
      expect(result.message).toContain('Welcome & Overview');
      expect(result.bookmark).toBeDefined();
      expect(result.bookmark.name).toBe('my-bookmark');
      expect(result.bookmark.pathway).toBe('beginner');
      expect(result.bookmark.section).toBe(1);
      expect(result.bookmark.description).toBe('Welcome & Overview');
      expect(manager.getCount()).toBe(1);
    });

    test('should trim bookmark name', () => {
      const result = manager.saveBookmark('  trimmed  ', 'intermediate', 2, 'Memory Coordination');

      expect(result.success).toBe(true);
      expect(result.bookmark.name).toBe('trimmed');
    });

    test('should use default description if not provided', () => {
      const result = manager.saveBookmark('test', 'advanced', 3);

      expect(result.success).toBe(true);
      expect(result.bookmark.description).toBe('Section 3');
    });

    test('should include timestamp', () => {
      const before = new Date().toISOString();
      const result = manager.saveBookmark('test', 'expert', 1, 'Test');
      const after = new Date().toISOString();

      expect(result.success).toBe(true);
      expect(result.bookmark.timestamp).toBeDefined();
      expect(result.bookmark.timestamp >= before).toBe(true);
      expect(result.bookmark.timestamp <= after).toBe(true);
    });

    test('should reject empty name', () => {
      const result = manager.saveBookmark('', 'beginner', 1, 'Test');

      expect(result.success).toBe(false);
      expect(result.message).toContain('name is required');
      expect(manager.getCount()).toBe(0);
    });

    test('should reject whitespace-only name', () => {
      const result = manager.saveBookmark('   ', 'beginner', 1, 'Test');

      expect(result.success).toBe(false);
      expect(result.message).toContain('name is required');
    });

    test('should reject null name', () => {
      const result = manager.saveBookmark(null, 'beginner', 1, 'Test');

      expect(result.success).toBe(false);
      expect(result.message).toContain('name is required');
    });

    test('should reject undefined name', () => {
      const result = manager.saveBookmark(undefined, 'beginner', 1, 'Test');

      expect(result.success).toBe(false);
      expect(result.message).toContain('name is required');
    });

    test('should reject invalid pathway', () => {
      const result = manager.saveBookmark('test', '', 1, 'Test');

      expect(result.success).toBe(false);
      expect(result.message).toContain('Invalid pathway');
    });

    test('should reject invalid section number', () => {
      let result = manager.saveBookmark('test', 'beginner', 0, 'Test');
      expect(result.success).toBe(false);
      expect(result.message).toContain('Invalid section');

      result = manager.saveBookmark('test', 'beginner', -1, 'Test');
      expect(result.success).toBe(false);

      result = manager.saveBookmark('test', 'beginner', 'invalid', 'Test');
      expect(result.success).toBe(false);
    });

    test('should reject duplicate bookmark names', () => {
      manager.saveBookmark('duplicate', 'beginner', 1, 'First');
      const result = manager.saveBookmark('duplicate', 'intermediate', 2, 'Second');

      expect(result.success).toBe(false);
      expect(result.message).toContain('already exists');
      expect(result.message).toContain('duplicate');
      expect(manager.getCount()).toBe(1);
    });

    test('should enforce max bookmarks limit', () => {
      // Add MAX_BOOKMARKS bookmarks
      for (let i = 1; i <= MAX_BOOKMARKS; i++) {
        const result = manager.saveBookmark(`bookmark-${i}`, 'beginner', i, `Section ${i}`);
        expect(result.success).toBe(true);
      }

      expect(manager.getCount()).toBe(MAX_BOOKMARKS);
      expect(manager.isAtMaxBookmarks()).toBe(true);

      // Try to add one more
      const result = manager.saveBookmark('overflow', 'beginner', 1, 'Test');
      expect(result.success).toBe(false);
      expect(result.message).toContain('Maximum');
      expect(result.message).toContain(`${MAX_BOOKMARKS}`);
      expect(manager.getCount()).toBe(MAX_BOOKMARKS);
    });
  });

  describe('restoreBookmark', () => {
    beforeEach(() => {
      manager.saveBookmark('restore-test', 'intermediate', 3, 'Memory Coordination');
    });

    test('should restore existing bookmark', () => {
      const result = manager.restoreBookmark('restore-test');

      expect(result.success).toBe(true);
      expect(result.message).toContain('restore-test');
      expect(result.bookmark).toBeDefined();
      expect(result.bookmark.name).toBe('restore-test');
      expect(result.bookmark.pathway).toBe('intermediate');
      expect(result.bookmark.section).toBe(3);
    });

    test('should trim bookmark name', () => {
      const result = manager.restoreBookmark('  restore-test  ');

      expect(result.success).toBe(true);
      expect(result.bookmark.name).toBe('restore-test');
    });

    test('should reject non-existent bookmark', () => {
      const result = manager.restoreBookmark('does-not-exist');

      expect(result.success).toBe(false);
      expect(result.message).toContain('not found');
      expect(result.message).toContain('does-not-exist');
    });

    test('should reject empty name', () => {
      const result = manager.restoreBookmark('');

      expect(result.success).toBe(false);
      expect(result.message).toContain('name is required');
    });

    test('should reject null name', () => {
      const result = manager.restoreBookmark(null);

      expect(result.success).toBe(false);
      expect(result.message).toContain('name is required');
    });
  });

  describe('listBookmarks', () => {
    test('should show empty message when no bookmarks', () => {
      const result = manager.listBookmarks();

      expect(result.success).toBe(true);
      expect(result.message).toContain('No bookmarks');
      expect(result.bookmarks).toEqual([]);
    });

    test('should list all bookmarks', () => {
      manager.saveBookmark('first', 'beginner', 1, 'Welcome');
      manager.saveBookmark('second', 'intermediate', 3, 'Memory');
      manager.saveBookmark('third', 'advanced', 5, 'Architecture');

      const result = manager.listBookmarks();

      expect(result.success).toBe(true);
      expect(result.message).toContain('Your Bookmarks');
      expect(result.message).toContain('1. first');
      expect(result.message).toContain('2. second');
      expect(result.message).toContain('3. third');
      expect(result.message).toContain('Beginner > Welcome');
      expect(result.message).toContain('Intermediate > Memory');
      expect(result.message).toContain('Advanced > Architecture');
      expect(result.bookmarks.length).toBe(3);
    });

    test('should include usage instructions', () => {
      manager.saveBookmark('test', 'beginner', 1, 'Test');

      const result = manager.listBookmarks();

      expect(result.message).toContain('Jump to bookmark: /tour jump');
      expect(result.message).toContain('Delete bookmark: /tour bookmark delete');
    });
  });

  describe('deleteBookmark', () => {
    beforeEach(() => {
      manager.saveBookmark('delete-me', 'beginner', 1, 'Test');
      manager.saveBookmark('keep-me', 'intermediate', 2, 'Test');
    });

    test('should delete existing bookmark', () => {
      expect(manager.getCount()).toBe(2);

      const result = manager.deleteBookmark('delete-me');

      expect(result.success).toBe(true);
      expect(result.message).toContain('Deleted');
      expect(result.message).toContain('delete-me');
      expect(manager.getCount()).toBe(1);
      expect(manager.hasBookmark('delete-me')).toBe(false);
      expect(manager.hasBookmark('keep-me')).toBe(true);
    });

    test('should trim bookmark name', () => {
      const result = manager.deleteBookmark('  delete-me  ');

      expect(result.success).toBe(true);
      expect(manager.getCount()).toBe(1);
    });

    test('should reject non-existent bookmark', () => {
      const result = manager.deleteBookmark('does-not-exist');

      expect(result.success).toBe(false);
      expect(result.message).toContain('not found');
      expect(manager.getCount()).toBe(2);
    });

    test('should reject empty name', () => {
      const result = manager.deleteBookmark('');

      expect(result.success).toBe(false);
      expect(result.message).toContain('name is required');
    });

    test('should reject null name', () => {
      const result = manager.deleteBookmark(null);

      expect(result.success).toBe(false);
      expect(result.message).toContain('name is required');
    });
  });

  describe('hasBookmark', () => {
    beforeEach(() => {
      manager.saveBookmark('exists', 'beginner', 1, 'Test');
    });

    test('should return true for existing bookmark', () => {
      expect(manager.hasBookmark('exists')).toBe(true);
    });

    test('should return false for non-existent bookmark', () => {
      expect(manager.hasBookmark('does-not-exist')).toBe(false);
    });

    test('should trim bookmark name', () => {
      expect(manager.hasBookmark('  exists  ')).toBe(true);
    });

    test('should return false for invalid inputs', () => {
      expect(manager.hasBookmark('')).toBe(false);
      expect(manager.hasBookmark(null)).toBe(false);
      expect(manager.hasBookmark(undefined)).toBe(false);
    });
  });

  describe('getBookmark', () => {
    beforeEach(() => {
      manager.saveBookmark('test', 'intermediate', 2, 'Memory');
    });

    test('should return bookmark object', () => {
      const bookmark = manager.getBookmark('test');

      expect(bookmark).toBeDefined();
      expect(bookmark.name).toBe('test');
      expect(bookmark.pathway).toBe('intermediate');
      expect(bookmark.section).toBe(2);
      expect(bookmark.description).toBe('Memory');
    });

    test('should trim bookmark name', () => {
      const bookmark = manager.getBookmark('  test  ');

      expect(bookmark).toBeDefined();
      expect(bookmark.name).toBe('test');
    });

    test('should return null for non-existent bookmark', () => {
      expect(manager.getBookmark('does-not-exist')).toBeNull();
    });

    test('should return null for invalid inputs', () => {
      expect(manager.getBookmark('')).toBeNull();
      expect(manager.getBookmark(null)).toBeNull();
      expect(manager.getBookmark(undefined)).toBeNull();
    });
  });

  describe('getCount', () => {
    test('should return 0 for empty bookmarks', () => {
      expect(manager.getCount()).toBe(0);
    });

    test('should return correct count', () => {
      manager.saveBookmark('one', 'beginner', 1, 'Test');
      expect(manager.getCount()).toBe(1);

      manager.saveBookmark('two', 'beginner', 2, 'Test');
      expect(manager.getCount()).toBe(2);

      manager.deleteBookmark('one');
      expect(manager.getCount()).toBe(1);
    });
  });

  describe('isAtMaxBookmarks', () => {
    test('should return false when below max', () => {
      expect(manager.isAtMaxBookmarks()).toBe(false);

      manager.saveBookmark('test', 'beginner', 1, 'Test');
      expect(manager.isAtMaxBookmarks()).toBe(false);
    });

    test('should return true when at max', () => {
      for (let i = 1; i <= MAX_BOOKMARKS; i++) {
        manager.saveBookmark(`bookmark-${i}`, 'beginner', i, `Section ${i}`);
      }

      expect(manager.isAtMaxBookmarks()).toBe(true);
    });

    test('should return false after deleting when at max', () => {
      for (let i = 1; i <= MAX_BOOKMARKS; i++) {
        manager.saveBookmark(`bookmark-${i}`, 'beginner', i, `Section ${i}`);
      }

      expect(manager.isAtMaxBookmarks()).toBe(true);

      manager.deleteBookmark('bookmark-1');
      expect(manager.isAtMaxBookmarks()).toBe(false);
    });
  });

  describe('generateAutoName', () => {
    test('should generate bookmark-1 when empty', () => {
      expect(manager.generateAutoName()).toBe('bookmark-1');
    });

    test('should skip existing names', () => {
      manager.saveBookmark('bookmark-1', 'beginner', 1, 'Test');
      expect(manager.generateAutoName()).toBe('bookmark-2');

      manager.saveBookmark('bookmark-2', 'beginner', 2, 'Test');
      expect(manager.generateAutoName()).toBe('bookmark-3');
    });

    test('should find first available name', () => {
      manager.saveBookmark('bookmark-1', 'beginner', 1, 'Test');
      manager.saveBookmark('bookmark-3', 'beginner', 3, 'Test');
      expect(manager.generateAutoName()).toBe('bookmark-2');
    });
  });

  describe('clearAllBookmarks', () => {
    test('should clear empty bookmarks', () => {
      const result = manager.clearAllBookmarks();

      expect(result.success).toBe(true);
      expect(result.message).toContain('0');
      expect(manager.getCount()).toBe(0);
    });

    test('should clear all bookmarks', () => {
      manager.saveBookmark('one', 'beginner', 1, 'Test');
      manager.saveBookmark('two', 'beginner', 2, 'Test');
      manager.saveBookmark('three', 'beginner', 3, 'Test');

      const result = manager.clearAllBookmarks();

      expect(result.success).toBe(true);
      expect(result.message).toContain('3');
      expect(manager.getCount()).toBe(0);
    });
  });

  describe('createBookmarkManager factory', () => {
    test('should create bookmark manager instance', () => {
      const state = { bookmarks: [] };
      const mgr = createBookmarkManager(state);

      expect(mgr).toBeInstanceOf(BookmarkManager);
      expect(mgr.bookmarks).toEqual([]);
    });
  });

  describe('State persistence', () => {
    test('should share state reference', () => {
      const sharedState = { bookmarks: [] };
      const manager1 = new BookmarkManager(sharedState);
      const manager2 = new BookmarkManager(sharedState);

      manager1.saveBookmark('test', 'beginner', 1, 'Test');

      expect(manager2.getCount()).toBe(1);
      expect(manager2.hasBookmark('test')).toBe(true);
    });

    test('should modify state.bookmarks array', () => {
      const state = { bookmarks: [] };
      const mgr = new BookmarkManager(state);

      mgr.saveBookmark('test', 'beginner', 1, 'Test');

      expect(state.bookmarks.length).toBe(1);
      expect(state.bookmarks[0].name).toBe('test');
    });
  });

  describe('Integration scenarios', () => {
    test('should handle full bookmark lifecycle', () => {
      // Save bookmark
      let result = manager.saveBookmark('journey', 'intermediate', 3, 'Memory Coordination');
      expect(result.success).toBe(true);

      // Verify it exists
      expect(manager.hasBookmark('journey')).toBe(true);

      // List bookmarks
      result = manager.listBookmarks();
      expect(result.message).toContain('journey');

      // Restore bookmark
      result = manager.restoreBookmark('journey');
      expect(result.success).toBe(true);
      expect(result.bookmark.pathway).toBe('intermediate');
      expect(result.bookmark.section).toBe(3);

      // Delete bookmark
      result = manager.deleteBookmark('journey');
      expect(result.success).toBe(true);

      // Verify it's gone
      expect(manager.hasBookmark('journey')).toBe(false);
    });

    test('should handle multiple pathways', () => {
      manager.saveBookmark('beginner-spot', 'beginner', 2, 'Session Basics');
      manager.saveBookmark('intermediate-spot', 'intermediate', 4, 'Custom Skills');
      manager.saveBookmark('advanced-spot', 'advanced', 1, 'Extension Points');
      manager.saveBookmark('expert-spot', 'expert', 3, 'Contributing');

      expect(manager.getCount()).toBe(4);

      const result = manager.listBookmarks();
      expect(result.message).toContain('Beginner > Session Basics');
      expect(result.message).toContain('Intermediate > Custom Skills');
      expect(result.message).toContain('Advanced > Extension Points');
      expect(result.message).toContain('Expert > Contributing');
    });
  });
});
