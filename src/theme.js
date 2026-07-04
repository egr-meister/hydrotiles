// HydroTiles Water Mosaic Board theme.
// Calm, geometric, non-medical palette.

export const colors = {
  background: '#FBFCFA', // warm white
  board: '#EAF6F6', // pale aqua tile board
  boardBorder: '#CFE6E6',
  text: '#33454F', // deep blue-gray
  textSecondary: '#6B7C86', // slate gray secondary labels
  tileFilled: '#2E86C1', // clear blue filled tile
  tileFilledBorder: '#2471A3',
  tileEmpty: '#D6EEF2', // soft cyan empty tile
  tileEmptyBorder: '#BFE1E6',
  accent: '#3FA7A0', // muted teal accent
  accentSoft: '#DDEFEC',
  noteCard: '#F5EFE2', // light sand note card
  noteBorder: '#E7DCC4',
  goalReached: '#2E9E7B', // calm green for goal state
  danger: '#C0705F', // muted, non-aggressive warning
  white: '#FFFFFF',
  divider: '#E3EBEA',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 18,
  tile: 10,
};

export const font = {
  title: 24,
  heading: 19,
  body: 15,
  small: 13,
  tiny: 11,
};

// Navigation theme derived from DefaultTheme is built in App.js.
export default { colors, spacing, radius, font };
