"use client";

import { AlertCircle, CheckCircle, Clock, X } from "lucide-react";
import { useState } from "react";

interface Reminder {
  id: string;
  type: 'warning' | 'info' | 'success';
  message: string;
  action?: {
    label: string;
    href: string;
  };
}

interface ReminderBannerProps {
  reminders: Reminder[];
}

export function ReminderBanner({ reminders }: ReminderBannerProps) {
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  const activeReminders = reminders.filter(r => !dismissedIds.includes(r.id));

  if (activeReminders.length === 0) return null;

  const dismiss = (id: string) => {
    setDismissedIds([...dismissedIds, id]);
  };

  return (
    <div className="space-y-2 mb-6">
      {activeReminders.map((reminder) => (
        <div
          key={reminder.id}
          className={`flex items-center justify-between p-4 rounded-lg border ${
            reminder.type === 'warning'
              ? 'bg-orange-50 border-orange-200 text-orange-800'
              : reminder.type === 'info'
              ? 'bg-blue-50 border-blue-200 text-blue-800'
              : 'bg-green-50 border-green-200 text-green-800'
          }`}
        >
          <div className="flex items-center gap-3 flex-1">
            {reminder.type === 'warning' && <AlertCircle className="h-5 w-5" />}
            {reminder.type === 'info' && <Clock className="h-5 w-5" />}
            {reminder.type === 'success' && <CheckCircle className="h-5 w-5" />}
            <span className="text-sm font-medium">{reminder.message}</span>
          </div>
          <div className="flex items-center gap-2">
            {reminder.action && (
              <a
                href={reminder.action.href}
                className="text-sm font-semibold underline hover:no-underline"
              >
                {reminder.action.label}
              </a>
            )}
            <button
              onClick={() => dismiss(reminder.id)}
              className="p-1 hover:bg-white/50 rounded transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
