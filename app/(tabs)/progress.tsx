import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useUser } from '../../src/state/UserContext';
import { StatBar } from '../../src/components/StatBar';
import { colors, spacing } from '../../src/theme';

export default function ProgressScreen() {
  const { profile } = useUser();
  if (!profile) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Progress</Text>

      <View style={styles.statsRow}>
        <StatCell label="Total XP" value={profile.totalXp} />
        <StatCell label="Workouts" value={profile.totalWorkouts} />
        <StatCell label="Longest Streak" value={profile.longestStreak} />
      </View>

      <Text style={styles.sectionLabel}>RPG Stats</Text>
      <View style={styles.card}>
        <StatBar label="Strength" value={profile.stats.strength} />
        <StatBar label="Endurance" value={profile.stats.endurance} />
        <StatBar label="Discipline" value={profile.stats.discipline} />
        <StatBar label="Focus" value={profile.stats.focus} />
        <StatBar label="Consistency" value={profile.stats.consistency} />
        <StatBar label="Recovery" value={profile.stats.recovery} />
      </View>

      <Text style={styles.sectionLabel}>Training Time</Text>
      <View style={styles.card}>
        <Text style={styles.bigStat}>{profile.totalTrainingTimeMinutes} min</Text>
        <Text style={styles.bigStatLabel}>total training time logged</Text>
      </View>
    </ScrollView>
  );
}

function StatCell({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.statCell}>
      <Text style={styles.statCellValue}>{value}</Text>
      <Text style={styles.statCellLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.obsidian },
  content: { padding: spacing.xl, paddingTop: spacing.xxl },
  header: {
    color: colors.white,
    fontSize: 26,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  statCell: {
    alignItems: 'center',
    flex: 1,
  },
  statCellValue: {
    color: colors.red,
    fontSize: 22,
    fontWeight: '800',
  },
  statCellLabel: {
    color: colors.steel,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  sectionLabel: {
    color: colors.steel,
    fontWeight: '700',
    letterSpacing: 1,
    fontSize: 12,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
  },
  card: {
    backgroundColor: colors.carbon,
    borderRadius: 16,
    padding: spacing.lg,
  },
  bigStat: {
    color: colors.white,
    fontSize: 28,
    fontWeight: '800',
  },
  bigStatLabel: {
    color: colors.steel,
    marginTop: spacing.xs,
  },
});
