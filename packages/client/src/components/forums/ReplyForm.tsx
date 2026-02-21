import { useState } from 'react';

interface Props {
  onSubmit: (body: string) => Promise<void>;
  onCancel?: () => void;
  isLoading: boolean;
  placeholder?: string;
}

export function ReplyForm({ onSubmit, onCancel, isLoading, placeholder }: Props) {
  const [body, setBody] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(body);
    setBody('');
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
