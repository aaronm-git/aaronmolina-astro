import { createHash } from 'node:crypto';
import { getStore } from '@netlify/blobs';

const WINDOW_SECONDS = 60 * 60;
const MAX_REQUESTS = 20;

type RateLimitRecord = {
  count: number;
  windowStartedAt: number;
};

export type RateLimitResult =
  | { allowed: true; remaining: number }
  | { allowed: false; retryAfterSeconds: number };

function hashIp(ip: string): string {
  return createHash('sha256').update(ip).digest('hex').slice(0, 32);
}

/**
 * Token-bucket rate limit keyed by SHA-256(ip). Persists in Netlify Blobs
 * so the limit survives function cold starts within the deployment.
 */
export async function checkRateLimit(ip: string): Promise<RateLimitResult> {
  const key = hashIp(ip);
  const store = getStore({ name: 'chat-rate-limits', consistency: 'strong' });
  const now = Math.floor(Date.now() / 1000);

  const existing = (await store.get(key, { type: 'json' })) as RateLimitRecord | null;

  if (!existing || now - existing.windowStartedAt >= WINDOW_SECONDS) {
    await store.setJSON(key, { count: 1, windowStartedAt: now });
    return { allowed: true, remaining: MAX_REQUESTS - 1 };
  }

  if (existing.count >= MAX_REQUESTS) {
    const retryAfterSeconds = WINDOW_SECONDS - (now - existing.windowStartedAt);
    return { allowed: false, retryAfterSeconds };
  }

  await store.setJSON(key, {
    count: existing.count + 1,
    windowStartedAt: existing.windowStartedAt,
  });

  return { allowed: true, remaining: MAX_REQUESTS - existing.count - 1 };
}

const DAILY_TOKENS_KEY = 'global-daily-tokens';

type DailyTokenRecord = {
  totalTokens: number;
  dayKey: string;
};

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function checkDailyTokenBudget(maxDailyTokens: number): Promise<{ allowed: boolean }> {
  if (!Number.isFinite(maxDailyTokens) || maxDailyTokens <= 0) return { allowed: true };
  const store = getStore({ name: 'chat-spend', consistency: 'strong' });
  const record = (await store.get(DAILY_TOKENS_KEY, { type: 'json' })) as DailyTokenRecord | null;
  const day = todayKey();
  if (!record || record.dayKey !== day) return { allowed: true };
  return { allowed: record.totalTokens < maxDailyTokens };
}

export async function recordTokenSpend(tokens: number): Promise<void> {
  if (!Number.isFinite(tokens) || tokens <= 0) return;
  const store = getStore({ name: 'chat-spend', consistency: 'strong' });
  const day = todayKey();
  const record = (await store.get(DAILY_TOKENS_KEY, { type: 'json' })) as DailyTokenRecord | null;
  const next: DailyTokenRecord =
    !record || record.dayKey !== day
      ? { totalTokens: tokens, dayKey: day }
      : { totalTokens: record.totalTokens + tokens, dayKey: day };
  await store.setJSON(DAILY_TOKENS_KEY, next);
}
