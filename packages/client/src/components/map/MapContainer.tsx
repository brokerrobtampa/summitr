import { useRef, useEffect, useState, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;

type LayerMode = 'satellite' | 'topo' | 'street' | 'dark';

interface MapContainerProps {
  center?: [number, number];
  zoom?: number;
  className?: string;
  onMapReady?: (map: maplibregl.Map) => void;
  onMoveEnd?: (bounds: { north: number; south: number; east: number; west: number }) => void;
  terrain?: boolean;
  showLayerToggle?: boolean;
  defaultLayer?: LayerMode;
  children?: React.ReactNode;
}

function buildStyle(layer: LayerMode, terrain: boolean): maplibregl.StyleSpecification {
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
    : {
        terrainSource: {
          type: 'raster-dem',
          tiles: [
            'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png',
          ],
          tileSize: 256,
          encoding: 'terrarium',
        },
      };

  if (layer === 'satellite' && MAPBOX_TOKEN) {
    return {
      version: 8,
      sources: {
        'mapbox-satellite': {
          type: 'raster',
          tiles: [
            `https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}@2x.jpg90?access_token=${MAPBOX_TOKEN}`,
          ],
          tileSize: 512,
          maxzoom: 22,
          attribution: '&copy; Mapbox &copy; OpenStreetMap contributors',
        },
        ...terrainSource,
      },
      layers: [
        {
          id: 'satellite-tiles',
          type: 'raster',
          source: 'mapbox-satellite',
          minzoom: 0,
          maxzoom: 22,
        },
      ],
      terrain: terrain
        ? { source: 'terrainSource', exaggeration: 1.5 }
        : undefined,
    } as maplibregl.StyleSpecification;
  }

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
      terrain: terrain
        ? { source: 'terrainSource', exaggeration: 1.5 }
        : undefined,
    } as maplibregl.StyleSpecification;
  }

  if (layer === 'topo') {
    return {
      version: 8,
      sources: {
        'carto-light': {
          type: 'raster',
          tiles: ['https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png'],
          tileSize: 256,
          maxzoom: 20,
          attribution:
            '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        },
        ...terrainSource,
      },
      layers: [
        {
          id: 'topo-tiles',
          type: 'raster',
          source: 'carto-light',
          minzoom: 0,
          maxzoom: 20,
        },
      ],
      terrain: terrain
        ? { source: 'terrainSource', exaggeration: 1.5 }
        : undefined,
    } as maplibregl.StyleSpecification;
  }

  // Default: street / Carto Voyager
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
    terrain: terrain
      ? { source: 'terrainSource', exaggeration: 1.5 }
      : undefined,
  } as maplibregl.StyleSpecification;
}

const LAYER_LABELS: Record<LayerMode, string> = {
  satellite: 'Satellite',
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
  const initialLayer: LayerMode = defaultLayer ?? (MAPBOX_TOKEN ? 'satellite' : 'street');
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
        onMoveEnd({
          north: bounds.getNorth(),
          south: bounds.getSouth(),
          east: bounds.getEast(),
          west: bounds.getWest(),
        });
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

  // Available layers (satellite only shown when Mapbox token exists)
  const layers: LayerMode[] = MAPBOX_TOKEN
    ? ['satellite', 'street', 'topo', 'dark']
    : ['street', 'topo', 'dark'];

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
