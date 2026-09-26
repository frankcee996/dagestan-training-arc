// Design tokens for 2-3 YEARS: DAGESTAN
// Black dominates. White for text/mascot/icons. Gray for secondary. Red is ACCENT ONLY.

export const colors = {
  obsidian: '#050505',
  white: '#FFFFFF',
  steel: '#A6A6A6',
  carbon: '#1A1A1A',
  red: '#FF3B30',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radii = {
  sm: 8,
  md: 14,
  lg: 20,
  pill: 999,
} as const;

export const type = {
  heading: {
    fontWeight: '800' as const,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
    color: colors.white,
  },
  body: {
    fontWeight: '400' as const,
    color: colors.steel,
  },
  labelSmall: {
    fontWeight: '600' as const,
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
    fontSize: 12,
    color: colors.steel,
  },
};
