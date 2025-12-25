'use client'

import { useEffect, useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
import { Youtube, Twitch, Users, Clock, Globe, TrendingUp } from 'lucide-react'

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
        <p className="font-medium text-sm mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-medium">{entry.value.toLocaleString('fr-FR')}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default function AnalyticsPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('30d')
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, userRes] = await Promise.all([
          fetch(`/api/analytics?period=${period}`),
          fetch('/api/user')
        ])
        const analyticsData = await analyticsRes.json()
        const userData = await userRes.json()
        setData(analyticsData)
        setUser(userData)
      } catch (error) {
        console.error('Error fetching analytics:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [period])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar user={null} />
        <main className="lg:pl-[260px] p-6">
          <div className="space-y-6">
            <Skeleton className="h-8 w-48" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-64" />
              ))}
            </div>
          </div>
        </main>
      </div>
    )
  }

  const { dailyData, demographics, bestPostingTimes, revenue } = data || {}

  return (
    <div className="min-h-screen bg-background">
      <Sidebar user={user} />
      
      <main className="lg:pl-[260px] p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
              <p className="text-muted-foreground">Analyse détaillée de vos performances</p>
            </div>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 derniers jours</SelectItem>
                <SelectItem value="14d">14 derniers jours</SelectItem>
                <SelectItem value="30d">30 derniers jours</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Main Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Évolution des Vues</CardTitle>
              <CardDescription>Comparaison YouTube vs Twitch</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorYt" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorTw" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="dateLabel" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area type="monotone" dataKey="youtube" name="YouTube" stroke="#ef4444" strokeWidth={2} fill="url(#colorYt)" />
                    <Area type="monotone" dataKey="twitch" name="Twitch" stroke="#8b5cf6" strokeWidth={2} fill="url(#colorTw)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Demographics & Best Times */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Age Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Répartition par Âge
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={demographics?.ageGroups || []}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={4}
                        dataKey="percentage"
                        nameKey="range"
                      >
                        {(demographics?.ageGroups || []).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  {(demographics?.ageGroups || []).map((item, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      <div className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: COLORS[idx] }} />
                      {item.range}: {item.percentage}%
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Countries */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Top Pays
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(demographics?.topCountries || []).map((country, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <span>{country.flag}</span>
                        <span>{country.country}</span>
                      </span>
                      <span className="font-medium">{country.percentage}%</span>
                    </div>
                    <Progress value={country.percentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Best Posting Times */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Meilleurs Horaires
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="youtube">
                  <TabsList className="w-full mb-3">
                    <TabsTrigger value="youtube" className="flex-1 text-xs">
                      <Youtube className="h-3 w-3 mr-1 text-red-500" /> YouTube
                    </TabsTrigger>
                    <TabsTrigger value="twitch" className="flex-1 text-xs">
                      <Twitch className="h-3 w-3 mr-1 text-purple-500" /> Twitch
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="youtube" className="space-y-2">
                    {(bestPostingTimes?.youtube || []).map((time, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                        <span className="text-sm">{time.day} {time.time}</span>
                        <Badge variant={idx === 0 ? "default" : "secondary"} className="text-xs">
                          {time.score}% optimal
                        </Badge>
                      </div>
                    ))}
                  </TabsContent>
                  <TabsContent value="twitch" className="space-y-2">
                    {(bestPostingTimes?.twitch || []).map((time, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                        <span className="text-sm">{time.day} {time.time}</span>
                        <Badge variant={idx === 0 ? "default" : "secondary"} className="text-xs">
                          {time.score}% optimal
                        </Badge>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Répartition des Revenus</CardTitle>
              <CardDescription>Sources de revenus par plateforme</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* YouTube Revenue */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Youtube className="h-5 w-5 text-red-500" />
                    <span className="font-medium">YouTube</span>
                    <Badge variant="outline" className="ml-auto">$3,420 total</Badge>
                  </div>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenue?.youtube || []} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-muted" />
                        <XAxis type="number" tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
                        <YAxis type="category" dataKey="source" tick={{ fontSize: 12 }} width={80} />
                        <Tooltip formatter={(v) => `$${v}`} />
                        <Bar dataKey="amount" fill="#ef4444" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Twitch Revenue */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Twitch className="h-5 w-5 text-purple-500" />
                    <span className="font-medium">Twitch</span>
                    <Badge variant="outline" className="ml-auto">$2,680 total</Badge>
                  </div>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenue?.twitch || []} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-muted" />
                        <XAxis type="number" tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
                        <YAxis type="category" dataKey="source" tick={{ fontSize: 12 }} width={80} />
                        <Tooltip formatter={(v) => `$${v}`} />
                        <Bar dataKey="amount" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
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
