import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useUser } from '../../src/state/UserContext';
import { Mascot } from '../../src/components/Mascot';
import { XPBar } from '../../src/components/XPBar';
import { WorkoutCard } from '../../src/components/WorkoutCard';
import { MissionCard } from '../../src/components/MissionCard';
import { colors, spacing } from '../../src/theme';
import { xpRequiredForLevel } from '../../src/logic/xp';
import { getWorkoutForCycleDay } from '../../src/data/workouts';
import { getDailyMissions } from '../../src/data/missions';
import type { Mission } from '../../src/types';

export default function HomeScreen() {
  const { profile } = useUser();
  const [missions, setMissions] = useState<Mission[]>(getDailyMissions());

  // Cycle position derived from total workouts so rest days rotate naturally.
  const todaysWorkout = useMemo(
    () => getWorkoutForCycleDay(profile?.totalWorkouts ?? 0),
    [profile?.totalWorkouts]
  );

  const toggleMission = (id: string) => {
    setMissions((prev) => prev.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m)));
  };

  if (!profile) return null;

  const requiredXp = xpRequiredForLevel(profile.level);
  const firstName = profile.name.split(' ')[0] || profile.name;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.greeting}>Good morning, {firstName.toUpperCase()}</Text>
      <Text style={styles.level}>Level {String(profile.level).padStart(2, '0')}</Text>
      <XPBar currentXp={profile.xp} requiredXp={requiredXp} />
      <Text style={styles.streak}>🔥 {profile.streak} DAY STREAK</Text>

      <View style={styles.mascotBlock}>
        <Mascot size={140} />
        <Text style={styles.lockIn}>Lock In.</Text>
      </View>

      <Text style={styles.sectionHeader}>Today's Training</Text>
      <WorkoutCard
        workout={todaysWorkout}
        onStart={() =>
          router.push({ pathname: '/(tabs)/train', params: { workoutId: todaysWorkout.id } })
        }
      />

      <Text style={styles.sectionHeader}>Daily Missions</Text>
      <View style={styles.missionsCard}>
        {missions.map((m) => (
          <MissionCard key={m.id} mission={m} onToggle={toggleMission} />
        ))}
      </View>

      <Text style={styles.cycleDay}>Training Arc — Day {profile.totalWorkouts + 1}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.obsidian,
  },
  content: {
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  greeting: {
    color: colors.steel,
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  level: {
    color: colors.white,
    fontSize: 28,
    fontWeight: '800',
    marginTop: spacing.xs,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
  },
  streak: {
    color: colors.steel,
    fontWeight: '700',
    marginTop: spacing.sm,
  },
  mascotBlock: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  lockIn: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginTop: spacing.md,
    letterSpacing: 1,
  },
  sectionHeader: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  missionsCard: {
    backgroundColor: colors.carbon,
    borderRadius: 16,
    padding: spacing.lg,
  },
  cycleDay: {
    color: colors.steel,
    textAlign: 'center',
    marginTop: spacing.xxl,
    fontWeight: '600',
    letterSpacing: 1,
  },
});
