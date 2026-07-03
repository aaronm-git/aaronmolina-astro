import type { ChatMessage as ChatMessageType, LeadFlag } from './types';

interface Props {
  message: ChatMessageType;
  onForward?: (flag: LeadFlag) => void;
}

const REASON_LABEL: Record<LeadFlag['reason'], string> = {
  hiring: 'Hiring inquiry',
  rates: 'Rates question',
  scope: 'Scope discussion',
  out_of_scope: "Outside the bot's knowledge",
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
      <div className={`border-ink shadow-hard-sm max-w-[85%] rounded-sm border-2 px-4 py-3 ${isUser ? 'bg-signal text-ink' : 'bg-paper text-ink'}`}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
          {message.content === '' && !isUser && <span className="text-graphite inline-block animate-pulse">...</span>}
        </p>
        {flag && onForward && (
          <div className="border-ink bg-concrete mt-3 rounded-sm border p-3">
            <p className="text-graphite font-mono text-xs font-semibold tracking-wide uppercase">{REASON_LABEL[flag.reason]}</p>
            <button
              type="button"
              onClick={() => onForward(flag)}
              className="border-ink bg-ink text-signal shadow-hard-sm mt-2 inline-flex items-center gap-2 rounded-sm border-2 px-4 py-1.5 text-sm font-bold transition-all hover:-translate-x-0.5 hover:-translate-y-0.5"
            >
              Email Aaron about this
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
