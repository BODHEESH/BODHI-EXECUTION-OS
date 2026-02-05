/**
 * Recurring Tasks Automation Utilities
 */

export async function createRecurringTaskInstance(
  completedTask: any,
  userId: string
): Promise<any> {
  if (!completedTask.isRecurring || !completedTask.recurringFrequency) {
    return null;
  }

  const nextDueDate = calculateNextDueDate(
    completedTask.dueDate || new Date(),
    completedTask.recurringFrequency
  );

  const newTask = {
    title: completedTask.title,
    description: completedTask.description,
    category: completedTask.category,
    priority: completedTask.priority,
    status: 'BACKLOG',
    dueDate: nextDueDate.toISOString(),
    estimatedTime: completedTask.estimatedTime,
    owner: completedTask.owner,
    isRecurring: true,
    recurringFrequency: completedTask.recurringFrequency,
    parentTaskId: completedTask.id,
    userId,
  };

  try {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask),
    });

    if (!response.ok) {
      throw new Error('Failed to create recurring task instance');
    }

    // Update the original task's lastRecurredAt
    await fetch(`/api/tasks/${completedTask.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lastRecurredAt: new Date().toISOString(),
      }),
    });

    return await response.json();
  } catch (error) {
    console.error('Error creating recurring task instance:', error);
    return null;
  }
}

function calculateNextDueDate(currentDate: Date, frequency: string): Date {
  const date = new Date(currentDate);

  switch (frequency) {
    case 'DAILY':
      date.setDate(date.getDate() + 1);
      break;
    case 'WEEKLY':
      date.setDate(date.getDate() + 7);
      break;
    case 'MONTHLY':
      date.setMonth(date.getMonth() + 1);
      break;
    default:
      date.setDate(date.getDate() + 1);
  }

  return date;
}

export async function checkAndCreateDueRecurringTasks(userId: string): Promise<void> {
  try {
    const response = await fetch(`/api/tasks?userId=${userId}`);
    const tasks = await response.json();

    const recurringTasks = tasks.filter(
      (task: any) => task.isRecurring && task.status === 'DONE'
    );

    for (const task of recurringTasks) {
      const lastRecurred = task.lastRecurredAt
        ? new Date(task.lastRecurredAt)
        : new Date(task.createdAt);
      const nextDue = calculateNextDueDate(lastRecurred, task.recurringFrequency);

      if (nextDue <= new Date()) {
        await createRecurringTaskInstance(task, userId);
      }
    }
  } catch (error) {
    console.error('Error checking recurring tasks:', error);
  }
}
