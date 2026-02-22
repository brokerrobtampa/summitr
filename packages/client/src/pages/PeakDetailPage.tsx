import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import maplibregl from 'maplibre-gl';
import { MapContainer } from '../components/map/MapContainer.js';
import { RouteCard } from '../components/routes/RouteCard.js';
import { LoadingSpinner } from '../components/ui/LoadingSpinner.js';
import { PermitInfo } from '../components/routes/PermitInfo.js';
import { AirportInfo } from '../components/routes/AirportInfo.js';
import { GuideServicesSection } from '../components/guides/GuideServicesSection.js';
import { usePeakCategory } from '../hooks/useForums.js';
import type { PeakDetail, RouteSummary, RouteGeo, GeoJSONLineString } from '@summit/shared';
import * as peaksApi from '../api/peaks.api.js';

const ROUTE_COLORS = ['#ff4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export function PeakDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [peak, setPeak] = useState<PeakDetail | null>(null);
  const [routes, setRoutes] = useState<RouteSummary[]>([]);
  const [routeGeos, setRouteGeos] = useState<RouteGeo[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: peakCategoryData } = usePeakCategory(peak?.id ?? 0);
  const peakCategory = peakCategoryData?.data;
  const mapInstanceRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!id) return;
    const peakId = parseInt(id, 10);
    setLoading(true);
    Promise.all([
      peaksApi.getPeak(peakId),
      peaksApi.getPeakRoutes(peakId),
      peaksApi.getPeakRouteGeometries(peakId),
    ])
      .then(([peakRes, routesRes, geoRes]) => {
        setPeak(peakRes.data);
        setRoutes(routesRes.data);
        setRouteGeos(geoRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const addOverlays = useCallback(
    (map: maplibregl.Map) => {
      if (!peak) return;

      // Add summit marker
      const summitEl = document.createElement('div');
      summitEl.style.cssText =
        'width:20px;height:20px;background:#ef4444;border:3px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.5);cursor:pointer;';

      new maplibregl.Marker({ element: summitEl })
        .setLngLat([peak.longitude, peak.latitude])
        .setPopup(
          new maplibregl.Popup({ offset: 12, closeButton: false }).setHTML(
            `<div style="font-size:13px;"><strong>${peak.name}</strong><br/><span style="color:#2563eb;font-weight:600;">${peak.elevation.toLocaleString()}m</span></div>`,
          ),
        )
        .addTo(map);

      // Add route lines
      const bounds = new maplibregl.LngLatBounds();
      bounds.extend([peak.longitude, peak.latitude]);

      routeGeos.forEach((routeGeo, index) => {
        if (!routeGeo.geoJson) return;

        const geoJson: GeoJSONLineString =
          typeof routeGeo.geoJson === 'string'
            ? JSON.parse(routeGeo.geoJson as unknown as string)
            : routeGeo.geoJson;

        const color = ROUTE_COLORS[index % ROUTE_COLORS.length];
        const sourceId = `route-${routeGeo.id}`;

        // Extend bounds to include this route
        for (const coord of geoJson.coordinates) {
          bounds.extend([coord[0], coord[1]]);
        }

        map.addSource(sourceId, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: geoJson,
          },
        });

        // White glow for visibility on satellite
        map.addLayer({
          id: `${sourceId}-glow`,
          type: 'line',
          source: sourceId,
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: { 'line-color': '#ffffff', 'line-width': 6, 'line-opacity': 0.5 },
        });

        // Colored route line
        map.addLayer({
          id: `${sourceId}-line`,
          type: 'line',
          source: sourceId,
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: { 'line-color': color, 'line-width': 3.5 },
        });

        // Click handler for route popup
        map.on('click', `${sourceId}-line`, (e) => {
          if (!e.lngLat) return;
          new maplibregl.Popup({ closeButton: false })
            .setLngLat(e.lngLat)
            .setHTML(
              `<div style="font-size:13px;">
                <strong>${routeGeo.name}</strong>
                ${routeGeo.difficulty ? `<br/><span style="color:#666;">${routeGeo.difficulty}</span>` : ''}
                <br/><a href="/routes/${routeGeo.id}" style="color:#2563eb;font-size:12px;">View route →</a>
              </div>`,
            )
            .addTo(map);
        });

        // Cursor change on hover
        map.on('mouseenter', `${sourceId}-line`, () => {
          map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', `${sourceId}-line`, () => {
          map.getCanvas().style.cursor = '';
        });
      });

      // Fit bounds to include all routes + peak
      if (routeGeos.some((r) => r.geoJson)) {
        map.fitBounds(bounds, { padding: 50, maxZoom: 14 });
      }
    },
    [peak, routeGeos],
  );

  const handleMapReady = useCallback(
    (map: maplibregl.Map) => {
      mapInstanceRef.current = map;
      addOverlays(map);

      // Re-add overlays when style changes (layer toggle)
      map.on('style.load', () => {
        addOverlays(map);
      });
    },
    [addOverlays],
  );

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

          {/* Route Legend (if routes with geo exist) */}
          {routeGeos.length > 0 && (
            <div className="flex flex-wrap gap-3 text-xs">
              {routeGeos.map((rg, i) => (
                <Link
                  key={rg.id}
                  to={`/routes/${rg.id}`}
                  className="flex items-center gap-1.5 hover:underline"
                >
                  <span
                    className="w-3 h-3 rounded-full inline-block border border-white shadow-sm"
                    style={{ backgroundColor: ROUTE_COLORS[i % ROUTE_COLORS.length] }}
                  />
                  <span className="text-gray-600">{rg.name}</span>
                </Link>
              ))}
            </div>
          )}

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
                defaultLayer="satellite"
                onMapReady={handleMapReady}
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
