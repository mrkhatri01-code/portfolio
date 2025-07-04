"use server"

import { settingsManager } from "@/lib/data-manager"
import { revalidatePath } from "next/cache"
import { createServerSupabaseClient } from "@/lib/supabase"
import { deleteFile, uploadFile, STORAGE_BUCKETS, initializeStorage } from "@/lib/storage"

export async function updateSiteSettings(formData: FormData) {
  try {
    const siteTitle = formData.get("siteTitle") as string
    const siteDescription = formData.get("siteDescription") as string
    const aboutText = formData.get("aboutText") as string
    const instagramUrl = formData.get("instagramUrl") as string
    const behanceUrl = formData.get("behanceUrl") as string
    const githubUrl = formData.get("githubUrl") as string
    const linkedinUrl = formData.get("linkedinUrl") as string

    // Optional new social media fields
    const facebookUrl = formData.get("facebookUrl") as string
    const twitterUrl = formData.get("twitterUrl") as string
    const discordUrl = formData.get("discordUrl") as string
    const youtubeUrl = formData.get("youtubeUrl") as string

    // Validate required fields
    if (!siteTitle || !siteDescription) {
      return {
        success: false,
        message: "Site title and description are required",
      }
    }

    // Create base settings object with required fields
    const settingsData: any = {
      site_title: siteTitle,
      site_description: siteDescription,
      about_text: aboutText || null,
      instagram_url: instagramUrl || null,
      behance_url: behanceUrl || null,
      github_url: githubUrl || null,
      linkedin_url: linkedinUrl || null,
    }

    // Add new social media fields if they exist in the database
    // We'll handle this by checking if the current settings have these fields
    const currentSettings = await settingsManager.getSettings()

    if (currentSettings) {
      // Only add fields that exist in the current settings
      if ("facebook_url" in currentSettings) {
        settingsData.facebook_url = facebookUrl || null
      }

      if ("twitter_url" in currentSettings) {
        settingsData.twitter_url = twitterUrl || null
      }

      if ("discord_url" in currentSettings) {
        settingsData.discord_url = discordUrl || null
      }

      if ("youtube_url" in currentSettings) {
        settingsData.youtube_url = youtubeUrl || null
      }
    }

    // Update settings
    const updatedSettings = await settingsManager.updateSettings(settingsData)

    // Revalidate paths
    revalidatePath("/")
    revalidatePath("/admin/settings")
    revalidatePath("/admin/dashboard")

    return {
      success: true,
      message: "Settings updated successfully",
      data: updatedSettings,
    }
  } catch (error) {
    console.error("Error updating settings:", error)
    return {
      success: false,
      message: "Failed to update settings",
    }
  }
}

// Update profile image
export async function updateProfileImage(file: File) {
  const supabase = createServerSupabaseClient()

  try {
    // Initialize storage buckets first
    await initializeStorage()

    // Upload new image
    const imageUrl = await uploadFile(STORAGE_BUCKETS.PROFILE, file)

    // Get current settings
    const { data: settings, error: getError } = await supabase.from("settings").select("profile_image_url, id").single()

    if (getError && !getError.message.includes("No rows found")) throw getError

    // Delete old image if exists
    if (settings && settings.profile_image_url) {
      try {
        await deleteFile(STORAGE_BUCKETS.PROFILE, settings.profile_image_url)
      } catch (error) {
        console.error("Error deleting old profile image:", error)
        // Continue even if delete fails
      }
    }

    // Update or insert settings
    const operation = settings
      ? supabase
          .from("settings")
          .update({
            profile_image_url: imageUrl,
            updated_at: new Date().toISOString(),
          })
          .eq("id", settings.id)
      : supabase.from("settings").insert([
          {
            profile_image_url: imageUrl,
            site_title: "My Portfolio",
            site_description: "Showcasing my best work in design, development, and creative projects",
          },
        ])

    const { error } = await operation

    if (error) throw error

    revalidatePath("/")

    return {
      success: true,
      message: "Profile image updated successfully!",
      imageUrl,
    }
  } catch (error) {
    console.error("Error updating profile image:", error)
    return {
      success: false,
      message: "Failed to update profile image. Please try again.",
    }
  }
}

// Update resume
export async function updateResume(file: File) {
  const supabase = createServerSupabaseClient()

  try {
    // Initialize storage buckets first
    await initializeStorage()

    // Upload new resume
    const resumeUrl = await uploadFile(STORAGE_BUCKETS.RESUME, file)

    // Get current settings
    const { data: settings, error: getError } = await supabase.from("settings").select("resume_url, id").single()

    if (getError && !getError.message.includes("No rows found")) throw getError

    // Delete old resume if exists
    if (settings && settings.resume_url) {
      try {
        await deleteFile(STORAGE_BUCKETS.RESUME, settings.resume_url)
      } catch (error) {
        console.error("Error deleting old resume:", error)
        // Continue even if delete fails
      }
    }

    // Update or insert settings
    const operation = settings
      ? supabase
          .from("settings")
          .update({
            resume_url: resumeUrl,
            updated_at: new Date().toISOString(),
          })
          .eq("id", settings.id)
      : supabase.from("settings").insert([
          {
            resume_url: resumeUrl,
            site_title: "My Portfolio",
            site_description: "Showcasing my best work in design, development, and creative projects",
          },
        ])

    const { error } = await operation

    if (error) throw error

    revalidatePath("/")

    return {
      success: true,
      message: "Resume updated successfully!",
      resumeUrl,
    }
  } catch (error) {
    console.error("Error updating resume:", error)
    return {
      success: false,
      message: "Failed to update resume. Please try again.",
    }
  }
}

export async function updateProfileImageUrl(formData: FormData) {
  try {
    const imageUrl = formData.get("imageUrl") as string

    if (!imageUrl) {
      return {
        success: false,
        message: "Image URL is required",
      }
    }

    // Get current settings
    const currentSettings = await settingsManager.getSettings()

    // Update settings
    const updatedSettings = await settingsManager.updateSettings({
      ...(currentSettings || {}),
      profile_image_url: imageUrl,
    })

    // Revalidate paths
    revalidatePath("/")
    revalidatePath("/admin/settings")

    return {
      success: true,
      message: "Profile image updated successfully",
      imageUrl,
    }
  } catch (error) {
    console.error("Error updating profile image URL:", error)
    return {
      success: false,
      message: "Failed to update profile image",
    }
  }
}

export async function updateResumeUrl(formData: FormData) {
  try {
    const resumeUrl = formData.get("resumeUrl") as string

    if (!resumeUrl) {
      return {
        success: false,
        message: "Resume URL is required",
      }
    }

    // Get current settings
    const currentSettings = await settingsManager.getSettings()

    // Update settings
    const updatedSettings = await settingsManager.updateSettings({
      ...(currentSettings || {}),
      resume_url: resumeUrl,
    })

    // Revalidate paths
    revalidatePath("/")
    revalidatePath("/admin/settings")

    return {
      success: true,
      message: "Resume URL updated successfully",
      resumeUrl,
    }
  } catch (error) {
    console.error("Error updating resume URL:", error)
    return {
      success: false,
      message: "Failed to update resume URL",
    }
  }
}

