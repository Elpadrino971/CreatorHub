# CreatorHub - Database Schema

## Overview
Complete PostgreSQL database schema for CreatorHub SaaS platform optimized for multi-platform content creator analytics, content planning, and revenue tracking.

## Core Tables

### 1. Users (via Clerk/Supabase Auth)
```sql
-- Managed by auth provider, but we store extended profile
users
  - id: UUID (PK)
  - email: VARCHAR(255) UNIQUE NOT NULL
  - name: VARCHAR(255)
  - avatar_url: VARCHAR(500)
  - subscription_tier: ENUM('free', 'pro', 'premium') DEFAULT 'free'
  - subscription_status: ENUM('active', 'canceled', 'past_due', 'trialing') DEFAULT 'trialing'
  - trial_ends_at: TIMESTAMP
  - created_at: TIMESTAMP DEFAULT NOW()
  - updated_at: TIMESTAMP DEFAULT NOW()
```

### 2. PlatformConnections
Store OAuth tokens and connection status for each platform
```sql
platform_connections
  - id: UUID (PK)
  - user_id: UUID (FK → users.id) NOT NULL
  - platform: ENUM('youtube', 'twitch', 'tiktok', 'instagram') NOT NULL
  - platform_user_id: VARCHAR(255) NOT NULL -- their ID on that platform
  - platform_username: VARCHAR(255)
  - display_name: VARCHAR(255)
  - avatar_url: VARCHAR(500)
  - access_token: TEXT -- encrypted
  - refresh_token: TEXT -- encrypted
  - token_expires_at: TIMESTAMP
  - is_active: BOOLEAN DEFAULT true
  - last_synced_at: TIMESTAMP
  - created_at: TIMESTAMP DEFAULT NOW()
  - updated_at: TIMESTAMP DEFAULT NOW()

  UNIQUE(user_id, platform)
  INDEX(user_id, platform)
```

### 3. Analytics
Store aggregated daily analytics per platform
```sql
analytics
  - id: UUID (PK)
  - connection_id: UUID (FK → platform_connections.id) NOT NULL
  - date: DATE NOT NULL
  - metric_type: ENUM('followers', 'views', 'engagement', 'watch_time') NOT NULL
  - metric_value: BIGINT NOT NULL
  - metric_delta: INTEGER -- change from previous day
  - metadata: JSONB -- platform-specific extra data
  - created_at: TIMESTAMP DEFAULT NOW()

  UNIQUE(connection_id, date, metric_type)
  INDEX(connection_id, date)
  INDEX(date, metric_type)
```

### 4. Content (videos, streams, posts)
```sql
content
  - id: UUID (PK)
  - connection_id: UUID (FK → platform_connections.id) NOT NULL
  - platform_content_id: VARCHAR(255) NOT NULL -- video ID, stream ID, etc.
  - content_type: ENUM('video', 'stream', 'short', 'post') NOT NULL
  - title: VARCHAR(500)
  - description: TEXT
  - thumbnail_url: VARCHAR(500)
  - url: VARCHAR(500)
  - published_at: TIMESTAMP
  - duration_seconds: INTEGER
  - views_count: BIGINT DEFAULT 0
  - likes_count: INTEGER DEFAULT 0
  - comments_count: INTEGER DEFAULT 0
  - shares_count: INTEGER DEFAULT 0
  - engagement_rate: DECIMAL(5,2) -- calculated percentage
  - is_trending: BOOLEAN DEFAULT false
  - metadata: JSONB -- platform-specific data
  - created_at: TIMESTAMP DEFAULT NOW()
  - updated_at: TIMESTAMP DEFAULT NOW()

  UNIQUE(connection_id, platform_content_id)
  INDEX(connection_id, published_at)
  INDEX(is_trending, views_count)
```

### 5. CalendarEvents
Content planning and scheduling
```sql
calendar_events
  - id: UUID (PK)
  - user_id: UUID (FK → users.id) NOT NULL
  - connection_id: UUID (FK → platform_connections.id) NULL -- null if not assigned yet
  - title: VARCHAR(255) NOT NULL
  - description: TEXT
  - content_type: ENUM('video', 'stream', 'short', 'post') NOT NULL
  - status: ENUM('draft', 'scheduled', 'published', 'canceled') DEFAULT 'draft'
  - scheduled_at: TIMESTAMP
  - published_at: TIMESTAMP NULL
  - tags: VARCHAR(255)[] -- array of tags
  - notes: TEXT
  - reminder_sent: BOOLEAN DEFAULT false
  - metadata: JSONB -- templates, scripts, etc.
  - created_at: TIMESTAMP DEFAULT NOW()
  - updated_at: TIMESTAMP DEFAULT NOW()

  INDEX(user_id, scheduled_at)
  INDEX(status, scheduled_at)
```

### 6. Revenue
Track income from various sources
```sql
revenue
  - id: UUID (PK)
  - user_id: UUID (FK → users.id) NOT NULL
  - connection_id: UUID (FK → platform_connections.id) NULL -- null for manual entries
  - revenue_type: ENUM('adsense', 'subscriptions', 'donations', 'sponsorship', 'merchandise', 'other') NOT NULL
  - amount: DECIMAL(10,2) NOT NULL
  - currency: VARCHAR(3) DEFAULT 'USD'
  - period_start: DATE NOT NULL
  - period_end: DATE NOT NULL
  - description: VARCHAR(500)
  - is_estimated: BOOLEAN DEFAULT false
  - is_paid: BOOLEAN DEFAULT false
  - paid_at: TIMESTAMP NULL
  - metadata: JSONB
  - created_at: TIMESTAMP DEFAULT NOW()

  INDEX(user_id, period_start, period_end)
  INDEX(connection_id, period_start)
```

### 7. Insights
AI-generated insights and recommendations
```sql
insights
  - id: UUID (PK)
  - user_id: UUID (FK → users.id) NOT NULL
  - insight_type: ENUM('performance_alert', 'best_time', 'trending_topic', 'content_suggestion', 'audience_growth') NOT NULL
  - title: VARCHAR(255) NOT NULL
  - description: TEXT
  - priority: ENUM('low', 'medium', 'high') DEFAULT 'medium'
  - is_read: BOOLEAN DEFAULT false
  - is_dismissed: BOOLEAN DEFAULT false
  - action_url: VARCHAR(500) NULL
  - metadata: JSONB
  - expires_at: TIMESTAMP NULL
  - created_at: TIMESTAMP DEFAULT NOW()

  INDEX(user_id, is_read, priority)
  INDEX(created_at, expires_at)
```

### 8. Subscriptions
Stripe subscription tracking
```sql
subscriptions
  - id: UUID (PK)
  - user_id: UUID (FK → users.id) NOT NULL UNIQUE
  - stripe_customer_id: VARCHAR(255) UNIQUE
  - stripe_subscription_id: VARCHAR(255) UNIQUE
  - tier: ENUM('free', 'pro', 'premium') NOT NULL DEFAULT 'free'
  - status: ENUM('active', 'canceled', 'past_due', 'trialing', 'incomplete') NOT NULL
  - current_period_start: TIMESTAMP
  - current_period_end: TIMESTAMP
  - cancel_at_period_end: BOOLEAN DEFAULT false
  - trial_ends_at: TIMESTAMP NULL
  - created_at: TIMESTAMP DEFAULT NOW()
  - updated_at: TIMESTAMP DEFAULT NOW()

  INDEX(stripe_customer_id)
  INDEX(status, tier)
```

### 9. TeamMembers (Phase 2)
For collaboration features
```sql
team_members
  - id: UUID (PK)
  - user_id: UUID (FK → users.id) NOT NULL -- the owner
  - member_email: VARCHAR(255) NOT NULL
  - role: ENUM('editor', 'community_manager', 'viewer') NOT NULL
  - permissions: JSONB -- granular permissions
  - invited_at: TIMESTAMP DEFAULT NOW()
  - accepted_at: TIMESTAMP NULL
  - status: ENUM('pending', 'active', 'removed') DEFAULT 'pending'

  UNIQUE(user_id, member_email)
  INDEX(user_id, status)
```

### 10. AuditLogs
Track important user actions
```sql
audit_logs
  - id: UUID (PK)
  - user_id: UUID (FK → users.id) NOT NULL
  - action: VARCHAR(100) NOT NULL -- 'platform_connected', 'content_published', etc.
  - resource_type: VARCHAR(50) -- 'content', 'calendar_event', etc.
  - resource_id: UUID NULL
  - metadata: JSONB
  - ip_address: INET
  - user_agent: VARCHAR(500)
  - created_at: TIMESTAMP DEFAULT NOW()

  INDEX(user_id, created_at)
  INDEX(action, created_at)
```

## Tier Limits Enforcement

```sql
-- View for checking user limits
CREATE VIEW user_limits AS
SELECT
  u.id,
  u.subscription_tier,
  COUNT(DISTINCT pc.platform) as connected_platforms,
  CASE u.subscription_tier
    WHEN 'free' THEN 1
    WHEN 'pro' THEN 3
    WHEN 'premium' THEN 999
  END as max_platforms
FROM users u
LEFT JOIN platform_connections pc ON pc.user_id = u.id AND pc.is_active = true
GROUP BY u.id, u.subscription_tier;
```

## Useful Queries

### Get user dashboard overview
```sql
SELECT
  u.id,
  u.name,
  u.subscription_tier,
  COUNT(DISTINCT pc.id) as platforms_connected,
  SUM(a.metric_value) FILTER (WHERE a.metric_type = 'followers' AND a.date = CURRENT_DATE - 1) as total_followers,
  SUM(a.metric_value) FILTER (WHERE a.metric_type = 'views' AND a.date >= CURRENT_DATE - 7) as views_7d
FROM users u
LEFT JOIN platform_connections pc ON pc.user_id = u.id AND pc.is_active = true
LEFT JOIN analytics a ON a.connection_id = pc.id
WHERE u.id = $1
GROUP BY u.id;
```

### Get top performing content
```sql
SELECT
  c.*,
  pc.platform,
  pc.platform_username
FROM content c
JOIN platform_connections pc ON c.connection_id = pc.id
WHERE pc.user_id = $1
  AND c.published_at >= CURRENT_DATE - 7
ORDER BY c.views_count DESC
LIMIT 5;
```

### Get revenue summary
```sql
SELECT
  DATE_TRUNC('month', period_start) as month,
  revenue_type,
  SUM(amount) as total_amount,
  currency
FROM revenue
WHERE user_id = $1
  AND period_start >= CURRENT_DATE - INTERVAL '6 months'
GROUP BY month, revenue_type, currency
ORDER BY month DESC;
```

## Indexes for Performance

```sql
-- Analytics time-series queries
CREATE INDEX idx_analytics_time_series ON analytics(connection_id, date DESC, metric_type);

-- Content performance queries
CREATE INDEX idx_content_performance ON content(connection_id, published_at DESC, views_count DESC);

-- Calendar upcoming events
CREATE INDEX idx_calendar_upcoming ON calendar_events(user_id, status, scheduled_at)
WHERE status IN ('draft', 'scheduled');

-- Revenue reporting
CREATE INDEX idx_revenue_reporting ON revenue(user_id, period_start DESC, period_end DESC);
```

## Row Level Security (RLS) for Supabase

```sql
-- Enable RLS
ALTER TABLE platform_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue ENABLE ROW LEVEL SECURITY;
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;

-- Policies (example for platform_connections)
CREATE POLICY "Users can view own platform connections"
  ON platform_connections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own platform connections"
  ON platform_connections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own platform connections"
  ON platform_connections FOR UPDATE
  USING (auth.uid() = user_id);
```

## Migration Strategy

1. **Week 1-2**: Core tables (users, platform_connections, subscriptions)
2. **Week 3-4**: Analytics and content tracking
3. **Week 5-6**: Calendar and revenue
4. **Week 7-8**: Insights and optimization

## Estimated Storage

- **1,000 users**: ~500MB
- **10,000 users**: ~5GB
- **100,000 users**: ~50GB

Supabase free tier: 500MB (good for beta)
Pro tier ($25/mo): 8GB (good for 10K users)
