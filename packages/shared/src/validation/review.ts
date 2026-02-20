import { z } from 'zod';

export const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().max(200).optional(),
  body: z.string().min(10).max(5000),
  climbDate: z.string().datetime().optional(),
  conditions: z.string().max(1000).optional(),
});

export const updateReviewSchema = createReviewSchema.partial();

export const createTipSchema = z.object({
  content: z.string().min(5).max(2000),
  category: z
    .enum(['general', 'navigation', 'safety', 'camping', 'water', 'gear', 'logistics', 'timing'])
    .default('general'),
});

export const gearLinkSchema = z.object({
  retailer: z.string().min(1).max(100),
  productName: z.string().min(1).max(300),
  url: z.string().url(),
  price: z.number().positive().optional(),
});

export const createGearRecSchema = z.object({
  itemName: z.string().min(1).max(200),
  category: z
    .enum([
      'climbing',
      'clothing',
      'footwear',
      'camping',
      'safety',
      'navigation',
      'hydration',
      'protection',
      'general',
    ])
    .default('general'),
  isEssential: z.boolean().default(false),
  notes: z.string().max(1000).optional(),
  weight: z.string().max(50).optional(),
  priceRange: z.string().max(50).optional(),
  specificProduct: z.string().max(300).optional(),
  links: z.array(gearLinkSchema).optional(),
});

export const updateGearRecSchema = createGearRecSchema.partial();

export const createClimbLogSchema = z.object({
  peakId: z.number().int().positive(),
  routeId: z.number().int().positive().optional(),
  date: z.string().datetime(),
  notes: z.string().max(2000).optional(),
  conditions: z.string().max(1000).optional(),
  success: z.boolean().default(true),
  duration: z.number().positive().optional(),
  photos: z.array(z.string().url()).optional(),
  rating: z.number().int().min(1).max(5).optional(),
  isPublic: z.boolean().default(false),
  elevationGain: z.number().positive().optional(),
});

export const updateClimbLogSchema = createClimbLogSchema.partial().omit({ peakId: true });

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
export type CreateTipInput = z.infer<typeof createTipSchema>;
export type GearLinkInput = z.infer<typeof gearLinkSchema>;
export type CreateGearRecInput = z.infer<typeof createGearRecSchema>;
export type UpdateGearRecInput = z.infer<typeof updateGearRecSchema>;
export type CreateClimbLogInput = z.infer<typeof createClimbLogSchema>;
export type UpdateClimbLogInput = z.infer<typeof updateClimbLogSchema>;
