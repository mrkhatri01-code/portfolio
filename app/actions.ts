"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

// Contact form submission
export async function submitContactForm(formData: FormData) {
  const supabase = createServerSupabaseClient()

  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const message = formData.get("message") as string

  if (!name || !email || !message) {
    return {
      success: false,
      message: "All fields are required",
    }
  }

  try {
    const { error } = await supabase.from("messages").insert([{ name, email, message }])

    if (error) throw error

    return {
      success: true,
      message: "Message sent successfully!",
    }
  } catch (error) {
    console.error("Error submitting contact form:", error)
    return {
      success: false,
      message: "Failed to send message. Please try again.",
    }
  }
}

// Admin actions for projects
export async function createProject(formData: FormData) {
  const supabase = createServerSupabaseClient()

  const title = formData.get("title") as string
  const slug = formData.get("slug") as string
  const description = formData.get("description") as string
  const category = formData.get("category") as string
  const featured = formData.get("featured") === "on"

  if (!title || !slug || !description || !category) {
    return {
      success: false,
      message: "All fields are required",
    }
  }

  try {
    // Insert project
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .insert([
        {
          title,
          slug,
          description,
          category,
          featured,
        },
      ])
      .select()

    if (projectError) throw projectError

    revalidatePath("/")
    revalidatePath("/projects")

    return {
      success: true,
      message: "Project created successfully!",
      projectId: project[0].id,
    }
  } catch (error) {
    console.error("Error creating project:", error)
    return {
      success: false,
      message: "Failed to create project. Please try again.",
    }
  }
}

export async function uploadProjectImage(projectId: string, imageUrl: string, altText = "") {
  const supabase = createServerSupabaseClient()

  try {
    // Get current highest display order
    const { data: existingImages } = await supabase
      .from("project_images")
      .select("display_order")
      .eq("project_id", projectId)
      .order("display_order", { ascending: false })
      .limit(1)

    const displayOrder = existingImages && existingImages.length > 0 ? existingImages[0].display_order + 1 : 0

    // Insert image
    const { error } = await supabase.from("project_images").insert([
      {
        project_id: projectId,
        image_url: imageUrl,
        alt_text: altText,
        display_order: displayOrder,
      },
    ])

    if (error) throw error

    revalidatePath(`/projects/${projectId}`)

    return {
      success: true,
      message: "Image uploaded successfully!",
    }
  } catch (error) {
    console.error("Error uploading project image:", error)
    return {
      success: false,
      message: "Failed to upload image. Please try again.",
    }
  }
}

export async function addYoutubeVideo(projectId: string, youtubeUrl: string, title = "") {
  const supabase = createServerSupabaseClient()

  try {
    // Get current highest display order
    const { data: existingVideos } = await supabase
      .from("project_videos")
      .select("display_order")
      .eq("project_id", projectId)
      .order("display_order", { ascending: false })
      .limit(1)

    const displayOrder = existingVideos && existingVideos.length > 0 ? existingVideos[0].display_order + 1 : 0

    // Insert video
    const { error } = await supabase.from("project_videos").insert([
      {
        project_id: projectId,
        youtube_url: youtubeUrl,
        title,
        display_order: displayOrder,
      },
    ])

    if (error) throw error

    revalidatePath(`/projects/${projectId}`)

    return {
      success: true,
      message: "Video added successfully!",
    }
  } catch (error) {
    console.error("Error adding YouTube video:", error)
    return {
      success: false,
      message: "Failed to add video. Please try again.",
    }
  }
}
