import { Link } from 'react-router-dom';
import type { PeakSummary } from '@summit/shared';

export function PeakCard({ peak }: { peak: PeakSummary }) {
  return (
    <Link
      to={`/peaks/${peak.id}`}
      className="block border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
    >
      <h3 className="font-semibold text-gray-900">{peak.name}</h3>
      <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
        <span className="font-medium text-peak-blue">{peak.elevation.toLocaleString()}m</span>
        {peak.country && <span>{peak.country}</span>}
        {peak.range && <span className="text-gray-400">{peak.range}</span>}
      </div>
      <div className="mt-2 text-xs text-gray-400">
        {peak.routeCount} {peak.routeCount === 1 ? 'route' : 'routes'}
      </div>
    </Link>
  );
}
