import { z } from 'zod';
import { ACTIVITY_TYPES } from '../constants/activity.js';
import { SEASONS } from '../constants/season.js';
import { GRADE_SYSTEMS } from '../constants/difficulty.js';

export const tripPlannerQuerySchema = z.object({
  // Peak criteria
  minElevation: z.coerce.number().optional(),
  maxElevation: z.coerce.number().optional(),
  country: z.string().optional(),
  continent: z.string().optional(),
  range: z.string().optional(),

  // Route criteria
  difficulty: z.union([z.string(), z.array(z.string())]).optional().transform((val) => {
    if (!val) return undefined;
    return Array.isArray(val) ? val : val.split(',');
  }),
  activityTypes: z.union([z.string(), z.array(z.string())]).optional().transform((val) => {
    if (!val) return undefined;
    return Array.isArray(val) ? val : val.split(',');
  }),
  seasons: z.union([z.string(), z.array(z.string())]).optional().transform((val) => {
    if (!val) return undefined;
    return Array.isArray(val) ? val : val.split(',');
  }),
  gradeSystem: z.string().optional(),

  // Expedition logistics
  iceClimbing: z.union([z.boolean(), z.string().transform((v) => v === 'true')]).optional(),
  permitRequired: z.enum(['any', 'yes', 'no']).default('any'),
  guidesAvailable: z.union([z.boolean(), z.string().transform((v) => v === 'true')]).optional(),

  // Route characteristics
  minDistance: z.coerce.number().positive().optional(),
  maxDistance: z.coerce.number().positive().optional(),
  minElevationGain: z.coerce.number().positive().optional(),
  maxElevationGain: z.coerce.number().positive().optional(),
  maxEstimatedTime: z.coerce.number().positive().optional(),
  commitment: z.union([z.string(), z.array(z.string())]).optional().transform((val) => {
    if (!val) return undefined;
    return Array.isArray(val) ? val : val.split(',');
  }),

  // Text search
  q: z.string().optional(),

  // Pagination
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),

  // Sort
  sort: z.enum([
    'elevation_desc', 'elevation_asc', 'rating_desc',
    'difficulty_asc', 'difficulty_desc',
    'distance_asc', 'distance_desc', 'name_asc',
  ]).default('elevation_desc'),
});

export type TripPlannerQuery = z.infer<typeof tripPlannerQuerySchema>;
