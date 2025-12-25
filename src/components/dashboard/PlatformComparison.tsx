'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Youtube, Twitch } from 'lucide-react'
import { YouTubeStats, TwitchStats } from '@/lib/mock-data'

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

interface MetricRowProps {
  label: string
  youtube: number
  twitch: number
  format?: 'number' | 'currency' | 'hours'
}

function MetricRow({ label, youtube, twitch, format = 'number' }: MetricRowProps) {
  const total = youtube + twitch
  const youtubePercent = total > 0 ? (youtube / total) * 100 : 50
  const twitchPercent = total > 0 ? (twitch / total) * 100 : 50

  const formatValue = (val: number): string => {
    if (format === 'currency') return `$${formatNumber(val)}`
    if (format === 'hours') return `${val}h`
    return formatNumber(val)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <div className="flex items-center gap-4">
          <span className="text-red-500 font-medium">{formatValue(youtube)}</span>
          <span className="text-purple-500 font-medium">{formatValue(twitch)}</span>
        </div>
      </div>
      <div className="flex h-2 rounded-full overflow-hidden bg-muted">
        <div
          className="bg-red-500 transition-all"
          style={{ width: `${youtubePercent}%` }}
        />
        <div
          className="bg-purple-500 transition-all"
          style={{ width: `${twitchPercent}%` }}
        />
      </div>
    </div>
  )
}

interface PlatformComparisonProps {
  youtubeStats?: YouTubeStats
  twitchStats?: TwitchStats
}

export default function PlatformComparison({ youtubeStats, twitchStats }: PlatformComparisonProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Comparaison Plateformes</CardTitle>
        <div className="flex items-center gap-4 text-sm mt-2">
          <div className="flex items-center gap-2">
            <Youtube className="h-4 w-4 text-red-500" />
            <span>YouTube</span>
          </div>
          <div className="flex items-center gap-2">
            <Twitch className="h-4 w-4 text-purple-500" />
            <span>Twitch</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <MetricRow
          label="Abonnés / Followers"
          youtube={youtubeStats?.subscribers || 0}
          twitch={twitchStats?.followers || 0}
        />
        <MetricRow
          label="Vues (30 jours)"
          youtube={youtubeStats?.viewsLast30Days || 0}
          twitch={twitchStats?.viewsLast30Days || 0}
        />
        <MetricRow
          label="Revenus estimés"
          youtube={youtubeStats?.estimatedRevenue || 0}
          twitch={twitchStats?.estimatedRevenue || 0}
          format="currency"
        />
      </CardContent>
    </Card>
  )
}
