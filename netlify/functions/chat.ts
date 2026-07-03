import Anthropic from '@anthropic-ai/sdk';
import { getStore } from '@netlify/blobs';
import { ChatRequestSchema, LeadFlagInputSchema, type ChatStreamEvent } from '../../src/lib/chat/schemas';
import { buildSystemPrompt, FLAG_LEAD_TOOL } from '../../src/lib/chat/system-prompt';
import { checkRateLimit, checkDailyTokenBudget, recordTokenSpend } from '../../src/lib/chat/rate-limit';

const MODEL_ID = 'claude-haiku-4-5';
const MAX_OUTPUT_TOKENS = 1024;
const MAX_AGENT_TURNS = 4;

let cachedKnowledge: string | null = null;
let cachedSystemPrompt: string | null = null;

async function loadKnowledge(req: Request): Promise<string> {
  if (cachedKnowledge) return cachedKnowledge;
  const url = new URL(req.url);
  const base = process.env.URL || `${url.protocol}//${url.host}`;
  const res = await fetch(`${base.replace(/\/$/, '')}/llms.txt`);
  if (!res.ok) throw new Error(`Failed to load knowledge: ${res.status}`);
  cachedKnowledge = await res.text();
  return cachedKnowledge;
}

function jsonError(message: string, status: number, extraHeaders: Record<string, string> = {}): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
  });
}

function getClientIp(req: Request): string {
  return (
    req.headers.get('x-nf-client-connection-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  );
}

function encodeSse(event: ChatStreamEvent): string {
  return `data: ${JSON.stringify(event)}\n\n`;
}

async function logConversation(args: {
  conversationId: string;
  messages: { role: string; content: string }[];
  finalAssistantText: string;
  leadFlag: unknown;
  ip: string;
}): Promise<void> {
  try {
    const store = getStore({ name: 'chat-conversations' });
    await store.setJSON(`${new Date().toISOString()}-${args.conversationId}`, {
      conversationId: args.conversationId,
      timestamp: new Date().toISOString(),
      ipHash: args.ip,
      messages: args.messages,
      finalAssistantText: args.finalAssistantText,
      leadFlag: args.leadFlag,
    });
  } catch (err) {
    console.error('[chat] failed to log conversation', err);
  }
}

export default async (req: Request): Promise<Response> => {
  if (req.method !== 'POST') {
    return jsonError('Method not allowed', 405);
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return jsonError('Chat is paused. Please email aaron@pagelyft.studio.', 503);
  }

  const ip = getClientIp(req);
  const ipHash = ip;

  const rate = await checkRateLimit(ip);
  if (!rate.allowed) {
    return jsonError(
      "You've hit the chat rate limit. Try again later or email aaron@pagelyft.studio.",
      429,
      { 'Retry-After': String(rate.retryAfterSeconds) },
    );
  }

  const maxDailyTokens = Number(process.env.MAX_DAILY_TOKENS ?? 500_000);
  const budget = await checkDailyTokenBudget(maxDailyTokens);
  if (!budget.allowed) {
    return jsonError(
      'Chat is temporarily unavailable due to daily usage limits. Please email aaron@pagelyft.studio.',
      503,
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError('Invalid JSON body', 400);
  }

  const parsed = ChatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError('Invalid request format', 400);
  }

  const { messages, conversationId } = parsed.data;

  if (!cachedSystemPrompt) {
    try {
      const knowledge = await loadKnowledge(req);
      cachedSystemPrompt = buildSystemPrompt(knowledge);
    } catch (err) {
      console.error('[chat] knowledge load failed', err);
      return jsonError('Chat unavailable. Please email aaron@pagelyft.studio.', 503);
    }
  }

  const client = new Anthropic({ apiKey });

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const encoder = new TextEncoder();
      const send = (event: ChatStreamEvent) =>
        controller.enqueue(encoder.encode(encodeSse(event)));

      const conversation: Anthropic.MessageParam[] = messages.map(m => ({
        role: m.role,
        content: m.content,
      }));

      let assistantText = '';
      let leadFlag: unknown = null;
      let totalTokensUsed = 0;

      try {
        for (let turn = 0; turn < MAX_AGENT_TURNS; turn++) {
          const apiStream = client.messages.stream({
            model: MODEL_ID,
            max_tokens: MAX_OUTPUT_TOKENS,
            system: [
              {
                type: 'text',
                text: cachedSystemPrompt!,
                cache_control: { type: 'ephemeral' },
              },
            ],
            tools: [FLAG_LEAD_TOOL],
            messages: conversation,
          });

          for await (const event of apiStream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              assistantText += event.delta.text;
              send({ type: 'text_delta', text: event.delta.text });
            }
          }

          const finalMessage = await apiStream.finalMessage();
          totalTokensUsed +=
            (finalMessage.usage?.input_tokens ?? 0) + (finalMessage.usage?.output_tokens ?? 0);

          conversation.push({ role: 'assistant', content: finalMessage.content });

          const toolUses = finalMessage.content.filter(
            (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use',
          );

          if (toolUses.length === 0 || finalMessage.stop_reason !== 'tool_use') {
            break;
          }

          const toolResults: Anthropic.ToolResultBlockParam[] = [];
          for (const toolUse of toolUses) {
            if (toolUse.name === 'flag_lead') {
              const flagParse = LeadFlagInputSchema.safeParse(toolUse.input);
              if (flagParse.success) {
                leadFlag = flagParse.data;
                send({ type: 'lead_flag', data: flagParse.data });
                toolResults.push({
                  type: 'tool_result',
                  tool_use_id: toolUse.id,
                  content: 'Lead flagged successfully. Tell the visitor you have flagged this for Aaron to follow up.',
                });
              } else {
                toolResults.push({
                  type: 'tool_result',
                  tool_use_id: toolUse.id,
                  content: 'Invalid tool input. Please provide reason, suggested_email_subject, and suggested_email_body.',
                  is_error: true,
                });
              }
            } else {
              toolResults.push({
                type: 'tool_result',
                tool_use_id: toolUse.id,
                content: 'Unknown tool',
                is_error: true,
              });
            }
          }

          conversation.push({ role: 'user', content: toolResults });
        }

        send({ type: 'done' });
      } catch (err) {
        console.error('[chat] streaming failed', err);
        send({ type: 'error', message: 'Something went wrong. Please try again or email aaron@pagelyft.studio.' });
      } finally {
        controller.close();
        await Promise.allSettled([
          recordTokenSpend(totalTokensUsed),
          logConversation({
            conversationId,
            messages: messages.map(m => ({ role: m.role, content: m.content })),
            finalAssistantText: assistantText,
            leadFlag,
            ip: ipHash,
          }),
        ]);
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
};

export const config = {
  path: '/api/chat',
};
