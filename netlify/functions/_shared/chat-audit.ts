import { neon } from '@neondatabase/serverless';
import { z } from 'zod';

const ChatAuditStatusSchema = z.enum([
  'completed',
  'configuration_error',
  'rate_limited',
  'rate_limit_unavailable',
  'daily_budget_exhausted',
  'daily_budget_unavailable',
  'knowledge_unavailable',
  'openai_unavailable',
  'openai_rejected',
  'stream_failed',
]);

const ChatAuditEventSchema = z.object({
  conversationId: z.uuid(),
  turnNumber: z.number().int().positive().max(6),
  visitorHash: z.string().regex(/^[a-f0-9]{32}$/),
  requestId: z.string().trim().min(1).max(255).nullable(),
  deploymentId: z.string().trim().min(1).max(255).nullable(),
  model: z.string().trim().min(1).max(100),
  maxOutputTokens: z.number().int().positive(),
  inputMessageCount: z.number().int().positive().max(12),
  userMessage: z.string().trim().min(1).max(600),
  assistantResponse: z.string().trim().min(1).max(5_000).nullable(),
  status: ChatAuditStatusSchema,
  errorCode: z.string().trim().min(1).max(100).nullable(),
  upstreamStatus: z.number().int().min(100).max(599).nullable(),
  inputTokens: z.number().int().nonnegative().nullable(),
  outputTokens: z.number().int().nonnegative().nullable(),
  totalTokens: z.number().int().nonnegative().nullable(),
  latencyMs: z.number().int().nonnegative(),
});

export type ChatAuditEvent = z.infer<typeof ChatAuditEventSchema>;

/**
 * Persists one sanitized chat turn. Database failures deliberately do not
 * affect the visitor's chat response.
 */
export async function writeChatAudit(event: ChatAuditEvent): Promise<void> {
  const connectionString = process.env.NEON_DATABASE_URL;
  if (!connectionString) {
    console.warn('[chat] NEON_DATABASE_URL is not configured; chat audit was skipped');
    return;
  }

  const record = ChatAuditEventSchema.parse(event);
  const sql = neon(connectionString);

  await sql`
    INSERT INTO chat_events (
      conversation_id,
      turn_number,
      visitor_hash,
      request_id,
      deployment_id,
      model,
      max_output_tokens,
      input_message_count,
      user_message,
      assistant_response,
      status,
      error_code,
      upstream_status,
      input_tokens,
      output_tokens,
      total_tokens,
      latency_ms
    ) VALUES (
      ${record.conversationId},
      ${record.turnNumber},
      ${record.visitorHash},
      ${record.requestId},
      ${record.deploymentId},
      ${record.model},
      ${record.maxOutputTokens},
      ${record.inputMessageCount},
      ${record.userMessage},
      ${record.assistantResponse},
      ${record.status},
      ${record.errorCode},
      ${record.upstreamStatus},
      ${record.inputTokens},
      ${record.outputTokens},
      ${record.totalTokens},
      ${record.latencyMs}
    );
  `;
}
