# BODHI EXECUTION OS

🚀 **Ultimate productivity platform for personal and business success with 120+ features**

A comprehensive productivity tracking web application built with Next.js 16, TypeScript, Tailwind CSS, Prisma ORM, and PostgreSQL. Designed for 60-day execution plans with measurable goals, habit streaks, and accountability partnerships.

## ✨ Key Features

### 🎯 **Goal Setting System**
- **Measurable Goals**: Track YouTube subscribers, revenue, fitness targets, and personal milestones
- **Progress Visualization**: Real-time progress bars with percentage completion
- **Urgency Indicators**: Critical/Urgent/Normal/Comfortable status tracking
- **Smart Suggestions**: Pre-built goal templates for different categories
- **Wife Accountability**: Share goals with your partner for support and encouragement

### 🔥 **Habit Streaks Gamification**
- **Visual Streak Tracking**: Fire emojis (🔥 → 🔥🔥 → 🔥🔥🔥) based on streak length
- **7 Habit Types**: Deep Work, Gym, Content, E-commerce, 3D Printing, Sleep, Wake-up
- **Achievement System**: Milestones at 7, 30, 60+ days
- **Streak Insights**: Personal bests and motivational messages
- **Automatic Calculation**: Smart streak logic that handles missed days

### 💝 **Accountability Partnership**
- **Wife Sharing System**: Share goals, achievements, and daily progress
- **Emoji Reactions**: ❤️ 🔥 💪 🎉 for encouragement and support
- **Shared Feed**: Real-time updates between partners
- **Motivation Boost**: Built-in partnership for goal achievement
- **Progress Celebrations**: Automatic sharing of milestones

### 📅 **Weekly Execution Plan**
- **60-Day Success Plan**: Complete execution system based on your weekly plan
- **Daily Non-Negotiables**: 5 must-do items every day (Deep Work 60+ min, Content 30+ min, Gym/Walk 30+ min, Sleep Before 11 PM, Wake 5:30 AM)
- **Day-Specific Tasks**: Unique morning/evening/fitness tasks for each day
- **Interactive Checklist**: Click-to-toggle checkboxes with visual feedback
- **Weekly Analytics**: Execution score breakdown by category
- **Burnout Prevention**: 4 rules to prevent burnout and maintain consistency

### 🎯 **Daily Tracker**
- **Habit Tracking**: Deep work, gym, content, e-commerce, 3D printing, sleep schedule
- **Mood Tracking**: Automatic score calculation with visual indicators
- **Weekly Analytics**: Comprehensive habit performance metrics
- **Recurring Tasks**: Automatic task creation for consistent habits

### ✅ **Advanced Task Management**
- **Kanban Board**: Drag-and-drop functionality with visual workflow
- **Smart Categories**: YouTube, BODHI Learn, E-commerce, 3D Printing, Work, Personal
- **Priority System**: High, Medium, Low with color coding
- **Status Tracking**: Backlog → Today → In Progress → Waiting → Done
- **Time Management**: Estimation and due date tracking
- **Recurring Tasks**: Automated task generation for repeated activities

### 📹 **Content Pipeline Management**
- **Multi-Platform**: YouTube, Instagram, Shorts, Reels support
- **Workflow Stages**: Idea → Scripted → Recorded → Editing → Thumbnail Ready → Scheduled → Posted
- **Content Calendar**: Visual scheduling and planning
- **Platform Analytics**: Performance tracking per platform
- **Batch Processing**: Handle multiple content pieces efficiently

### 💼 **Business Order Tracking**
- **Multi-Business**: Clothing and 3D printing business management
- **Revenue Analytics**: Real-time profit and revenue tracking
- **Order Workflow**: Complete order status management
- **Payment Monitoring**: Track payment status and follow-ups
- **Customer Management**: Detailed customer and order information
- **Audit History**: Complete business transaction tracking

### 📊 **Comprehensive Analytics**
- **Weekly Reviews**: Detailed performance analysis
- **Progress Visualization**: Charts and graphs for all metrics
- **Trend Analysis**: Long-term performance trends
- **Export Features**: CSV and JSON data export
- **Mobile Responsive**: Full functionality on all devices

### 📱 **PWA & Mobile App**
- **Progressive Web App**: Full PWA support with custom mobile app experience
- **Mobile Installation**: Add to homescreen with custom app icons
- **Custom App Icons**: Professional mobile-app-logo1.png for all screen sizes (72x72 to 512x512)
- **Apple Touch Icons**: Optimized for iOS devices with comprehensive icon coverage
- **Standalone Mode**: Native app experience without browser chrome
- **Theme Color**: Consistent app theme (#4f46e5) across mobile platforms
- **Date Navigation**: Mobile-friendly calendar date picker with prev/next buttons
- **Historical Data View**: Browse past days' tracker data on mobile
- **Midnight Auto-Refresh**: Automatic date transition handling at midnight
- **Responsive Design**: Optimized touch targets and mobile layouts

### 🕐 **Smart Date Handling**
- **Centralized Date Utils**: Consistent date handling across entire application
- **Midnight Transitions**: Automatic date refresh when day changes at 12:00 AM
- **Local Timezone**: Uses local timezone instead of UTC to prevent date issues
- **Calendar Integration**: Click calendar icon to select any historical date
- **Auto-Refresh System**: All components check for date changes every minute
- **Hydration Safe**: Proper client-side date initialization prevents SSR errors

## 🛠 Tech Stack

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui with custom components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with Google OAuth
- **Charts**: Recharts for data visualization
- **State Management**: React hooks and context
- **Form Handling**: React Hook Form with Zod validation
- **PWA**: Progressive Web App with manifest
- **Deployment**: Vercel with automatic deployments

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (Supabase or Neon recommended)
- Google OAuth credentials

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bodhi-execution-os
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables in `.env.local`:
```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DBNAME"
NEXTAUTH_SECRET="your_random_secret_key"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
```

5. Set up the database:
```bash
npx prisma migrate dev
npx prisma generate
```

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
bodhi-execution-os/
├── prisma/
│   ├── schema.prisma          # Database schema with Goals, Streaks, Accountability
│   └── migrations/             # Database migrations
├── src/
│   ├── app/
│   │   ├── (auth)/            # Authentication pages (login, register)
│   │   ├── (dashboard)/       # Protected dashboard pages
│   │   │   ├── dashboard/     # Main dashboard with overview
│   │   │   ├── daily-tracker/ # Habit and mood tracking
│   │   │   ├── tasks/         # Advanced task management
│   │   │   ├── content/       # Content pipeline management
│   │   │   ├── business/      # Business order tracking
│   │   │   ├── goals/         # Goal setting & progress tracking
│   │   │   ├── execution-plan/ # 60-day weekly execution plan
│   │   │   ├── weekly-review/ # Comprehensive analytics
│   │   │   └── settings/      # User settings and preferences
│   │   └── api/               # API routes
│   │       ├── goals/         # Goal CRUD operations
│   │       ├── habit-streaks/ # Streak tracking API
│   │       ├── accountability/ # Wife sharing system
│   │       ├── weekly-plan/   # Execution plan API
│   │       └── ...            # Other API endpoints
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── goals-card.tsx     # Goal progress component
│   │   ├── habit-streaks-card.tsx # Streak visualization
│   │   ├── accountability-feed.tsx # Wife partnership feed
│   │   ├── weekly-plan-checklist.tsx # Interactive checklist
│   │   └── ...                # Other custom components
│   ├── lib/
│   │   ├── goal-utils.ts      # Goal progress calculations
│   │   ├── streak-utils.ts    # Streak logic and messages
│   │   ├── weekly-plan-config.ts # Execution plan configuration
│   │   ├── date-utils.ts      # Centralized date handling utilities
│   │   ├── daily-tracker-utils.ts # Daily tracker data integrity
│   │   ├── auth.ts            # NextAuth configuration
│   │   ├── prisma.ts          # Prisma client
│   │   └── utils.ts           # Utility functions
│   └── types/                 # TypeScript type definitions
├── public/
│   ├── logos/                 # Application logos (cp1.png, mobile-app-logo1.png)
│   ├── manifest.json          # PWA manifest for mobile with comprehensive icons
│   └── ...                    # Other static assets
├── goals-streaks-accountability-migration.sql # Database migration
├── weekly-plan-migration.sql  # Weekly plan migration
├── features-list.md           # Complete feature documentation
└── README.md
```

## Database Schema

The application uses PostgreSQL with the following main models:

### Core Models
- **User**: Authentication and role management (ME, WIFE)
- **DailyTracker**: Daily habit tracking and mood scores
- **Task**: Advanced task management with categories and priorities
- **Content**: Content pipeline management with multi-platform support
- **Business**: Business order and revenue tracking with audit history

### New Feature Models
- **Goal**: Goal setting with progress tracking, categories, and deadlines
- **HabitStreak**: Streak tracking for habit consistency and achievements
- **WeeklyPlan**: 60-day execution plan with daily non-negotiables and day-specific tasks
- **AccountabilityShare**: Wife partnership sharing system with reactions

### Key Relationships
- Users have multiple goals, habit streaks, and weekly plans
- Goals can be shared with wife for accountability
- Habit streaks automatically update based on daily tracker completion
- Weekly plans integrate with daily execution tracking

## 🎯 60-Day Execution Plan

The application is specifically designed for 60-day success plans with measurable outcomes:

### 📈 Success Targets
- **YouTube**: Consistent content creation and subscriber growth
- **E-commerce**: Complete business launch and revenue generation
- **Fitness**: Establish sustainable workout routine
- **3D Printing**: Create additional income stream
- **Partnership**: Build accountability with wife

### 🔥 Daily Non-Negotiables
- Deep Work (60+ minutes)
- Content Work (30+ minutes)  
- Gym/Walk (30+ minutes)
- Sleep Before 11 PM
- Wake at 5:30 AM

### 📅 Weekly Structure
- **Sunday**: Planning and preparation
- **Monday-Friday**: Execution with specific morning/evening tasks
- **Saturday**: Review and recovery

### 🏆 Achievement System
- Streak tracking for consistency
- Progress visualization for goals
- Wife partnership for accountability
- Weekly analytics for optimization

## Authentication

The application uses NextAuth.js with Google OAuth. Users can sign in with their Google account, and their role (ME or WIFE) is assigned for proper access control and partnership features.

## 🚀 Deployment

### Database Setup (Required)

Before deployment, run the database migrations:

```bash
# Run the main migration
psql YOUR_DATABASE_URL < goals-streaks-accountability-migration.sql

# Run the weekly plan migration  
psql YOUR_DATABASE_URL < weekly-plan-migration.sql
```

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

- `DATABASE_URL`: Your PostgreSQL connection string
- `NEXTAUTH_SECRET`: Random secret string
- `NEXTAUTH_URL`: Your deployed URL
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret

### Post-Deployment Setup

1. **Run Database Migrations**: Execute the SQL migrations in your Supabase/PostgreSQL dashboard
2. **Verify Features**: Test goal creation, streak tracking, and accountability sharing
3. **PWA Setup**: The app will automatically support add-to-homescreen on mobile devices

## Development

### Running Tests

```bash
npm run test
```

### Database Management

```bash
# Create new migration
npx prisma migrate dev --name <migration-name>

# Reset database
npx prisma migrate reset

# View database in Prisma Studio
npx prisma studio
```

### Code Style

The project uses ESLint and Prettier for code formatting. Run:

```bash
npm run lint
npm run format
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## 📊 Feature Summary

**BODHI EXECUTION OS** includes **120+ features** across 10 categories:

### 📈 Feature Breakdown
- **Core Features**: 45 (Goals, Streaks, Execution Plan, Daily Tracker, Accountability)
- **Advanced Features**: 30 (Task Management, Content Pipeline, Business Tracking, Date Handling)
- **UI/UX Features**: 20 (Mobile Responsive, PWA, Calendar Navigation, Historical Data)
- **Security Features**: 10 (Role-based Access, Data Protection)
- **Technical Features**: 15 (API Endpoints, Database Migrations, Export)

### 🎯 Key Achievements
- ✅ **60-Day Success Formula**: Complete execution system with measurable outcomes
- ✅ **Wife Partnership**: Built-in accountability system with reactions and sharing
- ✅ **Mobile PWA**: Native app experience with custom icons and homescreen installation
- ✅ **Smart Date Handling**: Midnight transitions and centralized date utilities
- ✅ **Real-time Analytics**: Comprehensive performance tracking across all modules
- ✅ **Gamification**: Streaks, achievements, and progress visualization
- ✅ **Multi-Business**: Clothing + 3D printing support with audit trails
- ✅ **Content Pipeline**: Multi-platform content management and scheduling
- ✅ **Goal Setting**: 60-day measurable goals with progress tracking
- ✅ **Habit Streaks**: Gamified consistency tracking with motivational messages

## 🆘 Support

For support and questions, please open an issue in the GitHub repository.

### 📚 Additional Documentation
- [`features-list.md`](./features-list.md) - Complete feature documentation
- [`GOALS_STREAKS_ACCOUNTABILITY_GUIDE.md`](./GOALS_STREAKS_ACCOUNTABILITY_GUIDE.md) - Detailed implementation guide
- [`weekly-plan-migration.sql`](./weekly-plan-migration.sql) - Database migration
- [`goals-streaks-accountability-migration.sql`](./goals-streaks-accountability-migration.sql) - New features migration

---

🚀 **Built for 60-day success with measurable goals, consistent habits, and strong partnerships!**
