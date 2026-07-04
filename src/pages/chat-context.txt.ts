import type { APIRoute } from 'astro';
import { buildChatbotContext } from '@/lib/chatbot-context';

/**
 * Serves the AI chatbot knowledge base as plain text. Generated at build time
 * from the site's content collections and fetched by the chat function at
 * runtime, so the assistant and the website share a single source of truth.
 */
export const GET: APIRoute = async () => {
  const body = await buildChatbotContext();

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
