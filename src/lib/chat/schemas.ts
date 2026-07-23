import { z } from 'zod';

export const ChatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().trim().min(1).max(600),
});

export const ChatRequestSchema = z.object({
  messages: z.array(ChatMessageSchema).min(1).max(12),
  conversationId: z.uuid(),
}).superRefine((value, context) => {
  const userMessages = value.messages.filter(message => message.role === 'user');

  if (userMessages.length > 6) {
    context.addIssue({
      code: 'custom',
      message: 'A conversation can contain at most six visitor messages.',
      path: ['messages'],
    });
  }

  if (value.messages.at(-1)?.role !== 'user') {
    context.addIssue({
      code: 'custom',
      message: 'The final message must come from the visitor.',
      path: ['messages'],
    });
  }
});

export type ChatRequest = z.infer<typeof ChatRequestSchema>;
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

export const ChatErrorResponseSchema = z.object({
  error: z.string(),
});

export const ChatStreamEventSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('text_delta'), text: z.string() }),
  z.object({ type: z.literal('done') }),
  z.object({ type: z.literal('error'), message: z.string() }),
]);

export type ChatStreamEvent = z.infer<typeof ChatStreamEventSchema>;
