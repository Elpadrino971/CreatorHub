# CreatorHub - Development Guide

Complete guide for developers working on CreatorHub.

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL (or Supabase account)
- Git
- Code editor (VS Code recommended)

### Initial Setup

1. **Clone and install**
```bash
git clone <your-repo-url>
cd CreatorHub
npm install
```

2. **Environment Setup**
```bash
cp .env.example .env
```

Fill in your `.env` file:
```bash
# Get from Supabase
DATABASE_URL="postgresql://..."

# Get from Clerk (clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# Platform APIs (optional for initial dev)
YOUTUBE_CLIENT_ID="..."
YOUTUBE_CLIENT_SECRET="..."
# ... etc
```

3. **Database Setup**
```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Open Prisma Studio to view database
npx prisma studio
```

4. **Run Development Server**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
CreatorHub/
├── docs/                    # Documentation
│   ├── DATABASE_SCHEMA.md
│   ├── API_INTEGRATIONS.md
│   ├── ARCHITECTURE.md
│   └── DEVELOPMENT_GUIDE.md
├── prisma/
│   └── schema.prisma       # Database schema
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── (auth)/        # Auth pages
│   │   ├── (dashboard)/   # Dashboard pages
│   │   ├── api/           # API routes
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx       # Landing page
│   ├── components/
│   │   └── ui/            # shadcn/ui components
│   └── lib/
│       ├── db.ts          # Prisma client
│       ├── utils.ts       # Helper functions
│       └── integrations/  # Platform integrations
├── .env.example
├── next.config.mjs
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## Development Workflow

### 1. Feature Development

**Branch Strategy:**
```bash
main          # Production
├── develop   # Development (auto-deploy to staging)
└── feature/* # Feature branches
```

**Create a feature:**
```bash
git checkout develop
git pull origin develop
git checkout -b feature/analytics-charts

# Make changes...
git add .
git commit -m "feat: add analytics charts"
git push origin feature/analytics-charts

# Create PR to develop
```

### 2. Database Changes

**Modify Schema:**
```prisma
// prisma/schema.prisma
model NewModel {
  id        String   @id @default(uuid())
  name      String
  createdAt DateTime @default(now())
}
```

**Apply Changes:**
```bash
# Development
npx prisma db push

# Production (with migrations)
npx prisma migrate dev --name add_new_model
npx prisma generate
```

### 3. Creating API Routes

**Example: Get User Analytics**

```typescript
// src/app/api/analytics/route.ts
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // 1. Authenticate user
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Get user from database
  const user = await db.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // 3. Fetch analytics
  const analytics = await db.analytics.findMany({
    where: {
      connection: {
        userId: user.id,
      },
      date: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    },
    include: {
      connection: true,
    },
    orderBy: {
      date: 'desc',
    },
  });

  // 4. Return data
  return NextResponse.json({ success: true, data: analytics });
}
```

### 4. Creating Dashboard Pages

**Example: Analytics Page**

```typescript
// src/app/(dashboard)/analytics/page.tsx
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { AnalyticsChart } from "@/components/analytics/analytics-chart";

export default async function AnalyticsPage() {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");

  const user = await db.user.findUnique({
    where: { clerkId: clerkUser.id },
    include: {
      platformConnections: {
        include: {
          analytics: {
            where: {
              date: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
              },
            },
            orderBy: { date: 'asc' },
          },
        },
      },
    },
  });

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Analytics</h1>
      <AnalyticsChart data={user?.platformConnections || []} />
    </div>
  );
}
```

### 5. Adding shadcn/ui Components

```bash
# Install a component
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
```

**Use in component:**
```typescript
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function MyComponent() {
  return (
    <Card>
      <Button>Click me</Button>
    </Card>
  );
}
```

## Testing

### Unit Tests (Coming Soon)

```bash
npm test
```

### Integration Tests

```bash
npm run test:integration
```

### E2E Tests (Playwright)

```bash
npm run test:e2e
```

## Platform Integration Development

### YouTube Integration Example

```typescript
// src/lib/integrations/youtube.ts
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

export async function getYouTubeChannelStats(accessToken: string) {
  const response = await fetch(
    `${YOUTUBE_API_BASE}/channels?` +
    new URLSearchParams({
      part: 'statistics,snippet',
      mine: 'true',
    }),
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`YouTube API error: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    id: data.items[0].id,
    title: data.items[0].snippet.title,
    subscriberCount: parseInt(data.items[0].statistics.subscriberCount),
    viewCount: parseInt(data.items[0].statistics.viewCount),
    videoCount: parseInt(data.items[0].statistics.videoCount),
  };
}
```

**OAuth Route:**
```typescript
// src/app/api/auth/youtube/route.ts
import { auth } from "@clerk/nextjs";

export async function GET() {
  const { userId } = auth();
  if (!userId) {
    return Response.redirect('/sign-in');
  }

  const params = new URLSearchParams({
    client_id: process.env.YOUTUBE_CLIENT_ID!,
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/youtube/callback`,
    response_type: 'code',
    scope: 'https://www.googleapis.com/auth/youtube.readonly',
    access_type: 'offline',
    prompt: 'consent',
    state: userId, // Validate in callback
  });

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  return Response.redirect(authUrl);
}
```

**Callback Route:**
```typescript
// src/app/api/auth/youtube/callback/route.ts
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (!code) {
    return Response.redirect('/dashboard?error=no_code');
  }

  // Exchange code for tokens
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code,
      client_id: process.env.YOUTUBE_CLIENT_ID,
      client_secret: process.env.YOUTUBE_CLIENT_SECRET,
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/youtube/callback`,
      grant_type: 'authorization_code',
    }),
  });

  const tokens = await tokenResponse.json();

  // Get user
  const user = await db.user.findUnique({
    where: { clerkId: state },
  });

  // Store connection
  await db.platformConnection.create({
    data: {
      userId: user!.id,
      platform: 'YOUTUBE',
      accessToken: tokens.access_token, // Encrypt in production!
      refreshToken: tokens.refresh_token,
      tokenExpiresAt: new Date(Date.now() + tokens.expires_in * 1000),
    },
  });

  return Response.redirect('/dashboard?connected=youtube');
}
```

## Common Tasks

### Add a New Database Model

1. Update `prisma/schema.prisma`
2. Run `npx prisma db push`
3. Run `npx prisma generate`
4. Create types if needed

### Add a New Platform

1. Create OAuth flow in `src/app/api/auth/[platform]/`
2. Create integration in `src/lib/integrations/[platform].ts`
3. Add sync job in `src/app/api/cron/sync-[platform]/route.ts`
4. Update UI to show new platform

### Add a New Dashboard Page

1. Create page in `src/app/(dashboard)/[page-name]/page.tsx`
2. Add to sidebar navigation in `src/app/(dashboard)/layout.tsx`
3. Create components in `src/components/[page-name]/`

## Debugging

### Prisma Studio
```bash
npx prisma studio
```
Opens database viewer at http://localhost:5555

### Check Environment Variables
```bash
# In development
node -e "console.log(process.env.DATABASE_URL)"
```

### View Logs
- **Local**: Console output
- **Vercel**: Vercel dashboard → Logs
- **Database**: Supabase dashboard → Logs

### Common Issues

**Prisma Connection Errors:**
```bash
# Clear cache and regenerate
rm -rf node_modules/.prisma
npx prisma generate
```

**Build Errors:**
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

## Deployment

### Preview Deployment (Automatic)
- Push to any branch
- Vercel auto-deploys to preview URL
- Check in Vercel dashboard

### Production Deployment
```bash
# Merge to main branch
git checkout main
git merge develop
git push origin main

# Vercel auto-deploys to production
```

### Environment Variables (Vercel)
1. Go to Vercel dashboard
2. Select project → Settings → Environment Variables
3. Add all variables from `.env.example`
4. Separate by environment (Development, Preview, Production)

## Code Style

### TypeScript
- Use strict mode
- Prefer interfaces over types
- Use meaningful variable names
- Add JSDoc comments for complex functions

### React Components
- Functional components only
- Use TypeScript for props
- Extract complex logic to custom hooks
- Keep components small and focused

### File Naming
- Components: `PascalCase.tsx`
- Utilities: `kebab-case.ts`
- Pages: `page.tsx` (Next.js convention)
- API routes: `route.ts` (Next.js convention)

## Performance Tips

### Database
- Use indexes for frequent queries
- Batch operations when possible
- Use `select` to limit fields
- Implement pagination for large datasets

### Caching
```typescript
// Cache expensive operations
import { cache } from 'react';

export const getAnalytics = cache(async (userId: string) => {
  return db.analytics.findMany({ where: { userId } });
});
```

### Image Optimization
```tsx
import Image from 'next/image';

<Image
  src="/avatar.jpg"
  alt="Avatar"
  width={40}
  height={40}
  priority // For above-fold images
/>
```

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Clerk Docs](https://clerk.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)

## Getting Help

- Check existing issues on GitHub
- Ask in team Discord/Slack
- Review documentation in `/docs`
- Create detailed issue with reproduction steps
