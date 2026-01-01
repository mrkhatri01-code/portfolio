"use server"

interface ChannelStats {
  subscriberCount: number
  viewCount: number
  dailyViews: number
  monthlyViews: number
}

export async function fetchYouTubeStats(channelIds: string[]): Promise<ChannelStats | null> {
  try {
    // Use the non-public environment variable
    const apiKey = process.env.YOUTUBE_API_KEY
    if (!apiKey) {
      console.error("YouTube API key is missing")
      return null
    }

    // Fetch stats for all channels in a single request if possible
    const combinedStats = { subscriberCount: 0, viewCount: 0, dailyViews: 0, monthlyViews: 0 }

    // Process channels in batches to avoid rate limiting
    for (const channelId of channelIds) {
      try {
        // Make a single API call per channel to get basic statistics
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`,
          {
            // Add cache control to help with rate limiting
            cache: "force-cache",
            next: { revalidate: 3600 }, // Revalidate once per hour
          },
        )

        if (!response.ok) {
          // Check if we're being rate limited
          if (response.status === 429) {
            console.warn(`Rate limited when fetching stats for channel ${channelId}`)
            continue // Skip this channel and try the next one
          }
          throw new Error(`Failed to fetch channel stats: ${response.statusText}`)
        }

        const data = await response.json()
        if (!data.items || data.items.length === 0) {
          console.warn(`Channel not found: ${channelId}`)
          continue // Skip this channel
        }

        const { subscriberCount, viewCount } = data.items[0].statistics

        // Parse the counts
        const parsedSubscriberCount = Number.parseInt(subscriberCount, 10) || 0
        const parsedViewCount = Number.parseInt(viewCount, 10) || 0

        // Calculate estimated daily and monthly views based on total views
        // This is a simple estimation that doesn't require additional API calls
        const estimatedDailyViews = Math.round(parsedViewCount / 365) // Simple average
        const estimatedMonthlyViews = Math.round(parsedViewCount / 12) // Simple average

        // Add to combined stats
        combinedStats.subscriberCount += parsedSubscriberCount
        combinedStats.viewCount += parsedViewCount
        combinedStats.dailyViews += estimatedDailyViews
        combinedStats.monthlyViews += estimatedMonthlyViews
      } catch (channelError) {
        // Log error but continue with other channels
        console.error(`Error processing channel ${channelId}:`, channelError)
      }

      // Add a small delay between requests to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    return combinedStats
  } catch (err) {
    console.error("Error fetching YouTube stats:", err)
    return null
  }
}
