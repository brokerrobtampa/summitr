import { Link } from 'react-router-dom';
import type { ClimbLog } from '@summit/shared';

export function ClimbCard({ climb }: { climb: ClimbLog }) {
  return (
    <div className="border rounded-lg p-4 bg-white hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded ${
              climb.success
                ? 'bg-green-100 text-green-700'
                : 'bg-orange-100 text-orange-700'
            }`}>
              {climb.success ? 'Summited' : 'Attempt'}
            </span>
            <span className="text-xs text-gray-400">
              {new Date(climb.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>

          <h3 className="font-semibold text-gray-900 mt-1.5">
            {climb.peakName}
            <span className="text-gray-400 font-normal ml-2 text-sm">
              {climb.peakElevation.toLocaleString()}m
            </span>
          </h3>

          {climb.routeName && (
            <p className="text-sm text-peak-blue mt-0.5">
              {climb.routeId ? (
                <Link to={`/routes/${climb.routeId}`} className="hover:underline">
                  via {climb.routeName}
                </Link>
              ) : (
                <span>via {climb.routeName}</span>
              )}
            </p>
          )}
        </div>

        {climb.rating && (
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-sm ${star <= climb.rating! ? 'text-yellow-400' : 'text-gray-200'}`}
              >
                ★
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Stats Row */}
      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
        {climb.duration && (
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {climb.duration}h
          </span>
        )}
        {climb.elevationGain && (
          <span className="flex items-center gap-1">
            ↗️ {climb.elevationGain.toLocaleString()}m
          </span>
        )}
      </div>

      {climb.conditions && (
        <p className="text-xs text-gray-500 mt-2">
          <span className="font-medium">Conditions:</span> {climb.conditions}
        </p>
      )}

      {climb.notes && (
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{climb.notes}</p>
      )}

      {climb.photos && climb.photos.length > 0 && (
        <div className="flex gap-2 mt-3 overflow-x-auto">
          {climb.photos.slice(0, 4).map((photo, i) => (
            <img
              key={i}
              src={photo}
              alt={`Climb photo ${i + 1}`}
              className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
            />
          ))}
          {climb.photos.length > 4 && (
            <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-500 flex-shrink-0">
              +{climb.photos.length - 4}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
