import { z } from 'zod';
import { ACTIVITY_TYPES, WAYPOINT_TYPES } from '../constants/activity.js';
import { GRADE_SYSTEMS } from '../constants/difficulty.js';
import { SEASONS } from '../constants/season.js';

const waypointSchema = z.object({
  orderIndex: z.number().int().min(0),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  elevation: z.number().optional(),
  name: z.string().max(200).optional(),
  description: z.string().max(1000).optional(),
  waypointType: z.enum(WAYPOINT_TYPES).default('waypoint'),
});

const geoJsonLineStringSchema = z.object({
  type: z.literal('LineString'),
  coordinates: z.array(z.tuple([z.number(), z.number()]).or(z.tuple([z.number(), z.number(), z.number()]))).min(2),
});

export const createRouteSchema = z.object({
  name: z.string().min(1).max(200),
  peakId: z.number().int().positive(),
  difficulty: z.string().max(20).optional(),
  gradeSystem: z.enum(GRADE_SYSTEMS).optional(),
  activityType: z.enum(ACTIVITY_TYPES).default('alpine'),
  description: z.string().max(10000).optional(),
  summary: z.string().max(500).optional(),
  imageUrl: z.string().url().optional(),
  technicalGrade: z.string().max(50).optional(),
  commitment: z.string().max(10).optional(),
  distance: z.number().positive().optional(),
  elevationGain: z.number().positive().optional(),
  estimatedTime: z.number().positive().optional(),
  approachTime: z.number().positive().optional(),
  descentTime: z.number().positive().optional(),
  basecamp: z.string().max(500).optional(),
  season: z.enum(SEASONS).optional(),
  hazards: z.array(z.string().max(500)).optional(),
  safetyNotes: z.string().max(5000).optional(),
  permitRequired: z.boolean().default(false),
  permitInfo: z.string().max(2000).optional(),
  closestAirport: z.string().max(200).optional(),
  geoJson: geoJsonLineStringSchema.optional(),
  waypoints: z.array(waypointSchema).optional(),
  isPublic: z.boolean().default(true),
});

export const updateRouteSchema = createRouteSchema.partial().omit({ peakId: true });

export const routeQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  peakId: z.coerce.number().int().positive().optional(),
  activityType: z.enum(ACTIVITY_TYPES).optional(),
  difficulty: z.string().optional(),
  sort: z
    .enum(['newest', 'oldest', 'rating', 'difficulty'])
    .default('newest'),
});

export type CreateRouteInput = z.infer<typeof createRouteSchema>;
export type UpdateRouteInput = z.infer<typeof updateRouteSchema>;
export type RouteQuery = z.infer<typeof routeQuerySchema>;
