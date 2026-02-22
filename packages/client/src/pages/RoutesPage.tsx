import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RouteCard } from '../components/routes/RouteCard.js';
import { LoadingSpinner } from '../components/ui/LoadingSpinner.js';
import type { RouteSummary } from '@summit/shared';
import * as routesApi from '../api/routes.api.js';

type SortOption = 'newest' | 'rating_desc' | 'name_asc' | 'elevation_desc';

export function RoutesPage() {
  const [routes, setRoutes] = useState<RouteSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortOption>('newest');
  const [difficulty, setDifficulty] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string | number> = {
      sort,
      page,
      limit: 24,
    };
    if (difficulty) params.difficulty = difficulty;

    routesApi
      .getRoutes(params)
      .then((res) => {
        setRoutes(res.data);
        setTotalPages(res.pagination?.totalPages || 1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [sort, difficulty, page]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-peak-blue">Home</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Routes</span>
      </nav>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Routes</h1>
          <p className="text-gray-500 mt-1">Explore climbing routes from around the world</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value as SortOption); setPage(1); }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-peak-blue focus:border-peak-blue"
          >
            <option value="newest">Newest First</option>
            <option value="rating_desc">Highest Rated</option>
            <option value="name_asc">A → Z</option>
            <option value="elevation_desc">Highest Elevation</option>
          </select>

          <select
            value={difficulty}
            onChange={(e) => { setDifficulty(e.target.value); setPage(1); }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-peak-blue focus:border-peak-blue"
          >
            <option value="">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="moderate">Moderate</option>
            <option value="difficult">Difficult</option>
            <option value="very_difficult">Very Difficult</option>
            <option value="extreme">Extreme</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
      ) : routes.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <p className="text-gray-500 text-lg">No routes found{difficulty ? ` with difficulty "${difficulty}"` : ''}.</p>
          {difficulty && (
            <button
              onClick={() => setDifficulty('')}
              className="mt-3 text-peak-blue hover:underline text-sm font-medium"
            >
              Clear filter
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {routes.map((route) => (
              <RouteCard key={route.id} route={route} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg border text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-lg border text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
