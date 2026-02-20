import { useState } from 'react';
import type { GearRecommendation } from '@summit/shared';
import { GearItem } from './GearItem.js';

const CATEGORY_LABELS: Record<string, string> = {
  climbing: '⛏️ Climbing Hardware',
  clothing: '🧥 Clothing & Layers',
  footwear: '🥾 Footwear',
  camping: '⛺ Camping & Shelter',
  safety: '🚑 Safety & Emergency',
  navigation: '🧭 Navigation',
  hydration: '💧 Hydration & Nutrition',
  protection: '🛡️ Protection',
  general: '📦 General',
};

const CATEGORY_ORDER = [
  'climbing', 'footwear', 'clothing', 'camping',
  'safety', 'navigation', 'hydration', 'protection', 'general',
];

export function GearSection({ gear }: { gear: GearRecommendation[] }) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(CATEGORY_ORDER));

  // Group gear by category
  const grouped = gear.reduce<Record<string, GearRecommendation[]>>((acc, item) => {
    const cat = item.category || 'general';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const sortedCategories = Object.keys(grouped).sort(
    (a, b) => CATEGORY_ORDER.indexOf(a) - CATEGORY_ORDER.indexOf(b)
  );

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const essentialCount = gear.filter((g) => g.isEssential).length;

  if (gear.length === 0) {
    return (
      <div className="text-gray-500 text-center py-8 bg-gray-50 rounded-lg">
        No gear recommendations yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-sm text-gray-500">
        <span>{gear.length} items</span>
        <span>•</span>
        <span className="text-red-600 font-medium">{essentialCount} essential</span>
      </div>

      {sortedCategories.map((cat) => {
        const items = grouped[cat];
        const isExpanded = expandedCategories.has(cat);
        const catEssentialCount = items.filter((g) => g.isEssential).length;

        return (
          <div key={cat} className="border rounded-lg overflow-hidden">
            <button
              onClick={() => toggleCategory(cat)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">
                  {CATEGORY_LABELS[cat] || cat}
                </span>
                <span className="text-xs text-gray-400">({items.length})</span>
                {catEssentialCount > 0 && (
                  <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded">
                    {catEssentialCount} essential
                  </span>
                )}
              </div>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isExpanded && (
              <div className="divide-y">
                {items.map((item) => (
                  <GearItem key={item.id} gear={item} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
