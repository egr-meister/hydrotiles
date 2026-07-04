// Day Detail — grid, totals, and full entry list for a selected date.
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useApp } from '../context/AppContext';
import { colors, spacing, radius, font } from '../theme';
import TileGrid from '../components/TileGrid';
import { PrimaryButton, SecondaryButton, Card } from '../components/ui';
import {
  dayProgress,
  entriesForDate,
  formatMl,
  sourceLabel,
} from '../utils/calc';
import {
  todayString,
  formatDateLabel,
  isValidDateString,
} from '../utils/date';

export default function DayDetailScreen({ navigation, route }) {
  const { settings, entries, addEntry, deleteEntry, resetDay } = useApp();

  const params = route?.params ?? {};
  const dateStr = isValidDateString(params.date) ? params.date : todayString();

  const progress = dayProgress(entries, dateStr, settings);
  const dayEntries = entriesForDate(entries, dateStr)
    .slice()
    .sort((a, b) => String(a?.time).localeCompare(String(b?.time)));

  const fillOneTile = () => {
    if (progress.filledTiles >= progress.totalTiles) return;
    addEntry({
      date: dateStr,
      amountMl: progress.tileSizeMl,
      source: 'tile',
      label: '',
    });
  };

  const confirmReset = () => {
    Alert.alert(
      'Reset this day?',
      'This will remove all water entries for the selected day.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => resetDay(dateStr),
        },
      ],
      { cancelable: true }
    );
  };

  const confirmDeleteEntry = (id) => {
    Alert.alert(
      'Delete entry?',
      'This will remove this water entry.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteEntry(id) },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.date}>{formatDateLabel(dateStr)}</Text>

        <View style={styles.totalsRow}>
          <Text style={styles.total}>
            {formatMl(progress.totalMl)} of {formatMl(progress.goalMl)} ml
          </Text>
          <Text
            style={[styles.percent, progress.goalReached && styles.goalText]}
          >
            {progress.goalReached ? 'Goal reached' : `${progress.percent}%`}
          </Text>
        </View>

        <TileGrid
          visibleTiles={progress.visibleTiles}
          visibleFilled={progress.visibleFilled}
          layout={settings?.compactMode ? 'compact' : settings?.tileLayout}
          onFill={fillOneTile}
          onUnfill={() => {}}
          interactive
        />

        <Text style={styles.filled}>
          {progress.filledTiles} of {progress.totalTiles} tiles filled
        </Text>

        <View style={styles.controls}>
          <PrimaryButton
            title="Fill one tile"
            onPress={fillOneTile}
            style={styles.flexBtn}
          />
          <SecondaryButton
            title="Add custom"
            onPress={() =>
              navigation.navigate('AddEntry', { mode: 'add', date: dateStr })
            }
            style={[styles.flexBtn, { marginLeft: spacing.sm }]}
          />
        </View>

        <Text style={styles.listTitle}>Entries</Text>

        {dayEntries.length === 0 ? (
          <Card>
            <Text style={styles.empty}>No water entries for this day.</Text>
          </Card>
        ) : (
          dayEntries.map((e) => (
            <TouchableOpacity
              key={e.id}
              activeOpacity={0.7}
              onPress={() =>
                navigation.navigate('AddEntry', {
                  mode: 'edit',
                  entryId: e.id,
                })
              }
              style={styles.entryRow}
            >
              <View style={styles.entryLeft}>
                <View style={styles.entryTile} />
                <View>
                  <Text style={styles.entryAmount}>
                    {formatMl(e.amountMl)} ml
                  </Text>
                  <Text style={styles.entryMeta}>
                    {e.time} · {sourceLabel(e.source)}
                    {e.label ? ` · ${e.label}` : ''}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => confirmDeleteEntry(e.id)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.deleteX}>✕</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}

        <SecondaryButton
          title="Reset this day"
          tone="danger"
          onPress={confirmReset}
          style={{ marginTop: spacing.lg }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingBottom: spacing.xxl },
  date: { fontSize: font.heading, fontWeight: '700', color: colors.text },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginVertical: spacing.md,
  },
  total: { fontSize: font.body, color: colors.text, fontWeight: '700' },
  percent: { fontSize: font.body, color: colors.textSecondary, fontWeight: '700' },
  goalText: { color: colors.goalReached },
  filled: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: spacing.md,
    fontWeight: '600',
    fontSize: font.body,
  },
  controls: { flexDirection: 'row', marginTop: spacing.lg },
  flexBtn: { flex: 1 },
  listTitle: {
    fontSize: font.small,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  empty: { color: colors.textSecondary, fontSize: font.body },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.divider,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  entryLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  entryTile: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: colors.tileFilled,
    marginRight: spacing.md,
  },
  entryAmount: { fontSize: font.body, color: colors.text, fontWeight: '700' },
  entryMeta: { fontSize: font.small, color: colors.textSecondary, marginTop: 2 },
  deleteX: {
    fontSize: 16,
    color: colors.danger,
    paddingHorizontal: spacing.sm,
    fontWeight: '700',
  },
});
