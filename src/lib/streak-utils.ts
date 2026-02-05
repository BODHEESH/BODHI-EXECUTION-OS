/**
 * Streak Calculation Utilities
 * Handles habit streak tracking and calculations
 */

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  lastCompletedAt: string | null;
}

export const HABIT_NAMES = {
  DEEP_WORK: 'Deep Work',
  GYM: 'Gym',
  CONTENT: 'Content',
  ECOMMERCE: 'E-commerce',
  PRINTER: '3D Printing',
  SLEEP_BEFORE_11: 'Sleep Before 11',
  WAKE_530: 'Wake 5:30',
} as const;

export function calculateStreakStatus(lastCompletedAt: string | null): {
  isActive: boolean;
  daysAgo: number;
  status: 'active' | 'broken' | 'new';
} {
  if (!lastCompletedAt) {
    return { isActive: false, daysAgo: 0, status: 'new' };
  }

  const lastDate = new Date(lastCompletedAt);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - lastDate.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return { isActive: true, daysAgo: 0, status: 'active' };
  } else if (diffDays === 1) {
    return { isActive: true, daysAgo: 1, status: 'active' };
  } else {
    return { isActive: false, daysAgo: diffDays, status: 'broken' };
  }
}

export function getStreakEmoji(streak: number): string {
  if (streak === 0) return '⚪';
  if (streak < 7) return '🔥';
  if (streak < 30) return '🔥🔥';
  if (streak < 60) return '🔥🔥🔥';
  return '🔥🔥🔥🔥';
}

export function getStreakColor(streak: number): string {
  if (streak === 0) return 'text-gray-400';
  if (streak < 7) return 'text-orange-500';
  if (streak < 30) return 'text-red-500';
  if (streak < 60) return 'text-purple-500';
  return 'text-pink-500';
}

export function getStreakMessage(streak: number): string {
  if (streak === 0) return 'Start your streak today!';
  if (streak === 1) return 'Great start! Keep going!';
  if (streak < 7) return `${streak} days! Building momentum!`;
  if (streak === 7) return '1 week streak! Amazing!';
  if (streak < 30) return `${streak} days! You\'re on fire!`;
  if (streak === 30) return '30 days! Habit formed!';
  if (streak < 60) return `${streak} days! Unstoppable!`;
  if (streak === 60) return '60 days! You\'re a legend!';
  return `${streak} days! Incredible consistency!`;
}

export async function updateStreakOnCompletion(
  userId: string,
  habitName: string,
  completed: boolean
): Promise<void> {
  try {
    await fetch('/api/habit-streaks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        habitName,
        completed,
      }),
    });
  } catch (error) {
    console.error('Failed to update streak:', error);
  }
}

export function calculateCompletionRate(
  totalCompletions: number,
  daysSinceStart: number
): number {
  if (daysSinceStart === 0) return 0;
  return Math.round((totalCompletions / daysSinceStart) * 100);
}

export function getStreakInsight(streakData: StreakData): string {
  const { currentStreak, longestStreak, totalCompletions } = streakData;
  
  if (currentStreak === longestStreak && currentStreak > 0) {
    return `Personal best! ${currentStreak} days is your longest streak!`;
  }
  
  if (currentStreak === 0 && longestStreak > 0) {
    return `You had a ${longestStreak}-day streak. You can beat it!`;
  }
  
  if (totalCompletions > 100) {
    return `${totalCompletions} total completions! You're a champion!`;
  }
  
  return 'Keep building your streak!';
}
