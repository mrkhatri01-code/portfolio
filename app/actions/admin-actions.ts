"use server"

import { ratingManager } from "@/lib/data-manager"

export async function getAllRatings() {
  try {
    // Add a small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 500))

    const ratings = await ratingManager.getAllWithProjects()

    return {
      success: true,
      data: ratings,
    }
  } catch (error) {
    console.error("Error fetching all ratings:", error)
    return {
      success: false,
      message: "Failed to fetch ratings",
      data: [],
    }
  }
}
