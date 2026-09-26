import React, { useEffect } from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay } from 'react-native-reanimated';
import { Mascot } from './Mascot';
import { XPBar } from './XPBar';
import { PrimaryButton } from './PrimaryButton';
import { colors, spacing } from '../theme';
import type { RpgStats } from '../types';
import { xpRequiredForLevel } from '../logic/xp';

interface WorkoutCompleteModalProps {
  visible: boolean;
  xpEarned: number;
  currentXp: number;
  level: number;
  streak: number;
  statGains: Partial<RpgStats>;
  onContinue: () => void;
}

export function WorkoutCompleteModal({
  visible,
  xpEarned,
  currentXp,
  level,
  streak,
  statGains,
  onContinue,
}: WorkoutCompleteModalProps) {
  const contentOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      contentOpacity.value = withDelay(300, withTiming(1, { duration: 500 }));
    } else {
      contentOpacity.value = 0;
    }
  }, [visible]);

  const contentStyle = useAnimatedStyle(() => ({ opacity: contentOpacity.value }));

  return (
    <Modal visible={visible} animationType="fade" transparent={false}>
      <View style={styles.container}>
        <Text style={styles.heading}>Training Complete.</Text>
        <Mascot size={120} fadeIn />
        <Animated.View style={[styles.body, contentStyle]}>
          <Text style={styles.xpEarned}>+{xpEarned} XP</Text>
          <XPBar currentXp={currentXp} requiredXp={xpRequiredForLevel(level)} />

          <View style={styles.statGainsRow}>
            {Object.entries(statGains).map(([key, val]) => (
              <Text key={key} style={styles.statGain}>
                {key.toUpperCase()} +{val}
              </Text>
            ))}
          </View>

          <Text style={styles.streak}>🔥 {streak} DAY STREAK</Text>

          <View style={{ width: '100%', marginTop: spacing.xl }}>
            <PrimaryButton label="Continue" onPress={onContinue} />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.obsidian,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  heading: {
    color: colors.white,
    fontSize: 26,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.lg,
  },
  body: {
    width: '100%',
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  xpEarned: {
    color: colors.red,
    fontSize: 32,
    fontWeight: '800',
    marginBottom: spacing.md,
  },
  statGainsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  statGain: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 13,
  },
  streak: {
    color: colors.steel,
    fontWeight: '700',
    marginTop: spacing.lg,
    fontSize: 16,
  },
});
