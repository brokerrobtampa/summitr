import { prisma } from '../lib/prisma.js';

// ── Guide Companies ──────────────────────────────────

export async function getGuideCompanies(query: Record<string, unknown> = {}) {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(query.limit) || 20));
  const skip = (page - 1) * limit;
  const search = (query.search as string) || '';

  const where: any = {};
  if (search) {
    where.name = { contains: search, mode: 'insensitive' };
  }

  const [companies, total] = await Promise.all([
    prisma.guideCompany.findMany({
      where,
      include: {
        _count: { select: { guides: true, peaks: true } },
      },
      orderBy: { name: 'asc' },
      skip,
      take: limit,
    }),
    prisma.guideCompany.count({ where }),
  ]);

  return {
    data: companies.map((c) => ({
      id: c.id,
      name: c.name,
      website: c.website,
      description: c.description,
      priceRange: c.priceRange,
      contactEmail: c.contactEmail,
      contactPhone: c.contactPhone,
      location: c.location,
      specialties: c.specialties ? JSON.parse(c.specialties) : [],
      logoUrl: c.logoUrl,
      rating: c.rating,
      amgaAccredited: c.amgaAccredited,
      foundedYear: c.foundedYear,
      teamSize: c.teamSize,
      guideCount: c._count.guides,
      peakCount: c._count.peaks,
    })),
    total,
    page,
    limit,
  };
}

export async function getGuideCompanyById(id: number) {
  const company = await prisma.guideCompany.findUnique({
    where: { id },
    include: {
      guides: {
        where: { isActive: true },
        orderBy: { lastName: 'asc' },
      },
      peaks: {
        include: {
          peak: {
            select: {
              id: true,
              name: true,
              elevation: true,
              country: true,
              range: true,
              imageUrl: true,
            },
          },
        },
      },
    },
  });

  if (!company) return null;

  return {
    id: company.id,
    name: company.name,
    website: company.website,
    description: company.description,
    priceRange: company.priceRange,
    contactEmail: company.contactEmail,
    contactPhone: company.contactPhone,
    location: company.location,
    specialties: company.specialties ? JSON.parse(company.specialties) : [],
    logoUrl: company.logoUrl,
    rating: company.rating,
    amgaAccredited: company.amgaAccredited,
    foundedYear: company.foundedYear,
    teamSize: company.teamSize,
    insuranceInfo: company.insuranceInfo,
    guides: company.guides.map((g) => ({
      id: g.id,
      firstName: g.firstName,
      lastName: g.lastName,
      photoUrl: g.photoUrl,
      certificationLevel: g.certificationLevel,
      specialties: g.specialties ? JSON.parse(g.specialties) : [],
      yearsExperience: g.yearsExperience,
      bio: g.bio,
    })),
    peaks: company.peaks.map((p) => p.peak),
  };
}

// ── Individual Guides ──────────────────────────────────

export async function getGuides(query: Record<string, unknown> = {}) {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(query.limit) || 20));
  const skip = (page - 1) * limit;
  const search = (query.search as string) || '';
  const certification = (query.certification as string) || '';
  const specialty = (query.specialty as string) || '';
  const region = (query.region as string) || '';

  const where: any = { isActive: true };
  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (certification) {
    where.certificationLevel = { contains: certification, mode: 'insensitive' };
  }
  if (specialty) {
    where.specialties = { contains: specialty, mode: 'insensitive' };
  }
  if (region) {
    where.operatingRegions = { contains: region, mode: 'insensitive' };
  }

  const [guides, total] = await Promise.all([
    prisma.guide.findMany({
      where,
      include: {
        guideCompany: { select: { id: true, name: true } },
      },
      orderBy: { lastName: 'asc' },
      skip,
      take: limit,
    }),
    prisma.guide.count({ where }),
  ]);

  return {
    data: guides.map((g) => ({
      id: g.id,
      firstName: g.firstName,
      lastName: g.lastName,
      photoUrl: g.photoUrl,
      certificationLevel: g.certificationLevel,
      certifications: g.certifications ? JSON.parse(g.certifications) : [],
      specialties: g.specialties ? JSON.parse(g.specialties) : [],
      operatingRegions: g.operatingRegions ? JSON.parse(g.operatingRegions) : [],
      yearsExperience: g.yearsExperience,
      bio: g.bio,
      company: g.guideCompany,
    })),
    total,
    page,
    limit,
  };
}

export async function getGuideById(id: number) {
  const guide = await prisma.guide.findUnique({
    where: { id },
    include: {
      guideCompany: true,
      routeSpecialties: {
        include: {
          route: {
            select: {
              id: true,
              name: true,
              difficulty: true,
              peak: { select: { id: true, name: true } },
            },
          },
        },
      },
    },
  });

  if (!guide) return null;

  return {
    id: guide.id,
    firstName: guide.firstName,
    lastName: guide.lastName,
    email: guide.email,
    phone: guide.phone,
    website: guide.website,
    photoUrl: guide.photoUrl,
    bio: guide.bio,
    certificationLevel: guide.certificationLevel,
    certifications: guide.certifications ? JSON.parse(guide.certifications) : [],
    specialties: guide.specialties ? JSON.parse(guide.specialties) : [],
    operatingRegions: guide.operatingRegions ? JSON.parse(guide.operatingRegions) : [],
    yearsExperience: guide.yearsExperience,
    amgaMemberId: guide.amgaMemberId,
    ifmgaLicenseNumber: guide.ifmgaLicenseNumber,
    company: guide.guideCompany
      ? {
          id: guide.guideCompany.id,
          name: guide.guideCompany.name,
          website: guide.guideCompany.website,
        }
      : null,
    routeSpecialties: guide.routeSpecialties.map((rs) => ({
      route: rs.route,
      yearsGuiding: rs.yearsGuiding,
      summitCount: rs.summitCount,
    })),
  };
}

// ── Peak/Route Guide Lookups ──────────────────────────

export async function getGuidesByPeak(peakId: number) {
  // Get guide companies for this peak
  const companies = await prisma.guideCompanyPeak.findMany({
    where: { peakId },
    include: {
      guideCompany: {
        include: {
          _count: { select: { guides: true } },
        },
      },
    },
  });

  // Get individual guides with route specialties on this peak
  const guidesWithSpecialties = await prisma.guide.findMany({
    where: {
      isActive: true,
      routeSpecialties: {
        some: { route: { peakId } },
      },
    },
    include: {
      guideCompany: { select: { id: true, name: true } },
      routeSpecialties: {
        where: { route: { peakId } },
        include: {
          route: { select: { id: true, name: true, difficulty: true } },
        },
      },
    },
  });

  return {
    companies: companies.map((c) => ({
      id: c.guideCompany.id,
      name: c.guideCompany.name,
      website: c.guideCompany.website,
      description: c.guideCompany.description,
      priceRange: c.guideCompany.priceRange,
      contactEmail: c.guideCompany.contactEmail,
      contactPhone: c.guideCompany.contactPhone,
      location: c.guideCompany.location,
      specialties: c.guideCompany.specialties ? JSON.parse(c.guideCompany.specialties) : [],
      logoUrl: c.guideCompany.logoUrl,
      rating: c.guideCompany.rating,
      guideCount: c.guideCompany._count.guides,
    })),
    guides: guidesWithSpecialties.map((g) => ({
      id: g.id,
      firstName: g.firstName,
      lastName: g.lastName,
      photoUrl: g.photoUrl,
      certificationLevel: g.certificationLevel,
      specialties: g.specialties ? JSON.parse(g.specialties) : [],
      yearsExperience: g.yearsExperience,
      company: g.guideCompany,
      routeSpecialties: g.routeSpecialties.map((rs) => ({
        route: rs.route,
        yearsGuiding: rs.yearsGuiding,
        summitCount: rs.summitCount,
      })),
    })),
  };
}

export async function getGuidesByRoute(routeId: number) {
  const specialties = await prisma.guideRouteSpecialty.findMany({
    where: { routeId },
    include: {
      guide: {
        include: {
          guideCompany: { select: { id: true, name: true, website: true } },
        },
      },
    },
  });

  // Also get companies that serve this peak
  const route = await prisma.route.findUnique({
    where: { id: routeId },
    select: { peakId: true },
  });

  const peakCompanies = route
    ? await prisma.guideCompanyPeak.findMany({
        where: { peakId: route.peakId },
        include: {
          guideCompany: {
            select: {
              id: true,
              name: true,
              website: true,
              contactEmail: true,
              priceRange: true,
              location: true,
            },
          },
        },
      })
    : [];

  return {
    routeGuides: specialties.map((s) => ({
      id: s.guide.id,
      firstName: s.guide.firstName,
      lastName: s.guide.lastName,
      photoUrl: s.guide.photoUrl,
      certificationLevel: s.guide.certificationLevel,
      specialties: s.guide.specialties ? JSON.parse(s.guide.specialties) : [],
      yearsExperience: s.guide.yearsExperience,
      company: s.guide.guideCompany,
      yearsGuiding: s.yearsGuiding,
      summitCount: s.summitCount,
    })),
    peakCompanies: peakCompanies.map((pc) => pc.guideCompany),
  };
}

// ── Legacy compatibility: getAllGuidedPeaks ──────────────

export async function getAllGuidedPeaks() {
  const peaks = await prisma.peak.findMany({
    where: { guideCompanies: { some: {} } },
    include: {
      _count: { select: { guideCompanies: true, routes: true } },
    },
    orderBy: { elevation: 'desc' },
  });

  return peaks.map((p) => ({
    id: p.id,
    name: p.name,
    latitude: p.latitude,
    longitude: p.longitude,
    elevation: p.elevation,
    country: p.country,
    range: p.range,
    imageUrl: p.imageUrl,
    guideServiceCount: p._count.guideCompanies,
    routeCount: p._count.routes,
  }));
}
