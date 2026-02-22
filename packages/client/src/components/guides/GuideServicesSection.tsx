import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GuideServiceCard } from './GuideServiceCard.js';
import * as guidesApi from '../../api/guides.api.js';

export function GuideServicesSection({ peakId }: { peakId: number }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    guidesApi
      .getGuidesByPeak(peakId)
      .then((res) => setData(res.data || null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [peakId]);

  const companies = data?.companies || [];
  const guides = data?.guides || [];
  const hasContent = companies.length > 0 || guides.length > 0;

  if (loading || !hasContent) return null;

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Guide Services</h2>
        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
          {companies.length} {companies.length === 1 ? 'company' : 'companies'}
        </span>
        <Link to="/guides" className="ml-auto text-sm text-blue-600 hover:underline">
          View all guides
        </Link>
      </div>

      {/* Companies */}
      {companies.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {companies.map((c: any) => (
            <GuideServiceCard key={c.id} guide={c} />
          ))}
        </div>
      )}

      {/* Individual Guides for this peak */}
      {guides.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Individual Guides</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {guides.map((g: any) => (
              <Link
                key={g.id}
                to={`/guides/${g.id}`}
                className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow"
              >
                <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-semibold text-xs shrink-0">
                  {g.firstName?.[0]}{g.lastName?.[0]}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">{g.firstName} {g.lastName}</p>
                  {g.certificationLevel && (
                    <p className="text-xs text-blue-600 truncate">{g.certificationLevel}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
