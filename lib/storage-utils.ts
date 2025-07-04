import { createServerSupabaseClient } from "@/lib/supabase"

// Storage providers
export enum StorageProvider {
  SUPABASE = "supabase",
  URL = "url",
  MOCK = "mock",
}

// Current active provider - Changed to SUPABASE now that we've configured it
export const ACTIVE_PROVIDER = StorageProvider.SUPABASE

// Storage buckets
export const STORAGE_BUCKETS = {
  PROJECTS: "projects",
  PROFILE: "profile",
  RESUME: "resume",
  ATTACHMENTS: "attachments",
}

/**
 * Base storage interface
 */
interface StorageInterface {
  uploadFile(bucket: string, file: File, options?: any): Promise<string>
  deleteFile(bucket: string, filePath: string): Promise<boolean>
  getPublicUrl(bucket: string, filePath: string): string
  listFiles(bucket: string, path?: string): Promise<any[]>
  initializeStorage(): Promise<boolean>
}

/**
 * Supabase storage implementation
 */
class SupabaseStorage implements StorageInterface {
  async uploadFile(bucket: string, file: File, options?: any): Promise<string> {
    const supabase = createServerSupabaseClient()

    // Create a folder structure based on the current timestamp to avoid collisions
    const timestamp = Date.now()
    const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`

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

  async deleteFile(bucket: string, filePath: string): Promise<boolean> {
    const supabase = createServerSupabaseClient()

    // Extract just the filename from the full URL if needed
    const fileName = this.extractFileNameFromUrl(filePath, bucket)

    const { error } = await supabase.storage.from(bucket).remove([fileName])

    if (error) {
      console.error(`Error deleting file from ${bucket}/${fileName}:`, error)
      throw error
    }

    return true
  }

  getPublicUrl(bucket: string, filePath: string): string {
    const supabase = createServerSupabaseClient()
    const fileName = this.extractFileNameFromUrl(filePath, bucket)
    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName)
    return data.publicUrl
  }

  async listFiles(bucket: string, path?: string): Promise<any[]> {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase.storage.from(bucket).list(path || "")

    if (error) {
      console.error(`Error listing files in ${bucket}/${path || ""}:`, error)
      throw error
    }

    // Transform the data to include URLs
    const filesWithUrls =
      data?.map((file) => {
        const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path ? `${path}/${file.name}` : file.name)

        return {
          ...file,
          url: urlData.publicUrl,
        }
      }) || []

    return filesWithUrls
  }

  async initializeStorage(): Promise<boolean> {
    // Buckets are already created in the Supabase dashboard
    console.log("Supabase storage buckets already initialized")
    return true
  }

  // Helper method to extract filename from a full URL
  private extractFileNameFromUrl(url: string, bucket: string): string {
    // If it's already just a filename, return it
    if (!url.includes("http")) {
      return url
    }

    try {
      // Try to extract the filename from the URL
      const urlObj = new URL(url)
      const pathParts = urlObj.pathname.split("/")

      // Find the bucket name in the path and get everything after it
      const bucketIndex = pathParts.findIndex((part) => part === bucket)
      if (bucketIndex !== -1 && bucketIndex < pathParts.length - 1) {
        return pathParts.slice(bucketIndex + 1).join("/")
      }

      // Fallback to just the last part of the path
      return pathParts[pathParts.length - 1]
    } catch (e) {
      // If URL parsing fails, just return the original string
      return url
    }
  }
}

/**
 * URL-based storage implementation (no actual file uploads)
 */
class UrlStorage implements StorageInterface {
  async uploadFile(bucket: string, file: File, options?: any): Promise<string> {
    // This implementation doesn't actually upload files
    // Instead, it returns a message indicating that uploads are disabled
    throw new Error("File uploads are disabled. Please use direct URLs instead.")
  }

  async deleteFile(bucket: string, filePath: string): Promise<boolean> {
    // No actual deletion happens
    console.log(`Mock deletion of ${filePath} from ${bucket}`)
    return true
  }

  getPublicUrl(bucket: string, filePath: string): string {
    // Just return the filePath as is, assuming it's already a URL
    return filePath
  }

  async listFiles(bucket: string, path?: string): Promise<any[]> {
    // Return an empty array since we don't store files
    return []
  }

  async initializeStorage(): Promise<boolean> {
    console.log("URL storage doesn't require initialization")
    return true
  }
}

/**
 * Mock storage for testing
 */
class MockStorage implements StorageInterface {
  private mockFiles: Record<string, string[]> = {}

  async uploadFile(bucket: string, file: File, options?: any): Promise<string> {
    const fileName = `${Date.now()}-${file.name}`

    if (!this.mockFiles[bucket]) {
      this.mockFiles[bucket] = []
    }

    this.mockFiles[bucket].push(fileName)
    return `https://mock-storage.example.com/${bucket}/${fileName}`
  }

  async deleteFile(bucket: string, filePath: string): Promise<boolean> {
    if (this.mockFiles[bucket]) {
      this.mockFiles[bucket] = this.mockFiles[bucket].filter((file) => !file.includes(filePath))
    }
    return true
  }

  getPublicUrl(bucket: string, filePath: string): string {
    return `https://mock-storage.example.com/${bucket}/${filePath}`
  }

  async listFiles(bucket: string, path?: string): Promise<any[]> {
    return (this.mockFiles[bucket] || []).map((file) => ({
      name: file,
      id: file,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_accessed_at: new Date().toISOString(),
      metadata: {},
      url: `https://mock-storage.example.com/${bucket}/${file}`,
    }))
  }

  async initializeStorage(): Promise<boolean> {
    Object.values(STORAGE_BUCKETS).forEach((bucket) => {
      this.mockFiles[bucket] = []
    })
    return true
  }
}

// Factory to get the appropriate storage implementation
export function getStorageProvider(): StorageInterface {
  switch (ACTIVE_PROVIDER) {
    case StorageProvider.SUPABASE:
      return new SupabaseStorage()
    case StorageProvider.MOCK:
      return new MockStorage()
    case StorageProvider.URL:
    default:
      return new UrlStorage()
  }
}

// Export a singleton instance
const storageProvider = getStorageProvider()
export default storageProvider
