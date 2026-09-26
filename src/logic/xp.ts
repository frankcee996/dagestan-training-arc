import type { RankName, RpgStats, WorkoutDay } from '../types';

// XP required to go from level N to N+1. Progressively increasing (spec section 14).
export function xpRequiredForLevel(level: number): number {
  return Math.round(200 + level * 120 + Math.pow(level, 1.5) * 20);
}

export function rankForLevel(level: number): RankName {
  if (level <= 4) return 'NEWCOMER';
  if (level <= 9) return 'TRAINEE';
  if (level <= 19) return 'FIGHTER';
  if (level <= 29) return 'DISCIPLINED';
  if (level <= 49) return 'ELITE';
  return 'LEGEND';
}

/**
 * Applies earned XP to a level/xp pair, carrying over any overflow across
 * one or more level-ups. Deterministic — safe to recompute from stored state.
 */
export function applyXpAndLevel(
  currentLevel: number,
  currentXp: number,
  xpEarned: number
): { level: number; xp: number; leveledUp: boolean } {
  let level = currentLevel;
  let xp = currentXp + xpEarned;
  let leveledUp = false;

  let threshold = xpRequiredForLevel(level);
  while (xp >= threshold) {
    xp -= threshold;
    level += 1;
    leveledUp = true;
    threshold = xpRequiredForLevel(level);
  }

  return { level, xp, leveledUp };
}

export function xpForWorkout(workoutDay: WorkoutDay): number {
  return workoutDay.xpReward;
}

// Modest, spec-aligned stat gains per completed workout (section 12/29).
export function statGainsForWorkout(workoutDay: WorkoutDay): Partial<RpgStats> {
  const base = workoutDay.title.toUpperCase();
  if (base.includes('UPPER')) return { strength: 3, discipline: 1 };
  if (base.includes('LOWER')) return { strength: 2, endurance: 2 };
  if (base.includes('CONDITIONING')) return { endurance: 3, focus: 1 };
  if (base.includes('MOBILITY') || base.includes('WALK')) return { recovery: 2, consistency: 1 };
  // Full body / default
  return { strength: 2, endurance: 2, discipline: 1 };
}
