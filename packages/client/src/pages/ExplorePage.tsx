import { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import maplibregl from 'maplibre-gl';
import { MapContainer } from '../components/map/MapContainer.js';
import * as peaksApi from '../api/peaks.api.js';
import type { PeakSummary } from '@summit/shared';

export function ExplorePage() {
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const [peaks, setPeaks] = useState<PeakSummary[]>([]);
  const [filters, setFilters] = useState({ minElevation: '', country: '' });
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const loadPeaks = useCallback(
    async (bounds: { north: number; south: number; east: number; west: number }) => {
      try {
        const res = await peaksApi.getPeaksByBounds(bounds);
        setPeaks(res.data);
        updateMarkers(res.data);
      } catch {
        // silent fail
      }
    },
    [],
  );

  const updateMarkers = (peakList: PeakSummary[]) => {
    const map = mapRef.current;
    if (!map) return;

    // Remove old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Add new markers
    peakList.forEach((peak) => {
      const el = document.createElement('div');
      el.className = 'peak-marker';
      el.style.cssText =
        'width:12px;height:12px;background:#2563eb;border:2px solid white;border-radius:50%;cursor:pointer;box-shadow:0 1px 3px rgba(0,0,0,0.3);';

      const popup = new maplibregl.Popup({ offset: 10, closeButton: false }).setHTML(`
        <div style="font-size:13px;max-width:200px;">
          <strong>${peak.name}</strong><br/>
          <span style="color:#2563eb;font-weight:600;">${peak.elevation.toLocaleString()}m</span>
          ${peak.country ? `<br/><span style="color:#666;">${peak.country}</span>` : ''}
          ${peak.range ? `<br/><span style="color:#999;font-size:11px;">${peak.range}</span>` : ''}
          <br/><a href="/peaks/${peak.id}" style="color:#2563eb;font-size:12px;">View details →</a>
        </div>
      `);

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([peak.longitude, peak.latitude])
        .setPopup(popup)
        .addTo(map);

      markersRef.current.push(marker);
    });
  };

  return (
    <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 57px)' }}>
      {/* Sidebar */}
      {sidebarOpen && (
        <aside className="w-72 bg-white border-r border-gray-200 overflow-y-auto shrink-0">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Filters</h2>
              <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-gray-600 text-sm">
                Close
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Min Elevation (m)</label>
                <input
                  type="number"
                  value={filters.minElevation}
                  onChange={(e) => setFilters({ ...filters, minElevation: e.target.value })}
                  className="w-full px-2 py-1.5 border rounded text-sm"
                  placeholder="e.g. 4000"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Country</label>
                <input
                  type="text"
                  value={filters.country}
                  onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                  className="w-full px-2 py-1.5 border rounded text-sm"
                  placeholder="e.g. Nepal"
                />
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-xs font-medium text-gray-600 mb-2">
                Peaks in view: {peaks.length}
              </h3>
              <div className="space-y-2">
                {peaks.slice(0, 20).map((p) => (
                  <Link
                    key={p.id}
                    to={`/peaks/${p.id}`}
                    className="block text-sm hover:bg-gray-50 p-2 rounded transition-colors"
                  >
                    <span className="font-medium">{p.name}</span>
                    <span className="text-peak-blue ml-1">{p.elevation.toLocaleString()}m</span>
                  </Link>
                ))}
                {peaks.length > 20 && (
                  <p className="text-xs text-gray-400 px-2">
                    +{peaks.length - 20} more — zoom in to see all
                  </p>
                )}
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* Map */}
      <div className="flex-1 relative">
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="absolute top-4 left-4 z-10 bg-white px-3 py-1.5 rounded-md shadow text-sm font-medium hover:bg-gray-50"
          >
            Filters
          </button>
        )}
        <MapContainer
          center={[10, 45]}
          zoom={4}
          terrain={true}
          onMapReady={(map) => {
            mapRef.current = map;
          }}
          onMoveEnd={loadPeaks}
        />
      </div>
    </div>
  );
}
