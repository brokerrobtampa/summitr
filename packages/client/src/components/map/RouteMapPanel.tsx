import { useState, useCallback, useMemo, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import type { RouteDetail, GeoJSONLineString } from '@summit/shared';
import { MapContainer } from './MapContainer.js';
import { ElevationProfile } from './ElevationProfile.js';

interface RouteMapPanelProps {
  route: RouteDetail;
  className?: string;
}

const ROUTE_LINE_COLOR = '#ff4444';
const ROUTE_LINE_GLOW = '#ffffff';
const ROUTE_LINE_WIDTH = 4;

const WAYPOINT_COLORS: Record<string, string> = {
  camp: '#f59e0b',
  summit: '#ef4444',
  waypoint: '#3b82f6',
  trailhead: '#10b981',
  water: '#06b6d4',
  danger: '#dc2626',
  parking: '#6b7280',
};

function getGeoJson(route: RouteDetail): GeoJSONLineString | null {
  if (!route.geoJson) return null;

  // If geoJson is already an object, return it
  if (typeof route.geoJson === 'object') return route.geoJson;

  // If it's a string, parse it
  try {
    return JSON.parse(route.geoJson as unknown as string) as GeoJSONLineString;
  } catch {
    return null;
  }
}

function getElevationCoordinates(geoJson: GeoJSONLineString): [number, number, number][] | null {
  if (!geoJson.coordinates || geoJson.coordinates.length < 2) return null;

  // Check if any coordinates have elevation (3rd element)
  const hasElevation = geoJson.coordinates.some(
    (coord) => coord.length >= 3 && coord[2] != null,
  );
  if (!hasElevation) return null;

  return geoJson.coordinates.map((coord) => [
    coord[0],
    coord[1],
    coord.length >= 3 ? coord[2] : 0,
  ]) as [number, number, number][];
}

export function RouteMapPanel({ route, className = '' }: RouteMapPanelProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [is3D, setIs3D] = useState(false);
  const mapInstanceRef = useRef<maplibregl.Map | null>(null);

  const geoJson = useMemo(() => getGeoJson(route), [route]);
  const elevationCoords = useMemo(
    () => (geoJson ? getElevationCoordinates(geoJson) : null),
    [geoJson],
  );

  // Compute the center and zoom from the route data
  const mapCenter = useMemo<[number, number]>(() => {
    if (geoJson && geoJson.coordinates.length > 0) {
      const lons = geoJson.coordinates.map((c) => c[0]);
      const lats = geoJson.coordinates.map((c) => c[1]);
      return [
        (Math.min(...lons) + Math.max(...lons)) / 2,
        (Math.min(...lats) + Math.max(...lats)) / 2,
      ];
    }

    if (route.waypoints.length > 0) {
      const lons = route.waypoints.map((w) => w.longitude);
      const lats = route.waypoints.map((w) => w.latitude);
      return [
        (Math.min(...lons) + Math.max(...lons)) / 2,
        (Math.min(...lats) + Math.max(...lats)) / 2,
      ];
    }

    return [0, 20];
  }, [geoJson, route.waypoints]);

  const addRouteOverlays = useCallback(
    (map: maplibregl.Map) => {
      // Add route line with glow effect for visibility on satellite
      if (geoJson) {
        map.addSource('route-line', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: geoJson,
          },
        });

        // White glow/outline behind the route
        map.addLayer({
          id: 'route-line-glow',
          type: 'line',
          source: 'route-line',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': ROUTE_LINE_GLOW,
            'line-width': ROUTE_LINE_WIDTH + 3,
            'line-opacity': 0.6,
          },
        });

        // Main route line
        map.addLayer({
          id: 'route-line-layer',
          type: 'line',
          source: 'route-line',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': ROUTE_LINE_COLOR,
            'line-width': ROUTE_LINE_WIDTH,
          },
        });
      }

      // Add waypoint markers
      if (route.waypoints.length > 0) {
        for (const wp of route.waypoints) {
          const color = WAYPOINT_COLORS[wp.waypointType] || WAYPOINT_COLORS.waypoint;

          const el = document.createElement('div');
          el.style.width = '14px';
          el.style.height = '14px';
          el.style.borderRadius = '50%';
          el.style.backgroundColor = color;
          el.style.border = '2.5px solid white';
          el.style.boxShadow = '0 2px 6px rgba(0,0,0,0.4)';
          el.style.cursor = 'pointer';

          const marker = new maplibregl.Marker({ element: el }).setLngLat([
            wp.longitude,
            wp.latitude,
          ]);

          if (wp.name || wp.description) {
            const popupContent = [
              wp.name ? `<strong class="text-sm">${wp.name}</strong>` : '',
              wp.elevation ? `<span class="text-xs text-gray-500">${wp.elevation.toLocaleString()}m</span>` : '',
              wp.description ? `<p class="text-xs text-gray-600 mt-1">${wp.description}</p>` : '',
            ]
              .filter(Boolean)
              .join('<br/>');

            marker.setPopup(
              new maplibregl.Popup({ offset: 10, closeButton: false }).setHTML(popupContent),
            );
          }

          marker.addTo(map);
        }
      }

      // Fit bounds to route/waypoints
      const bounds = new maplibregl.LngLatBounds();
      let hasBounds = false;

      if (geoJson) {
        for (const coord of geoJson.coordinates) {
          bounds.extend([coord[0], coord[1]]);
          hasBounds = true;
        }
      }

      for (const wp of route.waypoints) {
        bounds.extend([wp.longitude, wp.latitude]);
        hasBounds = true;
      }

      if (hasBounds) {
        map.fitBounds(bounds, { padding: 50, maxZoom: 15 });
      }
    },
    [geoJson, route.waypoints],
  );

  const handleMapReady = useCallback(
    (map: maplibregl.Map) => {
      mapInstanceRef.current = map;
      addRouteOverlays(map);

      // Re-add overlays when style changes (layer toggle)
      map.on('style.load', () => {
        addRouteOverlays(map);
      });
    },
    [addRouteOverlays],
  );

  const toggle3D = useCallback(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (is3D) {
      map.easeTo({ pitch: 0, bearing: 0, duration: 800 });
    } else {
      map.easeTo({ pitch: 60, bearing: -20, duration: 800 });
    }
    setIs3D((prev) => !prev);
  }, [is3D]);

  const gpxDownloadUrl = `/api/v1/routes/${route.id}/gpx`;

  return (
    <div
      className={`${className} ${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-white flex flex-col'
          : 'relative'
      }`}
    >
      {/* Map */}
      <div className={`relative ${isFullscreen ? 'flex-1' : 'h-[400px] rounded-lg overflow-hidden'}`}>
        <MapContainer
          center={mapCenter}
          zoom={10}
          className="w-full h-full"
          onMapReady={handleMapReady}
        />

        {/* Controls overlay */}
        <div className="absolute top-3 left-3 flex gap-2 z-10">
          {/* GPX Download */}
          <a
            href={gpxDownloadUrl}
            download
            className="flex items-center gap-1.5 text-sm font-medium bg-white hover:bg-gray-50 text-gray-700 shadow-md border border-gray-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            GPX
          </a>

          {/* 3D Toggle */}
          <button
            onClick={toggle3D}
            className={`flex items-center gap-1 text-sm font-medium shadow-md border px-3 py-1.5 rounded-lg transition-colors ${
              is3D
                ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            3D
          </button>
        </div>

        {/* Fullscreen toggle */}
        <button
          onClick={() => setIsFullscreen((prev) => !prev)}
          className="absolute top-3 right-3 z-10 bg-white hover:bg-gray-50 shadow-md border border-gray-200 p-2 rounded-lg transition-colors"
          title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? (
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          )}
        </button>
      </div>

      {/* Elevation Profile */}
      {elevationCoords && (
        <div className={`mt-4 ${isFullscreen ? 'px-4 pb-4' : ''}`}>
          <ElevationProfile coordinates={elevationCoords} />
        </div>
      )}
    </div>
  );
}
