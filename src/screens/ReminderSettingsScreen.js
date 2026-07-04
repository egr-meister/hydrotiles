// Reminder Settings — in-app reminder cards only (no phone notifications).
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useApp } from '../context/AppContext';
import { colors, spacing, font } from '../theme';
import { Card, ToggleRow, Note } from '../components/ui';

export default function ReminderSettingsScreen() {
  const { settings, updateReminders } = useApp();
  const reminders = settings?.reminders ?? {
    enabled: true,
    morningEnabled: true,
    afternoonEnabled: true,
    eveningEnabled: true,
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Note>
          These are in-app reminder cards only. They do not send phone
          notifications, and they appear only while the app is open.
        </Note>

        <Card>
          <ToggleRow
            label="Reminders enabled"
            note="Turn all in-app reminder cards on or off."
            value={Boolean(reminders.enabled)}
            onToggle={() => updateReminders({ enabled: !reminders.enabled })}
          />
          <ToggleRow
            label="Morning reminder"
            note="After 11:00 if no tiles are filled yet."
            value={Boolean(reminders.morningEnabled)}
            onToggle={() =>
              updateReminders({ morningEnabled: !reminders.morningEnabled })
            }
          />
          <ToggleRow
            label="Afternoon reminder"
            note="After 16:00 if the board is below half full."
            value={Boolean(reminders.afternoonEnabled)}
            onToggle={() =>
              updateReminders({ afternoonEnabled: !reminders.afternoonEnabled })
            }
          />
          <ToggleRow
            label="Evening reminder"
            note="After 19:00 if the daily goal is not reached."
            value={Boolean(reminders.eveningEnabled)}
            onToggle={() =>
              updateReminders({ eveningEnabled: !reminders.eveningEnabled })
            }
          />
        </Card>

        <Text style={styles.foot}>
          Reminder cards are calm and non-urgent. HydroTiles never uses system
          notifications, background services, or alarm permissions.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingBottom: spacing.xxl },
  foot: {
    fontSize: font.small,
    color: colors.textSecondary,
    lineHeight: 19,
    marginTop: spacing.sm,
  },
});
