#!/usr/bin/env node
/**
 * Execute pre-approved batch closeout (non-interactive)
 * Used after user has reviewed and approved in Claude Code
 */

const { closeoutMultiple, executeBatchArchive } = require('../../iteration-4/artifacts/code/session-closeout-batch');

const sessionIds = [
  'session-20251113-150000-session-management-infrastructure',
  'session-20251113-201000-workspace-analysis',
  'session-20251113-210416-conversation-analysis',
  'session-20251113-211159-hive-mind-setup',
  'session-20251114-010100-hitl-corrections'
];

async function executeApprovedCloseout() {
  console.log('🚀 Executing pre-approved batch closeout...\n');

  // Generate summaries (already done, but need the data structure)
  const consolidated = await closeoutMultiple(sessionIds);

  console.log('✅ User approval: CONFIRMED\n');

  // Execute archive with Captain's Log integration
  const results = await executeBatchArchive(consolidated);

  console.log('\n✅ Batch closeout complete!');
  console.log(`📦 Archived: ${results.filter(r => r.status === 'archived').length}/${sessionIds.length} sessions`);

  return results;
}

executeApprovedCloseout()
  .then(results => {
    console.log('\n📊 Final Results:');
    results.forEach(r => {
      console.log(`  ${r.sessionId}: ${r.status}`);
    });
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  });
