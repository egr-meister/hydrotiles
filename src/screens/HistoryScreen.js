// History — daily summaries in reverse chronological order.
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useApp } from '../context/AppContext';
import { colors, spacing, radius, font } from '../theme';
import { Card } from '../components/ui';
import { buildHistory, formatMl } from '../utils/calc';
import { formatDateLabel } from '../utils/date';

export default function HistoryScreen({ navigation }) {
  const { entries, settings } = useApp();
  const history = buildHistory(entries, settings);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        {history.length === 0 ? (
          <Card>
            <Text style={styles.empty}>No tile history yet.</Text>
            <Text style={styles.emptySub}>
              Fill some tiles on the home board to build your history.
            </Text>
          </Card>
        ) : (
          history.map((day) => (
            <TouchableOpacity
              key={day.dateStr}
              activeOpacity={0.7}
              onPress={() =>
                navigation.navigate('DayDetail', { date: day.dateStr })
              }
              style={styles.card}
            >
              <View style={styles.rowTop}>
                <Text style={styles.date}>{formatDateLabel(day.dateStr)}</Text>
                {day.goalReached ? (
                  <View style={styles.goalBadge}>
                    <Text style={styles.goalBadgeText}>Goal</Text>
                  </View>
                ) : null}
              </View>

              <Text style={styles.total}>{formatMl(day.totalMl)} ml</Text>

              {/* Mini tile strip */}
              <View style={styles.strip}>
                {buildStrip(day.filledTiles, day.totalTiles).map((f, i) => (
                  <View
                    key={i}
                    style={[styles.stripTile, f ? styles.stripFilled : styles.stripEmpty]}
                  />
                ))}
              </View>

              <Text style={styles.meta}>
                {day.filledTiles} of {day.totalTiles} tiles · {day.entryCount}{' '}
                {day.entryCount === 1 ? 'entry' : 'entries'}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// Build up to 20 strip cells representing filled/total ratio.
function buildStrip(filled, total) {
  const safeTotal = Math.max(1, Number(total) || 1);
  const cells = Math.min(20, safeTotal);
  const filledCells = Math.round((Math.max(0, Number(filled) || 0) / safeTotal) * cells);
  const out = [];
  for (let i = 0; i < cells; i++) out.push(i < filledCells);
  return out;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingBottom: spacing.xxl },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.divider,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: { fontSize: font.body, fontWeight: '700', color: colors.text },
  goalBadge: {
    backgroundColor: colors.accentSoft,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: colors.boardBorder,
  },
  goalBadgeText: { fontSize: font.tiny, color: colors.goalReached, fontWeight: '700' },
  total: { fontSize: font.heading, color: colors.text, fontWeight: '700', marginTop: spacing.xs },
  strip: { flexDirection: 'row', marginTop: spacing.sm, flexWrap: 'wrap' },
  stripTile: { width: 12, height: 12, borderRadius: 3, marginRight: 3, marginBottom: 3 },
  stripFilled: { backgroundColor: colors.tileFilled },
  stripEmpty: { backgroundColor: colors.tileEmpty },
  meta: { fontSize: font.small, color: colors.textSecondary, marginTop: spacing.sm },
  empty: { fontSize: font.body, color: colors.text, fontWeight: '600' },
  emptySub: { fontSize: font.small, color: colors.textSecondary, marginTop: spacing.xs },
});
