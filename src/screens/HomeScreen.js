// HydroTiles Home — the daily water tile board (primary screen).
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import { useApp } from '../context/AppContext';
import { colors, spacing, radius, font } from '../theme';
import TileGrid from '../components/TileGrid';
import ReminderCard from '../components/ReminderCard';
import { PrimaryButton, SecondaryButton } from '../components/ui';
import {
  dayProgress,
  buildReminders,
  entriesForDate,
  formatMl,
} from '../utils/calc';
import { todayString, formatDateLabel } from '../utils/date';

export default function HomeScreen({ navigation }) {
  const {
    settings,
    entries,
    streak,
    addEntry,
    deleteEntry,
    undoLast,
  } = useApp();

  const [tick, setTick] = useState(0);
  const today = todayString();

  // Refresh reminders/time-based UI whenever the screen regains focus.
  useFocusEffect(
    useCallback(() => {
      setTick((t) => t + 1);
    }, [])
  );

  const progress = dayProgress(entries, today, settings);
  const reminders = buildReminders(entries, settings, new Date());

  const fillOneTile = () => {
    if (progress.filledTiles >= progress.totalTiles) return; // no negative/over
    addEntry({
      date: today,
      amountMl: progress.tileSizeMl,
      source: 'tile',
      label: '',
    });
    setTick((t) => t + 1);
  };

  // Unfill: remove the most recent tile/quick entry for today, if any.
  const unfillOneTile = () => {
    const forDay = entriesForDate(entries, today)
      .filter((e) => e?.source === 'tile' || e?.source === 'quick')
      .sort((a, b) => String(a?.createdAt).localeCompare(String(b?.createdAt)));
    if (forDay.length === 0) return;
    deleteEntry(forDay[forDay.length - 1].id);
    setTick((t) => t + 1);
  };

  const hasEntries = progress.entryCount > 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Compact top header: title + settings icon */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>HydroTiles</Text>
          <Text style={styles.subBrand}>Manual tile tracker</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Settings')}
          style={styles.iconBtn}
          activeOpacity={0.7}
        >
          <Text style={styles.iconGear}>⚙</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {reminders.map((msg, i) => (
          <ReminderCard key={`r-${i}`} message={msg} />
        ))}

        {/* Board label row */}
        <View style={styles.boardLabelRow}>
          <Text style={styles.dateLabel}>{formatDateLabel(today)}</Text>
          <Text style={styles.tileSizeLabel}>
            Each tile = {progress.tileSizeMl} ml
          </Text>
        </View>

        {/* Quiet total/goal labels above the grid */}
        <View style={styles.totalsRow}>
          <Text style={styles.totalMl}>
            {formatMl(progress.totalMl)} of {formatMl(progress.goalMl)} ml
          </Text>
          <Text
            style={[
              styles.percent,
              progress.goalReached && styles.percentGoal,
            ]}
          >
            {progress.goalReached ? 'Goal reached' : `${progress.percent}%`}
          </Text>
        </View>

        {/* The tile board — main visual object */}
        <TileGrid
          visibleTiles={progress.visibleTiles}
          visibleFilled={progress.visibleFilled}
          layout={settings?.compactMode ? 'compact' : settings?.tileLayout}
          onFill={fillOneTile}
          onUnfill={unfillOneTile}
          interactive
        />

        {progress.tooManyTiles ? (
          <Text style={styles.warnText}>
            This goal creates {progress.totalTiles} tiles. Showing the first{' '}
            {progress.visibleTiles}. Increase tile size in Tile Settings for a
            cleaner board.
          </Text>
        ) : null}

        <Text style={styles.filledCount}>
          {progress.filledTiles} of {progress.totalTiles} tiles filled
        </Text>

        {!hasEntries ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No tiles filled today.</Text>
            <Text style={styles.emptySub}>Tap a tile to start.</Text>
          </View>
        ) : null}

        {/* Board controls */}
        <View style={styles.controlsRow}>
          <PrimaryButton
            title="Fill one tile"
            onPress={fillOneTile}
            style={styles.flexBtn}
          />
          <SecondaryButton
            title="Custom amount"
            onPress={() =>
              navigation.navigate('AddEntry', { mode: 'add', date: today })
            }
            style={[styles.flexBtn, { marginLeft: spacing.sm }]}
          />
        </View>

        {hasEntries ? (
          <SecondaryButton
            title="Undo last tile"
            onPress={() => {
              undoLast(today);
              setTick((t) => t + 1);
            }}
            style={{ marginTop: spacing.sm }}
          />
        ) : null}

        {/* Streak note — quiet, not a reward badge */}
        <View style={styles.streakNote}>
          <Text style={styles.streakText}>
            Current streak: {streak?.current ?? 0}{' '}
            {(streak?.current ?? 0) === 1 ? 'day' : 'days'}
            {'   ·   '}Best: {streak?.best ?? 0}
          </Text>
          {!progress.goalReached ? (
            <Text style={styles.streakHint}>
              Fill today's tiles to continue your streak.
            </Text>
          ) : null}
        </View>

        {/* Board shortcuts */}
        <View style={styles.shortcutRow}>
          <MiniShortcut
            label="Calendar"
            onPress={() => navigation.navigate('Calendar')}
          />
          <MiniShortcut
            label="History"
            onPress={() => navigation.navigate('History')}
          />
          <MiniShortcut
            label="Stats"
            onPress={() => navigation.navigate('Statistics')}
          />
          <MiniShortcut
            label="Today"
            onPress={() =>
              navigation.navigate('DayDetail', { date: today })
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MiniShortcut({ label, onPress }) {
  return (
    <TouchableOpacity
      style={styles.shortcut}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={styles.shortcutTileMark} />
      <Text style={styles.shortcutLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  brand: { fontSize: font.title, fontWeight: '800', color: colors.text },
  subBrand: { fontSize: font.small, color: colors.textSecondary, marginTop: 2 },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.board,
    borderWidth: 1,
    borderColor: colors.boardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconGear: { fontSize: 20, color: colors.text },
  content: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxl },
  boardLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  dateLabel: { fontSize: font.small, color: colors.textSecondary, fontWeight: '600' },
  tileSizeLabel: { fontSize: font.small, color: colors.accent, fontWeight: '600' },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: spacing.sm,
  },
  totalMl: { fontSize: font.heading, color: colors.text, fontWeight: '700' },
  percent: { fontSize: font.body, color: colors.textSecondary, fontWeight: '700' },
  percentGoal: { color: colors.goalReached },
  filledCount: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: spacing.md,
    fontSize: font.body,
    fontWeight: '600',
  },
  warnText: {
    marginTop: spacing.sm,
    color: colors.danger,
    fontSize: font.small,
    lineHeight: 18,
  },
  emptyState: { alignItems: 'center', marginTop: spacing.sm },
  emptyTitle: { fontSize: font.body, color: colors.text, fontWeight: '600' },
  emptySub: { fontSize: font.small, color: colors.textSecondary, marginTop: 2 },
  controlsRow: { flexDirection: 'row', marginTop: spacing.lg },
  flexBtn: { flex: 1 },
  streakNote: {
    marginTop: spacing.lg,
    backgroundColor: colors.board,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.boardBorder,
    padding: spacing.md,
  },
  streakText: { color: colors.text, fontSize: font.body, fontWeight: '600' },
  streakHint: { color: colors.textSecondary, fontSize: font.small, marginTop: 4 },
  shortcutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  shortcut: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    marginHorizontal: 4,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  shortcutTileMark: {
    width: 18,
    height: 18,
    borderRadius: 5,
    backgroundColor: colors.tileFilled,
    marginBottom: 6,
  },
  shortcutLabel: { fontSize: font.small, color: colors.text, fontWeight: '600' },
});
