import { createServerSupabaseClient } from "@/lib/supabase"
import { v4 as uuidv4 } from "uuid"

// Storage buckets
export const STORAGE_BUCKETS = {
  PROJECTS: "projects",
  PROFILE: "profile",
  RESUME: "resume",
  ATTACHMENTS: "attachments",
}

export type FileMetadata = {
  id: string
  name: string
  size: number
  type: string
  url: string
  created_at: string
  project_id?: string
}

export class StorageService {
  /**
   * Upload a file to a specific bucket
   */
  static async uploadFile(
    bucket: string,
    file: File,
    folder = "",
    metadata: Record<string, any> = {},
  ): Promise<FileMetadata> {
    const supabase = createServerSupabaseClient()

    // Create a unique filename to avoid collisions
    const fileExtension = file.name.split(".").pop()
    const uniqueId = uuidv4()
    const fileName = folder ? `${folder}/${uniqueId}-${file.name}` : `${uniqueId}-${file.name}`

    // Upload the file to Supabase storage
    const { data, error } = await supabase.storage.from(bucket).upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("Error uploading file:", error)
      throw new Error(`Failed to upload file: ${error.message}`)
    }

    // Get the public URL
    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(fileName)

    // Create file metadata record
    const fileMetadata: FileMetadata = {
      id: uniqueId,
      name: file.name,
      size: file.size,
      type: file.type,
      url: publicUrlData.publicUrl,
      created_at: new Date().toISOString(),
      ...metadata,
    }

    // Store metadata in database if project_id is provided
    if (metadata.project_id) {
      await this.saveFileMetadata(fileMetadata)
    }

    return fileMetadata
  }

  /**
   * Save file metadata to the database
   */
  static async saveFileMetadata(fileMetadata: FileMetadata): Promise<void> {
    const supabase = createServerSupabaseClient()

    // Check if project_files table exists
    const { error: tableCheckError } = await supabase.from("project_files").select("count").limit(1).single()

    // If table doesn't exist, create it
    if (tableCheckError) {
      await this.createProjectFilesTable()
    }

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
   * Create project_files table if it doesn't exist
   */
  static async createProjectFilesTable(): Promise<void> {
    const supabase = createServerSupabaseClient()

    // Execute SQL to create table
    const { error } = await supabase.rpc("create_project_files_table")

    if (error) {
      console.error("Error creating project_files table:", error)
      throw new Error(`Failed to create project_files table: ${error.message}`)
    }
  }

  /**
   * Delete a file from storage and database
   */
  static async deleteFile(bucket: string, fileName: string, fileId?: string): Promise<void> {
    const supabase = createServerSupabaseClient()

    // Delete from storage
    const { error: storageError } = await supabase.storage.from(bucket).remove([fileName])

    if (storageError) {
      console.error("Error deleting file from storage:", storageError)
      throw new Error(`Failed to delete file from storage: ${storageError.message}`)
    }

    // Delete metadata from database if fileId is provided
    if (fileId) {
      const { error: dbError } = await supabase.from("project_files").delete().eq("id", fileId)

      if (dbError) {
        console.error("Error deleting file metadata:", dbError)
        // Continue even if metadata deletion fails
      }
    }
  }

  /**
   * List files for a project
   */
  static async listProjectFiles(projectId: string): Promise<FileMetadata[]> {
    const supabase = createServerSupabaseClient()

    // Try to get files from database first
    const { data: dbFiles, error: dbError } = await supabase
      .from("project_files")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false })

    if (!dbError && dbFiles && dbFiles.length > 0) {
      // Transform to expected format
      return dbFiles.map((file) => ({
        id: file.id,
        name: file.file_name,
        size: file.file_size,
        type: file.file_type,
        url: file.file_url,
        created_at: file.created_at,
        project_id: file.project_id,
      }))
    }

    // Fallback to listing files from storage
    const { data: storageFiles, error: storageError } = await supabase.storage
      .from(STORAGE_BUCKETS.PROJECTS)
      .list(projectId)

    if (storageError) {
      console.error("Error listing files from storage:", storageError)
      return []
    }

    // Transform storage files to FileMetadata format
    return (storageFiles || []).map((file) => {
      const { data: urlData } = supabase.storage
        .from(STORAGE_BUCKETS.PROJECTS)
        .getPublicUrl(`${projectId}/${file.name}`)

      return {
        id: file.id || uuidv4(),
        name: file.name,
        size: file.metadata?.size || 0,
        type: file.metadata?.mimetype || "",
        url: urlData.publicUrl,
        created_at: file.created_at || new Date().toISOString(),
        project_id: projectId,
      }
    })
  }

  /**
   * Initialize storage buckets
   */
  static async initializeStorage(): Promise<void> {
    const supabase = createServerSupabaseClient()

    // Create SQL function for creating project_files table
    const { error: functionError } = await supabase.rpc("create_sql_function")

    if (functionError) {
      console.error("Error creating SQL function:", functionError)
      // Continue even if function creation fails
    }

    // Ensure all buckets exist
    for (const bucket of Object.values(STORAGE_BUCKETS)) {
      try {
        // Check if bucket exists
        const { data: buckets } = await supabase.storage.listBuckets()
        const bucketExists = buckets?.some((b) => b.name === bucket)

        if (!bucketExists) {
          // Create bucket with public access
          const { error } = await supabase.storage.createBucket(bucket, {
            public: true,
          })

          if (error) {
            console.error(`Error creating bucket ${bucket}:`, error)
          }
        }
      } catch (error) {
        console.error(`Error checking/creating bucket ${bucket}:`, error)
        // Continue with next bucket
      }
    }
  }
}
