import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radii, spacing } from '../theme';

interface StatBarProps {
  label: string; // e.g. "STRENGTH"
  value: number; // motivational RPG value, not a medical measurement
  max?: number;
}

export function StatBar({ label, value, max = 30 }: StatBarProps) {
  const pct = Math.max(0, Math.min(1, value / max));
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct * 100}%` }]} />
      </View>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  label: {
    color: colors.steel,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    width: 100,
  },
  track: {
    flex: 1,
    height: 8,
    backgroundColor: colors.carbon,
    borderRadius: radii.pill,
    overflow: 'hidden',
    marginHorizontal: spacing.sm,
  },
  fill: {
    height: 8,
    backgroundColor: colors.white,
    borderRadius: radii.pill,
  },
  value: {
    color: colors.white,
    fontWeight: '700',
    width: 28,
    textAlign: 'right',
  },
});
