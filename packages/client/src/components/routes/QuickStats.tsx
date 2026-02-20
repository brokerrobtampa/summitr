import type { RouteDetail } from '@summit/shared';

function formatTime(hours: number): string {
  if (hours < 1) return `${Math.round(hours * 60)}min`;
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  const rem = hours % 24;
  return rem > 0 ? `${days}d ${rem}h` : `${days}d`;
}

export function QuickStats({ route }: { route: RouteDetail }) {
  const stats: { label: string; value: string; icon: string }[] = [];

  if (route.elevationGain) {
    stats.push({
      label: 'Elevation Gain',
      value: `${route.elevationGain.toLocaleString()}m`,
      icon: '↗️',
    });
  }

  if (route.distance) {
    stats.push({
      label: 'Distance',
      value: `${route.distance.toFixed(1)}km`,
      icon: '📏',
    });
  }

  if (route.estimatedTime) {
    stats.push({
      label: 'Total Time',
      value: formatTime(route.estimatedTime),
      icon: '⏱️',
    });
  }

  if (route.commitment) {
    stats.push({
      label: 'Commitment',
      value: `Grade ${route.commitment}`,
      icon: '💪',
    });
  }

  if (route.technicalGrade) {
    stats.push({
      label: 'Technical Grade',
      value: route.technicalGrade,
      icon: '🧗',
    });
  }

  if (route.season) {
    stats.push({
      label: 'Best Season',
      value: route.season,
      icon: '📅',
    });
  }

  if (route.approachTime) {
    stats.push({
      label: 'Approach',
      value: formatTime(route.approachTime),
      icon: '🚶',
    });
  }

  if (route.descentTime) {
    stats.push({
      label: 'Descent',
      value: formatTime(route.descentTime),
      icon: '⬇️',
    });
  }

  if (stats.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {stats.map((s) => (
        <div key={s.label} className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-lg mb-0.5">{s.icon}</div>
          <div className="text-sm font-bold text-gray-900">{s.value}</div>
          <div className="text-[11px] text-gray-500">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
