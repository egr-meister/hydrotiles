// Statistics — simple tile-style weekly progress summary.
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useApp } from '../context/AppContext';
import { colors, spacing, radius, font } from '../theme';
import { Card } from '../components/ui';
import { weeklyStats, formatMl } from '../utils/calc';
import { formatShortDate } from '../utils/date';

export default function StatisticsScreen() {
  const { entries, settings } = useApp();
  const stats = weeklyStats(entries, settings);

  const maxTiles = Math.max(1, ...stats.days.map((d) => d.filledTiles));

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Summary tiles */}
        <View style={styles.summaryGrid}>
          <SummaryCell label="Today" value={`${formatMl(stats.todayTotal)} ml`} />
          <SummaryCell label="7-day total" value={`${formatMl(stats.weekTotalMl)} ml`} />
          <SummaryCell label="Daily average" value={`${formatMl(stats.dailyAverage)} ml`} />
          <SummaryCell
            label="Best day"
            value={
              stats.bestDay.totalMl > 0
                ? `${formatMl(stats.bestDay.totalMl)} ml`
                : '—'
            }
          />
          <SummaryCell label="Goal days" value={`${stats.goalDays} of 7`} />
          <SummaryCell
            label="Tiles this week"
            value={`${stats.totalTilesFilled}`}
          />
        </View>

        <Card>
          <Text style={styles.chartTitle}>Filled tiles per day</Text>
          {stats.days.map((d) => (
            <View key={d.dateStr} style={styles.barRow}>
              <Text style={styles.barLabel}>{formatShortDate(d.dateStr)}</Text>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    {
                      width: `${Math.round((d.filledTiles / maxTiles) * 100)}%`,
                    },
                    d.goalReached && styles.barFillGoal,
                  ]}
                />
              </View>
              <Text style={styles.barValue}>{d.filledTiles}</Text>
            </View>
          ))}
        </Card>

        <Card>
          <Text style={styles.line}>
            Tiles filled this week: {stats.totalTilesFilled}
          </Text>
          <Text style={styles.line}>
            Average filled tiles per day: {stats.avgTilesPerDay}
          </Text>
          <Text style={styles.line}>
            Daily average: {formatMl(stats.dailyAverage)} ml
          </Text>
          <Text style={styles.line}>Goal days: {stats.goalDays} of 7</Text>
        </Card>

        <Text style={styles.footNote}>
          Statistics are calculated from your manual entries stored on this
          device.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function SummaryCell({ label, value }) {
  return (
    <View style={styles.summaryCell}>
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingBottom: spacing.xxl },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  summaryCell: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.divider,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  summaryValue: { fontSize: font.heading, fontWeight: '800', color: colors.text },
  summaryLabel: { fontSize: font.small, color: colors.textSecondary, marginTop: 2 },
  chartTitle: {
    fontSize: font.body,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  barRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  barLabel: { width: 52, fontSize: font.small, color: colors.textSecondary },
  barTrack: {
    flex: 1,
    height: 16,
    backgroundColor: colors.board,
    borderRadius: radius.sm,
    overflow: 'hidden',
    marginHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: colors.boardBorder,
  },
  barFill: {
    height: '100%',
    backgroundColor: colors.tileEmptyBorder,
    borderRadius: radius.sm,
  },
  barFillGoal: { backgroundColor: colors.tileFilled },
  barValue: {
    width: 26,
    textAlign: 'right',
    fontSize: font.small,
    color: colors.text,
    fontWeight: '700',
  },
  line: { fontSize: font.body, color: colors.text, marginBottom: spacing.sm },
  footNote: {
    fontSize: font.small,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
