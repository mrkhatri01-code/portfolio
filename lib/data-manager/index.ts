import { createServerSupabaseClient } from "@/lib/supabase"

// Base manager class with common CRUD operations
export class BaseManager<T> {
  protected tableName: string

  constructor(tableName: string) {
    this.tableName = tableName
  }

  async getAll(options?: {
    orderBy?: string
    orderDirection?: "asc" | "desc"
    limit?: number
    filter?: Record<string, any>
  }): Promise<T[]> {
    const supabase = createServerSupabaseClient()

    let query = supabase.from(this.tableName).select("*")

    // Apply filters if provided
    if (options?.filter) {
      Object.entries(options.filter).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
    }

    // Apply ordering if provided
    if (options?.orderBy) {
      query = query.order(options.orderBy, {
        ascending: options?.orderDirection !== "desc",
      })
    }

    // Apply limit if provided
    if (options?.limit) {
      query = query.limit(options.limit)
    }

    const { data, error } = await query

    if (error) {
      console.error(`Error fetching ${this.tableName}:`, error)
      throw error
    }

    return data as T[]
  }

  async getById(id: string): Promise<T | null> {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.from(this.tableName).select("*").eq("id", id).single()

    if (error) {
      if (error.code === "PGRST116") {
        // Record not found
        return null
      }
      console.error(`Error fetching ${this.tableName} by ID:`, error)
      throw error
    }

    return data as T
  }

  async create(data: Partial<T>): Promise<T> {
    const supabase = createServerSupabaseClient()

    const { data: createdData, error } = await supabase.from(this.tableName).insert([data]).select()

    if (error) {
      console.error(`Error creating ${this.tableName}:`, error)
      throw error
    }

    return createdData[0] as T
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const supabase = createServerSupabaseClient()

    const { data: updatedData, error } = await supabase.from(this.tableName).update(data).eq("id", id).select()

    if (error) {
      console.error(`Error updating ${this.tableName}:`, error)
      throw error
    }

    return updatedData[0] as T
  }

  async delete(id: string): Promise<void> {
    const supabase = createServerSupabaseClient()

    const { error } = await supabase.from(this.tableName).delete().eq("id", id)

    if (error) {
      console.error(`Error deleting ${this.tableName}:`, error)
      throw error
    }
  }
}

// Project Manager
export class ProjectManager extends BaseManager<any> {
  constructor() {
    super("projects")
  }

  async getBySlug(slug: string) {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from(this.tableName)
      .select(`
        *,
        project_videos(*),
        project_images(*)
      `)
      .eq("slug", slug)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return null
      }
      console.error("Error fetching project by slug:", error)
      throw error
    }

    return data
  }

  async getFeatured(limit = 6) {
    return this.getAll({
      filter: { featured: true },
      orderBy: "created_at",
      orderDirection: "desc",
      limit,
    })
  }

  async addVideo(projectId: string, youtubeUrl: string, title?: string) {
    const supabase = createServerSupabaseClient()

    // Get current highest display order
    const { data: existingVideos } = await supabase
      .from("project_videos")
      .select("display_order")
      .eq("project_id", projectId)
      .order("display_order", { ascending: false })
      .limit(1)

    const displayOrder = existingVideos && existingVideos.length > 0 ? existingVideos[0].display_order + 1 : 0

    const { data, error } = await supabase
      .from("project_videos")
      .insert([
        {
          project_id: projectId,
          youtube_url: youtubeUrl,
          title: title || null,
          display_order: displayOrder,
        },
      ])
      .select()

    if (error) {
      console.error("Error adding project video:", error)
      throw error
    }

    return data[0]
  }

  async deleteVideo(videoId: string) {
    const supabase = createServerSupabaseClient()

    const { error } = await supabase.from("project_videos").delete().eq("id", videoId)

    if (error) {
      console.error("Error deleting project video:", error)
      throw error
    }
  }

  async addImage(projectId: string, imageUrl: string, altText?: string) {
    const supabase = createServerSupabaseClient()

    // Get current highest display order
    const { data: existingImages } = await supabase
      .from("project_images")
      .select("display_order")
      .eq("project_id", projectId)
      .order("display_order", { ascending: false })
      .limit(1)

    const displayOrder = existingImages && existingImages.length > 0 ? existingImages[0].display_order + 1 : 0

    const { data, error } = await supabase
      .from("project_images")
      .insert([
        {
          project_id: projectId,
          image_url: imageUrl,
          alt_text: altText || null,
          display_order: displayOrder,
        },
      ])
      .select()

    if (error) {
      console.error("Error adding project image:", error)
      throw error
    }

    return data[0]
  }

  async deleteImage(imageId: string) {
    const supabase = createServerSupabaseClient()

    const { error } = await supabase.from("project_images").delete().eq("id", imageId)

    if (error) {
      console.error("Error deleting project image:", error)
      throw error
    }
  }
}

// Education Manager
export class EducationManager extends BaseManager<any> {
  constructor() {
    super("education")
  }

  async getOrdered() {
    return this.getAll({
      orderBy: "display_order",
      orderDirection: "asc",
    })
  }

  async updateOrder(id: string, newOrder: number) {
    return this.update(id, { display_order: newOrder })
  }
}

// Experience Manager
export class ExperienceManager extends BaseManager<any> {
  constructor() {
    super("experience")
  }

  async getOrdered() {
    return this.getAll({
      orderBy: "display_order",
      orderDirection: "asc",
    })
  }

  async updateOrder(id: string, newOrder: number) {
    return this.update(id, { display_order: newOrder })
  }
}

// Message Manager
export class MessageManager extends BaseManager<any> {
  constructor() {
    super("messages")
  }

  async getUnread() {
    return this.getAll({
      filter: { read: false },
      orderBy: "created_at",
      orderDirection: "desc",
    })
  }

  async markAsRead(id: string, read = true) {
    return this.update(id, { read })
  }
}

// Settings Manager
export class SettingsManager extends BaseManager<any> {
  constructor() {
    super("settings")
  }

  async getSettings() {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.from(this.tableName).select("*").maybeSingle()

    if (error && !error.message.includes("No rows found")) {
      console.error("Error fetching settings:", error)
      throw error
    }

    return data || null
  }

  async updateSettings(settings: any) {
    const supabase = createServerSupabaseClient()

    // Get current settings
    const { data: existingSettings } = await supabase.from(this.tableName).select("id").maybeSingle()

    let result

    if (existingSettings) {
      // Update existing settings
      const { data, error } = await supabase
        .from(this.tableName)
        .update(settings)
        .eq("id", existingSettings.id)
        .select()

      if (error) {
        console.error("Error updating settings:", error)
        throw error
      }

      result = data[0]
    } else {
      // Create new settings
      const { data, error } = await supabase.from(this.tableName).insert([settings]).select()

      if (error) {
        console.error("Error creating settings:", error)
        throw error
      }

      result = data[0]
    }

    return result
  }
}

// Ratings Manager
export class RatingManager extends BaseManager<any> {
  constructor() {
    super("project_ratings")
  }

  async getByProjectId(projectId: string) {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching project ratings:", error)
      throw error
    }

    return data
  }

  async getAverageRating(projectId: string) {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from(this.tableName)
      .select("rating")
      .eq("project_id", projectId)
      .eq("verified", true) // Only count verified ratings

    if (error) {
      console.error("Error fetching project ratings:", error)
      throw error
    }

    if (!data || data.length === 0) {
      return null
    }

    const sum = data.reduce((acc, curr) => acc + curr.rating, 0)
    return sum / data.length
  }

  async getAllWithProjects() {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from(this.tableName)
      .select(`
        *,
        project:project_id(title, slug)
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching ratings with projects:", error)
      throw error
    }

    return data
  }
}

// Create instances of managers
export const projectManager = new ProjectManager()
export const educationManager = new EducationManager()
export const experienceManager = new ExperienceManager()
export const messageManager = new MessageManager()
export const settingsManager = new SettingsManager()
export const ratingManager = new RatingManager()

