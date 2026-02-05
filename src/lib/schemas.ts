import { z } from "zod";

export const DailyTrackerSchema = z.object({
  id: z.string().optional(),
  date: z.string(),
  day: z.string(),
  deepWorkDone: z.boolean().default(false),
  gymDone: z.boolean().default(false),
  contentDone: z.boolean().default(false),
  ecommerceDone: z.boolean().default(false),
  printerDone: z.boolean().default(false),
  sleepBefore11: z.boolean().default(false),
  wake530: z.boolean().default(false),
  mood: z.enum(["GREAT", "GOOD", "OK", "LOW"]).default("GOOD"),
  notes: z.string().optional(),
  userId: z.string(),
});

export type DailyTracker = z.infer<typeof DailyTrackerSchema>;

export const TaskSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  description: z.string().optional(),
  category: z.enum(["YOUTUBE", "BODHI_LEARN", "ECOMMERCE", "PRINTER", "WORK", "PERSONAL"]),
  priority: z.enum(["HIGH", "MEDIUM", "LOW"]).default("MEDIUM"),
  status: z.enum(["BACKLOG", "TODAY", "IN_PROGRESS", "WAITING", "DONE"]).default("BACKLOG"),
  dueDate: z.string().optional(),
  estimatedTime: z.enum(["MIN15", "MIN30", "HOUR1", "HOUR2", "HOUR4"]).default("HOUR1"),
  owner: z.enum(["ME", "WIFE"]).default("ME"),
  isRecurring: z.boolean().default(false),
  recurringFrequency: z.enum(["DAILY", "WEEKLY", "MONTHLY"]).optional(),
  lastRecurredAt: z.string().optional(),
  parentTaskId: z.string().optional(),
  userId: z.string(),
});

export type Task = z.infer<typeof TaskSchema>;

export const ContentSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  platforms: z.array(z.enum(["BODHI_TECH_TALKS", "BODHI_LEARN", "INSTAGRAM", "SHORTS"])),
  type: z.enum(["LONG_VIDEO", "SHORT", "REEL"]).default("LONG_VIDEO"),
  status: z.enum(["IDEA", "SCRIPTED", "RECORDED", "EDITING", "THUMBNAIL_READY", "SCHEDULED", "POSTED"]).default("IDEA"),
  shootDate: z.string().optional(),
  publishDate: z.string().optional(),
  videoLink: z.string().optional(),
  scriptLink: z.string().optional(),
  owner: z.enum(["ME", "WIFE"]).default("ME"),
  remarks: z.string().optional(),
  userId: z.string(),
});

export type Content = z.infer<typeof ContentSchema>;

export const BusinessSchema = z.object({
  id: z.string().optional(),
  customerName: z.string().min(1),
  businessType: z.enum(["CLOTHING", "PRINTING_3D"]),
  orderStatus: z.enum(["NEW", "DESIGNING", "PRINTING", "PACKING", "DELIVERED", "CANCELLED"]).default("NEW"),
  orderDate: z.string().optional(),
  deliveryDate: z.string().optional(),
  amount: z.number().min(0),
  cost: z.number().min(0),
  profit: z.number().default(0),
  paymentStatus: z.enum(["PENDING", "PAID", "PARTIAL"]).default("PENDING"),
  handledBy: z.enum(["ME", "WIFE"]).default("ME"),
  notes: z.string().optional(),
  userId: z.string(),
});

export type Business = z.infer<typeof BusinessSchema>;

export const profit = (business: Business) => business.amount - business.cost;
