import { createServerSupabaseClient } from "@/lib/supabase"

// Define storage buckets
export const STORAGE_BUCKETS = {
  PROJECTS: "projects",
  PROFILE: "profile",
  RESUME: "resume",
  ATTACHMENTS: "attachments",
}

/**
 * Uploads a file to a specified bucket
 */
export async function uploadFile(
  bucket: string,
  file: File,
  options?: {
    upsert?: boolean
    cacheControl?: string
  },
): Promise<string> {
  const supabase = createServerSupabaseClient()
  const fileName = `${Date.now()}-${file.name}`

  const { error } = await supabase.storage.from(bucket).upload(fileName, file, {
    upsert: options?.upsert ?? true,
    cacheControl: options?.cacheControl ?? "3600",
  })

  if (error) {
    console.error(`Error uploading file to ${bucket}/${fileName}:`, error)
    throw error
  }

  // Get the public URL
  const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(fileName)

  return publicUrlData.publicUrl
}

/**
 * Deletes a file from a specified bucket
 */
export async function deleteFile(bucket: string, filePath: string) {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase.storage.from(bucket).remove([filePath])

  if (error) {
    console.error(`Error deleting file from ${bucket}/${filePath}:`, error)
    throw error
  }

  return true
}

/**
 * Lists files in a specified bucket and path
 */
export async function listFiles(bucket: string, path?: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.storage.from(bucket).list(path || "")

  if (error) {
    console.error(`Error listing files in ${bucket}/${path || ""}:`, error)
    throw error
  }

  return data
}

/**
 * Gets a public URL for a file
 */
export function getPublicUrl(bucket: string, path: string) {
  const supabase = createServerSupabaseClient()
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

/**
 * Initializes storage buckets - this is now a no-op function
 * since we can't create buckets due to RLS policies
 */
export async function initializeStorage() {
  console.log("Storage initialization skipped - using existing buckets")
  return true
}
