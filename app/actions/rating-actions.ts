"use server"

import { ratingManager } from "@/lib/data-manager"
import { revalidatePath } from "next/cache"
import { isValidEmail } from "@/lib/utils"

export async function submitRating(formData: FormData) {
  try {
    const projectId = formData.get("projectId") as string
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const ratingStr = formData.get("rating") as string
    const comment = formData.get("comment") as string

    // Validate inputs
    if (!projectId || !name || !email || !ratingStr) {
      return {
        success: false,
        message: "Missing required fields",
      }
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return {
        success: false,
        message: "Please enter a valid email address",
      }
    }

    const rating = Number.parseInt(ratingStr, 10)

    if (isNaN(rating) || rating < 1 || rating > 5) {
      return {
        success: false,
        message: "Invalid rating value",
      }
    }

    // Create rating
    const newRating = await ratingManager.create({
      project_id: projectId,
      user_name: name,
      user_email: email,
      rating,
      comment: comment || null,
      verified: false, // Initially set as unverified
    })

    // Send verification email (in a real implementation)
    // await sendVerificationEmail(email, newRating.id);

    // Revalidate paths
    revalidatePath(`/projects/${projectId}`)

    return {
      success: true,
      message: "Rating submitted successfully",
      data: newRating,
    }
  } catch (error) {
    console.error("Error submitting rating:", error)
    return {
      success: false,
      message: "Failed to submit rating",
    }
  }
}

export async function getProjectRatings(projectId: string) {
  try {
    const ratings = await ratingManager.getByProjectId(projectId)
    const averageRating = await ratingManager.getAverageRating(projectId)

    return {
      success: true,
      data: {
        ratings,
        averageRating,
      },
    }
  } catch (error) {
    console.error("Error fetching project ratings:", error)
    return {
      success: false,
      message: "Failed to fetch ratings",
    }
  }
}

// New function to verify a rating
export async function verifyRating(ratingId: string) {
  try {
    await ratingManager.update(ratingId, { verified: true })

    return {
      success: true,
      message: "Rating verified successfully",
    }
  } catch (error) {
    console.error("Error verifying rating:", error)
    return {
      success: false,
      message: "Failed to verify rating",
    }
  }
}

// New function to delete a rating
export async function deleteRating(ratingId: string) {
  try {
    await ratingManager.delete(ratingId)

    return {
      success: true,
      message: "Rating deleted successfully",
    }
  } catch (error) {
    console.error("Error deleting rating:", error)
    return {
      success: false,
      message: "Failed to delete rating",
    }
  }
}

