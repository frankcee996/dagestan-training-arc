import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  serverTimestamp,
  runTransaction,
} from 'firebase/firestore';
import { db } from './config';
import type { UserProfile, WorkoutDay, RpgStats } from '../types';
import { xpForWorkout, applyXpAndLevel, statGainsForWorkout } from '../logic/xp';
import { nextStreak } from '../logic/streak';

const defaultStats: RpgStats = {
  strength: 1,
  endurance: 1,
  discipline: 1,
  focus: 1,
  consistency: 1,
  recovery: 1,
};

export async function createUserProfile(uid: string, name: string, email: string) {
  const profile: UserProfile = {
    id: uid,
    name,
    email,
    level: 1,
    xp: 0,
    totalXp: 0,
    streak: 0,
    longestStreak: 0,
    totalWorkouts: 0,
    totalTrainingTimeMinutes: 0,
    stats: defaultStats,
    goals: [],
    equipment: [],
    trainingDaysPerWeek: 3,
    fitnessExperience: 'beginner',
    workoutLevel: 'newcomer',
    lastCompletedDate: null,
    onboardingComplete: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  await setDoc(doc(db, 'users', uid), profile);
  return profile;
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

export async function updateUserProfile(uid: string, patch: Partial<UserProfile>) {
  await updateDoc(doc(db, 'users', uid), { ...patch, updatedAt: Date.now() });
}

/**
 * Records a completed workout exactly once, atomically updating XP, level,
 * stats, streak, and totals. Uses a Firestore transaction plus a dedicated
 * xpTransactions doc (keyed by idempotencyKey) so retries from flaky network
 * conditions never double-award XP (spec section 58/42).
 */
export async function completeWorkout(
  uid: string,
  workoutDay: WorkoutDay,
  idempotencyKey: string
): Promise<{ profile: UserProfile; leveledUp: boolean; fromLevel: number; toLevel: number }> {
  const userRef = doc(db, 'users', uid);
  const txRef = doc(db, 'users', uid, 'xpTransactions', idempotencyKey);

  return runTransaction(db, async (tx) => {
    const existingTxSnap = await tx.get(txRef);
    const userSnap = await tx.get(userRef);
    if (!userSnap.exists()) throw new Error('Profile not found.');
    const profile = userSnap.data() as UserProfile;

    if (existingTxSnap.exists()) {
      // Already recorded — return current state without re-awarding anything.
      return { profile, leveledUp: false, fromLevel: profile.level, toLevel: profile.level };
    }

    const xpEarned = xpForWorkout(workoutDay);
    const statGains = statGainsForWorkout(workoutDay);
    const today = new Date().toISOString().slice(0, 10);
    const streak = nextStreak(profile.lastCompletedDate, profile.streak, today);

    const { level, xp, leveledUp } = applyXpAndLevel(profile.level, profile.xp, xpEarned);

    const newStats: RpgStats = { ...profile.stats };
    (Object.keys(statGains) as (keyof RpgStats)[]).forEach((k) => {
      newStats[k] = (newStats[k] ?? 0) + (statGains[k] ?? 0);
    });

    const updatedProfile: UserProfile = {
      ...profile,
      level,
      xp,
      totalXp: profile.totalXp + xpEarned,
      streak,
      longestStreak: Math.max(profile.longestStreak, streak),
      totalWorkouts: profile.totalWorkouts + 1,
      totalTrainingTimeMinutes: profile.totalTrainingTimeMinutes + workoutDay.estimatedMinutes,
      stats: newStats,
      lastCompletedDate: today,
      updatedAt: Date.now(),
    };

    tx.set(userRef, updatedProfile);
    tx.set(txRef, {
      workoutDayId: workoutDay.id,
      xpEarned,
      createdAt: serverTimestamp(),
    });

    return { profile: updatedProfile, leveledUp, fromLevel: profile.level, toLevel: level };
  });
}

export async function logWorkoutSession(uid: string, session: Record<string, unknown>) {
  await addDoc(collection(db, 'users', uid, 'workoutSessions'), {
    ...session,
    createdAt: serverTimestamp(),
  });
}
