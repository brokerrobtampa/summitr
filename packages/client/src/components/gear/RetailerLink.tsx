import type { GearLink } from '@summit/shared';

const RETAILER_COLORS: Record<string, string> = {
  REI: 'bg-green-50 text-green-700 border-green-200',
  Backcountry: 'bg-orange-50 text-orange-700 border-orange-200',
  Amazon: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  Moosejaw: 'bg-blue-50 text-blue-700 border-blue-200',
  'Steep & Cheap': 'bg-red-50 text-red-700 border-red-200',
  'Mountain Hardwear': 'bg-purple-50 text-purple-700 border-purple-200',
  Patagonia: 'bg-teal-50 text-teal-700 border-teal-200',
};

export function RetailerLink({ link }: { link: GearLink }) {
  const colorClass = RETAILER_COLORS[link.retailer] || 'bg-gray-50 text-gray-700 border-gray-200';

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center justify-between px-3 py-2 rounded-lg border ${colorClass} hover:shadow-sm transition-shadow`}
    >
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{link.productName}</div>
        <div className="text-xs opacity-75">{link.retailer}</div>
      </div>
      <div className="flex items-center gap-2 ml-3">
        {link.price && (
          <span className="font-bold text-sm">${link.price.toFixed(2)}</span>
        )}
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </div>
    </a>
  );
}
