interface PermitInfoProps {
  permitRequired: boolean;
  permitInfo: string | null;
}

export function PermitInfo({ permitRequired, permitInfo }: PermitInfoProps) {
  if (!permitRequired && !permitInfo) return null;

  return (
    <div className={`border rounded-lg p-4 ${permitRequired ? 'border-purple-200 bg-purple-50' : 'border-gray-200 bg-gray-50'}`}>
      <h3 className={`font-semibold flex items-center gap-2 mb-2 ${permitRequired ? 'text-purple-800' : 'text-gray-700'}`}>
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Permit Information
      </h3>

      {permitRequired && (
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold bg-purple-200 text-purple-800 px-2 py-0.5 rounded">
            PERMIT REQUIRED
          </span>
        </div>
      )}

      {permitInfo && (
        <p className="text-sm text-gray-700 whitespace-pre-wrap">{permitInfo}</p>
      )}

      {permitRequired && !permitInfo && (
        <p className="text-sm text-gray-500">A permit is required for this route. Check with local authorities for current requirements.</p>
      )}
    </div>
  );
}
