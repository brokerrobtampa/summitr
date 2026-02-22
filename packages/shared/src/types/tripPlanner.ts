export interface TripPlannerFilters {
  // Peak criteria
  minElevation?: number;
  maxElevation?: number;
  country?: string;
  continent?: string;
  range?: string;

  // Route criteria
  difficulty?: string[];
  activityTypes?: string[];
  seasons?: string[];
  gradeSystem?: string;

  // Expedition logistics
  iceClimbing?: boolean;
  permitRequired?: 'any' | 'yes' | 'no';
  guidesAvailable?: boolean;

  // Route characteristics
  minDistance?: number;
  maxDistance?: number;
  minElevationGain?: number;
  maxElevationGain?: number;
  maxEstimatedTime?: number;
  commitment?: string[];

  // Text search
  q?: string;

  // Pagination & sort
  page?: number;
  limit?: number;
  sort?: TripPlannerSort;
}

export type TripPlannerSort =
  | 'elevation_desc'
  | 'elevation_asc'
  | 'rating_desc'
  | 'difficulty_asc'
  | 'difficulty_desc'
  | 'distance_asc'
  | 'distance_desc'
  | 'name_asc';

export interface TripPlannerResult {
  id: number;
  routeId: number;
  routeName: string;
  peakId: number;
  peakName: string;
  peakElevation: number;
  peakCountry: string | null;
  peakRange: string | null;
  peakImageUrl: string | null;
  peakLatitude: number;
  peakLongitude: number;

  // Route details
  difficulty: string | null;
  gradeSystem: string | null;
  activityType: string;
  summary: string | null;
  distance: number | null;
  elevationGain: number | null;
  estimatedTime: number | null;
  approachTime: number | null;
  commitment: string | null;
  season: string | null;
  hazards: string[] | null;

  // Logistics
  permitRequired: boolean;
  permitInfo: string | null;
  closestAirport: string | null;
  basecamp: string | null;

  // Community
  averageRating: number | null;
  reviewCount: number;
  hasGuideServices: boolean;
  guideServiceCount: number;
}

export interface TripPlannerResponse {
  results: TripPlannerResult[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filterCounts: {
    totalPeaks: number;
    totalRoutes: number;
    countries: string[];
    continents: string[];
  };
}

export const CONTINENTS: Record<string, string[]> = {
  'Asia': ['Nepal', 'China', 'India', 'Pakistan', 'Japan', 'Georgia', 'Kyrgyzstan', 'Tajikistan', 'Iran', 'Turkey', 'Russia', 'Indonesia', 'Malaysia', 'Philippines', 'Kazakhstan', 'Mongolia'],
  'Europe': ['France', 'Switzerland', 'Italy', 'Austria', 'Spain', 'Norway', 'Sweden', 'Iceland', 'Greece', 'United Kingdom', 'Germany', 'Poland', 'Romania', 'Slovenia', 'Montenegro', 'Albania', 'Croatia', 'Bosnia and Herzegovina'],
  'North America': ['United States', 'Canada', 'Mexico'],
  'South America': ['Argentina', 'Chile', 'Peru', 'Bolivia', 'Ecuador', 'Colombia', 'Venezuela'],
  'Africa': ['Tanzania', 'Kenya', 'Uganda', 'Morocco', 'South Africa', 'Ethiopia', 'Democratic Republic of the Congo', 'Cameroon'],
  'Oceania': ['New Zealand', 'Australia', 'Papua New Guinea'],
  'Antarctica': ['Antarctica'],
};

export const DIFFICULTY_LEVELS = [
  { value: 'easy', label: 'Easy', description: 'Well-marked trails, minimal exposure' },
  { value: 'moderate', label: 'Moderate', description: 'Some scrambling, route-finding required' },
  { value: 'difficult', label: 'Difficult', description: 'Technical climbing, ropes required' },
  { value: 'very_difficult', label: 'Very Difficult', description: 'Advanced technical skills needed' },
  { value: 'extreme', label: 'Extreme', description: 'Expert-level, serious objective hazards' },
] as const;

export const COMMITMENT_LEVELS = [
  { value: 'I', label: 'I - Day Trip', description: 'A few hours to a full day' },
  { value: 'II', label: 'II - Overnight', description: '1-2 days, one bivouac' },
  { value: 'III', label: 'III - Multi-Day', description: '2-4 days on the route' },
  { value: 'IV', label: 'IV - Extended', description: '4-7 days, significant logistics' },
  { value: 'V', label: 'V - Expedition', description: 'Week+ expedition style' },
  { value: 'VI', label: 'VI - Major Expedition', description: 'Multi-week major expedition' },
] as const;
