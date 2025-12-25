'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Youtube, Twitch, Eye, ThumbsUp, MessageSquare, Users, DollarSign } from 'lucide-react'
import { YouTubeVideo, TwitchStream } from '@/lib/mock-data'

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

interface VideoCardProps {
  video: YouTubeVideo | TwitchStream
  platform: 'youtube' | 'twitch'
}

function VideoCard({ video, platform }: VideoCardProps) {
  const isYoutube = platform === 'youtube'
  const ytVideo = isYoutube ? video as YouTubeVideo : null
  const twitchStream = !isYoutube ? video as TwitchStream : null

  return (
    <div className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="relative w-32 h-18 flex-shrink-0">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover rounded-md"
        />
        {('duration' in video) && (
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
            {formatNumber(isYoutube ? (ytVideo?.views || 0) : (twitchStream?.peakViewers || 0))}
          </span>
          {isYoutube ? (
            <>
              <span className="flex items-center gap-1">
                <ThumbsUp className="h-3 w-3" />
                {formatNumber(ytVideo?.likes || 0)}
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                {formatNumber(ytVideo?.comments || 0)}
              </span>
            </>
          ) : (
            <>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {formatNumber(twitchStream?.avgViewers || 0)} moy.
              </span>
              <Badge variant="secondary" className="text-xs">
                {twitchStream?.category}
              </Badge>
            </>
          )}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-muted-foreground">
            {isYoutube ? ytVideo?.publishedAt : twitchStream?.date}
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

interface TopContentProps {
  youtubeVideos?: YouTubeVideo[]
  twitchStreams?: TwitchStream[]
}

export default function TopContent({ youtubeVideos = [], twitchStreams = [] }: TopContentProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Top Contenu de la Semaine</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="youtube" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="youtube" className="gap-2">
              <Youtube className="h-4 w-4" />
              YouTube
            </TabsTrigger>
            <TabsTrigger value="twitch" className="gap-2">
              <Twitch className="h-4 w-4" />
              Twitch
            </TabsTrigger>
          </TabsList>
          <TabsContent value="youtube" className="space-y-2 mt-4">
            {youtubeVideos.length > 0 ? (
              youtubeVideos.map((video) => (
                <VideoCard key={video.id} video={video} platform="youtube" />
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                Aucune vidéo disponible
              </p>
            )}
          </TabsContent>
          <TabsContent value="twitch" className="space-y-2 mt-4">
            {twitchStreams.length > 0 ? (
              twitchStreams.map((stream) => (
                <VideoCard key={stream.id} video={stream} platform="twitch" />
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                Aucun stream disponible
              </p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
