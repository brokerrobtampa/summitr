import { useState } from 'react';

interface Props {
  onSubmit: (body: string, imageUrl?: string) => Promise<void>;
  onCancel?: () => void;
  isLoading: boolean;
  placeholder?: string;
}

export function ReplyForm({ onSubmit, onCancel, isLoading, placeholder }: Props) {
  const [body, setBody] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(body, imageUrl.trim() || undefined);
    setBody('');
    setImageUrl('');
    setShowImageInput(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        placeholder={placeholder || 'Write your reply...'}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        required
        minLength={1}
        rows={3}
        className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-peak-blue focus:border-transparent resize-y"
      />

      {/* Image toggle */}
      {!showImageInput ? (
        <button
          type="button"
          onClick={() => setShowImageInput(true)}
          className="text-xs text-peak-blue hover:underline flex items-center gap-1"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Add Image
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <input
            type="url"
            placeholder="Image URL (https://...)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="flex-1 px-2 py-1 border rounded text-xs focus:ring-2 focus:ring-peak-blue focus:border-transparent"
          />
          <button
            type="button"
            onClick={() => { setImageUrl(''); setShowImageInput(false); }}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Remove
          </button>
        </div>
      )}

      <div className="flex justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading || body.trim().length === 0}
          className="bg-peak-blue text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Posting...' : 'Reply'}
        </button>
      </div>
    </form>
  );
}
