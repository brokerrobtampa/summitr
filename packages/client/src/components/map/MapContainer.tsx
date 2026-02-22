import { useRef, useEffect, useState, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;

type LayerMode = 'satellite' | 'hybrid' | 'topo' | 'street' | 'dark';

interface MapContainerProps {
  center?: [number, number];
  zoom?: number;
  className?: string;
  onMapReady?: (map: maplibregl.Map) => void;
  onMoveEnd?: (bounds: { north: number; south: number; east: number; west: number }, zoom: number) => void;
  terrain?: boolean;
  showLayerToggle?: boolean;
  defaultLayer?: LayerMode;
  children?: React.ReactNode;
}

function buildStyle(layer: LayerMode, terrain: boolean): maplibregl.StyleSpecification {
  // Terrain source — only use with Mapbox token (free AWS Terrarium tiles have CORS issues in browsers)
  const hasTerrain = terrain && !!MAPBOX_TOKEN;

  const terrainSource: Record<string, any> = MAPBOX_TOKEN
    ? {
        terrainSource: {
          type: 'raster-dem',
          tiles: [
            `https://api.mapbox.com/raster/v1/mapbox.mapbox-terrain-dem-v1/{z}/{x}/{y}.webp?access_token=${MAPBOX_TOKEN}`,
          ],
          tileSize: 512,
          maxzoom: 14,
        },
      }
    : {};

  const terrainConfig = hasTerrain
    ? { source: 'terrainSource', exaggeration: 1.5 }
    : undefined;

  // Satellite source — Mapbox (better) or ESRI World Imagery (free fallback)
  const satelliteSource = MAPBOX_TOKEN
    ? {
        type: 'raster' as const,
        tiles: [
          `https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}@2x.jpg90?access_token=${MAPBOX_TOKEN}`,
        ],
        tileSize: 512,
        maxzoom: 22,
        attribution: '&copy; Mapbox &copy; OpenStreetMap contributors',
      }
    : {
        type: 'raster' as const,
        tiles: [
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        ],
        tileSize: 256,
        maxzoom: 19,
        attribution: '&copy; Esri, Maxar, Earthstar Geographics',
      };

  const satelliteMaxZoom = MAPBOX_TOKEN ? 22 : 19;

  // OpenTopoMap source — real contour lines
  const topoSource = {
    type: 'raster' as const,
    tiles: [
      'https://a.tile.opentopomap.org/{z}/{x}/{y}.png',
      'https://b.tile.opentopomap.org/{z}/{x}/{y}.png',
      'https://c.tile.opentopomap.org/{z}/{x}/{y}.png',
    ],
    tileSize: 256,
    maxzoom: 17,
    attribution:
      '&copy; <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA) &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  };

  // ── Satellite ──
  if (layer === 'satellite') {
    return {
      version: 8,
      sources: {
        'satellite-tiles': satelliteSource,
        ...terrainSource,
      },
      layers: [
        {
          id: 'satellite-layer',
          type: 'raster',
          source: 'satellite-tiles',
          minzoom: 0,
          maxzoom: satelliteMaxZoom,
        },
      ],
      terrain: terrainConfig,
    } as maplibregl.StyleSpecification;
  }

  // ── Hybrid (satellite + topo contour overlay) ──
  if (layer === 'hybrid') {
    return {
      version: 8,
      sources: {
        'satellite-tiles': satelliteSource,
        'topo-overlay': topoSource,
        ...terrainSource,
      },
      layers: [
        {
          id: 'satellite-layer',
          type: 'raster',
          source: 'satellite-tiles',
          minzoom: 0,
          maxzoom: satelliteMaxZoom,
        },
        {
          id: 'topo-overlay-layer',
          type: 'raster',
          source: 'topo-overlay',
          minzoom: 0,
          maxzoom: 17,
          paint: {
            'raster-opacity': 0.4,
          },
        },
      ],
      terrain: terrainConfig,
    } as maplibregl.StyleSpecification;
  }

  // ── Topo (OpenTopoMap with real contour lines) ──
  if (layer === 'topo') {
    return {
      version: 8,
      sources: {
        'topo-tiles': topoSource,
        ...terrainSource,
      },
      layers: [
        {
          id: 'topo-layer',
          type: 'raster',
          source: 'topo-tiles',
          minzoom: 0,
          maxzoom: 17,
        },
      ],
      terrain: terrainConfig,
    } as maplibregl.StyleSpecification;
  }

  // ── Dark (Carto Dark) ──
  if (layer === 'dark') {
    return {
      version: 8,
      sources: {
        'carto-dark': {
          type: 'raster',
          tiles: ['https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png'],
          tileSize: 256,
          maxzoom: 20,
          attribution:
            '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        },
        ...terrainSource,
      },
      layers: [
        {
          id: 'dark-tiles',
          type: 'raster',
          source: 'carto-dark',
          minzoom: 0,
          maxzoom: 20,
        },
      ],
      terrain: terrainConfig,
    } as maplibregl.StyleSpecification;
  }

  // ── Default: Street (Carto Voyager) ──
  return {
    version: 8,
    sources: {
      'carto-voyager': {
        type: 'raster',
        tiles: ['https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png'],
        tileSize: 256,
        maxzoom: 20,
        attribution:
          '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      },
      ...terrainSource,
    },
    layers: [
      {
        id: 'street-tiles',
        type: 'raster',
        source: 'carto-voyager',
        minzoom: 0,
        maxzoom: 20,
      },
    ],
    terrain: terrainConfig,
  } as maplibregl.StyleSpecification;
}

const LAYER_LABELS: Record<LayerMode, string> = {
  satellite: 'Satellite',
  hybrid: 'Hybrid',
  topo: 'Topo',
  street: 'Street',
  dark: 'Dark',
};

export function MapContainer({
  center = [0, 20],
  zoom = 2,
  className = '',
  onMapReady,
  onMoveEnd,
  terrain = true,
  showLayerToggle = true,
  defaultLayer,
}: MapContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [isReady, setIsReady] = useState(false);
  const initialLayer: LayerMode = defaultLayer ?? 'satellite';
  const [activeLayer, setActiveLayer] = useState<LayerMode>(initialLayer);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: buildStyle(initialLayer, terrain),
      center,
      zoom,
      maxZoom: MAPBOX_TOKEN ? 22 : 20,
      maxPitch: 85,
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-right');

    map.on('load', () => {
      mapRef.current = map;
      setIsReady(true);
      onMapReady?.(map);
    });

    map.on('moveend', () => {
      if (onMoveEnd) {
        const bounds = map.getBounds();
        onMoveEnd(
          {
            north: bounds.getNorth(),
            south: bounds.getSouth(),
            east: bounds.getEast(),
            west: bounds.getWest(),
          },
          map.getZoom(),
        );
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const switchLayer = useCallback(
    (layer: LayerMode) => {
      if (!mapRef.current || layer === activeLayer) return;
      setActiveLayer(layer);
      mapRef.current.setStyle(buildStyle(layer, terrain));
    },
    [activeLayer, terrain],
  );

  // All layers always available (satellite uses ESRI free fallback when no Mapbox token)
  const layers: LayerMode[] = ['satellite', 'hybrid', 'topo', 'street', 'dark'];

  return (
    <div className={`relative w-full h-full ${className}`}>
      <div ref={containerRef} className="w-full h-full" />

      {/* Layer toggle */}
      {showLayerToggle && isReady && (
        <div className="absolute bottom-3 left-3 z-10 flex rounded-lg overflow-hidden shadow-md border border-white/30">
          {layers.map((layer) => (
            <button
              key={layer}
              onClick={() => switchLayer(layer)}
              className={`px-2.5 py-1 text-xs font-medium transition-colors ${
                activeLayer === layer
                  ? 'bg-white text-gray-900'
                  : 'bg-black/50 text-white hover:bg-black/70'
              }`}
            >
              {LAYER_LABELS[layer]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function useMapInstance() {
  return useRef<maplibregl.Map | null>(null);
}
