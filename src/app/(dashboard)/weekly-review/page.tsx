"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, TrendingUp, TrendingDown, Target, CheckCircle, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { exportToCSV } from "@/lib/export-utils";

export default function WeeklyReviewPage() {
  const [weeklyData, setWeeklyData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = useCurrentUser();

  useEffect(() => {
    if (currentUser) {
      fetchWeeklyData();
    }
  }, [currentUser]);

  const fetchWeeklyData = async () => {
    if (!currentUser) return;

    try {
      setIsLoading(true);

      // Get date range for this week
      const today = new Date();
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      // Fetch all data
      const [tasksRes, trackersRes, contentRes, businessRes] = await Promise.all([
        fetch(`/api/tasks?userId=${currentUser}`),
        fetch(`/api/daily-tracker?userId=${currentUser}`),
        fetch(`/api/content?userId=${currentUser}`),
        fetch(`/api/business?userId=${currentUser}`),
      ]);

      const tasks = await tasksRes.json();
      const trackers = await trackersRes.json();
      const content = await contentRes.json();
      const business = await businessRes.json();

      // Filter for this week
      const weekTrackers = trackers.filter((t: any) => {
        const date = new Date(t.date);
        return date >= weekStart && date <= weekEnd;
      });

      const weekTasks = tasks.filter((t: any) => t.status === 'DONE' && t.updatedAt);

      // Calculate metrics
      const habitScore = weekTrackers.reduce((sum: number, day: any) => {
        const score = (day.deepWorkDone ? 1 : 0) + (day.gymDone ? 1 : 0) + 
                     (day.contentDone ? 1 : 0) + (day.ecommerceDone ? 1 : 0) + 
                     (day.printerDone ? 1 : 0) + (day.sleepBefore11 ? 1 : 0);
        return sum + score;
      }, 0);

      const totalPossible = weekTrackers.length * 6;
      const habitPercentage = totalPossible > 0 ? Math.round((habitScore / totalPossible) * 100) : 0;

      const weekContent = content.filter((c: any) => {
        if (!c.publishDate) return false;
        const date = new Date(c.publishDate);
        return date >= weekStart && date <= weekEnd;
      });

      const weekBusiness = business.filter((b: any) => {
        const date = new Date(b.orderDate);
        return date >= weekStart && date <= weekEnd;
      });

      const weekProfit = weekBusiness.reduce((sum: number, order: any) => 
        sum + (order.amount - order.cost), 0
      );

      setWeeklyData({
        weekStart: weekStart.toLocaleDateString(),
        weekEnd: weekEnd.toLocaleDateString(),
        habitScore,
        habitPercentage,
        totalPossible,
        tasksCompleted: weekTasks.length,
        contentPublished: weekContent.length,
        ordersReceived: weekBusiness.length,
        weekProfit,
        trackers: weekTrackers,
        moodDistribution: calculateMoodDistribution(weekTrackers),
      });
    } catch (error) {
      console.error("Failed to fetch weekly data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateMoodDistribution = (trackers: any[]) => {
    const distribution = { GREAT: 0, GOOD: 0, OK: 0, LOW: 0 };
    trackers.forEach((t: any) => {
      if (t.mood) distribution[t.mood as keyof typeof distribution]++;
    });
    return distribution;
  };

  const exportWeeklyReport = () => {
    if (!weeklyData) return;
    
    const report = [
      {
        Week: `${weeklyData.weekStart} - ${weeklyData.weekEnd}`,
        'Habit Score': `${weeklyData.habitScore}/${weeklyData.totalPossible}`,
        'Habit Percentage': `${weeklyData.habitPercentage}%`,
        'Tasks Completed': weeklyData.tasksCompleted,
        'Content Published': weeklyData.contentPublished,
        'Orders Received': weeklyData.ordersReceived,
        'Week Profit': `₹${weeklyData.weekProfit}`,
      }
    ];
    
    exportToCSV(report, 'weekly_review');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Weekly Review</h1>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading weekly data...</p>
        </div>
      </div>
    );
  }

  if (!weeklyData) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Weekly Review</h1>
        <p className="text-gray-600">No data available for this week.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Weekly Review</h1>
          <p className="text-gray-600">{weeklyData.weekStart} - {weeklyData.weekEnd}</p>
        </div>
        <Button onClick={exportWeeklyReport} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Habit Score</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {weeklyData.habitScore}/{weeklyData.totalPossible}
            </div>
            <p className="text-xs text-muted-foreground">
              {weeklyData.habitPercentage}% completion
            </p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${weeklyData.habitPercentage}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Done</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{weeklyData.tasksCompleted}</div>
            <p className="text-xs text-muted-foreground">Completed this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{weeklyData.contentPublished}</div>
            <p className="text-xs text-muted-foreground">Published this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{weeklyData.weekProfit.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{weeklyData.ordersReceived} orders</p>
          </CardContent>
        </Card>
      </div>

      {/* Daily Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Habit Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {weeklyData.trackers.map((tracker: any) => {
              const dayScore = (tracker.deepWorkDone ? 1 : 0) + (tracker.gymDone ? 1 : 0) + 
                              (tracker.contentDone ? 1 : 0) + (tracker.ecommerceDone ? 1 : 0) + 
                              (tracker.printerDone ? 1 : 0) + (tracker.sleepBefore11 ? 1 : 0);
              const dayPercentage = Math.round((dayScore / 6) * 100);

              return (
                <div key={tracker.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="text-sm font-medium w-24">
                      {new Date(tracker.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                    <div className="flex gap-1">
                      {tracker.deepWorkDone && <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">Deep Work</span>}
                      {tracker.gymDone && <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Gym</span>}
                      {tracker.contentDone && <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">Content</span>}
                      {tracker.ecommerceDone && <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">Ecommerce</span>}
                      {tracker.printerDone && <span className="px-2 py-1 bg-pink-100 text-pink-700 text-xs rounded">Printer</span>}
                      {tracker.sleepBefore11 && <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded">Sleep</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold">{dayScore}/6</span>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${dayPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Mood Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Mood Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(weeklyData.moodDistribution).map(([mood, count]) => (
              <div key={mood} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{count as number}</div>
                <div className="text-sm text-gray-600">{mood}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
