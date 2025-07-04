"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function updateProfileImage(imageUrl: string) {
  const supabase = createServerSupabaseClient()

  try {
    const { error } = await supabase.from("settings").update({ profile_image_url: imageUrl }).eq("id", "1") // Assuming there's only one settings record

    if (error) throw error

    revalidatePath("/")

    return {
      success: true,
      message: "Profile image updated successfully!",
    }
  } catch (error) {
    console.error("Error updating profile image:", error)
    return {
      success: false,
      message: "Failed to update profile image. Please try again.",
    }
  }
}

// Add this SQL query to update the settings with the about image
