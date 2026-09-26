import type { Mission } from '../types';

export function getDailyMissions(): Mission[] {
  return [
    { id: 'complete_workout', title: "Complete today's workout", xpReward: 100, category: 'daily', completed: false },
    { id: 'walk_10min', title: '10-minute walk', xpReward: 25, category: 'daily', completed: false },
    { id: 'focus_10min', title: '10-minute focus session', xpReward: 25, category: 'daily', completed: false },
    { id: 'recovery_task', title: 'Complete recovery task', xpReward: 25, category: 'daily', completed: false },
  ];
}

// Completing every daily mission awards a bonus (spec section 13).
export const ALL_MISSIONS_BONUS_XP = 100;
