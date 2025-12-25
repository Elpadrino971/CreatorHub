'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import StatsCard from '@/components/dashboard/StatsCard'
import { DollarSign, TrendingUp, Youtube, Twitch } from 'lucide-react'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line
} from 'recharts'

interface RevenueData {
  totalRevenue: number
  totalRevenueGrowth: number
  youtubeRevenue: number
  twitchRevenue: number
  revenueBreakdown: {
    youtube: Array<{ source: string; amount: number; percentage: number }>
    twitch: Array<{ source: string; amount: number; percentage: number }>
  }
  monthlyRevenue: Array<{ month: string; youtube: number; twitch: number; total: number }>
}

export default function RevenuePage() {
  const [data, setData] = useState<RevenueData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/revenue')
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    )
  }

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b']

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Revenus</h1>
        <p className="text-muted-foreground">Suivi de vos revenus multi-plateformes</p>
      </div>

      {/* Stats Cards */}
      <div className="grid lg:grid-cols-3 gap-4">
        <StatsCard
          title="Revenu Total"
          value={data?.totalRevenue || 0}
          change={data?.totalRevenueGrowth || 0}
          icon={DollarSign}
          iconColor="text-green-500"
          format="currency"
        />
        <Card className="border-red-500/20 bg-red-500/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">YouTube</p>
                <p className="text-2xl font-bold">
                  ${(data?.youtubeRevenue || 0).toLocaleString()}
                </p>
              </div>
              <Youtube className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-purple-500/20 bg-purple-500/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Twitch</p>
                <p className="text-2xl font-bold">
                  ${(data?.twitchRevenue || 0).toLocaleString()}
                </p>
              </div>
              <Twitch className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Évolution mensuelle des revenus</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="youtube"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="YouTube"
                />
                <Line
                  type="monotone"
                  dataKey="twitch"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  name="Twitch"
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#10b981"
                  strokeWidth={3}
                  name="Total"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Breakdown */}
      <Tabs defaultValue="youtube" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="youtube">YouTube</TabsTrigger>
          <TabsTrigger value="twitch">Twitch</TabsTrigger>
        </TabsList>

        <TabsContent value="youtube" className="mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Répartition YouTube</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data?.revenueBreakdown.youtube}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ source, percentage }) => `${source}: ${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="amount"
                      >
                        {data?.revenueBreakdown.youtube.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Détail par source</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data?.revenueBreakdown.youtube.map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[i % COLORS.length] }}
                        />
                        <span className="font-medium">{item.source}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${item.amount.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">{item.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="twitch" className="mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Répartition Twitch</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data?.revenueBreakdown.twitch}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ source, percentage }) => `${source}: ${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="amount"
                      >
                        {data?.revenueBreakdown.twitch.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Détail par source</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data?.revenueBreakdown.twitch.map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[i % COLORS.length] }}
                        />
                        <span className="font-medium">{item.source}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${item.amount.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">{item.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
