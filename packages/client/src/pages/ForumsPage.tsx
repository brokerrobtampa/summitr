import { Link } from 'react-router-dom';
import { useForumCategories } from '../hooks/useForums.js';
import { ForumCategoryCard } from '../components/forums/ForumCategoryCard.js';
import { LoadingSpinner } from '../components/ui/LoadingSpinner.js';

export function ForumsPage() {
  const { data, isLoading } = useForumCategories();
  const categories = data?.data ?? [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Forums</h1>
          <p className="text-gray-500 text-sm mt-1">
            Discuss peaks, gear, trip reports, and more with fellow climbers
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No forum categories yet.
        </div>
      ) : (
        <div className="space-y-3">
          {categories.map((category) => (
            <Link key={category.id} to={`/forums/${category.slug}`}>
              <ForumCategoryCard category={category} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
