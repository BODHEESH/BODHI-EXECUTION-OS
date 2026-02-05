"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, Circle, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { DailyTracker } from "@/lib/schemas";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useReminders } from "@/hooks/use-reminders";
import { ReminderBanner } from "@/components/reminder-banner";
import { ensureTodayTrackerExists } from "@/lib/daily-tracker-utils";

const habits = [
  { key: "deepWorkDone", label: "🔥 Deep Work Session" },
  { key: "gymDone", label: "💪 Gym / Exercise" },
  { key: "contentDone", label: "🎬 Content Creation" },
  { key: "ecommerceDone", label: "🛍️ E-commerce Work" },
  { key: "printerDone", label: "🖨️ 3D Printing" },
  { key: "sleepBefore11", label: "🌙 Sleep Before 11 PM" },
  { key: "wake530", label: "⏰ Wake at 5:30 AM" },
];

const getMoodColor = (mood: string) => {
  switch (mood) {
    case "GREAT": return "bg-green-100 text-green-800";
    case "GOOD": return "bg-blue-100 text-blue-800";
    case "OK": return "bg-yellow-100 text-yellow-800";
    case "LOW": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

export default function DailyTrackerPage() {
  // Get current date in local timezone
  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const [selectedDate, setSelectedDate] = useState<string>(getCurrentDate());
  const [todayData, setTodayData] = useState<DailyTracker | null>(null);
  const [weeklyData, setWeeklyData] = useState<DailyTracker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const currentUser = useCurrentUser();
  const reminders = useReminders(currentUser || undefined);

  const today = getCurrentDate();
  const isToday = selectedDate === today;

  useEffect(() => {
    if (currentUser) {
      // Ensure today's tracker exists
      ensureTodayTrackerExists(currentUser);
      fetchData();
    }
  }, [currentUser, selectedDate]);

  // Auto-refresh at midnight
  useEffect(() => {
    const checkMidnight = setInterval(() => {
      const currentDate = getCurrentDate();
      if (currentDate !== selectedDate && isToday) {
        setSelectedDate(currentDate);
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkMidnight);
  }, [selectedDate, isToday]);

  const fetchData = async () => {
    if (!currentUser) return;
    
    try {
      setIsLoading(true);
      
      // Fetch selected date's data
      const todayResponse = await fetch(`/api/daily-tracker?date=${selectedDate}&userId=${currentUser}`);
      const todayResult = await todayResponse.json();
      
      if (todayResult && todayResult.length > 0) {
        setTodayData(todayResult[0]);
      } else if (isToday) {
        // Create today's entry with defaults only if viewing today
        const defaultData: DailyTracker = {
          date: selectedDate,
          day: new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' }),
          deepWorkDone: false,
          gymDone: false,
          contentDone: false,
          ecommerceDone: false,
          printerDone: false,
          sleepBefore11: false,
          wake530: false,
          mood: "GOOD",
          userId: currentUser,
        };
        setTodayData(defaultData);
      } else {
        // No data for past date
        setTodayData(null);
      }

      // Fetch weekly data
      const weeklyResponse = await fetch(`/api/daily-tracker?userId=${currentUser}`);
      const weeklyResult = await weeklyResponse.json();
      setWeeklyData(weeklyResult);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleHabit = async (habitKey: keyof DailyTracker) => {
    if (!todayData) return;
    
    const updatedData = {
      ...todayData,
      [habitKey]: !todayData[habitKey]
    };
    
    // Remove notes if it's null to avoid validation issues
    if (updatedData.notes === null) {
      delete (updatedData as any).notes;
    }
    
    try {
      setIsSaving(true);
      const response = await fetch('/api/daily-tracker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      
      if (response.ok) {
        setTodayData(updatedData);
        // Refresh weekly data
        fetchData();
      }
    } catch (error) {
      console.error('Failed to update habit:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const updateMood = async (mood: DailyTracker['mood']) => {
    if (!todayData) return;
    
    const updatedData = {
      ...todayData,
      mood
    };
    
    // Remove notes if it's null to avoid validation issues
    if (updatedData.notes === null) {
      delete (updatedData as any).notes;
    }
    
    try {
      setIsSaving(true);
      const response = await fetch('/api/daily-tracker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      
      if (response.ok) {
        setTodayData(updatedData);
      }
    } catch (error) {
      console.error('Failed to update mood:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const calculateScore = (data: DailyTracker | null) => {
    if (!data) return 0;
    return habits.reduce((score, habit) => {
      return score + (data[habit.key as keyof DailyTracker] as boolean ? 1 : 0);
    }, 0);
  };

  const getStreaks = () => {
    const gymStreak = calculateStreak('gymDone');
    const deepWorkStreak = calculateStreak('deepWorkDone');
    const wakeStreak = calculateStreak('wake530');
    
    return { gymStreak, deepWorkStreak, wakeStreak };
  };

  const calculateStreak = (habitKey: keyof DailyTracker) => {
    let streak = 0;
    const sortedData = [...weeklyData].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    for (const day of sortedData) {
      if (day[habitKey] as boolean) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const currentDate = new Date(selectedDate);
    if (direction === 'prev') {
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      currentDate.setDate(currentDate.getDate() + 1);
    }
    const newDate = currentDate.toISOString().split('T')[0];
    // Don't allow future dates
    if (newDate <= today) {
      setSelectedDate(newDate);
    }
  };

  const goToToday = () => {
    setSelectedDate(today);
  };

  const formatDisplayDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Daily Tracker</h1>
          <p className="text-gray-600">Track your daily habits and progress</p>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const score = calculateScore(todayData);
  const streaks = getStreaks();
  const weeklyTotal = weeklyData.reduce((total, day) => total + calculateScore(day), 0);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Reminder Banner */}
      <ReminderBanner reminders={reminders} />
      
      {/* Header with Date Navigation */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-4 sm:p-6 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Daily Tracker</h1>
          <div className="flex items-center justify-center sm:justify-end gap-1 sm:gap-2 flex-wrap">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateDate('prev')}
              className="text-white hover:bg-white/20 p-2 sm:px-3"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCalendar(!showCalendar)}
              className="text-white hover:bg-white/20 px-2 sm:px-4 text-xs sm:text-sm"
            >
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">
                {isToday ? 'Today' : formatDisplayDate(selectedDate).split(',')[0]}
              </span>
              <span className="xs:hidden">
                {isToday ? 'Today' : formatDisplayDate(selectedDate).split(',')[0].slice(0, 8)}
              </span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateDate('next')}
              disabled={selectedDate === today}
              className="text-white hover:bg-white/20 disabled:opacity-50 p-2 sm:px-3"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            {!isToday && (
              <Button
                variant="ghost"
                size="sm"
                onClick={goToToday}
                className="text-white hover:bg-white/20 px-2 sm:px-3 text-xs sm:text-sm"
              >
                Today
              </Button>
            )}
          </div>
        </div>
        <p className="text-blue-100 text-xs sm:text-sm lg:text-base">{formatDisplayDate(selectedDate)}</p>
        
        {/* Calendar Picker */}
        {showCalendar && (
          <div className="mt-4 bg-white rounded-lg p-3 sm:p-4 text-gray-900">
            <input
              type="date"
              value={selectedDate}
              max={today}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setShowCalendar(false);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        {/* Today's Progress */}
        <Card className="shadow-md">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
              {isToday ? "Today's" : ""} Habits & Mood
            </CardTitle>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">{selectedDate}</p>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {!todayData && !isToday ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>No data recorded for this date</p>
              </div>
            ) : (
              <>
            {/* Habits Grid */}
            <div className="grid grid-cols-1 gap-2 sm:gap-3">
              {habits.map((habit) => (
                <button
                  key={habit.key}
                  onClick={() => toggleHabit(habit.key as keyof DailyTracker)}
                  className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg transition-all ${
                    todayData && todayData[habit.key as keyof DailyTracker]
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-500 shadow-sm'
                      : 'bg-gray-50 border-2 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {todayData && todayData[habit.key as keyof DailyTracker] ? (
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                  ) : (
                    <Circle className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
                  )}
                  <span className="text-xs sm:text-sm font-medium text-left">{habit.label}</span>
                </button>
              ))}
            </div>
            
            {/* Score Progress */}
            <div className="pt-4 border-t space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Today's Score</span>
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-base px-3 py-1">
                  {score}/7
                </Badge>
              </div>
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${(score / 7) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-600 mt-1 block text-center">
                  {Math.round((score / 7) * 100)}% Complete
                </span>
              </div>
            </div>

            {/* Mood Selector */}
            <div className="pt-4 border-t">
              <span className="text-xs sm:text-sm font-semibold text-gray-700 block mb-2 sm:mb-3">How's your mood?</span>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-2">
                {(["GREAT", "GOOD", "OK", "LOW"] as const).map((mood) => (
                  <Button
                    key={mood}
                    variant={todayData?.mood === mood ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateMood(mood)}
                    disabled={isSaving}
                    className={`text-xs sm:text-sm ${
                      todayData?.mood === mood
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {mood}
                  </Button>
                ))}
              </div>
            </div>
            </>
            )}
          </CardContent>
        </Card>

        {/* Weekly Habit Overview */}
        <Card className="shadow-md">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
            <CardTitle className="text-base sm:text-lg">Weekly Habit Overview</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => {
                const dayData = weeklyData.find(d => {
                  const date = new Date(d.date);
                  return date.getDay() === (index === 6 ? 0 : index + 1);
                });
                const dayScore = dayData ? calculateScore(dayData) : 0;
                
                return (
                  <div key={day} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{day}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(dayScore / 7) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{dayScore}/7</span>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Weekly Total</span>
                <Badge variant="secondary">{weeklyTotal}/49</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-lg sm:text-xl">Streak Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
            <div className="text-center p-3 sm:p-4 bg-green-50 rounded-lg">
              <div className="text-xl sm:text-2xl font-bold text-green-600">{streaks.gymStreak} days</div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1">Gym Streak</div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg">
              <div className="text-xl sm:text-2xl font-bold text-blue-600">{streaks.deepWorkStreak} days</div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1">Deep Work Streak</div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-purple-50 rounded-lg">
              <div className="text-xl sm:text-2xl font-bold text-purple-600">{streaks.wakeStreak} days</div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1">Wake 5:30 Streak</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
