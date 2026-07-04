// Tile Settings — choose tile size and layout.
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useApp } from '../context/AppContext';
import { colors, spacing, radius, font } from '../theme';
import {
  Card,
  SectionTitle,
  Chip,
  SecondaryButton,
  Note,
} from '../components/ui';
import TileGrid from '../components/TileGrid';
import {
  TILE_SIZE_OPTIONS,
  DEFAULT_TILE_SIZE_ML,
} from '../storage/defaults';
import { safeGoalMl, safeTileSizeMl } from '../utils/calc';

export default function TileSettingsScreen() {
  const { settings, updateSettings } = useApp();

  const tileSize = safeTileSizeMl(settings);
  const goalMl = safeGoalMl(settings);
  const layout = settings?.compactMode ? 'compact' : settings?.tileLayout ?? 'comfortable';

  const totalTiles = Math.max(1, Math.ceil(goalMl / tileSize));
  const previewTiles = Math.min(12, totalTiles);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <SectionTitle>Tile size</SectionTitle>
        <Card>
          <Text style={styles.help}>
            One tile represents this much water. Your entries are stored as real
            ml, so changing tile size never corrupts past days.
          </Text>
          <View style={styles.chips}>
            {TILE_SIZE_OPTIONS.map((size) => (
              <Chip
                key={size}
                label={`${size} ml`}
                selected={tileSize === size}
                onPress={() => updateSettings({ tileSizeMl: size })}
              />
            ))}
          </View>
          <Text style={styles.summary}>
            Current goal of {goalMl} ml = {totalTiles} tiles.
          </Text>
        </Card>

        <SectionTitle>Tile layout</SectionTitle>
        <Card>
          <View style={styles.chips}>
            <Chip
              label="Comfortable"
              selected={settings?.tileLayout !== 'compact' && !settings?.compactMode}
              onPress={() =>
                updateSettings({ tileLayout: 'comfortable', compactMode: false })
              }
            />
            <Chip
              label="Compact"
              selected={settings?.tileLayout === 'compact' || settings?.compactMode}
              onPress={() => updateSettings({ tileLayout: 'compact' })}
            />
          </View>
          <Text style={styles.previewLabel}>Preview</Text>
          <TileGrid
            visibleTiles={previewTiles}
            visibleFilled={Math.ceil(previewTiles / 2)}
            layout={layout}
            interactive={false}
          />
        </Card>

        {totalTiles > 100 ? (
          <Note>
            This goal and tile size create {totalTiles} tiles. The board shows
            up to 100. Choose a larger tile size for a cleaner board.
          </Note>
        ) : null}

        <SecondaryButton
          title="Reset tile size to default (250 ml)"
          onPress={() =>
            updateSettings({
              tileSizeMl: DEFAULT_TILE_SIZE_ML,
              tileLayout: 'comfortable',
              compactMode: false,
            })
          }
          style={{ marginTop: spacing.md }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingBottom: spacing.xxl },
  help: { fontSize: font.small, color: colors.textSecondary, lineHeight: 19, marginBottom: spacing.md },
  chips: { flexDirection: 'row', flexWrap: 'wrap' },
  summary: { fontSize: font.small, color: colors.text, marginTop: spacing.sm, fontWeight: '600' },
  previewLabel: {
    fontSize: font.small,
    color: colors.textSecondary,
    fontWeight: '700',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
});
