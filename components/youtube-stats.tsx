"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { fetchYouTubeStats } from "@/app/actions/youtube"

interface ChannelStats {
  subscriberCount: number
  viewCount: number
}

interface YouTubeStatsProps {
  channelIds: string[]
  className?: string
}

export function YouTubeStats({ channelIds, className }: YouTubeStatsProps) {
  const [stats, setStats] = useState<ChannelStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const maxRetries = 3

  useEffect(() => {
    const getChannelStats = async () => {
      try {
        setLoading(true)
        setError(null)

        // Don't attempt to fetch if no channel IDs are provided
        if (!channelIds || channelIds.length === 0) {
          setStats({ subscriberCount: 0, viewCount: 0 })
          setLoading(false)
          return
        }

        const combinedStats = await fetchYouTubeStats(channelIds)

        if (!combinedStats) {
          throw new Error("Failed to fetch YouTube stats")
        }

        setStats(combinedStats)
        // Reset retry count on success
        setRetryCount(0)
      } catch (err) {
        console.error("Error fetching YouTube stats:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch YouTube stats")

        // Auto-retry with exponential backoff
        if (retryCount < maxRetries) {
          const delay = Math.pow(2, retryCount) * 1000 // 1s, 2s, 4s
          console.log(`Retrying in ${delay}ms... (${retryCount + 1}/${maxRetries})`)

          setTimeout(() => {
            setRetryCount((prev) => prev + 1)
          }, delay)
        } else {
          // After max retries, set default stats
          setStats({ subscriberCount: 0, viewCount: 0 })
        }
      } finally {
        setLoading(false)
      }
    }

    getChannelStats()

    // Set up interval to refresh stats every 15 minutes instead of 5 to reduce API calls
    const intervalId = setInterval(getChannelStats, 15 * 60 * 1000)

    return () => clearInterval(intervalId)
  }, [channelIds, retryCount])

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

  // If there's an error but we're still retrying, show a retry message
  if (error && retryCount < maxRetries) {
    return (
      <div className={`flex items-center justify-center py-4 ${className}`}>
        <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" />
        <span>
          Retrying... ({retryCount + 1}/{maxRetries})
        </span>
      </div>
    )
  }

  // If there's an error after all retries, or if stats is null, show a fallback UI
  if ((error && retryCount >= maxRetries) || !stats) {
    return (
      <div className={className}>
        <Card className="bg-muted/50">
          <CardContent className="flex justify-around py-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">--</div>
              <div className="text-sm text-muted-foreground">Subscribers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">--</div>
              <div className="text-sm text-muted-foreground">Total Views</div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={className}>
      <Card className="bg-muted/50">
        <CardContent className="flex justify-around py-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{formatNumber(stats.subscriberCount)}</div>
            <div className="text-sm text-muted-foreground">Subscribers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{formatNumber(stats.viewCount)}</div>
            <div className="text-sm text-muted-foreground">Total Views</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

