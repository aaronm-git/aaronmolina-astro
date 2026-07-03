/** A single message in the chat transcript, from either the user or the assistant. */
export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  leadFlag?: LeadFlag;
};

/** Signal attached to an assistant message that the conversation should be forwarded to Aaron, with a suggested reason and pre-filled email draft. */
export type LeadFlag = {
  reason: 'hiring' | 'rates' | 'scope' | 'out_of_scope';
  suggested_email_subject: string;
  suggested_email_body: string;
};

/** Server-sent event payloads streamed from `/api/chat`. */
export type StreamEvent = { type: 'text_delta'; text: string } | { type: 'lead_flag'; data: LeadFlag } | { type: 'done' } | { type: 'error'; message: string };
