import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs'
import {
  MOCK_DAILY_ANALYTICS,
  MOCK_AUDIENCE_DEMOGRAPHICS,
  MOCK_BEST_POSTING_TIMES
} from '@/lib/mock-data'

const USE_MOCK_DATA = process.env.USE_MOCK_DATA !== 'false'

export async function GET(request: Request) {
  try {
    const clerkUser = await currentUser()
    if (!clerkUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (USE_MOCK_DATA) {
      return NextResponse.json({
        dailyAnalytics: MOCK_DAILY_ANALYTICS,
        demographics: MOCK_AUDIENCE_DEMOGRAPHICS,
        bestPostingTimes: MOCK_BEST_POSTING_TIMES
      })
    }

    // TODO: Replace with real Prisma queries
    return NextResponse.json({ error: 'Real data not implemented yet' }, { status: 501 })
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
