import React, { useEffect } from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Mascot } from './Mascot';
import { PrimaryButton } from './PrimaryButton';
import { colors, spacing } from '../theme';
import { rankForLevel } from '../logic/xp';
import type { RpgStats } from '../types';

interface LevelUpModalProps {
  visible: boolean;
  fromLevel: number;
  toLevel: number;
  statGains: Partial<RpgStats>;
  onContinue: () => void;
}

export function LevelUpModal({ visible, fromLevel, toLevel, statGains, onContinue }: LevelUpModalProps) {
  useEffect(() => {
    if (visible) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [visible]);

  return (
    <Modal visible={visible} animationType="fade" transparent={false}>
      <View style={styles.container}>
        <Mascot size={130} fadeIn />
        <Text style={styles.levelUp}>Level Up</Text>
        <View style={styles.levelRow}>
          <Text style={styles.levelText}>LEVEL {String(fromLevel).padStart(2, '0')}</Text>
          <Text style={styles.arrow}>→</Text>
          <Text style={[styles.levelText, styles.levelTextRed]}>LEVEL {String(toLevel).padStart(2, '0')}</Text>
        </View>
        <Text style={styles.rank}>{rankForLevel(toLevel)}</Text>

        <View style={styles.statGains}>
          {Object.entries(statGains).map(([key, val]) => (
            <Text key={key} style={styles.statGain}>
              +{val} {key.toUpperCase()}
            </Text>
          ))}
        </View>

        <View style={{ width: '100%', marginTop: spacing.xl }}>
          <PrimaryButton label="Continue" onPress={onContinue} />
        </View>
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
  levelUp: {
    color: colors.white,
    fontSize: 28,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginTop: spacing.lg,
    letterSpacing: 1,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    gap: spacing.md,
  },
  levelText: {
    color: colors.steel,
    fontSize: 20,
    fontWeight: '700',
  },
  levelTextRed: {
    color: colors.red,
  },
  arrow: {
    color: colors.white,
    fontSize: 20,
  },
  rank: {
    color: colors.white,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: spacing.sm,
  },
  statGains: {
    marginTop: spacing.xl,
    alignItems: 'center',
    gap: spacing.xs,
  },
  statGain: {
    color: colors.red,
    fontWeight: '700',
    fontSize: 15,
  },
});
