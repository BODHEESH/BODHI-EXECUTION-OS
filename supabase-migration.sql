-- =====================================================
-- BODHI EXECUTION OS - Database Migration
-- 6 Critical Features Implementation
-- =====================================================

-- 1. Add Recurring Task Fields to tasks table
-- =====================================================
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS "isRecurring" BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS "recurringFrequency" TEXT,
ADD COLUMN IF NOT EXISTS "lastRecurredAt" TIMESTAMP,
ADD COLUMN IF NOT EXISTS "parentTaskId" TEXT;

-- Add index for better performance on recurring task queries
CREATE INDEX IF NOT EXISTS idx_tasks_recurring ON tasks("isRecurring", "lastRecurredAt") WHERE "isRecurring" = true;

-- 2. Create Business Audit History Table
-- =====================================================
CREATE TABLE IF NOT EXISTS business_audit (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "businessId" TEXT NOT NULL,
  "oldStatus" TEXT,
  "newStatus" TEXT NOT NULL,
  "changedBy" TEXT NOT NULL,
  notes TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  CONSTRAINT fk_business_audit_business 
    FOREIGN KEY ("businessId") 
    REFERENCES business(id) 
    ON DELETE CASCADE
);

-- Add index for better performance on audit queries
CREATE INDEX IF NOT EXISTS idx_business_audit_businessId ON business_audit("businessId");
CREATE INDEX IF NOT EXISTS idx_business_audit_createdAt ON business_audit("createdAt" DESC);

-- 3. Verify Daily Tracker Unique Constraint
-- =====================================================
-- This should already exist, but verify it
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'daily_trackers_date_userId_key'
  ) THEN
    ALTER TABLE daily_trackers 
    ADD CONSTRAINT daily_trackers_date_userId_key 
    UNIQUE (date, "userId");
  END IF;
END $$;

-- 4. Add Comments for Documentation
-- =====================================================
COMMENT ON COLUMN tasks."isRecurring" IS 'Whether this task should recur automatically';
COMMENT ON COLUMN tasks."recurringFrequency" IS 'Frequency: DAILY, WEEKLY, or MONTHLY';
COMMENT ON COLUMN tasks."lastRecurredAt" IS 'Last time a new instance was created';
COMMENT ON COLUMN tasks."parentTaskId" IS 'ID of the original recurring task';

COMMENT ON TABLE business_audit IS 'Audit trail for business order status changes';
COMMENT ON COLUMN business_audit."oldStatus" IS 'Previous order status';
COMMENT ON COLUMN business_audit."newStatus" IS 'New order status';
COMMENT ON COLUMN business_audit."changedBy" IS 'Who made the change (ME or WIFE)';

-- 5. Create Function to Auto-Create Audit Entry (Optional)
-- =====================================================
-- This function can be called from the application or via trigger
CREATE OR REPLACE FUNCTION create_business_audit_entry(
  p_business_id TEXT,
  p_old_status TEXT,
  p_new_status TEXT,
  p_changed_by TEXT,
  p_notes TEXT DEFAULT NULL
) RETURNS TEXT AS $$
DECLARE
  v_audit_id TEXT;
BEGIN
  INSERT INTO business_audit (
    id,
    "businessId",
    "oldStatus",
    "newStatus",
    "changedBy",
    notes,
    "createdAt"
  ) VALUES (
    gen_random_uuid()::text,
    p_business_id,
    p_old_status,
    p_new_status,
    p_changed_by,
    p_notes,
    NOW()
  ) RETURNING id INTO v_audit_id;
  
  RETURN v_audit_id;
END;
$$ LANGUAGE plpgsql;

-- 6. Verification Queries
-- =====================================================
-- Run these to verify the migration was successful

-- Check if recurring task columns exist
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'tasks' 
  AND column_name IN ('isRecurring', 'recurringFrequency', 'lastRecurredAt', 'parentTaskId');

-- Check if business_audit table exists
SELECT table_name, table_type
FROM information_schema.tables
WHERE table_name = 'business_audit';

-- Check if daily_trackers unique constraint exists
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'daily_trackers' 
  AND constraint_type = 'UNIQUE';

-- =====================================================
-- Migration Complete
-- =====================================================

-- ROLLBACK SCRIPT (if needed)
-- =====================================================
-- Uncomment and run if you need to rollback changes

-- DROP TABLE IF EXISTS business_audit CASCADE;
-- DROP FUNCTION IF EXISTS create_business_audit_entry CASCADE;
-- ALTER TABLE tasks DROP COLUMN IF EXISTS "isRecurring";
-- ALTER TABLE tasks DROP COLUMN IF EXISTS "recurringFrequency";
-- ALTER TABLE tasks DROP COLUMN IF EXISTS "lastRecurredAt";
-- ALTER TABLE tasks DROP COLUMN IF EXISTS "parentTaskId";
-- DROP INDEX IF EXISTS idx_tasks_recurring;
-- DROP INDEX IF EXISTS idx_business_audit_businessId;
-- DROP INDEX IF EXISTS idx_business_audit_createdAt;
