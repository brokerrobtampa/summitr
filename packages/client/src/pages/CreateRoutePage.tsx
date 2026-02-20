import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer } from '../components/map/MapContainer.js';
import { useAuth } from '../context/AuthContext.js';
import { ACTIVITY_TYPES, SEASONS, GRADE_SYSTEMS } from '@summit/shared';
import * as routesApi from '../api/routes.api.js';
import * as peaksApi from '../api/peaks.api.js';
import maplibregl from 'maplibre-gl';
import type { PeakSummary, GeoJSONLineString } from '@summit/shared';

export function CreateRoutePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Step 1: Peak selection
  const [peakSearch, setPeakSearch] = useState('');
  const [peakResults, setPeakResults] = useState<PeakSummary[]>([]);
  const [selectedPeak, setSelectedPeak] = useState<PeakSummary | null>(null);

  // Step 2: Route line
  const [routePoints, setRoutePoints] = useState<[number, number][]>([]);

  // Step 3: Metadata
  const [form, setForm] = useState({
    name: '',
    difficulty: '',
    gradeSystem: '' as string,
    activityType: 'alpine',
    description: '',
    elevationGain: '',
    estimatedTime: '',
    season: '',
  });

  const searchPeaks = async () => {
    if (peakSearch.length < 2) return;
    try {
      const res = await peaksApi.getPeaks({ q: peakSearch, limit: 10 });
      setPeakResults(res.data);
    } catch {
      setPeakResults([]);
    }
  };

  const addDrawLayers = (map: maplibregl.Map, points: [number, number][]) => {
    if (map.getSource('draw-route')) return; // already added

    map.addSource('draw-route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: { type: 'LineString', coordinates: points },
      },
    });

    // White glow for satellite visibility
    map.addLayer({
      id: 'draw-route-glow',
      type: 'line',
      source: 'draw-route',
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: { 'line-color': '#ffffff', 'line-width': 7, 'line-opacity': 0.6 },
    });

    // Main route line
    map.addLayer({
      id: 'draw-route-line',
      type: 'line',
      source: 'draw-route',
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: { 'line-color': '#ef4444', 'line-width': 4 },
    });
  };

  const handleMapReady = (map: maplibregl.Map) => {
    if (selectedPeak) {
      map.setCenter([selectedPeak.longitude, selectedPeak.latitude]);
      map.setZoom(12);
    }

    // Re-add draw layers after style changes (layer toggle)
    map.on('style.load', () => {
      addDrawLayers(map, routePoints);
    });

    map.on('click', (e) => {
      setRoutePoints((prev) => {
        const newPoints = [...prev, [e.lngLat.lng, e.lngLat.lat] as [number, number]];

        // Update map line
        const source = map.getSource('draw-route') as maplibregl.GeoJSONSource;
        if (source) {
          source.setData({
            type: 'Feature',
            properties: {},
            geometry: { type: 'LineString', coordinates: newPoints },
          });
        } else {
          addDrawLayers(map, newPoints);
        }

        return newPoints;
      });
    });
  };

  const handleSubmit = async () => {
    if (!selectedPeak) return;
    setError('');
    setSubmitting(true);

    const geoJson: GeoJSONLineString | undefined =
      routePoints.length >= 2
        ? { type: 'LineString', coordinates: routePoints }
        : undefined;

    try {
      const res = await routesApi.createRoute({
        name: form.name,
        peakId: selectedPeak.id,
        difficulty: form.difficulty || undefined,
        gradeSystem: (form.gradeSystem as any) || undefined,
        activityType: form.activityType as any,
        description: form.description || undefined,
        elevationGain: form.elevationGain ? parseFloat(form.elevationGain) : undefined,
        estimatedTime: form.estimatedTime ? parseFloat(form.estimatedTime) : undefined,
        season: (form.season as any) || undefined,
        geoJson: geoJson as any,
        permitRequired: false,
        isPublic: true,
      });
      navigate(`/routes/${res.data.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create route');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Add New Route</h1>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= s ? 'bg-peak-blue text-white' : 'bg-gray-100 text-gray-400'
            }`}>
              {s}
            </div>
            <span className="text-sm text-gray-500 hidden sm:inline">
              {s === 1 ? 'Select Peak' : s === 2 ? 'Draw Route' : 'Details'}
            </span>
            {s < 3 && <div className="w-8 h-px bg-gray-300" />}
          </div>
        ))}
      </div>

      {error && <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded mb-4">{error}</div>}

      {/* Step 1: Select peak */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={peakSearch}
              onChange={(e) => setPeakSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchPeaks()}
              placeholder="Search for a peak..."
              className="flex-1 px-3 py-2 border rounded-md text-sm"
            />
            <button onClick={searchPeaks} className="px-4 py-2 bg-peak-blue text-white rounded-md text-sm">
              Search
            </button>
          </div>
          <div className="space-y-2">
            {peakResults.map((p) => (
              <button
                key={p.id}
                onClick={() => { setSelectedPeak(p); setStep(2); }}
                className={`w-full text-left p-3 border rounded-lg hover:bg-gray-50 ${
                  selectedPeak?.id === p.id ? 'border-peak-blue bg-blue-50' : ''
                }`}
              >
                <span className="font-medium">{p.name}</span>
                <span className="text-peak-blue ml-2">{p.elevation.toLocaleString()}m</span>
                {p.country && <span className="text-gray-400 ml-2">{p.country}</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Draw route on map */}
      {step === 2 && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Click on the map to draw your route. Points are added in order.</p>
          <div className="h-[400px] rounded-lg overflow-hidden border">
            <MapContainer terrain={true} onMapReady={handleMapReady} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{routePoints.length} points placed</span>
            <div className="flex gap-2">
              <button
                onClick={() => setRoutePoints((prev) => prev.slice(0, -1))}
                disabled={routePoints.length === 0}
                className="px-3 py-1.5 border rounded text-sm disabled:opacity-50"
              >
                Undo
              </button>
              <button onClick={() => setStep(1)} className="px-3 py-1.5 border rounded text-sm">
                Back
              </button>
              <button onClick={() => setStep(3)} className="px-4 py-1.5 bg-peak-blue text-white rounded text-sm">
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Route details */}
      {step === 3 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Route Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full px-3 py-2 border rounded-md text-sm"
              placeholder="e.g. Northeast Ridge"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Activity Type</label>
              <select
                value={form.activityType}
                onChange={(e) => setForm({ ...form, activityType: e.target.value })}
                className="w-full px-3 py-2 border rounded-md text-sm"
              >
                {ACTIVITY_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
              <input
                type="text"
                value={form.difficulty}
                onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                className="w-full px-3 py-2 border rounded-md text-sm"
                placeholder="e.g. 5.10a, AD+"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Elevation Gain (m)</label>
              <input
                type="number"
                value={form.elevationGain}
                onChange={(e) => setForm({ ...form, elevationGain: e.target.value })}
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Time (hours)</label>
              <input
                type="number"
                value={form.estimatedTime}
                onChange={(e) => setForm({ ...form, estimatedTime: e.target.value })}
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Season</label>
            <select
              value={form.season}
              onChange={(e) => setForm({ ...form, season: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm"
            >
              <option value="">Any season</option>
              {SEASONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description / Beta</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={6}
              className="w-full px-3 py-2 border rounded-md text-sm"
              placeholder="Describe the route, key sections, navigation notes..."
            />
          </div>

          <div className="flex gap-2 justify-end">
            <button onClick={() => setStep(2)} className="px-3 py-1.5 border rounded text-sm">
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={!form.name || submitting}
              className="px-6 py-1.5 bg-peak-blue text-white rounded text-sm font-medium disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create Route'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
