// The daily water tile board. Core visual object of the app.
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, radius, spacing, font } from '../theme';
import { MAX_VISIBLE_TILES } from '../storage/defaults';

// props:
//  visibleTiles: number of tiles to render
//  visibleFilled: number of tiles that appear filled
//  layout: 'compact' | 'comfortable'
//  onFill(index): tap an empty tile
//  onUnfill(index): tap a filled tile
//  interactive: boolean (default true)
export default function TileGrid({
  visibleTiles,
  visibleFilled,
  layout = 'comfortable',
  onFill,
  onUnfill,
  interactive = true,
}) {
  const total = Math.min(MAX_VISIBLE_TILES, Math.max(1, Number(visibleTiles) || 1));
  const filled = Math.min(total, Math.max(0, Number(visibleFilled) || 0));

  const compact = layout === 'compact';
  const tileSize = compact ? 34 : 52;
  const gap = compact ? 6 : 10;

  const tiles = [];
  for (let i = 0; i < total; i++) {
    const isFilled = i < filled;
    // The first empty tile is the "next" tile to fill; highlight subtly.
    const isNext = i === filled && interactive;
    tiles.push(
      <TouchableOpacity
        key={i}
        activeOpacity={interactive ? 0.7 : 1}
        disabled={!interactive}
        onPress={() => {
          if (!interactive) return;
          if (isFilled) {
            onUnfill && onUnfill(i);
          } else {
            onFill && onFill(i);
          }
        }}
        style={[
          styles.tile,
          {
            width: tileSize,
            height: tileSize,
            margin: gap / 2,
            borderRadius: compact ? 8 : radius.tile,
          },
          isFilled ? styles.tileFilled : styles.tileEmpty,
          isNext && styles.tileNext,
        ]}
      >
        {isFilled ? (
          <View
            style={[
              styles.drop,
              { width: tileSize * 0.28, height: tileSize * 0.28 },
            ]}
          />
        ) : null}
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.wrap}>
      <View style={[styles.grid, { padding: gap / 2 }]}>{tiles}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.board,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.boardBorder,
    padding: spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  tileEmpty: {
    backgroundColor: colors.tileEmpty,
    borderColor: colors.tileEmptyBorder,
  },
  tileFilled: {
    backgroundColor: colors.tileFilled,
    borderColor: colors.tileFilledBorder,
  },
  tileNext: {
    borderColor: colors.accent,
    borderWidth: 2,
  },
  drop: {
    backgroundColor: colors.white,
    opacity: 0.85,
    borderRadius: 999,
  },
});
