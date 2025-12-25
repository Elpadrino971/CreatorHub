# CreatorHub - Technical Architecture

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Web App     │  │  Mobile App  │  │  Browser Ext │      │
│  │  (Next.js)   │  │(React Native)│  │   (Future)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Next.js App Router + API Routes              │   │
│  │    /api/auth/*  /api/platforms/*  /api/analytics/*   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│ Auth Service │   │ Platform API │   │ Analytics    │
│   (Clerk)    │   │  Integrations│   │   Service    │
└──────────────┘   └──────────────┘   └──────────────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                       DATA LAYER                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  PostgreSQL  │  │  Redis Cache │  │  File Storage│      │
│  │  (Supabase)  │  │   (Upstash)  │  │(Cloudflare R2)│     │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   EXTERNAL SERVICES                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ YouTube  │ │  Twitch  │ │  TikTok  │ │Instagram │       │
│  │   API    │ │   API    │ │   API    │ │   API    │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
└─────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Frontend Layer

#### Web Application (Next.js 14)
- **Framework**: Next.js 14 with App Router
- **Rendering**: Server-side rendering (SSR) for SEO, client-side for interactivity
- **State Management**: Zustand for client state, React Query for server state
- **Styling**: Tailwind CSS + shadcn/ui components
- **Charts**: Recharts for analytics visualization

**Directory Structure:**
```
src/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   └── sign-up/[[...sign-up]]/page.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/page.tsx
│   │   ├── analytics/page.tsx
│   │   ├── calendar/page.tsx
│   │   ├── revenue/page.tsx
│   │   └── settings/page.tsx
│   ├── api/
│   │   ├── auth/[platform]/route.ts
│   │   ├── platforms/[platform]/route.ts
│   │   ├── analytics/route.ts
│   │   └── webhooks/stripe/route.ts
│   └── layout.tsx
├── components/
│   ├── ui/ (shadcn components)
│   ├── dashboard/
│   ├── analytics/
│   └── calendar/
└── lib/
    ├── db.ts
    ├── utils.ts
    └── integrations/
```

#### Mobile Application (Phase 2)
- **Framework**: React Native with Expo
- **Navigation**: React Navigation
- **Shared API**: Same Next.js API endpoints

### 2. Authentication & Authorization

#### Clerk Integration
- **Provider**: Clerk for authentication
- **Features**:
  - Email/password auth
  - OAuth providers (Google, GitHub)
  - User management
  - Session handling
  - Webhooks for user events

**Flow:**
```
User Sign Up → Clerk Creates User → Webhook → Create User in DB
User Sign In → Clerk Session → Middleware Validates → Access Dashboard
```

**Middleware Protection:**
```typescript
// src/middleware.ts
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/sign-in", "/sign-up"],
});
```

### 3. Platform Integrations

#### OAuth Flow Architecture

```
1. User clicks "Connect YouTube"
   ↓
2. Redirect to /api/auth/youtube
   ↓
3. Generate OAuth URL with state token
   ↓
4. Redirect to YouTube OAuth consent
   ↓
5. User authorizes
   ↓
6. YouTube redirects to /api/auth/youtube/callback
   ↓
7. Exchange code for access + refresh tokens
   ↓
8. Encrypt and store tokens in DB
   ↓
9. Fetch initial user data
   ↓
10. Redirect to dashboard
```

**Implementation Pattern:**
```typescript
// src/app/api/auth/[platform]/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const platform = searchParams.get('platform');

  // Generate OAuth URL
  const oauthUrl = generateOAuthURL(platform);

  return Response.redirect(oauthUrl);
}

// src/app/api/auth/[platform]/callback/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  // Exchange code for tokens
  const tokens = await exchangeCodeForTokens(platform, code);

  // Store in database
  await db.platformConnection.create({
    data: {
      userId: user.id,
      platform: platform.toUpperCase(),
      accessToken: encryptToken(tokens.access_token),
      refreshToken: encryptToken(tokens.refresh_token),
      tokenExpiresAt: new Date(Date.now() + tokens.expires_in * 1000),
    },
  });

  return Response.redirect('/dashboard');
}
```

### 4. Data Sync System

#### Background Jobs (Vercel Cron)

**Sync Schedule:**
- Analytics: Every 6 hours
- Revenue: Daily at 2 AM UTC
- Content updates: Every 4 hours
- Token refresh: 1 hour before expiry

**Job Implementation:**
```typescript
// src/app/api/cron/sync-analytics/route.ts
export async function GET(request: Request) {
  const connections = await db.platformConnection.findMany({
    where: { isActive: true },
  });

  for (const connection of connections) {
    await syncPlatformData(connection);
  }

  return Response.json({ success: true });
}

async function syncPlatformData(connection: PlatformConnection) {
  // 1. Refresh token if needed
  if (connection.tokenExpiresAt < new Date()) {
    await refreshToken(connection);
  }

  // 2. Fetch latest data
  const data = await fetchPlatformData(connection);

  // 3. Store in analytics table
  await db.analytics.createMany({
    data: data.metrics.map(metric => ({
      connectionId: connection.id,
      date: new Date(),
      metricType: metric.type,
      metricValue: metric.value,
    })),
  });

  // 4. Update content table
  await upsertContent(connection, data.content);
}
```

### 5. Database Layer

#### Prisma ORM
- **Type Safety**: Full TypeScript support
- **Migrations**: Version-controlled schema changes
- **Relations**: Efficient joins and includes
- **Performance**: Connection pooling, prepared statements

**Query Patterns:**

**Get Dashboard Data:**
```typescript
const dashboardData = await db.user.findUnique({
  where: { id: userId },
  include: {
    platformConnections: {
      where: { isActive: true },
      include: {
        analytics: {
          where: {
            date: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            },
          },
          orderBy: { date: 'desc' },
        },
        content: {
          orderBy: { viewsCount: 'desc' },
          take: 5,
        },
      },
    },
    revenue: {
      where: {
        periodStart: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    },
  },
});
```

#### Caching Strategy
- **Redis**: Cache frequent queries (30-60 min TTL)
- **Next.js Cache**: Revalidate on-demand
- **Browser Cache**: Static assets (1 year)

```typescript
// src/lib/cache.ts
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

export async function getCachedAnalytics(userId: string) {
  const cached = await redis.get(`analytics:${userId}`);
  if (cached) return cached;

  const data = await fetchAnalytics(userId);
  await redis.set(`analytics:${userId}`, data, { ex: 3600 }); // 1 hour

  return data;
}
```

### 6. API Design

#### REST Endpoints

```
Authentication:
  GET  /api/auth/[platform]          - Initiate OAuth flow
  GET  /api/auth/[platform]/callback - OAuth callback
  POST /api/auth/disconnect          - Disconnect platform

Platforms:
  GET  /api/platforms                - List connected platforms
  GET  /api/platforms/[id]           - Get platform details
  POST /api/platforms/[id]/sync      - Trigger manual sync
  DEL  /api/platforms/[id]           - Disconnect platform

Analytics:
  GET  /api/analytics                - Get aggregated analytics
  GET  /api/analytics/[platform]     - Platform-specific analytics
  GET  /api/analytics/compare        - Compare platforms

Content:
  GET  /api/content                  - List all content
  GET  /api/content/[id]             - Get content details
  GET  /api/content/top              - Top performing content

Calendar:
  GET  /api/calendar/events          - List calendar events
  POST /api/calendar/events          - Create event
  PUT  /api/calendar/events/[id]     - Update event
  DEL  /api/calendar/events/[id]     - Delete event

Revenue:
  GET  /api/revenue                  - Get revenue data
  POST /api/revenue                  - Add manual revenue entry
  GET  /api/revenue/forecast         - Revenue forecast

Webhooks:
  POST /api/webhooks/stripe          - Stripe events
  POST /api/webhooks/[platform]      - Platform webhooks
```

#### Response Format

**Success:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "PLATFORM_ERROR",
    "message": "Failed to fetch YouTube data",
    "details": { ... }
  }
}
```

### 7. Subscription & Billing

#### Stripe Integration

**Products:**
- `prod_free` - Free tier
- `prod_pro` - Pro ($29/mo)
- `prod_premium` - Premium ($79/mo)

**Flow:**
```
User clicks Upgrade → Stripe Checkout → Success → Webhook
→ Update subscription in DB → Grant access to features
```

**Webhook Handler:**
```typescript
// src/app/api/webhooks/stripe/route.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature')!;

  const event = stripe.webhooks.constructEvent(
    body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET!
  );

  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutCompleted(event.data.object);
      break;
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object);
      break;
    case 'customer.subscription.deleted':
      await handleSubscriptionCanceled(event.data.object);
      break;
  }

  return Response.json({ received: true });
}
```

### 8. Deployment Architecture

#### Vercel Deployment
- **Region**: US East (primary)
- **Edge Network**: Global CDN
- **Functions**: Serverless API routes
- **Build**: Automatic on git push

#### Environment Variables
```bash
# Database
DATABASE_URL=postgresql://...

# Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...

# Platforms
YOUTUBE_CLIENT_ID=...
YOUTUBE_CLIENT_SECRET=...
# ... (other platforms)

# Payments
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...

# Encryption
TOKEN_ENCRYPTION_KEY=... (32 bytes)

# Cron
CRON_SECRET=... (for securing cron endpoints)
```

### 9. Monitoring & Observability

#### Tools
- **Vercel Analytics**: Performance monitoring
- **Sentry**: Error tracking
- **Logtail**: Log aggregation
- **Uptime Robot**: Uptime monitoring

#### Key Metrics
- API response times
- Database query performance
- Platform sync success rate
- User engagement metrics
- Revenue metrics

### 10. Security

#### Security Measures
1. **Authentication**: Clerk with MFA support
2. **Authorization**: Row-level security (RLS) in Supabase
3. **Token Encryption**: AES-256 encryption for OAuth tokens
4. **API Rate Limiting**: Per-user and per-IP limits
5. **CSRF Protection**: Built-in Next.js protection
6. **Input Validation**: Zod schema validation
7. **SQL Injection**: Prisma parameterized queries
8. **XSS Protection**: React auto-escaping

## Performance Optimization

### Frontend
- Code splitting (Next.js automatic)
- Image optimization (next/image)
- Font optimization (next/font)
- Lazy loading components
- Memoization (React.memo, useMemo)

### Backend
- Database connection pooling
- Query optimization (indexes)
- Redis caching
- CDN for static assets
- Incremental Static Regeneration (ISR)

### Database Indexes
```sql
-- High-traffic query indexes
CREATE INDEX idx_analytics_user_date ON analytics(connection_id, date DESC);
CREATE INDEX idx_content_performance ON content(connection_id, views_count DESC);
CREATE INDEX idx_calendar_upcoming ON calendar_events(user_id, scheduled_at);
```

## Scalability Plan

### Phase 1: 0-1K users
- Single region deployment
- PostgreSQL on Supabase (free tier → pro)
- Redis on Upstash (free tier)
- Vercel hobby → pro

### Phase 2: 1K-10K users
- Database scaling (larger instance)
- Redis upgrade
- CDN optimization
- Background job optimization

### Phase 3: 10K+ users
- Multi-region database replicas
- Dedicated background workers
- Microservices for heavy operations
- Advanced caching strategies
