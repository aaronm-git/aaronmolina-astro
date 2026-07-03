export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  leadFlag?: LeadFlag;
};

export type LeadFlag = {
  reason: 'hiring' | 'rates' | 'scope' | 'out_of_scope';
  suggested_email_subject: string;
  suggested_email_body: string;
};

export type StreamEvent =
  | { type: 'text_delta'; text: string }
  | { type: 'lead_flag'; data: LeadFlag }
  | { type: 'done' }
  | { type: 'error'; message: string };
