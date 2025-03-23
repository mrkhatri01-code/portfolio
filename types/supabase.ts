export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          title: string
          slug: string
          description: string
          category: string
          featured: boolean
          created_at: string
          updated_at: string
          main_image_url?: string | null
          external_url?: string | null
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description: string
          category: string
          featured?: boolean
          created_at?: string
          updated_at?: string
          main_image_url?: string | null
          external_url?: string | null
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string
          category?: string
          featured?: boolean
          created_at?: string
          updated_at?: string
          main_image_url?: string | null
          external_url?: string | null
        }
      }
      project_images: {
        Row: {
          id: string
          project_id: string
          image_url: string
          alt_text: string | null
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          image_url: string
          alt_text?: string | null
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          image_url?: string
          alt_text?: string | null
          display_order?: number
          created_at?: string
        }
      }
      project_videos: {
        Row: {
          id: string
          project_id: string
          youtube_url: string
          title: string | null
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          youtube_url: string
          title?: string | null
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          youtube_url?: string
          title?: string | null
          display_order?: number
          created_at?: string
        }
      }
      education: {
        Row: {
          id: string
          institution: string
          degree: string
          field_of_study: string
          start_date: string
          end_date: string | null
          current: boolean
          description: string | null
          location: string | null
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          institution: string
          degree: string
          field_of_study: string
          start_date: string
          end_date?: string | null
          current?: boolean
          description?: string | null
          location?: string | null
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          institution?: string
          degree?: string
          field_of_study?: string
          start_date?: string
          end_date?: string | null
          current?: boolean
          description?: string | null
          location?: string | null
          display_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      experience: {
        Row: {
          id: string
          company: string
          position: string
          start_date: string
          end_date: string | null
          current: boolean
          description: string | null
          location: string | null
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company: string
          position: string
          start_date: string
          end_date?: string | null
          current?: boolean
          description?: string | null
          location?: string | null
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company?: string
          position?: string
          start_date?: string
          end_date?: string | null
          current?: boolean
          description?: string | null
          location?: string | null
          display_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          name: string
          email: string
          message: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          message: string
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          message?: string
          read?: boolean
          created_at?: string
        }
      }
      settings: {
        Row: {
          id: string
          site_title: string
          site_description: string
          about_text: string | null
          profile_image_url: string | null
          resume_url: string | null
          instagram_url: string | null
          behance_url: string | null
          github_url: string | null
          linkedin_url: string | null
          facebook_url: string | null
          twitter_url: string | null
          discord_url: string | null
          youtube_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          site_title?: string
          site_description?: string
          about_text?: string | null
          profile_image_url?: string | null
          resume_url?: string | null
          instagram_url?: string | null
          behance_url?: string | null
          github_url?: string | null
          linkedin_url?: string | null
          facebook_url?: string | null
          twitter_url?: string | null
          discord_url?: string | null
          youtube_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          site_title?: string
          site_description?: string
          about_text?: string | null
          profile_image_url?: string | null
          resume_url?: string | null
          instagram_url?: string | null
          behance_url?: string | null
          github_url?: string | null
          linkedin_url?: string | null
          facebook_url?: string | null
          twitter_url?: string | null
          discord_url?: string | null
          youtube_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

