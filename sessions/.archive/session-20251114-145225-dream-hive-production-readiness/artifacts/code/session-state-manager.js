#!/usr/bin/env node
/**
 * Session State Manager
 * Handles session lifecycle state transitions with validation
 */

const fs = require('fs');
const path = require('path');

class SessionStateManager {
  static STATES = {
    ACTIVE: 'active',
    PAUSED: 'paused',
    CLOSED: 'closed'
  };

  static VALID_TRANSITIONS = {
    active: ['paused', 'closed'],
    paused: ['active', 'closed'],
    closed: [] // terminal state
  };

  constructor(sessionId, workspaceRoot = process.cwd()) {
    this.sessionId = sessionId;
    this.workspaceRoot = workspaceRoot;
    this.metadataPath = path.join(
      workspaceRoot,
      'sessions',
      sessionId,
      'metadata.json'
    );
  }

  /**
   * Read current session metadata
   */
  readMetadata() {
    if (!fs.existsSync(this.metadataPath)) {
      throw new Error(`Metadata not found: ${this.metadataPath}`);
    }
    return JSON.parse(fs.readFileSync(this.metadataPath, 'utf8'));
  }

  /**
   * Write session metadata with atomic write
   */
  writeMetadata(metadata) {
    const tmpPath = `${this.metadataPath}.tmp`;
    fs.writeFileSync(tmpPath, JSON.stringify(metadata, null, 2) + '\n');
    fs.renameSync(tmpPath, this.metadataPath);
  }

  /**
   * Validate state transition
   */
  validateTransition(fromState, toState) {
    const validStates = Object.values(SessionStateManager.STATES);

    if (!validStates.includes(fromState)) {
      throw new Error(`Invalid from state: ${fromState}`);
    }

    if (!validStates.includes(toState)) {
      throw new Error(`Invalid to state: ${toState}`);
    }

    const allowedTransitions = SessionStateManager.VALID_TRANSITIONS[fromState];
    if (!allowedTransitions.includes(toState)) {
      throw new Error(
        `Invalid transition: ${fromState} → ${toState}. ` +
        `Allowed: ${allowedTransitions.join(', ')}`
      );
    }

    return true;
  }

  /**
   * Get current state
   */
  getState() {
    const metadata = this.readMetadata();
    return metadata.status || SessionStateManager.STATES.ACTIVE;
  }

  /**
   * Transition to new state
   */
  transitionTo(newState, reason = null) {
    const metadata = this.readMetadata();
    const currentState = metadata.status || SessionStateManager.STATES.ACTIVE;

    // Validate transition
    this.validateTransition(currentState, newState);

    // Update metadata based on new state
    const timestamp = new Date().toISOString();

    switch (newState) {
      case SessionStateManager.STATES.ACTIVE:
        metadata.status = newState;
        metadata.last_resumed_at = timestamp;
        delete metadata.paused_at;
        delete metadata.closed_at;
        if (reason) metadata.resume_reason = reason;
        break;

      case SessionStateManager.STATES.PAUSED:
        metadata.status = newState;
        metadata.paused_at = timestamp;
        delete metadata.closed_at;
        if (reason) metadata.pause_reason = reason;
        break;

      case SessionStateManager.STATES.CLOSED:
        metadata.status = newState;
        metadata.closed_at = timestamp;
        if (reason) metadata.closure_reason = reason;
        break;
    }

    this.writeMetadata(metadata);

    return {
      from: currentState,
      to: newState,
      timestamp,
      reason
    };
  }

  /**
   * Check if session is active
   */
  isActive() {
    return this.getState() === SessionStateManager.STATES.ACTIVE;
  }

  /**
   * Check if session is paused
   */
  isPaused() {
    return this.getState() === SessionStateManager.STATES.PAUSED;
  }

  /**
   * Check if session is closed
   */
  isClosed() {
    return this.getState() === SessionStateManager.STATES.CLOSED;
  }

  /**
   * Pause session
   */
  pause(reason = 'chat ended') {
    return this.transitionTo(SessionStateManager.STATES.PAUSED, reason);
  }

  /**
   * Resume session
   */
  resume(reason = 'chat continued') {
    return this.transitionTo(SessionStateManager.STATES.ACTIVE, reason);
  }

  /**
   * Close session
   */
  close(reason = 'work complete') {
    return this.transitionTo(SessionStateManager.STATES.CLOSED, reason);
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error('Usage: session-state-manager.js <session-id> <action> [reason]');
    console.error('Actions: get, pause, resume, close');
    process.exit(1);
  }

  const [sessionId, action, reason] = args;
  const manager = new SessionStateManager(sessionId);

  try {
    switch (action) {
      case 'get':
        console.log(manager.getState());
        break;

      case 'pause':
        const pauseResult = manager.pause(reason);
        console.log(JSON.stringify(pauseResult, null, 2));
        break;

      case 'resume':
        const resumeResult = manager.resume(reason);
        console.log(JSON.stringify(resumeResult, null, 2));
        break;

      case 'close':
        const closeResult = manager.close(reason);
        console.log(JSON.stringify(closeResult, null, 2));
        break;

      default:
        console.error(`Unknown action: ${action}`);
        process.exit(1);
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

module.exports = SessionStateManager;
