export interface GuideService {
  id: number;
  peakId: number;
  name: string;
  website: string;
  description: string | null;
  priceRange: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  location: string | null;
  specialties: string[] | null;
  logoUrl: string | null;
  rating: number | null;
}

export interface GuidedPeak {
  id: number;
  name: string;
  elevation: number;
  country: string | null;
  imageUrl: string | null;
  guideServiceCount: number;
}
