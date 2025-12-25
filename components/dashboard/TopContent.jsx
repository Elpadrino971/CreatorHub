'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Youtube, Twitch, Eye, ThumbsUp, MessageSquare, Users, DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'

const formatNumber = (num) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

function VideoCard({ video, platform }) {
  return (
    <div className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="relative w-32 h-18 flex-shrink-0">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover rounded-md"
        />
        {video.duration && (
          <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
            {video.duration}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm line-clamp-2 mb-1">{video.title}</h4>
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {formatNumber(platform === 'youtube' ? video.views : video.peakViewers)}
          </span>
          {platform === 'youtube' ? (
            <>
              <span className="flex items-center gap-1">
                <ThumbsUp className="h-3 w-3" />
                {formatNumber(video.likes)}
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                {formatNumber(video.comments)}
              </span>
            </>
          ) : (
            <>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {formatNumber(video.avgViewers)} moy.
              </span>
              <Badge variant="secondary" className="text-xs">
                {video.category}
              </Badge>
            </>
          )}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-muted-foreground">
            {platform === 'youtube' ? video.publishedAt : video.date}
          </span>
          <Badge variant="outline" className="text-xs text-green-600">
            <DollarSign className="h-3 w-3 mr-0.5" />
            {video.revenue}$
          </Badge>
        </div>
      </div>
    </div>
  )
}

export default function TopContent({ youtubeVideos = [], twitchStreams = [] }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Top Contenu de la Semaine</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="youtube">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="youtube" className="flex-1 gap-2">
              <Youtube className="h-4 w-4 text-red-500" />
              YouTube
            </TabsTrigger>
            <TabsTrigger value="twitch" className="flex-1 gap-2">
              <Twitch className="h-4 w-4 text-purple-500" />
              Twitch
            </TabsTrigger>
          </TabsList>
          <TabsContent value="youtube" className="space-y-2 mt-0">
            {youtubeVideos.map((video) => (
              <VideoCard key={video.id} video={video} platform="youtube" />
            ))}
          </TabsContent>
          <TabsContent value="twitch" className="space-y-2 mt-0">
            {twitchStreams.map((stream) => (
              <VideoCard key={stream.id} video={stream} platform="twitch" />
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
