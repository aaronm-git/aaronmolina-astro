import { MarkdownText } from '@/components/atoms';
import type { ChatMessage as ChatMessageType } from './types';

interface Props {
  /** The message to render, including its role and text content. */
  message: ChatMessageType;
}

/**
 * Renders a single chat message bubble, styled differently for user vs.
 * assistant. Shows a pulsing placeholder while an empty assistant message
 * is still streaming in from the parent.
 */
export default function ChatMessage({ message }: Props) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`border-ink shadow-hard-sm max-w-[85%] rounded-sm border-2 px-4 py-3 ${isUser ? 'bg-signal text-ink' : 'bg-paper text-ink'}`}>
        <div className="text-sm leading-relaxed">
          <MarkdownText>{message.content}</MarkdownText>
          {message.content === '' && !isUser && <span className="text-graphite inline-block animate-pulse">...</span>}
        </div>
      </div>
    </div>
  );
}
