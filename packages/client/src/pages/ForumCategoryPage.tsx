import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCategoryBySlug, useForumThreads, useCreateThread } from '../hooks/useForums.js';
import { useAuth } from '../context/AuthContext.js';
import { ThreadItem } from '../components/forums/ThreadItem.js';
import { CreateThreadForm } from '../components/forums/CreateThreadForm.js';
import { LoadingSpinner } from '../components/ui/LoadingSpinner.js';

export function ForumCategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const { data: categoryData, isLoading: catLoading } = useCategoryBySlug(slug || '');
  const category = categoryData?.data;

  const { data: threadsData, isLoading: threadsLoading } = useForumThreads(category?.id ?? 0, page);
  const threads = threadsData?.data ?? [];
  const pagination = threadsData?.pagination;

  const createThread = useCreateThread(category?.id ?? 0);

  const handleCreateThread = async (data: { title: string; body: string }) => {
    await createThread.mutateAsync(data);
    setShowCreateForm(false);
  };

  if (catLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center text-gray-500">
        Forum category not found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4">
        <Link to="/forums" className="text-peak-blue hover:underline">Forums</Link>
        <span className="mx-2">/</span>
        <span>{category.name}</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
          {category.description && (
            <p className="text-gray-500 text-sm mt-1">{category.description}</p>
          )}
        </div>
        {user && (
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-peak-blue text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
          >
            {showCreateForm ? 'Cancel' : '+ New Thread'}
          </button>
        )}
      </div>

      {showCreateForm && (
        <div className="mb-6">
          <CreateThreadForm
            onSubmit={handleCreateThread}
            isLoading={createThread.isPending}
            error={createThread.error?.message}
          />
        </div>
      )}

      {threadsLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : threads.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-sm mb-2">No threads yet.</p>
          {user && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="text-peak-blue hover:underline text-sm"
            >
              Start the first discussion
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
            {threads.map((thread) => (
              <ThreadItem key={thread.id} thread={thread} />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border rounded text-sm disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm text-gray-500">
                Page {page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="px-3 py-1 border rounded text-sm disabled:opacity-50 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
