import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { colors, radii, spacing } from '../theme';

interface XPBarProps {
  currentXp: number;
  requiredXp: number;
  height?: number;
  showLabel?: boolean;
}

export function XPBar({ currentXp, requiredXp, height = 10, showLabel = true }: XPBarProps) {
  const progress = useSharedValue(0);
  const pct = Math.max(0, Math.min(1, currentXp / requiredXp));

  useEffect(() => {
    progress.value = withTiming(pct, { duration: 600 });
  }, [pct]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View>
      <View style={[styles.track, { height }]}>
        <Animated.View style={[styles.fill, fillStyle, { height }]} />
      </View>
      {showLabel && (
        <Text style={styles.label}>
          {currentXp} / {requiredXp} XP
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: colors.carbon,
    borderRadius: radii.pill,
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    backgroundColor: colors.red,
    borderRadius: radii.pill,
  },
  label: {
    color: colors.steel,
    fontSize: 12,
    marginTop: spacing.xs,
    fontWeight: '600',
  },
});
