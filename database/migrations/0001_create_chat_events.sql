CREATE TABLE IF NOT EXISTS chat_events (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  conversation_id UUID NOT NULL,
  turn_number SMALLINT NOT NULL CHECK (turn_number BETWEEN 1 AND 6),
  visitor_hash VARCHAR(32) NOT NULL,
  request_id VARCHAR(255),
  deployment_id VARCHAR(255),
  model VARCHAR(100) NOT NULL,
  max_output_tokens SMALLINT NOT NULL CHECK (max_output_tokens > 0),
  input_message_count SMALLINT NOT NULL CHECK (input_message_count BETWEEN 1 AND 12),
  user_message TEXT NOT NULL,
  assistant_response TEXT,
  status VARCHAR(40) NOT NULL,
  error_code VARCHAR(100),
  upstream_status SMALLINT,
  input_tokens INTEGER,
  output_tokens INTEGER,
  total_tokens INTEGER,
  latency_ms INTEGER NOT NULL CHECK (latency_ms >= 0),
  CONSTRAINT chat_events_status_check CHECK (
    status IN (
      'completed',
      'configuration_error',
      'rate_limited',
      'rate_limit_unavailable',
      'daily_budget_exhausted',
      'daily_budget_unavailable',
      'knowledge_unavailable',
      'openai_unavailable',
      'openai_rejected',
      'stream_failed'
    )
  ),
  CONSTRAINT chat_events_token_count_check CHECK (
    (input_tokens IS NULL OR input_tokens >= 0)
    AND (output_tokens IS NULL OR output_tokens >= 0)
    AND (total_tokens IS NULL OR total_tokens >= 0)
  )
);

CREATE INDEX IF NOT EXISTS chat_events_conversation_created_at_idx
  ON chat_events (conversation_id, created_at DESC);

CREATE INDEX IF NOT EXISTS chat_events_created_at_idx
  ON chat_events (created_at DESC);

CREATE INDEX IF NOT EXISTS chat_events_status_created_at_idx
  ON chat_events (status, created_at DESC);
