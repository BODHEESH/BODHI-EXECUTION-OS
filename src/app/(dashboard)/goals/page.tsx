"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Target, TrendingUp, Award, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useSession } from "next-auth/react";
import { GoalsCard } from "@/components/goals-card";
import { HabitStreaksCard } from "@/components/habit-streaks-card";
import { AccountabilityFeed } from "@/components/accountability-feed";
import { getGoalSuggestions, type Goal } from "@/lib/goal-utils";

export default function GoalsPage() {
  const currentUser = useCurrentUser();
  const { data: session } = useSession();
  const userRole = (session?.user?.role as 'ME' | 'WIFE') || 'ME';
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Goal['category']>('CONTENT');
  const [isAdding, setIsAdding] = useState(false);

  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'CONTENT' as Goal['category'],
    targetValue: 0,
    unit: '',
    deadline: '',
    priority: 'MEDIUM' as 'HIGH' | 'MEDIUM' | 'LOW',
    sharedWith: undefined as 'ME' | 'WIFE' | undefined,
  });

  const addGoal = async () => {
    if (!currentUser || !newGoal.title || !newGoal.targetValue || !newGoal.deadline) return;

    try {
      setIsAdding(true);
      const response = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newGoal,
          userId: currentUser,
        }),
      });

      if (response.ok) {
        setNewGoal({
          title: '',
          description: '',
          category: 'CONTENT',
          targetValue: 0,
          unit: '',
          deadline: '',
          priority: 'MEDIUM',
          sharedWith: undefined,
        });
        setShowAddForm(false);
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to add goal:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const suggestions = getGoalSuggestions(selectedCategory);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Goals & Streaks</h1>
            <p className="text-purple-100 text-sm sm:text-base">Track your 60-day plan progress and build consistency</p>
          </div>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-white text-purple-600 hover:bg-purple-50 shadow-md"
          >
            <Plus className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">New Goal</span>
          </Button>
        </div>
      </div>

      {/* Add Goal Form */}
      {showAddForm && (
        <Card className="border-2 border-purple-300 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
            <CardTitle className="text-lg font-bold">Create New Goal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Goal Title *
                </label>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., Reach 10K YouTube subscribers"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  value={newGoal.category}
                  onChange={(e) => {
                    const cat = e.target.value as Goal['category'];
                    setNewGoal({ ...newGoal, category: cat });
                    setSelectedCategory(cat);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="CONTENT">Content</option>
                  <option value="BUSINESS">Business</option>
                  <option value="HEALTH">Health</option>
                  <option value="PERSONAL">Personal</option>
                  <option value="LEARNING">Learning</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={newGoal.priority}
                  onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value as 'HIGH' | 'MEDIUM' | 'LOW' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Value *
                </label>
                <input
                  type="number"
                  value={newGoal.targetValue || ''}
                  onChange={(e) => setNewGoal({ ...newGoal, targetValue: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., 10000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit *
                </label>
                <input
                  type="text"
                  value={newGoal.unit}
                  onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., subscribers, revenue, kg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deadline *
                </label>
                <input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Share with Wife
                </label>
                <select
                  value={newGoal.sharedWith || ''}
                  onChange={(e) => setNewGoal({ ...newGoal, sharedWith: e.target.value as 'WIFE' | undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">No</option>
                  <option value="WIFE">Yes - Share for accountability</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Optional description"
                />
              </div>
            </div>

            {/* Goal Suggestions */}
            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">💡 Suggested Goals for {selectedCategory}</h4>
              <div className="space-y-1">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setNewGoal({
                      ...newGoal,
                      title: suggestion.title,
                      targetValue: suggestion.targetValue,
                      unit: suggestion.unit,
                    })}
                    className="block w-full text-left text-xs text-blue-700 hover:text-blue-900 hover:underline"
                  >
                    • {suggestion.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button
                onClick={addGoal}
                disabled={!newGoal.title || !newGoal.targetValue || !newGoal.deadline || isAdding}
              >
                {isAdding ? "Creating..." : "Create Goal"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Goals Section */}
        <div className="space-y-4">
          <Card className="shadow-md">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-600" />
                Active Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <GoalsCard userId={currentUser || ""} />
            </CardContent>
          </Card>
        </div>

        {/* Streaks & Accountability Section */}
        <div className="space-y-4">
          <HabitStreaksCard userId={currentUser || ""} />
          <AccountabilityFeed userId={currentUser || ""} userRole={userRole} />
        </div>
      </div>

      {/* 60-Day Success Tracker */}
      <Card className="shadow-lg border-2 border-purple-200">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Award className="h-5 w-5" />
            60-Day Success Tracker
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <h4 className="font-semibold text-sm text-blue-900">YouTube</h4>
              </div>
              <p className="text-xs text-gray-600">Consistency becomes habit</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-green-600" />
                <h4 className="font-semibold text-sm text-green-900">Ecommerce</h4>
              </div>
              <p className="text-xs text-gray-600">Launch achieved</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-4 w-4 text-purple-600" />
                <h4 className="font-semibold text-sm text-purple-900">Fitness</h4>
              </div>
              <p className="text-xs text-gray-600">Routine established</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-orange-600" />
                <h4 className="font-semibold text-sm text-orange-900">3D Printing</h4>
              </div>
              <p className="text-xs text-gray-600">Income stream active</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
