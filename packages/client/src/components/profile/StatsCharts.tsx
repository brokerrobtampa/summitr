import type { UserStats } from '@summit/shared';

export function StatsCharts({ stats }: { stats: UserStats }) {
  const years = Object.keys(stats.climbsByYear).sort((a, b) => Number(b) - Number(a));
  const maxClimbs = Math.max(...Object.values(stats.climbsByYear), 1);
  const maxElevation = Math.max(...Object.values(stats.elevationByYear || {}), 1);

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-peak-blue">{stats.totalPeaks}</div>
          <div className="text-xs text-gray-500 mt-1">Unique Peaks</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-green-600">{stats.totalClimbs}</div>
          <div className="text-xs text-gray-500 mt-1">Total Climbs</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-purple-600">{stats.totalElevationGain.toLocaleString()}m</div>
          <div className="text-xs text-gray-500 mt-1">Total Elevation</div>
        </div>
        {stats.highestPeak && (
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <div className="text-lg font-bold text-orange-600">{stats.highestPeak.name}</div>
            <div className="text-xs text-gray-500 mt-1">{stats.highestPeak.elevation.toLocaleString()}m — Highest Peak</div>
          </div>
        )}
      </div>

      {/* Climbs by Year */}
      {years.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Climbs by Year</h3>
          <div className="space-y-2">
            {years.map((year) => {
              const count = stats.climbsByYear[Number(year)];
              return (
                <div key={year} className="flex items-center gap-3">
                  <span className="text-sm font-medium w-12 text-gray-600">{year}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                    <div
                      className="bg-peak-blue rounded-full h-6 transition-all duration-500"
                      style={{ width: `${Math.max(5, (count / maxClimbs) * 100)}%` }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700">
                      {count} climb{count !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Elevation by Year */}
      {stats.elevationByYear && Object.keys(stats.elevationByYear).length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Elevation Gain by Year</h3>
          <div className="space-y-2">
            {years.map((year) => {
              const elevation = stats.elevationByYear?.[Number(year)] || 0;
              return (
                <div key={year} className="flex items-center gap-3">
                  <span className="text-sm font-medium w-12 text-gray-600">{year}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                    <div
                      className="bg-green-500 rounded-full h-6 transition-all duration-500"
                      style={{ width: `${Math.max(5, (elevation / maxElevation) * 100)}%` }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700">
                      {elevation.toLocaleString()}m
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
