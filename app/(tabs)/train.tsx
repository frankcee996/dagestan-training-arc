import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { WorkoutCompleteModal } from '../../src/components/WorkoutCompleteModal';
import { LevelUpModal } from '../../src/components/LevelUpModal';
import { colors, spacing } from '../../src/theme';
import { newcomerProgram, getWorkoutForCycleDay } from '../../src/data/workouts';
import { useUser } from '../../src/state/UserContext';
import { completeWorkout, logWorkoutSession } from '../../src/firebase/firestore';
import { statGainsForWorkout } from '../../src/logic/xp';
import type { Exercise, WorkoutDay } from '../../src/types';

interface FlatStep {
  sectionTitle: string;
  exercise: Exercise;
}

function flattenWorkout(workout: WorkoutDay): FlatStep[] {
  return workout.sections.flatMap((section) =>
    section.exercises.map((exercise) => ({ sectionTitle: section.title, exercise }))
  );
}

export default function TrainScreen() {
  const { workoutId } = useLocalSearchParams<{ workoutId?: string }>();
  const { profile, firebaseUser, refreshProfile } = useUser();

  const workout = useMemo(() => {
    const found = newcomerProgram.find((w) => w.id === workoutId);
    return found ?? getWorkoutForCycleDay(profile?.totalWorkouts ?? 0);
  }, [workoutId, profile?.totalWorkouts]);

  const steps = useMemo(() => flattenWorkout(workout), [workout]);

  const [stepIndex, setStepIndex] = useState(0);
  const [resting, setResting] = useState(false);
  const [restSecondsLeft, setRestSecondsLeft] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpInfo, setLevelUpInfo] = useState({ from: 1, to: 1 });
  const [saving, setSaving] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentStep = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;

  useEffect(() => {
    if (!resting) return;
    intervalRef.current = setInterval(() => {
      setRestSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(intervalRef.current!);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          setResting(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [resting]);

  if (workout.isRestDay) {
    return (
      <View style={styles.center}>
        <Text style={styles.restTitle}>Rest Day</Text>
        <Text style={styles.restBody}>Recovery is part of the program. Come back tomorrow.</Text>
        <View style={{ marginTop: spacing.xl, width: '80%' }}>
          <PrimaryButton label="Back to Home" onPress={() => router.push('/(tabs)/home')} />
        </View>
      </View>
    );
  }

  const handleCompleteExercise = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (isLastStep) {
      finishWorkout();
      return;
    }
    const rest = currentStep.exercise.restSeconds;
    if (rest > 0) {
      setRestSecondsLeft(rest);
      setResting(true);
    }
    setStepIndex((i) => i + 1);
  };

  const handleSkip = () => {
    if (isLastStep) {
      finishWorkout();
      return;
    }
    setStepIndex((i) => i + 1);
  };

  const finishWorkout = async () => {
    if (!firebaseUser || !profile) return;
    setSaving(true);
    try {
      const idempotencyKey = `${workout.id}_${new Date().toISOString().slice(0, 10)}`;
      const result = await completeWorkout(firebaseUser.uid, workout, idempotencyKey);
      await logWorkoutSession(firebaseUser.uid, {
        workoutDayId: workout.id,
        durationMinutes: workout.estimatedMinutes,
        xpEarned: workout.xpReward,
      });
      await refreshProfile();
      setShowComplete(true);
      if (result.leveledUp) {
        setLevelUpInfo({ from: result.fromLevel, to: result.toLevel });
      }
    } catch (err) {
      // Spec section 56: never surface raw backend errors.
      console.warn('Workout completion failed to sync; will retry next launch.', err);
      setShowComplete(true);
    } finally {
      setSaving(false);
    }
  };

  const handleCompleteContinue = () => {
    setShowComplete(false);
    if (levelUpInfo.to > levelUpInfo.from) {
      setShowLevelUp(true);
    } else {
      router.replace('/(tabs)/home');
    }
  };

  if (resting) {
    return (
      <View style={styles.center}>
        <Text style={styles.restLabel}>Rest</Text>
        <Text style={styles.restTimer}>{String(restSecondsLeft).padStart(2, '0')}s</Text>
        <View style={{ marginTop: spacing.xl, width: '60%' }}>
          <PrimaryButton
            label="Skip Rest"
            variant="secondary"
            onPress={() => {
              if (intervalRef.current) clearInterval(intervalRef.current);
              setResting(false);
            }}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>
        {stepIndex + 1} / {steps.length}
      </Text>
      <Text style={styles.sectionTitle}>{currentStep.sectionTitle}</Text>
      <Text style={styles.exerciseName}>{currentStep.exercise.name}</Text>

      <View style={styles.metaBlock}>
        <Text style={styles.setLabel}>
          Set {1} / {currentStep.exercise.sets}
        </Text>
        <Text style={styles.repsLabel}>
          {currentStep.exercise.reps
            ? `${currentStep.exercise.reps} reps`
            : `${currentStep.exercise.durationSeconds}s`}
        </Text>
      </View>

      {/* Placeholder for a 2D line-art demonstration loop matching the mascot's style. */}
      <View style={styles.demoPlaceholder}>
        <Text style={styles.demoText}>DEMONSTRATION</Text>
      </View>

      <Text style={styles.instructions}>{currentStep.exercise.instructions}</Text>

      <View style={styles.actions}>
        <PrimaryButton
          label={isLastStep ? 'Finish Workout' : 'Complete'}
          onPress={handleCompleteExercise}
          loading={saving}
        />
        <View style={{ height: spacing.sm }} />
        <PrimaryButton label="Skip" variant="secondary" onPress={handleSkip} />
      </View>

      <WorkoutCompleteModal
        visible={showComplete}
        xpEarned={workout.xpReward}
        currentXp={profile?.xp ?? 0}
        level={profile?.level ?? 1}
        streak={profile?.streak ?? 1}
        statGains={statGainsForWorkout(workout)}
        onContinue={handleCompleteContinue}
      />

      <LevelUpModal
        visible={showLevelUp}
        fromLevel={levelUpInfo.from}
        toLevel={levelUpInfo.to}
        statGains={statGainsForWorkout(workout)}
        onContinue={() => {
          setShowLevelUp(false);
          router.replace('/(tabs)/home');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.obsidian,
    padding: spacing.xl,
    paddingTop: spacing.xxl,
  },
  center: {
    flex: 1,
    backgroundColor: colors.obsidian,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  progress: {
    color: colors.steel,
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 1,
  },
  sectionTitle: {
    color: colors.red,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: spacing.sm,
    textTransform: 'uppercase',
    fontSize: 12,
  },
  exerciseName: {
    color: colors.white,
    fontSize: 28,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginTop: spacing.xs,
  },
  metaBlock: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginTop: spacing.md,
  },
  setLabel: {
    color: colors.steel,
    fontWeight: '700',
  },
  repsLabel: {
    color: colors.white,
    fontWeight: '700',
  },
  demoPlaceholder: {
    flex: 1,
    marginVertical: spacing.xl,
    borderRadius: 16,
    backgroundColor: colors.carbon,
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoText: {
    color: colors.steel,
    fontWeight: '700',
    letterSpacing: 1,
  },
  instructions: {
    color: colors.steel,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  actions: {
    marginBottom: spacing.lg,
  },
  restLabel: {
    color: colors.steel,
    fontWeight: '800',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  restTimer: {
    color: colors.white,
    fontSize: 64,
    fontWeight: '800',
    marginTop: spacing.md,
  },
  restTitle: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  restBody: {
    color: colors.steel,
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: 20,
  },
});
