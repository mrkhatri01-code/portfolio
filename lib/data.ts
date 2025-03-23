import { projectManager, educationManager, experienceManager, settingsManager, ratingManager } from "@/lib/data-manager"
import { unstable_noStore as noStore } from "next/cache"

// Settings
export async function getSettings() {
  noStore()
  try {
    return await settingsManager.getSettings()
  } catch (error) {
    console.error("Error fetching settings:", error)
    return null
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
        const ratings = await ratingManager.getByProjectId(project.id)
        const averageRating = await ratingManager.getAverageRating(project.id)

        return {
          ...project,
          ratings,
          averageRating,
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
        const ratings = await ratingManager.getByProjectId(project.id)
        const averageRating = await ratingManager.getAverageRating(project.id)

        return {
          ...project,
          ratings,
          averageRating,
        }
      }),
    )

    return projectsWithRatings
  } catch (error) {
    console.error("Error fetching featured projects:", error)
    return []
  }
}

export async function getProjectBySlug(slugOrId: string) {
  noStore()
  try {
    // Try to find by slug first
    let project = await projectManager.getBySlug(slugOrId)

    // If not found by slug, try by ID
    if (!project) {
      project = await projectManager.getById(slugOrId)
    }

    if (!project) {
      return null
    }

    // Get project ratings
    const ratings = await ratingManager.getByProjectId(project.id)
    const averageRating = await ratingManager.getAverageRating(project.id)

    return {
      ...project,
      ratings,
      averageRating,
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

