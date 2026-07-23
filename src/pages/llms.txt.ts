import type { APIRoute } from 'astro';
import { buildPublicLlms } from '@/lib/portfolio-knowledge';

export const GET: APIRoute = async () => {
  const body = await buildPublicLlms();

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
