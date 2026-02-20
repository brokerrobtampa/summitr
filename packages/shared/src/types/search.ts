import type { PeakSummary } from './peak.js';
import type { RouteSummary } from './route.js';
import type { PublicUser } from './user.js';

export type SearchResultType = 'peak' | 'route' | 'review' | 'user' | 'all';

export interface SearchFilters {
  q: string;
  type?: SearchResultType;
  page?: number;
  limit?: number;
}

export interface SearchResults {
  peaks: PeakSummary[];
  routes: RouteSummary[];
  reviews: SearchReviewResult[];
  users: PublicUser[];
}

export interface SearchReviewResult {
  id: number;
  routeId: number;
  routeName: string;
  peakName: string;
  snippet: string;
  rating: number;
  authorUsername: string;
}

export interface AutocompleteResult {
  type: 'peak' | 'route';
  id: number;
  name: string;
  subtitle: string;
}
