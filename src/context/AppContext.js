// Central app state backed by AsyncStorage. Loads once, persists on change.
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';
import { loadAppData, saveAppData, clearAppData } from '../storage/store';
import { defaultAppData, mergeAppData } from '../storage/defaults';
import { computeStreaks, makeId } from '../utils/calc';
import { todayString, nowTimeString } from '../utils/date';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [appData, setAppData] = useState(() => mergeAppData(defaultAppData));
  const [loading, setLoading] = useState(true);

  // Initial load.
  useEffect(() => {
    let active = true;
    (async () => {
      const data = await loadAppData();
      const withStreak = withRecalculatedStreak(data);
      if (active) {
        setAppData(withStreak);
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Persist helper: update state and write to storage.
  const commit = useCallback((updater) => {
    setAppData((prev) => {
      const base = mergeAppData(prev);
      const next = typeof updater === 'function' ? updater(base) : updater;
      const merged = withRecalculatedStreak(mergeAppData(next));
      // Fire and forget; storage layer never throws.
      saveAppData(merged);
      return merged;
    });
  }, []);

  // ---- Settings ----
  const updateSettings = useCallback(
    (partial) => {
      commit((prev) => ({
        ...prev,
        settings: { ...prev.settings, ...partial },
      }));
    },
    [commit]
  );

  const updateReminders = useCallback(
    (partial) => {
      commit((prev) => ({
        ...prev,
        settings: {
          ...prev.settings,
          reminders: { ...prev.settings.reminders, ...partial },
        },
      }));
    },
    [commit]
  );

  const completeOnboarding = useCallback(() => {
    updateSettings({ onboardingCompleted: true });
  }, [updateSettings]);

  const showOnboardingAgain = useCallback(() => {
    updateSettings({ onboardingCompleted: false });
  }, [updateSettings]);

  // ---- Entries ----
  const addEntry = useCallback(
    ({ date, time, amountMl, source = 'quick', label = '' }) => {
      const nowIso = new Date().toISOString();
      const entry = {
        id: makeId(),
        date: date || todayString(),
        time: time || nowTimeString(),
        amountMl: Math.max(0, Math.round(Number(amountMl) || 0)),
        source,
        label: typeof label === 'string' ? label : '',
        createdAt: nowIso,
        updatedAt: nowIso,
      };
      commit((prev) => ({ ...prev, entries: [...prev.entries, entry] }));
      return entry;
    },
    [commit]
  );

  const updateEntry = useCallback(
    (id, changes) => {
      commit((prev) => ({
        ...prev,
        entries: prev.entries.map((e) =>
          e?.id === id
            ? {
                ...e,
                ...changes,
                amountMl:
                  changes?.amountMl !== undefined
                    ? Math.max(0, Math.round(Number(changes.amountMl) || 0))
                    : e.amountMl,
                updatedAt: new Date().toISOString(),
              }
            : e
        ),
      }));
    },
    [commit]
  );

  const deleteEntry = useCallback(
    (id) => {
      commit((prev) => ({
        ...prev,
        entries: prev.entries.filter((e) => e?.id !== id),
      }));
    },
    [commit]
  );

  // Remove the most recently created entry for a date (undo last).
  const undoLast = useCallback(
    (dateStr) => {
      commit((prev) => {
        const forDay = prev.entries
          .filter((e) => e?.date === dateStr)
          .sort((a, b) =>
            String(a?.createdAt).localeCompare(String(b?.createdAt))
          );
        if (forDay.length === 0) return prev;
        const lastId = forDay[forDay.length - 1].id;
        return {
          ...prev,
          entries: prev.entries.filter((e) => e?.id !== lastId),
        };
      });
    },
    [commit]
  );

  const resetDay = useCallback(
    (dateStr) => {
      commit((prev) => ({
        ...prev,
        entries: prev.entries.filter((e) => e?.date !== dateStr),
      }));
    },
    [commit]
  );

  const deleteAllEntries = useCallback(() => {
    commit((prev) => ({ ...prev, entries: [] }));
  }, [commit]);

  const resetAllData = useCallback(async () => {
    await clearAppData();
    setAppData(mergeAppData(defaultAppData));
  }, []);

  const value = useMemo(
    () => ({
      loading,
      appData,
      settings: appData.settings,
      entries: appData.entries,
      streak: appData.streak,
      updateSettings,
      updateReminders,
      completeOnboarding,
      showOnboardingAgain,
      addEntry,
      updateEntry,
      deleteEntry,
      undoLast,
      resetDay,
      deleteAllEntries,
      resetAllData,
    }),
    [
      loading,
      appData,
      updateSettings,
      updateReminders,
      completeOnboarding,
      showOnboardingAgain,
      addEntry,
      updateEntry,
      deleteEntry,
      undoLast,
      resetDay,
      deleteAllEntries,
      resetAllData,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

function withRecalculatedStreak(data) {
  const safe = mergeAppData(data);
  const streak = computeStreaks(safe.entries, safe.settings);
  return { ...safe, streak };
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    // Should never happen, but return a safe no-op shape.
    return {
      loading: true,
      appData: mergeAppData(defaultAppData),
      settings: mergeAppData(defaultAppData).settings,
      entries: [],
      streak: { current: 0, best: 0 },
      updateSettings: () => {},
      updateReminders: () => {},
      completeOnboarding: () => {},
      showOnboardingAgain: () => {},
      addEntry: () => {},
      updateEntry: () => {},
      deleteEntry: () => {},
      undoLast: () => {},
      resetDay: () => {},
      deleteAllEntries: () => {},
      resetAllData: async () => {},
    };
  }
  return ctx;
}

export default AppContext;
