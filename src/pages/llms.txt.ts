import type { APIRoute } from 'astro';
import { buildPortfolioKnowledge } from '@/lib/portfolio-knowledge';

export const GET: APIRoute = async () => {
  const body = await buildPortfolioKnowledge();

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
