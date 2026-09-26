import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay } from 'react-native-reanimated';
import { Mascot } from '../src/components/Mascot';
import { PrimaryButton } from '../src/components/PrimaryButton';
import { colors, spacing } from '../src/theme';
import { useUser } from '../src/state/UserContext';

export default function WelcomeScreen() {
  const { firebaseUser, profile, loading } = useUser();

  const titleOpacity = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);

  useEffect(() => {
    titleOpacity.value = withDelay(500, withTiming(1, { duration: 600 }));
    buttonOpacity.value = withDelay(1100, withTiming(1, { duration: 500 }));
  }, []);

  // Auto-route signed-in users straight past the welcome screen.
  useEffect(() => {
    if (loading) return;
    if (firebaseUser && profile) {
      router.replace(profile.onboardingComplete ? '/(tabs)/home' : '/(onboarding)/onboarding');
    }
  }, [loading, firebaseUser, profile]);

  const titleStyle = useAnimatedStyle(() => ({ opacity: titleOpacity.value }));
  const buttonStyle = useAnimatedStyle(() => ({ opacity: buttonOpacity.value }));

  if (loading || firebaseUser) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color={colors.white} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Mascot size={180} fadeIn />
      <Animated.View style={[styles.textBlock, titleStyle]}>
        <Text style={styles.title}>2–3 YEARS</Text>
        <Text style={styles.titleAccent}>DAGESTAN</Text>
        <Text style={styles.tagline}>Your training arc starts now.</Text>
      </Animated.View>
      <Animated.View style={[styles.buttonBlock, buttonStyle]}>
        <PrimaryButton label="Enter the Training Arc" onPress={() => router.push('/(auth)/login')} />
      </Animated.View>
    </View>
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
  textBlock: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  title: {
    color: colors.white,
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 1,
  },
  titleAccent: {
    color: colors.red,
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 2,
    marginTop: -4,
  },
  tagline: {
    color: colors.steel,
    marginTop: spacing.md,
    fontWeight: '600',
  },
  buttonBlock: {
    width: '100%',
    marginTop: spacing.xxl,
  },
});
