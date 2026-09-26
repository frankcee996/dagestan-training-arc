import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User } from 'firebase/auth';
import { subscribeToAuthChanges } from '../firebase/auth';
import { getUserProfile } from '../firebase/firestore';
import type { UserProfile } from '../types';

interface UserContextValue {
  firebaseUser: User | null;
  profile: UserProfile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  setProfile: (p: UserProfile) => void;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    if (!firebaseUser) {
      setProfile(null);
      return;
    }
    const p = await getUserProfile(firebaseUser.uid);
    setProfile(p);
  }, [firebaseUser]);

  useEffect(() => {
    const unsub = subscribeToAuthChanges(async (user) => {
      setFirebaseUser(user);
      if (user) {
        const p = await getUserProfile(user.uid);
        setProfile(p);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  return (
    <UserContext.Provider value={{ firebaseUser, profile, loading, refreshProfile, setProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within a UserProvider');
  return ctx;
}
