import { DailyTracker, Task, Content, Business } from "./schemas";

// Mock data store - in production this would be replaced with database calls
let dailyTrackers: DailyTracker[] = [
  {
    id: "1",
    date: new Date().toISOString().split('T')[0],
    day: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
    deepWorkDone: false,
    gymDone: true,
    contentDone: false,
    ecommerceDone: false,
    printerDone: false,
    sleepBefore11: false,
    wake530: true,
    mood: "GOOD",
    userId: "1",
  },
  {
    id: "2",
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    day: new Date(Date.now() - 86400000).toLocaleDateString('en-US', { weekday: 'long' }),
    deepWorkDone: true,
    gymDone: true,
    contentDone: true,
    ecommerceDone: false,
    printerDone: false,
    sleepBefore11: true,
    wake530: true,
    mood: "GREAT",
    userId: "1",
  },
];

let tasks: Task[] = [
  {
    id: "1",
    title: "Complete Next.js tutorial video",
    description: "Finish recording and editing the tutorial",
    category: "YOUTUBE",
    priority: "HIGH",
    status: "TODAY",
    dueDate: new Date().toISOString().split('T')[0],
    estimatedTime: "HOUR2",
    owner: "ME",
    isRecurring: false,
    userId: "1",
  },
  {
    id: "2",
    title: "Design new t-shirt graphics",
    description: "Create designs for the summer collection",
    category: "ECOMMERCE",
    priority: "MEDIUM",
    status: "IN_PROGRESS",
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    estimatedTime: "HOUR4",
    owner: "WIFE",
    isRecurring: false,
    userId: "1",
  },
  {
    id: "3",
    title: "3D print customer order",
    description: "Print and prepare the custom figurine",
    category: "PRINTER",
    priority: "HIGH",
    status: "TODAY",
    dueDate: new Date().toISOString().split('T')[0],
    estimatedTime: "HOUR2",
    owner: "ME",
    isRecurring: false,
    userId: "1",
  },
];

let content: Content[] = [
  {
    id: "1",
    title: "Next.js 14 App Router Tutorial",
    platforms: ["BODHI_TECH_TALKS", "SHORTS"],
    type: "LONG_VIDEO",
    status: "EDITING",
    publishDate: "2024-02-10",
    owner: "ME",
    userId: "1",
  },
  {
    id: "2",
    title: "Prisma Performance Tips",
    platforms: ["BODHI_LEARN"],
    type: "SHORT",
    status: "SCRIPTED",
    publishDate: "2024-02-12",
    owner: "WIFE",
    userId: "1",
  },
];

let business: Business[] = [
  {
    id: "1",
    customerName: "John Doe",
    businessType: "CLOTHING",
    orderStatus: "DELIVERED",
    orderDate: "2024-02-01",
    deliveryDate: "2024-02-05",
    amount: 2500,
    cost: 1200,
    profit: 1300,
    paymentStatus: "PAID",
    handledBy: "ME",
    userId: "1",
  },
  {
    id: "2",
    customerName: "Jane Smith",
    businessType: "PRINTING_3D",
    orderStatus: "PRINTING",
    orderDate: "2024-02-08",
    amount: 800,
    cost: 200,
    profit: 600,
    paymentStatus: "PENDING",
    handledBy: "WIFE",
    userId: "1",
  },
];

// Daily Tracker functions
export async function getDailyTrackerByDate(date: string, userId: string): Promise<DailyTracker | null> {
  return dailyTrackers.find(tracker => tracker.date === date && tracker.userId === userId) || null;
}

export async function createOrUpdateDailyTracker(data: Omit<DailyTracker, 'id'>): Promise<DailyTracker> {
  const existing = dailyTrackers.find(tracker => tracker.date === data.date && tracker.userId === data.userId);
  
  if (existing) {
    // Update existing
    const index = dailyTrackers.findIndex(tracker => tracker.id === existing.id);
    dailyTrackers[index] = { ...existing, ...data };
    return dailyTrackers[index];
  } else {
    // Create new
    const newTracker = { ...data, id: Date.now().toString() };
    dailyTrackers.push(newTracker);
    return newTracker;
  }
}

export async function getWeeklyDailyTrackers(userId: string): Promise<DailyTracker[]> {
  const today = new Date();
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  return dailyTrackers
    .filter(tracker => tracker.userId === userId)
    .filter(tracker => {
      const trackerDate = new Date(tracker.date);
      return trackerDate >= weekAgo && trackerDate <= today;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Task functions
export async function getTasks(userId: string): Promise<Task[]> {
  return tasks.filter(task => task.userId === userId);
}

export async function createTask(data: Omit<Task, 'id'>): Promise<Task> {
  const newTask = { ...data, id: Date.now().toString() };
  tasks.push(newTask);
  return newTask;
}

export async function updateTask(id: string, data: Partial<Task>): Promise<Task | null> {
  const index = tasks.findIndex(task => task.id === id);
  if (index === -1) return null;
  
  tasks[index] = { ...tasks[index], ...data };
  return tasks[index];
}

export async function deleteTask(id: string): Promise<boolean> {
  const index = tasks.findIndex(task => task.id === id);
  if (index === -1) return false;
  
  tasks.splice(index, 1);
  return true;
}

// Content functions
export async function getContent(userId: string): Promise<Content[]> {
  return content.filter(item => item.userId === userId);
}

export async function createContent(data: Omit<Content, 'id'>): Promise<Content> {
  const newContent = { ...data, id: Date.now().toString() };
  content.push(newContent);
  return newContent;
}

export async function updateContent(id: string, data: Partial<Content>): Promise<Content | null> {
  const index = content.findIndex(item => item.id === id);
  if (index === -1) return null;
  
  content[index] = { ...content[index], ...data };
  return content[index];
}

export async function deleteContent(id: string): Promise<boolean> {
  const index = content.findIndex(item => item.id === id);
  if (index === -1) return false;
  
  content.splice(index, 1);
  return true;
}

// Business functions
export async function getBusiness(userId: string): Promise<Business[]> {
  return business.filter(item => item.userId === userId);
}

export async function createBusiness(data: Omit<Business, 'id'>): Promise<Business> {
  const newBusiness = { ...data, id: Date.now().toString() };
  business.push(newBusiness);
  return newBusiness;
}

export async function updateBusiness(id: string, data: Partial<Business>): Promise<Business | null> {
  const index = business.findIndex(item => item.id === id);
  if (index === -1) return null;
  
  business[index] = { ...business[index], ...data };
  return business[index];
}

export async function deleteBusiness(id: string): Promise<boolean> {
  const index = business.findIndex(item => item.id === id);
  if (index === -1) return false;
  
  business.splice(index, 1);
  return true;
}

export async function getMonthlyProfit(userId: string): Promise<number> {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  return business
    .filter(item => item.userId === userId)
    .filter(item => {
      if (!item.orderDate) return false;
      const orderDate = new Date(item.orderDate);
      return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
    })
    .reduce((total, item) => total + (item.amount - item.cost), 0);
}
