interface AirportInfoProps {
  closestAirport: string | null;
  closestAirportDistance?: string | null;
}

export function AirportInfo({ closestAirport, closestAirportDistance }: AirportInfoProps) {
  if (!closestAirport) return null;

  return (
    <div className="border border-gray-200 bg-gray-50 rounded-lg p-4">
      <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
        Nearest Airport
      </h3>
      <p className="text-sm font-medium text-gray-900">{closestAirport}</p>
      {closestAirportDistance && (
        <p className="text-xs text-gray-500 mt-1">{closestAirportDistance}</p>
      )}
    </div>
  );
}
