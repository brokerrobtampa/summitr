import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LoadingSpinner } from '../components/ui/LoadingSpinner.js';
import type { GuidedPeak } from '@summit/shared';
import * as guidesApi from '../api/guides.api.js';

export function GuidedPeaksPage() {
  const [peaks, setPeaks] = useState<GuidedPeak[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    guidesApi
      .getGuidedPeaks()
      .then((res) => setPeaks(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-peak-blue">Home</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Guided Peaks</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Guided Peaks</h1>
        <p className="text-gray-500 mt-1">
          Peaks with professional guide services — find experienced guides to help you summit safely
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
      ) : peaks.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <p className="text-gray-500 text-lg">No guided peaks available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {peaks.map((peak) => (
            <Link
              key={peak.id}
              to={`/peaks/${peak.id}`}
              className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all hover:-translate-y-0.5"
            >
              {peak.imageUrl ? (
                <div className="h-36 overflow-hidden">
                  <img
                    src={peak.imageUrl}
                    alt={peak.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="h-36 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <svg className="w-12 h-12 text-white/60" fill="currentColor" viewBox="0 0 24 24">
                    <polygon points="12,2 22,20 2,20" />
                  </svg>
                </div>
              )}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 group-hover:text-peak-blue transition-colors">
                  {peak.name}
                </h3>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-peak-blue font-medium">{peak.elevation.toLocaleString()}m</span>
                  <span className="text-xs text-gray-500">{peak.country}</span>
                </div>
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                    {peak.guideServiceCount} {peak.guideServiceCount === 1 ? 'guide' : 'guides'}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
