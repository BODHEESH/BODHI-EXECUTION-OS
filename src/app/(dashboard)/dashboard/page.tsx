"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckCircle, Clock, DollarSign, Video, Package, Target, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";

// Custom Rupee icon component
const RupeeSign = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v20M8 9h8M8 15h6"/>
  </svg>
);

export default function DashboardPage() {
  const [todayTasks, setTodayTasks] = useState([]);
  const [weeklyScore, setWeeklyScore] = useState({ score: 0, total: 0, percentage: 0 });
  const [contentPipeline, setContentPipeline] = useState([]);
  const [monthlyProfit, setMonthlyProfit] = useState(0);
  const [pendingPayments, setPendingPayments] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = useCurrentUser();

  useEffect(() => {
    if (currentUser) {
      fetchDashboardData();
    }
  }, [currentUser]);

  const fetchDashboardData = async () => {
    if (!currentUser) return;
    
    try {
      setIsLoading(true);
      
      // Fetch today's tasks
      const tasksResponse = await fetch(`/api/tasks?userId=${currentUser}`);
      const tasksData = await tasksResponse.json();
      const todayTasksList = tasksData.filter(task => task.status === 'TODAY');
      setTodayTasks(todayTasksList);

      // Fetch weekly habit score
      const weeklyResponse = await fetch(`/api/daily-tracker?userId=${currentUser}`);
      const weeklyData = await weeklyResponse.json();
      if (weeklyData.length > 0) {
        const latestWeek = weeklyData.slice(-7);
        const totalPossibleScore = latestWeek.length * 6; // Assuming 6 habits per day
        const actualScore = latestWeek.reduce((sum, day) => {
          const habitScore = (day.habits || []).length;
          return sum + habitScore;
        }, 0);
        setWeeklyScore({
          score: actualScore,
          total: totalPossibleScore,
          percentage: totalPossibleScore > 0 ? Math.round((actualScore / totalPossibleScore) * 100) : 0
        });
      }

      // Fetch content pipeline
      const contentResponse = await fetch(`/api/content?userId=${currentUser}`);
      const contentData = await contentResponse.json();
      const thisWeek = new Date();
      const weekStart = new Date(thisWeek.setDate(thisWeek.getDate() - thisWeek.getDay()));
      const weekEnd = new Date(thisWeek.setDate(thisWeek.getDate() - thisWeek.getDay() + 6));
      
      const thisWeekContent = contentData.filter(content => {
        if (content.publishDate) {
          const publishDate = new Date(content.publishDate);
          return publishDate >= weekStart && publishDate <= weekEnd;
        }
        return false;
      });
      setContentPipeline(thisWeekContent);

      // Fetch business data
      const businessResponse = await fetch(`/api/business?userId=${currentUser}`);
      const businessData = await businessResponse.json();
      
      // Calculate monthly profit
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyOrders = businessData.filter(order => {
        const orderDate = new Date(order.orderDate);
        return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
      });
      const profit = monthlyOrders.reduce((sum, order) => sum + (order.profit || 0), 0);
      setMonthlyProfit(profit);

      // Calculate pending payments
      const pendingOrders = businessData.filter(order => order.paymentStatus === 'PENDING');
      const pendingAmount = pendingOrders.reduce((sum, order) => sum + order.amount, 0);
      setPendingPayments(pendingAmount);

    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome to BODHI EXECUTION OS</p>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to BODHI EXECUTION OS</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today Focus</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayTasks.length}</div>
            <p className="text-xs text-muted-foreground">Tasks to execute</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Score</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weeklyScore.score}/{weeklyScore.total}</div>
            <p className="text-xs text-muted-foreground">{weeklyScore.percentage}% completion</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content Pipeline</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contentPipeline.length}</div>
            <p className="text-xs text-muted-foreground">Videos this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Profit</CardTitle>
            <RupeeSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{monthlyProfit.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Today's Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {todayTasks.length > 0 ? (
              <div className="space-y-2">
                {todayTasks.slice(0, 5).map((task: any) => (
                  <div key={task.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium">{task.title}</span>
                    <span className="text-xs text-gray-500">{task.category}</span>
                  </div>
                ))}
                {todayTasks.length > 5 && (
                  <p className="text-xs text-gray-500 text-center">+{todayTasks.length - 5} more tasks</p>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No tasks for today</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Orders & Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pending Payments</span>
                <span className="text-lg font-semibold text-orange-600">₹{pendingPayments.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Monthly Profit</span>
                <span className="text-lg font-semibold text-green-600">₹{monthlyProfit.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Weekly Score</span>
                <span className="text-lg font-semibold text-blue-600">{weeklyScore.percentage}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Weekly Execution Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Fixed Routine</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>• 5:30 AM - Wake up & Meditation</p>
                <p>• 6:00 AM - Exercise/Gym</p>
                <p>• 7:00 AM - Deep Work Session</p>
                <p>• 9:00 AM - Breakfast & Planning</p>
                <p>• 10:00 AM - Business Work</p>
                <p>• 2:00 PM - Lunch & Rest</p>
                <p>• 3:00 PM - Content Creation</p>
                <p>• 6:00 PM - Family Time</p>
                <p>• 9:00 PM - Reading & Wind Down</p>
                <p>• 10:30 PM - Sleep</p>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Weekly Focus</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>• Monday: Business & Admin</p>
                <p>• Tuesday: Content Recording</p>
                <p>• Wednesday: Client Meetings</p>
                <p>• Thursday: Creative Work</p>
                <p>• Friday: Business Development</p>
                <p>• Saturday: Learning & Planning</p>
                <p>• Sunday: Rest & Family</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
