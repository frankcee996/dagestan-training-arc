import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Alert } from 'react-native';
import type { User } from 'firebase/auth';
import { subscribeToAuthChanges } from '../firebase/auth';
import { getUserProfile } from '../firebase/firestore';
import type { UserProfile, RpgStats } from '../types';

interface UserContextValue {
  firebaseUser: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isGuest: boolean;
  refreshProfile: () => Promise<void>;
  setProfile: (p: UserProfile) => void;
  enterGuestMode: () => void;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

const defaultStats: RpgStats = {
  strength: 1,
  endurance: 1,
  discipline: 1,
  focus: 1,
  consistency: 1,
  recovery: 1,
};

function buildGuestProfile(): UserProfile {
  return {
    id: 'guest',
    name: 'Guest',
    email: '',
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
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  const enterGuestMode = useCallback(() => {
    setIsGuest(true);
    setFirebaseUser(null);
    setProfile(buildGuestProfile());
    setLoading(false);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (isGuest) return; // guest profile lives entirely in local state
    if (!firebaseUser) {
      setProfile(null);
      return;
    }
    try {
      const p = await getUserProfile(firebaseUser.uid);
      setProfile(p);
    } catch (err: any) {
      Alert.alert('Profile load failed', String(err?.message ?? err));
    }
  }, [firebaseUser, isGuest]);

  useEffect(() => {
    const unsub = subscribeToAuthChanges(async (user) => {
      if (isGuest) return; // don't let a stale auth event override guest mode
      setFirebaseUser(user);
      try {
        if (user) {
          const p = await getUserProfile(user.uid);
          setProfile(p);
        } else {
          setProfile(null);
        }
      } catch (err: any) {
        Alert.alert('Sign-in error', String(err?.message ?? err));
        setProfile(null);
      } finally {
        setLoading(false);
      }
    });
    return unsub;
  }, [isGuest]);

  return (
    <UserContext.Provider
      value={{ firebaseUser, profile, loading, isGuest, refreshProfile, setProfile, enterGuestMode }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within a UserProvider');
  return ctx;
}
