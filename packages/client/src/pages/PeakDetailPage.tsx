import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapContainer } from '../components/map/MapContainer.js';
import { RouteCard } from '../components/routes/RouteCard.js';
import { LoadingSpinner } from '../components/ui/LoadingSpinner.js';
import { PermitInfo } from '../components/routes/PermitInfo.js';
import { AirportInfo } from '../components/routes/AirportInfo.js';
import { GuideServicesSection } from '../components/guides/GuideServicesSection.js';
import { usePeakCategory } from '../hooks/useForums.js';
import type { PeakDetail, RouteSummary } from '@summit/shared';
import * as peaksApi from '../api/peaks.api.js';

export function PeakDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [peak, setPeak] = useState<PeakDetail | null>(null);
  const [routes, setRoutes] = useState<RouteSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: peakCategoryData } = usePeakCategory(peak?.id ?? 0);
  const peakCategory = peakCategoryData?.data;

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      peaksApi.getPeak(parseInt(id, 10)),
      peaksApi.getPeakRoutes(parseInt(id, 10)),
    ])
      .then(([peakRes, routesRes]) => {
        setPeak(peakRes.data);
        setRoutes(routesRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner size="lg" />;
  if (!peak) return <div className="p-8 text-center text-gray-500">Peak not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link to="/" className="hover:text-peak-blue">Home</Link>
        <span>/</span>
        <Link to="/peaks" className="hover:text-peak-blue">Peaks</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate max-w-[200px]">{peak.name}</span>
      </nav>

      {/* Hero Image */}
      {peak.imageUrl && (
        <div className="relative h-64 md:h-80 rounded-xl overflow-hidden mb-6">
          <img
            src={peak.imageUrl}
            alt={peak.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-white">{peak.name}</h1>
              {peak.hasGuideServices && (
                <span className="text-xs font-semibold bg-green-500 text-white px-2.5 py-1 rounded-full">
                  🏔️ Guided
                </span>
              )}
            </div>
            {peak.alternateNames && peak.alternateNames.length > 0 && (
              <p className="text-white/70 mt-1">Also known as: {peak.alternateNames.join(', ')}</p>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left panel — peak info + routes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title (if no hero image) */}
          {!peak.imageUrl && (
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{peak.name}</h1>
              {peak.alternateNames && peak.alternateNames.length > 0 && (
                <p className="text-gray-500 mt-1">Also known as: {peak.alternateNames.join(', ')}</p>
              )}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-500">Elevation</div>
              <div className="text-lg font-bold text-peak-blue">{peak.elevation.toLocaleString()}m</div>
            </div>
            {peak.prominence && (
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-xs text-gray-500">Prominence</div>
                <div className="text-lg font-bold text-gray-700">{peak.prominence.toLocaleString()}m</div>
              </div>
            )}
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-500">Country</div>
              <div className="text-lg font-bold text-gray-700">{peak.country || 'Unknown'}</div>
            </div>
            {peak.range && (
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-xs text-gray-500">Range</div>
                <div className="text-lg font-bold text-gray-700">{peak.range}</div>
              </div>
            )}
          </div>

          {/* Best Months */}
          {peak.bestMonths && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">📅 Best months:</span>
              <span className="font-medium text-gray-700">{peak.bestMonths}</span>
            </div>
          )}

          {/* Description */}
          {peak.description && (
            <p className="text-gray-600 leading-relaxed">{peak.description}</p>
          )}

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PermitInfo
              permitRequired={peak.permitRequired || false}
              permitInfo={peak.permitInfo || null}
            />
            <AirportInfo
              closestAirport={peak.closestAirport || null}
              closestAirportDistance={peak.closestAirportDistance || null}
            />
          </div>

          {/* Guide Services */}
          {peak.hasGuideServices && (
            <GuideServicesSection peakId={peak.id} />
          )}

          {/* Routes */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Routes ({routes.length})
              </h2>
              <Link
                to="/routes/new"
                className="text-peak-blue hover:underline text-sm font-medium"
              >
                + Add Route
              </Link>
            </div>
            {routes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {routes.map((r) => (
                  <RouteCard key={r.id} route={r} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8 bg-gray-50 rounded-lg">
                No routes yet. Be the first to add one!
              </p>
            )}
          </div>

          {/* Discussions */}
          {peakCategory && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Discussions</h2>
                <Link
                  to={`/forums/${peakCategory.slug}`}
                  className="text-peak-blue hover:underline text-sm font-medium"
                >
                  View All →
                </Link>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-gray-600 text-sm mb-2">
                  Join the conversation about {peak.name}
                </p>
                <Link
                  to={`/forums/${peakCategory.slug}`}
                  className="inline-flex items-center gap-2 text-peak-blue hover:underline text-sm font-medium"
                >
                  💬 {peakCategory.threadCount} {peakCategory.threadCount === 1 ? 'thread' : 'threads'}
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Right panel — map */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 space-y-4">
            <div className="rounded-lg overflow-hidden border border-gray-200 h-[400px]">
              <MapContainer
                center={[peak.longitude, peak.latitude]}
                zoom={12}
                terrain={true}
              />
            </div>
            <div className="text-xs text-gray-400 text-center">
              {peak.latitude.toFixed(4)}, {peak.longitude.toFixed(4)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
