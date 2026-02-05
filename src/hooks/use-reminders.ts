"use client";

import { useEffect, useState } from "react";

interface Reminder {
  id: string;
  type: 'warning' | 'info' | 'success';
  message: string;
  action?: {
    label: string;
    href: string;
  };
}

export function useReminders(userId: string | undefined) {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    if (!userId) return;

    const checkReminders = async () => {
      const newReminders: Reminder[] = [];
      const today = new Date().toISOString().split('T')[0];

      try {
        // Check if today's tracker is updated
        const trackerRes = await fetch(`/api/daily-tracker?userId=${userId}&date=${today}`);
        const trackerData = await trackerRes.json();
        
        if (!trackerData || trackerData.length === 0) {
          newReminders.push({
            id: 'tracker-missing',
            type: 'warning',
            message: "You haven't updated today's habits yet",
            action: {
              label: 'Update Now',
              href: '/daily-tracker',
            },
          });
        } else {
          const tracker = trackerData[0];
          const allHabitsUnchecked = !tracker.deepWorkDone && !tracker.gymDone && 
                                     !tracker.contentDone && !tracker.ecommerceDone && 
                                     !tracker.printerDone && !tracker.sleepBefore11;
          
          if (allHabitsUnchecked) {
            newReminders.push({
              id: 'habits-pending',
              type: 'info',
              message: "No habits completed today. Start your execution!",
              action: {
                label: 'Track Habits',
                href: '/daily-tracker',
              },
            });
          }
        }

        // Check for pending TODAY tasks
        const tasksRes = await fetch(`/api/tasks?userId=${userId}`);
        const tasks = await tasksRes.json();
        const todayTasks = tasks.filter((t: any) => t.status === 'TODAY');
        
        if (todayTasks.length > 0) {
          newReminders.push({
            id: 'tasks-pending',
            type: 'info',
            message: `${todayTasks.length} tasks pending in Today`,
            action: {
              label: 'View Tasks',
              href: '/tasks',
            },
          });
        }

        // Check for pending payments
        const businessRes = await fetch(`/api/business?userId=${userId}`);
        const business = await businessRes.json();
        const pendingPayments = business.filter((b: any) => b.paymentStatus === 'PENDING');
        
        if (pendingPayments.length > 0) {
          const totalPending = pendingPayments.reduce((sum: number, b: any) => sum + b.amount, 0);
          newReminders.push({
            id: 'payments-pending',
            type: 'warning',
            message: `₹${totalPending.toLocaleString()} in pending payments (${pendingPayments.length} orders)`,
            action: {
              label: 'View Orders',
              href: '/business',
            },
          });
        }

        setReminders(newReminders);
      } catch (error) {
        console.error('Error checking reminders:', error);
      }
    };

    checkReminders();
    
    // Refresh reminders every 5 minutes
    const interval = setInterval(checkReminders, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [userId]);

  return reminders;
}
