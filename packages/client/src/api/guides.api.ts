import { api } from './client.js';

// ── Individual Guides ──────────────────────────

export async function getGuides(params: Record<string, string | number> = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => query.set(k, String(v)));
  return api.get<any>(`/guides?${query.toString()}`);
}

export async function getGuide(id: number) {
  return api.get<any>(`/guides/${id}`);
}

// ── Guide Companies ────────────────────────────

export async function getGuideCompanies(params: Record<string, string | number> = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => query.set(k, String(v)));
  return api.get<any>(`/guides/companies?${query.toString()}`);
}

export async function getGuideCompany(id: number) {
  return api.get<any>(`/guides/companies/${id}`);
}

// ── Peak/Route Lookups ─────────────────────────

export async function getGuidedPeaks() {
  return api.get<any>('/guides/peaks');
}

export async function getGuidesByPeak(peakId: number) {
  return api.get<any>(`/guides/peaks/${peakId}`);
}

export async function getGuidesByRoute(routeId: number) {
  return api.get<any>(`/guides/routes/${routeId}`);
}
