// Welcome / Onboarding — shown only on first launch.
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { colors, spacing, radius, font } from '../theme';
import { PrimaryButton, SecondaryButton, Note } from '../components/ui';
import TileGrid from '../components/TileGrid';

export default function OnboardingScreen({ navigation }) {
  const { completeOnboarding } = useApp();

  const finish = () => {
    completeOnboarding();
    navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.brand}>HydroTiles</Text>
        <Text style={styles.tagline}>Fill your day with water tiles.</Text>

        <View style={styles.gridWrap}>
          <TileGrid
            visibleTiles={9}
            visibleFilled={5}
            layout="comfortable"
            interactive={false}
          />
        </View>

        <View style={styles.block}>
          <Text style={styles.point}>Each tile represents part of your daily goal.</Text>
          <Text style={styles.point}>Tap tiles as you drink to fill your board.</Text>
          <Text style={styles.point}>No sensors. No Health Connect. No account. Works offline.</Text>
        </View>

        <Note>
          HydroTiles is a manual water tracker. It does not detect drinking
          automatically and does not connect to Health Connect, Google Fit,
          sensors, or wearable devices.
        </Note>

        <Note>
          Everything is stored only on this device. No internet connection is
          used and no notification permission is requested.
        </Note>

        <PrimaryButton
          title="Start Filling Tiles"
          onPress={finish}
          style={{ marginTop: spacing.md }}
        />
        <SecondaryButton
          title="Skip"
          onPress={finish}
          style={{ marginTop: spacing.sm }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingBottom: spacing.xxl },
  brand: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  tagline: {
    fontSize: font.heading,
    color: colors.accent,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
    fontWeight: '600',
  },
  gridWrap: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  block: { marginBottom: spacing.md },
  point: {
    fontSize: font.body,
    color: colors.text,
    lineHeight: 24,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
});
