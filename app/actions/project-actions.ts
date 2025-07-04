"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

// Create project
export async function createProject(formData: FormData) {
  const supabase = createServerSupabaseClient()

  const title = formData.get("title") as string
  const slug = formData.get("slug") as string
  const description = formData.get("description") as string
  const category = formData.get("category") as string
  const featured = formData.get("featured") === "on"
  const externalUrl = (formData.get("externalUrl") as string) || null
  const mainImageUrl = (formData.get("mainImageUrl") as string) || null

  if (!title || !slug || !description || !category) {
    return {
      success: false,
      message: "All fields are required",
    }
  }

  try {
    // Check if slug already exists
    const { data: existingProject } = await supabase.from("projects").select("id").eq("slug", slug).single()

    if (existingProject) {
      return {
        success: false,
        message: "A project with this slug already exists",
      }
    }

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
          external_url: externalUrl,
          main_image_url: mainImageUrl,
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

// Update project
export async function updateProject(projectId: string, formData: FormData) {
  const supabase = createServerSupabaseClient()

  const title = formData.get("title") as string
  const slug = formData.get("slug") as string
  const description = formData.get("description") as string
  const category = formData.get("category") as string
  const featured = formData.get("featured") === "on"
  const externalUrl = (formData.get("externalUrl") as string) || null
  const mainImageUrl = (formData.get("mainImageUrl") as string) || null

  if (!title || !slug || !description || !category) {
    return {
      success: false,
      message: "All fields are required",
    }
  }

  try {
    // Check if slug already exists for another project
    const { data: existingProject } = await supabase
      .from("projects")
      .select("id")
      .eq("slug", slug)
      .neq("id", projectId)
      .single()

    if (existingProject) {
      return {
        success: false,
        message: "Another project with this slug already exists",
      }
    }

    // Update project
    const { error } = await supabase
      .from("projects")
      .update({
        title,
        slug,
        description,
        category,
        featured,
        external_url: externalUrl,
        main_image_url: mainImageUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", projectId)

    if (error) throw error

    revalidatePath("/")
    revalidatePath("/projects")
    revalidatePath(`/projects/${slug}`)

    return {
      success: true,
      message: "Project updated successfully!",
      slug,
    }
  } catch (error) {
    console.error("Error updating project:", error)
    return {
      success: false,
      message: "Failed to update project. Please try again.",
    }
  }
}

// Delete project
export async function deleteProject(projectId: string) {
  const supabase = createServerSupabaseClient()

  try {
    // Delete project (cascade will delete related videos)
    const { error } = await supabase.from("projects").delete().eq("id", projectId)

    if (error) throw error

    revalidatePath("/")
    revalidatePath("/projects")

    return {
      success: true,
      message: "Project deleted successfully!",
    }
  } catch (error) {
    console.error("Error deleting project:", error)
    return {
      success: false,
      message: "Failed to delete project. Please try again.",
    }
  }
}

// Project images - simplified to just use URLs
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
    revalidatePath(`/admin/projects/${projectId}`)

    return {
      success: true,
      message: "Image added successfully!",
    }
  } catch (error) {
    console.error("Error adding project image:", error)
    return {
      success: false,
      message: "Failed to add image. Please try again.",
    }
  }
}

// Delete project image
export async function deleteProjectImage(imageId: string) {
  const supabase = createServerSupabaseClient()

  try {
    // Get image URL and project ID
    const { data: image, error: getError } = await supabase
      .from("project_images")
      .select("image_url, project_id")
      .eq("id", imageId)
      .single()

    if (getError) throw getError

    // Delete from database
    const { error } = await supabase.from("project_images").delete().eq("id", imageId)

    if (error) throw error

    revalidatePath(`/projects/${image.project_id}`)
    revalidatePath(`/admin/projects/${image.project_id}`)

    return {
      success: true,
      message: "Image deleted successfully!",
    }
  } catch (error) {
    console.error("Error deleting project image:", error)
    return {
      success: false,
      message: "Failed to delete image. Please try again.",
    }
  }
}

// YouTube videos
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
    revalidatePath(`/admin/projects/${projectId}`)

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

// Delete YouTube video
export async function deleteYoutubeVideo(videoId: string) {
  const supabase = createServerSupabaseClient()

  try {
    // Get project ID
    const { data: video, error: getError } = await supabase
      .from("project_videos")
      .select("project_id")
      .eq("id", videoId)
      .single()

    if (getError) throw getError

    // Delete from database
    const { error } = await supabase.from("project_videos").delete().eq("id", videoId)

    if (error) throw error

    revalidatePath(`/projects/${video.project_id}`)
    revalidatePath(`/admin/projects/${video.project_id}`)

    return {
      success: true,
      message: "Video deleted successfully!",
    }
  } catch (error) {
    console.error("Error deleting YouTube video:", error)
    return {
      success: false,
      message: "Failed to delete video. Please try again.",
    }
  }
}
