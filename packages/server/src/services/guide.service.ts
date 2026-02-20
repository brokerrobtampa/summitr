import { prisma } from '../lib/prisma.js';

export async function getGuideServicesByPeak(peakId: number) {
  const services = await prisma.guideService.findMany({
    where: { peakId },
    orderBy: { name: 'asc' },
  });

  return services.map((s) => ({
    id: s.id,
    peakId: s.peakId,
    name: s.name,
    website: s.website,
    description: s.description,
    priceRange: s.priceRange,
    contactEmail: s.contactEmail,
    contactPhone: s.contactPhone,
    location: s.location,
    specialties: s.specialties ? JSON.parse(s.specialties) : [],
    logoUrl: s.logoUrl,
    rating: s.rating,
  }));
}

export async function getAllGuidedPeaks() {
  const peaks = await prisma.peak.findMany({
    where: { guideServices: { some: {} } },
    include: {
      _count: { select: { guideServices: true, routes: true } },
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
    guideServiceCount: p._count.guideServices,
    routeCount: p._count.routes,
  }));
}
