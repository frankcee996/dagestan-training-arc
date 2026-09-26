import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { colors, radii, spacing } from '../../src/theme';
import { useUser } from '../../src/state/UserContext';
import { updateUserProfile } from '../../src/firebase/firestore';
import type { Equipment, FitnessExperience, Goal } from '../../src/types';

type Step = 'experience' | 'goal' | 'equipment' | 'days' | 'duration';

const STEPS: Step[] = ['experience', 'goal', 'equipment', 'days', 'duration'];

const EXPERIENCE_OPTIONS: { value: FitnessExperience; label: string }[] = [
  { value: 'beginner', label: 'Complete beginner' },
  { value: 'some_experience', label: 'Some experience' },
  { value: 'experienced', label: 'Experienced' },
];

const GOAL_OPTIONS: { value: Goal; label: string }[] = [
  { value: 'build_strength', label: 'Build strength' },
  { value: 'improve_fitness', label: 'Improve fitness' },
  { value: 'improve_endurance', label: 'Improve endurance' },
  { value: 'build_consistency', label: 'Build consistency' },
  { value: 'build_muscle', label: 'Build muscle' },
  { value: 'general_self_improvement', label: 'General self-improvement' },
];

const EQUIPMENT_OPTIONS: { value: Equipment; label: string }[] = [
  { value: 'none', label: 'No equipment' },
  { value: 'dumbbells', label: 'Dumbbells' },
  { value: 'bands', label: 'Resistance bands' },
  { value: 'pull_up_bar', label: 'Pull-up bar' },
  { value: 'home_gym', label: 'Home gym' },
];

const DAYS_OPTIONS = [3, 4, 5] as const;
const DURATION_OPTIONS = ['20-30 min', '30-40 min', '40-50 min', '50-60 min'] as const;

export default function OnboardingScreen() {
  const { firebaseUser, refreshProfile, isGuest, profile, setProfile } = useUser();
  const [stepIndex, setStepIndex] = useState(0);
  const [experience, setExperience] = useState<FitnessExperience | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [trainingDays, setTrainingDays] = useState<3 | 4 | 5 | null>(null);
  const [duration, setDuration] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;

  const toggleGoal = (g: Goal) =>
    setGoals((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));
  const toggleEquipment = (e: Equipment) =>
    setEquipment((prev) => (prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]));

  const finishOnboarding = async () => {
    setSaving(true);
    try {
      const patch = {
        fitnessExperience: experience ?? ('beginner' as FitnessExperience),
        goals,
        equipment: equipment.length ? equipment : (['none'] as Equipment[]),
        trainingDaysPerWeek: trainingDays ?? 3,
        onboardingComplete: true,
      };
      if (isGuest && profile) {
        setProfile({ ...profile, ...patch });
      } else if (firebaseUser) {
        await updateUserProfile(firebaseUser.uid, patch);
        await refreshProfile();
      }
      router.replace('/(tabs)/home');
    } finally {
      setSaving(false);
    }
  };

  const handleNext = () => {
    if (isLast) {
      finishOnboarding();
    } else {
      setStepIndex((i) => i + 1);
    }
  };

  const handleSkip = () => {
    if (isLast) {
      finishOnboarding();
    } else {
      setStepIndex((i) => i + 1);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.progress}>
        STEP {stepIndex + 1} / {STEPS.length}
      </Text>

      {step === 'experience' && (
        <>
          <Text style={styles.question}>Fitness Experience</Text>
          {EXPERIENCE_OPTIONS.map((opt) => (
            <OptionRow key={opt.value} label={opt.label} selected={experience === opt.value} onPress={() => setExperience(opt.value)} />
          ))}
        </>
      )}

      {step === 'goal' && (
        <>
          <Text style={styles.question}>Primary Goal</Text>
          {GOAL_OPTIONS.map((opt) => (
            <OptionRow key={opt.value} label={opt.label} selected={goals.includes(opt.value)} onPress={() => toggleGoal(opt.value)} />
          ))}
        </>
      )}

      {step === 'equipment' && (
        <>
          <Text style={styles.question}>Equipment</Text>
          {EQUIPMENT_OPTIONS.map((opt) => (
            <OptionRow key={opt.value} label={opt.label} selected={equipment.includes(opt.value)} onPress={() => toggleEquipment(opt.value)} />
          ))}
        </>
      )}

      {step === 'days' && (
        <>
          <Text style={styles.question}>Training Days</Text>
          {DAYS_OPTIONS.map((d) => (
            <OptionRow key={d} label={`${d} days / week`} selected={trainingDays === d} onPress={() => setTrainingDays(d)} />
          ))}
        </>
      )}

      {step === 'duration' && (
        <>
          <Text style={styles.question}>Workout Duration</Text>
          {DURATION_OPTIONS.map((d) => (
            <OptionRow key={d} label={d} selected={duration === d} onPress={() => setDuration(d)} />
          ))}
        </>
      )}

      <View style={{ marginTop: spacing.xl, width: '100%' }}>
        <PrimaryButton label={isLast ? 'Begin Training Arc' : 'Next'} onPress={handleNext} loading={saving} />
      </View>
      <Pressable onPress={handleSkip}>
        <Text style={styles.skip}>Skip</Text>
      </Pressable>
    </ScrollView>
  );
}

function OptionRow({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable style={[styles.option, selected && styles.optionSelected]} onPress={onPress}>
      <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.obsidian },
  content: { padding: spacing.xl, paddingTop: spacing.xxl },
  progress: { color: colors.steel, fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: spacing.md },
  question: { color: colors.white, fontSize: 22, fontWeight: '800', textTransform: 'uppercase', marginBottom: spacing.lg },
  option: { borderWidth: 1, borderColor: colors.carbon, backgroundColor: colors.carbon, borderRadius: radii.md, padding: spacing.md, marginBottom: spacing.sm },
  optionSelected: { borderColor: colors.red },
  optionText: { color: colors.steel, fontWeight: '600' },
  optionTextSelected: { color: colors.white },
  skip: { color: colors.steel, textAlign: 'center', marginTop: spacing.lg, textDecorationLine: 'underline' },
});
