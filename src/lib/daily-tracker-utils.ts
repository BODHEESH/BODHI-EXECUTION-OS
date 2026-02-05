/**
 * Utility functions for Daily Tracker data integrity
 */

import { getCurrentDate, getCurrentDayOfWeek } from './date-utils';

export async function ensureTodayTrackerExists(userId: string): Promise<any> {
  const today = getCurrentDate();
  const dayName = getCurrentDayOfWeek();

  try {
    // Check if today's tracker exists
    const response = await fetch(`/api/daily-tracker?userId=${userId}&date=${today}`);
    const data = await response.json();

    if (data && data.length > 0) {
      return data[0]; // Return existing tracker
    }

    // Create today's tracker if it doesn't exist
    const newTracker = {
      userId,
      date: today,
      day: dayName,
      deepWorkDone: false,
      gymDone: false,
      contentDone: false,
      ecommerceDone: false,
      printerDone: false,
      sleepBefore11: false,
      wake530: false,
      mood: 'NEUTRAL',
      notes: null,
    };

    const createResponse = await fetch('/api/daily-tracker', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTracker),
    });

    if (!createResponse.ok) {
      const errorData = await createResponse.json();
      console.error('Failed to create today tracker:', errorData);
      throw new Error(`Failed to create today tracker: ${errorData.error || 'Unknown error'}`);
    }

    return await createResponse.json();
  } catch (error) {
    console.error('Error ensuring today tracker exists:', error);
    return null;
  }
}

export function getTodayDate(): string {
  return getCurrentDate();
}

export function getTodayDayName(): string {
  return getCurrentDayOfWeek();
}
