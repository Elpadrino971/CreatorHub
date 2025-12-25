# CreatorHub - Platform API Integrations

Complete guide for integrating YouTube, Twitch, TikTok, and Instagram APIs.

## Overview

Each platform integration follows this pattern:
1. **OAuth Flow**: User authorizes access
2. **Token Storage**: Encrypted tokens in database
3. **Data Fetching**: Periodic sync jobs
4. **Rate Limiting**: Respect API quotas
5. **Error Handling**: Graceful degradation

## 1. YouTube Data API v3

### Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project "CreatorHub"
3. Enable YouTube Data API v3
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs: `https://yourdomain.com/api/auth/youtube/callback`

### OAuth Scopes
```
https://www.googleapis.com/auth/youtube.readonly
https://www.googleapis.com/auth/yt-analytics.readonly
```

### Key Endpoints

#### Get Channel Stats
```http
GET https://www.googleapis.com/youtube/v3/channels
  ?part=statistics,snippet
  &mine=true
  &access_token={token}
```

Response:
```json
{
  "items": [{
    "id": "UCxxx",
    "snippet": {
      "title": "Channel Name",
      "thumbnails": { "default": { "url": "..." } }
    },
    "statistics": {
      "subscriberCount": "10000",
      "viewCount": "500000",
      "videoCount": "150"
    }
  }]
}
```

#### Get Recent Videos
```http
GET https://www.googleapis.com/youtube/v3/search
  ?part=snippet
  &forMine=true
  &type=video
  &order=date
  &maxResults=50
  &access_token={token}
```

#### Get Video Analytics
```http
GET https://youtubeanalytics.googleapis.com/v2/reports
  ?ids=channel==MINE
  &startDate=2024-01-01
  &endDate=2024-01-31
  &metrics=views,likes,comments,estimatedRevenue
  &dimensions=video
  &access_token={token}
```

### Rate Limits
- **Quota**: 10,000 units/day (free tier)
- **Cost per request**: 1-100 units
- **Strategy**: Cache data, sync every 6 hours

### Implementation

```typescript
// src/lib/integrations/youtube.ts
export async function getYouTubeChannelStats(accessToken: string) {
  const response = await fetch(
    'https://www.googleapis.com/youtube/v3/channels?' +
    new URLSearchParams({
      part: 'statistics,snippet',
      mine: 'true',
      access_token: accessToken,
    })
  );

  if (!response.ok) {
    throw new Error('Failed to fetch YouTube stats');
  }

  const data = await response.json();
  return {
    subscriberCount: parseInt(data.items[0].statistics.subscriberCount),
    viewCount: parseInt(data.items[0].statistics.viewCount),
    videoCount: parseInt(data.items[0].statistics.videoCount),
  };
}
```

---

## 2. Twitch API

### Setup
1. Go to [Twitch Developers](https://dev.twitch.tv/console)
2. Register application
3. Set redirect URI: `https://yourdomain.com/api/auth/twitch/callback`
4. Get Client ID and Client Secret

### OAuth Scopes
```
user:read:email
channel:read:subscriptions
analytics:read:extensions
analytics:read:games
```

### Key Endpoints

#### Get User Info
```http
GET https://api.twitch.tv/helix/users
  Authorization: Bearer {access_token}
  Client-Id: {client_id}
```

#### Get Channel Info
```http
GET https://api.twitch.tv/helix/channels?broadcaster_id={user_id}
  Authorization: Bearer {access_token}
  Client-Id: {client_id}
```

#### Get Stream Analytics
```http
GET https://api.twitch.tv/helix/analytics/extensions
  ?extension_id={extension_id}
  &started_at=2024-01-01T00:00:00Z
  &ended_at=2024-01-31T23:59:59Z
  Authorization: Bearer {access_token}
  Client-Id: {client_id}
```

#### Get Followers
```http
GET https://api.twitch.tv/helix/channels/followers
  ?broadcaster_id={user_id}
  Authorization: Bearer {access_token}
  Client-Id: {client_id}
```

### Rate Limits
- **Default**: 800 requests/minute
- **Strategy**: Batch requests, cache aggressively

### Implementation

```typescript
// src/lib/integrations/twitch.ts
export async function getTwitchChannelStats(
  accessToken: string,
  clientId: string,
  userId: string
) {
  const response = await fetch(
    `https://api.twitch.tv/helix/channels?broadcaster_id=${userId}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Client-Id': clientId,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch Twitch stats');
  }

  const data = await response.json();
  return data.data[0];
}
```

---

## 3. TikTok Business API

### Setup
1. Go to [TikTok for Developers](https://developers.tiktok.com)
2. Create app in Business API section
3. Request "Display API" and "Research API" access
4. Set redirect URI: `https://yourdomain.com/api/auth/tiktok/callback`

### OAuth Scopes
```
user.info.basic
video.list
video.insights
```

### Key Endpoints

#### Get User Info
```http
GET https://open.tiktokapis.com/v2/user/info/
  ?fields=open_id,union_id,avatar_url,display_name,follower_count,following_count,likes_count,video_count
  Authorization: Bearer {access_token}
```

#### Get Videos
```http
POST https://open.tiktokapis.com/v2/video/list/
  Content-Type: application/json
  Authorization: Bearer {access_token}

  {
    "max_count": 20,
    "cursor": 0,
    "fields": [
      "id",
      "create_time",
      "cover_image_url",
      "share_url",
      "video_description",
      "duration",
      "view_count",
      "like_count",
      "comment_count",
      "share_count"
    ]
  }
```

### Rate Limits
- **Default**: Varies by endpoint
- **Strategy**: Request rate limit headers, implement backoff

### Implementation

```typescript
// src/lib/integrations/tiktok.ts
export async function getTikTokUserStats(accessToken: string) {
  const response = await fetch(
    'https://open.tiktokapis.com/v2/user/info/?' +
    new URLSearchParams({
      fields: 'follower_count,video_count,likes_count',
    }),
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch TikTok stats');
  }

  const data = await response.json();
  return data.data.user;
}
```

---

## 4. Instagram Graph API

### Setup
1. Go to [Meta for Developers](https://developers.facebook.com)
2. Create Facebook App
3. Add Instagram Graph API product
4. Configure Instagram Basic Display
5. Set redirect URI: `https://yourdomain.com/api/auth/instagram/callback`

### OAuth Scopes
```
instagram_basic
instagram_content_publish
pages_show_list
pages_read_engagement
instagram_manage_insights
```

### Key Endpoints

#### Get Account Info
```http
GET https://graph.instagram.com/me
  ?fields=id,username,account_type,media_count
  &access_token={access_token}
```

#### Get Media Insights
```http
GET https://graph.instagram.com/{media_id}/insights
  ?metric=engagement,impressions,reach,saved
  &access_token={access_token}
```

#### Get Account Insights
```http
GET https://graph.instagram.com/{ig_user_id}/insights
  ?metric=follower_count,impressions,reach,profile_views
  &period=day
  &since={timestamp}
  &until={timestamp}
  &access_token={access_token}
```

### Rate Limits
- **Default**: 200 calls/hour per user
- **Strategy**: Batch requests where possible

### Implementation

```typescript
// src/lib/integrations/instagram.ts
export async function getInstagramAccountStats(accessToken: string) {
  const response = await fetch(
    'https://graph.instagram.com/me?' +
    new URLSearchParams({
      fields: 'id,username,media_count',
      access_token: accessToken,
    })
  );

  if (!response.ok) {
    throw new Error('Failed to fetch Instagram stats');
  }

  return await response.json();
}
```

---

## Token Management

### Refresh Token Strategy

All platforms require periodic token refresh:

```typescript
// src/lib/auth/refresh-tokens.ts
export async function refreshPlatformToken(
  platform: 'youtube' | 'twitch' | 'tiktok' | 'instagram',
  refreshToken: string
): Promise<{ accessToken: string; expiresAt: Date }> {
  switch (platform) {
    case 'youtube':
      return refreshYouTubeToken(refreshToken);
    case 'twitch':
      return refreshTwitchToken(refreshToken);
    case 'tiktok':
      return refreshTikTokToken(refreshToken);
    case 'instagram':
      return refreshInstagramToken(refreshToken);
  }
}
```

### Token Encryption

Store tokens encrypted in database:

```typescript
import { createCipheriv, createDecipheriv } from 'crypto';

const ENCRYPTION_KEY = process.env.TOKEN_ENCRYPTION_KEY!; // 32 bytes
const IV_LENGTH = 16;

export function encryptToken(token: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(token);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decryptToken(encryptedToken: string): string {
  const parts = encryptedToken.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encrypted = Buffer.from(parts[1], 'hex');
  const decipher = createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
```

---

## Data Sync Jobs

### Background Sync with Cron

```typescript
// src/app/api/cron/sync-analytics/route.ts
import { db } from '@/lib/db';
import { syncYouTubeAnalytics } from '@/lib/sync/youtube';
import { syncTwitchAnalytics } from '@/lib/sync/twitch';

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Get all active connections
  const connections = await db.platformConnection.findMany({
    where: { isActive: true },
  });

  // Sync each platform
  for (const connection of connections) {
    try {
      switch (connection.platform) {
        case 'YOUTUBE':
          await syncYouTubeAnalytics(connection);
          break;
        case 'TWITCH':
          await syncTwitchAnalytics(connection);
          break;
        // ... other platforms
      }

      // Update last synced timestamp
      await db.platformConnection.update({
        where: { id: connection.id },
        data: { lastSyncedAt: new Date() },
      });
    } catch (error) {
      console.error(`Sync failed for ${connection.platform}:`, error);
    }
  }

  return Response.json({ success: true });
}
```

### Vercel Cron Configuration

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/sync-analytics",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

---

## Error Handling

### Common Errors

1. **Token Expired**: Refresh token automatically
2. **Rate Limit**: Implement exponential backoff
3. **API Down**: Queue for retry
4. **Invalid Scope**: Prompt user to re-authorize

```typescript
// src/lib/integrations/error-handler.ts
export async function handleAPIError(
  error: any,
  connectionId: string,
  retryFn: () => Promise<any>
) {
  if (error.status === 401) {
    // Token expired - refresh and retry
    await refreshConnectionToken(connectionId);
    return retryFn();
  }

  if (error.status === 429) {
    // Rate limited - wait and retry
    const retryAfter = parseInt(error.headers.get('Retry-After') || '60');
    await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
    return retryFn();
  }

  if (error.status >= 500) {
    // Server error - queue for retry
    await queueForRetry(connectionId, retryFn);
    throw error;
  }

  // Unrecoverable error
  throw error;
}
```

---

## Testing

### Mock API Responses

```typescript
// src/lib/integrations/__mocks__/youtube.ts
export const mockYouTubeChannelStats = {
  subscriberCount: 10000,
  viewCount: 500000,
  videoCount: 150,
};

export function getYouTubeChannelStats() {
  return Promise.resolve(mockYouTubeChannelStats);
}
```

### Integration Tests

```typescript
// src/lib/integrations/__tests__/youtube.test.ts
import { getYouTubeChannelStats } from '../youtube';

describe('YouTube Integration', () => {
  it('should fetch channel stats', async () => {
    const stats = await getYouTubeChannelStats('mock_token');
    expect(stats.subscriberCount).toBeGreaterThan(0);
  });
});
```

---

## Security Best Practices

1. **Never log tokens** - Sanitize logs
2. **Encrypt at rest** - Use AES-256 encryption
3. **Use HTTPS only** - For OAuth redirects
4. **Validate redirect URIs** - Prevent token theft
5. **Implement PKCE** - For OAuth flows
6. **Rotate secrets** - Regular key rotation
7. **Audit access** - Log all API calls

---

## Next Steps

1. Implement OAuth flows for each platform
2. Create background sync jobs
3. Build analytics aggregation system
4. Add real-time webhook support (where available)
5. Implement comprehensive error monitoring
