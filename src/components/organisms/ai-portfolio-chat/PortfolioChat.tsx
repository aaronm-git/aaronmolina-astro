import { useCallback, useEffect, useRef, useState } from 'react';
import ChatMessage from './ChatMessage';
import SuggestedPrompts from './SuggestedPrompts';
import LeadCaptureModal from './LeadCaptureModal';
import SystemPromptModal from './SystemPromptModal';
import type { ChatMessage as ChatMessageType, LeadFlag, StreamEvent } from './types';

const MAX_USER_TURNS = 10;
const MAX_INPUT_LENGTH = 1000;

function makeId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/**
 * Root chat island — owns all conversation state, POSTs to `/api/chat` and
 * streams the SSE response (text deltas and lead flags) into the message
 * list, enforces a per-conversation turn limit, and renders the message
 * list, suggested prompts, the lead-capture modal, and the system-prompt
 * transparency modal.
 */
export default function PortfolioChat() {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [leadOpen, setLeadOpen] = useState(false);
  const [activeLead, setActiveLead] = useState<LeadFlag | null>(null);
  const [promptOpen, setPromptOpen] = useState(false);

  const conversationIdRef = useRef<string>(makeId());
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const userTurnsUsed = messages.filter(m => m.role === 'user').length;
  const limitReached = userTurnsUsed >= MAX_USER_TURNS;

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || streaming || limitReached) return;

      setError(null);

      const userMsg: ChatMessageType = {
        id: makeId(),
        role: 'user',
        content: trimmed.slice(0, MAX_INPUT_LENGTH),
      };
      const assistantId = makeId();
      const assistantMsg: ChatMessageType = {
        id: assistantId,
        role: 'assistant',
        content: '',
      };

      const nextMessages = [...messages, userMsg, assistantMsg];
      setMessages(nextMessages);
      setInput('');
      setStreaming(true);

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conversationId: conversationIdRef.current,
            messages: [...messages, userMsg].map(m => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(data?.error || 'Chat is unavailable. Please try again later.');
          setMessages(prev => prev.filter(m => m.id !== assistantId));
          return;
        }
        if (!res.body) {
          setError('Streaming not supported in this browser.');
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const events = buffer.split('\n\n');
          buffer = events.pop() ?? '';

          for (const raw of events) {
            const line = raw.trim();
            if (!line.startsWith('data:')) continue;
            const payload = line.slice(5).trim();
            if (!payload) continue;
            let event: StreamEvent;
            try {
              event = JSON.parse(payload) as StreamEvent;
            } catch {
              continue;
            }

            if (event.type === 'text_delta') {
              setMessages(prev => prev.map(m => (m.id === assistantId ? { ...m, content: m.content + event.text } : m)));
            } else if (event.type === 'lead_flag') {
              setMessages(prev => prev.map(m => (m.id === assistantId ? { ...m, leadFlag: event.data } : m)));
            } else if (event.type === 'error') {
              setError(event.message);
            }
          }
        }
      } catch (err) {
        console.error(err);
        setError('Connection lost. Please try again.');
      } finally {
        setStreaming(false);
      }
    },
    [messages, streaming, limitReached],
  );

  function handleForward(flag: LeadFlag) {
    setActiveLead(flag);
    setLeadOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="border-ink bg-paper shadow-hard overflow-hidden rounded-md border-2">
        <div className="border-ink bg-concrete-2 flex items-center justify-between border-b-2 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="bg-signal inline-block h-2 w-2 rounded-full" aria-hidden />
            <p className="text-ink font-mono text-xs font-bold tracking-wide uppercase">Ask my portfolio anything</p>
          </div>
          <div className="text-graphite flex items-center gap-3 text-xs">
            <span>Powered by Claude</span>
            <button type="button" onClick={() => setPromptOpen(true)} className="text-signal-deep font-semibold underline-offset-2 hover:underline">
              See system prompt
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="max-h-[420px] min-h-[280px] space-y-3 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="space-y-4">
              <p className="text-graphite text-sm">Hi, I'm Aaron's portfolio assistant. Ask about his projects, experience, stack, or availability.</p>
              <SuggestedPrompts onPick={prompt => sendMessage(prompt)} />
            </div>
          ) : (
            messages.map(m => <ChatMessage key={m.id} message={m} onForward={handleForward} />)
          )}
          {error && <p className="border-amber bg-amber/10 text-ink rounded-sm border-2 p-3 text-sm">{error}</p>}
        </div>

        <form onSubmit={handleSubmit} className="border-ink bg-concrete flex items-center gap-2 border-t-2 p-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={limitReached ? 'Conversation limit reached. Email aaron@pagelyft.studio.' : 'Type your question...'}
            disabled={streaming || limitReached}
            maxLength={MAX_INPUT_LENGTH}
            className="border-ink bg-paper text-ink placeholder:text-graphite focus-visible:outline-signal flex-1 rounded-sm border-2 px-4 py-2 text-sm focus-visible:outline-3 focus-visible:outline-offset-2 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={streaming || limitReached || !input.trim()}
            className="border-ink bg-signal text-ink shadow-hard-sm rounded-sm border-2 px-5 py-2 text-sm font-bold transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--color-ink)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {streaming ? '...' : 'Send'}
          </button>
        </form>
      </div>

      <LeadCaptureModal
        open={leadOpen}
        flag={activeLead}
        conversationId={conversationIdRef.current}
        onClose={() => setLeadOpen(false)}
        onSubmitted={() => {
          setActiveLead(null);
        }}
      />

      <SystemPromptModal open={promptOpen} onClose={() => setPromptOpen(false)} />
    </div>
  );
}
