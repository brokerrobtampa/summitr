import { Link } from 'react-router-dom';
import type { TripPlannerResult } from '@summit/shared';
import { DifficultyBadge } from '../ui/DifficultyBadge.js';
import { StarRating } from '../ui/StarRating.js';

const activityIcons: Record<string, string> = {
  alpine: '\u26F0\uFE0F',
  rock: '\u{1F9D7}',
  ice: '\u2744\uFE0F',
  ski: '\u26F7\uFE0F',
  scramble: '\u{1F97E}',
  hike: '\u{1F6B6}',
};

export function TripPlannerResultCard({ result }: { result: TripPlannerResult }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 group">
      {/* Image / Header */}
      <div className="relative h-40 bg-gradient-to-br from-blue-500 to-indigo-600">
        {result.peakImageUrl ? (
          <img
            src={result.peakImageUrl}
            alt={result.peakName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg viewBox="0 0 100 60" className="w-24 h-16 text-white/30">
              <polygon points="20,55 50,15 80,55" fill="currentColor" />
              <polygon points="45,55 65,25 85,55" fill="currentColor" opacity="0.6" />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Peak elevation badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold px-2 py-1 rounded-lg">
          {result.peakElevation.toLocaleString()}m
        </div>

        {/* Activity type icon */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-sm px-2 py-1 rounded-lg">
          {activityIcons[result.activityType] || '\u26F0\uFE0F'} {result.activityType}
        </div>

        {/* Peak name and country */}
        <div className="absolute bottom-3 left-3 right-3">
          <Link
            to={`/peaks/${result.peakId}`}
            className="text-white font-bold text-lg leading-tight hover:underline"
          >
            {result.peakName}
          </Link>
          <div className="flex items-center gap-2 mt-0.5">
            {result.peakCountry && (
              <span className="text-white/80 text-xs">{result.peakCountry}</span>
            )}
            {result.peakRange && (
              <span className="text-white/60 text-xs">• {result.peakRange}</span>
            )}
          </div>
        </div>
      </div>

      {/* Route info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <Link
            to={`/routes/${result.routeId}`}
            className="font-semibold text-gray-900 hover:text-peak-blue transition-colors leading-tight"
          >
            {result.routeName}
          </Link>
          <DifficultyBadge difficulty={result.difficulty} activityType={result.activityType} />
        </div>

        {result.summary && (
          <p className="text-sm text-gray-500 mt-1.5 line-clamp-2">{result.summary}</p>
        )}

        {/* Key stats */}
        <div className="grid grid-cols-3 gap-2 mt-3 text-center">
          {result.elevationGain && (
            <div className="bg-gray-50 rounded-lg py-1.5 px-1">
              <div className="text-xs text-gray-400 font-medium">Gain</div>
              <div className="text-sm font-semibold text-gray-700">{result.elevationGain.toLocaleString()}m</div>
            </div>
          )}
          {result.distance && (
            <div className="bg-gray-50 rounded-lg py-1.5 px-1">
              <div className="text-xs text-gray-400 font-medium">Distance</div>
              <div className="text-sm font-semibold text-gray-700">{result.distance}km</div>
            </div>
          )}
          {result.estimatedTime && (
            <div className="bg-gray-50 rounded-lg py-1.5 px-1">
              <div className="text-xs text-gray-400 font-medium">Time</div>
              <div className="text-sm font-semibold text-gray-700">{result.estimatedTime}h</div>
            </div>
          )}
        </div>

        {/* Tags row */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {result.season && (
            <span className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {result.season}
            </span>
          )}
          {result.commitment && (
            <span className="inline-flex items-center text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">
              Grade {result.commitment}
            </span>
          )}
          {result.permitRequired && (
            <span className="inline-flex items-center gap-1 text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Permit
            </span>
          )}
          {result.hasGuideServices && (
            <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {result.guideServiceCount} Guide{result.guideServiceCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Hazards */}
        {result.hazards && result.hazards.length > 0 && (
          <div className="mt-2">
            <div className="flex flex-wrap gap-1">
              {result.hazards.slice(0, 3).map((h, i) => (
                <span key={i} className="text-xs bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded">
                  \u26A0 {h}
                </span>
              ))}
              {result.hazards.length > 3 && (
                <span className="text-xs text-gray-400">+{result.hazards.length - 3} more</span>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1">
            {result.averageRating ? (
              <>
                <StarRating rating={result.averageRating} size="sm" />
                <span className="text-xs text-gray-400">({result.reviewCount})</span>
              </>
            ) : (
              <span className="text-xs text-gray-400">No reviews</span>
            )}
          </div>

          {result.closestAirport && (
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              {result.closestAirport}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
