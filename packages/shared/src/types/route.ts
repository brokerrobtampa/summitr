import type { PublicUser } from './user.js';

export interface Route {
  id: number;
  name: string;
  peakId: number;
  authorId: number;
  difficulty: string | null;
  gradeSystem: string | null;
  activityType: string;
  description: string | null;
  summary: string | null;
  imageUrl: string | null;
  technicalGrade: string | null;
  commitment: string | null;
  distance: number | null;
  elevationGain: number | null;
  estimatedTime: number | null;
  approachTime: number | null;
  descentTime: number | null;
  basecamp: string | null;
  season: string | null;
  hazards: string[] | null;
  safetyNotes: string | null;
  permitRequired: boolean;
  permitInfo: string | null;
  closestAirport: string | null;
  geoJson: GeoJSONLineString | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RouteDetail extends Route {
  author: PublicUser;
  peakName: string;
  peakElevation: number;
  peakImageUrl: string | null;
  waypoints: Waypoint[];
  reviewCount: number;
  averageRating: number | null;
  isSaved?: boolean;
}

export interface RouteSummary {
  id: number;
  name: string;
  peakId: number;
  peakName: string;
  difficulty: string | null;
  gradeSystem: string | null;
  activityType: string;
  summary: string | null;
  imageUrl: string | null;
  elevationGain: number | null;
  estimatedTime: number | null;
  reviewCount: number;
  averageRating: number | null;
  authorUsername: string;
}

export interface Waypoint {
  id: number;
  routeId: number;
  orderIndex: number;
  latitude: number;
  longitude: number;
  elevation: number | null;
  name: string | null;
  description: string | null;
  waypointType: string;
}

export interface GeoJSONLineString {
  type: 'LineString';
  coordinates: ([number, number] | [number, number, number])[];
}

export interface RouteGeo {
  id: number;
  name: string;
  difficulty: string | null;
  geoJson: GeoJSONLineString | null;
}

export interface CreateWaypointInput {
  orderIndex: number;
  latitude: number;
  longitude: number;
  elevation?: number;
  name?: string;
  description?: string;
  waypointType?: string;
}
