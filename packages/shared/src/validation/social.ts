import { z } from 'zod';

export const createCommentSchema = z.object({
  body: z.string().min(1, 'Comment cannot be empty').max(2000, 'Comment too long'),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;

export const feedQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export type FeedQueryInput = z.infer<typeof feedQuerySchema>;
