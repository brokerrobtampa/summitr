// ── Guide Companies (formerly GuideService) ──────────

export interface GuideCompanySummary {
  id: number;
  name: string;
  website: string;
  description: string | null;
  priceRange: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  location: string | null;
  specialties: string[];
  logoUrl: string | null;
  rating: number | null;
  amgaAccredited: boolean;
  foundedYear: number | null;
  teamSize: string | null;
  guideCount: number;
  peakCount: number;
}

export interface GuideCompanyDetail extends GuideCompanySummary {
  insuranceInfo: string | null;
  guides: GuideSummary[];
  peaks: Array<{
    id: number;
    name: string;
    elevation: number;
    country: string | null;
    range: string | null;
    imageUrl: string | null;
  }>;
}

// ── Individual Guides ────────────────────────────────

export interface GuideSummary {
  id: number;
  firstName: string;
  lastName: string;
  photoUrl: string | null;
  certificationLevel: string | null;
  certifications: string[];
  specialties: string[];
  operatingRegions: string[];
  yearsExperience: number | null;
  bio: string | null;
  company: { id: number; name: string } | null;
}

export interface GuideDetail extends GuideSummary {
  email: string | null;
  phone: string | null;
  website: string | null;
  amgaMemberId: string | null;
  ifmgaLicenseNumber: string | null;
  routeSpecialties: Array<{
    route: { id: number; name: string; difficulty: string | null; peak: { id: number; name: string } };
    yearsGuiding: number | null;
    summitCount: number | null;
  }>;
}

// ── Peak Guide Lookup ────────────────────────────────

export interface PeakGuideData {
  companies: GuideCompanySummary[];
  guides: GuideSummary[];
}

// ── Route Guide Lookup ───────────────────────────────

export interface RouteGuideData {
  routeGuides: Array<GuideSummary & { yearsGuiding: number | null; summitCount: number | null }>;
  peakCompanies: Array<{
    id: number;
    name: string;
    website: string;
    contactEmail: string | null;
    priceRange: string | null;
    location: string | null;
  }>;
}

// ── Legacy compat (keep exports so existing imports don't break) ──

/** @deprecated Use GuideCompanySummary instead */
export interface GuideService {
  id: number;
  peakId?: number;
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
  routeCount?: number;
}
