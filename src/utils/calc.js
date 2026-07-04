// Core HydroTiles calculations: totals, tiles, progress, streak, stats.
// All functions are defensive and never throw on bad data.

import {
  DEFAULT_GOAL_ML,
  DEFAULT_TILE_SIZE_ML,
  MAX_VISIBLE_TILES,
  MAX_SINGLE_ENTRY_ML,
  MIN_DAILY_GOAL_ML,
  MAX_DAILY_GOAL_ML,
} from '../storage/defaults';
import { addDays, todayString, isValidDateString } from './date';

export function safeGoalMl(settings) {
  const n = Number(settings?.dailyGoalMl);
  if (!Number.isFinite(n) || n <= 0) return DEFAULT_GOAL_ML;
  return Math.min(MAX_DAILY_GOAL_ML, Math.max(1, Math.round(n)));
}

export function safeTileSizeMl(settings) {
  const n = Number(settings?.tileSizeMl);
  if (!Number.isFinite(n) || n <= 0) return DEFAULT_TILE_SIZE_ML;
  return Math.max(1, Math.round(n));
}

// Entries for a specific day.
export function entriesForDate(entries, dateStr) {
  const list = Array.isArray(entries) ? entries : [];
  return list.filter((item) => item?.date === dateStr);
}

// Sum of ml for a list of entries.
export function sumMl(entries) {
  const list = Array.isArray(entries) ? entries : [];
  return list.reduce(
    (sum, item) => sum + Math.max(0, Number(item?.amountMl ?? 0) || 0),
    0
  );
}

export function totalForDate(entries, dateStr) {
  return sumMl(entriesForDate(entries, dateStr));
}

// Full progress summary for one day.
export function dayProgress(entries, dateStr, settings) {
  const goalMl = safeGoalMl(settings);
  const tileSizeMl = safeTileSizeMl(settings);
  const totalMl = totalForDate(entries, dateStr);

  const totalTiles = Math.max(1, Math.ceil(goalMl / tileSizeMl));
  const visibleTiles = Math.min(totalTiles, MAX_VISIBLE_TILES);
  const filledTiles = Math.min(totalTiles, Math.floor(totalMl / tileSizeMl));
  const visibleFilled = Math.min(visibleTiles, filledTiles);

  const ratio = goalMl > 0 ? totalMl / goalMl : 0;
  const percent = Math.round(Math.min(1, Math.max(0, ratio)) * 100);
  const goalReached = totalMl >= goalMl;
  const entryCount = entriesForDate(entries, dateStr).length;

  return {
    dateStr,
    goalMl,
    tileSizeMl,
    totalMl,
    totalTiles,
    visibleTiles,
    filledTiles,
    visibleFilled,
    percent,
    goalReached,
    entryCount,
    tooManyTiles: totalTiles > MAX_VISIBLE_TILES,
  };
}

// Progress level used for calendar cells.
export function progressLevel(entries, dateStr, settings) {
  const total = totalForDate(entries, dateStr);
  if (total <= 0) return 'empty';
  const goalMl = safeGoalMl(settings);
  if (total >= goalMl) return 'goal';
  return 'partial';
}

// ---- Streak ----
// Consecutive days ending today (or yesterday if today unmet) where
// totalMl >= goal. Today only counts if already met; an unmet today
// does not break a streak that ran through yesterday.
export function computeStreaks(entries, settings) {
  const goalMl = safeGoalMl(settings);
  const list = Array.isArray(entries) ? entries : [];

  // Aggregate totals per valid date.
  const totals = {};
  for (const e of list) {
    if (!e || !isValidDateString(e.date)) continue;
    totals[e.date] = (totals[e.date] || 0) + Math.max(0, Number(e.amountMl ?? 0) || 0);
  }

  const met = (dateStr) => (totals[dateStr] || 0) >= goalMl;

  // Current streak.
  const today = todayString();
  let current = 0;
  let cursor = today;
  if (!met(today)) {
    // Today not yet met -> start counting from yesterday.
    cursor = addDays(today, -1);
  }
  // Walk backwards while each day is met.
  let guard = 0;
  while (met(cursor) && guard < 3650) {
    current += 1;
    cursor = addDays(cursor, -1);
    guard += 1;
  }

  // Best streak across all recorded met-days.
  const metDates = Object.keys(totals)
    .filter((d) => met(d))
    .sort();
  let best = 0;
  let run = 0;
  let prev = null;
  for (const d of metDates) {
    if (prev && addDays(prev, 1) === d) {
      run += 1;
    } else {
      run = 1;
    }
    if (run > best) best = run;
    prev = d;
  }
  best = Math.max(best, current);

  return { current, best };
}

// ---- Statistics (last 7 days incl. today) ----
export function weeklyStats(entries, settings) {
  const goalMl = safeGoalMl(settings);
  const tileSizeMl = safeTileSizeMl(settings);
  const today = todayString();

  const days = [];
  for (let i = 6; i >= 0; i--) {
    const dateStr = addDays(today, -i);
    const totalMl = totalForDate(entries, dateStr);
    const filledTiles = Math.floor(totalMl / tileSizeMl);
    days.push({
      dateStr,
      totalMl,
      filledTiles,
      goalReached: totalMl >= goalMl,
    });
  }

  const weekTotalMl = days.reduce((s, d) => s + d.totalMl, 0);
  const dailyAverage = Math.round(weekTotalMl / 7);
  const best = days.reduce(
    (acc, d) => (d.totalMl > acc.totalMl ? d : acc),
    { dateStr: null, totalMl: 0 }
  );
  const goalDays = days.filter((d) => d.goalReached).length;
  const totalTilesFilled = days.reduce((s, d) => s + d.filledTiles, 0);
  const avgTilesPerDay = Math.round(totalTilesFilled / 7);
  const todayTotal = totalForDate(entries, today);

  return {
    days,
    weekTotalMl,
    dailyAverage,
    bestDay: best,
    goalDays,
    totalTilesFilled,
    avgTilesPerDay,
    todayTotal,
    goalMl,
  };
}

// ---- History summaries (reverse chronological) ----
export function buildHistory(entries, settings) {
  const list = Array.isArray(entries) ? entries : [];
  const byDate = {};
  for (const e of list) {
    if (!e || !isValidDateString(e.date)) continue;
    if (!byDate[e.date]) byDate[e.date] = [];
    byDate[e.date].push(e);
  }
  const dates = Object.keys(byDate).sort().reverse();
  return dates.map((dateStr) => {
    const p = dayProgress(list, dateStr, settings);
    return {
      dateStr,
      totalMl: p.totalMl,
      goalReached: p.goalReached,
      filledTiles: p.filledTiles,
      totalTiles: p.totalTiles,
      entryCount: p.entryCount,
    };
  });
}

// ---- In-app reminders (evaluated only while the app is open) ----
// Returns an array of gentle reminder message strings.
export function buildReminders(entries, settings, now = new Date()) {
  const reminders = settings?.reminders ?? {};
  if (!reminders.enabled) return [];

  const today = todayString();
  const p = dayProgress(entries, today, settings);
  const hour = now instanceof Date && !isNaN(now.getTime())
    ? now.getHours()
    : 0;

  const messages = [];

  // Morning: nothing logged yet, after 11:00.
  if (reminders.morningEnabled && p.totalMl <= 0 && hour >= 11) {
    messages.push('No tiles filled today. Add one if you drank water.');
  }

  // Afternoon: below 50% after 16:00.
  if (
    reminders.afternoonEnabled &&
    p.totalMl > 0 &&
    p.percent < 50 &&
    hour >= 16
  ) {
    messages.push('Your tile board still has empty spaces.');
  }

  // Evening: goal not reached after 19:00.
  if (reminders.eveningEnabled && !p.goalReached && hour >= 19) {
    messages.push('Add any drinks you missed today.');
  }

  return messages;
}

// ---- Entry helpers ----
export function makeId() {
  return (
    Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8)
  );
}

// Validate an amount. Returns { ok, value, error }.
export function validateAmount(input) {
  const n = Number(input);
  if (input === '' || input === null || input === undefined) {
    return { ok: false, value: 0, error: 'Enter an amount in ml.' };
  }
  if (!Number.isFinite(n)) {
    return { ok: false, value: 0, error: 'Enter a valid number.' };
  }
  if (n <= 0) {
    return { ok: false, value: 0, error: 'Amount must be greater than 0.' };
  }
  if (n > MAX_SINGLE_ENTRY_ML) {
    return {
      ok: false,
      value: 0,
      error: `Amount must not exceed ${MAX_SINGLE_ENTRY_ML} ml.`,
    };
  }
  return { ok: true, value: Math.round(n), error: '' };
}

// Validate a daily goal. Returns { ok, value, error }.
export function validateGoal(input) {
  const n = Number(input);
  if (!Number.isFinite(n) || n <= 0) {
    return { ok: false, value: DEFAULT_GOAL_ML, error: 'Goal must be greater than 0.' };
  }
  if (n > MAX_DAILY_GOAL_ML) {
    return {
      ok: false,
      value: DEFAULT_GOAL_ML,
      error: `Goal should not exceed ${MAX_DAILY_GOAL_ML} ml.`,
    };
  }
  if (n < MIN_DAILY_GOAL_ML) {
    return { ok: false, value: DEFAULT_GOAL_ML, error: 'Goal is too small.' };
  }
  return { ok: true, value: Math.round(n), error: '' };
}

export function sourceLabel(source) {
  if (source === 'tile') return 'Tile';
  if (source === 'quick') return 'Quick add';
  if (source === 'custom') return 'Custom';
  return 'Entry';
}

// Format ml with a thousands separator.
export function formatMl(ml) {
  const n = Math.max(0, Math.round(Number(ml) || 0));
  return n.toLocaleString('en-US');
}
