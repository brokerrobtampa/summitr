export interface Peak {
  id: number;
  name: string;
  alternateNames: string[] | null;
  latitude: number;
  longitude: number;
  elevation: number;
  prominence: number | null;
  country: string | null;
  region: string | null;
  range: string | null;
  description: string | null;
  imageUrl: string | null;
  closestAirport: string | null;
  closestAirportDistance: string | null;
  permitRequired: boolean;
  permitInfo: string | null;
  bestMonths: string | null;
  osmId: string | null;
  source: string;
  createdAt: string;
  updatedAt: string;
}

export interface PeakSummary {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation: number;
  country: string | null;
  range: string | null;
  routeCount: number;
  imageUrl: string | null;
}

export interface PeakDetail extends Peak {
  routeCount: number;
  averageRating: number | null;
  guideServices: import('./guide.js').GuideCompanySummary[];
  hasGuideServices: boolean;
}
