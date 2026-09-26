import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import type { Mission } from '../types';
import { colors, radii, spacing } from '../theme';

interface MissionCardProps {
  mission: Mission;
  onToggle: (id: string) => void;
}

export function MissionCard({ mission, onToggle }: MissionCardProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggle(mission.id);
  };

  return (
    <Pressable style={styles.row} onPress={handlePress} accessibilityRole="checkbox" accessibilityState={{ checked: mission.completed }}>
      <View style={[styles.checkbox, mission.completed && styles.checkboxChecked]}>
        {mission.completed && <View style={styles.checkboxDot} />}
      </View>
      <Text style={[styles.title, mission.completed && styles.titleDone]}>{mission.title}</Text>
      <Text style={styles.xp}>+{mission.xpReward} XP</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: radii.sm,
    borderWidth: 1.5,
    borderColor: colors.steel,
    marginRight: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    borderColor: colors.red,
    backgroundColor: colors.red,
  },
  checkboxDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.white,
  },
  title: {
    color: colors.white,
    flex: 1,
    fontWeight: '500',
  },
  titleDone: {
    color: colors.steel,
    textDecorationLine: 'line-through',
  },
  xp: {
    color: colors.red,
    fontWeight: '700',
    fontSize: 12,
  },
});
