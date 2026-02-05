-- Create a helper function for generating IDs
CREATE OR REPLACE FUNCTION generate_id() RETURNS TEXT AS $$
BEGIN
    -- Generate a random ID similar to cuid format
    RETURN 'cuid_' || encode(gen_random_bytes(16), 'hex');
END;
$$ LANGUAGE plpgsql;

-- Create enums first
CREATE TYPE "UserRole" AS ENUM ('ME', 'WIFE');
CREATE TYPE "Mood" AS ENUM ('GREAT', 'GOOD', 'OK', 'LOW');
CREATE TYPE "TaskCategory" AS ENUM ('YOUTUBE', 'BODHI_LEARN', 'ECOMMERCE', 'PRINTER', 'WORK', 'PERSONAL');
CREATE TYPE "TaskPriority" AS ENUM ('HIGH', 'MEDIUM', 'LOW');
CREATE TYPE "TaskStatus" AS ENUM ('BACKLOG', 'TODAY', 'IN_PROGRESS', 'WAITING', 'DONE');
CREATE TYPE "EstimatedTime" AS ENUM ('MIN15', 'MIN30', 'HOUR1', 'HOUR2', 'HOUR4');
CREATE TYPE "Owner" AS ENUM ('ME', 'WIFE');
CREATE TYPE "ContentType" AS ENUM ('LONG_VIDEO', 'SHORT', 'REEL');
CREATE TYPE "ContentStatus" AS ENUM ('IDEA', 'SCRIPTED', 'RECORDED', 'EDITING', 'THUMBNAIL_READY', 'SCHEDULED', 'POSTED');
CREATE TYPE "BusinessType" AS ENUM ('CLOTHING', 'PRINTING_3D');
CREATE TYPE "OrderStatus" AS ENUM ('NEW', 'DESIGNING', 'PRINTING', 'PACKING', 'DELIVERED', 'CANCELLED');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID');

-- NextAuth required tables
CREATE TABLE "Account" (
    "id" TEXT NOT NULL DEFAULT generate_id(),
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Session" (
    "id" TEXT NOT NULL DEFAULT generate_id(),
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "User" (
    "id" TEXT NOT NULL DEFAULT generate_id(),
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'ME',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("identifier","token")
);

-- Daily Tracker table
CREATE TABLE "daily_trackers" (
    "id" TEXT NOT NULL DEFAULT generate_id(),
    "date" TIMESTAMP(3) NOT NULL,
    "day" TEXT NOT NULL,
    "deepWorkDone" BOOLEAN NOT NULL DEFAULT false,
    "gymDone" BOOLEAN NOT NULL DEFAULT false,
    "contentDone" BOOLEAN NOT NULL DEFAULT false,
    "ecommerceDone" BOOLEAN NOT NULL DEFAULT false,
    "printerDone" BOOLEAN NOT NULL DEFAULT false,
    "sleepBefore11" BOOLEAN NOT NULL DEFAULT false,
    "wake530" BOOLEAN NOT NULL DEFAULT false,
    "mood" "Mood" NOT NULL DEFAULT 'GOOD',
    "notes" TEXT,
    "score" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "daily_trackers_pkey" PRIMARY KEY ("id")
);

-- Tasks table
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL DEFAULT generate_id(),
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" "TaskCategory" NOT NULL,
    "priority" "TaskPriority" NOT NULL DEFAULT 'MEDIUM',
    "status" "TaskStatus" NOT NULL DEFAULT 'BACKLOG',
    "dueDate" TIMESTAMP(3),
    "estimatedTime" "EstimatedTime" NOT NULL DEFAULT 'HOUR1',
    "owner" "Owner" NOT NULL DEFAULT 'ME',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "tasks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON UPDATE CASCADE ON DELETE CASCADE
);

-- Indexes for tasks table
CREATE INDEX IF NOT EXISTS "tasks_userId_idx" ON "tasks" USING btree ("userId");
CREATE INDEX IF NOT EXISTS "tasks_status_idx" ON "tasks" USING btree ("status");

-- Content table
CREATE TABLE "content" (
    "id" TEXT NOT NULL DEFAULT generate_id(),
    "title" TEXT NOT NULL,
    "platforms" TEXT[],
    "type" "ContentType" NOT NULL DEFAULT 'LONG_VIDEO',
    "status" "ContentStatus" NOT NULL DEFAULT 'IDEA',
    "shootDate" TIMESTAMP(3),
    "publishDate" TIMESTAMP(3),
    "videoLink" TEXT,
    "scriptLink" TEXT,
    "remarks" TEXT,
    "owner" "Owner" NOT NULL DEFAULT 'ME',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "content_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "content_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON UPDATE CASCADE ON DELETE CASCADE
);

-- Indexes for content table
CREATE INDEX IF NOT EXISTS "content_userId_idx" ON "content" USING btree ("userId");
CREATE INDEX IF NOT EXISTS "content_status_idx" ON "content" USING btree ("status");

-- Business table
CREATE TABLE "business" (
    "id" TEXT NOT NULL DEFAULT generate_id(),
    "customerName" TEXT NOT NULL,
    "businessType" "BusinessType" NOT NULL DEFAULT 'CLOTHING',
    "orderStatus" "OrderStatus" NOT NULL DEFAULT 'NEW',
    "orderDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deliveryDate" TIMESTAMP(3),
    "amount" DOUBLE PRECISION NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,
    "profit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "handledBy" "Owner" NOT NULL DEFAULT 'ME',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "business_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "business_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON UPDATE CASCADE ON DELETE CASCADE
);

-- Indexes for business table
CREATE INDEX IF NOT EXISTS "business_userId_idx" ON "business" USING btree ("userId");
CREATE INDEX IF NOT EXISTS "business_orderStatus_idx" ON "business" USING btree ("orderStatus");

-- Create unique constraints
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "daily_trackers_date_userId_key" ON "daily_trackers"("date", "userId");

-- Add foreign key constraints
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "daily_trackers" ADD CONSTRAINT "daily_trackers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "content" ADD CONSTRAINT "content_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "business" ADD CONSTRAINT "business_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create indexes for better performance
CREATE INDEX "daily_trackers_userId_idx" ON "daily_trackers"("userId");
CREATE INDEX "tasks_userId_idx" ON "tasks"("userId");
CREATE INDEX "tasks_status_idx" ON "tasks"("status");
CREATE INDEX "content_userId_idx" ON "content"("userId");
CREATE INDEX "content_status_idx" ON "content"("status");
CREATE INDEX "business_userId_idx" ON "business"("userId");
CREATE INDEX "business_orderStatus_idx" ON "business"("orderStatus");
