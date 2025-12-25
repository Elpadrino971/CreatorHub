import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs'
import {
  MOCK_USER,
  MOCK_PLATFORMS,
  MOCK_YOUTUBE_STATS,
  MOCK_TWITCH_STATS,
  MOCK_COMBINED_STATS,
  MOCK_DAILY_ANALYTICS,
  MOCK_TOP_YOUTUBE_VIDEOS,
  MOCK_TOP_TWITCH_STREAMS
} from '@/lib/mock-data'

// This will be replaced with real Prisma queries when ready
const USE_MOCK_DATA = process.env.USE_MOCK_DATA !== 'false'

export async function GET(request: Request) {
  try {
    // Check authentication
    const clerkUser = await currentUser()
    if (!clerkUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (USE_MOCK_DATA) {
      // Return mock data for MVP demo
      return NextResponse.json({
        user: {
          ...MOCK_USER,
          name: `${clerkUser.firstName} ${clerkUser.lastName}`.trim() || MOCK_USER.name,
          email: clerkUser.emailAddresses[0].emailAddress,
          avatar: clerkUser.imageUrl
        },
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
      })
    }

    // TODO: Replace with real Prisma queries
    // const user = await db.user.findUnique({
    //   where: { clerkId: clerkUser.id },
    //   include: {
    //     platformConnections: true,
    //     analytics: { ... },
    //     content: { ... }
    //   }
    // })

    return NextResponse.json({ error: 'Real data not implemented yet' }, { status: 501 })
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
