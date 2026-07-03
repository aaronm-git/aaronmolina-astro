import { getStore } from '@netlify/blobs';
import { LeadRequestSchema } from '../../src/lib/chat/schemas';

const NOTIFY_EMAIL = process.env.LEAD_NOTIFY_EMAIL || 'aaron@pagelyft.studio';
const RESEND_FROM = process.env.RESEND_FROM_EMAIL || 'leads@aaronmolina.me';

function jsonError(message: string, status: number): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function sendViaResend(args: {
  visitorEmail: string;
  visitorName?: string;
  subject: string;
  body: string;
  conversationId: string;
}): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, error: 'RESEND_API_KEY not set' };

  const fromName = args.visitorName ? `${args.visitorName} via Portfolio Chat` : 'Portfolio Chat';

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `${fromName} <${RESEND_FROM}>`,
      to: [NOTIFY_EMAIL],
      reply_to: args.visitorEmail,
      subject: `[Portfolio Lead] ${args.subject}`,
      text: `${args.body}\n\nFrom: ${args.visitorName || 'Visitor'} <${args.visitorEmail}>\nConversation ID: ${args.conversationId}`,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    return { ok: false, error: `Resend ${res.status}: ${detail}` };
  }
  return { ok: true };
}

export default async (req: Request): Promise<Response> => {
  if (req.method !== 'POST') return jsonError('Method not allowed', 405);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError('Invalid JSON body', 400);
  }

  const parsed = LeadRequestSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError('Invalid request format', 400);
  }

  const lead = parsed.data;
  const submittedAt = new Date().toISOString();

  try {
    const store = getStore({ name: 'chat-leads' });
    await store.setJSON(`${submittedAt}-${lead.conversationId}`, {
      ...lead,
      submittedAt,
    });
  } catch (err) {
    console.error('[lead] failed to persist lead', err);
  }

  const emailResult = await sendViaResend(lead);
  if (!emailResult.ok) {
    console.warn('[lead] email delivery skipped or failed:', emailResult.error);
  }

  return new Response(
    JSON.stringify({ ok: true, emailDelivered: emailResult.ok }),
    { status: 200, headers: { 'Content-Type': 'application/json' } },
  );
};

export const config = {
  path: '/api/lead',
};
