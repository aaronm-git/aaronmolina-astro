import type { ChatMessage as ChatMessageType, LeadFlag } from './types';

interface Props {
  message: ChatMessageType;
  onForward?: (flag: LeadFlag) => void;
}

const REASON_LABEL: Record<LeadFlag['reason'], string> = {
  hiring: 'Hiring inquiry',
  rates: 'Rates question',
  scope: 'Scope discussion',
  out_of_scope: 'Outside the bot\'s knowledge',
};

/**
 * Single chat bubble. Streams text incrementally and renders
 * an inline "Email Aaron about this" button when a lead flag is attached.
 */
export default function ChatMessage({ message, onForward }: Props) {
  const isUser = message.role === 'user';
  const flag = message.leadFlag;

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-2xl border-2 border-border px-4 py-3 ${
          isUser
            ? 'bg-primary text-primary-foreground shadow-[3px_3px_0_var(--color-border)]'
            : 'bg-card text-card-foreground shadow-[3px_3px_0_var(--color-border)]'
        }`}
      >
        <p className="whitespace-pre-wrap text-sm leading-relaxed">
          {message.content}
          {message.content === '' && !isUser && (
            <span className="inline-block animate-pulse text-muted-foreground">...</span>
          )}
        </p>
        {flag && onForward && (
          <div className="mt-3 rounded-lg border border-border bg-background/60 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {REASON_LABEL[flag.reason]}
            </p>
            <button
              type="button"
              onClick={() => onForward(flag)}
              className="mt-2 inline-flex items-center gap-2 rounded-full border-2 border-border bg-secondary px-4 py-1.5 text-sm font-bold text-secondary-foreground shadow-[2px_2px_0_var(--color-border)] transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0_var(--color-border)]"
            >
              Email Aaron about this
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
