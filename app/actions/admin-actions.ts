"use server"

import { ratingManager } from "@/lib/data-manager"

export async function getAllRatings() {
  try {
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

