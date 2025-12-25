import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs'
import {
  MOCK_YOUTUBE_STATS,
  MOCK_TWITCH_STATS,
  MOCK_REVENUE_BREAKDOWN
} from '@/lib/mock-data'

const USE_MOCK_DATA = process.env.USE_MOCK_DATA !== 'false'

// Generate monthly revenue data
const generateMonthlyRevenue = () => {
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin']
  return months.map((month, i) => ({
    month,
    youtube: Math.round((2000 + i * 200 + Math.random() * 500)),
    twitch: Math.round((1500 + i * 150 + Math.random() * 400)),
    total: 0
  })).map(item => ({
    ...item,
    total: item.youtube + item.twitch
  }))
}

export async function GET(request: Request) {
  try {
    const clerkUser = await currentUser()
    if (!clerkUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (USE_MOCK_DATA) {
      const totalRevenue = MOCK_YOUTUBE_STATS.estimatedRevenue + MOCK_TWITCH_STATS.estimatedRevenue
      const totalRevenueGrowth = (MOCK_YOUTUBE_STATS.revenueGrowth + MOCK_TWITCH_STATS.revenueGrowth) / 2

      return NextResponse.json({
        totalRevenue,
        totalRevenueGrowth,
        youtubeRevenue: MOCK_YOUTUBE_STATS.estimatedRevenue,
        twitchRevenue: MOCK_TWITCH_STATS.estimatedRevenue,
        revenueBreakdown: MOCK_REVENUE_BREAKDOWN,
        monthlyRevenue: generateMonthlyRevenue()
      })
    }

    // TODO: Replace with real Prisma queries
    return NextResponse.json({ error: 'Real data not implemented yet' }, { status: 501 })
  } catch (error) {
    console.error('Revenue API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
