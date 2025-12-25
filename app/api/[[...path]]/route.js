import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'
import {
  MOCK_USER,
  MOCK_PLATFORMS,
  MOCK_YOUTUBE_STATS,
  MOCK_TWITCH_STATS,
  MOCK_COMBINED_STATS,
  MOCK_DAILY_ANALYTICS,
  MOCK_TOP_YOUTUBE_VIDEOS,
  MOCK_TOP_TWITCH_STREAMS,
  MOCK_BEST_POSTING_TIMES,
  MOCK_AUDIENCE_DEMOGRAPHICS,
  MOCK_REVENUE_BREAKDOWN,
  PRICING_PLANS
} from '@/lib/mock-data'

// MongoDB connection
let client
let db

async function connectToMongo() {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URL)
    await client.connect()
    db = client.db(process.env.DB_NAME)
  }
  return db
}

// Helper function to handle CORS
function handleCORS(response) {
  response.headers.set('Access-Control-Allow-Origin', process.env.CORS_ORIGINS || '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  return response
}

// OPTIONS handler for CORS
export async function OPTIONS() {
  return handleCORS(new NextResponse(null, { status: 200 }))
}

// Route handler function
async function handleRoute(request, { params }) {
  const { path = [] } = params
  const route = `/${path.join('/')}`
  const method = request.method

  try {
    // Root endpoint
    if ((route === '/' || route === '/root') && method === 'GET') {
      return handleCORS(NextResponse.json({ 
        message: "CreatorHub API v1.0",
        status: "operational",
        timestamp: new Date().toISOString()
      }))
    }

    // ==================== USER ENDPOINTS ====================
    
    // GET /api/user - Get current user
    if (route === '/user' && method === 'GET') {
      return handleCORS(NextResponse.json(MOCK_USER))
    }

    // ==================== DASHBOARD ENDPOINTS ====================
    
    // GET /api/dashboard - Get dashboard overview data
    if (route === '/dashboard' && method === 'GET') {
      return handleCORS(NextResponse.json({
        user: MOCK_USER,
        platforms: MOCK_PLATFORMS,
        stats: {
          combined: MOCK_COMBINED_STATS,
          youtube: MOCK_YOUTUBE_STATS,
          twitch: MOCK_TWITCH_STATS
        },
        recentAnalytics: MOCK_DAILY_ANALYTICS.slice(-7),
        topContent: {
          youtube: MOCK_TOP_YOUTUBE_VIDEOS.slice(0, 3),
          twitch: MOCK_TOP_TWITCH_STREAMS.slice(0, 3)
        }
      }))
    }

    // ==================== ANALYTICS ENDPOINTS ====================
    
    // GET /api/analytics - Get detailed analytics
    if (route === '/analytics' && method === 'GET') {
      const url = new URL(request.url)
      const period = url.searchParams.get('period') || '30d'
      const platform = url.searchParams.get('platform') || 'all'
      
      let analytics = MOCK_DAILY_ANALYTICS
      
      // Filter by period
      if (period === '7d') {
        analytics = MOCK_DAILY_ANALYTICS.slice(-7)
      } else if (period === '14d') {
        analytics = MOCK_DAILY_ANALYTICS.slice(-14)
      }
      
      return handleCORS(NextResponse.json({
        period,
        platform,
        dailyData: analytics,
        summary: {
          combined: MOCK_COMBINED_STATS,
          youtube: MOCK_YOUTUBE_STATS,
          twitch: MOCK_TWITCH_STATS
        },
        demographics: MOCK_AUDIENCE_DEMOGRAPHICS,
        bestPostingTimes: MOCK_BEST_POSTING_TIMES,
        revenue: MOCK_REVENUE_BREAKDOWN
      }))
    }

    // GET /api/analytics/youtube - YouTube specific analytics
    if (route === '/analytics/youtube' && method === 'GET') {
      return handleCORS(NextResponse.json({
        stats: MOCK_YOUTUBE_STATS,
        topVideos: MOCK_TOP_YOUTUBE_VIDEOS,
        dailyData: MOCK_DAILY_ANALYTICS.map(d => ({
          date: d.date,
          dateLabel: d.dateLabel,
          views: d.youtube,
          revenue: d.youtubeRevenue
        })),
        bestTimes: MOCK_BEST_POSTING_TIMES.youtube,
        revenue: MOCK_REVENUE_BREAKDOWN.youtube
      }))
    }

    // GET /api/analytics/twitch - Twitch specific analytics
    if (route === '/analytics/twitch' && method === 'GET') {
      return handleCORS(NextResponse.json({
        stats: MOCK_TWITCH_STATS,
        topStreams: MOCK_TOP_TWITCH_STREAMS,
        dailyData: MOCK_DAILY_ANALYTICS.map(d => ({
          date: d.date,
          dateLabel: d.dateLabel,
          views: d.twitch,
          revenue: d.twitchRevenue
        })),
        bestTimes: MOCK_BEST_POSTING_TIMES.twitch,
        revenue: MOCK_REVENUE_BREAKDOWN.twitch
      }))
    }

    // ==================== PLATFORMS ENDPOINTS ====================
    
    // GET /api/platforms - Get connected platforms
    if (route === '/platforms' && method === 'GET') {
      return handleCORS(NextResponse.json(MOCK_PLATFORMS))
    }

    // POST /api/platforms/connect - Connect a platform (mock)
    if (route === '/platforms/connect' && method === 'POST') {
      const body = await request.json()
      const { platform } = body
      
      if (!platform) {
        return handleCORS(NextResponse.json(
          { error: "Platform is required" },
          { status: 400 }
        ))
      }
      
      // In real implementation, this would initiate OAuth flow
      return handleCORS(NextResponse.json({
        success: true,
        message: `OAuth flow would start for ${platform}`,
        redirectUrl: `/api/auth/${platform}/authorize`
      }))
    }

    // DELETE /api/platforms/disconnect - Disconnect a platform
    if (route === '/platforms/disconnect' && method === 'POST') {
      const body = await request.json()
      const { platform } = body
      
      return handleCORS(NextResponse.json({
        success: true,
        message: `${platform} disconnected successfully`
      }))
    }

    // ==================== CONTENT ENDPOINTS ====================
    
    // GET /api/content/top - Get top performing content
    if (route === '/content/top' && method === 'GET') {
      const url = new URL(request.url)
      const platform = url.searchParams.get('platform') || 'all'
      const limit = parseInt(url.searchParams.get('limit') || '5')
      
      let content = []
      
      if (platform === 'youtube' || platform === 'all') {
        content = [...content, ...MOCK_TOP_YOUTUBE_VIDEOS.slice(0, limit).map(v => ({ ...v, platform: 'youtube' }))]
      }
      if (platform === 'twitch' || platform === 'all') {
        content = [...content, ...MOCK_TOP_TWITCH_STREAMS.slice(0, limit).map(s => ({ ...s, platform: 'twitch' }))]
      }
      
      return handleCORS(NextResponse.json({ content }))
    }

    // ==================== PRICING ENDPOINTS ====================
    
    // GET /api/pricing - Get pricing plans
    if (route === '/pricing' && method === 'GET') {
      return handleCORS(NextResponse.json({ plans: PRICING_PLANS }))
    }

    // ==================== AUTH ENDPOINTS (Prepared for real OAuth) ====================
    
    // These endpoints are prepared for real OAuth implementation
    // Currently return mock responses
    
    if (route === '/auth/youtube/authorize' && method === 'GET') {
      return handleCORS(NextResponse.json({
        message: "YouTube OAuth not configured yet",
        setup: {
          step1: "Create project on Google Cloud Console",
          step2: "Enable YouTube Data API v3",
          step3: "Create OAuth 2.0 credentials",
          step4: "Add YOUTUBE_CLIENT_ID and YOUTUBE_CLIENT_SECRET to .env"
        }
      }))
    }

    if (route === '/auth/twitch/authorize' && method === 'GET') {
      return handleCORS(NextResponse.json({
        message: "Twitch OAuth not configured yet",
        setup: {
          step1: "Go to dev.twitch.tv",
          step2: "Register your application",
          step3: "Add TWITCH_CLIENT_ID and TWITCH_CLIENT_SECRET to .env"
        }
      }))
    }

    // ==================== DATABASE ENDPOINTS ====================
    
    // POST /api/status - Store status check
    if (route === '/status' && method === 'POST') {
      const db = await connectToMongo()
      const body = await request.json()
      
      if (!body.client_name) {
        return handleCORS(NextResponse.json(
          { error: "client_name is required" },
          { status: 400 }
        ))
      }

      const statusObj = {
        id: uuidv4(),
        client_name: body.client_name,
        timestamp: new Date()
      }

      await db.collection('status_checks').insertOne(statusObj)
      return handleCORS(NextResponse.json(statusObj))
    }

    // GET /api/status
    if (route === '/status' && method === 'GET') {
      const db = await connectToMongo()
      const statusChecks = await db.collection('status_checks')
        .find({})
        .limit(1000)
        .toArray()

      const cleanedStatusChecks = statusChecks.map(({ _id, ...rest }) => rest)
      return handleCORS(NextResponse.json(cleanedStatusChecks))
    }

    // Route not found
    return handleCORS(NextResponse.json(
      { error: `Route ${route} not found` },
      { status: 404 }
    ))

  } catch (error) {
    console.error('API Error:', error)
    return handleCORS(NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    ))
  }
}

// Export all HTTP methods
export const GET = handleRoute
export const POST = handleRoute
export const PUT = handleRoute
export const DELETE = handleRoute
export const PATCH = handleRoute
