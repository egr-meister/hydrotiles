// Settings — shortcuts, data controls, disclaimers, privacy note.
import React from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useApp } from '../context/AppContext';
import { colors, spacing, font } from '../theme';
import {
  Card,
  SectionTitle,
  LinkRow,
  ToggleRow,
  Note,
} from '../components/ui';
import { safeGoalMl, safeTileSizeMl } from '../utils/calc';
import { todayString, formatDateLabel } from '../utils/date';

const APP_VERSION = '1.0.0';

export default function SettingsScreen({ navigation }) {
  const {
    settings,
    updateSettings,
    showOnboardingAgain,
    resetDay,
    deleteAllEntries,
    resetAllData,
  } = useApp();

  const goalMl = safeGoalMl(settings);
  const tileSize = safeTileSizeMl(settings);
  const today = todayString();

  const confirmResetToday = () => {
    Alert.alert(
      'Reset this day?',
      'This will remove all water entries for the selected day.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => resetDay(today),
        },
      ],
      { cancelable: true }
    );
  };

  const confirmDeleteAll = () => {
    Alert.alert(
      'Delete all water records?',
      'This removes every water entry on this device. Settings, goal, and reminders are kept.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete all',
          style: 'destructive',
          onPress: () => deleteAllEntries(),
        },
      ],
      { cancelable: true }
    );
  };

  const confirmResetAll = () => {
    Alert.alert(
      'Reset all local data?',
      'This restores HydroTiles to its default state and removes every entry and setting on this device.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset everything',
          style: 'destructive',
          onPress: async () => {
            await resetAllData();
            navigation.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
          },
        },
      ],
      { cancelable: true }
    );
  };

  const goShowOnboarding = () => {
    showOnboardingAgain();
    navigation.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <SectionTitle>Tracking</SectionTitle>
        <Card>
          <LinkRow
            label="Daily goal"
            value={`${goalMl} ml`}
            onPress={() => navigation.navigate('GoalSettings')}
          />
          <LinkRow
            label="Tile settings"
            value={`${tileSize} ml/tile`}
            onPress={() => navigation.navigate('TileSettings')}
          />
          <LinkRow
            label="Reminders"
            value={settings?.reminders?.enabled ? 'On' : 'Off'}
            onPress={() => navigation.navigate('ReminderSettings')}
          />
          <ToggleRow
            label="Compact mode"
            note="Smaller tiles for a denser board."
            value={Boolean(settings?.compactMode)}
            onToggle={() =>
              updateSettings({ compactMode: !settings?.compactMode })
            }
          />
        </Card>

        <SectionTitle>Data</SectionTitle>
        <Card>
          <LinkRow
            label="Reset selected day (today)"
            value={formatDateLabel(today)}
            onPress={confirmResetToday}
          />
          <LinkRow
            label="Delete all water records"
            onPress={confirmDeleteAll}
            tone="danger"
          />
          <LinkRow
            label="Reset all local data"
            onPress={confirmResetAll}
            tone="danger"
          />
          <LinkRow label="Show onboarding again" onPress={goShowOnboarding} />
        </Card>

        <SectionTitle>Manual tracking</SectionTitle>
        <Note>
          HydroTiles is a manual water tracker. It does not detect drinking
          automatically and does not connect to Health Connect, Google Fit,
          sensors, or wearable devices. Water entries are added manually.
        </Note>

        <SectionTitle>Privacy</SectionTitle>
        <Note>
          HydroTiles stores water entries, tile settings, goals, calendar
          progress, streaks, reminders, and statistics only on this device. No
          account, no ads, no analytics, no internet connection, no sensors, no
          Google Fit, no Health Connect, and no notification permission.
        </Note>

        <SectionTitle>App information</SectionTitle>
        <Card>
          <Text style={styles.info}>HydroTiles</Text>
          <Text style={styles.infoSub}>Version {APP_VERSION}</Text>
          <Text style={styles.infoSub}>
            Offline manual water tracker. Works fully in airplane mode.
          </Text>
          <Text style={styles.infoSub}>
            Not a medical, diagnostic, or sports-performance app.
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingBottom: spacing.xxl },
  info: { fontSize: font.body, fontWeight: '700', color: colors.text },
  infoSub: { fontSize: font.small, color: colors.textSecondary, marginTop: 4, lineHeight: 18 },
});
