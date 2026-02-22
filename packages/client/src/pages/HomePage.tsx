import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { PeakCard } from '../components/peaks/PeakCard.js';
import { MapContainer } from '../components/map/MapContainer.js';
import { LoadingSpinner } from '../components/ui/LoadingSpinner.js';
import type { PeakSummary, ActivityFeedItem } from '@summit/shared';
import * as peaksApi from '../api/peaks.api.js';
import * as socialApi from '../api/social.api.js';
import { api } from '../api/client.js';

export function HomePage() {
  const { user } = useAuth();
  const [featuredPeaks, setFeaturedPeaks] = useState<PeakSummary[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityFeedItem[]>([]);
  const [stats, setStats] = useState<{ peaks: number; routes: number; guidedPeaks: number; continents: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      peaksApi.getPeaks({ sort: 'elevation_desc', limit: 8 }).catch(() => ({ data: [] })),
      socialApi.getDiscoverFeed(1, 5).catch(() => ({ data: [] })),
      api.get<{ success: boolean; data: { peaks: number; routes: number; guidedPeaks: number; continents: number } }>('/stats').catch(() => null),
    ]).then(([peaksRes, activityRes, statsRes]) => {
      setFeaturedPeaks(peaksRes.data);
      setRecentActivity(activityRes.data || []);
      if (statsRes && statsRes.data) {
        setStats(statsRes.data);
      }
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero with dark map background */}
      <section className="relative h-[420px] bg-gray-900">
        <div className="absolute inset-0 opacity-60">
          <MapContainer
            center={[86.925, 28]}
            zoom={5}
            terrain={true}
            defaultLayer="dark"
            showLayerToggle={false}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center drop-shadow-lg">
            Plan Your Next Summit
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 text-center max-w-2xl drop-shadow">
            Discover routes, connect with climbers, and track your mountaineering journey worldwide.
          </p>
          <div className="flex gap-3">
            <Link
              to="/explore"
              className="bg-peak-blue text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Explore the Map
            </Link>
            <Link
              to="/peaks"
              className="bg-white/10 text-white border border-white/30 px-6 py-3 rounded-lg text-lg font-medium hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
              Browse Peaks
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar — all clickable */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex items-center justify-center gap-6 md:gap-14">
            <Link to="/peaks" className="text-center group cursor-pointer hover:scale-105 transition-transform">
              <div className="flex items-center justify-center gap-1.5">
                <svg className="w-5 h-5 text-peak-blue opacity-60" fill="currentColor" viewBox="0 0 24 24">
                  <polygon points="12,2 22,20 2,20" />
                </svg>
                <span className="text-2xl font-bold text-peak-blue group-hover:text-blue-700">{stats?.peaks ?? '...'}</span>
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wide group-hover:text-gray-700">Peaks</div>
            </Link>
            <Link to="/routes" className="text-center group cursor-pointer hover:scale-105 transition-transform">
              <div className="flex items-center justify-center gap-1.5">
                <svg className="w-5 h-5 text-peak-blue opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <span className="text-2xl font-bold text-peak-blue group-hover:text-blue-700">{stats?.routes ?? '...'}</span>
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wide group-hover:text-gray-700">Routes</div>
            </Link>
            <Link to="/guided" className="text-center group cursor-pointer hover:scale-105 transition-transform">
              <div className="flex items-center justify-center gap-1.5">
                <svg className="w-5 h-5 text-green-600 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-2xl font-bold text-green-600 group-hover:text-green-700">{stats?.guidedPeaks ?? '...'}</span>
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wide group-hover:text-gray-700">Guided Peaks</div>
            </Link>
            <Link to="/forums" className="text-center group cursor-pointer hover:scale-105 transition-transform">
              <div className="flex items-center justify-center gap-1.5">
                <svg className="w-5 h-5 text-purple-600 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-2xl font-bold text-purple-600 group-hover:text-purple-700">{stats?.continents ?? '...'}</span>
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wide group-hover:text-gray-700">Continents</div>
            </Link>
          </div>
        </div>
      </section>

      {/* Community Activity */}
      {recentActivity.length > 0 && (
        <section className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Community Activity</h2>
                <p className="text-gray-500 text-sm mt-1">See what climbers are up to</p>
              </div>
              <Link to="/feed" className="text-peak-blue hover:underline text-sm font-medium">
                View all activity →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentActivity.slice(0, 6).map((item) => (
                <div key={item.id} className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 bg-peak-blue rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {(item.displayName || item.username)[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <Link to={`/users/${item.username}`} className="text-sm font-medium text-gray-900 hover:text-peak-blue truncate block">
                        {item.displayName || item.username}
                      </Link>
                      <span className="text-xs text-gray-400">{formatTimeAgo(item.timestamp)}</span>
                    </div>
                  </div>

                  {item.type === 'climb' && item.climbLog && (
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`text-xs font-bold uppercase px-1.5 py-0.5 rounded ${
                          item.climbLog.success ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                        }`}>
                          {item.climbLog.success ? 'Summited' : 'Attempted'}
                        </span>
                      </div>
                      <Link to={`/peaks/${item.climbLog.peakId}`} className="font-semibold text-gray-900 hover:text-peak-blue text-sm">
                        {item.climbLog.peakName}
                      </Link>
                      <span className="text-xs text-gray-400 ml-1">{item.climbLog.elevation.toLocaleString()}m</span>
                      {item.climbLog.routeName && item.climbLog.routeId && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          via <Link to={`/routes/${item.climbLog.routeId}`} className="text-peak-blue hover:underline">{item.climbLog.routeName}</Link>
                        </p>
                      )}
                      {item.climbLog.photos && item.climbLog.photos.length > 0 && (
                        <div className="flex gap-1.5 mt-2">
                          {item.climbLog.photos.slice(0, 3).map((photo, i) => (
                            <img key={i} src={photo} alt="" className="w-14 h-14 rounded-lg object-cover" />
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {item.type === 'review' && item.review && (
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-xs text-gray-500">Reviewed</span>
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map(s => (
                            <span key={s} className={`text-xs ${s <= item.review!.rating ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                          ))}
                        </div>
                      </div>
                      <Link to={`/routes/${item.review.routeId}`} className="font-semibold text-gray-900 hover:text-peak-blue text-sm">
                        {item.review.routeName}
                      </Link>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{item.review.snippet}</p>
                    </div>
                  )}

                  {item.type === 'route' && item.route && (
                    <div>
                      <span className="text-xs text-gray-500">Added a new route</span>
                      <Link to={`/routes/${item.route.id}`} className="font-semibold text-gray-900 hover:text-peak-blue text-sm block mt-0.5">
                        {item.route.name}
                      </Link>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {item.route.peakName}
                        {item.route.difficulty && <span className="ml-1">• {item.route.difficulty}</span>}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Guide Services Callout */}
      <section className="bg-gradient-to-r from-indigo-600 to-blue-700">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-white">
              <h2 className="text-2xl font-bold mb-2">Need a Guide?</h2>
              <p className="text-blue-100 max-w-lg">
                Professional guide services are available for the world's most iconic peaks.
                From Everest to Denali, find experienced guides to help you reach the summit safely.
              </p>
            </div>
            <Link
              to="/guided"
              className="bg-white text-indigo-700 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors whitespace-nowrap"
            >
              Find Guide Services
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Peaks */}
      <section className="max-w-7xl mx-auto px-4 py-12 w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">World's Highest Peaks</h2>
            <p className="text-gray-500 text-sm mt-1">Explore routes, conditions, and guide services</p>
          </div>
          <Link to="/peaks" className="text-peak-blue hover:underline text-sm font-medium">
            View all →
          </Link>
        </div>
        {loading ? (
          <div className="flex justify-center py-12"><LoadingSpinner /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredPeaks.map((peak) => (
              <PeakCard key={peak.id} peak={peak} />
            ))}
          </div>
        )}
      </section>

      {/* Join CTA (logged-out only) */}
      {!user && (
        <section className="bg-gray-900 text-white">
          <div className="max-w-4xl mx-auto px-4 py-16 text-center">
            <h2 className="text-3xl font-bold mb-4">Join the SummitR Community</h2>
            <p className="text-gray-300 mb-8 text-lg max-w-2xl mx-auto">
              Log your climbs, follow other mountaineers, share beta, and plan your next adventure.
              It's free and always will be.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/register"
                className="bg-peak-blue text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Create Free Account
              </Link>
              <Link
                to="/login"
                className="border border-gray-600 text-gray-300 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function formatTimeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return new Date(dateStr).toLocaleDateString();
}
