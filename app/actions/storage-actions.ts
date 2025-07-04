"use server"

import storageProvider, { STORAGE_BUCKETS } from "@/lib/storage-utils"
import { revalidatePath } from "next/cache"
import { createServerSupabaseClient } from "@/lib/supabase"

/**
 * Uploads a project file
 */
export async function uploadProjectFile(formData: FormData) {
  try {
    const file = formData.get("file") as File
    const projectId = formData.get("projectId") as string
    const fileUrl = formData.get("fileUrl") as string

    if ((!file && !fileUrl) || !projectId) {
      return {
        success: false,
        message: "File/URL and project ID are required",
      }
    }

    // If a file URL is provided instead of a file upload
    if (fileUrl && !file) {
      // Here you would typically save the file URL to your database
      // For example, associate it with the project in a project_files table
      const supabase = createServerSupabaseClient()

      // Extract filename from URL
      const fileName = fileUrl.split("/").pop() || `external-file-${Date.now()}`

      // Insert into a project_files table (you would need to create this table)
      const { error } = await supabase.from("project_files").insert({
        project_id: projectId,
        file_name: fileName,
        file_url: fileUrl,
        file_type: "external",
        created_at: new Date().toISOString(),
      })

      if (error) {
        console.error("Error saving file URL:", error)
        return {
          success: false,
          message: "Failed to save file URL",
        }
      }

      revalidatePath(`/projects/${projectId}`)
      revalidatePath(`/admin/projects/${projectId}`)

      return {
        success: true,
        message: "File URL added successfully",
        fileUrl,
      }
    }

    // Otherwise, upload the file
    try {
      const fileUrl = await storageProvider.uploadFile(STORAGE_BUCKETS.PROJECTS, file)

      // Save file metadata to database
      const supabase = createServerSupabaseClient()

      // Insert into a project_files table (you would need to create this table)
      const { error } = await supabase.from("project_files").insert({
        project_id: projectId,
        file_name: file.name,
        file_url: fileUrl,
        file_size: file.size,
        file_type: file.type,
        created_at: new Date().toISOString(),
      })

      if (error) {
        console.error("Error saving file metadata:", error)
        // Continue even if metadata saving fails
      }

      revalidatePath(`/projects/${projectId}`)
      revalidatePath(`/admin/projects/${projectId}`)

      return {
        success: true,
        message: "File uploaded successfully",
        fileUrl,
      }
    } catch (error) {
      if (error instanceof Error) {
        return {
          success: false,
          message: error.message,
        }
      }
      throw error
    }
  } catch (error) {
    console.error("Error uploading project file:", error)
    return {
      success: false,
      message: "Failed to upload file",
    }
  }
}

/**
 * Deletes a project file
 */
export async function deleteProjectFile(projectId: string, filePath: string) {
  try {
    try {
      // Delete from storage
      await storageProvider.deleteFile(STORAGE_BUCKETS.PROJECTS, filePath)

      // Delete from database
      const supabase = createServerSupabaseClient()

      // Delete from project_files table if it exists
      const { error } = await supabase
        .from("project_files")
        .delete()
        .eq("project_id", projectId)
        .eq("file_name", filePath)

      if (error) {
        console.error("Error deleting file metadata:", error)
        // Continue even if metadata deletion fails
      }

      revalidatePath(`/projects/${projectId}`)
      revalidatePath(`/admin/projects/${projectId}`)

      return {
        success: true,
        message: "File deleted successfully",
      }
    } catch (error) {
      if (error instanceof Error) {
        return {
          success: false,
          message: error.message,
        }
      }
      throw error
    }
  } catch (error) {
    console.error("Error deleting project file:", error)
    return {
      success: false,
      message: "Failed to delete file",
    }
  }
}

/**
 * Lists project files
 */
export async function listProjectFiles(projectId: string) {
  try {
    // First try to get files from the database
    const supabase = createServerSupabaseClient()

    // Check if project_files table exists
    const { error: tableCheckError } = await supabase.from("project_files").select("count").limit(1)

    if (!tableCheckError) {
      // If table exists, get files from database
      const { data: dbFiles, error } = await supabase
        .from("project_files")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false })

      if (!error && dbFiles && dbFiles.length > 0) {
        // Transform to expected format
        const files = dbFiles.map((file) => ({
          id: file.id || file.file_name,
          name: file.file_name,
          url: file.file_url,
          size: file.file_size,
          created_at: file.created_at,
        }))

        return {
          success: true,
          data: files,
        }
      }
    }

    // Fallback to storage provider if database approach fails
    const files = await storageProvider.listFiles(STORAGE_BUCKETS.PROJECTS, projectId)

    return {
      success: true,
      data: files,
    }
  } catch (error) {
    console.error("Error listing project files:", error)
    return {
      success: true,
      data: [],
    }
  }
}

/**
 * Uploads a profile image
 */
export async function updateProfileImage(formData: FormData) {
  try {
    const file = formData.get("file") as File

    if (!file) {
      return {
        success: false,
        message: "File is required",
      }
    }

    try {
      const imageUrl = await storageProvider.uploadFile(STORAGE_BUCKETS.PROFILE, file)

      // Update profile image URL in settings
      const supabase = createServerSupabaseClient()

      // Get current settings
      const { data: settings, error: getError } = await supabase.from("settings").select("id").single()

      if (getError && !getError.message.includes("No rows found")) {
        throw getError
      }

      // Update or insert settings
      const operation = settings
        ? supabase.from("settings").update({ profile_image_url: imageUrl }).eq("id", settings.id)
        : supabase.from("settings").insert([{ profile_image_url: imageUrl }])

      const { error } = await operation

      if (error) {
        throw error
      }

      revalidatePath("/")
      revalidatePath("/admin/settings")

      return {
        success: true,
        message: "Profile image updated successfully",
        imageUrl,
      }
    } catch (error) {
      if (error instanceof Error) {
        return {
          success: false,
          message: error.message,
        }
      }
      throw error
    }
  } catch (error) {
    console.error("Error updating profile image:", error)
    return {
      success: false,
      message: "Failed to update profile image",
    }
  }
}

/**
 * Uploads a resume file
 */
export async function updateResume(formData: FormData) {
  try {
    const file = formData.get("file") as File

    if (!file) {
      return {
        success: false,
        message: "File is required",
      }
    }

    try {
      const resumeUrl = await storageProvider.uploadFile(STORAGE_BUCKETS.RESUME, file)

      // Update resume URL in settings
      const supabase = createServerSupabaseClient()

      // Get current settings
      const { data: settings, error: getError } = await supabase.from("settings").select("id").single()

      if (getError && !getError.message.includes("No rows found")) {
        throw getError
      }

      // Update or insert settings
      const operation = settings
        ? supabase.from("settings").update({ resume_url: resumeUrl }).eq("id", settings.id)
        : supabase.from("settings").insert([{ resume_url: resumeUrl }])

      const { error } = await operation

      if (error) {
        throw error
      }

      revalidatePath("/")
      revalidatePath("/admin/settings")

      return {
        success: true,
        message: "Resume updated successfully",
        resumeUrl,
      }
    } catch (error) {
      if (error instanceof Error) {
        return {
          success: false,
          message: error.message,
        }
      }
      throw error
    }
  } catch (error) {
    console.error("Error updating resume:", error)
    return {
      success: false,
      message: "Failed to update resume",
    }
  }
}

/**
 * Uploads an attachment file
 */
export async function uploadAttachment(formData: FormData) {
  try {
    const file = formData.get("file") as File

    if (!file) {
      return {
        success: false,
        message: "File is required",
      }
    }

    try {
      const fileUrl = await storageProvider.uploadFile(STORAGE_BUCKETS.ATTACHMENTS, file)

      return {
        success: true,
        message: "Attachment uploaded successfully",
        fileUrl,
      }
    } catch (error) {
      if (error instanceof Error) {
        return {
          success: false,
          message: error.message,
        }
      }
      throw error
    }
  } catch (error) {
    console.error("Error uploading attachment:", error)
    return {
      success: false,
      message: "Failed to upload attachment",
    }
  }
}

/**
 * Deletes an attachment file
 */
export async function deleteAttachment(filePath: string) {
  try {
    try {
      await storageProvider.deleteFile(STORAGE_BUCKETS.ATTACHMENTS, filePath)

      return {
        success: true,
        message: "Attachment deleted successfully",
      }
    } catch (error) {
      if (error instanceof Error) {
        return {
          success: false,
          message: error.message,
        }
      }
      throw error
    }
  } catch (error) {
    console.error("Error deleting attachment:", error)
    return {
      success: false,
      message: "Failed to delete attachment",
    }
  }
}

/**
 * Initialize storage
 */
export async function initializeStorage() {
  try {
    await storageProvider.initializeStorage()

    return {
      success: true,
      message: "Storage initialized successfully",
    }
  } catch (error) {
    console.error("Error initializing storage:", error)
    return {
      success: false,
      message: "Failed to initialize storage",
    }
  }
}
