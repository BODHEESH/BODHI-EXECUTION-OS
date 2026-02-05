-- =====================================================
-- BODHI EXECUTION OS - Goals, Streaks & Accountability Migration
-- Goal Setting, Habit Streaks, and Wife Partnership Features
-- =====================================================

-- Create Goal Category Enum
CREATE TYPE "GoalCategory" AS ENUM ('CONTENT', 'BUSINESS', 'HEALTH', 'PERSONAL', 'LEARNING');

-- Create Goal Status Enum
CREATE TYPE "GoalStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'PAUSED', 'CANCELLED');

-- Create Share Type Enum
CREATE TYPE "ShareType" AS ENUM ('GOAL', 'TASK', 'DAILY_TRACKER', 'WEEKLY_PLAN', 'ACHIEVEMENT');

-- Create Goals Table
CREATE TABLE IF NOT EXISTS goals (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  description TEXT,
  category "GoalCategory" NOT NULL,
  "targetValue" DOUBLE PRECISION NOT NULL,
  "currentValue" DOUBLE PRECISION DEFAULT 0,
  unit TEXT NOT NULL,
  deadline TIMESTAMP NOT NULL,
  status "GoalStatus" DEFAULT 'IN_PROGRESS',
  priority "TaskPriority" DEFAULT 'MEDIUM',
  "userId" TEXT NOT NULL,
  "sharedWith" "Owner",
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT fk_goal_user 
    FOREIGN KEY ("userId") 
    REFERENCES "User"(id) 
    ON DELETE CASCADE
);

-- Create Habit Streaks Table
CREATE TABLE IF NOT EXISTS habit_streaks (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "habitName" TEXT NOT NULL,
  "currentStreak" INTEGER DEFAULT 0,
  "longestStreak" INTEGER DEFAULT 0,
  "lastCompletedAt" TIMESTAMP,
  "totalCompletions" INTEGER DEFAULT 0,
  "userId" TEXT NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT fk_habit_streak_user 
    FOREIGN KEY ("userId") 
    REFERENCES "User"(id) 
    ON DELETE CASCADE,
  
  CONSTRAINT unique_habit_user 
    UNIQUE ("habitName", "userId")
);

-- Create Accountability Shares Table
CREATE TABLE IF NOT EXISTS accountability_shares (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "fromUserId" TEXT NOT NULL,
  "toUserId" TEXT NOT NULL,
  "shareType" "ShareType" NOT NULL,
  "itemId" TEXT NOT NULL,
  message TEXT,
  reaction TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_goals_userId ON goals("userId");
CREATE INDEX IF NOT EXISTS idx_goals_status ON goals(status);
CREATE INDEX IF NOT EXISTS idx_goals_category ON goals(category);
CREATE INDEX IF NOT EXISTS idx_goals_deadline ON goals(deadline);

CREATE INDEX IF NOT EXISTS idx_habit_streaks_userId ON habit_streaks("userId");
CREATE INDEX IF NOT EXISTS idx_habit_streaks_habitName ON habit_streaks("habitName");
CREATE INDEX IF NOT EXISTS idx_habit_streaks_currentStreak ON habit_streaks("currentStreak" DESC);

CREATE INDEX IF NOT EXISTS idx_accountability_fromUserId ON accountability_shares("fromUserId");
CREATE INDEX IF NOT EXISTS idx_accountability_toUserId ON accountability_shares("toUserId");
CREATE INDEX IF NOT EXISTS idx_accountability_shareType ON accountability_shares("shareType");

-- Add comments for documentation
COMMENT ON TABLE goals IS 'User goals with progress tracking for 60-day plan';
COMMENT ON COLUMN goals.category IS 'Goal category: CONTENT, BUSINESS, HEALTH, PERSONAL, LEARNING';
COMMENT ON COLUMN goals."targetValue" IS 'Target value to achieve (e.g., 10000 subscribers, 50000 revenue)';
COMMENT ON COLUMN goals."currentValue" IS 'Current progress value';
COMMENT ON COLUMN goals.unit IS 'Unit of measurement (subscribers, revenue, kg, videos, etc.)';
COMMENT ON COLUMN goals."sharedWith" IS 'Share with WIFE for accountability';

COMMENT ON TABLE habit_streaks IS 'Habit streak tracking for consistency gamification';
COMMENT ON COLUMN habit_streaks."currentStreak" IS 'Current consecutive days streak';
COMMENT ON COLUMN habit_streaks."longestStreak" IS 'Longest streak ever achieved';
COMMENT ON COLUMN habit_streaks."totalCompletions" IS 'Total number of times habit completed';

COMMENT ON TABLE accountability_shares IS 'Accountability sharing system for wife partnership';
COMMENT ON COLUMN accountability_shares."fromUserId" IS 'User who is sharing (ME)';
COMMENT ON COLUMN accountability_shares."toUserId" IS 'User receiving the share (WIFE)';
COMMENT ON COLUMN accountability_shares."shareType" IS 'Type of item being shared';
COMMENT ON COLUMN accountability_shares.reaction IS 'Wife reaction/encouragement emoji';

-- Verification Queries
SELECT 
  table_name, 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name IN ('goals', 'habit_streaks', 'accountability_shares')
ORDER BY table_name, ordinal_position;

-- =====================================================
-- Migration Complete
-- =====================================================

-- ROLLBACK SCRIPT (if needed)
-- =====================================================
-- Uncomment and run if you need to rollback changes

-- DROP TABLE IF EXISTS accountability_shares CASCADE;
-- DROP TABLE IF EXISTS habit_streaks CASCADE;
-- DROP TABLE IF EXISTS goals CASCADE;
-- DROP TYPE IF EXISTS "ShareType";
-- DROP TYPE IF EXISTS "GoalStatus";
-- DROP TYPE IF EXISTS "GoalCategory";
-- DROP INDEX IF EXISTS idx_goals_userId;
-- DROP INDEX IF EXISTS idx_goals_status;
-- DROP INDEX IF EXISTS idx_goals_category;
-- DROP INDEX IF EXISTS idx_goals_deadline;
-- DROP INDEX IF EXISTS idx_habit_streaks_userId;
-- DROP INDEX IF EXISTS idx_habit_streaks_habitName;
-- DROP INDEX IF EXISTS idx_habit_streaks_currentStreak;
-- DROP INDEX IF EXISTS idx_accountability_fromUserId;
-- DROP INDEX IF EXISTS idx_accountability_toUserId;
-- DROP INDEX IF EXISTS idx_accountability_shareType;
