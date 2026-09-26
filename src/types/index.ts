export type FitnessExperience = 'beginner' | 'some_experience' | 'experienced';

export type Goal =
  | 'build_strength'
  | 'improve_fitness'
  | 'improve_endurance'
  | 'build_consistency'
  | 'build_muscle'
  | 'general_self_improvement';

export type Equipment = 'none' | 'dumbbells' | 'bands' | 'pull_up_bar' | 'home_gym';

export type WorkoutLevel = 'newcomer' | 'trainee' | 'fighter' | 'elite';

export type RankName = 'NEWCOMER' | 'TRAINEE' | 'FIGHTER' | 'DISCIPLINED' | 'ELITE' | 'LEGEND';

export interface RpgStats {
  strength: number;
  endurance: number;
  discipline: number;
  focus: number;
  consistency: number;
  recovery: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  level: number;
  xp: number; // XP within current level
  totalXp: number;
  streak: number;
  longestStreak: number;
  totalWorkouts: number;
  totalTrainingTimeMinutes: number;
  stats: RpgStats;
  goals: Goal[];
  equipment: Equipment[];
  trainingDaysPerWeek: 3 | 4 | 5;
  fitnessExperience: FitnessExperience;
  workoutLevel: WorkoutLevel;
  lastCompletedDate: string | null; // ISO date, used for streak calc
  onboardingComplete: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps?: number;
  durationSeconds?: number;
  restSeconds: number;
  difficulty: 'easy' | 'medium' | 'hard';
  instructions: string;
  easierVariationId?: string;
}

export interface WorkoutSection {
  kind: 'warmup' | 'main' | 'finisher' | 'cooldown';
  title: string;
  exercises: Exercise[];
}

export interface WorkoutDay {
  id: string;
  title: string; // e.g. "FULL BODY"
  level: WorkoutLevel;
  difficultyLabel: 'BEGINNER' | 'TRAINEE' | 'FIGHTER' | 'ELITE';
  estimatedMinutes: number;
  xpReward: number;
  isRestDay: boolean;
  sections: WorkoutSection[];
}

export interface Mission {
  id: string;
  title: string;
  xpReward: number;
  category: 'daily' | 'weekly' | 'monthly';
  completed: boolean;
}

export interface WorkoutSession {
  id: string;
  workoutDayId: string;
  completedAt: number;
  durationMinutes: number;
  xpEarned: number;
  statGains: Partial<RpgStats>;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlockedAt: number | null;
}

export interface Challenge {
  id: string;
  title: string; // "30 DAY LOCK-IN"
  totalDays: number;
  daysCompleted: number;
  xpReward: number;
  badge: string;
  active: boolean;
}
