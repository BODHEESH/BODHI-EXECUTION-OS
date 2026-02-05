"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, ChevronLeft, ChevronRight } from "lucide-react";
import { DAILY_NON_NEGOTIABLES, WEEKLY_PLAN, getDayOfWeek, getWeekDates } from "@/lib/weekly-plan-config";

interface WeeklyPlanChecklistProps {
  userId: string;
  compact?: boolean;
  showOnlyToday?: boolean;
}

export function WeeklyPlanChecklist({ userId, compact = false, showOnlyToday = false }: WeeklyPlanChecklistProps) {
  const [weekData, setWeekData] = useState<any[]>([]);
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const todayDayOfWeek = getDayOfWeek(new Date());

  useEffect(() => {
    if (userId) {
      fetchWeekData();
    }
  }, [userId, currentWeekStart]);

  const fetchWeekData = async () => {
    try {
      setIsLoading(true);
      const weekDates = getWeekDates(currentWeekStart);
      const startDate = weekDates[0].date;
      const endDate = weekDates[6].date;

      const response = await fetch(
        `/api/weekly-plan?userId=${userId}&startDate=${startDate}&endDate=${endDate}`
      );
      const data = await response.json();

      // Create a map of existing data
      const dataMap = new Map(data.map((d: any) => [d.date, d]));

      // Fill in missing days with empty data
      const completeWeekData = weekDates.map(({ date, dayOfWeek }) => ({
        date,
        dayOfWeek,
        ...(dataMap.get(date) || {
          deepWorkDone: false,
          contentWorkDone: false,
          gymWalkDone: false,
          sleepBefore11: false,
          wake530: false,
          morningTaskDone: false,
          eveningTaskDone: false,
          fitnessTaskDone: false,
        }),
      }));

      setWeekData(completeWeekData);
    } catch (error) {
      console.error("Failed to fetch week data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCheckbox = async (date: string, dayOfWeek: string, field: string, currentValue: boolean) => {
    try {
      setIsSaving(true);
      const dayData = weekData.find(d => d.date === date) || {};

      const response = await fetch("/api/weekly-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          date,
          dayOfWeek,
          ...dayData,
          [field]: !currentValue,
        }),
      });

      if (response.ok) {
        fetchWeekData();
      }
    } catch (error) {
      console.error("Failed to update checklist:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeekStart(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeekStart(newDate);
  };

  const goToCurrentWeek = () => {
    setCurrentWeekStart(new Date());
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading weekly plan...</div>
        </CardContent>
      </Card>
    );
  }

  const displayData = showOnlyToday 
    ? weekData.filter(d => d.date === today)
    : weekData;

  return (
    <div className="space-y-4">
      {!showOnlyToday && (
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous Week
          </Button>
          <Button variant="outline" size="sm" onClick={goToCurrentWeek}>
            Current Week
          </Button>
          <Button variant="outline" size="sm" onClick={goToNextWeek}>
            Next Week
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}

      <div className={`grid gap-4 ${compact ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
        {displayData.map((day) => {
          const dayPlan = WEEKLY_PLAN[day.dayOfWeek as keyof typeof WEEKLY_PLAN];
          const isToday = day.date === today;
          const completedCount = DAILY_NON_NEGOTIABLES.filter(
            item => day[item.key]
          ).length;
          const totalCount = DAILY_NON_NEGOTIABLES.length;

          return (
            <Card
              key={day.date}
              className={`${isToday ? 'ring-2 ring-purple-500 shadow-lg' : ''}`}
            >
              <CardHeader className={`bg-gradient-to-r ${dayPlan.color} text-white`}>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {dayPlan.emoji} {dayPlan.day}
                      {isToday && <Badge className="bg-white text-purple-600">TODAY</Badge>}
                    </CardTitle>
                    <p className="text-sm opacity-90 mt-1">
                      {new Date(day.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{completedCount}/{totalCount}</div>
                    <div className="text-xs opacity-90">Completed</div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-4 space-y-4">
                {/* Daily Non-Negotiables */}
                <div>
                  <h4 className="font-semibold text-sm mb-2 text-gray-700">
                    Daily Must-Do ✅
                  </h4>
                  <div className="space-y-2">
                    {DAILY_NON_NEGOTIABLES.map((item) => (
                      <label
                        key={item.key}
                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                      >
                        <button
                          onClick={() => toggleCheckbox(day.date, day.dayOfWeek, item.key, day[item.key])}
                          disabled={isSaving}
                          className="flex-shrink-0"
                        >
                          {day[item.key] ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <Circle className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                        <span className={`text-sm ${day[item.key] ? 'line-through text-gray-500' : ''}`}>
                          {item.icon} {item.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Day-Specific Tasks */}
                {!compact && (
                  <div className="border-t pt-3">
                    <h4 className="font-semibold text-sm mb-2 text-gray-700">
                      Today's Focus 🎯
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="bg-blue-50 p-2 rounded">
                        <div className="font-medium text-blue-900">Morning (5:45-7:15 AM)</div>
                        <div className="text-blue-700">{dayPlan.morningTask}</div>
                      </div>
                      <div className="bg-purple-50 p-2 rounded">
                        <div className="font-medium text-purple-900">Evening (8:15-10:15 PM)</div>
                        <div className="text-purple-700">{dayPlan.eveningTask}</div>
                      </div>
                      <div className="bg-green-50 p-2 rounded">
                        <div className="font-medium text-green-900">Fitness (6:15-7:15 PM)</div>
                        <div className="text-green-700">{dayPlan.fitnessTask}</div>
                      </div>
                    </div>
                    <div className="mt-2 p-2 bg-amber-50 rounded">
                      <div className="font-medium text-amber-900 text-xs">Goal:</div>
                      <div className="text-amber-700 text-sm">{dayPlan.goal}</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
