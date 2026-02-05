/**
 * Weekly Plan Configuration
 * Based on your 60-day execution plan
 */

export type DayOfWeek = 'SUNDAY' | 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY';

export interface DayPlan {
  day: DayOfWeek;
  emoji: string;
  color: string;
  morningTask: string;
  morningTaskDetail: string;
  eveningTask: string;
  eveningTaskDetail: string;
  fitnessTask: string;
  goal: string;
  specialNotes?: string;
}

export const DAILY_NON_NEGOTIABLES = [
  { key: 'deepWorkDone', label: 'Deep Work (60+ min)', icon: '🔥' },
  { key: 'contentWorkDone', label: 'Content Work (30+ min)', icon: '🎬' },
  { key: 'gymWalkDone', label: 'Gym/Walk (30+ min)', icon: '💪' },
  { key: 'sleepBefore11', label: 'Sleep Before 11 PM', icon: '🌙' },
  { key: 'wake530', label: 'Wake at 5:30 AM', icon: '⏰' },
];

export const WEEKLY_PLAN: Record<DayOfWeek, DayPlan> = {
  SUNDAY: {
    day: 'SUNDAY',
    emoji: '🟢',
    color: 'from-green-600 to-emerald-600',
    morningTask: 'Weekly Planning',
    morningTaskDetail: 'Create tasks for the week, set content plan, review last week stats',
    eveningTask: 'Clothing Business',
    eveningTaskDetail: 'Focus on clothing business operations',
    fitnessTask: 'Rest Day',
    goal: 'Complete weekly planning + clothing business',
    specialNotes: 'NO gym, NO heavy editing. Only planning + business.',
  },
  MONDAY: {
    day: 'MONDAY',
    emoji: '🔵',
    color: 'from-blue-600 to-cyan-600',
    morningTask: 'Ecommerce Development',
    morningTaskDetail: 'Feature completion, bug fixes, improvements',
    eveningTask: 'Ecommerce Admin',
    eveningTaskDetail: 'Product upload, SEO content, banner updates, pricing',
    fitnessTask: 'Gym',
    goal: 'Move ecommerce 5% forward',
  },
  TUESDAY: {
    day: 'TUESDAY',
    emoji: '🟣',
    color: 'from-purple-600 to-pink-600',
    morningTask: 'YouTube Shoot',
    morningTaskDetail: '1 Bodhi Tech Talks video + 1 Bodhi Learn short',
    eveningTask: 'Video Editing',
    eveningTaskDetail: 'Start editing + thumbnail planning',
    fitnessTask: 'Walk / Light Workout',
    goal: 'At least 2 recordings finished',
  },
  WEDNESDAY: {
    day: 'WEDNESDAY',
    emoji: '🟠',
    color: 'from-orange-600 to-amber-600',
    morningTask: 'Learning',
    morningTaskDetail: 'DSA / System Design / JS Learning (1 topic only)',
    eveningTask: 'Shorts + Reels',
    eveningTaskDetail: 'Edit 1 short, schedule reels for Insta + Shorts',
    fitnessTask: 'Gym',
    goal: '1 short ready + gym done',
  },
  THURSDAY: {
    day: 'THURSDAY',
    emoji: '🟡',
    color: 'from-yellow-600 to-orange-600',
    morningTask: '3D Print Planning',
    morningTaskDetail: 'Pricing, product ideas, reel scripts, order system',
    eveningTask: 'Marketing + Posting',
    eveningTaskDetail: 'Schedule reels, reply comments, product photography',
    fitnessTask: 'Walk / Stretching',
    goal: '3D business must move weekly',
    specialNotes: 'Wife main role: Printer practice + product preparation',
  },
  FRIDAY: {
    day: 'FRIDAY',
    emoji: '🔴',
    color: 'from-red-600 to-rose-600',
    morningTask: 'Upload + Publish',
    morningTaskDetail: 'Finalize title, description, tags, publish/schedule main video',
    eveningTask: 'Weekly Cleanup',
    eveningTaskDetail: 'Close completed tasks, move backlog tasks, plan Saturday',
    fitnessTask: 'Gym',
    goal: 'Main video must be published or scheduled',
  },
  SATURDAY: {
    day: 'SATURDAY',
    emoji: '🟤',
    color: 'from-amber-700 to-orange-700',
    morningTask: 'Batch Content Creation',
    morningTaskDetail: 'Record 2 shorts OR edit 2 reels',
    eveningTask: 'Ecommerce Finalization',
    eveningTaskDetail: 'Checkout testing, UI improvements, bug fixing',
    fitnessTask: 'Rest / Light Activity',
    goal: 'Big progress day (ecommerce + content)',
    specialNotes: 'Clothing business 4 PM – 9:30 PM',
  },
};

export const WEEKLY_OUTPUT_TARGETS = {
  content: [
    { label: '1 long YouTube video', key: 'longVideo' },
    { label: '3 shorts', key: 'shorts' },
    { label: '5 reels (repurpose)', key: 'reels' },
  ],
  health: [
    { label: '3 gym sessions', key: 'gymSessions' },
    { label: '2 light walks', key: 'walks' },
  ],
  business: [
    { label: 'Ecommerce progress 5–10%', key: 'ecommerceProgress' },
    { label: '3D printer practice (3 sessions)', key: 'printerPractice' },
  ],
};

export const BURNOUT_PREVENTION_RULES = [
  '❌ No new projects for 60 days',
  '❌ No new channel',
  '❌ No unnecessary shopping',
  '❌ No working after 10:30 PM',
];

export function getDayOfWeek(date: Date): DayOfWeek {
  const days: DayOfWeek[] = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  return days[date.getDay()];
}

export function getTodayPlan(): DayPlan {
  const today = getDayOfWeek(new Date());
  return WEEKLY_PLAN[today];
}

export function getWeekDates(startDate?: Date): { date: string; dayOfWeek: DayOfWeek }[] {
  const start = startDate || new Date();
  const dates: { date: string; dayOfWeek: DayOfWeek }[] = [];
  
  // Get start of week (Sunday)
  const dayOfWeek = start.getDay();
  const diff = start.getDate() - dayOfWeek;
  const sunday = new Date(start.setDate(diff));
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(sunday);
    date.setDate(sunday.getDate() + i);
    dates.push({
      date: date.toISOString().split('T')[0],
      dayOfWeek: getDayOfWeek(date),
    });
  }
  
  return dates;
}

export function calculateWeeklyScore(weekData: any[]): {
  totalScore: number;
  maxScore: number;
  percentage: number;
  breakdown: {
    deepWork: number;
    content: number;
    fitness: number;
    sleep: number;
    wake: number;
  };
} {
  const breakdown = {
    deepWork: 0,
    content: 0,
    fitness: 0,
    sleep: 0,
    wake: 0,
  };
  
  weekData.forEach(day => {
    if (day.deepWorkDone) breakdown.deepWork++;
    if (day.contentWorkDone) breakdown.content++;
    if (day.gymWalkDone) breakdown.fitness++;
    if (day.sleepBefore11) breakdown.sleep++;
    if (day.wake530) breakdown.wake++;
  });
  
  const totalScore = Object.values(breakdown).reduce((sum, val) => sum + val, 0);
  const maxScore = weekData.length * 5; // 5 non-negotiables per day
  const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  
  return {
    totalScore,
    maxScore,
    percentage,
    breakdown,
  };
}
