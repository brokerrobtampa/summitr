import { useState } from 'react';

interface Props {
  onSubmit: (data: { title: string; body: string }) => Promise<void>;
  isLoading: boolean;
  error?: string;
}

export function CreateThreadForm({ onSubmit, isLoading, error }: Props) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ title, body });
    setTitle('');
    setBody('');
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
