// Gentle in-app reminder card. Never a system notification.
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, font } from '../theme';

export default function ReminderCard({ message }) {
  if (!message) return null;
  return (
    <View style={styles.card}>
      <View style={styles.dot} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.noteCard,
    borderColor: colors.noteBorder,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.accent,
    marginRight: spacing.md,
  },
  text: {
    flex: 1,
    color: colors.text,
    fontSize: font.body,
    lineHeight: 20,
  },
});
