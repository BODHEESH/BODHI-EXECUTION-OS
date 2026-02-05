/**
 * Goal Progress Utilities
 * Handles goal tracking and progress calculations
 */

export interface Goal {
  id: string;
  title: string;
  description?: string;
  category: 'CONTENT' | 'BUSINESS' | 'HEALTH' | 'PERSONAL' | 'LEARNING';
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'PAUSED' | 'CANCELLED';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  sharedWith?: 'ME' | 'WIFE';
}

export function calculateProgress(currentValue: number, targetValue: number): number {
  if (targetValue === 0) return 0;
  return Math.min(Math.round((currentValue / targetValue) * 100), 100);
}

export function getDaysRemaining(deadline: string): number {
  const deadlineDate = new Date(deadline);
  const today = new Date();
  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function getProgressColor(progress: number): string {
  if (progress < 25) return 'bg-red-500';
  if (progress < 50) return 'bg-orange-500';
  if (progress < 75) return 'bg-yellow-500';
  if (progress < 100) return 'bg-blue-500';
  return 'bg-green-500';
}

export function getUrgencyLevel(daysRemaining: number, progress: number): {
  level: 'critical' | 'urgent' | 'normal' | 'comfortable';
  color: string;
  message: string;
} {
  if (daysRemaining < 0) {
    return {
      level: 'critical',
      color: 'text-red-600',
      message: 'Overdue!',
    };
  }

  if (daysRemaining <= 3 && progress < 80) {
    return {
      level: 'critical',
      color: 'text-red-600',
      message: 'Critical! Push hard!',
    };
  }

  if (daysRemaining <= 7 && progress < 50) {
    return {
      level: 'urgent',
      color: 'text-orange-600',
      message: 'Urgent! Speed up!',
    };
  }

  if (daysRemaining <= 14 && progress < 30) {
    return {
      level: 'urgent',
      color: 'text-orange-600',
      message: 'Behind schedule!',
    };
  }

  return {
    level: 'comfortable',
    color: 'text-green-600',
    message: 'On track!',
  };
}

export function getCategoryIcon(category: Goal['category']): string {
  const icons = {
    CONTENT: '🎬',
    BUSINESS: '💼',
    HEALTH: '💪',
    PERSONAL: '🎯',
    LEARNING: '📚',
  };
  return icons[category];
}

export function getCategoryColor(category: Goal['category']): string {
  const colors = {
    CONTENT: 'from-pink-500 to-rose-500',
    BUSINESS: 'from-green-500 to-emerald-500',
    HEALTH: 'from-blue-500 to-cyan-500',
    PERSONAL: 'from-purple-500 to-indigo-500',
    LEARNING: 'from-orange-500 to-amber-500',
  };
  return colors[category];
}

export function formatGoalValue(value: number, unit: string): string {
  if (unit === 'revenue' || unit === 'profit') {
    return `₹${value.toLocaleString()}`;
  }
  if (unit === 'kg' || unit === 'weight') {
    return `${value} kg`;
  }
  if (unit === 'subscribers') {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  }
  return `${value} ${unit}`;
}

export function getGoalSuggestions(category: Goal['category']): {
  title: string;
  unit: string;
  targetValue: number;
}[] {
  const suggestions = {
    CONTENT: [
      { title: 'Reach 10K YouTube subscribers', unit: 'subscribers', targetValue: 10000 },
      { title: 'Publish 12 videos this month', unit: 'videos', targetValue: 12 },
      { title: 'Create 30 shorts', unit: 'shorts', targetValue: 30 },
    ],
    BUSINESS: [
      { title: 'Achieve ₹50K monthly revenue', unit: 'revenue', targetValue: 50000 },
      { title: 'Complete ecommerce launch', unit: 'progress', targetValue: 100 },
      { title: 'Get 10 3D printing orders', unit: 'orders', targetValue: 10 },
    ],
    HEALTH: [
      { title: 'Lose 5 kg weight', unit: 'kg', targetValue: 5 },
      { title: 'Complete 30 gym sessions', unit: 'sessions', targetValue: 30 },
      { title: 'Run 100 km total', unit: 'km', targetValue: 100 },
    ],
    PERSONAL: [
      { title: 'Read 5 books', unit: 'books', targetValue: 5 },
      { title: 'Save ₹1 lakh', unit: 'savings', targetValue: 100000 },
      { title: 'Complete 60-day execution plan', unit: 'days', targetValue: 60 },
    ],
    LEARNING: [
      { title: 'Complete DSA course', unit: 'lessons', targetValue: 50 },
      { title: 'Solve 100 coding problems', unit: 'problems', targetValue: 100 },
      { title: 'Learn Next.js advanced features', unit: 'topics', targetValue: 20 },
    ],
  };

  return suggestions[category];
}

export async function shareGoalWithWife(
  goalId: string,
  fromUserId: string,
  toUserId: string,
  message?: string
): Promise<void> {
  try {
    await fetch('/api/accountability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fromUserId,
        toUserId,
        shareType: 'GOAL',
        itemId: goalId,
        message: message || 'Check out my goal!',
      }),
    });
  } catch (error) {
    console.error('Failed to share goal:', error);
  }
}

export function calculateRequiredDailyProgress(
  currentValue: number,
  targetValue: number,
  daysRemaining: number
): number {
  if (daysRemaining <= 0) return targetValue - currentValue;
  const remaining = targetValue - currentValue;
  return Math.ceil(remaining / daysRemaining);
}

export function getMotivationalMessage(progress: number, daysRemaining: number): string {
  if (progress >= 100) {
    return '🎉 Goal achieved! Set a new one!';
  }

  if (progress >= 75) {
    return '🔥 Almost there! Keep pushing!';
  }

  if (progress >= 50) {
    return '💪 Halfway done! You got this!';
  }

  if (progress >= 25) {
    return '🚀 Good start! Stay consistent!';
  }

  if (daysRemaining <= 7) {
    return '⚡ Time to accelerate! You can do it!';
  }

  return '🎯 Let\'s make progress today!';
}
