"use server"

import { StorageService, type FileMetadata, STORAGE_BUCKETS } from "@/lib/storage-service"
import { revalidatePath } from "next/cache"
import { createServerSupabaseClient } from "@/lib/supabase"
import { v4 as uuidv4 } from "uuid"

/**
 * Upload a file for a project
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
      // Extract filename from URL
      const fileName = getFileNameFromUrl(fileUrl)
      const fileType = getFileTypeFromUrl(fileUrl)

      // Create file metadata
      const fileMetadata: FileMetadata = {
        id: uuidv4(),
        name: fileName,
        size: 0,
        type: fileType,
        url: fileUrl,
        created_at: new Date().toISOString(),
        project_id: projectId,
      }

      // Save metadata to database
      await saveFileMetadata(fileMetadata)

      revalidatePath(`/projects/${projectId}`)
      revalidatePath(`/admin/projects/${projectId}`)

      return {
        success: true,
        message: "File URL added successfully",
        fileUrl,
      }
    }

    // Upload the file
    const fileMetadata = await StorageService.uploadFile(
      STORAGE_BUCKETS.PROJECTS,
      file,
      projectId, // Use projectId as folder name
      { project_id: projectId },
    )

    revalidatePath(`/projects/${projectId}`)
    revalidatePath(`/admin/projects/${projectId}`)

    return {
      success: true,
      message: "File uploaded successfully",
      fileUrl: fileMetadata.url,
    }
  } catch (error) {
    console.error("Error uploading project file:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to upload file",
    }
  }
}

/**
 * Helper function to save file metadata directly
 */
async function saveFileMetadata(fileMetadata: FileMetadata): Promise<void> {
  const supabase = createServerSupabaseClient()

  // Insert file metadata
  const { error } = await supabase.from("project_files").insert({
    id: fileMetadata.id,
    project_id: fileMetadata.project_id,
    file_name: fileMetadata.name,
    file_url: fileMetadata.url,
    file_size: fileMetadata.size,
    file_type: fileMetadata.type,
    created_at: fileMetadata.created_at,
  })

  if (error) {
    console.error("Error saving file metadata:", error)
    throw new Error(`Failed to save file metadata: ${error.message}`)
  }
}

/**
 * Helper function to get file type from URL
 */
function getFileTypeFromUrl(url: string): string {
  const extension = url.split(".").pop()?.toLowerCase() || ""

  // Image types
  if (["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"].includes(extension)) {
    return "image"
  }

  // Document types
  if (["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt"].includes(extension)) {
    return "document"
  }

  return "other"
}

/**
 * Helper function to get file name from URL
 */
function getFileNameFromUrl(url: string): string {
  try {
    // Try to extract filename from URL
    const urlObj = new URL(url)
    const pathSegments = urlObj.pathname.split("/")
    let fileName = pathSegments[pathSegments.length - 1]

    // Remove query parameters if present
    fileName = fileName.split("?")[0]

    // If filename is empty or just a slash, generate a random name
    if (!fileName || fileName === "/") {
      return `file-${Date.now().toString().slice(-6)}`
    }

    // URL decode the filename
    return decodeURIComponent(fileName)
  } catch (e) {
    // If URL parsing fails, extract the last segment after the last slash
    const segments = url.split("/")
    let fileName = segments[segments.length - 1]

    // Remove query parameters if present
    fileName = fileName.split("?")[0]

    if (!fileName) {
      return `file-${Date.now().toString().slice(-6)}`
    }

    return fileName
  }
}

/**
 * Delete a project file
 */
export async function deleteProjectFile(fileId: string, fileName: string, projectId: string) {
  try {
    await StorageService.deleteFile(STORAGE_BUCKETS.PROJECTS, `${projectId}/${fileName}`, fileId)

    revalidatePath(`/projects/${projectId}`)
    revalidatePath(`/admin/projects/${projectId}`)

    return {
      success: true,
      message: "File deleted successfully",
    }
  } catch (error) {
    console.error("Error deleting project file:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete file",
    }
  }
}

/**
 * List project files
 */
export async function listProjectFiles(projectId: string) {
  try {
    const files = await StorageService.listProjectFiles(projectId)

    return {
      success: true,
      data: files,
    }
  } catch (error) {
    console.error("Error listing project files:", error)
    return {
      success: true, // Still return success to avoid breaking UI
      data: [],
    }
  }
}

/**
 * Upload a profile image
 */
export async function uploadProfileImage(formData: FormData) {
  try {
    const file = formData.get("file") as File

    if (!file) {
      return {
        success: false,
        message: "File is required",
      }
    }

    // Upload the file
    const fileMetadata = await StorageService.uploadFile(STORAGE_BUCKETS.PROFILE, file)

    // Update profile image URL in settings
    const supabase = createServerSupabaseClient()

    // Get current settings
    const { data: settings, error: getError } = await supabase.from("settings").select("id").single()

    if (getError && !getError.message.includes("No rows found")) {
      throw getError
    }

    // Update or insert settings
    const operation = settings
      ? supabase.from("settings").update({ profile_image_url: fileMetadata.url }).eq("id", settings.id)
      : supabase.from("settings").insert([{ profile_image_url: fileMetadata.url }])

    const { error } = await operation

    if (error) {
      throw error
    }

    revalidatePath("/")
    revalidatePath("/admin/settings")

    return {
      success: true,
      message: "Profile image updated successfully",
      imageUrl: fileMetadata.url,
    }
  } catch (error) {
    console.error("Error uploading profile image:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to upload profile image",
    }
  }
}

/**
 * Upload a resume file
 */
export async function uploadResume(formData: FormData) {
  try {
    const file = formData.get("file") as File

    if (!file) {
      return {
        success: false,
        message: "File is required",
      }
    }

    // Upload the file
    const fileMetadata = await StorageService.uploadFile(STORAGE_BUCKETS.RESUME, file)

    // Update resume URL in settings
    const supabase = createServerSupabaseClient()

    // Get current settings
    const { data: settings, error: getError } = await supabase.from("settings").select("id").single()

    if (getError && !getError.message.includes("No rows found")) {
      throw getError
    }

    // Update or insert settings
    const operation = settings
      ? supabase.from("settings").update({ resume_url: fileMetadata.url }).eq("id", settings.id)
      : supabase.from("settings").insert([{ resume_url: fileMetadata.url }])

    const { error } = await operation

    if (error) {
      throw error
    }

    revalidatePath("/")
    revalidatePath("/admin/settings")

    return {
      success: true,
      message: "Resume updated successfully",
      resumeUrl: fileMetadata.url,
    }
  } catch (error) {
    console.error("Error uploading resume:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to upload resume",
    }
  }
}

/**
 * Initialize storage
 */
export async function initializeStorage() {
  try {
    await StorageService.initializeStorage()

    return {
      success: true,
      message: "Storage initialized successfully",
    }
  } catch (error) {
    console.error("Error initializing storage:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to initialize storage",
    }
  }
}
