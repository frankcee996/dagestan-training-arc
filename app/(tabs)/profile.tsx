import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Mascot } from '../../src/components/Mascot';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { colors, spacing } from '../../src/theme';
import { useUser } from '../../src/state/UserContext';
import { logOut } from '../../src/firebase/auth';
import { rankForLevel } from '../../src/logic/xp';

export default function ProfileScreen() {
  const { profile } = useUser();
  if (!profile) return null;

  const handleLogOut = async () => {
    await logOut();
    router.replace('/');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerBlock}>
        <Mascot size={110} breathe={false} />
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.rank}>
          Level {profile.level} · {rankForLevel(profile.level)}
        </Text>
      </View>

      <View style={styles.grid}>
        <GridStat label="Total XP" value={profile.totalXp} />
        <GridStat label="Current Streak" value={profile.streak} />
        <GridStat label="Longest Streak" value={profile.longestStreak} />
        <GridStat label="Total Workouts" value={profile.totalWorkouts} />
      </View>

      <View style={{ marginTop: spacing.xxl }}>
        <PrimaryButton label="Log Out" variant="secondary" onPress={handleLogOut} />
      </View>
    </ScrollView>
  );
}

function GridStat({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.gridCell}>
      <Text style={styles.gridValue}>{value}</Text>
      <Text style={styles.gridLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.obsidian },
  content: { padding: spacing.xl, paddingTop: spacing.xxl },
  headerBlock: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  name: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '800',
    marginTop: spacing.md,
    textTransform: 'uppercase',
  },
  rank: {
    color: colors.steel,
    fontWeight: '600',
    marginTop: spacing.xs,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  gridCell: {
    width: '47%',
    backgroundColor: colors.carbon,
    borderRadius: 16,
    padding: spacing.lg,
    alignItems: 'center',
  },
  gridValue: {
    color: colors.red,
    fontSize: 24,
    fontWeight: '800',
  },
  gridLabel: {
    color: colors.steel,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});
