"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, TrendingUp, Calendar, Award } from "lucide-react";
import { useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { WeeklyPlanChecklist } from "@/components/weekly-plan-checklist";
import { calculateWeeklyScore, getWeekDates, WEEKLY_OUTPUT_TARGETS, BURNOUT_PREVENTION_RULES } from "@/lib/weekly-plan-config";

export default function ExecutionPlanPage() {
  const currentUser = useCurrentUser();
  const [weekData, setWeekData] = useState<any[]>([]);
  const [weeklyScore, setWeeklyScore] = useState({ totalScore: 0, maxScore: 0, percentage: 0, breakdown: { deepWork: 0, content: 0, fitness: 0, sleep: 0, wake: 0 } });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      fetchWeekData();
    }
  }, [currentUser]);

  const fetchWeekData = async () => {
    try {
      setIsLoading(true);
      const weekDates = getWeekDates(new Date());
      const startDate = weekDates[0].date;
      const endDate = weekDates[6].date;

      const response = await fetch(
        `/api/weekly-plan?userId=${currentUser}&startDate=${startDate}&endDate=${endDate}`
      );
      const data = await response.json();
      setWeekData(data);

      // Calculate weekly score
      const score = calculateWeeklyScore(data);
      setWeeklyScore(score);
    } catch (error) {
      console.error("Failed to fetch week data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white shadow-lg">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">60-Day Execution Plan</h1>
          <p className="text-purple-100 text-sm sm:text-base">Your path to consistent execution</p>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading your execution plan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white shadow-lg">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">60-Day Execution Plan</h1>
        <p className="text-purple-100 text-sm sm:text-base">Your path to consistent execution and success</p>
      </div>

      {/* Weekly Score Analytics */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Weekly Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{weeklyScore.percentage}%</div>
            <p className="text-xs text-gray-500 mt-1">{weeklyScore.totalScore}/{weeklyScore.maxScore} completed</p>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Deep Work</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{weeklyScore.breakdown.deepWork}/7</div>
            <p className="text-xs text-gray-500 mt-1">days completed</p>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Content Work</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-pink-600">{weeklyScore.breakdown.content}/7</div>
            <p className="text-xs text-gray-500 mt-1">days completed</p>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Fitness</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{weeklyScore.breakdown.fitness}/7</div>
            <p className="text-xs text-gray-500 mt-1">days completed</p>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Sleep Routine</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-600">{weeklyScore.breakdown.sleep}/7</div>
            <p className="text-xs text-gray-500 mt-1">days on track</p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Checklist */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-600" />
            This Week's Execution Checklist
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <WeeklyPlanChecklist userId={currentUser || ""} />
        </CardContent>
      </Card>

      {/* Weekly Output Targets */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="shadow-md">
          <CardHeader className="bg-gradient-to-r from-pink-50 to-rose-50">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Target className="h-5 w-5 text-pink-600" />
              Content Targets
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-2">
              {WEEKLY_OUTPUT_TARGETS.content.map((target) => (
                <div key={target.key} className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-pink-500"></div>
                  <span className="text-sm text-gray-700">{target.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Health Targets
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-2">
              {WEEKLY_OUTPUT_TARGETS.health.map((target) => (
                <div key={target.key} className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-700">{target.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Award className="h-5 w-5 text-blue-600" />
              Business Targets
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-2">
              {WEEKLY_OUTPUT_TARGETS.business.map((target) => (
                <div key={target.key} className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-gray-700">{target.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Burnout Prevention Rules */}
      <Card className="shadow-md border-2 border-amber-200">
        <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
          <CardTitle className="text-base font-semibold text-amber-900">
            ⚠️ Burnout Prevention Rules
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-2">
            {BURNOUT_PREVENTION_RULES.map((rule, index) => (
              <div key={index} className="flex items-start gap-2">
                <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                  Rule {index + 1}
                </Badge>
                <span className="text-sm text-gray-700">{rule}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 60-Day Success Formula */}
      <Card className="shadow-lg border-2 border-purple-200">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <CardTitle className="text-lg font-semibold">
            🎯 60-Day Success Formula
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-gray-700 mb-4">
            If you follow this schedule for 60 days, these will happen automatically:
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
              <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">1</div>
              <span className="text-sm font-medium text-gray-700">YouTube consistency becomes habit</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
              <div className="h-8 w-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">2</div>
              <span className="text-sm font-medium text-gray-700">Ecommerce will be launched</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
              <div className="h-8 w-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">3</div>
              <span className="text-sm font-medium text-gray-700">Fitness becomes routine</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg">
              <div className="h-8 w-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold">4</div>
              <span className="text-sm font-medium text-gray-700">3D printing becomes real income stream</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
