'use client'

import { useEffect, useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import {
  AreaChart,
  Area,
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
  Legend
} from 'recharts'
import { DollarSign, TrendingUp, Youtube, Twitch, ArrowUpRight, ArrowDownRight, Wallet, PiggyBank, Target } from 'lucide-react'

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']

export default function RevenuePage() {
  const [data, setData] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, userRes] = await Promise.all([
          fetch('/api/analytics'),
          fetch('/api/user')
        ])
        const analyticsData = await analyticsRes.json()
        const userData = await userRes.json()
        setData(analyticsData)
        setUser(userData)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar user={null} />
        <main className="lg:pl-[260px] p-6">
          <div className="space-y-6">
            <Skeleton className="h-8 w-48" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          </div>
        </main>
      </div>
    )
  }

  const { dailyData, revenue, summary } = data || {}
  
  const totalYouTube = revenue?.youtube?.reduce((acc, r) => acc + r.amount, 0) || 0
  const totalTwitch = revenue?.twitch?.reduce((acc, r) => acc + r.amount, 0) || 0
  const totalRevenue = totalYouTube + totalTwitch

  // Calculate monthly projection
  const avgDaily = totalRevenue / 30
  const monthlyProjection = avgDaily * 30
  const yearlyProjection = monthlyProjection * 12

  return (
    <div className="min-h-screen bg-background">
      <Sidebar user={user} />
      
      <main className="lg:pl-[260px] p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Revenus</h1>
            <p className="text-muted-foreground">Suivez et analysez vos revenus multi-plateformes</p>
          </div>

          {/* Revenue Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Revenus ce mois</p>
                    <p className="text-3xl font-bold text-green-600">${totalRevenue.toLocaleString()}</p>
                    <div className="flex items-center gap-1 mt-1 text-sm text-green-600">
                      <ArrowUpRight className="h-4 w-4" />
                      <span>+10.5% vs mois dernier</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-green-500/10">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">YouTube</p>
                    <p className="text-2xl font-bold">${totalYouTube.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {((totalYouTube / totalRevenue) * 100).toFixed(0)}% du total
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-red-500/10">
                    <Youtube className="h-6 w-6 text-red-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Twitch</p>
                    <p className="text-2xl font-bold">${totalTwitch.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {((totalTwitch / totalRevenue) * 100).toFixed(0)}% du total
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-500/10">
                    <Twitch className="h-6 w-6 text-purple-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Projection annuelle</p>
                    <p className="text-2xl font-bold">${yearlyProjection.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground mt-1">Basé sur ce mois</p>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-500/10">
                    <Target className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Évolution des Revenus</CardTitle>
              <CardDescription>Revenus quotidiens par plateforme</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorYtRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorTwRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="dateLabel" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                    <Tooltip formatter={(v) => `$${v}`} />
                    <Legend />
                    <Area type="monotone" dataKey="youtubeRevenue" name="YouTube" stroke="#ef4444" strokeWidth={2} fill="url(#colorYtRev)" />
                    <Area type="monotone" dataKey="twitchRevenue" name="Twitch" stroke="#8b5cf6" strokeWidth={2} fill="url(#colorTwRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Revenue Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* YouTube Breakdown */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Youtube className="h-5 w-5 text-red-500" />
                  <CardTitle>YouTube - Détail</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenue?.youtube?.map((item, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>{item.source}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">${item.amount}</span>
                          <Badge variant="outline" className="text-xs">{item.percentage}%</Badge>
                        </div>
                      </div>
                      <Progress value={item.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Total YouTube</span>
                    <span className="text-xl font-bold text-red-500">${totalYouTube}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Twitch Breakdown */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Twitch className="h-5 w-5 text-purple-500" />
                  <CardTitle>Twitch - Détail</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenue?.twitch?.map((item, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>{item.source}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">${item.amount}</span>
                          <Badge variant="outline" className="text-xs">{item.percentage}%</Badge>
                        </div>
                      </div>
                      <Progress value={item.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Total Twitch</span>
                    <span className="text-xl font-bold text-purple-500">${totalTwitch}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Distribution Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Distribution Globale des Revenus</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'YouTube', value: totalYouTube },
                          { name: 'Twitch', value: totalTwitch }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        <Cell fill="#ef4444" />
                        <Cell fill="#8b5cf6" />
                      </Pie>
                      <Tooltip formatter={(v) => `$${v}`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col justify-center space-y-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Wallet className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">Revenu moyen par jour</span>
                    </div>
                    <p className="text-2xl font-bold">${avgDaily.toFixed(0)}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 mb-2">
                      <PiggyBank className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">Objectif mensuel</span>
                    </div>
                    <p className="text-2xl font-bold">$10,000</p>
                    <Progress value={(totalRevenue / 10000) * 100} className="h-2 mt-2" />
                    <p className="text-sm text-muted-foreground mt-1">
                      {((totalRevenue / 10000) * 100).toFixed(0)}% atteint
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
