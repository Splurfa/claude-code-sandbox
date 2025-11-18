-- Database Migration for Enhanced Consensus System
-- Adds indexes and ensures optimal performance for consensus operations

-- Add index for proposal lookups
CREATE INDEX IF NOT EXISTS idx_consensus_votes_proposal_id
  ON consensus_votes(proposal_id);

-- Add index for agent vote lookups
CREATE INDEX IF NOT EXISTS idx_consensus_votes_agent_id
  ON consensus_votes(agent_id);

-- Add index for timestamp-based queries
CREATE INDEX IF NOT EXISTS idx_consensus_votes_timestamp
  ON consensus_votes(timestamp);

-- Add index for consensus decisions by algorithm
CREATE INDEX IF NOT EXISTS idx_consensus_decisions_algorithm
  ON consensus_decisions(algorithm);

-- Add index for confidence-based queries
CREATE INDEX IF NOT EXISTS idx_consensus_decisions_confidence
  ON consensus_decisions(confidence);

-- Add index for recent decisions
CREATE INDEX IF NOT EXISTS idx_consensus_decisions_created_at
  ON consensus_decisions(created_at DESC);

-- Ensure consensus_votes has all required columns
-- (Schema already has id, swarm_id, proposal_id, agent_id, vote, weight, justification, timestamp)

-- Add composite index for common query patterns
CREATE INDEX IF NOT EXISTS idx_consensus_votes_swarm_proposal
  ON consensus_votes(swarm_id, proposal_id);

-- Add composite index for swarm + timestamp for history queries
CREATE INDEX IF NOT EXISTS idx_consensus_decisions_swarm_time
  ON consensus_decisions(swarm_id, created_at DESC);

-- Create view for consensus analytics
CREATE VIEW IF NOT EXISTS consensus_analytics AS
SELECT
  cd.swarm_id,
  cd.algorithm,
  COUNT(DISTINCT cd.id) as total_decisions,
  COUNT(DISTINCT cv.id) as total_votes,
  AVG(cd.confidence) as avg_confidence,
  AVG(cv.weight) as avg_vote_weight,
  SUM(CASE WHEN cd.decision = 'approved' THEN 1 ELSE 0 END) as approved_count,
  SUM(CASE WHEN cd.decision = 'rejected' THEN 1 ELSE 0 END) as rejected_count,
  MIN(cd.created_at) as first_decision,
  MAX(cd.created_at) as latest_decision
FROM consensus_decisions cd
LEFT JOIN consensus_votes cv ON cd.id = cv.proposal_id
GROUP BY cd.swarm_id, cd.algorithm;

-- Create view for vote participation rates
CREATE VIEW IF NOT EXISTS vote_participation AS
SELECT
  cv.swarm_id,
  cv.agent_id,
  COUNT(DISTINCT cv.proposal_id) as votes_cast,
  AVG(cv.vote) as avg_vote_value,
  AVG(cv.weight) as avg_weight,
  MIN(cv.timestamp) as first_vote,
  MAX(cv.timestamp) as latest_vote
FROM consensus_votes cv
GROUP BY cv.swarm_id, cv.agent_id;

-- Create trigger to update agent performance on vote
CREATE TRIGGER IF NOT EXISTS update_agent_on_vote
AFTER INSERT ON consensus_votes
BEGIN
  UPDATE agents
  SET last_active = NEW.timestamp,
      metadata = json_set(
        metadata,
        '$.votes_cast',
        COALESCE(json_extract(metadata, '$.votes_cast'), 0) + 1
      )
  WHERE id = NEW.agent_id;
END;

-- Create trigger to log decision to session logs
CREATE TRIGGER IF NOT EXISTS log_consensus_decision
AFTER INSERT ON consensus_decisions
BEGIN
  INSERT INTO session_logs (session_id, log_level, message, data)
  SELECT
    s.id,
    'info',
    'Consensus decision reached',
    json_object(
      'decision_id', NEW.id,
      'topic', NEW.topic,
      'decision', NEW.decision,
      'algorithm', NEW.algorithm,
      'confidence', NEW.confidence
    )
  FROM sessions s
  WHERE s.swarm_id = NEW.swarm_id
    AND s.status = 'active'
  LIMIT 1;
END;
