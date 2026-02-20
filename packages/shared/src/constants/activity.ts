export const ACTIVITY_TYPES = ['alpine', 'rock', 'ice', 'ski', 'scramble', 'hike'] as const;
export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export const WAYPOINT_TYPES = [
  'trailhead',
  'camp',
  'crux',
  'summit',
  'waypoint',
  'water',
  'bivy',
] as const;
export type WaypointType = (typeof WAYPOINT_TYPES)[number];
