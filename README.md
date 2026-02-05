# BODHI EXECUTION OS

A complete productivity tracking web application built with Next.js 14, TypeScript, Tailwind CSS, Prisma ORM, and PostgreSQL.

## Features

### 🎯 Daily Tracker
- Track daily habits (deep work, gym, content, e-commerce, 3D printing, sleep schedule)
- Mood tracking with automatic score calculation
- Weekly and monthly analytics
- Streak tracking for consistency

### ✅ Task Management
- Kanban board with drag-and-drop functionality
- Categories: YouTube, BODHI Learn, E-commerce, 3D Printing, Work, Personal
- Priority levels: High, Medium, Low
- Status tracking: Backlog, Today, In Progress, Waiting, Done
- Time estimation and due date management

### 📹 Content Pipeline
- Multi-platform content management (YouTube, Instagram, Shorts)
- Workflow stages: Idea → Scripted → Recorded → Editing → Thumbnail Ready → Scheduled → Posted
- Content calendar and scheduling
- Platform-specific organization

### 💼 Business Tracker
- Order management for clothing and 3D printing businesses
- Revenue and profit tracking
- Order status workflow
- Payment status monitoring
- Customer and order details

### 📊 Analytics Dashboard
- Weekly habit scores and trends
- Task completion metrics
- Content pipeline overview
- Business performance analytics
- Visual charts and progress indicators

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with Google OAuth
- **Charts**: Recharts
- **State Management**: Zustand
- **Form Handling**: React Hook Form with Zod validation
- **Deployment**: Vercel

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
│   ├── schema.prisma          # Database schema
│   └── migrations/             # Database migrations
├── src/
│   ├── app/
│   │   ├── (auth)/            # Authentication pages
│   │   ├── (dashboard)/       # Protected dashboard pages
│   │   │   ├── dashboard/     # Main dashboard
│   │   │   ├── daily-tracker/ # Habit tracking
│   │   │   ├── tasks/         # Task management
│   │   │   ├── content/       # Content pipeline
│   │   │   └── business/      # Business tracker
│   │   └── api/               # API routes
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   └── charts/            # Chart components
│   ├── lib/
│   │   ├── auth.ts            # NextAuth configuration
│   │   ├── prisma.ts          # Prisma client
│   │   └── utils.ts           # Utility functions
│   └── types/                 # TypeScript type definitions
├── public/                    # Static assets
└── README.md
```

## Database Schema

The application uses PostgreSQL with the following main models:

- **User**: Authentication and role management (ME, WIFE)
- **DailyTracker**: Daily habit tracking and scores
- **Task**: Task management with categories and priorities
- **Content**: Content pipeline management
- **Business**: Business order and revenue tracking

## Authentication

The application uses NextAuth.js with Google OAuth. Users can sign in with their Google account, and their role (ME or WIFE) is assigned for proper access control.

## Deployment

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

## Support

For support and questions, please open an issue in the GitHub repository.
