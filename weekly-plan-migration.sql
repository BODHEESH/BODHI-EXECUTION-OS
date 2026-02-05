-- =====================================================
-- BODHI EXECUTION OS - Weekly Plan Migration
-- 60-Day Execution Plan Checklist System
-- =====================================================

-- Create Weekly Plan Checklist Table
CREATE TABLE IF NOT EXISTS weekly_plans (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  date TEXT NOT NULL,
  "dayOfWeek" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  
  -- Daily Non-Negotiables (Must Do Every Day)
  "deepWorkDone" BOOLEAN DEFAULT false,
  "contentWorkDone" BOOLEAN DEFAULT false,
  "gymWalkDone" BOOLEAN DEFAULT false,
  "sleepBefore11" BOOLEAN DEFAULT false,
  "wake530" BOOLEAN DEFAULT false,
  
  -- Day-Specific Tasks (based on weekly plan)
  "morningTaskDone" BOOLEAN DEFAULT false,
  "eveningTaskDone" BOOLEAN DEFAULT false,
  "fitnessTaskDone" BOOLEAN DEFAULT false,
  
  -- Notes and Planning
  "morningTaskDesc" TEXT,
  "eveningTaskDesc" TEXT,
  notes TEXT,
  
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT fk_weekly_plan_user 
    FOREIGN KEY ("userId") 
    REFERENCES "User"(id) 
    ON DELETE CASCADE,
  
  CONSTRAINT unique_date_user 
    UNIQUE (date, "userId")
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_weekly_plans_userId ON weekly_plans("userId");
CREATE INDEX IF NOT EXISTS idx_weekly_plans_date ON weekly_plans(date DESC);
CREATE INDEX IF NOT EXISTS idx_weekly_plans_dayOfWeek ON weekly_plans("dayOfWeek");

-- Add comments for documentation
COMMENT ON TABLE weekly_plans IS '60-Day Execution Plan daily checklist tracking';
COMMENT ON COLUMN weekly_plans."deepWorkDone" IS 'Deep Work (60+ minutes) completed';
COMMENT ON COLUMN weekly_plans."contentWorkDone" IS 'Content Work (30+ minutes) completed';
COMMENT ON COLUMN weekly_plans."gymWalkDone" IS 'Gym/Walk (30+ minutes) completed';
COMMENT ON COLUMN weekly_plans."sleepBefore11" IS 'Slept before 11 PM';
COMMENT ON COLUMN weekly_plans."wake530" IS 'Woke up at 5:30 AM';
COMMENT ON COLUMN weekly_plans."morningTaskDone" IS '5:45-7:15 AM deep work task completed';
COMMENT ON COLUMN weekly_plans."eveningTaskDone" IS '8:15-10:15 PM light work task completed';
COMMENT ON COLUMN weekly_plans."fitnessTaskDone" IS '6:15-7:15 PM fitness/recovery task completed';

-- Verification Query
SELECT 
  table_name, 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'weekly_plans'
ORDER BY ordinal_position;

-- =====================================================
-- Migration Complete
-- =====================================================

-- ROLLBACK SCRIPT (if needed)
-- =====================================================
-- Uncomment and run if you need to rollback changes

-- DROP TABLE IF EXISTS weekly_plans CASCADE;
-- DROP INDEX IF EXISTS idx_weekly_plans_userId;
-- DROP INDEX IF EXISTS idx_weekly_plans_date;
-- DROP INDEX IF EXISTS idx_weekly_plans_dayOfWeek;
