// Calendar — a month of water tiles. Each day is a tile cell.
import React, { useState } from 'react';
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
import { progressLevel } from '../utils/calc';
import {
  buildMonthGrid,
  monthLabel,
  WEEKDAY_SHORT,
  todayString,
} from '../utils/date';

export default function CalendarScreen({ navigation }) {
  const { entries, settings } = useApp();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth()); // 0-11

  const today = todayString();
  const weeks = buildMonthGrid(year, month);

  const goPrev = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };
  const goNext = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.monthHeader}>
          <TouchableOpacity onPress={goPrev} style={styles.navBtn}>
            <Text style={styles.navText}>{'‹'}</Text>
          </TouchableOpacity>
          <Text style={styles.monthTitle}>{monthLabel(year, month)}</Text>
          <TouchableOpacity onPress={goNext} style={styles.navBtn}>
            <Text style={styles.navText}>{'›'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.weekdays}>
          {WEEKDAY_SHORT.map((d, i) => (
            <Text key={i} style={styles.weekday}>
              {d}
            </Text>
          ))}
        </View>

        {weeks.map((week, wi) => (
          <View key={wi} style={styles.weekRow}>
            {week.map((cell, ci) => {
              if (!cell) {
                return <View key={ci} style={styles.cellBlank} />;
              }
              const level = progressLevel(entries, cell.dateStr, settings);
              const isToday = cell.dateStr === today;
              return (
                <TouchableOpacity
                  key={ci}
                  activeOpacity={0.7}
                  onPress={() =>
                    navigation.navigate('DayDetail', { date: cell.dateStr })
                  }
                  style={[
                    styles.cell,
                    level === 'empty' && styles.cellEmpty,
                    level === 'partial' && styles.cellPartial,
                    level === 'goal' && styles.cellGoal,
                    isToday && styles.cellToday,
                  ]}
                >
                  <Text
                    style={[
                      styles.cellNum,
                      level === 'goal' && styles.cellNumOnFilled,
                    ]}
                  >
                    {cell.day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}

        <View style={styles.legend}>
          <LegendItem style={styles.cellEmpty} label="Empty" />
          <LegendItem style={styles.cellPartial} label="Partial" />
          <LegendItem style={styles.cellGoal} label="Goal reached" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function LegendItem({ style, label }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendSwatch, style]} />
      <Text style={styles.legendLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  navBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.board,
    borderWidth: 1,
    borderColor: colors.boardBorder,
  },
  navText: { fontSize: 22, color: colors.text, fontWeight: '700' },
  monthTitle: { fontSize: font.heading, fontWeight: '700', color: colors.text },
  weekdays: { flexDirection: 'row', marginBottom: spacing.xs },
  weekday: {
    flex: 1,
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: font.small,
    fontWeight: '700',
  },
  weekRow: { flexDirection: 'row', marginBottom: 6 },
  cellBlank: { flex: 1, aspectRatio: 1, margin: 3 },
  cell: {
    flex: 1,
    aspectRatio: 1,
    margin: 3,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  cellEmpty: {
    backgroundColor: colors.background,
    borderColor: colors.tileEmptyBorder,
  },
  cellPartial: {
    backgroundColor: colors.tileEmpty,
    borderColor: colors.tileEmptyBorder,
  },
  cellGoal: {
    backgroundColor: colors.tileFilled,
    borderColor: colors.tileFilledBorder,
  },
  cellToday: {
    borderColor: colors.accent,
    borderWidth: 2,
  },
  cellNum: { fontSize: font.small, color: colors.text, fontWeight: '600' },
  cellNumOnFilled: { color: colors.white },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.lg,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  legendSwatch: {
    width: 16,
    height: 16,
    borderRadius: 5,
    borderWidth: 1,
    marginRight: 6,
  },
  legendLabel: { fontSize: font.small, color: colors.textSecondary },
});
