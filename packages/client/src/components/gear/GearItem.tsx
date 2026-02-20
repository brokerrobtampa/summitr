import { useState } from 'react';
import type { GearRecommendation } from '@summit/shared';
import { RetailerLink } from './RetailerLink.js';

export function GearItem({ gear }: { gear: GearRecommendation }) {
  const [showLinks, setShowLinks] = useState(false);

  return (
    <div className="px-4 py-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            {gear.isEssential && (
              <span className="text-[10px] font-bold uppercase tracking-wide bg-red-100 text-red-700 px-1.5 py-0.5 rounded">
                Essential
              </span>
            )}
            <span className="font-medium text-gray-900">{gear.itemName}</span>
          </div>

          {gear.specificProduct && (
            <p className="text-sm text-peak-blue mt-0.5">Recommended: {gear.specificProduct}</p>
          )}

          {gear.notes && (
            <p className="text-sm text-gray-500 mt-1">{gear.notes}</p>
          )}

          <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
            {gear.weight && (
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
                {gear.weight}
              </span>
            )}
            {gear.priceRange && (
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {gear.priceRange}
              </span>
            )}
          </div>
        </div>

        {gear.links && gear.links.length > 0 && (
          <button
            onClick={() => setShowLinks(!showLinks)}
            className="ml-3 text-sm text-peak-blue hover:text-blue-700 font-medium whitespace-nowrap"
          >
            {showLinks ? 'Hide' : `Buy (${gear.links.length})`}
          </button>
        )}
      </div>

      {showLinks && gear.links && gear.links.length > 0 && (
        <div className="mt-3 space-y-2 pl-2 border-l-2 border-blue-100">
          {gear.links.map((link) => (
            <RetailerLink key={link.id} link={link} />
          ))}
        </div>
      )}
    </div>
  );
}
