"use server"

import { clientManager } from "@/lib/data-manager"
import { revalidatePath } from "next/cache"

export async function getClients() {
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

export async function getClientById(id: string) {
  try {
    return await clientManager.getById(id)
  } catch (error) {
    console.error(`Error fetching client with ID ${id}:`, error)
    return null
  }
}

export async function createClient(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const logoUrl = formData.get("logo_url") as string
    const websiteUrl = formData.get("website_url") as string
    const instagramUrl = formData.get("instagram_url") as string
    const twitterUrl = formData.get("twitter_url") as string
    const linkedinUrl = formData.get("linkedin_url") as string
    const facebookUrl = formData.get("facebook_url") as string
    const youtubeUrl = formData.get("youtube_url") as string
    const tiktokUrl = formData.get("tiktok_url") as string
    const featured = formData.get("featured") === "on"

    if (!name) {
      return {
        success: false,
        message: "Client name is required",
      }
    }

    const client = await clientManager.create({
      name,
      description: description || null,
      logo_url: logoUrl || null,
      website_url: websiteUrl || null,
      instagram_url: instagramUrl || null,
      twitter_url: twitterUrl || null,
      linkedin_url: linkedinUrl || null,
      facebook_url: facebookUrl || null,
      youtube_url: youtubeUrl || null,
      tiktok_url: tiktokUrl || null,
      featured,
    })

    revalidatePath("/admin/clients")
    revalidatePath("/")
    revalidatePath("/admin/dashboard")

    return {
      success: true,
      message: "Client created successfully",
      client,
    }
  } catch (error) {
    console.error("Error creating client:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred while creating the client",
    }
  }
}

export async function updateClient(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const logoUrl = formData.get("logo_url") as string
    const websiteUrl = formData.get("website_url") as string
    const instagramUrl = formData.get("instagram_url") as string
    const twitterUrl = formData.get("twitter_url") as string
    const linkedinUrl = formData.get("linkedin_url") as string
    const facebookUrl = formData.get("facebook_url") as string
    const youtubeUrl = formData.get("youtube_url") as string
    const tiktokUrl = formData.get("tiktok_url") as string
    const featured = formData.get("featured") === "on"

    if (!name) {
      return {
        success: false,
        message: "Client name is required",
      }
    }

    const client = await clientManager.update(id, {
      name,
      description: description || null,
      logo_url: logoUrl || null,
      website_url: websiteUrl || null,
      instagram_url: instagramUrl || null,
      twitter_url: twitterUrl || null,
      linkedin_url: linkedinUrl || null,
      facebook_url: facebookUrl || null,
      youtube_url: youtubeUrl || null,
      tiktok_url: tiktokUrl || null,
      featured,
    })

    revalidatePath("/admin/clients")
    revalidatePath(`/admin/clients/edit/${id}`)
    revalidatePath("/")
    revalidatePath("/admin/dashboard")

    return {
      success: true,
      message: "Client updated successfully",
      client,
    }
  } catch (error) {
    console.error(`Error updating client with ID ${id}:`, error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred while updating the client",
    }
  }
}

export async function deleteClient(id: string) {
  try {
    await clientManager.delete(id)
    revalidatePath("/admin/clients")
    revalidatePath("/")
    revalidatePath("/admin/dashboard")

    return {
      success: true,
      message: "Client deleted successfully",
    }
  } catch (error) {
    console.error(`Error deleting client with ID ${id}:`, error)
    return {
      success: false,
      message: "Failed to delete client",
    }
  }
}

