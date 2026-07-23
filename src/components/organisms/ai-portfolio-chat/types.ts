/** A single message in the chat transcript, from either the user or the assistant. */
export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

/** Server-sent event payloads streamed from `/api/chat`. */
export type StreamEvent =
  | { type: 'text_delta'; text: string }
  | { type: 'done' }
  | { type: 'error'; message: string };
