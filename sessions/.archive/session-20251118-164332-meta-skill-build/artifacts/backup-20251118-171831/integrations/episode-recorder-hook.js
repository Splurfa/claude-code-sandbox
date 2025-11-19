#!/usr/bin/env node
/**
 * Episode Recorder Hook - CLI Interface for Post-Task Hook
 *
 * Provides CLI interface for post-task-episode.sh hook
 * Wraps episode-recorder.js for shell integration
 *
 * Usage:
 *   node episode-recorder-hook.js record <episode-json>
 *   node episode-recorder-hook.js search <query>
 *   node episode-recorder-hook.js stats
 */

const path = require('path');
const fs = require('fs');

// Find session artifacts or use fallback
function findEpisodeRecorder() {
  const projectRoot = process.cwd();

  // Look for most recent session with episode-recorder
  const sessionsDir = path.join(projectRoot, 'sessions');
  if (!fs.existsSync(sessionsDir)) {
    throw new Error('No sessions directory found');
  }

  const sessions = fs.readdirSync(sessionsDir)
    .filter(name => name.startsWith('session-'))
    .sort()
    .reverse();

  for (const session of sessions) {
    const recorderPath = path.join(sessionsDir, session, 'artifacts/code/episodes/episode-recorder.js');
    if (fs.existsSync(recorderPath)) {
      return require(recorderPath);
    }
  }

  throw new Error('No episode-recorder.js found in any session');
}

async function main() {
  const command = process.argv[2];
  const arg = process.argv[3];

  if (!command) {
    console.error('Usage: episode-recorder-hook.js <command> [args]');
    console.error('Commands: record, search, stats');
    process.exit(1);
  }

  try {
    const EpisodeRecorder = findEpisodeRecorder();
    const recorder = new EpisodeRecorder({
      sessionId: process.env.SESSION_ID || 'hook-session',
      agentType: process.env.AGENT_TYPE || 'hook-agent'
    });

    switch (command) {
      case 'record': {
        const episodeData = JSON.parse(arg);
        const result = await recorder.recordFromTask(episodeData);
        if (result.success) {
          console.log('✅ Episode recorded successfully');
          console.log(`   Task: ${episodeData.taskId}`);
          console.log(`   Reward: ${result.episode.reward.toFixed(2)}`);
        } else {
          console.error('❌ Failed to record episode:', result.error);
          process.exit(1);
        }
        break;
      }

      case 'search': {
        const results = await recorder.searchSimilarEpisodes(arg, { limit: 5 });
        console.log(`📊 Found ${results.count || 0} similar episodes`);
        if (results.results) {
          results.results.forEach((ep, i) => {
            console.log(`\n${i + 1}. ${ep.observation}`);
            console.log(`   Reward: ${ep.reward.toFixed(2)}`);
          });
        }
        break;
      }

      case 'stats': {
        const stats = await recorder.getStats();
        console.log('📈 Episode Statistics:');
        console.log(`   Episodes: ${stats.agentdb?.episodes || 0}`);
        console.log(`   Embeddings: ${stats.agentdb?.embeddings || 0}`);
        console.log(`   Avg Reward: ${stats.agentdb?.avgReward?.toFixed(2) || 0}`);
        console.log(`   Session: ${stats.session.id}`);
        break;
      }

      default:
        console.error('Unknown command:', command);
        process.exit(1);
    }

    await recorder.close();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
