import { projectManager, educationManager, experienceManager, settingsManager, ratingManager } from "@/lib/data-manager"
import { clientManager } from "@/lib/data-manager/client-manager"
import { unstable_noStore as noStore } from "next/cache"
import { createServerSupabaseClient } from "@/lib/supabase"

// Default settings to use when database is not available
const DEFAULT_SETTINGS = {
  site_title: "My Portfolio",
  site_description: "Showcasing my best work in design, development, and creative projects",
  about_text:
    "I'm a passionate creative professional with expertise in design and development. With years of experience in the industry, I've worked on a variety of projects ranging from web design to brand identity.\n\nMy approach combines technical skills with creative thinking to deliver solutions that are both functional and aesthetically pleasing.",
  profile_image_url: "/profile.png",
  instagram_url: "",
  behance_url: "",
  github_url: "",
  linkedin_url: "",
  facebook_url: "",
  twitter_url: "",
  discord_url: "",
  youtube_url: "",
  tiktok_url: "",
}

// Settings
export async function getSettings() {
  noStore()
  try {
    const settings = await settingsManager.getSettings()
    return settings || DEFAULT_SETTINGS
  } catch (error) {
    console.error("Error fetching settings:", error)
    return DEFAULT_SETTINGS
  }
}

// Projects
export async function getProjects() {
  noStore()
  try {
    const projects = await projectManager.getAll({
      orderBy: "created_at",
      orderDirection: "desc",
    })

    // Add ratings data to each project
    const projectsWithRatings = await Promise.all(
      projects.map(async (project) => {
        try {
          const ratings = await ratingManager.getByProjectId(project.id)
          const averageRating = await ratingManager.getAverageRating(project.id)

          return {
            ...project,
            ratings,
            averageRating,
          }
        } catch (error) {
          console.error(`Error fetching ratings for project ${project.id}:`, error)
          return {
            ...project,
            ratings: [],
            averageRating: null,
          }
        }
      }),
    )

    return projectsWithRatings
  } catch (error) {
    console.error("Error fetching projects:", error)
    return []
  }
}

export async function getFeaturedProjects(limit = 6) {
  noStore()
  try {
    const projects = await projectManager.getFeatured(limit)

    // Add ratings data to each project
    const projectsWithRatings = await Promise.all(
      projects.map(async (project) => {
        try {
          const ratings = await ratingManager.getByProjectId(project.id)
          const averageRating = await ratingManager.getAverageRating(project.id)

          return {
            ...project,
            ratings,
            averageRating,
          }
        } catch (error) {
          console.error(`Error fetching ratings for project ${project.id}:`, error)
          return {
            ...project,
            ratings: [],
            averageRating: null,
          }
        }
      }),
    )

    return projectsWithRatings
  } catch (error) {
    console.error("Error fetching featured projects:", error)
    return []
  }
}

// Clients
export async function getClients() {
  noStore()
  try {
    return await clientManager.getAll({
      orderBy: "name",
      orderDirection: "asc",
    })
  } catch (error) {
    console.error("Error fetching clients:", error)
    return []
  }
}

export async function getFeaturedClients(limit = 8) {
  noStore()
  try {
    return await clientManager.getFeatured(limit)
  } catch (error) {
    console.error("Error fetching featured clients:", error)
    return []
  }
}

export async function getProjectBySlug(slugOrId: string) {
  noStore()
  try {
    // Try to find by slug first
    let project = null

    try {
      project = await projectManager.getBySlug(slugOrId)
    } catch (error) {
      console.error("Error fetching project by slug, trying by ID:", error)
    }

    // If not found by slug, try by ID
    if (!project) {
      try {
        project = await projectManager.getById(slugOrId)
      } catch (error) {
        console.error("Error fetching project by ID:", error)
      }
    }

    if (!project) {
      return null
    }

    // Get project ratings
    let ratings = []
    let averageRating = null

    try {
      ratings = await ratingManager.getByProjectId(project.id)
      averageRating = await ratingManager.getAverageRating(project.id)
    } catch (error) {
      console.error("Error fetching project ratings:", error)
    }

    // Get project videos
    let videos = []

    try {
      const supabase = createServerSupabaseClient()
      const { data, error } = await supabase
        .from("project_videos")
        .select("*")
        .eq("project_id", project.id)
        .order("display_order", { ascending: true })

      if (!error) {
        videos = data || []
      } else {
        console.error("Error fetching project videos:", error)
      }
    } catch (error) {
      console.error("Error fetching project videos:", error)
    }

    // Get project images
    let projectImages = []

    try {
      const supabase = createServerSupabaseClient()
      const { data, error } = await supabase
        .from("project_images")
        .select("*")
        .eq("project_id", project.id)
        .order("display_order", { ascending: true })

      if (!error) {
        projectImages = data || []
      } else {
        console.error("Error fetching project images:", error)
      }
    } catch (error) {
      console.error("Error fetching project images:", error)
    }

    return {
      ...project,
      ratings,
      averageRating,
      videos,
      project_images: projectImages,
    }
  } catch (error) {
    console.error("Error in getProjectBySlug:", error)
    return null
  }
}

// Education
export async function getEducation() {
  noStore()
  try {
    return await educationManager.getOrdered()
  } catch (error) {
    console.error("Error fetching education:", error)
    return []
  }
}

// Experience
export async function getExperience() {
  noStore()
  try {
    return await experienceManager.getOrdered()
  } catch (error) {
    console.error("Error fetching experience:", error)
    return []
  }
}

// Ratings
export async function getProjectRatings(projectId: string) {
  noStore()
  try {
    return await ratingManager.getByProjectId(projectId)
  } catch (error) {
    console.error("Error fetching project ratings:", error)
    return []
  }
}

export async function getProjectAverageRating(projectId: string) {
  noStore()
  try {
    return await ratingManager.getAverageRating(projectId)
  } catch (error) {
    console.error("Error fetching project average rating:", error)
    return null
  }
}
