'use client'

import { useEffect, useState } from 'react'
import StatsCard from '@/components/dashboard/StatsCard'
import AnalyticsChart from '@/components/dashboard/AnalyticsChart'
import TopContent from '@/components/dashboard/TopContent'
import PlatformComparison from '@/components/dashboard/PlatformComparison'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Users, Eye, DollarSign, TrendingUp, Youtube, Twitch, RefreshCw } from 'lucide-react'
import type { User, YouTubeStats, TwitchStats, CombinedStats, DailyAnalytics, YouTubeVideo, TwitchStream } from '@/lib/mock-data'

interface DashboardData {
  user: User
  stats: {
    combined: CombinedStats
    youtube: YouTubeStats
    twitch: TwitchStats
  }
  recentAnalytics: DailyAnalytics[]
  topContent: {
    youtube: YouTubeVideo[]
    twitch: TwitchStream[]
  }
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchDashboard = async (showToast = false) => {
    try {
      if (showToast) setRefreshing(true)
      const response = await fetch('/api/dashboard')
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('Error fetching dashboard:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-[400px]" />
        </div>
      </div>
    )
  }

  const { user, stats, recentAnalytics, topContent } = data || {}

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Bienvenue, {user?.name} ! Voici vos stats du jour.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Données à jour
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchDashboard(true)}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Abonnés"
            value={stats?.combined?.totalFollowers || 0}
            change={stats?.combined?.totalFollowersGrowth || 0}
            icon={Users}
            iconColor="text-primary"
          />
          <StatsCard
            title="Vues (30 jours)"
            value={stats?.combined?.totalViews30Days || 0}
            change={stats?.combined?.totalViewsGrowth || 0}
            icon={Eye}
            iconColor="text-blue-500"
          />
          <StatsCard
            title="Revenus Estimés"
            value={stats?.combined?.totalRevenue || 0}
            change={stats?.combined?.totalRevenueGrowth || 0}
            icon={DollarSign}
            iconColor="text-green-500"
            format="currency"
          />
          <StatsCard
            title="Engagement"
            value={stats?.combined?.engagementRate || 0}
            change={stats?.combined?.engagementGrowth || 0}
            icon={TrendingUp}
            iconColor="text-orange-500"
            format="percent"
          />
        </div>

        {/* Platform Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-red-500/20 bg-red-500/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/10">
                  <Youtube className="h-6 w-6 text-red-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">YouTube</p>
                  <p className="text-xl font-bold">
                    {((stats?.youtube?.subscribers || 0) / 1000).toFixed(1)}K abonnés
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-500 font-medium">
                    +{stats?.youtube?.subscribersGrowth}%
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {stats?.youtube?.videosLast30Days} vidéos ce mois
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-purple-500/20 bg-purple-500/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Twitch className="h-6 w-6 text-purple-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Twitch</p>
                  <p className="text-xl font-bold">
                    {((stats?.twitch?.followers || 0) / 1000).toFixed(1)}K followers
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-500 font-medium">
                    +{stats?.twitch?.followersGrowth}%
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {stats?.twitch?.hoursStreamed}h streamées
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts & Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AnalyticsChart data={recentAnalytics || []} />
          </div>
          <div>
            <PlatformComparison
              youtubeStats={stats?.youtube}
              twitchStats={stats?.twitch}
            />
          </div>
        </div>

        {/* Top Content */}
        <TopContent
          youtubeVideos={topContent?.youtube || []}
          twitchStreams={topContent?.twitch || []}
        />
      </div>
    </div>
  )
}
