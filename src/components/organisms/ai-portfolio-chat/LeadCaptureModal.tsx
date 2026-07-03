import { useState } from 'react';
import type { LeadFlag } from './types';

interface Props {
  open: boolean;
  flag: LeadFlag | null;
  conversationId: string;
  onClose: () => void;
  onSubmitted: () => void;
}

/**
 * Modal that pre-fills subject and body from the flag_lead tool call,
 * collects the visitor's email, and posts to /api/lead.
 */
export default function LeadCaptureModal({ open, flag, conversationId, onClose, onSubmitted }: Props) {
  const [visitorEmail, setVisitorEmail] = useState('');
  const [visitorName, setVisitorName] = useState('');
  const [subject, setSubject] = useState(flag?.suggested_email_subject ?? '');
  const [body, setBody] = useState(flag?.suggested_email_body ?? '');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  if (!open || !flag) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setStatus('idle');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorEmail,
          visitorName: visitorName || undefined,
          subject,
          body,
          conversationId,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrorMessage(data?.error || 'Could not send. Please email aaron@pagelyft.studio directly.');
        setStatus('error');
      } else {
        setStatus('success');
        setTimeout(() => {
          onSubmitted();
          onClose();
        }, 1500);
      }
    } catch {
      setErrorMessage('Could not send. Please email aaron@pagelyft.studio directly.');
      setStatus('error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border-2 border-border bg-card p-6 shadow-[6px_6px_0_var(--color-border)]"
        onClick={e => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <h2 className="text-xl font-extrabold">Forward to Aaron</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-muted-foreground hover:bg-muted"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {status === 'success' ? (
          <div className="rounded-xl border-2 border-border bg-secondary p-4">
            <p className="font-semibold">Sent. Aaron will be in touch.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-semibold">Your name (optional)</label>
              <input
                type="text"
                value={visitorName}
                onChange={e => setVisitorName(e.target.value)}
                className="w-full rounded-lg border-2 border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                maxLength={120}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold">Your email</label>
              <input
                type="email"
                required
                value={visitorEmail}
                onChange={e => setVisitorEmail(e.target.value)}
                className="w-full rounded-lg border-2 border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                maxLength={254}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold">Subject</label>
              <input
                type="text"
                required
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full rounded-lg border-2 border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                maxLength={200}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold">Message</label>
              <textarea
                required
                value={body}
                onChange={e => setBody(e.target.value)}
                rows={6}
                className="w-full rounded-lg border-2 border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                maxLength={4000}
              />
            </div>
            {status === 'error' && (
              <p className="text-sm text-destructive">{errorMessage}</p>
            )}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border-2 border-border bg-card px-4 py-2 text-sm font-semibold shadow-[2px_2px_0_var(--color-border)] transition-all hover:-translate-y-0.5"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-full border-2 border-border bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-[2px_2px_0_var(--color-border)] transition-all hover:-translate-y-0.5 disabled:opacity-50"
              >
                {submitting ? 'Sending...' : 'Send to Aaron'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
