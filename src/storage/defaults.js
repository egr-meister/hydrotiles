// Default data structures and safe fallbacks for HydroTiles.
// Everything is stored locally on the device only.

export const STORAGE_KEY = '@hydrotiles/appData/v1';

export const TILE_SIZE_OPTIONS = [100, 150, 200, 250, 300, 500];

export const MAX_SINGLE_ENTRY_ML = 5000;
export const MAX_DAILY_GOAL_ML = 10000;
export const MIN_DAILY_GOAL_ML = 1;
export const MAX_VISIBLE_TILES = 100;

export const DEFAULT_GOAL_ML = 2000;
export const DEFAULT_TILE_SIZE_ML = 250;

export const defaultReminderSettings = {
  enabled: true,
  morningEnabled: true,
  afternoonEnabled: true,
  eveningEnabled: true,
};

export const defaultSettings = {
  onboardingCompleted: false,
  dailyGoalMl: DEFAULT_GOAL_ML,
  tileSizeMl: DEFAULT_TILE_SIZE_ML,
  tileLayout: 'comfortable', // 'compact' | 'comfortable'
  compactMode: false,
  reminders: { ...defaultReminderSettings },
};

export const defaultAppData = {
  entries: [], // WaterEntry[]
  settings: { ...defaultSettings },
  streak: {
    // Cached values; always recalculated from entries on load for safety.
    current: 0,
    best: 0,
  },
};

// Merge unknown/partial persisted data with defaults so the app never
// crashes on missing fields or corrupted JSON.
export function mergeAppData(raw) {
  const safeRaw = raw && typeof raw === 'object' ? raw : {};
  const rawSettings =
    safeRaw.settings && typeof safeRaw.settings === 'object'
      ? safeRaw.settings
      : {};
  const rawReminders =
    rawSettings.reminders && typeof rawSettings.reminders === 'object'
      ? rawSettings.reminders
      : {};

  const entries = Array.isArray(safeRaw.entries)
    ? safeRaw.entries.filter((e) => e && typeof e === 'object')
    : [];

  return {
    entries,
    settings: {
      onboardingCompleted: Boolean(rawSettings.onboardingCompleted),
      dailyGoalMl: clampNumber(
        rawSettings.dailyGoalMl,
        MIN_DAILY_GOAL_ML,
        MAX_DAILY_GOAL_ML,
        DEFAULT_GOAL_ML
      ),
      tileSizeMl: normalizeTileSize(rawSettings.tileSizeMl),
      tileLayout:
        rawSettings.tileLayout === 'compact' ? 'compact' : 'comfortable',
      compactMode: Boolean(rawSettings.compactMode),
      reminders: {
        enabled:
          rawReminders.enabled === undefined
            ? true
            : Boolean(rawReminders.enabled),
        morningEnabled:
          rawReminders.morningEnabled === undefined
            ? true
            : Boolean(rawReminders.morningEnabled),
        afternoonEnabled:
          rawReminders.afternoonEnabled === undefined
            ? true
            : Boolean(rawReminders.afternoonEnabled),
        eveningEnabled:
          rawReminders.eveningEnabled === undefined
            ? true
            : Boolean(rawReminders.eveningEnabled),
      },
    },
    streak: {
      current: Math.max(0, Number(safeRaw?.streak?.current ?? 0) || 0),
      best: Math.max(0, Number(safeRaw?.streak?.best ?? 0) || 0),
    },
  };
}

function clampNumber(value, min, max, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return fallback;
  return Math.min(max, Math.max(min, Math.round(n)));
}

function normalizeTileSize(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return DEFAULT_TILE_SIZE_ML;
  // Keep custom-but-valid tile sizes; guard extreme values.
  return Math.min(2000, Math.max(1, Math.round(n)));
}
