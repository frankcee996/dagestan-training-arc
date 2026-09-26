import type { WorkoutDay } from '../types';
import { exercises as ex } from './exercises';

const warmupBasic = {
  kind: 'warmup' as const,
  title: 'Warm-up',
  exercises: [ex.marching, ex.armCircles, ex.hipCircles, ex.jumpingJacksLight],
};

const cooldownBasic = {
  kind: 'cooldown' as const,
  title: 'Cooldown',
  exercises: [ex.deepBreathing, ex.hamstringStretch, ex.quadStretch],
};

const finisherEasy = {
  kind: 'finisher' as const,
  title: 'Finisher',
  exercises: [ex.highKnees, ex.mountainClimbers],
};

// NEWCOMER PROGRAM — 3 days/week, 20-30 min, bodyweight-focused (spec section 16)
export const newcomerProgram: WorkoutDay[] = [
  {
    id: 'newcomer_day1_fullbody',
    title: 'FULL BODY',
    level: 'newcomer',
    difficultyLabel: 'BEGINNER',
    estimatedMinutes: 24,
    xpReward: 150,
    isRestDay: false,
    sections: [
      warmupBasic,
      {
        kind: 'main',
        title: 'Main Training',
        exercises: [ex.pushUpsKnee, ex.squats, ex.gluteBridges, ex.plankHold],
      },
      finisherEasy,
      cooldownBasic,
    ],
  },
  {
    id: 'newcomer_day2_rest',
    title: 'REST / RECOVERY',
    level: 'newcomer',
    difficultyLabel: 'BEGINNER',
    estimatedMinutes: 0,
    xpReward: 25,
    isRestDay: true,
    sections: [],
  },
  {
    id: 'newcomer_day3_fullbody',
    title: 'FULL BODY',
    level: 'newcomer',
    difficultyLabel: 'BEGINNER',
    estimatedMinutes: 26,
    xpReward: 150,
    isRestDay: false,
    sections: [
      warmupBasic,
      {
        kind: 'main',
        title: 'Main Training',
        exercises: [ex.pushUps, ex.lunges, ex.gluteBridges, ex.plankHold],
      },
      finisherEasy,
      cooldownBasic,
    ],
  },
  {
    id: 'newcomer_day4_rest',
    title: 'REST',
    level: 'newcomer',
    difficultyLabel: 'BEGINNER',
    estimatedMinutes: 0,
    xpReward: 25,
    isRestDay: true,
    sections: [],
  },
  {
    id: 'newcomer_day5_fullbody',
    title: 'FULL BODY',
    level: 'newcomer',
    difficultyLabel: 'BEGINNER',
    estimatedMinutes: 28,
    xpReward: 150,
    isRestDay: false,
    sections: [
      warmupBasic,
      {
        kind: 'main',
        title: 'Main Training',
        exercises: [ex.pushUps, ex.squats, ex.lunges, ex.mountainClimbers, ex.plankHold],
      },
      finisherEasy,
      cooldownBasic,
    ],
  },
  {
    id: 'newcomer_day6_optional',
    title: 'OPTIONAL WALK / MOBILITY',
    level: 'newcomer',
    difficultyLabel: 'BEGINNER',
    estimatedMinutes: 15,
    xpReward: 50,
    isRestDay: true,
    sections: [cooldownBasic],
  },
  {
    id: 'newcomer_day7_rest',
    title: 'REST',
    level: 'newcomer',
    difficultyLabel: 'BEGINNER',
    estimatedMinutes: 0,
    xpReward: 25,
    isRestDay: true,
    sections: [],
  },
];

/** Simple weekly-cycle picker: pass a 0-indexed day-of-cycle to get today's workout. */
export function getWorkoutForCycleDay(dayIndex: number): WorkoutDay {
  return newcomerProgram[dayIndex % newcomerProgram.length];
}
