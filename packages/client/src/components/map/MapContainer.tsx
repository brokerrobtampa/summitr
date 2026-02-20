import { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface MapContainerProps {
  center?: [number, number];
  zoom?: number;
  className?: string;
  onMapReady?: (map: maplibregl.Map) => void;
  onMoveEnd?: (bounds: { north: number; south: number; east: number; west: number }) => void;
  terrain?: boolean;
  children?: React.ReactNode;
}

export function MapContainer({
  center = [0, 20],
  zoom = 2,
  className = '',
  onMapReady,
  onMoveEnd,
  terrain = true,
}: MapContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '&copy; OpenStreetMap contributors',
          },
          terrainSource: {
            type: 'raster-dem',
            tiles: [
              'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png',
            ],
            tileSize: 256,
            encoding: 'terrarium',
          },
        },
        layers: [
          {
            id: 'osm-tiles',
            type: 'raster',
            source: 'osm',
            minzoom: 0,
            maxzoom: 19,
          },
        ],
        terrain: terrain
          ? { source: 'terrainSource', exaggeration: 1.5 }
          : undefined,
      },
      center,
      zoom,
      maxZoom: 18,
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

  return <div ref={containerRef} className={`w-full h-full ${className}`} />;
}

export function useMapInstance() {
  return useRef<maplibregl.Map | null>(null);
}
