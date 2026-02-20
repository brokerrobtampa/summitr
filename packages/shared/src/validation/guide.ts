import { z } from 'zod';

export const guideServiceQuerySchema = z.object({
  peakId: z.coerce.number().int().positive(),
});

export type GuideServiceQueryInput = z.infer<typeof guideServiceQuerySchema>;
