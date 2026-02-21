import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForumCategories, useContinentCategories } from '../hooks/useForums.js';
import { ForumCategoryCard } from '../components/forums/ForumCategoryCard.js';
import { LoadingSpinner } from '../components/ui/LoadingSpinner.js';
import type { ForumCategory } from '@summit/shared';

function ContinentCard({ continent }: { continent: ForumCategory }) {
  const [expanded, setExpanded] = useState(false);
  const peakChildren = continent.children ?? [];

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900">{continent.name}</h3>
          {continent.description && (
            <p className="text-sm text-gray-500 mt-0.5">{continent.description}</p>
          )}
        </div>
        <div className="flex items-center gap-4 ml-4 shrink-0">
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">
              {continent.childCount ?? peakChildren.length} {(continent.childCount ?? peakChildren.length) === 1 ? 'peak' : 'peaks'}
            </div>
            <div className="text-xs text-gray-500">
              {continent.threadCount} {continent.threadCount === 1 ? 'thread' : 'threads'}
            </div>
          </div>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {expanded && peakChildren.length > 0 && (
        <div className="border-t border-gray-100 bg-gray-50 p-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {peakChildren.map((peak) => (
              <Link
                key={peak.id}
                to={`/forums/${peak.slug}`}
                className="flex items-center justify-between bg-white rounded-md px-3 py-2 border border-gray-200 hover:border-peak-blue hover:bg-blue-50/30 transition-colors text-sm"
              >
                <span className="font-medium text-gray-800 truncate">{peak.name}</span>
                <span className="text-xs text-gray-500 ml-2 shrink-0">
                  {peak.threadCount} {peak.threadCount === 1 ? 'thread' : 'threads'}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function ForumsPage() {
  const { data: catData, isLoading: catLoading } = useForumCategories();
  const { data: contData, isLoading: contLoading } = useContinentCategories();

  const categories = catData?.data ?? [];
  const continents = contData?.data ?? [];

  const isLoading = catLoading || contLoading;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
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
      ) : (
        <>
          {/* Topics Section */}
          <section className="mb-10">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-peak-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              Topics
            </h2>
            {categories.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm bg-gray-50 rounded-lg">
                No topic categories yet.
              </div>
            ) : (
              <div className="space-y-2">
                {categories.map((category) => (
                  <Link key={category.id} to={`/forums/${category.slug}`}>
                    <ForumCategoryCard category={category} />
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Regional Discussions Section */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-peak-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Regional Discussions
            </h2>
            <p className="text-sm text-gray-500 mb-3">
              Browse by continent to find peak-specific discussions
            </p>
            {continents.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm bg-gray-50 rounded-lg">
                No regional categories yet.
              </div>
            ) : (
              <div className="space-y-2">
                {continents.map((continent) => (
                  <ContinentCard key={continent.id} continent={continent} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
