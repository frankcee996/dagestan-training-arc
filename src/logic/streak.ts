/**
 * Computes the new streak count given the last completed date (ISO
 * YYYY-MM-DD) and today's date. Same-day repeats don't double count;
 * consecutive days increment; a gap resets to 1 (spec section 34 —
 * a future streak-recovery grace mechanic can slot in here later).
 */
export function nextStreak(
  lastCompletedDate: string | null,
  currentStreak: number,
  today: string
): number {
  if (!lastCompletedDate) return 1;
  if (lastCompletedDate === today) return currentStreak; // already logged today

  const last = new Date(lastCompletedDate + 'T00:00:00');
  const now = new Date(today + 'T00:00:00');
  const diffDays = Math.round((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return currentStreak + 1;
  return 1; // gap of 2+ days breaks the streak
}

export const STREAK_MILESTONES = [3, 7, 14, 30, 60, 90, 365] as const;
