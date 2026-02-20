interface DifficultyBadgeProps {
  difficulty: string | null;
  activityType?: string;
}

export function DifficultyBadge({ difficulty, activityType }: DifficultyBadgeProps) {
  if (!difficulty) return null;

  const colorClass = (() => {
    switch (activityType) {
      case 'rock': return 'bg-stone-100 text-stone-700';
      case 'ice': return 'bg-cyan-100 text-cyan-700';
      case 'ski': return 'bg-purple-100 text-purple-700';
      case 'scramble': return 'bg-orange-100 text-orange-700';
      case 'hike': return 'bg-green-100 text-green-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  })();

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colorClass}`}>
      {difficulty}
    </span>
  );
}
