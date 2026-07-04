// Small shared UI primitives used across screens.
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, radius, spacing, font } from '../theme';

export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function SectionTitle({ children, style }) {
  return <Text style={[styles.sectionTitle, style]}>{children}</Text>;
}

export function PrimaryButton({ title, onPress, disabled, style }) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.primaryBtn,
        disabled && styles.btnDisabled,
        style,
      ]}
    >
      <Text style={styles.primaryBtnText}>{title}</Text>
    </TouchableOpacity>
  );
}

export function SecondaryButton({ title, onPress, disabled, style, tone }) {
  const danger = tone === 'danger';
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.secondaryBtn,
        danger && styles.dangerBtn,
        disabled && styles.btnDisabled,
        style,
      ]}
    >
      <Text style={[styles.secondaryBtnText, danger && styles.dangerBtnText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

// A tappable settings row with a chevron.
export function LinkRow({ label, value, onPress, tone }) {
  const danger = tone === 'danger';
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={styles.linkRow}>
      <Text style={[styles.linkLabel, danger && styles.dangerText]}>
        {label}
      </Text>
      <View style={styles.linkRight}>
        {value ? <Text style={styles.linkValue}>{value}</Text> : null}
        <Text style={styles.chevron}>{'›'}</Text>
      </View>
    </TouchableOpacity>
  );
}

// A simple choice chip.
export function Chip({ label, selected, onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

// A quiet toggle switch built from views (no extra dependency needed).
export function Toggle({ value, onToggle }) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onToggle}
      style={[styles.toggle, value ? styles.toggleOn : styles.toggleOff]}
    >
      <View
        style={[styles.knob, value ? styles.knobOn : styles.knobOff]}
      />
    </TouchableOpacity>
  );
}

export function ToggleRow({ label, value, onToggle, note }) {
  return (
    <View style={styles.toggleRow}>
      <View style={{ flex: 1, paddingRight: spacing.md }}>
        <Text style={styles.toggleLabel}>{label}</Text>
        {note ? <Text style={styles.toggleNote}>{note}</Text> : null}
      </View>
      <Toggle value={value} onToggle={onToggle} />
    </View>
  );
}

export function Note({ children, style }) {
  return (
    <View style={[styles.note, style]}>
      <Text style={styles.noteText}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.divider,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: font.small,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  primaryBtn: {
    backgroundColor: colors.tileFilled,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: colors.white,
    fontSize: font.body,
    fontWeight: '700',
  },
  secondaryBtn: {
    backgroundColor: colors.accentSoft,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.boardBorder,
  },
  secondaryBtnText: {
    color: colors.text,
    fontSize: font.body,
    fontWeight: '600',
  },
  dangerBtn: {
    backgroundColor: '#F3E1DC',
    borderColor: '#E4C6BD',
  },
  dangerBtnText: {
    color: colors.danger,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  linkLabel: {
    fontSize: font.body,
    color: colors.text,
    fontWeight: '500',
  },
  linkRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkValue: {
    fontSize: font.body,
    color: colors.textSecondary,
    marginRight: spacing.sm,
  },
  chevron: {
    fontSize: 22,
    color: colors.textSecondary,
  },
  dangerText: {
    color: colors.danger,
  },
  chip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.boardBorder,
    backgroundColor: colors.board,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  chipSelected: {
    backgroundColor: colors.tileFilled,
    borderColor: colors.tileFilledBorder,
  },
  chipText: {
    color: colors.text,
    fontSize: font.body,
    fontWeight: '600',
  },
  chipTextSelected: {
    color: colors.white,
  },
  toggle: {
    width: 52,
    height: 30,
    borderRadius: 15,
    padding: 3,
    justifyContent: 'center',
  },
  toggleOn: {
    backgroundColor: colors.accent,
    alignItems: 'flex-end',
  },
  toggleOff: {
    backgroundColor: colors.tileEmptyBorder,
    alignItems: 'flex-start',
  },
  knob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.white,
  },
  knobOn: {},
  knobOff: {},
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  toggleLabel: {
    fontSize: font.body,
    color: colors.text,
    fontWeight: '500',
  },
  toggleNote: {
    fontSize: font.small,
    color: colors.textSecondary,
    marginTop: 2,
  },
  note: {
    backgroundColor: colors.noteCard,
    borderColor: colors.noteBorder,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  noteText: {
    color: colors.text,
    fontSize: font.small,
    lineHeight: 19,
  },
});
