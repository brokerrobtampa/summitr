import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { LoadingSpinner } from '../components/ui/LoadingSpinner.js';
import { StarRating } from '../components/ui/StarRating.js';
import { RouteHero } from '../components/routes/RouteHero.js';
import { QuickStats } from '../components/routes/QuickStats.js';
import { SafetySection } from '../components/routes/SafetySection.js';
import { PermitInfo } from '../components/routes/PermitInfo.js';
import { AirportInfo } from '../components/routes/AirportInfo.js';
import { GearSection } from '../components/gear/GearSection.js';
import { RouteMapPanel } from '../components/map/RouteMapPanel.js';
import { useAuth } from '../context/AuthContext.js';
import type { RouteDetail, ReviewWithAuthor, Tip, GearRecommendation } from '@summit/shared';
import * as routesApi from '../api/routes.api.js';
import * as reviewsApi from '../api/reviews.api.js';

type TabId = 'overview' | 'gear' | 'reviews' | 'tips';

export function RouteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [route, setRoute] = useState<RouteDetail | null>(null);
  const [reviews, setReviews] = useState<ReviewWithAuthor[]>([]);
  const [tips, setTips] = useState<Tip[]>([]);
  const [gear, setGear] = useState<GearRecommendation[]>([]);
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [savingBookmark, setSavingBookmark] = useState(false);

  useEffect(() => {
    if (!id) return;
    const routeId = parseInt(id, 10);
    setLoading(true);
    Promise.all([
      routesApi.getRoute(routeId),
      reviewsApi.getReviews(routeId),
      reviewsApi.getTips(routeId),
      reviewsApi.getGear(routeId),
    ])
      .then(([routeRes, reviewRes, tipRes, gearRes]) => {
        setRoute(routeRes.data);
        setReviews(reviewRes.data);
        setTips(tipRes.data);
        setGear(gearRes.data);
        setIsSaved(routeRes.data.isSaved || false);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const toggleSave = async () => {
    if (!route || !user) return;
    setSavingBookmark(true);
    try {
      if (isSaved) {
        await routesApi.unsaveRoute(route.id);
        setIsSaved(false);
      } else {
        await routesApi.saveRoute(route.id);
        setIsSaved(true);
      }
    } catch {}
    setSavingBookmark(false);
  };

  if (loading) return <LoadingSpinner size="lg" />;
  if (!route) return <div className="p-8 text-center text-gray-500">Route not found.</div>;

  const tabs: { id: TabId; label: string; count?: number }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'gear', label: 'Gear', count: gear.length },
    { id: 'reviews', label: 'Reviews', count: reviews.length },
    { id: 'tips', label: 'Tips', count: tips.length },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Hero */}
      <RouteHero route={route} />

      {/* Save Button (if logged in) */}
      {user && (
        <div className="flex justify-end mt-3 mb-2">
          <button
            onClick={toggleSave}
            disabled={savingBookmark}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isSaved
                ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <svg className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            {isSaved ? 'Saved' : 'Save Route'}
          </button>
        </div>
      )}

      {/* Summary */}
      {route.summary && (
        <p className="text-gray-600 text-lg mt-4 mb-4">{route.summary}</p>
      )}

      {/* Quick Stats */}
      <div className="mb-6">
        <QuickStats route={route} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="border-b flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-2 px-3 text-sm font-medium whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-b-2 border-peak-blue text-peak-blue'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span className="ml-1 text-xs text-gray-400">({tab.count})</span>
                )}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {route.description && (
                <div>
                  <h2 className="text-lg font-semibold mb-2">Route Description</h2>
                  <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">{route.description}</p>
                </div>
              )}

              {/* Safety Section */}
              <SafetySection route={route} />

              {/* Basecamp */}
              {route.basecamp && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
                    <span>⛺</span> Basecamp
                  </h3>
                  <p className="text-sm text-gray-700">{route.basecamp}</p>
                </div>
              )}

              {/* Permit & Airport Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PermitInfo
                  permitRequired={route.permitRequired}
                  permitInfo={route.permitInfo}
                />
                <AirportInfo
                  closestAirport={route.closestAirport}
                />
              </div>

              {/* Waypoints */}
              {route.waypoints.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold mb-2">Waypoints</h2>
                  <div className="border rounded-lg divide-y">
                    {route.waypoints.map((wp) => (
                      <div key={wp.id} className="px-4 py-2 flex items-center gap-3 text-sm">
                        <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 capitalize">
                          {wp.waypointType}
                        </span>
                        <span className="font-medium">{wp.name || `Point ${wp.orderIndex + 1}`}</span>
                        {wp.elevation && (
                          <span className="text-gray-400 ml-auto">{wp.elevation.toLocaleString()}m</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Gear Tab */}
          {activeTab === 'gear' && <GearSection gear={gear} />}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <StarRating rating={rev.rating} size="sm" />
                      {rev.title && <span className="font-medium">{rev.title}</span>}
                    </div>
                    <span className="text-xs text-gray-400">
                      {rev.author.username} — {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{rev.body}</p>
                  {rev.conditions && (
                    <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                      <span>🌤️</span> Conditions: {rev.conditions}
                    </p>
                  )}
                </div>
              ))}
              {reviews.length === 0 && (
                <p className="text-gray-500 text-center py-8 bg-gray-50 rounded-lg">No reviews yet. Be the first to share your experience!</p>
              )}
            </div>
          )}

          {/* Tips Tab */}
          {activeTab === 'tips' && (
            <div className="space-y-3">
              {tips.map((tip) => (
                <div key={tip.id} className="border rounded-lg p-3 flex gap-3">
                  <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-700 capitalize h-fit">
                    {tip.category}
                  </span>
                  <div>
                    <p className="text-sm text-gray-700">{tip.content}</p>
                    <p className="text-xs text-gray-400 mt-1">{tip.author.username}</p>
                  </div>
                </div>
              ))}
              {tips.length === 0 && (
                <p className="text-gray-500 text-center py-8 bg-gray-50 rounded-lg">No tips yet. Share your beta!</p>
              )}
            </div>
          )}
        </div>

        {/* Right panel — Map + GPX + Elevation Profile */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 space-y-4">
            <RouteMapPanel route={route} />

            {/* Author Info */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-3">
                {route.author.avatarUrl ? (
                  <img
                    src={route.author.avatarUrl}
                    alt={route.author.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-peak-blue rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {(route.author.displayName || route.author.username)[0].toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="font-medium text-gray-900">{route.author.displayName || route.author.username}</div>
                  <div className="text-xs text-gray-500">@{route.author.username}</div>
                </div>
              </div>
              {route.author.experienceLevel && (
                <span className="inline-block mt-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded capitalize">
                  {route.author.experienceLevel}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
