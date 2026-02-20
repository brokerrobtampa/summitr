import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { LoadingSpinner } from '../components/ui/LoadingSpinner.js';
import { ClimbCard } from '../components/climbs/ClimbCard.js';
import { RouteCard } from '../components/routes/RouteCard.js';
import { api } from '../api/client.js';
import * as socialApi from '../api/social.api.js';
import type { PublicUser, ClimbLog, RouteSummary } from '@summit/shared';

type ProfileTab = 'climbs' | 'routes' | 'reviews';

interface PublicProfile extends PublicUser {
  routeCount: number;
  climbCount: number;
  reviewCount: number;
}

export function PublicProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ProfileTab>('climbs');
  const [climbs, setClimbs] = useState<ClimbLog[]>([]);
  const [routes, setRoutes] = useState<RouteSummary[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [tabLoading, setTabLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  // Fetch profile
  useEffect(() => {
    if (!username) return;
    setLoading(true);
    api
      .get<{ data: PublicProfile }>(`/users/${username}`)
      .then((res) => {
        setProfile(res.data);
        setIsFollowing(res.data.isFollowing || false);
        setFollowersCount(res.data.followersCount || 0);
        setFollowingCount(res.data.followingCount || 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [username]);

  // Fetch tab data
  const loadTab = useCallback(async (tab: ProfileTab) => {
    if (!username) return;
    setTabLoading(true);
    try {
      if (tab === 'climbs') {
        const res = await api.get<{ data: ClimbLog[] }>(`/users/${username}/climbs`);
        setClimbs(res.data || []);
      } else if (tab === 'routes') {
        const res = await api.get<{ data: RouteSummary[] }>(`/routes?authorUsername=${username}`);
        setRoutes(res.data || []);
      } else if (tab === 'reviews') {
        const res = await api.get<{ data: any[] }>(`/users/${username}/reviews`);
        setReviews(res.data || []);
      }
    } catch {
      // Silently handle
    } finally {
      setTabLoading(false);
    }
  }, [username]);

  useEffect(() => {
    if (profile) loadTab(activeTab);
  }, [activeTab, profile, loadTab]);

  const toggleFollow = async () => {
    if (!profile || !currentUser) return;
    setFollowLoading(true);
    try {
      if (isFollowing) {
        await socialApi.unfollowUser(profile.id);
        setIsFollowing(false);
        setFollowersCount((c) => c - 1);
      } else {
        await socialApi.followUser(profile.id);
        setIsFollowing(true);
        setFollowersCount((c) => c + 1);
      }
    } catch {}
    setFollowLoading(false);
  };

  if (loading) return <LoadingSpinner size="lg" />;
  if (!profile) return <div className="p-8 text-center text-gray-500">User not found.</div>;

  const isOwnProfile = currentUser?.username === profile.username;

  const tabs: { id: ProfileTab; label: string; count: number }[] = [
    { id: 'climbs', label: 'Climbs', count: profile.climbCount },
    { id: 'routes', label: 'Routes', count: profile.routeCount },
    { id: 'reviews', label: 'Reviews', count: profile.reviewCount },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Profile Hero */}
      <div className="bg-gradient-to-r from-peak-blue to-blue-700 rounded-xl p-6 text-white mb-6">
        <div className="flex items-start gap-5">
          {/* Avatar */}
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.username}
              className="w-20 h-20 rounded-full border-4 border-white/30 object-cover"
            />
          ) : (
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold border-4 border-white/30">
              {(profile.displayName || profile.username)[0].toUpperCase()}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold">{profile.displayName || profile.username}</h1>
              {profile.experienceLevel && (
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full capitalize">
                  {profile.experienceLevel}
                </span>
              )}
            </div>
            <p className="text-blue-100">@{profile.username}</p>
            {profile.location && (
              <p className="text-blue-200 text-sm mt-1 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {profile.location}
              </p>
            )}
            {profile.bio && (
              <p className="text-blue-100 text-sm mt-2 line-clamp-3">{profile.bio}</p>
            )}
          </div>

          {/* Follow / Edit button */}
          <div className="shrink-0">
            {isOwnProfile ? (
              <Link
                to="/profile"
                className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm font-medium hover:bg-white/30 transition-colors"
              >
                Edit Profile
              </Link>
            ) : currentUser ? (
              <button
                onClick={toggleFollow}
                disabled={followLoading}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                  isFollowing
                    ? 'bg-white/20 text-white hover:bg-red-500/80'
                    : 'bg-white text-peak-blue hover:bg-blue-50'
                }`}
              >
                {followLoading ? '...' : isFollowing ? 'Following' : 'Follow'}
              </button>
            ) : (
              <Link
                to="/login"
                className="px-5 py-2 bg-white text-peak-blue rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
              >
                Sign in to Follow
              </Link>
            )}
          </div>
        </div>

        {/* Follow counts + stats */}
        <div className="flex items-center gap-6 mt-5 pt-4 border-t border-white/20">
          <div className="text-center">
            <span className="text-lg font-bold">{followersCount}</span>
            <span className="text-blue-200 text-sm ml-1">followers</span>
          </div>
          <div className="text-center">
            <span className="text-lg font-bold">{followingCount}</span>
            <span className="text-blue-200 text-sm ml-1">following</span>
          </div>
          <div className="ml-auto text-right">
            <span className="text-xs text-blue-200">
              Member since {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-peak-blue">{profile.climbCount}</div>
          <div className="text-xs text-gray-500 mt-1">Climbs</div>
        </div>
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{profile.routeCount}</div>
          <div className="text-xs text-gray-500 mt-1">Routes</div>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{profile.reviewCount}</div>
          <div className="text-xs text-gray-500 mt-1">Reviews</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b flex gap-1 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-2 px-4 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-peak-blue text-peak-blue'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
            <span className="ml-1 text-xs text-gray-400">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tabLoading ? (
        <div className="flex justify-center py-12"><LoadingSpinner /></div>
      ) : (
        <>
          {activeTab === 'climbs' && (
            <div className="space-y-3">
              {climbs.map((c) => (
                <ClimbCard key={c.id} climb={c} />
              ))}
              {climbs.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <div className="text-4xl mb-3">🏔️</div>
                  <p className="text-gray-500">No public climbs yet.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'routes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {routes.map((r) => (
                <RouteCard key={r.id} route={r} />
              ))}
              {routes.length === 0 && (
                <p className="text-gray-500 text-center py-12 col-span-2 bg-gray-50 rounded-xl">
                  No routes created yet.
                </p>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-3">
              {reviews.map((rev: any) => (
                <div key={rev.id} className="border rounded-lg p-4 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(s => (
                          <span key={s} className={`text-sm ${s <= rev.rating ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                        ))}
                      </div>
                      {rev.title && <span className="font-medium text-sm">{rev.title}</span>}
                    </div>
                    <span className="text-xs text-gray-400">{new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-gray-600">{rev.body}</p>
                  {rev.routeName && (
                    <Link to={`/routes/${rev.routeId}`} className="text-xs text-peak-blue hover:underline mt-1 inline-block">
                      {rev.routeName}
                    </Link>
                  )}
                </div>
              ))}
              {reviews.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <div className="text-4xl mb-3">📝</div>
                  <p className="text-gray-500">No reviews written yet.</p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
