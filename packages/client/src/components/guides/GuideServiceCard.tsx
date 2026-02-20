import type { GuideService } from '@summit/shared';

export function GuideServiceCard({ guide }: { guide: GuideService }) {
  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-white hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-gray-900">{guide.name}</h4>
        {guide.rating && (
          <div className="flex items-center gap-1 text-sm">
            <span className="text-yellow-400">★</span>
            <span className="text-gray-600">{guide.rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      {guide.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{guide.description}</p>
      )}

      <div className="space-y-1.5 text-sm">
        {guide.priceRange && (
          <div className="flex items-center gap-2 text-gray-500">
            <span>💰</span>
            <span>{guide.priceRange}</span>
          </div>
        )}
        {guide.location && (
          <div className="flex items-center gap-2 text-gray-500">
            <span>📍</span>
            <span>{guide.location}</span>
          </div>
        )}
        {guide.specialties && guide.specialties.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {guide.specialties.map((s, i) => (
              <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{s}</span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
        <a
          href={guide.website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-peak-blue font-medium hover:underline"
        >
          Visit Website →
        </a>
        {guide.contactEmail && (
          <a href={`mailto:${guide.contactEmail}`} className="text-sm text-gray-500 hover:text-gray-700">
            Email
          </a>
        )}
      </div>
    </div>
  );
}
