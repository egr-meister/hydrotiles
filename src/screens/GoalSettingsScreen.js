// Goal Settings — edit the daily water goal.
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useApp } from '../context/AppContext';
import { colors, spacing, radius, font } from '../theme';
import { Card, PrimaryButton, SecondaryButton, Chip } from '../components/ui';
import { validateGoal, safeGoalMl, safeTileSizeMl } from '../utils/calc';
import { DEFAULT_GOAL_ML } from '../storage/defaults';

const GOAL_PRESETS = [1500, 2000, 2500, 3000];

export default function GoalSettingsScreen({ navigation }) {
  const { settings, updateSettings } = useApp();
  const currentGoal = safeGoalMl(settings);
  const tileSize = safeTileSizeMl(settings);

  const [goal, setGoal] = useState(String(currentGoal));
  const [error, setError] = useState('');

  const save = (value) => {
    const check = validateGoal(value);
    if (!check.ok) {
      setError(check.error);
      return;
    }
    setError('');
    updateSettings({ dailyGoalMl: check.value });
    navigation.goBack();
  };

  const previewTiles = (() => {
    const n = Number(goal);
    if (!Number.isFinite(n) || n <= 0) return '—';
    return Math.max(1, Math.ceil(n / tileSize));
  })();

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <Card>
            <Text style={styles.fieldLabel}>Daily goal (ml)</Text>
            <TextInput
              style={styles.input}
              value={goal}
              onChangeText={setGoal}
              keyboardType="number-pad"
              placeholder="2000"
              placeholderTextColor={colors.textSecondary}
            />
            <View style={styles.chips}>
              {GOAL_PRESETS.map((g) => (
                <Chip
                  key={g}
                  label={`${g} ml`}
                  selected={String(g) === goal}
                  onPress={() => {
                    setGoal(String(g));
                    setError('');
                  }}
                />
              ))}
            </View>
            <Text style={styles.preview}>
              {previewTiles} tiles at {tileSize} ml each.
            </Text>
            {error ? <Text style={styles.error}>{error}</Text> : null}
          </Card>

          <PrimaryButton title="Save Goal" onPress={() => save(goal)} />
          <SecondaryButton
            title="Reset to default (2000 ml)"
            onPress={() => {
              setGoal(String(DEFAULT_GOAL_ML));
              save(DEFAULT_GOAL_ML);
            }}
            style={{ marginTop: spacing.sm }}
          />

          <Text style={styles.foot}>
            Goal must be greater than 0 and should not exceed 10000 ml.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingBottom: spacing.xxl },
  fieldLabel: {
    fontSize: font.small,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    fontSize: font.body,
    color: colors.text,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.md },
  preview: { fontSize: font.small, color: colors.text, fontWeight: '600', marginTop: spacing.xs },
  error: { color: colors.danger, fontSize: font.small, marginTop: spacing.sm },
  foot: {
    fontSize: font.small,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
