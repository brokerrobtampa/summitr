import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PeakCard } from '../components/peaks/PeakCard.js';
import { LoadingSpinner } from '../components/ui/LoadingSpinner.js';
import type { PeakSummary } from '@summit/shared';
import * as peaksApi from '../api/peaks.api.js';

type SortOption = 'elevation_desc' | 'elevation_asc' | 'name_asc' | 'name_desc';

export function PeaksPage() {
  const [peaks, setPeaks] = useState<PeakSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortOption>('elevation_desc');
  const [country, setCountry] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string | number> = {
      sort,
      page,
      limit: 24,
    };
    if (country) params.country = country;

    peaksApi
      .getPeaks(params)
      .then((res) => {
        setPeaks(res.data);
        setTotalPages(res.pagination?.totalPages || 1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [sort, country, page]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-peak-blue">Home</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Peaks</span>
      </nav>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Peaks</h1>
          <p className="text-gray-500 mt-1">Browse the world's most iconic mountains</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value as SortOption); setPage(1); }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-peak-blue focus:border-peak-blue"
          >
            <option value="elevation_desc">Highest First</option>
            <option value="elevation_asc">Lowest First</option>
            <option value="name_asc">A → Z</option>
            <option value="name_desc">Z → A</option>
          </select>

          <input
            type="text"
            value={country}
            onChange={(e) => { setCountry(e.target.value); setPage(1); }}
            placeholder="Filter by country..."
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-44 focus:ring-2 focus:ring-peak-blue focus:border-peak-blue"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
      ) : peaks.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <p className="text-gray-500 text-lg">No peaks found{country ? ` in "${country}"` : ''}.</p>
          {country && (
            <button
              onClick={() => setCountry('')}
              className="mt-3 text-peak-blue hover:underline text-sm font-medium"
            >
              Clear filter
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {peaks.map((peak) => (
              <PeakCard key={peak.id} peak={peak} />
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
