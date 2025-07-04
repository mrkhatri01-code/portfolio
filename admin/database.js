// Supabase configuration
const SUPABASE_URL = "https://aabzcizbrvgzaolmbozw.supabase.co"
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhYnpjaXpicnZnemFvbG1ib3p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0NDAxNjUsImV4cCI6MjA1ODAxNjE2NX0.6nYX20MTA2hMdPYcbR8-Gb5TWgOqiyaIxdniBiZ8XIA"

// Initialize Supabase client
let supabase

// Check if supabase is available in the global scope
if (typeof window.supabase !== "undefined") {
  supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
} else {
  console.error("Supabase client not loaded")
}

// Authentication functions
async function signIn(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return { success: true, user: data.user }
  } catch (error) {
    console.error("Error signing in:", error)
    return { success: false, error: error.message }
  }
}

async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error("Error signing out:", error)
    return { success: false, error: error.message }
  }
}

async function getCurrentUser() {
  try {
    const { data, error } = await supabase.auth.getUser()
    if (error) throw error
    return data.user
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

// Projects functions
async function getProjects() {
  try {
    const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error fetching projects:", error)
    return []
  }
}

async function getProjectById(id) {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select(`
        *,
        project_images(*),
        project_videos(*)
      `)
      .eq("id", id)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error fetching project:", error)
    return null
  }
}

async function createProject(projectData) {
  try {
    const { data, error } = await supabase.from("projects").insert([projectData]).select()

    if (error) throw error
    return { success: true, project: data[0] }
  } catch (error) {
    console.error("Error creating project:", error)
    return { success: false, error: error.message }
  }
}

async function updateProject(id, projectData) {
  try {
    const { data, error } = await supabase.from("projects").update(projectData).eq("id", id).select()

    if (error) throw error
    return { success: true, project: data[0] }
  } catch (error) {
    console.error("Error updating project:", error)
    return { success: false, error: error.message }
  }
}

async function deleteProject(id) {
  try {
    // Get project images to delete from storage
    const { data: images } = await supabase.from("project_images").select("image_url").eq("project_id", id)

    // Delete project (cascade will delete related images and videos)
    const { error } = await supabase.from("projects").delete().eq("id", id)

    if (error) throw error

    // Delete image files from storage
    if (images && images.length > 0) {
      for (const image of images) {
        try {
          // Extract file path from URL
          const urlObj = new URL(image.image_url)
          const filePath = urlObj.pathname.split("/storage/v1/object/public/project-images/")[1]

          if (filePath) {
            await supabase.storage.from("project-images").remove([filePath])
          }
        } catch (error) {
          console.error("Error deleting image file:", error)
          // Continue with other deletions even if one fails
        }
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Error deleting project:", error)
    return { success: false, error: error.message }
  }
}

// Experience functions
async function getExperience() {
  try {
    const { data, error } = await supabase.from("experience").select("*").order("display_order", { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error fetching experience:", error)
    return []
  }
}

async function getExperienceById(id) {
  try {
    const { data, error } = await supabase.from("experience").select("*").eq("id", id).single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error fetching experience:", error)
    return null
  }
}

async function createExperience(experienceData) {
  try {
    // Get current highest display order
    const { data: existingItems } = await supabase
      .from("experience")
      .select("display_order")
      .order("display_order", { ascending: false })
      .limit(1)

    const displayOrder = existingItems && existingItems.length > 0 ? existingItems[0].display_order + 1 : 0
    experienceData.display_order = displayOrder

    const { data, error } = await supabase.from("experience").insert([experienceData]).select()

    if (error) throw error
    return { success: true, experience: data[0] }
  } catch (error) {
    console.error("Error creating experience:", error)
    return { success: false, error: error.message }
  }
}

async function updateExperience(id, experienceData) {
  try {
    const { data, error } = await supabase.from("experience").update(experienceData).eq("id", id).select()

    if (error) throw error
    return { success: true, experience: data[0] }
  } catch (error) {
    console.error("Error updating experience:", error)
    return { success: false, error: error.message }
  }
}

async function deleteExperience(id) {
  try {
    const { error } = await supabase.from("experience").delete().eq("id", id)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error("Error deleting experience:", error)
    return { success: false, error: error.message }
  }
}

// Education functions
async function getEducation() {
  try {
    const { data, error } = await supabase.from("education").select("*").order("display_order", { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error fetching education:", error)
    return []
  }
}

async function getEducationById(id) {
  try {
    const { data, error } = await supabase.from("education").select("*").eq("id", id).single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error fetching education:", error)
    return null
  }
}

async function createEducation(educationData) {
  try {
    // Get current highest display order
    const { data: existingItems } = await supabase
      .from("education")
      .select("display_order")
      .order("display_order", { ascending: false })
      .limit(1)

    const displayOrder = existingItems && existingItems.length > 0 ? existingItems[0].display_order + 1 : 0
    educationData.display_order = displayOrder

    const { data, error } = await supabase.from("education").insert([educationData]).select()

    if (error) throw error
    return { success: true, education: data[0] }
  } catch (error) {
    console.error("Error creating education:", error)
    return { success: false, error: error.message }
  }
}

async function updateEducation(id, educationData) {
  try {
    const { data, error } = await supabase.from("education").update(educationData).eq("id", id).select()

    if (error) throw error
    return { success: true, education: data[0] }
  } catch (error) {
    console.error("Error updating education:", error)
    return { success: false, error: error.message }
  }
}

async function deleteEducation(id) {
  try {
    const { error } = await supabase.from("education").delete().eq("id", id)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error("Error deleting education:", error)
    return { success: false, error: error.message }
  }
}

// Messages functions
async function getMessages() {
  try {
    const { data, error } = await supabase.from("messages").select("*").order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error fetching messages:", error)
    return []
  }
}

async function markMessageAsRead(id, read = true) {
  try {
    const { error } = await supabase.from("messages").update({ read }).eq("id", id)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error("Error updating message:", error)
    return { success: false, error: error.message }
  }
}

async function deleteMessage(id) {
  try {
    const { error } = await supabase.from("messages").delete().eq("id", id)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error("Error deleting message:", error)
    return { success: false, error: error.message }
  }
}

// Settings functions
async function getSettings() {
  try {
    const { data, error } = await supabase.from("settings").select("*").single()

    if (error && !error.message.includes("No rows found")) throw error
    return data || null
  } catch (error) {
    console.error("Error fetching settings:", error)
    return null
  }
}

async function updateSettings(settingsData) {
  try {
    // Get current settings
    const { data: settings } = await supabase.from("settings").select("id").single()

    // Update or insert settings
    let operation
    if (settings) {
      operation = supabase.from("settings").update(settingsData).eq("id", settings.id)
    } else {
      operation = supabase.from("settings").insert([settingsData])
    }

    const { data, error } = await operation.select()

    if (error) throw error
    return { success: true, settings: data[0] }
  } catch (error) {
    console.error("Error updating settings:", error)
    return { success: false, error: error.message }
  }
}

// Storage functions
async function uploadFile(bucket, file) {
  try {
    const fileName = `${Date.now()}-${file.name}`
    const { data, error } = await supabase.storage.from(bucket).upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) throw error

    // Get public URL
    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(fileName)

    return { success: true, url: publicUrlData.publicUrl }
  } catch (error) {
    console.error("Error uploading file:", error)
    return { success: false, error: error.message }
  }
}

// Export all functions
window.db = {
  // Auth
  signIn,
  signOut,
  getCurrentUser,

  // Projects
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,

  // Experience
  getExperience,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience,

  // Education
  getEducation,
  getEducationById,
  createEducation,
  updateEducation,
  deleteEducation,

  // Messages
  getMessages,
  markMessageAsRead,
  deleteMessage,

  // Settings
  getSettings,
  updateSettings,

  // Storage
  uploadFile,
}
