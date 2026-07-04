// Add / Edit a manual water entry.
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useApp } from '../context/AppContext';
import { colors, spacing, radius, font } from '../theme';
import { PrimaryButton, SecondaryButton } from '../components/ui';
import {
  validateAmount,
  entriesForDate,
} from '../utils/calc';
import {
  todayString,
  nowTimeString,
  isValidDateString,
  isValidTimeString,
} from '../utils/date';

const QUICK_AMOUNTS = [150, 250, 330, 500];

export default function AddEntryScreen({ navigation, route }) {
  const { entries, addEntry, updateEntry, deleteEntry } = useApp();

  const params = route?.params ?? {};
  const editId = params.entryId ?? null;

  const existing = editId
    ? (Array.isArray(entries) ? entries : []).find((e) => e?.id === editId)
    : null;

  const isEdit = Boolean(existing);

  const [date, setDate] = useState(
    isValidDateString(existing?.date)
      ? existing.date
      : isValidDateString(params.date)
      ? params.date
      : todayString()
  );
  const [time, setTime] = useState(
    isValidTimeString(existing?.time) ? existing.time : nowTimeString()
  );
  const [amount, setAmount] = useState(
    existing?.amountMl ? String(existing.amountMl) : ''
  );
  const [label, setLabel] = useState(existing?.label ?? '');
  const [error, setError] = useState('');

  const save = () => {
    if (!isValidDateString(date)) {
      setError('Enter a valid date as YYYY-MM-DD.');
      return;
    }
    if (!isValidTimeString(time)) {
      setError('Enter a valid time as HH:mm (24-hour).');
      return;
    }
    const check = validateAmount(amount);
    if (!check.ok) {
      setError(check.error);
      return;
    }
    setError('');

    if (isEdit) {
      updateEntry(editId, {
        date,
        time,
        amountMl: check.value,
        label: label.trim(),
      });
    } else {
      addEntry({
        date,
        time,
        amountMl: check.value,
        source: 'custom',
        label: label.trim(),
      });
    }
    navigation.goBack();
  };

  const confirmDelete = () => {
    Alert.alert(
      'Delete entry?',
      'This will remove this water entry.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (editId) deleteEntry(editId);
            navigation.goBack();
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.heading}>
            {isEdit ? 'Edit water entry' : 'Add water entry'}
          </Text>

          <Text style={styles.fieldLabel}>Date (YYYY-MM-DD)</Text>
          <TextInput
            style={styles.input}
            value={date}
            onChangeText={setDate}
            placeholder="2026-07-03"
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="none"
            keyboardType="numbers-and-punctuation"
          />

          <Text style={styles.fieldLabel}>Time (HH:mm)</Text>
          <TextInput
            style={styles.input}
            value={time}
            onChangeText={setTime}
            placeholder="09:30"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numbers-and-punctuation"
          />

          <Text style={styles.fieldLabel}>Amount (ml)</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            placeholder="250"
            placeholderTextColor={colors.textSecondary}
            keyboardType="number-pad"
          />

          <View style={styles.quickRow}>
            {QUICK_AMOUNTS.map((q) => (
              <SecondaryButton
                key={q}
                title={`${q}`}
                onPress={() => setAmount(String(q))}
                style={styles.quickBtn}
              />
            ))}
          </View>

          <Text style={styles.fieldLabel}>Label (optional)</Text>
          <TextInput
            style={styles.input}
            value={label}
            onChangeText={setLabel}
            placeholder="Water, tea, etc."
            placeholderTextColor={colors.textSecondary}
            maxLength={40}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <PrimaryButton
            title="Save Entry"
            onPress={save}
            style={{ marginTop: spacing.lg }}
          />

          {isEdit ? (
            <SecondaryButton
              title="Delete Entry"
              tone="danger"
              onPress={confirmDelete}
              style={{ marginTop: spacing.sm }}
            />
          ) : null}

          <Text style={styles.hint}>
            Water entries are added manually.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingBottom: spacing.xxl },
  heading: {
    fontSize: font.heading,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.lg,
  },
  fieldLabel: {
    fontSize: font.small,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: spacing.xs,
    marginTop: spacing.md,
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
  quickRow: {
    flexDirection: 'row',
    marginTop: spacing.sm,
    justifyContent: 'space-between',
  },
  quickBtn: { flex: 1, marginHorizontal: 3, paddingHorizontal: 0 },
  error: {
    color: colors.danger,
    fontSize: font.small,
    marginTop: spacing.md,
  },
  hint: {
    color: colors.textSecondary,
    fontSize: font.small,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
