export const GRADE_SYSTEMS = ['yds', 'french', 'uiaa', 'alaska', 'nccs', 'ai', 'wi'] as const;
export type GradeSystem = (typeof GRADE_SYSTEMS)[number];

export const GRADE_SYSTEM_LABELS: Record<GradeSystem, string> = {
  yds: 'Yosemite Decimal System',
  french: 'French Alpine',
  uiaa: 'UIAA',
  alaska: 'Alaska Grade',
  nccs: 'NCCS (National Climbing Classification System)',
  ai: 'Alpine Ice',
  wi: 'Water Ice',
};
