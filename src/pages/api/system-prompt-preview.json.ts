import type { APIRoute } from 'astro';
import { buildChatbotContext } from '@/lib/chatbot-context';
import { buildSystemPrompt, FLAG_LEAD_TOOL } from '@/lib/chat/system-prompt';

export const GET: APIRoute = async () => {
  const knowledge = await buildChatbotContext();
  const systemPrompt = buildSystemPrompt(knowledge);

  return new Response(
    JSON.stringify({
      systemPrompt,
      tools: [FLAG_LEAD_TOOL],
    }),
    {
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    },
  );
};
