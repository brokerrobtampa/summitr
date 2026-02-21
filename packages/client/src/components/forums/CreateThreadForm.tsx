import { useState } from 'react';

interface Props {
  onSubmit: (data: { title: string; body: string; imageUrl?: string }) => Promise<void>;
  isLoading: boolean;
  error?: string;
}

export function CreateThreadForm({ onSubmit, isLoading, error }: Props) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      title,
      body,
      imageUrl: imageUrl.trim() || undefined,
    });
    setTitle('');
    setBody('');
    setImageUrl('');
    setShowImageInput(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
      <h3 className="font-semibold text-gray-900">New Thread</h3>
      {error && (
        <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded">{error}</div>
      )}
      <div>
        <input
          type="text"
          placeholder="Thread title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          minLength={3}
          maxLength={200}
          className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-peak-blue focus:border-transparent"
        />
      </div>
      <div>
        <textarea
          placeholder="What's on your mind? (min 10 characters)"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          minLength={10}
          rows={5}
          className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-peak-blue focus:border-transparent resize-y"
        />
      </div>

      {/* Image URL toggle */}
      {!showImageInput ? (
        <button
          type="button"
          onClick={() => setShowImageInput(true)}
          className="text-sm text-peak-blue hover:underline flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Add Image
        </button>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="url"
              placeholder="Image URL (https://...)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-peak-blue focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => { setImageUrl(''); setShowImageInput(false); }}
              className="text-sm text-gray-500 hover:text-gray-700 px-2"
            >
              Remove
            </button>
          </div>
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Preview"
              className="max-h-32 rounded border border-gray-200 object-contain"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          )}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading || title.length < 3 || body.length < 10}
          className="bg-peak-blue text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Posting...' : 'Post Thread'}
        </button>
      </div>
    </form>
  );
}
