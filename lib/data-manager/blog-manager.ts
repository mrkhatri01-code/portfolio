import { BaseManager } from "./index"
import { createServerSupabaseClient } from "@/lib/supabase"

export class BlogManager extends BaseManager<any> {
  constructor() {
    super("blogs")
  }

  async getPublished(options?: {
    orderBy?: string
    orderDirection?: "asc" | "desc"
    limit?: number
  }) {
    try {
      const supabase = createServerSupabaseClient()

      let query = supabase.from(this.tableName).select("*").eq("published", true)

      if (options?.orderBy) {
        query = query.order(options.orderBy, {
          ascending: options?.orderDirection !== "desc",
        })
      }

      if (options?.limit) {
        query = query.limit(options.limit)
      }

      const { data, error } = await query

      if (error) {
        console.error("Error fetching published blogs:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Error in getPublished:", error)
      return []
    }
  }

  async getBySlug(slug: string) {
    try {
      const supabase = createServerSupabaseClient()

      const { data, error } = await supabase
        .from(this.tableName)
        .select(`
          *,
          categories:blog_category_relations(
            category:blog_categories(id, name, slug)
          ),
          tags:blog_tag_relations(
            tag:blog_tags(id, name, slug)
          ),
          views:blog_views(view_count)
        `)
        .eq("slug", slug)
        .eq("published", true)
        .single()

      if (error) {
        if (error.code === "PGRST116") {
          return null
        }
        throw error
      }

      return data
    } catch (error) {
      console.error("Error in getBySlug:", error)
      return null
    }
  }

  async getById(id: string) {
    try {
      const supabase = createServerSupabaseClient()

      const { data, error } = await supabase
        .from(this.tableName)
        .select(`
          *,
          categories:blog_category_relations(
            category:blog_categories(id, name, slug)
          ),
          tags:blog_tag_relations(
            tag:blog_tags(id, name, slug)
          ),
          views:blog_views(view_count)
        `)
        .eq("id", id)
        .single()

      if (error) {
        if (error.code === "PGRST116") {
          return null
        }
        throw error
      }

      return data
    } catch (error) {
      console.error("Error in getById:", error)
      return null
    }
  }

  async getByCategory(categorySlug: string, limit?: number) {
    try {
      const supabase = createServerSupabaseClient()

      const { data, error } = await supabase
        .from(this.tableName)
        .select(`
          *,
          categories:blog_category_relations(
            category:blog_categories(id, name, slug)
          ),
          tags:blog_tag_relations(
            tag:blog_tags(id, name, slug)
          )
        `)
        .eq("published", true)
        .order("published_at", { ascending: false })
        .then((result) => {
          if (result.error) return result

          const filtered = result.data?.filter((blog: any) =>
            blog.categories?.some((rel: any) => rel.category?.slug === categorySlug),
          )

          return { data: filtered, error: null }
        })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error in getByCategory:", error)
      return []
    }
  }

  async getByTag(tagSlug: string, limit?: number) {
    try {
      const supabase = createServerSupabaseClient()

      const { data, error } = await supabase
        .from(this.tableName)
        .select(`
          *,
          tags:blog_tag_relations(
            tag:blog_tags(id, name, slug)
          )
        `)
        .eq("published", true)
        .order("published_at", { ascending: false })
        .then((result) => {
          if (result.error) return result

          const filtered = result.data?.filter((blog: any) => blog.tags?.some((rel: any) => rel.tag?.slug === tagSlug))

          return { data: filtered, error: null }
        })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error in getByTag:", error)
      return []
    }
  }

  async incrementViewCount(blogId: string) {
    try {
      const supabase = createServerSupabaseClient()

      // Get current view count
      const { data: viewData } = await supabase.from("blog_views").select("view_count").eq("blog_id", blogId).single()

      if (viewData) {
        // Update existing view count
        await supabase
          .from("blog_views")
          .update({ view_count: (viewData.view_count || 0) + 1, last_viewed_at: new Date().toISOString() })
          .eq("blog_id", blogId)
      } else {
        // Create new view record
        await supabase.from("blog_views").insert([
          {
            blog_id: blogId,
            view_count: 1,
            last_viewed_at: new Date().toISOString(),
          },
        ])
      }
    } catch (error) {
      console.error("Error incrementing view count:", error)
    }
  }
}

export const blogManager = new BlogManager()
