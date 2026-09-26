# 2–3 YEARS: DAGESTAN

"LOCK IN." — a gamified home-fitness RPG. Expo + React Native + TypeScript + Firebase.

Dagestan is used purely as a fictionalized, meme-inspired theme and does not represent
real Dagestani culture, geography, training institutions, or people.

## What's implemented (MVP core loop)

- Email/password auth (sign up, login, forgot password, log out) via Firebase Auth
- Onboarding (experience, goal, equipment, training days, duration — all skippable)
- Home dashboard: greeting, level, animated XP bar, streak, mascot, today's workout, daily missions
- Full Newcomer program (3x/week, warm-up → main → finisher → cooldown) with real seed exercises
- Sequential workout player with rest timers, haptics, skip/complete
- XP + deterministic level-up math, RPG stat gains, streak calculation
- Workout-complete and level-up celebration screens with Reanimated + haptics
- Firestore persistence with an idempotency key so a completed workout can never
  double-award XP even if the write is retried
- Progress screen (RPG stats, totals) and Profile screen (rank, stats, log out)
- Firestore security rules restricting every user to their own data

## What's intentionally out of scope for this drop

Sections of the original spec that need infrastructure, real asset production, or
testing on a physical device aren't included yet — building them blind would just be
guesswork:

- Trainee / Fighter / Elite programs, adaptive difficulty, progressive-overload week-by-week scaling
- Real 2D line-art exercise demonstration animations (train.tsx has a labeled placeholder slot)
- Achievements, badges, challenge tracking beyond the single example on the Missions screen
- Push notifications (expo-notifications setup, scheduling, permission flow)
- Offline queueing/sync beyond Firestore's own built-in offline persistence
- Settings screen, email-change/password-change flows, unit preferences
- Accessibility pass (screen-reader labels, reduced-motion) beyond basic roles/labels already in place

## Setup

1. `npm install`
2. Create a Firebase project → enable **Authentication → Email/Password** and **Cloud Firestore**.
3. Copy your web app config into environment variables (e.g. a `.env` file read via
   `app.config.ts`, or `EXPO_PUBLIC_*` vars in your shell) matching the keys read in
   `src/firebase/config.ts`:
   ```
   EXPO_PUBLIC_FIREBASE_API_KEY=
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
   EXPO_PUBLIC_FIREBASE_APP_ID=
   ```
4. Deploy `firestore.rules` (`firebase deploy --only firestore:rules`).
5. `npx expo start` — open in Expo Go or a dev build on Android.

## Notes

- This project was generated without a live Expo/Metro environment to run or test it
  against — there's no network access in the environment that produced it. Expect to
  run `npm install` and fix any version-pinning friction between Expo SDK 51 and
  whatever's current when you build.
- The mascot artwork you uploaded is wired in as the app icon, splash image, and the
  `Mascot` component used throughout — untouched, no recoloring or redesign.
