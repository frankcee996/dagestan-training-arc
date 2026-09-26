import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { MissionCard } from '../../src/components/MissionCard';
import { colors, spacing } from '../../src/theme';
import { getDailyMissions, ALL_MISSIONS_BONUS_XP } from '../../src/data/missions';
import type { Mission } from '../../src/types';

export default function MissionsScreen() {
  const [daily, setDaily] = useState<Mission[]>(getDailyMissions());

  const toggle = (id: string) =>
    setDaily((prev) => prev.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m)));

  const allComplete = daily.every((m) => m.completed);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Missions</Text>

      <Text style={styles.sectionLabel}>Daily</Text>
      <View style={styles.card}>
        {daily.map((m) => (
          <MissionCard key={m.id} mission={m} onToggle={toggle} />
        ))}
        {allComplete && (
          <Text style={styles.bonus}>All missions complete — bonus +{ALL_MISSIONS_BONUS_XP} XP</Text>
        )}
      </View>

      <Text style={styles.sectionLabel}>Challenges</Text>
      <View style={styles.card}>
        <Text style={styles.challengeTitle}>30 Day Lock-In</Text>
        <Text style={styles.challengeBody}>Complete a workout 30 days in a row. Reward: +2500 XP, "Locked In" badge.</Text>
      </View>
    </ScrollView>
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
  bonus: {
    color: colors.red,
    fontWeight: '700',
    marginTop: spacing.md,
    textAlign: 'center',
  },
  challengeTitle: {
    color: colors.white,
    fontWeight: '800',
    textTransform: 'uppercase',
    fontSize: 16,
  },
  challengeBody: {
    color: colors.steel,
    marginTop: spacing.sm,
    lineHeight: 20,
  },
});
