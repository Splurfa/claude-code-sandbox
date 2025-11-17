#!/usr/bin/env node
/**
 * Execute batch closeout for Claude Code integration
 * Generates summaries and outputs consolidated review as JSON
 */

const path = require('path');
const { closeoutMultiple } = require('../../iteration-4/artifacts/code/session-closeout-batch');

const sessionIds = [
  'session-20251113-150000-session-management-infrastructure',
  'session-20251113-201000-workspace-analysis',
  'session-20251113-210416-conversation-analysis',
  'session-20251113-211159-hive-mind-setup',
  'session-20251114-010100-hitl-corrections'
];

// Generate summaries
closeoutMultiple(sessionIds)
  .then(consolidated => {
    // Output as JSON for Claude Code to parse
    console.log(JSON.stringify(consolidated, null, 2));
  })
  .catch(error => {
    console.error('Error during batch closeout:', error.message);
    process.exit(1);
  });
