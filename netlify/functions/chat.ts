import { z } from 'zod';
import {
  ChatRequestSchema,
  ChatStreamEventSchema,
  type ChatRequest,
  type ChatStreamEvent,
} from '../../src/lib/chat/schemas';
import { checkDailyTokenBudget, checkRateLimit, hashIp, recordTokenSpend } from '../../src/lib/chat/rate-limit';
import { buildSystemPrompt } from '../../src/lib/chat/system-prompt';
import { type ChatAuditEvent, writeChatAudit } from './_shared/chat-audit';
import type { Config, Context } from '@netlify/functions';

const MODEL_ID = 'gpt-5.4-nano';
const MAX_OUTPUT_TOKENS = 240;
const MAX_REQUEST_BODY_BYTES = 16_000;
const DEFAULT_MAX_DAILY_TOKENS = 100_000;
const OPENAI_RESPONSE_TIMEOUT_MS = 20_000;
const LOCAL_ADMIN_IPS = new Set(['::1', '127.0.0.1', '::ffff:127.0.0.1']);

const AdminIpListSchema = z.array(z.union([z.ipv4(), z.ipv6()]));

const OpenAITextDeltaSchema = z.object({
  type: z.literal('response.output_text.delta'),
  delta: z.string(),
});

const OpenAICompletedSchema = z.object({
  type: z.literal('response.completed'),
  response: z.object({
    usage: z.object({
      input_tokens: z.number().int().nonnegative().optional(),
      output_tokens: z.number().int().nonnegative().optional(),
      total_tokens: z.number().int().nonnegative(),
    }).nullable().optional(),
  }),
});

const OpenAIFailureSchema = z.object({
  type: z.enum(['error', 'response.failed', 'response.incomplete']),
});

const OpenAIErrorResponseSchema = z.object({
  error: z.object({
    code: z.string().nullable().optional(),
    message: z.string(),
    param: z.string().nullable().optional(),
    type: z.string(),
  }),
});

let cachedSystemPrompt: string | null = null;

/** Fetches the public portfolio knowledge once for each warm function instance. */
async function loadSystemPrompt(req: Request): Promise<string> {
  if (cachedSystemPrompt) return cachedSystemPrompt;

  const requestUrl = new URL(req.url);
  const base = process.env.URL || requestUrl.origin;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5_000);

  try {
    const response = await fetch(`${base.replace(/\/$/, '')}/llms.txt`, {
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`Knowledge request returned ${response.status}`);

    cachedSystemPrompt = buildSystemPrompt(await response.text());
    return cachedSystemPrompt;
  } finally {
    clearTimeout(timeout);
  }
}

/** Returns a JSON error response with browser-safe cache and MIME headers. */
function jsonError(message: string, status: number, extraHeaders: Record<string, string> = {}): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
      ...extraHeaders,
    },
  });
}

/** Uses Netlify's trusted visitor-IP header, with a local-development fallback. */
function getClientIp(req: Request): string {
  return req.headers.get('x-nf-client-connection-ip') || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

/** Exempts loopback and explicitly configured administrator IPs from visitor limits. */
function isAdminIp(ip: string): boolean {
  if (LOCAL_ADMIN_IPS.has(ip)) return true;

  const configuredIps = process.env.CHAT_ADMIN_IPS
    ?.split(',')
    .map(value => value.trim())
    .filter(Boolean) ?? [];
  const parsedIps = AdminIpListSchema.safeParse(configuredIps);

  if (!parsedIps.success) {
    console.error('[chat] CHAT_ADMIN_IPS contains an invalid IP address');
    return false;
  }

  return parsedIps.data.includes(ip);
}

/** Allows browser requests only from this deployment or a local development origin. */
function hasAllowedOrigin(req: Request): boolean {
  const origin = req.headers.get('origin');
  if (!origin) return false;

  const requestUrl = new URL(req.url);
  const requestOrigin = requestUrl.origin;
  if (origin === requestOrigin) return true;

  const configuredUrl = z.url().safeParse(process.env.URL);
  if (configuredUrl.success && origin === new URL(configuredUrl.data).origin) return true;

  const isLocalRequest = requestUrl.hostname === 'localhost' || requestUrl.hostname === '127.0.0.1';
  return isLocalRequest && ['http://localhost:4321', 'http://localhost:8888', 'http://127.0.0.1:4321', 'http://127.0.0.1:8888'].includes(origin);
}

/** Parses the configured global token ceiling while retaining a safe default. */
function getDailyTokenLimit(): number {
  const parsedLimit = z.coerce.number().int().positive().safeParse(process.env.MAX_DAILY_TOKENS);
  return parsedLimit.success ? parsedLimit.data : DEFAULT_MAX_DAILY_TOKENS;
}

/** Encodes only validated server-sent events for the browser chat island. */
function encodeSse(event: ChatStreamEvent): string {
  return `data: ${JSON.stringify(ChatStreamEventSchema.parse(event))}\n\n`;
}

/** Builds text-only Responses API input from the validated transcript. */
function createOpenAIInput(messages: ChatRequest['messages']) {
  return messages.map(message => ({
    role: message.role,
    content: [{ type: message.role === 'assistant' ? 'output_text' : 'input_text', text: message.content }],
  }));
}

/** Forwards useful OpenAI stream events without exposing upstream event details. */
async function forwardOpenAIStream(args: {
  body: ReadableStream<Uint8Array>;
  send: (event: ChatStreamEvent) => void;
}): Promise<{ inputTokens: number | null; outputTokens: number | null; responseText: string; totalTokens: number }> {
  const reader = args.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let inputTokens: number | null = null;
  let outputTokens: number | null = null;
  let responseText = '';
  let totalTokens = 0;

  const processEvent = (rawEvent: string) => {
    const data = rawEvent
      .split(/\r?\n/)
      .filter(line => line.startsWith('data:'))
      .map(line => line.slice(5).trim())
      .join('\n');

    if (!data || data === '[DONE]') return;

    let eventPayload: unknown;
    try {
      eventPayload = JSON.parse(data);
    } catch {
      return;
    }

    const textDelta = OpenAITextDeltaSchema.safeParse(eventPayload);
    if (textDelta.success) {
      responseText += textDelta.data.delta;
      args.send({ type: 'text_delta', text: textDelta.data.delta });
      return;
    }

    const completed = OpenAICompletedSchema.safeParse(eventPayload);
    if (completed.success) {
      const usage = completed.data.response.usage;
      inputTokens = usage?.input_tokens ?? inputTokens;
      outputTokens = usage?.output_tokens ?? outputTokens;
      totalTokens = usage?.total_tokens ?? totalTokens;
      return;
    }

    const failure = OpenAIFailureSchema.safeParse(eventPayload);
    if (failure.success) {
      throw new Error(`OpenAI stream ended with ${failure.data.type}`);
    }
  };

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const events = buffer.split(/\r?\n\r?\n/);
      buffer = events.pop() ?? '';
      events.forEach(processEvent);
    }

    if (buffer.trim()) processEvent(buffer);
    return { inputTokens, outputTokens, responseText, totalTokens };
  } finally {
    reader.releaseLock();
  }
}

/** Schedules a safe, validated audit write without delaying the chat response. */
function queueChatAudit(context: Context, event: ChatAuditEvent): void {
  context.waitUntil(
    writeChatAudit(event).catch(error => {
      console.error('[chat] audit write failed', error);
    }),
  );
}

export default async (req: Request, context: Context): Promise<Response> => {
  const startedAt = Date.now();
  if (req.method !== 'POST') return jsonError('Method not allowed', 405, { Allow: 'POST' });
  if (!hasAllowedOrigin(req)) return jsonError('Forbidden', 403);

  const contentLength = z.coerce.number().int().nonnegative().safeParse(req.headers.get('content-length'));
  if (contentLength.success && contentLength.data > MAX_REQUEST_BODY_BYTES) {
    return jsonError('Request is too large.', 413);
  }

  let body: unknown;
  try {
    const rawBody = await req.text();
    if (new TextEncoder().encode(rawBody).byteLength > MAX_REQUEST_BODY_BYTES) {
      return jsonError('Request is too large.', 413);
    }
    body = JSON.parse(rawBody);
  } catch {
    return jsonError('Invalid JSON body.', 400);
  }

  const parsedRequest = ChatRequestSchema.safeParse(body);
  if (!parsedRequest.success) return jsonError('Invalid request format.', 400);

  const ip = getClientIp(req);
  const adminRequest = isAdminIp(ip);
  const lastMessage = parsedRequest.data.messages.at(-1);
  if (!lastMessage) return jsonError('Invalid request format.', 400);

  const auditBase = {
    conversationId: parsedRequest.data.conversationId,
    turnNumber: parsedRequest.data.messages.filter(message => message.role === 'user').length,
    visitorHash: hashIp(ip),
    requestId: context.requestId ?? null,
    deploymentId: context.deploy.id ?? null,
    model: MODEL_ID,
    maxOutputTokens: MAX_OUTPUT_TOKENS,
    inputMessageCount: parsedRequest.data.messages.length,
    userMessage: lastMessage.content,
  };
  const audit = (event: Omit<ChatAuditEvent, keyof typeof auditBase | 'latencyMs'>) => {
    queueChatAudit(context, { ...auditBase, ...event, latencyMs: Date.now() - startedAt });
  };

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    audit({
      assistantResponse: null,
      status: 'configuration_error',
      errorCode: 'openai_api_key_missing',
      upstreamStatus: null,
      inputTokens: null,
      outputTokens: null,
      totalTokens: null,
    });
    return jsonError('Chat is temporarily unavailable.', 503);
  }

  let rateLimitRemaining: number | null = null;
  if (!adminRequest) {
    try {
      const rateLimit = await checkRateLimit(ip);
      if (!rateLimit.allowed) {
        audit({
          assistantResponse: null,
          status: 'rate_limited',
          errorCode: 'visitor_limit_reached',
          upstreamStatus: null,
          inputTokens: null,
          outputTokens: null,
          totalTokens: null,
        });
        return jsonError('You have reached the chat limit. Please try again later.', 429, {
          'Retry-After': String(rateLimit.retryAfterSeconds),
        });
      }
      rateLimitRemaining = rateLimit.remaining;
    } catch (error) {
      console.error('[chat] rate limit unavailable', error);
      audit({
        assistantResponse: null,
        status: 'rate_limit_unavailable',
        errorCode: 'rate_limit_store_unavailable',
        upstreamStatus: null,
        inputTokens: null,
        outputTokens: null,
        totalTokens: null,
      });
      return jsonError('Chat is temporarily unavailable. Please try again later.', 503);
    }
  }

  const maxDailyTokens = getDailyTokenLimit();
  try {
    const budget = await checkDailyTokenBudget(maxDailyTokens);
    if (!budget.allowed) {
      audit({
        assistantResponse: null,
        status: 'daily_budget_exhausted',
        errorCode: 'daily_token_budget_reached',
        upstreamStatus: null,
        inputTokens: null,
        outputTokens: null,
        totalTokens: null,
      });
      return jsonError('Chat is temporarily unavailable. Please try again tomorrow.', 503);
    }
  } catch (error) {
    console.error('[chat] daily budget unavailable', error);
    audit({
      assistantResponse: null,
      status: 'daily_budget_unavailable',
      errorCode: 'daily_token_store_unavailable',
      upstreamStatus: null,
      inputTokens: null,
      outputTokens: null,
      totalTokens: null,
    });
    return jsonError('Chat is temporarily unavailable. Please try again later.', 503);
  }

  let systemPrompt: string;
  try {
    systemPrompt = await loadSystemPrompt(req);
  } catch (error) {
    console.error('[chat] knowledge load failed', error);
    audit({
      assistantResponse: null,
      status: 'knowledge_unavailable',
      errorCode: 'portfolio_knowledge_unavailable',
      upstreamStatus: null,
      inputTokens: null,
      outputTokens: null,
      totalTokens: null,
    });
    return jsonError('Chat is temporarily unavailable. Please try again later.', 503);
  }

  const openAiController = new AbortController();
  const openAiTimeout = setTimeout(() => openAiController.abort(), OPENAI_RESPONSE_TIMEOUT_MS);
  let upstream: Response;

  try {
    upstream = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      signal: openAiController.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'X-Client-Request-Id': parsedRequest.data.conversationId,
      },
      body: JSON.stringify({
        model: MODEL_ID,
        instructions: systemPrompt,
        input: createOpenAIInput(parsedRequest.data.messages),
        max_output_tokens: MAX_OUTPUT_TOKENS,
        safety_identifier: hashIp(ip),
        store: false,
        stream: true,
      }),
    });
  } catch (error) {
    clearTimeout(openAiTimeout);
    console.error('[chat] OpenAI request failed', error);
    audit({
      assistantResponse: null,
      status: 'openai_unavailable',
      errorCode: 'openai_request_failed',
      upstreamStatus: null,
      inputTokens: null,
      outputTokens: null,
      totalTokens: null,
    });
    return jsonError('Chat service is unavailable. Please try again later.', 502);
  }

  if (!upstream.ok || !upstream.body) {
    clearTimeout(openAiTimeout);
    const errorPayload: unknown = await upstream.json().catch(() => null);
    const parsedError = OpenAIErrorResponseSchema.safeParse(errorPayload);
    console.error('[chat] OpenAI request rejected', {
      status: upstream.status,
      requestId: upstream.headers.get('x-request-id'),
      error: parsedError.success
        ? {
            code: parsedError.data.error.code,
            param: parsedError.data.error.param,
            type: parsedError.data.error.type,
          }
        : 'Unparseable OpenAI error response',
    });
    audit({
      assistantResponse: null,
      status: 'openai_rejected',
      errorCode: parsedError.success ? parsedError.data.error.type : 'unparseable_openai_error',
      upstreamStatus: upstream.status,
      inputTokens: null,
      outputTokens: null,
      totalTokens: null,
    });
    return jsonError('Chat service is unavailable. Please try again later.', 502);
  }

  const upstreamBody = upstream.body;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const encoder = new TextEncoder();
      const send = (event: ChatStreamEvent) => controller.enqueue(encoder.encode(encodeSse(event)));
      let totalTokens = 0;
      let completed = false;
      let inputTokens: number | null = null;
      let outputTokens: number | null = null;
      let responseText = '';

      try {
        const result = await forwardOpenAIStream({ body: upstreamBody, send });
        totalTokens = result.totalTokens;
        inputTokens = result.inputTokens;
        outputTokens = result.outputTokens;
        responseText = result.responseText;
        completed = true;
        send({ type: 'done' });
      } catch (error) {
        console.error('[chat] OpenAI stream failed', error);
        send({ type: 'error', message: 'Chat service is unavailable. Please try again later.' });
      } finally {
        clearTimeout(openAiTimeout);
        try {
          await recordTokenSpend(totalTokens);
        } catch (error) {
          console.error('[chat] token usage recording failed', error);
        }
        audit({
          assistantResponse: responseText.trim() || null,
          status: completed ? 'completed' : 'stream_failed',
          errorCode: completed ? null : 'openai_stream_failed',
          upstreamStatus: completed ? 200 : null,
          inputTokens,
          outputTokens,
          totalTokens: totalTokens || null,
        });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Cache-Control': 'no-store, no-transform',
      Connection: 'keep-alive',
      'Content-Type': 'text/event-stream; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
      'X-RateLimit-Remaining': adminRequest ? 'admin' : String(rateLimitRemaining),
    },
  });
};

export const config: Config = {
  path: '/api/chat',
};
