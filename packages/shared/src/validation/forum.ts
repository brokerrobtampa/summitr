import { z } from 'zod';

export const createThreadSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title too long'),
  body: z.string().min(10, 'Body must be at least 10 characters').max(10000, 'Body too long'),
});

export type CreateThreadInput = z.infer<typeof createThreadSchema>;

export const createReplySchema = z.object({
  body: z.string().min(1, 'Reply cannot be empty').max(5000, 'Reply too long'),
  parentReplyId: z.number().int().positive().optional(),
});

export type CreateReplyInput = z.infer<typeof createReplySchema>;

export const forumQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export type ForumQueryInput = z.infer<typeof forumQuerySchema>;
