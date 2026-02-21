import { z } from 'zod';

export const notificationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  unreadOnly: z.coerce.boolean().optional().default(false),
});

export type NotificationQueryInput = z.infer<typeof notificationQuerySchema>;

export const markReadSchema = z.object({
  ids: z.array(z.number().int().positive()).min(1).max(100).optional(),
});

export type MarkReadInput = z.infer<typeof markReadSchema>;
