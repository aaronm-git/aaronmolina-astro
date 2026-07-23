import { createHash } from 'node:crypto';
import { getStore } from '@netlify/blobs';
import { z } from 'zod';

const WINDOW_SECONDS = 10 * 60;
const MAX_REQUESTS_PER_WINDOW = 6;
const DAILY_WINDOW_SECONDS = 24 * 60 * 60;
const MAX_REQUESTS_PER_DAY = 20;

const RateLimitRecordSchema = z.object({
  count: z.number().int().nonnegative(),
  windowStartedAt: z.number().int().nonnegative(),
});

const DailyTokenRecordSchema = z.object({
  totalTokens: z.number().int().nonnegative(),
  dayKey: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

type DailyTokenRecord = z.infer<typeof DailyTokenRecordSchema>;

export type RateLimitResult =
  | { allowed: true; remaining: number; retryAfterSeconds: number }
  | { allowed: false; retryAfterSeconds: number };

/** Produces a stable, non-reversible visitor identifier for abuse controls. */
export function hashIp(ip: string): string {
  return createHash('sha256').update(ip).digest('hex').slice(0, 32);
}

/**
 * Enforces a short fixed window and a daily per-IP cap. Both counters are
 * stored as hashed visitor identifiers so raw IP addresses are not persisted.
 */
export async function checkRateLimit(ip: string): Promise<RateLimitResult> {
  const visitorKey = hashIp(ip);
  const store = getStore({ name: 'chat-rate-limits', consistency: 'strong' });
  const now = Math.floor(Date.now() / 1000);
  const windowResult = await consumeWindow({
    key: `window-${visitorKey}`,
    maxRequests: MAX_REQUESTS_PER_WINDOW,
    windowSeconds: WINDOW_SECONDS,
    store,
    now,
  });

  if (!windowResult.allowed) return windowResult;

  const dailyResult = await consumeWindow({
    key: `day-${visitorKey}`,
    maxRequests: MAX_REQUESTS_PER_DAY,
    windowSeconds: DAILY_WINDOW_SECONDS,
    store,
    now,
  });

  if (!dailyResult.allowed) return dailyResult;

  return {
    allowed: true,
    remaining: Math.min(windowResult.remaining, dailyResult.remaining),
    retryAfterSeconds: Math.min(windowResult.retryAfterSeconds, dailyResult.retryAfterSeconds),
  };
}

/** Consumes one request from one persisted fixed-window counter. */
async function consumeWindow(args: {
  key: string;
  maxRequests: number;
  windowSeconds: number;
  store: ReturnType<typeof getStore>;
  now: number;
}): Promise<RateLimitResult> {
  const existingValue = await args.store.get(args.key, { type: 'json' });
  const parsedRecord = RateLimitRecordSchema.safeParse(existingValue);
  const existing = parsedRecord.success ? parsedRecord.data : null;

  if (!existing || args.now - existing.windowStartedAt >= args.windowSeconds) {
    await args.store.setJSON(args.key, { count: 1, windowStartedAt: args.now });
    return {
      allowed: true,
      remaining: args.maxRequests - 1,
      retryAfterSeconds: args.windowSeconds,
    };
  }

  const retryAfterSeconds = args.windowSeconds - (args.now - existing.windowStartedAt);
  if (existing.count >= args.maxRequests) {
    return { allowed: false, retryAfterSeconds };
  }

  await args.store.setJSON(args.key, {
    count: existing.count + 1,
    windowStartedAt: existing.windowStartedAt,
  });

  return {
    allowed: true,
    remaining: args.maxRequests - existing.count - 1,
    retryAfterSeconds,
  };
}

const DAILY_TOKENS_KEY = 'global-daily-tokens';

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function checkDailyTokenBudget(maxDailyTokens: number): Promise<{ allowed: boolean }> {
  if (!Number.isFinite(maxDailyTokens) || maxDailyTokens <= 0) return { allowed: true };
  const store = getStore({ name: 'chat-spend', consistency: 'strong' });
  const storedRecord = await store.get(DAILY_TOKENS_KEY, { type: 'json' });
  const parsedRecord = DailyTokenRecordSchema.safeParse(storedRecord);
  const record = parsedRecord.success ? parsedRecord.data : null;
  const day = todayKey();
  if (!record || record.dayKey !== day) return { allowed: true };
  return { allowed: record.totalTokens < maxDailyTokens };
}

export async function recordTokenSpend(tokens: number): Promise<void> {
  if (!Number.isFinite(tokens) || tokens <= 0) return;
  const store = getStore({ name: 'chat-spend', consistency: 'strong' });
  const day = todayKey();
  const storedRecord = await store.get(DAILY_TOKENS_KEY, { type: 'json' });
  const parsedRecord = DailyTokenRecordSchema.safeParse(storedRecord);
  const record = parsedRecord.success ? parsedRecord.data : null;
  const next: DailyTokenRecord =
    !record || record.dayKey !== day
      ? { totalTokens: tokens, dayKey: day }
      : { totalTokens: record.totalTokens + tokens, dayKey: day };
  await store.setJSON(DAILY_TOKENS_KEY, next);
}
