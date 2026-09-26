import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { WorkoutDay } from '../types';
import { colors, radii, spacing } from '../theme';
import { PrimaryButton } from './PrimaryButton';

interface WorkoutCardProps {
  workout: WorkoutDay;
  onStart: () => void;
}

export function WorkoutCard({ workout, onStart }: WorkoutCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{workout.title}</Text>
      <View style={styles.metaRow}>
        <Text style={styles.meta}>{workout.difficultyLabel}</Text>
        <Text style={styles.dot}>•</Text>
        <Text style={styles.meta}>{workout.estimatedMinutes} MIN</Text>
        <Text style={styles.dot}>•</Text>
        <Text style={styles.xp}>+{workout.xpReward} XP</Text>
      </View>
      {!workout.isRestDay && (
        <View style={{ marginTop: spacing.md }}>
          <PrimaryButton label="Start Training" onPress={onStart} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.carbon,
    borderRadius: radii.lg,
    padding: spacing.lg,
  },
  title: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  meta: {
    color: colors.steel,
    fontWeight: '600',
    fontSize: 13,
  },
  dot: {
    color: colors.steel,
    marginHorizontal: spacing.sm,
  },
  xp: {
    color: colors.red,
    fontWeight: '700',
    fontSize: 13,
  },
});
