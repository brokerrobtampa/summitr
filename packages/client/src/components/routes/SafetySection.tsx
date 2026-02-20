import type { RouteDetail } from '@summit/shared';

export function SafetySection({ route }: { route: RouteDetail }) {
  const hasHazards = route.hazards && route.hazards.length > 0;
  const hasSafetyNotes = !!route.safetyNotes;

  if (!hasHazards && !hasSafetyNotes) return null;

  return (
    <div className="border border-orange-200 bg-orange-50 rounded-lg p-4">
      <h3 className="font-semibold text-orange-800 flex items-center gap-2 mb-3">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        Safety Information
      </h3>

      {hasSafetyNotes && (
        <p className="text-sm text-orange-900 mb-3 whitespace-pre-wrap">{route.safetyNotes}</p>
      )}

      {hasHazards && (
        <div>
          <div className="text-xs font-medium text-orange-700 uppercase tracking-wide mb-2">Hazards</div>
          <div className="flex flex-wrap gap-2">
            {route.hazards!.map((hazard, i) => (
              <span
                key={i}
                className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full border border-orange-200"
              >
                ⚠️ {hazard}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
