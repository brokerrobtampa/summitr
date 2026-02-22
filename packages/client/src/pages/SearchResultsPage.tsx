import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { PeakCard } from '../components/peaks/PeakCard.js';
import { RouteCard } from '../components/routes/RouteCard.js';
import { LoadingSpinner } from '../components/ui/LoadingSpinner.js';
import * as searchApi from '../api/search.api.js';
import type { SearchResults, PublicUser } from '@summit/shared';

type SearchTab = 'all' | 'peaks' | 'routes' | 'reviews' | 'users';

export function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<SearchTab>('all');

  useEffect(() => {
    if (!q) return;
    setLoading(true);
    setActiveTab('all');
    searchApi
      .search(q)
      .then((res) => setResults(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [q]);

  if (!q) return <div className="p-8 text-center text-gray-500">Enter a search query.</div>;
  if (loading) return <LoadingSpinner size="lg" />;

  const peakCount = results?.peaks.length || 0;
  const routeCount = results?.routes.length || 0;
  const reviewCount = results?.reviews.length || 0;
  const userCount = results?.users?.length || 0;
  const totalResults = peakCount + routeCount + reviewCount + userCount;

  const tabs: { id: SearchTab; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: totalResults },
    { id: 'peaks', label: 'Peaks', count: peakCount },
    { id: 'routes', label: 'Routes', count: routeCount },
    { id: 'reviews', label: 'Reviews', count: reviewCount },
    { id: 'users', label: 'Climbers', count: userCount },
  ];

  const showPeaks = activeTab === 'all' || activeTab === 'peaks';
  const showRoutes = activeTab === 'all' || activeTab === 'routes';
  const showReviews = activeTab === 'all' || activeTab === 'reviews';
  const showUsers = activeTab === 'all' || activeTab === 'users';

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-1">Search results for "{q}"</h1>
      <p className="text-sm text-gray-500 mb-4">{totalResults} results found</p>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        {tabs.filter(t => t.count > 0 || t.id === 'all').map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-peak-blue text-peak-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
            <span className="ml-1 text-xs text-gray-400">({tab.count})</span>
          </button>
        ))}
      </div>

      {showPeaks && results?.peaks && results.peaks.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Peaks ({results.peaks.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.peaks.map((p) => (
              <PeakCard key={p.id} peak={p} />
            ))}
          </div>
        </section>
      )}

      {showRoutes && results?.routes && results.routes.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Routes ({results.routes.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.routes.map((r) => (
              <RouteCard key={r.id} route={r} />
            ))}
          </div>
        </section>
      )}

      {showUsers && results?.users && results.users.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Climbers ({results.users.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.users.map((u: PublicUser) => (
              <Link
                key={u.id}
                to={`/users/${u.username}`}
                className="flex items-center gap-4 border rounded-xl p-4 hover:shadow-md transition-shadow bg-white"
              >
                {u.avatarUrl ? (
                  <img src={u.avatarUrl} alt={u.username} className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 bg-peak-blue rounded-full flex items-center justify-center text-white font-bold">
                    {(u.displayName || u.username)[0].toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900">{u.displayName || u.username}</div>
                  <div className="text-sm text-gray-500">@{u.username}</div>
                  {u.location && (
                    <div className="text-xs text-gray-400 mt-0.5">{u.location}</div>
                  )}
                </div>
                {u.experienceLevel && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded capitalize shrink-0">
                    {u.experienceLevel}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {showReviews && results?.reviews && results.reviews.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Reviews ({results.reviews.length})</h2>
          <div className="space-y-3">
            {results.reviews.map((r) => (
              <Link key={r.id} to={`/routes/${r.routeId}`} className="block border rounded-lg p-4 hover:shadow-md transition-shadow hover:border-peak-blue/30">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900">{r.routeName}</span>
                  <span className="text-xs text-gray-400">{r.peakName}</span>
                </div>
                <p className="text-sm text-gray-600">{r.snippet}...</p>
                <div className="text-xs text-gray-400 mt-1">by {r.authorUsername}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {totalResults === 0 && (
        <p className="text-gray-500 text-center py-12">No results found for "{q}".</p>
      )}
    </div>
  );
}
