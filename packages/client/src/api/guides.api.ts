import { api } from './client.js';
import type { GuideService, GuidedPeak } from '@summit/shared';

export async function getGuideServices(peakId: number) {
  return api.get<{ data: GuideService[] }>(`/guides/peaks/${peakId}`);
}

export async function getGuidedPeaks() {
  return api.get<{ data: GuidedPeak[] }>('/guides/peaks');
}
