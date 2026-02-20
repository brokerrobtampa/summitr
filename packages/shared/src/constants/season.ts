export const SEASONS = ['spring', 'summer', 'fall', 'winter', 'year-round'] as const;
export type Season = (typeof SEASONS)[number];
