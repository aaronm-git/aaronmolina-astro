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
    <div className="bg-ink/40 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="border-ink bg-paper shadow-hard max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-md border-2 p-6" onClick={e => e.stopPropagation()}>
        <div className="mb-4 flex items-start justify-between">
          <h2 className="font-display text-ink text-xl font-black uppercase">Forward to Aaron</h2>
          <button type="button" onClick={onClose} className="text-graphite hover:bg-concrete-2 rounded-sm p-1" aria-label="Close">
            &times;
          </button>
        </div>

        {status === 'success' ? (
          <div className="border-ink bg-signal rounded-sm border-2 p-4">
            <p className="text-ink font-semibold">Sent. Aaron will be in touch.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-ink mb-1 block text-sm font-semibold">Your name (optional)</label>
              <input
                type="text"
                value={visitorName}
                onChange={e => setVisitorName(e.target.value)}
                className="border-ink bg-concrete text-ink focus-visible:outline-signal w-full rounded-sm border-2 px-3 py-2 text-sm focus-visible:outline-3 focus-visible:outline-offset-2"
                maxLength={120}
              />
            </div>
            <div>
              <label className="text-ink mb-1 block text-sm font-semibold">Your email</label>
              <input
                type="email"
                required
                value={visitorEmail}
                onChange={e => setVisitorEmail(e.target.value)}
                className="border-ink bg-concrete text-ink focus-visible:outline-signal w-full rounded-sm border-2 px-3 py-2 text-sm focus-visible:outline-3 focus-visible:outline-offset-2"
                maxLength={254}
              />
            </div>
            <div>
              <label className="text-ink mb-1 block text-sm font-semibold">Subject</label>
              <input
                type="text"
                required
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="border-ink bg-concrete text-ink focus-visible:outline-signal w-full rounded-sm border-2 px-3 py-2 text-sm focus-visible:outline-3 focus-visible:outline-offset-2"
                maxLength={200}
              />
            </div>
            <div>
              <label className="text-ink mb-1 block text-sm font-semibold">Message</label>
              <textarea
                required
                value={body}
                onChange={e => setBody(e.target.value)}
                rows={6}
                className="border-ink bg-concrete text-ink focus-visible:outline-signal w-full rounded-sm border-2 px-3 py-2 text-sm focus-visible:outline-3 focus-visible:outline-offset-2"
                maxLength={4000}
              />
            </div>
            {status === 'error' && <p className="text-ink text-sm">{errorMessage}</p>}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="border-ink bg-paper text-ink shadow-hard-sm rounded-sm border-2 px-4 py-2 text-sm font-semibold transition-all hover:-translate-x-0.5 hover:-translate-y-0.5"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="border-ink bg-signal text-ink shadow-hard-sm rounded-sm border-2 px-4 py-2 text-sm font-bold transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:opacity-50"
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
