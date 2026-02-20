import { useState } from 'react';
import type { User } from '@summit/shared';
import * as usersApi from '../../api/users.api.js';

interface EditProfileModalProps {
  user: User;
  onClose: () => void;
  onSaved: (updated: User) => void;
}

const EXPERIENCE_LEVELS = [
  { value: '', label: 'Not specified' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' },
];

export function EditProfileModal({ user, onClose, onSaved }: EditProfileModalProps) {
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [bio, setBio] = useState(user.bio || '');
  const [location, setLocation] = useState(user.location || '');
  const [experienceLevel, setExperienceLevel] = useState(user.experienceLevel || '');
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '');
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>(user.socialLinks || {});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSocialLinkChange = (key: string, value: string) => {
    setSocialLinks((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const cleanedSocial: Record<string, string> = {};
      for (const [k, v] of Object.entries(socialLinks)) {
        if (v.trim()) cleanedSocial[k] = v.trim();
      }

      const res = await usersApi.updateProfile({
        displayName: displayName || undefined,
        bio: bio || undefined,
        location: location || undefined,
        experienceLevel: (experienceLevel || undefined) as 'beginner' | 'intermediate' | 'advanced' | 'expert' | undefined,
        avatarUrl: avatarUrl || undefined,
        socialLinks: Object.keys(cleanedSocial).length > 0 ? cleanedSocial : undefined,
      } as any);
      onSaved(res.data);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 rounded-lg p-3">{error}</div>
        )}

        <div className="space-y-4">
          {/* Avatar URL with preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
            <div className="flex items-center gap-3">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar preview" className="w-12 h-12 rounded-full object-cover border border-gray-200" />
              ) : (
                <div className="w-12 h-12 bg-peak-blue rounded-full flex items-center justify-center text-white text-lg font-bold">
                  {(displayName || user.username)[0].toUpperCase()}
                </div>
              )}
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-peak-blue focus:border-transparent"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-peak-blue focus:border-transparent"
              placeholder="Your display name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-peak-blue focus:border-transparent resize-none"
              placeholder="Tell us about your climbing experience..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-peak-blue focus:border-transparent"
              placeholder="e.g., Boulder, CO"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-peak-blue focus:border-transparent"
            >
              {EXPERIENCE_LEVELS.map((level) => (
                <option key={level.value} value={level.value}>{level.label}</option>
              ))}
            </select>
          </div>

          {/* Social Links */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Social Links</label>
            <div className="space-y-2">
              {[
                { key: 'instagram', label: 'Instagram', placeholder: '@username or URL' },
                { key: 'strava', label: 'Strava', placeholder: 'Profile URL' },
                { key: 'website', label: 'Website', placeholder: 'https://...' },
              ].map((link) => (
                <div key={link.key} className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-20 text-right">{link.label}</span>
                  <input
                    type="text"
                    value={socialLinks[link.key] || ''}
                    onChange={(e) => handleSocialLinkChange(link.key, e.target.value)}
                    className="flex-1 border rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-peak-blue focus:border-transparent"
                    placeholder={link.placeholder}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 px-4 py-2 bg-peak-blue text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
