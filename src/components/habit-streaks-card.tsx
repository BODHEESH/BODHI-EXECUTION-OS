"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Trophy, TrendingUp } from "lucide-react";
import {
  getStreakEmoji,
  getStreakColor,
  getStreakMessage,
  getStreakInsight,
  calculateStreakStatus,
  HABIT_NAMES,
} from "@/lib/streak-utils";

interface HabitStreaksCardProps {
  userId: string;
  compact?: boolean;
}

export function HabitStreaksCard({ userId, compact = false }: HabitStreaksCardProps) {
  const [streaks, setStreaks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchStreaks();
    }
  }, [userId]);

  const fetchStreaks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/habit-streaks?userId=${userId}`);
      const data = await response.json();
      setStreaks(data);
    } catch (error) {
      console.error("Failed to fetch streaks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">Loading streaks...</div>
        </CardContent>
      </Card>
    );
  }

  const topStreaks = compact ? streaks.slice(0, 5) : streaks;
  const longestStreak = Math.max(...streaks.map(s => s.longestStreak), 0);
  const totalCompletions = streaks.reduce((sum, s) => sum + s.totalCompletions, 0);

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-600" />
            Habit Streaks
          </CardTitle>
          <div className="flex gap-2">
            <Badge className="bg-orange-100 text-orange-800">
              <Trophy className="h-3 w-3 mr-1" />
              {longestStreak} days
            </Badge>
            <Badge className="bg-purple-100 text-purple-800">
              {totalCompletions} total
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        {streaks.length === 0 ? (
          <div className="text-center py-8">
            <Flame className="h-12 w-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 mb-2">No streaks yet</p>
            <p className="text-xs text-gray-400">Complete your daily habits to start building streaks!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {topStreaks.map((streak) => {
              const streakStatus = calculateStreakStatus(streak.lastCompletedAt);
              const emoji = getStreakEmoji(streak.currentStreak);
              const color = getStreakColor(streak.currentStreak);
              const message = getStreakMessage(streak.currentStreak);
              const insight = getStreakInsight(streak);

              return (
                <div
                  key={streak.id}
                  className={`p-3 rounded-lg border-2 ${
                    streakStatus.isActive ? 'border-orange-200 bg-orange-50' : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{emoji}</span>
                      <div>
                        <h4 className="font-semibold text-sm text-gray-900">{streak.habitName}</h4>
                        <p className="text-xs text-gray-600">{message}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${color}`}>
                        {streak.currentStreak}
                      </div>
                      <div className="text-xs text-gray-500">days</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">
                      Best: {streak.longestStreak} days
                    </span>
                    <span className="text-gray-600">
                      Total: {streak.totalCompletions}
                    </span>
                  </div>

                  {!streakStatus.isActive && streak.currentStreak > 0 && (
                    <div className="mt-2 p-2 bg-red-50 rounded text-xs text-red-700 text-center">
                      ⚠️ Streak broken {streakStatus.daysAgo} days ago. Start again today!
                    </div>
                  )}

                  {streak.currentStreak === streak.longestStreak && streak.currentStreak > 0 && (
                    <div className="mt-2 p-2 bg-purple-50 rounded text-xs text-purple-700 text-center font-medium">
                      🏆 {insight}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {!compact && streaks.length > 0 && (
          <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <h4 className="font-semibold text-sm text-blue-900">Your Progress</h4>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white p-2 rounded">
                <div className="text-gray-600">Active Streaks</div>
                <div className="text-lg font-bold text-blue-600">
                  {streaks.filter(s => calculateStreakStatus(s.lastCompletedAt).isActive).length}
                </div>
              </div>
              <div className="bg-white p-2 rounded">
                <div className="text-gray-600">Avg Streak</div>
                <div className="text-lg font-bold text-purple-600">
                  {Math.round(streaks.reduce((sum, s) => sum + s.currentStreak, 0) / streaks.length)} days
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
