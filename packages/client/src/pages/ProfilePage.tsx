import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { RouteCard } from '../components/routes/RouteCard.js';
import { ClimbCard } from '../components/climbs/ClimbCard.js';
import { LogClimbModal } from '../components/climbs/LogClimbModal.js';
import { EditProfileModal } from '../components/profile/EditProfileModal.js';
import { StatsCharts } from '../components/profile/StatsCharts.js';
import { LoadingSpinner } from '../components/ui/LoadingSpinner.js';
import type { RouteSummary, ClimbLog, UserStats } from '@summit/shared';
import { api } from '../api/client.js';

export function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'climbs' | 'routes' | 'saved' | 'photos' | 'stats'>('climbs');
  const [myRoutes, setMyRoutes] = useState<RouteSummary[]>([]);
  const [climbs, setClimbs] = useState<ClimbLog[]>([]);
  const [saved, setSaved] = useState<RouteSummary[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLogClimb, setShowLogClimb] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const loadData = useCallback(() => {
    if (!user) return;
    setLoading(true);
    Promise.all([
      api.get<any>(`/routes?authorId=${user.id}`).catch(() => ({ data: [] })),
      api.get<any>('/users/me/climbs').catch(() => ({ data: [] })),
      api.get<any>('/users/me/saved').catch(() => ({ data: [] })),
      api.get<any>('/users/me/stats').catch(() => ({ data: null })),
      api.get<any>(`/users/${user.username}`).catch(() => ({ data: {} })),
    ])
      .then(([routesRes, climbsRes, savedRes, statsRes, profileRes]) => {
        setMyRoutes(routesRes.data || []);
        setClimbs(climbsRes.data || []);
        setSaved(savedRes.data || []);
        setStats(statsRes.data || null);
        setFollowersCount(profileRes.data?.followersCount || 0);
        setFollowingCount(profileRes.data?.followingCount || 0);
      })
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (!user) return null;
  if (loading) return <LoadingSpinner size="lg" />;

  // Aggregate all photos from climb logs
  const allPhotos: { photo: string; climbId: number; peakName: string }[] = [];
  climbs.forEach((c) => {
    if (c.photos && c.photos.length > 0) {
      c.photos.forEach((photo) => {
        allPhotos.push({ photo, climbId: c.id, peakName: c.peakName });
      });
    }
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Profile Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.username}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-16 h-16 bg-peak-blue rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {(user.displayName || user.username)[0].toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user.displayName || user.username}</h1>
            <p className="text-gray-500">@{user.username}</p>
            <div className="flex items-center gap-3 mt-1">
              {user.location && (
                <span className="text-sm text-gray-400 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {user.location}
                </span>
              )}
              {user.experienceLevel && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded capitalize">
                  {user.experienceLevel}
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowEditProfile(true)}
          className="px-3 py-1.5 text-sm font-medium border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
        >
          Edit Profile
        </button>
      </div>

      {/* Bio */}
      {user.bio && (
        <p className="text-gray-600 text-sm mb-4">{user.bio}</p>
      )}

      {/* Social links */}
      {user.socialLinks && Object.keys(user.socialLinks).length > 0 && (
        <div className="flex items-center gap-3 mb-4">
          {Object.entries(user.socialLinks).map(([key, value]) => (
            <a
              key={key}
              href={value.startsWith('http') ? value : `https://${value}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-peak-blue bg-blue-50 px-2.5 py-1 rounded-full hover:bg-blue-100 capitalize"
            >
              {key}
            </a>
          ))}
        </div>
      )}

      {/* Follow Counts */}
      <div className="flex items-center gap-4 mb-4">
        <Link to={`/users/${user.username}`} className="text-sm text-gray-700 hover:text-peak-blue">
          <span className="font-bold">{followersCount}</span> <span className="text-gray-500">followers</span>
        </Link>
        <Link to={`/users/${user.username}`} className="text-sm text-gray-700 hover:text-peak-blue">
          <span className="font-bold">{followingCount}</span> <span className="text-gray-500">following</span>
        </Link>
      </div>

      {/* Quick Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-peak-blue">{stats.totalPeaks}</div>
            <div className="text-xs text-gray-500">Peaks</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.totalClimbs}</div>
            <div className="text-xs text-gray-500">Climbs</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.totalElevationGain.toLocaleString()}m</div>
            <div className="text-xs text-gray-500">Elevation</div>
          </div>
          {stats.highestPeak && (
            <div className="bg-orange-50 rounded-lg p-3 text-center">
              <div className="text-sm font-bold text-orange-600 truncate">{stats.highestPeak.name}</div>
              <div className="text-xs text-gray-500">{stats.highestPeak.elevation.toLocaleString()}m</div>
            </div>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b flex gap-1 mb-6 overflow-x-auto">
        {([
          { id: 'climbs' as const, label: 'Climb Log', count: climbs.length },
          { id: 'routes' as const, label: 'My Routes', count: myRoutes.length },
          { id: 'saved' as const, label: 'Want to Climb', count: saved.length },
          { id: 'photos' as const, label: 'Photos', count: allPhotos.length },
          { id: 'stats' as const, label: 'Stats' },
        ]).map((tab) => (
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

      {/* Climb Log Tab */}
      {activeTab === 'climbs' && (
        <div>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setShowLogClimb(true)}
              className="px-4 py-2 bg-peak-blue text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Log a Climb
            </button>
          </div>
          <div className="space-y-3">
            {climbs.map((c) => (
              <ClimbCard key={c.id} climb={c} />
            ))}
            {climbs.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <div className="text-4xl mb-3">🏔️</div>
                <p className="text-gray-500 mb-4">No climbs logged yet.</p>
                <button
                  onClick={() => setShowLogClimb(true)}
                  className="px-4 py-2 bg-peak-blue text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                  Log Your First Climb
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* My Routes Tab */}
      {activeTab === 'routes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myRoutes.map((r) => <RouteCard key={r.id} route={r} />)}
          {myRoutes.length === 0 && (
            <p className="text-gray-500 text-center py-8 col-span-2">No routes created yet.</p>
          )}
        </div>
      )}

      {/* Want to Climb Tab */}
      {activeTab === 'saved' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {saved.map((r) => <RouteCard key={r.id} route={r} />)}
          {saved.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg col-span-2">
              <div className="text-4xl mb-3">🎯</div>
              <p className="text-gray-500">No routes on your want-to-climb list yet.</p>
              <p className="text-gray-400 text-sm mt-1">Browse routes and bookmark your next objectives!</p>
            </div>
          )}
        </div>
      )}

      {/* Photos Tab */}
      {activeTab === 'photos' && (
        <div>
          {allPhotos.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {allPhotos.map((item, idx) => (
                <div key={idx} className="relative group aspect-square">
                  <img
                    src={item.photo}
                    alt={`${item.peakName} climb photo`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors rounded-lg flex items-end p-2">
                    <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity truncate">
                      {item.peakName}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <div className="text-4xl mb-3">📷</div>
              <p className="text-gray-500">No photos yet.</p>
              <p className="text-gray-400 text-sm mt-1">Add photo URLs when logging your climbs!</p>
            </div>
          )}
        </div>
      )}

      {/* Stats Tab */}
      {activeTab === 'stats' && stats && <StatsCharts stats={stats} />}
      {activeTab === 'stats' && !stats && (
        <p className="text-gray-500 text-center py-8">Log some climbs to see your statistics!</p>
      )}

      {/* Modals */}
      {showLogClimb && (
        <LogClimbModal
          onClose={() => setShowLogClimb(false)}
          onSaved={loadData}
        />
      )}

      {showEditProfile && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditProfile(false)}
          onSaved={() => {
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}
