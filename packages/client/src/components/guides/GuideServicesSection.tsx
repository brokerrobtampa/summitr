import { useState, useEffect } from 'react';
import { GuideServiceCard } from './GuideServiceCard.js';
import * as guidesApi from '../../api/guides.api.js';
import type { GuideService } from '@summit/shared';

export function GuideServicesSection({ peakId }: { peakId: number }) {
  const [guides, setGuides] = useState<GuideService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    guidesApi
      .getGuideServices(peakId)
      .then((res) => setGuides(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [peakId]);

  if (loading || guides.length === 0) return null;

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">🏔️</span>
        <h2 className="text-xl font-semibold text-gray-900">Guide Services</h2>
        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
          {guides.length} available
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {guides.map((g) => (
          <GuideServiceCard key={g.id} guide={g} />
        ))}
      </div>
    </div>
  );
}
