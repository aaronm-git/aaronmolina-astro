import { z } from 'zod';

export const ChatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1).max(2000),
});

export const ChatRequestSchema = z.object({
  messages: z.array(ChatMessageSchema).min(1).max(20),
  conversationId: z.uuid(),
});

export type ChatRequest = z.infer<typeof ChatRequestSchema>;
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

export const LeadFlagReasonSchema = z.enum(['hiring', 'rates', 'scope', 'out_of_scope']);

export const LeadFlagInputSchema = z.object({
  reason: LeadFlagReasonSchema,
  suggested_email_subject: z.string().min(1).max(120),
  suggested_email_body: z.string().min(1).max(2000),
});

export type LeadFlagInput = z.infer<typeof LeadFlagInputSchema>;

export const LeadRequestSchema = z.object({
  visitorEmail: z.email().max(254),
  visitorName: z.string().max(120).optional(),
  subject: z.string().min(1).max(200),
  body: z.string().min(1).max(4000),
  conversationId: z.uuid(),
});

export type LeadRequest = z.infer<typeof LeadRequestSchema>;

export const ChatStreamEventSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('text_delta'), text: z.string() }),
  z.object({ type: z.literal('lead_flag'), data: LeadFlagInputSchema }),
  z.object({ type: z.literal('done') }),
  z.object({ type: z.literal('error'), message: z.string() }),
]);

export type ChatStreamEvent = z.infer<typeof ChatStreamEventSchema>;
