"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { fetchYouTubeStats } from "@/app/actions/youtube"

interface ChannelStats {
  subscriberCount: number
  viewCount: number
  dailyViews: number
  monthlyViews: number
}

interface YouTubeStatsProps {
  channelIds: string[]
  className?: string
}

export function YouTubeStats({ channelIds, className }: YouTubeStatsProps) {
  const [stats, setStats] = useState<ChannelStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getChannelStats = async () => {
      try {
        setLoading(true)
        setError(null)

        const combinedStats = await fetchYouTubeStats(channelIds)

        if (!combinedStats) {
          throw new Error("Failed to fetch YouTube stats")
        }

        setStats(combinedStats)
      } catch (err) {
        console.error("Error fetching YouTube stats:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch YouTube stats")
      } finally {
        setLoading(false)
      }
    }

    getChannelStats()

    // Set up interval to refresh stats less frequently to avoid rate limiting
    // Refresh every 30 minutes instead of 5 minutes
    const intervalId = setInterval(getChannelStats, 30 * 60 * 1000)

    return () => clearInterval(intervalId)
  }, [channelIds])

  // Format numbers with commas
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  if (loading) {
    return (
      <div className={`flex items-center justify-center py-4 ${className}`}>
        <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" />
        <span>Loading YouTube stats...</span>
      </div>
    )
  }

  if (error) {
    return <div className={`text-sm text-muted-foreground ${className}`}>Unable to load YouTube stats: {error}</div>
  }

  if (!stats) {
    return null
  }

  return (
    <div className={className}>
      <Card className="bg-muted/50">
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{formatNumber(stats.subscriberCount)}</div>
            <div className="text-sm text-muted-foreground">Subscribers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{formatNumber(stats.viewCount)}</div>
            <div className="text-sm text-muted-foreground">Total Views</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{formatNumber(stats.dailyViews)}</div>
            <div className="text-sm text-muted-foreground">Daily Views</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{formatNumber(stats.monthlyViews)}</div>
            <div className="text-sm text-muted-foreground">Monthly Views</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
