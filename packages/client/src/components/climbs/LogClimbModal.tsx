import { useState, useEffect } from 'react';
import { api } from '../../api/client.js';
import * as usersApi from '../../api/users.api.js';
import type { PeakSummary, RouteSummary } from '@summit/shared';

interface LogClimbModalProps {
  onClose: () => void;
  onSaved: () => void;
}

export function LogClimbModal({ onClose, onSaved }: LogClimbModalProps) {
  const [peaks, setPeaks] = useState<PeakSummary[]>([]);
  const [routes, setRoutes] = useState<RouteSummary[]>([]);
  const [peakSearch, setPeakSearch] = useState('');
  const [selectedPeakId, setSelectedPeakId] = useState<number | null>(null);
  const [selectedRouteId, setSelectedRouteId] = useState<number | null>(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [success, setSuccess] = useState(true);
  const [notes, setNotes] = useState('');
  const [conditions, setConditions] = useState('');
  const [duration, setDuration] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [isPublic, setIsPublic] = useState(true);
  const [photoUrls, setPhotoUrls] = useState<string[]>(['']);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Search for peaks
  useEffect(() => {
    if (peakSearch.length < 2) {
      setPeaks([]);
      return;
    }
    const timeout = setTimeout(() => {
      api.get<any>(`/peaks?search=${encodeURIComponent(peakSearch)}&limit=10`)
        .then((res) => setPeaks(res.data || []))
        .catch(() => {});
    }, 300);
    return () => clearTimeout(timeout);
  }, [peakSearch]);

  // Load routes when peak is selected
  useEffect(() => {
    if (!selectedPeakId) {
      setRoutes([]);
      return;
    }
    api.get<any>(`/peaks/${selectedPeakId}/routes`)
      .then((res) => setRoutes(res.data || []))
      .catch(() => {});
  }, [selectedPeakId]);

  const addPhotoUrl = () => {
    if (photoUrls.length < 8) {
      setPhotoUrls([...photoUrls, '']);
    }
  };

  const removePhotoUrl = (index: number) => {
    setPhotoUrls(photoUrls.filter((_, i) => i !== index));
  };

  const updatePhotoUrl = (index: number, value: string) => {
    const updated = [...photoUrls];
    updated[index] = value;
    setPhotoUrls(updated);
  };

  const handleSubmit = async () => {
    if (!selectedPeakId) {
      setError('Please select a peak');
      return;
    }
    if (!date) {
      setError('Please enter a date');
      return;
    }

    const validPhotos = photoUrls.filter(url => url.trim());

    setSaving(true);
    setError('');
    try {
      await usersApi.createClimb({
        peakId: selectedPeakId,
        routeId: selectedRouteId || undefined,
        date: new Date(date).toISOString(),
        success,
        notes: notes || undefined,
        conditions: conditions || undefined,
        duration: duration ? parseFloat(duration) : undefined,
        rating: rating || undefined,
        isPublic,
        photos: validPhotos.length > 0 ? validPhotos : undefined,
      });
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to log climb');
    } finally {
      setSaving(false);
    }
  };

  const selectedPeak = peaks.find((p) => p.id === selectedPeakId);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Log a Climb</h2>
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
          {/* Peak Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Peak *</label>
            {selectedPeakId && selectedPeak ? (
              <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                <div>
                  <span className="font-medium text-gray-900">{selectedPeak.name}</span>
                  <span className="text-gray-500 ml-2">{selectedPeak.elevation.toLocaleString()}m</span>
                </div>
                <button
                  onClick={() => { setSelectedPeakId(null); setSelectedRouteId(null); setPeakSearch(''); }}
                  className="text-gray-400 hover:text-gray-600 text-sm"
                >
                  Change
                </button>
              </div>
            ) : (
              <div className="relative">
                <input
                  type="text"
                  value={peakSearch}
                  onChange={(e) => setPeakSearch(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-peak-blue focus:border-transparent"
                  placeholder="Search for a peak..."
                />
                {peaks.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                    {peaks.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => { setSelectedPeakId(p.id); setPeakSearch(''); }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm border-b last:border-b-0"
                      >
                        <span className="font-medium">{p.name}</span>
                        <span className="text-gray-400 ml-2">{p.elevation.toLocaleString()}m</span>
                        {p.country && <span className="text-gray-400 ml-1">— {p.country}</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Route Selection */}
          {selectedPeakId && routes.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Route (optional)</label>
              <select
                value={selectedRouteId || ''}
                onChange={(e) => setSelectedRouteId(e.target.value ? parseInt(e.target.value, 10) : null)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-peak-blue focus:border-transparent"
              >
                <option value="">No specific route</option>
                {routes.map((r) => (
                  <option key={r.id} value={r.id}>{r.name} {r.difficulty ? `(${r.difficulty})` : ''}</option>
                ))}
              </select>
            </div>
          )}

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-peak-blue focus:border-transparent"
            />
          </div>

          {/* Success Toggle */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">Result:</label>
            <div className="flex rounded-lg overflow-hidden border">
              <button
                onClick={() => setSuccess(true)}
                className={`px-4 py-1.5 text-sm font-medium ${success ? 'bg-green-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                Summited
              </button>
              <button
                onClick={() => setSuccess(false)}
                className={`px-4 py-1.5 text-sm font-medium ${!success ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                Attempt
              </button>
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (hours)</label>
            <input
              type="number"
              step="0.5"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-peak-blue focus:border-transparent"
              placeholder="e.g., 8.5"
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(rating === star ? null : star)}
                  className={`text-2xl ${star <= (rating || 0) ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Conditions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Conditions</label>
            <input
              type="text"
              value={conditions}
              onChange={(e) => setConditions(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-peak-blue focus:border-transparent"
              placeholder="e.g., Clear skies, light wind, packed snow"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-peak-blue focus:border-transparent resize-none"
              placeholder="Trip notes, memorable moments, route conditions..."
            />
          </div>

          {/* Photo URLs */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">Photos</label>
              {photoUrls.length < 8 && (
                <button
                  onClick={addPhotoUrl}
                  className="text-xs text-peak-blue hover:underline"
                >
                  + Add photo
                </button>
              )}
            </div>
            <div className="space-y-2">
              {photoUrls.map((url, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => updatePhotoUrl(idx, e.target.value)}
                    className="flex-1 border rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-peak-blue focus:border-transparent"
                    placeholder="https://example.com/photo.jpg"
                  />
                  {url && (
                    <img src={url} alt="" className="w-8 h-8 rounded object-cover border" onError={(e) => (e.currentTarget.style.display = 'none')} />
                  )}
                  {photoUrls.length > 1 && (
                    <button
                      onClick={() => removePhotoUrl(idx)}
                      className="text-gray-400 hover:text-red-500 shrink-0"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-1">Add URLs to your climb photos (up to 8)</p>
          </div>

          {/* Public Toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="rounded border-gray-300 text-peak-blue focus:ring-peak-blue"
            />
            <span className="text-sm text-gray-700">Show on public profile & activity feed</span>
          </label>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || !selectedPeakId}
            className="flex-1 px-4 py-2 bg-peak-blue text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Log Climb'}
          </button>
        </div>
      </div>
    </div>
  );
}
