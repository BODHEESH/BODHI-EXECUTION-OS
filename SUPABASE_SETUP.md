# Supabase Database Setup Instructions

## Step 1: Create Tables in Supabase

1. Go to your Supabase dashboard: https://oizuxigseqczmudskosr.supabase.co
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase-setup.sql` 
4. Run the SQL script to create all tables and enums

## Step 2: Add Sample Data (Optional)

1. In the same SQL Editor, copy and paste the contents of `supabase-seed.sql`
2. Run the script to add sample data

## Step 3: Test the Application

1. Make sure your .env.local has the correct DATABASE_URL:
   ```
   DATABASE_URL="postgresql://postgres:bodhiexecutionos@db.oizuxigseqczmudskosr.supabase.co:5432/postgres"
   ```
2. Restart the development server
3. Test the API endpoints:
   - http://localhost:3000/api/daily-tracker
   - http://localhost:3000/api/tasks
   - http://localhost:3000/api/content
   - http://localhost:3000/api/business

## Tables Created

### Authentication Tables (NextAuth)
- `Account` - OAuth account information
- `Session` - User sessions
- `User` - User profiles
- `VerificationToken` - Email verification tokens

### Application Tables
- `daily_trackers` - Daily habit tracking
- `tasks` - Task management
- `content` - Content pipeline
- `business` - Business orders and tracking

## Notes

- All tables have proper foreign key relationships
- Indexes are created for better performance
- Sample user: `demo@example.com`
- The application will work with these tables using Prisma ORM
