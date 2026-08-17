/** A single message in the chat transcript, from either the user or the assistant. */
export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};
