import { Link } from 'react-router-dom';
import type { RouteDetail } from '@summit/shared';
import { DifficultyBadge } from '../ui/DifficultyBadge.js';
import { StarRating } from '../ui/StarRating.js';

export function RouteHero({ route }: { route: RouteDetail }) {
  const heroImage = route.imageUrl || route.peakImageUrl;

  return (
    <div className="relative">
      {heroImage ? (
        <div className="relative h-64 md:h-80 rounded-xl overflow-hidden">
          <img
            src={heroImage}
            alt={route.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <Link
              to={`/peaks/${route.peakId}`}
              className="text-blue-200 hover:text-white text-sm transition-colors"
            >
              ← {route.peakName} ({route.peakElevation.toLocaleString()}m)
            </Link>
            <h1 className="text-3xl font-bold text-white mt-1">{route.name}</h1>
            <div className="flex items-center gap-3 mt-2">
              <DifficultyBadge difficulty={route.difficulty} activityType={route.activityType} />
              {route.averageRating && (
                <div className="flex items-center gap-1">
                  <StarRating rating={route.averageRating} size="sm" />
                  <span className="text-white/80 text-xs">({route.reviewCount})</span>
                </div>
              )}
              <span className="text-white/70 text-sm">
                by {route.author.displayName || route.author.username}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-2">
          <Link
            to={`/peaks/${route.peakId}`}
            className="text-peak-blue hover:underline text-sm"
          >
            ← {route.peakName} ({route.peakElevation.toLocaleString()}m)
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-1">{route.name}</h1>
          <div className="flex items-center gap-3 mt-2">
            <DifficultyBadge difficulty={route.difficulty} activityType={route.activityType} />
            {route.averageRating && (
              <div className="flex items-center gap-1">
                <StarRating rating={route.averageRating} size="sm" />
                <span className="text-gray-500 text-xs">({route.reviewCount})</span>
              </div>
            )}
            <span className="text-gray-500 text-sm">
              by {route.author.displayName || route.author.username}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
