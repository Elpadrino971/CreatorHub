'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import AnalyticsChart from '@/components/dashboard/AnalyticsChart'
import { Skeleton } from '@/components/ui/skeleton'
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
  Legend
} from 'recharts'
import type { DailyAnalytics } from '@/lib/mock-data'

interface AnalyticsData {
  dailyAnalytics: DailyAnalytics[]
  demographics: {
    ageGroups: Array<{ range: string; percentage: number }>
    topCountries: Array<{ country: string; percentage: number; flag: string }>
  }
  bestPostingTimes: {
    youtube: Array<{ day: string; time: string; score: number }>
    twitch: Array<{ day: string; time: string; score: number }>
  }
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/analytics')
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[400px]" />
      </div>
    )
  }

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics Détaillées</h1>
        <p className="text-muted-foreground">Analyse approfondie de vos performances</p>
      </div>

      {/* Charts principaux */}
      <div className="grid gap-6">
        <AnalyticsChart
          data={data?.dailyAnalytics || []}
          title="Évolution des vues (30 derniers jours)"
        />
      </div>

      {/* Demographics & Best Times */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Age Groups */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition par âge</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.demographics.ageGroups}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ range, percentage }) => `${range}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="percentage"
                  >
                    {data?.demographics.ageGroups.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Countries */}
        <Card>
          <CardHeader>
            <CardTitle>Top Pays</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data?.demographics.topCountries.map((country, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-2xl">{country.flag}</span>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{country.country}</span>
                      <span className="text-sm text-muted-foreground">{country.percentage}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${country.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Best Posting Times */}
      <Tabs defaultValue="youtube" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="youtube">YouTube</TabsTrigger>
          <TabsTrigger value="twitch">Twitch</TabsTrigger>
        </TabsList>
        <TabsContent value="youtube" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Meilleurs horaires de publication YouTube</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.bestPostingTimes.youtube}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="score" fill="#ef4444" name="Score d'engagement" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="twitch" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Meilleurs horaires de stream Twitch</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.bestPostingTimes.twitch}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="score" fill="#8b5cf6" name="Score d'audience" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
