"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Target, Share2, Trash2, Edit } from "lucide-react";
import {
  calculateProgress,
  getDaysRemaining,
  getProgressColor,
  getUrgencyLevel,
  getCategoryIcon,
  formatGoalValue,
  getMotivationalMessage,
  type Goal,
} from "@/lib/goal-utils";

interface GoalsCardProps {
  userId: string;
  compact?: boolean;
}

export function GoalsCard({ userId, compact = false }: GoalsCardProps) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [updatingGoalId, setUpdatingGoalId] = useState<string | null>(null);
  const [updatedGoalId, setUpdatedGoalId] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      fetchGoals();
    }
  }, [userId]);

  const fetchGoals = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/goals?userId=${userId}&status=IN_PROGRESS`);
      const data = await response.json();
      setGoals(data);
    } catch (error) {
      console.error("Failed to fetch goals:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateGoalProgress = async (goalId: string, newValue: number) => {
    try {
      setUpdatingGoalId(goalId);
      
      console.log(`Updating goal ${goalId} to value ${newValue}`);
      
      const response = await fetch("/api/goals", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: goalId,
          currentValue: newValue,
        }),
      });
      
      const responseData = await response.json();
      console.log("Update response:", responseData);
      
      if (response.ok) {
        fetchGoals();
        setUpdatedGoalId(goalId);
        setTimeout(() => setUpdatedGoalId(null), 2000); // Clear success message after 2 seconds
      } else {
        console.error("Failed to update goal:", responseData.error);
        alert(`Failed to update goal: ${responseData.error}`);
      }
    } catch (error: any) {
      console.error("Failed to update goal:", error);
      alert(`Failed to update goal: ${error.message}`);
    } finally {
      setUpdatingGoalId(null);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">Loading goals...</div>
        </CardContent>
      </Card>
    );
  }

  const activeGoals = compact ? goals.slice(0, 3) : goals;

  return (
    <div className="space-y-4">
      {activeGoals.map((goal) => {
        const progress = calculateProgress(goal.currentValue, goal.targetValue);
        const daysRemaining = getDaysRemaining(goal.deadline);
        const urgency = getUrgencyLevel(daysRemaining, progress);
        const progressColor = getProgressColor(progress);
        const categoryIcon = getCategoryIcon(goal.category);
        const motivationalMsg = getMotivationalMessage(progress, daysRemaining);

        return (
          <Card key={goal.id} className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{categoryIcon}</span>
                  <div>
                    <CardTitle className="text-base font-semibold">{goal.title}</CardTitle>
                    {goal.description && (
                      <p className="text-xs text-gray-600 mt-1">{goal.description}</p>
                    )}
                  </div>
                </div>
                {goal.sharedWith && (
                  <Badge variant="outline" className="bg-purple-50 text-purple-700">
                    <Share2 className="h-3 w-3 mr-1" />
                    Shared
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {/* Progress Bar */}
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">
                    {formatGoalValue(goal.currentValue, goal.unit)} / {formatGoalValue(goal.targetValue, goal.unit)}
                  </span>
                  <span className="font-bold text-gray-900">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`${progressColor} h-3 rounded-full transition-all duration-500`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Deadline and Urgency */}
              <div className="flex items-center justify-between text-xs">
                <span className={`font-medium ${urgency.color}`}>
                  {urgency.message}
                </span>
                <span className="text-gray-600">
                  {daysRemaining > 0 ? `${daysRemaining} days left` : 'Overdue'}
                </span>
              </div>

              {/* Motivational Message */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-2 rounded text-xs text-center font-medium text-purple-700">
                {motivationalMsg}
              </div>

              {/* Success Message */}
              {updatedGoalId === goal.id && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded text-xs text-center">
                  ✅ Goal updated successfully!
                </div>
              )}

              {/* Quick Update */}
              {!compact && (
                <div className="flex gap-2 pt-2">
                  <input
                    id={`goal-input-${goal.id}`}
                    type="number"
                    placeholder="Update progress"
                    className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const input = document.getElementById(`goal-input-${goal.id}`) as HTMLInputElement;
                        const value = parseFloat(input.value);
                        if (!isNaN(value)) {
                          updateGoalProgress(goal.id, value);
                          input.value = '';
                        }
                      }
                    }}
                  />
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-xs"
                    disabled={updatingGoalId === goal.id}
                    onClick={() => {
                      const input = document.getElementById(`goal-input-${goal.id}`) as HTMLInputElement;
                      const value = parseFloat(input.value);
                      if (!isNaN(value)) {
                        updateGoalProgress(goal.id, value);
                        input.value = '';
                      }
                    }}
                  >
                    {updatingGoalId === goal.id ? "Updating..." : "Update"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}

      {goals.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <Target className="h-12 w-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 mb-4">No active goals yet</p>
            <Button onClick={() => setShowAddForm(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Goal
            </Button>
          </CardContent>
        </Card>
      )}

      {compact && goals.length > 3 && (
        <div className="text-center">
          <Button variant="outline" size="sm">
            View All {goals.length} Goals
          </Button>
        </div>
      )}
    </div>
  );
}
