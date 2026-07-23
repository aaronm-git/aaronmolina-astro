import type { APIRoute } from 'astro';
import { buildPortfolioChatContext } from '@/lib/portfolio-knowledge';

/**
 * Build-only source for the server's private chat-context module. The Astro
 * build integration consumes and removes this static output before deployment.
 */
export const GET: APIRoute = async () => {
  const body = await buildPortfolioChatContext();

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
