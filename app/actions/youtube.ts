"use server"

interface ChannelStats {
  subscriberCount: number
  viewCount: number
}

export async function fetchYouTubeStats(channelIds: string[]): Promise<ChannelStats | null> {
  try {
    // Use the non-public environment variable
    const apiKey = process.env.YOUTUBE_API_KEY
    if (!apiKey) {
      console.error("YouTube API key is missing")
      return { subscriberCount: 0, viewCount: 0 }
    }

    // Validate channel IDs
    if (!channelIds || channelIds.length === 0) {
      console.error("No channel IDs provided")
      return { subscriberCount: 0, viewCount: 0 }
    }

    // Fetch stats for all channels with retry logic
    const fetchWithRetry = async (channelId: string, retries = 3, delay = 500): Promise<ChannelStats | null> => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`,
          { cache: "no-store" }, // Disable caching to ensure fresh data
        )

        if (response.status === 429) {
          // Rate limit exceeded
          if (retries > 0) {
            console.log(`Rate limit exceeded, retrying in ${delay}ms... (${retries} retries left)`)
            await new Promise((resolve) => setTimeout(resolve, delay))
            return fetchWithRetry(channelId, retries - 1, delay * 2)
          } else {
            console.error("Rate limit exceeded and no more retries left")
            return null
          }
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch channel stats: ${response.statusText}`)
        }

        const data = await response.json()
        if (!data.items || data.items.length === 0) {
          console.warn(`Channel not found: ${channelId}`)
          return { subscriberCount: 0, viewCount: 0 }
        }

        const { subscriberCount, viewCount } = data.items[0].statistics
        return {
          subscriberCount: Number.parseInt(subscriberCount || "0", 10),
          viewCount: Number.parseInt(viewCount || "0", 10),
        }
      } catch (err) {
        if (retries > 0) {
          console.log(`Error fetching stats, retrying in ${delay}ms... (${retries} retries left)`)
          await new Promise((resolve) => setTimeout(resolve, delay))
          return fetchWithRetry(channelId, retries - 1, delay * 2)
        }
        console.error(`Error fetching stats for channel ${channelId}:`, err)
        return null
      }
    }

    // Fetch stats for each channel with a small delay between requests to avoid rate limiting
    const statsPromises = []
    for (const channelId of channelIds) {
      // Add a small delay between requests to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100))
      statsPromises.push(fetchWithRetry(channelId))
    }

    const channelsStats = await Promise.all(statsPromises)

    // Filter out null results and calculate combined stats
    const validStats = channelsStats.filter(Boolean) as ChannelStats[]

    if (validStats.length === 0) {
      console.warn("No valid stats were fetched for any channel")
      return { subscriberCount: 0, viewCount: 0 }
    }

    // Calculate combined stats
    const combinedStats = validStats.reduce(
      (acc, curr) => {
        return {
          subscriberCount: acc.subscriberCount + curr.subscriberCount,
          viewCount: acc.viewCount + curr.viewCount,
        }
      },
      { subscriberCount: 0, viewCount: 0 },
    )

    return combinedStats
  } catch (err) {
    console.error("Error fetching YouTube stats:", err)
    // Return default values instead of null
    return { subscriberCount: 0, viewCount: 0 }
  }
}
