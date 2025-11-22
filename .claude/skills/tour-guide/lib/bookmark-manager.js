/**
 * Bookmark Manager - Save and restore tour positions
 *
 * Allows users to bookmark their current position in the tour and
 * return to it later. Bookmarks are stored in-memory for the
 * duration of the conversation (not cross-session persistent).
 *
 * Features:
 * - Save current position with optional name
 * - Auto-generate bookmark names if not provided
 * - Restore position by bookmark name
 * - List all saved bookmarks
 * - Delete bookmarks
 * - Max 10 bookmarks per conversation
 *
 * Storage:
 * - In-memory YAML state object
 * - Persists only during conversation
 * - Lost when conversation ends
 *
 * @module bookmark-manager
 */

const MAX_BOOKMARKS = 10;

/**
 * Bookmark data structure
 * @typedef {Object} Bookmark
 * @property {string} name - Bookmark name (unique)
 * @property {string} pathway - Pathway ID (beginner|intermediate|advanced|expert)
 * @property {number} section - Section number within pathway
 * @property {string} timestamp - ISO8601 timestamp of bookmark creation
 * @property {string} description - Auto-generated description from section title
 */

class BookmarkManager {
  /**
   * Create bookmark manager
   * @param {Object} state - Tour state object (must contain state.bookmarks array)
   */
  constructor(state) {
    if (!state || typeof state !== 'object') {
      throw new Error('BookmarkManager requires a state object');
    }

    // Initialize bookmarks array if not present
    if (!Array.isArray(state.bookmarks)) {
      state.bookmarks = [];
    }

    this.state = state;
    this.bookmarks = state.bookmarks;
  }

  /**
   * Save current position as bookmark
   * @param {string} name - Bookmark name (required, must be unique)
   * @param {string} pathway - Current pathway ID
   * @param {number} section - Current section number
   * @param {string} sectionTitle - Section title for description
   * @returns {Object} Result object { success: boolean, message: string, bookmark?: Bookmark }
   */
  saveBookmark(name, pathway, section, sectionTitle) {
    // Validate inputs
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return {
        success: false,
        message: 'Error: Bookmark name is required'
      };
    }

    const trimmedName = name.trim();

    if (!pathway || typeof pathway !== 'string') {
      return {
        success: false,
        message: 'Error: Invalid pathway'
      };
    }

    if (typeof section !== 'number' || section < 1) {
      return {
        success: false,
        message: 'Error: Invalid section number'
      };
    }

    // Check for max bookmarks
    if (this.bookmarks.length >= MAX_BOOKMARKS) {
      return {
        success: false,
        message: `Error: Maximum ${MAX_BOOKMARKS} bookmarks allowed. Delete a bookmark first.`
      };
    }

    // Check for duplicate name
    const existingBookmark = this.bookmarks.find(b => b.name === trimmedName);
    if (existingBookmark) {
      return {
        success: false,
        message: `Error: Bookmark "${trimmedName}" already exists.\n\nOptions:\n1. Use a different name\n2. Delete existing bookmark: /tour bookmark delete ${trimmedName}\n3. List bookmarks: /tour bookmarks`
      };
    }

    // Create bookmark
    const bookmark = {
      name: trimmedName,
      pathway,
      section,
      timestamp: new Date().toISOString(),
      description: sectionTitle || `Section ${section}`
    };

    this.bookmarks.push(bookmark);

    // Capitalize pathway for display
    const pathwayDisplay = pathway.charAt(0).toUpperCase() + pathway.slice(1);

    return {
      success: true,
      message: `✓ Bookmarked current position: "${trimmedName}"\n\n   ${pathwayDisplay} > ${bookmark.description}\n\n   Return with: /tour jump ${trimmedName}`,
      bookmark
    };
  }

  /**
   * Restore bookmark by name
   * @param {string} name - Bookmark name
   * @returns {Object} Result object { success: boolean, message: string, bookmark?: Bookmark }
   */
  restoreBookmark(name) {
    if (!name || typeof name !== 'string') {
      return {
        success: false,
        message: 'Error: Bookmark name is required'
      };
    }

    const trimmedName = name.trim();
    const bookmark = this.bookmarks.find(b => b.name === trimmedName);

    if (!bookmark) {
      return {
        success: false,
        message: `Error: Bookmark "${trimmedName}" not found.\n\nUse /tour bookmarks to list all bookmarks.`
      };
    }

    return {
      success: true,
      message: `Restoring bookmark "${trimmedName}"...`,
      bookmark
    };
  }

  /**
   * List all bookmarks
   * @returns {Object} Result object { success: boolean, message: string, bookmarks: Bookmark[] }
   */
  listBookmarks() {
    if (this.bookmarks.length === 0) {
      return {
        success: true,
        message: 'No bookmarks saved yet.\n\nSave your current position: /tour bookmark [name]',
        bookmarks: []
      };
    }

    // Format bookmarks list
    const lines = ['Your Bookmarks:\n'];

    this.bookmarks.forEach((bookmark, index) => {
      const pathwayDisplay = bookmark.pathway.charAt(0).toUpperCase() + bookmark.pathway.slice(1);
      lines.push(`${index + 1}. ${bookmark.name} → ${pathwayDisplay} > ${bookmark.description}`);
    });

    lines.push('\nJump to bookmark: /tour jump [bookmark-name]');
    lines.push('Delete bookmark: /tour bookmark delete [bookmark-name]');

    return {
      success: true,
      message: lines.join('\n'),
      bookmarks: this.bookmarks
    };
  }

  /**
   * Delete bookmark by name
   * @param {string} name - Bookmark name
   * @returns {Object} Result object { success: boolean, message: string }
   */
  deleteBookmark(name) {
    if (!name || typeof name !== 'string') {
      return {
        success: false,
        message: 'Error: Bookmark name is required'
      };
    }

    const trimmedName = name.trim();
    const index = this.bookmarks.findIndex(b => b.name === trimmedName);

    if (index === -1) {
      return {
        success: false,
        message: `Error: Bookmark "${trimmedName}" not found.\n\nUse /tour bookmarks to list all bookmarks.`
      };
    }

    this.bookmarks.splice(index, 1);

    return {
      success: true,
      message: `✓ Deleted bookmark "${trimmedName}"`
    };
  }

  /**
   * Check if bookmark exists
   * @param {string} name - Bookmark name
   * @returns {boolean} True if bookmark exists
   */
  hasBookmark(name) {
    if (!name || typeof name !== 'string') {
      return false;
    }
    return this.bookmarks.some(b => b.name === name.trim());
  }

  /**
   * Get bookmark by name
   * @param {string} name - Bookmark name
   * @returns {Bookmark|null} Bookmark object or null if not found
   */
  getBookmark(name) {
    if (!name || typeof name !== 'string') {
      return null;
    }
    return this.bookmarks.find(b => b.name === name.trim()) || null;
  }

  /**
   * Get bookmark count
   * @returns {number} Number of bookmarks
   */
  getCount() {
    return this.bookmarks.length;
  }

  /**
   * Check if at max bookmarks
   * @returns {boolean} True if at max bookmarks
   */
  isAtMaxBookmarks() {
    return this.bookmarks.length >= MAX_BOOKMARKS;
  }

  /**
   * Generate auto-bookmark name
   * @returns {string} Generated bookmark name (e.g., "bookmark-1")
   */
  generateAutoName() {
    let counter = 1;
    let name = `bookmark-${counter}`;

    while (this.hasBookmark(name) && counter <= MAX_BOOKMARKS) {
      counter++;
      name = `bookmark-${counter}`;
    }

    return name;
  }

  /**
   * Clear all bookmarks (for testing/reset)
   * @returns {Object} Result object { success: boolean, message: string }
   */
  clearAllBookmarks() {
    const count = this.bookmarks.length;
    this.bookmarks.length = 0;

    return {
      success: true,
      message: `Cleared ${count} bookmark(s)`
    };
  }
}

/**
 * Create bookmark manager instance
 * @param {Object} state - Tour state object
 * @returns {BookmarkManager} Bookmark manager instance
 */
function createBookmarkManager(state) {
  return new BookmarkManager(state);
}

module.exports = {
  BookmarkManager,
  createBookmarkManager,
  MAX_BOOKMARKS
};
