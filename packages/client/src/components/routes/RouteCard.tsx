import { Link } from 'react-router-dom';
import type { RouteSummary } from '@summit/shared';
import { DifficultyBadge } from '../ui/DifficultyBadge.js';
import { StarRating } from '../ui/StarRating.js';

export function RouteCard({ route }: { route: RouteSummary }) {
  return (
    <Link
      to={`/routes/${route.id}`}
      className="block border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{route.name}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{route.peakName}</p>
        </div>
        <DifficultyBadge difficulty={route.difficulty} activityType={route.activityType} />
      </div>

      <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
        {route.elevationGain && <span>{route.elevationGain.toLocaleString()}m gain</span>}
        {route.estimatedTime && <span>{route.estimatedTime}h</span>}
        <span className="capitalize">{route.activityType}</span>
      </div>

      <div className="mt-2 flex items-center justify-between">
        {route.averageRating ? (
          <StarRating rating={route.averageRating} size="sm" />
        ) : (
          <span className="text-xs text-gray-400">No reviews yet</span>
        )}
        <span className="text-xs text-gray-400">by {route.authorUsername}</span>
      </div>
    </Link>
  );
}
