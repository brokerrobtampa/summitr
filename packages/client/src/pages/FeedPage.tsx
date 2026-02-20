import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import type { ActivityFeedItem } from '@summit/shared';
import * as socialApi from '../api/social.api.js';
import { ActivityFeedItem as ActivityFeedItemCard } from '../components/social/ActivityFeedItem.js';
import { LoadingSpinner } from '../components/ui/LoadingSpinner.js';

export function FeedPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'following' | 'discover'>(user ? 'following' : 'discover');
  const [items, setItems] = useState<ActivityFeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchFeed = useCallback(async (pageNum: number, append = false) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      const response = activeTab === 'following' && user
        ? await socialApi.getFeed(pageNum)
        : await socialApi.getDiscoverFeed(pageNum);

      const newItems = response.data || [];
      if (append) {
        setItems(prev => [...prev, ...newItems]);
      } else {
        setItems(newItems);
      }
      setHasMore(newItems.length >= 20);
    } catch {
      if (pageNum === 1) setItems([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [activeTab, user]);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchFeed(1);
  }, [fetchFeed]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchFeed(nextPage, true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Activity Feed</h1>
        <p className="text-gray-500 mt-1">See what the climbing community is up to</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {user && (
          <button
            onClick={() => setActiveTab('following')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'following'
                ? 'border-peak-blue text-peak-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Following
          </button>
        )}
        <button
          onClick={() => setActiveTab('discover')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'discover'
              ? 'border-peak-blue text-peak-blue'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Discover
        </button>
      </div>

      <div className="flex gap-8">
        {/* Main Feed */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-xl">
              {activeTab === 'following' ? (
                <>
                  <div className="text-4xl mb-4">🏔️</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Your feed is empty</h3>
                  <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                    Follow other climbers to see their activity here. Check out the Discover tab to find climbers to follow.
                  </p>
                  <button
                    onClick={() => setActiveTab('discover')}
                    className="bg-peak-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Explore Discover Feed
                  </button>
                </>
              ) : (
                <>
                  <div className="text-4xl mb-4">⛰️</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No activity yet</h3>
                  <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                    Be the first to log a climb, write a review, or share a route!
                  </p>
                  {!user && (
                    <Link
                      to="/register"
                      className="bg-peak-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Join Summit Line
                    </Link>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <ActivityFeedItemCard key={item.id} item={item} />
              ))}

              {hasMore && (
                <div className="text-center py-4">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="text-peak-blue hover:text-blue-700 font-medium text-sm disabled:opacity-50"
                  >
                    {loadingMore ? 'Loading...' : 'Load more activity'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:block w-72 shrink-0">
          {/* Join CTA for logged out users */}
          {!user && (
            <div className="bg-gradient-to-br from-peak-blue to-blue-700 rounded-xl p-6 text-white mb-6">
              <h3 className="text-lg font-bold mb-2">Join the Community</h3>
              <p className="text-blue-100 text-sm mb-4">
                Log your climbs, follow other mountaineers, and plan your next adventure.
              </p>
              <Link
                to="/register"
                className="block w-full bg-white text-peak-blue text-center py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                Sign Up Free
              </Link>
            </div>
          )}

          {/* Quick Links */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/explore" className="flex items-center gap-2 text-sm text-gray-600 hover:text-peak-blue py-1">
                <span>🗺️</span> Explore the Map
              </Link>
              <Link to="/search" className="flex items-center gap-2 text-sm text-gray-600 hover:text-peak-blue py-1">
                <span>🔍</span> Search Peaks & Routes
              </Link>
              {user && (
                <>
                  <Link to="/profile" className="flex items-center gap-2 text-sm text-gray-600 hover:text-peak-blue py-1">
                    <span>👤</span> My Profile
                  </Link>
                  <Link to="/routes/new" className="flex items-center gap-2 text-sm text-gray-600 hover:text-peak-blue py-1">
                    <span>➕</span> Add a Route
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 mt-4">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Summit Line</h3>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div>
                <div className="text-lg font-bold text-peak-blue">185</div>
                <div className="text-xs text-gray-500">Peaks</div>
              </div>
              <div>
                <div className="text-lg font-bold text-peak-blue">151</div>
                <div className="text-xs text-gray-500">Routes</div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
