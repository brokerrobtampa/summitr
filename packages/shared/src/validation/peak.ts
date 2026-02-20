import { z } from 'zod';

export const peakQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  country: z.string().optional(),
  range: z.string().optional(),
  minElevation: z.coerce.number().optional(),
  maxElevation: z.coerce.number().optional(),
  q: z.string().optional(),
  sort: z.enum(['elevation_asc', 'elevation_desc', 'name_asc', 'name_desc']).default('name_asc'),
});

export const peakBoundsSchema = z.object({
  north: z.coerce.number().min(-90).max(90),
  south: z.coerce.number().min(-90).max(90),
  east: z.coerce.number().min(-180).max(180),
  west: z.coerce.number().min(-180).max(180),
  limit: z.coerce.number().int().min(1).max(500).default(200),
});

export const peakNearbySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  radiusKm: z.coerce.number().min(1).max(500).default(50),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type PeakQuery = z.infer<typeof peakQuerySchema>;
export type PeakBoundsQuery = z.infer<typeof peakBoundsSchema>;
export type PeakNearbyQuery = z.infer<typeof peakNearbySchema>;
