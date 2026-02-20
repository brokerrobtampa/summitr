import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  type TooltipProps,
} from 'recharts';

interface ElevationProfileProps {
  coordinates: [number, number, number][];
  className?: string;
}

interface DataPoint {
  distance: number;
  elevation: number;
}

/**
 * Calculate Haversine distance between two [lon, lat] points in kilometers.
 */
function haversineDistance(
  lon1: number,
  lat1: number,
  lon2: number,
  lat2: number,
): number {
  const R = 6371; // Earth's radius in km
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function CustomTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload as DataPoint;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm px-3 py-2 text-xs">
      <p className="text-gray-500">
        Distance: <span className="font-medium text-gray-800">{data.distance.toFixed(2)} km</span>
      </p>
      <p className="text-gray-500">
        Elevation: <span className="font-medium text-gray-800">{Math.round(data.elevation)} m</span>
      </p>
    </div>
  );
}

export function ElevationProfile({ coordinates, className = '' }: ElevationProfileProps) {
  const data = useMemo<DataPoint[]>(() => {
    if (!coordinates || coordinates.length < 2) return [];

    // Check if coordinates have elevation data (3rd element)
    const hasElevation = coordinates.some(
      (coord) => coord.length >= 3 && coord[2] != null && coord[2] !== 0,
    );
    if (!hasElevation) return [];

    let cumulativeDistance = 0;
    const points: DataPoint[] = [
      { distance: 0, elevation: coordinates[0][2] },
    ];

    for (let i = 1; i < coordinates.length; i++) {
      const [lon1, lat1] = coordinates[i - 1];
      const [lon2, lat2, ele] = coordinates[i];
      cumulativeDistance += haversineDistance(lon1, lat1, lon2, lat2);
      points.push({
        distance: cumulativeDistance,
        elevation: ele,
      });
    }

    return points;
  }, [coordinates]);

  if (data.length < 2) return null;

  const minEle = Math.floor(Math.min(...data.map((d) => d.elevation)));
  const maxEle = Math.ceil(Math.max(...data.map((d) => d.elevation)));
  const padding = Math.max(50, (maxEle - minEle) * 0.1);

  return (
    <div className={`${className}`}>
      <p className="text-xs font-medium text-gray-500 mb-1.5 flex items-center gap-1">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        Elevation Profile
      </p>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="elevationGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#2563eb" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="distance"
            type="number"
            domain={['dataMin', 'dataMax']}
            tickFormatter={(val: number) => `${val.toFixed(1)}`}
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            axisLine={{ stroke: '#e5e7eb' }}
            tickLine={false}
            label={{
              value: 'km',
              position: 'insideBottomRight',
              offset: -5,
              style: { fontSize: 10, fill: '#9ca3af' },
            }}
          />
          <YAxis
            domain={[minEle - padding, maxEle + padding]}
            tickFormatter={(val: number) => `${Math.round(val)}`}
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            axisLine={{ stroke: '#e5e7eb' }}
            tickLine={false}
            width={45}
            label={{
              value: 'm',
              position: 'insideTopLeft',
              offset: -5,
              style: { fontSize: 10, fill: '#9ca3af' },
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="elevation"
            stroke="#2563eb"
            strokeWidth={2}
            fill="url(#elevationGradient)"
            dot={false}
            activeDot={{ r: 3, fill: '#2563eb', stroke: '#fff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
